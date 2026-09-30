import type { Metadata } from "next";
import Link from "next/link";

import { DocsShell } from "@/components/docs/DocsNav";

export const metadata: Metadata = {
  title: "Sessions and panes",
  description:
    "What Bentomux keeps across restarts: the pty host daemon, the bentomux.json state file, and pane reattach.",
  alternates: { canonical: "/docs/session-state" },
};

export default function Page() {
  return (
    <DocsShell current="/docs/session-state">
      <article className="flex flex-col gap-10">
        <header className="flex flex-col gap-4">
          <p className="text-overline text-accent uppercase">Documentation</p>
          <h1 className="text-display-sm">Sessions and panes</h1>
          <p className="max-w-prose text-body-lg text-text-muted">
            Agents keep running when Bentomux does not. Here is what survives a quit, a crash, and a reboot
            &mdash; and what does not.
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">The pty host</h2>
          <p className="text-body-sm text-text-muted">
            A PTY dies with whoever holds its master file descriptor. When that was the app itself, quitting
            Bentomux closed the fd, the kernel hung up the slave, and every agent CLI in every pane took a{" "}
            <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">SIGHUP</code>.
          </p>
          <p className="text-body-sm text-text-muted">
            So the master fds live somewhere else. The first time you open a pane, Bentomux launches itself a
            second time as a background daemon and talks to it over a loopback socket.
          </p>
          <pre className="overflow-x-auto rounded-sm bg-canvas-raised px-4 py-3 text-mono text-text">{"bentomux --pty-host"}</pre>
          <p className="text-body-sm text-text-muted">
            The daemon publishes its port and a shared secret in an owner-only address file, and speaks
            newline-delimited JSON over the socket. Quitting, crashing, or force-quitting the app now leaves
            your agent CLIs running. The next launch asks the daemon which terms are still alive and
            reattaches to the same processes &mdash; the same pids, not respawns.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">What survives</h2>
          <div className="overflow-x-auto rounded-sm border border-border">
            <table className="w-full border-collapse text-left text-caption">
              <thead>
                <tr className="border-b border-border text-text-muted">
                  <th scope="col" className="px-4 py-3 font-medium">Event</th>
                  <th scope="col" className="px-4 py-3 font-medium">What happens</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 align-top">Switch tab or pane</td>
                  <td className="px-4 py-3 align-top">The shell and its agent keep running in the background.</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 align-top">Quit Bentomux</td>
                  <td className="px-4 py-3 align-top">Everything stays alive in the daemon. Reopen and the panes are still there.</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 align-top">Crash or force-quit</td>
                  <td className="px-4 py-3 align-top">Same as a clean quit &mdash; the daemon is a separate process.</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 align-top">Reboot</td>
                  <td className="px-4 py-3 align-top">
                    Processes are gone. Bentomux restores your layout and starts fresh shells.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top">App update</td>
                  <td className="px-4 py-3 align-top">
                    The daemon checks a protocol version on connect. If it disagrees, Bentomux replaces it and
                    moves the live terminals across.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-body-sm text-text-muted">
            When the last pane exits and the last client disconnects, the daemon waits ten seconds and then
            exits. Leaving a pane open is what keeps the session alive.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">What is not preserved</h2>
          <p className="text-body-sm text-text-muted">
            Bentomux is not tmux, and it does not pretend to be. Three things it does not do:
          </p>
          <ul className="flex list-disc flex-col gap-2 pl-5 text-body-sm text-text-muted">
            <li>
              <strong className="text-text">No reattach from another terminal.</strong> The daemon speaks to
              the app over a loopback socket with a local-only secret. Attach from a second machine or a plain
              shell: not supported.
            </li>
            <li>
              <strong className="text-text">No history replay.</strong> Reattaching restores the live screen,
              not a recording. Close the tab and its shell is gone &mdash; scrollback lives in the terminal
              emulator and dies with the pane.
            </li>
            <li>
              <strong className="text-text">No server-side layout.</strong> The layout is your state file, not
              a session the daemon owns.
            </li>
          </ul>
          <p className="text-body-sm text-text-muted">
            If you want agents to outlive a reboot, give them a session manager of their own &mdash; tmux
            inside a pane works fine.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-sm">The state file</h2>
          <p className="text-body-sm text-text-muted">
            Layout and preferences live in a single JSON file in the app data directory, as{" "}
            <code className="rounded-sm bg-surface px-1.5 py-0.5 text-mono">bentomux.json</code>. It records
            your workspaces, your tabs, and the split tree inside each tab &mdash; which pane sits where, in
            which direction, and how the borders were dragged.
          </p>
          <p className="text-body-sm text-text-muted">
            The file is written by the app. Edit it while Bentomux is closed, or the next write overwrites you.
            Exact locations are in <Link href="/docs/configuration" className="text-accent underline underline-offset-2">Configuration</Link>.
          </p>
        </section>

        <p>
          <Link href="/docs/configuration" className="text-caption text-accent underline underline-offset-2">
            Configuration &rarr;
          </Link>
        </p>
      </article>
    </DocsShell>
  );
}
