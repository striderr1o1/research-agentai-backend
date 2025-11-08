from langgraph.graph import StateGraph, START, END, add_messages
from typing import Annotated
from typing_extensions import TypedDict, Dict
import os
from planner import RunPlannerAgent
from retriever import retrieve_pdfs
from dotenv import load_dotenv
from search import RunsearchAgent

class State(TypedDict):
    uploaded_pdfs: dict
    query: str
    plan: Dict
    retrieved_data: list
    search_results: list 
    summarized_data: str
#state comes here
graph_builder = StateGraph(State)
#create state object when user enters query
def runWorkflow(graph_builder):

    graph_builder.add_node("planner", RunPlannerAgent)#planner
    graph_builder.add_node("retriever", retrieve_pdfs)#retriever
    graph_builder.add_node("searcher", RunsearchAgent)#search agent
    graph_builder.add_node()#summarizer
