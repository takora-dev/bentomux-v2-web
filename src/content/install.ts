/* InstallOption, InstallCommand, InstallerStep, ManualDownloadList —
   ENT-005, ENT-010, ENT-011, ENT-012.

   Every command is transcribed from takora-dev/bentomux-v2, byte for byte
   (BR-005.1). `sourcePath` records where it was copied from so a drift check
   is a string comparison. The only composed command is the pin example
   permitted by FR-005.12; its manifest URL is the installer's own default with
   `/latest/download/` replaced by `/download/vX.Y.Z/`. */

import { invariant, requireCount, requireNonEmpty, requireUnique } from "./validate";
import { site } from "./site";

const RAW = "https://raw.githubusercontent.com/takora-dev/bentomux-v2/master/installers";
const MANIFEST = `https://github.com/takora-dev/bentomux-v2/releases/download/vX.Y.Z/latest.json`;

export type InstallPanelId = "macos" | "linux" | "windows";

export type InstallCommand = {
  readonly id: string;
  readonly panelId: InstallPanelId;
  readonly command: string;
  readonly kind: "install" | "fallback" | "pin";
  readonly caption: string;
  readonly requiresRoot: boolean;
  readonly sourcePath: string;
  readonly order: number;
};

export type InstallOption = {
  readonly id: InstallPanelId;
  readonly label: string;
  readonly isDefault: boolean;
  readonly notes: readonly string[];
  readonly order: number;
};

export const installOptions: readonly InstallOption[] = [
  {
    id: "macos",
    label: "macOS",
    isDefault: true,
    notes: [
      "The published build is unsigned and not notarized. macOS may ask you to confirm the first launch under System Settings → Privacy & Security.",
    ],
    order: 1,
  },
  {
    id: "linux",
    label: "Linux",
    isDefault: false,
    notes: [
      "The --deb alternative installs the Debian package through apt and needs root.",
      "On some distributions an AppImage needs libfuse2: sudo apt install libfuse2",
    ],
    order: 2,
  },
  {
    id: "windows",
    label: "Windows",
    isDefault: false,
    notes: ["The per-user setup installs without administrator rights."],
    order: 3,
  },
] as const;

export const installCommands: readonly InstallCommand[] = [
  {
    id: "macos-install",
    panelId: "macos",
    command: `curl -fsSL ${RAW}/install.sh | sh`,
    kind: "install",
    caption: "macOS install command — downloads the .dmg and installs the .app bundle",
    requiresRoot: false,
    sourcePath: "installers/install.sh",
    order: 1,
  },
  {
    id: "pin-example",
    panelId: "macos",
    command: `curl -fsSL ${RAW}/install.sh | BENTOMUX_MANIFEST_URL=${MANIFEST} sh`,
    kind: "pin",
    caption: "Pinned install of one release, using the same installer",
    requiresRoot: false,
    sourcePath: "installers/install.sh (composed pin form — FR-005.12)",
    order: 2,
  },
  {
    id: "linux-install",
    panelId: "linux",
    command: `curl -fsSL ${RAW}/install.sh | sh`,
    kind: "install",
    caption: "Linux install command — installs the AppImage and a desktop entry",
    requiresRoot: false,
    sourcePath: "installers/install.sh",
    order: 1,
  },
  {
    id: "linux-deb",
    panelId: "linux",
    command: `curl -fsSL ${RAW}/install.sh | sh -s -- --deb`,
    kind: "fallback",
    caption: "Linux install command for the .deb package, through apt/dpkg (needs root)",
    requiresRoot: true,
    sourcePath: "installers/install.sh — usage: install.sh [--deb | --appimage]",
    order: 2,
  },
  {
    id: "windows-install",
    panelId: "windows",
    command: `powershell -ExecutionPolicy Bypass -c "irm ${RAW}/install.ps1 | iex"`,
    kind: "install",
    caption: "Windows install command — runs the PowerShell installer",
    requiresRoot: false,
    sourcePath: "installers/install.ps1",
    order: 1,
  },
  {
    id: "windows-cmd-fallback",
    panelId: "windows",
    command: `curl.exe -fsSLo install.cmd ${RAW}/install.cmd && install.cmd && del install.cmd`,
    kind: "fallback",
    caption: "Windows fallback for environments that block PowerShell from the internet",
    requiresRoot: false,
    sourcePath: "installers/install.cmd",
    order: 2,
  },
] as const;

export const installerSteps = [
  {
    id: "resolve",
    text: "Reads the release manifest published by the build workflow to find the build for your platform.",
    order: 1,
  },
  {
    id: "verify",
    text: "Verifies the download against its SHA-256 digest and refuses to install anything that does not match.",
    order: 2,
  },
  {
    id: "install",
    text: "Installs the application without asking for administrator rights on macOS and Windows.",
    order: 3,
  },
] as const;

export const manualDownloads = {
  formats: [".dmg", ".AppImage", ".deb", ".msi", "-setup.exe"],
  label: "Prefer to download it yourself?",
  /* CMD-005: five format names as text, then exactly one link. */
  sentence: {
    before: "Every build — ",
    between: " — is attached to the ",
    link: "latest release",
    after: ".",
  },
  url: site.releasesLatestUrl,
} as const;

/** §9.9–§9.10 — the switcher's own labels and the copy control's feedback. */
export const installCopy = {
  platformLegend: "Choose your platform",
  copy: {
    idle: "Copy",
    copied: "Copied",
    /* CPY-002 fixes this sentence. */
    failed: "Copy failed — select the command manually",
  },
} as const;

/** FR-005.4 / TC-F005-014. Detection runs once, while the document is parsed and
 *  before the visitor can touch anything, then never again — so an explicit
 *  selection can never be overridden and nothing shifts on screen. The panel
 *  text is identical whichever option ends up checked; only the checked input
 *  changes. No-JS and unknown platforms keep the server-rendered default. */
export const platformDetectionScript = `(() => {
  const hint = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || navigator.userAgent || "";
  const platform = /mac/i.test(hint) ? "macos" : /win/i.test(hint) ? "windows" : /linux|x11/i.test(hint) ? "linux" : null;
  if (!platform) return;
  const input = document.getElementById("install-tab-" + platform);
  if (input instanceof HTMLInputElement && !input.checked) {
    input.checked = true;
  }
})();`;

invariant(
  installOptions.filter((option) => option.isDefault).length === 1 &&
    installOptions.find((option) => option.isDefault)?.id === "macos",
  "exactly one install option is selected in the server-rendered HTML and it must be macOS (FR-005.2)",
);
invariant(
  installCommands.filter((command) => command.kind === "pin").length === 1,
  "exactly one pin example is permitted in the module (FR-005.12)",
);
invariant(
  installCommands.filter((command) => command.requiresRoot).length === 1,
  "only the Linux --deb command may require root (BR-005.5)",
);
for (const command of installCommands) {
  requireNonEmpty(command.command, `installCommands.${command.id}.command`);
  invariant(
    !command.command.includes("\n"),
    `[content] installCommands.${command.id}.command must be a single line (CMD-003)`,
  );
  invariant(
    installOptions.some((option) => option.id === command.panelId),
    `installCommands.${command.id} points at an unknown panel`,
  );
}
requireCount(installOptions, 3, "installOptions");
requireCount(installerSteps, 3, "installerSteps");
requireCount(manualDownloads.formats, 5, "manualDownloads.formats");
requireUnique(installCommands, (command) => command.id, "installCommands");
requireUnique(installOptions, (option) => option.id, "installOptions");

export function commandsForPanel(panelId: InstallPanelId): readonly InstallCommand[] {
  return installCommands
    .filter((command) => command.panelId === panelId)
    .sort((a, b) => a.order - b.order);
}
