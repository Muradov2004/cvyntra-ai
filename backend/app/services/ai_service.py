"""
AI service: calls OpenAI-compatible API or returns mock data when key is absent.
"""
import json
import logging
import re
from typing import Optional

from app.config.settings import settings
from app.prompts.cv_prompts import (
    ANALYZE_RESUME_PROMPT,
    JOB_DESC_SECTION,
    NO_JOB_DESC_SECTION,
    JOB_MATCH_PROMPT,
    IMPROVE_PROMPT,
)

logger = logging.getLogger(__name__)

# ── Mock data (used when OpenAI key is not configured) ────────────
MOCK_ANALYSIS = {
    "score": 85,
    "strengths": [
        "Strong technical skill set with modern web technologies",
        "Clear and well-structured work experience section",
        "Relevant educational background listed",
        "Good use of action verbs in experience descriptions",
    ],
    "weaknesses": [
        "Professional summary is too brief and lacks impact",
        "No quantifiable achievements or metrics mentioned",
        "Missing links to GitHub portfolio or personal projects",
    ],
    "missing_skills": ["Docker", "Kubernetes", "AWS", "CI/CD pipelines", "GraphQL"],
    "suggestions": [
        "Add specific metrics to experience bullets (e.g., 'Increased performance by 40%').",
        "Include a direct link to your GitHub or portfolio website.",
        "Expand your professional summary to 3-4 compelling sentences.",
        "Add a 'Projects' section showcasing key personal or open-source work.",
        "Tailor your skills section to mirror keywords in target job descriptions.",
    ],
    "job_match_score": 72,
    "summary_analysis": (
        "Your resume demonstrates solid technical foundations and relevant experience. "
        "However, the absence of quantifiable achievements and a compelling summary "
        "may reduce your ATS score. Adding metrics and tailoring keywords to the role "
        "will significantly boost your chances."
    ),
    "improved_summary": (
        "Experienced Full Stack Developer with 4+ years building scalable web applications "
        "using React, Node.js, and Python. Proven track record of delivering high-quality "
        "products in agile environments, improving load times by 35% and boosting engagement "
        "by 20%. Passionate about clean architecture and AI-integrated solutions."
    ),
    "improved_experience": [
        "Architected and deployed a React + FastAPI SaaS platform serving 5,000+ daily users with 99.9% uptime.",
        "Reduced API response times by 40% through query optimisation and Redis caching.",
        "Led a cross-functional team of 4 engineers, delivering milestones 2 weeks ahead of schedule.",
    ],
}

MOCK_JOB_MATCH = {
    "job_match_score": 72,
    "missing_keywords": ["Docker", "AWS Lambda", "Terraform", "GraphQL"],
    "improvement_suggestions": [
        "Mention containerisation experience with Docker or Podman.",
        "Highlight any cloud deployments on AWS, GCP, or Azure.",
        "Include GraphQL API experience if applicable.",
        "Add keywords from the job description to your skills section.",
    ],
}

MOCK_IMPROVE = {
    "improved_summary": (
        "Results-driven Software Engineer with expertise in full-stack development, cloud infrastructure, "
        "and AI integration. Delivered 15+ production applications, consistently improving system performance "
        "and user satisfaction metrics by 25%+."
    ),
    "improved_experience": [
        "Spearheaded migration of legacy monolith to microservices architecture, cutting deployment time by 60%.",
        "Implemented automated testing pipelines that reduced QA cycles by 50% and production bugs by 35%.",
        "Collaborated with product and design teams to ship 3 major features, driving a 22% increase in retention.",
    ],
}


# ── Helpers ───────────────────────────────────────────────────────
def _extract_json(text: str) -> dict:
    """
    Extract the first JSON object from a potentially messy LLM response.
    """
    # Strip markdown code fences if present
    cleaned = re.sub(r"```(?:json)?", "", text).strip()
    # Find first { … }
    match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if not match:
        raise ValueError("No JSON object found in AI response.")
    return json.loads(match.group())


def _get_client():
    """Build and return an OpenAI client."""
    from openai import OpenAI
    return OpenAI(
        api_key=settings.OPENAI_API_KEY,
        base_url=settings.OPENAI_BASE_URL,
    )


async def _call_llm(prompt: str) -> dict:
    """
    Call the LLM with the given prompt and return parsed JSON.
    Falls back to mock data on any error if key is absent.
    """
    if not settings.has_api_key or settings.USE_MOCK:
        logger.info("No API key configured – returning mock response.")
        return None  # caller decides which mock to return

    try:
        client = _get_client()
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert resume analyst. Always respond with valid JSON only.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.4,
            max_tokens=2000,
        )
        raw = response.choices[0].message.content
        return _extract_json(raw)
    except Exception as e:
        logger.error(f"LLM call failed: {e}")
        return None  # fall back to mock


# ── Public service functions ──────────────────────────────────────

async def analyze_resume(resume_text: str, job_description: Optional[str] = None) -> dict:
    """
    Full CV analysis: ATS score, strengths, weaknesses, suggestions, etc.
    """
    job_section = (
        JOB_DESC_SECTION.format(job_description=job_description)
        if job_description
        else NO_JOB_DESC_SECTION
    )
    job_match_score = "null" if not job_description else "calculated"

    prompt = ANALYZE_RESUME_PROMPT.format(
        resume_text=resume_text[:6000],  # trim for token safety
        job_desc_section=job_section,
        job_match_score=job_match_score,
    )

    result = await _call_llm(prompt)
    if result is None:
        mock = MOCK_ANALYSIS.copy()
        if not job_description:
            mock["job_match_score"] = None
        return mock
    return result


async def match_job(resume_text: str, job_description: str) -> dict:
    """
    Compare resume against job description for keyword match score.
    """
    prompt = JOB_MATCH_PROMPT.format(
        resume_text=resume_text[:4000],
        job_description=job_description[:3000],
    )
    result = await _call_llm(prompt)
    return result if result is not None else MOCK_JOB_MATCH


async def improve_resume(analysis: dict) -> dict:
    """
    Rewrite resume summary and experience bullets using AI.
    """
    prompt = IMPROVE_PROMPT.format(
        score=analysis.get("score", 0),
        weaknesses=", ".join(analysis.get("weaknesses", [])),
        missing_skills=", ".join(analysis.get("missing_skills", [])),
    )
    result = await _call_llm(prompt)
    return result if result is not None else MOCK_IMPROVE
