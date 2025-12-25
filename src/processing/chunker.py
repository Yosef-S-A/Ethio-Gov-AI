from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import os

RAW_DATA_PATH = "data/raw/"
INTERIM_DATA_PATH = "data/interim/"

def chunk_legal_docs():
    # 1. Setup the splitters
    # Child chunks (small, for high-accuracy vector search)
    child_splitter = RecursiveCharacterTextSplitter(chunk_size=400, chunk_overlap=50)
    
    # Parent chunks (larger, to provide context to the LLM)
    # parent_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=200)

    all_docs = []
    
    for file_name in os.listdir(RAW_DATA_PATH):
        if file_name.endswith(".pdf"):
            print(f"Processing: {file_name}")
            loader = PyPDFLoader(os.path.join(RAW_DATA_PATH, file_name))
            
            # Load and add metadata (Sovereign Data principle)
            docs = loader.load()
            for doc in docs:
                doc.metadata["source_file"] = file_name
                # Extract Proclamation number if in filename (e.g. Proc_1234.pdf)
                doc.metadata["law_id"] = file_name.split('.')[0]
            
            # Split into child chunks
            chunks = child_splitter.split_documents(docs)
            all_docs.extend(chunks)
            
    print(f"Generated {len(all_docs)} searchable chunks.")
    return all_docs

if __name__ == "__main__":
    chunk_legal_docs()