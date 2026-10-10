"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle light and dark mode"
      title="Toggle light and dark mode"
      className="fixed right-4 top-4 z-[6000] inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-sm backdrop-blur-md transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple"
    >
      <Sun aria-hidden="true" className="hidden h-5 w-5 dark:block" />
      <Moon aria-hidden="true" className="h-5 w-5 dark:hidden" />
    </button>
  );
}
