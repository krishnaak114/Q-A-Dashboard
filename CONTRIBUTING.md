# Contributing to Real-Time Q&A Dashboard

Thank you for your interest in contributing to this project! 🎉

## 📋 Project Information

**Repository**: [github.com/krishnaak114/Q-A-Dashboard](https://github.com/krishnaak114/Q-A-Dashboard)  
**Purpose**: Full-stack assessment - Real-Time Q&A Dashboard  
**Status**: Complete and functional

## 🔧 Development Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- Git
- Docker (optional, for containerized development)

### Quick Setup

1. **Fork and Clone**
```bash
git clone git@github.com:krishnaak114/Q-A-Dashboard.git
cd Q-A-Dashboard
```

2. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

3. **Frontend Setup** (new terminal)
```bash
cd frontend
npm install
npm run dev
```

## 🌿 Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

## 📝 Commit Guidelines

Follow conventional commits:

```
feat: Add user profile page
fix: Resolve WebSocket reconnection issue
docs: Update API documentation
test: Add unit tests for auth module
refactor: Simplify question sorting logic
```

## 🧪 Testing

Before submitting a pull request:

```bash
# Backend tests
cd backend
pytest

# Frontend build
cd frontend
npm run build
npm run lint
```

## 🚀 Pull Request Process

1. Create a feature branch from `develop`
2. Make your changes
3. Write/update tests
4. Update documentation
5. Run all tests
6. Submit PR with clear description
7. Wait for CI/CD checks to pass
8. Request review

## 📐 Code Style

### Python (Backend)
- Follow PEP 8
- Use type hints
- Document functions with docstrings
- Keep functions small and focused

### TypeScript/React (Frontend)
- Use functional components
- Prefer hooks over class components
- Use TypeScript interfaces
- Follow React best practices

## 🐛 Reporting Issues

When reporting bugs, include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, Python version, Node version)

## 💡 Feature Requests

For feature suggestions:
- Describe the problem it solves
- Provide use cases
- Include mockups if applicable

## 📧 Contact

For questions or discussions:
- Open a GitHub issue
- Start a GitHub discussion
- Contact: krishnaak114

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing!** 🙏
