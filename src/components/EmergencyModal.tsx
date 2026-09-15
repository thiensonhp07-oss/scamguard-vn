import React from 'react';
import {
  AlertTriangle,
  X,
  PhoneCall,
  Lock,
  FileText,
  ShieldCheck,
  Building,
  Key,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const hotlines = [
    { name: 'Khẩn Cấp Công An Việt Nam', phone: '113', note: 'Báo án lừa đảo chiếm đoạt tài sản' },
    { name: 'Tổng Đài Phản Ánh Tin Nhắn / Cuộc Gọi Rác (Bộ TTTT)', phone: '156', note: 'Miễn phí cước gọi' },
    { name: 'Cục An Toàn Thông Tin (VNCERT/CC)', phone: '024.3209.6789', note: 'Cảnh báo an ninh mạng' },
    { name: 'Vietcombank 24/7 (Khóa Thẻ Khẩn Cấp)', phone: '1900 54 54 13', note: 'Phím 1 khóa khẩn cấp' },
    { name: 'Techcombank 24/7', phone: '1800 588 822', note: 'Miễn phí cuộc gọi' },
    { name: 'MB Bank (Ngân Hàng Quân Đội)', phone: '1900 54 54 26', note: 'Hỗ trợ 24/7' },
    { name: 'BIDV 24/7', phone: '1900 9247', note: 'Tra soát giao dịch gian lận' },
    { name: 'VietinBank 24/7', phone: '1900 558 868', note: 'Khóa tài khoản khẩn' },
    { name: 'VPBank 24/7', phone: '1900 54 54 15', note: 'Khóa app & thẻ tức thì' },
  ];

  const steps = [
    { title: t('em_step_1_title'), desc: t('em_step_1_desc'), icon: <Lock className="w-5 h-5 text-rose-400" /> },
    { title: t('em_step_2_title'), desc: t('em_step_2_desc'), icon: <Key className="w-5 h-5 text-amber-400" /> },
    { title: t('em_step_3_title'), desc: t('em_step_3_desc'), icon: <FileText className="w-5 h-5 text-cyan-400" /> },
    { title: t('em_step_4_title'), desc: t('em_step_4_desc'), icon: <Smartphone className="w-5 h-5 text-purple-400" /> },
    { title: t('em_step_5_title'), desc: t('em_step_5_desc'), icon: <Building className="w-5 h-5 text-emerald-400" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-rose-500/40 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-8 animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 p-6 border-b border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-7 h-7 animate-bounce" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">{t('em_title')}</h3>
              <p className="text-xs text-rose-300">{t('em_subtitle')}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* 5-Step Protocol */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              5 Bước Chặn Dòng Tiền & Giảm Thiểu Thiệt Hại Ngay Lập Tức:
            </h4>

            <div className="space-y-3">
              {steps.map((st, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-start space-x-3"
                >
                  <div className="mt-0.5 flex-shrink-0">{st.icon}</div>
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-white">{st.title}</h5>
                    <p className="text-xs text-slate-300 leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hotlines Directory */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
              <PhoneCall className="w-4 h-4" />
              <span>{t('em_hotlines_title')}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {hotlines.map((hl, idx) => (
                <a
                  key={idx}
                  href={`tel:${hl.phone.replace(/\s+/g, '')}`}
                  className="p-3 bg-slate-950 hover:bg-cyan-950/40 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-colors block"
                >
                  <div className="text-xs font-bold text-slate-200">{hl.name}</div>
                  <div className="text-sm font-black text-cyan-400 font-mono mt-0.5">{hl.phone}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{hl.note}</div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            {t('em_btn_close')}
          </button>
        </div>
      </div>
    </div>
  );
};
