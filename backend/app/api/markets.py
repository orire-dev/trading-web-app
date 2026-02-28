"""
Markets API endpoints
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import logging

from app.models.schemas import MarketResponse
from app.services.trading_bot import TradingBotService

logger = logging.getLogger(__name__)
router = APIRouter()

bot_service = TradingBotService()


@router.get("", response_model=List[MarketResponse])
async def get_markets(instrument_type: Optional[str] = Query(None)):
    """Get market data"""
    try:
        markets = bot_service.get_markets(instrument_type)
        return markets
    except Exception as e:
        logger.error(f"Error getting markets: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{instrument_id}", response_model=MarketResponse)
async def get_market(instrument_id: str):
    """Get specific instrument details"""
    try:
        market = bot_service.get_market(instrument_id)
        if not market:
            raise HTTPException(status_code=404, detail="Instrument not found")
        return market
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting market: {e}")
        raise HTTPException(status_code=500, detail=str(e))
