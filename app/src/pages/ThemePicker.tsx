import { useEffect, useMemo, useState } from "react";

const THEMES = [
  // keep in sync with tailwind.config.js → daisyui.themes
  "light","dark","cupcake","bumblebee","emerald","corporate","synthwave",
  "retro","cyberpunk","valentine","halloween","garden","forest","aqua",
  "lofi","pastel","fantasy","wireframe","black","luxury","dracula",
  "cmyk","autumn","business","acid","lemonade","night","coffee","winter",
  "dim","nord","sunset",
] as const;
type Theme = (typeof THEMES)[number];

export default function ThemePicker() {
  const prefersDark = useMemo(
    () => window.matchMedia?.("(prefers-color-scheme: dark)").matches,
    []
  );
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("theme") || "light"
  );

  const effectiveTheme: Theme = (theme === "system"
    ? (prefersDark ? "dark" : "light")
    : theme) as Theme;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", effectiveTheme);
    localStorage.setItem("theme", theme);
  }, [theme, effectiveTheme]);

  return (
    <div className="flex items-center gap-2">
      <select
        className="select select-bordered select-sm"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      >
        <option value="system">system</option>
        {THEMES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}
