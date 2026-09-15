import React from 'react';
import { motion } from 'motion/react';
import { Scan, Copy, Check, AlertOctagon, Terminal, Shield } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ThreatAssessmentResultProps {
  result: AnalysisResult | null;
  loading: boolean;
  onCopy: () => void;
  copied: boolean;
}

export const ThreatAssessmentResult: React.FC<ThreatAssessmentResultProps> = ({
  result,
  loading,
  onCopy,
  copied,
}) => {
  // Current date/time formatted nicely
  const formattedDate = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();

  const formattedTime = new Date().toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (loading) {
    return (
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 text-center space-y-6 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
        <div className="scanner-laser" />
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin flex items-center justify-center" />
          <Scan className="w-8 h-8 text-cyan-400 absolute top-6 left-6 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-black uppercase text-cyan-400 tracking-wider font-mono">
            ENGINE RUNNING...
          </h4>
          <p className="text-xs text-slate-400 max-w-xs font-mono leading-relaxed">
            Đang bóc tách thực thể dữ liệu, nhận diện bẫy tâm lý và khởi chạy phân tích pháp y tên miền...
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-slate-950/90 rounded-3xl p-8 border-2 border-dashed border-slate-800 text-center min-h-[400px] flex flex-col items-center justify-center space-y-6 relative group overflow-hidden">
        {/* Decorative corner grid marks */}
        <div className="absolute top-3 left-3 text-slate-700 font-mono text-[10px] select-none">┌ ASSESSMENT ┐</div>
        <div className="absolute bottom-3 right-3 text-slate-700 font-mono text-[10px] select-none">└ STATUS READY ┘</div>
        
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center relative">
          <div className="w-3 h-3 rounded-full bg-cyan-500 animate-ping absolute" />
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 z-10" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-black tracking-widest text-white font-mono uppercase">
            THREAT ASSESSMENT
          </h3>
          <p className="text-sm font-bold text-cyan-400 font-mono uppercase tracking-wider">
            SẴN SÀNG GIÁM ĐỊNH
          </p>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Nhập nội dung cần giám định ở cột bên trái và bắt đầu kiểm tra.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-900 w-full max-w-[240px] space-y-1.5 font-mono text-[10px] text-slate-500">
          <div className="flex items-center justify-between">
            <span>AI ENGINE STATUS</span>
            <span className="text-emerald-500 font-bold flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
              READY
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>PRIVACY SHIELD</span>
            <span className="text-emerald-500 font-bold">ACTIVE</span>
          </div>
        </div>
      </div>
    );
  }

  const isHighRisk = result.riskScore >= 70;
  const isMediumRisk = result.riskScore >= 40 && result.riskScore < 70;
  
  const riskColorClass = isHighRisk 
    ? 'text-rose-400 border-rose-500/30 bg-rose-950/20' 
    : isMediumRisk 
      ? 'text-amber-400 border-amber-500/30 bg-amber-950/20' 
      : 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20';

  // Extract classification elements
  const primaryThreat = result.threatClassification?.primaryThreat || (isHighRisk ? 'PHISHING' : 'LOW RISK');
  const confidence = result.threatClassification?.confidence || 94;

  // Decide indicator flags
  const showUrlIndicator = result.urlAnalysis || (result.threatBreakdown && result.threatBreakdown.maliciousUrl > 50);
  const showImpersonationIndicator = result.threatBreakdown && result.threatBreakdown.impersonation > 50;
  const showUrgencyIndicator = result.threatBreakdown && result.threatBreakdown.urgency > 50;
  const showCredentialIndicator = result.threatBreakdown && result.threatBreakdown.credentialHarvesting > 50;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800 shadow-2xl relative overflow-hidden bg-slate-950/60"
    >
      {/* Assessment Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <p className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">
            ASSESSMENT #{result.assessmentId || 'SG-8F29A1'}
          </p>
          <p className="text-[11px] font-mono text-slate-400">
            {formattedDate} • {formattedTime}
          </p>
        </div>
        <button
          onClick={onCopy}
          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-bold cursor-pointer transition-all px-2.5 py-1.5 bg-slate-900 rounded-xl border border-slate-800"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="font-mono text-[10px]">{copied ? 'ĐÃ CHÉP' : 'SAO CHÉP'}</span>
        </button>
      </div>

      {/* Main Threat Block */}
      <div className={`p-5 rounded-2xl border-2 space-y-4 text-center ${riskColorClass}`}>
        <div className="flex items-center justify-center space-x-2 font-mono text-xs tracking-wider uppercase font-extrabold">
          <AlertOctagon className="w-4 h-4 animate-pulse" />
          <span>THREAT ASSESSMENT RESULT</span>
        </div>

        <div className="space-y-1">
          <p className="text-3xl sm:text-4xl font-black font-mono tracking-tight">
            {isHighRisk ? '🔴 NGUY HIỂM CAO' : isMediumRisk ? '🟡 NGUY CƠ TRUNG BÌNH' : '🟢 AN TOÀN'}
          </p>
          <p className="text-5xl font-black font-mono tracking-tight text-white py-1">
            {result.riskScore} <span className="text-xl text-slate-500">/ 100</span>
          </p>
        </div>

        <div className="border-t border-slate-800/40 pt-3 space-y-1">
          <p className="text-sm font-black text-white font-mono tracking-wider">{primaryThreat}</p>
          <p className="text-[11px] text-slate-400 font-mono">
            Assessment Confidence: <span className="text-cyan-400 font-black">{confidence >= 75 ? 'HIGH' : confidence >= 45 ? 'MEDIUM' : 'LOW'}</span>
          </p>
        </div>

        {/* Dynamic Indicator Badges inside result */}
        <div className="border-t border-slate-800/40 pt-3 flex flex-col space-y-1.5 text-left text-xs font-mono font-bold text-slate-300">
          {showUrlIndicator && (
            <div className="flex items-center space-x-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              <span className="text-rose-400">🔗</span>
              <span>URL ĐÁNG NGỜ</span>
            </div>
          )}
          {showImpersonationIndicator && (
            <div className="flex items-center space-x-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              <span>🏦</span>
              <span>GIẢ MẠO THƯƠNG HIỆU/NGÂN HÀNG</span>
            </div>
          )}
          {showUrgencyIndicator && (
            <div className="flex items-center space-x-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              <span>⚠️</span>
              <span>TẠO CẢM GIÁC KHẨN CẤP</span>
            </div>
          )}
          {showCredentialIndicator && (
            <div className="flex items-center space-x-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              <span>🔐</span>
              <span>YÊU CẦU THÔNG TIN NHẠY CẢM</span>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Evidence Summary Index */}
      {result.evidenceFound && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 space-y-2 font-mono text-xs">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider">
            🔎 CHỈ SỐ BẰNG CHỨNG (EVIDENCE INDEX)
          </p>
          <div className="grid grid-cols-3 gap-2 text-[10px] text-center font-black">
            <div className="p-1.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              🔴 {result.evidenceFound.filter(ev => ev.severity === 'critical').length} CRIT
            </div>
            <div className="p-1.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              🟠 {result.evidenceFound.filter(ev => ev.severity === 'high').length} HIGH
            </div>
            <div className="p-1.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              🔵 {result.evidenceFound.filter(ev => ev.severity !== 'critical' && ev.severity !== 'high').length} SUSP
            </div>
          </div>
        </div>
      )}

      {/* Threat Breakdown Progress Indicators */}
      {result.threatBreakdown && (
        <div className="space-y-4 pt-2 border-t border-slate-900">
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider font-mono flex items-center space-x-1">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>THREAT INDICATOR ANALYSIS</span>
          </h4>

          <div className="space-y-3 font-mono">
            {/* Malicious URL */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                <span>Malicious URL Risk</span>
                <span className={result.threatBreakdown.maliciousUrl >= 75 ? 'text-rose-400' : result.threatBreakdown.maliciousUrl >= 40 ? 'text-amber-400' : 'text-emerald-400'}>
                  {result.threatBreakdown.maliciousUrl >= 75 ? 'CRITICAL' : result.threatBreakdown.maliciousUrl >= 40 ? 'HIGH' : 'LOW'}
                </span>
              </div>
              <div className="flex items-center text-xs text-slate-500 overflow-hidden select-none tracking-tighter">
                <span className={`py-0.5 rounded px-2 font-black border mr-2 min-w-[72px] text-center text-[10px] ${
                  result.threatBreakdown.maliciousUrl >= 75 ? 'text-rose-400 bg-rose-950/40 border-rose-800/60' : result.threatBreakdown.maliciousUrl >= 40 ? 'text-amber-400 bg-amber-950/40 border-amber-800/60' : 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60'
                }`}>
                  {result.threatBreakdown.maliciousUrl >= 75 ? 'CRITICAL' : result.threatBreakdown.maliciousUrl >= 40 ? 'HIGH' : 'LOW'}
                </span>
                <div className="flex-1 bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full ${result.threatBreakdown.maliciousUrl >= 75 ? 'bg-rose-500' : result.threatBreakdown.maliciousUrl >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${result.threatBreakdown.maliciousUrl}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Impersonation */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                <span>Brand Impersonation</span>
                <span className={result.threatBreakdown.impersonation >= 75 ? 'text-rose-400' : result.threatBreakdown.impersonation >= 40 ? 'text-amber-400' : 'text-emerald-400'}>
                  {result.threatBreakdown.impersonation >= 75 ? 'CRITICAL' : result.threatBreakdown.impersonation >= 40 ? 'HIGH' : 'LOW'}
                </span>
              </div>
              <div className="flex items-center text-xs text-slate-500 overflow-hidden select-none tracking-tighter">
                <span className={`py-0.5 rounded px-2 font-black border mr-2 min-w-[72px] text-center text-[10px] ${
                  result.threatBreakdown.impersonation >= 75 ? 'text-rose-400 bg-rose-950/40 border-rose-800/60' : result.threatBreakdown.impersonation >= 40 ? 'text-amber-400 bg-amber-950/40 border-amber-800/60' : 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60'
                }`}>
                  {result.threatBreakdown.impersonation >= 75 ? 'CRITICAL' : result.threatBreakdown.impersonation >= 40 ? 'HIGH' : 'LOW'}
                </span>
                <div className="flex-1 bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full ${result.threatBreakdown.impersonation >= 75 ? 'bg-rose-500' : result.threatBreakdown.impersonation >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${result.threatBreakdown.impersonation}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Urgency manipulation */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                <span>Urgency Tactics</span>
                <span className={result.threatBreakdown.urgency >= 75 ? 'text-rose-400' : result.threatBreakdown.urgency >= 40 ? 'text-amber-400' : 'text-emerald-400'}>
                  {result.threatBreakdown.urgency >= 75 ? 'CRITICAL' : result.threatBreakdown.urgency >= 40 ? 'HIGH' : 'LOW'}
                </span>
              </div>
              <div className="flex items-center text-xs text-slate-500 overflow-hidden select-none tracking-tighter">
                <span className={`py-0.5 rounded px-2 font-black border mr-2 min-w-[72px] text-center text-[10px] ${
                  result.threatBreakdown.urgency >= 75 ? 'text-rose-400 bg-rose-950/40 border-rose-800/60' : result.threatBreakdown.urgency >= 40 ? 'text-amber-400 bg-amber-950/40 border-amber-800/60' : 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60'
                }`}>
                  {result.threatBreakdown.urgency >= 75 ? 'CRITICAL' : result.threatBreakdown.urgency >= 40 ? 'HIGH' : 'LOW'}
                </span>
                <div className="flex-1 bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full ${result.threatBreakdown.urgency >= 75 ? 'bg-rose-500' : result.threatBreakdown.urgency >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${result.threatBreakdown.urgency}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Credential harvesting */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                <span>Credential Request</span>
                <span className={result.threatBreakdown.credentialHarvesting >= 75 ? 'text-rose-400' : result.threatBreakdown.credentialHarvesting >= 40 ? 'text-amber-400' : 'text-emerald-400'}>
                  {result.threatBreakdown.credentialHarvesting >= 75 ? 'CRITICAL' : result.threatBreakdown.credentialHarvesting >= 40 ? 'HIGH' : 'LOW'}
                </span>
              </div>
              <div className="flex items-center text-xs text-slate-500 overflow-hidden select-none tracking-tighter">
                <span className={`py-0.5 rounded px-2 font-black border mr-2 min-w-[72px] text-center text-[10px] ${
                  result.threatBreakdown.credentialHarvesting >= 75 ? 'text-rose-400 bg-rose-950/40 border-rose-800/60' : result.threatBreakdown.credentialHarvesting >= 40 ? 'text-amber-400 bg-amber-950/40 border-amber-800/60' : 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60'
                }`}>
                  {result.threatBreakdown.credentialHarvesting >= 75 ? 'CRITICAL' : result.threatBreakdown.credentialHarvesting >= 40 ? 'HIGH' : 'LOW'}
                </span>
                <div className="flex-1 bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full ${result.threatBreakdown.credentialHarvesting >= 75 ? 'bg-rose-500' : result.threatBreakdown.credentialHarvesting >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${result.threatBreakdown.credentialHarvesting}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Social engineering */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                <span>Psychological Baits</span>
                <span className={result.threatBreakdown.socialEngineering >= 75 ? 'text-rose-400' : result.threatBreakdown.socialEngineering >= 40 ? 'text-amber-400' : 'text-emerald-400'}>
                  {result.threatBreakdown.socialEngineering >= 75 ? 'CRITICAL' : result.threatBreakdown.socialEngineering >= 40 ? 'HIGH' : 'LOW'}
                </span>
              </div>
              <div className="flex items-center text-xs text-slate-500 overflow-hidden select-none tracking-tighter">
                <span className={`py-0.5 rounded px-2 font-black border mr-2 min-w-[72px] text-center text-[10px] ${
                  result.threatBreakdown.socialEngineering >= 75 ? 'text-rose-400 bg-rose-950/40 border-rose-800/60' : result.threatBreakdown.socialEngineering >= 40 ? 'text-amber-400 bg-amber-950/40 border-amber-800/60' : 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60'
                }`}>
                  {result.threatBreakdown.socialEngineering >= 75 ? 'CRITICAL' : result.threatBreakdown.socialEngineering >= 40 ? 'HIGH' : 'LOW'}
                </span>
                <div className="flex-1 bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full ${result.threatBreakdown.socialEngineering >= 75 ? 'bg-rose-500' : result.threatBreakdown.socialEngineering >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${result.threatBreakdown.socialEngineering}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
