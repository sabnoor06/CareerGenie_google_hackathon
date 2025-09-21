import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FiUser, FiMic, FiSend, FiPlus, FiMessageSquare, FiBriefcase, FiTool, FiUploadCloud } from 'react-icons/fi';
import { FaHatWizard } from "react-icons/fa";
import ReactMarkdown from 'react-markdown'; // For rendering suggestions/recommendations
import './AdvisorPage.css';

const API_URL = 'http://localhost:8080'; // Your backend server URL

const AdvisorPage = () => {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('chat');

  // Chat State
  const [chatMessages, setChatMessages] = useState([{ type: 'ai', content: 'Hi! I am your AI Career Advisor. How can I help you today?' }]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState(['Career Goals Q1', 'Resume Feedback', 'Salary Negotiation Tips']); // Dummy history

  // Resume Analyzer State
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [isResumeLoading, setIsResumeLoading] = useState(false);

  // Skill Gap State
  const [skillGapData, setSkillGapData] = useState({ resumeText: '', jobDescriptionText: '' });
  const [skillGapResult, setSkillGapResult] = useState(null);
  const [isSkillGapLoading, setIsSkillGapLoading] = useState(false);

  // Refs and Speech Recognition
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // Effects
  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);
  useEffect(() => { setChatInput(transcript); }, [transcript]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages, isChatLoading]);


  // --- API FUNCTIONS ---

  const handleNewChat = () => {
    setChatMessages([{ type: 'ai', content: 'A fresh start! What career questions do you have?' }]);
    setActiveTab('chat');
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const newUserMessage = { type: 'user', content: chatInput };
    setChatMessages(prev => [...prev, newUserMessage]);
    setIsChatLoading(true);
    setChatInput('');
    resetTranscript();

    try {
      const response = await axios.post(`${API_URL}/chat`, { message: chatInput });
      const aiMessage = { type: 'ai', content: response.data.response };
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { type: 'ai', content: 'Sorry, I encountered an error. Please try again.' };
      setChatMessages(prev => [...prev, errorMessage]);
      console.error('Error fetching chat response:', error);
    } finally {
      setIsChatLoading(false);
    }
  };

  const analyzeResume = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setResumeFile(file);
    setIsResumeLoading(true);
    setResumeAnalysis(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post(`${API_URL}/analyze-resume`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResumeAnalysis(response.data);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setResumeAnalysis({ error: 'Failed to analyze resume. Please ensure it is a valid PDF.' });
    } finally {
      setIsResumeLoading(false);
    }
  };

  const analyzeSkillGap = async () => {
    if (!skillGapData.resumeText.trim() || !skillGapData.jobDescriptionText.trim()) {
      alert('Please paste both your resume and the job description.');
      return;
    }

    setIsSkillGapLoading(true);
    setSkillGapResult(null);

    try {
      const response = await axios.post(`${API_URL}/skill-gap`, skillGapData);
      setSkillGapResult(response.data);
    } catch (error) {
      console.error('Error analyzing skill gap:', error);
      setSkillGapResult({ error: 'Failed to perform skill gap analysis.' });
    } finally {
      setIsSkillGapLoading(false);
    }
  };

  // --- RENDER LOGIC ---
  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <div className="chat-messages">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`message-wrapper ${msg.type}-wrapper`}>
                <div className="avatar">{msg.type === 'ai' ? <FaHatWizard /> : <FiUser />}</div>
                <div className={`message ${msg.type}-message`}>{msg.content}</div>
              </div>
            ))}
            {isChatLoading && (
              <div className="message-wrapper ai-wrapper">
                <div className="avatar"><FaHatWizard /></div>
                <div className="message ai-message loading-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        );
      case 'resume':
        return (
          <div className="tool-content">
            <h2>Resume Analyzer</h2>
            <p>Upload your resume (PDF) to get instant feedback on its strengths, areas for improvement, and an estimated ATS score.</p>
            <button className="upload-button" onClick={() => fileInputRef.current?.click()} disabled={isResumeLoading}>
              <FiUploadCloud /> {resumeFile ? resumeFile.name : 'Click to Upload PDF'}
            </button>
            <input ref={fileInputRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={analyzeResume} />

            {isResumeLoading && <div className="loading-spinner"></div>}

            {resumeAnalysis && (
              <div className="results-container">
                {resumeAnalysis.error ? (
                  <p className="error-message">{resumeAnalysis.error}</p>
                ) : (
                  <>
                    <h3>ATS Score: {resumeAnalysis.atsScore}/100</h3>
                    <h4>Analysis</h4>
                    <p>{resumeAnalysis.analysis}</p>
                    <h4>Suggestions</h4>
                    <ReactMarkdown>
                      {Array.isArray(resumeAnalysis.suggestions) ? resumeAnalysis.suggestions.join('\n') : resumeAnalysis.suggestions}
                    </ReactMarkdown>
                  </>
                )}
              </div>
            )}
          </div>
        );
      case 'skill-gap':
        return (
          <div className="tool-content">
            <h2>Skill Gap Analyzer</h2>
            <p>Paste your resume and a job description to identify missing skills and get learning recommendations.</p>
            <div className="skill-gap-inputs">
              <textarea
                placeholder="Paste your full resume text here..."
                value={skillGapData.resumeText}
                onChange={e => setSkillGapData({ ...skillGapData, resumeText: e.target.value })}
              />
              <textarea
                placeholder="Paste the full job description text here..."
                value={skillGapData.jobDescriptionText}
                onChange={e => setSkillGapData({ ...skillGapData, jobDescriptionText: e.target.value })}
              />
            </div>
            <button className="analyze-button" onClick={analyzeSkillGap} disabled={isSkillGapLoading}>
              Find Skill Gaps
            </button>

            {isSkillGapLoading && <div className="loading-spinner"></div>}

            {skillGapResult && (
              <div className="results-container">
                {skillGapResult.error ? (
                  <p className="error-message">{skillGapResult.error}</p>
                ) : (
                  <>
                    <h4>Missing Skills</h4>
                    <ReactMarkdown>
                      {Array.isArray(skillGapResult.missingSkills) ? skillGapResult.missingSkills.join('\n') : skillGapResult.missingSkills}
                    </ReactMarkdown>
                    <h4>Recommendations</h4>
                    <ReactMarkdown>
                      {Array.isArray(skillGapResult.recommendations) ? skillGapResult.recommendations.join('\n') : skillGapResult.recommendations}
                    </ReactMarkdown>
                  </>
                )}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="advisor-layout">
      {/* --- SIDEBAR --- */}
      <div className="sidebar">
        <button className="new-chat-button" onClick={handleNewChat}>
          <FiPlus /> New Chat
        </button>
        <div className="history-list">
          <h3 className="history-title">Chat History</h3>
          {chatHistory.map((item, index) => (
            <div key={index} className="history-item">
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="chat-container">
        <div className="main-header">
          <div className="tab-navigation">
            <button onClick={() => setActiveTab('chat')} className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}><FiMessageSquare /> Smart Chat</button>
            <button onClick={() => setActiveTab('resume')} className={`tab-button ${activeTab === 'resume' ? 'active' : ''}`}><FiBriefcase /> Resume Analyzer</button>
            <button onClick={() => setActiveTab('skill-gap')} className={`tab-button ${activeTab === 'skill-gap' ? 'active' : ''}`}><FiTool /> Skill Gap</button>
          </div>
        </div>

        <div className="content-area">
          {renderContent()}
        </div>

        {/* --- INPUT AREA --- */}
        {activeTab === 'chat' && (
          <div className="input-area-container">
            <div className="input-section">
              <textarea
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask a career question..."
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey ? (e.preventDefault(), sendChatMessage()) : null}
              />
              <button className={`mic-button ${listening ? 'listening' : ''}`} onClick={listening ? SpeechRecognition.stopListening : SpeechRecognition.startListening} disabled={!browserSupportsSpeechRecognition}>
                <FiMic />
              </button>
              <button className="send-button" onClick={sendChatMessage} disabled={!chatInput.trim() || isChatLoading}>
                <FiSend />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvisorPage;