import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Award,
  RefreshCw,
  Check,
  Smartphone,
  Mail,
  Globe,
  PhoneCall,
  ArrowUp,
  ArrowDown,
  Search,
  Zap,
} from 'lucide-react';
import {
  DuolingoLesson,
  DuolingoUnit,
  PracticeQuestion,
  RedFlagSpot,
  DragDropItem,
  SequenceStepItem,
} from '../data/duolingoLessons';

interface DuolingoLessonRunnerProps {
  lesson: DuolingoLesson;
  unit: DuolingoUnit;
  isOpen: boolean;
  onClose: () => void;
  onCompleteLesson: (lessonId: string, earnedXp: number, shieldBadge: string) => void;
}

type LessonPhase = 'theory' | 'practice' | 'story' | 'reward';

export const DuolingoLessonRunner: React.FC<DuolingoLessonRunnerProps> = ({
  lesson,
  unit,
  isOpen,
  onClose,
  onCompleteLesson,
}) => {
  const [phase, setPhase] = useState<LessonPhase>('theory');
  const [hearts, setHearts] = useState<number>(3);
  const [practiceIndex, setPracticeIndex] = useState<number>(0);

  // Multiple Choice state
  const [selectedMcOption, setSelectedMcOption] = useState<string | null>(null);
  const [isMcChecked, setIsMcChecked] = useState<boolean>(false);

  // True/False state
  const [selectedTf, setSelectedTf] = useState<boolean | null>(null);
  const [isTfChecked, setIsTfChecked] = useState<boolean>(false);

  // Matching pairs state
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [wrongMatch, setWrongMatch] = useState<boolean>(false);

  // Spot Red Flags state
  const [tappedSpotIds, setTappedSpotIds] = useState<string[]>([]);
  const [isSpotChecked, setIsSpotChecked] = useState<boolean>(false);

  // Drag Drop Zone state
  const [dragAssignments, setDragAssignments] = useState<Record<string, 'safe' | 'suspicious' | 'scam'>>({});
  const [isDragChecked, setIsDragChecked] = useState<boolean>(false);

  // Sequence Order state
  const [currentSequence, setCurrentSequence] = useState<SequenceStepItem[]>([]);
  const [isSeqChecked, setIsSeqChecked] = useState<boolean>(false);

  // Chat Decision state
  const [selectedChatChoice, setSelectedChatChoice] = useState<string | null>(null);
  const [isChatChecked, setIsChatChecked] = useState<boolean>(false);

  // URL Dissection state
  const [selectedUrlPart, setSelectedUrlPart] = useState<string | null>(null);
  const [isUrlChecked, setIsUrlChecked] = useState<boolean>(false);

  // Story state
  const [selectedStoryChoice, setSelectedStoryChoice] = useState<string | null>(null);
  const [isStoryChecked, setIsStoryChecked] = useState<boolean>(false);

  // Reset states when lesson changes or opens
  useEffect(() => {
    if (isOpen) {
      setPhase('theory');
      setHearts(3);
      setPracticeIndex(0);
      resetQuestionStates();
    }
  }, [isOpen, lesson.id]);

  const resetQuestionStates = () => {
    setSelectedMcOption(null);
    setIsMcChecked(false);
    setSelectedTf(null);
    setIsTfChecked(false);
    setSelectedLeftId(null);
    setMatchedPairs({});
    setWrongMatch(false);
    setTappedSpotIds([]);
    setIsSpotChecked(false);
    setDragAssignments({});
    setIsDragChecked(false);
    setCurrentSequence([]);
    setIsSeqChecked(false);
    setSelectedChatChoice(null);
    setIsChatChecked(false);
    setSelectedUrlPart(null);
    setIsUrlChecked(false);
    setSelectedStoryChoice(null);
    setIsStoryChecked(false);
  };

  if (!isOpen) return null;

  const currentQuestion: PracticeQuestion | undefined = lesson.practice[practiceIndex];

  // Initialize sequence items when sequence question is reached
  useEffect(() => {
    if (currentQuestion?.type === 'order_sequence' && currentQuestion.sequenceItems) {
      // Shuffle initially
      const shuffled = [...currentQuestion.sequenceItems].sort(() => Math.random() - 0.5);
      setCurrentSequence(shuffled);
    }
  }, [practiceIndex, currentQuestion?.id]);

  // Calculate overall progress percentage
  const getProgressPercentage = () => {
    if (phase === 'theory') return 15;
    if (phase === 'practice') {
      const totalP = lesson.practice.length || 1;
      return Math.round(20 + ((practiceIndex + 1) / totalP) * 55);
    }
    if (phase === 'story') return 88;
    if (phase === 'reward') return 100;
    return 0;
  };

  // Check Multiple Choice
  const handleCheckMc = () => {
    if (!selectedMcOption || !currentQuestion) return;
    setIsMcChecked(true);
    const chosen = currentQuestion.options?.find((o) => o.id === selectedMcOption);
    if (!chosen?.isCorrect) {
      setHearts((h) => Math.max(1, h - 1));
    }
  };

  // Check True/False
  const handleCheckTf = () => {
    if (selectedTf === null || !currentQuestion) return;
    setIsTfChecked(true);
    if (selectedTf !== currentQuestion.trueFalseAnswer?.isTrue) {
      setHearts((h) => Math.max(1, h - 1));
    }
  };

  // Handle Matching click
  const handleLeftMatchClick = (id: string) => {
    if (matchedPairs[id]) return;
    setSelectedLeftId(id);
    setWrongMatch(false);
  };

  const handleRightMatchClick = (rightItem: { id: string; text: string; matchesLeftId: string }) => {
    if (!selectedLeftId) return;
    if (Object.values(matchedPairs).includes(rightItem.id)) return;

    if (rightItem.matchesLeftId === selectedLeftId) {
      setMatchedPairs((prev) => ({ ...prev, [selectedLeftId]: rightItem.id }));
      setSelectedLeftId(null);
      setWrongMatch(false);
    } else {
      setWrongMatch(true);
      setTimeout(() => setWrongMatch(false), 800);
    }
  };

  const isMatchingComplete =
    currentQuestion?.matchingPairs &&
    Object.keys(matchedPairs).length === currentQuestion.matchingPairs.length;

  // Handle Spot Red Flags click
  const handleToggleSpot = (spotId: string) => {
    if (isSpotChecked) return;
    if (tappedSpotIds.includes(spotId)) {
      setTappedSpotIds((prev) => prev.filter((id) => id !== spotId));
    } else {
      setTappedSpotIds((prev) => [...prev, spotId]);
    }
  };

  const handleCheckSpot = () => {
    setIsSpotChecked(true);
    const spots = currentQuestion?.spotData?.spots || [];
    const correctSpotIds = spots.filter((s) => s.isRedFlag).map((s) => s.id);
    const allFound = correctSpotIds.every((id) => tappedSpotIds.includes(id));
    if (!allFound) {
      setHearts((h) => Math.max(1, h - 1));
    }
  };

  // Handle Drag / Assign Category
  const handleAssignCategory = (itemId: string, category: 'safe' | 'suspicious' | 'scam') => {
    if (isDragChecked) return;
    setDragAssignments((prev) => ({ ...prev, [itemId]: category }));
  };

  const handleCheckDrag = () => {
    setIsDragChecked(true);
    const items = currentQuestion?.dragDropItems || [];
    const hasError = items.some((item) => dragAssignments[item.id] !== item.correctCategory);
    if (hasError) {
      setHearts((h) => Math.max(1, h - 1));
    }
  };

  // Handle Sequence Reorder
  const handleMoveSequenceStep = (index: number, direction: 'up' | 'down') => {
    if (isSeqChecked) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentSequence.length) return;

    const newSeq = [...currentSequence];
    const temp = newSeq[index];
    newSeq[index] = newSeq[targetIdx];
    newSeq[targetIdx] = temp;
    setCurrentSequence(newSeq);
  };

  const handleCheckSequence = () => {
    setIsSeqChecked(true);
    const isCorrectOrder = currentSequence.every((item, idx) => item.correctOrder === idx + 1);
    if (!isCorrectOrder) {
      setHearts((h) => Math.max(1, h - 1));
    }
  };

  // Handle URL Dissection
  const handleCheckUrl = () => {
    if (!selectedUrlPart) return;
    setIsUrlChecked(true);
    if (selectedUrlPart !== currentQuestion?.urlData?.deceptivePart) {
      setHearts((h) => Math.max(1, h - 1));
    }
  };

  // Handle Story Choice check
  const handleCheckStory = () => {
    if (!selectedStoryChoice) return;
    setIsStoryChecked(true);
    const lastMsg = lesson.story.dialogue[lesson.story.dialogue.length - 1];
    const choice = lastMsg.choices?.find((c) => c.id === selectedStoryChoice);
    if (!choice?.isSafe) {
      setHearts((h) => Math.max(1, h - 1));
    }
  };

  // Next Practice Question or Next Phase
  const handleAdvancePractice = () => {
    if (practiceIndex < lesson.practice.length - 1) {
      setPracticeIndex((i) => i + 1);
      resetQuestionStates();
    } else {
      setPhase('story');
    }
  };

  // Complete lesson & grant rewards
  const handleFinalClaim = () => {
    onCompleteLesson(lesson.id, lesson.xpReward, lesson.shieldBadgeName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border-2 border-slate-700/80 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
            title="Đóng bài học"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Progress Bar */}
          <div className="flex-1 max-w-md">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-1.5">
              <span className="truncate">
                {unit.title} • Bài {lesson.number}
              </span>
              <span className="text-cyan-400 font-mono font-bold">{getProgressPercentage()}%</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>

          {/* Streak Shield Indicator */}
          <div className="flex items-center space-x-1.5 bg-amber-950/60 border border-amber-500/40 px-3 py-1.5 rounded-2xl flex-shrink-0">
            <span className="text-amber-400 text-sm">🔥</span>
            <span className="text-xs font-black text-amber-300 font-mono">Streak Safe</span>
          </div>
        </div>

        {/* Dynamic Body Content */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* ===================== PHASE 1: THEORY ===================== */}
          {phase === 'theory' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-2xl shadow-sm">
                  {lesson.shieldBadgeIcon}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-800">
                      Giai đoạn 1: Lý thuyết & Nhận diện
                    </span>
                    <span className="text-xs text-amber-400 font-bold flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>+{lesson.xpReward} XP</span>
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                    Bài {lesson.number}: {lesson.title}
                  </h2>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/60 text-xs sm:text-sm text-cyan-200 flex items-start space-x-3">
                <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-white">Mục tiêu bài học: </strong>
                  {lesson.targetGoal}
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-5 sm:p-6 rounded-2xl space-y-4">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>{lesson.theory.title}</span>
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">{lesson.theory.summary}</p>

                <div className="space-y-2.5 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Cốt lõi kiến thức:
                  </span>
                  <div className="space-y-2">
                    {lesson.theory.keyPoints.map((point, idx) => (
                      <div
                        key={idx}
                        className="text-xs sm:text-sm text-slate-200 bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 leading-relaxed"
                      >
                        {point}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {lesson.theory.visualMockup && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
                    <AlertTriangle className="w-4 h-4 animate-bounce" />
                    <span>Mô phỏng thực tế bẫy lừa đảo (Nhấp để soi Red Flags):</span>
                  </div>

                  {/* HIGH-FIDELITY CYBER SECURITY DEVICE MOCKUP */}
                  <div className="relative group overflow-hidden">
                    {/* Glowing Cyber Accent Background Border */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-cyan-500/10 to-rose-500/20 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

                    {/* Main Mockup Container */}
                    <div className="relative bg-slate-950 rounded-2xl border-2 border-slate-800 shadow-2xl overflow-hidden">
                      
                      {/* TYPE 1: SMS or CHAT MOCKUP */}
                      {(lesson.theory.visualMockup.type === 'sms' || lesson.theory.visualMockup.type === 'chat') && (
                        <div className="flex flex-col font-sans">
                          {/* Simulated Phone Status Bar */}
                          <div className="flex items-center justify-between text-[10px] text-slate-400 px-4 py-2 bg-slate-900 border-b border-slate-950 select-none">
                            <span className="font-semibold font-mono">09:41 AM</span>
                            <div className="flex items-center space-x-2">
                              {/* Signal Icon */}
                              <svg className="w-3.5 h-3 fill-current text-slate-400" viewBox="0 0 24 24">
                                <rect x="2" y="16" width="3" height="6" rx="0.5" />
                                <rect x="7" y="12" width="3" height="10" rx="0.5" />
                                <rect x="12" y="8" width="3" height="14" rx="0.5" />
                                <rect x="17" y="4" width="3" height="18" rx="0.5" className="opacity-40" />
                              </svg>
                              {/* Wifi Icon */}
                              <svg className="w-3.5 h-3.5 fill-current text-slate-400" viewBox="0 0 24 24">
                                <path d="M12 21a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0-6a6 6 0 0 0-4.24 1.76l1.42 1.42A4 4 0 0 1 12 17c.81 0 1.54.3 2.1.8l1.42-1.42A6 6 0 0 0 12 15zm0-6a10 10 0 0 0-7.07 2.93l1.42 1.42A8 8 0 0 1 12 11a8 8 0 0 1 5.66 2.34l1.42-1.42A10 10 0 0 0 12 9z" />
                              </svg>
                              {/* Battery Icon */}
                              <div className="w-5 h-2.5 border border-slate-500 rounded-sm p-0.5 flex items-center">
                                <div className="h-full w-4/5 bg-emerald-500 rounded-2xs" />
                              </div>
                            </div>
                          </div>

                          {/* App Header Bar */}
                          <div className="flex items-center justify-between p-3.5 bg-slate-900/90 border-b border-slate-800">
                            <div className="flex items-center space-x-3">
                              {/* Left Back Arrow */}
                              <span className="text-slate-400 text-sm font-mono cursor-default hover:text-white">❮</span>
                              {/* Avatar */}
                              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-cyan-400 uppercase shadow-inner">
                                {lesson.theory.visualMockup.avatarText || lesson.theory.visualMockup.sender.slice(0, 2)}
                              </div>
                              <div>
                                <div className="text-xs font-black text-white flex items-center space-x-1">
                                  <span>{lesson.theory.visualMockup.sender}</span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                </div>
                                <span className="text-[9px] text-slate-500 font-bold block tracking-wider">SMS / Đang hoạt động</span>
                              </div>
                            </div>
                            <span className="text-[9px] font-mono text-cyan-500 bg-cyan-950/40 border border-cyan-800 px-2 py-0.5 rounded-md uppercase tracking-wider">
                              {lesson.theory.visualMockup.type}
                            </span>
                          </div>

                          {/* Message Body */}
                          <div className="p-4 bg-slate-950 min-h-[140px] flex flex-col justify-between relative">
                            {/* Time Separator */}
                            <span className="text-[9px] font-mono text-slate-600 block text-center uppercase tracking-widest mb-4">Hôm nay • 10:24 AM</span>

                            {/* Chat Bubble */}
                            <div className="max-w-[90%] self-start flex items-start space-x-2.5">
                              {/* Small sender initial avatar */}
                              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-mono text-[9px] text-slate-400 uppercase flex-shrink-0">
                                {lesson.theory.visualMockup.sender.slice(0, 1)}
                              </div>
                              <div className="relative">
                                {/* Bubble Frame */}
                                <div className="bg-slate-900 border border-slate-800 text-slate-100 p-4 rounded-2xl rounded-tl-none font-mono text-xs sm:text-sm leading-relaxed shadow-lg">
                                  "{lesson.theory.visualMockup.content}"
                                </div>
                                {/* Left tail */}
                                <div className="absolute top-0 -left-1.5 w-0 h-0 border-t-[8px] border-t-slate-800 border-r-[8px] border-r-transparent border-l-[8px] border-l-transparent" />
                                <div className="absolute top-[1px] -left-[5px] w-0 h-0 border-t-[7px] border-t-slate-900 border-r-[7px] border-r-transparent border-l-[7px] border-l-transparent" />
                              </div>
                            </div>

                            {/* Red Flags Callout Inside Smartphone Frame */}
                            {lesson.theory.visualMockup.highlightedRedFlags && (
                              <div className="mt-5 pt-3 border-t border-slate-900/80 space-y-2">
                                <span className="text-[10px] font-extrabold tracking-widest text-rose-400 font-mono block uppercase">
                                  🚨 ĐIỂM NGHI VẤN CHỈ ĐỊNH (RED FLAGS):
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {lesson.theory.visualMockup.highlightedRedFlags.map((flag, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[10px] font-bold font-mono bg-rose-950/80 text-rose-300 border border-rose-700/80 px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-sm"
                                    >
                                      <span>🚩</span>
                                      <span>{flag}</span>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* TYPE 2: BROWSER MOCKUP */}
                      {lesson.theory.visualMockup.type === 'browser' && (
                        <div className="flex flex-col font-sans">
                          {/* Browser Window Control Header */}
                          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
                            {/* Triple OS window buttons */}
                            <div className="flex items-center space-x-2 w-16">
                              <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_8px_#f43f5e33]" />
                              <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_#f59e0b33]" />
                              <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_#10b98133]" />
                            </div>

                            {/* Address URL Bar */}
                            <div className="flex-1 max-w-lg bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono">
                              <div className="flex items-center space-x-2 text-slate-400 truncate w-full">
                                {/* Danger lock icon */}
                                <svg className="w-3.5 h-3.5 text-rose-500 fill-current flex-shrink-0 animate-pulse" viewBox="0 0 24 24">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                                </svg>
                                <span className="text-rose-400 font-bold tracking-wider select-all truncate">
                                  {lesson.theory.visualMockup.content}
                                </span>
                              </div>
                              <span className="text-[8px] bg-rose-950/80 border border-rose-800/80 text-rose-400 px-1.5 py-0.2 rounded font-black flex-shrink-0 animate-pulse">
                                INSECURE
                              </span>
                            </div>

                            {/* Right placeholder */}
                            <div className="w-16 text-right select-none">
                              <span className="text-[10px] font-mono text-slate-500 font-black">BROWSER</span>
                            </div>
                          </div>

                          {/* Browser simulated content web view */}
                          <div className="p-5 bg-slate-950 min-h-[140px] flex flex-col justify-between relative">
                            <div className="space-y-3">
                              <div className="text-[11px] font-black text-rose-400 uppercase tracking-widest font-mono flex items-center space-x-1.5">
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                                <span>CẢNH BÁO: PHÁT HIỆN MIỀN GIẢ MẠO ĐỘC HẠI</span>
                              </div>
                              <div className="text-xs text-slate-300 font-mono bg-slate-900/80 p-4 rounded-xl border border-slate-800 leading-relaxed shadow-inner">
                                <p className="text-slate-400 mb-1">Mục tiêu phát hiện:</p>
                                <p className="text-white font-bold bg-slate-950/90 p-2 rounded border border-slate-850 break-all select-all">
                                  {lesson.theory.visualMockup.content}
                                </p>
                              </div>
                            </div>

                            {/* Red Flags */}
                            {lesson.theory.visualMockup.highlightedRedFlags && (
                              <div className="mt-5 pt-3 border-t border-slate-900/80 space-y-2">
                                <span className="text-[10px] font-extrabold tracking-widest text-rose-400 font-mono block uppercase">
                                  🚨 PHÂN TÍCH CHỈ SỐ LỪA ĐẢO:
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {lesson.theory.visualMockup.highlightedRedFlags.map((flag, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[10px] font-bold font-mono bg-rose-950/80 text-rose-300 border border-rose-700/80 px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-sm"
                                    >
                                      <span>🚩</span>
                                      <span>{flag}</span>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* TYPE 3: EMAIL MOCKUP */}
                      {lesson.theory.visualMockup.type === 'email' && (
                        <div className="flex flex-col font-sans">
                          {/* Desktop Client Header */}
                          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
                            <div className="flex items-center space-x-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                              <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                              <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                              <span className="text-[10px] font-black font-mono text-slate-500 uppercase tracking-widest ml-2">Secure Mail client</span>
                            </div>
                            <span className="text-[9px] font-mono text-purple-400 bg-purple-950/40 border border-purple-800 px-2.5 py-0.5 rounded-md uppercase">
                              INBOX PREVIEW
                            </span>
                          </div>

                          {/* Email Headers Card */}
                          <div className="p-3.5 bg-slate-950 border-b border-slate-900 text-xs font-mono space-y-2">
                            <div className="flex items-center justify-between text-slate-400">
                              <div>
                                <span className="text-slate-500">Từ:</span>{' '}
                                <span className="text-rose-400 font-extrabold">{lesson.theory.visualMockup.sender}</span>
                              </div>
                              <span className="text-[10px] text-slate-600">Hôm nay, 08:30 AM</span>
                            </div>
                            <div className="text-slate-400">
                              <span className="text-slate-500">Đến:</span> <span className="text-slate-300">me@security-student.org</span>
                            </div>
                            <div className="text-white font-extrabold border-l-2 border-rose-500 pl-2 py-0.5 bg-rose-950/15">
                              Subject: [CẢNH BÁO KHẨN CẤP] Xác minh tài khoản ngay lập tức!
                            </div>
                          </div>

                          {/* Email Body Content */}
                          <div className="p-5 bg-slate-950 min-h-[140px] flex flex-col justify-between relative">
                            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl font-mono text-xs sm:text-sm text-slate-200 leading-relaxed shadow-inner">
                              "{lesson.theory.visualMockup.content}"
                            </div>

                            {/* Red Flags */}
                            {lesson.theory.visualMockup.highlightedRedFlags && (
                              <div className="mt-5 pt-3 border-t border-slate-900/80 space-y-2">
                                <span className="text-[10px] font-extrabold tracking-widest text-rose-400 font-mono block uppercase">
                                  🚨 PHÁT HIỆN KHẨN CẤP (EMAIL RED FLAGS):
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {lesson.theory.visualMockup.highlightedRedFlags.map((flag, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[10px] font-bold font-mono bg-rose-950/80 text-rose-300 border border-rose-700/80 px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-sm"
                                    >
                                      <span>🚩</span>
                                      <span>{flag}</span>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* TYPE 4: CALL MOCKUP */}
                      {lesson.theory.visualMockup.type === 'call' && (
                        <div className="flex flex-col font-sans">
                          {/* Simulated Phone Status Bar */}
                          <div className="flex items-center justify-between text-[10px] text-slate-400 px-4 py-2 bg-slate-900 border-b border-slate-950 select-none">
                            <span className="font-semibold font-mono">09:41 AM</span>
                            <div className="flex items-center space-x-2">
                              <svg className="w-3.5 h-3 fill-current text-slate-400" viewBox="0 0 24 24">
                                <rect x="2" y="16" width="3" height="6" rx="0.5" />
                                <rect x="7" y="12" width="3" height="10" rx="0.5" />
                                <rect x="12" y="8" width="3" height="14" rx="0.5" />
                                <rect x="17" y="4" width="3" height="18" rx="0.5" />
                              </svg>
                              <div className="w-5 h-2.5 border border-slate-500 rounded-sm p-0.5 flex items-center">
                                <div className="h-full w-full bg-rose-500 rounded-2xs" />
                              </div>
                            </div>
                          </div>

                          {/* Active Call UI Area */}
                          <div className="p-6 bg-gradient-to-b from-slate-900 to-slate-950 text-center flex flex-col items-center justify-between min-h-[220px]">
                            <div className="space-y-1">
                              <span className="text-[10px] font-extrabold text-rose-400 tracking-widest font-mono uppercase bg-rose-950/60 border border-rose-900/60 px-3 py-1 rounded-full animate-pulse">
                                📞 CUỘC GỌI ĐẾN MẠO DANH KHẨN CẤP
                              </span>
                              <h4 className="text-base sm:text-lg font-black text-white pt-2">{lesson.theory.visualMockup.sender}</h4>
                              <span className="text-xs text-rose-500 animate-pulse block font-mono">CẢNH BÁO GIAO DỊCH LẠ...</span>
                            </div>

                            {/* Calling Wave Pulse */}
                            <div className="relative w-16 h-16 my-4">
                              <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping" />
                              <div className="absolute inset-2 rounded-full bg-rose-500/30 animate-pulse" />
                              <div className="absolute inset-4 rounded-full bg-slate-800 border border-rose-500 flex items-center justify-center text-rose-400 font-bold text-xl">
                                👤
                              </div>
                            </div>

                            {/* Content of Call (Simulated Script) */}
                            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl font-mono text-xs text-slate-300 text-left max-w-md">
                              "{lesson.theory.visualMockup.content}"
                            </div>

                            {/* Red Flags Callouts */}
                            {lesson.theory.visualMockup.highlightedRedFlags && (
                              <div className="mt-4 w-full pt-3 border-t border-slate-900 space-y-2">
                                <div className="flex flex-wrap justify-center gap-1.5">
                                  {lesson.theory.visualMockup.highlightedRedFlags.map((flag, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[10px] font-bold font-mono bg-rose-950/80 text-rose-300 border border-rose-700/80 px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-sm"
                                    >
                                      <span>🚩</span>
                                      <span>{flag}</span>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Decline/Accept Buttons Grid */}
                            <div className="flex items-center space-x-12 mt-4">
                              <div className="flex flex-col items-center space-y-1">
                                <div className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-500 cursor-default flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform">
                                  ❌
                                </div>
                                <span className="text-[9px] text-slate-400 font-mono font-bold">TỪ CHỐI</span>
                              </div>
                              <div className="flex flex-col items-center space-y-1">
                                <div className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 cursor-default flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform">
                                  ✓
                                </div>
                                <span className="text-[9px] text-slate-400 font-mono font-bold">TRẢ LỜI</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TYPE 5: WARNING MOCKUP (SYSTEM THREAT DIAGNOSTICS) */}
                      {lesson.theory.visualMockup.type === 'warning' && (
                        <div className="flex flex-col font-mono">
                          {/* Threat Header */}
                          <div className="flex items-center justify-between p-3 bg-red-950/30 border-b border-red-900/30 text-rose-400 text-xs">
                            <span className="font-extrabold flex items-center space-x-1.5">
                              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping mr-1" />
                              SYSTEM DIAGNOSTIC: WARNING
                            </span>
                            <span className="text-[9px] bg-red-900/40 px-2 py-0.5 rounded border border-red-800">THREAT-01</span>
                          </div>

                          {/* Diagnostic Logs Screen */}
                          <div className="p-4 bg-slate-950 min-h-[140px] text-slate-300 font-mono text-xs space-y-3">
                            <div className="text-slate-500 leading-relaxed text-[11px]">
                              $ systemctl status security-threat-detector.service<br />
                              <span className="text-rose-400 font-bold">● EXPLOIT PATTERN DETECTED: UNSECURE AUTHENTICITY</span><br />
                              $ analysis-report --target-source="{lesson.theory.visualMockup.sender}"
                            </div>

                            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-slate-200">
                              "{lesson.theory.visualMockup.content}"
                            </div>

                            {/* Red Flags */}
                            {lesson.theory.visualMockup.highlightedRedFlags && (
                              <div className="mt-4 pt-3 border-t border-slate-900/80 space-y-1.5">
                                <div className="flex flex-wrap gap-1.5">
                                  {lesson.theory.visualMockup.highlightedRedFlags.map((flag, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[10px] font-black bg-rose-950/90 text-rose-300 border border-rose-800 px-2 py-1 rounded-md flex items-center space-x-1"
                                    >
                                      <span>🚩</span>
                                      <span>{flag}</span>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Shield Guardian Note Footer bar */}
                      {lesson.theory.visualMockup.note && (
                        <div className="bg-slate-900 border-t border-slate-800 px-4 py-3 text-[11px] sm:text-xs text-amber-300 font-bold flex items-start space-x-2">
                          <span className="text-base flex-shrink-0">🦉</span>
                          <div>
                            <span className="text-[9px] text-amber-400 font-mono font-black uppercase tracking-wider block">GHI CHÚ VỆ BINH (GUARDIAN NOTE):</span>
                            <span className="leading-relaxed">{lesson.theory.visualMockup.note}</span>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/40 text-amber-200 text-xs sm:text-sm font-bold flex items-center space-x-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <span className="text-amber-400 uppercase tracking-wider text-[10px] block">
                    Quy tắc vàng bất biến
                  </span>
                  <span>{lesson.theory.goldenRule}</span>
                </div>
              </div>
            </div>
          )}

          {/* ===================== PHASE 2: DYNAMIC PRACTICE QUESTIONS ===================== */}
          {phase === 'practice' && currentQuestion && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <HelpCircle className="w-4 h-4" />
                  <span>
                    Câu {practiceIndex + 1}/{lesson.practice.length}: Dạng{' '}
                    {currentQuestion.type === 'multiple_choice' && 'Trắc nghiệm tình huống'}
                    {currentQuestion.type === 'true_false' && 'Thử thách Đúng / Sai'}
                    {currentQuestion.type === 'matching' && 'Ghép cặp khái niệm'}
                    {currentQuestion.type === 'spot_red_flags' && 'Soi điểm nghi vấn (Click to Highlight)'}
                    {currentQuestion.type === 'drag_drop_zone' && 'Kéo thả phân loại an toàn'}
                    {currentQuestion.type === 'order_sequence' && 'Sắp xếp quy trình phản ứng'}
                    {currentQuestion.type === 'url_dissection' && 'Phẫu thuật tên miền & URL'}
                  </span>
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                {currentQuestion.prompt}
              </h3>

              {/* 1. TYPE: MULTIPLE CHOICE */}
              {currentQuestion.type === 'multiple_choice' && (
                <div className="space-y-3 pt-2">
                  {currentQuestion.options?.map((opt) => {
                    const isSelected = selectedMcOption === opt.id;
                    let cardStyle = 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-200';

                    if (isSelected && !isMcChecked) {
                      cardStyle = 'bg-cyan-950/60 border-cyan-400 text-white shadow-lg';
                    } else if (isMcChecked) {
                      if (opt.isCorrect) {
                        cardStyle = 'bg-emerald-950/70 border-emerald-400 text-white shadow-lg';
                      } else if (isSelected && !opt.isCorrect) {
                        cardStyle = 'bg-rose-950/70 border-rose-400 text-white shadow-lg';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        disabled={isMcChecked}
                        onClick={() => setSelectedMcOption(opt.id)}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start space-x-3.5 ${cardStyle}`}
                      >
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 border ${
                            isSelected
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                              : 'bg-slate-900 text-slate-400 border-slate-700'
                          }`}
                        >
                          {opt.id.toUpperCase()}
                        </div>
                        <div className="space-y-1 flex-1">
                          <span className="text-sm font-medium leading-relaxed block">{opt.text}</span>
                          {isMcChecked && (opt.isCorrect || isSelected) && (
                            <p
                              className={`text-xs mt-1.5 pt-1.5 border-t ${
                                opt.isCorrect ? 'text-emerald-300 border-emerald-800' : 'text-rose-300 border-rose-800'
                              }`}
                            >
                              <strong>{opt.isCorrect ? '✓ Đúng: ' : '✗ Sai: '}</strong>
                              {opt.explanation}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 2. TYPE: TRUE / FALSE */}
              {currentQuestion.type === 'true_false' && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      disabled={isTfChecked}
                      onClick={() => setSelectedTf(true)}
                      className={`p-5 rounded-2xl border-2 text-center font-black text-lg transition-all cursor-pointer flex flex-col items-center space-y-2 ${
                        selectedTf === true
                          ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-xl'
                          : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl">👍</span>
                      <span>ĐÚNG</span>
                    </button>

                    <button
                      disabled={isTfChecked}
                      onClick={() => setSelectedTf(false)}
                      className={`p-5 rounded-2xl border-2 text-center font-black text-lg transition-all cursor-pointer flex flex-col items-center space-y-2 ${
                        selectedTf === false
                          ? 'bg-rose-950/80 border-rose-400 text-rose-300 shadow-xl'
                          : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl">👎</span>
                      <span>SAI</span>
                    </button>
                  </div>

                  {isTfChecked && currentQuestion.trueFalseAnswer && (
                    <div
                      className={`p-4 rounded-2xl border ${
                        selectedTf === currentQuestion.trueFalseAnswer.isTrue
                          ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200'
                          : 'bg-rose-950/60 border-rose-500/80 text-rose-200'
                      } space-y-1.5`}
                    >
                      <div className="font-bold text-sm flex items-center space-x-2">
                        {selectedTf === currentQuestion.trueFalseAnswer.isTrue ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <span>Chính xác tuyệt đối!</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-5 h-5 text-rose-400" />
                            <span>Chưa chính xác!</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed">
                        {currentQuestion.trueFalseAnswer.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 3. TYPE: MATCHING PAIRS */}
              {currentQuestion.type === 'matching' && (
                <div className="space-y-4 pt-2">
                  {wrongMatch && (
                    <div className="p-3 bg-rose-950/80 border border-rose-700 text-rose-200 text-xs font-bold rounded-xl flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>Ghép chưa đúng! Hãy chọn cặp khác.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">Dấu Hiệu / Khái Niệm</span>
                      {currentQuestion.matchingPairs?.map((pair) => {
                        const isMatched = !!matchedPairs[pair.left.id];
                        const isSelected = selectedLeftId === pair.left.id;

                        return (
                          <button
                            key={pair.left.id}
                            disabled={isMatched}
                            onClick={() => handleLeftMatchClick(pair.left.id)}
                            className={`w-full text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between text-xs sm:text-sm font-semibold ${
                              isMatched
                                ? 'bg-emerald-950/40 border-emerald-600 text-emerald-400 line-through opacity-70'
                                : isSelected
                                ? 'bg-cyan-950 border-cyan-400 text-white shadow-lg scale-[1.02]'
                                : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-700'
                            }`}
                          >
                            <span>{pair.left.text}</span>
                            {isMatched && <Check className="w-4 h-4 text-emerald-400" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">Cách Xử Lý / Ý Nghĩa</span>
                      {currentQuestion.matchingPairs?.map((pair) => {
                        const isMatched = Object.values(matchedPairs).includes(pair.right.id);

                        return (
                          <button
                            key={pair.right.id}
                            disabled={isMatched}
                            onClick={() => handleRightMatchClick(pair.right)}
                            className={`w-full text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between text-xs sm:text-sm font-semibold ${
                              isMatched
                                ? 'bg-emerald-950/40 border-emerald-600 text-emerald-400 opacity-70'
                                : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-cyan-500/60'
                            }`}
                          >
                            <span>{pair.right.text}</span>
                            {isMatched && <Check className="w-4 h-4 text-emerald-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. TYPE: SPOT RED FLAGS */}
              {currentQuestion.type === 'spot_red_flags' && currentQuestion.spotData && (
                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-950 border-2 border-slate-800 space-y-3 shadow-xl">
                    <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                      <span className="font-mono text-cyan-400 font-bold">
                        {currentQuestion.spotData.header}
                      </span>
                      <span className="text-slate-400">Người gửi: {currentQuestion.spotData.sender}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-200 font-mono leading-relaxed p-3 bg-slate-900 rounded-xl border border-slate-800">
                      "{currentQuestion.spotData.bodyText}"
                    </p>

                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-amber-400 block">
                        👉 Bấm chọn các phần tử nghi vấn bên dưới:
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {currentQuestion.spotData.spots.map((spot) => {
                          const isTapped = tappedSpotIds.includes(spot.id);
                          let spotStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-amber-500/50';

                          if (isTapped && !isSpotChecked) {
                            spotStyle = 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-md';
                          } else if (isSpotChecked) {
                            if (spot.isRedFlag && isTapped) {
                              spotStyle = 'bg-rose-950 border-rose-500 text-rose-200 shadow-lg';
                            } else if (spot.isRedFlag && !isTapped) {
                              spotStyle = 'bg-rose-950/50 border-rose-700/80 text-rose-300';
                            } else if (!spot.isRedFlag && isTapped) {
                              spotStyle = 'bg-slate-900 border-slate-700 text-slate-400';
                            }
                          }

                          return (
                            <button
                              key={spot.id}
                              disabled={isSpotChecked}
                              onClick={() => handleToggleSpot(spot.id)}
                              className={`p-3 rounded-xl border-2 text-left text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${spotStyle}`}
                            >
                              <span className="font-bold">{spot.labelText}</span>
                              {isTapped && <span className="text-amber-400 text-xs font-sans">🚩 Đã chọn</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {isSpotChecked && (
                    <div className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs leading-relaxed">
                      <strong className="text-white block font-bold text-sm">Giải mã chi tiết Red Flags:</strong>
                      {currentQuestion.spotData.spots.map((spot) => (
                        <div key={spot.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                          <span className={spot.isRedFlag ? 'text-rose-400 font-bold' : 'text-slate-400 font-bold'}>
                            {spot.isRedFlag ? '🚩 Bẫy nguy hiểm: ' : '⚪ Bình thường: '}
                          </span>
                          <span className="text-slate-300">{spot.explanation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 5. TYPE: DRAG & DROP / CATEGORIZATION */}
              {currentQuestion.type === 'drag_drop_zone' && currentQuestion.dragDropItems && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-3">
                    {currentQuestion.dragDropItems.map((item) => {
                      const assigned = dragAssignments[item.id];

                      return (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl bg-slate-950 border-2 border-slate-800 space-y-3 shadow-md"
                        >
                          <div className="text-xs text-cyan-400 font-bold">Từ: {item.sender}</div>
                          <p className="text-xs sm:text-sm text-slate-200 font-mono">"{item.text}"</p>

                          <div className="grid grid-cols-3 gap-2 pt-1">
                            <button
                              disabled={isDragChecked}
                              onClick={() => handleAssignCategory(item.id, 'safe')}
                              className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                assigned === 'safe'
                                  ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              🟢 An Toàn
                            </button>

                            <button
                              disabled={isDragChecked}
                              onClick={() => handleAssignCategory(item.id, 'suspicious')}
                              className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                assigned === 'suspicious'
                                  ? 'bg-amber-950 border-amber-400 text-amber-300'
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              🟡 Nghi Vấn
                            </button>

                            <button
                              disabled={isDragChecked}
                              onClick={() => handleAssignCategory(item.id, 'scam')}
                              className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                assigned === 'scam'
                                  ? 'bg-rose-950 border-rose-400 text-rose-300'
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              🔴 Lừa Đảo
                            </button>
                          </div>

                          {isDragChecked && (
                            <p
                              className={`text-xs p-2.5 rounded-xl border ${
                                assigned === item.correctCategory
                                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                                  : 'bg-rose-950/60 border-rose-800 text-rose-300'
                              }`}
                            >
                              <strong>
                                {assigned === item.correctCategory ? '✓ Chuẩn xác: ' : '✗ Nhầm lẫn: '}
                              </strong>
                              {item.explanation}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 6. TYPE: ORDER SEQUENCE */}
              {currentQuestion.type === 'order_sequence' && (
                <div className="space-y-4 pt-2">
                  <p className="text-xs text-slate-400">
                    Dùng nút mũi tên Lên / Xuống để sắp xếp các bước theo thứ tự ưu tiên từ 1 đến 4.
                  </p>

                  <div className="space-y-2">
                    {currentSequence.map((step, idx) => (
                      <div
                        key={step.id}
                        className={`p-3.5 rounded-xl border-2 flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold transition-all ${
                          isSeqChecked
                            ? step.correctOrder === idx + 1
                              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                              : 'bg-rose-950/70 border-rose-500 text-rose-200'
                            : 'bg-slate-950 border-slate-800 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <span className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step.stepText}</span>
                        </div>

                        {!isSeqChecked && (
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <button
                              disabled={idx === 0}
                              onClick={() => handleMoveSequenceStep(idx, 'up')}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowUp className="w-4 h-4 text-cyan-400" />
                            </button>
                            <button
                              disabled={idx === currentSequence.length - 1}
                              onClick={() => handleMoveSequenceStep(idx, 'down')}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowDown className="w-4 h-4 text-cyan-400" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {isSeqChecked && (
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                      <strong className="text-white block font-bold text-sm">Giải thích quy trình chuẩn:</strong>
                      {currentSequence.map((step) => (
                        <p key={step.id} className="text-slate-300">
                          • {step.explanation}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 7. TYPE: URL DISSECTION */}
              {currentQuestion.type === 'url_dissection' && currentQuestion.urlData && (
                <div className="space-y-4 pt-2">
                  <div className="p-5 rounded-2xl bg-slate-950 border-2 border-slate-800 space-y-4 text-center shadow-xl">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                      Đường dẫn URL kiểm tra:
                    </span>

                    <div className="flex flex-wrap items-center justify-center gap-1 font-mono text-xs sm:text-base p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <button
                        onClick={() => setSelectedUrlPart('protocol')}
                        className={`px-2 py-1 rounded transition-all cursor-pointer ${
                          selectedUrlPart === 'protocol' ? 'bg-cyan-950 border border-cyan-400 text-cyan-300' : 'text-slate-400'
                        }`}
                      >
                        {currentQuestion.urlData.protocol}
                      </button>
                      <button
                        onClick={() => setSelectedUrlPart('subdomain')}
                        className={`px-2 py-1 rounded transition-all cursor-pointer ${
                          selectedUrlPart === 'subdomain' ? 'bg-cyan-950 border border-cyan-400 text-cyan-300' : 'text-slate-300'
                        }`}
                      >
                        {currentQuestion.urlData.subdomain}.
                      </button>
                      <button
                        onClick={() => setSelectedUrlPart('registrableDomain')}
                        className={`px-2.5 py-1 rounded font-black transition-all cursor-pointer ${
                          selectedUrlPart === 'registrableDomain'
                            ? 'bg-amber-950 border-2 border-amber-400 text-amber-200'
                            : 'bg-slate-800 text-white'
                        }`}
                      >
                        {currentQuestion.urlData.registrableDomain}
                      </button>
                      <button
                        onClick={() => setSelectedUrlPart('tld')}
                        className={`px-2 py-1 rounded transition-all cursor-pointer ${
                          selectedUrlPart === 'tld' ? 'bg-cyan-950 border border-cyan-400 text-cyan-300' : 'text-slate-300'
                        }`}
                      >
                        {currentQuestion.urlData.tld}
                      </button>
                      <button
                        onClick={() => setSelectedUrlPart('path')}
                        className={`px-2 py-1 rounded transition-all cursor-pointer ${
                          selectedUrlPart === 'path' ? 'bg-cyan-950 border border-cyan-400 text-cyan-300' : 'text-slate-400'
                        }`}
                      >
                        {currentQuestion.urlData.path}
                      </button>
                    </div>

                    <p className="text-xs text-slate-400">
                      Bấm vào khối tên miền mà bạn cho là bẫy mạo danh tinh vi nhất!
                    </p>
                  </div>

                  {isUrlChecked && (
                    <div
                      className={`p-4 rounded-2xl border ${
                        selectedUrlPart === currentQuestion.urlData.deceptivePart
                          ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                          : 'bg-rose-950/70 border-rose-500 text-rose-200'
                      } text-xs sm:text-sm leading-relaxed space-y-1.5`}
                    >
                      <div className="font-bold flex items-center space-x-2">
                        {selectedUrlPart === currentQuestion.urlData.deceptivePart ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <span>Bắt bài thành công!</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-5 h-5 text-rose-400" />
                            <span>Nhầm lẫn tên miền!</span>
                          </>
                        )}
                      </div>
                      <p>{currentQuestion.urlData.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ===================== PHASE 3: STORY ===================== */}
          {phase === 'story' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <MessageSquare className="w-4 h-4" />
                <span>Giai đoạn 3: Thực chiến kịch bản huống (Story)</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-xs sm:text-sm text-amber-200">
                <strong className="text-white font-bold">Bối cảnh: </strong>
                {lesson.story.scenarioContext}
              </div>

              <div className="space-y-4 pt-2">
                {lesson.story.dialogue.map((msg, idx) => {
                  const isScammer = msg.sender === 'scammer';
                  const isAssistant = msg.sender === 'assistant';

                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md font-bold text-sm bg-slate-800 border border-slate-700">
                        {isScammer && '🎭'}
                        {isAssistant && '🦉'}
                        {msg.sender === 'user' && '👤'}
                      </div>

                      <div
                        className={`max-w-lg p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-1 shadow-md ${
                          isScammer
                            ? 'bg-rose-950/60 border border-rose-800/60 text-rose-100 rounded-tl-none'
                            : isAssistant
                            ? 'bg-cyan-950/70 border border-cyan-800/80 text-cyan-100 rounded-tl-none'
                            : 'bg-slate-800 text-white rounded-tr-none'
                        }`}
                      >
                        <div className="text-[10px] font-extrabold uppercase tracking-wider opacity-75">
                          {msg.senderName}
                        </div>
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {(() => {
                const actionMsg = lesson.story.dialogue.find((m) => m.actionRequired && m.choices);
                if (!actionMsg || !actionMsg.choices) return null;

                return (
                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                      ⚡ Bạn sẽ chọn phản ứng nào để vô hiệu hóa kẻ gian?
                    </span>

                    <div className="space-y-3">
                      {actionMsg.choices.map((choice) => {
                        const isSelected = selectedStoryChoice === choice.id;
                        let btnStyle = 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-200';

                        if (isSelected && !isStoryChecked) {
                          btnStyle = 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg';
                        } else if (isStoryChecked) {
                          if (choice.isSafe) {
                            btnStyle = 'bg-emerald-950/80 border-emerald-400 text-white shadow-lg';
                          } else if (isSelected && !choice.isSafe) {
                            btnStyle = 'bg-rose-950/80 border-rose-400 text-white shadow-lg';
                          }
                        }

                        return (
                          <button
                            key={choice.id}
                            disabled={isStoryChecked}
                            onClick={() => setSelectedStoryChoice(choice.id)}
                            className={`w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${btnStyle}`}
                          >
                            <div className="text-xs sm:text-sm font-semibold leading-relaxed">{choice.text}</div>
                            {isStoryChecked && (isSelected || choice.isSafe) && (
                              <div
                                className={`text-xs p-2.5 rounded-xl ${
                                  choice.isSafe ? 'bg-emerald-900/60 text-emerald-200' : 'bg-rose-900/60 text-rose-200'
                                }`}
                              >
                                <div className="font-bold">
                                  {choice.isSafe ? '✓ Lựa chọn an toàn: ' : '✗ Bẫy nguy hiểm: '}
                                  {choice.feedback}
                                </div>
                                <div className="text-[11px] opacity-85 mt-0.5">Hệ quả: {choice.consequence}</div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ===================== PHASE 4: REWARD ===================== */}
          {phase === 'reward' && (
            <div className="text-center py-6 sm:py-8 space-y-6 animate-scale-up">
              <div className="relative inline-block mx-auto">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-amber-500 via-emerald-400 to-cyan-400 p-2 shadow-2xl animate-pulse-glow flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center text-4xl sm:text-5xl shadow-inner border-2 border-slate-800">
                    {lesson.shieldBadgeIcon}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-lg border-2 border-slate-900 flex items-center space-x-1">
                  <span>★</span>
                  <span>Hoàn Thành</span>
                </div>
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="text-2xl sm:text-3xl font-black text-white">Tuyệt Đỉnh Vệ Binh!</h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Bạn đã xuất sắc làm chủ toàn bộ bài học và các dạng câu hỏi của{' '}
                  <strong className="text-cyan-400">
                    Bài {lesson.number}: {lesson.title}
                  </strong>
                  .
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-left">
                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-inner">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Kinh Nghiệm Thưởng
                  </span>
                  <div className="text-2xl font-black text-amber-400 flex items-center space-x-1.5">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>+{lesson.xpReward} XP</span>
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-inner">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Huy Hiệu Mới
                  </span>
                  <div className="text-xs font-black text-emerald-300 truncate">{lesson.shieldBadgeName}</div>
                  <span className="text-[10px] text-emerald-400 font-bold block">
                    Đã thêm vào bộ sưu tập
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
          {phase === 'theory' && (
            <button
              onClick={() => setPhase('practice')}
              className="btn-tactile btn-tactile-cyan w-full py-4 text-sm font-bold flex items-center justify-center space-x-2 shadow-xl cursor-pointer"
            >
              <span>Bắt Đầu Luyện Tập Thực Hành ({lesson.practice.length} Dạng Câu Hỏi)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {phase === 'practice' && (
            <div className="w-full flex items-center justify-between gap-3">
              {/* Check Answer Button if not checked */}
              {currentQuestion?.type === 'multiple_choice' && !isMcChecked && (
                <button
                  disabled={!selectedMcOption}
                  onClick={handleCheckMc}
                  className={`btn-tactile w-full py-4 text-sm font-bold shadow-xl ${
                    selectedMcOption
                      ? 'btn-tactile-cyan cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
                  }`}
                >
                  Kiểm Tra Đáp Án
                </button>
              )}

              {currentQuestion?.type === 'true_false' && !isTfChecked && (
                <button
                  disabled={selectedTf === null}
                  onClick={handleCheckTf}
                  className={`btn-tactile w-full py-4 text-sm font-bold shadow-xl ${
                    selectedTf !== null
                      ? 'btn-tactile-cyan cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
                  }`}
                >
                  Kiểm Tra Đúng / Sai
                </button>
              )}

              {currentQuestion?.type === 'matching' && (
                <button
                  disabled={!isMatchingComplete}
                  onClick={handleAdvancePractice}
                  className={`btn-tactile w-full py-4 text-sm font-bold flex items-center justify-center space-x-2 shadow-xl ${
                    isMatchingComplete
                      ? 'btn-tactile-cyan cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
                  }`}
                >
                  <span>
                    {isMatchingComplete
                      ? 'Sang Câu Tiếp Theo'
                      : `Hãy ghép đủ ${currentQuestion.matchingPairs?.length || 3} cặp`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {currentQuestion?.type === 'spot_red_flags' && !isSpotChecked && (
                <button
                  disabled={tappedSpotIds.length === 0}
                  onClick={handleCheckSpot}
                  className={`btn-tactile w-full py-4 text-sm font-bold shadow-xl ${
                    tappedSpotIds.length > 0
                      ? 'btn-tactile-cyan cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
                  }`}
                >
                  Kiểm Tra Các Điểm Đã Soi ({tappedSpotIds.length} Điểm)
                </button>
              )}

              {currentQuestion?.type === 'drag_drop_zone' && !isDragChecked && (
                <button
                  disabled={
                    Object.keys(dragAssignments).length < (currentQuestion.dragDropItems?.length || 1)
                  }
                  onClick={handleCheckDrag}
                  className={`btn-tactile w-full py-4 text-sm font-bold shadow-xl ${
                    Object.keys(dragAssignments).length >= (currentQuestion.dragDropItems?.length || 1)
                      ? 'btn-tactile-cyan cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
                  }`}
                >
                  Kiểm Tra Phân Loại ({Object.keys(dragAssignments).length}/{currentQuestion.dragDropItems?.length})
                </button>
              )}

              {currentQuestion?.type === 'order_sequence' && !isSeqChecked && (
                <button
                  onClick={handleCheckSequence}
                  className="btn-tactile btn-tactile-cyan w-full py-4 text-sm font-bold shadow-xl cursor-pointer"
                >
                  Xác Nhận Thứ Tự Quy Trình
                </button>
              )}

              {currentQuestion?.type === 'url_dissection' && !isUrlChecked && (
                <button
                  disabled={!selectedUrlPart}
                  onClick={handleCheckUrl}
                  className={`btn-tactile w-full py-4 text-sm font-bold shadow-xl ${
                    selectedUrlPart
                      ? 'btn-tactile-cyan cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
                  }`}
                >
                  Xác Nhận Khối Tên Miền Đã Chọn
                </button>
              )}

              {/* Continue button after question is checked */}
              {((currentQuestion?.type === 'multiple_choice' && isMcChecked) ||
                (currentQuestion?.type === 'true_false' && isTfChecked) ||
                (currentQuestion?.type === 'spot_red_flags' && isSpotChecked) ||
                (currentQuestion?.type === 'drag_drop_zone' && isDragChecked) ||
                (currentQuestion?.type === 'order_sequence' && isSeqChecked) ||
                (currentQuestion?.type === 'url_dissection' && isUrlChecked)) && (
                <button
                  onClick={handleAdvancePractice}
                  className="btn-tactile btn-tactile-cyan w-full py-4 text-sm font-bold flex items-center justify-center space-x-2 shadow-xl cursor-pointer"
                >
                  <span>
                    {practiceIndex < lesson.practice.length - 1
                      ? 'Sang Câu Hỏi Tiếp Theo'
                      : 'Chuyển Sang Kịch Bản Story'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {phase === 'story' && (
            <div className="w-full flex items-center justify-between gap-3">
              {!isStoryChecked ? (
                <button
                  disabled={!selectedStoryChoice}
                  onClick={handleCheckStory}
                  className={`btn-tactile w-full py-4 text-sm font-bold shadow-xl ${
                    selectedStoryChoice
                      ? 'btn-tactile-cyan cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
                  }`}
                >
                  Xác Nhận Quyết Định
                </button>
              ) : (
                <button
                  onClick={() => setPhase('reward')}
                  className="btn-tactile btn-tactile-emerald w-full py-4 text-sm font-bold flex items-center justify-center space-x-2 shadow-xl cursor-pointer"
                >
                  <span>Xem Phần Thưởng & Khiên Vệ Binh</span>
                  <Award className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {phase === 'reward' && (
            <button
              onClick={handleFinalClaim}
              className="btn-tactile btn-tactile-emerald w-full py-4 text-sm font-black flex items-center justify-center space-x-2 shadow-2xl cursor-pointer"
            >
              <span>Nhận Khiên & Hoàn Thành</span>
              <CheckCircle2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
