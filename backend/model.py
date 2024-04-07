from client import get_client
import json 
# from nltk.corpus import words
import nltk
from nltk.corpus import wordnet

def read_embeddings():
    with open('embeddings.json', 'r') as f:
        embeddings = json.load(f)
    return embeddings

def get_word_embedding_from_gpt(word):
    client = get_client()
    response = client.embeddings.create(
        model="text-embedding-3-small", input=word, encoding_format="float", dimensions=2
    )
    embedding = response.data[0].embedding
    return embedding

def translatePoint(point, canvasWidth, canvasHeight):
    ## Calculate canvas center
    centerX = canvasWidth / 2
    centerY = canvasHeight / 2

    ## Scale and translate x-coordinate
    canvasX = centerX + point[0] * (canvasWidth / 2)
    ## Scale and translate y-coordinate (Note: y is inverted in canvas)
    canvasY = centerY - point[1] * (canvasHeight / 2)

    return [canvasX, canvasY]


def get_word_embedding(word, width, height):
    if word == "":
        return None
    nltk.download('wordnet')
    if not wordnet.synsets(word):
        return None
    
    embeddings = read_embeddings()
    try:
        return embeddings[word]
    except:
        word_embedding = get_word_embedding_from_gpt(word)
        scaled_embedding = translatePoint(word_embedding, width, height)
        word_embedding = scaled_embedding
        embeddings[word] = word_embedding
        with open('embeddings.json', 'w') as f:
            json.dump(embeddings, f)
        return word_embedding


# print(get_word_embedding(word="catch", width=1000, height=500))
