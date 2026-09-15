import React, { useState, useEffect } from 'react';
import {
  Swords,
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  Flame,
  Zap,
  Shield,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react';
import { FriendUser, FriendDuelQuestion, UserProfile } from '../types';
import { DUEL_QUESTIONS_POOL } from '../data/friendsData';
import { playSuccessChime, playAlertWarning, playChestFanfare } from '../utils/audioEffects';
import { handleAvatarError } from '../utils/avatarFallback';
import confetti from 'canvas-confetti';

interface FriendDuelModalProps {
  isOpen: boolean;
  onClose: () => void;
  friend: FriendUser | null;
  userProfile: UserProfile;
  onEarnXp: (amount: number) => void;
}

export const FriendDuelModal: React.FC<FriendDuelModalProps> = ({
  isOpen,
  onClose,
  friend,
  userProfile,
  onEarnXp,
}) => {
  const [questions, setQuestions] = useState<FriendDuelQuestion[]>(DUEL_QUESTIONS_POOL);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [friendScore, setFriendScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);

  // Initialize or reset duel session
  useEffect(() => {
    if (isOpen && friend) {
      setQuestions([...DUEL_QUESTIONS_POOL].sort(() => Math.random() - 0.5));
      setCurrentIndex(0);
      setUserScore(0);
      setFriendScore(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(60);
      setIsGameOver(false);
    }
  }, [isOpen, friend]);

  // Keep ref of latest scores for timer expiration
  const userScoreRef = React.useRef(0);
  const friendScoreRef = React.useRef(0);
  userScoreRef.current = userScore;
  friendScoreRef.current = friendScore;

  // Countdown timer
  useEffect(() => {
    if (!isOpen || isGameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishDuel(userScoreRef.current, friendScoreRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isGameOver]);

  if (!isOpen || !friend) return null;

  const currentQ = questions[currentIndex];

  const finishDuel = (finalUserScore: number, finalFriendScore: number) => {
    setIsGameOver(true);
    if (finalUserScore > finalFriendScore) {
      onEarnXp(150);
      playChestFanfare();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
      });
    } else if (finalUserScore === finalFriendScore) {
      onEarnXp(100);
      playSuccessChime();
    } else {
      onEarnXp(50);
      playAlertWarning();
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered || isGameOver) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = currentQ.options[idx].isCorrect;
    const gainedPoints = isCorrect ? 100 : 0;
    const newUserScore = userScore + gainedPoints;
    setUserScore(newUserScore);

    // Friend simulated reaction
    const friendSuccessChance = Math.min(0.85, Math.max(0.4, (friend.overallScore || 75) / 100));
    const friendGained = Math.random() < friendSuccessChance ? 100 : 0;
    const newFriendScore = friendScore + friendGained;
    setFriendScore(newFriendScore);

    if (isCorrect) {
      playSuccessChime();
    } else {
      playAlertWarning();
    }

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        finishDuel(newUserScore, newFriendScore);
      }
    }, 1200);
  };

  const isUserWinner = userScore > friendScore;
  const isDraw = userScore === friendScore;

  return (
    <div
      id="friend-duel-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
    >
      <div
        id="friend-duel-modal-container"
        className="bg-slate-900 border-2 border-cyan-500/50 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden my-auto flex flex-col"
      >
        {/* Duel Header with 2 Players */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between relative">
          {/* User Side */}
          <div className="flex items-center space-x-3 min-w-0">
            <img
              src={
                userProfile?.avatarUrl ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
              }
              alt="You"
              referrerPolicy="no-referrer"
              onError={(e) => handleAvatarError(e, userProfile?.name || 'Bạn')}
              className="w-11 h-11 rounded-full object-cover border-2 border-cyan-400"
            />
            <div className="min-w-0">
              <span className="text-xs font-black text-cyan-300 block truncate">{userProfile?.name || 'Bạn'}</span>
              <span className="text-base font-black text-white">{userScore} đ</span>
            </div>
          </div>

          {/* Center VS & Timer */}
          <div className="text-center px-2">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center mx-auto shadow-md">
              <Swords className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-center space-x-1 text-xs font-mono font-bold text-amber-400 mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{timeLeft}s</span>
            </div>
          </div>

          {/* Friend Side */}
          <div className="flex items-center space-x-3 text-right min-w-0">
            <div className="min-w-0">
              <span className="text-xs font-black text-amber-300 block truncate">{friend?.name || 'Đối Thủ'}</span>
              <span className="text-base font-black text-white">{friendScore} đ</span>
            </div>
            <img
              src={friend?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
              alt={friend?.name || 'Đối Thủ'}
              referrerPolicy="no-referrer"
              onError={(e) => handleAvatarError(e, friend?.name || 'Đối Thủ')}
              className="w-11 h-11 rounded-full object-cover border-2 border-amber-400"
            />
          </div>

          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Question & Answers or Game Over Screen */}
        <div className="p-6 space-y-6">
          {!isGameOver ? (
            <>
              {/* Question Progress */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>Câu hỏi {currentIndex + 1}/{questions.length}</span>
                <span className="text-cyan-400 font-semibold">{currentQ.sender}</span>
              </div>

              {/* Scenario Box */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 text-[10px] font-black bg-rose-950 text-rose-300 border border-rose-800 rounded">
                    TÌNH HUỐNG LỪA ĐẢO
                  </span>
                  <h4 className="text-sm font-bold text-white">{currentQ.title}</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-mono bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                  "{currentQ.scenario}"
                </p>
              </div>

              {/* Multiple Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isChosen = selectedOption === idx;
                  const isCorrect = opt.isCorrect;

                  let btnStyle = 'bg-slate-950/80 border-slate-800 hover:border-cyan-500 text-slate-200';
                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-bold shadow-lg shadow-emerald-950/50';
                    } else if (isChosen && !isCorrect) {
                      btnStyle = 'bg-rose-950/70 border-rose-500 text-rose-200 font-bold';
                    } else {
                      btnStyle = 'opacity-40 border-slate-800 text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span>{opt.label}</span>
                      {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 ml-2" />}
                      {isAnswered && isChosen && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* GAME OVER SUMMARY */
            <div className="text-center space-y-6 py-4 animate-scale-up">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 via-amber-400 to-emerald-400 p-1 shadow-2xl mx-auto flex items-center justify-center text-4xl animate-bounce">
                {isUserWinner ? '🏆' : isDraw ? '🤝' : '⚔️'}
              </div>

              <div className="space-y-2">
                <span
                  className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                    isUserWinner
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : isDraw
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                      : 'bg-amber-950 text-amber-300 border-amber-700'
                  }`}
                >
                  {isUserWinner
                    ? 'CHIẾN THẮNG ÁP ĐẢO'
                    : isDraw
                    ? 'HÒA NHAU NGANG SỨC'
                    : 'RÈN LUYỆN THÊM'}
                </span>
                <h3 className="text-2xl font-black text-white">
                  {isUserWinner
                    ? `Bạn đã đánh bại ${friend?.name || 'Đối thủ'}!`
                    : isDraw
                    ? `Hai chiến binh an ninh mạng cân tài cân sức!`
                    : `${friend?.name || 'Đối thủ'} tạm dẫn trước lần này!`}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
                  Bạn ghi được <strong>{userScore} điểm</strong> ({userScore / 100}/{questions.length} câu đúng), trong khi {friend?.name || 'Đối thủ'} ghi được <strong>{friendScore} điểm</strong>.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Kinh Nghiệm</span>
                  <span className="text-base font-black text-cyan-400">+{isUserWinner ? 150 : isDraw ? 100 : 50} XP</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Huy Hiệu Đấu</span>
                  <span className="text-base font-black text-amber-400">🛡️ Vệ Binh PvP</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setQuestions([...DUEL_QUESTIONS_POOL].sort(() => Math.random() - 0.5));
                    setCurrentIndex(0);
                    setUserScore(0);
                    setFriendScore(0);
                    setSelectedOption(null);
                    setIsAnswered(false);
                    setTimeLeft(60);
                    setIsGameOver(false);
                  }}
                  className="flex-1 btn-tactile btn-tactile-slate py-3 text-xs font-bold flex items-center justify-center space-x-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Tái Đấu Ngay</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 btn-tactile btn-tactile-cyan py-3 text-xs font-bold"
                >
                  Hoàn Tất & Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
