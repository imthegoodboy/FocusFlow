from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "focusflow"
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    GEMINI_API_KEY: str = ""  # Add your Gemini API key in .env file
    BENTOML_ENDPOINT: str = "http://localhost:3000/predict"  # BentoML service endpoint
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://focus-flow-steel-phi.vercel.app",
        "https://focusflow-n2j9.onrender.com",
        "https://focus-flow-3maz0q9zg-qwdxqws-projects.vercel.app",
    ]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()

