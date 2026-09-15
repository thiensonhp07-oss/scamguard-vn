import React from 'react';
import { Home, Compass, Swords, Dna, Search, Menu, Trophy, User } from 'lucide-react';
import { motion } from 'motion/react';

interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (tab: any) => void;
  onOpenEmergency: () => void;
  onOpenDrawer?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenDrawer,
}) => {
  const tabs = [
    { id: 'home', label: 'BẢNG ĐIỀU KHIỂN', icon: Home },
    { id: 'roadmap', label: 'LỘ TRÌNH', icon: Compass },
    { id: 'scamdna', label: 'SCAM DNA', icon: Dna },
    { id: 'train', label: 'ĐẤU TRƯỜNG', icon: Swords },
    { id: 'check', label: 'GIÁM ĐỊNH', icon: Search },
    { id: 'all_drawer', label: 'TẤT CẢ MỤC', icon: Menu, isDrawer: true },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/80 px-1 py-1.5 shadow-2xl safe-area-pb">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.isDrawer ? false : activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (tab.isDrawer) {
                  if (onOpenDrawer) onOpenDrawer();
                } else {
                  onSelectTab(tab.id);
                }
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-1.5 rounded-xl text-[9px] sm:text-[10px] font-extrabold transition-all cursor-pointer ${
                isActive
                  ? 'border shadow-lg font-black text-purple-300 bg-purple-950/70 border-purple-500/60'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
              style={
                isActive
                  ? {
                      boxShadow: '0 0 12px rgba(168, 85, 247, 0.25)',
                    }
                  : undefined
              }
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'scale-110 text-purple-300' : ''}`} />
              <span className="truncate tracking-tighter sm:tracking-normal">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

