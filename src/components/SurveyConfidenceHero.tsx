import React from 'react';
import { Zap, Gauge, Sparkles, CheckCircle2, Minus, Plus, ShieldCheck, ShieldAlert, Award, Compass } from 'lucide-react';
import { playSuccessChime } from '../utils/audioEffects';

interface SurveyConfidenceHeroProps {
  score: number;
  onChange: (score: number) => void;
  idPrefix?: string;
}

const PRESET_TIERS = [
  {
    score: 20,
    level: '20đ',
    emoji: '😱',
    title: 'Cực Hoang Mang',
    shortDesc: 'Dễ sập bẫy dồn ép viện phí/công an',
    colorName: 'rose',
    activeColor: 'bg-gradient-to-b from-rose-600 to-rose-700 text-white border-rose-300 shadow-xl shadow-rose-600/50 ring-4 ring-rose-500/40',
    idleColor: 'bg-slate-950/80 hover:bg-rose-950/30 border-slate-800 text-slate-300 hover:border-rose-500/50',
    gaugeColor: '#f43f5e',
  },
  {
    score: 40,
    level: '40đ',
    emoji: '😟',
    title: 'Thiếu Tự Tin',
    shortDesc: 'Hay nghi ngờ nhưng không rõ xử lý',
    colorName: 'amber',
    activeColor: 'bg-gradient-to-b from-amber-600 to-amber-700 text-white border-amber-300 shadow-xl shadow-amber-600/50 ring-4 ring-amber-500/40',
    idleColor: 'bg-slate-950/80 hover:bg-amber-950/30 border-slate-800 text-slate-300 hover:border-amber-500/50',
    gaugeColor: '#f59e0b',
  },
  {
    score: 60,
    level: '60đ',
    emoji: '😐',
    title: 'Mức Trung Bình',
    shortDesc: 'Biết chiêu cũ, dễ dính Deepfake AI',
    colorName: 'yellow',
    activeColor: 'bg-gradient-to-b from-yellow-600 to-yellow-700 text-white border-yellow-300 shadow-xl shadow-yellow-600/50 ring-4 ring-yellow-500/40',
    idleColor: 'bg-slate-950/80 hover:bg-yellow-950/30 border-slate-800 text-slate-300 hover:border-yellow-500/50',
    gaugeColor: '#eab308',
  },
  {
    score: 80,
    level: '80đ',
    emoji: '😎',
    title: 'Tự Tin Vững Vàng',
    shortDesc: 'Cảnh giác cao, hay tra soát độc lập',
    colorName: 'emerald',
    activeColor: 'bg-gradient-to-b from-emerald-600 to-emerald-700 text-white border-emerald-300 shadow-xl shadow-emerald-600/50 ring-4 ring-emerald-500/40',
    idleColor: 'bg-slate-950/80 hover:bg-emerald-950/30 border-slate-800 text-slate-300 hover:border-emerald-500/50',
    gaugeColor: '#10b981',
  },
  {
    score: 100,
    level: '100đ',
    emoji: '🛡️',
    title: 'Chuyên Gia Số',
    shortDesc: 'Am hiểu sâu Social Engineering',
    colorName: 'cyan',
    activeColor: 'bg-gradient-to-b from-cyan-600 to-cyan-700 text-white border-cyan-300 shadow-xl shadow-cyan-600/50 ring-4 ring-cyan-500/40',
    idleColor: 'bg-slate-950/80 hover:bg-cyan-950/30 border-slate-800 text-slate-300 hover:border-cyan-500/50',
    gaugeColor: '#06b6d4',
  },
];

export const SurveyConfidenceHero: React.FC<SurveyConfidenceHeroProps> = ({
  score,
  onChange,
  idPrefix = 'survey',
}) => {
  // Psychological diagnosis insight
  const getPsychologyInsight = (val: number) => {
    if (val <= 25) {
      return {
        emoji: '😱',
        label: 'Cực Kỳ Hoang Mang • Dễ Bị Sập Bẫy Dồn Ép Tâm Lý',
        subtext: 'Rất lo sợ khi nhận tin nhắn/cuộc gọi dọa nạt từ cơ quan chức năng hoặc viện phí cấp cứu; dễ làm theo lệnh chuyển tiền trong cơn hoảng loạn.',
        badgeClass: 'bg-rose-500/25 border-rose-500/60 text-rose-200',
        textColor: 'text-rose-400',
        glowColor: 'rgba(244, 63, 94, 0.4)',
        needleAngle: -70,
        mascotAdvice: 'Đừng lo lắng! Ứng dụng ScamGuard VN sẽ trở thành lá chắn tự động phân tích và chặn đứng mọi mưu đồ dọa nạt cho bạn.',
      };
    }
    if (val <= 45) {
      return {
        emoji: '😟',
        label: 'Thiếu Tự Tin & Bối Rối • Nghi Ngờ Nhưng Không Rõ Cách Tra Soát',
        subtext: 'Thường có linh cảm bất thường khi gặp đường link lạ hoặc số tổng đài giả mạo, nhưng chưa có quy trình kiểm tra bài bản, dễ bị kẻ gian dẫn dắt.',
        badgeClass: 'bg-amber-500/25 border-amber-500/60 text-amber-200',
        textColor: 'text-amber-400',
        glowColor: 'rgba(245, 158, 11, 0.4)',
        needleAngle: -35,
        mascotAdvice: 'Chỉ cần một chút rèn luyện với 12 kịch bản thực tế của ScamGuard VN, phản xạ nhận diện của bạn sẽ tăng gấp đôi!',
      };
    }
    if (val <= 65) {
      return {
        emoji: '😐',
        label: 'Mức Trung Bình • Biết Chiêu Cũ, Dễ Bị Đánh Lừa Bởi Deepfake AI',
        subtext: 'Biết cảnh giác trước tin nhắn trúng thưởng hay vay tiền đơn giản, nhưng dễ dính bẫy Video Call ghép mặt Deepfake hoặc mã QR Quishing tại quán ăn.',
        badgeClass: 'bg-yellow-500/25 border-yellow-500/60 text-yellow-200',
        textColor: 'text-yellow-400',
        glowColor: 'rgba(234, 179, 8, 0.4)',
        needleAngle: 0,
        mascotAdvice: 'Mức nhận thức phổ biến nhất! Hãy chú ý các đặc điểm nhận dạng AI như đồng bộ môi và giật viền khuôn mặt.',
      };
    }
    if (val <= 85) {
      return {
        emoji: '😎',
        label: 'Tự Tin Vững Vàng • Cảnh Giác Cao, Có Thói Quen Kiểm Tra Độc Lập',
        subtext: 'Luôn chú ý tên miền .gov.vn, tự gọi tổng đài in trên thẻ ngân hàng, chủ động cúp máy và ngắt kết nối khi gặp dấu hiệu mờ ám.',
        badgeClass: 'bg-emerald-500/25 border-emerald-500/60 text-emerald-200',
        textColor: 'text-emerald-400',
        glowColor: 'rgba(16, 185, 129, 0.4)',
        needleAngle: 35,
        mascotAdvice: 'Tuyệt vời! Bạn có nền tảng phòng vệ kỹ thuật số rất tốt. Hãy tiếp tục duy trì nguyên tắc xác minh 3 bước!',
      };
    }
    return {
      emoji: '🛡️',
      label: 'Rất Tự Tin (Chuyên Gia) • Am Hiểu Kỹ Nghệ Xã Hội (Social Engineering)',
      subtext: 'Nắm vững 11 bẫy tâm lý tác chiến lừa đảo công nghệ cao, tuyệt đối không cài app ngoài CH Play/App Store và không cung cấp OTP cho bất kỳ ai.',
      badgeClass: 'bg-cyan-500/25 border-cyan-500/60 text-cyan-200',
      textColor: 'text-cyan-400',
      glowColor: 'rgba(6, 182, 212, 0.4)',
      needleAngle: 70,
      mascotAdvice: 'Xuất sắc! Hồ sơ của bạn sẽ là mẫu đối chứng tiêu chuẩn cao cấp trong nghiên cứu phân tán nguy cơ ViSEF 2026.',
    };
  };

  const insight = getPsychologyInsight(score);

  const handleStepChange = (delta: number) => {
    const nextVal = Math.min(100, Math.max(10, score + delta));
    onChange(nextVal);
    try {
      playSuccessChime();
    } catch {
      // Audio not supported in background, silent fallback
    }
  };

  const handlePresetSelect = (presetScore: number) => {
    onChange(presetScore);
    try {
      playSuccessChime();
    } catch {
      // Safe fallback
    }
  };

  return (
    <div
      id={`${idPrefix}-confidence-hero-card`}
      className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 border-2 border-purple-500 shadow-2xl shadow-purple-950/80 ring-4 ring-purple-500/30 space-y-6 transition-all duration-300"
    >
      {/* Dynamic Animated Ambient Lights */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP PROMINENT ANNOUNCEMENT HEADER */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-purple-500/40 pb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/30 via-purple-500/30 to-cyan-500/30 border border-purple-400/60 text-purple-100 text-xs font-black uppercase tracking-wider shadow-lg">
          <Zap className="w-4 h-4 text-amber-300 animate-bounce" />
          <span>CHỈ SỐ QUAN TRỌNG NHẤT: ĐO LƯỜNG TỰ TIN KHI CHƯA DÙNG APP</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full bg-emerald-500/25 border border-emerald-400 text-emerald-300 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Đã Chọn: {score}/100 Điểm</span>
          </span>
          <span className="text-xs text-rose-400 font-black tracking-wide">* Bắt buộc</span>
        </div>
      </div>

      {/* TITLE & DESCRIPTION */}
      <div className="relative z-10 space-y-2">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-purple-500 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-xl shadow-purple-950/60 shrink-0 mt-0.5">
            5
          </div>
          <div className="space-y-1.5">
            <h3 className="text-white font-black text-base sm:text-xl leading-snug tracking-tight">
              Mức độ tự tin nhận diện tin nhắn, cuộc gọi & liên kết lừa đảo khi <span className="text-amber-300 underline decoration-amber-400/70 font-black">CHƯA DÙNG APP</span>:
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Hãy đánh giá thật trung thực bản lĩnh và thói quen phòng vệ hiện tại của bạn. ViSEF dùng chỉ số này làm <strong>trục hoành đối chứng khoa học</strong> để đo lường mức độ giảm rủi ro sau khi được ứng dụng can thiệp.
            </p>
          </div>
        </div>
      </div>

      {/* DYNAMIC SCORE SHOWCASE METER & PSYCHOLOGY REACTION */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl bg-slate-950/95 border border-purple-500/60 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6">
        
        {/* Left: Giant Score Counter & Quick Increments */}
        <div className="w-full lg:w-auto flex flex-col items-center lg:items-start text-center lg:text-left space-y-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-purple-300 uppercase font-mono tracking-wider font-bold">
              Điểm số tự tin bạn chọn:
            </span>
          </div>

          <div className="flex items-baseline gap-2 sm:gap-3">
            <span
              className="text-5xl sm:text-6xl lg:text-7xl font-black font-mono tracking-tight transition-all duration-300"
              style={{
                color: PRESET_TIERS.find(t => Math.abs(t.score - score) <= 10)?.gaugeColor || '#ffffff',
                textShadow: `0 0 25px ${insight.glowColor}`,
              }}
            >
              {score}
            </span>
            <span className="text-lg sm:text-2xl font-bold text-slate-400 font-mono">/ 100đ</span>
          </div>

          {/* Quick Increment/Decrement Step Buttons - 4-grid on mobile, flex on desktop */}
          <div className="w-full sm:w-auto space-y-1.5 pt-1">
            <span className="text-[11px] text-slate-400 font-medium block text-center lg:text-left">Chỉnh nhanh:</span>
            <div className="grid grid-cols-4 gap-1.5 sm:flex sm:items-center sm:gap-2">
              <button
                type="button"
                onClick={() => handleStepChange(-10)}
                disabled={score <= 10}
                className="py-2 px-2.5 sm:px-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-200 text-xs font-mono font-bold border border-slate-700 transition flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                title="Giảm 10 điểm"
              >
                <Minus className="w-3 h-3" />
                <span>10đ</span>
              </button>
              <button
                type="button"
                onClick={() => handleStepChange(-5)}
                disabled={score <= 10}
                className="py-2 px-2 sm:px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-200 text-xs font-mono font-bold border border-slate-700 transition flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                title="Giảm 5 điểm"
              >
                <Minus className="w-3 h-3" />
                <span>5đ</span>
              </button>
              <button
                type="button"
                onClick={() => handleStepChange(5)}
                disabled={score >= 100}
                className="py-2 px-2 sm:px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-200 text-xs font-mono font-bold border border-slate-700 transition flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                title="Tăng 5 điểm"
              >
                <Plus className="w-3 h-3" />
                <span>5đ</span>
              </button>
              <button
                type="button"
                onClick={() => handleStepChange(10)}
                disabled={score >= 100}
                className="py-2 px-2.5 sm:px-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-200 text-xs font-mono font-bold border border-slate-700 transition flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                title="Tăng 10 điểm"
              >
                <Plus className="w-3 h-3" />
                <span>10đ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center: Semi-circle Arc Visual Dial */}
        <div className="flex flex-col items-center justify-center shrink-0 py-1">
          <div className="relative w-32 sm:w-36 h-16 sm:h-20 overflow-hidden flex items-end justify-center">
            {/* SVG Arc Gauge */}
            <svg viewBox="0 0 100 50" className="w-32 sm:w-36 h-16 sm:h-18">
              <path
                d="M 10,48 A 38,38 0 0,1 90,48"
                fill="none"
                stroke="#1e293b"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M 10,48 A 38,38 0 0,1 90,48"
                fill="none"
                stroke="url(#confidenceGradient)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="120"
                strokeDashoffset={120 - (score / 100) * 120}
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient id="confidenceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="30%" stopColor="#f59e0b" />
                  <stop offset="60%" stopColor="#eab308" />
                  <stop offset="85%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            {/* Needle pointer */}
            <div
              className="absolute bottom-1 w-1.5 h-12 sm:h-14 bg-white rounded-full origin-bottom shadow-lg transition-transform duration-300"
              style={{
                transform: `rotate(${insight.needleAngle}deg)`,
                boxShadow: '0 0 8px rgba(255,255,255,0.8)',
              }}
            />
            <div className="absolute bottom-0 w-3.5 sm:w-4 h-3.5 sm:h-4 bg-purple-500 rounded-full border-2 border-white" />
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-1 font-bold">
            Kim đo mức tự tin: {score}%
          </span>
        </div>

        {/* Right: Dynamic Mood Avatar & Diagnosis */}
        <div className="flex-1 max-w-md w-full p-4 sm:p-4.5 rounded-2xl bg-slate-900/95 border border-slate-800 space-y-2.5 text-center lg:text-left shadow-lg">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-3.5">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700 flex items-center justify-center text-3xl sm:text-4xl shrink-0 shadow-xl ring-2 ring-purple-500/20">
              {insight.emoji}
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] text-slate-400 block font-medium">Chẩn đoán phản xạ tâm lý:</span>
              <span className={`inline-block px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border text-xs font-bold leading-tight ${insight.badgeClass}`}>
                {insight.label}
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
            {insight.subtext}
          </p>
          <div className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-500/30 text-[11px] text-purple-200 flex items-start gap-2 text-left">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{insight.mascotAdvice}</span>
          </div>
        </div>
      </div>

      {/* 1-CLICK SPEED PRESETS: 5 BIG TACTILE CARDS (RESPONSIVE GRID) */}
      <div className="relative z-10 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-purple-400" />
            <span>⚡ Chọn nhanh trong 1 giây (Bấm trực tiếp 1 trong 5 mức chuẩn):</span>
          </span>
          <span className="text-[11px] text-purple-300 font-mono font-bold">1 Click để chọn</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {PRESET_TIERS.map((tier, idx) => {
            const isTierSelected = score === tier.score;
            return (
              <button
                key={tier.score}
                type="button"
                onClick={() => handlePresetSelect(tier.score)}
                className={`p-3.5 sm:p-4 lg:p-5 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-between gap-1.5 sm:gap-2 select-none transform active:scale-95 ${
                  idx === 4 ? 'col-span-2 sm:col-span-1' : ''
                } ${
                  isTierSelected
                    ? `${tier.activeColor} scale-[1.02] sm:scale-[1.03]`
                    : `${tier.idleColor} hover:scale-[1.01] sm:hover:scale-[1.02]`
                }`}
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl filter drop-shadow-md">{tier.emoji}</div>
                <span className={`text-sm sm:text-base lg:text-lg font-black font-mono ${isTierSelected ? 'text-white' : 'text-purple-300'}`}>
                  {tier.level}
                </span>
                <span className={`text-xs font-black leading-tight ${isTierSelected ? 'text-white' : 'text-slate-200'}`}>
                  {tier.title}
                </span>
                <span className={`text-[10px] sm:text-[11px] leading-tight ${isTierSelected ? 'text-white/95 font-medium' : 'text-slate-400'}`}>
                  {tier.shortDesc}
                </span>
                {isTierSelected ? (
                  <span className="mt-1 px-2.5 py-0.5 rounded-full bg-white/25 text-white font-mono text-[10px] font-black uppercase tracking-wider border border-white/40">
                    Đang chọn ✓
                  </span>
                ) : (
                  <span className="mt-1 text-[10px] text-slate-500 font-mono">
                    Bấm chọn
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTINUOUS GRADIENT RANGE SLIDER FOR FINE ADJUSTMENTS */}
      <div className="relative z-10 space-y-3 pt-2">
        <div className="flex justify-between items-center text-xs text-slate-300 font-bold">
          <span className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Hoặc kéo thanh trượt điều chỉnh chi tiết từng nấc 5 điểm:</span>
          </span>
          <span className="px-3 py-1 rounded-xl bg-purple-900/80 border border-purple-500/50 text-purple-200 font-mono font-black text-xs">
            {score} / 100 điểm
          </span>
        </div>

        <div className="relative py-2">
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={score}
            onChange={(e) => {
              onChange(Number(e.target.value));
            }}
            className="w-full h-4 bg-gradient-to-r from-rose-500 via-amber-400 via-yellow-400 via-emerald-400 to-cyan-400 rounded-full appearance-none cursor-pointer accent-white shadow-inner"
          />
        </div>

        {/* Milestone Marks */}
        <div className="flex justify-between text-[11px] text-slate-400 font-mono px-1">
          <button
            type="button"
            onClick={() => handlePresetSelect(10)}
            className="flex flex-col items-start hover:text-white transition cursor-pointer"
          >
            <span className="font-bold text-rose-400">10đ</span>
            <span className="text-[10px]">Cực lo lắng</span>
          </button>
          <button
            type="button"
            onClick={() => handlePresetSelect(30)}
            className="flex flex-col items-center hover:text-white transition cursor-pointer"
          >
            <span className="font-bold text-amber-400">30đ</span>
            <span className="text-[10px]">Bối rối</span>
          </button>
          <button
            type="button"
            onClick={() => handlePresetSelect(50)}
            className="flex flex-col items-center hover:text-white transition cursor-pointer"
          >
            <span className="font-bold text-yellow-400">50đ</span>
            <span className="text-[10px]">Bình thường</span>
          </button>
          <button
            type="button"
            onClick={() => handlePresetSelect(70)}
            className="flex flex-col items-center hover:text-white transition cursor-pointer"
          >
            <span className="font-bold text-emerald-400">70đ</span>
            <span className="text-[10px]">Cảnh giác</span>
          </button>
          <button
            type="button"
            onClick={() => handlePresetSelect(100)}
            className="flex flex-col items-end hover:text-white transition cursor-pointer"
          >
            <span className="font-bold text-cyan-400">100đ</span>
            <span className="text-[10px]">Chuyên gia</span>
          </button>
        </div>
      </div>

      {/* RESEARCH & SCIENTIFIC ASSURANCE BANNER */}
      <div className="relative z-10 p-4 bg-purple-900/40 border border-purple-500/40 rounded-2xl text-purple-200 text-xs flex items-center gap-3.5 shadow-lg">
        <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
        <span className="leading-relaxed">
          <strong>Ý nghĩa khoa học ViSEF:</strong> Dữ liệu tự tin này là biến độc lập đo lường hội chứng tự tin thái quá (Dunning-Kruger) hoặc lo âu kỹ thuật số, được đối chiếu trực tiếp với điểm phòng thủ sau can thiệp của ứng dụng ScamGuard VN.
        </span>
      </div>
    </div>
  );
};

