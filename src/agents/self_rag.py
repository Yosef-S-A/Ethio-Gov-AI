from typing import List, TypedDict
from pydantic import BaseModel, Field

from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser, StrOutputParser
from langgraph.graph import END, StateGraph, START

import sys
import os

# Adds the 'src' directory to the python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Now your imports will work
from processing.vector_store import load_local_db

# 1. Define the Graph State
class GraphState(TypedDict):
    """Represents the state of our legal assistant."""
    question: str
    generation: str
    documents: List[str]

# 2. Define Structured Output Models for Grading
class GradeDocuments(BaseModel):
    """Binary score for relevance check on retrieved documents."""
    binary_score: str = Field(description="Documents are relevant to the question, 'yes' or 'no'")

# 3. Define the Nodes (The functions that do the work)
def retrieve(state):
    print("---RETRIEVING FROM LOCAL VECTOR STORE---")
    question = state["question"]
    
    # Import here to avoid circular imports
    from processing.vector_store import load_local_db
    db = load_local_db()
    
    # Retrieve top 3 relevant chunks
    documents = db.similarity_search(question, k=10)
    return {"documents": documents, "question": question}

def generate(state):
    print("---GENERATING POLISHED LEGAL ANSWER---")
    question = state["question"]
    documents = state["documents"]
    
    llm = ChatOllama(model="llama3.2", temperature=0, num_predict=2048,
        num_ctx=8192)
    
    # Improved Prompt: Personas and Clear Formatting
    prompt = ChatPromptTemplate.from_template(
        """You are the 'EthioGov AI' Senior Legal Consultant. Your objective is to provide 
        high-integrity, business-ready legal compliance summaries for investors and 
        government officials based ONLY on the provided context that includes the related proclamations with the proclamation number and title. 

        CRITICAL BUSINESS RULES:
        1. AUTHORITY FIRST: Begin EVERY response with: "Per Proclamation No., Article [X]:"
        2. STRICT NO-HALLUCINATION: If context lacks specific answer, respond EXACTLY: "⚠️ The indexed Ethiopian legal corpus does not contain this provision. Consult Federal Negarit Gazeta - www.negarigazeta.gov.et"
        3. EXECUTIVE FORMAT:
            • **Legal Rule**: Direct quote + Law ID
            • **Implementation**: 3-step compliance process
            • **Business Impact**: Single-sentence risk/opportunity summary
        4. PRECISION CITATION: Every claim ends with "[Proc. XXXX/YYYY, Art. X]"
        5. TONE: Authoritative consultant speaking to C-suite / government officials

        CONTEXT:
        {context}

        QUERY:
        {question}

        PROFESSIONAL LEGAL SUMMARY:"""
    )
    
    rag_chain = prompt | llm | StrOutputParser()
    generation = rag_chain.invoke({"context": documents, "question": question})
    return {"generation": generation, "documents": documents, "question": question}

def grade_documents(state):
    print("---CHECKING DOCUMENT RELEVANCE---")
    question = state["question"]
    documents = state["documents"]
    
    # We use a JSON-mode LLM to grade documents
    llm = ChatOllama(model="llama3.2", format="json", temperature=0)
    
    prompt = ChatPromptTemplate.from_template(
        """You are a grader checking if a document is useful to answer a question.
        If the document has ANY keywords related to the question, respond with 'yes'.
        Otherwise, respond 'no'.
        Respond ONLY in JSON format: {{"score": "yes"}} or {{"score": "no"}}
        
        Document: {document}
        Question: {question}"""
    )
    
    retrieval_grader = prompt | llm | JsonOutputParser()
    
    # Grade the first document for simplicity in this MVP
    score = retrieval_grader.invoke({"question": question, "document": documents[0].page_content})
    grade = score['score']
    
    # Inside grade_documents(state):
    print(f"--- DEBUG: Grader Score result: {score} ---")
    
    if grade == "yes":
        print("---DECISION: DOCUMENT RELEVANT---")
        return "generate"
    else:
        print("---DECISION: DOCUMENT NOT RELEVANT---")
        return "not_relevant"

# 4. Build the Graph
workflow = StateGraph(GraphState)

# Add Nodes
workflow.add_node("retrieve", retrieve)
workflow.add_node("generate", generate)

# Define Flow
workflow.add_edge(START, "retrieve")

workflow.add_edge("retrieve", "generate")
# Add Conditional Logic: Only generate if documents are relevant
workflow.add_conditional_edges(
    "retrieve",
    grade_documents,
    {
        "generate": "generate",
        "not_relevant": END, # In a full version, this could trigger a 'web_search' or 'rewrite'
    },
)
#         "generate": "generate",
#         "not_relevant": END, # In a full version, this could trigger a 'web_search' or 'rewrite'
#     },
# )

workflow.add_edge("generate", END)

# Compile the Brain
app = workflow.compile()

# --- THE TEST ---
if __name__ == "__main__":
    print("\n--- Testing EthioGov AI (Local Self-RAG) ---")
    # Change this to a question relevant to your 10 PDFs
    test_question = "Summarize the main differences between a Joint Venture and a Sole Investment for a tech startup."
    
    inputs = {"question": test_question}
    for output in app.stream(inputs):
        for key, value in output.items():
            print(f"Node '{key}' completed.")
    
    # Final Result
    final_state = app.invoke(inputs)
    # print("\n--- FINAL RESPONSE ---", final_state)
    print("\nFINAL ANSWER:\n", final_state["generation"])