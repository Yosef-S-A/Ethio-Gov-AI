import sys
import os

project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(project_root)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from src.agents.self_rag import app as rag_app

api = FastAPI(title="EthioGov AI API")

api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    question: str
    history: list = []

@api.post("/query")
async def process_question(request: QueryRequest):
    try:
        inputs = {
            "question": request.question,
            "history": request.history
        }
        result = rag_app.invoke(inputs)
        
        return {
            "answer": result["generation"],
            "sources": [
                {
                    "file": doc.metadata.get("source_file"),
                    "page": doc.metadata.get("page_label"),
                    "snippet": doc.page_content[:200]
                } for doc in result["documents"]
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(api, host="0.0.0.0", port=8000)