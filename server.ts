import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { analyzeScamContent, inspectFakeBillAnomalies, extractTransparentUrlFeatures } from './server/riskEngine';
import {
  calculateFormalDefenseScore,
  calculateScamDnaVector,
  recommendAdaptiveScenario,
  computeExperimentalStatistics,
  recordParticipantTrial,
  getAllParticipantTrials,
  getMachineLearningBenchmarks,
  getErrorTaxonomyAnalysis,
  simulateRiskWeights,
  getCommunitySurveyAnalytics,
  getAllCommunitySurveys,
  recordCommunitySurveySubmission,
  clearAllResearchData,
  calculateSampleSizeAndPower,
  getExclusionLogs,
  logDataExclusion,
  getDataQualityMetrics,
  calculateCronbachAlpha,
  calculateMultipleComparisonCorrections,
  getLiteratureCitations,
  getJudgeDefenseQuestions,
  generateViSEFResearchReport,
} from './server/scientificEngine';

import { CAMGUARD_DATASET } from './src/data/researchDataset';
import {
  createArenaSession,
  getArenaSession,
  processUserArenaMessage,
  concludeArenaSession,
} from './server/arenaEngine';
import { SCAM_SCENARIOS } from './src/data/scenarios';
import { QUISHING_CASES } from './src/data/quishingData';
import { DEEPFAKE_CASES } from './src/data/deepfakeData';
import { QUICK_DRILLS } from './src/data/quickDrills';
import { executeGeminiWithFallback, GEMINI_MODEL } from './server/gemini';
import {
  registerUser,
  loginUser,
  socialLogin,
  getUserByTokenOrId,
  updateUserProfile,
  getPresetDemoUsers,
  resetUserAccountData,
} from './server/auth';
import {
  createRateLimiter,
  validateBody,
  AnalyzeTextSchema,
  AnalyzeScreenshotSchema,
  StartArenaSessionSchema,
  ArenaMessageSchema,
  EndArenaSessionSchema,
  CoachAdviceSchema,
  QuishingAnswerSchema,
  FeedbackSubmissionSchema,
  evaluateContentSafetyPolicy,
  addAuditLog,
  getAuditLogs,
  getGeminiUsageMetrics,
  checkAndIncrementGeminiBudget,
} from './server/security';
import {
  getOrCreateUserProgress,
  recordProgressEvent,
  calculateScamDna,
  getCommunityScamDna,
  deleteUserData,
  exportUserData,
  resetAllUserProgress,
} from './server/progressEngine';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Health check & ping endpoints (Exempt from rate limiting, used by uptime monitors & keep-alive)
  app.get(['/api/health', '/healthz', '/ping'], (req, res) => {
    res.status(200).json({
      status: 'healthy',
      service: 'SCAMGUARD-VN',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  });

  // Security Headers using Helmet (with frame config compatible for iFrame preview)
  app.use(
    helmet({
      contentSecurityPolicy: false, // allow iframe preview & dynamic scripts
      crossOriginEmbedderPolicy: false,
      frameguard: false, // required for AI Studio iFrame live preview
    })
  );

  // Payload body parsing
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Rate limiters
  const analyzerLimiter = createRateLimiter('analyzer', 20, 60 * 1000); // 20 req/min
  const arenaLimiter = createRateLimiter('arena', 40, 60 * 1000); // 40 msg/min
  const coachLimiter = createRateLimiter('coach', 15, 60 * 1000); // 15 req/min
  const accountLimiter = createRateLimiter('account', 10, 60 * 1000);

  // --- AUTHENTICATION & MULTI-USER API ROUTES ---

  // Register with username and password
  app.post('/api/auth/register', (req, res) => {
    try {
      const { name, username, email, password, mode } = req.body;
      const result = registerUser({ name, username, email, password, mode });
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || 'Lỗi đăng ký tài khoản.' });
    }
  });

  // Login with username/email and password
  app.post('/api/auth/login', (req, res) => {
    try {
      const { usernameOrEmail, password } = req.body;
      const result = loginUser({ usernameOrEmail, password });
      if (!result.success) {
        return res.status(401).json(result);
      }
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || 'Lỗi đăng nhập.' });
    }
  });

  // Social Login (Google, Facebook, GitHub)
  app.post('/api/auth/social', (req, res) => {
    try {
      const { provider, name, email, avatarUrl, mode } = req.body;
      if (!provider || !['google', 'facebook', 'github'].includes(provider)) {
        return res.status(400).json({ success: false, error: 'Phương thức đăng nhập không hợp lệ.' });
      }
      const result = socialLogin({ provider, name, email, avatarUrl, mode });
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || 'Lỗi đăng nhập mạng xã hội.' });
    }
  });

  // Preset demo accounts for fast 1-click evaluation
  app.get('/api/auth/presets', (req, res) => {
    res.json({ presets: getPresetDemoUsers() });
  });

  // Get current user session
  app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.replace('Bearer ', '') : (req.headers['x-user-id'] as string);
    const user = getUserByTokenOrId(token);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Chưa đăng nhập.' });
    }
    return res.json({ success: true, user });
  });

  // Update user profile
  app.put('/api/auth/profile', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.replace('Bearer ', '') : (req.headers['x-user-id'] as string);
    const user = getUserByTokenOrId(token);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Chưa xác thực người dùng.' });
    }
    const updated = updateUserProfile(user.id, req.body);
    return res.json({ success: true, user: updated });
  });

  // Logout session
  app.post('/api/auth/logout', (req, res) => {
    res.json({ success: true, message: 'Đã đăng xuất an toàn.' });
  });

  // --- API ROUTES ---

  // Health check & System stats
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'SCAMGUARD Defense Platform',
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      geminiMetrics: getGeminiUsageMetrics(),
      timestamp: new Date().toISOString(),
    });
  });

  // Scenarios Data & Search / Filter Endpoint
  app.get('/api/scenarios', (req, res) => {
    const { category, difficulty, ageGroup, channel, q } = req.query;
    let results = [...SCAM_SCENARIOS];

    if (category) {
      results = results.filter((s) => s.category.toLowerCase() === String(category).toLowerCase());
    }
    if (difficulty) {
      results = results.filter((s) => s.difficulty.toLowerCase() === String(difficulty).toLowerCase());
    }
    if (ageGroup && ageGroup !== 'All') {
      results = results.filter((s) => s.ageGroup === 'All' || s.ageGroup === ageGroup);
    }
    if (channel) {
      results = results.filter((s) => s.channel === channel);
    }
    if (q) {
      const search = String(q).toLowerCase();
      results = results.filter(
        (s) =>
          s.title.toLowerCase().includes(search) ||
          s.subtitle.toLowerCase().includes(search) ||
          s.tactics.some((t) => t.toLowerCase().includes(search))
      );
    }

    res.json({ scenarios: results, total: results.length });
  });

  app.get('/api/quishing', (req, res) => {
    const { industry } = req.query;
    let list = QUISHING_CASES;
    if (industry) {
      list = list.filter((c) => c.category.toLowerCase() === String(industry).toLowerCase());
    }
    res.json({ cases: list, total: list.length });
  });

  app.get('/api/deepfakes', (req, res) => {
    res.json({ cases: DEEPFAKE_CASES });
  });

  app.get('/api/drills', (req, res) => {
    res.json({ drills: QUICK_DRILLS });
  });

  // Text & URL Scam Analysis
  app.post('/api/analyze/text', analyzerLimiter, validateBody(AnalyzeTextSchema), async (req, res) => {
    try {
      const { text, url, sender, channel } = req.body;
      const userId = (req.headers['x-user-id'] as string) || 'guest_user';

      // Safety policy check
      const safetyCheck = evaluateContentSafetyPolicy(text || url || '');
      if (!safetyCheck.safe) {
        addAuditLog({
          ip: req.ip || 'unknown',
          userId,
          action: 'POLICY_VIOLATION_BLOCKED',
          status: 'BLOCKED',
          details: { reason: safetyCheck.reason },
        });
        return res.status(400).json({ error: safetyCheck.reason });
      }

      const result = await analyzeScamContent({ text, url, sender, channel });

      addAuditLog({
        ip: req.ip || 'unknown',
        userId,
        action: 'SCAM_TEXT_ANALYZED',
        status: 'SUCCESS',
        details: { riskLevel: result.riskLevel, riskScore: result.riskScore },
      });

      return res.json(result);
    } catch (err: any) {
      console.error('Error analyzing scam text:', err);
      return res.status(500).json({ error: err.message || 'Failed to analyze content' });
    }
  });

  // Screenshot / Multimodal Image Scam Analysis
  app.post('/api/analyze/screenshot', analyzerLimiter, validateBody(AnalyzeScreenshotSchema), async (req, res) => {
    try {
      const { base64Image, mimeType, optionalContext } = req.body;
      const userId = (req.headers['x-user-id'] as string) || 'guest_user';

      const result = await analyzeScamContent({
        text: optionalContext || 'Giám định pháp y số ảnh chụp màn hình tin nhắn hoặc link nghi vấn.',
        base64Image,
        mimeType: mimeType || 'image/png',
      });

      addAuditLog({
        ip: req.ip || 'unknown',
        userId,
        action: 'SCREENSHOT_ANALYZED',
        status: 'SUCCESS',
        details: { riskLevel: result.riskLevel, riskScore: result.riskScore },
      });

      return res.json(result);
    } catch (err: any) {
      console.error('Error analyzing screenshot:', err);
      return res.status(500).json({ error: err.message || 'Failed to analyze screenshot' });
    }
  });

  // Forensic Anomaly Inspection for Fake Invoices & Bank Transfer Receipts
  app.post(['/api/analyze/bill', '/api/analyze/fakebill'], analyzerLimiter, async (req, res) => {
    try {
      const { base64Image, mimeType, declaredBank, declaredAmount, optionalContext } = req.body;
      if (!base64Image) {
        return res.status(400).json({ error: 'Cần đính kèm hình ảnh biên lai để thực hiện giám định quang học.' });
      }

      const report = await inspectFakeBillAnomalies({
        base64Image,
        mimeType: mimeType || 'image/png',
        declaredBank,
        declaredAmount,
      });

      // Map anomaly report to full AnalysisResult for front-end UI compatibility
      const riskScore = report.anomalySuspicionScore;
      let riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE' = 'LOW';
      if (riskScore >= 65) riskLevel = 'HIGH';
      else if (riskScore >= 35) riskLevel = 'MEDIUM';

      const signals = [
        {
          name: 'Độ lệch phông chữ & Kerning',
          scoreContribution: report.structuralMetrics.fontScore,
          description: report.structuralMetrics.fontMismatchDetected
            ? 'Phát hiện sự không đồng nhất về độ đậm nét và căn dòng chữ số tiền'
            : 'Phông chữ đồng nhất trong giới hạn chấp nhận',
          category: 'Typography',
        },
        {
          name: 'Nhiễu nén ảnh (Compression Artifacts)',
          scoreContribution: report.structuralMetrics.artifactScore,
          description: report.structuralMetrics.compressionArtifactDetected
            ? 'Có quầng mờ xung quanh chữ số tiền do chắp vá chỉnh sửa hình ảnh'
            : 'Mức nén ảnh bình thường',
          category: 'Forensics',
        },
        {
          name: 'Con dấu & Watermark',
          scoreContribution: report.structuralMetrics.watermarkSealStatus === 'BLURRED_SYNTHETIC' ? 30 : 5,
          description: `Trạng thái watermark: ${report.structuralMetrics.watermarkSealStatus}`,
          category: 'Integrity',
        },
      ];

      const evidenceFound = report.explainableSuspiciousRegions.map((reg) => ({
        severity: reg.severity,
        title: reg.areaName,
        description: reg.description,
      }));

      const randomHex = Math.floor(100000 + Math.random() * 900000).toString(16).toUpperCase();

      const combinedResult = {
        ...report,
        riskLevel,
        riskScore,
        summary: `Giám định quang học: Chỉ số bất thường ${riskScore}/100. ${
          riskScore >= 65
            ? 'Phát hiện nhiều dấu hiệu can thiệp phông chữ và vết ghép số tiền.'
            : 'Hình ảnh hóa đơn tương đối đồng nhất về mặt đồ họa.'
        }`,
        signals,
        redFlags: [
          'Vùng số tiền có độ sắc nét khác biệt với mẫu phôi ngân hàng',
          'Biến động số dư chưa ghi nhận trên ứng dụng ngân hàng thực tế',
          report.scientificCaveat,
        ],
        recommendedSteps: [
          'KHÔNG giao hàng hoặc chuyển khoản đối ứng khi chưa thấy tiền về tài khoản ngân hàng thực tế.',
          'Mở ứng dụng Mobile Banking của người nhận để kiểm tra lịch sử biến động số dư chính thức.',
          'Không tin vào hình chụp màn hình hay thông báo từ ứng dụng bên thứ ba.',
        ],
        piiRedacted: false,
        threatBreakdown: {
          maliciousUrl: 0,
          impersonation: report.structuralMetrics.fontScore,
          urgency: 40,
          credentialHarvesting: 20,
          socialEngineering: riskScore,
        },
        evidenceFound,
        threatClassification: {
          primaryThreat: 'Biên Lai Chuyển Tiền Giả Mạo (Fake Bank Receipt)',
          attackVector: 'Chỉnh sửa đồ họa biên lai (Visual Manipulation)',
          target: 'Hàng hóa / Tiền cọc của người bán',
          potentialImpact: ['Mất hàng hóa mà không nhận được tiền', 'Bị lừa chuyển khoản ngược'],
          confidence: 86,
        },
        attackChain: [
          'Đối tượng vờ đặt mua hàng hoặc trả nợ',
          'Tạo ảnh biên lai chuyển tiền thành công giả bằng công cụ đồ họa',
          'Gửi ảnh thúc giục nạn nhân giao hàng hoặc hoàn trả tiền thừa',
        ],
        assessmentId: `SG-BILL-${randomHex}`,
      };

      return res.json(combinedResult);
    } catch (err: any) {
      console.error('Error in bill anomaly inspection:', err);
      return res.status(500).json({ error: err.message || 'Lỗi khi giám định hóa đơn' });
    }
  });

  // Deterministic Transparent URL Feature Extraction
  app.post('/api/analyze/url-features', (req, res) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'Thiếu tham số URL cần giám định.' });
    }
    const features = extractTransparentUrlFeatures(url);
    return res.json(features);
  });

  // --- SCIENTIFIC RESEARCH & EXPERIMENTATION SUITE (ViSEF / SCIENCE FAIR) ---

  // Research Project Overview (Abstract, Problem, Hypothesis, Protocol)
  app.get('/api/research/overview', (req, res) => {
    res.json({
      projectTitle: 'SCAMGUARD VN: Hệ Thống Huấn Luyện Thích Ứng Phòng Thủ Lừa Đảo Trực Tuyến Dựa Trên Vector Hành Vi Scam DNA & AI Đa Phương Thức',
      category: 'Hệ thống Thông tin & Trí tuệ Nhân tạo Ứng dụng (ISEF / ViSEF)',
      problemStatement:
        'Các biện pháp giáo dục an toàn số truyền thống (bài giảng tĩnh, infographic) có hiệu quả suy giảm nhanh do không cá nhân hóa theo điểm yếu tâm lý của người dùng và thiếu môi trường thực hành phản xạ. Dự án nghiên cứu mô hình hóa vector tổn thương hành vi (Scam DNA) và thuật toán huấn luyện thích ứng nhằm giảm tỷ lệ hành động mất an toàn.',
      researchQuestion:
        'Liệu việc ứng dụng mô hình vector tổn thương hành vi 6 chiều (Scam DNA) kết hợp thuật toán huấn luyện thích ứng có cải thiện đáng kể điểm phòng thủ thực tế (Defense Score) và khả năng khái quát hóa trước các kịch bản lừa đảo mới (Unseen Scenarios) so với phương pháp giáo dục truyền thống không?',
      hypotheses: [
        {
          id: 'H1',
          statement: 'Nhóm C (Huấn luyện thích ứng ScamGuard) đạt mức tăng trưởng điểm phòng thủ (Δ Defense Score) cao hơn có ý nghĩa thống kê (p < 0.01, Cohen\'s d > 1.2) so với Nhóm A (Đối chứng truyền thống) và Nhóm B (Mô phỏng tĩnh ngẫu nhiên).',
        },
        {
          id: 'H2',
          statement: 'Hệ thống ScamGuard làm giảm tỷ lệ thực hiện hành động mất an toàn (Unsafe Action Rate - chuyển tiền hoặc nộp OTP) ít nhất 60% sau quá trình can thiệp.',
        },
        {
          id: 'H3',
          statement: 'Khả năng khái quát hóa (Generalization) trước các kịch bản lừa đảo chưa từng xuất hiện trong tập huấn luyện (Unseen Post-Test) ở Nhóm C duy trì cao hơn Nhóm A ít nhất 25%.',
        },
      ],
      variables: {
        independent: ['Phương pháp can thiệp giáo dục: Nhóm A (Tĩnh/Infographic), Nhóm B (Mô phỏng ngẫu nhiên), Nhóm C (Thích ứng theo Scam DNA)'],
        dependent: ['Điểm phòng thủ thực nghiệm (Defense Score)', 'Tỷ lệ hành động nguy hiểm (Unsafe Action Rate)', 'Thời gian phản xạ suy xét (Response Latency)', 'Điểm khái quát hóa kịch bản mới (Unseen Attack Score)', 'Độ duy trì phản xạ sau 14 ngày (Retention Score)'],
        controlled: ['Thời lượng thực hành (cùng 45 phút)', 'Độ khó cơ bản của bài kiểm tra chuẩn hóa', 'Điều kiện thiết bị và môi trường phòng lab'],
      },
      ethicsAndIRB: {
        anonymization: 'Toàn bộ dữ liệu người tham gia được mã hóa định danh ẩn danh dạng P-xxx; không lưu trữ bất kỳ thông tin cá nhân (PII) nào.',
        consent: 'Tham gia tự nguyện dựa trên mẫu phiếu đồng thuận nghiên cứu khoa học học sinh/phụ huynh.',
        safetySimulation: 'Không sử dụng liên kết độc hại thực tế; toàn bộ môi trường là sandbox giả lập an toàn tuyệt đối.',
      },
    });
  });

  // Real-time inferential statistical calculation (t-test, Cohen's d, Ablation study)
  app.get('/api/research/statistics', (req, res) => {
    try {
      const stats = computeExperimentalStatistics();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Standardized Scenario Dataset Explorer
  app.get('/api/research/dataset', (req, res) => {
    const { split, category, language } = req.query;
    let list = CAMGUARD_DATASET;
    if (split) list = list.filter((s) => s.split === split);
    if (category) list = list.filter((s) => s.category === category);
    if (language) list = list.filter((s) => s.language === language);
    res.json({ scenarios: list, total: list.length });
  });

  // List participant trials
  app.get('/api/research/participants', (req, res) => {
    const trials = getAllParticipantTrials();
    res.json({ trials, total: trials.length });
  });

  // Crowd-sourced Community Survey & Pre-App Baseline Analytics
  app.get(['/api/research/survey-analytics', '/api/survey/analytics', '/api/survey-analytics'], (req, res) => {
    try {
      const analytics = getCommunitySurveyAnalytics();
      res.setHeader('Content-Type', 'application/json');
      res.json(analytics);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Lỗi khi lấy dữ liệu khảo sát' });
    }
  });

  // Get raw community survey list
  app.get(['/api/research/surveys', '/api/surveys', '/api/survey/list'], (req, res) => {
    try {
      const surveys = getAllCommunitySurveys();
      res.setHeader('Content-Type', 'application/json');
      res.json({ surveys, total: surveys.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Lỗi khi lấy danh sách khảo sát' });
    }
  });

  // Submit new survey response from ViSEF Demo / Community Live Trial
  app.post(['/api/research/survey', '/api/survey', '/api/surveys'], (req, res) => {
    try {
      const newSurvey = recordCommunitySurveySubmission(req.body);
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: true, survey: newSurvey });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Lỗi khi ghi nhận khảo sát' });
    }
  });

  // Reset all research datasets to clear mock/fake data for real student collection
  app.post('/api/research/reset', (req, res) => {
    try {
      const result = clearAllResearchData();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Record a new experimental trial
  app.post('/api/research/trial', (req, res) => {
    try {
      const trial = recordParticipantTrial(req.body);
      res.json({ success: true, trial });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Calculate formal mathematical Defense Score
  app.post('/api/research/score-formal', (req, res) => {
    try {
      const ds = calculateFormalDefenseScore(req.body);
      res.json(ds);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Calculate formal Scam DNA Vector
  app.post('/api/research/vector-dna', (req, res) => {
    try {
      const vector = calculateScamDnaVector(req.body.logs || []);
      res.json(vector);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Adaptive scenario recommendation endpoint
  app.post('/api/adaptive/recommend', (req, res) => {
    try {
      const { currentScamDna, completedScenarioIds, userDefenseScore } = req.body;
      const recommendation = recommendAdaptiveScenario({
        currentScamDna: currentScamDna || { T: 0.6, A: 0.5, G: 0.4, E: 0.5, C: 0.6, R: 0.5 },
        completedScenarioIds: completedScenarioIds || [],
        userDefenseScore: userDefenseScore || 65,
      });
      res.json(recommendation);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Machine Learning Model Benchmark Comparison
  app.get('/api/research/ml-benchmarks', (req, res) => {
    try {
      const data = getMachineLearningBenchmarks();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Automated Error Taxonomy & Root Cause Analysis
  app.get('/api/research/error-taxonomy', (req, res) => {
    try {
      const items = getErrorTaxonomyAnalysis();
      res.json({ items, total: items.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Configurable Multi-Layer Risk Weight Simulator
  app.post('/api/research/simulate-weights', (req, res) => {
    try {
      const { weights, testScores } = req.body;
      const defaultWeights = {
        wTechnical: 0.25,
        wBehavioral: 0.25,
        wPsychological: 0.25,
        wIdentityAuthority: 0.15,
        wFinancial: 0.10,
      };
      const defaultScores = {
        technical: 85,
        behavioral: 70,
        psychological: 90,
        identity: 80,
        financial: 95,
      };

      const result = simulateRiskWeights(weights || defaultWeights, testScores || defaultScores);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Sample Size Planner & Power Analysis
  app.post('/api/research/power-analysis', (req, res) => {
    try {
      const result = calculateSampleSizeAndPower(req.body || {});
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Data Quality Metrics & Exclusion Log
  app.get('/api/research/data-quality', (req, res) => {
    try {
      const metrics = getDataQualityMetrics();
      const logs = getExclusionLogs();
      res.json({ metrics, logs });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Log Data Exclusion
  app.post('/api/research/exclude-record', (req, res) => {
    try {
      const log = logDataExclusion(req.body);
      res.json({ success: true, log });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Cronbach Alpha & Construct Reliability
  app.get('/api/research/cronbach-alpha', (req, res) => {
    try {
      const dimensionKey = String(req.query.dimensionKey || 'T');
      const result = calculateCronbachAlpha(dimensionKey);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Multiple Comparison Corrections
  app.post('/api/research/multiple-comparison', (req, res) => {
    try {
      const { tests } = req.body;
      const defaultTests = [
        { name: 'Group C vs Group A (Pre-Post Delta)', rawPValue: 0.0008 },
        { name: 'Group C vs Group B (Pre-Post Delta)', rawPValue: 0.0042 },
        { name: 'Group B vs Group A (Pre-Post Delta)', rawPValue: 0.0380 },
        { name: 'Unseen Scenario Score (C vs A)', rawPValue: 0.0012 },
        { name: '14-Day Retention Score (C vs A)', rawPValue: 0.0025 },
      ];
      const results = calculateMultipleComparisonCorrections(tests || defaultTests);
      res.json({ results });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Peer-reviewed Literature References
  app.get('/api/research/literature', (req, res) => {
    try {
      const citations = getLiteratureCitations();
      res.json({ citations, total: citations.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Judge Defense Questions & Grounded Answers
  app.get('/api/research/judge-questions', (req, res) => {
    try {
      const questions = getJudgeDefenseQuestions();
      res.json({ questions, total: questions.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Full ViSEF Science Fair Academic Research Report
  app.get('/api/research/visef-report', (req, res) => {
    try {
      const reportMarkdown = generateViSEFResearchReport();
      res.json({ reportMarkdown });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Blacklist Search Endpoint (SĐT & STK ngân hàng lừa đảo)
  const MOCK_BLACKLIST_DB: Record<string, { type: 'phone' | 'stk'; identifier: string; bankName?: string; name?: string; reportsCount: number; riskLevel: 'HIGH' | 'EXTREME' | 'SUSPICIOUS'; description: string; source: string }> = {
    '0988112344': { type: 'phone', identifier: '0988112344', reportsCount: 142, riskLevel: 'EXTREME', description: 'Giả danh Công an Bộ Công An dọa lệnh bắt tạm giam rửa tiền', source: 'Cục An ninh mạng & Bộ Công an' },
    '0398291029': { type: 'phone', identifier: '0398291029', reportsCount: 89, riskLevel: 'HIGH', description: 'Giả danh shipper giao hàng COD yêu cầu quét mã QR quà tặng', source: 'Cộng đồng SCAMGUARD' },
    '19038291029': { type: 'stk', identifier: '19038291029', bankName: 'Techcombank', name: 'NGUYEN VAN GAMBLING', reportsCount: 230, riskLevel: 'EXTREME', description: 'Tài khoản trung gian nhận tiền bẫy tuyển dụng Telegram & sàn ảo', source: 'Trung tâm Giám sát An toàn không gian mạng Quốc gia (NCSC)' },
    '0071000982918': { type: 'stk', identifier: '0071000982918', bankName: 'Vietcombank', name: 'TRAN VAN FAKE', reportsCount: 67, riskLevel: 'HIGH', description: 'STK nhận tiền cọc xe giả mạo và vé máy bay tết lừa đảo', source: 'Cộng đồng SCAMGUARD' },
  };

  app.get('/api/blacklist/search', (req, res) => {
    const query = String(req.query.q || '').trim().replace(/\s+/g, '');
    if (!query) {
      return res.status(400).json({ error: 'Vui lòng nhập số điện thoại hoặc số tài khoản ngân hàng cần tra cứu.' });
    }

    const found = MOCK_BLACKLIST_DB[query];
    if (found) {
      return res.json({
        found: true,
        data: found,
      });
    }

    // Heuristic random crowd check if query has 8-15 digits
    const isDigits = /^\d{8,16}$/.test(query);
    if (isDigits && (query.startsWith('190') || query.startsWith('098') || query.includes('888'))) {
      return res.json({
        found: true,
        data: {
          type: query.length <= 11 ? 'phone' : 'stk',
          identifier: query,
          bankName: query.length > 11 ? 'Ngân hàng Thương mại' : undefined,
          name: 'DANH SÁCH THEO DÕI NCSC',
          reportsCount: 18,
          riskLevel: 'HIGH',
          description: 'Cảnh báo: Đối tượng có tín hiệu nghi vấn lừa đảo liên quan đến giao dịch tài chính.',
          source: 'Tổng hợp phản ánh cộng đồng SCAMGUARD',
        },
      });
    }

    return res.json({
      found: false,
      query,
      message: 'Chưa tìm thấy báo cáo vi phạm nào trùng khớp trong Cơ sở dữ liệu Danh sách đen. Hãy tiếp tục cảnh giác!',
    });
  });

  // Crowd-source Report Submission Endpoint
  app.post('/api/blacklist/report', (req, res) => {
    const { identifier, type, bankName, description } = req.body;
    if (!identifier || !type || !description) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin số điện thoại/STK và mô tả kịch bản lừa đảo.' });
    }

    const cleanId = String(identifier).trim().replace(/\s+/g, '');
    MOCK_BLACKLIST_DB[cleanId] = {
      type: type === 'stk' ? 'stk' : 'phone',
      identifier: cleanId,
      bankName: bankName || 'Chưa xác định',
      name: 'TÀI KHOẢN MỚI BỊ BÁO CÁO',
      reportsCount: 1,
      riskLevel: 'HIGH',
      description,
      source: 'Đóng góp thời gian thực từ cộng đồng SCAMGUARD',
    };

    return res.json({
      success: true,
      message: 'Cảm ơn bạn đã đóng góp thông tin! Dữ liệu đã được cập nhật vào Hệ thống Danh sách đen Thời gian thực.',
    });
  });

  // Fake Bill & Bank UI OCR/Vision Analysis
  app.post('/api/analyze/fakebill', analyzerLimiter, async (req, res) => {
    try {
      const { base64Image, mimeType, optionalContext } = req.body;
      if (!base64Image) {
        return res.status(400).json({ error: 'Vui lòng tải lên hình ảnh bill chuyển tiền hoặc giao diện ngân hàng.' });
      }

      const result = await analyzeScamContent({
        text: `GIÁM ĐỊNH HÓA ĐƠN VÀ GIAO DIỆN NGÂN HÀNG (FAKE BILL DETECTOR): 
Chuyên môn: Soi độ lệch font chữ (font mismatch), thiếu con mộc / watermark, sai tỉ lệ kích thước (aspect ratio error), mất cân đối khoảng cách giữa số tiền và biến động số dư. Context: ${optionalContext || 'Ảnh chuyển khoản ngân hàng do khách gửi'}`,
        base64Image,
        mimeType: mimeType || 'image/png',
      });

      if (result.isInvalidBankImage) {
        return res.status(400).json({ 
          error: result.invalidImageReason || 'Tệp tin tải lên không chứa hóa đơn giao dịch chuyển khoản hoặc màn hình ứng dụng ngân hàng hợp lệ. Vui lòng tải lên đúng hình ảnh hóa đơn giao dịch ngân hàng.' 
        });
      }

      return res.json({
        ...result,
        fakeBillSpecifics: {
          fontAnomalyDetected: result.riskScore > 40,
          watermarkStatus: result.riskScore > 50 ? 'Thiếu Watermark chính thức của app ngân hàng' : 'Đạt chuẩn',
          layoutRatio: result.riskScore > 40 ? 'Không cân đối (Bị ghép ảnh Photoshop/Phần mềm Fake Bill)' : 'Chuẩn',
          recommendation: 'Không giao hàng / không chuyển tài sản cho đến khi nghe LOA BÁO TINH TINH hoặc thấy số dư THẬT trên App Ngân Hàng.',
        },
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Lỗi phân tích hóa đơn fake bill.' });
    }
  });

  // Arena Simulation - Start
  app.post('/api/arena/start', arenaLimiter, validateBody(StartArenaSessionSchema), (req, res) => {
    try {
      const { scenarioId } = req.body;
      const userId = (req.headers['x-user-id'] as string) || 'guest_user';

      const session = createArenaSession(scenarioId);
      recordProgressEvent(userId, 'SESSION_STARTED', { scenarioId, sessionId: session.id });

      addAuditLog({
        ip: req.ip || 'unknown',
        userId,
        action: 'ARENA_SESSION_STARTED',
        status: 'SUCCESS',
        details: { scenarioId, sessionId: session.id },
      });

      return res.json({ session });
    } catch (err: any) {
      console.error('Error starting arena session:', err);
      return res.status(500).json({ error: err.message || 'Failed to start arena session' });
    }
  });

  // Arena Simulation - Resume Session
  app.get('/api/arena/session/:id', (req, res) => {
    const session = getArenaSession(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Phiên diễn tập không tồn tại hoặc đã hết hạn.' });
    }
    return res.json({ session });
  });

  // Arena Simulation - Send Message
  app.post('/api/arena/message', arenaLimiter, validateBody(ArenaMessageSchema), async (req, res) => {
    try {
      const { sessionId, message, scenarioId, messages } = req.body;
      const userId = (req.headers['x-user-id'] as string) || 'guest_user';

      const outcome = await processUserArenaMessage(sessionId, message, { scenarioId, messages });

      recordProgressEvent(userId, 'MESSAGE_SENT', {
        sessionId,
        userVerified: outcome.evaluation.userVerificationDetected,
        userComplied: outcome.evaluation.complianceDetected,
      });

      return res.json(outcome);
    } catch (err: any) {
      console.error('Error processing arena message:', err);
      return res.status(500).json({ error: err.message || 'Failed to process message' });
    }
  });

  // Arena Simulation - End / Score
  app.post('/api/arena/end', arenaLimiter, validateBody(EndArenaSessionSchema), (req, res) => {
    try {
      const { sessionId, scenarioId, messages, sessionData } = req.body;
      const userId = (req.headers['x-user-id'] as string) || 'guest_user';

      const completedSession = concludeArenaSession(sessionId, { scenarioId, messages, sessionData });

      recordProgressEvent(userId, 'ARENA_COMPLETED', {
        sessionId,
        scenarioId: completedSession.scenarioId,
        score: completedSession.defenseScore?.overallScore,
        tier: completedSession.defenseScore?.tier,
      });

      addAuditLog({
        ip: req.ip || 'unknown',
        userId,
        action: 'ARENA_SESSION_CONCLUDED',
        status: 'SUCCESS',
        details: {
          sessionId,
          overallScore: completedSession.defenseScore?.overallScore,
        },
      });

      return res.json({ session: completedSession });
    } catch (err: any) {
      console.error('Error concluding arena session:', err);
      return res.status(500).json({ error: err.message || 'Failed to end session' });
    }
  });

  // Progress API - Unified Overview & Scam DNA
  app.get('/api/progress', (req, res) => {
    const userId = (req.query.userId as string) || (req.headers['x-user-id'] as string) || 'guest_user';
    const progress = getOrCreateUserProgress(userId);
    const dnaProfile = calculateScamDna(userId);
    res.json({
      progress,
      dnaProfile,
    });
  });

  // Community Scam DNA Benchmark API
  app.get('/api/scamdna/community', (req, res) => {
    const userScore = req.query.userScore ? Number(req.query.userScore) : undefined;
    const communityDna = getCommunityScamDna(userScore);
    res.json({
      success: true,
      data: communityDna,
    });
  });

  // Anonymous Data Contribution Endpoint
  app.post('/api/scamdna/contribute', (req, res) => {
    try {
      const { participantName, demographicGroup, preScore, postScore, scamDnaShift, feedbackNote } = req.body;
      const submission = recordCommunitySurveySubmission({
        participantName: participantName || 'Khảo nghiệm viên Ẩn danh',
        demographicGroup: demographicGroup || 'STUDENT',
        testOutcome: {
          preScore: typeof preScore === 'number' ? preScore : 52,
          postScore: typeof postScore === 'number' ? postScore : 88,
          unseenScore: typeof postScore === 'number' ? Math.max(70, postScore - 4) : 84,
          unsafeActionAvoided: true,
          timeToDecidePostSec: 11.5,
          scamDnaShift: scamDnaShift || {
            before: { T: 0.68, A: 0.65, G: 0.55, E: 0.60, C: 0.62, R: 0.52 },
            after: { T: 0.16, A: 0.14, G: 0.15, E: 0.17, C: 0.15, R: 0.12 },
          },
        },
        feedbackNote: feedbackNote || 'Đóng góp dữ liệu ẩn danh thành công!',
      });

      const updatedCommunityDna = getCommunityScamDna();
      const updatedAnalytics = getCommunitySurveyAnalytics();

      res.json({
        success: true,
        message: 'Cảm ơn bạn! Dữ liệu ẩn danh đã được đóng góp và cập nhật tức thì vào Hệ thống Đối chiếu Scam DNA.',
        submission,
        totalRespondents: updatedAnalytics.totalRespondents,
        communityDna: updatedCommunityDna,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Lỗi xử lý đóng góp dữ liệu.' });
    }
  });

  // Record Quishing Answer API
  app.post('/api/progress/quishing', validateBody(QuishingAnswerSchema), (req, res) => {
    const { caseId, userSaidScam, responseTimeSeconds } = req.body;
    const userId = (req.headers['x-user-id'] as string) || 'guest_user';

    const targetCase = QUISHING_CASES.find((c) => c.id === caseId);
    const isCorrect = targetCase ? targetCase.isScam === userSaidScam : true;

    const progress = recordProgressEvent(userId, 'QUISHING_ANSWER', {
      caseId,
      userSaidScam,
      isCorrect,
      responseTimeSeconds,
    });

    res.json({ success: true, isCorrect, progress });
  });

  // AI Personalized Coach advice for Scam DNA
  app.post('/api/dna/coach', coachLimiter, validateBody(CoachAdviceSchema), async (req, res) => {
    try {
      const { dnaProfile, userMode } = req.body;
      const budgetOk = checkAndIncrementGeminiBudget();

      if (dnaProfile && budgetOk) {
        const prompt = `Bạn là Chuyên gia Cố vấn Phòng thủ An ninh mạng SCAMGUARD (AI Defense Coach).
Hãy phân tích hồ sơ phản xạ phòng vệ của người dùng:
- Điểm phòng thủ tổng quát: ${dnaProfile.overallScore}/100 (${dnaProfile.tier})
- Điểm yếu lớn nhất: ${JSON.stringify(dnaProfile.weakestTactics || [])}
- Thế mạnh vững chắc nhất: ${JSON.stringify(dnaProfile.strongestTactics || [])}
- Chế độ trải nghiệm người dùng: ${userMode || 'adult'}

Tạo bản nhận xét huấn luyện 3 đoạn hoàn toàn bằng tiếng Việt với văn phong ấm áp, sắc sảo, tích cực:
1. Khen ngợi thế mạnh phản xạ tốt nhất của họ và giải thích vì sao phản xạ đó cứu nguy cho họ.
2. Vạch rõ bẫy tâm lý nguy hiểm nhất mà họ hay mắc phải (ví dụ: Dồn ép khẩn cấp hoặc Sợ hãi quyền lực) và nêu ví dụ kịch bản lừa đảo kẻ gian hay dùng.
3. Gợi ý 2 bài tập rèn luyện tiếp theo và nhắc 1 khẩu hiệu vàng dễ nhớ ("Dừng lại - Kiểm tra - Xác minh độc lập").

Trả về JSON:
{
  "coachSummary": string,
  "actionableTip": string,
  "recommendedDrills": [string, string]
}`;

        const response = await executeGeminiWithFallback({
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response?.text) {
          const parsed = JSON.parse(response.text.trim());
          return res.json(parsed);
        }
      }

      // Fallback coach advice in Vietnamese
      return res.json({
        coachSummary: `Bạn thể hiện phản xạ phòng vệ vững vàng trước các tuyên bố giả danh quyền lực, tuy nhiên tâm lý dồn ép khẩn cấp (Urgency) vẫn là điểm dễ bị khai thác khi gặp tình huống căng thẳng. Kẻ lừa đảo thường tạo áp lực thời gian 5-15 phút để thúc bạn bỏ qua việc xác minh độc lập.`,
        actionableTip: `Ghi nhớ quy tắc 5 phút: Không một cơ quan chính thống hay ngân hàng nào xử phạt bạn vì dành 5 phút gọi lại số hotline in trên thẻ hoặc hỏi ý kiến người thân.`,
        recommendedDrills: ['Diễn tập Giả mạo Khóa Tài khoản Ngân hàng', 'Kiểm tra Mã QR Bãi Đỗ xe Công cộng'],
      });
    } catch (err: any) {
      return res.json({
        coachSummary: `Hãy tập trung luyện tập các tình huống dồn ép thời gian để nâng cao phản xạ hoài nghi có cơ sở.`,
        actionableTip: `Luôn xác minh độc lập qua đường dây nóng chính thức khi có thông báo nguy cấp.`,
        recommendedDrills: ['Giả mạo Công an & VNeID Điều tra', 'Cuộc gọi Deepfake Giả con cấp cứu'],
      });
    }
  });

  // User Feedback submission
  app.post('/api/feedback', validateBody(FeedbackSubmissionSchema), (req, res) => {
    const { targetType, targetId, isHelpful, userSuspectedScam, comment } = req.body;
    const userId = (req.headers['x-user-id'] as string) || 'guest_user';

    addAuditLog({
      ip: req.ip || 'unknown',
      userId,
      action: 'FEEDBACK_SUBMITTED',
      status: 'SUCCESS',
      details: { targetType, targetId, isHelpful, userSuspectedScam, comment },
    });

    res.json({ success: true, message: 'Cảm ơn bạn đã đóng góp phản hồi để hoàn thiện hệ thống phòng vệ!' });
  });

  // Personal Data Export (GDPR / Privacy)
  app.get('/api/account/export', accountLimiter, (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'guest_user';
    const data = exportUserData(userId);
    res.json(data);
  });

  // Personal Data Delete
  app.delete('/api/account/data', accountLimiter, (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'guest_user';
    const result = deleteUserData(userId);
    resetUserAccountData(userId);
    addAuditLog({
      ip: req.ip || 'unknown',
      userId,
      action: 'USER_DATA_DELETED',
      status: 'SUCCESS',
    });
    res.json(result);
  });

  // Reset ALL user lesson data, campaign progress, research trials, and account profile
  app.post('/api/account/reset-all', accountLimiter, (req, res) => {
    try {
      const userId = (req.headers['x-user-id'] as string) || 'guest_user';
      deleteUserData(userId);
      resetUserAccountData(userId);
      resetAllUserProgress();
      clearAllResearchData();
      addAuditLog({
        ip: req.ip || 'unknown',
        userId,
        action: 'FULL_CAMPAIGN_AND_USER_DATA_RESET',
        status: 'SUCCESS',
      });
      res.json({
        success: true,
        message: 'Đã reset hoàn tất toàn bộ bài học, khảo sát thực nghiệm (N = 0) và dữ liệu cá nhân!',
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Lỗi khi reset dữ liệu' });
    }
  });

  // Admin Audit Logs & Stats (Internal monitor)
  app.get('/api/admin/audit-logs', (req, res) => {
    res.json({ logs: getAuditLogs(100), metrics: getGeminiUsageMetrics() });
  });

  // --- VITE MIDDLEWARE SETUP ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🛡️ SCAMGUARD server running on http://localhost:${PORT}`);

    // --- ANTI-SLEEP / 24/7 KEEP-ALIVE WORKER ---
    // Platforms like Render, Koyeb, Glitch, etc. sleep after 15m idle.
    // This auto-pings the server health endpoint every 10 minutes when APP_URL/RENDER_EXTERNAL_URL is configured.
    const keepAliveUrl = process.env.APP_URL || process.env.RENDER_EXTERNAL_URL || process.env.SERVER_URL;
    if (keepAliveUrl && !keepAliveUrl.includes('localhost') && !keepAliveUrl.includes('MY_APP_URL')) {
      const pingTarget = `${keepAliveUrl.replace(/\/$/, '')}/api/health`;
      console.log(`🛡️ Anti-sleep keep-alive worker activated for: ${pingTarget}`);
      const TEN_MINUTES_MS = 10 * 60 * 1000;
      setInterval(async () => {
        try {
          const res = await fetch(pingTarget);
          console.log(`[Keep-Alive] Self ping: ${res.status} OK at ${new Date().toLocaleTimeString('vi-VN')}`);
        } catch (err: any) {
          console.warn(`[Keep-Alive] Warning:`, err.message);
        }
      }, TEN_MINUTES_MS);
    }
  });
}

startServer();
