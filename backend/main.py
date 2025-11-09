from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os
from app import State, runWorkflow
from langgraph.graph import StateGraph
import shutil

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://127.0.0.1:5500",
    "null"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploaded_pdfs"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@app.post("/run")
async def run_agent(query: str = Form(...), files: Optional[List[UploadFile]] = File(None)):
    uploaded_pdfs = {}
    if files:
        for file in files:
            file_path = os.path.join(UPLOAD_DIR, file.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            uploaded_pdfs[file.filename] = file_path

    new_state = State(
        uploaded_pdfs=uploaded_pdfs,
        query=query,
        plan={},
        retrieved_data=[],
        extracted_insights="",
        search_results="",
        search_summary="",
        summarized_data=""
    )

    graph_builder = StateGraph(State)
    graph = runWorkflow(graph_builder)
    result = graph.invoke(new_state)

    return {"result": result.get("summarized_data", "No summary available.")}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)