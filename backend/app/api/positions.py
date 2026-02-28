"""
Positions API endpoints
"""

from fastapi import APIRouter, HTTPException
from typing import List
import logging

from app.models.schemas import PositionResponse
from app.services.trading_bot import TradingBotService

logger = logging.getLogger(__name__)
router = APIRouter()

bot_service = TradingBotService()


@router.get("", response_model=List[PositionResponse])
async def get_positions():
    """Get all open positions"""
    try:
        positions = bot_service.get_positions()
        return positions
    except Exception as e:
        logger.error(f"Error getting positions: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{position_id}", response_model=PositionResponse)
async def get_position(position_id: str):
    """Get specific position details"""
    try:
        position = bot_service.get_position(position_id)
        if not position:
            raise HTTPException(status_code=404, detail="Position not found")
        return position
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting position: {e}")
        raise HTTPException(status_code=500, detail=str(e))
