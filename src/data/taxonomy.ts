import { ScamTactic } from '../types';

export interface TacticDefinition {
  tactic: ScamTactic;
  nameVi: string;
  nameEn: string;
  icon: string;
  shortDescription: string;
  howScammersExploit: string;
  psychologicalTrigger: string;
  counterMeasures: string[];
  examplePhrases: string[];
}

export const SCAM_TACTIC_TAXONOMY: Record<ScamTactic, TacticDefinition> = {
  Authority: {
    tactic: 'Authority',
    nameVi: 'Mạo Danh Quyền Lực',
    nameEn: 'Authority Impersonation',
    icon: 'ShieldAlert',
    shortDescription: 'Tự xưng Công an, Viện Kiểm sát, Thuế, Ngân hàng trung ương để áp đảo tâm lý.',
    howScammersExploit: 'Lợi dụng tâm lý sợ rắc rối pháp lý và thói quen phục tùng cơ quan công quyền để yêu cầu chuyển tiền hoặc tải mã độc.',
    psychologicalTrigger: 'Nỗi sợ quyền uy và tính phục tùng thiết chế pháp luật.',
    counterMeasures: [
      'Công an Việt Nam KHÔNG BAO GIỜ làm việc hay tống đạt lệnh bắt qua Zalo, gọi video hay điện thoại.',
      'Yêu cầu giấy triệu tập hoặc giấy mời chính thức gửi về Công an phường nơi đăng ký thường trú.',
      'Tự tra cứu số tổng đài chính thức của cơ quan để gọi lại xác minh.',
    ],
    examplePhrases: [
      'Tôi là Thiếu tá Nguyễn Văn Hùng từ Đội Trọng án, tài khoản của anh/chị liên quan đường dây rửa tiền xuyên quốc gia!',
      'Hồ sơ của chị đã bị niêm phong, yêu cầu kết bạn Zalo nhận biên bản tạm giam!',
    ],
  },
  Urgency: {
    tactic: 'Urgency',
    nameVi: 'Dồn Ép Thời Gian',
    nameEn: 'Artificial Urgency',
    icon: 'Timer',
    shortDescription: 'Tạo sức ép thời gian ngặt nghèo (5-15 phút) khiến nạn nhân không kịp suy nghĩ hay kiểm chứng.',
    howScammersExploit: 'Tạo cảm giác cơ hội sắp biến mất hoặc tài sản sắp bị khóa vĩnh viễn nếu không bấm link ngay lập tức.',
    psychologicalTrigger: 'Tâm lý sợ bỏ lỡ (FOMO) và hoảng loạn trước hạn chót.',
    counterMeasures: [
      'Quy tắc 5 phút: Mọi vấn đề thực sự khẩn cấp đều có quy trình chính thống và không giải quyết qua 1 cú click.',
      'Bình tĩnh tạm dừng hành động và trao đổi với người thân trong gia đình.',
    ],
    examplePhrases: [
      'Tài khoản của bạn sẽ bị đóng băng vĩnh viễn trong 15 phút nếu không bấm link cập nhật sinh trắc học!',
      'Ưu đãi chỉ dành cho 3 suất duy nhất nạp tiền trong 10 phút tới!',
    ],
  },
  Fear: {
    tactic: 'Fear',
    nameVi: 'Gây Hoang Mang Sợ Hãi',
    nameEn: 'Fear & Intimidation',
    icon: 'AlertTriangle',
    shortDescription: 'Dọa dẫm bắt giam, truy tố hình sự hoặc thông báo người thân gặp tai nạn thập tử nhất sinh.',
    howScammersExploit: 'Khi con người rơi vào trạng thái sợ hãi cực độ, vùng não logic bị ức chế, dẫn tới quyết định chuyển tiền vội vã.',
    psychologicalTrigger: 'Bản năng bảo vệ bản thân và tình thương yêu gia đình.',
    counterMeasures: [
      'Khi nhận tin người thân gặp nạn cấp cứu: Cúp máy ngay và gọi trực tiếp cho người thân hoặc bệnh viện địa phương.',
      'Thiết lập "Mật khẩu an toàn gia đình" từ trước để đối chiếu.',
    ],
    examplePhrases: [
      'Con anh bị tai nạn gãy chân đang ở phòng mổ Chợ Rẫy, cần chuyển viện phí gấp 50 triệu ngay!',
      'Nếu không phối hợp, chúng tôi sẽ cử tổ công tác áp giải anh về trại giam trong 2 giờ nữa!',
    ],
  },
  Greed: {
    tactic: 'Greed',
    nameVi: 'Dụ Dỗ Lợi Nhuận Khủng',
    nameEn: 'Greed & High Return',
    icon: 'TrendingUp',
    shortDescription: 'Hứa hẹn hoa hồng 20-50%, làm nhiệm vụ Telegram nhận tiền ngay, đầu tư sinh lời x10.',
    howScammersExploit: 'Cho nạn nhân rút được số tiền nhỏ ban đầu để tạo lòng tin, sau đó giam vốn với số tiền lớn và đòi nộp thêm phí.',
    psychologicalTrigger: 'Khao khát kiếm tiền dễ dàng không tốn sức lực.',
    counterMeasures: [
      'Không có công việc nào chỉ cần "thả tim TikTok / like video" mà kiếm được hàng triệu đồng mỗi ngày.',
      'Tuyệt đối không tham gia các sàn đầu tư tiền ảo không được Ngân hàng Nhà nước cấp phép.',
    ],
    examplePhrases: [
      'Tuyển cộng tác viên xử lý đơn hàng Shopee tại nhà, thu nhập 500k - 2 triệu/ngày, nhận tiền ngay.',
      'Sàn giao dịch AI cam kết bảo toàn vốn và sinh lời 30%/tháng!',
    ],
  },
  Sympathy: {
    tactic: 'Sympathy',
    nameVi: 'Lợi Dụng Lòng Trắc Ẩn',
    nameEn: 'Sympathy & Charity Fraud',
    icon: 'HeartHandshake',
    shortDescription: 'Giả mạo các đợt cứu trợ bão lũ, hoàn cảnh bệnh nhi hiểm nghèo với mã QR tài khoản cá nhân.',
    howScammersExploit: 'Lợi dụng tình thương đồng bào để trục lợi qua các tài khoản ngân hàng không minh bạch.',
    psychologicalTrigger: 'Lòng nhân ái và tinh thần tương thân tương ái.',
    counterMeasures: [
      'Chỉ ủng hộ qua các quỹ chính thống (Ủy ban Mặt trận Tổ quốc, Hội Chữ thập đỏ, tài khoản thiện nguyện minh bạch).',
      'Kiểm tra kỹ tên chủ tài khoản thụ hưởng có trùng khớp với tên tổ chức cứu trợ hay không.',
    ],
    examplePhrases: [
      'Bé Hải Nam 4 tuổi ung thư máu giai đoạn cuối không có tiền phẫu thuật, xin mỗi người ủng hộ 50k qua mã QR...',
    ],
  },
  'Social Proof': {
    tactic: 'Social Proof',
    nameVi: 'Tạo Hiệu Ứng Đám Đông',
    nameEn: 'Social Proof Manipulation',
    icon: 'Users',
    shortDescription: 'Tạo nhóm chat đông người có hàng chục nick ảo (chim mồi) liên tục khoe tiền và khen ngợi dự án.',
    howScammersExploit: 'Khiến nạn nhân cảm thấy mình là người duy nhất nghi ngờ, trong khi mọi người xung quanh đều đang kiếm được tiền.',
    psychologicalTrigger: 'Tâm lý bầy đàn và xu hướng tin vào quyết định số đông.',
    counterMeasures: [
      '99% thành viên trong các nhóm chat làm nhiệm vụ Telegram/Zalo đều là tài khoản chim mồi do đối tượng lập ra.',
      'Rời khỏi nhóm ngay lập tức khi thấy các hình ảnh khoe biên lai chuyển tiền.',
    ],
    examplePhrases: [
      'Hôm nay cả nhóm mình đã hoàn thành lệnh nạp 100 triệu và rút về 140 triệu rồi nhé!',
    ],
  },
  Isolation: {
    tactic: 'Isolation',
    nameVi: 'Cô Lập Nạn Nhân',
    nameEn: 'Psychological Isolation',
    icon: 'ShieldOff',
    shortDescription: 'Cấm nạn nhân kể cho người thân, yêu cầu vào phòng kín đóng cửa, không ngắt cuộc gọi.',
    howScammersExploit: 'Cắt đứt liên lạc của nạn nhân với gia đình, bạn bè để ngăn chặn người khác cảnh báo hoặc can thiệp.',
    psychologicalTrigger: 'Cảm giác bí mật và bị khống chế giao tiếp.',
    counterMeasures: [
      'Bất cứ ai yêu cầu bạn "giữ bí mật tuyệt đối với gia đình" đều là kẻ lừa đảo.',
      'Cúp máy ngay và kể lại toàn bộ câu chuyện cho người thân hoặc bạn bè đáng tin cậy.',
    ],
    examplePhrases: [
      'Chuyên án điều tra bí mật, yêu cầu chị vào phòng riêng đóng cửa, không được thông báo cho ai kể cả chồng con!',
    ],
  },
  Reciprocity: {
    tactic: 'Reciprocity',
    nameVi: 'Đòn Trả Ơn / Ban Ơn',
    nameEn: 'Reciprocity Traps',
    icon: 'Gift',
    shortDescription: 'Tặng quà tri ân miễn phí, mời đi hội thảo nhận voucher, sau đó ép mua sản phẩm giá cắt cổ.',
    howScammersExploit: 'Tạo cảm giác mắc nợ tâm lý khiến nạn nhân ngại từ chối các yêu cầu tiếp theo.',
    psychologicalTrigger: 'Nhu cầu đáp lại lòng tốt của người khác.',
    counterMeasures: [
      'Từ chối các món quà miễn phí bất thường từ các số điện thoại lạ.',
      'Hiểu rõ: "Không có bữa ăn nào là miễn phí".',
    ],
    examplePhrases: [
      'Chào anh, thương hiệu tri ân gửi tặng anh nồi chiên không dầu 0 đồng, anh chỉ cần thanh toán 199k phí hải quan!',
    ],
  },
  Romance: {
    tactic: 'Romance',
    nameVi: 'Bẫy Tình Cảm & Thao Túng',
    nameEn: 'Romance & Pig Butchering',
    icon: 'Heart',
    shortDescription: 'Xây dựng mối quan hệ yêu đương trên mạng vài tuần, sau đó rủ rê đầu tư hoặc vay tiền cấp cứu.',
    howScammersExploit: 'Đánh trúng sự cô đơn, tạo dựng hình tượng thành đạt, rồi dẫn dắt vào bẫy "mổ heo" tài chính.',
    psychologicalTrigger: 'Nhu cầu tình cảm, sự gắn kết và tin tưởng.',
    counterMeasures: [
      'Tuyệt đối không chuyển tiền hoặc đầu tư theo lời khuyên của người chưa từng gặp mặt ngoài đời thực.',
      'Tìm kiếm ngược hình ảnh đại diện của đối phương qua Google Lens để kiểm tra nick giả.',
    ],
    examplePhrases: [
      'Anh có cơ hội nội bộ sàn giao dịch này chỉ chia sẻ cho riêng em, em nạp thử 5 triệu anh chỉ lệnh cho...',
    ],
  },
  Confusion: {
    tactic: 'Confusion',
    nameVi: 'Gây Rối Thuật Ngữ Nghiệp Vụ',
    nameEn: 'Technical & Legal Confusion',
    icon: 'HelpCircle',
    shortDescription: 'Dùng hàng loạt từ ngữ chuyên môn ngân hàng/pháp luật phức tạp để khiến nạn nhân bối rối.',
    howScammersExploit: 'Làm nạn nhân cảm thấy mình thiếu hiểu biết và phải giao quyền kiểm soát tài khoản cho đối phương.',
    psychologicalTrigger: 'Sự bối rối và cảm giác tự ti về kiến thức công nghệ/pháp luật.',
    counterMeasures: [
      'Dừng lại ngay khi nghe những thuật ngữ lạ lẫm.',
      'Trực tiếp ra quầy giao dịch của ngân hàng để được nhân viên tư vấn trực diện.',
    ],
    examplePhrases: [
      'Cổng thanh toán trung gian NAPAS của anh bị xung đột chứng chỉ SSL mã 404, cần đồng bộ hóa định danh OTP!',
    ],
  },
  'Synthetic Media': {
    tactic: 'Synthetic Media',
    nameVi: 'Công Nghệ Giả Mạo Deepfake',
    nameEn: 'Deepfake & Voice Cloning',
    icon: 'Mic',
    shortDescription: 'Sử dụng AI tạo video khuôn mặt hoặc sao chép giọng nói của người thân để gọi điện vay tiền.',
    howScammersExploit: 'Cuộc gọi chớp nhoáng (5-10 giây) với hình ảnh mờ nhạt, viện cớ mạng yếu để nạn nhân tin là người thật.',
    psychologicalTrigger: 'Sự tin tưởng tuyệt đối vào hình ảnh và giọng nói người thân.',
    counterMeasures: [
      'Hỏi các câu hỏi riêng tư chỉ 2 người biết (ví dụ: ngày sinh của thú cưng, kỷ niệm gia đình).',
      'Yêu cầu người gọi quay mặt sang ngang, vẫy tay trước mặt hoặc gọi lại bằng cuộc gọi thông thường.',
    ],
    examplePhrases: [
      'Mẹ ơi, con đang ở ngân hàng chuyển tiền học mà tài khoản bị lỗi, mẹ bắn gấp cho con 20 triệu vào số này nhé...',
    ],
  },
  'Convenience Bias': {
    tactic: 'Convenience Bias',
    nameVi: 'Lợi Dụng Tiện Ích & Link Tắt',
    nameEn: 'Convenience & QR Traps',
    icon: 'QrCode',
    shortDescription: 'Dán đè mã QR độc hại lên biển thanh toán hoặc gửi link rút gọn qua tin nhắn.',
    howScammersExploit: 'Khai thác thói quen quét nhanh không kiểm tra tên miền hoặc không đọc thông tin người thụ hưởng.',
    psychologicalTrigger: 'Thói quen tiện lợi và sự bất cẩn trong thao tác.',
    counterMeasures: [
      'Luôn kiểm tra kỹ bề mặt mã QR xem có bị dán đè lớp decal lạ hay không.',
      'Đọc kỹ tên miền hiển thị trên thanh địa chỉ trước khi nhập bất kỳ thông tin đăng nhập nào.',
    ],
    examplePhrases: [
      'Quét mã QR trên bàn để thanh toán phí đỗ xe tự động / nhận menu khuyến mãi!',
    ],
  },
};
