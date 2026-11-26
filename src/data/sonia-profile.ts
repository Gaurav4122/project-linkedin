export type CausalityVectorId = "brand" | "messaging" | "operations" | "people";

export type RegionKey = "usa" | "uae" | "india";

export interface CausalityVector {
  id: CausalityVectorId;
  source: string;
  target: string;
  statement: string;
  summary: string;
  accent: string;
  metricBadge: string;
  linkedCompanies: string[];
}

export interface Mandate {
  id: string;
  role: string;
  company: string;
  companyUrl: string;
  type: string;
  period: string;
  duration: string;
  location: string;
  region: RegionKey;
  vectors: CausalityVectorId[];
  highlights: string[];
}

export interface SkillNode {
  name: string;
  category: "strategy" | "execution" | "systems" | "leadership";
  endorsements?: number;
  experiencesCount?: number;
  companiesCount?: number;
  notableEndorsers?: string;
}

export interface DiagnosticScenario {
  id: string;
  symptom: string;
  contextTag: string;
  rootCause: string;
  soniaApproach: string[];
  relevantVectors: CausalityVectorId[];
  matchingServices: string[];
  proofMandate: string;
}

export const SONIA_PROFILE = {
  displayName: "Soniaa (Sonya 🔍) S.",
  shortName: "Soniaa S.",
  linkedinUrl: "https://www.linkedin.com/in/soniaspecialist/",
  headline:
    "Fractional CMO | Crafting Brands People Can Feel | Human Messaging, Clear Strategy & Meaningful Growth | Guiding Teams & Founders to Think Better",
  location: "Gurugram, Haryana, India",
  availability: "Remote · Global",
  pricing: "Contact for pricing",
  followers: 10574,
  openingQuote:
    "I notice what others don't. The gaps, the confusion, the unspoken story, and I help make sense of it..",
  pillarsTagline:
    "Bringing clarity, connecting the dots, and making the work simpler, purposeful, and aligned.",
  coreStatements: [
    "I bring structure without chaos.",
    "I help teams feel more confident and connected in what they're building.",
    "I help early-stage and growing businesses make their marketing clear, human, and aligned with what they're building.",
    "I work with a steady mind.",
  ],
  closingInvitation:
    "I'm always open to connecting with people who are building, learning, or growing — and want marketing that feels clear, meaningful, and human.",
  services: [
    "Marketing Strategy",
    "Brand Marketing",
    "Brand Consulting",
    "Content Strategy",
    "Email Marketing",
    "Demand Generation",
    "Leadership Development",
    "Team Building",
    "Training",
    "Management Consulting",
  ],
  education: [
    {
      school: "Indian Institute of Management Bangalore",
      short: "IIM Bangalore",
      degree: "Executive MBA, Marketing",
      period: "2007 – 2008",
      notes: "Worked on a Project of Strategies with CM University.",
      url: "https://www.linkedin.com/school/157273/",
    },
    {
      school: "Symbiosis Institute of Management Studies",
      short: "Symbiosis (SIMS)",
      degree: "PGDBM, Marketing & Sales",
      period: "2007 – 2009",
      notes: "Active Participations in Personal Development programs.",
      url: "https://www.linkedin.com/school/407000/",
    },
  ],
  totalEducationsOnProfile: 5,
  certifications: [
    {
      title: "Guided Client Onboarding Certified",
      issuer: "HubSpot Academy",
      issued: "Issued Oct 2020 · Expired Oct 2021",
      credentialId: "7249695",
    },
    {
      title: "Fundamentals of Digital Marketing",
      issuer: "Google",
      issued: "Issued Mar 2020",
      credentialId: "7W2 2B3 DX8",
    },
  ],
  totalCertificationsOnProfile: 21,
  volunteering: [
    {
      role: "Digital Marketing Consultant",
      organization: "Project Heena",
      period: "Oct 2014 – Present",
      duration: "12 yrs 2 mos",
      cause: "Social Services",
    },
    {
      role: "Marketing",
      organization: "Open Doors Group",
      period: "Feb 2015 – Jun 2016",
      duration: "1 yr 5 mos",
      cause: "Education",
    },
  ],
} as const;

export const LENS_TRANSFORMATIONS = [
  {
    id: "gaps",
    noise: "Gaps & unspoken story",
    clarity: "Clear, human brand positioning",
    vector: "brand" as CausalityVectorId,
  },
  {
    id: "fragmented",
    noise: "Fragmented startup teams",
    clarity: "Aligned, confident growth engines",
    vector: "people" as CausalityVectorId,
  },
  {
    id: "bottlenecks",
    noise: "Operational bottlenecks",
    clarity: "Structure without chaos",
    vector: "operations" as CausalityVectorId,
  },
  {
    id: "conversion",
    noise: "Complex product, low conversion",
    clarity: "Simple, purposeful messaging",
    vector: "messaging" as CausalityVectorId,
  },
] as const;

export const CAUSALITY_VECTORS: CausalityVector[] = [
  {
    id: "brand",
    source: "Brand",
    target: "Revenue",
    statement: "Understanding how brand affects revenue",
    summary:
      "Crafting brands people can feel—so early-stage and growing businesses stand out with clear growth direction and measurable outcomes.",
    accent: "amber",
    metricBadge: "61 Brand Management Endorsements",
    linkedCompanies: ["[i-SmokeStack]", "AYU Lifescience", "Datt Mediproducts Pvt. Ltd."],
  },
  {
    id: "messaging",
    source: "Messaging",
    target: "Conversion",
    statement: "Understanding how messaging affects conversion",
    summary:
      "Translating complex business, AI, and medical product insights into human messaging, product communication, and email journeys that convert.",
    accent: "cyan",
    metricBadge: "17 Experiences · Email & Content Strategy",
    linkedCompanies: ["AYU Lifescience", "Datt Mediproducts Pvt. Ltd.", "Celestial AI"],
  },
  {
    id: "operations",
    source: "Operations",
    target: "Execution",
    statement: "Understanding how operations affect execution",
    summary:
      "Building ground-up frameworks, UI/form/cookie/CRM tracking, and business workflows that remove bottlenecks and boost execution speed.",
    accent: "emerald",
    metricBadge: "49 Salesforce.com · 23 CRM Endorsements",
    linkedCompanies: ["Celestial AI", "AYU Inc USA", "AYU Lifescience", "[i-SmokeStack]"],
  },
  {
    id: "people",
    source: "People",
    target: "Everything",
    statement: "Understanding how people affect everything",
    summary:
      "Mentoring leadership and cross-functional teams to adopt a structured, human-first approach—fostering clarity, confidence, and collaboration.",
    accent: "violet",
    metricBadge: "Leadership Development & Team Building",
    linkedCompanies: ["[i-SmokeStack]", "Celestial AI", "AYU Inc USA", "Datt Mediproducts Pvt. Ltd."],
  },
];

export const MANDATES: Mandate[] = [
  {
    id: "ismokestack",
    role: "Chief Marketing Officer",
    company: "[i-SmokeStack]",
    companyUrl: "https://www.linkedin.com/company/12819520/",
    type: "Full-time",
    period: "Mar 2020 – Present",
    duration: "6 yrs 9 mos",
    location: "United States",
    region: "usa",
    vectors: ["brand", "operations", "people"],
    highlights: [
      "Led marketing strategy and brand initiatives for early-stage startups and global teams, accelerating lead generation and improving campaign effectiveness.",
      "Built frameworks and processes that transformed fragmented teams into aligned, confident growth engines, increasing operational efficiency and reducing bottlenecks.",
      "Turned complex business challenges into actionable marketing solutions that are simple, purposeful, and high-impact across diverse markets.",
      "Mentored leadership and teams to think strategically, execute decisively, and foster a culture of clarity and collaboration.",
    ],
  },
  {
    id: "celestial-ai",
    role: "Chief Marketing & Operations Advisor",
    company: "Celestial AI",
    companyUrl: "https://www.linkedin.com/company/72611738/",
    type: "Full-time",
    period: "May 2025 – Present",
    duration: "1 yr 7 mos",
    location: "Noida, Uttar Pradesh, India · Remote",
    region: "india",
    vectors: ["operations", "brand", "people"],
    highlights: [
      "Led end-to-end marketing and operational strategy for a new startup, building structures and processes from the ground up.",
      "Developed frameworks aligning brand, marketing, and operational goals for clarity and purposeful execution across teams.",
      "Translated complex business challenges into actionable solutions, enabling confident decision-making and scalable growth.",
      "Guided leadership and teams to adopt a structured, human-first approach fostering long-term impact.",
    ],
  },
  {
    id: "ayu-lifescience",
    role: "Fractional Marketing Lead",
    company: "AYU Lifescience",
    companyUrl: "https://www.linkedin.com/company/107500726/",
    type: "Full-time",
    period: "Apr 2025 – Present",
    duration: "1 yr 8 mos",
    location: "Dubai, United Arab Emirates · Remote",
    region: "uae",
    vectors: ["messaging", "brand", "operations"],
    highlights: [
      "Supporting AYU Lifescience as a retained marketing lead for product communication, website development, and strategic alignment.",
      "Building a clean, TGA-aligned brand experience for UAE’s medical buyers.",
      "Managing cross-team coordination for content, UI, forms, cookies, and CRM tracking.",
    ],
  },
  {
    id: "ayu-inc-usa",
    role: "Chief Marketing & Operations Advisor",
    company: "AYU Inc USA",
    companyUrl: "https://www.linkedin.com/company/66239406/",
    type: "Full-time",
    period: "Jan 2023 – Present",
    duration: "3 yrs 11 mos",
    location: "Boston, Massachusetts, United States · Remote",
    region: "usa",
    vectors: ["operations", "people", "brand"],
    highlights: [
      "Led end-to-end marketing and operational strategy for a new startup, building structures and processes from the ground up.",
      "Developed frameworks that aligned brand, marketing, and operational goals across teams.",
      "Translated complex business challenges into actionable solutions enabling confident decision-making and scalable growth.",
      "Guided leadership and teams to adopt a structured, human-first approach.",
    ],
  },
  {
    id: "datt-mediproducts",
    role: "Fractional CMO",
    company: "Datt Mediproducts Pvt. Ltd.",
    companyUrl: "https://www.linkedin.com/company/13699432/",
    type: "Full-time",
    period: "Apr 2020 – Present",
    duration: "6 yrs 8 mos",
    location: "New Delhi, Delhi, India · Remote",
    region: "india",
    vectors: ["brand", "messaging", "people"],
    highlights: [
      "Led marketing strategy and brand initiatives creating clear growth direction and measurable outcomes.",
      "Built frameworks and processes that improved team alignment, execution speed, and cross-functional decision-making.",
      "Translated complex market and product insights into actionable strategies driving engagement, visibility, and customer acquisition.",
      "Mentored leadership and teams to adopt purposeful approaches achieving tangible results.",
    ],
  },
];

export const SKILLS_MATRIX: SkillNode[] = [
  {
    name: "Brand Management",
    category: "strategy",
    endorsements: 61,
    notableEndorsers: "Vijay Malhotra, Shikha - The Rockstar Recruiter",
  },
  {
    name: "Lead Generation",
    category: "execution",
    endorsements: 54,
    notableEndorsers: "Ibrahim Burhani & 2 highly skilled peers",
  },
  {
    name: "Salesforce.com",
    category: "systems",
    endorsements: 49,
    notableEndorsers: "Mario M. Martinez Jr. & 4 highly skilled peers",
  },
  {
    name: "Marketing Management",
    category: "strategy",
    endorsements: 33,
    notableEndorsers: "3 colleagues at Appirio",
  },
  {
    name: "Product Marketing",
    category: "strategy",
    endorsements: 30,
    notableEndorsers: "Anwar A. Alawi & 3 colleagues at Appirio",
  },
  {
    name: "Strategy",
    category: "strategy",
    endorsements: 27,
    notableEndorsers: "Mario M. Martinez Jr. & 3 Appirio colleagues",
  },
  {
    name: "CRM",
    category: "systems",
    endorsements: 23,
    notableEndorsers: "Deepa Sinha & 3 highly skilled peers",
  },
  {
    name: "Product Management",
    category: "strategy",
    endorsements: 22,
    notableEndorsers: "3 colleagues at Appirio",
  },
  {
    name: "Email Strategy",
    category: "execution",
    endorsements: 1,
    experiencesCount: 17,
    companiesCount: 10,
  },
  {
    name: "Content Management",
    category: "execution",
    endorsements: 1,
    experiencesCount: 17,
    companiesCount: 10,
  },
  {
    name: "Email",
    category: "execution",
    endorsements: 3,
    experiencesCount: 10,
    companiesCount: 9,
  },
  {
    name: "Sales Management",
    category: "execution",
    endorsements: 2,
    experiencesCount: 9,
    companiesCount: 6,
  },
  {
    name: "Business Workflows",
    category: "systems",
    endorsements: 1,
    experiencesCount: 8,
    companiesCount: 5,
  },
  {
    name: "Market Research",
    category: "strategy",
    endorsements: 5,
    experiencesCount: 7,
    companiesCount: 6,
  },
  {
    name: "Copywriting",
    category: "execution",
    experiencesCount: 7,
    companiesCount: 5,
  },
  {
    name: "Teamwork",
    category: "leadership",
    experiencesCount: 6,
    companiesCount: 4,
  },
  {
    name: "Marketing Operations",
    category: "systems",
    endorsements: 1,
    experiencesCount: 5,
    companiesCount: 4,
  },
  {
    name: "Problem Solving",
    category: "leadership",
    endorsements: 4,
    experiencesCount: 4,
    companiesCount: 4,
    notableEndorsers: "2 colleagues at Appirio",
  },
];

export const DIAGNOSTIC_SCENARIOS: DiagnosticScenario[] = [
  {
    id: "unclear-messaging",
    symptom: "Our product is strong, but the story isn't clicking or converting",
    contextTag: "Messaging & Brand Gap",
    rootCause:
      "When teams build from the inside out, the unspoken story stays trapped in technical specs instead of human outcomes.",
    soniaApproach: [
      "Identify the gaps, confusion, and unspoken story beneath your current positioning.",
      "Translate complex product insights into simple, human messaging built for conversion.",
      "Align content strategy, copywriting, and product communication around one clear narrative.",
    ],
    relevantVectors: ["brand", "messaging"],
    matchingServices: ["Brand Consulting", "Brand Marketing", "Content Strategy"],
    proofMandate: "Datt Mediproducts Pvt. Ltd. & [i-SmokeStack]",
  },
  {
    id: "fragmented-ops",
    symptom: "Content, UI, forms, and CRM feel disconnected across teams",
    contextTag: "Execution Bottleneck",
    rootCause:
      "Fragmented tools and workflows break handoffs between marketing curiosity and measurable revenue execution.",
    soniaApproach: [
      "Introduce structure without chaos—mapping clean business workflows across teams.",
      "Coordinate content, UI, forms, cookies, and CRM tracking into one measurable loop.",
      "Turn fragmented groups into aligned, confident growth engines with reduced bottlenecks.",
    ],
    relevantVectors: ["operations", "people"],
    matchingServices: ["Marketing Strategy", "Demand Generation", "Management Consulting"],
    proofMandate: "AYU Lifescience (Dubai) & [i-SmokeStack]",
  },
  {
    id: "zero-to-one-startup",
    symptom: "We're an early-stage startup building marketing & ops from zero",
    contextTag: "0 → 1 Architecture",
    rootCause:
      "Early-stage teams often overcomplicate tactics before aligning brand, marketing, and operational goals.",
    soniaApproach: [
      "Build end-to-end marketing and operational structures from the ground up.",
      "Establish frameworks aligning brand, demand, and team leadership from day one.",
      "Mentor founders and teams to think strategically and execute decisively.",
    ],
    relevantVectors: ["brand", "operations", "people"],
    matchingServices: ["Marketing Strategy", "Leadership Development", "Team Building"],
    proofMandate: "Celestial AI (Noida) & AYU Inc USA (Boston)",
  },
  {
    id: "regulated-global",
    symptom: "Scaling a medical or specialized brand across global markets",
    contextTag: "Global & Compliance Alignment",
    rootCause:
      "Cross-border B2B/medical buyers require clarity, trust, and strict regulatory alignment without losing human warmth.",
    soniaApproach: [
      "Craft a clean, compliant (e.g., TGA-aligned) brand experience tailored to buyers.",
      "Synchronize remote cross-functional teams across India, UAE, and US timezones.",
      "Anchor campaigns in market research, email strategy, and accountable CRM metrics.",
    ],
    relevantVectors: ["brand", "messaging", "operations"],
    matchingServices: ["Brand Marketing", "Email Marketing", "Training"],
    proofMandate: "AYU Lifescience (UAE) & Datt Mediproducts",
  },
];
