# Eminem Player (Telegram Mini App)

Музыкальный плеер в формате Telegram Mini App для прослушивания официальной и неизданной (слитой) музыки Эминема. Сервис объединяет удобство современного аудиостриминга и возможности экосистемы Telegram.

## Структура проекта
- `backend/` - FastAPI бэкенд и Aiogram телеграм-бот.
- `frontend/` - React + Vite приложение для WebView.

## Запуск локально
1. Запустите базу данных:
   ```bash
   docker-compose up -d
   ```
2. Установите зависимости бэкенда и запустите (в виртуальном окружении):
   ```bash
   cd backend
   python -m venv venv
   source venv/Scripts/activate # для Windows
   pip install -r requirements.txt
   uvicorn main_api:app --reload
   ```
3. Установите зависимости фронтенда и запустите:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
