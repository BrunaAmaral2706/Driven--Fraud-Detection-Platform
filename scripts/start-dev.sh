#!/usr/bin/env bash
# Driven Fraud Detection Platform — Start Development Environment
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "Starting Driven Fraud Detection Platform..."

cd "$ROOT/backend"
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

sleep 2

cd "$ROOT/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "  Frontend:  http://localhost:5173"
echo "  Backend:   http://localhost:8000"
echo "  API Docs:  http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
