import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  Swords,
  QrCode,
  Sparkles,
  ShieldAlert,
  Sliders,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Zap,
  Activity,
  Radio,
  Wifi,
  Lock,
  Dna,
  LayoutDashboard,
  BookOpen,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { searchGlobalRegistry, SearchResultItem } from '../utils/searchIndex';

interface GlobalSearchBarProps {
  onNavigate: (tab: string, subView?: string) => void;
  className?: string;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({ onNavigate, className = '' }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Results computation
  const results = useMemo(() => {
    return searchGlobalRegistry(query, 10);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const chosen = results[selectedIndex];
      if (chosen) {
        handleSelectItem(chosen);
      }
    }
  };

  const handleSelectItem = (item: SearchResultItem) => {
    onNavigate(item.tab, item.subView);
    setIsOpen(false);
    setQuery('');
  };

  const getResultIcon = (iconType: string) => {
    switch (iconType) {
      case 'swords':
        return <Swords className="w-4 h-4 text-cyan-400" />;
      case 'qr':
        return <QrCode className="w-4 h-4 text-emerald-400" />;
      case 'sparkles':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'shield-alert':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'activity':
        return <Activity className="w-4 h-4 text-blue-400" />;
      case 'radio':
        return <Radio className="w-4 h-4 text-amber-400 animate-pulse" />;
      case 'wifi':
        return <Wifi className="w-4 h-4 text-indigo-400" />;
      case 'lock':
        return <Lock className="w-4 h-4 text-teal-400" />;
      case 'dna':
        return <Dna className="w-4 h-4 text-purple-400" />;
      case 'dashboard':
        return <LayoutDashboard className="w-4 h-4 text-amber-300" />;
      case 'book':
        return <BookOpen className="w-4 h-4 text-emerald-300" />;
      case 'help':
        return <HelpCircle className="w-4 h-4 text-amber-400" />;
      default:
        return <Search className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'scenario':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'quishing':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'deepfake':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'blacklist':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'quiz':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      default:
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div ref={searchContainerRef} className={`relative flex-1 ${className}`}>
      {/* Input Field */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Tìm kịch bản bẫy, URL, QR, Deepfake, OSINT, ViSEF..."
          className="w-full pl-10 pr-9 py-2 bg-slate-900/90 border border-slate-800 hover:border-slate-700 focus:border-purple-500 rounded-2xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500/40 transition shadow-inner font-mono"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 p-0.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown Results Box */}
      <AnimatePresence>
        {isOpen && query.trim() !== '' && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute top-full left-0 right-0 mt-2 bg-slate-950/98 border border-slate-800/90 rounded-2xl shadow-2xl backdrop-blur-2xl z-50 overflow-hidden divide-y divide-slate-800/80 max-h-[480px] flex flex-col"
          >
            {/* Header with Result Count Announcement */}
            <div className="px-4 py-2.5 bg-slate-900/90 flex items-center justify-between text-xs border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                <span className="font-bold text-slate-200">
                  {results.length > 0 ? (
                    <>
                      Tìm thấy <span className="text-cyan-400 font-mono font-black">{results.length}</span> kết quả phù hợp
                    </>
                  ) : (
                    <span className="text-slate-400">Không tìm thấy kết quả phù hợp</span>
                  )}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                Nhấn ↑ ↓ để di chuyển • Enter để mở
              </span>
            </div>

            {/* Results List */}
            <div className="overflow-y-auto max-h-[380px] p-2 space-y-1">
              {results.length === 0 ? (
                <div className="p-6 text-center space-y-2">
                  <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-300">Không có kết quả nào trùng khớp với "{query}"</p>
                  <p className="text-[11px] text-slate-500">
                    Thử tìm với các từ khóa: <em>vneid, ngan hang, dien luc, quishing, deepfake, thue, blacklist...</em>
                  </p>
                </div>
              ) : (
                results.map((item, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-purple-950/40 border border-purple-500/50 shadow-md ring-1 ring-purple-500/30'
                          : 'bg-slate-900/40 hover:bg-slate-900 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        {/* Type Icon Container */}
                        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                          {getResultIcon(item.iconType)}
                        </div>

                        {/* Title & Subtitle */}
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4
                              className={`text-xs font-bold truncate ${
                                isSelected ? 'text-purple-300' : 'text-slate-100'
                              }`}
                            >
                              {item.title}
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5 font-normal">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Right Badges */}
                      <div className="flex items-center space-x-2 shrink-0">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${getBadgeStyle(
                            item.type
                          )}`}
                        >
                          {item.badge}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Quick Suggestion Shortcuts */}
            <div className="px-4 py-2 bg-slate-950/90 text-[11px] text-slate-400 flex flex-wrap items-center gap-1.5 border-t border-slate-800/80">
              <span className="text-slate-500 text-[10px] font-bold">Gợi ý tìm nhanh:</span>
              {['VNeID', 'Ngân Hàng', 'Hoàn Thuế', 'Quishing QR', 'Deepfake Giọng Nói', 'OSINT Tên Miền'].map((sug) => (
                <button
                  key={sug}
                  onClick={() => {
                    setQuery(sug);
                    setIsOpen(true);
                    inputRef.current?.focus();
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-800 hover:border-purple-500/40 transition cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
