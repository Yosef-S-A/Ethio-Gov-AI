from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import os

RAW_DATA_PATH = "data/raw/"
INTERIM_DATA_PATH = "data/interim/"

def chunk_legal_docs():
    # 1. Use larger chunks and smart separators
    # We add "Article" and "አንቀጽ" as separators so it tries to split at Article boundaries first.
    child_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,        # Increased from 400 for better "Article" context
        chunk_overlap=150,      # Increased overlap to bridge connected sub-articles
        separators=["\n\n", "\n", "Article", "አንቀጽ", " ", ""] 
    )

    all_docs = []
    
    for file_name in os.listdir(RAW_DATA_PATH):
        if file_name.endswith(".pdf"):
            loader = PyPDFLoader(os.path.join(RAW_DATA_PATH, file_name))
            docs = loader.load()
            
            # Enrich metadata and page content
            for doc in docs:
                law_id = file_name.replace(".pdf", "")
                # Metadata helps filtering; putting it in text helps search
                doc.page_content = f"Law ID: {law_id} | Page: {doc.metadata.get('page')} \n {doc.page_content}"
                doc.metadata["law_id"] = law_id
                doc.metadata["source_file"] = file_name
            
            chunks = child_splitter.split_documents(docs)
            all_docs.extend(chunks)
            
    print(f"Generated {len(all_docs)} high-context chunks.")
    return all_docs

if __name__ == "__main__":
    chunk_legal_docs()