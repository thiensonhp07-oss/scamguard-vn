import { GoogleGenAI, GenerateContentParameters, GenerateContentResponse } from '@google/genai';

let geminiClient: GoogleGenAI | null = null;

// Primary and fallback models according to latest Gemini API guidelines
export const GEMINI_MODEL = 'gemini-3.7-flash';
export const FALLBACK_MODELS = ['gemini-3.1-flash-lite'];

// Cooldown tracker when quota / 429 / 503 rate limits occur
let quotaExhaustedUntil: number = 0;

export function getGemini(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ GEMINI_API_KEY environment variable is not set. Using local deterministic fallback engine.');
    }
    geminiClient = new GoogleGenAI({
      apiKey: apiKey || 'dummy-key',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

export function isGeminiQuotaPaused(): boolean {
  return Date.now() < quotaExhaustedUntil;
}

/**
 * Helper to check if an error is a temporary 503 / 429 / overload issue
 */
function isTemporaryServiceError(err: any): boolean {
  const errMsg = String(err?.message || err || '').toLowerCase();
  const errCode = err?.code || err?.status;
  return (
    errMsg.includes('503') ||
    errMsg.includes('429') ||
    errMsg.includes('unavailable') ||
    errMsg.includes('resource_exhausted') ||
    errMsg.includes('high demand') ||
    errMsg.includes('quota exceeded') ||
    errCode === 503 ||
    errCode === 429
  );
}

/**
 * Execute Gemini content generation with multi-model fallback and rate-limit / 503 safety.
 */
export async function executeGeminiWithFallback(
  params: Omit<GenerateContentParameters, 'model'> & { preferredModel?: string }
): Promise<GenerateContentResponse | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  // If in temporary rate-limit cooldown, skip directly to deterministic engine to prevent lag
  if (isGeminiQuotaPaused()) {
    return null;
  }

  const ai = getGemini();
  const modelsToTry = [
    params.preferredModel || GEMINI_MODEL,
    ...FALLBACK_MODELS.filter((m) => m !== (params.preferredModel || GEMINI_MODEL)),
  ];

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        ...params,
        model,
      });
      return response;
    } catch (err: any) {
      if (isTemporaryServiceError(err)) {
        console.warn(`Model ${model} unavailable or under high demand (503/429). Switching to next fallback model...`);
        // Briefly pause if all models might be hit
        quotaExhaustedUntil = Date.now() + 5000;
        continue;
      } else {
        console.warn(`Gemini generation skipped on ${model}:`, err?.message || err);
      }
    }
  }

  return null;
}
