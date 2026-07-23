from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.models.album import AlbumType

class AlbumBase(BaseModel):
    title: str
    year: int
    cover_url: str | None
    type: AlbumType

class AlbumCreate(AlbumBase):
    order_index: Optional[int] = None

class AlbumResponse(AlbumBase):
    id: int
    order_index: int
    model_config = ConfigDict(from_attributes=True)