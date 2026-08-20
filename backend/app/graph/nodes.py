from app.graph.state import GraphState
from app.vectorstore.embeddings import create_embeddings

embeddings=create_embeddings()

def generate_query_embedding(state:GraphState):
    query_embedding=embeddings.embed_query(state['user_query'])
    return {
        "query_embedding":query_embedding
    }
