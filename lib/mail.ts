import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT
  ? parseInt(process.env.SMTP_PORT, 10)
  : 587;
const mailSender = process.env.MAIL_SENDER;
const smtpPass = process.env.SMTP_PASS;

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;
  if (!smtpHost || !mailSender || !smtpPass) {
    throw new Error(
      "SMTP configuration missing. Please set SMTP_HOST, SMTP_USER, SMTP_PASS."
    );
  }
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: mailSender,
      pass: smtpPass,
    },
  });
  return transporter;
}

export async function sendEmail(params: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}): Promise<void> {
  const tx = getTransporter();
  await tx.sendMail({
    from: mailSender,
    to: params.to,
    subject: params.subject,
    text: params.text,
    html: params.html,
  });
}

export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  const subject = "Your TrueChance verification code";
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Verify your email</h2>
      <p>Your verification code is:</p>
      <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
      <p>This code will expire soon. If you didn't request this, please ignore this email.</p>
    </div>
  `;
  const text = `Your verification code is: ${otp}`;
  await sendEmail({ to, subject, html, text });
}

export async function sendInterviewFeedbackReport(
  interview: any,
  userEmail: string
): Promise<void> {
  const subject = `🎉 Interview Report - ${interview.candidate_name}`;

  // Detect language and set RTL support
  const isRTL = interview?.language === "ar";
  const dir = isRTL ? "rtl" : "ltr";
  const textAlign = isRTL ? "right" : "left";
  const fontFamily = isRTL
    ? "'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    : "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

  const formatDate = (dateString: string) => {
    if (isRTL) {
      // Arabic date format
      return new Date(dateString).toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFeedback = (feedback: any) => {
    if (!feedback || typeof feedback !== "object") return "";

    return Object.entries(feedback)
      .map(([key, value]) => {
        const formattedKey = key
          .replace(/_/g, " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        return `
          <tr>
            <td style="padding: 16px 0; border-bottom: 1px solid #e5e7eb; text-align: ${textAlign};">
              <strong style="color: #1f2937; font-size: 16px; font-weight: 600;">${formattedKey}</strong>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 0 20px 0; color: #4b5563; line-height: 1.7; font-size: 15px; text-align: ${textAlign};">
              ${value}
            </td>
          </tr>
        `;
      })
      .join("");
  };

  const formatSkills = (skills: string) => {
    if (!skills) return "None specified";

    const skillArray = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (skillArray.length === 0) return "None specified";

    return skillArray
      .map(
        (skill) =>
          `<span style="display: inline-block; background: #f3f4f6; color: #374151; padding: 6px 14px; margin: 3px; border-radius: 25px; font-size: 14px; font-weight: 500; border: 1px solid #e5e7eb; text-align: center;">${skill}</span>`
      )
      .join("");
  };

  const html = `
    <!DOCTYPE html>
    <html lang="${interview?.language || "en"}" dir="${dir}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Interview Report - ${interview.candidate_name}</title>
      <style>
        body { 
          font-family: ${fontFamily}; 
          line-height: 1.6; 
          color: #374151; 
          margin: 0; 
          padding: 0; 
          background-color: #f9fafb;
          direction: ${dir};
          text-align: ${textAlign};
        }
        .email-container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: #ffffff; 
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          padding: 40px 30px; 
          text-align: center; 
          border-radius: 8px 8px 0 0;
        }
        .header h1 { 
          color: white; 
          margin: 0; 
          font-size: 28px; 
          font-weight: 700; 
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header p { 
          color: rgba(255,255,255,0.95); 
          margin: 12px 0 0 0; 
          font-size: 16px; 
          font-weight: 400;
        }
        .content { 
          padding: 40px 30px; 
        }
        .section { 
          margin-bottom: 40px; 
        }
        .section-title { 
          color: #1f2937; 
          font-size: 20px; 
          font-weight: 700; 
          margin-bottom: 24px; 
          padding-bottom: 12px; 
          border-bottom: 3px solid #e5e7eb; 
          position: relative;
          text-align: ${textAlign};
        }
        .section-title::after {
          content: '';
          position: absolute;
          bottom: -3px;
          ${isRTL ? "right: 0;" : "left: 0;"}
          width: 60px;
          height: 3px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .info-grid { 
          display: table; 
          width: 100%; 
          border-collapse: collapse; 
        }
        .info-row { 
          display: table-row; 
        }
        .info-label { 
          display: table-cell; 
          padding: 12px 0; 
          font-weight: 600; 
          color: #374151; 
          width: 130px; 
          vertical-align: top;
          text-align: ${textAlign};
        }
        .info-value { 
          display: table-cell; 
          padding: 12px 0; 
          color: #6b7280; 
          vertical-align: top;
          text-align: ${textAlign};
        }
        .status-badge { 
          display: inline-block; 
          background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
          color: white; 
          padding: 8px 18px; 
          border-radius: 25px; 
          font-size: 14px; 
          font-weight: 600; 
          box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
        }
        .skills-container { 
          margin-top: 16px; 
          text-align: ${textAlign};
        }
        .feedback-table { 
          width: 100%; 
          border-collapse: collapse; 
        }
        .footer { 
          background: #f9fafb; 
          padding: 30px; 
          text-align: center; 
          color: #6b7280; 
          border-top: 1px solid #e5e7eb;
        }
        .logo { 
          font-size: 26px; 
          font-weight: 800; 
          color: #667eea; 
          margin-bottom: 12px; 
          letter-spacing: -0.5px;
        }

        @media only screen and (max-width: 600px) {
          .content { padding: 30px 20px; }
          .header { padding: 30px 20px; }
          .header h1 { font-size: 24px; }
          .section-title { font-size: 18px; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🎉 ${isRTL ? "تم إكمال المقابلة!" : "Interview Completed!"}</h1>
          <p>${
            isRTL
              ? "تقرير المقابلة الشامل جاهز"
              : "Your comprehensive interview report is ready"
          }</p>
        </div>
        
        <div class="content">
          <div class="section">
            <h2 class="section-title">📋 ${
              isRTL ? "نظرة عامة على المقابلة" : "Interview Overview"
            }</h2>
            <div class="info-grid">
              <div class="info-row">
                <div class="info-label">${
                  isRTL ? "المرشح:" : "Candidate:"
                }</div>
                <div class="info-value">${interview.candidate_name}</div>
              </div>
              <div class="info-row">
                <div class="info-label">${isRTL ? "التاريخ:" : "Date:"}</div>
                <div class="info-value">${formatDate(
                  interview.created_at
                )}</div>
              </div>
              <div class="info-row">
                <div class="info-label">${isRTL ? "المدة:" : "Duration:"}</div>
                <div class="info-value">${interview.duration || "N/A"}</div>
              </div>
              <div class="info-row">
                <div class="info-label">${isRTL ? "اللغة:" : "Language:"}</div>
                <div class="info-value">${
                  interview.language === "ar"
                    ? "العربية"
                    : interview.language || "English"
                }</div>
              </div>
              <div class="info-row">
                <div class="info-label">${isRTL ? "الحالة:" : "Status:"}</div>
                <div class="info-value">
                  <span class="status-badge">✅ ${
                    isRTL ? "مكتمل" : "Completed"
                  }</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2 class="section-title">🛠️ ${
              isRTL ? "المهارات والتقنيات" : "Skills & Technologies"
            }</h2>
            <div class="skills-container">
              ${formatSkills(interview.skills)}
            </div>
          </div>
          
          <div class="section">
            <h2 class="section-title">📝 ${
              isRTL ? "تقييم المقابلة" : "Interview Feedback"
            }</h2>
            <table class="feedback-table">
              ${formatFeedback(interview.feedback)}
            </table>
          </div>
        </div>
        
        <div class="footer">
          <div class="logo">TrueChance</div>
          <p style="margin: 8px 0; font-weight: 500;">
            ${
              isRTL
                ? "شكراً لاستخدام TrueChance في مقابلتك!"
                : "Thank you for using TrueChance for your interview!"
            }
          </p>
          <p style="margin: 20px 0 0 0; font-size: 12px; color: #9ca3af;">
            ${
              isRTL
                ? "تم إنشاء هذا التقرير تلقائياً بعد إكمال المقابلة.<br>لأي أسئلة، يرجى الاتصال بفريق الدعم."
                : "This report was automatically generated after your interview completion.<br>For any questions, please contact our support team."
            }
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
${isRTL ? "تقرير المقابلة" : "Interview Report"} - ${interview.candidate_name}

${isRTL ? "نظرة عامة على المقابلة:" : "Interview Overview:"}
- ${isRTL ? "المرشح" : "Candidate"}: ${interview.candidate_name}
- ${isRTL ? "التاريخ" : "Date"}: ${formatDate(interview.created_at)}
- ${isRTL ? "المدة" : "Duration"}: ${interview.duration || "N/A"}
- ${isRTL ? "اللغة" : "Language"}: ${
    interview.language === "ar" ? "العربية" : interview.language || "English"
  }
- ${isRTL ? "الحالة" : "Status"}: ${isRTL ? "مكتمل" : "Completed"}

${isRTL ? "المهارات والتقنيات:" : "Skills & Technologies:"}
${
  interview.skills
    ? interview.skills
        .split(",")
        .map((s: string) => s.trim())
        .join(", ")
    : isRTL
    ? "غير محدد"
    : "None specified"
}

${isRTL ? "تقييم المقابلة:" : "Interview Feedback:"}
${
  interview.feedback
    ? Object.entries(interview.feedback)
        .map(
          ([key, value]) =>
            `${key
              .replace(/_/g, " ")
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}: ${value}`
        )
        .join("\n\n")
    : isRTL
    ? "لا يوجد تقييم متاح"
    : "No feedback available"
}

${isRTL ? "شكراً لاستخدام TrueChance!" : "Thank you for using TrueChance!"}
  `;

  await sendEmail({
    to: userEmail,
    subject,
    html,
    text,
  });
}
