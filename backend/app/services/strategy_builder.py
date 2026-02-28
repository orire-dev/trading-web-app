"""
Strategy Builder Service
Manages goals and strategy configurations
"""

import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from app.models.schemas import GoalResponse, StrategyConfig, GoalStatus

logger = logging.getLogger(__name__)


class StrategyBuilder:
    """Build and manage trading strategies from goals"""
    
    def __init__(self):
        """Initialize strategy builder"""
        self.goals: Dict[str, Dict[str, Any]] = {}
        self.active_strategy: Optional[Dict[str, Any]] = None
    
    def create_goal(self, goal_data: Dict[str, Any]) -> GoalResponse:
        """Create a new goal"""
        goal_id = goal_data["id"]
        
        # Add metadata
        goal_data["created_at"] = datetime.now()
        goal_data.setdefault("status", "active")
        
        # Store goal
        self.goals[goal_id] = goal_data
        
        # Convert to response model
        from app.services.goal_calculator import GoalCalculator
        calculator = GoalCalculator()
        
        progress = calculator.calculate_progress(goal_id, goal_data["initial_investment"])
        
        return GoalResponse(
            id=goal_id,
            initial_investment=goal_data["initial_investment"],
            target_amount=goal_data["target_amount"],
            timeframe_days=goal_data["timeframe_days"],
            risk_tolerance=goal_data["risk_tolerance"],
            created_at=goal_data["created_at"],
            status=GoalStatus(goal_data["status"]),
            progress=progress,
            requirements=goal_data["requirements"]
        )
    
    def get_all_goals(self) -> List[GoalResponse]:
        """Get all goals"""
        from app.services.goal_calculator import GoalCalculator
        calculator = GoalCalculator()
        
        goals = []
        for goal_id, goal_data in self.goals.items():
            progress = calculator.calculate_progress(goal_id)
            goals.append(GoalResponse(
                id=goal_id,
                initial_investment=goal_data["initial_investment"],
                target_amount=goal_data["target_amount"],
                timeframe_days=goal_data["timeframe_days"],
                risk_tolerance=goal_data["risk_tolerance"],
                created_at=goal_data["created_at"],
                status=GoalStatus(goal_data.get("status", "active")),
                progress=progress,
                requirements=goal_data["requirements"]
            ))
        return goals
    
    def get_goal(self, goal_id: str) -> Optional[GoalResponse]:
        """Get specific goal"""
        if goal_id not in self.goals:
            return None
        
        goal_data = self.goals[goal_id]
        from app.services.goal_calculator import GoalCalculator
        calculator = GoalCalculator()
        progress = calculator.calculate_progress(goal_id)
        
        return GoalResponse(
            id=goal_id,
            initial_investment=goal_data["initial_investment"],
            target_amount=goal_data["target_amount"],
            timeframe_days=goal_data["timeframe_days"],
            risk_tolerance=goal_data["risk_tolerance"],
            created_at=goal_data["created_at"],
            status=GoalStatus(goal_data.get("status", "active")),
            progress=progress,
            requirements=goal_data["requirements"]
        )
    
    def update_goal(self, goal_id: str, updates: Dict[str, Any]) -> Optional[GoalResponse]:
        """Update a goal"""
        if goal_id not in self.goals:
            return None
        
        self.goals[goal_id].update(updates)
        return self.get_goal(goal_id)
    
    def delete_goal(self, goal_id: str) -> bool:
        """Delete a goal"""
        if goal_id in self.goals:
            del self.goals[goal_id]
            return True
        return False
    
    def build_strategy_from_goal(self, goal_id: str) -> Optional[StrategyConfig]:
        """Build strategy configuration from goal"""
        goal = self.get_goal(goal_id)
        if not goal:
            return None
        
        requirements = goal.requirements
        
        # Determine strategies based on goal
        if goal.timeframe_days <= 7:
            strategies = ["scalping"]
        elif goal.timeframe_days <= 30:
            strategies = ["scalping", "momentum"]
        else:
            strategies = ["momentum", "mean_reversion"]
        
        # Determine instrument types based on risk
        if requirements.feasibility == "high_risk" or goal.risk_tolerance == "high":
            instrument_types = ["crypto", "forex"]
        else:
            instrument_types = ["crypto", "forex", "stocks"]
        
        # Position sizing
        if requirements.feasibility == "unrealistic":
            position_sizing = "aggressive"
        elif requirements.feasibility == "high_risk":
            position_sizing = "moderate"
        else:
            position_sizing = "conservative"
        
        # Risk per trade
        risk_per_trade = 0.02  # 2% default
        if requirements.feasibility == "high_risk":
            risk_per_trade = 0.03  # 3% for high risk
        elif requirements.feasibility == "unrealistic":
            risk_per_trade = 0.05  # 5% for unrealistic (with warning)
        
        strategy = StrategyConfig(
            goal_id=goal_id,
            strategies=strategies,
            risk_per_trade=risk_per_trade,
            max_positions=3,
            instrument_types=instrument_types,
            position_sizing=position_sizing,
            entry_criteria={
                "min_confidence": 6.0,
                "min_risk_reward": requirements.min_risk_reward_ratio
            },
            exit_criteria={
                "take_profit_pct": 0.03,
                "stop_loss_pct": 0.015
            }
        )
        
        # Set as active strategy
        self.active_strategy = strategy.dict()
        
        return strategy
    
    def get_active_strategy(self) -> StrategyConfig:
        """Get active strategy"""
        if not self.active_strategy:
            # Return default strategy
            return StrategyConfig(
                goal_id="",
                strategies=["momentum"],
                risk_per_trade=0.02,
                max_positions=3,
                instrument_types=["crypto", "forex", "stocks"],
                position_sizing="moderate",
                entry_criteria={},
                exit_criteria={}
            )
        return StrategyConfig(**self.active_strategy)
    
    def update_active_strategy(self, strategy_data: Dict[str, Any]) -> StrategyConfig:
        """Update active strategy"""
        self.active_strategy = strategy_data
        return StrategyConfig(**strategy_data)
