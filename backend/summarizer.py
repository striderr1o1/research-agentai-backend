import os
from groq import Groq
from dotenv import load_dotenv
load_dotenv()

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)


def RunSummarizerAgent(state):
    if state["plan"].get("summarizer_task") is not None:
        task = state["plan"].get("summarizer_task")
        if state["plan"].get("extraction_task") is not None:
            PdfInsights = state["extracted_insights"]
        else:
            PdfInsights = ""
        if state["plan"].get("search_task") is not None:
            SearchSummary = state["search_summary"]
        else:
            SearchSummary = ""
        response = client.chat.completions.create(
            model=os.environ.get('CHAT_GROQ_MODEL'),
            messages=[
                {"role": "system", "content": """
                 You are a content summarize agent. You summarize PDF insights from Extractor Agent and search summary from other agent into a
                 research article with insights from that data. 
                 - Create a detailed research article
                 - support your answers from the provided data, include references
                 - if PDF insights are not available, provide information from search insights, but must include references and URLs from that data 
                 - if both PDF and search data are not available then provide information from your own.
                 - use asterisk(*) instead of dagger †
                 """
                },
                {
                    "role":"user", "content": f"""Your task assigned by planner agent: {task}\nPDF Insights from PDF agent: {PdfInsights}\nSearch insights from other agent: {SearchSummary}"""
                }
            ]
        )
        Article = response.choices[0].message.content
        state["summarized_data"] = Article
        # print("\n " + Article + "\n")
        return state
    else:
        return state