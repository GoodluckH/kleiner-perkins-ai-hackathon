from openai import OpenAI

client = OpenAI(
    api_key="your-api-key-here"
)

# export client to be used in other files
def get_client():
    return client