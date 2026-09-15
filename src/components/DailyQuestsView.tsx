import React, { useState } from 'react';
import { Gift, Sparkles, Flame, CheckCircle2, Shield, Award, Package, Calendar, Check } from 'lucide-react';
import { DailyQuest, MysteryChestReward } from '../types';
import { playSuccessChime, playChestFanfare } from '../utils/audioEffects';
import confetti from 'canvas-confetti';

interface DailyQuestsViewProps {
  quests: DailyQuest[];
  onClaimQuest: (questId: string, xpReward: number, gemReward: number) => void;
  onOpenMysteryChest: (reward: MysteryChestReward) => void;
}

const MYSTERY_REWARDS: MysteryChestReward[] = [
  { id: 'rew_shield', type: 'shield', name: 'Khiên Bất Tử 24H', description: 'Bảo vệ chuỗi ngày luyện tập.', icon: '🛡️', amount: 1, rarity: 'rare' },
  { id: 'rew_xp_boost', type: 'xp', name: 'Túi Tinh Hoa Tri Thức', description: 'Cộng trực tiếp +250 XP.', icon: '⚡', amount: 250, rarity: 'common' },
  { id: 'rew_lens', type: 'lens', name: 'Thấu Kính Bóc Tách URL AI', description: 'Mở khóa phân tích sâu URL.', icon: '🔍', amount: 1, rarity: 'epic' },
];

const CHECK_IN_DAYS = [
  { day: 1, xp: 50, label: 'Ngày 1' },
  { day: 2, xp: 80, label: 'Ngày 2' },
  { day: 3, xp: 120, label: 'Ngày 3' },
  { day: 4, xp: 150, label: 'Ngày 4' },
  { day: 5, xp: 200, label: 'Ngày 5' },
  { day: 6, xp: 300, label: 'Ngày 6' },
  { day: 7, xp: 500, label: 'Ngày 7 (Đại Thưởng)' },
];

export const DailyQuestsView: React.FC<DailyQuestsViewProps> = ({
  quests,
  onClaimQuest,
  onOpenMysteryChest,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'quests' | 'chest'>('quests');
  const [isOpeningChest, setIsOpeningChest] = useState(false);
  const [openedReward, setOpenedReward] = useState<MysteryChestReward | null>(null);
  const [chestClaimedToday, setChestClaimedToday] = useState(false);

  // Daily check-in state
  const [currentStreakDay, setCurrentStreakDay] = useState<number>(3);
  const [checkedInToday, setCheckedInToday] = useState<boolean>(false);
  const [checkInModalToast, setCheckInModalToast] = useState<string | null>(null);

  const handleClaim = (quest: DailyQuest) => {
    onClaimQuest(quest.id, quest.xpReward);
    playSuccessChime();
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
  };

  const handleCheckIn = () => {
    if (checkedInToday) return;
    setCheckedInToday(true);
    const reward = CHECK_IN_DAYS[Math.min(CHECK_IN_DAYS.length - 1, currentStreakDay - 1)];
    onClaimQuest(`checkin_day_${currentStreakDay}`, reward.xp);
    playSuccessChime();
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
    setCheckInModalToast(`Điểm danh thành công Ngày ${currentStreakDay}! Nhận +${reward.xp} XP và Khiên Bảo Vệ.`);
  };

  const handleSpinChest = () => {
    if (chestClaimedToday || isOpeningChest) return;
    setIsOpeningChest(true);

    setTimeout(() => {
      const selected = MYSTERY_REWARDS[Math.floor(Math.random() * MYSTERY_REWARDS.length)];
      setOpenedReward(selected);
      setIsOpeningChest(false);
      setChestClaimedToday(true);
      onOpenMysteryChest(selected);
      playChestFanfare();
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg">
            <Flame className="w-8 h-8 fill-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Nhiệm Vụ & Điểm Danh Hàng Ngày</h1>
            <p className="text-sm text-slate-400 mt-1">
              Điểm danh mỗi ngày và hoàn thành nhiệm vụ để nhận XP, đá quý và giữ chuỗi bảo vệ phòng tuyến số.
            </p>
          </div>
        </div>

        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveSubTab('quests')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeSubTab === 'quests' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Nhiệm Vụ & Điểm Danh</span>
          </button>
          <button
            onClick={() => setActiveSubTab('chest')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeSubTab === 'chest' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Rương Tiếp Tế</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'quests' ? (
        <div className="space-y-6">
          {/* Daily Check-in Card */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 bg-slate-900/95 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Điểm Danh An Ninh 7 Ngày</h2>
                  <p className="text-xs text-slate-400">Điểm danh đều đặn mỗi ngày để nhận quà thưởng giá trị lớn dần</p>
                </div>
              </div>

              <button
                onClick={handleCheckIn}
                disabled={checkedInToday}
                className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer ${
                  checkedInToday
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 cursor-default'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white'
                }`}
              >
                {checkedInToday ? '✓ Đã Điểm Danh Hôm Nay' : 'Điểm Danh Ngay (+XP & Gems)'}
              </button>
            </div>

            {checkInModalToast && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs font-bold animate-fadeIn">
                {checkInModalToast}
              </div>
            )}

            {/* 7 Days Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
              {CHECK_IN_DAYS.map((d) => {
                const isPassed = d.day < currentStreakDay || (d.day === currentStreakDay && checkedInToday);
                const isCurrent = d.day === currentStreakDay && !checkedInToday;

                return (
                  <div
                    key={d.day}
                    className={`p-3 rounded-2xl border flex flex-col items-center text-center relative overflow-hidden transition-all ${
                      isPassed
                        ? 'bg-emerald-950/30 border-emerald-700/50 text-emerald-300'
                        : isCurrent
                        ? 'bg-cyan-950/60 border-cyan-500 shadow-lg ring-2 ring-cyan-500/40 text-white animate-pulse'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-[11px] font-bold uppercase">{d.label}</span>
                    <span className="text-xl my-1.5">{d.day === 7 ? '👑' : '⚡'}</span>
                    <span className="text-xs font-mono font-black text-amber-400">+{d.xp} XP</span>
                    <span className="text-[10px] font-mono text-cyan-300">Khiên 24h</span>
                    {isPassed && (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[1px] flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quests Header */}
          <div className="flex items-center justify-between pt-2">
            <h2 className="text-lg font-black text-white">Nhiệm Vụ An Ninh Hằng Ngày</h2>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-800">
              Làm mới sau 14h nữa
            </span>
          </div>

          <div className="space-y-4">
            {quests.map((q) => {
              const isFinished = q.current >= q.target;
              const canClaim = isFinished && !q.claimed;

              return (
                <div
                  key={q.id}
                  className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0 ${
                        q.claimed
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                          : isFinished
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {q.claimed ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : '🎯'}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{q.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{q.description}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {q.current} / {q.target}
                        </span>
                        <div className="w-32 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${Math.min(100, (q.current / q.target) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                    <div className="text-right">
                      <span className="text-sm font-black text-cyan-300 font-mono">+{q.xpReward} XP</span>
                    </div>
                    {q.claimed ? (
                      <span className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs">Đã Nhận</span>
                    ) : canClaim ? (
                      <button
                        onClick={() => handleClaim(q)}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase shadow-lg transition-all cursor-pointer"
                      >
                        Nhận Thưởng
                      </button>
                    ) : (
                      <span className="px-4 py-2 rounded-xl bg-slate-950 text-slate-500 font-bold text-xs border border-slate-800">
                        Đang Thực Hiện
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-8 border border-slate-800 bg-slate-900/90 text-center space-y-6 shadow-xl max-w-xl mx-auto">
          <div className="w-24 h-24 rounded-3xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-4xl mx-auto shadow-xl animate-bounce">
            🎁
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Rương Tiếp Tế Bí Ẩn Hằng Ngày</h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Mỗi ngày mở rương một lần để nhận các vật phẩm an ninh đặc biệt, tăng điểm kinh nghiệm và khiên bảo vệ.
            </p>
          </div>

          {openedReward ? (
            <div className="p-6 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3 animate-fadeIn">
              <span className="text-4xl">{openedReward.icon}</span>
              <h3 className="text-lg font-black text-amber-400">{openedReward.name}</h3>
              <p className="text-xs text-slate-300">{openedReward.description}</p>
              <p className="text-xs font-bold text-cyan-300">Đã cộng vào tài khoản của bạn!</p>
            </div>
          ) : (
            <button
              onClick={handleSpinChest}
              disabled={isOpeningChest || chestClaimedToday}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-xl transition-all cursor-pointer ${
                chestClaimedToday
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950'
              }`}
            >
              {isOpeningChest ? 'Đang Mở Rương...' : chestClaimedToday ? 'Đã Nhận Hôm Nay' : 'Mở Rương Ngay'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
