import React from 'react';
import {
  X,
  LayoutDashboard,
  Compass,
  Dna,
  Swords,
  Search,
  FlaskConical,
  Gift,
  Trophy,
  User,
  MoreHorizontal,
  Shield,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  Zap,
  Flame,
  Moon,
  MessageSquare,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, UserAccount } from '../types';

interface MobileDrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  userProfile: UserProfile;
  currentUser?: UserAccount | null;
  onSelectTab: (tab: any, subView?: string) => void;
  onOpenEmergency: () => void;
  onOpenTheme?: () => void;
  onOpenAuth?: () => void;
  onOpenScienceFairDemo?: () => void;
}

export const MobileDrawerMenu: React.FC<MobileDrawerMenuProps> = ({
  isOpen,
  onClose,
  activeTab,
  userProfile,
  currentUser,
  onSelectTab,
  onOpenEmergency,
  onOpenTheme,
  onOpenAuth,
  onOpenScienceFairDemo,
}) => {
  const tacticalItems = [
    {
      id: 'home',
      label: 'Bảng Điều Khiển Executive',
      desc: 'Tổng quan chỉ số an ninh & telemetry ViSEF',
      icon: LayoutDashboard,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      tag: 'CHÍNH',
      sub: undefined,
    },
    {
      id: 'roadmap',
      label: 'Lộ Trình Huấn Luyện',
      desc: 'Snake Path qua 8 khu vực phòng tuyến',
      icon: Compass,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      tag: '8 TRẠM',
      sub: undefined,
    },
    {
      id: 'scamdna',
      label: 'Scam DNA & Cấu Trúc Gen',
      desc: 'Bản đồ cấu trúc gen thao túng tâm lý',
      icon: Dna,
      color: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30',
      tag: 'AI GEN',
      sub: undefined,
    },
    {
      id: 'check',
      label: 'Giám Định AI Đa Tầng',
      desc: 'Quét link độc, hóa đơn giả, bóc tách PII',
      icon: Search,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      tag: 'QUÉT AI',
      sub: undefined,
    },
    {
      id: 'research',
      label: 'Nghiên Cứu ViSEF 2026',
      desc: 'Báo cáo khoa học, thống kê & IRB Protocol',
      icon: FlaskConical,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      tag: 'KHOA HỌC',
      sub: undefined,
    },
  ] as const;

  const personalItems = [
    {
      id: 'quests',
      label: 'Nhiệm Vụ & Rương Báu',
      desc: 'Thử thách an ninh hàng ngày nhận XP',
      icon: Gift,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      tag: 'HÀNG NGÀY',
      sub: undefined,
    },
    {
      id: 'leaderboard',
      label: 'Bảng Xếp Hạng Vệ Binh',
      desc: 'Đua top phòng thủ với biệt đội an ninh',
      icon: Trophy,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      tag: 'XẾP HẠNG',
      sub: undefined,
    },
    {
      id: 'train',
      label: 'Đấu Trường Phòng Thủ',
      desc: 'Thực chiến 12 kịch bản bẫy có gắn còi báo động',
      icon: Swords,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      tag: '12 BẪY',
      sub: 'arena',
    },
    {
      id: 'profile',
      label: 'Hồ Sơ & Thống Kê',
      desc: 'Quản lý tài khoản, danh bạ tin cậy & thành tích',
      icon: User,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      tag: 'CÁ NHÂN',
      sub: undefined,
    },
    {
      id: 'more',
      label: 'Kho Tiện Ích Tác Chiến',
      desc: 'Radar lừa đảo, Khiên WiFi, Giám sát màn hình',
      icon: MoreHorizontal,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      tag: 'TIỆN ÍCH',
      sub: undefined,
    },
  ] as const;

  const handleItemClick = (id: string, sub?: string) => {
    onSelectTab(id, sub);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Drawer Sidebar Sheet */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="relative w-[85%] max-w-[380px] bg-slate-950 border-r border-slate-800 h-full flex flex-col justify-between shadow-2xl z-50 overflow-hidden"
          >
            {/* Header Section with User Badge */}
            <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/60 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/30 border border-purple-500/40">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-mono font-black text-sm text-white tracking-wider">
                      ScamGuard VN
                    </h3>
                    <span className="text-[10px] text-purple-300 font-mono font-bold block">
                      HỆ THỐNG PHÒNG VỆ SỐ
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                  title="Đóng menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* User Compact Card */}
              <div
                onClick={() => {
                  if (onOpenAuth) onOpenAuth();
                  onClose();
                }}
                className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-purple-500/50 transition"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
                    {userProfile.name ? userProfile.name.charAt(0) : 'N'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{userProfile.name || 'Vệ Binh An Toàn'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Flame className="w-3 h-3 fill-amber-400" />
                        {userProfile.streakDays || 1} ngày
                      </span>
                      <span>•</span>
                      <span className="text-cyan-400 font-bold">
                        {userProfile.xp || 0} XP
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>

              {/* ViSEF 5-Minute Evaluation Quick Link */}
              {onOpenScienceFairDemo && (
                <button
                  onClick={() => {
                    onOpenScienceFairDemo();
                    onClose();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-purple-500/40 hover:border-purple-500 text-purple-200 font-bold text-xs flex items-center justify-between transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Khảo Nghiệm ViSEF (5 Phút)</span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-300 font-bold bg-purple-500/20 px-1.5 py-0.5 rounded">
                    LIVE
                  </span>
                </button>
              )}
            </div>

            {/* Scrollable Navigation Items */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
              {/* Category 1: TÁC CHIẾN */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-500 px-2 tracking-wider uppercase block">
                  QUẢN LÝ TÁC CHIẾN ({tacticalItems.length})
                </span>
                <div className="space-y-1">
                  {tacticalItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id, item.sub)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                          isActive
                            ? 'bg-purple-600/20 border border-purple-500/70 text-white shadow-md'
                            : 'bg-slate-900/40 hover:bg-slate-900 border border-transparent text-slate-300 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${item.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                              <span>{item.label}</span>
                              {isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 line-clamp-1">
                              {item.desc}
                            </span>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60 shrink-0">
                          {item.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category 2: NHIỆM VỤ & CÁ NHÂN */}
              <div className="space-y-1.5 pt-2 border-t border-slate-900">
                <span className="text-[10px] font-mono font-bold text-slate-500 px-2 tracking-wider uppercase block">
                  HUẤN LUYỆN & NHIỆM VỤ ({personalItems.length})
                </span>
                <div className="space-y-1">
                  {personalItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id, item.sub)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                          isActive
                            ? 'bg-purple-600/20 border border-purple-500/70 text-white shadow-md'
                            : 'bg-slate-900/40 hover:bg-slate-900 border border-transparent text-slate-300 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${item.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                              <span>{item.label}</span>
                              {isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 line-clamp-1">
                              {item.desc}
                            </span>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60 shrink-0">
                          {item.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="p-3 sm:p-4 border-t border-slate-800/80 bg-slate-900/60 space-y-2">
              <button
                onClick={() => {
                  onOpenEmergency();
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>BÁO CÁO KHẨN CẤP (SOS)</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 px-1">
                <span>ScamGuard v2.4 ViSEF</span>
                {onOpenTheme && (
                  <button
                    onClick={() => {
                      onOpenTheme();
                      onClose();
                    }}
                    className="text-purple-400 hover:text-purple-300 font-bold"
                  >
                    Đổi Giao Diện
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
