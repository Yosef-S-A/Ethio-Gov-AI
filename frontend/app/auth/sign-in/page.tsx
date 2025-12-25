import { SignInCard } from "@/components/auth/sign-in-card"
import { Scale } from "lucide-react"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Ethiopian Government Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 p-12 flex-col justify-between text-white">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Scale className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-serif font-bold">{"EthioGov AI"}</h1>
          </div>

          <div className="space-y-4 max-w-lg">
            <h2 className="text-4xl font-serif font-bold leading-tight">
              {"AI-Powered Legal Research for Ethiopian Government"}
            </h2>
            <p className="text-emerald-100 text-lg leading-relaxed">
              {
                "Access comprehensive legal documentation, proclamations, and regulations with intelligent AI assistance powered by local processing."
              }
            </p>
          </div>
        </div>

        <div className="space-y-4 max-w-lg">
          <div className="border-l-4 border-white/30 pl-4 py-2">
            <blockquote className="text-emerald-50 italic text-lg leading-relaxed font-serif">
              {'"Justice is the constant and perpetual will to allot to every person their due."'}
            </blockquote>
            <p className="text-emerald-200 text-sm mt-2">{"— Ethiopian Legal Principle"}</p>
          </div>

          <div className="flex items-center gap-2 text-emerald-200 text-sm">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{"Sovereign Processing • Data Privacy • Offline Capable"}</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <SignInCard />
        </div>
      </div>
    </div>
  )
}
