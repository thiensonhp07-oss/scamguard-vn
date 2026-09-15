import React, { useState } from 'react';
import { X, Gift, Sparkles, Award, CheckCircle2, Star, Zap } from 'lucide-react';
import { SupplyChest } from '../data/campaignData';

interface SupplyChestModalProps {
  chest: SupplyChest;
  isOpen: boolean;
  onClose: () => void;
  onClaim: (chestId: string, earnedXp: number, artifactName: string) => void;
}

export const SupplyChestModal: React.FC<SupplyChestModalProps> = ({
  chest,
  isOpen,
  onClose,
  onClaim,
}) => {
  const [isOpened, setIsOpened] = useState(false);

  if (!isOpen) return null;

  const handleOpenChest = () => {
    setIsOpened(true);
  };

  const handleClaimReward = () => {
    onClaim(chest.id, chest.xpReward, chest.artifactName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-amber-500/60 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isOpened ? (
          <div className="space-y-6 py-4 animate-scale-up">
            <div className="relative inline-block cursor-pointer group" onClick={handleOpenChest}>
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-300 p-1 shadow-2xl flex items-center justify-center text-6xl group-hover:scale-110 transition-transform animate-bounce-subtle">
                🎁
              </div>
              <div className="absolute -inset-4 bg-amber-400/20 rounded-full blur-xl animate-pulse pointer-events-none" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-950 px-3 py-1 rounded-full border border-amber-700">
                RƯƠNG TIẾP TẾ CỘT MỐC
              </span>
              <h3 className="text-2xl font-black text-white">{chest.chestName}</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Nhấn mở để thu thập vật phẩm cổ vật bí truyền & điểm kinh nghiệm XP!
              </p>
            </div>

            <button
              onClick={handleOpenChest}
              className="btn-tactile btn-tactile-amber px-8 py-4 text-sm font-black flex items-center justify-center space-x-2 shadow-2xl mx-auto cursor-pointer animate-pulse"
            >
              <Gift className="w-5 h-5" />
              <span>MỞ KHÓA RƯƠNG THẦN</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6 py-4 animate-scale-up">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-cyan-400 via-emerald-400 to-amber-400 p-1 shadow-2xl mx-auto flex items-center justify-center text-5xl sm:text-6xl animate-pulse">
              {chest.artifactIcon}
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-700">
                ĐÃ MỞ RƯƠNG THÀNH CÔNG
              </span>
              <h3 className="text-2xl font-black text-white">{chest.artifactName}</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                {chest.artifactDescription}
              </p>
            </div>

            <div className="max-w-xs mx-auto">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Điểm Kinh Nghiệm Thưởng</span>
                <span className="text-base font-black text-cyan-400">+{chest.xpReward} XP & 1x Khiên Bảo Vệ</span>
              </div>
            </div>

            <button
              onClick={handleClaimReward}
              className="btn-tactile btn-tactile-emerald px-8 py-4 text-sm font-black flex items-center justify-center space-x-2 shadow-2xl mx-auto cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>TRANG BỊ VẬT PHẨM & TIẾP TỤC</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
