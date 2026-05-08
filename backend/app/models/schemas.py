from pydantic import BaseModel
from typing import List, Optional


class AnalysisResult(BaseModel):
    """Structured AI analysis result returned to the frontend."""
    score: int
    strengths: List[str]
    weaknesses: List[str]
    missing_skills: List[str]
    suggestions: List[str]
    job_match_score: Optional[int] = None
    summary_analysis: str
    improved_summary: Optional[str] = None
    improved_experience: Optional[List[str]] = None


class JobMatchResult(BaseModel):
    """Job match comparison result."""
    job_match_score: int
    missing_keywords: List[str]
    improvement_suggestions: List[str]


class ImproveRequest(BaseModel):
    """Request payload for resume improvement."""
    score: int
    strengths: List[str] = []
    weaknesses: List[str] = []
    missing_skills: List[str] = []
    suggestions: List[str] = []
    job_match_score: Optional[int] = None
    summary_analysis: str = ""
    improved_summary: Optional[str] = None
    improved_experience: Optional[List[str]] = None


class ImproveResult(BaseModel):
    """Result from resume improvement."""
    improved_summary: str
    improved_experience: List[str]
