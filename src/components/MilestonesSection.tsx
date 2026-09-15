import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Award,
  Sparkles,
  Zap,
  Lock,
  Unlock,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Share2,
  Sliders,
  RotateCcw,
  Target,
  ExternalLink,
  Flame,
  Check,
  Gift,
  Crosshair,
  Crown,
} from 'lucide-react';
import { SecurityMilestone, UserProfile } from '../types';
import { SECURITY_MILESTONES, getMilestoneProgress } from '../data/milestonesData';
import { playButtonClick, playSuccessChime, playChestFanfare } from '../utils/audioEffects';

interface MilestonesSectionProps {
  userProfile: UserProfile;
  onEarnXp?: (amount: number) => void;
  onNavigateToTrain?: () => void;
}

export const MilestonesSection: React.FC<MilestonesSectionProps> = ({
  userProfile,
  onEarnXp,
  onNavigateToTrain,
}) => {
  const actualScore = userProfile.overallScore ?? 82;
  const [simulatedScore, setSimulatedScore] = useState<number>(actualScore);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [selectedMilestone, setSelectedMilestone] = useState<SecurityMilestone | null>(null);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  
  // Track claimed milestone rewards in localStorage
  const [claimedRewards, setClaimedRewards] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem('scamguard_claimed_milestones');
      return stored ? JSON.parse(stored) : { novice: true, adept: true }; // pre-claim novice & adept for existing users
    } catch (e) {
      return { novice: true, adept: true };
    }
  });

  const activeScore = isSimulating ? simulatedScore : actualScore;
  const progressInfo = getMilestoneProgress(activeScore);

  const handleClaimReward = (milestone: SecurityMilestone, e: React.MouseEvent) => {
    e.stopPropagation();
    if (claimedRewards[milestone.id]) return;

    playChestFanfare();
    if (onEarnXp) {
      onEarnXp(milestone.xpReward);
    }

    const updated = { ...claimedRewards, [milestone.id]: true };
    setClaimedRewards(updated);
    try {
      localStorage.setItem('scamguard_claimed_milestones', JSON.stringify(updated));
    } catch (err) {}
  };

  const handleOpenDetail = (milestone: SecurityMilestone) => {
    playButtonClick();
    setSelectedMilestone(milestone);
  };

  const handleShareMilestone = (milestone: SecurityMilestone) => {
    playSuccessChime();
    if (onEarnXp && !copiedShare) {
      onEarnXp(25);
    }
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 3000);
  };

  const handleToggleSimulation = () => {
    playButtonClick();
    if (isSimulating) {
      setIsSimulating(false);
      setSimulatedScore(actualScore);
    } else {
      setIsSimulating(true);
    }
  };

  return (
    <div className="space-y-8" id="security-milestones-section">
      {/* Top Banner: Standings & Score Summary */}
      <div className="glass-panel-glow p-6 sm:p-8 rounded-3xl border border-cyan-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/80 text-cyan-300 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cột Mốc Điểm An Ninh (Security Milestones)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Bậc Thang Danh Dự & Huy Hiệu Phản Xạ
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Mỗi khi điểm phòng thủ tổng thể của bạn vượt qua các ngưỡng bảo mật quan trọng, bạn sẽ
              mở khóa các huy hiệu danh dự độc quyền, danh hiệu vinh danh và các đặc quyền phòng thủ số nâng cao.
            </p>
          </div>

          {/* Quick Score Card & Calibration Toggle */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl flex items-center space-x-4 shadow-lg min-w-[200px]">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black text-lg shadow-inner">
                {activeScore}
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {isSimulating ? 'Điểm Đang Thử Nghiệm' : 'Điểm Phòng Thủ Hiện Tại'}
                </span>
                <span className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>{progressInfo.highestUnlocked ? progressInfo.highestUnlocked.vietnameseTitle : 'Tập Sự'}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {progressInfo.unlockedCount}/{progressInfo.totalCount} Mở Khóa
                  </span>
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleSimulation}
              className={`px-4 py-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                isSimulating
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Thử nghiệm tăng giảm điểm để xem hiệu ứng mở khóa huy hiệu"
            >
              <Sliders className="w-4 h-4" />
              <span>{isSimulating ? 'Đang Thử Nghiệm (Tắt)' : 'Thử Nghiệm Điểm Số'}</span>
            </button>
          </div>
        </div>

        {/* Live Score Calibration Slider (When Simulating) */}
        {isSimulating && (
          <div className="mt-6 pt-5 border-t border-slate-800/80 bg-slate-950/60 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>Kéo thanh trượt để thử nghiệm mở khóa ngưỡng điểm:</span>
              </span>
              <span className="font-mono font-bold text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                {simulatedScore} / 100 Điểm
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={simulatedScore}
              onChange={(e) => {
                const val = Number(e.target.value);
                setSimulatedScore(val);
                if (val >= 90 && activeScore < 90) {
                  playChestFanfare();
                }
              }}
              className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <button
                onClick={() => setSimulatedScore(25)}
                className="hover:text-white underline cursor-pointer"
              >
                25 (Khởi đầu)
              </button>
              <button
                onClick={() => setSimulatedScore(35)}
                className="hover:text-emerald-400 underline cursor-pointer"
              >
                35 (Novice)
              </button>
              <button
                onClick={() => setSimulatedScore(65)}
                className="hover:text-cyan-400 underline cursor-pointer"
              >
                65 (Adept)
              </button>
              <button
                onClick={() => setSimulatedScore(82)}
                className="hover:text-purple-400 underline cursor-pointer font-bold text-slate-300"
              >
                82 (Thực tế của bạn)
              </button>
              <button
                onClick={() => setSimulatedScore(95)}
                className="hover:text-amber-400 underline cursor-pointer font-bold"
              >
                95 (Guardian)
              </button>
              <button
                onClick={() => {
                  setSimulatedScore(actualScore);
                  setIsSimulating(false);
                }}
                className="text-slate-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Đặt Lại</span>
              </button>
            </div>
          </div>
        )}

        {/* Milestone Progression Linear Track */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Tiến Trình Cột Mốc Danh Dự</span>
            {progressInfo.nextMilestone ? (
              <span className="text-cyan-400 font-bold">
                Cần thêm +{progressInfo.pointsNeeded} điểm để mở khóa {progressInfo.nextMilestone.vietnameseTitle} ({progressInfo.nextMilestone.scoreThreshold}đ)
              </span>
            ) : (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 fill-amber-400" />
                <span>Đã Chinh Phục Toàn Bộ Cột Mốc Tối Thượng!</span>
              </span>
            )}
          </div>

          <div className="relative pt-6 pb-2">
            {/* Base Gray Track */}
            <div className="w-full bg-slate-900 h-3 rounded-full border border-slate-800 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-amber-400 rounded-full transition-all duration-500 shadow-md shadow-cyan-500/20"
                style={{ width: `${Math.min(100, activeScore)}%` }}
              />
            </div>

            {/* Threshold Markers along the track */}
            <div className="relative w-full flex justify-between items-center -mt-4.5 px-1">
              {SECURITY_MILESTONES.map((m) => {
                const isUnlocked = activeScore >= m.scoreThreshold;
                const isNext = progressInfo.nextMilestone?.id === m.id;

                return (
                  <button
                    key={m.id}
                    onClick={() => handleOpenDetail(m)}
                    className="group flex flex-col items-center cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                    style={{
                      position: 'absolute',
                      left: `${m.scoreThreshold}%`,
                      transform: 'translateX(-50%)',
                    }}
                  >
                    <div
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all shadow-lg ${
                        isUnlocked
                          ? 'bg-slate-950 border-emerald-400 text-emerald-300 shadow-emerald-500/30'
                          : isNext
                          ? 'bg-cyan-950 border-cyan-400 text-cyan-300 animate-pulse shadow-cyan-500/30 ring-2 ring-cyan-500/40'
                          : 'bg-slate-950 border-slate-700 text-slate-500'
                      }`}
                    >
                      {isUnlocked ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <span>{m.scoreThreshold}</span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-bold mt-1.5 whitespace-nowrap hidden sm:block ${
                        isUnlocked
                          ? 'text-emerald-400'
                          : isNext
                          ? 'text-cyan-300 font-black'
                          : 'text-slate-500'
                      }`}
                    >
                      {m.badgeLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Main Visual Milestone Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {SECURITY_MILESTONES.map((milestone) => {
          const isUnlocked = activeScore >= milestone.scoreThreshold;
          const isNextGoal = progressInfo.nextMilestone?.id === milestone.id;
          const isClaimed = claimedRewards[milestone.id];

          return (
            <div
              key={milestone.id}
              onClick={() => handleOpenDetail(milestone)}
              className={`rounded-3xl border p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                isUnlocked
                  ? 'bg-slate-950/80 border-slate-800 hover:border-cyan-500/60 shadow-xl hover:shadow-cyan-500/10'
                  : isNextGoal
                  ? 'bg-slate-950/80 border-cyan-500/50 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                  : 'bg-slate-950/40 border-slate-900/90 opacity-65 hover:opacity-85'
              }`}
            >
              {/* Background gradient glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${milestone.colorTheme.bgGlow} opacity-30 pointer-events-none group-hover:opacity-60 transition-opacity`}
              />

              {/* Status Header Badge */}
              <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
                <span
                  className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1 border ${
                    isUnlocked
                      ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 shadow-sm'
                      : isNextGoal
                      ? 'bg-cyan-950/90 text-cyan-300 border-cyan-500/50 animate-pulse'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  {isUnlocked ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Đã Mở Khóa</span>
                    </>
                  ) : isNextGoal ? (
                    <>
                      <Target className="w-3 h-3 text-cyan-400" />
                      <span>Đang Tiến Tới</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 text-slate-500" />
                      <span>Chưa Đạt</span>
                    </>
                  )}
                </span>

                <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-lg border border-slate-800">
                  ≥ {milestone.scoreThreshold}đ
                </span>
              </div>

              {/* Custom High-Res Visual SVG Insignia Badge */}
              <div className="my-3 flex items-center justify-center relative z-10 py-2">
                <MilestoneBadgeSVG
                  tierId={milestone.id}
                  isUnlocked={isUnlocked}
                  colorTheme={milestone.colorTheme}
                />
              </div>

              {/* Content & Titles */}
              <div className="space-y-2 relative z-10">
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-cyan-300 transition-colors">
                    {milestone.name}
                  </h3>
                  <div className="text-xs font-bold text-slate-300">
                    {milestone.vietnameseTitle}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                  {milestone.tagline}
                </p>

                {/* Perk highlight pill */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                    Đặc Quyền Nổi Bật:
                  </span>
                  <p className="text-[11px] text-slate-300 line-clamp-1 font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    <span>{milestone.perks[0]}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons: Claim XP or View Details */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 relative z-10">
                {isUnlocked ? (
                  isClaimed ? (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Đã nhận +{milestone.xpReward} XP</span>
                    </span>
                  ) : (
                    <button
                      onClick={(e) => handleClaimReward(milestone, e)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-black shadow-md hover:brightness-110 flex items-center space-x-1 cursor-pointer transition-all animate-bounce"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>Nhận +{milestone.xpReward} XP</span>
                    </button>
                  )
                ) : (
                  <span className="text-[10px] text-slate-500 font-semibold">
                    Cần thêm {milestone.scoreThreshold - activeScore}đ
                  </span>
                )}

                <button
                  onClick={() => handleOpenDetail(milestone)}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center space-x-0.5 ml-auto cursor-pointer"
                >
                  <span>Chi tiết</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivational Banner to Train & Earn More Points */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-md">
            <Flame className="w-5 h-5 fill-purple-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Muốn Mở Khóa Nhanh Các Cột Mốc Tiếp Theo?</h4>
            <p className="text-xs text-slate-400">
              Hoàn thành các tình huống đối đầu thực tế tại Scam Arena và giải cứu nạn nhân trong các phòng Lab để bứt phá điểm số!
            </p>
          </div>
        </div>

        {onNavigateToTrain && (
          <button
            onClick={() => {
              playButtonClick();
              onNavigateToTrain();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer flex-shrink-0"
          >
            <span>Vào Đấu Trường Luyện Điểm</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Milestone Detailed Inspector Modal */}
      {selectedMilestone && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedMilestone(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden text-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient background glow */}
            <div
              className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${selectedMilestone.colorTheme.bgGlow} rounded-full blur-3xl pointer-events-none opacity-40`}
            />

            {/* Modal Header */}
            <div className="flex items-center justify-between relative z-10">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-bold text-slate-400">
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                <span>Huy Hiệu Cột Mốc Danh Dự</span>
              </div>

              <button
                onClick={() => setSelectedMilestone(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Badge Emblem Display */}
            <div className="flex flex-col items-center text-center space-y-3 relative z-10">
              <div className="relative">
                <MilestoneBadgeSVG
                  tierId={selectedMilestone.id}
                  isUnlocked={activeScore >= selectedMilestone.scoreThreshold}
                  colorTheme={selectedMilestone.colorTheme}
                  size={120}
                />
              </div>

              <div>
                <h3 className="text-xl font-black text-white">{selectedMilestone.name}</h3>
                <p className="text-sm font-bold text-cyan-400">{selectedMilestone.vietnameseTitle}</p>
                <p className="text-xs text-slate-400 italic mt-1">"{selectedMilestone.tagline}"</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
                  Ngưỡng: ≥ {selectedMilestone.scoreThreshold} Điểm
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    activeScore >= selectedMilestone.scoreThreshold
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                      : 'bg-rose-950/80 text-rose-300 border-rose-500/50'
                  }`}
                >
                  {activeScore >= selectedMilestone.scoreThreshold
                    ? '✓ Đã Đạt Chuẩn'
                    : `Chưa Đạt (Hiện tại: ${activeScore}đ)`}
                </span>
              </div>
            </div>

            {/* Description & Lore */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs relative z-10">
              <span className="font-bold text-slate-300 block">Ý Nghĩa & Bối Cảnh Huy Hiệu:</span>
              <p className="text-slate-300 leading-relaxed">{selectedMilestone.description}</p>
              <div className="pt-2 border-t border-slate-900 text-slate-400 italic text-[11px]">
                🛡️ {selectedMilestone.unlockedLore}
              </div>
            </div>

            {/* Unlocked Perks List */}
            <div className="space-y-2 relative z-10">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Đặc Quyền & Bổng Lộc Nhận Được:
              </span>
              <div className="space-y-1.5">
                {selectedMilestone.perks.map((perk, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start space-x-2 text-xs text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3 relative z-10">
              <button
                onClick={() => handleShareMilestone(selectedMilestone)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedShare ? 'Đã Sao Chép Liên Kết!' : 'Khoe Thành Tựu (+25 XP)'}</span>
              </button>

              {activeScore >= selectedMilestone.scoreThreshold ? (
                !claimedRewards[selectedMilestone.id] ? (
                  <button
                    onClick={(e) => handleClaimReward(selectedMilestone, e)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-amber-500/20 hover:brightness-110 cursor-pointer"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Nhận +{selectedMilestone.xpReward} XP</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    <span>Đã nhận thưởng</span>
                  </span>
                )
              ) : onNavigateToTrain ? (
                <button
                  onClick={() => {
                    setSelectedMilestone(null);
                    onNavigateToTrain();
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-lg cursor-pointer"
                >
                  <span>Luyện Tập Ngay</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Custom Visual SVG Badge Insignia
 */
const MilestoneBadgeSVG: React.FC<{
  tierId: string;
  isUnlocked: boolean;
  colorTheme: SecurityMilestone['colorTheme'];
  size?: number;
}> = ({ tierId, isUnlocked, colorTheme, size = 96 }) => {
  const s = size;

  if (!isUnlocked) {
    return (
      <div
        className="relative flex items-center justify-center rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner"
        style={{ width: s, height: s }}
      >
        <svg
          width={s * 0.85}
          height={s * 0.85}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 8L85 24V50C85 70 70 86 50 92C30 86 15 70 15 50V24L50 8Z"
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="3"
            strokeDasharray="4 2"
          />
          <circle cx="50" cy="50" r="22" fill="#0f172a" stroke="#334155" strokeWidth="2" />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-slate-500">
          <Lock className="w-6 h-6 mb-1" />
          <span className="text-[9px] font-black uppercase tracking-wider">Khóa</span>
        </div>
      </div>
    );
  }

  // Render High-Craft tier-specific SVG
  switch (tierId) {
    case 'novice':
      return (
        <div className="relative flex items-center justify-center" style={{ width: s, height: s }}>
          <svg
            width={s}
            height={s}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-[0_0_12px_rgba(16,185,129,0.35)] transition-transform group-hover:scale-105"
          >
            <defs>
              <linearGradient id="noviceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#064e3b" />
              </linearGradient>
              <linearGradient id="noviceGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            {/* Outer laurel wreath / shield contour */}
            <path
              d="M50 5L88 22V52C88 74 72 90 50 96C28 90 12 74 12 52V22L50 5Z"
              fill="url(#noviceGrad)"
              stroke="#6ee7b7"
              strokeWidth="2.5"
            />
            {/* Inner Plate */}
            <path
              d="M50 14L80 28V50C80 68 67 82 50 87C33 82 20 68 20 50V28L50 14Z"
              fill="#062e24"
              stroke="#34d399"
              strokeWidth="1.5"
            />
            {/* Crosshair & Star */}
            <circle cx="50" cy="50" r="16" fill="#064e3b" stroke="#6ee7b7" strokeWidth="2" />
            <path
              d="M50 38V62M38 50H62"
              stroke="#a7f3d0"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="50" cy="50" r="5" fill="#34d399" />
            {/* Ribbon Label */}
            <rect x="25" y="74" width="50" height="13" rx="4" fill="#022c22" stroke="#34d399" strokeWidth="1.5" />
            <text x="50" y="83" fill="#6ee7b7" fontSize="8" fontWeight="900" textAnchor="middle" letterSpacing="1">
              NOVICE
            </text>
          </svg>
        </div>
      );

    case 'adept':
      return (
        <div className="relative flex items-center justify-center" style={{ width: s, height: s }}>
          <svg
            width={s}
            height={s}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-[0_0_15px_rgba(6,182,212,0.45)] transition-transform group-hover:scale-105"
          >
            <defs>
              <linearGradient id="adeptGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0c4a6e" />
              </linearGradient>
              <linearGradient id="lightningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
            {/* High-tech shield with dual wings */}
            <path
              d="M50 6L90 20V50C90 73 73 90 50 96C27 90 10 73 10 50V20L50 6Z"
              fill="url(#adeptGrad)"
              stroke="#7dd3fc"
              strokeWidth="2.5"
            />
            {/* Inner Cyber Core */}
            <path
              d="M50 15L80 27V48C80 67 67 81 50 86C33 81 20 67 20 48V27L50 15Z"
              fill="#082f49"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />
            {/* Lightning bolt bolt glyph */}
            <path
              d="M53 32L40 49H52L47 68L62 48H49L53 32Z"
              fill="url(#lightningGrad)"
              stroke="#bae6fd"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Ribbon Label */}
            <rect x="25" y="74" width="50" height="13" rx="4" fill="#031f33" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="50" y="83" fill="#bae6fd" fontSize="8" fontWeight="900" textAnchor="middle" letterSpacing="1">
              ADEPT
            </text>
          </svg>
        </div>
      );

    case 'expert':
      return (
        <div className="relative flex items-center justify-center" style={{ width: s, height: s }}>
          <svg
            width={s}
            height={s}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-[0_0_18px_rgba(168,85,247,0.5)] transition-transform group-hover:scale-105"
          >
            <defs>
              <linearGradient id="expertGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="50%" stopColor="#7e22ce" />
                <stop offset="100%" stopColor="#3b0764" />
              </linearGradient>
            </defs>
            {/* Octagonal Crest Shield */}
            <path
              d="M50 4L88 18L94 50L84 82L50 96L16 82L6 50L12 18L50 4Z"
              fill="url(#expertGrad)"
              stroke="#e9d5ff"
              strokeWidth="2.5"
            />
            {/* Inner Diamond Core */}
            <path
              d="M50 16L78 27L82 50L75 75L50 86L25 75L18 50L22 27L50 16Z"
              fill="#2e1065"
              stroke="#c084fc"
              strokeWidth="1.5"
            />
            {/* Crosshair Target & Faceted Diamond */}
            <circle cx="50" cy="50" r="18" fill="#4c1d95" stroke="#d8b4fe" strokeWidth="1.5" />
            <path
              d="M50 36L62 48L50 64L38 48L50 36Z"
              fill="#a855f7"
              stroke="#f3e8ff"
              strokeWidth="1.5"
            />
            <circle cx="50" cy="48" r="4" fill="#fdf4ff" />
            {/* Ribbon Label */}
            <rect x="25" y="74" width="50" height="13" rx="4" fill="#1e0a3d" stroke="#c084fc" strokeWidth="1.5" />
            <text x="50" y="83" fill="#f3e8ff" fontSize="8" fontWeight="900" textAnchor="middle" letterSpacing="1">
              EXPERT
            </text>
          </svg>
        </div>
      );

    case 'guardian':
      return (
        <div className="relative flex items-center justify-center" style={{ width: s, height: s }}>
          <svg
            width={s}
            height={s}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-[0_0_22px_rgba(245,158,11,0.6)] transition-transform group-hover:scale-105"
          >
            <defs>
              <linearGradient id="guardianGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="35%" stopColor="#eab308" />
                <stop offset="70%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <linearGradient id="sunCore" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            {/* Sunburst rays / golden wings */}
            <path
              d="M50 2L92 18V52C92 76 74 92 50 98C26 92 8 76 8 52V18L50 2Z"
              fill="url(#guardianGold)"
              stroke="#fef08a"
              strokeWidth="2.5"
            />
            {/* Inner Palace Shield */}
            <path
              d="M50 12L82 25V50C82 69 68 83 50 88C32 83 18 69 18 50V25L50 12Z"
              fill="#451a03"
              stroke="#fde047"
              strokeWidth="2"
            />
            {/* Imperial Crown Emblem */}
            <path
              d="M32 58L36 40L45 49L50 36L55 49L64 40L68 58H32Z"
              fill="url(#sunCore)"
              stroke="#fef9c3"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle cx="50" cy="35" r="3" fill="#fde047" />
            <circle cx="36" cy="39" r="2.5" fill="#fde047" />
            <circle cx="64" cy="39" r="2.5" fill="#fde047" />
            <circle cx="50" cy="51" r="3.5" fill="#ef4444" stroke="#fff" strokeWidth="1" />
            {/* Ribbon Label */}
            <rect x="23" y="74" width="54" height="13" rx="4" fill="#291102" stroke="#fde047" strokeWidth="1.5" />
            <text x="50" y="83" fill="#fef08a" fontSize="8" fontWeight="900" textAnchor="middle" letterSpacing="1">
              GUARDIAN
            </text>
          </svg>
        </div>
      );

    default:
      return null;
  }
};
