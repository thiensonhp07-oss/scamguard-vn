import React, { useState, useEffect, useRef } from 'react';
import {
  Eye,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Flame,
  Trophy,
  Zap,
  Search,
  Maximize2,
  Activity,
  Layers,
  Filter,
  Info,
  ArrowRight,
  Share2,
  PhoneCall,
  Award,
  AlertTriangle,
  Radio,
  FileCheck,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DEEPFAKE_QUIZ_DATA, DeepfakeQuizItem } from '../data/deepfakeQuizData';
import { playSuccessChime, playButtonClick, playAlertWarning, playRewardTrophy } from '../utils/audioEffects';

interface DeepfakeQuizViewProps {
  onAddXp: (amount: number) => void;
  onOpenCaseLab?: () => void;
}

export const DeepfakeQuizView: React.FC<DeepfakeQuizViewProps> = ({ onAddXp, onOpenCaseLab }) => {
  // Filter state
  const [filterType, setFilterType] = useState<'all' | 'audio' | 'visual'>('all');
  const [quizList, setQuizList] = useState<DeepfakeQuizItem[]>(DEEPFAKE_QUIZ_DATA);
  const [currentIndex, setCurrentIndex] = useState(0);

  // User response state
  const [userChoice, setUserChoice] = useState<'real' | 'ai' | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [claimedXp, setClaimedXp] = useState(0);

  // Audio simulation state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<0.75 | 1>(1);
  const [activeAudioTab, setActiveAudioTab] = useState<'waveform' | 'spectrogram'>('waveform');
  const [audioProgress, setAudioProgress] = useState(0);

  // Visual inspection state
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [selectedLandmark, setSelectedLandmark] = useState<number | null>(null);
  const [isMagnifierActive, setIsMagnifierActive] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  // Completion state
  const [isCompleted, setIsCompleted] = useState(false);

  // Refs
  const audioIntervalRef = useRef<any>(null);

  // Filter effect
  useEffect(() => {
    let filtered = DEEPFAKE_QUIZ_DATA;
    if (filterType === 'audio') {
      filtered = DEEPFAKE_QUIZ_DATA.filter((item) => item.mediaType === 'audio');
    } else if (filterType === 'visual') {
      filtered = DEEPFAKE_QUIZ_DATA.filter((item) => item.mediaType === 'visual');
    }
    setQuizList(filtered);
    setCurrentIndex(0);
    setUserChoice(null);
    setIsAnswered(false);
    setIsCompleted(false);
    stopAudio();
  }, [filterType]);

  const currentItem = quizList[currentIndex] || quizList[0];

  // Stop audio on question change
  useEffect(() => {
    setUserChoice(null);
    setIsAnswered(false);
    setSelectedLandmark(null);
    stopAudio();
  }, [currentIndex]);

  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
    }
    setIsPlayingAudio(false);
    setAudioProgress(0);
  };

  const handleToggleAudio = () => {
    playButtonClick();
    if (isPlayingAudio) {
      stopAudio();
      return;
    }

    if (!currentItem.audioData) return;

    setIsPlayingAudio(true);
    setAudioProgress(0);

    // Simulated progress bar duration ~ 10 seconds
    const durationMs = 9000;
    const intervalTime = 100;
    let elapsed = 0;

    audioIntervalRef.current = setInterval(() => {
      elapsed += intervalTime;
      const pct = Math.min(100, (elapsed / durationMs) * 100);
      setAudioProgress(pct);
      if (pct >= 100) {
        stopAudio();
      }
    }, intervalTime);

    // Browser speech synthesis if supported
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentItem.audioData.transcript);
        utterance.lang = 'vi-VN';
        utterance.rate = (currentItem.audioData.voiceRate || 1) * audioSpeed;
        utterance.pitch = currentItem.audioData.voicePitch || 1;

        utterance.onend = () => {
          stopAudio();
        };
        utterance.onerror = () => {
          // Keep visual wave going even if TTS voice is missing
        };

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        // Fallback: visual waveform runs via interval
      }
    }
  };

  const handleSelectVerdict = (choice: 'real' | 'ai') => {
    if (isAnswered) return;

    playButtonClick();
    setUserChoice(choice);
    setIsAnswered(true);
    stopAudio();

    const isCorrect = choice === currentItem.verdict;

    if (isCorrect) {
      playSuccessChime();
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      if (newStreak > highestStreak) setHighestStreak(newStreak);

      const xp = currentItem.xpReward + (newStreak >= 3 ? 25 : 0);
      setClaimedXp((prev) => prev + xp);
      onAddXp(xp);
    } else {
      playAlertWarning();
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    playButtonClick();
    if (currentIndex < quizList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      playRewardTrophy();
    }
  };

  const handleRestartQuiz = () => {
    playButtonClick();
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setUserChoice(null);
    setIsAnswered(false);
    setIsCompleted(false);
    stopAudio();
  };

  // Render Visual Scenarios with High-fidelity SVG graphics
  const renderVisualMockup = (item: DeepfakeQuizItem) => {
    const vType = item.visualData?.visualScenarioType || 'traffic_officer_call';

    return (
      <div
        className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl select-none group"
        onMouseMove={(e) => {
          if (!isMagnifierActive) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
          const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
          setMagnifierPos({ x, y });
        }}
      >
        {/* Dynamic Graphic Backdrops */}
        {vType === 'traffic_officer_call' && (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-blue-950 flex items-center justify-center">
            {/* Ambient Video Call Window UI */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-cyan-400 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/20 z-10">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-bold">ZALO VIDEO ENCRYPTED • 720p 24fps</span>
              </div>
              <span className="text-slate-400 font-medium">LỆCH KHẨU HÌNH DESYNC: 180ms</span>
            </div>

            {/* Officer Face Silhouette with Artifact Warp */}
            <svg viewBox="0 0 400 250" className="w-full h-full max-h-[300px]">
              <defs>
                <linearGradient id="uniformGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e3a5f" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <filter id="aiWarp">
                  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>

              {/* Background Wall & National Seal Artifact */}
              <rect x="0" y="0" width="400" height="250" fill="#0b1120" />
              <circle cx="200" cy="90" r="70" fill="#1e293b" opacity="0.3" />
              <circle cx="340" cy="50" r="30" fill="#ca8a04" opacity="0.15" />
              <path d="M330,45 L350,45 L340,65 Z" fill="#ca8a04" opacity="0.25" />

              {/* Shoulders & Uniform */}
              <path d="M70,250 C90,170 140,150 200,150 C260,150 310,170 330,250 Z" fill="url(#uniformGrad)" />
              {/* Asymmetric collar lapels */}
              <path d="M150,150 L195,190 L185,150 Z" fill="#334155" />
              <path d="M250,150 L205,190 L215,150 Z" fill="#1e293b" />
              {/* Gold epaulette artifact */}
              <rect x="90" y="180" width="35" height="18" rx="4" fill="#eab308" opacity="0.8" />
              <rect x="275" y="185" width="28" height="14" rx="4" fill="#ca8a04" opacity="0.5" filter="url(#aiWarp)" />

              {/* Neck with Blending Artifact seam */}
              <rect x="180" y="125" width="40" height="35" rx="5" fill="#d97706" opacity="0.7" />
              <line x1="170" y1="140" x2="230" y2="140" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" opacity="0.75" />

              {/* Head Silhouette */}
              <ellipse cx="200" cy="95" rx="42" ry="52" fill="#f59e0b" opacity="0.85" />

              {/* Cap / Sắc phục Mũ */}
              <path d="M150,75 C150,45 250,45 250,75 Z" fill="#0f172a" stroke="#eab308" strokeWidth="1.5" />
              <ellipse cx="200" cy="72" rx="55" ry="8" fill="#1e293b" />
              <circle cx="200" cy="55" r="7" fill="#eab308" />

              {/* Eyes & Catchlight mismatch */}
              <circle cx="185" cy="95" r="5" fill="#0f172a" />
              <circle cx="215" cy="95" r="5" fill="#0f172a" />
              {/* Left eye round glint */}
              <circle cx="186" cy="93" r="1.5" fill="#ffffff" />
              {/* Right eye glitch star glint */}
              <polygon points="216,91 217,93 219,93 217,94 218,96 216,94 214,96 215,94 213,93 215,93" fill="#ffffff" />

              {/* Desynced Mouth */}
              <ellipse cx="200" cy="122" rx="10" ry="3" fill="#881337" />
            </svg>

            {/* Video Call Subtitles */}
            <div className="absolute bottom-3 left-4 right-4 bg-slate-950/80 backdrop-blur-md p-2 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-300 font-medium">
                "Công dân cung cấp ngay số dư tài khoản ngân hàng để ban chuyên án tra soát..."
              </span>
            </div>
          </div>
        )}

        {vType === 'investor_selfie' && (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 flex items-center justify-center">
            <svg viewBox="0 0 400 250" className="w-full h-full max-h-[300px]">
              <defs>
                <linearGradient id="skyScraperGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e1b4b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>

              {/* Background Cityscape with warped lines */}
              <rect x="0" y="0" width="400" height="250" fill="url(#skyScraperGrad)" />
              {/* Distorted highrise windows */}
              <rect x="30" y="30" width="80" height="190" fill="#090d16" />
              <line x1="45" y1="50" x2="95" y2="52" stroke="#38bdf8" strokeWidth="1" opacity="0.4" />
              <line x1="45" y1="75" x2="95" y2="70" stroke="#38bdf8" strokeWidth="1" opacity="0.4" />
              {/* Warped window frame on right */}
              <path d="M310,20 Q330,60 320,120 L370,110 L370,20 Z" fill="#090d16" stroke="#0ea5e9" strokeWidth="0.5" opacity="0.3" />

              {/* Person Silhouette */}
              <path d="M110,250 C130,170 170,160 200,160 C230,160 270,170 290,250 Z" fill="#1e293b" />
              {/* Luxury Suit Collar */}
              <path d="M170,160 L200,210 L185,160 Z" fill="#38bdf8" opacity="0.6" />
              <path d="M230,160 L200,210 L215,160 Z" fill="#0284c7" opacity="0.6" />

              {/* Head & StyleGAN ultra-smooth skin */}
              <ellipse cx="200" cy="100" rx="44" ry="52" fill="#fbbf24" opacity="0.9" />

              {/* AI Perfect Hair with blurry rim */}
              <path d="M150,90 Q200,25 250,90 Q240,40 200,45 Q160,40 150,90 Z" fill="#18181b" />
              <circle cx="155" cy="85" r="10" fill="#18181b" opacity="0.4" filter="blur(3px)" />

              {/* Eyes with different reflections */}
              <circle cx="185" cy="98" r="5" fill="#1e293b" />
              <circle cx="215" cy="98" r="5" fill="#1e293b" />
              <circle cx="186" cy="96" r="1.5" fill="#38bdf8" />
              <rect x="214" y="96" width="3" height="1.5" fill="#f43f5e" />

              {/* Melted Earring on Left Ear */}
              <path d="M154,105 Q145,115 152,125 Q158,115 154,105 Z" fill="#f59e0b" />
              <circle cx="151" cy="120" r="3" fill="#e2e8f0" opacity="0.6" />
              {/* Right ear has NO earring (asymmetric glitch) */}
              <ellipse cx="245" cy="106" rx="4" ry="8" fill="#fbbf24" />
            </svg>
          </div>
        )}

        {vType === 'id_card' && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 flex items-center justify-center p-4">
            <div className="w-full max-w-sm aspect-[1.58/1] bg-slate-900 border-2 border-emerald-500/40 rounded-2xl p-4 shadow-2xl relative overflow-hidden flex flex-col justify-between">
              {/* Card Hologram Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-500/10 to-transparent pointer-events-none" />

              {/* Card Top Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-[10px] text-amber-400 font-bold">
                    ★
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-200 uppercase tracking-wider">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                    <p className="text-[8px] text-cyan-400 font-semibold">CĂN CƯỚC CÔNG DÂN GẮN CHIP</p>
                  </div>
                </div>
                <div className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[8px] font-mono border border-rose-500/40">
                  AI FORGED
                </div>
              </div>

              {/* Card Body */}
              <div className="grid grid-cols-12 gap-3 items-center py-1">
                {/* Portrait box */}
                <div className="col-span-4 aspect-[3/4] bg-slate-950 rounded-lg border border-slate-700 flex items-center justify-center relative overflow-hidden">
                  <ellipse cx="50%" cy="40%" rx="30%" ry="25%" fill="#64748b" />
                  <path d="M10,45 C20,35 40,35 50,45 Z" fill="#475569" />
                  {/* Micro-print artifact overlay */}
                  <span className="absolute bottom-1 text-[6px] text-rose-400 font-mono">VI MÔ NHÒE</span>
                </div>

                {/* Info Text */}
                <div className="col-span-8 space-y-1 text-[9px]">
                  <div>
                    <span className="text-slate-500 block text-[7px]">Số / No.:</span>
                    <span className="font-mono text-cyan-300 font-black">001095034821</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[7px]">Họ và tên / Full name:</span>
                    <span className="font-bold text-white uppercase">NGUYỄN VĂN ANH</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[7px]">Ngày sinh / Date of birth:</span>
                    <span className="text-slate-300">15/08/1995</span>
                  </div>
                </div>
              </div>

              {/* Card Bottom Chip */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[8px] font-mono text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <div className="w-5 h-4 bg-amber-400/80 rounded-sm border border-amber-300 flex items-center justify-center text-[6px] font-bold text-slate-950">
                    CHIP
                  </div>
                  <span>FLAT GOLD TEXTURE</span>
                </div>
                <span className="text-slate-500">HSD: 15/08/2035</span>
              </div>
            </div>
          </div>
        )}

        {vType === 'real_courier_selfie' && (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-950 flex items-center justify-center p-4">
            <svg viewBox="0 0 400 250" className="w-full h-full max-h-[300px]">
              {/* Natural Doorway & Brick Wall */}
              <rect x="0" y="0" width="400" height="250" fill="#1e293b" />
              {/* Concrete floor with authentic realistic shadow */}
              <polygon points="0,190 400,190 400,250 0,250" fill="#0f172a" />
              {/* Doorframe */}
              <rect x="60" y="20" width="120" height="170" fill="#334155" stroke="#475569" strokeWidth="2" />
              <rect x="70" y="30" width="100" height="160" fill="#1e293b" />
              {/* Door handle */}
              <circle cx="80" cy="110" r="3" fill="#cbd5e1" />

              {/* Delivery Parcel on Porch */}
              <polygon points="210,180 260,180 270,165 220,165" fill="#d97706" />
              <polygon points="210,180 260,180 260,210 210,210" fill="#b45309" />
              <polygon points="260,180 270,165 270,195 260,210" fill="#92400e" />

              {/* Natural Shadow across ground matching sun light */}
              <polygon points="210,210 270,210 320,240 240,240" fill="#020617" opacity="0.6" />

              {/* Delivery Driver Arm holding phone camera selfie */}
              <path d="M290,250 C300,190 350,150 400,180" fill="none" stroke="#f59e0b" strokeWidth="22" strokeLinecap="round" />

              {/* House Number Plate with crisp mechanical font */}
              <rect x="75" y="45" width="40" height="18" rx="2" fill="#0284c7" />
              <text x="95" y="58" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                48B
              </text>

              {/* Timestamp Watermark (Camera App) */}
              <text x="380" y="235" fill="#f8fafc" fontSize="9" textAnchor="end" fontFamily="monospace" opacity="0.8">
                2026/09/12 17:42:15 • GIAOHANGNHANH
              </text>
            </svg>
          </div>
        )}

        {vType === 'real_family_gathering' && (
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/40 via-slate-950 to-slate-900 flex items-center justify-center">
            <svg viewBox="0 0 400 250" className="w-full h-full max-h-[300px]">
              {/* Living room living space */}
              <rect x="0" y="0" width="400" height="250" fill="#18181b" />
              {/* Couch */}
              <rect x="60" y="120" width="280" height="100" rx="16" fill="#27272a" />

              {/* Person 1 (Elderly Man waving hand) */}
              <ellipse cx="140" cy="110" rx="22" ry="26" fill="#f59e0b" />
              <path d="M110,180 C120,140 160,140 170,180 Z" fill="#3b82f6" />
              {/* Natural Waving Hand overlapping face without glitch */}
              <path d="M165,110 Q180,85 190,95 Q180,115 170,120" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />

              {/* Person 2 (Woman smiling) */}
              <ellipse cx="230" cy="115" rx="20" ry="24" fill="#fbbf24" />
              <path d="M205,180 C215,145 250,145 260,180 Z" fill="#ec4899" />

              {/* Peach blossom tree in background (Hoa đào Tết) */}
              <path d="M340,160 L340,60" stroke="#78350f" strokeWidth="4" />
              <circle cx="330" cy="70" r="5" fill="#f43f5e" />
              <circle cx="350" cy="65" r="4" fill="#f43f5e" />
              <circle cx="340" cy="50" r="6" fill="#fb7185" />
            </svg>
          </div>
        )}

        {vType === 'real_traffic_scene' && (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center p-4">
            <svg viewBox="0 0 400 250" className="w-full h-full max-h-[300px]">
              {/* Asphalt Road & Crosswalk */}
              <rect x="0" y="0" width="400" height="250" fill="#0f172a" />
              <polygon points="0,150 400,150 400,250 0,250" fill="#1e293b" />
              {/* White road markings */}
              <rect x="50" y="210" width="60" height="12" fill="#94a3b8" opacity="0.8" />
              <rect x="170" y="210" width="60" height="12" fill="#94a3b8" opacity="0.8" />
              <rect x="290" y="210" width="60" height="12" fill="#94a3b8" opacity="0.8" />
              {/* Car Bumper & Scratches */}
              <path d="M80,180 Q200,100 340,180 L360,240 L60,240 Z" fill="#334155" stroke="#475569" strokeWidth="2" />
              {/* Headlight */}
              <polygon points="280,150 340,160 320,185 270,175" fill="#fef08a" opacity="0.9" />
              {/* Real physical scratch vector */}
              <path d="M150,165 Q180,175 220,170" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
              <path d="M160,170 Q190,180 215,176" stroke="#94a3b8" strokeWidth="1.5" />
              {/* Realistic Shadow */}
              <ellipse cx="200" cy="242" rx="140" ry="8" fill="#020617" opacity="0.7" />
              {/* Camera Time & GPS Watermark */}
              <text x="380" y="30" fill="#38bdf8" fontSize="9" textAnchor="end" fontFamily="monospace" opacity="0.85">
                CAM_REC • 2026/09/10 14:32:08 • ISO 100
              </text>
            </svg>
          </div>
        )}

        {vType === 'bank_certificate' && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-sm aspect-[1.6/1] bg-amber-50/95 text-slate-900 rounded-xl p-4 shadow-2xl relative overflow-hidden border-2 border-amber-600/60 flex flex-col justify-between">
              {/* Header */}
              <div className="border-b border-amber-800/30 pb-1.5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black tracking-tight uppercase text-amber-950">NGÂN HÀNG THƯƠNG MẠI CỔ PHẦN</p>
                  <p className="text-[8px] font-bold text-amber-800">GIẤY CHỨNG NHẬN TIỀN GỬI TIẾT KIỆM</p>
                </div>
                <div className="w-6 h-6 rounded-full border border-amber-700/50 flex items-center justify-center text-[8px] font-bold text-amber-900">
                  VIP
                </div>
              </div>
              {/* Body */}
              <div className="space-y-1 my-1 text-[9px]">
                <div className="flex justify-between">
                  <span className="text-slate-600 text-[8px]">Khách hàng:</span>
                  <span className="font-bold text-slate-900">HOÀNG VĂN THÀNH</span>
                </div>
                <div className="flex justify-between bg-amber-100/80 px-1.5 py-0.5 rounded border border-amber-300/50">
                  <span className="text-amber-900 font-bold text-[8px]">Số tiền gửi:</span>
                  <span className="font-mono font-black text-rose-700 text-[10px]">5.000.000.000 VNĐ</span>
                </div>
                <div className="flex justify-between text-[8px]">
                  <span className="text-slate-600">Kỳ hạn: 12 Tháng</span>
                  <span className="text-slate-600">Lãi suất: 7.2%/năm</span>
                </div>
              </div>
              {/* Seal and sign artifact */}
              <div className="flex items-center justify-between pt-1 border-t border-amber-800/30 text-[8px]">
                <span className="font-mono text-slate-500">MÃ SỔ: STK-881902</span>
                <div className="relative">
                  {/* Blurry red seal artifact */}
                  <div className="w-10 h-10 rounded-full border-2 border-rose-600/70 border-dashed flex items-center justify-center text-[7px] text-rose-600 font-bold rotate-[-12deg] bg-rose-500/10">
                    MỘC GIẢ
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {vType === 'real_student_id' && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 flex items-center justify-center p-4">
            <div className="w-full max-w-sm aspect-[1.58/1] bg-white text-slate-900 rounded-xl p-3.5 shadow-2xl relative overflow-hidden border border-slate-300 flex flex-col justify-between">
              {/* University Header */}
              <div className="flex items-center space-x-2 border-b border-blue-900/20 pb-1.5">
                <div className="w-7 h-7 rounded-lg bg-blue-700 flex items-center justify-center text-white font-black text-[10px]">
                  BK
                </div>
                <div>
                  <p className="text-[9px] font-black text-blue-900 uppercase">ĐẠI HỌC BÁCH KHOA HÀ NỘI</p>
                  <p className="text-[8px] font-bold text-slate-600">THẺ SINH VIÊN & THƯ VIỆN</p>
                </div>
              </div>
              {/* Student info */}
              <div className="grid grid-cols-12 gap-2.5 items-center my-1">
                <div className="col-span-4 aspect-[3/4] bg-slate-100 rounded border border-slate-300 flex items-center justify-center overflow-hidden">
                  <ellipse cx="50%" cy="40%" rx="30%" ry="25%" fill="#94a3b8" />
                  <path d="M10,45 C20,35 40,35 50,45 Z" fill="#64748b" />
                </div>
                <div className="col-span-8 space-y-0.5 text-[8.5px]">
                  <p className="text-slate-500 text-[7.5px]">Họ và tên:</p>
                  <p className="font-bold text-slate-900 uppercase text-[9.5px]">LÊ HOÀNG NAM</p>
                  <p className="text-slate-500 text-[7.5px]">MSSV: <span className="font-mono font-bold text-blue-800">20224590</span></p>
                  <p className="text-slate-500 text-[7.5px]">Khoa: <span className="text-slate-800 font-medium">Công nghệ thông tin</span></p>
                </div>
              </div>
              {/* Crisp Barcode */}
              <div className="pt-1 border-t border-slate-200 flex items-center justify-between">
                <div className="flex space-x-0.5 items-end h-4">
                  {[2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 2, 1, 3, 2, 1].map((w, idx) => (
                    <div key={idx} className="bg-slate-900 h-full" style={{ width: `${w * 1.5}px` }} />
                  ))}
                </div>
                <span className="text-[8px] font-mono text-slate-500">Khóa 67 • 2022-2027</span>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Landmarks Overlay */}
        {showLandmarks && item.visualData?.landmarks && (
          <div className="absolute inset-0 pointer-events-auto">
            {item.visualData.landmarks.map((mark, i) => {
              const isSelected = selectedLandmark === i;
              return (
                <div
                  key={i}
                  style={{ left: `${mark.x}%`, top: `${mark.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
                  onClick={() => {
                    playButtonClick();
                    setSelectedLandmark(isSelected ? null : i);
                  }}
                >
                  <div className="relative">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border-2 shadow-lg transition-transform ${
                        mark.isArtifact
                          ? 'bg-rose-500 text-white border-rose-300 animate-pulse'
                          : 'bg-emerald-500 text-slate-950 border-emerald-300'
                      } ${isSelected ? 'scale-125 ring-4 ring-cyan-400' : 'hover:scale-110'}`}
                    >
                      {i + 1}
                    </span>

                    {/* Popover tooltip */}
                    {isSelected && (
                      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 w-48 p-2.5 rounded-xl bg-slate-950/95 border border-cyan-500/50 text-left shadow-2xl backdrop-blur-md z-30 pointer-events-none">
                        <div className="flex items-center space-x-1.5 text-[10px] font-bold text-cyan-400 mb-1">
                          <Info className="w-3 h-3" />
                          <span>{mark.label}</span>
                        </div>
                        <p className="text-[10px] text-slate-200 leading-snug">
                          {mark.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Magnifier / Forensic Glass Simulation */}
        {isMagnifierActive && (
          <div
            style={{
              left: `${magnifierPos.x}%`,
              top: `${magnifierPos.y}%`,
            }}
            className="absolute w-28 h-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)] backdrop-brightness-125 backdrop-contrast-125 overflow-hidden pointer-events-none z-30 flex items-center justify-center"
          >
            <div className="w-full h-full rounded-full border border-dashed border-cyan-300/60 flex items-center justify-center">
              <span className="text-[9px] font-mono font-bold text-cyan-300 bg-slate-950/80 px-1.5 py-0.5 rounded">
                2.5x ZOOM
              </span>
            </div>
          </div>
        )}

        {/* Visual Viewport Controls Bar */}
        <div className="absolute bottom-2 right-2 flex items-center space-x-2 bg-slate-950/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-800 text-[10px] font-bold text-slate-300 z-10">
          <button
            onClick={() => {
              playButtonClick();
              setShowLandmarks(!showLandmarks);
            }}
            className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors ${
              showLandmarks ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Điểm Soi Pháp Y</span>
          </button>

          <button
            onClick={() => {
              playButtonClick();
              setIsMagnifierActive(!isMagnifierActive);
            }}
            className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors ${
              isMagnifierActive ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'hover:text-white'
            }`}
          >
            <Search className="w-3 h-3" />
            <span>Kính Lúp 2.5x</span>
          </button>
        </div>
      </div>
    );
  };

  // Render Audio Spectrogram & Waveform
  const renderAudioAnalyzer = (item: DeepfakeQuizItem) => {
    const audioData = item.audioData;
    if (!audioData) return null;

    return (
      <div className="w-full bg-slate-950 rounded-2xl p-5 border border-slate-800 shadow-2xl space-y-4">
        {/* Audio Header & Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center space-x-2">
                <span>{audioData.speakerName}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-mono">
                  {audioData.sampleDuration}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{audioData.ambientDescription}</p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px]">
            <button
              onClick={() => {
                playButtonClick();
                setActiveAudioTab('waveform');
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                activeAudioTab === 'waveform'
                  ? 'bg-purple-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Dạng Sóng (Wave)
            </button>
            <button
              onClick={() => {
                playButtonClick();
                setActiveAudioTab('spectrogram');
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                activeAudioTab === 'spectrogram'
                  ? 'bg-purple-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Phổ Tần (Spectral)
            </button>
          </div>
        </div>

        {/* Visualized Canvas / Waveform */}
        <div className="relative h-28 bg-slate-900/90 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center px-4">
          {/* Audio progress bar */}
          <div
            className="absolute top-0 left-0 bottom-0 bg-purple-500/15 transition-all duration-100 pointer-events-none"
            style={{ width: `${audioProgress}%` }}
          />

          {activeAudioTab === 'waveform' ? (
            <div className="flex items-center justify-center gap-1.5 w-full h-20">
              {audioData.waveformBars.map((val, idx) => {
                const isActive = (idx / audioData.waveformBars.length) * 100 <= audioProgress;
                const dynamicHeight = isPlayingAudio
                  ? Math.min(100, Math.max(15, val + (Math.sin(Date.now() / 200 + idx) * 20)))
                  : val;

                return (
                  <motion.div
                    key={idx}
                    animate={{ height: `${dynamicHeight}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`w-2 rounded-full transition-colors ${
                      isActive
                        ? 'bg-gradient-to-t from-purple-500 to-cyan-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]'
                        : 'bg-slate-800'
                    }`}
                  />
                );
              })}
            </div>
          ) : (
            /* Spectrogram Frequency Bands Inspection */
            <div className="w-full h-full flex flex-col justify-between py-2 text-[9px] font-mono text-slate-400">
              <div className="flex justify-between items-center text-rose-400 border-b border-dashed border-rose-500/30 pb-0.5">
                <span>20 kHz</span>
                <span>{item.verdict === 'ai' ? '⚠️ TẦN SỐ CAO BỊ CẮT CỤT > 14kHz' : '✓ DẢI HÀI ÂM ĐẦY ĐỦ'}</span>
              </div>
              <div className="flex justify-between items-center text-amber-400 border-b border-dashed border-slate-800 pb-0.5">
                <span>8 kHz (Fricative /s/, /t/)</span>
                <span>{item.verdict === 'ai' ? 'Âm kim loại nhân tạo' : 'Âm gió màng rung tự nhiên'}</span>
              </div>
              <div className="flex justify-between items-center text-cyan-400 border-b border-dashed border-slate-800 pb-0.5">
                <span>2 kHz (Formant F1, F2)</span>
                <span>Ngữ điệu thanh điệu Việt Nam</span>
              </div>
              <div className="flex justify-between items-center text-emerald-400">
                <span>200 Hz (Pitch cơ bản F0)</span>
                <span>{item.verdict === 'ai' ? 'Dao động phẳng (Flat)' : 'Độ nảy cảm xúc phong phú'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Audio Transcript box */}
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Lời thoại ghi âm:</span>
            <span>Ngôn ngữ: Tiếng Việt</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed italic font-medium">
            "{audioData.transcript}"
          </p>
        </div>

        {/* Playback Controls Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleAudio}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider flex items-center space-x-2 transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-rose-500 hover:bg-rose-400 text-slate-950 shadow-lg shadow-rose-500/25'
                  : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-slate-950 shadow-lg shadow-purple-500/25'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Dừng Nghe</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Phát Đoạn Ghi Âm</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                playButtonClick();
                setAudioSpeed((prev) => (prev === 1 ? 0.75 : 1));
              }}
              className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-mono font-bold border border-slate-800 transition-colors"
              title="Tốc độ nghe phân tích chậm"
            >
              Tốc Độ: {audioSpeed}x
            </button>
          </div>

          <span className="text-[11px] text-slate-500 font-mono">
            {isPlayingAudio ? 'Đang phân tích âm học...' : 'Nhấn phát để nghe chi tiết'}
          </span>
        </div>
      </div>
    );
  };

  // Completion Screen View
  if (isCompleted) {
    const accuracy = Math.round((score / quizList.length) * 100);

    return (
      <div className="max-w-2xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-6 shadow-2xl animate-fadeIn">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-500 to-cyan-400 flex items-center justify-center text-slate-950 mx-auto shadow-xl shadow-cyan-500/20">
          <Trophy className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            HOÀN THÀNH THỬ THÁCH SOI DEEPFAKE!
          </h3>
          <p className="text-sm text-slate-300">
            Bạn đã hoàn tất phân tích toàn bộ các mẫu âm thanh và hình ảnh mô phỏng.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-800">
          <div>
            <div className="text-2xl font-black text-cyan-400 font-mono">{score}/{quizList.length}</div>
            <div className="text-[11px] text-slate-400 font-bold uppercase">Điểm Chính Xác</div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-400 font-mono">{accuracy}%</div>
            <div className="text-[11px] text-slate-400 font-bold uppercase">Tỷ Lệ Nhận Diện</div>
          </div>
          <div>
            <div className="text-2xl font-black text-purple-400 font-mono">+{claimedXp}</div>
            <div className="text-[11px] text-slate-400 font-bold uppercase">XP Đạt Được</div>
          </div>
        </div>

        {/* Assessment Verdict Badge */}
        <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-left space-y-1">
          <div className="flex items-center space-x-2 text-cyan-300 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Đánh Giá Năng Lực Pháp Y AI:</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {accuracy >= 80
              ? 'Thần thái tinh tường! Bạn có khả năng phát hiện các lỗi vi mô của công nghệ Deepfake giọng nói và hoán đổi mặt cực kỳ sắc bén.'
              : accuracy >= 50
              ? 'Khá tốt! Bạn đã nhận ra được hầu hết các dấu hiệu bất thường cơ bản, nhưng cần chú ý thêm dải tần số âm thanh kim loại và sự đối xứng của ánh sáng mắt.'
              : 'Hãy luyện tập thêm! Công nghệ Deepfake ngày càng tinh vi, đừng quên quy tắc "Gọi lại số danh bạ chính chủ" và "Yêu cầu vẫy tay trước camera".'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleRestartQuiz}
            className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Luyện Tập Lại Toàn Bộ</span>
          </button>

          {onOpenCaseLab && (
            <button
              onClick={onOpenCaseLab}
              className="flex-1 py-3 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Eye className="w-4 h-4 text-purple-400" />
              <span>Xem Hồ Sơ Pháp Y Chuyên Sâu</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Card: Title, Live Score & Filter Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  ĐỐ VUI NHẬN DIỆN DEEPFAKE
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 font-bold border border-purple-800">
                  REAL vs AI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Phân tích các mẫu âm thanh và hình ảnh thực tế: Phán đoán xem đây là Người Thật hay Do AI Tổng Hợp!
              </p>
            </div>
          </div>

          {/* Score & Streak Badges */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 text-xs font-black font-mono">
              <Flame className="w-4 h-4 fill-amber-400 animate-bounce" />
              <span>{streak} Chuỗi</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 text-xs font-black font-mono">
              <Trophy className="w-4 h-4" />
              <span>{score}/{quizList.length} Đúng</span>
            </div>
          </div>
        </div>

        {/* Filter Pills & Progress Step */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-center space-x-1.5 w-full sm:w-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === 'all'
                  ? 'bg-purple-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Tất Cả ({DEEPFAKE_QUIZ_DATA.length})
            </button>
            <button
              onClick={() => setFilterType('audio')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                filterType === 'audio'
                  ? 'bg-purple-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Volume2 className="w-3 h-3" />
              <span>Giọng Nói AI</span>
            </button>
            <button
              onClick={() => setFilterType('visual')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                filterType === 'visual'
                  ? 'bg-purple-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Ảnh & Video Call</span>
            </button>
          </div>

          {/* Stepper bar */}
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 w-full sm:w-auto justify-end">
            <span>Câu hỏi {currentIndex + 1} / {quizList.length}</span>
            <div className="w-24 h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / quizList.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Quick Jump Map */}
        <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Chuyển nhanh:</span>
          {quizList.map((q, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={q.id}
                onClick={() => {
                  stopAudio();
                  setCurrentIndex(idx);
                  setUserChoice(null);
                  setIsAnswered(false);
                  setSelectedLandmark(null);
                }}
                className={`w-7 h-7 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center relative ${
                  isActive
                    ? 'bg-purple-500 text-slate-950 ring-2 ring-purple-400 shadow-md shadow-purple-500/30 scale-105'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
                title={`Câu ${idx + 1}: ${q.title}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Inspection Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Media Presentation & Telltales (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
          {/* Question Meta Badge */}
          <div className="flex items-center justify-between text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-purple-300 font-semibold border border-purple-500/30 flex items-center space-x-1.5">
              {currentItem.mediaType === 'audio' ? (
                <Volume2 className="w-3.5 h-3.5 text-purple-400" />
              ) : (
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
              )}
              <span>{currentItem.category}</span>
            </span>

            <span className="px-2.5 py-0.5 rounded-md bg-slate-950 text-slate-400 font-mono text-[11px] border border-slate-800">
              Độ Khó: {currentItem.difficulty}
            </span>
          </div>

          {/* Title & Context Scenario */}
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-black text-white leading-snug">
              {currentItem.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
              {currentItem.context}
            </p>
          </div>

          {/* Active Media Renderer (Visual Graphic or Audio Waveform) */}
          <div className="pt-1">
            {currentItem.mediaType === 'visual' ? (
              renderVisualMockup(currentItem)
            ) : (
              renderAudioAnalyzer(currentItem)
            )}
          </div>

          {/* Action Decision Buttons */}
          <div className="space-y-3 pt-2">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block text-center">
              Nhận định của bạn về nội dung trên:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option: REAL */}
              <button
                onClick={() => handleSelectVerdict('real')}
                disabled={isAnswered}
                className={`py-4 px-5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center space-x-2.5 cursor-pointer ${
                  isAnswered
                    ? currentItem.verdict === 'real'
                      ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-400/50 font-black shadow-lg shadow-emerald-500/20'
                      : userChoice === 'real'
                      ? 'bg-rose-500 text-white line-through opacity-60'
                      : 'bg-slate-950 text-slate-600 border border-slate-800'
                    : 'bg-slate-950 hover:bg-emerald-950/40 text-emerald-400 border border-emerald-500/40 hover:border-emerald-400 shadow-md hover:shadow-emerald-500/10'
                }`}
              >
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                <span>🟢 NGƯỜI THẬT / NGUYÊN BẢN (REAL)</span>
              </button>

              {/* Option: AI */}
              <button
                onClick={() => handleSelectVerdict('ai')}
                disabled={isAnswered}
                className={`py-4 px-5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center space-x-2.5 cursor-pointer ${
                  isAnswered
                    ? currentItem.verdict === 'ai'
                      ? 'bg-purple-500 text-slate-950 ring-4 ring-purple-400/50 font-black shadow-lg shadow-purple-500/20'
                      : userChoice === 'ai'
                      ? 'bg-rose-500 text-white line-through opacity-60'
                      : 'bg-slate-950 text-slate-600 border border-slate-800'
                    : 'bg-slate-950 hover:bg-purple-950/40 text-purple-400 border border-purple-500/40 hover:border-purple-400 shadow-md hover:shadow-purple-500/10'
                }`}
              >
                <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                <span>🤖 DO AI TỔNG HỢP (AI-GENERATED)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Forensic Debrief & Feedback (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
          {isAnswered ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              {/* Verdict Header Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-center space-x-3.5 ${
                  userChoice === currentItem.verdict
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                }`}
              >
                {userChoice === currentItem.verdict ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
                )}
                <div>
                  <h4 className="text-sm font-black uppercase">
                    {userChoice === currentItem.verdict
                      ? `CHÍNH XÁC! (+${currentItem.xpReward} XP)`
                      : 'CHƯA CHÍNH XÁC! HÃY CẨN TRỌNG'}
                  </h4>
                  <p className="text-xs opacity-90 font-medium">
                    Kết luận pháp y: {currentItem.verdict === 'ai' ? '🤖 Do Trí Tuệ Nhân Tạo AI Tạo Ra' : '🟢 Người Thật / Chân Thực Nguyên Bản'}
                  </p>
                </div>
              </div>

              {/* Summary Description */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-200 leading-relaxed font-medium">
                {currentItem.forensicExplanation.summary}
              </div>

              {/* Telltale Signs / Artifacts */}
              <div className="space-y-2">
                <h5 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Dấu Hiệu Nhận Diện Then Chốt:</span>
                </h5>
                <ul className="space-y-1.5">
                  {currentItem.forensicExplanation.telltaleSigns.map((sign, idx) => (
                    <li
                      key={idx}
                      className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 text-xs text-slate-300 flex items-start space-x-2"
                    >
                      <span className="text-cyan-400 font-bold shrink-0">•</span>
                      <span>{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technical Analysis */}
              <div className="p-3 bg-purple-950/20 border border-purple-500/30 rounded-2xl space-y-1 text-xs">
                <span className="font-bold text-purple-300 flex items-center space-x-1.5">
                  <Radio className="w-3.5 h-3.5" />
                  <span>Cơ chế kỹ thuật đằng sau:</span>
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {currentItem.forensicExplanation.technicalAnalysis}
                </p>
              </div>

              {/* Defense Rule */}
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl space-y-1 text-xs">
                <span className="font-bold text-emerald-300 flex items-center space-x-1.5">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Quy tắc phòng thủ đời thực:</span>
                </span>
                <p className="text-slate-200 font-semibold leading-relaxed">
                  {currentItem.forensicExplanation.defenseRule}
                </p>
              </div>

              {/* Next Question Button */}
              <button
                onClick={handleNextQuestion}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>{currentIndex < quizList.length - 1 ? 'Câu Tiếp Theo' : 'Xem Báo Cáo Tổng Kết'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            /* Idle Inspection Prompt */
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12 text-slate-500">
              <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                <Eye className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-300">
                Hệ Thống Đang Chờ Phán Đoán Của Bạn
              </h4>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Hãy lắng nghe kỹ âm sắc đoạn thoại hoặc sử dụng các công cụ phóng đại soi điểm lỗi hình ảnh. Chọn <strong>Người Thật</strong> hoặc <strong>Do AI Tổng Hợp</strong> để kiểm tra kết quả!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
