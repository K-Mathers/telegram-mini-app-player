from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from app.api.v1 import admin, tracks, playlists, albums, auth
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(title="Eminem Player API")

@app.exception_handler(HTTPException)
async def http_exception_handler(req: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

@app.exception_handler(Exception)
async def global_exception_handler(req: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": "Server error"})

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(tracks.router, prefix="/api/v1/tracks", tags=["tracks"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])
app.include_router(albums.router, prefix="/api/v1/albums", tags=["albums"])
app.include_router(playlists.router, prefix="/api/v1/playlists", tags=["playlists"])

origins = settings.CORS_ORIGINS.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to Eminem Player API"}
