import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Swords,
  Send,
  Sparkles,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Info,
  Clock,
  RotateCcw,
  CheckCircle2,
  Lock,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  Eye,
  Shield,
  Check,
  Crown,
  Flame,
  Search,
  Landmark,
  Briefcase,
  Heart,
  ShoppingBag,
  Truck,
  Users,
  Layers,
  Filter,
} from 'lucide-react';
import { ArenaMessage, ArenaSession, ScamScenario, DefenseScoreBreakdown } from '../types';
import { SCAM_SCENARIOS } from '../data/scenarios';
import { useTranslation } from '../i18n/LanguageContext';

interface ScamArenaViewProps {
  selectedScenario?: ScamScenario | null;
  onSelectScenario: (scenario: ScamScenario) => void;
  onComplete: (score: number) => void;
  onAddXp: (amount: number) => void;
}

export const ScamArenaView: React.FC<ScamArenaViewProps> = ({
  selectedScenario,
  onSelectScenario,
  onComplete,
  onAddXp,
}) => {
  const { t } = useTranslation();
  const [activeScenario, setActiveScenario] = useState<ScamScenario>(
    selectedScenario || SCAM_SCENARIOS[0]
  );
  const [session, setSession] = useState<ArenaSession | null>(null);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCounterScripts, setShowCounterScripts] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [exposedWarning, setExposedWarning] = useState<string | null>(null);
  const [showAICoach, setShowAICoach] = useState(true);

  // Scenario picker filters & state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFullGrid, setShowFullGrid] = useState<boolean>(true);

  // Hint penalty state
  const [revealedHintLevel, setRevealedHintLevel] = useState<number>(0);
  const [hintPenalty, setHintPenalty] = useState<number>(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filtered scenarios
  const filteredScenarios = useMemo(() => {
    return SCAM_SCENARIOS.filter((sc) => {
      const matchCategory = selectedCategory === 'all' || sc.category === selectedCategory;
      const matchDifficulty = selectedDifficulty === 'all' || sc.difficulty === selectedDifficulty;
      const matchSearch =
        searchQuery.trim() === '' ||
        sc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sc.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sc.attackerProfile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sc.attackerProfile.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sc.tactics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchDifficulty && matchSearch;
    });
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  const currentIndex = SCAM_SCENARIOS.findIndex((s) => s.id === activeScenario.id);

  const handleSelectCase = (sc: ScamScenario) => {
    setActiveScenario(sc);
    onSelectScenario(sc);
    startSimulation(sc.id);
  };

  const handlePrevScenario = () => {
    const prevIdx = currentIndex > 0 ? currentIndex - 1 : SCAM_SCENARIOS.length - 1;
    const target = SCAM_SCENARIOS[prevIdx];
    handleSelectCase(target);
  };

  const handleNextScenario = () => {
    const nextIdx = currentIndex < SCAM_SCENARIOS.length - 1 ? currentIndex + 1 : 0;
    const target = SCAM_SCENARIOS[nextIdx];
    handleSelectCase(target);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Banking':
        return <Landmark className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Government':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
      case 'Jobs':
        return <Briefcase className="w-3.5 h-3.5 text-amber-400" />;
      case 'Romance':
        return <Heart className="w-3.5 h-3.5 text-pink-400" />;
      case 'Marketplace':
        return <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Delivery':
        return <Truck className="w-3.5 h-3.5 text-blue-400" />;
      case 'Family Emergency':
        return <Users className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'Banking':
        return 'Ngân Hàng';
      case 'Government':
        return 'Công Quyền & Thuế';
      case 'Jobs':
        return 'Việc Làm & CTV';
      case 'Romance':
        return 'Tình Cảm & Bạn Bè';
      case 'Marketplace':
        return 'Mua Sắm & Voucher';
      case 'Delivery':
        return 'Vận Chuyển & Vé Máy Bay';
      case 'Family Emergency':
        return 'Khẩn Cấp Gia Đình';
      default:
        return category;
    }
  };

  // Check for stored session on mount or when scenario changes
  useEffect(() => {
    if (selectedScenario) {
      setActiveScenario(selectedScenario);
      startSimulation(selectedScenario.id);
    } else {
      const savedSessionJson = localStorage.getItem('scamguard_active_arena_session');
      if (savedSessionJson) {
        try {
          const parsed = JSON.parse(savedSessionJson);
          if (parsed && parsed.status === 'active') {
            setSession(parsed);
            const sc = SCAM_SCENARIOS.find((s) => s.id === parsed.scenarioId);
            if (sc) setActiveScenario(sc);
            return;
          }
        } catch (e) {}
      }
      startSimulation(SCAM_SCENARIOS[0].id);
    }
  }, [selectedScenario]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (session) {
      localStorage.setItem('scamguard_active_arena_session', JSON.stringify(session));
    }
  }, [session?.messages]);

  const startSimulation = async (scenarioId: string) => {
    setLoading(true);
    setRevealedHintLevel(0);
    setHintPenalty(0);
    setExposedWarning(null);
    setShowScoreModal(false);

    try {
      const res = await fetch('/api/arena/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId }),
      });

      if (res.ok) {
        const data = await res.json();
        setSession(data.session);
      } else {
        // Fallback local init
        const sc = SCAM_SCENARIOS.find((s) => s.id === scenarioId) || SCAM_SCENARIOS[0];
        setSession({
          id: `arena_${Date.now()}`,
          scenarioId: sc.id,
          scenario: sc,
          messages: [
            {
              id: 'msg_0',
              sender: 'scammer',
              text: sc.initialMessage,
              timestamp: 'Vừa xong',
              detectedTactic: sc.tactics[0],
            },
          ],
          currentPressure: 35,
          trustLevel: 10,
          detectedTactics: [sc.tactics[0]],
          timeline: [],
          status: 'active',
          startTime: Date.now(),
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUseHint = (level: number) => {
    if (level <= revealedHintLevel) return;
    setRevealedHintLevel(level);
    const penalty = level === 1 ? 5 : level === 2 ? 10 : 20;
    setHintPenalty((prev) => Math.max(prev, penalty));
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || userInput;
    if (!messageText.trim() || !session || loading) return;

    setUserInput('');
    setLoading(true);

    // Heuristic client PII warning
    const lower = messageText.toLowerCase();
    if (/\b\d{4,6}\b/.test(lower) && (lower.includes('otp') || lower.includes('mã') || lower.includes('pass'))) {
      setExposedWarning('Cảnh báo nguy hiểm: Bạn vừa nhập mã dạng OTP/Mật khẩu. Kẻ gian có thể chiếm quyền tài khoản!');
    } else if (lower.includes('chuyển') && (lower.includes('triệu') || lower.includes('nghìn') || lower.includes('k'))) {
      setExposedWarning('Cảnh báo: Bạn đang chấp thuận chuyển tiền. Luôn xác minh độc lập trước khi giao dịch!');
    }

    try {
      const res = await fetch('/api/arena/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          message: messageText,
          scenarioId: session.scenarioId,
          messages: session.messages,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSession(data.session);
        if (data.evaluation?.sessionEnded) {
          handleEndSession(data.session.id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async (targetSessionId?: string) => {
    const sId = targetSessionId || session?.id;
    if (!sId) return;
    setLoading(true);

    try {
      const res = await fetch('/api/arena/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sId,
          scenarioId: session?.scenarioId,
          messages: session?.messages,
          sessionData: session || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const finalSession: ArenaSession = data.session;
        // Apply hint penalty if any
        if (finalSession.defenseScore && hintPenalty > 0) {
          finalSession.defenseScore.overallScore = Math.max(
            10,
            finalSession.defenseScore.overallScore - hintPenalty
          );
        }
        setSession(finalSession);
        setShowScoreModal(true);
        localStorage.removeItem('scamguard_active_arena_session');
        onComplete(finalSession.defenseScore?.overallScore || 85);
        onAddXp(120);
      } else {
        // Graceful client-side fallback if server fails
        const fallbackScore = {
          overallScore: Math.max(10, 80 - hintPenalty),
          tier: 'Đang Rèn Luyện' as const,
          scamRecognition: 75,
          verificationBehavior: 70,
          emotionalControl: 75,
          refusalBehavior: 80,
          informationProtection: 85,
          independentVerification: 70,
          responseTimeScore: 80,
        };
        const concludedSession: ArenaSession = {
          ...session!,
          status: 'completed',
          endTime: Date.now(),
          defenseScore: fallbackScore,
          feedbackSummary: 'Đã hoàn thành phiên diễn tập và phân tích hành vi phòng vệ.',
          whatCouldYouHaveDone: [
            'Luôn kiểm tra số hotline chính thức in ở mặt sau thẻ ngân hàng.',
            'Yêu cầu giấy triệu tập hoặc văn bản chính thức thay vì làm việc qua mạng.',
          ],
        };
        setSession(concludedSession);
        setShowScoreModal(true);
        localStorage.removeItem('scamguard_active_arena_session');
        onComplete(fallbackScore.overallScore);
        onAddXp(120);
      }
    } catch (e) {
      console.error('Error concluding arena session:', e);
      setShowScoreModal(true);
      localStorage.removeItem('scamguard_active_arena_session');
    } finally {
      setLoading(false);
    }
  };

  const [showFakeBankSandbox, setShowFakeBankSandbox] = useState(false);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Fake Banking UI Modal / Sandbox */}
      {showFakeBankSandbox && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowFakeBankSandbox(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              ✕
            </button>
            <div className="text-center space-y-2">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500 text-[11px] font-black uppercase">
                MÔ PHỎNG GIAO DIỆN NGÂN HÀNG GIẢ MẠO (FAKE BANK UI)
              </span>
              <h3 className="text-lg font-black text-white">Giao Diện Dụ Nhập Mã OTP Ngân Hàng</h3>
              <p className="text-xs text-slate-300">
                Kẻ lừa đảo thường tạo các trang web có màu sắc, logo y hệt ứng dụng Vietcombank/BIDV/Techcombank để dụ bạn gõ mã OTP.
              </p>
            </div>

            {/* Fake Bank Form UI Preview */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-black text-cyan-400">🌐 vcb-digibank.ebank-xacthuc.xyz</span>
                <span className="text-[10px] text-rose-400 font-bold">⚠️ TÊN MIỀN ĐỘC HẠI</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Tên đăng nhập VCB Digibank:</label>
                  <input
                    type="text"
                    disabled
                    value="0982***102"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Mật khẩu ứng dụng:</label>
                  <input
                    type="password"
                    disabled
                    value="••••••••"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-300"
                  />
                </div>
                <div className="p-3 bg-amber-950/60 border border-amber-800 rounded-xl space-y-1 text-amber-200">
                  <p className="font-bold text-[11px]">🔐 Mã Xác Thực OTP Hủy Giao Dịch 35.000.000đ:</p>
                  <input
                    type="text"
                    placeholder="Nhập 6 số OTP vừa nhận từ SMS..."
                    className="w-full bg-slate-900 border border-rose-500 rounded-lg p-2 text-rose-300 font-mono text-center font-bold"
                  />
                  <p className="text-[10px] text-rose-300 font-semibold">
                    ⛔ CẢNH BÁO: Nhập OTP vào đây sẽ lập tức chuyển tiền sang tài khoản kẻ lừa đảo!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFakeBankSandbox(false)}
              className="w-full py-3 rounded-2xl bg-cyan-500 text-slate-950 font-black text-xs hover:bg-cyan-400 cursor-pointer"
            >
              ĐÃ HIỂU CƠ CHẾ - QUAY LẠI TÁC CHIẾN
            </button>
          </div>
        </div>
      )}
      {/* Scenario Selection Section */}
      <div className="bg-slate-900 border border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 mt-6">
        {/* Header & Main Stats */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center space-x-2.5">
              <Swords className="w-5 h-5 text-cyan-400" />
              <span className="uppercase tracking-wider">{t('arena_choose_scenario')}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Thực chiến đối thoại trực tiếp với các kịch bản lừa đảo qua mạng phổ biến và tinh vi nhất tại Việt Nam
            </p>
          </div>

          {/* Stepper Controls & Grid Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-2xl p-1 shadow-inner">
              <button
                onClick={handlePrevScenario}
                title="Kịch bản trước"
                className="px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Trước</span>
              </button>
              <div className="px-3 py-1 font-mono text-xs font-black text-cyan-400 border-x border-slate-800/80">
                #{String(currentIndex + 1).padStart(2, '0')} / {SCAM_SCENARIOS.length}
              </div>
              <button
                onClick={handleNextScenario}
                title="Kịch bản kế tiếp"
                className="px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
              >
                <span className="hidden sm:inline">Tiếp</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setShowFullGrid(!showFullGrid)}
              className="px-3 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700/80 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showFullGrid ? 'Thu Gọn Lưới' : `Mở Lưới Toàn Bộ (${SCAM_SCENARIOS.length})`}</span>
              {showFullGrid ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Search Bar & Category Filter Pills */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-80 flex-shrink-0">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kịch bản, kẻ gian, chiêu trò..."
                className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-cyan-500 rounded-2xl pl-10 pr-8 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full pb-1 sm:pb-0">
              <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center space-x-1 mr-1">
                <Filter className="w-3 h-3" />
                <span>Độ khó:</span>
              </span>
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'Beginner', label: 'Dễ' },
                { id: 'Intermediate', label: 'Trung bình' },
                { id: 'Advanced', label: 'Khó' },
                { id: 'Expert', label: 'Chuyên gia' },
              ].map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedDifficulty === diff.id
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>Tất Cả ({SCAM_SCENARIOS.length})</span>
            </button>
            {[
              { id: 'Banking', label: 'Ngân Hàng', icon: Landmark },
              { id: 'Government', label: 'Công Quyền & Thuế', icon: ShieldAlert },
              { id: 'Jobs', label: 'Việc Làm & CTV', icon: Briefcase },
              { id: 'Romance', label: 'Tình Cảm & Bạn Bè', icon: Heart },
              { id: 'Marketplace', label: 'Mua Sắm & Voucher', icon: ShoppingBag },
              { id: 'Delivery', label: 'Vận Chuyển & Vé Bay', icon: Truck },
              { id: 'Family Emergency', label: 'Khẩn Cấp Gia Đình', icon: Users },
            ].map((cat) => {
              const IconComp = cat.icon;
              const count = SCAM_SCENARIOS.filter((s) => s.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{cat.label} ({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Compact Summary when Grid is Collapsed */}
        {!showFullGrid && (
          <div className="p-4 bg-slate-950 border border-cyan-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-black text-sm">
                #{String(currentIndex + 1).padStart(2, '0')}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-black text-[10px] uppercase">
                    {getCategoryLabel(activeScenario.category)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {activeScenario.attackerProfile.name} • {activeScenario.attackerProfile.organization}
                  </span>
                </div>
                <h4 className="text-sm font-black text-white mt-0.5">{activeScenario.title}</h4>
              </div>
            </div>
            <button
              onClick={() => setShowFullGrid(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs hover:bg-cyan-400 transition-all cursor-pointer whitespace-nowrap"
            >
              Đổi Kịch Bản Khác ({SCAM_SCENARIOS.length})
            </button>
          </div>
        )}

        {/* Full Responsive Multi-Column Grid */}
        {showFullGrid && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Hiển thị <strong className="text-cyan-400">{filteredScenarios.length}</strong> / {SCAM_SCENARIOS.length} kịch bản tác chiến</span>
              {filteredScenarios.length === 0 && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedDifficulty('all');
                    setSearchQuery('');
                  }}
                  className="text-cyan-400 font-bold hover:underline cursor-pointer"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>

            {filteredScenarios.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-sm font-bold text-slate-300">Không tìm thấy kịch bản nào phù hợp</p>
                <p className="text-xs text-slate-500">Hãy thử xóa bộ lọc hoặc đổi từ khóa tìm kiếm</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredScenarios.map((sc) => {
                  const isSelected = activeScenario.id === sc.id;
                  const scenarioGlobalIndex = SCAM_SCENARIOS.findIndex((s) => s.id === sc.id);

                  // Difficulty styling
                  let diffLabel = 'Dễ';
                  let diffColor = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
                  let DiffIcon = ShieldCheck;

                  if (sc.difficulty === 'Intermediate') {
                    diffLabel = 'Trung bình';
                    diffColor = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
                    DiffIcon = Zap;
                  } else if (sc.difficulty === 'Advanced') {
                    diffLabel = 'Khó';
                    diffColor = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
                    DiffIcon = AlertTriangle;
                  } else if (sc.difficulty === 'Expert') {
                    diffLabel = 'Chuyên gia';
                    diffColor = 'bg-rose-500/15 text-rose-300 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)]';
                    DiffIcon = Crown;
                  }

                  return (
                    <div
                      key={sc.id}
                      onClick={() => handleSelectCase(sc)}
                      className={`relative overflow-hidden cursor-pointer rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between group ${
                        isSelected
                          ? 'bg-slate-900 border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.25)] ring-2 ring-cyan-400/40 scale-[1.02] z-10'
                          : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/90 hover:scale-[1.01]'
                      }`}
                    >
                      {/* Active selection ribbon */}
                      {isSelected && (
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-blue-500 text-slate-950 text-[9px] font-black tracking-widest px-3 py-1 rounded-bl-xl uppercase shadow-md">
                          ĐANG TÁC CHIẾN
                        </div>
                      )}

                      <div className="space-y-3">
                        {/* Top Meta Badges */}
                        <div className="flex items-center justify-between text-xs pr-10">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-black text-xs px-2 py-0.5 rounded-lg bg-slate-800 text-cyan-400 border border-slate-700/80">
                              #{String(scenarioGlobalIndex + 1).padStart(2, '0')}
                            </span>
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-extrabold border border-slate-700 text-[10px] tracking-wide uppercase">
                              {getCategoryIcon(sc.category)}
                              <span>{getCategoryLabel(sc.category)}</span>
                            </span>
                          </div>

                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wide ${diffColor}`}
                          >
                            <DiffIcon className="w-3 h-3" />
                            <span>{diffLabel}</span>
                          </span>
                        </div>

                        {/* Title & Subtitle */}
                        <div>
                          <h4 className="text-sm font-black text-white leading-snug group-hover:text-cyan-300 transition-colors">
                            {sc.title}
                          </h4>
                          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mt-1.5">
                            {sc.subtitle}
                          </p>
                        </div>

                        {/* Attacker Profile Tag */}
                        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-[11px] text-slate-400 space-y-0.5">
                          <p className="font-bold text-slate-300 flex items-center space-x-1">
                            <span className="text-rose-400">⚠️</span>
                            <span className="truncate">{sc.attackerProfile.name}</span>
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {sc.attackerProfile.organization}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="flex items-center justify-between pt-3.5 mt-3.5 border-t border-slate-800/60 text-[11px] font-medium text-slate-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>~{sc.estimatedMinutes} phút</span>
                        </span>
                        <span className="text-cyan-400 font-bold group-hover:underline inline-flex items-center space-x-0.5">
                          <span>Vào tác chiến</span>
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Interactive Arena Area */}
      {session && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Top: Live Conversation Screen (8 Cols) */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between min-h-[580px] space-y-4">
            {/* Header info bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-black text-sm">
                  ⚠️
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{activeScenario.attackerProfile.name}</h4>
                  <p className="text-xs text-slate-400">
                    {activeScenario.attackerProfile.organization} • {activeScenario.attackerProfile.contactHandle}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowFakeBankSandbox(true)}
                  className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/40 cursor-pointer flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Soi Fake Bank UI</span>
                </button>
                <button
                  onClick={() => startSimulation(activeScenario.id)}
                  title="Bắt đầu lại kịch bản này"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEndSession()}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                >
                  {t('arena_btn_end')}
                </button>
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[380px]">
              {session.messages.map((msg) => {
                const isScammer = msg.sender === 'scammer';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isScammer ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-md ${
                        isScammer
                          ? 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-sm'
                          : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-sm'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>

                    {/* Scammer Tactic Badge if detected */}
                    {isScammer && msg.detectedTactic && (
                      <div className="mt-1.5 flex items-center space-x-1.5 text-[11px] text-purple-400 font-semibold">
                        <Zap className="w-3 h-3 text-purple-400" />
                        <span>Đòn tâm lý: {msg.detectedTactic}</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-center space-x-2 text-xs text-slate-400 italic py-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Đối phương đang phản hồi và gia tăng áp lực...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* PII / Error Warning if any */}
            {exposedWarning && (
              <div className="p-3 bg-amber-500/15 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{exposedWarning}</span>
              </div>
            )}

            {/* Input & Counter-Script Tools */}
            <div className="space-y-3 pt-2">
              {/* Counter-script quick chips */}
              {showCounterScripts && activeScenario.counterScripts && (
                <div className="p-3 bg-slate-950 rounded-2xl border border-cyan-500/30 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
                    <span className="flex items-center space-x-1">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>{t('arena_btn_counter_script')}</span>
                    </span>
                    <button
                      onClick={() => setShowCounterScripts(false)}
                      className="text-slate-400 hover:text-slate-200"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-2">
                    {activeScenario.counterScripts.map((cs, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          handleSendMessage(cs.recommendedText);
                          setShowCounterScripts(false);
                        }}
                        className="cursor-pointer p-2.5 bg-slate-900 hover:bg-cyan-950/50 rounded-xl border border-slate-800 hover:border-cyan-500/40 text-xs transition-colors"
                      >
                        <p className="font-bold text-slate-200">"{cs.recommendedText}"</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Mục đích: {cs.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCounterScripts(!showCounterScripts)}
                  title={t('arena_counter_script_tooltip')}
                  className={`px-3.5 py-3.5 rounded-2xl border text-xs font-black tracking-wide transition-all duration-200 flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                    showCounterScripts
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-950 border-slate-800 text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 hover:bg-slate-900'
                  }`}
                >
                  <Lightbulb className="w-4 h-4 animate-pulse" />
                  <span className="hidden sm:inline">Mẫu Phản Đòn</span>
                </button>

                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder={t('arena_input_placeholder')}
                  className="flex-1 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-cyan-500 rounded-2xl px-5 py-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none transition-all"
                />

                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!userInput.trim() || loading}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs sm:text-sm shadow-[0_4px_12px_rgba(6,182,212,0.25)] hover:shadow-[0_4px_20px_rgba(6,182,212,0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>Gửi tin</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Psychological Telemetry & Live Stats (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Pressure Gauge - Redesigned into high-tech modern Circular Gauge */}
            <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-5 text-center flex flex-col items-center">
              <div className="w-full flex items-center justify-between border-b border-slate-800/60 pb-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>ÁP LỰC TRẬN ĐẤU</span>
                </h4>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-mono font-bold text-slate-300">TELEMETRY</span>
              </div>

              {/* Gauge Graph */}
              <div className="relative flex flex-col items-center justify-center pt-2">
                <svg className="w-44 h-28" viewBox="0 0 100 60">
                  {/* Background Arc */}
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#181e29"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Active Gradient Arc */}
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="url(#pressureGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="126"
                    strokeDashoffset={126 - (126 * Math.min(100, session.currentPressure)) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                  {/* Needle pointing */}
                  <g transform={`rotate(${((Math.min(100, session.currentPressure) / 100) * 180) - 90} 50 50)`} className="transition-all duration-1000 ease-out">
                    <line x1="50" y1="50" x2="50" y2="18" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="4.5" fill="#f43f5e" />
                  </g>
                  <defs>
                    <linearGradient id="pressureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="60%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#f43f5e" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Gauge Label Overlay */}
                <div className="absolute bottom-1 text-center">
                  <span className="text-3xl font-black text-white tracking-tight">{session.currentPressure}%</span>
                  <p className={`text-[9px] font-black uppercase tracking-wider mt-0.5 ${
                    session.currentPressure > 70
                      ? 'text-rose-400 animate-pulse'
                      : session.currentPressure > 40
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}>
                    {session.currentPressure > 70 ? '⚠️ DỒN ÉP CỰC ĐỘ' : session.currentPressure > 40 ? 'ÁP LỰC GIA TĂNG' : 'TÂM LÝ ỔN ĐỊNH'}
                  </p>
                </div>
              </div>

              {/* Score breakdown helper */}
              <p className="text-xs text-slate-400 leading-relaxed max-w-[210px] mx-auto">
                Tỷ lệ chống trả, giữ vững thông tin mật giúp hạ gục áp lực thao túng của đối phương.
              </p>
            </div>

            {/* Cố Vấn Cyber AI Thông Minh - Redesigned, interactive pop-up */}
            {showAICoach && (
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/20 border border-cyan-500/30 rounded-3xl p-5 shadow-2xl space-y-4 animate-scaleUp">
                {/* Close button - larger & styled */}
                <button
                  onClick={() => setShowAICoach(false)}
                  className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer text-sm font-bold shadow"
                  title="Tạm đóng cố vấn"
                >
                  ✕
                </button>

                <div className="flex items-start space-x-3.5">
                  {/* Glowing Holographic Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] animate-pulse">
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border border-slate-950"></div>
                  </div>

                  <div className="space-y-1 flex-1 pr-4">
                    <h5 className="text-xs font-black text-cyan-400 uppercase tracking-widest flex items-center space-x-1">
                      <span>TRỢ LÝ VỆ BINH AI</span>
                    </h5>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {revealedHintLevel > 0 
                        ? `Chỉ dẫn phản công: ${activeScenario.hints[revealedHintLevel - 1]?.text}`
                        : "Kẻ gian đang cố tình thao túng tâm lý bạn. Hãy rà soát tên miền lạ, từ chối nhấp link và tuyệt đối bảo mật OTP!"}
                    </p>
                  </div>
                </div>

                {/* Sub-actions in Coach */}
                <div className="flex items-center space-x-2 pt-1 border-t border-slate-800/50">
                  <button
                    onClick={() => {
                      const nextLevel = Math.min(3, revealedHintLevel + 1);
                      handleUseHint(nextLevel);
                    }}
                    disabled={revealedHintLevel >= 3}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-[0_0_10px_rgba(6,182,212,0.3)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center space-x-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{revealedHintLevel >= 3 ? 'Hết gợi ý' : 'Cần Hỗ Trợ Gấp (-10%)'}</span>
                  </button>
                  
                  <button
                    onClick={() => setShowCounterScripts(true)}
                    className="px-3 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-extrabold text-[11px] cursor-pointer"
                  >
                    Mẫu Phản Kích
                  </button>
                </div>
              </div>
            )}

            {/* Summons advisor overlay state when closed */}
            {!showAICoach && (
              <button
                onClick={() => setShowAICoach(true)}
                className="w-full py-3 rounded-2xl bg-slate-950 border border-dashed border-cyan-500/30 hover:border-cyan-500/70 hover:bg-slate-900 text-cyan-400 hover:text-cyan-300 text-xs font-black tracking-wide transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer shadow-inner animate-pulse"
              >
                <Sparkles className="w-4 h-4" />
                <span>TRIỆU HỒI CỐ VẤN CYBER AI</span>
              </button>
            )}

            {/* Tactical Hint System with Penalties */}
            <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/50 pb-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                  <Info className="w-4 h-4" />
                  <span>KHO HƯỚNG DẪN CHIẾN THUẬT</span>
                </h4>
                {hintPenalty > 0 && (
                  <span className="text-[10px] font-black bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                    Trừ {hintPenalty}% điểm
                  </span>
                )}
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                {activeScenario.hints.map((hint) => {
                  const isRevealed = revealedHintLevel >= hint.level;
                  const penaltyText = hint.level === 1 ? '-5%' : hint.level === 2 ? '-10%' : '-20%';
                  return (
                    <div key={hint.level} className={`p-4 rounded-2xl border transition-all duration-200 ${
                      isRevealed 
                        ? 'bg-slate-950/80 border-cyan-500/30' 
                        : 'bg-slate-950/30 border-slate-800/50'
                    } space-y-2`}>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-300">Gợi ý Cấp {hint.level}</span>
                        {!isRevealed ? (
                          <button
                            onClick={() => handleUseHint(hint.level)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 text-[10px] font-extrabold border border-slate-700/80 cursor-pointer"
                          >
                            Mở khóa ({penaltyText})
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-black flex items-center space-x-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>ĐÃ MỞ</span>
                          </span>
                        )}
                      </div>
                      {isRevealed ? (
                        <p className="text-slate-200 leading-relaxed font-medium">{hint.text}</p>
                      ) : (
                        <p className="text-slate-500 italic leading-relaxed">Nhấp để giải mã điểm yếu bảo mật của tình huống.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Dimensional Defense Score Modal */}
      {showScoreModal && session && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {t('arena_score_title')}
              </h3>
              <p className="text-xs text-slate-400">
                Tình huống: "{activeScenario.title}"
              </p>
            </div>

            {/* Overall Score Ring */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-1">
              <span className="text-xs font-bold uppercase text-slate-400">
                Điểm Phòng Thủ Đa Chiều
              </span>
              <div className="text-5xl font-black text-emerald-400">
                {session.defenseScore?.overallScore || 88}/100
              </div>
              <div className="text-sm font-bold text-white">
                Hạng: {session.defenseScore?.tier || 'Vệ Binh Vững Vàng'}
              </div>
              <div className="text-xs font-bold text-cyan-400">+120 XP Điểm Kinh Nghiệm</div>
            </div>

            {/* 7-Dimensional Breakdown */}
            {session.defenseScore && (
              <div className="space-y-2 p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
                <h4 className="font-bold text-slate-300 mb-2">Chi Tiết 7 Trụ Cột Phòng Vệ:</h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nhận diện lừa đảo (20%):</span>
                    <span className="font-bold text-white">{session.defenseScore.scamRecognition}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hành vi đòi xác minh (20%):</span>
                    <span className="font-bold text-white">{session.defenseScore.verificationBehavior}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kiểm soát cảm xúc (15%):</span>
                    <span className="font-bold text-white">{session.defenseScore.emotionalControl}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hành vi từ chối dứt khoát (15%):</span>
                    <span className="font-bold text-white">{session.defenseScore.refusalBehavior}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bảo vệ thông tin mật (15%):</span>
                    <span className="font-bold text-white">{session.defenseScore.informationProtection}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Xác minh độc lập (10%):</span>
                    <span className="font-bold text-white">{session.defenseScore.independentVerification}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* AI Coach Feedback */}
            <div className="space-y-2 text-xs text-slate-300">
              <h4 className="font-bold text-white">Nhận Xét Của Huấn Luyện Viên AI:</h4>
              <p className="leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                {session.feedbackSummary ||
                  'Bạn đã có phản xạ tốt khi không vội vàng cung cấp thông tin bí mật. Cần tiếp tục duy trì thói quen xác minh qua số hotline in ở mặt sau thẻ vật lý.'}
              </p>
            </div>

            {/* What Could You Have Done */}
            {session.whatCouldYouHaveDone && (
              <div className="space-y-2 text-xs text-slate-300">
                <h4 className="font-bold text-emerald-400">Hành Động Tối Ưu Bạn Nên Làm:</h4>
                <ul className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  {session.whatCouldYouHaveDone.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowScoreModal(false);
                  startSimulation(activeScenario.id);
                }}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                {t('arena_score_btn_retry')}
              </button>

              <button
                onClick={() => {
                  setShowScoreModal(false);
                }}
                className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
              >
                {t('arena_score_btn_next')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
