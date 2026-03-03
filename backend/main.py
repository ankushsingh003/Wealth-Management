from fastapi import FastAPI

app = FastAPI(title="Wealth Management Agentic AI")

@app.get("/")
async def root():
    return {"message": "Welcome to the Wealth Management Research API"}
