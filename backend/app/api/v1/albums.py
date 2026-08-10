import re
from typing import Annotated
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.album import AlbumResponse
from app.core.database import get_db
from app.models.album import Album
from app.schemas.track import TrackResponse
from app.models.track import Track


router = APIRouter()

@router.get("", response_model=list[AlbumResponse])
async def get_all_albums(db: Annotated[AsyncSession, Depends(get_db)]):
        query = select(Album)
        result = await db.execute(query)
        return result.scalars().all()

@router.get("/{id}/tracks", response_model=list[TrackResponse])
async def get_albums_tracks(id: int, db: Annotated[AsyncSession, Depends(get_db)]):
        album_query = select(Album).where(Album.id == id)
        album_result = await db.execute(album_query)
        album = album_result.scalar_one_or_none()

        if album is None:
                raise HTTPException(status_code=404, detail="Album not found")
        
        tracks_query = select(Track).where(Track.album_id == id).order_by(Track.id)
        tracks_result = await db.execute(tracks_query)
        return tracks_result.scalars().all()