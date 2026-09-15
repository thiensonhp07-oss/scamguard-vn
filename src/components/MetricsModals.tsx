import React from 'react';
import {
  Flame,
  Sparkles,
  Heart,
  X,
  Shield,
  ShoppingBag,
  Zap,
  CheckCircle2,
  Calendar,
  Gift,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { playSuccessChime, playRewardTrophy } from '../utils/audioEffects';

interface MetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: 'home' | 'train' | 'leaderboard' | 'quests' | 'store' | 'profile' | 'more') => void;
}

interface StreakModalProps extends MetricModalProps {
  streakDays: number;
  onBuyFreeze?: () => void;
  hasFreeze?: boolean;
  onOpenFriends?: () => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({
  isOpen,
  onClose,
  streakDays,
  onBuyFreeze,
  hasFreeze = false,
  onNavigate,
  onOpenFriends,
}) => {
  if (!isOpen) return null;

  // Calculate current day of week: Monday=0, Tuesday=1, ... Sunday=6
  const now = new Date();
  const currentDayIndex = (now.getDay() + 6) % 7; // 0 for Mon, 6 for Sun
  const todayStr = now.toISOString().split('T')[0];
  const isTodayCompleted = localStorage.getItem('scamguard_streak_last_date') === todayStr;

  // Compute how many days are active this week up to currentDayIndex
  const activeDaysThisWeekCount = Math.min(
    7,
    Math.max(1, isTodayCompleted ? currentDayIndex + 1 : currentDayIndex)
  );

  const weekDayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const weekDays = weekDayLabels.map((label, idx) => {
    const active = idx < currentDayIndex || (idx === currentDayIndex && isTodayCompleted);
    const isToday = idx === currentDayIndex;
    return {
      label,
      active,
      isToday,
    };
  });

  const progressPercent = Math.min(100, Math.max(14, Math.round((activeDaysThisWeekCount / 7) * 100)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#111827] border-2 border-slate-800 rounded-[2rem] p-6 shadow-2xl space-y-5 text-left">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Badge */}
        <div>
          <span className="inline-block px-3.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[11px] font-black uppercase tracking-wider shadow-sm font-mono">
            HỘI VỆ BINH STREAK
          </span>
        </div>

        {/* Title + Subtitle + Flame Graphic Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
              {streakDays} ngày streak
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 leading-relaxed">
              Duy trì phản xạ an ninh mạng mỗi ngày để bảo vệ chính bạn và gia đình!
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-orange-500/20 to-amber-400/10 border-2 border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
            <Flame className="w-10 h-10 text-amber-400 fill-amber-400 animate-pulse" />
          </div>
        </div>

        {/* Weekly Calendar Progress Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-extrabold px-1">
            {weekDays.map((d, i) => (
              <span
                key={i}
                className={
                  d.active
                    ? 'text-amber-400 font-black'
                    : d.isToday
                    ? 'text-yellow-300 font-black underline underline-offset-4'
                    : 'text-slate-500'
                }
              >
                {d.label}
              </span>
            ))}
          </div>

          {/* Daily Status Icons Grid */}
          <div className="grid grid-cols-7 gap-1 text-center py-1">
            {weekDays.map((d, i) => (
              <div key={i} className="flex justify-center">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    d.active
                      ? 'bg-amber-500/20 border border-amber-500/60 text-amber-300 shadow-sm shadow-amber-500/20'
                      : d.isToday
                      ? 'bg-amber-500/10 border-2 border-dashed border-amber-400/80 text-amber-300 animate-pulse'
                      : 'bg-slate-950 border border-slate-800/80 text-slate-600'
                  }`}
                >
                  {d.active ? (
                    <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
                  ) : d.isToday ? (
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  ) : (
                    <span className="text-xs text-slate-600 font-bold">•</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar Track with Sparkling Tip */}
          <div className="space-y-1.5">
            <div className="relative w-full h-5 bg-slate-950 rounded-full p-1 border border-slate-800 flex items-center overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full transition-all duration-700 shadow-md flex items-center justify-end pr-1"
                style={{ width: `${progressPercent}%` }}
              >
                <Sparkles className="w-3.5 h-3.5 text-white fill-white animate-spin-slow" />
              </div>
            </div>
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 px-1 font-mono">
              <span>Tiến trình tuần: <strong className="text-amber-400">{activeDaysThisWeekCount} / 7 ngày</strong></span>
              <span className="text-amber-400">{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* Orange Banner Card: "Streak bạn bè" */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-5 shadow-xl text-white relative overflow-hidden flex items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1 z-10">
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">Streak Đồng Đội</h3>
            <p className="text-xs text-amber-100 font-medium leading-relaxed">
              Cùng thi đua giữ vững chuỗi phòng thủ an ninh mạng với bạn bè
            </p>
            <button
              onClick={() => {
                onClose();
                if (onOpenFriends) {
                  onOpenFriends();
                } else {
                  onNavigate('more');
                }
              }}
              className="mt-2 bg-white text-orange-600 hover:bg-orange-50 font-black text-xs px-4 py-2.5 rounded-2xl border-b-4 border-orange-200 shadow-md uppercase tracking-wider transition-all cursor-pointer inline-block font-mono"
            >
              KẾT NỐI BẠN BÈ
            </button>
          </div>

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-orange-950/40 border-2 border-amber-200/50 flex items-center justify-center text-amber-300 shadow-lg flex-shrink-0 relative">
            <Flame className="w-10 h-10 text-amber-300 fill-amber-400 animate-bounce" />
          </div>
        </div>

        {/* Bottom CTA Action Button */}
        <button
          onClick={() => {
            onClose();
            onNavigate('home');
            setTimeout(() => {
              const roadmapEl = document.getElementById('roadmap-path-section');
              if (roadmapEl) {
                roadmapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 180);
          }}
          className="cartoon-btn-cyan w-full py-3.5 text-sm font-black uppercase tracking-wider shadow-xl flex items-center justify-center space-x-2 cursor-pointer font-mono"
        >
          <span>LUYỆN TẬP BẢO VỆ CHUỖI NGAY</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const GemsModal: React.FC<any> = () => null;
export const HeartsModal: React.FC<any> = () => null;

interface StreakCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  oldStreak: number;
  newStreak: number;
}

export const StreakCelebrationModal: React.FC<StreakCelebrationModalProps> = ({
  isOpen,
  onClose,
  oldStreak,
  newStreak,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-fade-in overflow-hidden">
      {/* Background Fiery Particles & Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-rose-950/50 via-amber-950/40 to-slate-950 pointer-events-none" />
      <div className="glow-orb-cyan top-1/4 left-1/2 -translate-x-1/2 opacity-40 w-96 h-96 bg-amber-500/30 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-500/60 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl shadow-amber-500/40 text-center space-y-6 z-10 animate-scale-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-2xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Giant Flaming Pulsing Emblem */}
        <div className="relative w-28 h-28 mx-auto rounded-full bg-gradient-to-tr from-rose-600 via-amber-500 to-yellow-400 p-1 flex items-center justify-center shadow-2xl shadow-rose-500/50 animate-bounce">
          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border-2 border-amber-300">
            <Flame className="w-16 h-16 text-amber-400 fill-amber-400 animate-pulse" />
          </div>
          <div className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider border border-amber-300 shadow-md">
            +1 NGÀY CHUỖI LỬA
          </div>
        </div>

        {/* Fiery Title & Increment Count */}
        <div className="space-y-2">
          <div className="text-xs font-black uppercase tracking-widest text-amber-400">
            🔥 LỬA RỰC ĐỎ KÍCH HOẠT! 🔥
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
            {newStreak} NGÀY STREAK!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-xs mx-auto">
            Bạn đã hoàn thành bài tập rèn luyện và kéo dài chuỗi ngày an toàn cảnh giác chống lừa đảo!
          </p>
        </div>

        {/* Fiery Bar Display */}
        <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-300">
            <span className="flex items-center space-x-1">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Thói Quen Vệ Binh Số</span>
            </span>
            <span className="text-amber-400 font-mono font-bold">{newStreak} / {newStreak + 1} ngày</span>
          </div>
          <div className="w-full h-4 bg-slate-900 rounded-full p-0.5 border border-slate-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-yellow-400 rounded-full transition-all duration-1000 shadow-md animate-pulse" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Confirm Claim Button */}
        <button
          onClick={onClose}
          className="cartoon-btn-amber w-full py-4 text-sm font-black uppercase tracking-wider shadow-2xl cursor-pointer flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-5 h-5 fill-slate-950" />
          <span>NHẬN LỬA & TIẾP TỤC</span>
        </button>
      </div>
    </div>
  );
};
