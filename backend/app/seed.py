# Скрипт первоначального наполнения бд, что бы не добавлять вручную

# Что делает: 
# 1. Сканирует указанные папки с аудиофайлами (.mp3, .m4a)
# 2. С помощью библиотеки mutagen автоматически считывает длительность каждого трека
# 3. Загружает обложки в Supabase Storage (бакет 'covers')
# 4. Загружает аудиофайлы в Supabase Storage (бакет 'tracks-audio')
# 5. Создаёт записи альбомов и треков в базе данных PostgreSQL

# Требования:
# 1. Настроенный .env (DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_KEY)
# 2. В Supabase Storage должны быть созданы публичные бакеты: 'covers' и 'tracks-audio'

import asyncio
import re
import uuid
from sqlalchemy import text
from pathlib import Path
import mimetypes

import mutagen

from app.core.database import async_session
from app.core.storage import supabase_client
from app.models.album import Album, AlbumType
from app.models.track import Track

# Настройка альбомов для загрузки, укажите пути к вашим папкам с альбомами 
ALBUMS_TO_SEED = [
    {
        "folder_path": r"C:\Users\lab_1", # папка с треками
        "cover_path": r"C:\Users\lab_1\cover.jpg", # обложка трека
        "title": "Straight From The Lab",
        "year": 2003,
        "type": AlbumType.UNOFFICIAL,
        "tags": ["hip-hop", "encore"]
    },
    {
        "folder_path": r"C:\Users\lab_2",
        "cover_path": r"C:\Users\lab_2\cover.jpg",
        "title": "Straight From The Lab Part 2",
        "year": 2012,
        "type": AlbumType.UNOFFICIAL,
        "tags": ["hip-hop", "king_mathers", "relapse"]
    },
    {
        "folder_path": r"C:\Users\lab_3",
        "cover_path": r"C:\Users\lab_3\cover.jpg",
        "title": "Straight From The Lab Part 3",
        "year": 2025,
        "type": AlbumType.UNOFFICIAL,
        "tags": ["hip-hop", "all_times"]
    }
]

def clean_title(filename: str) -> str:
    """Убирает '01 - ' в начале имени файла, оставляет чистое название."""
    name = filename.rsplit(".", 1)[0]
    name = re.sub(r"^\d+[\.\-]?\s*", "", name)
    return name.strip()


async def bulk_upload():
    if not ALBUMS_TO_SEED:
        print("Список альбомов пуст!")
        return

    async with async_session() as session:
        # --- СБРОС БАЗЫ ДАННЫХ (ОПЦИОНАЛЬНО) ---
        # ВНИМАНИЕ: Очистка базы отключена, чтобы не удалять уже загруженные альбомы!
        # Если захочешь сбросить базу с нуля, раскомментируй код ниже:

        # print("Очищаем базу данных и сбрасываем счетчики ID...")
        # await session.execute(text("TRUNCATE TABLE tracks RESTART IDENTITY CASCADE"))
        # await session.execute(text("TRUNCATE TABLE albums RESTART IDENTITY CASCADE"))
        # await session.commit()
        # print("База данных девственно чиста! ID снова начинаются с 1.\n")

        for index, album_info in enumerate(ALBUMS_TO_SEED):
            folder = Path(album_info["folder_path"])
            audio_files = []
            for ext in ("*.mp3", "*.m4a", "*.flac"):
                audio_files.extend(folder.glob(ext))
            audio_files = sorted(audio_files)
            
            if not audio_files:
                print(f"ПРОПУСК: В папке {album_info['folder_path']} не найдено аудио файлов (.mp3, .m4a, .flac).")
                continue

            print(f"=== Загрузка альбома {index + 1}/{len(ALBUMS_TO_SEED)}: {album_info['title']} ===")
            print(f"Найдено {len(audio_files)} треков.")

            # 1. Загрузка обложки в Supabase
            cover_public_url = None
            cover_path_str = album_info.get("cover_path")
            
            if cover_path_str:
                cover_path = Path(cover_path_str)
                if cover_path.exists():
                    print(f"Загружаем обложку {cover_path.name}...")
                    cover_bytes = cover_path.read_bytes()
                    mime_type = mimetypes.guess_type(cover_path)[0] or "image/jpeg"
                    cover_storage_path = f"covers/{uuid.uuid4()}_{cover_path.name}"
                    
                    supabase_client.storage.from_("covers").upload(
                        path=cover_storage_path,
                        file=cover_bytes,
                        file_options={"content-type": mime_type},
                    )
                    cover_public_url = supabase_client.storage.from_("covers").get_public_url(cover_storage_path)
                else:
                    print(f"Файл обложки не найден: {cover_path_str}")

            # 2. Создаём альбом в БД
            album_record = Album(
                title=album_info["title"],
                year=album_info["year"],
                cover_url=cover_public_url,
                type=album_info["type"],
                order_index=index,
            )
            session.add(album_record)
            await session.flush()
            print(f"Создана запись альбома: id={album_record.id}")

            # 3. Грузим треки по порядку
            for file_path in audio_files:
                title = clean_title(file_path.name)
                try:
                    file_bytes = file_path.read_bytes()
                except FileNotFoundError:
                    print(f"  [ОШИБКА] Файл не найден: {file_path}. Пропускаем...")
                    continue

                # Узнаем длину трека с помощью mutagen
                audio = mutagen.File(file_path)
                duration = int(audio.info.length) if audio and audio.info else 0

                file_ext = file_path.suffix
                unique_filename = f"{uuid.uuid4()}{file_ext}"
                storage_path = f"{album_record.id}/{unique_filename}"
                track_mime_type = mimetypes.guess_type(file_path)[0] or "audio/mpeg"

                print(f"  -> Трек: {title} ({duration} сек)...")
                supabase_client.storage.from_("tracks-audio").upload(
                    path=storage_path,
                    file=file_bytes,
                    file_options={"content-type": track_mime_type},
                )
                public_url = supabase_client.storage.from_("tracks-audio").get_public_url(storage_path)

                track = Track(
                    title=title,
                    album_id=album_record.id,
                    duration_sec=duration,
                    audio_url=public_url,
                    cover_url=cover_public_url,
                    tg_file_id=None,
                    tags=album_info.get("tags", []),
                )
                session.add(track)

            # Сохраняем альбом и его треки в БД перед переходом к следующему
            await session.commit()
            print(f"=== Альбом '{album_info['title']}' успешно сохранен в базу данных! ===\n")

        print("ГОТОВО! Все альбомы успешно загружены в базу данных.")

if __name__ == "__main__":
    asyncio.run(bulk_upload())