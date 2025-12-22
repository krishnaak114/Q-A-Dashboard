# 🎯 Hemut Trial Project: Real-Time Q&A Dashboard

A full-stack real-time Q&A platform built with **FastAPI**, **Next.js**, and **WebSockets**. Users can submit questions, provide answers, and admins can manage question statuses with live updates across all connected clients.

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
✅ **Database**: SQLite (local) with easy PostgreSQL migration path  

---

## 🏗️ **Architecture**

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend API** | FastAPI 0.110.0 | REST API endpoints |
| **Real-time** | WebSockets | Live updates to all clients |
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
cd hemut-qa-dashboard

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
hemut-qa-dashboard/
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
- [ ] **RAG/Langchain** (optional - not implemented, can add mock)

---

## 🛠️ **Future Enhancements**

1. **AI Auto-Suggest Answers** (Langchain integration)
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

**GitHub Repository**: https://github.com/yourusername/hemut-qa-dashboard

For questions or issues, please open a GitHub issue or contact the development team.

---

## 📄 **License**

This is a trial project built for the Hemut assignment. Feel free to use as reference or extend for your own projects.

---

**Built with ❤️ using FastAPI, Next.js, and WebSockets**
