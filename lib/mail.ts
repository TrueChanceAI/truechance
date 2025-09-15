import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPass = process.env.SMTP_PASS;
const mailSender = process.env.MAIL_SENDER;

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!smtpHost || !mailSender || !smtpPass) {
    throw new Error("SMTP configuration is missing");
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: 587,
      secure: false,
      auth: {
        user: mailSender,
        pass: smtpPass,
      },
    });
  }

  return transporter;
}

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const tx = getTransporter();
  await tx.sendMail({
    from: mailSender,
    ...params,
  });
}

export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  const subject = "Verify your email - TrueChance";
  const html = `
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify your email - TrueChance</title>
      <style>
        body { 
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif; 
          line-height: 1.6; 
          color: #374151; 
          margin: 0; 
          padding: 0; 
          background-color: #f9fafb;
        }
        .email-container { 
          max-width: 500px; 
          margin: 0 auto; 
          background: #ffffff; 
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border-radius: 12px;
          overflow: hidden;
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          padding: 40px 30px; 
          text-align: center; 
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
          text-align: center;
        }
        .otp-container {
          background: #f8fafc;
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          padding: 30px;
          margin: 30px 0;
        }
        .otp-code {
          font-size: 36px;
          font-weight: 700;
          color: #1e293b;
          letter-spacing: 8px;
          margin: 0;
          font-family: 'Courier New', monospace;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .otp-label {
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .instructions {
          color: #475569;
          font-size: 16px;
          line-height: 1.6;
          margin: 20px 0;
        }
        .warning {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 16px;
          margin: 25px 0;
          color: #92400e;
          font-size: 14px;
        }
        .footer { 
          background: #f8fafc; 
          padding: 30px; 
          text-align: center; 
          color: #64748b; 
          border-top: 1px solid #e2e8f0;
        }
        .logo { 
          font-size: 24px; 
          font-weight: 800; 
          color: #667eea; 
          margin-bottom: 8px; 
          letter-spacing: -0.5px;
        }
        .website-link {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          margin-top: 20px;
          transition: all 0.2s ease;
        }
        .website-link:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
          margin: 25px 0;
        }

        @media only screen and (max-width: 600px) {
          .content { padding: 30px 20px; }
          .header { padding: 30px 20px; }
          .header h1 { font-size: 24px; }
          .otp-code { font-size: 28px; letter-spacing: 6px; }
          .footer { padding: 25px 20px; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🔐 Verify Your Email</h1>
          <p>Complete your TrueChance account setup</p>
        </div>
        
        <div class="content">
          <p class="instructions">
            Welcome to TrueChance! To complete your account setup and start your interview journey, please verify your email address using the code below:
          </p>
          
          <div class="otp-container">
            <div class="otp-label">Your Verification Code</div>
            <div class="otp-code">${otp}</div>
          </div>
          
          <div class="divider"></div>
          
          <p style="color: #64748b; font-size: 14px; margin: 0;">
            Having trouble? You can also copy and paste this code: <strong>${otp}</strong>
          </p>
        </div>
        
        <div class="footer">
          <div class="logo">TrueChance</div>
          <p style="margin: 8px 0; font-weight: 500; color: #475569;">
            Your gateway to successful interviews
          </p>
          <p style="margin: 20px 0 0 0; font-size: 12px; color: #9ca3af;">
            This verification code was automatically generated for your account.<br>
            For any questions, please contact our support team.
          </p>
          
          <!-- Website Link -->
          <div style="margin: 25px 0 0 0; padding: 20px; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0;">
            <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 600; color: #374151;">
              🔗 Ready to get started?
            </p>
            <p style="margin: 0 0 15px 0; font-size: 13px; color: #6b7280;">
              Once verified, you can access your account and start your interview journey:
            </p>
            <a href="https://www.true-chance.com" class="website-link">
              Open TrueChance
            </a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
TrueChance - Email Verification

Welcome to TrueChance! 

To complete your account setup, please use this verification code:

${otp}

Enter this code in the verification form to activate your account. This code will expire in 10 minutes.

If you didn't request this verification code, please ignore this email.

Ready to get started? Visit: https://www.true-chance.com

Thank you for choosing TrueChance!
Your gateway to successful interviews

---
This verification code was automatically generated for your account.
For any questions, please contact our support team.
  `;

  await sendEmail({ to, subject, html, text });
}

export async function sendInterviewReportEmail(
  userEmail: string,
  interview: any
): Promise<void> {
  const isRTL = interview?.language === "ar";
  const dir = isRTL ? "rtl" : "ltr";
  const textAlign = isRTL ? "right" : "left";
  const fontFamily = isRTL
    ? '"Cairo", "Host Grotesk", "Inter", "Poppins", "Roboto Mono", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
    : 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';

  const subject = isRTL
    ? `تقرير المقابلة - ${interview.candidate_name}`
    : `Interview Report - ${interview.candidate_name}`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
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
    const none = isRTL ? "غير محدد" : "None specified";
    if (!skills) return none;

    const skillArray = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!skillArray.length) return none;

    return (
      skillArray
        .map((skill) => {
          // allow breaks after common separators (/, _, -)
          const safe = skill.replace(/([/_-])/g, "$1&#8203;");

          return `<span style="
          display:inline-block;
          background:#f3f4f6;
          color:#374151;
          padding:6px 12px;
          margin:4px 4px 0 0;
          border-radius:16px;
          font-size:12px;
          font-weight:500;
          border:1px solid #e5e7eb;
          line-height:1.3;
          white-space:normal;
          max-width:100%;
          overflow-wrap:break-word;
          word-break:break-word;
          vertical-align:top;
        ">${safe}</span>`;
        })
        // include a space to ensure some clients see a break opportunity between pills
        .join(" ")
    );
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
          left: ${isRTL ? "auto" : "0"};
          right: ${isRTL ? "0" : "auto"};
          width: 60px;
          height: 3px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .info-grid { 
          display: grid; 
          grid-template-columns: 1fr; 
          gap: 16px; 
          margin-bottom: 24px;
        }
        .info-row { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          padding: 12px 0; 
          border-bottom: 1px solid #f3f4f6;
        }
        .info-label { 
          font-weight: 600; 
          color: #6b7280; 
          font-size: 14px;
        }
        .info-value { 
          font-weight: 500; 
          color: #1f2937; 
          font-size: 14px;
        }
        .status-badge { 
          background: #10b981; 
          color: white; 
          padding: 4px 12px; 
          border-radius: 20px; 
          font-size: 12px; 
          font-weight: 500;
        }
        .skills-container {
          max-width: 100%;
          margin-top: 16px;
        }
        .feedback-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 16px;
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
            <div class="skills-container"
     style="display:block; max-width:100%; margin-top:16px;">
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
          <!-- Website Link -->
          <div style="margin: 25px 0 0 0; padding: 15px; background: #f3f4f6; border-radius: 8px; border: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 600; color: #374151;">
              ${isRTL ? "🔗 الوصول إلى الموقع" : "🔗 Access Your Account"}
            </p>
            <p style="margin: 0 0 15px 0; font-size: 13px; color: #6b7280;">
              ${
                isRTL
                  ? "إذا أغلقت التبويب، يمكنك الوصول إلى حسابك وتقارير المقابلات من خلال الموقع:"
                  : "You can access your account and interview reports through our website:"
              }
            </p>
            <a href="https://www.true-chance.com" style="display: inline-block; background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px;">
              ${isRTL ? "فتح TrueChance" : "Open TrueChance"}
            </a>
          </div>
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

${
  isRTL
    ? "🔗 الوصول إلى الموقع: إذا أغلقت التبويب، يمكنك الوصول إلى حسابك من خلال: https://www.true-chance.com"
    : "🔗 Access Your Account: If you closed the tab, you can access your account at: https://www.true-chance.com"
}
  `;

  await sendEmail({
    to: userEmail,
    subject,
    html,
    text,
  });
}
