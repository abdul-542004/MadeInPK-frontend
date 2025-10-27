// WebSocket service for real-time auction bidding

export interface BidData {
  bidder: string;
  amount: string;
  time: string;
  current_price?: string;
}

export interface AuctionStatusData {
  auction_id: number;
  product_name: string;
  current_price: string;
  status: string;
  end_time: string;
  latest_bids: Array<{
    bidder: string;
    amount: string;
    time: string;
  }>;
}

export interface WebSocketMessage {
  type: 'auction_status' | 'new_bid' | 'auction_ended' | 'error';
  data?: AuctionStatusData | BidData;
  message?: string;
}

export class AuctionWebSocket {
  private socket: WebSocket | null = null;
  private auctionId: number;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private messageHandlers: Map<string, (data: any) => void> = new Map();

  constructor(auctionId: number) {
    this.auctionId = auctionId;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Connect to WebSocket
        const wsUrl = `ws://localhost:8000/ws/auction/${this.auctionId}/`;
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
          console.log(`Connected to auction ${this.auctionId}`);
          this.reconnectAttempts = 0;
          resolve();
        };

        this.socket.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.socket.onclose = () => {
          console.log('WebSocket connection closed');
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleMessage(message: WebSocketMessage) {
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message.data || message.message);
    }
  }

  on(eventType: string, handler: (data: any) => void) {
    this.messageHandlers.set(eventType, handler);
  }

  off(eventType: string) {
    this.messageHandlers.delete(eventType);
  }

  placeBid(amount: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'place_bid',
        amount: amount
      }));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect().catch(error => {
          console.error('Reconnection failed:', error);
        });
      }, this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.messageHandlers.clear();
  }

  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }
}

// Helper function to create and manage auction WebSocket
export function createAuctionWebSocket(auctionId: number): AuctionWebSocket {
  return new AuctionWebSocket(auctionId);
}
