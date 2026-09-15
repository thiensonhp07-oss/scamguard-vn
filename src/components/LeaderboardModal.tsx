import React, { useState } from 'react';
import { Trophy, Globe, MapPin, Award, Flame, Zap, Shield, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { handleAvatarError } from '../utils/avatarFallback';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserProfile: UserProfile;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  tier: string;
  streak: number;
  avatar: string;
  isCurrentUser?: boolean;
}

const GLOBAL_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'Alexandre Vu', xp: 9420, tier: 'Huyền Thoại Vệ Binh', streak: 142, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
  { rank: 2, name: 'Hoàng Minh Tuấn', xp: 8850, tier: 'Bậc Thầy An Ninh', streak: 98, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { rank: 3, name: 'Nguyễn Thị Mai', xp: 7640, tier: 'Chuyên Gia Tác Chiến', streak: 75, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  { rank: 4, name: 'David Smith', xp: 6920, tier: 'Vệ Binh Kỳ Cựu', streak: 64, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
  { rank: 5, name: 'Trần Văn Hùng', xp: 6150, tier: 'Vệ Binh Kỳ Cựu', streak: 45, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80' },
];

const NATIONAL_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'Hoàng Minh Tuấn (HN)', xp: 8850, tier: 'Bậc Thầy An Ninh', streak: 98, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { rank: 2, name: 'Nguyễn Thị Mai (TP.HCM)', xp: 7640, tier: 'Chuyên Gia Tác Chiến', streak: 75, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  { rank: 3, name: 'Trần Văn Hùng (Đà Nẵng)', xp: 6150, tier: 'Vệ Binh Kỳ Cựu', streak: 45, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80' },
  { rank: 4, name: 'Lê Minh Khôi (Hải Phòng)', xp: 5430, tier: 'Vệ Binh Vững Vàng', streak: 30, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80' },
  { rank: 5, name: 'Phạm Quỳnh Nga (Cần Thơ)', xp: 4890, tier: 'Vệ Binh Vững Vàng', streak: 22, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' },
];

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentUserProfile,
}) => {
  const [tab, setTab] = useState<'national' | 'global'>('national');

  if (!isOpen) return null;

  const list = tab === 'national' ? NATIONAL_LEADERBOARD : GLOBAL_LEADERBOARD;

  // Compute current user rank placeholder
  const currentUserEntry: LeaderboardUser = {
    rank: 12,
    name: currentUserProfile.name || 'Bạn',
    xp: currentUserProfile.xp || 1450,
    tier: 'Vệ Binh Cấp 4',
    streak: currentUserProfile.streakDays || 3,
    avatar: currentUserProfile.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    isCurrentUser: true,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="card-tactile w-full max-w-lg p-6 sm:p-8 space-y-6 bg-slate-900 border border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Bảng Xếp Hạng Vệ Binh</h2>
              <p className="text-xs text-slate-400">Thi đua tích lũy XP & bảo vệ cộng đồng</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setTab('national')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              tab === 'national'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Việt Nam (Trong Nước)</span>
          </button>
          <button
            onClick={() => setTab('global')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              tab === 'global'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Toàn Cầu (Global)</span>
          </button>
        </div>

        {/* TOP 3 PODIUM WIDGET */}
        {list[0] && list[1] && list[2] && (
          <div className="cyber-card-neon p-4 rounded-2xl border border-cyan-500/40 relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 shadow-xl">
            <div className="text-center mb-3">
              <span className="cyber-badge-gold text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>TOP 3 HIỆP SĨ SỐ</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 items-end pt-2 pb-1">
              {/* RANK 2 */}
              <div className="flex flex-col items-center">
                <span className="text-sm mb-1">🥈</span>
                <img
                  src={list[1].avatar}
                  alt={list[1].name}
                  referrerPolicy="no-referrer"
                  onError={(e) => handleAvatarError(e, list[1].name)}
                  className="w-12 h-12 rounded-xl border-2 border-slate-300 object-cover shadow-md"
                />
                <p className="text-[11px] font-black text-white mt-1.5 text-center line-clamp-1">{list[1].name}</p>
                <p className="text-[10px] text-slate-300 font-bold">{list[1].xp} XP</p>
                <div className="w-full h-12 mt-1 bg-slate-800/80 rounded-t-xl border-t border-slate-400/50 flex flex-col items-center justify-center">
                  <span className="text-xs font-black text-slate-300">2</span>
                  <span className="text-[8px] font-bold text-slate-400">Á QUÂN</span>
                </div>
              </div>

              {/* RANK 1 */}
              <div className="flex flex-col items-center -mt-3">
                <span className="text-base mb-1 animate-pulse">👑</span>
                <img
                  src={list[0].avatar}
                  alt={list[0].name}
                  referrerPolicy="no-referrer"
                  onError={(e) => handleAvatarError(e, list[0].name)}
                  className="w-15 h-15 rounded-xl border-2 border-amber-400 object-cover shadow-[0_0_15px_rgba(255,230,0,0.5)]"
                />
                <p className="text-xs font-black text-amber-300 mt-1.5 text-center line-clamp-1">{list[0].name}</p>
                <p className="text-[11px] text-amber-400 font-black">{list[0].xp} XP</p>
                <div className="w-full h-16 mt-1 bg-gradient-to-t from-amber-950/80 to-amber-600/30 rounded-t-xl border-t-2 border-amber-400 flex flex-col items-center justify-center">
                  <span className="text-sm font-black text-amber-400">1</span>
                  <span className="text-[8px] font-black text-amber-300">QUÁN QUÂN</span>
                </div>
              </div>

              {/* RANK 3 */}
              <div className="flex flex-col items-center">
                <span className="text-sm mb-1">🥉</span>
                <img
                  src={list[2].avatar}
                  alt={list[2].name}
                  referrerPolicy="no-referrer"
                  onError={(e) => handleAvatarError(e, list[2].name)}
                  className="w-12 h-12 rounded-xl border-2 border-amber-700 object-cover shadow-md"
                />
                <p className="text-[11px] font-black text-white mt-1.5 text-center line-clamp-1">{list[2].name}</p>
                <p className="text-[10px] text-amber-500 font-bold">{list[2].xp} XP</p>
                <div className="w-full h-10 mt-1 bg-amber-950/40 rounded-t-xl border-t border-amber-700/60 flex flex-col items-center justify-center">
                  <span className="text-xs font-black text-amber-600">3</span>
                  <span className="text-[8px] font-bold text-amber-600">TOP 3</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Rank Card */}
        <div className="bg-gradient-to-r from-cyan-950/60 to-slate-950 border border-cyan-500/40 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 font-black flex items-center justify-center text-sm border border-cyan-500/40">
              #{currentUserEntry.rank}
            </div>
            <img
              src={currentUserEntry.avatar}
              alt="Avatar"
              referrerPolicy="no-referrer"
              onError={(e) => handleAvatarError(e, currentUserEntry.name)}
              className="w-10 h-10 rounded-full object-cover border border-cyan-500/60"
            />
            <div>
              <div className="font-bold text-white text-sm">{currentUserEntry.name} (Bạn)</div>
              <div className="text-xs text-cyan-400 font-medium">Vệ Binh Cấp 4 • {currentUserEntry.tier}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-black text-cyan-300">{currentUserEntry.xp} XP</div>
            <div className="text-xs text-amber-400 font-bold flex items-center justify-end space-x-1">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{currentUserEntry.streak} ngày</span>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-2.5">
          {list.map((u) => (
            <div
              key={u.rank}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                u.rank === 1
                  ? 'bg-amber-950/30 border-amber-500/50'
                  : u.rank === 2
                  ? 'bg-slate-900 border-slate-700'
                  : u.rank === 3
                  ? 'bg-amber-950/20 border-amber-800/40'
                  : 'bg-slate-950/60 border-slate-800/80'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full font-black flex items-center justify-center text-xs ${
                    u.rank === 1
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                      : u.rank === 2
                      ? 'bg-slate-300 text-slate-950'
                      : u.rank === 3
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {u.rank === 1 ? '👑' : `#${u.rank}`}
                </div>
                <img
                  src={u.avatar}
                  alt={u.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => handleAvatarError(e, u.name)}
                  className="w-9 h-9 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">{u.name}</h4>
                  <p className="text-[11px] text-slate-400">{u.tier}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-black text-cyan-400">{u.xp} XP</div>
                <div className="text-[11px] text-amber-400 font-bold flex items-center justify-end space-x-1">
                  <Flame className="w-3 h-3 fill-amber-400" />
                  <span>{u.streak}d</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full btn-tactile btn-tactile-cyan py-3 text-sm font-bold"
          >
            Đã Hiểu & Quay Lại Hành Trình
          </button>
        </div>
      </div>
    </div>
  );
};
