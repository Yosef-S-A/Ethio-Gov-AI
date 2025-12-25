"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Gavel } from "lucide-react";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("auth-token");
    if (!token) {
      router.push("/auth/sign-in");
    }
  }, [router]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  );
}
