import { ModernShell } from "@/components/pages/ModernShell";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ModernShell lang="zh-Hans">{children}</ModernShell>;
}
