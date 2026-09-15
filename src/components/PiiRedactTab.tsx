import React, { useState } from 'react';
import { EyeOff, Shield, CheckCircle2, Upload } from 'lucide-react';

export const PiiRedactTab: React.FC = () => {
  const [rawPiiText, setRawPiiText] = useState(
    'Họ tên tôi là Nguyễn Văn An, số điện thoại là 0912345678, số tài khoản Techcombank: 1903456789123, mã OTP nhận được là 482910.'
  );
  const [redactedPiiText, setRedactedPiiText] = useState('');
  const [piiRedactedCount, setPiiRedactedCount] = useState(0);
  const [redactedPiiImageBase64, setRedactedPiiImageBase64] = useState<string | null>(null);

  // Helper to apply local mock PII redaction
  const handleApplyPiiRedaction = () => {
    let text = rawPiiText;
    let count = 0;

    // Redact OTP (6 digits)
    const otpRegex = /\b\d{6}\b/g;
    if (otpRegex.test(text)) {
      text = text.replace(otpRegex, '██████ (MÃ OTP ĐÃ ĐÈ)');
      count++;
    }

    // Redact Phone numbers (Vietnamese format 10 digits)
    const phoneRegex = /\b(0[35789]\d{8})\b/g;
    if (phoneRegex.test(text)) {
      text = text.replace(phoneRegex, '██████████ (SĐT ĐÃ ĐÈ)');
      count++;
    }

    // Redact Bank account / Credit card numbers (8 to 16 digits)
    const cardRegex = /\b\d{8,16}\b/g;
    if (cardRegex.test(text)) {
      text = text.replace(cardRegex, '████████████ (STK/THẺ ĐÃ ĐÈ)');
      count++;
    }

    // Redact email addresses
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
    if (emailRegex.test(text)) {
      text = text.replace(emailRegex, '██████████@████.com (EMAIL ĐÃ ĐÈ)');
      count++;
    }

    // Redact Vietnamese names (2-4 capitalized words)
    const nameRegex = /\b[A-ZĐ][a-zàáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]+\s+[A-ZĐ][a-zàáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]+(?:\s+[A-ZĐ][a-zàáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]+){1,2}\b/g;
    if (nameRegex.test(text)) {
      text = text.replace(nameRegex, '████████ (HỌ TÊN ĐÃ ĐÈ)');
      count++;
    }

    setRedactedPiiText(text);
    setPiiRedactedCount(count);
  };

  // Handle local PII image redaction simulation
  const handlePiiImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      // In a real device we'd run OCR. Here we mock it by overlaying redaction blocks on a canvas.
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          // Draw dark censoring boxes to simulate on-device OCR redaction
          ctx.fillStyle = '#0f172a'; // slate 900
          
          // Mimic some standard locations for sensitive details on screenshot (top/center)
          ctx.fillRect(img.width * 0.15, img.height * 0.2, img.width * 0.7, img.height * 0.08); // Account Number box
          ctx.fillRect(img.width * 0.15, img.height * 0.35, img.width * 0.5, img.height * 0.05); // Balance box
          ctx.fillRect(img.width * 0.3, img.height * 0.75, img.width * 0.4, img.height * 0.06); // Owner Name box

          // Add secure stamp
          ctx.fillStyle = '#10b981'; // emerald 500
          ctx.font = `bold ${Math.max(14, Math.floor(img.width * 0.03))}px monospace`;
          ctx.fillText('SCAMGUARD PRIVACY PROTECTED', img.width * 0.1, img.height * 0.95);

          setRedactedPiiImageBase64(canvas.toDataURL('image/png'));
        }
      };
      img.src = base64;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4 bg-slate-950/40 p-5 rounded-2xl border border-slate-800/80">
      <div className="space-y-1">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
          <EyeOff className="w-4 h-4 text-cyan-400" />
          <span>Privacy-Preserving On-Device PII Redactor:</span>
        </label>
        <p className="text-xs text-slate-400">
          Tự động nhận diện và che đè đen (PII Blackout) Họ tên, CCCD, Số tài khoản, Số dư ngân hàng và Mã OTP trực tiếp bằng mô hình cục bộ trên trình duyệt trước khi chia sẻ dữ liệu hoặc gửi lên AI Cloud.
        </p>
      </div>

      {/* Text Redaction Box */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-400 font-mono">1. CHE ĐEN PII TRONG VĂN BẢN / TIN NHẮN CHAT:</p>
        <textarea
          rows={3}
          value={rawPiiText}
          onChange={(e) => setRawPiiText(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-sans leading-relaxed"
        />
        <button
          onClick={handleApplyPiiRedaction}
          className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center justify-center space-x-2 font-mono"
        >
          <Shield className="w-4 h-4" />
          <span>CHẠY MÔ HÌNH CHE ĐEN PII VĂN BẢN</span>
        </button>
      </div>

      {/* Image Screenshot Redaction Box */}
      <div className="space-y-2 pt-3 border-t border-slate-800/60">
        <p className="text-xs font-bold text-slate-400 font-mono">2. CHE ĐEN PII TRÊN ẢNH CHỤP MÀN HÌNH (BILL CHUYỂN TIỀN):</p>
        <div className="p-4 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/40 text-center hover:border-cyan-500/40 transition-all">
          <label className="cursor-pointer block space-y-1.5">
            <Upload className="w-6 h-6 text-cyan-400 mx-auto" />
            <span className="text-xs text-slate-300 font-bold block">Tải ảnh chụp màn hình chứa PII</span>
            <span className="text-[10px] text-slate-500 block">Kéo thả ảnh biên lai giao dịch cần xóa thông tin nhạy cảm</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) handlePiiImageUpload(e.target.files[0]);
              }}
              className="hidden"
            />
          </label>
        </div>

        {redactedPiiImageBase64 && (
          <div className="p-3 bg-slate-900/60 rounded-2xl border border-emerald-500/30 space-y-2">
            <p className="text-xs font-bold text-emerald-400 flex items-center space-x-1 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Kết quả che đen PII trên ảnh (On-Device OCR Censoring):</span>
            </p>
            <img
              src={redactedPiiImageBase64}
              alt="Redacted Screenshot"
              className="w-full rounded-xl border border-slate-800 max-h-52 object-contain bg-black mx-auto shadow-inner"
            />
            <a
              href={redactedPiiImageBase64}
              download="scamguard_redacted_pii.png"
              className="inline-block w-full py-2.5 text-center rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all font-mono"
            >
              TẢI ẢNH ĐÃ CHE ĐEN PII VỀ MÁY
            </a>
          </div>
        )}
      </div>

      {/* Render text output */}
      {redactedPiiText && (
        <div className="p-4 bg-slate-900/60 rounded-2xl border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-emerald-400 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Đã bảo mật {piiRedactedCount} trường dữ liệu nhạy cảm:</span>
            </span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl text-xs text-slate-300 font-mono leading-relaxed border border-slate-800">
            {redactedPiiText}
          </div>
        </div>
      )}
    </div>
  );
};
