from datetime import datetime
from sqlalchemy import BigInteger, func
from app.core.database import Base
from sqlalchemy.orm import Mapped, mapped_column 

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    telegram_id: Mapped[int] = mapped_column(BigInteger, unique=True, index=True)
    username: Mapped[str | None]
    first_name: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    is_admin: Mapped[bool] = mapped_column(default=False, server_default="false")