"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Send, X, Bot, User, Loader2, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getChatResponse } from "@/lib/ai";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your SpiceOS assistant. How can I help you with your restaurant operations today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await getChatResponse(userMessage);
      setMessages(prev => [...prev, { role: "assistant", content: response || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "An error occurred. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl z-50 transition-all duration-300",
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <Sparkles className="w-6 h-6" />
      </Button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[400px] h-[600px] z-50 flex flex-col"
          >
            <Card className="flex-1 flex flex-col shadow-2xl border-primary/20 overflow-hidden">
              <CardHeader className="bg-primary text-white p-4 flex flex-row items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold">SpiceOS AI Assistant</CardTitle>
                    <p className="text-[10px] opacity-80">Powered by Gemini 3.1 Pro</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/10 h-8 w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 p-0 flex flex-col overflow-hidden bg-surface">
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.map((msg, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "flex gap-3 max-w-[85%]",
                          msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                          msg.role === "user" ? "bg-primary text-white" : "bg-muted text-text-secondary"
                        )}>
                          {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={cn(
                          "p-3 rounded-2xl text-sm leading-relaxed",
                          msg.role === "user" 
                            ? "bg-primary text-white rounded-tr-none" 
                            : "bg-white border border-border rounded-tl-none shadow-sm"
                        )}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3 mr-auto max-w-[85%]">
                        <div className="w-8 h-8 rounded-lg bg-muted text-text-secondary flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-white border border-border p-3 rounded-2xl rounded-tl-none shadow-sm">
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="p-4 bg-white border-t border-border shrink-0">
                  <form 
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-2"
                  >
                    <Input 
                      placeholder="Ask anything..." 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="rounded-xl border-border focus-visible:ring-primary"
                      disabled={isLoading}
                    />
                    <Button 
                      type="submit" 
                      size="icon" 
                      className="rounded-xl shrink-0"
                      disabled={isLoading || !input.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
