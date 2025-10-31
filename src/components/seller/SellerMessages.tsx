import { useState } from "react";
import { Send, Search, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { useSeller } from "../../contexts/SellerContext";
import { toast } from "sonner";

export function SellerMessages() {
  const { conversations, sendMessage, markConversationAsRead } = useSeller();
  const [selectedConversation, setSelectedConversation] = useState<number | null>(0);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSendMessage = () => {
    if (message.trim() && selectedConversation !== null) {
      sendMessage(selectedConversation, message);
      setMessage("");
      toast.success("Message sent!");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-1">Messages</h1>
        <p className="text-gray-600">Communicate with your customers</p>
      </div>

      {/* Messages Container */}
      <Card className="border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
          {/* Conversations List */}
          <div className="border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(600px-73px)]">
              {conversations
                .filter((conv) =>
                  conv.customer.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setSelectedConversation(conv.id);
                      markConversationAsRead(conv.id);
                    }}
                    className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                      selectedConversation === conv.id ? "bg-emerald-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 bg-emerald-700 flex-shrink-0">
                        <AvatarFallback className="text-white text-sm">
                          {getInitials(conv.customer)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-900 truncate">{conv.customer}</span>
                          {conv.unread > 0 && (
                            <Badge className="bg-emerald-600 text-white ml-2">{conv.unread}</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 truncate">{conv.lastMessage}</p>
                        <p className="text-xs text-gray-400 mt-1">{conv.time}</p>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          {/* Message Thread */}
          <div className="md:col-span-2 flex flex-col">
            {selectedConversation !== null ? (
              <>
                {/* Thread Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-emerald-700">
                      <AvatarFallback className="text-white text-sm">
                        {getInitials(conversations[selectedConversation].customer)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-sm text-gray-900">{conversations[selectedConversation].customer}</h3>
                      <p className="text-xs text-gray-500">Active now</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {conversations[selectedConversation]?.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === "seller" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          msg.sender === "seller"
                            ? "bg-emerald-700 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.sender === "seller" ? "text-emerald-100" : "text-gray-500"}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[60px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-emerald-700 hover:bg-emerald-800 self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Select a conversation to view messages</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}