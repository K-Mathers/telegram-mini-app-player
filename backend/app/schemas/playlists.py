from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Mapped

class PlaylistsBase(BaseModel):
    track_id: int

class PlaylistReorderRequest(BaseModel):
    track_ids: list[int]

class PlaylistsCreate(PlaylistsBase):
    position: Optional[int] = None
    added_at: Optional[datetime] = None
  
class PlaylistsResponse(PlaylistsBase):
    position: int
    added_at: datetime
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)