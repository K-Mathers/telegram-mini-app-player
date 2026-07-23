from typing import List
from pydantic import BaseModel, ConfigDict


class TrackBase(BaseModel):
    title: str
    album_id: int
    duration_sec: int
    audio_url: str | None
    cover_url: str | None
    tags: List[str]

class TrackCreate(TrackBase):
    tg_file_id: str

class TrackResponse(TrackBase):
    id: int
    model_config = ConfigDict(from_attributes=True)