import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { sanitizeAndRedactPII, defendPromptInjection } from './safety';

// --- AUDIT LOGGING ---
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  ip: string;
  userId?: string;
  action: string;
  status: 'SUCCESS' | 'BLOCKED' | 'RATE_LIMITED' | 'ERROR';
  details?: Record<string, any>;
}

const auditLogs: AuditLogEntry[] = [];
const MAX_AUDIT_LOGS = 500;

export function addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
  const log: AuditLogEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };
  auditLogs.unshift(log);
  if (auditLogs.length > MAX_AUDIT_LOGS) {
    auditLogs.pop();
  }
}

export function getAuditLogs(limit = 50): AuditLogEntry[] {
  return auditLogs.slice(0, limit);
}

// --- GLOBAL GEMINI BUDGET PROTECTION ---
interface GeminiUsageMetrics {
  totalRequestsToday: number;
  lastResetDate: string;
  maxDailyRequests: number;
  circuitBreakerActive: boolean;
}

const usageMetrics: GeminiUsageMetrics = {
  totalRequestsToday: 0,
  lastResetDate: new Date().toISOString().split('T')[0],
  maxDailyRequests: 1000, // Budget guard
  circuitBreakerActive: false,
};

export function checkAndIncrementGeminiBudget(): boolean {
  const today = new Date().toISOString().split('T')[0];
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

export function getGeminiUsageMetrics() {
  return { ...usageMetrics };
}

// --- RATE LIMITING ---
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStores = new Map<string, Map<string, RateLimitRecord>>();

export function createRateLimiter(actionName: string, maxRequests: number, windowMs: number) {
  if (!rateLimitStores.has(actionName)) {
    rateLimitStores.set(actionName, new Map());
  }
  const store = rateLimitStores.get(actionName)!;

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.headers['x-forwarded-for']?.toString() || 'anonymous_ip';
    const key = `${ip}_${req.headers['x-user-id'] || 'guest'}`;
    const now = Date.now();

    const record = store.get(key);

    if (!record || now > record.resetTime) {
      store.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    if (record.count >= maxRequests) {
      addAuditLog({
        ip,
        userId: req.headers['x-user-id']?.toString(),
        action: `RATE_LIMIT_EXCEEDED:${actionName}`,
        status: 'RATE_LIMITED',
        details: { maxRequests, windowMs },
      });
      return res.status(429).json({
        error: `Bạn đã thực hiện quá nhiều yêu cầu cho tính năng ${actionName}. Vui lòng thử lại sau ${Math.ceil((record.resetTime - now) / 1000)} giây.`,
        retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000),
      });
    }

    record.count++;
    return next();
  };
}

// --- ZOD SCHEMAS & INPUT VALIDATION ---
export const AnalyzeTextSchema = z.object({
  text: z.string().max(5000, 'Nội dung phân tích không được vượt quá 5,000 ký tự').optional(),
  url: z.string().max(2000, 'Đường dẫn URL không được vượt quá 2,000 ký tự').optional(),
  sender: z.string().max(200).optional(),
  channel: z.string().max(50).optional(),
}).refine(data => data.text || data.url, {
  message: 'Vui lòng cung cấp ít nhất nội dung văn bản hoặc đường dẫn URL để kiểm tra.',
});

export const AnalyzeScreenshotSchema = z.object({
  base64Image: z.string().min(10, 'Dữ liệu ảnh không hợp lệ').max(25 * 1024 * 1024, 'Dung lượng ảnh vượt quá 25MB'),
  mimeType: z.string().regex(/^image\/(png|jpeg|jpg|webp|gif)$/, 'Định dạng ảnh không được hỗ trợ').optional(),
  optionalContext: z.string().max(2000).optional(),
});

export const StartArenaSessionSchema = z.object({
  scenarioId: z.string().min(1, 'scenarioId là bắt buộc').max(100),
  userId: z.string().max(100).optional(),
});

export const ArenaMessageSchema = z.object({
  sessionId: z.string().min(1, 'sessionId là bắt buộc').max(100),
  message: z.string().min(1, 'Nội dung tin nhắn không được để trống').max(2000, 'Tin nhắn quá dài (tối đa 2,000 ký tự)'),
  userId: z.string().max(100).optional(),
  scenarioId: z.string().max(100).optional(),
  messages: z.array(z.any()).optional(),
});

export const EndArenaSessionSchema = z.object({
  sessionId: z.string().min(1, 'sessionId là bắt buộc').max(100),
  userId: z.string().max(100).optional(),
  scenarioId: z.string().max(100).optional(),
  messages: z.array(z.any()).optional(),
  sessionData: z.record(z.string(), z.any()).optional(),
});

export const CoachAdviceSchema = z.object({
  dnaProfile: z.object({
    overallScore: z.number().min(0).max(100),
    tier: z.string(),
    weakestTactics: z.array(z.any()).optional(),
    strongestTactics: z.array(z.any()).optional(),
  }),
  userMode: z.enum(['adult', 'senior', 'teen', 'kids', 'family', 'school']).optional(),
});

export const QuishingAnswerSchema = z.object({
  caseId: z.string().min(1),
  userSaidScam: z.boolean(),
  responseTimeSeconds: z.number().min(0).max(600).optional(),
  userId: z.string().optional(),
});

export const FeedbackSubmissionSchema = z.object({
  targetType: z.enum(['analysis', 'arena', 'quishing', 'general']),
  targetId: z.string().optional(),
  isHelpful: z.boolean(),
  userSuspectedScam: z.boolean().optional(),
  comment: z.string().max(1000).optional(),
  userId: z.string().optional(),
});

// Middleware generator for Zod
export function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parseResult = schema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      addAuditLog({
        ip: req.ip || 'unknown',
        userId: req.headers['x-user-id']?.toString(),
        action: 'VALIDATION_FAILED',
        status: 'BLOCKED',
        details: { errors: errorMsg, bodySample: JSON.stringify(req.body).slice(0, 100) },
      });
      return res.status(400).json({
        error: `Dữ liệu gửi lên không hợp lệ: ${errorMsg}`,
        details: parseResult.error.issues,
      });
    }
    req.body = parseResult.data;
    next();
  };
}

// --- SAFETY POLICY ENGINE ---
export function evaluateContentSafetyPolicy(text: string): { safe: boolean; reason?: string } {
  if (!text) return { safe: true };

  const lower = text.toLowerCase();

  // Block real malicious credential phishing requests inside prompts
  const prohibitedPatterns = [
    /vui lòng nhập (?:mật khẩu|password|mã pin) tài khoản ngân hàng thật/i,
    /chuyển tiền thật vào stk thực tế/i,
  ];

  for (const pat of prohibitedPatterns) {
    if (pat.test(lower)) {
      return {
        safe: false,
        reason: 'Hệ thống từ chối xử lý nội dung yêu cầu thu thập thông tin tài khoản thật hoặc chuyển tiền thật.',
      };
    }
  }

  return { safe: true };
}
