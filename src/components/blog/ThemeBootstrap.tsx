/**
 * Forces `data-theme="light"` on <html> before paint.
 *
 * The site is now hard-locked to light — the retro homepage owns its own
 * dark CRT skin via the .retro-root class (independent of data-theme),
 * and the blog uses the Starbucks-inspired light palette. Dark mode for
 * the blog has been retired (per design direction: "博客使用浅色系").
 *
 * Kept as an inline pre-paint script so we never get a flash of stale
 * theme from a previous visit's localStorage value.
 */
export function ThemeBootstrap() {
  const code = `
(function () {
  try {
    document.documentElement.setAttribute("data-theme", "light");
    // Clean up any legacy "dark" preference from older visits.
    if (localStorage.getItem("theme") === "dark") {
      localStorage.removeItem("theme");
    }
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
