import os
from schemas import base as base_entity
from api.routes import router

from fastapi import FastAPI, Request, Response, status, UploadFile, File
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# origins = [
#     "http://localhost:8000",
#     "http://localhost:5173"
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origin=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"]
# )

app.include_router(router)

if __name__ == '__main__':
    pass