import React, { useState } from 'react';
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
} from 'lucide-react';
import { QUICK_DRILLS } from '../data/quickDrills';
import { QuickDrillQuestion } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface QuickDrillViewProps {
  onAddXp: (amount: number) => void;
}

export const QuickDrillView: React.FC<QuickDrillViewProps> = ({ onAddXp }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number>(80);
  const [submitted, setSubmitted] = useState(false);

  const currentDrill: QuickDrillQuestion = QUICK_DRILLS[currentIndex];

  const handleSubmit = () => {
    if (selectedOptionIndex === null) return;
    setSubmitted(true);
    const chosen = currentDrill.alternativeOptions[selectedOptionIndex];
    if (chosen?.isCorrect) {
      onAddXp(50);
    }
  };

  const handleNext = () => {
    setSelectedOptionIndex(null);
    setSubmitted(false);
    setCurrentIndex((prev) => (prev + 1) % QUICK_DRILLS.length);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{t('drill_header_title')}</h3>
            <span className="text-xs text-slate-400">
              Câu hỏi {currentIndex + 1} / {QUICK_DRILLS.length}
            </span>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
          +50 XP Thưởng
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Scenario Mockup */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Kênh tiếp cận: {currentDrill.channel.toUpperCase()}</span>
            <span>Người gửi: {currentDrill.sender}</span>
          </div>

          <h4 className="text-lg font-bold text-white">{currentDrill.title}</h4>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-200 font-mono leading-relaxed">
            "{currentDrill.message}"
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Bạn sẽ xử lý tình huống này như thế nào?
          </label>
          {currentDrill.alternativeOptions.map((opt, idx) => {
            const isSelected = selectedOptionIndex === idx;
            let optStyle = 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-200';

            if (submitted) {
              if (opt.isCorrect) {
                optStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold';
              } else if (isSelected && !opt.isCorrect) {
                optStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
              }
            } else if (isSelected) {
              optStyle = 'bg-cyan-950/40 border-cyan-500 text-cyan-200 font-bold';
            }

            return (
              <div
                key={idx}
                onClick={() => {
                  if (!submitted) setSelectedOptionIndex(idx);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all text-xs sm:text-sm flex items-start space-x-3 ${optStyle}`}
              >
                <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
                  {String.fromCharCode(65 + idx)}
                </div>
                <div className="flex-1 space-y-1">
                  <p>{opt.label}</p>
                  {submitted && (isSelected || opt.isCorrect) && (
                    <p
                      className={`text-xs mt-1 font-normal ${
                        opt.isCorrect ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {opt.feedback}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Confidence Meter (Before submission) */}
        {!submitted && (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>{t('drill_confidence_label')}</span>
              <span className="text-cyan-400">{confidence}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        )}

        {/* Post-submission Lesson Box */}
        {submitted && (
          <div className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-2xl space-y-1.5 animate-fadeIn text-xs">
            <span className="font-bold text-cyan-400 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('drill_lesson_title')}:</span>
            </span>
            <p className="text-slate-200 leading-relaxed">{currentDrill.explanation}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="pt-2">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOptionIndex === null}
              className="w-full py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all flex items-center justify-center space-x-1.5"
            >
              <span>{t('drill_btn_submit')}</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-1.5"
            >
              <span>{t('drill_btn_next')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
