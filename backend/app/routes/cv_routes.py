"""
CV API Routes
"""
import logging
from typing import Optional

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request

from app.models.schemas import AnalysisResult, JobMatchResult, ImproveRequest, ImproveResult
from app.services import ai_service
from app.utils.file_parser import extract_text
from app.config.settings import settings

logger = logging.getLogger(__name__)

router = APIRouter()


# ── 1. Analyze CV ─────────────────────────────────────────────────
@router.post("/analyze", response_model=AnalysisResult, summary="Analyze a resume with AI")
async def analyze_cv(
    file: UploadFile = File(..., description="PDF or DOCX resume file"),
    job_description: Optional[str] = Form(None, description="Optional job description for match scoring"),
):
    """
    Upload a CV (PDF/DOCX), extract text, run the AI analysis pipeline,
    and return a structured result with ATS score, strengths, weaknesses,
    missing skills, suggestions, job match score, and improved content.
    """
    # Validate file size
    contents = await file.read()
    await file.seek(0)  # reset for re-reading inside extract_text
    if len(contents) > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Max size is {settings.MAX_FILE_SIZE_MB}MB."
        )

    # Extract text
    resume_text = await extract_text(file)

    if not resume_text.strip():
        raise HTTPException(status_code=422, detail="Could not extract text from the uploaded file.")

    logger.info(f"Extracted {len(resume_text)} chars from '{file.filename}'")

    # Run AI analysis
    result = await ai_service.analyze_resume(resume_text, job_description)

    return result


# ── 2. Job Match ──────────────────────────────────────────────────
@router.post("/job-match", response_model=JobMatchResult, summary="Compare CV with a job description")
async def job_match(
    file: UploadFile = File(..., description="PDF or DOCX resume file"),
    job_description: str = Form(..., description="Job description to compare against"),
):
    """
    Compare the uploaded resume against a job description.
    Returns match score, missing keywords, and targeted suggestions.
    """
    if not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")

    resume_text = await extract_text(file)
    result = await ai_service.match_job(resume_text, job_description)
    return result


# ── 3. Improve Resume ─────────────────────────────────────────────
@router.post("/improve", response_model=ImproveResult, summary="AI-improve resume content")
async def improve_resume(analysis: ImproveRequest):
    """
    Takes a previous analysis result and uses AI to rewrite the resume
    summary and experience bullet points with quantifiable metrics and
    professional language.
    """
    result = await ai_service.improve_resume(analysis.model_dump())
    return result
