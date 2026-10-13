import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sprout, 
  Sparkles, 
  AlertCircle, 
  BookOpen, 
  CheckCircle2, 
  User, 
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { aiService } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { Link } from 'react-router-dom';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  category?: string;
  timestamp: string;
  recommendedProductIds?: string[];
}

const SAMPLE_PROMPT_CHIPS = [
  "How should I prepare black soil for Rabi wheat sowing?",
  "What are the best organic fertilizers for tomato blight?",
  "Compare drip irrigation vs sprinkler irrigation water savings",
  "How to identify certified Basmati paddy seed purity?",
  "Explain NPK ratio requirements for vegetable crops",
];

export const AiAssistantPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { products } = useProducts();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Namaste! I am your HarvestHub AI Agriculture Assistant.\n\nI can help you with crop sowing schedules, soil conditioning, irrigation management, organic pest repellents, and fertilizer best practices.\n\nHow can I support your farming or harvest today?",
      category: 'General Agronomy',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (questionText?: string) => {
    const textToSend = (questionText || inputText).trim();
    if (!textToSend || loading) return;

    const userMsgId = `msg-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await aiService.askQuestion(textToSend, {
        userRole: currentUser?.role,
      });

      // Match products in catalog if recommended
      let matchedIds: string[] = [];
      const lower = textToSend.toLowerCase();
      if (lower.includes('wheat') || lower.includes('seed')) {
        matchedIds.push('prod-1', 'prod-2');
      } else if (lower.includes('fertilizer') || lower.includes('compost')) {
        matchedIds.push('prod-3');
      } else if (lower.includes('irrigation') || lower.includes('drip')) {
        matchedIds.push('prod-4');
      } else if (lower.includes('pest') || lower.includes('spray') || lower.includes('neem')) {
        matchedIds.push('prod-5', 'prod-10');
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.answer,
        category: response.category || 'Agricultural Guidance',
        timestamp: new Date().toISOString(),
        recommendedProductIds: matchedIds.slice(0, 2),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: "I experienced a temporary communication hiccup. General Agronomy Rule: Always test soil pH (optimal 6.5–7.5 for most cereal crops) and verify seed certification tag numbers before field application.",
          category: 'Error Fallback',
          timestamp: new Date().toISOString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>HarvestHub Agronomy Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              AI Agriculture Assistant
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Ask questions on soil health, seed germination, organic bio-pesticides, and precision irrigation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              24/7 Crop Expert Ready
            </span>
          </div>
        </div>

        {/* Notice Disclaimer Banner */}
        <div className="mb-6 p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold">Agronomic Advisory Notice:</span> The assistant provides general educational guidelines and catalog product suggestions. For acute crop disease outbreaks or high-hazard chemical applications, consult your local Krishi Vigyan Kendra (KVK) or licensed extension officer.
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm flex flex-col h-[650px] overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Bot className="w-4 h-4 text-emerald-100" />
                  </div>
                )}

                <div className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-800 text-white rounded-tr-none'
                    : 'bg-stone-50 border border-stone-200/80 text-stone-800 rounded-tl-none space-y-2'
                }`}>
                  {msg.category && msg.sender === 'ai' && (
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md mb-1">
                      {msg.category}
                    </span>
                  )}

                  <div className="whitespace-pre-line">
                    {msg.text}
                  </div>

                  {/* Recommended Products if any */}
                  {msg.recommendedProductIds && msg.recommendedProductIds.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-stone-200/80">
                      <p className="text-[11px] font-bold text-stone-700 mb-2 flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3 text-emerald-600" />
                        <span>Recommended from HarvestHub Marketplace:</span>
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.recommendedProductIds.map(pid => {
                          const prod = products.find(p => p.id === pid);
                          if (!prod) return null;
                          return (
                            <Link
                              key={prod.id}
                              to={`/products/${prod.id}`}
                              className="p-2 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 flex items-center gap-2 group transition-colors"
                            >
                              <img src={prod.imageUrl} alt={prod.name} className="w-10 h-10 rounded-lg object-cover" />
                              <div className="min-w-0 flex-1">
                                <span className="font-bold text-stone-900 group-hover:text-emerald-700 block truncate text-xs">{prod.name}</span>
                                <span className="text-[10px] text-emerald-800 font-semibold">₹{prod.price} / {prod.unit}</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <span className={`block text-[10px] mt-1 ${msg.sender === 'user' ? 'text-emerald-200 text-right' : 'text-stone-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-stone-800 text-white flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-center text-xs text-stone-500">
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-xs text-stone-600 ml-1">Consulting agricultural knowledge base...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Prompt chips suggestions */}
          <div className="px-4 py-2 border-t border-stone-100 bg-stone-50/50 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-bold text-stone-400 shrink-0">Quick Topics:</span>
            {SAMPLE_PROMPT_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(chip)}
                className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-[11px] font-semibold text-stone-700 hover:text-emerald-800 hover:border-emerald-300 hover:bg-emerald-50 whitespace-nowrap transition-colors shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white border-t border-stone-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about crop varieties, organic fertilizers, drip kits, or disease prevention..."
                disabled={loading}
                className="flex-1 text-xs sm:text-sm p-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-hidden transition-all placeholder:text-stone-400"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || loading}
                className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors disabled:opacity-40 flex items-center gap-1.5"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
