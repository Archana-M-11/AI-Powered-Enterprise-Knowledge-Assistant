from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    frontend_url: str = "http://localhost:5173"

    gemini_api_key: str

    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    llm_model: str = "gemini-3.5-flash"

    hf_token: str | None = None

    langsmith_api_key: str | None = None
    langsmith_tracing: bool = False
    langchain_project: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env"
    )


settings = Settings()