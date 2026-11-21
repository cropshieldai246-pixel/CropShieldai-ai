import { getStoredLanguage } from '../i18n/LanguageContext';
import { AppLanguage } from '../types';

export class ApiError extends Error {
  status: number;
  code?: string;
  detail?: string;

  constructor(message: string, status: number, code?: string, detail?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.detail = detail;
  }
}

const CLIENT_ERROR_MESSAGES: Record<
  AppLanguage,
  {
    timeout: string;
    network: (reason: string) => string;
    gateway: (status: number) => string;
    unavailable503: string;
    invalidResponse: string;
    serverStatus: (status: number) => string;
  }
> = {
  en: {
    timeout: 'The request timed out while waiting for the CropShield AI server. Please try again.',
    network: (reason) =>
      `Network error while contacting the CropShield AI server${reason}. Please check your connection and try again.`,
    gateway: (status) =>
      `Upstream AI gateway error (${status}). The server took too long or lost connection while waiting for Gemini.`,
    unavailable503: 'The AI service is temporarily unavailable (503). Please try again in a few seconds.',
    invalidResponse: 'Received an unexpected non-JSON response from the server. Please refresh and try again.',
    serverStatus: (status) => `Server error (${status})`,
  },
  te: {
    timeout: 'CropShield AI సర్వర్ నుండి సమాధానం రావడానికి సమయం మించిపోయింది. దయచేసి మళ్లీ ప్రయత్నించండి.',
    network: (reason) =>
      `CropShield AI సర్వర్‌ను సంప్రదించడంలో నెట్‌వర్క్ లోపం జరిగింది${reason}. దయచేసి మీ ఇంటర్నెట్ కనెక్షన్ తనిఖీ చేసి మళ్లీ ప్రయత్నించండి.`,
    gateway: (status) =>
      `AI గేట్‌వే లోపం (${status}). Gemini నుండి సమాధానం కోసం సర్వర్ ఎక్కువ సమయం వేచి ఉంది.`,
    unavailable503: 'AI సేవ తాత్కాలికంగా అందుబాటులో లేదు (503). దయచేసి కొన్ని సెకన్ల తర్వాత మళ్లీ ప్రయత్నించండి.',
    invalidResponse: 'సర్వర్ నుండి ఊహించని ప్రతిస్పందన వచ్చింది. దయచేసి రిఫ్రెష్ చేసి మళ్లీ ప్రయత్నించండి.',
    serverStatus: (status) => `సర్వర్ లోపం (${status})`,
  },
  hi: {
    timeout: 'CropShield AI सर्वर से जवाब मिलने में समय समाप्त हो गया। कृपया पुनः प्रयास करें।',
    network: (reason) =>
      `CropShield AI सर्वर से संपर्क करने में नेटवर्क त्रुटि हुई${reason}। कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।`,
    gateway: (status) =>
      `अपस्ट्रीम AI गेटवे त्रुटि (${status})। Gemini से जवाब आने में अधिक समय लगा या कनेक्शन टूट गया।`,
    unavailable503: 'AI सेवा अस्थायी रूप से अनुपलब्ध है (503)। कृपया कुछ सेकंड बाद पुनः प्रयास करें।',
    invalidResponse: 'सर्वर से अमान्य प्रतिक्रिया प्राप्त हुई। कृपया रीफ़्रेश करके पुनः प्रयास करें।',
    serverStatus: (status) => `सर्वर त्रुटि (${status})`,
  },
};

export async function apiRequest<T>(
  path: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    token?: string | null;
    body?: unknown;
    timeoutMs?: number;
    language?: AppLanguage;
  } = {}
): Promise<T> {
  const activeLang = options.language ?? getStoredLanguage();
  const msgs = CLIENT_ERROR_MESSAGES[activeLang];

  const headers: Record<string, string> = {
    'X-CropShield-Lang': activeLang,
  };
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  let response: Response;
  try {
    response = await fetch(path, {
      method: options.method ?? 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: options.timeoutMs ? AbortSignal.timeout(options.timeoutMs) : undefined,
    });
  } catch (err) {
    const isTimeout =
      err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError');
    if (isTimeout) {
      throw new ApiError(msgs.timeout, 504, 'CLIENT_TIMEOUT');
    }
    const reason = err instanceof Error && err.message ? ` (${err.message})` : '';
    throw new ApiError(msgs.network(reason), 0, 'NETWORK_ERROR');
  }

  const rawText = await response.text();
  let data: unknown = null;
  let parsedJson = false;
  if (rawText.trim().length > 0) {
    try {
      data = JSON.parse(rawText);
      parsedJson = true;
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errObj = (parsedJson && data && typeof data === 'object'
      ? data
      : null) as { error?: string; code?: string; detail?: string } | null;

    let fallbackMsg = msgs.serverStatus(response.status);
    if (response.status === 502 || response.status === 504) {
      fallbackMsg = msgs.gateway(response.status);
    } else if (response.status === 503) {
      fallbackMsg = msgs.unavailable503;
    } else if (!parsedJson && rawText.trim() && !rawText.trim().startsWith('<')) {
      fallbackMsg = `${msgs.serverStatus(response.status)}: ${rawText.trim().slice(0, 180)}`;
    }

    throw new ApiError(
      errObj?.error || fallbackMsg,
      response.status,
      errObj?.code,
      errObj?.detail
    );
  }

  if (!parsedJson || data === null || typeof data !== 'object') {
    throw new ApiError(msgs.invalidResponse, response.status || 502, 'INVALID_RESPONSE');
  }

  return data as T;
}
