/**
 * Theme toggle — retired.
 *
 * The site is now light-locked (per design direction: "博客使用浅色系").
 * The retro homepage handles its own dark CRT skin via .retro-root and
 * does not participate in the data-theme system.
 *
 * The component is kept as an exported no-op so any existing imports
 * keep compiling, but it renders nothing.
 */
export function ThemeToggle() {
  return null;
}
