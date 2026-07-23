from fastapi import FastAPI
from app.api.v1 import auth
from app.api.v1 import albums
from app.api.v1 import admin, tracks

app = FastAPI(title="Eminem Player API")

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(tracks.router, prefix="/api/v1/tracks", tags=["tracks"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])
app.include_router(albums.router, prefix="/api/v1/albums", tags=["albums"])

@app.get("/")
async def root():
    return {"message": "Welcome to Eminem Player API"}
