import { ModernShell } from "@/components/pages/ModernShell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ModernShell lang="en">{children}</ModernShell>;
}
