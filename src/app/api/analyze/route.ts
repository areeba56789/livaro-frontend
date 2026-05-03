import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI, Type, Schema } from '@google/genai';

// Setup Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Setup Gemini
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const responseSchema: Schema = {
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required', status: 400 }, { status: 400 });
    }

    // 1. Generate Query Embedding
    const embedResponse = await ai.models.embedContent({
      model: 'gemini-embedding-2',
      contents: query,
      config: {
        outputDimensionality: 768
      }
    });

    const queryVector = embedResponse.embeddings[0].values;

    if (!queryVector) {
      return NextResponse.json({ error: 'Failed to generate embedding', status: 500 }, { status: 500 });
    }

    // 2. Query Supabase using RPCs
    const [propertiesRes, newsRes] = await Promise.all([
      supabase.rpc('match_properties', {
        query_embedding: queryVector,
        match_threshold: 0.5,
        match_count: 5
      }),
      supabase.rpc('match_news', {
        query_embedding: queryVector,
        match_threshold: 0.5,
        match_count: 5
      })
    ]);

    if (propertiesRes.error) {
        console.error("Supabase properties error:", propertiesRes.error);
        throw new Error("Failed to query properties from database");
    }
    if (newsRes.error) {
        console.error("Supabase news error:", newsRes.error);
        throw new Error("Failed to query news from database");
    }

    const properties = propertiesRes.data || [];
    const news = newsRes.data || [];

    // 3. Assemble Context
    let contextStr = "PROPERTIES IN DATABASE:\n";
    properties.forEach((p: any) => {
      contextStr += `- ${p.title} | Price: ${p.price} | URL: ${p.url}\n`;
    });

    contextStr += "\nNEWS UPDATES IN DATABASE:\n";
    news.forEach((n: any) => {
      contextStr += `- ${n.title} | Content: ${n.content} | URL: ${n.url}\n`;
    });

    const systemInstruction = `You are an 'Elite Real Estate Investment Analyst'. You are cold, analytical, and heavily data-driven. You never use fluff or filler words. Weigh current property prices against recent news sentiment to calculate risk and appreciation potential. Base your analysis STRICTLY on the provided context. For the 'why_matrix', you must include exact math (e.g., '(Current Avg X - Previous Avg Y) / Y = Z%'). For 'chart_data', extrapolate granular data (e.g., month-over-month or quarter-over-quarter). Ensure the sentiment score is explicitly scaled from 1 to 10.`;

    const userMessage = `<CONTEXT>\n${contextStr}\n</CONTEXT>\n\nQUERY: ${query}`;

    // 4. Generate Analysis Report via Gemini 2.5 Flash
    const genResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: responseSchema
      }
    });

    const textOutput = genResponse.text;
    if (!textOutput) {
        return NextResponse.json({ error: 'Failed to generate content', status: 500 }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(textOutput));

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ 
        error: error.message || 'Internal Server Error', 
        status: 500 
    }, { status: 500 });
  }
}
