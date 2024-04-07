from client import get_client
# import pandas as pd
# import numpy as np
# from sklearn.decomposition import PCA
# import tiktoken
# from sentence_transformers import SentenceTransformer
# import torch.nn.functional as F
# from transformers import AutoTokenizer, AutoModel
# import torch


client = get_client()
word = "house"
response = client.embeddings.create(
    model="text-embedding-3-small", input=word, encoding_format="float", dimensions=2
)
embedding = response.data[0].embedding
print(word, " embedding",embedding)



