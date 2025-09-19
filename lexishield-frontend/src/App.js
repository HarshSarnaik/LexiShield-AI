import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const BACKEND_URL = 'http://localhost:5000';

const InfoModal = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <h2>About LexiShield AI</h2>
        <p>
          LexiShield AI is a web application designed to analyze and demystify legal documents for individuals and small businesses. It aims to make legal understanding affordable and accessible, empowering users with confidence before they sign complex agreements.
        </p>
        <hr />
        <h4>Key Technologies</h4>
        <ul>
          <li><strong>AI Engine:</strong> Google Gemini API</li>
          <li><strong>Backend:</strong> Python with Flask </li>
          <li><strong>Frontend:</strong> React.js </li>
          <li><strong>PDF Parsing:</strong> PyMuPDF </li>
          <li><strong>Deployment:</strong> Google Cloud Run </li>
        </ul>
        <hr />
        <h4>Development Team</h4>
        <p>
          This prototype was built by the **Generative Gray Hats** for the GenAI Exchange Hackathon 2025.
        </p>
        [cite_start]<p><strong>Team Leader:</strong> Harsh Sharadrao Sarnaik </p>
        <p><strong>Version:</strong> 1.0.0 (Hackathon Prototype)</p>
      </div>
    </div>
  );
};


function App() {
  const [file, setFile] = useState(null);
  const [documentText, setDocumentText] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [currentAnalysis, setCurrentAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [theme, setTheme] = useState('light');

  const [isInfoModalOpen, setInfoModalOpen] = useState(false);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Please select a valid PDF file.');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('No file selected.');
      return;
    }
    setIsLoading(true);
    setError('');
    setDocumentText('');
    setAnalysisResult('');
    setCurrentAnalysis('');
    setChatHistory([]);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${BACKEND_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setDocumentText(response.data.document_text);
    } catch (err) {
      setError('Error uploading or processing file. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const performAnalysis = useCallback(async (analysisType, question = '') => {
    if (!documentText) {
      setError('Please upload a document first.');
      return;
    }
    setIsLoading(true);
    setError('');
    setAnalysisResult('');
    setCurrentAnalysis(analysisType);
    const payload = {
      document_text: documentText,
      analysis_type: analysisType,
    };
    if (analysisType === 'chatbot') {
      const newHistory = [...chatHistory, { role: 'user', parts: [{ text: question }] }];
      payload.history = newHistory;
      payload.question = question;
      setChatHistory(newHistory);
      setUserQuestion('');
    }
    try {
      const response = await axios.post(`${BACKEND_URL}/analyze`, payload);
      const resultText = response.data.analysis_result;
      if (analysisType === 'chatbot') {
        setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: resultText }] }]);
      } else {
        setAnalysisResult(resultText);
      }
    } catch (err)
 {
      setError('An error occurred during analysis.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [documentText, chatHistory]);

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (userQuestion.trim()) {
      performAnalysis('chatbot', userQuestion.trim());
    }
  };

  const analysisTypes = [
    { id: 'summary', name: 'Summarize Document' },
    { id: 'jargon', name: 'Explain Jargon' },
    { id: 'loopholes', name: 'Find Loopholes' },
    { id: 'asymmetry', name: 'Detect Asymmetry' },
  ];

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
            <h1>LexiShield AI 🛡️</h1>
            <p>This is a prototype build for Google GenAI Exchange Hackathon. </p>
        </div>
        <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>
      
      <main className="main-content">
        {/* Left Column */}
        <div className="left-column">
          <div className="card">
            <h2>1. Upload Document</h2>
            <div className="upload-section">
              <input type="file" accept=".pdf" onChange={handleFileChange} />
              <button onClick={handleUpload} disabled={!file || isLoading}>
                {isLoading && !documentText ? 'Processing...' : 'Upload'}
              </button>
            </div>
            {error && <p className="error-message">{error}</p>}
          </div>

          {isLoading && !documentText && (
            <div className="card">
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Extracting text from PDF...</p>
              </div>
            </div>
          )}

          {documentText && (
            <div className="card extracted-text-card">
              <h2>Extracted Text</h2>
              <pre className="extracted-text-display">{documentText}</pre>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="right-column">
          {!documentText ? (
            <div className="card placeholder-card">
              <h2>2. AI Analysis</h2>
              <p>Upload a document to enable AI analysis tools.</p>
            </div>
          ) : (
            <>
              <div className="card">
                <h2>2. Analyze Document</h2>
                <div className="analysis-controls">
                  {analysisTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => performAnalysis(type.id)}
                      className={currentAnalysis === type.id ? 'active' : ''}
                      disabled={isLoading}
                    >
                      {type.name}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setCurrentAnalysis('chatbot');
                      setAnalysisResult('');
                    }}
                    className={currentAnalysis === 'chatbot' ? 'active' : ''}
                    disabled={isLoading}
                  >
                    Legal Chatbot
                  </button>
                </div>
              </div>

              <div className="results-container">
                {isLoading && (currentAnalysis || chatHistory.length > 0) && (
                   <div className="card">
                    <div className="loading-spinner">
                      <div className="spinner"></div>
                      <p>AI is thinking...</p>
                    </div>
                  </div>
                )}
                {analysisResult && currentAnalysis !== 'chatbot' && (
                  <div className="card result-card">
                    <h3>{analysisTypes.find(t => t.id === currentAnalysis)?.name || 'Analysis'} Result</h3>
                    <pre className="analysis-result-text">{analysisResult}</pre>
                  </div>
                )}
                {currentAnalysis === 'chatbot' && (
                  <div className="card result-card chat-card">
                    <h3>Legal Chatbot</h3>
                    <div className="chat-history">
                      {chatHistory.length === 0 && <p className="chat-placeholder">Ask a question about the document to begin.</p>}
                      {chatHistory.map((entry, index) => (
                        <div key={index} className={`chat-message ${entry.role}`}>
                          <p><strong>{entry.role === 'user' ? 'You' : 'LexiShield'}:</strong> {entry.parts[0].text}</p>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleChatSubmit} className="chat-input-form">
                      <input
                        type="text"
                        value={userQuestion}
                        onChange={(e) => setUserQuestion(e.target.value)}
                        placeholder="Ask a question..."
                        disabled={isLoading}
                      />
                      <button type="submit" disabled={isLoading || !userQuestion.trim()}>Send</button>
                    </form>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* --- NEW: Info button and modal --- */}
      <button className="info-button" onClick={() => setInfoModalOpen(true)}>
        ⓘ
      </button>
      {isInfoModalOpen && <InfoModal onClose={() => setInfoModalOpen(false)} />}
    </div>
  );
}

export default App;
