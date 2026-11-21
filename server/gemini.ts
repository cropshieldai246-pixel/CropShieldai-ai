import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { getLanguageInstructionMeta, SupportedLanguage } from './i18n.ts';

const PRIMARY_MODEL = 'gemini-4-hydrogen';
const FALLBACK_MODEL = 'gemini-3.1-flash-lite';

function getClient(lang: SupportedLanguage = 'en'): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    const missingMessages: Record<SupportedLanguage, string> = {
      en: 'Gemini API key is not configured on the server. Please set GEMINI_API_KEY in Settings > Secrets.',
      te: 'సర్వర్‌లో Gemini API కీ కాన్ఫిగర్ చేయబడలేదు. దయచేసి Settings > Secrets లో GEMINI_API_KEY సెట్ చేయండి.',
      hi: 'सर्वर पर Gemini API कुंजी कॉन्फ़िगर नहीं है। कृपया Settings > Secrets में GEMINI_API_KEY सेट करें।',
    };
    throw new GeminiServiceError('MISSING_KEY', missingMessages[lang]);
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: 30000,
      retryOptions: { attempts: 1 },
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export class GeminiServiceError extends Error {
  code: 'MISSING_KEY' | 'INVALID_KEY' | 'QUOTA_EXCEEDED' | 'MODEL_ERROR' | 'BAD_INPUT';
  status: number;
  detail?: string;

  constructor(
    code: GeminiServiceError['code'],
    message: string,
    status = 500,
    detail?: string
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.detail = detail;
  }
}

function mapApiError(err: unknown, lang: SupportedLanguage = 'en'): GeminiServiceError {
  if (err instanceof GeminiServiceError) return err;
  const msg = err instanceof Error ? err.message : String(err);
  const lower = msg.toLowerCase();

  if (lower.includes('api_key_invalid') || lower.includes('permission_denied') || lower.includes('403') || lower.includes('401')) {
    const messages: Record<SupportedLanguage, string> = {
      en: 'The server Gemini API key appears invalid or lacks permission. Please verify GEMINI_API_KEY in Settings > Secrets.',
      te: 'సర్వర్ Gemini API కీ చెల్లనిదిగా లేదా అనుమతి లేనిదిగా ఉంది. దయచేసి Settings > Secrets లో GEMINI_API_KEY తనిఖీ చేయండి.',
      hi: 'सर्वर की Gemini API कुंजी अमान्य प्रतीत होती है या अनुमति नहीं है। कृपया Settings > Secrets में GEMINI_API_KEY जांचें।',
    };
    return new GeminiServiceError('INVALID_KEY', messages[lang], 403, msg.slice(0, 300));
  }
  if (lower.includes('resource_exhausted') || lower.includes('429') || lower.includes('quota')) {
    const messages: Record<SupportedLanguage, string> = {
      en: 'Gemini API request limit reached temporarily. Please wait a moment and try again.',
      te: 'Gemini API అభ్యర్థన పరిమితి తాత్కాలికంగా ముగిసింది. దయచేసి కొద్దిసేపు ఆగి మళ్లీ ప్రయత్నించండి.',
      hi: 'Gemini API अनुरोध सीमा अस्थायी रूप से पूरी हो गई है। कृपया थोड़ी देर प्रतीक्षा करें और पुनः प्रयास करें।',
    };
    return new GeminiServiceError('QUOTA_EXCEEDED', messages[lang], 429, msg.slice(0, 300));
  }
  if (lower.includes('not_found') || lower.includes('404')) {
    const messages: Record<SupportedLanguage, string> = {
      en: 'The configured Gemini AI model could not be found or is no longer supported.',
      te: 'ఎంచుకున్న Gemini AI మోడల్ కనుగొనబడలేదు లేదా ప్రస్తుతం అందుబాటులో లేదు.',
      hi: 'कॉन्फ़िगर किया गया Gemini AI मॉडल नहीं मिला या अब समर्थित नहीं है।',
    };
    return new GeminiServiceError('MODEL_ERROR', messages[lang], 502, msg.slice(0, 300));
  }
  if (lower.includes('503') || lower.includes('unavailable') || lower.includes('high demand')) {
    const messages: Record<SupportedLanguage, string> = {
      en: 'The Gemini AI service is temporarily experiencing high demand (503). Please try again in a few seconds.',
      te: 'Gemini AI సేవపై ప్రస్తుతం తాత్కాలికంగా అధిక రద్దీ ఉంది (503). దయచేసి కొన్ని సెకన్ల తర్వాత మళ్లీ ప్రయత్నించండి.',
      hi: 'Gemini AI सेवा पर अभी अस्थायी रूप से अधिक भार है (503)। कृपया कुछ सेकंड बाद पुनः प्रयास करें।',
    };
    return new GeminiServiceError('MODEL_ERROR', messages[lang], 503, msg.slice(0, 300));
  }
  if (lower.includes('timeout') || lower.includes('aborted')) {
    const messages: Record<SupportedLanguage, string> = {
      en: 'The Gemini AI service took too long to respond (504). Please try again in a moment.',
      te: 'Gemini AI సేవ స్పందించడానికి ఎక్కువ సమయం తీసుకుంది (504). దయచేసి కొద్దిసేపట్లో మళ్లీ ప్రయత్నించండి.',
      hi: 'Gemini AI सेवा से जवाब आने में बहुत समय लगा (504)। कृपया थोड़ी देर में पुनः प्रयास करें।',
    };
    return new GeminiServiceError('MODEL_ERROR', messages[lang], 504, msg.slice(0, 300));
  }
  const fallbackMessages: Record<SupportedLanguage, string> = {
    en: `Unable to complete AI analysis right now: ${msg.slice(0, 220)}`,
    te: `ప్రస్తుతం AI విశ్లేషణ పూర్తి చేయలేకపోయాము: ${msg.slice(0, 180)}`,
    hi: `अभी AI विश्लेषण पूरा नहीं हो सका: ${msg.slice(0, 180)}`,
  };
  return new GeminiServiceError('MODEL_ERROR', fallbackMessages[lang], 502, msg.slice(0, 300));
}

function isTransientHighDemandOrTimeout(err: unknown): boolean {
  if (err instanceof Error && (err.name === 'AbortError' || err.name === 'TimeoutError')) {
    return true;
  }
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  return (
    msg.includes('503') ||
    msg.includes('unavailable') ||
    msg.includes('high demand') ||
    msg.includes('timeout') ||
    msg.includes('aborted') ||
    msg.includes('econnreset') ||
    msg.includes('fetch failed')
  );
}

function logGeminiFailure(modelName: string, stage: string, err: unknown): void {
  const detail = err instanceof Error ? err.message : String(err);
  console.warn(`[CropShield Gemini] ${stage} failed on ${modelName}: ${detail.slice(0, 240)}`);
}

async function runWithModelFallback<T>(
  fn: (modelName: string) => Promise<T>,
  lang: SupportedLanguage = 'en'
): Promise<T> {
  try {
    return await fn(PRIMARY_MODEL);
  } catch (primaryErr) {
    logGeminiFailure(PRIMARY_MODEL, 'primary', primaryErr);
    const mappedPrimary = mapApiError(primaryErr, lang);
    if (mappedPrimary.code === 'MISSING_KEY' || mappedPrimary.code === 'INVALID_KEY' || mappedPrimary.code === 'BAD_INPUT') {
      throw mappedPrimary;
    }

    const backoffMs = [600];
    if (isTransientHighDemandOrTimeout(primaryErr) || mappedPrimary.code === 'QUOTA_EXCEEDED' || mappedPrimary.status === 502) {
      let lastErr: unknown = primaryErr;
      for (let attempt = 0; attempt <= backoffMs.length; attempt++) {
        if (attempt > 0) {
          await new Promise((r) => setTimeout(r, backoffMs[attempt - 1]));
        }
        try {
          return await fn(FALLBACK_MODEL);
        } catch (fallbackErr) {
          logGeminiFailure(FALLBACK_MODEL, `fallback#${attempt + 1}`, fallbackErr);
          lastErr = fallbackErr;
          const mappedFallback = mapApiError(fallbackErr, lang);
          if (mappedFallback.code === 'MISSING_KEY' || mappedFallback.code === 'INVALID_KEY' || mappedFallback.code === 'BAD_INPUT') {
            throw mappedFallback;
          }
          if (!isTransientHighDemandOrTimeout(fallbackErr)) {
            throw mappedFallback;
          }
        }
      }
      throw mapApiError(lastErr, lang);
    }
    throw mappedPrimary;
  }
}

export interface ChatTurn {
  role: 'user' | 'model';
  text: string;
}

export interface FarmerContextSummary {
  state?: string;
  district?: string;
  soilType?: string;
  primaryCrops?: string[];
}

function buildNormalizedHistory(turns: ChatTurn[]): Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> {
  const normalized: Array<{ role: 'user' | 'model'; text: string }> = [];
  for (const turn of turns) {
    const text = turn.text.trim();
    if (!text) continue;
    // Gemini multi-turn chat history should begin with a user turn
    if (normalized.length === 0 && turn.role !== 'user') continue;
    const prev = normalized[normalized.length - 1];
    if (prev && prev.role === turn.role) {
      prev.text = `${prev.text}\n\n${text}`;
    } else {
      normalized.push({ role: turn.role, text });
    }
  }
  // If history ends with a 'user' turn without a matching 'model' reply, drop it so sendMessage supplies the active user turn cleanly
  if (normalized.length > 0 && normalized[normalized.length - 1].role === 'user') {
    normalized.pop();
  }
  return normalized.map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));
}

export async function runFarmingAssistantChat(
  messages: ChatTurn[],
  farmerContext?: FarmerContextSummary,
  language: SupportedLanguage = 'en'
): Promise<string> {
  if (!messages.length) {
    const emptyMsg: Record<SupportedLanguage, string> = {
      en: 'Please enter a farming question.',
      te: 'దయచేసి వ్యవసాయ ప్రశ్నను నమోదు చేయండి.',
      hi: 'कृपया खेती से जुड़ा प्रश्न दर्ज करें।',
    };
    throw new GeminiServiceError('BAD_INPUT', emptyMsg[language], 400);
  }

  const ai = getClient(language);
  const lastTurn = messages[messages.length - 1];
  if (lastTurn.role !== 'user' || !lastTurn.text.trim()) {
    const badLastMsg: Record<SupportedLanguage, string> = {
      en: 'The latest message must be a non-empty farmer question.',
      te: 'చివరి సందేశం ఖాళీగా ఉండకూడదు, దయచేసి ప్రశ్న రాయండి.',
      hi: 'नवीनतम संदेश खाली नहीं होना चाहिए, कृपया प्रश्न लिखें।',
    };
    throw new GeminiServiceError('BAD_INPUT', badLastMsg[language], 400);
  }

  const langMeta = getLanguageInstructionMeta(language);
  const contextLines: string[] = [];
  if (farmerContext?.state || farmerContext?.district) {
    contextLines.push(`Farmer Location: ${[farmerContext.district, farmerContext.state].filter(Boolean).join(', ')}`);
  }
  if (farmerContext?.soilType) {
    contextLines.push(`Farmer Soil Type: ${farmerContext.soilType}`);
  }
  if (farmerContext?.primaryCrops?.length) {
    contextLines.push(`Farmer Primary Crops: ${farmerContext.primaryCrops.join(', ')}`);
  }

  const systemInstruction = [
    'You are CropShield AI Assistant, a friendly, practical agricultural guide helping Indian farmers.',
    `LANGUAGE REQUIREMENT: The farmer has selected ${langMeta.name}. ${langMeta.scriptInstruction}`,
    'You understand farming questions written in English, Telugu (తెలుగు), and Hindi (हिन्दी). Respond naturally in the selected language (and if the farmer writes directly in Telugu or Hindi asking in that language, make sure your reply is completely natural, respectful, and easy to follow in that language).',
    'Keep explanations simple, clear, and beginner-friendly. Avoid complicated scientific terminology—if a technical term is needed, explain it in plain everyday farming words. Use short paragraphs or bullet points so farmers can read easily on mobile screens.',
    'Focus on: farming practices, soil health, organic farming, crop cultivation, irrigation, Indian seasons (Kharif, Rabi, Zaid), and general crop care.',
    'If key context is missing (such as crop name, growth stage, region, soil type, or watering pattern), ask 1 to 2 polite clarifying questions while still giving safe general guidance.',
    'STRICT ACCURACY RULES:',
    '- Never invent fake agricultural statistics, yield percentages, market prices, or chemical pesticide dosages.',
    '- Clearly state uncertainty if symptoms or conditions could have multiple causes.',
    '- Always recommend consulting a local Krishi Vigyan Kendra (KVK), state agricultural extension officer, or certified agronomist before making major chemical treatment, fertilizer, or financial decisions.',
    contextLines.length ? `\nKnown farmer profile context:\n${contextLines.join('\n')}` : '',
  ].join('\n');

  const history = buildNormalizedHistory(messages.slice(0, -1));

  return runWithModelFallback(async (modelName) => {
    const thinkingLevel = modelName === FALLBACK_MODEL ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW;
    const timeoutMs = modelName === PRIMARY_MODEL ? 8500 : 14000;

    const chat = ai.chats.create({
      model: modelName,
      history,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingLevel },
      },
    });

    const response = await chat.sendMessage({
      message: lastTurn.text.trim(),
      config: {
        systemInstruction,
        thinkingConfig: { thinkingLevel },
        abortSignal: AbortSignal.timeout(timeoutMs),
      },
    });
    const text = response.text?.trim();
    if (!text) {
      const emptyReply: Record<SupportedLanguage, string> = {
        en: 'The AI assistant returned an empty response. Please try again.',
        te: 'AI సహాయకుడు ఖాళీ సమాధానం పంపారు. దయచేసి మళ్లీ ప్రయత్నించండి.',
        hi: 'AI सहायक से खाली उत्तर प्राप्त हुआ। कृपया पुनः प्रयास करें।',
      };
      throw new GeminiServiceError('MODEL_ERROR', emptyReply[language], 502);
    }
    return text;
  }, language);
}

export interface LeafAnalysisResult {
  isPlantLeaf: boolean;
  possibleCrop: string;
  visibleSymptoms: string[];
  possibleConditions: Array<{
    name: string;
    likelihoodNote: string;
    explanation: string;
  }>;
  confidenceLevel: 'Low' | 'Moderate' | 'High';
  uncertaintyNotes: string;
  preventivePractices: string[];
  expertRecommendation: string;
}

export async function analyzeCropLeafImage(input: {
  imageBase64: string;
  mimeType: string;
  cropHint?: string;
  notes?: string;
  language?: SupportedLanguage;
}): Promise<LeafAnalysisResult> {
  const lang = input.language ?? 'en';
  const langMeta = getLanguageInstructionMeta(lang);

  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedMimes.includes(input.mimeType)) {
    const badMime: Record<SupportedLanguage, string> = {
      en: 'Please upload a valid JPEG, PNG, or WebP leaf image.',
      te: 'దయచేసి సరైన JPEG, PNG లేదా WebP ఆకు ఫోటోను అప్‌లోడ్ చేయండి.',
      hi: 'कृपया मान्य JPEG, PNG या WebP पत्ते की तस्वीर अपलोड करें।',
    };
    throw new GeminiServiceError('BAD_INPUT', badMime[lang], 400);
  }
  if (!input.imageBase64 || input.imageBase64.length > 11_000_000) {
    const badSize: Record<SupportedLanguage, string> = {
      en: 'Image is missing or exceeds the 8 MB limit.',
      te: 'ఫోటో లేదు లేదా 8 MB పరిమితి కంటే ఎక్కువగా ఉంది.',
      hi: 'तस्वीर मौजूद नहीं है या 8 MB सीमा से अधिक है।',
    };
    throw new GeminiServiceError('BAD_INPUT', badSize[lang], 400);
  }

  const ai = getClient(lang);

  const promptText = [
    'Analyze this uploaded photograph for an Indian farmer using CropShield AI.',
    `OUTPUT LANGUAGE REQUIREMENT: Write ALL descriptive text fields (possibleCrop, visibleSymptoms, possibleConditions.name/likelihoodNote/explanation, uncertaintyNotes, preventivePractices, expertRecommendation) in ${langMeta.name}. ${langMeta.scriptInstruction}`,
    'IMPORTANT: Keep the confidenceLevel field strictly as one of the exact English strings: "Low", "Moderate", or "High".',
    'Keep crop names understandable and accurate (you may include the common English crop name in parentheses if helpful). Avoid dense jargon; explain organic/preventive care and precautions in simple everyday language.',
    input.cropHint ? `Farmer thinks the crop may be: ${input.cropHint}.` : 'The farmer did not specify the crop name.',
    input.notes ? `Farmer notes: ${input.notes}.` : '',
    'Examine the image carefully and objectively:',
    '1. First check if the image actually shows a plant or crop leaf. If not, set isPlantLeaf to false and explain clearly.',
    '2. Provide possible crop identification (mention uncertainty if unclear).',
    '3. List only visible symptoms observable in the photo (spots, concentric rings, yellowing, wilting, curling, powdery patches, etc.).',
    '4. Explain possible diseases, nutrient deficiencies, or pest stresses that can show these visual patterns — frame as possibilities, NEVER as a confirmed laboratory diagnosis.',
    '5. State confidenceLevel ("Low", "Moderate", or "High") and clear uncertaintyNotes (e.g., lighting, leaf angle, overlapping symptoms).',
    '6. Suggest safe, general preventive and organic practices (removing severely affected leaves, avoiding overhead watering, spacing for airflow, crop rotation, neem-based preventive care where appropriate). Do NOT prescribe exact chemical pesticide dosages.',
    '7. Include an explicit expertRecommendation advising the farmer to confirm with a local Krishi Vigyan Kendra (KVK) or agronomist before applying chemical treatments.',
  ].filter(Boolean).join('\n');

  return runWithModelFallback(async (modelName) => {
    const thinkingLevel = modelName === FALLBACK_MODEL ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW;
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: input.mimeType,
              data: input.imageBase64,
            },
          },
          { text: promptText },
        ],
      },
      config: {
        systemInstruction: `You are an agricultural plant health screening assistant. Be honest, cautious, and beginner-friendly. Never claim visual image analysis is a confirmed agricultural diagnosis. Always write user-facing explanations in ${langMeta.name}.`,
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingLevel },
        abortSignal: AbortSignal.timeout(15000),
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isPlantLeaf: {
              type: Type.BOOLEAN,
              description: 'True if the image clearly depicts a plant, leaf, or crop tissue; false otherwise.',
            },
            possibleCrop: {
              type: Type.STRING,
              description: 'Likely crop name or plant type in the requested language, noting uncertainty if hard to confirm.',
            },
            visibleSymptoms: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Objective visual signs seen on the leaf or plant, written in the requested language.',
            },
            possibleConditions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  likelihoodNote: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ['name', 'likelihoodNote', 'explanation'],
              },
              description: 'Possible diseases or stresses that match the visual appearance, explained simply in the requested language.',
            },
            confidenceLevel: {
              type: Type.STRING,
              description: 'Strictly one of: Low, Moderate, High.',
            },
            uncertaintyNotes: {
              type: Type.STRING,
              description: 'Why the visual check has uncertainty or what extra details would help, in the requested language.',
            },
            preventivePractices: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Safe general preventive, organic, and field hygiene steps in the requested language.',
            },
            expertRecommendation: {
              type: Type.STRING,
              description: 'Reminder to consult an agricultural officer or KVK before major treatment, in the requested language.',
            },
          },
          required: [
            'isPlantLeaf',
            'possibleCrop',
            'visibleSymptoms',
            'possibleConditions',
            'confidenceLevel',
            'uncertaintyNotes',
            'preventivePractices',
            'expertRecommendation',
          ],
        },
      },
    });

    const raw = (response.text ?? '{}').trim();
    const parsed = JSON.parse(raw) as LeafAnalysisResult;
    if (!['Low', 'Moderate', 'High'].includes(parsed.confidenceLevel)) {
      parsed.confidenceLevel = 'Moderate';
    }
    return parsed;
  }, lang);
}

export interface CropRecommendationRequest {
  location: string;
  soilType: string;
  soilPh?: string;
  temperatureC: string;
  rainfallMm: string;
  waterAvailability: string;
  season: string;
  isSimulatedData?: boolean;
  language?: SupportedLanguage;
}

export interface CropRecommendationResult {
  recommendations: Array<{
    cropName: string;
    seasonFit: string;
    suitabilitySummary: string;
    whySuitable: string[];
    waterAndSoilNotes: string;
    cautionNote: string;
  }>;
  generalAdvisory: string;
  missingContextNote: string;
}

export async function generateCropRecommendations(
  input: CropRecommendationRequest
): Promise<CropRecommendationResult> {
  const lang = input.language ?? 'en';
  const langMeta = getLanguageInstructionMeta(lang);
  const ai = getClient(lang);

  const prompt = [
    'Suggest 3 to 4 practical crops for an Indian farmer based ONLY on the farmer inputs below:',
    `- Location: ${input.location}`,
    `- Soil Type: ${input.soilType}`,
    `- Soil pH: ${input.soilPh?.trim() ? input.soilPh : 'Not provided (unknown)'}`,
    `- Average Temperature: ${input.temperatureC} °C`,
    `- Expected / Seasonal Rainfall: ${input.rainfallMm} mm`,
    `- Water / Irrigation Availability: ${input.waterAvailability}`,
    `- Farming Season: ${input.season}`,
    input.isSimulatedData ? '- Note: The farmer used sample/simulated regional climate defaults for demonstration.' : '',
    '',
    `OUTPUT LANGUAGE REQUIREMENT: Write ALL fields (cropName, seasonFit, suitabilitySummary, whySuitable, waterAndSoilNotes, cautionNote, generalAdvisory, missingContextNote) in ${langMeta.name}. ${langMeta.scriptInstruction}`,
    'Rules:',
    `- Explain clearly in simple, natural ${langMeta.name} WHY each suggested crop fits the soil, season, temperature, and water availability.`,
    '- Keep crop names accurate and easy to understand (you may include the common English crop name in parentheses alongside the local crop name where helpful).',
    '- Translate farming instructions, organic soil care tips, and precautions clearly without dense jargon.',
    '- Do NOT invent real-time weather forecasts, fake yield guarantees, or unprovided soil NPK numbers.',
    '- If Soil pH was not provided, explicitly note in missingContextNote that a local Soil Health Card test is recommended before final sowing.',
    '- Keep practical cautions honest (e.g. drainage needs, heat sensitivity, or market/storage planning).',
  ].filter(Boolean).join('\n');

  return runWithModelFallback(async (modelName) => {
    const thinkingLevel = modelName === FALLBACK_MODEL ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW;
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: `You are an Indian agronomy advisor. Give grounded, practical, beginner-friendly crop recommendations strictly from the provided parameters without inventing real-time weather or guaranteed profits. Always respond in ${langMeta.name}.`,
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingLevel },
        abortSignal: AbortSignal.timeout(14000),
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  cropName: { type: Type.STRING },
                  seasonFit: { type: Type.STRING },
                  suitabilitySummary: { type: Type.STRING },
                  whySuitable: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  waterAndSoilNotes: { type: Type.STRING },
                  cautionNote: { type: Type.STRING },
                },
                required: [
                  'cropName',
                  'seasonFit',
                  'suitabilitySummary',
                  'whySuitable',
                  'waterAndSoilNotes',
                  'cautionNote',
                ],
              },
            },
            generalAdvisory: { type: Type.STRING },
            missingContextNote: { type: Type.STRING },
          },
          required: ['recommendations', 'generalAdvisory', 'missingContextNote'],
        },
      },
    });

    const raw = (response.text ?? '{}').trim();
    return JSON.parse(raw) as CropRecommendationResult;
  }, lang);
}
