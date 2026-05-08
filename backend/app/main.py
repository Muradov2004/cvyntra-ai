from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import cv_router

def create_app() -> FastAPI:
    app = FastAPI(
        title="CVyntra AI API",
        description="AI-powered resume analysis, job matching, and improvement backend.",
        version="1.0.0",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
    )

    # ── CORS ──────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],          # tighten in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Routers ───────────────────────────────────────────────────
    app.include_router(cv_router, prefix="/api/cv", tags=["CV Analysis"])

    @app.get("/", tags=["Health"])
    async def root():
        return {"message": "CVyntra AI API is running", "version": "1.0.0"}

    @app.get("/health", tags=["Health"])
    async def health():
        return {"status": "ok"}

    return app

app = create_app()
