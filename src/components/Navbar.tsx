import React, { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  Flame,
  Sparkles,
  User,
  Palette,
  Dna,
  Search,
  Bell,
  MessageSquare,
  Moon,
  Menu,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, UserAccount } from '../types';
import { GlobalSearchBar } from './GlobalSearchBar';
import brandLogo from '../assets/images/scamguard_logo_brand.png';

interface NavbarProps {
  activeTab: string;
  userProfile: UserProfile;
  currentUser: UserAccount | null;
  onSelectTab: (tab: any, subView?: string) => void;
  onOpenEmergency: () => void;
  onOpenAuth: () => void;
  onOpenTheme?: () => void;
  onOpenStreak?: () => void;
  onOpenScienceFairDemo?: () => void;
  onOpenNotifications?: () => void;
  onOpenChat?: () => void;
  onOpenDrawer?: () => void;
  onLanguageChange?: (lang: 'vi' | 'en') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  userProfile,
  currentUser,
  onSelectTab,
  onOpenEmergency,
  onOpenAuth,
  onOpenTheme,
  onOpenStreak,
  onOpenScienceFairDemo,
  onOpenNotifications,
  onOpenChat,
  onOpenDrawer,
  onLanguageChange,
}) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const currentLang = userProfile.language || 'vi';

  const toggleLanguage = () => {
    const nextLang = currentLang === 'vi' ? 'en' : 'vi';
    if (onLanguageChange) {
      onLanguageChange(nextLang);
    }
  };
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-slate-950/90 border-b border-slate-800/80 shadow-md">
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3 sm:gap-4">
          
          {/* Left: Mobile Drawer Trigger + Brand Identity */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Hamburger button for Mobile & Tablet (iPad) */}
            <button
              onClick={onOpenDrawer}
              className="lg:hidden p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer flex items-center justify-center"
              title="Danh mục tất cả tính năng"
            >
              <Menu className="w-5 h-5 text-purple-400" />
            </button>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectTab('home')}
              className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group select-none shrink-0"
            >
              <div className="relative flex items-center justify-center">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-600/40 to-indigo-600/40 border border-purple-500/50 flex items-center justify-center text-white shadow-md shadow-purple-500/30 overflow-hidden">
                  <Shield className="w-5 h-5 text-white fill-purple-400/40 group-hover:scale-110 transition-transform" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 shadow-sm" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className="text-sm sm:text-base font-black tracking-tight text-white group-hover:text-purple-300 transition-colors font-mono">
                    ScamGuard
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded bg-purple-950/90 text-purple-300 border border-purple-800/60 font-mono">
                    EdTech
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium hidden sm:block font-mono">
                  BY SUPPORTSYS • VISEF 2026
                </span>
              </div>
            </motion.div>
          </div>

          {/* Middle: Intelligent Glass Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-lg items-center relative">
            <GlobalSearchBar onNavigate={onSelectTab} />
          </div>

          {/* Right Clean Action Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
            {/* Mobile Search Toggle Button */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white md:hidden transition cursor-pointer"
              title="Tìm kiếm"
            >
              <Search className="w-4 h-4 text-purple-400" />
            </button>
            
            {/* Notification Bell with Badge '5' */}
            <div className="relative">
              <button
                onClick={onOpenNotifications}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-purple-500/50 transition cursor-pointer"
                title="Thông báo an ninh"
              >
                <Bell className="w-4 h-4" />
              </button>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold flex items-center justify-center border-2 border-slate-950 pointer-events-none">
                5
              </span>
            </div>

            {/* Chat Messages Icon */}
            <button
              onClick={onOpenChat}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-purple-500/50 transition cursor-pointer hidden sm:block"
              title="Trung tâm trò chuyện và bạn bè"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle Icon */}
            <button
              onClick={onOpenTheme}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-purple-500/50 transition cursor-pointer hidden sm:block"
            >
              <Moon className="w-4 h-4 text-purple-400" />
            </button>

            {/* Language Flag Badge */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 text-xs font-mono font-bold text-slate-300 transition cursor-pointer"
              title="Chuyển đổi Ngôn ngữ / Toggle Language (VN / EN)"
            >
              <span className="text-sm">{currentLang === 'vi' ? '🇻🇳' : '🇬🇧'}</span>
              <span className="hidden sm:inline">{currentLang === 'vi' ? 'VN' : 'EN'}</span>
            </button>

            {/* User Profile Pill */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenAuth}
              className="flex items-center space-x-2 p-1.5 pr-2.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 cursor-pointer transition shadow-md"
            >
              <div className="relative">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                  {userProfile.name ? userProfile.name.charAt(0) : 'N'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full border border-slate-950" />
              </div>

              <div className="flex flex-col text-left hidden sm:block">
                <span className="text-xs font-bold text-white tracking-tight leading-none">
                  {userProfile.name || 'Nguyễn Văn An'}
                </span>
              </div>
            </motion.div>

            {/* Red Emergency Alert Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenEmergency}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/30 cursor-pointer"
              title="Khẩn cấp"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden lg:inline">Khẩn Cấp</span>
            </motion.button>
          </div>
        </div>

        {/* Mobile Search Overlay Drawer */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden py-3 border-t border-slate-800 overflow-visible"
            >
              <GlobalSearchBar
                onNavigate={(t, s) => {
                  onSelectTab(t, s);
                  setIsMobileSearchOpen(false);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
