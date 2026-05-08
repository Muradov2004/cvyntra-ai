"""
File parsing utilities for PDF and DOCX resume files.
"""
import io
import logging
from fastapi import UploadFile, HTTPException

logger = logging.getLogger(__name__)


async def extract_text(file: UploadFile) -> str:
    """
    Extract plain text from a PDF or DOCX upload.
    Raises HTTPException if the file type is unsupported or parsing fails.
    """
    filename = file.filename or ""
    ext = filename.rsplit(".", 1)[-1].lower()

    contents = await file.read()

    if ext == "pdf":
        return _parse_pdf(contents, filename)
    elif ext == "docx":
        return _parse_docx(contents, filename)
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '.{ext}'. Please upload a PDF or DOCX file."
        )


def _parse_pdf(contents: bytes, filename: str) -> str:
    """Extract text from PDF bytes using PyPDF2."""
    try:
        import PyPDF2

        reader = PyPDF2.PdfReader(io.BytesIO(contents))
        pages = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                pages.append(text.strip())

        full_text = "\n\n".join(pages)
        if not full_text.strip():
            raise HTTPException(
                status_code=422,
                detail="PDF appears to be empty or contains only images. Please use a text-based PDF."
            )
        return full_text

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF parsing error for '{filename}': {e}")
        raise HTTPException(status_code=422, detail=f"Failed to parse PDF: {str(e)}")


def _parse_docx(contents: bytes, filename: str) -> str:
    """Extract text from DOCX bytes using python-docx."""
    try:
        from docx import Document

        doc = Document(io.BytesIO(contents))
        paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
        full_text = "\n\n".join(paragraphs)

        if not full_text.strip():
            raise HTTPException(
                status_code=422,
                detail="DOCX file appears to be empty."
            )
        return full_text

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"DOCX parsing error for '{filename}': {e}")
        raise HTTPException(status_code=422, detail=f"Failed to parse DOCX: {str(e)}")
