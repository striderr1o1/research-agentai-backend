from langgraph.graph import StateGraph, START, END, add_messages
from typing import Annotated
from typing_extensions import TypedDict, Dict
import os
from planner import RunPlannerAgent
from retriever import retrieve_pdfs
from dotenv import load_dotenv
from search import RunsearchAgent
from summarizer import RunSummarizerAgent
class State(TypedDict):
    uploaded_pdfs: dict
    query: str
    plan: Dict
    retrieved_data: list
    search_results: list 
    summarized_data: str
#state comes here
#create state object when user enters query
graph_builder = StateGraph(State)
def runWorkflow(graph_builder):

    graph_builder.add_node("planner", RunPlannerAgent)#planner
    graph_builder.add_node("retriever", retrieve_pdfs)#retriever
    graph_builder.add_node("searcher", RunsearchAgent)#search agent
    graph_builder.add_node("summarizer", RunSummarizerAgent)#summarizer

    graph_builder.add_edge(START, "planner")
    graph_builder.add_edge("planner", "retriever")
    graph_builder.add_edge("retriever", "searcher")
    graph_builder.add_edge("searcher", "summarizer")
    graph_builder.add_edge("summarizer", END)

    graph = graph_builder.compile()

    return graph

# Create initial state instance
newstate = State(
    uploaded_pdfs={},
    query="What is agentic ai?",
    plan={},
    retrieved_data=[],
    search_results=[],
    summarized_data=""
)

# Initialize StateGraph with the State class, not instance
graph_builder = StateGraph(State)
graph = runWorkflow(graph_builder)

# Invoke the graph with the state instance
graph.invoke(newstate)