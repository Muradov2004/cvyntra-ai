"""
AI Prompts for CVyntra AI

These prompts instruct the LLM to analyze resumes in a structured, JSON-compatible way.
"""

# ── ATS & General Resume Analysis ────────────────────────────────
ANALYZE_RESUME_PROMPT = """You are an expert ATS (Applicant Tracking System) specialist and professional resume coach.

Analyze the following resume text and return a JSON object with this exact structure:

{{
  "score": <integer 0-100, ATS compatibility score>,
  "strengths": [<list of 3-5 specific strengths as strings>],
  "weaknesses": [<list of 3-5 specific weaknesses as strings>],
  "missing_skills": [<list of important missing technologies/skills>],
  "suggestions": [<list of 5 actionable improvement suggestions>],
  "job_match_score": {job_match_score},
  "summary_analysis": "<2-3 sentence overall analysis>",
  "improved_summary": "<a professionally rewritten 3-sentence summary section>",
  "improved_experience": [<list of 3 rewritten experience bullet points with metrics>]
}}

Resume Text:
{resume_text}

{job_desc_section}

IMPORTANT:
- Return ONLY valid JSON, no markdown fences or extra text.
- Be specific and actionable in all fields.
- Score criteria: 80+ = strong ATS pass, 60-79 = moderate, 40-59 = weak, <40 = likely rejected.
"""

JOB_DESC_SECTION = """Job Description:
{job_description}

Calculate job_match_score (0-100) based on keyword overlap between resume and job description.
Include relevant missing keywords in missing_skills."""

NO_JOB_DESC_SECTION = "No job description provided. Set job_match_score to null."

# ── Job Match ────────────────────────────────────────────────────
JOB_MATCH_PROMPT = """You are an expert recruiter and ATS specialist.

Compare the following resume to the job description and return JSON:

{{
  "job_match_score": <integer 0-100>,
  "missing_keywords": [<list of important keywords from job description missing in resume>],
  "improvement_suggestions": [<list of 4 specific suggestions to improve job match>]
}}

Resume:
{resume_text}

Job Description:
{job_description}

Return ONLY valid JSON.
"""

# ── Resume Improvement ────────────────────────────────────────────
IMPROVE_PROMPT = """You are an elite professional resume writer.

The following resume was analyzed with these results:
- ATS Score: {score}/100
- Weaknesses: {weaknesses}
- Missing skills: {missing_skills}

Rewrite the resume's key sections to be more impactful and professional.
Return JSON:

{{
  "improved_summary": "<a compelling 3-sentence professional summary with metrics>",
  "improved_experience": [<list of 3-4 rewritten bullet points using STAR method with quantifiable metrics>]
}}

Return ONLY valid JSON.
"""
