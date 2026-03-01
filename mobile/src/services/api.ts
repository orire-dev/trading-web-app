/**
 * API Service
 * Simple API client for backend communication
 */

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export const apiService = {
  async getPerformance() {
    const response = await fetch(`${API_URL}/api/performance`);
    return response.json();
  },

  async getPositions() {
    const response = await fetch(`${API_URL}/api/positions`);
    return response.json();
  },

  async getSignals() {
    const response = await fetch(`${API_URL}/api/signals`);
    return response.json();
  },

  async approveSignal(signalId: string) {
    const response = await fetch(`${API_URL}/api/signals/${signalId}/approve`, {
      method: 'POST',
    });
    return response.json();
  },

  async getGoals() {
    const response = await fetch(`${API_URL}/api/strategy/goals`);
    return response.json();
  },

  async createGoal(goal: {
    initial_investment: number;
    target_amount: number;
    timeframe_days: number;
    risk_tolerance: string;
  }) {
    const response = await fetch(`${API_URL}/api/strategy/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goal),
    });
    return response.json();
  },
};
