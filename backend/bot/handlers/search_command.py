
from aiogram import Router
from aiogram.types import Message, InlineKeyboardButton, InlineKeyboardMarkup
from aiogram.filters import Command, CommandObject
from sqlalchemy import select
from app.core.database import async_session
from app.models.track import Track
from aiogram import F
from aiogram.types import CallbackQuery

router = Router()

@router.message(Command("search"))
async def search_track(message: Message, command: CommandObject):
    search_query = command.args

    if not search_query:
        await message.answer("Пожалуйста, введите название трека. \nПример: /search Mockingbird")
        return

    async with async_session() as db:
        query_serch = select(Track).where(Track.title.ilike(f"%{search_query}%"))
        query_result = await db.execute(query_serch)
        search_tracks = query_result.scalars().all()

        if not search_tracks:
            await message.answer("К сожалению, по вашему запросу ничего не нашел. Попробуйте ещё раз.")
            return

        buttons = [
            [InlineKeyboardButton(
                text=track.title,
                callback_data=f"track_{track.id}"
            )]
            for track in search_tracks
        ]

        inline_keyboard = InlineKeyboardMarkup(inline_keyboard=buttons)
        response_text = f"Я нашел {len(search_tracks)} трек(ов):"
    
        await message.answer(response_text, reply_markup=inline_keyboard)

@router.callback_query(F.data.startswith("track_"))
async def get_track(callback: CallbackQuery):
    track_id = int(callback.data.split("_")[1])

    async with async_session() as db:
        query_id = select(Track).where(Track.id == track_id)
        result_id = await db.execute(query_id)
        track = result_id.scalar_one_or_none()

    if not track:
        await callback.answer("Доступ к треку заблокирован")
        return
    
    await callback.message.answer_audio(audio=track.audio_url)
    await callback.answer()