from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

# Monta o diretório frontend como arquivos estáticos
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("FRONTEND_PORT", 3000)))
    
print(f"🌐 Frontend iniciado em http://0.0.0.0:{os.getenv('FRONTEND_PORT', 3000)}")