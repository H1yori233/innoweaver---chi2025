from pymongo import MongoClient

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

# 列出所有数据库
db_list = client.list_database_names()
print("现有的 MongoDB 数据库：")
for db_name in db_list:
    print(f"- {db_name}")

users = users_collection.find()
print("")
print("")
print("userDB 中的用户列表：")
for user in users:
    print(user)  # 输出每个用户的文档
