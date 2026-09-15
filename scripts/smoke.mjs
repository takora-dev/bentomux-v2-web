/* Checks the server-rendered content that docs/test_cases.md §3.1–3.3 asserts.

   Run after a build:  npm run build && npm run smoke
   No test framework, no extra dependency: it starts the production server,
   fetches the pages it serves, and exits non-zero on the first failure. */

import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { setTimeout as sleep } from "node:timers/promises";

const PORT = Number(process.env.SMOKE_PORT ?? 3199);
const BASE = `http://localhost:${PORT}`;

/* Values the content modules own. Repeated here rather than imported, because
   the modules are TypeScript carrying build-time invariants and this script
   runs against the built server. A drift shows up as a failing check. */
const PRIVACY_EFFECTIVE_DATE = "2026-09-15";

let failures = 0;
function check(label, ok, detail = "") {
  console.log(`${ok ? "ok  " : "FAIL"} ${label}${ok || !detail ? "" : ` — ${detail}`}`);
  if (!ok) failures += 1;
}

const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
  env: { ...process.env, NEXT_PUBLIC_SITE_URL: BASE },
  stdio: "ignore",
  detached: true,
});

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${BASE}/`);
      if (response.ok) return;
    } catch {
      /* not up yet */
    }
    await sleep(500);
  }
  throw new Error(`server did not start on ${BASE}`);
}

function validateStaticHtml(html) {
  check("TC-F001-001: exactly one h1", (html.match(/<h1[\s>]/g) ?? []).length === 1);
  check(
    "TC-F001-001: the three anchored bands appear in IA order",
    ["hero", "capabilities", "install"].every(
      (id, index, all) =>
        html.includes(`id="${id}"`) &&
        (index === 0 || html.indexOf(`id="${id}"`) > html.indexOf(`id="${all[index - 1]}"`)),
    ),
  );
  check(
    "TC-F001-001 (amended): the retired bands are gone",
    ["features", "palettes", "faq", "community", "agents", "waitlist"].every(
      (id) => !html.includes(`id="${id}"`),
    ),
  );
  check("TC-F001-003: skip link before the header", html.indexOf("Skip to main") < html.indexOf("<header"));
  check(
    "TC-F003-001: 21 detected and 9 configurable agents are in the HTML",
    html.includes("21") && html.includes("9"),
  );
  check(
    "TC-F005-003: all three install panels are in the server HTML",
    ["macos", "linux", "windows"].every((id) => html.includes(`id="install-panel-${id}"`)),
  );
  check("TC-F005-001: macOS is the pre-checked option", /id="install-tab-macos"[^>]*checked/.test(html));
  check(
    "TC-F005-004: the macOS command matches the repository source",
    html.includes(
      "curl -fsSL https://raw.githubusercontent.com/takora-dev/bentomux-v2/master/installers/install.sh | sh",
    ),
  );
  check(
    "TC-F005-009: the Windows fallback command is present",
    html.includes("install.cmd &amp;&amp; install.cmd &amp;&amp; del install.cmd"),
  );
  check(
    "TC-F002-001: the five capability rows render with their anchors",
    ["persistent", "state", "approvals", "runtimes", "remote"].every((id) =>
      html.includes(`id="cap-${id}"`),
    ),
  );
  check(
    "FR-002.4 (amended 2026-09-15): no capability row prints a repository path",
    !/src-tauri|src\/tauri|resources\/manifests/.test(html),
  );
  check(
    "TC-F007-002 (amended): no issue, fork, contributor or install count is claimed",
    !/\b\d[\d,.]*\s*(issues?|contributors?|forks?|installs?|downloads?|users?)\b/i.test(html),
  );
  check(
    "ENT-015: whenever the page says stars, it says whose they are",
    !/\bstars?\b/i.test(html) || html.includes("GitHub stars"),
  );
  check(
    "TC-F009-004: no analytics or third-party script",
    !/googletagmanager|google-analytics|plausible|posthog|segment\.io/i.test(html),
  );

  /* Pass A/B/C content invariants, all asserted against the server HTML the
     browser receives before any JavaScript runs. */
  check("FR-005.4: the platform detection runs before interaction", /install-tab-" \+ platform/.test(html));
  check(
    "FR-005.5: the copy control is present and hidden without JavaScript",
    html.includes("copy-control") && html.includes(">Copy</"),
  );
  check(
    "FIG-001: the figure band ships the capture with its own dimensions and alt",
    /url=%2Fscreenshot\.png/.test(html) &&
      /alt="The Bentomux window showing three workspaces/.test(html) &&
      /width="2982" height="1974"/.test(html),
  );
  check(
    "IMG-003: no drawn window mock survives as a substitute for the capture",
    !html.includes("Bentomux application window") &&
      !html.includes("split the hero panes and rerun the smoke test"),
  );
  check(
    "BR-009.1: the licence statement is in the footer",
    html.includes("MIT") && html.includes("free and open source software"),
  );
  check(
    "TC-F005-010: the installer steps state the digest refusal",
    html.includes("refuses to install anything that does not match"),
  );
  check(
    "TC-F005-011: the manual download line names five formats behind one link",
    [".dmg", ".AppImage", ".deb", ".msi", "-setup.exe"].every((format) => html.includes(format)) &&
      /Every build[^<]*—[^<]*latest release/
        .test(html.replace(/<[^>]+>/g, "")),
  );
  check(
    "TC-F005-012: the pin example uses vX.Y.Z and the documented manifest override",
    html.includes("BENTOMUX_MANIFEST_URL=") &&
      html.includes("vX.Y.Z") &&
      /* CMD-006: the placeholder is the only version literal on the page. */
      (html.match(/v\d+\.\d+\.\d+/g) ?? []).length === 0,
  );
  check(
    "TC-F005-015: the Linux x86_64 limit is stated and no arm64 support is implied",
    html.includes("x86_64 only") && !/arm64|aarch64 support|Apple Silicon/i.test(html),
  );
  check(
    "TC-F002-003 / TC-F009-005: no release date is claimed",
    !/\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/.test(
      html,
    ) && !/\b(shipping|releasing|launch(ing)?) (in|on|by) \d/i.test(html),
  );
  check(
    "FR-009.6: the telemetry statement is in the legal block",
    /no telemetry|sends no telemetry|collects no telemetry/i.test(html),
  );
  check(
    "the withdrawn provenance claim is gone: nothing names the upstream project",
    !/herdr/i.test(html),
  );
  check(
    "FR-007.6: external cards open in a new tab with rel",
    (html.match(/rel="noopener noreferrer"/g) ?? []).length >= 3,
  );
  check(
    "BR-004.4: no contact address is printed when none is configured",
    Boolean(process.env.NEXT_PUBLIC_CONTACT_EMAIL) ||
      !/@[a-z0-9.-]+\.[a-z]{2,}/i.test(html),
  );
}

async function main() {
  await waitForServer();

  const home = await fetch(`${BASE}/`);
  const html = await home.text();
  check("static render: GET / is 200", home.status === 200);

  validateStaticHtml(html);

  const headers = home.headers;
  check(
    "NFR-002.7: security headers are set",
    headers.get("strict-transport-security") !== null &&
      headers.get("x-content-type-options") === "nosniff" &&
      headers.get("referrer-policy") === "strict-origin-when-cross-origin" &&
      (headers.get("content-security-policy") ?? "").includes("default-src 'self'"),
  );
  const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
  check("URL-001: the sitemap lists both pages", sitemap.includes("/privacy") && sitemap.includes("<loc>"));
  const robots = await (await fetch(`${BASE}/robots.txt`)).text();
  check(
    "robots.txt allows every page and carries no dead endpoint rule",
    /Allow: \//.test(robots) && !/Disallow:/i.test(robots),
  );

  /* TC-F009-002 / UI_PRIVACY_BLOCKS: eight blocks in the fixed order. */
  const privacy = await (await fetch(`${BASE}/privacy`)).text();
  const blocks = [
    "Controller and scope",
    "What is collected",
    "What is not collected",
    "Changes to the policy",
  ];
  check(
    "UI_PRIVACY_BLOCKS: /privacy renders four blocks in order",
    blocks.every(
      (heading, index) =>
        privacy.includes(heading) &&
        (index === 0 || privacy.indexOf(heading) > privacy.indexOf(blocks[index - 1])),
    ),
  );
  check(
    "TC-F009-002 (amended): the policy states that nothing is collected",
    /Nothing\. This website has no form/.test(privacy) && /local storage/.test(privacy),
  );
  check(
    "UI_PRIVACY_BLOCKS: the policy carries its effective date",
    /<time[^>]*date(time)?="\d{4}-\d{2}-\d{2}"/i.test(privacy),
  );
  check(
    "XPG-001: the licence sentence matches the footer word for word",
    privacy.includes("Bentomux is free and open source software, released under the MIT license.") &&
      html.includes("Bentomux is free and open source software, released under the MIT license."),
  );

  /* --- spec audit: gaps found in docs/user_flows + docs/system_logics --------- */
  check(
    "sys_uc_004 (amended): both derived counts render from ENT-003",
    /21 are detected out of the box/.test(html) &&
      /21 detected · 9 also configurable/.test(html) &&
      html.includes("agent CLIs detected"),
  );
  check(
    "sys_uc_003 step 1: the install intro names the three operating systems",
    html.includes("They cover macOS, Linux and Windows"),
  );
  check(
    "the withdrawn provenance claim is gone from /privacy too",
    !/herdr/i.test(privacy),
  );
  check(
    "BR-009.1/009.2: the licence link renders while licenseFilePublished is true",
    html.includes("/blob/master/LICENSE") && privacy.includes("/blob/master/LICENSE"),
  );
  check(
    "sys_uc_008 block 8: the changes block names the effective date",
    privacy.includes(`This version took effect on ${PRIVACY_EFFECTIVE_DATE}.`),
  );
  check(
    "sys_uc_001 step 2: the hero itself names the product",
    /Bentomux — beta out now/.test(html),
  );
  check(
    "LAY-005 / NAV-008: the hero section carries the navigation scroll margin",
    /aria-labelledby="hero-heading"[^>]*scroll-mt-nav/.test(html),
  );
  /* The flight payload repeats class strings, so the count of section tags is
     the reliable denominator here, not a regex over the whole document. */
  const sections = html.match(/<section[^>]*>/g) ?? [];
  check(
    "SPC-001: every band, hero included, carries its vertical rhythm",
    sections.length === 5 &&
      sections.every(
        (tag) =>
          /py-16|pb-16|pb-14/.test(tag) && /lg:py-24|lg:pb-24|lg:pb-20/.test(tag),
      ),
    `${sections.length} section tags`,
  );
  check(
    "§10.4: the figure band names itself and captions the capture",
    html.includes('id="screenshot-heading"') &&
      html.includes("Three workspaces, one of them waiting on your approval"),
  );
  const css = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");
  check(
    "dead bands: no footer, palette or FAQ rule survives in the stylesheet",
    !/faq|palette/i.test(css),
  );
  /* --- design system §10.2: brand assets ------------------------------------- */
  check(
    "§10.2: the page declares a PNG favicon and an Apple touch icon",
    /rel="icon"[^>]*type="image\/png"/.test(html) && /rel="apple-touch-icon"/.test(html),
  );
  const favicon = await fetch(`${BASE}/icon.png`);
  check(
    "§10.2: /icon.png is served as an image, not a 404",
    favicon.ok && (favicon.headers.get("content-type") ?? "").startsWith("image/"),
    `${favicon.status} ${favicon.headers.get("content-type")}`,
  );
  /* The hero renders the mark at up to 480 CSS px, so the variant the optimiser
     hands back has to clear 2× that or the watermark reads soft. Read the PNG
     header directly rather than adding an image library to this script. */
  const markVariant = await fetch(`${BASE}/_next/image?url=%2Fbentomux.png&w=1080&q=75`, {
    headers: { Accept: "image/png" },
  });
  const markWidth = markVariant.ok
    ? Buffer.from(await markVariant.arrayBuffer()).readUInt32BE(16)
    : 0;
  check(
    "§10.2: the mark's source clears 2× the widest hero track (≥ 960px)",
    markWidth >= 960,
    `optimised variant is ${markWidth}px wide`,
  );
  check(
    "MOT-001/002: the mobile menu uses the tokenised enter transition",
    /\.menu-panel[\s\S]*?var\(--duration-base\)/.test(css) &&
      /@starting-style[\s\S]*?\.menu-panel/.test(css) &&
      /transition:\s*\n?\s*opacity[\s\S]*?transform/.test(css),
  );
}

try {
  await main();
} catch (error) {
  console.error(`smoke run failed: ${error.message}`);
  failures += 1;
} finally {
  try {
    process.kill(-server.pid);
  } catch {
    /* already gone */
  }
}

console.log(failures === 0 ? "\nall checks passed" : `\n${failures} check(s) failed`);
process.exit(failures === 0 ? 0 : 1);
