import type React from "react";

import { Sidebar } from "@/components/sidebar";
import { RedirectToSignIn } from "@daveyplate/better-auth-ui";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background w-full">
      <RedirectToSignIn />
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  );
}
