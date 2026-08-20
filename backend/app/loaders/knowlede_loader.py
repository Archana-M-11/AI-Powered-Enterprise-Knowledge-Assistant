from langchain_community.document_loaders import PyPDFLoader


def load_documents(file_paths):
    documents = []

    for file_path in file_paths:
        loader = PyPDFLoader(str(file_path))
        for document in loader.load():
            document.metadata["source"] = str(file_path)
            documents.append(document)

    return documents