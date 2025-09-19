import os
import pymupdf as fitz
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import time
import uuid

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# --- Configuration ---
# The server will use a local folder for temporary file storage.
# On platforms like Render, this is a private, ephemeral filesystem.
UPLOAD_FOLDER = 'temp_uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Get the Gemini API Key from environment variables
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("FATAL ERROR: GEMINI_API_KEY environment variable is not set.")
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key={GEMINI_API_KEY}"

# --- System Prompts ---
SYSTEM_PROMPTS = {
    "summary": "You are an expert legal assistant. Summarize the following legal document in simple, easy-to-understand English. Use markdown for formatting, such as headings, bold text, and bullet points to make it highly readable. Focus on the key obligations, rights, and potential risks for the user.",
    "jargon": "You are a legal terminology expert. Identify and explain any complex legal jargon, terms, or phrases in the following document. Present the results as a list using markdown. For each term, make the term bold and then provide a simple explanation.",
    "loopholes": "You are a risk analysis expert specializing in legal contracts. Scan the following document for common loopholes, missing clauses, contradicting terms, or potentially unfair conditions. List and explain each potential issue you find using markdown.",
    "asymmetry": "You are an AI specializing in contract fairness. Analyze the following legal document to identify any clauses that are imbalanced, one-sided, or significantly favor one party over the other (asymmetry). For each imbalanced clause, explain why it's asymmetrical and its potential consequences using markdown.",
    "chatbot": "You are a helpful legal chatbot named LexiShield. You will be given a legal document and a conversation history. Answer the user's questions based ONLY on the content of the provided legal document. Be helpful, clear, and concise. Do not provide legal advice. If the answer isn't in the document, state that clearly."
}

# --- Gemini API Call Function ---
def call_gemini_api(user_prompt, system_instruction, max_retries=3):
    if not GEMINI_API_KEY:
        return "Error: API key is not configured on the server."
    payload = {
        "contents": [{"parts": [{"text": user_prompt}]}],
        "systemInstruction": {"parts": [{"text": system_instruction}]},
        "generationConfig": {"temperature": 0.5, "maxOutputTokens": 4096}
    }
    headers = {'Content-Type': 'application/json'}
    for attempt in range(max_retries):
        try:
            response = requests.post(GEMINI_API_URL, headers=headers, json=payload, timeout=90)
            response.raise_for_status()
            response_json = response.json()
            if response_json.get('candidates'):
                return response_json['candidates'][0]['content']['parts'][0]['text']
            print(f"Warning: Unexpected API response format: {response_json}")
            return "Error: Unexpected response format from AI."
        except requests.exceptions.RequestException as e:
            print(f"Error calling Gemini API: {e}")
            time.sleep(2 ** attempt)
    return "Error: Could not connect to AI service."

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and file.filename.endswith('.pdf'):
        unique_filename = str(uuid.uuid4()) + ".pdf"
        filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
        try:
            file.save(filepath)
            doc = fitz.open(filepath)
            text = "".join(page.get_text() for page in doc)
            doc.close()
            return jsonify({"document_text": text})
        except Exception as e:
            print(f"Error during file processing: {e}")
            return jsonify({"error": f"Error processing file: {str(e)}"}), 500
        finally:
            if os.path.exists(filepath):
                os.remove(filepath)
                print(f"Securely deleted temporary file: {filepath}")
    return jsonify({"error": "Invalid file type, please upload a PDF"}), 400

# --- Analyze Endpoint ---
@app.route('/analyze', methods=['POST'])
def analyze_document():
    data = request.get_json()
    if not data or 'document_text' not in data or 'analysis_type' not in data:
        return jsonify({"error": "Missing document_text or analysis_type"}), 400
    doc_text = data['document_text']
    analysis_type = data['analysis_type']
    system_instruction = SYSTEM_PROMPTS.get(analysis_type)
    if not system_instruction:
        return jsonify({"error": "Invalid analysis type"}), 400
    if analysis_type == 'chatbot':
        history = data.get('history', [])
        question = data.get('question', '')
        chat_prompt = f"DOCUMENT CONTEXT:\n---\n{doc_text}\n---\n\nCONVERSATION HISTORY:\n"
        for entry in history:
            role = "User" if entry['role'] == 'user' else "Assistant"
            chat_prompt += f"{role}: {entry['parts'][0]['text']}\n"
        chat_prompt += f"\nNEW QUESTION:\n{question}"
        user_prompt = chat_prompt
    else:
        user_prompt = f"Please analyze the following document:\n\n{doc_text}"
    ai_response = call_gemini_api(user_prompt, system_instruction)
    return jsonify({"analysis_result": ai_response})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, port=port, host='0.0.0.0')
