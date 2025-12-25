"use client";

import { useState } from "react";
import {
  Scale,
  FileText,
  Shield,
  Circle,
  Plus,
  MessageSquare,
  MoreVertical,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

export function Sidebar() {
  const [sovereignMode, setSovereignMode] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | null>("1");
  const [searchQuery, setSearchQuery] = useState("");

  const chatHistory = [
    { id: "1", title: "VAT Amendment Inquiry", date: "2 hours ago" },
    { id: "2", title: "Land Tenure Rights", date: "Yesterday" },
    { id: "3", title: "Investment Law Updates", date: "2 days ago" },
    { id: "4", title: "Computer Crime Penalties", date: "3 days ago" },
  ];

  const proclamations = [
    {
      id: "707/2011",
      title: "Proclamation No. 707/2011",
      subtitle: "Federal Negarit Gazeta",
    },
    {
      id: "1097/2018",
      title: "Proclamation No. 1097/2018",
      subtitle: "Investment Law",
    },
    {
      id: "980/2016",
      title: "Proclamation No. 980/2016",
      subtitle: "Computer Crime",
    },
    {
      id: "916/2015",
      title: "Proclamation No. 916/2015",
      subtitle: "Civil Society",
    },
    {
      id: "731/2012",
      title: "Proclamation No. 731/2012",
      subtitle: "Broadcasting Service",
    },
  ];

  const filteredProclamations = proclamations.filter(
    (proc) =>
      proc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proc.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proc.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Header - Fixed at Top */}
      <div className="p-6 border-b border-sidebar-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Scale className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          <h1 className="text-xl font-serif font-bold text-sidebar-foreground">
            {"EthioGov AI"}
          </h1>
        </div>
      </div>

      {/* Scrollable Area - Flex-Grow */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Section A: Research History */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-emerald-100/60 uppercase tracking-wider">
                {"Research History"}
              </div>
            </div>

            {/* New Chat Button */}
            <Button
              variant="outline"
              className="w-full justify-start gap-2 bg-transparent border-emerald-700 text-emerald-100 hover:bg-emerald-800 hover:text-white hover:border-emerald-800"
              onClick={() => setActiveChatId(null)}
            >
              <Plus className="h-4 w-4" />
              {"New Chat"}
            </Button>

            <div className="space-y-1">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveChatId(chat.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveChatId(chat.id);
                    }
                  }}
                  className={`
                    w-full text-left px-3 py-2.5 rounded-lg transition-colors group relative
                    ${
                      activeChatId === chat.id
                        ? "bg-emerald-800 text-white"
                        : "bg-transparent text-emerald-100 hover:bg-emerald-800 hover:text-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {/* Left: Icon */}
                    <MessageSquare
                      className={`h-4 w-4 shrink-0 ${
                        activeChatId === chat.id
                          ? "text-white"
                          : "text-emerald-100/70"
                      }`}
                    />

                    {/* Middle: Chat Title (Truncated) */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {chat.title}
                      </div>
                      <div
                        className={`text-xs ${
                          activeChatId === chat.id
                            ? "text-white/70"
                            : "text-emerald-100/50"
                        }`}
                      >
                        {chat.date}
                      </div>
                    </div>

                    {/* Right: Three Dots Menu (Appears on Hover) */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("[v0] Menu clicked for:", chat.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-emerald-700/50 transition-opacity"
                      aria-label="More options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-sidebar-border" />

          {/* Section B: Sovereign Library / Indexed Proclamations */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
              {"Indexed Proclamations"}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-100/40" />
              <Input
                type="text"
                placeholder="Filter Proclamations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-9 bg-emerald-950 border-none text-white text-sm placeholder:text-emerald-100/40 focus-visible:ring-emerald-700"
              />
            </div>

            {/* Proclamations List */}
            <div className="space-y-1">
              {filteredProclamations.length > 0 ? (
                filteredProclamations.map((proc) => (
                  <div
                    key={proc.id}
                    role="button"
                    tabIndex={0}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="h-4 w-4 mt-0.5 text-sidebar-foreground/60 group-hover:text-sidebar-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {proc.title}
                        </div>
                        <div className="text-xs text-sidebar-foreground/60 truncate">
                          {proc.subtitle}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-400 text-center py-4">
                  {"No documents found"}
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer - Fixed at Bottom */}
      <div className="shrink-0 border-t border-sidebar-border">
        {/* System Status Indicator */}
        <div className="px-6 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2 text-sm">
            <Circle className="h-3 w-3 fill-emerald-400 text-emerald-400 shrink-0" />
            <div className="text-sidebar-foreground min-w-0">
              <div className="font-medium truncate">
                {"Local Model: Llama 3.2"}
              </div>
              <div className="text-xs text-sidebar-foreground/70">
                {"Online"}
              </div>
            </div>
          </div>
        </div>

        {/* Sovereign Mode Toggle */}
        <div className="p-6">
          <Button
            variant={sovereignMode ? "default" : "outline"}
            className="w-full justify-start gap-3"
            onClick={() => setSovereignMode(!sovereignMode)}
          >
            <Shield className="h-4 w-4 shrink-0" />
            <div className="flex-1 text-left min-w-0">
              <div className="text-sm font-medium">{"Sovereign Mode"}</div>
              <div className="text-xs opacity-80">{"Offline Processing"}</div>
            </div>
          </Button>
        </div>
      </div>
    </aside>
  );
}
