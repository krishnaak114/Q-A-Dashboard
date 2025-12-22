# .github Repository Configuration

This directory contains GitHub-specific configuration files for the Q&A Dashboard project.

## Files Overview

- **workflows/ci.yml** - GitHub Actions CI/CD pipeline
- **ISSUE_TEMPLATE/** - Templates for bug reports and feature requests
- **PULL_REQUEST_TEMPLATE.md** - Template for pull requests

## CI/CD Pipeline

The GitHub Actions workflow runs on every push and pull request:

1. **Backend Tests** - Runs pytest on Python backend
2. **Frontend Build** - Verifies Next.js build succeeds
3. **Docker Deployment** - Tests full containerized deployment

All jobs must pass before merging to main branch.
