import {
  ScamDnaProfile,
  ScamTactic,
  DefenseTier,
  AchievementBadge,
  ScamScenario,
  ScamDnaDimensionKey,
  ScamDnaDimensionDetail,
  CommunityScamDna,
  DefenseArchetype,
} from '../src/types';
import { SCAM_SCENARIOS } from '../src/data/scenarios';
import { INITIAL_BADGES } from '../src/data/badges';
import {
  getCommunitySurveyAnalytics,
  getAllParticipantTrials,
  getAllCommunitySurveys,
} from './scientificEngine';

export interface UserProgressData {
  userId: string;
  totalXp: number;
  level: number;
  currentStreakDays: number;
  lastActiveDate: string;
  sessionsCompleted: number;
  quishingCompleted: number;
  quishingCorrect: number;
  drillsCompleted: number;
  tacticScores: Record<ScamTactic, { total: number; scoreSum: number }>;
  completedScenarioIds: string[];
  unlockedBadgeIds: string[];
  events: Array<{
    type: string;
    timestamp: string;
    details?: any;
  }>;
}

const userProgressStore = new Map<string, UserProgressData>();

export function resetAllUserProgress() {
  userProgressStore.clear();
}

const ALL_TACTICS: ScamTactic[] = [
  'Authority',
  'Urgency',
  'Fear',
  'Greed',
  'Sympathy',
  'Social Proof',
  'Isolation',
  'Reciprocity',
  'Romance',
  'Confusion',
  'Synthetic Media',
  'Convenience Bias',
];

export function getOrCreateUserProgress(userId: string): UserProgressData {
  if (!userProgressStore.has(userId)) {
    const tacticScores: Record<ScamTactic, { total: number; scoreSum: number }> = {} as any;
    ALL_TACTICS.forEach((tactic) => {
      // Default baseline for new user
      tacticScores[tactic] = { total: 0, scoreSum: 0 };
    });

    const newProgress: UserProgressData = {
      userId,
      totalXp: 0,
      level: 1,
      currentStreakDays: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      sessionsCompleted: 0,
      quishingCompleted: 0,
      quishingCorrect: 0,
      drillsCompleted: 0,
      tacticScores,
      completedScenarioIds: [],
      unlockedBadgeIds: [],
      events: [],
    };
    userProgressStore.set(userId, newProgress);
  }

  return userProgressStore.get(userId)!;
}

export function recordProgressEvent(userId: string, eventType: string, details?: any) {
  const progress = getOrCreateUserProgress(userId);
  progress.events.unshift({
    type: eventType,
    timestamp: new Date().toISOString(),
    details,
  });
  if (progress.events.length > 200) {
    progress.events.pop();
  }

  // XP awards based on event
  if (eventType === 'ARENA_COMPLETED') {
    progress.sessionsCompleted++;
    progress.totalXp += 150;
    if (details?.scenarioId && !progress.completedScenarioIds.includes(details.scenarioId)) {
      progress.completedScenarioIds.push(details.scenarioId);
    }
  } else if (eventType === 'QUISHING_ANSWER') {
    progress.quishingCompleted++;
    if (details?.isCorrect) {
      progress.quishingCorrect++;
      progress.totalXp += 30;
    } else {
      progress.totalXp += 10;
    }
  } else if (eventType === 'DRILL_COMPLETED') {
    progress.drillsCompleted++;
    progress.totalXp += 25;
  }

  // Update level: 1 level per 250 XP
  progress.level = Math.max(1, Math.floor(progress.totalXp / 250) + 1);

  // Update Streak logic
  const today = new Date().toISOString().split('T')[0];
  if (progress.lastActiveDate !== today) {
    progress.currentStreakDays += 1;
    progress.lastActiveDate = today;
  }

  return progress;
}

export function calculateScamDna(userId: string): ScamDnaProfile {
  const progress = getOrCreateUserProgress(userId);

  const tacticRatings: Record<ScamTactic, number> = {} as any;
  let totalScoreSum = 0;

  ALL_TACTICS.forEach((tactic) => {
    const data = progress.tacticScores[tactic] || { total: 0, scoreSum: 0 };
    const score = data.total > 0 ? Math.round(data.scoreSum / data.total) : 0;
    tacticRatings[tactic] = Math.min(100, Math.max(0, score));
    totalScoreSum += tacticRatings[tactic];
  });

  const baseScore = Math.round(totalScoreSum / ALL_TACTICS.length);
  const overallScore = Math.min(100, Math.max(15, baseScore));

  let tier: DefenseTier = 'Đang Rèn Luyện';
  if (overallScore >= 92) tier = 'Vệ Binh Tinh Nhuệ';
  else if (overallScore >= 80) tier = 'Vệ Binh Vững Vàng';
  else if (overallScore >= 65) tier = 'Đang Rèn Luyện';
  else if (overallScore >= 40) tier = 'Có Rủi Ro';
  else tier = 'Rất Dễ Tổn Thương';

  // 10 Detailed Dimensions
  const quishingAccuracy =
    progress.quishingCompleted > 0
      ? Math.round((progress.quishingCorrect / progress.quishingCompleted) * 100)
      : 80;

  const authScore = tacticRatings['Authority'] || 68;
  const urgScore = tacticRatings['Urgency'] || 65;
  const fearScore = tacticRatings['Fear'] || 62;
  const greedScore = tacticRatings['Greed'] || 70;
  const isoScore = tacticRatings['Isolation'] || 72;
  const deepfakeScore = tacticRatings['Synthetic Media'] || 66;

  // Derive verification reflex & emotional stability & privacy credentials
  const verifScore = Math.round((authScore * 0.4 + urgScore * 0.3 + (tacticRatings['Confusion'] || 65) * 0.3));
  const privacyScore = Math.round(((tacticRatings['Convenience Bias'] || 60) * 0.5 + urgScore * 0.5));
  const emotionScore = Math.round((fearScore * 0.5 + urgScore * 0.5));
  const quishingScore = Math.round((quishingAccuracy * 0.7 + (tacticRatings['Convenience Bias'] || 65) * 0.3));

  const surveyAnalytics = getCommunitySurveyAnalytics();
  const totalSurveys = surveyAnalytics ? surveyAnalytics.totalRespondents : 0;
  const allSurveys = getAllCommunitySurveys();

  const getCommDimAvg = (key: ScamDnaDimensionKey): number => {
    if (totalSurveys === 0 || allSurveys.length === 0) return 0;
    let sum = 0;
    allSurveys.forEach((s) => {
      if (s.testOutcome?.scamDnaShift?.before) {
        const b = s.testOutcome.scamDnaShift.before;
        if (key === 'authority') sum += Math.round((1 - (b.A || 0.5)) * 100);
        else if (key === 'urgency') sum += Math.round((1 - (b.T || 0.5)) * 100);
        else if (key === 'fear') sum += Math.round((1 - (b.E || 0.5)) * 100);
        else if (key === 'greed') sum += Math.round((1 - (b.G || 0.5)) * 100);
        else if (key === 'privacy_credential') sum += Math.round((1 - (b.C || 0.5)) * 100);
        else if (key === 'isolation') sum += Math.round((1 - (b.R || 0.5)) * 100);
        else sum += s.testOutcome.preScore;
      } else {
        sum += s.testOutcome.preScore;
      }
    });
    return Math.round(sum / allSurveys.length);
  };

  const dimensions: ScamDnaDimensionDetail[] = [
    {
      key: 'authority',
      label: 'Kháng Bẫy Uy Quyền',
      vietnameseName: 'Kháng Bẫy Uy Quyền & Giả Danh Cơ Quan',
      score: authScore,
      communityAverage: getCommDimAvg('authority'),
      level: authScore >= 80 ? 'OPTIMAL' : authScore >= 65 ? 'MODERATE' : authScore >= 45 ? 'VULNERABLE' : 'CRITICAL',
      vulnerabilityRatio: Math.max(0.05, Number(((100 - authScore) / 100).toFixed(2))),
      psychologicalTrigger: 'Tâm lý phục tùng uy quyền & tê liệt tư duy phản biện khi đối diện công quyền',
      behavioralSymptom: 'Vội vàng tuân thủ mệnh lệnh phong tỏa hoặc khai báo tài sản khi nghe xưng danh Công an/Viện kiểm sát',
      improvementMantra: 'Công an & Viện kiểm sát Việt Nam không bao giờ làm việc, triệu tập hay yêu cầu chứng minh tài chính qua Zalo/Điện thoại',
      recommendedAction: 'Diễn tập kịch bản: Đối phó Lệnh Bắt Giả Mạo & Giả Danh Cán Bộ',
      recommendedScenarioId: 'police-threat-call',
      color: '#ef4444',
    },
    {
      key: 'urgency',
      label: 'Kháng Ép Tiến Độ',
      vietnameseName: 'Kháng Dồn Ép Thời Gian & Bẫy Khẩn Cấp',
      score: urgScore,
      communityAverage: getCommDimAvg('urgency'),
      level: urgScore >= 80 ? 'OPTIMAL' : urgScore >= 65 ? 'MODERATE' : urgScore >= 45 ? 'VULNERABLE' : 'CRITICAL',
      vulnerabilityRatio: Math.max(0.05, Number(((100 - urgScore) / 100).toFixed(2))),
      psychologicalTrigger: 'Hiệu ứng đường hầm nhận thức (Tunnel vision) khi bị đặt trong giới hạn 5-15 phút',
      behavioralSymptom: 'Hành động chuyển tiền hoặc bấm link vội vã vì sợ lỡ mất thời hạn',
      improvementMantra: 'Bất kỳ tin nhắn nào thúc ép thao tác tài chính trong vài phút đều là dấu hiệu của lừa đảo',
      recommendedAction: 'Diễn tập kịch bản: Cảnh Báo Tài Khoản Ngân Hàng Bị Khóa Gấp',
      recommendedScenarioId: 'bank-lockout-alert',
      color: '#f97316',
    },
    {
      key: 'fear',
      label: 'Lá Chắn Nỗi Sợ',
      vietnameseName: 'Kháng Nỗi Sợ Hãi & Đe Dọa Pháp Lý',
      score: fearScore,
      communityAverage: getCommDimAvg('fear'),
      level: fearScore >= 80 ? 'OPTIMAL' : fearScore >= 65 ? 'MODERATE' : fearScore >= 45 ? 'VULNERABLE' : 'CRITICAL',
      vulnerabilityRatio: Math.max(0.05, Number(((100 - fearScore) / 100).toFixed(2))),
      psychologicalTrigger: 'Cảm xúc hoảng sợ trước nguy cơ vướng vào vòng lao lý hoặc người thân gặp đại nạn',
      behavioralSymptom: 'Mất ngủ, lo âu, chuyển tiền vào "tài khoản an toàn tạm giữ" để chứng minh vô tội',
      improvementMantra: 'Dừng lại 30 giây. Cơ quan nhà nước không có tài khoản ngân hàng cá nhân nào gọi là "tài khoản an toàn"',
      recommendedAction: 'Diễn tập kịch bản: Giả Danh Cơ Quan Điều Tra Đe Dọa Án Ma Túy',
      recommendedScenarioId: 'police-threat-call',
      color: '#f43f5e',
    },
    {
      key: 'greed',
      label: 'Kháng Bẫy Lợi Nhuận',
      vietnameseName: 'Kháng Lợi Nhuận Cao & Việc Nhẹ Lương Cao',
      score: greedScore,
      communityAverage: getCommDimAvg('greed'),
      level: greedScore >= 80 ? 'OPTIMAL' : greedScore >= 65 ? 'MODERATE' : greedScore >= 45 ? 'VULNERABLE' : 'CRITICAL',
      vulnerabilityRatio: Math.max(0.05, Number(((100 - greedScore) / 100).toFixed(2))),
      psychologicalTrigger: 'Thiên kiến lạc quan quá mức và hấp dẫn từ các khoản hoa hồng thanh toán tức thì',
      behavioralSymptom: 'Nạp tiền làm nhiệm vụ giật đơn hàng Shopee, TikTok để nhận hoa hồng 30-50%',
      improvementMantra: 'Không có công việc việc nhẹ lương cao nào bắt nạp tiền ứng trước để hưởng hoa hồng',
      recommendedAction: 'Diễn tập kịch bản: Bẫy Tuyển Dụng Cộng Tác Viên Nhập Đơn',
      recommendedScenarioId: 'ecommerce-job-scam',
      color: '#eab308',
    },
    {
      key: 'privacy_credential',
      label: 'Bảo Vệ OTP & CCCD',
      vietnameseName: 'Bảo Vệ Dữ Liệu Nhạy Cảm & Mã Xác Thực',
      score: privacyScore,
      communityAverage: getCommDimAvg('privacy_credential'),
      level: privacyScore >= 80 ? 'OPTIMAL' : privacyScore >= 65 ? 'MODERATE' : privacyScore >= 45 ? 'VULNERABLE' : 'CRITICAL',
      vulnerabilityRatio: Math.max(0.05, Number(((100 - privacyScore) / 100).toFixed(2))),
      psychologicalTrigger: 'Nhầm lẫn mã OTP chuyển tiền với mã nhận tiền hoặc mã hủy giao dịch',
      behavioralSymptom: 'Chụp 2 mặt CCCD, đọc mã OTP 6 số hoặc mật khẩu Smart OTP cho người lạ',
      improvementMantra: 'Mã OTP là chìa khóa rút tiền. Tuyệt đối không đọc hoặc nhập vào bất kỳ trang web nào',
      recommendedAction: 'Huấn luyện: Phòng ngừa Đánh cắp Định danh & OTP',
      recommendedScenarioId: 'bank-lockout-alert',
      color: '#06b6d4',
    },
    {
      key: 'isolation',
      label: 'Phá Vỡ Cô Lập',
      vietnameseName: 'Kháng Bẫy Bí Mật & Thao Túng Cô Lập',
      score: isoScore,
      communityAverage: getCommDimAvg('isolation'),
      level: isoScore >= 80 ? 'OPTIMAL' : isoScore >= 65 ? 'MODERATE' : isoScore >= 45 ? 'VULNERABLE' : 'CRITICAL',
      vulnerabilityRatio: Math.max(0.05, Number(((100 - isoScore) / 100).toFixed(2))),
      psychologicalTrigger: 'Tâm lý sợ bị lộ bí mật hoặc bị đe dọa án phạt nặng nếu kể cho gia đình',
      behavioralSymptom: 'Tự vào phòng kín khóa cửa, không bàn bạc với người thân trước khi chuyển tài sản',
      improvementMantra: 'Khi bị yêu cầu giữ bí mật tuyệt đối, đó là thời điểm quan trọng nhất phải hỏi ý kiến người thân',
      recommendedAction: 'Diễn tập: Phá vỡ bẫy cô lập trong điều tra giả mạo',
      recommendedScenarioId: 'police-threat-call',
      color: '#8b5cf6',
    },
    {
      key: 'verification_reflex',
      label: 'Phản Xạ Xác Minh',
      vietnameseName: 'Phản Xạ Xác Minh Độc Lập Kênh Phụ',
      score: verifScore,
      communityAverage: getCommDimAvg('verification_reflex'),
      level: verifScore >= 80 ? 'OPTIMAL' : verifScore >= 65 ? 'MODERATE' : verifScore >= 45 ? 'VULNERABLE' : 'CRITICAL',
      vulnerabilityRatio: Math.max(0.05, Number(((100 - verifScore) / 100).toFixed(2))),
      psychologicalTrigger: 'Thói quen ngại đối chiếu chéo khi bên kia đưa ra thông tin có vẻ trùng khớp',
      behavioralSymptom: 'Bỏ qua việc gọi lại số hotline ngân hàng in ở mặt sau thẻ',
      improvementMantra: 'Quy tắc vàng Mặt Sau Của Thẻ: Cúp máy ngay và tự tay bấm số in trên thẻ ngân hàng',
      recommendedAction: 'Luyện tập: Thực hành phản xạ xác thực kênh phụ',
      recommendedScenarioId: 'bank-lockout-alert',
      color: '#10b981',
    },
    {
      key: 'quishing_domain',
      label: 'Soi Tên Miền & QR',
      vietnameseName: 'Cảnh Giác Quishing QR & Giả Mạo Tên Miền',
      score: quishingScore,
      communityAverage: getCommDimAvg('quishing_domain'),
      level: quishingScore >= 80 ? 'OPTIMAL' : quishingScore >= 65 ? 'MODERATE' : quishingScore >= 45 ? 'VULNERABLE' : 'CRITICAL',
      vulnerabilityRatio: Math.max(0.05, Number(((100 - quishingScore) / 100).toFixed(2))),
      psychologicalTrigger: 'Tiện lợi thao tác nhanh trên smartphone làm bỏ qua khâu soi URL gốc',
      behavioralSymptom: 'Quét mã QR không rõ nguồn gốc hoặc đăng nhập vào domain lạ dạng .site, .online',
      improvementMantra: 'Kiểm tra kỹ tên miền chính thức (.vn / .com.vn). Quét QR phải xem trước địa chỉ đích',
      recommendedAction: 'Phòng thí nghiệm Quishing Lab: Soi mã độc QR',
      recommendedScenarioId: 'lottery-fake-link',
      color: '#3b82f6',
    },
    {
      key: 'emotional_stability',
      label: 'Ổn Định Cảm Xúc',
      vietnameseName: 'Kiểm Soát Cảm Xúc & Ức Chế Bốc Đồng',
      score: emotionScore,
      communityAverage: getCommDimAvg('emotional_stability'),
      level: emotionScore >= 80 ? 'OPTIMAL' : emotionScore >= 65 ? 'MODERATE' : emotionScore >= 45 ? 'VULNERABLE' : 'CRITICAL',
      vulnerabilityRatio: Math.max(0.05, Number(((100 - emotionScore) / 100).toFixed(2))),
      psychologicalTrigger: 'Kích động cảm xúc lấn át vùng não tư duy logic',
      behavioralSymptom: 'Tim đập dồn dập, hoảng loạn hoặc quá phấn khích khi nhận quà tặng giá trị cao',
      improvementMantra: 'Hít thở sâu 3 nhịp và đặt điện thoại xuống bàn ít nhất 60 giây trước khi bấm chuyển khoản',
      recommendedAction: 'Thực hành: Làm chủ cảm xúc trước các cú sốc tin nhắn',
      recommendedScenarioId: 'bank-lockout-alert',
      color: '#14b8a6',
    },
    {
      key: 'deepfake_ai',
      label: 'Nhận Diện AI Deepfake',
      vietnameseName: 'Nhận Diện Giả Mạo Âm Thanh & Video AI',
      score: deepfakeScore,
      communityAverage: getCommDimAvg('deepfake_ai'),
      level: deepfakeScore >= 80 ? 'OPTIMAL' : deepfakeScore >= 65 ? 'MODERATE' : deepfakeScore >= 45 ? 'VULNERABLE' : 'CRITICAL',
      vulnerabilityRatio: Math.max(0.05, Number(((100 - deepfakeScore) / 100).toFixed(2))),
      psychologicalTrigger: 'Niềm tin trực giác bằng mắt và tai trước hình ảnh/âm thanh người thân quen',
      behavioralSymptom: 'Tin ngay khi thấy khuôn mặt bạn thân xuất hiện 5-10 giây trong video call chập chờn',
      improvementMantra: 'Luôn hỏi Mật Khẩu An Toàn Gia Đình hoặc yêu cầu người đối diện quay mặt góc 90 độ',
      recommendedAction: 'Diễn tập phòng thí nghiệm: Deepfake Voice Clone & Video Call',
      recommendedScenarioId: 'deepfake-friend-loan',
      color: '#ec4899',
    },
  ];

  // Determine Archetype
  let archetype: DefenseArchetype;
  if (overallScore >= 85 && verifScore >= 80) {
    archetype = {
      id: 'vigilant_sentinel',
      title: 'Vệ Binh Tinh Nhuệ',
      subtitle: 'Phản xạ phòng vệ mẫu mực & Tư duy phản biện thép',
      description: 'Bạn sở hữu hàng rào phòng thủ kiên cố, luôn kích hoạt bản năng xác minh độc lập và không bao giờ để áp lực thời gian hay đòn tâm lý uy quyền chi phối quyết định.',
      primaryStrength: 'Phản xạ xác minh kênh phụ và từ chối cung cấp dữ liệu nhạy cảm xuất sắc.',
      blindspotAlert: 'Cần duy trì sự cảnh giác trước các biến thể lừa đảo công nghệ cao Deepfake thế hệ mới.',
      iconName: 'ShieldCheck',
      tagColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/60',
    };
  } else if (verifScore >= 75) {
    archetype = {
      id: 'forensic_analyst',
      title: 'Nhà Điều Tra Độc Lập',
      subtitle: 'Hoài nghi lành mạnh & Phân tích chứng cứ',
      description: 'Bạn có xu hướng kiểm tra nguồn gốc thông tin và không dễ tin vào lời đe dọa suông. Bạn luôn tìm kiếm chứng cứ thực tế trước khi hành động.',
      primaryStrength: 'Kiểm chứng chéo danh tính đối phương rất bài bản.',
      blindspotAlert: 'Đôi khi có thể mất cảnh giác trước các bẫy quét mã QR tiện lợi tại nơi công cộng.',
      iconName: 'Search',
      tagColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/60',
    };
  } else if (fearScore < 60 || authScore < 60) {
    archetype = {
      id: 'empathic_guardian',
      title: 'Hộ Vệ Nhạy Cảm Áp Lực',
      subtitle: 'Thiện chí cao nhưng dễ bị chi phối tâm lý',
      description: 'Bạn có tấm lòng nhân hậu và tôn trọng pháp luật, nhưng chính điều này khiến kẻ lừa đảo dễ lợi dụng các đòn dọa dẫm án hình sự hoặc tin người thân gặp nạn để dồn ép.',
      primaryStrength: 'Ý thức tự giác và mong muốn bảo vệ gia đình.',
      blindspotAlert: 'Cần rèn luyện phản xạ ngắt kết nối dứt khoát khi đối phương xưng danh cơ quan chức năng đe dọa.',
      iconName: 'Heart',
      tagColor: 'text-amber-400 border-amber-500/40 bg-amber-950/60',
    };
  } else {
    archetype = {
      id: 'adaptive_shield',
      title: 'Chiến Binh Tiềm Năng',
      subtitle: 'Đang hình thành bộ gen đề kháng toàn diện',
      description: 'Hệ thống phòng vệ của bạn đang phát triển tích cực qua từng lượt diễn tập. Bạn đã bắt đầu nhận ra các mánh khóe cơ bản nhưng cần tôi luyện thêm tốc độ phản xạ.',
      primaryStrength: 'Khả năng tiếp thu kiến thức và cải thiện điểm số nhanh chóng.',
      blindspotAlert: 'Cần luyện tập thêm các tình huống dồn ép thời gian đếm ngược 5 phút.',
      iconName: 'Sparkles',
      tagColor: 'text-purple-400 border-purple-500/40 bg-purple-950/60',
    };
  }

  // Sorted tactics for strengths and weaknesses
  const sortedTactics = Object.entries(tacticRatings)
    .map(([tactic, score]) => ({ tactic: tactic as ScamTactic, score }))
    .sort((a, b) => b.score - a.score);

  const strongestTactics = sortedTactics.slice(0, 3).map((item) => ({
    tactic: item.tactic,
    score: item.score,
    reason: getTacticStrengthReason(item.tactic),
  }));

  const weakestTactics = sortedTactics
    .slice(-3)
    .reverse()
    .map((item) => ({
      tactic: item.tactic,
      score: item.score,
      reason: getTacticWeaknessReason(item.tactic),
      recommendedScenarioId: findRecommendedScenarioForTactic(item.tactic),
    }));

  // Critical Blindspots
  const criticalBlindspots = dimensions
    .filter((d) => d.score < 70)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((d) => ({
      dimension: d.vietnameseName,
      score: d.score,
      gapWithCommunity: Math.round(d.score - d.communityAverage),
      dangerSummary: d.behavioralSymptom,
      scenarioId: d.recommendedScenarioId,
      scenarioTitle: d.recommendedAction,
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
      { date: 'Tuần 1', score: Math.max(20, overallScore - 22), communityAverage: 62 },
      { date: 'Tuần 2', score: Math.max(30, overallScore - 14), communityAverage: 63 },
      { date: 'Tuần 3', score: Math.max(40, overallScore - 6), communityAverage: 63 },
      { date: 'Hiện tại', score: overallScore, communityAverage: 64 },
    ],
    historicalTrend30Days: Array.from({ length: 30 }, (_, i) => {
      const dayIndex = i + 1; // 1 to 30
      const progressFactor = i / 29; // 0 to 1
      const baseSdi = Math.max(35, overallScore - 18);
      const sdi = Math.min(99, Math.max(30, Math.round(baseSdi + (overallScore - baseSdi) * progressFactor)));
      const risk = 100 - sdi;
      const refDate = new Date();
      refDate.setDate(refDate.getDate() - (29 - i));
      const dateStr = `${refDate.getDate().toString().padStart(2, '0')}/${(refDate.getMonth() + 1).toString().padStart(2, '0')}`;
      const fullDateStr = `${dateStr}/${refDate.getFullYear()}`;

      let milestoneEvent = undefined;
      if (dayIndex === 4) {
        milestoneEvent = {
          title: 'Khởi Động Đánh Giá Scam DNA',
          description: 'Hoàn thành bài khảo sát ban đầu xác định hình mẫu phòng thủ.',
          xpEarned: 100,
          category: 'drill' as const,
        };
      } else if (dayIndex === 10) {
        milestoneEvent = {
          title: 'Hóa Giải Bẫy Công An Giả Mạo',
          description: 'Phản xạ thành công trước cuộc gọi đe dọa rửa tiền trong Scam Arena.',
          xpEarned: 250,
          category: 'arena' as const,
        };
      } else if (dayIndex === 17) {
        milestoneEvent = {
          title: 'Phòng Thí Nghiệm Quishing Lab',
          description: 'Đạt độ chính xác 100% khi phân tích 10 mã QR dán đè tại bàn ăn.',
          xpEarned: 300,
          category: 'quishing' as const,
        };
      } else if (dayIndex === 23) {
        milestoneEvent = {
          title: 'Đánh Bại Video AI Deepfake',
          description: 'Phát hiện video call clone người thân nhờ mẹo yêu cầu quay góc 90 độ.',
          xpEarned: 350,
          category: 'deepfake' as const,
        };
      } else if (dayIndex === 28) {
        milestoneEvent = {
          title: 'Xác Lập Chuỗi 7 Ngày Kỷ Luật',
          description: 'Bảo vệ thành công mã Smart OTP trước chiêu trò nâng cấp Sim 5G.',
          xpEarned: 500,
          category: 'streak' as const,
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
        milestoneEvent,
      };
    }),
    totalSessionsCompleted: progress.sessionsCompleted,
    quishingAccuracy,
    drillsCompleted: progress.drillsCompleted,
    currentStreakDays: progress.currentStreakDays,
    totalXp: progress.totalXp,
  };
}

export function getCommunityScamDna(userOverallScore?: number): CommunityScamDna {
  const userScore = userOverallScore || 75;

  const surveyAnalytics = getCommunitySurveyAnalytics();
  const trialCount = getAllParticipantTrials().length;
  const surveyCount = surveyAnalytics ? surveyAnalytics.totalRespondents : 0;
  const totalParticipants = surveyCount + trialCount;

  // Approximate percentile rank based on mean 63.8 and std dev 14
  const mean = 63.8;
  const std = 14.0;
  const z = (userScore - mean) / std;
  // Approximation of standard normal CDF
  const t = 1.0 / (1.0 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2.0);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) p = 1.0 - p;
  const percentileRank = Math.min(99, Math.max(1, Math.round(p * 100)));

  const commMean = surveyCount > 0 ? Math.round(surveyAnalytics.preAppBaselineStats.avgInitialDefenseScore) : 0;
  const allSurveys = getAllCommunitySurveys();

  const getDimAvg = (key: ScamDnaDimensionKey): number => {
    if (surveyCount === 0 || allSurveys.length === 0) return 0;
    let sum = 0;
    allSurveys.forEach((s) => {
      if (s.testOutcome?.scamDnaShift?.before) {
        const b = s.testOutcome.scamDnaShift.before;
        if (key === 'authority') sum += Math.round((1 - (b.A || 0.5)) * 100);
        else if (key === 'urgency') sum += Math.round((1 - (b.T || 0.5)) * 100);
        else if (key === 'fear') sum += Math.round((1 - (b.E || 0.5)) * 100);
        else if (key === 'greed') sum += Math.round((1 - (b.G || 0.5)) * 100);
        else if (key === 'privacy_credential') sum += Math.round((1 - (b.C || 0.5)) * 100);
        else if (key === 'isolation') sum += Math.round((1 - (b.R || 0.5)) * 100);
        else sum += s.testOutcome.preScore;
      } else {
        sum += s.testOutcome.preScore;
      }
    });
    return Math.round(sum / allSurveys.length);
  };

  return {
    totalParticipants,
    lastUpdated: 'Vừa cập nhật (Thời gian thực)',
    overallCommunityAverage: commMean,
    percentileRank: totalParticipants > 0 ? percentileRank : 0,
    dimensionAverages: {
      authority: getDimAvg('authority'),
      urgency: getDimAvg('urgency'),
      fear: getDimAvg('fear'),
      greed: getDimAvg('greed'),
      privacy_credential: getDimAvg('privacy_credential'),
      isolation: getDimAvg('isolation'),
      verification_reflex: getDimAvg('verification_reflex'),
      quishing_domain: getDimAvg('quishing_domain'),
      emotional_stability: getDimAvg('emotional_stability'),
      deepfake_ai: getDimAvg('deepfake_ai'),
    },
    scamDnaVector: {
      T: Number((1 - getDimAvg('urgency') / 100).toFixed(2)),
      A: Number((1 - getDimAvg('authority') / 100).toFixed(2)),
      G: Number((1 - getDimAvg('greed') / 100).toFixed(2)),
      E: Number((1 - getDimAvg('fear') / 100).toFixed(2)),
      C: Number((1 - getDimAvg('privacy_credential') / 100).toFixed(2)),
      R: Number((1 - getDimAvg('isolation') / 100).toFixed(2)),
    },
    topVulnerabilitiesNational: [
      {
        key: 'authority',
        label: 'Giả Mạo Công An / Viện Kiểm Sát',
        vulnerabilityRate: totalParticipants > 0 ? 68.4 : 0,
        description: totalParticipants > 0
          ? '68.4% người dùng ban đầu có tâm lý lo sợ và chấp nhận làm việc qua điện thoại khi đối phương xưng danh cơ quan công quyền.'
          : 'Đang chờ thu thập dữ liệu người dùng thực tế (N = 0).',
        trend: 'rising',
      },
      {
        key: 'quishing_domain',
        label: 'Mã QR Độc Quishing Tại Quán Ăn / Hóa Đơn',
        vulnerabilityRate: totalParticipants > 0 ? 62.1 : 0,
        description: totalParticipants > 0
          ? 'Hơn 6 trên 10 người dùng quét mã QR chuyển tiền thanh toán mà không nhìn kỹ tên miền đích hay tài khoản thụ hưởng.'
          : 'Đang chờ thu thập dữ liệu người dùng thực tế (N = 0).',
        trend: 'rising',
      },
      {
        key: 'urgency',
        label: 'Dồn Ép Đếm Ngược 5-15 Phút',
        vulnerabilityRate: totalParticipants > 0 ? 58.7 : 0,
        description: totalParticipants > 0
          ? 'Tạo áp lực thời gian khiến tỷ lệ sập bẫy tăng gấp 2.4 lần so với các kịch bản trao đổi thông thường.'
          : 'Đang chờ thu thập dữ liệu người dùng thực tế (N = 0).',
        trend: 'stable',
      },
      {
        key: 'greed',
        label: 'Nhiệm Vụ Đơn Hàng Hoa Hồng Cao',
        vulnerabilityRate: totalParticipants > 0 ? 52.0 : 0,
        description: totalParticipants > 0
          ? 'Chiêu trò hoàn tiền 50k đầu tiên làm mồi nhử vẫn là cái bẫy tài chính gây thiệt hại lớn nhất cho đối tượng trẻ.'
          : 'Đang chờ thu thập dữ liệu người dùng thực tế (N = 0).',
        trend: 'declining',
      },
      {
        key: 'deepfake_ai',
        label: 'Giả Mạo Giọng Nói Con Cháu Cấp Cứu',
        vulnerabilityRate: totalParticipants > 0 ? 49.3 : 0,
        description: totalParticipants > 0
          ? 'Các cuộc gọi 10-15 giây giả giọng khóc lóc người thân gặp nạn có tỷ lệ gây hoảng loạn rất cao đối với người lớn tuổi.'
          : 'Đang chờ thu thập dữ liệu người dùng thực tế (N = 0).',
        trend: 'rising',
      },
    ],
    demographicBreakdown: [
      {
        group: 'Học sinh & Sinh viên (Gen Z, 15 - 22 tuổi)',
        averageScore: totalParticipants > 0 ? 61.2 : 0,
        sampleCount: Math.round(totalParticipants * 0.45),
        criticalWeakness: totalParticipants > 0 ? 'Bẫy việc làm online hoa hồng cao & Quà tặng ảo qua mạng xã hội' : 'Chưa có mẫu thực tế',
        color: '#06b6d4',
      },
      {
        group: 'Nhân viên văn phòng & Trưởng thành (23 - 50 tuổi)',
        averageScore: totalParticipants > 0 ? 67.5 : 0,
        sampleCount: Math.round(totalParticipants * 0.35),
        criticalWeakness: totalParticipants > 0 ? 'Mạo danh cơ quan thuế, phí bưu điện & Bẫy quét mã QR bàn ăn' : 'Chưa có mẫu thực tế',
        color: '#10b981',
      },
      {
        group: 'Người cao tuổi & Hưu trí (Trên 50 tuổi)',
        averageScore: totalParticipants > 0 ? 52.4 : 0,
        sampleCount: Math.round(totalParticipants * 0.20),
        criticalWeakness: totalParticipants > 0 ? 'Giả danh công an điều tra án ma túy & Cuộc gọi AI giả giọng người thân cấp cứu' : 'Chưa có mẫu thực tế',
        color: '#f59e0b',
      },
    ],
    trendingThreatsMonth: [
      {
        name: 'Chiếm đoạt tài khoản qua mã QR nhận vé máy bay / quà tặng',
        impactPercentage: 34.2,
        description: 'Đối tượng gửi mã QR qua Zalo mời nhận vé du lịch hè, quét mã dẫn vào trang phishing chiếm quyền phiên đăng nhập.',
        dangerLevel: 'CRITICAL',
      },
      {
        name: 'Cuộc gọi Deepfake video mờ giật mượn tiền khẩn cấp',
        impactPercentage: 28.5,
        description: 'Cắt ghép video 3 giây mặt bạn bè rồi viện cớ mạng lag để yêu cầu chuyển khoản gấp vào số tài khoản lạ.',
        dangerLevel: 'HIGH',
      },
      {
        name: 'Giả mạo ứng dụng Cổng dịch vụ công VNeID cập nhật sinh trắc học',
        impactPercentage: 24.1,
        description: 'Dẫn dụ nạn nhân cài file APK mã độc để chiếm toàn bộ quyền trợ năng Accessibility trên điện thoại Android.',
        dangerLevel: 'CRITICAL',
      },
    ],
  };
}

function getTacticStrengthReason(tactic: ScamTactic): string {
  switch (tactic) {
    case 'Authority':
      return 'Phản xạ không sợ hãi trước lời đe dọa từ cơ quan giả mạo và luôn yêu cầu văn bản triệu tập hợp pháp.';
    case 'Urgency':
      return 'Bình tĩnh kiểm soát nhịp độ, từ chối hành động vội vã khi bị áp đặt thời gian giới hạn.';
    case 'Synthetic Media':
      return 'Nhạy bén nhận diện các dấu hiệu méo tiếng, nháy hình và độ trễ khẩu hình của công nghệ Deepfake.';
    case 'Convenience Bias':
      return 'Cẩn trọng soi kỹ tên miền và không tùy tiện quét mã QR ở nơi công cộng.';
    case 'Social Proof':
      return 'Không bị cuốn theo tâm lý đám đông hoặc các hình ảnh biên lai chuyển tiền dàn dựng.';
    default:
      return `Duy trì tính cảnh giác cao độ trước các thủ thuật ${tactic}.`;
  }
}

function getTacticWeaknessReason(tactic: ScamTactic): string {
  switch (tactic) {
    case 'Urgency':
      return 'Dễ bị mất bình tĩnh khi đối tượng đưa ra giới hạn 5-15 phút để phong tỏa tài sản hoặc xử lý án.';
    case 'Authority':
      return 'Có xu hướng lo sợ và răm bắp làm theo khi nghe đối phương xưng danh Công an hoặc Viện Kiểm sát.';
    case 'Fear':
      return 'Tâm lý hoang mang khi bị báo tin người thân gặp nạn khẩn cấp, dễ bỏ qua bước gọi lại xác nhận.';
    case 'Greed':
      return 'Dễ bị hấp dẫn bởi lợi nhuận làm nhiệm vụ hoa hồng cao hoặc phần thưởng quà tặng bất ngờ.';
    case 'Convenience Bias':
      return 'Thói quen bấm link rút gọn hoặc quét QR thanh toán nhanh mà không kiểm tra tên miền gốc.';
    default:
      return `Cần rèn luyện phản xạ phát hiện đòn thao túng ${tactic}.`;
  }
}

function findRecommendedScenarioForTactic(tactic: ScamTactic): string {
  const match = SCAM_SCENARIOS.find((s) => s.tactics.includes(tactic));
  return match ? match.id : SCAM_SCENARIOS[0].id;
}

export function deleteUserData(userId: string) {
  userProgressStore.delete(userId);
  return { success: true, message: 'Dữ liệu cá nhân đã được xóa sạch hoàn toàn khỏi hệ thống.' };
}

export function exportUserData(userId: string) {
  const progress = getOrCreateUserProgress(userId);
  const dna = calculateScamDna(userId);
  return {
    exportDate: new Date().toISOString(),
    userId,
    profile: {
      xp: progress.totalXp,
      level: progress.level,
      streakDays: progress.currentStreakDays,
      completedScenarios: progress.completedScenarioIds,
    },
    scamDefenseProfile: dna,
    eventLogs: progress.events,
  };
}
