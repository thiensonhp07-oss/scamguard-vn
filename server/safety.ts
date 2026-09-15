/**
 * ScamGuard Privacy & Safety Engine
 * Automatically redacts sensitive Personally Identifiable Information (PII)
 * and guards against prompt injection attempts before communicating with AI models.
 */

export interface SanitizedInput {
  text: string;
  piiRedacted: boolean;
  redactionsCount: number;
}

export function sanitizeAndRedactPII(input: string): SanitizedInput {
  if (!input || typeof input !== 'string') {
    return { text: '', piiRedacted: false, redactionsCount: 0 };
  }

  let text = input;
  let redactionsCount = 0;

  // 1. Credit Card Numbers (13 to 19 digits with optional spaces or dashes)
  const ccRegex = /\b(?:\d[ -]*?){13,19}\b/g;
  text = text.replace(ccRegex, (match) => {
    // Only redact if looks like a card number, not short numbers
    const digitsOnly = match.replace(/\D/g, '');
    if (digitsOnly.length >= 13 && digitsOnly.length <= 19) {
      redactionsCount++;
      return '[REDACTED_PAYMENT_CARD]';
    }
    return match;
  });

  // 2. SSN / National Identification Numbers (XXX-XX-XXXX or similar 9-12 digit patterns)
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  text = text.replace(ssnRegex, () => {
    redactionsCount++;
    return '[REDACTED_NATIONAL_ID]';
  });

  // 3. One-Time Passwords / Verification Codes (e.g., "OTP: 981245", "code is 123456")
  const otpRegex = /\b(?:otp|code|pin|verification\s*code|mã\s*otp)[:\s]+([0-9]{4,8})\b/gi;
  text = text.replace(otpRegex, (match, code) => {
    redactionsCount++;
    return match.replace(code, '[REDACTED_OTP_CODE]');
  });

  // 4. Standalone 6-digit OTP codes preceded or followed by keywords
  const looseOtpRegex = /\b(code\s*[:#]?\s*)(\d{6})\b/gi;
  text = text.replace(looseOtpRegex, '$1[REDACTED_CODE]');

  // 5. Passwords in cleartext (e.g. "password: Secret123!")
  const pwdRegex = /\b(?:password|mật\s*khẩu|pwd|pass)[:\s]+([^\s,;]+)/gi;
  text = text.replace(pwdRegex, (match, pwd) => {
    if (pwd.length > 2) {
      redactionsCount++;
      return match.replace(pwd, '[REDACTED_PASSWORD]');
    }
    return match;
  });

  // 6. Real Phone Numbers (international or domestic US/VN/UK)
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  text = text.replace(phoneRegex, (match) => {
    // Only redact if digits >= 10
    const digits = match.replace(/\D/g, '');
    if (digits.length >= 10 && digits.length <= 13) {
      redactionsCount++;
      return '[REDACTED_PHONE_NUMBER]';
    }
    return match;
  });

  // 7. Email Addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  text = text.replace(emailRegex, () => {
    redactionsCount++;
    return '[REDACTED_EMAIL_ADDRESS]';
  });

  return {
    text,
    piiRedacted: redactionsCount > 0,
    redactionsCount,
  };
}

export function defendPromptInjection(input: string): string {
  if (!input) return '';
  // Neutralize common jailbreak instructions
  let cleaned = input.replace(/ignore\s+all\s+(?:previous|above)\s+instructions/gi, '[INSTRUCTION_DEFLECTED]');
  cleaned = cleaned.replace(/system\s*override|you\s+are\s+now\s+dan|developer\s+mode/gi, '[INSTRUCTION_DEFLECTED]');
  return cleaned;
}
