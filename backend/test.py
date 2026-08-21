# ------------loader---------------
# from app.loaders.knowlede_loader import load_documents

# documents=load_documents()

# print('no of docs: ',len(documents))
# for doc in documents[:3]:
#     print(doc.page_content[:500])
#     print("-" * 50)


#--------- vectore store----------------
# from app.services.rag_service import build_vector_store

# vector_store = build_vector_store()

# print("Vector store created successfully!")

#---------------retriever---------------------

# from app.services.retriever import retrieve_documents

# query = "What is the leave policy?"

# documents = retrieve_documents(query)

# for i, document in enumerate(documents, 1):
#     print(f"\n--- Document {i} ---")
#     print(document.page_content)

# for doc,score in documents:
     
#     print("Score:", score)
#     print("Content:", doc.page_content[:200])
#     print("-" * 50)

# queries = [
#     "What is the leave policy?",
#     "What are the employee benefits?",
#     "What is the reimbursement policy?",
#     "What is the weather today?",
#     "Tell me a joke"
# ]

# for query in queries:
#     print(f"\nQUERY: {query}")

#     results = retrieve_documents(query)

#     for document, score in results:
#         print("Score:", score)

#--------------llm----------
# from app.services.rag_service import ask_question

# question = "What is the leave policy?"

# answer = ask_question(question)

# print(answer)

#---------------classifier-----
# from app.graph.nodes import classify_querry

# test_queries = [
#     "Hi",
#     "Thank you",
#     "What are the employee benefits?",
#     "How many leave days do employees get?",
#     "What is the weather today?",
#     "Are you beautiful?"
# ]

# for query in test_queries:

#     state = {
#         "user_query": query
#     }

#     result = classify_querry(state)

#     print(f"{query} → {result['query_type']}")


#--------------response generation from the node-----


# from app.graph.nodes import generate_response
# from app.services.retriever import retrieve_documents

# question = "What is the leave policy?"

# results = retrieve_documents(question)

# documents = [
#     document
#     for document, score in results
#     if score <= 1.0
# ]

# state = {
#     "user_query": question,
#     "retrieved_documents": documents
# }

# result = generate_response(state)

# print("ANSWER:")
# print(result["answer"])

# print("\nSOURCES:")
# print(result['source'])

#--------- test final flow --------

from app.graph.flow import graph

questions = [
    "Hi",
    "Thanks",
    "What is the leave policy?",
    "What is the weather today?",
]

for question in questions:

    print("\n" + "=" * 50)
    print("QUESTION:", question)

    result = graph.invoke({
        "user_query": question
    })

    print("ANSWER:", result["answer"])
    print("SOURCE:", result.get("source", []))