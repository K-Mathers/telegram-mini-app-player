from aiogram import Bot, Dispatcher
import asyncio
import os

bot_token = os.getenv("BOT_TOKEN", "your_bot_token_here")
bot = Bot(token=bot_token)
dp = Dispatcher()

async def main():
    print("Bot is starting...")
    # Здесь будет подключение роутеров
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
