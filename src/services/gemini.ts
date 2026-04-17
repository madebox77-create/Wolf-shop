import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateProductImages = async (productName: string, description: string) => {
  try {
    const prompt = `Generate 4 high-quality, professional product images for a brand called "Wolf". 
    The product is: ${productName}. 
    Description: ${description}. 
    The style should be premium, bold, and modern, with a dark aesthetic (black, red, zinc). 
    Focus on clean lines and luxury feel.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    const images: string[] = [];
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64Data = part.inlineData.data;
        images.push(`data:image/png;base64,${base64Data}`);
      }
    }

    // If no images were generated (fallback), return placeholders
    if (images.length === 0) {
      return [
        `https://picsum.photos/seed/${productName}-1/800/800`,
        `https://picsum.photos/seed/${productName}-2/800/800`,
        `https://picsum.photos/seed/${productName}-3/800/800`,
        `https://picsum.photos/seed/${productName}-4/800/800`,
      ];
    }

    return images;
  } catch (error) {
    console.error("Error generating images:", error);
    // Fallback to placeholders
    return [
      `https://picsum.photos/seed/${productName}-1/800/800`,
      `https://picsum.photos/seed/${productName}-2/800/800`,
      `https://picsum.photos/seed/${productName}-3/800/800`,
      `https://picsum.photos/seed/${productName}-4/800/800`,
    ];
  }
};
