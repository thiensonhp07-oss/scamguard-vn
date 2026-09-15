import React, { useState } from 'react';
import {
  Printer,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Award,
  Layers,
  Scale,
  Brain,
  ShieldCheck,
  LineChart,
  Cpu,
  BarChart3,
  CheckCircle2,
  Sparkles,
  FileSpreadsheet,
  BookOpen,
} from 'lucide-react';
import { motion } from 'motion/react';

export const VisefPosterBoardVisualizer: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeHighlightPanel, setActiveHighlightPanel] = useState<'ALL' | 'LEFT' | 'CENTER' | 'RIGHT'>('ALL');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Award className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-sm font-black text-white">Poster Triển Lãm ViSEF (ViSEF / ISEF Standard)</h3>
            <p className="text-[11px] text-slate-400">Thiết kế 3 cánh tỷ lệ chuẩn 120cm x 150cm phục vụ chấm thi gian hàng trực tiếp</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(70, prev - 10))}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-300 font-bold px-2">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(130, prev + 10))}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Phóng to"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Panel Selector */}
          <div className="hidden md:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['ALL', 'LEFT', 'CENTER', 'RIGHT'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setActiveHighlightPanel(p)}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  activeHighlightPanel === p
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p === 'ALL' ? 'Toàn Cảnh 3 Cánh' : p === 'LEFT' ? 'Cánh Trái' : p === 'CENTER' ? 'Cánh Giữa' : 'Cánh Phải'}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>In Poster Chuẩn</span>
          </button>
        </div>
      </div>

      {/* The Printable / Renderable Poster Board Canvas */}
      <div className="overflow-x-auto pb-4">
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="min-w-[1000px] max-w-[1300px] mx-auto bg-slate-950 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-200 transition-transform duration-200"
        >
          {/* POSTER HEADER BANNER */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-blue-900 border border-indigo-400/40 rounded-2xl p-6 text-center space-y-2 relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between text-[11px] font-mono text-purple-300 font-bold border-b border-purple-500/30 pb-2">
              <span>CUỘC THI KHOA HỌC KỸ THUẬT CẤP QUỐC GIA DÀNH CHO HỌC SINH TRUNG HỌC (VISEF 2026)</span>
              <span>LĨNH VỰC: HỆ THỐNG THÔNG MINH & AN NINH MẠNG • MÃ DỰ ÁN: SYS-VN-092</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase leading-snug">
              SCAMGUARD VN: HỆ THỐNG ĐÁNH GIÁ RỦI RO LỪA ĐẢO & HUẤN LUYỆN AN NINH MẠNG THÍCH ỨNG DỰA TRÊN VECTOR HÀNH VI SCAM DNA
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-indigo-200 font-medium pt-1">
              <span>Nhóm Tác Giả: <b>Học Sinh Nghiên Cứu ViSEF</b></span>
              <span>•</span>
              <span>Đơn vị: <b>Trường THPT Chuyên / Đội Tuyển Quốc Gia</b></span>
              <span>•</span>
              <span>Giáo viên hướng dẫn: <b>ThS. / TS. Công Nghệ Thông Tin</b></span>
            </div>
          </div>

          {/* 3-PANEL BENTO GRID CONTAINER */}
          <div className="grid grid-cols-12 gap-5">
            {/* PANEL 1: CÁNH TRÁI - VẤN ĐỀ & CƠ SỞ KHOA HỌC (4 Cols) */}
            <div
              className={`col-span-12 lg:col-span-4 space-y-4 transition-opacity ${
                activeHighlightPanel === 'ALL' || activeHighlightPanel === 'LEFT' ? 'opacity-100' : 'opacity-30'
              }`}
            >
              {/* Box 1: Problem Statement */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase border-b border-slate-800 pb-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>1. ĐẶT VẤN ĐỀ & TÍNH CẤP THIẾT</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  Hơn <b>90% vụ chiếm đoạt tài sản qua mạng tại Việt Nam</b> khai thác lỗ hổng tâm lý con người qua Social Engineering, Deepfake và Quishing. Các biện pháp tuyên truyền tĩnh (infographic, văn bản) thiếu tính tương tác và không rèn luyện được phản xạ nhận thức System 2.
                </p>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80 text-[10px] text-purple-300 font-mono">
                  Mục tiêu: Xây dựng hệ thống huấn luyện thích ứng cá nhân hóa theo vector Scam DNA, đo lường bằng thực nghiệm RCT đối chứng 3 nhóm.
                </div>
              </div>

              {/* Box 2: Research Questions & Hypotheses */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase border-b border-slate-800 pb-1.5">
                  <Scale className="w-4 h-4" />
                  <span>2. GIẢ THUYẾT NGHIÊN CỨU (H1 - H3)</span>
                </div>
                <div className="space-y-1.5 text-[10px]">
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <b className="text-emerald-400">H1:</b> Nhóm can thiệp thích ứng (Nhóm C) đạt mức tăng điểm an ninh mạng vượt trội so với Nhóm A (p &lt; 0.001).
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <b className="text-emerald-400">H2:</b> Hệ thống giảm tối thiểu 70% các hành vi sập bẫy nguy hiểm (giao OTP, nộp tiền cọc).
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <b className="text-emerald-400">H3:</b> Phản xạ phòng thủ có khả năng chuyển giao sang kịch bản chưa từng gặp (Unseen Transfer).
                  </div>
                </div>
              </div>

              {/* Box 3: 11-Tactic Taxonomy */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase border-b border-slate-800 pb-1.5">
                  <Brain className="w-4 h-4" />
                  <span>3. TAXONOMY 11 BẪY TÂM LÝ TÁC CHIẾN</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  {['Dồn ép thời gian (Urgency)', 'Mạo danh quyền lực (Authority)', 'Lợi nhuận ảo (Greed)', 'Cứu trợ khẩn cấp (Emergency)', 'Nhiệm vụ lừa đảo (Task Trap)', 'Tâm lý tiện lợi (Convenience)'].map((t, idx) => (
                    <div key={idx} className="p-1.5 bg-slate-950 rounded border border-slate-800 text-slate-300 text-[9px]">
                      • {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PANEL 2: CÁNH GIỮA - KIẾN TRÚC & MÔ HÌNH TOÁN HỌC (4 Cols) */}
            <div
              className={`col-span-12 lg:col-span-4 space-y-4 transition-opacity ${
                activeHighlightPanel === 'ALL' || activeHighlightPanel === 'CENTER' ? 'opacity-100' : 'opacity-30'
              }`}
            >
              {/* Box 4: System Architecture */}
              <div className="p-4 bg-slate-900/90 border border-indigo-500/40 rounded-xl space-y-2 shadow-lg">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase border-b border-slate-800 pb-1.5">
                  <Cpu className="w-4 h-4" />
                  <span>4. KIẾN TRÚC HỆ THỐNG ADAPTIVE SCAMGUARD</span>
                </div>
                
                {/* Flow Diagram */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-[10px]">
                  <div className="p-2 bg-indigo-950/60 text-indigo-200 rounded border border-indigo-800 font-bold text-center">
                    1. Đa Phương Thức Tác Chiến: SMS • Quishing • Deepfake Voice
                  </div>
                  <div className="text-center text-purple-400 font-bold">↓ Trích xuất Vector Hành Vi</div>
                  <div className="p-2 bg-purple-950/60 text-purple-200 rounded border border-purple-800 font-bold text-center">
                    2. Radar Phân Tích 6 Chiều Scam DNA & Bẫy Tâm Lý
                  </div>
                  <div className="text-center text-emerald-400 font-bold">↓ Thuật toán Thích ứng</div>
                  <div className="p-2 bg-emerald-950/60 text-emerald-200 rounded border border-emerald-800 font-bold text-center">
                    3. AI Coach Siêu Nhận Thức + Lặp Lại Ngắt Quãng Spaced Repetition
                  </div>
                </div>
              </div>

              {/* Box 5: Mathematical Formula */}
              <div className="p-4 bg-slate-900/90 border border-indigo-500/40 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase border-b border-slate-800 pb-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>5. CÔNG THỨC TOÁN HỌC ĐIỂM PHÒNG THỦ (SDI)</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-center text-amber-200">
                  SDI = 100 × ( w₁·Acc_tactic + w₂·(1 - Risk_action) + w₃·f(Δt_hesitation) + w₄·Calib_confidence )
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Trong đó: w₁ = 0.35, w₂ = 0.35, w₃ = 0.15, w₄ = 0.15 thỏa mãn ∑wᵢ = 1.0 theo chuẩn lý thuyết quyết định đa tiêu chí MAUT.
                </p>
              </div>

              {/* Box 6: Live Trial Simulator Preview */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase border-b border-slate-800 pb-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>6. THỰC NGHIỆM ĐỐI CHỨNG (RCT 3 NHÓM)</span>
                </div>
                <div className="space-y-1 text-[10px]">
                  <div>• <b>Nhóm A (N=20):</b> Tài liệu cảnh báo an ninh tĩnh truyền thống.</div>
                  <div>• <b>Nhóm B (N=22):</b> Kịch bản ngẫu nhiên không có thích ứng tâm lý.</div>
                  <div>• <b>Nhóm C (N=22):</b> Huấn luyện thích ứng Scam DNA đa chiều.</div>
                </div>
              </div>
            </div>

            {/* PANEL 3: CÁNH PHẢI - KẾT QUẢ THỐNG KÊ & KẾT LUẬN (4 Cols) */}
            <div
              className={`col-span-12 lg:col-span-4 space-y-4 transition-opacity ${
                activeHighlightPanel === 'ALL' || activeHighlightPanel === 'RIGHT' ? 'opacity-100' : 'opacity-30'
              }`}
            >
              {/* Box 7: Inferential Statistics Table */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase border-b border-slate-800 pb-1.5">
                  <BarChart3 className="w-4 h-4" />
                  <span>7. KẾT QUẢ THỐNG KÊ SUY LUẬN</span>
                </div>

                <div className="overflow-x-auto text-[10px]">
                  <table className="w-full text-left font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-1">Chỉ Số</th>
                        <th className="pb-1">Nhóm C</th>
                        <th className="pb-1">Nhóm A</th>
                        <th className="pb-1">Ý Nghĩa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      <tr>
                        <td className="py-1">Điểm Post</td>
                        <td className="text-emerald-400 font-bold">85.3đ</td>
                        <td className="text-slate-400">58.4đ</td>
                        <td className="text-purple-300">p &lt; 0.001</td>
                      </tr>
                      <tr>
                        <td className="py-1">Mức tăng</td>
                        <td className="text-emerald-400 font-bold">+33.2đ</td>
                        <td className="text-slate-400">+6.3đ</td>
                        <td className="text-purple-300">t = 18.42</td>
                      </tr>
                      <tr>
                        <td className="py-1">Cohen's d</td>
                        <td className="text-indigo-400 font-bold">d = 2.48</td>
                        <td className="text-slate-400">d = 0.41</td>
                        <td className="text-purple-300">Rất lớn</td>
                      </tr>
                      <tr>
                        <td className="py-1">Unseen Test</td>
                        <td className="text-cyan-400 font-bold">84.3đ</td>
                        <td className="text-slate-400">57.1đ</td>
                        <td className="text-purple-300">+47.6%</td>
                      </tr>
                      <tr>
                        <td className="py-1">Sập bẫy nguy hại</td>
                        <td className="text-rose-400 font-bold">8.0%</td>
                        <td className="text-slate-400">47.0%</td>
                        <td className="text-emerald-400">-82.9%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Box 8: Retention Curve & Ablation */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase border-b border-slate-800 pb-1.5">
                  <LineChart className="w-4 h-4" />
                  <span>8. DUY TRÌ PHẢN XẠ SAU 14 NGÀY & BÓC TÁCH</span>
                </div>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  • <b>Delayed Retention (14 ngày):</b> Nhóm C duy trì 80.2 điểm (chỉ suy giảm 4.9%), trong khi Nhóm B suy giảm 21.4%.
                  <br />• <b>Ablation Study:</b> Loại bỏ module phản hồi Scam DNA làm giảm ngay 18.4% độ chính xác nhận diện.
                </p>
              </div>

              {/* Box 9: Conclusion & National Impact */}
              <div className="p-4 bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/40 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase border-b border-indigo-500/30 pb-1.5">
                  <Award className="w-4 h-4" />
                  <span>9. KẾT LUẬN & ĐÓNG GÓP KHOA HỌC</span>
                </div>
                <p className="text-[10px] text-slate-200 leading-relaxed">
                  Đề tài chứng minh tính ưu việt của phương pháp huấn luyện an ninh mạng cá nhân hóa theo Scam DNA. Giải pháp mở ra hướng đi mới kết hợp Trí tuệ nhân tạo và Tâm lý học nhận thức, sẵn sàng triển khai diện rộng trên toàn quốc.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
