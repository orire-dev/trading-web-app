"""
Strategy and Goals API endpoints
"""

from fastapi import APIRouter, HTTPException
from typing import List
import logging

from app.models.schemas import (
    GoalCreate, GoalResponse, GoalUpdate, GoalProgress,
    GoalRequirements, StrategyConfig
)
from app.services.goal_calculator import GoalCalculator
from app.services.strategy_builder import StrategyBuilder

logger = logging.getLogger(__name__)
router = APIRouter()

goal_calculator = GoalCalculator()
strategy_builder = StrategyBuilder()


@router.post("/goals", response_model=GoalResponse)
async def create_goal(goal: GoalCreate):
    """Create a new trading goal"""
    try:
        # Calculate requirements
        requirements = goal_calculator.calculate_requirements(
            initial_investment=goal.initial_investment,
            target_amount=goal.target_amount,
            timeframe_days=goal.timeframe_days,
            risk_tolerance=goal.risk_tolerance.value
        )
        
        # Create goal (in production, save to database)
        goal_data = {
            "id": f"goal_{len(strategy_builder.goals) + 1}",
            "initial_investment": goal.initial_investment,
            "target_amount": goal.target_amount,
            "timeframe_days": goal.timeframe_days,
            "risk_tolerance": goal.risk_tolerance.value,
            "requirements": requirements,
            "status": "active"
        }
        
        goal_obj = strategy_builder.create_goal(goal_data)
        return goal_obj
    except Exception as e:
        logger.error(f"Error creating goal: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/goals", response_model=List[GoalResponse])
async def get_goals():
    """Get all goals"""
    try:
        goals = strategy_builder.get_all_goals()
        return goals
    except Exception as e:
        logger.error(f"Error getting goals: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/goals/{goal_id}", response_model=GoalResponse)
async def get_goal(goal_id: str):
    """Get specific goal details"""
    try:
        goal = strategy_builder.get_goal(goal_id)
        if not goal:
            raise HTTPException(status_code=404, detail="Goal not found")
        return goal
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting goal: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/goals/{goal_id}", response_model=GoalResponse)
async def update_goal(goal_id: str, updates: GoalUpdate):
    """Update a goal"""
    try:
        goal = strategy_builder.update_goal(goal_id, updates.dict(exclude_unset=True))
        if not goal:
            raise HTTPException(status_code=404, detail="Goal not found")
        return goal
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating goal: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/goals/{goal_id}")
async def delete_goal(goal_id: str):
    """Delete a goal"""
    try:
        success = strategy_builder.delete_goal(goal_id)
        if not success:
            raise HTTPException(status_code=404, detail="Goal not found")
        return {"success": True, "message": "Goal deleted"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting goal: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/goals/{goal_id}/progress", response_model=GoalProgress)
async def get_goal_progress(goal_id: str):
    """Get goal progress"""
    try:
        progress = goal_calculator.calculate_progress(goal_id)
        if not progress:
            raise HTTPException(status_code=404, detail="Goal not found")
        return progress
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting goal progress: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/goals/{goal_id}/recommendations")
async def get_goal_recommendations(goal_id: str):
    """Get goal-based recommendations"""
    try:
        recommendations = goal_calculator.get_recommendations(goal_id)
        if not recommendations:
            raise HTTPException(status_code=404, detail="Goal not found")
        return recommendations
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/build", response_model=StrategyConfig)
async def build_strategy(goal_id: str):
    """Build strategy from goal"""
    try:
        strategy = strategy_builder.build_strategy_from_goal(goal_id)
        if not strategy:
            raise HTTPException(status_code=404, detail="Goal not found")
        return strategy
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error building strategy: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/active", response_model=StrategyConfig)
async def get_active_strategy():
    """Get active strategy configuration"""
    try:
        strategy = strategy_builder.get_active_strategy()
        return strategy
    except Exception as e:
        logger.error(f"Error getting active strategy: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/active", response_model=StrategyConfig)
async def update_active_strategy(strategy: StrategyConfig):
    """Update active strategy"""
    try:
        updated = strategy_builder.update_active_strategy(strategy.dict())
        return updated
    except Exception as e:
        logger.error(f"Error updating active strategy: {e}")
        raise HTTPException(status_code=500, detail=str(e))
