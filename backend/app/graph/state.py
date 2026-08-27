from typing import TypedDict

class GraphState(TypedDict):
    user_query:str
    history:str
    query_type:str
    query_embedding:list[float]
    retrieved_documents:list
    relevance_result:bool
    answer:str
    source:list
