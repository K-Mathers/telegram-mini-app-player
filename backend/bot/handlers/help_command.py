from aiogram import Router
from aiogram.filters import Command
from aiogram.types import Message

router = Router()

@router.message(Command("help"))
async def help_cmd(message: Message):
    await message.answer(
        "🛠 *Доступные команды:*\n\n"
        "/start — Иформация о боте, ссылка на приложение.\n"
        "/search — Поиск трека по названию.\n"
        "/help — Показать сообщение с функционалом.",
        parse_mode="Markdown"
    )