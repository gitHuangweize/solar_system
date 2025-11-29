import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPlanetFunFact = async (planetName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Give me a short, fascinating scientific fact (under 60 words) about the planet ${planetName} in Simplified Chinese. Focus on something unique like its weather, composition, or history. Do not use markdown formatting like bolding.`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error fetching planet fact:", error);
    return "暂时无法获取该星球的更多信息。";
  }
};
