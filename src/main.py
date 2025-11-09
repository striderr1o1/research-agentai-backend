from langgraph.graph import StateGraph, START, END, add_messages
from typing import Annotated
from typing_extensions import TypedDict, Dict
import os
from planner import RunPlannerAgent
from retriever import RunExtractionAgent
from dotenv import load_dotenv
from search import RunsearchAgent
from summarizer import RunSummarizerAgent
class State(TypedDict):
    uploaded_pdfs: dict
    query: str
    plan: Dict
    retrieved_data: list
    extracted_insights: str
    search_results: str
    search_summary: str 
    summarized_data: str
#state comes here
#create state object when user enters query
graph_builder = StateGraph(State)
def runWorkflow(graph_builder):

    graph_builder.add_node("planner", RunPlannerAgent)#planner
    graph_builder.add_node("extractor", RunExtractionAgent)#retriever
    graph_builder.add_node("searcher", RunsearchAgent)#search agent
    graph_builder.add_node("summarizer", RunSummarizerAgent)#summarizer

    graph_builder.add_edge(START, "planner")
    graph_builder.add_edge("planner", "extractor")
    graph_builder.add_edge("extractor", "searcher")
    graph_builder.add_edge("searcher", "summarizer")
    graph_builder.add_edge("summarizer", END)

    graph = graph_builder.compile()

    return graph



#testing---------------------------------------
# Create initial state instance
newstate = State(
    uploaded_pdfs={},
    query="Will Ai replace software engineers?",
    plan={},
    retrieved_data=[],
    extracted_insights="",
    search_results="",
    search_summary="",
    summarized_data=""
)

# Initialize StateGraph with the State class, not instance
graph_builder = StateGraph(State)
graph = runWorkflow(graph_builder)

# Invoke the graph with the state instance
graph.invoke(newstate)