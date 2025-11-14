import { useState, useEffect } from "react";
import { Send, MessageSquare, X, Minimize2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useAuth } from "../contexts/AuthContext";
import { messagingService, Conversation, Message } from "../services/messagingService";
import { toast } from "sonner";

interface BuyerMessageBoxProps {
  sellerId: number;
  sellerName: string;
  productName?: string;
  productId?: number; // Base Product model ID (from listing.product.id)
  orderId?: number;
  isOpen: boolean;
  onToggle: () => void;
}

export function BuyerMessageBox({ sellerId, sellerName, productName, productId, orderId, isOpen, onToggle }: BuyerMessageBoxProps) {
  const { user } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load or create conversation when opened
  useEffect(() => {
    if (isOpen && user && !conversation) {
      loadConversation();
    }
  }, [isOpen, user, conversation]);

  const loadConversation = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const conv = await messagingService.getOrCreateConversation(
        user.id,
        sellerId,
        productId, // This should be the base Product model ID
        orderId
      );
      setConversation(conv);

      // Load messages
      const msgs = await messagingService.getConversationMessages(conv.id);
      setMessages(msgs);
    } catch (error) {
      console.error('Error loading conversation:', error);
      toast.error('Failed to load conversation');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !conversation || sending) return;

    try {
      setSending(true);
      const newMessage = await messagingService.sendMessage(conversation.id, {
        content: message.trim()
      });

      setMessages(prev => [...prev, newMessage]);
      setMessage("");

      // Update conversation with latest message
      setConversation(prev => prev ? {
        ...prev,
        latest_message: {
          id: newMessage.id,
          sender: newMessage.sender,
          sender_username: newMessage.sender_username,
          content: newMessage.content,
          is_read: newMessage.is_read,
          created_at: newMessage.created_at
        },
        updated_at: newMessage.created_at
      } : null);

      toast.success("Message sent!");
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleRefreshMessages = async () => {
    if (!conversation || refreshing) return;

    try {
      setRefreshing(true);
      const msgs = await messagingService.getConversationMessages(conversation.id);
      setMessages(msgs);
      toast.success('Messages refreshed');
    } catch (error) {
      console.error('Error refreshing messages:', error);
      toast.error('Failed to refresh messages');
    } finally {
      setRefreshing(false);
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

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={onToggle}
          className="h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Card className={`w-80 sm:w-96 border-emerald-200 shadow-2xl ${
        minimized ? 'h-14' : 'h-[500px]'
      } transition-all duration-200`}>
        {/* Header */}
        <CardHeader className="bg-emerald-600 text-white p-3 cursor-pointer" onClick={() => setMinimized(!minimized)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-emerald-700">
                <AvatarFallback className="text-white text-xs">
                  {getInitials(sellerName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <CardTitle className="text-white text-sm truncate">{sellerName}</CardTitle>
                {productName && !minimized && (
                  <p className="text-emerald-100 text-xs truncate">About: {productName}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRefreshMessages();
                }}
                disabled={refreshing}
                className="h-6 w-6 p-0 text-white hover:bg-emerald-700"
              >
                <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setMinimized(!minimized);
                }}
                className="h-6 w-6 p-0 text-white hover:bg-emerald-700"
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="h-6 w-6 p-0 text-white hover:bg-emerald-700"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!minimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-80">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                  <span className="ml-2 text-gray-600 text-sm">Loading...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <MessageSquare className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Start a conversation with {sellerName}</p>
                    {productName && (
                      <p className="text-xs text-gray-400 mt-1">Ask about {productName}</p>
                    )}
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === user?.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        msg.sender === user?.id
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.sender === user?.id ? "text-emerald-100" : "text-gray-500"}`}>
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-2">
                <Textarea
                  placeholder={`Ask ${sellerName} a question...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[40px] resize-none text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={sending}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sending}
                  className="bg-emerald-600 hover:bg-emerald-700 self-end px-3"
                  size="sm"
                >
                  {sending ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  ) : (
                    <Send className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}