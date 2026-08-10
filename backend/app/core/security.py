from datetime import datetime, timedelta
from sqlalchemy import select
from typing import Annotated
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.core.config import settings
from jose import JWSError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.user import User
from jose import JWTError

ALGORITHM = "HS256"
security_scheme = HTTPBearer()

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security_scheme)], 
    db: Annotated[AsyncSession, Depends(get_db)]) -> User:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])

        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    
        query = select(User).where(User.id == int(user_id))
        result = await db.execute(query)
        user = result.scalar_one_or_none()

        if user is None:
            raise HTTPException(status_code=401, detail="User undefined")
        return user
    except JWTError:
         raise HTTPException(status_code=401, detail="Could not validate credentials")

async def get_current_admin(
    current_user: Annotated[User, Depends(get_current_user)]):

    if not current_user.is_admin:
        raise HTTPException(403, detail="User is not admin")
    return current_user