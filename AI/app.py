import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import ollama

os.environ["OLLAMA_USE_CUDA"] = "1"  # GPU 사용 설정

app = Flask(__name__)
CORS(app)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")

    response = ollama.chat(model="gemma2", messages=[{"role": "user", "content": user_message}])

    return jsonify({"response": response['message']['content']})

if __name__ == '__main__':
    app.run(debug=True, port=5000, use_reloader=False, threaded=False)