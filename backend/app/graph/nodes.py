from app.graph.state import GraphState
from app.vectorstore.embeddings import embeddings
from app.services.retriever import retrieve_documents, retrieve_uploaded_documents
from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import settings
from app.schemas.chat import AnswerResponse
from langsmith import traceable
import os
from app.core.config import settings

os.environ["LANGSMITH_TRACING"] = str(settings.langsmith_tracing).lower()
if settings.langsmith_api_key:
    os.environ["LANGSMITH_API_KEY"] = settings.langsmith_api_key
if settings.langsmith_project:
    os.environ["LANGSMITH_PROJECT"] = settings.langsmith_project

llm= ChatGoogleGenerativeAI(
    model=settings.llm_model,
    google_api_key=settings.gemini_api_key
)

structured_llm = llm.with_structured_output(AnswerResponse)

@traceable(name="Classify Query")
def classify_querry(state:GraphState):
    user_query=state['user_query']
    has_upload = state.get("has_uploaded_document", False)
    upload_note = (
        """
        Also determine whether the user wants information from the
        uploaded document. Return YES if they refer to the or this file,
        document, PDF, uploaded file, etc. Otherwise return NO.
        """
        if has_upload else ""
    )

    prompt = f"""
        Classify the input into: greeting, thanks, knowledge, or out_of_scope.

        - greeting: simple greetings like "hi", "hello".
        - thanks: gratitude like "thanks", "thank you".
        - knowledge: anything about company/employee matters, including
        policies, leave, benefits, reimbursement, remote work, handbook,
        or company guidelines.
        - out_of_scope: anything unrelated to company/employee matters.

        {upload_note}

        Input: {user_query}

        Return only:
        <category> <yes/no>
        """
    try:
        response = llm.invoke(prompt)
    except Exception:
        return {"query_type": "out_of_scope", "references_upload": False}

    content=response.content
    if isinstance(content, str):
        text = content.strip().lower()
    else:
        text = "".join(
            block["text"]
            for block in content
            if block.get("type") == "text"
        ).strip().lower()
    parts = text.split()
    query_type = parts[0] if parts else "out_of_scope"
    references_upload = has_upload and len(parts) > 1 and parts[1] == "yes"

    return{
        "query_type":query_type,
        "references_upload": references_upload
    }

def route_querry(state:GraphState):
    querry_type=state['query_type']
    if querry_type=='greeting':
        return "greeting"
    elif querry_type=='knowledge':
        return 'knowledge'
    elif querry_type == "thanks":
        return "thanks"
    elif querry_type=='out_of_scope':
        return "out_of_scope"
    return "out_of_scope"

def greeting_response(state: GraphState):

    return {
        "answer": "Hello! How can I help you with the employee knowledge base?"
    }

def thank_response(state:GraphState):
    return{
        "answer":"You're welcome! Feel free to ask me anything about the employee knowledge base."
    }

def scope_response(state: GraphState):
    return {
        "answer": (
            "I'm here to help with the employee knowledge base. "
            "You can ask about benefits, leave, reimbursement, "
            "remote work, or employee policies."
        )
    }


def generate_query_embedding(state: GraphState):
    query_embedding = embeddings.embed_query(
        state["user_query"]
    )

    return {
        "query_embedding": query_embedding
    }

def retrieve_docs(state: GraphState):
    question = state["user_query"]

    company_documents = retrieve_documents(question)

    uploaded_documents = []
    if state.get("references_upload", False):
        uploaded_documents = retrieve_uploaded_documents(
            question,
            state["session_id"],
            state["user_id"]
        )

    documents = (
        [(doc, score, "company") for doc, score in company_documents]
        +
        [(doc, score, "uploaded") for doc, score in uploaded_documents]
    )

    return {
        "retrieved_documents": documents
    }
def check_relevance(state: GraphState):
    documents = state["retrieved_documents"]
    threshold = 1.15

    company_docs = [(doc, score) for doc, score, origin in documents if origin == "company"]
    uploaded_docs = [(doc, score) for doc, score, origin in documents if origin == "uploaded"]

    relevant_company = [doc for doc, score in company_docs if score <= threshold]
    uploaded_included = [doc for doc, score in uploaded_docs]

    combined = relevant_company + uploaded_included

    if not combined:
        return {"relevance_result": False, "retrieved_documents": []}

    return {
        "relevance_result": True,
        "retrieved_documents": combined
    }

def route_relevance(state: GraphState):

    if state["relevance_result"]:
        return "relevant"
    return "not_relevant"

def fallback_response(state:GraphState):
    return {
        "answer": (
            "I couldn't find relevant information about that "
            "in the employee knowledge base."
        )
    }

@traceable(name="Generate Response")
def generate_response(state:GraphState):
    documents=state["retrieved_documents"]
    question=state["user_query"]
    history=state['history']
    history=history[-settings.MAX_HISTORY_MESSAGES:]
   

    context='\n\n'.join(
        document.page_content
        for document in documents
    )

    # format history 
    history_text = "\n".join(
    f"{message['role'].capitalize()}: {message['content']}"
    for message in history
    )

    prompt=f"""You are an enterprise knowledge assistant. Only discuss employee/company matters.
        If the context is unrelated (e.g. code, personal content), decline and say you can only help with employee knowledge base questions.

        Answer using only the context and prior conversation.
        Use Markdown: short paragraphs, lists/headings where useful, no single long paragraph.

        History:
        {history_text}

        Context:
        {context}

        Question: {question}"""
    try:
        response = structured_llm.invoke(prompt)
    except Exception:
        return {
            "answer": "Sorry, I'm having trouble processing your request right now. Please try again in a moment.",
            "source": []
    }

    sources = list({
    document.metadata.get("source", "Unknown").split("\\")[-1]
    for document in documents
    })
  
    return{
        "answer":response.answer,
        "source":sources
    }


