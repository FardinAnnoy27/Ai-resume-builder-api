import express from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/resume', async (req, res) => {
  try {
    const { profile, targetRole } = req.body;

    const prompt = `You are a professional resume writer. Based on the following profile, generate a compelling professional summary (2-3 sentences) and improved bullet points for each work experience entry, tailored for the role of "${targetRole}".

Profile:
Name: ${profile.fullName}
Skills: ${profile.skills?.join(', ')}
Experience: ${JSON.stringify(profile.experience)}

Respond in JSON format:
{
  "summary": "professional summary here",
  "experienceBullets": {
    "0": ["bullet 1", "bullet 2", "bullet 3"],
    "1": ["bullet 1", "bullet 2", "bullet 3"]
  }
}

Only return valid JSON, no markdown fences.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { 
        temperature: 0.7,
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

router.post('/cover-letter', async (req, res) => {
  try {
    const { profile, jobDescription, companyName } = req.body;

    const prompt = `You are a professional cover letter writer. Write a compelling cover letter for the following candidate applying to ${companyName}.

Candidate Profile:
Name: ${profile.fullName}
Skills: ${profile.skills?.join(', ')}
Experience: ${JSON.stringify(profile.experience?.slice(0, 2))}

Job Description:
${jobDescription}

Write a professional cover letter (3-4 paragraphs). Be specific about how the candidate's experience matches the role. Do not use generic filler.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { temperature: 0.7 }
    });

    res.json({ coverLetter: response.text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;