from fastapi import APIRouter

router = APIRouter()

@router.get("/search")
async def search_tracks():
    return {"message": "Search tracks endpoint"}
