from aiogram import Bot, Dispatcher
import asyncio
import os
from bot.handlers.start_command import router as handlers_router
from app.core.config import settings

bot_token = settings.BOT_TOKEN
bot = Bot(token=bot_token)
dp = Dispatcher()
dp.include_router(handlers_router)

async def main():
    print("Bot is starting...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
