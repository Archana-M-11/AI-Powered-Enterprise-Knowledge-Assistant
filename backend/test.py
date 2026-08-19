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