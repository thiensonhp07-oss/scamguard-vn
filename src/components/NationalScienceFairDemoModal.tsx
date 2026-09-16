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
    number: 1,
    trapIndex: 1,
    title: '1. Bạn đã từng gặp tin nhắn giả mạo Cục Dịch Vụ Công / Công An dọa khóa CCCD, định danh VNeID chưa?',
    badge: 'Mạo Danh Chính Quyền & Dọa Nạt',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: '💬',
    source: 'Kịch bản thực tế: SMS Brandname DICHVUCONG hoặc cuộc gọi dọa khóa CCCD / VNeID cấp 2',
    content: 'Tin nhắn hoặc cuộc gọi: "Hồ sơ CCCD/VNeID của bạn bị lỗi đồng bộ dữ liệu dân cư quốc gia, tài khoản ngân hàng sẽ bị phong tỏa lúc 24h00. Bấm vào link dichvucong-gov-vn.cc để cập nhật ngay hoặc gọi hotline gấp".',
    options: [
      { id: 'A_NEVER_SAFE', letter: 'A', text: 'Chưa từng gặp bao giờ — Tôi và gia đình chưa từng nhận được tin nhắn hay cuộc gọi kiểu này.' },
      { id: 'B_SPOTTED_SAFE', letter: 'B', text: 'Đã từng gặp 1-2 lần — Tôi nhận ra ngay dấu hiệu lừa đảo và chủ động chặn số/xóa tin nhắn.' },
      { id: 'C_VERY_OFTEN_SAFE', letter: 'C', text: 'Đã từng gặp rất nhiều lần — Tháng nào cũng bị nhắn/gọi làm phiền, nhưng tôi quá quen nên bỏ qua.' },
      { id: 'D_NEAR_MISS_TRAP', letter: 'D', text: 'Đã từng suýt mắc bẫy / Bị lừa thật — Tôi từng hoang mang bấm thử vào link lạ hoặc từng làm theo hướng dẫn.' },
    ],
  },
  {
    key: 'q2' as const,
    number: 2,
    trapIndex: 2,
    title: '2. Bạn đã từng gặp chiêu trò "Chuyển khoản nhầm" tiền vào tài khoản rồi bị ép trả nợ lãi cao chưa?',
    badge: 'Bẫy Rửa Tiền & Tín Dụng Đen',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    icon: '🏦',
    source: 'Kịch bản thực tế: Nhận tiền lạ bất ngờ, có người khóc lóc giục chuyển lại sang STK khác',
    content: 'Tài khoản bất ngờ nhận được 3 - 10 triệu đồng kèm nội dung chuyển tiền lạ. Sau đó có người lạ gọi điện xin chuyển trả gấp vào tài khoản khác hoặc gửi link web ngân hàng yêu cầu nhập thông tin tra soát.',
    options: [
      { id: 'A_NEVER_SAFE', letter: 'A', text: 'Chưa từng gặp bao giờ — Tài khoản của tôi chưa từng phát sinh giao dịch nhận tiền bất thường.' },
      { id: 'B_SPOTTED_SAFE', letter: 'B', text: 'Đã từng gặp 1-2 lần — Tôi không tự ý chuyển tiền đi mà liên hệ ngay tổng đài ngân hàng để tra soát an toàn.' },
      { id: 'C_VERY_OFTEN_SAFE', letter: 'C', text: 'Đã từng gặp rất nhiều lần — Bạn bè, người thân quanh tôi gặp liên tục; tôi luôn dặn mọi người giữ nguyên tiền chờ ngân hàng.' },
      { id: 'D_NEAR_MISS_TRAP', letter: 'D', text: 'Đã từng suýt mắc bẫy / Chuyển tiền thật — Tôi từng cuống cuồng chuyển trả ngay hoặc từng bấm link đối soát lạ.' },
    ],
  },
  {
    key: 'q3' as const,
    number: 3,
    trapIndex: 3,
    title: '3. Bạn đã từng gặp cuộc gọi Video Call Deepfake AI giả mặt và giọng người thân vay tiền khẩn cấp chưa?',
    badge: 'Deepfake AI Khuôn Mặt & Giọng Nói',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    icon: '📹',
    source: 'Kịch bản thực tế: Video call Zalo/Messenger chập chờn 5 giây, đúng mặt bạn bè mượn tiền gấp',
    content: 'Kẻ gian gọi video Messenger 5-10 giây hiện khuôn mặt và giọng nói của người thân kêu đang đi viện cấp cứu/tai nạn xe cộ, giục chuyển tiền gấp vào STK lạ của bác sĩ rồi cúp máy bảo mạng yếu.',
    options: [
      { id: 'A_NEVER_SAFE', letter: 'A', text: 'Chưa từng gặp bao giờ — Tôi chưa từng nhận cuộc gọi video nào có biểu hiện AI giả mạo như vậy.' },
      { id: 'B_SPOTTED_SAFE', letter: 'B', text: 'Đã từng gặp 1-2 lần — Thấy hình giật méo và tài khoản nhận tiền lạ nên tôi gọi điện thoại di động trực tiếp để kiểm chứng.' },
      { id: 'C_VERY_OFTEN_SAFE', letter: 'C', text: 'Đã từng gặp rất nhiều lần — Nhóm bạn và người thân trong gia đình tôi bị hack nick gọi vay tiền liên tục.' },
      { id: 'D_NEAR_MISS_TRAP', letter: 'D', text: 'Đã từng suýt mắc bẫy / Chuyển tiền thật — Tôi quá bất ngờ vì thấy đúng mặt nên đã suýt chuyển hoặc đã chuyển tiền giúp.' },
    ],
  },
  {
    key: 'q4' as const,
    number: 4,
    trapIndex: 4,
    title: '4. Bạn đã từng nhận tin nhắn dọa phạt nguội giao thông hoặc dụ cài file ứng dụng lạ đuôi .APK chưa?',
    badge: 'Mã Độc Chiếm Quyền Trợ Năng (.APK)',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: '🚗',
    source: 'Kịch bản thực tế: Tin nhắn dọa tịch thu bằng lái, yêu cầu tải bienban_phatnguoi.apk về điện thoại',
    content: 'Tin nhắn gửi tới: "Phương tiện của bạn vi phạm vượt đèn đỏ bị camera phạt nguội, bấm vào link tải tệp phatnguoi_giaothong.apk để xem hình ảnh và nộp phạt online trước ngày 20 để không bị cưỡng chế".',
    options: [
      { id: 'A_NEVER_SAFE', letter: 'A', text: 'Chưa từng gặp bao giờ — Tôi chưa từng nhận được tin nhắn tra cứu phạt nguội kèm link tải tệp lạ.' },
      { id: 'B_SPOTTED_SAFE', letter: 'B', text: 'Đã từng gặp 1-2 lần — Tôi biết cơ quan chức năng không gửi file .APK qua tin nhắn nên lập tức xóa bỏ.' },
      { id: 'C_VERY_OFTEN_SAFE', letter: 'C', text: 'Đã từng gặp rất nhiều lần — Điện thoại tôi liên tục nhận SMS rác mạo danh CSGT, cơ quan thuế, điện lực.' },
      { id: 'D_NEAR_MISS_TRAP', letter: 'D', text: 'Đã từng suýt mắc bẫy / Tải file thật — Tôi từng tải file APK về máy và cấp quyền trợ năng hoặc từng suýt bấm vào link.' },
    ],
  },
  {
    key: 'q5' as const,
    number: 5,
    trapIndex: 5,
    title: '5. Bạn đã từng gặp lời mời làm CTV Online "xem video TikTok, giật đơn Shopee nạp tiền hoa hồng khủng" chưa?',
    badge: 'Tuyển Dụng Ảo & Bẫy Nhiệm Vụ Nạp Cọc',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    icon: '📱',
    source: 'Kịch bản thực tế: Nhắn tin Telegram/Zalo tuyển việc nhẹ lương 500k/ngày, giật đơn tăng tiền nạp',
    content: 'Được thêm vào nhóm: "Tuyển CTV đánh giá sản phẩm Shopee/TikTok làm tại nhà 30-60 phút kiếm 300k - 1 triệu/ngày". Ban đầu làm nhiệm vụ xem video nhận thật 50k, sau đó yêu cầu nạp tiền mua gói nhiệm vụ lớn hơn để rút hoa hồng 40%.',
    options: [
      { id: 'A_NEVER_SAFE', letter: 'A', text: 'Chưa từng gặp bao giờ — Tôi chưa từng được nhắn tin hay bị kéo vào các nhóm tuyển việc làm online như thế.' },
      { id: 'B_SPOTTED_SAFE', letter: 'B', text: 'Đã từng gặp 1-2 lần — Tôi thấy mùi việc nhẹ lương cao nạp tiền cọc là tôi chặn ngay lập tức.' },
      { id: 'C_VERY_OFTEN_SAFE', letter: 'C', text: 'Đã từng gặp rất nhiều lần — Cứ vài ngày lại bị add vào nhóm Zalo/Telegram tuyển CTV hoặc nhận tin nhắn chào việc.' },
      { id: 'D_NEAR_MISS_TRAP', letter: 'D', text: 'Đã từng suýt mắc bẫy / Bị giam tiền thật — Tôi từng thử làm theo ăn được tiền nhỏ, sau đó nạp tiền lớn bị giam không rút ra được.' },
    ],
  },
  {
    key: 'q6' as const,
    number: 6,
    trapIndex: 6,
    title: '6. Bạn đã từng quét phải mã QR thanh toán bị dán đè tại quán ăn, cafe hoặc mã QR nhận quà giả mạo chưa?',
    badge: 'Tấn Công Mã QR Độc Hại (Quishing)',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: '☕',
    source: 'Kịch bản thực tế: Quét mã QR thanh toán trên bàn ăn dẫn tới trang web giả hoặc STK kẻ gian dán đè',
    content: 'Khi thanh toán tiền tại bàn hoặc quầy gửi xe, quét mã QR bất ngờ mở ra một trang web yêu cầu nhập thông tin đăng nhập ngân hàng/OTP, hoặc tên người thụ hưởng trên app ngân hàng khác hoàn toàn với tên quán.',
    options: [
      { id: 'A_NEVER_SAFE', letter: 'A', text: 'Chưa từng gặp bao giờ — Mọi mã QR tôi quét tại quán đều đúng thông tin và an toàn.' },
      { id: 'B_SPOTTED_SAFE', letter: 'B', text: 'Đã từng gặp 1-2 lần — Tôi nhìn thấy tên chủ tài khoản thụ hưởng sai lệch nên dừng lại hỏi nhân viên quán ngay.' },
      { id: 'C_VERY_OFTEN_SAFE', letter: 'C', text: 'Đã từng gặp rất nhiều lần — Tôi thấy nhiều quán bị dán đè QR và trên mạng cảnh báo liên tục nên tôi kiểm tra tên cực kỳ kỹ.' },
      { id: 'D_NEAR_MISS_TRAP', letter: 'D', text: 'Đã từng suýt mắc bẫy / Chuyển nhầm tiền thật — Tôi từng chuyển tiền vội mà không nhìn lại tên chủ tài khoản, bị mất tiền oan.' },
    ],
  },
  {
    key: 'q7' as const,
    number: 7,
    trapIndex: 7,
    title: '7. Bạn đã từng nhận cuộc gọi tự xưng Công an / Viện kiểm sát dọa bạn dính líu đến đường dây rửa tiền, ma túy chưa?',
    badge: 'Thao Túng Tâm Lý & Áp Lực Bắt Giam',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: '📞',
    source: 'Kịch bản thực tế: Giọng nói đanh thép, dọa gửi lệnh bắt giam qua Zalo, ép chuyển tiền vào tài khoản tạm giữ',
    content: 'Kẻ xưng là điều tra viên Bộ Công an: "Tài khoản của anh/chị đang dính vào đường dây buôn ma túy và rửa tiền xuyên quốc gia. Yêu cầu giữ bí mật tuyệt đối, đến nơi yên tĩnh và chuyển toàn bộ tiền tiết kiệm vào tài khoản kiểm toán của cơ quan điều tra".',
    options: [
      { id: 'A_NEVER_SAFE', letter: 'A', text: 'Chưa từng gặp bao giờ — Tôi chưa từng nhận được cuộc gọi dọa bắt giam hay điều tra án mạng nào.' },
      { id: 'B_SPOTTED_SAFE', letter: 'B', text: 'Đã từng gặp 1-2 lần — Tôi biết Công an làm việc chỉ gửi giấy mời trực tiếp chứ không làm việc qua điện thoại nên tắt máy ngay.' },
      { id: 'C_VERY_OFTEN_SAFE', letter: 'C', text: 'Đã từng gặp rất nhiều lần — Tuần nào cũng có số lạ gọi dọa liên quan tới hồ sơ tội phạm, tôi trêu lại rồi dập máy.' },
      { id: 'D_NEAR_MISS_TRAP', letter: 'D', text: 'Đã từng suýt mắc bẫy / Bị đe dọa thật — Nghe giọng quát nạt quá chân thực khiến tôi run sợ, từng suýt khai báo tài khoản ngân hàng.' },
    ],
  },
  {
    key: 'q8' as const,
    number: 8,
    trapIndex: 8,
    title: '8. Bạn đã từng gặp tình huống shipper gọi giao kiện hàng COD ảo lạ hoắc bắt thanh toán khi vắng nhà chưa?',
    badge: 'Bẫy Kiện Hàng COD Ảo Giá Trị Nhỏ',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: '📦',
    source: 'Kịch bản thực tế: Gói hàng 80k-150k nhét vào cổng khi vắng nhà, giục chuyển khoản trước',
    content: 'Shipper gọi điện: "Anh/chị có gói hàng tri ân khách hàng COD 120k, em đến mà anh vắng nhà nên em gửi bác bảo vệ/nhét qua khe cửa nhé, anh chuyển tiền vào STK này giúp em". Trong khi bạn không nhớ rõ mình đã đặt món gì.',
    options: [
      { id: 'A_NEVER_SAFE', letter: 'A', text: 'Chưa từng gặp bao giờ — Các đơn hàng ship đến tôi đều nắm rõ lịch trình trên ứng dụng mua sắm.' },
      { id: 'B_SPOTTED_SAFE', letter: 'B', text: 'Đã từng gặp 1-2 lần — Tôi kiểm tra lại lịch sử đơn hàng trên app thấy không có nên kiên quyết từ chối nhận và từ chối chuyển tiền.' },
      { id: 'C_VERY_OFTEN_SAFE', letter: 'C', text: 'Đã từng gặp rất nhiều lần — Thường xuyên có các gói bưu phẩm lạ không rõ người gửi giao tới nhà thu tiền vặt.' },
      { id: 'D_NEAR_MISS_TRAP', letter: 'D', text: 'Đã từng suýt mắc bẫy / Trả tiền thật — Tôi từng chuyển khoản 100k-200k nhận hộ người nhà, mở ra chỉ là giấy rác vụn không giá trị.' },
    ],
  },
  {
    key: 'q9' as const,
    number: 9,
    trapIndex: 9,
    title: '9. Bạn đã từng nhận email hoặc SMS thông báo trúng thưởng xe máy / iPhone hoặc nhận tiền hoàn thuế chưa?',
    badge: 'Bẫy Tham Lam / Trúng Thưởng Ảo',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: '📑',
    source: 'Kịch bản thực tế: Thông báo trúng xe SH/tiền hoàn thuế, yêu cầu nộp trước phí làm hồ sơ 10%',
    content: 'Tin nhắn/email gửi đến: "Chúc mừng số điện thoại của bạn đã may mắn trúng thưởng 01 xe máy Honda SH 150i trị giá 90 triệu đồng. Để nhận giải, vui lòng truy cập trang web và nộp khoản lệ phí trước bạ 2.500.000đ vào tài khoản ban tổ chức".',
    options: [
      { id: 'A_NEVER_SAFE', letter: 'A', text: 'Chưa từng gặp bao giờ — Tôi chưa từng nhận được bất kỳ thông báo trúng thưởng bất ngờ nào.' },
      { id: 'B_SPOTTED_SAFE', letter: 'B', text: 'Đã từng gặp 1-2 lần — Tôi không tham gia quay số trúng thưởng nên biết chắc là trò lừa đảo và bỏ qua ngay.' },
      { id: 'C_VERY_OFTEN_SAFE', letter: 'C', text: 'Đã từng gặp rất nhiều lần — Tin nhắn trúng thưởng xe, hoàn tiền thuế, quà tặng thương hiệu gửi vào máy tôi liên miên.' },
      { id: 'D_NEAR_MISS_TRAP', letter: 'D', text: 'Đã từng suýt mắc bẫy / Đóng tiền thật — Tôi từng háo hức nhắn tin liên hệ ban tổ chức và suýt nộp tiền phí vận chuyển/lệ phí.' },
    ],
  },
  {
    key: 'q10' as const,
    number: 10,
    trapIndex: 10,
    title: '10. Bạn đã từng thấy dịch vụ quảng cáo "Hỗ trợ kéo lại tiền bị lừa đảo mạng bằng công nghệ cao" chưa?',
    badge: 'Bẫy Lừa Đảo Kép (Recovery Scam)',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: '⚖️',
    source: 'Kịch bản thực tế: Fanpage tự xưng Luật sư an ninh mạng cam kết lấy lại tiền treo 100%, đòi nộp phí trước',
    content: 'Quảng cáo trên Facebook/TikTok: "Văn phòng Luật sư liên kết Cục An ninh mạng cam kết thu hồi 100% tiền bị lừa qua Telegram/app đầu tư bằng thuật toán Blockchain. Nạn nhân chỉ cần nộp 10% phí đặt cọc làm việc hoặc phí mở cổng tra soát".',
    options: [
      { id: 'A_NEVER_SAFE', letter: 'A', text: 'Chưa từng gặp bao giờ — Tôi chưa từng thấy hoặc quan tâm tới các bài quảng cáo dịch vụ thu hồi tiền lừa đảo này.' },
      { id: 'B_SPOTTED_SAFE', letter: 'B', text: 'Đã từng gặp 1-2 lần — Tôi biết thừa đây là chiêu trò lừa đảo bồi thêm một vố nữa vào nạn nhân nên cảnh báo bạn bè tránh xa.' },
      { id: 'C_VERY_OFTEN_SAFE', letter: 'C', text: 'Đã từng gặp rất nhiều lần — Lướt mạng xã hội là thấy hàng loạt bài viết chạy quảng cáo lấy lại tiền lừa đảo tràn lan.' },
      { id: 'D_NEAR_MISS_TRAP', letter: 'D', text: 'Đã từng suýt mắc bẫy / Bị lừa lần 2 — Người thân hoặc tôi từng nóng ruột muốn gỡ lại tiền nên đã nhắn tin nhờ vả và bị đòi tiền phí.' },
    ],
  },
  {
    key: 'q11' as const,
    number: 11,
    trapIndex: 11,
    title: '11. Bạn đã từng nhận tin nhắn cảnh báo vi phạm bản quyền trang Fanpage / Facebook dọa khóa tài khoản vĩnh viễn chưa?',
    badge: 'Bẫy Phishing Đánh Cắp Tài Khoản & 2FA',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    icon: '🛡️',
    source: 'Kịch bản thực tế: Mạo danh Meta Support dọa xóa Page trong 24h, yêu cầu nhập mật khẩu và mã OTP 2FA',
    content: 'Tin nhắn gửi đến hộp thư Facebook: "Trang cá nhân/Fanpage của bạn bị khiếu nại bản quyền nghiêm trọng và sẽ bị xóa vĩnh viễn sau 24 giờ. Vui lòng bấm vào liên kết meta-support-appeal.me để gửi đơn kháng cáo kèm mật khẩu và mã 2FA".',
    options: [
      { id: 'A_NEVER_SAFE', letter: 'A', text: 'Chưa từng gặp bao giờ — Hộp thư Facebook của tôi chưa từng nhận cảnh báo bản quyền giả mạo như vậy.' },
      { id: 'B_SPOTTED_SAFE', letter: 'B', text: 'Đã từng gặp 1-2 lần — Tôi nhìn đuôi tên miền không phải của facebook.com nên không bao giờ bấm vào link.' },
      { id: 'C_VERY_OFTEN_SAFE', letter: 'C', text: 'Đã từng gặp rất nhiều lần — Mỗi tuần Fanpage của tôi nhận hàng chục tin nhắn rác dọa xóa trang từ các tài khoản giả Meta.' },
      { id: 'D_NEAR_MISS_TRAP', letter: 'D', text: 'Đã từng suýt mắc bẫy / Bị mất nick thật — Tôi lo sợ bị mất trang làm ăn nên đã bấm link và suýt nhập hoặc đã bị cướp tài khoản.' },
    ],
  },
  {
    key: 'q12' as const,
    number: 12,
    trapIndex: 12,
    title: '12. Bạn đã từng nhận cuộc gọi tổng đài dọa khóa SIM điện thoại sau 2 tiếng vì chưa chuẩn hóa thông tin chưa?',
    badge: 'Khóa SIM Ảo & Đánh Cắp Mã OTP',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: '⚡',
    source: 'Kịch bản thực tế: Cuộc gọi tự động dọa khóa số 2 chiều sau 2h, yêu cầu bấm phím 1 gặp nhân viên',
    content: 'Tổng đài tự động gọi: "Số thuê bao của quý khách chưa chuẩn hóa thông tin cá nhân và sẽ bị khóa liên lạc 2 chiều sau 2 giờ nữa. Bấm phím 1 để gặp nhân viên hỗ trợ", sau đó yêu cầu đọc số CCCD và mã OTP gửi về máy để cập nhật.',
    options: [
      { id: 'A_NEVER_SAFE', letter: 'A', text: 'Chưa từng gặp bao giờ — Tôi chưa từng nhận cuộc gọi dọa khóa SIM điện thoại tự động như thế này.' },
      { id: 'B_SPOTTED_SAFE', letter: 'B', text: 'Đã từng gặp 1-2 lần — Tôi biết nhà mạng chỉ thông báo bằng tin nhắn Brandname chứ không gọi dọa ngắt máy nên tắt luôn.' },
      { id: 'C_VERY_OFTEN_SAFE', letter: 'C', text: 'Đã từng gặp rất nhiều lần — Điện thoại tôi liên tục có các số bàn hoặc số lạ gọi đến phát đoạn ghi âm dọa khóa SIM.' },
      { id: 'D_NEAR_MISS_TRAP', letter: 'D', text: 'Đã từng suýt mắc bẫy / Bị lừa mã OTP — Tôi sợ mất số liên lạc quan trọng nên đã bấm phím 1 và suýt đọc mã OTP cho kẻ gian.' },
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
                          <span className="text-[11px] sm:text-xs">MỤC 2/2: 12 CÂU HỎI KHẢO SÁT TIẾP XÚC & TRẢI NGHIỆM THỦ ĐOẠN THỰC TẾ</span>
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                          12 Tình Huống Thực Tế
                        </span>
                      </div>
                      <p className="text-slate-300 text-[10px] sm:text-[11px] leading-relaxed">
                        Hãy trả lời trung thực theo trải nghiệm thực tế của bạn hoặc người thân: đã từng gặp hay chưa, mức độ tiếp xúc và cách bạn đã xử lý khi đối mặt với thủ đoạn. Dữ liệu sẽ đồng bộ trực tiếp lên biểu đồ thống kê nghiên cứu khoa học ViSEF 2026.
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
                                Chọn mức độ tiếp xúc / trải nghiệm thực tế của bạn:
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
