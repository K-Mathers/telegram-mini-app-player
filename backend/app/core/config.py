# для управления конфигурацией приложения описываем класс подключения к бд
from pydantic_settings import BaseSettings, SettingConfigDict

class Setting(BaseSettings):
    DATABASE_URL: str

    model_config = SettingConfigDict(env_file=".env")

settings = Setting()