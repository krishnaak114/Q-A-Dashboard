""" FastAPI Main Application
Real-Time Q&A Dashboard Backend
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

from .database import engine, Base
from .routes import auth_routes, questions
from .websocket import manager
from .auth import decode_token

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Real-Time Q&A Dashboard API",
    description="Real-time Q&A platform with WebSocket support",
    version="1.0.0"
)

# CORS Configuration
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_routes.router)
app.include_router(questions.router)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Real-Time Q&A Dashboard API",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "database": "connected",
        "websocket_connections": len(manager.active_connections)
    }


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str = None):
    """
    WebSocket endpoint for real-time updates
    
    Query parameter 'token' can be provided for admin authentication
    Example: ws://localhost:8000/ws?token=your_jwt_token
    """
    is_admin = False
    
    # Check if token is provided for admin connection
    if token:
        try:
            token_data = decode_token(token)
            is_admin = token_data.is_admin
        except Exception:
            # Invalid token, connect as guest
            pass
    
    await manager.connect(websocket, is_admin=is_admin)
    
    try:
        while True:
            # Keep connection alive and handle incoming messages if needed
            data = await websocket.receive_text()
            # Echo back for testing (optional)
            await manager.send_personal_message(f"Received: {data}", websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)


if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
