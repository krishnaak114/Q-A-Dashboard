"""
WebSocket Manager for real-time updates
"""
from fastapi import WebSocket
from typing import List
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.admin_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket, is_admin: bool = False):
        await websocket.accept()
        self.active_connections.append(websocket)
        if is_admin:
            self.admin_connections.append(websocket)
        logger.info(f"New WebSocket connection. Total: {len(self.active_connections)}, Admins: {len(self.admin_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        if websocket in self.admin_connections:
            self.admin_connections.remove(websocket)
        logger.info(f"WebSocket disconnected. Total: {len(self.active_connections)}, Admins: {len(self.admin_connections)}")

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: dict):
        """Broadcast to all connected clients"""
        message_str = json.dumps(message)
        disconnected = []
        
        for connection in self.active_connections:
            try:
                await connection.send_text(message_str)
            except Exception as e:
                logger.error(f"Error sending message: {e}")
                disconnected.append(connection)
        
        # Clean up disconnected clients
        for connection in disconnected:
            self.disconnect(connection)

    async def notify_admins(self, message: dict):
        """Send notification only to admin connections"""
        message_str = json.dumps(message)
        disconnected = []
        
        for connection in self.admin_connections:
            try:
                await connection.send_text(message_str)
            except Exception as e:
                logger.error(f"Error sending to admin: {e}")
                disconnected.append(connection)
        
        # Clean up disconnected admins
        for connection in disconnected:
            if connection in self.admin_connections:
                self.admin_connections.remove(connection)
            if connection in self.active_connections:
                self.active_connections.remove(connection)


# Global connection manager instance
manager = ConnectionManager()
