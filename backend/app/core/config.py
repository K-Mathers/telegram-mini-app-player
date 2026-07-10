from pydantic_settings import BaseSettings, SettingsConfigDict

class Setting(BaseSettings):
    DATABASE_URL: str
    BOT_TOKEN: str
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_DAYS: int

    model_config = SettingsConfigDict(env_file=".env")

settings = Setting()