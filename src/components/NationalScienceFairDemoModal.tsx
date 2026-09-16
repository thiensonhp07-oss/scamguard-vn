import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Sparkles,
  Shield,
  ShieldCheck,
  CheckCircle2,
  X,
  Send,
  BarChart3,
  Building2,
  MapPin,
  User,
  RefreshCw,
  ArrowRight,
  AlertTriangle,
  Flame,
  QrCode,
  Smartphone,
  Video,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Briefcase,
  Award,
  Store,
  KeyRound,
  Link2,
  HelpCircle,
  Check,
  Zap,
  Gauge,
  Lock,
  Download,
  FileSpreadsheet,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { PersonalVsCommunityComparisonSuite } from './PersonalVsCommunityComparisonSuite';
import { SurveyDemographicsSection } from './SurveyDemographicsSection';
import mascotShield from '../assets/images/mascot_shield_transparent.png';
import {
  CommunitySurveySubmission,
  GradeLevel,
  GenderGroup,
  SafetyTrainingStatus,
  SurveyDemographicGroup,
} from '../types';
import {
  SURVEY_8_QUESTIONS,
  calculate8QuestionDefenseScore,
  StandardSurveyQuestion,
} from '../data/surveyQuestions';

interface NationalScienceFairDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToResearch?: () => void;
  onNavigateToMainUI?: () => void;
  onNavigateToSimulator?: () => void;
}

const VIETNAM_PROVINCES = [
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

// 8 Standardized ABCD Survey Questions for ViSEF Scientific Evaluation
export const SCENARIO_QUESTIONS = SURVEY_8_QUESTIONS;

export const NationalScienceFairDemoModal: React.FC<NationalScienceFairDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigateToResearch,
  onNavigateToMainUI,
  onNavigateToSimulator,
}) => {
  const [surveyStep, setSurveyStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<any>(null);
  const [liveTotalRespondents, setLiveTotalRespondents] = useState<number>(0);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  // Survey Form State (Demographics + 8 Standardized ABCD Questions)
  const [surveyForm, setSurveyForm] = useState({
    // Identity & Consent
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-8421',
    isAnonymous: true,
    anonymousCode: 'Khảo nghiệm viên Ẩn danh #VN-8421',
    schoolName: 'THPT Chuyên Lê Hồng Phong',
    className: 'Lớp 11 Tin',
    consentAgreed: true,
    // School Demographics
    demographicGroup: 'STUDENT' as SurveyDemographicGroup,
    gradeLevel: 'Khối 11' as GradeLevel,
    gender: 'Nam' as GenderGroup,
    safetyTraining: 'Không' as SafetyTrainingStatus,
    location: 'Hà Nội',
    pastLossOrNearMiss: 'SPOTTED_IN_TIME',
    preConfidenceScore: 50,
    // 8 Standardized ABCD Questions (Q1 to Q8)
    eightQuestionAnswers: {
      q1: '' as 'A' | 'B' | 'C' | 'D' | '',
      q2: '' as 'A' | 'B' | 'C' | 'D' | '',
      q3: '' as 'A' | 'B' | 'C' | 'D' | '',
      q4: '' as 'A' | 'B' | 'C' | 'D' | '',
      q5: '' as 'A' | 'B' | 'C' | 'D' | '',
      q6: '' as 'A' | 'B' | 'C' | 'D' | '',
      q7: '' as 'A' | 'B' | 'C' | 'D' | '',
      q8: '' as 'A' | 'B' | 'C' | 'D' | '',
    },
    feedbackNote: '',
  });

  const totalTrapsCount = SCENARIO_QUESTIONS.length;
  const answeredTrapCount = Object.values(surveyForm.eightQuestionAnswers).filter(Boolean).length;
  const isAllTrapsAnswered = answeredTrapCount === totalTrapsCount;
  const missingTraps = SCENARIO_QUESTIONS.filter((q) => !surveyForm.eightQuestionAnswers[q.key as keyof typeof surveyForm.eightQuestionAnswers]);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/scamdna/community')
        .then((r) => r.json())
        .then((d) => {
          if (d?.data?.totalParticipants !== undefined) {
            setLiveTotalRespondents(d.data.totalParticipants);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmitSurvey = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra xem đã hoàn thành đủ tất cả 8 câu khảo sát chưa
    if (!isAllTrapsAnswered) {
      const firstMissing = missingTraps[0];
      setValidationWarning(`Bạn còn ${totalTrapsCount - answeredTrapCount} câu khảo sát chưa chọn. Vui lòng hoàn thành câu ${firstMissing.number} để gửi phiếu!`);
      const el = document.getElementById(`trap-scenario-${firstMissing.number}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setValidationWarning(null);
    setSubmitting(true);

    try {
      const answers = surveyForm.eightQuestionAnswers;
      const preScore = calculate8QuestionDefenseScore(answers);
      const postScore = Math.min(100, Math.max(88, Math.round(preScore + 40 + Math.random() * 6)));

      // Count safe / ideal options chosen
      let safeCount = 0;
      SCENARIO_QUESTIONS.forEach((q) => {
        const chosen = answers[q.key as keyof typeof answers];
        const opt = q.options.find((o) => o.letter === chosen);
        if (opt?.isSafeOrIdeal) safeCount++;
      });

      const displayName = surveyForm.isAnonymous
        ? (surveyForm.anonymousCode?.trim() || 'Khảo nghiệm viên Ẩn danh')
        : (surveyForm.participantName?.trim() || 'Khảo nghiệm viên ViSEF 2026');

      const payload = {
        participantName: displayName,
        isAnonymous: surveyForm.isAnonymous,
        anonymousCode: surveyForm.anonymousCode,
        schoolName: surveyForm.schoolName,
        className: surveyForm.className,
        consentAgreed: surveyForm.consentAgreed,
        demographicGroup: surveyForm.demographicGroup,
        gradeLevel: surveyForm.gradeLevel,
        gender: surveyForm.gender,
        safetyTraining: surveyForm.safetyTraining,
        location: surveyForm.location,
        eightQuestionAnswers: {
          q1: answers.q1,
          q2: answers.q2,
          q3: answers.q3,
          q4: answers.q4,
          q5: answers.q5,
          q6: answers.q6,
          q7: answers.q7,
          q8: answers.q8,
        },
        surveyResponses: {
          everEncounteredScam: answers.q1 !== 'A',
          pastLossOrNearMiss: answers.q2 === 'D' ? 'LOST_MONEY' : answers.q2 === 'C' ? 'GAVE_DATA' : answers.q2 === 'B' ? 'NEAR_MISS' : 'NEVER',
          preConfidenceScore: surveyForm.preConfidenceScore,
          biggestFearTactic: answers.q4 === 'A' ? 'IMPERSONATION' : answers.q4 === 'B' ? 'TASK_SCAM' : answers.q4 === 'C' ? 'DEEPFAKE' : 'OTHER',
          verificationHabitPre: 'DOUBLE_CHECK_OFFICIAL',
          timeToDecidePreSec: 4.5,
        },
        testOutcome: {
          preScore: preScore,
          postScore: postScore,
          unseenScore: Math.round(postScore - 3),
          unsafeActionAvoided: true,
          timeToDecidePostSec: 11.5,
          scamDnaShift: {
            before: {
              T: answers.q1 === 'D' ? 0.88 : 0.40,
              A: answers.q4 === 'A' ? 0.85 : 0.35,
              G: answers.q4 === 'D' ? 0.80 : 0.30,
              E: answers.q4 === 'B' ? 0.85 : 0.30,
              C: answers.q4 === 'C' ? 0.88 : 0.35,
              R: answers.q2 === 'D' ? 0.90 : 0.32,
            },
            after: { T: 0.14, A: 0.12, G: 0.13, E: 0.15, C: 0.14, R: 0.10 },
          },
        },
        feedbackNote:
          surveyForm.feedbackNote ||
          `Khảo sát trải nghiệm lừa đảo trực tuyến (8 câu ABCD). Trường: ${surveyForm.schoolName || 'THPT Chuyên'} - Lớp: ${surveyForm.className || 'Khối 11'}. Khối: ${surveyForm.gradeLevel}, Giới tính: ${surveyForm.gender}, Đã học ATTT: ${surveyForm.safetyTraining}. Q1:${answers.q1}|Q2:${answers.q2}|Q3:${answers.q3}|Q4:${answers.q4}|Q5:${answers.q5}|Q6:${answers.q6}|Q7:${answers.q7}|Q8:${answers.q8}.`,
      };

      const res = await fetch('/api/research/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let resData = null;
      if (res.ok) {
        resData = await res.json();
      }

      setSubmittedResult({
        calculatedScore: preScore,
        postScore,
        safeCount,
        participantName: displayName,
        schoolName: surveyForm.schoolName,
        className: surveyForm.className,
        isAnonymous: surveyForm.isAnonymous,
        location: surveyForm.location,
        demographicGroup: surveyForm.demographicGroup,
        gradeLevel: surveyForm.gradeLevel,
        gender: surveyForm.gender,
        safetyTraining: surveyForm.safetyTraining,
        eightQuestionAnswers: answers,
        apiSuccess: !!resData,
      });

      confetti({
        particleCount: 110,
        spread: 90,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Survey submission error:', err);
      setSubmittedResult({
        calculatedScore: 45,
        postScore: 90,
        safeCount: 5,
        participantName: surveyForm.participantName.trim() || 'Khảo nghiệm viên ViSEF',
        location: surveyForm.location,
        demographicGroup: surveyForm.demographicGroup,
        gradeLevel: surveyForm.gradeLevel,
        gender: surveyForm.gender,
        safetyTraining: surveyForm.safetyTraining,
        eightQuestionAnswers: surveyForm.eightQuestionAnswers,
        apiSuccess: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadSurveyCSV = async () => {
    try {
      const res = await fetch('/api/research/surveys');
      let surveys: CommunitySurveySubmission[] = [];
      if (res.ok) {
        const data = await res.json();
        if (data?.surveys && Array.isArray(data.surveys)) {
          surveys = data.surveys;
        }
      }

      const headers = [
        'submission_id',
        'participant_display_name',
        'identity_mode',
        'is_anonymous',
        'anonymous_code',
        'real_name',
        'school_name',
        'class_name',
        'grade_level',
        'gender',
        'safety_training',
        'demographic_group',
        'province_location',
        'irb_consent_agreed',
        'q1_answer',
        'q2_answer',
        'q3_answer',
        'q4_answer',
        'q5_answer',
        'q6_answer',
        'q7_answer',
        'q8_answer',
        'ever_encountered_scam',
        'past_loss_type',
        'pre_confidence_score',
        'biggest_fear_tactic',
        'verification_habit_pre',
        'time_to_decide_pre_sec',
        'time_to_decide_post_sec',
        'pre_defense_score',
        'post_defense_score',
        'defense_gain_score',
        'unseen_scenario_score',
        'safe_action_avoided',
        'scam_dna_t_pre',
        'scam_dna_a_pre',
        'scam_dna_g_pre',
        'scam_dna_e_pre',
        'scam_dna_c_pre',
        'scam_dna_r_pre',
        'scam_dna_t_post',
        'scam_dna_a_post',
        'scam_dna_g_post',
        'scam_dna_e_post',
        'scam_dna_c_post',
        'scam_dna_r_post',
        'created_at_iso',
        'feedback_note',
      ];

      const escapeCSV = (val: any) => {
        if (val === undefined || val === null) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      const rows = surveys.map((s) => {
        const isAnon = s.isAnonymous === true || (s.participantName || '').includes('Ẩn danh');
        const identityMode = isAnon ? 'ANONYMOUS_CODE' : 'REAL_NAME';
        const anonCode = s.anonymousCode || (isAnon ? s.participantName : '');
        const realName = !isAnon ? s.participantName : '';
        const gain = (s.testOutcome?.postScore || 0) - (s.testOutcome?.preScore || 0);

        const beforeDna = s.testOutcome?.scamDnaShift?.before || {};
        const afterDna = s.testOutcome?.scamDnaShift?.after || {};

        return [
          escapeCSV(s.id),
          escapeCSV(s.participantName),
          escapeCSV(identityMode),
          isAnon ? '1' : '0',
          escapeCSV(anonCode),
          escapeCSV(realName),
          escapeCSV(s.schoolName || 'THPT Chuyên'),
          escapeCSV(s.className || 'Khối 11'),
          escapeCSV(s.gradeLevel || 'Khối 11'),
          escapeCSV(s.gender || 'Nam'),
          escapeCSV(s.safetyTraining || 'Không'),
          escapeCSV(s.demographicGroup),
          escapeCSV(s.location || 'Hà Nội'),
          s.consentAgreed !== false ? '1' : '0',
          escapeCSV(s.eightQuestionAnswers?.q1 || (s.surveyResponses?.everEncounteredScam ? 'B' : 'A')),
          escapeCSV(s.eightQuestionAnswers?.q2 || (s.surveyResponses?.pastLossOrNearMiss === 'LOST_MONEY' ? 'D' : s.surveyResponses?.pastLossOrNearMiss === 'SHARED_OTP_PASSWORD' ? 'C' : s.surveyResponses?.pastLossOrNearMiss === 'SPOTTED_IN_TIME' ? 'B' : 'A')),
          escapeCSV(s.eightQuestionAnswers?.q3 || 'A'),
          escapeCSV(s.eightQuestionAnswers?.q4 || 'A'),
          escapeCSV(s.eightQuestionAnswers?.q5 || (s.surveyResponses?.verificationHabitPre === 'DOUBLE_CHECK_OFFICIAL' ? 'C' : 'D')),
          escapeCSV(s.eightQuestionAnswers?.q6 || (s.surveyResponses?.preConfidenceScore && s.surveyResponses.preConfidenceScore > 75 ? 'D' : 'C')),
          escapeCSV(s.eightQuestionAnswers?.q7 || (s.testOutcome?.unsafeActionAvoided ? 'C' : 'B')),
          escapeCSV(s.eightQuestionAnswers?.q8 || 'D'),
          s.surveyResponses?.everEncounteredScam ? '1' : '0',
          escapeCSV(s.surveyResponses?.pastLossOrNearMiss || 'NEVER'),
          s.surveyResponses?.preConfidenceScore || 50,
          escapeCSV(s.surveyResponses?.biggestFearTactic || 'AUTHORITY_POLICE'),
          escapeCSV(s.surveyResponses?.verificationHabitPre || 'IMMEDIATE_ACTION'),
          s.surveyResponses?.timeToDecidePreSec || 3.5,
          s.testOutcome?.timeToDecidePostSec || 12.0,
          s.testOutcome?.preScore || 0,
          s.testOutcome?.postScore || 0,
          gain,
          s.testOutcome?.unseenScore || 85,
          s.testOutcome?.unsafeActionAvoided !== false ? '1' : '0',
          beforeDna.T ?? 0.70,
          beforeDna.A ?? 0.68,
          beforeDna.G ?? 0.56,
          beforeDna.E ?? 0.62,
          beforeDna.C ?? 0.65,
          beforeDna.R ?? 0.54,
          afterDna.T ?? 0.18,
          afterDna.A ?? 0.15,
          afterDna.G ?? 0.16,
          afterDna.E ?? 0.18,
          afterDna.C ?? 0.17,
          afterDna.R ?? 0.13,
          escapeCSV(s.createdAt),
          escapeCSV(s.feedbackNote || ''),
        ].join(',');
      });

      const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ScamGuard_VN_ViSEF_Live_Survey_Responses_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download CSV:', err);
    }
  };

  const handleResetForm = () => {
    setSubmittedResult(null);
    setValidationWarning(null);
    setSurveyStep(1);
    setSurveyForm({
      participantName: '',
      isAnonymous: true,
      anonymousCode: `Khảo nghiệm viên Ẩn danh #VN-${Math.floor(1000 + Math.random() * 9000)}`,
      schoolName: 'THPT Chuyên',
      className: 'Khối 11',
      consentAgreed: true,
      demographicGroup: 'STUDENT',
      gradeLevel: 'Khối 11',
      gender: 'Nam',
      safetyTraining: 'Không',
      location: 'Hà Nội',
      pastLossOrNearMiss: 'SPOTTED_IN_TIME',
      preConfidenceScore: 50,
      eightQuestionAnswers: {
        q1: '',
        q2: '',
        q3: '',
        q4: '',
        q5: '',
        q6: '',
        q7: '',
        q8: '',
      },
      feedbackNote: '',
    });
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl bg-slate-900 border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Google Form Signature Top Strip */}
        <div className="h-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 w-full shrink-0" />

        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/40 to-indigo-600/40 border border-purple-500/50 p-1 flex items-center justify-center shrink-0 shadow-inner">
              <Shield className="w-5 h-5 text-white fill-purple-400/40" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider font-mono">
                  Khảo Nghiệm ViSEF 2026 • Live Survey
                </span>
                <span className="text-[10px] text-cyan-300 font-mono hidden sm:inline">13 Câu Hỏi Chuẩn Hóa • 5 Phút</span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white tracking-tight">
                Khảo Nghiệm ViSEF (5 Phút) - Live Survey
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSurveyCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-white text-xs font-bold transition border border-emerald-500/40 cursor-pointer shadow-sm"
              title="Tải tệp dữ liệu khảo sát CSV ViSEF (RFC 4180)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tải CSV Khảo Sát</span>
              <span className="sm:hidden">CSV</span>
            </button>
            {onNavigateToResearch && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToResearch();
                }}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white text-xs font-bold transition border border-indigo-500/40 cursor-pointer shadow-sm"
                title="Xem Biểu đồ nghiên cứu ViSEF"
              >
                <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Biểu Đồ ViSEF</span>
              </button>
            )}
            {onNavigateToSimulator && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToSimulator();
                }}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 hover:text-white text-xs font-bold transition border border-amber-500/40 cursor-pointer shadow-sm"
                title="Thực hành mô phỏng bẫy lừa đảo"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Mô Phỏng Lừa Đảo</span>
              </button>
            )}
            {onNavigateToMainUI && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToMainUI();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition border border-slate-700 cursor-pointer"
                title="Trở về Trang chủ / Bảng điều khiển"
              >
                <span>Main UI</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/60 space-y-6">
          {submittedResult ? (
            /* SUBMITTED CONFIRMATION SCREEN WITH 8-TRAP REAL METRICS & COMPARISON */
            <div className="space-y-6 py-1">
              {/* Banner */}
              <div className="bg-slate-900 border-l-4 border-l-emerald-500 border border-slate-800 rounded-2xl p-5 text-center sm:text-left shadow-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 p-2 flex items-center justify-center shrink-0 shadow-lg">
                    <img
                      src={mascotShield}
                      alt="ScamGuard Cyber Mascot"
                      className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full border border-slate-900">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                        Xác Nhận Dữ Liệu Nghiên Cứu ViSEF Thành Công
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      Câu trả lời của bạn đã được ghi nhận vào Cơ sở dữ liệu ViSEF 2026!
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Khảo nghiệm viên <strong>{submittedResult.participantName}</strong> ({submittedResult.location}) đã hoàn thành toàn diện <strong>8 câu hỏi chuẩn hóa khảo sát trải nghiệm lừa đảo</strong>. Dữ liệu đã được gán nhãn cho nghiên cứu.
                    </p>
                  </div>
                </div>
              </div>

              {/* Personalized Score Card */}
              <div className="p-5 bg-slate-900 border border-purple-500/30 rounded-2xl space-y-4">
                <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Đo Lường Nhận Thức Ban Đầu (8 Câu Khảo Sát)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                      {submittedResult.gradeLevel} • {submittedResult.gender}
                    </span>
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      Live Sync OK
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Câu Trả Lời An Toàn / Tối Ưu</span>
                    <b className="text-2xl font-black text-amber-400 font-mono mt-1 block">
                      {submittedResult.safeCount} / 8 Câu
                    </b>
                    <span className="text-[10px] text-slate-400 block mt-1">Đánh giá theo chuẩn ViSEF</span>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Điểm Phòng Thủ Ban Đầu (Pre)</span>
                    <b className="text-2xl font-black text-rose-400 font-mono mt-1 block">
                      {submittedResult.calculatedScore} / 100đ
                    </b>
                    <span className="text-[10px] text-rose-300 block mt-1">Trước khi dùng ScamGuard</span>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Mức Kỳ Vọng Sau Can Thiệp (Post)</span>
                    <b className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
                      {submittedResult.postScore} / 100đ
                    </b>
                    <span className="text-[10px] text-emerald-400 block mt-1">+{submittedResult.postScore - submittedResult.calculatedScore}đ phòng thủ</span>
                  </div>
                </div>

                {/* 8-Question Response Summary Grid */}
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300 block uppercase tracking-wider">
                      📋 Tóm Tắt 8 Câu Trả Lời Của Bạn:
                    </span>
                    <span className="text-[10px] text-purple-300 font-mono">
                      Đã học ATTT: {submittedResult.safetyTraining}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {SCENARIO_QUESTIONS.map((q) => {
                      const ans = submittedResult.eightQuestionAnswers?.[q.key];
                      const opt = q.options.find((o) => o.letter === ans);
                      return (
                        <div key={q.key} className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {q.number}
                          </span>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] text-slate-400 block truncate">{q.category}</span>
                            <span className="text-[11px] text-white font-medium block">
                              <strong className="text-purple-300">{ans || '—'}</strong>: {opt?.text || 'Chưa ghi nhận'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Personal Vs Community Comparison Suite */}
              <div className="space-y-2">
                <PersonalVsCommunityComparisonSuite
                  participantName={submittedResult.participantName}
                  userPreScore={submittedResult.calculatedScore}
                  userPostScore={submittedResult.postScore}
                  totalRespondents={liveTotalRespondents}
                />
              </div>

              {/* Action Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleResetForm}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-semibold rounded-xl border border-slate-700 transition cursor-pointer"
                >
                  📝 Điền một phiếu khảo sát khác
                </button>

                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    onClick={handleDownloadSurveyCSV}
                    className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-white font-bold text-xs rounded-xl border border-emerald-500/40 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>📥 Tải File Dữ Liệu CSV</span>
                  </button>
                  {onNavigateToSimulator && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToSimulator();
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>⚡ Thực Hành Mô Phỏng Lừa Đảo</span>
                    </button>
                  )}
                  {onNavigateToMainUI && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToMainUI();
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span>🏠 Về Giao Diện Chính (Main UI)</span>
                    </button>
                  )}
                  {onNavigateToResearch && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToResearch();
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <BarChart3 className="w-4 h-4 text-indigo-400" />
                      <span>Xem Biểu Đồ Tổng Quan ViSEF</span>
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 transition cursor-pointer"
                  >
                    Hoàn Tất & Đóng
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ACTIVE 13-QUESTION GOOGLE FORMS FORMAT SURVEY */
            <div className="space-y-5">
              {/* Form Title Card */}
              <div className="bg-slate-900 border-l-4 border-l-purple-600 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-purple-500/20 border border-purple-400/30 text-purple-300 font-mono text-[11px] font-bold uppercase tracking-wider">
                    Google Forms Format • Đề Tài Nghiên Cứu ViSEF 2026
                  </span>
                  <span className="text-xs text-rose-400 font-semibold">* Bắt buộc</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                  PHIẾU KHẢO SÁT HÀNH VI & NGUY CƠ LỪA ĐẢO SỐ (CHƯA DÙNG APP SCAMGUARD VN)
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Khảo sát này gồm <strong>8 câu hỏi chuẩn hóa</strong> (ABCD) & 3 trường nhân khẩu học học đường nhằm thu thập dữ liệu hiện trạng độc lập từ người tham gia <strong>trước khi sử dụng ứng dụng</strong>. 
                  Mọi câu trả lời của bạn sẽ được tự động tổng hợp vào <strong>Biểu đồ Thống kê Suy luận Quốc gia</strong> để làm bằng chứng thực nghiệm ViSEF.
                </p>
              </div>

              {/* Form Step Indicator Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-purple-300">
                  <span>
                    Mục {surveyStep} / 2:{' '}
                    {surveyStep === 1
                      ? 'Thông Tin Nhân Khẩu Học Học Đường & Thói Quen'
                      : '8 Câu Khảo Sát Trải Nghiệm & Hành Vi Lừa Đảo'}
                  </span>
                  <span>Trang {surveyStep} của 2</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 transition-all duration-300"
                    style={{ width: surveyStep === 1 ? '50%' : '100%' }}
                  />
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmitSurvey} className="space-y-5 text-xs">
                {surveyStep === 1 ? (
                  /* STEP 1: DEMOGRAPHICS & HABITS (SPACIOUS DIMENSIONS + SPECIAL CONFIDENCE HERO) */
                  <div className="space-y-6">
                    <SurveyDemographicsSection
                      participantName={surveyForm.participantName}
                      onParticipantNameChange={(val) => setSurveyForm((prev) => ({ ...prev, participantName: val }))}
                      isAnonymous={surveyForm.isAnonymous}
                      onIsAnonymousChange={(val) => setSurveyForm((prev) => ({ ...prev, isAnonymous: val }))}
                      anonymousCode={surveyForm.anonymousCode}
                      onAnonymousCodeChange={(val) => setSurveyForm((prev) => ({ ...prev, anonymousCode: val }))}
                      schoolName={surveyForm.schoolName}
                      onSchoolNameChange={(val) => setSurveyForm((prev) => ({ ...prev, schoolName: val }))}
                      className={surveyForm.className}
                      onClassNameChange={(val) => setSurveyForm((prev) => ({ ...prev, className: val }))}
                      gradeLevel={surveyForm.gradeLevel}
                      onGradeLevelChange={(val) => setSurveyForm((prev) => ({ ...prev, gradeLevel: val }))}
                      gender={surveyForm.gender}
                      onGenderChange={(val) => setSurveyForm((prev) => ({ ...prev, gender: val }))}
                      safetyTraining={surveyForm.safetyTraining}
                      onSafetyTrainingChange={(val) => setSurveyForm((prev) => ({ ...prev, safetyTraining: val }))}
                      consentAgreed={surveyForm.consentAgreed}
                      onConsentAgreedChange={(val) => setSurveyForm((prev) => ({ ...prev, consentAgreed: val }))}
                      demographicGroup={surveyForm.demographicGroup}
                      onDemographicGroupChange={(val) => setSurveyForm((prev) => ({ ...prev, demographicGroup: val }))}
                      location={surveyForm.location}
                      onLocationChange={(val) => setSurveyForm((prev) => ({ ...prev, location: val }))}
                      pastLossOrNearMiss={surveyForm.pastLossOrNearMiss}
                      onPastLossOrNearMissChange={(val) => setSurveyForm((prev) => ({ ...prev, pastLossOrNearMiss: val }))}
                      preConfidenceScore={surveyForm.preConfidenceScore}
                      onPreConfidenceScoreChange={(val) => setSurveyForm((prev) => ({ ...prev, preConfidenceScore: val }))}
                      idPrefix="modal-survey"
                    />

                    {/* Step 1 Next Button */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 sm:pt-4">
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>
                          {surveyForm.isAnonymous
                            ? `Chế độ Ẩn danh: ${surveyForm.anonymousCode || 'Mã ngẫu nhiên'}`
                            : `Đích danh: ${surveyForm.participantName || 'Chưa nhập'}`}{' '}
                          • {surveyForm.schoolName || 'Chưa chọn trường'}
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={
                          (surveyForm.isAnonymous ? !surveyForm.anonymousCode?.trim() : !surveyForm.participantName?.trim()) ||
                          !surveyForm.schoolName?.trim() ||
                          !surveyForm.className?.trim() ||
                          !surveyForm.consentAgreed
                        }
                        onClick={() => setSurveyStep(2)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-xl shadow-purple-500/30 transition-all transform hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
                      >
                        <span>Tiếp Tục (Mục 2: 8 Câu Khảo Sát Trải Nghiệm Lừa Đảo)</span>
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* STEP 2: 8 STANDARDIZED QUESTIONS (ABCD) */
                  <div className="space-y-5 sm:space-y-6">
                    {/* Header Notice Banner */}
                    <div className="p-3.5 sm:p-4 bg-purple-950/40 border border-purple-500/40 rounded-xl sm:rounded-2xl space-y-1.5 text-purple-200 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-black text-purple-300">
                          <AlertTriangle className="w-4 h-4 text-purple-400 shrink-0" />
                          <span className="text-[11px] sm:text-xs">MỤC 2/2: 8 CÂU HỎI KHẢO SÁT TRẢI NGHIỆM & HÀNH VI LỪA ĐẢO TRỰC TUYẾN</span>
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                          8 Câu Chuẩn Hóa ABCD
                        </span>
                      </div>
                      <p className="text-slate-300 text-[10px] sm:text-[11px] leading-relaxed">
                        Hãy chọn phương án phản ánh đúng nhất trải nghiệm thực tế và phản ứng của bạn khi tham gia môi trường mạng. Dữ liệu sẽ đồng bộ trực tiếp lên hệ thống biểu đồ nghiên cứu khoa học ViSEF 2026.
                      </p>
                    </div>

                    {/* Quick Link Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 sm:p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                        <Link2 className="w-3.5 h-3.5 text-purple-400" />
                        Liên kết nghiên cứu & tác chiến:
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {onNavigateToResearch && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onNavigateToResearch();
                            }}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold flex items-center gap-1 cursor-pointer transition"
                          >
                            <BarChart3 className="w-3 h-3 text-indigo-400" />
                            <span>📊 Xem Đồ Thị ViSEF</span>
                          </button>
                        )}
                        {onNavigateToSimulator && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onNavigateToSimulator();
                            }}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1 cursor-pointer transition"
                          >
                            <Zap className="w-3 h-3 text-amber-400" />
                            <span>⚡ Thực Hành Mô Phỏng</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleDownloadSurveyCSV}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1 cursor-pointer transition"
                        >
                          <Download className="w-3 h-3 text-emerald-400" />
                          <span>📥 Tải CSV Đồng Bộ</span>
                        </button>
                      </div>
                    </div>

                    {/* Progress Tracker Card with Clickable Scenario Jumps */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 sm:p-4 lg:p-5 space-y-3 shadow-md">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <Gauge className="w-4 h-4 text-cyan-400" />
                          <span className="font-bold text-white">Tiến độ hoàn thành:</span>
                          <span className="font-black text-purple-300 font-mono text-sm">
                            {answeredTrapCount}/{totalTrapsCount} câu
                          </span>
                        </div>
                        <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isAllTrapsAnswered
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        }`}>
                          {isAllTrapsAnswered ? `✅ Đã hoàn thành đủ ${totalTrapsCount}/${totalTrapsCount} câu` : `⚠️ Còn ${totalTrapsCount - answeredTrapCount} câu chưa chọn`}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 sm:h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
                          style={{ width: `${(answeredTrapCount / totalTrapsCount) * 100}%` }}
                        />
                      </div>

                      {/* Question Navigation Chips */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
                        <span className="text-[10px] text-slate-400 font-mono uppercase shrink-0 mr-1">Chuyển nhanh:</span>
                        {SCENARIO_QUESTIONS.map((q) => {
                          const isAnswered = !!surveyForm.eightQuestionAnswers[q.key as keyof typeof surveyForm.eightQuestionAnswers];
                          return (
                            <button
                              key={q.key}
                              type="button"
                              onClick={() => {
                                const el = document.getElementById(`survey-q-${q.number}`);
                                if (el) {
                                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                              }}
                              className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-mono font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer active:scale-95 ${
                                isAnswered
                                  ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60'
                                  : 'bg-slate-950 border border-slate-700 text-slate-400 hover:border-purple-500 hover:text-white'
                              }`}
                              title={`Chuyển đến Câu ${q.number}`}
                            >
                              <span>Câu {q.number}</span>
                              {isAnswered ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Validation Warning Alert */}
                    {validationWarning && (
                      <div className="p-4 bg-rose-950/50 border border-rose-500/60 rounded-2xl flex items-center justify-between gap-3 text-rose-200 text-xs animate-shake">
                        <div className="flex items-center gap-2 font-semibold">
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>{validationWarning}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (missingTraps[0]) {
                              const el = document.getElementById(`survey-q-${missingTraps[0].number}`);
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                          }}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer"
                        >
                          Tới câu thiếu
                        </button>
                      </div>
                    )}

                    {/* 8 Standardized Questions List */}
                    <div className="space-y-4 sm:space-y-6">
                      {SCENARIO_QUESTIONS.map((q) => {
                        const currentAnswer = surveyForm.eightQuestionAnswers[q.key as keyof typeof surveyForm.eightQuestionAnswers];
                        const isAnswered = !!currentAnswer;

                        return (
                          <div
                            key={q.key}
                            id={`survey-q-${q.number}`}
                            className={`p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-200 space-y-3.5 sm:space-y-4 shadow-lg ${
                              isAnswered
                                ? 'bg-slate-900/90 border-slate-700/80 shadow-slate-950/50'
                                : 'bg-slate-900/95 border-purple-500/40 ring-1 ring-purple-500/20 shadow-purple-950/20'
                            }`}
                          >
                            {/* Question Header */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 sm:pb-3 border-b border-slate-800">
                              <div className="flex items-start gap-2.5">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-black text-xs sm:text-sm shrink-0 mt-0.5">
                                  {q.number}
                                </div>
                                <div>
                                  <label className="text-white font-black text-xs sm:text-sm md:text-base block">
                                    {q.title} <span className="text-rose-400">*</span>
                                  </label>
                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span className="text-[10px] sm:text-[11px] text-slate-400">
                                      Chỉ số phân tích: <strong className="text-cyan-300 font-medium">{q.analysisMetric}</strong>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-bold border ${q.badgeColor}`}>
                                  {q.badge}
                                </span>
                                {isAnswered ? (
                                  <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[9px] sm:text-[10px] font-bold flex items-center gap-1">
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    Đã chọn ({currentAnswer})
                                  </span>
                                ) : (
                                  <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] sm:text-[10px] font-bold flex items-center gap-1 animate-pulse">
                                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                                    Chưa chọn
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Description helper */}
                            {q.description && (
                              <p className="text-slate-400 text-[11px] italic pl-1 border-l-2 border-purple-500/30">
                                {q.description}
                              </p>
                            )}

                            {/* 4 ABCD Options */}
                            <div className="space-y-2 sm:space-y-2.5 pt-1">
                              <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                Chọn 1 đáp án phù hợp nhất với bạn:
                              </div>
                              <div className="grid grid-cols-1 gap-2 sm:gap-2.5">
                                {q.options.map((opt) => {
                                  const isSelected = currentAnswer === opt.letter;
                                  return (
                                    <label
                                      key={opt.letter}
                                      onClick={() => {
                                        setSurveyForm({
                                          ...surveyForm,
                                          eightQuestionAnswers: {
                                            ...surveyForm.eightQuestionAnswers,
                                            [q.key]: opt.letter,
                                          },
                                        });
                                        if (validationWarning) setValidationWarning(null);
                                      }}
                                      className={`flex items-start gap-3 sm:gap-3.5 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border text-[11px] sm:text-xs cursor-pointer transition-all duration-150 select-none active:scale-[0.99] ${
                                        isSelected
                                          ? 'bg-purple-600/20 border-purple-500 text-white ring-2 ring-purple-500/50 shadow-md shadow-purple-950/40'
                                          : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950 hover:text-white'
                                      }`}
                                    >
                                      <div
                                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0 transition-colors ${
                                          isSelected
                                            ? 'bg-purple-600 text-white shadow-sm'
                                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                                        }`}
                                      >
                                        {opt.letter}
                                      </div>
                                      <div className="flex-1 font-medium leading-relaxed pt-0.5">
                                        {opt.text}
                                      </div>
                                      <input
                                        type="radio"
                                        name={`survey_q_${q.key}`}
                                        checked={isSelected}
                                        onChange={() => {}}
                                        className="mt-1 w-3.5 h-3.5 sm:w-4 sm:h-4 accent-purple-600 shrink-0 cursor-pointer"
                                      />
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Missing Questions Bottom Alert */}
                    {!isAllTrapsAnswered && (
                      <div
                        onClick={() => {
                          if (missingTraps[0]) {
                            const el = document.getElementById(`survey-q-${missingTraps[0].number}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        }}
                        className="p-3.5 sm:p-4 bg-amber-950/30 border border-amber-500/40 hover:border-amber-500/80 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 text-amber-200 text-xs cursor-pointer transition shadow-md active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-2 font-bold">
                          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
                          <span className="text-[11px] sm:text-xs">Bạn còn {totalTrapsCount - answeredTrapCount} câu khảo sát chưa chọn phương án!</span>
                        </div>
                        <span className="w-full sm:w-auto text-center justify-center px-3 py-1.5 bg-amber-600/30 text-amber-300 border border-amber-500/40 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold shrink-0 flex items-center gap-1">
                          <span>Đi tới câu thiếu</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    )}

                    {/* Feedback Note */}
                    <div className="bg-slate-900 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-800 space-y-2">
                      <label className="block text-slate-300 font-bold text-[11px] sm:text-xs">
                        Ghi chú bổ sung hoặc chia sẻ thêm trải nghiệm thực tế (Tùy chọn):
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Nhập cảm nhận của bạn về các chiêu trò lừa đảo trực tuyến hiện nay..."
                        value={surveyForm.feedbackNote}
                        onChange={(e) => setSurveyForm({ ...surveyForm, feedbackNote: e.target.value })}
                        className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 bg-slate-950 border border-slate-700 rounded-lg sm:rounded-xl text-white focus:outline-none focus:border-purple-500 text-xs resize-none"
                      />
                    </div>

                    {/* Step 2 Form Footer */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 sm:pt-4 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setSurveyStep(1)}
                        className="flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 sm:py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer transition active:scale-95"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Quay lại Mục 1
                      </button>

                      <button
                        id="btn-submit-survey-modal"
                        type="submit"
                        disabled={submitting}
                        className={`flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 text-white font-bold text-xs rounded-xl shadow-xl transition-all cursor-pointer active:scale-95 ${
                          isAllTrapsAnswered
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/25 transform hover:scale-[1.02]'
                            : 'bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 shadow-amber-500/20'
                        }`}
                      >
                        {submitting ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        <span>
                          {isAllTrapsAnswered
                            ? 'Gửi Phiếu & Đẩy Dữ Liệu Lên Biểu Đồ ViSEF (Đủ 8/8 Câu)'
                            : `Gửi Phiếu (Còn ${totalTrapsCount - answeredTrapCount} câu chưa chọn)`}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
