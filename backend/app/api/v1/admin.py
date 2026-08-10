import uuid
from sqlalchemy import func, select
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.user import User
from app.core.security import get_current_admin
from app.models.album import Album
from app.schemas.album import AlbumCreate, AlbumResponse
from app.core.storage import supabase_client
from app.models.track import Track

router = APIRouter()

# need test
@router.post("/albums", response_model=AlbumResponse)
async def upload_album(
    albums_data: AlbumCreate,
    db: AsyncSession = Depends(get_db), 
    current_admin: User = Depends(get_current_admin)
):
    album_dict = albums_data.model_dump()

    if album_dict["order_index"] is None:
        max_order_query = select(func.max(Album.order_index))
        max_order_result = await db.execute(max_order_query)
        current_max = max_order_result.scalar()
        album_dict["order_index"] = 0 if current_max is None else current_max + 1

    new_album = Album(**album_dict)
    db.add(new_album)
    await db.commit()
    await db.refresh(new_album)

    return new_album

# need test
@router.post("/upload/tracks")
async def upload_track(
    file: UploadFile = File(...), 
    album_id: int = Form(...), 
    title: str = Form(...),
    duration_sec: int = Form(...),
    tags: str = Form(""),
    db: AsyncSession = Depends(get_db), 
    current_admin: User = Depends(get_current_admin)
):
    album_query = select(Album).where(Album.id == album_id)
    album_result = await db.execute(album_query)
    album = album_result.scalar_one_or_none()

    if not album:
        raise HTTPException(status_code=404, detail="Album not found")

    file_bytes = await file.read()
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = f"{album_id}/{unique_filename}"

    supabase_client.storage.from_("tracks-audio").upload(
        path=file_path,
        file=file_bytes,
        file_options={"content-type": "audio/mpeg"}
    )

    public_url = supabase_client.storage.from_("tracks-audio").get_public_url(file_path)
    tags_list = [tag.strip() for tag in tags.split(",")] if tags else []

    new_track = Track(title = title, album_id = album_id, duration_sec = duration_sec, audio_url = public_url, tags = tags_list)
    db.add(new_track)
    await db.commit()
    await db.refresh(new_track)

    return new_track