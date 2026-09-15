export interface DeepfakeQuizItem {
  id: string;
  title: string;
  context: string;
  mediaType: 'audio' | 'visual';
  category: 'Voice Clone' | 'Video Call' | 'ID Verification' | 'Public Speech' | 'Workplace Audio' | 'Social Selfie';
  verdict: 'real' | 'ai';
  difficulty: 'Dễ' | 'Trung Bình' | 'Khó' | 'Chuyên Gia';
  
  // Audio specific attributes
  audioData?: {
    transcript: string;
    speakerName: string;
    ambientDescription: string;
    sampleDuration: string;
    voicePitch: number; // 0.8 to 1.3
    voiceRate: number; // 0.85 to 1.15
    isMetallic: boolean;
    waveformBars: number[];
  };

  // Visual specific attributes
  visualData?: {
    subjectTitle: string;
    imagePrompt?: string;
    // SVG graphic generator type or mockup depiction
    visualScenarioType:
      | 'zalo_videocall'
      | 'id_card'
      | 'investor_selfie'
      | 'traffic_officer_call'
      | 'real_courier_selfie'
      | 'real_family_gathering'
      | 'real_traffic_scene'
      | 'bank_certificate'
      | 'real_student_id';
    landmarks: {
      label: string;
      x: number; // percentage
      y: number; // percentage
      isArtifact: boolean;
      description: string;
    }[];
  };

  forensicExplanation: {
    summary: string;
    telltaleSigns: string[];
    technicalAnalysis: string;
    defenseRule: string;
  };

  xpReward: number;
}

export const DEEPFAKE_QUIZ_DATA: DeepfakeQuizItem[] = [
  {
    id: 'dfq-1',
    title: 'Cuộc Gọi Khẩn Cấp: Giọng Nói "Con Trai" Xin Tiền Viện Phí',
    context: 'Bạn nhận được cuộc gọi từ số máy lạ (+84 912 xxx 889). Giọng nói bên kia nghe rất giống con trai bạn, đang khóc nấc xin chuyển gấp 30 triệu đồng vì bị tai nạn xe.',
    mediaType: 'audio',
    category: 'Voice Clone',
    verdict: 'ai',
    difficulty: 'Trung Bình',
    audioData: {
      speakerName: 'Giọng con trai (Mô phỏng AI)',
      transcript: 'Mẹ ơi, con đang đi xe máy thì bị đâm vào người ta. Người ta đang nằm viện cấp cứu mẹ ơi. Bác sĩ bảo phải nộp 30 triệu tiền phẫu thuật gấp trong vòng 15 phút không thì người nhà họ làm ầm lên. Mẹ chuyển vào số tài khoản bác sĩ này giúp con với, con mượn máy bác sĩ gọi về đấy!',
      ambientDescription: 'Nền âm thanh phòng kín quá tĩnh lặng, không có tiếng ồn phòng cấp cứu thực tế',
      sampleDuration: '00:14',
      voicePitch: 1.05,
      voiceRate: 1.02,
      isMetallic: true,
      waveformBars: [20, 35, 75, 90, 85, 40, 60, 80, 75, 30, 85, 90, 80, 45, 60, 85, 90, 50, 20],
    },
    forensicExplanation: {
      summary: 'Đây là GIỌNG NÓI TỔNG HỢP AI (Deepfake Voice Clone) sử dụng mô hình học từ các video clip TikTok/Facebook của người thân.',
      telltaleSigns: [
        'Mặc dù giọng nói đang gào khóc nhưng cao độ (pitch) và ngữ điệu đều đều, thiếu tiếng hít thở gấp (breath intake) tự nhiên của người đang hoảng loạn.',
        'Âm sắc có dải tần số cao bị cắt cụt (high-frequency cutoff > 14kHz), xuất hiện âm rè kim loại siêu nhỏ.',
        'Môi trường âm thanh nền hoàn toàn yên tĩnh, không hề có tiếng còi xe, tiếng còi cấp cứu hay tiếng ồn bệnh viện thực tế.'
      ],
      technicalAnalysis: 'Kẻ lừa đảo sử dụng các công cụ Voice Cloning (như ElevenLabs, RVC) huấn luyện từ 10-30 giây giọng nói công khai trên mạng xã hội. Các mô hình TTS tổng hợp thường gặp lỗi khi biểu đạt cảm xúc cực đoan như hoảng loạn hay đau đớn.',
      defenseRule: 'Ngắt máy ngay lập tức. Gọi thẳng vào số điện thoại lưu trong danh bạ của con. Hỏi câu hỏi "Mật khẩu an toàn gia đình" mà chỉ hai mẹ con biết.'
    },
    xpReward: 50,
  },
  {
    id: 'dfq-2',
    title: 'Khung Hình Video Call: Cán Bộ Công An Phường Gọi Làm Việc',
    context: 'Cuộc gọi video ngắn qua Zalo từ tài khoản "Thiếu tá Nguyễn Văn Bình - Trực ban điều tra", yêu cầu bạn kê khai tài sản để phục vụ điều tra chuyên án.',
    mediaType: 'visual',
    category: 'Video Call',
    verdict: 'ai',
    difficulty: 'Dễ',
    visualData: {
      subjectTitle: 'Khung hình video call người đàn ông mặc sắc phục công an',
      visualScenarioType: 'traffic_officer_call',
      landmarks: [
        {
          label: 'Phù hiệu & Cầu vai',
          x: 28,
          y: 68,
          isArtifact: true,
          description: 'Cầu vai bị nhòe mờ và gắn sai vị trí so với Điều lệnh Công an nhân dân Việt Nam.'
        },
        {
          label: 'Mắt & Cử động mi mắt',
          x: 52,
          y: 35,
          isArtifact: true,
          description: 'Mắt chớp rất ít và ánh nhìn vô hồn, không có phản xạ co giãn đồng tử tự nhiên theo ánh sáng.'
        },
        {
          label: 'Đường viền cằm & Cổ',
          x: 50,
          y: 56,
          isArtifact: true,
          description: 'Xuất hiện viền mờ ranh giới (blending artifact) giữa khuôn mặt ghép và phần cổ áo.'
        }
      ]
    },
    forensicExplanation: {
      summary: 'Hình ảnh được TẠO BẰNG CÔNG NGHỆ DEEPFAKE HOÁN ĐỔI KHUÔN MẶT (Real-time Face-Swap) trên nền video clip có sẵn.',
      telltaleSigns: [
        'Vùng cổ và cằm xuất hiện vệt nhòe và bóng mờ khi cử động đầu.',
        'Sắc phục công an bị sai lệch chi tiết: quân hàm ngược, phù hiệu không đúng quy chuẩn.',
        'Khẩu hình miệng phát âm lệch nhịp (desync) so với tiếng nói truyền tới.'
      ],
      technicalAnalysis: 'Deepfake thời gian thực qua video call đòi hỏi máy tính cấu hình cao để xử lý frame-by-frame, dẫn đến hiện tượng khung hình giật cục, viền mặt rung rinh và độ phân giải khuôn mặt không đồng nhất với phần thân áo.',
      defenseRule: 'Công an Việt Nam KHÔNG BAO GIỜ gọi video call hay làm việc qua mạng xã hội. Chặn số ngay lập tức.'
    },
    xpReward: 50,
  },
  {
    id: 'dfq-3',
    title: 'Tin Nhắn Thoại Zalo: Người Bạn Thân Hẹn Cuối Tuần Đi Cà Phê',
    context: 'Tin nhắn thoại (voice note) gửi từ tài khoản Zalo của một người bạn quen đã nhiều năm, hỏi thăm sức khỏe và hẹn gặp mặt cuối tuần.',
    mediaType: 'audio',
    category: 'Workplace Audio',
    verdict: 'real',
    difficulty: 'Khó',
    audioData: {
      speakerName: 'Bạn thân (Người thật)',
      transcript: 'Alo Dũng à, cuối tuần này rảnh không? Mấy anh em định hẹn nhau ra quán cà phê Highland chỗ ngã tư bàn việc hôm trước. À mà nhớ mang theo cái USB tài liệu dự án nhé, có gì báo lại tao trước thứ Sáu.',
      ambientDescription: 'Có tiếng quạt gió thoang thoảng, tiếng thở tự nhiên và tiếng lạch cạch gõ bàn phím',
      sampleDuration: '00:11',
      voicePitch: 0.98,
      voiceRate: 1.0,
      isMetallic: false,
      waveformBars: [15, 25, 45, 60, 50, 70, 80, 65, 40, 20, 55, 75, 60, 80, 65, 45, 30, 15],
    },
    forensicExplanation: {
      summary: 'Đây là GIỌNG NÓI NGƯỜI THẬT NGUYÊN BẢN (Authentic Human Voice).',
      telltaleSigns: [
        'Có tiếng hít thở nhẹ lấy hơi tự nhiên trước khi phát âm câu mới.',
        'Tạp âm nền phong phú và liên tục: tiếng quạt gió nhẹ, tiếng gõ bàn phím không có dấu hiệu bị cắt ghép lọc tần số.',
        'Cách ngắt nhịp và nhấn nhá các thanh điệu tiếng Việt (dấu hỏi, ngã, nặng) rất mượt mà và tự nhiên, không bị biến dạng cơ học.'
      ],
      technicalAnalysis: 'Phổ âm thanh thể hiện đầy đủ các dải tần số hài âm (harmonics) từ 100Hz đến 20.000Hz, cùng với đặc trưng âm môi (/m/, /b/) có áp lực gió thực vào màng micro.',
      defenseRule: 'Âm thanh tự nhiên không có dấu hiệu dồn ép hay đòi hỏi chuyển tiền khẩn cấp.'
    },
    xpReward: 50,
  },
  {
    id: 'dfq-4',
    title: 'Ảnh Chân Dung Đại Diện: Chuyên Gia Đầu Tư Tài Chính Quốc Tế',
    context: 'Ảnh đại diện của một tài khoản Telegram vừa chủ động nhắn tin rủ bạn tham gia nhóm "Đầu tư quỹ ngoại sinh lời 40%/tháng".',
    mediaType: 'visual',
    category: 'Social Selfie',
    verdict: 'ai',
    difficulty: 'Trung Bình',
    visualData: {
      subjectTitle: 'Ảnh chân dung doanh nhân thành đạt trên phông nền cao ốc',
      visualScenarioType: 'investor_selfie',
      landmarks: [
        {
          label: 'Đồng tử & Ánh mắt',
          x: 48,
          y: 36,
          isArtifact: true,
          description: 'Đốm sáng phản chiếu (catchlight) trong hai mắt hoàn toàn khác nhau: mắt trái hình tròn, mắt phải hình đa giác méo.'
        },
        {
          label: 'Bông tai & Vành tai',
          x: 24,
          y: 44,
          isArtifact: true,
          description: 'Bông tai một bên bị hòa tan dính liền vào dái tai, vành tai hai bên không đối xứng hình học.'
        },
        {
          label: 'Hậu cảnh tòa nhà',
          x: 78,
          y: 26,
          isArtifact: true,
          description: 'Các đường thẳng của khung cửa sổ tòa nhà phía sau bị cong vênh và đứt gãy vô lý.'
        }
      ]
    },
    forensicExplanation: {
      summary: 'Hình ảnh được TẠO HOÀN TOÀN BẰNG AI GENERATIVE (Mô hình StyleGAN / Diffusion).',
      telltaleSigns: [
        'Hai mắt phản chiếu hai nguồn sáng khác nhau (lỗi kinh điển của thuật toán sinh ảnh khuôn mặt).',
        'Hoa tai, kính mắt hoặc răng thường bị biến dạng, dính chùm hoặc thiếu cấu trúc phân tách.',
        'Da mặt láng bóng phi tự nhiên nhưng các sợi tóc ở rìa lại nhòe mờ tan biến vào nền.'
      ],
      technicalAnalysis: 'Các mô hình StyleGAN sinh khuôn mặt người ảo (ThisPersonDoesNotExist) thường đặt hai con mắt ở vị trí chính xác cố định ở tọa độ trung tâm, nhưng không thể duy trì tính nhất quán quang học 3D của môi trường xung quanh.',
      defenseRule: 'Cảnh giác cao độ trước các tài khoản dùng ảnh đại diện "trai xinh gái đẹp" mời chào đầu tư tài chính. Tìm kiếm ngược hình ảnh bằng Google Lens.'
    },
    xpReward: 50,
  },
  {
    id: 'dfq-5',
    title: 'Ảnh Chụp Selfie: Shipper Giao Hàng Chụp Xác Nhận Trước Cổng',
    context: 'Một shipper gửi ảnh chụp qua Zalo chứng minh đã giao kiện hàng trị giá 250.000đ trước cửa nhà bạn theo yêu cầu.',
    mediaType: 'visual',
    category: 'ID Verification',
    verdict: 'real',
    difficulty: 'Trung Bình',
    visualData: {
      subjectTitle: 'Ảnh chụp vội bằng điện thoại trước cổng nhà',
      visualScenarioType: 'real_courier_selfie',
      landmarks: [
        {
          label: 'Nhiễu hạt cảm biến máy ảnh (ISO Grain)',
          x: 82,
          y: 18,
          isArtifact: false,
          description: 'Nhiễu hạt ánh sáng phân bố đồng đều khắp bức ảnh theo đúng cảm biến camera điện thoại chụp trời chập tối.'
        },
        {
          label: 'Bóng đổ & Nguồn sáng',
          x: 52,
          y: 75,
          isArtifact: false,
          description: 'Góc nghiêng bóng đổ của chân shipper trùng khớp hoàn hảo với bóng của bậc thềm và thùng hàng.'
        },
        {
          label: 'Biển số nhà & Chữ viết',
          x: 20,
          y: 30,
          isArtifact: false,
          description: 'Biển số nhà sắc nét, chữ in cơ học chuẩn xác không có hiện tượng ký tự rác kiểu AI.'
        }
      ]
    },
    forensicExplanation: {
      summary: 'Đây là ẢNH CHỤP THỰC TẾ 100% TỪ ĐIỆN THOẠI (Authentic Camera Photo).',
      telltaleSigns: [
        'Độ nhiễu hạt (noise grain) tự nhiên và đồng nhất trên toàn bộ bề mặt ảnh.',
        'Bóng đổ vật lý logic giữa người, bậc cửa và ánh đèn đường.',
        'Các ký tự trên kiện hàng và số nhà rõ ràng, sắc cạnh, không bị nhòe nét vô nghĩa.'
      ],
      technicalAnalysis: 'Ảnh chụp máy ảnh quang học mang thông tin tiêu cự (focal length), độ mờ do chuyển động (motion blur) theo hướng di chuyển của tay người chụp, không có các đốm nhiễu pattern lặp lại của AI.',
      defenseRule: 'Hình ảnh xác thực, phù hợp với kiện hàng bạn đã đặt trước đó.'
    },
    xpReward: 50,
  },
  {
    id: 'dfq-6',
    title: 'Bản Ghi Âm Lệnh Điều Chuyển Vốn: "Tổng Giám Đốc" Chỉ Thị Gấp',
    context: 'Tin nhắn thoại được gửi tới kế toán viên lúc 17h30 thứ Sáu, giọng của Tổng Giám đốc công ty yêu cầu thanh toán hợp đồng gấp sang tài khoản mới.',
    mediaType: 'audio',
    category: 'Voice Clone',
    verdict: 'ai',
    difficulty: 'Khó',
    audioData: {
      speakerName: 'Tổng Giám đốc (Giọng giả mạo AI)',
      transcript: 'Chị Lan à, tôi đang họp bên Bộ Kế hoạch Đầu tư. Bên đối tác họ vừa giục tiến độ cọc 500 triệu. Chị vào hệ thống duyệt ủy nhiệm chi chuyển sang số tài khoản ngân hàng Quân Đội tôi vừa nhắn nhé. Xong nhắn lại cho tôi, tối tôi về ký hoàn thiện chứng từ sau.',
      ambientDescription: 'Giọng nói rất trơn tru nhưng âm thanh phát âm tên riêng thiếu độ nảy tự nhiên',
      sampleDuration: '00:16',
      voicePitch: 0.95,
      voiceRate: 1.05,
      isMetallic: true,
      waveformBars: [25, 40, 60, 85, 75, 70, 85, 90, 80, 70, 65, 80, 85, 60, 45, 30, 15],
    },
    forensicExplanation: {
      summary: 'Đây là ĐÒN TẤN CÔNG CEO FRAUD BẰNG GIỌNG NÓI CLONE AI (Deepfake Audio Attack).',
      telltaleSigns: [
        'Âm hưởng của các từ như "Ủy nhiệm chi", "Quân Đội" có hiện tượng giật nhẹ và thiếu độ nảy âm học tự nhiên.',
        'Kẻ xấu cố tình tạo bối cảnh "đang họp kín" để ngăn nạn nhân gọi điện thoại trực tiếp kiểm chứng.',
        'Đòi hỏi phá vỡ quy trình kiểm soát tài chính 2 lớp chuẩn của công ty.'
      ],
      technicalAnalysis: 'Kẻ tấn công thu thập giọng nói của CEO từ các video phỏng vấn báo chí hoặc hội thảo trên YouTube. Dù chất âm rất giống, nhưng mô hình AI vẫn gặp khó khăn trong việc mô phỏng hơi thở sâu và ngữ điệu tự nhiên của người Việt.',
      defenseRule: 'TUYỆT ĐỐI KHÔNG CHUYỂN TIỀN. Luôn thực hiện xác thực trực tiếp 2 kênh (gọi lại số nội bộ hoặc gọi video trực tiếp yêu cầu vẫy tay).'
    },
    xpReward: 50,
  },
  {
    id: 'dfq-7',
    title: 'Video Họp Gia Đình Trực Tuyến: Bác Cả Ở Quê Gọi Chúc Tết',
    context: 'Đoạn video call ngắn qua Messenger vào dịp Tết, gia đình bác cả ở quê bật camera chúc Tết mọi người trong gia đình.',
    mediaType: 'visual',
    category: 'Video Call',
    verdict: 'real',
    difficulty: 'Dễ',
    visualData: {
      subjectTitle: 'Hình ảnh gia đình 3 người đang ngồi trò chuyện tại phòng khách',
      visualScenarioType: 'real_family_gathering',
      landmarks: [
        {
          label: 'Cử động tay tương tác tự nhiên',
          x: 42,
          y: 62,
          isArtifact: false,
          description: 'Cánh tay và bàn tay khi vẫy chào che ngang qua khuôn mặt không hề bị vỡ pixel hay biến dạng hình thể.'
        },
        {
          label: 'Ánh sáng phản chiếu phòng khách',
          x: 65,
          y: 35,
          isArtifact: false,
          description: 'Ánh sáng đèn neon trên trần nhà đổ bóng đồng nhất lên cả 3 người và đồ đạc xung quanh.'
        },
        {
          label: 'Hậu cảnh có người đi lại',
          x: 82,
          y: 48,
          isArtifact: false,
          description: 'Có trẻ nhỏ chạy ngang qua phía sau với độ sâu trường ảnh và bóng mờ chuyển động chân thực.'
        }
      ]
    },
    forensicExplanation: {
      summary: 'Đây là VIDEO CUỘC GỌI NGƯỜI THẬT HOÀN TOÀN (Real Video Call).',
      telltaleSigns: [
        'Cử động tay vẫy ngang mặt mượt mà, không bị vỡ mesh hay giật hình (điểm yếu lớn nhất của Deepfake thời gian thực).',
        'Bối cảnh phía sau có chiều sâu, tương tác chuyển động sống động.',
        'Âm thanh cười nói và tiếng đồ đạc va chạm khớp 100% với hình ảnh.'
      ],
      technicalAnalysis: 'Deepfake thời gian thực không thể xử lý mượt mà khi có vật thể che chắn (occlusion) đè lên khuôn mặt như bàn tay, tóc bay, hoặc có nhiều người chuyển động cùng lúc.',
      defenseRule: 'Tương tác chân thực, an toàn.'
    },
    xpReward: 50,
  },
  {
    id: 'dfq-8',
    title: 'Ảnh Thẻ Căn Cước Công Dân (CCCD): Gửi Qua Mạng Xác Thực Vay',
    context: 'Bên "công ty tài chính online" gửi ảnh chụp CCCD gắn chip của họ để tạo niềm tin, yêu cầu bạn chuyển phí cọc hồ sơ giải ngân.',
    mediaType: 'visual',
    category: 'ID Verification',
    verdict: 'ai',
    difficulty: 'Khó',
    visualData: {
      subjectTitle: 'Mặt trước căn cước công dân gắn chip với chân dung sắc nét',
      visualScenarioType: 'id_card',
      landmarks: [
        {
          label: 'Chữ in vi mô (Micro-printing)',
          x: 60,
          y: 42,
          isArtifact: true,
          description: 'Dòng hoa văn bảo an siêu nhỏ trên bề mặt thẻ bị biến thành các đường xoắn ốc vô nghĩa, không đọc được.'
        },
        {
          label: 'Quốc huy & Con dấu',
          x: 22,
          y: 28,
          isArtifact: true,
          description: 'Hình ngôi sao vàng trong Quốc huy bị lệch cánh và viền bông lúa mờ nhòe không đều.'
        },
        {
          label: 'Phản quang mã QR / Chip',
          x: 75,
          y: 70,
          isArtifact: true,
          description: 'Mạch chip kim loại bị vẽ bệt một màu vàng phẳng lì, không có hiệu ứng phản chiếu ánh kim thật.'
        }
      ]
    },
    forensicExplanation: {
      summary: 'Hình ảnh là CĂN CƯỚC CÔNG DÂN GIẢ MẠO DO AI TỔNG HỢP (Synthetic Forged Document).',
      telltaleSigns: [
        'Hoa văn bảo an chống giả của Bộ Công An bị AI vẽ thành các nét vằn vện vô nghĩa.',
        'Quốc huy Việt Nam bị sai lệch chi tiết tỷ lệ ngôi sao và viền lúa.',
        'Chip điện tử và dải phản quang thiếu chiều sâu quang học ba chiều.'
      ],
      technicalAnalysis: 'Các mô hình AI khuếch tán (Diffusion Models) không có hiểu biết hình học về các hoa văn bảo an kỹ thuật cao (Guilloche pattern) và vi văn bản (micro-text) nên thường tạo ra các vết nhòe trừu tượng.',
      defenseRule: 'Không bao giờ tin tưởng ảnh chụp CCCD hay thẻ ngành gửi qua Zalo/Telegram. Kẻ lừa đảo có thể tạo hàng trăm giấy tờ giả mạo trong vài giây.'
    },
    xpReward: 50,
  },
  {
    id: 'dfq-9',
    title: 'Tin Nhắn Thoại: Cô Giáo Chủ Nhiệm Báo Nộp Tiền Ôn Thi Cấp Tốc',
    context: 'Tin nhắn thoại gửi qua nhóm Zalo phụ huynh, giọng nói giống hệt cô giáo chủ nhiệm giục phụ huynh đóng 3.5 triệu tiền tài liệu ôn thi chuyên trước 12h trưa.',
    mediaType: 'audio',
    category: 'Voice Clone',
    verdict: 'ai',
    difficulty: 'Khó',
    audioData: {
      speakerName: 'Cô giáo chủ nhiệm (Giọng clone AI)',
      transcript: 'Kính gửi các bậc phụ huynh, nhà trường vừa mở thêm lớp ôn thi chuyên biệt môn Toán. Chỉ còn 5 suất cuối cùng, phụ huynh nào muốn cho con tham gia thì chuyển khoản 3 triệu rưỡi vào số tài khoản thầy hiệu phó trong tin nhắn này trước 12 giờ trưa nhé.',
      ambientDescription: 'Âm thanh phòng học bị khử sạch tĩnh lặng tuyệt đối, giọng nói có độ nén kim loại ở cuối câu',
      sampleDuration: '00:14',
      voicePitch: 1.15,
      voiceRate: 1.02,
      isMetallic: true,
      waveformBars: [20, 35, 50, 75, 85, 90, 80, 70, 65, 80, 90, 85, 60, 40, 25, 15],
    },
    forensicExplanation: {
      summary: 'Đây là GIỌNG NÓI CLONE AI GIẢ MẠO GIÁO VIÊN (Synthetic Voice Attack).',
      telltaleSigns: [
        'Giọng nói thiếu các quãng ngắt hơi thở tự nhiên của giáo viên khi nói câu dài.',
        'Âm hưởng cuối các từ ngữ "phụ huynh", "toán", "hiệu phó" có vệt vang kim loại nhân tạo.',
        'Yêu cầu chuyển tiền vào số tài khoản cá nhân thay vì nộp qua cổng thanh toán của nhà trường.'
      ],
      technicalAnalysis: 'Kẻ xấu thu thập các đoạn video họp phụ huynh trực tuyến hoặc clip cô giáo giảng bài trên mạng để huấn luyện mô hình Voice Cloning (VITS/ElevenLabs).',
      defenseRule: 'Gọi trực tiếp cho cô giáo hoặc đại diện Hội phụ huynh nhà trường để đối chiếu trước khi chuyển tiền.'
    },
    xpReward: 50,
  },
  {
    id: 'dfq-10',
    title: 'Ảnh Chụp Hiện Trường Va Chạm Xe Giao Thông Ngoài Đường Phố',
    context: 'Bên bảo hiểm gửi ảnh chụp hiện trường một vụ va quẹt nhẹ xe ô tô để làm hồ sơ bồi thường vật chất.',
    mediaType: 'visual',
    category: 'ID Verification',
    verdict: 'real',
    difficulty: 'Trung Bình',
    visualData: {
      subjectTitle: 'Ảnh chụp cận cảnh vết xước trên thân vỏ xe ô tô tại hiện trường',
      visualScenarioType: 'real_traffic_scene',
      landmarks: [
        {
          label: 'Vết trầy xước vật lý & Sơn xe',
          x: 45,
          y: 52,
          isArtifact: false,
          description: 'Vết xước có độ nhám, các mạt sơn vụn nhỏ bám thực tế theo hướng ma sát của kim loại va chạm.'
        },
        {
          label: 'Phản chiếu mặt đường & Nắp capo',
          x: 68,
          y: 38,
          isArtifact: false,
          description: 'Góc phản quang của bầu trời và vạch kẻ đường trên lớp sơn bóng hoàn toàn chuẩn quang học ray-tracing thực tế.'
        },
        {
          label: 'Biển kiểm soát xe phía sau',
          x: 25,
          y: 70,
          isArtifact: false,
          description: 'Biển số xe máy phía xa có độ mờ tiêu cự (DoF) tự nhiên của ống kính camera điện thoại.'
        }
      ]
    },
    forensicExplanation: {
      summary: 'Đây là ẢNH CHỤP QUANG HỌC THẬT 100% TỪ HIỆN TRƯỜNG (Authentic Camera Capture).',
      telltaleSigns: [
        'Vết xước cơ học chân thực với các mảnh vụn sơn li ti theo vector va chạm.',
        'Lớp phản quang trên bề mặt sơn xe tuân thủ hoàn hảo định luật quang học phản xạ.',
        'Độ sâu trường ảnh (Depth of Field) và hạt cảm biến ISO đồng nhất trên toàn khung hình.'
      ],
      technicalAnalysis: 'Camera quang học ghi lại sự suy giảm ánh sáng tự nhiên và các thông số vật lý không bị bóp méo hình dạng như các bộ sinh ảnh AI.',
      defenseRule: 'Hình ảnh xác thực, đủ điều kiện giám định bồi thường bảo hiểm.'
    },
    xpReward: 50,
  },
  {
    id: 'dfq-11',
    title: 'Cuộc Gọi CSKH Nhà Mạng Viettel: Xác Nhận Gói Cước Đã Đăng Ký',
    context: 'Điện thoại viên tổng đài Viettel gọi điện xác nhận quý khách vừa gia hạn gói cước data 4G tháng qua tin nhắn.',
    mediaType: 'audio',
    category: 'Workplace Audio',
    verdict: 'real',
    difficulty: 'Dễ',
    audioData: {
      speakerName: 'Điện thoại viên CSKH (Người thật)',
      transcript: 'Dạ em chào anh Nam, em là Mai bên tổng đài Viettel Telecom. Dạ hệ thống ghi nhận anh vừa đăng ký gói cước ST120K thành công ạ. Em gọi để xác nhận dịch vụ đã kích hoạt và chúc anh trải nghiệm internet tốc độ cao vui vẻ ạ.',
      ambientDescription: 'Có tiếng thì thầm trò chuyện nhỏ của các tổng đài viên khác trong phòng Call Center và tiếng thở nhẹ của điện thoại viên',
      sampleDuration: '00:13',
      voicePitch: 1.0,
      voiceRate: 0.98,
      isMetallic: false,
      waveformBars: [15, 30, 45, 60, 55, 65, 75, 60, 50, 65, 70, 55, 40, 25, 15],
    },
    forensicExplanation: {
      summary: 'Đây là CUỘC GỌI TỔNG ĐÀI VIÊN NGƯỜI THẬT (Authentic Human Call).',
      telltaleSigns: [
        'Tạp âm nền văn phòng Call Center chân thực (tiếng trò chuyện xa xa của các tổng đài viên khác).',
        'Ngữ điệu dạ thưa lễ phép tự nhiên của người Việt Nam, không có hiện tượng giật cục cơ học.',
        'Không yêu cầu cung cấp mã OTP hay chuyển tiền, chỉ là cuộc gọi chăm sóc sau bán hàng.'
      ],
      technicalAnalysis: 'Dải tần âm thanh thoại chuẩn GSM/VoLTE, không phát hiện vết cắt nối âm phổ hoặc nhiễu thuật toán tạo sinh.',
      defenseRule: 'Cuộc gọi thông thường, an toàn.'
    },
    xpReward: 50,
  },
  {
    id: 'dfq-12',
    title: 'Ảnh Chụp Giấy Chứng Nhận Tiền Gửi Tiết Kiệm 5 Tỷ Ngân Hàng',
    context: 'Đối tượng kêu gọi đầu tư gửi ảnh chụp Sổ tiết kiệm 5 tỷ đồng để chứng minh tiềm lực tài chính khủng và uy tín của công ty.',
    mediaType: 'visual',
    category: 'ID Verification',
    verdict: 'ai',
    difficulty: 'Khó',
    visualData: {
      subjectTitle: 'Ảnh chụp phôi giấy chứng nhận tiền gửi có kỳ hạn ngân hàng',
      visualScenarioType: 'bank_certificate',
      landmarks: [
        {
          label: 'Dòng chữ in số tiền & Lãi suất',
          x: 55,
          y: 48,
          isArtifact: true,
          description: 'Chữ số "5.000.000.000 VNĐ" bị sai phông chữ, các chữ số không thẳng hàng và bị nghiêng xiêu vẹo.'
        },
        {
          label: 'Dấu mộc đỏ ngân hàng & Chữ ký',
          x: 76,
          y: 65,
          isArtifact: true,
          description: 'Con dấu tròn bị nhòe các ký tự trong vành cung tròn, chữ trong dấu đỏ biến thành các ký tự vô nghĩa.'
        },
        {
          label: 'Hoa văn dập chìm bảo an',
          x: 30,
          y: 35,
          isArtifact: true,
          description: 'Họa tiết Guilloche chống giả bị biến dạng thành các mảng màu bệt loang lổ không đồng nhất.'
        }
      ]
    },
    forensicExplanation: {
      summary: 'Hình ảnh là SỔ TIẾT KIỆM GIẢ MẠO DO AI TỔNG HỢP (AI Synthetic Bank Document).',
      telltaleSigns: [
        'Con dấu tròn đỏ ngân hàng có các ký tự bên trong bị biến dạng, không đọc được tên chi nhánh hợp lệ.',
        'Phông chữ in số tiền không khớp với chuẩn máy in ma trận hay kim của hệ thống Core Banking ngân hàng.',
        'Hoa văn bảo an chìm của phôi giấy bị mờ nhòe kiểu lỗi khuếch tán AI.'
      ],
      technicalAnalysis: 'AI tạo ảnh không thể tái tạo chính xác văn bản pháp lý và con dấu chuẩn theo Nghị định 30/2020/NĐ-CP về công tác văn thư.',
      defenseRule: 'Không bao giờ tin tưởng tiềm lực tài chính qua ảnh chụp sổ tiết kiệm trên mạng. Mọi giấy tờ đều có thể làm giả bằng AI trong tích tắc.'
    },
    xpReward: 50,
  },
  {
    id: 'dfq-13',
    title: 'Tin Nhắn Thoại Cấp Cứu: Giọng Con Trai Du Học Sinh Bị Giữ Tại Sân Bay',
    context: 'Bản ghi âm giọng nói gửi qua Facebook mẹ: "Mẹ ơi con bị hải quan giữ lại vì hành lý có hàng cấm, mẹ chuyển 50 triệu tiền bảo lãnh gấp kẻo con bị bắt giam".',
    mediaType: 'audio',
    category: 'Voice Clone',
    verdict: 'ai',
    difficulty: 'Khó',
    audioData: {
      speakerName: 'Con trai du học sinh (Giọng giả mạo AI)',
      transcript: 'Mẹ ơi cứu con với! Con vừa đáp xuống sân bay thì bị hải quan giữ lại kiểm tra hành lý. Họ bảo trong vali có đồ cấm, bắt nộp phạt 50 triệu tiền bảo lãnh ngay trong 30 phút. Mẹ chuyển tiền vào số tài khoản anh cán bộ này giúp con gấp!',
      ambientDescription: 'Giọng nói có tiếng khóc mếu giả tạo nhưng nhịp thở ngắt quãng không đồng bộ với âm lượng',
      sampleDuration: '00:15',
      voicePitch: 1.05,
      voiceRate: 1.1,
      isMetallic: true,
      waveformBars: [30, 45, 70, 95, 80, 90, 85, 75, 60, 75, 90, 85, 65, 45, 25, 10],
    },
    forensicExplanation: {
      summary: 'ĐÂY LÀ ĐÒN TẤN CÔNG BẮT CÓC ẢO / CLONE GIỌNG NÓI DU HỌC SINH (Deepfake Voice Extortion).',
      telltaleSigns: [
        'Tiếng khóc mếu cố tình đẩy cao trào để che giấu các vết giật kim loại của công nghệ AI Voice Clone.',
        'Tạo áp lực thời gian cực đoan (30 phút) và đe dọa tù tội để triệt tiêu tư duy phản biện của cha mẹ.',
        'Yêu cầu chuyển tiền vào tài khoản cá nhân của "cán bộ hải quan".'
      ],
      technicalAnalysis: 'Kẻ tấn công cào (scrape) các video TikTok/Reels của du học sinh trên mạng để lấy mẫu âm thanh (Voice Sample). Khi tạo audio, chúng thêm tiếng ồn sân bay nền giả để tăng tính thuyết phục.',
      defenseRule: 'Bình tĩnh lập tức gọi video trực tiếp cho con, hoặc liên hệ Đại sứ quán / Trường học / Bạn cùng phòng của con để xác minh.'
    },
    xpReward: 50,
  },
  {
    id: 'dfq-14',
    title: 'Ảnh Chụp Thẻ Thư Viện & Thẻ Sinh Viên Đại Học Bách Khoa',
    context: 'Một bạn sinh viên chụp ảnh thẻ sinh viên mặt trước để đăng ký nhận ưu đãi tài khoản học thuật trên nền tảng.',
    mediaType: 'visual',
    category: 'ID Verification',
    verdict: 'real',
    difficulty: 'Dễ',
    visualData: {
      subjectTitle: 'Ảnh chụp mặt trước thẻ sinh viên nhựa PVC đặt trên mặt bàn gỗ',
      visualScenarioType: 'real_student_id',
      landmarks: [
        {
          label: 'Vân gỗ mặt bàn & Bóng đổ thẻ',
          x: 80,
          y: 75,
          isArtifact: false,
          description: 'Đường vân gỗ tự nhiên sắc nét, bóng đổ của cạnh thẻ nhựa mềm mại theo hướng đèn bàn học.'
        },
        {
          label: 'Mã vạch Barcode & Logo trường',
          x: 48,
          y: 60,
          isArtifact: false,
          description: 'Mã vạch in sắc cạnh, các vạch đen trắng song song chuẩn xác máy đọc mã vạch công nghiệp.'
        },
        {
          label: 'Góc thẻ hơi mòn do sử dụng',
          x: 18,
          y: 22,
          isArtifact: false,
          description: 'Cạnh nhựa của thẻ có vết xước dăm nhẹ tự nhiên do ma sát để trong ví.'
        }
      ]
    },
    forensicExplanation: {
      summary: 'Đây là ẢNH CHỤP THỰC TẾ 100% CỦA THẺ SINH VIÊN (Authentic Physical Card).',
      telltaleSigns: [
        'Mã vạch và thông tin in bằng công nghệ in nhiệt trên thẻ nhựa PVC sắc nét, không bị biến dạng ký tự.',
        'Các vết xước dăm cơ học tự nhiên ở góc thẻ theo thời gian sử dụng.',
        'Ánh sáng phản chiếu từ bóng đèn bàn học đổ bóng tự nhiên lên vân gỗ mặt bàn.'
      ],
      technicalAnalysis: 'Độ sắc nét của văn bản và mã vạch (Barcode/QR) giữ nguyên độ tương phản đen-trắng tuyệt đối 1:1, không có viền halo mờ của mô hình sinh ảnh AI.',
      defenseRule: 'Thẻ sinh viên thật, thông tin rõ ràng và an toàn.'
    },
    xpReward: 50,
  },
];
