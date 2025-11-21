from pymongo import MongoClient
from config import settings

client = MongoClient(settings.MONGODB_URI)
db = client[settings.DATABASE_NAME]

# Collections
users_collection = db["users"]
tasks_collection = db["tasks"]
routine_logs_collection = db["routine_logs"]
analytics_collection = db["analytics"]
notifications_collection = db["notifications"]
streaks_collection = db["streaks"]

