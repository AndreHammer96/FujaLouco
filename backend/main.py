import os
import uvicorn
from fastapi import FastAPI

app = FastAPI()

# Pega a variável PORT ou usa 8000 como fallback
port = int(os.environ.get("PORT", 8000))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=port)
