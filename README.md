# LexiShield AI 🛡️

**Your AI-Powered Legal Document Guardian**

[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-black?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)

**LexiShield AI** is a web application designed to analyze and demystify legal documents for individuals and small businesses. It aims to make legal understanding affordable and accessible, empowering users with confidence before they sign complex agreements.

### ✨ **[View the Live Demo Here](https://lexishield.netlify.app/)** ✨


---

![LexiShield AI Screenshot](https://i.imgur.com/your-screenshot-url.png)
*A preview of the LexiShield AI interface.*
*(Recommendation: Replace the link above with a screenshot of your running application!)*



## About The Project

Legal documents are often filled with dense jargon and hidden clauses that can be intimidating and risky for the average person. LexiShield AI leverages the power of the Google Gemini API to transform these complex texts into simple, actionable insights.

This project was built by the **Generative Gray Hats** team for the **Google GenAI Exchange Hackathon 2025**.

### Core Features

* **📄 Legal Document Summarizer:** Instantly generates a plain-English summary of a document's key points.
* **📖 Jargon Buster:** Identifies and explains complex and ambiguous clauses in simple terms.
* **🔍 Loophole Detector:** Scans for common missing clauses, contradictions, and unfair terms to protect the user.
* **⚖️ Asymmetry Detector:** A unique feature that finds imbalanced clauses that unfairly benefit one party over the other.
* **💬 Legal Chatbot:** An interactive chat to get instant answers to specific questions about the uploaded document.

### Built With

This project was built with a modern, scalable, and secure technology stack.

* **Frontend:**
    * ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white)
    * ![Axios](https://img.shields.io/badge/-Axios-5A29E4?logo=axios&logoColor=white)
* **Backend:**
    * ![Python](https://img.shields.io/badge/-Python-3776AB?logo=python&logoColor=white)
    * ![Flask](https://img.shields.io/badge/-Flask-000000?logo=flask&logoColor=white)
    * ![PyMuPDF](https://img.shields.io/badge/-PyMuPDF-red)
* **AI & Deployment:**
    * **Google Gemini API**
    * **Netlify** (Frontend Hosting)
    * **Render** (Backend Hosting)

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You will need to have **Node.js (v14+)** and **Python (v3.8+)** installed on your machine.

### Local Setup Instructions

1.  **Get a Free Gemini API Key**
    * Go to the **[Google AI Studio website](https://aistudio.google.com/)**.
    * Click **"Get API key"** and create a new key. Copy it for the next step.

2.  **Clone the Repository**
    ```bash
    git clone [https://github.com/HarshSarnaik/LexiShield-AI.git](https://github.com/HarshSarnaik/LexiShield-AI.git)
    cd LexiShield-AI
    ```

3.  **Setup the Backend** (Run in your first terminal)
    ```bash
    # Navigate to the backend folder
    cd backend

    # Create and activate a virtual environment
    python3 -m venv venv
    source venv/bin/activate  # On Windows, use: venv\Scripts\activate

    # Install Python dependencies
    pip install -r requirements.txt

    # Create a .env file and add your API key
    echo "GEMINI_API_KEY='YOUR_API_KEY_HERE'" > .env
    # (Now, open the .env file and paste your actual key)

    # Run the Flask server
    flask run
    ```
    Your backend is now running at `http://127.0.0.1:5000`.

4.  **Setup the Frontend** (Run in a **new, separate** terminal)
    ```bash
    # Navigate to the frontend folder
    cd frontend

    # Install NPM packages
    npm install

    # Run the React application
    npm start
    ```
    Your browser will automatically open to `http://localhost:3000` where you can use the application.

---

## 🗺️ Roadmap & Future Features

* **Clause Rewriter & Suggestion Engine:** An AI-powered feature to suggest fairer, more balanced versions of risky clauses.
* **Multi-Lingual Support:** Expand analysis to new languages.
* **Pro Version:** A low-cost subscription with document history and team collaboration.

## 📬 Contact

Harsh Sharadrao Sarnaik - [GitHub Profile](https://github.com/HarshSarnaik)

Project Link: [https://github.com/HarshSarnaik/LexiShield-AI](https://github.com/HarshSarnaik/LexiShield-AI)
```eof
