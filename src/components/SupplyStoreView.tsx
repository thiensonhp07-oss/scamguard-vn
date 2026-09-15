import React, { useState } from 'react';
import { ShoppingBag, Shield, Zap, Sparkles, Flame, Check, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { playSuccessChime, playRewardTrophy } from '../utils/audioEffects';

interface SupplyStoreViewProps {
  userProfile: UserProfile;
  onEquipStreakFreeze?: () => void;
  onEarnXp?: (amount: number) => void;
}

interface StoreItem {
  id: string;
  name: string;
  description: string;
  requiredStreak: number;
  icon: string;
  category: 'shield' | 'boost' | 'cosmetic';
}

const STORE_ITEMS: StoreItem[] = [
  { id: 'item_streak_shield', name: 'Khiên Bất Tử Chuỗi Ngày', description: 'Tự động bảo toàn chuỗi ngày streak của bạn khi có sự cố bận rộn 1 ngày.', requiredStreak: 3, icon: '🛡️', category: 'shield' },
  { id: 'item_xp_double', name: 'Gói Nhân Đôi XP (24H)', description: 'Tăng tốc kinh nghiệm giám định lừa đảo trong mọi bài học và đấu trường.', requiredStreak: 5, icon: '⚡', category: 'boost' },
  { id: 'item_ai_lens', name: 'Thấu Kính URL & QR AI', description: 'Kích hoạt bộ lọc chuyên sâu giải mã cấu trúc liên kết và mã QR giả mạo.', requiredStreak: 7, icon: '🔍', category: 'boost' },
  { id: 'item_avatar_cyber', name: 'Huy Hiệu Vệ Binh Kim Cương', description: 'Huy hiệu danh dự vinh danh chuỗi phòng thủ bền bỉ trên bảng xếp hạng.', requiredStreak: 10, icon: '💎', category: 'cosmetic' },
];

export const SupplyStoreView: React.FC<SupplyStoreViewProps> = ({
  userProfile,
  onEquipStreakFreeze,
  onEarnXp,
}) => {
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [purchaseToast, setPurchaseToast] = useState<{ message: string; success: boolean } | null>(null);

  const streakDays = userProfile.streakDays || 1;

  const handleClaim = (item: StoreItem) => {
    if (purchasedItems.includes(item.id)) return;

    if (streakDays < item.requiredStreak) {
      setPurchaseToast({
        message: `Cần đạt chuỗi ${item.requiredStreak} ngày Streak để mở khóa (Hiện có ${streakDays} ngày).`,
        success: false,
      });
      setTimeout(() => setPurchaseToast(null), 3000);
      return;
    }

    if (item.id === 'item_streak_shield' && onEquipStreakFreeze) {
      onEquipStreakFreeze();
    } else if (item.id === 'item_xp_double' && onEarnXp) {
      onEarnXp(100);
    }

    setPurchasedItems((prev) => [...prev, item.id]);
    playSuccessChime();
    setPurchaseToast({
      message: `Đã mở khóa và trang bị thành công: ${item.name}!`,
      success: true,
    });
    setTimeout(() => setPurchaseToast(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6 animate-fadeIn relative">
      {/* Toast Notification */}
      {purchaseToast && (
        <div className={`fixed bottom-20 right-6 z-50 p-4 rounded-2xl border shadow-2xl flex items-center space-x-3 transition-all animate-bounce ${
          purchaseToast.success
            ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300'
            : 'bg-rose-950/90 border-rose-500 text-rose-300'
        }`}>
          {purchaseToast.success ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          )}
          <span className="text-xs font-black">{purchaseToast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Trạm Kỹ Năng & Tiếp Tế Vệ Binh</h1>
            <p className="text-sm text-slate-400 mt-1">
              Mở khóa các công cụ đặc quyền dựa trên chuỗi ngày rèn luyện phản xạ an ninh mạng liên tục của bạn.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 px-5 py-3 rounded-2xl border border-amber-500/30 shadow-inner">
          <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
          <span className="text-lg font-black text-amber-300 font-mono">{streakDays}</span>
          <span className="text-xs text-slate-400 font-bold">Ngày Streak</span>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {STORE_ITEMS.map((item) => {
          const isOwned = purchasedItems.includes(item.id);
          const isEligible = streakDays >= item.requiredStreak;

          return (
            <div
              key={item.id}
              className="glass-card rounded-3xl p-6 border border-slate-800 bg-slate-900/90 flex flex-col justify-between space-y-4 shadow-xl hover:border-slate-700 transition-all"
            >
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-3xl shrink-0 shadow-md">
                  {item.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-white">{item.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <div className="flex items-center space-x-1.5">
                  <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-black text-amber-300 font-mono">Streak {item.requiredStreak} ngày</span>
                </div>

                <button
                  onClick={() => handleClaim(item)}
                  disabled={isOwned || !isEligible}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase shadow-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                    isOwned
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 cursor-default'
                      : isEligible
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  {isOwned ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Đã Kích Hoạt</span>
                    </>
                  ) : isEligible ? (
                    <span>Nhận Ngay</span>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Cần Streak {item.requiredStreak}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
