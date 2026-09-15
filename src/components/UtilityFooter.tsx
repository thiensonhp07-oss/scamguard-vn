import React from 'react';
import { Shield, Lock, ExternalLink } from 'lucide-react';

export const UtilityFooter: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950/90 border-t border-slate-900/80 py-8 px-4 sm:px-6 lg:px-8 mt-16 text-slate-500 text-xs select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-semibold text-slate-400 tracking-wide">SCAMGUARD VIETNAM AI DEFENSE</p>
            <p className="text-[11px] text-slate-600">Nền tảng trí tuệ nhân tạo phòng chống lừa đảo trực tuyến toàn dân.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-medium text-slate-500">
          <a href="#about" onClick={(e) => { e.preventDefault(); alert('ScamGuard VN - Dự án bảo vệ cộng đồng không gian mạng.'); }} className="hover:text-slate-300 transition-colors">Giới thiệu</a>
          <a href="#investors" onClick={(e) => { e.preventDefault(); alert('Đồng hành bởi các chuyên gia an ninh mạng & công nghệ AI.'); }} className="hover:text-slate-300 transition-colors">Nhà đầu tư & Đối tác</a>
          <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Mọi dữ liệu giám định đều được mã hóa và bảo mật tuyệt đối.'); }} className="hover:text-slate-300 transition-colors">Điều khoản bảo mật</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); alert('Hotline hỗ trợ khẩn cấp: 1900-SCAM hoặc 113.'); }} className="hover:text-slate-300 transition-colors">Báo cáo sự cố</a>
        </div>

        <div className="text-[11px] text-slate-600 text-center md:text-right">
          <p>© 2026 ScamGuard AI. All rights reserved.</p>
          <p className="flex items-center justify-center md:justify-end space-x-1 mt-0.5">
            <Lock className="w-3 h-3 text-slate-600" />
            <span>Mã hóa End-to-End an toàn</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
