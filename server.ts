import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini client if API key is provided
let genAI: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenAI();
}

// -------------------------------------------------------------
// AI Agronomist API Route (Server-Side Proxy)
// -------------------------------------------------------------
app.post('/api/ai/ask', async (req: Request, res: Response) => {
  try {
    const { question, context } = req.body;
    if (!question || typeof question !== 'string') {
      res.status(400).json({ error: 'Question is required' });
      return;
    }

    if (genAI) {
      const systemInstruction = `You are the HarvestHub AI Agriculture Assistant, an expert agronomist specialized in Indian agriculture, crop cultivation, soil health, organic fertilizers, precision irrigation, and crop protection.
Guidelines:
1. Provide practical, step-by-step, actionable advice for farmers and growers.
2. If discussing soil, explain pH, organic carbon, and moisture needs.
3. If discussing fertilizers, categorize clearly (organic vermicompost, NPK balanced ratios, micronutrients).
4. If discussing irrigation, compare drip vs flood vs sprinkler and explain water saving percentages.
5. If discussing crop diseases or pest symptoms, distinguish general guidelines from licensed chemical interventions. Clearly advise consulting a local Krishi Vigyan Kendra (KVK) or agronomist for severe blight or dangerous chemicals.
6. Do NOT guarantee crop yields or give false assurances.
7. Keep tone respectful, encouraging, and clear.`;

      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nUser Question: ${question}` }] }
        ],
      });

      const answerText = response.text || "No response received from model.";
      
      res.json({
        answer: answerText,
        category: 'HarvestHub AI Agronomy',
      });
      return;
    }

    // Fallback answer if API key is not configured
    const q = question.toLowerCase();
    let answer = "For sustainable crop yield, perform routine soil testing every 2-3 seasons before sowing. Maintain balanced irrigation to avoid root aeration distress.";
    let category = "General Agronomy";

    if (q.includes('fertilizer') || q.includes('compost')) {
      answer = "Organic vermicompost and Farm Yard Manure (FYM) enhance soil microbial biodiversity. Apply balanced NPK in split doses aligned with vegetative and flowering phases.";
      category = "Soil & Fertilizers";
    } else if (q.includes('irrigation') || q.includes('drip')) {
      answer = "Precision drip irrigation saves up to 50-60% of water while delivering moisture and dissolved nutrients directly to the root zone.";
      category = "Irrigation Management";
    } else if (q.includes('pest') || q.includes('neem')) {
      answer = "Adopt Integrated Pest Management (IPM): install yellow sticky traps and spray cold-pressed neem oil (10,000 PPM) as an eco-friendly insect repellent.";
      category = "Plant Protection";
    }

    res.json({
      answer: `${answer}\n\n*Note: General agricultural guidance. For acute pesticide applications, consult your local agricultural extension officer.*`,
      category,
    });
  } catch (error: any) {
    console.error('AI Agronomist Error:', error);
    res.status(500).json({
      answer: "We are currently experiencing high advisory traffic. Soil management principle: Ensure adequate soil drainage and follow recommended seed treatment with Trichoderma.",
      category: "System Fallback",
    });
  }
});

// API health endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    service: 'HarvestHub Smart Agriculture API',
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// Vite Middleware Integration (Mounting Vite dev or static build)
// -------------------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`HarvestHub server running on port ${PORT}`);
  });
}

startServer();
