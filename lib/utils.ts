import { interviewCovers, mappings } from "@/constants";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to get signed URL for resume files
export async function getResumeSignedUrl(
  filePath: string
): Promise<string | null> {
  try {
    const response = await fetch("/api/get-resume-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.signedUrl;
    } else {
      console.error("Failed to get signed URL:", await response.text());
      return null;
    }
  } catch (error) {
    console.error("Error getting signed URL:", error);
    return null;
  }
}

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings];
};

const checkIconExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok; // Returns true if the icon exists
  } catch {
    return false;
  }
};

export const getTechLogos = async (techArray: string[]) => {
  const logoURLs = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    };
  });

  const results = await Promise.all(
    logoURLs.map(async ({ tech, url }) => ({
      tech,
      url: (await checkIconExists(url)) ? url : "/tech.svg",
    }))
  );

  return results;
};

export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};

// -------- PDF Generation --------
import dayjs from "dayjs";

export type AnyInterview = any;

const loadJsPdf = async (): Promise<any> => {
  if ((window as any).jspdf?.jsPDF) return (window as any).jspdf.jsPDF;
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load jsPDF"));
    document.body.appendChild(script);
  });
  return (window as any).jspdf.jsPDF;
};

const titleCase = (text: string) =>
  text
    .replace(/_/g, " ")
    .split(" ")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");

const dedupeSkills = (skills?: string): string[] => {
  if (!skills) return [];
  const items = skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const seen = new Set<string>();
  const result: string[] = [];
  for (const s of items) {
    const key = s.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(s);
    }
  }
  return result;
};

export const generateInterviewPdf = async (
  interview: AnyInterview,
  options?: { includeFeedback?: boolean; filenamePrefix?: string }
) => {
  const jsPDF = await loadJsPdf();

  // Detect language and set RTL support
  const isRTL = interview?.language === "ar";
  const doc = new jsPDF({
    unit: "pt",
    format: "a4",
    orientation: isRTL ? "landscape" : "portrait", // Use landscape for RTL to accommodate text better
  });

  // Layout constants - adjust for RTL
  const page = {
    width: doc.internal.pageSize.getWidth(),
    height: doc.internal.pageSize.getHeight(),
  };
  const margin = {
    x: isRTL ? page.width - 56 : 56, // Right margin for RTL, left for LTR
    y: 64,
  };
  const contentWidth = page.width - margin.x * 2;
  let y = margin.y;

  // Spacing scale
  const spacing = {
    row: 22,
    small: 10,
    medium: 16,
    large: 28,
    sectionTop: 14,
    sectionBottom: 26,
    footer: 22,
    feedbackGap: 10,
  } as const;

  // Palette
  const color = {
    text: 20,
    subtle: 120,
    primary: { r: 99, g: 102, b: 241 },
    chipBg: { r: 243, g: 244, b: 246 },
    chipText: 33,
    successBg: { r: 220, g: 252, b: 231 },
    successText: { r: 22, g: 101, b: 52 },
    warnBg: { r: 254, g: 249, b: 195 },
    warnText: { r: 133, g: 77, b: 14 },
  };

  const ensureSpace = (needed = 80) => {
    if (y + needed > page.height - margin.y) {
      doc.addPage();
      y = margin.y;
    }
  };

  const sectionTitle = (text: string) => {
    // Ensure space for heading + bottom padding (no divider)
    ensureSpace(spacing.sectionTop + spacing.medium + spacing.sectionBottom);
    // top padding
    y += spacing.sectionTop;
    // heading text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(color.text);

    if (isRTL) {
      // For RTL, align text to the right
      const textWidth = doc.getTextWidth(text);
      doc.text(text, margin.x - textWidth, y);
    } else {
      doc.text(text, margin.x, y);
    }

    // bottom padding after heading
    y += spacing.sectionBottom;
  };

  const heading = (text: string) => {
    ensureSpace(spacing.large);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(color.text);

    if (isRTL) {
      const textWidth = doc.getTextWidth(text);
      doc.text(text, margin.x - textWidth, y);
    } else {
      doc.text(text, margin.x, y);
    }

    y += spacing.large;
  };

  const subtext = (text: string) => {
    ensureSpace(spacing.medium);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(color.subtle);

    if (isRTL) {
      const textWidth = doc.getTextWidth(text);
      doc.text(text, margin.x - textWidth, y);
    } else {
      doc.text(text, margin.x, y);
    }

    doc.setTextColor(color.text);
    y += spacing.medium;
  };

  const labelValueRows = (
    rows: { label: string; value: string }[],
    columns = 2
  ) => {
    const colWidth = contentWidth / columns;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    let pendingHalfRow = false;
    rows.forEach((row, i) => {
      const col = i % columns;
      if (col === 0) ensureSpace(spacing.row);

      let x, labelX, valueX;
      if (isRTL) {
        // RTL layout: right to left
        x = margin.x - col * colWidth;
        labelX = x - 110;
        valueX = x;
      } else {
        // LTR layout: left to right
        x = margin.x + col * colWidth;
        labelX = x;
        valueX = x + 110;
      }

      doc.setTextColor(color.subtle);
      doc.text(`${row.label}:`, labelX, y);
      doc.setTextColor(color.text);
      doc.text(row.value || "-", valueX, y);
      pendingHalfRow = col === 0;
      if (col === columns - 1) {
        y += spacing.row;
        pendingHalfRow = false;
      }
    });
    if (pendingHalfRow) y += spacing.row;
  };

  const badge = (text: string, type: "success" | "warn") => {
    const paddingX = 10;
    const height = 22;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    const textWidth = doc.getTextWidth(text);
    const width = textWidth + paddingX * 2;
    ensureSpace(height + spacing.small);

    let badgeX = margin.x;
    if (isRTL) {
      badgeX = margin.x - width;
    }

    if (type === "success") {
      doc.setFillColor(color.successBg.r, color.successBg.g, color.successBg.b);
      doc.setTextColor(
        color.successText.r,
        color.successText.g,
        color.successText.b
      );
    } else {
      doc.setFillColor(color.warnBg.r, color.warnBg.g, color.warnBg.b);
      doc.setTextColor(color.warnText.r, color.warnText.g, color.warnText.b);
    }
    doc.roundedRect(badgeX, y - 14, width, height, 6, 6, "F");
    doc.text(text, badgeX + paddingX, y - 14 + height / 2 + 3);
    doc.setTextColor(color.text);
    y += height + spacing.small;
  };

  const paragraph = (text: string) => {
    const maxWidth = contentWidth;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(text || "-", maxWidth);
    lines.forEach((ln: string) => {
      ensureSpace(spacing.row);

      if (isRTL) {
        const textWidth = doc.getTextWidth(ln);
        doc.text(ln, margin.x - textWidth, y);
      } else {
        doc.text(ln, margin.x, y);
      }

      y += 14;
    });
    y += spacing.small;
  };

  const chips = (items: string[]) => {
    if (!items.length) return;
    const padX = 10;
    const h = 22;
    const chipGapX = 8;
    const chipGapY = 10;

    let x = isRTL ? margin.x : margin.x;
    ensureSpace(h + chipGapY);

    items.forEach((txt) => {
      const w = doc.getTextWidth(txt) + padX * 2;

      if (isRTL) {
        if (x - w < margin.x - contentWidth) {
          x = margin.x;
          y += h + chipGapY;
          ensureSpace(h + chipGapY);
        }
        doc.setFillColor(color.chipBg.r, color.chipBg.g, color.chipBg.b);
        doc.setDrawColor(230);
        doc.setLineWidth(0.8);
        doc.roundedRect(x - w, y - 14, w, h, 10, 10, "FD");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(color.chipText);
        doc.text(txt, x - w + padX, y + 2);
        x -= w + chipGapX;
      } else {
        if (x + w > margin.x + contentWidth) {
          x = margin.x;
          y += h + chipGapY;
          ensureSpace(h + chipGapY);
        }
        doc.setFillColor(color.chipBg.r, color.chipBg.g, color.chipBg.b);
        doc.setDrawColor(230);
        doc.setLineWidth(0.8);
        doc.roundedRect(x, y - 14, w, h, 10, 10, "FD");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(color.chipText);
        doc.text(txt, x + padX, y + 2);
        x += w + chipGapX;
      }
    });
    y += h + chipGapY;
    doc.setTextColor(color.text);
  };

  // Header
  const reportTitle = isRTL
    ? `تقرير المقابلة – ${interview?.candidate_name ?? "المرشح"}`
    : `Interview Report – ${interview?.candidate_name ?? "Candidate"}`;
  heading(reportTitle);

  const generatedText = isRTL
    ? `تم إنشاؤه في ${dayjs().format("MMM D, YYYY h:mm A")}`
    : `Generated on ${dayjs().format("MMM D, YYYY h:mm A")}`;
  subtext(generatedText);

  // Meta section
  const overviewTitle = isRTL ? "نظرة عامة" : "Overview";
  sectionTitle(overviewTitle);

  const isConducted = Boolean(interview?.is_conducted);
  const overviewRows = [
    {
      label: isRTL ? "المرشح" : "Candidate",
      value: interview?.candidate_name ?? (isRTL ? "-" : "-"),
    },
    {
      label: isRTL ? "تاريخ الإنشاء" : "Created",
      value: interview?.created_at
        ? dayjs(interview.created_at).format("MMM D, YYYY h:mm A")
        : isRTL
        ? "غير متوفر"
        : "N/A",
    },
    {
      label: isRTL ? "اللغة" : "Language",
      value:
        interview?.language === "ar"
          ? isRTL
            ? "العربية"
            : "Arabic"
          : interview?.language || (isRTL ? "الإنجليزية" : "English"),
    },
  ];
  labelValueRows(overviewRows, 2);

  const completedText = isRTL ? "مكتمل" : "Completed";
  const notConductedText = isRTL ? "لم يتم إجراؤها" : "Not Conducted";
  badge(
    isConducted ? completedText : notConductedText,
    isConducted ? "success" : "warn"
  );

  // Skills section
  const skills = dedupeSkills(interview?.skills);
  if (skills.length > 0) {
    const skillsTitle = isRTL ? "المهارات والتقنيات" : "Skills & Technologies";
    sectionTitle(skillsTitle);
    chips(skills);
  }

  // Feedback
  if (options?.includeFeedback !== false && interview?.feedback) {
    const feedbackTitle = isRTL ? "التقييم" : "Feedback";
    sectionTitle(feedbackTitle);
    const entries = Object.entries(
      interview.feedback as Record<string, unknown>
    );
    entries.forEach(([key, value]) => {
      const t = titleCase(key);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      ensureSpace(spacing.row + spacing.feedbackGap);

      if (isRTL) {
        const textWidth = doc.getTextWidth(t);
        doc.text(t, margin.x - textWidth, y);
      } else {
        doc.text(t, margin.x, y);
      }

      y += spacing.feedbackGap + 6;
      paragraph(String(value ?? ""));
    });
  }

  // Footer with page number
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(color.subtle);
    const footer = isRTL
      ? `الصفحة ${i} من ${pageCount}`
      : `Page ${i} of ${pageCount}`;

    if (isRTL) {
      const footerWidth = doc.getTextWidth(footer);
      doc.text(footer, margin.x - footerWidth, page.height - spacing.footer);
    } else {
      doc.text(
        footer,
        page.width - margin.x - doc.getTextWidth(footer),
        page.height - spacing.footer
      );
    }
  }

  const defaultPrefix = isRTL ? "مقابلة" : "Interview";
  const reportText = isRTL ? "تقرير" : "Report";
  const filename = `${
    options?.filenamePrefix ?? defaultPrefix
  }_${reportText}_${(
    interview?.candidate_name ?? (isRTL ? "المرشح" : "Candidate")
  )
    .replace(/\s+/g, "_")
    .replace(/__+/g, "_")}.pdf`;
  doc.save(filename);
};
