from langgraph.graph import START,END,StateGraph

from app.graph.state import GraphState
from app.graph.nodes import (
    classify_querry,
    route_querry,
    greeting_response,
    thank_response,
    scope_response,
    generate_query_embedding,
    retrieve_docs,
    check_relevance,
    route_relevance,
    fallback_response,
    generate_response,
)

graph_builder = StateGraph(GraphState)

graph_builder.add_node("classify_querry", classify_querry)
graph_builder.add_node("greeting_response", greeting_response)
graph_builder.add_node("thank_response", thank_response)
graph_builder.add_node("scope_response", scope_response)
graph_builder.add_node("generate_query_embedding",generate_query_embedding)
graph_builder.add_node("retrieve_docs", retrieve_docs)
graph_builder.add_node("check_relevance", check_relevance)
graph_builder.add_node("fallback_response", fallback_response)
graph_builder.add_node("generate_response", generate_response)


graph_builder.add_edge(START,"classify_querry")
graph_builder.add_conditional_edges(
    "classify_querry",
    route_querry,
    {
        "greeting": "greeting_response",
        "thanks": "thank_response",
        "knowledge": "generate_query_embedding",
        "out_of_scope": "scope_response",
    },
)

graph_builder.add_edge("greeting_response", END)
graph_builder.add_edge("thank_response", END)
graph_builder.add_edge("scope_response", END)

graph_builder.add_edge("generate_query_embedding","retrieve_docs")
graph_builder.add_edge("retrieve_docs","check_relevance")

graph_builder.add_conditional_edges(
    "check_relevance",
    route_relevance,
    {
        "relevant": "generate_response",
        "not_relevant": "fallback_response",
    },
)

graph_builder.add_edge("generate_response", END)
graph_builder.add_edge("fallback_response", END)

graph = graph_builder.compile()

