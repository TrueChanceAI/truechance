import { createUnauthorizedResponse, requireAuth } from "@/lib/auth-middleware";
import { supabaseServer } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
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

    const { data: interviews, error: interviews_error } = await supabaseServer
      .from("interviews")
      .select("*")
      .eq("user_id", userId);

    if (interviews_error) {
      return NextResponse.json(
        { error: "Failed to fetch interviews" },
        { status: 500 }
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

    const normalized = (interviews || []).map((it) => ({
      ...it,
      interview_questions: normalize(it?.interview_questions) || [],
    }));

    return NextResponse.json({ interviews: normalized });
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
