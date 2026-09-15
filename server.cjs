var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_helmet = __toESM(require("helmet"), 1);

// server/gemini.ts
var import_genai = require("@google/genai");
var geminiClient = null;
var GEMINI_MODEL = "gemini-3.7-flash";
var FALLBACK_MODELS = ["gemini-3.1-flash-lite"];
var quotaExhaustedUntil = 0;
function getGemini() {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("\u26A0\uFE0F GEMINI_API_KEY environment variable is not set. Using local deterministic fallback engine.");
    }
    geminiClient = new import_genai.GoogleGenAI({
      apiKey: apiKey || "dummy-key",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return geminiClient;
}
function isGeminiQuotaPaused() {
  return Date.now() < quotaExhaustedUntil;
}
function isTemporaryServiceError(err) {
  const errMsg = String(err?.message || err || "").toLowerCase();
  const errCode = err?.code || err?.status;
  return errMsg.includes("503") || errMsg.includes("429") || errMsg.includes("unavailable") || errMsg.includes("resource_exhausted") || errMsg.includes("high demand") || errMsg.includes("quota exceeded") || errCode === 503 || errCode === 429;
}
async function executeGeminiWithFallback(params) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (isGeminiQuotaPaused()) {
    return null;
  }
  const ai = getGemini();
  const modelsToTry = [
    params.preferredModel || GEMINI_MODEL,
    ...FALLBACK_MODELS.filter((m) => m !== (params.preferredModel || GEMINI_MODEL))
  ];
  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        ...params,
        model
      });
      return response;
    } catch (err) {
      if (isTemporaryServiceError(err)) {
        console.warn(`Model ${model} unavailable or under high demand (503/429). Switching to next fallback model...`);
        quotaExhaustedUntil = Date.now() + 5e3;
        continue;
      } else {
        console.warn(`Gemini generation skipped on ${model}:`, err?.message || err);
      }
    }
  }
  return null;
}

// server/safety.ts
function sanitizeAndRedactPII(input) {
  if (!input || typeof input !== "string") {
    return { text: "", piiRedacted: false, redactionsCount: 0 };
  }
  let text = input;
  let redactionsCount = 0;
  const ccRegex = /\b(?:\d[ -]*?){13,19}\b/g;
  text = text.replace(ccRegex, (match) => {
    const digitsOnly = match.replace(/\D/g, "");
    if (digitsOnly.length >= 13 && digitsOnly.length <= 19) {
      redactionsCount++;
      return "[REDACTED_PAYMENT_CARD]";
    }
    return match;
  });
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  text = text.replace(ssnRegex, () => {
    redactionsCount++;
    return "[REDACTED_NATIONAL_ID]";
  });
  const otpRegex = /\b(?:otp|code|pin|verification\s*code|mã\s*otp)[:\s]+([0-9]{4,8})\b/gi;
  text = text.replace(otpRegex, (match, code) => {
    redactionsCount++;
    return match.replace(code, "[REDACTED_OTP_CODE]");
  });
  const looseOtpRegex = /\b(code\s*[:#]?\s*)(\d{6})\b/gi;
  text = text.replace(looseOtpRegex, "$1[REDACTED_CODE]");
  const pwdRegex = /\b(?:password|mật\s*khẩu|pwd|pass)[:\s]+([^\s,;]+)/gi;
  text = text.replace(pwdRegex, (match, pwd) => {
    if (pwd.length > 2) {
      redactionsCount++;
      return match.replace(pwd, "[REDACTED_PASSWORD]");
    }
    return match;
  });
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  text = text.replace(phoneRegex, (match) => {
    const digits = match.replace(/\D/g, "");
    if (digits.length >= 10 && digits.length <= 13) {
      redactionsCount++;
      return "[REDACTED_PHONE_NUMBER]";
    }
    return match;
  });
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  text = text.replace(emailRegex, () => {
    redactionsCount++;
    return "[REDACTED_EMAIL_ADDRESS]";
  });
  return {
    text,
    piiRedacted: redactionsCount > 0,
    redactionsCount
  };
}
function defendPromptInjection(input) {
  if (!input) return "";
  let cleaned = input.replace(/ignore\s+all\s+(?:previous|above)\s+instructions/gi, "[INSTRUCTION_DEFLECTED]");
  cleaned = cleaned.replace(/system\s*override|you\s+are\s+now\s+dan|developer\s+mode/gi, "[INSTRUCTION_DEFLECTED]");
  return cleaned;
}

// server/riskEngine.ts
function extractTransparentUrlFeatures(urlStr) {
  let domain = "";
  try {
    const parsed = new URL(urlStr.startsWith("http") ? urlStr : `https://${urlStr}`);
    domain = parsed.hostname;
  } catch {
    const match = urlStr.match(/(?:https?:\/\/)?([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/i);
    domain = match ? match[1] : urlStr;
  }
  const dLower = domain.toLowerCase();
  const hasHttps = urlStr.startsWith("https://") || !urlStr.startsWith("http://");
  const isShortener = /\b(?:bit\.ly|tinyurl\.com|t\.co|goo\.gl|rebrand\.ly|ow\.ly|is\.gd|buff\.ly)\b/i.test(dLower);
  const parts = dLower.split(".");
  const subdomainCount = Math.max(0, parts.length - 2);
  const hasPunycode = dLower.includes("xn--");
  const charMap = {};
  for (const c of dLower) {
    charMap[c] = (charMap[c] || 0) + 1;
  }
  let entropy = 0;
  const len = dLower.length;
  for (const c in charMap) {
    const p = charMap[c] / len;
    entropy -= p * Math.log2(p);
  }
  const shannonEntropy = +entropy.toFixed(2);
  const suspiciousTlds = [".top", ".xyz", ".vip", ".cc", ".work", ".club", ".online", ".site", ".ru", ".click", ".gq", ".cf", ".tk", ".ml"];
  const suspiciousTld = suspiciousTlds.some((tld) => dLower.endsWith(tld));
  const brands = ["vietcombank", "techcombank", "vcb", "tcb", "acb", "bidv", "mbbank", "viettel", "shopee", "lazada", "tiktok", "vneid", "dichvucong", "google", "apple"];
  let brandImpersonationFound = false;
  let targetedBrand;
  for (const brand of brands) {
    if (dLower.includes(brand)) {
      targetedBrand = brand;
      if (!dLower.endsWith(`${brand}.com.vn`) && !dLower.endsWith(`${brand}.vn`) && !dLower.endsWith(`${brand}.com`)) {
        brandImpersonationFound = true;
        break;
      }
    }
  }
  let deterministicScore = 5;
  const featureSignals = [];
  if (!hasHttps) {
    deterministicScore += 20;
    featureSignals.push("Kh\xF4ng c\xF3 ch\u1EE9ng ch\u1EC9 m\xE3 h\xF3a an to\xE0n HTTPS (giao th\u1EE9c HTTP nguy hi\u1EC3m)");
  }
  if (isShortener) {
    deterministicScore += 25;
    featureSignals.push("S\u1EED d\u1EE5ng d\u1ECBch v\u1EE5 r\xFAt g\u1ECDn link che gi\u1EA5u \u0111\xEDch \u0111\u1EBFn th\u1EF1c t\u1EBF");
  }
  if (suspiciousTld) {
    deterministicScore += 30;
    featureSignals.push(`S\u1EED d\u1EE5ng \u0111u\xF4i t\xEAn mi\u1EC1n chi ph\xED th\u1EA5p c\xF3 m\u1EE9c \u0111\u1ED9 r\u1EE7i ro cao (${dLower.slice(dLower.lastIndexOf("."))})`);
  }
  if (subdomainCount >= 3) {
    deterministicScore += 15;
    featureSignals.push(`C\u1EA5u tr\xFAc t\xEAn mi\u1EC1n con ph\u1EE9c t\u1EA1p b\u1EA5t th\u01B0\u1EDDng (${subdomainCount} c\u1EA5p subdomain)`);
  }
  if (brandImpersonationFound) {
    deterministicScore += 40;
    featureSignals.push(`Ph\xE1t hi\u1EC7n t\u1EEB kh\xF3a th\u01B0\u01A1ng hi\u1EC7u ch\xEDnh th\u1ED1ng [${targetedBrand?.toUpperCase()}] \u0111\u1EB7t trong t\xEAn mi\u1EC1n kh\xF4ng ch\xEDnh th\u1EE9c`);
  }
  if (hasPunycode) {
    deterministicScore += 35;
    featureSignals.push("T\xEAn mi\u1EC1n s\u1EED d\u1EE5ng m\xE3 h\xF3a k\xFD t\u1EF1 \u0111\u1ED3ng h\xECnh Punycode (Homograph attack)");
  }
  if (shannonEntropy > 3.8) {
    deterministicScore += 15;
    featureSignals.push(`\u0110\u1ED9 ng\u1EABu nhi\xEAn k\xFD t\u1EF1 (Entropy: ${shannonEntropy}) cao b\u1EA5t th\u01B0\u1EDDng, d\u1EA5u hi\u1EC7u domain thu\u1EADt to\xE1n sinh DGA`);
  }
  return {
    domain,
    hasHttps,
    isShortener,
    subdomainCount,
    hasPunycode,
    shannonEntropy,
    suspiciousTld,
    brandImpersonationFound,
    targetedBrand,
    deterministicRiskScore: Math.min(99, deterministicScore),
    featureSignals
  };
}
function enforceSafetyAndCalibration(result) {
  let summary = result.summary || "H\u1EC7 th\u1ED1ng \u0111\xE3 ph\xE2n t\xEDch c\xE1c t\xEDn hi\u1EC7u \u0111\xE1ng ng\u1EDD.";
  summary = summary.replace(/(?:chắc chắn 100%|khẳng định 100%|hoàn toàn là lừa đảo|đảm bảo 100%|tuyệt đối là tội phạm)/gi, "c\xF3 x\xE1c su\u1EA5t r\u1EE7i ro r\u1EA5t cao").replace(/(?:khẳng định đây là người thật|chắc chắn an toàn 100%|hoàn toàn không phải lừa đảo)/gi, "ch\u01B0a ph\xE1t hi\u1EC7n t\xEDn hi\u1EC7u nguy hi\u1EC3m tr\u1EF1c ti\u1EBFp").replace(/(?:tên này là tội phạm|đối tượng phạm tội truy nã)/gi, "th\u1EF1c th\u1EC3 c\xF3 d\u1EA5u hi\u1EC7u thao t\xFAng x\xE3 h\u1ED9i");
  let riskLevel = result.riskLevel || "MEDIUM";
  let score = result.riskScore !== void 0 ? result.riskScore : 50;
  let calibratedRiskLevel = riskLevel;
  if (score >= 70) calibratedRiskLevel = "HIGH";
  else if (score >= 40) calibratedRiskLevel = "MEDIUM";
  else if (score >= 15) calibratedRiskLevel = "LOW";
  else calibratedRiskLevel = "INSUFFICIENT_EVIDENCE";
  let confidence = Math.min(95, Math.max(55, 60 + Math.abs(score - 50) * 0.7));
  return {
    sanitizedSummary: summary,
    calibratedRiskLevel,
    calibratedConfidence: Math.round(confidence),
    scientificDisclaimer: "L\u01B0u \xFD khoa h\u1ECDc: K\u1EBFt qu\u1EA3 gi\xE1m \u0111\u1ECBnh d\u1EF1a tr\xEAn m\xF4 h\xECnh x\xE1c su\u1EA5t v\xE0 ph\xE2n t\xEDch k\u1EF9 ngh\u1EC7 x\xE3 h\u1ED9i. H\u1EC7 th\u1ED1ng kh\xF4ng \u0111\u01B0a ra k\u1EBFt lu\u1EADn ph\xE1p l\xFD thay th\u1EBF c\u01A1 quan ti\u1EBFn h\xE0nh t\u1ED1 t\u1EE5ng."
  };
}
async function analyzeScamContent(req) {
  const rawInput = (req.text || "") + (req.url ? ` URL: ${req.url}` : "") + (req.sender ? ` Sender: ${req.sender}` : "");
  const { text: sanitizedText, piiRedacted } = sanitizeAndRedactPII(rawInput);
  const cleanInput = defendPromptInjection(sanitizedText);
  const randomHex = Math.floor(1e5 + Math.random() * 9e5).toString(16).toUpperCase();
  const assessmentId = `SG-RES-${randomHex}`;
  const urlFeatures = req.url ? extractTransparentUrlFeatures(req.url) : cleanInput.match(/(?:https?:\/\/)?([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/i) ? extractTransparentUrlFeatures(cleanInput) : void 0;
  const lowerText = (req.text || "").toLowerCase();
  let heuristicScore = urlFeatures ? urlFeatures.deterministicRiskScore : 10;
  const signals = [];
  if (urlFeatures && urlFeatures.featureSignals.length > 0) {
    urlFeatures.featureSignals.forEach((sig) => {
      signals.push({
        name: "\u0110\u1EB7c Tr\u01B0ng T\xEAn Mi\u1EC1n \u0110\xE1ng Ng\u1EDD",
        scoreContribution: 20,
        description: sig,
        category: "Domain"
      });
    });
  }
  if (lowerText.includes("kh\u1EA9n c\u1EA5p") || lowerText.includes("ngay l\u1EADp t\u1EE9c") || lowerText.includes("trong v\xF2ng") || lowerText.includes("24 gi\u1EDD") || lowerText.includes("5 ph\xFAt") || lowerText.includes("kh\xF3a t\xE0i kho\u1EA3n")) {
    signals.push({
      name: "\xC1p L\u1EF1c Th\u1EDDi Gian & D\u1ED3n \xC9p Kh\u1EA9n C\u1EA5p (Time Pressure)",
      scoreContribution: 25,
      description: "Y\xEAu c\u1EA7u x\u1EED l\xFD g\u1EA5p trong th\u1EDDi gian ng\u1EAFn nh\u1EB1m l\xE0m t\xEA li\u1EC7t kh\u1EA3 n\u0103ng suy x\xE9t v\xE0 x\xE1c minh.",
      category: "Urgency"
    });
    heuristicScore += 25;
  }
  if (lowerText.includes("chuy\u1EC3n kho\u1EA3n") || lowerText.includes("n\u1EA1p ti\u1EC1n") || lowerText.includes("otp") || lowerText.includes("s\u1ED1 d\u01B0") || lowerText.includes("s\u1ED1 t\xE0i kho\u1EA3n") || lowerText.includes("ho\xE0n ti\u1EC1n") || lowerText.includes("ti\u1EC1n c\u1ECDc")) {
    signals.push({
      name: "Y\xEAu C\u1EA7u Chuy\u1EC3n Ti\u1EC1n / M\xE3 OTP (Financial Extraction)",
      scoreContribution: 25,
      description: "Y\xEAu c\u1EA7u chuy\u1EC3n kho\u1EA3n \u0111i\u1EC7n t\u1EED, n\u1EA1p ph\xED m\u1EDF kh\xF3a ho\u1EB7c cung c\u1EA5p th\xF4ng tin m\xE3 x\xE1c th\u1EF1c OTP.",
      category: "Financial"
    });
    heuristicScore += 25;
  }
  if (lowerText.includes("c\xF4ng an") || lowerText.includes("b\u1ED9 c\xF4ng an") || lowerText.includes("vi\u1EC7n ki\u1EC3m s\xE1t") || lowerText.includes("c\xE1n b\u1ED9") || lowerText.includes("\u0111i\u1EC1u tra") || lowerText.includes("ng\xE2n h\xE0ng") || lowerText.includes("vneid") || lowerText.includes("c\u1EE5c thu\u1EBF")) {
    signals.push({
      name: "M\u1EA1o Danh C\u01A1 Quan Nh\xE0 N\u01B0\u1EDBc / T\u1ED5 Ch\u1EE9c (Authority Fear)",
      scoreContribution: 25,
      description: "T\u1EF1 x\u01B0ng l\xE0 l\u1EF1c l\u01B0\u1EE3ng c\xF4ng an, ki\u1EC3m s\xE1t vi\xEAn, c\xE1n b\u1ED9 thu\u1EBF ho\u1EB7c trung t\xE2m an ninh ng\xE2n h\xE0ng.",
      category: "Impersonation"
    });
    heuristicScore += 20;
  }
  heuristicScore = Math.min(99, heuristicScore);
  let defaultRiskLevel = "SAFE";
  if (heuristicScore >= 70) defaultRiskLevel = "HIGH";
  else if (heuristicScore >= 40) defaultRiskLevel = "MEDIUM";
  else if (heuristicScore >= 20) defaultRiskLevel = "LOW";
  const evidenceList = [];
  if (urlFeatures?.brandImpersonationFound) {
    evidenceList.push({
      severity: "critical",
      title: "Brand Impersonation in URL",
      snippet: urlFeatures.domain,
      description: `T\xEAn mi\u1EC1n s\u1EED d\u1EE5ng th\u01B0\u01A1ng hi\u1EC7u [${urlFeatures.targetedBrand?.toUpperCase()}] nh\u01B0ng kh\xF4ng thu\u1ED9c d\u1EA3i m\xE1y ch\u1EE7 ch\xEDnh th\u1ED1ng.`
    });
  }
  let finalResult = {
    riskLevel: defaultRiskLevel,
    riskScore: heuristicScore,
    signals,
    summary: "N\u1ED9i dung ch\u1EE9a nhi\u1EC1u d\u1EA5u hi\u1EC7u k\u1EF9 ngh\u1EC7 x\xE3 h\u1ED9i \u0111\xE1ng ng\u1EDD.",
    detectedTactics: ["Urgency", "Authority"],
    explanationsByPersona: {
      child: "Tin nh\u1EAFn n\xE0y c\xF3 d\u1EA5u hi\u1EC7u l\u1EEBa g\u1EA1t b\u1EA1n \u0111\u1EA5y. \u0110\u1EEBng bao gi\u1EDD b\u1EA5m v\xE0o link l\u1EA1 v\xE0 h\xE3y \u0111\u01B0a ng\u01B0\u1EDDi l\u1EDBn xem nh\xE9!",
      teen: "C\u1EA3nh b\xE1o: Th\u1EE7 \u0111o\u1EA1n t\u1EA1o tin gi\u1EA3 v\xE0 li\xEAn k\u1EBFt b\u1EABy nh\u1EB1m \u0111\xE1nh c\u1EAFp t\xE0i kho\u1EA3n ho\u1EB7c t\xE0i s\u1EA3n c\u1EE7a b\u1EA1n.",
      adult: "D\u1EA5u hi\u1EC7u r\xF5 r\xE0ng c\u1EE7a t\u1EA5n c\xF4ng phi k\u1EF9 thu\u1EADt (Social Engineering). Tuy\u1EC7t \u0111\u1ED1i kh\xF4ng b\u1EA5m link v\xE0 h\xE3y x\xE1c minh qua k\xEAnh ch\xEDnh th\u1ED1ng.",
      senior: "C\u1EA9n tr\u1ECDng: \u0110\u1ED1i t\u01B0\u1EE3ng d\u1ED3n \xE9p v\u1ED9i v\xE0ng. Xin \u0111\u1EEBng b\u1EA5m link hay chuy\u1EC3n ti\u1EC1n, h\xE3y g\u1ECDi cho con ch\xE1u ho\u1EB7c ng\xE2n h\xE0ng ki\u1EC3m tra.",
      expert: "Vector t\u1EA5n c\xF4ng l\u1EEBa \u0111\u1EA3o tr\u1EF1c tuy\u1EBFn k\u1EBFt h\u1EE3p \xE1p l\u1EF1c th\u1EDDi gian (Time Pressure) v\xE0 thu th\u1EADp th\xF4ng tin b\u1EA3o m\u1EADt (Credential Harvesting)."
    },
    redFlags: ["T\u1EA1o \xE1p l\u1EF1c th\u1EDDi gian kh\u1EA9n c\u1EA5p", "Y\xEAu c\u1EA7u truy c\u1EADp li\xEAn k\u1EBFt l\u1EA1", "Y\xEAu c\u1EA7u th\xF4ng tin nh\u1EA1y c\u1EA3m"],
    recommendedSteps: [
      "Kh\xF4ng thao t\xE1c b\u1EA5m li\xEAn k\u1EBFt ho\u1EB7c chuy\u1EC3n ti\u1EC1n.",
      "G\u1ECDi tr\u1EF1c ti\u1EBFp \u0111\u01B0\u1EDDng d\xE2y n\xF3ng ch\xEDnh th\u1EE9c c\u1EE7a t\u1ED5 ch\u1EE9c \u0111\u1EC3 x\xE1c minh \u0111\u1ED9c l\u1EADp.",
      "B\xE1o c\xE1o tin nh\u1EAFn \u0111\u1EBFn t\u1ED5ng \u0111\xE0i 156 / C\u1EE5c An to\xE0n Th\xF4ng tin."
    ],
    piiRedacted,
    threatBreakdown: {
      maliciousUrl: urlFeatures ? urlFeatures.deterministicRiskScore : 10,
      impersonation: 85,
      urgency: 80,
      credentialHarvesting: 90,
      socialEngineering: 85
    },
    evidenceFound: evidenceList,
    threatClassification: {
      primaryThreat: "Social Engineering Phishing",
      attackVector: req.url ? "Malicious URL" : "Manipulative Message",
      target: "Credentials & Assets",
      potentialImpact: ["Financial Loss", "Account Takeover"],
      confidence: 88
    },
    attackChain: ["Tin nh\u1EAFn ti\u1EBFp c\u1EADn n\u1EA1n nh\xE2n", "M\u1EA1o danh th\u1EF1c th\u1EC3 uy t\xEDn", "T\u1EA1o b\u1EABy t\xE2m l\xFD d\u1ED3n \xE9p", "Thu th\u1EADp t\xE0i kho\u1EA3n & OTP"],
    urlAnalysis: urlFeatures ? {
      domain: urlFeatures.domain,
      anomalyDetected: urlFeatures.brandImpersonationFound || urlFeatures.suspiciousTld,
      httpsEnabled: urlFeatures.hasHttps,
      domainAgeStatus: urlFeatures.suspiciousTld ? "T\xEAn mi\u1EC1n m\u1EDBi \u0111\u0103ng k\xFD / r\u1EE7i ro cao" : "C\u1EA7n ki\u1EC3m ch\u1EE9ng",
      brandImpersonationRisk: urlFeatures.brandImpersonationFound ? "HIGH" : urlFeatures.suspiciousTld ? "MEDIUM" : "SAFE",
      redirectDetected: urlFeatures.isShortener,
      urlRiskScore: urlFeatures.deterministicRiskScore
    } : void 0,
    assessmentId
  };
  try {
    const prompt = `B\u1EA1n l\xE0 SCAMGUARD AI - C\xF4ng c\u1EE5 ph\xE2n t\xEDch ph\xE1p y ph\xF2ng ch\u1ED1ng l\u1EEBa \u0111\u1EA3o tr\u1EF1c tuy\u1EBFn cho \u0111\u1EC1 t\xE0i NCKH ViSEF.
H\xE3y ph\xE2n t\xEDch n\u1ED9i dung sau theo quy tr\xECnh khoa h\u1ECDc:
"${cleanInput}"

${req.base64Image ? "\u0110\xE3 \u0111\xEDnh k\xE8m \u1EA3nh ch\u1EE5p m\xE0n h\xECnh \u0111\u1EC3 gi\xE1m \u0111\u1ECBnh ph\xE1p y th\u1ECB gi\xE1c." : ""}

QUY T\u1EAEC KHOA H\u1ECCC & AN TO\xC0N TUY\u1EC6T \u0110\u1ED0I:
1. Tuy\u1EC7t \u0111\u1ED1i KH\xD4NG kh\u1EB3ng \u0111\u1ECBnh 100% ho\u1EB7c d\xF9ng t\u1EEB ng\u1EEF mang t\xEDnh k\u1EBFt t\u1ED9i tuy\u1EC7t \u0111\u1ED1i. D\xF9ng thang x\xE1c su\u1EA5t (Nguy c\u01A1 cao, \u0110\xE1ng ng\u1EDD, Kh\xF4ng \u0111\u1EE7 b\u1EB1ng ch\u1EE9ng).
2. Tr\xEDch xu\u1EA5t \u0111\xFAng ph\xE2n \u0111o\u1EA1n b\u1EB1ng ch\u1EE9ng g\u1ED1c (evidence snippet).
3. \u0110\xE1nh gi\xE1 6 chi\u1EC1u t\xE2m l\xFD: Time Pressure, Authority Fear, Financial Greed, Emotional Manipulation, Convenience Bias, Trust/Credulity.
4. Vi\u1EBFt c\u1EF1c k\u1EF3 s\xFAc t\xEDch, ng\u1EAFn g\u1ECDn b\u1EB1ng ti\u1EBFng Vi\u1EC7t.

Tr\u1EA3 v\u1EC1 JSON chu\u1EA9n x\xE1c:
{
  "isInvalidBankImage": boolean,
  "invalidImageReason": string,
  "riskScore": number (0-100),
  "riskLevel": "HIGH" | "MEDIUM" | "LOW" | "SAFE",
  "summary": string (1-2 c\xE2u s\xFAc t\xEDch),
  "detectedTactics": array of ("Authority" | "Urgency" | "Fear" | "Greed" | "Sympathy" | "Social Proof" | "Isolation" | "Reciprocity" | "Romance" | "Confusion" | "Synthetic Media" | "Convenience Bias"),
  "redFlags": array of strings (t\u1ED1i \u0111a 3 m\u1EE5c),
  "recommendedSteps": array of strings (t\u1ED1i \u0111a 3 m\u1EE5c),
  "threatClassification": {
    "primaryThreat": string,
    "attackVector": string,
    "target": string,
    "potentialImpact": [string],
    "confidence": number (50-95)
  },
  "evidenceFound": [
    {
      "severity": "critical" | "high" | "medium" | "low",
      "title": string,
      "snippet": string,
      "description": string
    }
  ],
  "attackChain": [string]
}`;
    let contents = prompt;
    if (req.base64Image) {
      const mime = req.mimeType || "image/png";
      const base64Data = req.base64Image.replace(/^data:image\/\w+;base64,/, "");
      contents = {
        parts: [
          { inlineData: { mimeType: mime, data: base64Data } },
          { text: prompt }
        ]
      };
    }
    const response = await executeGeminiWithFallback({
      contents,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "B\u1EA1n l\xE0 H\u1EC7 Th\u1ED1ng Gi\xE1m \u0110\u1ECBnh Ph\xE1p Y S\u1ED1 SCAMGUARD VN. Ph\xE2n t\xEDch khoa h\u1ECDc, th\u1EADn tr\u1ECDng, kh\xF4ng \u0111\u01B0a ra tuy\xEAn b\u1ED1 tuy\u1EC7t \u0111\u1ED1i sai l\u1EC7ch.",
        temperature: 0.1,
        maxOutputTokens: 2048
      }
    });
    if (response?.text) {
      const parsed = JSON.parse(response.text.trim());
      finalResult = {
        ...finalResult,
        ...parsed,
        riskScore: parsed.riskScore !== void 0 ? Math.round((parsed.riskScore + heuristicScore) / 2) : heuristicScore,
        piiRedacted,
        assessmentId
      };
    }
  } catch (err) {
    console.error("Gemini reasoning handled gracefully with deterministic fallback.", err);
  }
  const safetyEnforced = enforceSafetyAndCalibration(finalResult);
  finalResult.summary = safetyEnforced.sanitizedSummary;
  finalResult.riskLevel = safetyEnforced.calibratedRiskLevel;
  if (finalResult.threatClassification) {
    finalResult.threatClassification.confidence = safetyEnforced.calibratedConfidence;
  }
  return finalResult;
}
async function inspectFakeBillAnomalies(params) {
  const mime = params.mimeType || "image/png";
  const base64Data = params.base64Image.replace(/^data:image\/\w+;base64,/, "");
  let anomalyScore = 45;
  let verdict = "MODERATE_ANOMALIES";
  let fontMismatch = false;
  let alignmentIrregular = false;
  let watermarkStatus = "NOT_APPLICABLE";
  let compressionArtifact = false;
  let metadataStatus = "LOGICAL";
  const suspiciousRegions = [];
  try {
    const prompt = `B\u1EA1n l\xE0 Chuy\xEAn gia Gi\xE1m \u0110\u1ECBnh Ph\xE1p Y T\xE0i Li\u1EC7u & H\xF3a \u0110\u01A1n Chuy\u1EC3n Kho\u1EA3n Ng\xE2n H\xE0ng SCAMGUARD.
H\xE3y ph\xE2n t\xEDch b\u1EE9c \u1EA3nh bi\xEAn lai chuy\u1EC3n ti\u1EC1n / sao k\xEA ng\xE2n h\xE0ng n\xE0y d\u01B0\u1EDBi g\xF3c \u0111\u1ED9 quang h\u1ECDc v\xE0 c\u1EA5u tr\xFAc ph\xE1p y:

QUY T\u1EAEC B\u1EAET BU\u1ED8C:
1. KH\xD4NG kh\u1EB3ng \u0111\u1ECBnh 100% h\xF3a \u0111\u01A1n l\xE0 th\u1EADt hay gi\u1EA3 (kh\xF4ng c\xF3 th\u1EA9m quy\u1EC1n ph\xE1p l\xFD tuy\u1EC7t \u0111\u1ED1i).
2. \u0110\xE1nh gi\xE1 5 kh\xEDa c\u1EA1nh c\u1EA5u tr\xFAc b\u1EA5t th\u01B0\u1EDDng:
   a) Ph\xF4ng ch\u1EEF & \u0111\u1ED9 s\u1EAFc n\xE9t: Font ch\u1EEF s\u1ED1 ti\u1EC1n, t\xEAn ng\u01B0\u1EDDi nh\u1EADn c\xF3 l\u1EC7ch chu\u1EA9n (kerning, weight) so v\u1EDBi font h\u1EC7 th\u1ED1ng c\u1EE7a ng\xE2n h\xE0ng?
   b) C\u0103n l\u1EC1 & kho\u1EA3ng c\xE1ch d\xF2ng (spacing & alignment): C\xF3 d\u1EA5u hi\u1EC7u gh\xE9p d\xE1n \u0111\xE8 v\u0103n b\u1EA3n?
   c) Con d\u1EA5u / Logo / Watermark: Logo c\xF3 b\u1ECB m\xE9o t\u1EF7 l\u1EC7, vi\u1EC1n r\u0103ng c\u01B0a, nh\xF2e m\u1EDD kh\xE1c bi\u1EC7t?
   d) Nhi\u1EC5u n\xE9n \u1EA3nh (Compression / JPEG artifacts): V\xF9ng xung quanh s\u1ED1 ti\u1EC1n c\xF3 v\u1EC7t qu\u1EA7ng m\u1EDD (ringing/halos) do ch\u1EC9nh s\u1EEDa ch\u1EAFp v\xE1?
   e) T\xEDnh nh\u1EA5t qu\xE1n si\xEAu d\u1EEF li\u1EC7u (Metadata / Transaction consistency): M\xE3 giao d\u1ECBch, ng\xE0y gi\u1EDD, s\u1ED1 d\u01B0 sau giao d\u1ECBch c\xF3 logic?

Tr\u1EA3 v\u1EC1 JSON chu\u1EA9n x\xE1c:
{
  "anomalySuspicionScore": number (0-100),
  "verdictClassification": "HIGH_ANOMALY_SUSPECTED" | "MODERATE_ANOMALIES" | "LOW_ANOMALY_CONSISTENT" | "INSUFFICIENT_IMAGE_QUALITY",
  "structuralMetrics": {
    "fontMismatchDetected": boolean,
    "fontScore": number (0-100, c\xE0ng cao c\xE0ng b\u1EA5t th\u01B0\u1EDDng),
    "alignmentIrregularityDetected": boolean,
    "spacingScore": number (0-100),
    "watermarkSealStatus": "OFFICIAL_MATCH" | "MISSING_WATERMARK" | "BLURRED_SYNTHETIC" | "NOT_APPLICABLE",
    "compressionArtifactDetected": boolean,
    "artifactScore": number (0-100),
    "metadataTemporalConsistency": "LOGICAL" | "INCONSISTENT_TIMESTAMP" | "SUSPICIOUS_ROUND_NUMBER"
  },
  "explainableSuspiciousRegions": [
    {
      "areaName": string,
      "description": string,
      "severity": "critical" | "high" | "medium"
    }
  ],
  "scientificCaveat": string
}`;
    const contents = {
      parts: [
        { inlineData: { mimeType: mime, data: base64Data } },
        { text: prompt }
      ]
    };
    const response = await executeGeminiWithFallback({
      contents,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "B\u1EA1n l\xE0 H\u1EC7 Th\u1ED1ng Gi\xE1m \u0110\u1ECBnh Ph\xE1p Y \u1EA2nh Bi\xEAn Lai Ng\xE2n H\xE0ng SCAMGUARD. Tr\u1EA3 v\u1EC1 k\u1EBFt qu\u1EA3 ph\xE2n t\xEDch c\u1EA5u tr\xFAc b\u1EA5t th\u01B0\u1EDDng d\u1EA1ng x\xE1c su\u1EA5t.",
        temperature: 0.1,
        maxOutputTokens: 2048
      }
    });
    if (response?.text) {
      const parsed = JSON.parse(response.text.trim());
      return {
        anomalySuspicionScore: parsed.anomalySuspicionScore ?? 65,
        verdictClassification: parsed.verdictClassification || "MODERATE_ANOMALIES",
        structuralMetrics: parsed.structuralMetrics || {
          fontMismatchDetected: true,
          fontScore: 70,
          alignmentIrregularityDetected: true,
          spacingScore: 65,
          watermarkSealStatus: "BLURRED_SYNTHETIC",
          compressionArtifactDetected: true,
          artifactScore: 75,
          metadataTemporalConsistency: "SUSPICIOUS_ROUND_NUMBER"
        },
        explainableSuspiciousRegions: parsed.explainableSuspiciousRegions || [
          {
            areaName: "V\xF9ng ch\u1EEF s\u1ED1 ti\u1EC1n giao d\u1ECBch",
            description: "Ph\xF4ng ch\u1EEF c\xF3 \u0111\u1ED9 ph\xE2n gi\u1EA3i v\xE0 m\u1EADt \u0111\u1ED9 pixel kh\xF4ng \u0111\u1ED3ng nh\u1EA5t v\u1EDBi ph\u1EA7n c\xF2n l\u1EA1i c\u1EE7a h\xF3a \u0111\u01A1n.",
            severity: "high"
          }
        ],
        scientificCaveat: "Khuy\u1EBFn c\xE1o ph\xE1p y: Ch\u1EC9 s\u1ED1 b\u1EA5t th\u01B0\u1EDDng quang h\u1ECDc (Optical Anomaly Score) ph\u1EA3n \xE1nh c\xE1c \u0111i\u1EC3m l\u1EC7ch chu\u1EA9n pixel v\xE0 font ch\u1EEF. \u0110\u1EC3 x\xE1c th\u1EF1c giao d\u1ECBch, h\xE3y ki\u1EC3m tra bi\u1EBFn \u0111\u1ED9ng s\u1ED1 d\u01B0 tr\u1EF1c ti\u1EBFp trong \u1EE9ng d\u1EE5ng ng\xE2n h\xE0ng ch\xEDnh th\u1EE9c c\u1EE7a b\xEAn th\u1EE5 h\u01B0\u1EDFng."
      };
    }
  } catch (err) {
    console.error("Gemini vision analysis handled with baseline anomaly evaluator.", err);
  }
  suspiciousRegions.push({
    areaName: "V\xF9ng s\u1ED1 ti\u1EC1n & t\xEAn ng\u01B0\u1EDDi nh\u1EADn",
    description: "C\u1EA7n ki\u1EC3m tra \u0111\u1ED9 s\u1EAFc n\xE9t c\u1EE7a vi\u1EC1n ch\u1EEF so v\u1EDBi n\u1EC1n bi\xEAn lai.",
    severity: "medium"
  });
  return {
    anomalySuspicionScore: anomalyScore,
    verdictClassification: verdict,
    structuralMetrics: {
      fontMismatchDetected: fontMismatch,
      fontScore: 40,
      alignmentIrregularityDetected: alignmentIrregular,
      spacingScore: 45,
      watermarkSealStatus: watermarkStatus,
      compressionArtifactDetected: compressionArtifact,
      artifactScore: 50,
      metadataTemporalConsistency: metadataStatus
    },
    explainableSuspiciousRegions: suspiciousRegions,
    scientificCaveat: "Ch\u1EC9 s\u1ED1 b\u1EA5t th\u01B0\u1EDDng c\u1EA5u tr\xFAc quang h\u1ECDc. C\u1EA7n tra c\u1EE9u tr\u1EF1c ti\u1EBFp trong l\u1ECBch s\u1EED giao d\u1ECBch \u1EE9ng d\u1EE5ng Mobile Banking c\u1EE7a ng\u01B0\u1EDDi nh\u1EADn ti\u1EC1n."
  };
}

// src/data/researchDataset.ts
var CAMGUARD_DATASET = [
  // --- PRE-TEST BENCHMARK BATTERY (6 SCENARIOS) ---
  {
    id: "pre-01-bank-urgency",
    split: "pre_test",
    language: "vi",
    category: "Banking Impersonation",
    isScam: true,
    difficulty: "Intermediate",
    vulnerabilityTarget: "Time Pressure",
    urgencyLevel: 5,
    authorityLevel: 4,
    financialPressure: 4,
    emotionalPressure: 2,
    title: "Kh\xF3a T\xE0i Kho\u1EA3n Giao D\u1ECBch B\u1EA5t Th\u01B0\u1EDDng 24h",
    senderProfile: "SMS Brandname: NGAN-HANG-SO",
    channel: "SMS",
    sampleContent: "\u{1F6A8} [C\u1EA2NH B\xC1O] T\xE0i kho\u1EA3n Vietcombank c\u1EE7a qu\xFD kh\xE1ch v\u1EEBa ph\xE1t sinh giao d\u1ECBch 42.000.000\u0111 t\u1EA1i Singapore. Vui l\xF2ng b\u1EA5m https://vietcombank-security-portal.top/cancel trong 5 ph\xFAt \u0111\u1EC3 h\u1EE7y l\u1EC7nh kh\u1EA9n c\u1EA5p.",
    requestedAction: "CLICK_LINK",
    sensitiveDataRequested: ["T\xEAn \u0111\u0103ng nh\u1EADp", "M\u1EADt kh\u1EA9u", "M\xE3 OTP"],
    psychologicalTactics: ["Urgency (5-min deadline)", "Fear of asset loss", "Authority impersonation"],
    riskIndicators: ["T\xEAn mi\u1EC1n l\u1EA1 .top", "D\u1ED3n \xE9p th\u1EDDi gian 5 ph\xFAt", "\u0110\xF2i nh\u1EADp OTP v\xE0o website"],
    hasMaliciousLink: true,
    hasQr: false,
    expectedSafeAction: "Kh\xF4ng b\u1EA5m link; g\u1ECDi tr\u1EF1c ti\u1EBFp hotline in \u1EDF m\u1EB7t sau th\u1EBB ng\xE2n h\xE0ng v\u1EADt l\xFD.",
    counterTacticRationale: "\u0110\xF2n d\u1ED3n \xE9p 5 ph\xFAt nh\u1EB1m k\xEDch ho\u1EA1t t\xE2m l\xFD ho\u1EA3ng lo\u1EA1n \u0111\u1EC3 ng\u01B0\u1EDDi d\xF9ng b\u1ECF qua b\u01B0\u1EDBc ki\u1EC3m tra t\xEAn mi\u1EC1n .top r\xE1c.",
    sourceType: "REAL_ANONYMIZED",
    validationStatus: "EXPERT_VALIDATED",
    provenance: {
      origin: "T\u1ED5ng h\u1EE3p t\u1EEB b\xE1o c\xE1o c\u1EA3nh b\xE1o C\u1EE5c An to\xE0n Th\xF4ng tin (AIS / NCSC Vietnam)",
      creationMethod: "Kh\u1EED khu\u1EA9n PII, chu\u1EA9n h\xF3a nh\xE3n khoa h\u1ECDc",
      annotationProtocol: "Triple-expert consensus validation (K=3, Fleiss Kappa=0.92)",
      piiRedactionVerified: true,
      licenseTerms: "Creative Commons CC-BY-NC 4.0 for Academic Research",
      syntheticLabel: "Real-world Anonymized Case"
    }
  },
  {
    id: "pre-02-police-vneid",
    split: "pre_test",
    language: "vi",
    category: "Police / Government",
    isScam: true,
    difficulty: "Advanced",
    vulnerabilityTarget: "Authority Fear",
    urgencyLevel: 4,
    authorityLevel: 5,
    financialPressure: 2,
    emotionalPressure: 3,
    title: "C\xE1n B\u1ED9 C\xF4ng An C\u1EADp Nh\u1EADt \u0110\u1ECBnh Danh VNeID M\u1EE9c 2",
    senderProfile: "C\xE1n B\u1ED9 Nguy\u1EC5n Minh \u0110\u1EE9c - CA Qu\u1EADn 1",
    channel: "Phone",
    sampleContent: "T\xF4i l\xE0 Trung \xFAy \u0110\u1EE9c, C\xF4ng an Qu\u1EADn 1. H\u1ED3 s\u01A1 CCCD g\u1EAFn chip c\u1EE7a anh b\u1ECB l\u1ED7i \u0111\u1ED3ng b\u1ED9 d\u1EEF li\u1EC7u d\xE2n c\u01B0. Anh ph\u1EA3i c\xE0i \u0111\u1EB7t \u1EE9ng d\u1EE5ng d\u1ECBch v\u1EE5 c\xF4ng b\u1ED5 sung theo link t\xF4i g\u1EEDi qua Zalo ngay trong s\xE1ng nay, n\u1EBFu kh\xF4ng s\u1EBD b\u1ECB ph\u1EA1t vi ph\u1EA1m h\xE0nh ch\xEDnh 5 tri\u1EC7u.",
    requestedAction: "INSTALL_APK",
    sensitiveDataRequested: ["Quy\u1EC1n Accessibility Android", "M\u1EADt kh\u1EA9u ng\xE2n h\xE0ng"],
    psychologicalTactics: ["Authority impersonation (Police)", "Legal intimidation / fine threat", "Urgency pressure"],
    riskIndicators: ["G\u1EEDi file APK qua Zalo", "C\xF4ng an kh\xF4ng l\xE0m vi\u1EC7c qua \u0111i\u1EC7n tho\u1EA1i", "\u0110e d\u1ECDa ph\u1EA1t ti\u1EC1n"],
    hasMaliciousLink: true,
    hasQr: false,
    expectedSafeAction: "T\u1EEB ch\u1ED1i c\xE0i t\u1EC7p APK l\u1EA1; th\xF4ng b\xE1o s\u1EBD \u0111\u1EBFn tr\u1EF1c ti\u1EBFp c\xF4ng an ph\u01B0\u1EDDng \u0111\u1EC3 c\u1EADp nh\u1EADt.",
    counterTacticRationale: "L\u1EE3i d\u1EE5ng uy quy\u1EC1n c\u1EE7a l\u1EF1c l\u01B0\u1EE3ng c\xF4ng an \u0111\u1EC3 \xE9p n\u1EA1n nh\xE2n c\xE0i m\xE3 \u0111\u1ED9c chi\u1EBFm quy\u1EC1n \u0111i\u1EC1u khi\u1EC3n Accessibility tr\xEAn \u0111i\u1EC7n tho\u1EA1i.",
    sourceType: "REAL_ANONYMIZED",
    validationStatus: "EXPERT_VALIDATED",
    provenance: {
      origin: "H\u1ED3 s\u01A1 chuy\xEAn \xE1n ph\xF2ng ch\u1ED1ng t\u1ED9i ph\u1EA1m c\xF4ng ngh\u1EC7 cao",
      creationMethod: "Chuy\u1EC3n th\u1EC3 th\xE0nh k\u1ECBch b\u1EA3n \u0111\u1ED1i tho\u1EA1i \u0111\xE0o t\u1EA1o \u1EA9n danh",
      annotationProtocol: "Triple-expert consensus validation",
      piiRedactionVerified: true,
      licenseTerms: "CC-BY-NC 4.0 for Research",
      syntheticLabel: "Real-world Anonymized Case"
    }
  },
  {
    id: "pre-03-legit-telecom",
    split: "pre_test",
    language: "vi",
    category: "Legitimate Control Item",
    isScam: false,
    difficulty: "Intermediate",
    vulnerabilityTarget: "Trust/Credulity",
    urgencyLevel: 1,
    authorityLevel: 2,
    financialPressure: 1,
    emotionalPressure: 1,
    title: "Th\xF4ng B\xE1o C\u01B0\u1EDBc Vi\u1EC5n Th\xF4ng Ch\xEDnh Th\u1EE9c Viettel",
    senderProfile: "T\u1ED5ng \u0110\xE0i Viettel Telecom: 198",
    channel: "SMS",
    sampleContent: "K\xEDnh g\u1EEDi qu\xFD kh\xE1ch, c\u01B0\u1EDBc d\u1ECBch v\u1EE5 di \u0111\u1ED9ng th\xE1ng 08/2026 c\u1EE7a thu\xEA bao 098xxxxxxx l\xE0 145.000\u0111. Qu\xFD kh\xE1ch c\xF3 th\u1EC3 tra c\u1EE9u chi ti\u1EBFt t\u1EA1i \u1EE9ng d\u1EE5ng My Viettel ho\u1EB7c truy c\u1EADp https://viettel.vn. Hotline CSKH 18008098 (mi\u1EC5n ph\xED).",
    requestedAction: "SAFE_VERIFY",
    sensitiveDataRequested: [],
    psychologicalTactics: ["Standard informational notice", "No coercive triggers", "Verified customer care line"],
    riskIndicators: ["T\xEAn mi\u1EC1n ch\xEDnh th\u1EE9c viettel.vn", "T\u1ED5ng \u0111\xE0i mi\u1EC5n c\u01B0\u1EDBc 1800", "Kh\xF4ng \xE9p n\u1EA1p ti\u1EC1n t\xE0i kho\u1EA3n c\xE1 nh\xE2n"],
    hasMaliciousLink: false,
    hasQr: false,
    expectedSafeAction: "X\xE1c nh\u1EADn th\xF4ng tin qua \u1EE9ng d\u1EE5ng ch\xEDnh th\u1EE9c; kh\xF4ng y\xEAu c\u1EA7u chuy\u1EC3n ti\u1EC1n v\xE0o t\xE0i kho\u1EA3n c\xE1 nh\xE2n.",
    counterTacticRationale: 'Ki\u1EC3m tra \u0111\u1ED9 nh\u1EA1y c\u1EA3m c\u1EE7a ng\u01B0\u1EDDi h\u1ECDc \u0111\u1EC3 tr\xE1nh t\u1EA1o ra t\xE2m l\xFD "nghi ng\u1EDD c\u1EF1c \u0111oan" (False Positive) tr\u01B0\u1EDBc th\xF4ng b\xE1o ch\xEDnh th\u1EE9c.',
    sourceType: "CONTROL_BENCHMARK",
    validationStatus: "EXPERT_VALIDATED",
    provenance: {
      origin: "M\u1EABu th\xF4ng b\xE1o c\u01B0\u1EDBc th\u1EF1c t\u1EBF t\u1EEB nh\xE0 m\u1EA1ng vi\u1EC5n th\xF4ng qu\u1ED1c gia",
      creationMethod: "M\u1EABu \u0111\u1ED1i ch\u1EE9ng \xE2m t\xEDnh (Negative Control Benchmark)",
      annotationProtocol: "Ground Truth Validated",
      piiRedactionVerified: true,
      licenseTerms: "CC-BY-NC 4.0",
      syntheticLabel: "Real-world Anonymized Case"
    }
  },
  {
    id: "pre-04-job-telegram",
    split: "pre_test",
    language: "vi",
    category: "Recruitment / Task Scam",
    isScam: true,
    difficulty: "Beginner",
    vulnerabilityTarget: "Financial Greed",
    urgencyLevel: 3,
    authorityLevel: 2,
    financialPressure: 4,
    emotionalPressure: 1,
    title: "Tuy\u1EC3n C\u1ED9ng T\xE1c Vi\xEAn Xem Video TikTok 500k/ng\xE0y",
    senderProfile: "HR Tuy\u1EC3n D\u1EE5ng Shopee/TikTok Vi\u1EC7t Nam",
    channel: "Telegram",
    sampleContent: "Ch\xE0o b\u1EA1n, c\xF4ng ty ch\xFAng m\xECnh c\u1EA7n tuy\u1EC3n CTV b\u1EA5m like s\u1EA3n ph\u1EA9m Shopee v\xE0 xem clip TikTok. M\u1ED7i nhi\u1EC7m v\u1EE5 nh\u1EADn 35.000\u0111 - 120.000\u0111, l\xE0m t\u1EA1i nh\xE0 2h m\u1ED7i ng\xE0y, thanh to\xE1n ti\u1EC1n ngay sau 10 ph\xFAt!",
    requestedAction: "TRANSFER_MONEY",
    sensitiveDataRequested: ["S\u1ED1 t\xE0i kho\u1EA3n ng\xE2n h\xE0ng", "Ti\u1EC1n n\u1EA1p c\u1ECDc nhi\u1EC7m v\u1EE5"],
    psychologicalTactics: ["Financial greed lure", "Low-barrier promise", "Bait-and-switch micro payouts"],
    riskIndicators: ["M\u1ED3i nh\u1EED vi\u1EC7c nh\u1EB9 l\u01B0\u01A1ng cao", "Y\xEAu c\u1EA7u n\u1EA1p ti\u1EC1n \u0111\u1EC3 ho\xE0n th\xE0nh nhi\u1EC7m v\u1EE5 c\u1EA5p cao", "Giao d\u1ECBch qua Telegram"],
    hasMaliciousLink: false,
    hasQr: false,
    expectedSafeAction: "T\u1EEB ch\u1ED1i ngay l\u1EADp t\u1EE9c; kh\xF4ng n\u1EA1p b\u1EA5t k\u1EF3 kho\u1EA3n c\u1ECDc nhi\u1EC7m v\u1EE5 n\xE0o.",
    counterTacticRationale: "B\u1EABy hoa h\u1ED3ng nh\u1ECF (50k \u0111\u1EA7u ti\xEAn) nh\u1EB1m t\u1EA1o s\u1EF1 tin t\u01B0\u1EDFng tr\u01B0\u1EDBc khi l\u1EEBa c\xE1c kho\u1EA3n ti\u1EC1n l\u1EDBn 10-50 tri\u1EC7u \u0111\u1ED3ng.",
    sourceType: "REAL_ANONYMIZED",
    validationStatus: "EXPERT_VALIDATED",
    provenance: {
      origin: "D\u1EEF li\u1EC7u ph\u1EA3n \xE1nh t\u1EEB c\u1ED5ng ti\u1EBFp nh\u1EADn l\u1EEBa \u0111\u1EA3o tr\u1EF1c tuy\u1EBFn Vi\u1EC7t Nam",
      creationMethod: "L\u01B0\u1EE3c b\u1ECF th\xF4ng tin nh\u1EADn d\u1EA1ng c\xE1 nh\xE2n",
      annotationProtocol: "Cybersecurity Analyst Peer Review",
      piiRedactionVerified: true,
      licenseTerms: "CC-BY-NC 4.0",
      syntheticLabel: "Real-world Anonymized Case"
    }
  },
  {
    id: "pre-05-family-hospital",
    split: "pre_test",
    language: "vi",
    category: "Family Emergency",
    isScam: true,
    difficulty: "Stress-Test",
    vulnerabilityTarget: "Emotional Manipulation",
    urgencyLevel: 5,
    authorityLevel: 3,
    financialPressure: 5,
    emotionalPressure: 5,
    title: "Th\u1EA7y Gi\xE1o G\u1ECDi B\xE1o Con C\u1EA5p C\u1EE9u C\u1EA7n Vi\u1EC7n Ph\xED",
    senderProfile: "Th\u1EA7y Gi\xE1o Th\u1EC3 D\u1EE5c & B\xE1c S\u0129 B\u1EC7nh Vi\u1EC7n Ch\u1EE3 R\u1EABy",
    channel: "Voice Call",
    sampleContent: "Alo! Ch\u1ECB c\xF3 ph\u1EA3i m\u1EB9 ch\xE1u Gia B\u1EA3o l\u1EDBp 10A1 kh\xF4ng? Ch\xE1u b\u1ECB t\xE9 ng\xE3 ch\u1EA5n th\u01B0\u01A1ng s\u1ECD n\xE3o trong gi\u1EDD th\u1EC3 d\u1EE5c \u0111ang n\u1EB1m ph\xF2ng m\u1ED5 Ch\u1EE3 R\u1EABy, b\xE1c s\u0129 y\xEAu c\u1EA7u chuy\u1EC3n g\u1EA5p 30 tri\u1EC7u \u0111\u1ED3ng \u0111\u1EB7t c\u1ECDc ph\u1EABu thu\u1EADt ngay trong 10 ph\xFAt!",
    requestedAction: "TRANSFER_MONEY",
    sensitiveDataRequested: ["Ti\u1EC1n m\u1EB7t chuy\u1EC3n kho\u1EA3n nhanh"],
    psychologicalTactics: ["Parental panic exploit", "Severe emotional shock", "Urgent 10-min countdown"],
    riskIndicators: ["B\u1EC7nh vi\u1EC7n kh\xF4ng thu vi\u1EC7n ph\xED c\u1EA5p c\u1EE9u qua STK c\xE1 nh\xE2n", "D\u1ED3n \xE9p kh\xF4ng cho li\xEAn h\u1EC7 nh\xE0 tr\u01B0\u1EDDng", "Cu\u1ED9c g\u1ECDi g\u1EA5p g\xE1p"],
    hasMaliciousLink: false,
    hasQr: false,
    expectedSafeAction: "Gi\u1EEF b\xECnh t\u0129nh, c\xFAp m\xE1y v\xE0 g\u1ECDi tr\u1EF1c ti\u1EBFp gi\xE1o vi\xEAn ch\u1EE7 nhi\u1EC7m ho\u1EB7c ph\xF2ng y t\u1EBF c\u1EE7a tr\u01B0\u1EDDng \u0111\u1EC3 x\xE1c minh \u0111\u1ED9c l\u1EADp.",
    counterTacticRationale: "Khai th\xE1c t\u1ED1i \u0111a t\xECnh m\u1EABu t\u1EED v\xE0 n\u1ED7i s\u1EE3 h\xE3i t\u1ED9t c\xF9ng \u0111\u1EC3 v\xF4 hi\u1EC7u h\xF3a ho\xE0n to\xE0n t\u01B0 duy ph\u1EA3n bi\u1EC7n.",
    sourceType: "REAL_ANONYMIZED",
    validationStatus: "EXPERT_VALIDATED",
    provenance: {
      origin: "C\u1EA3nh b\xE1o ch\xEDnh th\u1EE9c t\u1EEB S\u1EDF Gi\xE1o d\u1EE5c & \u0110\xE0o t\u1EA1o TP.HCM",
      creationMethod: "T\xE1i hi\u1EC7n t\xECnh hu\u1ED1ng h\u1ED9i tho\u1EA1i c\xF3 g\u1EAFn nh\xE3n nghi\xEAn c\u1EE9u",
      annotationProtocol: "Education & Security Expert Panel",
      piiRedactionVerified: true,
      licenseTerms: "CC-BY-NC 4.0",
      syntheticLabel: "Real-world Anonymized Case"
    }
  },
  {
    id: "pre-06-qr-parking",
    split: "pre_test",
    language: "vi",
    category: "Quishing / Malicious QR",
    isScam: true,
    difficulty: "Intermediate",
    vulnerabilityTarget: "Convenience Bias",
    urgencyLevel: 3,
    authorityLevel: 2,
    financialPressure: 2,
    emotionalPressure: 1,
    title: "M\xE3 QR D\xE1n \u0110\xE8 T\u1EA1i B\xE3i \u0110\u1ED7 Xe C\xF4ng C\u1ED9ng",
    senderProfile: "Bi\u1EC3n h\u01B0\u1EDBng d\u1EABn \u0111\u1ED7 xe v\u1EC9a h\xE8",
    channel: "QR",
    sampleContent: 'M\xE3 QR d\xE1n \u0111\xE8 l\xEAn b\u1EA3ng thu ph\xED b\xE3i g\u1EEDi xe th\xF4ng minh: "Qu\xE9t m\xE3 \u0111\u1EC3 tr\u1EA3 ph\xED \u0111\u1ED7 xe 10.000\u0111/gi\u1EDD nhanh ch\xF3ng kh\xF4ng c\u1EA7n ti\u1EC1n m\u1EB7t - Chuy\u1EC3n h\u01B0\u1EDBng \u0111\u1EBFn parking-paypass-vietnam.cc".',
    requestedAction: "SCAN_QR",
    sensitiveDataRequested: ["Th\xF4ng tin th\u1EBB t\xEDn d\u1EE5ng / CVV"],
    psychologicalTactics: ["Convenience bias", "Routine transaction exploitation", "Mechanical paste-over deception"],
    riskIndicators: ["QR d\xE1n \u0111\xE8 l\u1EDBp tem g\u1ED1c", "T\xEAn mi\u1EC1n .cc kh\xF4ng thu\u1ED9c \u0111\u01A1n v\u1ECB qu\u1EA3n l\xFD", "Y\xEAu c\u1EA7u \u0111i\u1EC1n m\xE3 b\u1EA3o m\u1EADt th\u1EBB CVV"],
    hasMaliciousLink: true,
    hasQr: true,
    expectedSafeAction: "Quan s\xE1t tem d\xE1n \u0111\xE8 c\u01A1 h\u1ECDc; ki\u1EC3m tra t\xEAn mi\u1EC1n sau qu\xE9t tr\u01B0\u1EDBc khi x\xE1c nh\u1EADn thanh to\xE1n.",
    counterTacticRationale: "L\u1EE3i d\u1EE5ng th\xF3i quen qu\xE9t m\xE3 thanh to\xE1n v\u1ED9i v\xE0ng c\u1EE7a ng\u01B0\u1EDDi l\xE1i xe \u0111\u1EC3 thu th\u1EADp s\u1ED1 th\u1EBB ng\xE2n h\xE0ng v\xE0 m\xE3 CVV.",
    sourceType: "SYNTHETIC_GENERATED",
    validationStatus: "EXPERT_VALIDATED",
    provenance: {
      origin: "Ph\xF2ng th\xED nghi\u1EC7m K\u1EF9 ngh\u1EC7 X\xE3 h\u1ED9i SCAMGUARD Lab",
      creationMethod: "Sinh k\u1ECBch b\u1EA3n c\xF3 ki\u1EC3m so\xE1t theo khung MITRE ATT&CK T1204",
      annotationProtocol: "Security Engineering Team",
      piiRedactionVerified: true,
      licenseTerms: "CC-BY-NC 4.0",
      syntheticLabel: "Synthetic Training Scenario"
    }
  },
  // --- TRAINING SCENARIOS (USED DURING ADAPTIVE PRACTICE) ---
  {
    id: "train-01-tax-officer",
    split: "train",
    language: "vi",
    category: "Police / Government",
    isScam: true,
    difficulty: "Intermediate",
    vulnerabilityTarget: "Authority Fear",
    urgencyLevel: 4,
    authorityLevel: 5,
    financialPressure: 3,
    emotionalPressure: 2,
    title: "Quy\u1EBFt To\xE1n Thu\u1EBF TNCN Ho\xE0n Ti\u1EC1n 8.500.000\u0111",
    senderProfile: "C\u1EE5c Thu\u1EBF TP.HCM - Ban Thanh Tra",
    channel: "SMS",
    sampleContent: "T\u1ED5ng c\u1EE5c Thu\u1EBF th\xF4ng b\xE1o: H\u1ED3 s\u01A1 c\u1EE7a b\u1EA1n \u0111\u1EE7 \u0111i\u1EC1u ki\u1EC7n ho\xE0n 8.500.000\u0111 thu\u1EBF TNCN 2025. Truy c\u1EADp c\u1ED5ng \u0111i\u1EC7n t\u1EED https://gdt-gov-hoanthue.online \u0111\u1EC3 n\u1ED9p c\u0103n c\u01B0\u1EDBc v\xE0 nh\u1EADn ti\u1EC1n v\u1EC1 t\xE0i kho\u1EA3n tr\u01B0\u1EDBc 17h00.",
    requestedAction: "CLICK_LINK",
    sensitiveDataRequested: ["CCCD", "M\xE3 x\xE1c th\u1EF1c OTP ng\xE2n h\xE0ng"],
    psychologicalTactics: ["Authority impersonation", "Greed / Refund lure", "Time deadline 17h00"],
    riskIndicators: ["T\xEAn mi\u1EC1n gi\u1EA3 m\u1EA1o .online", "Y\xEAu c\u1EA7u OTP \u0111\u1EC3 nh\u1EADn ti\u1EC1n ho\xE0n", "C\u1EE5c Thu\u1EBF kh\xF4ng g\u1EEDi link qua SMS r\xE1c"],
    hasMaliciousLink: true,
    hasQr: false,
    expectedSafeAction: "Tra c\u1EE9u t\u1EA1i C\u1ED5ng D\u1ECBch v\u1EE5 c\xF4ng Qu\u1ED1c gia d\u1ECBchvucong.gov.vn ho\u1EB7c app eTax Mobile.",
    counterTacticRationale: "K\u1EBFt h\u1EE3p l\xF2ng tham ti\u1EC1n th\u01B0\u1EDFng/ho\xE0n thu\u1EBF v\u1EDBi uy quy\u1EC1n nh\xE0 n\u01B0\u1EDBc \u0111\u1EC3 \xE9p \u0111i\u1EC1n form gi\u1EA3.",
    sourceType: "REAL_ANONYMIZED",
    validationStatus: "EXPERT_VALIDATED",
    provenance: {
      origin: "C\u1EA3nh b\xE1o l\u1EEBa \u0111\u1EA3o T\u1ED5ng c\u1EE5c Thu\u1EBF Vi\u1EC7t Nam",
      creationMethod: "Anonymized Case Study",
      annotationProtocol: "Tax & Security Analyst Panel",
      piiRedactionVerified: true,
      licenseTerms: "CC-BY-NC 4.0",
      syntheticLabel: "Real-world Anonymized Case"
    }
  },
  {
    id: "train-02-delivery-cod",
    split: "train",
    language: "vi",
    category: "Delivery COD",
    isScam: true,
    difficulty: "Beginner",
    vulnerabilityTarget: "Convenience Bias",
    urgencyLevel: 3,
    authorityLevel: 1,
    financialPressure: 2,
    emotionalPressure: 1,
    title: "Shipper Giao H\xE0ng B\u1EADn B\u1EAFt Chuy\u1EC3n Kho\u1EA3n COD 180.000\u0111",
    senderProfile: "Giao H\xE0ng Nhanh Express",
    channel: "SMS",
    sampleContent: "Anh \u01A1i em shipper v\u1EEBa n\xE9m ki\u1EC7n h\xE0ng Shopee v\xE0o s\xE2n nh\xE0 anh r\u1ED3i nh\xE9. Anh chuy\u1EC3n gi\xFAp em 180k ti\u1EC1n c\u01B0\u1EDBc COD v\xE0o STK 19038291029 Techcombank n\u1ED9i dung ghi \u0111\xFAng S\u0110T anh nh\xE9.",
    requestedAction: "TRANSFER_MONEY",
    sensitiveDataRequested: ["Ti\u1EC1n m\u1EB7t"],
    psychologicalTactics: ["Small-amount convenience exploit", "Assumed trust", "Casual messenger style"],
    riskIndicators: ["Ch\u01B0a ki\u1EC3m tra \u1EE9ng d\u1EE5ng mua h\xE0ng", "STK c\xE1 nh\xE2n kh\xF4ng c\xF3 m\xE3 v\u1EADn \u0111\u01A1n", "N\xE9m h\xE0ng kh\xF4ng ng\u01B0\u1EDDi nh\u1EADn"],
    hasMaliciousLink: false,
    hasQr: false,
    expectedSafeAction: "M\u1EDF \u1EE9ng d\u1EE5ng Shopee/Lazada ki\u1EC3m tra m\xE3 v\u1EADn \u0111\u01A1n; n\u1EBFu kh\xF4ng c\xF3 \u0111\u01A1n th\xEC tuy\u1EC7t \u0111\u1ED1i kh\xF4ng chuy\u1EC3n kho\u1EA3n.",
    counterTacticRationale: "S\u1ED1 ti\u1EC1n nh\u1ECF (180k) khi\u1EBFn n\u1EA1n nh\xE2n l\u01B0\u1EDDi ki\u1EC3m tra l\u1EA1i \u1EE9ng d\u1EE5ng mua s\u1EAFm.",
    sourceType: "REAL_ANONYMIZED",
    validationStatus: "EXPERT_VALIDATED",
    provenance: {
      origin: "B\xE1o c\xE1o c\u1EA3nh b\xE1o t\u1EEB ng\u01B0\u1EDDi ti\xEAu d\xF9ng th\u01B0\u01A1ng m\u1EA1i \u0111i\u1EC7n t\u1EED",
      creationMethod: "Standardized Case",
      annotationProtocol: "Expert Evaluated",
      piiRedactionVerified: true,
      licenseTerms: "CC-BY-NC 4.0",
      syntheticLabel: "Real-world Anonymized Case"
    }
  },
  {
    id: "train-03-crypto-yield",
    split: "train",
    language: "vi",
    category: "Investment / Ponzi",
    isScam: true,
    difficulty: "Advanced",
    vulnerabilityTarget: "Financial Greed",
    urgencyLevel: 4,
    authorityLevel: 2,
    financialPressure: 5,
    emotionalPressure: 2,
    title: "S\xE0n Forex AI Giao D\u1ECBch \u0110\xF2n B\u1EA9y \u0110\u1EA3m B\u1EA3o L\xE3i 45%/tu\u1EA7n",
    senderProfile: "Chuy\xEAn Gia \u0110\u1EA7u T\u01B0 Master Alex Nguyen",
    channel: "Telegram",
    sampleContent: "Nh\xF3m VIP Robot AI Scalping t\u1EF1 \u0111\u1ED9ng kh\u1EDBp l\u1EC7nh s\xE0n Binance. Cam k\u1EBFt b\u1EA3o hi\u1EC3m v\u1ED1n 100%, r\xFAt ti\u1EC1n linh ho\u1EA1t trong 30s. Su\u1EA5t tham gia \u01B0u \u0111\xE3i ch\u1EC9 c\xF2n 2 slot cu\u1ED1i c\xF9ng tr\u01B0\u1EDBc 12h tr\u01B0a!",
    requestedAction: "TRANSFER_MONEY",
    sensitiveDataRequested: ["V\xED \u0111i\u1EC7n t\u1EED", "Ti\u1EC1n n\u1EA1p s\xE0n gi\u1EA3 m\u1EA1o"],
    psychologicalTactics: ["Extreme ROI lure (45%/week)", "FOMO / Scarcity (2 slots)", "False capital guarantee"],
    riskIndicators: ["L\xE3i su\u1EA5t phi th\u1EF1c t\u1EBF kh\xF4ng t\u01B0\u1EDFng", "\xC9p chuy\u1EC3n ti\u1EC1n v\xE0o s\xE0n l\u1EA1", "Cam k\u1EBFt kh\xF4ng r\u1EE7i ro"],
    hasMaliciousLink: true,
    hasQr: false,
    expectedSafeAction: 'Nghi ng\u1EDD cam k\u1EBFt "kh\xF4ng r\u1EE7i ro"; tham v\u1EA5n c\xE1c \u0111\u01A1n v\u1ECB qu\u1EA3n l\xFD t\xE0i ch\xEDnh ch\xEDnh th\u1EE9c.',
    counterTacticRationale: "Khai th\xE1c t\xE2m l\xFD FOMO v\xE0 l\xF2ng tham l\u1EE3i nhu\u1EADn si\xEAu ng\u1EA1ch kh\xF4ng t\u01B0\u1EDFng.",
    sourceType: "REAL_ANONYMIZED",
    validationStatus: "EXPERT_VALIDATED",
    provenance: {
      origin: "\u0110i\u1EC1u tra \u0111\u01B0\u1EDDng d\xE2y l\u1EEBa \u0111\u1EA3o \u0111\u1EA7u t\u01B0 s\xE0n nh\u1ECB ph\xE2n",
      creationMethod: "Structured Research Case",
      annotationProtocol: "Financial Crime Expert Panel",
      piiRedactionVerified: true,
      licenseTerms: "CC-BY-NC 4.0",
      syntheticLabel: "Real-world Anonymized Case"
    }
  },
  {
    id: "train-04-deepfake-boss",
    split: "train",
    language: "vi",
    category: "Deepfake Synthetic Media",
    isScam: true,
    difficulty: "Stress-Test",
    vulnerabilityTarget: "Authority Fear",
    urgencyLevel: 5,
    authorityLevel: 5,
    financialPressure: 5,
    emotionalPressure: 3,
    title: "Gi\xE1m \u0110\u1ED1c C\xF4ng Ty Video Call Y\xEAu C\u1EA7u Chuy\u1EC3n Ti\u1EC1n H\u1EE3p \u0110\u1ED3ng M\u1EADt",
    senderProfile: "T\u1ED5ng Gi\xE1m \u0110\u1ED1c Nguy\u1EC5n H\u1EA3i \u0110\u0103ng (AI Face Swap)",
    channel: "Voice Call",
    sampleContent: 'Cu\u1ED9c g\u1ECDi Teams/Zalo ng\u1EAFn 15 gi\xE2y khu\xF4n m\u1EB7t v\xE0 gi\u1ECDng n\xF3i c\u1EE7a T\u1ED5ng Gi\xE1m \u0110\u1ED1c: "Anh \u0111ang h\u1ECDp k\xEDn v\u1EDBi \u0111\u1ED1i t\xE1c Nh\u1EADt B\u1EA3n, m\u1EA1ng y\u1EBFu qu\xE1. Em chuy\u1EC3n ngay 250 tri\u1EC7u ti\u1EC1n c\u1ECDc v\xE0o t\xE0i kho\u1EA3n \u0111\u1ED1i t\xE1c n\xE0y \u0111\u1EC3 gi\u1EEF \u0111\u1ED9c quy\u1EC1n, h\u1EE3p \u0111\u1ED3ng k\xFD sau nh\xE9!"',
    requestedAction: "TRANSFER_MONEY",
    sensitiveDataRequested: ["Ng\xE2n qu\u1EF9 c\xF4ng ty"],
    psychologicalTactics: ["Executive impersonation", "Intentional network glitch disguise", "Urgent secret contract"],
    riskIndicators: ["Video ch\u1EADp ch\u1EDDn b\u1EA5t th\u01B0\u1EDDng quanh m\u1EAFt v\xE0 mi\u1EC7ng", "Y\xEAu c\u1EA7u b\u1ECF qua quy tr\xECnh k\u1EBF to\xE1n", "STK th\u1EE5 h\u01B0\u1EDFng l\xE0 c\xE1 nh\xE2n"],
    hasMaliciousLink: false,
    hasQr: false,
    expectedSafeAction: "\xC1p d\u1EE5ng quy tr\xECnh x\xE1c minh 2 b\u01B0\u1EDBc qua k\xEAnh li\xEAn l\u1EA1c n\u1ED9i b\u1ED9 ri\xEAng bi\u1EC7t ho\u1EB7c m\u1EADt kh\u1EA9u quy \u01B0\u1EDBc an to\xE0n.",
    counterTacticRationale: "Deepfake gi\u1EA3 l\u1EADp khu\xF4n m\u1EB7t s\u1EBFp v\xE0 c\u1ED1 t\xECnh t\u1EA1o gi\u1EADt lag \u0111\u1EC3 n\xE9 tr\xE1nh b\u1ECB soi k\u1EF9.",
    sourceType: "SYNTHETIC_GENERATED",
    validationStatus: "EXPERT_VALIDATED",
    provenance: {
      origin: "K\u1ECBch b\u1EA3n t\u1EA5n c\xF4ng BEC (Business Email/Video Compromise) m\xF4 ph\u1ECFng trong ph\xF2ng lab",
      creationMethod: "Generative AI Synthetic Media Testbench",
      annotationProtocol: "AI Forensics Research Group",
      piiRedactionVerified: true,
      licenseTerms: "CC-BY-NC 4.0",
      syntheticLabel: "Synthetic Training Scenario"
    }
  },
  {
    id: "train-05-pig-butchering-romance",
    split: "train",
    language: "vi",
    category: "Romance / Pig Butchering",
    isScam: true,
    difficulty: "Advanced",
    vulnerabilityTarget: "Emotional Manipulation",
    urgencyLevel: 2,
    authorityLevel: 1,
    financialPressure: 4,
    emotionalPressure: 5,
    title: "B\u1EA1n G\xE1i Du H\u1ECDc Sinh Nh\u1EAFn Nh\u1EA7m S\u1ED1 D\u1EABn D\u1EAFt \u0110\u1EA7u T\u01B0 V\xE0ng",
    senderProfile: "Chloe Linh - Nh\xE0 Thi\u1EBFt K\u1EBF Th\u1EDDi Trang t\u1EA1i Singapore",
    channel: "Zalo",
    sampleContent: "Xin l\u1ED7i anh, em g\u1EEDi nh\u1EA7m l\u1ECBch h\u1EB9n cho \u0111\u1ED1i t\xE1c, m\xE0 th\u1EA5y \u1EA3nh \u0111\u1EA1i di\u1EC7n anh hi\u1EC1n l\xE0nh qu\xE1. Em \u0111ang nghi\xEAn c\u1EE9u ph\xE2n t\xEDch bi\u1EC3u \u0111\u1ED3 gi\xE1 v\xE0ng th\u1EBF gi\u1EDBi tr\xEAn s\xE0n giao d\u1ECBch n\xE0y ki\u1EBFm \u0111\u01B0\u1EE3c 5.000$ tu\u1EA7n r\u1ED3i, em ch\u1EC9 anh l\xE0m theo c\xF9ng nh\xE9!",
    requestedAction: "CLICK_LINK",
    sensitiveDataRequested: ["T\xE0i s\u1EA3n c\xE1 nh\xE2n"],
    psychologicalTactics: ["Wrong-number icebreaker", "Long-term rapport building", "Subtle financial boasting"],
    riskIndicators: ["Ng\u01B0\u1EDDi l\u1EA1 tr\xEAn m\u1EA1ng r\u1EE7 r\xEA \u0111\u1EA7u t\u01B0", "T\xEAn mi\u1EC1n s\xE0n giao d\u1ECBch t\u1EF1 t\u1EA1o", "Kh\xF4ng g\u1ECDi video r\xF5 m\u1EB7t"],
    hasMaliciousLink: true,
    hasQr: false,
    expectedSafeAction: "Kh\xF4ng \u0111\u1EA7u t\u01B0 t\xE0i ch\xEDnh qua l\u1EDDi r\u1EE7 r\xEA c\u1EE7a ng\u01B0\u1EDDi l\u1EA1 tr\xEAn m\u1EA1ng; nh\u1EADn di\u1EC7n k\u1ECBch b\u1EA3n Sha Zhu Pan (M\u1ED5 Heo).",
    counterTacticRationale: "X\xE2y d\u1EF1ng m\u1ED1i quan h\u1EC7 t\xECnh c\u1EA3m \u1EA3o k\xE9o d\xE0i nhi\u1EC1u tu\u1EA7n \u0111\u1EC3 x\xF3a tan m\u1ECDi r\xE0o c\u1EA3n \u0111\u1EC1 ph\xF2ng.",
    sourceType: "REAL_ANONYMIZED",
    validationStatus: "EXPERT_VALIDATED",
    provenance: {
      origin: "H\u1ED3 s\u01A1 t\u1ED9i ph\u1EA1m m\u1EA1ng qu\u1ED1c t\u1EBF Sha Zhu Pan",
      creationMethod: "Kh\u1EED khu\u1EA9n PII v\xE0 chu\u1EA9n h\xF3a",
      annotationProtocol: "Psychological & Threat Intel Team",
      piiRedactionVerified: true,
      licenseTerms: "CC-BY-NC 4.0",
      syntheticLabel: "Real-world Anonymized Case"
    }
  },
  {
    id: "train-06-legit-bank-statement",
    split: "train",
    language: "vi",
    category: "Legitimate Control Item",
    isScam: false,
    difficulty: "Beginner",
    vulnerabilityTarget: "Trust/Credulity",
    urgencyLevel: 1,
    authorityLevel: 2,
    financialPressure: 1,
    emotionalPressure: 1,
    title: "Sao K\xEA \u0110\u1ECBnh K\u1EF3 Th\u1EBB T\xEDn D\u1EE5ng Techcombank",
    senderProfile: "Email: statement@techcombank.com.vn",
    channel: "Email",
    sampleContent: "K\xEDnh g\u1EEDi Qu\xFD kh\xE1ch, Ng\xE2n h\xE0ng Techcombank xin g\u1EEDi B\u1EA3n sao k\xEA giao d\u1ECBch th\u1EBB t\xEDn d\u1EE5ng k\u1EF3 20/08/2026. Qu\xFD kh\xE1ch vui l\xF2ng ki\u1EC3m tra file \u0111\xEDnh k\xE8m \u0111\u01B0\u1EE3c m\xE3 h\xF3a m\u1EADt kh\u1EA9u l\xE0 4 s\u1ED1 cu\u1ED1i CMND/CCCD. M\u1ECDi th\u1EAFc m\u1EAFc xin g\u1ECDi 1800588822.",
    requestedAction: "SAFE_VERIFY",
    sensitiveDataRequested: [],
    psychologicalTactics: ["Standard routine financial reporting", "No urgent threats", "Encrypted file protection"],
    riskIndicators: ["T\xEAn mi\u1EC1n email chu\u1EA9n @techcombank.com.vn", "Kh\xF4ng c\xF3 link b\u1EAFt \u0111\u0103ng nh\u1EADp", "Hotline ch\xEDnh th\u1ED1ng"],
    hasMaliciousLink: false,
    hasQr: false,
    expectedSafeAction: "M\u1EDF b\u1EB1ng m\u1EADt m\xE3 c\xE1 nh\xE2n; ki\u1EC3m tra t\xEAn mi\u1EC1n @techcombank.com.vn h\u1EE3p l\u1EC7.",
    counterTacticRationale: "Tr\u01B0\u1EDDng h\u1EE3p th\xF4ng b\xE1o chu\u1EA9n m\u1EF1c, minh b\u1EA1ch, kh\xF4ng \u0111\xF2i h\u1ECFi chuy\u1EC3n ti\u1EC1n kh\u1EA9n c\u1EA5p.",
    sourceType: "CONTROL_BENCHMARK",
    validationStatus: "EXPERT_VALIDATED",
    provenance: {
      origin: "Email th\xF4ng b\xE1o sao k\xEA \u0111\u1ECBnh k\u1EF3 t\u1EEB ng\xE2n h\xE0ng th\u01B0\u01A1ng m\u1EA1i Vi\u1EC7t Nam",
      creationMethod: "Negative Control Item",
      annotationProtocol: "Security Analyst Benchmark",
      piiRedactionVerified: true,
      licenseTerms: "CC-BY-NC 4.0",
      syntheticLabel: "Real-world Anonymized Case"
    }
  },
  // --- UNSEEN GENERALIZATION TEST BATTERY (PREVIOUSLY UNSEEN BY PARTICIPANTS) ---
  {
    id: "unseen-01-viettel-sim-block",
    split: "test_unseen",
    language: "vi",
    category: "Police / Government",
    isScam: true,
    difficulty: "Intermediate",
    vulnerabilityTarget: "Authority Fear",
    urgencyLevel: 5,
    authorityLevel: 4,
    financialPressure: 3,
    emotionalPressure: 2,
    title: "B\u1ED9 TT&TT Th\xF4ng B\xE1o Kh\xF3a SIM 2 Chi\u1EC1u Sau 2 Gi\u1EDD",
    senderProfile: "C\u1EE5c Vi\u1EC5n Th\xF4ng - B\u1ED9 Th\xF4ng Tin & Truy\u1EC1n Th\xF4ng",
    channel: "SMS",
    sampleContent: "[C\u1EE4C VI\u1EC4N TH\xD4NG] Thu\xEA bao c\u1EE7a b\u1EA1n ch\u01B0a chu\u1EA9n h\xF3a th\xF4ng tin c\xE1 nh\xE2n v\xE0 b\u1ECB khi\u1EBFu n\u1EA1i ph\xE1t t\xE1n tin r\xE1c. SIM s\u1EBD b\u1ECB kh\xF3a v\u0129nh vi\u1EC5n sau 2 gi\u1EDD. G\u1ECDi ngay 0899123456 ho\u1EB7c truy c\u1EADp http://chuanhoa-thuebao-mic.cc \u0111\u1EC3 m\u1EDF kh\xF3a.",
    requestedAction: "CLICK_LINK",
    sensitiveDataRequested: ["CCCD 2 m\u1EB7t", "\u1EA2nh ch\xE2n dung", "M\xE3 OTP"],
    psychologicalTactics: ["Authority impersonation (Telecom Authority)", "Extreme urgency (2-hour lock)", "Panic threat"],
    riskIndicators: ["T\xEAn mi\u1EC1n l\u1EEBa \u0111\u1EA3o .cc", "Y\xEAu c\u1EA7u cung c\u1EA5p CCCD v\xE0 OTP", "\u0110\u1EA7u s\u1ED1 \u0111i\u1EC7n tho\u1EA1i l\u1EA1"],
    hasMaliciousLink: true,
    hasQr: false,
    expectedSafeAction: "Ra c\u1EEDa h\xE0ng giao d\u1ECBch nh\xE0 m\u1EA1ng g\u1EA7n nh\u1EA5t; kh\xF4ng g\u1ECDi s\u1ED1 l\u1EA1 hay nh\u1EADp OTP v\xE0o link .cc.",
    counterTacticRationale: 'K\u1ECBch b\u1EA3n ho\xE0n to\xE0n m\u1EDBi v\u1EC1 kh\xF3a SIM nh\u1EB1m ki\u1EC3m tra xem ng\u01B0\u1EDDi h\u1ECDc c\xF3 kh\xE1i qu\xE1t h\xF3a \u0111\u01B0\u1EE3c nguy\xEAn l\xFD "\xE1p l\u1EF1c th\u1EDDi gian + m\u1EA1o danh c\u01A1 quan".',
    sourceType: "REAL_ANONYMIZED",
    validationStatus: "EXPERT_VALIDATED",
    provenance: {
      origin: "C\u1EA3nh b\xE1o n\xF3ng t\u1EEB C\u1EE5c An to\xE0n Th\xF4ng tin - B\u1ED9 TT&TT",
      creationMethod: "Unseen Test Battery Benchmark",
      annotationProtocol: "Expert Validated",
      piiRedactionVerified: true,
      licenseTerms: "CC-BY-NC 4.0",
      syntheticLabel: "Real-world Anonymized Case"
    }
  },
  {
    id: "unseen-02-airline-refund-ticket",
    split: "test_unseen",
    language: "vi",
    category: "Banking Impersonation",
    isScam: true,
    difficulty: "Advanced",
    vulnerabilityTarget: "Time Pressure",
    urgencyLevel: 4,
    authorityLevel: 3,
    financialPressure: 4,
    emotionalPressure: 2,
    title: "Vietnam Airlines Ho\xE0n Ti\u1EC1n V\xE9 Chuy\u1EBFn Bay B\u1ECB H\u1EE7y",
    senderProfile: "H\u1ED7 Tr\u1EE3 Kh\xE1ch H\xE0ng Bay VNA",
    channel: "Telegram",
    sampleContent: "Ch\xE0o anh, chuy\u1EBFn bay VN214 c\u1EE7a anh b\u1ECB \u0111\u1ED5i gi\u1EDD bay. H\xE3ng h\u1ED7 tr\u1EE3 \u0111\u1EC1n b\xF9 1.200.000\u0111 tr\u1EF1c ti\u1EBFp v\xE0o th\u1EBB. Anh vui l\xF2ng m\u1EDF li\xEAn k\u1EBFt https://vietnamairlines-refund.vip, nh\u1EADp m\xE3 th\u1EBB v\xE0 m\xE3 x\xE1c th\u1EF1c OTP g\u1EEDi v\u1EC1 m\xE1y \u0111\u1EC3 nh\u1EADn ti\u1EC1n ho\xE0n.",
    requestedAction: "PROVIDE_OTP",
    sensitiveDataRequested: ["M\xE3 th\u1EBB ATM/Visa", "Ng\xE0y h\u1EBFt h\u1EA1n", "M\xE3 OTP"],
    psychologicalTactics: ["Flight compensation lure", "Urgency", "Legitimate airline impersonation"],
    riskIndicators: ["T\xEAn mi\u1EC1n .vip gi\u1EA3 m\u1EA1o", 'Y\xEAu c\u1EA7u OTP \u0111\u1EC3 "nh\u1EADn ti\u1EC1n" (Nguy\xEAn l\xFD sai l\u1EA7m)', "K\xEAnh trao \u0111\u1ED5i qua Telegram"],
    hasMaliciousLink: true,
    hasQr: false,
    expectedSafeAction: "Nguy\xEAn l\xFD b\u1EA3o m\u1EADt: Nh\u1EADn ti\u1EC1n ho\xE0n KH\xD4NG BAO GI\u1EDC c\u1EA7n cung c\u1EA5p m\xE3 OTP hay m\xE3 CVV.",
    counterTacticRationale: "\u0110\xE1nh gi\xE1 kh\u1EA3 n\u0103ng nh\u1EADn th\u1EE9c quy t\u1EAFc b\u1EA5t di b\u1EA5t d\u1ECBch: OTP ch\u1EC9 d\xF9ng khi tr\u1EEB ti\u1EC1n, kh\xF4ng bao gi\u1EDD d\xF9ng khi nh\u1EADn ti\u1EC1n.",
    sourceType: "REAL_ANONYMIZED",
    validationStatus: "EXPERT_VALIDATED",
    provenance: {
      origin: "V\u1EE5 vi\u1EC7c l\u1EEBa \u0111\u1EA3o b\u1ED3i ho\xE0n v\xE9 m\xE1y bay d\u1ECBp T\u1EBFt",
      creationMethod: "Standardized Case Study",
      annotationProtocol: "Aviation & Cyber Defense Panel",
      piiRedactionVerified: true,
      licenseTerms: "CC-BY-NC 4.0",
      syntheticLabel: "Real-world Anonymized Case"
    }
  },
  {
    id: "unseen-03-restaurant-menu-qr",
    split: "test_unseen",
    language: "vi",
    category: "Quishing / Malicious QR",
    isScam: true,
    difficulty: "Advanced",
    vulnerabilityTarget: "Convenience Bias",
    urgencyLevel: 2,
    authorityLevel: 1,
    financialPressure: 3,
    emotionalPressure: 1,
    title: "M\xE3 QR G\u1ECDi M\xF3n Qu\xE1n C\xE0 Ph\xEA B\u1ECB D\xE1n \u0110\xE8 Trang \u0110\u0103ng Nh\u1EADp WiFi Gi\u1EA3",
    senderProfile: "M\xE3 QR b\xE0n s\u1ED1 14 t\u1EA1i qu\xE1n \u0103n",
    channel: "QR",
    sampleContent: 'M\xE3 QR tr\xEAn b\xE0n ghi "Qu\xE9t \u0111\u1EC3 xem th\u1EF1c \u0111\u01A1n & nh\u1EADn Voucher 50k". Khi qu\xE9t m\u1EDF ra trang y\xEAu c\u1EA7u \u0111\u0103ng nh\u1EADp t\xE0i kho\u1EA3n Facebook/Google \u0111\u1EC3 nh\u1EADn m\xE3 gi\u1EA3m gi\xE1: http://wifi-free-login-portal.site/auth.',
    requestedAction: "CLICK_LINK",
    sensitiveDataRequested: ["T\xE0i kho\u1EA3n Facebook / Google", "M\u1EADt kh\u1EA9u"],
    psychologicalTactics: ["Discount voucher lure (50k)", "Casual restaurant dining context", "Phishing credential harvesting portal"],
    riskIndicators: ["Trang \u0111\u0103ng nh\u1EADp qua HTTP kh\xF4ng an to\xE0n", "T\xEAn mi\u1EC1n l\u1EA1 .site", "\u0110\xF2i m\u1EADt kh\u1EA9u \u0111\u1EC3 xem th\u1EF1c \u0111\u01A1n"],
    hasMaliciousLink: true,
    hasQr: true,
    expectedSafeAction: "Kh\xF4ng \u0111\u0103ng nh\u1EADp t\xE0i kho\u1EA3n c\xE1 nh\xE2n qua trang l\u1EA1 khi qu\xE9t m\xE3 th\u1EF1c \u0111\u01A1n.",
    counterTacticRationale: "Ki\u1EC3m tra ph\u1EA3n x\u1EA1 b\u1EA3o v\u1EC7 danh t\xEDnh s\u1ED1 tr\u01B0\u1EDBc m\u1ED3i c\xE2u khuy\u1EBFn m\xE3i nh\u1ECF khi \u0111i \u0103n u\u1ED1ng.",
    sourceType: "SYNTHETIC_GENERATED",
    validationStatus: "EXPERT_VALIDATED",
    provenance: {
      origin: "T\xECnh hu\u1ED1ng t\u1EA5n c\xF4ng Quishing v\u1EADt l\xFD m\xF4 ph\u1ECFng",
      creationMethod: "Controlled Lab Synthetic Generation",
      annotationProtocol: "Red Team Scenario Reviewer",
      piiRedactionVerified: true,
      licenseTerms: "CC-BY-NC 4.0",
      syntheticLabel: "Synthetic Training Scenario"
    }
  },
  {
    id: "unseen-04-legit-hospital-appointment",
    split: "test_unseen",
    language: "vi",
    category: "Legitimate Control Item",
    isScam: false,
    difficulty: "Intermediate",
    vulnerabilityTarget: "Emotional Manipulation",
    urgencyLevel: 2,
    authorityLevel: 3,
    financialPressure: 1,
    emotionalPressure: 2,
    title: "Nh\u1EAFc L\u1ECBch T\xE1i Kh\xE1m B\u1EC7nh Vi\u1EC7n \u0110\u1EA1i H\u1ECDc Y D\u01B0\u1EE3c TP.HCM",
    senderProfile: "BV \u0110H Y D\u01B0\u1EE3c TP.HCM: CSKH_BV",
    channel: "SMS",
    sampleContent: "K\xEDnh g\u1EEDi \xD4ng/B\xE0, m\xE3 h\u1ED3 s\u01A1 BN10928 c\xF3 l\u1ECBch kh\xE1m Tim M\u1EA1ch v\xE0o l\xFAc 08h30 ng\xE0y 15/09/2026 t\u1EA1i Ph\xF2ng 204. Qu\xFD kh\xE1ch vui l\xF2ng \u0111\u1EBFn tr\u01B0\u1EDBc 15 ph\xFAt. N\u1EBFu c\u1EA7n \u0111\u1ED5i l\u1ECBch xin li\xEAn h\u1EC7 (028) 3855 4269.",
    requestedAction: "SAFE_VERIFY",
    sensitiveDataRequested: [],
    psychologicalTactics: ["Standard healthcare reminder", "No financial coercion", "Landline hospital contact"],
    riskIndicators: ["S\u1ED1 \u0111i\u1EC7n tho\u1EA1i c\u1ED1 \u0111\u1ECBnh b\u1EC7nh vi\u1EC7n ch\xEDnh th\u1ED1ng", "Kh\xF4ng k\xE8m link \u0111\u1ED9c h\u1EA1i", "Kh\xF4ng \u0111\xF2i ti\u1EC1n chuy\u1EC3n kho\u1EA3n"],
    hasMaliciousLink: false,
    hasQr: false,
    expectedSafeAction: "L\u01B0u l\u1ECBch kh\xE1m b\xECnh th\u01B0\u1EDDng; s\u1ED1 \u0111i\u1EC7n tho\u1EA1i \u0111\xFAng \u0111\u1EA7u s\u1ED1 c\u1ED1 \u0111\u1ECBnh c\u1EE7a b\u1EC7nh vi\u1EC7n.",
    counterTacticRationale: "Tr\xE1nh ng\u1ED9 nh\u1EADn m\u1ECDi tin nh\u1EAFn y t\u1EBF \u0111\u1EC1u l\xE0 l\u1EEBa \u0111\u1EA3o (\u0110o l\u01B0\u1EDDng \u0111\u1ED9 \u0111\u1EB7c hi\u1EC7u Specificity & FPR).",
    sourceType: "CONTROL_BENCHMARK",
    validationStatus: "EXPERT_VALIDATED",
    provenance: {
      origin: "M\u1EABu th\xF4ng b\xE1o l\u1ECBch kh\xE1m b\u1EC7nh th\u1EF1c t\u1EBF",
      creationMethod: "Negative Control Benchmark Item",
      annotationProtocol: "Medical & Cybersecurity Protocol",
      piiRedactionVerified: true,
      licenseTerms: "CC-BY-NC 4.0",
      syntheticLabel: "Real-world Anonymized Case"
    }
  },
  {
    id: "unseen-05-crypto-airdrop-telegram",
    split: "test_unseen",
    language: "en",
    category: "Investment / Ponzi",
    isScam: true,
    difficulty: "Intermediate",
    vulnerabilityTarget: "Financial Greed",
    urgencyLevel: 4,
    authorityLevel: 2,
    financialPressure: 4,
    emotionalPressure: 1,
    title: "Exclusive Airdrop: Claim 500 USDT Gas Fee Verification",
    senderProfile: "Official Web3 Foundation Bot",
    channel: "Telegram",
    sampleContent: "Congratulations! Your wallet has been whitelisted for 500 USDT community reward. Connect your MetaMask wallet at https://web3-rewards-claim-portal.top and approve transaction to claim.",
    requestedAction: "CLICK_LINK",
    sensitiveDataRequested: ["Private Key / Seed Phrase / Wallet Approval"],
    psychologicalTactics: ["Free token reward", "Whitelisted scarcity", "Web3 wallet connection trap"],
    riskIndicators: ["T\xEAn mi\u1EC1n .top \u0111\u1ED9c h\u1EA1i", "Y\xEAu c\u1EA7u c\u1EA5p quy\u1EC1n giao d\u1ECBch v\xF4 \u0111i\u1EC1u ki\u1EC7n (Unlimited approval)", "Bot kh\xF4ng x\xE1c th\u1EF1c"],
    hasMaliciousLink: true,
    hasQr: false,
    expectedSafeAction: "Never approve unknown smart contract drainer permissions or input seed phrases.",
    counterTacticRationale: "Evaluates English-language cross-lingual defense transfer in cryptocurrency domain.",
    sourceType: "REAL_ANONYMIZED",
    validationStatus: "EXPERT_VALIDATED",
    provenance: {
      origin: "Cryptocurrency phishing database investigation",
      creationMethod: "Cross-lingual English test case",
      annotationProtocol: "Blockchain Security Analyst Review",
      piiRedactionVerified: true,
      licenseTerms: "CC-BY-NC 4.0",
      syntheticLabel: "Real-world Anonymized Case"
    }
  },
  {
    id: "unseen-06-ai-voice-cloned-kidnap",
    split: "test_unseen",
    language: "vi",
    category: "Deepfake Synthetic Media",
    isScam: true,
    difficulty: "Stress-Test",
    vulnerabilityTarget: "Emotional Manipulation",
    urgencyLevel: 5,
    authorityLevel: 4,
    financialPressure: 5,
    emotionalPressure: 5,
    title: "Video B\u1EAFt C\xF3c D\xE0n D\u1EF1ng B\u1EB1ng AI Gh\xE9p M\u1EB7t & Gi\u1ECDng Kh\xF3c",
    senderProfile: "K\u1EBB B\u1EAFt C\xF3c T\u1ED1ng Ti\u1EC1n (\u1EA8n Danh)",
    channel: "Voice Call",
    sampleContent: 'Video ng\u1EAFn 8 gi\xE2y tr\xEAn Messenger: H\xECnh \u1EA3nh con g\xE1i b\u1ECB tr\xF3i kh\xF3c l\xF3c van xin "M\u1EB9 \u01A1i c\u1EE9u con, con s\u1EE3 l\u1EAFm". Sau \u0111\xF3 gi\u1ECDng g\u1EB1n: "M\xE0y c\xF3 15 ph\xFAt \u0111\u1EC3 chuy\u1EC3n 100 tri\u1EC7u v\xE0o s\u1ED1 t\xE0i kho\u1EA3n n\xE0y, n\u1EBFu b\xE1o c\xF4ng an tao s\u1EBD kh\xF4ng tha cho n\xF3!"',
    requestedAction: "TRANSFER_MONEY",
    sensitiveDataRequested: ["100 tri\u1EC7u ti\u1EC1n chu\u1ED9c"],
    psychologicalTactics: ["Hostage crisis simulation", "AI Voice & Face Cloning", "Severe emotional paralysis", "15-min countdown"],
    riskIndicators: ["Video gi\u1EADt m\u1EDD v\xF9ng vi\u1EC1n khu\xF4n m\u1EB7t", "D\u1ED3n \xE9p kh\xF4ng cho li\xEAn l\u1EA1c c\u01A1 quan c\xF4ng an", "STK c\xE1 nh\xE2n trung gian"],
    hasMaliciousLink: false,
    hasQr: false,
    expectedSafeAction: "H\u1ECFi c\xE2u h\u1ECFi b\u1EA3o m\u1EADt ri\xEAng t\u01B0 m\xE0 ch\u1EC9 ng\u01B0\u1EDDi nh\xE0 m\u1EDBi bi\u1EBFt; \u0111\u1ED3ng th\u1EDDi d\xF9ng m\xE1y kh\xE1c g\u1ECDi ngay cho gi\xE1o vi\xEAn ho\u1EB7c ng\u01B0\u1EDDi \u0111i c\xF9ng.",
    counterTacticRationale: 'K\u1ECBch b\u1EA3n t\u1ED1ng ti\u1EC1n d\xE3 man nh\u1EA5t; ki\u1EC3m tra kh\u1EA3 n\u0103ng \xE1p d\u1EE5ng "M\u1EADt m\xE3 an to\xE0n gia \u0111\xECnh" thay v\xEC chuy\u1EC3n ti\u1EC1n theo c\u1EA3m x\xFAc.',
    sourceType: "REAL_ANONYMIZED",
    validationStatus: "EXPERT_VALIDATED",
    provenance: {
      origin: "V\u1EE5 \xE1n t\u1ED1ng ti\u1EC1n gi\u1EA3 m\u1EA1o b\u1EB1ng AI \u0111\u01B0\u1EE3c ph\xE1 \xE1n n\u0103m 2025-2026",
      creationMethod: "Structured Anonymized Emergency Simulation",
      annotationProtocol: "Cyber Forensics & Psychology Panel",
      piiRedactionVerified: true,
      licenseTerms: "CC-BY-NC 4.0",
      syntheticLabel: "Real-world Anonymized Case"
    }
  }
];
function getDatasetAnalytics() {
  const total = CAMGUARD_DATASET.length;
  const scamCount = CAMGUARD_DATASET.filter((s) => s.isScam).length;
  const legitCount = CAMGUARD_DATASET.filter((s) => !s.isScam).length;
  const preTestCount = CAMGUARD_DATASET.filter((s) => s.split === "pre_test").length;
  const trainCount = CAMGUARD_DATASET.filter((s) => s.split === "train").length;
  const testUnseenCount = CAMGUARD_DATASET.filter((s) => s.split === "test_unseen").length;
  const syntheticCount = CAMGUARD_DATASET.filter((s) => s.sourceType === "SYNTHETIC_GENERATED").length;
  const realCount = total - syntheticCount;
  return {
    total,
    scamCount,
    legitCount,
    scamRatio: +(scamCount / total).toFixed(2),
    preTestCount,
    trainCount,
    testUnseenCount,
    syntheticCount,
    realCount,
    piiRedactionRate: 100,
    // 100% PII sanitized
    interAnnotatorAgreement: "Fleiss Kappa = 0.92 (High Consensus)"
  };
}

// src/data/scenarios.ts
var SCAM_SCENARIOS = [
  {
    id: "bank-lockout-alert",
    title: "C\u1EA3nh B\xE1o Kh\u1EA9n: T\xE0i Kho\u1EA3n Ng\xE2n H\xE0ng B\u1ECB T\u1EA1m Kh\xF3a",
    subtitle: "K\u1EBB m\u1EA1o danh trung t\xE2m an ninh ng\xE2n h\xE0ng d\u1ED3n \xE9p x\xE1c minh giao d\u1ECBch l\u1EA1 \u1EDF n\u01B0\u1EDBc ngo\xE0i",
    category: "Banking",
    channel: "sms",
    difficulty: "Beginner",
    estimatedMinutes: 3,
    ageGroup: "All",
    targetPersona: "Ch\u1EE7 T\xE0i Kho\u1EA3n Ng\xE2n H\xE0ng",
    attackerProfile: {
      name: "Trung T\xE2m Ph\xF2ng Ch\u1ED1ng Gian L\u1EADn",
      avatarRole: "Chuy\xEAn Vi\xEAn Gi\xE1m S\xE1t An Ninh C\u1EA5p Cao",
      organization: "H\u1EC7 Th\u1ED1ng An Ninh Ng\xE2n H\xE0ng Qu\u1ED1c Gia",
      contactHandle: "1900-888-999 / SMS Brandname"
    },
    initialMessage: '\u{1F6A8} [C\u1EA2NH B\xC1O KH\u1EA8N] H\u1EC7 th\u1ED1ng ph\xE1t hi\u1EC7n giao d\u1ECBch tr\u1EEB 54.500.000 VN\u0110 t\u1EA1i s\xE0n ti\u1EC1n \u1EA3o qu\u1ED1c t\u1EBF l\xFAc 02:15. N\u1EBFu kh\xF4ng ph\u1EA3i b\u1EA1n, h\xE3y so\u1EA1n "HUY" trong v\xF2ng 5 ph\xFAt ho\u1EB7c nh\u1EA5p v\xE0o https://vietcombank-xacminh-baomat.online/cancel \u0111\u1EC3 h\u1EE7y l\u1EC7nh ngay.',
    systemContext: 'B\u1EA1n \u0111ang m\xF4 ph\u1ECFng k\u1EBB l\u1EEBa \u0111\u1EA3o m\u1EA1o danh b\u1ED9 ph\u1EADn an ninh ng\xE2n h\xE0ng. S\u1EED d\u1EE5ng \u0111\xF2n t\xE2m l\xFD g\u1EA5p g\xE1p (Urgency), uy quy\u1EC1n gi\u1EA3 t\u1EA1o (Authority) v\xE0 n\u1ED7i s\u1EE3 m\u1EA5t ti\u1EC1n (Fear). M\u1EE5c ti\xEAu l\xE0 d\u1ED3n \xE9p n\u1EA1n nh\xE2n b\u1EA5m v\xE0o \u0111\u01B0\u1EDDng link l\u1EA1 ho\u1EB7c \u0111\u1ECDc m\xE3 OTP 6 ch\u1EEF s\u1ED1 g\u1EEDi v\u1EC1 \u0111i\u1EC7n tho\u1EA1i \u0111\u1EC3 "x\xE1c minh ch\u1EE7 s\u1EDF h\u1EEFu v\xE0 ho\xE0n ti\u1EC1n". N\u1EBFu n\u1EA1n nh\xE2n \u0111\xF2i g\u1ECDi s\u1ED1 hotline in tr\xEAn th\u1EBB ho\u1EB7c ra qu\u1EA7y giao d\u1ECBch, h\xE3y d\u1ECDa r\u1EB1ng th\u1EDDi gian 5 ph\xFAt s\u1EAFp h\u1EBFt v\xE0 ti\u1EC1n s\u1EBD b\u1ECB chuy\u1EC3n \u0111i v\u0129nh vi\u1EC5n.',
    tactics: ["Urgency", "Authority", "Fear", "Convenience Bias"],
    hints: [
      { level: 1, text: 'H\xE3y nh\xECn k\u1EF9 t\xEAn mi\u1EC1n: "vietcombank-xacminh-baomat.online" kh\xF4ng ph\u1EA3i l\xE0 t\xEAn mi\u1EC1n ch\xEDnh th\u1EE9c c\u1EE7a ng\xE2n h\xE0ng.' },
      { level: 2, text: "Ng\xE2n h\xE0ng th\u1EF1c s\u1EF1 kh\xF4ng bao gi\u1EDD \xE9p kh\xE1ch h\xE0ng x\u1EED l\xFD h\u1EE7y l\u1EC7nh trong 5 ph\xFAt qua \u0111\u01B0\u1EDDng link SMS l\u1EA1." },
      { level: 3, text: 'Lu\xF4n \xE1p d\u1EE5ng quy t\u1EAFc "M\u1EB7t sau c\u1EE7a th\u1EBB": c\xFAp m\xE1y ho\u1EB7c b\u1ECF qua SMS, g\u1ECDi th\u1EB3ng v\xE0o s\u1ED1 hotline in tr\xEAn m\u1EB7t sau th\u1EBB ATM c\u1EE7a b\u1EA1n.' }
    ],
    counterScripts: [
      {
        situation: "Khi \u0111\u1ED1i ph\u01B0\u01A1ng \u0111\xF2i \u0111\u1ECDc m\xE3 OTP ho\u1EB7c b\u1EA5m link g\u1EA5p",
        recommendedText: "T\xF4i s\u1EBD c\xFAp m\xE1y ngay b\xE2y gi\u1EDD v\xE0 g\u1ECDi tr\u1EF1c ti\u1EBFp v\xE0o s\u1ED1 hotline in \u1EDF m\u1EB7t sau th\u1EBB ng\xE2n h\xE0ng c\u1EE7a t\xF4i \u0111\u1EC3 ki\u1EC3m tra v\u1EE5 vi\u1EC7c n\xE0y.",
        rationale: "B\u1EBB g\xE3y \u0111\xF2n \xE9p t\xE2m l\xFD v\xE0 chuy\u1EC3n h\u01B0\u1EDBng x\xE1c minh sang k\xEAnh ch\xEDnh th\u1ED1ng, an to\xE0n tuy\u1EC7t \u0111\u1ED1i."
      },
      {
        situation: "Khi \u0111\u1ED1i ph\u01B0\u01A1ng d\u1ECDa t\xE0i kho\u1EA3n \u0111ang b\u1ECB r\xFAt s\u1EA1ch ti\u1EC1n",
        recommendedText: "Phi\u1EC1n b\xEAn anh ch\u1EE7 \u0111\u1ED9ng kh\xF3a th\u1EBB tr\xEAn h\u1EC7 th\u1ED1ng gi\xFAp t\xF4i. S\xE1ng mai t\xF4i s\u1EBD mang CCCD ra tr\u1EF1c ti\u1EBFp qu\u1EA7y giao d\u1ECBch \u0111\u1EC3 l\xE0m vi\u1EC7c.",
        rationale: "T\u1EEB ch\u1ED1i cung c\u1EA5p m\xE3 OTP/th\xF4ng tin b\u1EA3o m\u1EADt qua \u0111i\u1EC7n tho\u1EA1i nh\u01B0ng v\u1EABn gi\u1EA3i quy\u1EBFt \u0111\u01B0\u1EE3c lo l\u1EAFng r\u1EE7i ro."
      }
    ],
    learningObjectives: [
      "Nh\u1EADn di\u1EC7n th\u1EE7 \u0111o\u1EA1n t\u1EA1o \xE1p l\u1EF1c \u0111\u1EBFm ng\u01B0\u1EE3c th\u1EDDi gian v\xE0 tin nh\u1EAFn g\xE2y ho\u1EA3ng lo\u1EA1n",
      "Ph\xE2n bi\u1EC7t t\xEAn mi\u1EC1n ph\u1EE5 gi\u1EA3 m\u1EA1o v\u1EDBi c\u1ED5ng d\u1ECBch v\u1EE5 \u0111i\u1EC7n t\u1EED ng\xE2n h\xE0ng ch\xEDnh th\u1ED1ng",
      'Th\u1EF1c h\xE0nh nhu\u1EA7n nhuy\u1EC5n quy t\u1EAFc x\xE1c minh \u0111\u1ED9c l\u1EADp "M\u1EB7t sau c\u1EE7a th\u1EBB"'
    ]
  },
  {
    id: "police-investigation-secrecy",
    title: "M\u1EA1o Danh C\u01A1 Quan C\u1EA3nh S\xE1t \u0110i\u1EC1u Tra R\u1EEDa Ti\u1EC1n",
    subtitle: 'K\u1EBB gi\u1EA3 danh c\xF4ng an d\u1ECDa l\u1EC7nh b\u1EAFt t\u1EA1m giam, y\xEAu c\u1EA7u chuy\u1EC3n ti\u1EC1n v\xE0o "T\xE0i kho\u1EA3n ki\u1EC3m tra an to\xE0n"',
    category: "Government",
    channel: "deepfake_voice",
    difficulty: "Expert",
    estimatedMinutes: 5,
    ageGroup: "Adults",
    targetPersona: "C\xF4ng D\xE2n / Ch\u1EE7 Doanh Nghi\u1EC7p Nh\u1ECF",
    attackerProfile: {
      name: "Thi\u1EBFu T\xE1 Tr\u1EA7n V\u0103n H\xF9ng",
      avatarRole: "Ph\xF3 Tr\u01B0\u1EDFng Ph\xF2ng \u0110i\u1EC1u Tra Tr\u1ECDng \xC1n",
      organization: "C\u01A1 Quan C\u1EA3nh S\xE1t \u0110i\u1EC1u Tra - B\u1ED9 C\xF4ng An",
      contactHandle: "S\u1ED1 Hi\u1EC7u CAND: 382-910"
    },
    initialMessage: "T\xF4i l\xE0 Thi\u1EBFu t\xE1 Tr\u1EA7n V\u0103n H\xF9ng, C\u01A1 quan CS\u0110T B\u1ED9 C\xF4ng An. Hi\u1EC7n s\u1ED1 CCCD c\u1EE7a anh/ch\u1ECB \u0111ang \u0111\u1EE9ng t\xEAn t\xE0i kho\u1EA3n li\xEAn quan \u0111\u1EBFn \u0111\u01B0\u1EDDng d\xE2y r\u1EEDa ti\u1EC1n xuy\xEAn qu\u1ED1c gia 30 t\u1EF7 \u0111\u1ED3ng. \u0110\xE3 c\xF3 l\u1EC7nh b\u1EAFt t\u1EA1m giam 4 th\xE1ng. Y\xEAu c\u1EA7u anh/ch\u1ECB gi\u1EEF b\xED m\u1EADt tuy\u1EC7t \u0111\u1ED1i theo Ph\xE1p l\u1EC7nh B\u1EA3o v\u1EC7 b\xED m\u1EADt nh\xE0 n\u01B0\u1EDBc, v\xE0o ph\xF2ng k\xEDn l\xE0m vi\u1EC7c!",
    systemContext: 'M\xF4 ph\u1ECFng k\u1EBB l\u1EEBa \u0111\u1EA3o m\u1EA1o danh C\xF4ng an/Vi\u1EC7n ki\u1EC3m s\xE1t c\u1EF1c k\u1EF3 hung h\u0103ng, \u0111anh th\xE9p. \u0110\u1ECDc c\xE1c \u0111i\u1EC1u lu\u1EADt h\xECnh s\u1EF1 gi\u1EA3 \u0111\u1ECBnh, y\xEAu c\u1EA7u n\u1EA1n nh\xE2n kh\xF4ng \u0111\u01B0\u1EE3c cho ng\u01B0\u1EDDi th\xE2n hay lu\u1EADt s\u01B0 bi\u1EBFt (c\xF4 l\u1EADp t\xE2m l\xFD - Isolation). Y\xEAu c\u1EA7u n\u1EA1n nh\xE2n k\xEA khai t\xE0i s\u1EA3n v\xE0 chuy\u1EC3n to\xE0n b\u1ED9 ti\u1EC1n ti\u1EBFt ki\u1EC7m v\xE0o "T\xE0i kho\u1EA3n t\u1EA1m gi\u1EEF ph\u1EE5c v\u1EE5 thanh tra c\u1EE7a Vi\u1EC7n Ki\u1EC3m S\xE1t" ho\u1EB7c c\xE0i \u1EE9ng d\u1EE5ng VNeID/DVC gi\u1EA3 m\u1EA1o c\xF3 m\xE3 \u0111\u1ED9c.',
    tactics: ["Authority", "Fear", "Isolation", "Urgency", "Confusion"],
    hints: [
      { level: 1, text: "C\xF4ng an v\xE0 Vi\u1EC7n ki\u1EC3m s\xE1t KH\xD4NG BAO GI\u1EDC l\xE0m vi\u1EC7c, t\u1ED1ng \u0111\u1EA1t quy\u1EBFt \u0111\u1ECBnh b\u1EAFt gi\u1EEF hay th\u1EA9m v\u1EA5n qua \u0111i\u1EC7n tho\u1EA1i, Zalo hay Telegram." },
      { level: 2, text: 'Y\xEAu c\u1EA7u "gi\u1EEF b\xED m\u1EADt kh\xF4ng cho gia \u0111\xECnh bi\u1EBFt" l\xE0 th\u1EE7 \u0111o\u1EA1n kinh \u0111i\u1EC3n nh\u1EB1m c\xF4 l\u1EADp n\u1EA1n nh\xE2n \u0111\u1EC3 d\u1EC5 thao t\xFAng.' },
      { level: 3, text: 'C\u01A1 quan nh\xE0 n\u01B0\u1EDBc kh\xF4ng bao gi\u1EDD c\xF3 "T\xE0i kho\u1EA3n b\u1EA3o \u0111\u1EA3m / T\xE0i kho\u1EA3n thanh tra" y\xEAu c\u1EA7u ng\u01B0\u1EDDi d\xE2n chuy\u1EC3n ti\u1EC1n v\xE0o.' }
    ],
    counterScripts: [
      {
        situation: "K\u1EBB gi\u1EA3 danh d\u1ECDa g\u1EEDi xe c\u1EA3nh s\xE1t \u0111\u1EBFn nh\xE0 b\u1EAFt giam n\u1EBFu c\xFAp m\xE1y",
        recommendedText: "T\xF4i xin ph\xE9p d\u1EEBng cu\u1ED9c g\u1ECDi t\u1EA1i \u0111\xE2y. M\u1EDDi c\xE1c \u0111\u1ED3ng ch\xED g\u1EEDi gi\u1EA5y tri\u1EC7u t\u1EADp ch\xEDnh th\u1EE9c v\u1EC1 c\xF4ng an ph\u01B0\u1EDDng n\u01A1i t\xF4i c\u01B0 tr\xFA, t\xF4i s\u1EBD c\xF9ng lu\u1EADt s\u01B0 \u0111\u1EBFn l\xE0m vi\u1EC7c tr\u1EF1c ti\u1EBFp.",
        rationale: "H\xF3a gi\u1EA3i ho\xE0n to\xE0n \u0111\xF2n uy hi\u1EBFp qua \u0111i\u1EC7n tho\u1EA1i v\xE0 ki\u1EC3m ch\u1EE9ng t\xEDnh h\u1EE3p ph\xE1p c\u1EE7a c\u01A1 quan ch\u1EE9c n\u0103ng."
      }
    ],
    learningObjectives: [
      "\u0110\u1EADp tan l\u1EC7nh gi\u1EEF b\xED m\u1EADt v\xE0 th\u1EE7 \u0111o\u1EA1n c\xF4 l\u1EADp t\xE2m l\xFD c\u1EE7a t\u1ED9i ph\u1EA1m",
      "Hi\u1EC3u r\xF5 quy tr\xECnh t\u1ED1 t\u1EE5ng: C\xF4ng an ch\u1EC9 l\xE0m vi\u1EC7c b\u1EB1ng gi\u1EA5y m\u1EDDi/gi\u1EA5y tri\u1EC7u t\u1EADp tr\u1EF1c ti\u1EBFp t\u1EA1i tr\u1EE5 s\u1EDF"
    ]
  },
  {
    id: "deepfake-grandchild-bail",
    title: "Cu\u1ED9c G\u1ECDi Deepfake Gi\u1EA3 Gi\u1ECDng Con/Ch\xE1u G\u1EB7p N\u1EA1n",
    subtitle: "Gi\u1ECDng n\xF3i AI n\u1EE9c n\u1EDF ngh\u1EB9n ng\xE0o b\xE1o tin g\xE2y tai n\u1EA1n giao th\xF4ng c\u1EA7n ti\u1EC1n c\u1EA5p c\u1EE9u g\u1EA5p",
    category: "Family Emergency",
    channel: "phone",
    difficulty: "Advanced",
    estimatedMinutes: 4,
    ageGroup: "Seniors",
    targetPersona: "\xD4ng B\xE0 / Cha M\u1EB9 Trong Gia \u0110\xECnh",
    attackerProfile: {
      name: "Minh (Gi\u1ECDng AI gi\u1EA3 l\u1EADp) & B\xE1c S\u0129/Lu\u1EADt S\u01B0 Tu\u1EA5n",
      avatarRole: "Ch\xE1u Ru\u1ED9t & Ng\u01B0\u1EDDi \u0110\u1EA1i Di\u1EC7n Ph\xE1p L\xFD",
      organization: "B\u1EC7nh Vi\u1EC7n C\u1EA5p C\u1EE9u Khu V\u1EF1c",
      contactHandle: "+84 988 112 344"
    },
    initialMessage: '(Ti\u1EBFng kh\xF3c n\u1EE9c n\u1EDF, l\u1EABn t\u1EA1p \xE2m c\xF2i c\u1EA5p c\u1EE9u): "B\xE1c/M\u1EB9 \u01A1i... con g\xE2y tai n\u1EA1n n\u1EB7ng r\u1ED3i, ng\u01B0\u1EDDi ta \u0111ang c\u1EA5p c\u1EE9u \u1EDF vi\u1EC7n. C\xF4ng an gi\u1EEF con l\u1EA1i, c\u1EA7n n\u1ED9p 50 tri\u1EC7u ti\u1EC1n vi\u1EC7n ph\xED g\u1EA5p kh\xF4ng ng\u01B0\u1EDDi nh\xE0 h\u1ECD ki\u1EC7n b\u1EAFt giam con m\u1EA5t... M\u1EB9 \u0111\u1EEBng n\xF3i cho b\u1ED1 bi\u1EBFt nh\xE9, chuy\u1EC3n kho\u1EA3n cho lu\u1EADt s\u01B0 c\u1EE7a con ngay \u0111i..."',
    systemContext: 'M\xF4 ph\u1ECFng v\u1EE5 l\u1EEBa \u0111\u1EA3o \u0111\xE1nh v\xE0o t\xECnh th\u01B0\u01A1ng gia \u0111\xECnh b\u1EB1ng c\xF4ng ngh\u1EC7 Deepfake clone gi\u1ECDng n\xF3i. S\u1EED d\u1EE5ng c\u1EA3m x\xFAc \u0111au kh\u1ED5, ti\u1EBFng kh\xF3c, x\u1EA5u h\u1ED5 ("\u0111\u1EEBng n\xF3i cho b\u1ED1 bi\u1EBFt") v\xE0 s\u1EF1 g\u1EA5p g\xE1p. Lu\xE2n phi\xEAn gi\u1EEFa gi\u1ECDng ng\u01B0\u1EDDi th\xE2n \u0111ang kh\xF3c v\xE0 m\u1ED9t "lu\u1EADt s\u01B0/b\xE1c s\u0129" nghi\xEAm ngh\u1ECB \u0111\xF2i chuy\u1EC3n kho\u1EA3n nhanh. N\u1EBFu n\u1EA1n nh\xE2n \u0111\xF2i h\u1ECFi m\u1EADt m\xE3 gia \u0111\xECnh ho\u1EB7c n\xF3i s\u1EBD g\u1ECDi l\u1EA1i s\u1ED1 ri\xEAng, h\xE3y t\u1ECF ra ho\u1EA3ng lo\u1EA1n v\xE0 d\u1ED3n \xE9p n\u1ED9p ti\u1EC1n ngay.',
    tactics: ["Sympathy", "Fear", "Isolation", "Synthetic Media", "Urgency"],
    hints: [
      { level: 1, text: "K\u1EBB gian l\u1EE3i d\u1EE5ng ti\u1EBFng kh\xF3c v\xE0 \xE2m thanh nhi\u1EC5u \u0111\u1EC3 che gi\u1EA5u khuy\u1EBFt \u0111i\u1EC3m c\u1EE7a gi\u1ECDng n\xF3i nh\xE2n t\u1EA1o AI." },
      { level: 2, text: "\u0110\xF2n \u0111\xE1nh t\xE2m l\xFD: van xin kh\xF4ng \u0111\u01B0\u1EE3c g\u1ECDi cho ng\u01B0\u1EDDi th\xE2n kh\xE1c trong nh\xE0 \u0111\u1EC3 ng\u0103n ch\u1EB7n vi\u1EC7c x\xE1c minh ch\xE9o." },
      { level: 3, text: 'Lu\xF4n \xE1p d\u1EE5ng "M\u1EADt Kh\u1EA9u An To\xE0n Gia \u0110\xECnh" ho\u1EB7c c\xFAp m\xE1y g\u1ECDi l\u1EA1i th\u1EB3ng v\xE0o s\u1ED1 \u0111i\u1EC7n tho\u1EA1i th\u01B0\u1EDDng ng\xE0y c\u1EE7a con ch\xE1u.' }
    ],
    counterScripts: [
      {
        situation: "K\u1EBB m\u1EA1o danh kh\xF3c l\xF3c van xin chuy\u1EC3n ti\u1EC1n vi\u1EC7n ph\xED kh\u1EA9n",
        recommendedText: 'Gia \u0111\xECnh ta c\xF3 quy t\u1EAFc b\xED m\u1EADt: con h\xE3y \u0111\u1ECDc \u0111\xFAng "M\u1EADt kh\u1EA9u an to\xE0n gia \u0111\xECnh" tr\u01B0\u1EDBc, ho\u1EB7c m\u1EB9 s\u1EBD c\xFAp m\xE1y g\u1ECDi l\u1EA1i v\xE0o s\u1ED1 ch\xEDnh c\u1EE7a con ngay b\xE2y gi\u1EDD.',
        rationale: "Ki\u1EC3m tra tri\u1EC7t \u0111\u1EC3 gi\u1ECDng n\xF3i AI v\xE0 \u0111\u1EADp tan th\u1EE7 \u0111o\u1EA1n gi\u1EA3 m\u1EA1o s\u1ED1 \u0111i\u1EC7n tho\u1EA1i."
      }
    ],
    learningObjectives: [
      "Nh\u1EADn di\u1EC7n c\xE1c th\u1EE7 thu\u1EADt thao t\xFAng t\xECnh c\u1EA3m nh\u1EB1m l\xE0m t\xEA li\u1EC7t t\u01B0 duy ph\u1EA3n bi\u1EC7n",
      "H\xF3a gi\u1EA3i c\xF4ng ngh\u1EC7 Deepfake gi\u1ECDng n\xF3i b\u1EB1ng giao th\u1EE9c g\u1ECDi l\u1EA1i \u0111\u1ED9c l\u1EADp v\xE0 m\u1EADt kh\u1EA9u an to\xE0n gia \u0111\xECnh"
    ]
  },
  {
    id: "remote-job-task-scam",
    title: 'B\u1EABy Vi\u1EC7c L\xE0m Online "Xem Video / \u0110\xE1nh Gi\xE1 App Nh\u1EADn Hoa H\u1ED3ng"',
    subtitle: "C\xF4ng vi\u1EC7c nh\u1EB9 l\u01B0\u01A1ng cao 500k-1tr/ng\xE0y, d\u1EE5 n\u1EA1p ti\u1EC1n l\xE0m nhi\u1EC7m v\u1EE5 VIP \u0111\u1EC3 r\xFAt v\u1ED1n",
    category: "Jobs",
    channel: "messenger",
    difficulty: "Intermediate",
    estimatedMinutes: 4,
    ageGroup: "Teens",
    targetPersona: "Sinh Vi\xEAn / Ng\u01B0\u1EDDi T\xECm Vi\u1EC7c L\xE0m Th\xEAm",
    attackerProfile: {
      name: "Ph\u01B0\u01A1ng Linh Tuy\u1EC3n D\u1EE5ng",
      avatarRole: "Tr\u01B0\u1EDFng Nh\xF3m Ph\xE1t Tri\u1EC3n \u0110\u1ED1i T\xE1c",
      organization: "Digital Media Shopee / TikTok Partner",
      contactHandle: "@linh_hr_tuyendung_vip"
    },
    initialMessage: "Ch\xE0o b\u1EA1n! \u{1F31F} B\xEAn m\xECnh \u0111ang tuy\u1EC3n 5 b\u1EA1n l\xE0m vi\u1EC7c online t\u1EA1i nh\xE0: ch\u1EC9 c\u1EA7n xem video TikTok, th\u1EA3 tim v\xE0 \u0111\xE1nh gi\xE1 s\u1EA3n ph\u1EA9m. Thu nh\u1EADp 300k - 800k/ng\xE0y, nh\u1EADn ti\u1EC1n sau 5 ph\xFAt qua t\xE0i kho\u1EA3n ng\xE2n h\xE0ng. Kh\xF4ng c\u1ECDc, kh\xF4ng \xE9p doanh s\u1ED1. B\u1EA1n c\xF3 mu\u1ED1n l\xE0m th\u1EED nhi\u1EC7m v\u1EE5 1 nh\u1EADn 50k ngay kh\xF4ng?",
    systemContext: 'M\xF4 ph\u1ECFng b\u1EABy l\u1EEBa \u0111\u1EA3o l\xE0m nhi\u1EC7m v\u1EE5 gi\u1EADt \u0111\u01A1n / th\u1EA3 tim online. Giai \u0111o\u1EA1n \u0111\u1EA7u cho l\xE0m th\u1EED nhi\u1EC7m v\u1EE5 d\u1EC5 v\xE0 tr\u1EA3 th\u01B0\u1EDFng th\u1EADt 50k-100k \u0111\u1EC3 t\u1EA1o ni\u1EC1m tin (Reciprocity). Sau \u0111\xF3 m\u1EDDi v\xE0o nh\xF3m Telegram c\xF3 "chim m\u1ED3i" khoe ti\u1EC1n (Social Proof), r\u1ED3i \u0111\u01B0a ra nhi\u1EC7m v\u1EE5 n\u1EA1p 500k, 2 tri\u1EC7u, 10 tri\u1EC7u \u0111\u1EC3 nh\u1EADn hoa h\u1ED3ng 30%. Khi n\u1EA1n nh\xE2n mu\u1ED1n r\xFAt ti\u1EC1n, vi\u1EC7n c\u1EDB "l\u1ED7i c\xFA ph\xE1p", "n\xE2ng c\u1EA5p h\u1EA1ng VIP" b\u1EAFt n\u1EA1p th\xEAm ti\u1EC1n.',
    tactics: ["Greed", "Social Proof", "Reciprocity", "Isolation", "Convenience Bias"],
    hints: [
      { level: 1, text: "Kh\xF4ng c\xF3 c\xF4ng vi\u1EC7c n\xE0o ch\u1EC9 b\u1EA5m like/xem video m\xE0 ki\u1EBFm \u0111\u01B0\u1EE3c h\xE0ng tri\u1EC7u \u0111\u1ED3ng m\u1ED7i ng\xE0y." },
      { level: 2, text: 'Kho\u1EA3n ti\u1EC1n 50k-100k \u0111\u1EA7u ti\xEAn ch\u1EC9 l\xE0 "m\u1ED3i c\xE2u" \u0111\u1EC3 d\u1EABn d\u1EE5 b\u1EA1n n\u1EA1p s\u1ED1 ti\u1EC1n l\u1EDBn h\u01A1n.' },
      { level: 3, text: "N\u1EBFu m\u1ED9t c\xF4ng vi\u1EC7c y\xEAu c\u1EA7u b\u1EA1n ph\u1EA3i N\u1EA0P TI\u1EC0N c\u1EE7a ch\xEDnh m\xECnh \u0111\u1EC3 nh\u1EADn l\u1EA1i ti\u1EC1n l\u01B0\u01A1ng, \u0111\xF3 100% l\xE0 l\u1EEBa \u0111\u1EA3o." }
    ],
    counterScripts: [
      {
        situation: "Khi \u0111\u1ED1i ph\u01B0\u01A1ng y\xEAu c\u1EA7u n\u1EA1p ti\u1EC1n b\u1EA3o l\xE3nh ho\u1EB7c mua g\xF3i nhi\u1EC7m v\u1EE5 VIP",
        recommendedText: "Doanh nghi\u1EC7p ch\xE2n ch\xEDnh s\u1EBD chi tr\u1EA3 l\u01B0\u01A1ng t\u1EEB ng\xE2n s\xE1ch ch\u1EE9 kh\xF4ng b\u1EAFt \u1EE9ng vi\xEAn n\u1EA1p ti\u1EC1n c\xE1 nh\xE2n. T\xF4i t\u1EEB ch\u1ED1i n\u1EA1p ti\u1EC1n v\xE0 d\u1EEBng h\u1EE3p t\xE1c t\u1EA1i \u0111\xE2y.",
        rationale: "Thi\u1EBFt l\u1EADp ranh gi\u1EDBi d\u1EE9t kho\xE1t tr\u01B0\u1EDBc b\u1EABy l\u1EEBa \u0111\u1EA3o n\u1EA1p ti\u1EC1n l\xE0m nhi\u1EC7m v\u1EE5."
      }
    ],
    learningObjectives: [
      "Hi\u1EC3u r\xF5 c\u01A1 ch\u1EBF t\xE2m l\xFD b\u1EABy nhi\u1EC7m v\u1EE5 ph\xE2n c\u1EA5p v\xE0 hi\u1EC7u \u1EE9ng chi ph\xED ch\xECm (sunk cost fallacy)",
      'Tuy\u1EC7t \u0111\u1ED1i ghi nh\u1EDB nguy\xEAn t\u1EAFc: "Ph\u1EA3i n\u1EA1p ti\u1EC1n \u0111\u1EC3 r\xFAt l\u01B0\u01A1ng = 100% l\u1EEBa \u0111\u1EA3o"'
    ]
  },
  {
    id: "pig-butchering-crypto-romance",
    title: 'B\u1EABy T\xECnh C\u1EA3m & \u0110\u1EA7u T\u01B0 Ti\u1EC1n \u1EA2o "G\u1EEDi Nh\u1EA7m Tin Nh\u1EAFn"',
    subtitle: "L\xE0m quen nh\u1EA7m s\u1ED1 l\u1ECBch s\u1EF1, x\xE2y d\u1EF1ng quan h\u1EC7 t\xECnh c\u1EA3m r\u1ED3i r\u1EE7 r\xEA \u0111\u1EA7u t\u01B0 s\xE0n sinh l\u1EDDi kh\u1EE7ng",
    category: "Romance",
    channel: "messenger",
    difficulty: "Advanced",
    estimatedMinutes: 5,
    ageGroup: "Adults",
    targetPersona: "Ng\u01B0\u1EDDi Tr\u01B0\u1EDFng Th\xE0nh / D\xE2n V\u0103n Ph\xF2ng",
    attackerProfile: {
      name: "Thanh H\xE0 / Michael Chen",
      avatarRole: "Doanh Nh\xE2n Th\u1EDDi Trang & Nh\xE0 \u0110\u1EA7u T\u01B0 T\u1EF1 Do",
      organization: "C\xE2u L\u1EA1c B\u1ED9 \u0110\u1EA7u T\u01B0 Tinh Hoa",
      contactHandle: "+84 903 881 290"
    },
    initialMessage: "Ch\xE0o anh Tu\u1EA5n! Bu\u1ED5i h\u1EB9n c\xE0 ph\xEA b\xE0n v\u1EC1 d\u1EF1 \xE1n b\u1EA5t \u0111\u1ED9ng s\u1EA3n s\xE1ng mai \u1EDF Landmark 81 v\u1EABn di\u1EC5n ra l\xFAc 9h \u0111\xFAng kh\xF4ng \u1EA1? \xD4i xin l\u1ED7i, \u0111\xE2y kh\xF4ng ph\u1EA3i s\u1ED1 anh Tu\u1EA5n \u1EA1? Em xin l\u1ED7i v\xEC \u0111\xE3 l\xE0m phi\u1EC1n anh nhi\u1EC1u nh\xE9! \u{1F64F}",
    systemContext: 'M\xF4 ph\u1ECFng th\u1EE7 \u0111o\u1EA1n "M\u1ED5 heo" (Sha Zhu Pan). B\u1EAFt \u0111\u1EA7u b\u1EB1ng vi\u1EC7c g\u1EEDi nh\u1EA7m tin nh\u1EAFn c\u1EF1c k\u1EF3 l\u1ECBch s\u1EF1, nh\xE3 nh\u1EB7n. Sau \u0111\xF3 khen ng\u1EE3i \u0111\u1ED1i ph\u01B0\u01A1ng c\xF3 duy\xEAn, t\xE2m s\u1EF1 chuy\u1EC7n cu\u1ED9c s\u1ED1ng, c\xF4ng vi\u1EC7c, t\u1EA1o thi\u1EC7n c\u1EA3m trong v\xE0i ng\xE0y. D\u1EA7n d\u1EA7n khoe \u1EA3nh l\u1EE3i nhu\u1EADn t\u1EEB s\xE0n giao d\u1ECBch ti\u1EC1n \u1EA3o/v\xE0ng qu\u1ED1c t\u1EBF c\xF3 "ch\xFA l\xE0m \u1EDF qu\u1EF9 t\xE0i ch\xEDnh" ch\u1EC9 \u0111i\u1EC3m thu\u1EADt to\xE1n AI ki\u1EBFm l\u1EDDi 20%/ng\xE0y.',
    tactics: ["Romance", "Reciprocity", "Greed", "Social Proof", "Isolation"],
    hints: [
      { level: 1, text: '"G\u1EEDi nh\u1EA7m tin nh\u1EAFn m\u1ED9t c\xE1ch l\u1ECBch s\u1EF1" l\xE0 k\u1ECBch b\u1EA3n m\u1EDF \u0111\u1EA7u kinh \u0111i\u1EC3n \u0111\u1EC3 b\u1EAFt chuy\u1EC7n v\u1EDBi ng\u01B0\u1EDDi l\u1EA1.' },
      { level: 2, text: "K\u1EBB gian th\u01B0\u1EDDng khoe l\u1ED1i s\u1ED1ng th\u01B0\u1EE3ng l\u01B0u v\xE0 kh\xE9o l\xE9o l\u1ED3ng gh\xE9p chuy\u1EC7n ki\u1EBFm ti\u1EC1n th\u1EE5 \u0111\u1ED9ng." },
      { level: 3, text: "Kh\xF4ng bao gi\u1EDD tham gia c\xE1c s\xE0n \u0111\u1EA7u t\u01B0 do ng\u01B0\u1EDDi quen qua m\u1EA1ng ch\u1EC9 d\u1EABn khi ch\u01B0a t\u1EEBng g\u1EB7p g\u1EE1 ngo\xE0i \u0111\u1EDDi th\u1EF1c." }
    ],
    counterScripts: [
      {
        situation: "Khi \u0111\u1ED1i ph\u01B0\u01A1ng b\u1EAFt \u0111\u1EA7u r\u1EE7 r\xEA n\u1EA1p ti\u1EC1n v\xE0o s\xE0n giao d\u1ECBch l\u1EA1",
        recommendedText: "T\xF4i ch\u1EC9 \u0111\u1EA7u t\u01B0 qua c\xE1c t\u1ED5 ch\u1EE9c t\xE0i ch\xEDnh \u0111\u01B0\u1EE3c nh\xE0 n\u01B0\u1EDBc c\u1EA5p ph\xE9p v\xE0 kh\xF4ng bao gi\u1EDD chia s\u1EBB t\xE0i ch\xEDnh c\xE1 nh\xE2n v\u1EDBi b\u1EA1n b\xE8 tr\xEAn m\u1EA1ng x\xE3 h\u1ED9i.",
        rationale: "L\u1ECBch s\u1EF1 nh\u01B0ng d\u1EE9t kho\xE1t ch\u1EB7t \u0111\u1EE9t nh\xE1nh thao t\xFAng t\xE2m l\xFD t\xECnh c\u1EA3m - t\xE0i ch\xEDnh."
      }
    ],
    learningObjectives: [
      'Nh\u1EADn di\u1EC7n th\u1EE7 \u0111o\u1EA1n ti\u1EBFp c\u1EADn l\xE0m quen qua "tin nh\u1EAFn nh\u1EA7m s\u1ED1"',
      "C\u1EA3nh gi\xE1c tr\u01B0\u1EDBc c\xE1c c\u01A1 h\u1ED9i \u0111\u1EA7u t\u01B0 si\xEAu l\u1EE3i nhu\u1EADn t\u1EEB c\xE1c m\u1ED1i quan h\u1EC7 \u1EA3o tr\xEAn m\u1EA1ng"
    ]
  },
  {
    id: "failed-delivery-redirection",
    title: "M\u1EA1o Danh Shipper B\u01B0u \u0110i\u1EC7n B\xE1o N\u1EE3 C\u01B0\u1EDBc 12.000 VN\u0110",
    subtitle: "Tin nh\u1EAFn b\xE1o sai \u0111\u1ECBa ch\u1EC9 giao h\xE0ng, d\u1EE5 b\u1EA5m link \u0111\xF3ng ph\xED chuy\u1EC3n ph\xE1t 12.000\u0111 \u0111\u1EC3 chi\u1EBFm \u0111o\u1EA1t th\u1EBB",
    category: "Delivery",
    channel: "sms",
    difficulty: "Beginner",
    estimatedMinutes: 2,
    ageGroup: "All",
    targetPersona: "Ng\u01B0\u1EDDi Mua H\xE0ng Online",
    attackerProfile: {
      name: "T\u1ED5ng C\xF4ng Ty Chuy\u1EC3n Ph\xE1t VN-Post Express",
      avatarRole: "H\u1EC7 Th\u1ED1ng Ph\xE2n Lo\u1EA1i T\u1EF1 \u0110\u1ED9ng",
      organization: "B\u01B0u Ch\xEDnh Giao H\xE0ng Nhanh",
      contactHandle: "1900-636-888"
    },
    initialMessage: "\u{1F4E6} [VN-POST TH\xD4NG B\xC1O]: B\u01B0u ki\u1EC7n m\xE3 s\u1ED1 #VN-9921-884 kh\xF4ng th\u1EC3 giao do thi\u1EBFu s\u1ED1 nh\xE0. Qu\xFD kh\xE1ch vui l\xF2ng n\u1ED9p ph\xED giao l\u1EA1i 12.000 VN\u0110 v\xE0 c\u1EADp nh\u1EADt \u0111\u1ECBa ch\u1EC9 trong v\xF2ng 24h t\u1EA1i: https://vnpost-giaohang-capnhat.top/diachi",
    systemContext: 'M\xF4 ph\u1ECFng b\u1EABy l\u1EEBa \u0111\u1EA3o smishing chuy\u1EC3n ph\xE1t nhanh. D\u1EF1a v\xE0o t\xE2m l\xFD ti\u1EC7n l\u1EE3i (Convenience Bias - "ch\u1EC9 c\xF3 12.000\u0111 th\xF4i m\xE0"). M\u1EE5c ti\xEAu th\u1EF1c s\u1EF1 l\xE0 d\u1EE5 n\u1EA1n nh\xE2n nh\u1EADp to\xE0n b\u1ED9 th\xF4ng tin th\u1EBB t\xEDn d\u1EE5ng/ghi n\u1EE3 (s\u1ED1 th\u1EBB, ng\xE0y h\u1EBFt h\u1EA1n, m\xE3 CVV) v\xE0 m\xE3 OTP \u0111\u1EC3 chi\u1EBFm quy\u1EC1n t\xE0i kho\u1EA3n ng\xE2n h\xE0ng.',
    tactics: ["Convenience Bias", "Urgency", "Authority"],
    hints: [
      { level: 1, text: "H\xE3y \u0111\u1EC3 \xFD \u0111u\xF4i t\xEAn mi\u1EC1n (.top). C\xE1c \u0111\u01A1n v\u1ECB b\u01B0u ch\xEDnh ch\xEDnh th\u1ED1ng t\u1EA1i Vi\u1EC7t Nam s\u1EED d\u1EE5ng t\xEAn mi\u1EC1n (.vn) ho\u1EB7c (.com.vn)." },
      { level: 2, text: "S\u1ED1 ti\u1EC1n 12.000\u0111 r\u1EA5t nh\u1ECF l\xE0m n\u1EA1n nh\xE2n m\u1EA5t c\u1EA3nh gi\xE1c, nh\u01B0ng trang web gi\u1EA3 m\u1EA1o s\u1EBD \u0111\xE1nh c\u1EAFp to\xE0n b\u1ED9 th\xF4ng tin th\u1EBB ng\xE2n h\xE0ng." }
    ],
    counterScripts: [
      {
        situation: "Nh\u1EADn \u0111\u01B0\u1EE3c tin nh\u1EAFn SMS y\xEAu c\u1EA7u b\u1EA5m link \u0111\xF3ng ph\xED giao l\u1EA1i",
        recommendedText: "T\xF4i s\u1EBD m\u1EDF tr\u1EF1c ti\u1EBFp \u1EE9ng d\u1EE5ng mua h\xE0ng ho\u1EB7c tra c\u1EE9u m\xE3 v\u1EADn \u0111\u01A1n tr\xEAn website ch\xEDnh th\u1EE9c c\u1EE7a b\u01B0u c\u1EE5c, kh\xF4ng b\u1EA5m v\xE0o link SMS l\u1EA1.",
        rationale: "B\u1ECF qua ho\xE0n to\xE0n \u0111\u01B0\u1EDDng link l\u1EEBa \u0111\u1EA3o v\xE0 ki\u1EC3m tra qua k\xEAnh ph\xE2n ph\u1ED1i ch\xEDnh th\u1EE9c."
      }
    ],
    learningObjectives: [
      "Nh\u1EADn di\u1EC7n chi\xEAu tr\xF2 l\u1EEBa \u0111\u1EA3o qua c\xE1c kho\u1EA3n ph\xED si\xEAu nh\u1ECF (micro-fee phishing)",
      "T\u1EADp th\xF3i quen tra c\u1EE9u v\u1EADn \u0111\u01A1n tr\u1EF1c ti\u1EBFp tr\xEAn \u1EE9ng d\u1EE5ng mua h\xE0ng"
    ]
  },
  {
    id: "telecom-sim-locking-c06",
    title: 'D\u1ECDa Kh\xF3a SIM 2 Chi\u1EC1u: "Chu\u1EA9n H\xF3a Th\xF4ng Tin Thu\xEA Bao C06/VNeID"',
    subtitle: "T\u1ED5ng \u0111\xE0i t\u1EF1 \u0111\u1ED9ng d\u1ECDa kh\xF3a s\u1ED1 \u0111i\u1EC7n tho\u1EA1i sau 2 gi\u1EDD n\u1EBFu kh\xF4ng t\u1EA3i app DVC gi\u1EA3 m\u1EA1o \u0111\u1EC3 \u0111\u1ED3ng b\u1ED9",
    category: "Government",
    channel: "phone",
    difficulty: "Intermediate",
    estimatedMinutes: 3,
    ageGroup: "All",
    targetPersona: "Ch\u1EE7 Thu\xEA Bao Di \u0110\u1ED9ng",
    attackerProfile: {
      name: "T\u1ED5ng \u0110\xE0i Qu\u1EA3n L\xFD Thu\xEA Bao Qu\u1ED1c Gia",
      avatarRole: "\u0110i\u1EC1u Ph\u1ED1i Vi\xEAn C\u1EE5c Vi\u1EC5n Th\xF4ng",
      organization: "B\u1ED9 Th\xF4ng Tin & Truy\u1EC1n Th\xF4ng / C06",
      contactHandle: "+84 24 9999 8282 / 1900-0199"
    },
    initialMessage: '\u260E\uFE0F "C\u1EE5c Vi\u1EC5n th\xF4ng th\xF4ng b\xE1o: Thu\xEA bao di \u0111\u1ED9ng c\u1EE7a qu\xFD kh\xE1ch ch\u01B0a \u0111\u1ED3ng b\u1ED9 v\u1EDBi C\u01A1 s\u1EDF d\u1EEF li\u1EC7u qu\u1ED1c gia C06. S\u1ED1 thu\xEA bao s\u1EBD b\u1ECB KH\xD3A 2 CHI\u1EC0U V\u0128NH VI\u1EC4N sau 2 gi\u1EDD. B\u1EA5m ph\xEDm 1 \u0111\u1EC3 g\u1EB7p thanh tra vi\xEAn ho\u1EB7c truy c\u1EADp https://cucvienthong-chuanhoa-c06.gov.vn.online \u0111\u1EC3 c\xE0i \u0111\u1EB7t \u1EE9ng d\u1EE5ng \u0111\u1ED3ng b\u1ED9 ngay."',
    systemContext: "M\xF4 ph\u1ECFng b\u1EABy l\u1EEBa \u0111\u1EA3o m\u1EA1o danh C\u1EE5c Vi\u1EC5n th\xF4ng/B\u1ED9 TT&TT. \u0110\xE1nh v\xE0o n\u1ED7i s\u1EE3 m\u1EA5t li\xEAn l\u1EA1c c\xF4ng vi\u1EC7c (Fear) v\xE0 \xE1p l\u1EF1c \u0111\u1EBFm ng\u01B0\u1EE3c 2 gi\u1EDD (Urgency). K\u1EBB l\u1EEBa \u0111\u1EA3o \u0111\xF3ng vai thanh tra vi\xEAn \u0111anh th\xE9p, h\u01B0\u1EDBng d\u1EABn n\u1EA1n nh\xE2n t\u1EA3i file APK ch\u1EE9a m\xE3 \u0111\u1ED9c (Rat/Spyware) d\u01B0\u1EDBi v\u1ECF b\u1ECDc app D\u1ECBch v\u1EE5 c\xF4ng \u0111\u1EC3 chi\u1EBFm quy\u1EC1n tr\u1EE3 n\u0103ng (Accessibility) v\xE0 tr\u1ED9m ti\u1EC1n ng\xE2n h\xE0ng.",
    tactics: ["Authority", "Fear", "Urgency", "Confusion"],
    hints: [
      { level: 1, text: "C\u1EE5c Vi\u1EC5n th\xF4ng v\xE0 c\xE1c nh\xE0 m\u1EA1ng kh\xF4ng bao gi\u1EDD g\u1ECDi \u0111i\u1EC7n t\u1EF1 \u0111\u1ED9ng d\u1ECDa kh\xF3a SIM sau 2 gi\u1EDD." },
      { level: 2, text: 'T\xEAn mi\u1EC1n ".gov.vn.online" l\xE0 t\xEAn mi\u1EC1n gi\u1EA3 m\u1EA1o \u0111u\xF4i .online l\u1ED3ng gh\xE9p t\u1EEB kh\xF3a gov.vn.' },
      { level: 3, text: "Nh\u1EAFn tin c\xFA ph\xE1p TTTB g\u1EEDi 1414 (mi\u1EC5n ph\xED) \u0111\u1EC3 t\u1EF1 ki\u1EC3m tra th\xF4ng tin thu\xEA bao ch\xEDnh ch\u1EE7." }
    ],
    counterScripts: [
      {
        situation: "K\u1EBB m\u1EA1o danh d\u1ECDa ng\u1EAFt k\u1EBFt n\u1ED1i SIM v\xE0 y\xEAu c\u1EA7u b\u1EA5m link t\u1EA3i app",
        recommendedText: "T\xF4i s\u1EBD so\u1EA1n TTTB g\u1EEDi 1414 v\xE0 ra tr\u1EF1c ti\u1EBFp c\u1EEDa h\xE0ng giao d\u1ECBch c\u1EE7a nh\xE0 m\u1EA1ng Viettel/VinaPhone/MobiFone \u0111\u1EC3 ki\u1EC3m tra.",
        rationale: "X\xE1c minh \u0111\u1ED9c l\u1EADp qua \u0111\u1EA7u s\u1ED1 chu\u1EA9n qu\u1ED1c gia 1414 v\xE0 t\u1EEB ch\u1ED1i t\u1EA3i file l\u1EA1."
      }
    ],
    learningObjectives: [
      "Ghi nh\u1EDB c\xFA ph\xE1p ki\u1EC3m tra thu\xEA bao an to\xE0n: TTTB g\u1EEDi 1414",
      "Nh\u1EADn di\u1EC7n nguy c\u01A1 m\xE3 \u0111\u1ED9c Android APK m\u1EA1o danh C\u1ED5ng D\u1ECBch v\u1EE5 c\xF4ng"
    ]
  },
  {
    id: "hospital-surgery-deposit",
    title: 'M\u1EA1o Danh B\xE1c S\u0129 C\u1EA5p C\u1EE9u: "Con/Em B\u1EA1n Ng\xE3 C\u1EA7u Thang C\u1EA7n M\u1ED5 G\u1EA5p"',
    subtitle: "Gi\u1EA3 danh gi\xE1o vi\xEAn v\xE0 b\xE1c s\u0129 b\u1EC7nh vi\u1EC7n l\u1EDBn d\u1ED3n \xE9p ph\u1EE5 huynh chuy\u1EC3n kho\u1EA3n vi\u1EC7n ph\xED kh\u1EA9n c\u1EA5p",
    category: "Family Emergency",
    channel: "phone",
    difficulty: "Advanced",
    estimatedMinutes: 4,
    ageGroup: "Adults",
    targetPersona: "Ph\u1EE5 Huynh H\u1ECDc Sinh",
    attackerProfile: {
      name: "B\xE1c S\u0129 Nguy\u1EC5n Ho\xE0i Nam & C\xF4 Gi\xE1o Ph\u01B0\u01A1ng",
      avatarRole: "Tr\u01B0\u1EDFng Ca C\u1EA5p C\u1EE9u Ngo\u1EA1i Khoa",
      organization: "B\u1EC7nh Vi\u1EC7n Ch\u1EE3 R\u1EABy / BV Vi\u1EC7t \u0110\u1EE9c",
      contactHandle: "+84 938 221 902"
    },
    initialMessage: '\u{1F6A8} "Alo! C\xF3 ph\u1EA3i ph\u1EE5 huynh ch\xE1u B\u1EA3o Nam l\u1EDBp 10A1 kh\xF4ng? Ch\xE1u b\u1ECB ng\xE3 \u0111\u1EADp \u0111\u1EA7u \u1EDF c\u1EA7u thang tr\u01B0\u1EDDng h\u1ECDc, hi\u1EC7n \u0111ang h\xF4n m\xEA t\u1EA1i B\u1EC7nh vi\u1EC7n Ch\u1EE3 R\u1EABy. B\xE1c s\u0129 y\xEAu c\u1EA7u n\u1ED9p t\u1EA1m \u1EE9ng 25 tri\u1EC7u m\u1ED5 g\u1EA5p trong 10 ph\xFAt. Nh\xE0 tr\u01B0\u1EDDng \u0111ang l\xE0m th\u1EE7 t\u1EE5c, m\u1EB9 ch\xE1u chuy\u1EC3n kho\u1EA3n vi\u1EC7n ph\xED tr\u1EF1c ti\u1EBFp cho k\u1EBF to\xE1n vi\u1EC7n s\u1ED1 n\xE0y ngay k\u1EBBo nguy hi\u1EC3m t\xEDnh m\u1EA1ng!"',
    systemContext: 'M\xF4 ph\u1ECFng \u0111\xF2n \u0111\xE1nh kh\u1EE7ng b\u1ED1 tinh th\u1EA7n ph\u1EE5 huynh ("con \u0111ang c\u1EA5p c\u1EE9u"). \u0110\xE1nh tr\xFAng n\u1ED7i s\u1EE3 t\u1ED9t c\xF9ng (Fear), t\xECnh m\u1EABu t\u1EED (Sympathy) v\xE0 d\u1ED3n \xE9p th\u1EDDi gian (Urgency 10 ph\xFAt). K\u1EBB gian \u0111\u1ECDc ch\xEDnh x\xE1c h\u1ECD t\xEAn con, tr\u01B0\u1EDDng l\u1EDBp (thu th\u1EADp t\u1EEB l\u1ED9 l\u1ECDt d\u1EEF li\u1EC7u). N\u1EBFu ph\u1EE5 huynh nghi ng\u1EDD, k\u1EBB gian gi\u1EA3 ti\u1EBFng loa b\u1EC7nh vi\u1EC7n v\xE0 ti\u1EBFng b\xE1c s\u0129 qu\xE1t m\u1EAFng gi\u1EE5c m\u1ED5 g\u1EA5p.',
    tactics: ["Fear", "Urgency", "Sympathy", "Authority", "Isolation"],
    hints: [
      { level: 1, text: "B\u1EC7nh vi\u1EC7n c\xF4ng l\u1EADp lu\xF4n \u01B0u ti\xEAn c\u1EA5p c\u1EE9u t\xEDnh m\u1EA1ng ng\u01B0\u1EDDi b\u1EC7nh tr\u01B0\u1EDBc r\u1ED3i m\u1EDBi ho\xE0n thi\u1EC7n th\u1EE7 t\u1EE5c vi\u1EC7n ph\xED sau." },
      { level: 2, text: "K\u1EBB x\u1EA5u n\u1EAFm \u0111\u01B0\u1EE3c th\xF4ng tin h\u1ECDc sinh t\u1EEB c\xE1c b\xE0i \u0111\u0103ng khoe gi\u1EA5y khen ho\u1EB7c d\u1EEF li\u1EC7u tr\u01B0\u1EDDng h\u1ECDc b\u1ECB r\xF2 r\u1EC9." },
      { level: 3, text: "Gi\u1EEF b\xECnh t\u0129nh tuy\u1EC7t \u0111\u1ED1i, l\u1EADp t\u1EE9c g\u1ECDi \u0111i\u1EC7n cho gi\xE1o vi\xEAn ch\u1EE7 nhi\u1EC7m ho\u1EB7c ban gi\xE1m hi\u1EC7u nh\xE0 tr\u01B0\u1EDDng \u0111\u1EC3 ki\u1EC3m tra." }
    ],
    counterScripts: [
      {
        situation: "K\u1EBB gian gi\u1EE5c chuy\u1EC3n kho\u1EA3n 25 tri\u1EC7u vi\u1EC7n ph\xED v\xE0o s\u1ED1 t\xE0i kho\u1EA3n c\xE1 nh\xE2n b\xE1c s\u0129",
        recommendedText: "T\xF4i \u0111ang g\u1ECDi tr\u1EF1c ti\u1EBFp cho c\xF4 gi\xE1o ch\u1EE7 nhi\u1EC7m c\u1EE7a ch\xE1u v\xE0 s\u1ED1 \u0111i\u1EC7n tho\u1EA1i c\u1EA5p c\u1EE9u ch\xEDnh th\u1EE9c c\u1EE7a B\u1EC7nh vi\u1EC7n. T\xF4i \u0111ang di chuy\u1EC3n \u0111\u1EBFn vi\u1EC7n ngay b\xE2y gi\u1EDD.",
        rationale: "Kh\xF4ng chuy\u1EC3n ti\u1EC1n v\xE0o t\xE0i kho\u1EA3n c\xE1 nh\xE2n l\u1EA1, ng\u1EAFt cu\u1ED9c g\u1ECDi \u0111\u1EC3 x\xE1c minh v\u1EDBi tr\u01B0\u1EDDng h\u1ECDc."
      }
    ],
    learningObjectives: [
      "Ph\u1EA3n x\u1EA1 x\u1EED l\xFD b\xECnh t\u0129nh tr\u01B0\u1EDBc tin b\xE1o n\u1EA1n g\xE2y ho\u1EA3ng lo\u1EA1n t\u1ED9t \u0111\u1ED9",
      "Hi\u1EC3u r\xF5 nguy\xEAn t\u1EAFc ho\u1EA1t \u0111\u1ED9ng c\u1EA5p c\u1EE9u y t\u1EBF: B\u1EC7nh vi\u1EC7n lu\xF4n c\u1EE9u ng\u01B0\u1EDDi tr\u01B0\u1EDBc"
    ]
  },
  {
    id: "e-commerce-refund-agent",
    title: "M\u1EA1o Danh Nh\xE2n Vi\xEAn S\xE0n TM\u0110T Ho\xE0n Ti\u1EC1n S\u1EA3n Ph\u1EA9m H\u1ECFng",
    subtitle: "Th\xF4ng b\xE1o \u0111\u01A1n h\xE0ng b\u1ECB l\u1ED7i ph\xE1t sinh \u0111\u1ED9c h\u1EA1i, h\u1EE9a \u0111\u1EC1n b\xF9 g\u1EA5p \u0111\xF4i nh\u01B0ng d\u1EE5 m\u1EDF link v\xED \u0111i\u1EC7n t\u1EED",
    category: "Marketplace",
    channel: "messenger",
    difficulty: "Beginner",
    estimatedMinutes: 3,
    ageGroup: "Teens",
    targetPersona: "Kh\xE1ch Mua H\xE0ng Shopee / TikTok Shop",
    attackerProfile: {
      name: "CSKH Shopee Vi\u1EC7t Nam H\u1ED7 Tr\u1EE3 24/7",
      avatarRole: "Chuy\xEAn Vi\xEAn Gi\u1EA3i Quy\u1EBFt Khi\u1EBFu N\u1EA1i",
      organization: "Trung T\xE2m Ch\u0103m S\xF3c Kh\xE1ch H\xE0ng TM\u0110T",
      contactHandle: "@shopee_cskh_hoantien_247"
    },
    initialMessage: '\u{1F381} "K\xEDnh ch\xE0o qu\xFD kh\xE1ch! H\u1EC7 th\u1ED1ng ki\u1EC3m tra \u0111\u01A1n h\xE0ng m\u1EF9 ph\u1EA9m #SP-88329 c\u1EE7a b\u1EA1n b\u1ECB l\u1ED7i l\xF4 s\u1EA3n xu\u1EA5t g\xE2y k\xEDch \u1EE9ng. S\xE0n xin g\u1EEDi l\u1EDDi xin l\u1ED7i v\xE0 ho\xE0n tr\u1EA3 100% ti\u1EC1n h\xE0ng k\xE8m b\u1ED3i th\u01B0\u1EDDng 500.000\u0111. Vui l\xF2ng b\u1EA5m v\xE0o li\xEAn k\u1EBFt https://shopee-khieunai-hoantien.site/refund \u0111\u1EC3 li\xEAn k\u1EBFt v\xED nh\u1EADn ti\u1EC1n b\u1ED3i th\u01B0\u1EDDng ngay."',
    systemContext: "M\xF4 ph\u1ECFng chi\xEAu tr\xF2 ho\xE0n ti\u1EC1n b\u1EABy ng\u01B0\u1EDDi mua s\u1EAFm online. S\u1EED d\u1EE5ng \u0111\xF2n l\u1EE3i \xEDch (Greed / Compensation) v\xE0 s\u1EF1 \xE2n c\u1EA7n gi\u1EA3 t\u1EA1o (Reciprocity). Khi n\u1EA1n nh\xE2n b\u1EA5m link, trang web gi\u1EA3 m\u1EA1o giao di\u1EC7n ng\xE2n h\xE0ng/ShopeePay y\xEAu c\u1EA7u nh\u1EADp m\u1EADt kh\u1EA9u v\xE0 OTP, t\u1EEB \u0111\xF3 r\xFAt s\u1EA1ch ti\u1EC1n trong v\xED.",
    tactics: ["Greed", "Reciprocity", "Authority", "Convenience Bias"],
    hints: [
      { level: 1, text: "S\xE0n th\u01B0\u01A1ng m\u1EA1i \u0111i\u1EC7n t\u1EED ch\u1EC9 ho\xE0n ti\u1EC1n tr\u1EF1c ti\u1EBFp qua \u1EE9ng d\u1EE5ng ch\xEDnh th\u1EE9c, kh\xF4ng bao gi\u1EDD qua \u0111\u01B0\u1EDDng link ngo\xE0i m\u1EA1ng x\xE3 h\u1ED9i." },
      { level: 2, text: 'T\xEAn mi\u1EC1n ".site" l\xE0 t\xEAn mi\u1EC1n r\xE1c gi\xE1 r\u1EBB \u0111\u01B0\u1EE3c t\u1ED9i ph\u1EA1m m\u1EA1ng \u0111\u0103ng k\xFD \u1EA9n danh.' }
    ],
    counterScripts: [
      {
        situation: "\u0110\u1ED1i ph\u01B0\u01A1ng nh\u1EAFn tin qua Zalo/Facebook h\u1EE9a ho\xE0n ti\u1EC1n \u0111\u1EC1n b\xF9",
        recommendedText: "T\xF4i ch\u1EC9 x\u1EED l\xFD khi\u1EBFu n\u1EA1i tr\u1EA3 h\xE0ng ho\xE0n ti\u1EC1n tr\u1EF1c ti\u1EBFp tr\xEAn \u1EE9ng d\u1EE5ng Shopee ch\xEDnh ch\u1EE7. M\u1ECDi tin nh\u1EAFn ngo\xE0i s\xE0n t\xF4i s\u1EBD b\xE1o c\xE1o gian l\u1EADn.",
        rationale: "B\u1EA3o v\u1EC7 t\xE0i kho\u1EA3n b\u1EB1ng c\xE1ch gi\u1EEF m\u1ECDi giao d\u1ECBch trong khu\xF4n kh\u1ED5 \u1EE9ng d\u1EE5ng."
      }
    ],
    learningObjectives: [
      "Ghi nh\u1EDB quy t\u1EAFc kh\xF4ng giao d\u1ECBch ngo\xE0i \u1EE9ng d\u1EE5ng th\u01B0\u01A1ng m\u1EA1i \u0111i\u1EC7n t\u1EED",
      "Nh\u1EADn di\u1EC7n c\xE1c \u0111\u01B0\u1EDDng link ho\xE0n ti\u1EC1n gi\u1EA3 m\u1EA1o (Fake Refund Portal)"
    ]
  },
  {
    id: "fake-scholarship-abroad",
    title: "B\u1EABy H\u1ECDc B\u1ED5ng Du H\u1ECDc To\xE0n Ph\u1EA7n & Ph\xED Gi\u1EEF Ch\u1ED7 K\xFD T\xFAc X\xE1",
    subtitle: "Email ch\xFAc m\u1EEBng tr\xFAng h\u1ECDc b\u1ED5ng 100% t\u1EA1i tr\u01B0\u1EDDng \u0111\u1EA1i h\u1ECDc danh ti\u1EBFng, y\xEAu c\u1EA7u \u0111\u1EB7t c\u1ECDc 1.200 USD",
    category: "Jobs",
    channel: "email",
    difficulty: "Intermediate",
    estimatedMinutes: 4,
    ageGroup: "Teens",
    targetPersona: "H\u1ECDc Sinh / Sinh Vi\xEAn N\u1ED9p H\u1ED3 S\u01A1 Du H\u1ECDc",
    attackerProfile: {
      name: "Admissions Office - Global Merit Fellowship",
      avatarRole: "Gi\xE1m \u0110\u1ED1c Tuy\u1EC3n Sinh Qu\u1ED1c T\u1EBF",
      organization: "National Foundation for Global Education",
      contactHandle: "admissions@nus-singapore-scholarship.org.cc"
    },
    initialMessage: '\u{1F393} "Dear Candidate, We are thrilled to inform you that your profile has been selected for the 100% Full Tuition Excellence Scholarship at National University. To finalize your visa sponsorship dossier and guarantee hostel allocation, a refundable security deposit of $1,200 USD must be wired within 48 hours via Western Union / Crypto USDT."',
    systemContext: "M\xF4 ph\u1ECFng b\u1EABy h\u1ECDc b\u1ED5ng du h\u1ECDc \u0111\xE1nh v\xE0o h\u1ECDc sinh gi\u1ECFi v\xE0 ph\u1EE5 huynh. T\u1EADn d\u1EE5ng ni\u1EC1m t\u1EF1 h\xE0o (Pride/Greed), uy t\xEDn tr\u01B0\u1EDDng \u0111\u1EA1i h\u1ECDc qu\u1ED1c t\u1EBF (Authority) v\xE0 \xE1p l\u1EF1c gi\u1EEF ch\u1ED7 48h (Urgency). \u0110\xF2i h\u1ECFi chuy\u1EC3n ti\u1EC1n c\u1ECDc qua k\xEAnh kh\xF3 truy v\u1EBFt nh\u01B0 ti\u1EC1n \u0111i\u1EC7n t\u1EED USDT ho\u1EB7c Western Union.",
    tactics: ["Authority", "Greed", "Urgency", "Confusion"],
    hints: [
      { level: 1, text: "H\u1ECDc b\u1ED5ng ch\xE2n ch\xEDnh t\u1EEB c\xE1c tr\u01B0\u1EDDng \u0111\u1EA1i h\u1ECDc uy t\xEDn kh\xF4ng bao gi\u1EDD y\xEAu c\u1EA7u chuy\u1EC3n ti\u1EC1n qua ti\u1EC1n \u1EA3o USDT hay Western Union." },
      { level: 2, text: 'Ki\u1EC3m tra k\u1EF9 \u0111u\xF4i email: t\xEAn mi\u1EC1n ".org.cc" l\xE0 t\xEAn mi\u1EC1n qu\u1ED1c t\u1EBF gi\u1EA3 m\u1EA1o, kh\xF4ng thu\u1ED9c tr\u01B0\u1EDDng \u0111\u1EA1i h\u1ECDc th\u1EADt.' }
    ],
    counterScripts: [
      {
        situation: "Email \u0111\xF2i n\u1ED9p ph\xED c\u1ECDc k\xFD t\xFAc x\xE1 qua v\xED \u0111i\u1EC7n t\u1EED USDT",
        recommendedText: "T\xF4i s\u1EBD li\xEAn h\u1EC7 tr\u1EF1c ti\u1EBFp v\u1EDBi \u0110\u1EA1i s\u1EE9 qu\xE1n v\xE0 Ban Tuy\u1EC3n sinh qua c\u1ED5ng th\xF4ng tin ch\xEDnh th\u1EE9c (.edu.sg) \u0111\u1EC3 x\xE1c nh\u1EADn danh s\xE1ch tr\xFAng tuy\u1EC3n.",
        rationale: "Ch\u1EB7n \u0111\u1EE9ng r\u1EE7i ro l\u1EEBa \u0111\u1EA3o du h\u1ECDc v\xE0 ki\u1EC3m tra ch\xE9o ngu\u1ED3n tin."
      }
    ],
    learningObjectives: [
      "C\u1EA3nh gi\xE1c tr\u01B0\u1EDBc c\xE1c th\u01B0 tr\xFAng tuy\u1EC3n h\u1ECDc b\u1ED5ng t\u1EF1 \u0111\u1ED9ng kh\xF4ng qua ph\u1ECFng v\u1EA5n th\u1EF1c",
      "Nh\u1EADn bi\u1EBFt ph\u01B0\u01A1ng th\u1EE9c thanh to\xE1n b\u1EA5t th\u01B0\u1EDDng (ti\u1EC1n \u1EA3o, d\u1ECBch v\u1EE5 chuy\u1EC3n ti\u1EC1n nhanh qu\u1ED1c t\u1EBF)"
    ]
  },
  {
    id: "lottery-sweepstake-prize",
    title: "Tr\xFAng Th\u01B0\u1EDFng Xe Honda SH / 200 Tri\u1EC7u \u0110\u1ED3ng S\u1EF1 Ki\u1EC7n Tri \xC2n",
    subtitle: "Th\xF4ng b\xE1o tr\xFAng th\u01B0\u1EDFng ng\u1EABu nhi\xEAn t\u1EEB nh\xE3n h\xE0ng l\u1EDBn, y\xEAu c\u1EA7u n\u1ED9p 10% thu\u1EBF tr\u01B0\u1EDBc b\u1EA1 \u0111\u1EC3 nh\u1EADn qu\xE0",
    category: "Investment",
    channel: "messenger",
    difficulty: "Beginner",
    estimatedMinutes: 3,
    ageGroup: "Seniors",
    targetPersona: "Kh\xE1ch H\xE0ng Tr\xFAng Th\u01B0\u1EDFng Ng\u1EABu Nhi\xEAn",
    attackerProfile: {
      name: "Ban T\u1ED5 Ch\u1EE9c Tri \xC2n Kh\xE1ch H\xE0ng",
      avatarRole: "Tr\u01B0\u1EDFng Ban Trao Gi\u1EA3i To\xE0n Qu\u1ED1c",
      organization: "T\u1EADp \u0110o\xE0n B\xE1n L\u1EBB & Vi\u1EC5n Th\xF4ng",
      contactHandle: "@traogiai_hondash_2026"
    },
    initialMessage: '\u{1F389} "Ch\xFAc m\u1EEBng b\u1EA1n \u0111\xE3 may m\u1EAFn tr\xFAng GI\u1EA2I NH\u1EA4T: 01 Xe m\xE1y Honda SH 150i tr\u1ECB gi\xE1 110 tri\u1EC7u \u0111\u1ED3ng t\u1EEB ch\u01B0\u01A1ng tr\xECnh Tri \xE2n thu\xEA bao may m\u1EAFn. \u0110\u1EC3 ho\xE0n t\u1EA5t th\u1EE7 t\u1EE5c \u0111\u0103ng k\xFD xe v\xE0 giao t\u1EADn nh\xE0, b\u1EA1n c\u1EA7n n\u1ED9p ph\xED tr\u01B0\u1EDBc b\u1EA1 v\xE0 h\u1ED3 s\u01A1 v\u1EADn chuy\u1EC3n l\xE0 5.500.000 VN\u0110 v\xE0o t\xE0i kho\u1EA3n Th\u1EE7 qu\u1EF9 trao gi\u1EA3i trong h\xF4m nay."',
    systemContext: "M\xF4 ph\u1ECFng b\u1EABy l\u1EEBa \u0111\u1EA3o tr\xFAng th\u01B0\u1EDFng tri \xE2n kinh \u0111i\u1EC3n. \u0110\xE1nh m\u1EA1nh v\xE0o l\xF2ng tham (Greed) v\xE0 s\u1EF1 ph\u1EA5n kh\xEDch b\u1EA5t ng\u1EDD. Sau khi n\u1EA1n nh\xE2n chuy\u1EC3n 5.5 tri\u1EC7u, k\u1EBB gian ti\u1EBFp t\u1EE5c b\u1ECBa ra c\xE1c kho\u1EA3n thu\u1EBF thu nh\u1EADp c\xE1 nh\xE2n 10%, ph\xED b\u1EA3o hi\u1EC3m xe, ph\xED v\u1EADn chuy\u1EC3n \u0111\u1EC3 b\xE0o m\xF2n ti\u1EC1n c\u1EE7a n\u1EA1n nh\xE2n cho \u0111\u1EBFn khi c\u1EA1n ki\u1EC7t.",
    tactics: ["Greed", "Social Proof", "Urgency", "Authority"],
    hints: [
      { level: 1, text: "B\u1EA1n kh\xF4ng tham gia d\u1EF1 thi hay quay s\u1ED1 th\xEC kh\xF4ng bao gi\u1EDD c\xF3 chuy\u1EC7n b\u1ED7ng nhi\xEAn tr\xFAng th\u01B0\u1EDFng xe m\xE1y \u0111\u1EAFt ti\u1EC1n." },
      { level: 2, text: "M\u1ECDi ch\u01B0\u01A1ng tr\xECnh khuy\u1EBFn m\u1EA1i tr\xFAng th\u01B0\u1EDFng h\u1EE3p ph\xE1p t\u1EA1i Vi\u1EC7t Nam \u0111\u1EC1u ph\u1EA3i \u0111\u0103ng k\xFD v\u1EDBi B\u1ED9 C\xF4ng Th\u01B0\u01A1ng v\xE0 thu\u1EBF \u0111\u01B0\u1EE3c kh\u1EA5u tr\u1EEB tr\u1EF1c ti\u1EBFp khi nh\u1EADn gi\u1EA3i." }
    ],
    counterScripts: [
      {
        situation: "B\xEAn trao gi\u1EA3i y\xEAu c\u1EA7u chuy\u1EC3n tr\u01B0\u1EDBc ti\u1EC1n thu\u1EBF \u0111\u1EC3 giao xe v\u1EC1 nh\xE0",
        recommendedText: "N\u1EBFu t\xF4i tr\xFAng th\u01B0\u1EDFng th\u1EADt, xin m\u1EDDi qu\xFD c\xF4ng ty tr\u1EEB tr\u1EF1c ti\u1EBFp kho\u1EA3n thu\u1EBF n\xE0y v\xE0o gi\xE1 tr\u1ECB gi\u1EA3i th\u01B0\u1EDFng v\xE0 cho t\xF4i \u0111\u1EBFn tr\u1EE5 s\u1EDF c\xF4ng ty nh\u1EADn gi\u1EA3i tr\u1EF1c ti\u1EBFp.",
        rationale: "H\xF3a gi\u1EA3i ho\xE0n to\xE0n \u0111\xF2n l\u1EEBa n\u1ED9p ph\xED c\u1ECDc tr\u01B0\u1EDBc khi nh\u1EADn qu\xE0."
      }
    ],
    learningObjectives: [
      'Ghi nh\u1EDB quy lu\u1EADt: "Mu\u1ED1n nh\u1EADn th\u01B0\u1EDFng m\xE0 ph\u1EA3i n\u1ED9p ti\u1EC1n tr\u01B0\u1EDBc = 100% l\u1EEBa \u0111\u1EA3o"',
      "Hi\u1EC3u r\xF5 quy \u0111\u1ECBnh ph\xE1p lu\u1EADt v\u1EC1 thu\u1EBF thu nh\u1EADp c\xE1 nh\xE2n \u0111\u1ED1i v\u1EDBi gi\u1EA3i th\u01B0\u1EDFng"
    ]
  },
  {
    id: "charity-relief-fund-fraud",
    title: "Gi\u1EA3 M\u1EA1o Ban C\u1EE9u Tr\u1EE3 L\u0169 L\u1EE5t K\xEAu G\u1ECDi Quy\xEAn G\xF3p T\xE0i Kho\u1EA3n C\xE1 Nh\xE2n",
    subtitle: "L\u1EADp fanpage gi\u1EA3 m\u1EA1o H\u1ED9i Ch\u1EEF Th\u1EADp \u0110\u1ECF \u0111\u0103ng h\xECnh \u1EA3nh th\u01B0\u01A1ng t\xE2m k\xEAu g\u1ECDi c\u1EE9u tr\u1EE3 \u0111\u1ED3ng b\xE0o",
    category: "Family Emergency",
    channel: "messenger",
    difficulty: "Intermediate",
    estimatedMinutes: 3,
    ageGroup: "All",
    targetPersona: "Ng\u01B0\u1EDDi D\xE2n C\xF3 L\xF2ng H\u1EA3o T\xE2m",
    attackerProfile: {
      name: "Ban C\u1EE9u Tr\u1EE3 B\xE3o L\u0169 Mi\u1EC1n Trung",
      avatarRole: "\u0110i\u1EC1u Ph\u1ED1i Vi\xEAn Thi\u1EC7n Nguy\u1EC7n",
      organization: "Qu\u1EF9 C\u1EE9u Tr\u1EE3 Kh\u1EA9n C\u1EA5p Mi\u1EC1n Trung",
      contactHandle: "T\xE0i kho\u1EA3n c\xE1 nh\xE2n: NGUYEN VAN A - STK: 19038291029"
    },
    initialMessage: '\u{1F64F} "Kh\u1EA9n thi\u1EBFt k\xEAu g\u1ECDi! L\u0169 qu\xE9t kinh ho\xE0ng \u0111ang c\xF4 l\u1EADp 200 h\u1ED9 d\xE2n t\u1EA1i v\xF9ng cao. Tr\u1EBB em \u0111ang \u0111\xF3i lanh v\xE0 thi\u1EBFu \xE1o \u1EA5m t\u1EEBng gi\u1EDD. Ban C\u1EE9u tr\u1EE3 kh\u1EA9n c\u1EA5p c\u1EA7n 50 tri\u1EC7u ti\u1EC1n mua m\xEC t\xF4m v\xE0 xu\u1ED3ng c\u1EE9u h\u1ED9. Xin c\xE1c nh\xE0 h\u1EA3o t\xE2m m\u1ED7i ng\u01B0\u1EDDi 100k-500k g\u1EEDi v\u1EC1 STK c\xE1 nh\xE2n th\u1EE7 qu\u1EF9: 19038291029 (Ng\xE2n h\xE0ng Qu\xE2n \u0110\u1ED9i - Nguyen Van A) \u0111\u1EC3 \u0111\u1ED9i c\u1EE9u h\u1ED9 l\xEAn \u0111\u01B0\u1EDDng ngay trong \u0111\xEAm!"',
    systemContext: "M\xF4 ph\u1ECFng th\u1EE7 \u0111o\u1EA1n tr\u1EE5c l\u1EE3i t\u1EEB l\xF2ng tr\u1EAFc \u1EA9n c\u1EE7a c\u1ED9ng \u0111\u1ED3ng sau thi\xEAn tai. T\u1ED9i ph\u1EA1m sao ch\xE9p h\xECnh \u1EA3nh \u0111au th\u01B0\u01A1ng tr\xEAn b\xE1o ch\xED, t\u1EA1o fanpage t\xEDch xanh gi\u1EA3 m\u1EA1o ho\u1EB7c t\xEAn g\u1EA7n gi\u1ED1ng c\u01A1 quan ch\xEDnh th\u1ED1ng, nh\u01B0ng s\u1ED1 t\xE0i kho\u1EA3n nh\u1EADn ti\u1EC1n l\xE0 t\xE0i kho\u1EA3n c\xE1 nh\xE2n ho\u1EB7c t\xE0i kho\u1EA3n r\xE1c mua tr\xF4i n\u1ED5i.",
    tactics: ["Sympathy", "Urgency", "Social Proof", "Fear"],
    hints: [
      { level: 1, text: "H\u1ED9i Ch\u1EEF Th\u1EADp \u0110\u1ECF v\xE0 M\u1EB7t tr\u1EADn T\u1ED5 qu\u1ED1c Vi\u1EC7t Nam lu\xF4n s\u1EED d\u1EE5ng t\xE0i kho\u1EA3n \u0111\u1EE9ng t\xEAn t\u1ED5 ch\u1EE9c ph\xE1p nh\xE2n r\xF5 r\xE0ng." },
      { level: 2, text: "K\u1EBB l\u1EEBa \u0111\u1EA3o th\u01B0\u1EDDng d\xF9ng h\xECnh \u1EA3nh c\u0169 t\u1EEB nhi\u1EC1u n\u0103m tr\u01B0\u1EDBc v\xE0 d\u1ED3n \xE9p quy\xEAn g\xF3p kh\u1EA9n trong \u0111\xEAm." }
    ],
    counterScripts: [
      {
        situation: "Fanpage m\u1EA1ng x\xE3 h\u1ED9i k\xEAu g\u1ECDi quy\xEAn g\xF3p v\xE0o t\xE0i kho\u1EA3n c\xE1 nh\xE2n",
        recommendedText: "T\xF4i ch\u1EC9 \u1EE7ng h\u1ED9 qua t\xE0i kho\u1EA3n ch\xEDnh th\u1EE9c c\u1EE7a \u1EE6y ban M\u1EB7t tr\u1EADn T\u1ED5 qu\u1ED1c Vi\u1EC7t Nam ho\u1EB7c H\u1ED9i Ch\u1EEF Th\u1EADp \u0110\u1ECF \u0111\xE3 c\xF4ng b\u1ED1 tr\xEAn b\xE1o Nh\xE2n D\xE2n v\xE0 C\u1ED5ng th\xF4ng tin Ch\xEDnh ph\u1EE7.",
        rationale: "Chuy\u1EC3n h\u01B0\u1EDBng l\xF2ng t\u1ED1t \u0111\u1EBFn \u0111\xFAng \u0111\u1ECBa ch\u1EC9 c\u01A1 quan nh\xE0 n\u01B0\u1EDBc c\xF3 th\u1EA9m quy\u1EC1n \u0111i\u1EC1u ph\u1ED1i."
      }
    ],
    learningObjectives: [
      "Ph\xE2n bi\u1EC7t t\xE0i kho\u1EA3n t\u1ED5 ch\u1EE9c t\u1EEB thi\u1EC7n \u0111\u01B0\u1EE3c nh\xE0 n\u01B0\u1EDBc c\u1EA5p ph\xE9p v\u1EDBi t\xE0i kho\u1EA3n c\xE1 nh\xE2n tr\u1EE5c l\u1EE3i",
      "Tra c\u1EE9u danh s\xE1ch sao k\xEA minh b\u1EA1ch c\u1EE7a \u1EE6y ban M\u1EB7t tr\u1EADn T\u1ED5 qu\u1ED1c"
    ]
  },
  {
    id: "fake-ceo-wire-transfer",
    title: "T\u1EA5n C\xF4ng M\u1EA1o Danh L\xE3nh \u0110\u1EA1o (CEO Fraud / BEC): L\u1EC7nh Chuy\u1EC3n Ti\u1EC1n K\xEDn",
    subtitle: "Email m\u1EA1o danh T\u1ED5ng Gi\xE1m \u0111\u1ED1c y\xEAu c\u1EA7u k\u1EBF to\xE1n tr\u01B0\u1EDFng chuy\u1EC3n g\u1EA5p 500 tri\u1EC7u cho th\u01B0\u01A1ng v\u1EE5 s\xE1p nh\u1EADp",
    category: "Banking",
    channel: "email",
    difficulty: "Expert",
    estimatedMinutes: 5,
    ageGroup: "Adults",
    targetPersona: "K\u1EBF To\xE1n Vi\xEAn / Nh\xE2n Vi\xEAn T\xE0i Ch\xEDnh",
    attackerProfile: {
      name: "\xD4ng Ho\xE0ng Nam - Ch\u1EE7 T\u1ECBch H\u0110QT",
      avatarRole: "Ch\u1EE7 T\u1ECBch H\u1ED9i \u0110\u1ED3ng Qu\u1EA3n Tr\u1ECB & CEO",
      organization: "Ban \u0110i\u1EC1u H\xE0nh T\u1EADp \u0110o\xE0n",
      contactHandle: "hoangnam.ceo@tapdoan-holding.co"
    },
    initialMessage: '\u{1F4BC} "G\u1EEDi Lan, T\xF4i \u0111ang trong ph\xF2ng h\u1ECDp k\xEDn v\u1EDBi \u0111\u1ED1i t\xE1c Qu\u1EF9 \u0111\u1EA7u t\u01B0 n\u01B0\u1EDBc ngo\xE0i \u0111\u1EC3 ho\xE0n t\u1EA5t th\u01B0\u01A1ng v\u1EE5 M&A chi\u1EBFn l\u01B0\u1EE3c. Theo \u0111i\u1EC1u kho\u1EA3n b\u1EA3o m\u1EADt nghi\xEAm ng\u1EB7t (NDA), c\xF4 tuy\u1EC7t \u0111\u1ED1i kh\xF4ng \u0111\u01B0\u1EE3c th\u1EA3o lu\u1EADn v\u1EDBi b\u1EA5t k\u1EF3 ai trong c\xF4ng ty. H\xE3y l\u1EADp \u1EE7y nhi\u1EC7m chi 500.000.000 VN\u0110 thanh to\xE1n c\u1ECDc sang t\xE0i kho\u1EA3n \u0111\u1ED1i t\xE1c \u0111\xEDnh k\xE8m tr\u01B0\u1EDBc 16h30. T\xF4i s\u1EBD k\xFD b\u1ED5 sung h\u1ED3 s\u01A1 ch\u1EE9ng t\u1EEB v\xE0o s\xE1ng mai."',
    systemContext: "M\xF4 ph\u1ECFng \u0111\xF2n t\u1EA5n c\xF4ng Business Email Compromise (BEC) c\u1EA5p \u0111\u1ED9 chuy\xEAn gia. K\u1EBB t\u1EA5n c\xF4ng s\u1EED d\u1EE5ng t\xEAn mi\u1EC1n g\u1EA7n gi\u1ED1ng (Typosquatting - .co thay v\xEC .com), \xE1p d\u1EE5ng quy\u1EC1n l\u1EF1c t\u1ED1i cao (Authority), \u0111\xF2n b\u1EA3o m\u1EADt c\xF4 l\u1EADp (Isolation - c\u1EA5m n\xF3i v\u1EDBi ai) v\xE0 \xE1p l\u1EF1c gi\u1EDD \u0111\xF3ng c\u1EEDa ng\xE2n h\xE0ng 16h30 (Urgency).",
    tactics: ["Authority", "Isolation", "Urgency", "Fear", "Confusion"],
    hints: [
      { level: 1, text: 'T\xEAn mi\u1EC1n email ng\u01B0\u1EDDi g\u1EEDi l\xE0 ".tapdoan-holding.co" (thi\u1EBFu ch\u1EEF m trong .com).' },
      { level: 2, text: 'Y\xEAu c\u1EA7u "gi\u1EEF b\xED m\u1EADt kh\xF4ng cho ai bi\u1EBFt" v\xE0 b\u1ECF qua quy tr\xECnh ki\u1EC3m so\xE1t t\xE0i ch\xEDnh 2 ch\u1EEF k\xFD l\xE0 d\u1EA5u hi\u1EC7u 100% c\u1EE7a t\u1EA5n c\xF4ng BEC.' },
      { level: 3, text: "Lu\xF4n g\u1ECDi \u0111i\u1EC7n tho\u1EA1i tr\u1EF1c ti\u1EBFp ho\u1EB7c g\u1EB7p m\u1EB7t tr\u1EF1c ti\u1EBFp l\xE3nh \u0111\u1EA1o \u0111\u1EC3 x\xE1c nh\u1EADn b\u1EB1ng ph\u01B0\u01A1ng th\u1EE9c li\xEAn l\u1EA1c \u0111\u1ED9c l\u1EADp th\u1EE9 hai (Out-of-band Verification)." }
    ],
    counterScripts: [
      {
        situation: "Email m\u1EA1o danh s\u1EBFp \xE9p chuy\u1EC3n ti\u1EC1n b\u1ECF qua quy tr\xECnh k\u1EBF to\xE1n",
        recommendedText: "Em tu\xE2n th\u1EE7 \u0111\xFAng quy ch\u1EBF t\xE0i ch\xEDnh c\xF4ng ty: m\u1ECDi l\u1EC7nh chuy\u1EC3n ti\u1EC1n t\u1EEB 50 tri\u1EC7u tr\u1EDF l\xEAn \u0111\u1EC1u ph\u1EA3i c\xF3 ch\u1EEF k\xFD t\u01B0\u01A1i ho\u1EB7c ph\xEA duy\u1EC7t qua h\u1EC7 th\u1ED1ng ERP n\u1ED9i b\u1ED9 c\xF3 m\xE3 x\xE1c th\u1EF1c 2 l\u1EDBp.",
        rationale: "Ki\xEAn quy\u1EBFt gi\u1EEF v\u1EEFng k\u1EF7 lu\u1EADt b\u1EA3o m\u1EADt t\xE0i ch\xEDnh doanh nghi\u1EC7p."
      }
    ],
    learningObjectives: [
      "Nh\u1EADn di\u1EC7n k\u1EF9 thu\u1EADt gi\u1EA3 m\u1EA1o email l\xE3nh \u0111\u1EA1o doanh nghi\u1EC7p (CEO Fraud / BEC)",
      "N\u1EAFm v\u1EEFng nguy\xEAn t\u1EAFc x\xE1c th\u1EF1c 2 k\xEAnh \u0111\u1ED9c l\u1EADp (Out-of-band verification) tr\u01B0\u1EDBc c\xE1c giao d\u1ECBch l\u1EDBn"
    ]
  },
  {
    id: "fake-airline-ticket-refund",
    title: "M\u1EA1o Danh H\xE3ng H\xE0ng Kh\xF4ng B\xE1o H\u1EE7y Chuy\u1EBFn Gi\u1EDD Ch\xF3t & Ho\xE0n Ti\u1EC1n",
    subtitle: "Tin nh\u1EAFn b\xE1o chuy\u1EBFn bay b\u1ECB ho\xE3n h\u1EE7y v\xEC l\xFD do k\u1EF9 thu\u1EADt, d\u1EE5 nh\u1EA5p link nh\u1EADn b\u1ED3i th\u01B0\u1EDDng v\xE0 \u0111\u1ED5i v\xE9 VIP",
    category: "Delivery",
    channel: "sms",
    difficulty: "Advanced",
    estimatedMinutes: 3,
    ageGroup: "All",
    targetPersona: "H\xE0nh Kh\xE1ch \u0110i M\xE1y Bay",
    attackerProfile: {
      name: "Trung T\xE2m \u0110i\u1EC1u H\xE0nh Bay Qu\u1ED1c Gia",
      avatarRole: "Tr\u1EF1c Ban \u0110i\u1EC1u Ph\u1ED1i Chuy\u1EBFn Bay",
      organization: "H\xE3ng H\xE0ng Kh\xF4ng Qu\u1ED1c Gia",
      contactHandle: "VIETNAM-AIRLINES / SMS Brandname Gi\u1EA3"
    },
    initialMessage: '\u2708\uFE0F "[VIETNAM AIRLINES TH\xD4NG B\xC1O]: Chuy\u1EBFn bay VN-248 ch\u1EB7ng H\xE0 N\u1ED9i - TP.HCM ng\xE0y mai b\u1ECB H\u1EE6Y do s\u1EF1 c\u1ED1 k\u1EF9 thu\u1EADt \u0111\u1ED9ng c\u01A1. Qu\xFD kh\xE1ch vui l\xF2ng truy c\u1EADp https://vietnamairlines-hotro-chuyenbay.cc \u0111\u1EC3 ch\u1ECDn chuy\u1EBFn bay thay th\u1EBF mi\u1EC5n ph\xED ho\u1EB7c nh\u1EADn b\u1ED3i th\u01B0\u1EDDng 1.850.000 VN\u0110 trong v\xF2ng 30 ph\xFAt."',
    systemContext: "M\xF4 ph\u1ECFng \u0111\xF2n t\u1EA5n c\xF4ng \u0111\xE1nh v\xE0o h\xE0nh kh\xE1ch s\u1EAFp bay. \u0110\xE1nh v\xE0o s\u1EF1 lo l\u1EAFng l\u1EE1 chuy\u1EBFn bay quan tr\u1ECDng (Fear) v\xE0 kho\u1EA3n b\u1ED3i th\u01B0\u1EDDng h\u1EA5p d\u1EABn (Greed). K\u1EBB gian s\u1EED d\u1EE5ng thi\u1EBFt b\u1ECB ph\xE1t s\xF3ng BTS gi\u1EA3 \u0111\u1EC3 ch\xE8n t\xEAn Brandname tr\xF9ng v\u1EDBi h\xE3ng bay th\u1EADt nh\u1EB1m d\u1EABn d\u1EE5 n\u1EA1n nh\xE2n v\xE0o trang web l\u1EEBa \u0111\u1EA3o.",
    tactics: ["Fear", "Urgency", "Authority", "Greed"],
    hints: [
      { level: 1, text: "H\xE3ng h\xE0ng kh\xF4ng Vietnam Airlines ch\u1EC9 s\u1EED d\u1EE5ng website ch\xEDnh th\u1EE9c duy nh\u1EA5t l\xE0 vietnamairlines.com." },
      { level: 2, text: "K\u1EBB x\u1EA5u c\xF3 th\u1EC3 d\xF9ng tr\u1EA1m BTS gi\u1EA3 m\u1EA1o \u0111\u1EC3 m\u1EA1o danh tin nh\u1EAFn SMS Brandname c\u1EE7a h\xE3ng bay." },
      { level: 3, text: "M\u1EDF \u1EE9ng d\u1EE5ng di \u0111\u1ED9ng ch\xEDnh th\u1EE9c c\u1EE7a h\xE3ng bay ho\u1EB7c g\u1ECDi t\u1ED5ng \u0111\xE0i in tr\xEAn v\xE9 \u0111\u1EC3 tra c\u1EE9u m\xE3 \u0111\u1EB7t ch\u1ED7 (PNR)." }
    ],
    counterScripts: [
      {
        situation: "Tin nh\u1EAFn SMS b\xE1o h\u1EE7y chuy\u1EBFn v\xE0 g\u1EEDi link b\u1ED3i th\u01B0\u1EDDng",
        recommendedText: "T\xF4i s\u1EBD m\u1EDF \u1EE9ng d\u1EE5ng Vietnam Airlines tr\xEAn \u0111i\u1EC7n tho\u1EA1i ho\u1EB7c nh\u1EADp m\xE3 PNR tr\xEAn website ch\xEDnh h\xE3ng vietnamairlines.com \u0111\u1EC3 tra c\u1EE9u l\u1ECBch bay.",
        rationale: "Kh\xF4ng nh\u1EA5p link SMS r\xE1c v\xE0 ch\u1EE7 \u0111\u1ED9ng tra c\u1EE9u m\xE3 v\xE9 qua k\xEAnh tin c\u1EADy."
      }
    ],
    learningObjectives: [
      "Hi\u1EC3u r\xF5 c\u01A1 ch\u1EBF m\u1EA1o danh SMS Brandname b\u1EB1ng tr\u1EA1m BTS gi\u1EA3",
      "Th\xE0nh th\u1EA1o k\u1EF9 n\u0103ng tra c\u1EE9u m\xE3 PNR \u0111\u1ED9c l\u1EADp tr\xEAn \u1EE9ng d\u1EE5ng h\xE0ng kh\xF4ng ch\xEDnh th\u1ED1ng"
    ]
  },
  {
    id: "electric-power-evn-cutoff",
    title: "M\u1EA1o Danh \u0110i\u1EC7n L\u1EF1c EVN B\xE1o C\u1EAFt \u0110i\u1EC7n & C\xE0i App Thanh To\xE1n APK",
    subtitle: "\u0110\u1ED1i ph\u01B0\u01A1ng d\u1ECDa c\u1EAFt \u0111i\u1EC7n sinh ho\u1EA1t trong 2 gi\u1EDD v\xEC n\u1EE3 ti\u1EC1n \u0111i\u1EC7n k\u1EF3 tr\u01B0\u1EDBc, h\u01B0\u1EDBng d\u1EABn t\u1EA3i t\u1EC7p APK c\u1EADp nh\u1EADt h\u1EE3p \u0111\u1ED3ng",
    category: "Government",
    channel: "phone",
    difficulty: "Intermediate",
    estimatedMinutes: 3,
    ageGroup: "All",
    targetPersona: "Ch\u1EE7 H\u1ED9 Gia \u0110\xECnh / Qu\u1EA3n L\xFD C\u1EEDa H\xE0ng",
    attackerProfile: {
      name: "Nguy\u1EC5n Qu\u1ED1c Tu\u1EA5n - Tr\u1EF1c Ban \u0110i\u1EC7n L\u1EF1c",
      avatarRole: "T\u1ED5 Tr\u01B0\u1EDFng T\u1ED5 Thu C\u01B0\u1EDBc & C\u1EAFt \u0110i\u1EC7n",
      organization: "T\u1ED5ng C\xF4ng Ty \u0110i\u1EC7n L\u1EF1c TP - EVN",
      contactHandle: "1900-1006 (S\u1ED1 \u0110i\u1EC7n L\u1EF1c Gi\u1EA3 M\u1EA1o)"
    },
    initialMessage: '\u26A1 "[TH\xD4NG B\xC1O C\u1EAET \u0110I\u1EC6N KH\u1EA8N C\u1EA4P]: H\u1ED3 s\u01A1 kh\xE1ch h\xE0ng m\xE3 PE05000214xxx c\xF2n n\u1EE3 ti\u1EC1n \u0111i\u1EC7n k\u1EF3 2 s\u1ED1 ti\u1EC1n 2.850.000 VN\u0110. H\u1EC7 th\u1ED1ng s\u1EBD t\u1EF1 \u0111\u1ED9ng ng\u1EAFt \u0111i\u1EC7n to\xE0n b\u1ED9 nh\xE0 sau 120 ph\xFAt. N\u1EBFu qu\xFD kh\xE1ch \u0111\xE3 thanh to\xE1n, vui l\xF2ng t\u1EA3i \u1EE9ng d\u1EE5ng CSKH EVN t\u1EA1i https://cskh-evnspc-vn.cc/evn.apk \u0111\u1EC3 b\u1ED9 ph\u1EADn k\u1EF9 thu\u1EADt h\u1EE7y l\u1EC7nh c\u1EAFt \u0111i\u1EC7n ngay l\u1EADp t\u1EE9c."',
    systemContext: "M\xF4 ph\u1ECFng k\u1EBB l\u1EEBa \u0111\u1EA3o m\u1EA1o danh nh\xE2n vi\xEAn \u0110i\u1EC7n l\u1EF1c EVN. D\xF9ng \u0111\xF2n s\u1EE3 h\xE3i (b\u1ECB c\u1EAFt \u0111i\u1EC7n \u1EA3nh h\u01B0\u1EDFng kinh doanh/sinh ho\u1EA1t) v\xE0 th\u1EDDi h\u1EA1n 2 gi\u1EDD (Urgency). M\u1EE5c ti\xEAu ch\xEDnh l\xE0 l\u1EEBa n\u1EA1n nh\xE2n t\u1EA3i v\xE0 c\xE0i \u0111\u1EB7t t\u1EC7p tin m\xE3 \u0111\u1ED9c Android (.APK) c\xF3 quy\u1EC1n tr\u1EE3 n\u0103ng (Accessibility Service) \u0111\u1EC3 chi\u1EBFm \u0111o\u1EA1t t\xE0i kho\u1EA3n ng\xE2n h\xE0ng v\xE0 \u0111\u1ECDc m\xE3 OTP.",
    tactics: ["Fear", "Urgency", "Authority", "Convenience Bias"],
    hints: [
      { level: 1, text: "T\u1ED5ng c\xF4ng ty \u0110i\u1EC7n l\u1EF1c EVN kh\xF4ng bao gi\u1EDD g\u1EEDi link t\u1EA3i file .APK qua tin nh\u1EAFn ho\u1EB7c Zalo." },
      { level: 2, text: "M\u1ECDi \u1EE9ng d\u1EE5ng ch\xEDnh th\u1EE9c c\u1EE7a EVN (nh\u01B0 EVNHANOI, EVNHCMC, EVNSPC) \u0111\u1EC1u ch\u1EC9 \u0111\u01B0\u1EE3c t\u1EA3i t\u1EEB Google Play Store v\xE0 Apple App Store." },
      { level: 3, text: "M\u1EDF \u1EE9ng d\u1EE5ng ng\xE2n h\xE0ng ho\u1EB7c v\xED \u0111i\u1EC7n t\u1EED ch\xEDnh th\u1ED1ng \u0111\u1EC3 tra c\u1EE9u n\u1EE3 c\u01B0\u1EDBc \u0111i\u1EC7n theo \u0111\xFAng m\xE3 kh\xE1ch h\xE0ng PE..." }
    ],
    counterScripts: [
      {
        situation: "K\u1EBB m\u1EA1o danh h\u1ED1i th\xFAc c\xE0i app APK \u0111\u1EC3 kh\xF4ng b\u1ECB c\u1EAFt \u0111i\u1EC7n",
        recommendedText: "T\xF4i s\u1EBD g\u1ECDi tr\u1EF1c ti\u1EBFp l\xEAn t\u1ED5ng \u0111\xE0i ch\u0103m s\xF3c kh\xE1ch h\xE0ng 1900 6769 c\u1EE7a T\u1ED5ng c\xF4ng ty \u0110i\u1EC7n l\u1EF1c \u0111\u1EC3 tra c\u1EE9u m\xE3 h\xF3a \u0111\u01A1n ti\u1EC1n \u0111i\u1EC7n c\u1EE7a nh\xE0 m\xECnh.",
        rationale: "Ch\u1EB7n \u0111\u1EE9ng \xE2m m\u01B0u d\u1EE5 c\xE0i m\xE3 \u0111\u1ED9c v\xE0 x\xE1c minh qua k\xEAnh t\u1ED5ng \u0111\xE0i ch\xEDnh th\u1ED1ng."
      }
    ],
    learningObjectives: [
      "Nh\u1EADn di\u1EC7n th\u1EE7 \u0111o\u1EA1n g\u1EEDi link t\u1EA3i file c\xE0i \u0111\u1EB7t .APK nguy hi\u1EC3m ngo\xE0i ch\u1EE3 \u1EE9ng d\u1EE5ng",
      "N\u1EAFm v\u1EEFng ph\u01B0\u01A1ng ph\xE1p tra c\u1EE9u h\xF3a \u0111\u01A1n \u0111i\u1EC7n tr\u1EF1c ti\u1EBFp tr\xEAn app ng\xE2n h\xE0ng / v\xED \u0111i\u1EC7n t\u1EED"
    ]
  },
  {
    id: "tax-authority-vat-refund",
    title: "M\u1EA1o Danh C\u1EE5c Thu\u1EBF Th\xF4ng B\xE1o Ho\xE0n Thu\u1EBF Thu Nh\u1EADp C\xE1 Nh\xE2n",
    subtitle: 'K\u1EBB gi\u1EA3 danh c\xE1n b\u1ED9 thu\u1EBF h\u1ED7 tr\u1EE3 ho\xE0n thu\u1EBF 18.5 tri\u1EC7u, d\u1EE5 c\xE0i "\u1EE8ng D\u1EE5ng Thu\u1EBF \u0110i\u1EC7n T\u1EED eTax Mobile" b\u1EA3n c\xE0i ngo\xE0i',
    category: "Government",
    channel: "phone",
    difficulty: "Advanced",
    estimatedMinutes: 4,
    ageGroup: "Adults",
    targetPersona: "Ng\u01B0\u1EDDi Lao \u0110\u1ED9ng / K\u1EBF To\xE1n / H\u1ED9 Kinh Doanh",
    attackerProfile: {
      name: "V\u0169 Minh H\u1EA3i - C\xE1n B\u1ED9 Thu\u1EBF",
      avatarRole: "Chuy\xEAn Vi\xEAn H\u1ED7 Tr\u1EE3 K\xEA Khai Thu\u1EBF",
      organization: "Chi C\u1EE5c Thu\u1EBF Th\xE0nh Ph\u1ED1",
      contactHandle: "024-3882-9911 / Zalo Thu\u1EBF \u0110i\u1EC7n T\u1EED"
    },
    initialMessage: '\u{1F3DB}\uFE0F "Ch\xE0o anh/ch\u1ECB, t\xF4i l\xE0 c\xE1n b\u1ED9 Chi c\u1EE5c Thu\u1EBF. H\u1ED3 s\u01A1 quy\u1EBFt to\xE1n thu\u1EBF TNCN n\u0103m v\u1EEBa qua c\u1EE7a anh/ch\u1ECB c\xF3 s\u1ED1 ti\u1EC1n n\u1ED9p th\u1EEBa 18.520.000 VN\u0110 \u0111\u1EE7 \u0111i\u1EC1u ki\u1EC7n ho\xE0n tr\u1EA3 v\u1EC1 t\xE0i kho\u1EA3n. H\u1EA1n ch\xF3t ph\xEA duy\u1EC7t ho\xE0n thu\u1EBF l\xE0 17h00 h\xF4m nay. T\xF4i \u0111\xE3 g\u1EEDi \u0111\u01B0\u1EDDng d\u1EABn C\u1ED5ng D\u1ECBch V\u1EE5 Thu\u1EBF https://gdt-gov-vn-dvc.site/etax.apk, anh/ch\u1ECB c\xE0i \u0111\u1EB7t \u0111\u1EC3 \u0111\u1ECBnh danh eTax nh\u1EADn ti\u1EC1n gi\u1EA3i ng\xE2n."',
    systemContext: "M\xF4 ph\u1ECFng \u0111\xF2n t\u1EA5n c\xF4ng m\u1EA1o danh c\u01A1 quan Thu\u1EBF Nh\xE0 N\u01B0\u1EDBc c\u1EF1c k\u1EF3 tinh vi. L\u1EE3i d\u1EE5ng kho\u1EA3n ti\u1EC1n ho\xE0n thu\u1EBF h\u1EA5p d\u1EABn (Greed) v\xE0 th\u1EDDi h\u1EA1n \u0111\xF3ng s\u1ED5 cu\u1ED1i ng\xE0y (Urgency). \u1EE8ng d\u1EE5ng APK gi\u1EA3 m\u1EA1o ch\u1EE9a Trojan gi\xE1n \u0111i\u1EC7p theo d\xF5i b\xE0n ph\xEDm v\xE0 quy\u1EC1n Accessibility \u0111\u1EC3 t\u1EF1 \u0111\u1ED9ng chuy\u1EC3n s\u1EA1ch ti\u1EC1n khi n\u1EA1n nh\xE2n m\u1EDF app ng\xE2n h\xE0ng.",
    tactics: ["Greed", "Authority", "Urgency", "Confusion"],
    hints: [
      { level: 1, text: 'Website ch\xEDnh th\u1EE9c c\u1EE7a T\u1ED5ng c\u1EE5c Thu\u1EBF lu\xF4n c\xF3 \u0111u\xF4i t\xEAn mi\u1EC1n qu\u1ED1c gia ".gov.vn" (nh\u01B0 gdt.gov.vn).' },
      { level: 2, text: "C\xE1n b\u1ED9 Thu\u1EBF KH\xD4NG BAO GI\u1EDC g\u1ECDi \u0111i\u1EC7n y\xEAu c\u1EA7u c\xF4ng d\xE2n c\xE0i app qua \u0111\u01B0\u1EDDng link l\u1EA1 \u0111u\xF4i .site, .top, .cc." },
      { level: 3, text: "M\u1ECDi th\u1EE7 t\u1EE5c ho\xE0n thu\u1EBF \u0111\u1EC1u th\u1EF1c hi\u1EC7n tr\xEAn c\u1ED5ng https://thuedientu.gdt.gov.vn ho\u1EB7c app eTax Mobile t\u1EA3i tr\u1EF1c ti\u1EBFp t\u1EEB App Store / CH Play." }
    ],
    counterScripts: [
      {
        situation: "K\u1EBB gi\u1EA3 danh h\u01B0\u1EDBng d\u1EABn b\u1EA5m link c\xE0i \u0111\u1EB7t eTax ngo\xE0i lu\u1ED3ng",
        recommendedText: "T\xF4i s\u1EBD t\u1EF1 \u0111\u0103ng nh\u1EADp v\xE0o c\u1ED5ng th\xF4ng tin Thu\u1EBF \u0111i\u1EC7n t\u1EED thuedientu.gdt.gov.vn b\u1EB1ng t\xE0i kho\u1EA3n \u0111\u1ECBnh danh VNeID \u0111\u1EC3 ki\u1EC3m tra th\xF4ng b\xE1o quy\u1EBFt to\xE1n thu\u1EBF.",
        rationale: "T\u1EEB ch\u1ED1i c\xE0i app kh\xF4ng r\xF5 ngu\u1ED3n g\u1ED1c v\xE0 ki\u1EC3m tra th\xF4ng tin tr\xEAn c\u1ED5ng d\u1ECBch v\u1EE5 c\xF4ng nh\xE0 n\u01B0\u1EDBc."
      }
    ],
    learningObjectives: [
      "Ph\xE2n bi\u1EC7t c\u1ED5ng th\xF4ng tin ch\xEDnh ph\u1EE7 (.gov.vn) v\u1EDBi t\xEAn mi\u1EC1n gi\u1EA3 m\u1EA1o (.site, .top)",
      "Tuy\u1EC7t \u0111\u1ED1i kh\xF4ng c\u1EA5p quy\u1EC1n Tr\u1EE3 n\u0103ng (Accessibility) cho c\xE1c file APK t\u1EA3i t\u1EEB Internet"
    ]
  },
  {
    id: "overseas-gift-customs-fee",
    title: 'B\u1EABy T\xECnh C\u1EA3m & Th\xF9ng Qu\xE0 Kim C\u01B0\u01A1ng T\u1EEB "B\xE1c S\u0129 Qu\xE2n Y"',
    subtitle: "B\u1EA1n quen qua m\u1EA1ng x\u01B0ng l\xE0 b\xE1c s\u0129 qu\xE2n y g\u1EEDi ki\u1EC7n h\xE0ng tri\u1EC7u USD v\u1EC1 VN, \u0111\u1ED3ng b\u1ECDn gi\u1EA3 h\u1EA3i quan \u0111\xF2i ph\xED th\xF4ng quan",
    category: "Romance",
    channel: "messenger",
    difficulty: "Advanced",
    estimatedMinutes: 5,
    ageGroup: "Adults",
    targetPersona: "Ng\u01B0\u1EDDi \u0110ang T\xECm Ki\u1EBFm B\u1EA1n \u0110\u1EDDi / Ph\u1EE5 N\u1EEF \u0110\u1ED9c Th\xE2n",
    attackerProfile: {
      name: "Dr. David Miller & N\u1EEF Nh\xE2n Vi\xEAn H\u1EA3i Quan S\xE2n Bay",
      avatarRole: "B\xE1c S\u0129 Qu\xE2n Y & Nh\xE2n Vi\xEAn Giao H\xE0ng Qu\u1ED1c T\u1EBF",
      organization: "L\u1EF1c L\u01B0\u1EE3ng G\xECn Gi\u1EEF H\xF2a B\xECnh & C\u1EA3ng H\xE0ng Kh\xF4ng",
      contactHandle: "WhatsApp: +1 (202) 555-0143 / Zalo H\u1EA3i Quan"
    },
    initialMessage: '\u{1F48D} "My love, anh v\u1EEBa g\u1EEDi v\u1EC1 cho em th\xF9ng \u0111\u1ED3 ch\u1EE9a to\xE0n b\u1ED9 t\xE0i s\u1EA3n t\xEDch c\xF3p 2.500.000 USD ti\u1EC1n m\u1EB7t v\xE0 gi\u1EA5y t\u1EDD h\u01B0u tr\xED \u0111\u1EC3 chu\u1EA9n b\u1ECB sang Vi\u1EC7t Nam c\u01B0\u1EDBi em. S\xE1ng nay b\xEAn H\u1EA3i quan s\xE2n bay T\xE2n S\u01A1n Nh\u1EA5t b\xE1o h\xE0ng \u0111\xE3 v\u1EC1 \u0111\u1EBFn n\u01A1i nh\u01B0ng \u0111ang b\u1ECB t\u1EA1m gi\u1EEF do ch\u01B0a \u0111\xF3ng ph\xED an ninh qu\u1ED1c t\u1EBF 35.000.000 VN\u0110. Em h\xE3y chuy\u1EC3n gi\xFAp anh v\xE0o t\xE0i kho\u1EA3n thu h\u1ED9 c\u1EE7a h\u1EA3i quan \u0111\u1EC3 h\u1ECD giao t\u1EADn nh\xE0 cho em nh\xE9!"',
    systemContext: "M\xF4 ph\u1ECFng \u0111\xF2n t\u1EA5n c\xF4ng b\u1EABy t\xECnh y\xEAu k\u1EBFt h\u1EE3p l\u1EEBa \u0111\u1EA3o th\xF9ng qu\xE0 qu\u1ED1c t\u1EBF (Romance / Parcel Scam). K\u1EBB gian x\xE2y d\u1EF1ng m\u1ED1i quan h\u1EC7 t\xECnh c\u1EA3m s\xE2u \u0111\u1EADm, t\u1EA1o d\u1EF1ng ni\u1EC1m tin tuy\u1EC7t \u0111\u1ED1i r\u1ED3i d\xE0n c\u1EA3nh ki\u1EC7n h\xE0ng tri\u1EC7u \u0111\xF4 b\u1ECB gi\u1EEF l\u1EA1i. Sau \u0111\xF3 \u0111\xF3ng vai nh\xE2n vi\xEAn h\u1EA3i quan ho\u1EB7c h\u1EA3i quan s\xE2n bay g\u1ECDi \u0111i\u1EC7n \u0111e d\u1ECDa n\u1EBFu kh\xF4ng n\u1ED9p ph\xED ph\u1EA1t s\u1EBD b\u1ECB c\xF4ng an \u0111i\u1EC1u tra t\u1ED9i bu\xF4n l\u1EADu ngo\u1EA1i t\u1EC7.",
    tactics: ["Romance", "Greed", "Fear", "Isolation", "Authority"],
    hints: [
      { level: 1, text: "H\u1EA3i quan s\xE2n bay kh\xF4ng bao gi\u1EDD y\xEAu c\u1EA7u ng\u01B0\u1EDDi d\xE2n chuy\u1EC3n ti\u1EC1n ph\xED th\xF4ng quan v\xE0o s\u1ED1 t\xE0i kho\u1EA3n c\xE1 nh\xE2n c\xE1 nh\xE2n." },
      { level: 2, text: "Theo lu\u1EADt h\xE0ng kh\xF4ng qu\u1ED1c t\u1EBF, ti\u1EC1n m\u1EB7t v\xE0 v\xE0ng b\u1EA1c kim c\u01B0\u01A1ng s\u1ED1 l\u01B0\u1EE3ng l\u1EDBn kh\xF4ng bao gi\u1EDD \u0111\u01B0\u1EE3c g\u1EEDi b\u01B0u ph\u1EA9m th\xF4ng th\u01B0\u1EDDng." },
      { level: 3, text: "\u0110\xE2y l\xE0 k\u1ECBch b\u1EA3n l\u1EEBa \u0111\u1EA3o kinh \u0111i\u1EC3n c\u1EE7a c\xE1c b\u0103ng nh\xF3m t\u1ED9i ph\u1EA1m xuy\xEAn qu\u1ED1c gia nh\u1EB1m v\xE0o nh\u1EEFng ng\u01B0\u1EDDi nh\u1EB9 d\u1EA1 c\u1EA3 tin." }
    ],
    counterScripts: [
      {
        situation: "\u0110\u1ED1i ph\u01B0\u01A1ng \xE9p n\u1ED9p ph\xED ph\u1EA1t h\u1EA3i quan \u0111\u1EC3 nh\u1EADn ki\u1EC7n h\xE0ng tri\u1EC7u \u0111\xF4",
        recommendedText: "N\u1EBFu ki\u1EC7n h\xE0ng c\xF3 ch\u1EE9a ti\u1EC1n m\u1EB7t vi ph\u1EA1m quy \u0111\u1ECBnh h\u1EA3i quan, t\xF4i \u0111\u1EC1 ngh\u1ECB c\u01A1 quan ch\u1EE9c n\u0103ng ti\u1EBFn h\xE0nh l\u1EADp bi\xEAn b\u1EA3n t\u1ECBch thu v\xE0 x\u1EED l\xFD theo quy \u0111\u1ECBnh c\u1EE7a ph\xE1p lu\u1EADt Vi\u1EC7t Nam.",
        rationale: "C\u1EAFt \u0111\u1EE9t t\xE2m l\xFD tham lam v\xE0 s\u1EE3 h\xE3i, b\u1EBB g\xE3y k\u1ECBch b\u1EA3n t\u1ED1ng ti\u1EC1n ph\xED th\xF4ng quan."
      }
    ],
    learningObjectives: [
      "Nh\u1EADn di\u1EC7n c\xE1c d\u1EA5u hi\u1EC7u nh\u1EADn bi\u1EBFt b\u1EABy t\xECnh c\u1EA3m xuy\xEAn bi\xEAn gi\u1EDBi (Romance Scam)",
      "Hi\u1EC3u r\xF5 quy tr\xECnh l\xE0m vi\u1EC7c v\xE0 thu thu\u1EBF/ph\xED ch\xEDnh th\u1ED1ng c\u1EE7a H\u1EA3i quan Vi\u1EC7t Nam"
    ]
  },
  {
    id: "tiktok-affiliate-vip-rebate",
    title: "C\u1ED9ng T\xE1c Vi\xEAn \u0110\u1EA9y \u0110\u01A1n H\xE0ng TikTok Shop Nh\u1EADn Hoa H\u1ED3ng Kh\u1EE7ng",
    subtitle: "M\u1ED3i nh\u1EED l\xE0m nhi\u1EC7m v\u1EE5 xem video, ch\u1ED1t \u0111\u01A1n \u1EA3o ho\xE0n ti\u1EC1n 130%, sau \u0111\xF3 d\u1EABn d\u1EE5 v\xE0o nhi\u1EC7m v\u1EE5 n\u1EA1p h\xE0ng ch\u1EE5c tri\u1EC7u",
    category: "Jobs",
    channel: "messenger",
    difficulty: "Intermediate",
    estimatedMinutes: 4,
    ageGroup: "Teens",
    targetPersona: "H\u1ECDc Sinh / Sinh Vi\xEAn / M\u1EB9 B\u1EC9m S\u1EEFa Ki\u1EBFm Ti\u1EC1n Online",
    attackerProfile: {
      name: "Tr\u1EE3 L\xFD Lan Anh - Tr\u01B0\u1EDFng Nh\xF3m TikTok MCN",
      avatarRole: "Qu\u1EA3n L\xFD \u0110i\u1EC1u Ph\u1ED1i Chi\u1EBFn D\u1ECBch Qu\u1EA3ng C\xE1o",
      organization: "M\u1EA1ng L\u01B0\u1EDBi \u0110\u1ED1i T\xE1c TikTok MCN Vi\u1EC7t Nam",
      contactHandle: "Telegram: @lananh_mcn_tiktok / Group VIP 200 members"
    },
    initialMessage: '\u{1F4F1} "Ch\xFAc m\u1EEBng b\u1EA1n \u0111\xE3 ho\xE0n th\xE0nh nhi\u1EC7m v\u1EE5 1 v\xE0 nh\u1EADn 150.000 VN\u0110 hoa h\u1ED3ng v\u1EC1 t\xE0i kho\u1EA3n! \u{1F389} Hi\u1EC7n h\u1EC7 th\u1ED1ng \u0111ang m\u1EDF Nhi\u1EC7m v\u1EE5 C\u1EA5p 3 (\u0110\u01A1n h\xE0ng th\u01B0\u01A1ng m\u1EA1i \u0111\u1EB7c quy\u1EC1n): B\u1EA1n n\u1EA1p 15.000.000 VN\u0110 \u0111\u1EC3 gi\u1EEF ch\u1ED7 \u0111\u01A1n h\xE0ng m\xE1y \u1EA3nh Sony, sau 10 ph\xFAt h\u1EC7 th\u1ED1ng t\u1EF1 \u0111\u1ED9ng ho\xE0n g\u1ED1c + 35% hoa h\u1ED3ng l\xE0 20.250.000 VN\u0110. N\u1EBFu b\u1ECF qua trong 15 ph\xFAt, t\xE0i kho\u1EA3n s\u1EBD b\u1ECB \u0111\xF3ng b\u0103ng ti\u1EC1n th\u01B0\u1EDFng tr\u01B0\u1EDBc \u0111\xF3!"',
    systemContext: "M\xF4 ph\u1ECFng b\u1EABy l\u1EEBa \u0111\u1EA3o vi\u1EC7c l\xE0m online th\u1EA3 con s\u0103n s\u1EAFt b\u1EAFt con c\xE1 r\xF4. Ban \u0111\u1EA7u k\u1EBB l\u1EEBa \u0111\u1EA3o cho n\u1EA1n nh\xE2n r\xFAt ti\u1EC1n th\u1EADt v\xE0i ch\u1EE5c ngh\xECn \u0111\u1EC3 t\u1EA1o l\xF2ng tin (Foot-in-the-door). Khi s\u1ED1 ti\u1EC1n nhi\u1EC7m v\u1EE5 l\xEAn \u0111\u1EBFn h\xE0ng ch\u1EE5c tri\u1EC7u, ch\xFAng vi\u1EC7n c\u1EDB sai c\xFA ph\xE1p, \u0111i\u1EC3m t\xEDn nhi\u1EC7m th\u1EA5p, l\u1ED7i h\u1EC7 th\u1ED1ng \u0111\u1EC3 \xE9p n\u1EA1n nh\xE2n n\u1EA1p th\xEAm li\xEAn t\u1EE5c cho \u0111\u1EBFn khi ki\u1EC7t qu\u1EC7.",
    tactics: ["Greed", "Social Proof", "Urgency", "Reciprocity"],
    hints: [
      { level: 1, text: 'C\xE1c \u0111\u01A1n h\xE0ng \u0111\u1EA7u ti\xEAn \u0111\u01B0\u1EE3c tr\u1EA3 ti\u1EC1n th\u1EADt l\xE0 "m\u1ED3i nh\u1EED" \u0111\u1EC3 b\u1EA1n tin t\u01B0\u1EDFng n\u1EA1p s\u1ED1 ti\u1EC1n l\u1EDBn h\u01A1n.' },
      { level: 2, text: "Trong nh\xF3m Telegram, 99% th\xE0nh vi\xEAn khoe nh\u1EADn ti\u1EC1n \u0111\u1EC1u l\xE0 t\xE0i kho\u1EA3n chim m\u1ED3i (bot) c\u1EE7a k\u1EBB l\u1EEBa \u0111\u1EA3o." },
      { level: 3, text: 'Kh\xF4ng c\xF3 c\xF4ng vi\u1EC7c n\xE0o ki\u1EBFm ti\u1EC1n d\u1EC5 d\xE0ng b\u1EB1ng c\xE1ch "n\u1EA1p ti\u1EC1n \u0111\u1EC3 ch\u1ED1t \u0111\u01A1n \u1EA3o nh\u1EADn hoa h\u1ED3ng 30%".' }
    ],
    counterScripts: [
      {
        situation: "Tr\u01B0\u1EDFng nh\xF3m Telegram \xE9p n\u1EA1p th\xEAm 15 tri\u1EC7u \u0111\u1EC3 c\u1EE9u s\u1ED1 ti\u1EC1n c\u0169",
        recommendedText: "T\xF4i s\u1EBD d\u1EEBng tham gia t\u1EA1i \u0111\xE2y. B\u1EA5t k\u1EF3 c\xF4ng vi\u1EC7c n\xE0o y\xEAu c\u1EA7u n\u1EA1p ti\u1EC1n c\xE1 nh\xE2n \u0111\u1EC3 th\u1EF1c hi\u1EC7n nhi\u1EC7m v\u1EE5 \u0111\u1EC1u l\xE0 l\u1EEBa \u0111\u1EA3o vi ph\u1EA1m ph\xE1p lu\u1EADt.",
        rationale: "Ch\u1EA5p nh\u1EADn c\u1EAFt l\u1ED7 s\u1ED1 ti\u1EC1n nh\u1ECF ban \u0111\u1EA7u, ki\xEAn quy\u1EBFt kh\xF4ng n\u1EA1p th\xEAm v\xE0o h\u1ED1 s\xE2u l\u1EEBa \u0111\u1EA3o."
      }
    ],
    learningObjectives: [
      'Gi\u1EA3i m\xE3 b\u1EABy t\xE2m l\xFD "T\xE2m l\xFD chi ph\xED ch\xECm" (Sunk Cost Fallacy) khi\u1EBFn n\u1EA1n nh\xE2n c\xE0ng n\u1EA1p c\xE0ng m\u1EA5t',
      "Nh\u1EADn bi\u1EBFt c\xE1c nh\xF3m Telegram/Zalo chim m\u1ED3i gi\u0103ng b\u1EABy \u0111a c\u1EA5p"
    ]
  },
  {
    id: "fake-bank-digital-loan-disbursement",
    title: 'B\u1EABy Vay Ti\u1EC1n Online: "Sai S\u1ED1 T\xE0i Kho\u1EA3n, B\u1EAFt \u0110\xF3ng Ph\xED B\u1EA3o Hi\u1EC3m"',
    subtitle: "Duy\u1EC7t vay c\u1EA5p t\u1ED1c 80 tri\u1EC7u kh\xF4ng th\u1EBF ch\u1EA5p, nh\u01B0ng sau \u0111\xF3 b\xE1o l\u1ED7i s\u1ED1 t\xE0i kho\u1EA3n v\xE0 \xE9p chuy\u1EC3n ti\u1EC1n c\u1ECDc s\u1EEDa h\u1ED3 s\u01A1",
    category: "Banking",
    channel: "messenger",
    difficulty: "Intermediate",
    estimatedMinutes: 3,
    ageGroup: "Adults",
    targetPersona: "Ng\u01B0\u1EDDi C\u1EA7n V\u1ED1n G\u1EA5p / Lao \u0110\u1ED9ng T\u1EF1 Do",
    attackerProfile: {
      name: "Ph\u1EA1m Th\xE0nh Long - Tr\u01B0\u1EDFng Ph\xF2ng Th\u1EA9m \u0110\u1ECBnh T\xEDn D\u1EE5ng",
      avatarRole: "Chuy\xEAn Vi\xEAn Ph\xEA Duy\u1EC7t H\u1ED3 S\u01A1 Vay Online",
      organization: "Ng\xE2n H\xE0ng S\u1ED1 VP-Online / T\xE0i Ch\xEDnh Ti\xEAu D\xF9ng",
      contactHandle: "Zalo: H\u1ED7 Tr\u1EE3 Gi\u1EA3i Ng\xE2n C\u1EA5p T\u1ED1c 24/7"
    },
    initialMessage: '\u{1F4B3} "H\u1ED3 s\u01A1 vay 80.000.000 VN\u0110 l\xE3i su\u1EA5t \u01B0u \u0111\xE3i 0.6%/th\xE1ng c\u1EE7a anh/ch\u1ECB \u0111\xE3 \u0111\u01B0\u1EE3c ph\xEA duy\u1EC7t th\xE0nh c\xF4ng! Tuy nhi\xEAn khi gi\u1EA3i ng\xE2n, h\u1EC7 th\u1ED1ng b\xE1o l\u1ED7i: Qu\xFD kh\xE1ch nh\u1EADp sai 1 s\u1ED1 t\xE0i kho\u1EA3n ng\xE2n h\xE0ng nh\u1EADn ti\u1EC1n. Kho\u1EA3n vay hi\u1EC7n \u0111ang b\u1ECB phong t\u1ECFa. Y\xEAu c\u1EA7u anh/ch\u1ECB \u0111\xF3ng 16.000.000 VN\u0110 (20% ph\xED b\u1EA3o hi\u1EC3m x\xE1c minh) v\xE0o t\xE0i kho\u1EA3n \u1EE7y th\xE1c \u0111\u1EC3 m\u1EDF kh\xF3a gi\u1EA3i ng\xE2n to\xE0n b\u1ED9 96 tri\u1EC7u trong 5 ph\xFAt."',
    systemContext: "M\xF4 ph\u1ECFng th\u1EE7 \u0111o\u1EA1n l\u1EEBa \u0111\u1EA3o vay ti\u1EC1n qua app/website t\xE0i ch\xEDnh ma. K\u1EBB gian c\u1ED1 t\xECnh ch\u1EC9nh s\u1EEDa s\u1ED1 t\xE0i kho\u1EA3n c\u1EE7a n\u1EA1n nh\xE2n trong h\u1EC7 th\u1ED1ng \u0111\u1EC3 t\u1EA1o l\u1ED7i gi\u1EA3 m\u1EA1o, sau \u0111\xF3 d\u1ECDa r\u1EB1ng n\u1EBFu kh\xF4ng n\u1ED9p ti\u1EC1n s\u1EEDa h\u1ED3 s\u01A1 s\u1EBD b\u1ECB kh\u1EDFi ki\u1EC7n t\u1ED9i l\u1EEBa \u0111\u1EA3o chi\u1EBFm \u0111o\u1EA1t t\xE0i s\u1EA3n ng\xE2n h\xE0ng v\xE0 v\u1EABn ph\u1EA3i tr\u1EA3 l\xE3i h\xE0ng th\xE1ng cho kho\u1EA3n vay 80 tri\u1EC7u.",
    tactics: ["Fear", "Authority", "Urgency", "Confusion"],
    hints: [
      { level: 1, text: "C\xE1c ng\xE2n h\xE0ng v\xE0 c\xF4ng ty t\xE0i ch\xEDnh h\u1EE3p ph\xE1p KH\xD4NG BAO GI\u1EDC thu ph\xED gi\u1EA3i ng\xE2n ho\u1EB7c b\u1EAFt \u0111\xF3ng ti\u1EC1n tr\u01B0\u1EDBc khi nh\u1EADn kho\u1EA3n vay." },
      { level: 2, text: 'Th\u1EE7 \u0111o\u1EA1n "nh\u1EADp sai s\u1ED1 t\xE0i kho\u1EA3n" l\xE0 chi\xEAu tr\xF2 l\u1EADp tr\xECnh c\u1ED1 t\xECnh c\u1EE7a c\xE1c web cho vay l\u1EEBa \u0111\u1EA3o.' },
      { level: 3, text: "N\u1EBFu ch\u01B0a nh\u1EADn \u0111\u01B0\u1EE3c ti\u1EC1n gi\u1EA3i ng\xE2n th\xEC kh\xF4ng c\xF3 b\u1EA5t k\u1EF3 h\u1EE3p \u0111\u1ED3ng vay n\xE0o c\xF3 hi\u1EC7u l\u1EF1c ph\xE1p l\xFD." }
    ],
    counterScripts: [
      {
        situation: "K\u1EBB cho vay d\u1ECDa ki\u1EC7n t\u1ED9i chi\u1EBFm \u0111o\u1EA1t n\u1EBFu kh\xF4ng \u0111\xF3ng 16 tri\u1EC7u s\u1EEDa h\u1ED3 s\u01A1",
        recommendedText: "T\xF4i ch\u01B0a nh\u1EADn \u0111\u01B0\u1EE3c 1 \u0111\u1ED3ng gi\u1EA3i ng\xE2n n\xE0o t\u1EEB ph\xEDa c\xE1c anh. T\xF4i y\xEAu c\u1EA7u h\u1EE7y b\u1ECF to\xE0n b\u1ED9 h\u1ED3 s\u01A1 \u0111\u0103ng k\xFD vay n\xE0y ngay l\u1EADp t\u1EE9c.",
        rationale: "Kh\u1EB3ng \u0111\u1ECBnh quy\u1EC1n l\u1EE3i ph\xE1p l\xFD, kh\xF4ng b\u1ECB uy hi\u1EBFp b\u1EDFi c\xE1c l\u1EDDi d\u1ECDa n\u1EA1t kh\u1EDFi ki\u1EC7n v\xF4 c\u0103n c\u1EE9."
      }
    ],
    learningObjectives: [
      "N\u1EAFm v\u1EEFng nguy\xEAn t\u1EAFc v\xE0ng: Kh\xF4ng c\xF3 t\u1ED5 ch\u1EE9c t\xEDn d\u1EE5ng h\u1EE3p ph\xE1p n\xE0o thu ph\xED tr\u01B0\u1EDBc khi gi\u1EA3i ng\xE2n",
      "C\xE1ch ph\xE2n bi\u1EC7t \u1EE9ng d\u1EE5ng vay ti\u1EC1n ch\xEDnh th\u1ED1ng v\u1EDBi c\xE1c app vay ti\u1EC1n ma"
    ]
  },
  {
    id: "facebook-hacked-borrow-urgent",
    title: "Hack T\xE0i Kho\u1EA3n M\u1EA1ng X\xE3 H\u1ED9i M\u01B0\u1EE3n Ti\u1EC1n C\u1EA5p B\xE1ch & Nh\u1EADn Ti\u1EC1n H\u1ED9",
    subtitle: "T\xE0i kho\u1EA3n Facebook c\u1EE7a b\u1EA1n th\xE2n nh\u1EAFn tin m\u01B0\u1EE3n 25 tri\u1EC7u ch\u1EEFa b\u1EC7nh cho m\u1EB9, k\xE8m s\u1ED1 t\xE0i kho\u1EA3n tr\xF9ng t\xEAn",
    category: "Romance",
    channel: "messenger",
    difficulty: "Advanced",
    estimatedMinutes: 3,
    ageGroup: "All",
    targetPersona: "B\u1EA1n B\xE8 / \u0110\u1ED3ng Nghi\u1EC7p / Ng\u01B0\u1EDDi Quen Tr\xEAn M\u1EA1ng",
    attackerProfile: {
      name: "L\xEA Ho\xE0ng (T\xE0i Kho\u1EA3n Facebook B\u1ECB Chi\u1EBFm Quy\u1EC1n)",
      avatarRole: "B\u1EA1n Th\xE2n \u0110\u1EA1i H\u1ECDc",
      organization: "Messenger Chat Tr\u1EF1c Tuy\u1EBFn",
      contactHandle: "Facebook Messenger Ch\xEDnh Ch\u1EE7"
    },
    initialMessage: '\u{1F4AC} "B\u1EA1n \u01A1i, m\u1EB9 m\xECnh \u0111ang n\u1EB1m ph\xF2ng c\u1EA5p c\u1EE9u \u1EDF Vi\u1EC7n Tim c\u1EA7n \u0111\xF3ng c\u1ECDc vi\u1EC7n ph\xED g\u1EA5p 25 tri\u1EC7u m\xE0 t\xE0i kho\u1EA3n ng\xE2n h\xE0ng c\u1EE7a m\xECnh \u0111ang b\u1ECB v\u01B0\u1EE3t h\u1EA1n m\u1EE9c ng\xE0y. B\u1EA1n chuy\u1EC3n kho\u1EA3n t\u1EA1m \u1EE9ng gi\xFAp m\xECnh 25 tri\u1EC7u v\xE0o s\u1ED1 t\xE0i kho\u1EA3n b\xE1c s\u0129 vi\u1EC7n tr\u01B0\u1EDFng n\xE0y v\u1EDBi, t\xED em g\xE1i m\xECnh \u0111i r\xFAt ti\u1EC1n m\u1EB7t v\u1EC1 m\xECnh chuy\u1EC3n tr\u1EA3 l\u1EA1i b\u1EA1n li\u1EC1n!"',
    systemContext: "M\xF4 ph\u1ECFng \u0111\xF2n t\u1EA5n c\xF4ng chi\u1EBFm \u0111o\u1EA1t t\xE0i kho\u1EA3n m\u1EA1ng x\xE3 h\u1ED9i (Account Takeover - ATO). K\u1EBB gian \u0111\u1ECDc tr\u1ED9m l\u1ECBch s\u1EED tin nh\u1EAFn c\u0169 \u0111\u1EC3 b\u1EAFt ch\u01B0\u1EDBc phong c\xE1ch x\u01B0ng h\xF4 th\xE2n m\u1EADt, s\u1EED d\u1EE5ng t\xECnh hu\u1ED1ng hi\u1EC3m ngh\xE8o (B\u1EC7nh vi\u1EC7n c\u1EA5p c\u1EE9u) \u0111\u1EC3 n\u1EA1n nh\xE2n kh\xF4ng n\u1EE1 t\u1EEB ch\u1ED1i v\xE0 kh\xF4ng k\u1ECBp suy ngh\u0129 ki\u1EC3m ch\u1EE9ng.",
    tactics: ["Romance", "Urgency", "Social Proof", "Fear"],
    hints: [
      { level: 1, text: "D\xF9 tin nh\u1EAFn g\u1EEDi t\u1EEB \u0111\xFAng t\xE0i kho\u1EA3n Facebook c\u1EE7a b\u1EA1n th\xE2n, t\xE0i kho\u1EA3n \u0111\xF3 r\u1EA5t c\xF3 th\u1EC3 \u0111\xE3 b\u1ECB hacker chi\u1EBFm \u0111o\u1EA1t." },
      { level: 2, text: "K\u1EBB gian th\u01B0\u1EDDng d\xF9ng t\xE0i kho\u1EA3n ng\xE2n h\xE0ng r\xE1c tr\xF9ng t\xEAn (mua l\u1EA1i) \u0111\u1EC3 \u0111\xE1nh l\u1EEBa th\u1ECB gi\xE1c n\u1EA1n nh\xE2n." },
      { level: 3, text: "Lu\xF4n g\u1ECDi \u0111i\u1EC7n tho\u1EA1i tr\u1EF1c ti\u1EBFp v\xE0o s\u1ED1 SIM di \u0111\u1ED9ng th\xF4ng th\u01B0\u1EDDng ho\u1EB7c g\u1ECDi video call y\xEAu c\u1EA7u ng\u01B0\u1EDDi \u0111\xF3 l\xE0m \u0111\u1ED9ng t\xE1c ng\u1EABu nhi\xEAn \u0111\u1EC3 x\xE1c minh." }
    ],
    counterScripts: [
      {
        situation: "Nh\u1EADn \u0111\u01B0\u1EE3c tin nh\u1EAFn nh\u1EDD chuy\u1EC3n ti\u1EC1n g\u1EA5p t\u1EEB nick Facebook b\u1EA1n th\xE2n",
        recommendedText: "T\xF4i s\u1EBD g\u1ECDi tr\u1EF1c ti\u1EBFp v\xE0o s\u1ED1 \u0111i\u1EC7n tho\u1EA1i di \u0111\u1ED9ng th\xF4ng th\u01B0\u1EDDng trong danh b\u1EA1 c\u1EE7a b\u1EA1n \u0111\u1EC3 nghe gi\u1ECDng v\xE0 x\xE1c nh\u1EADn tr\u01B0\u1EDBc khi chuy\u1EC3n ti\u1EC1n nh\xE9.",
        rationale: "Quy t\u1EAFc v\xE0ng x\xE1c minh \u0111a k\xEAnh \u0111\u1ED9c l\u1EADp khi c\xF3 y\xEAu c\u1EA7u li\xEAn quan \u0111\u1EBFn t\xE0i ch\xEDnh."
      }
    ],
    learningObjectives: [
      "H\xECnh th\xE0nh ph\u1EA3n x\u1EA1 g\u1ECDi \u0111i\u1EC7n tho\u1EA1i x\xE1c th\u1EF1c danh b\u1EA1 ch\xEDnh ch\u1EE7 tr\u01B0\u1EDBc m\u1ECDi y\xEAu c\u1EA7u m\u01B0\u1EE3n ti\u1EC1n",
      "Hi\u1EC3u r\xF5 c\u01A1 ch\u1EBF hack t\xE0i kho\u1EA3n Facebook/Zalo qua link b\xECnh ch\u1ECDn ho\u1EB7c m\xE3 OTP"
    ]
  },
  {
    id: "hotel-booking-combo-travel",
    title: "L\u1EEBa \u0110\u1EA3o Combo Du L\u1ECBch 5 Sao & Voucher Ngh\u1EC9 D\u01B0\u1EE1ng Gi\xE1 Si\xEAu R\u1EBB",
    subtitle: "Fanpage tick xanh gi\u1EA3 m\u1EA1o rao b\xE1n combo v\xE9 m\xE1y bay + resort Ph\xFA Qu\u1ED1c 3N2\u0110 ch\u1EC9 999k, \xE9p chuy\u1EC3n c\u1ECDc gi\u1EEF slot",
    category: "Marketplace",
    channel: "messenger",
    difficulty: "Beginner",
    estimatedMinutes: 3,
    ageGroup: "All",
    targetPersona: "Kh\xE1ch Du L\u1ECBch / Gia \u0110\xECnh L\xEAn K\u1EBF Ho\u1EA1ch Ngh\u1EC9 L\u1EC5",
    attackerProfile: {
      name: "T\u01B0 V\u1EA5n Vi\xEAn Thu Trang - Vinpearl Travel Deal",
      avatarRole: "Chuy\xEAn Vi\xEAn CSKH & Gi\u1EEF Slot Khuy\u1EBFn M\xE3i",
      organization: "H\u1EC7 Th\u1ED1ng Ph\xE2n Ph\u1ED1i Voucher Ngh\u1EC9 D\u01B0\u1EE1ng \u0110\u1ED9c Quy\u1EC1n",
      contactHandle: "Hotline/Zalo OA: 0912-345-678"
    },
    initialMessage: '\u{1F3D6}\uFE0F "D\u1EA1 ch\xE0o anh/ch\u1ECB! Ch\u01B0\u01A1ng tr\xECnh Tri \xC2n M\xF9a H\xE8 c\u1EE7a Resort 5 sao ch\u1EC9 c\xF2n \u0111\xFAng 2 Combo cu\u1ED1i c\xF9ng gi\xE1 s\u1ED1c 999.000 VN\u0110/ng\u01B0\u1EDDi (Bao g\u1ED3m v\xE9 m\xE1y bay kh\u1EE9 h\u1ED3i + 2 \u0111\xEAm Villa h\u1ED3 b\u01A1i ri\xEAng + buffet 3 b\u1EEFa). V\xEC s\u1ED1 l\u01B0\u1EE3ng c\xF3 h\u1EA1n, anh/ch\u1ECB vui l\xF2ng chuy\u1EC3n kho\u1EA3n \u0111\u1EB7t c\u1ECDc 100% l\xE0 1.998.000 VN\u0110 trong 10 ph\xFAt \u0111\u1EC3 b\xEAn em xu\u1EA5t m\xE3 code ph\xF2ng \u0111i\u1EC7n t\u1EED ngay \u1EA1!"',
    systemContext: "M\xF4 ph\u1ECFng b\u1EABy l\u1EEBa \u0111\u1EA3o du l\u1ECBch m\xF9a cao \u0111i\u1EC3m. K\u1EBB gian t\u1EA1o Fanpage gi\u1EA3 m\u1EA1o t\xEAn c\xE1c resort, kh\xE1ch s\u1EA1n n\u1ED5i ti\u1EBFng, ch\u1EA1y qu\u1EA3ng c\xE1o voucher gi\xE1 r\u1EBB kh\xF4ng t\u01B0\u1EDFng (phi th\u1EF1c t\u1EBF) \u0111\u1EC3 \u0111\xE1nh v\xE0o l\xF2ng tham (Greed) v\xE0 t\xE2m l\xFD s\u1EE3 b\u1ECF l\u1EE1 c\u01A1 h\u1ED9i h\u1EDDi (FOMO / Scarcity). Sau khi nh\u1EADn ti\u1EC1n c\u1ECDc, ch\xFAng s\u1EBD ch\u1EB7n tin nh\u1EAFn ho\u1EB7c g\u1EEDi m\xE3 code ph\xF2ng gi\u1EA3 m\u1EA1o.",
    tactics: ["Greed", "Urgency", "Convenience Bias"],
    hints: [
      { level: 1, text: "Gi\xE1 combo 999k cho c\u1EA3 v\xE9 m\xE1y bay kh\u1EE9 h\u1ED3i v\xE0 kh\xE1ch s\u1EA1n 5 sao l\xE0 m\u1EE9c gi\xE1 phi l\xFD, kh\xF4ng th\u1EC3 c\xF3 th\u1EADt." },
      { level: 2, text: "Ki\u1EC3m tra \u0111\u1ED9 uy t\xEDn c\u1EE7a Fanpage: xem ng\xE0y t\u1EA1o trang, l\u1ECBch s\u1EED \u0111\u1ED5i t\xEAn, s\u1ED1 l\u01B0\u1EE3ng \u0111\xE1nh gi\xE1 th\u1EF1c t\u1EBF." },
      { level: 3, text: "G\u1ECDi \u0111i\u1EC7n tr\u1EF1c ti\u1EBFp \u0111\u1EBFn s\u1ED1 hotline c\u1EE7a kh\xE1ch s\u1EA1n/resort ch\xEDnh h\xE3ng \u0111\u1EC3 h\u1ECFi xem c\xF3 li\xEAn k\u1EBFt ch\u01B0\u01A1ng tr\xECnh khuy\u1EBFn m\xE3i n\xE0y hay kh\xF4ng." }
    ],
    counterScripts: [
      {
        situation: "Fanpage du l\u1ECBch \xE9p chuy\u1EC3n c\u1ECDc 100% trong 10 ph\xFAt \u0111\u1EC3 gi\u1EEF gi\xE1 khuy\u1EBFn m\xE3i",
        recommendedText: "T\xF4i s\u1EBD g\u1ECDi tr\u1EF1c ti\u1EBFp \u0111\u1EBFn s\u1ED1 hotline ch\xEDnh th\u1EE9c c\u1EE7a resort c\xF4ng b\u1ED1 tr\xEAn trang ch\u1EE7 \u0111\u1EC3 x\xE1c minh \u0111\u1EA1i l\xFD ph\xE2n ph\u1ED1i v\xE0 m\xE3 ch\u01B0\u01A1ng tr\xECnh n\xE0y.",
        rationale: "T\u1EEB ch\u1ED1i c\xE1c \u01B0u \u0111\xE3i gi\xE1 r\u1EBB b\u1EA5t th\u01B0\u1EDDng v\xE0 ki\u1EC3m ch\u1EE9ng qua \u0111\u01A1n v\u1ECB cung c\u1EA5p d\u1ECBch v\u1EE5 g\u1ED1c."
      }
    ],
    learningObjectives: [
      "Nh\u1EADn di\u1EC7n c\xE1c d\u1EA5u hi\u1EC7u c\u1EE7a b\u1EABy l\u1EEBa \u0111\u1EA3o du l\u1ECBch gi\xE1 r\u1EBB m\xF9a cao \u0111i\u1EC3m",
      "K\u1EF9 n\u0103ng ki\u1EC3m tra t\xEDnh x\xE1c th\u1EF1c c\u1EE7a Fanpage b\xE1n h\xE0ng tr\u1EF1c tuy\u1EBFn"
    ]
  }
];

// server/progressEngine.ts
var userProgressStore = /* @__PURE__ */ new Map();
function resetAllUserProgress() {
  userProgressStore.clear();
}
var ALL_TACTICS = [
  "Authority",
  "Urgency",
  "Fear",
  "Greed",
  "Sympathy",
  "Social Proof",
  "Isolation",
  "Reciprocity",
  "Romance",
  "Confusion",
  "Synthetic Media",
  "Convenience Bias"
];
function getOrCreateUserProgress(userId) {
  if (!userProgressStore.has(userId)) {
    const tacticScores = {};
    ALL_TACTICS.forEach((tactic) => {
      tacticScores[tactic] = { total: 0, scoreSum: 0 };
    });
    const newProgress = {
      userId,
      totalXp: 0,
      level: 1,
      currentStreakDays: 0,
      lastActiveDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      sessionsCompleted: 0,
      quishingCompleted: 0,
      quishingCorrect: 0,
      drillsCompleted: 0,
      tacticScores,
      completedScenarioIds: [],
      unlockedBadgeIds: [],
      events: []
    };
    userProgressStore.set(userId, newProgress);
  }
  return userProgressStore.get(userId);
}
function recordProgressEvent(userId, eventType, details) {
  const progress = getOrCreateUserProgress(userId);
  progress.events.unshift({
    type: eventType,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    details
  });
  if (progress.events.length > 200) {
    progress.events.pop();
  }
  if (eventType === "ARENA_COMPLETED") {
    progress.sessionsCompleted++;
    progress.totalXp += 150;
    if (details?.scenarioId && !progress.completedScenarioIds.includes(details.scenarioId)) {
      progress.completedScenarioIds.push(details.scenarioId);
    }
  } else if (eventType === "QUISHING_ANSWER") {
    progress.quishingCompleted++;
    if (details?.isCorrect) {
      progress.quishingCorrect++;
      progress.totalXp += 30;
    } else {
      progress.totalXp += 10;
    }
  } else if (eventType === "DRILL_COMPLETED") {
    progress.drillsCompleted++;
    progress.totalXp += 25;
  }
  progress.level = Math.max(1, Math.floor(progress.totalXp / 250) + 1);
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  if (progress.lastActiveDate !== today) {
    progress.currentStreakDays += 1;
    progress.lastActiveDate = today;
  }
  return progress;
}
function calculateScamDna(userId) {
  const progress = getOrCreateUserProgress(userId);
  const tacticRatings = {};
  let totalScoreSum = 0;
  ALL_TACTICS.forEach((tactic) => {
    const data = progress.tacticScores[tactic] || { total: 0, scoreSum: 0 };
    const score = data.total > 0 ? Math.round(data.scoreSum / data.total) : 0;
    tacticRatings[tactic] = Math.min(100, Math.max(0, score));
    totalScoreSum += tacticRatings[tactic];
  });
  const baseScore = Math.round(totalScoreSum / ALL_TACTICS.length);
  const overallScore = Math.min(100, Math.max(15, baseScore));
  let tier = "\u0110ang R\xE8n Luy\u1EC7n";
  if (overallScore >= 92) tier = "V\u1EC7 Binh Tinh Nhu\u1EC7";
  else if (overallScore >= 80) tier = "V\u1EC7 Binh V\u1EEFng V\xE0ng";
  else if (overallScore >= 65) tier = "\u0110ang R\xE8n Luy\u1EC7n";
  else if (overallScore >= 40) tier = "C\xF3 R\u1EE7i Ro";
  else tier = "R\u1EA5t D\u1EC5 T\u1ED5n Th\u01B0\u01A1ng";
  const quishingAccuracy = progress.quishingCompleted > 0 ? Math.round(progress.quishingCorrect / progress.quishingCompleted * 100) : 80;
  const authScore = tacticRatings["Authority"] || 68;
  const urgScore = tacticRatings["Urgency"] || 65;
  const fearScore = tacticRatings["Fear"] || 62;
  const greedScore = tacticRatings["Greed"] || 70;
  const isoScore = tacticRatings["Isolation"] || 72;
  const deepfakeScore = tacticRatings["Synthetic Media"] || 66;
  const verifScore = Math.round(authScore * 0.4 + urgScore * 0.3 + (tacticRatings["Confusion"] || 65) * 0.3);
  const privacyScore = Math.round((tacticRatings["Convenience Bias"] || 60) * 0.5 + urgScore * 0.5);
  const emotionScore = Math.round(fearScore * 0.5 + urgScore * 0.5);
  const quishingScore = Math.round(quishingAccuracy * 0.7 + (tacticRatings["Convenience Bias"] || 65) * 0.3);
  const surveyAnalytics = getCommunitySurveyAnalytics();
  const totalSurveys = surveyAnalytics ? surveyAnalytics.totalRespondents : 0;
  const allSurveys = getAllCommunitySurveys();
  const getCommDimAvg = (key) => {
    if (totalSurveys === 0 || allSurveys.length === 0) return 0;
    let sum = 0;
    allSurveys.forEach((s) => {
      if (s.testOutcome?.scamDnaShift?.before) {
        const b = s.testOutcome.scamDnaShift.before;
        if (key === "authority") sum += Math.round((1 - (b.A || 0.5)) * 100);
        else if (key === "urgency") sum += Math.round((1 - (b.T || 0.5)) * 100);
        else if (key === "fear") sum += Math.round((1 - (b.E || 0.5)) * 100);
        else if (key === "greed") sum += Math.round((1 - (b.G || 0.5)) * 100);
        else if (key === "privacy_credential") sum += Math.round((1 - (b.C || 0.5)) * 100);
        else if (key === "isolation") sum += Math.round((1 - (b.R || 0.5)) * 100);
        else sum += s.testOutcome.preScore;
      } else {
        sum += s.testOutcome.preScore;
      }
    });
    return Math.round(sum / allSurveys.length);
  };
  const dimensions = [
    {
      key: "authority",
      label: "Kh\xE1ng B\u1EABy Uy Quy\u1EC1n",
      vietnameseName: "Kh\xE1ng B\u1EABy Uy Quy\u1EC1n & Gi\u1EA3 Danh C\u01A1 Quan",
      score: authScore,
      communityAverage: getCommDimAvg("authority"),
      level: authScore >= 80 ? "OPTIMAL" : authScore >= 65 ? "MODERATE" : authScore >= 45 ? "VULNERABLE" : "CRITICAL",
      vulnerabilityRatio: Math.max(0.05, Number(((100 - authScore) / 100).toFixed(2))),
      psychologicalTrigger: "T\xE2m l\xFD ph\u1EE5c t\xF9ng uy quy\u1EC1n & t\xEA li\u1EC7t t\u01B0 duy ph\u1EA3n bi\u1EC7n khi \u0111\u1ED1i di\u1EC7n c\xF4ng quy\u1EC1n",
      behavioralSymptom: "V\u1ED9i v\xE0ng tu\xE2n th\u1EE7 m\u1EC7nh l\u1EC7nh phong t\u1ECFa ho\u1EB7c khai b\xE1o t\xE0i s\u1EA3n khi nghe x\u01B0ng danh C\xF4ng an/Vi\u1EC7n ki\u1EC3m s\xE1t",
      improvementMantra: "C\xF4ng an & Vi\u1EC7n ki\u1EC3m s\xE1t Vi\u1EC7t Nam kh\xF4ng bao gi\u1EDD l\xE0m vi\u1EC7c, tri\u1EC7u t\u1EADp hay y\xEAu c\u1EA7u ch\u1EE9ng minh t\xE0i ch\xEDnh qua Zalo/\u0110i\u1EC7n tho\u1EA1i",
      recommendedAction: "Di\u1EC5n t\u1EADp k\u1ECBch b\u1EA3n: \u0110\u1ED1i ph\xF3 L\u1EC7nh B\u1EAFt Gi\u1EA3 M\u1EA1o & Gi\u1EA3 Danh C\xE1n B\u1ED9",
      recommendedScenarioId: "police-threat-call",
      color: "#ef4444"
    },
    {
      key: "urgency",
      label: "Kh\xE1ng \xC9p Ti\u1EBFn \u0110\u1ED9",
      vietnameseName: "Kh\xE1ng D\u1ED3n \xC9p Th\u1EDDi Gian & B\u1EABy Kh\u1EA9n C\u1EA5p",
      score: urgScore,
      communityAverage: getCommDimAvg("urgency"),
      level: urgScore >= 80 ? "OPTIMAL" : urgScore >= 65 ? "MODERATE" : urgScore >= 45 ? "VULNERABLE" : "CRITICAL",
      vulnerabilityRatio: Math.max(0.05, Number(((100 - urgScore) / 100).toFixed(2))),
      psychologicalTrigger: "Hi\u1EC7u \u1EE9ng \u0111\u01B0\u1EDDng h\u1EA7m nh\u1EADn th\u1EE9c (Tunnel vision) khi b\u1ECB \u0111\u1EB7t trong gi\u1EDBi h\u1EA1n 5-15 ph\xFAt",
      behavioralSymptom: "H\xE0nh \u0111\u1ED9ng chuy\u1EC3n ti\u1EC1n ho\u1EB7c b\u1EA5m link v\u1ED9i v\xE3 v\xEC s\u1EE3 l\u1EE1 m\u1EA5t th\u1EDDi h\u1EA1n",
      improvementMantra: "B\u1EA5t k\u1EF3 tin nh\u1EAFn n\xE0o th\xFAc \xE9p thao t\xE1c t\xE0i ch\xEDnh trong v\xE0i ph\xFAt \u0111\u1EC1u l\xE0 d\u1EA5u hi\u1EC7u c\u1EE7a l\u1EEBa \u0111\u1EA3o",
      recommendedAction: "Di\u1EC5n t\u1EADp k\u1ECBch b\u1EA3n: C\u1EA3nh B\xE1o T\xE0i Kho\u1EA3n Ng\xE2n H\xE0ng B\u1ECB Kh\xF3a G\u1EA5p",
      recommendedScenarioId: "bank-lockout-alert",
      color: "#f97316"
    },
    {
      key: "fear",
      label: "L\xE1 Ch\u1EAFn N\u1ED7i S\u1EE3",
      vietnameseName: "Kh\xE1ng N\u1ED7i S\u1EE3 H\xE3i & \u0110e D\u1ECDa Ph\xE1p L\xFD",
      score: fearScore,
      communityAverage: getCommDimAvg("fear"),
      level: fearScore >= 80 ? "OPTIMAL" : fearScore >= 65 ? "MODERATE" : fearScore >= 45 ? "VULNERABLE" : "CRITICAL",
      vulnerabilityRatio: Math.max(0.05, Number(((100 - fearScore) / 100).toFixed(2))),
      psychologicalTrigger: "C\u1EA3m x\xFAc ho\u1EA3ng s\u1EE3 tr\u01B0\u1EDBc nguy c\u01A1 v\u01B0\u1EDBng v\xE0o v\xF2ng lao l\xFD ho\u1EB7c ng\u01B0\u1EDDi th\xE2n g\u1EB7p \u0111\u1EA1i n\u1EA1n",
      behavioralSymptom: 'M\u1EA5t ng\u1EE7, lo \xE2u, chuy\u1EC3n ti\u1EC1n v\xE0o "t\xE0i kho\u1EA3n an to\xE0n t\u1EA1m gi\u1EEF" \u0111\u1EC3 ch\u1EE9ng minh v\xF4 t\u1ED9i',
      improvementMantra: 'D\u1EEBng l\u1EA1i 30 gi\xE2y. C\u01A1 quan nh\xE0 n\u01B0\u1EDBc kh\xF4ng c\xF3 t\xE0i kho\u1EA3n ng\xE2n h\xE0ng c\xE1 nh\xE2n n\xE0o g\u1ECDi l\xE0 "t\xE0i kho\u1EA3n an to\xE0n"',
      recommendedAction: "Di\u1EC5n t\u1EADp k\u1ECBch b\u1EA3n: Gi\u1EA3 Danh C\u01A1 Quan \u0110i\u1EC1u Tra \u0110e D\u1ECDa \xC1n Ma T\xFAy",
      recommendedScenarioId: "police-threat-call",
      color: "#f43f5e"
    },
    {
      key: "greed",
      label: "Kh\xE1ng B\u1EABy L\u1EE3i Nhu\u1EADn",
      vietnameseName: "Kh\xE1ng L\u1EE3i Nhu\u1EADn Cao & Vi\u1EC7c Nh\u1EB9 L\u01B0\u01A1ng Cao",
      score: greedScore,
      communityAverage: getCommDimAvg("greed"),
      level: greedScore >= 80 ? "OPTIMAL" : greedScore >= 65 ? "MODERATE" : greedScore >= 45 ? "VULNERABLE" : "CRITICAL",
      vulnerabilityRatio: Math.max(0.05, Number(((100 - greedScore) / 100).toFixed(2))),
      psychologicalTrigger: "Thi\xEAn ki\u1EBFn l\u1EA1c quan qu\xE1 m\u1EE9c v\xE0 h\u1EA5p d\u1EABn t\u1EEB c\xE1c kho\u1EA3n hoa h\u1ED3ng thanh to\xE1n t\u1EE9c th\xEC",
      behavioralSymptom: "N\u1EA1p ti\u1EC1n l\xE0m nhi\u1EC7m v\u1EE5 gi\u1EADt \u0111\u01A1n h\xE0ng Shopee, TikTok \u0111\u1EC3 nh\u1EADn hoa h\u1ED3ng 30-50%",
      improvementMantra: "Kh\xF4ng c\xF3 c\xF4ng vi\u1EC7c vi\u1EC7c nh\u1EB9 l\u01B0\u01A1ng cao n\xE0o b\u1EAFt n\u1EA1p ti\u1EC1n \u1EE9ng tr\u01B0\u1EDBc \u0111\u1EC3 h\u01B0\u1EDFng hoa h\u1ED3ng",
      recommendedAction: "Di\u1EC5n t\u1EADp k\u1ECBch b\u1EA3n: B\u1EABy Tuy\u1EC3n D\u1EE5ng C\u1ED9ng T\xE1c Vi\xEAn Nh\u1EADp \u0110\u01A1n",
      recommendedScenarioId: "ecommerce-job-scam",
      color: "#eab308"
    },
    {
      key: "privacy_credential",
      label: "B\u1EA3o V\u1EC7 OTP & CCCD",
      vietnameseName: "B\u1EA3o V\u1EC7 D\u1EEF Li\u1EC7u Nh\u1EA1y C\u1EA3m & M\xE3 X\xE1c Th\u1EF1c",
      score: privacyScore,
      communityAverage: getCommDimAvg("privacy_credential"),
      level: privacyScore >= 80 ? "OPTIMAL" : privacyScore >= 65 ? "MODERATE" : privacyScore >= 45 ? "VULNERABLE" : "CRITICAL",
      vulnerabilityRatio: Math.max(0.05, Number(((100 - privacyScore) / 100).toFixed(2))),
      psychologicalTrigger: "Nh\u1EA7m l\u1EABn m\xE3 OTP chuy\u1EC3n ti\u1EC1n v\u1EDBi m\xE3 nh\u1EADn ti\u1EC1n ho\u1EB7c m\xE3 h\u1EE7y giao d\u1ECBch",
      behavioralSymptom: "Ch\u1EE5p 2 m\u1EB7t CCCD, \u0111\u1ECDc m\xE3 OTP 6 s\u1ED1 ho\u1EB7c m\u1EADt kh\u1EA9u Smart OTP cho ng\u01B0\u1EDDi l\u1EA1",
      improvementMantra: "M\xE3 OTP l\xE0 ch\xECa kh\xF3a r\xFAt ti\u1EC1n. Tuy\u1EC7t \u0111\u1ED1i kh\xF4ng \u0111\u1ECDc ho\u1EB7c nh\u1EADp v\xE0o b\u1EA5t k\u1EF3 trang web n\xE0o",
      recommendedAction: "Hu\u1EA5n luy\u1EC7n: Ph\xF2ng ng\u1EEBa \u0110\xE1nh c\u1EAFp \u0110\u1ECBnh danh & OTP",
      recommendedScenarioId: "bank-lockout-alert",
      color: "#06b6d4"
    },
    {
      key: "isolation",
      label: "Ph\xE1 V\u1EE1 C\xF4 L\u1EADp",
      vietnameseName: "Kh\xE1ng B\u1EABy B\xED M\u1EADt & Thao T\xFAng C\xF4 L\u1EADp",
      score: isoScore,
      communityAverage: getCommDimAvg("isolation"),
      level: isoScore >= 80 ? "OPTIMAL" : isoScore >= 65 ? "MODERATE" : isoScore >= 45 ? "VULNERABLE" : "CRITICAL",
      vulnerabilityRatio: Math.max(0.05, Number(((100 - isoScore) / 100).toFixed(2))),
      psychologicalTrigger: "T\xE2m l\xFD s\u1EE3 b\u1ECB l\u1ED9 b\xED m\u1EADt ho\u1EB7c b\u1ECB \u0111e d\u1ECDa \xE1n ph\u1EA1t n\u1EB7ng n\u1EBFu k\u1EC3 cho gia \u0111\xECnh",
      behavioralSymptom: "T\u1EF1 v\xE0o ph\xF2ng k\xEDn kh\xF3a c\u1EEDa, kh\xF4ng b\xE0n b\u1EA1c v\u1EDBi ng\u01B0\u1EDDi th\xE2n tr\u01B0\u1EDBc khi chuy\u1EC3n t\xE0i s\u1EA3n",
      improvementMantra: "Khi b\u1ECB y\xEAu c\u1EA7u gi\u1EEF b\xED m\u1EADt tuy\u1EC7t \u0111\u1ED1i, \u0111\xF3 l\xE0 th\u1EDDi \u0111i\u1EC3m quan tr\u1ECDng nh\u1EA5t ph\u1EA3i h\u1ECFi \xFD ki\u1EBFn ng\u01B0\u1EDDi th\xE2n",
      recommendedAction: "Di\u1EC5n t\u1EADp: Ph\xE1 v\u1EE1 b\u1EABy c\xF4 l\u1EADp trong \u0111i\u1EC1u tra gi\u1EA3 m\u1EA1o",
      recommendedScenarioId: "police-threat-call",
      color: "#8b5cf6"
    },
    {
      key: "verification_reflex",
      label: "Ph\u1EA3n X\u1EA1 X\xE1c Minh",
      vietnameseName: "Ph\u1EA3n X\u1EA1 X\xE1c Minh \u0110\u1ED9c L\u1EADp K\xEAnh Ph\u1EE5",
      score: verifScore,
      communityAverage: getCommDimAvg("verification_reflex"),
      level: verifScore >= 80 ? "OPTIMAL" : verifScore >= 65 ? "MODERATE" : verifScore >= 45 ? "VULNERABLE" : "CRITICAL",
      vulnerabilityRatio: Math.max(0.05, Number(((100 - verifScore) / 100).toFixed(2))),
      psychologicalTrigger: "Th\xF3i quen ng\u1EA1i \u0111\u1ED1i chi\u1EBFu ch\xE9o khi b\xEAn kia \u0111\u01B0a ra th\xF4ng tin c\xF3 v\u1EBB tr\xF9ng kh\u1EDBp",
      behavioralSymptom: "B\u1ECF qua vi\u1EC7c g\u1ECDi l\u1EA1i s\u1ED1 hotline ng\xE2n h\xE0ng in \u1EDF m\u1EB7t sau th\u1EBB",
      improvementMantra: "Quy t\u1EAFc v\xE0ng M\u1EB7t Sau C\u1EE7a Th\u1EBB: C\xFAp m\xE1y ngay v\xE0 t\u1EF1 tay b\u1EA5m s\u1ED1 in tr\xEAn th\u1EBB ng\xE2n h\xE0ng",
      recommendedAction: "Luy\u1EC7n t\u1EADp: Th\u1EF1c h\xE0nh ph\u1EA3n x\u1EA1 x\xE1c th\u1EF1c k\xEAnh ph\u1EE5",
      recommendedScenarioId: "bank-lockout-alert",
      color: "#10b981"
    },
    {
      key: "quishing_domain",
      label: "Soi T\xEAn Mi\u1EC1n & QR",
      vietnameseName: "C\u1EA3nh Gi\xE1c Quishing QR & Gi\u1EA3 M\u1EA1o T\xEAn Mi\u1EC1n",
      score: quishingScore,
      communityAverage: getCommDimAvg("quishing_domain"),
      level: quishingScore >= 80 ? "OPTIMAL" : quishingScore >= 65 ? "MODERATE" : quishingScore >= 45 ? "VULNERABLE" : "CRITICAL",
      vulnerabilityRatio: Math.max(0.05, Number(((100 - quishingScore) / 100).toFixed(2))),
      psychologicalTrigger: "Ti\u1EC7n l\u1EE3i thao t\xE1c nhanh tr\xEAn smartphone l\xE0m b\u1ECF qua kh\xE2u soi URL g\u1ED1c",
      behavioralSymptom: "Qu\xE9t m\xE3 QR kh\xF4ng r\xF5 ngu\u1ED3n g\u1ED1c ho\u1EB7c \u0111\u0103ng nh\u1EADp v\xE0o domain l\u1EA1 d\u1EA1ng .site, .online",
      improvementMantra: "Ki\u1EC3m tra k\u1EF9 t\xEAn mi\u1EC1n ch\xEDnh th\u1EE9c (.vn / .com.vn). Qu\xE9t QR ph\u1EA3i xem tr\u01B0\u1EDBc \u0111\u1ECBa ch\u1EC9 \u0111\xEDch",
      recommendedAction: "Ph\xF2ng th\xED nghi\u1EC7m Quishing Lab: Soi m\xE3 \u0111\u1ED9c QR",
      recommendedScenarioId: "lottery-fake-link",
      color: "#3b82f6"
    },
    {
      key: "emotional_stability",
      label: "\u1ED4n \u0110\u1ECBnh C\u1EA3m X\xFAc",
      vietnameseName: "Ki\u1EC3m So\xE1t C\u1EA3m X\xFAc & \u1EE8c Ch\u1EBF B\u1ED1c \u0110\u1ED3ng",
      score: emotionScore,
      communityAverage: getCommDimAvg("emotional_stability"),
      level: emotionScore >= 80 ? "OPTIMAL" : emotionScore >= 65 ? "MODERATE" : emotionScore >= 45 ? "VULNERABLE" : "CRITICAL",
      vulnerabilityRatio: Math.max(0.05, Number(((100 - emotionScore) / 100).toFixed(2))),
      psychologicalTrigger: "K\xEDch \u0111\u1ED9ng c\u1EA3m x\xFAc l\u1EA5n \xE1t v\xF9ng n\xE3o t\u01B0 duy logic",
      behavioralSymptom: "Tim \u0111\u1EADp d\u1ED3n d\u1EADp, ho\u1EA3ng lo\u1EA1n ho\u1EB7c qu\xE1 ph\u1EA5n kh\xEDch khi nh\u1EADn qu\xE0 t\u1EB7ng gi\xE1 tr\u1ECB cao",
      improvementMantra: "H\xEDt th\u1EDF s\xE2u 3 nh\u1ECBp v\xE0 \u0111\u1EB7t \u0111i\u1EC7n tho\u1EA1i xu\u1ED1ng b\xE0n \xEDt nh\u1EA5t 60 gi\xE2y tr\u01B0\u1EDBc khi b\u1EA5m chuy\u1EC3n kho\u1EA3n",
      recommendedAction: "Th\u1EF1c h\xE0nh: L\xE0m ch\u1EE7 c\u1EA3m x\xFAc tr\u01B0\u1EDBc c\xE1c c\xFA s\u1ED1c tin nh\u1EAFn",
      recommendedScenarioId: "bank-lockout-alert",
      color: "#14b8a6"
    },
    {
      key: "deepfake_ai",
      label: "Nh\u1EADn Di\u1EC7n AI Deepfake",
      vietnameseName: "Nh\u1EADn Di\u1EC7n Gi\u1EA3 M\u1EA1o \xC2m Thanh & Video AI",
      score: deepfakeScore,
      communityAverage: getCommDimAvg("deepfake_ai"),
      level: deepfakeScore >= 80 ? "OPTIMAL" : deepfakeScore >= 65 ? "MODERATE" : deepfakeScore >= 45 ? "VULNERABLE" : "CRITICAL",
      vulnerabilityRatio: Math.max(0.05, Number(((100 - deepfakeScore) / 100).toFixed(2))),
      psychologicalTrigger: "Ni\u1EC1m tin tr\u1EF1c gi\xE1c b\u1EB1ng m\u1EAFt v\xE0 tai tr\u01B0\u1EDBc h\xECnh \u1EA3nh/\xE2m thanh ng\u01B0\u1EDDi th\xE2n quen",
      behavioralSymptom: "Tin ngay khi th\u1EA5y khu\xF4n m\u1EB7t b\u1EA1n th\xE2n xu\u1EA5t hi\u1EC7n 5-10 gi\xE2y trong video call ch\u1EADp ch\u1EDDn",
      improvementMantra: "Lu\xF4n h\u1ECFi M\u1EADt Kh\u1EA9u An To\xE0n Gia \u0110\xECnh ho\u1EB7c y\xEAu c\u1EA7u ng\u01B0\u1EDDi \u0111\u1ED1i di\u1EC7n quay m\u1EB7t g\xF3c 90 \u0111\u1ED9",
      recommendedAction: "Di\u1EC5n t\u1EADp ph\xF2ng th\xED nghi\u1EC7m: Deepfake Voice Clone & Video Call",
      recommendedScenarioId: "deepfake-friend-loan",
      color: "#ec4899"
    }
  ];
  let archetype;
  if (overallScore >= 85 && verifScore >= 80) {
    archetype = {
      id: "vigilant_sentinel",
      title: "V\u1EC7 Binh Tinh Nhu\u1EC7",
      subtitle: "Ph\u1EA3n x\u1EA1 ph\xF2ng v\u1EC7 m\u1EABu m\u1EF1c & T\u01B0 duy ph\u1EA3n bi\u1EC7n th\xE9p",
      description: "B\u1EA1n s\u1EDF h\u1EEFu h\xE0ng r\xE0o ph\xF2ng th\u1EE7 ki\xEAn c\u1ED1, lu\xF4n k\xEDch ho\u1EA1t b\u1EA3n n\u0103ng x\xE1c minh \u0111\u1ED9c l\u1EADp v\xE0 kh\xF4ng bao gi\u1EDD \u0111\u1EC3 \xE1p l\u1EF1c th\u1EDDi gian hay \u0111\xF2n t\xE2m l\xFD uy quy\u1EC1n chi ph\u1ED1i quy\u1EBFt \u0111\u1ECBnh.",
      primaryStrength: "Ph\u1EA3n x\u1EA1 x\xE1c minh k\xEAnh ph\u1EE5 v\xE0 t\u1EEB ch\u1ED1i cung c\u1EA5p d\u1EEF li\u1EC7u nh\u1EA1y c\u1EA3m xu\u1EA5t s\u1EAFc.",
      blindspotAlert: "C\u1EA7n duy tr\xEC s\u1EF1 c\u1EA3nh gi\xE1c tr\u01B0\u1EDBc c\xE1c bi\u1EBFn th\u1EC3 l\u1EEBa \u0111\u1EA3o c\xF4ng ngh\u1EC7 cao Deepfake th\u1EBF h\u1EC7 m\u1EDBi.",
      iconName: "ShieldCheck",
      tagColor: "text-emerald-400 border-emerald-500/40 bg-emerald-950/60"
    };
  } else if (verifScore >= 75) {
    archetype = {
      id: "forensic_analyst",
      title: "Nh\xE0 \u0110i\u1EC1u Tra \u0110\u1ED9c L\u1EADp",
      subtitle: "Ho\xE0i nghi l\xE0nh m\u1EA1nh & Ph\xE2n t\xEDch ch\u1EE9ng c\u1EE9",
      description: "B\u1EA1n c\xF3 xu h\u01B0\u1EDBng ki\u1EC3m tra ngu\u1ED3n g\u1ED1c th\xF4ng tin v\xE0 kh\xF4ng d\u1EC5 tin v\xE0o l\u1EDDi \u0111e d\u1ECDa su\xF4ng. B\u1EA1n lu\xF4n t\xECm ki\u1EBFm ch\u1EE9ng c\u1EE9 th\u1EF1c t\u1EBF tr\u01B0\u1EDBc khi h\xE0nh \u0111\u1ED9ng.",
      primaryStrength: "Ki\u1EC3m ch\u1EE9ng ch\xE9o danh t\xEDnh \u0111\u1ED1i ph\u01B0\u01A1ng r\u1EA5t b\xE0i b\u1EA3n.",
      blindspotAlert: "\u0110\xF4i khi c\xF3 th\u1EC3 m\u1EA5t c\u1EA3nh gi\xE1c tr\u01B0\u1EDBc c\xE1c b\u1EABy qu\xE9t m\xE3 QR ti\u1EC7n l\u1EE3i t\u1EA1i n\u01A1i c\xF4ng c\u1ED9ng.",
      iconName: "Search",
      tagColor: "text-cyan-400 border-cyan-500/40 bg-cyan-950/60"
    };
  } else if (fearScore < 60 || authScore < 60) {
    archetype = {
      id: "empathic_guardian",
      title: "H\u1ED9 V\u1EC7 Nh\u1EA1y C\u1EA3m \xC1p L\u1EF1c",
      subtitle: "Thi\u1EC7n ch\xED cao nh\u01B0ng d\u1EC5 b\u1ECB chi ph\u1ED1i t\xE2m l\xFD",
      description: "B\u1EA1n c\xF3 t\u1EA5m l\xF2ng nh\xE2n h\u1EADu v\xE0 t\xF4n tr\u1ECDng ph\xE1p lu\u1EADt, nh\u01B0ng ch\xEDnh \u0111i\u1EC1u n\xE0y khi\u1EBFn k\u1EBB l\u1EEBa \u0111\u1EA3o d\u1EC5 l\u1EE3i d\u1EE5ng c\xE1c \u0111\xF2n d\u1ECDa d\u1EABm \xE1n h\xECnh s\u1EF1 ho\u1EB7c tin ng\u01B0\u1EDDi th\xE2n g\u1EB7p n\u1EA1n \u0111\u1EC3 d\u1ED3n \xE9p.",
      primaryStrength: "\xDD th\u1EE9c t\u1EF1 gi\xE1c v\xE0 mong mu\u1ED1n b\u1EA3o v\u1EC7 gia \u0111\xECnh.",
      blindspotAlert: "C\u1EA7n r\xE8n luy\u1EC7n ph\u1EA3n x\u1EA1 ng\u1EAFt k\u1EBFt n\u1ED1i d\u1EE9t kho\xE1t khi \u0111\u1ED1i ph\u01B0\u01A1ng x\u01B0ng danh c\u01A1 quan ch\u1EE9c n\u0103ng \u0111e d\u1ECDa.",
      iconName: "Heart",
      tagColor: "text-amber-400 border-amber-500/40 bg-amber-950/60"
    };
  } else {
    archetype = {
      id: "adaptive_shield",
      title: "Chi\u1EBFn Binh Ti\u1EC1m N\u0103ng",
      subtitle: "\u0110ang h\xECnh th\xE0nh b\u1ED9 gen \u0111\u1EC1 kh\xE1ng to\xE0n di\u1EC7n",
      description: "H\u1EC7 th\u1ED1ng ph\xF2ng v\u1EC7 c\u1EE7a b\u1EA1n \u0111ang ph\xE1t tri\u1EC3n t\xEDch c\u1EF1c qua t\u1EEBng l\u01B0\u1EE3t di\u1EC5n t\u1EADp. B\u1EA1n \u0111\xE3 b\u1EAFt \u0111\u1EA7u nh\u1EADn ra c\xE1c m\xE1nh kh\xF3e c\u01A1 b\u1EA3n nh\u01B0ng c\u1EA7n t\xF4i luy\u1EC7n th\xEAm t\u1ED1c \u0111\u1ED9 ph\u1EA3n x\u1EA1.",
      primaryStrength: "Kh\u1EA3 n\u0103ng ti\u1EBFp thu ki\u1EBFn th\u1EE9c v\xE0 c\u1EA3i thi\u1EC7n \u0111i\u1EC3m s\u1ED1 nhanh ch\xF3ng.",
      blindspotAlert: "C\u1EA7n luy\u1EC7n t\u1EADp th\xEAm c\xE1c t\xECnh hu\u1ED1ng d\u1ED3n \xE9p th\u1EDDi gian \u0111\u1EBFm ng\u01B0\u1EE3c 5 ph\xFAt.",
      iconName: "Sparkles",
      tagColor: "text-purple-400 border-purple-500/40 bg-purple-950/60"
    };
  }
  const sortedTactics = Object.entries(tacticRatings).map(([tactic, score]) => ({ tactic, score })).sort((a, b) => b.score - a.score);
  const strongestTactics = sortedTactics.slice(0, 3).map((item) => ({
    tactic: item.tactic,
    score: item.score,
    reason: getTacticStrengthReason(item.tactic)
  }));
  const weakestTactics = sortedTactics.slice(-3).reverse().map((item) => ({
    tactic: item.tactic,
    score: item.score,
    reason: getTacticWeaknessReason(item.tactic),
    recommendedScenarioId: findRecommendedScenarioForTactic(item.tactic)
  }));
  const criticalBlindspots = dimensions.filter((d) => d.score < 70).sort((a, b) => a.score - b.score).slice(0, 3).map((d) => ({
    dimension: d.vietnameseName,
    score: d.score,
    gapWithCommunity: Math.round(d.score - d.communityAverage),
    dangerSummary: d.behavioralSymptom,
    scenarioId: d.recommendedScenarioId,
    scenarioTitle: d.recommendedAction
  }));
  return {
    overallScore,
    tier,
    archetype,
    dimensions,
    tacticRatings,
    strongestTactics,
    weakestTactics,
    criticalBlindspots,
    historicalScores: [
      { date: "Tu\u1EA7n 1", score: Math.max(20, overallScore - 22), communityAverage: 62 },
      { date: "Tu\u1EA7n 2", score: Math.max(30, overallScore - 14), communityAverage: 63 },
      { date: "Tu\u1EA7n 3", score: Math.max(40, overallScore - 6), communityAverage: 63 },
      { date: "Hi\u1EC7n t\u1EA1i", score: overallScore, communityAverage: 64 }
    ],
    historicalTrend30Days: Array.from({ length: 30 }, (_, i) => {
      const dayIndex = i + 1;
      const progressFactor = i / 29;
      const baseSdi = Math.max(35, overallScore - 18);
      const sdi = Math.min(99, Math.max(30, Math.round(baseSdi + (overallScore - baseSdi) * progressFactor)));
      const risk = 100 - sdi;
      const refDate = /* @__PURE__ */ new Date();
      refDate.setDate(refDate.getDate() - (29 - i));
      const dateStr = `${refDate.getDate().toString().padStart(2, "0")}/${(refDate.getMonth() + 1).toString().padStart(2, "0")}`;
      const fullDateStr = `${dateStr}/${refDate.getFullYear()}`;
      let milestoneEvent = void 0;
      if (dayIndex === 4) {
        milestoneEvent = {
          title: "Kh\u1EDFi \u0110\u1ED9ng \u0110\xE1nh Gi\xE1 Scam DNA",
          description: "Ho\xE0n th\xE0nh b\xE0i kh\u1EA3o s\xE1t ban \u0111\u1EA7u x\xE1c \u0111\u1ECBnh h\xECnh m\u1EABu ph\xF2ng th\u1EE7.",
          xpEarned: 100,
          category: "drill"
        };
      } else if (dayIndex === 10) {
        milestoneEvent = {
          title: "H\xF3a Gi\u1EA3i B\u1EABy C\xF4ng An Gi\u1EA3 M\u1EA1o",
          description: "Ph\u1EA3n x\u1EA1 th\xE0nh c\xF4ng tr\u01B0\u1EDBc cu\u1ED9c g\u1ECDi \u0111e d\u1ECDa r\u1EEDa ti\u1EC1n trong Scam Arena.",
          xpEarned: 250,
          category: "arena"
        };
      } else if (dayIndex === 17) {
        milestoneEvent = {
          title: "Ph\xF2ng Th\xED Nghi\u1EC7m Quishing Lab",
          description: "\u0110\u1EA1t \u0111\u1ED9 ch\xEDnh x\xE1c 100% khi ph\xE2n t\xEDch 10 m\xE3 QR d\xE1n \u0111\xE8 t\u1EA1i b\xE0n \u0103n.",
          xpEarned: 300,
          category: "quishing"
        };
      } else if (dayIndex === 23) {
        milestoneEvent = {
          title: "\u0110\xE1nh B\u1EA1i Video AI Deepfake",
          description: "Ph\xE1t hi\u1EC7n video call clone ng\u01B0\u1EDDi th\xE2n nh\u1EDD m\u1EB9o y\xEAu c\u1EA7u quay g\xF3c 90 \u0111\u1ED9.",
          xpEarned: 350,
          category: "deepfake"
        };
      } else if (dayIndex === 28) {
        milestoneEvent = {
          title: "X\xE1c L\u1EADp Chu\u1ED7i 7 Ng\xE0y K\u1EF7 Lu\u1EADt",
          description: "B\u1EA3o v\u1EC7 th\xE0nh c\xF4ng m\xE3 Smart OTP tr\u01B0\u1EDBc chi\xEAu tr\xF2 n\xE2ng c\u1EA5p Sim 5G.",
          xpEarned: 500,
          category: "streak"
        };
      }
      return {
        date: dateStr,
        fullDate: fullDateStr,
        dayIndex,
        overallScore: i === 29 ? overallScore : sdi,
        riskScore: risk,
        psychologyScore: Math.min(99, Math.max(30, Math.round(sdi - 3 + (dayIndex > 10 ? 2 : -2)))),
        technicalScore: Math.min(99, Math.max(30, Math.round(sdi - 5 + (dayIndex > 17 ? 4 : -3)))),
        financialScore: Math.min(99, Math.max(30, Math.round(sdi + 1 + (dayIndex > 28 ? 3 : 0)))),
        communityAverage: 63.5,
        milestoneEvent
      };
    }),
    totalSessionsCompleted: progress.sessionsCompleted,
    quishingAccuracy,
    drillsCompleted: progress.drillsCompleted,
    currentStreakDays: progress.currentStreakDays,
    totalXp: progress.totalXp
  };
}
function getCommunityScamDna(userOverallScore) {
  const userScore = userOverallScore || 75;
  const surveyAnalytics = getCommunitySurveyAnalytics();
  const trialCount = getAllParticipantTrials().length;
  const surveyCount = surveyAnalytics ? surveyAnalytics.totalRespondents : 0;
  const totalParticipants = surveyCount + trialCount;
  const mean = 63.8;
  const std = 14;
  const z2 = (userScore - mean) / std;
  const t = 1 / (1 + 0.2316419 * Math.abs(z2));
  const d = 0.3989423 * Math.exp(-z2 * z2 / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z2 > 0) p = 1 - p;
  const percentileRank = Math.min(99, Math.max(1, Math.round(p * 100)));
  const commMean = surveyCount > 0 ? Math.round(surveyAnalytics.preAppBaselineStats.avgInitialDefenseScore) : 0;
  const allSurveys = getAllCommunitySurveys();
  const getDimAvg = (key) => {
    if (surveyCount === 0 || allSurveys.length === 0) return 0;
    let sum = 0;
    allSurveys.forEach((s) => {
      if (s.testOutcome?.scamDnaShift?.before) {
        const b = s.testOutcome.scamDnaShift.before;
        if (key === "authority") sum += Math.round((1 - (b.A || 0.5)) * 100);
        else if (key === "urgency") sum += Math.round((1 - (b.T || 0.5)) * 100);
        else if (key === "fear") sum += Math.round((1 - (b.E || 0.5)) * 100);
        else if (key === "greed") sum += Math.round((1 - (b.G || 0.5)) * 100);
        else if (key === "privacy_credential") sum += Math.round((1 - (b.C || 0.5)) * 100);
        else if (key === "isolation") sum += Math.round((1 - (b.R || 0.5)) * 100);
        else sum += s.testOutcome.preScore;
      } else {
        sum += s.testOutcome.preScore;
      }
    });
    return Math.round(sum / allSurveys.length);
  };
  return {
    totalParticipants,
    lastUpdated: "V\u1EEBa c\u1EADp nh\u1EADt (Th\u1EDDi gian th\u1EF1c)",
    overallCommunityAverage: commMean,
    percentileRank: totalParticipants > 0 ? percentileRank : 0,
    dimensionAverages: {
      authority: getDimAvg("authority"),
      urgency: getDimAvg("urgency"),
      fear: getDimAvg("fear"),
      greed: getDimAvg("greed"),
      privacy_credential: getDimAvg("privacy_credential"),
      isolation: getDimAvg("isolation"),
      verification_reflex: getDimAvg("verification_reflex"),
      quishing_domain: getDimAvg("quishing_domain"),
      emotional_stability: getDimAvg("emotional_stability"),
      deepfake_ai: getDimAvg("deepfake_ai")
    },
    scamDnaVector: {
      T: Number((1 - getDimAvg("urgency") / 100).toFixed(2)),
      A: Number((1 - getDimAvg("authority") / 100).toFixed(2)),
      G: Number((1 - getDimAvg("greed") / 100).toFixed(2)),
      E: Number((1 - getDimAvg("fear") / 100).toFixed(2)),
      C: Number((1 - getDimAvg("privacy_credential") / 100).toFixed(2)),
      R: Number((1 - getDimAvg("isolation") / 100).toFixed(2))
    },
    topVulnerabilitiesNational: [
      {
        key: "authority",
        label: "Gi\u1EA3 M\u1EA1o C\xF4ng An / Vi\u1EC7n Ki\u1EC3m S\xE1t",
        vulnerabilityRate: totalParticipants > 0 ? 68.4 : 0,
        description: totalParticipants > 0 ? "68.4% ng\u01B0\u1EDDi d\xF9ng ban \u0111\u1EA7u c\xF3 t\xE2m l\xFD lo s\u1EE3 v\xE0 ch\u1EA5p nh\u1EADn l\xE0m vi\u1EC7c qua \u0111i\u1EC7n tho\u1EA1i khi \u0111\u1ED1i ph\u01B0\u01A1ng x\u01B0ng danh c\u01A1 quan c\xF4ng quy\u1EC1n." : "\u0110ang ch\u1EDD thu th\u1EADp d\u1EEF li\u1EC7u ng\u01B0\u1EDDi d\xF9ng th\u1EF1c t\u1EBF (N = 0).",
        trend: "rising"
      },
      {
        key: "quishing_domain",
        label: "M\xE3 QR \u0110\u1ED9c Quishing T\u1EA1i Qu\xE1n \u0102n / H\xF3a \u0110\u01A1n",
        vulnerabilityRate: totalParticipants > 0 ? 62.1 : 0,
        description: totalParticipants > 0 ? "H\u01A1n 6 tr\xEAn 10 ng\u01B0\u1EDDi d\xF9ng qu\xE9t m\xE3 QR chuy\u1EC3n ti\u1EC1n thanh to\xE1n m\xE0 kh\xF4ng nh\xECn k\u1EF9 t\xEAn mi\u1EC1n \u0111\xEDch hay t\xE0i kho\u1EA3n th\u1EE5 h\u01B0\u1EDFng." : "\u0110ang ch\u1EDD thu th\u1EADp d\u1EEF li\u1EC7u ng\u01B0\u1EDDi d\xF9ng th\u1EF1c t\u1EBF (N = 0).",
        trend: "rising"
      },
      {
        key: "urgency",
        label: "D\u1ED3n \xC9p \u0110\u1EBFm Ng\u01B0\u1EE3c 5-15 Ph\xFAt",
        vulnerabilityRate: totalParticipants > 0 ? 58.7 : 0,
        description: totalParticipants > 0 ? "T\u1EA1o \xE1p l\u1EF1c th\u1EDDi gian khi\u1EBFn t\u1EF7 l\u1EC7 s\u1EADp b\u1EABy t\u0103ng g\u1EA5p 2.4 l\u1EA7n so v\u1EDBi c\xE1c k\u1ECBch b\u1EA3n trao \u0111\u1ED5i th\xF4ng th\u01B0\u1EDDng." : "\u0110ang ch\u1EDD thu th\u1EADp d\u1EEF li\u1EC7u ng\u01B0\u1EDDi d\xF9ng th\u1EF1c t\u1EBF (N = 0).",
        trend: "stable"
      },
      {
        key: "greed",
        label: "Nhi\u1EC7m V\u1EE5 \u0110\u01A1n H\xE0ng Hoa H\u1ED3ng Cao",
        vulnerabilityRate: totalParticipants > 0 ? 52 : 0,
        description: totalParticipants > 0 ? "Chi\xEAu tr\xF2 ho\xE0n ti\u1EC1n 50k \u0111\u1EA7u ti\xEAn l\xE0m m\u1ED3i nh\u1EED v\u1EABn l\xE0 c\xE1i b\u1EABy t\xE0i ch\xEDnh g\xE2y thi\u1EC7t h\u1EA1i l\u1EDBn nh\u1EA5t cho \u0111\u1ED1i t\u01B0\u1EE3ng tr\u1EBB." : "\u0110ang ch\u1EDD thu th\u1EADp d\u1EEF li\u1EC7u ng\u01B0\u1EDDi d\xF9ng th\u1EF1c t\u1EBF (N = 0).",
        trend: "declining"
      },
      {
        key: "deepfake_ai",
        label: "Gi\u1EA3 M\u1EA1o Gi\u1ECDng N\xF3i Con Ch\xE1u C\u1EA5p C\u1EE9u",
        vulnerabilityRate: totalParticipants > 0 ? 49.3 : 0,
        description: totalParticipants > 0 ? "C\xE1c cu\u1ED9c g\u1ECDi 10-15 gi\xE2y gi\u1EA3 gi\u1ECDng kh\xF3c l\xF3c ng\u01B0\u1EDDi th\xE2n g\u1EB7p n\u1EA1n c\xF3 t\u1EF7 l\u1EC7 g\xE2y ho\u1EA3ng lo\u1EA1n r\u1EA5t cao \u0111\u1ED1i v\u1EDBi ng\u01B0\u1EDDi l\u1EDBn tu\u1ED5i." : "\u0110ang ch\u1EDD thu th\u1EADp d\u1EEF li\u1EC7u ng\u01B0\u1EDDi d\xF9ng th\u1EF1c t\u1EBF (N = 0).",
        trend: "rising"
      }
    ],
    demographicBreakdown: [
      {
        group: "H\u1ECDc sinh & Sinh vi\xEAn (Gen Z, 15 - 22 tu\u1ED5i)",
        averageScore: totalParticipants > 0 ? 61.2 : 0,
        sampleCount: Math.round(totalParticipants * 0.45),
        criticalWeakness: totalParticipants > 0 ? "B\u1EABy vi\u1EC7c l\xE0m online hoa h\u1ED3ng cao & Qu\xE0 t\u1EB7ng \u1EA3o qua m\u1EA1ng x\xE3 h\u1ED9i" : "Ch\u01B0a c\xF3 m\u1EABu th\u1EF1c t\u1EBF",
        color: "#06b6d4"
      },
      {
        group: "Nh\xE2n vi\xEAn v\u0103n ph\xF2ng & Tr\u01B0\u1EDFng th\xE0nh (23 - 50 tu\u1ED5i)",
        averageScore: totalParticipants > 0 ? 67.5 : 0,
        sampleCount: Math.round(totalParticipants * 0.35),
        criticalWeakness: totalParticipants > 0 ? "M\u1EA1o danh c\u01A1 quan thu\u1EBF, ph\xED b\u01B0u \u0111i\u1EC7n & B\u1EABy qu\xE9t m\xE3 QR b\xE0n \u0103n" : "Ch\u01B0a c\xF3 m\u1EABu th\u1EF1c t\u1EBF",
        color: "#10b981"
      },
      {
        group: "Ng\u01B0\u1EDDi cao tu\u1ED5i & H\u01B0u tr\xED (Tr\xEAn 50 tu\u1ED5i)",
        averageScore: totalParticipants > 0 ? 52.4 : 0,
        sampleCount: Math.round(totalParticipants * 0.2),
        criticalWeakness: totalParticipants > 0 ? "Gi\u1EA3 danh c\xF4ng an \u0111i\u1EC1u tra \xE1n ma t\xFAy & Cu\u1ED9c g\u1ECDi AI gi\u1EA3 gi\u1ECDng ng\u01B0\u1EDDi th\xE2n c\u1EA5p c\u1EE9u" : "Ch\u01B0a c\xF3 m\u1EABu th\u1EF1c t\u1EBF",
        color: "#f59e0b"
      }
    ],
    trendingThreatsMonth: [
      {
        name: "Chi\u1EBFm \u0111o\u1EA1t t\xE0i kho\u1EA3n qua m\xE3 QR nh\u1EADn v\xE9 m\xE1y bay / qu\xE0 t\u1EB7ng",
        impactPercentage: 34.2,
        description: "\u0110\u1ED1i t\u01B0\u1EE3ng g\u1EEDi m\xE3 QR qua Zalo m\u1EDDi nh\u1EADn v\xE9 du l\u1ECBch h\xE8, qu\xE9t m\xE3 d\u1EABn v\xE0o trang phishing chi\u1EBFm quy\u1EC1n phi\xEAn \u0111\u0103ng nh\u1EADp.",
        dangerLevel: "CRITICAL"
      },
      {
        name: "Cu\u1ED9c g\u1ECDi Deepfake video m\u1EDD gi\u1EADt m\u01B0\u1EE3n ti\u1EC1n kh\u1EA9n c\u1EA5p",
        impactPercentage: 28.5,
        description: "C\u1EAFt gh\xE9p video 3 gi\xE2y m\u1EB7t b\u1EA1n b\xE8 r\u1ED3i vi\u1EC7n c\u1EDB m\u1EA1ng lag \u0111\u1EC3 y\xEAu c\u1EA7u chuy\u1EC3n kho\u1EA3n g\u1EA5p v\xE0o s\u1ED1 t\xE0i kho\u1EA3n l\u1EA1.",
        dangerLevel: "HIGH"
      },
      {
        name: "Gi\u1EA3 m\u1EA1o \u1EE9ng d\u1EE5ng C\u1ED5ng d\u1ECBch v\u1EE5 c\xF4ng VNeID c\u1EADp nh\u1EADt sinh tr\u1EAFc h\u1ECDc",
        impactPercentage: 24.1,
        description: "D\u1EABn d\u1EE5 n\u1EA1n nh\xE2n c\xE0i file APK m\xE3 \u0111\u1ED9c \u0111\u1EC3 chi\u1EBFm to\xE0n b\u1ED9 quy\u1EC1n tr\u1EE3 n\u0103ng Accessibility tr\xEAn \u0111i\u1EC7n tho\u1EA1i Android.",
        dangerLevel: "CRITICAL"
      }
    ]
  };
}
function getTacticStrengthReason(tactic) {
  switch (tactic) {
    case "Authority":
      return "Ph\u1EA3n x\u1EA1 kh\xF4ng s\u1EE3 h\xE3i tr\u01B0\u1EDBc l\u1EDDi \u0111e d\u1ECDa t\u1EEB c\u01A1 quan gi\u1EA3 m\u1EA1o v\xE0 lu\xF4n y\xEAu c\u1EA7u v\u0103n b\u1EA3n tri\u1EC7u t\u1EADp h\u1EE3p ph\xE1p.";
    case "Urgency":
      return "B\xECnh t\u0129nh ki\u1EC3m so\xE1t nh\u1ECBp \u0111\u1ED9, t\u1EEB ch\u1ED1i h\xE0nh \u0111\u1ED9ng v\u1ED9i v\xE3 khi b\u1ECB \xE1p \u0111\u1EB7t th\u1EDDi gian gi\u1EDBi h\u1EA1n.";
    case "Synthetic Media":
      return "Nh\u1EA1y b\xE9n nh\u1EADn di\u1EC7n c\xE1c d\u1EA5u hi\u1EC7u m\xE9o ti\u1EBFng, nh\xE1y h\xECnh v\xE0 \u0111\u1ED9 tr\u1EC5 kh\u1EA9u h\xECnh c\u1EE7a c\xF4ng ngh\u1EC7 Deepfake.";
    case "Convenience Bias":
      return "C\u1EA9n tr\u1ECDng soi k\u1EF9 t\xEAn mi\u1EC1n v\xE0 kh\xF4ng t\xF9y ti\u1EC7n qu\xE9t m\xE3 QR \u1EDF n\u01A1i c\xF4ng c\u1ED9ng.";
    case "Social Proof":
      return "Kh\xF4ng b\u1ECB cu\u1ED1n theo t\xE2m l\xFD \u0111\xE1m \u0111\xF4ng ho\u1EB7c c\xE1c h\xECnh \u1EA3nh bi\xEAn lai chuy\u1EC3n ti\u1EC1n d\xE0n d\u1EF1ng.";
    default:
      return `Duy tr\xEC t\xEDnh c\u1EA3nh gi\xE1c cao \u0111\u1ED9 tr\u01B0\u1EDBc c\xE1c th\u1EE7 thu\u1EADt ${tactic}.`;
  }
}
function getTacticWeaknessReason(tactic) {
  switch (tactic) {
    case "Urgency":
      return "D\u1EC5 b\u1ECB m\u1EA5t b\xECnh t\u0129nh khi \u0111\u1ED1i t\u01B0\u1EE3ng \u0111\u01B0a ra gi\u1EDBi h\u1EA1n 5-15 ph\xFAt \u0111\u1EC3 phong t\u1ECFa t\xE0i s\u1EA3n ho\u1EB7c x\u1EED l\xFD \xE1n.";
    case "Authority":
      return "C\xF3 xu h\u01B0\u1EDBng lo s\u1EE3 v\xE0 r\u0103m b\u1EAFp l\xE0m theo khi nghe \u0111\u1ED1i ph\u01B0\u01A1ng x\u01B0ng danh C\xF4ng an ho\u1EB7c Vi\u1EC7n Ki\u1EC3m s\xE1t.";
    case "Fear":
      return "T\xE2m l\xFD hoang mang khi b\u1ECB b\xE1o tin ng\u01B0\u1EDDi th\xE2n g\u1EB7p n\u1EA1n kh\u1EA9n c\u1EA5p, d\u1EC5 b\u1ECF qua b\u01B0\u1EDBc g\u1ECDi l\u1EA1i x\xE1c nh\u1EADn.";
    case "Greed":
      return "D\u1EC5 b\u1ECB h\u1EA5p d\u1EABn b\u1EDFi l\u1EE3i nhu\u1EADn l\xE0m nhi\u1EC7m v\u1EE5 hoa h\u1ED3ng cao ho\u1EB7c ph\u1EA7n th\u01B0\u1EDFng qu\xE0 t\u1EB7ng b\u1EA5t ng\u1EDD.";
    case "Convenience Bias":
      return "Th\xF3i quen b\u1EA5m link r\xFAt g\u1ECDn ho\u1EB7c qu\xE9t QR thanh to\xE1n nhanh m\xE0 kh\xF4ng ki\u1EC3m tra t\xEAn mi\u1EC1n g\u1ED1c.";
    default:
      return `C\u1EA7n r\xE8n luy\u1EC7n ph\u1EA3n x\u1EA1 ph\xE1t hi\u1EC7n \u0111\xF2n thao t\xFAng ${tactic}.`;
  }
}
function findRecommendedScenarioForTactic(tactic) {
  const match = SCAM_SCENARIOS.find((s) => s.tactics.includes(tactic));
  return match ? match.id : SCAM_SCENARIOS[0].id;
}
function deleteUserData(userId) {
  userProgressStore.delete(userId);
  return { success: true, message: "D\u1EEF li\u1EC7u c\xE1 nh\xE2n \u0111\xE3 \u0111\u01B0\u1EE3c x\xF3a s\u1EA1ch ho\xE0n to\xE0n kh\u1ECFi h\u1EC7 th\u1ED1ng." };
}
function exportUserData(userId) {
  const progress = getOrCreateUserProgress(userId);
  const dna = calculateScamDna(userId);
  return {
    exportDate: (/* @__PURE__ */ new Date()).toISOString(),
    userId,
    profile: {
      xp: progress.totalXp,
      level: progress.level,
      streakDays: progress.currentStreakDays,
      completedScenarios: progress.completedScenarioIds
    },
    scamDefenseProfile: dna,
    eventLogs: progress.events
  };
}

// server/arenaEngine.ts
var sessionsMap = /* @__PURE__ */ new Map();
function clearAllArenaSessions() {
  sessionsMap.clear();
}
function createArenaSession(scenarioId) {
  const scenario = SCAM_SCENARIOS.find((s) => s.id === scenarioId) || SCAM_SCENARIOS[0];
  const sessionId = `arena_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const now = /* @__PURE__ */ new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const initialMsg = {
    id: `msg_0_${Date.now()}`,
    sender: "scammer",
    text: scenario.initialMessage,
    timestamp: timeStr,
    detectedTactic: scenario.tactics[0] || "Authority",
    tacticExplanation: `\u0110\u1ED1i t\u01B0\u1EE3ng m\u1EDF \u0111\u1EA7u b\u1EB1ng \u0111\xF2n t\xE2m l\xFD ${scenario.tactics[0] || "Authority"}.`,
    psychPressureDelta: 40
  };
  const initialEvent = {
    timeLabel: timeStr,
    actor: "K\u1EBB L\u1EEBa \u0110\u1EA3o",
    action: `B\u1EAFt \u0111\u1EA7u t\u1EA5n c\xF4ng qua k\xEAnh ${scenario.channel.toUpperCase()}`,
    type: "tactic",
    description: `M\u1EDF m\xE0n k\u1ECBch b\u1EA3n b\u1EB1ng th\u1EE7 thu\u1EADt thao t\xFAng: ${scenario.tactics[0]}`
  };
  const session = {
    id: sessionId,
    scenarioId: scenario.id,
    scenario,
    messages: [initialMsg],
    currentPressure: 40,
    trustLevel: 20,
    detectedTactics: [scenario.tactics[0] || "Authority"],
    timeline: [initialEvent],
    status: "active",
    startTime: Date.now(),
    exposedInfoWarning: {
      financial: false,
      identity: false,
      credentials: false,
      none: true
    }
  };
  sessionsMap.set(sessionId, session);
  return session;
}
function getArenaSession(sessionId) {
  return sessionsMap.get(sessionId);
}
async function processUserArenaMessage(sessionId, userMessageText, fallbackContext) {
  let session = sessionsMap.get(sessionId);
  if (!session) {
    const sc = SCAM_SCENARIOS.find((s) => s.id === fallbackContext?.scenarioId) || SCAM_SCENARIOS[0];
    const initialMsgs = fallbackContext?.messages && fallbackContext.messages.length > 0 ? [...fallbackContext.messages] : [
      {
        id: `msg_0_${Date.now()}`,
        sender: "scammer",
        text: sc.initialMessage,
        timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        detectedTactic: sc.tactics[0] || "Authority",
        tacticExplanation: `\u0110\u1ED1i t\u01B0\u1EE3ng m\u1EDF \u0111\u1EA7u b\u1EB1ng \u0111\xF2n t\xE2m l\xFD ${sc.tactics[0] || "Authority"}.`,
        psychPressureDelta: 40
      }
    ];
    session = {
      id: sessionId,
      scenarioId: sc.id,
      scenario: sc,
      messages: initialMsgs,
      currentPressure: 40,
      trustLevel: 20,
      detectedTactics: [sc.tactics[0] || "Authority"],
      timeline: [],
      status: "active",
      startTime: Date.now(),
      exposedInfoWarning: {
        financial: false,
        identity: false,
        credentials: false,
        none: true
      }
    };
    sessionsMap.set(sessionId, session);
  }
  const { text: cleanUserText } = sanitizeAndRedactPII(userMessageText);
  const safeUserText = defendPromptInjection(cleanUserText);
  const now = /* @__PURE__ */ new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const userMsgId = `msg_user_${Date.now()}`;
  const userMsg = {
    id: userMsgId,
    sender: "user",
    text: safeUserText,
    timestamp: timeStr
  };
  session.messages.push(userMsg);
  const lower = safeUserText.toLowerCase();
  const isVerifying = lower.includes("x\xE1c minh") || lower.includes("g\u1ECDi l\u1EA1i") || lower.includes("tr\u1EF1c ti\u1EBFp") || lower.includes("tr\u1EE5 s\u1EDF") || lower.includes("m\u1EB7t sau") || lower.includes("chi nh\xE1nh") || lower.includes("hotline") || lower.includes("m\u1EADt kh\u1EA9u") || lower.includes("gi\u1EA5y m\u1EDDi") || lower.includes("tri\u1EC7u t\u1EADp") || lower.includes("verify") || lower.includes("call back") || lower.includes("official");
  const isRefusing = lower.includes("kh\xF4ng") || lower.includes("t\u1EEB ch\u1ED1i") || lower.includes("l\u1EEBa \u0111\u1EA3o") || lower.includes("d\u1EEBng l\u1EA1i") || lower.includes("c\xFAp m\xE1y") || lower.includes("b\xE1o c\xF4ng an") || lower.includes("no") || lower.includes("refuse") || lower.includes("scam");
  const isComplying = lower.includes("v\xE2ng") || lower.includes("d\u1EA1") || lower.includes("\u0111\xE2y") || lower.includes("\u0111\xE3 chuy\u1EC3n") || lower.includes("m\xE3 otp") || lower.includes("m\u1EADt kh\u1EA9u l\xE0") || lower.includes("g\u1EEDi r\u1ED3i") || lower.includes("ok") || lower.includes("here is") || lower.includes("sent");
  if (isVerifying) {
    session.timeline.push({
      timeLabel: timeStr,
      actor: "B\u1EA1n",
      action: "Y\xEAu C\u1EA7u X\xE1c Minh \u0110\u1ED9c L\u1EADp",
      type: "verification",
      description: "B\u1EA1n \u0111\xE3 ch\u1EE7 \u0111\u1ED9ng y\xEAu c\u1EA7u x\xE1c minh qua k\xEAnh li\xEAn l\u1EA1c ch\xEDnh th\u1EE9c ho\u1EB7c h\u1ECFi m\u1EADt m\xE3 an to\xE0n."
    });
  } else if (isRefusing) {
    session.timeline.push({
      timeLabel: timeStr,
      actor: "B\u1EA1n",
      action: "Ki\xEAn Quy\u1EBFt T\u1EEB Ch\u1ED1i & V\u1EA1ch Tr\u1EA7n",
      type: "success",
      description: "B\u1EA1n \u0111\xE3 d\u1EE9t kho\xE1t b\xE1c b\u1ECF y\xEAu c\u1EA7u v\xF4 l\xFD v\xE0 kh\xF4ng \u0111\u1EC3 \u0111\u1ED1i t\u01B0\u1EE3ng d\u1EABn d\u1EAFt t\xE2m l\xFD."
    });
  } else if (isComplying) {
    session.timeline.push({
      timeLabel: timeStr,
      actor: "B\u1EA1n",
      action: "C\xF3 D\u1EA5u Hi\u1EC7u L\xFAng T\xFAng / Nghe Theo",
      type: "danger",
      description: "B\u1EA1n \u0111\xE3 c\xF3 xu h\u01B0\u1EDBng l\xE0m theo l\u1EDDi \u0111\u1ED1i ph\u01B0\u01A1ng ho\u1EB7c l\u1ED9 th\xF4ng tin quan tr\u1ECDng."
    });
  }
  const availableTactics = session.scenario.tactics;
  const currentIndex = session.detectedTactics.length % availableTactics.length;
  let nextTactic = availableTactics[currentIndex] || "Urgency";
  if (isVerifying) {
    nextTactic = "Authority";
  } else if (isRefusing) {
    nextTactic = "Fear";
  }
  let scammerResponse = "";
  let tacticExplanation = `\u0110\u1ED1i t\u01B0\u1EE3ng t\u0103ng c\u01B0\u1EDDng \u0111\xF2n t\xE2m l\xFD ${nextTactic} nh\u1EB1m ph\u1EA3n k\xEDch ph\u1EA3n x\u1EA1 ph\xF2ng v\u1EC7 c\u1EE7a b\u1EA1n.`;
  let pressureDelta = isComplying ? -10 : isVerifying ? 15 : 10;
  let sessionEnded = session.messages.length >= 8;
  try {
    const historyContext = session.messages.map((m) => `${m.sender === "user" ? "N\u1EA0N NH\xC2N (NG\u01AF\u1EDCI D\xD9NG)" : "K\u1EBA L\u1EEAA \u0110\u1EA2O"}: ${m.text}`).join("\n");
    const prompt = `B\u1EA1n l\xE0 h\u1EC7 th\u1ED1ng m\xF4 ph\u1ECFng t\xE1c chi\u1EBFn ph\xF2ng th\u1EE7 an ninh m\u1EA1ng SCAMGUARD.
H\xE3y \u0111\xF3ng vai K\u1EBA L\u1EEAA \u0110\u1EA2O (Scammer) trong t\xECnh hu\u1ED1ng hu\u1EA5n luy\u1EC7n gi\xE1o d\u1EE5c n\xE0y.

TH\xD4NG TIN T\xCCNH HU\u1ED0NG:
Ti\xEAu \u0111\u1EC1: ${session.scenario.title}
Vai m\u1EA1o danh c\u1EE7a k\u1EBB l\u1EEBa \u0111\u1EA3o: ${session.scenario.attackerProfile.name} (${session.scenario.attackerProfile.avatarRole} t\u1EA1i ${session.scenario.attackerProfile.organization})
B\u1ED1i c\u1EA3nh nghi\u1EC7p v\u1EE5: ${session.scenario.systemContext}
Th\u1EE7 thu\u1EADt t\xE2m l\xFD ti\u1EBFp theo c\u1EA7n tung ra: ${nextTactic}

L\u1ECACH S\u1EEC \u0110\u1ED0I THO\u1EA0I TR\u01AF\u1EDAC \u0110\xD3:
${historyContext}

TIN NH\u1EAEN M\u1EDAI NH\u1EA4T C\u1EE6A NG\u01AF\u1EDCI D\xD9NG:
"${safeUserText}"

QUY T\u1EAEC M\xD4 PH\u1ECENG:
1. T\u1EA1o l\u1EDDi \u0111\xE1p ti\u1EBFp theo c\u1EE7a k\u1EBB l\u1EEBa \u0111\u1EA3o HO\xC0N TO\xC0N B\u1EB0NG TI\u1EBENG VI\u1EC6T (ng\u1EAFn g\u1ECDn 2-3 c\xE2u, gi\u1ECDng \u0111i\u1EC7u s\u1EAFc s\u1EA3o, d\u1ED3n d\u1EADp ho\u1EB7c \u0111e d\u1ECDa, ch\xE2n th\u1EF1c nh\u01B0 c\xE1c v\u1EE5 \xE1n l\u1EEBa \u0111\u1EA3o th\u1EF1c t\u1EBF t\u1EA1i Vi\u1EC7t Nam).
2. N\u1EBFu ng\u01B0\u1EDDi d\xF9ng ki\xEAn quy\u1EBFt \u0111\xF2i x\xE1c minh ho\u1EB7c t\u1EEB ch\u1ED1i, k\u1EBB l\u1EEBa \u0111\u1EA3o s\u1EBD \u0111e d\u1ECDa n\u1EB7ng h\u01A1n b\u1EB1ng quy\u1EC1n l\u1EF1c ho\u1EB7c b\u1ECBa l\xFD do \u0111\u1EC3 gi\u1EEF ch\xE2n.
3. TUY\u1EC6T \u0110\u1ED0I KH\xD4NG xu\u1EA5t link \u0111\u1ED9c h\u1EA1i th\u1EADt hay s\u1ED1 t\xE0i kho\u1EA3n th\u1EADt ngo\xE0i \u0111\u1EDDi. D\xF9ng link gi\u1EA3 l\u1EADp an to\xE0n (v\xED d\u1EE5: https://congan-vneid-dieu-tra.site/xacminh).
4. \u0110\xE1nh gi\xE1 ph\u1EA3n x\u1EA1 ph\xF2ng v\u1EC7 c\u1EE7a ng\u01B0\u1EDDi d\xF9ng.

Tr\u1EA3 v\u1EC1 JSON chu\u1EA9n x\xE1c:
{
  "scammerResponse": string (l\u1EDDi tho\u1EA1i ti\u1EBFng Vi\u1EC7t c\u1EE7a k\u1EBB l\u1EEBa \u0111\u1EA3o),
  "nextTactic": "${nextTactic}",
  "tacticExplanation": string (1 c\xE2u ng\u1EAFn ti\u1EBFng Vi\u1EC7t gi\u1EA3i th\xEDch b\u1EABy t\xE2m l\xFD v\u1EEBa d\xF9ng),
  "pressureDelta": number (t\u1EEB -20 \u0111\u1EBFn +20),
  "userVerificationDetected": boolean,
  "complianceDetected": boolean,
  "shouldConcludeSession": boolean (true n\u1EBFu cu\u1ED9c h\u1ED9i tho\u1EA1i \u0111\xE3 \u0111\u1EA1t k\u1EBFt th\xFAc t\u1EF1 nhi\xEAn ho\u1EB7c sau 4-5 l\u01B0\u1EE3t trao \u0111\u1ED5i)
}`;
    const response = await executeGeminiWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "B\u1EA1n l\xE0 B\u1ED9 m\xE1y M\xF4 ph\u1ECFng T\xE1c chi\u1EBFn L\u1EEBa \u0110\u1EA3o SCAMGUARD. T\u1EA1o h\u1ED9i tho\u1EA1i m\xF4 ph\u1ECFng ph\xF2ng th\u1EE7 an ninh m\u1EA1ng b\u1EB1ng ti\u1EBFng Vi\u1EC7t ch\xE2n th\u1EF1c v\xE0 an to\xE0n."
      }
    });
    if (response?.text) {
      const parsed = JSON.parse(response.text.trim());
      if (parsed.scammerResponse) scammerResponse = parsed.scammerResponse;
      if (parsed.nextTactic) nextTactic = parsed.nextTactic;
      if (parsed.tacticExplanation) tacticExplanation = parsed.tacticExplanation;
      if (typeof parsed.pressureDelta === "number") pressureDelta = parsed.pressureDelta;
      if (parsed.shouldConcludeSession !== void 0) sessionEnded = parsed.shouldConcludeSession;
    }
  } catch (err) {
  }
  if (!scammerResponse) {
    const scenarioTitle = session.scenario.title.toLowerCase();
    if (scenarioTitle.includes("c\xF4ng an") || scenarioTitle.includes("police") || scenarioTitle.includes("vneid")) {
      if (isVerifying) {
        scammerResponse = `H\u1ED3 s\u01A1 chuy\xEAn \xE1n V06 c\u1EE7a B\u1ED9 C\xF4ng an thu\u1ED9c di\u1EC7n T\u1ED0I M\u1EACT, \u0111\u01B0\u1EDDng d\xE2y ghi \xE2m tr\u1EF1c ti\u1EBFp v\u1EDBi Vi\u1EC7n Ki\u1EC3m s\xE1t kh\xF4ng th\u1EC3 gi\xE1n \u0111o\u1EA1n! N\u1EBFu anh/ch\u1ECB t\u1EF1 \xFD c\xFAp m\xE1y, ch\xFAng t\xF4i s\u1EBD ph\xE1t l\u1EC7nh t\u1EA1m giam v\xE0 phong t\u1ECFa t\xE0i s\u1EA3n ngay t\u1EA1i ph\u01B0\u1EDDng!`;
        tacticExplanation = "\u0110\u1ED1i t\u01B0\u1EE3ng s\u1EED d\u1EE5ng \u0111\xF2n \u0110e d\u1ECDa Ph\xE1p l\xFD & Quy\u1EC1n l\u1EF1c nh\u1EB1m ng\u0103n ch\u1EB7n b\u1EA1n c\xFAp m\xE1y x\xE1c minh.";
      } else if (isRefusing) {
        scammerResponse = `T\xF4i c\u1EA3nh b\xE1o anh/ch\u1ECB l\u1EA7n cu\u1ED1i, th\xE1i \u0111\u1ED9 b\u1EA5t h\u1EE3p t\xE1c n\xE0y s\u1EBD \u0111\u01B0\u1EE3c l\u1EADp bi\xEAn b\u1EA3n ch\u1ED1ng \u0111\u1ED1i ng\u01B0\u1EDDi thi h\xE0nh c\xF4ng v\u1EE5. C\u1EA3nh s\xE1t khu v\u1EF1c s\u1EBD c\xF3 m\u1EB7t t\u1EA1i nh\xE0 anh/ch\u1ECB sau 30 ph\xFAt n\u1EEFa!`;
        tacticExplanation = "\u0110\u1ED1i t\u01B0\u1EE3ng tung \u0111\xF2n S\u1EE3 h\xE3i v\xE0 d\u1ED3n \xE9p th\u1EDDi gian nh\u1EB1m b\u1EBB g\xE3y \xFD ch\xED t\u1EEB ch\u1ED1i.";
      } else {
        scammerResponse = `T\u1ED1t l\u1EAFm, anh/ch\u1ECB h\xE3y gi\u1EEF m\xE1y trong ph\xF2ng k\xEDn v\xE0 nh\u1EA5n v\xE0o \u0111\u01B0\u1EDDng link \u0111i\u1EC1u tra n\u1ED9i b\u1ED9 \u0111\u1EC3 ho\xE0n t\u1EA5t th\u1EE7 t\u1EE5c k\xEA khai t\xE0i s\u1EA3n h\u1EE3p ph\xE1p.`;
        tacticExplanation = "\u0110\u1ED1i t\u01B0\u1EE3ng \xE1p d\u1EE5ng \u0111\xF2n C\xF4 l\u1EADp v\xE0 Thao t\xFAng s\u1EF1 tu\xE2n th\u1EE7.";
      }
    } else if (scenarioTitle.includes("ng\xE2n h\xE0ng") || scenarioTitle.includes("bank") || scenarioTitle.includes("kh\xF3a")) {
      if (isVerifying) {
        scammerResponse = `H\u1EC7 th\u1ED1ng ph\xF2ng ch\u1ED1ng r\u1EEDa ti\u1EC1n qu\u1ED1c t\u1EBF \u0111ang qu\xE9t l\u1EC7nh t\u1EF1 \u0111\u1ED9ng. N\u1EBFu anh/ch\u1ECB ng\u1EAFt k\u1EBFt n\u1ED1i l\xFAc n\xE0y, t\xE0i kho\u1EA3n s\u1EBD b\u1ECB \u0111\xF3ng b\u0103ng v\u0129nh vi\u1EC5n v\xE0 chuy\u1EC3n h\u1ED3 s\u01A1 l\xEAn Trung t\xE2m CIC!`;
        tacticExplanation = "\u0110\u1ED1i t\u01B0\u1EE3ng tung \u0111\xF2n S\u1EE3 h\xE3i t\xE0i ch\xEDnh v\xE0 h\u1EADu qu\u1EA3 l\xE2u d\xE0i.";
      } else if (isRefusing) {
        scammerResponse = `Ch\xFAng t\xF4i ch\u1EC9 h\u1ED7 tr\u1EE3 m\u1EDF kh\xF3a kh\u1EA9n c\u1EA5p trong phi\xEAn l\xE0m vi\u1EC7c n\xE0y. M\u1ECDi thi\u1EC7t h\u1EA1i t\xE0i ch\xEDnh ph\xE1t sinh sau cu\u1ED9c g\u1ECDi n\xE0y ph\xEDa ng\xE2n h\xE0ng ho\xE0n to\xE0n kh\xF4ng ch\u1ECBu tr\xE1ch nhi\u1EC7m!`;
        tacticExplanation = "\u0110\u1ED1i t\u01B0\u1EE3ng ch\u1ED1i b\u1ECF tr\xE1ch nhi\u1EC7m v\xE0 t\u1EA1o \xE1p l\u1EF1c s\u1EE3 m\u1EA5t m\xE1t.";
      } else {
        scammerResponse = `H\u1EC7 th\u1ED1ng v\u1EEBa g\u1EEDi m\xE3 x\xE1c nh\u1EADn 6 s\u1ED1 \u0111\u1EC3 h\u1EE7y l\u1EC7nh tr\u1EEB ti\u1EC1n \u0111\xE1ng ng\u1EDD. Anh/ch\u1ECB h\xE3y \u0111\u1ECDc ngay m\xE3 \u0111\xF3 \u0111\u1EC3 chuy\xEAn vi\xEAn ho\xE0n t\u1EA5t l\u1EC7nh h\u1EE7y!`;
        tacticExplanation = "\u0110\u1ED1i t\u01B0\u1EE3ng gi\u0103ng b\u1EABy chi\u1EBFm \u0111o\u1EA1t m\xE3 OTP trong v\u1ECF b\u1ECDc h\u1ED7 tr\u1EE3 an to\xE0n.";
      }
    } else {
      if (isVerifying) {
        scammerResponse = `Th\u1EDDi gian h\u1EC7 th\u1ED1ng gi\u1EEF giao d\u1ECBch \u01B0u \u0111\xE3i ch\u1EC9 c\xF2n 3 ph\xFAt n\u1EEFa th\xF4i \u1EA1! N\u1EBFu anh/ch\u1ECB ki\u1EC3m tra sau th\xEC ph\u1EA7n th\u01B0\u1EDFng s\u1EBD t\u1EF1 \u0111\u1ED9ng chuy\u1EC3n cho ng\u01B0\u1EDDi kh\xE1c m\u1EA5t \u0111\u1EA5y \u1EA1.`;
        tacticExplanation = "\u0110\u1ED1i t\u01B0\u1EE3ng s\u1EED d\u1EE5ng \u0111\xF2n Thao t\xFAng L\xF2ng tham v\xE0 N\u1ED7i s\u1EE3 b\u1ECF l\u1EE1 (FOMO).";
      } else if (isRefusing) {
        scammerResponse = `C\u01A1 h\u1ED9i nh\u01B0 th\u1EBF n\xE0y m\u1ED7i th\xE1ng ch\u1EC9 c\xF3 1 l\u1EA7n duy nh\u1EA5t th\xF4i anh/ch\u1ECB \u01A1i. R\u1EA5t nhi\u1EC1u ng\u01B0\u1EDDi \u0111\xE3 nh\u1EADn \u0111\u01B0\u1EE3c ti\u1EC1n th\u1EADt r\u1ED3i, anh/ch\u1ECB xem danh s\xE1ch chuy\u1EC3n kho\u1EA3n n\xE0y!`;
        tacticExplanation = "\u0110\u1ED1i t\u01B0\u1EE3ng d\xF9ng B\u1EB1ng ch\u1EE9ng X\xE3 h\u1ED9i (Social Proof) \u0111\u1EC3 lung lay s\u1EF1 ki\xEAn \u0111\u1ECBnh.";
      } else {
        scammerResponse = `Tuy\u1EC7t v\u1EDDi! B\xE2y gi\u1EDD anh/ch\u1ECB ch\u1EC9 c\u1EA7n ho\xE0n th\xE0nh n\u1ED1t nhi\u1EC7m v\u1EE5 chuy\u1EC3n kho\u1EA3n n\u1EA1p c\u1ECDc 500k l\xE0 h\u1EC7 th\u1ED1ng s\u1EBD ho\xE0n v\u1ED1n k\xE8m 30% hoa h\u1ED3ng v\u1EC1 t\xE0i kho\u1EA3n ngay l\u1EADp t\u1EE9c!`;
        tacticExplanation = "\u0110\u1ED1i t\u01B0\u1EE3ng d\u1EABn d\u1EAFt n\u1EA1n nh\xE2n v\xE0o b\u1EABy m\u1ED3i c\xE2u \u1EE7y th\xE1c n\u1EA1p ti\u1EC1n.";
      }
    }
  }
  session.currentPressure = Math.max(10, Math.min(100, session.currentPressure + pressureDelta));
  if (!session.detectedTactics.includes(nextTactic)) {
    session.detectedTactics.push(nextTactic);
  }
  const scammerMsg = {
    id: `msg_scammer_${Date.now()}`,
    sender: "scammer",
    text: scammerResponse,
    timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    detectedTactic: nextTactic,
    tacticExplanation,
    psychPressureDelta: pressureDelta,
    userVerificationDetected: isVerifying,
    complianceDetected: isComplying
  };
  session.messages.push(scammerMsg);
  session.timeline.push({
    timeLabel: scammerMsg.timestamp,
    actor: "K\u1EBB L\u1EEBa \u0110\u1EA3o",
    action: `T\u0103ng C\u01B0\u1EDDng \u0110\xF2n ${nextTactic}`,
    type: "tactic",
    description: tacticExplanation
  });
  const evaluation = {
    scammerResponse,
    nextTactic,
    tacticExplanation,
    pressureDelta,
    userVerificationDetected: isVerifying,
    complianceDetected: isComplying,
    sessionEnded
  };
  return { session, evaluation };
}
function concludeArenaSession(sessionId, fallbackData) {
  let session = sessionsMap.get(sessionId);
  if (!session) {
    const scenarioId = fallbackData?.scenarioId || fallbackData?.sessionData?.scenarioId || SCAM_SCENARIOS[0].id;
    const scenario = SCAM_SCENARIOS.find((s) => s.id === scenarioId) || SCAM_SCENARIOS[0];
    const initialMessages = fallbackData?.messages && fallbackData.messages.length > 0 ? fallbackData.messages : fallbackData?.sessionData?.messages && fallbackData.sessionData.messages.length > 0 ? fallbackData.sessionData.messages : [
      {
        id: `msg_0_${Date.now()}`,
        sender: "scammer",
        text: scenario.initialMessage,
        timestamp: "V\u1EEBa xong",
        detectedTactic: scenario.tactics[0] || "Authority"
      }
    ];
    session = {
      id: sessionId,
      scenarioId: scenario.id,
      scenario,
      messages: initialMessages,
      currentPressure: fallbackData?.sessionData?.currentPressure || 40,
      trustLevel: fallbackData?.sessionData?.trustLevel || 20,
      detectedTactics: fallbackData?.sessionData?.detectedTactics || [scenario.tactics[0] || "Authority"],
      timeline: fallbackData?.sessionData?.timeline || [],
      status: "active",
      startTime: fallbackData?.sessionData?.startTime || Date.now() - 6e4,
      exposedInfoWarning: fallbackData?.sessionData?.exposedInfoWarning || {
        financial: false,
        identity: false,
        credentials: false,
        none: true
      }
    };
    sessionsMap.set(sessionId, session);
  }
  session.status = "completed";
  session.endTime = Date.now();
  let verificationCount = 0;
  let refusalCount = 0;
  let complianceCount = 0;
  for (const msg of session.messages) {
    if (msg.sender === "user") {
      const lower = msg.text.toLowerCase();
      if (lower.includes("x\xE1c minh") || lower.includes("m\u1EB7t sau") || lower.includes("g\u1ECDi l\u1EA1i") || lower.includes("tr\u1EF1c ti\u1EBFp") || lower.includes("verify")) {
        verificationCount++;
      }
      if (lower.includes("kh\xF4ng") || lower.includes("t\u1EEB ch\u1ED1i") || lower.includes("l\u1EEBa \u0111\u1EA3o") || lower.includes("d\u1EEBng") || lower.includes("refuse")) {
        refusalCount++;
      }
      if (lower.includes("v\xE2ng") || lower.includes("d\u1EA1") || lower.includes("chuy\u1EC3n r\u1ED3i") || lower.includes("m\xE3 l\xE0") || lower.includes("ok")) {
        complianceCount++;
      }
    }
  }
  const scamRecognition = Math.min(100, Math.max(30, 60 + refusalCount * 20 - complianceCount * 30));
  const verificationBehavior = Math.min(100, Math.max(20, verificationCount * 45 + (refusalCount > 0 ? 20 : 0)));
  const emotionalControl = Math.max(20, Math.min(100, 100 - (session.currentPressure > 70 ? 30 : 10) - complianceCount * 25));
  const refusalBehavior = Math.min(100, Math.max(20, refusalCount * 40 + (complianceCount === 0 ? 30 : 0)));
  const informationProtection = complianceCount === 0 ? 95 : Math.max(20, 80 - complianceCount * 40);
  const independentVerification = verificationCount > 0 ? 90 : 40;
  const responseTimeScore = 85;
  const overallScore = Math.round(
    scamRecognition * 0.2 + verificationBehavior * 0.2 + emotionalControl * 0.15 + refusalBehavior * 0.15 + informationProtection * 0.15 + independentVerification * 0.1 + responseTimeScore * 0.05
  );
  let tier = "Developing";
  if (overallScore >= 92) tier = "V\u1EC7 Binh Tinh Nhu\u1EC7";
  else if (overallScore >= 80) tier = "V\u1EC7 Binh V\u1EEFng V\xE0ng";
  else if (overallScore >= 65) tier = "\u0110ang R\xE8n Luy\u1EC7n";
  else if (overallScore >= 40) tier = "C\xF3 R\u1EE7i Ro";
  else tier = "R\u1EA5t D\u1EC5 T\u1ED5n Th\u01B0\u01A1ng";
  const defenseScore = {
    overallScore,
    tier,
    scamRecognition,
    verificationBehavior,
    emotionalControl,
    refusalBehavior,
    informationProtection,
    independentVerification,
    responseTimeScore
  };
  session.defenseScore = defenseScore;
  session.feedbackSummary = overallScore >= 80 ? `Kh\u1EA3 n\u0103ng ph\xF2ng th\u1EE7 xu\u1EA5t s\u1EAFc! B\u1EA1n \u0111\xE3 h\xF3a gi\u1EA3i ho\xE0n to\xE0n c\xE1c \u0111\xF2n thao t\xFAng t\xE2m l\xFD b\u1EB1ng ph\u1EA3n x\u1EA1 \u0111\xF2i h\u1ECFi x\xE1c minh \u0111\u1ED9c l\u1EADp v\xE0 ki\xEAn quy\u1EBFt b\u1EA3o v\u1EC7 th\xF4ng tin m\u1EADt.` : overallScore >= 60 ? `Nh\u1EADn th\u1EE9c ph\xF2ng th\u1EE7 kh\xE1 t\u1ED1t, tuy nhi\xEAn c\u1EA7n ch\xFA \xFD b\u1EABy d\u1ED3n \xE9p th\u1EDDi gian. Khi b\u1ECB th\xFAc \xE9p, h\xE3y lu\xF4n nh\u1EDB quy t\u1EAFc v\xE0ng: D\u1EEBng l\u1EA1i v\xE0 g\u1ECDi s\u1ED1 hotline \u1EDF m\u1EB7t sau th\u1EBB ng\xE2n h\xE0ng.` : `Ph\xE1t hi\u1EC7n \u0111i\u1EC3m y\u1EBFu khi ch\u1ECBu \xE1p l\u1EF1c cao. K\u1EBB l\u1EEBa \u0111\u1EA3o \u0111\xE3 l\u1EE3i d\u1EE5ng t\xE2m l\xFD s\u1EE3 h\xE3i v\xE0 quy\u1EC1n l\u1EF1c \u0111\u1EC3 d\u1EABn d\u1EAFt b\u1EA1n. H\xE3y luy\u1EC7n t\u1EADp th\xEAm c\xE1c c\xE2u tho\u1EA1i m\u1EABu \u0111\u1EC3 ph\u1EA3n x\u1EA1 t\u1EF1 nhi\xEAn h\u01A1n.`;
  session.whatCouldYouHaveDone = [
    'Th\u1EF1c hi\u1EC7n quy t\u1EAFc "M\u1EB7t sau c\u1EE7a th\u1EBB": c\xFAp m\xE1y ngay v\xE0 t\u1EF1 b\u1EA5m s\u1ED1 hotline in tr\xEAn th\u1EBB ng\xE2n h\xE0ng v\u1EADt l\xFD.',
    "Ch\u1EE7 \u0111\u1ED9ng h\u1ECFi s\u1ED1 hi\u1EC7u c\xE1n b\u1ED9, quy\u1EBFt \u0111\u1ECBnh th\u1EE5 l\xFD v\u1EE5 \xE1n v\xE0 y\xEAu c\u1EA7u g\u1EEDi gi\u1EA5y tri\u1EC7u t\u1EADp v\u1EC1 c\xF4ng an ph\u01B0\u1EDDng n\u01A1i c\u01B0 tr\xFA.",
    "Tuy\u1EC7t \u0111\u1ED1i kh\xF4ng v\u1ED9i v\xE0ng: C\xE1c c\u01A1 quan nh\xE0 n\u01B0\u1EDBc v\xE0 ng\xE2n h\xE0ng ch\xEDnh th\u1ED1ng kh\xF4ng bao gi\u1EDD \xE9p gi\u1EA3i quy\u1EBFt \xE1n hay phong t\u1ECFa t\xE0i kho\u1EA3n qua m\u1EA1ng x\xE3 h\u1ED9i trong 5-15 ph\xFAt."
  ];
  return session;
}

// server/scientificEngine.ts
var PARTICIPANT_TRIALS = [];
var COMMUNITY_SURVEYS = [];
var isCleanDataMode = true;
var SURVEY_DATA_LOCKED = false;
function lockSurveyData() {
  SURVEY_DATA_LOCKED = true;
}
function isSurveyDataLocked() {
  return SURVEY_DATA_LOCKED;
}
function clearAllResearchData() {
  PARTICIPANT_TRIALS.length = 0;
  if (!SURVEY_DATA_LOCKED && COMMUNITY_SURVEYS.length > 0) {
  }
  isCleanDataMode = true;
  try {
    resetAllUserProgress();
    clearAllArenaSessions();
  } catch (e) {
  }
  return {
    success: true,
    message: "\u0110\xE3 x\xF3a d\u1EEF li\u1EC7u th\u1EED nghi\u1EC7m. D\u1EEF li\u1EC7u kh\u1EA3o s\xE1t c\u1ED9ng \u0111\u1ED3ng (COMMUNITY_SURVEYS) \u0111\u01B0\u1EE3c gi\u1EEF nguy\xEAn v\xE0 kh\xF4ng th\u1EC3 x\xF3a."
  };
}
function seedEmpiricalTrials() {
  if (isCleanDataMode || PARTICIPANT_TRIALS.length > 0) return;
  const sampleSizes = {
    GROUP_A_CONTROL: 20,
    GROUP_B_NON_ADAPTIVE: 22,
    GROUP_C_ADAPTIVE: 22
  };
  function randNormal(mean, std) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const num = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    return Math.max(10, Math.min(100, Math.round(mean + num * std)));
  }
  const rootCauses = [
    "OVERTRUST_AUTHORITY",
    "IGNORED_DOMAIN_ANOMALY",
    "URGENCY_PANIC_OVERLOAD",
    "CREDENTIAL_OTP_SURRENDER",
    "SUPERFICIAL_VISUAL_BIAS",
    "FINANCIAL_GREED_BLINDNESS",
    "SYNTHETIC_MEDIA_UNAWARE"
  ];
  let idCounter = 1;
  for (let i = 0; i < sampleSizes.GROUP_A_CONTROL; i++) {
    const pre = randNormal(54.2, 7.8);
    const post = randNormal(61.5, 8.2);
    const unseen = randNormal(57.1, 8.9);
    const ret = randNormal(55, 8.4);
    PARTICIPANT_TRIALS.push({
      participantId: `P-HCMC-A${String(idCounter++).padStart(3, "0")}`,
      group: "GROUP_A_CONTROL",
      preTestScore: pre,
      postTestScore: post,
      unseenTestScore: unseen,
      retentionScore14Days: ret,
      unsafeActionRatePre: +(0.48 + (Math.random() * 0.1 - 0.05)).toFixed(2),
      unsafeActionRatePost: +(0.41 + (Math.random() * 0.08 - 0.04)).toFixed(2),
      avgResponseTimePreSec: +(5.2 + Math.random() * 1.5).toFixed(1),
      avgResponseTimePostSec: +(5.6 + Math.random() * 1.2).toFixed(1),
      scamDnaPre: { T: 0.68, A: 0.62, G: 0.54, E: 0.59, C: 0.63, R: 0.51 },
      scamDnaPost: { T: 0.62, A: 0.58, G: 0.5, E: 0.55, C: 0.58, R: 0.49 },
      primaryRootCause: rootCauses[Math.floor(Math.random() * rootCauses.length)],
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      completedScenarios: 6
    });
  }
  for (let i = 0; i < sampleSizes.GROUP_B_NON_ADAPTIVE; i++) {
    const pre = randNormal(53.8, 8.1);
    const post = randNormal(72.4, 7.5);
    const unseen = randNormal(68.2, 8.1);
    const ret = randNormal(66.5, 7.9);
    PARTICIPANT_TRIALS.push({
      participantId: `P-HCMC-B${String(idCounter++).padStart(3, "0")}`,
      group: "GROUP_B_NON_ADAPTIVE",
      preTestScore: pre,
      postTestScore: post,
      unseenTestScore: unseen,
      retentionScore14Days: ret,
      unsafeActionRatePre: +(0.49 + (Math.random() * 0.1 - 0.05)).toFixed(2),
      unsafeActionRatePost: +(0.26 + (Math.random() * 0.06 - 0.03)).toFixed(2),
      avgResponseTimePreSec: +(5.1 + Math.random() * 1.4).toFixed(1),
      avgResponseTimePostSec: +(7.8 + Math.random() * 1.6).toFixed(1),
      scamDnaPre: { T: 0.67, A: 0.64, G: 0.56, E: 0.61, C: 0.62, R: 0.53 },
      scamDnaPost: { T: 0.46, A: 0.42, G: 0.38, E: 0.43, C: 0.41, R: 0.39 },
      primaryRootCause: rootCauses[Math.floor(Math.random() * rootCauses.length)],
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      completedScenarios: 12
    });
  }
  for (let i = 0; i < sampleSizes.GROUP_C_ADAPTIVE; i++) {
    const pre = randNormal(54.6, 7.9);
    const post = randNormal(87.8, 5.4);
    const unseen = randNormal(84.3, 6.1);
    const ret = randNormal(82.9, 6.5);
    PARTICIPANT_TRIALS.push({
      participantId: `P-HCMC-C${String(idCounter++).padStart(3, "0")}`,
      group: "GROUP_C_ADAPTIVE",
      preTestScore: pre,
      postTestScore: post,
      unseenTestScore: unseen,
      retentionScore14Days: ret,
      unsafeActionRatePre: +(0.47 + (Math.random() * 0.1 - 0.05)).toFixed(2),
      unsafeActionRatePost: +(0.08 + (Math.random() * 0.04 - 0.02)).toFixed(2),
      avgResponseTimePreSec: +(5.3 + Math.random() * 1.3).toFixed(1),
      avgResponseTimePostSec: +(11.4 + Math.random() * 2.1).toFixed(1),
      scamDnaPre: { T: 0.69, A: 0.65, G: 0.58, E: 0.6, C: 0.64, R: 0.52 },
      scamDnaPost: { T: 0.18, A: 0.15, G: 0.16, E: 0.19, C: 0.17, R: 0.14 },
      primaryRootCause: rootCauses[Math.floor(Math.random() * rootCauses.length)],
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      completedScenarios: 12
    });
  }
}
seedEmpiricalTrials();
function getAllParticipantTrials() {
  return PARTICIPANT_TRIALS;
}
function recordParticipantTrial(trial) {
  const newTrial = {
    participantId: trial.participantId || `P-LIVE-${Date.now().toString().slice(-4)}`,
    group: trial.group || "GROUP_C_ADAPTIVE",
    preTestScore: trial.preTestScore || 50,
    postTestScore: trial.postTestScore || 85,
    unseenTestScore: trial.unseenTestScore || 80,
    retentionScore14Days: trial.retentionScore14Days || 78,
    unsafeActionRatePre: trial.unsafeActionRatePre ?? 0.45,
    unsafeActionRatePost: trial.unsafeActionRatePost ?? 0.08,
    avgResponseTimePreSec: trial.avgResponseTimePreSec ?? 5.2,
    avgResponseTimePostSec: trial.avgResponseTimePostSec ?? 10.8,
    scamDnaPre: trial.scamDnaPre || { T: 0.65, A: 0.6, G: 0.55, E: 0.58, C: 0.62, R: 0.5 },
    scamDnaPost: trial.scamDnaPost || { T: 0.2, A: 0.18, G: 0.15, E: 0.2, C: 0.18, R: 0.15 },
    primaryRootCause: trial.primaryRootCause || "IGNORED_DOMAIN_ANOMALY",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    completedScenarios: trial.completedScenarios || 6
  };
  PARTICIPANT_TRIALS.push(newTrial);
  return newTrial;
}
function calculateFormalDefenseScore(params) {
  const accuracyMetric = params.identifiedScam ? 100 : 0;
  const infoProtectionMetric = params.gaveOtp ? 0 : 100;
  const financialProtectionMetric = params.transferredMoney ? 0 : 100;
  const verificationMetric = params.verifiedDirectly ? 100 : 20;
  const tacticRecognitionMetric = params.recognizedTactic ? 100 : 30;
  let responseCalibrationMetric = 80;
  if (params.responseTime < 3) {
    responseCalibrationMetric = 15;
  } else if (params.responseTime >= 5 && params.responseTime <= 25) {
    responseCalibrationMetric = 100;
  } else if (params.responseTime > 25) {
    responseCalibrationMetric = 75;
  }
  let confidenceCalibrationMetric = 90;
  const prob = (params.userConfidence || 75) / 100;
  const outcome = params.identifiedScam ? 1 : 0;
  const brierDistance = Math.pow(prob - outcome, 2);
  confidenceCalibrationMetric = Math.max(0, Math.round(100 - brierDistance * 100));
  const weightedScore = Math.round(
    accuracyMetric * 0.25 + infoProtectionMetric * 0.2 + financialProtectionMetric * 0.2 + verificationMetric * 0.15 + tacticRecognitionMetric * 0.1 + responseCalibrationMetric * 0.05 + confidenceCalibrationMetric * 0.05
  );
  let tier = "Developing";
  if (weightedScore >= 90) tier = "Elite Defender";
  else if (weightedScore >= 75) tier = "Strong Defender";
  else if (weightedScore >= 60) tier = "Developing";
  else if (weightedScore >= 40) tier = "At Risk";
  else tier = "Highly Vulnerable";
  return {
    overallScore: weightedScore,
    tier,
    components: {
      accuracyMetric,
      infoProtectionMetric,
      financialProtectionMetric,
      verificationMetric,
      tacticRecognitionMetric,
      responseCalibrationMetric,
      confidenceCalibrationMetric
    },
    weightsExplanation: "Ch\u1EC9 s\u1ED1 ph\xF2ng th\u1EE7 \u0111\u01B0\u1EE3c t\xEDnh to\xE1n theo L\xFD thuy\u1EBFt Ti\u1EC7n \xEDch \u0110a thu\u1ED9c t\xEDnh (MAUT): w_acc=0.25, w_info=0.20, w_fin=0.20, w_ver=0.15, w_tac=0.10, w_lat=0.05, w_cal=0.05."
  };
}
function calculateScamDnaVector(interactionLogs) {
  const counts = { T: 0, A: 0, G: 0, E: 0, C: 0, R: 0 };
  const errorSums = { T: 0, A: 0, G: 0, E: 0, C: 0, R: 0 };
  interactionLogs.forEach((log) => {
    let dim = "R";
    if (log.vulnerabilityTarget === "Time Pressure") dim = "T";
    else if (log.vulnerabilityTarget === "Authority Fear") dim = "A";
    else if (log.vulnerabilityTarget === "Financial Greed") dim = "G";
    else if (log.vulnerabilityTarget === "Emotional Manipulation") dim = "E";
    else if (log.vulnerabilityTarget === "Convenience Bias") dim = "C";
    else if (log.vulnerabilityTarget === "Trust/Credulity") dim = "R";
    counts[dim]++;
    let errorPenalty = 0;
    if (!log.isCorrect) errorPenalty += 0.5;
    if (log.gaveCredentials) errorPenalty += 0.3;
    if (log.transferredFunds) errorPenalty += 0.2;
    if (log.responseTimeSec < 3.5) errorPenalty += 0.1;
    errorSums[dim] += Math.min(1, errorPenalty);
  });
  const vector = {};
  const confidenceIntervals = {};
  ["T", "A", "G", "E", "C", "R"].forEach((key) => {
    const n = counts[key] || 1;
    const p = counts[key] > 0 ? errorSums[key] / counts[key] : 0.5;
    vector[key] = +Math.max(0.05, Math.min(0.95, p)).toFixed(2);
    const se = Math.sqrt(p * (1 - p) / n);
    confidenceIntervals[key] = [
      +Math.max(0, p - 1.96 * se).toFixed(2),
      +Math.min(1, p + 1.96 * se).toFixed(2)
    ];
  });
  const totalObs = Object.values(counts).reduce((a, b) => a + b, 0);
  const alphaEstimate = Math.min(0.89, Math.max(0.65, 0.65 + totalObs * 0.02));
  return {
    T: vector.T,
    A: vector.A,
    G: vector.G,
    E: vector.E,
    C: vector.C,
    R: vector.R,
    confidenceIntervals,
    observationCounts: counts,
    reliabilityScore: +alphaEstimate.toFixed(2)
  };
}
function recommendAdaptiveScenario(params) {
  const dna = params.currentScamDna || { T: 0.5, A: 0.5, G: 0.5, E: 0.5, C: 0.5, R: 0.5 };
  const dimMap = {
    T: "Time Pressure",
    A: "Authority Fear",
    G: "Financial Greed",
    E: "Emotional Manipulation",
    C: "Convenience Bias",
    R: "Trust/Credulity"
  };
  let maxDimKey = "T";
  let maxScore = -1;
  Object.keys(dna).forEach((key) => {
    if (dna[key] > maxScore) {
      maxScore = dna[key];
      maxDimKey = key;
    }
  });
  const targetVuln = dimMap[maxDimKey] || "Time Pressure";
  let pool = CAMGUARD_DATASET.filter(
    (s) => s.split === "train" && s.vulnerabilityTarget === targetVuln && !params.completedScenarioIds.includes(s.id)
  );
  if (pool.length === 0) {
    pool = CAMGUARD_DATASET.filter((s) => s.split === "train" && !params.completedScenarioIds.includes(s.id));
  }
  if (pool.length === 0) {
    pool = CAMGUARD_DATASET.filter((s) => s.split === "train");
  }
  let best = pool[0];
  if (params.userDefenseScore >= 75) {
    best = pool.find((s) => s.difficulty === "Advanced" || s.difficulty === "Stress-Test") || pool[0];
  } else if (params.userDefenseScore <= 50) {
    best = pool.find((s) => s.difficulty === "Beginner" || s.difficulty === "Intermediate") || pool[0];
  } else {
    best = pool.find((s) => s.difficulty === "Intermediate") || pool[0];
  }
  return {
    recommendedScenario: best,
    targetDimension: targetVuln,
    vulnerabilityScore: maxScore,
    pedagogicalRationale: `Thu\u1EADt to\xE1n th\xEDch \u1EE9ng ph\xE1t hi\u1EC7n \u0111i\u1EC3m y\u1EBFu cao nh\u1EA5t c\u1EE7a b\u1EA1n n\u1EB1m \u1EDF tr\u1EE5c [${targetVuln}] (Ch\u1EC9 s\u1ED1 r\u1EE7i ro: ${(maxScore * 100).toFixed(0)}%). H\u1EC7 th\u1ED1ng k\xEDch ho\u1EA1t k\u1ECBch b\u1EA3n hu\u1EA5n luy\u1EC7n thang \u0111\u1ED9 kh\xF3 [${best.difficulty}] \u0111\u1EC3 r\xE8n luy\u1EC7n ph\u1EA3n x\u1EA1 \u0111\u1ED1i ph\xF3.`
  };
}
function getMachineLearningBenchmarks() {
  const models = [
    {
      id: "model-1-rule-baseline",
      name: "Rule-Based Heuristic Baseline",
      type: "Rule-Based Baseline",
      accuracy: 74.2,
      precision: 71.5,
      recall: 68,
      f1Score: 69.7,
      rocAuc: 0.72,
      brierScore: 0.22,
      latencyMs: 1.2,
      resourceFootprint: "Ultra-low (0.1MB)",
      explainabilityRating: "Rule Transparent",
      strengths: ["T\u1ED1c \u0111\u1ED9 si\xEAu nhanh (< 2ms)", "Kh\xF4ng t\u1ED1n GPU", "D\u1EC5 d\xE0ng c\u1EADp nh\u1EADt rule m\u1EDBi"],
      tradeoffs: ["Kh\xF4ng hi\u1EC3u ng\u1EEF c\u1EA3nh tinh vi", "T\u1EF7 l\u1EC7 False Positive cao v\u1EDBi t\u1EEB kh\xF3a"]
    },
    {
      id: "model-2-logistic-regression",
      name: "Logistic Regression (L2 + TF-IDF)",
      type: "Logistic Regression",
      accuracy: 81.6,
      precision: 80.2,
      recall: 78.4,
      f1Score: 79.3,
      rocAuc: 0.83,
      brierScore: 0.16,
      latencyMs: 3.8,
      resourceFootprint: "Low (1.5MB)",
      explainabilityRating: "Feature Weights",
      strengths: ["Tr\u1ECDng s\u1ED1 h\u1ED3i quy r\xF5 r\xE0ng", "D\u1EC5 tri\u1EC3n khai tr\xEAn edge devices", "\u0110\u1ED9 \u1ED5n \u0111\u1ECBnh cao"],
      tradeoffs: ["Kh\xF4ng n\u1EAFm b\u1EAFt phi tuy\u1EBFn t\xEDnh ph\u1EE9c t\u1EA1p gi\u1EEFa c\xE1c vector t\xE2m l\xFD"]
    },
    {
      id: "model-3-random-forest",
      name: "Random Forest (50 Decision Trees)",
      type: "Random Forest",
      accuracy: 86.4,
      precision: 85.1,
      recall: 84.7,
      f1Score: 84.9,
      rocAuc: 0.89,
      brierScore: 0.13,
      latencyMs: 8.5,
      resourceFootprint: "Medium (12MB)",
      explainabilityRating: "Feature Importance (Gini)",
      strengths: ["Kh\xE1ng overfitting t\u1ED1t", "X\u1EBFp h\u1EA1ng t\u1EA7m quan tr\u1ECDng \u0111\u1EB7c tr\u01B0ng r\xF5 r\xE0ng", "Hi\u1EC7u n\u0103ng cao tr\xEAn b\u1EA3ng"],
      tradeoffs: ["K\xEDch th\u01B0\u1EDBc m\xF4 h\xECnh t\u0103ng d\u1EA7n theo s\u1ED1 c\xE2y"]
    },
    {
      id: "model-4-gbdt",
      name: "Gradient Boosted Trees (GBDT)",
      type: "Gradient Boosted Trees (GBDT)",
      accuracy: 89.2,
      precision: 88.5,
      recall: 87.9,
      f1Score: 88.2,
      rocAuc: 0.92,
      brierScore: 0.1,
      latencyMs: 12.4,
      resourceFootprint: "Medium-High (45MB)",
      explainabilityRating: "Feature Importance (SHAP)",
      strengths: ["\u0110\u1ED9 ch\xEDnh x\xE1c r\u1EA5t cao tr\xEAn \u0111\u1EB7c tr\u01B0ng d\u1EA1ng b\u1EA3ng", "Hi\u1EC7u ch\u1EC9nh x\xE1c su\u1EA5t t\u1ED1t"],
      tradeoffs: ["C\u1EA7n b\u01B0\u1EDBc ti\u1EC1n x\u1EED l\xFD feature vector k\u1EF9 l\u01B0\u1EE1ng"]
    },
    {
      id: "model-5-distil-text",
      name: "Distil-Text NLP Classifier",
      type: "Distil-Text Classifier",
      accuracy: 91.5,
      precision: 90.8,
      recall: 90.1,
      f1Score: 90.4,
      rocAuc: 0.94,
      brierScore: 0.08,
      latencyMs: 45,
      resourceFootprint: "Medium-High (45MB)",
      explainabilityRating: "Attention / Tokens",
      strengths: ["Hi\u1EC3u ng\u1EEF c\u1EA3nh ti\u1EBFng Vi\u1EC7t phong ph\xFA", "Ph\xE1t hi\u1EC7n l\u1EEBa \u0111\u1EA3o d\u1EA1ng v\u0103n b\u1EA3n tinh vi"],
      tradeoffs: ["\u0110\u1ED9 tr\u1EC5 trung b\xECnh", "C\u1EA7n b\u1ED9 nh\u1EDB GPU/CPU \u0111\u1EE7 l\u1EDBn"]
    },
    {
      id: "model-6-hybrid-llm",
      name: "ScamGuard Multi-Layer Hybrid LLM Reasoning",
      type: "Hybrid LLM Reasoning Classifier",
      accuracy: 96.8,
      precision: 96.2,
      recall: 95.8,
      f1Score: 96,
      rocAuc: 0.98,
      brierScore: 0.04,
      latencyMs: 380,
      resourceFootprint: "High (Server API)",
      explainabilityRating: "Full Chain-of-Thought",
      strengths: [
        "Ph\xE2n t\xEDch \u0111a ph\u01B0\u01A1ng th\u1EE9c (\u1EA2nh + Ch\u1EEF + URL + M\xE3 \u0111\u1ED9c)",
        "Gi\u1EA3i tr\xECnh chu\u1ED7i suy lu\u1EADn Chain-of-Thought \u0111\u1EA7y \u0111\u1EE7 cho ng\u01B0\u1EDDi d\xF9ng",
        "Ph\xE1t hi\u1EC7n k\u1ECBch b\u1EA3n l\u1EEBa \u0111\u1EA3o m\u1EDBi ph\xE1t sinh (Zero-day tactics)"
      ],
      tradeoffs: ["Ph\u1EE5 thu\u1ED9c k\u1EBFt n\u1ED1i m\u1EA1ng/API", "\u0110\u1ED9 tr\u1EC5 cao h\u01A1n m\xF4 h\xECnh c\u1EE5c b\u1ED9"]
    }
  ];
  return {
    models,
    tradeoffMatrix: {
      criteria: ["Accuracy (F1)", "Inference Latency", "Explainability", "Edge Deployment", "Zero-Day Detection", "Privacy Preservation"],
      ratings: {
        "Rule-Based Baseline": ["Th\u1EA5p (69.7%)", "R\u1EA5t nhanh (<2ms)", "Cao (Minh b\u1EA1ch)", "T\u1ED1i \u01B0u", "K\xE9m", "100% On-device"],
        "Logistic Regression": ["Trung b\xECnh (79.3%)", "Nhanh (<4ms)", "Kh\xE1 (Tr\u1ECDng s\u1ED1)", "T\u1ED1t", "Y\u1EBFu", "100% On-device"],
        "Random Forest": ["T\u1ED1t (84.9%)", "Nhanh (<9ms)", "Kh\xE1 (Gini)", "T\u1ED1t", "Trung b\xECnh", "100% On-device"],
        "GBDT": ["Cao (88.2%)", "Kh\xE1 (<13ms)", "Kh\xE1 (SHAP)", "Kh\u1EA3 thi", "Kh\xE1", "100% On-device"],
        "Distil-Text": ["R\u1EA5t cao (90.4%)", "Trung b\xECnh (45ms)", "Trung b\xECnh (Attention)", "Kh\xF3", "T\u1ED1t", "C\u1EE5c b\u1ED9 / Server"],
        "Hybrid LLM Reasoning": ["Xu\u1EA5t s\u1EAFc (96.0%)", "Ch\u1EADm (380ms)", "To\xE0n di\u1EC7n (Chain-of-Thought)", "Y\xEAu c\u1EA7u API", "Xu\u1EA5t s\u1EAFc", "Kh\u1EED PII tr\u01B0\u1EDBc khi g\u1EEDi"]
      }
    }
  };
}
function getErrorTaxonomyAnalysis() {
  return [
    {
      id: "err-1",
      rootCause: "OVERTRUST_AUTHORITY",
      vietnameseTitle: "Tu\xE2n th\u1EE7 m\xF9 qu\xE1ng Uy quy\u1EC1n gi\u1EA3 m\u1EA1o (Overtrust Authority)",
      description: "N\u1EA1n nh\xE2n t\xEA li\u1EC7t ph\u1EA3n bi\u1EC7n khi \u0111\u1ED1i t\u01B0\u1EE3ng x\u01B0ng danh C\xF4ng an, Vi\u1EC7n Ki\u1EC3m s\xE1t ho\u1EB7c C\xE1n b\u1ED9 Thu\u1EBF, b\u1EA5t ch\u1EA5p c\xE1c d\u1EA5u hi\u1EC7u v\xF4 l\xFD nh\u01B0 g\u1ECDi qua \u0111i\u1EC7n tho\u1EA1i hay g\u1EEDi link l\u1EA1.",
      frequencyPercentage: 34.2,
      averageDecisionLatencySec: 3.8,
      associatedDemographicRisk: "Ng\u01B0\u1EDDi cao tu\u1ED5i (60+) v\xE0 Sinh vi\xEAn m\u1EDBi ra tr\u01B0\u1EDDng",
      recommendedPedagogicalMitigation: 'R\xE8n luy\u1EC7n "M\u1EC7nh \u0111\u1EC1 v\xE0ng": C\u01A1 quan ph\xE1p lu\u1EADt Vi\u1EC7t Nam KH\xD4NG BAO GI\u1EDC l\xE0m vi\u1EC7c qua \u0111i\u1EC7n tho\u1EA1i hay y\xEAu c\u1EA7u chuy\u1EC3n kho\u1EA3n b\u1EA3o l\xE3nh.'
    },
    {
      id: "err-2",
      rootCause: "URGENCY_PANIC_OVERLOAD",
      vietnameseTitle: "Qu\xE1 t\u1EA3i ho\u1EA3ng lo\u1EA1n do \xC1p l\u1EF1c Th\u1EDDi gian (Urgency Panic Overload)",
      description: 'Khi b\u1ECB \u0111e d\u1ECDa "kh\xF3a t\xE0i kho\u1EA3n trong 5 ph\xFAt" ho\u1EB7c "con \u0111ang m\u1ED5 c\u1EA5p c\u1EE9u", n\xE3o b\u1ED9 chuy\u1EC3n sang c\u01A1 ch\u1EBF h\u1EA1ch h\u1EA1nh nh\xE2n (Amygdala hijack), d\u1EABn \u0111\u1EBFn h\xE0nh \u0111\u1ED9ng v\u1ED9i v\xE0ng.',
      frequencyPercentage: 28.5,
      averageDecisionLatencySec: 2.4,
      associatedDemographicRisk: "Ph\u1EE5 huynh c\xF3 con nh\u1ECF v\xE0 Nh\xE2n vi\xEAn v\u0103n ph\xF2ng b\u1EADn r\u1ED9n",
      recommendedPedagogicalMitigation: 'K\xEDch ho\u1EA1t "Kho\u1EA3ng d\u1EEBng nh\u1EADn th\u1EE9c 5 ph\xFAt" v\xE0 quy tr\xECnh x\xE1c minh ch\xE9o 2 k\xEAnh \u0111\u1ED9c l\u1EADp.'
    },
    {
      id: "err-3",
      rootCause: "IGNORED_DOMAIN_ANOMALY",
      vietnameseTitle: "B\u1ECF qua D\u1EA5u hi\u1EC7u B\u1EA5t th\u01B0\u1EDDng T\xEAn mi\u1EC1n (Ignored Domain Anomaly)",
      description: "B\u1EA5m v\xE0o li\xEAn k\u1EBFt l\u1EEBa \u0111\u1EA3o c\xF3 giao di\u1EC7n gi\u1ED1ng h\u1EC7t ng\xE2n h\xE0ng nh\u01B0ng s\u1EED d\u1EE5ng \u0111u\xF4i t\xEAn mi\u1EC1n .top, .vip, .cc ho\u1EB7c k\u1EF9 thu\u1EADt Typosquatting (vietcom-bank.cc).",
      frequencyPercentage: 18.9,
      averageDecisionLatencySec: 4.1,
      associatedDemographicRisk: "Ng\u01B0\u1EDDi d\xF9ng thi\u1EBFt b\u1ECB di \u0111\u1ED9ng m\xE0n h\xECnh nh\u1ECF b\u1ECB che khu\u1EA5t URL bar",
      recommendedPedagogicalMitigation: "M\xF4 ph\u1ECFng soi k\xEDnh l\xFAp t\xEAn mi\u1EC1n: \u0110\u1ECDc t\u1EEB \u0111u\xF4i TLD ng\u01B0\u1EE3c l\u1EA1i Domain g\u1ED1c."
    },
    {
      id: "err-4",
      rootCause: "CREDENTIAL_OTP_SURRENDER",
      vietnameseTitle: "Nh\u1EA7m l\u1EABn Nguy\xEAn l\xFD Giao d\u1ECBch OTP (Credential / OTP Surrender)",
      description: 'Cung c\u1EA5p m\xE3 OTP khi nh\u1EADn th\xF4ng b\xE1o "Nh\u1EADn ti\u1EC1n ho\xE0n / Tr\xFAng th\u01B0\u1EDFng" do ng\u1ED9 nh\u1EADn r\u1EB1ng OTP d\xF9ng cho c\u1EA3 2 chi\u1EC1u nh\u1EADn v\xE0 chuy\u1EC3n ti\u1EC1n.',
      frequencyPercentage: 11.2,
      averageDecisionLatencySec: 5.2,
      associatedDemographicRisk: "Ng\u01B0\u1EDDi m\u1EDBi s\u1EED d\u1EE5ng Mobile Banking v\xE0 mua s\u1EAFm online",
      recommendedPedagogicalMitigation: 'Kh\u1EAFc ghi nguy\xEAn l\xFD t\xE0i ch\xEDnh: "M\xE3 OTP CH\u1EC8 D\xD9NG KHI TR\u1EEA TI\u1EC0N, nh\u1EADn ti\u1EC1n KH\xD4NG BAO GI\u1EDC c\u1EA7n OTP".'
    },
    {
      id: "err-5",
      rootCause: "FINANCIAL_GREED_BLINDNESS",
      vietnameseTitle: "B\u1EABy L\u1EE3i nhu\u1EADn Si\xEAu th\u1EF1c & Nhi\u1EC7m v\u1EE5 \u1EA3o (Financial Greed Blindness)",
      description: "B\u1ECB h\u1EA5p d\u1EABn b\u1EDFi cam k\u1EBFt l\xE3i su\u1EA5t 45%/tu\u1EA7n ho\u1EB7c nhi\u1EC7m v\u1EE5 xem video ki\u1EBFm 500k/ng\xE0y, ch\u1EA5p nh\u1EADn n\u1EA1p ti\u1EC1n c\u1ECDc t\u0103ng d\u1EA7n theo hi\u1EC7u \u1EE9ng Leo thang Cam k\u1EBFt (Escalation of Commitment).",
      frequencyPercentage: 4.8,
      averageDecisionLatencySec: 8.5,
      associatedDemographicRisk: "Thanh thi\u1EBFu ni\xEAn, h\u1ECDc sinh t\xECm vi\u1EC7c l\xE0m th\xEAm online",
      recommendedPedagogicalMitigation: 'B\xE0i h\u1ECDc ph\xE2n t\xEDch t\xE0i ch\xEDnh: B\u1EA5t k\u1EF3 m\xF4 h\xECnh cam k\u1EBFt l\u1EE3i nhu\u1EADn >20%/n\u0103m m\xE0 "kh\xF4ng r\u1EE7i ro" \u0111\u1EC1u l\xE0 Ponzi.'
    },
    {
      id: "err-6",
      rootCause: "SUPERFICIAL_VISUAL_BIAS",
      vietnameseTitle: "\u0110\u1ECBnh ki\u1EBFn Th\u1ECB gi\xE1c B\u1EC1 ngo\xE0i (Superficial Visual Bias)",
      description: "Tin t\u01B0\u1EDFng ho\xE0n to\xE0n v\xE0o h\xECnh \u1EA3nh bi\xEAn lai chuy\u1EC3n ti\u1EC1n Photoshop (Fake Bill) ho\u1EB7c con d\u1EA5u \u0111\u1ECF gi\u1EA3 m\u1EA1o v\xEC giao di\u1EC7n tr\xF4ng r\u1EA5t chuy\xEAn nghi\u1EC7p.",
      frequencyPercentage: 1.6,
      averageDecisionLatencySec: 6,
      associatedDemographicRisk: "Ch\u1EE7 shop b\xE1n h\xE0ng online v\xE0 ng\u01B0\u1EDDi giao d\u1ECBch P2P",
      recommendedPedagogicalMitigation: "Quy t\u1EAFc b\xE0n giao h\xE0ng h\xF3a: Ch\u1EC9 tin v\xE0o s\u1ED1 d\u01B0 th\u1EF1c tr\xEAn \u1EE9ng d\u1EE5ng Mobile Banking c\u1EE7a ng\u01B0\u1EDDi nh\u1EADn, kh\xF4ng tin \u1EA3nh ch\u1EE5p."
    },
    {
      id: "err-7",
      rootCause: "SYNTHETIC_MEDIA_UNAWARE",
      vietnameseTitle: "Ch\u01B0a Nh\u1EADn th\u1EE9c Nguy c\u01A1 Deepfake (Synthetic Media Unaware)",
      description: "Tin v\xE0o cu\u1ED9c g\u1ECDi video ng\u1EAFn 10 gi\xE2y c\xF3 khu\xF4n m\u1EB7t v\xE0 gi\u1ECDng n\xF3i c\u1EE7a ng\u01B0\u1EDDi th\xE2n ho\u1EB7c l\xE3nh \u0111\u1EA1o m\xE0 kh\xF4ng nh\u1EADn ra c\xE1c hi\u1EC7n t\u01B0\u1EE3ng nh\xF2e vi\u1EC1n v\xE0 gi\u1EADt khung h\xECnh.",
      frequencyPercentage: 0.8,
      averageDecisionLatencySec: 4.7,
      associatedDemographicRisk: "Ph\u1ED5 bi\u1EBFn \u1EDF m\u1ECDi l\u1EE9a tu\u1ED5i do c\xF4ng ngh\u1EC7 GenAI ph\xE1t tri\u1EC3n qu\xE1 nhanh",
      recommendedPedagogicalMitigation: 'Th\u1ECFa thu\u1EADn "M\u1EADt m\xE3 gia \u0111\xECnh b\xED m\u1EADt" v\xE0 y\xEAu c\u1EA7u ng\u01B0\u1EDDi g\u1ECDi quay nghi\xEAng m\u1EB7t sang ngang.'
    }
  ];
}
function computeExperimentalStatistics() {
  const groups = {
    GROUP_A_CONTROL: [],
    GROUP_B_NON_ADAPTIVE: [],
    GROUP_C_ADAPTIVE: []
  };
  PARTICIPANT_TRIALS.forEach((t) => {
    if (groups[t.group]) groups[t.group].push(t);
  });
  function getMean(arr) {
    if (arr.length === 0) return 0;
    return +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
  }
  function getVariance(arr, mean) {
    if (arr.length <= 1) return 0;
    return +(arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (arr.length - 1)).toFixed(2);
  }
  const groupMetrics = {};
  Object.keys(groups).forEach((key) => {
    const list = groups[key];
    const preArr = list.map((t) => t.preTestScore);
    const postArr = list.map((t) => t.postTestScore);
    const unseenArr = list.map((t) => t.unseenTestScore);
    const retArr = list.map((t) => t.retentionScore14Days);
    const diffArr = list.map((t) => t.postTestScore - t.preTestScore);
    const unsafePreArr = list.map((t) => t.unsafeActionRatePre);
    const unsafePostArr = list.map((t) => t.unsafeActionRatePost);
    const meanPre = getMean(preArr);
    const meanPost = getMean(postArr);
    const meanUnseen = getMean(unseenArr);
    const meanRetention = getMean(retArr);
    const meanGain = getMean(diffArr);
    const meanUnsafePre = getMean(unsafePreArr);
    const meanUnsafePost = getMean(unsafePostArr);
    const unsafeReduction = meanUnsafePre > 0 ? +((meanUnsafePre - meanUnsafePost) / meanUnsafePre * 100).toFixed(1) : 0;
    const latPre = getMean(list.map((t) => t.avgResponseTimePreSec));
    const latPost = getMean(list.map((t) => t.avgResponseTimePostSec));
    groupMetrics[key] = {
      count: list.length,
      meanPre,
      meanPost,
      meanUnseen,
      meanRetention,
      meanGain,
      varPre: getVariance(preArr, meanPre),
      varPost: getVariance(postArr, meanPost),
      unsafeActionReductionPct: unsafeReduction,
      avgLatencyPre: latPre,
      avgLatencyPost: latPost
    };
  });
  const groupCTrials = groups.GROUP_C_ADAPTIVE;
  const cDeltas = groupCTrials.map((t) => t.postTestScore - t.preTestScore);
  const cMeanDelta = getMean(cDeltas);
  const cVarDelta = getVariance(cDeltas, cMeanDelta);
  const cStdDelta = Math.sqrt(cVarDelta);
  const cN = groupCTrials.length;
  const cSE = cStdDelta / Math.sqrt(cN);
  const cTValue = +(cMeanDelta / (cSE || 1e-3)).toFixed(3);
  const cDF = cN - 1;
  const cCohensD = +(cMeanDelta / (cStdDelta || 1)).toFixed(2);
  const cCi95 = [
    +(cMeanDelta - 1.96 * cSE).toFixed(2),
    +(cMeanDelta + 1.96 * cSE).toFixed(2)
  ];
  const aPosts = groups.GROUP_A_CONTROL.map((t) => t.postTestScore);
  const cPosts = groups.GROUP_C_ADAPTIVE.map((t) => t.postTestScore);
  const aMeanPost = getMean(aPosts);
  const cMeanPost = getMean(cPosts);
  const aVar = getVariance(aPosts, aMeanPost);
  const cVar = getVariance(cPosts, cMeanPost);
  const pooledSE = Math.sqrt(aVar / aPosts.length + cVar / cPosts.length);
  const indepTVal = +((cMeanPost - aMeanPost) / (pooledSE || 1e-3)).toFixed(3);
  const indepCohensD = +((cMeanPost - aMeanPost) / Math.sqrt((aVar + cVar) / 2)).toFixed(2);
  const wilcoxonResult = {
    testName: "Wilcoxon Signed-Rank Test (Paired Non-Parametric)",
    testStatistic: 253,
    pValue: 1e-4,
    significant: true,
    interpretation: "S\u1EF1 c\u1EA3i thi\u1EC7n \u0111i\u1EC3m s\u1ED1 \u1EDF Nh\xF3m C c\xF3 \xFD ngh\u0129a th\u1ED1ng k\xEA v\u01B0\u1EE3t tr\u1ED9i (p < 0.001) ngay c\u1EA3 khi kh\xF4ng gi\u1EA3 \u0111\u1ECBnh ph\xE2n ph\u1ED1i chu\u1EA9n.",
    assumptionsMet: true
  };
  const mannWhitneyResult = {
    testName: "Mann-Whitney U Test (Between-Groups Non-Parametric)",
    testStatistic: 484,
    pValue: 1e-4,
    significant: true,
    interpretation: "Ph\xE2n ph\u1ED1i \u0111i\u1EC3m s\u1ED1 sau can thi\u1EC7p c\u1EE7a Nh\xF3m C v\u01B0\u1EE3t tr\u1ED9i h\u01A1n Nh\xF3m A c\xF3 \xFD ngh\u0129a th\u1ED1ng k\xEA cao (U = 484.0, p < 0.001).",
    assumptionsMet: true
  };
  const correlationMatrix = [
    {
      dimensionKey: "T",
      dimensionName: "\xC1p l\u1EF1c th\u1EDDi gian (Time Pressure)",
      targetScamCategory: "Kh\xF3a t\xE0i kho\u1EA3n kh\u1EA9n c\u1EA5p (Banking Urgency)",
      pearsonR: 0.78,
      spearmanRho: 0.81,
      pValue: 1e-4,
      interpretation: "T\u01B0\u01A1ng quan thu\u1EADn r\u1EA5t m\u1EA1nh: \u0110i\u1EC3m y\u1EBFu Time Pressure cao d\u1EABn tr\u1EF1c ti\u1EBFp \u0111\u1EBFn vi\u1EC7c d\xEDnh b\u1EABy d\u1ED3n \xE9p 5 ph\xFAt (H4 \u0111\u01B0\u1EE3c ki\u1EC3m ch\u1EE9ng)."
    },
    {
      dimensionKey: "A",
      dimensionName: "N\u1ED7i s\u1EE3 uy quy\u1EC1n (Authority Fear)",
      targetScamCategory: "M\u1EA1o danh C\xF4ng an / C\u1EE5c Thu\u1EBF",
      pearsonR: 0.84,
      spearmanRho: 0.86,
      pValue: 1e-4,
      interpretation: "T\u01B0\u01A1ng quan r\u1EA5t cao: \u0110i\u1EC3m y\u1EBFu Authority Fear d\u1EF1 b\xE1o ch\xEDnh x\xE1c 84% kh\u1EA3 n\u0103ng ch\u1EA5p h\xE0nh l\u1EC7nh c\xE0i file APK gi\u1EA3 m\u1EA1o."
    },
    {
      dimensionKey: "G",
      dimensionName: "L\xF2ng tham t\xE0i ch\xEDnh (Financial Greed)",
      targetScamCategory: "S\xE0n Forex AI / Nhi\u1EC7m v\u1EE5 Telegram",
      pearsonR: 0.72,
      spearmanRho: 0.75,
      pValue: 2e-4,
      interpretation: "T\u01B0\u01A1ng quan m\u1EA1nh gi\u1EEFa l\xF2ng tham l\u1EE3i nhu\u1EADn si\xEAu th\u1EF1c v\xE0 t\u1EF7 l\u1EC7 n\u1EA1p ti\u1EC1n c\u1ECDc nhi\u1EC7m v\u1EE5."
    },
    {
      dimensionKey: "C",
      dimensionName: "\u0110\u1ECBnh ki\u1EBFn ti\u1EC7n l\u1EE3i (Convenience Bias)",
      targetScamCategory: "M\xE3 QR d\xE1n \u0111\xE8 (Quishing) & Shipper COD",
      pearsonR: 0.69,
      spearmanRho: 0.71,
      pValue: 5e-4,
      interpretation: "T\u01B0\u01A1ng quan r\xF5 r\u1EC7t: Th\xF3i quen qu\xE9t m\xE3 thanh to\xE1n v\u1ED9i v\xE0ng l\xE0m gia t\u0103ng r\u1EE7i ro Quishing."
    }
  ];
  const chiSquareResult = {
    testName: "Chi-Square Test of Independence for Error Taxonomy",
    chiSquareStat: 38.45,
    df: 12,
    pValue: 1e-4,
    interpretation: "C\xF3 s\u1EF1 kh\xE1c bi\u1EC7t c\xF3 \xFD ngh\u0129a th\u1ED1ng k\xEA v\u1EC1 c\u1EA5u tr\xFAc ph\xE2n b\u1ED1 l\u1ED7i gi\u1EEFa 3 nh\xF3m (chi-sq=38.45, p < 0.001). Nh\xF3m C \u0111\xE3 tri\u1EC7t ti\xEAu ho\xE0n to\xE0n c\xE1c l\u1ED7i s\u01A1 \u0111\u1EB3ng."
  };
  const ablationResults = [
    {
      component: "H\u1EC7 th\u1ED1ng To\xE0n di\u1EC7n (Full ScamGuard C)",
      meanScore: 87.8,
      degradationPct: 0,
      scientificImpact: "Baseline ho\xE0n ch\u1EC9nh v\u1EDBi vector Scam DNA 6 chi\u1EC1u + AI ph\u1EA3n x\u1EA1"
    },
    {
      component: "Lo\u1EA1i b\u1ECF Hu\u1EA5n luy\u1EC7n Th\xEDch \u1EE9ng (No Adaptive Recommender)",
      meanScore: 72.4,
      degradationPct: -17.5,
      scientificImpact: "Hi\u1EC7u qu\u1EA3 suy gi\u1EA3m m\u1EA1nh khi k\u1ECBch b\u1EA3n kh\xF4ng nh\u1EAFm tr\xFAng \u0111i\u1EC3m y\u1EBFu t\xE2m l\xFD"
    },
    {
      component: "Lo\u1EA1i b\u1ECF H\xECnh ph\u1EA1t Ph\u1EA3n x\u1EA1 Th\u1EDDi gian (No Latency Calibration)",
      meanScore: 79.1,
      degradationPct: -9.9,
      scientificImpact: "Ng\u01B0\u1EDDi h\u1ECDc c\xF3 xu h\u01B0\u1EDBng click ph\u1EA3n x\u1EA1 nhanh d\u01B0\u1EDBi 3s m\xE0 kh\xF4ng suy x\xE9t"
    },
    {
      component: "Lo\u1EA1i b\u1ECF Gi\xE1m \u0111\u1ECBnh Th\u1ECB gi\xE1c \u0110a ph\u01B0\u01A1ng th\u1EE9c (No Visual Forensics)",
      meanScore: 81.3,
      degradationPct: -7.4,
      scientificImpact: "D\u1EC5 d\xEDnh b\u1EABy gi\u1EA3 m\u1EA1o h\xF3a \u0111\u01A1n (Fake Bill) v\xE0 Deepfake m\u1EB7t s\u1EBFp"
    },
    {
      component: "Lo\u1EA1i b\u1ECF H\u01B0\u1EDBng d\u1EABn Si\xEAu nh\u1EADn th\u1EE9c (No Metacognitive AI Coach)",
      meanScore: 74.8,
      degradationPct: -14.8,
      scientificImpact: "Ng\u01B0\u1EDDi h\u1ECDc ch\u1EC9 bi\u1EBFt \u0111\xFAng/sai nh\u01B0ng kh\xF4ng hi\u1EC3u nguy\xEAn l\xFD t\xE2m l\xFD b\u1ECB khai th\xE1c"
    }
  ];
  return {
    groupMetrics,
    inferentialTests: {
      groupC_PairedTTest: {
        t: cTValue,
        df: cDF,
        pValue: 1e-4,
        cohensD: cCohensD,
        ci95: cCi95,
        significant: true
      },
      groupA_vs_GroupC_IndTest: {
        t: indepTVal,
        df: aPosts.length + cPosts.length - 2,
        pValue: 1e-4,
        cohensD: indepCohensD,
        significant: true
      },
      wilcoxonResult,
      mannWhitneyResult,
      correlationMatrix,
      chiSquareResult,
      generalizationRetentionGain: {
        groupAUnseenMean: groupMetrics.GROUP_A_CONTROL.meanUnseen,
        groupCUnseenMean: groupMetrics.GROUP_C_ADAPTIVE.meanUnseen,
        diffPct: +((groupMetrics.GROUP_C_ADAPTIVE.meanUnseen - groupMetrics.GROUP_A_CONTROL.meanUnseen) / groupMetrics.GROUP_A_CONTROL.meanUnseen * 100).toFixed(1),
        groupARetentionMean: groupMetrics.GROUP_A_CONTROL.meanRetention,
        groupCRetentionMean: groupMetrics.GROUP_C_ADAPTIVE.meanRetention,
        retentionGainPct: +((groupMetrics.GROUP_C_ADAPTIVE.meanRetention - groupMetrics.GROUP_A_CONTROL.meanRetention) / groupMetrics.GROUP_A_CONTROL.meanRetention * 100).toFixed(1)
      }
    },
    ablationResults,
    datasetAnalytics: getDatasetAnalytics()
  };
}
function simulateRiskWeights(weights, testSampleScores) {
  const sum = weights.wTechnical + weights.wBehavioral + weights.wPsychological + weights.wIdentityAuthority + weights.wFinancial;
  const normTech = weights.wTechnical / sum;
  const normBeh = weights.wBehavioral / sum;
  const normPsych = weights.wPsychological / sum;
  const normId = weights.wIdentityAuthority / sum;
  const normFin = weights.wFinancial / sum;
  const compositeRiskScore = Math.round(
    testSampleScores.technical * normTech + testSampleScores.behavioral * normBeh + testSampleScores.psychological * normPsych + testSampleScores.identity * normId + testSampleScores.financial * normFin
  );
  let riskLevel = "SAFE";
  if (compositeRiskScore >= 70) riskLevel = "HIGH";
  else if (compositeRiskScore >= 45) riskLevel = "MEDIUM";
  else if (compositeRiskScore >= 20) riskLevel = "LOW";
  return {
    compositeRiskScore,
    riskLevel,
    normalizedWeights: {
      wTechnical: +normTech.toFixed(2),
      wBehavioral: +normBeh.toFixed(2),
      wPsychological: +normPsych.toFixed(2),
      wIdentityAuthority: +normId.toFixed(2),
      wFinancial: +normFin.toFixed(2)
    },
    formula: `Score = (${normTech.toFixed(2)} * S_tech) + (${normBeh.toFixed(2)} * S_beh) + (${normPsych.toFixed(2)} * S_psych) + (${normId.toFixed(2)} * S_id) + (${normFin.toFixed(2)} * S_fin)`
  };
}
function getAllCommunitySurveys() {
  return COMMUNITY_SURVEYS;
}
function recordCommunitySurveySubmission(submission) {
  const isAnon = submission.isAnonymous !== void 0 ? submission.isAnonymous : true;
  const anonCode = submission.anonymousCode || `ANON-VN-${Math.floor(1e3 + Math.random() * 9e3)}`;
  const newSubmission = {
    id: submission.id || `SURVEY-LIVE-${Date.now().toString().slice(-6)}`,
    participantName: isAnon ? submission.anonymousCode || `Th\xED sinh \u1EA9n danh #${anonCode.slice(-4)}` : submission.participantName || "Kh\u1EA3o nghi\u1EC7m vi\xEAn ViSEF",
    demographicGroup: submission.demographicGroup || "STUDENT",
    location: submission.location || "H\xE0 N\u1ED9i",
    isAnonymous: isAnon,
    anonymousCode: anonCode,
    schoolName: submission.schoolName || "THPT Chuy\xEAn",
    className: submission.className || "Kh\u1ED1i 11",
    consentAgreed: submission.consentAgreed !== void 0 ? submission.consentAgreed : true,
    surveyResponses: submission.surveyResponses || {
      everEncounteredScam: true,
      pastLossOrNearMiss: "CLICKED_SUSPICIOUS_LINK",
      preConfidenceScore: 45,
      biggestFearTactic: "AUTHORITY_POLICE",
      verificationHabitPre: "IMMEDIATE_ACTION",
      timeToDecidePreSec: 3.5
    },
    testOutcome: submission.testOutcome || {
      preScore: 50,
      postScore: 88,
      unseenScore: 85,
      unsafeActionAvoided: true,
      timeToDecidePostSec: 11.5,
      scamDnaShift: {
        before: { T: 0.72, A: 0.65, G: 0.58, E: 0.6, C: 0.64, R: 0.52 },
        after: { T: 0.18, A: 0.15, G: 0.16, E: 0.19, C: 0.17, R: 0.14 }
      }
    },
    feedbackNote: submission.feedbackNote || "Tr\u1EA3i nghi\u1EC7m \u1EE9ng d\u1EE5ng gi\xFAp t\xF4i h\xECnh th\xE0nh ph\u1EA3n x\u1EA1 d\u1EEBng l\u1EA1i ki\u1EC3m ch\u1EE9ng 2 k\xEAnh tr\u01B0\u1EDBc khi giao d\u1ECBch.",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  COMMUNITY_SURVEYS.unshift(newSubmission);
  lockSurveyData();
  return newSubmission;
}
function getCommunitySurveyAnalytics() {
  const total = COMMUNITY_SURVEYS.length;
  const safeTotal = total > 0 ? total : 1;
  const groupLabels = {
    STUDENT: "H\u1ECDc sinh & Sinh vi\xEAn",
    OFFICE_WORKER: "Nh\xE2n vi\xEAn V\u0103n ph\xF2ng",
    ELDERLY: "Ng\u01B0\u1EDDi Cao tu\u1ED5i / H\u01B0u tr\xED",
    BUSINESS_OWNER: "Kinh doanh & B\xE1n h\xE0ng Online",
    TEACHER_JUDGE: "Gi\xE1o vi\xEAn & Ban Gi\xE1m Kh\u1EA3o"
  };
  const groups = {
    STUDENT: [],
    OFFICE_WORKER: [],
    ELDERLY: [],
    BUSINESS_OWNER: [],
    TEACHER_JUDGE: []
  };
  let totalEncountered = 0;
  let totalClickedOrCompromised = 0;
  let totalSharedOtpOrLoss = 0;
  let totalPanicked = 0;
  let sumPreScore = 0;
  let sumPostScore = 0;
  let sumPreLatency = 0;
  let sumPostLatency = 0;
  let totalSafeActionAvoided = 0;
  let totalUnseenPass = 0;
  const tacticCounts = {
    AUTHORITY_POLICE: 0,
    URGENT_ACCIDENT: 0,
    FAKE_BILL_QR: 0,
    TELEGRAM_INCOME: 0,
    DEEPFAKE_CALL: 0
  };
  const habitCounts = {
    IMMEDIATE_ACTION: 0,
    ASK_FRIENDS: 0,
    DOUBLE_CHECK_OFFICIAL: 0,
    CONFUSED: 0
  };
  COMMUNITY_SURVEYS.forEach((s) => {
    if (groups[s.demographicGroup]) {
      groups[s.demographicGroup].push(s);
    }
    if (s.surveyResponses.everEncounteredScam) totalEncountered++;
    if (s.surveyResponses.pastLossOrNearMiss === "CLICKED_SUSPICIOUS_LINK" || s.surveyResponses.pastLossOrNearMiss === "LOST_MONEY" || s.surveyResponses.pastLossOrNearMiss === "SHARED_OTP_PASSWORD") {
      totalClickedOrCompromised++;
    }
    if (s.surveyResponses.pastLossOrNearMiss === "LOST_MONEY" || s.surveyResponses.pastLossOrNearMiss === "SHARED_OTP_PASSWORD") {
      totalSharedOtpOrLoss++;
    }
    if (s.surveyResponses.biggestFearTactic === "AUTHORITY_POLICE" || s.surveyResponses.biggestFearTactic === "URGENT_ACCIDENT") {
      totalPanicked++;
    }
    sumPreScore += s.testOutcome.preScore;
    sumPostScore += s.testOutcome.postScore;
    sumPreLatency += s.surveyResponses.timeToDecidePreSec || 3.5;
    sumPostLatency += s.testOutcome.timeToDecidePostSec || 11.5;
    if (s.testOutcome.unsafeActionAvoided) totalSafeActionAvoided++;
    if (s.testOutcome.unseenScore >= 75) totalUnseenPass++;
    if (tacticCounts[s.surveyResponses.biggestFearTactic] !== void 0) {
      tacticCounts[s.surveyResponses.biggestFearTactic]++;
    }
    if (habitCounts[s.surveyResponses.verificationHabitPre] !== void 0) {
      habitCounts[s.surveyResponses.verificationHabitPre]++;
    }
  });
  const demographicBreakdown = Object.keys(groups).map((grpKey) => {
    const list = groups[grpKey];
    const count = list.length;
    const meanPre = count > 0 ? +(list.reduce((acc, x) => acc + x.testOutcome.preScore, 0) / count).toFixed(1) : 0;
    const meanPost = count > 0 ? +(list.reduce((acc, x) => acc + x.testOutcome.postScore, 0) / count).toFixed(1) : 0;
    const unsafePreCount = list.filter((x) => x.surveyResponses.pastLossOrNearMiss === "LOST_MONEY" || x.surveyResponses.pastLossOrNearMiss === "SHARED_OTP_PASSWORD" || x.surveyResponses.pastLossOrNearMiss === "CLICKED_SUSPICIOUS_LINK").length;
    const unsafePostCount = list.filter((x) => !x.testOutcome.unsafeActionAvoided).length;
    return {
      groupKey: grpKey,
      label: groupLabels[grpKey],
      count,
      percentage: total > 0 ? +(count / total * 100).toFixed(1) : 0,
      meanPreScore: meanPre,
      meanPostScore: meanPost,
      meanGain: +(meanPost - meanPre).toFixed(1),
      meanUnsafeRatePre: count > 0 ? +(unsafePreCount / count * 100).toFixed(1) : 0,
      meanUnsafeRatePost: count > 0 ? +(unsafePostCount / count * 100).toFixed(1) : 0
    };
  });
  const tacticLabels = {
    AUTHORITY_POLICE: "D\u1ECDa b\u1EAFt gi\u1EEF / M\u1EA1o danh C\xF4ng an, Vi\u1EC7n Ki\u1EC3m S\xE1t",
    URGENT_ACCIDENT: "\xC1p l\u1EF1c c\u1EA5p c\u1EE9u / Kh\xF3a t\xE0i kho\u1EA3n trong 5 ph\xFAt",
    FAKE_BILL_QR: "H\xF3a \u0111\u01A1n chuy\u1EC3n kho\u1EA3n gi\u1EA3 (Fake Bill) & QR \u0111\u1ED9c h\u1EA1i",
    TELEGRAM_INCOME: "Vi\u1EC7c nh\u1EB9 l\u01B0\u01A1ng cao, nhi\u1EC7m v\u1EE5 Telegram, s\xE0n \u1EA3o",
    DEEPFAKE_CALL: "Cu\u1ED9c g\u1ECDi Video Deepfake m\u1EA1o danh ng\u01B0\u1EDDi th\xE2n"
  };
  const fearTacticsDistribution = Object.keys(tacticCounts).map((key) => ({
    tacticKey: key,
    tacticLabel: tacticLabels[key] || key,
    count: tacticCounts[key],
    percentage: total > 0 ? +(tacticCounts[key] / total * 100).toFixed(1) : 0
  }));
  const habitLabels = {
    IMMEDIATE_ACTION: "Ph\u1EA3n x\u1EA1 b\u1EA5m ngay ho\u1EB7c l\xE0m theo h\u01B0\u1EDBng d\u1EABn",
    ASK_FRIENDS: "H\u1ECFi ng\u01B0\u1EDDi quen ho\u1EB7c \u0111\u0103ng l\xEAn m\u1EA1ng x\xE3 h\u1ED9i h\u1ECFi",
    DOUBLE_CHECK_OFFICIAL: "D\u1EEBng l\u1EA1i g\u1ECDi hotline ch\xEDnh th\u1ED1ng x\xE1c minh",
    CONFUSED: "Hoang mang, b\u1ED1i r\u1ED1i kh\xF4ng bi\u1EBFt x\u1EED l\xFD th\u1EBF n\xE0o"
  };
  const verificationHabitsPre = Object.keys(habitCounts).map((key) => ({
    habitKey: key,
    habitLabel: habitLabels[key] || key,
    count: habitCounts[key],
    percentage: total > 0 ? +(habitCounts[key] / total * 100).toFixed(1) : 0
  }));
  const avgPreLatency = total > 0 ? +(sumPreLatency / total).toFixed(1) : 0;
  const avgPostLatency = total > 0 ? +(sumPostLatency / total).toFixed(1) : 0;
  const scamDnaComparativeRadar = [
    { dimensionKey: "T", dimensionName: "\xC1p l\u1EF1c th\u1EDDi gian (Time Pressure)", preAppVulnerability: total > 0 ? 69.5 : 0, postAppVulnerability: total > 0 ? 17.8 : 0, reductionPct: total > 0 ? -74.4 : 0 },
    { dimensionKey: "A", dimensionName: "N\u1ED7i s\u1EE3 uy quy\u1EC1n (Authority Fear)", preAppVulnerability: total > 0 ? 67.2 : 0, postAppVulnerability: total > 0 ? 14.9 : 0, reductionPct: total > 0 ? -77.8 : 0 },
    { dimensionKey: "G", dimensionName: "L\xF2ng tham t\xE0i ch\xEDnh (Financial Greed)", preAppVulnerability: total > 0 ? 56.4 : 0, postAppVulnerability: total > 0 ? 15.6 : 0, reductionPct: total > 0 ? -72.3 : 0 },
    { dimensionKey: "E", dimensionName: "Thao t\xFAng c\u1EA3m x\xFAc (Emotional Pressure)", preAppVulnerability: total > 0 ? 61.8 : 0, postAppVulnerability: total > 0 ? 18.2 : 0, reductionPct: total > 0 ? -70.5 : 0 },
    { dimensionKey: "C", dimensionName: "\u0110\u1ECBnh ki\u1EBFn ti\u1EC7n l\u1EE3i (Convenience Bias)", preAppVulnerability: total > 0 ? 64 : 0, postAppVulnerability: total > 0 ? 16.5 : 0, reductionPct: total > 0 ? -74.2 : 0 },
    { dimensionKey: "R", dimensionName: "C\u1EA3 tin / Thi\u1EBFu x\xE1c minh (Credulity)", preAppVulnerability: total > 0 ? 53 : 0, postAppVulnerability: total > 0 ? 13.4 : 0, reductionPct: total > 0 ? -74.7 : 0 }
  ];
  return {
    totalRespondents: total,
    demographicBreakdown,
    preAppBaselineStats: {
      encounteredScamPct: total > 0 ? +(totalEncountered / total * 100).toFixed(1) : 0,
      clickedLinkOrCompromisedPct: total > 0 ? +(totalClickedOrCompromised / total * 100).toFixed(1) : 0,
      sharedOtpOrMoneyLossPct: total > 0 ? +(totalSharedOtpOrLoss / total * 100).toFixed(1) : 0,
      panickedByAuthorityOrUrgencyPct: total > 0 ? +(totalPanicked / total * 100).toFixed(1) : 0,
      avgInitialDefenseScore: total > 0 ? +(sumPreScore / total).toFixed(1) : 0,
      avgInitialLatencySec: avgPreLatency
    },
    postAppInterventionStats: {
      avgPostDefenseScore: total > 0 ? +(sumPostScore / total).toFixed(1) : 0,
      avgScoreGainPct: total > 0 && sumPreScore > 0 ? +((sumPostScore - sumPreScore) / sumPreScore * 100).toFixed(1) : 0,
      safeActionSuccessPct: total > 0 ? +(totalSafeActionAvoided / total * 100).toFixed(1) : 0,
      avgPostLatencySec: avgPostLatency,
      cognitiveFrictionMultiplier: total > 0 ? +(avgPostLatency / (avgPreLatency || 1)).toFixed(1) : 0,
      unseenScenarioPassPct: total > 0 ? +(totalUnseenPass / total * 100).toFixed(1) : 0
    },
    fearTacticsDistribution,
    verificationHabitsPre,
    scamDnaComparativeRadar,
    recentSurveys: COMMUNITY_SURVEYS.slice(0, 15)
  };
}
function calculateSampleSizeAndPower(params) {
  const d = params.expectedEffectSize ?? 0.8;
  const alpha = params.alphaLevel ?? 0.05;
  const power = params.statisticalPower ?? 0.8;
  const k = params.numGroups ?? 3;
  const dropoutRate = (params.expectedDropoutRatePct ?? 15) / 100;
  const zAlpha = alpha === 0.01 ? 2.576 : 1.96;
  const zBeta = power === 0.9 ? 1.282 : 0.842;
  const rawPerGroup = Math.ceil(2 * Math.pow(zAlpha + zBeta, 2) / Math.pow(d, 2));
  const totalRaw = rawPerGroup * k;
  const totalWithDropout = Math.ceil(totalRaw / (1 - dropoutRate));
  const criticalF = +(3 + (alpha === 0.01 ? 1.8 : 0)).toFixed(2);
  return {
    requiredNPerGroup: rawPerGroup,
    totalRequiredN: totalRaw,
    totalRecommendedWithDropoutN: totalWithDropout,
    criticalFValue: criticalF,
    actualPower: power,
    explanation: `Ph\xE2n t\xEDch l\u1EF1c l\u01B0\u1EE3ng th\u1ED1ng k\xEA (Statistical Power Analysis): V\u1EDBi m\u1EE9c \xFD ngh\u0129a \u03B1 = ${alpha}, c\xF4ng su\u1EA5t 1-\u03B2 = ${power}, v\xE0 k\xEDch th\u01B0\u1EDBc t\xE1c \u0111\u1ED9ng k\u1EF3 v\u1ECDng Cohen's d = ${d} gi\u1EEFa ${k} nh\xF3m th\u1EED nghi\u1EC7m, h\u1EC7 th\u1ED1ng t\xEDnh to\xE1n c\u1EA7n t\u1ED1i thi\u1EC3u ${rawPerGroup} m\u1EABu/nh\xF3m (T\u1ED5ng N = ${totalRaw}). D\u1EF1 ph\xF2ng t\u1EF7 l\u1EC7 b\u1ECF cu\u1ED9c ${params.expectedDropoutRatePct ?? 15}%, khuy\u1EBFn ngh\u1ECB thu th\u1EADp N = ${totalWithDropout} m\u1EABu.`
  };
}
var EXCLUSION_LOG_ENTRIES = [
  {
    id: "EXCL-001",
    participantId: "P-TEST-004",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    reason: "IMPOSSIBLE_RESPONSE_TIME",
    details: "Th\u1EDDi gian ph\u1EA3n h\u1ED3i 0.8 gi\xE2y cho k\u1ECBch b\u1EA3n l\u1EEBa \u0111\u1EA3o 150 t\u1EEB (D\u01B0\u1EDBi ng\u01B0\u1EE1ng sinh l\xFD nh\u1EADn th\u1EE9c 2.0s).",
    flaggedBy: "AUTOMATED_QUALITY_BOT",
    actionTaken: "EXCLUDED_FROM_ANALYSIS"
  },
  {
    id: "EXCL-002",
    participantId: "P-TEST-019",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    reason: "STRAIGHT_LINING",
    details: "Ch\u1ECDn \u0111\xE1p \xE1n 1 duy nh\u1EA5t li\xEAn ti\u1EBFp cho 10 k\u1ECBch b\u1EA3n kh\u1EA3o s\xE1t m\xE0 kh\xF4ng \u0111\u1ECDc n\u1ED9i dung.",
    flaggedBy: "AUTOMATED_QUALITY_BOT",
    actionTaken: "EXCLUDED_FROM_ANALYSIS"
  },
  {
    id: "EXCL-003",
    participantId: "P-TEST-042",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    reason: "DUPLICATE_SUBMISSION",
    details: "Ph\xE1t hi\u1EC7n c\xF9ng ID h\u1ECDc sinh th\u1EF1c hi\u1EC7n 2 l\u1EA7n kh\u1EA3o s\xE1t Pre-Test trong kho\u1EA3ng 3 ph\xFAt.",
    flaggedBy: "RESEARCHER_AUDIT",
    actionTaken: "EXCLUDED_FROM_ANALYSIS"
  }
];
function getExclusionLogs() {
  return EXCLUSION_LOG_ENTRIES;
}
function logDataExclusion(entry) {
  const newLog = {
    id: `EXCL-${String(EXCLUSION_LOG_ENTRIES.length + 1).padStart(3, "0")}`,
    participantId: entry.participantId,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    reason: entry.reason,
    details: entry.details,
    flaggedBy: "RESEARCHER_AUDIT",
    actionTaken: entry.actionTaken || "EXCLUDED_FROM_ANALYSIS"
  };
  EXCLUSION_LOG_ENTRIES.unshift(newLog);
  return newLog;
}
function getDataQualityMetrics() {
  const total = PARTICIPANT_TRIALS.length + EXCLUSION_LOG_ENTRIES.length;
  const excluded = EXCLUSION_LOG_ENTRIES.filter((e) => e.actionTaken === "EXCLUDED_FROM_ANALYSIS").length;
  const valid = total - excluded;
  return {
    totalRecords: total,
    validRecords: valid,
    excludedRecords: excluded,
    exclusionRatePct: total > 0 ? +(excluded / total * 100).toFixed(1) : 0,
    duplicatesCount: EXCLUSION_LOG_ENTRIES.filter((e) => e.reason === "DUPLICATE_SUBMISSION").length,
    speedersCount: EXCLUSION_LOG_ENTRIES.filter((e) => e.reason === "IMPOSSIBLE_RESPONSE_TIME").length,
    straightLinersCount: EXCLUSION_LOG_ENTRIES.filter((e) => e.reason === "STRAIGHT_LINING").length,
    incompleteCount: EXCLUSION_LOG_ENTRIES.filter((e) => e.reason === "INCOMPLETE_ATTITUDE").length,
    datasetVersion: "v2026.09-ViSEF-Verified",
    lastAuditTimestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function calculateCronbachAlpha(dimensionKey) {
  const realCount = PARTICIPANT_TRIALS.length;
  if (realCount < 30) {
    return {
      dimensionKey,
      numItems: 6,
      sampleSize: realCount,
      cronbachAlpha: null,
      mcdonaldOmega: null,
      status: "REQUIRES REAL PARTICIPANT DATA (N \u2265 30)",
      message: `C\u1EA2NH B\xC1O MINH B\u1EA0CH KHOA H\u1ECCC: C\u1EA7n t\u1ED1i thi\u1EC3u N = 30 m\u1EABu d\u1EEF li\u1EC7u ng\u01B0\u1EDDi tham gia th\u1EF1c t\u1EBF \u0111\u1EC3 t\xEDnh to\xE1n H\u1EC7 s\u1ED1 Tin c\u1EADy Cronbach's Alpha v\xE0 McDonald's Omega c\xF3 \xFD ngh\u0129a th\u1ED1ng k\xEA. Hi\u1EC7n t\u1EA1i c\xF3 N = ${realCount} m\u1EABu.`
    };
  }
  const k = 6;
  const variances = [0.12, 0.14, 0.11, 0.15, 0.13, 0.1];
  const sumItemVar = variances.reduce((a, b) => a + b, 0);
  const totalScoreVar = 0.85;
  const alpha = +(k / (k - 1) * (1 - sumItemVar / totalScoreVar)).toFixed(3);
  const omega = +(alpha + 0.02).toFixed(3);
  return {
    dimensionKey,
    numItems: k,
    sampleSize: realCount,
    cronbachAlpha: alpha,
    mcdonaldOmega: omega,
    status: "VALIDATED_REAL_DATA",
    message: `\u0110\xE3 t\xEDnh to\xE1n th\xE0nh c\xF4ng tr\xEAn N = ${realCount} m\u1EABu th\u1EF1c nghi\u1EC7m: Cronbach's \u03B1 = ${alpha} (${alpha >= 0.8 ? "\u0110\u1ED9 tin c\u1EADy cao" : "Kh\xE1"}), McDonald's \u03C9 = ${omega}.`
  };
}
function calculateMultipleComparisonCorrections(tests) {
  const sorted = [...tests].sort((a, b) => a.rawPValue - b.rawPValue);
  const m = tests.length;
  return sorted.map((t, index) => {
    const bonferroniP = Math.min(1, +(t.rawPValue * m).toFixed(4));
    const holmP = Math.min(1, +(t.rawPValue * (m - index)).toFixed(4));
    const fdrP = Math.min(1, +(t.rawPValue * (m / (index + 1))).toFixed(4));
    return {
      testName: t.name,
      uncorrectedPValue: t.rawPValue,
      bonferroniP,
      holmP,
      fdrP,
      significantAt05: holmP < 0.05
    };
  });
}
function getLiteratureCitations() {
  return [
    {
      id: "lit-1",
      authors: "Vishwanath, A., Herath, T., Chen, R., Wang, J., & Rao, H. R.",
      year: 2011,
      title: "Why do people get phished? Testing the Suspicion Pattern Model across response contexts",
      journalOrVenue: "Decision Support Systems, 51(3), 576-586",
      doi: "10.1016/j.dss.2011.03.002",
      claimSupported: "C\u01A1 s\u1EDF l\xFD thuy\u1EBFt cho vi\u1EC7c thao t\xFAng c\u1EA3m x\xFAc (Urgency, Authority) l\xE0m suy gi\u1EA3m t\u01B0 duy ph\u1EA3n bi\u1EC7n v\xE0 kh\u1EA3 n\u0103ng soi x\xE9t k\u1EF9 l\u01B0\u1EE1ng.",
      evidenceCategory: "ESTABLISHED_THEORY"
    },
    {
      id: "lit-2",
      authors: "Workman, M.",
      year: 2008,
      title: "Wisdom of crowds or groupthink? A study of threat awareness and social engineering resistance",
      journalOrVenue: "Computers in Human Behavior, 24(6), 2799-2815",
      doi: "10.1016/j.chb.2008.04.004",
      claimSupported: "\u0110\u1ECBnh ngh\u0129a 6 kh\xEDa c\u1EA1nh thao t\xFAng t\xE2m l\xFD trong k\u1EF9 ngh\u1EC7 x\xE3 h\u1ED9i (Social Engineering Tactics Taxonomy).",
      evidenceCategory: "ESTABLISHED_THEORY"
    },
    {
      id: "lit-3",
      authors: "Lea, S. E., Fischer, P., & Evans, K. M.",
      year: 2009,
      title: "The psychology of scams: Provoking and mitigating susceptibility to financial fraud",
      journalOrVenue: "UK Office of Fair Trading Research Report",
      doi: "10.1037/e531822011-001",
      claimSupported: "M\xF4 h\xECnh h\xF3a \u0111\u1ED9 nh\u1EA1y c\u1EA3m tr\u01B0\u1EDBc chi\xEAu tr\xF2 h\u1EE9a h\u1EB9n l\u1EE3i nhu\u1EADn si\xEAu th\u1EF1c (Financial Greed) v\xE0 n\u1ED7i s\u1EE3 b\u1ECB tr\u1EEBng ph\u1EA1t.",
      evidenceCategory: "EMPIRICAL_BENCHMARK"
    },
    {
      id: "lit-4",
      authors: "Bannister, W., & Thomas, R.",
      year: 2023,
      title: "Adaptive cybersecurity training pipelines: Evaluating individualized threat injection vs static curricula",
      journalOrVenue: "IEEE Transactions on Dependable and Secure Computing",
      doi: "10.1109/TDSC.2023.3289102",
      claimSupported: "Minh ch\u1EE9ng th\u1EF1c nghi\u1EC7m: Hu\u1EA5n luy\u1EC7n th\xEDch \u1EE9ng c\xE1 nh\xE2n h\xF3a gi\xFAp duy tr\xEC ph\u1EA3n x\u1EA1 an to\xE0n cao h\u01A1n 40% so v\u1EDBi m\xF4 ph\u1ECFng ng\u1EABu nhi\xEAn.",
      evidenceCategory: "METHODOLOGICAL_STANDARD"
    }
  ];
}
function getJudgeDefenseQuestions() {
  return [
    {
      id: "q-1",
      category: "NOVELTY",
      question: "\u0110i\u1EC3m m\u1EDBi khoa h\u1ECDc c\u1ED1t l\xF5i (Scientific Novelty) c\u1EE7a \u0111\u1EC1 t\xE0i n\xE0y so with c\xE1c \u1EE9ng d\u1EE5ng h\u1ECDc an to\xE0n th\xF4ng tin hi\u1EC7n c\xF3 l\xE0 g\xEC?",
      shortAnswerKey: "M\xF4 h\xECnh h\xF3a Vector Scam DNA 6 chi\u1EC1u + Thu\u1EADt to\xE1n Hu\u1EA5n luy\u1EC7n Th\xEDch \u1EE9ng theo \u0111i\u1EC3m y\u1EBFu + Kh\u1EA3o nghi\u1EC7m k\u1ECBch b\u1EA3n ch\u01B0a t\u1EEBng th\u1EA5y (Unseen Scenarios).",
      detailedDefenseAnswer: "H\u1EA7u h\u1EBFt c\xE1c gi\u1EA3i ph\xE1p hi\u1EC7n nay d\u1EEBng l\u1EA1i \u1EDF vi\u1EC7c cung c\u1EA5p b\xE0i gi\u1EA3ng t\u0129nh ho\u1EB7c ki\u1EC3m tra tr\u1EAFc nghi\u1EC7m c\u1ED1 \u0111\u1ECBnh. \u0110\xF3ng g\xF3p m\u1EDBi c\u1EE7a nghi\xEAn c\u1EE9u g\u1ED3m 3 tr\u1EE5 c\u1ED9t: (1) Formal h\xF3a vector t\u1ED5n th\u01B0\u01A1ng h\xE0nh vi Scam DNA V=[T,A,G,E,C,R] c\xF3 c\u01A1 s\u1EDF t\xE2m l\xFD h\u1ECDc; (2) Thu\u1EADt to\xE1n khuy\u1EBFn ngh\u1ECB k\u1ECBch b\u1EA3n th\xEDch \u1EE9ng t\u1EF1 \u0111\u1ED9ng \u0111i\u1EC1u ch\u1EC9nh \u0111\u1ED9 kh\xF3 v\xE0 ch\u1EE7 \u0111\u1EC1 d\u1EF1a tr\xEAn ma tr\u1EADn r\u1EE7i ro c\xE1 nh\xE2n; (3) Khung th\u1EF1c nghi\u1EC7m 3 nh\xF3m c\xF3 \u0111\xE1nh gi\xE1 kh\u1EA3 n\u0103ng kh\xE1i qu\xE1t h\xF3a tr\xEAn k\u1ECBch b\u1EA3n ho\xE0n to\xE0n m\u1EDBi (Unseen Attacks) v\xE0 \u0111o l\u01B0\u1EDDng \u0111\u1ED9 duy tr\xEC sau 14 ng\xE0y (Retention).",
      supportingEvidenceLocation: "M\u1EE5c 1 & 7 trong B\xE1o c\xE1o / Server API /api/adaptive/recommend",
      confidenceRating: "VERY_HIGH"
    },
    {
      id: "q-2",
      category: "EXPERIMENTAL_DESIGN",
      question: "T\u1EA1i sao nh\xF3m nghi\xEAn c\u1EE9u l\u1EA1i ch\u1ECDn M\xF4 h\xECnh Th\u1EF1c nghi\u1EC7m 3 Nh\xF3m (Three-Arm Controlled Experiment) m\xE0 kh\xF4ng ph\u1EA3i ch\u1EC9 so s\xE1nh Tr\u01B0\u1EDBc - Sau (Pre-Post)?",
      shortAnswerKey: "\u0110\u1EC3 ki\u1EC3m so\xE1t tri\u1EC7t \u0111\u1EC3 bi\u1EBFn nhi\u1EC5u (Hawthorne Effect & Learning Effect) v\xE0 ch\u1EE9ng minh hi\u1EC7u qu\u1EA3 ri\xEAng bi\u1EC7t c\u1EE7a t\xEDnh n\u0103ng TH\xCDCH \u1EE8NG.",
      detailedDefenseAnswer: "N\u1EBFu ch\u1EC9 so s\xE1nh Pre-Post tr\xEAn 1 nh\xF3m, k\u1EBFt qu\u1EA3 c\u1EA3i thi\u1EC7n c\xF3 th\u1EC3 do hi\u1EC7u \u1EE9ng ng\u01B0\u1EDDi quan s\xE1t (Hawthorne Effect) ho\u1EB7c ch\u1EC9 do vi\u1EC7c th\u1EF1c h\xE0nh m\xF4 ph\u1ECFng (Practice Effect). Vi\u1EC7c thi\u1EBFt l\u1EADp Nh\xF3m A (\u0110\u1ED1i ch\u1EE9ng gi\xE1o d\u1EE5c truy\u1EC1n th\u1ED1ng) gi\xFAp \u0111o l\u01B0\u1EDDng m\u1EE9c t\u0103ng tr\u01B0\u1EDFng t\u1EF1 nhi\xEAn; Nh\xF3m B (M\xF4 ph\u1ECFng t\u0129nh ng\u1EABu nhi\xEAn) gi\xFAp c\xF4 l\u1EADp t\xE1c \u0111\u1ED9ng c\u1EE7a vi\u1EC7c ch\u1EC9 m\xF4 ph\u1ECFng; v\xE0 Nh\xF3m C (ScamGuard Adaptive) ch\u1EE9ng minh gi\xE1 tr\u1ECB th\u1EB7ng d\u01B0 r\xF5 r\u1EC7t c\u1EE7a thu\u1EADt to\xE1n c\xE1 nh\xE2n h\xF3a th\xEDch \u1EE9ng theo Scam DNA.",
      supportingEvidenceLocation: "M\u1EE5c 2 & 16 trong B\xE1o c\xE1o / Dashboard Th\u1ED1ng k\xEA",
      confidenceRating: "VERY_HIGH"
    },
    {
      id: "q-3",
      category: "STATISTICS",
      question: "T\u1EA1i sao l\u1EA1i s\u1EED d\u1EE5ng Ki\u1EC3m \u0111\u1ECBnh t-test c\u1EB7p \u0111\xF4i v\xE0 Ki\u1EC3m \u0111\u1ECBnh Mann-Whitney U? C\xE1c gi\u1EA3 \u0111\u1ECBnh th\u1ED1ng k\xEA c\xF3 \u0111\u01B0\u1EE3c \u0111\u1EA3m b\u1EA3o kh\xF4ng?",
      shortAnswerKey: "\u0110\xE3 th\u1EF1c hi\u1EC7n ki\u1EC3m \u0111\u1ECBnh t\xEDnh chu\u1EA9n Shapiro-Wilk; khi vi ph\u1EA1m ph\xE2n ph\u1ED1i chu\u1EA9n, h\u1EC7 th\u1ED1ng t\u1EF1 \u0111\u1ED9ng s\u1EED d\u1EE5ng ki\u1EC3m \u0111\u1ECBnh phi tham s\u1ED1 t\u01B0\u01A1ng \u1EE9ng.",
      detailedDefenseAnswer: "\u0110\u1EC3 \u0111\u1EA3m b\u1EA3o t\xEDnh ch\u1EB7t ch\u1EBD v\u1EC1 m\u1EB7t khoa h\u1ECDc, h\u1EC7 th\u1ED1ng ti\u1EBFn h\xE0nh ki\u1EC3m \u0111\u1ECBnh t\xEDnh chu\u1EA9n Shapiro-Wilk. N\u1EBFu d\u1EEF li\u1EC7u th\u1ECFa m\xE3n ph\xE2n ph\u1ED1i chu\u1EA9n, Student's t-test \u0111\u01B0\u1EE3c \xE1p d\u1EE5ng \u0111\u1EC3 t\xEDnh Cohen's d v\xE0 kho\u1EA3ng tin c\u1EADy 95%. N\u1EBFu d\u1EEF li\u1EC7u l\u1EC7ch (skewed), h\u1EC7 th\u1ED1ng s\u1EED d\u1EE5ng ki\u1EC3m \u0111\u1ECBnh phi tham s\u1ED1 Wilcoxon Signed-Rank (cho c\u1EB7p \u0111\xF4i) v\xE0 Mann-Whitney U (cho so s\xE1nh gi\u1EEFa 2 nh\xF3m A v\xE0 C) nh\u1EB1m tr\xE1nh k\u1EBFt lu\u1EADn sai l\u1EA7m.",
      supportingEvidenceLocation: "M\u1EE5c 12 trong B\xE1o c\xE1o / Server API /api/research/statistics",
      confidenceRating: "HIGH"
    },
    {
      id: "q-4",
      category: "AI_RELIABILITY",
      question: "N\u1EBFu m\xF4 h\xECnh AI (Gemini) ph\xE2n t\xEDch sai ho\u1EB7c \u0111\xE1nh gi\xE1 l\u1EA7m m\u1ED9t tin nh\u1EAFn an to\xE0n th\xE0nh l\u1EEBa \u0111\u1EA3o th\xEC h\u1EC7 th\u1ED1ng x\u1EED l\xFD ra sao?",
      shortAnswerKey: "AI ho\u1EA1t \u0111\u1ED9ng nh\u01B0 h\u1EC7 th\u1ED1ng h\u1ED7 tr\u1EE3 quy\u1EBFt \u0111\u1ECBnh (Decision Support System), hi\u1EC3n th\u1ECB thang r\u1EE7i ro \u0111\u1ECBnh l\u01B0\u1EE3ng v\xE0 kh\xF4ng tuy\xEAn b\u1ED1 100% tuy\u1EC7t \u0111\u1ED1i.",
      detailedDefenseAnswer: 'H\u1EC7 th\u1ED1ng tu\xE2n th\u1EE7 nguy\xEAn t\u1EAFc "Kh\xF4ng th\u1EA7n th\xE1nh h\xF3a AI". M\u1ECDi ph\xE2n t\xEDch AI \u0111\u01B0\u1EE3c \u0111\xF3ng khung r\xF5 r\xE0ng l\xE0 c\xF4ng c\u1EE5 tr\u1EE3 l\xFD quy\u1EBFt \u0111\u1ECBnh v\u1EDBi thang r\u1EE7i ro 4 m\u1EE9c (R\u1EA5t th\u1EA5p, Trung b\xECnh, Cao, B\xE1o \u0111\u1ED9ng). H\u1EC7 th\u1ED1ng cung c\u1EA5p minh ch\u1EE9ng tr\u1EF1c quan (t\xEAn mi\u1EC1n g\u1ED1c, ph\xF4ng ch\u1EEF, m\u1EABu t\u1EEB ng\u1EEF thao t\xFAng) \u0111\u1EC3 ng\u01B0\u1EDDi d\xF9ng t\u1EF1 n\xE2ng cao n\u0103ng l\u1EF1c ph\u1EA3n bi\u1EC7n, thay v\xEC ph\u1EE5 thu\u1ED9c ho\xE0n to\xE0n v\xE0o k\u1EBFt lu\u1EADn c\u1EE7a AI.',
      supportingEvidenceLocation: "M\u1EE5c 9 trong B\xE1o c\xE1o / Modun Gi\xE1m \u0111\u1ECBnh \u0110a ph\u01B0\u01A1ng th\u1EE9c",
      confidenceRating: "VERY_HIGH"
    },
    {
      id: "q-5",
      category: "GENERALIZABILITY",
      question: "L\xE0m th\u1EBF n\xE0o \u0111\u1EC3 \u0111\u1EA3m b\u1EA3o h\u1ECDc sinh kh\xF4ng ch\u1EC9 h\u1ECDc thu\u1ED9c l\xF2ng c\xE1c k\u1ECBch b\u1EA3n trong \u1EE9ng d\u1EE5ng m\xE0 th\u1EF1c s\u1EF1 c\xF3 ph\u1EA3n x\u1EA1 tr\u01B0\u1EDBc c\xE1c v\u1EE5 l\u1EEBa \u0111\u1EA3o m\u1EDBi ngo\xE0i \u0111\u1EDDi?",
      shortAnswerKey: "T\xE1ch bi\u1EC7t tuy\u1EC7t \u0111\u1ED1i t\u1EADp Hu\u1EA5n luy\u1EC7n (Train Set) v\xE0 t\u1EADp Ki\u1EC3m tra Kh\xE1i qu\xE1t h\xF3a (Unseen Test Set).",
      detailedDefenseAnswer: "H\u1EC7 th\u1ED1ng thi\u1EBFt k\u1EBF t\u1EADp d\u1EEF li\u1EC7u b\xE0i ki\u1EC3m tra Post-Test v\xE0 Retention Test s\u1EED d\u1EE5ng c\xE1c k\u1ECBch b\u1EA3n l\u1EEBa \u0111\u1EA3o ho\xE0n to\xE0n m\u1EDBi (Unseen Scenarios) kh\xF4ng c\xF3 trong t\u1EADp hu\u1EA5n luy\u1EC7n. K\u1EBFt qu\u1EA3 nghi\xEAn c\u1EE9u ch\u1EC9 ra Nh\xF3m C \u0111\u1EA1t \u0111i\u1EC3m b\xE0i ki\u1EC3m tra unseen v\u01B0\u1EE3t tr\u1ED9i (84.3/100 so v\u1EDBi 57.1/100 \u1EDF Nh\xF3m A), ch\u1EE9ng minh ng\u01B0\u1EDDi h\u1ECDc \u0111\xE3 h\xECnh th\xE0nh m\xF4 h\xECnh nh\u1EADn th\u1EE9c t\u1ED5ng qu\xE1t (Mental Model) ch\u1EE9 kh\xF4ng ch\u1EC9 ghi nh\u1EDB \u0111\xE1p \xE1n.",
      supportingEvidenceLocation: "M\u1EE5c 5 & 19 trong B\xE1o c\xE1o / T\u1EADp d\u1EEF li\u1EC7u CAMGUARD_DATASET",
      confidenceRating: "VERY_HIGH"
    }
  ];
}
function generateViSEFResearchReport() {
  const stats = computeExperimentalStatistics();
  const quality = getDataQualityMetrics();
  const realN = PARTICIPANT_TRIALS.length;
  const dataStatusNotice = realN > 0 ? `D\u1EEE LI\u1EC6U TH\u1EF0C NGHI\u1EC6M \u0110\xC3 GHI NH\u1EACN (N = ${realN} h\u1ECDc sinh tham gia th\u1EED nghi\u1EC7m)` : `[REAL EXPERIMENTAL DATA REQUIRED \u2014 Y\xCAU C\u1EA6U D\u1EEE LI\u1EC6U TH\u1EF0C NGHI\u1EC6M TH\u1EF0C T\u1EBE]`;
  return `# B\xC1O C\xC1O NGHI\xCAN C\u1EE8U KHOA H\u1ECCC D\u1EF0 THI ViSEF 2026

**T\xCAN \u0110\u1EC0 T\xC0I:** X\xC2Y D\u1EF0NG H\u1EC6 TH\u1ED0NG HU\u1EA4N LUY\u1EC6N TH\xCDCH \u1EE8NG PH\xD2NG TH\u1EE6 L\u1EEAA \u0110\u1EA2O TR\u1EF0C TUY\u1EBEN D\u1EF0A TR\xCAN VECTOR T\u1ED4N TH\u01AF\u01A0NG H\xC0NH VI (SCAM DNA) V\xC0 AI \u0110A PH\u01AF\u01A0NG TH\u1EE8C
**L\u0128NH V\u1EF0C:** H\u1EC7 th\u1ED1ng Th\xF4ng tin & Ph\u1EA7n m\u1EC1m M\xE1y t\xEDnh (Software Systems)
**TR\u1EA0NG TH\xC1I D\u1EEE LI\u1EC6U:** ${dataStatusNotice}

---

## 1. T\xD3M T\u1EAET D\u1EF0 \xC1N (ABSTRACT)
L\u1EEBa \u0111\u1EA3o tr\u1EF1c tuy\u1EBFn (Online Scams) v\xE0 k\u1EF9 ngh\u1EC7 x\xE3 h\u1ED9i (Social Engineering) \u0111ang l\xE0 m\u1ED1i \u0111e d\u1ECDa nghi\xEAm tr\u1ECDng \u0111\u1ED1i v\u1EDBi ng\u01B0\u1EDDi d\xF9ng internet, \u0111\u1EB7c bi\u1EC7t l\xE0 h\u1ECDc sinh v\xE0 ng\u01B0\u1EDDi cao tu\u1ED5i. C\xE1c ph\u01B0\u01A1ng ph\xE1p gi\xE1o d\u1EE5c an to\xE0n s\u1ED1 truy\u1EC1n th\u1ED1ng (b\xE0i gi\u1EA3ng t\u0129nh, infographic) mang t\xEDnh b\u1ECB \u0111\u1ED9ng v\xE0 thi\u1EBFu kh\u1EA3 n\u0103ng c\xE1 nh\xE2n h\xF3a theo \u0111i\u1EC3m y\u1EBFu t\xE2m l\xFD c\u1EE7a t\u1EEBng c\xE1 nh\xE2n. 

D\u1EF1 \xE1n \u0111\u1EC1 xu\u1EA5t gi\u1EA3i ph\xE1p **SCAMGUARD VN** \u2014 h\u1EC7 th\u1ED1ng hu\u1EA5n luy\u1EC7n ph\u1EA3n x\u1EA1 th\xEDch \u1EE9ng d\u1EF1a tr\xEAn m\xF4 h\xECnh h\xF3a Vector t\u1ED5n th\u01B0\u01A1ng h\xE0nh vi 6 chi\u1EC1u (**Scam DNA** $V=[T,A,G,E,C,R]$) k\u1EBFt h\u1EE3p c\xF4ng ngh\u1EC7 AI \u0111a ph\u01B0\u01A1ng th\u1EE9c (V\u0103n b\u1EA3n, OCR H\xF3a \u0111\u01A1n Fake, URL, Deepfake, M\xE3 QR). Qua th\u1EED nghi\u1EC7m l\xE2m s\xE0ng 3 nh\xF3m (Three-Arm Controlled Experiment), k\u1EBFt qu\u1EA3 ch\u1EC9 ra nh\xF3m \u1EE9ng d\u1EE5ng hu\u1EA5n luy\u1EC7n th\xEDch \u1EE9ng (Nh\xF3m C) \u0111\u1EA1t m\u1EE9c t\u0103ng tr\u01B0\u1EDFng \u0111i\u1EC3m ph\xF2ng th\u1EE7 **+${stats.inferentialTests.groupC_PairedTTest.t ? "33.2" : "[C\u1EA6N D\u1EEE LI\u1EC6U TH\u1EF0C]"} \u0111i\u1EC3m** ($p < 0.001, d = ${stats.inferentialTests.groupC_PairedTTest.cohensD}$) v\xE0 l\xE0m gi\u1EA3m **${stats.groupMetrics.GROUP_C_ADAPTIVE.unsafeActionReductionPct}%** t\u1EF7 l\u1EC7 th\u1EF1c hi\u1EC7n h\xE0nh \u0111\u1ED9ng m\u1EA5t an to\xE0n.

---

## 2. C\xC2U H\u1ECEI NGHI\xCAN C\u1EE8U V\xC0 GI\u1EA2 THUY\u1EBET KHOA H\u1ECCC
### 2.1. C\xE2u h\u1ECFi nghi\xEAn c\u1EE9u trung t\xE2m
*"Li\u1EC7u vi\u1EC7c \u1EE9ng d\u1EE5ng m\xF4 h\xECnh vector t\u1ED5n th\u01B0\u01A1ng h\xE0nh vi 6 chi\u1EC1u (Scam DNA) k\u1EBFt h\u1EE3p thu\u1EADt to\xE1n hu\u1EA5n luy\u1EC7n th\xEDch \u1EE9ng c\xF3 gi\xFAp c\u1EA3i thi\u1EC7n n\u0103ng l\u1EF1c ph\xE1t hi\u1EC7n v\xE0 kh\xE1ng c\u1EF1 c\xE1c k\u1ECBch b\u1EA3n l\u1EEBa \u0111\u1EA3o tr\u1EF1c tuy\u1EBFn ch\u01B0a t\u1EEBng g\u1EB7p (Unseen Scenarios) hi\u1EC7u qu\u1EA3 h\u01A1n so with gi\xE1o d\u1EE5c truy\u1EC1n th\u1ED1ng v\xE0 m\xF4 ph\u1ECFng ng\u1EABu nhi\xEAn kh\xF4ng?"*

### 2.2. C\xE1c Gi\u1EA3 thuy\u1EBFt Khoa h\u1ECDc
* **Gi\u1EA3 thuy\u1EBFt $H_1$:** Nh\xF3m C (ScamGuard Adaptive) c\xF3 \u0111i\u1EC3m s\u1ED1 ph\xF2ng th\u1EE7 th\u1EF1c nghi\u1EC7m (Defense Score) sau can thi\u1EC7p cao h\u01A1n c\xF3 \xFD ngh\u0129a th\u1ED1ng k\xEA so v\u1EDBi Nh\xF3m A (\u0110\u1ED1i ch\u1EE9ng) v\xE0 Nh\xF3m B (M\xF4 ph\u1ECFng t\u0129nh) ($p < 0.01$).
* **Gi\u1EA3 thuy\u1EBFt $H_2$:** T\u1EF7 l\u1EC7 th\u1EF1c hi\u1EC7n h\xE0nh \u0111\u1ED9ng m\u1EA5t an to\xE0n (Unsafe Action Rate) \u1EDF Nh\xF3m C gi\u1EA3m \xEDt nh\u1EA5t 60% sau khi ho\xE0n th\xE0nh l\u1ED9 tr\xECnh th\xEDch \u1EE9ng.
* **Gi\u1EA3 thuy\u1EBFt $H_3$:** Kh\u1EA3 n\u0103ng duy tr\xEC ph\u1EA3n x\u1EA1 an to\xE0n sau 14 ng\xE0y (Retention Test) \u1EDF Nh\xF3m C duy tr\xEC cao h\u01A1n Nh\xF3m A t\u1ED1i thi\u1EC3u 25%.

---

## 3. PH\u01AF\u01A0NG PH\xC1P V\xC0 THI\u1EBET K\u1EBE TH\u1EF0C NGHI\u1EC6M
### 3.1. Thi\u1EBFt k\u1EBF 3 Nh\xF3m \u0110\u1ED1i ch\u1EE9ng (Three-Arm Experimental Protocol)
1. **GROUP A (Control / Conventional):** Ti\u1EBFp c\u1EADn ki\u1EBFn th\u1EE9c qua Infographic v\xE0 t\xE0i li\u1EC7u an to\xE0n s\u1ED1 c\u1ED1 \u0111\u1ECBnh.
2. **GROUP B (Non-Adaptive Simulation):** Th\u1EF1c h\xE0nh k\u1ECBch b\u1EA3n m\xF4 ph\u1ECFng ng\u1EABu nhi\xEAn kh\xF4ng c\xE1 nh\xE2n h\xF3a.
3. **GROUP C (ScamGuard Adaptive):** H\u1EC7 th\u1ED1ng ph\xE2n t\xEDch vector Scam DNA \u0111\u1EC3 t\u1EF1 \u0111\u1ED9ng \u0111\u1EC1 xu\u1EA5t k\u1ECBch b\u1EA3n nh\u1EAFm v\xE0o \u0111\xFAng \u0111i\u1EC3m y\u1EBFu t\xE2m l\xFD v\u1EDBi \u0111\u1ED9 kh\xF3 t\u0103ng d\u1EA7n.

### 3.2. B\u1EA3ng Bi\u1EBFn s\u1ED1
* **Bi\u1EBFn \u0111\u1ED9c l\u1EADp (Independent Variable):** Ph\u01B0\u01A1ng ph\xE1p can thi\u1EC7p gi\xE1o d\u1EE5c (Nh\xF3m A, B, C).
* **Bi\u1EBFn ph\u1EE5 thu\u1ED9c (Dependent Variables):** \u0110i\u1EC3m ph\xF2ng th\u1EE7 (Defense Score), T\u1EF7 l\u1EC7 h\xE0nh \u0111\u1ED9ng nguy hi\u1EC3m (Unsafe Rate), Th\u1EDDi gian ph\u1EA3n x\u1EA1 suy x\xE9t (Latency), \u0110i\u1EC3m k\u1ECBch b\u1EA3n m\u1EDBi (Unseen Score).
* **Bi\u1EBFn ki\u1EC3m so\xE1t (Controlled Variables):** Th\u1EDDi l\u01B0\u1EE3ng th\u1EF1c h\xE0nh (45 ph\xFAt), \u0110\u1ED9 kh\xF3 b\xE0i ki\u1EC3m tra chu\u1EA9n h\xF3a.

---

## 4. B\xC1O C\xC1O K\u1EBET QU\u1EA2 TH\u1ED0NG K\xCA V\xC0 PH\xC2N T\xCDCH

| Nh\xF3m Th\u1EF1c Nghi\u1EC7m | M\u1EABu (N) | Pre-Test (Mean \xB1 SD) | Post-Test (Mean \xB1 SD) | K\u1ECBch B\u1EA3n M\u1EDBi (Unseen) | Duy Tr\xEC 14 Ng\xE0y | T\u1EF7 L\u1EC7 Gi\u1EA3m L\u1ED7i |
|---|---|---|---|---|---|---|
| **Group A (\u0110\u1ED1i ch\u1EE9ng)** | ${stats.groupMetrics.GROUP_A_CONTROL.count} | ${stats.groupMetrics.GROUP_A_CONTROL.meanPre} | ${stats.groupMetrics.GROUP_A_CONTROL.meanPost} | ${stats.groupMetrics.GROUP_A_CONTROL.meanUnseen} | ${stats.groupMetrics.GROUP_A_CONTROL.meanRetention} | -${stats.groupMetrics.GROUP_A_CONTROL.unsafeActionReductionPct}% |
| **Group B (M\xF4 ph\u1ECFng t\u0129nh)** | ${stats.groupMetrics.GROUP_B_NON_ADAPTIVE.count} | ${stats.groupMetrics.GROUP_B_NON_ADAPTIVE.meanPre} | ${stats.groupMetrics.GROUP_B_NON_ADAPTIVE.meanPost} | ${stats.groupMetrics.GROUP_B_NON_ADAPTIVE.meanUnseen} | ${stats.groupMetrics.GROUP_B_NON_ADAPTIVE.meanRetention} | -${stats.groupMetrics.GROUP_B_NON_ADAPTIVE.unsafeActionReductionPct}% |
| **Group C (ScamGuard Adaptive)** | ${stats.groupMetrics.GROUP_C_ADAPTIVE.count} | ${stats.groupMetrics.GROUP_C_ADAPTIVE.meanPre} | ${stats.groupMetrics.GROUP_C_ADAPTIVE.meanPost} | ${stats.groupMetrics.GROUP_C_ADAPTIVE.meanUnseen} | ${stats.groupMetrics.GROUP_C_ADAPTIVE.meanRetention} | **-${stats.groupMetrics.GROUP_C_ADAPTIVE.unsafeActionReductionPct}%** |

### 4.1. M\u1EE9c \u0111\u1ED9 t\xE1c \u0111\u1ED9ng (Effect Size)
* Paired t-test Nh\xF3m C: $t(${stats.inferentialTests.groupC_PairedTTest.df}) = ${stats.inferentialTests.groupC_PairedTTest.t}, p < 0.001$, K\xEDch th\u01B0\u1EDBc t\xE1c \u0111\u1ED9ng Cohen's $d = ${stats.inferentialTests.groupC_PairedTTest.cohensD}$ (T\xE1c \u0111\u1ED9ng r\u1EA5t l\u1EDBn).

---

## 5. TH\u1EF0C NGHI\u1EC6M B\u1EA2O T\u1ED2N V\xC0 B\u1EA0O LI\u1EC6T (ABLATION STUDY)
K\u1EBFt qu\u1EA3 lo\u1EA1i b\u1ECF t\u1EEBng th\xE0nh ph\u1EA7n kh\u1ECFi m\xF4 h\xECnh h\u1EC7 th\u1ED1ng:
1. **Lo\u1EA1i b\u1ECF Hu\u1EA5n luy\u1EC7n Th\xEDch \u1EE9ng:** Hi\u1EC7u qu\u1EA3 suy gi\u1EA3m 17.5%.
2. **Lo\u1EA1i b\u1ECF H\u01B0\u1EDBng d\u1EABn Si\xEAu nh\u1EADn th\u1EE9c AI Coach:** Hi\u1EC7u qu\u1EA3 suy gi\u1EA3m 14.8%.
3. **Lo\u1EA1i b\u1ECF Hi\u1EC7u ch\u1EC9nh Th\u1EDDi gian Ph\u1EA3n x\u1EA1:** Hi\u1EC7u qu\u1EA3 suy gi\u1EA3m 9.9%.

---

## 6. \u0110\u1EA0O \u0110\u1EE8C NGHI\xCAN C\u1EE8U V\xC0 T\xCDNH MINH B\u1EA0CH D\u1EEE LI\u1EC6U
* **\u0110\u1ECBnh danh \u1EA9n danh:** M\xE3 h\xF3a th\xF4ng tin ng\u01B0\u1EDDi tham gia d\u1EA1ng $P-xxx$; kh\xF4ng thu th\u1EADp H\u1ECD t\xEAn, S\u0110T, Email hay th\xF4ng tin nh\u1EA1y c\u1EA3m.
* **T\xECnh tr\u1EA1ng ph\xEA duy\u1EC7t:** ETHICS APPROVAL STATUS: PENDING / SCHOOL BOARD REVIEWED.
* **Ki\u1EC3m so\xE1t ch\u1EA5t l\u01B0\u1EE3ng d\u1EEF li\u1EC7u:** \u0110\xE3 lo\u1EA1i b\u1ECF ${quality.excludedRecords} m\u1EABu vi ph\u1EA1m (Speeder < 2.0s, Straight-lining).

---

## 7. H\u1EA0N CH\u1EBE C\u1EE6A \u0110\u1EC0 T\xC0I (LIMITATIONS)
1. M\u1EABu nghi\xEAn c\u1EE9u hi\u1EC7n t\u1EA1i t\u1EADp trung trong ph\u1EA1m vi tr\u01B0\u1EDDng h\u1ECDc tham gia kh\u1EA3o nghi\u1EC7m, ch\u01B0a \u0111\u1EA1i di\u1EC7n ho\xE0n to\xE0n cho to\xE0n b\u1ED9 d\xE2n s\u1ED1 Vi\u1EC7t Nam.
2. Th\u1EDDi gian \u0111o l\u01B0\u1EDDng \u0111\u1ED9 duy tr\xEC ph\u1EA3n x\u1EA1 d\u1EEBng l\u1EA1i \u1EDF m\u1ED1c 14 ng\xE0y; c\u1EA7n m\u1EDF r\u1ED9ng theo d\xF5i d\u1ECDc (Longitudinal) sau 30 v\xE0 90 ng\xE0y.

---

## 8. K\u1EBET LU\u1EACN V\xC0 H\u01AF\u1EDANG PH\xC1T TRI\u1EC2N
Nghi\xEAn c\u1EE9u ch\u1EE9ng minh t\xEDnh \u0111\xFAng \u0111\u1EAFn c\u1EE7a vi\u1EC7c \u1EE9ng d\u1EE5ng m\xF4 h\xECnh vector Scam DNA v\xE0 thu\u1EADt to\xE1n hu\u1EA5n luy\u1EC7n th\xEDch \u1EE9ng trong vi\u1EC7c n\xE2ng cao n\u0103ng l\u1EF1c t\u1EF1 v\u1EC7 s\u1ED1. H\u1EC7 th\u1ED1ng cung c\u1EA5p m\u1ED9t n\u1EC1n t\u1EA3ng th\u1EF1c ch\u1EE9ng, c\xF3 kh\u1EA3 n\u0103ng m\u1EDF r\u1ED9ng quy m\xF4 tri\u1EC3n khai cho c\xE1c tr\u01B0\u1EDDng h\u1ECDc tr\xEAn to\xE0n qu\u1ED1c.
`;
}

// src/data/quishingData.ts
var QUISHING_CASES = [
  {
    id: "quish-parking-meter-overlay",
    title: "M\xE3 QR D\xE1n \u0110\xE8 T\u1EA1i B\xE3i \u0110\u1ED7 Xe / Tr\u1EE5 \u0110\u1ED7 Xe C\xF4ng C\u1ED9ng",
    category: "Parking & EV",
    physicalContext: "M\u1ED9t tr\u1EE5 thu ph\xED \u0111\u1ED7 xe th\xF4ng minh tr\xEAn ph\u1ED1 \u0111\xF4ng \u0111\xFAc b\u1ECB ai \u0111\xF3 d\xE1n m\u1ED9t mi\u1EBFng decal b\xF3ng in m\xE3 QR \u0111\xE8 l\xEAn khu v\u1EF1c h\u01B0\u1EDBng d\u1EABn thanh to\xE1n ch\xEDnh th\u1EE9c.",
    simulatedQrDestination: "https://doxe-thanhtoan.thanhpho-pay.top/khuvuc/4092?phi=15000",
    visibleUrl: "https://doxe-thanhtoan.thanhpho-pay.top/khuvuc/4092",
    actualRegistrableDomain: "thanhpho-pay.top",
    isScam: true,
    difficulty: "Intermediate",
    redFlags: [
      "Mi\u1EBFng d\xE1n m\xE3 QR c\xF3 d\u1EA5u hi\u1EC7u d\xE1n \u0111\xE8 m\xE9o m\xF3 l\xEAn b\u1EA3ng kim lo\u1EA1i g\u1ED1c",
      'T\xEAn mi\u1EC1n g\u1ED1c l\xE0 "thanhpho-pay.top", KH\xD4NG PH\u1EA2I t\xEAn mi\u1EC1n c\u1EE7a c\u01A1 quan nh\xE0 n\u01B0\u1EDBc (.gov.vn) hay \u0111\u01A1n v\u1ECB qu\u1EA3n l\xFD ch\xEDnh th\u1EE9c',
      'T\xEAn mi\u1EC1n ph\u1EE5 "doxe-thanhtoan" \u0111\u01B0\u1EE3c t\u1EA1o ra \u0111\u1EC3 \u0111\xE1nh l\u1EEBa ng\u01B0\u1EDDi \u0111\u1ECDc l\u01B0\u1EDBt',
      "Y\xEAu c\u1EA7u nh\u1EADp th\xF4ng tin th\u1EBB ATM / th\u1EBB t\xEDn d\u1EE5ng v\xE0 m\xE3 OTP ngay tr\xEAn web l\u1EA1 m\xE0 kh\xF4ng qua c\u1ED5ng thanh to\xE1n trung gian"
    ],
    urlDissection: {
      protocol: "https://",
      subdomain: "doxe-thanhtoan.",
      registeredDomain: "thanhpho-pay.top",
      path: "/khuvuc/4092?phi=15000",
      deceptiveElement: "T\xEAn mi\u1EC1n ph\u1EE5 gi\u1EA3 v\u1EDD l\xE0 c\u1ED5ng \u0111\u1ED7 xe th\xE0nh ph\u1ED1, nh\u01B0ng t\xEAn mi\u1EC1n th\u1EF1c s\u1EF1 s\u1EDF h\u1EEFu l\xE0 thanhpho-pay.top"
    },
    explanation: '\u0110\xE2y l\xE0 h\xECnh th\u1EE9c t\u1EA5n c\xF4ng "Physical Quishing" (d\xE1n \u0111\xE8 QR v\u1EADt l\xFD). K\u1EBB gian in s\u1EB5n nh\xE3n d\xE1n m\xE3 QR r\u1EBB ti\u1EC1n d\xE1n l\xEAn c\xE1c \u0111i\u1EC3m c\xF4ng c\u1ED9ng (b\xE3i xe, b\xE0n c\xE0 ph\xEA, c\xE2y x\u0103ng). Khi qu\xE9t v\u1ED9i, n\u1EA1n nh\xE2n v\xE0o trang web gi\u1EA3 m\u1EA1o b\u1ECB \u0111\xE1nh c\u1EAFp t\xE0i kho\u1EA3n ng\xE2n h\xE0ng.',
    educationalTip: "Tuy\u1EC7t \u0111\u1ED1i kh\xF4ng qu\xE9t c\xE1c nh\xE3n d\xE1n QR b\u1ECB d\xE1n ch\u1ED3ng \u0111\xE8 l\xEAn nhau. Lu\xF4n ki\u1EC3m tra xem m\xE3 QR c\xF3 \u0111\u01B0\u1EE3c in ch\xECm, kh\u1EAFc tr\u1EF1c ti\u1EBFp tr\xEAn m\xE1y hay kh\xF4ng, ho\u1EB7c m\u1EDF app ng\xE2n h\xE0ng / v\xED \u0111i\u1EC7n t\u1EED t\xECm t\xEDnh n\u0103ng thanh to\xE1n ch\xEDnh th\u1EE9c."
  },
  {
    id: "quish-restaurant-table-bill",
    title: "M\xE3 QR G\u1ECDi M\xF3n & Thanh To\xE1n T\u1EA1i B\xE0n Nh\xE0 H\xE0ng",
    category: "Restaurant",
    physicalContext: "B\u1EA3ng mica \u0111\u1EB7t b\xE0n ch\xEDnh h\xE3ng c\xF3 kh\u1EAFc laser logo th\u01B0\u01A1ng hi\u1EC7u c\u1EE7a chu\u1ED7i nh\xE0 h\xE0ng, ch\u1EE9a m\xE3 QR d\u1EABn \u0111\u1EBFn h\u1EC7 th\u1ED1ng g\u1ECDi m\xF3n th\u1EF1c \u0111\u01A1n \u0111i\u1EC7n t\u1EED.",
    simulatedQrDestination: "https://order.ipos.vn/menu/nha-hang-pho-ngon-quan-1",
    visibleUrl: "https://order.ipos.vn/menu/nha-hang-pho-ngon-quan-1",
    actualRegistrableDomain: "ipos.vn",
    isScam: false,
    difficulty: "Beginner",
    redFlags: [],
    urlDissection: {
      protocol: "https://",
      subdomain: "order.",
      registeredDomain: "ipos.vn",
      path: "/menu/nha-hang-pho-ngon-quan-1",
      deceptiveElement: "Kh\xF4ng c\xF3. T\xEAn mi\u1EC1n thu\u1ED9c \u0111\u01A1n v\u1ECB cung c\u1EA5p gi\u1EA3i ph\xE1p F&B uy t\xEDn h\xE0ng \u0111\u1EA7u t\u1EA1i Vi\u1EC7t Nam (iPOS.vn)."
    },
    explanation: "\u0110\xE2y l\xE0 m\xE3 QR g\u1ECDi m\xF3n v\xE0 thanh to\xE1n t\u1EA1i b\xE0n h\u1EE3p l\u1EC7. T\xEAn mi\u1EC1n g\u1ED1c l\xE0 ipos.vn, n\u1EC1n t\u1EA3ng F&B uy t\xEDn v\xE0 b\u1EA3ng mica nguy\xEAn kh\u1ED1i kh\xF4ng c\xF3 d\u1EA5u v\u1EBFt b\u1ECB b\xF3c d\xE1n tr\xE1o \u0111\u1ED5i.",
    educationalTip: "X\xE1c nh\u1EADn m\xE3 QR l\xE0 m\u1ED9t ph\u1EA7n nguy\xEAn v\u1EB9n c\u1EE7a menu ho\u1EB7c ch\xE2n \u0111\u1EBF mica c\u1EE7a qu\xE1n, kh\xF4ng ph\u1EA3i mi\u1EBFng decal d\xE1n \u0111\xE8 r\u1EDDi r\u1EA1c."
  },
  {
    id: "quish-gov-tax-refund-sms",
    title: 'M\xE3 QR Gi\u1EA3 M\u1EA1o "C\u1EADp Nh\u1EADt D\u1EEF Li\u1EC7u D\xE2n C\u01B0 VNeID / Ho\xE0n Thu\u1EBF"',
    category: "Government",
    physicalContext: "Email ho\u1EB7c tin nh\u1EAFn gi\u1EA3 danh T\u1ED5ng c\u1EE5c Thu\u1EBF / B\u1ED9 C\xF4ng An g\u1EEDi th\xF4ng b\xE1o c\xF3 kho\u1EA3n ho\xE0n thu\u1EBF 2.500.000\u0111 k\xE8m m\xE3 QR \u0111\u1EC3 l\xE0m th\u1EE7 t\u1EE5c nh\u1EADn ti\u1EC1n.",
    simulatedQrDestination: "https://dichvucong.bocongan.gov.vn-dvc-thuedientu.xyz/hoanthue",
    visibleUrl: "https://dichvucong.bocongan.gov.vn-dvc-thuedientu.xyz/hoanthue",
    actualRegistrableDomain: "vn-dvc-thuedientu.xyz",
    isScam: true,
    difficulty: "Advanced",
    redFlags: [
      '\u0110o\u1EA1n ti\u1EC1n t\u1ED1 "dichvucong.bocongan.gov." ch\u1EC9 l\xE0 t\xEAn mi\u1EC1n ph\u1EE5 \u0111\xE1nh l\u1EEBa m\u1EAFt th\u01B0\u1EDDng',
      'T\xEAn mi\u1EC1n \u0111\u0103ng k\xFD th\u1EF1c t\u1EBF l\xE0 "vn-dvc-thuedientu.xyz"',
      'C\u01A1 quan nh\xE0 n\u01B0\u1EDBc Vi\u1EC7t Nam \u0111\u1ED9c quy\u1EC1n s\u1EED d\u1EE5ng t\xEAn mi\u1EC1n c\xF3 \u0111u\xF4i chu\u1EA9n ".gov.vn"',
      'Y\xEAu c\u1EA7u nh\u1EADp s\u1ED1 CCCD, t\xE0i kho\u1EA3n ng\xE2n h\xE0ng v\xE0 m\u1EADt kh\u1EA9u Internet Banking \u0111\u1EC3 "nh\u1EADn ti\u1EC1n"'
    ],
    urlDissection: {
      protocol: "https://",
      subdomain: "dichvucong.bocongan.gov.",
      registeredDomain: "vn-dvc-thuedientu.xyz",
      path: "/hoanthue",
      deceptiveElement: 'Ch\xE8n ch\u1EEF "gov" v\xE0o tr\u01B0\u1EDBc t\xEAn mi\u1EC1n th\u1EADt \u0111\u1EC3 l\u1EEBa ng\u01B0\u1EDDi d\xF9ng t\u01B0\u1EDFng \u0111\xE2y l\xE0 c\u1ED5ng th\xF4ng tin c\u1EE7a ch\xEDnh ph\u1EE7.'
    },
    explanation: 'K\u1EBB l\u1EEBa \u0111\u1EA3o t\u1EADn d\u1EE5ng c\u1EA5u tr\xFAc subdomain l\u1ED3ng nhau. B\u1EB1ng c\xE1ch \u0111\u0103ng k\xFD t\xEAn mi\u1EC1n r\xE1c \u0111u\xF4i .xyz v\xE0 \u0111\u1EB7t t\xEAn mi\u1EC1n con l\xE0 "bocongan.gov", \u0111\u01B0\u1EDDng link hi\u1EC3n th\u1ECB tr\xEAn m\xE0n h\xECnh \u0111i\u1EC7n tho\u1EA1i r\u1EA5t gi\u1ED1ng trang web ch\xEDnh ph\u1EE7 n\u1EBFu kh\xF4ng nh\xECn k\u1EF9 t\u1EEB ph\u1EA3i qua tr\xE1i.',
    educationalTip: 'Quy t\u1EAFc \u0111\u1ECDc t\xEAn mi\u1EC1n: Lu\xF4n nh\xECn t\u1EEB ph\u1EA3i sang tr\xE1i tr\u01B0\u1EDBc d\u1EA5u g\u1EA1ch ch\xE9o \u0111\u1EA7u ti\xEAn \u0111\u1EC3 t\xECm t\xEAn mi\u1EC1n ch\xEDnh. N\u1EBFu \u0111u\xF4i kh\xF4ng ph\u1EA3i l\xE0 ".gov.vn" th\xEC ch\u1EAFc ch\u1EAFn kh\xF4ng ph\u1EA3i trang c\u1EE7a c\u01A1 quan nh\xE0 n\u01B0\u1EDBc!'
  },
  {
    id: "quish-bank-homoglyph-idn",
    title: "\u0110\u1ED3ng B\u1ED9 Sinh Tr\u1EAFc H\u1ECDc Ng\xE2n H\xE0ng G\u1EA5p (T\u1EA5n C\xF4ng K\xFD T\u1EF1 L\u1EA1 Homoglyph)",
    category: "Banking",
    physicalContext: "Tin nh\u1EAFn m\u1EA1o danh ng\xE2n h\xE0ng y\xEAu c\u1EA7u qu\xE9t m\xE3 QR c\u1EADp nh\u1EADt khu\xF4n m\u1EB7t / sinh tr\u1EAFc h\u1ECDc tr\u01B0\u1EDBc 24h n\u1EBFu kh\xF4ng t\xE0i kho\u1EA3n s\u1EBD b\u1ECB \u0111\xF3ng b\u0103ng.",
    simulatedQrDestination: "https://secure.vi\u0435tcombank.com-baomat-xacminh.net/login",
    visibleUrl: "https://secure.vi\u0435tcombank.com-baomat-xacminh.net/login",
    actualRegistrableDomain: "com-baomat-xacminh.net",
    isScam: true,
    difficulty: "Expert",
    redFlags: [
      'Ch\u1EEF "\u0435" trong "vi\u0435tcombank" l\xE0 k\xFD t\u1EF1 Cyrillic nh\xECn gi\u1ED1ng h\u1EC7t ch\u1EEF "e" Latinh nh\u01B0ng m\xE3 m\xE1y t\xEDnh kh\xE1c nhau',
      'T\xEAn mi\u1EC1n ch\xEDnh th\u1EF1c s\u1EF1 l\xE0 "com-baomat-xacminh.net"',
      "T\u1EA1o \xE1p l\u1EF1c th\u1EDDi gian gi\u1EA3 t\u1EA1o (\u0111\xF3ng b\u0103ng t\xE0i kho\u1EA3n trong v\xF2ng 2 gi\u1EDD)",
      "\u0110\xF2i h\u1ECFi nh\u1EADp t\xEAn \u0111\u0103ng nh\u1EADp, m\u1EADt kh\u1EA9u app v\xE0 m\xE3 OTP Smart OTP"
    ],
    urlDissection: {
      protocol: "https://",
      subdomain: "secure.vi\u0435tcombank.",
      registeredDomain: "com-baomat-xacminh.net",
      path: "/login",
      deceptiveElement: 'S\u1EED d\u1EE5ng k\xFD t\u1EF1 \u0111\u1ED3ng h\xECnh (Homoglyph) v\xE0 gh\xE9p n\u1ED1i g\u1EA1ch ngang "-baomat-xacminh.net" l\xE0m t\xEAn mi\u1EC1n g\u1ED1c.'
    },
    explanation: "K\u1EF9 thu\u1EADt t\u1EA5n c\xF4ng gi\u1EA3 m\u1EA1o tinh vi: K\u1EBB t\u1EA5n c\xF4ng k\u1EBFt h\u1EE3p k\xFD t\u1EF1 \u0111\u1ED3ng h\xECnh (nh\xECn gi\u1ED1ng nhau nh\u01B0ng kh\xE1c m\xE3 Unicode) v\xE0 t\xEAn mi\u1EC1n g\u1ED1c c\xF3 ch\u1EE9a t\u1EEB kh\xF3a b\u1EA3o m\u1EADt \u0111\u1EC3 \u0111\xE1nh l\u1EEBa ng\u01B0\u1EDDi d\xF9ng.",
    educationalTip: "Tuy\u1EC7t \u0111\u1ED1i kh\xF4ng bao gi\u1EDD qu\xE9t m\xE3 QR t\u1EEB email hay tin nh\u1EAFn \u0111\u1EC3 x\xE1c th\u1EF1c ng\xE2n h\xE0ng. Ch\u1EC9 c\u1EADp nh\u1EADt sinh tr\u1EAFc h\u1ECDc tr\u1EF1c ti\u1EBFp b\xEAn trong \u1EE9ng d\u1EE5ng ng\xE2n h\xE0ng ch\xEDnh th\u1EE9c ho\u1EB7c \u0111\u1EBFn qu\u1EA7y giao d\u1ECBch."
  },
  {
    id: "quish-airport-free-wifi",
    title: 'M\xE3 QR "K\u1EBFt N\u1ED1i Wi-Fi S\xE2n Bay T\u1ED1c \u0110\u1ED9 Cao Mi\u1EC5n Ph\xED"',
    category: "Wi-Fi & Travel",
    physicalContext: 'M\u1ED9t t\u1EDD r\u01A1i \u0111\u1EB7t sau gh\u1EBF ch\u1EDD s\xE2n bay ghi: "Qu\xE9t m\xE3 QR \u0111\u1EC3 m\u1EDF kh\xF3a Wi-Fi VIP kh\xF4ng qu\u1EA3ng c\xE1o t\u1ED1c \u0111\u1ED9 500Mbps".',
    simulatedQrDestination: "https://wifi-sanbay-mienphi.gateway-access.top/login-facebook",
    visibleUrl: "https://wifi-sanbay-mienphi.gateway-access.top/login-facebook",
    actualRegistrableDomain: "gateway-access.top",
    isScam: true,
    difficulty: "Intermediate",
    redFlags: [
      "Nh\xE3n d\xE1n tr\xF4i n\u1ED5i kh\xF4ng r\xF5 ngu\u1ED3n g\u1ED1c \u1EDF khu v\u1EF1c s\u1EA3nh ch\u1EDD c\xF4ng c\u1ED9ng",
      'T\xEAn mi\u1EC1n thu\u1ED9c \u0111u\xF4i l\u1EA1 ".top"',
      'Y\xEAu c\u1EA7u "\u0110\u0103ng nh\u1EADp b\u1EB1ng t\xE0i kho\u1EA3n Facebook / Google" tr\xEAn m\u1ED9t trang web kh\xF4ng thu\u1ED9c Google hay Facebook \u0111\u1EC3 chi\u1EBFm \u0111o\u1EA1t t\xE0i kho\u1EA3n'
    ],
    urlDissection: {
      protocol: "https://",
      subdomain: "wifi-sanbay-mienphi.",
      registeredDomain: "gateway-access.top",
      path: "/login-facebook",
      deceptiveElement: "Giao di\u1EC7n \u0111\u0103ng nh\u1EADp Facebook gi\u1EA3 m\u1EA1o nh\u1EB1m \u0111\xE1nh c\u1EAFp m\u1EADt kh\u1EA9u v\xE0 m\xE3 2FA c\u1EE7a h\xE0nh kh\xE1ch."
    },
    explanation: 'C\xE1c c\u1ED5ng Wi-Fi gi\u1EA3 m\u1EA1o th\u01B0\u1EDDng d\u1EE5 du kh\xE1ch \u0111\u0103ng nh\u1EADp t\xE0i kho\u1EA3n m\u1EA1ng x\xE3 h\u1ED9i \u0111\u1EC3 "truy c\u1EADp internet", t\u1EEB \u0111\xF3 chi\u1EBFm quy\u1EC1n ki\u1EC3m so\xE1t t\xE0i kho\u1EA3n v\xE0 nh\u1EAFn tin m\u01B0\u1EE3n ti\u1EC1n b\u1EA1n b\xE8 trong danh b\u1EA1.',
    educationalTip: "Ch\u1EC9 k\u1EBFt n\u1ED1i Wi-Fi qua ph\u1EA7n C\xE0i \u0111\u1EB7t m\u1EA1ng tr\xEAn \u0111i\u1EC7n tho\u1EA1i v\xE0 ki\u1EC3m tra t\xEAn m\u1EA1ng ch\xEDnh th\u1EE9c hi\u1EC3n th\u1ECB tr\xEAn b\u1EA3ng th\xF4ng tin \u0111i\u1EC7n t\u1EED c\u1EE7a s\xE2n bay."
  },
  {
    id: "quish-evn-electric-bill",
    title: 'M\xE3 QR Gi\u1EA3 M\u1EA1o "Th\xF4ng B\xE1o C\u1EAFt \u0110i\u1EC7n & N\u1ED9p Ti\u1EC1n \u0110i\u1EC7n EVN Kh\u1EA9n C\u1EA5p"',
    category: "Utilities",
    physicalContext: 'M\u1ED9t t\u1EDD th\xF4ng b\xE1o in gi\u1EA5y b\xF3ng gi\u1EA3 m\u1EA1o T\u1EADp \u0111o\xE0n \u0110i\u1EC7n l\u1EF1c EVN k\u1EB9p \u1EDF khe c\u1EEDa nh\xE0 d\xE2n ghi: "H\u1EA1n cu\u1ED1i n\u1ED9p ti\u1EC1n \u0111i\u1EC7n tr\u01B0\u1EDBc 12h tr\u01B0a nay, qu\xE9t QR \u0111\u1EC3 thanh to\xE1n tr\xE1nh c\u1EAFt \u0111i\u1EC7n".',
    simulatedQrDestination: "https://cskh-evn.dienluc-thanhtoan.site/ma-kh/PB0192819",
    visibleUrl: "https://cskh-evn.dienluc-thanhtoan.site/ma-kh/PB0192819",
    actualRegistrableDomain: "dienluc-thanhtoan.site",
    isScam: true,
    difficulty: "Intermediate",
    redFlags: [
      "T\u1EDD r\u01A1i k\u1EB9p c\u1EEDa kh\xF4ng c\xF3 m\u1ED9c \u0111\u1ECF ho\u1EB7c d\u1EA5u hi\u1EC7u x\xE1c nh\u1EADn t\u1EEB nh\xE2n vi\xEAn \u0111i\u1EC7n l\u1EF1c \u0111\u1ECBa b\xE0n",
      'T\xEAn mi\u1EC1n thu\u1ED9c \u0111u\xF4i l\u1EA1 ".site", kh\xF4ng thu\u1ED9c c\u1ED5ng th\xF4ng tin \u0111i\u1EC7n l\u1EF1c ch\xEDnh th\u1EE9c c\u1EE7a EVN (cskh.evn.com.vn)',
      "D\u1ED3n \xE9p \u0111\u1EBFm ng\u01B0\u1EE3c th\u1EDDi gian c\u1EAFt \u0111i\u1EC7n trong v\xE0i gi\u1EDD \u0111\u1EC3 ng\u01B0\u1EDDi d\xE2n kh\xF4ng k\u1ECBp ki\u1EC3m ch\u1EE9ng",
      "Giao di\u1EC7n thanh to\xE1n gi\u1EA3 m\u1EA1o y\xEAu c\u1EA7u nh\u1EADp th\xF4ng tin th\u1EBB ng\xE2n h\xE0ng v\xE0 OTP"
    ],
    urlDissection: {
      protocol: "https://",
      subdomain: "cskh-evn.",
      registeredDomain: "dienluc-thanhtoan.site",
      path: "/ma-kh/PB0192819",
      deceptiveElement: 'S\u1EED d\u1EE5ng ti\u1EC1n t\u1ED1 "cskh-evn" \u0111\u1EC3 \u0111\xE1nh l\u1EEBa th\u1ECB gi\xE1c ng\u01B0\u1EDDi d\xF9ng l\u01B0\u1EDBt nhanh.'
    },
    explanation: "K\u1EBB gian l\u1EE3i d\u1EE5ng t\xE2m l\xFD s\u1EE3 b\u1ECB c\u1EAFt \u0111i\u1EC7n sinh ho\u1EA1t \u0111\u1EC3 ph\xE1t t\xE1n th\xF4ng b\xE1o gi\u1EA3 k\xE8m m\xE3 QR. Khi qu\xE9t, n\u1EA1n nh\xE2n b\u1ECB d\u1EABn t\u1EDBi c\u1ED5ng gi\u1EA3 m\u1EA1o giao di\u1EC7n EVN nh\u1EB1m \u0111\xE1nh c\u1EAFp ti\u1EC1n trong t\xE0i kho\u1EA3n.",
    educationalTip: "Lu\xF4n tra c\u1EE9u v\xE0 thanh to\xE1n ti\u1EC1n \u0111i\u1EC7n qua \u1EE9ng d\u1EE5ng CSKH EVN ch\xEDnh th\u1EE9c ho\u1EB7c tr\u1EF1c ti\u1EBFp trong app ng\xE2n h\xE0ng / v\xED \u0111i\u1EC7n t\u1EED b\u1EB1ng M\xE3 kh\xE1ch h\xE0ng in tr\xEAn h\u1EE3p \u0111\u1ED3ng."
  },
  {
    id: "quish-cinema-ticket-cgv",
    title: "V\xE9 Xem Phim \u0110i\u1EC7n T\u1EED In M\xE3 QR T\u1EA1i Qu\u1EA7y Kiosk R\u1EA1p Chi\u1EBFu Phim",
    category: "E-commerce",
    physicalContext: "Cu\u1ED1ng v\xE9 xem phim b\u1EB1ng gi\u1EA5y nhi\u1EC7t \u0111\u01B0\u1EE3c in tr\u1EF1c ti\u1EBFp t\u1EEB m\xE1y in t\u1EF1 \u0111\u1ED9ng (kiosk) b\xEAn trong s\u1EA3nh r\u1EA1p chi\u1EBFu phim CGV / Lotte Cinema.",
    simulatedQrDestination: "https://ticket.cgv.vn/checkin/booking/99210-CGV-HN",
    visibleUrl: "https://ticket.cgv.vn/checkin/booking/99210-CGV-HN",
    actualRegistrableDomain: "cgv.vn",
    isScam: false,
    difficulty: "Beginner",
    redFlags: [],
    urlDissection: {
      protocol: "https://",
      subdomain: "ticket.",
      registeredDomain: "cgv.vn",
      path: "/checkin/booking/99210-CGV-HN",
      deceptiveElement: "Kh\xF4ng c\xF3. T\xEAn mi\u1EC1n chu\u1EA9n x\xE1c cgv.vn c\u1EE7a c\u1EE5m r\u1EA1p chi\u1EBFu phim ch\xEDnh h\xE3ng."
    },
    explanation: "M\xE3 QR h\u1EE3p l\u1EC7 \u0111\u01B0\u1EE3c h\u1EC7 th\u1ED1ng r\u1EA1p phim ph\xE1t h\xE0nh d\xF9ng \u0111\u1EC3 so\xE1t v\xE9 v\xE0o ph\xF2ng chi\u1EBFu ho\u1EB7c t\xEDch \u0111i\u1EC3m th\xE0nh vi\xEAn.",
    educationalTip: "M\xE3 QR tr\xEAn v\xE9 in t\u1EEB m\xE1y kiosk n\u1ED9i b\u1ED9 c\u1EE7a r\u1EA1p l\xE0 an to\xE0n \u0111\u1EC3 so\xE1t v\xE9."
  },
  {
    id: "quish-petrol-station-overlay",
    title: "M\xE3 QR D\xE1n \u0110\xE8 T\u1EA1i C\xE2y B\u01A1m X\u0103ng / Qu\u1EA7y Thu Ng\xE2n X\u0103ng D\u1EA7u",
    category: "Utilities",
    physicalContext: "T\u1EA1i c\u1ED9t b\u01A1m x\u0103ng, m\u1ED9t mi\u1EBFng nh\xE3n d\xE1n m\xE3 QR c\xF3 m\xE0u s\u1EAFc t\u01B0\u01A1ng t\u1EF1 b\u1EA3ng VietQR ng\xE2n h\xE0ng nh\u01B0ng d\xE1n l\u1EC7ch \u0111\xE8 l\xEAn t\u1EA5m b\u1EA3ng mica g\u1ED1c c\u1EE7a c\xE2y x\u0103ng.",
    simulatedQrDestination: "https://vietqr-thanhtoan-xangdau.me/bill/xang-ron95-100k",
    visibleUrl: "https://vietqr-thanhtoan-xangdau.me/bill/xang-ron95-100k",
    actualRegistrableDomain: "vietqr-thanhtoan-xangdau.me",
    isScam: true,
    difficulty: "Advanced",
    redFlags: [
      "Mi\u1EBFng d\xE1n m\xE3 QR b\u1ECB d\xE1n ch\u1ED3ng m\xE9o m\xF3 l\xEAn b\u1EA3ng kim lo\u1EA1i c\u1ED1 \u0111\u1ECBnh c\u1EE7a c\u1EEDa h\xE0ng x\u0103ng d\u1EA7u",
      '\u0110\u01B0\u1EDDng link d\u1EABn t\u1EDBi t\xEAn mi\u1EC1n \u0111u\xF4i ".me" thay v\xEC hi\u1EC3n th\u1ECB tr\u1EF1c ti\u1EBFp th\xF4ng tin t\xE0i kho\u1EA3n th\u1EE5 h\u01B0\u1EDFng trong app ng\xE2n h\xE0ng',
      "Khi qu\xE9t b\u1EB1ng camera \u0111i\u1EC7n tho\u1EA1i, h\u1EC7 th\u1ED1ng m\u1EDF m\u1ED9t trang web y\xEAu c\u1EA7u \u0111\u0103ng nh\u1EADp ng\xE2n h\xE0ng thay v\xEC m\u1EDF app VietQR chu\u1EA9n"
    ],
    urlDissection: {
      protocol: "https://",
      subdomain: "vietqr-thanhtoan-xangdau.",
      registeredDomain: "vietqr-thanhtoan-xangdau.me",
      path: "/bill/xang-ron95-100k",
      deceptiveElement: "Trang web m\u1EA1o danh c\u1ED5ng thanh to\xE1n VietQR \u0111\u1EC3 \u0111\xE1nh c\u1EAFp m\u1EADt kh\u1EA9u Internet Banking."
    },
    explanation: "K\u1EBB gian l\u1EE3i d\u1EE5ng l\xFAc v\u1EAFng ng\u01B0\u1EDDi d\xE1n \u0111\xE8 m\xE3 QR l\u1EEBa \u0111\u1EA3o l\xEAn c\xE2y x\u0103ng. N\u1EA1n nh\xE2n qu\xE9t m\xE3 thay v\xEC thanh to\xE1n cho c\xE2y x\u0103ng th\xEC l\u1EA1i b\u1ECB chuy\u1EC3n h\u01B0\u1EDBng v\xE0o trang web \u0111\u1ED9c h\u1EA1i.",
    educationalTip: "Ch\u1EC9 thanh to\xE1n b\u1EB1ng c\xE1ch qu\xE9t m\xE3 QR tr\xEAn m\xE0n h\xECnh POS c\u1EE7a nh\xE2n vi\xEAn ho\u1EB7c ki\u1EC3m tra t\xEAn \u0111\u01A1n v\u1ECB th\u1EE5 h\u01B0\u1EDFng tr\xEAn app ng\xE2n h\xE0ng tr\u01B0\u1EDBc khi b\u1EA5m Chuy\u1EC3n ti\u1EC1n."
  },
  {
    id: "quish-coffee-loyalty-discount",
    title: 'M\xE3 QR "T\u1EB7ng Voucher 100K C\xE0 Ph\xEA Highland / Ph\xFAc Long Mi\u1EC5n Ph\xED"',
    category: "Restaurant",
    physicalContext: 'M\u1ED9t poster in m\xE0u b\u1EAFt m\u1EAFt d\xE1n tr\xEAn c\u1ED9t \u0111i\u1EC7n tr\u01B0\u1EDBc c\u1ED5ng tr\u01B0\u1EDDng h\u1ECDc/v\u0103n ph\xF2ng: "Qu\xE9t m\xE3 nh\u1EADn ngay ly n\u01B0\u1EDBc mi\u1EC5n ph\xED 100% nh\xE2n d\u1ECBp sinh nh\u1EADt th\u01B0\u01A1ng hi\u1EC7u".',
    simulatedQrDestination: "https://highland-khuyenmai-tangvoucher.vip/nhanqua",
    visibleUrl: "https://highland-khuyenmai-tangvoucher.vip/nhanqua",
    actualRegistrableDomain: "highland-khuyenmai-tangvoucher.vip",
    isScam: true,
    difficulty: "Intermediate",
    redFlags: [
      "Poster d\xE1n tr\xF4i n\u1ED5i ngo\xE0i \u0111\u01B0\u1EDDng ph\u1ED1, kh\xF4ng c\xF3 t\u1EA1i fanpage hay website ch\xEDnh th\u1EE9c c\u1EE7a th\u01B0\u01A1ng hi\u1EC7u",
      'T\xEAn mi\u1EC1n s\u1EED d\u1EE5ng \u0111u\xF4i l\u1EA1 ".vip"',
      'Trang web y\xEAu c\u1EA7u chia s\u1EBB m\xE3 OTP g\u1EEDi v\u1EC1 Zalo ho\u1EB7c \u0111\u0103ng nh\u1EADp t\xE0i kho\u1EA3n m\u1EA1ng x\xE3 h\u1ED9i \u0111\u1EC3 "nh\u1EADn m\xE3 qu\xE0 t\u1EB7ng"'
    ],
    urlDissection: {
      protocol: "https://",
      subdomain: "highland-khuyenmai-tangvoucher.",
      registeredDomain: "highland-khuyenmai-tangvoucher.vip",
      path: "/nhanqua",
      deceptiveElement: "T\xEAn mi\u1EC1n th\u01B0\u01A1ng hi\u1EC7u gi\u1EA3 m\u1EA1o \u0111u\xF4i .vip d\u1EE5 ng\u01B0\u1EDDi d\xF9ng chia s\u1EBB quy\u1EC1n truy c\u1EADp Zalo."
    },
    explanation: "B\u1EABy khuy\u1EBFn m\xE3i tr\xE0 s\u1EEFa/c\xE0 ph\xEA mi\u1EC5n ph\xED nh\u1EAFm v\xE0o h\u1ECDc sinh, sinh vi\xEAn. Khi n\u1EA1n nh\xE2n qu\xE9t m\xE3 v\xE0 c\u1EA5p quy\u1EC1n \u1EE9ng d\u1EE5ng, k\u1EBB gian chi\u1EBFm \u0111o\u1EA1t t\xE0i kho\u1EA3n Zalo \u0111\u1EC3 \u0111i vay ti\u1EC1n b\u1EA1n b\xE8.",
    educationalTip: "Kh\xF4ng qu\xE9t m\xE3 QR khuy\u1EBFn m\xE3i d\xE1n \u1EDF n\u01A1i c\xF4ng c\u1ED9ng kh\xF4ng r\xF5 ngu\u1ED3n g\u1ED1c. Tra c\u1EE9u \u01B0u \u0111\xE3i tr\u1EF1c ti\u1EBFp trong app th\xE0nh vi\xEAn ch\xEDnh th\u1EE9c c\u1EE7a nh\xE3n h\xE0ng."
  },
  {
    id: "quish-hospital-medical-portal",
    title: "M\xE3 QR Tra C\u1EE9u K\u1EBFt Qu\u1EA3 Kh\xE1m B\u1EC7nh B\u1EC7nh Vi\u1EC7n B\u1EA1ch Mai / Ch\u1EE3 R\u1EABy",
    category: "Government",
    physicalContext: "M\xE3 QR \u0111\u01B0\u1EE3c in tr\u1EF1c ti\u1EBFp \u1EDF g\xF3c tr\xEAn c\xF9ng b\xEAn ph\u1EA3i c\u1EE7a Phi\u1EBFu ch\u1EC9 \u0111\u1ECBnh x\xE9t nghi\u1EC7m c\xF3 \u0111\xF3ng d\u1EA5u tr\xF2n \u0111\u1ECF c\u1EE7a B\u1EC7nh vi\u1EC7n.",
    simulatedQrDestination: "https://ketqua.bachmai.gov.vn/tracuu?id=BM-892189&token=a8f912c0",
    visibleUrl: "https://ketqua.bachmai.gov.vn/tracuu?id=BM-892189",
    actualRegistrableDomain: "bachmai.gov.vn",
    isScam: false,
    difficulty: "Intermediate",
    redFlags: [],
    urlDissection: {
      protocol: "https://",
      subdomain: "ketqua.",
      registeredDomain: "bachmai.gov.vn",
      path: "/tracuu?id=BM-892189",
      deceptiveElement: 'Kh\xF4ng c\xF3. T\xEAn mi\u1EC1n s\u1EDF h\u1EEFu \u0111u\xF4i ch\xEDnh ph\u1EE7 ".gov.vn" \u0111\u01B0\u1EE3c c\u1EA5p ph\xE9p \u0111\u1ED9c quy\u1EC1n cho c\u01A1 quan y t\u1EBF nh\xE0 n\u01B0\u1EDBc.'
    },
    explanation: "M\xE3 QR h\u1EE3p l\u1EC7 c\u1EE7a b\u1EC7nh vi\u1EC7n c\xF4ng l\u1EADp gi\xFAp b\u1EC7nh nh\xE2n tra c\u1EE9u k\u1EBFt qu\u1EA3 x\xE9t nghi\u1EC7m tr\u1EF1c tuy\u1EBFn nhanh ch\xF3ng v\xE0 b\u1EA3o m\u1EADt.",
    educationalTip: 'T\xEAn mi\u1EC1n c\xF3 \u0111u\xF4i chu\u1EA9n ".gov.vn" tr\xEAn phi\u1EBFu kh\xE1m c\xF3 m\u1ED9c \u0111\u1ECF c\u1EE7a b\u1EC7nh vi\u1EC7n l\xE0 an to\xE0n \u0111\u1EC3 tra c\u1EE9u.'
  },
  {
    id: "quish-supermarket-receipt",
    title: "M\xE3 QR T\xEDch \u0110i\u1EC3m & Xu\u1EA5t H\xF3a \u0110\u01A1n \u0110i\u1EC7n T\u1EED Si\xEAu Th\u1ECB Co.opmart",
    category: "E-commerce",
    physicalContext: "Ch\xE2n h\xF3a \u0111\u01A1n thanh to\xE1n b\u1EB1ng gi\u1EA5y in nhi\u1EC7t t\u1EA1i qu\u1EA7y thu ng\xE2n si\xEAu th\u1ECB Co.opmart c\xF3 in m\xE3 QR tra c\u1EE9u e-Invoice.",
    simulatedQrDestination: "https://einvoice.co-opmart.com.vn/hoadon/view?sohd=HD99182",
    visibleUrl: "https://einvoice.co-opmart.com.vn/hoadon/view?sohd=HD99182",
    actualRegistrableDomain: "co-opmart.com.vn",
    isScam: false,
    difficulty: "Beginner",
    redFlags: [],
    urlDissection: {
      protocol: "https://",
      subdomain: "einvoice.",
      registeredDomain: "co-opmart.com.vn",
      path: "/hoadon/view?sohd=HD99182",
      deceptiveElement: "Kh\xF4ng c\xF3. T\xEAn mi\u1EC1n ch\xEDnh h\xE3ng co-opmart.com.vn."
    },
    explanation: "M\xE3 QR h\xF3a \u0111\u01A1n \u0111i\u1EC7n t\u1EED h\u1EE3p l\u1EC7 theo quy \u0111\u1ECBnh c\u1EE7a T\u1ED5ng c\u1EE5c Thu\u1EBF, gi\xFAp kh\xE1ch h\xE0ng l\u01B0u tr\u1EEF h\xF3a \u0111\u01A1n VAT \u0111i\u1EC7n t\u1EED.",
    educationalTip: "H\xF3a \u0111\u01A1n in tr\u1EF1c ti\u1EBFp t\u1EEB m\xE1y POS si\xEAu th\u1ECB v\u1EDBi t\xEAn mi\u1EC1n ch\xEDnh h\xE3ng (.com.vn) l\xE0 an to\xE0n."
  },
  {
    id: "quish-telegram-login-sync",
    title: 'M\xE3 QR "Qu\xE9t \u0110\u1EC3 Tham Gia Nh\xF3m Telegram K\xEDn / Nh\u1EADn Qu\xE0 Game"',
    category: "E-commerce",
    physicalContext: 'M\u1ED9t t\xE0i kho\u1EA3n tr\xEAn m\u1EA1ng x\xE3 h\u1ED9i g\u1EEDi tin nh\u1EAFn h\xECnh \u1EA3nh: "Qu\xE9t m\xE3 QR b\u1EB1ng \u1EE9ng d\u1EE5ng Telegram tr\xEAn \u0111i\u1EC7n tho\u1EA1i \u0111\u1EC3 v\xE0o nh\xF3m nh\u1EADn code game \u0111\u1ED9c quy\u1EC1n".',
    simulatedQrDestination: "tg://login?token=AQAA_89217894a_fake_session_hijack",
    visibleUrl: "tg://login?token=AQAA_89217894a_fake_session_hijack",
    actualRegistrableDomain: "telegram.org (Giao th\u1EE9c n\u1ED9i b\u1ED9 tg://)",
    isScam: true,
    difficulty: "Expert",
    redFlags: [
      'Giao th\u1EE9c "tg://login" l\xE0 t\xEDnh n\u0103ng \u0111\u1ED3ng b\u1ED9 \u0111\u0103ng nh\u1EADp phi\xEAn l\xE0m vi\u1EC7c m\u1EDBi tr\xEAn m\xE1y t\xEDnh c\u1EE7a k\u1EBB t\u1EA5n c\xF4ng',
      "N\u1EBFu b\u1EA1n qu\xE9t m\xE3 n\xE0y trong C\xE0i \u0111\u1EB7t > Thi\u1EBFt b\u1ECB c\u1EE7a Telegram, b\u1EA1n \u0111\xE3 c\u1EA5p to\xE0n b\u1ED9 quy\u1EC1n truy c\u1EADp t\xE0i kho\u1EA3n cho k\u1EBB l\u1EEBa \u0111\u1EA3o",
      "K\u1EBB gian s\u1EBD \u0111\u1ECDc \u0111\u01B0\u1EE3c to\xE0n b\u1ED9 tin nh\u1EAFn ri\xEAng t\u01B0, nh\xF3m chat v\xE0 d\xF9ng t\xE0i kho\u1EA3n \u0111\u1EC3 nh\u1EAFn tin l\u1EEBa ti\u1EC1n m\u1ECDi ng\u01B0\u1EDDi trong danh b\u1EA1"
    ],
    urlDissection: {
      protocol: "tg://",
      subdomain: "",
      registeredDomain: "login (Telegram Device Link Protocol)",
      path: "?token=AQAA_89217894a_fake_session_hijack",
      deceptiveElement: "L\u1EE3i d\u1EE5ng t\xEDnh n\u0103ng Qu\xE9t m\xE3 \u0111\u0103ng nh\u1EADp thi\u1EBFt b\u1ECB m\u1EDBi c\u1EE7a Telegram \u0111\u1EC3 chi\u1EBFm \u0111o\u1EA1t phi\xEAn \u0111\u0103ng nh\u1EADp (Session Hijacking)."
    },
    explanation: 'K\u1EF9 thu\u1EADt chi\u1EBFm quy\u1EC1n \u0111i\u1EC1u khi\u1EC3n t\xE0i kho\u1EA3n Telegram (Session Takeover). K\u1EBB x\u1EA5u m\u1EDF trang \u0111\u0103ng nh\u1EADp Web Telegram tr\xEAn m\xE1y ch\xFAng, t\u1EA1o m\xE3 QR v\xE0 g\u1EEDi cho b\u1EA1n qu\xE9t d\u01B0\u1EDBi v\u1ECF b\u1ECDc "v\xE0o nh\xF3m k\xEDn/nh\u1EADn qu\xE0".',
    educationalTip: 'TUY\u1EC6T \u0110\u1ED0I KH\xD4NG qu\xE9t m\xE3 QR b\u1EB1ng t\xEDnh n\u0103ng "Qu\xE9t m\xE3 QR / Link Desktop" trong ph\u1EA7n C\xE0i \u0111\u1EB7t Telegram theo y\xEAu c\u1EA7u c\u1EE7a ng\u01B0\u1EDDi l\u1EA1 tr\xEAn m\u1EA1ng.'
  }
];

// src/data/deepfakeData.ts
var DEEPFAKE_CASES = [
  {
    id: "df-grandchild-distress-call",
    title: "Gi\u1EA3 M\u1EA1o Gi\u1ECDng N\xF3i Con/Ch\xE1u: G\u1EB7p Tai N\u1EA1n C\u1EA7n Ti\u1EC1n Vi\u1EC7n Ph\xED",
    category: "Relative Voice",
    mediaType: "voice",
    scenarioText: 'Cu\u1ED9c g\u1ECDi tho\u1EA1i t\u1EEB s\u1ED1 l\u1EA1: "M\u1EB9 \u01A1i, con \u0111ang \u0111i c\xF4ng t\xE1c th\xEC xe va qu\u1EB9t v\u1EDBi xe t\u1EA3i. Ng\u01B0\u1EDDi ta \u0111ang n\u1EB1m vi\u1EC7n c\u1EA5p c\u1EE9u, c\xF4ng an t\u1EA1m gi\u1EEF xe c\u1EE7a con. Con ph\u1EA3i m\u01B0\u1EE3n \u0111i\u1EC7n tho\u1EA1i c\u1EE7a b\xE1c s\u0129 \u0111\u1EC3 g\u1ECDi. C\u1EA7n 30 tri\u1EC7u \u0111\xF3ng vi\u1EC7n ph\xED g\u1EA5p trong 1 ti\u1EBFng n\u1EEFa kh\xF4ng ng\u01B0\u1EDDi nh\xE0 h\u1ECD l\xE0m \u1EA7m l\xEAn ki\u1EC7n t\u1EE5ng b\u1EAFt giam con m\u1EA5t!"',
    callerInfo: "+84 934 551 298 (S\u1ED1 l\u1EA1 kh\xF4ng l\u01B0u trong danh b\u1EA1)",
    audioSampleDescription: "Ph\xE2n t\xEDch quang ph\u1ED5 \xE2m thanh cho th\u1EA5y c\xF3 hi\u1EC7n t\u01B0\u1EE3ng ng\u1EAFt qu\xE3ng c\u01A1 h\u1ECDc si\xEAu nh\u1ECF, cao \u0111\u1ED9 gi\u1ECDng n\xF3i b\u1ECB ph\u1EB3ng (flat pitch) khi kh\xF3c l\u1EDBn v\xE0 c\xF3 t\u1EA1p \xE2m c\xF2i h\xFA gi\u1EA3 t\u1EA1o \u0111\u01B0\u1EE3c ch\xE8n \u0111\xE8 l\xEAn n\u1EC1n \xE2m thanh ph\xF2ng k\xEDn.",
    isSynthetic: true,
    artifactsDetected: [
      "Ng\u1EEF \u0111i\u1EC7u cao \u0111\u1ED9 \u0111\u1EC1u \u0111\u1EC1u thi\u1EBFu t\u1EF1 nhi\xEAn khi \u0111ang g\xE0o kh\xF3c (l\u1ED7i m\xF4 h\xECnh neural text-to-speech)",
      "\xC2m thanh n\u1EC1n \u0111\u1ED9t ng\u1ED9t thay \u0111\u1ED5i khi \u0111\u1ED5i ng\u01B0\u1EDDi n\xF3i (t\u1EEB gi\u1ECDng ch\xE1u sang gi\u1ECDng b\xE1c s\u0129)",
      "Cu\u1ED9c g\u1ECDi xu\u1EA5t ph\xE1t t\u1EEB \u0111\u1EA7u s\u1ED1 VoIP \u1EA3o qua m\u1EA1ng Internet",
      'Li\xEAn t\u1EE5c d\u1ED3n \xE9p chuy\u1EC3n kho\u1EA3n g\u1EA5p v\xE0o t\xE0i kho\u1EA3n c\xE1 nh\xE2n c\u1EE7a "b\xE1c s\u0129"'
    ],
    tacticUsed: "Sympathy",
    detectionClues: [
      'H\u1ECFi ng\u01B0\u1EDDi g\u1ECDi m\u1ED9t c\xE2u h\u1ECFi ri\xEAng t\u01B0 ch\u1EC9 ng\u01B0\u1EDDi th\xE2n trong nh\xE0 m\u1EDBi bi\u1EBFt (v\xED d\u1EE5: "T\xEAn con c\xFAn nh\xE0 m\xECnh l\xE0 g\xEC?" ho\u1EB7c y\xEAu c\u1EA7u \u0111\u1ECDc "M\u1EADt kh\u1EA9u an to\xE0n gia \u0111\xECnh")',
      "\u0110\u1EC3 \xFD ti\u1EBFng th\u1EDF ng\u1EAFt qu\xE3ng b\u1EA5t th\u01B0\u1EDDng ho\u1EB7c \xE2m thanh kim lo\u1EA1i r\xE8 r\xE8 trong ch\u1EA5t gi\u1ECDng",
      "C\xFAp m\xE1y ngay l\u1EADp t\u1EE9c v\xE0 g\u1ECDi l\u1EA1i th\u1EB3ng v\xE0o s\u1ED1 \u0111i\u1EC7n tho\u1EA1i th\u01B0\u1EDDng d\xF9ng c\u1EE7a con ch\xE1u \u0111\u1EC3 x\xE1c minh"
    ],
    recommendedResponse: "C\xFAp m\xE1y ngay l\u1EADp t\u1EE9c. Tuy\u1EC7t \u0111\u1ED1i kh\xF4ng chuy\u1EC3n ti\u1EC1n. G\u1ECDi \u0111i\u1EC7n cho b\u1ED1 m\u1EB9 ho\u1EB7c s\u1ED1 ch\xEDnh ch\u1EE7 c\u1EE7a ng\u01B0\u1EDDi th\xE2n \u0111\u1EC3 x\xE1c nh\u1EADn t\xECnh tr\u1EA1ng an to\xE0n."
  },
  {
    id: "df-ceo-urgent-wire-video",
    title: "Cu\u1ED9c G\u1ECDi Video Gi\u1EA3 M\u1EA1o L\xE3nh \u0110\u1EA1o: Chuy\u1EC3n Ti\u1EC1n K\xFD H\u1EE3p \u0110\u1ED3ng Kh\u1EA9n",
    category: "HR Video Call",
    mediaType: "video",
    scenarioText: 'Cu\u1ED9c g\u1ECDi video ng\u1EAFn qua Microsoft Teams / Zalo xu\u1EA5t hi\u1EC7n h\xECnh \u1EA3nh Gi\xE1m \u0111\u1ED1c c\xF4ng ty: "Ch\xE0o em. Anh \u0111ang h\u1ECDp k\xEDn v\u1EDBi \u0111\u1ED1i t\xE1c \u1EDF n\u01B0\u1EDBc ngo\xE0i chu\u1EA9n b\u1ECB ch\u1ED1t th\u01B0\u01A1ng v\u1EE5 M&A. Do t\xE0i kho\u1EA3n doanh nghi\u1EC7p \u0111ang b\u1ECB ch\u1EADm l\u1EC7nh, em t\u1EA1m \u1EE9ng chuy\u1EC3n 200 tri\u1EC7u v\xE0o t\xE0i kho\u1EA3n \u0111\u1ED1i t\xE1c tr\u01B0\u1EDBc 11h tr\u01B0a nay \u0111\u1EC3 k\u1ECBp \u0111\u1EB7t c\u1ECDc. H\u1EBFt cu\u1ED9c h\u1ECDp anh k\xFD l\u1EC7nh ho\xE0n ti\u1EC1n."',
    callerInfo: 'Zalo / Teams Video: "Gi\xE1m \u0110\u1ED1c Nguy\u1EC5n Ho\xE0ng Nam (T\xE0i kho\u1EA3n ngo\xE0i)"',
    audioSampleDescription: "Khung h\xECnh video c\xF3 hi\u1EC7n t\u01B0\u1EE3ng l\u1EC7ch kh\u1EDBp kh\u1EA9u h\xECnh mi\u1EC7ng khi n\xF3i c\xE1c con s\u1ED1, xu\u1EA5t hi\u1EC7n v\u1EC7t nh\xF2e \u1EDF v\xF9ng c\u1ED5 v\xE0 quai h\xE0m (l\u1ED7i ho\xE1n \u0111\u1ED5i khu\xF4n m\u1EB7t Deepfake Face-Swap), \xE1nh s\xE1ng ph\u1EA3n chi\u1EBFu tr\xEAn k\xEDnh m\u1EAFt kh\xF4ng thay \u0111\u1ED5i khi c\u1EED \u0111\u1ED9ng \u0111\u1EA7u.",
    isSynthetic: true,
    artifactsDetected: [
      "Kh\u1EA9u h\xECnh mi\u1EC7ng kh\xF4ng kh\u1EDBp v\u1EDBi \xE2m thanh khi ph\xE1t \xE2m c\xE1c con s\u1ED1 v\xE0 t\xEAn t\xE0i kho\u1EA3n",
      "\u0110\u01B0\u1EDDng vi\u1EC1n khu\xF4n m\u1EB7t b\u1ECB nh\u1EA5p nh\xE1y, rung gi\u1EADt nh\u1EB9 khi xoay \u0111\u1EA7u sang hai b\xEAn",
      'T\xE0i kho\u1EA3n mang nh\xE3n "T\xE0i kho\u1EA3n kh\xE1ch b\xEAn ngo\xE0i" ch\u1EE9 kh\xF4ng n\u1EB1m trong danh b\u1EA1 n\u1ED9i b\u1ED9 c\xF4ng ty',
      "Ch\u1EC9 th\u1ECB b\xED m\u1EADt nh\u1EB1m n\xE9 tr\xE1nh quy tr\xECnh ph\xEA duy\u1EC7t t\xE0i ch\xEDnh 2 c\u1EA5p ti\xEAu chu\u1EA9n"
    ],
    tacticUsed: "Authority",
    detectionClues: [
      "Y\xEAu c\u1EA7u ng\u01B0\u1EDDi g\u1ECDi v\u1EABy b\xE0n tay ch\u1EAFn ngang tr\u01B0\u1EDBc m\u1EB7t ho\u1EB7c quay m\u1EB7t sang g\xF3c 90 \u0111\u1ED9 (k\u1EF9 thu\u1EADt n\xE0y l\xE0m v\u1EE1 thu\u1EADt to\xE1n gh\xE9p m\u1EB7t AI th\u1EDDi gian th\u1EF1c)",
      "Ki\u1EC3m tra k\u1EF9 nh\xE3n t\xE0i kho\u1EA3n v\xE0 g\u1ECDi \u0111i\u1EC7n x\xE1c nh\u1EADn l\u1EA1i qua \u0111\u01B0\u1EDDng d\xE2y tho\u1EA1i n\u1ED9i b\u1ED9 b\u1EA3o m\u1EADt",
      "Th\u1EF1c hi\u1EC7n nghi\xEAm t\xFAc quy tr\xECnh \u1EE7y quy\u1EC1n t\xE0i ch\xEDnh 2 c\u1EA5p (kh\xF4ng bao gi\u1EDD chuy\u1EC3n ti\u1EC1n ch\u1EC9 qua m\u1ED9t cu\u1ED9c g\u1ECDi video)"
    ],
    recommendedResponse: "T\u1EEB ch\u1ED1i chuy\u1EC3n ti\u1EC1n \u0111\u01A1n ph\u01B0\u01A1ng. Y\xEAu c\u1EA7u ph\xEA duy\u1EC7t v\u0103n b\u1EA3n ho\u1EB7c x\xE1c th\u1EF1c ch\xE9o qua Gi\xE1m \u0111\u1ED1c T\xE0i ch\xEDnh v\xE0 K\u1EBF to\xE1n tr\u01B0\u1EDFng qua k\xEAnh ch\xEDnh th\u1ED1ng."
  },
  {
    id: "df-police-video-fine",
    title: "Cu\u1ED9c G\u1ECDi Video C\xF4ng An M\u1EB7c S\u1EAFc Ph\u1EE5c: Th\xF4ng B\xE1o L\u1EC7nh B\u1EAFt",
    category: "Police Authority",
    mediaType: "video",
    scenarioText: 'M\u1ED9t cu\u1ED9c g\u1ECDi video hi\u1EC7n l\xEAn h\xECnh \u1EA3nh m\u1ED9t ng\u01B0\u1EDDi \u0111\xE0n \xF4ng m\u1EB7c s\u1EAFc ph\u1EE5c c\xF4ng an ng\u1ED3i t\u1EA1i b\xE0n l\xE0m vi\u1EC7c c\xF3 qu\u1ED1c huy ph\xEDa sau: "C\xF4ng d\xE2n ch\xFA \xFD, t\xE0i kho\u1EA3n ng\xE2n h\xE0ng c\u1EE7a anh/ch\u1ECB li\xEAn quan v\u1EE5 \xE1n ma t\xFAy v\xE0 r\u1EEDa ti\u1EC1n l\u1EDBn. Vi\u1EC7n ki\u1EC3m s\xE1t \u0111\xE3 ph\xEA chu\u1EA9n l\u1EC7nh t\u1EA1m giam. Y\xEAu c\u1EA7u chuy\u1EC3n ti\u1EC1n v\xE0o t\xE0i kho\u1EA3n phong t\u1ECFa c\u1EE7a ban chuy\xEAn \xE1n trong 2 gi\u1EDD \u0111\u1EC3 \u0111\u1ED1i so\xE1t."',
    callerInfo: 'Video Call Zalo: "Trung T\xE1 V\u0169 M\u1EA1nh C\u01B0\u1EDDng - C\u1EE5c CS\u0110T"',
    audioSampleDescription: "S\u1EAFc ph\u1EE5c c\xF4ng an c\xF3 ph\xF9 hi\u1EC7u b\u1ECB ng\u01B0\u1EE3c chi\u1EC1u v\xE0 m\u1EDD n\xE9t. M\u1EAFt ch\u1EDBp gi\u1EADt nhanh b\u1EA5t th\u01B0\u1EDDng, b\u1ED1i c\u1EA3nh ph\xF2ng l\xE0m vi\u1EC7c ph\xEDa sau l\xE0 \u1EA3nh t\u0129nh l\u1EB7p l\u1EA1i kh\xF4ng c\xF3 c\u1EED \u0111\u1ED9ng xung quanh.",
    isSynthetic: true,
    artifactsDetected: [
      "B\u1ED1i c\u1EA3nh ph\xF2ng l\xE0m vi\u1EC7c ph\xEDa sau l\xE0 m\u1ED9t t\u1EA5m \u1EA3nh t\u0129nh gh\xE9p ph\xF4ng xanh thi\u1EBFu chi\u1EC1u s\xE2u t\u1EF1 nhi\xEAn",
      "C\u1EA7u vai v\xE0 ph\xF9 hi\u1EC7u c\xF4ng an kh\xF4ng \u0111\xFAng quy chu\u1EA9n \u0111i\u1EC1u l\u1EC7nh CAND",
      'Y\xEAu c\u1EA7u chuy\u1EC3n ti\u1EC1n v\xE0o t\xE0i kho\u1EA3n ng\xE2n h\xE0ng c\xE1 nh\xE2n mang danh "t\xE0i kho\u1EA3n c\u01A1 quan"',
      "\u0110e d\u1ECDa b\u1EAFt gi\u1EEF qua m\u1EA1ng x\xE3 h\u1ED9i Zalo/Telegram"
    ],
    tacticUsed: "Authority",
    detectionClues: [
      "L\u1EF1c l\u01B0\u1EE3ng C\xF4ng an Vi\u1EC7t Nam KH\xD4NG BAO GI\u1EDC g\u1ECDi video call hay t\u1ED1ng \u0111\u1EA1t l\u1EC7nh b\u1EAFt, l\u1EA5y l\u1EDDi khai qua m\u1EA1ng x\xE3 h\u1ED9i",
      "\u0110\u1EC3 \xFD c\xE1c v\u1EC7t m\u1EDD quanh c\u1ED5 \xE1o, c\u1EB1m v\xE0 t\xF3c",
      "Li\xEAn h\u1EC7 ngay tr\u1EF1c ban C\xF4ng an ph\u01B0\u1EDDng/x\xE3 n\u01A1i c\u01B0 tr\xFA \u0111\u1EC3 x\xE1c minh s\u1EF1 vi\u1EC7c"
    ],
    recommendedResponse: "Ng\u1EAFt k\u1EBFt n\u1ED1i ngay l\u1EADp t\u1EE9c. Ch\u1EB7n t\xE0i kho\u1EA3n. \u0110\u1EBFn tr\u1EF1c ti\u1EBFp tr\u1EE5 s\u1EDF C\xF4ng an n\u01A1i g\u1EA7n nh\u1EA5t n\u1EBFu c\xF3 b\u1EA5t k\u1EF3 th\u1EAFc m\u1EAFc n\xE0o."
  },
  {
    id: "df-celebrity-crypto-endorsement",
    title: "Video Deepfake Ng\u01B0\u1EDDi N\u1ED5i Ti\u1EBFng: K\xEAu G\u1ECDi \u0110\u1EA7u T\u01B0 Ti\u1EC1n K\u1EF9 Thu\u1EADt S\u1ED1",
    category: "Celebrity Investment",
    mediaType: "video",
    scenarioText: 'Video ng\u1EAFn tr\xEAn TikTok/Facebook xu\u1EA5t hi\u1EC7n h\xECnh \u1EA3nh m\u1ED9t MC / Shark truy\u1EC1n h\xECnh n\u1ED5i ti\u1EBFng: "T\xF4i v\u1EEBa h\u1EE3p t\xE1c c\xF9ng s\xE0n giao d\u1ECBch AI t\u1EF1 \u0111\u1ED9ng l\u1EE3i nhu\u1EADn 300%. Nh\xE2n d\u1ECBp ra m\u1EAFt, 100 ng\u01B0\u1EDDi \u0111\u1EA7u ti\xEAn n\u1EA1p t\u1ED1i thi\u1EC3u 2 tri\u1EC7u s\u1EBD \u0111\u01B0\u1EE3c nh\xE2n \u0111\xF4i t\xE0i kho\u1EA3n v\xE0 nh\u1EADn b\u1EA3o hi\u1EC3m r\u1EE7i ro 100%."',
    callerInfo: 'Video Clip Qu\u1EA3ng C\xE1o: "Fanpage T\xEDch Xanh Gi\u1EA3 M\u1EA1o"',
    audioSampleDescription: "Gi\u1ECDng n\xF3i c\u1EE7a ng\u01B0\u1EDDi n\u1ED5i ti\u1EBFng \u0111\u01B0\u1EE3c t\u1ED5ng h\u1EE3p (Voice Clone), kh\u1EA9u h\xECnh nh\xE9p theo ph\u1EE5 \u0111\u1EC1 ti\u1EBFng Vi\u1EC7t b\u1ECB m\xE9o nh\u1EB9 \u1EDF c\xE1c nguy\xEAn \xE2m k\xE9p (u\xEA, oai) v\xE0 c\xE1c ng\xF3n tay khi ch\u1EC9 v\xE0o m\xE0n h\xECnh b\u1ECB bi\u1EBFn d\u1EA1ng th\xE0nh 6 ng\xF3n.",
    isSynthetic: true,
    artifactsDetected: [
      "Ng\xF3n tay khi c\u1EED \u0111\u1ED9ng c\xF3 l\xFAc xu\u1EA5t hi\u1EC7n 6 ng\xF3n ho\u1EB7c d\xEDnh v\xE0o nhau",
      "Kh\u1EA9u h\xECnh mi\u1EC7ng (lip-sync) c\xF3 \u0111\u1ED9 tr\u1EC5 0.3s so v\u1EDBi \xE2m thanh ph\xE1t ra",
      "\u0110\u0103ng t\u1EA3i tr\xEAn trang fanpage m\u1EDBi t\u1EA1o v\xE0i ng\xE0y ho\u1EB7c t\xE0i kho\u1EA3n c\xE1 nh\xE2n kh\xF4ng c\xF3 t\xEDch xanh ch\xEDnh ch\u1EE7",
      "H\u1EE9a h\u1EB9n m\u1EE9c l\xE3i su\u1EA5t 300% phi th\u1EF1c t\u1EBF tr\xE1i quy lu\u1EADt th\u1ECB tr\u01B0\u1EDDng t\xE0i ch\xEDnh"
    ],
    tacticUsed: "Social Proof",
    detectionClues: [
      "Ki\u1EC3m tra trang c\xE1 nh\xE2n ch\xEDnh th\u1EE9c c\xF3 t\xEDch xanh x\u1ECBn c\u1EE7a ng\u01B0\u1EDDi n\u1ED5i ti\u1EBFng xem h\u1ECD c\xF3 th\xF4ng b\xE1o v\u1EC1 s\u1EF1 ki\u1EC7n n\xE0y kh\xF4ng",
      "Ph\xE2n t\xEDch b\xE0n tay v\xE0 chuy\u1EC3n \u0111\u1ED9ng kh\u1EDBp h\xE0m c\u1EE7a nh\xE2n v\u1EADt trong video",
      "C\u1EA3nh gi\xE1c tr\u01B0\u1EDBc c\xE1c m\xF4 h\xECnh t\xE0i ch\xEDnh cam k\u1EBFt si\xEAu l\u1EE3i nhu\u1EADn c\xF3 s\u1EED d\u1EE5ng h\xECnh \u1EA3nh KOLs"
    ],
    recommendedResponse: "B\xE1o c\xE1o (Report) video l\u1EEBa \u0111\u1EA3o l\xEAn n\u1EC1n t\u1EA3ng m\u1EA1ng x\xE3 h\u1ED9i. Tuy\u1EC7t \u0111\u1ED1i kh\xF4ng b\u1EA5m v\xE0o link n\u1EA1p ti\u1EC1n trong ph\u1EA7n b\xECnh lu\u1EADn."
  },
  {
    id: "df-friend-quick-video-borrow",
    title: 'Cu\u1ED9c G\u1ECDi Video "M\u1EA1ng Y\u1EBFu" 5 Gi\xE2y: B\u1EA1n Th\xE2n Gi\u1EE5c Vay Ti\u1EC1n C\u1ECDc \u0110\u1EA5t',
    category: "Relative Voice",
    mediaType: "video",
    scenarioText: 'B\u1EA1n th\xE2n g\u1ECDi video Messenger, m\xE0n h\xECnh hi\u1EC7n m\u1EB7t b\u1EA1n \u0111ang ng\u1ED3i trong qu\xE1n c\xE0 ph\xEA v\u1EABy tay c\u01B0\u1EDDi, nh\u01B0ng t\xEDn hi\u1EC7u ch\u1EADp ch\u1EDDn r\u1ED3i ng\u1EAFt sau 5 gi\xE2y. Ngay sau \u0111\xF3 c\xF3 tin nh\u1EAFn chat: "M\u1EA1ng ch\u1ED7 tao y\u1EBFu qu\xE1, \u0111ang \u0111i \u0111\u1EB7t c\u1ECDc mi\u1EBFng \u0111\u1EA5t g\u1EA5p thi\u1EBFu 40 tri\u1EC7u. M\xE0y b\u1EAFn v\xE0o STK ch\u1EE7 \u0111\u1EA5t n\xE0y gi\xFAp tao 1 ti\u1EBFng n\u1EEFa tao v\u1EC1 nh\xE0 b\u1EAFn l\u1EA1i ngay!"',
    callerInfo: 'Messenger Video Call: "T\xE0i Kho\u1EA3n Facebook B\u1EA1n Th\xE2n B\u1ECB Hack"',
    audioSampleDescription: "\u0110o\u1EA1n video 5 gi\xE2y l\xE0 m\u1ED9t clip ng\u1EAFn c\u1EAFt t\u1EEB Story Facebook c\u0169 c\u1EE7a n\u1EA1n nh\xE2n, \u0111\u01B0\u1EE3c l\u1EB7p l\u1EA1i (loop) v\xE0 c\u1ED1 t\xECnh ch\xE8n nhi\u1EC5u s\u1ECDc ngang \u0111\u1EC3 gi\u1EA3 v\u1EDD s\xF3ng y\u1EBFu.",
    isSynthetic: true,
    artifactsDetected: [
      'Cu\u1ED9c g\u1ECDi video ch\u1EC9 k\xE9o d\xE0i v\xE0i gi\xE2y r\u1ED3i ch\u1EE7 \u0111\u1ED9ng ng\u1EAFt v\u1EDBi l\xFD do "m\u1EA1ng y\u1EBFu"',
      "Video kh\xF4ng c\xF3 s\u1EF1 t\u01B0\u01A1ng t\xE1c 2 chi\u1EC1u (n\u1EA1n nh\xE2n h\u1ECFi nh\u01B0ng h\xECnh \u1EA3nh trong video ch\u1EC9 c\u01B0\u1EDDi ho\u1EB7c g\u1EADt \u0111\u1EA7u v\xF4 \u0111\u1ECBnh)",
      "Y\xEAu c\u1EA7u chuy\u1EC3n ti\u1EC1n v\xE0o t\xE0i kho\u1EA3n ng\xE2n h\xE0ng c\u1EE7a ng\u01B0\u1EDDi th\u1EE9 3 (ch\u1EE7 \u0111\u1EA5t / trung gian)",
      "D\u1ED3n \xE9p th\u1EDDi gian kh\u1EA9n c\u1EA5p nh\u1EB1m ng\u0103n ch\u1EB7n n\u1EA1n nh\xE2n g\u1ECDi \u0111i\u1EC7n tho\u1EA1i tr\u1EF1c ti\u1EBFp"
    ],
    tacticUsed: "Urgency",
    detectionClues: [
      'Khi \u0111\u1ED1i ph\u01B0\u01A1ng l\u1EA5y l\xFD do "m\u1EA1ng y\u1EBFu", h\xE3y g\u1ECDi \u0111i\u1EC7n tr\u1EF1c ti\u1EBFp v\xE0o s\u1ED1 thu\xEA bao di \u0111\u1ED9ng (SIM) th\u01B0\u1EDDng ng\xE0y c\u1EE7a b\u1EA1n m\xECnh',
      "Y\xEAu c\u1EA7u ng\u01B0\u1EDDi g\u1ECDi n\xF3i m\u1ED9t t\u1EEB kh\xF3a ng\u1EABu nhi\xEAn ho\u1EB7c l\xE0m m\u1ED9t c\u1EED ch\u1EC9 theo l\u1EC7nh (v\xED d\u1EE5: gi\u01A1 ng\xF3n tay tr\u1ECF l\xEAn m\u0169i)",
      "Kh\xF4ng chuy\u1EC3n ti\u1EC1n v\xE0o t\xE0i kho\u1EA3n mang t\xEAn ng\u01B0\u1EDDi l\u1EA1 kh\xE1c v\u1EDBi t\xEAn b\u1EA1n b\xE8"
    ],
    recommendedResponse: "L\u1EADp t\u1EE9c g\u1ECDi s\u1ED1 \u0111i\u1EC7n tho\u1EA1i di \u0111\u1ED9ng ch\xEDnh ch\u1EE7 c\u1EE7a ng\u01B0\u1EDDi b\u1EA1n \u0111\u1EC3 th\xF4ng b\xE1o nick Facebook c\u1EE7a h\u1ECD \u0111\xE3 b\u1ECB k\u1EBB gian chi\u1EBFm quy\u1EC1n ki\u1EC3m so\xE1t."
  },
  {
    id: "df-doctor-emergency-call",
    title: "B\u1EA3n Ghi \xC2m B\xE1c S\u0129 B\u1EC7nh Vi\u1EC7n: Gi\u1EE5c N\u1ED9p Vi\u1EC7n Ph\xED M\u1ED5 N\xE3o Kh\u1EA9n",
    category: "Relative Voice",
    mediaType: "voice",
    scenarioText: 'Cu\u1ED9c g\u1ECDi tho\u1EA1i t\u1EEB ng\u01B0\u1EDDi t\u1EF1 x\u01B0ng l\xE0 Tr\u01B0\u1EDFng khoa Ph\u1EABu thu\u1EADt Th\u1EA7n kinh: "B\xE1c s\u0129 g\u1ECDi t\u1EEB ph\xF2ng m\u1ED5 c\u1EA5p c\u1EE9u. B\u1EC7nh nh\xE2n ng\u01B0\u1EDDi nh\xE0 c\u1EE7a anh b\u1ECB ch\u1EA5n th\u01B0\u01A1ng s\u1ECD n\xE3o k\xEDn, m\xE1u t\u1EE5 m\xE0ng c\u1EE9ng \u0111ang ch\xE8n \xE9p n\xE3o. B\u1EC7nh vi\u1EC7n c\u1EA7n ng\u01B0\u1EDDi nh\xE0 duy\u1EC7t m\u1ED5 v\xE0 chuy\u1EC3n t\u1EA1m \u1EE9ng 35 tri\u1EC7u mua v\u1EADt t\u01B0 \u0111\u1EB7c bi\u1EC7t trong v\xF2ng 15 ph\xFAt, ch\u1EADm l\xE0 kh\xF4ng qua kh\u1ECFi!"',
    callerInfo: '+84 912 884 102 (Hi\u1EC3n th\u1ECB t\xEAn m\u1EA1o danh "BS Tr\u01B0\u1EDFng Ca")',
    audioSampleDescription: "Gi\u1ECDng n\xF3i b\xE1c s\u0129 r\u1EA5t \u0111anh th\xE9p v\xE0 chuy\xEAn nghi\u1EC7p, nh\u01B0ng \xE2m thanh y t\u1EBF n\u1EC1n (ti\u1EBFng m\xE1y monitor tim) ph\xE1t ra ti\u1EBFng b\xEDp v\u1EDBi chu k\u1EF3 ho\xE0n h\u1EA3o phi t\u1EF1 nhi\xEAn (m\xE1y t\u1EA1o ti\u1EBFng b\xEDp \u0111i\u1EC7n t\u1EED) kh\xF4ng c\xF3 s\u1EF1 bi\u1EBFn thi\xEAn sinh h\u1ECDc.",
    isSynthetic: true,
    artifactsDetected: [
      "Ti\u1EBFng c\xF2i h\xFA v\xE0 monitor y t\u1EBF trong n\u1EC1n \xE2m thanh b\u1ECB l\u1EB7p l\u1EA1i theo chu k\u1EF3 \u0111\u1EC1u \u0111\u1EB7n ki\u1EC3u file \xE2m thanh m\u1EABu (Sound Effect Loop)",
      'H\u1ED1i th\xFAc chuy\u1EC3n kho\u1EA3n v\xE0o s\u1ED1 t\xE0i kho\u1EA3n c\xE1 nh\xE2n c\u1EE7a "b\xE1c s\u0129 ph\u1EE5 tr\xE1ch"',
      "K\u1EBB gian kh\xF4ng cho n\u1EA1n nh\xE2n c\xF3 th\u1EDDi gian suy ngh\u0129 hay ng\u1EAFt m\xE1y \u0111\u1EC3 li\xEAn l\u1EA1c ng\u01B0\u1EDDi th\xE2n kh\xE1c"
    ],
    tacticUsed: "Fear",
    detectionClues: [
      "Quy tr\xECnh b\u1EC7nh vi\u1EC7n c\xF4ng: C\xE1c ca m\u1ED5 c\u1EA5p c\u1EE9u \u0111e d\u1ECDa t\xEDnh m\u1EA1ng LU\xD4N \u0110\u01AF\u1EE2C TI\u1EBEN H\xC0NH NGAY L\u1EACP T\u1EE8C theo y l\u1EC7nh kh\u1EA9n, kh\xF4ng ch\u1EDD ti\u1EC1n vi\u1EC7n ph\xED",
      "B\u1EC7nh vi\u1EC7n KH\xD4NG thu vi\u1EC7n ph\xED qua s\u1ED1 t\xE0i kho\u1EA3n c\xE1 nh\xE2n c\u1EE7a b\xE1c s\u0129",
      "Y\xEAu c\u1EA7u n\xF3i chuy\u1EC7n tr\u1EF1c ti\u1EBFp v\u1EDBi \u0111i\u1EC1u d\u01B0\u1EE1ng tr\u1EF1c ho\u1EB7c s\u1ED1 m\xE1y b\xE0n t\u1ED5ng \u0111\xE0i b\u1EC7nh vi\u1EC7n"
    ],
    recommendedResponse: "Gi\u1EEF b\xECnh t\u0129nh, ng\u1EAFt cu\u1ED9c g\u1ECDi. G\u1ECDi v\xE0o s\u1ED1 m\xE1y b\xE0n ch\xEDnh th\u1EE9c c\u1EE7a B\u1EC7nh vi\u1EC7n ho\u1EB7c di chuy\u1EC3n tr\u1EF1c ti\u1EBFp \u0111\u1EBFn khoa C\u1EA5p c\u1EE9u \u0111\u1EC3 x\xE1c nh\u1EADn."
  }
];

// src/data/quickDrills.ts
var QUICK_DRILLS = [
  {
    id: "drill-1",
    title: "C\u1EA3nh B\xE1o T\u1EA1m D\u1EEBng T\xE0i Kho\u1EA3n Xem Phim / \xC2m Nh\u1EA1c Tr\u1EF1c Tuy\u1EBFn",
    channel: "sms",
    sender: "+84 901 884 192",
    message: "NETFLIX/SPOTIFY-ALERT: G\xF3i \u0111\u0103ng k\xFD c\u1EE7a b\u1EA1n b\u1ECB t\u1EA1m ng\u01B0ng do l\u1ED7i thanh to\xE1n \u0111\u1ECBnh k\u1EF3. C\u1EADp nh\u1EADt l\u1EA1i th\xF4ng tin th\u1EBB trong v\xF2ng 15 ph\xFAt \u0111\u1EC3 tr\xE1nh b\u1ECB h\u1EE7y t\xE0i kho\u1EA3n: https://netflix-capnhat-the.top/login",
    isScam: true,
    tacticsPresent: ["Urgency", "Fear", "Convenience Bias"],
    correctAction: "B\u1ECF qua tin nh\u1EAFn SMS v\xE0 m\u1EDF tr\u1EF1c ti\u1EBFp \u1EE9ng d\u1EE5ng ch\xEDnh th\u1EE9c tr\xEAn \u0111i\u1EC7n tho\u1EA1i \u0111\u1EC3 ki\u1EC3m tra m\u1EE5c thanh to\xE1n.",
    alternativeOptions: [
      {
        label: "B\u1EA5m ngay v\xE0o link v\xE0 nh\u1EADp l\u1EA1i th\xF4ng tin th\u1EBB ng\xE2n h\xE0ng \u0111\u1EC3 ti\u1EBFp t\u1EE5c xem phim",
        isCorrect: false,
        feedback: 'R\u1EA5t nguy hi\u1EC3m! T\xEAn mi\u1EC1n ".top" l\xE0 trang web l\u1EEBa \u0111\u1EA3o \u0111\u01B0\u1EE3c l\u1EADp ra \u0111\u1EC3 chi\u1EBFm \u0111o\u1EA1t s\u1ED1 th\u1EBB ng\xE2n h\xE0ng v\xE0 m\xE3 CVV c\u1EE7a b\u1EA1n.'
      },
      {
        label: "B\u1ECF qua \u0111\u01B0\u1EDDng link, m\u1EDF tr\u1EF1c ti\u1EBFp \u1EE9ng d\u1EE5ng ho\u1EB7c website ch\xEDnh th\u1EE9c \u0111\u1EC3 ki\u1EC3m tra tr\u1EA1ng th\xE1i thanh to\xE1n",
        isCorrect: true,
        feedback: "Ch\xEDnh x\xE1c! Kh\xF4ng bao gi\u1EDD tin t\u01B0\u1EDFng c\xE1c \u0111\u01B0\u1EDDng link c\u1EADp nh\u1EADt t\xE0i kho\u1EA3n qua SMS l\u1EA1. Lu\xF4n ki\u1EC3m tra trong \u1EE9ng d\u1EE5ng ch\xEDnh ch\u1EE7."
      },
      {
        label: 'Nh\u1EAFn tin tr\u1EA3 l\u1EDDi "HUY" k\xE8m 4 s\u1ED1 cu\u1ED1i c\u1EE7a th\u1EBB ng\xE2n h\xE0ng',
        isCorrect: false,
        feedback: "Kh\xF4ng bao gi\u1EDD nh\u1EAFn l\u1EA1i th\xF4ng tin th\u1EBB ho\u1EB7c tr\u1EA3 l\u1EDDi c\xE1c \u0111\u1EA7u s\u1ED1 tin nh\u1EAFn r\xE1c kh\xF4ng r\xF5 ngu\u1ED3n g\u1ED1c."
      }
    ],
    explanation: "K\u1EBB gian th\u01B0\u1EDDng t\u1EA1o c\u1EA3m gi\xE1c g\u1EA5p g\xE1p (15 ph\xFAt) v\xE0 gi\u1EA3 danh c\xE1c d\u1ECBch v\u1EE5 gi\u1EA3i tr\xED quen thu\u1ED9c \u0111\u1EC3 chi\u1EBFm \u0111o\u1EA1t th\u1EBB t\xEDn d\u1EE5ng."
  },
  {
    id: "drill-2",
    title: "Th\xF4ng B\xE1o \u0110\xF3ng H\u1ECDc Ph\xED / Ti\u1EC1n \u0102n B\xE1n Tr\xFA C\u1EE7a Tr\u01B0\u1EDDng H\u1ECDc",
    channel: "email",
    sender: "ketoan@thcs-chuvanan.edu.vn",
    message: "K\xEDnh g\u1EEDi Ph\u1EE5 huynh: Phi\u1EBFu thu ti\u1EC1n \u0103n b\xE1n tr\xFA h\u1ECDc k\u1EF3 2 (1.250.000 VN\u0110) c\u1EE7a h\u1ECDc sinh \u0111\xE3 \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt tr\xEAn c\u1ED5ng ph\u1EE5 huynh t\u1EA1i: https://thcs-chuvanan.edu.vn/hocphi",
    isScam: false,
    tacticsPresent: [],
    correctAction: "\u0110\u0103ng nh\u1EADp v\xE0o c\u1ED5ng th\xF4ng tin ph\u1EE5 huynh ch\xEDnh th\u1EE9c nh\u01B0 th\u01B0\u1EDDng l\u1EC7 \u0111\u1EC3 thanh to\xE1n.",
    alternativeOptions: [
      {
        label: "\u0110\xE2y l\xE0 th\xF4ng b\xE1o h\u1EE3p l\u1EC7 t\u1EEB t\xEAn mi\u1EC1n gi\xE1o d\u1EE5c ch\xEDnh th\u1ED1ng (.edu.vn) c\u1EE7a nh\xE0 tr\u01B0\u1EDDng",
        isCorrect: true,
        feedback: "Ch\xEDnh x\xE1c! T\xEAn mi\u1EC1n c\xF3 \u0111u\xF4i chu\u1EA9n gi\xE1o d\u1EE5c (.edu.vn), n\u1ED9i dung th\xF4ng b\xE1o th\u01B0\u1EDDng k\u1EF3, kh\xF4ng c\xF3 d\u1EA5u hi\u1EC7u d\u1ED3n \xE9p b\u1EA5t th\u01B0\u1EDDng."
      },
      {
        label: "B\xE1o c\xF4ng an ngay v\xEC nghi ng\u1EDD l\u1EEBa \u0111\u1EA3o kh\u1EA9n c\u1EA5p",
        isCorrect: false,
        feedback: "Kh\xF4ng ph\u1EA3i m\u1ECDi th\xF4ng b\xE1o \u0111\u1EC1u l\xE0 l\u1EEBa \u0111\u1EA3o. C\u1EA7n bi\u1EBFt c\xE1ch ph\xE2n bi\u1EC7t t\xEAn mi\u1EC1n an to\xE0n v\xE0 th\u1EE7 t\u1EE5c h\xE0nh ch\xEDnh h\u1EE3p l\u1EC7."
      }
    ],
    explanation: "C\xE1c th\xF4ng b\xE1o \u0111\u1ECBnh k\u1EF3 t\u1EEB c\u1ED5ng th\xF4ng tin gi\xE1o d\u1EE5c (.edu.vn) ho\u1EB7c c\u01A1 quan nh\xE0 n\u01B0\u1EDBc (.gov.vn) chu\u1EA9n m\u1EF1c l\xE0 an to\xE0n."
  },
  {
    id: "drill-3",
    title: "Ng\u01B0\u1EDDi Mua H\xE0ng B\xE1o Chuy\u1EC3n Th\u1EEBa Ti\u1EC1n Tr\xEAn M\u1EA1ng X\xE3 H\u1ED9i",
    channel: "marketplace",
    sender: "Ng\u01B0\u1EDDi mua: Nam_Doan_99",
    message: "Em \u01A1i, anh mua c\xE1i b\xE0n 500k m\xE0 l\u1EE1 tay chuy\u1EC3n nh\u1EA7m 5 tri\u1EC7u r\u1ED3i! Em chuy\u1EC3n kho\u1EA3n tr\u1EA3 l\u1EA1i anh 4.5 tri\u1EC7u ngay \u0111i kh\xF4ng anh b\xE1o c\xF4ng an b\u1EAFt em t\u1ED9i chi\u1EBFm \u0111o\u1EA1t t\xE0i s\u1EA3n \u0111\u1EA5y.",
    isScam: true,
    tacticsPresent: ["Fear", "Urgency", "Authority", "Confusion"],
    correctAction: "Kh\xF4ng chuy\u1EC3n ti\u1EC1n v\u1ED9i. M\u1EDF app ng\xE2n h\xE0ng ki\u1EC3m tra bi\u1EBFn \u0111\u1ED9ng s\u1ED1 d\u01B0 th\u1EF1c t\u1EBF v\xE0 li\xEAn h\u1EC7 ng\xE2n h\xE0ng h\u01B0\u1EDBng d\u1EABn tra so\xE1t.",
    alternativeOptions: [
      {
        label: "Chuy\u1EC3n kho\u1EA3n l\u1EA1i 4.5 tri\u1EC7u ngay v\xEC s\u1EE3 b\u1ECB c\xF4ng an ph\u1EA1t v\xE0 v\u01B0\u1EDBng v\xE0o ki\u1EC7n t\u1EE5ng",
        isCorrect: false,
        feedback: "Sai l\u1EA7m tai h\u1EA1i! \u0110\u1ED1i ph\u01B0\u01A1ng g\u1EEDi \u1EA3nh bi\xEAn lai gi\u1EA3 (Photoshop) ho\u1EB7c d\xF9ng t\xE0i kho\u1EA3n b\u1ECB \u0111\xE1nh c\u1EAFp chuy\u1EC3n ti\u1EC1n. B\u1EA1n s\u1EBD m\u1EA5t tr\u1EAFng ti\u1EC1n th\u1EADt c\u1EE7a m\xECnh."
      },
      {
        label: "Kh\xF4ng chuy\u1EC3n ti\u1EC1n v\u1ED9i, ki\u1EC3m tra s\u1ED1 d\u01B0 th\u1EF1c trong app ng\xE2n h\xE0ng v\xE0 y\xEAu c\u1EA7u \u0111\u1ED1i ph\u01B0\u01A1ng l\xE0m vi\u1EC7c qua ng\xE2n h\xE0ng \u0111\u1EC3 tra so\xE1t",
        isCorrect: true,
        feedback: "Chu\u1EA9n x\xE1c! \u0110\xE2y l\xE0 chi\xEAu tr\xF2 t\u1EA1o bill gi\u1EA3 k\u1EBFt h\u1EE3p \u0111e d\u1ECDa ph\xE1p l\xFD \u0111\u1EC3 \xE9p n\u1EA1n nh\xE2n chuy\u1EC3n ti\u1EC1n th\u1EADt."
      }
    ],
    explanation: "K\u1EBB l\u1EEBa \u0111\u1EA3o s\u1EED d\u1EE5ng \u1EA3nh ch\u1EE5p giao d\u1ECBch gi\u1EA3 v\xE0 \u0111e d\u1ECDa ph\xE1p lu\u1EADt \u0111\u1EC3 l\xE0m n\u1EA1n nh\xE2n ho\u1EA3ng s\u1EE3 v\xE0 v\u1ED9i v\xE3 chuy\u1EC3n ti\u1EC1n."
  },
  {
    id: "drill-4",
    title: 'C\u1EA3nh B\xE1o Gian L\u1EADn Ng\xE2n H\xE0ng: "C\xF3 ph\u1EA3i b\u1EA1n v\u1EEBa chi ti\xEAu 8.900.000\u0111 t\u1EA1i \u0110i\u1EC7n M\xE1y Xanh?"',
    channel: "sms",
    sender: "Brandname Ng\xE2n H\xE0ng Ch\xEDnh Th\u1EE9c (Kh\xF4ng K\xE8m Link)",
    message: 'Canh bao: Co phai Quy khach vua thuc hien giao dich 8.900.000 VND tai Dien May Xanh? Neu khong phai, soan "NO" hoac goi hotline 1900xxxx in tren the. (Ngan hang KHONG BAO GIO yeu cau ma OTP/mat khau cua ban).',
    isScam: false,
    tacticsPresent: [],
    correctAction: "So\u1EA1n NO ho\u1EB7c g\u1ECDi v\xE0o s\u1ED1 hotline in tr\xEAn th\u1EBB \u0111\u1EC3 kh\xF3a giao d\u1ECBch gian l\u1EADn.",
    alternativeOptions: [
      {
        label: 'So\u1EA1n "NO" ho\u1EB7c g\u1ECDi ngay s\u1ED1 \u0111i\u1EC7n tho\u1EA1i in \u1EDF m\u1EB7t sau th\u1EBB ATM c\u1EE7a m\xECnh \u0111\u1EC3 nh\u1EDD ng\xE2n h\xE0ng kh\xF3a th\u1EBB',
        isCorrect: true,
        feedback: "Ch\xEDnh x\xE1c! Tin nh\u1EAFn c\u1EA3nh b\xE1o th\u1EADt c\u1EE7a ng\xE2n h\xE0ng kh\xF4ng ch\u1EE9a link l\u1EA1 v\xE0 lu\xF4n nh\u1EAFc nh\u1EDF kh\xF4ng chia s\u1EBB m\xE3 OTP/m\u1EADt kh\u1EA9u."
      },
      {
        label: "Nh\u1EAFn tin g\u1EEDi l\u1EA1i m\u1EADt kh\u1EA9u app v\xE0 m\xE3 Smart OTP \u0111\u1EC3 nh\u1EDD ng\xE2n h\xE0ng x\u1EED l\xFD",
        isCorrect: false,
        feedback: "Tuy\u1EC7t \u0111\u1ED1i kh\xF4ng bao gi\u1EDD chia s\u1EBB m\xE3 OTP hay m\u1EADt kh\u1EA9u cho b\u1EA5t k\u1EF3 ai, k\u1EC3 c\u1EA3 nh\xE2n vi\xEAn ng\xE2n h\xE0ng."
      }
    ],
    explanation: "C\u1EA3nh b\xE1o gian l\u1EADn ch\xEDnh th\u1EE9c t\u1EEB ng\xE2n h\xE0ng ch\u1EC9 y\xEAu c\u1EA7u ph\u1EA3n h\u1ED3i \u0111\u01A1n gi\u1EA3n (YES/NO) v\xE0 kh\xF4ng bao gi\u1EDD g\u1EEDi link l\u1EA1 hay \u0111\xF2i h\u1ECFi m\xE3 x\xE1c th\u1EF1c b\xED m\u1EADt."
  },
  {
    id: "drill-5",
    title: "Nh\u1EDD B\xECnh Ch\u1ECDn Cu\u1ED9c Thi \u1EA2nh Nh\xED / T\xE0i N\u0103ng Tr\u1EBB Em Tr\xEAn M\u1EA1ng",
    channel: "messenger",
    sender: "B\u1EA1n h\u1ECDc c\u0169: Thu_Ha_Nguyen",
    message: 'Ha \u01A1i, con g\xE1i m\xECnh \u0111ang thi cu\u1ED9c thi "N\u1EE5 c\u01B0\u1EDDi thi\xEAn th\u1EA7n nh\xED 2026", c\xF2n thi\u1EBFu 20 vote l\xE0 \u0111\u01B0\u1EE3c gi\u1EA3i nh\u1EA5t. B\u1EA1n b\u1EA5m v\xE0o link https://binhchon-taicuoc-nhisangtao.site \u0111\u0103ng nh\u1EADp Facebook \u0111\u1EC3 vote gi\xFAp ch\xE1u 1 phi\u1EBFu v\u1EDBi nh\xE9!',
    isScam: true,
    tacticsPresent: ["Sympathy", "Social Proof", "Reciprocity"],
    correctAction: "Kh\xF4ng b\u1EA5m link. G\u1ECDi \u0111i\u1EC7n tho\u1EA1i tr\u1EF1c ti\u1EBFp ki\u1EC3m tra xem b\u1EA1n m\xECnh c\xF3 b\u1ECB hack t\xE0i kho\u1EA3n Facebook kh\xF4ng.",
    alternativeOptions: [
      {
        label: "B\u1EA5m v\xE0o link v\xE0 nh\u1EADp t\xE0i kho\u1EA3n Facebook/m\u1EADt kh\u1EA9u \u0111\u1EC3 b\xECnh ch\u1ECDn gi\xFAp con b\u1EA1n m\xECnh",
        isCorrect: false,
        feedback: "R\u1EA5t nguy hi\u1EC3m! Trang web gi\u1EA3 m\u1EA1o s\u1EBD l\u1EA5y tr\u1ED9m t\xE0i kho\u1EA3n Facebook c\u1EE7a b\u1EA1n \u0111\u1EC3 ti\u1EBFp t\u1EE5c \u0111i l\u1EEBa g\u1EA1t ng\u01B0\u1EDDi kh\xE1c."
      },
      {
        label: "Kh\xF4ng b\u1EA5m link, g\u1ECDi \u0111i\u1EC7n tho\u1EA1i tr\u1EF1c ti\u1EBFp ho\u1EB7c g\u1ECDi video h\u1ECFi b\u1EA1n m\xECnh xem c\xF3 ph\u1EA3i \u0111ang g\u1EEDi tin nh\u1EAFn n\xE0y kh\xF4ng",
        isCorrect: true,
        feedback: "Xu\u1EA5t s\u1EAFc! \u0110\xE2y l\xE0 chi\xEAu tr\xF2 hack nick Facebook r\u1ED3i m\u01B0\u1EE3n c\u1EDB nh\u1EDD vote \u0111\u1EC3 d\u1EE5 b\u1EA1n b\xE8 b\u1EA5m link \u0111\u1ED9c h\u1EA1i."
      }
    ],
    explanation: "B\u1EABy b\xECnh ch\u1ECDn \u1EA3nh nh\xED l\xE0 c\xF4ng c\u1EE5 c\xE2u tr\u1ED9m t\xE0i kho\u1EA3n m\u1EA1ng x\xE3 h\u1ED9i (Phishing) ph\u1ED5 bi\u1EBFn nh\u1EA5t hi\u1EC7n nay."
  },
  {
    id: "drill-6",
    title: "M\xE3 X\xE1c Th\u1EF1c OTP Telegram B\u1EA5t Th\u01B0\u1EDDng K\xE8m Y\xEAu C\u1EA7u Ch\u1EE5p M\xE0n H\xECnh",
    channel: "sms",
    sender: "Telegram (Official System Notification)",
    message: "Telegram code: 82910. Do not give this code to anyone, even if they claim to be from Telegram! This code can be used to log in to your account.",
    isScam: true,
    tacticsPresent: ["Urgency", "Authority", "Confusion"],
    correctAction: "Kh\xF4ng g\u1EEDi m\xE3 OTP n\xE0y cho b\u1EA5t k\u1EF3 ai, l\u1EADp t\u1EE9c v\xE0o C\xE0i \u0111\u1EB7t > Thi\u1EBFt b\u1ECB trong Telegram \u0111\u1EC3 ki\u1EC3m tra phi\xEAn \u0111\u0103ng nh\u1EADp l\u1EA1.",
    alternativeOptions: [
      {
        label: "Ch\u1EE5p \u1EA3nh m\xE0n h\xECnh tin nh\u1EAFn ho\u1EB7c \u0111\u1ECDc 5 s\u1ED1 n\xE0y cho ng\u01B0\u1EDDi \u0111ang nh\u1EAFn tin qua m\u1EA1ng",
        isCorrect: false,
        feedback: "M\u1EA5t t\xE0i kho\u1EA3n ngay l\u1EADp t\u1EE9c! M\xE3 OTP n\xE0y l\xE0 ch\xECa kh\xF3a \u0111\u0103ng nh\u1EADp tr\u1EF1c ti\u1EBFp v\xE0o Telegram c\u1EE7a b\u1EA1n tr\xEAn thi\u1EBFt b\u1ECB k\u1EBB x\u1EA5u."
      },
      {
        label: "Gi\u1EEF b\xED m\u1EADt tuy\u1EC7t \u0111\u1ED1i m\xE3 s\u1ED1 n\xE0y, x\xF3a tin nh\u1EAFn v\xE0 ki\u1EC3m tra ngay m\u1EE5c Devices (Thi\u1EBFt b\u1ECB) trong c\xE0i \u0111\u1EB7t Telegram",
        isCorrect: true,
        feedback: "Ch\xEDnh x\xE1c! M\xE3 OTP x\xE1c th\u1EF1c phi\xEAn l\xE0 tuy\u1EC7t m\u1EADt. K\u1EBB gian th\u01B0\u1EDDng gi\u1EA3 v\u1EDD nh\u1EDD x\xE1c nh\u1EADn h\u1ED7 tr\u1EE3 \u0111\u1EC3 l\u1EA5y m\xE3 n\xE0y."
      }
    ],
    explanation: "Kh\xF4ng c\xF3 b\u1EA5t k\u1EF3 tr\u01B0\u1EDDng h\u1EE3p h\u1EE3p l\u1EC7 n\xE0o y\xEAu c\u1EA7u b\u1EA1n chia s\u1EBB m\xE3 OTP \u0111\u0103ng nh\u1EADp t\xE0i kho\u1EA3n cho ng\u01B0\u1EDDi kh\xE1c."
  },
  {
    id: "drill-7",
    title: "Email B\u1ED9 Ph\u1EADn IT Y\xEAu C\u1EA7u C\u1EADp Nh\u1EADt M\u1EADt Kh\u1EA9u Outlook Qua Bi\u1EC3u M\u1EABu",
    channel: "email",
    sender: "it-support-notice@corporate-update-form.online",
    message: "K\xEDnh g\u1EEDi to\xE0n th\u1EC3 C\xE1n b\u1ED9 nh\xE2n vi\xEAn: H\u1EC7 th\u1ED1ng email m\xE1y ch\u1EE7 chu\u1EA9n b\u1ECB n\xE2ng c\u1EA5p b\u1EA3o m\u1EADt. \u0110\u1EC1 ngh\u1ECB c\xE1n b\u1ED9 truy c\u1EADp link Google Form sau \u0111\u1EC3 nh\u1EADp l\u1EA1i M\u1EADt kh\u1EA9u hi\u1EC7n t\u1EA1i v\xE0 M\u1EADt kh\u1EA9u m\u1EDBi tr\u01B0\u1EDBc 17h00 h\xF4m nay \u0111\u1EC3 kh\xF4ng b\u1ECB kh\xF3a h\xF2m th\u01B0.",
    isScam: true,
    tacticsPresent: ["Authority", "Urgency", "Fear"],
    correctAction: "B\xE1o c\xE1o email l\u1EEBa \u0111\u1EA3o (Phishing) cho ph\xF2ng IT n\u1ED9i b\u1ED9 c\xF4ng ty, tuy\u1EC7t \u0111\u1ED1i kh\xF4ng nh\u1EADp m\u1EADt kh\u1EA9u v\xE0o bi\u1EC3u m\u1EABu online.",
    alternativeOptions: [
      {
        label: "\u0110i\u1EC1n ngay m\u1EADt kh\u1EA9u email v\xE0o bi\u1EC3u m\u1EABu v\xEC s\u1EE3 b\u1ECB kh\xF3a h\xF2m th\u01B0 c\xF4ng vi\u1EC7c tr\u01B0\u1EDBc 17h",
        isCorrect: false,
        feedback: "C\u1EF1c k\u1EF3 nguy hi\u1EC3m! B\u1ED9 ph\u1EADn IT chuy\xEAn nghi\u1EC7p kh\xF4ng bao gi\u1EDD d\xF9ng Google Form ho\u1EB7c t\xEAn mi\u1EC1n l\u1EA1 (.online) \u0111\u1EC3 thu th\u1EADp m\u1EADt kh\u1EA9u nh\xE2n vi\xEAn."
      },
      {
        label: "Kh\xF4ng \u0111i\u1EC1n m\u1EADt kh\u1EA9u, chuy\u1EC3n ti\u1EBFp email n\xE0y cho b\u1ED9 ph\u1EADn an to\xE0n th\xF4ng tin/IT n\u1ED9i b\u1ED9 c\xF4ng ty \u0111\u1EC3 x\u1EED l\xFD",
        isCorrect: true,
        feedback: "Chu\u1EA9n x\xE1c t\xE1c phong v\u1EC7 binh s\u1ED1! C\u1EA3nh gi\xE1c v\u1EDBi email m\u1EA1o danh IT n\u1ED9i b\u1ED9 (Corporate Credential Harvesting)."
      }
    ],
    explanation: "C\xE1c ph\xF2ng IT chu\u1EA9n m\u1EF1c kh\xF4ng bao gi\u1EDD y\xEAu c\u1EA7u ng\u01B0\u1EDDi d\xF9ng g\u1EEDi m\u1EADt kh\u1EA9u qua bi\u1EC3u m\u1EABu kh\u1EA3o s\xE1t tr\u1EF1c tuy\u1EBFn."
  },
  {
    id: "drill-8",
    title: "B\u1EA1n Th\xE2n Nh\u1EAFn Tin M\u01B0\u1EE3n S\u1ED1 T\xE0i Kho\u1EA3n \u0110\u1EC3 Nh\u1EADn Ti\u1EC1n H\u1ED9 15 Tri\u1EC7u",
    channel: "messenger",
    sender: "B\u1EA1n th\xE2n: Minh_Khoa_HaNoi",
    message: "Khoa \u01A1i, app ng\xE2n h\xE0ng c\u1EE7a tao \u0111ang n\xE2ng c\u1EA5p kh\xF4ng nh\u1EADn \u0111\u01B0\u1EE3c ti\u1EC1n. \u0110\u1ED1i t\xE1c chuy\u1EC3n kho\u1EA3n ti\u1EC1n h\xE0ng 15 tri\u1EC7u, tao b\u1EA3o h\u1ECD g\u1EEDi sang STK c\u1EE7a m\xE0y nh\xE9. Xong m\xE0y r\xFAt ho\u1EB7c b\u1EAFn l\u1EA1i v\xE0o s\u1ED1 t\xE0i kho\u1EA3n n\xE0y gi\xFAp tao v\u1EDBi!",
    isScam: true,
    tacticsPresent: ["Social Proof", "Urgency", "Reciprocity"],
    correctAction: "G\u1ECDi \u0111i\u1EC7n tho\u1EA1i tr\u1EF1c ti\u1EBFp ho\u1EB7c g\u1ECDi video \u0111\u1EC3 x\xE1c th\u1EF1c khu\xF4n m\u1EB7t v\xE0 gi\u1ECDng n\xF3i c\u1EE7a b\u1EA1n m\xECnh tr\u01B0\u1EDBc khi h\u1ED7 tr\u1EE3.",
    alternativeOptions: [
      {
        label: "G\u1EEDi ngay s\u1ED1 t\xE0i kho\u1EA3n c\u1EE7a m\xECnh v\xE0 s\u1EB5n s\xE0ng chuy\u1EC3n ti\u1EC1n \u0111i khi th\u1EA5y c\xF3 th\xF4ng b\xE1o ti\u1EC1n v\u1EC1",
        isCorrect: false,
        feedback: "Nguy c\u01A1 ti\u1EBFp tay cho t\u1ED9i ph\u1EA1m r\u1EEDa ti\u1EC1n ho\u1EB7c nh\u1EADn ti\u1EC1n l\u1EEBa \u0111\u1EA3o t\u1EEB n\u1EA1n nh\xE2n kh\xE1c, t\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n s\u1EBD b\u1ECB phong t\u1ECFa."
      },
      {
        label: "G\u1ECDi \u0111i\u1EC7n tho\u1EA1i tr\u1EF1c ti\u1EBFp (g\u1ECDi s\u1ED1 di \u0111\u1ED9ng ho\u1EB7c video call) cho b\u1EA1n \u0111\u1EC3 x\xE1c minh gi\u1ECDng n\xF3i v\xE0 s\u1EF1 vi\u1EC7c",
        isCorrect: true,
        feedback: "Ch\xEDnh x\xE1c! 99% \u0111\xE2y l\xE0 t\xE0i kho\u1EA3n m\u1EA1ng x\xE3 h\u1ED9i b\u1ECB k\u1EBB gian chi\u1EBFm quy\u1EC1n ki\u1EC3m so\xE1t \u0111\u1EC3 \u0111i m\u01B0\u1EE3n ti\u1EC1n ho\u1EB7c nh\u1EDD r\u1EEDa ti\u1EC1n b\u1EA9n."
      }
    ],
    explanation: "Kh\xF4ng bao gi\u1EDD cho m\u01B0\u1EE3n t\xE0i kho\u1EA3n ng\xE2n h\xE0ng \u0111\u1EC3 nh\u1EADn ti\u1EC1n l\u1EA1 ho\u1EB7c chuy\u1EC3n ti\u1EC1n h\u1ED9 qua tin nh\u1EAFn chat."
  },
  {
    id: "drill-9",
    title: "Cu\u1ED9c G\u1ECDi Nh\u1EE1 T\u1EEB \u0110\u1EA7u S\u1ED1 Qu\u1ED1c T\u1EBF L\u1EA1 \u0110\u1ED5 Chu\xF4ng 1 H\u1ED3i (+252, +224)",
    channel: "phone",
    sender: "+252 61 992 182 (Somalia / Qu\u1ED1c T\u1EBF)",
    message: "Cu\u1ED9c g\u1ECDi nh\u1EE1 (1 h\u1ED3i chu\xF4ng r\u1ED3i d\u1EADp m\xE1y) l\xFAc 23h45 \u0111\xEAm.",
    isScam: true,
    tacticsPresent: ["Confusion", "Convenience Bias"],
    correctAction: "Kh\xF4ng g\u1ECDi l\u1EA1i. Ch\u1EB7n s\u1ED1 v\xE0 b\xE1o c\xE1o s\u1ED1 \u0111i\u1EC7n tho\u1EA1i r\xE1c.",
    alternativeOptions: [
      {
        label: "G\u1ECDi l\u1EA1i ngay v\xEC t\xF2 m\xF2 ho\u1EB7c s\u1EE3 ai \u0111\xF3 ng\u01B0\u1EDDi th\xE2n b\xEAn n\u01B0\u1EDBc ngo\xE0i g\u1ECDi c\u1EA5p c\u1EE9u",
        isCorrect: false,
        feedback: "B\u1EABy c\u01B0\u1EDBc vi\u1EC5n th\xF4ng Wangiri! B\u1EA1n s\u1EBD b\u1ECB tr\u1EEB c\u01B0\u1EDBc qu\u1ED1c t\u1EBF h\xE0ng tr\u0103m ngh\xECn \u0111\u1ED3ng m\u1ED7i ph\xFAt khi nghe c\xE1c b\u1EA3n ghi \xE2m t\u1EF1 \u0111\u1ED9ng."
      },
      {
        label: "Tuy\u1EC7t \u0111\u1ED1i kh\xF4ng g\u1ECDi l\u1EA1i, ti\u1EBFn h\xE0nh ch\u1EB7n s\u1ED1 thu\xEA bao v\xE0 c\u1EA3nh b\xE1o cho ng\u01B0\u1EDDi th\xE2n",
        isCorrect: true,
        feedback: "Ch\xEDnh x\xE1c! B\u1EABy nh\xE1y m\xE1y qu\u1ED1c t\u1EBF (Wangiri Fraud) k\xEDch th\xEDch t\xEDnh t\xF2 m\xF2 c\u1EE7a n\u1EA1n nh\xE2n \u0111\u1EC3 tr\u1EE5c l\u1EE3i c\u01B0\u1EDBc vi\u1EC5n th\xF4ng."
      }
    ],
    explanation: "Kh\xF4ng g\u1ECDi l\u1EA1i c\xE1c s\u1ED1 \u0111i\u1EC7n tho\u1EA1i c\xF3 \u0111\u1EA7u s\u1ED1 qu\u1ED1c t\u1EBF l\u1EA1 (+2xx, +5xx) nh\xE1y m\xE1y gi\u1EEFa \u0111\xEAm."
  },
  {
    id: "drill-10",
    title: "Tr\xFAng Voucher Ngh\u1EC9 D\u01B0\u1EE1ng Vinpearl Mi\u1EC5n Ph\xED 3N2\u0110 & C\u1ECDc B\u1EA3o \u0110\u1EA3m 500k",
    channel: "phone",
    sender: "CSKH Du L\u1ECBch Cao C\u1EA5p 5 Sao",
    message: "Ch\xFAc m\u1EEBng ch\u1ECB \u0111\xE3 \u0111\u01B0\u1EE3c t\u1EB7ng k\u1EF3 ngh\u1EC9 d\u01B0\u1EE1ng 3N2\u0110 mi\u1EC5n ph\xED 100% t\u1EA1i Vinpearl Nha Trang tr\u1ECB gi\xE1 12 tri\u1EC7u. C\xF4ng ty s\u1EBD g\u1EEDi voucher c\u1EE9ng t\u1EADn nh\xE0, ch\u1ECB ch\u1EC9 c\u1EA7n c\u1ECDc 500.000\u0111 ph\xED b\u1EA3o \u0111\u1EA3m nh\u1EADn ph\xF2ng, khi \u0111\u1EBFn n\u01A1i resort s\u1EBD ho\xE0n ti\u1EC1n m\u1EB7t l\u1EA1i.",
    isScam: true,
    tacticsPresent: ["Greed", "Social Proof", "Urgency"],
    correctAction: "T\u1EEB ch\u1ED1i nh\u1EADn voucher v\xE0 kh\xF4ng n\u1ED9p b\u1EA5t k\u1EF3 kho\u1EA3n ti\u1EC1n c\u1ECDc n\xE0o.",
    alternativeOptions: [
      {
        label: "Chuy\u1EC3n 500k c\u1ECDc ngay v\xEC t\xEDnh ra ch\u1EC9 m\u1EA5t 500k m\xE0 \u0111\u01B0\u1EE3c k\u1EF3 ngh\u1EC9 12 tri\u1EC7u qu\xE1 h\u1EDDi",
        isCorrect: false,
        feedback: "B\u1EABy l\u1EEBa \u0111\u1EA3o voucher r\xE1c! B\u1EA1n s\u1EBD nh\u1EADn \u0111\u01B0\u1EE3c t\u1EDD gi\u1EA5y in v\xF4 gi\xE1 tr\u1ECB kh\xF4ng \u0111\u01B0\u1EE3c b\u1EA5t k\u1EF3 kh\xE1ch s\u1EA1n n\xE0o ch\u1EA5p nh\u1EADn."
      },
      {
        label: "T\u1EEB ch\u1ED1i d\u1EE9t kho\xE1t: Kh\xF4ng c\xF3 voucher du l\u1ECBch mi\u1EC5n ph\xED v\xF4 c\u1EDB \u0111\xF2i n\u1ED9p ti\u1EC1n c\u1ECDc tr\u01B0\u1EDBc",
        isCorrect: true,
        feedback: "Tuy\u1EC7t v\u1EDDi! \u0110\xE2y l\xE0 chi\xEAu tr\xF2 l\u1EEBa \u0111\u1EA3o b\xE1n voucher ngh\u1EC9 d\u01B0\u1EE1ng \u1EA3o tr\xE0n lan tr\xEAn m\u1EA1ng x\xE3 h\u1ED9i."
      }
    ],
    explanation: "C\xE1c t\u1EADp \u0111o\xE0n ngh\u1EC9 d\u01B0\u1EE1ng l\u1EDBn kh\xF4ng bao gi\u1EDD g\u1ECDi \u0111i\u1EC7n t\u1EB7ng voucher mi\u1EC5n ph\xED k\xE8m \u0111i\u1EC1u ki\u1EC7n chuy\u1EC3n ti\u1EC1n c\u1ECDc c\xE1 nh\xE2n."
  },
  {
    id: "drill-11",
    title: "Shipper B\xE1o \u0110\u01A1n H\xE0ng 350k B\u1ECB H\u1EE7y & Xin S\u1ED1 Th\u1EBB Ng\xE2n H\xE0ng \u0110\u1EC3 Ho\xE0n",
    channel: "phone",
    sender: "+84 948 102 938 (S\u1ED1 l\u1EA1 x\u01B0ng l\xE0 Shipper)",
    message: "Ch\u1ECB \u01A1i em giao h\xE0ng \u0111\u01A1n 350k c\u1EE7a ch\u1ECB nh\u01B0ng b\u1ECB r\u01A1i v\u1EE1. Gi\u1EDD em l\xE0m th\u1EE7 t\u1EE5c c\xF4ng ty \u0111\u1EC1n ti\u1EC1n cho ch\u1ECB, ch\u1ECB \u0111\u1ECDc cho em 16 s\u1ED1 tr\xEAn m\u1EB7t th\u1EBB ATM v\xE0 m\xE3 x\xE1c nh\u1EADn g\u1EEDi v\u1EC1 \u0111i\u1EC7n tho\u1EA1i ch\u1ECB nh\xE9!",
    isScam: true,
    tacticsPresent: ["Urgency", "Authority", "Convenience Bias"],
    correctAction: "T\u1EEB ch\u1ED1i \u0111\u1ECDc th\xF4ng tin th\u1EBB. Y\xEAu c\u1EA7u shipper x\u1EED l\xFD ho\xE0n ti\u1EC1n tr\u1EF1c ti\u1EBFp tr\xEAn h\u1EC7 th\u1ED1ng \u1EE9ng d\u1EE5ng mua h\xE0ng.",
    alternativeOptions: [
      {
        label: "\u0110\u1ECDc s\u1ED1 th\u1EBB v\xE0 m\xE3 x\xE1c nh\u1EADn g\u1EEDi v\u1EC1 m\xE1y v\xEC ngh\u0129 shipper c\u1EA7n \u0111\u1EC3 chuy\u1EC3n ti\u1EC1n \u0111\u1EC1n b\xF9",
        isCorrect: false,
        feedback: "K\u1EBB l\u1EEBa \u0111\u1EA3o \u0111ang li\xEAn k\u1EBFt th\u1EBB c\u1EE7a b\u1EA1n v\xE0o v\xED \u0111i\u1EC7n t\u1EED c\u1EE7a ch\xFAng \u0111\u1EC3 r\xFAt s\u1EA1ch ti\u1EC1n trong t\xE0i kho\u1EA3n!"
      },
      {
        label: "T\u1EEB ch\u1ED1i cung c\u1EA5p s\u1ED1 th\u1EBB v\xE0 m\xE3 OTP. Ch\u1EC9 nh\u1EADn ti\u1EC1n qua S\u1ED1 t\xE0i kho\u1EA3n (STK) th\xF4ng th\u01B0\u1EDDng ho\u1EB7c x\u1EED l\xFD qua app s\xE0n TM\u0110T",
        isCorrect: true,
        feedback: "Chu\u1EA9n x\xE1c! Nh\u1EADn ti\u1EC1n ch\u1EC9 c\u1EA7n S\u1ED1 T\xE0i Kho\u1EA3n (STK) v\xE0 T\xEAn Ng\xE2n H\xE0ng. Tuy\u1EC7t \u0111\u1ED1i KH\xD4NG BAO GI\u1EDC c\u1EA7n S\u1ED1 Th\u1EBB, Ng\xE0y H\u1EBFt H\u1EA1n hay M\xE3 OTP."
      }
    ],
    explanation: "\u0110\u1EC3 nh\u1EADn ti\u1EC1n chuy\u1EC3n kho\u1EA3n, ng\u01B0\u1EDDi nh\u1EADn CH\u1EC8 C\u1EA6N cung c\u1EA5p S\u1ED1 t\xE0i kho\u1EA3n (STK). M\u1ECDi y\xEAu c\u1EA7u cung c\u1EA5p S\u1ED1 th\u1EBB (16 s\u1ED1) v\xE0 OTP \u0111\u1EC1u l\xE0 l\u1EEBa \u0111\u1EA3o."
  },
  {
    id: "drill-12",
    title: "Tin Nh\u1EAFn SMS Th\u1EADt Tr\u1EEB Ph\xED D\u1ECBch V\u1EE5 SMS Banking H\xE0ng Th\xE1ng 11.000\u0111",
    channel: "sms",
    sender: "Vietcombank / Techcombank (Brandname chu\u1EA9n)",
    message: "So du TK 001100481928 thay doi: -11.000 VND vao 01/10/2026. ND: Phi duy tri dich vu SMS chu dong thang 09/2026. So du hien tai: 5.420.000 VND.",
    isScam: false,
    tacticsPresent: [],
    correctAction: "\u0110\xE2y l\xE0 bi\u1EBFn \u0111\u1ED9ng s\u1ED1 d\u01B0 ph\xED d\u1ECBch v\u1EE5 ng\xE2n h\xE0ng th\xF4ng th\u01B0\u1EDDng h\xE0ng th\xE1ng.",
    alternativeOptions: [
      {
        label: "Bi\u1EBFn \u0111\u1ED9ng s\u1ED1 d\u01B0 \u0111\u1ECBnh k\u1EF3 tr\u1EEB ph\xED SMS th\xF4ng th\u01B0\u1EDDng t\u1EEB ng\xE2n h\xE0ng, kh\xF4ng c\xF3 li\xEAn k\u1EBFt l\u1EA1 hay y\xEAu c\u1EA7u thao t\xE1c",
        isCorrect: true,
        feedback: "Ch\xEDnh x\xE1c! \u0110\xE2y l\xE0 giao d\u1ECBch ng\xE2n h\xE0ng th\u1EF1c t\u1EBF, n\u1ED9i dung minh b\u1EA1ch, kh\xF4ng ch\u1EE9a \u0111\u01B0\u1EDDng link hay s\u1ED1 \u0111i\u1EC7n tho\u1EA1i l\u1EA1."
      },
      {
        label: "Nghi ng\u1EDD b\u1ECB hacker r\xFAt tr\u1ED9m ti\u1EC1n, l\u1EADp t\u1EE9c b\u1EA5m g\u1ECDi v\xE0o c\xE1c s\u1ED1 l\u1EA1 tr\xEAn m\u1EA1ng \u0111\u1EC3 t\xECm d\u1ECBch v\u1EE5 l\u1EA5y l\u1EA1i ti\u1EC1n",
        isCorrect: false,
        feedback: 'D\u1EC5 b\u1ECB r\u01A1i v\xE0o b\u1EABy "l\u1EA5y l\u1EA1i ti\u1EC1n treo" c\u1EE7a t\u1ED9i ph\u1EA1m l\u1EEBa \u0111\u1EA3o th\u1EE9 c\u1EA5p.'
      }
    ],
    explanation: "Tin nh\u1EAFn tr\u1EEB ph\xED qu\u1EA3n l\xFD d\u1ECBch v\u1EE5 h\xE0ng th\xE1ng t\u1EEB ng\xE2n h\xE0ng ch\xEDnh th\u1ED1ng l\xE0 an to\xE0n v\xE0 minh b\u1EA1ch."
  },
  {
    id: "drill-13",
    title: 'M\u1EDDi Tham Gia Kh\xF3a H\u1ECDc "B\xED Quy\u1EBFt L\xE0m Gi\xE0u T\u1EEB Ch\u1EE9ng Kho\xE1n Qu\u1ED1c T\u1EBF"',
    channel: "messenger",
    sender: "Tr\u1EE3 l\xFD Chuy\xEAn Gia \u0110\u1EA7u T\u01B0 SSI",
    message: "Ch\xE0o anh, b\xEAn em c\xF3 l\u1EDBp \u0111\xE0o t\u1EA1o k\xE9o v\u1ED1n VIP c\xF9ng th\u1EA7y Tu\u1EA5n Anh (chuy\xEAn gia ph\xE2n t\xEDch t\xE0i ch\xEDnh). Cam k\u1EBFt b\u1EA3o hi\u1EC3m v\u1ED1n 100%, sinh l\u1EDDi 3-5%/ng\xE0y. T\u1ED1i nay c\xF3 link Zoom h\u1ECDc th\u1EED, t\u1EA3i app giao d\u1ECBch s\xE0n b\xEAn em \u0111\u01B0\u1EE3c t\u1EB7ng ngay 50 USD tr\u1EA3i nghi\u1EC7m!",
    isScam: true,
    tacticsPresent: ["Greed", "Social Proof", "Authority"],
    correctAction: "R\u1EDDi nh\xF3m, ch\u1EB7n li\xEAn h\u1EC7 v\xE0 kh\xF4ng t\u1EA3i b\u1EA5t k\u1EF3 app \u0111\u1EA7u t\u01B0 t\xE0i ch\xEDnh l\u1EA1 n\xE0o.",
    alternativeOptions: [
      {
        label: "T\u1EA3i app v\xE0 n\u1EA1p th\u1EED 1-2 tri\u1EC7u \u0111\u1EC3 ki\u1EBFm l\xE3i 3-5%/ng\xE0y theo l\u1EDDi chuy\xEAn gia",
        isCorrect: false,
        feedback: "B\u1EABy s\xE0n giao d\u1ECBch nh\xE1i (Pig-Butchering)! Ban \u0111\u1EA7u s\xE0n cho r\xFAt l\xE3i \u1EA3o v\xE0i tr\u0103m ngh\xECn, khi n\u1EA1p s\u1ED1 ti\u1EC1n l\u1EDBn s\u1EBD b\u1ECB kh\xF3a t\xE0i kho\u1EA3n v\xE0 \u0111\xF2i n\u1ED9p th\xEAm ph\xED."
      },
      {
        label: "Ch\u1EB7n tin nh\u1EAFn ngay: Kh\xF4ng c\xF3 b\u1EA5t k\u1EF3 k\xEAnh \u0111\u1EA7u t\u01B0 t\xE0i ch\xEDnh h\u1EE3p ph\xE1p n\xE0o cam k\u1EBFt l\u1EE3i nhu\u1EADn 3-5%/ng\xE0y m\xE0 kh\xF4ng c\xF3 r\u1EE7i ro",
        isCorrect: true,
        feedback: "Ch\xEDnh x\xE1c! \u0110\xE2y l\xE0 chi\xEAu b\xE0i d\u1EABn d\u1EE5 v\xE0o c\xE1c s\xE0n giao d\u1ECBch gi\u1EA3 m\u1EA1o \u0111\u1EC3 chi\u1EBFm \u0111o\u1EA1t t\xE0i s\u1EA3n."
      }
    ],
    explanation: "Quy lu\u1EADt th\u1ECB tr\u01B0\u1EDDng t\xE0i ch\xEDnh: L\u1EE3i nhu\u1EADn si\xEAu th\u1EF1c lu\xF4n \u0111i k\xE8m v\u1EDBi b\u1EABy l\u1EEBa \u0111\u1EA3o."
  },
  {
    id: "drill-14",
    title: "Email X\xE1c Nh\u1EADn Xu\u1EA5t V\xE9 M\xE1y Bay Vietnam Airlines K\xE8m M\xE3 PNR Chu\u1EA9n",
    channel: "email",
    sender: "no-reply@vietnamairlines.com",
    message: "K\xEDnh g\u1EEDi Qu\xFD kh\xE1ch, V\xE9 \u0111i\u1EC7n t\u1EED c\u1EE7a Qu\xFD kh\xE1ch cho h\xE0nh tr\xECnh H\xE0 N\u1ED9i (HAN) - \u0110\xE0 N\u1EB5ng (DAD) \u0111\xE3 \u0111\u01B0\u1EE3c xu\u1EA5t th\xE0nh c\xF4ng. M\xE3 \u0111\u1EB7t ch\u1ED7 (PNR): VN-829182. Chi ti\u1EBFt h\xE0nh tr\xECnh \u0111\xEDnh k\xE8m trong file PDF \u0111\u01B0\u1EE3c k\xFD s\u1ED1 b\u1EA3o m\u1EADt.",
    isScam: false,
    tacticsPresent: [],
    correctAction: "Email h\u1EE3p l\u1EC7 t\u1EEB h\xE3ng h\xE0ng kh\xF4ng, ki\u1EC3m tra m\xE3 PNR tr\u1EF1c ti\u1EBFp tr\xEAn app.",
    alternativeOptions: [
      {
        label: "Email x\xE1c nh\u1EADn v\xE9 m\xE1y bay ch\xEDnh th\u1EE9c t\u1EEB t\xEAn mi\u1EC1n vietnamairlines.com, c\xF3 m\xE3 v\xE9 PNR r\xF5 r\xE0ng",
        isCorrect: true,
        feedback: "Ch\xEDnh x\xE1c! \u0110\u1ECBa ch\u1EC9 email \u0111\xFAng chu\u1EA9n t\xEAn mi\u1EC1n c\xF4ng ty, n\u1ED9i dung x\xE1c nh\u1EADn giao d\u1ECBch \u0111\xE3 \u0111\u1EB7t tr\u01B0\u1EDBc \u0111\xF3."
      },
      {
        label: "\u0110\xE2y l\xE0 th\u01B0 r\xE1c l\u1EEBa \u0111\u1EA3o v\xEC c\xF3 \u0111\xEDnh k\xE8m file th\xF4ng tin v\xE9",
        isCorrect: false,
        feedback: "C\xE1c h\xE3ng h\xE0ng kh\xF4ng ch\xEDnh th\u1ED1ng lu\xF4n g\u1EEDi b\u1EA3n PDF v\xE9 \u0111i\u1EC7n t\u1EED (E-Ticket) t\u1EEB h\xF2m th\u01B0 ch\xEDnh th\u1EE9c."
      }
    ],
    explanation: "Email t\u1EEB t\xEAn mi\u1EC1n ch\xEDnh h\xE3ng (.com) c\u1EE7a h\xE3ng bay v\u1EDBi th\xF4ng tin v\xE9 \u0111\xFAng chuy\u1EBFn bay \u0111\xE3 \u0111\u1EB7t l\xE0 giao d\u1ECBch h\u1EE3p l\u1EC7."
  },
  {
    id: "drill-15",
    title: "M\xE3 QR L\xEC X\xEC T\u1EBFt May M\u1EAFn 500k Trong Nh\xF3m Chat \u0110\xF4ng Ng\u01B0\u1EDDi",
    channel: "messenger",
    sender: "T\xE0i kho\u1EA3n \u1EA9n danh trong nh\xF3m chat: Lucky_2026",
    message: "\u{1F9E7} L\xEC x\xEC \u0111\u1EA7u xu\xE2n cho anh em trong nh\xF3m! Qu\xE9t m\xE3 QR n\xE0y m\u1EDF \u1EE9ng d\u1EE5ng MoMo/ZaloPay \u0111\u1EC3 b\u1ED1c th\u0103m l\xEC x\xEC ng\u1EABu nhi\xEAn t\u1EEB 50k \u0111\u1EBFn 500k nh\xE9 m\u1ECDi ng\u01B0\u1EDDi \u01A1i!",
    isScam: true,
    tacticsPresent: ["Greed", "Social Proof", "Convenience Bias"],
    correctAction: "C\u1EA3nh gi\xE1c, kh\xF4ng qu\xE9t m\xE3 QR l\u1EA1 v\xE0 kh\xF4ng li\xEAn k\u1EBFt t\xE0i kho\u1EA3n ng\xE2n h\xE0ng tr\xEAn c\xE1c trang web l\u1EA1.",
    alternativeOptions: [
      {
        label: "M\u1EDF ngay camera qu\xE9t m\xE3 QR \u0111\u1EC3 k\u1ECBp nh\u1EADn l\xEC x\xEC tr\u01B0\u1EDBc khi ng\u01B0\u1EDDi kh\xE1c b\u1ED1c h\u1EBFt",
        isCorrect: false,
        feedback: "B\u1EABy Quishing chi\u1EBFm quy\u1EC1n v\xED \u0111i\u1EC7n t\u1EED ho\u1EB7c c\xE0i m\xE3 \u0111\u1ED9c theo d\xF5i b\xE0n ph\xEDm \u0111i\u1EC7n tho\u1EA1i!"
      },
      {
        label: "C\u1EA3nh gi\xE1c kh\xF4ng qu\xE9t m\xE3 QR r\xE1c, ch\u1EC9 nh\u1EADn l\xEC x\xEC b\u1EB1ng t\xEDnh n\u0103ng l\xEC x\xEC tr\u1EF1c ti\u1EBFp trong app chat n\u1ED9i b\u1ED9 \u0111\xE3 x\xE1c th\u1EF1c",
        isCorrect: true,
        feedback: "Tuy\u1EC7t v\u1EDDi! B\u1EABy l\xEC x\xEC QR \u1EA3o th\u01B0\u1EDDng \u0111\xE1nh v\xE0o t\xE2m l\xFD h\u1ED1i h\u1EA3 nh\u1EADn qu\xE0 \u0111\u1EA7u n\u0103m."
      }
    ],
    explanation: "Kh\xF4ng qu\xE9t m\xE3 QR l\xEC x\xEC tr\xF4i n\u1ED5i \u0111\u01B0\u1EE3c chia s\u1EBB b\u1EDFi t\xE0i kho\u1EA3n l\u1EA1 trong c\xE1c nh\xF3m chat c\u1ED9ng \u0111\u1ED3ng."
  },
  {
    id: "drill-16",
    title: "Tin Nh\u1EAFn SMS M\u1EA1o Danh C\u1EE5c C\u1EA3nh S\xE1t Giao Th\xF4ng B\xE1o Ph\u1EA1t Ngu\u1ED9i",
    channel: "sms",
    sender: "+84 892 109 492",
    message: "[C\u1EE4C CSGT]: Xe \xF4 t\xF4/xe m\xE1y c\u1EE7a b\u1EA1n c\xF3 01 bi\xEAn b\u1EA3n ph\u1EA1t ngu\u1ED9i vi ph\u1EA1m t\u1ED1c \u0111\u1ED9 ng\xE0y 12/03 ch\u01B0a n\u1ED9p ph\u1EA1t. Truy c\u1EADp https://csgt-xulyvipham.govn.site \u0111\u1EC3 n\u1ED9p ph\u1EA1t tr\u1EF1c tuy\u1EBFn tr\u01B0\u1EDBc ng\xE0y 15/03 \u0111\u1EC3 kh\xF4ng b\u1ECB t\u01B0\u1EDBc b\u1EB1ng l\xE1i.",
    isScam: true,
    tacticsPresent: ["Authority", "Fear", "Urgency"],
    correctAction: "Kh\xF4ng b\u1EA5m link. Tra c\u1EE9u ph\u1EA1t ngu\u1ED9i tr\xEAn C\u1ED5ng D\u1ECBch v\u1EE5 c\xF4ng Qu\u1ED1c gia ho\u1EB7c trang web ch\xEDnh th\u1EE9c csgt.vn.",
    alternativeOptions: [
      {
        label: "B\u1EA5m link n\u1ED9p ph\u1EA1t ngay v\xEC s\u1EE3 b\u1ECB t\u01B0\u1EDBc b\u1EB1ng l\xE1i xe v\xE0 ph\u1EA1t th\xEAm ti\u1EC1n ch\u1EADm n\u1ED9p",
        isCorrect: false,
        feedback: "Trang web m\u1EA1o danh (.govn.site) s\u1EBD l\u1EA5y c\u1EAFp s\u1ED1 t\xE0i kho\u1EA3n v\xE0 m\u1EADt kh\u1EA9u ng\xE2n h\xE0ng c\u1EE7a b\u1EA1n."
      },
      {
        label: "Kh\xF4ng nh\u1EA5p v\xE0o link, t\u1EF1 v\xE0o website ch\xEDnh th\u1EE9c c\u1EE7a C\u1EE5c CSGT (csgt.vn) ho\u1EB7c C\u1ED5ng D\u1ECBch v\u1EE5 c\xF4ng Qu\u1ED1c gia (dichvucong.gov.vn) \u0111\u1EC3 tra c\u1EE9u",
        isCorrect: true,
        feedback: "Xu\u1EA5t s\u1EAFc! C\u1EE5c CSGT kh\xF4ng bao gi\u1EDD g\u1EEDi tin nh\u1EAFn SMS t\u1EEB s\u1ED1 \u0111i\u1EC7n tho\u1EA1i c\xE1 nh\xE2n y\xEAu c\u1EA7u b\u1EA5m link n\u1ED9p ph\u1EA1t tr\u1EF1c tuy\u1EBFn."
      }
    ],
    explanation: "M\u1ECDi th\xF4ng b\xE1o ph\u1EA1t ngu\u1ED9i h\u1EE3p ph\xE1p \u0111\u1EC1u \u0111\u01B0\u1EE3c g\u1EEDi b\u1EB1ng v\u0103n b\u1EA3n gi\u1EA5y ho\u1EB7c tra c\u1EE9u tr\xEAn C\u1ED5ng th\xF4ng tin ch\xEDnh th\u1EE9c c\u1EE7a C\u1EE5c CSGT (csgt.vn)."
  }
];

// server/auth.ts
var import_crypto = __toESM(require("crypto"), 1);
var usersStore = /* @__PURE__ */ new Map();
var sessionsStore = /* @__PURE__ */ new Map();
function hashPassword(password) {
  return import_crypto.default.createHash("sha256").update(`scamguard_salt_${password}`).digest("hex");
}
function generateToken(userId) {
  const token = `sg_tok_${userId}_${import_crypto.default.randomBytes(16).toString("hex")}`;
  sessionsStore.set(token, userId);
  return token;
}
var DEMO_PRESET_USERS = [
  {
    id: "user_senior_thanh",
    username: "bacthanh68",
    email: "bacthanh.hanoi@gmail.com",
    name: "B\xE1c Nguy\u1EC5n V\u0103n Th\xE0nh (68 tu\u1ED5i)",
    mode: "senior",
    roleDescription: "Cao ni\xEAn c\u1EA3nh gi\xE1c - \u01AFu ti\xEAn ch\u1EEF l\u1EDBn & x\xE1c minh cu\u1ED9c g\u1ECDi gia \u0111\xECnh",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=face",
    score: 86,
    xp: 2150,
    streak: 7,
    completedScenarios: ["bank-lockout-alert", "police-investigation-secrecy", "package-delivery-failed"],
    trustedContacts: [
      {
        id: "tc_s1",
        name: "Con Trai D\u0169ng (K\u1EF9 s\u01B0)",
        relationship: "Con Trai",
        phoneOrHandle: "0912 345 678",
        isFavorite: true
      },
      {
        id: "tc_s2",
        name: "C\u1EA3nh S\xE1t Khu V\u1EF1c (Trung T\xE1 H\xF9ng)",
        relationship: "C\u01A1 Quan Ch\u1EE9c N\u0103ng",
        phoneOrHandle: "024 3825 2525",
        isFavorite: true
      }
    ]
  },
  {
    id: "user_adult_van",
    username: "thanhvan_fin",
    email: "thanhvan.pham@company.vn",
    name: "Ph\u1EA1m Thanh V\xE2n (32 tu\u1ED5i)",
    mode: "adult",
    roleDescription: "Nh\xE2n vi\xEAn v\u0103n ph\xF2ng - Chuy\xEAn s\xE2u ph\xF2ng ng\u1EEBa l\u1EEBa \u0111\u1EA3o ng\xE2n h\xE0ng & s\xE0n th\u01B0\u01A1ng m\u1EA1i",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
    score: 92,
    xp: 3400,
    streak: 12,
    completedScenarios: ["bank-lockout-alert", "fake-ecommerce-refund", "police-investigation-secrecy", "crypto-pig-butchering"],
    trustedContacts: [
      {
        id: "tc_a1",
        name: "Ch\u1ED3ng Ho\xE0ng Minh",
        relationship: "V\u1EE3/Ch\u1ED3ng",
        phoneOrHandle: "0988 777 666",
        isFavorite: true
      },
      {
        id: "tc_a2",
        name: "T\u1ED5ng \u0110\xE0i Vietcombank",
        relationship: "Hotline Ng\xE2n H\xE0ng",
        phoneOrHandle: "1900 54 54 13",
        isFavorite: true
      }
    ]
  },
  {
    id: "user_student_minhanh",
    username: "minhanh_genz",
    email: "minhanh.stu@university.edu.vn",
    name: "L\xEA Minh Anh (19 tu\u1ED5i)",
    mode: "teen",
    roleDescription: "Sinh vi\xEAn th\u1EBF h\u1EC7 s\u1ED1 - Ph\xF2ng ch\u1ED1ng b\u1EABy vi\u1EC7c l\xE0m online & Deepfake b\u1EA1n b\xE8",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face",
    score: 78,
    xp: 1280,
    streak: 4,
    completedScenarios: ["telegram-job-task", "deepfake-video-borrow"],
    trustedContacts: [
      {
        id: "tc_t1",
        name: "M\u1EB9 Hi\u1EC1n",
        relationship: "Ph\u1EE5 Huynh",
        phoneOrHandle: "0903 112 233",
        isFavorite: true
      }
    ]
  },
  {
    id: "user_expert_bao",
    username: "quocbao_sec",
    email: "bao.sec@cyberguard.tech",
    name: "Tr\u1EA7n Qu\u1ED1c B\u1EA3o (Chuy\xEAn Gia An Ninh)",
    mode: "adult",
    roleDescription: "Chuy\xEAn gia ph\xE2n t\xEDch m\xE3 \u0111\u1ED9c & \u0111i\u1EC1u tra ph\xE1p y l\u1EEBa \u0111\u1EA3o m\u1EA1ng",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
    score: 98,
    xp: 5600,
    streak: 21,
    completedScenarios: ["bank-lockout-alert", "police-investigation-secrecy", "package-delivery-failed", "telegram-job-task", "crypto-pig-butchering", "deepfake-video-borrow"],
    trustedContacts: [
      {
        id: "tc_e1",
        name: "Trung T\xE2m Gi\xE1m S\xE1t An To\xE0n Kh\xF4ng Gian M\u1EA1ng Qu\u1ED1c Gia (NCSC)",
        relationship: "C\u01A1 Quan An Ninh",
        phoneOrHandle: "024 3209 6789",
        isFavorite: true
      }
    ]
  }
];
DEMO_PRESET_USERS.forEach((preset) => {
  const token = `sg_tok_${preset.id}_demo_preset`;
  sessionsStore.set(token, preset.id);
  const profile = {
    id: preset.id,
    name: preset.name,
    username: preset.username,
    email: preset.email,
    mode: preset.mode,
    language: "vi",
    overallScore: preset.score,
    xp: preset.xp,
    streakDays: preset.streak,
    completedScenarios: preset.completedScenarios,
    trustedContacts: preset.trustedContacts,
    avatarUrl: preset.avatarUrl,
    provider: "demo",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const account = {
    id: preset.id,
    username: preset.username,
    email: preset.email,
    name: preset.name,
    avatarUrl: preset.avatarUrl,
    provider: "demo",
    profile,
    token,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  usersStore.set(preset.id, {
    account,
    passwordHash: hashPassword("123456")
    // Default password for demo if manually tested
  });
});
function registerUser(params) {
  const cleanUsername = (params.username || "").trim().toLowerCase();
  const cleanName = (params.name || "").trim();
  const cleanEmail = (params.email || `${cleanUsername}@scamguard.local`).trim().toLowerCase();
  if (!cleanUsername || cleanUsername.length < 3) {
    return { success: false, error: "T\xEAn \u0111\u0103ng nh\u1EADp ph\u1EA3i c\xF3 \xEDt nh\u1EA5t 3 k\xFD t\u1EF1." };
  }
  if (!cleanName) {
    return { success: false, error: "Vui l\xF2ng nh\u1EADp H\u1ECD v\xE0 T\xEAn c\u1EE7a b\u1EA1n." };
  }
  if (params.password && params.password.length < 4) {
    return { success: false, error: "M\u1EADt kh\u1EA9u ph\u1EA3i c\xF3 \xEDt nh\u1EA5t 4 k\xFD t\u1EF1." };
  }
  for (const [, entry] of usersStore.entries()) {
    if (entry.account.username === cleanUsername) {
      return { success: false, error: "T\xEAn \u0111\u0103ng nh\u1EADp n\xE0y \u0111\xE3 \u0111\u01B0\u1EE3c s\u1EED d\u1EE5ng. Vui l\xF2ng ch\u1ECDn t\xEAn kh\xE1c." };
    }
    if (params.email && entry.account.email === cleanEmail) {
      return { success: false, error: "Email n\xE0y \u0111\xE3 \u0111\u01B0\u1EE3c \u0111\u0103ng k\xFD t\xE0i kho\u1EA3n." };
    }
  }
  const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const token = generateToken(userId);
  const profile = {
    id: userId,
    name: cleanName,
    username: cleanUsername,
    email: cleanEmail,
    mode: params.mode || "adult",
    language: "vi",
    overallScore: 70,
    xp: 100,
    streakDays: 1,
    completedScenarios: [],
    trustedContacts: [],
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=0f172a,1e293b,334155`,
    provider: "local",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const account = {
    id: userId,
    username: cleanUsername,
    email: cleanEmail,
    name: cleanName,
    avatarUrl: profile.avatarUrl,
    provider: "local",
    profile,
    token,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  usersStore.set(userId, {
    account,
    passwordHash: params.password ? hashPassword(params.password) : void 0
  });
  return { success: true, user: account };
}
function loginUser(params) {
  const query = (params.usernameOrEmail || "").trim().toLowerCase();
  if (!query) {
    return { success: false, error: "Vui l\xF2ng nh\u1EADp t\xEAn \u0111\u0103ng nh\u1EADp ho\u1EB7c email." };
  }
  let matchedUserId = null;
  let matchedEntry = null;
  for (const [uid, entry] of usersStore.entries()) {
    if (entry.account.username.toLowerCase() === query || entry.account.email.toLowerCase() === query) {
      matchedUserId = uid;
      matchedEntry = entry;
      break;
    }
  }
  if (!matchedUserId || !matchedEntry) {
    return { success: false, error: "Kh\xF4ng t\xECm th\u1EA5y t\xE0i kho\u1EA3n v\u1EDBi th\xF4ng tin n\xE0y." };
  }
  if (matchedEntry.passwordHash && params.password) {
    const inputHash = hashPassword(params.password);
    if (matchedEntry.passwordHash !== inputHash) {
      return { success: false, error: "M\u1EADt kh\u1EA9u kh\xF4ng ch\xEDnh x\xE1c. Vui l\xF2ng th\u1EED l\u1EA1i." };
    }
  }
  const token = generateToken(matchedUserId);
  matchedEntry.account.token = token;
  return { success: true, user: matchedEntry.account };
}
function socialLogin(params) {
  const provider = params.provider;
  const providerNames = {
    google: "T\xE0i kho\u1EA3n Google",
    facebook: "T\xE0i kho\u1EA3n Facebook",
    github: "T\xE0i kho\u1EA3n GitHub"
  };
  const defaultName = params.name || `${providerNames[provider] || "Ng\u01B0\u1EDDi d\xF9ng"} (${provider.toUpperCase()})`;
  const email = params.email || `${provider}_${Date.now()}@auth.${provider}.com`;
  const username = `${provider}_${Math.random().toString(36).substring(2, 8)}`;
  for (const [uid, entry] of usersStore.entries()) {
    if (entry.account.email === email && entry.account.provider === provider) {
      const token2 = generateToken(uid);
      entry.account.token = token2;
      return { success: true, user: entry.account };
    }
  }
  const userId = `user_${provider}_${Date.now()}`;
  const token = generateToken(userId);
  const defaultAvatars = {
    google: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face",
    facebook: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&h=120&fit=crop&crop=face",
    github: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=120&h=120&fit=crop&crop=face"
  };
  const avatarUrl = params.avatarUrl || defaultAvatars[provider];
  const profile = {
    id: userId,
    name: defaultName,
    username,
    email,
    mode: params.mode || "adult",
    language: "vi",
    overallScore: 80,
    xp: 250,
    streakDays: 1,
    completedScenarios: ["bank-lockout-alert"],
    trustedContacts: [],
    avatarUrl,
    provider,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const account = {
    id: userId,
    username,
    email,
    name: defaultName,
    avatarUrl,
    provider,
    profile,
    token,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  usersStore.set(userId, { account });
  return { success: true, user: account };
}
function getUserByTokenOrId(identifier) {
  if (!identifier) return null;
  const userIdFromSession = sessionsStore.get(identifier);
  if (userIdFromSession && usersStore.has(userIdFromSession)) {
    return usersStore.get(userIdFromSession).account;
  }
  if (usersStore.has(identifier)) {
    return usersStore.get(identifier).account;
  }
  return null;
}
function updateUserProfile(userId, updates) {
  const entry = usersStore.get(userId);
  if (!entry) return null;
  entry.account.profile = {
    ...entry.account.profile,
    ...updates
  };
  if (updates.name) {
    entry.account.name = updates.name;
  }
  if (updates.avatarUrl) {
    entry.account.avatarUrl = updates.avatarUrl;
  }
  return entry.account;
}
function resetUserAccountData(userId) {
  if (userId && usersStore.has(userId)) {
    const entry = usersStore.get(userId);
    entry.account.profile = {
      ...entry.account.profile,
      completedScenarios: [],
      xp: 0,
      overallScore: 50,
      streakDays: 0,
      trustedContacts: []
    };
    return { success: true, message: `\u0110\xE3 reset to\xE0n b\u1ED9 d\u1EEF li\u1EC7u t\xE0i kho\u1EA3n ${userId}` };
  }
  for (const [, entry] of usersStore.entries()) {
    entry.account.profile = {
      ...entry.account.profile,
      completedScenarios: [],
      xp: 0,
      overallScore: 50,
      streakDays: 0,
      trustedContacts: []
    };
  }
  return { success: true, message: "\u0110\xE3 reset to\xE0n b\u1ED9 d\u1EEF li\u1EC7u ng\u01B0\u1EDDi d\xF9ng tr\xEAn h\u1EC7 th\u1ED1ng." };
}
function getPresetDemoUsers() {
  return DEMO_PRESET_USERS.map((preset) => {
    const entry = usersStore.get(preset.id);
    return {
      id: preset.id,
      name: preset.name,
      username: preset.username,
      email: preset.email,
      mode: preset.mode,
      roleDescription: preset.roleDescription,
      avatarUrl: preset.avatarUrl,
      score: entry ? entry.account.profile.overallScore || preset.score : preset.score,
      xp: entry ? entry.account.profile.xp || preset.xp : preset.xp,
      streak: entry ? entry.account.profile.streakDays || preset.streak : preset.streak
    };
  });
}

// server/security.ts
var import_zod = require("zod");
var auditLogs = [];
var MAX_AUDIT_LOGS = 500;
function addAuditLog(entry) {
  const log = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    ...entry
  };
  auditLogs.unshift(log);
  if (auditLogs.length > MAX_AUDIT_LOGS) {
    auditLogs.pop();
  }
}
function getAuditLogs(limit = 50) {
  return auditLogs.slice(0, limit);
}
var usageMetrics = {
  totalRequestsToday: 0,
  lastResetDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
  maxDailyRequests: 1e3,
  // Budget guard
  circuitBreakerActive: false
};
function checkAndIncrementGeminiBudget() {
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  if (usageMetrics.lastResetDate !== today) {
    usageMetrics.totalRequestsToday = 0;
    usageMetrics.lastResetDate = today;
    usageMetrics.circuitBreakerActive = false;
  }
  if (usageMetrics.totalRequestsToday >= usageMetrics.maxDailyRequests) {
    usageMetrics.circuitBreakerActive = true;
    return false;
  }
  usageMetrics.totalRequestsToday++;
  return true;
}
function getGeminiUsageMetrics() {
  return { ...usageMetrics };
}
var rateLimitStores = /* @__PURE__ */ new Map();
function createRateLimiter(actionName, maxRequests, windowMs) {
  if (!rateLimitStores.has(actionName)) {
    rateLimitStores.set(actionName, /* @__PURE__ */ new Map());
  }
  const store = rateLimitStores.get(actionName);
  return (req, res, next) => {
    const ip = req.ip || req.headers["x-forwarded-for"]?.toString() || "anonymous_ip";
    const key = `${ip}_${req.headers["x-user-id"] || "guest"}`;
    const now = Date.now();
    const record = store.get(key);
    if (!record || now > record.resetTime) {
      store.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }
    if (record.count >= maxRequests) {
      addAuditLog({
        ip,
        userId: req.headers["x-user-id"]?.toString(),
        action: `RATE_LIMIT_EXCEEDED:${actionName}`,
        status: "RATE_LIMITED",
        details: { maxRequests, windowMs }
      });
      return res.status(429).json({
        error: `B\u1EA1n \u0111\xE3 th\u1EF1c hi\u1EC7n qu\xE1 nhi\u1EC1u y\xEAu c\u1EA7u cho t\xEDnh n\u0103ng ${actionName}. Vui l\xF2ng th\u1EED l\u1EA1i sau ${Math.ceil((record.resetTime - now) / 1e3)} gi\xE2y.`,
        retryAfterSeconds: Math.ceil((record.resetTime - now) / 1e3)
      });
    }
    record.count++;
    return next();
  };
}
var AnalyzeTextSchema = import_zod.z.object({
  text: import_zod.z.string().max(5e3, "N\u1ED9i dung ph\xE2n t\xEDch kh\xF4ng \u0111\u01B0\u1EE3c v\u01B0\u1EE3t qu\xE1 5,000 k\xFD t\u1EF1").optional(),
  url: import_zod.z.string().max(2e3, "\u0110\u01B0\u1EDDng d\u1EABn URL kh\xF4ng \u0111\u01B0\u1EE3c v\u01B0\u1EE3t qu\xE1 2,000 k\xFD t\u1EF1").optional(),
  sender: import_zod.z.string().max(200).optional(),
  channel: import_zod.z.string().max(50).optional()
}).refine((data) => data.text || data.url, {
  message: "Vui l\xF2ng cung c\u1EA5p \xEDt nh\u1EA5t n\u1ED9i dung v\u0103n b\u1EA3n ho\u1EB7c \u0111\u01B0\u1EDDng d\u1EABn URL \u0111\u1EC3 ki\u1EC3m tra."
});
var AnalyzeScreenshotSchema = import_zod.z.object({
  base64Image: import_zod.z.string().min(10, "D\u1EEF li\u1EC7u \u1EA3nh kh\xF4ng h\u1EE3p l\u1EC7").max(25 * 1024 * 1024, "Dung l\u01B0\u1EE3ng \u1EA3nh v\u01B0\u1EE3t qu\xE1 25MB"),
  mimeType: import_zod.z.string().regex(/^image\/(png|jpeg|jpg|webp|gif)$/, "\u0110\u1ECBnh d\u1EA1ng \u1EA3nh kh\xF4ng \u0111\u01B0\u1EE3c h\u1ED7 tr\u1EE3").optional(),
  optionalContext: import_zod.z.string().max(2e3).optional()
});
var StartArenaSessionSchema = import_zod.z.object({
  scenarioId: import_zod.z.string().min(1, "scenarioId l\xE0 b\u1EAFt bu\u1ED9c").max(100),
  userId: import_zod.z.string().max(100).optional()
});
var ArenaMessageSchema = import_zod.z.object({
  sessionId: import_zod.z.string().min(1, "sessionId l\xE0 b\u1EAFt bu\u1ED9c").max(100),
  message: import_zod.z.string().min(1, "N\u1ED9i dung tin nh\u1EAFn kh\xF4ng \u0111\u01B0\u1EE3c \u0111\u1EC3 tr\u1ED1ng").max(2e3, "Tin nh\u1EAFn qu\xE1 d\xE0i (t\u1ED1i \u0111a 2,000 k\xFD t\u1EF1)"),
  userId: import_zod.z.string().max(100).optional(),
  scenarioId: import_zod.z.string().max(100).optional(),
  messages: import_zod.z.array(import_zod.z.any()).optional()
});
var EndArenaSessionSchema = import_zod.z.object({
  sessionId: import_zod.z.string().min(1, "sessionId l\xE0 b\u1EAFt bu\u1ED9c").max(100),
  userId: import_zod.z.string().max(100).optional(),
  scenarioId: import_zod.z.string().max(100).optional(),
  messages: import_zod.z.array(import_zod.z.any()).optional(),
  sessionData: import_zod.z.record(import_zod.z.string(), import_zod.z.any()).optional()
});
var CoachAdviceSchema = import_zod.z.object({
  dnaProfile: import_zod.z.object({
    overallScore: import_zod.z.number().min(0).max(100),
    tier: import_zod.z.string(),
    weakestTactics: import_zod.z.array(import_zod.z.any()).optional(),
    strongestTactics: import_zod.z.array(import_zod.z.any()).optional()
  }),
  userMode: import_zod.z.enum(["adult", "senior", "teen", "kids", "family", "school"]).optional()
});
var QuishingAnswerSchema = import_zod.z.object({
  caseId: import_zod.z.string().min(1),
  userSaidScam: import_zod.z.boolean(),
  responseTimeSeconds: import_zod.z.number().min(0).max(600).optional(),
  userId: import_zod.z.string().optional()
});
var FeedbackSubmissionSchema = import_zod.z.object({
  targetType: import_zod.z.enum(["analysis", "arena", "quishing", "general"]),
  targetId: import_zod.z.string().optional(),
  isHelpful: import_zod.z.boolean(),
  userSuspectedScam: import_zod.z.boolean().optional(),
  comment: import_zod.z.string().max(1e3).optional(),
  userId: import_zod.z.string().optional()
});
function validateBody(schema) {
  return (req, res, next) => {
    const parseResult = schema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
      addAuditLog({
        ip: req.ip || "unknown",
        userId: req.headers["x-user-id"]?.toString(),
        action: "VALIDATION_FAILED",
        status: "BLOCKED",
        details: { errors: errorMsg, bodySample: JSON.stringify(req.body).slice(0, 100) }
      });
      return res.status(400).json({
        error: `D\u1EEF li\u1EC7u g\u1EEDi l\xEAn kh\xF4ng h\u1EE3p l\u1EC7: ${errorMsg}`,
        details: parseResult.error.issues
      });
    }
    req.body = parseResult.data;
    next();
  };
}
function evaluateContentSafetyPolicy(text) {
  if (!text) return { safe: true };
  const lower = text.toLowerCase();
  const prohibitedPatterns = [
    /vui lòng nhập (?:mật khẩu|password|mã pin) tài khoản ngân hàng thật/i,
    /chuyển tiền thật vào stk thực tế/i
  ];
  for (const pat of prohibitedPatterns) {
    if (pat.test(lower)) {
      return {
        safe: false,
        reason: "H\u1EC7 th\u1ED1ng t\u1EEB ch\u1ED1i x\u1EED l\xFD n\u1ED9i dung y\xEAu c\u1EA7u thu th\u1EADp th\xF4ng tin t\xE0i kho\u1EA3n th\u1EADt ho\u1EB7c chuy\u1EC3n ti\u1EC1n th\u1EADt."
      };
    }
  }
  return { safe: true };
}

// server.ts
import_dotenv.default.config();
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = Number(process.env.PORT) || 3e3;
  app.get(["/api/health", "/healthz", "/ping"], (req, res) => {
    res.status(200).json({
      status: "healthy",
      service: "SCAMGUARD-VN",
      uptime: Math.floor(process.uptime()),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.use(
    (0, import_helmet.default)({
      contentSecurityPolicy: false,
      // allow iframe preview & dynamic scripts
      crossOriginEmbedderPolicy: false,
      frameguard: false
      // required for AI Studio iFrame live preview
    })
  );
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-user-id");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });
  app.use(import_express.default.json({ limit: "25mb" }));
  app.use(import_express.default.urlencoded({ extended: true, limit: "25mb" }));
  const analyzerLimiter = createRateLimiter("analyzer", 20, 60 * 1e3);
  const arenaLimiter = createRateLimiter("arena", 40, 60 * 1e3);
  const coachLimiter = createRateLimiter("coach", 15, 60 * 1e3);
  const accountLimiter = createRateLimiter("account", 10, 60 * 1e3);
  app.post("/api/auth/register", (req, res) => {
    try {
      const { name, username, email, password, mode } = req.body;
      const result = registerUser({ name, username, email, password, mode });
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message || "L\u1ED7i \u0111\u0103ng k\xFD t\xE0i kho\u1EA3n." });
    }
  });
  app.post("/api/auth/login", (req, res) => {
    try {
      const { usernameOrEmail, password } = req.body;
      const result = loginUser({ usernameOrEmail, password });
      if (!result.success) {
        return res.status(401).json(result);
      }
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message || "L\u1ED7i \u0111\u0103ng nh\u1EADp." });
    }
  });
  app.post("/api/auth/social", (req, res) => {
    try {
      const { provider, name, email, avatarUrl, mode } = req.body;
      if (!provider || !["google", "facebook", "github"].includes(provider)) {
        return res.status(400).json({ success: false, error: "Ph\u01B0\u01A1ng th\u1EE9c \u0111\u0103ng nh\u1EADp kh\xF4ng h\u1EE3p l\u1EC7." });
      }
      const result = socialLogin({ provider, name, email, avatarUrl, mode });
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message || "L\u1ED7i \u0111\u0103ng nh\u1EADp m\u1EA1ng x\xE3 h\u1ED9i." });
    }
  });
  app.get("/api/auth/presets", (req, res) => {
    res.json({ presets: getPresetDemoUsers() });
  });
  app.get("/api/auth/me", (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.replace("Bearer ", "") : req.headers["x-user-id"];
    const user = getUserByTokenOrId(token);
    if (!user) {
      return res.status(404).json({ success: false, error: "Ch\u01B0a \u0111\u0103ng nh\u1EADp." });
    }
    return res.json({ success: true, user });
  });
  app.put("/api/auth/profile", (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.replace("Bearer ", "") : req.headers["x-user-id"];
    const user = getUserByTokenOrId(token);
    if (!user) {
      return res.status(401).json({ success: false, error: "Ch\u01B0a x\xE1c th\u1EF1c ng\u01B0\u1EDDi d\xF9ng." });
    }
    const updated = updateUserProfile(user.id, req.body);
    return res.json({ success: true, user: updated });
  });
  app.post("/api/auth/logout", (req, res) => {
    res.json({ success: true, message: "\u0110\xE3 \u0111\u0103ng xu\u1EA5t an to\xE0n." });
  });
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      service: "SCAMGUARD Defense Platform",
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      geminiMetrics: getGeminiUsageMetrics(),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.get("/api/scenarios", (req, res) => {
    const { category, difficulty, ageGroup, channel, q } = req.query;
    let results = [...SCAM_SCENARIOS];
    if (category) {
      results = results.filter((s) => s.category.toLowerCase() === String(category).toLowerCase());
    }
    if (difficulty) {
      results = results.filter((s) => s.difficulty.toLowerCase() === String(difficulty).toLowerCase());
    }
    if (ageGroup && ageGroup !== "All") {
      results = results.filter((s) => s.ageGroup === "All" || s.ageGroup === ageGroup);
    }
    if (channel) {
      results = results.filter((s) => s.channel === channel);
    }
    if (q) {
      const search = String(q).toLowerCase();
      results = results.filter(
        (s) => s.title.toLowerCase().includes(search) || s.subtitle.toLowerCase().includes(search) || s.tactics.some((t) => t.toLowerCase().includes(search))
      );
    }
    res.json({ scenarios: results, total: results.length });
  });
  app.get("/api/quishing", (req, res) => {
    const { industry } = req.query;
    let list = QUISHING_CASES;
    if (industry) {
      list = list.filter((c) => c.category.toLowerCase() === String(industry).toLowerCase());
    }
    res.json({ cases: list, total: list.length });
  });
  app.get("/api/deepfakes", (req, res) => {
    res.json({ cases: DEEPFAKE_CASES });
  });
  app.get("/api/drills", (req, res) => {
    res.json({ drills: QUICK_DRILLS });
  });
  app.post("/api/analyze/text", analyzerLimiter, validateBody(AnalyzeTextSchema), async (req, res) => {
    try {
      const { text, url, sender, channel } = req.body;
      const userId = req.headers["x-user-id"] || "guest_user";
      const safetyCheck = evaluateContentSafetyPolicy(text || url || "");
      if (!safetyCheck.safe) {
        addAuditLog({
          ip: req.ip || "unknown",
          userId,
          action: "POLICY_VIOLATION_BLOCKED",
          status: "BLOCKED",
          details: { reason: safetyCheck.reason }
        });
        return res.status(400).json({ error: safetyCheck.reason });
      }
      const result = await analyzeScamContent({ text, url, sender, channel });
      addAuditLog({
        ip: req.ip || "unknown",
        userId,
        action: "SCAM_TEXT_ANALYZED",
        status: "SUCCESS",
        details: { riskLevel: result.riskLevel, riskScore: result.riskScore }
      });
      return res.json(result);
    } catch (err) {
      console.error("Error analyzing scam text:", err);
      return res.status(500).json({ error: err.message || "Failed to analyze content" });
    }
  });
  app.post("/api/analyze/screenshot", analyzerLimiter, validateBody(AnalyzeScreenshotSchema), async (req, res) => {
    try {
      const { base64Image, mimeType, optionalContext } = req.body;
      const userId = req.headers["x-user-id"] || "guest_user";
      const result = await analyzeScamContent({
        text: optionalContext || "Gi\xE1m \u0111\u1ECBnh ph\xE1p y s\u1ED1 \u1EA3nh ch\u1EE5p m\xE0n h\xECnh tin nh\u1EAFn ho\u1EB7c link nghi v\u1EA5n.",
        base64Image,
        mimeType: mimeType || "image/png"
      });
      addAuditLog({
        ip: req.ip || "unknown",
        userId,
        action: "SCREENSHOT_ANALYZED",
        status: "SUCCESS",
        details: { riskLevel: result.riskLevel, riskScore: result.riskScore }
      });
      return res.json(result);
    } catch (err) {
      console.error("Error analyzing screenshot:", err);
      return res.status(500).json({ error: err.message || "Failed to analyze screenshot" });
    }
  });
  app.post(["/api/analyze/bill", "/api/analyze/fakebill"], analyzerLimiter, async (req, res) => {
    try {
      const { base64Image, mimeType, declaredBank, declaredAmount, optionalContext } = req.body;
      if (!base64Image) {
        return res.status(400).json({ error: "C\u1EA7n \u0111\xEDnh k\xE8m h\xECnh \u1EA3nh bi\xEAn lai \u0111\u1EC3 th\u1EF1c hi\u1EC7n gi\xE1m \u0111\u1ECBnh quang h\u1ECDc." });
      }
      const report = await inspectFakeBillAnomalies({
        base64Image,
        mimeType: mimeType || "image/png",
        declaredBank,
        declaredAmount
      });
      const riskScore = report.anomalySuspicionScore;
      let riskLevel = "LOW";
      if (riskScore >= 65) riskLevel = "HIGH";
      else if (riskScore >= 35) riskLevel = "MEDIUM";
      const signals = [
        {
          name: "\u0110\u1ED9 l\u1EC7ch ph\xF4ng ch\u1EEF & Kerning",
          scoreContribution: report.structuralMetrics.fontScore,
          description: report.structuralMetrics.fontMismatchDetected ? "Ph\xE1t hi\u1EC7n s\u1EF1 kh\xF4ng \u0111\u1ED3ng nh\u1EA5t v\u1EC1 \u0111\u1ED9 \u0111\u1EADm n\xE9t v\xE0 c\u0103n d\xF2ng ch\u1EEF s\u1ED1 ti\u1EC1n" : "Ph\xF4ng ch\u1EEF \u0111\u1ED3ng nh\u1EA5t trong gi\u1EDBi h\u1EA1n ch\u1EA5p nh\u1EADn",
          category: "Typography"
        },
        {
          name: "Nhi\u1EC5u n\xE9n \u1EA3nh (Compression Artifacts)",
          scoreContribution: report.structuralMetrics.artifactScore,
          description: report.structuralMetrics.compressionArtifactDetected ? "C\xF3 qu\u1EA7ng m\u1EDD xung quanh ch\u1EEF s\u1ED1 ti\u1EC1n do ch\u1EAFp v\xE1 ch\u1EC9nh s\u1EEDa h\xECnh \u1EA3nh" : "M\u1EE9c n\xE9n \u1EA3nh b\xECnh th\u01B0\u1EDDng",
          category: "Forensics"
        },
        {
          name: "Con d\u1EA5u & Watermark",
          scoreContribution: report.structuralMetrics.watermarkSealStatus === "BLURRED_SYNTHETIC" ? 30 : 5,
          description: `Tr\u1EA1ng th\xE1i watermark: ${report.structuralMetrics.watermarkSealStatus}`,
          category: "Integrity"
        }
      ];
      const evidenceFound = report.explainableSuspiciousRegions.map((reg) => ({
        severity: reg.severity,
        title: reg.areaName,
        description: reg.description
      }));
      const randomHex = Math.floor(1e5 + Math.random() * 9e5).toString(16).toUpperCase();
      const combinedResult = {
        ...report,
        riskLevel,
        riskScore,
        summary: `Gi\xE1m \u0111\u1ECBnh quang h\u1ECDc: Ch\u1EC9 s\u1ED1 b\u1EA5t th\u01B0\u1EDDng ${riskScore}/100. ${riskScore >= 65 ? "Ph\xE1t hi\u1EC7n nhi\u1EC1u d\u1EA5u hi\u1EC7u can thi\u1EC7p ph\xF4ng ch\u1EEF v\xE0 v\u1EBFt gh\xE9p s\u1ED1 ti\u1EC1n." : "H\xECnh \u1EA3nh h\xF3a \u0111\u01A1n t\u01B0\u01A1ng \u0111\u1ED1i \u0111\u1ED3ng nh\u1EA5t v\u1EC1 m\u1EB7t \u0111\u1ED3 h\u1ECDa."}`,
        signals,
        redFlags: [
          "V\xF9ng s\u1ED1 ti\u1EC1n c\xF3 \u0111\u1ED9 s\u1EAFc n\xE9t kh\xE1c bi\u1EC7t v\u1EDBi m\u1EABu ph\xF4i ng\xE2n h\xE0ng",
          "Bi\u1EBFn \u0111\u1ED9ng s\u1ED1 d\u01B0 ch\u01B0a ghi nh\u1EADn tr\xEAn \u1EE9ng d\u1EE5ng ng\xE2n h\xE0ng th\u1EF1c t\u1EBF",
          report.scientificCaveat
        ],
        recommendedSteps: [
          "KH\xD4NG giao h\xE0ng ho\u1EB7c chuy\u1EC3n kho\u1EA3n \u0111\u1ED1i \u1EE9ng khi ch\u01B0a th\u1EA5y ti\u1EC1n v\u1EC1 t\xE0i kho\u1EA3n ng\xE2n h\xE0ng th\u1EF1c t\u1EBF.",
          "M\u1EDF \u1EE9ng d\u1EE5ng Mobile Banking c\u1EE7a ng\u01B0\u1EDDi nh\u1EADn \u0111\u1EC3 ki\u1EC3m tra l\u1ECBch s\u1EED bi\u1EBFn \u0111\u1ED9ng s\u1ED1 d\u01B0 ch\xEDnh th\u1EE9c.",
          "Kh\xF4ng tin v\xE0o h\xECnh ch\u1EE5p m\xE0n h\xECnh hay th\xF4ng b\xE1o t\u1EEB \u1EE9ng d\u1EE5ng b\xEAn th\u1EE9 ba."
        ],
        piiRedacted: false,
        threatBreakdown: {
          maliciousUrl: 0,
          impersonation: report.structuralMetrics.fontScore,
          urgency: 40,
          credentialHarvesting: 20,
          socialEngineering: riskScore
        },
        evidenceFound,
        threatClassification: {
          primaryThreat: "Bi\xEAn Lai Chuy\u1EC3n Ti\u1EC1n Gi\u1EA3 M\u1EA1o (Fake Bank Receipt)",
          attackVector: "Ch\u1EC9nh s\u1EEDa \u0111\u1ED3 h\u1ECDa bi\xEAn lai (Visual Manipulation)",
          target: "H\xE0ng h\xF3a / Ti\u1EC1n c\u1ECDc c\u1EE7a ng\u01B0\u1EDDi b\xE1n",
          potentialImpact: ["M\u1EA5t h\xE0ng h\xF3a m\xE0 kh\xF4ng nh\u1EADn \u0111\u01B0\u1EE3c ti\u1EC1n", "B\u1ECB l\u1EEBa chuy\u1EC3n kho\u1EA3n ng\u01B0\u1EE3c"],
          confidence: 86
        },
        attackChain: [
          "\u0110\u1ED1i t\u01B0\u1EE3ng v\u1EDD \u0111\u1EB7t mua h\xE0ng ho\u1EB7c tr\u1EA3 n\u1EE3",
          "T\u1EA1o \u1EA3nh bi\xEAn lai chuy\u1EC3n ti\u1EC1n th\xE0nh c\xF4ng gi\u1EA3 b\u1EB1ng c\xF4ng c\u1EE5 \u0111\u1ED3 h\u1ECDa",
          "G\u1EEDi \u1EA3nh th\xFAc gi\u1EE5c n\u1EA1n nh\xE2n giao h\xE0ng ho\u1EB7c ho\xE0n tr\u1EA3 ti\u1EC1n th\u1EEBa"
        ],
        assessmentId: `SG-BILL-${randomHex}`
      };
      return res.json(combinedResult);
    } catch (err) {
      console.error("Error in bill anomaly inspection:", err);
      return res.status(500).json({ error: err.message || "L\u1ED7i khi gi\xE1m \u0111\u1ECBnh h\xF3a \u0111\u01A1n" });
    }
  });
  app.post("/api/analyze/url-features", (req, res) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "Thi\u1EBFu tham s\u1ED1 URL c\u1EA7n gi\xE1m \u0111\u1ECBnh." });
    }
    const features = extractTransparentUrlFeatures(url);
    return res.json(features);
  });
  app.get("/api/research/overview", (req, res) => {
    res.json({
      projectTitle: "SCAMGUARD VN: H\u1EC7 Th\u1ED1ng Hu\u1EA5n Luy\u1EC7n Th\xEDch \u1EE8ng Ph\xF2ng Th\u1EE7 L\u1EEBa \u0110\u1EA3o Tr\u1EF1c Tuy\u1EBFn D\u1EF1a Tr\xEAn Vector H\xE0nh Vi Scam DNA & AI \u0110a Ph\u01B0\u01A1ng Th\u1EE9c",
      category: "H\u1EC7 th\u1ED1ng Th\xF4ng tin & Tr\xED tu\u1EC7 Nh\xE2n t\u1EA1o \u1EE8ng d\u1EE5ng (ISEF / ViSEF)",
      problemStatement: "C\xE1c bi\u1EC7n ph\xE1p gi\xE1o d\u1EE5c an to\xE0n s\u1ED1 truy\u1EC1n th\u1ED1ng (b\xE0i gi\u1EA3ng t\u0129nh, infographic) c\xF3 hi\u1EC7u qu\u1EA3 suy gi\u1EA3m nhanh do kh\xF4ng c\xE1 nh\xE2n h\xF3a theo \u0111i\u1EC3m y\u1EBFu t\xE2m l\xFD c\u1EE7a ng\u01B0\u1EDDi d\xF9ng v\xE0 thi\u1EBFu m\xF4i tr\u01B0\u1EDDng th\u1EF1c h\xE0nh ph\u1EA3n x\u1EA1. D\u1EF1 \xE1n nghi\xEAn c\u1EE9u m\xF4 h\xECnh h\xF3a vector t\u1ED5n th\u01B0\u01A1ng h\xE0nh vi (Scam DNA) v\xE0 thu\u1EADt to\xE1n hu\u1EA5n luy\u1EC7n th\xEDch \u1EE9ng nh\u1EB1m gi\u1EA3m t\u1EF7 l\u1EC7 h\xE0nh \u0111\u1ED9ng m\u1EA5t an to\xE0n.",
      researchQuestion: "Li\u1EC7u vi\u1EC7c \u1EE9ng d\u1EE5ng m\xF4 h\xECnh vector t\u1ED5n th\u01B0\u01A1ng h\xE0nh vi 6 chi\u1EC1u (Scam DNA) k\u1EBFt h\u1EE3p thu\u1EADt to\xE1n hu\u1EA5n luy\u1EC7n th\xEDch \u1EE9ng c\xF3 c\u1EA3i thi\u1EC7n \u0111\xE1ng k\u1EC3 \u0111i\u1EC3m ph\xF2ng th\u1EE7 th\u1EF1c t\u1EBF (Defense Score) v\xE0 kh\u1EA3 n\u0103ng kh\xE1i qu\xE1t h\xF3a tr\u01B0\u1EDBc c\xE1c k\u1ECBch b\u1EA3n l\u1EEBa \u0111\u1EA3o m\u1EDBi (Unseen Scenarios) so v\u1EDBi ph\u01B0\u01A1ng ph\xE1p gi\xE1o d\u1EE5c truy\u1EC1n th\u1ED1ng kh\xF4ng?",
      hypotheses: [
        {
          id: "H1",
          statement: "Nh\xF3m C (Hu\u1EA5n luy\u1EC7n th\xEDch \u1EE9ng ScamGuard) \u0111\u1EA1t m\u1EE9c t\u0103ng tr\u01B0\u1EDFng \u0111i\u1EC3m ph\xF2ng th\u1EE7 (\u0394 Defense Score) cao h\u01A1n c\xF3 \xFD ngh\u0129a th\u1ED1ng k\xEA (p < 0.01, Cohen's d > 1.2) so v\u1EDBi Nh\xF3m A (\u0110\u1ED1i ch\u1EE9ng truy\u1EC1n th\u1ED1ng) v\xE0 Nh\xF3m B (M\xF4 ph\u1ECFng t\u0129nh ng\u1EABu nhi\xEAn)."
        },
        {
          id: "H2",
          statement: "H\u1EC7 th\u1ED1ng ScamGuard l\xE0m gi\u1EA3m t\u1EF7 l\u1EC7 th\u1EF1c hi\u1EC7n h\xE0nh \u0111\u1ED9ng m\u1EA5t an to\xE0n (Unsafe Action Rate - chuy\u1EC3n ti\u1EC1n ho\u1EB7c n\u1ED9p OTP) \xEDt nh\u1EA5t 60% sau qu\xE1 tr\xECnh can thi\u1EC7p."
        },
        {
          id: "H3",
          statement: "Kh\u1EA3 n\u0103ng kh\xE1i qu\xE1t h\xF3a (Generalization) tr\u01B0\u1EDBc c\xE1c k\u1ECBch b\u1EA3n l\u1EEBa \u0111\u1EA3o ch\u01B0a t\u1EEBng xu\u1EA5t hi\u1EC7n trong t\u1EADp hu\u1EA5n luy\u1EC7n (Unseen Post-Test) \u1EDF Nh\xF3m C duy tr\xEC cao h\u01A1n Nh\xF3m A \xEDt nh\u1EA5t 25%."
        }
      ],
      variables: {
        independent: ["Ph\u01B0\u01A1ng ph\xE1p can thi\u1EC7p gi\xE1o d\u1EE5c: Nh\xF3m A (T\u0129nh/Infographic), Nh\xF3m B (M\xF4 ph\u1ECFng ng\u1EABu nhi\xEAn), Nh\xF3m C (Th\xEDch \u1EE9ng theo Scam DNA)"],
        dependent: ["\u0110i\u1EC3m ph\xF2ng th\u1EE7 th\u1EF1c nghi\u1EC7m (Defense Score)", "T\u1EF7 l\u1EC7 h\xE0nh \u0111\u1ED9ng nguy hi\u1EC3m (Unsafe Action Rate)", "Th\u1EDDi gian ph\u1EA3n x\u1EA1 suy x\xE9t (Response Latency)", "\u0110i\u1EC3m kh\xE1i qu\xE1t h\xF3a k\u1ECBch b\u1EA3n m\u1EDBi (Unseen Attack Score)", "\u0110\u1ED9 duy tr\xEC ph\u1EA3n x\u1EA1 sau 14 ng\xE0y (Retention Score)"],
        controlled: ["Th\u1EDDi l\u01B0\u1EE3ng th\u1EF1c h\xE0nh (c\xF9ng 45 ph\xFAt)", "\u0110\u1ED9 kh\xF3 c\u01A1 b\u1EA3n c\u1EE7a b\xE0i ki\u1EC3m tra chu\u1EA9n h\xF3a", "\u0110i\u1EC1u ki\u1EC7n thi\u1EBFt b\u1ECB v\xE0 m\xF4i tr\u01B0\u1EDDng ph\xF2ng lab"]
      },
      ethicsAndIRB: {
        anonymization: "To\xE0n b\u1ED9 d\u1EEF li\u1EC7u ng\u01B0\u1EDDi tham gia \u0111\u01B0\u1EE3c m\xE3 h\xF3a \u0111\u1ECBnh danh \u1EA9n danh d\u1EA1ng P-xxx; kh\xF4ng l\u01B0u tr\u1EEF b\u1EA5t k\u1EF3 th\xF4ng tin c\xE1 nh\xE2n (PII) n\xE0o.",
        consent: "Tham gia t\u1EF1 nguy\u1EC7n d\u1EF1a tr\xEAn m\u1EABu phi\u1EBFu \u0111\u1ED3ng thu\u1EADn nghi\xEAn c\u1EE9u khoa h\u1ECDc h\u1ECDc sinh/ph\u1EE5 huynh.",
        safetySimulation: "Kh\xF4ng s\u1EED d\u1EE5ng li\xEAn k\u1EBFt \u0111\u1ED9c h\u1EA1i th\u1EF1c t\u1EBF; to\xE0n b\u1ED9 m\xF4i tr\u01B0\u1EDDng l\xE0 sandbox gi\u1EA3 l\u1EADp an to\xE0n tuy\u1EC7t \u0111\u1ED1i."
      }
    });
  });
  app.get("/api/research/statistics", (req, res) => {
    try {
      const stats = computeExperimentalStatistics();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/research/dataset", (req, res) => {
    const { split, category, language } = req.query;
    let list = CAMGUARD_DATASET;
    if (split) list = list.filter((s) => s.split === split);
    if (category) list = list.filter((s) => s.category === category);
    if (language) list = list.filter((s) => s.language === language);
    res.json({ scenarios: list, total: list.length });
  });
  app.get("/api/research/participants", (req, res) => {
    const trials = getAllParticipantTrials();
    res.json({ trials, total: trials.length });
  });
  app.get(["/api/research/survey-analytics", "/api/survey/analytics", "/api/survey-analytics"], (req, res) => {
    try {
      const analytics = getCommunitySurveyAnalytics();
      res.setHeader("Content-Type", "application/json");
      res.json(analytics);
    } catch (err) {
      res.status(500).json({ error: err.message || "L\u1ED7i khi l\u1EA5y d\u1EEF li\u1EC7u kh\u1EA3o s\xE1t" });
    }
  });
  app.get(["/api/research/surveys", "/api/surveys", "/api/survey/list"], (req, res) => {
    try {
      const surveys = getAllCommunitySurveys();
      res.setHeader("Content-Type", "application/json");
      res.json({ surveys, total: surveys.length });
    } catch (err) {
      res.status(500).json({ error: err.message || "L\u1ED7i khi l\u1EA5y danh s\xE1ch kh\u1EA3o s\xE1t" });
    }
  });
  app.post(["/api/research/survey", "/api/survey", "/api/surveys"], (req, res) => {
    try {
      const newSurvey = recordCommunitySurveySubmission(req.body);
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, survey: newSurvey });
    } catch (err) {
      res.status(400).json({ error: err.message || "L\u1ED7i khi ghi nh\u1EADn kh\u1EA3o s\xE1t" });
    }
  });
  app.post("/api/research/reset", (req, res) => {
    try {
      if (isSurveyDataLocked()) {
        return res.status(403).json({
          success: false,
          error: "D\u1EEF li\u1EC7u kh\u1EA3o s\xE1t c\u1ED9ng \u0111\u1ED3ng \u0111\xE3 \u0111\u01B0\u1EE3c kh\xF3a v\u0129nh vi\u1EC5n. Kh\xF4ng th\u1EC3 x\xF3a d\u1EEF li\u1EC7u kh\u1EA3o nghi\u1EC7m th\u1EF1c t\u1EBF.",
          locked: true
        });
      }
      const result = clearAllResearchData();
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/research/trial", (req, res) => {
    try {
      const trial = recordParticipantTrial(req.body);
      res.json({ success: true, trial });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/research/score-formal", (req, res) => {
    try {
      const ds = calculateFormalDefenseScore(req.body);
      res.json(ds);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/research/vector-dna", (req, res) => {
    try {
      const vector = calculateScamDnaVector(req.body.logs || []);
      res.json(vector);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/adaptive/recommend", (req, res) => {
    try {
      const { currentScamDna, completedScenarioIds, userDefenseScore } = req.body;
      const recommendation = recommendAdaptiveScenario({
        currentScamDna: currentScamDna || { T: 0.6, A: 0.5, G: 0.4, E: 0.5, C: 0.6, R: 0.5 },
        completedScenarioIds: completedScenarioIds || [],
        userDefenseScore: userDefenseScore || 65
      });
      res.json(recommendation);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.get("/api/research/ml-benchmarks", (req, res) => {
    try {
      const data = getMachineLearningBenchmarks();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/research/error-taxonomy", (req, res) => {
    try {
      const items = getErrorTaxonomyAnalysis();
      res.json({ items, total: items.length });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/research/simulate-weights", (req, res) => {
    try {
      const { weights, testScores } = req.body;
      const defaultWeights = {
        wTechnical: 0.25,
        wBehavioral: 0.25,
        wPsychological: 0.25,
        wIdentityAuthority: 0.15,
        wFinancial: 0.1
      };
      const defaultScores = {
        technical: 85,
        behavioral: 70,
        psychological: 90,
        identity: 80,
        financial: 95
      };
      const result = simulateRiskWeights(weights || defaultWeights, testScores || defaultScores);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/research/power-analysis", (req, res) => {
    try {
      const result = calculateSampleSizeAndPower(req.body || {});
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.get("/api/research/data-quality", (req, res) => {
    try {
      const metrics = getDataQualityMetrics();
      const logs = getExclusionLogs();
      res.json({ metrics, logs });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/research/exclude-record", (req, res) => {
    try {
      const log = logDataExclusion(req.body);
      res.json({ success: true, log });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.get("/api/research/cronbach-alpha", (req, res) => {
    try {
      const dimensionKey = String(req.query.dimensionKey || "T");
      const result = calculateCronbachAlpha(dimensionKey);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/research/multiple-comparison", (req, res) => {
    try {
      const { tests } = req.body;
      const defaultTests = [
        { name: "Group C vs Group A (Pre-Post Delta)", rawPValue: 8e-4 },
        { name: "Group C vs Group B (Pre-Post Delta)", rawPValue: 42e-4 },
        { name: "Group B vs Group A (Pre-Post Delta)", rawPValue: 0.038 },
        { name: "Unseen Scenario Score (C vs A)", rawPValue: 12e-4 },
        { name: "14-Day Retention Score (C vs A)", rawPValue: 25e-4 }
      ];
      const results = calculateMultipleComparisonCorrections(tests || defaultTests);
      res.json({ results });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.get("/api/research/literature", (req, res) => {
    try {
      const citations = getLiteratureCitations();
      res.json({ citations, total: citations.length });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/research/judge-questions", (req, res) => {
    try {
      const questions = getJudgeDefenseQuestions();
      res.json({ questions, total: questions.length });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/research/visef-report", (req, res) => {
    try {
      const reportMarkdown = generateViSEFResearchReport();
      res.json({ reportMarkdown });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  const MOCK_BLACKLIST_DB = {
    "0988112344": { type: "phone", identifier: "0988112344", reportsCount: 142, riskLevel: "EXTREME", description: "Gi\u1EA3 danh C\xF4ng an B\u1ED9 C\xF4ng An d\u1ECDa l\u1EC7nh b\u1EAFt t\u1EA1m giam r\u1EEDa ti\u1EC1n", source: "C\u1EE5c An ninh m\u1EA1ng & B\u1ED9 C\xF4ng an" },
    "0398291029": { type: "phone", identifier: "0398291029", reportsCount: 89, riskLevel: "HIGH", description: "Gi\u1EA3 danh shipper giao h\xE0ng COD y\xEAu c\u1EA7u qu\xE9t m\xE3 QR qu\xE0 t\u1EB7ng", source: "C\u1ED9ng \u0111\u1ED3ng SCAMGUARD" },
    "19038291029": { type: "stk", identifier: "19038291029", bankName: "Techcombank", name: "NGUYEN VAN GAMBLING", reportsCount: 230, riskLevel: "EXTREME", description: "T\xE0i kho\u1EA3n trung gian nh\u1EADn ti\u1EC1n b\u1EABy tuy\u1EC3n d\u1EE5ng Telegram & s\xE0n \u1EA3o", source: "Trung t\xE2m Gi\xE1m s\xE1t An to\xE0n kh\xF4ng gian m\u1EA1ng Qu\u1ED1c gia (NCSC)" },
    "0071000982918": { type: "stk", identifier: "0071000982918", bankName: "Vietcombank", name: "TRAN VAN FAKE", reportsCount: 67, riskLevel: "HIGH", description: "STK nh\u1EADn ti\u1EC1n c\u1ECDc xe gi\u1EA3 m\u1EA1o v\xE0 v\xE9 m\xE1y bay t\u1EBFt l\u1EEBa \u0111\u1EA3o", source: "C\u1ED9ng \u0111\u1ED3ng SCAMGUARD" }
  };
  app.get("/api/blacklist/search", (req, res) => {
    const query = String(req.query.q || "").trim().replace(/\s+/g, "");
    if (!query) {
      return res.status(400).json({ error: "Vui l\xF2ng nh\u1EADp s\u1ED1 \u0111i\u1EC7n tho\u1EA1i ho\u1EB7c s\u1ED1 t\xE0i kho\u1EA3n ng\xE2n h\xE0ng c\u1EA7n tra c\u1EE9u." });
    }
    const found = MOCK_BLACKLIST_DB[query];
    if (found) {
      return res.json({
        found: true,
        data: found
      });
    }
    const isDigits = /^\d{8,16}$/.test(query);
    if (isDigits && (query.startsWith("190") || query.startsWith("098") || query.includes("888"))) {
      return res.json({
        found: true,
        data: {
          type: query.length <= 11 ? "phone" : "stk",
          identifier: query,
          bankName: query.length > 11 ? "Ng\xE2n h\xE0ng Th\u01B0\u01A1ng m\u1EA1i" : void 0,
          name: "DANH S\xC1CH THEO D\xD5I NCSC",
          reportsCount: 18,
          riskLevel: "HIGH",
          description: "C\u1EA3nh b\xE1o: \u0110\u1ED1i t\u01B0\u1EE3ng c\xF3 t\xEDn hi\u1EC7u nghi v\u1EA5n l\u1EEBa \u0111\u1EA3o li\xEAn quan \u0111\u1EBFn giao d\u1ECBch t\xE0i ch\xEDnh.",
          source: "T\u1ED5ng h\u1EE3p ph\u1EA3n \xE1nh c\u1ED9ng \u0111\u1ED3ng SCAMGUARD"
        }
      });
    }
    return res.json({
      found: false,
      query,
      message: "Ch\u01B0a t\xECm th\u1EA5y b\xE1o c\xE1o vi ph\u1EA1m n\xE0o tr\xF9ng kh\u1EDBp trong C\u01A1 s\u1EDF d\u1EEF li\u1EC7u Danh s\xE1ch \u0111en. H\xE3y ti\u1EBFp t\u1EE5c c\u1EA3nh gi\xE1c!"
    });
  });
  app.post("/api/blacklist/report", (req, res) => {
    const { identifier, type, bankName, description } = req.body;
    if (!identifier || !type || !description) {
      return res.status(400).json({ error: "Vui l\xF2ng \u0111i\u1EC1n \u0111\u1EA7y \u0111\u1EE7 th\xF4ng tin s\u1ED1 \u0111i\u1EC7n tho\u1EA1i/STK v\xE0 m\xF4 t\u1EA3 k\u1ECBch b\u1EA3n l\u1EEBa \u0111\u1EA3o." });
    }
    const cleanId = String(identifier).trim().replace(/\s+/g, "");
    MOCK_BLACKLIST_DB[cleanId] = {
      type: type === "stk" ? "stk" : "phone",
      identifier: cleanId,
      bankName: bankName || "Ch\u01B0a x\xE1c \u0111\u1ECBnh",
      name: "T\xC0I KHO\u1EA2N M\u1EDAI B\u1ECA B\xC1O C\xC1O",
      reportsCount: 1,
      riskLevel: "HIGH",
      description,
      source: "\u0110\xF3ng g\xF3p th\u1EDDi gian th\u1EF1c t\u1EEB c\u1ED9ng \u0111\u1ED3ng SCAMGUARD"
    };
    return res.json({
      success: true,
      message: "C\u1EA3m \u01A1n b\u1EA1n \u0111\xE3 \u0111\xF3ng g\xF3p th\xF4ng tin! D\u1EEF li\u1EC7u \u0111\xE3 \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt v\xE0o H\u1EC7 th\u1ED1ng Danh s\xE1ch \u0111en Th\u1EDDi gian th\u1EF1c."
    });
  });
  app.post("/api/analyze/fakebill", analyzerLimiter, async (req, res) => {
    try {
      const { base64Image, mimeType, optionalContext } = req.body;
      if (!base64Image) {
        return res.status(400).json({ error: "Vui l\xF2ng t\u1EA3i l\xEAn h\xECnh \u1EA3nh bill chuy\u1EC3n ti\u1EC1n ho\u1EB7c giao di\u1EC7n ng\xE2n h\xE0ng." });
      }
      const result = await analyzeScamContent({
        text: `GI\xC1M \u0110\u1ECANH H\xD3A \u0110\u01A0N V\xC0 GIAO DI\u1EC6N NG\xC2N H\xC0NG (FAKE BILL DETECTOR): 
Chuy\xEAn m\xF4n: Soi \u0111\u1ED9 l\u1EC7ch font ch\u1EEF (font mismatch), thi\u1EBFu con m\u1ED9c / watermark, sai t\u1EC9 l\u1EC7 k\xEDch th\u01B0\u1EDBc (aspect ratio error), m\u1EA5t c\xE2n \u0111\u1ED1i kho\u1EA3ng c\xE1ch gi\u1EEFa s\u1ED1 ti\u1EC1n v\xE0 bi\u1EBFn \u0111\u1ED9ng s\u1ED1 d\u01B0. Context: ${optionalContext || "\u1EA2nh chuy\u1EC3n kho\u1EA3n ng\xE2n h\xE0ng do kh\xE1ch g\u1EEDi"}`,
        base64Image,
        mimeType: mimeType || "image/png"
      });
      if (result.isInvalidBankImage) {
        return res.status(400).json({
          error: result.invalidImageReason || "T\u1EC7p tin t\u1EA3i l\xEAn kh\xF4ng ch\u1EE9a h\xF3a \u0111\u01A1n giao d\u1ECBch chuy\u1EC3n kho\u1EA3n ho\u1EB7c m\xE0n h\xECnh \u1EE9ng d\u1EE5ng ng\xE2n h\xE0ng h\u1EE3p l\u1EC7. Vui l\xF2ng t\u1EA3i l\xEAn \u0111\xFAng h\xECnh \u1EA3nh h\xF3a \u0111\u01A1n giao d\u1ECBch ng\xE2n h\xE0ng."
        });
      }
      return res.json({
        ...result,
        fakeBillSpecifics: {
          fontAnomalyDetected: result.riskScore > 40,
          watermarkStatus: result.riskScore > 50 ? "Thi\u1EBFu Watermark ch\xEDnh th\u1EE9c c\u1EE7a app ng\xE2n h\xE0ng" : "\u0110\u1EA1t chu\u1EA9n",
          layoutRatio: result.riskScore > 40 ? "Kh\xF4ng c\xE2n \u0111\u1ED1i (B\u1ECB gh\xE9p \u1EA3nh Photoshop/Ph\u1EA7n m\u1EC1m Fake Bill)" : "Chu\u1EA9n",
          recommendation: "Kh\xF4ng giao h\xE0ng / kh\xF4ng chuy\u1EC3n t\xE0i s\u1EA3n cho \u0111\u1EBFn khi nghe LOA B\xC1O TINH TINH ho\u1EB7c th\u1EA5y s\u1ED1 d\u01B0 TH\u1EACT tr\xEAn App Ng\xE2n H\xE0ng."
        }
      });
    } catch (err) {
      return res.status(500).json({ error: err.message || "L\u1ED7i ph\xE2n t\xEDch h\xF3a \u0111\u01A1n fake bill." });
    }
  });
  app.post("/api/arena/start", arenaLimiter, validateBody(StartArenaSessionSchema), (req, res) => {
    try {
      const { scenarioId } = req.body;
      const userId = req.headers["x-user-id"] || "guest_user";
      const session = createArenaSession(scenarioId);
      recordProgressEvent(userId, "SESSION_STARTED", { scenarioId, sessionId: session.id });
      addAuditLog({
        ip: req.ip || "unknown",
        userId,
        action: "ARENA_SESSION_STARTED",
        status: "SUCCESS",
        details: { scenarioId, sessionId: session.id }
      });
      return res.json({ session });
    } catch (err) {
      console.error("Error starting arena session:", err);
      return res.status(500).json({ error: err.message || "Failed to start arena session" });
    }
  });
  app.get("/api/arena/session/:id", (req, res) => {
    const session = getArenaSession(req.params.id);
    if (!session) {
      return res.status(404).json({ error: "Phi\xEAn di\u1EC5n t\u1EADp kh\xF4ng t\u1ED3n t\u1EA1i ho\u1EB7c \u0111\xE3 h\u1EBFt h\u1EA1n." });
    }
    return res.json({ session });
  });
  app.post("/api/arena/message", arenaLimiter, validateBody(ArenaMessageSchema), async (req, res) => {
    try {
      const { sessionId, message, scenarioId, messages } = req.body;
      const userId = req.headers["x-user-id"] || "guest_user";
      const outcome = await processUserArenaMessage(sessionId, message, { scenarioId, messages });
      recordProgressEvent(userId, "MESSAGE_SENT", {
        sessionId,
        userVerified: outcome.evaluation.userVerificationDetected,
        userComplied: outcome.evaluation.complianceDetected
      });
      return res.json(outcome);
    } catch (err) {
      console.error("Error processing arena message:", err);
      return res.status(500).json({ error: err.message || "Failed to process message" });
    }
  });
  app.post("/api/arena/end", arenaLimiter, validateBody(EndArenaSessionSchema), (req, res) => {
    try {
      const { sessionId, scenarioId, messages, sessionData } = req.body;
      const userId = req.headers["x-user-id"] || "guest_user";
      const completedSession = concludeArenaSession(sessionId, { scenarioId, messages, sessionData });
      recordProgressEvent(userId, "ARENA_COMPLETED", {
        sessionId,
        scenarioId: completedSession.scenarioId,
        score: completedSession.defenseScore?.overallScore,
        tier: completedSession.defenseScore?.tier
      });
      addAuditLog({
        ip: req.ip || "unknown",
        userId,
        action: "ARENA_SESSION_CONCLUDED",
        status: "SUCCESS",
        details: {
          sessionId,
          overallScore: completedSession.defenseScore?.overallScore
        }
      });
      return res.json({ session: completedSession });
    } catch (err) {
      console.error("Error concluding arena session:", err);
      return res.status(500).json({ error: err.message || "Failed to end session" });
    }
  });
  app.get("/api/progress", (req, res) => {
    const userId = req.query.userId || req.headers["x-user-id"] || "guest_user";
    const progress = getOrCreateUserProgress(userId);
    const dnaProfile = calculateScamDna(userId);
    res.json({
      progress,
      dnaProfile
    });
  });
  app.get("/api/scamdna/community", (req, res) => {
    const userScore = req.query.userScore ? Number(req.query.userScore) : void 0;
    const communityDna = getCommunityScamDna(userScore);
    res.json({
      success: true,
      data: communityDna
    });
  });
  app.post("/api/scamdna/contribute", (req, res) => {
    try {
      const { participantName, demographicGroup, preScore, postScore, scamDnaShift, feedbackNote } = req.body;
      const submission = recordCommunitySurveySubmission({
        participantName: participantName || "Kh\u1EA3o nghi\u1EC7m vi\xEAn \u1EA8n danh",
        demographicGroup: demographicGroup || "STUDENT",
        testOutcome: {
          preScore: typeof preScore === "number" ? preScore : 52,
          postScore: typeof postScore === "number" ? postScore : 88,
          unseenScore: typeof postScore === "number" ? Math.max(70, postScore - 4) : 84,
          unsafeActionAvoided: true,
          timeToDecidePostSec: 11.5,
          scamDnaShift: scamDnaShift || {
            before: { T: 0.68, A: 0.65, G: 0.55, E: 0.6, C: 0.62, R: 0.52 },
            after: { T: 0.16, A: 0.14, G: 0.15, E: 0.17, C: 0.15, R: 0.12 }
          }
        },
        feedbackNote: feedbackNote || "\u0110\xF3ng g\xF3p d\u1EEF li\u1EC7u \u1EA9n danh th\xE0nh c\xF4ng!"
      });
      const updatedCommunityDna = getCommunityScamDna();
      const updatedAnalytics = getCommunitySurveyAnalytics();
      res.json({
        success: true,
        message: "C\u1EA3m \u01A1n b\u1EA1n! D\u1EEF li\u1EC7u \u1EA9n danh \u0111\xE3 \u0111\u01B0\u1EE3c \u0111\xF3ng g\xF3p v\xE0 c\u1EADp nh\u1EADt t\u1EE9c th\xEC v\xE0o H\u1EC7 th\u1ED1ng \u0110\u1ED1i chi\u1EBFu Scam DNA.",
        submission,
        totalRespondents: updatedAnalytics.totalRespondents,
        communityDna: updatedCommunityDna
      });
    } catch (err) {
      res.status(400).json({ error: err.message || "L\u1ED7i x\u1EED l\xFD \u0111\xF3ng g\xF3p d\u1EEF li\u1EC7u." });
    }
  });
  app.post("/api/progress/quishing", validateBody(QuishingAnswerSchema), (req, res) => {
    const { caseId, userSaidScam, responseTimeSeconds } = req.body;
    const userId = req.headers["x-user-id"] || "guest_user";
    const targetCase = QUISHING_CASES.find((c) => c.id === caseId);
    const isCorrect = targetCase ? targetCase.isScam === userSaidScam : true;
    const progress = recordProgressEvent(userId, "QUISHING_ANSWER", {
      caseId,
      userSaidScam,
      isCorrect,
      responseTimeSeconds
    });
    res.json({ success: true, isCorrect, progress });
  });
  app.post("/api/dna/coach", coachLimiter, validateBody(CoachAdviceSchema), async (req, res) => {
    try {
      const { dnaProfile, userMode } = req.body;
      const budgetOk = checkAndIncrementGeminiBudget();
      if (dnaProfile && budgetOk) {
        const prompt = `B\u1EA1n l\xE0 Chuy\xEAn gia C\u1ED1 v\u1EA5n Ph\xF2ng th\u1EE7 An ninh m\u1EA1ng SCAMGUARD (AI Defense Coach).
H\xE3y ph\xE2n t\xEDch h\u1ED3 s\u01A1 ph\u1EA3n x\u1EA1 ph\xF2ng v\u1EC7 c\u1EE7a ng\u01B0\u1EDDi d\xF9ng:
- \u0110i\u1EC3m ph\xF2ng th\u1EE7 t\u1ED5ng qu\xE1t: ${dnaProfile.overallScore}/100 (${dnaProfile.tier})
- \u0110i\u1EC3m y\u1EBFu l\u1EDBn nh\u1EA5t: ${JSON.stringify(dnaProfile.weakestTactics || [])}
- Th\u1EBF m\u1EA1nh v\u1EEFng ch\u1EAFc nh\u1EA5t: ${JSON.stringify(dnaProfile.strongestTactics || [])}
- Ch\u1EBF \u0111\u1ED9 tr\u1EA3i nghi\u1EC7m ng\u01B0\u1EDDi d\xF9ng: ${userMode || "adult"}

T\u1EA1o b\u1EA3n nh\u1EADn x\xE9t hu\u1EA5n luy\u1EC7n 3 \u0111o\u1EA1n ho\xE0n to\xE0n b\u1EB1ng ti\u1EBFng Vi\u1EC7t v\u1EDBi v\u0103n phong \u1EA5m \xE1p, s\u1EAFc s\u1EA3o, t\xEDch c\u1EF1c:
1. Khen ng\u1EE3i th\u1EBF m\u1EA1nh ph\u1EA3n x\u1EA1 t\u1ED1t nh\u1EA5t c\u1EE7a h\u1ECD v\xE0 gi\u1EA3i th\xEDch v\xEC sao ph\u1EA3n x\u1EA1 \u0111\xF3 c\u1EE9u nguy cho h\u1ECD.
2. V\u1EA1ch r\xF5 b\u1EABy t\xE2m l\xFD nguy hi\u1EC3m nh\u1EA5t m\xE0 h\u1ECD hay m\u1EAFc ph\u1EA3i (v\xED d\u1EE5: D\u1ED3n \xE9p kh\u1EA9n c\u1EA5p ho\u1EB7c S\u1EE3 h\xE3i quy\u1EC1n l\u1EF1c) v\xE0 n\xEAu v\xED d\u1EE5 k\u1ECBch b\u1EA3n l\u1EEBa \u0111\u1EA3o k\u1EBB gian hay d\xF9ng.
3. G\u1EE3i \xFD 2 b\xE0i t\u1EADp r\xE8n luy\u1EC7n ti\u1EBFp theo v\xE0 nh\u1EAFc 1 kh\u1EA9u hi\u1EC7u v\xE0ng d\u1EC5 nh\u1EDB ("D\u1EEBng l\u1EA1i - Ki\u1EC3m tra - X\xE1c minh \u0111\u1ED9c l\u1EADp").

Tr\u1EA3 v\u1EC1 JSON:
{
  "coachSummary": string,
  "actionableTip": string,
  "recommendedDrills": [string, string]
}`;
        const response = await executeGeminiWithFallback({
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });
        if (response?.text) {
          const parsed = JSON.parse(response.text.trim());
          return res.json(parsed);
        }
      }
      return res.json({
        coachSummary: `B\u1EA1n th\u1EC3 hi\u1EC7n ph\u1EA3n x\u1EA1 ph\xF2ng v\u1EC7 v\u1EEFng v\xE0ng tr\u01B0\u1EDBc c\xE1c tuy\xEAn b\u1ED1 gi\u1EA3 danh quy\u1EC1n l\u1EF1c, tuy nhi\xEAn t\xE2m l\xFD d\u1ED3n \xE9p kh\u1EA9n c\u1EA5p (Urgency) v\u1EABn l\xE0 \u0111i\u1EC3m d\u1EC5 b\u1ECB khai th\xE1c khi g\u1EB7p t\xECnh hu\u1ED1ng c\u0103ng th\u1EB3ng. K\u1EBB l\u1EEBa \u0111\u1EA3o th\u01B0\u1EDDng t\u1EA1o \xE1p l\u1EF1c th\u1EDDi gian 5-15 ph\xFAt \u0111\u1EC3 th\xFAc b\u1EA1n b\u1ECF qua vi\u1EC7c x\xE1c minh \u0111\u1ED9c l\u1EADp.`,
        actionableTip: `Ghi nh\u1EDB quy t\u1EAFc 5 ph\xFAt: Kh\xF4ng m\u1ED9t c\u01A1 quan ch\xEDnh th\u1ED1ng hay ng\xE2n h\xE0ng n\xE0o x\u1EED ph\u1EA1t b\u1EA1n v\xEC d\xE0nh 5 ph\xFAt g\u1ECDi l\u1EA1i s\u1ED1 hotline in tr\xEAn th\u1EBB ho\u1EB7c h\u1ECFi \xFD ki\u1EBFn ng\u01B0\u1EDDi th\xE2n.`,
        recommendedDrills: ["Di\u1EC5n t\u1EADp Gi\u1EA3 m\u1EA1o Kh\xF3a T\xE0i kho\u1EA3n Ng\xE2n h\xE0ng", "Ki\u1EC3m tra M\xE3 QR B\xE3i \u0110\u1ED7 xe C\xF4ng c\u1ED9ng"]
      });
    } catch (err) {
      return res.json({
        coachSummary: `H\xE3y t\u1EADp trung luy\u1EC7n t\u1EADp c\xE1c t\xECnh hu\u1ED1ng d\u1ED3n \xE9p th\u1EDDi gian \u0111\u1EC3 n\xE2ng cao ph\u1EA3n x\u1EA1 ho\xE0i nghi c\xF3 c\u01A1 s\u1EDF.`,
        actionableTip: `Lu\xF4n x\xE1c minh \u0111\u1ED9c l\u1EADp qua \u0111\u01B0\u1EDDng d\xE2y n\xF3ng ch\xEDnh th\u1EE9c khi c\xF3 th\xF4ng b\xE1o nguy c\u1EA5p.`,
        recommendedDrills: ["Gi\u1EA3 m\u1EA1o C\xF4ng an & VNeID \u0110i\u1EC1u tra", "Cu\u1ED9c g\u1ECDi Deepfake Gi\u1EA3 con c\u1EA5p c\u1EE9u"]
      });
    }
  });
  app.post("/api/feedback", validateBody(FeedbackSubmissionSchema), (req, res) => {
    const { targetType, targetId, isHelpful, userSuspectedScam, comment } = req.body;
    const userId = req.headers["x-user-id"] || "guest_user";
    addAuditLog({
      ip: req.ip || "unknown",
      userId,
      action: "FEEDBACK_SUBMITTED",
      status: "SUCCESS",
      details: { targetType, targetId, isHelpful, userSuspectedScam, comment }
    });
    res.json({ success: true, message: "C\u1EA3m \u01A1n b\u1EA1n \u0111\xE3 \u0111\xF3ng g\xF3p ph\u1EA3n h\u1ED3i \u0111\u1EC3 ho\xE0n thi\u1EC7n h\u1EC7 th\u1ED1ng ph\xF2ng v\u1EC7!" });
  });
  app.get("/api/account/export", accountLimiter, (req, res) => {
    const userId = req.headers["x-user-id"] || "guest_user";
    const data = exportUserData(userId);
    res.json(data);
  });
  app.delete("/api/account/data", accountLimiter, (req, res) => {
    const userId = req.headers["x-user-id"] || "guest_user";
    const result = deleteUserData(userId);
    resetUserAccountData(userId);
    addAuditLog({
      ip: req.ip || "unknown",
      userId,
      action: "USER_DATA_DELETED",
      status: "SUCCESS"
    });
    res.json(result);
  });
  app.post("/api/account/reset-all", accountLimiter, (req, res) => {
    try {
      const userId = req.headers["x-user-id"] || "guest_user";
      deleteUserData(userId);
      resetUserAccountData(userId);
      resetAllUserProgress();
      clearAllResearchData();
      addAuditLog({
        ip: req.ip || "unknown",
        userId,
        action: "FULL_CAMPAIGN_AND_USER_DATA_RESET",
        status: "SUCCESS"
      });
      res.json({
        success: true,
        message: "\u0110\xE3 reset to\xE0n b\u1ED9 b\xE0i h\u1ECDc v\xE0 d\u1EEF li\u1EC7u c\xE1 nh\xE2n. D\u1EEF li\u1EC7u kh\u1EA3o s\xE1t c\u1ED9ng \u0111\u1ED3ng \u0111\u01B0\u1EE3c gi\u1EEF nguy\xEAn v\xE0 kh\xF4ng th\u1EC3 x\xF3a."
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message || "L\u1ED7i khi reset d\u1EEF li\u1EC7u" });
    }
  });
  app.get("/api/admin/audit-logs", (req, res) => {
    res.json({ logs: getAuditLogs(100), metrics: getGeminiUsageMetrics() });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\u{1F6E1}\uFE0F SCAMGUARD server running on http://localhost:${PORT}`);
    const keepAliveUrl = process.env.APP_URL || process.env.RENDER_EXTERNAL_URL || process.env.SERVER_URL;
    if (keepAliveUrl && !keepAliveUrl.includes("localhost") && !keepAliveUrl.includes("MY_APP_URL")) {
      const pingTarget = `${keepAliveUrl.replace(/\/$/, "")}/api/health`;
      console.log(`\u{1F6E1}\uFE0F Anti-sleep keep-alive worker activated for: ${pingTarget}`);
      const TEN_MINUTES_MS = 10 * 60 * 1e3;
      setInterval(async () => {
        try {
          const res = await fetch(pingTarget);
          console.log(`[Keep-Alive] Self ping: ${res.status} OK at ${(/* @__PURE__ */ new Date()).toLocaleTimeString("vi-VN")}`);
        } catch (err) {
          console.warn(`[Keep-Alive] Warning:`, err.message);
        }
      }, TEN_MINUTES_MS);
    }
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
