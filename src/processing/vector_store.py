import os
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma

# Constants to ensure consistency between creation and loading
PERSIST_DIRECTORY = "data/vector_store"
EMBEDDING_MODEL = "nomic-embed-text"

def get_embeddings():
    """Shared embedding model for both creation and loading."""
    return OllamaEmbeddings(model=EMBEDDING_MODEL)

def create_local_vector_db(chunks):
    """Creates and persists a new vector store from document chunks."""
    print(f"--- CREATING NEW VECTOR DB AT {PERSIST_DIRECTORY} ---")
    embeddings = get_embeddings()
    
    # from_documents handles the initial embedding and persistence
    vector_db = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=PERSIST_DIRECTORY
    )
    print("✅ Vector DB Created and Persisted.")
    return vector_db

def load_local_db():
    """Loads an existing vector store from the local disk."""
    if not os.path.exists(PERSIST_DIRECTORY):
        raise FileNotFoundError(
            f"No vector store found at {PERSIST_DIRECTORY}. "
            "Please run 'python scripts/initialize_db.py' first."
        )
    
    print(f"--- LOADING EXISTING VECTOR DB FROM {PERSIST_DIRECTORY} ---")
    embeddings = get_embeddings()
    
    # Initializing Chroma with just the directory and embeddings 'loads' the saved state
    vector_db = Chroma(
        persist_directory=PERSIST_DIRECTORY,
        embedding_function=embeddings
    )
    return vector_db