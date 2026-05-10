import { ModernShell } from "@/components/pages/ModernShell";

export default function ArchiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ModernShell lang="zh-Hant">{children}</ModernShell>;
}
