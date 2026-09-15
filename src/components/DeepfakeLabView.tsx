import React, { useState, useEffect, useMemo } from 'react';
import {
  Eye,
  Volume2,
  VolumeX,
  Video,
  AlertTriangle,
  CheckCircle2,
  Scan,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  PhoneCall,
  Lock,
  Gamepad2,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Filter,
  Search,
  Grid,
  ChevronDown,
  ChevronUp,
  UserX,
  Flame,
  Radio,
} from 'lucide-react';
import { DEEPFAKE_CASES } from '../data/deepfakeData';
import { DeepfakeCase } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { DeepfakeQuizView } from './DeepfakeQuizView';
import { speakText, stopSpeaking } from '../utils/audioEffects';

interface DeepfakeLabViewProps {
  onAddXp: (amount: number) => void;
  initialCaseId?: string | null;
}

export const DeepfakeLabView: React.FC<DeepfakeLabViewProps> = ({ onAddXp, initialCaseId }) => {
  const { t } = useTranslation();
  const [activeMode, setActiveMode] = useState<'quiz' | 'forensics'>('quiz');
  const [selectedCase, setSelectedCase] = useState<DeepfakeCase>(() => {
    if (initialCaseId) {
      const found = DEEPFAKE_CASES.find((c) => c.id === initialCaseId);
      if (found) return found;
    }
    return DEEPFAKE_CASES[0];
  });

  React.useEffect(() => {
    if (initialCaseId) {
      const found = DEEPFAKE_CASES.find((c) => c.id === initialCaseId);
      if (found) {
        setSelectedCase(found);
        setActiveMode('forensics');
        setScanned(false);
      }
    }
  }, [initialCaseId]);
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMediaType, setSelectedMediaType] = useState<'all' | 'voice' | 'video'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFullGrid, setShowFullGrid] = useState<boolean>(true);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(DEEPFAKE_CASES.map((c) => c.category)));
    return ['all', ...cats];
  }, []);

  // Filtered cases
  const filteredCases = useMemo(() => {
    return DEEPFAKE_CASES.filter((c) => {
      const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
      const matchMedia = selectedMediaType === 'all' || c.mediaType === selectedMediaType;
      const matchSearch =
        searchQuery.trim() === '' ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.callerInfo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.scenarioText.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchMedia && matchSearch;
    });
  }, [selectedCategory, selectedMediaType, searchQuery]);

  const currentIndex = DEEPFAKE_CASES.findIndex((c) => c.id === selectedCase.id);

  // Clean up synthetic speech when mode changes or unmounts
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [selectedCase, activeMode]);

  const handleToggleVoice = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      speakText(selectedCase.scenarioText);
      setIsPlayingAudio(true);
      // Auto-reset state after speech ends estimated duration
      const words = selectedCase.scenarioText.split(/\s+/).length;
      const durationMs = Math.max(3000, words * 380);
      setTimeout(() => setIsPlayingAudio(false), durationMs);
    }
  };

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
      onAddXp(60);
    }, 1200);
  };

  const handleSelectCase = (c: DeepfakeCase) => {
    stopSpeaking();
    setIsPlayingAudio(false);
    setSelectedCase(c);
    setScanned(false);
  };

  const handlePrevCase = () => {
    const prevIndex = (currentIndex - 1 + DEEPFAKE_CASES.length) % DEEPFAKE_CASES.length;
    handleSelectCase(DEEPFAKE_CASES[prevIndex]);
  };

  const handleNextCase = () => {
    const nextIndex = (currentIndex + 1) % DEEPFAKE_CASES.length;
    handleSelectCase(DEEPFAKE_CASES[nextIndex]);
  };

  return (
    <div className="space-y-6">
      {/* Top Segment Mode Switcher */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl max-w-lg w-full">
          <button
            onClick={() => setActiveMode('quiz')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              activeMode === 'quiz'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-slate-950 shadow-lg shadow-purple-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>ĐỐ VUI NHẬN DIỆN (QUIZ)</span>
          </button>

          <button
            onClick={() => setActiveMode('forensics')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              activeMode === 'forensics'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-slate-950 shadow-lg shadow-purple-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>HỒ SƠ PHÁP Y (CASE STUDY)</span>
          </button>
        </div>
      </div>

      {activeMode === 'quiz' ? (
        <DeepfakeQuizView
          onAddXp={onAddXp}
          onOpenCaseLab={() => setActiveMode('forensics')}
        />
      ) : (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Info & Catalog Showcase */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      {t('df_header_title')}
                    </h2>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 font-bold border border-purple-700/50">
                      {DEEPFAKE_CASES.length} Hồ sơ chuyên sâu
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400">
                    {t('df_header_subtitle')}
                  </p>
                </div>
              </div>

              {/* Stepper Navigator Controls */}
              <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
                <button
                  onClick={handlePrevCase}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-800/80 cursor-pointer"
                  title="Hồ sơ trước"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="px-3 py-1 text-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Hồ sơ pháp y</div>
                  <div className="text-xs font-mono font-black text-purple-400">
                    #{currentIndex + 1} / {DEEPFAKE_CASES.length}
                  </div>
                </div>
                <button
                  onClick={handleNextCase}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-800/80 cursor-pointer"
                  title="Hồ sơ kế tiếp"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowFullGrid(!showFullGrid)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    showFullGrid
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>{showFullGrid ? 'Thu Gọn Lưới' : 'Xem Lưới Hồ Sơ'}</span>
                  {showFullGrid ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Filter and Grid Showcase */}
            {showFullGrid && (
              <div className="pt-2 border-t border-slate-800/80 space-y-3 animate-fadeIn">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Media Type & Category Filters */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center space-x-1 mr-1">
                      <Filter className="w-3 h-3" />
                      <span>Lọc:</span>
                    </span>

                    {/* Media Type Pills */}
                    <button
                      onClick={() => setSelectedMediaType('all')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedMediaType === 'all'
                          ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      Tất cả ({DEEPFAKE_CASES.length})
                    </button>
                    <button
                      onClick={() => setSelectedMediaType('voice')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                        selectedMediaType === 'voice'
                          ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Thoại AI Voice</span>
                    </button>
                    <button
                      onClick={() => setSelectedMediaType('video')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                        selectedMediaType === 'video'
                          ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      <Video className="w-3 h-3" />
                      <span>Video Deepfake</span>
                    </button>
                  </div>

                  {/* Search input */}
                  <div className="relative min-w-[200px]">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Tìm đối tượng, kịch bản..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                </div>

                {/* Case Cards Grid - Responsive, Clean & Clear */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                  {filteredCases.map((df) => {
                    const isCurrent = selectedCase.id === df.id;
                    const caseIdx = DEEPFAKE_CASES.findIndex((c) => c.id === df.id);
                    return (
                      <div
                        key={df.id}
                        onClick={() => handleSelectCase(df)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left space-y-2 relative overflow-hidden group ${
                          isCurrent
                            ? 'bg-purple-950/30 border-purple-500/60 ring-1 ring-purple-500/50 shadow-lg shadow-purple-950/40'
                            : 'bg-slate-950/70 hover:bg-slate-950 border-slate-800/90 hover:border-slate-700'
                        }`}
                      >
                        {/* Top Row: Index + Media Type + Category */}
                        <div className="flex items-center justify-between text-[10px]">
                          <div className="flex items-center space-x-1.5">
                            <span
                              className={`font-mono font-black px-1.5 py-0.5 rounded-md ${
                                isCurrent
                                  ? 'bg-purple-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              #{String(caseIdx + 1).padStart(2, '0')}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800 font-semibold flex items-center space-x-1">
                              {df.mediaType === 'voice' ? (
                                <Volume2 className="w-3 h-3 text-purple-400" />
                              ) : (
                                <Video className="w-3 h-3 text-cyan-400" />
                              )}
                              <span>{df.mediaType === 'voice' ? 'Âm Thanh' : 'Video Call'}</span>
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-purple-950/60 text-purple-300 border border-purple-800/40 font-bold">
                            {df.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h4
                          className={`text-xs font-bold leading-snug line-clamp-2 transition-colors ${
                            isCurrent ? 'text-purple-300' : 'text-slate-200 group-hover:text-white'
                          }`}
                        >
                          {df.title}
                        </h4>

                        {/* Caller Info Preview */}
                        <div className="text-[10px] text-slate-400 bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800/80 truncate flex items-center space-x-1.5">
                          <PhoneCall className="w-3 h-3 text-rose-400 shrink-0" />
                          <span className="truncate">{df.callerInfo}</span>
                        </div>

                        {/* Active Ribbon indicator */}
                        {isCurrent && (
                          <div className="absolute top-0 right-0 w-2 h-full bg-purple-500" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Main Forensic Analysis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Simulated Media Feed & Caller Info (6 cols) */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-slate-950 text-purple-300 font-semibold border border-purple-500/30 flex items-center space-x-1.5">
                    {selectedCase.mediaType === 'voice' ? (
                      <Volume2 className="w-3.5 h-3.5" />
                    ) : (
                      <Video className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {selectedCase.mediaType === 'voice'
                        ? 'Bản ghi âm / Thoại clone AI'
                        : 'Cuộc gọi video Deepfake'}
                    </span>
                  </span>
                  <span className="text-slate-400 font-semibold">{selectedCase.category}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">{selectedCase.title}</h3>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center space-x-2 text-xs text-slate-300">
                    <PhoneCall className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span>
                      <strong>Đầu mối gọi:</strong> {selectedCase.callerInfo}
                    </span>
                  </div>
                </div>

                {/* Media Simulation Box */}
                <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 space-y-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto">
                    {selectedCase.mediaType === 'voice' ? (
                      <Volume2 className="w-8 h-8 animate-pulse" />
                    ) : (
                      <Video className="w-8 h-8" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase text-slate-500">
                      Nội dung đoạn hội thoại mô phỏng:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/80 p-4 rounded-2xl border border-slate-800 font-medium italic">
                      "{selectedCase.scenarioText}"
                    </p>
                  </div>

                  {/* Interactive Voice Audio Player Trigger */}
                  <div className="pt-1 flex justify-center">
                    <button
                      type="button"
                      onClick={handleToggleVoice}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-2 cursor-pointer ${
                        isPlayingAudio
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-md shadow-rose-500/10'
                          : 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30'
                      }`}
                    >
                      {isPlayingAudio ? (
                        <>
                          <VolumeX className="w-4 h-4 text-rose-400 animate-pulse" />
                          <span>Dừng Phát Âm Thanh Mô Phỏng</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 text-purple-400" />
                          <span>Nghe Giọng Thoại Mô Phỏng (TTS)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Spectral visualization mock */}
                  <div className="flex items-center justify-center space-x-1 py-2">
                    {[40, 65, 30, 80, 55, 90, 45, 70, 35, 85, 50, 75, 40, 60, 30].map((h, i) => (
                      <div
                        key={i}
                        className={`w-1.5 rounded-full transition-all duration-200 ${
                          isPlayingAudio ? 'bg-purple-400 animate-pulse' : 'bg-purple-500/50'
                        }`}
                        style={{ height: `${h * (isPlayingAudio ? 0.45 : 0.28)}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Action: Run Forensic Scan */}
              <button
                onClick={handleScan}
                disabled={scanning || scanned}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                <Scan className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
                <span>{scanning ? 'Đang Quét Dạng Sóng & Khẩu Hình...' : t('df_btn_scan')}</span>
              </button>
            </div>

            {/* Right: AI Artifacts & Defense Response Formula (6 cols) */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              {scanned ? (
                <div className="space-y-6 animate-fadeIn">
                  {/* Verdict Header */}
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center space-x-3">
                    <ShieldAlert className="w-8 h-8 text-rose-400 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-black uppercase">
                        PHÁT HIỆN PHƯƠNG TIỆN TỔNG HỢP NHÂN TẠO (AI SYNTHETIC)
                      </h4>
                      <span className="text-xs font-medium opacity-90">
                        Đã hoàn thành quét pháp y và cộng +60 XP
                      </span>
                    </div>
                  </div>

                  {/* Artifacts detected */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{t('df_artifacts_detected')}:</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {selectedCase.artifactsDetected.map((item, idx) => (
                        <li
                          key={idx}
                          className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start space-x-2"
                        >
                          <span className="text-rose-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Clues to defeat */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>{t('df_defense_tactics')}:</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {selectedCase.detectionClues.map((clue, idx) => (
                        <li
                          key={idx}
                          className="p-2.5 bg-cyan-950/20 rounded-xl border border-cyan-500/20 flex items-start space-x-2"
                        >
                          <span className="text-cyan-400 font-bold">✓</span>
                          <span>{clue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended response formula */}
                  <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-2xl space-y-1.5">
                    <span className="text-xs font-bold text-purple-300 flex items-center space-x-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{t('df_response_formula')}:</span>
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                      "{selectedCase.recommendedResponse}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12 text-slate-500">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                    <Eye className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-300">
                    Hệ Thống Phân Tích Quang Phổ Đang Chờ
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Nhấn "Chạy Quét Lỗi Tạo Ảnh & Giọng Nói AI" để bóc tách các điểm bất thường và học cách đối phó.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
