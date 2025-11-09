# Research Agent Using LangGraph

This is a Research Agent, powered by LangGraph, with front-end built in Reactjs using Lovable.dev Ai. Groq has been used for LLM inference running behind the workflow.

## Git Repository Structure:
Git repository has four branches:
- temp (this branch contains both the frontend and backend folder)
- backend-service (this branch contains only the backend, including langGraph functionality)
- frontend (this branch contains the frontend built by lovable)
- main (forget this)

## How to start:
### backend:
- clone the repo
- move to backend-service branch
- run ```pip install -r requirements.txt```
- run server ```uvicorn main:app --reload``` from the backend directory

### frontend:
- move to frontend branch
- run ```npm install``` to install dependencies
- run ``` npx vite``` fron the frontend directory

## How to use the Research Agent:
Simply upload PDF if you have any, submit your query, ask it to make a web search if you want...

## How this is built?
### backend:
Starting with the backend, we have:
- app.py: includes the agent logic. Used LangGraph to build an agent workflow. LangGraph Nodes and edges are connected in this file including setting up the state class that flows through the langGraph workflow.
- main.py: this includes the API endpoints in FastAPI, I simply vibe coded this stuff. Contains two endpoints "run" and "run-streaming" with the latter one showing agent or node output step by step.
- planner.py: plans the steps for the worklow
- retriever.py: checks if any task assigned to the retriever node (retriever in the context of PDF extractor and insight generator), if yes, extracts PDFs and generates insights using LLM.
- search.py: checks if any task assigned to the searcher node, if yes, searches the internet using tavily api and LLM generates summary or insights.
- summarizer.py: summarizes all the insights
- test.py (ignore this)

## License
MIT
