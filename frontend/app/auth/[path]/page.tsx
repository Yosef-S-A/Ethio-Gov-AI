import { AuthView } from "@daveyplate/better-auth-ui";
import { authViewPaths } from "@daveyplate/better-auth-ui/server";
import { Scale } from "lucide-react";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  return (
    <main className="container flex border-4 h-full grow items-center justify-center self-center">
      <div className="hidden lg:flex lg:w-1/2 h-full bg-linear-to-br from-emerald-900 via-emerald-800 to-emerald-900 p-12 flex-col justify-between text-white">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Scale className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-serif font-bold">{"EthioGov AI"}</h1>
          </div>

          <div className="space-y-4 max-w-lg">
            <h2 className="text-4xl font-serif font-bold leading-tight">
              {"Join the Future of Legal Research"}
            </h2>
            <p className="text-emerald-100 text-lg leading-relaxed">
              {
                "Create your account to access AI-powered legal research tools designed specifically for Ethiopian government professionals."
              }
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="text-3xl font-bold">{"500+"}</div>
              <div className="text-emerald-200 text-sm">
                {"Proclamations Indexed"}
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="text-3xl font-bold">{"100%"}</div>
              <div className="text-emerald-200 text-sm">
                {"Offline Capable"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full border flex justify-center">
          <AuthView path={path} />
        </div>
      </div>
    </main>
  );
}
