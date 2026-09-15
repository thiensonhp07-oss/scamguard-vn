import React, { useState, useEffect } from 'react';
import {
  X,
  Zap,
  Timer,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { SpeedReflexChallenge, SpeedReflexItem } from '../data/campaignData';
import { playSuccessChime, playAlertWarning, playChestFanfare } from '../utils/audioEffects';
import confetti from 'canvas-confetti';

interface SpeedReflexRunnerProps {
  challenge: SpeedReflexChallenge;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (challengeId: string, earnedXp: number, badgeName: string) => void;
}

export const SpeedReflexRunner: React.FC<SpeedReflexRunnerProps> = ({
  challenge,
  isOpen,
  onClose,
  onComplete,
}) => {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'result'>('ready');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(challenge.durationSeconds || 25);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [answers, setAnswers] = useState<{ item: SpeedReflexItem; chosenScam: boolean; isCorrect: boolean }[]>([]);
  const [feedbackEffect, setFeedbackEffect] = useState<'correct' | 'wrong' | null>(null);

  // Timer countdown during playing
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      setGameState('result');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('result');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  if (!isOpen) return null;

  const currentItem = challenge.items[currentIndex];

  const handleStartGame = () => {
    setGameState('playing');
    setCurrentIndex(0);
    setTimeLeft(challenge.durationSeconds || 25);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setAnswers([]);
    setFeedbackEffect(null);
  };

  const handleAnswer = (isScamChosen: boolean) => {
    if (gameState !== 'playing' || !currentItem) return;

    const isCorrect = isScamChosen === currentItem.isScam;
    const newCombo = isCorrect ? combo + 1 : 0;
    const addedScore = isCorrect ? 20 + newCombo * 5 : 0;

    if (isCorrect) {
      playSuccessChime();
    } else {
      playAlertWarning();
    }

    setCombo(newCombo);
    if (newCombo > maxCombo) setMaxCombo(newCombo);
    setScore((prev) => prev + addedScore);

    const updatedAnswers = [
      ...answers,
      { item: currentItem, chosenScam: isScamChosen, isCorrect },
    ];
    setAnswers(updatedAnswers);

    setFeedbackEffect(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => setFeedbackEffect(null), 400);

    if (currentIndex + 1 >= challenge.items.length) {
      setGameState('result');
      const finalPassed = updatedAnswers.filter((a) => a.isCorrect).length >= Math.ceil(challenge.items.length * 0.6);
      if (finalPassed) {
        playChestFanfare();
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
        });
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleFinish = () => {
    onComplete(challenge.id, challenge.xpReward, challenge.badgeName);
    onClose();
  };

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const isPassed = correctCount >= Math.ceil(challenge.items.length * 0.6);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-amber-500/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header HUD */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-950 via-amber-950/40 to-slate-950 border-b border-amber-900/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black">
              <Zap className="w-5 h-5 animate-bounce-subtle" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
                THỬ THÁCH PHẢN XẠ NHANH
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">{challenge.title}</h3>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {gameState === 'playing' && (
              <div
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold ${
                  timeLeft <= 5
                    ? 'bg-rose-950 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-slate-950 border-slate-800 text-amber-300'
                }`}
              >
                <Timer className="w-3.5 h-3.5" />
                <span>{timeLeft}s</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          {/* READY STATE */}
          {gameState === 'ready' && (
            <div className="text-center py-6 space-y-6 animate-scale-up">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 p-1 shadow-2xl mx-auto flex items-center justify-center text-5xl">
                ⚡
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="text-2xl font-black text-white">{challenge.title}</h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  {challenge.subtitle}. Bạn có <strong>{challenge.durationSeconds} giây</strong> để
                  phân loại chính xác <strong>{challenge.items.length} cạm bẫy</strong>!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto text-left text-xs">
                <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <span>Nút Xanh: An Toàn</span>
                </div>
                <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-300 flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>Nút Đỏ: Lừa Đảo</span>
                </div>
              </div>

              <button
                onClick={handleStartGame}
                className="btn-tactile btn-tactile-amber px-8 py-4 text-sm font-black flex items-center justify-center space-x-2 shadow-2xl mx-auto cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>BẮT ĐẦU ĐẾM NGƯỢC</span>
              </button>
            </div>
          )}

          {/* PLAYING STATE */}
          {gameState === 'playing' && currentItem && (
            <div className="space-y-6 animate-fade-in">
              {/* Progress & Combo bar */}
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">
                  Câu hỏi {currentIndex + 1} / {challenge.items.length}
                </span>
                <div className="flex items-center space-x-2">
                  {combo > 1 && (
                    <span className="text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-700 flex items-center space-x-1 animate-bounce-subtle">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" />
                      <span>x{combo} Combo!</span>
                    </span>
                  )}
                  <span className="text-cyan-400 font-mono">Điểm: {score}</span>
                </div>
              </div>

              {/* Threat Card */}
              <div
                className={`p-6 sm:p-8 rounded-3xl bg-slate-950 border-2 transition-all duration-300 shadow-2xl relative overflow-hidden space-y-4 ${
                  feedbackEffect === 'correct'
                    ? 'border-emerald-500 bg-emerald-950/30'
                    : feedbackEffect === 'wrong'
                    ? 'border-rose-500 bg-rose-950/30'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold uppercase tracking-widest text-amber-400 bg-amber-950/90 px-3 py-1 rounded-full border border-amber-800">
                    {currentItem.header}
                  </span>
                  <span className="font-mono text-slate-500 uppercase">{currentItem.type}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-sm sm:text-base text-slate-100 break-words leading-relaxed select-none">
                  {currentItem.content}
                </div>

                <p className="text-xs text-slate-400 text-center font-medium">
                  Phân tích nhanh: Đây là nguồn tin <strong>AN TOÀN</strong> hay{' '}
                  <strong>LỪA ĐẢO</strong>?
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnswer(false)}
                  className="btn-tactile btn-tactile-emerald py-5 text-sm sm:text-base font-black flex items-center justify-center space-x-2 shadow-xl cursor-pointer hover:scale-102"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>AN TOÀN</span>
                </button>

                <button
                  onClick={() => handleAnswer(true)}
                  className="btn-tactile btn-tactile-rose py-5 text-sm sm:text-base font-black flex items-center justify-center space-x-2 shadow-xl cursor-pointer hover:scale-102"
                >
                  <ShieldAlert className="w-5 h-5" />
                  <span>LỪA ĐẢO 🚩</span>
                </button>
              </div>
            </div>
          )}

          {/* RESULT STATE */}
          {gameState === 'result' && (
            <div className="space-y-6 animate-scale-up">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-500 p-1 shadow-2xl mx-auto flex items-center justify-center text-4xl">
                  {isPassed ? '🏆' : '⏱️'}
                </div>
                <h2 className="text-2xl font-black text-white">
                  {isPassed ? 'HOÀN THÀNH THỬ THÁCH!' : 'CHƯA ĐẠT ĐIỂM YÊU CẦU'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Bạn trả lời đúng <strong>{correctCount} / {challenge.items.length}</strong> câu
                  (Đạt {score} điểm • Combo cao nhất x{maxCombo}).
                </p>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {answers.map((ans, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border text-xs flex items-start space-x-2.5 ${
                      ans.isCorrect
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-800 text-rose-200'
                    }`}
                  >
                    <span className="mt-0.5 font-black">{ans.isCorrect ? '✓' : '✗'}</span>
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-200 line-clamp-1">
                        {ans.item.content}
                      </div>
                      <p className="text-[11px] text-slate-400">{ans.item.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>

              {isPassed ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <div className="text-xs text-slate-400 uppercase font-bold">Phần Thưởng Mở Khóa</div>
                  <div className="text-sm font-black text-amber-400 flex items-center justify-center space-x-1.5">
                    <Award className="w-4 h-4" />
                    <span>{challenge.badgeName}</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-cyan-400">
                    +{challenge.xpReward} XP ĐÃ CỘNG
                  </div>
                </div>
              ) : null}

              <div className="flex gap-3">
                <button
                  onClick={handleStartGame}
                  className="btn-tactile bg-slate-800 text-slate-200 border-slate-700 flex-1 py-3 text-xs sm:text-sm font-bold cursor-pointer"
                >
                  Chơi Lại
                </button>

                {isPassed && (
                  <button
                    onClick={handleFinish}
                    className="btn-tactile btn-tactile-emerald flex-1 py-3 text-xs sm:text-sm font-black flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Nhận Thưởng</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
