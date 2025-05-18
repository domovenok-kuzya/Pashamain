from fastapi import FastAPI
from .routes import router  # Новый импорт!
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(router)  # Подключаем маршруты

@app.get("/ping")
def ping():
    return {"message": "pong!"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)