"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export function WorkspaceShell({
  sidebar,
  topbar,
  children,
}: {
  sidebar: ReactNode;
  topbar: ReactNode;
  children: ReactNode;
}) {
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile drawer whenever the page changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close the mobile drawer with the Escape key
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  function toggle() {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setDesktopOpen((open) => !open);
    } else {
      setMobileOpen((open) => !open);
    }
  }

  return (
    <div className="flex min-h-dvh">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="workspace-sidebar"
        data-collapsed={!desktopOpen}
        className={cn(
          "group/sidebar fixed inset-y-0 left-0 z-40 w-12 border-r border-border bg-surface transition-[width] duration-200",
          "lg:sticky lg:top-0 lg:h-dvh",
          mobileOpen && "w-64",
          desktopOpen ? "lg:w-64" : "lg:w-12",
        )}
      >
        <div
          className={cn(
            "flex h-12 items-center border-b border-border",
            mobileOpen
              ? "justify-end px-2"
              : "justify-center lg:justify-end lg:px-2",
          )}
        >
          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle sidebar"
            aria-controls="workspace-sidebar"
            className="grid size-9 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-background hover:text-foreground"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(
                "size-5 transition-transform",
                mobileOpen ? "rotate-0" : "rotate-180",
                desktopOpen ? "lg:rotate-0" : "lg:rotate-180",
              )}
            >
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M9 4v16M14 9l-3 3 3 3" />
            </svg>
          </button>
        </div>
        <div
          className={cn(
            "min-h-0 flex-1 overflow-hidden",
            mobileOpen ? "block" : "hidden lg:block",
          )}
        >
          {sidebar}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pl-12 lg:pl-0">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-surface px-4 py-3 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
            {topbar}
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
