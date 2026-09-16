/**
 * SCAMGUARD VN - Standardized 8-Question School Cybersecurity Survey
 * Optimized for ViSEF 2026 National Science Fair & School-wide Research
 * 
 * Includes:
 * - 3 Background Fields: Grade (Khối 10/11/12/GV), Gender (Nam/Nữ/Khác), Cyber Training (Có/Không)
 * - 8 High-Value ABCD Questions for empirical behavior & threat vector analysis
 */

export interface SurveyOption {
  letter: 'A' | 'B' | 'C' | 'D';
  text: string;
  isSafeOrIdeal?: boolean;
  isHighRisk?: boolean;
}

export interface StandardSurveyQuestion {
  key: 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'q8';
  number: number;
  title: string;
  category: string;
  badge: string;
  badgeColor: string;
  icon: string;
  description: string;
  analysisMetric: string;
  options: SurveyOption[];
}

export const SURVEY_8_QUESTIONS: StandardSurveyQuestion[] = [
  {
    key: 'q1',
    number: 1,
    title: '1. Bạn đã từng gặp hoặc nhận được một hình thức lừa đảo trực tuyến chưa?',
    category: 'Tỷ lệ phơi nhiễm mối đe dọa',
    badge: 'Phơi Nhiễm Mạng',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    icon: '🌐',
    description: 'Đo lường tỷ lệ học sinh từng bị kẻ gian tiếp cận hoặc nhắm tới trong không gian mạng.',
    analysisMetric: 'Tỷ lệ học sinh từng gặp scam (% B + C + D)',
    options: [
      { letter: 'A', text: 'Chưa bao giờ', isSafeOrIdeal: true },
      { letter: 'B', text: 'Có, nhưng chỉ gặp và nhận ra ngay', isSafeOrIdeal: true },
      { letter: 'C', text: 'Có, từng suýt bị lừa', isHighRisk: true },
      { letter: 'D', text: 'Có, từng bị lừa hoặc chịu thiệt hại', isHighRisk: true },
    ],
  },
  {
    key: 'q2',
    number: 2,
    title: '2. Bạn đã từng bị lừa đảo trực tuyến ở mức độ nào?',
    category: 'Mức độ tổn thất & Suýt mắc bẫy',
    badge: 'Mức Độ Thiệt Hại',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: '⚠️',
    description: 'Phân loại từ an toàn tuyệt đối, suýt mất tiền/dữ liệu cho đến thiệt hại thực tế.',
    analysisMetric: 'Tỷ lệ từng suýt bị lừa hoặc bị lừa (% B + C + D)',
    options: [
      { letter: 'A', text: 'Chưa từng', isSafeOrIdeal: true },
      { letter: 'B', text: 'Suýt cung cấp thông tin/chuyển tiền nhưng đã dừng lại', isSafeOrIdeal: true },
      { letter: 'C', text: 'Đã cung cấp thông tin cá nhân hoặc tài khoản', isHighRisk: true },
      { letter: 'D', text: 'Đã mất tiền hoặc chịu thiệt hại thực tế', isHighRisk: true },
    ],
  },
  {
    key: 'q3',
    number: 3,
    title: '3. Bạn thường gặp lừa đảo trực tuyến qua kênh nào nhất?',
    category: 'Véc-tơ tấn công chính',
    badge: 'Kênh Tiếp Xúc',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    icon: '📱',
    description: 'Xác định môi trường số phổ biến nhất mà học sinh thường xuyên bị kẻ gian tiếp cận.',
    analysisMetric: 'Kênh lừa đảo phổ biến nhất (Facebook, SMS, Zalo, TikTok)',
    options: [
      { letter: 'A', text: 'Facebook/Messenger' },
      { letter: 'B', text: 'Zalo' },
      { letter: 'C', text: 'SMS/cuộc gọi điện thoại' },
      { letter: 'D', text: 'TikTok/Instagram/Discord hoặc nền tảng khác' },
    ],
  },
  {
    key: 'q4',
    number: 4,
    title: '4. Hình thức lừa đảo nào bạn từng gặp nhiều nhất?',
    category: 'Thủ đoạn tâm lý & Công nghệ',
    badge: 'Hình Thức Phổ Biến',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    icon: '🎭',
    description: 'Thống kê các chiêu bài xã hội học và mạo danh phổ biến nhất nhắm vào học sinh.',
    analysisMetric: 'Hình thức scam phổ biến nhất nhắm vào học sinh',
    options: [
      { letter: 'A', text: 'Giả danh ngân hàng/cơ quan/tổ chức' },
      { letter: 'B', text: 'Mời nhận quà, trúng thưởng, kiếm tiền online' },
      { letter: 'C', text: 'Mua bán online/chuyển khoản' },
      { letter: 'D', text: 'Tài khoản người quen bị hack hoặc giả danh người quen' },
    ],
  },
  {
    key: 'q5',
    number: 5,
    title: '5. Khi nhận được một tin nhắn đáng ngờ, bạn thường làm gì đầu tiên?',
    category: 'Hành vi & Phản xạ xử lý',
    badge: 'Phản Xạ Ban Đầu',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: '⚡',
    description: 'Đo lường thói quen phản xạ ban đầu (bấm link rủi ro, hỏi bạn bè hay tự kiểm chứng).',
    analysisMetric: 'Phản xạ an toàn (Tự kiểm chứng C & Chặn D)',
    options: [
      { letter: 'A', text: 'Bấm vào link để kiểm tra', isHighRisk: true },
      { letter: 'B', text: 'Hỏi bạn bè/người thân' },
      { letter: 'C', text: 'Tự kiểm tra thông tin người gửi và đường link', isSafeOrIdeal: true },
      { letter: 'D', text: 'Bỏ qua/chặn người gửi', isSafeOrIdeal: true },
    ],
  },
  {
    key: 'q6',
    number: 6,
    title: '6. Bạn tự đánh giá khả năng nhận biết một vụ lừa đảo trực tuyến của mình như thế nào?',
    category: 'Tự tin nhận thức an ninh mạng',
    badge: 'Tự Đánh Giá Nhận Biết',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: '🧠',
    description: 'Đánh giá mức độ tự tin chủ quan của học sinh trước các mánh khóe lừa đảo mạng.',
    analysisMetric: 'Mức độ tự tin nhận diện (Rất thấp / Khá thấp / Khá tốt / Rất tốt)',
    options: [
      { letter: 'A', text: 'Rất thấp — thường khó nhận biết', isHighRisk: true },
      { letter: 'B', text: 'Khá thấp — chỉ nhận biết những trường hợp rõ ràng' },
      { letter: 'C', text: 'Khá tốt — có thể nhận biết phần lớn trường hợp', isSafeOrIdeal: true },
      { letter: 'D', text: 'Rất tốt — thường có thể phát hiện các dấu hiệu bất thường', isSafeOrIdeal: true },
    ],
  },
  {
    key: 'q7',
    number: 7,
    title: '7. Nếu một tin nhắn có vẻ rất thật nhưng yêu cầu bạn cung cấp OTP, mật khẩu hoặc thông tin ngân hàng, bạn sẽ:',
    category: 'Quy tắc vàng bảo vệ dữ liệu',
    badge: 'Bảo Vệ OTP & Dữ Liệu',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: '🛡️',
    description: 'Thử nghiệm phòng thủ then chốt: Tuyệt đối không cung cấp OTP/mật khẩu trong mọi tình huống.',
    analysisMetric: 'Tỷ lệ phòng thủ OTP nghiêm ngặt (Phương án C)',
    options: [
      { letter: 'A', text: 'Cung cấp nếu người gửi có vẻ đáng tin', isHighRisk: true },
      { letter: 'B', text: 'Cung cấp nếu nội dung nói tài khoản sẽ bị khóa', isHighRisk: true },
      { letter: 'C', text: 'Không cung cấp và xác minh thông qua kênh chính thức', isSafeOrIdeal: true },
      { letter: 'D', text: 'Hỏi người gửi thêm thông tin rồi quyết định' },
    ],
  },
  {
    key: 'q8',
    number: 8,
    title: '8. Bạn có muốn sử dụng một nền tảng giúp bạn luyện khả năng nhận diện và phòng tránh lừa đảo thông qua các tình huống mô phỏng thực tế không?',
    category: 'Nhu cầu ứng dụng công nghệ mô phỏng',
    badge: 'Nhu Cầu SCAMGUARD',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: '🎯',
    description: 'Khẳng định giá trị thực tiễn và tính cấp bách của đề tài nghiên cứu SCAMGUARD VN.',
    analysisMetric: 'Nhu cầu sử dụng nền tảng mô phỏng thực tế (% C + D)',
    options: [
      { letter: 'A', text: 'Không cần' },
      { letter: 'B', text: 'Có, nhưng chỉ thỉnh thoảng' },
      { letter: 'C', text: 'Có, nếu nội dung ngắn và dễ sử dụng', isSafeOrIdeal: true },
      { letter: 'D', text: 'Có, và tôi muốn luyện tập thường xuyên', isSafeOrIdeal: true },
    ],
  },
];

// Helper to look up question and option
export function getQuestionText(key: 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'q8'): StandardSurveyQuestion | undefined {
  return SURVEY_8_QUESTIONS.find((q) => q.key === key);
}

export function getOptionText(key: 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'q8', letter: 'A' | 'B' | 'C' | 'D'): string {
  const q = getQuestionText(key);
  if (!q) return letter;
  const opt = q.options.find((o) => o.letter === letter);
  return opt ? `${letter}. ${opt.text}` : letter;
}

// Calculate pre-defense score from 8 questions (scale 0-100)
export function calculate8QuestionDefenseScore(answers: Record<string, string>): number {
  let score = 0;
  // Q1: A (+12), B (+15), C (+8), D (+5)
  if (answers.q1 === 'B') score += 15;
  else if (answers.q1 === 'A') score += 12;
  else if (answers.q1 === 'C') score += 8;
  else if (answers.q1 === 'D') score += 5;

  // Q2: A (+15), B (+12), C (+5), D (+2)
  if (answers.q2 === 'A') score += 15;
  else if (answers.q2 === 'B') score += 12;
  else if (answers.q2 === 'C') score += 5;
  else if (answers.q2 === 'D') score += 2;

  // Q5: C (+20), D (+15), B (+10), A (+0)
  if (answers.q5 === 'C') score += 20;
  else if (answers.q5 === 'D') score += 15;
  else if (answers.q5 === 'B') score += 10;

  // Q6: D (+15), C (+12), B (+8), A (+4)
  if (answers.q6 === 'D') score += 15;
  else if (answers.q6 === 'C') score += 12;
  else if (answers.q6 === 'B') score += 8;
  else if (answers.q6 === 'A') score += 4;

  // Q7: C (+35 - Gold Rule), D (+10), B (+0), A (+0)
  if (answers.q7 === 'C') score += 35;
  else if (answers.q7 === 'D') score += 10;

  return Math.min(100, Math.max(15, score));
}
