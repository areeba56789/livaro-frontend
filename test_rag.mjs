import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI, Type } from '@google/genai';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    key_metrics: {
      type: Type.OBJECT,
      properties: {
        predicted_appreciation_pct: { type: Type.NUMBER },
        estimated_rental_yield_pct: { type: Type.NUMBER },
        avg_price_per_sqft: { type: Type.NUMBER },
        sentiment_score_1_to_10: { type: Type.NUMBER }
      },
      required: ["predicted_appreciation_pct", "estimated_rental_yield_pct", "avg_price_per_sqft", "sentiment_score_1_to_10"]
    },
    why_matrix: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          factor: { type: Type.STRING },
          math_breakdown: { type: Type.STRING },
          confidence_level: { type: Type.STRING },
          sources: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["factor", "math_breakdown", "confidence_level", "sources"]
      }
    },
    chart_data: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          period: { type: Type.STRING },
          value: { type: Type.NUMBER }
        },
        required: ["period", "value"]
      }
    }
  },
  required: ["summary", "key_metrics", "why_matrix", "chart_data"]
};

async function testRAG() {
  const query = "What is the outlook for commercial plots in DHA Phase 6?";
  console.log("Testing API Endpoint logic directly...");

  try {
    const embedResponse = await ai.models.embedContent({
      model: 'gemini-embedding-2',
      contents: query,
      config: {
        outputDimensionality: 768
      }
    });

    const queryVector = embedResponse.embeddings[0].values;
    
    const [propertiesRes, newsRes] = await Promise.all([
      supabase.rpc('match_properties', { query_embedding: queryVector, match_threshold: 0.5, match_count: 5 }),
      supabase.rpc('match_news', { query_embedding: queryVector, match_threshold: 0.5, match_count: 5 })
    ]);

    const properties = propertiesRes.data || [];
    const news = newsRes.data || [];

    let contextStr = "PROPERTIES IN DATABASE:\n";
    properties.forEach((p) => { contextStr += `- ${p.title} | Price: ${p.price} | URL: ${p.url}\n`; });
    contextStr += "\nNEWS UPDATES IN DATABASE:\n";
    news.forEach((n) => { contextStr += `- ${n.title} | Content: ${n.content} | URL: ${n.url}\n`; });

    const systemInstruction = `You are an 'Elite Real Estate Investment Analyst'. You are cold, analytical, and heavily data-driven. You never use fluff or filler words. Weigh current property prices against recent news sentiment to calculate risk and appreciation potential. Base your analysis STRICTLY on the provided context. For the 'why_matrix', you must include exact math (e.g., '(Current Avg X - Previous Avg Y) / Y = Z%'). For 'chart_data', extrapolate granular data (e.g., month-over-month or quarter-over-quarter). Ensure the sentiment score is explicitly scaled from 1 to 10.`;
    const userMessage = `<CONTEXT>\n${contextStr}\n</CONTEXT>\n\nQUERY: ${query}`;

    const genResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: responseSchema
      }
    });

    console.log("=== SUCCESS: 200 OK ===");
    console.log(genResponse.text);

  } catch (err) {
    console.error("=== ERROR: 500 ===");
    console.error(err);
  }
}

testRAG();
