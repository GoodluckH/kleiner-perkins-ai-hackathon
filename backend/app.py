from flask import Flask, jsonify, request
from model import get_word_embedding
from flask_cors import CORS

app = Flask(__name__)

CORS(app)


@app.route(
    "/",
)
def home():
    return "Hello, World!"


@app.route("/word", methods=["GET"])
def process_word():
    word = request.args.get("word", "")
    embedding = get_word_embedding(word)
    return jsonify({"word": word, "embedding": embedding})
