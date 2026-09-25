# Скрипт для генерации тестового jwt-токена для локальной разработки
# Если будете тестировать API, то он обязательно нужен, ведь Mini App просит передачу Telegram initData
# Этот скрипт берёт пользователя из базы данных и генерирует валидный bearer-токен
# Все логируется
import asyncio
from sqlalchemy import select
from app.core.database import async_session
from app.core.security import create_access_token
from app.models.user import User


async def get_test_token(telegram_id: int | None = None):
    async with async_session() as session:
        # Если передан telegram_id значит ищем конкретного, иначе берём первого доступного
        if telegram_id is not None:
            query = select(User).where(User.telegram_id == telegram_id)
        else:
            query = select(User).limit(1)

        result = await session.execute(query)
        user = result.scalar_one_or_none()

        if user is None:
            print("Пользователь не найден. Сначала создай его через seed.py или /auth/verify.")
            return

        print(f"Найден пользователь: id={user.id}, username={user.username}, is_admin={user.is_admin}")
        # Создаём jwt с user.id + принт в консоль для работы 
        token = create_access_token({"sub": str(user.id)})
        print(f"\nТокен:\n{token}")


if __name__ == "__main__":
    asyncio.run(get_test_token())