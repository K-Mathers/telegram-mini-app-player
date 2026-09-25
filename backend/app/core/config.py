from pydantic_settings import BaseSettings, SettingsConfigDict

class Setting(BaseSettings):
    DATABASE_URL: str
    BOT_TOKEN: str
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_DAYS: int
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str
    CORS_ORIGINS: str
    DEBUG: bool = False
    WEBAPP_URL: str = "your_https_web_client"

    model_config = SettingsConfigDict(env_file=".env")

settings = Setting()