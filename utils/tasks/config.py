from pymongo import MongoClient
from bson.objectid import ObjectId

# 连接 MongoDB
# client = MongoClient('mongodb://localhost:27017/')
client = MongoClient('mongodb://120.55.193.195:27017/')

# 选择或创建 user_management_db 数据库
db = client['userDB']
users_collection = db['users']
solutions_collection = db['solutions']
paper_DB = client['papersDB']
papers_collection = paper_DB['papersCollection']

# 便于查询
# user_id, item_id, time
solutions_liked_collection = db['solution_liked']
papers_cited_collection = db['paper_cited']
papers_liked_collection = db['paper_liked']

ALLOWED_USER_TYPES = ['developer', 'designer', 'researcher']
SECRET_KEY = "e8cc7461d54e925195f55cb0e15a4b37478cac0a8719c7bfca493105ce103dcb"  # 用于 JWT 签名的密钥

def convert_objectid_to_str(data):
    if isinstance(data, dict):
        return {key: convert_objectid_to_str(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [convert_objectid_to_str(element) for element in data]
    elif not isinstance(data, str):
        return str(data)
    else:
        return data