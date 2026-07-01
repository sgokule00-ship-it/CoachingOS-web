import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

// --- Website CMS Config Interface ---
export interface CmsConfig {
  announcementBar: {
    show: boolean;
    text: string;
    link: string;
    linkText: string;
    bgClass: string;
    textClass: string;
  };
  branding: {
    logoText: string;
    logoLetter: string;
    websiteTitle: string;
    faviconUrl?: string;
  };
  bannerSlider: {
    show: boolean;
    slides: Array<{
      id: string;
      image: string;
      title: string;
      subtitle: string;
      link: string;
    }>;
  };
  hero: {
    tag: string;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    secText: string;
    secLink: string;
    showAndroidNotice: boolean;
    androidNoticeText: string;
  };
  features: {
    title: string;
    subtitle: string;
    highlights: Array<{
      id: string;
      icon: string; // Icon identifier (e.g. "Database", "Palette", "Smartphone", "ShieldCheck")
      title: string;
      description: string;
    }>;
    adminTitle: string;
    adminSubtitle?: string;
    adminFeatures: Array<{
      id: string;
      icon: string; // e.g. "Users", "UserSquare2", "Layers", "Clock"
      title: string;
      description: string;
    }>;
    operationalTitle: string;
    operationalFeatures: Array<{
      id: string;
      icon: string; // e.g. "ClipboardCheck", "CreditCard", "BookOpen", "GraduationCap"
      title: string;
      description: string;
    }>;
  };
  about: {
    title: string;
    subtitle: string;
    description: string;
    bulletPoints: string[];
  };
  pricing: {
    title: string;
    subtitle: string;
    plans: Array<{
      id: string;
      name: string;
      price: string;
      period: string;
      description: string;
      badge: string;
      isPopular: boolean;
      features: string[];
      ctaText: string;
      link: string;
    }>;
  };
  testimonials: {
    show: boolean;
    title: string;
    list: Array<{
      id: string;
      name: string;
      role: string;
      company: string;
      avatar: string;
      content: string;
      rating: number;
    }>;
  };
  faq: {
    title: string;
    subtitle: string;
    list: Array<{
      id: string;
      q: string;
      a: string;
    }>;
  };
  contact: {
    title: string;
    subtitle: string;
    address: string;
    phone: string;
    email: string;
    hours: string;
    statusText: string;
    description: string;
  };
  socials: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    youtube: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    author: string;
  };
  popup: {
    show: boolean;
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    cookieKey: string;
  };
  footer: {
    text: string;
    copyright: string;
    links: Array<{
      id: string;
      label: string;
      path: string;
    }>;
  };
  settings: {
    maintenanceMode: boolean;
    supportChatbot: boolean;
  };
}

// --- CMS Defaults ---
export const defaultCmsConfig: CmsConfig = {
  announcementBar: {
    show: true,
    text: "🔥 Direct Mobile & Web Synchronization engine online. No extra servers required.",
    link: "/register",
    linkText: "Get Access Now",
    bgClass: "bg-indigo-600 dark:bg-indigo-700",
    textClass: "text-white"
  },
  branding: {
    logoText: "CoachingOS",
    logoLetter: "C",
    websiteTitle: "CoachingOS - White-Label coaching engine"
  },
  bannerSlider: {
    show: true,
    slides: [
      {
        id: "s1",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
        title: "Coordinate in Real-Time",
        subtitle: "Log operations, manage batches, and watch your edits sync to your native Android app instantly.",
        link: "/register"
      },
      {
        id: "s2",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
        title: "100% White-Labeled Setup",
        subtitle: "Upload your logo, pair custom primary/secondary branding hex colors, and claim your brand identity.",
        link: "/features"
      }
    ]
  },
  hero: {
    tag: "Version 2.0 Advanced Cloud Sync Engine Active",
    title: "The White-Label Coaching Engine for Enterprise Institutes",
    subtitle: "Launch your custom-branded coaching platform in minutes. Manage students, collect online fees, track attendance, and assign homework with real-time sync to your existing Android app.",
    ctaText: "Start 14-Day Free Trial",
    ctaLink: "/register",
    secText: "Log In to Dashboard",
    secLink: "/login",
    showAndroidNotice: true,
    androidNoticeText: "Looking for student, parent, or teacher portals? Log in via your Android App."
  },
  features: {
    title: "Designed for Scale & Shared Compatibility",
    subtitle: "Stop juggling disjointed services. CoachingOS integrates your administrative, academic, and communication networks into one unified cloud workspace.",
    highlights: [
      {
        id: "h1",
        icon: "Database",
        title: "Shared Synchronized Core",
        description: "Seamless real-time synchronization between the web management dashboard and your native Android mobile app."
      },
      {
        id: "h2",
        icon: "Palette",
        title: "100% White-Labeled",
        description: "Customize everything! Upload your brand logo, name, custom title, and brand primary/secondary color schemes instantly."
      },
      {
        id: "h3",
        icon: "Smartphone",
        title: "Synchronized Android App",
        description: "Your teachers, students, and parents log in directly via the mobile app, with instantaneous state updates in the website."
      },
      {
        id: "h4",
        icon: "ShieldCheck",
        title: "Secure Multi-Tenancy",
        description: "Complete data isolation. Every user profile and administrative record is insulated via solid role-based access rules."
      }
    ],
    adminTitle: "Core Academic Directory & Rosters",
    adminFeatures: [
      {
        id: "af1",
        icon: "Users",
        title: "Student Directory",
        description: "Manage detailed student dossiers, roll numbers, guardian contact numbers, linked batch rosters, and tuition statuses."
      },
      {
        id: "af2",
        icon: "UserSquare2",
        title: "Teacher Coordination",
        description: "Track teacher profile records, designated subjects, monthly payroll settings, and assigned batches in a single tab."
      },
      {
        id: "af3",
        icon: "Layers",
        title: "Batch & Course Allocator",
        description: "Establish dedicated physical or online batches. Define course syllabus structures and set individual batch timetables."
      },
      {
        id: "af4",
        icon: "Clock",
        title: "Interactive Timetables",
        description: "Generate structured class timesheets. Prevent class conflicts by assigning specific rooms and available teachers."
      }
    ],
    operationalTitle: "Daily Operations & Real-time Synchronization",
    operationalFeatures: [
      {
        id: "of1",
        icon: "ClipboardCheck",
        title: "Daily Real-time Attendance",
        description: "Log present, absent, or late states. Sync results with the mobile app so parents are instantly notified on their phones."
      },
      {
        id: "of2",
        icon: "CreditCard",
        title: "Tuition Fees ledger",
        description: "Create billing invoices, track pending tuition fees, record digital or cash payments, and generate downloadable receipts."
      },
      {
        id: "of3",
        icon: "BookOpen",
        title: "Homework & Syllabus Tracking",
        description: "Publish homework assignments with custom descriptions and due dates. Deliver study resources (PDF files, slides) to batches."
      },
      {
        id: "of4",
        icon: "GraduationCap",
        title: "Exams & Results Processor",
        description: "Schedule exams and tests. Enter marks to generate beautiful, mobile-friendly report cards accessible to parents."
      }
    ]
  },
  about: {
    title: "Instantly Populate Your Dashboard in 1-Click",
    subtitle: "AUTOMATED OPERATIONS",
    description: "We understand testing SaaS dashboards with empty states can be tedious. When you start your free trial, CoachingOS provides an option to load full-scale, clean academic data instantly with one click. Seeding data maps automatically using our sub-tenant framework. It works directly with existing Android security rules schemas, meaning you can test mobile sync instantly.",
    bulletPoints: [
      "Seeded with realistic Student lists and profiles",
      "Automated Fee Invoices and Collection Logs",
      "Sample Batches with linked mock Teachers",
      "Mock Daily Attendance schedules"
    ]
  },
  pricing: {
    title: "One Powerful Plan for Everything",
    subtitle: "Start your 30-day free trial today. No credit card required. Upgrade to CoachingOS Pro for just ₹999/month once your trial ends.",
    plans: [
      {
        id: "coachingos_pro",
        name: "CoachingOS Pro",
        price: "₹999",
        period: "month",
        description: "Everything you need to run your coaching institute at scale",
        badge: "30 Days Free Trial",
        isPopular: true,
        features: [
          "Unlimited Students",
          "Unlimited Teachers",
          "Unlimited Parents",
          "Unlimited Batches",
          "Attendance Management",
          "Fee Management",
          "Exam & Result Management",
          "Homework Management",
          "Study Material",
          "Timetable",
          "Notice Board",
          "Reports",
          "White-Label Branding",
          "Android Mobile App",
          "Owner Web Dashboard",
          "Teacher App",
          "Student App",
          "Parent App",
          "Free Updates",
          "Technical Support"
        ],
        ctaText: "Start 30-Day Free Trial",
        link: "/register"
      }
    ]
  },
  testimonials: {
    show: true,
    title: "Loved by Coaching Operators Globally",
    list: [
      {
        id: "t1",
        name: "Arjun Sharma",
        role: "Director",
        company: "Apex Science Classes",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        content: "CoachingOS changed the way we handle rosters. The white-label features allowed our custom brand theme to shine, and teachers love the real-time sync with our custom Android app.",
        rating: 5
      },
      {
        id: "t2",
        name: "Priya Patel",
        role: "Principal",
        company: "Starlight Arts Academy",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        content: "Billing fees and taking daily attendance was always a nightmare. Being able to seed standard mock data in one click let us understand the app instantly. Highly recommended!",
        rating: 5
      }
    ]
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Have questions about cloud synchronization or custom white-label setups? Let's clarify.",
    list: [
      {
        id: "f1",
        q: "How does the website coordinate with my Android app?",
        a: "Both applications connect directly to the same secure cloud network. With robust offline sync and secure web channels, any data entry, homework assignment, or attendance logged on this website instantly populates in the mobile application!"
      },
      {
        id: "f2",
        q: "Can teachers, students, or parents log in on the website?",
        a: "No. To maintain clean operations and native focus, teachers, students, and parents log in exclusively through the CoachingOS Android application. The website is reserved entirely for Coaching Owners to manage billing, configurations, and academics, and for Super Admins to monitor the global system."
      },
      {
        id: "f3",
        q: "How does the White-Label branding work?",
        a: "Through the Owner Dashboard, you can specify your coaching name, upload a logo, and choose custom colors. This theme customizes the dashboards and is immediately synced to the mobile workspace, creating a seamless branded feel."
      },
      {
        id: "f4",
        q: "Is there a free trial?",
        a: "Yes! Every new coaching registration instantly kicks off a 14-day fully-featured Free Trial with demo data populated in a single click, allowing you to try out all modules immediately."
      }
    ]
  },
  contact: {
    title: "Get in Touch with our Architecture Team",
    subtitle: "SUPPORT & CONSULTATION",
    address: "Regus Centre, Level 4, Connaught Place, New Delhi - 110001",
    phone: "+91 11 4112 0042",
    email: "support@coachingos.com",
    hours: "Monday - Friday: 9:00 AM - 6:00 PM IST",
    statusText: "CoachingOS Cloud Active",
    description: "Your support tickets and administration workspaces are secured via advanced secure cloud systems and modern data isolation."
  },
  socials: {
    facebook: "https://facebook.com/coachingos",
    twitter: "https://twitter.com/coachingos",
    linkedin: "https://linkedin.com/company/coachingos",
    instagram: "https://instagram.com/coachingos",
    youtube: "https://youtube.com/coachingos"
  },
  seo: {
    metaTitle: "CoachingOS - Advanced Multi-Tenant White-Label LMS Engine",
    metaDescription: "Launch your white-label coaching institute app in 5 minutes. Sync attendance, fees ledger, class batches with real-time sync with your Android app.",
    metaKeywords: "White-label LMS, Coaching Management, Realtime attendance tracker, Fees invoice software, Android Coaching App",
    author: "CoachingOS Ltd."
  },
  popup: {
    show: false,
    title: "Enterprise Upgrade Promotion",
    description: "Upgrade your trial plan to Pro Studio this week and receive a custom Google Play Store upload assistance free of charge!",
    ctaText: "Upgrade Dashboard",
    ctaLink: "/dashboard",
    cookieKey: "promotion_popup_dismissed_v2"
  },
  footer: {
    text: "The ultimate enterprise white-label coaching management platform. Launch, scale, and automate your coaching institute globally.",
    copyright: "CoachingOS Ltd. All rights reserved.",
    links: [
      { id: "fl1", label: "Features", path: "/features" },
      { id: "fl2", label: "Pricing Plans", path: "/pricing" },
      { id: "fl3", label: "Enterprise SLA", path: "#" },
      { id: "fl4", label: "Contact Us", path: "/contact" }
    ]
  },
  settings: {
    maintenanceMode: false,
    supportChatbot: true
  }
};

// --- Context Definition ---
interface CmsContextType {
  cmsConfig: CmsConfig;
  loading: boolean;
  saveCmsConfig: (newConfig: CmsConfig) => Promise<void>;
  resetCmsConfig: () => Promise<void>;
}

const CmsContext = createContext<CmsContextType | undefined>(undefined);

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cmsConfig, setCmsConfig] = useState<CmsConfig>(defaultCmsConfig);
  const [loading, setLoading] = useState<boolean>(true);

  // Synchronize Website CMS config dynamically in real-time
  useEffect(() => {
    const docRef = doc(db, "website_cms", "config");

    // Helper to merge data with defaults
    const mergeConfig = (data: Partial<CmsConfig>): CmsConfig => {
      return {
        ...defaultCmsConfig,
        ...data,
        announcementBar: { ...defaultCmsConfig.announcementBar, ...data.announcementBar },
        branding: { ...defaultCmsConfig.branding, ...data.branding },
        bannerSlider: {
          ...defaultCmsConfig.bannerSlider,
          ...data.bannerSlider,
          slides: data.bannerSlider?.slides || defaultCmsConfig.bannerSlider.slides
        },
        hero: { ...defaultCmsConfig.hero, ...data.hero },
        features: {
          ...defaultCmsConfig.features,
          ...data.features,
          highlights: data.features?.highlights || defaultCmsConfig.features.highlights,
          adminFeatures: data.features?.adminFeatures || defaultCmsConfig.features.adminFeatures,
          operationalFeatures: data.features?.operationalFeatures || defaultCmsConfig.features.operationalFeatures
        },
        about: {
          ...defaultCmsConfig.about,
          ...data.about,
          bulletPoints: data.about?.bulletPoints || defaultCmsConfig.about.bulletPoints
        },
        pricing: {
          ...defaultCmsConfig.pricing,
          ...data.pricing,
          plans: data.pricing?.plans || defaultCmsConfig.pricing.plans
        },
        testimonials: {
          ...defaultCmsConfig.testimonials,
          ...data.testimonials,
          list: data.testimonials?.list || defaultCmsConfig.testimonials.list
        },
        faq: {
          ...defaultCmsConfig.faq,
          ...data.faq,
          list: data.faq?.list || defaultCmsConfig.faq.list
        },
        contact: { ...defaultCmsConfig.contact, ...data.contact },
        socials: { ...defaultCmsConfig.socials, ...data.socials },
        seo: { ...defaultCmsConfig.seo, ...data.seo },
        popup: { ...defaultCmsConfig.popup, ...data.popup },
        footer: {
          ...defaultCmsConfig.footer,
          ...data.footer,
          links: data.footer?.links || defaultCmsConfig.footer.links
        },
        settings: { ...defaultCmsConfig.settings, ...data.settings }
      };
    };

    const applyConfig = (config: CmsConfig) => {
      setCmsConfig(config);
      if (config.branding.websiteTitle) {
        document.title = config.branding.websiteTitle;
      }
      if (config.branding.faviconUrl) {
        const link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (link) {
          link.href = config.branding.faviconUrl;
        }
      }
    };

    let unsub: (() => void) | null = null;
    let loadedInitial = false;

    const loadDirect = async () => {
      try {
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const merged = mergeConfig(snap.data() as Partial<CmsConfig>);
          applyConfig(merged);
          loadedInitial = true;
        } else {
          applyConfig(defaultCmsConfig);
          loadedInitial = true;
        }
      } catch (err) {
        console.warn("CMS getDoc direct fetch failed, will try onSnapshot or fallback:", err);
      } finally {
        setLoading(false);
      }
    };

    // Load direct first
    loadDirect().then(() => {
      try {
        unsub = onSnapshot(docRef, (snap) => {
          if (snap.exists()) {
            const merged = mergeConfig(snap.data() as Partial<CmsConfig>);
            applyConfig(merged);
          } else {
            applyConfig(defaultCmsConfig);
          }
          setLoading(false);
        }, (err) => {
          console.warn("CMS onSnapshot listener failed (expected in certain proxy/iframe environments):", err);
          if (!loadedInitial) {
            applyConfig(defaultCmsConfig);
            setLoading(false);
          }
        });
      } catch (err) {
        console.warn("Failed to initialize CMS onSnapshot:", err);
        if (!loadedInitial) {
          applyConfig(defaultCmsConfig);
          setLoading(false);
        }
      }
    });

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const saveCmsConfig = async (newConfig: CmsConfig) => {
    try {
      const docRef = doc(db, "website_cms", "config");
      await setDoc(docRef, newConfig);
    } catch (err) {
      console.error("Error writing website CMS config to firestore:", err);
      throw err;
    }
  };

  const resetCmsConfig = async () => {
    try {
      const docRef = doc(db, "website_cms", "config");
      await setDoc(docRef, defaultCmsConfig);
    } catch (err) {
      console.error("Error resetting website CMS config:", err);
      throw err;
    }
  };

  return (
    <CmsContext.Provider value={{ cmsConfig, loading, saveCmsConfig, resetCmsConfig }}>
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => {
  const context = useContext(CmsContext);
  if (context === undefined) {
    throw new Error("useCms must be used within a CmsProvider");
  }
  return context;
};
