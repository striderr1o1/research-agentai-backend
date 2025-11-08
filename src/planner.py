from groq import Groq
import os
import json
from dotenv import load_dotenv
load_dotenv()
from pydantic import BaseModel
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)
class Plan(BaseModel):
    search_task: str
    retrieval_task: str
    summarizer_task: str

def RunPlannerAgent(state):
    planner_llm = client.chat.completions.create(
        model=os.environ.get('CHAT_GROQ_MODEL'),
        messages=[
            {"role": "system", "content": """You are a Planner Agent in a workflow system. 
             Your job is to divide a user query into the appropriate tasks for downstream agents: Search Agent, Retriever Agent, and Summarizer Agent. 

             Follow these rules:
             
             1. Analyze the user's query carefully and decide which agents are needed.
             2. Assign tasks **only if they are relevant**. Do not assign unnecessary tasks.
             3. Output your plan as a JSON object with these keys:
                - "search_task": description of the task for the Search Agent, or null if not needed.
                - "retrieval_task": description of the task for the Retriever Agent, or null if not needed.
                - "summarizer_task": description of the task for the Summarizer Agent, or null if not needed.
             4. Be intelligent in task division:
                - Use the **Retriever Agent** for pulling data from internal or pre-existing sources.
                - Use the **Search Agent** for queries that require external data or web search.
                - Use the **Summarizer Agent** if the query requires combining, condensing, or analyzing information.
             5. Keep the output strictly in **JSON format**. No explanations or extra text.
             6. If no task is needed for an agent, assign it `null`.
             
             Example output:
             
             {
               "search_task": "Search for latest articles on AI in healthcare",
               "retrieval_task": "Retrieve previous internal reports on AI applications",
               "summarizer_task": "Summarize the combined data from search and retrieval"
             }
"""
            },
            {
                "role":"user", "content": f"""{state['query']}"""
            }
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
            "name": "JSON_Plan",
            "schema": Plan.model_json_schema()
        }
        }
        
    )
    plan = planner_llm.choices[0].message.content
    json_plan = json.loads(plan)
    print(type(json_plan))
    state["plan"] = json_plan
    return state

