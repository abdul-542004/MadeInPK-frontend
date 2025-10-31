/**
 * Mock Mode Configuration
 * 
 * When backend is not available, services will fall back to mock data
 * Set MOCK_MODE to true to use mock data without backend
 */

export const MOCK_MODE = true; // Set to false when backend is available

export const mockDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));
