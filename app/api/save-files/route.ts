import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { validateEmail, validateName, validateLanguage, validateResumeText, createRateLimiter } from "@/lib/validation";
import { requireAuth, requireOwnership, createUnauthorizedResponse, createForbiddenResponse } from "@/lib/auth-middleware";

// Rate limiter: 30 requests per 15 minutes per IP
const rateLimiter = createRateLimiter(30, 15 * 60 * 1000);

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

    // Validate request body
    if (!req.body) {
      return NextResponse.json({ error: "Request body is required" }, { status: 400 });
    }

    const { 
      email,
      resumeFile,
      resumeFileName,
      resumeFileType,
      resumeText,
      candidateName,
      language,
      authenticatedUserEmail
    } = await req.json();

    // Debug: Log authentication details
    console.log("🔐 Authentication details:", {
      jwtUserEmail: authResult.user.email,
      requestEmail: email,
      authenticatedUserEmail: authenticatedUserEmail,
      emailsMatch: authenticatedUserEmail === email
    });

    // Verify user owns this resource (can only save data for their own email)
    if (!requireOwnership(authenticatedUserEmail, email)) {
      console.log("❌ Ownership check failed:", {
        userEmail: authenticatedUserEmail,
        requestEmail: email
      });
      return createForbiddenResponse("You can only save data for your own email address");
    }

    // Debug: Log what we received
    console.log("🔍 Raw data received:", {
      email: email ? `${email.substring(0, 10)}...` : 'undefined',
      candidateName: candidateName ? `${candidateName.substring(0, 20)}...` : 'undefined',
      language: language,
      resumeText: resumeText ? `${resumeText.substring(0, 50)}...` : 'undefined',
      resumeTextLength: resumeText ? resumeText.length : 0
    });

    // Validate all inputs
    const emailValidation = validateEmail(email);
    const nameValidation = validateName(candidateName);
    const languageValidation = validateLanguage(language);
    const resumeTextValidation = resumeText ? validateResumeText(resumeText) : { isValid: true, errors: [], sanitizedData: resumeText };

    // Debug: Log validation results
    console.log("🔍 Validation results:", {
      email: { isValid: emailValidation.isValid, errors: emailValidation.errors },
      name: { isValid: nameValidation.isValid, errors: nameValidation.errors },
      language: { isValid: languageValidation.isValid, errors: languageValidation.errors },
      resumeText: { isValid: resumeTextValidation.isValid, errors: resumeTextValidation.errors }
    });

    // Check for validation errors
    const allErrors = [
      ...emailValidation.errors,
      ...nameValidation.errors,
      ...languageValidation.errors,
      ...resumeTextValidation.errors
    ];

    if (allErrors.length > 0) {
      console.log("❌ Validation failed with errors:", allErrors);
      return NextResponse.json(
        { error: "Validation failed", details: allErrors },
        { status: 400 }
      );
    }

    // Use sanitized data
    const sanitizedEmail = emailValidation.sanitizedData;
    const sanitizedName = nameValidation.sanitizedData;
    const sanitizedLanguage = languageValidation.sanitizedData;
    const sanitizedResumeText = resumeTextValidation.sanitizedData;
    
    console.log("📊 Received validated data for Supabase:", {
      email: sanitizedEmail ? "Present" : "Missing",
      hasResume: !!resumeFile,
      fileName: resumeFileName,
      fileType: resumeFileType,
      fileSize: resumeFile ? Math.round(resumeFile.length * 0.75) : 0,
      hasResumeText: !!sanitizedResumeText,
      candidateName: sanitizedName,
      language: sanitizedLanguage
    });
    
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Upload resume file to Supabase storage bucket
    let resumeFilePath = null;
    let signedUrl = null;
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

        // Store the file path and generate direct signed URL
        resumeFilePath = uniqueFileName;
        
        // Generate a direct signed URL for immediate access
        const { data: signedUrlData, error: signedUrlError } = await supabase
          .storage
          .from('cvs')
          .createSignedUrl(uniqueFileName, 3600); // 1 hour expiry
        
        if (signedUrlError) {
          console.error("❌ Error generating initial signed URL:", signedUrlError);
        } else {
          console.log("✅ Initial signed URL generated:", signedUrlData.signedUrl);
          signedUrl = signedUrlData.signedUrl;
        }
        
        console.log("✅ Resume file uploaded successfully:", {
          fileName: uniqueFileName,
          size: buffer.length,
          path: resumeFilePath,
          signedUrl: signedUrl || "Failed to generate"
        });
      } catch (uploadError) {
        console.error("❌ Error uploading resume file:", uploadError);
      }
    }
    
    // Extract skills from resume text
    let extractedSkills = null;
    if (resumeText) {
      try {
        // Extract skills as comma-separated list
        extractedSkills = await extractSkillsFromResume(resumeText);
        console.log("✅ Skills extracted from resume:", extractedSkills);
      } catch (skillsError) {
        console.error("❌ Error extracting skills:", skillsError);
      }
    }
    
    // Make request to Supabase using fetch (Edge-safe approach)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    // For now, use localhost for development. In production, set NEXT_PUBLIC_APP_URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const supabaseData: any = {
      interview_id: `initial_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      user_id: 'anonymous',
      candidate_name: sanitizedName || 'Unknown',
      duration: 'N/A',
      language: sanitizedLanguage || 'en',
      transcript: 'Interview not started',
      feedback: 'Interview not conducted',
      tone: null,
      "Email": sanitizedEmail,
      // Ensure clean URL concatenation without double slashes
              "CV/Resume": resumeFilePath ? `${appUrl.replace(/\/$/, '')}/api/cv-preview?file=${encodeURIComponent(resumeFilePath)}` : null,
      conducted_interview: 'not_conducted' // Add the flag column
    };
    
    // Add skills as text
    if (extractedSkills) {
      supabaseData.skills = extractedSkills;
      console.log("✅ Skills text added to Supabase data");
    }
    
    console.log("📊 Final Supabase data structure:", {
      hasSkillsText: !!supabaseData.skills,
      skillsTextType: typeof supabaseData.skills,
      resumeUrl: supabaseData["CV/Resume"] || "None",
      conductedInterview: supabaseData.conducted_interview,
      note: "Initial data saved - interview not yet conducted"
    });
    
    // Log the exact data being sent
    console.log("📤 Sending to Supabase:", JSON.stringify(supabaseData, null, 2));
    
    const response = await fetch(`${supabaseUrl}/rest/v1/interviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(supabaseData)
    });
    
    if (response.ok) {
      console.log("✅ Initial data saved to Supabase successfully");
      // Return the interview_id so the frontend can store it
      return NextResponse.json({ 
        success: true, 
        interview_id: supabaseData.interview_id 
      });
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
    console.error("❌ Error saving initial data:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
} 