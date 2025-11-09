import os
from groq import Groq
from dotenv import load_dotenv
load_dotenv()

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)


def RunSummarizerAgent(state):
    if state["plan"].get("summarizer_task") is not None:
        if state["plan"].get("extraction_task") is not None:
            PdfResults = state["retrieved_data"]
        else:
            PdfResults = ""
        if state["plan"].get("search_task") is not None:
            SearchResults = state["search_results"]
        else:
            SearchResults = ""
        response = client.chat.completions.create(
            model=os.environ.get('CHAT_GROQ_MODEL'),
            messages=[
                {"role": "system", "content": """
                 You are a content summarize agent. You summarize PDF results and search results into a
                 research article with insights from that data. 
                 - Create a detailed research article
                 - support your answers from the provided data, include references
                 - if PDF results are not available, provide information from search results
                 - if both PDF and search results are not available then provide information from your own.
                 """
                },
                {
                    "role":"user", "content": f"""Query: {state["query"]}\nPDF data: {PdfResults}\nSearch Results: {SearchResults}"""
                }
            ]
        )
        Article = response.choices[0].message.content
        state["summarized_data"] = Article
        print("\n " + Article + "\n")
        return state
    else:
        return state