from fastapi import FastAPI
from app.api import auth, tracks, admin

app = FastAPI(title="Eminem Player API")

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(tracks.router, prefix="/api/v1/tracks", tags=["tracks"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])

@app.get("/")
async def root():
    return {"message": "Welcome to Eminem Player API"}
