from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

# Monta o diretório frontend como arquivos estáticos
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")