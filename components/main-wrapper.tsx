'use client'

import { usePathname } from "next/navigation";

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // No wrapper on admin routes
  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  return <main className="container py-6">{children}</main>;
}
