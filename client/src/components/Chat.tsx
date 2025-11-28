import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, Bot } from "lucide-react";
import Logo from "./Logo";

interface Message {
  id: string;
  remetente: "cidadao" | "atendente" | "sistema";
  mensagem: string;
  dataHora: Date;
}

interface ChatProps {
  occurrenceCode: string;
  messages: Message[];
  onBack: () => void;
  onSendMessage: (mensagem: string) => void;
  isAtendente?: boolean;
  isSending?: boolean;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Chat({
  occurrenceCode,
  messages,
  onBack,
  onSendMessage,
  isAtendente = false,
  isSending = false,
}: ChatProps) {
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentUserType = isAtendente ? "atendente" : "cidadao";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <p className="font-semibold">Chat</p>
              <p className="text-xs text-muted-foreground font-mono">{occurrenceCode}</p>
            </div>
          </div>
          <Logo size="sm" showTagline={false} />
        </div>
      </header>

      <div className="flex-1 max-w-3xl w-full mx-auto flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((msg) => {
              const isSystem = msg.remetente === "sistema";
              const isOwnMessage = msg.remetente === currentUserType;

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center">
                    <Card className="px-4 py-2 bg-muted/50 border-dashed max-w-md">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Bot className="w-4 h-4" />
                        <span>{msg.mensagem}</span>
                      </div>
                    </Card>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] ${
                      isOwnMessage
                        ? "bg-primary text-primary-foreground rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                        : "bg-muted rounded-tl-lg rounded-tr-lg rounded-br-lg"
                    } px-4 py-2`}
                  >
                    <p className="text-sm">{msg.mensagem}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {formatTime(msg.dataHora)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="border-t p-4 bg-background">
          <div className="max-w-3xl mx-auto flex gap-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              data-testid="input-message"
            />
            <Button onClick={handleSend} disabled={!newMessage.trim() || isSending} data-testid="button-send">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
