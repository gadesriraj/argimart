import { apiClient } from './apiClient';
import { AIConversation } from '../types';

export interface AiAskResponse {
  answer: string;
  category?: string;
  recommendedProducts?: {
    id: string;
    name: string;
    price: number;
    category: string;
    unit: string;
  }[];
}

export const aiService = {
  async askQuestion(question: string, context?: { userRole?: string; interestedCategory?: string }): Promise<AiAskResponse> {
    try {
      const res = await apiClient.post<AiAskResponse>('/ai/ask', {
        question,
        context,
      });
      return res.data;
    } catch (error: unknown) {
      console.warn('AI endpoint request error, engaging resilient fallback:', error);
      // Helpful fallback response respecting agricultural guidance guidelines
      const q = question.toLowerCase();
      let answer = "For sustainable crop health, ensure regular soil testing (measuring pH, organic carbon, and NPK levels) every 2-3 seasons before sowing. Maintain balanced irrigation to avoid root aeration distress.";
      let category = "General Agronomy";

      if (q.includes('fertilizer') || q.includes('urea') || q.includes('npk') || q.includes('compost')) {
        answer = "Organic vermicompost and well-decomposed FYM (Farm Yard Manure) enhance soil microbial biodiversity and cation-exchange capacity. For macronutrients, apply balanced NPK in split doses aligned with vegetative and flowering stages. Avoid over-fertilization to prevent salt buildup in the root zone.";
        category = "Soil & Fertilizers";
      } else if (q.includes('irrigation') || q.includes('water') || q.includes('drip')) {
        answer = "Precision drip irrigation saves up to 50-60% of water while delivering moisture and dissolved nutrients directly to the root zone. Sub-surface and inline drippers minimize evaporative loss and lower weed pressure compared to flood irrigation.";
        category = "Irrigation & Water Management";
      } else if (q.includes('pest') || q.includes('insect') || q.includes('disease') || q.includes('fungus')) {
        answer = "For eco-friendly pest prevention, employ Integrated Pest Management (IPM): install yellow sticky traps, utilize cold-pressed neem oil (10,000 PPM) as a safe repellent, and preserve predatory insects. For severe fungal or bacterial blight, consult your local Krishi Vigyan Kendra (KVK) or licensed agronomist for targeted bio-fungicides.";
        category = "Plant Protection";
      } else if (q.includes('seed') || q.includes('sow') || q.includes('wheat') || q.includes('paddy') || q.includes('rice')) {
        answer = "Always select certified seeds with guaranteed germination rate (>90-95%) such as HD-2967 Sharbati Wheat or Pusa 1121 Basmati Paddy. Treat seeds with Trichoderma or bio-inoculants prior to sowing to shield seedlings from root rot and damping-off.";
        category = "Seeds & Sowing";
      }

      return {
        answer: `${answer}\n\n*Note: General agricultural guidance. For acute pesticide applications or severe crop disease diagnoses, consult a qualified agronomist or local agricultural extension officer.*`,
        category,
        recommendedProducts: []
      };
    }
  },

  async getHistory(): Promise<AIConversation[]> {
    try {
      const res = await apiClient.get<AIConversation[]>('/ai/history');
      return res.data;
    } catch {
      return [];
    }
  }
};
