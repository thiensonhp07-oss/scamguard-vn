import React, { useState } from 'react';
import {
  Dna,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Award,
  Zap,
  TrendingUp,
  Flame,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  FileCheck,
} from 'lucide-react';
import { ScamDnaProfile, ScamTactic, UserProfile } from '../types';
import { INITIAL_BADGES } from '../data/badges';
import { useTranslation } from '../i18n/LanguageContext';
import { MonthlySecurityReportCard } from './MonthlySecurityReportCard';
import { MilestonesSection } from './MilestonesSection';

interface ProgressViewProps {
  userProfile: UserProfile;
  dnaProfile?: ScamDnaProfile;
  subTab?: string;
  onNavigateToArena?: () => void;
  onNavigate?: (tab: string, sub?: string) => void;
  onEarnXp?: (amount: number) => void;
}

const TACTIC_VIETNAMESE_MAP: Record<ScamTactic, { name: string; desc: string }> = {
  Authority: { name: 'Uy Quyền & Giả Mạo Cơ Quan', desc: 'Giả danh công an, viện kiểm sát, cơ quan thuế dọa nạt' },
  Urgency: { name: 'Dồn Ép Thời Gian & Khẩn Cấp', desc: 'Đếm ngược 5 phút, 15 phút gây áp lực phải quyết định vội' },
  Fear: { name: 'Nỗi Sợ Hãi & Đe Dọa Pháp Lý', desc: 'Dọa khởi tố, phong tỏa tài khoản, bắt giam' },
  Greed: { name: 'Lòng Tham & Hoa Hồng Lợi Nhuận', desc: 'Việc nhẹ lương cao, lợi nhuận 30%/ngày' },
  Sympathy: { name: 'Đánh Vào Lòng Trắc Ẩn / Tình Cảm', desc: 'Khóc lóc người thân gặp nạn cần viện phí' },
  'Social Proof': { name: 'Bằng Chứng Đám Đông (Chim Mồi)', desc: 'Nhóm Telegram khoe tiền, bill chuyển khoản giả' },
  Isolation: { name: 'Cô Lập Tâm Lý (Giữ Bí Mật)', desc: 'Yêu cầu không được kể cho gia đình, bạn bè biết' },
  Reciprocity: { name: 'Tâm Lý Đền Đáp (Thả Con Săn Sắt)', desc: 'Cho ăn thưởng 50k-100k đầu tiên để bẫy tiền lớn' },
  Romance: { name: 'Tình Cảm Ảo (Mổ Heo Sha Zhu Pan)', desc: 'Làm quen nhầm số, hẹn hò rồi rủ đầu tư tài chính' },
  Confusion: { name: 'Gây Rối Bời & Mập Mờ Thuật Ngữ', desc: 'Đọc điều luật, thông tư giả khiến nạn nhân lúng túng' },
  'Synthetic Media': { name: 'Phương Tiện Nhân Tạo AI Deepfake', desc: 'Clone giọng nói, giả khuôn mặt video call' },
  'Convenience Bias': { name: 'Thiên Kiến Tiện Lợi (Bấm Nhanh)', desc: 'Thu phí 12.000đ bưu kiện, bấm link tiện lợi' },
};

export const ProgressView: React.FC<ProgressViewProps> = ({
  userProfile,
  dnaProfile,
  subTab,
  onNavigateToArena,
  onNavigate,
  onEarnXp,
}) => {
  const { t } = useTranslation();
  const [activeSubSection, setActiveSubSection] = useState<'all' | 'milestones' | 'monthly_report' | 'matrix' | 'badges'>(
    (subTab as any) || 'all'
  );

  React.useEffect(() => {
    if (subTab && ['all', 'milestones', 'monthly_report', 'matrix', 'badges'].includes(subTab)) {
      setActiveSubSection(subTab as any);
    }
  }, [subTab]);

  const hasTrained = (userProfile.xp || 0) > 0 || (userProfile.completedScenarios?.length || 0) > 0;

  const [coachAdvice, setCoachAdvice] = useState<string>(
    hasTrained
      ? 'Bạn phản xạ cực kỳ tốt trước các đòn Uy Quyền (Authority) và Dồn Ép (Urgency). Tuy nhiên, bạn cần chú ý cảnh giác hơn trước các tình huống Đánh Vào Lòng Trắc Ẩn (Sympathy) và Deepfake Giọng Nói Giả Người Thân.'
      : 'Bạn chưa tham gia diễn tập phòng thủ nào. Hãy hoàn thành bài học chiến dịch hoặc kịch bản diễn tập đầu tiên để hệ thống đánh giá chỉ số phản xạ ma trận ScamDNA của bạn theo thời gian thực!'
  );
  const [loadingCoach, setLoadingCoach] = useState(false);

  const tacticScores: Record<ScamTactic, number> = dnaProfile?.scores || {
    Authority: hasTrained ? 75 : 0,
    Urgency: hasTrained ? 70 : 0,
    Fear: hasTrained ? 65 : 0,
    Greed: hasTrained ? 60 : 0,
    Sympathy: hasTrained ? 50 : 0,
    'Social Proof': hasTrained ? 55 : 0,
    Isolation: hasTrained ? 60 : 0,
    Reciprocity: hasTrained ? 55 : 0,
    Romance: hasTrained ? 50 : 0,
    Confusion: hasTrained ? 60 : 0,
    'Synthetic Media': hasTrained ? 50 : 0,
    'Convenience Bias': hasTrained ? 55 : 0,
  };

  const handleRefreshCoach = async () => {
    setLoadingCoach(true);
    try {
      const res = await fetch('/api/coach/advise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores: tacticScores,
          tier: 'Vệ Binh Vững Vàng',
          recentTactics: ['Sympathy', 'Synthetic Media'],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCoachAdvice(data.advice || coachAdvice);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCoach(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 cyber-grid">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/80 text-cyan-300 text-xs font-bold shadow-sm">
          <Dna className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t('prog_header_badge')}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          {t('prog_header_title')}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          {t('prog_header_subtitle')}
        </p>
      </div>

      {/* Sub-Navigation Filter Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
        <div className="flex items-center bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 shadow-lg">
          <button
            onClick={() => setActiveSubSection('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeSubSection === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Tổng Quan & Toàn Bộ</span>
          </button>

          <button
            onClick={() => setActiveSubSection('milestones')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeSubSection === 'milestones'
                ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Cột Mốc Điểm Số (Milestones)</span>
          </button>

          <button
            onClick={() => setActiveSubSection('monthly_report')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeSubSection === 'monthly_report'
                ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Báo Cáo An Ninh Tháng</span>
          </button>

          <button
            onClick={() => setActiveSubSection('matrix')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeSubSection === 'matrix'
                ? 'bg-purple-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dna className="w-3.5 h-3.5" />
            <span>Ma Trận Tâm Lý</span>
          </button>

          <button
            onClick={() => setActiveSubSection('badges')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeSubSection === 'badges'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Huy Hiệu ({INITIAL_BADGES.filter((b) => b.unlocked).length}/{INITIAL_BADGES.length})</span>
          </button>
        </div>
      </div>

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-6 rounded-3xl space-y-2 border border-slate-800/80 shadow-lg">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Điểm Phòng Thủ Tổng Thể</span>
          <div className="text-3xl font-black text-emerald-400">{userProfile.overallScore ?? 82} <span className="text-sm font-bold text-slate-500">/ 100</span></div>
          <span className="text-xs text-slate-400 font-semibold block">
            Cột Mốc: {userProfile.overallScore && userProfile.overallScore >= 90 ? 'Hộ Thần (Guardian)' : (userProfile.overallScore ?? 82) >= 80 ? 'Chuyên Gia (Expert)' : (userProfile.overallScore ?? 82) >= 60 ? 'Thành Thạo (Adept)' : 'Tân Binh (Novice)'}
          </span>
        </div>

        <div className="glass-panel p-6 rounded-3xl space-y-2 border border-slate-800/80 shadow-lg">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chuỗi Ngày Rèn Luyện</span>
          <div className="text-3xl font-black text-amber-400 flex items-center space-x-1.5">
            <Flame className="w-6 h-6 fill-amber-400" />
            <span>{userProfile.streakDays || 3} Ngày</span>
          </div>
          <span className="text-xs text-amber-400 font-semibold block">Tập luyện đều đặn</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl space-y-2 border border-slate-800/80 shadow-lg">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng XP Tích Lũy</span>
          <div className="text-3xl font-black text-cyan-400">{userProfile.xp || 1450} <span className="text-sm font-bold text-slate-500">XP</span></div>
          <span className="text-xs text-cyan-400 font-semibold block">Cấp Độ 4 • Vệ Binh</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl space-y-2 border border-slate-800/80 shadow-lg">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tình Huống Đã Hoàn Thành</span>
          <div className="text-3xl font-black text-purple-400">12 <span className="text-sm font-bold text-slate-500">Bài Học</span></div>
          <span className="text-xs text-emerald-400 font-semibold block">✓ Bảo vệ 100% tài khoản</span>
        </div>
      </div>

      {/* SECURITY MILESTONES (Score Threshold-based Visual Badges) */}
      {(activeSubSection === 'all' || activeSubSection === 'milestones') && (
        <MilestonesSection
          userProfile={userProfile}
          onEarnXp={onEarnXp}
          onNavigateToTrain={() => onNavigate?.('train')}
        />
      )}

      {/* MONTHLY SECURITY REPORT (Featured component summarizing scam detection accuracy over time) */}
      {(activeSubSection === 'all' || activeSubSection === 'monthly_report') && (
        <MonthlySecurityReportCard
          userProfile={userProfile}
          onEarnXp={onEarnXp}
          onNavigateToTrain={() => onNavigate?.('train')}
        />
      )}

      {/* AI Coach Tactical Briefing */}
      {(activeSubSection === 'all' || activeSubSection === 'matrix') && (
        <div className="glass-panel-glow p-6 sm:p-8 rounded-3xl space-y-4 border border-cyan-500/30 shadow-2xl">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{t('prog_coach_title')}</h3>
                <p className="text-xs text-slate-400">Đánh giá hành vi phòng vệ thông minh</p>
              </div>
            </div>

            <button
              onClick={handleRefreshCoach}
              disabled={loadingCoach}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${loadingCoach ? 'animate-spin' : ''}`} />
              <span>{t('prog_coach_btn_refresh')}</span>
            </button>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            "{coachAdvice}"
          </div>
        </div>
      )}

      {/* 12-Dimensional Psychological Vector Matrix */}
      {(activeSubSection === 'all' || activeSubSection === 'matrix') && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-800/80 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">{t('prog_matrix_title')}</h3>
              <p className="text-xs text-slate-400">
                Chỉ số kháng cự trước 12 thủ thuật thao túng tâm lý tinh vi nhất
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(tacticScores) as ScamTactic[]).map((tacticKey) => {
              const score = tacticScores[tacticKey];
              const info = TACTIC_VIETNAMESE_MAP[tacticKey];
              const isWeak = score < 70;

              return (
                <div
                  key={tacticKey}
                  className={`p-4 rounded-2xl border space-y-2.5 transition-all glass-card ${
                    isWeak
                      ? 'bg-rose-950/20 border-rose-500/40 shadow-rose-950/20'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{info.name}</span>
                    <span
                      className={`font-black ${
                        score >= 85
                          ? 'text-emerald-400'
                          : score >= 70
                          ? 'text-cyan-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {score}%
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug">{info.desc}</p>

                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all ${
                        score >= 85
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : score >= 70
                          ? 'bg-gradient-to-r from-cyan-500 to-sky-400'
                          : 'bg-gradient-to-r from-rose-500 to-red-400'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Badges Section */}
      {(activeSubSection === 'all' || activeSubSection === 'badges') && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-800/80 shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t('prog_badges_title')}</h3>
              <p className="text-xs text-slate-400">Ghi nhận những thành tựu phòng vệ xuất sắc</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INITIAL_BADGES.map((badge) => (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border space-y-3 transition-all glass-card ${
                  badge.unlocked
                    ? 'border-amber-500/40 shadow-lg shadow-amber-500/5'
                    : 'border-slate-800 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      badge.unlocked
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    🏆
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                    +{badge.xpReward} XP
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">{badge.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-snug">{badge.description}</p>
                </div>

                {badge.unlocked && (
                  <div className="text-[10px] font-bold text-emerald-400 flex items-center space-x-1 pt-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Đã Mở Khóa</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
