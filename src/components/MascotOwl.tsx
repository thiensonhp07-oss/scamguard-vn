import React, { useState } from 'react';
import { Sparkles, X, ShieldAlert, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import mascotShieldImg from '../assets/images/mascot_shield_transparent.png';
import mascotCyberpunkImg from '../assets/images/mascot_cyberpunk_shield_transparent.png';

interface MascotOwlProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'floating' | 'banner' | 'avatar' | 'badge' | 'hero-popout';
  message?: string;
  className?: string;
  onClick?: () => void;
  state?: 'safe' | 'alert';
}

export const MascotOwl: React.FC<MascotOwlProps> = ({
  size = 'md',
  variant = 'avatar',
  message,
  className = '',
  onClick,
  state = 'safe',
}) => {
  const [showBubble, setShowBubble] = useState(true);

  const isAlert = state === 'alert';

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24 sm:w-28 sm:h-28',
    xl: 'w-32 h-32 sm:w-44 sm:h-44',
  }[size];

  // Helper to render the mascot image with cyber HUD rings and perfect no-crop spacing
  const renderMascotImage = (forcedAlert = isAlert) => (
    <div className="relative w-full h-full rounded-full flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Cyber HUD layer 1: Subtle grid / circuit lines */}
      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,${forcedAlert ? 'rgba(239,68,68,0.2)' : 'rgba(6,182,212,0.2)'}_0%,transparent_75%)] pointer-events-none`} />
      <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,rgba(6,182,212,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.3)_1px,transparent_1px)] bg-[size:6px_6px] pointer-events-none" />
      
      {/* Neon Energy Sphere Backdrop (Slow rotating radial gradient mesh) */}
      <div className={`absolute inset-1 rounded-full bg-gradient-to-tr ${forcedAlert ? 'from-red-500/25 via-orange-600/20 to-amber-500/25 animate-[spin_10s_linear_infinite]' : 'from-cyan-500/20 via-indigo-500/20 to-purple-500/25 animate-[spin_12s_linear_infinite]'} blur-sm opacity-80`} />
      <div className={`absolute inset-2 rounded-full bg-gradient-to-bl ${forcedAlert ? 'from-amber-500/10 via-red-600/15 to-rose-500/15 animate-[spin_18s_linear_infinite_reverse]' : 'from-purple-500/10 via-blue-600/15 to-emerald-500/15 animate-[spin_20s_linear_infinite_reverse]'} blur-md opacity-70`} />

      {/* Cyber HUD layer 2: Rotating sci-fi dashed orbit lines */}
      <div className={`absolute inset-0.5 rounded-full border border-dashed ${forcedAlert ? 'border-rose-500/40' : 'border-cyan-400/40'} animate-[spin_24s_linear_infinite]`} />
      <div className={`absolute inset-2 rounded-full border border-dotted ${forcedAlert ? 'border-amber-500/40' : 'border-purple-500/40'} animate-[spin_14s_linear_infinite_reverse]`} />
      <div className={`absolute inset-3.5 rounded-full border border-double ${forcedAlert ? 'border-orange-400/30' : 'border-blue-400/30'} pointer-events-none`} />

      {/* Futuristic neon energy sweep lines */}
      <div className={`absolute inset-0 bg-gradient-to-b ${forcedAlert ? 'from-red-500/0 via-red-400/10 to-red-500/0' : 'from-cyan-500/0 via-cyan-400/10 to-cyan-500/0'} w-full h-1/2 animate-pulse pointer-events-none`} />

      {/* Perfect circular container, scaled to display mascot image */}
      <div className={`relative w-[82%] h-[82%] rounded-full bg-slate-900/60 flex items-center justify-center p-1.5 overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.45)] border ${forcedAlert ? 'border-rose-300/40 shadow-rose-500/30' : 'border-cyan-300/40 shadow-cyan-500/30'} group-hover:scale-[1.05] transition-all duration-300`}>
        <img
          src={forcedAlert ? mascotCyberpunkImg : mascotShieldImg}
          alt="CyberGuard Mascot"
          className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.7)]"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* Glossy futuristic overlay reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/10 to-white/35 pointer-events-none rounded-full" />
      </div>

      {/* Outer target crosshairs overlay */}
      <div className={`absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-2 ${forcedAlert ? 'bg-red-400/70' : 'bg-cyan-400/70'}`} />
      <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-2 ${forcedAlert ? 'bg-red-400/70' : 'bg-cyan-400/70'}`} />
      <div className={`absolute left-1 top-1/2 -translate-y-1/2 h-0.5 w-2 ${forcedAlert ? 'bg-red-400/70' : 'bg-cyan-400/70'}`} />
      <div className={`absolute right-1 top-1/2 -translate-y-1/2 h-0.5 w-2 ${forcedAlert ? 'bg-red-400/70' : 'bg-cyan-400/70'}`} />
    </div>
  );

  if (variant === 'hero-popout') {
    // Majestic, 3D Pop-out full-body visualization with overflow standing proud
    return (
      <div className={`relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center select-none ${className}`}>
        {/* Glow Spherical Aura Background */}
        <div className={`absolute inset-4 rounded-full bg-gradient-to-tr ${isAlert ? 'from-red-500/30 via-orange-500/20 to-rose-500/25 shadow-[0_0_40px_rgba(239,68,68,0.4)]' : 'from-cyan-500/25 via-blue-500/20 to-purple-500/25 shadow-[0_0_45px_rgba(6,182,212,0.45)]'} animate-[spin_16s_linear_infinite] blur-md`} />
        
        {/* Outer Orbiting Laser Dash Bracket */}
        <div className={`absolute inset-1 rounded-full border-2 border-dashed ${isAlert ? 'border-rose-500/40' : 'border-cyan-400/40'} animate-[spin_24s_linear_infinite]`} />
        <div className={`absolute inset-5 rounded-full border border-dotted ${isAlert ? 'border-amber-400/30' : 'border-indigo-400/30'} animate-[spin_14s_linear_infinite_reverse]`} />

        {/* Floating Pod/Stand */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-4.5 bg-slate-900/95 border border-cyan-500/30 rounded-full flex items-center justify-center shadow-inner overflow-hidden z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-pulse" />
          <span className="text-[7.5px] font-black tracking-widest text-cyan-400 uppercase">SYS_SHIELD v4.2</span>
        </div>

        {/* Full Character Avatar, Standing & Popping out */}
        <motion.div
          className="absolute w-[80%] h-[80%] flex items-center justify-center z-10"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
        >
          <div className={`relative w-full h-full rounded-full bg-slate-950/40 backdrop-blur-sm p-1.5 border-2 ${isAlert ? 'border-rose-500/40 shadow-[0_0_28px_rgba(239,68,68,0.4)]' : 'border-cyan-400/40 shadow-[0_0_32px_rgba(6,182,212,0.45)]'} flex items-center justify-center overflow-hidden`}>
            <img
              src={isAlert ? mascotCyberpunkImg : mascotShieldImg}
              alt="CyberGuard Mascot Hero"
              className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] scale-105"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/5 to-white/20 pointer-events-none rounded-full" />
          </div>
        </motion.div>

        {/* Online Pulse Indicator */}
        <div className={`absolute top-2 right-0 z-20 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border shadow-md flex items-center space-x-1 ${isAlert ? 'bg-rose-950/90 text-rose-300 border-rose-500/50 shadow-rose-950/50' : 'bg-slate-950/90 text-cyan-300 border-cyan-500/50 shadow-cyan-950/50'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isAlert ? 'bg-rose-400 animate-ping' : 'bg-cyan-400 animate-ping'}`} />
          <span>{isAlert ? 'WARN' : 'SECURE'}</span>
        </div>
      </div>
    );
  }

  if (variant === 'floating') {
    return (
      <div
        className={`fixed bottom-24 lg:bottom-8 right-4 sm:right-8 z-50 flex items-end space-x-3.5 group select-none ${className}`}
      >
        {message && showBubble && (
          <div className="bg-slate-950/95 border border-cyan-500/30 text-slate-100 px-4 py-3.5 rounded-2xl shadow-[0_10px_30px_rgba(6,182,212,0.25)] max-w-[240px] sm:max-w-xs text-xs font-semibold backdrop-blur-xl relative animate-scaleUp">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBubble(false);
              }}
              aria-label="Đóng lời khuyên"
              className="absolute -top-2 -left-2 w-5.5 h-5.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full border border-slate-700/80 flex items-center justify-center text-[10px] cursor-pointer shadow-md transition-all active:scale-90 font-black"
            >
              ✕
            </button>
            <div className="flex items-center space-x-1 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="text-cyan-400 font-black text-[10px] uppercase tracking-widest">Cố vấn CyberGuard:</span>
            </div>
            <p className="leading-relaxed text-slate-200">{message}</p>
            {/* Speech bubble pointer */}
            <div className="absolute bottom-4 -right-1.5 w-3 h-3 bg-slate-950 border-r border-b border-cyan-500/30 transform rotate-45" />
          </div>
        )}
        
        <div
          onClick={onClick}
          className="relative cursor-pointer select-none active:scale-95 transition-all animate-float"
          title="Bấm để tương tác với cố vấn an ninh"
        >
          {/* Glowing pulse ring */}
          <div className={`absolute -inset-1 rounded-full bg-gradient-to-tr ${isAlert ? 'from-rose-500 to-red-500' : 'from-cyan-500 to-blue-500'} opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-300 animate-pulse`} />
          
          <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 bg-gradient-to-tr ${isAlert ? 'from-red-400 via-rose-500 to-amber-400' : 'from-cyan-400 via-blue-500 to-emerald-400'} shadow-[0_0_20px_rgba(6,182,212,0.5)]`}>
            {renderMascotImage()}
          </div>
          
          {/* Waving / Notification indicator */}
          <div className="absolute -top-1 -right-1 flex h-3.5 w-3.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 border border-slate-950"></span>
          </div>

          <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full border border-slate-950 shadow-md flex items-center space-x-0.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
            <span>AI</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40 p-6 sm:p-8 border border-cyan-500/25 rounded-3xl relative overflow-hidden shadow-2xl group ${className}`}>
        {/* Background circuit glow */}
        <div className="absolute right-0 top-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative flex-shrink-0 animate-float">
            {/* Glowing outer disc */}
            <div className={`absolute -inset-1 rounded-full bg-gradient-to-tr ${isAlert ? 'from-rose-400 to-orange-400' : 'from-cyan-400 to-emerald-400'} opacity-60 blur-sm group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1.5 bg-gradient-to-tr ${isAlert ? 'from-red-400 via-rose-500 to-amber-400' : 'from-cyan-400 via-blue-500 to-emerald-400'} shadow-xl`}>
              {renderMascotImage()}
            </div>
            
            <span className={`absolute -bottom-1.5 right-1 ${isAlert ? 'bg-rose-600' : 'bg-emerald-500'} text-slate-950 font-black text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-slate-950 shadow`}>
              {isAlert ? 'WARNING' : 'ONLINE'}
            </span>
          </div>
          
          <div className="space-y-2.5 text-center sm:text-left flex-1">
            <div className={`inline-flex items-center space-x-1.5 ${isAlert ? 'bg-rose-950/80 border-rose-500/30 text-rose-300' : 'bg-cyan-950/80 border-cyan-500/30 text-cyan-300'} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider`}>
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{isAlert ? 'CẢNH BÁO KHẨN CẤP' : 'Linh Vật & Trợ Lý Vệ Binh'}</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white leading-relaxed font-mono">
              {message || (isAlert ? '"Chuỗi ngày hoặc Chỉ số phòng thủ của đồng chí đang suy giảm! Hãy củng cố bảo mật ngay!"' : '"Chào đồng chí vệ binh! Hãy cùng tôi giải mã kịch bản và vạch trần mọi thủ đoạn lừa đảo."')}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl font-medium">
              Tôi luôn sát cánh rà quét, phát hiện các đòn tấn công tâm lý lừa đảo, rò rỉ dữ liệu và hỗ trợ bạn phản kích tuyệt đối.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative inline-block group select-none ${className}`} onClick={onClick}>
      {/* Outer glow aura */}
      <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-500 to-emerald-400 opacity-30 group-hover:opacity-100 blur transition-opacity duration-300 pointer-events-none" />
      
      <div className={`rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 via-blue-500 to-emerald-400 shadow-lg ${sizeClasses}`}>
        {renderMascotImage()}
      </div>
    </div>
  );
};

