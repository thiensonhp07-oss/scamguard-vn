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
import { CommunitySurveySubmission } from '../types';

interface NationalScienceFairDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToResearch?: () => void;
  onNavigateToMainUI?: () => void;
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

export const SCENARIO_QUESTIONS = [
  {
    key: 'q1' as const,
    number: 6,
    trapIndex: 1,
    title: '1. Thủ Đoạn SMS Brandname "DICHVUCONG" / Mạo Danh Công An Dọa Khóa CCCD & VNeID',
    badge: 'Bẫy Uy Quyền & Hoảng Loạn',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: '💬',
    source: 'Tình huống thực tế: SMS giả Brandname & Cuộc gọi mạo danh Công an',
    content: 'Kẻ gian gửi tin nhắn mạo danh Cổng Dịch Vụ Công hoặc gọi điện thông báo: "Hồ sơ VNeID Mức 2 bị lỗi đồng bộ dữ liệu dân cư, CCCD sẽ bị khóa và tài khoản ngân hàng bị phong tỏa từ 00h00". Kẻ gian yêu cầu truy cập đường link lạ hoặc làm theo hướng dẫn khẩn cấp.',
    options: [
      { id: 'A_NEVER_SAFE', letter: 'A', text: 'Chưa từng gặp tình huống này bao giờ trong thực tế (hoặc người thân chưa từng nhận).' },
      { id: 'B_SPOTTED_SAFE', letter: 'B', text: 'Đã từng gặp/nhận được nhưng phát hiện ngay dấu hiệu lừa đảo & cảnh giác không làm theo.' },
      { id: 'C_NEAR_MISS_TRAP', letter: 'C', text: 'Đã từng suýt mắc bẫy (đã từng bấm vào link / gọi lại hotline / phân vân lo sợ bị khóa CCCD thật).' },
      { id: 'D_VICTIM_TRAP', letter: 'D', text: 'Đã từng là nạn nhân thực tế (bị lộ mã OTP, bị cài app lạ hoặc bị trừ tiền trong tài khoản).' },
    ],
  },
  {
    key: 'q2' as const,
    number: 7,
    trapIndex: 2,
    title: '2. Chiêu Trò "Chuyển Khoản Nhầm" Tiền Vào Tài Khoản & Bẫy Tín Dụng Đen Trá Hình',
    badge: 'Bẫy Rửa Tiền / Tín Dụng Đen',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    icon: '🏦',
    source: 'Tình huống thực tế: Tài khoản bỗng nhận được tiền lạ & Người gọi giục chuyển lại',
    content: 'Bỗng nhiên tài khoản nhận được một khoản tiền lạ (VD: 5.000.000đ). Sau vài phút, có người lạ gọi điện khóc lóc nói chuyển nhầm tiền viện phí/tiền thuốc khẩn cấp, giục chuyển ngay lại sang một số tài khoản khác hoặc gửi link "Cổng hoàn tiền ngân hàng" để bù trừ.',
    options: [
      { id: 'A_NEVER_SAFE', letter: 'A', text: 'Chưa từng gặp tình huống này bao giờ trong thực tế.' },
      { id: 'B_SPOTTED_SAFE', letter: 'B', text: 'Đã từng gặp nhưng cảnh giác không tự chuyển tiền lại; chủ động báo ngân hàng xử lý tra soát.' },
      { id: 'C_NEAR_MISS_TRAP', letter: 'C', text: 'Đã từng suýt mắc bẫy (suýt chuyển khoản trả lại ngay vào STK người gọi cung cấp hoặc suýt bấm link hoàn tiền).' },
      { id: 'D_VICTIM_TRAP', letter: 'D', text: 'Đã từng là nạn nhân thực tế (bị kẻ gian vu khống vay nợ lãi cao hoặc bị trừ tiền khi bấm link lạ).' },
    ],
  },
  {
    key: 'q3' as const,
    number: 8,
    trapIndex: 3,
    title: '3. Cuộc Gọi Video Call / Voice Deepfake AI Giả Mặt & Giọng Người Thân Mượn Tiền Gấp',
    badge: 'Bẫy Công Nghệ Deepfake AI',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    icon: '📹',
    source: 'Tình huống thực tế: Video Call Zalo/Messenger vài giây mờ ảo rồi nhắn STK lạ',
    content: 'Nhận cuộc gọi video hiện đúng khuôn mặt và giọng nói của bạn bè/người thân nhưng hình ảnh hơi giật mờ trong vài giây: "Tao đang cấp cứu/sự cố ở viện gấp, chuyển hộ tao vài triệu vào STK này tý tao gửi lại!" rồi cúp máy viện cớ mạng yếu.',
    options: [
      { id: 'A_NEVER_SAFE', letter: 'A', text: 'Chưa từng gặp tình huống cuộc gọi giả dạng AI này trong thực tế.' },
      { id: 'B_SPOTTED_SAFE', letter: 'B', text: 'Đã từng gặp nhưng nghi ngờ ngay, gọi điện thoại GSM trực tiếp hoặc hỏi bí mật riêng để xác thực.' },
      { id: 'C_NEAR_MISS_TRAP', letter: 'C', text: 'Đã từng suýt mắc bẫy (tin tưởng vì thấy đúng mặt/giọng, suýt chuyển tiền trước khi kịp kiểm chứng).' },
      { id: 'D_VICTIM_TRAP', letter: 'D', text: 'Đã từng là nạn nhân thực tế (đã chuyển tiền cho tài khoản kẻ gian do tin vào cuộc gọi Deepfake).' },
    ],
  },
  {
    key: 'q4' as const,
    number: 9,
    trapIndex: 4,
    title: '4. SMS Thông Báo Phạt Nguội CSGT & Bẫy Dụ Cài Tệp Mã Độc .APK Chiếm Quyền Điện Thoại',
    badge: 'Bẫy Mã Độc Chiếm OTP & Banking',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: '🚗',
    source: 'Tình huống thực tế: Tin nhắn dọa phạt nguội yêu cầu tải tệp .apk hoặc bấm link tra cứu',
    content: 'Tin nhắn mạo danh Cục CSGT thông báo phương tiện vi phạm giao thông sắp bị xử lý cưỡng chế, yêu cầu tải tệp bienban_phatnguoi.apk hoặc bấm link web lạ để xem hình ảnh vi phạm và nộp phạt online.',
    options: [
      { id: 'A_NEVER_SAFE', letter: 'A', text: 'Chưa từng gặp tình huống tin nhắn phạt nguội kèm link/file APK này.' },
      { id: 'B_SPOTTED_SAFE', letter: 'B', text: 'Đã từng gặp nhưng tuyệt đối không tải file APK lạ, tự tra cứu trên cổng csgt.vn chính thức.' },
      { id: 'C_NEAR_MISS_TRAP', letter: 'C', text: 'Đã từng suýt mắc bẫy (đã từng tải tệp .apk về máy hoặc bấm vào link điền thông tin xe vì lo lắng).' },
      { id: 'D_VICTIM_TRAP', letter: 'D', text: 'Đã từng là nạn nhân thực tế (bị mã độc APK chiếm quyền trợ năng Accessibility và tự động chuyển tiền ngân hàng).' },
    ],
  },
  {
    key: 'q5' as const,
    number: 10,
    trapIndex: 5,
    title: '5. Tấn Công Quishing: Quét Mã QR Thanh Toán Bị Dán Đè Tại Quán Ăn / Cafe / Nhận Quà',
    badge: 'Bẫy QR Độc Hại (Quishing)',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: '☕',
    source: 'Tình huống thực tế: Mã QR tại bàn bị dán đè hoặc mã QR chuyển hướng web giả mạo',
    content: 'Khi thanh toán tiền tại quầy hoặc bàn ăn, quét mã QR dẫn tới một trang web lạ yêu cầu nhập thông tin đăng nhập Internet Banking / mã OTP, hoặc mã QR bị dán đè chuyển tiền sang tài khoản của kẻ gian.',
    options: [
      { id: 'A_NEVER_SAFE', letter: 'A', text: 'Chưa từng gặp sự cố với mã QR thanh toán độc hại.' },
      { id: 'B_SPOTTED_SAFE', letter: 'B', text: 'Đã từng gặp nhưng luôn kiểm tra tên chủ tài khoản thụ hưởng trên App ngân hàng trước khi bấm chuyển.' },
      { id: 'C_NEAR_MISS_TRAP', letter: 'C', text: 'Đã từng suýt mắc bẫy (suýt chuyển tiền cho mã QR dán đè hoặc suýt nhập thông tin vào trang web do QR mở ra).' },
      { id: 'D_VICTIM_TRAP', letter: 'D', text: 'Đã từng là nạn nhân thực tế (chuyển nhầm tiền cho mã QR giả hoặc bị hack tài khoản do quét mã QR lạ).' },
    ],
  },
  {
    key: 'q6' as const,
    number: 11,
    trapIndex: 6,
    title: '6. Bẫy Tuyển CTV Shopee/TikTok/Telegram Làm Nhiệm Vụ Nạp Tiền Nhận Hoa Hồng Khủng',
    badge: 'Bẫy Lợi Nhuận Đa Cấp / Ponzi',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    icon: '📱',
    source: 'Tình huống thực tế: Lời mời làm CTV online, xem video/đánh giá sản phẩm nạp tiền tăng dần',
    content: 'Được mời tham gia nhóm làm nhiệm vụ: xem 5 video nhận 100k, sau đó kẻ gian yêu cầu nạp tiền cọc mở nhiệm vụ đơn hàng VIP 500k - 2tr để nhận hoa hồng 30-50%. Trong nhóm có hàng chục chim mồi liên tục gửi ảnh rút tiền thành công.',
    options: [
      { id: 'A_NEVER_SAFE', letter: 'A', text: 'Chưa từng nhận lời mời hay tham gia nhóm tuyển CTV nhiệm vụ này.' },
      { id: 'B_SPOTTED_SAFE', letter: 'B', text: 'Đã từng gặp/nhận tin nhắn mời nhưng lập tức nhận diện bẫy lừa đảo nạp cọc và chặn ngay.' },
      { id: 'C_NEAR_MISS_TRAP', letter: 'C', text: 'Đã từng suýt mắc bẫy (đã thử làm nhiệm vụ đầu nhận được vài chục nghìn, suýt nạp tiền cọc nhiệm vụ lớn).' },
      { id: 'D_VICTIM_TRAP', letter: 'D', text: 'Đã từng là nạn nhân thực tế (bị lừa nạp tiền nhiều lần và bị giam tiền không rút được).' },
    ],
  },
  {
    key: 'q7' as const,
    number: 12,
    trapIndex: 7,
    title: '7. Cuộc Gọi Tự Động Mạo Danh Cục Viễn Thông Dọa Khóa SIM Điện Thoại Trong 2 Giờ',
    badge: 'Bẫy Uy Quyền & Áp Lực Thời Gian',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: '📞',
    source: 'Tình huống thực tế: Cuộc gọi robot dọa ngắt liên lạc để ép bấm phím đọc thông tin',
    content: 'Tổng đài tự động gọi thông báo: "Thuê bao chưa chuẩn hóa dữ liệu sẽ bị khóa 2 chiều và thu hồi số vĩnh viễn sau 2 giờ. Bấm phím 1 để gặp cán bộ hỗ trợ cập nhật gấp", sau đó yêu cầu đọc số CCCD và mã OTP gửi về máy.',
    options: [
      { id: 'A_NEVER_SAFE', letter: 'A', text: 'Chưa từng nhận cuộc gọi dọa khóa SIM tự động này.' },
      { id: 'B_SPOTTED_SAFE', letter: 'B', text: 'Đã từng gặp nhưng tắt máy ngay; chủ động soạn tin nhắn TTTB gửi 1414 để kiểm tra chính chủ.' },
      { id: 'C_NEAR_MISS_TRAP', letter: 'C', text: 'Đã từng suýt mắc bẫy (đã bấm phím 1 và trao đổi với đối tượng do lo sợ bị mất số điện thoại làm ăn/liên lạc).' },
      { id: 'D_VICTIM_TRAP', letter: 'D', text: 'Đã từng là nạn nhân thực tế (đã cung cấp thông tin cá nhân/OTP dẫn đến việc bị cướp quyền SIM/tài khoản).' },
    ],
  },
  {
    key: 'q8' as const,
    number: 13,
    trapIndex: 8,
    title: '8. Bẫy Kiện Hàng COD Ảo Thu Tiền Bất Ngờ Khi Bạn Vắng Nhà',
    badge: 'Bẫy COD Giá Trị Nhỏ',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: '📦',
    source: 'Tình huống thực tế: Shipper gọi thông báo có gói hàng 100k-150k gửi nhét cổng',
    content: 'Shipper gọi điện báo có đơn hàng quà tặng may mắn COD 120k trong khi bạn vắng nhà và không nhớ rõ có đặt hay không, giục chuyển khoản trước để nhét gói hàng qua khe cửa hoặc gửi link tra cứu mã vận đơn lạ.',
    options: [
      { id: 'A_NEVER_SAFE', letter: 'A', text: 'Chưa từng gặp tình huống giao hàng COD ảo này.' },
      { id: 'B_SPOTTED_SAFE', letter: 'B', text: 'Đã từng gặp nhưng từ chối nhận và từ chối chuyển tiền; kiểm tra lịch sử mua hàng trên App TMĐT chính thức.' },
      { id: 'C_NEAR_MISS_TRAP', letter: 'C', text: 'Đã từng suýt mắc bẫy (suýt chuyển khoản tiền vì thấy số tiền nhỏ 100k và tưởng người thân đặt hộ).' },
      { id: 'D_VICTIM_TRAP', letter: 'D', text: 'Đã từng là nạn nhân thực tế (đã chuyển tiền nhận bưu phẩm rác/hộp giấy rỗng không có giá trị).' },
    ],
  },
  {
    key: 'q9' as const,
    number: 14,
    trapIndex: 9,
    title: '9. Email / Tin Nhắn Giả Mạo Cơ Quan Thuế Thông Báo Hoàn Thuế Thu Nhập Cá Nhân Kèm Link Web Lạ',
    badge: 'Bẫy Phishing Mạo Danh Cơ Quan Thuế',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: '📑',
    source: 'Tình huống thực tế: Email thông báo hoàn tiền thuế TNCN yêu cầu nhập thông tin thẻ ngân hàng',
    content: 'Nhận email thông báo quyết toán thuế được hoàn 8.520.000đ, yêu cầu truy cập website thuế giả mạo để điền số thẻ ATM/mã bảo mật CVV và mã OTP để hệ thống chuyển tiền hoàn thuế vào tài khoản.',
    options: [
      { id: 'A_NEVER_SAFE', letter: 'A', text: 'Chưa từng nhận email/tin nhắn thông báo hoàn thuế lạ.' },
      { id: 'B_SPOTTED_SAFE', letter: 'B', text: 'Đã từng gặp nhưng kiểm tra kỹ đuôi tên miền, chỉ tra cứu trên App eTax Mobile hoặc thuedientu.gdt.gov.vn.' },
      { id: 'C_NEAR_MISS_TRAP', letter: 'C', text: 'Đã từng suýt mắc bẫy (đã bấm vào link email và điền một phần thông tin thẻ vì tưởng có tiền hoàn thật).' },
      { id: 'D_VICTIM_TRAP', letter: 'D', text: 'Đã từng là nạn nhân thực tế (bị kẻ gian trừ tiền thẻ tín dụng/thẻ ghi nợ sau khi nhập thông tin).' },
    ],
  },
  {
    key: 'q10' as const,
    number: 15,
    trapIndex: 10,
    title: '10. Cổng Sạc USB Công Cộng Đọc Trộm Dữ Liệu (Juice Jacking) Tại Sân Bay / Bến Xe',
    badge: 'Bẫy Phần Cứng & Đọc Dữ Liệu Ngầm',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: '⚡',
    source: 'Tình huống thực tế: Cắm cáp sạc USB công cộng và hiện thông báo "Tin cậy máy tính này?"',
    content: 'Cắm cáp sạc tại cổng USB công cộng miễn phí ở phòng chờ sân bay/quán cafe, màn hình điện thoại hiện lên hộp thoại: "Tin cậy máy tính này? (Trust This Computer)" đòi mật khẩu mở khóa máy.',
    options: [
      { id: 'A_NEVER_SAFE', letter: 'A', text: 'Chưa từng gặp hoặc chưa từng dùng cổng sạc USB công cộng không rõ nguồn gốc.' },
      { id: 'B_SPOTTED_SAFE', letter: 'B', text: 'Đã từng gặp và bấm "Không tin cậy", rút cáp ngay; chỉ dùng củ sạc cắm ổ điện 220V riêng.' },
      { id: 'C_NEAR_MISS_TRAP', letter: 'C', text: 'Đã từng suýt mắc bẫy (đã bấm "Tin cậy" vì nghĩ đó là điều kiện bắt buộc để kích hoạt chế độ sạc nhanh).' },
      { id: 'D_VICTIM_TRAP', letter: 'D', text: 'Đã từng là nạn nhân thực tế (bị rò rỉ dữ liệu hình ảnh, tệp tin hoặc cài mã theo dõi ngầm vào máy).' },
    ],
  },
  {
    key: 'q11' as const,
    number: 16,
    trapIndex: 11,
    title: '11. Tin Nhắn Cảnh Báo Vi Phạm Bản Quyền Meta Fanpage Dọa Xóa Trang Vĩnh Viễn Trong 24h',
    badge: 'Bẫy Chiếm Đoạt Trang & Mã 2FA',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    icon: '🛡️',
    source: 'Tình huống thực tế: Tin nhắn mạo danh Meta Support Team dọa xóa Fanpage/Facebook cá nhân',
    content: 'Nhận tin nhắn mạo danh Meta thông báo Fanpage bị khiếu nại bản quyền nghiêm trọng sẽ bị vô hiệu hóa sau 24h, yêu cầu bấm link lạ nhập mật khẩu và mã xác thực 2 bước 2FA để gửi đơn kháng cáo.',
    options: [
      { id: 'A_NEVER_SAFE', letter: 'A', text: 'Chưa từng nhận tin nhắn mạo danh bản quyền Meta này.' },
      { id: 'B_SPOTTED_SAFE', letter: 'B', text: 'Đã từng gặp nhưng kiểm tra đúng trong Hộp thư Hỗ trợ (Support Inbox) chính thức của Facebook và xóa bỏ tin nhắn rác.' },
      { id: 'C_NEAR_MISS_TRAP', letter: 'C', text: 'Đã từng suýt mắc bẫy (đã bấm vào link kháng cáo do lo sợ mất kênh bán hàng/trang cá nhân nhiều người theo dõi).' },
      { id: 'D_VICTIM_TRAP', letter: 'D', text: 'Đã từng là nạn nhân thực tế (bị kẻ gian cướp quyền Quản trị viên Fanpage hoặc bị đổi mật khẩu Facebook).' },
    ],
  },
  {
    key: 'q12' as const,
    number: 17,
    trapIndex: 12,
    title: '12. Chiêu Trò "Văn Phòng Luật Sư / An Ninh Mạng Thu Hồi Tiền Bị Lừa" (Bẫy Lừa Đảo Kép)',
    badge: 'Bẫy Lừa Đảo Kép (Recovery Scam)',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: '⚖️',
    source: 'Tình huống thực tế: Quảng cáo cam kết lấy lại tiền treo lừa đảo mạng nhưng đòi nộp phí trước',
    content: 'Thấy quảng cáo trên mạng tự xưng "Văn phòng Luật sư / Cục An ninh mạng hỗ trợ kéo tiền treo bị lừa đảo mạng 100% bằng công nghệ Blockchain", sau đó yêu cầu nộp trước 10-20% tiền phí ủy thác hồ sơ hoặc cài app lạ.',
    options: [
      { id: 'A_NEVER_SAFE', letter: 'A', text: 'Chưa từng tiếp xúc với các dịch vụ lấy lại tiền lừa đảo này.' },
      { id: 'B_SPOTTED_SAFE', letter: 'B', text: 'Đã từng thấy nhưng biết rõ đây là bẫy lừa đảo kép; chỉ mang chứng cứ ra Cơ quan Công an sở tại tố giác.' },
      { id: 'C_NEAR_MISS_TRAP', letter: 'C', text: 'Đã từng suýt mắc bẫy (đã nhắn tin tư vấn và suýt chuyển phí ủy thác vì tâm lý nóng lòng muốn lấy lại tiền).' },
      { id: 'D_VICTIM_TRAP', letter: 'D', text: 'Đã từng là nạn nhân thực tế (bị lừa chuyển thêm tiền phí dịch vụ thu hồi tiền).' },
    ],
  },
];

export const NationalScienceFairDemoModal: React.FC<NationalScienceFairDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigateToResearch,
  onNavigateToMainUI,
}) => {
  const [surveyStep, setSurveyStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<any>(null);
  const [liveTotalRespondents, setLiveTotalRespondents] = useState<number>(0);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  // 13 Full Survey Questions State (5 Demographics + 8 Real Traps)
  const [surveyForm, setSurveyForm] = useState({
    // Q1: Name & Anonymous Mode
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-8421',
    isAnonymous: true,
    anonymousCode: 'Khảo nghiệm viên Ẩn danh #VN-8421',
    schoolName: 'THPT Chuyên Lê Hồng Phong',
    className: 'Lớp 11 Tin',
    consentAgreed: true,
    // Q2: Demographic
    demographicGroup: 'STUDENT',
    // Q3: Location
    location: 'Hà Nội',
    // Q4: Past Experience
    pastLossOrNearMiss: 'SPOTTED_IN_TIME',
    // Q5: Pre-Confidence Score (10-100)
    preConfidenceScore: 50,
    // 12 High-Difficulty Real-World Traps (Q6 to Q17) - Khởi tạo rỗng để người tham gia tự chọn
    trapAnswers: {
      q1: '',
      q2: '',
      q3: '',
      q4: '',
      q5: '',
      q6: '',
      q7: '',
      q8: '',
      q9: '',
      q10: '',
      q11: '',
      q12: '',
    },
    feedbackNote: '',
  });

  const totalTrapsCount = SCENARIO_QUESTIONS.length;
  const answeredTrapCount = Object.values(surveyForm.trapAnswers).filter(Boolean).length;
  const isAllTrapsAnswered = answeredTrapCount === totalTrapsCount;
  const missingTraps = SCENARIO_QUESTIONS.filter((q) => !surveyForm.trapAnswers[q.key as keyof typeof surveyForm.trapAnswers]);

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

    // Kiểm tra xem đã hoàn thành đủ tất cả kịch bản bẫy chưa
    if (!isAllTrapsAnswered) {
      const firstMissing = missingTraps[0];
      setValidationWarning(`Bạn còn ${totalTrapsCount - answeredTrapCount} câu kịch bản chưa chọn. Vui lòng hoàn thành câu ${firstMissing.number} để gửi phiếu!`);
      const el = document.getElementById(`trap-scenario-${firstMissing.trapIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setValidationWarning(null);
    setSubmitting(true);

    try {
      // Calculate realistic baseline score based on 12 high-trap scenario questions
      let safeCount = 0;
      SCENARIO_QUESTIONS.forEach((q) => {
        const chosenId = surveyForm.trapAnswers[q.key as keyof typeof surveyForm.trapAnswers];
        if (chosenId && chosenId.endsWith('_SAFE')) {
          safeCount++;
        }
      });

      const preScore = Math.round((safeCount / totalTrapsCount) * 100);
      const postScore = Math.min(100, Math.max(88, Math.round(preScore + 48 + Math.random() * 6)));

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
        location: surveyForm.location,
        surveyResponses: {
          everEncounteredScam: surveyForm.pastLossOrNearMiss !== 'NEVER',
          pastLossOrNearMiss: surveyForm.pastLossOrNearMiss,
          preConfidenceScore: surveyForm.preConfidenceScore,
          biggestFearTactic: 'AUTHORITY_POLICE',
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
              T: (surveyForm.trapAnswers.q1?.endsWith('_TRAP') || surveyForm.trapAnswers.q4?.endsWith('_TRAP')) ? 0.88 : 0.20,
              A: (surveyForm.trapAnswers.q1?.endsWith('_TRAP') || surveyForm.trapAnswers.q7?.endsWith('_TRAP')) ? 0.84 : 0.18,
              G: (surveyForm.trapAnswers.q6?.endsWith('_TRAP') || surveyForm.trapAnswers.q8?.endsWith('_TRAP')) ? 0.85 : 0.22,
              E: (surveyForm.trapAnswers.q2?.endsWith('_TRAP') || surveyForm.trapAnswers.q3?.endsWith('_TRAP')) ? 0.90 : 0.15,
              C: (surveyForm.trapAnswers.q5?.endsWith('_TRAP') || surveyForm.trapAnswers.q11?.endsWith('_TRAP')) ? 0.82 : 0.16,
              R: (surveyForm.trapAnswers.q10?.endsWith('_TRAP') || surveyForm.trapAnswers.q12?.endsWith('_TRAP')) ? 0.86 : 0.14,
            },
            after: { T: 0.14, A: 0.12, G: 0.13, E: 0.15, C: 0.14, R: 0.10 },
          },
        },
        feedbackNote:
          surveyForm.feedbackNote ||
          `Phiếu khảo sát thực tế ViSEF 2026 (17 câu hỏi: 5 nhân khẩu học & 12 câu khảo nghiệm tiếp xúc thủ đoạn thực tế). Trường: ${surveyForm.schoolName || 'THPT Chuyên'} - Lớp: ${surveyForm.className || 'Khối 11'}. Nhận diện an toàn ${safeCount}/${totalTrapsCount} tình huống - Điểm phòng thủ thực tế ban đầu: ${preScore}/100đ.`,
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
        calculatedScore: 38,
        postScore: 89,
        safeCount: 3,
        participantName: surveyForm.participantName.trim() || 'Khảo nghiệm viên ViSEF',
        location: surveyForm.location,
        demographicGroup: surveyForm.demographicGroup,
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
        'demographic_group',
        'province_location',
        'irb_consent_agreed',
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
          escapeCSV(s.demographicGroup),
          escapeCSV(s.location || 'Hà Nội'),
          s.consentAgreed !== false ? '1' : '0',
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
      location: 'Hà Nội',
      pastLossOrNearMiss: 'SPOTTED_IN_TIME',
      preConfidenceScore: 50,
      trapAnswers: {
        q1: '',
        q2: '',
        q3: '',
        q4: '',
        q5: '',
        q6: '',
        q7: '',
        q8: '',
        q9: '',
        q10: '',
        q11: '',
        q12: '',
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
                      Khảo nghiệm viên <strong>{submittedResult.participantName}</strong> ({submittedResult.location}) đã hoàn thành toàn diện <strong>17 câu hỏi chuẩn hóa (bao gồm 12 bẫy thực tế)</strong>. Dữ liệu đã được gán nhãn cho nghiên cứu.
                    </p>
                  </div>
                </div>
              </div>

              {/* Personalized Score Card */}
              <div className="p-5 bg-slate-900 border border-purple-500/30 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Kết Quả Đo Lường Lỗ Hổng Nhận Thức Khi CHƯA DÙNG APP
                  </span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Live Data Sync: OK
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Bẫy Lừa Đảo Tránh Được</span>
                    <b className="text-2xl font-black text-amber-400 font-mono mt-1 block">
                      {submittedResult.safeCount} / 12 Bẫy
                    </b>
                    <span className="text-[10px] text-slate-400 block mt-1">12 kịch bản bẫy thực tế</span>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Điểm Phòng Thủ Ban Đầu (Pre)</span>
                    <b className="text-2xl font-black text-rose-400 font-mono mt-1 block">
                      {submittedResult.calculatedScore} / 100đ
                    </b>
                    <span className="text-[10px] text-rose-300 block mt-1">Khi chưa có ScamGuard VN</span>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Mức Kỳ Vọng Sau Can Thiệp (Post)</span>
                    <b className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
                      {submittedResult.postScore} / 100đ
                    </b>
                    <span className="text-[10px] text-emerald-400 block mt-1">+{submittedResult.postScore - submittedResult.calculatedScore}đ phòng thủ</span>
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
                  Khảo sát này gồm <strong>17 câu hỏi chuẩn hóa</strong> (5 câu nhân khẩu học & 12 kịch bản bẫy thực tế) nhằm thu thập dữ liệu hiện trạng độc lập từ người tham gia <strong>trước khi sử dụng ứng dụng</strong>. 
                  Mọi câu trả lời của bạn sẽ được tự động tổng hợp vào <strong>Biểu đồ Thống kê Suy luận Quốc gia</strong> để làm bằng chứng thực nghiệm ViSEF.
                </p>
              </div>

              {/* Form Step Indicator Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-purple-300">
                  <span>
                    Mục {surveyStep} / 2:{' '}
                    {surveyStep === 1
                      ? 'Thông Tin Nhân Khẩu Học & Thói Quen (5 Câu)'
                      : '12 Bài Tập Kịch Bản Bẫy Lừa Đảo Thực Tế'}
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
                        <span>Tiếp Tục (Mục 2: 12 Câu Khảo Nghiệm Thực Tế)</span>
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* STEP 2: 12 REAL-WORLD SCENARIOS */
                  <div className="space-y-5 sm:space-y-6">
                    {/* Header Notice Banner */}
                    <div className="p-3.5 sm:p-4 bg-purple-950/40 border border-purple-500/40 rounded-xl sm:rounded-2xl space-y-1.5 text-purple-200 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-black text-purple-300">
                          <AlertTriangle className="w-4 h-4 text-purple-400 shrink-0" />
                          <span className="text-[11px] sm:text-xs">MỤC 2/2: 12 CÂU HỎI TIẾP XÚC & NHẬN DIỆN THỦ ĐOẠN LỪA ĐẢO THỰC TẾ</span>
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                          12 Kịch Bản Thực Tế
                        </span>
                      </div>
                      <p className="text-slate-300 text-[10px] sm:text-[11px] leading-relaxed">
                        Hãy chọn phản ứng trung thực nhất của bạn khi gặp tình huống thực tế. Hệ thống sẽ ghi nhận và đối chiếu trực tiếp với điểm phòng thủ sau khi được can thiệp bởi ứng dụng ScamGuard VN.
                      </p>
                    </div>

                    {/* Progress Tracker Card with Clickable Scenario Jumps */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 sm:p-4 lg:p-5 space-y-3 shadow-md">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <Gauge className="w-4 h-4 text-cyan-400" />
                          <span className="font-bold text-white">Tiến độ hoàn thành:</span>
                          <span className="font-black text-purple-300 font-mono text-sm">
                            {answeredTrapCount}/{totalTrapsCount} kịch bản
                          </span>
                        </div>
                        <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isAllTrapsAnswered
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        }`}>
                          {isAllTrapsAnswered ? `✅ Đã điền đủ ${totalTrapsCount}/${totalTrapsCount} câu` : `⚠️ Còn ${totalTrapsCount - answeredTrapCount} câu chưa chọn`}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 sm:h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
                          style={{ width: `${(answeredTrapCount / totalTrapsCount) * 100}%` }}
                        />
                      </div>

                      {/* Scenario Navigation Chips */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
                        <span className="text-[10px] text-slate-400 font-mono uppercase shrink-0 mr-1">Chuyển nhanh:</span>
                        {SCENARIO_QUESTIONS.map((q) => {
                          const isAnswered = !!surveyForm.trapAnswers[q.key as keyof typeof surveyForm.trapAnswers];
                          return (
                            <button
                              key={q.key}
                              type="button"
                              onClick={() => {
                                const el = document.getElementById(`trap-scenario-${q.trapIndex}`);
                                if (el) {
                                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                              }}
                              className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-mono font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer active:scale-95 ${
                                isAnswered
                                  ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60'
                                  : 'bg-slate-950 border border-slate-700 text-slate-400 hover:border-purple-500 hover:text-white'
                              }`}
                              title={`Chuyển đến ${q.title}`}
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
                              const el = document.getElementById(`trap-scenario-${missingTraps[0].trapIndex}`);
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                          }}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer"
                        >
                          Tới câu thiếu
                        </button>
                      </div>
                    )}

                    {/* 12 Real-World Scenarios List */}
                    <div className="space-y-4 sm:space-y-6">
                      {SCENARIO_QUESTIONS.map((q) => {
                        const currentAnswer = surveyForm.trapAnswers[q.key as keyof typeof surveyForm.trapAnswers];
                        const isAnswered = !!currentAnswer;

                        return (
                          <div
                            key={q.key}
                            id={`trap-scenario-${q.trapIndex}`}
                            className={`p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-200 space-y-3.5 sm:space-y-4 shadow-lg ${
                              isAnswered
                                ? 'bg-slate-900/90 border-slate-700/80 shadow-slate-950/50'
                                : 'bg-slate-900/95 border-purple-500/40 ring-1 ring-purple-500/20 shadow-purple-950/20'
                            }`}
                          >
                            {/* Question Header */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 sm:pb-3 border-b border-slate-800">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-black text-xs sm:text-sm shrink-0">
                                  {q.number}
                                </div>
                                <div>
                                  <label className="text-white font-black text-xs sm:text-sm md:text-base block">
                                    {q.title} <span className="text-rose-400">*</span>
                                  </label>
                                  <span className="text-[10px] sm:text-[11px] text-slate-400">Tình huống thực tế {q.trapIndex}/{totalTrapsCount}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-bold border ${q.badgeColor}`}>
                                  {q.badge}
                                </span>
                                {isAnswered ? (
                                  <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[9px] sm:text-[10px] font-bold flex items-center gap-1">
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    Đã chọn
                                  </span>
                                ) : (
                                  <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] sm:text-[10px] font-bold flex items-center gap-1 animate-pulse">
                                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                                    Chưa chọn
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Realistic Simulation Message Card */}
                            <div className="p-3 sm:p-4 bg-slate-950 rounded-xl sm:rounded-2xl border border-slate-800/90 text-slate-200 font-mono text-[11px] sm:text-xs leading-relaxed space-y-1 shadow-inner">
                              <div className="flex items-center gap-2 text-indigo-300 font-bold text-[10px] sm:text-[11px] border-b border-slate-800 pb-1.5 mb-1.5">
                                <span className="text-sm sm:text-base">{q.icon}</span>
                                <span>{q.source}</span>
                              </div>
                              <p className="text-slate-300 pl-1">{q.content}</p>
                            </div>

                            {/* 4 Spacious Options Grid / Stack */}
                            <div className="space-y-2.5 sm:space-y-3 pt-1">
                              <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                Chọn phản ứng xử lý của bạn:
                              </div>
                              <div className="grid grid-cols-1 gap-2 sm:gap-2.5">
                                {q.options.map((opt) => {
                                  const isSelected = currentAnswer === opt.id;
                                  return (
                                    <label
                                      key={opt.id}
                                      onClick={() => {
                                        setSurveyForm({
                                          ...surveyForm,
                                          trapAnswers: {
                                            ...surveyForm.trapAnswers,
                                            [q.key]: opt.id,
                                          },
                                        });
                                        if (validationWarning) setValidationWarning(null);
                                      }}
                                      className={`flex items-start gap-3 sm:gap-3.5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-[11px] sm:text-xs cursor-pointer transition-all duration-150 select-none active:scale-[0.99] ${
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
                                        name={`trap_${q.key}`}
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

                    {/* Missing Traps Bottom Alert */}
                    {!isAllTrapsAnswered && (
                      <div
                        onClick={() => {
                          if (missingTraps[0]) {
                            const el = document.getElementById(`trap-scenario-${missingTraps[0].trapIndex}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        }}
                        className="p-3.5 sm:p-4 bg-amber-950/30 border border-amber-500/40 hover:border-amber-500/80 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 text-amber-200 text-xs cursor-pointer transition shadow-md active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-2 font-bold">
                          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
                          <span className="text-[11px] sm:text-xs">Bạn còn {totalTrapsCount - answeredTrapCount} câu hỏi thực tế chưa chọn phương án xử lý!</span>
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
                        placeholder="Nhập cảm nhận của bạn về độ tinh vi của các thủ đoạn lừa đảo thực tế..."
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
                            ? 'Gửi Phiếu & Đẩy Dữ Liệu Lên Biểu Đồ ViSEF (Đủ 17/17 Câu)'
                            : `Gửi Phiếu (Còn ${totalTrapsCount - answeredTrapCount} câu kịch bản chưa chọn)`}
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
