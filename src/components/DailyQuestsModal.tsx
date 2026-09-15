import React, { useState } from 'react';
import {
  CheckCircle2,
  Gift,
  Sparkles,
  Zap,
  Flame,
  X,
  Award,
  Shield,
  Search,
  Swords,
  Users,
  Star,
  RefreshCw,
} from 'lucide-react';
import { DailyQuest, MysteryChestReward, UserProfile } from '../types';
import { playSuccessChime, playChestFanfare } from '../utils/audioEffects';
import confetti from 'canvas-confetti';

interface DailyQuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  quests: DailyQuest[];
  onClaimQuest: (questId: string, xpReward: number) => void;
  onOpenMysteryChest: (reward: MysteryChestReward) => void;
}

const MYSTERY_REWARDS: MysteryChestReward[] = [
  {
    id: 'rew_shield',
    type: 'shield',
    name: 'Khiên Bất Tử 24H',
    description: 'Bảo vệ chuỗi ngày luyện tập không bị đứt đoạn ngay cả khi bận rộn.',
    icon: '🛡️',
    amount: 1,
    rarity: 'rare',
  },
  {
    id: 'rew_xp_boost',
    type: 'xp',
    name: 'Túi Tinh Hoa Tri Thức',
    description: 'Cộng trực tiếp +250 XP vào hồ sơ Vệ Binh An Ninh.',
    icon: '⚡',
    amount: 250,
    rarity: 'common',
  },
  {
    id: 'rew_lens',
    type: 'lens',
    name: 'Thấu Kính Bóc Tách URL AI',
    description: 'Mở khóa phân tích sâu tên miền lừa đảo ẩn danh & chứng chỉ SSL.',
    icon: '🔍',
    amount: 1,
    rarity: 'epic',
  },
];

export const DailyQuestsModal: React.FC<DailyQuestsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  quests,
  onClaimQuest,
  onOpenMysteryChest,
}) => {
  const [activeTab, setActiveTab] = useState<'quests' | 'chest'>('quests');
  const [isOpeningChest, setIsOpeningChest] = useState(false);
  const [openedReward, setOpenedReward] = useState<MysteryChestReward | null>(null);
  const [chestClaimedToday, setChestClaimedToday] = useState(false);

  if (!isOpen) return null;

  const completedCount = quests.filter((q) => q.completed).length;

  const handleClaim = (quest: DailyQuest) => {
    onClaimQuest(quest.id, quest.xpReward);
    playSuccessChime();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
    });
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
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 },
      });
    }, 1200);
  };

  return (
    <div
      id="daily-quests-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="daily-quests-modal-container"
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold">
              <Flame className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Nhiệm Vụ Vệ Binh & Rương May Mắn</h2>
              <p className="text-xs text-slate-400">
                Làm mới mỗi ngày lúc 00:00 • Hoàn thành để tăng hạng Vệ Binh
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex p-2 bg-slate-950/70 border-b border-slate-800 gap-1.5">
          <button
            onClick={() => setActiveTab('quests')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'quests'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>3 Nhiệm Vụ Hàng Ngày ({completedCount}/3)</span>
          </button>

          <button
            onClick={() => setActiveTab('chest')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'chest'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Rương Tiếp Tế May Mắn</span>
          </button>
        </div>

        {/* Contents */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          {activeTab === 'quests' && (
            <div className="space-y-3">
              {/* Daily Progress Bar */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">Tiến độ hôm nay</span>
                  <span className="font-black text-amber-400">{completedCount}/3 Hoàn thành</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${(completedCount / 3) * 100}%` }}
                  />
                </div>
              </div>

              {/* Quests List */}
              {quests.map((quest) => (
                <div
                  key={quest.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    quest.claimed
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                      : quest.completed
                      ? 'bg-amber-950/30 border-amber-500/60 shadow-lg'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl flex-shrink-0">
                      {quest.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">{quest.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{quest.description}</p>
                      <div className="flex items-center space-x-2 mt-1 text-[10px] text-amber-400 font-bold">
                        <span>+{quest.xpReward} XP</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {quest.claimed ? (
                      <span className="px-3 py-1.5 text-xs font-bold bg-slate-800 text-slate-400 rounded-xl flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Đã Nhận</span>
                      </span>
                    ) : quest.completed ? (
                      <button
                        onClick={() => handleClaim(quest)}
                        className="btn-tactile btn-tactile-amber px-4 py-2 text-xs font-black shadow-md cursor-pointer animate-bounce-subtle"
                      >
                        Nhận Thưởng
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                        {quest.current}/{quest.target}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'chest' && (
            <div className="text-center space-y-6 py-2">
              {!openedReward ? (
                <>
                  <div
                    className={`relative inline-block ${
                      !chestClaimedToday ? 'cursor-pointer hover:scale-105 transition-transform' : ''
                    }`}
                    onClick={handleSpinChest}
                  >
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-300 p-1 shadow-2xl flex items-center justify-center text-6xl mx-auto animate-pulse">
                      {isOpeningChest ? '✨' : '🎁'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-950 px-3 py-1 rounded-full border border-amber-800">
                      RƯƠNG TIẾP TẾ MAY MẮN HÀNG NGÀY
                    </span>
                    <h3 className="text-xl font-black text-white">
                      {isOpeningChest ? 'Đang giải mã phần thưởng...' : 'Mở Rương Tiếp Tế Hôm Nay'}
                    </h3>
                    <p className="text-xs text-slate-300 max-w-sm mx-auto">
                      Mỗi 24 giờ, bạn có thể mở 1 rương tiếp tế miễn phí nhận Khiên Bất Tử hoặc Tinh Hoa Điểm XP!
                    </p>
                  </div>

                  <button
                    onClick={handleSpinChest}
                    disabled={chestClaimedToday || isOpeningChest}
                    className="btn-tactile btn-tactile-amber px-8 py-3.5 text-xs sm:text-sm font-black mx-auto shadow-2xl disabled:opacity-50 cursor-pointer"
                  >
                    {isOpeningChest ? (
                      <span className="flex items-center space-x-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Đang Mở...</span>
                      </span>
                    ) : chestClaimedToday ? (
                      'Đã Nhận Rương Hôm Nay'
                    ) : (
                      'MỞ RƯƠNG TIẾP TẾ NGAY'
                    )}
                  </button>
                </>
              ) : (
                <div className="space-y-5 animate-scale-up">
                  <div className="w-24 h-24 rounded-3xl bg-slate-950 border-2 border-amber-400 p-2 shadow-2xl mx-auto flex items-center justify-center text-5xl">
                    {openedReward.icon}
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                      PHẦN THƯỞNG ĐÃ ĐƯỢC THÊM VÀO TÚI
                    </span>
                    <h3 className="text-xl font-black text-white">{openedReward.name}</h3>
                    <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                      {openedReward.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setOpenedReward(null);
                      onClose();
                    }}
                    className="btn-tactile btn-tactile-cyan px-8 py-3 text-xs font-black mx-auto"
                  >
                    Trang Bị & Tiếp Tục
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
