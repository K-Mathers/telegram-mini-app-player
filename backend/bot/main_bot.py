from aiogram import Bot, Dispatcher
import asyncio
import os
from bot.handlers.start_command import router as start_router
from bot.handlers.search_command import router as handeler_search
from bot.handlers.help_command import router as handler_help
from app.core.config import settings

bot_token = settings.BOT_TOKEN
bot = Bot(token=bot_token)
dp = Dispatcher()
dp.include_router(start_router)
dp.include_router(handeler_search)
dp.include_router(handler_help)

async def main():
    print("Bot is starting...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
