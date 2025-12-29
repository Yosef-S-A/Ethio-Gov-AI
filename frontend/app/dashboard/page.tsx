"use client";

import { useState, Suspense, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Send,
  Paperclip,
  User,
  LogOut,
  CheckCircle,
  FileDown,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: string;
  sources?: { file: string; page: string; snippet: string }[];
  isLoading?: boolean;
}

function UserProfileDropdown() {
  const handleSignOut = async () => {
    await authClient.signOut();
  };

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
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {"Sign Out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chatContainerRef.current) return;
    // scroll a little after messages update so the DOM has rendered
    const t = setTimeout(() => {
      try {
        chatContainerRef.current?.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      } catch (e) {
        /* ignore */
      }
    }, 50);

    return () => clearTimeout(t);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    // Prepare the UI messages and 'thinking' placeholder in a single update
    const loadingId = `loading-${Date.now()}`;
    const loadingMessage: Message = {
      id: loadingId,
      role: "assistant",
      content: "Thinking...",
      isLoading: true,
    };

    const nextMessages = [...messages, userMessage, loadingMessage];
    setMessages(nextMessages);
    setIsLoading(true);

    // Build the history payload including recent messages (include the new user message and previous assistant replies)
    const historyPayload = nextMessages
      .filter((m) => !m.isLoading)
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.content }));

    // keep local copy of input for request; include persisted summary if available
    const payload = {
      question: input,
      history: historyPayload,
      summary: summary,
    };
    try {
      const res = await fetch("http://localhost:7860/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let assistantContent = "";
      if (res.ok) {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const data = await res.json();
          // prefer API fields if present
          if (data.answer) {
            assistantContent = data.answer;
          } else {
            assistantContent =
              data.output ||
              data.response ||
              data.result ||
              data.generated_text ||
              JSON.stringify(data);
          }

          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: assistantContent,
            sources: Array.isArray(data.sources)
              ? data.sources.map((s: any) => ({
                  file: String(s.file || s.filename || "unknown"),
                  page: String(s.page || s.p || "?"),
                  snippet: String(s.snippet || s.text || ""),
                }))
              : undefined,
          };

          // Persist summary returned by the server (if any) so follow-ups can include it
          if (data.summary && typeof data.summary === "string") {
            setSummary(data.summary);
          }

          setMessages((prev) =>
            prev.map((m) => (m.id === loadingId ? assistantMessage : m))
          );
          setInput("");
          return;
        } else {
          assistantContent = await res.text();
        }
      } else {
        assistantContent = `Request failed: ${res.status} ${res.statusText}`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantContent,
        source: "local-model",
      };
      setMessages((prev) =>
        prev.map((m) => (m.id === loadingId ? assistantMessage : m))
      );
      setInput("");
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Request error: ${errMsg}`,
      };
      setMessages((prev) =>
        prev.map((m) => (m.id === loadingId ? assistantMessage : m))
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Proclamations..."
                className="pl-10 bg-background border-border"
              />
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
      <div className="flex-1 overflow-y-auto" ref={chatContainerRef}>
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="shrink-0">
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
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                </div>
                {message.role === "assistant" &&
                  (message.sources?.length || message.source) && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="font-medium text-emerald-700">
                          {"Verified Source"}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground italic space-y-2">
                        {message.sources && message.sources.length > 0 ? (
                          <div className="space-y-2">
                            {message.sources.map((s, idx) => (
                              <div key={idx}>
                                <div className="font-medium">
                                  {s.file} (page {s.page})
                                </div>
                                <div className="text-xs text-muted-foreground italic">
                                  {s.snippet}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <>
                            {"Cited from: "}
                            {message.source}
                          </>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        <FileDown className="mr-2 h-3.5 w-3.5" />
                        {"Export Legal Memo"}
                      </Button>
                    </div>
                  )}
              </div>
              {message.role === "user" && (
                <div className="shrink-0">
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
            <Button variant="ghost" size="icon" className="shrink-0">
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            </Button>
            <div className="flex-1">
              <Input
                placeholder="Ask about Ethiopian laws, proclamations, or regulations..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="min-h-11 resize-none bg-background"
              />
            </div>
            <Button
              size="icon"
              className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? (
                <svg
                  className="h-5 w-5 animate-spin text-primary-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <div className="mt-2 text-xs text-center text-muted-foreground">
            {
              "Powered by local Llama 3.2 model • All processing happens on your device"
            }
          </div>
        </div>
      </div>
    </>
  );
}
