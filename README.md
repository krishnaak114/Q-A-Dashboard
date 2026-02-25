# 🎯 Real-Time Q&A Dashboard

[![GitHub Repository](https://img.shields.io/badge/GitHub-Q--A--Dashboard-blue?logo=github)](https://github.com/krishnaak114/Q-A-Dashboard)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.127.0-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.6-000000?logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A full-stack real-time Q&A platform built with **FastAPI**, **Next.js**, and **WebSockets**. Users can submit questions, provide answers, and admins can manage question statuses with live updates across all connected clients.

🔗 **Repository**: [github.com/krishnaak114/Q-A-Dashboard](https://github.com/krishnaak114/Q-A-Dashboard)

## 📋 **Project Overview**

### Features Implemented

✅ **3 Pages**: Login, Register, Dashboard (Forum)  
✅ **Real-time Updates**: WebSocket integration for live question/answer broadcasting  
✅ **Guest Access**: Non-logged-in users can view, submit questions, and answer  
✅ **Admin Features**: Mark questions as Pending/Escalated/Answered (requires login)  
✅ **AJAX Validation**: XMLHttpRequest-based form validation as required  
✅ **JWT Authentication**: Secure admin authentication with token-based access  
✅ **Status Management**: Questions auto-sort with Escalated at the top  
✅ **Webhook Integration**: External service notification when questions are answered  
✅ **AI Auto-Suggest**: RAG-style pattern matching for automatic answer suggestions (Bonus)  
✅ **Database**: SQLite (local) with easy PostgreSQL migration path  

---

## 🏗️ **Architecture**

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend API** | FastAPI 0.110.0 | REST API endpoints |
| **Real-time** | WebSockets | Live updates to all clients |
| **AI Assistant** | RAG/Pattern Matching | Auto-suggest answers (Bonus) |
| **Frontend** | Next.js 14.2.6 + React 18 | Server-side rendered UI |
| **Database** | SQLAlchemy + SQLite | Data persistence |
| **Auth** | JWT (python-jose) | Admin authentication |
| **Validation** | Pydantic | Request/response schemas |
| **Deployment** | Docker Compose | Containerized environment |

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                      │
│  ┌──────────┐  ┌──────────┐  ┌─────────────────────────┐  │
│  │  Login   │  │ Register │  │  Dashboard (Q&A Forum)  │  │
│  │  Page    │  │   Page   │  │  - Question Form        │  │
│  └──────────┘  └──────────┘  │  - Live Question List   │  │
│                               │  - Admin Controls       │  │
│                               └─────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │
            ┌───────────┼───────────┐
            │           │           │
         HTTP API   WebSocket   XMLHttpRequest
            │           │        (AJAX Validation)
            │           │           │
┌───────────▼───────────▼───────────▼─────────────────────────┐
│                  Backend (FastAPI)                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │  REST API Endpoints                                │    │
│  │  - POST /auth/register                             │    │
│  │  - POST /auth/login                                │    │
│  │  - POST /questions (create)                        │    │
│  │  - GET  /questions (list)                          │    │
│  │  - PATCH /questions/{id}/status (admin only)      │    │
│  │  - POST /questions/{id}/answers                    │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  WebSocket Server (/ws)                            │    │
│  │  - Broadcasts new questions to all clients         │    │
│  │  - Pushes question updates (status changes)        │    │
│  │  - Sends new answers to all viewers                │    │
│  │  - Admin notifications (new question alerts)       │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Webhook Triggers (Optional)                       │    │
│  │  - Pings external URL when question answered       │    │
│  └────────────────────────────────────────────────────┘    │
└───────────────────────────┬──────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │  SQLite DB     │
                    │  - users       │
                    │  - questions   │
                    │  - answers     │
                    └────────────────┘
```

---

## 🗄️ **Database Schema**

```sql
users
├── user_id (PK, Integer)
├── username (String, Unique)
├── email (String, Unique)
├── password (String, Hashed)
├── is_admin (Integer, 0=user, 1=admin)
└── created_at (DateTime)

questions
├── question_id (PK, Integer)
├── user_id (FK, Integer, Nullable)
├── username (String)
├── message (Text)
├── status (Enum: Pending|Escalated|Answered)
├── timestamp (DateTime)
└── updated_at (DateTime)

answers
├── answer_id (PK, Integer)
├── question_id (FK, Integer)
├── user_id (FK, Integer, Nullable)
├── username (String)
├── message (Text)
└── timestamp (DateTime)
```

---

## 🚀 **Quick Start**

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **Docker & Docker Compose** (optional, for containerized deployment)

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
cd Q-A-Dashboard

# Start all services
docker-compose up --build

# Access the application
Frontend: http://localhost:3000
Backend API: http://localhost:8000
API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
copy .env.example .env  # On Linux/Mac: cp .env.example .env

# Run the server
python -m uvicorn app.main:app --reload

# Server runs on http://localhost:8000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
copy .env.local.example .env.local  # On Linux/Mac: cp .env.local.example .env.local

# Run development server
npm run dev

# App runs on http://localhost:3000
```

---

## 📖 **Usage Guide**

### For Guests (No Login Required)

1. **Visit Dashboard**: http://localhost:3000
2. **Submit Questions**: Fill out the form and click "Submit Question"
3. **View Questions**: See all questions update in real-time
4. **Answer Questions**: Click "+ Add Answer" on any question

### For Admins

1. **Register**: http://localhost:3000/register
   - Create an account (default: regular user)
   - To make admin: Manually update `is_admin = 1` in database
   
2. **Login**: http://localhost:3000/login
   - Use your credentials to get JWT token

3. **Admin Powers**:
   - Mark questions as **Pending**, **Escalated**, or **Answered**
   - Escalated questions automatically move to the top
   - Receive real-time notifications for new questions

### Creating Admin User (Manual)

```bash
# Option 1: Via Python script
cd backend
python

>>> from app.database import SessionLocal
>>> from app.models import User
>>> db = SessionLocal()
>>> admin = db.query(User).filter(User.username == "yourusername").first()
>>> admin.is_admin = 1
>>> db.commit()

# Option 2: Direct SQL
sqlite3 backend/qa_dashboard.db
UPDATE users SET is_admin = 1 WHERE username = 'yourusername';
```

---

## 🔌 **API Documentation**

### Authentication Endpoints

```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

```http
POST /auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepass123"
}

Response:
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

### Question Endpoints

```http
GET /questions
# Returns all questions, sorted by status (Escalated first) then timestamp

POST /questions
Content-Type: application/json

{
  "message": "How do I reset my password?",
  "username": "Guest"  # Optional
}

PATCH /questions/{question_id}/status
Authorization: Bearer <token>  # Admin only
Content-Type: application/json

{
  "status": "Escalated"  # Pending | Escalated | Answered
}

POST /questions/{question_id}/answers
Content-Type: application/json

{
  "message": "Click on 'Forgot Password' link",
  "username": "HelpfulUser"  # Optional
}
```

### WebSocket Connection

```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:8000/ws');

// For admin (with notifications)
const ws = new WebSocket('ws://localhost:8000/ws?token=your_jwt_token');

// Listen for messages
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  switch (message.type) {
    case 'new_question':
      // New question submitted
      break;
    case 'question_updated':
      // Question status changed
      break;
    case 'new_answer':
      // Answer added to question
      break;
    case 'admin_notification':
      // Admin-only notification
      break;
  }
};
```

Interactive API documentation: http://localhost:8000/docs

---

## ✨ **Key Features Explained**

### 1. AJAX XMLHttpRequest Validation

Per assignment requirements, form validation uses XMLHttpRequest:

```typescript
// frontend/src/utils/api.ts
export function makeRequest<T>(method: string, endpoint: string, data?: any) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, `${API_URL}${endpoint}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ data: JSON.parse(xhr.responseText) });
      } else {
        resolve({ error: JSON.parse(xhr.responseText).detail });
      }
    };
    
    xhr.send(JSON.stringify(data));
  });
}
```

### 2. Real-Time WebSocket Updates

- **Automatic Broadcasting**: New questions/answers instantly appear for all users
- **Admin Notifications**: Admins receive alerts when new questions arrive
- **Status Updates**: Question status changes sync across all clients
- **Auto-Reconnect**: Frontend automatically reconnects if connection drops

### 3. Question Sorting Logic

```python
# Escalated questions move to top
questions = db.query(Question).order_by(
    Question.status == QuestionStatus.ANSWERED,   # Answered last
    Question.status == QuestionStatus.PENDING,    # Pending middle
    desc(Question.timestamp)                      # Newest first within status
).all()
```

### 4. Webhook Integration

```python
# Trigger external service when question is answered
async def trigger_webhook(question: Question):
    webhook_url = os.getenv("WEBHOOK_URL")
    async with httpx.AsyncClient() as client:
        await client.post(webhook_url, json={
            "event": "question_answered",
            "question_id": question.question_id,
            "message": question.message
        })
```

---

## 📁 **Project Structure**

```
Q-A-Dashboard/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application
│   │   ├── database.py          # SQLAlchemy config
│   │   ├── models.py            # Database models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── auth.py              # JWT authentication
│   │   ├── websocket.py         # WebSocket manager
│   │   └── routes/
│   │       ├── auth_routes.py   # Login/register
│   │       └── questions.py     # Q&A endpoints
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         # Dashboard (Page 3)
│   │   │   ├── login/page.tsx   # Login (Page 1)
│   │   │   ├── register/page.tsx# Register (Page 2)
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── QuestionForm.tsx
│   │   │   ├── QuestionList.tsx
│   │   │   └── QuestionItem.tsx
│   │   ├── hooks/
│   │   │   └── useWebSocket.ts  # WebSocket hook
│   │   └── utils/
│   │       └── api.ts           # XMLHttpRequest API
│   ├── package.json
│   ├── Dockerfile
│   └── .env.local.example
│
├── docker-compose.yml
├── .gitignore
└── README.md (this file)
```

---

## 🧪 **Testing the Application**

### Manual Testing Checklist

**Guest User Flow:**
- [ ] Visit dashboard without logging in
- [ ] Submit a question (validate blank input rejection)
- [ ] See question appear in real-time
- [ ] Answer a question
- [ ] See answer appear in real-time

**Admin User Flow:**
- [ ] Register new account
- [ ] Login successfully
- [ ] Submit question as logged-in user
- [ ] Mark question as Escalated (verify it moves to top)
- [ ] Mark question as Answered
- [ ] Verify admin badge displays
- [ ] Check WebSocket connection status (Live indicator)

**Multi-Client Testing:**
- [ ] Open dashboard in 2 browser windows
- [ ] Submit question in Window 1
- [ ] Verify question appears in Window 2 immediately
- [ ] Answer question in Window 2
- [ ] Verify answer appears in Window 1 immediately

### API Testing with cURL

```bash
# Register user
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"pass123"}'

# Submit question (guest)
curl -X POST http://localhost:8000/questions \
  -H "Content-Type: application/json" \
  -d '{"message":"Test question?","username":"Guest"}'

# Get all questions
curl http://localhost:8000/questions

# Update status (admin - requires token)
curl -X PATCH http://localhost:8000/questions/1/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"status":"Escalated"}'
```

---

## 🎨 **UI Screenshots**

**Dashboard (Main Page)**
- Live question feed with real-time updates
- Question submission form with AJAX validation
- Status badges (Pending/Escalated/Answered)
- Answer threads below each question
- Admin controls (when logged in)

**Login/Register Pages**
- Clean authentication forms
- Input validation with error messages
- Guest access option

---

## 🔒 **Security Features**

✅ **Password Hashing**: bcrypt via passlib  
✅ **JWT Tokens**: Signed with secret key, 60-minute expiry  
✅ **CORS Protection**: Configurable allowed origins  
✅ **Input Validation**: Pydantic schemas on backend, client-side on frontend  
✅ **SQL Injection Prevention**: SQLAlchemy ORM parameterized queries  
✅ **XSS Protection**: React auto-escapes user input  

---

## 🚢 **Deployment**

### Docker Production Build

```bash
# Build and run with docker-compose
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL=sqlite:///./qa_dashboard.db
SECRET_KEY=<generate-strong-secret>
ALLOWED_ORIGINS=https://yourdomain.com
WEBHOOK_URL=https://webhook.site/your-uuid
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_WS_URL=wss://api.yourdomain.com/ws
```

### PostgreSQL Migration (Production)

```bash
# Update backend/.env
DATABASE_URL=postgresql://user:password@localhost/qa_dashboard

# Install psycopg2
pip install psycopg2-binary

# Models will auto-create tables on first run
```

---

## 📦 **Dependencies**

**Backend:**
- fastapi==0.110.0 - Web framework
- uvicorn[standard]==0.27.1 - ASGI server
- sqlalchemy==2.0.25 - ORM
- python-jose[cryptography]==3.3.0 - JWT
- passlib[bcrypt]==1.7.4 - Password hashing
- websockets==12.0 - WebSocket support

**Frontend:**
- next==14.2.6 - React framework
- react==18.3.1 - UI library
- axios==1.7.7 - HTTP client (alternative to XMLHttpRequest)
- typescript==5+ - Type safety

---

## 🎯 **Assignment Requirements Checklist**

### Core Requirements
- [x] **3 Pages**: Login, Register, Dashboard ✅
- [x] **FastAPI Backend** with REST API ✅
- [x] **Next.js Frontend** ✅
- [x] **WebSocket** for real-time updates ✅
- [x] **AJAX XMLHttpRequest** for form validation ✅
- [x] **Database** with Users, Questions, Answers tables ✅
- [x] **Authentication** with login/register ✅
- [x] **Guest Access** (non-logged-in users can view/post) ✅
- [x] **Admin Features** (mark answered, get notifications) ✅
- [x] **Question Status** (Pending/Escalated/Answered) ✅
- [x] **Timestamp Sorting** (system time, ordered display) ✅
- [x] **Escalated Priority** (moves to top) ✅

### Bonus Features
- [x] **Webhooks** (external service ping when answered) ✅
- [x] **Environment Variables** (.env files) ✅
- [x] **Docker Compose** (containerized deployment) ✅
- [x] **RAG/AI Assistant** (mocked pattern-matching with auto-suggest answers) ✅

---

## 🤖 **AI Auto-Suggest Feature**

The system includes an AI Assistant that automatically suggests answers to new questions using pattern matching (demonstrating RAG/Langchain concept):

### How It Works
1. **Pattern Recognition**: Analyzes question text against knowledge base
2. **Confidence Scoring**: Calculates relevance (0.0 to 1.0)
3. **Auto-Response**: If confidence > 75%, automatically posts AI-suggested answer
4. **Real-Time**: AI answers broadcast instantly via WebSocket

### Knowledge Domains
- Password reset & account management
- System requirements & technical specs
- How-to guides & tutorials
- Admin features & permissions
- Real-time functionality
- API & developer integration
- Troubleshooting & error handling

**Example**: Ask "How do I reset my password?" and the AI will instantly suggest a detailed answer with 85% confidence!

---

## ⚠️ **Assumptions & Limitations**

### Assumptions
- **Single Admin Role**: Admin accounts require manual creation via the `/auth/register` endpoint; there is no self-serve admin promotion UI (by design, to prevent privilege escalation).
- **SQLite for Development**: The default database is SQLite for ease of local setup. Production deployments should migrate to PostgreSQL using the documented migration path.
- **WebSocket Authentication**: Anonymous users connect to the WebSocket for read-only live updates; only authenticated admins receive privileged admin_notification events.
- **Webhook URL**: The external webhook is optional. If `WEBHOOK_URL` is not set in the environment, triggered notifications are silently skipped.
- **AI Suggestions**: The AI auto-suggest feature uses keyword/pattern matching (not a real LLM). It is a demonstration of the RAG concept and should be replaced with a real embedding model for production use.

### Limitations
- **No Email Verification**: User registration does not send a verification email; accounts are active immediately after registration.
- **In-Memory WebSocket State**: WebSocket connections are tracked in-memory. Restarting the server disconnects all clients; a Redis pub/sub layer would be needed for multi-instance deployments.
- **JWT Expiry**: Access tokens expire after 60 minutes with no refresh-token mechanism; users must re-login after expiry.
- **Search**: Full-text search across questions is not implemented in this version.
- **File Uploads**: Attachments or image uploads in questions/answers are not supported.

---

## 🛠️ **Future Enhancements**

1. **Advanced AI Integration** (OpenAI GPT/Langchain with vector embeddings)
2. **Email Notifications** for admins
3. **Question Categories/Tags**
4. **Search Functionality**
5. **Pagination** for large question lists
6. **User Profiles** with avatar
7. **Upvote/Downvote** system
8. **Rate Limiting** on API
9. **Moderation Tools** (delete/edit questions)
10. **Analytics Dashboard** (question metrics)

---

## 📧 **Contact & Support**

**GitHub Repository**: [https://github.com/krishnaak114/Q-A-Dashboard](https://github.com/krishnaak114/Q-A-Dashboard)

**Clone URL (HTTPS)**: `https://github.com/krishnaak114/Q-A-Dashboard.git`  
**Clone URL (SSH)**: `git@github.com:krishnaak114/Q-A-Dashboard.git`

For questions or issues, please open a GitHub issue or contact the development team.

---

## 📄 **License**

This project was built as a full-stack assessment. Feel free to use as reference or extend for your own projects.

MIT License - See repository for details.

---

**Built with ❤️ using FastAPI, Next.js, and WebSockets**
