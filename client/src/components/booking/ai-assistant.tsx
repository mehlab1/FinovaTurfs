import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { dataService } from "@/lib/data";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. I can help you find the best times to play, suggest grounds, and answer questions about bookings. What would you like to know?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const [input, setInput] = useState('');

  const aiMutation = useMutation({
    mutationFn: async (message: string) => {
      return await dataService.getAIResponse(message);
    },
    onSuccess: (data) => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: data.reply,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    },
  });

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    aiMutation.mutate(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glassmorphic border-gray-700 max-w-md max-h-96 flex flex-col p-0">
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-700">
          <DialogTitle className="flex items-center space-x-2">
            <Bot className="text-accent text-xl" />
            <span>AI Assistant</span>
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex space-x-3"
                >
                  {message.sender === 'ai' ? (
                    <>
                      <div className="bg-accent bg-opacity-20 p-2 rounded-full flex-shrink-0">
                        <Bot className="w-4 h-4 text-accent" />
                      </div>
                      <div className="glassmorphic p-3 rounded-lg flex-1">
                        <p className="text-white text-sm">{message.content}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="glassmorphic p-3 rounded-lg flex-1 ml-8">
                        <p className="text-white text-sm">{message.content}</p>
                      </div>
                      <div className="bg-primary bg-opacity-20 p-2 rounded-full flex-shrink-0">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {aiMutation.isPending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex space-x-3"
              >
                <div className="bg-accent bg-opacity-20 p-2 rounded-full flex-shrink-0">
                  <Bot className="w-4 h-4 text-accent" />
                </div>
                <div className="glassmorphic p-3 rounded-lg flex-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1 bg-gray-800 border-gray-700"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || aiMutation.isPending}
              className="bg-accent text-black hover:bg-opacity-80"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
