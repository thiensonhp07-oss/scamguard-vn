import React, { useState } from 'react';
import {
  X,
  Shield,
  Zap,
  Swords,
  Heart,
  Award,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { BossBattle } from '../data/campaignData';
import { playSuccessChime, playAlertWarning, playChestFanfare } from '../utils/audioEffects';
import confetti from 'canvas-confetti';

interface BossBattleRunnerProps {
  boss: BossBattle;
  isOpen: boolean;
  onClose: () => void;
  onVictory: (bossId: string, earnedXp: number, trophyName: string) => void;
}

export const BossBattleRunner: React.FC<BossBattleRunnerProps> = ({
  boss,
  isOpen,
  onClose,
  onVictory,
}) => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [playerHp, setPlayerHp] = useState(3);
  const [bossHp, setBossHp] = useState(100);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [combatLog, setCombatLog] = useState<string | null>(null);
  const [battleState, setBattleState] = useState<'intro' | 'fighting' | 'won' | 'lost'>('intro');

  if (!isOpen) return null;

  const currentPhase = boss.phases[currentPhaseIndex];
  const isLastPhase = currentPhaseIndex >= boss.phases.length - 1;

  const handleStartFight = () => {
    setBattleState('fighting');
  };

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
  };

  const handleExecuteCounterAttack = () => {
    if (!selectedOptionId || !currentPhase) return;
    const option = currentPhase.options.find((o) => o.id === selectedOptionId);
    if (!option) return;

    setIsAnswered(true);
    setCombatLog(option.feedback);

    if (option.isCorrect) {
      // Successful defense: Damage boss
      playSuccessChime();
      const damagePerPhase = Math.ceil(100 / boss.phases.length);
      const newBossHp = Math.max(0, bossHp - damagePerPhase);
      if (isLastPhase || newBossHp <= 0) {
        setBossHp(0);
      } else {
        setBossHp(newBossHp);
      }
    } else {
      // Failed defense: Player loses 1 shield
      playAlertWarning();
      const newPlayerHp = playerHp - 1;
      setPlayerHp(newPlayerHp);
      if (newPlayerHp <= 0) {
        setBattleState('lost');
      }
    }
  };

  const handleNextPhase = () => {
    const currentOpt = currentPhase?.options.find((o) => o.id === selectedOptionId);
    const wasCorrect = currentOpt?.isCorrect ?? false;

    // If answer was wrong but player still has shields, allow retrying this phase
    if (!wasCorrect) {
      setSelectedOptionId(null);
      setIsAnswered(false);
      setCombatLog(null);
      return;
    }

    // If boss is eliminated or final phase was correctly countered, trigger victory
    if (bossHp <= 0 || (isLastPhase && wasCorrect)) {
      setBossHp(0);
      setBattleState('won');
      playChestFanfare();
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 },
      });
      return;
    }

    // Move to next phase
    setCurrentPhaseIndex((prev) => prev + 1);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setCombatLog(null);
  };

  const handleClaimVictory = () => {
    onVictory(boss.id, boss.xpReward, boss.trophyName);
    onClose();
  };

  const handleRetry = () => {
    setCurrentPhaseIndex(0);
    setPlayerHp(3);
    setBossHp(100);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setCombatLog(null);
    setBattleState('fighting');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border-2 border-rose-500/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header HUD */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-950 via-rose-950/40 to-slate-950 border-b border-rose-900/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-black">
              <Swords className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 block">
                ĐẤU TRÙM KHU VỰC
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">{boss.bossName}</h3>
            </div>
          </div>

          {/* Player HP shields */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-slate-950/80 px-3 py-1.5 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 mr-1">Khiên Vệ Binh:</span>
              {[1, 2, 3].map((shieldNum) => (
                <Shield
                  key={shieldNum}
                  className={`w-4 h-4 transition-all ${
                    shieldNum <= playerHp
                      ? 'text-cyan-400 fill-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                      : 'text-slate-700'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          {/* STATE 1: INTRO SCREEN */}
          {battleState === 'intro' && (
            <div className="text-center py-6 space-y-6 animate-scale-up">
              <div className="relative inline-block">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-rose-600 via-purple-600 to-amber-500 p-1.5 shadow-2xl mx-auto flex items-center justify-center animate-bounce-subtle">
                  <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-6xl sm:text-7xl">
                    {boss.bossAvatar}
                  </div>
                </div>
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-rose-500 text-slate-950 font-black text-xs px-3 py-0.5 rounded-full shadow-lg uppercase whitespace-nowrap">
                  {boss.bossTitle}
                </div>
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                  {boss.bossName}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                  {boss.introStory}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-amber-300 max-w-md mx-auto flex items-center justify-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>
                  Đánh bại Trùm để nhận <strong>+{boss.xpReward} XP</strong> và{' '}
                  <strong>{boss.trophyName}</strong>!
                </span>
              </div>

              <button
                onClick={handleStartFight}
                className="btn-tactile btn-tactile-rose px-8 py-4 text-base font-black flex items-center justify-center space-x-2 shadow-2xl mx-auto cursor-pointer animate-pulse"
              >
                <Swords className="w-5 h-5" />
                <span>VÀO TRẬN KHIÊU CHIẾN NGAY</span>
              </button>
            </div>
          )}

          {/* STATE 2: ACTIVE COMBAT */}
          {battleState === 'fighting' && currentPhase && (
            <div className="space-y-6 animate-fade-in">
              {/* Boss HP Bar */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-rose-900/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{boss.bossAvatar}</span>
                    <div>
                      <span className="text-xs font-black text-rose-300">{boss.bossName}</span>
                      <span className="text-[10px] text-slate-400 block">
                        Đòn tấn công {currentPhaseIndex + 1}/{boss.phases.length}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-400">{bossHp} / 100 HP</span>
                </div>
                <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-rose-400 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${bossHp}%` }}
                  />
                </div>
              </div>

              {/* Boss Dialogue Speech Bubble */}
              <div className="relative p-5 rounded-3xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 border-2 border-rose-500/50 shadow-xl space-y-3">
                <div className="flex items-center space-x-2 text-rose-400 text-xs font-black uppercase tracking-wider">
                  <Flame className="w-4 h-4" />
                  <span>Kẻ địch tung chiêu thức:</span>
                </div>
                <blockquote className="text-base sm:text-lg font-bold text-white italic leading-snug">
                  "{currentPhase.bossQuote}"
                </blockquote>
                <p className="text-xs text-slate-400 font-medium">
                  <strong>Thủ đoạn: </strong>
                  {currentPhase.threatDescription}
                </p>

                {/* Evidence Mockup Card */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400 font-mono text-[10px]">
                    <span>NGUỒN: {currentPhase.incomingEvidence.sender}</span>
                    <span className="uppercase text-rose-400 font-bold">
                      {currentPhase.incomingEvidence.type}
                    </span>
                  </div>
                  <p className="text-slate-200 font-sans">{currentPhase.incomingEvidence.content}</p>
                </div>
              </div>

              {/* Player Counter Options */}
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-cyan-400 block">
                  Chọn Tuyệt Kỹ Phản Đòn Của Vệ Binh:
                </span>
                <div className="grid grid-cols-1 gap-3">
                  {currentPhase.options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    let style = 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-cyan-500/60';

                    if (isAnswered) {
                      if (opt.isCorrect) {
                        style = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-lg';
                      } else if (isSelected) {
                        style = 'bg-rose-950/80 border-rose-500 text-rose-200';
                      } else {
                        style = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-50';
                      }
                    } else if (isSelected) {
                      style = 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-md ring-2 ring-cyan-500/30';
                    }

                    return (
                      <button
                        key={opt.id}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(opt.id)}
                        className={`p-4 rounded-2xl border-2 text-left text-xs sm:text-sm font-semibold transition-all duration-200 flex items-start space-x-3 cursor-pointer ${style}`}
                      >
                        <div className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                          {isAnswered && opt.isCorrect ? '✓' : ''}
                        </div>
                        <span className="leading-relaxed">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Combat Log feedback after selection */}
              {isAnswered && combatLog && (
                <div
                  className={`p-4 rounded-2xl border-2 text-xs sm:text-sm font-bold flex items-start space-x-3 animate-scale-up ${
                    selectedOptionId &&
                    currentPhase.options.find((o) => o.id === selectedOptionId)?.isCorrect
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                  }`}
                >
                  <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span>{combatLog}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STATE 3: VICTORY SCREEN */}
          {battleState === 'won' && (
            <div className="text-center py-6 space-y-6 animate-scale-up">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-400 via-emerald-400 to-cyan-400 p-1 shadow-2xl mx-auto flex items-center justify-center text-5xl sm:text-6xl animate-pulse">
                {boss.trophyIcon}
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-700">
                  CHIẾN THẮNG TUYỆT ĐỐI
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">ĐÃ TIÊU DIỆT TRÙM!</h2>
                <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                  Bạn đã bẻ gãy mọi âm mưu và đòn tấn công tâm lý của <strong>{boss.bossName}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 max-w-sm mx-auto space-y-2">
                <div className="text-xs text-slate-400 uppercase font-bold">Vật Phẩm Vinh Danh</div>
                <div className="text-base font-black text-amber-400 flex items-center justify-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>{boss.trophyName}</span>
                </div>
                <div className="text-xs font-mono font-bold text-cyan-400">+{boss.xpReward} XP ĐÃ ĐƯỢC CỘNG VÀO HỒ SƠ</div>
              </div>

              <button
                onClick={handleClaimVictory}
                className="btn-tactile btn-tactile-emerald px-8 py-4 text-sm font-black flex items-center justify-center space-x-2 shadow-2xl mx-auto cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>NHẬN THƯỞNG & HOÀN THÀNH</span>
              </button>
            </div>
          )}

          {/* STATE 4: DEFEAT SCREEN */}
          {battleState === 'lost' && (
            <div className="text-center py-6 space-y-6 animate-scale-up">
              <div className="w-24 h-24 rounded-full bg-rose-950/80 border-2 border-rose-500 p-1 shadow-2xl mx-auto flex items-center justify-center text-5xl">
                💔
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <span className="text-xs font-black uppercase tracking-widest text-rose-400 bg-rose-950 px-3 py-1 rounded-full border border-rose-800">
                  KHIÊN PHÒNG THỦ ĐÃ VỠ
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">BẠN ĐÃ MẮC BẪY KẺ GIAN!</h2>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Đừng nản lòng! Hãy ôn lại các dấu hiệu đỏ và phục thù kẻ lừa đảo ngay lập tức.
                </p>
              </div>

              <button
                onClick={handleRetry}
                className="btn-tactile btn-tactile-rose px-8 py-4 text-sm font-black flex items-center justify-center space-x-2 shadow-2xl mx-auto cursor-pointer"
              >
                <Zap className="w-5 h-5" />
                <span>THỬ LẠI TRẬN ĐẤU TRÙM</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Action during fight */}
        {battleState === 'fighting' && (
          <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex justify-end">
            {!isAnswered ? (
              <button
                disabled={!selectedOptionId}
                onClick={handleExecuteCounterAttack}
                className={`btn-tactile w-full sm:w-auto px-6 py-3.5 text-xs sm:text-sm font-black flex items-center justify-center space-x-2 ${
                  selectedOptionId
                    ? 'btn-tactile-rose cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
                }`}
              >
                <Swords className="w-4 h-4" />
                <span>KÍCH HOẠT TUYỆT KỸ PHẢN ĐÒN</span>
              </button>
            ) : (
              (() => {
                const currentOpt = currentPhase?.options.find((o) => o.id === selectedOptionId);
                const wasCorrect = currentOpt?.isCorrect ?? false;

                if (!wasCorrect) {
                  return (
                    <button
                      onClick={handleNextPhase}
                      className="btn-tactile btn-tactile-rose w-full sm:w-auto px-6 py-3.5 text-xs sm:text-sm font-black flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>THỬ TUYỆT KỸ KHÁC (CÒN {playerHp} KHIÊN)</span>
                    </button>
                  );
                }

                return (
                  <button
                    onClick={handleNextPhase}
                    className="btn-tactile btn-tactile-emerald w-full sm:w-auto px-6 py-3.5 text-xs sm:text-sm font-black flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>{bossHp <= 0 || isLastPhase ? 'KẾT LIỄU TRẬN ĐẤU (CHIẾN THẮNG)' : 'SANG ĐỢT TẤN CÔNG TIẾP THEO'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                );
              })()
            )}
          </div>
        )}
      </div>
    </div>
  );
};
