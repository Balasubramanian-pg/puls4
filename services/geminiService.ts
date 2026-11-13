import { GoogleGenAI } from "@google/genai";

const getApiKey = (): string => {
  const viteEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  if (viteEnv?.VITE_GEMINI_API_KEY) {
    return viteEnv.VITE_GEMINI_API_KEY;
  }
  if (typeof process !== 'undefined' && process.env?.API_KEY) {
    return process.env.API_KEY;
  }
  return '';
};

export const generateResponse = async (
  prompt: string, 
  imageBase64?: string
): Promise<string> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return "Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your environment.";
    }
    const ai = new GoogleGenAI({ apiKey });
    const modelId = 'gemini-3-pro-preview';
    
    // Construct parts
    const parts: any[] = [];
    
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg', // Assuming jpeg for simplicity, or detect
          data: imageBase64,
        },
      });
    }
    
    parts.push({ text: prompt });

    // Using thinking mode for complex reasoning
    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts },
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        // maxOutputTokens: Not setting this as per "Thinking Mode" instruction when budget is set high
      }
    });

    return response.text || "I processed that, but couldn't generate a text response.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error connecting to the AI service. Please check your connection or API key.";
  }
};