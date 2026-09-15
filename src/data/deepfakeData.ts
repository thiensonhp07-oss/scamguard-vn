import { DeepfakeCase } from '../types';

export const DEEPFAKE_CASES: DeepfakeCase[] = [
  {
    id: 'df-grandchild-distress-call',
    title: 'Giả Mạo Giọng Nói Con/Cháu: Gặp Tai Nạn Cần Tiền Viện Phí',
    category: 'Relative Voice',
    mediaType: 'voice',
    scenarioText:
      'Cuộc gọi thoại từ số lạ: "Mẹ ơi, con đang đi công tác thì xe va quẹt với xe tải. Người ta đang nằm viện cấp cứu, công an tạm giữ xe của con. Con phải mượn điện thoại của bác sĩ để gọi. Cần 30 triệu đóng viện phí gấp trong 1 tiếng nữa không người nhà họ làm ầm lên kiện tụng bắt giam con mất!"',
    callerInfo: '+84 934 551 298 (Số lạ không lưu trong danh bạ)',
    audioSampleDescription:
      'Phân tích quang phổ âm thanh cho thấy có hiện tượng ngắt quãng cơ học siêu nhỏ, cao độ giọng nói bị phẳng (flat pitch) khi khóc lớn và có tạp âm còi hú giả tạo được chèn đè lên nền âm thanh phòng kín.',
    isSynthetic: true,
    artifactsDetected: [
      'Ngữ điệu cao độ đều đều thiếu tự nhiên khi đang gào khóc (lỗi mô hình neural text-to-speech)',
      'Âm thanh nền đột ngột thay đổi khi đổi người nói (từ giọng cháu sang giọng bác sĩ)',
      'Cuộc gọi xuất phát từ đầu số VoIP ảo qua mạng Internet',
      'Liên tục dồn ép chuyển khoản gấp vào tài khoản cá nhân của "bác sĩ"',
    ],
    tacticUsed: 'Sympathy',
    detectionClues: [
      'Hỏi người gọi một câu hỏi riêng tư chỉ người thân trong nhà mới biết (ví dụ: "Tên con cún nhà mình là gì?" hoặc yêu cầu đọc "Mật khẩu an toàn gia đình")',
      'Để ý tiếng thở ngắt quãng bất thường hoặc âm thanh kim loại rè rè trong chất giọng',
      'Cúp máy ngay lập tức và gọi lại thẳng vào số điện thoại thường dùng của con cháu để xác minh',
    ],
    recommendedResponse:
      'Cúp máy ngay lập tức. Tuyệt đối không chuyển tiền. Gọi điện cho bố mẹ hoặc số chính chủ của người thân để xác nhận tình trạng an toàn.',
  },
  {
    id: 'df-ceo-urgent-wire-video',
    title: 'Cuộc Gọi Video Giả Mạo Lãnh Đạo: Chuyển Tiền Ký Hợp Đồng Khẩn',
    category: 'HR Video Call',
    mediaType: 'video',
    scenarioText:
      'Cuộc gọi video ngắn qua Microsoft Teams / Zalo xuất hiện hình ảnh Giám đốc công ty: "Chào em. Anh đang họp kín với đối tác ở nước ngoài chuẩn bị chốt thương vụ M&A. Do tài khoản doanh nghiệp đang bị chậm lệnh, em tạm ứng chuyển 200 triệu vào tài khoản đối tác trước 11h trưa nay để kịp đặt cọc. Hết cuộc họp anh ký lệnh hoàn tiền."',
    callerInfo: 'Zalo / Teams Video: "Giám Đốc Nguyễn Hoàng Nam (Tài khoản ngoài)"',
    audioSampleDescription:
      'Khung hình video có hiện tượng lệch khớp khẩu hình miệng khi nói các con số, xuất hiện vệt nhòe ở vùng cổ và quai hàm (lỗi hoán đổi khuôn mặt Deepfake Face-Swap), ánh sáng phản chiếu trên kính mắt không thay đổi khi cử động đầu.',
    isSynthetic: true,
    artifactsDetected: [
      'Khẩu hình miệng không khớp với âm thanh khi phát âm các con số và tên tài khoản',
      'Đường viền khuôn mặt bị nhấp nháy, rung giật nhẹ khi xoay đầu sang hai bên',
      'Tài khoản mang nhãn "Tài khoản khách bên ngoài" chứ không nằm trong danh bạ nội bộ công ty',
      'Chỉ thị bí mật nhằm né tránh quy trình phê duyệt tài chính 2 cấp tiêu chuẩn',
    ],
    tacticUsed: 'Authority',
    detectionClues: [
      'Yêu cầu người gọi vẫy bàn tay chắn ngang trước mặt hoặc quay mặt sang góc 90 độ (kỹ thuật này làm vỡ thuật toán ghép mặt AI thời gian thực)',
      'Kiểm tra kỹ nhãn tài khoản và gọi điện xác nhận lại qua đường dây thoại nội bộ bảo mật',
      'Thực hiện nghiêm túc quy trình ủy quyền tài chính 2 cấp (không bao giờ chuyển tiền chỉ qua một cuộc gọi video)',
    ],
    recommendedResponse:
      'Từ chối chuyển tiền đơn phương. Yêu cầu phê duyệt văn bản hoặc xác thực chéo qua Giám đốc Tài chính và Kế toán trưởng qua kênh chính thống.',
  },
  {
    id: 'df-police-video-fine',
    title: 'Cuộc Gọi Video Công An Mặc Sắc Phục: Thông Báo Lệnh Bắt',
    category: 'Police Authority',
    mediaType: 'video',
    scenarioText:
      'Một cuộc gọi video hiện lên hình ảnh một người đàn ông mặc sắc phục công an ngồi tại bàn làm việc có quốc huy phía sau: "Công dân chú ý, tài khoản ngân hàng của anh/chị liên quan vụ án ma túy và rửa tiền lớn. Viện kiểm sát đã phê chuẩn lệnh tạm giam. Yêu cầu chuyển tiền vào tài khoản phong tỏa của ban chuyên án trong 2 giờ để đối soát."',
    callerInfo: 'Video Call Zalo: "Trung Tá Vũ Mạnh Cường - Cục CSĐT"',
    audioSampleDescription:
      'Sắc phục công an có phù hiệu bị ngược chiều và mờ nét. Mắt chớp giật nhanh bất thường, bối cảnh phòng làm việc phía sau là ảnh tĩnh lặp lại không có cử động xung quanh.',
    isSynthetic: true,
    artifactsDetected: [
      'Bối cảnh phòng làm việc phía sau là một tấm ảnh tĩnh ghép phông xanh thiếu chiều sâu tự nhiên',
      'Cầu vai và phù hiệu công an không đúng quy chuẩn điều lệnh CAND',
      'Yêu cầu chuyển tiền vào tài khoản ngân hàng cá nhân mang danh "tài khoản cơ quan"',
      'Đe dọa bắt giữ qua mạng xã hội Zalo/Telegram',
    ],
    tacticUsed: 'Authority',
    detectionClues: [
      'Lực lượng Công an Việt Nam KHÔNG BAO GIỜ gọi video call hay tống đạt lệnh bắt, lấy lời khai qua mạng xã hội',
      'Để ý các vệt mờ quanh cổ áo, cằm và tóc',
      'Liên hệ ngay trực ban Công an phường/xã nơi cư trú để xác minh sự việc',
    ],
    recommendedResponse:
      'Ngắt kết nối ngay lập tức. Chặn tài khoản. Đến trực tiếp trụ sở Công an nơi gần nhất nếu có bất kỳ thắc mắc nào.',
  },
  {
    id: 'df-celebrity-crypto-endorsement',
    title: 'Video Deepfake Người Nổi Tiếng: Kêu Gọi Đầu Tư Tiền Kỹ Thuật Số',
    category: 'Celebrity Investment',
    mediaType: 'video',
    scenarioText:
      'Video ngắn trên TikTok/Facebook xuất hiện hình ảnh một MC / Shark truyền hình nổi tiếng: "Tôi vừa hợp tác cùng sàn giao dịch AI tự động lợi nhuận 300%. Nhân dịp ra mắt, 100 người đầu tiên nạp tối thiểu 2 triệu sẽ được nhân đôi tài khoản và nhận bảo hiểm rủi ro 100%."',
    callerInfo: 'Video Clip Quảng Cáo: "Fanpage Tích Xanh Giả Mạo"',
    audioSampleDescription:
      'Giọng nói của người nổi tiếng được tổng hợp (Voice Clone), khẩu hình nhép theo phụ đề tiếng Việt bị méo nhẹ ở các nguyên âm kép (uê, oai) và các ngón tay khi chỉ vào màn hình bị biến dạng thành 6 ngón.',
    isSynthetic: true,
    artifactsDetected: [
      'Ngón tay khi cử động có lúc xuất hiện 6 ngón hoặc dính vào nhau',
      'Khẩu hình miệng (lip-sync) có độ trễ 0.3s so với âm thanh phát ra',
      'Đăng tải trên trang fanpage mới tạo vài ngày hoặc tài khoản cá nhân không có tích xanh chính chủ',
      'Hứa hẹn mức lãi suất 300% phi thực tế trái quy luật thị trường tài chính',
    ],
    tacticUsed: 'Social Proof',
    detectionClues: [
      'Kiểm tra trang cá nhân chính thức có tích xanh xịn của người nổi tiếng xem họ có thông báo về sự kiện này không',
      'Phân tích bàn tay và chuyển động khớp hàm của nhân vật trong video',
      'Cảnh giác trước các mô hình tài chính cam kết siêu lợi nhuận có sử dụng hình ảnh KOLs',
    ],
    recommendedResponse:
      'Báo cáo (Report) video lừa đảo lên nền tảng mạng xã hội. Tuyệt đối không bấm vào link nạp tiền trong phần bình luận.',
  },
  {
    id: 'df-friend-quick-video-borrow',
    title: 'Cuộc Gọi Video "Mạng Yếu" 5 Giây: Bạn Thân Giục Vay Tiền Cọc Đất',
    category: 'Relative Voice',
    mediaType: 'video',
    scenarioText:
      'Bạn thân gọi video Messenger, màn hình hiện mặt bạn đang ngồi trong quán cà phê vẫy tay cười, nhưng tín hiệu chập chờn rồi ngắt sau 5 giây. Ngay sau đó có tin nhắn chat: "Mạng chỗ tao yếu quá, đang đi đặt cọc miếng đất gấp thiếu 40 triệu. Mày bắn vào STK chủ đất này giúp tao 1 tiếng nữa tao về nhà bắn lại ngay!"',
    callerInfo: 'Messenger Video Call: "Tài Khoản Facebook Bạn Thân Bị Hack"',
    audioSampleDescription:
      'Đoạn video 5 giây là một clip ngắn cắt từ Story Facebook cũ của nạn nhân, được lặp lại (loop) và cố tình chèn nhiễu sọc ngang để giả vờ sóng yếu.',
    isSynthetic: true,
    artifactsDetected: [
      'Cuộc gọi video chỉ kéo dài vài giây rồi chủ động ngắt với lý do "mạng yếu"',
      'Video không có sự tương tác 2 chiều (nạn nhân hỏi nhưng hình ảnh trong video chỉ cười hoặc gật đầu vô định)',
      'Yêu cầu chuyển tiền vào tài khoản ngân hàng của người thứ 3 (chủ đất / trung gian)',
      'Dồn ép thời gian khẩn cấp nhằm ngăn chặn nạn nhân gọi điện thoại trực tiếp',
    ],
    tacticUsed: 'Urgency',
    detectionClues: [
      'Khi đối phương lấy lý do "mạng yếu", hãy gọi điện trực tiếp vào số thuê bao di động (SIM) thường ngày của bạn mình',
      'Yêu cầu người gọi nói một từ khóa ngẫu nhiên hoặc làm một cử chỉ theo lệnh (ví dụ: giơ ngón tay trỏ lên mũi)',
      'Không chuyển tiền vào tài khoản mang tên người lạ khác với tên bạn bè',
    ],
    recommendedResponse:
      'Lập tức gọi số điện thoại di động chính chủ của người bạn để thông báo nick Facebook của họ đã bị kẻ gian chiếm quyền kiểm soát.',
  },
  {
    id: 'df-doctor-emergency-call',
    title: 'Bản Ghi Âm Bác Sĩ Bệnh Viện: Giục Nộp Viện Phí Mổ Não Khẩn',
    category: 'Relative Voice',
    mediaType: 'voice',
    scenarioText:
      'Cuộc gọi thoại từ người tự xưng là Trưởng khoa Phẫu thuật Thần kinh: "Bác sĩ gọi từ phòng mổ cấp cứu. Bệnh nhân người nhà của anh bị chấn thương sọ não kín, máu tụ màng cứng đang chèn ép não. Bệnh viện cần người nhà duyệt mổ và chuyển tạm ứng 35 triệu mua vật tư đặc biệt trong vòng 15 phút, chậm là không qua khỏi!"',
    callerInfo: '+84 912 884 102 (Hiển thị tên mạo danh "BS Trưởng Ca")',
    audioSampleDescription:
      'Giọng nói bác sĩ rất đanh thép và chuyên nghiệp, nhưng âm thanh y tế nền (tiếng máy monitor tim) phát ra tiếng bíp với chu kỳ hoàn hảo phi tự nhiên (máy tạo tiếng bíp điện tử) không có sự biến thiên sinh học.',
    isSynthetic: true,
    artifactsDetected: [
      'Tiếng còi hú và monitor y tế trong nền âm thanh bị lặp lại theo chu kỳ đều đặn kiểu file âm thanh mẫu (Sound Effect Loop)',
      'Hối thúc chuyển khoản vào số tài khoản cá nhân của "bác sĩ phụ trách"',
      'Kẻ gian không cho nạn nhân có thời gian suy nghĩ hay ngắt máy để liên lạc người thân khác',
    ],
    tacticUsed: 'Fear',
    detectionClues: [
      'Quy trình bệnh viện công: Các ca mổ cấp cứu đe dọa tính mạng LUÔN ĐƯỢC TIẾN HÀNH NGAY LẬP TỨC theo y lệnh khẩn, không chờ tiền viện phí',
      'Bệnh viện KHÔNG thu viện phí qua số tài khoản cá nhân của bác sĩ',
      'Yêu cầu nói chuyện trực tiếp với điều dưỡng trực hoặc số máy bàn tổng đài bệnh viện',
    ],
    recommendedResponse:
      'Giữ bình tĩnh, ngắt cuộc gọi. Gọi vào số máy bàn chính thức của Bệnh viện hoặc di chuyển trực tiếp đến khoa Cấp cứu để xác nhận.',
  },
];
