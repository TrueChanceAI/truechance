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
    language: string;
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
}

export const translations: Record<string, Translations> = {
  en: {
    home: {
      title: "Begin a smarter journey to your next role.",
      subtitle: "Let the AI interview highlight your skills beyond a résumé, unlocking ideal, bias-free opportunities for you.",
      uploadButton: "Upload Resume & Start",
      redirectingText: "Redirecting to resume upload..."
    },
    navigation: {
      home: "Home",
      aboutUs: "About Us",
      language: "Language"
    },
    interview: {
      title: "Interview",
      returnToDashboard: "Return to Dashboard",
      callButton: "Call",
      endButton: "End",
      retakeInterview: "Retake Interview",
      thankYouTitle: "Thank You!",
      thankYouMessage: "Your interview has been completed successfully. We've saved your responses and will provide you with detailed feedback shortly.",
      thankYouSubtitle: "Interview completed on",
      analyzingInterview: "Analyzing the interview..."
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
        "Generating questions…"
      ],
      termsAcceptText: "I accept the Terms and Conditions and agree to the processing of my data for interview purposes.",
      termsLinkText: "Terms and Conditions",
      termsErrorText: "Please accept the terms and conditions to continue."
    },
    profile: {
      title: "My Profile",
      subtitle: "Manage your account and preferences",
      email: "Email",
      emailCannotChange: "Email cannot be changed.",
      firstName: "First Name",
      lastName: "Last Name",
      profileInfoNote: "Your profile information is used to personalize your interview experience.",
      profile: "Profile",
      signOut: "Sign Out"
    },
    about: {
             hero: {
         title: "About Us",
         subtitle: "Transforming job interviews with AI technology",
         description: "Our mission is to empower job seekers and hiring managers with advanced AI technology, enabling them to connect, communicate, and collaborate effectively."
       },
             
      mission: {
        title: "Our Mission",
        content: "To revolutionize the recruitment industry by providing AI-powered tools that enhance the interview process, making it more accessible, efficient, and effective for all stakeholders."
      },
      vision: {
        title: "Our Vision",
        content: "To become the leading platform for AI-powered interviews, empowering millions of users worldwide to achieve their career goals through seamless, unbiased, and highly personalized interview experiences."
      },
      values: {
        title: "Our Values",
        innovation: {
          title: "Innovation",
          description: "We are constantly pushing the boundaries of AI technology to deliver the most accurate and reliable interview results."
        },
        accessibility: {
          title: "Accessibility",
          description: "We believe in making our platform available to everyone, regardless of their background or location."
        },
        excellence: {
          title: "Excellence",
          description: "We strive for perfection in every aspect of our platform, from the quality of our AI models to the user experience."
        }
      },
      features: {
        title: "Key Features",
        voiceInterviews: {
          title: "Voice Interviews",
          description: "Experience a natural, conversational interview format that captures the nuances of human communication."
        },
        personalizedQuestions: {
          title: "Personalized Questions",
          description: "Get interview questions tailored to your specific skills, experience, and career goals."
        },
        analysis: {
          title: "Comprehensive Analysis",
          description: "Receive detailed feedback on your interview performance, strengths, and areas for improvement."
        }
      },
      
      team: {
        title: "Our Team",
        subtitle: "A diverse group of experts dedicated to building the future of AI interviews."
      },
      contact: {
        title: "Get in Touch",
        subtitle: "Have questions or feedback? We'd love to hear from you!",
        getInTouch: "Contact Us"
      }
    }
  },
  ar: {
    home: {
      title: "ابدأ الرحلة الذكية نحو وظيفتك القادمة",
      subtitle: "دع المقابلة الفورية مع الذكاء الصناعي تُظهر خبراتك ومهاراتك بدقة تتجاوز السيرة الذاتية، وتفتح لك باب الترشيح للفرص المثالية التي تناسبك تمامًا… بلا تحيز."
,
      uploadButton: "رفع السيرة الذاتية والبدء",
      redirectingText: "إعادة التوجيه لرفع السيرة الذاتية..."
    },
    navigation: {
      home: "الرئيسية",
      aboutUs: "من نحن",
      language: "اللغة"
    },
    interview: {
      title: "المقابلة",
      returnToDashboard: "العودة إلى لوحة التحكم",
      callButton: "اتصال",
      endButton: "إنهاء",
      retakeInterview: "إعادة المقابلة",
      thankYouTitle: "شكراً لك!",
      thankYouMessage: "تم إكمال مقابلتك بنجاح. لقد حفظنا ردودك وسنقدم لك تقييماً مفصلاً قريباً.",
      thankYouSubtitle: "تم إكمال المقابلة في",
      analyzingInterview: "جاري تحليل المقابلة..."
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
        "جاري إنشاء الأسئلة…"
      ],
      termsAcceptText: "أوافق على الشروط والأحكام وأوافق على معالجة بياناتي لأغراض المقابلة.",
      termsLinkText: "الشروط والأحكام",
      termsErrorText: "يرجى الموافقة على الشروط والأحكام للمتابعة."
    },
    profile: {
      title: "ملفي الشخصي",
      subtitle: "إدارة الحساب والتفضيلات",
      email: "البريد الإلكتروني",
      emailCannotChange: "لا يمكن تغيير البريد الإلكتروني.",
      firstName: "الاسم الشخصي",
      lastName: "الاسم العائلي ",
      profileInfoNote: "تستخدم معلومات ملفك الشخصي لتخصيص تجربة المقابلة الخاصة بك.",
      profile: "الملف الشخصي",
      signOut: "تسجيل الخروج"
    },
    about: {
             hero: {
         title: "من نحن",
         subtitle: "تحويل المقابلات الوظيفية بتقنية الذكاء الاصطناعي",
         description: "مهمتنا هي تمكين المتقدمين للوظائف والمستخدمين في التوظيف بتقنية الذكاء الصناعي المتقدمة، مما يسمح لهم بالاتصال والتواصل والتعاون بكفاءة."
       },
             
      mission: {
        title: "مهمتنا",
        content: "لتحويل صناعة التوظيف بتقنية الذكاء الصناعي، من خلال تقديم أدوات مدعومة بتقنية الذكاء الصناعي تحسن عملية المقابلة، مما يجعلها أكثر доступية وفعالية وفعالية لجميع الأطراف المعنية."
      },
      vision: {
        title: "رؤيتنا",
        content: "لتصبح أفضل منصة للمقابلات الوظيفية بتقنية الذكاء الصناعي، تمكن ملايين المستخدمين في العالم الكلي من تحقيق أهدافهم عبر تجربة مستمرة، محايدة ومخصصة بشكل كبير للمقابلات الوظيفية."
      },
      values: {
        title: "قيمنا",
        innovation: {
          title: "الابتكار",
          description: "نحن دائماً ندفع حدود تقنية الذكاء الصناعي لتقديم أدق وأكثر موثوقية نتائج المقابلات."
        },
        accessibility: {
          title: "الوصول",
          description: "نحن نؤمن بتوفير منصتنا للجميع، بغض النظر عن ظروفهم أو موقعهم."
        },
        excellence: {
          title: "الاستثناء",
          description: "نحن نسعى لتحقيق التميز في كل جانب من جوانب منصتنا، من جودة نماذج الذكاء الصناعي إلى تجربة المستخدم."
        }
      },
      features: {
        title: "المميزات الرئيسية",
        voiceInterviews: {
          title: "المقابلات الصوتية",
          description: "استضاف خبرة مقابلة منطقية، تمكنك من التواصل الطبيعي والتفاعل مع السياق."
        },
        personalizedQuestions: {
          title: "أسئلة مخصصة",
          description: "احصل على أسئلة المقابلة المخصصة لمهاراتك وخبرتك وأهداف حياتك."
        },
        analysis: {
          title: "التحليل الشامل",
          description: "احصل على توصيات مفصلة حول أدائك في المقابلة، والقوى، والمناطق التي يمكن تحسينها."
        }
      },
      
      team: {
        title: "فريقنا",
        subtitle: "مجموعة متنوعة من الخبراء الملتزمون ببناء المستقبل للمقابلات الوظيفية."
      },
      contact: {
        title: "اتصل بنا",
        subtitle: "هل لديك أسئلة أو توصيات؟ نحن نحب أن نسمع منك!",
        getInTouch: "اتصل بنا"
      }
    }
  }
};

export const getTranslation = (lang: string, key: string): string => {
  const langTranslations = translations[lang] || translations.en;
  const keys = key.split('.');
  let value: any = langTranslations;
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) break;
  }
  
  return value || key;
}; 