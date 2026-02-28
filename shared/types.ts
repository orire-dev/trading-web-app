/**
 * Shared TypeScript types for frontend and backend
 */

export interface Signal {
  id: string;
  instrument_id: string;
  instrument_name: string;
  signal_type: 'buy' | 'sell' | 'hold';
  confidence: number;
  current_price: number;
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  risk_amount: number;
  position_size: number;
  risk_reward_ratio: number;
  reason: string;
  indicators: IndicatorData;
  timestamp: string;
}

export interface IndicatorData {
  rsi?: {
    value: number;
    signal: string;
  };
  macd?: {
    signal: string;
    crossover: string | null;
  };
  bollinger?: {
    signal: string;
    position: string;
  };
  moving_averages?: {
    signal: string;
    crossover: string | null;
  };
  volume?: {
    signal: string;
    volume_ratio: number;
  };
}

export interface Position {
  id: string;
  instrument_id: string;
  instrument_name: string;
  direction: 'buy' | 'sell';
  entry_price: number;
  current_price: number;
  stop_loss: number;
  take_profit: number;
  size: number;
  unrealized_pnl: number;
  opened_at: string;
  last_updated: string;
}

export interface Goal {
  id: string;
  initial_investment: number;
  target_amount: number;
  timeframe_days: number;
  risk_tolerance: 'low' | 'moderate' | 'high';
  created_at: string;
  status: 'active' | 'completed' | 'failed' | 'paused';
  progress: GoalProgress;
  requirements: GoalRequirements;
}

export interface GoalProgress {
  current_amount: number;
  progress_percentage: number;
  days_remaining: number;
  days_elapsed: number;
  daily_target: number;
  today_progress: number;
  on_track: boolean;
  projected_completion_date: string | null;
}

export interface GoalRequirements {
  required_return_pct: number;
  daily_target: number;
  required_win_rate: number;
  avg_profit_per_trade: number;
  min_risk_reward_ratio: number;
  feasibility: 'low_risk' | 'moderate_risk' | 'high_risk' | 'unrealistic';
  recommended_trades_per_day: number;
  recommended_position_size: number;
}

export interface Strategy {
  goal_id: string;
  strategies: string[];
  risk_per_trade: number;
  max_positions: number;
  instrument_types: string[];
  position_sizing: 'conservative' | 'moderate' | 'aggressive';
  entry_criteria: Record<string, any>;
  exit_criteria: Record<string, any>;
}

export interface Performance {
  total_trades: number;
  completed_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  total_pnl: number;
  average_pnl: number;
  profit_factor: number;
  max_drawdown: number;
}

export interface MarketData {
  instrument_id: string;
  name: string;
  current_price: number;
  change_24h: number;
  change_24h_pct: number;
  volume: number;
  instrument_type: string;
}
