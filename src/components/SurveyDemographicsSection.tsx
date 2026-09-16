import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Award,
  Briefcase,
  Users,
  Store,
  MapPin,
  Check,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Search,
  Shield,
  PhoneCall,
  QrCode,
  Video,
  DollarSign,
  Send,
  Lock,
  EyeOff,
  Building2,
  BookOpen,
  RefreshCw,
  FileCheck,
  ShieldCheck,
  CheckSquare,
  Square,
} from 'lucide-react';
import { SurveyConfidenceHero } from './SurveyConfidenceHero';
import { SurveyDemographicGroup, GradeLevel, GenderGroup, SafetyTrainingStatus } from '../types';

export const VIETNAM_PROVINCES = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Hải Phòng',
  'Đà Nẵng',
  'Cần Thơ',
  'An Giang',
  'Bà Rịa - Vũng Tàu',
  'Bắc Giang',
  'Bắc Kạn',
  'Bạc Liêu',
  'Bắc Ninh',
  'Bến Tre',
  'Bình Định',
  'Bình Dương',
  'Bình Phước',
  'Bình Thuận',
  'Cà Mau',
  'Cao Bằng',
  'Đắk Lắk',
  'Đắk Nông',
  'Điện Biên',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Giang',
  'Hà Nam',
  'Hà Tĩnh',
  'Hải Dương',
  'Hậu Giang',
  'Hòa Bình',
  'Hưng Yên',
  'Khánh Hòa',
  'Kiên Giang',
  'Kon Tum',
  'Lai Châu',
  'Lâm Đồng',
  'Lạng Sơn',
  'Lào Cai',
  'Long An',
  'Nam Định',
  'Nghệ An',
  'Ninh Bình',
  'Ninh Thuận',
  'Phú Thọ',
  'Phú Yên',
  'Quảng Bình',
  'Quảng Nam',
  'Quảng Ngãi',
  'Quảng Ninh',
  'Quảng Trị',
  'Sóc Trăng',
  'Sơn La',
  'Tây Ninh',
  'Thái Bình',
  'Thái Nguyên',
  'Thanh Hóa',
  'Thừa Thiên Huế',
  'Tiền Giang',
  'Trà Vinh',
  'Tuyên Quang',
  'Vĩnh Long',
  'Vĩnh Phúc',
  'Yên Bái',
  'Khác',
];

export const POPULAR_SCHOOLS = [
  'THPT Chuyên Lê Hồng Phong',
  'THPT Chu Văn An',
  'THPT Chuyên Hà Nội - Amsterdam',
  'THPT Chuyên Khoa học Tự nhiên',
  'THPT Chuyên Phan Bội Châu',
  'THPT Chuyên Trần Phú',
  'THPT Chuyên Quốc Học Huế',
  'Đại học Bách Khoa',
  'Đại học Quốc Gia',
  'Khác / Tự nhập',
];

export const POPULAR_CLASSES = [
  'Lớp 10A1',
  'Lớp 10 Tin',
  'Lớp 11A1',
  'Lớp 11 Tin',
  'Lớp 12 Chuyên',
  'Khối 10',
  'Khối 11',
  'Khối 12',
  'Sinh viên Năm 1-2',
  'Cán bộ / Giáo viên',
];

interface SurveyDemographicsSectionProps {
  participantName: string;
  onParticipantNameChange: (val: string) => void;
  isAnonymous?: boolean;
  onIsAnonymousChange?: (val: boolean) => void;
  anonymousCode?: string;
  onAnonymousCodeChange?: (val: string) => void;
  schoolName?: string;
  onSchoolNameChange?: (val: string) => void;
  className?: string;
  onClassNameChange?: (val: string) => void;
  consentAgreed?: boolean;
  onConsentAgreedChange?: (val: boolean) => void;
  demographicGroup: SurveyDemographicGroup;
  onDemographicGroupChange: (val: SurveyDemographicGroup) => void;
  location: string;
  onLocationChange: (val: string) => void;
  pastLossOrNearMiss: 'LOST_MONEY' | 'SHARED_OTP_PASSWORD' | 'CLICKED_SUSPICIOUS_LINK' | 'SPOTTED_IN_TIME' | 'NEVER';
  onPastLossOrNearMissChange: (val: any) => void;
  preConfidenceScore: number;
  onPreConfidenceScoreChange: (val: number) => void;
  gradeLevel?: GradeLevel;
  onGradeLevelChange?: (val: GradeLevel) => void;
  gender?: GenderGroup;
  onGenderChange?: (val: GenderGroup) => void;
  safetyTraining?: SafetyTrainingStatus;
  onSafetyTrainingChange?: (val: SafetyTrainingStatus) => void;
  biggestFearTactic?: 'AUTHORITY_POLICE' | 'URGENT_ACCIDENT' | 'FAKE_BILL_QR' | 'TELEGRAM_INCOME' | 'DEEPFAKE_CALL';
  onBiggestFearTacticChange?: (val: any) => void;
  idPrefix?: string;
}

export const SurveyDemographicsSection: React.FC<SurveyDemographicsSectionProps> = ({
  participantName,
  onParticipantNameChange,
  isAnonymous = true,
  onIsAnonymousChange,
  anonymousCode = 'Khảo nghiệm viên Ẩn danh #VN-8421',
  onAnonymousCodeChange,
  schoolName = 'THPT Chuyên Lê Hồng Phong',
  onSchoolNameChange,
  className = 'Lớp 11 Tin',
  onClassNameChange,
  gradeLevel = 'Khối 11',
  onGradeLevelChange,
  gender = 'Nam',
  onGenderChange,
  safetyTraining = 'Không',
  onSafetyTrainingChange,
  consentAgreed = true,
  onConsentAgreedChange,
  demographicGroup,
  onDemographicGroupChange,
  location,
  onLocationChange,
  pastLossOrNearMiss,
  onPastLossOrNearMissChange,
  preConfidenceScore,
  onPreConfidenceScoreChange,
  biggestFearTactic,
  onBiggestFearTacticChange,
  idPrefix = 'survey',
}) => {
  // Track completion of each dimension
  const isNameFilled = isAnonymous ? !!anonymousCode && anonymousCode.trim().length > 0 : participantName.trim().length > 0;
  const isSchoolFilled = !onSchoolNameChange || (!!schoolName && schoolName.trim().length > 0);
  const isClassFilled = !onClassNameChange || (!!className && className.trim().length > 0);
  const isConsentFilled = !onConsentAgreedChange || consentAgreed === true;
  const isGroupFilled = !!demographicGroup;
  const isLocationFilled = !!location && location.trim().length > 0;
  const isPastExperienceFilled = !!pastLossOrNearMiss;
  const isConfidenceFilled = preConfidenceScore >= 10;
  const isFearTacticFilled = !onBiggestFearTacticChange || !!biggestFearTactic;

  const totalDimensions = (onBiggestFearTacticChange ? 6 : 5) + (onSchoolNameChange ? 1 : 0) + (onConsentAgreedChange ? 1 : 0);
  const completedDimensions =
    (isNameFilled ? 1 : 0) +
    (onSchoolNameChange && isSchoolFilled && isClassFilled ? 1 : 0) +
    (isGroupFilled ? 1 : 0) +
    (isLocationFilled ? 1 : 0) +
    (isPastExperienceFilled ? 1 : 0) +
    (isConfidenceFilled ? 1 : 0) +
    (onBiggestFearTacticChange && isFearTacticFilled ? 1 : 0) +
    (onConsentAgreedChange && isConsentFilled ? 1 : 0);

  const scrollToDimension = (domId: string) => {
    const el = document.getElementById(domId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const generateNewAnonCode = () => {
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newCode = `Khảo nghiệm viên Ẩn danh #VN-${randNum}`;
    if (onAnonymousCodeChange) {
      onAnonymousCodeChange(newCode);
    }
    if (onParticipantNameChange && isAnonymous) {
      onParticipantNameChange(newCode);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* TOP STATUS TRACKER */}
      <div className="relative bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-purple-500/40 shadow-lg space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Tiến độ chọn thông tin nghiên cứu:
            </span>
            <span className="font-mono font-black text-purple-300 text-sm">
              {completedDimensions}/{totalDimensions} kích thước
            </span>
          </div>

          <div className="flex items-center gap-2">
            {completedDimensions >= totalDimensions ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Đủ tất cả thông tin
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                Còn {totalDimensions - completedDimensions} mục cần hoàn tất
              </span>
            )}
          </div>
        </div>

        {/* Progress line */}
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (completedDimensions / totalDimensions) * 100)}%` }}
          />
        </div>

        {/* Quick Jump Bar between dimensions */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[11px] text-slate-400 shrink-0 font-mono">Bấm xem nhanh:</span>

          <button
            type="button"
            onClick={() => scrollToDimension(`${idPrefix}-dim-1`)}
            className={`px-2.5 py-1 rounded-lg border font-medium shrink-0 transition cursor-pointer flex items-center gap-1 ${
              isNameFilled
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-300 animate-pulse'
            }`}
          >
            <span>{isAnonymous ? '1. Tên Ẩn Danh' : '1. Họ Tên Thật'}</span>
            {isNameFilled ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />}
          </button>

          {onSchoolNameChange && (
            <button
              type="button"
              onClick={() => scrollToDimension(`${idPrefix}-dim-school`)}
              className={`px-2.5 py-1 rounded-lg border font-medium shrink-0 transition cursor-pointer flex items-center gap-1 ${
                isSchoolFilled && isClassFilled
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
              }`}
            >
              <span>Trường & Lớp</span>
              {isSchoolFilled && isClassFilled ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />}
            </button>
          )}

          <button
            type="button"
            onClick={() => scrollToDimension(`${idPrefix}-dim-2`)}
            className={`px-2.5 py-1 rounded-lg border font-medium shrink-0 transition cursor-pointer flex items-center gap-1 ${
              isGroupFilled
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
            }`}
          >
            <span>2. Đối tượng</span>
            {isGroupFilled ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />}
          </button>

          <button
            type="button"
            onClick={() => scrollToDimension(`${idPrefix}-dim-3`)}
            className={`px-2.5 py-1 rounded-lg border font-medium shrink-0 transition cursor-pointer flex items-center gap-1 ${
              isLocationFilled
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
            }`}
          >
            <span>3. Tỉnh thành</span>
            {isLocationFilled ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />}
          </button>

          <button
            type="button"
            onClick={() => scrollToDimension(`${idPrefix}-dim-4`)}
            className={`px-2.5 py-1 rounded-lg border font-medium shrink-0 transition cursor-pointer flex items-center gap-1 ${
              isPastExperienceFilled
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
            }`}
          >
            <span>4. Tiền sử rủi ro</span>
            {isPastExperienceFilled ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />}
          </button>

          <button
            type="button"
            onClick={() => scrollToDimension(`${idPrefix}-confidence-hero-card`)}
            className="px-3 py-1 rounded-lg border border-purple-500 bg-purple-900/50 text-purple-200 font-bold shrink-0 transition cursor-pointer flex items-center gap-1 shadow-sm"
          >
            <span>⭐ 5. Tự Tin</span>
            <span className="font-mono text-cyan-300 font-black">({preConfidenceScore}đ)</span>
          </button>

          {onConsentAgreedChange && (
            <button
              type="button"
              onClick={() => scrollToDimension(`${idPrefix}-dim-consent`)}
              className={`px-2.5 py-1 rounded-lg border font-medium shrink-0 transition cursor-pointer flex items-center gap-1 ${
                isConsentFilled
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-300 animate-pulse'
              }`}
            >
              <span>Đồng ý IRB</span>
              {isConsentFilled ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />}
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* KÍCH THƯỚC 1: ĐỊNH DANH NGƯỜI THAM GIA & CHẾ ĐỘ TÊN ẨN DANH */}
      {/* ========================================================================= */}
      <div
        id={`${idPrefix}-dim-1`}
        className={`p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-200 space-y-4 shadow-lg ${
          isNameFilled
            ? 'bg-slate-900/90 border-slate-700/80 shadow-slate-950/50'
            : 'bg-slate-900/95 border-rose-500/60 ring-2 ring-rose-500/20'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center font-black text-xs sm:text-sm shrink-0">
              1
            </div>
            <div>
              <label className="text-white font-black text-xs sm:text-sm md:text-base flex items-center gap-1.5 sm:gap-2">
                <span>Định danh Khảo nghiệm & Chế độ Ẩn danh</span>
                <span className="text-rose-400 font-bold">*</span>
              </label>
              <span className="text-[10px] sm:text-[11px] text-slate-400">Kích thước 1: Chuẩn hóa dữ liệu theo chuẩn đạo đức nghiên cứu ViSEF / IRB</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAnonymous ? (
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] sm:text-[11px] font-bold flex items-center gap-1">
                <Lock className="w-3 h-3 text-cyan-400" />
                Chế độ Ẩn danh BẬT
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] sm:text-[11px] font-bold flex items-center gap-1">
                <User className="w-3 h-3 text-purple-400" />
                Tên thật đích danh
              </span>
            )}
          </div>
        </div>

        {/* ANONYMOUS VS REAL NAME MODE SWITCHER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <div
            onClick={() => {
              if (onIsAnonymousChange) onIsAnonymousChange(true);
              if (onParticipantNameChange) onParticipantNameChange(anonymousCode || 'Khảo nghiệm viên Ẩn danh #VN-8421');
            }}
            className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none active:scale-[0.99] ${
              isAnonymous
                ? 'bg-gradient-to-br from-cyan-950/60 to-purple-950/40 border-cyan-500/80 ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-950/40'
                : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 opacity-75'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isAnonymous ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}`}>
              <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className={`text-xs sm:text-sm font-black ${isAnonymous ? 'text-cyan-200' : 'text-slate-200'}`}>
                  🔒 Chế độ Ẩn danh (Khuyến nghị ViSEF)
                </span>
                {isAnonymous && <Check className="w-4 h-4 text-cyan-400" />}
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-300 leading-relaxed">
                Hệ thống tự động sinh mã định danh hash an toàn. Không lưu vết danh tính cá nhân.
              </p>
            </div>
          </div>

          <div
            onClick={() => {
              if (onIsAnonymousChange) onIsAnonymousChange(false);
              if (onParticipantNameChange && isAnonymous && anonymousCode.startsWith('Khảo nghiệm viên Ẩn danh')) {
                onParticipantNameChange('');
              }
            }}
            className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none active:scale-[0.99] ${
              !isAnonymous
                ? 'bg-gradient-to-br from-purple-950/60 to-indigo-950/40 border-purple-500/80 ring-2 ring-purple-500/30 shadow-lg shadow-purple-950/40'
                : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 opacity-75'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${!isAnonymous ? 'bg-purple-500 text-white font-black' : 'bg-slate-800 text-slate-400'}`}>
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className={`text-xs sm:text-sm font-black ${!isAnonymous ? 'text-purple-200' : 'text-slate-200'}`}>
                  👤 Nhập Họ và Tên thật
                </span>
                {!isAnonymous && <Check className="w-4 h-4 text-purple-400" />}
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-300 leading-relaxed">
                Nhập họ tên đầy đủ để nhận giấy chứng nhận kết quả đối chiếu năng lực an toàn số.
              </p>
            </div>
          </div>
        </div>

        {/* INPUT FIELD ACCORDING TO ANONYMOUS / REAL NAME */}
        {isAnonymous ? (
          <div className="p-4 bg-slate-950 rounded-2xl border border-cyan-500/30 space-y-3 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <EyeOff className="w-4 h-4 text-cyan-400" />
                Mã định danh ẩn danh của bạn (Được mã hóa tự động):
              </span>
              <button
                type="button"
                onClick={generateNewAnonCode}
                className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer active:scale-95"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Đổi mã mới</span>
              </button>
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={anonymousCode}
                onChange={(e) => {
                  if (onAnonymousCodeChange) onAnonymousCodeChange(e.target.value);
                  if (onParticipantNameChange) onParticipantNameChange(e.target.value);
                }}
                placeholder="Mã ẩn danh, ví dụ: Khảo nghiệm viên Ẩn danh #VN-8421..."
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-slate-900 border border-cyan-500/40 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 text-cyan-100 font-mono font-bold rounded-xl sm:rounded-2xl text-xs sm:text-sm transition"
              />
            </div>

            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Dữ liệu họ tên của bạn được bảo mật tuyệt đối theo tiêu chuẩn đạo đức nghiên cứu học sinh ViSEF.</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Nhập họ và tên đầy đủ: ví dụ Nguyễn Văn An, Trần Thu Hà..."
                value={participantName}
                onChange={(e) => onParticipantNameChange(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-slate-950 border border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm transition font-medium"
              />
            </div>

            {/* Quick Suggestion Chips for demo testing */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5 text-xs">
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono">Gợi ý tên nhanh:</span>
              {['Nguyễn Văn An', 'Trần Thị Mai', 'Lê Hoàng Long', 'Phạm Minh Tuấn', 'Vũ Thị Hương'].map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => onParticipantNameChange(name)}
                  className="px-2 sm:px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] sm:text-xs transition cursor-pointer active:scale-95"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* KÍCH THƯỚC BỔ SUNG: TRƯỜNG HỌC & LỚP HỌC (GIỮ NGUYÊN ĐỂ PHÂN TẦNG DỮ LIỆU) */}
      {/* ========================================================================= */}
      {onSchoolNameChange && (
        <div
          id={`${idPrefix}-dim-school`}
          className={`p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-200 space-y-4 shadow-lg ${
            isSchoolFilled && isClassFilled
              ? 'bg-slate-900/90 border-slate-700/80 shadow-slate-950/50'
              : 'bg-slate-900/95 border-purple-500/60 ring-2 ring-purple-500/20'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-black text-xs sm:text-sm shrink-0">
                <Building2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
              <div>
                <label className="text-white font-black text-xs sm:text-sm md:text-base flex items-center gap-1.5 sm:gap-2">
                  <span>Trường Học & Lớp / Khối Lớp của bạn</span>
                  <span className="text-rose-400 font-bold">*</span>
                </label>
                <span className="text-[10px] sm:text-[11px] text-slate-400">Giữ nguyên trường & lớp để đối sánh tương quan năng lực an toàn số giữa các đơn vị</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isSchoolFilled && isClassFilled ? (
                <span className="px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] sm:text-[11px] font-bold flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  Đã có Trường & Lớp
                </span>
              ) : (
                <span className="px-2.5 py-0.5 sm:py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] sm:text-[11px] font-bold flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  Cần điền Trường & Lớp
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Dù bạn chọn <strong>Chế độ Ẩn Danh</strong> hay Tên Thật, thông tin <strong>Trường và Lớp</strong> vẫn được lưu độc lập để phục vụ phân tích so sánh hiệu quả giữa các khối trường học và lứa tuổi học sinh trên cả nước.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* TRƯỜNG HỌC */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Tên Trường học / Cơ quan / Đơn vị:</span>
                <span className="text-rose-400">*</span>
              </label>

              <div className="relative">
                <GraduationCap className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ví dụ: THPT Chuyên Lê Hồng Phong, THPT Chu Văn An..."
                  value={schoolName}
                  onChange={(e) => onSchoolNameChange(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-white rounded-xl text-xs sm:text-sm font-medium transition"
                />
              </div>

              {/* Quick School Chips */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {POPULAR_SCHOOLS.slice(0, 5).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onSchoolNameChange(s)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-medium transition cursor-pointer border ${
                      schoolName === s
                        ? 'bg-indigo-600 text-white border-indigo-400'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* LỚP / KHỐI LỚP */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                <span>Lớp / Khối lớp / Năm học:</span>
                <span className="text-rose-400">*</span>
              </label>

              <div className="relative">
                <BookOpen className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ví dụ: Lớp 11 Tin, 10A1, 12 Lý, Khối 10, Khối 11..."
                  value={className}
                  onChange={(e) => onClassNameChange && onClassNameChange(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 bg-slate-950 border border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 text-white rounded-xl text-xs sm:text-sm font-medium transition"
                />
              </div>

              {/* Quick Class Chips */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {POPULAR_CLASSES.slice(0, 6).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onClassNameChange && onClassNameChange(c)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-medium transition cursor-pointer border ${
                      className === c
                        ? 'bg-purple-600 text-white border-purple-400'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3 VISEF SCHOOL RESEARCH DEMOGRAPHIC SELECTORS */}
          <div className="pt-3 border-t border-slate-800/80 space-y-4">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Phân Tầng Khảo Sát ViSEF 2026 (Khối, Giới Tính, Tập Huấn An Toàn)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* FIELD 1: KHỐI HỌC */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Khối học / Vị trí:</span>
                  <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['Khối 10', 'Khối 11', 'Khối 12', 'Khác / Giáo viên'] as GradeLevel[]).map((gl) => {
                    const isSelected = gradeLevel === gl;
                    return (
                      <button
                        key={gl}
                        type="button"
                        onClick={() => onGradeLevelChange && onGradeLevelChange(gl)}
                        className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold transition text-left cursor-pointer border flex items-center justify-between ${
                          isSelected
                            ? 'bg-cyan-600/30 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400/40'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{gl}</span>
                        {isSelected && <Check className="w-3 h-3 text-cyan-300 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FIELD 2: GIỚI TÍNH */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>Giới tính:</span>
                  <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['Nam', 'Nữ', 'Khác', 'Không muốn trả lời'] as GenderGroup[]).map((g) => {
                    const isSelected = gender === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => onGenderChange && onGenderChange(g)}
                        className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold transition text-left cursor-pointer border flex items-center justify-between ${
                          isSelected
                            ? 'bg-purple-600/30 border-purple-400 text-purple-200 ring-1 ring-purple-400/40'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{g}</span>
                        {isSelected && <Check className="w-3 h-3 text-purple-300 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FIELD 3: TẬP HUẤN AN TOÀN MẠNG */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Đã từng học / tập huấn an toàn mạng:</span>
                  <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {(['Có', 'Không'] as SafetyTrainingStatus[]).map((st) => {
                    const isSelected = safetyTraining === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => onSafetyTrainingChange && onSafetyTrainingChange(st)}
                        className={`p-2 rounded-lg text-xs font-bold transition text-center cursor-pointer border flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? st === 'Có'
                              ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400/40'
                              : 'bg-amber-600/30 border-amber-400 text-amber-200 ring-1 ring-amber-400/40'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        <span>{st === 'Có' ? '✅ Đã từng (Có)' : '❌ Chưa từng (Không)'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* KÍCH THƯỚC 2: NHÓM ĐỐI TƯỢNG NHÂN KHẨU HỌC */}
      {/* ========================================================================= */}
      <div
        id={`${idPrefix}-dim-2`}
        className={`p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-200 space-y-3.5 sm:space-y-4 shadow-lg ${
          isGroupFilled
            ? 'bg-slate-900/90 border-slate-700/80 shadow-slate-950/50'
            : 'bg-slate-900/95 border-amber-500/60 ring-2 ring-amber-500/20'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center font-black text-xs sm:text-sm shrink-0">
              2
            </div>
            <div>
              <label className="text-white font-black text-xs sm:text-sm md:text-base flex items-center gap-1.5 sm:gap-2">
                <span>Nhóm đối tượng nhân khẩu học</span>
                <span className="text-rose-400 font-bold">*</span>
              </label>
              <span className="text-[10px] sm:text-[11px] text-slate-400">Kích thước 2: Phân tầng dữ liệu theo nghề nghiệp & lứa tuổi</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] text-purple-300 font-bold">Chọn 1 nhóm phù hợp</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          ViSEF phân tích tương quan rủi ro theo từng nhóm đối tượng để xây dựng ma trận bẫy tâm lý tác chiến tương ứng.
        </p>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5 pt-1">
          {[
            {
              id: 'STUDENT',
              icon: GraduationCap,
              badge: 'Lứa tuổi 15 - 24',
              title: 'Học sinh & Sinh viên',
              desc: 'Thường xuyên dùng mạng xã hội, mua sắm sàn thương mại điện tử, dễ gặp bẫy việc làm CTV online hoa hồng cao.',
              gradient: 'from-blue-600/20 to-indigo-600/10',
            },
            {
              id: 'TEACHER_JUDGE',
              icon: Award,
              badge: 'Giáo dục & Chuyên môn',
              title: 'Giáo viên & Giám khảo ViSEF',
              desc: 'Cán bộ quản lý giáo dục, nhà nghiên cứu, khảo nghiệm viên học đường hoặc giám khảo đánh giá hội thi khoa học.',
              gradient: 'from-purple-600/20 to-pink-600/10',
            },
            {
              id: 'OFFICE_WORKER',
              icon: Briefcase,
              badge: 'Lứa tuổi 25 - 50',
              title: 'Nhân viên Văn phòng / Công sở',
              desc: 'Giao dịch ngân hàng & thẻ tín dụng liên tục, dễ gặp bẫy email phishing công việc, hóa đơn điện/nước và quyết toán thuế.',
              gradient: 'from-cyan-600/20 to-blue-600/10',
            },
            {
              id: 'ELDERLY',
              icon: Users,
              badge: 'Lứa tuổi > 50 / Hưu trí',
              title: 'Người Cao tuổi / Hưu trí',
              desc: 'Nhóm nhạy cảm công nghệ, mục tiêu số 1 của các cuộc gọi thao túng giả danh Công an, Tòa án và cấp cứu viện phí.',
              gradient: 'from-amber-600/20 to-orange-600/10',
            },
            {
              id: 'BUSINESS_OWNER',
              icon: Store,
              badge: 'Kinh doanh & Bán lẻ',
              title: 'Kinh doanh & Bán lẻ Online',
              desc: 'Thường xuyên xử lý dòng tiền lớn, nhận ảnh chụp bill chuyển khoản ngân hàng giả, mã QR giả và bẫy hoàn tất đơn hàng.',
              gradient: 'from-emerald-600/20 to-teal-600/10',
            },
          ].map((g) => {
            const IconComp = g.icon;
            const isSelected = demographicGroup === g.id;
            return (
              <div
                key={g.id}
                onClick={() => onDemographicGroupChange(g.id as any)}
                className={`p-3.5 sm:p-4.5 lg:p-5 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5 sm:gap-3 select-none active:scale-[0.98] ${
                  isSelected
                    ? 'bg-purple-600/25 border-purple-500 ring-2 ring-purple-400 shadow-xl shadow-purple-950/50 scale-[1.01] sm:scale-[1.02]'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-purple-500 text-white shadow-md' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-bold border ${
                    isSelected ? 'bg-purple-500/30 border-purple-400 text-purple-200' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    {g.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className={`text-xs sm:text-sm font-black ${isSelected ? 'text-purple-100' : 'text-slate-100'}`}>
                    {g.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {g.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className={`text-[11px] ${isSelected ? 'text-purple-300 font-bold' : 'text-slate-400'}`}>
                    {isSelected ? 'Đã lựa chọn ✓' : 'Bấm để chọn'}
                  </span>
                  <div
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center transition ${
                      isSelected ? 'border-purple-400 bg-purple-500 text-white' : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* KÍCH THƯỚC 3: ĐỊA BÀN ĐỊA LÝ (TỈNH / THÀNH PHỐ) */}
      {/* ========================================================================= */}
      <div
        id={`${idPrefix}-dim-3`}
        className={`p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-200 space-y-3.5 sm:space-y-4 shadow-lg ${
          isLocationFilled
            ? 'bg-slate-900/90 border-slate-700/80 shadow-slate-950/50'
            : 'bg-slate-900/95 border-amber-500/60 ring-2 ring-amber-500/20'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center font-black text-xs sm:text-sm shrink-0">
              3
            </div>
            <div>
              <label className="text-white font-black text-xs sm:text-sm md:text-base flex items-center gap-1.5 sm:gap-2">
                <span>Tỉnh / Thành phố bạn đang sinh sống</span>
                <span className="text-rose-400 font-bold">*</span>
              </label>
              <span className="text-[10px] sm:text-[11px] text-slate-400">Kích thước 3: Phân bố địa bàn theo 63 tỉnh thành Việt Nam</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 sm:py-1 rounded-full bg-slate-800 border border-slate-700 text-purple-300 text-[10px] sm:text-[11px] font-mono font-bold">
              {location}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Chọn nhanh một trong các đô thị lớn hoặc chọn từ danh sách thả xuống đầy đủ 63 tỉnh thành Việt Nam:
        </p>

        {/* Quick Regional City Chips */}
        <div className="space-y-2">
          <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Các đô thị trọng điểm (Bấm chọn nhanh 1 chạm):
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {[
              'Hà Nội',
              'TP. Hồ Chí Minh',
              'Hải Phòng',
              'Đà Nẵng',
              'Cần Thơ',
              'Bình Dương',
              'Đồng Nai',
              'Quảng Ninh',
              'Nghệ An',
              'Thừa Thiên Huế',
            ].map((city) => {
              const isSelected = location === city;
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => onLocationChange(city)}
                  className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 active:scale-95 ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 scale-105 ring-2 ring-purple-400'
                      : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <MapPin className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isSelected ? 'text-white' : 'text-purple-400'}`} />
                  <span>{city}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dropdown for All 63 Provinces */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs text-slate-400 block font-medium">
            Hoặc chọn từ danh mục đầy đủ 63 tỉnh thành:
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-purple-400 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 bg-slate-950 border border-slate-700 rounded-xl sm:rounded-2xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 text-xs sm:text-sm transition font-medium cursor-pointer"
            >
              {VIETNAM_PROVINCES.map((prov) => (
                <option key={prov} value={prov} className="bg-slate-900 text-white">
                  {prov}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* KÍCH THƯỚC 4: TIỀN SỬ TIẾP XÚC RỦI RO & TỔN THẤT QUÁ KHỨ */}
      {/* ========================================================================= */}
      <div
        id={`${idPrefix}-dim-4`}
        className={`p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-200 space-y-3.5 sm:space-y-4 shadow-lg ${
          isPastExperienceFilled
            ? 'bg-slate-900/90 border-slate-700/80 shadow-slate-950/50'
            : 'bg-slate-900/95 border-amber-500/60 ring-2 ring-amber-500/20'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center font-black text-xs sm:text-sm shrink-0">
              4
            </div>
            <div>
              <label className="text-white font-black text-xs sm:text-sm md:text-base flex items-center gap-1.5 sm:gap-2">
                <span>Trong quá khứ, bạn hoặc người thân đã từng gặp tình huống nào?</span>
                <span className="text-rose-400 font-bold">*</span>
              </label>
              <span className="text-[10px] sm:text-[11px] text-slate-400">Kích thước 4: Tiền sử tiếp xúc rủi ro thực tế ngoài đời sống</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] text-purple-300 font-bold">Chọn 1 tình trạng thực tế</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Thông tin được thu thập ẩn danh và mã hóa, phục vụ việc phân loại nhóm mẫu thử nghiệm có tiền sử tổn thất so với nhóm chưa từng tiếp xúc.
        </p>

        {/* 5 Options */}
        <div className="space-y-2.5 sm:space-y-3 pt-1">
          {[
            {
              id: 'LOST_MONEY',
              icon: '💸',
              tag: 'Tổn thất tài chính',
              tagColor: 'text-rose-300 bg-rose-500/20 border-rose-500/40',
              title: 'Bị lừa mất tiền thực tế',
              label: 'Đã từng bị chiếm đoạt tiền qua chuyển khoản, đầu tư tiền ảo / chứng khoán giả mạo, hoặc bẫy làm nhiệm vụ online nạp tiền.',
            },
            {
              id: 'SHARED_OTP_PASSWORD',
              icon: '🔑',
              tag: 'Lọt mã bí mật',
              tagColor: 'text-amber-300 bg-amber-500/20 border-amber-500/40',
              title: 'Bị lộ mã OTP hoặc mật khẩu tài khoản',
              label: 'Đã từng nhập hoặc đọc mã xác thực OTP ngân hàng, mật khẩu Zalo, Facebook cho kẻ xấu mạo danh cán bộ hỗ trợ.',
            },
            {
              id: 'CLICKED_SUSPICIOUS_LINK',
              icon: '🔗',
              tag: 'Mã độc & Phishing',
              tagColor: 'text-orange-300 bg-orange-500/20 border-orange-500/40',
              title: 'Bấm link giả mạo hoặc tải file lạ .apk',
              label: 'Từng bấm vào đường link lạ trong tin nhắn SMS/Zalo hoặc từng vô tình tải tệp tin cài đặt ứng dụng nghi vấn.',
            },
            {
              id: 'SPOTTED_IN_TIME',
              icon: '🛡️',
              tag: 'Phát hiện kịp thời',
              tagColor: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40',
              title: 'Nhận ra bất thường và dừng lại kịp thời',
              label: 'Đã từng nhận cuộc gọi/tin nhắn thao túng nhưng kịp thời phát hiện dấu hiệu bất thường, không làm theo yêu cầu.',
            },
            {
              id: 'NEVER',
              icon: '⚪',
              tag: 'Chưa từng gặp',
              tagColor: 'text-slate-300 bg-slate-800 border-slate-700',
              title: 'Chưa từng tiếp xúc với bẫy lừa đảo',
              label: 'Chưa từng gặp phải bất kỳ tin nhắn, cuộc gọi hay tình huống lừa đảo số nào trong đời sống hàng ngày.',
            },
          ].map((opt) => {
            const isSelected = pastLossOrNearMiss === opt.id;
            return (
              <label
                key={opt.id}
                onClick={() => onPastLossOrNearMissChange(opt.id as any)}
                className={`flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4.5 rounded-xl sm:rounded-2xl border text-xs sm:text-sm cursor-pointer transition-all duration-200 select-none active:scale-[0.99] ${
                  isSelected
                    ? 'bg-purple-600/20 border-purple-500 text-purple-100 ring-2 ring-purple-500/50 shadow-md shadow-purple-950/40 scale-[1.005]'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <span className="text-xl sm:text-2xl shrink-0 mt-0.5">{opt.icon}</span>
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-bold border ${opt.tagColor}`}>
                      {opt.tag}
                    </span>
                    <span className="font-bold text-white text-xs sm:text-sm">{opt.title}</span>
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-300 font-medium leading-relaxed">
                    {opt.label}
                  </div>
                </div>
                <input
                  type="radio"
                  name={`${idPrefix}_pastLoss`}
                  checked={isSelected}
                  onChange={() => {}}
                  className="mt-1.5 w-4 h-4 accent-purple-600 shrink-0 cursor-pointer"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* KÍCH THƯỚC NỖI SỢ KỊCH BẢN (NẾU CÓ) */}
      {/* ========================================================================= */}
      {onBiggestFearTacticChange && biggestFearTactic && (
        <div
          id={`${idPrefix}-dim-fear`}
          className="p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border border-slate-700/80 bg-slate-900/90 space-y-3.5 sm:space-y-4 shadow-lg"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center font-black text-xs sm:text-sm shrink-0">
                ⭐
              </div>
              <div>
                <label className="text-white font-black text-xs sm:text-sm md:text-base flex items-center gap-1.5 sm:gap-2">
                  <span>Kịch bản bạn cảm thấy khó phân biệt hoặc lo lắng nhất</span>
                  <span className="text-rose-400 font-bold">*</span>
                </label>
                <span className="text-[10px] sm:text-[11px] text-slate-400">Kích thước tâm lý: Bẫy thao túng gây lo âu cao nhất</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {[
              { id: 'AUTHORITY_POLICE', icon: Shield, title: 'Giả danh Công an / Viện kiểm sát / Tòa án', desc: 'Dọa bắt giam, yêu cầu chuyển khoản bảo đảm' },
              { id: 'DEEPFAKE_CALL', icon: Video, title: 'Cuộc gọi Video Call Deepfake AI', desc: 'Mặt và giọng người thân giả mạo 5 giây' },
              { id: 'FAKE_BILL_QR', icon: QrCode, title: 'QR Quishing & Bill chuyển khoản giả', desc: 'Quét mã độc tại bàn ăn, bill ngân hàng Photoshop' },
              { id: 'TELEGRAM_INCOME', icon: DollarSign, title: 'Làm nhiệm vụ kiếm tiền qua Telegram', desc: 'Bẫy CTV hoa hồng, nạp tiền vào sàn ảo' },
              { id: 'URGENT_ACCIDENT', icon: PhoneCall, title: 'Cấp cứu bệnh viện viện phí gấp', desc: 'Kích động hoảng loạn người thân gặp nạn' },
            ].map((f) => {
              const IconComp = f.icon;
              const isSelected = biggestFearTactic === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => onBiggestFearTacticChange(f.id as any)}
                  className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border cursor-pointer transition flex items-start gap-2.5 sm:gap-3 active:scale-[0.98] ${
                    isSelected
                      ? 'bg-purple-600/25 border-purple-500 text-white ring-2 ring-purple-500/50'
                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-300'}`}>
                    <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[11px] sm:text-xs font-bold block">{f.title}</span>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 block">{f.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* KÍCH THƯỚC 5: CÂU HỎI TỰ TIN - SPECIAL CONFIDENCE HERO */}
      {/* ========================================================================= */}
      <SurveyConfidenceHero
        score={preConfidenceScore}
        onChange={onPreConfidenceScoreChange}
        idPrefix={idPrefix}
      />

      {/* ========================================================================= */}
      {/* ĐIỀU KHOẢN ĐỒNG Ý THAM GIA NGHIÊN CỨU ẨN DANH (IRB ETHICAL COMPLIANCE) */}
      {/* ========================================================================= */}
      {onConsentAgreedChange && (
        <div
          id={`${idPrefix}-dim-consent`}
          className={`p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-200 space-y-4 shadow-xl ${
            consentAgreed
              ? 'bg-gradient-to-br from-purple-950/40 via-slate-900 to-indigo-950/40 border-purple-500/60 shadow-purple-950/30'
              : 'bg-slate-900/95 border-rose-500/70 ring-2 ring-rose-500/20'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-purple-500/30">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-purple-500/30 text-purple-200 border border-purple-400/50 flex items-center justify-center font-black text-xs sm:text-sm shrink-0">
                <FileCheck className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
              </div>
              <div>
                <h4 className="text-white font-black text-xs sm:text-sm md:text-base flex items-center gap-1.5 sm:gap-2">
                  <span>Điều Khoản Đồng Ý Tham Gia Nghiên Cứu Ẩn Danh ViSEF</span>
                  <span className="text-rose-400 font-bold">*</span>
                </h4>
                <span className="text-[10px] sm:text-[11px] text-purple-300/80">
                  Cam kết Đạo đức Nghiên cứu Khoa học & Bảo vệ Quyền riêng tư (IRB Ethics Compliance)
                </span>
              </div>
            </div>

            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-[10px] sm:text-[11px] font-mono font-bold">
              ViSEF 2026 Protocol
            </span>
          </div>

          {/* Ethics Terms Box */}
          <div className="p-3.5 sm:p-4.5 bg-slate-950/90 rounded-xl sm:rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2.5 leading-relaxed font-sans shadow-inner">
            <div className="flex items-start gap-2 text-indigo-300 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Nội dung cam kết bảo vệ dữ liệu người tham gia:</span>
            </div>

            <ul className="space-y-1.5 text-[11px] sm:text-xs text-slate-300 pl-4 list-disc marker:text-purple-400">
              <li>
                <strong>Mục đích khoa học:</strong> Dữ liệu từ phiếu khảo nghiệm chỉ phục vụ mục đích nghiên cứu học thuật của Đề tài Khoa học Kỹ thuật cấp Quốc gia ViSEF 2026.
              </li>
              <li>
                <strong>Ẩn danh & Phi định danh:</strong> Toàn bộ dữ liệu được mã hóa một chiều (One-way Hash), không lưu trữ thông tin cá nhân nhạy cảm như Số điện thoại, Mật khẩu, OTP hay Tài khoản ngân hàng.
              </li>
              <li>
                <strong>Bảo tồn dữ liệu Trường & Lớp:</strong> Thông tin Trường học và Khối lớp được giữ nguyên để phân tích tương quan thống kê môi trường giáo dục mà hoàn toàn KHÔNG gắn liền với danh tính cá nhân.
              </li>
              <li>
                <strong>Tự nguyện & Quyền lợi:</strong> Việc tham gia là hoàn toàn tự nguyện. Bạn sẽ nhận được báo cáo đối chiếu mức độ an toàn an ninh mạng cá nhân ngay sau khi hoàn thành.
              </li>
            </ul>
          </div>

          {/* Interactive Checkbox */}
          <label
            onClick={() => onConsentAgreedChange(!consentAgreed)}
            className={`flex items-start gap-3 sm:gap-3.5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border cursor-pointer transition-all select-none active:scale-[0.99] ${
              consentAgreed
                ? 'bg-emerald-950/40 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500/30 shadow-md shadow-emerald-950/30'
                : 'bg-slate-950 border-rose-500/80 text-rose-200 ring-1 ring-rose-500/30'
            }`}
          >
            <div className={`mt-0.5 w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center shrink-0 transition ${
              consentAgreed ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'bg-slate-800 border border-slate-700 text-transparent'
            }`}>
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
            </div>

            <div className="flex-1 space-y-0.5">
              <span className="text-xs sm:text-sm font-black text-white block">
                Tôi xác nhận đã đọc, hiểu rõ và ĐỒNG Ý tham gia khảo sát nghiên cứu khoa học ẩn danh ViSEF 2026.
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-400 block">
                Bắt buộc xác nhận để bảo đảm tính chuẩn mực đạo đức của đề tài nghiên cứu ViSEF.
              </span>
            </div>
          </label>
        </div>
      )}
    </div>
  );
};
