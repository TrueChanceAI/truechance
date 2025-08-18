import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { requireAuth, createUnauthorizedResponse } from "@/lib/auth-middleware";
import { createRateLimiter } from "@/lib/validation";

// Function to extract skills from resume text using Gemini
async function extractSkillsFromResume(resumeText: string): Promise<string | null> {
  try {
    const prompt = `Extract all technical skills, programming languages, tools, frameworks, and technologies from this resume text. 
    
    Return ONLY a comma-separated list of skills without any additional text, formatting, or explanations.
    
    Examples of expected output:
    - python, sql, javascript, react, docker, aws
    - java, spring boot, mysql, git, kubernetes, jenkins
    - c++, matlab, arduino, mechatronics, robotics, python
    
    Resume text:
    ${resumeText}
    
    Skills:`;

    const { text: skills } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt,
    });
    
    console.log("✅ Skills extracted:", skills);
    return skills.trim();
  } catch (error) {
    console.error('❌ Error extracting skills:', error);
    return null;
  }
}

// Rate limiter: 15 requests per 15 minutes per IP
const rateLimiter = createRateLimiter(15, 15 * 60 * 1000);

export async function POST(req: NextRequest) {
  try {
    // Authentication check
    const authResult = await requireAuth(req);
    if (!authResult.user) {
      return createUnauthorizedResponse(authResult.error || "Authentication required");
    }
    
    // Rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!rateLimiter(clientIP)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const {
      transcript,
      feedback,
      candidateName,
      duration,
      tone,
      language,
      userId,
      interviewId,
      email,
      resumeFile,
      resumeFileName,
      resumeFileType,
      resumeText
    } = await req.json();

    // Validate request body
    if (!req.body) {
      return NextResponse.json({ error: "Request body is required" }, { status: 400 });
    }

    // Validate transcript length to prevent abuse
    if (transcript && (typeof transcript !== 'string' || transcript.length > 100000)) {
      return NextResponse.json({ 
        error: "Transcript too long. Maximum 100,000 characters allowed." 
      }, { status: 400 });
    }

    // Debug: Log what we received
    console.log("🔍 Received request data:", {
      interviewId: interviewId,
      interviewIdType: typeof interviewId,
      email: email,
      candidateName: candidateName,
      hasTranscript: !!transcript,
      hasFeedback: !!feedback
    });

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Upload resume file to Supabase storage bucket if provided
    let resumeFilePath = null;
    if (resumeFile) {
      try {
        // Validate base64 string
        if (typeof resumeFile !== 'string' || resumeFile.length < 100) {
          throw new Error("Invalid or too small base64 file data");
        }
        
        // Convert base64 string to buffer
        const buffer = Buffer.from(resumeFile, 'base64');
        
        // Validate buffer size (should be at least 1KB for a resume)
        if (buffer.length < 1024) {
          throw new Error(`File too small: ${buffer.length} bytes`);
        }
        
        console.log("📁 File upload details:", {
          originalName: resumeFileName,
          contentType: resumeFileType,
          bufferSize: buffer.length,
          base64Length: resumeFile.length
        });
        
        // Generate unique filename with original extension
        const fileExtension = resumeFileName ? resumeFileName.split('.').pop() : 'pdf';
        const uniqueFileName = `resume_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;

        // Upload to Supabase storage
        const { error: uploadError } = await supabase
          .storage
          .from('cvs')
          .upload(uniqueFileName, buffer, {
            contentType: resumeFileType || 'application/pdf',
            upsert: true
          });

        if (uploadError) {
          throw uploadError;
        }

        // Store the file path
        resumeFilePath = uniqueFileName;
        
        console.log("✅ Resume file uploaded successfully:", {
          fileName: uniqueFileName,
          size: buffer.length,
          path: resumeFilePath
        });
      } catch (uploadError) {
        console.error("❌ Error uploading resume file:", uploadError);
      }
    }
    
    // Extract skills from resume text ONLY for new records
    let extractedSkills = null;
    // We'll only extract skills if we're creating a new record
    // For existing records, we'll preserve the original skills
    
    // Make request to Supabase using fetch (Edge-safe approach)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    // For now, use localhost for development. In production, set NEXT_PUBLIC_APP_URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Always try to find and update the most recent record with the same email
    let existingRecordId = null;
    let existingRecord = null;

    console.log("🔍 Looking for existing record with email:", email);

    if (email) {
      try {
        // First, let's test if we can find ANY records with this email
        console.log("🧪 Testing database connection - searching for ANY records with email:", email);
        const testQueryUrl = `${supabaseUrl}/rest/v1/interviews?Email=eq.${encodeURIComponent(email)}&select=id,interview_id,Email,created_at&limit=5`;
        console.log("🧪 Test query URL:", testQueryUrl);
        
        const testResponse = await fetch(testQueryUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
          }
        });
        
        if (testResponse.ok) {
          const testRecords = await testResponse.json();
          console.log("🧪 Test query found records:", testRecords.length);
          console.log("🧪 Test records:", JSON.stringify(testRecords, null, 2));
        } else {
          console.log("🧪 Test query failed:", testResponse.status, testResponse.statusText);
        }
        
        // Now proceed with the actual search
        // First try to find record with the same interview_id
        if (interviewId && interviewId.startsWith('initial_')) {
          console.log("🔍 Looking for record with interview_id:", interviewId);
          console.log("🔍 interviewId type:", typeof interviewId, "value:", interviewId);
          const queryUrl = `${supabaseUrl}/rest/v1/interviews?interview_id=eq.${encodeURIComponent(interviewId)}&select=id,"CV/Resume",skills,conducted_interview,created_at`;
          console.log("🔍 Query URL for finding record by interview_id:", queryUrl);
          
          const checkResponse = await fetch(queryUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${supabaseKey}`,
              'apikey': supabaseKey,
            }
          });
          
          if (checkResponse.ok) {
            const records = await checkResponse.json();
            console.log("🔍 Records found with interview_id:", records);
            console.log("🔍 Raw response from Supabase:", JSON.stringify(records, null, 2));
            console.log("🔍 Response status:", checkResponse.status, checkResponse.statusText);
            console.log("🔍 Response headers:", Object.fromEntries(checkResponse.headers.entries()));
            
            if (records && records.length > 0) {
              existingRecord = records[0];
              existingRecordId = existingRecord.id;
              console.log("✅ Found existing record by interview_id:", existingRecordId);
              console.log("📁 Existing record details:", {
                hasResume: !!existingRecord["CV/Resume"],
                hasSkills: !!existingRecord.skills,
                conductedInterview: existingRecord.conducted_interview,
                created_at: existingRecord.created_at
              });
            } else {
              console.log("❌ No records found with interview_id:", interviewId);
              console.log("❌ This means the interview_id search failed completely");
            }
          } else {
            console.log("❌ Check response not ok for interview_id search:", checkResponse.status, checkResponse.statusText);
            // Try to get error details
            try {
              const errorText = await checkResponse.text();
              console.log("❌ Error response body:", errorText);
            } catch (e) {
              console.log("❌ Could not read error response body");
            }
          }
        }
        
        // If no record found by interview_id, fall back to email-based search
        if (!existingRecord) {
          console.log("🔍 No record found by interview_id, searching by email...");
          // Exclude the current interview_id to avoid finding the record we're trying to update
          const queryUrl = interviewId 
            ? `${supabaseUrl}/rest/v1/interviews?Email=eq.${encodeURIComponent(email)}&interview_id=neq.${encodeURIComponent(interviewId)}&select=id,"CV/Resume",skills,conducted_interview&order=created_at.desc&limit=1`
            : `${supabaseUrl}/rest/v1/interviews?Email=eq.${encodeURIComponent(email)}&select=id,"CV/Resume",skills,conducted_interview&order=created_at.desc&limit=1`;
          console.log("🔍 Query URL for finding existing record by email:", queryUrl);
          
          const checkResponse = await fetch(queryUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${supabaseKey}`,
              'apikey': supabaseKey,
            }
          });
          
          console.log("🔍 Check response status:", checkResponse.status, checkResponse.statusText);
          
          if (checkResponse.ok) {
            const records = await checkResponse.json();
            console.log("🔍 Records found with email:", records);
            console.log("🔍 Raw email search response:", JSON.stringify(records, null, 2));
            
            if (records && records.length > 0) {
              existingRecord = records[0]; // Get the most recent one
              existingRecordId = existingRecord.id;
              console.log("✅ Found existing record to update:", existingRecordId);
              console.log("📁 Existing record details:", {
                hasResume: !!existingRecord["CV/Resume"],
                hasSkills: !!existingRecord.skills,
                conductedInterview: existingRecord.conducted_interview,
                created_at: existingRecord.created_at
              });
            } else {
              console.log("ℹ️ No existing records found with email:", email);
            }
          } else {
            console.log("❌ Check response not ok for email search:", checkResponse.status, checkResponse.statusText);
            // Try to get error details
            try {
              const errorText = await checkResponse.text();
              console.log("❌ Error response body:", errorText);
            } catch (e) {
              console.log("❌ Could not read error response body");
            }
          }
        }
      } catch (error) {
        console.error("❌ Error finding existing record:", error);
      }
    } else {
      console.log("⚠️ No email provided, cannot find existing records");
    }
    
    // Ensure existingRecord is defined even if email check failed
    if (!existingRecord) {
      existingRecord = null;
    }
    
    const supabaseData: any = {
      interview_id: interviewId,
      user_id: userId,
      candidate_name: candidateName,
      duration: duration,
      language: language || 'en',
      transcript: transcript,
      feedback: feedback,
      tone: tone,
      "Email": email, // Correct column name
      conducted_interview: 'conducted' // Update flag to conducted when interview is completed
    };
    
    // If updating existing record, preserve the resume file and skills
    if (existingRecord) {
      // Preserve existing resume file and skills
      supabaseData["CV/Resume"] = existingRecord["CV/Resume"];
      supabaseData.skills = existingRecord.skills;
      console.log("🔄 Preserving existing resume file and skills from initial upload");
      console.log("🔒 Skills preserved (unchanged):", existingRecord.skills);
      
      // If the existing record is already 'conducted', we're updating it again
      if (existingRecord.conducted_interview === 'conducted') {
        console.log("⚠️ Found existing record that's already 'conducted', updating it anyway");
      }
    } else {
      // Only set resume file and skills for new records
      // Ensure clean URL concatenation without double slashes
      const baseUrl = appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl;
      supabaseData["CV/Resume"] = resumeFilePath ? `${baseUrl}/api/cv-preview?file=${encodeURIComponent(resumeFilePath)}` : null;
      
      // Extract skills ONLY for new records
      console.log("🆕 Creating NEW record - extracting skills from resume text");
      if (resumeText) {
        try {
          extractedSkills = await extractSkillsFromResume(resumeText);
          console.log("✅ Skills extracted for NEW record:", extractedSkills);
          if (extractedSkills) {
            supabaseData.skills = extractedSkills;
          }
        } catch (skillsError) {
          console.error("❌ Error extracting skills for new record:", skillsError);
        }
      } else {
        console.log("⚠️ No resume text provided for new record");
      }
    }
    
    console.log("📊 Final Supabase data structure:", {
      hasSkillsText: !!supabaseData.skills,
      skillsTextType: typeof supabaseData.skills,
      skillsValue: supabaseData.skills || "None",
      resumeUrl: supabaseData["CV/Resume"] || "None",
      conductedInterview: supabaseData.conducted_interview,
      existingRecordId,
      isUpdate: !!existingRecordId,
      preservedResume: existingRecord ? "Yes" : "No",
      preservedSkills: existingRecord ? "Yes" : "No",
      note: existingRecordId ? "Updating existing record (preserving resume & skills)" : "Creating new record"
    });

    console.log("🔍 Duplicate check summary:", {
      email: email,
      foundExistingRecord: !!existingRecord,
      existingRecordId: existingRecordId,
      willUpdate: !!existingRecordId,
      willCreate: !existingRecordId,
      reason: existingRecordId ? "Found existing record to update" : "No existing record found, creating new one"
    });
    
    // Log the exact data being sent
    console.log("📤 Sending to Supabase:", JSON.stringify(supabaseData, null, 2));
    
    // Use PATCH if updating existing record, POST if creating new one
    const method = existingRecordId ? 'PATCH' : 'POST';
    const url = existingRecordId 
      ? `${supabaseUrl}/rest/v1/interviews?id=eq.${existingRecordId}`
      : `${supabaseUrl}/rest/v1/interviews`;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(supabaseData)
    });
    
    if (response.ok) {
      console.log("✅ Interview data saved to Supabase successfully");
      return NextResponse.json({ success: true });
    } else {
      let errorData = "Unknown error";
      try {
        errorData = await response.text();
        console.error("❌ Supabase error response:", errorData);
      } catch (parseError) {
        console.error("❌ Could not parse error response:", parseError);
        errorData = `Status: ${response.status}, StatusText: ${response.statusText}`;
      }
      
      return NextResponse.json({ 
        success: false, 
        error: `Supabase error: ${response.status} - ${errorData}` 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error("❌ Error saving interview data:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
