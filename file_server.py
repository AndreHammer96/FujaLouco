from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Configuração robusta do frontend
frontend_path = os.path.join(os.path.dirname(__file__), 'frontend')
os.makedirs(frontend_path, exist_ok=True)  # Garante que a pasta existe

# Verificação de arquivos essenciais
required_files = ['index.html', 'js/script.js', 'css/style.css']
for file in required_files:
    if not os.path.exists(os.path.join(frontend_path, file)):
        print(f"⚠️ Aviso: Arquivo não encontrado - {file}")

app.mount("/static", StaticFiles(directory=frontend_path), name="static")

@app.get("/")
@app.get("/{full_path:path}")
async def serve_spa(full_path: str = ""):
    index_path = os.path.join(frontend_path, 'index.html')
    if not os.path.exists(index_path):
        available_files = "\n".join(os.listdir(frontend_path))
        raise Exception(
            f"ERRO: index.html não encontrado em {frontend_path}\n"
            f"Arquivos disponíveis:\n{available_files}"
        )
    return FileResponse(index_path)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("FRONTEND_PORT", 3000))
    
    print("="*50)
    print(f"✅ Frontend path: {frontend_path}")
    print(f"📂 Conteúdo: {os.listdir(frontend_path)}")
    print(f"🌐 Iniciando servidor na porta {port}")
    print("="*50)
    
    try:
        uvicorn.run(app, host="0.0.0.0", port=port)
    except Exception as e:
        print(f"❌ ERRO no servidor frontend: {str(e)}")
        raise