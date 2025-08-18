"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// Helper function to convert Kinde ID to UUID format
function convertKindeIdToUuid(kindeId: string): string {
  try {
    // Remove the 'kp_' prefix and convert to UUID format
    const cleanId = kindeId.replace('kp_', '');
    
    // Ensure we have a valid 32-character hex string
    if (cleanId.length !== 32) {
      throw new Error(`Invalid Kinde ID format: expected 32 characters after 'kp_', got ${cleanId.length}`);
    }
    
    // Validate that it's a valid hex string
    if (!/^[0-9a-f]{32}$/i.test(cleanId)) {
      throw new Error('Invalid Kinde ID format: not a valid hex string');
    }
    
    // Format as UUID: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    // Note: We're setting version 4 and variant 1 as per UUID spec
    const uuid = `${cleanId.slice(0, 8)}-${cleanId.slice(8, 12)}-4${cleanId.slice(13, 16)}-${cleanId.slice(16, 20)}-${cleanId.slice(20)}`;
    
    console.log(`Converted Kinde ID "${kindeId}" to UUID "${uuid}"`);
    return uuid;
  } catch (error) {
    console.error('Error converting Kinde ID to UUID:', error);
    throw new Error(`Failed to convert Kinde ID "${kindeId}" to UUID: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Test function to verify UUID conversion
export async function testKindeIdConversion(kindeId: string): Promise<string> {
  return convertKindeIdToUuid(kindeId);
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function updateUserProfile(userId: string, data: { first_name: string; last_name: string; email: string }) {
  try {
    console.log('Updating profile for user ID:', userId);
    
    // Validate Supabase connection
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    let finalId: string;
    
    try {
      // Try to convert Kinde ID to UUID format
      finalId = convertKindeIdToUuid(userId);
      console.log('Converted UUID:', finalId);
    } catch (conversionError) {
      console.warn('UUID conversion failed, using original ID:', conversionError);
      // Fallback to using the original Kinde ID
      finalId = userId;
    }
    
    const { error } = await supabase
      .from('users')
      .upsert({
        id: finalId,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
      }, {
        onConflict: 'id'
      });

    if (error) {
      console.error('Supabase error updating profile:', error);
      throw new Error(error.message);
    }

    console.log('Profile updated successfully');
    
    // Revalidate the profile page to show updated data
    revalidatePath('/profile');
    
    return { success: true };
  } catch (error) {
    console.error('Profile update failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update profile' 
    };
  }
}

export async function getUserProfile(userId: string) {
  try {
    console.log('Fetching profile for user ID:', userId);
    
    // Validate Supabase connection
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    let finalId: string;
    
    try {
      // Try to convert Kinde ID to UUID format
      finalId = convertKindeIdToUuid(userId);
      console.log('Converted UUID:', finalId);
    } catch (conversionError) {
      console.warn('UUID conversion failed, using original ID:', conversionError);
      // Fallback to using the original Kinde ID
      finalId = userId;
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('first_name, last_name')
      .eq('id', finalId)
      .single();

    if (error) {
      console.error('Supabase error fetching profile:', error);
      return null;
    }

    console.log('Profile data fetched:', data);
    return data;
  } catch (error) {
    console.error('Profile fetch failed:', error);
    return null;
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}
