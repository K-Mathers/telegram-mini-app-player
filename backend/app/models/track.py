from typing import Optional
from sqlalchemy import ForeignKey
from app.core.database import Base
from sqlalchemy.orm import Mapped, mapped_column 


class Track(Base):
    __tablename__ = "tracks"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    album_id: Mapped[int] = mapped_column(ForeignKey("albums.id"))
    duration_sec: Mapped[int]
    audio_url: Mapped[Optional[str]]
    cover_url: Mapped[Optional[str]]
    tg_file_id: Mapped[str] = mapped_column(unique=True)
    tags: Mapped[str]