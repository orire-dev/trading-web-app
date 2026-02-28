"""
Advice API endpoints
"""

from fastapi import APIRouter, HTTPException
import logging

from app.services.advice_engine import AdviceEngine

logger = logging.getLogger(__name__)
router = APIRouter()

advice_engine = AdviceEngine()


@router.get("")
async def get_advice():
    """Get personalized trading advice"""
    try:
        advice = advice_engine.get_personalized_advice()
        return advice
    except Exception as e:
        logger.error(f"Error getting advice: {e}")
        raise HTTPException(status_code=500, detail=str(e))
