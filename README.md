# LexiShield AI 🛡️

**AI-powered legal document analysis to demystify the fine print and ensure a fair deal.**

This project was developed for the **Google Gen AI Exchange Hackathon**.


## Note on this Prototype: This is a functional prototype developed for the hackathon to demonstrate our core AI backend and logic. The complete production architecture, including the React.js frontend, is detailed in our official presentation deck.
---

## 🚀 Live Demo & Video

* **Live Prototype Link:** [Insert Your Deployed Streamlit App URL Here]
* **Video Walkthrough:** [Insert Your Loom Video URL Here]

---

## 📖 Project Overview

LexiShield AI is a web application designed to help individuals, freelancers, and small businesses understand complex legal documents. Using the power of Google's Gemini API, it provides instant summaries, explains confusing jargon, and most importantly, detects unfair or imbalanced clauses to advocate for the user.

### ✨ Key Features
* **Instant Document Summarizer:** Get the key takeaways of any legal document in plain English.
* **Jargon Buster:** Identifies and explains complex legal terms and ambiguous clauses.
* **Asymmetry Detector:** Our unique feature that finds one-sided terms and power imbalances.
* **Loophole Detector:** Scans for missing clauses and contradictions.
* **Interactive Chat:** Ask specific questions about the document and get immediate answers.
* **Actionable Suggestions:** Provides clear advice and negotiation points for unfair clauses.

---

## 🛠️ Technology Stack

This prototype was rapidly developed using **Streamlit** to demonstrate our core backend and AI functionality. The production-ready version outlined in our presentation is designed with a **React.js** frontend and a full **Google Cloud** architecture.

* **Frontend:** Streamlit (for Prototype)
* **Backend:** Python & Flask
* **AI Engine:** Google Gemini API
* **PDF Parsing:** PyMuPDF
* **Deployment:** Streamlit Community Cloud

---

## ⚙️ How to Run Locally

1.  Clone the repository:
    ```bash
    git clone [https://github.com/HarshSarnaik/LexiShield-AI.git](https://github.com/HarshSarnaik/LexiShield-AI.git)
    ```
2.  Navigate to the project directory:
    ```bash
    cd LexiShield-AI
    ```
3.  Install the required libraries:
    ```bash
    pip install -r requirements.txt
    ```
4.  Set up your secrets file in `.streamlit/secrets.toml` with your Google API Key:
    ```toml
    GOOGLE_API_KEY = "YOUR_API_KEY_HERE"
    ```
5.  Run the Streamlit app:
    ```bash
    streamlit run app.py
    ```
