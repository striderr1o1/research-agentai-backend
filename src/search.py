from tavily import TavilyClient
import os
from dotenv import load_dotenv
from groq import Groq
load_dotenv()
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)
def Search(Query):
    tavily_client = TavilyClient(api_key=os.environ.get('TAVILY_API_KEY'))
    response = tavily_client.search(f"{Query}")
    answer = response['results']
    return answer

def RunsearchAgent(state):
    if state["plan"].get("search_task") is not None:    
        query = state["plan"].get("search_task")
        results = Search(query)
        state["search_results"].append(results)
        return state
    else:
        print("No search required")
        return state
    

# newstate = RunsearchAgent({"plan": {
#     "search_task": "Get latest ai news"
# },
# "search_results": []
# })
# print(newstate["search_results"])