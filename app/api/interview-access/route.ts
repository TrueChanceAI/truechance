import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { requireAuth, createUnauthorizedResponse } from "@/lib/auth-middleware";

export async function POST(req: NextRequest) {
  try {
    const { interviewId } = await req.json();

    if (!interviewId) {
      return NextResponse.json(
        { error: "Interview ID is required" },
        { status: 400 }
      );
    }

    const authResult = await requireAuth(req);
    if (!authResult.user) {
      return createUnauthorizedResponse(
        authResult.error || "Authentication required"
      );
    }

    const userId = authResult.user.id;
    if (!userId || userId === "unknown") {
      return createUnauthorizedResponse("Invalid token subject");
    }

    // Fetch the interview
    const { data: interview, error: interviewError } = await supabaseServer
      .from("interviews")
      .select("*")
      .eq("id", interviewId)
      .single();

    if (interviewError || !interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    // Check if user owns this interview
    if (interview.user_id !== userId) {
      return NextResponse.json(
        { error: "You are not authorized to access this interview" },
        { status: 403 }
      );
    }

    // Check if interview is already conducted
    if (interview.is_conducted) {
      return NextResponse.json(
        {
          error: "Interview already completed",
          canAccess: false,
          reason: "completed",
        },
        { status: 400 }
      );
    }

    // Check payment status
    if (interview.payment_status !== "completed") {
      return NextResponse.json(
        {
          error: "Payment required",
          canAccess: false,
          reason: "payment_required",
        },
        { status: 400 }
      );
    }

    const now = new Date();
    const maxAllowedMinutes = interview.max_allowed_minutes || 45; // Default 45 minutes
    const totalTimeSpent = interview.total_time_spent_minutes || 0;
    const sessionCount = interview.session_count || 0;

    // Security Measure 1: Check if interview started but not completed within 10 minutes
    if (interview.last_session_start && !interview.last_session_end) {
      const lastStartTime = new Date(interview.last_session_start);
      const timeSinceStart =
        (now.getTime() - lastStartTime.getTime()) / (1000 * 60); // minutes

      if (timeSinceStart > 10) {
        return NextResponse.json(
          {
            error:
              "Interview session expired. You can only restart within 10 minutes of starting.",
            canAccess: false,
            reason: "session_expired",
            timeSinceStart: Math.round(timeSinceStart),
            maxRestartTime: 10,
          },
          { status: 400 }
        );
      }
    }

    // NEW SECURITY RULE: Session-based time restrictions
    const nextSessionNumber = sessionCount + 1;

    if (nextSessionNumber <= 2) {
      // First 2 sessions: Can use up to 45 minutes total
      if (totalTimeSpent >= maxAllowedMinutes) {
        return NextResponse.json(
          {
            error: `Maximum interview time (${maxAllowedMinutes} minutes) reached. You cannot start another session.`,
            canAccess: false,
            reason: "time_limit_reached",
            totalTimeSpent,
            maxAllowedMinutes,
            sessionNumber: nextSessionNumber,
          },
          { status: 400 }
        );
      }
    } else {
      // 3rd session and beyond: Only allowed if total time ≤ 15 minutes
      if (totalTimeSpent > 15) {
        return NextResponse.json(
          {
            error: `Session ${nextSessionNumber} not allowed. You can only start additional sessions if total time spent is 15 minutes or less. Current time spent: ${totalTimeSpent} minutes.`,
            canAccess: false,
            reason: "session_limit_exceeded",
            totalTimeSpent,
            maxAllowedMinutes: 15,
            sessionNumber: nextSessionNumber,
            allowedSessions: 2,
          },
          { status: 400 }
        );
      }
    }

    // Calculate remaining time based on session rules
    let remainingTime;
    let maxSessionTime;

    if (nextSessionNumber <= 2) {
      // First 2 sessions: Can use remaining time up to 45 minutes
      remainingTime = maxAllowedMinutes - totalTimeSpent;
      maxSessionTime = remainingTime;
    } else {
      // 3rd session and beyond: Limited to 15 minutes total
      remainingTime = 15 - totalTimeSpent;
      maxSessionTime = Math.min(remainingTime, 5); // Cap individual session at 5 minutes for 3rd+ sessions
    }

    // Session guidance based on new rules
    let sessionRecommendation = null;
    let warningMessage = null;

    if (nextSessionNumber <= 2) {
      // First 2 sessions guidance
      if (remainingTime <= 5) {
        sessionRecommendation = {
          maxRecommendedDuration: remainingTime,
          message: `Session ${nextSessionNumber}: Only ${remainingTime} minute${
            remainingTime !== 1 ? "s" : ""
          } remaining. Use time wisely.`,
        };
        warningMessage =
          "This will be your final session if you use all remaining time.";
      } else {
        sessionRecommendation = {
          maxRecommendedDuration: Math.min(remainingTime, 20),
          message: `Session ${nextSessionNumber}: ${remainingTime} minutes remaining. You can use up to ${remainingTime} minutes in this session.`,
        };
        warningMessage = `You have ${2 - nextSessionNumber} more session${
          2 - nextSessionNumber !== 1 ? "s" : ""
        } with full time access.`;
      }
    } else {
      // 3rd+ sessions guidance
      if (remainingTime <= 0) {
        return NextResponse.json(
          {
            error: `No time remaining for session ${nextSessionNumber}. You can only start additional sessions if total time spent is 15 minutes or less.`,
            canAccess: false,
            reason: "no_time_remaining",
            totalTimeSpent,
            maxAllowedMinutes: 15,
            sessionNumber: nextSessionNumber,
          },
          { status: 400 }
        );
      }

      sessionRecommendation = {
        maxRecommendedDuration: maxSessionTime,
        message: `Session ${nextSessionNumber}: ${remainingTime} minutes remaining. Maximum ${maxSessionTime} minutes per session.`,
      };
      warningMessage =
        "Additional sessions are limited to 15 minutes total time spent.";
    }

    // Update session tracking
    const { error: updateError } = await supabaseServer
      .from("interviews")
      .update({
        last_session_start: now.toISOString(),
        session_count: sessionCount + 1,
      })
      .eq("id", interviewId);

    if (updateError) {
      console.error("Error updating session tracking:", updateError);
      // Continue anyway, don't block the interview
    }

    return NextResponse.json({
      success: true,
      canAccess: true,
      interview: {
        id: interview.id,
        candidate_name: interview.candidate_name,
        language: interview.language,
        interview_questions: interview.interview_questions,
        total_time_spent_minutes: totalTimeSpent,
        remaining_time_minutes: remainingTime,
        session_count: nextSessionNumber,
        max_allowed_minutes: nextSessionNumber <= 2 ? maxAllowedMinutes : 15,
        sessionRecommendation,
        warningMessage,
        sessionNumber: nextSessionNumber,
        maxSessionTime,
      },
    });
  } catch (error) {
    console.error("❌ Error validating interview access:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
