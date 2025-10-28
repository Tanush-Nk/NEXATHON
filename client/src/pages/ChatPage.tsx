import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ChatMessage } from "@/components/ChatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ChatMessage as ChatMessageType } from "@shared/schema";

const quickPrompts = [
  "Explain photosynthesis",
  "What is calculus?",
  "History of Ancient Rome",
  "How does DNA work?"
];

export default function ChatPage() {
  const [input, setInput] = useState("");

  const { data: messages = [], isLoading } = useQuery<ChatMessageType[]>({
    queryKey: ["/api/chat/messages"],
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) =>
      apiRequest<{ userMessage: ChatMessageType; aiMessage: ChatMessageType }>("POST", "/api/chat/send", { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
      setInput("");
    },
  });

  const handleSend = async () => {
    if (!input.trim() || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(input);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            AI Learning Assistant
          </h1>
          <p className="text-muted-foreground mt-2">Ask questions, get explanations, and take adaptive quizzes</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role as "user" | "assistant"}
              content={message.content}
              timestamp={new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            />
          ))}
          
          {sendMessageMutation.isPending && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-accent-foreground animate-pulse" />
              </div>
              <Card className="px-4 py-3 bg-card border border-card-border">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickPrompt(prompt)}
                  data-testid={`button-quick-prompt-${index}`}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          )}
          
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about any subject..."
              className="flex-1"
              data-testid="input-chat"
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || sendMessageMutation.isPending}
              data-testid="button-send"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
