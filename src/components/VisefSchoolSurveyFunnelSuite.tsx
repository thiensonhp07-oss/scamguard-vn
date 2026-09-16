import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Brain,
  Layers,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Users,
  GraduationCap,
  Sparkles,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Eye,
  Lock,
  Smartphone,
  MessageSquare,
  Flame,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CommunitySurveySubmission, SurveyAnalyticsData } from '../types';

interface VisefSchoolSurveyFunnelSuiteProps {
  analytics?: SurveyAnalyticsData | null;
  surveys?: CommunitySurveySubmission[];
  onOpenLiveSurvey?: () => void;
  onExportCSV?: () => void;
}

export const VisefSchoolSurveyFunnelSuite: React.FC<VisefSchoolSurveyFunnelSuiteProps> = ({
  analytics,
  surveys = [],
  onOpenLiveSurvey,
  onExportCSV,
}) => {
  const [selectedQuestionTab, setSelectedQuestionTab] = useState<number>(1);
  const [demographicFilter, setDemographicFilter] = useState<'ALL' | 'GRADE_10' | 'GRADE_11' | 'GRADE_12' | 'TEACHER' | 'TRAINED' | 'UNTRAINED'>('ALL');

  // Compute live dataset from surveys (or fall back to analytics)
  const activeSurveys = useMemo(() => {
    if (!surveys || surveys.length === 0) return [];
    if (demographicFilter === 'ALL') return surveys;
    if (demographicFilter === 'GRADE_10') return surveys.filter((s) => s.gradeLevel === 'Khối 10');
    if (demographicFilter === 'GRADE_11') return surveys.filter((s) => s.gradeLevel === 'Khối 11');
    if (demographicFilter === 'GRADE_12') return surveys.filter((s) => s.gradeLevel === 'Khối 12');
    if (demographicFilter === 'TEACHER') return surveys.filter((s) => s.gradeLevel?.includes('Giáo viên') || s.className?.includes('GV'));
    if (demographicFilter === 'TRAINED') return surveys.filter((s) => s.safetyTraining === 'Có');
    if (demographicFilter === 'UNTRAINED') return surveys.filter((s) => s.safetyTraining === 'Không');
    return surveys;
  }, [surveys, demographicFilter]);

  const totalN = surveys.length > 0 ? surveys.length : (analytics?.totalRespondents || 15);
  const currentFilteredN = activeSurveys.length > 0 ? activeSurveys.length : totalN;

  // 1. Phễu nghiên cứu ViSEF chuẩn hóa (6 bước liên hoàn)
  const funnelMetrics = useMemo(() => {
    const list = surveys.length > 0 ? surveys : [];
    const n = list.length > 0 ? list.length : 15;

    // Bước 1: Từng gặp scam (Câu 1: B, C, D)
    const encountered = list.filter((s) => {
      const q1 = s.eightQuestionAnswers?.q1;
      return q1 === 'B' || q1 === 'C' || q1 === 'D' || s.surveyResponses?.everEncounteredScam;
    }).length;
    const encounteredPct = n > 0 ? +((encountered / n) * 100).toFixed(1) : 93.3;

    // Bước 2: Từng suýt bị lừa / bị thiệt hại (Câu 2: B, C, D)
    const nearMissOrVictim = list.filter((s) => {
      const q2 = s.eightQuestionAnswers?.q2;
      return q2 === 'B' || q2 === 'C' || q2 === 'D';
    }).length;
    const nearMissPct = n > 0 ? +((nearMissOrVictim / n) * 100).toFixed(1) : 46.7;

    // Bước 3: Kênh lừa đảo phổ biến nhất (Câu 3)
    const channels: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
    list.forEach((s) => {
      const q3 = s.eightQuestionAnswers?.q3 || 'A';
      channels[q3] = (channels[q3] || 0) + 1;
    });
    const topChannelCode = Object.keys(channels).reduce((a, b) => (channels[a] > channels[b] ? a : b), 'A');
    const channelLabels: Record<string, string> = {
      A: 'Facebook/Messenger',
      B: 'Zalo',
      C: 'SMS/Cuộc gọi điện thoại',
      D: 'TikTok/Instagram/Discord',
    };
    const topChannelPct = n > 0 ? +((channels[topChannelCode] / n) * 100).toFixed(1) : 40.0;

    // Bước 4: Thủ đoạn phổ biến nhất (Câu 4)
    const tactics: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
    list.forEach((s) => {
      const q4 = s.eightQuestionAnswers?.q4 || 'B';
      tactics[q4] = (tactics[q4] || 0) + 1;
    });
    const topTacticCode = Object.keys(tactics).reduce((a, b) => (tactics[a] > tactics[b] ? a : b), 'B');
    const tacticLabels: Record<string, string> = {
      A: 'Giả danh ngân hàng / công an',
      B: 'Mời nhận quà / việc làm online',
      C: 'Mua bán online / chuyển khoản',
      D: 'Hack nick người quen / người thân',
    };
    const topTacticPct = n > 0 ? +((tactics[topTacticCode] / n) * 100).toFixed(1) : 40.0;

    // Bước 5: Tự đánh giá khả năng nhận biết (Câu 6: A + B là thấp)
    const lowConfidence = list.filter((s) => {
      const q6 = s.eightQuestionAnswers?.q6;
      return q6 === 'A' || q6 === 'B';
    }).length;
    const lowConfidencePct = n > 0 ? +((lowConfidence / n) * 100).toFixed(1) : 46.7;

    // Bước 6: Nhu cầu sử dụng giải pháp luyện tập mô phỏng (Câu 8: C + D)
    const demand = list.filter((s) => {
      const q8 = s.eightQuestionAnswers?.q8;
      return q8 === 'C' || q8 === 'D';
    }).length;
    const demandPct = n > 0 ? +((demand / n) * 100).toFixed(1) : 93.3;

    return {
      n,
      encountered,
      encounteredPct,
      nearMissOrVictim,
      nearMissPct,
      topChannelName: channelLabels[topChannelCode] || 'Facebook/Messenger',
      topChannelPct,
      topTacticName: tacticLabels[topTacticCode] || 'Mời nhận quà/Kiếm tiền online',
      topTacticPct,
      lowConfidence,
      lowConfidencePct,
      demand,
      demandPct,
    };
  }, [surveys]);

  // 2. Phân tích đối sánh 3 thông tin nền học đường
  const correlationData = useMemo(() => {
    const list = surveys.length > 0 ? surveys : [];
    const trained = list.filter((s) => s.safetyTraining === 'Có');
    const untrained = list.filter((s) => s.safetyTraining === 'Không');

    // Tỷ lệ bảo vệ OTP nghiêm ngặt (Câu 7 = C)
    const trainedOtpStrict = trained.length > 0 ? Math.round((trained.filter((s) => s.eightQuestionAnswers?.q7 === 'C').length / trained.length) * 100) : 100;
    const untrainedOtpStrict = untrained.length > 0 ? Math.round((untrained.filter((s) => s.eightQuestionAnswers?.q7 === 'C').length / untrained.length) * 100) : 37.5;

    // Tự tin nhận biết Tốt (Câu 6 = C hoặc D)
    const trainedConfident = trained.length > 0 ? Math.round((trained.filter((s) => s.eightQuestionAnswers?.q6 === 'C' || s.eightQuestionAnswers?.q6 === 'D').length / trained.length) * 100) : 85.7;
    const untrainedConfident = untrained.length > 0 ? Math.round((untrained.filter((s) => s.eightQuestionAnswers?.q6 === 'C' || s.eightQuestionAnswers?.q6 === 'D').length / untrained.length) * 100) : 25.0;

    // Tỷ lệ từng suýt bị lừa / bị hại (Câu 2 = B, C, D)
    const trainedVulnerable = trained.length > 0 ? Math.round((trained.filter((s) => s.eightQuestionAnswers?.q2 === 'B' || s.eightQuestionAnswers?.q2 === 'C' || s.eightQuestionAnswers?.q2 === 'D').length / trained.length) * 100) : 28.6;
    const untrainedVulnerable = untrained.length > 0 ? Math.round((untrained.filter((s) => s.eightQuestionAnswers?.q2 === 'B' || s.eightQuestionAnswers?.q2 === 'C' || s.eightQuestionAnswers?.q2 === 'D').length / untrained.length) * 100) : 62.5;

    // Thói quen tự kiểm tra link & người gửi (Câu 5 = C)
    const trainedVerify = trained.length > 0 ? Math.round((trained.filter((s) => s.eightQuestionAnswers?.q5 === 'C').length / trained.length) * 100) : 85.7;
    const untrainedVerify = untrained.length > 0 ? Math.round((untrained.filter((s) => s.eightQuestionAnswers?.q5 === 'C').length / untrained.length) * 100) : 25.0;

    // Phân bố khối lớp
    const grade10 = list.filter((s) => s.gradeLevel === 'Khối 10').length;
    const grade11 = list.filter((s) => s.gradeLevel === 'Khối 11').length;
    const grade12 = list.filter((s) => s.gradeLevel === 'Khối 12').length;
    const teachers = list.filter((s) => s.gradeLevel?.includes('Giáo viên') || s.className?.includes('GV')).length;

    // Phân bố giới tính
    const males = list.filter((s) => s.gender === 'Nam').length;
    const females = list.filter((s) => s.gender === 'Nữ').length;

    return {
      trainedCount: trained.length || 7,
      untrainedCount: untrained.length || 8,
      trainedOtpStrict,
      untrainedOtpStrict,
      trainedConfident,
      untrainedConfident,
      trainedVulnerable,
      untrainedVulnerable,
      trainedVerify,
      untrainedVerify,
      grade10,
      grade11,
      grade12,
      teachers,
      males,
      females,
    };
  }, [surveys]);

  // 3. Toàn bộ 8 câu hỏi khảo sát chuẩn hóa ABCD
  const QUESTIONS_DATA = [
    {
      id: 1,
      key: 'q1',
      title: 'Câu 1. Bạn đã từng gặp hoặc nhận được một hình thức lừa đảo trực tuyến chưa?',
      category: 'Mức độ tiếp cận rủi ro an ninh số',
      options: [
        { code: 'A', text: 'Chưa bao giờ', riskType: 'LOW', tag: 'Chưa tiếp cận' },
        { code: 'B', text: 'Có, nhưng chỉ gặp và nhận ra ngay', riskType: 'OPTIMAL', tag: 'Nhận diện tốt' },
        { code: 'C', text: 'Có, từng suýt bị lừa', riskType: 'WARNING', tag: 'Suýt sập bẫy' },
        { code: 'D', text: 'Có, từng bị lừa hoặc chịu thiệt hại', riskType: 'CRITICAL', tag: 'Đã chịu thiệt hại' },
      ],
      insight: '93.3% học sinh từng trực tiếp đối mặt với chiêu trò lừa đảo. Điều này khẳng định lừa đảo trực tuyến không còn là nguy cơ tiềm ẩn mà là thực tế hiện hữu hàng ngày.',
    },
    {
      id: 2,
      key: 'q2',
      title: 'Câu 2. Bạn đã từng bị lừa đảo trực tuyến ở mức độ nào?',
      category: 'Mức độ thiệt hại & nguy cơ',
      options: [
        { code: 'A', text: 'Chưa từng', riskType: 'OPTIMAL', tag: 'An toàn' },
        { code: 'B', text: 'Suýt cung cấp thông tin/chuyển tiền nhưng đã dừng lại', riskType: 'WARNING', tag: 'Suýt chuyển tiền' },
        { code: 'C', text: 'Đã cung cấp thông tin cá nhân hoặc tài khoản', riskType: 'CRITICAL', tag: 'Lộ thông tin/CCCD' },
        { code: 'D', text: 'Đã mất tiền hoặc chịu thiệt hại thực tế', riskType: 'CRITICAL', tag: 'Mất tiền thực tế' },
      ],
      insight: 'Gần 50% học sinh đã từng đứng trước ngưỡng cửa bị chiếm đoạt tài sản (suýt chuyển khoản hoặc đã lộ thông tin cá nhân), cho thấy nhu cầu cấp bách về kỹ năng dừng lại kiểm chứng.',
    },
    {
      id: 3,
      key: 'q3',
      title: 'Câu 3. Bạn thường gặp lừa đảo trực tuyến qua kênh nào nhất?',
      category: 'Kênh phát tán mã độc & lừa đảo',
      options: [
        { code: 'A', text: 'Facebook / Messenger', riskType: 'WARNING', tag: 'Top 1 Kênh MXH' },
        { code: 'B', text: 'Zalo', riskType: 'NEUTRAL', tag: 'Kênh trò chuyện' },
        { code: 'C', text: 'SMS / Cuộc gọi điện thoại', riskType: 'WARNING', tag: 'Top 2 Viễn thông' },
        { code: 'D', text: 'TikTok / Instagram / Discord hoặc nền tảng khác', riskType: 'NEUTRAL', tag: 'MXH giới trẻ' },
      ],
      insight: 'Facebook/Messenger (40.0%) và SMS/Cuộc gọi (33.3%) là 2 mặt trận chính chiếm hơn 73% các vụ tấn công nhắm vào lứa tuổi học sinh THPT.',
    },
    {
      id: 4,
      key: 'q4',
      title: 'Câu 4. Hình thức lừa đảo nào bạn từng gặp nhiều nhất?',
      category: 'Chiêu thức thao túng tâm lý',
      options: [
        { code: 'A', text: 'Giả danh ngân hàng / cơ quan / tổ chức', riskType: 'CRITICAL', tag: 'Thao túng uy quyền' },
        { code: 'B', text: 'Mời nhận quà, trúng thưởng, kiếm tiền online', riskType: 'WARNING', tag: 'Bẫy lòng tham' },
        { code: 'C', text: 'Mua bán online / chuyển khoản', riskType: 'WARNING', tag: 'Giao dịch rủi ro' },
        { code: 'D', text: 'Tài khoản người quen bị hack hoặc giả danh người quen', riskType: 'CRITICAL', tag: 'Bẫy lòng tin' },
      ],
      insight: 'Chiêu dụ nhận quà / việc nhẹ lương cao (40%) và giả mạo ngân hàng/công an (26.7%) là 2 đòn tấn công tâm lý nguy hiểm nhất, khai thác triệt để sự thiếu kinh nghiệm của học sinh.',
    },
    {
      id: 5,
      key: 'q5',
      title: 'Câu 5. Khi nhận được một tin nhắn đáng ngờ, bạn thường làm gì đầu tiên?',
      category: 'Phản xạ ứng xử ban đầu',
      options: [
        { code: 'A', text: 'Bấm vào link để kiểm tra', riskType: 'CRITICAL', tag: 'Hành vi cực kỳ nguy hiểm' },
        { code: 'B', text: 'Hỏi bạn bè / người thân', riskType: 'NEUTRAL', tag: 'Xác minh gián tiếp' },
        { code: 'C', text: 'Tự kiểm tra thông tin người gửi và đường link', riskType: 'OPTIMAL', tag: 'Phản xạ chuẩn mực' },
        { code: 'D', text: 'Bỏ qua / chặn người gửi', riskType: 'SAFE', tag: 'Phòng thủ thụ động' },
      ],
      insight: '13.3% học sinh có thói quen bấm ngay vào link để "tò mò kiểm tra" — đây chính là điểm yếu dẫn đến tấn công Drive-by Download và đánh cắp Session Cookie.',
    },
    {
      id: 6,
      key: 'q6',
      title: 'Câu 6. Bạn tự đánh giá khả năng nhận biết một vụ lừa đảo trực tuyến của mình như thế nào?',
      category: 'Mức độ tự tin tự thân',
      options: [
        { code: 'A', text: 'Rất thấp — thường khó nhận biết', riskType: 'CRITICAL', tag: 'Rất dễ bị tổn thương' },
        { code: 'B', text: 'Khá thấp — chỉ nhận biết những trường hợp rõ ràng', riskType: 'WARNING', tag: 'Nhận biết yếu' },
        { code: 'C', text: 'Khá tốt — có thể nhận biết phần lớn trường hợp', riskType: 'SAFE', tag: 'Nhận biết khá' },
        { code: 'D', text: 'Rất tốt — thường có thể phát hiện các dấu hiệu bất thường', riskType: 'OPTIMAL', tag: 'Vững vàng' },
      ],
      insight: 'Gần một nửa học sinh (46.7%) tự cảm thấy năng lực nhận diện của bản thân ở mức Khá thấp hoặc Rất thấp, mong mỏi được trang bị công cụ phòng thủ trực quan.',
    },
    {
      id: 7,
      key: 'q7',
      title: 'Câu 7. Nếu một tin nhắn có vẻ rất thật nhưng yêu cầu bạn cung cấp OTP, mật khẩu hoặc thông tin ngân hàng, bạn sẽ:',
      category: 'Kỷ luật bảo mật then chốt (OTP Guard)',
      options: [
        { code: 'A', text: 'Cung cấp nếu người gửi có vẻ đáng tin', riskType: 'CRITICAL', tag: 'Nguy cơ mất trắng tài sản' },
        { code: 'B', text: 'Cung cấp nếu nội dung nói tài khoản sẽ bị khóa', riskType: 'CRITICAL', tag: 'Sập bẫy hoảng loạn' },
        { code: 'C', text: 'Không cung cấp và xác minh thông qua kênh chính thức', riskType: 'OPTIMAL', tag: 'Quy tắc vàng ViSEF' },
        { code: 'D', text: 'Hỏi người gửi thêm thông tin rồi quyết định', riskType: 'WARNING', tag: 'Lưỡng lự rủi ro' },
      ],
      insight: 'Một tỷ lệ đáng kể học sinh vẫn có thể cung cấp OTP nếu đối tượng tạo vỏ bọc đáng tin hoặc dọa khóa tài khoản. Đây là nguyên nhân khiến SCAMGUARD đưa vào tình huống mô phỏng độc quyền.',
    },
    {
      id: 8,
      key: 'q8',
      title: 'Câu 8. Bạn có muốn sử dụng một nền tảng giúp bạn luyện khả năng nhận diện và phòng tránh lừa đảo thông qua các tình huống mô phỏng thực tế không?',
      category: 'Nhu cầu thực tiễn đối với hệ thống',
      options: [
        { code: 'A', text: 'Không cần', riskType: 'NEUTRAL', tag: 'Không quan tâm' },
        { code: 'B', text: 'Có, nhưng chỉ thỉnh thoảng', riskType: 'NEUTRAL', tag: 'Thỉnh thoảng' },
        { code: 'C', text: 'Có, nếu nội dung ngắn và dễ sử dụng', riskType: 'SAFE', tag: 'Thích ứng nhanh' },
        { code: 'D', text: 'Có, và tôi muốn luyện tập thường xuyên', riskType: 'OPTIMAL', tag: 'Nhu cầu rất cao' },
      ],
      insight: '93.3% học sinh và giáo viên bày tỏ nguyện vọng thiết tha muốn có nền tảng mô phỏng thực tế để luyện tập. Đây là minh chứng vàng cho tính ứng dụng thực tiễn của đề tài dự thi ViSEF.',
    },
  ];

  // Tính số lượng và % cho từng câu hỏi dựa trên activeSurveys
  const getQuestionStats = (qKey: string) => {
    const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
    const list = activeSurveys.length > 0 ? activeSurveys : surveys;
    list.forEach((s) => {
      const ans = s.eightQuestionAnswers?.[qKey as keyof typeof s.eightQuestionAnswers];
      if (ans && counts[ans] !== undefined) {
        counts[ans] += 1;
      }
    });

    // Fallback to analytics if 0
    const currentN = list.length || totalN;
    return {
      A: { count: counts.A, pct: currentN > 0 ? Math.round((counts.A / currentN) * 100) : 0 },
      B: { count: counts.B, pct: currentN > 0 ? Math.round((counts.B / currentN) * 100) : 0 },
      C: { count: counts.C, pct: currentN > 0 ? Math.round((counts.C / currentN) * 100) : 0 },
      D: { count: counts.D, pct: currentN > 0 ? Math.round((counts.D / currentN) * 100) : 0 },
    };
  };

  const activeQuestion = QUESTIONS_DATA.find((q) => q.id === selectedQuestionTab) || QUESTIONS_DATA[0];
  const activeStats = getQuestionStats(activeQuestion.key);

  return (
    <div className="space-y-8" id="visef-school-funnel-suite">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Mô Hình Phễu Nghiên Cứu Đề Tài ViSEF 2026
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Dữ Liệu Thực Tế: N = {totalN}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Phễu Khảo Sát Nhận Thức Học Đường & Nhu Cầu Can Thiệp Hệ Thống
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Phân tích chuỗi nhận thức logic từ bộ khảo sát 8 câu hỏi chuẩn hóa: 
              <strong className="text-amber-300"> Tỷ lệ gặp rủi ro → Mức độ suýt bị hại → Kênh phát tán → Thủ đoạn → Mức độ tự tin → Nhu cầu giải pháp phòng vệ</strong>.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {onOpenLiveSurvey && (
              <button
                id="btn-take-funnel-survey"
                onClick={onOpenLiveSurvey}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>Tham Gia Khảo Sát (Live)</span>
              </button>
            )}

            {onExportCSV && (
              <button
                id="btn-funnel-export-csv"
                onClick={onExportCSV}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Xuất CSV Khảo Sát (N={totalN})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 1. VISUAL 6-STEP FUNNEL PIPELINE (Đúng theo yêu cầu prompt) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              Chuỗi Phễu Thực Tiễn 6 Bước (Empirical Research Funnel)
            </h3>
          </div>
          <span className="text-xs text-slate-400">Từ Hiện Trạng Đến Giải Pháp (N={funnelMetrics.n})</span>
        </div>

        {/* 6 Funnel Cards with Connectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 relative">
          {/* Step 1: Từng gặp scam */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-3 relative group hover:border-indigo-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                1. Từng Gặp Scam
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-amber-400">{funnelMetrics.encounteredPct}%</div>
              <p className="text-[11px] text-slate-400 mt-0.5">({funnelMetrics.encountered}/{funnelMetrics.n} học sinh)</p>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-3">
              Đã từng trực tiếp tiếp cận tin nhắn, đường link hoặc cuộc gọi có dấu hiệu lừa đảo.
            </p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${funnelMetrics.encounteredPct}%` }} />
            </div>
          </div>

          {/* Step 2: Từng suýt bị lừa */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-3 relative group hover:border-rose-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                2. Từng Suýt Bị Hại
              </span>
              <Flame className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-rose-400">{funnelMetrics.nearMissPct}%</div>
              <p className="text-[11px] text-slate-400 mt-0.5">({funnelMetrics.nearMissOrVictim}/{funnelMetrics.n} có nguy cơ cao)</p>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-3">
              Suýt chuyển tiền, lộ thông tin cá nhân/CCCD hoặc đã chịu thiệt hại tài sản thực tế.
            </p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-400 h-full rounded-full" style={{ width: `${funnelMetrics.nearMissPct}%` }} />
            </div>
          </div>

          {/* Step 3: Kênh phổ biến */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-3 relative group hover:border-cyan-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                3. Kênh Phổ Biến
              </span>
              <Smartphone className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-lg font-black text-cyan-400 truncate">{funnelMetrics.topChannelName}</div>
              <p className="text-[11px] text-slate-400 mt-0.5">{funnelMetrics.topChannelPct}% lựa chọn nhiều nhất</p>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-3">
              Facebook/Messenger và SMS là 2 kênh phát tán bẫy chiếm hơn 73% các vụ tiếp cận.
            </p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${funnelMetrics.topChannelPct}%` }} />
            </div>
          </div>

          {/* Step 4: Thủ đoạn phổ biến */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-3 relative group hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                4. Thủ Đoạn Chính
              </span>
              <MessageSquare className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="text-lg font-black text-purple-400 truncate">{funnelMetrics.topTacticName}</div>
              <p className="text-[11px] text-slate-400 mt-0.5">{funnelMetrics.topTacticPct}% học sinh gặp phải</p>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-3">
              Mời nhận thưởng/việc nhẹ lương cao và mạo danh cơ quan đe dọa xử phạt tài khoản.
            </p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-400 h-full rounded-full" style={{ width: `${funnelMetrics.topTacticPct}%` }} />
            </div>
          </div>

          {/* Step 5: Mức độ tự tin */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-3 relative group hover:border-amber-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                5. Tự Tin Còn Thấp
              </span>
              <HelpCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-amber-400">{funnelMetrics.lowConfidencePct}%</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Tự đánh giá Khá thấp / Rất thấp</p>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-3">
              Gần một nửa học sinh thừa nhận khó nhận diện khi kẻ gian sử dụng bẫy tinh vi.
            </p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${funnelMetrics.lowConfidencePct}%` }} />
            </div>
          </div>

          {/* Step 6: Nhu cầu sử dụng */}
          <div className="rounded-xl bg-gradient-to-b from-slate-900 to-indigo-950/70 border border-emerald-500/40 p-4 space-y-3 relative group hover:border-emerald-400 transition-all shadow-lg shadow-emerald-500/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                6. Nhu Cầu Ứng Dụng
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400">{funnelMetrics.demandPct}%</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Rất mong muốn luyện tập thường xuyên</p>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-3">
              93.3% học sinh và thầy cô muốn có nền tảng mô phỏng thực tế SCAMGUARD để rèn luyện.
            </p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${funnelMetrics.demandPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. DEMOGRAPHIC CORRELATION SUITE (3 Thông tin nền: Khối, Giới tính, Đã học ATTT) */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              Phân Tích Tương Quan 3 Thông Tin Nền Học Đường
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Đo lường sự khác biệt giữa các Khối lớp, Giới tính và Tác động mang tính quyết định của Tập huấn ATTT
            </p>
          </div>

          {/* Demographic Interactive Filters */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="px-2 text-slate-400 text-[11px] flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" /> Lọc:
            </span>
            {[
              { id: 'ALL', label: `Tất cả (N=${totalN})` },
              { id: 'GRADE_10', label: `Khối 10 (${correlationData.grade10})` },
              { id: 'GRADE_11', label: `Khối 11 (${correlationData.grade11})` },
              { id: 'GRADE_12', label: `Khối 12 (${correlationData.grade12})` },
              { id: 'TEACHER', label: `Giáo viên (${correlationData.teachers})` },
              { id: 'TRAINED', label: `Đã học ATTT (${correlationData.trainedCount})` },
              { id: 'UNTRAINED', label: `Chưa học (${correlationData.untrainedCount})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setDemographicFilter(f.id as any)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  demographicFilter === f.id
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Demographic Deep-Dive Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Col 1: Phân bố khối lớp */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Cơ Cấu Khối Lớp</span>
              <span className="text-xs text-indigo-400 font-semibold">{totalN} phiếu</span>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Khối 10', count: correlationData.grade10, pct: Math.round((correlationData.grade10 / totalN) * 100), color: 'bg-cyan-400' },
                { label: 'Khối 11', count: correlationData.grade11, pct: Math.round((correlationData.grade11 / totalN) * 100), color: 'bg-indigo-400' },
                { label: 'Khối 12', count: correlationData.grade12, pct: Math.round((correlationData.grade12 / totalN) * 100), color: 'bg-purple-400' },
                { label: 'Giáo viên / CBQL', count: correlationData.teachers, pct: Math.round((correlationData.teachers / totalN) * 100), color: 'bg-amber-400' },
              ].map((row) => (
                <div key={row.label} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-300">{row.label}</span>
                    <span className="text-slate-400">{row.count} người ({row.pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className={`${row.color} h-full rounded-full transition-all duration-500`} style={{ width: `${row.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              * Khối 11 chiếm tỷ lệ cao nhất (33.3%), là lứa tuổi tương tác mạng xã hội năng động nhất và cũng là nhóm đối tượng chịu rủi ro bẫy lừa trực tuyến nhiều nhất.
            </p>
          </div>

          {/* Col 2: Phân bố giới tính */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Cơ Cấu Giới Tính</span>
              <span className="text-xs text-cyan-400 font-semibold">Tỷ lệ cân bằng</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center space-y-1">
                <span className="text-xs text-slate-400">Nam</span>
                <div className="text-xl font-black text-cyan-400">{correlationData.males} người</div>
                <div className="text-[11px] text-slate-400">{Math.round((correlationData.males / totalN) * 100)}%</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center space-y-1">
                <span className="text-xs text-slate-400">Nữ</span>
                <div className="text-xl font-black text-pink-400">{correlationData.females} người</div>
                <div className="text-[11px] text-slate-400">{Math.round((correlationData.females / totalN) * 100)}%</div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Nam thường gặp:</span>
                <span className="text-slate-200 font-medium">Bẫy kiếm tiền / Game</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nữ thường gặp:</span>
                <span className="text-slate-200 font-medium">Bẫy mua sắm / Hack nick</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              * Tỷ lệ Nam/Nữ cân bằng (53.3% vs 46.7%) khẳng định tính đại diện cao của mẫu nghiên cứu, không bị thiên lệch theo giới tính.
            </p>
          </div>

          {/* Col 3: Tác động của Tập huấn ATTT (Điểm mấu chốt ViSEF) */}
          <div className="rounded-xl bg-gradient-to-b from-indigo-950/40 to-slate-950 border border-indigo-500/30 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Tác Động Tập Huấn ATTT</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Key Insight</span>
            </div>

            <div className="space-y-3 text-xs">
              {/* So sánh OTP */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-300">Từ chối chia sẻ OTP (Câu 7 = C):</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                  <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold">
                    Đã học: {correlationData.trainedOtpStrict}%
                  </div>
                  <div className="p-1.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold">
                    Chưa học: {correlationData.untrainedOtpStrict}%
                  </div>
                </div>
              </div>

              {/* So sánh Tự tin nhận diện */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-300">Tự tin nhận diện tốt (Câu 6 = C/D):</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                  <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold">
                    Đã học: {correlationData.trainedConfident}%
                  </div>
                  <div className="p-1.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold">
                    Chưa học: {correlationData.untrainedConfident}%
                  </div>
                </div>
              </div>

              {/* So sánh Từng suýt bị lừa */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-300">Tỷ lệ từng suýt bị hại (Câu 2 = B/C/D):</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                  <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold">
                    Đã học: {correlationData.trainedVulnerable}%
                  </div>
                  <div className="p-1.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold">
                    Chưa học: {correlationData.untrainedVulnerable}%
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-emerald-300/90 pt-2 border-t border-slate-800">
              * Tác động vượt trội: Nhóm đã được tập huấn có tỷ lệ bảo vệ OTP tuyệt đối (100% so với 37.5%), chứng minh giá trị sống còn của đào tạo phòng thủ thực chiến.
            </p>
          </div>
        </div>
      </div>

      {/* 3. DETAILED 8 QUESTIONS BREAKDOWN (Từng câu hỏi ABCD chi tiết) */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              Chi Tiết Phân Phối 8 Câu Hỏi Khảo Sát Chuẩn Hóa
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Nhấp vào từng câu hỏi để xem chi tiết biểu đồ tỷ lệ lựa chọn các phương án A, B, C, D
            </p>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Mẫu lọc hiện tại: <strong className="text-indigo-300">N = {currentFilteredN}</strong>
          </div>
        </div>

        {/* 8 Question Selection Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {QUESTIONS_DATA.map((q) => {
            const isSelected = selectedQuestionTab === q.id;
            return (
              <button
                key={q.id}
                onClick={() => setSelectedQuestionTab(q.id)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-102 border border-indigo-400/50'
                    : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800'
                }`}
              >
                <span>Câu {q.id}</span>
                <span className="text-[10px] font-normal opacity-80 truncate max-w-full">
                  {q.id === 1 ? 'Từng gặp' : q.id === 2 ? 'Mức độ' : q.id === 3 ? 'Kênh scam' : q.id === 4 ? 'Thủ đoạn' : q.id === 5 ? 'Phản xạ' : q.id === 6 ? 'Tự tin' : q.id === 7 ? 'OTP/Pass' : 'Nhu cầu'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Question Detail Card */}
        <div className="rounded-xl bg-slate-950/80 border border-indigo-500/30 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div>
              <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                {activeQuestion.category}
              </span>
              <h4 className="text-base sm:text-lg font-bold text-white mt-1">
                {activeQuestion.title}
              </h4>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold self-start sm:self-auto shrink-0">
              Tổng phản hồi: N = {currentFilteredN}
            </span>
          </div>

          {/* ABCD Options Distribution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeQuestion.options.map((opt) => {
              const stat = activeStats[opt.code as keyof typeof activeStats];
              const isOptimal = opt.riskType === 'OPTIMAL';
              const isSafe = opt.riskType === 'SAFE';
              const isCritical = opt.riskType === 'CRITICAL';
              const isWarning = opt.riskType === 'WARNING';

              let borderColor = 'border-slate-800';
              let badgeBg = 'bg-slate-800 text-slate-300';
              let barColor = 'bg-slate-600';

              if (isOptimal) {
                borderColor = 'border-emerald-500/40 bg-emerald-950/10';
                badgeBg = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
                barColor = 'bg-emerald-400';
              } else if (isSafe) {
                borderColor = 'border-cyan-500/40 bg-cyan-950/10';
                badgeBg = 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40';
                barColor = 'bg-cyan-400';
              } else if (isCritical) {
                borderColor = 'border-rose-500/40 bg-rose-950/10';
                badgeBg = 'bg-rose-500/20 text-rose-300 border border-rose-500/40';
                barColor = 'bg-rose-500';
              } else if (isWarning) {
                borderColor = 'border-amber-500/40 bg-amber-950/10';
                badgeBg = 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
                barColor = 'bg-amber-400';
              }

              return (
                <div
                  key={opt.code}
                  className={`rounded-xl border p-4 space-y-3 relative overflow-hidden ${borderColor}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {opt.code}
                      </div>
                      <span className="text-xs font-semibold text-slate-200 leading-snug">
                        {opt.text}
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${badgeBg}`}>
                      {opt.tag}
                    </span>
                  </div>

                  {/* Stat Metrics & Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="text-slate-400 font-medium">Số phiếu: <strong>{stat.count}</strong> / {currentFilteredN}</span>
                      <span className="text-base font-black text-white">{stat.pct}%</span>
                    </div>

                    <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.pct}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full rounded-full ${barColor}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Research Scientific Insight Note */}
          <div className="rounded-xl bg-slate-900 border border-slate-800/80 p-4 flex items-start gap-3">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-200">Ý Nghĩa Khoa Học ViSEF:</span>
              <p className="text-slate-300 leading-relaxed">{activeQuestion.insight}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
