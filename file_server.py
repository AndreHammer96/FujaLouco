from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Serve arquivos estáticos (CSS, JS, imagens)
app.mount("/static", StaticFiles(directory="frontend"), name="static")

# Rota catch-all para SPA (Single Page Application)
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    return FileResponse('frontend/index.html')

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("FRONTEND_PORT", 3000))
    print(f"🌐 Frontend iniciado em http://0.0.0.0:{port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
    
print(f"🌐 Frontend iniciado em http://0.0.0.0:{os.getenv('FRONTEND_PORT', 3000)}")