export function formatDate(d: string | Date, locale = "zh-CN"): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(d: string | Date): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${day}`;
}
