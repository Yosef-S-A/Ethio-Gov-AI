import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to the dashboard — it will forward unauthenticated users to sign-in
  redirect("/dashboard");
}
