export const LANGUAGES = [
  { code: "en", labelEn: "English", labelAr: "الإنجليزية" },
  { code: "ar", labelEn: "Arabic", labelAr: "العربية" },
];

export interface Translations {
  home: {
    title: string;
    subtitle: string;
    uploadButton: string;
    redirectingText: string;
  };
  navigation: {
    home: string;
    aboutUs: string;
    founder: string;
    language: string;
    signIn: string;
    menu: string;
  };
  auth: {
    signIn: string;
    signUp: string;
    createAccount: string;
    welcomeBack: string;
    signInToContinue: string;
    signUpToGetStarted: string;
    signInToAccount: string;
    signUpToAccount: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    forgotPassword: string;
    rememberMe: string;
    orContinueWith: string;
    magicLink: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    firstNamePlaceholder: string;
    lastNamePlaceholder: string;
    confirmPasswordPlaceholder: string;
    phoneNumberPlaceholder: string;
    termsAcceptText: string;
    termsLinkText: string;
    privacyPolicyText: string;
    privacyPolicyLinkText: string;
    authenticationFailed: string;
    emailAddress: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    confirmPassword: string;
    signingIn: string;
    creatingAccount: string;
  };
  interview: {
    title: string;
    returnToDashboard: string;
    callButton: string;
    endButton: string;
    retakeInterview: string;
    thankYouTitle: string;
    thankYouMessage: string;
    thankYouSubtitle: string;
    analyzingInterview: string;
    returnToHome: string;
  };
  upload: {
    title: string;
    subtitle: string;
    uploadButton: string;
    dragDropText: string;
    emailPlaceholder: string;
    extractingText: string;
    startInterviewText: string;
    readyToStartText: string;
    progressSteps: string[];
    processingInProgress: string;
    pdfOnlyText: string;
    termsAcceptText: string;
    termsLinkText: string;
    termsErrorText: string;
  };
  profile: {
    title: string;
    subtitle: string;
    email: string;
    emailCannotChange: string;
    firstName: string;
    lastName: string;
    profileInfoNote: string;
    profile: string;
    signOut: string;
  };
  about: {
    hero: {
      title: string;
      subtitle: string;
      description: string;
      leadingPlatform: string;
    };

    mission: {
      title: string;
      content: string;
    };
    vision: {
      title: string;
      content: string;
    };
    values: {
      title: string;
      innovation: {
        title: string;
        description: string;
      };
      accessibility: {
        title: string;
        description: string;
      };
      excellence: {
        title: string;
        description: string;
      };
    };
    features: {
      title: string;
      voiceInterviews: {
        title: string;
        description: string;
      };
      personalizedQuestions: {
        title: string;
        description: string;
      };
      analysis: {
        title: string;
        description: string;
      };
    };

    team: {
      title: string;
      subtitle: string;
    };
    contact: {
      title: string;
      subtitle: string;
      getInTouch: string;
    };
  };
  founder: {
    hero: {
      title: string;
      subtitle: string;
    };
    about: {
      title: string;
      content: string;
    };
    story: {
      title: string;
      content: string;
    };
    vision: {
      title: string;
      content: string;
    };
    stats: {
      interviews: string;
      hired: string;
      resumes: string;
    };
    readFullStory: string;
    connectLinkedIn: string;
  };
  payment: {
    failed: {
      title: string;
      subtitle: string;
      description: string;
      tryAgainButton: string;
      contactSupportButton: string;
      returnHomeButton: string;
      whatHappened: string;
      reasons: string[];
      nextSteps: string;
      supportNote: string;
      nextStepsList: string[];
    };
    form: {
      title: string;
      subtitle: string;
      addressLabel: string;
      cityLabel: string;
      countryLabel: string;
      zipLabel: string;
      addressPlaceholder: string;
      cityPlaceholder: string;
      countryPlaceholder: string;
      zipPlaceholder: string;
      submitButton: string;
      processingText: string;
      securityNote: string;
    };
    success: {
      title: string;
      subtitle: string;
      startButton: string;
      startingText: string;
      closeButton: string;
    };
  };
}

export const translations: Record<string, Translations> = {
  en: {
    home: {
      title: "Begin a smarter journey to your next role.",
      subtitle:
        "Let the AI interview highlight your skills beyond a résumé, unlocking ideal, bias-free opportunities for you.",
      uploadButton: "Upload Resume & Start",
      redirectingText: "Redirecting to resume upload...",
    },
    navigation: {
      home: "Home",
      aboutUs: "About Us",
      founder: "Founder's Message",
      language: "Language",
      signIn: "Sign In",
      menu: "Menu",
    },
    auth: {
      signIn: "Sign In",
      signUp: "Sign Up",
      createAccount: "Create Account",
      welcomeBack: "Welcome back!",
      signInToContinue: "Sign in to continue",
      signUpToGetStarted: "Sign up to get started with TrueChance",
      signInToAccount: "Sign in to your account to continue",
      signUpToAccount: "Sign up to your account to continue",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      forgotPassword: "Forgot your password?",
      rememberMe: "Remember me",
      orContinueWith: "Or continue with",
      magicLink: "Magic Link",
      emailPlaceholder: "Enter your email",
      passwordPlaceholder: "Enter your password",
      firstNamePlaceholder: "Enter your first name",
      lastNamePlaceholder: "Enter your last name",
      confirmPasswordPlaceholder: "Confirm your password",
      phoneNumberPlaceholder: "Enter your phone number",
      termsAcceptText: "I accept the Terms and Conditions",
      termsLinkText: "Terms and Conditions",
      privacyPolicyText: "and Privacy Policy",
      privacyPolicyLinkText: "Privacy Policy",
      authenticationFailed: "Authentication failed. Please sign in again.",
      emailAddress: "Email Address",
      password: "Password",
      firstName: "First Name",
      lastName: "Last Name",
      phoneNumber: "Phone Number",
      confirmPassword: "Confirm Password",
      signingIn: "Signing In...",
      creatingAccount: "Creating Account...",
    },
    interview: {
      title: "Interview",
      returnToDashboard: "Return to Dashboard",
      callButton: "Call",
      endButton: "End",
      retakeInterview: "Retake Interview",
      thankYouTitle: "Thank You!",
      thankYouMessage:
        "Your interview has been completed successfully. We've saved your responses and will provide you with detailed feedback shortly.",
      thankYouSubtitle: "Interview completed on",
      analyzingInterview: "Analyzing the interview...",
      returnToHome: "Return to Home",
    },
    upload: {
      title: "Upload Resume",
      subtitle: "Upload your resume to get personalized interview questions",
      uploadButton: "Upload Resume",
      dragDropText: "Click to upload or drag and drop",
      emailPlaceholder: "Enter your email",
      extractingText: "Extracting...",
      startInterviewText: "Start Interview",
      readyToStartText: "Ready to start your interview!",
      progressSteps: [
        "Analyzing your CV…",
        "Analyzing your skills…",
        "Generating questions…",
        "Initializing Interview",
      ],
      processingInProgress: "Processing in progress...",
      pdfOnlyText: "PDF only (max 10MB)",
      termsAcceptText:
        "I accept the Terms and Conditions and agree to the processing of my data for interview purposes.",
      termsLinkText: "Terms and Conditions",
      termsErrorText: "Please accept the terms and conditions to continue.",
    },
    profile: {
      title: "My Profile",
      subtitle: "Manage your account and preferences",
      email: "Email",
      emailCannotChange: "Email cannot be changed.",
      firstName: "First Name",
      lastName: "Last Name",
      profileInfoNote:
        "Your profile information is used to personalize your interview experience.",
      profile: "Profile",
      signOut: "Sign Out",
    },
    about: {
      hero: {
        title: "About Us",
        subtitle: "Transforming job interviews with AI technology",
        description:
          "At True Chance, we believe the future of hiring is not defined by a résumé that gets a few seconds of attention, but by a deeper understanding of each individual's skills, personality, and potential. Our platform transforms the way talents connect with opportunities, using AI-powered interviews to ensure every candidate has a fair chance to stand out.",
        leadingPlatform: "Leading AI Platform",
      },

      mission: {
        title: "Our Mission",
        content:
          "Our mission is to redefine the job-seeking journey by replacing static résumés with dynamic, AI-driven interviews that reflect the true capabilities of each candidate and connect them to the most suitable opportunities—free from bias.",
      },
      vision: {
        title: "Our Vision",
        content:
          "To become the leading global platform for uncovering talent and matching it with the right opportunities, creating a fair, innovative, and future-ready hiring ecosystem where individuals are valued for their true potential.",
      },
      values: {
        title: "Our Values",
        innovation: {
          title: "Innovation",
          description:
            "Redefining recruitment standards with creative and cutting-edge solutions.",
        },
        accessibility: {
          title: "Accessibility",
          description:
            "Making opportunities reachable for every talent without barriers.",
        },
        excellence: {
          title: "Excellence",
          description:
            "Setting the highest benchmarks in evaluation, fairness, and quality.",
        },
      },
      features: {
        title: "Key Features",
        voiceInterviews: {
          title: "Voice Interviews",
          description:
            "Engage in real, interactive conversations that showcase who you truly are.",
        },
        personalizedQuestions: {
          title: "Adaptive Questions",
          description:
            "Smart questions tailored live during the interview to uncover your unique strengths.",
        },
        analysis: {
          title: "Comprehensive Analysis",
          description:
            "AI creates a detailed, unbiased profile and directly matches you with the best-fit opportunities.",
        },
      },

      team: {
        title: "Our Team",
        subtitle:
          "A diverse group of experts dedicated to building the future of AI interviews.",
      },
      contact: {
        title: "Get in Touch",
        subtitle: "Have questions or feedback? We'd love to hear from you!",
        getInTouch: "Contact Us",
      },
    },
    founder: {
      hero: {
        title: "Founder's Message",
        subtitle: "A personal message from Ahmed Alghamdi",
      },
      about: {
        title: "About Me",
        content:
          "I'm Ahmed Alghamdi, a talent acquisition and recruitment specialist with extensive experience in assessing competencies and conducting interviews. Over the course of my career, I've carried out more than 2,000 interviews, contributed to the hiring of over 300 candidates across various sectors, and reviewed more than 25,000 résumés.",
      },
      story: {
        title: "The Story Behind True Chance",
        content:
          "During my career in recruitment, I came across moments I’ll never forget.\n\nI met candidates with extraordinary talent — people of incredible value who, once given the chance, proved themselves and created real impact in the companies they joined.\n\nBut here’s the shocking part: their résumés never reflected who they truly were.\n\nOn paper, they looked ordinary. Their skills and personality were invisible — and the only time they were noticed was by pure chance, or if they happened to land a rare interview.\n\nThat left me with a question that never stopped haunting me:\n\nHow many other brilliant candidates are still lost among thousands of résumés that all look the same?",
      },
      vision: {
        title: "Our Vision",
        content:
          "This question led me to create True Chance — a platform that allows candidates to express themselves freely. We listen, reorganize their story, and highlight their strengths exactly as they are. Because talent should never be buried… it deserves the opportunity it was made for.",
      },
      stats: {
        interviews: "Interviews",
        hired: "Hired",
        resumes: "Resumes",
      },
      readFullStory: "Read Full Story",
      connectLinkedIn: "Connect on LinkedIn",
    },
    payment: {
      failed: {
        title: "Payment Failed",
        subtitle: "We couldn't process your payment.",
        description:
          "Your payment was declined or encountered an error. Please try again or contact support for assistance.",
        tryAgainButton: "Try Again",
        contactSupportButton: "Contact Support",
        returnHomeButton: "Return Home",
        whatHappened: "What happened?",
        reasons: [
          "Insufficient funds in your account.",
          "Card declined by the bank.",
          "Invalid card details.",
          "Payment method expired.",
          "Fraudulent activity detected.",
        ],
        nextSteps: "Next steps:",
        supportNote:
          "If you continue to experience issues, please contact our support team.",
        nextStepsList: [
          "Check your payment method and try again",
          "Ensure your card has sufficient funds",
          "Verify your card details are correct",
        ],
      },
      form: {
        title: "Payment Details",
        subtitle: "Enter your payment details to complete your purchase.",
        addressLabel: "Address",
        cityLabel: "City",
        countryLabel: "Country",
        zipLabel: "ZIP Code",
        addressPlaceholder: "Enter your address",
        cityPlaceholder: "Enter your city",
        countryPlaceholder: "Enter your country",
        zipPlaceholder: "Enter your ZIP code",
        submitButton: "Submit Payment",
        processingText: "Processing payment...",
        securityNote: "Your payment details are encrypted and secure.",
      },
      success: {
        title: "Payment Successful!",
        subtitle: "Your payment has been processed.",
        startButton: "Start Interview",
        startingText: "Starting your interview...",
        closeButton: "Close",
      },
    },
  },
  ar: {
    home: {
      title: "ابدأ الرحلة الذكية نحو وظيفتك القادمة",
      subtitle:
        "دع المقابلة الفورية مع الذكاء الصناعي تُظهر خبراتك ومهاراتك بدقة تتجاوز السيرة الذاتية، وتفتح لك باب الترشيح للفرص المثالية التي تناسبك تمامًا… بلا تحيز.",
      uploadButton: "رفع السيرة الذاتية والبدء",
      redirectingText: "إعادة التوجيه لرفع السيرة الذاتية...",
    },
    navigation: {
      home: "الرئيسية",
      aboutUs: "من نحن",
      founder: "رسالة المؤسس",
      language: "اللغة",
      signIn: "تسجيل الدخول",
      menu: "القائمة",
    },
    auth: {
      signIn: "تسجيل الدخول",
      signUp: "إنشاء حساب",
      createAccount: "إنشاء حساب",
      welcomeBack: "مرحباً بعودتك!",
      signInToContinue: "سجل دخولك للمتابعة",
      signUpToGetStarted: "أنشئ حسابك للبدء مع TrueChance",
      signInToAccount: "سجل دخولك إلى حسابك للمتابعة",
      signUpToAccount: "أنشئ حسابك للمتابعة",
      alreadyHaveAccount: "لديك حساب بالفعل؟",
      dontHaveAccount: "ليس لديك حساب؟",
      forgotPassword: "نسيت كلمة المرور؟",
      rememberMe: "تذكرني",
      orContinueWith: "أو استمر مع",
      magicLink: "رابط سحري",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      passwordPlaceholder: "أدخل كلمة المرور",
      firstNamePlaceholder: "أدخل اسمك الأول",
      lastNamePlaceholder: "أدخل اسمك الأخير",
      confirmPasswordPlaceholder: "أكد كلمة المرور",
      phoneNumberPlaceholder: "أدخل رقم هاتفك",
      termsAcceptText: "أوافق على الشروط والأحكام",
      termsLinkText: "الشروط والأحكام",
      privacyPolicyText: "وسياسة الخصوصية",
      privacyPolicyLinkText: "سياسة الخصوصية",
      authenticationFailed: "فشل في المصادقة. يرجى تسجيل الدخول مرة أخرى.",
      emailAddress: "البريد الإلكتروني",
      password: "كلمة المرور",
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      phoneNumber: "رقم الهاتف",
      confirmPassword: "تأكيد كلمة المرور",
      signingIn: "جاري تسجيل الدخول...",
      creatingAccount: "جاري إنشاء الحساب...",
    },
    interview: {
      title: "المقابلة",
      returnToDashboard: "العودة إلى لوحة التحكم",
      callButton: "اتصال",
      endButton: "إنهاء",
      retakeInterview: "إعادة المقابلة",
      thankYouTitle: "شكراً لك!",
      thankYouMessage:
        "تم إكمال مقابلتك بنجاح. لقد حفظنا ردودك وسنقدم لك تقييماً مفصلاً قريباً.",
      thankYouSubtitle: "تم إكمال المقابلة في",
      analyzingInterview: "جاري تحليل المقابلة...",
      returnToHome: "العودة إلى الرئيسية",
    },
    upload: {
      title: "رفع السيرة الذاتية",
      subtitle: "ارفع سيرتك الذاتية للحصول على أسئلة مقابلة مخصصة",
      uploadButton: "رفع السيرة الذاتية",
      dragDropText: "انقر للرفع أو اسحب وأفلت",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      extractingText: "جاري الاستخراج...",
      startInterviewText: "ابدأ المقابلة",
      readyToStartText: "جاهز لبدء مقابلتك!",
      progressSteps: [
        "جاري تحليل سيرتك الذاتية…",
        "جاري تحليل مهاراتك…",
        "جاري إنشاء الأسئلة…",
        "تهيئة المقابلة",
      ],
      processingInProgress: "جاري المعالجة...",
      pdfOnlyText: "PDF فقط (الحد الأقصى 10 ميجابايت)",
      termsAcceptText:
        "أوافق على الشروط والأحكام وأوافق على معالجة بياناتي لأغراض المقابلة.",
      termsLinkText: "الشروط والأحكام",
      termsErrorText: "يرجى الموافقة على الشروط والأحكام للمتابعة.",
    },
    profile: {
      title: "ملفي الشخصي",
      subtitle: "إدارة الحساب والتفضيلات",
      email: "البريد الإلكتروني",
      emailCannotChange: "لا يمكن تغيير البريد الإلكتروني.",
      firstName: "الاسم الشخصي",
      lastName: "الاسم العائلي ",
      profileInfoNote:
        "تستخدم معلومات ملفك الشخصي لتخصيص تجربة المقابلة الخاصة بك.",
      profile: "الملف الشخصي",
      signOut: "تسجيل الخروج",
    },
    about: {
      hero: {
        title: "من نحن",
        subtitle: "تحويل المقابلات الوظيفية بتقنية الذكاء الاصطناعي",
        description:
          "في ترو تشانس (True Chance) نؤمن أن مستقبل التوظيف لا يُقاس بسيرة ذاتية تُقرأ في ثوانٍ، بل بفهم عميق لمهارات وقدرات كل فرد. نحن منصة مبتكرة تربط الموهبة بالفرصة الحقيقية من خلال مقابلات شخصية مدعومة بالذكاء الصناعي، لنمنح كل مرشح فرصة عادلة لإبراز نفسه.",
        leadingPlatform: "منصة الذكاء الاصطناعي الرائدة",
      },

      mission: {
        title: "مهمتنا",
        content:
          "مهمتنا هي إعادة تعريف رحلة البحث عن عمل عبر تحويل البداية من مجرد ورقة إلى تجربة حقيقية تعكس إمكانيات الفرد، وتمكنه من الوصول إلى الفرص الأنسب دون تحيز.",
      },
      vision: {
        title: "رؤيتنا",
        content:
          "أن نكون المنصة الرائدة عالميًا في إبراز المواهب وربطها بفرصها المثالية، لنصنع بيئة توظيف أكثر عدلاً وابتكارًا، حيث تُقاس الكفاءات بقدراتها الفعلية لا بمظهر سيرتها الذاتية.",
      },
      values: {
        title: "قيمنا",
        innovation: {
          title: "الابتكار",
          description: "تقديم حلول غير تقليدية تعيد تعريف معايير التوظيف.",
        },
        accessibility: {
          title: "الوصول",
          description:
            "فتح الأبواب أمام كل موهبة لتصل إلى فرصها المناسبة دون عوائق.",
        },
        excellence: {
          title: "التميز",
          description:
            "رفع معايير الترشيح والتقييم لتحقيق أعلى مستويات الجودة والعدالة.",
        },
      },
      features: {
        title: "المميزات الرئيسية",
        voiceInterviews: {
          title: "المقابلات الصوتية",
          description:
            "تجربة تفاعلية حقيقية تعكس شخصيتك وطريقة تفكيرك بشكل مباشر.",
        },
        personalizedQuestions: {
          title: "أسئلة مخصصة",
          description:
            "تُبنى وتتكيف أثناء المقابلة لتكشف أعمق تفاصيل مهاراتك وتجاربك.",
        },
        analysis: {
          title: "التحليل الشامل",
          description:
            "الذكاء الصناعي يقدم صورة دقيقة وموضوعية عنك، ثم يرشحك للوظائف الأنسب بناءً على هذه الرؤية.",
        },
      },

      team: {
        title: "فريقنا",
        subtitle:
          "مجموعة متنوعة من الخبراء الملتزمون ببناء المستقبل للمقابلات الوظيفية.",
      },
      contact: {
        title: "اتصل بنا",
        subtitle: "هل لديك أسئلة أو توصيات؟ نحن نحب أن نسمع منك!",
        getInTouch: "اتصل بنا",
      },
    },
    founder: {
      hero: {
        title: "رسالة المؤسس",
        subtitle: "رسالة شخصية من أحمد الغامدي",
      },
      about: {
        title: "عني",
        content:
          "أنا أحمد الغامدي، مختص في استقطاب المواهب والتوظيف، بخبرة واسعة في تحليل الكفاءات وإجراء المقابلات. خلال مسيرتي المهنية أجريت أكثر من ٢٠٠٠ مقابلة شخصية، وساهمت في توظيف أكثر من ٣٠٠ مرشح في قطاعات مختلفة، واطلعت على ما يزيد عن ٢٥,٠٠٠ سيرة ذاتية",
      },
      story: {
        title: "القصة وراء هذي المنصة",
        content:
          "خلال عملي في التوظيف، واجهت مواقف ما أنساها.\n\nشفت مرشحين موهوبين لدرجة مدهشة… ناس قيمتهم عالية جدًا، ولما أخذوا فرصتهم أثبتوا نجاح باهر، وغيّروا حتى مسار الشركات اللي انضموا لها.\n\nلكن الي لاحظته ان سيرهم الذاتية ما كانت تعكس ربع قدراتهم.\n\nكانت مجرد ورقة ما تعبر عن شخصياتهم ولا مهاراتهم ولا عقلياتهم، وما كان يُكتشفوا إلا بالصدفة… أو إذا حالفهم الحظ وجاتهم فرصه في مقابلة شخصية نادرة.\n\nومن هنا بدأ السؤال يطاردني:\n\nكم شخص موهوب فعلاً، وضاعت فرصته لأنه كان مجرد سطر وسط آلاف السير المتشابهة؟",
      },
      vision: {
        title: "رؤيتنا",
        content:
          "ومن هنا طلعت فكرة ترو تشانس… منصة تخليك تعبر عن نفسك بوضوح، نسمعك، نعيد ترتيب قصتك، ونبرز قوتك زي ما هي. لأن الموهبة ما تنفع تندفن… لازم توصل للفرصة اللي تستاهلها",
      },
      stats: {
        interviews: "مقابلة",
        hired: "توظيف",
        resumes: "سيرة ذاتية",
      },
      readFullStory: "اقرأ القصة كاملة",
      connectLinkedIn: "تواصل على LinkedIn",
    },
    payment: {
      failed: {
        title: "فشل الدفع",
        subtitle: "لم نتمكن من معالجة دفعتك.",
        description:
          "تم رفض دفعتك أو واجهت مشكلة. يرجى المحاولة مرة أخرى أو الاتصال بالدعم للمساعدة.",
        tryAgainButton: "حاول مرة أخرى",
        contactSupportButton: "اتصل بالدعم",
        returnHomeButton: "العودة إلى الرئيسية",
        whatHappened: "ماذا حدث؟",
        reasons: [
          "عدم وجود رصيد في حسابك.",
          "تم رفض البطاقة بواسطة البنك.",
          "تفاصيل بطاقة غير صالحة.",
          "تاريخ انتهاء بطاقتك منتهي.",
          "نشاط تزويري مكتشف.",
        ],
        nextSteps: "الخطوات التالية:",
        supportNote: "إذا استمرت المشاكل، يرجى الاتصال بفريق الدعم الخاص بنا.",
        nextStepsList: [
          "تحقق من طريقة الدفع الخاصة بك وحاول مرة أخرى",
          "تأكد من وجود رصيد كافٍ في حسابك",
          "تأكد من صحة تفاصيل بطاقتك",
        ],
      },
      form: {
        title: "تفاصيل الدفع",
        subtitle: "أدخل تفاصيل دفعتك لإكمال الشراء.",
        addressLabel: "العنوان",
        cityLabel: "المدينة",
        countryLabel: "البلد",
        zipLabel: "الرمز البريدي",
        addressPlaceholder: "أدخل عنوانك",
        cityPlaceholder: "أدخل المدينة",
        countryPlaceholder: "أدخل البلد",
        zipPlaceholder: "أدخل الرمز البريدي",
        submitButton: "إرسال الدفع",
        processingText: "جاري معالجة الدفع...",
        securityNote: "تفاصيل دفعتك مشفرة وآمنة.",
      },
      success: {
        title: "تم الدفع بنجاح!",
        subtitle: "تم معالجة دفعتك.",
        startButton: "ابدأ المقابلة",
        startingText: "جاري بدء مقابلتك...",
        closeButton: "إغلاق",
      },
    },
  },
};

export const getTranslation = (lang: string, key: string): any => {
  const langTranslations = translations[lang] || translations.en;
  const keys = key.split(".");
  let value: any = langTranslations;

  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) break;
  }

  return value || key;
};
