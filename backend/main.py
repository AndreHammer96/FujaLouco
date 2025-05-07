import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

# Monta a pasta de arquivos estáticos
app.mount("/static", StaticFiles(directory="frontend"), name="static")

# Serve o index.html na raiz
@app.get("/")
async def read_index():
    return FileResponse("frontend/index.html")


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    # ⛔ Não use "backend.main:app", pois você já está dentro da pasta backend
    uvicorn.run("main:app", host="0.0.0.0", port=port)
