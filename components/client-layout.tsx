"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNavbar = pathname !== "/";

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
}