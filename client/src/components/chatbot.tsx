import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface StudentInfo {
  oLevelGrades?: string;
  aLevelSubjects?: string;
  interests?: string;
  careerGoals?: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your ApplyHub Course Advisor. I can help you choose the right courses and universities based on your academic performance and interests. Tell me about your O-level or A-level results, and what careers interest you!",
    },
  ]);
  const [input, setInput] = useState("");
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", { message, studentInfo });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm having trouble connecting. Please try again." },
      ]);
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");

    // Extract student info from messages
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes("o-level") || lowerMessage.includes("uce")) {
      setStudentInfo((prev) => ({ ...prev, oLevelGrades: userMessage }));
    }
    if (lowerMessage.includes("a-level") || lowerMessage.includes("uace")) {
      setStudentInfo((prev) => ({ ...prev, aLevelSubjects: userMessage }));
    }
    if (lowerMessage.includes("interest") || lowerMessage.includes("like") || lowerMessage.includes("enjoy")) {
      setStudentInfo((prev) => ({ ...prev, interests: userMessage }));
    }
    if (lowerMessage.includes("career") || lowerMessage.includes("job") || lowerMessage.includes("work")) {
      setStudentInfo((prev) => ({ ...prev, careerGoals: userMessage }));
    }

    chatMutation.mutate(userMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <CardContent className="p-0">
      <ScrollArea className="h-[300px] sm:h-[350px] px-4 py-2" ref={scrollRef}>
        <div className="space-y-4" data-testid="chat-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
              data-testid={`chat-message-${index}`}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {message.content}
              </div>
              {message.role === "user" && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
          {chatMutation.isPending && (
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t p-3 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask about courses, universities..."
          className="flex-1 text-sm"
          disabled={chatMutation.isPending}
          data-testid="chat-input"
        />
        <Button
          onClick={handleSend}
          disabled={chatMutation.isPending || !input.trim()}
          size="icon"
          data-testid="chat-send-button"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </CardContent>
  );
}
