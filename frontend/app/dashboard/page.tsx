"use client"

import { useState, Suspense } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Send, Paperclip, User, LogOut, CheckCircle, FileDown } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  source?: string
}

function UserProfileDropdown() {
  const handleSignOut = async () => {
    await authClient.signOut()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="ml-4" size="icon">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{"Demo User"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          {"Sign Out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "user",
      content: "What are the key provisions of Proclamation 707/2011 regarding data protection?",
    },
    {
      id: "2",
      role: "assistant",
      content:
        "Proclamation 707/2011 establishes comprehensive data protection requirements for Ethiopian organizations. Key provisions include:\n\n1. **Data Collection**: Organizations must obtain explicit consent before collecting personal data\n2. **Data Security**: Mandatory security measures to protect against unauthorized access\n3. **Rights of Data Subjects**: Individuals have the right to access, correct, and delete their personal data\n4. **Cross-border Transfer**: Restrictions on transferring data outside Ethiopia without proper safeguards\n\nThese provisions align with international standards while addressing Ethiopia's specific regulatory needs.",
      source: "Federal Negarit Gazeta No. 707/2011, Articles 3-7",
    },
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages([...messages, userMessage])
    setInput("")

    // Mock assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I've analyzed the relevant proclamations and regulations. Based on the Federal Negarit Gazeta archives, here is the information you requested...",
        source: "Multiple sources indexed",
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  return (
    <>
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search Proclamations..." className="pl-10 bg-background border-border" />
            </div>
          </div>
          <Suspense
            fallback={
              <Button variant="ghost" className="ml-4" size="icon">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            }
          >
            <UserProfileDropdown />
          </Suspense>
        </div>
      </header>

      {/* Chat Stream */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === "user"
                    ? "bg-slate-100 text-slate-900"
                    : "bg-card border border-border text-foreground"
                }`}
              >
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
                {message.role === "assistant" && message.source && (
                  <div className="mt-4 pt-4 border-t border-border space-y-3">
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="font-medium text-emerald-700">{"Verified Source"}</span>
                    </div>
                    <div className="text-xs text-muted-foreground italic">
                      {"Cited from: "}
                      {message.source}
                    </div>
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      <FileDown className="mr-2 h-3.5 w-3.5" />
                      {"Export Legal Memo"}
                    </Button>
                  </div>
                )}
              </div>
              {message.role === "user" && (
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-slate-200 text-slate-700">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="border-t border-border bg-card p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            </Button>
            <div className="flex-1">
              <Input
                placeholder="Ask about Ethiopian laws, proclamations, or regulations..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                className="min-h-[44px] resize-none bg-background"
              />
            </div>
            <Button
              size="icon"
              className="flex-shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-center text-muted-foreground">
            {"Powered by local Llama 3.2 model • All processing happens on your device"}
          </div>
        </div>
      </div>
    </>
  )
}
