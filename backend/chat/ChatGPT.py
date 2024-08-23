

import openai
from dotenv import load_dotenv
import os
# from decouple import Config

load_dotenv()

API_KEY= os.getenv('api_key')

messages = [
    {"role" : "system", "content": "You are a king helpful assistant."}
]

client = openai.OpenAI(
    api_key=API_KEY,
    base_url="https://api.aimlapi.com",
)


while True:
    user_question = input ("User say: ")
    messages.append({"role" : "user", "content" : user_question})
    chat_completion = client.chat.completions.create(
        model="mistralai/Mistral-7B-Instruct-v0.2",
        messages=messages,
        temperature=0.7,
        max_tokens=128,
    )
    response = chat_completion.choices[0].message.content
    messages.append({"role" : "assistant", "content" : response})
    print("AI/ML API: ", response)


