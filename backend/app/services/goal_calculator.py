"""
Goal Calculator Service
Calculates requirements and recommendations for trading goals
"""

import logging
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from app.models.schemas import GoalRequirements, GoalProgress

logger = logging.getLogger(__name__)


class GoalCalculator:
    """Calculate goal requirements and progress"""
    
    def calculate_requirements(
        self,
        initial_investment: float,
        target_amount: float,
        timeframe_days: int,
        risk_tolerance: str
    ) -> GoalRequirements:
        """
        Calculate what's needed to achieve a goal
        
        Args:
            initial_investment: Starting amount
            target_amount: Target amount
            timeframe_days: Days to achieve goal
            risk_tolerance: low, moderate, or high
            
        Returns:
            GoalRequirements object
        """
        # Calculate required return
        profit_needed = target_amount - initial_investment
        required_return_pct = (profit_needed / initial_investment) * 100
        
        # Daily target
        daily_target = profit_needed / timeframe_days
        
        # Calculate required metrics based on risk-reward
        # Assuming 2:1 risk-reward ratio
        risk_reward_ratio = 2.0
        required_win_rate = 1 / (1 + risk_reward_ratio)  # For 2:1, need 33%+ win rate
        required_win_rate = max(required_win_rate, 0.5)  # Minimum 50%
        
        # Average profit per trade
        # Assume 2-3 trades per day
        trades_per_day = 2.5
        avg_profit_per_trade = daily_target / trades_per_day
        
        # Position sizing
        # Risk 2% per trade
        risk_per_trade_pct = 0.02
        risk_per_trade = initial_investment * risk_per_trade_pct
        # With 2:1 reward, profit per trade = risk * 2
        recommended_position_size = risk_per_trade * 3  # Account for stop loss distance
        
        # Feasibility assessment
        if required_return_pct < 50:
            feasibility = "low_risk"
        elif required_return_pct < 100:
            feasibility = "moderate_risk"
        elif required_return_pct < 200:
            feasibility = "high_risk"
        else:
            feasibility = "unrealistic"
        
        # Adjust based on risk tolerance
        if risk_tolerance == "low" and feasibility in ["high_risk", "unrealistic"]:
            feasibility = "unrealistic"
        elif risk_tolerance == "high" and feasibility == "unrealistic":
            feasibility = "high_risk"
        
        return GoalRequirements(
            required_return_pct=round(required_return_pct, 2),
            daily_target=round(daily_target, 2),
            required_win_rate=round(required_win_rate * 100, 2),
            avg_profit_per_trade=round(avg_profit_per_trade, 2),
            min_risk_reward_ratio=risk_reward_ratio,
            feasibility=feasibility,
            recommended_trades_per_day=int(trades_per_day),
            recommended_position_size=round(recommended_position_size, 2)
        )
    
    def calculate_progress(
        self,
        goal_id: str,
        current_amount: Optional[float] = None
    ) -> Optional[GoalProgress]:
        """
        Calculate progress toward goal
        
        Args:
            goal_id: Goal identifier
            current_amount: Current account balance (optional)
            
        Returns:
            GoalProgress object
        """
        # In production, fetch goal from database
        # For now, return mock progress
        if current_amount is None:
            current_amount = 500.0  # Mock current amount
        
        # Mock goal data
        initial_investment = 500.0
        target_amount = 1000.0
        timeframe_days = 20
        created_at = datetime.now() - timedelta(days=5)
        
        # Calculate progress
        progress_amount = current_amount - initial_investment
        total_needed = target_amount - initial_investment
        progress_percentage = (progress_amount / total_needed) * 100 if total_needed > 0 else 0
        
        days_elapsed = (datetime.now() - created_at).days
        days_remaining = max(0, timeframe_days - days_elapsed)
        
        daily_target = total_needed / timeframe_days
        today_progress = progress_amount / days_elapsed if days_elapsed > 0 else 0
        
        # Check if on track
        required_progress = (days_elapsed / timeframe_days) * 100
        on_track = progress_percentage >= required_progress * 0.9  # 90% of required
        
        # Projected completion
        if progress_percentage > 0 and days_elapsed > 0:
            daily_rate = progress_amount / days_elapsed
            if daily_rate > 0:
                days_to_complete = (total_needed - progress_amount) / daily_rate
                projected_date = datetime.now() + timedelta(days=int(days_to_complete))
            else:
                projected_date = None
        else:
            projected_date = None
        
        return GoalProgress(
            current_amount=current_amount,
            progress_percentage=round(progress_percentage, 2),
            days_remaining=days_remaining,
            days_elapsed=days_elapsed,
            daily_target=round(daily_target, 2),
            today_progress=round(today_progress, 2),
            on_track=on_track,
            projected_completion_date=projected_date
        )
    
    def get_recommendations(self, goal_id: str) -> Dict[str, Any]:
        """
        Get recommendations for achieving goal
        
        Args:
            goal_id: Goal identifier
            
        Returns:
            Dictionary with recommendations
        """
        # In production, fetch goal and calculate recommendations
        # For now, return mock recommendations
        
        return {
            "position_size": {
                "min": 100,
                "max": 150,
                "recommended": 125,
                "explanation": "2-3% risk per trade for your goal"
            },
            "trades_per_day": {
                "min": 2,
                "max": 3,
                "recommended": 2.5,
                "explanation": "Need 2-3 profitable trades daily"
            },
            "instruments": {
                "recommended": ["crypto", "forex"],
                "explanation": "Higher volatility = faster gains for aggressive goals"
            },
            "strategies": {
                "recommended": ["scalping", "momentum"],
                "explanation": "Quick in-out trades work best for short timeframes"
            },
            "risk_level": {
                "level": "moderate-high",
                "explanation": "Required for 100% return in 20 days"
            },
            "warnings": [
                "This goal requires consistent daily profits",
                "Market volatility can impact results",
                "Consider starting with smaller goal to build confidence"
            ]
        }
