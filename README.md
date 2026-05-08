# CVyntra AI 🚀

**AI-Powered Resume Analysis, ATS Scoring, Job Matching & Resume Improvement**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38bdf8)](https://tailwindcss.com)

---

## 🗂 Project Structure

```
cvyntra-ai/
├── frontend/               # React + Vite + Tailwind + Framer Motion
│   └── src/
│       ├── pages/          # LandingPage, AnalyzePage, ResultsPage
│       ├── components/     # Navbar, ScoreRing, AILoader, Toast, etc.
│       └── services/       # api.js (Axios calls + mock fallback)
│
└── backend/                # FastAPI
    ├── app/
    │   ├── main.py         # App factory + CORS
    │   ├── routes/         # cv_routes.py (analyze, job-match, improve)
    │   ├── services/       # ai_service.py (OpenAI + mock)
    │   ├── prompts/        # cv_prompts.py
    │   ├── models/         # schemas.py (Pydantic)
    │   ├── utils/          # file_parser.py (PDF + DOCX)
    │   └── config/         # settings.py
    ├── main.py             # Uvicorn entry point
    ├── requirements.txt
    └── .env.example
```

---

## 🚀 Quick Start

### Backend

```bash
cd cvyntra-ai/backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\activate      # Windows
source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY (optional – mock mode works without it)

# Start server
uvicorn main:app --reload
# API available at: http://localhost:8000
# Swagger docs:    http://localhost:8000/api/docs
```

### Frontend

```bash
cd cvyntra-ai/frontend

npm install
npm run dev
# App available at: http://localhost:5173
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` in the backend folder:

| Variable | Description | Default |
|---|---|---|
| `OPENAI_API_KEY` | Your OpenAI API key | `""` |
| `OPENAI_BASE_URL` | API base URL (compatible with other providers) | `https://api.openai.com/v1` |
| `OPENAI_MODEL` | Model to use | `gpt-4o-mini` |
| `MAX_FILE_SIZE_MB` | Max upload size | `5` |
| `USE_MOCK` | Force mock responses | `false` |

> **No API key?** The app works fully with realistic mock responses.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/cv/analyze` | Analyze CV + optional job description |
| `POST` | `/api/cv/job-match` | Compare CV to job description |
| `POST` | `/api/cv/improve` | AI-improve resume content |
| `GET` | `/health` | Health check |
| `GET` | `/api/docs` | Swagger UI |

### Response Format

```json
{
  "score": 85,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "missing_skills": ["Docker", "AWS"],
  "suggestions": ["..."],
  "job_match_score": 72,
  "summary_analysis": "...",
  "improved_summary": "...",
  "improved_experience": ["..."]
}
```

---

## ✨ Features

- **ATS Score Analysis** – Instantly score your resume's ATS compatibility (0–100)
- **Job Match Analysis** – Compare resume vs. job description with keyword matching
- **Missing Skills Detection** – Find critical skills you're lacking for a role
- **AI Suggestions** – Personalized, actionable improvement recommendations
- **Resume Improvement** – AI rewrites your summary and experience bullets
- **Dark Mode** – Full light/dark mode toggle
- **Drag & Drop Upload** – PDF & DOCX support with live preview
- **Download Results** – Export analysis as JSON

---

## 🎨 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, JavaScript |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Routing | React Router DOM v6 |
| HTTP | Axios |
| Backend | FastAPI (Python) |
| AI | OpenAI-compatible API |
| File Parsing | PyPDF2, python-docx |
| Validation | Pydantic v2 |

---

## 📝 License

MIT
