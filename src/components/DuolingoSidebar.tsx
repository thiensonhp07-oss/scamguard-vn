import React from 'react';
import {
  Home,
  Dna,
  Swords,
  Search,
  Trophy,
  Gift,
  User,
  MoreHorizontal,
  Shield,
  Sparkles,
  FlaskConical,
  LayoutDashboard,
  Headphones,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { motion } from 'motion/react';
import { MascotOwl } from './MascotOwl';
import brandLogo from '../assets/images/scamguard_logo_brand.png';

interface DuolingoSidebarProps {
  activeTab: string;
  onSelectTab: (
    tab: any,
    subView?: string
  ) => void;
  onOpenEmergency?: () => void;
}

export const DuolingoSidebar: React.FC<DuolingoSidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenEmergency,
}) => {
  const tacticalItems = [
    { id: 'home', label: 'BẢNG ĐIỀU KHIỂN', icon: LayoutDashboard, color: 'purple', sub: undefined },
    { id: 'roadmap', label: 'LỘ TRÌNH HUẤN LUYỆN', icon: Compass, color: 'cyan', sub: undefined },
    { id: 'scamdna', label: 'SCAM DNA', icon: Dna, color: 'purple', sub: undefined },
    { id: 'check', label: 'GIÁM ĐỊNH AI', icon: Search, color: 'cyan', sub: undefined },
    { id: 'research', label: 'NGHIÊN CỨU VISEF', icon: FlaskConical, color: 'blue', sub: undefined },
  ] as const;

  const personalItems = [
    { id: 'quests', label: 'NHIỆM VỤ', icon: Gift, color: 'purple', sub: undefined },
    { id: 'leaderboard', label: 'BẢNG XẾP HẠNG', icon: Trophy, color: 'amber', sub: undefined },
    { id: 'train', label: 'ĐẤU TRƯỜNG', icon: Swords, color: 'emerald', sub: 'arena' },
    { id: 'profile', label: 'HỒ SƠ VỆ BINH', icon: User, color: 'blue', sub: undefined },
    { id: 'more', label: 'XEM THÊM', icon: MoreHorizontal, color: 'indigo', sub: undefined },
  ] as const;

  const renderNavButton = (item: typeof tacticalItems[number] | typeof personalItems[number]) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    const isDashboard = item.id === 'home';

    return (
      <motion.button
        key={item.id}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onSelectTab(item.id as any, item.sub)}
        className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all cursor-pointer ${
          isDashboard && isActive
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
            : isActive
            ? 'text-white bg-slate-900 border border-slate-800 shadow-md'
            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 border border-transparent'
        }`}
      >
        <div className="flex items-center space-x-3">
          <Icon
            className={`w-4 h-4 transition-transform ${
              isActive ? 'text-purple-300 scale-110' : 'text-slate-400'
            }`}
          />
          <span className="font-mono text-[11px] uppercase tracking-wider">{item.label}</span>
        </div>

        <ChevronRight className={`w-3.5 h-3.5 opacity-50 ${isActive ? 'text-white' : 'text-slate-600'}`} />
      </motion.button>
    );
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-950/95 border-r border-slate-800/80 p-4 sticky top-0 h-screen select-none justify-between backdrop-blur-2xl z-40 overflow-y-auto">
      <div className="space-y-5">
        {/* Brand Identity matching image.png top left logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectTab('home')}
          className="flex items-center space-x-3 px-2 py-1 cursor-pointer group"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/40 to-indigo-600/40 border border-purple-500/50 flex items-center justify-center text-white shadow-md shadow-purple-500/30 overflow-hidden">
              <Shield className="w-5 h-5 text-white fill-purple-400/40 group-hover:scale-110 transition-transform" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-wider text-white group-hover:text-purple-300 transition-colors font-mono">
              ScamGuard
            </span>
            <span className="text-[9px] text-purple-300 font-bold tracking-widest uppercase -mt-0.5 font-mono">
              BY VISEF RESEARCH
            </span>
          </div>
        </motion.div>

        {/* Primary Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectTab('home')}
          className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer transition shadow-lg ${
            activeTab === 'home'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/30'
              : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <LayoutDashboard className="w-4 h-4 text-purple-200" />
            <span>BẢNG ĐIỀU KHIỂN</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </motion.button>

        {/* Vertical Nav List divided into Categories */}
        <div className="space-y-4 pt-1">
          {/* Category 1: QUẢN LÝ TÁC CHIẾN */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 px-3 tracking-widest uppercase font-mono block">
              QUẢN LÝ TÁC CHIẾN
            </span>
            <nav className="space-y-1">
              {tacticalItems.map(renderNavButton)}
            </nav>
          </div>

          <div className="border-t border-slate-900 my-1" />

          {/* Category 2: HUẤN LUYỆN & NHIỆM VỤ */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 px-3 tracking-widest uppercase font-mono block">
              HUẤN LUYỆN & NHIỆM VỤ
            </span>
            <nav className="space-y-1">
              {personalItems.map(renderNavButton)}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Help Widget */}
      <div className="pt-4 border-t border-slate-900">
        <div
          onClick={onOpenEmergency}
          className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/40 flex items-center space-x-3 cursor-pointer transition shadow-md group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform shrink-0">
            <Headphones className="w-4 h-4" />
          </div>
          <div className="flex-1 truncate">
            <p className="text-xs font-bold text-white group-hover:text-purple-300 transition">Hỗ Trợ Khẩn Cấp 24/7</p>
            <p className="text-[10px] text-slate-400 truncate">Quy trình báo động & HDSD</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
