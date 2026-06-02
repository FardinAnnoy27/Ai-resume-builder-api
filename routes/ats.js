import express from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/score', async (req, res) => {
  try {
    const { resumeContent, jobDescription } = req.body;

    const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze the following resume content against the job description and provide a compatibility score.

Resume Content:
${resumeContent}

Job Description:
${jobDescription}

Respond in JSON format:
{
  "score": 75,
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword3", "keyword4"],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}

Score should be 0-100. Only return valid JSON, no markdown fences.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { 
        temperature: 0.3,
        responseMimeType: 'application/json' // Forces Gemini to return pure JSON!
      }
    });

    let text = response.text;
    
    // Robust fallback: strip markdown fences if they ever leak through
    if (text.startsWith('```')) {
      text = text.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    }

    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;