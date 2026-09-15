import { MonthlySecurityReport, UserProfile } from '../types';

const now = new Date();
const nowDayStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

export const MONTHLY_REPORTS_ARCHIVE: Record<string, {
  name: string;
  monthCode: string;
  date: string;
  baseAccuracy: number;
  prevAccuracy: number;
  scamsAnalyzed: number;
  correctDetections: number;
  avgTime: number;
  timeImprovement: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C';
  rating: string;
  history: {
    month: string;
    label: string;
    accuracy: number;
    scamsTested: number;
    scamsBlocked: number;
    avgResponseSeconds: number;
    highlightMilestone?: string;
  }[];
  categories: {
    category: string;
    icon: string;
    previousAccuracy: number;
    currentAccuracy: number;
    threatsEncountered: number;
    status: 'mastered' | 'improving' | 'needs_practice';
    description: string;
  }[];
  highlights: string[];
  recommendations: string[];
  aiSummary: string;
}> = {
  '2026-09': {
    name: `Tháng ${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} (Kỳ Hiện Tại)`,
    monthCode: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`,
    date: nowDayStr,
    baseAccuracy: 93.4,
    prevAccuracy: 81.2,
    scamsAnalyzed: 74,
    correctDetections: 69,
    avgTime: 3.6,
    timeImprovement: 2.2,
    grade: 'A+',
    rating: 'Hiệp Sĩ Phòng Vệ Cấp Cao (Grade A+)',
    history: [
      { month: '2026-04', label: 'T04/26', accuracy: 56.0, scamsTested: 20, scamsBlocked: 11, avgResponseSeconds: 11.2, highlightMilestone: 'Khởi đầu huấn luyện' },
      { month: '2026-05', label: 'T05/26', accuracy: 64.5, scamsTested: 32, scamsBlocked: 21, avgResponseSeconds: 9.0, highlightMilestone: 'Khắc phục bẫy quà tặng' },
      { month: '2026-06', label: 'T06/26', accuracy: 72.8, scamsTested: 45, scamsBlocked: 33, avgResponseSeconds: 7.4, highlightMilestone: 'Master SMS Brandname' },
      { month: '2026-07', label: 'T07/26', accuracy: 78.0, scamsTested: 52, scamsBlocked: 41, avgResponseSeconds: 6.2, highlightMilestone: 'Luyện phản xạ Deepfake' },
      { month: '2026-08', label: 'T08/26', accuracy: 81.2, scamsTested: 60, scamsBlocked: 49, avgResponseSeconds: 5.8, highlightMilestone: 'Khắc chế bẫy mạo danh' },
      { month: '2026-09', label: 'T09/26', accuracy: 93.4, scamsTested: 74, scamsBlocked: 69, avgResponseSeconds: 3.6, highlightMilestone: 'Đạt phản xạ Vệ Binh Số' },
    ],
    categories: [
      {
        category: 'Phishing Email & Giả Mạo SMS Brandname',
        icon: 'Mail',
        previousAccuracy: 84,
        currentAccuracy: 98,
        threatsEncountered: 26,
        status: 'mastered',
        description: 'Nhận diện hoàn hảo tên miền typosquatting (.vip, .top) và mã độc OTP.',
      },
      {
        category: 'AI Voice Clone & Deepfake Video Call',
        icon: 'Video',
        previousAccuracy: 68,
        currentAccuracy: 88,
        threatsEncountered: 18,
        status: 'improving',
        description: 'Áp dụng tốt câu hỏi bí mật gia đình, bắt bài mắt không chớp và tạp âm AI.',
      },
      {
        category: 'Quishing - Mã QR Độc Hại & Bưu Kiện 0đ',
        icon: 'QrCode',
        previousAccuracy: 75,
        currentAccuracy: 95,
        threatsEncountered: 14,
        status: 'mastered',
        description: 'Cảnh giác không quét QR lạ dán đè tại cây xăng, quán ăn hoặc hóa đơn gửi nhầm.',
      },
      {
        category: 'Giả Mạo Cơ Quan Công Quyền (Công An/VKS/Thuế)',
        icon: 'ShieldAlert',
        previousAccuracy: 82,
        currentAccuracy: 96,
        threatsEncountered: 22,
        status: 'mastered',
        description: 'Bác bỏ hoàn toàn đe dọa làm việc qua Zalo/Telegram; nắm vững quy trình pháp lý.',
      },
      {
        category: 'Lừa Việc Nhẹ Lương Cao & Sàn Đầu Tư Lãi Khủng',
        icon: 'TrendingUp',
        previousAccuracy: 70,
        currentAccuracy: 89,
        threatsEncountered: 19,
        status: 'improving',
        description: 'Nhận diện thủ đoạn "thả con săn sắt" và hoa hồng tăng dần trong group chim mồi.',
      },
      {
        category: 'Bẫy Tâm Lý Trắc Ẩn & Giả Cấp Cứu Bệnh Viện',
        icon: 'HeartHandshake',
        previousAccuracy: 58,
        currentAccuracy: 76,
        threatsEncountered: 12,
        status: 'needs_practice',
        description: 'Cần giữ bình tĩnh xác minh qua đường dây nóng bệnh viện trước khi chuyển tiền.',
      },
    ],
    highlights: [
      'Độ chính xác tổng thể tăng vọt +12.2% so với tháng trước nhờ luyện tập đều đặn.',
      'Thời gian nhận diện rủi ro rút ngắn ấn tượng từ 5.8 giây xuống còn 3.6 giây.',
      'Bảo vệ thành công 69/74 tình huống giả định, ngăn chặn nguy cơ thiệt hại tài chính ảo hơn 420 triệu VNĐ.',
      'Đạt chuỗi liên tục rèn luyện và thăng hạng kỹ năng phòng thủ danh dự.',
    ],
    recommendations: [
      'Tập trung luyện thêm 2-3 kịch bản "Cấp cứu bệnh viện viện phí gấp" để phản xạ bình tĩnh hơn.',
      'Thiết lập tính năng Screen Sentinel khi thao tác trên các ứng dụng ngân hàng mới.',
      'Chia sẻ kinh nghiệm nhận diện Phishing SMS lên Mạng Xã Hội Vệ Binh để nhận thêm XP.',
    ],
    aiSummary:
      'Trong tháng 09/2026, chỉ số phòng thủ của bạn đã có bước nhảy vọt ấn tượng. Bạn đã thành thạo kỹ năng soi đường link giả mạo và bóc trần video deepfake giả người thân. Điểm mạnh lớn nhất là không bao giờ hoảng sợ trước các cuộc gọi xưng danh cơ quan chức năng. Cần duy trì thói quen xác minh kép đối với các yêu cầu chuyển tiền khẩn cấp từ bạn bè/người quen.',
  },
  '2026-08': {
    name: 'Tháng 08/2026',
    monthCode: '2026-08',
    date: '31/08/2026',
    baseAccuracy: 81.2,
    prevAccuracy: 78.0,
    scamsAnalyzed: 60,
    correctDetections: 49,
    avgTime: 5.8,
    timeImprovement: 0.4,
    grade: 'A',
    rating: 'Chiến Binh Cảnh Giác (Grade A)',
    history: [
      { month: '2026-03', label: 'T03/26', accuracy: 48.0, scamsTested: 15, scamsBlocked: 7, avgResponseSeconds: 12.8 },
      { month: '2026-04', label: 'T04/26', accuracy: 56.0, scamsTested: 20, scamsBlocked: 11, avgResponseSeconds: 11.2 },
      { month: '2026-05', label: 'T05/26', accuracy: 64.5, scamsTested: 32, scamsBlocked: 21, avgResponseSeconds: 9.0 },
      { month: '2026-06', label: 'T06/26', accuracy: 72.8, scamsTested: 45, scamsBlocked: 33, avgResponseSeconds: 7.4 },
      { month: '2026-07', label: 'T07/26', accuracy: 78.0, scamsTested: 52, scamsBlocked: 41, avgResponseSeconds: 6.2 },
      { month: '2026-08', label: 'T08/26', accuracy: 81.2, scamsTested: 60, scamsBlocked: 49, avgResponseSeconds: 5.8 },
    ],
    categories: [
      {
        category: 'Phishing Email & Giả Mạo SMS Brandname',
        icon: 'Mail',
        previousAccuracy: 76,
        currentAccuracy: 84,
        threatsEncountered: 20,
        status: 'improving',
        description: 'Bắt đầu phân biệt tốt các đầu số lạ và link mạo danh ngân hàng.',
      },
      {
        category: 'AI Voice Clone & Deepfake Video Call',
        icon: 'Video',
        previousAccuracy: 55,
        currentAccuracy: 68,
        threatsEncountered: 15,
        status: 'improving',
        description: 'Đã nhận ra sự giật lag và cử động môi không khớp trong video call.',
      },
      {
        category: 'Quishing - Mã QR Độc Hại',
        icon: 'QrCode',
        previousAccuracy: 60,
        currentAccuracy: 75,
        threatsEncountered: 11,
        status: 'improving',
        description: 'Kiểm tra đường link đích trước khi xác nhận mở liên kết ngân hàng.',
      },
      {
        category: 'Giả Mạo Cơ Quan Công Quyền',
        icon: 'ShieldAlert',
        previousAccuracy: 74,
        currentAccuracy: 82,
        threatsEncountered: 18,
        status: 'improving',
        description: 'Từ chối cung cấp mã OTP khi đối tượng dọa phong tỏa tài khoản.',
      },
      {
        category: 'Lừa Việc Nhẹ Lương Cao & Đầu Tư',
        icon: 'TrendingUp',
        previousAccuracy: 62,
        currentAccuracy: 70,
        threatsEncountered: 16,
        status: 'improving',
        description: 'Phát hiện kịch bản nạp tiền nhiệm vụ xem video Shopee/Tiktok.',
      },
      {
        category: 'Bẫy Tâm Lý Trắc Ẩn',
        icon: 'HeartHandshake',
        previousAccuracy: 50,
        currentAccuracy: 58,
        threatsEncountered: 10,
        status: 'needs_practice',
        description: 'Dễ bị lung lay bởi các câu chuyện thương tâm và kêu gọi quyên góp ảo.',
      },
    ],
    highlights: [
      'Độ chính xác đạt mốc trên 80% lần đầu tiên.',
      'Hoàn thành 60 kịch bản thực chiến đa dạng.',
      'Rút ngắn thời gian phân tích trung bình xuống dưới 6 giây.',
    ],
    recommendations: [
      'Rèn luyện thêm bài tập phát hiện Deepfake video đa góc nhìn.',
      'Tìm hiểu chi tiết các thủ thuật Quishing QR code mới xuất hiện.',
    ],
    aiSummary:
      'Tháng 08 ghi nhận sự tiến bộ vững chắc ở kỹ năng phòng chống tin nhắn rác và SMS lừa đảo. Bạn đã xây dựng được thói quen không bấm ngay vào liên kết lạ.',
  },
  '2026-07': {
    name: 'Tháng 07/2026',
    monthCode: '2026-07',
    date: '31/07/2026',
    baseAccuracy: 78.0,
    prevAccuracy: 72.8,
    scamsAnalyzed: 52,
    correctDetections: 41,
    avgTime: 6.2,
    timeImprovement: 1.2,
    grade: 'B+',
    rating: 'Vệ Binh Tiềm Năng (Grade B+)',
    history: [
      { month: '2026-02', label: 'T02/26', accuracy: 40.0, scamsTested: 10, scamsBlocked: 4, avgResponseSeconds: 14.5 },
      { month: '2026-03', label: 'T03/26', accuracy: 48.0, scamsTested: 15, scamsBlocked: 7, avgResponseSeconds: 12.8 },
      { month: '2026-04', label: 'T04/26', accuracy: 56.0, scamsTested: 20, scamsBlocked: 11, avgResponseSeconds: 11.2 },
      { month: '2026-05', label: 'T05/26', accuracy: 64.5, scamsTested: 32, scamsBlocked: 21, avgResponseSeconds: 9.0 },
      { month: '2026-06', label: 'T06/26', accuracy: 72.8, scamsTested: 45, scamsBlocked: 33, avgResponseSeconds: 7.4 },
      { month: '2026-07', label: 'T07/26', accuracy: 78.0, scamsTested: 52, scamsBlocked: 41, avgResponseSeconds: 6.2 },
    ],
    categories: [
      {
        category: 'Phishing Email & Giả Mạo SMS Brandname',
        icon: 'Mail',
        previousAccuracy: 65,
        currentAccuracy: 76,
        threatsEncountered: 18,
        status: 'improving',
        description: 'Phát hiện sự sai lệch ký tự trong tên miền mạo danh.',
      },
      {
        category: 'Giả Mạo Cơ Quan Công Quyền',
        icon: 'ShieldAlert',
        previousAccuracy: 68,
        currentAccuracy: 74,
        threatsEncountered: 16,
        status: 'improving',
        description: 'Biết cách tra cứu số điện thoại tổng đài chính thống.',
      },
      {
        category: 'Lừa Việc Nhẹ Lương Cao',
        icon: 'TrendingUp',
        previousAccuracy: 55,
        currentAccuracy: 62,
        threatsEncountered: 14,
        status: 'improving',
        description: 'Nhận biết thủ đoạn hoa hồng tăng dần qua ứng dụng Telegram.',
      },
      {
        category: 'AI Voice Clone & Deepfake',
        icon: 'Video',
        previousAccuracy: 42,
        currentAccuracy: 55,
        threatsEncountered: 12,
        status: 'needs_practice',
        description: 'Vẫn còn lúng túng khi nhận diện giọng nói clone của người quen.',
      },
    ],
    highlights: [
      'Độ chính xác tăng trưởng đều +5.2% trong tháng.',
      'Khắc phục cơ bản lỗi bấm link khảo sát trúng thưởng.',
    ],
    recommendations: [
      'Bổ sung kiến thức về nhận diện công nghệ Deepfake thời gian thực.',
      'Luyện tập đấu trí giả định với AI định kỳ hàng tuần.',
    ],
    aiSummary:
      'Giai đoạn xây dựng nền tảng tư duy phòng thủ tốt. Bạn đã kiểm soát tốt sự tò mò và phản xạ trước các tin nhắn hứa hẹn phần thưởng bất ngờ.',
  },
};

export function calculateMonthlySecurityReport(
  monthCode: string = '2026-09',
  userProfile?: UserProfile
): MonthlySecurityReport {
  const archive = MONTHLY_REPORTS_ARCHIVE[monthCode] || MONTHLY_REPORTS_ARCHIVE['2026-09'];

  // Dynamically tailor score based on user profile if available
  let calculatedAccuracy = archive.baseAccuracy;
  if (userProfile?.overallScore && monthCode === '2026-09') {
    // scale smoothly around the user's current overallScore
    calculatedAccuracy = Math.min(99.4, Math.max(75.0, Number((userProfile.overallScore * 1.05 + 8).toFixed(1))));
  }

  const accuracyDelta = Number((calculatedAccuracy - archive.prevAccuracy).toFixed(1));
  const totalThreats = archive.scamsAnalyzed;
  const correctDetections = Math.round((totalThreats * calculatedAccuracy) / 100);
  const falsePositivesOrNegatives = totalThreats - correctDetections;

  const categoryBreakdown = archive.categories.map((c) => {
    const delta = c.currentAccuracy - c.previousAccuracy;
    return {
      category: c.category,
      icon: c.icon,
      previousAccuracy: c.previousAccuracy,
      currentAccuracy: c.currentAccuracy,
      improvementDelta: delta,
      threatsEncountered: c.threatsEncountered,
      status: c.status,
      description: c.description,
    };
  });

  return {
    id: `rep_${monthCode}_${Date.now()}`,
    reportMonth: archive.name,
    monthCode: archive.monthCode,
    generatedDate: archive.date,
    overallAccuracy: calculatedAccuracy,
    previousMonthAccuracy: archive.prevAccuracy,
    accuracyDelta,
    totalThreatsAnalyzed: totalThreats,
    correctDetections,
    falsePositivesOrNegatives,
    avgResponseTimeSec: archive.avgTime,
    responseTimeImprovementSec: archive.timeImprovement,
    defenseRating: archive.rating,
    grade: archive.grade,
    streakConsistency: userProfile?.streakDays ? Math.min(98, 85 + userProfile.streakDays * 3) : 94,
    historicalAccuracy: archive.history,
    categoryBreakdown,
    keyHighlights: archive.highlights,
    recommendedFocus: archive.recommendations,
    aiAnalysisSummary: archive.aiSummary,
  };
}
