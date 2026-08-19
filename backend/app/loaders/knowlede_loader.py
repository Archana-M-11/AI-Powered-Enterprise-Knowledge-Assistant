from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader

KNOWLEDGE_BASE_DIR=Path('knowledge_base')

def load_documents():
    documents=[]
    for pdf_file in KNOWLEDGE_BASE_DIR.glob('*.pdf'):
        loader=PyPDFLoader(str(pdf_file))
        documents.extend(loader.load())

    return documents