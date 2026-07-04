from enum import Enum
from typing import Optional
from app.core.database import Base
from sqlalchemy.orm import Mapped, mapped_column 
from sqlalchemy import Enum as SQLEnum

class AlbumType(str, Enum):
    OFFICIAL = "official"
    UNOFFICIAL = "unofficial"

class Album(Base):
    __tablename__ = "albums"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] 
    year: Mapped[int] 
    cover_url: Mapped[Optional[str]]
    type: Mapped[AlbumType] = mapped_column(SQLEnum(AlbumType), default=AlbumType.OFFICIAL)
    order_index: Mapped[int] = mapped_column(default=0)