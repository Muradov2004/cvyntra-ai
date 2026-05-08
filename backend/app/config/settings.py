"""
Configuration and settings using environment variables.
"""
import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_BASE_URL: str = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    MAX_FILE_SIZE_MB: int = int(os.getenv("MAX_FILE_SIZE_MB", "5"))
    USE_MOCK: bool = os.getenv("USE_MOCK", "false").lower() == "true"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

    @property
    def has_api_key(self) -> bool:
        return bool(self.OPENAI_API_KEY and self.OPENAI_API_KEY != "your-api-key-here")


settings = Settings()
