from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.agents.graph import app_graph

app = FastAPI(title="Wealth Management Agentic AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    ticker: str

@app.get("/")
async def root():
    return {"message": "Welcome to the Wealth Management Research API"}

@app.post("/research")
async def run_research(request: ResearchRequest):
    try:
        initial_state = {
            "ticker": request.ticker,
            "sec_data": "",
            "news_sentiment": "",
            "compliance_check": "",
            "final_report": "",
            "messages": []
        }
        result = app_graph.invoke(initial_state)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
