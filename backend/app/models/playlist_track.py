from datetime import datetime
from sqlalchemy import ForeignKey, func
from app.core.database import Base
from sqlalchemy.orm import Mapped, mapped_column 

class PlaylistTrack(Base):
      __tablename__ = "playlist_tracks"
      id: Mapped[int] = mapped_column(primary_key=True)
      user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
      track_id: Mapped[int] = mapped_column(ForeignKey("tracks.id"))
      position: Mapped[int]
      added_at: Mapped[datetime] = mapped_column(server_default=func.now())
