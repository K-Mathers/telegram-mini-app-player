from sqlalchemy import func, select
from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.playlists import PlaylistReorderRequest, PlaylistsCreate, PlaylistsResponse
from app.core.database import get_db
from app.models.playlist_track import PlaylistTrack
from app.core.security import get_current_user
from app.models.user import User
from app.models.track import Track

router = APIRouter()

@router.get("", response_model=list[PlaylistsResponse])
async def get_favourite_tracks(db: Annotated[AsyncSession, Depends(get_db)], current_user: User = Depends(get_current_user)):
    query = select(PlaylistTrack).where(PlaylistTrack.user_id == current_user.id)
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/add-track", response_model=PlaylistsResponse)
async def add_track_to_playlist(db: Annotated[AsyncSession, Depends(get_db)], body: PlaylistsCreate, current_user: User = Depends(get_current_user)):
    track_query = select(Track).where(Track.id == body.track_id)
    track_result = await db.execute(track_query)
    track = track_result.scalar_one_or_none()

    if track is None:
        raise HTTPException(status_code=404, detail="Track not found")

    existing_query = select(PlaylistTrack).where(PlaylistTrack.user_id == current_user.id, PlaylistTrack.track_id == body.track_id)
    existing_result  = await db.execute(existing_query)
    existing_entry = existing_result.scalar_one_or_none()

    if existing_entry:
        raise HTTPException(status_code=409, detail="Track already added")

    max_position_query = select(func.max(PlaylistTrack.position)).where(PlaylistTrack.user_id == current_user.id)
    max_position_result = await db.execute(max_position_query)
    current_max_position = max_position_result .scalar()
    new_position = 1 if current_max_position is None else current_max_position + 1  

    new_entry = PlaylistTrack(user_id = current_user.id, track_id = body.track_id, position=new_position)
    db.add(new_entry)
    await db.commit()
    await db.refresh(new_entry)

    return new_entry

@router.delete("/{id}/remove-track", status_code=204)
async def remove_track(id: int, db: Annotated[AsyncSession, Depends(get_db)], current_user: User = Depends(get_current_user)):
    track_query = select(PlaylistTrack).where(PlaylistTrack.track_id == id, PlaylistTrack.user_id == current_user.id)
    track_result = await db.execute(track_query)
    track = track_result.scalar_one_or_none()

    if track is None:
        raise HTTPException(status_code=404, detail="Track not found")

    await db.delete(track)
    await db.commit()

@router.put("/reorder", response_model=list[PlaylistsResponse])
async def reoder_tracks(body: PlaylistReorderRequest, db: Annotated[AsyncSession, Depends(get_db)], current_user: User = Depends(get_current_user)):
    reorder_query = select(PlaylistTrack).where(PlaylistTrack.user_id == current_user.id, PlaylistTrack.track_id.in_(body.track_ids))
    reorder_result = await db.execute(reorder_query)
    reorder = reorder_result.scalars().all()

    if len(reorder) != len(body.track_ids):
        raise HTTPException(status_code=400, detail="Data is invalid")

    reorder_dict = {item.track_id: item for item in reorder}
    for index, track_id in enumerate(body.track_ids):
        playlist_track = reorder_dict[track_id]
        playlist_track.position = index + 1

    await db.commit()
    return list(reorder_dict.values())