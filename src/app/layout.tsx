import type { Metadata, Viewport } from "next";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/600.css";
import { SONIA_PROFILE, MANDATES, SKILLS_MATRIX } from "@/data/sonia-profile";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sonia-clarity-lens.vercel.app";

export const viewport: Viewport = {
  themeColor: "#07080D",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Soniaa (Sonya 🔍) S. — Fractional CMO & Operations Advisor | The Clarity Lens",
    template: "%s | Soniaa S.",
  },
  description:
    "Explore the interactive Clarity Lens of Soniaa (Sonya) S. — Fractional CMO & Operations Advisor crafting human brands, clear strategy, and aligned growth engines across the US, UAE, and India.",
  keywords: [
    "Soniaa S",
    "Sonya specialist",
    "Fractional CMO",
    "Chief Marketing and Operations Advisor",
    "i-SmokeStack CMO",
    "Brand Strategy",
    "Marketing Operations",
    "B2B Growth Leadership",
    "IIM Bangalore Marketing",
    "Human Messaging",
  ],
  authors: [{ name: SONIA_PROFILE.displayName, url: SONIA_PROFILE.linkedinUrl }],
  creator: SONIA_PROFILE.displayName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: siteUrl,
    title: "Soniaa (Sonya 🔍) S. — Fractional CMO | The Clarity Lens",
    description:
      "I notice what others don't. The gaps, the confusion, the unspoken story—and I help make sense of it. Interactive digital identity & live causality experience.",
    siteName: "Soniaa S. · Clarity Lens",
    firstName: "Soniaa",
    lastName: "S.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soniaa (Sonya 🔍) S. — Fractional CMO | The Clarity Lens",
    description:
      "Fractional CMO crafting brands people can feel. Interactive Clarity Lens, 4-vector causality map & live engagement pulse.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

function buildStructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: "Soniaa (Sonya) S.",
      alternateName: "soniaspecialist",
      jobTitle: "Fractional CMO & Chief Marketing and Operations Advisor",
      description: SONIA_PROFILE.openingQuote,
      url: siteUrl,
      sameAs: [SONIA_PROFILE.linkedinUrl],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Gurugram",
        addressRegion: "Haryana",
        addressCountry: "IN",
      },
      alumniOf: SONIA_PROFILE.education.map((edu) => ({
        "@type": "CollegeOrUniversity",
        name: edu.school,
        sameAs: edu.url,
      })),
      worksFor: MANDATES.map((m) => ({
        "@type": "Organization",
        name: m.company,
        sameAs: m.companyUrl,
      })),
      knowsAbout: [
        ...SONIA_PROFILE.services,
        ...SKILLS_MATRIX.slice(0, 10).map((s) => s.name),
      ],
      hasCredential: SONIA_PROFILE.certifications.map((c) => ({
        "@type": "EducationalOccupationalCredential",
        name: c.title,
        recognizedBy: {
          "@type": "Organization",
          name: c.issuer,
        },
      })),
    },
  };

  return JSON.stringify(personSchema);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased text-slate-100 selection:bg-cyan-400/30">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: buildStructuredData() }}
        />
        {children}
      </body>
    </html>
  );
}
