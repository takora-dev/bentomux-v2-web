import Link from "next/link";

import { footerLegal, opensInNewTab } from "@/content/chrome";
import { site } from "@/content/site";
import { fetchLatestTag } from "@/content/stats";

import { GitHubIcon } from "../ui/icons";
import { Logo } from "./SkipLink";

export async function SiteFooter() {
  const tag = await fetchLatestTag();
  return (
    <footer id="footer" className="flex flex-col gap-3 border-t border-border px-4 py-5 text-caption text-text-subtle lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-6 lg:gap-y-3 lg:px-10">
      <div className="flex items-center gap-6">
        <Link href="/" aria-label="Bentomux — home" className="flex items-center rounded-sm">
          <Logo height={20} className="flex items-center" />
        </Link>
        <Link href="/docs" className="text-text-muted hover:text-text">
          docs
        </Link>
        <Link href="/compare" className="text-text-muted hover:text-text">
          compare
        </Link>
        <Link href={site.privacyPath} className="text-text-muted hover:text-text">
          privacy
        </Link>
      </div>

      <span className="text-text-subtle">the window for coding agents · © {new Date().getFullYear()} Bentomux</span>

      <span className="flex w-full items-center justify-between lg:contents">
        <span className="tabular-nums">{tag ?? "v0.2.14"} · {site.licenseId}</span>
        <span className="inline-flex items-center gap-4 lg:ml-auto">
          <a
            href={site.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Bentomux on GitHub"
            className="inline-flex text-text-subtle hover:text-text"
          >
            <GitHubIcon className="size-4" />
            <span className="sr-only">{opensInNewTab}</span>
          </a>
          {site.contactEmail ? (
            <a href={`mailto:${site.contactEmail}`} className="text-text-muted hover:text-text">
              {site.contactEmail}
            </a>
          ) : null}
          <span className="sr-only">{footerLegal.heading}</span>
        </span>
      </span>
    </footer>
  );
}
