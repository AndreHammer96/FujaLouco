import os
import uvicorn
from fastapi import FastAPI

app = FastAPI()

# Pega a variável PORT ou usa 8000 como fallback
if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))  # usa 8000 se PORT não existir
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=False)
    
    
    
@app.get("/", response_class=HTMLResponse)
def read_root():
    return """
    <html>
        <head><title>Fuja Louco</title></head>
        <body>
            <h1>API funcionando!</h1>
            <p>Se você esperava um site aqui, precisa servir o front-end estático.</p>
        </body>
    </html>
    """