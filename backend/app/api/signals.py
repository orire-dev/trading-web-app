"""
Signals API endpoints
"""

from fastapi import APIRouter, HTTPException
from typing import List
import logging

from app.models.schemas import SignalResponse
from app.services.trading_bot import TradingBotService

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize service (will be injected properly in production)
bot_service = TradingBotService()


@router.get("", response_model=List[SignalResponse])
async def get_signals():
    """Get all trading signals"""
    try:
        signals = bot_service.get_signals()
        return signals
    except Exception as e:
        logger.error(f"Error getting signals: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{signal_id}", response_model=SignalResponse)
async def get_signal(signal_id: str):
    """Get specific signal details"""
    try:
        signal = bot_service.get_signal(signal_id)
        if not signal:
            raise HTTPException(status_code=404, detail="Signal not found")
        return signal
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting signal: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{signal_id}/approve")
async def approve_signal(signal_id: str):
    """Approve a trading signal"""
    try:
        result = bot_service.approve_signal(signal_id)
        return {"success": True, "message": "Signal approved", "data": result}
    except Exception as e:
        logger.error(f"Error approving signal: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{signal_id}/reject")
async def reject_signal(signal_id: str, reason: str = None):
    """Reject a trading signal"""
    try:
        result = bot_service.reject_signal(signal_id, reason)
        return {"success": True, "message": "Signal rejected", "data": result}
    except Exception as e:
        logger.error(f"Error rejecting signal: {e}")
        raise HTTPException(status_code=500, detail=str(e))
