// index.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const multer = require('multer');
const pdf = require('pdf-parse');
dotenv.config();
const app = express();
const router = express.Router();
const port = 8080;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- MULTER SETUP ---
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- GEMINI AI SETUP ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- API ENDPOINTS ---

// --- NEW: MARKET INSIGHTS ENDPOINT ---
// --- DYNAMIC MARKET INSIGHTS ENDPOINT ---
// --- DYNAMIC MARKET INSIGHTS ENDPOINT (WITH DECLINING ROLES) ---
app.get('/market-insights', async (req, res) => {
  try {
    // 1. Updated prompt to include "decliningRoles"
    const prompt = `
      Generate a JSON object with current market insights for the tech industry in the USA.
      The JSON object must have exactly these four keys:
      - "trendingRoles": an array of 3 popular and current job titles.
      - "decliningRoles": an array of 3 job titles with decreasing demand due to automation or tech shifts.
      - "averageSalaries": an object mapping the 3 TRENDING job titles to their estimated average annual USD salary as a string (e.g., "$130,000").
      - "remoteOpportunities": a string representing the estimated percentage of tech jobs that are remote (e.g., "68%").

      Do not include any text or formatting outside of the JSON object itself.
    `;

    // 2. Call the AI model
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // 3. Clean and parse the response
    const cleanedText = text.replace(/```json|```/g, '').trim();
    const marketData = JSON.parse(cleanedText);

    // 4. Send the dynamic data to the frontend
    res.json(marketData);

  } catch (error) {
    console.error("Error fetching market insights from AI:", error);
    // As a fallback, send expanded mock data if the AI fails
    res.status(500).json({
      trendingRoles: ["AI/ML Engineer", "Cloud Architect", "Cybersecurity Analyst"],
      decliningRoles: ["Data Entry Clerk", "IT Support (Tier 1)", "Manual QA Tester"],
      averageSalaries: { "AI/ML Engineer": "$145,000", "Cloud Architect": "$150,000", "Cybersecurity Analyst": "$110,000" },
      remoteOpportunities: "65%"
    });
  }
});

// This endpoint receives the transcribed text from the frontend
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const prompt = `You are a helpful AI Career Advisor. A user asks: "${message}". Provide a concise and actionable response.`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    res.json({ response: text });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get response from AI.' });
  }
});

app.post('/analyze-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    const data = await pdf(req.file.buffer);
    const resumeText = data.text;

    // --- PROMPT MODIFICATION ---
    const prompt = `
      As an expert technical recruiter and ATS (Applicant Tracking System) specialist, analyze this resume text: "${resumeText}".
      Provide a response as a JSON object with three keys: "analysis", "suggestions", and "atsScore".
      - "analysis": A 2-3 sentence summary of the resume's strengths.
      - "suggestions": A markdown bulleted list of 3 concrete improvement tips.
      - "atsScore": An estimated ATS-friendliness score between 0 and 100, based on keyword matching, formatting, and clarity.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    const analysisResult = JSON.parse(text);
    res.json(analysisResult);
  } catch (error) {
    console.error('Error analyzing resume:', error); // Added for better debugging
    res.status(500).json({ error: 'Failed to analyze resume.' });
  }
});

app.post('/skill-gap', async (req, res) => {
  try {
    const { resumeText, jobDescriptionText } = req.body;
    if (!resumeText || !jobDescriptionText) {
      return res.status(400).json({ error: 'Resume and job description text are required.' });
    }

    const prompt = `
      Act as a senior technical recruiter. Perform a skill gap analysis by comparing the candidate's resume against the job description.
      Resume: "${resumeText}"
      Job Description: "${jobDescriptionText}"
      
      Provide a response as a JSON object with two keys: "missingSkills" and "recommendations".
      - "missingSkills": A markdown bulleted list of the top 3-5 critical missing skills.
      - "recommendations": A markdown bulleted list of 2-3 specific online course recommendations (from Coursera, edX, or Google Skills Boost) to acquire these skills.
    `;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    const analysisResult = JSON.parse(text);
    res.json(analysisResult);
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze skill gap.' });
  }
});

router.post('/login', async (req, res) => {
  const allowedUsers = [
    { username: 'yawar', password: '1234' },
    { username: 'sabnoor', password: '1234' }
  ];
  const { username, password } = req.body;
  const user = allowedUsers.find(u => u.username === username);

  if (user && user.password === password) {
    console.log(`Login successful for user: ${username}`);
    res.json({
      success: true,
      message: 'Login successful!',
      access_token: 'fake-access-token-for-development-' + Math.random(),
      user: {
        username: user.username,
        name: user.username.charAt(0).toUpperCase() + user.username.slice(1)
      }
    });
  } else {
    console.log(`Login failed for user: ${username}`);
    res.status(401).json({ 
      success: false, 
      error: 'Invalid username or password' 
    });
  }
});

// Connect the router to the app. All routes on 'router' will be prefixed with '/api'
app.use('/api', router);

// --- START SERVER ---
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});