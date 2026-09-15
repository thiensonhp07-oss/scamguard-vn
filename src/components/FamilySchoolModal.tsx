import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  X,
  ShieldCheck,
  Plus,
  Share2,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface FamilySchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FamilySchoolModal: React.FC<FamilySchoolModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [activeCircle, setActiveCircle] = useState<'family' | 'school'>('family');
  const [copiedInvite, setCopiedInvite] = useState(false);

  if (!isOpen) return null;

  const familyMembers = [
    { name: 'Bố (Nguyễn Văn Hùng - 65t)', score: 75, status: 'Đã thiết lập Mật mã an toàn', tier: 'Cần Hỗ Trợ QR' },
    { name: 'Mẹ (Trần Thị Mai - 62t)', score: 82, status: 'Đã hoàn thành 5 bài học', tier: 'Vệ Binh Tự Tin' },
    { name: 'Con Trai (Minh Đức - 16t)', score: 90, status: 'Đã mổ xẻ 10 mã Quishing', tier: 'Chuyên Gia Bóc Tách' },
  ];

  const students = [
    { name: 'Lớp 11A2 - Nhóm An Ninh Mạng', members: 38, avgScore: 84, completion: '92%' },
    { name: 'Học sinh Nguyễn Thu Trang', score: 96, drills: 15, status: 'Hạng Xuất Sắc' },
    { name: 'Học sinh Lê Hoàng Long', score: 78, drills: 8, status: 'Cần Luyện Deepfake' },
  ];

  const handleCopyInvite = () => {
    navigator.clipboard.writeText('https://scamguard.app/join/circle-family-8821');
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-900 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              {activeCircle === 'family' ? (
                <Users className="w-7 h-7" />
              ) : (
                <GraduationCap className="w-7 h-7" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-black text-white">
                {activeCircle === 'family'
                  ? t('home_family_circle_title')
                  : t('home_school_circle_title')}
              </h3>
              <p className="text-xs text-slate-400">
                {activeCircle === 'family'
                  ? 'Bảo vệ người thân lớn tuổi và con cái trước các đòn tâm lý lừa đảo'
                  : 'Cộng đồng an toàn số và quản trị điểm rèn luyện an ninh mạng'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 flex bg-slate-900">
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 w-full">
            <button
              onClick={() => setActiveCircle('family')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                activeCircle === 'family'
                  ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Vòng Tròn Gia Đình</span>
            </button>

            <button
              onClick={() => setActiveCircle('school')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                activeCircle === 'school'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Không Gian Lớp Học</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {activeCircle === 'family' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Thành Viên Trong Vòng Tròn (3 Người)
                </span>
                <button
                  onClick={handleCopyInvite}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center space-x-1 hover:underline"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedInvite ? 'Đã Sao Chép Link Mời!' : 'Gửi Link Tham Gia'}</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {familyMembers.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-white">{m.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-300 border border-slate-800">
                          {m.tier}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{m.status}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-500 block">Điểm Phòng Thủ</span>
                      <span className="text-base font-black text-emerald-400 font-mono">
                        {m.score}/100
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Thống Kê An Toàn Lớp Học
                </span>
                <span className="text-xs text-emerald-400 font-bold">
                  Hoàn Thành Bài Tập Tuần: 92%
                </span>
              </div>

              <div className="space-y-2.5">
                {students.map((st, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <span className="text-sm font-bold text-white block">{st.name}</span>
                      <span className="text-xs text-slate-400">Trạng thái: {st.status}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-500 block">Điểm Trung Bình</span>
                      <span className="text-base font-black text-cyan-400 font-mono">
                        {st.score || st.avgScore}/100
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
