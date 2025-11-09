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

def search_and_save(state):
    if state["plan"].get("search_task") is not None:    
        query = state["plan"].get("search_task")
        results = Search(query)
        state["search_results"] = results
        print("\n\n")
        
        return state
    else:
        print("No search required")
        return state

def RunsearchAgent(state):
    if state["plan"].get("search_task") is not None:
        task = state["plan"].get("search_task")
        search_and_save(state)
        results = state["search_results"]
        Search_summary = client.chat.completions.create(
            model=os.environ.get('CHAT_GROQ_MODEL'),
            messages=[
                {"role": "system", "content": """You are a search results summarizer. You provide detailed guidance from search results targeted towards the next agent that
                 should read your insights. You must also include supporting URLs for your insights only from the search results."""
                },
                {
                    "role":"user", "content": f"""Query searched: {task}\nRetrieved Data from Search: {results}"""
                }
            ]
            
        )
        insights = Search_summary.choices[0].message.content
        state["search_summary"] = insights
        print(state["search_summary"] + "--end")
        return state
    else:
        print("No")
        return state

# newstate = RunsearchAgent({"plan": {
#     "search_task": "Get latest ai news"
# },
# "search_results": []
# })
# print(newstate["search_results"])