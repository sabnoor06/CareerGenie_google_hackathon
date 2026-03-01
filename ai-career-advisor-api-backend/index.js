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

// --- GEMINI AI SETUP & FALLBACK LOGIC ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Updated list for 2026: aliases 'gemini-pro-latest' and 'gemini-flash-latest' 
// now point to Gemini 3 series.
const MODEL_PRIORITY_LIST = [
  "gemini-3-flash-preview",
  "gemini-3-pro-preview",
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-1.5-flash"
];

/**
 * Robust JSON extraction to prevent 500 errors during JSON.parse()
 */
const cleanAIResponse = (text) => {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch ? jsonMatch[0] : text;
};

/**
 * Attempts to generate content using a list of models until one succeeds.
 */
async function generateWithFallback(prompt) {
  let lastError = null;
  for (const modelName of MODEL_PRIORITY_LIST) {
    try {
      console.log(`Attempting request with: ${modelName}`);
      const modelInstance = genAI.getGenerativeModel({ model: modelName });
      const result = await modelInstance.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.warn(`Model ${modelName} failed: ${error.message}`);
      lastError = error;
    }
  }
  throw new Error(`All models failed. Last error: ${lastError?.message}`);
}

// --- API ENDPOINTS ---

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const prompt = `You are a helpful AI Career Advisor. A user asks: "${message}". Provide a concise and actionable response.`;
    const aiText = await generateWithFallback(prompt);
    
    res.json({ response: aiText });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: 'AI service unavailable.', details: error.message });
  }
});

app.post('/analyze-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const data = await pdf(req.file.buffer);
    const resumeText = data.text;

    const prompt = `
      Analyze this resume text and provide a JSON object with:
      - "score": (0-100)
      - "feedback": (A brief summary)
      - "strengths": (Array of 3 strings)
      - "improvements": (Array of 3 strings)
      Resume: ${resumeText}
    `;

    const rawResponse = await generateWithFallback(prompt);
    const cleanedJson = cleanAIResponse(rawResponse);
    res.json(JSON.parse(cleanedJson));
  } catch (error) {
    console.error("Resume Error:", error);
    res.status(500).json({ error: 'Failed to analyze resume.' });
  }
});

app.post('/skill-gap', async (req, res) => {
  try {
    const { resumeText, jobDescriptionText } = req.body;
    const prompt = `
      Compare this resume to the job description and provide a JSON object:
      - "missingSkills": (Array of 3 strings)
      - "matchPercentage": (0-100)
      - "recommendations": (Array of 2 courses)
      Resume: ${resumeText}
      Job: ${jobDescriptionText}
    `;

    const rawResponse = await generateWithFallback(prompt);
    const cleanedJson = cleanAIResponse(rawResponse);
    res.json(JSON.parse(cleanedJson));
  } catch (error) {
    console.error("Skill Gap Error:", error);
    res.status(500).json({ error: 'Failed to analyze skill gap.' });
  }
});

app.get('/market-insights', async (req, res) => {
  try {
    const prompt = `Generate a JSON object with: "trendingRoles" (3 roles), "decliningRoles" (3 roles), and "averageSalaries" (map roles to salaries).`;
    const rawResponse = await generateWithFallback(prompt);
    const cleanedJson = cleanAIResponse(rawResponse);
    res.json(JSON.parse(cleanedJson));
  } catch (error) {
    console.error("Market Error:", error);
    res.status(500).json({ error: 'Failed to fetch insights.' });
  }
});


app.post('/resume-market-insights', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const data = await pdf(req.file.buffer);
    const resumeText = data.text;

    const resumePrompt = `
      Analyze this resume text and provide a JSON object with:
      - "score": (0-100)
      - "feedback": (A brief summary)
      - "strengths": (Array of 3 strings)
      - "improvements": (Array of 3 strings)
      Resume: ${resumeText}
    `;

    const marketPrompt = `Generate a JSON object with: "trendingRoles" (3 roles), "decliningRoles" (3 roles), and "averageSalaries" (map roles to salaries).`;

    const [resumeRaw, marketRaw] = await Promise.all([
      generateWithFallback(resumePrompt),
      generateWithFallback(marketPrompt)
    ]);

    const resumeAnalysis = JSON.parse(cleanAIResponse(resumeRaw));
    const marketInsights = JSON.parse(cleanAIResponse(marketRaw));

    res.json({
      resumeAnalysis,
      marketInsights,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Resume+Market Error:", error);
    res.status(500).json({ error: 'Failed to analyze resume and market insights.' });
  }
});

// --- AUTH (STAYS THE SAME) ---
app.use('/api', router);
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (username === 'yawar' && password === '1234') {
    res.json({ success: true, user: { username: 'Yawar' } });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
app.post('/mock-interview', async (req, res) => {
  try {
    const { jobTitle, lastMessage, history } = req.body;

    // The system prompt tells Gemini how to behave
    const systemPrompt = `
      You are an expert HR Interviewer for the position of ${jobTitle}. 
      Your goal is to conduct a realistic interview. 
      - Ask only ONE question at a time.
      - If the user answers, provide brief feedback and ask the next follow-up question.
      - Keep the tone professional but encouraging.
      - After 5 questions, say "INTERVIEW_COMPLETE" and provide a summary of their performance.
    `;

    // Combine history for context so the AI remembers previous questions
    const fullPrompt = `${systemPrompt}\n\nInterview History:\n${history}\n\nUser: ${lastMessage}`;
    
    const aiResponse = await generateWithFallback(fullPrompt);
    res.json({ response: aiResponse });
  } catch (error) {
    res.status(500).json({ error: 'Interview failed to start.' });
  }
});
