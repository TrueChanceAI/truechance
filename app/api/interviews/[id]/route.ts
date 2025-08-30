import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { requireAuth, createUnauthorizedResponse } from "@/lib/auth-middleware";
import { sendInterviewReportEmail } from "@/lib/mail";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

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

    const { data: user, error } = await supabaseServer
      .from("app_users")
      .select(
        "id, first_name, last_name, email, phone_number, is_email_verified"
      )
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch user profile" },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { data: interview, error: interview_error } = await supabaseServer
      .from("interviews")
      .select("*")
      .eq("id", id)
      .single();

    if (interview_error) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    if (interview.user_id !== userId) {
      return NextResponse.json(
        { error: "You are not authorized to access this interview" },
        { status: 403 }
      );
    }

    // Normalize interview_questions to a clean array of strings
    const normalize = (raw: any): string[] | null => {
      if (!raw) return null;
      const strip = (s: string) => {
        let t = s.trim();
        if (t.startsWith('"') && t.endsWith('"')) t = t.slice(1, -1);
        if (t.endsWith(",")) t = t.slice(0, -1);
        return t.trim();
      };

      try {
        if (typeof raw === "string") {
          const s = raw.trim();
          if (s.startsWith("[")) {
            const parsed = JSON.parse(s);
            if (Array.isArray(parsed)) {
              return parsed
                .filter((q) => typeof q === "string")
                .map((q: string) => q.trim());
            }
          }
          const lines = s.split("\n");
          return lines
            .filter(
              (ln) =>
                ln.trim() !== "```" &&
                ln.trim() !== "```json" &&
                ln.trim() !== "[" &&
                ln.trim() !== "]"
            )
            .map(strip)
            .filter(Boolean);
        }

        if (Array.isArray(raw)) {
          const joined = raw.join("\n");
          const cleanedJoined = joined
            .replace(/```json/g, "")
            .replace(/```/g, "");
          const start = cleanedJoined.indexOf("[");
          const end = cleanedJoined.lastIndexOf("]");
          if (start !== -1 && end !== -1 && end > start) {
            const inside = cleanedJoined.slice(start, end + 1);
            try {
              const parsed = JSON.parse(inside);
              if (Array.isArray(parsed)) {
                return parsed
                  .filter((q) => typeof q === "string")
                  .map((q: string) => q.trim());
              }
            } catch {}
          }
          return raw
            .filter((ln: unknown) => typeof ln === "string")
            .map((ln: string) => ln.trim())
            .filter(
              (ln: string) =>
                ln !== "```" && ln !== "```json" && ln !== "[" && ln !== "]"
            )
            .map(strip)
            .filter(Boolean);
        }
      } catch {}
      return null;
    };

    const normalized = {
      ...interview,
      interview_questions: normalize(interview?.interview_questions) || [],
    };

    return NextResponse.json({ interview: normalized });
  } catch (error) {
    console.error("❌ Error saving interview data:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      transcript,
      feedback,
      duration,
      tone,
      last_session_end,
      total_time_spent_minutes,
    } = body;

    const authResult = await requireAuth(req);
    if (!authResult.user) {
      return createUnauthorizedResponse(
        authResult.error || "Authentication required"
      );
    }

    // check if interview exists
    const { data: interview, error: interview_error } = await supabaseServer
      .from("interviews")
      .select("*")
      .eq("id", id)
      .single();

    if (interview_error) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    if (interview.user_id !== authResult.user.id) {
      return NextResponse.json(
        { error: "You are not authorized to update this interview" },
        { status: 403 }
      );
    }

    // Calculate cumulative time if session data is provided
    let updateData: any = {
      transcript,
      feedback,
      duration,
      tone,
    };

    if (last_session_end && total_time_spent_minutes !== undefined) {
      const currentTotalTime = interview.total_time_spent_minutes || 0;
      const newTotalTime = currentTotalTime + total_time_spent_minutes;

      updateData = {
        ...updateData,
        last_session_end,
        total_time_spent_minutes: newTotalTime,
      };

      console.log(
        `📊 Updating cumulative time: ${currentTotalTime} + ${total_time_spent_minutes} = ${newTotalTime} minutes`
      );
    }

    const { error } = await supabaseServer
      .from("interviews")
      .update(updateData)
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to update interview" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error saving interview data:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

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

    const { data: interview, error: interview_error } = await supabaseServer
      .from("interviews")
      .select("*")
      .eq("id", id)
      .single();

    if (interview_error) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    if (interview.user_id !== userId) {
      return NextResponse.json(
        { error: "You are not authorized to update this interview" },
        { status: 403 }
      );
    }

    if (interview.is_conducted) {
      return NextResponse.json(
        { error: "Interview already conducted" },
        { status: 400 }
      );
    }

    const { error } = await supabaseServer
      .from("interviews")
      .update({
        is_conducted: true,
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to update interview" },
        { status: 500 }
      );
    }

    // Send email report if interview is now conducted
    try {
      // Get user email from app_users table
      const { data: user, error: userError } = await supabaseServer
        .from("app_users")
        .select("email")
        .eq("id", userId)
        .single();

      if (!userError && user?.email) {
        // Wait for feedback to be available with retry mechanism
        let updatedInterview: any;
        const maxRetries = 10;
        let retryCount = 0;

        while (!updatedInterview && retryCount < maxRetries) {
          const { data: interview, error: fetchError } = await supabaseServer
            .from("interviews")
            .select("*")
            .eq("id", id)
            .single();

          if (!fetchError && interview) {
            console.log(
              `🔄 Retry ${retryCount + 1}: Checking for feedback data...`
            );
            console.log(
              `📊 Interview feedback keys:`,
              Object.keys(interview.feedback || {})
            );

            // Check if feedback is available and has meaningful content
            if (
              interview.feedback &&
              Object.keys(interview.feedback).length > 0 &&
              interview.feedback.raw !== "Could not generate feedback."
            ) {
              updatedInterview = interview;
              console.log("✅ Feedback data found and is valid");
              break;
            } else {
              console.log("⏳ Feedback not ready yet, waiting...");
              // Wait before retrying
              await new Promise((resolve) => setTimeout(resolve, 1000));
              retryCount++;
            }
          } else {
            console.log(
              `❌ Error fetching interview data on retry ${retryCount + 1}:`,
              fetchError
            );
            retryCount++;
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }

        if (updatedInterview) {
          await sendInterviewReportEmail(user.email, updatedInterview);
          console.log("✅ Interview report email sent successfully");
        } else {
          // Fallback: send email with current data even if feedback isn't ready
          console.log(
            "⚠️ Feedback not available after retries, sending email with current data"
          );
          const { data: fallbackInterview } = await supabaseServer
            .from("interviews")
            .select("*")
            .eq("id", id)
            .single();

          if (fallbackInterview) {
            await sendInterviewReportEmail(user.email, fallbackInterview);
            console.log("✅ Interview report email sent with fallback data");
          }
        }
      }
    } catch (emailError) {
      console.error("❌ Error sending interview report email:", emailError);
      // Don't fail the main request if email fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error updating interview data:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
