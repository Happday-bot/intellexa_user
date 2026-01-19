import os
import json
from pymongo import MongoClient
from bson.objectid import ObjectId
from dotenv import load_dotenv
import certifi

# Load environment variables
load_dotenv()

# Connection string
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://alfredsam2006_db_user:3ncbTinBSgTKAg0J@cluster0.o6fg583.mongodb.net/?appName=Cluster0")
DB_NAME = "IntellexaDB"

class MongoDB:
    def __init__(self):
        # Use certifi for SSL certificates to avoid verification errors
        self.client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
        self.db = self.client[DB_NAME]
        
        # Collections
        self.collections = {
            "events": self.db["events"],
            "news": self.db["news"],
            "code_challenges": self.db["code_challenges"],
            "hackathons": self.db["hackathons"],
            "roadmaps": self.db["roadmaps"],
            "domains": self.db["domains"],
            "stats": self.db["stats"],
            "meetups": self.db["meetups"],
            "broadcasts": self.db["broadcasts"],
            "feedback": self.db["feedback"],
            "team_finder": self.db["team_finder"],
            "users": self.db["users"],
            "core_members": self.db["core_members"],
            "volunteers": self.db["volunteers"],
            "progress": self.db["progress"],
            "tickets": self.db["tickets"],
            "checkins": self.db["checkins"]
        }
        
        # Initialize collections if they don't exist
        self._initialize_collections()

    def _initialize_collections(self):
        """Create all collections in MongoDB"""
        for name in self.collections.keys():
            # This will create the collection when first document is inserted
            # We just access it to ensure it exists in the dictionary
            coll = self.get_collection(name)
            if coll is not None:
                # Create indexes for common queries
                if name == "events":
                    coll.create_index("id", unique=False)
                elif name == "users":
                    coll.create_index("username", unique=True)
                    coll.create_index("email", unique=True)
                elif name == "progress":
                    coll.create_index("userId", unique=True)
                elif name == "tickets":
                    coll.create_index("userId")
                    coll.create_index("eventId")
                elif name == "checkins":
                    coll.create_index("eventId")
                    coll.create_index("studentId")

    def get_collection(self, name):
        return self.collections.get(name)

    def find_all(self, collection_name):
        coll = self.get_collection(collection_name)
        if coll is not None:
            # We convert _id to str for JSON serializability
            results = list(coll.find({}))
            for r in results:
                if "_id" in r:
                    r["_id"] = str(r["_id"])
            return results
        return []

    def find_one(self, collection_name, query):
        coll = self.get_collection(collection_name)
        if coll is not None:
            result = coll.find_one(query)
            if result and "_id" in result:
                result["_id"] = str(result["_id"])
            return result
        return None

    def find_many(self, collection_name, query):
        """Find multiple documents matching query"""
        coll = self.get_collection(collection_name)
        if coll is not None:
            results = list(coll.find(query))
            for r in results:
                if "_id" in r:
                    r["_id"] = str(r["_id"])
            return results
        return []

    def insert_one(self, collection_name, data):
        coll = self.get_collection(collection_name)
        if coll is not None:
            # Pydantic dicts might have complex objects, but usually they are primitives
            res = coll.insert_one(data)
            return str(res.inserted_id)
        return None

    def insert_many(self, collection_name, data_list):
        """Insert multiple documents"""
        coll = self.get_collection(collection_name)
        if coll is not None:
            res = coll.insert_many(data_list)
            return [str(id) for id in res.inserted_ids]
        return []

    def update_one(self, collection_name, query, data):
        coll = self.get_collection(collection_name)
        if coll is not None:
            # We use $set to only update provided fields
            res = coll.update_one(query, {"$set": data})
            return res.modified_count
        return 0

    def replace_one(self, collection_name, query, data):
        """Replace entire document"""
        coll = self.get_collection(collection_name)
        if coll is not None:
            res = coll.replace_one(query, data)
            return res.modified_count
        return 0

    def delete_one(self, collection_name, query):
        coll = self.get_collection(collection_name)
        if coll is not None:
            res = coll.delete_one(query)
            return res.deleted_count
        return 0

    def delete_many(self, collection_name, query):
        coll = self.get_collection(collection_name)
        if coll is not None:
            res = coll.delete_many(query)
            return res.deleted_count
        return 0

    def count_documents(self, collection_name, query=None):
        """Count documents matching query"""
        coll = self.get_collection(collection_name)
        if coll is not None:
            if query is None:
                query = {}
            return coll.count_documents(query)
        return 0

# Singleton instance
db = MongoDB()

def migrate_from_json():
    """Seed MongoDB with data from JSON files if collections are empty."""
    json_mapping = {
        "events": "events.json",
        "news": "news.json",
        "code_challenges": "code_challenges.json",
        "hackathons": "hackathons.json",
        "roadmaps": "roadmaps.json",
        "domains": "domains.json",
        "stats": "stats.json",
        "meetups": "meetups.json",
        "broadcasts": "broadcasts.json",
        "feedback": "feedback.json",
        "team_finder": "team_finder.json",
        "users": "users.json",
        "core_members": "core_members.json",
        "volunteers": "volunteers.json",
        "progress": "progress.json",
        "tickets": "tickets.json",
        "checkins": "checkins.json"
    }
    
    for coll_name, file_name in json_mapping.items():
        if os.path.exists(file_name):
            coll = db.get_collection(coll_name)
            if coll.count_documents({}) == 0:
                print(f"Migrating {file_name} to collection {coll_name}...")
                try:
                    with open(file_name, "r", encoding='utf-8') as f:
                        data = json.load(f)
                        if isinstance(data, list) and data:
                            coll.insert_many(data)
                        elif isinstance(data, dict) and data:
                            # progress.json is a dict userId -> progress
                            # For MongoDB, we should probably store them as docs with userId field
                            if coll_name == "progress":
                                docs = []
                                for uid, progress in data.items():
                                    progress["userId"] = uid
                                    docs.append(progress)
                                if docs:
                                    coll.insert_many(docs)
                            else:
                                coll.insert_one(data)
                    print(f"✓ Migrated {coll_name}")
                except Exception as e:
                    print(f"✗ Error migrating {coll_name}: {e}")
            else:
                print(f"Skipping {coll_name} (already has data)")
        else:
            print(f"Skipping {coll_name} (JSON file not found)")

if __name__ == "__main__":
    migrate_from_json()
