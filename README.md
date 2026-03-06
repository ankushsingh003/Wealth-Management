# 🛡️ WealthIQ — Agentic AI Research Platform

> **Automated CFA-Compliant Due Diligence** powered by LangGraph multi-agent orchestration.  
> Synthesizes SEC EDGAR filings and real-time news sentiment into professional research reports.

---

## 📸 Platform Overview

A high-level research platform designed for **institutional wealth management**, featuring:
- **Multi-agent LangGraph workflow** — Researcher → Analyst → Compliance → Synthesis
- **CFA Standard V(A) compliance** — *Diligence and Reasonable Basis* validation built-in
- **Real-time SEC EDGAR data** via the official SEC API (no key required)
- **News Sentiment Analysis** using `yfinance` + `TextBlob`
- **Premium dark-mode dashboard** — glassmorphism, animated orbs, live agent console

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│              React Frontend (Vite)                  │
│  Sidebar · Input Panel · Agent Console · Workspace  │
└───────────────────┬─────────────────────────────────┘
                    │ HTTP POST /research (CORS-enabled)
┌───────────────────▼─────────────────────────────────┐
│              FastAPI Backend                        │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │         LangGraph Orchestration              │   │
│  │  [Researcher] → [Analyst] → [Compliance]    │   │
│  │  → [Synthesis] → Final Report               │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  Tools: SEC EDGAR API · yfinance · TextBlob         │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start (Local)

### Prerequisites
- Python ≥ 3.10
- Node.js ≥ 18

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
cd ..
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open: **`http://localhost:5173`**

---

## 🐳 Docker Deployment (One-Command)

```bash
docker-compose up --build
```

| Service   | URL                       |
|-----------|---------------------------|
| Frontend  | http://localhost:5173     |
| Backend   | http://localhost:8000     |
| API Docs  | http://localhost:8000/docs |

---

## 📡 API Reference

### `POST /research`
Trigger the full agentic due diligence pipeline.

**Request:**
```json
{ "ticker": "TSLA" }
```

**Response:**
```json
{
  "ticker": "TSLA",
  "sec_data": "...",
  "news_sentiment": "...",
  "compliance_check": "CFA Standard V(A) PASSED: ...",
  "final_report": "<h1>Investment Research Report: TSLA</h1>...",
  "messages": ["Researcher finished", "Analyst finished", ...]
}
```

---

## 🤖 Agent Workflow

| Agent | Role |
|---|---|
| **Researcher** | Fetches 10-K/10-Q from SEC EDGAR, extracts key metadata |
| **Analyst** | Retrieves company news via `yfinance`, runs `TextBlob` sentiment |
| **Compliance** | Validates research basis against CFA Standard V(A) |
| **Synthesis** | Generates an HTML-formatted institutional-grade report |

---

## 📁 Project Structure

```
Wealth-Management/
├── backend/
│   ├── main.py              # FastAPI entry point + CORS
│   ├── requirements.txt     # Python dependencies
│   ├── agents/
│   │   └── graph.py         # LangGraph state machine
│   └── tools/
│       ├── sec_tools.py     # SEC EDGAR retrieval
│       └── news_tools.py    # News sentiment analysis
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Premium dashboard UI
│   │   ├── main.jsx         # React 18 entry point
│   │   └── index.css        # Base styles
│   ├── index.html
│   └── vite.config.js
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🔒 CFA Compliance Framework

This platform is architected around **CFA Institute Code of Ethics & Standards of Professional Conduct**:

- **Standard V(A)** — *Diligence and Reasonable Basis*: Every report includes a compliance audit verifying that both primary source data (SEC) and corroborating market data (sentiment) are present before a "Diligence-Verified" status is assigned.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Lucide Icons |
| Backend | FastAPI, Uvicorn |
| AI Orchestration | LangGraph, LangChain |
| Data Sources | SEC EDGAR API, yfinance, TextBlob |
| Deployment | Docker, Docker Compose |

---

## 📜 License

MIT License — © 2026 WealthIQ Agentic Research

---

*Built for high-level institutional research. Not financial advice.*
