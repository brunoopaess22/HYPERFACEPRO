
import { GoogleGenAI } from "@google/genai";
import { PhotoStyle, BackgroundStyle, HairColor, HairStyle, OutfitStyle, ClothingColor, PoseStyle } from "../types";

const getClient = () => {
  // Fallback to window env if process not available (sometimes happens in certain build envs)
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Check your Netlify settings.");
  }
  return new GoogleGenAI({ apiKey });
};

const base64ToBlob = (base64: string, mimeType: string = 'image/png'): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

const resizeImage = (base64Str: string, maxWidth = 2048): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxWidth || height > maxWidth) {
        if (width > height) {
          height *= maxWidth / width;
          width = maxWidth;
        } else {
          width *= maxWidth / height;
          height = maxWidth;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.95)); 
    };
    img.onerror = () => resolve(base64Str);
  });
};

// --- PROMPT HELPERS ---
const getPoseDescription = (pose: PoseStyle): string => {
  switch (pose) {
    case PoseStyle.AUTO_POSE: return "COMPLETELY NEW POSE selected by AI. DO NOT USE ORIGINAL POSE.";
    default: return `POSE: ${pose}. CHANGE ORIGINAL POSE to this new one.`;
  }
};

const getOutfitDescription = (style: OutfitStyle, color: ClothingColor): string => {
  const colorTxt = color !== ClothingColor.DEFAULT ? `Color: ${color}` : "Color: Matching style";
  return `OUTFIT: ${style} (${colorTxt}). MUST REPLACE ORIGINAL CLOTHES COMPLETELY.`;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateProfessionalHeadshot = async (
  base64Image: string,
  photoStyle: PhotoStyle,
  backgroundStyle: BackgroundStyle,
  outfit: OutfitStyle,
  clothingColor: ClothingColor,
  hairColor: HairColor,
  hairStyle: HairStyle,
  poseStyle: PoseStyle,
  extraSharpness: boolean
): Promise<string> => {
  const ai = getClient();
  
  // Optimization: Resize if too big
  let processedImage = base64Image;
  if (base64Image.length > 800000) {
      processedImage = await resizeImage(base64Image);
  }
  const cleanBase64 = processedImage.replace(/^data:image\/(png|jpeg|jpg|webp|heic);base64,/, "");
  
  const promptText = `
SYSTEM: HYPERFACE PRO V12 GENERATOR

TASK:
Generate a Photorealistic 16K image of the person(s) in the input image.
You must DETECT ALL FACES and recreate them with high fidelity.

CRITICAL INSTRUCTIONS (STRICT):
1. IDENTITY: Keep face features identical (eyes, nose, mouth structure).
2. POSE: CHANGE POSE COMPLETELY. Do NOT use the original pose. 
   Target Pose: ${getPoseDescription(poseStyle)}
3. CLOTHES: CHANGE CLOTHES COMPLETELY. Do NOT use original clothes.
   Target Outfit: ${getOutfitDescription(outfit, clothingColor)}
4. BACKGROUND: CHANGE BACKGROUND COMPLETELY.
   Target Background: ${backgroundStyle}
5. STYLE: ${photoStyle}
6. HAIR: Color ${hairColor}, Style ${hairStyle}.

OUTPUT:
- 16K Resolution look.
- No deformities.
- If multiple people, dress and pose ALL of them according to the style.
`;

  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: cleanBase64, mimeType: 'image/jpeg' } },
            { text: promptText },
          ],
        },
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const blob = base64ToBlob(part.inlineData.data, 'image/png');
            return URL.createObjectURL(blob);
          }
        }
      }
      throw new Error("A IA não retornou imagem válida.");

    } catch (error: any) {
      attempts++;
      console.warn(`Attempt ${attempts} failed:`, error);

      let waitTime = 5000 * Math.pow(2, attempts - 1); // Exponential backoff
      
      // Smart Retry-After parsing
      const msg = error.message || '';
      if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
        const match = msg.match(/retry in ([\d\.]+)s/);
        if (match && match[1]) {
            waitTime = (parseFloat(match[1]) * 1000) + 1000;
        }
        if (attempts === maxAttempts) throw new Error("Servidor sobrecarregado (429). Tente novamente em 1 minuto.");
      } else {
        // If it's not a rate limit (e.g. 500 or bad request), maybe don't retry as many times? 
        // For now we retry to be safe.
        if (attempts === maxAttempts) throw error;
      }

      console.log(`Retrying in ${waitTime}ms...`);
      await delay(waitTime);
    }
  }
  throw new Error("Falha na geração após múltiplas tentativas.");
};
