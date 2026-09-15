import React from 'react';
import { Swords, QrCode, Eye, Zap, Sparkles, Terminal, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScamArenaView } from './ScamArenaView';
import { QuishingLabView } from './QuishingLabView';
import { DeepfakeLabView } from './DeepfakeLabView';
import { QuickDrillView } from './QuickDrillView';
import { ScamScenario } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface TrainHubViewProps {
  subView: 'arena' | 'quishing' | 'deepfake' | 'drills';
  onSubViewChange: (view: 'arena' | 'quishing' | 'deepfake' | 'drills') => void;
  selectedScenario?: ScamScenario | null;
  onScenarioSelect: (scenario: ScamScenario) => void;
  selectedQuishId?: string | null;
  selectedDeepfakeId?: string | null;
  onCompleteScenario: (score: number) => void;
  onAddXp: (amount: number) => void;
}

export const TrainHubView: React.FC<TrainHubViewProps> = ({
  subView,
  onSubViewChange,
  selectedScenario,
  onScenarioSelect,
  selectedQuishId,
  selectedDeepfakeId,
  onCompleteScenario,
  onAddXp,
}) => {
  const { t } = useTranslation();

  const subTabs = [
    {
      id: 'arena',
      label: 'ĐẤU TRƯỜNG SCAM',
      icon: Swords,
      activeColor: 'bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.55)] border-2 border-cyan-300',
      inactiveColor: 'text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/50 bg-cyan-950/20 hover:bg-cyan-950/40 shadow-[0_0_12px_rgba(6,182,212,0.15)] hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]'
    },
    {
      id: 'quishing',
      label: 'PHÒNG THÍ NGHIỆM QR',
      icon: QrCode,
      activeColor: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)] border border-emerald-400/40',
      inactiveColor: 'text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
    },
    {
      id: 'deepfake',
      label: 'ĐỐ VUI DEEPFAKE AI',
      icon: Eye,
      activeColor: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-slate-950 shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-purple-400/40',
      inactiveColor: 'text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
    },
    {
      id: 'drills',
      label: 'PHẢN XẠ NHANH 25S',
      icon: Zap,
      activeColor: 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)] border border-amber-400/40',
      inactiveColor: 'text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
    },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 cyber-grid relative">
      {/* Background Glows */}
      <div className="glow-orb-cyan top-0 left-1/4 opacity-15" />

      {/* Header Banner - Redesigned with custom glowing layout frame */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-4xl mx-auto space-y-5"
      >
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-700/80 text-cyan-300 text-xs font-black shadow-[0_0_15px_rgba(6,182,212,0.15)] uppercase tracking-wider">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Kênh Thử Nghiệm An Ninh Quốc Gia</span>
        </div>

        {/* Glowing title frame */}
        <div className="inline-block px-8 py-5 rounded-3xl bg-slate-950/40 border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.25)] backdrop-blur-md">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 to-white uppercase">
            THAO TRƯỜNG HUẤN LUYỆN VỆ BINH
          </h1>
        </div>

        <p className="text-sm sm:text-base text-slate-300 leading-loose max-w-3xl mx-auto font-medium">
          Tập luyện phản xạ phòng thủ và bảo mật thông tin với 4 chế độ mô phỏng chuyên sâu: Đấu trường tác chiến kịch bản thực tế, Giải mã độc hại QR code, Đố vui tương tác nhận diện Deepfake AI (Thật hay AI?) và Thử thách phản xạ chớp nhoáng 25 giây.
        </p>
      </motion.div>

      {/* High-Tech Sub-Navigation Tabs with bo góc lớn rounded-2xl, subtle gradients and glowing hover */}
      <div className="flex flex-wrap md:flex-nowrap bg-slate-950/95 p-2 rounded-2xl border border-slate-800/80 max-w-4xl mx-auto gap-2.5 shadow-2xl backdrop-blur-md">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = subView === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSubViewChange(tab.id as any)}
              className={`flex-1 min-w-[155px] py-3 px-4 rounded-2xl text-xs sm:text-sm font-black tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? tab.activeColor
                  : tab.inactiveColor
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Selected Interactive Lab */}
      <AnimatePresence mode="wait">
        <motion.div
          key={subView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {subView === 'arena' && (
            <ScamArenaView
              selectedScenario={selectedScenario}
              onSelectScenario={onScenarioSelect}
              onComplete={onCompleteScenario}
              onAddXp={onAddXp}
            />
          )}

          {subView === 'quishing' && <QuishingLabView onAddXp={onAddXp} initialCaseId={selectedQuishId} />}

          {subView === 'deepfake' && <DeepfakeLabView onAddXp={onAddXp} initialCaseId={selectedDeepfakeId} />}

          {subView === 'drills' && <QuickDrillView onAddXp={onAddXp} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
