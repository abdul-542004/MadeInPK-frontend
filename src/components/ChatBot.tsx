import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2, 
  Trash2,
  Sparkles,
  Package,
  Heart,
  Info
} from "lucide-react";
import { useChatbot } from "../contexts/ChatbotContext";
import { motion, AnimatePresence } from "motion/react";

export function ChatBot() {
  const { messages, isOpen, setIsOpen, sendMessage, clearMessages } = useChatbot();
  const [inputValue, setInputValue] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { icon: Package, label: "Browse Products", message: "Show me products" },
    { icon: Heart, label: "Heritage Info", message: "Tell me about Pakistani heritage" },
    { icon: Info, label: "Help", message: "I need help" },
  ];

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-pulse" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[320px] sm:w-[360px]"
          >
            <Card className="shadow-2xl border-emerald-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10 border-2 border-white">
                        <AvatarFallback className="bg-emerald-800 text-white">
                          <Sparkles className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white" />
                    </div>
                    <div>
                      <h3 className="text-white">MadeInPK Assistant</h3>
                      <p className="text-xs text-emerald-100">Online • Here to help</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="h-8 w-8 text-white hover:bg-emerald-700"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="h-8 w-8 text-white hover:bg-emerald-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Chat Content */}
              {!isMinimized && (
                <div className="flex flex-col" style={{ height: "450px" }}>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-2 ${
                            message.sender === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          {message.sender === "bot" && (
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback className="bg-emerald-100 text-emerald-700">
                                <Sparkles className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`max-w-[75%] rounded-lg px-4 py-2 ${
                              message.sender === "user"
                                ? "bg-emerald-600 text-white"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {message.text}
                            </p>
                            <p
                              className={`text-xs mt-1 ${
                                message.sender === "user"
                                  ? "text-emerald-100"
                                  : "text-gray-500"
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                          {message.sender === "user" && (
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback className="bg-emerald-700 text-white">
                                U
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  {messages.length <= 1 && (
                    <div className="px-4 pb-2">
                      <p className="text-xs text-gray-600 mb-2">Quick actions:</p>
                      <div className="flex gap-2 flex-wrap">
                        {quickActions.map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => sendMessage(action.message)}
                            className="text-xs h-8"
                          >
                            <action.icon className="h-3 w-3 mr-1" />
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input Area */}
                  <div className="border-t p-4 bg-white">
                    <div className="flex gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder="Ask about products, heritage, or anything..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <Button
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    {messages.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearMessages}
                        className="w-full mt-2 text-xs text-gray-500 hover:text-gray-700"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Clear conversation
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
