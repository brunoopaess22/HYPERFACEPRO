
import { GoogleGenAI } from "@google/genai";
import { PhotoStyle, BackgroundStyle, HairColor, HairStyle, OutfitStyle, ClothingColor, PoseStyle } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
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

// Helper to handle high-res images by resizing them client-side before sending to AI
// Handles files up to 40MB+ input by compressing to decent resolution for API
const resizeImage = (base64Str: string, maxWidth = 2048): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      
      // Keep aspect ratio but limit max dimension
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
      // High quality JPEG 0.95
      resolve(canvas.toDataURL('image/jpeg', 0.95)); 
    };
    img.onerror = () => {
       // Fallback if image fails to load (unlikely if base64 is valid)
       resolve(base64Str);
    };
  });
};

const getPoseDescription = (pose: PoseStyle): string => {
  switch (pose) {
    case PoseStyle.AUTO_POSE: return "AUTO POSE: AI GENERATES A COMPLETELY NEW POSE. NEVER USE ORIGINAL POSE.";
    case PoseStyle.ARMS_CROSSED: return "ARMS CROSSED: Confident authority pose, standing straight, arms folded across chest.";
    case PoseStyle.HANDS_IN_POCKET: return "HANDS IN POCKET: Casual but professional, relaxed standing pose, one or both hands in pockets.";
    case PoseStyle.CONFIDENT_STANDING: return "CONFIDENT STANDING: Power pose, straight posture, shoulders back, engaging eye contact.";
    case PoseStyle.SITTING_PROFESSIONAL: return "SITTING: Sitting comfortably on a chair/sofa/gamer chair, hands on lap or armrest, professional demeanor.";
    case PoseStyle.HEADSHOT_CLOSEUP: return "HEADSHOT CLOSE-UP: Focus strictly on head and shoulders, blurred background, intense eye contact.";
    case PoseStyle.HANDS_ON_WAIST: return "HANDS ON WAIST: Power pose, confident, elbows out, standing.";
    case PoseStyle.SIDE_PROFILE: return "SIDE PROFILE: Looking slightly away or at the horizon, artistic profile view.";
    case PoseStyle.WALKING_STREET: return "WALKING: Caught in motion, walking towards or across camera, dynamic movement.";
    case PoseStyle.LEANING_WALL: return "LEANING: Leaning casually against a wall or desk, relaxed but business-ready.";
    case PoseStyle.MODEL_POSE: return "FASHION MODEL POSE: Artistic, angular, high-fashion stance suitable for a runway or magazine.";
    case PoseStyle.GAMER_SITTING: return "GAMER SITTING: Sitting in a pro gaming chair, relaxed, hands near keyboard/mouse area.";
    case PoseStyle.ACTION_LIGHT: return "ACTION LIGHT: Walking or looking sideways, natural movement.";
    default: return "Professional natural pose (New Pose).";
  }
};

const getOutfitDescription = (style: OutfitStyle, color: ClothingColor): string => {
  const colorDesc = color !== ClothingColor.DEFAULT ? `COLOR: ${color} (Must be this color).` : "COLOR: Auto-selected to match style.";
  
  let styleDesc = "";
  switch (style) {
    case OutfitStyle.AUTO_PREMIUM: styleDesc = "AUTO PREMIUM: AI selects the BEST realistic outfit. MUST CHANGE ORIGINAL CLOTHES."; break;
    case OutfitStyle.CASUAL_PREMIUM: styleDesc = "Casual Premium: High-quality fitted t-shirt, denim jacket, or polo. Relaxed but expensive look."; break;
    case OutfitStyle.SOCIAL_PREMIUM: styleDesc = "Social Executive: Tailored luxury suit, crisp shirt, professional business attire."; break;
    case OutfitStyle.THEMATIC_CEO: styleDesc = "CEO/Business Leader: Power suit, expensive watch hint, authoritative style."; break;
    case OutfitStyle.LUXURY_FASHION: styleDesc = "LUXURY FASHION: High-end designer clothing, Gucci/Prada aesthetic, expensive fabric."; break;
    case OutfitStyle.CLASS_A_LUXURY: styleDesc = "CLASS A LUXURY: Old money aesthetic, cashmere, silk, understated wealth."; break;
    case OutfitStyle.FASHION_RUNWAY: styleDesc = "Fashion Runway: Avant-garde, haute couture, runway model look."; break;
    case OutfitStyle.RED_CARPET: styleDesc = "Red Carpet / Gala: Tuxedo or evening gown, celebrity style."; break;
    case OutfitStyle.FITNESS_MODEL: styleDesc = "Fitness Model: Tight dry-fit athletic wear, showing physique (if applicable), gym aesthetic."; break;
    case OutfitStyle.GAMER_PRO: styleDesc = "GAMER PRO 16K: Futuristic techwear, hoodie, high-end headset, e-sports jersey."; break;
    case OutfitStyle.MILITARY_TACTICAL: styleDesc = "MILITARY TACTICAL: Special forces gear, tactical vest, cargo pants, realistic combat fit."; break;
    case OutfitStyle.FUTURISTIC: styleDesc = "FUTURISTIC: Cyberpunk style, sleek materials, metallic accents, advanced techwear."; break;
    case OutfitStyle.FANTASY: styleDesc = "Fantasy/Cosplay: Epic armor or magical robes, cinematic quality."; break;
    case OutfitStyle.GOTHIC_STYLE: styleDesc = "GOTHIC STYLE: Dark aesthetics, leather, lace, black textures, modern goth."; break;
    case OutfitStyle.WHITE_SHIRT: styleDesc = "Classic White Shirt: Crisp white button-down shirt, open collar, professional yet relaxed."; break;
    case OutfitStyle.JEANS_LOOK: styleDesc = "Jeans Look: High-quality denim jacket or shirt, realistic fabric texture."; break;
    case OutfitStyle.ELEGANT_GALA: styleDesc = "Elegant Gala: Silk evening gown or tuxedo, fine textures, sophisticated."; break;
    case OutfitStyle.STREETWEAR: styleDesc = "Urban Streetwear: Trendy layers, bomber jacket, designer hoodie, hypebeast style."; break;
    case OutfitStyle.SUMMER_BEACH: styleDesc = "Summer/Beach: Light linen shirt, swimwear or summer dress, airy fabrics."; break;
    case OutfitStyle.WINTER_COAT: styleDesc = "Winter Fashion: Heavy wool coat, realistic fur trim, layered sweater."; break;
    case OutfitStyle.GLAMOUR_PARTY: styleDesc = "Glamour Party: Sequins, velvet, high-fashion night out look."; break;
    case OutfitStyle.FASHION_EDITORIAL: styleDesc = "Fashion Editorial: Avant-garde cuts, high-fashion styling, Vogue aesthetic."; break;
    case OutfitStyle.MINIMALIST: styleDesc = "Minimalist Clean: Solid colors, high-quality basics, old money aesthetic."; break;
    case OutfitStyle.TRAVEL_OUTFIT: styleDesc = "Travel Outfit: Comfortable but stylish travel wear, backpack or accessories."; break;
    case OutfitStyle.URBAN_REAL: styleDesc = "Urban Real: City casual, leather jacket or stylish overcoat."; break;
    case OutfitStyle.BIKER_STYLE: styleDesc = "Biker/Motoqueiro: Leather jacket, tough look, motorcycle club aesthetic."; break;
    default: styleDesc = "High-quality realistic clothing."; break;
  }
  return `${styleDesc} ${colorDesc}`;
};

const getBackgroundDescription = (style: BackgroundStyle): string => {
  switch (style) {
    case BackgroundStyle.AUTO_PREMIUM: return "AUTO PREMIUM: AI selects the PERFECT realistic background that fits the subject.";
    case BackgroundStyle.REAL_MUSTANG_SHELBY: return "MUSTANG SHELBY GT500: The subject is INSIDE/DRIVING a Mustang Shelby GT500. View of steering wheel with Cobra logo, leather dashboard. Realistic car interior.";
    case BackgroundStyle.SUPERCAR_GARAGE: return "SUPERCAR GARAGE: High-end garage with Ferraris and Lamborghinis in background. Professional lighting.";
    case BackgroundStyle.SPORTS_CARS_PREMIUM: return "PREMIUM SPORTS CARS: Showroom with luxury sports cars. High-end automotive lighting.";
    case BackgroundStyle.GAMER_ELITE: return "GAMER ELITE SETUP: Ultimate pro gamer room, excessive RGB lighting, multiple 8K monitors, Nanoleaf panels on walls.";
    case BackgroundStyle.GAMER_ROOM: return "GAMER ROOM: Subject sitting in a pro GAMER CHAIR, RGB lights background, ultrawide monitors.";
    case BackgroundStyle.HACKER_ENV: return "HACKER ENVIRONMENT: Dark room, multiple screens with code, matrix green or cyber blue lighting.";
    case BackgroundStyle.OFFICE_CORP: return "CORPORATE OFFICE: Modern glass office, city view in background, professional lighting.";
    case BackgroundStyle.BANK_VAULT: return "BANK VAULT: Inside a luxury bank vault, metal safety deposit boxes, cinematic lighting.";
    case BackgroundStyle.GLASS_FACADE: return "GLASS FACADE: Outside a modern skyscraper, reflective glass, urban business district.";
    case BackgroundStyle.DESIGN_MINIMAL: return "MINIMAL DESIGN: Clean architectural space, concrete or white walls, artistic shadow.";
    case BackgroundStyle.SOLID_COLOR: return "SOLID COLOR STUDIO: A vibrant solid color background typical of high-end editorial shoots.";
    case BackgroundStyle.LUXURY_LIVING: return "LUXURY LIVING ROOM: Expensive furniture, modern design, warm lighting, 16K textures.";
    case BackgroundStyle.LUXURY_PENTHOUSE: return "LUXURY PENTHOUSE: Top floor city view, floor-to-ceiling windows, modern luxury interior.";
    case BackgroundStyle.WHITE_STUDIO: return "WHITE STUDIO: Pure white infinity background, professional studio strobe lighting.";
    case BackgroundStyle.BLACK_STUDIO: return "BLACK STUDIO: Pitch black background, dramatic rim lighting, mysterious vibe.";
    case BackgroundStyle.REAL_BEACH: return "REAL BEACH: 16K texture sand, ocean waves, natural sunlight (Photorealistic, NOT drawing).";
    case BackgroundStyle.SUNNY_FIELD: return "SUNNY FIELD: Open green field, flowers, bright natural sunlight, blue sky.";
    case BackgroundStyle.NIGHT_STREET: return "NIGHT URBAN STREET: City lights, bokeh, wet asphalt, cinematic night mood.";
    case BackgroundStyle.REAL_GYM: return "REAL GYM: Professional fitness center, gym equipment in background, industrial lighting.";
    case BackgroundStyle.PRO_BLUR: return "PROFESSIONAL BLUR: Creamy bokeh background, undefined location, focus purely on subject.";
    case BackgroundStyle.AESTHETICS_CLINIC: return "AESTHETICS CLINIC: Clean, bright, dermatology/beauty clinic vibe, white and pastel tones.";
    case BackgroundStyle.MANSION_LUXURY: return "LUXURY MANSION: Marble floors, high ceilings, expensive chandelier, millionaire lifestyle.";
    case BackgroundStyle.REAL_CINEMA: return "REAL CINEMA: Movie theater environment or cinematic set, dramatic mood.";
    case BackgroundStyle.TIKTOK_STUDIO: return "TIKTOK STUDIO: RGB ring lights, colorful backdrop, content creator setup.";
    case BackgroundStyle.CYBERPUNK_CITY: return "CYBERPUNK CITY: Neon signs, rain, futuristic skyscrapers, high-tech atmosphere.";
    case BackgroundStyle.REAL_FOREST: return "REAL FOREST: Deep forest, sunlight filtering through trees, nature vibe.";
    case BackgroundStyle.MODERN_APARTMENT: return "Modern Apartment: Luxury interior, depth of field, realistic furniture.";
    case BackgroundStyle.REAL_POOL: return "Real Pool: Crystal clear water, sunny day, luxury resort vibe.";
    case BackgroundStyle.REAL_SUNSET: return "Real Sunset: Golden hour, cinematic lighting, sun flare.";
    case BackgroundStyle.REAL_GARDEN: return "Real Garden: Detailed plants, natural lighting, outdoor vibe.";
    case BackgroundStyle.JAPANESE_GARDEN: return "Japanese Garden: Cherry blossoms, zen stones, peaceful water feature, nature.";
    case BackgroundStyle.REAL_MOUNTAIN: return "Real Mountain: Epic landscape, rocks, snow or forest in background.";
    case BackgroundStyle.MODERN_CAFE: return "Modern Cafe: Coffee shop interior, warm lighting, blurred background.";
    case BackgroundStyle.REAL_LIBRARY: return "Real Library: Bookshelves, quiet atmosphere, academic vibe.";
    case BackgroundStyle.LUXURY_CAR: return "Luxury Car Interior: Leather seats, dashboard details, car window view.";
    case BackgroundStyle.PRO_GREY: return "Pro Grey: Professional solid grey background for headshots.";
    case BackgroundStyle.URBAN_OUTDOOR: return "Urban Outdoor: City street during day, modern architecture, clean sidewalk.";
    default: return style;
  }
}

const getPhotoStyleDescription = (style: PhotoStyle): string => {
  switch (style) {
    case PhotoStyle.HYPERFACE_ULTRA_2_0: return "HYPERFACE ULTRA 2.0: The Definitive 16K Hyper-Realistic Engine. Zero artifacts. Perfect identity.";
    case PhotoStyle.INSTAGRAM_PRO: return "INSTAGRAM PRO: Warm tones, natural skin, clean aesthetic, perfect for Reels/social media.";
    case PhotoStyle.CELEBRITY_LOOK: return "CELEBRITY LOOK: High-end paparazzi or red carpet style. Glossy skin, star quality lighting.";
    case PhotoStyle.MODEL_TRANSFORM: return "MODEL TRANSFORM: High-fashion posing, sharp jawline emphasis, runway aesthetic.";
    case PhotoStyle.MAGAZINE_PORTRAIT: return "MAGAZINE PORTRAIT: Vogue/GQ Cover style. Bold texturing, perfect color grading.";
    case PhotoStyle.BUSINESS_CARD: return "BUSINESS CARD: Trustworthy, clean, approachable professional headshot. Perfect lighting.";
    case PhotoStyle.CV_PREMIUM: return "CV PREMIUM: Solid background, sharp suit, hiring-manager approved aesthetic.";
    case PhotoStyle.COUPLE_PERFECT: return "COUPLE PERFECT: Harmonious lighting for two people, romantic or powerful duo vibe.";
    case PhotoStyle.FAMILY_MATCHING: return "FAMILY MATCHING: Coordinated outfits, balanced group lighting, happy and cohesive.";
    case PhotoStyle.GAMER_ELITE_SETUP: return "GAMER ELITE SETUP: Focus on the high-tech setup, neon reflections on face, intense focus.";
    case PhotoStyle.SPORTS_CAR_PREMIUM: return "SPORTS CAR PREMIUM: Focus on automotive lifestyle, leather, metal, sunlight reflections.";
    case PhotoStyle.GAMER_ULTRA_RGB: return "GAMER RGB 16K: Vibrant neon lighting, high contrast, streamer aesthetic, sharp details, cyber atmosphere.";
    case PhotoStyle.ULTRA_REALISTIC_16K: return "16K ULTRA REALISM: Maximum sharpness, physical lighting (PBR), micro-texture on skin, flawless photorealism.";
    case PhotoStyle.HDR_PLUS_CINEMA: return "HDR+ CINEMA: High dynamic range, rich colors, deep shadows, movie poster quality.";
    case PhotoStyle.STUDIO_PREMIUM: return "STUDIO PREMIUM 16K: Commercial photography lighting, softbox reflections, clean and crisp.";
    case PhotoStyle.INFLUENCER_REAL: return "INFLUENCER REAL: Ring light, social media optimized, bright and clear, lifestyle vibe.";
    case PhotoStyle.BEACH_REAL: return "BEACH REALISM: Natural sunlight, harsh shadows, summer vibes, wet skin texture.";
    case PhotoStyle.NIGHT_URBAN: return "NIGHT URBAN: Bokeh city lights, neon reflections, night photography, ISO noise texture (subtle).";
    case PhotoStyle.PARTY_NEON: return "PARTY NEON: Club lighting, vibrant colors, energetic atmosphere.";
    case PhotoStyle.OFFICE_EXEC: return "OFFICE EXECUTIVE: Corporate environment, confident lighting, sharp focus.";
    case PhotoStyle.VINTAGE_REAL: return "VINTAGE REALISTIC: Analog film grain (subtle), classic color palette, nostalgic but sharp.";
    case PhotoStyle.FUTURISTIC_REAL: return "FUTURISTIC REALISM: Sci-fi elements, clean lines, modern lighting, high-tech vibe.";
    case PhotoStyle.FULL_BODY_REAL: return "FULL BODY REALISM: Accurate proportions, realistic posture, full outfit detail, 16K.";
    case PhotoStyle.OPEN_WORLD: return "OPEN WORLD STYLE: GTA/Cyberpunk aesthetic but photorealistic. Vibrant colors, crisp edges.";
    case PhotoStyle.CYBORG_REAL: return "CYBORG REALISM: Subtle mechanical enhancements, glowing eyes option, futuristic skin texture.";
    case PhotoStyle.MILLIONAIRE_LUXURY: return "MILLIONAIRE LUXURY: Old money aesthetic, expensive textures, golden hour lighting.";
    case PhotoStyle.MOVIE_POSTER: return "MOVIE POSTER: Dramatic lighting, high contrast, heroic composition, blockbuster look.";
    default: return "Ultra Realistic Professional Photography.";
  }
}

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
  
  let processedImage = base64Image;
  // Resize large images to ensure processing speed and stability
  if (base64Image.length > 800000) { // Approx 800KB threshold for resizing logic check
      processedImage = await resizeImage(base64Image);
  }
  const cleanBase64 = processedImage.replace(/^data:image\/(png|jpeg|jpg|webp|heic);base64,/, "");
  
  const outfitDesc = getOutfitDescription(outfit, clothingColor);
  const bgDesc = getBackgroundDescription(backgroundStyle);
  const styleDesc = getPhotoStyleDescription(photoStyle);
  const poseDesc = getPoseDescription(poseStyle);

  // Optimized prompt to save tokens while maintaining instructions
  const promptText = `
CORE HYPERFACE PRO V12

OBJETIVO:
Gerar fotos novas de 1+ pessoas com:
- mudança de roupas, pose e cenário
- fidelidade do rosto
- estilo ultra realista 16K
- zero deformações

DETECÇÃO:
- Identificar todos os rostos
- Recriar cada pessoa com fidelidade (rosto, pele, cabelo)
- Aplicar roupas e poses novas para todos

REGRAS:
- NÃO mudar cor dos olhos ou formato do rosto
- MANTER características físicas
- TROCAR ROUPA COMPLETAMENTE
- TROCAR CENÁRIO COMPLETAMENTE
- NOVA POSE OBRIGATÓRIA

CONFIGURAÇÃO:
ESTILO: ${styleDesc}
ROUPA: ${outfitDesc}
CENÁRIO: ${bgDesc}
POSE: ${poseDesc}
CABELO: ${hairColor} / ${hairStyle}
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
            const url = URL.createObjectURL(blob);
            return url;
          }
        }
      }
      
      throw new Error("A IA não conseguiu processar a imagem. Tente uma foto diferente.");

    } catch (error: any) {
      attempts++;
      console.error(`Gemini Generation Attempt ${attempts} failed:`, error);

      let isRateLimit = false;
      let retryAfter = 0;

      // Check for 429 or RESOURCE_EXHAUSTED in various ways
      if (error.status === 429 || error.code === 429) isRateLimit = true;
      
      const msg = error.message || '';
      if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429') || msg.includes('quota')) {
          isRateLimit = true;
      }

      // Try to parse "Please retry in X s" from the message string
      const match = msg.match(/retry in ([\d\.]+)s/);
      if (match && match[1]) {
          retryAfter = parseFloat(match[1]) * 1000;
      }

      // Check structured details from the error object if available
      if (error.details && Array.isArray(error.details)) {
          const retryInfo = error.details.find((d: any) => d['@type']?.includes('RetryInfo'));
          if (retryInfo?.retryDelay) {
              const s = parseFloat(retryInfo.retryDelay.replace('s', ''));
              if (!isNaN(s)) retryAfter = s * 1000;
          }
      }

      if (isRateLimit && attempts < maxAttempts) {
        // Calculate wait time: Use server suggestion or exponential backoff
        // If server says 59s, we wait 59s + 1s buffer.
        let waitTime = retryAfter > 0 ? retryAfter + 1000 : (5000 * Math.pow(2, attempts - 1));
        
        // Safety cap to avoid waiting forever (max 70s)
        if (waitTime > 70000) waitTime = 70000;

        console.warn(`Rate limit hit. Retrying in ${waitTime}ms...`);
        await delay(waitTime);
        continue;
      }
      
      if (attempts === maxAttempts) {
        if (isRateLimit) {
          throw new Error("O servidor está com alta demanda (Cota excedida). Tente novamente em 1 minuto.");
        }
        throw error;
      }
      throw error;
    }
  }
  throw new Error("Erro desconhecido ao gerar imagem.");
};
