from app.graph.state import GraphState
from app.vectorstore.embeddings import embeddings
from app.services.retriever import retrieve_documents
from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import settings
from app.schemas.chat import AnswerResponse


llm= ChatGoogleGenerativeAI(
    model=settings.llm_model,
    google_api_key=settings.gemini_api_key
)

structured_llm = llm.with_structured_output(AnswerResponse)

def classify_querry(state:GraphState):
    user_query=state['user_query']
    prompt= f"""
     Classify the user's input into exactly one of these categories:

        greeting:
       Greeting should ONLY include simple greetings such as:
        "hi", "hello", "hey",

        thanks:
        Only expressions of gratitude such as "Thank you", "Thanks","Thanks a lot".

        knowledge:
        Questions related to the employee knowledge base,
        including benefits, leave, reimbursement, remote work,
        employee policies, or the employee handbook.

        out_of_scope:
        Anything unrelated to the employee knowledge base.

        User input:
        {user_query}

        Return ONLY one word:
        greeting
        thanks
        knowledge
        out_of_scope
"""
    response=llm.invoke(prompt)
    # print("CONTENT:", response.content)
    # print("TYPE:", type(response.content))
    content=response.content
    if isinstance(content, str):
        query_type = content.strip().lower()
    else:
        query_type = "".join(
            block["text"]
            for block in content
            if block.get("type") == "text"
        ).strip().lower()


    return{
        "query_type":query_type
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
    documents=retrieve_documents(state['user_query'])
    return{
        'retrieved_documents':documents
    }

def check_relevance(state: GraphState):
    documents = state["retrieved_documents"]
    threshold = 1.0
    relevant_documents = [
        document
        for document, score in documents
        if score <= threshold
    ]

    return {
        "relevance_result": bool(relevant_documents),
        "retrieved_documents": relevant_documents
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

def generate_response(state:GraphState):
    documents=state["retrieved_documents"]
    question=state["user_query"]

    context='\n\n'.join(
        document.page_content
        for document in documents
    )
    prompt = f"""
You are an enterprise knowledge assistant.

Answer the user's question using ONLY the provided context.

Format the answer clearly using Markdown:
- Use short paragraphs.
- Use numbered lists when explaining multiple points.
- Use bullet points when appropriate.
- Use headings for major sections.
- Keep related information grouped together.
- Do not return everything as one long paragraph.

Context:
{context}

Question:
{question}
"""
    response = structured_llm.invoke(prompt)

    sources = list({
    document.metadata.get("source", "Unknown").split("\\")[-1]
    for document in documents
    })

    return{
        "answer":response.answer,
        "source":sources
    }


