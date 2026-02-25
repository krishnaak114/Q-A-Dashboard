# 🚀 QUICK START GUIDE

## 🎯 Get Up and Running in 5 Minutes

### Step 0: Clone Repository

```powershell
# Clone from GitHub
git clone https://github.com/krishnaak114/Q-A-Dashboard.git
cd Q-A-Dashboard
```

**SSH Clone**:
```powershell
git clone git@github.com:krishnaak114/Q-A-Dashboard.git
cd Q-A-Dashboard
```

---

### Option 1: Docker Compose (Easiest - Recommended)

```powershell
# Already in project directory from clone

# Start everything with one command
docker-compose up --build

# That's it! Visit:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

To stop:
```powershell
docker-compose down
```

---

### Option 2: Manual Setup (Step-by-Step)

#### Step 1: Backend Setup

```powershell
cd backend

# Run setup script (Windows PowerShell)
.\setup.ps1

# OR on Linux/Mac:
chmod +x setup.sh
./setup.sh

# Start the backend server
python -m uvicorn app.main:app --reload
```

Backend runs at: **http://localhost:8000**  
API Docs: **http://localhost:8000/docs**

#### Step 2: Frontend Setup (New Terminal)

```powershell
cd frontend

# Run setup script (Windows PowerShell)
.\setup.ps1

# OR on Linux/Mac:
chmod +x setup.sh
./setup.sh

# Start the frontend
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## 🧪 Test the Application

### 1. Visit the Dashboard
Open http://localhost:3000 - you'll see the Q&A forum

### 2. Submit a Question as Guest
- Enter your name (or leave as "Guest")
- Type a question
- Click "Submit Question"
- ✅ Question appears instantly!

### 3. Open Another Browser Window
- Open http://localhost:3000 in an incognito/private window
- ✅ You'll see the question you just submitted in real-time!

### 4. Create an Admin Account

```powershell
# Register via UI: http://localhost:3000/register
# Or via API:

curl -X POST http://localhost:8000/auth/register -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"email\":\"admin@test.com\",\"password\":\"admin123\"}"

# Make user an admin (run in backend directory):
python

>>> from app.database import SessionLocal
>>> from app.models import User
>>> db = SessionLocal()
>>> admin = db.query(User).filter(User.username == "admin").first()
>>> admin.is_admin = 1
>>> db.commit()
>>> exit()
```

### 5. Login as Admin
- Go to http://localhost:3000/login
- Username: `admin`
- Password: `admin123`
- ✅ You'll see "Admin" badge and status controls!

### 6. Test Admin Features
- Click "Escalate" on a question
- ✅ Question moves to the top
- ✅ Other windows update instantly!

---

## 🎨 What You Should See

### Dashboard
```
┌─────────────────────────────────────────────────┐
│  Hemut Q&A Dashboard                  [Logout]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  Ask a Question                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Your Name: Guest                        │   │
│  │ Question: What is the capital of France?│   │
│  │                                         │   │
│  └─────────────────────────────────────────┘   │
│  [Submit Question]                             │
│                                                 │
│  Questions                          ● Live     │
│  ┌─────────────────────────────────────────┐   │
│  │ Guest • 2 min ago          [Escalated]  │   │
│  │ What is the capital of France?          │   │
│  │                                         │   │
│  │ Admin Actions: [Pending] [Answered]    │   │
│  │                                         │   │
│  │ Answers (1)                             │   │
│  │ HelpfulUser: Paris is the capital!     │   │
│  │                                         │   │
│  │ [+ Add Answer]                          │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## 📋 Feature Checklist

Test these features:

- [ ] Submit question as guest ✅
- [ ] See question appear in real-time ✅
- [ ] Answer a question ✅
- [ ] Register new account ✅
- [ ] Login with credentials ✅
- [ ] Mark question as Escalated (admin) ✅
- [ ] See escalated question move to top ✅
- [ ] Mark question as Answered (admin) ✅
- [ ] See live updates in multiple browser windows ✅
- [ ] WebSocket connection indicator shows "Live" ✅

---

## 🐛 Troubleshooting

### Backend won't start
```powershell
# Make sure Python 3.11+ is installed
python --version

# Recreate virtual environment
cd backend
Remove-Item -Recurse -Force venv
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Frontend won't start
```powershell
# Make sure Node.js 18+ is installed
node --version

# Clear node_modules and reinstall
cd frontend
Remove-Item -Recurse -Force node_modules
npm install
```

### WebSocket not connecting
- Check backend is running on port 8000
- Check browser console for errors
- Verify `.env.local` has correct `NEXT_PUBLIC_WS_URL`

### Database errors
```powershell
# Delete and recreate database
cd backend
Remove-Item qa_dashboard.db
# Restart backend - tables will auto-create
```

---

## 🎓 Understanding the Code

### Backend Entry Point
[backend/app/main.py](backend/app/main.py) - FastAPI app initialization

### WebSocket Logic
[backend/app/websocket.py](backend/app/websocket.py) - Real-time connection manager

### Frontend Main Page
[frontend/src/app/page.tsx](frontend/src/app/page.tsx) - Dashboard component

### WebSocket Hook
[frontend/src/hooks/useWebSocket.ts](frontend/src/hooks/useWebSocket.ts) - React hook for WS

### AJAX Validation
[frontend/src/utils/api.ts](frontend/src/utils/api.ts) - XMLHttpRequest implementation

---

## 📚 Next Steps

1. **Explore the API**: http://localhost:8000/docs
2. **Test with Multiple Users**: Open multiple browser windows
3. **Customize**: Edit styles in `.module.css` files
4. **Add Features**: See README.md for enhancement ideas
5. **Deploy**: Use Docker Compose for production

---

## 💡 Pro Tips

- **Auto-reload**: Both backend and frontend auto-reload on code changes
- **Debug**: Check browser DevTools Console and Network tab
- **Logs**: Backend logs appear in terminal where uvicorn is running
- **Database**: Use `sqlite3 backend/qa_dashboard.db` to inspect data

---

**Need help?** Check the main [README.md](README.md) for detailed documentation!
