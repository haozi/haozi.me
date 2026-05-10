import { ModernShell } from "@/components/pages/ModernShell";

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ModernShell lang="zh-Hant">{children}</ModernShell>;
}
