import React, { useState, useMemo } from 'react';
import {
  QrCode,
  Search,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Info,
  Layers,
  ChevronDown,
  ChevronUp,
  Filter,
  Building2,
  Truck,
  Zap,
  Coffee,
  Hospital,
  ShoppingBag,
  CreditCard,
  Grid,
} from 'lucide-react';
import { QUISHING_CASES } from '../data/quishingData';
import { QuishingCase } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface QuishingLabViewProps {
  onAddXp: (amount: number) => void;
  initialCaseId?: string | null;
}

export const QuishingLabView: React.FC<QuishingLabViewProps> = ({ onAddXp, initialCaseId }) => {
  const { t } = useTranslation();
  const [selectedCase, setSelectedCase] = useState<QuishingCase>(() => {
    if (initialCaseId) {
      const found = QUISHING_CASES.find((c) => c.id === initialCaseId);
      if (found) return found;
    }
    return QUISHING_CASES[0];
  });

  React.useEffect(() => {
    if (initialCaseId) {
      const found = QUISHING_CASES.find((c) => c.id === initialCaseId);
      if (found) {
        setSelectedCase(found);
        setInspected(false);
        setUserGuess(null);
      }
    }
  }, [initialCaseId]);
  const [inspected, setInspected] = useState(false);
  const [userGuess, setUserGuess] = useState<boolean | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFullGrid, setShowFullGrid] = useState<boolean>(true);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(QUISHING_CASES.map((c) => c.category)));
    return ['all', ...cats];
  }, []);

  // Filtered cases
  const filteredCases = useMemo(() => {
    return QUISHING_CASES.filter((c) => {
      const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.physicalContext.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.visibleUrl.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const currentIndex = QUISHING_CASES.findIndex((c) => c.id === selectedCase.id);

  const handleSelectCase = (qc: QuishingCase) => {
    setSelectedCase(qc);
    setInspected(false);
    setUserGuess(null);
  };

  const handlePrevCase = () => {
    const prevIndex = (currentIndex - 1 + QUISHING_CASES.length) % QUISHING_CASES.length;
    handleSelectCase(QUISHING_CASES[prevIndex]);
  };

  const handleNextCase = () => {
    const nextIndex = (currentIndex + 1) % QUISHING_CASES.length;
    handleSelectCase(QUISHING_CASES[nextIndex]);
  };

  const handleGuess = (isScamGuess: boolean) => {
    setUserGuess(isScamGuess);
    setInspected(true);
    if (isScamGuess === selectedCase.isScam) {
      onAddXp(50);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Banking':
        return <CreditCard className="w-3.5 h-3.5" />;
      case 'Government':
        return <Building2 className="w-3.5 h-3.5" />;
      case 'Delivery':
        return <Truck className="w-3.5 h-3.5" />;
      case 'Utilities':
        return <Zap className="w-3.5 h-3.5" />;
      case 'Restaurant':
        return <Coffee className="w-3.5 h-3.5" />;
      case 'Healthcare':
        return <Hospital className="w-3.5 h-3.5" />;
      case 'E-commerce':
      case 'Retail & Grocery':
        return <ShoppingBag className="w-3.5 h-3.5" />;
      default:
        return <QrCode className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info & Case Explorer Showcase */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {t('quish_header_title')}
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 font-bold border border-emerald-700/50">
                  {QUISHING_CASES.length} Tình huống
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                {t('quish_header_subtitle')}
              </p>
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
            <button
              onClick={handlePrevCase}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-800/80 cursor-pointer"
              title="Tình huống trước"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="px-3 py-1 text-center">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Tình huống</div>
              <div className="text-xs font-mono font-black text-emerald-400">
                #{currentIndex + 1} / {QUISHING_CASES.length}
              </div>
            </div>
            <button
              onClick={handleNextCase}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-800/80 cursor-pointer"
              title="Tình huống kế tiếp"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowFullGrid(!showFullGrid)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                showFullGrid
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{showFullGrid ? 'Thu Gọn Lưới' : 'Mở Lưới Toàn Bộ'}</span>
              {showFullGrid ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Category Filter & Search Bar */}
        {showFullGrid && (
          <div className="pt-2 border-t border-slate-800/80 space-y-3 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Filter Pills */}
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center space-x-1 mr-1">
                  <Filter className="w-3 h-3" />
                  <span>Chủ đề:</span>
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                      selectedCategory === cat
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat === 'all' ? (
                      <span>Tất cả ({QUISHING_CASES.length})</span>
                    ) : (
                      <>
                        {getCategoryIcon(cat)}
                        <span>{cat}</span>
                      </>
                    )}
                  </button>
                ))}
              </div>

              {/* Quick Search */}
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Tìm tình huống, tên miền..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            {/* Case Cards Grid - Responsive, Clean & Clear */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredCases.map((qc) => {
                const isCurrent = selectedCase.id === qc.id;
                const caseIdx = QUISHING_CASES.findIndex((c) => c.id === qc.id);
                return (
                  <div
                    key={qc.id}
                    onClick={() => handleSelectCase(qc)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left space-y-2 relative overflow-hidden group ${
                      isCurrent
                        ? 'bg-emerald-950/30 border-emerald-500/60 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-950/40'
                        : 'bg-slate-950/70 hover:bg-slate-950 border-slate-800/90 hover:border-slate-700'
                    }`}
                  >
                    {/* Top Row: Index + Category + Difficulty */}
                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`font-mono font-black px-1.5 py-0.5 rounded-md ${
                            isCurrent
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          #{String(caseIdx + 1).padStart(2, '0')}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800 font-semibold flex items-center space-x-1">
                          {getCategoryIcon(qc.category)}
                          <span>{qc.category}</span>
                        </span>
                      </div>
                      <span
                        className={`font-bold ${
                          qc.difficulty === 'Beginner'
                            ? 'text-emerald-400'
                            : qc.difficulty === 'Intermediate'
                            ? 'text-cyan-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {qc.difficulty === 'Beginner'
                          ? 'Dễ'
                          : qc.difficulty === 'Intermediate'
                          ? 'Trung Bình'
                          : 'Khó'}
                      </span>
                    </div>

                    {/* Title */}
                    <h4
                      className={`text-xs font-bold leading-snug line-clamp-2 transition-colors ${
                        isCurrent ? 'text-emerald-300' : 'text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {qc.title}
                    </h4>

                    {/* Visible Domain snippet */}
                    <div className="text-[10px] font-mono text-slate-400 bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800/80 truncate">
                      🔗 {qc.visibleUrl}
                    </div>

                    {/* Active Ribbon indicator */}
                    {isCurrent && (
                      <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Interactive Forensics Lab Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Physical QR Context & Visual Mockup (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="px-2.5 py-1 rounded-md bg-slate-950 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center space-x-1.5">
                {getCategoryIcon(selectedCase.category)}
                <span>Phân Loại: {selectedCase.category}</span>
              </span>
              <span
                className={`font-bold ${
                  selectedCase.difficulty === 'Beginner'
                    ? 'text-emerald-400'
                    : selectedCase.difficulty === 'Intermediate'
                    ? 'text-cyan-400'
                    : 'text-rose-400'
                }`}
              >
                Độ khó: {selectedCase.difficulty}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">{selectedCase.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 leading-relaxed">
                📌 <strong className="text-slate-200">Bối cảnh thực tế:</strong>{' '}
                {selectedCase.physicalContext}
              </p>
            </div>

            {/* QR Card Simulation */}
            <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="p-4 bg-white rounded-2xl shadow-xl">
                <QrCode className="w-28 h-28 text-slate-950" />
              </div>
              <div className="space-y-1 w-full max-w-sm">
                <span className="text-[11px] font-bold uppercase text-slate-500">
                  Địa Chỉ Web Đích Sau Khi Quét:
                </span>
                <p className="text-xs font-mono font-bold text-cyan-400 break-all px-3 py-2 bg-slate-900 rounded-xl border border-slate-800">
                  {selectedCase.visibleUrl}
                </p>
              </div>
            </div>
          </div>

          {/* Action: Guess Before Microscope */}
          {!inspected ? (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-300 block text-center">
                Theo bạn, mã QR và đường link này là An toàn hay Lừa đảo?
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleGuess(false)}
                  className="py-3.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Hợp Lệ & An Toàn</span>
                </button>

                <button
                  onClick={() => handleGuess(true)}
                  className="py-3.5 rounded-2xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Mã QR Độc Hại</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => {
                  setInspected(false);
                  setUserGuess(null);
                }}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Đánh Giá Lại</span>
              </button>

              <button
                onClick={handleNextCase}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                <span>Tình Huống Kế Tiếp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Forensic Microscope & URL Dissection (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          {inspected ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Result Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  selectedCase.isScam
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {selectedCase.isScam ? (
                    <ShieldAlert className="w-7 h-7 text-rose-400" />
                  ) : (
                    <ShieldCheck className="w-7 h-7 text-emerald-400" />
                  )}
                  <div>
                    <h4 className="text-sm font-black uppercase">
                      {selectedCase.isScam ? t('quish_verdict_scam') : t('quish_verdict_legit')}
                    </h4>
                    <span className="text-xs font-medium opacity-90">
                      {userGuess === selectedCase.isScam
                        ? '🎉 Bạn đã phán đoán hoàn toàn chính xác! (+50 XP)'
                        : '⚠️ Phán đoán chưa chuẩn, hãy xem giải phẫu chi tiết bên dưới.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* URL Dissection Microscope */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                  <Search className="w-4 h-4" />
                  <span>{t('quish_domain_breakdown')}</span>
                </h4>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Giao thức (Protocol):</span>
                    <span className="font-mono text-slate-200">
                      {selectedCase.urlDissection.protocol}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Tên miền phụ (Subdomain):</span>
                    <span className="font-mono text-amber-400 font-bold">
                      {selectedCase.urlDissection.subdomain || '(Không có)'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Tên miền chính (Registered Domain):</span>
                    <span className="font-mono text-rose-400 font-bold bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">
                      {selectedCase.actualRegistrableDomain}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-400">Đường dẫn (Path):</span>
                    <span className="font-mono text-slate-300">
                      {selectedCase.urlDissection.path}
                    </span>
                  </div>
                </div>
              </div>

              {/* Red flags */}
              {selectedCase.redFlags && selectedCase.redFlags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{t('quish_red_flags')}:</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedCase.redFlags.map((flag, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Anatomy explanation */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {t('quish_explanation')}:
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                  {selectedCase.explanation}
                </p>
              </div>

              {/* Defensive Rule */}
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl text-xs space-y-1">
                <span className="font-bold text-emerald-400 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('quish_defense_tip')}:</span>
                </span>
                <p className="text-slate-200 leading-relaxed">{selectedCase.educationalTip}</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12 text-slate-500">
              <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                <Search className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-300">Kính Hiển Vi Pháp Y URL Đang Chờ</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Hãy đưa ra phán đoán của bạn ở cột bên trái để mở khóa toàn bộ thông số giải phẫu tên miền.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

