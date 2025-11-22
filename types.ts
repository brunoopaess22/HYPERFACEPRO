
export enum AppView {
  WELCOME = 'WELCOME',
  UPLOAD = 'UPLOAD',
  CUSTOMIZE = 'CUSTOMIZE',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT',
  PROFILE = 'PROFILE'
}

export interface User {
  id: string;
  name: string;
  isGuest?: boolean;
}

export interface GeneratedPhoto {
  id: string;
  originalUrl: string;
  resultUrl: string;
  date: string;
  style: PhotoStyle;
}

export enum ClothingColor {
  DEFAULT = '🎨 Cor Padrão do Estilo',
  BLACK = 'Preto',
  WHITE = 'Branco',
  BLUE = 'Azul Marinho',
  RED = 'Vermelho',
  PINK = 'Rosa Choque',
  ROSE = 'Rosê / Pastel',
  BROWN = 'Marrom / Terra',
  GREY = 'Cinza',
  GREEN = 'Verde Militar',
  BEIGE = 'Bege / Creme',
  PURPLE = 'Roxo',
  JEANS_DENIM = 'Jeans / Denim Azul',
  METALLIC_SILVER = 'Metálico Prata',
  METALLIC_GOLD = 'Metálico Dourado'
}

export enum HairColor {
  KEEP_ORIGINAL = 'Manter Cor Original',
  BLACK = 'Preto',
  DARK_BROWN = 'Castanho Escuro',
  BROWN_NATURAL = 'Marrom Natural',
  LIGHT_BROWN = 'Castanho Claro',
  BLONDE = 'Loiro',
  HONEY_BLONDE = 'Loiro Mel',
  PLATINUM = 'Loiro Platinado / Branco',
  RED = 'Ruivo',
  GREY = 'Cinza / Grisalho',
  HIGHLIGHTS = 'Mechas Naturais'
}

export enum HairStyle {
  KEEP_ORIGINAL = 'Manter Penteado Original',
  AUTO_HAIR = '✨ IA Decide Melhor Cabelo',
  STRAIGHT = 'Liso (Alisado)',
  WAVY = 'Ondulado Natural',
  CURLY = 'Cacheado Definido',
  VOLUME_UP = 'Mais Volume',
  VOLUME_DOWN = 'Menos Volume',
  TIDY = 'Penteado e Alinhado'
}

export enum PoseStyle {
  AUTO_POSE = '✨ IA Decide (Nova Pose)',
  ARMS_CROSSED = 'Braços Cruzados (Autoridade)',
  HANDS_IN_POCKET = 'Mãos no Bolso (Casual)',
  CONFIDENT_STANDING = 'Em Pé / Confidente',
  SITTING_PROFESSIONAL = 'Sentado (Poltrona/Cadeira)',
  HEADSHOT_CLOSEUP = 'Close-up (Foco no Rosto)',
  HANDS_ON_WAIST = 'Mãos na Cintura (Poder)',
  SIDE_PROFILE = 'Perfil / Olhando Horizonte',
  WALKING_STREET = 'Caminhando (Movimento)',
  LEANING_WALL = 'Encostado na Parede/Mesa',
  MODEL_POSE = 'Pose de Modelo Fashion',
  GAMER_SITTING = 'Sentado Cadeira Gamer',
  ACTION_LIGHT = 'Ação Leve (Andar/Olhar lado)'
}

export enum OutfitStyle {
  AUTO_PREMIUM = '✨ Look Automático (IA Decide)',
  CASUAL_PREMIUM = 'Casual Premium',
  SOCIAL_PREMIUM = 'Social Executivo',
  THEMATIC_CEO = '💼 CEO / Business Leader',
  LUXURY_FASHION = '💎 Luxo / Fashion Week',
  CLASS_A_LUXURY = '💎 Classe A / Luxo',
  FASHION_RUNWAY = '👠 Fashion Runway / Modelo',
  RED_CARPET = '🏆 Red Carpet / Gala Temático',
  FITNESS_MODEL = '💪 Esportivo / Fitness Model',
  GAMER_PRO = '🎮 Gamer Pro / Techwear',
  STREETWEAR = 'Urbano Streetwear',
  MILITARY_TACTICAL = '🪖 Militar / Tático',
  FUTURISTIC = '🚀 Futurista / Cyber',
  FANTASY = '🧚 Fantasia / Cosplay Pro',
  GOTHIC_STYLE = '🖤 Gótica / Dark',
  WHITE_SHIRT = 'Camisa Social Branca',
  JEANS_LOOK = 'Look Jeans / Denim',
  ELEGANT_GALA = 'Elegante / Gala',
  SUMMER_BEACH = 'Verão / Praia Real',
  WINTER_COAT = 'Inverno / Casaco',
  GLAMOUR_PARTY = 'Festa / Glamour',
  FASHION_EDITORIAL = 'Editorial de Moda',
  MINIMALIST = 'Clean Minimalista',
  TRAVEL_OUTFIT = 'Look de Viagem',
  URBAN_REAL = 'Look Urbano Real',
  BIKER_STYLE = '🏍️ Motoqueiro / Biker'
}

// Aesthetic / Camera / Lighting Style
export enum PhotoStyle {
  HYPERFACE_ULTRA_2_0 = '⚡ HYPERFACE PRO V12 (Oficial)',
  AUTO_DECIDE = '✨ IA Decide (Melhor Estilo)',
  CELEBRITY_LOOK = '🌟 Foto de Celebridade',
  MODEL_TRANSFORM = '📸 Transformar em Modelo',
  MAGAZINE_PORTRAIT = '📰 Retrato de Revista',
  BUSINESS_CARD = '📇 Cartão de Visita Profissional',
  CV_PREMIUM = '📄 Foto de Currículo Premium',
  COUPLE_PERFECT = '💕 Casal - Foto Perfeita',
  FAMILY_MATCHING = '👨‍👩‍👧‍👦 Família - Estilos Combinando',
  GAMER_ELITE_SETUP = '🎮 Gamer Elite Setup',
  SPORTS_CAR_PREMIUM = '🏎️ Carros Esportivos – Premium Edition',
  GAMER_ULTRA_RGB = '🎮 Gamer Ultra Realista RGB',
  ULTRA_REALISTIC_16K = '16K ULTRA REALISM (Padrão)',
  HDR_PLUS_CINEMA = 'HDR+ Cinema',
  STUDIO_PREMIUM = 'Estúdio Premium 16K',
  INFLUENCER_REAL = 'Influencer / Instagram',
  BEACH_REAL = 'Ultra Realista Praia',
  NIGHT_URBAN = 'Ultra Realista Noturno Urbano',
  PARTY_NEON = 'Ultra Realista Festa / Neon',
  OFFICE_EXEC = 'Ultra Realista Escritório Executivo',
  VINTAGE_REAL = 'Vintage Realista',
  FUTURISTIC_REAL = 'Futurista Realista',
  FULL_BODY_REAL = 'Corpo Inteiro Ultra Realista',
  OPEN_WORLD = '🌍 Estilo Mundo Aberto / GTA',
  CYBORG_REAL = '🤖 Ciborgue Realista',
  MILLIONAIRE_LUXURY = '💸 Milionário / Luxo',
  MOVIE_POSTER = '🎬 Poster de Filme'
}

// Physical Background Location
export enum BackgroundStyle {
  AUTO_PREMIUM = '✨ Cenário Automático (IA Decide)',
  REAL_MUSTANG_SHELBY = '🏎️ Mustang Shelby GT500 (Dirigindo)',
  SUPERCAR_GARAGE = '🏎️ Garagem de Supercarros (Ferrari/Lambo)',
  SPORTS_CARS_PREMIUM = '🏎️ Coleção de Carros Esportivos',
  GAMER_ELITE = '🎮 Gamer Elite Setup (RGB Ultra)',
  GAMER_ROOM = '🎮 Quarto Gamer (RGB/Cadeira Gamer)',
  HACKER_ENV = '💻 Ambiente Hacker / Cyber',
  OFFICE_CORP = '🏢 Escritório Corporativo Premium',
  MANSION_LUXURY = '🏰 Mansão de Luxo Moderna',
  LUXURY_PENTHOUSE = '🏙️ Cobertura de Luxo (Noite)',
  BANK_VAULT = '💰 Cofre Empresarial / Luxo',
  GLASS_FACADE = '🏙️ Fachada de Vidro Empresarial',
  DESIGN_MINIMAL = '🎨 Sala de Design Minimalista',
  SOLID_COLOR = '🎨 Fundo Colorido Sólido (Estúdio)',
  LUXURY_LIVING = '🛋️ Sala de Luxo',
  WHITE_STUDIO = '📸 Estúdio Branco Profissional',
  BLACK_STUDIO = '🖤 Estúdio Preto Dramático',
  REAL_BEACH = '🏖️ Praia Realista (Pôr do Sol)',
  SUNNY_FIELD = '🌻 Campo Ensolarado',
  JAPANESE_GARDEN = '🌸 Jardim Japonês Realista',
  NIGHT_STREET = '🌃 Rua Urbana à Noite',
  REAL_GYM = '💪 Academia Fitness Alto Padrão',
  PRO_BLUR = '💧 Fundo Esfumado Profissional',
  AESTHETICS_CLINIC = '✨ Estética / Dermatologia',
  REAL_CINEMA = '🎬 Cinema / Sala de Filme',
  TIKTOK_STUDIO = '📱 Estúdio TikTok / Instagram',
  CYBERPUNK_CITY = '🌆 Cidade Cyberpunk Neon',
  REAL_FOREST = '🌲 Floresta Profunda Realista',
  MODERN_APARTMENT = 'Apartamento Moderno Minimalista',
  REAL_POOL = 'Piscina Real',
  REAL_SUNSET = 'Pôr do Sol Real',
  REAL_GARDEN = 'Jardim Real',
  REAL_MOUNTAIN = 'Montanha Real',
  MODERN_CAFE = 'Café Moderno',
  REAL_LIBRARY = 'Biblioteca Real',
  LUXURY_CAR = 'Carro de Luxo (Genérico)',
  PRO_GREY = 'Fundo Neutro Cinza Profissional'
}

export interface GenerationOptions {
  image: string;
  photoStyle: PhotoStyle;
  backgroundStyle: BackgroundStyle;
  outfit: OutfitStyle;
  clothingColor: ClothingColor;
  hairColor: HairColor;
  hairStyle: HairStyle;
  poseStyle: PoseStyle;
  extraSharpness: boolean;
}
