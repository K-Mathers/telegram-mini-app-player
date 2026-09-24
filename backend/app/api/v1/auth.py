from typing import Annotated
from urllib.parse import parse_qsl
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.core.telegram import validate_init_data
from app.core.config import settings
from app.core.database import get_db
import json
from app.models.user import User
from app.core.security import create_access_token
import warnings

if settings.DEBUG:
    warnings.warn(
        "\n" + "=" * 60 +
        "\n⚠️  DEBUG=True: Telegram auth validation is BYPASSED." +
        "\n   Any request will receive a token for dev_test_user." +
        "\n   DO NOT deploy to production with DEBUG=True!" +
        "\n" + "=" * 60,
        stacklevel=1
    )

router = APIRouter()

class AuthRequest(BaseModel):
    initData: str

@router.post("/verify")
async def verify_telegram_auth(request: AuthRequest, db: Annotated[AsyncSession, Depends(get_db)]):
    try:
        if settings.DEBUG:
            tg_id = 999999999
            tg_username = "dev_test_user"
            tg_first_name = "Dev"
        else:
            validate_init_data(request.initData, settings.BOT_TOKEN)

            parsed_data= dict(parse_qsl(request.initData))

            user_str = parsed_data.get("user")
            if not user_str: 
                raise ValueError("User data is missing")
            user_data = json.loads(user_str)

            tg_id = user_data.get("id")
            tg_username = user_data.get("username")
            tg_first_name = user_data.get("first_name", "")

        query = select(User).where(User.telegram_id == tg_id)
        result = await db.execute(query)

        user = result.scalar_one_or_none()
        if not user:
            user = User(telegram_id = tg_id, username = tg_username, first_name = tg_first_name)
            db.add(user)
        else: 
            user.username = tg_username
            user.first_name = tg_first_name
        
        await db.commit()
        await db.refresh(user)

        token_data = {"sub": str(user.id)}
        access_token = create_access_token(token_data)

        return {"access_token": access_token, "token_type": "bearer"}
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))