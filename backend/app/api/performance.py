"""
Performance API endpoints
"""

from fastapi import APIRouter, HTTPException
from typing import List
import logging

from app.models.schemas import PerformanceResponse
from app.services.trading_bot import TradingBotService

logger = logging.getLogger(__name__)
router = APIRouter()

bot_service = TradingBotService()


@router.get("", response_model=PerformanceResponse)
async def get_performance():
    """Get performance statistics"""
    try:
        performance = bot_service.get_performance()
        return performance
    except Exception as e:
        logger.error(f"Error getting performance: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/trades")
async def get_trades():
    """Get trade history"""
    try:
        trades = bot_service.get_trades()
        return trades
    except Exception as e:
        logger.error(f"Error getting trades: {e}")
        raise HTTPException(status_code=500, detail=str(e))
