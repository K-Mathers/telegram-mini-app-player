from supabase import Client, create_client
from app.core.config import settings

supabase_client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)