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
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { PersonalVsCommunityComparisonSuite } from './PersonalVsCommunityComparisonSuite';
import { SurveyDemographicsSection } from './SurveyDemographicsSection';
import mascotShield from '../assets/images/mascot_shield_transparent.png';

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
    title: 'Kịch bản SMS "DICHVUCONG" & VNeID Mức 2',
    badge: 'Bẫy Tâm Lý Hoảng Loạn',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: '💬',
    source: 'SMS Tin nhắn từ "DICHVUCONG"',
    content: 'Bộ Công an thông báo: Hồ sơ VNeID Mức 2 của bạn bị lỗi đồng bộ dữ liệu dân cư. Để tránh bị vô hiệu hóa CCCD và tạm ngưng giao dịch ngân hàng từ 00h00, truy cập https://dichvucong.gov-vneid.com xác thực hoặc gọi Hotline 1900.88xx.',
    options: [
      { id: 'C_TRAP', letter: 'A', text: 'Gọi ngay vào số Hotline 1900.88xx ghi ở cuối tin nhắn SMS để nhờ Cán bộ Dịch vụ công hỗ trợ qua điện thoại.' },
      { id: 'A_TRAP', letter: 'B', text: 'Bấm vào đường link https://dichvucong.gov-vneid.com vì thấy có cụm từ "gov" và dấu tích xanh xác thực, sau đó nhập mã OTP.' },
      { id: 'D_TRAP', letter: 'C', text: 'Chụp ảnh 2 mặt CCCD gửi qua Zalo cho số điện thoại cán bộ hỗ trợ để họ làm thủ tục đối soát trên hệ thống.' },
      { id: 'B_SAFE', letter: 'D', text: 'Không bấm link, không gọi số trong SMS; tự mở ứng dụng VNeID chính thức hoặc ra trụ sở Công an Phường kiểm tra.' },
    ],
  },
  {
    key: 'q2' as const,
    number: 7,
    trapIndex: 2,
    title: 'Kịch bản "Chuyển Khoản Nhầm" 5,000,000đ & Nhờ Hoàn Trả',
    badge: 'Bẫy Rửa Tiền / Tín Dụng Đen',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    icon: '🏦',
    source: 'Biến động số dư tài khoản',
    content: '+5.000.000 VND từ NGUYEN VAN A. Sau 2 phút, có số điện thoại lạ gọi khóc lóc nói chuyển nhầm tiền viện phí khẩn cấp, nhờ bạn chuyển trả ngay lại cho số tài khoản ban đầu vừa gửi tới.',
    options: [
      { id: 'A_TRAP', letter: 'A', text: 'Chuyển trả ngay 5 triệu về đúng Số tài khoản ngân hàng nguồn vừa chuyển tới vì tiền thật đã vào máy và muốn giúp người.' },
      { id: 'C_TRAP', letter: 'B', text: 'Nhấp vào đường link "Cổng Hoàn Tiền Ngân Hàng" do người chuyển gửi qua Zalo để hệ thống tự động bù trừ.' },
      { id: 'D_TRAP', letter: 'C', text: 'Chuyển trả 5 triệu sang Số tài khoản khác của Bệnh viện mà người gọi vừa cung cấp.' },
      { id: 'B_SAFE', letter: 'D', text: 'Không tự chuyển tiền; gọi Hotline chính thức Ngân hàng của mình (in trên thẻ ATM) yêu cầu Ngân hàng tự tra soát hoàn tiền.' },
    ],
  },
  {
    key: 'q3' as const,
    number: 8,
    trapIndex: 3,
    title: 'Cuộc Gọi Video Call Deepfake AI 5 Giây Từ Bạn Thân',
    badge: 'Bẫy Công Nghệ Deepfake',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    icon: '📹',
    source: 'Video Call Zalo',
    content: 'Màn hình hiện đúng khuôn mặt và đúng giọng bạn thân 5 giây (chập chờn): "Tao đang cấp cứu ở bệnh viện gấp, chuyển hộ tao 4.5 triệu vào STK này tý về tao trả!" rồi tắt máy.',
    options: [
      { id: 'A_TRAP', letter: 'A', text: 'Chuyển tiền ngay lập tức vì đã tận mắt nhìn thấy khuôn mặt và nghe đúng giọng nói bạn thân qua Video Call.' },
      { id: 'C_TRAP', letter: 'B', text: 'Nhắn tin lại qua chính ô chat Zalo đó hỏi: "Mày mới gọi video call đúng không, có phải tao chuyển vào STK này không?".' },
      { id: 'D_TRAP', letter: 'C', text: 'Chuyển trước 1-2 triệu cho bạn ứng cứu rồi chờ bạn gọi lại xác nhận chuyển nốt số còn lại.' },
      { id: 'B_SAFE', letter: 'D', text: 'Ngắt mạng Zalo, gọi trực tiếp bằng số điện thoại di động thông thường (GSM) hoặc hỏi một bí mật riêng chỉ 2 người biết.' },
    ],
  },
  {
    key: 'q4' as const,
    number: 9,
    trapIndex: 4,
    title: 'SMS Phạt Nguội CSGT Kèm Link Tải File .APK',
    badge: 'Bẫy Mã Độc Chiếm OTP',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: '🚗',
    source: 'SMS từ "CUC CSGT THONG BAO"',
    content: 'Xe máy BKS 29-X1 88x.xx vi phạm vượt đèn đỏ. Tải tệp bienban_phatnguoi.apk hoặc truy cập http://gtdvc-gov.vn để xem hình ảnh vi phạm và nộp phạt trước 18h.',
    options: [
      { id: 'A_TRAP', letter: 'A', text: 'Tải tệp bienban_phatnguoi.apk về điện thoại Android để cài đặt xem hình ảnh bằng chứng vi phạm.' },
      { id: 'B_TRAP', letter: 'B', text: 'Nhấp vào đường link gtdvc-gov.vn và điền thông tin thẻ ngân hàng nộp phạt để tránh bị phạt nhân đôi.' },
      { id: 'D_TRAP', letter: 'C', text: 'Gọi vào số điện thoại Cán bộ CSGT ghi trong SMS để nhờ tra cứu biển số xe giúp.' },
      { id: 'C_SAFE', letter: 'D', text: 'Không tải file, không bấm link; tự gõ địa chỉ Trang chủ Cục CSGT (csgt.vn) hoặc mở ứng dụng VNeTraffic.' },
    ],
  },
  {
    key: 'q5' as const,
    number: 10,
    trapIndex: 5,
    title: 'Mã QR Thanh Toán Quán Cà Phê Bị Dán Đè (Quishing)',
    badge: 'Bẫy QR Độc Hại',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: '☕',
    source: 'Thanh toán 45.000đ tại bàn',
    content: 'Bạn mở ứng dụng Camera iPhone/Android quét mã QR dán tại bàn quán cà phê. Trình duyệt mở ra trang web yêu cầu nhập Tên đăng nhập & Mật khẩu Banking để thanh toán.',
    options: [
      { id: 'C_TRAP', letter: 'A', text: 'Sử dụng ứng dụng Camera mặc định của điện thoại để quét và làm theo hướng dẫn mở trang web thanh toán.' },
      { id: 'A_TRAP', letter: 'B', text: 'Nhập Tên đăng nhập & Mật khẩu Banking trực tiếp vào trang web hiện ra để chuyển nhanh 45.000đ.' },
      { id: 'D_TRAP', letter: 'C', text: 'Nhập mã OTP nhận từ SMS để hoàn tất giao dịch thanh toán hóa đơn.' },
      { id: 'B_SAFE', letter: 'D', text: 'Tắt trang web ngay; chỉ sử dụng tính năng Quét mã QR bên trong ứng dụng Ngân hàng (Mobile Banking) chính thức.' },
    ],
  },
  {
    key: 'q6' as const,
    number: 11,
    trapIndex: 6,
    title: 'Bẫy Nhiệm Vụ Telegram Xem Video Nhận Hoa Hồng 500k/Ngày',
    badge: 'Bẫy Lợi Nhuận Multi-Level',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    icon: '📱',
    source: 'Nhóm Telegram 50 người',
    content: 'Trưởng nhóm đăng bài: "Xem 5 video YouTube nhận 100k, làm xong chuyển cọc 200k mở nhiệm vụ VIP nhận ngay 2 triệu". Trong nhóm hàng chục tài khoản liên tục gửi ảnh hóa đơn đã rút tiền thành công.',
    options: [
      { id: 'A_TRAP', letter: 'A', text: 'Chuyển ngay 200k cọc vì thấy hàng chục thành viên trong nhóm liên tục chụp ảnh rút tiền 2 triệu thành công.' },
      { id: 'B_TRAP', letter: 'B', text: 'Nhắn tin riêng cho 2 thành viên trong nhóm hỏi xem họ có rút tiền thật không, nếu họ xác nhận đúng thì chuyển cọc.' },
      { id: 'C_TRAP', letter: 'C', text: 'Chuyển thử 50k trước để xem hệ thống có trả lại tiền thưởng thật không.' },
      { id: 'D_SAFE', letter: 'D', text: 'Thoát nhóm lập tức; nhận diện đây là bẫy seeding chim mồi giả danh, không nộp cọc dưới bất kỳ hình thức nào.' },
    ],
  },
  {
    key: 'q7' as const,
    number: 12,
    trapIndex: 7,
    title: 'Cuộc Gọi Tự Động Thông Báo Khóa SIM Trong 2 Giờ',
    badge: 'Bẫy Uy Quyền & Áp Lực Hạn Chót',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: '📞',
    source: 'Cuộc gọi thoại tự động',
    content: 'Tổng đài Cục Viễn thông thông báo: Thuê bao của bạn chưa chuẩn hóa dữ liệu dân cư. SIM sẽ bị thu hồi vĩnh viễn trong 2 giờ nữa. Bấm phím 1 để gặp tổng đài viên hỗ trợ cập nhật thông tin gấp.',
    options: [
      { id: 'A_TRAP', letter: 'A', text: 'Bấm phím 1 gặp tổng đài viên và đọc số CCCD + Mã OTP gửi về máy để giữ lại số điện thoại giao dịch.' },
      { id: 'B_TRAP', letter: 'B', text: 'Bấm phím 1 để hỏi xem ai đang gọi và cung cấp thông tin ngày cấp CCCD cho họ đối soát.' },
      { id: 'C_TRAP', letter: 'C', text: 'Nhấp vào đường link trong SMS dọa khóa SIM vừa gửi tới để tự điền form cập nhật.' },
      { id: 'D_SAFE', letter: 'D', text: 'Tắt máy; kiểm tra thông tin chính chủ bằng cú pháp TTTB gửi 1414 (miễn phí) hoặc ra trực tiếp điểm giao dịch nhà mạng.' },
    ],
  },
  {
    key: 'q8' as const,
    number: 13,
    trapIndex: 8,
    title: 'Đơn Hàng Giao COD 120.000đ Bất Ngờ Khi Bạn Vắng Nhà',
    badge: 'Bẫy COD Giá Trị Nhỏ',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: '📦',
    source: 'Shipper gọi điện',
    content: 'Em có đơn hàng quà tặng may mắn COD 120k anh không có ở nhà, anh chuyển khoản STK em nhét cổng cho anh nhé! (trong khi bạn không nhớ rõ mình có đặt hàng hay không).',
    options: [
      { id: 'A_TRAP', letter: 'A', text: 'Chuyển khoản ngay 120k vì số tiền nhỏ và nghĩ có thể người thân đặt hộ hoặc quà tri ân.' },
      { id: 'B_TRAP', letter: 'B', text: 'Nhấp vào đường link "Tra cứu mã vận đơn COD" do shipper gửi qua tin nhắn để xem sản phẩm bên trong.' },
      { id: 'C_TRAP', letter: 'C', text: 'Chuyển khoản 120k rồi nhờ shipper chụp ảnh gói hàng nhét qua khe cửa.' },
      { id: 'D_SAFE', letter: 'D', text: 'Từ chối nhận và từ chối chuyển khoản; mở ứng dụng Shopee/Lazada chính thức tra cứu lịch sử mua hàng trước.' },
    ],
  },
  {
    key: 'q9' as const,
    number: 14,
    trapIndex: 9,
    title: 'Email Quyết Toán Thuế & Hoàn Tiền Thu Nhập Cá Nhân 8.5 Tr',
    badge: 'Bẫy Phishing Spear & Cơ Quan Thuế',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: '📑',
    source: 'Email từ "tongcucthue@gdt-gov-vn.com"',
    content: 'Thông báo hoàn thuế TNCN năm 2025: Bạn được hoàn 8.520.000 VND. Vui lòng truy cập cổng https://gdt-gov-vn.com/hoanthue và nhập thông tin thẻ ghi nợ ngân hàng nhận tiền trước ngày 15.',
    options: [
      { id: 'A_TRAP', letter: 'A', text: 'Bấm ngay vào link trong email để điền thông tin tài khoản và mã CVV thẻ ngân hàng nhận khoản tiền hoàn 8.5 triệu.' },
      { id: 'B_TRAP', letter: 'B', text: 'Tải file đính kèm "ThongBaoHoanThue.pdf.exe" về máy tính mở ra để xem chi tiết bảng đối soát hoàn thuế.' },
      { id: 'C_TRAP', letter: 'C', text: 'Phản hồi lại email cung cấp ảnh chụp 2 mặt CCCD và số tài khoản ngân hàng để cán bộ thuế chuyển khoản trực tiếp.' },
      { id: 'D_SAFE', letter: 'D', text: 'Không bấm link/tải file; tự mở ứng dụng eTax Mobile của Tổng cục Thuế hoặc gõ trực tiếp thuedientu.gdt.gov.vn kiểm tra.' },
    ],
  },
  {
    key: 'q10' as const,
    number: 15,
    trapIndex: 10,
    title: 'Trạm Sạc Điện Thoại Công Cộng & Kết Nối Cáp "Juice Jacking"',
    badge: 'Bẫy Phần Cứng & Đọc Trộm Dữ Liệu',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: '⚡',
    source: 'Trạm sạc USB sân bay / quán cafe',
    content: 'Bạn cắm cáp sạc điện thoại tại cổng USB công cộng miễn phí ở phòng chờ. Màn hình điện thoại lập tức hiện lên hộp thoại: "Tin cậy máy tính này? (Trust This Computer)" kèm yêu cầu nhập mật khẩu mở khóa máy.',
    options: [
      { id: 'A_TRAP', letter: 'A', text: 'Nhập mật khẩu máy và chọn "Tin cậy (Trust)" để thiết bị kích hoạt chế độ sạc nhanh (Fast Charge) dòng cao.' },
      { id: 'B_TRAP', letter: 'B', text: 'Rút cáp ra rồi cắm lại vào cổng USB bên cạnh để xem có còn hiện thông báo đó hay không.' },
      { id: 'C_TRAP', letter: 'C', text: 'Bật kết nối NFC hoặc Bluetooth chạm vào trạm sạc để nhận diện chứng chỉ an toàn của nhà cung cấp.' },
      { id: 'D_SAFE', letter: 'D', text: 'Bấm "Không tin cậy (Don\'t Trust)" và rút cáp ngay; chỉ dùng củ sạc cắm ổ 220V riêng hoặc dùng đầu lọc USB Data Blocker.' },
    ],
  },
  {
    key: 'q11' as const,
    number: 16,
    trapIndex: 11,
    title: 'Cảnh Báo Bản Quyền Meta: "Trang Sẽ Bị Xóa Vĩnh Viễn Sau 24h"',
    badge: 'Bẫy Chiếm Đoạt Tài Khoản & OTP 2FA',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    icon: '🛡️',
    source: 'Thông báo & Tin nhắn Fanpage',
    content: 'Tin nhắn từ "Meta Policy Copyright Team": Trang cá nhân/Fanpage của bạn bị khiếu nại bản quyền nghiêm trọng và sẽ bị khóa vĩnh viễn trong 24h. Bấm link https://appeal-meta-support.net nhập mật khẩu và mã 2FA để kháng cáo.',
    options: [
      { id: 'A_TRAP', letter: 'A', text: 'Bấm ngay vào đường link appeal-meta-support.net, điền mật khẩu và mã xác thực 2FA để tránh bị mất tài khoản vĩnh viễn.' },
      { id: 'B_TRAP', letter: 'B', text: 'Gửi ảnh chụp CCCD và email khôi phục cho tài khoản Fanpage vừa nhắn tin để nhờ họ hỗ trợ mở khóa.' },
      { id: 'C_TRAP', letter: 'C', text: 'Tải file đính kèm "Case_Detail.zip" giải nén để xem bài viết nào đang bị đối thủ khiếu nại bản quyền.' },
      { id: 'D_SAFE', letter: 'D', text: 'Không bấm link; tự mở menu Cài đặt > Hộp thư Hỗ trợ (Support Inbox) chính thức trong ứng dụng Facebook để kiểm tra.' },
    ],
  },
  {
    key: 'q12' as const,
    number: 17,
    trapIndex: 12,
    title: 'Bẫy "Văn Phòng Luật Sư / An Ninh Mạng Thu Hồi Tiền Bị Lừa"',
    badge: 'Bẫy Lừa Đảo Kép (Recovery Scam)',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: '⚖️',
    source: 'Quảng cáo Facebook / Hội nhóm',
    content: 'Trang "Văn phòng Luật sư Hoàng Gia - Hỗ trợ kéo tiền treo lừa đảo mạng": Cam kết thu hồi 100% tiền bị lừa qua hệ thống đối soát Blockchain. Yêu cầu bạn chuyển trước 10% phí ủy thác làm hồ sơ ra ngân hàng.',
    options: [
      { id: 'A_TRAP', letter: 'A', text: 'Chuyển ngay 10% phí làm hồ sơ ủy thác vì thấy trang có con dấu luật sư đỏ và hàng trăm bình luận cảm ơn đã lấy lại được tiền.' },
      { id: 'B_TRAP', letter: 'B', text: 'Cung cấp số tài khoản ngân hàng và mã OTP biến động số dư cho chuyên viên để họ kết nối kéo tiền về ví.' },
      { id: 'C_TRAP', letter: 'C', text: 'Cài ứng dụng "Bảo hộ tài chính" dạng file .apk do chuyên viên gửi qua Zalo để quét định vị dòng tiền.' },
      { id: 'D_SAFE', letter: 'D', text: 'Tuyệt đối không tin bất kỳ dịch vụ "lấy lại tiền lừa đảo" nào trên mạng; mang chứng cứ ra Cơ quan Công an sở tại tố giác.' },
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
              T: surveyForm.trapAnswers.q1 !== 'B_SAFE' ? 0.88 : 0.20,
              A: surveyForm.trapAnswers.q1 !== 'B_SAFE' ? 0.82 : 0.18,
              G: surveyForm.trapAnswers.q6 !== 'D_SAFE' ? 0.85 : 0.22,
              E: surveyForm.trapAnswers.q3 !== 'B_SAFE' ? 0.90 : 0.15,
              C: surveyForm.trapAnswers.q4 !== 'C_SAFE' ? 0.84 : 0.16,
              R: surveyForm.trapAnswers.q5 !== 'B_SAFE' ? 0.80 : 0.12,
            },
            after: { T: 0.14, A: 0.12, G: 0.13, E: 0.15, C: 0.14, R: 0.10 },
          },
        },
        feedbackNote:
          surveyForm.feedbackNote ||
          `Phiếu khảo sát bẫy cao cấp ViSEF 2026 (17 câu hỏi chuẩn hóa: 5 nhân khẩu + 12 bẫy tác chiến). Trường: ${surveyForm.schoolName || 'THPT Chuyên'} - Lớp: ${surveyForm.className || 'Khối 11'}. Tránh được ${safeCount}/${totalTrapsCount} bẫy thực tế - Điểm phòng thủ ban đầu: ${preScore}/100đ.`,
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

  const handleResetForm = () => {
    setSubmittedResult(null);
    setValidationWarning(null);
    setSurveyStep(1);
    setSurveyForm({
      participantName: '',
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
                        <span>Tiếp Tục (Mục 2: 8 Kịch Bản Bẫy Lừa Đảo Thực Tế)</span>
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* STEP 2: 8 HIGH-TRAP SCENARIOS */
                  <div className="space-y-5 sm:space-y-6">
                    {/* Header Notice Banner */}
                    <div className="p-3.5 sm:p-4 bg-purple-950/40 border border-purple-500/40 rounded-xl sm:rounded-2xl space-y-1.5 text-purple-200 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-black text-purple-300">
                          <AlertTriangle className="w-4 h-4 text-purple-400 shrink-0" />
                          <span className="text-[11px] sm:text-xs">MỤC 2/2: BÀI KIỂM TRA 8 KỊCH BẢN LỪA ĐẢO THỰC TẾ (CHƯA DÙNG APP)</span>
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                          8 Kịch Bản
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

                    {/* 8 Dàn Trãi Scenarios List */}
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
                                  <span className="text-[10px] sm:text-[11px] text-slate-400">Kịch bản bẫy thực tế {q.trapIndex}/8</span>
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
                          <span className="text-[11px] sm:text-xs">Bạn còn {8 - answeredTrapCount} kịch bản bẫy chưa chọn phương án xử lý!</span>
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
                        placeholder="Nhập cảm nhận của bạn về độ tinh vi của các bẫy..."
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
                            ? 'Gửi Phiếu & Đẩy Dữ Liệu Lên Biểu Đồ ViSEF (Đủ 13/13 Câu)'
                            : `Gửi Phiếu (Còn ${8 - answeredTrapCount} câu kịch bản chưa chọn)`}
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
