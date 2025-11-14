import { useState, useEffect } from "react";
import { Send, Search, MessageSquare, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { messagingService, Conversation, Message } from "../../services/messagingService";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";

export function SellerMessages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const convs = await messagingService.getConversations();
        setConversations(convs);
        // Select first conversation if available
        if (convs.length > 0) {
          setSelectedConversation(convs[0].id);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
        toast.error('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [user]);

  // Load messages when conversation is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation) return;

      try {
        const msgs = await messagingService.getConversationMessages(selectedConversation);
        setMessages(msgs);
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load messages');
      }
    };

    loadMessages();
  }, [selectedConversation]);

  const handleRefreshMessages = async () => {
    if (!selectedConversation || refreshing) return;

    try {
      setRefreshing(true);
      const msgs = await messagingService.getConversationMessages(selectedConversation);
      setMessages(msgs);
      toast.success('Messages refreshed');
    } catch (error) {
      console.error('Error refreshing messages:', error);
      toast.error('Failed to refresh messages');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedConversation || sending) return;

    try {
      setSending(true);
      const newMessage = await messagingService.sendMessage(selectedConversation, {
        content: message.trim()
      });

      setMessages(prev => [...prev, newMessage]);
      setMessage("");

      // Update conversation's latest message
      setConversations(prev => prev.map(conv =>
        conv.id === selectedConversation
          ? {
              ...conv,
              latest_message: {
                id: newMessage.id,
                sender: newMessage.sender,
                sender_username: newMessage.sender_username,
                content: newMessage.content,
                is_read: newMessage.is_read,
                created_at: newMessage.created_at
              },
              updated_at: newMessage.created_at
            }
          : conv
      ));

      toast.success("Message sent!");
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
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

  const getCustomerName = (conv: Conversation) => {
    // For seller, show buyer name
    return conv.buyer_username;
  };

  const getLastMessage = (conv: Conversation) => {
    return conv.latest_message?.content || 'No messages yet';
  };

  const getUnreadCount = (conv: Conversation) => {
    return conv.unread_count;
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
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                  <span className="ml-2 text-gray-600">Loading conversations...</span>
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex items-center justify-center p-8">
                  <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-600">No conversations yet</p>
                </div>
              ) : (
                conversations
                  .filter((conv) =>
                    getCustomerName(conv).toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                        selectedConversation === conv.id ? "bg-emerald-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 bg-emerald-700 flex-shrink-0">
                          <AvatarFallback className="text-white text-sm">
                            {getInitials(getCustomerName(conv))}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-900 truncate">{getCustomerName(conv)}</span>
                            {getUnreadCount(conv) > 0 && (
                              <Badge className="bg-emerald-600 text-white ml-2">{getUnreadCount(conv)}</Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 truncate">{getLastMessage(conv)}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatTime(conv.updated_at)}</p>
                        </div>
                      </div>
                    </button>
                  ))
              )}
            </div>
          </div>

          {/* Message Thread */}
          <div className="md:col-span-2 flex flex-col">
            {selectedConversation !== null ? (
              (() => {
                const selectedConv = conversations.find(c => c.id === selectedConversation);
                return selectedConv ? (
                  <>
                    {/* Thread Header */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 bg-emerald-700">
                            <AvatarFallback className="text-white text-sm">
                              {getInitials(getCustomerName(selectedConv))}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-sm text-gray-900">{getCustomerName(selectedConv)}</h3>
                            <p className="text-xs text-gray-500">
                              {selectedConv.product_name 
                                ? `Product: ${selectedConv.product_name}`
                                : selectedConv.order 
                                  ? `Order: ${selectedConv.order_number}` 
                                  : 'General inquiry'
                              }
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={handleRefreshMessages}
                          disabled={refreshing}
                          variant="outline"
                          size="sm"
                          className="ml-2"
                        >
                          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        </Button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">No messages yet. Start the conversation!</p>
                          </div>
                        </div>
                      ) : (
                        messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender === user?.id ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                msg.sender === user?.id
                                  ? "bg-emerald-700 text-white"
                                  : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              <p className="text-sm">{msg.content}</p>
                              <p className={`text-xs mt-1 ${msg.sender === user?.id ? "text-emerald-100" : "text-gray-500"}`}>
                                {formatTime(msg.created_at)}
                                {msg.sender === user?.id && (
                                  <span className="ml-2">
                                    {msg.is_read ? "✓✓" : "✓"}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
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
                          disabled={sending}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!message.trim() || sending}
                          className="bg-emerald-700 hover:bg-emerald-800 self-end"
                        >
                          {sending ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">Conversation not found</p>
                    </div>
                  </div>
                );
              })()
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