from langchain_chroma import Chroma


CHROMA_DIR="chroma_db"

def create_vector_store(chunks,embeddings):
    vectore_store=Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory='chroma_db'
    )  

    return vectore_store

def load_vectore_store(embeddings):
    return Chroma(
        persist_directory=CHROMA_DIR,
        embedding_function=embeddings

        )   
