"""
AI Assistant for Auto-Suggesting Answers
Mocked implementation demonstrating RAG/Langchain integration concept
"""
import re
from typing import Optional


class AIAssistant:
    """
    Mock AI Assistant that provides auto-suggested answers to questions.
    In production, this would integrate with OpenAI, Langchain, or a RAG system.
    """
    
    def __init__(self):
        # Knowledge base for pattern matching
        self.knowledge_base = {
            r"password|reset|forgot": {
                "answer": "To reset your password: 1) Click 'Forgot Password' on the login page, 2) Enter your email address, 3) Check your inbox for a reset link, 4) Follow the link and create a new password. If you don't receive the email within 5 minutes, check your spam folder.",
                "confidence": 0.85
            },
            r"system requirements|requirements|specs": {
                "answer": "System Requirements: Modern web browser (Chrome, Firefox, Safari, or Edge), stable internet connection, JavaScript enabled. For optimal performance: 4GB RAM, 2.0 GHz processor. The application is responsive and works on desktop, tablet, and mobile devices.",
                "confidence": 0.90
            },
            r"how to|how do i|tutorial|guide": {
                "answer": "To get started: 1) Register for an account or continue as a guest, 2) Submit your question using the form at the top, 3) View real-time updates as others respond, 4) Admin users can manage question status and escalate urgent items. Check our documentation for detailed guides.",
                "confidence": 0.75
            },
            r"account|register|sign up|create account": {
                "answer": "Creating an account: 1) Click 'Register' in the top navigation, 2) Provide a unique username, valid email, and secure password (minimum 6 characters), 3) Submit the form, 4) You'll be automatically logged in. Registered users can track their questions and receive notifications.",
                "confidence": 0.88
            },
            r"admin|administrator|permissions|access": {
                "answer": "Admin Features: Admin users have special privileges including: ability to change question status (Pending/Escalated/Answered), escalate urgent questions to the top, receive notifications for new questions, and manage all user-submitted content. Contact support to request admin access.",
                "confidence": 0.82
            },
            r"real.?time|live|websocket|instant": {
                "answer": "Real-Time Updates: This platform uses WebSocket technology to deliver instant updates. When anyone submits a question or answer, all connected users see it immediately without refreshing. Look for the green '• Live' indicator to confirm your connection is active.",
                "confidence": 0.92
            },
            r"error|problem|issue|not working|broken": {
                "answer": "Troubleshooting: 1) Refresh the page and try again, 2) Clear your browser cache and cookies, 3) Check your internet connection, 4) Try a different browser, 5) Disable browser extensions temporarily. If the issue persists, contact support with details about the error message and steps to reproduce.",
                "confidence": 0.70
            },
            r"api|integration|webhook|developer": {
                "answer": "API & Integrations: Our REST API supports programmatic access with JWT authentication. Available endpoints: POST /questions (submit), GET /questions (list), PATCH /questions/{id}/status (update). WebSocket endpoint: ws://host/ws. Webhook notifications available for answered questions. See API documentation for details.",
                "confidence": 0.87
            }
        }
    
    def suggest_answer(self, question: str) -> Optional[dict]:
        """
        Analyze question and return AI-suggested answer if applicable.
        
        Args:
            question: The user's question text
            
        Returns:
            dict with 'answer' and 'confidence' if suggestion found, None otherwise
        """
        if not question or len(question.strip()) < 10:
            return None
        
        question_lower = question.lower()
        
        # Pattern matching against knowledge base
        for pattern, suggestion in self.knowledge_base.items():
            if re.search(pattern, question_lower):
                return {
                    "answer": suggestion["answer"],
                    "confidence": suggestion["confidence"],
                    "source": "AI Assistant (Mocked RAG)",
                    "suggested_by": "AI"
                }
        
        # Generic fallback response
        if len(question_lower) > 20:
            return {
                "answer": "Thank you for your question! Our team is reviewing it and will provide a detailed answer soon. In the meantime, you can check our FAQ section or search existing questions for similar topics.",
                "confidence": 0.50,
                "source": "AI Assistant (Generic Response)",
                "suggested_by": "AI"
            }
        
        return None


# Singleton instance
ai_assistant = AIAssistant()


def get_ai_suggestion(question: str) -> Optional[dict]:
    """
    Public interface to get AI-suggested answer.
    
    Args:
        question: The question text
        
    Returns:
        Suggested answer dict or None
    """
    return ai_assistant.suggest_answer(question)
