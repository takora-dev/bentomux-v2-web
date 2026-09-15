import type { NextConfig } from "next";

/* NFR-002.7. The CSP permits only what the site actually loads: its own
   origin, plus the inline JSON-LD block and Next.js's inline bootstrap, which
   is why `script-src` keeps 'unsafe-inline' for scripts written by the build. */
/* React only needs eval() in development (callstack reconstruction, HMR).
   Production keeps the strict policy. */
const scriptSrc =
  process.env.NODE_ENV === "production"
    ? "script-src 'self' 'unsafe-inline'"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

const contentSecurityPolicy = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

/* Short links for the three installer scripts, so the one-liners can be typed
   or pasted as `<host>/install.sh`, `<host>/install.ps1` and `<host>/install.cmd`
   instead of the 88-character raw.githubusercontent.com URLs. The path mirrors
   the file it serves, so the redirect table needs no legend — what a visitor
   reads in the URL is the name the installer repository publishes. Linux
   shares `/install.sh` with macOS because that script covers both.

   Each entry is a redirect, not a copy: the bytes the shell executes are still
   the ones `installers/*` serves, so the page can keep quoting the repository
   string verbatim (`BR-005.1`) and no second copy can drift (`CON-014`). */
const RAW_INSTALLERS =
  "https://raw.githubusercontent.com/takora-dev/bentomux-v2/master/installers";

const installerShortLinks = [
  { source: "/install.sh", file: "install.sh" },
  { source: "/install.ps1", file: "install.ps1" },
  { source: "/install.cmd", file: "install.cmd" },
] as const;

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  async redirects() {
    return installerShortLinks.map(({ source, file }) => ({
      source,
      destination: `${RAW_INSTALLERS}/${file}`,
      /* 307, not 308: curl and proxies cache a permanent redirect hard, so a
         future move of an installer could not be corrected for those clients. */
      permanent: false,
    }));
  },
  images: {
    /* IMG-002: AVIF/WebP at display dimensions. */
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
