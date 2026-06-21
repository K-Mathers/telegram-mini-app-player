from fastapi import APIRouter

router = APIRouter()

@router.post("/verify")
async def verify_auth():
    return {"message": "Auth verification endpoint"}
