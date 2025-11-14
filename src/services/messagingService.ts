import apiClient from '../lib/apiClient';

export interface Conversation {
  id: number;
  buyer: number;
  buyer_username: string;
  seller: number;
  seller_username: string;
  product?: number | null; // Base product ID (as stored in backend)
  product_name?: string | null;
  order?: number | null;
  order_number?: string | null;
  latest_message?: {
    id: number;
    sender: number;
    sender_username: string;
    content: string;
    is_read: boolean;
    created_at: string;
  };
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  sender: number;
  sender_username: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface CreateConversationRequest {
  buyer: number;
  seller: number;
  product?: number; // Base product ID (as stored in backend)
  order?: number | null;
}

export interface SendMessageRequest {
  content: string;
}

class MessagingService {
  private baseUrl = '/conversations';

  // List conversations for the authenticated user
  async getConversations(): Promise<Conversation[]> {
    const response = await apiClient.get(`${this.baseUrl}/`);
    return response.data.results || response.data;
  }

  // Get conversation details
  async getConversation(id: number): Promise<Conversation> {
    const response = await apiClient.get(`${this.baseUrl}/${id}/`);
    return response.data;
  }

  // Create a new conversation
  async createConversation(data: CreateConversationRequest): Promise<Conversation> {
    const response = await apiClient.post(`${this.baseUrl}/`, data);
    return response.data;
  }

  // Get messages for a conversation
  async getConversationMessages(conversationId: number): Promise<Message[]> {
    const response = await apiClient.get(`${this.baseUrl}/${conversationId}/messages/`);
    return response.data;
  }

  // Send a message in a conversation
  async sendMessage(conversationId: number, data: SendMessageRequest): Promise<Message> {
    const response = await apiClient.post(`${this.baseUrl}/${conversationId}/send_message/`, data);
    return response.data;
  }

  // Update conversation (e.g., link to order)
  async updateConversation(id: number, data: Partial<CreateConversationRequest>): Promise<Conversation> {
    const response = await apiClient.put(`${this.baseUrl}/${id}/`, data);
    return response.data;
  }

  // Delete conversation
  async deleteConversation(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}/`);
  }

  // Get or create conversation between buyer and seller
  // productId here refers to the base Product model ID (not listing ID)
  // The frontend should pass the product.id from either listing.product.id (for both auction and fixed_price)
  async getOrCreateConversation(
    buyerId: number, 
    sellerId: number, 
    productId?: number, // Base Product model ID
    orderId?: number
  ): Promise<Conversation> {
    try {
      // First try to find existing conversation
      const conversations = await this.getConversations();
      const existingConversation = conversations.find(conv =>
        conv.buyer === buyerId &&
        conv.seller === sellerId &&
        (productId ? conv.product === productId : !conv.product) &&
        (orderId ? conv.order === orderId : !conv.order)
      );

      if (existingConversation) {
        return existingConversation;
      }

      // Create new conversation
      const newConversation = await this.createConversation({
        buyer: buyerId,
        seller: sellerId,
        product: productId,
        order: orderId || null,
      });

      return newConversation;
    } catch (error) {
      console.error('Error getting or creating conversation:', error);
      throw error;
    }
  }
}

export const messagingService = new MessagingService();