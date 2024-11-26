from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from routes import *
from utils.tasks import *

app = Flask(__name__)
CORS(app)  # 启用跨域支持

# 注册蓝图
app.register_blueprint(auth_bp)
app.register_blueprint(task_bp)
app.register_blueprint(query_bp)
app.register_blueprint(load_bp)
app.register_blueprint(prompts_bp)

@app.route('/hello', methods=['GET'])
def hello():
    return "Hello World!"

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    # app.run(host='0.0.0.0', port=5001, debug=True)
    app.run(host='0.0.0.0', port=5000, debug=True)
    # app.run(host='0.0.0.0', port=5000, debug=False)
