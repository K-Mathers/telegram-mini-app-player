from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.track import TrackResponse
from app.core.database import get_db
from app.models.track import Track

router = APIRouter()

@router.get("", response_model=list[TrackResponse])
async def get_all_tracks(db: Annotated[AsyncSession, Depends(get_db)]):
        query = select(Track)
        result = await db.execute(query)
        return result.scalars().all()

@router.get("/search/", response_model=list[TrackResponse])
async def get_tracks(q: str, db: Annotated[AsyncSession, Depends(get_db)]):
        # write search with tags 
        query = select(Track).where(Track.title.ilike(f"%{q}%"))
        query_result = await db.execute(query)
        return query_result.scalars().all()