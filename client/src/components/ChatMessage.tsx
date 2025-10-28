import { Bot, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`} data-testid={`message-${role}`}>
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarFallback className={isUser ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}>
          {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex flex-col gap-1 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
        <div className={`px-4 py-3 rounded-2xl ${
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-card border border-card-border text-card-foreground"
        }`}>
          <p className="text-base leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
        {timestamp && (
          <span className="text-xs text-muted-foreground px-2">{timestamp}</span>
        )}
      </div>
    </div>
  );
}
