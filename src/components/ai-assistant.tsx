"use client";

import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bot, Send, X, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

type AssistantMessage = {
  id: string;
  role: string;
  content?: string;
  toolInvocations?: {
    toolCallId: string;
    toolName: string;
    result?: unknown;
  }[];
};

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "submitted" || status === "streaming";

  const uiMessages = messages as unknown as AssistantMessage[];

  const handleSubmit = (event?: { preventDefault?: () => void }) => {
    event?.preventDefault?.();
    if (!input.trim()) return;
    void sendMessage({ text: input });
    setInput("");
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-[350px] shadow-xl transition-all duration-300 ease-in-out">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bot className="h-4 w-4" />
          Asistente Familiar
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="h-[300px] overflow-y-auto pr-4" ref={scrollRef}>
          <div className="flex flex-col gap-3 text-sm">
            {uiMessages.length === 0 && (
              <div className="text-muted-foreground text-center py-8">
                ¡Hola! Soy tu asistente. Puedo ayudarte a crear tareas, eventos o planificar comidas.
              </div>
            )}
            {uiMessages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex flex-col gap-1 rounded-lg px-3 py-2 max-w-[85%]",
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                <span className="font-semibold text-xs opacity-70 mb-0.5">
                  {m.role === "user" ? "Tú" : "IA"}
                </span>
                <p className="whitespace-pre-wrap">{m.content}</p>
                {m.toolInvocations?.map((toolInvocation) => {
                  const { toolCallId, result, toolName } = toolInvocation;
                  if (result) {
                    return (
                      <div
                        key={toolCallId}
                        className="mt-2 text-xs opacity-70 border-t pt-1 border-white/20"
                      >
                        ✅ Acción completada: {toolName}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={toolCallId}
                      className="mt-2 text-xs opacity-70 border-t pt-1 border-white/20"
                    >
                      ⏳ Ejecutando: {toolName}...
                    </div>
                  );
                })}
              </div>
            ))}
            {isLoading && (
              <div className="bg-muted text-foreground rounded-lg px-3 py-2 max-w-[85%] self-start animate-pulse">
                Escribiendo...
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
