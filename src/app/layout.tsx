import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";

import { site } from "@/content/site";

import "./globals.css";

/* One webfont family only (§13): Archivo for display type, system stack for
   body text and mono. */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: site.defaultTitle,
    template: site.titleTemplate,
  },
  description: site.defaultDescription,
  applicationName: site.siteName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.siteUrl,
    siteName: site.siteName,
    title: site.defaultTitle,
    description: site.defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: site.defaultTitle,
    description: site.defaultDescription,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#17181B",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        {/* NFR-008.3: structured data describing the project, no third party. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: site.siteName,
              applicationCategory: "DeveloperApplication",
              operatingSystem: site.operatingSystems,
              description: site.defaultDescription,
              url: site.siteUrl,
              license: `${site.repositoryUrl}/blob/master/LICENSE`,
              codeRepository: site.repositoryUrl,
              isAccessibleForFree: true,
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
