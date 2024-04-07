from flask import Flask, jsonify, request
from model import get_word_embedding

app = Flask(__name__)


@app.route(
    "/",
)
def home():
    return "Hello, World!"


@app.route(
    "/word", methods=["GET"]
)
def process_word():
    word = request.args.get('word', '')
    width = request.args.get('width', 1000)
    height = request.args.get('height', 500)
    embedding = get_word_embedding(word, width, height)
    return jsonify({"word": word, "embedding": embedding})

