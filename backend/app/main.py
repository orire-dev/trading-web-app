"""
FastAPI Main Application
Trading web interface backend
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import socketio
from contextlib import asynccontextmanager
import logging

from app.api import signals, positions, markets, performance, advice, strategy
from app.websocket.trading import setup_websocket

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Socket.IO server
sio = socketio.AsyncServer(cors_allowed_origins="*", async_mode='asgi')
socket_app = socketio.ASGIApp(sio)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    logger.info("Starting application...")
    setup_websocket(sio)
    yield
    logger.info("Shutting down application...")

# Create FastAPI app
app = FastAPI(
    title="eToro Trading API",
    description="Backend API for trading web interface",
    version="0.1.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(signals.router, prefix="/api/signals", tags=["signals"])
app.include_router(positions.router, prefix="/api/positions", tags=["positions"])
app.include_router(markets.router, prefix="/api/markets", tags=["markets"])
app.include_router(performance.router, prefix="/api/performance", tags=["performance"])
app.include_router(advice.router, prefix="/api/advice", tags=["advice"])
app.include_router(strategy.router, prefix="/api/strategy", tags=["strategy"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "eToro Trading API", "version": "0.1.0"}

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}

# Mount Socket.IO app
app.mount("/socket.io", socket_app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
