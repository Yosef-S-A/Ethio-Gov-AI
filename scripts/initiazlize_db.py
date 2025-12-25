import sys
import os

# Ensure the script can find your 'src' directory
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src')))

from processing.chunker import chunk_legal_docs
from processing.vector_store import create_local_vector_db

def main():
    print("🚀 Starting local Vector DB creation...")
    
    # Step 1: Extract and chunk the text from your 10 PDFs
    chunks = chunk_legal_docs()
    
    if not chunks:
        print("❌ No text found in data/raw/. Ensure your PDFs are there.")
        return

    # Step 2: Create the Vector DB using Ollama (nomic-embed-text)
    vector_db = create_local_vector_db(chunks)
    
    print(f"✅ Successfully indexed {len(chunks)} chunks into ChromaDB!")

if __name__ == "__main__":
    main()