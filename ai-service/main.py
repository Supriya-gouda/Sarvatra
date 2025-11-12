from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from services.misinformation_filter import calculate_trust_score

app = FastAPI(title="Disaster Alert AI Service", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FilterRequest(BaseModel):
    reportId: str
    text: str
    photoUrl: Optional[str] = None
    latitude: float
    longitude: float
    disasterType: str

class FilterResponse(BaseModel):
    reportId: str
    trustScore: int
    trustTag: str
    scores: dict
    reasoning: str

@app.post("/api/filter", response_model=FilterResponse)
async def filter_report(request: FilterRequest):
    """
    Analyze disaster report for credibility.
    Returns trust score (0-100) and breakdown.
    
    Formula: (Sentiment×0.4) + (Keywords×0.2) + (Location×0.25) + (Image×0.15)
    """
    result = await calculate_trust_score(
        request.reportId,
        request.text,
        request.photoUrl,
        request.latitude,
        request.longitude,
        request.disasterType
    )
    return FilterResponse(**result)

@app.get("/health")
async def health():
    return {
        "status": "ok", 
        "service": "AI Microservice",
        "version": "1.0.0"
    }

@app.get("/")
async def root():
    return {
        "message": "Smart Disaster Alert - AI Service",
        "endpoints": ["/api/filter", "/health"]
    }
