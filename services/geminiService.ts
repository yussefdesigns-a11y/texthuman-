
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, HumanizedResult } from "../types";

// دالة مساعدة لإنشاء العميل لضمان استخدام أحدث مفتاح API دائماً
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeMessage = async (text: string): Promise<AnalysisResult> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Deeply analyze the following text for AI vs Human markers. 
    Evaluate:
    1. Sentence-level analysis: Identify exactly which parts sound machine-like.
    2. Linguistic Complexity: Richness of vocabulary and structural variety.
    3. Metrics: Perplexity (randomness) and Burstiness (variance).
    4. Word Frequency: Top 5 recurring non-trivial words.
    
    Text:
    "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          humanPercentage: { type: Type.NUMBER },
          aiPercentage: { type: Type.NUMBER },
          perplexity: {
            type: Type.OBJECT,
            properties: {
              value: { type: Type.NUMBER },
              status: { type: Type.STRING }
            }
          },
          burstiness: {
            type: Type.OBJECT,
            properties: {
              value: { type: Type.NUMBER },
              status: { type: Type.STRING }
            }
          },
          readability: {
            type: Type.OBJECT,
            properties: {
              value: { type: Type.NUMBER },
              status: { type: Type.STRING }
            }
          },
          complexity: {
            type: Type.OBJECT,
            properties: {
              vocabularyRichness: { type: Type.NUMBER },
              structuralVariety: { type: Type.NUMBER },
              gradeLevel: { type: Type.STRING }
            }
          },
          wordFrequency: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                count: { type: Type.NUMBER }
              }
            }
          },
          verdict: { type: Type.STRING },
          verdictDescription: { type: Type.STRING },
          sentences: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                aiLikelihood: { type: Type.NUMBER },
                reason: { type: Type.STRING }
              }
            }
          }
        },
        required: ["humanPercentage", "aiPercentage", "perplexity", "burstiness", "readability", "complexity", "wordFrequency", "verdict", "verdictDescription", "sentences"]
      }
    }
  });

  const result = JSON.parse(response.text || '{}');
  return {
    ...result,
    wordCount: text.trim().split(/\s+/).length,
    charCount: text.length
  };
};

export const humanizeMessage = async (text: string, tone: string): Promise<HumanizedResult> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `HUMANIZATION PROTOCOL: Rewrite the following text to sound authentically human, professional, and engaging. 
    Target Tone: ${tone}
    
    Guidelines:
    1. Eliminate AI markers: overly formal phrasing, repetitive structures, generic transitions.
    2. Enhance emotional nuance and professional voice.
    3. Improve sentence variance and "burstiness".
    4. Maintain the original core message and facts.
    
    Text:
    "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          humanizationScore: { type: Type.NUMBER },
          improvements: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                icon: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            }
          }
        },
        required: ["text", "humanizationScore", "improvements"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
