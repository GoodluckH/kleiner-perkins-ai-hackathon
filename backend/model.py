from client import get_client
import json 
# from nltk.corpus import words

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


def get_word_embedding(word):
    if word == "":
        return None
    # if not word in words.words():
    #     return None
    
    embeddings = read_embeddings()
    try:
        return embeddings[word]
    except:
        word_embedding = get_word_embedding_from_gpt(word)
        embeddings[word] = word_embedding
        with open('embeddings.json', 'w') as f:
            json.dump(embeddings, f)
        return word_embedding


# get_word_embedding(word="catch")

