# Telegram Mini App Player — Backend Documentation

> **Асинхронный REST API-бэкенд и Telegram-бот для музыкального стримингового сервиса (Eminem Player)**.  
> Стек: **Python 3.11+**, **FastAPI**, **SQLAlchemy 2.0 (Asyncio)**, **PostgreSQL (asyncpg)**, **Alembic**, **Aiogram 3**, **Supabase Storage (S3)**, **PyJWT / python-jose**.  
> Архитектура: **Слоистая модульная архитектура**.

---

## 📌 Навигация по документу

- [1. Назначение проекта](#-1-назначение-проекта)
- [2. Архитектурное решение](#-2-архитектурное-решение)
- [3. Архитектура и структура каталогов](#-3-архитектура-и-структура-каталогов)
- [4. Разбор каждого модуля и файла](#-4-разбор-каждого-модуля-и-файла)
- [5. Технологический стек](#-5-технологический-стек)
- [6. Модели данных и схема БД](#-6-модели-данных-и-схема-бд)
- [7. Спецификация REST API](#-7-спецификация-rest-api)
- [8. Модуль Telegram-бота](#-8-модуль-telegram-бота)
- [9. Инструкция по запуску и развертыванию](#-9-инструкция-по-запуску-и-развертыванию)

---

## 🎯 1. Назначение проекта

Бэкенд-сервис **Eminem Player** выступает серверным ядром для экосистемы стриминга дискографии артиста, обеспечивая взаимодействие двух клиентских интерфейсов: **Telegram Mini App (TMA)** и полнофункционального **Telegram-бота**.

### Ключевые возможности системы:
- 🔐 **Бесшовная криптографическая аутентификация**: верификация подлинности сессий Telegram WebApp (`initData`) по алгоритму HMAC-SHA256 и выпуск персонализированных Bearer JWT-токенов.
- 🎵 **Каталог музыки и медиатека**: организация альбомов (официальные релизы и эксклюзивные микстейпы), треков с хронометражем, тегами и метаданными.
- ⭐ **Пользовательские плейлисты и Избранное**: атомарное управление понравившимися треками с сохранением кастомного порядка воспроизведения (Drag-and-Drop реордеринг).
- ☁️ **Облачное хранилище медиа**: стриминг аудиофайлов и быстрая раздача обложек через бакеты Supabase Storage.
- 🤖 **Интерактивный Telegram-бот**: быстрый запуск Mini App, встроенный поиск по названию треков и отправка аудиофайлов напрямую в диалог Telegram.
- 🛡 **Административная панель**: загрузка новых альбомов и треков с проверкой прав доступа (`is_admin`).
- ⚡ **Автоматизированное сидирование**: сканирование локальных директорий, чтение ID3-тегов и хронометража треков через `mutagen`, пакетная загрузка в хранилище и наполнение БД.

---

## 🏛 2. Архитектурное решение

В проекте реализована **асинхронная слоистая архитектура** с жестким разграничением ответственности между слоями: сетевым транспортом (FastAPI / Aiogram), бизнес-логикой, безопасностью и уровнем доступа к данным (ORM / S3).

```mermaid
graph TD
    ClientTMA["Telegram Mini App (Frontend)"] -->|HTTPS / REST API + JWT| FastAPI["FastAPI Gateway (main_api.py)"]
    ClientBot["Telegram User (Chat)"] -->|Telegram Bot API| Bot["Aiogram Bot Engine (bot/main_bot.py)"]

    subgraph "API & Routing Layer"
        FastAPI --> AuthRouter["Auth Router (/api/v1/auth)"]
        FastAPI --> AlbumsRouter["Albums Router (/api/v1/albums)"]
        FastAPI --> TracksRouter["Tracks Router (/api/v1/tracks)"]
        FastAPI --> PlaylistsRouter["Playlists Router (/api/v1/playlists)"]
        FastAPI --> AdminRouter["Admin Router (/api/v1/admin)"]
    end

    subgraph "Core & Security Layer"
        AuthRouter --> TGSecurity["Telegram HMAC Validator (app/core/telegram.py)"]
        PlaylistsRouter --> JWTSecurity["JWT Auth & Role Guard (app/core/security.py)"]
        AdminRouter --> AdminGuard["Admin RBAC Guard (is_admin=True)"]
    end

    subgraph "Data & Persistence Layer"
        AuthRouter --> DBEngine["Async SQLAlchemy Engine (app/core/database.py)"]
        AlbumsRouter --> DBEngine
        TracksRouter --> DBEngine
        PlaylistsRouter --> DBEngine
        AdminRouter --> DBEngine
        Bot --> DBEngine
        
        AdminRouter --> SupabaseClient["Supabase Storage Client (app/core/storage.py)"]
        SeedScript["Seed Script (app/seed.py)"] --> SupabaseClient
        SeedScript --> DBEngine
    end

    subgraph "External Storage & Infrastructure"
        DBEngine --> PostgreSQL[("PostgreSQL Database (asyncpg)")]
        SupabaseClient --> S3Buckets[("Supabase Storage (covers / tracks-audio)")]
    end

    style FastAPI fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff
    style Bot fill:#1f2937,stroke:#10b981,stroke-width:2px,color:#fff
    style PostgreSQL fill:#1e3a8a,stroke:#60a5fa,stroke-width:2px,color:#fff
    style S3Buckets fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#fff
    style TGSecurity fill:#374151,stroke:#f59e0b,stroke-width:2px,color:#fff
    style JWTSecurity fill:#374151,stroke:#f59e0b,stroke-width:2px,color:#fff
```

### Архитектурные паттерны и принципы:
1. **Dependency Injection (FastAPI Depends)**:
   - Сессии базы данных инжектируются через зависимость `get_db()`, гарантирующую открытие и закрытие транзакционной асинхронной сессии на каждый HTTP-запрос.
   - Аутентификация пользователя и проверка прав администратора инкапсулированы в `get_current_user` и `get_current_admin`.
2. **HMAC-SHA256 Zero-Trust Auth**:
   - Верификация данных пользователя осуществляется без передачи паролей. Сервер проверяет криптографическую подпись строки `initData`, сгенерированную Telegram с использованием секретного ключа бота.
3. **Optimistic & Explicit Ordering**:
   - Порядок воспроизведения треков в избранном управляется целочисленным полем `position`. Метод пакетного реордеринга (`PUT /reorder`) обновляет порядок в рамках единой транзакции БД.
4. **Decoupled Bot & API Services**:
   - Telegram-бот и HTTP API делят между собой модели SQLAlchemy и конфигурацию ядра, но могут запускаться и масштабироваться как независимые процессы.

---

## 📁 3. Архитектура и структура каталогов

Ниже представлено дерево структуры бэкенд-репозитория с кратким описанием функционального назначения каждого файла и директории:

```
backend/
├── app/                                  # Основной пакет бэкенд-приложения
│   ├── api/                              # Сетевой транспорт и обработчики эндпоинтов
│   │   └── v1/                           # Первая версия REST API
│   │       ├── admin.py                  # Административные эндпоинты: создание альбомов и загрузка файлов
│   │       ├── albums.py                 # Публичный каталог: список альбомов и треки выбранного релиза
│   │       ├── auth.py                   # Авторизация Telegram WebApp initData и выдача JWT-токена
│   │       ├── playlists.py              # Избранное пользователя: чтение, добавление, удаление, реордеринг
│   │       └── tracks.py                 # Каталог треков и полнотекстовый поиск по композициям
│   ├── core/                             # Низкоуровневые системные сервисы и конфигурация
│   │   ├── config.py                     # Валидация и загрузка переменных окружения через Pydantic Settings
│   │   ├── database.py                   # Инициализация асинхронного движка SQLAlchemy и фабрика сессий
│   │   ├── security.py                   # Генерация JWT, валидация Bearer-токена и проверка прав администратора
│   │   ├── storage.py                    # Инициализация официального клиента облачного хранилища Supabase
│   │   └── telegram.py                   # Криптографическая проверка HMAC-SHA256 сигнатуры Telegram initData
│   ├── models/                           # Декларативные ORM-модели базы данных (SQLAlchemy 2.0)
│   │   ├── __init__.py                   # Экспорт всех моделей для корректной автогенерации миграций Alembic
│   │   ├── album.py                      # Модель альбома (официальный/неофициальный, обложка, порядок)
│   │   ├── playlist_track.py             # Модель элемента избранного плейлиста (связь User-Track, позиция)
│   │   ├── track.py                      # Модель аудиокомпозиции (хронометраж, ссылки на S3, теги)
│   │   └── user.py                       # Модель пользователя (Telegram ID, имя, юзернейм, права админа)
│   ├── schemas/                          # Pydantic-схемы валидации входящих данных и сериализации ответов
│   │   ├── album.py                      # Схемы для создания и чтения альбомов
│   │   ├── playlists.py                  # Схемы добавления трека в избранное и запроса на реордеринг
│   │   └── track.py                      # Схемы метаданных композиций и выдачи в API
│   ├── get_test_token.py                 # CLI-скрипт генерации тестового JWT-токена для локальной разработки
│   └── seed.py                           # CLI-утилита сканирования медиатеки, считывания тегов и сидирования БД
├── bot/                                  # Модуль Telegram-бота на базе Aiogram 3
│   ├── handlers/                         # Маршрутизаторы и обработчики команд пользователя
│   │   ├── help_command.py               # Обработчик справочной команды /help
│   │   ├── search_command.py             # Поиск треков по названию /search и отправка аудиофайла в чат
│   │   └── start_command.py              # Команда /start с инлайн-кнопкой открытия Telegram Mini App
│   └── main_bot.py                       # Точка входа для запуска long-polling процесса Telegram-бота
├── migration/                            # Скрипты и конфигурация миграций схемы базы данных Alembic
│   ├── versions/                         # Хронологические ревизии миграций БД
│   │   ├── 75033854ca97_init_tables.py   # Начальная ревизия: создание таблиц users, albums, tracks, playlists
│   │   ├── 1c07a37e775f_rewrite_track.py # Миграция преобразования тегов в формат JSON
│   │   ├── f91fba6d0820_add_is_admin_to_users.py # Добавление флага администратора is_admin в таблицу users
│   │   └── bdd9b3a2bcf2_optional_tg_file_id.py   # Перевод поля tg_file_id в разряд опциональных
│   ├── env.py                            # Конфигурация асинхронного окружения выполнения миграций Alembic
│   ├── README                            # Базовое описание инфраструктуры миграций
│   └── script.py.mako                    # Шаблон автоматической генерации новых ревизий Alembic
├── .env.example                          # Шаблон конфигурации переменных окружения проекта
├── alembic.ini                           # Конфигурационный файл CLI Alembic
├── Dockerfile                            # Инструкция сборки легковесного контейнера и запуска сервиса
├── main_api.py                           # Главная точка входа FastAPI приложения: CORS, роутеры, хэндлеры ошибок
└── requirements.txt                      # Зафиксированные Python-зависимости бэкенда
```

---

## 🔍 4. Разбор каждого модуля и файла

### 🌐 Точка входа и глобальные настройки

#### [main_api.py](./main_api.py)
- **Назначение**: Точка входа приложения FastAPI.
- **Ключевые функции**:
  - Инициализация экземпляра `FastAPI(title="Eminem Player API")`.
  - Регистрация глобальных обработчиков исключений: `http_exception_handler` и `global_exception_handler` (возврат структурированного JSON `{ "detail": ... }`).
  - Подключение middleware `CORSMiddleware` со списком разрешенных источников из `settings.CORS_ORIGINS`.
  - Монтирование всех маршрутизаторов API v1 (`auth`, `tracks`, `admin`, `albums`, `playlists`).
- **Зависимости**: [admin.py](./app/api/v1/admin.py), [albums.py](./app/api/v1/albums.py), [auth.py](./app/api/v1/auth.py), [playlists.py](./app/api/v1/playlists.py), [tracks.py](./app/api/v1/tracks.py), [config.py](./app/core/config.py).

#### [Dockerfile](./Dockerfile)
- **Назначение**: Docker-образ на базе `python:3.11-slim` для сборки и развертывания API.
- **Команда запуска**: Выполняет автоматический накат миграций `alembic upgrade head` и стартует production-сервер Uvicorn на порту `8000`.

---

### ⚙️ Слой ядра и инфраструктуры (App Core)

#### [app/core/config.py](./app/core/config.py)
- **Назначение**: Централизованная типизированная конфигурация проекта на базе `pydantic-settings`.
- **Класс**: `Setting` (наследует `BaseSettings`), автоматически считывает значения из `.env`.
- **Параметры**:
  - `DATABASE_URL`: Строка подключения к PostgreSQL (с драйвером `postgresql+asyncpg://`).
  - `BOT_TOKEN`: Токен Telegram-бота для валидации сигнатур и работы Aiogram.
  - `SECRET_KEY` & `ACCESS_TOKEN_EXPIRE_DAYS`: Параметры подписи и срока жизни JWT.
  - `SUPABASE_URL` & `SUPABASE_SERVICE_KEY`: Доступ к облачному API Supabase Storage.
  - `CORS_ORIGINS`: Список разрешенных URL для CORS (через запятую).
  - `DEBUG`: Режим отладки. При `DEBUG=True` эмулируется авторизация тестового пользователя в обход Telegram-валидации.
  - `WEBAPP_URL`: Публичный URL клиентского Mini App, передаваемый боту.

#### [app/core/database.py](./app/core/database.py)
- **Назначение**: Настройка асинхронного пула соединений SQLAlchemy к базе данных.
- **Ключевые элементы**:
  - `engine`: Асинхронный движок `create_async_engine(settings.DATABASE_URL)`.
  - `async_session`: Фабрика сессий `async_sessionmaker(engine, expire_on_commit=False)`.
  - `Base`: Базовый декларативный класс `DeclarativeBase` для всех ORM-моделей.
  - `get_db()`: Асинхронный генератор зависимости FastAPI, выдающий экземпляр `AsyncSession` в контексте каждого запроса.

#### [app/core/security.py](./app/core/security.py)
- **Назначение**: Модуль безопасности, авторизации по JWT и контроля ролевого доступа (RBAC).
- **Ключевые элементы**:
  - `create_access_token(data: dict)`: Выпуск подписанного HS256 JWT-токена со сроком экспирации.
  - `get_current_user`: FastAPI dependency. Извлекает Bearer-токен из заголовка `Authorization`, декодирует payload через `jose.jwt`, валидирует пользователя в БД и возвращает ORM-сущность `User`.
  - `get_current_admin`: Guard-зависимость. Проверяет флаг `current_user.is_admin == True`, выбрасывая `HTTPException(403)` в случае отсутствия прав.

#### [app/core/telegram.py](./app/core/telegram.py)
- **Назначение**: Криптографическая валидация данных Telegram WebApp согласно [официальному протоколу Telegram](https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app).
- **Функция**: `validate_init_data(init_data: str, bot_token: str) -> bool`:
  1. Извлекает переданный `hash` из строки параметров.
  2. Формирует строку проверки `data_check_str` из остальных ключей в алфавитном порядке.
  3. Генерирует секретный ключ через HMAC-SHA256 (`key=b"WebAppData"`, `msg=bot_token`).
  4. Сравнивает вычисленный дайджест с переданным хэшем с защитой от атак по времени через `hmac.compare_digest`.

#### [app/core/storage.py](./app/core/storage.py)
- **Назначение**: Инициализация singleton-клиента `supabase.Client` для загрузки и генерации публичных ссылок на треки и обложки.

---

### 🗄 Слой моделей данных (App Models)

#### [app/models/user.py](./app/models/user.py)
- **Таблица**: `users`
- **Поля**:
  - `id`: Первичный ключ (int, autoincrement).
  - `telegram_id`: Идентификатор пользователя в Telegram (`BigInteger`, уникальный индекс).
  - `username`: Никнейм пользователя (`str | None`).
  - `first_name`: Имя пользователя (`str`).
  - `created_at`: Таймштамп регистрации (`server_default=now()`).
  - `is_admin`: Булевый флаг администратора (`server_default="false"`).

#### [app/models/album.py](./app/models/album.py)
- **Таблица**: `albums`
- **Enum `AlbumType`**: `OFFICIAL` ("official") и `UNOFFICIAL` ("unofficial").
- **Поля**:
  - `id`: Первичный ключ.
  - `title`: Название альбома.
  - `year`: Год выпуска релиза.
  - `cover_url`: Ссылка на обложку в Supabase Storage.
  - `type`: Тип релиза (`SQLEnum(AlbumType)`).
  - `order_index`: Порядковый номер для сортировки альбомов в каталоге.

#### [app/models/track.py](./app/models/track.py)
- **Таблица**: `tracks`
- **Поля**:
  - `id`: Первичный ключ.
  - `title`: Название композиции.
  - `album_id`: Внешний ключ на `albums.id`.
  - `duration_sec`: Хронометраж аудио в секундах.
  - `audio_url`: Прямой публичный URL стриминга MP3 из бакета.
  - `cover_url`: URL обложки (наследуется от альбома или индивидуальная).
  - `tg_file_id`: Опциональный идентификатор аудиофайла внутри экосистемы Telegram (для мгновенной отправки ботом).
  - `tags`: Список строковых тегов жанров и категорий (хранится как `JSON`).

#### [app/models/playlist_track.py](./app/models/playlist_track.py)
- **Таблица**: `playlist_tracks`
- **Поля**:
  - `id`: Первичный ключ.
  - `user_id`: Внешний ключ на `users.id`.
  - `track_id`: Внешний ключ на `tracks.id`.
  - `position`: Целочисленный порядковый номер трека в избранном (для dnd-сортировки).
  - `added_at`: Дата и время добавления в плейлист.

---

### 📦 Слой валидации и схем (App Schemas)

- **[app/schemas/album.py](./app/schemas/album.py)**: Схемы `AlbumBase`, `AlbumCreate`, `AlbumResponse` с включенным флагом `from_attributes=True` для сериализации моделей SQLAlchemy.
- **[app/schemas/track.py](./app/schemas/track.py)**: Схемы `TrackBase`, `TrackCreate`, `TrackResponse` с валидацией списка тегов и длительности.
- **[app/schemas/playlists.py](./app/schemas/playlists.py)**: Схемы управления избранным:
  - `PlaylistsCreate`: Принимает `track_id`.
  - `PlaylistReorderRequest`: Принимает упорядоченный список `track_ids: list[int]`.
  - `PlaylistsResponse`: Полный ответ элемента избранного с полями `position` и `added_at`.

---

### 🔌 Слой контроллеров и эндпоинтов (API v1)

#### [app/api/v1/auth.py](./app/api/v1/auth.py)
- **Эндпоинт**: `POST /api/v1/auth/verify`
- **Логика**:
  1. Принимает JSON `{ "initData": "<строка_из_TMA>" }`.
  2. Если `DEBUG=False`: запускает криптографическую валидацию через `validate_init_data`, парсит данные пользователя. Если `DEBUG=True`: логирует предупреждение и эмулирует авторизацию под аккаунтом `dev_test_user`.
  3. Выполняет `UPSERT`-подобную логику: находит пользователя по `telegram_id` или создает новую запись.
  4. Генерирует и возвращает Bearer токен `{ "access_token": "...", "token_type": "bearer" }`.

#### [app/api/v1/albums.py](./app/api/v1/albums.py)
- **`GET /api/v1/albums`**: Возвращает полный перечень всех доступных альбомов артиста.
- **`GET /api/v1/albums/{id}/tracks`**: Возвращает упорядоченный по `id` список всех треков, привязанных к конкретному альбому (с возвратом `404 Not Found`, если альбом отсутствует).

#### [app/api/v1/tracks.py](./app/api/v1/tracks.py)
- **`GET /api/v1/tracks`**: Получение всех треков платформы для клиентской индексации и кеширования.
- **`GET /api/v1/tracks/search/?q=...`**: Поиск треков по подстроке в названии без учета регистра (`ilike %q%`).

#### [app/api/v1/playlists.py](./app/api/v1/playlists.py)
- **`GET /api/v1/playlists`**: Выборка всех треков из избранного текущего авторизованного пользователя (`current_user`).
- **`POST /api/v1/playlists/add-track`**: Добавление трека в избранное:
  - Проверяет существование трека (`404`).
  - Проверяет, не был ли трек уже добавлен (`409 Conflict`).
  - Вычисляет следующую свободную позицию: `max(position) + 1`.
- **`DELETE /api/v1/playlists/{id}/remove-track`**: Удаление композиции из плейлиста (`status_code=204`).
- **`PUT /api/v1/playlists/reorder`**: Пакетная синхронизация нового порядка треков:
  - Принимает список `track_ids` в новом порядке.
  - Проверяет принадлежность всех идентификаторов пользователю.
  - Назначает каждой записи позицию `position = index + 1` в рамках одной транзакции.

#### [app/api/v1/admin.py](./app/api/v1/admin.py)
- Защищен зависимостью `get_current_admin`.
- **`POST /api/v1/admin/albums`**: Создание новой записи альбома с автоматическим вычислением следующего `order_index`.
- **`POST /api/v1/admin/upload/tracks`**: Загрузка трека через multipart/form-data:
  - Читает бинарные данные MP3-файла из `UploadFile`.
  - Загружает файл в бакет Supabase `tracks-audio/{album_id}/{uuid}.mp3`.
  - Получает публичную ссылку и сохраняет запись `Track` в БД.

---

### 🛠 Утилиты разработчика и сидирование

#### [app/seed.py](./app/seed.py)
- **Назначение**: Пакетная автоматическая загрузка музыки в базу данных и хранилище.
- **Возможности**:
  - Читает конфигурацию `ALBUMS_TO_SEED` (локальные папки, файлы обложек, год, тип, теги).
  - Считывает файлы `.mp3`, `.m4a`, `.flac`.
  - Парсит чистое имя трека регулярным выражением `clean_title` (отсекает префиксы типа `01 - `).
  - Автоматически рассчитывает точный хронометраж каждого трека с помощью аудио-библиотеки `mutagen`.
  - Загружает обложки в бакет `covers` и аудиодорожки в бакет `tracks-audio` Supabase Storage.
  - Записывает сущности `Album` и связанные `Track` в PostgreSQL.

#### [app/get_test_token.py](./app/get_test_token.py)
- **Назначение**: CLI-скрипт для быстрого получения рабочего JWT-токена в Swagger UI (`/docs`) или Postman без необходимости открывать Telegram.
- **Работа**: Ищет указанного пользователя по `telegram_id` или берет первого доступного из базы и генерирует валидный Bearer токен с выводом в консоль.

---

### 🤖 Модуль Telegram-бота (Bot Layer)

#### [bot/main_bot.py](./bot/main_bot.py)
- Инициализирует инстанс `Bot(token=settings.BOT_TOKEN)` и `Dispatcher()`.
- Регистрирует роутеры команд: `start_router`, `handeler_search`, `handler_help`.
- Запускает long-polling опрос серверов Telegram через `dp.start_polling(bot)`.

#### [bot/handlers/start_command.py](./bot/handlers/start_command.py)
- Отвечает на команду `/start`.
- Отправляет инлайн-клавиатуру с кнопкой типа `WebAppInfo(url=settings.WEBAPP_URL)`, которая разворачивает Mini App прямо в мессенджере.

#### [bot/handlers/search_command.py](./bot/handlers/search_command.py)
- Команда `/search <запрос>`: ищет треки в БД через асинхронную сессию SQLAlchemy (`ilike`).
- Генерирует инлайн-кнопки с callback-данными `track_<id>`.
- При нажатии на кнопку пользователя перехватывает `callback_query`, считывает ссылку `track.audio_url` и моментально отправляет аудиофайл прямо в Telegram через метод `message.answer_audio(...)`.

#### [bot/handlers/help_command.py](./bot/handlers/help_command.py)
- Отвечает на команду `/help` кратким описанием доступных команд.

---

### 🔄 База данных и миграции (Migration Layer)

- **[alembic.ini](./alembic.ini)**: Конфигурация инструмента миграций.
- **[migration/env.py](./migration/env.py)**: Настроен на работу с асинхронным движком `run_async_migrations()` и импортирует `Base.metadata` из `app.models.*` для корректного автоопределения diff-изменений схемы.
- **[migration/versions/](./migration/versions/)**:
  - `75033854ca97_init_tables.py`: Создание базовых таблиц `users`, `albums`, `tracks`, `playlist_tracks`.
  - `1c07a37e775f_rewrite_track.py`: Перевод колонки `tags` в формат `JSON`.
  - `f91fba6d0820_add_is_admin_to_users.py`: Добавление поля `is_admin` в `users`.
  - `bdd9b3a2bcf2_optional_tg_file_id.py`: Установка `nullable=True` для поля `tg_file_id`.

---

## 💻 5. Технологический стек

| Категория | Технология | Назначение в проекте |
| :--- | :--- | :--- |
| **Язык** | **Python 3.11+** | Основной язык серверной части (современный синтаксис типизации `Mapped`, `Annotated`) |
| **Web Framework** | **FastAPI 0.138+** | Асинхронный высокопроизводительный фреймворк для построения REST API |
| **ASGI Сервер** | **Uvicorn 0.49+** | Сервер приложений ASGI для асинхронной обработки HTTP-соединений |
| **База данных** | **PostgreSQL** | Реляционная СУБД для надежного хранения данных пользователей и каталога |
| **Драйвер БД** | **asyncpg 0.31+** | Максимально быстрый асинхронный бинарный драйвер подключения к PostgreSQL |
| **ORM** | **SQLAlchemy 2.0+** | Современный декларативный асинхронный ORM (`select()`, `Mapped[]`, `mapped_column()`) |
| **Миграции БД** | **Alembic 1.18+** | Управление версионированием и эволюцией схемы базы данных |
| **Валидация данных** | **Pydantic v2 & Pydantic Settings** | Строгая типизация запросов/ответов и считывание конфигурации окружения |
| **Telegram Bot** | **Aiogram 3.29+** | Асинхронный фреймворк для взаимодействия с Telegram Bot API |
| **Безопасность / Auth** | **HMAC-SHA256 & python-jose** | Валидация подписи Telegram WebApp и выпуск/проверка Bearer JWT-токенов |
| **Облачное хранилище** | **Supabase Storage (S3)** | Хранение аудиофайлов и обложек альбомов с публичным CDN-доступом |
| **Аудио-анализ** | **Mutagen 1.48+** | Чтение тегов и расчет хронометража треков при начальном сидировании базы |
| **Контейнеризация** | **Docker** | Изолированное развертывание и стандартизированный запуск сервиса |

---

## 🗄 6. Модели данных и схема БД

Ниже представлена ER-диаграмма реляционных связей базы данных:

```mermaid
erDiagram
    USERS ||--o{ PLAYLIST_TRACKS : "has favorite tracks"
    ALBUMS ||--o{ TRACKS : "contains"
    TRACKS ||--o{ PLAYLIST_TRACKS : "referenced in"

    USERS {
        int id PK
        bigint telegram_id UK "Индекс, уникальный Telegram ID"
        string username "Никнейм пользователя"
        string first_name "Имя пользователя"
        datetime created_at "Дата регистрации"
        boolean is_admin "Флаг администратора"
    }

    ALBUMS {
        int id PK
        string title "Название релиза"
        int year "Год выпуска"
        string cover_url "Ссылка на обложку"
        enum type "OFFICIAL | UNOFFICIAL"
        int order_index "Индекс сортировки в каталоге"
    }

    TRACKS {
        int id PK
        int album_id FK "Ссылка на альбом"
        string title "Название трека"
        int duration_sec "Длина трека в секундах"
        string audio_url "Публичный URL MP3 в Supabase"
        string cover_url "Обложка трека"
        string tg_file_id "Опциональный file_id Telegram"
        json tags "JSON-массив текстовых тегов"
    }

    PLAYLIST_TRACKS {
        int id PK
        int user_id FK "Пользователь-владелец"
        int track_id FK "Добавленный трек"
        int position "Порядковый номер при Drag-and-Drop"
        datetime added_at "Время добавления"
    }
```

---

## 🔌 7. Спецификация REST API

Все маршруты API сгруппированы под префиксом `/api/v1`.

### 🔑 Авторизация (Auth)

| Метод | Путь | Описание | Защита | Тело запроса / Параметры | Ответ |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `POST` | `/api/v1/auth/verify` | Валидация Telegram WebApp `initData`, регистрация/логин и выдача JWT | 🌐 Публичный | `{ "initData": "..." }` | `200 OK`: `{ "access_token": "...", "token_type": "bearer" }`<br/>`401`: Невалидная подпись |

---

### 💿 Альбомы (Albums)

| Метод | Путь | Описание | Защита | Тело запроса / Параметры | Ответ |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `GET` | `/api/v1/albums` | Получить список всех альбомов | 🌐 Публичный | — | `200 OK`: `List[AlbumResponse]` |
| `GET` | `/api/v1/albums/{id}/tracks` | Получить треки конкретного альбома | 🌐 Публичный | `id`: ID альбома | `200 OK`: `List[TrackResponse]`<br/>`404`: Альбом не найден |

---

### 🎵 Треки (Tracks)

| Метод | Путь | Описание | Защита | Тело запроса / Параметры | Ответ |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `GET` | `/api/v1/tracks` | Получить полный каталог всех треков | 🌐 Публичный | — | `200 OK`: `List[TrackResponse]` |
| `GET` | `/api/v1/tracks/search/` | Поиск композиций по названию | 🌐 Публичный | Query `q`: поисковый запрос | `200 OK`: `List[TrackResponse]` |

---

### ⭐ Избранное и Плейлисты (Playlists)

| Метод | Путь | Описание | Защита | Тело запроса / Параметры | Ответ |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `GET` | `/api/v1/playlists` | Получить список избранных треков текущего пользователя | 🔒 Bearer JWT | — | `200 OK`: `List[PlaylistsResponse]` |
| `POST` | `/api/v1/playlists/add-track` | Добавить композицию в избранное | 🔒 Bearer JWT | `{ "track_id": int }` | `200 OK`: `PlaylistsResponse`<br/>`404`: Трек не найден<br/>`409`: Уже в избранном |
| `DELETE` | `/api/v1/playlists/{id}/remove-track` | Удалить композицию из избранного | 🔒 Bearer JWT | `id`: ID трека | `204 No Content`<br/>`404`: Запись не найдена |
| `PUT` | `/api/v1/playlists/reorder` | Синхронизировать кастомный порядок треков (Drag-and-Drop) | 🔒 Bearer JWT | `{ "track_ids": [1, 5, 2] }` | `200 OK`: `List[PlaylistsResponse]`<br/>`400`: Ошибка соответствия ID |

---

### 👑 Административная панель (Admin)

| Метод | Путь | Описание | Защита | Тело запроса / Параметры | Ответ |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `POST` | `/api/v1/admin/albums` | Создать альбом с расчетом `order_index` | 🔒 Admin | `AlbumCreate` JSON | `200 OK`: `AlbumResponse`<br/>`403`: Отказ в доступе |
| `POST` | `/api/v1/admin/upload/tracks` | Загрузить аудиофайл в S3 и создать трек | 🔒 Admin | Multipart Form: `file`, `album_id`, `title`, `duration_sec`, `tags` | `200 OK`: `TrackResponse`<br/>`403`: Отказ в доступе |

---

## 🤖 8. Модуль Telegram-бота

Telegram-бот построен на библиотеке **Aiogram 3** и служит входной точкой пользователей в экосистему:

```mermaid
sequenceDiagram
    autonumber
    actor User as Telegram User
    participant Bot as Aiogram Bot Engine
    participant DB as PostgreSQL
    participant S3 as Supabase Storage

    User->>Bot: Отправка команды /start
    Bot-->>User: Сообщение с инлайн-кнопкой "Открыть Mini App" (web_app)

    User->>Bot: Отправка команды /search Mockingbird
    Bot->>DB: Запрос SELECT Track WHERE title ILIKE '%Mockingbird%'
    DB-->>Bot: Список найденных композиций
    Bot-->>User: Сообщение со списком треков в виде инлайн-кнопок

    User->>Bot: Нажатие кнопки с композицией (callback_data: track_15)
    Bot->>DB: Запрос трека по ID
    DB-->>Bot: Данные трека (включая audio_url)
    Bot->>S3: Ссылка на аудиопоток
    Bot-->>User: Отправка аудиофайла сообщением (answer_audio)
```

---

## 🚀 9. Инструкция по запуску и развертыванию

### 📋 Предварительные требования
- **Python** версии `3.11` или выше
- Установленная СУБД **PostgreSQL** (или облачная БД, например, Supabase Postgres)
- Проект в **Supabase** с публичными бакетами `covers` и `tracks-audio`
- Токен Telegram-бота, полученный через [@BotFather](https://t.me/BotFather)

---

### ⚙️ 1. Клонирование и настройка окружения

1. Перейдите в каталог бэкенда:
   ```bash
   cd backend
   ```

2. Создайте и активируйте виртуальное окружение Python:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Установите зависимости проекта:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

---

### 📄 2. Конфигурация переменных окружения (.env)

Создайте файл `.env` в корне каталога `backend/` на основе `.env.example`:

```env
# Строка подключения к PostgreSQL (асинхронный драйвер asyncpg)
DATABASE_URL=postgresql+asyncpg://postgres:your_password@localhost:5432/eminem_player

# Токен бота Telegram
BOT_TOKEN=your_bot_token_here

# Секретный ключ для подписи JWT и срок жизни в днях
SECRET_KEY=super_secret_random_jwt_key_here
ACCESS_TOKEN_EXPIRE_DAYS=30

# Доступ к Supabase Storage
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_secret_key

# Разрешенные источники для CORS (через запятую)
CORS_ORIGINS=https://web.telegram.org,http://localhost:5173,http://localhost:3000

# Режим отладки (true для локальной разработки без реального Telegram, false в проде)
DEBUG=true

# Публичный URL клиентского приложения для кнопки WebApp в боте
WEBAPP_URL=https://your-tma-domain.com
```

> [!WARNING]
> В production-окружении обязательно установите параметр `DEBUG=false`! При `DEBUG=true` валидация подписи Telegram отключается, а любой запрос авторизуется под тестовым пользователем `dev_test_user`.

---

### 🔄 3. Накатывание миграций базы данных

Примените все ревизии миграций Alembic до актуального состояния:
```bash
alembic upgrade head
```

---

### 🧪 4. (Опционально) Генерация бд и тестового токена

1. **Пакетная загрузка альбомов и треков**:
   - Откройте файл `app/seed.py` и скорректируйте массив `ALBUMS_TO_SEED`, указав пути к папкам с вашей музыкой.
   - Запустите скрипт:
     ```bash
     python -m app.seed
     ```
   Скрипт автоматически рассчитает хронометраж каждого трека, загрузит обложки и MP3 в бакеты Supabase и наполнит таблицы БД.

2. **Получение тестового JWT-токена**:
   - Чтобы тестировать защищенные эндпоинты через интерактивную документацию Swagger UI без клиента Telegram:
     ```bash
     python -m app.get_test_token
     ```
   - Скопируйте полученный токен и вставьте в поле `Authorize` (формат: `Bearer <token>`) в Swagger UI.

---

### 💻 5. Запуск сервисов

#### Запуск API-сервера (FastAPI)
```bash
uvicorn main_api:app --reload --host 0.0.0.0 --port 8000
```
- Документация **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- Документация **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

#### Запуск Telegram-бота (Aiogram)
В отдельном терминале запустите long-polling процесс бота:
```bash
python -m bot.main_bot
```

---

### 🐳 6. Запуск через Docker

Сборка и запуск контейнера с автоматическим выполнением миграций:
```bash
# Сборка образа
docker build -t eminem-player-backend .

# Запуск контейнера с передачей файла переменных окружения
docker run -d --name eminem-backend -p 8000:8000 --env-file .env eminem-player-backend
```
