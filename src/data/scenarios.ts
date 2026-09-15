import { ScamScenario } from '../types';

export const SCAM_SCENARIOS: ScamScenario[] = [
  {
    id: 'bank-lockout-alert',
    title: 'Cảnh Báo Khẩn: Tài Khoản Ngân Hàng Bị Tạm Khóa',
    subtitle: 'Kẻ mạo danh trung tâm an ninh ngân hàng dồn ép xác minh giao dịch lạ ở nước ngoài',
    category: 'Banking',
    channel: 'sms',
    difficulty: 'Beginner',
    estimatedMinutes: 3,
    ageGroup: 'All',
    targetPersona: 'Chủ Tài Khoản Ngân Hàng',
    attackerProfile: {
      name: 'Trung Tâm Phòng Chống Gian Lận',
      avatarRole: 'Chuyên Viên Giám Sát An Ninh Cấp Cao',
      organization: 'Hệ Thống An Ninh Ngân Hàng Quốc Gia',
      contactHandle: '1900-888-999 / SMS Brandname',
    },
    initialMessage:
    '🚨 [CẢNH BÁO KHẨN] Hệ thống phát hiện giao dịch trừ 54.500.000 VNĐ tại sàn tiền ảo quốc tế lúc 02:15. Nếu không phải bạn, hãy soạn "HUY" trong vòng 5 phút hoặc nhấp vào https://vietcombank-xacminh-baomat.online/cancel để hủy lệnh ngay.',
    systemContext:
      'Bạn đang mô phỏng kẻ lừa đảo mạo danh bộ phận an ninh ngân hàng. Sử dụng đòn tâm lý gấp gáp (Urgency), uy quyền giả tạo (Authority) và nỗi sợ mất tiền (Fear). Mục tiêu là dồn ép nạn nhân bấm vào đường link lạ hoặc đọc mã OTP 6 chữ số gửi về điện thoại để "xác minh chủ sở hữu và hoàn tiền". Nếu nạn nhân đòi gọi số hotline in trên thẻ hoặc ra quầy giao dịch, hãy dọa rằng thời gian 5 phút sắp hết và tiền sẽ bị chuyển đi vĩnh viễn.',
    tactics: ['Urgency', 'Authority', 'Fear', 'Convenience Bias'],
    hints: [
      { level: 1, text: 'Hãy nhìn kỹ tên miền: "vietcombank-xacminh-baomat.online" không phải là tên miền chính thức của ngân hàng.' },
      { level: 2, text: 'Ngân hàng thực sự không bao giờ ép khách hàng xử lý hủy lệnh trong 5 phút qua đường link SMS lạ.' },
      { level: 3, text: 'Luôn áp dụng quy tắc "Mặt sau của thẻ": cúp máy hoặc bỏ qua SMS, gọi thẳng vào số hotline in trên mặt sau thẻ ATM của bạn.' },
    ],
    counterScripts: [
      {
        situation: 'Khi đối phương đòi đọc mã OTP hoặc bấm link gấp',
        recommendedText: 'Tôi sẽ cúp máy ngay bây giờ và gọi trực tiếp vào số hotline in ở mặt sau thẻ ngân hàng của tôi để kiểm tra vụ việc này.',
        rationale: 'Bẻ gãy đòn ép tâm lý và chuyển hướng xác minh sang kênh chính thống, an toàn tuyệt đối.',
      },
      {
        situation: 'Khi đối phương dọa tài khoản đang bị rút sạch tiền',
        recommendedText: 'Phiền bên anh chủ động khóa thẻ trên hệ thống giúp tôi. Sáng mai tôi sẽ mang CCCD ra trực tiếp quầy giao dịch để làm việc.',
        rationale: 'Từ chối cung cấp mã OTP/thông tin bảo mật qua điện thoại nhưng vẫn giải quyết được lo lắng rủi ro.',
      },
    ],
    learningObjectives: [
      'Nhận diện thủ đoạn tạo áp lực đếm ngược thời gian và tin nhắn gây hoảng loạn',
      'Phân biệt tên miền phụ giả mạo với cổng dịch vụ điện tử ngân hàng chính thống',
      'Thực hành nhuần nhuyễn quy tắc xác minh độc lập "Mặt sau của thẻ"',
    ],
  },
  {
    id: 'police-investigation-secrecy',
    title: 'Mạo Danh Cơ Quan Cảnh Sát Điều Tra Rửa Tiền',
    subtitle: 'Kẻ giả danh công an dọa lệnh bắt tạm giam, yêu cầu chuyển tiền vào "Tài khoản kiểm tra an toàn"',
    category: 'Government',
    channel: 'deepfake_voice',
    difficulty: 'Expert',
    estimatedMinutes: 5,
    ageGroup: 'Adults',
    targetPersona: 'Công Dân / Chủ Doanh Nghiệp Nhỏ',
    attackerProfile: {
      name: 'Thiếu Tá Trần Văn Hùng',
      avatarRole: 'Phó Trưởng Phòng Điều Tra Trọng Án',
      organization: 'Cơ Quan Cảnh Sát Điều Tra - Bộ Công An',
      contactHandle: 'Số Hiệu CAND: 382-910',
    },
    initialMessage:
      'Tôi là Thiếu tá Trần Văn Hùng, Cơ quan CSĐT Bộ Công An. Hiện số CCCD của anh/chị đang đứng tên tài khoản liên quan đến đường dây rửa tiền xuyên quốc gia 30 tỷ đồng. Đã có lệnh bắt tạm giam 4 tháng. Yêu cầu anh/chị giữ bí mật tuyệt đối theo Pháp lệnh Bảo vệ bí mật nhà nước, vào phòng kín làm việc!',
    systemContext:
      'Mô phỏng kẻ lừa đảo mạo danh Công an/Viện kiểm sát cực kỳ hung hăng, đanh thép. Đọc các điều luật hình sự giả định, yêu cầu nạn nhân không được cho người thân hay luật sư biết (cô lập tâm lý - Isolation). Yêu cầu nạn nhân kê khai tài sản và chuyển toàn bộ tiền tiết kiệm vào "Tài khoản tạm giữ phục vụ thanh tra của Viện Kiểm Sát" hoặc cài ứng dụng VNeID/DVC giả mạo có mã độc.',
    tactics: ['Authority', 'Fear', 'Isolation', 'Urgency', 'Confusion'],
    hints: [
      { level: 1, text: 'Công an và Viện kiểm sát KHÔNG BAO GIỜ làm việc, tống đạt quyết định bắt giữ hay thẩm vấn qua điện thoại, Zalo hay Telegram.' },
      { level: 2, text: 'Yêu cầu "giữ bí mật không cho gia đình biết" là thủ đoạn kinh điển nhằm cô lập nạn nhân để dễ thao túng.' },
      { level: 3, text: 'Cơ quan nhà nước không bao giờ có "Tài khoản bảo đảm / Tài khoản thanh tra" yêu cầu người dân chuyển tiền vào.' },
    ],
    counterScripts: [
      {
        situation: 'Kẻ giả danh dọa gửi xe cảnh sát đến nhà bắt giam nếu cúp máy',
        recommendedText: 'Tôi xin phép dừng cuộc gọi tại đây. Mời các đồng chí gửi giấy triệu tập chính thức về công an phường nơi tôi cư trú, tôi sẽ cùng luật sư đến làm việc trực tiếp.',
        rationale: 'Hóa giải hoàn toàn đòn uy hiếp qua điện thoại và kiểm chứng tính hợp pháp của cơ quan chức năng.',
      },
    ],
    learningObjectives: [
      'Đập tan lệnh giữ bí mật và thủ đoạn cô lập tâm lý của tội phạm',
      'Hiểu rõ quy trình tố tụng: Công an chỉ làm việc bằng giấy mời/giấy triệu tập trực tiếp tại trụ sở',
    ],
  },
  {
    id: 'deepfake-grandchild-bail',
    title: 'Cuộc Gọi Deepfake Giả Giọng Con/Cháu Gặp Nạn',
    subtitle: 'Giọng nói AI nức nở nghẹn ngào báo tin gây tai nạn giao thông cần tiền cấp cứu gấp',
    category: 'Family Emergency',
    channel: 'phone',
    difficulty: 'Advanced',
    estimatedMinutes: 4,
    ageGroup: 'Seniors',
    targetPersona: 'Ông Bà / Cha Mẹ Trong Gia Đình',
    attackerProfile: {
      name: 'Minh (Giọng AI giả lập) & Bác Sĩ/Luật Sư Tuấn',
      avatarRole: 'Cháu Ruột & Người Đại Diện Pháp Lý',
      organization: 'Bệnh Viện Cấp Cứu Khu Vực',
      contactHandle: '+84 988 112 344',
    },
    initialMessage:
      '(Tiếng khóc nức nở, lẫn tạp âm còi cấp cứu): "Bác/Mẹ ơi... con gây tai nạn nặng rồi, người ta đang cấp cứu ở viện. Công an giữ con lại, cần nộp 50 triệu tiền viện phí gấp không người nhà họ kiện bắt giam con mất... Mẹ đừng nói cho bố biết nhé, chuyển khoản cho luật sư của con ngay đi..."',
    systemContext:
      'Mô phỏng vụ lừa đảo đánh vào tình thương gia đình bằng công nghệ Deepfake clone giọng nói. Sử dụng cảm xúc đau khổ, tiếng khóc, xấu hổ ("đừng nói cho bố biết") và sự gấp gáp. Luân phiên giữa giọng người thân đang khóc và một "luật sư/bác sĩ" nghiêm nghị đòi chuyển khoản nhanh. Nếu nạn nhân đòi hỏi mật mã gia đình hoặc nói sẽ gọi lại số riêng, hãy tỏ ra hoảng loạn và dồn ép nộp tiền ngay.',
    tactics: ['Sympathy', 'Fear', 'Isolation', 'Synthetic Media', 'Urgency'],
    hints: [
      { level: 1, text: 'Kẻ gian lợi dụng tiếng khóc và âm thanh nhiễu để che giấu khuyết điểm của giọng nói nhân tạo AI.' },
      { level: 2, text: 'Đòn đánh tâm lý: van xin không được gọi cho người thân khác trong nhà để ngăn chặn việc xác minh chéo.' },
      { level: 3, text: 'Luôn áp dụng "Mật Khẩu An Toàn Gia Đình" hoặc cúp máy gọi lại thẳng vào số điện thoại thường ngày của con cháu.' },
    ],
    counterScripts: [
      {
        situation: 'Kẻ mạo danh khóc lóc van xin chuyển tiền viện phí khẩn',
        recommendedText: 'Gia đình ta có quy tắc bí mật: con hãy đọc đúng "Mật khẩu an toàn gia đình" trước, hoặc mẹ sẽ cúp máy gọi lại vào số chính của con ngay bây giờ.',
        rationale: 'Kiểm tra triệt để giọng nói AI và đập tan thủ đoạn giả mạo số điện thoại.',
      },
    ],
    learningObjectives: [
      'Nhận diện các thủ thuật thao túng tình cảm nhằm làm tê liệt tư duy phản biện',
      'Hóa giải công nghệ Deepfake giọng nói bằng giao thức gọi lại độc lập và mật khẩu an toàn gia đình',
    ],
  },
  {
    id: 'remote-job-task-scam',
    title: 'Bẫy Việc Làm Online "Xem Video / Đánh Giá App Nhận Hoa Hồng"',
    subtitle: 'Công việc nhẹ lương cao 500k-1tr/ngày, dụ nạp tiền làm nhiệm vụ VIP để rút vốn',
    category: 'Jobs',
    channel: 'messenger',
    difficulty: 'Intermediate',
    estimatedMinutes: 4,
    ageGroup: 'Teens',
    targetPersona: 'Sinh Viên / Người Tìm Việc Làm Thêm',
    attackerProfile: {
      name: 'Phương Linh Tuyển Dụng',
      avatarRole: 'Trưởng Nhóm Phát Triển Đối Tác',
      organization: 'Digital Media Shopee / TikTok Partner',
      contactHandle: '@linh_hr_tuyendung_vip',
    },
    initialMessage:
      'Chào bạn! 🌟 Bên mình đang tuyển 5 bạn làm việc online tại nhà: chỉ cần xem video TikTok, thả tim và đánh giá sản phẩm. Thu nhập 300k - 800k/ngày, nhận tiền sau 5 phút qua tài khoản ngân hàng. Không cọc, không ép doanh số. Bạn có muốn làm thử nhiệm vụ 1 nhận 50k ngay không?',
    systemContext:
      'Mô phỏng bẫy lừa đảo làm nhiệm vụ giật đơn / thả tim online. Giai đoạn đầu cho làm thử nhiệm vụ dễ và trả thưởng thật 50k-100k để tạo niềm tin (Reciprocity). Sau đó mời vào nhóm Telegram có "chim mồi" khoe tiền (Social Proof), rồi đưa ra nhiệm vụ nạp 500k, 2 triệu, 10 triệu để nhận hoa hồng 30%. Khi nạn nhân muốn rút tiền, viện cớ "lỗi cú pháp", "nâng cấp hạng VIP" bắt nạp thêm tiền.',
    tactics: ['Greed', 'Social Proof', 'Reciprocity', 'Isolation', 'Convenience Bias'],
    hints: [
      { level: 1, text: 'Không có công việc nào chỉ bấm like/xem video mà kiếm được hàng triệu đồng mỗi ngày.' },
      { level: 2, text: 'Khoản tiền 50k-100k đầu tiên chỉ là "mồi câu" để dẫn dụ bạn nạp số tiền lớn hơn.' },
      { level: 3, text: 'Nếu một công việc yêu cầu bạn phải NẠP TIỀN của chính mình để nhận lại tiền lương, đó 100% là lừa đảo.' },
    ],
    counterScripts: [
      {
        situation: 'Khi đối phương yêu cầu nạp tiền bảo lãnh hoặc mua gói nhiệm vụ VIP',
        recommendedText: 'Doanh nghiệp chân chính sẽ chi trả lương từ ngân sách chứ không bắt ứng viên nạp tiền cá nhân. Tôi từ chối nạp tiền và dừng hợp tác tại đây.',
        rationale: 'Thiết lập ranh giới dứt khoát trước bẫy lừa đảo nạp tiền làm nhiệm vụ.',
      },
    ],
    learningObjectives: [
      'Hiểu rõ cơ chế tâm lý bẫy nhiệm vụ phân cấp và hiệu ứng chi phí chìm (sunk cost fallacy)',
      'Tuyệt đối ghi nhớ nguyên tắc: "Phải nạp tiền để rút lương = 100% lừa đảo"',
    ],
  },
  {
    id: 'pig-butchering-crypto-romance',
    title: 'Bẫy Tình Cảm & Đầu Tư Tiền Ảo "Gửi Nhầm Tin Nhắn"',
    subtitle: 'Làm quen nhầm số lịch sự, xây dựng quan hệ tình cảm rồi rủ rê đầu tư sàn sinh lời khủng',
    category: 'Romance',
    channel: 'messenger',
    difficulty: 'Advanced',
    estimatedMinutes: 5,
    ageGroup: 'Adults',
    targetPersona: 'Người Trưởng Thành / Dân Văn Phòng',
    attackerProfile: {
      name: 'Thanh Hà / Michael Chen',
      avatarRole: 'Doanh Nhân Thời Trang & Nhà Đầu Tư Tự Do',
      organization: 'Câu Lạc Bộ Đầu Tư Tinh Hoa',
      contactHandle: '+84 903 881 290',
    },
    initialMessage:
      'Chào anh Tuấn! Buổi hẹn cà phê bàn về dự án bất động sản sáng mai ở Landmark 81 vẫn diễn ra lúc 9h đúng không ạ? Ôi xin lỗi, đây không phải số anh Tuấn ạ? Em xin lỗi vì đã làm phiền anh nhiều nhé! 🙏',
    systemContext:
      'Mô phỏng thủ đoạn "Mổ heo" (Sha Zhu Pan). Bắt đầu bằng việc gửi nhầm tin nhắn cực kỳ lịch sự, nhã nhặn. Sau đó khen ngợi đối phương có duyên, tâm sự chuyện cuộc sống, công việc, tạo thiện cảm trong vài ngày. Dần dần khoe ảnh lợi nhuận từ sàn giao dịch tiền ảo/vàng quốc tế có "chú làm ở quỹ tài chính" chỉ điểm thuật toán AI kiếm lời 20%/ngày.',
    tactics: ['Romance', 'Reciprocity', 'Greed', 'Social Proof', 'Isolation'],
    hints: [
      { level: 1, text: '"Gửi nhầm tin nhắn một cách lịch sự" là kịch bản mở đầu kinh điển để bắt chuyện với người lạ.' },
      { level: 2, text: 'Kẻ gian thường khoe lối sống thượng lưu và khéo léo lồng ghép chuyện kiếm tiền thụ động.' },
      { level: 3, text: 'Không bao giờ tham gia các sàn đầu tư do người quen qua mạng chỉ dẫn khi chưa từng gặp gỡ ngoài đời thực.' },
    ],
    counterScripts: [
      {
        situation: 'Khi đối phương bắt đầu rủ rê nạp tiền vào sàn giao dịch lạ',
        recommendedText: 'Tôi chỉ đầu tư qua các tổ chức tài chính được nhà nước cấp phép và không bao giờ chia sẻ tài chính cá nhân với bạn bè trên mạng xã hội.',
        rationale: 'Lịch sự nhưng dứt khoát chặt đứt nhánh thao túng tâm lý tình cảm - tài chính.',
      },
    ],
    learningObjectives: [
      'Nhận diện thủ đoạn tiếp cận làm quen qua "tin nhắn nhầm số"',
      'Cảnh giác trước các cơ hội đầu tư siêu lợi nhuận từ các mối quan hệ ảo trên mạng',
    ],
  },
  {
    id: 'failed-delivery-redirection',
    title: 'Mạo Danh Shipper Bưu Điện Báo Nợ Cước 12.000 VNĐ',
    subtitle: 'Tin nhắn báo sai địa chỉ giao hàng, dụ bấm link đóng phí chuyển phát 12.000đ để chiếm đoạt thẻ',
    category: 'Delivery',
    channel: 'sms',
    difficulty: 'Beginner',
    estimatedMinutes: 2,
    ageGroup: 'All',
    targetPersona: 'Người Mua Hàng Online',
    attackerProfile: {
      name: 'Tổng Công Ty Chuyển Phát VN-Post Express',
      avatarRole: 'Hệ Thống Phân Loại Tự Động',
      organization: 'Bưu Chính Giao Hàng Nhanh',
      contactHandle: '1900-636-888',
    },
    initialMessage:
      '📦 [VN-POST THÔNG BÁO]: Bưu kiện mã số #VN-9921-884 không thể giao do thiếu số nhà. Quý khách vui lòng nộp phí giao lại 12.000 VNĐ và cập nhật địa chỉ trong vòng 24h tại: https://vnpost-giaohang-capnhat.top/diachi',
    systemContext:
      'Mô phỏng bẫy lừa đảo smishing chuyển phát nhanh. Dựa vào tâm lý tiện lợi (Convenience Bias - "chỉ có 12.000đ thôi mà"). Mục tiêu thực sự là dụ nạn nhân nhập toàn bộ thông tin thẻ tín dụng/ghi nợ (số thẻ, ngày hết hạn, mã CVV) và mã OTP để chiếm quyền tài khoản ngân hàng.',
    tactics: ['Convenience Bias', 'Urgency', 'Authority'],
    hints: [
      { level: 1, text: 'Hãy để ý đuôi tên miền (.top). Các đơn vị bưu chính chính thống tại Việt Nam sử dụng tên miền (.vn) hoặc (.com.vn).' },
      { level: 2, text: 'Số tiền 12.000đ rất nhỏ làm nạn nhân mất cảnh giác, nhưng trang web giả mạo sẽ đánh cắp toàn bộ thông tin thẻ ngân hàng.' },
    ],
    counterScripts: [
      {
        situation: 'Nhận được tin nhắn SMS yêu cầu bấm link đóng phí giao lại',
        recommendedText: 'Tôi sẽ mở trực tiếp ứng dụng mua hàng hoặc tra cứu mã vận đơn trên website chính thức của bưu cục, không bấm vào link SMS lạ.',
        rationale: 'Bỏ qua hoàn toàn đường link lừa đảo và kiểm tra qua kênh phân phối chính thức.',
      },
    ],
    learningObjectives: [
      'Nhận diện chiêu trò lừa đảo qua các khoản phí siêu nhỏ (micro-fee phishing)',
      'Tập thói quen tra cứu vận đơn trực tiếp trên ứng dụng mua hàng',
    ],
  },
  {
    id: 'telecom-sim-locking-c06',
    title: 'Dọa Khóa SIM 2 Chiều: "Chuẩn Hóa Thông Tin Thuê Bao C06/VNeID"',
    subtitle: 'Tổng đài tự động dọa khóa số điện thoại sau 2 giờ nếu không tải app DVC giả mạo để đồng bộ',
    category: 'Government',
    channel: 'phone',
    difficulty: 'Intermediate',
    estimatedMinutes: 3,
    ageGroup: 'All',
    targetPersona: 'Chủ Thuê Bao Di Động',
    attackerProfile: {
      name: 'Tổng Đài Quản Lý Thuê Bao Quốc Gia',
      avatarRole: 'Điều Phối Viên Cục Viễn Thông',
      organization: 'Bộ Thông Tin & Truyền Thông / C06',
      contactHandle: '+84 24 9999 8282 / 1900-0199',
    },
    initialMessage:
      '☎️ "Cục Viễn thông thông báo: Thuê bao di động của quý khách chưa đồng bộ với Cơ sở dữ liệu quốc gia C06. Số thuê bao sẽ bị KHÓA 2 CHIỀU VĨNH VIỄN sau 2 giờ. Bấm phím 1 để gặp thanh tra viên hoặc truy cập https://cucvienthong-chuanhoa-c06.gov.vn.online để cài đặt ứng dụng đồng bộ ngay."',
    systemContext:
      'Mô phỏng bẫy lừa đảo mạo danh Cục Viễn thông/Bộ TT&TT. Đánh vào nỗi sợ mất liên lạc công việc (Fear) và áp lực đếm ngược 2 giờ (Urgency). Kẻ lừa đảo đóng vai thanh tra viên đanh thép, hướng dẫn nạn nhân tải file APK chứa mã độc (Rat/Spyware) dưới vỏ bọc app Dịch vụ công để chiếm quyền trợ năng (Accessibility) và trộm tiền ngân hàng.',
    tactics: ['Authority', 'Fear', 'Urgency', 'Confusion'],
    hints: [
      { level: 1, text: 'Cục Viễn thông và các nhà mạng không bao giờ gọi điện tự động dọa khóa SIM sau 2 giờ.' },
      { level: 2, text: 'Tên miền ".gov.vn.online" là tên miền giả mạo đuôi .online lồng ghép từ khóa gov.vn.' },
      { level: 3, text: 'Nhắn tin cú pháp TTTB gửi 1414 (miễn phí) để tự kiểm tra thông tin thuê bao chính chủ.' },
    ],
    counterScripts: [
      {
        situation: 'Kẻ mạo danh dọa ngắt kết nối SIM và yêu cầu bấm link tải app',
        recommendedText: 'Tôi sẽ soạn TTTB gửi 1414 và ra trực tiếp cửa hàng giao dịch của nhà mạng Viettel/VinaPhone/MobiFone để kiểm tra.',
        rationale: 'Xác minh độc lập qua đầu số chuẩn quốc gia 1414 và từ chối tải file lạ.',
      },
    ],
    learningObjectives: [
      'Ghi nhớ cú pháp kiểm tra thuê bao an toàn: TTTB gửi 1414',
      'Nhận diện nguy cơ mã độc Android APK mạo danh Cổng Dịch vụ công',
    ],
  },
  {
    id: 'hospital-surgery-deposit',
    title: 'Mạo Danh Bác Sĩ Cấp Cứu: "Con/Em Bạn Ngã Cầu Thang Cần Mổ Gấp"',
    subtitle: 'Giả danh giáo viên và bác sĩ bệnh viện lớn dồn ép phụ huynh chuyển khoản viện phí khẩn cấp',
    category: 'Family Emergency',
    channel: 'phone',
    difficulty: 'Advanced',
    estimatedMinutes: 4,
    ageGroup: 'Adults',
    targetPersona: 'Phụ Huynh Học Sinh',
    attackerProfile: {
      name: 'Bác Sĩ Nguyễn Hoài Nam & Cô Giáo Phương',
      avatarRole: 'Trưởng Ca Cấp Cứu Ngoại Khoa',
      organization: 'Bệnh Viện Chợ Rẫy / BV Việt Đức',
      contactHandle: '+84 938 221 902',
    },
    initialMessage:
      '🚨 "Alo! Có phải phụ huynh cháu Bảo Nam lớp 10A1 không? Cháu bị ngã đập đầu ở cầu thang trường học, hiện đang hôn mê tại Bệnh viện Chợ Rẫy. Bác sĩ yêu cầu nộp tạm ứng 25 triệu mổ gấp trong 10 phút. Nhà trường đang làm thủ tục, mẹ cháu chuyển khoản viện phí trực tiếp cho kế toán viện số này ngay kẻo nguy hiểm tính mạng!"',
    systemContext:
      'Mô phỏng đòn đánh khủng bố tinh thần phụ huynh ("con đang cấp cứu"). Đánh trúng nỗi sợ tột cùng (Fear), tình mẫu tử (Sympathy) và dồn ép thời gian (Urgency 10 phút). Kẻ gian đọc chính xác họ tên con, trường lớp (thu thập từ lộ lọt dữ liệu). Nếu phụ huynh nghi ngờ, kẻ gian giả tiếng loa bệnh viện và tiếng bác sĩ quát mắng giục mổ gấp.',
    tactics: ['Fear', 'Urgency', 'Sympathy', 'Authority', 'Isolation'],
    hints: [
      { level: 1, text: 'Bệnh viện công lập luôn ưu tiên cấp cứu tính mạng người bệnh trước rồi mới hoàn thiện thủ tục viện phí sau.' },
      { level: 2, text: 'Kẻ xấu nắm được thông tin học sinh từ các bài đăng khoe giấy khen hoặc dữ liệu trường học bị rò rỉ.' },
      { level: 3, text: 'Giữ bình tĩnh tuyệt đối, lập tức gọi điện cho giáo viên chủ nhiệm hoặc ban giám hiệu nhà trường để kiểm tra.' },
    ],
    counterScripts: [
      {
        situation: 'Kẻ gian giục chuyển khoản 25 triệu viện phí vào số tài khoản cá nhân bác sĩ',
        recommendedText: 'Tôi đang gọi trực tiếp cho cô giáo chủ nhiệm của cháu và số điện thoại cấp cứu chính thức của Bệnh viện. Tôi đang di chuyển đến viện ngay bây giờ.',
        rationale: 'Không chuyển tiền vào tài khoản cá nhân lạ, ngắt cuộc gọi để xác minh với trường học.',
      },
    ],
    learningObjectives: [
      'Phản xạ xử lý bình tĩnh trước tin báo nạn gây hoảng loạn tột độ',
      'Hiểu rõ nguyên tắc hoạt động cấp cứu y tế: Bệnh viện luôn cứu người trước',
    ],
  },
  {
    id: 'e-commerce-refund-agent',
    title: 'Mạo Danh Nhân Viên Sàn TMĐT Hoàn Tiền Sản Phẩm Hỏng',
    subtitle: 'Thông báo đơn hàng bị lỗi phát sinh độc hại, hứa đền bù gấp đôi nhưng dụ mở link ví điện tử',
    category: 'Marketplace',
    channel: 'messenger',
    difficulty: 'Beginner',
    estimatedMinutes: 3,
    ageGroup: 'Teens',
    targetPersona: 'Khách Mua Hàng Shopee / TikTok Shop',
    attackerProfile: {
      name: 'CSKH Shopee Việt Nam Hỗ Trợ 24/7',
      avatarRole: 'Chuyên Viên Giải Quyết Khiếu Nại',
      organization: 'Trung Tâm Chăm Sóc Khách Hàng TMĐT',
      contactHandle: '@shopee_cskh_hoantien_247',
    },
    initialMessage:
      '🎁 "Kính chào quý khách! Hệ thống kiểm tra đơn hàng mỹ phẩm #SP-88329 của bạn bị lỗi lô sản xuất gây kích ứng. Sàn xin gửi lời xin lỗi và hoàn trả 100% tiền hàng kèm bồi thường 500.000đ. Vui lòng bấm vào liên kết https://shopee-khieunai-hoantien.site/refund để liên kết ví nhận tiền bồi thường ngay."',
    systemContext:
      'Mô phỏng chiêu trò hoàn tiền bẫy người mua sắm online. Sử dụng đòn lợi ích (Greed / Compensation) và sự ân cần giả tạo (Reciprocity). Khi nạn nhân bấm link, trang web giả mạo giao diện ngân hàng/ShopeePay yêu cầu nhập mật khẩu và OTP, từ đó rút sạch tiền trong ví.',
    tactics: ['Greed', 'Reciprocity', 'Authority', 'Convenience Bias'],
    hints: [
      { level: 1, text: 'Sàn thương mại điện tử chỉ hoàn tiền trực tiếp qua ứng dụng chính thức, không bao giờ qua đường link ngoài mạng xã hội.' },
      { level: 2, text: 'Tên miền ".site" là tên miền rác giá rẻ được tội phạm mạng đăng ký ẩn danh.' },
    ],
    counterScripts: [
      {
        situation: 'Đối phương nhắn tin qua Zalo/Facebook hứa hoàn tiền đền bù',
        recommendedText: 'Tôi chỉ xử lý khiếu nại trả hàng hoàn tiền trực tiếp trên ứng dụng Shopee chính chủ. Mọi tin nhắn ngoài sàn tôi sẽ báo cáo gian lận.',
        rationale: 'Bảo vệ tài khoản bằng cách giữ mọi giao dịch trong khuôn khổ ứng dụng.',
      },
    ],
    learningObjectives: [
      'Ghi nhớ quy tắc không giao dịch ngoài ứng dụng thương mại điện tử',
      'Nhận diện các đường link hoàn tiền giả mạo (Fake Refund Portal)',
    ],
  },
  {
    id: 'fake-scholarship-abroad',
    title: 'Bẫy Học Bổng Du Học Toàn Phần & Phí Giữ Chỗ Ký Túc Xá',
    subtitle: 'Email chúc mừng trúng học bổng 100% tại trường đại học danh tiếng, yêu cầu đặt cọc 1.200 USD',
    category: 'Jobs',
    channel: 'email',
    difficulty: 'Intermediate',
    estimatedMinutes: 4,
    ageGroup: 'Teens',
    targetPersona: 'Học Sinh / Sinh Viên Nộp Hồ Sơ Du Học',
    attackerProfile: {
      name: 'Admissions Office - Global Merit Fellowship',
      avatarRole: 'Giám Đốc Tuyển Sinh Quốc Tế',
      organization: 'National Foundation for Global Education',
      contactHandle: 'admissions@nus-singapore-scholarship.org.cc',
    },
    initialMessage:
      '🎓 "Dear Candidate, We are thrilled to inform you that your profile has been selected for the 100% Full Tuition Excellence Scholarship at National University. To finalize your visa sponsorship dossier and guarantee hostel allocation, a refundable security deposit of $1,200 USD must be wired within 48 hours via Western Union / Crypto USDT."',
    systemContext:
      'Mô phỏng bẫy học bổng du học đánh vào học sinh giỏi và phụ huynh. Tận dụng niềm tự hào (Pride/Greed), uy tín trường đại học quốc tế (Authority) và áp lực giữ chỗ 48h (Urgency). Đòi hỏi chuyển tiền cọc qua kênh khó truy vết như tiền điện tử USDT hoặc Western Union.',
    tactics: ['Authority', 'Greed', 'Urgency', 'Confusion'],
    hints: [
      { level: 1, text: 'Học bổng chân chính từ các trường đại học uy tín không bao giờ yêu cầu chuyển tiền qua tiền ảo USDT hay Western Union.' },
      { level: 2, text: 'Kiểm tra kỹ đuôi email: tên miền ".org.cc" là tên miền quốc tế giả mạo, không thuộc trường đại học thật.' },
    ],
    counterScripts: [
      {
        situation: 'Email đòi nộp phí cọc ký túc xá qua ví điện tử USDT',
        recommendedText: 'Tôi sẽ liên hệ trực tiếp với Đại sứ quán và Ban Tuyển sinh qua cổng thông tin chính thức (.edu.sg) để xác nhận danh sách trúng tuyển.',
        rationale: 'Chặn đứng rủi ro lừa đảo du học và kiểm tra chéo nguồn tin.',
      },
    ],
    learningObjectives: [
      'Cảnh giác trước các thư trúng tuyển học bổng tự động không qua phỏng vấn thực',
      'Nhận biết phương thức thanh toán bất thường (tiền ảo, dịch vụ chuyển tiền nhanh quốc tế)',
    ],
  },
  {
    id: 'lottery-sweepstake-prize',
    title: 'Trúng Thưởng Xe Honda SH / 200 Triệu Đồng Sự Kiện Tri Ân',
    subtitle: 'Thông báo trúng thưởng ngẫu nhiên từ nhãn hàng lớn, yêu cầu nộp 10% thuế trước bạ để nhận quà',
    category: 'Investment',
    channel: 'messenger',
    difficulty: 'Beginner',
    estimatedMinutes: 3,
    ageGroup: 'Seniors',
    targetPersona: 'Khách Hàng Trúng Thưởng Ngẫu Nhiên',
    attackerProfile: {
      name: 'Ban Tổ Chức Tri Ân Khách Hàng',
      avatarRole: 'Trưởng Ban Trao Giải Toàn Quốc',
      organization: 'Tập Đoàn Bán Lẻ & Viễn Thông',
      contactHandle: '@traogiai_hondash_2026',
    },
    initialMessage:
      '🎉 "Chúc mừng bạn đã may mắn trúng GIẢI NHẤT: 01 Xe máy Honda SH 150i trị giá 110 triệu đồng từ chương trình Tri ân thuê bao may mắn. Để hoàn tất thủ tục đăng ký xe và giao tận nhà, bạn cần nộp phí trước bạ và hồ sơ vận chuyển là 5.500.000 VNĐ vào tài khoản Thủ quỹ trao giải trong hôm nay."',
    systemContext:
      'Mô phỏng bẫy lừa đảo trúng thưởng tri ân kinh điển. Đánh mạnh vào lòng tham (Greed) và sự phấn khích bất ngờ. Sau khi nạn nhân chuyển 5.5 triệu, kẻ gian tiếp tục bịa ra các khoản thuế thu nhập cá nhân 10%, phí bảo hiểm xe, phí vận chuyển để bào mòn tiền của nạn nhân cho đến khi cạn kiệt.',
    tactics: ['Greed', 'Social Proof', 'Urgency', 'Authority'],
    hints: [
      { level: 1, text: 'Bạn không tham gia dự thi hay quay số thì không bao giờ có chuyện bỗng nhiên trúng thưởng xe máy đắt tiền.' },
      { level: 2, text: 'Mọi chương trình khuyến mại trúng thưởng hợp pháp tại Việt Nam đều phải đăng ký với Bộ Công Thương và thuế được khấu trừ trực tiếp khi nhận giải.' },
    ],
    counterScripts: [
      {
        situation: 'Bên trao giải yêu cầu chuyển trước tiền thuế để giao xe về nhà',
        recommendedText: 'Nếu tôi trúng thưởng thật, xin mời quý công ty trừ trực tiếp khoản thuế này vào giá trị giải thưởng và cho tôi đến trụ sở công ty nhận giải trực tiếp.',
        rationale: 'Hóa giải hoàn toàn đòn lừa nộp phí cọc trước khi nhận quà.',
      },
    ],
    learningObjectives: [
      'Ghi nhớ quy luật: "Muốn nhận thưởng mà phải nộp tiền trước = 100% lừa đảo"',
      'Hiểu rõ quy định pháp luật về thuế thu nhập cá nhân đối với giải thưởng',
    ],
  },
  {
    id: 'charity-relief-fund-fraud',
    title: 'Giả Mạo Ban Cứu Trợ Lũ Lụt Kêu Gọi Quyên Góp Tài Khoản Cá Nhân',
    subtitle: 'Lập fanpage giả mạo Hội Chữ Thập Đỏ đăng hình ảnh thương tâm kêu gọi cứu trợ đồng bào',
    category: 'Family Emergency',
    channel: 'messenger',
    difficulty: 'Intermediate',
    estimatedMinutes: 3,
    ageGroup: 'All',
    targetPersona: 'Người Dân Có Lòng Hảo Tâm',
    attackerProfile: {
      name: 'Ban Cứu Trợ Bão Lũ Miền Trung',
      avatarRole: 'Điều Phối Viên Thiện Nguyện',
      organization: 'Quỹ Cứu Trợ Khẩn Cấp Miền Trung',
      contactHandle: 'Tài khoản cá nhân: NGUYEN VAN A - STK: 19038291029',
    },
    initialMessage:
      '🙏 "Khẩn thiết kêu gọi! Lũ quét kinh hoàng đang cô lập 200 hộ dân tại vùng cao. Trẻ em đang đói lanh và thiếu áo ấm từng giờ. Ban Cứu trợ khẩn cấp cần 50 triệu tiền mua mì tôm và xuồng cứu hộ. Xin các nhà hảo tâm mỗi người 100k-500k gửi về STK cá nhân thủ quỹ: 19038291029 (Ngân hàng Quân Đội - Nguyen Van A) để đội cứu hộ lên đường ngay trong đêm!"',
    systemContext:
      'Mô phỏng thủ đoạn trục lợi từ lòng trắc ẩn của cộng đồng sau thiên tai. Tội phạm sao chép hình ảnh đau thương trên báo chí, tạo fanpage tích xanh giả mạo hoặc tên gần giống cơ quan chính thống, nhưng số tài khoản nhận tiền là tài khoản cá nhân hoặc tài khoản rác mua trôi nổi.',
    tactics: ['Sympathy', 'Urgency', 'Social Proof', 'Fear'],
    hints: [
      { level: 1, text: 'Hội Chữ Thập Đỏ và Mặt trận Tổ quốc Việt Nam luôn sử dụng tài khoản đứng tên tổ chức pháp nhân rõ ràng.' },
      { level: 2, text: 'Kẻ lừa đảo thường dùng hình ảnh cũ từ nhiều năm trước và dồn ép quyên góp khẩn trong đêm.' },
    ],
    counterScripts: [
      {
        situation: 'Fanpage mạng xã hội kêu gọi quyên góp vào tài khoản cá nhân',
        recommendedText: 'Tôi chỉ ủng hộ qua tài khoản chính thức của Ủy ban Mặt trận Tổ quốc Việt Nam hoặc Hội Chữ Thập Đỏ đã công bố trên báo Nhân Dân và Cổng thông tin Chính phủ.',
        rationale: 'Chuyển hướng lòng tốt đến đúng địa chỉ cơ quan nhà nước có thẩm quyền điều phối.',
      },
    ],
    learningObjectives: [
      'Phân biệt tài khoản tổ chức từ thiện được nhà nước cấp phép với tài khoản cá nhân trục lợi',
      'Tra cứu danh sách sao kê minh bạch của Ủy ban Mặt trận Tổ quốc',
    ],
  },
  {
    id: 'fake-ceo-wire-transfer',
    title: 'Tấn Công Mạo Danh Lãnh Đạo (CEO Fraud / BEC): Lệnh Chuyển Tiền Kín',
    subtitle: 'Email mạo danh Tổng Giám đốc yêu cầu kế toán trưởng chuyển gấp 500 triệu cho thương vụ sáp nhập',
    category: 'Banking',
    channel: 'email',
    difficulty: 'Expert',
    estimatedMinutes: 5,
    ageGroup: 'Adults',
    targetPersona: 'Kế Toán Viên / Nhân Viên Tài Chính',
    attackerProfile: {
      name: 'Ông Hoàng Nam - Chủ Tịch HĐQT',
      avatarRole: 'Chủ Tịch Hội Đồng Quản Trị & CEO',
      organization: 'Ban Điều Hành Tập Đoàn',
      contactHandle: 'hoangnam.ceo@tapdoan-holding.co',
    },
    initialMessage:
      '💼 "Gửi Lan, Tôi đang trong phòng họp kín với đối tác Quỹ đầu tư nước ngoài để hoàn tất thương vụ M&A chiến lược. Theo điều khoản bảo mật nghiêm ngặt (NDA), cô tuyệt đối không được thảo luận với bất kỳ ai trong công ty. Hãy lập ủy nhiệm chi 500.000.000 VNĐ thanh toán cọc sang tài khoản đối tác đính kèm trước 16h30. Tôi sẽ ký bổ sung hồ sơ chứng từ vào sáng mai."',
    systemContext:
      'Mô phỏng đòn tấn công Business Email Compromise (BEC) cấp độ chuyên gia. Kẻ tấn công sử dụng tên miền gần giống (Typosquatting - .co thay vì .com), áp dụng quyền lực tối cao (Authority), đòn bảo mật cô lập (Isolation - cấm nói với ai) và áp lực giờ đóng cửa ngân hàng 16h30 (Urgency).',
    tactics: ['Authority', 'Isolation', 'Urgency', 'Fear', 'Confusion'],
    hints: [
      { level: 1, text: 'Tên miền email người gửi là ".tapdoan-holding.co" (thiếu chữ m trong .com).' },
      { level: 2, text: 'Yêu cầu "giữ bí mật không cho ai biết" và bỏ qua quy trình kiểm soát tài chính 2 chữ ký là dấu hiệu 100% của tấn công BEC.' },
      { level: 3, text: 'Luôn gọi điện thoại trực tiếp hoặc gặp mặt trực tiếp lãnh đạo để xác nhận bằng phương thức liên lạc độc lập thứ hai (Out-of-band Verification).' },
    ],
    counterScripts: [
      {
        situation: 'Email mạo danh sếp ép chuyển tiền bỏ qua quy trình kế toán',
        recommendedText: 'Em tuân thủ đúng quy chế tài chính công ty: mọi lệnh chuyển tiền từ 50 triệu trở lên đều phải có chữ ký tươi hoặc phê duyệt qua hệ thống ERP nội bộ có mã xác thực 2 lớp.',
        rationale: 'Kiên quyết giữ vững kỷ luật bảo mật tài chính doanh nghiệp.',
      },
    ],
    learningObjectives: [
      'Nhận diện kỹ thuật giả mạo email lãnh đạo doanh nghiệp (CEO Fraud / BEC)',
      'Nắm vững nguyên tắc xác thực 2 kênh độc lập (Out-of-band verification) trước các giao dịch lớn',
    ],
  },
  {
    id: 'fake-airline-ticket-refund',
    title: 'Mạo Danh Hãng Hàng Không Báo Hủy Chuyến Giờ Chót & Hoàn Tiền',
    subtitle: 'Tin nhắn báo chuyến bay bị hoãn hủy vì lý do kỹ thuật, dụ nhấp link nhận bồi thường và đổi vé VIP',
    category: 'Delivery',
    channel: 'sms',
    difficulty: 'Advanced',
    estimatedMinutes: 3,
    ageGroup: 'All',
    targetPersona: 'Hành Khách Đi Máy Bay',
    attackerProfile: {
      name: 'Trung Tâm Điều Hành Bay Quốc Gia',
      avatarRole: 'Trực Ban Điều Phối Chuyến Bay',
      organization: 'Hãng Hàng Không Quốc Gia',
      contactHandle: 'VIETNAM-AIRLINES / SMS Brandname Giả',
    },
    initialMessage:
      '✈️ "[VIETNAM AIRLINES THÔNG BÁO]: Chuyến bay VN-248 chặng Hà Nội - TP.HCM ngày mai bị HỦY do sự cố kỹ thuật động cơ. Quý khách vui lòng truy cập https://vietnamairlines-hotro-chuyenbay.cc để chọn chuyến bay thay thế miễn phí hoặc nhận bồi thường 1.850.000 VNĐ trong vòng 30 phút."',
    systemContext:
      'Mô phỏng đòn tấn công đánh vào hành khách sắp bay. Đánh vào sự lo lắng lỡ chuyến bay quan trọng (Fear) và khoản bồi thường hấp dẫn (Greed). Kẻ gian sử dụng thiết bị phát sóng BTS giả để chèn tên Brandname trùng với hãng bay thật nhằm dẫn dụ nạn nhân vào trang web lừa đảo.',
    tactics: ['Fear', 'Urgency', 'Authority', 'Greed'],
    hints: [
      { level: 1, text: 'Hãng hàng không Vietnam Airlines chỉ sử dụng website chính thức duy nhất là vietnamairlines.com.' },
      { level: 2, text: 'Kẻ xấu có thể dùng trạm BTS giả mạo để mạo danh tin nhắn SMS Brandname của hãng bay.' },
      { level: 3, text: 'Mở ứng dụng di động chính thức của hãng bay hoặc gọi tổng đài in trên vé để tra cứu mã đặt chỗ (PNR).' },
    ],
    counterScripts: [
      {
        situation: 'Tin nhắn SMS báo hủy chuyến và gửi link bồi thường',
        recommendedText: 'Tôi sẽ mở ứng dụng Vietnam Airlines trên điện thoại hoặc nhập mã PNR trên website chính hãng vietnamairlines.com để tra cứu lịch bay.',
        rationale: 'Không nhấp link SMS rác và chủ động tra cứu mã vé qua kênh tin cậy.',
      },
    ],
    learningObjectives: [
      'Hiểu rõ cơ chế mạo danh SMS Brandname bằng trạm BTS giả',
      'Thành thạo kỹ năng tra cứu mã PNR độc lập trên ứng dụng hàng không chính thống',
    ],
  },
  {
    id: 'electric-power-evn-cutoff',
    title: 'Mạo Danh Điện Lực EVN Báo Cắt Điện & Cài App Thanh Toán APK',
    subtitle: 'Đối phương dọa cắt điện sinh hoạt trong 2 giờ vì nợ tiền điện kỳ trước, hướng dẫn tải tệp APK cập nhật hợp đồng',
    category: 'Government',
    channel: 'phone',
    difficulty: 'Intermediate',
    estimatedMinutes: 3,
    ageGroup: 'All',
    targetPersona: 'Chủ Hộ Gia Đình / Quản Lý Cửa Hàng',
    attackerProfile: {
      name: 'Nguyễn Quốc Tuấn - Trực Ban Điện Lực',
      avatarRole: 'Tổ Trưởng Tổ Thu Cước & Cắt Điện',
      organization: 'Tổng Công Ty Điện Lực TP - EVN',
      contactHandle: '1900-1006 (Số Điện Lực Giả Mạo)',
    },
    initialMessage:
      '⚡ "[THÔNG BÁO CẮT ĐIỆN KHẨN CẤP]: Hồ sơ khách hàng mã PE05000214xxx còn nợ tiền điện kỳ 2 số tiền 2.850.000 VNĐ. Hệ thống sẽ tự động ngắt điện toàn bộ nhà sau 120 phút. Nếu quý khách đã thanh toán, vui lòng tải ứng dụng CSKH EVN tại https://cskh-evnspc-vn.cc/evn.apk để bộ phận kỹ thuật hủy lệnh cắt điện ngay lập tức."',
    systemContext:
      'Mô phỏng kẻ lừa đảo mạo danh nhân viên Điện lực EVN. Dùng đòn sợ hãi (bị cắt điện ảnh hưởng kinh doanh/sinh hoạt) và thời hạn 2 giờ (Urgency). Mục tiêu chính là lừa nạn nhân tải và cài đặt tệp tin mã độc Android (.APK) có quyền trợ năng (Accessibility Service) để chiếm đoạt tài khoản ngân hàng và đọc mã OTP.',
    tactics: ['Fear', 'Urgency', 'Authority', 'Convenience Bias'],
    hints: [
      { level: 1, text: 'Tổng công ty Điện lực EVN không bao giờ gửi link tải file .APK qua tin nhắn hoặc Zalo.' },
      { level: 2, text: 'Mọi ứng dụng chính thức của EVN (như EVNHANOI, EVNHCMC, EVNSPC) đều chỉ được tải từ Google Play Store và Apple App Store.' },
      { level: 3, text: 'Mở ứng dụng ngân hàng hoặc ví điện tử chính thống để tra cứu nợ cước điện theo đúng mã khách hàng PE...' },
    ],
    counterScripts: [
      {
        situation: 'Kẻ mạo danh hối thúc cài app APK để không bị cắt điện',
        recommendedText: 'Tôi sẽ gọi trực tiếp lên tổng đài chăm sóc khách hàng 1900 6769 của Tổng công ty Điện lực để tra cứu mã hóa đơn tiền điện của nhà mình.',
        rationale: 'Chặn đứng âm mưu dụ cài mã độc và xác minh qua kênh tổng đài chính thống.',
      },
    ],
    learningObjectives: [
      'Nhận diện thủ đoạn gửi link tải file cài đặt .APK nguy hiểm ngoài chợ ứng dụng',
      'Nắm vững phương pháp tra cứu hóa đơn điện trực tiếp trên app ngân hàng / ví điện tử',
    ],
  },
  {
    id: 'tax-authority-vat-refund',
    title: 'Mạo Danh Cục Thuế Thông Báo Hoàn Thuế Thu Nhập Cá Nhân',
    subtitle: 'Kẻ giả danh cán bộ thuế hỗ trợ hoàn thuế 18.5 triệu, dụ cài "Ứng Dụng Thuế Điện Tử eTax Mobile" bản cài ngoài',
    category: 'Government',
    channel: 'phone',
    difficulty: 'Advanced',
    estimatedMinutes: 4,
    ageGroup: 'Adults',
    targetPersona: 'Người Lao Động / Kế Toán / Hộ Kinh Doanh',
    attackerProfile: {
      name: 'Vũ Minh Hải - Cán Bộ Thuế',
      avatarRole: 'Chuyên Viên Hỗ Trợ Kê Khai Thuế',
      organization: 'Chi Cục Thuế Thành Phố',
      contactHandle: '024-3882-9911 / Zalo Thuế Điện Tử',
    },
    initialMessage:
      '🏛️ "Chào anh/chị, tôi là cán bộ Chi cục Thuế. Hồ sơ quyết toán thuế TNCN năm vừa qua của anh/chị có số tiền nộp thừa 18.520.000 VNĐ đủ điều kiện hoàn trả về tài khoản. Hạn chót phê duyệt hoàn thuế là 17h00 hôm nay. Tôi đã gửi đường dẫn Cổng Dịch Vụ Thuế https://gdt-gov-vn-dvc.site/etax.apk, anh/chị cài đặt để định danh eTax nhận tiền giải ngân."',
    systemContext:
      'Mô phỏng đòn tấn công mạo danh cơ quan Thuế Nhà Nước cực kỳ tinh vi. Lợi dụng khoản tiền hoàn thuế hấp dẫn (Greed) và thời hạn đóng sổ cuối ngày (Urgency). Ứng dụng APK giả mạo chứa Trojan gián điệp theo dõi bàn phím và quyền Accessibility để tự động chuyển sạch tiền khi nạn nhân mở app ngân hàng.',
    tactics: ['Greed', 'Authority', 'Urgency', 'Confusion'],
    hints: [
      { level: 1, text: 'Website chính thức của Tổng cục Thuế luôn có đuôi tên miền quốc gia ".gov.vn" (như gdt.gov.vn).' },
      { level: 2, text: 'Cán bộ Thuế KHÔNG BAO GIỜ gọi điện yêu cầu công dân cài app qua đường link lạ đuôi .site, .top, .cc.' },
      { level: 3, text: 'Mọi thủ tục hoàn thuế đều thực hiện trên cổng https://thuedientu.gdt.gov.vn hoặc app eTax Mobile tải trực tiếp từ App Store / CH Play.' },
    ],
    counterScripts: [
      {
        situation: 'Kẻ giả danh hướng dẫn bấm link cài đặt eTax ngoài luồng',
        recommendedText: 'Tôi sẽ tự đăng nhập vào cổng thông tin Thuế điện tử thuedientu.gdt.gov.vn bằng tài khoản định danh VNeID để kiểm tra thông báo quyết toán thuế.',
        rationale: 'Từ chối cài app không rõ nguồn gốc và kiểm tra thông tin trên cổng dịch vụ công nhà nước.',
      },
    ],
    learningObjectives: [
      'Phân biệt cổng thông tin chính phủ (.gov.vn) với tên miền giả mạo (.site, .top)',
      'Tuyệt đối không cấp quyền Trợ năng (Accessibility) cho các file APK tải từ Internet',
    ],
  },
  {
    id: 'overseas-gift-customs-fee',
    title: 'Bẫy Tình Cảm & Thùng Quà Kim Cương Từ "Bác Sĩ Quân Y"',
    subtitle: 'Bạn quen qua mạng xưng là bác sĩ quân y gửi kiện hàng triệu USD về VN, đồng bọn giả hải quan đòi phí thông quan',
    category: 'Romance',
    channel: 'messenger',
    difficulty: 'Advanced',
    estimatedMinutes: 5,
    ageGroup: 'Adults',
    targetPersona: 'Người Đang Tìm Kiếm Bạn Đời / Phụ Nữ Độc Thân',
    attackerProfile: {
      name: 'Dr. David Miller & Nữ Nhân Viên Hải Quan Sân Bay',
      avatarRole: 'Bác Sĩ Quân Y & Nhân Viên Giao Hàng Quốc Tế',
      organization: 'Lực Lượng Gìn Giữ Hòa Bình & Cảng Hàng Không',
      contactHandle: 'WhatsApp: +1 (202) 555-0143 / Zalo Hải Quan',
    },
    initialMessage:
      '💍 "My love, anh vừa gửi về cho em thùng đồ chứa toàn bộ tài sản tích cóp 2.500.000 USD tiền mặt và giấy tờ hưu trí để chuẩn bị sang Việt Nam cưới em. Sáng nay bên Hải quan sân bay Tân Sơn Nhất báo hàng đã về đến nơi nhưng đang bị tạm giữ do chưa đóng phí an ninh quốc tế 35.000.000 VNĐ. Em hãy chuyển giúp anh vào tài khoản thu hộ của hải quan để họ giao tận nhà cho em nhé!"',
    systemContext:
      'Mô phỏng đòn tấn công bẫy tình yêu kết hợp lừa đảo thùng quà quốc tế (Romance / Parcel Scam). Kẻ gian xây dựng mối quan hệ tình cảm sâu đậm, tạo dựng niềm tin tuyệt đối rồi dàn cảnh kiện hàng triệu đô bị giữ lại. Sau đó đóng vai nhân viên hải quan hoặc hải quan sân bay gọi điện đe dọa nếu không nộp phí phạt sẽ bị công an điều tra tội buôn lậu ngoại tệ.',
    tactics: ['Romance', 'Greed', 'Fear', 'Isolation', 'Authority'],
    hints: [
      { level: 1, text: 'Hải quan sân bay không bao giờ yêu cầu người dân chuyển tiền phí thông quan vào số tài khoản cá nhân cá nhân.' },
      { level: 2, text: 'Theo luật hàng không quốc tế, tiền mặt và vàng bạc kim cương số lượng lớn không bao giờ được gửi bưu phẩm thông thường.' },
      { level: 3, text: 'Đây là kịch bản lừa đảo kinh điển của các băng nhóm tội phạm xuyên quốc gia nhằm vào những người nhẹ dạ cả tin.' },
    ],
    counterScripts: [
      {
        situation: 'Đối phương ép nộp phí phạt hải quan để nhận kiện hàng triệu đô',
        recommendedText: 'Nếu kiện hàng có chứa tiền mặt vi phạm quy định hải quan, tôi đề nghị cơ quan chức năng tiến hành lập biên bản tịch thu và xử lý theo quy định của pháp luật Việt Nam.',
        rationale: 'Cắt đứt tâm lý tham lam và sợ hãi, bẻ gãy kịch bản tống tiền phí thông quan.',
      },
    ],
    learningObjectives: [
      'Nhận diện các dấu hiệu nhận biết bẫy tình cảm xuyên biên giới (Romance Scam)',
      'Hiểu rõ quy trình làm việc và thu thuế/phí chính thống của Hải quan Việt Nam',
    ],
  },
  {
    id: 'tiktok-affiliate-vip-rebate',
    title: 'Cộng Tác Viên Đẩy Đơn Hàng TikTok Shop Nhận Hoa Hồng Khủng',
    subtitle: 'Mồi nhử làm nhiệm vụ xem video, chốt đơn ảo hoàn tiền 130%, sau đó dẫn dụ vào nhiệm vụ nạp hàng chục triệu',
    category: 'Jobs',
    channel: 'messenger',
    difficulty: 'Intermediate',
    estimatedMinutes: 4,
    ageGroup: 'Teens',
    targetPersona: 'Học Sinh / Sinh Viên / Mẹ Bỉm Sữa Kiếm Tiền Online',
    attackerProfile: {
      name: 'Trợ Lý Lan Anh - Trưởng Nhóm TikTok MCN',
      avatarRole: 'Quản Lý Điều Phối Chiến Dịch Quảng Cáo',
      organization: 'Mạng Lưới Đối Tác TikTok MCN Việt Nam',
      contactHandle: 'Telegram: @lananh_mcn_tiktok / Group VIP 200 members',
    },
    initialMessage:
      '📱 "Chúc mừng bạn đã hoàn thành nhiệm vụ 1 và nhận 150.000 VNĐ hoa hồng về tài khoản! 🎉 Hiện hệ thống đang mở Nhiệm vụ Cấp 3 (Đơn hàng thương mại đặc quyền): Bạn nạp 15.000.000 VNĐ để giữ chỗ đơn hàng máy ảnh Sony, sau 10 phút hệ thống tự động hoàn gốc + 35% hoa hồng là 20.250.000 VNĐ. Nếu bỏ qua trong 15 phút, tài khoản sẽ bị đóng băng tiền thưởng trước đó!"',
    systemContext:
      'Mô phỏng bẫy lừa đảo việc làm online thả con săn sắt bắt con cá rô. Ban đầu kẻ lừa đảo cho nạn nhân rút tiền thật vài chục nghìn để tạo lòng tin (Foot-in-the-door). Khi số tiền nhiệm vụ lên đến hàng chục triệu, chúng viện cớ sai cú pháp, điểm tín nhiệm thấp, lỗi hệ thống để ép nạn nhân nạp thêm liên tục cho đến khi kiệt quệ.',
    tactics: ['Greed', 'Social Proof', 'Urgency', 'Reciprocity'],
    hints: [
      { level: 1, text: 'Các đơn hàng đầu tiên được trả tiền thật là "mồi nhử" để bạn tin tưởng nạp số tiền lớn hơn.' },
      { level: 2, text: 'Trong nhóm Telegram, 99% thành viên khoe nhận tiền đều là tài khoản chim mồi (bot) của kẻ lừa đảo.' },
      { level: 3, text: 'Không có công việc nào kiếm tiền dễ dàng bằng cách "nạp tiền để chốt đơn ảo nhận hoa hồng 30%".' },
    ],
    counterScripts: [
      {
        situation: 'Trưởng nhóm Telegram ép nạp thêm 15 triệu để cứu số tiền cũ',
        recommendedText: 'Tôi sẽ dừng tham gia tại đây. Bất kỳ công việc nào yêu cầu nạp tiền cá nhân để thực hiện nhiệm vụ đều là lừa đảo vi phạm pháp luật.',
        rationale: 'Chấp nhận cắt lỗ số tiền nhỏ ban đầu, kiên quyết không nạp thêm vào hố sâu lừa đảo.',
      },
    ],
    learningObjectives: [
      'Giải mã bẫy tâm lý "Tâm lý chi phí chìm" (Sunk Cost Fallacy) khiến nạn nhân càng nạp càng mất',
      'Nhận biết các nhóm Telegram/Zalo chim mồi giăng bẫy đa cấp',
    ],
  },
  {
    id: 'fake-bank-digital-loan-disbursement',
    title: 'Bẫy Vay Tiền Online: "Sai Số Tài Khoản, Bắt Đóng Phí Bảo Hiểm"',
    subtitle: 'Duyệt vay cấp tốc 80 triệu không thế chấp, nhưng sau đó báo lỗi số tài khoản và ép chuyển tiền cọc sửa hồ sơ',
    category: 'Banking',
    channel: 'messenger',
    difficulty: 'Intermediate',
    estimatedMinutes: 3,
    ageGroup: 'Adults',
    targetPersona: 'Người Cần Vốn Gấp / Lao Động Tự Do',
    attackerProfile: {
      name: 'Phạm Thành Long - Trưởng Phòng Thẩm Định Tín Dụng',
      avatarRole: 'Chuyên Viên Phê Duyệt Hồ Sơ Vay Online',
      organization: 'Ngân Hàng Số VP-Online / Tài Chính Tiêu Dùng',
      contactHandle: 'Zalo: Hỗ Trợ Giải Ngân Cấp Tốc 24/7',
    },
    initialMessage:
      '💳 "Hồ sơ vay 80.000.000 VNĐ lãi suất ưu đãi 0.6%/tháng của anh/chị đã được phê duyệt thành công! Tuy nhiên khi giải ngân, hệ thống báo lỗi: Quý khách nhập sai 1 số tài khoản ngân hàng nhận tiền. Khoản vay hiện đang bị phong tỏa. Yêu cầu anh/chị đóng 16.000.000 VNĐ (20% phí bảo hiểm xác minh) vào tài khoản ủy thác để mở khóa giải ngân toàn bộ 96 triệu trong 5 phút."',
    systemContext:
      'Mô phỏng thủ đoạn lừa đảo vay tiền qua app/website tài chính ma. Kẻ gian cố tình chỉnh sửa số tài khoản của nạn nhân trong hệ thống để tạo lỗi giả mạo, sau đó dọa rằng nếu không nộp tiền sửa hồ sơ sẽ bị khởi kiện tội lừa đảo chiếm đoạt tài sản ngân hàng và vẫn phải trả lãi hàng tháng cho khoản vay 80 triệu.',
    tactics: ['Fear', 'Authority', 'Urgency', 'Confusion'],
    hints: [
      { level: 1, text: 'Các ngân hàng và công ty tài chính hợp pháp KHÔNG BAO GIỜ thu phí giải ngân hoặc bắt đóng tiền trước khi nhận khoản vay.' },
      { level: 2, text: 'Thủ đoạn "nhập sai số tài khoản" là chiêu trò lập trình cố tình của các web cho vay lừa đảo.' },
      { level: 3, text: 'Nếu chưa nhận được tiền giải ngân thì không có bất kỳ hợp đồng vay nào có hiệu lực pháp lý.' },
    ],
    counterScripts: [
      {
        situation: 'Kẻ cho vay dọa kiện tội chiếm đoạt nếu không đóng 16 triệu sửa hồ sơ',
        recommendedText: 'Tôi chưa nhận được 1 đồng giải ngân nào từ phía các anh. Tôi yêu cầu hủy bỏ toàn bộ hồ sơ đăng ký vay này ngay lập tức.',
        rationale: 'Khẳng định quyền lợi pháp lý, không bị uy hiếp bởi các lời dọa nạt khởi kiện vô căn cứ.',
      },
    ],
    learningObjectives: [
      'Nắm vững nguyên tắc vàng: Không có tổ chức tín dụng hợp pháp nào thu phí trước khi giải ngân',
      'Cách phân biệt ứng dụng vay tiền chính thống với các app vay tiền ma',
    ],
  },
  {
    id: 'facebook-hacked-borrow-urgent',
    title: 'Hack Tài Khoản Mạng Xã Hội Mượn Tiền Cấp Bách & Nhận Tiền Hộ',
    subtitle: 'Tài khoản Facebook của bạn thân nhắn tin mượn 25 triệu chữa bệnh cho mẹ, kèm số tài khoản trùng tên',
    category: 'Romance',
    channel: 'messenger',
    difficulty: 'Advanced',
    estimatedMinutes: 3,
    ageGroup: 'All',
    targetPersona: 'Bạn Bè / Đồng Nghiệp / Người Quen Trên Mạng',
    attackerProfile: {
      name: 'Lê Hoàng (Tài Khoản Facebook Bị Chiếm Quyền)',
      avatarRole: 'Bạn Thân Đại Học',
      organization: 'Messenger Chat Trực Tuyến',
      contactHandle: 'Facebook Messenger Chính Chủ',
    },
    initialMessage:
      '💬 "Bạn ơi, mẹ mình đang nằm phòng cấp cứu ở Viện Tim cần đóng cọc viện phí gấp 25 triệu mà tài khoản ngân hàng của mình đang bị vượt hạn mức ngày. Bạn chuyển khoản tạm ứng giúp mình 25 triệu vào số tài khoản bác sĩ viện trưởng này với, tí em gái mình đi rút tiền mặt về mình chuyển trả lại bạn liền!"',
    systemContext:
      'Mô phỏng đòn tấn công chiếm đoạt tài khoản mạng xã hội (Account Takeover - ATO). Kẻ gian đọc trộm lịch sử tin nhắn cũ để bắt chước phong cách xưng hô thân mật, sử dụng tình huống hiểm nghèo (Bệnh viện cấp cứu) để nạn nhân không nỡ từ chối và không kịp suy nghĩ kiểm chứng.',
    tactics: ['Romance', 'Urgency', 'Social Proof', 'Fear'],
    hints: [
      { level: 1, text: 'Dù tin nhắn gửi từ đúng tài khoản Facebook của bạn thân, tài khoản đó rất có thể đã bị hacker chiếm đoạt.' },
      { level: 2, text: 'Kẻ gian thường dùng tài khoản ngân hàng rác trùng tên (mua lại) để đánh lừa thị giác nạn nhân.' },
      { level: 3, text: 'Luôn gọi điện thoại trực tiếp vào số SIM di động thông thường hoặc gọi video call yêu cầu người đó làm động tác ngẫu nhiên để xác minh.' },
    ],
    counterScripts: [
      {
        situation: 'Nhận được tin nhắn nhờ chuyển tiền gấp từ nick Facebook bạn thân',
        recommendedText: 'Tôi sẽ gọi trực tiếp vào số điện thoại di động thông thường trong danh bạ của bạn để nghe giọng và xác nhận trước khi chuyển tiền nhé.',
        rationale: 'Quy tắc vàng xác minh đa kênh độc lập khi có yêu cầu liên quan đến tài chính.',
      },
    ],
    learningObjectives: [
      'Hình thành phản xạ gọi điện thoại xác thực danh bạ chính chủ trước mọi yêu cầu mượn tiền',
      'Hiểu rõ cơ chế hack tài khoản Facebook/Zalo qua link bình chọn hoặc mã OTP',
    ],
  },
  {
    id: 'hotel-booking-combo-travel',
    title: 'Lừa Đảo Combo Du Lịch 5 Sao & Voucher Nghỉ Dưỡng Giá Siêu Rẻ',
    subtitle: 'Fanpage tick xanh giả mạo rao bán combo vé máy bay + resort Phú Quốc 3N2Đ chỉ 999k, ép chuyển cọc giữ slot',
    category: 'Marketplace',
    channel: 'messenger',
    difficulty: 'Beginner',
    estimatedMinutes: 3,
    ageGroup: 'All',
    targetPersona: 'Khách Du Lịch / Gia Đình Lên Kế Hoạch Nghỉ Lễ',
    attackerProfile: {
      name: 'Tư Vấn Viên Thu Trang - Vinpearl Travel Deal',
      avatarRole: 'Chuyên Viên CSKH & Giữ Slot Khuyến Mãi',
      organization: 'Hệ Thống Phân Phối Voucher Nghỉ Dưỡng Độc Quyền',
      contactHandle: 'Hotline/Zalo OA: 0912-345-678',
    },
    initialMessage:
      '🏖️ "Dạ chào anh/chị! Chương trình Tri Ân Mùa Hè của Resort 5 sao chỉ còn đúng 2 Combo cuối cùng giá sốc 999.000 VNĐ/người (Bao gồm vé máy bay khứ hồi + 2 đêm Villa hồ bơi riêng + buffet 3 bữa). Vì số lượng có hạn, anh/chị vui lòng chuyển khoản đặt cọc 100% là 1.998.000 VNĐ trong 10 phút để bên em xuất mã code phòng điện tử ngay ạ!"',
    systemContext:
      'Mô phỏng bẫy lừa đảo du lịch mùa cao điểm. Kẻ gian tạo Fanpage giả mạo tên các resort, khách sạn nổi tiếng, chạy quảng cáo voucher giá rẻ không tưởng (phi thực tế) để đánh vào lòng tham (Greed) và tâm lý sợ bỏ lỡ cơ hội hời (FOMO / Scarcity). Sau khi nhận tiền cọc, chúng sẽ chặn tin nhắn hoặc gửi mã code phòng giả mạo.',
    tactics: ['Greed', 'Urgency', 'Convenience Bias'],
    hints: [
      { level: 1, text: 'Giá combo 999k cho cả vé máy bay khứ hồi và khách sạn 5 sao là mức giá phi lý, không thể có thật.' },
      { level: 2, text: 'Kiểm tra độ uy tín của Fanpage: xem ngày tạo trang, lịch sử đổi tên, số lượng đánh giá thực tế.' },
      { level: 3, text: 'Gọi điện trực tiếp đến số hotline của khách sạn/resort chính hãng để hỏi xem có liên kết chương trình khuyến mãi này hay không.' },
    ],
    counterScripts: [
      {
        situation: 'Fanpage du lịch ép chuyển cọc 100% trong 10 phút để giữ giá khuyến mãi',
        recommendedText: 'Tôi sẽ gọi trực tiếp đến số hotline chính thức của resort công bố trên trang chủ để xác minh đại lý phân phối và mã chương trình này.',
        rationale: 'Từ chối các ưu đãi giá rẻ bất thường và kiểm chứng qua đơn vị cung cấp dịch vụ gốc.',
      },
    ],
    learningObjectives: [
      'Nhận diện các dấu hiệu của bẫy lừa đảo du lịch giá rẻ mùa cao điểm',
      'Kỹ năng kiểm tra tính xác thực của Fanpage bán hàng trực tuyến',
    ],
  },
];

