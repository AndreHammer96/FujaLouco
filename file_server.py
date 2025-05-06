from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Caminho ABSOLUTO para o frontend
frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'frontend'))
print(f"🔍 Caminho completo do frontend: {frontend_path}")

# Serve tudo mantendo sua estrutura atual
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("FRONTEND_PORT", 3000))
    print(f"📂 Conteúdo da pasta frontend: {os.listdir(frontend_path)}")
    uvicorn.run(app, host="0.0.0.0", port=port)