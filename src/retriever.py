from typing import TypedDict, Dict, List
from PyPDF2 import PdfReader
# from main import State
# class State(TypedDict):
#     uploaded_pdfs: dict
#     query: str
#     plan: Dict
#     retrieved_data: list
#     search_results: list
#     summarized_data: str

def retrieve_pdfs(state):

    """
    Retrieves information from uploaded PDFs and appends it to retrieved_data.

    Args:
        state (State): The current state of the research assistant,
                       including uploaded_pdfs and retrieved_data.

    Returns:
        State: The updated state with extracted data from PDFs.
    """

    if state["plan"].get("extraction_task") is not None:
        # Ensure retrieved_data is initialized as a list if it's not already
        if 'retrieved_data' not in state or not isinstance(state['retrieved_data'], list):
            state['retrieved_data'] = []
    
        # Iterate through each uploaded PDF
        for pdf_name, pdf_path in state['uploaded_pdfs'].items():
            # Use PyPDF2 to extract text from the PDF file
            try:
                reader = PdfReader(pdf_path)
                text = ""
                for page in reader.pages:
                    text += page.extract_text() or ""
                
                # Append the extracted text to the retrieved_data list
                state['retrieved_data'].append(text)
                print(f"Extracted data from {pdf_name} and added to retrieved_data.")
            except Exception as e:
                print(f"Error processing {pdf_name}: {e}")
                
        return state
    else:
        print("Noneeee")
        return state
