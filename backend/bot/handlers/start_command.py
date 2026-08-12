from aiogram import Router, F
from aiogram.filters import Command
from aiogram.types import Message, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo

router = Router()

@router.message(Command("start"))
async def start_cmd(message: Message):
    open_mini_app = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="Открыть Mini App",
                    web_app=WebAppInfo(url="https://google.com")
                )
            ]
        ]
    )
    await message.answer("Приветствую!\n\n"
        "Нажмите на кнопку ниже, чтобы открыть приложение:",
        reply_markup=open_mini_app
    )