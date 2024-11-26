import redis
import os
import time
import json

# redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)
redis_client = redis.StrictRedis(host='120.55.193.195', port=6379, db=0, decode_responses=True)

# ----------------------------------------------------------------------------------------

def start_task(current_user):
    task_id = str(int(time.time() * 1000))
    task_data = json.dumps({"status": "started", "progress": 0, "result": {}})
    redis_client.set(task_id, task_data)
    return task_id

def update_task_status(task_id, status, progress, result=None):
    task_data = json.loads(redis_client.get(task_id) or "{}")
    task_data.update({"status": status, "progress": progress})
    if result is not None:
        task_data["result"].update(result)
    redis_client.set(task_id, json.dumps(task_data))

def delete_task(task_id):
    redis_client.delete(task_id)

# ----------------------------------------------------------------------------------------

def solution_eval(solution):
    if isinstance(solution, str):
        try:
            solution = json.loads(solution)
            return solution
        except json.JSONDecodeError:
            try:
                solution = eval(solution)
                return solution
            except Exception as e:
                print("解析失败:", e)
                return None
    else:
        print("solution 已是一个对象，不需要解析")
        return solution
