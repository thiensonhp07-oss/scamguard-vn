import { QuishingCase } from '../types';

export const QUISHING_CASES: QuishingCase[] = [
  {
    id: 'quish-parking-meter-overlay',
    title: 'Mã QR Dán Đè Tại Bãi Đỗ Xe / Trụ Đỗ Xe Công Cộng',
    category: 'Parking & EV',
    physicalContext: 'Một trụ thu phí đỗ xe thông minh trên phố đông đúc bị ai đó dán một miếng decal bóng in mã QR đè lên khu vực hướng dẫn thanh toán chính thức.',
    simulatedQrDestination: 'https://doxe-thanhtoan.thanhpho-pay.top/khuvuc/4092?phi=15000',
    visibleUrl: 'https://doxe-thanhtoan.thanhpho-pay.top/khuvuc/4092',
    actualRegistrableDomain: 'thanhpho-pay.top',
    isScam: true,
    difficulty: 'Intermediate',
    redFlags: [
      'Miếng dán mã QR có dấu hiệu dán đè méo mó lên bảng kim loại gốc',
      'Tên miền gốc là "thanhpho-pay.top", KHÔNG PHẢI tên miền của cơ quan nhà nước (.gov.vn) hay đơn vị quản lý chính thức',
      'Tên miền phụ "doxe-thanhtoan" được tạo ra để đánh lừa người đọc lướt',
      'Yêu cầu nhập thông tin thẻ ATM / thẻ tín dụng và mã OTP ngay trên web lạ mà không qua cổng thanh toán trung gian',
    ],
    urlDissection: {
      protocol: 'https://',
      subdomain: 'doxe-thanhtoan.',
      registeredDomain: 'thanhpho-pay.top',
      path: '/khuvuc/4092?phi=15000',
      deceptiveElement: 'Tên miền phụ giả vờ là cổng đỗ xe thành phố, nhưng tên miền thực sự sở hữu là thanhpho-pay.top',
    },
    explanation:
      'Đây là hình thức tấn công "Physical Quishing" (dán đè QR vật lý). Kẻ gian in sẵn nhãn dán mã QR rẻ tiền dán lên các điểm công cộng (bãi xe, bàn cà phê, cây xăng). Khi quét vội, nạn nhân vào trang web giả mạo bị đánh cắp tài khoản ngân hàng.',
    educationalTip:
      'Tuyệt đối không quét các nhãn dán QR bị dán chồng đè lên nhau. Luôn kiểm tra xem mã QR có được in chìm, khắc trực tiếp trên máy hay không, hoặc mở app ngân hàng / ví điện tử tìm tính năng thanh toán chính thức.',
  },
  {
    id: 'quish-restaurant-table-bill',
    title: 'Mã QR Gọi Món & Thanh Toán Tại Bàn Nhà Hàng',
    category: 'Restaurant',
    physicalContext: 'Bảng mica đặt bàn chính hãng có khắc laser logo thương hiệu của chuỗi nhà hàng, chứa mã QR dẫn đến hệ thống gọi món thực đơn điện tử.',
    simulatedQrDestination: 'https://order.ipos.vn/menu/nha-hang-pho-ngon-quan-1',
    visibleUrl: 'https://order.ipos.vn/menu/nha-hang-pho-ngon-quan-1',
    actualRegistrableDomain: 'ipos.vn',
    isScam: false,
    difficulty: 'Beginner',
    redFlags: [],
    urlDissection: {
      protocol: 'https://',
      subdomain: 'order.',
      registeredDomain: 'ipos.vn',
      path: '/menu/nha-hang-pho-ngon-quan-1',
      deceptiveElement: 'Không có. Tên miền thuộc đơn vị cung cấp giải pháp F&B uy tín hàng đầu tại Việt Nam (iPOS.vn).',
    },
    explanation:
      'Đây là mã QR gọi món và thanh toán tại bàn hợp lệ. Tên miền gốc là ipos.vn, nền tảng F&B uy tín và bảng mica nguyên khối không có dấu vết bị bóc dán tráo đổi.',
    educationalTip:
      'Xác nhận mã QR là một phần nguyên vẹn của menu hoặc chân đế mica của quán, không phải miếng decal dán đè rời rạc.',
  },
  {
    id: 'quish-gov-tax-refund-sms',
    title: 'Mã QR Giả Mạo "Cập Nhật Dữ Liệu Dân Cư VNeID / Hoàn Thuế"',
    category: 'Government',
    physicalContext: 'Email hoặc tin nhắn giả danh Tổng cục Thuế / Bộ Công An gửi thông báo có khoản hoàn thuế 2.500.000đ kèm mã QR để làm thủ tục nhận tiền.',
    simulatedQrDestination: 'https://dichvucong.bocongan.gov.vn-dvc-thuedientu.xyz/hoanthue',
    visibleUrl: 'https://dichvucong.bocongan.gov.vn-dvc-thuedientu.xyz/hoanthue',
    actualRegistrableDomain: 'vn-dvc-thuedientu.xyz',
    isScam: true,
    difficulty: 'Advanced',
    redFlags: [
      'Đoạn tiền tố "dichvucong.bocongan.gov." chỉ là tên miền phụ đánh lừa mắt thường',
      'Tên miền đăng ký thực tế là "vn-dvc-thuedientu.xyz"',
      'Cơ quan nhà nước Việt Nam độc quyền sử dụng tên miền có đuôi chuẩn ".gov.vn"',
      'Yêu cầu nhập số CCCD, tài khoản ngân hàng và mật khẩu Internet Banking để "nhận tiền"',
    ],
    urlDissection: {
      protocol: 'https://',
      subdomain: 'dichvucong.bocongan.gov.',
      registeredDomain: 'vn-dvc-thuedientu.xyz',
      path: '/hoanthue',
      deceptiveElement: 'Chèn chữ "gov" vào trước tên miền thật để lừa người dùng tưởng đây là cổng thông tin của chính phủ.',
    },
    explanation:
      'Kẻ lừa đảo tận dụng cấu trúc subdomain lồng nhau. Bằng cách đăng ký tên miền rác đuôi .xyz và đặt tên miền con là "bocongan.gov", đường link hiển thị trên màn hình điện thoại rất giống trang web chính phủ nếu không nhìn kỹ từ phải qua trái.',
    educationalTip:
      'Quy tắc đọc tên miền: Luôn nhìn từ phải sang trái trước dấu gạch chéo đầu tiên để tìm tên miền chính. Nếu đuôi không phải là ".gov.vn" thì chắc chắn không phải trang của cơ quan nhà nước!',
  },
  {
    id: 'quish-bank-homoglyph-idn',
    title: 'Đồng Bộ Sinh Trắc Học Ngân Hàng Gấp (Tấn Công Ký Tự Lạ Homoglyph)',
    category: 'Banking',
    physicalContext: 'Tin nhắn mạo danh ngân hàng yêu cầu quét mã QR cập nhật khuôn mặt / sinh trắc học trước 24h nếu không tài khoản sẽ bị đóng băng.',
    simulatedQrDestination: 'https://secure.viеtcombank.com-baomat-xacminh.net/login',
    visibleUrl: 'https://secure.viеtcombank.com-baomat-xacminh.net/login',
    actualRegistrableDomain: 'com-baomat-xacminh.net',
    isScam: true,
    difficulty: 'Expert',
    redFlags: [
      'Chữ "е" trong "viеtcombank" là ký tự Cyrillic nhìn giống hệt chữ "e" Latinh nhưng mã máy tính khác nhau',
      'Tên miền chính thực sự là "com-baomat-xacminh.net"',
      'Tạo áp lực thời gian giả tạo (đóng băng tài khoản trong vòng 2 giờ)',
      'Đòi hỏi nhập tên đăng nhập, mật khẩu app và mã OTP Smart OTP',
    ],
    urlDissection: {
      protocol: 'https://',
      subdomain: 'secure.viеtcombank.',
      registeredDomain: 'com-baomat-xacminh.net',
      path: '/login',
      deceptiveElement: 'Sử dụng ký tự đồng hình (Homoglyph) và ghép nối gạch ngang "-baomat-xacminh.net" làm tên miền gốc.',
    },
    explanation:
      'Kỹ thuật tấn công giả mạo tinh vi: Kẻ tấn công kết hợp ký tự đồng hình (nhìn giống nhau nhưng khác mã Unicode) và tên miền gốc có chứa từ khóa bảo mật để đánh lừa người dùng.',
    educationalTip:
      'Tuyệt đối không bao giờ quét mã QR từ email hay tin nhắn để xác thực ngân hàng. Chỉ cập nhật sinh trắc học trực tiếp bên trong ứng dụng ngân hàng chính thức hoặc đến quầy giao dịch.',
  },
  {
    id: 'quish-airport-free-wifi',
    title: 'Mã QR "Kết Nối Wi-Fi Sân Bay Tốc Độ Cao Miễn Phí"',
    category: 'Wi-Fi & Travel',
    physicalContext: 'Một tờ rơi đặt sau ghế chờ sân bay ghi: "Quét mã QR để mở khóa Wi-Fi VIP không quảng cáo tốc độ 500Mbps".',
    simulatedQrDestination: 'https://wifi-sanbay-mienphi.gateway-access.top/login-facebook',
    visibleUrl: 'https://wifi-sanbay-mienphi.gateway-access.top/login-facebook',
    actualRegistrableDomain: 'gateway-access.top',
    isScam: true,
    difficulty: 'Intermediate',
    redFlags: [
      'Nhãn dán trôi nổi không rõ nguồn gốc ở khu vực sảnh chờ công cộng',
      'Tên miền thuộc đuôi lạ ".top"',
      'Yêu cầu "Đăng nhập bằng tài khoản Facebook / Google" trên một trang web không thuộc Google hay Facebook để chiếm đoạt tài khoản',
    ],
    urlDissection: {
      protocol: 'https://',
      subdomain: 'wifi-sanbay-mienphi.',
      registeredDomain: 'gateway-access.top',
      path: '/login-facebook',
      deceptiveElement: 'Giao diện đăng nhập Facebook giả mạo nhằm đánh cắp mật khẩu và mã 2FA của hành khách.',
    },
    explanation:
      'Các cổng Wi-Fi giả mạo thường dụ du khách đăng nhập tài khoản mạng xã hội để "truy cập internet", từ đó chiếm quyền kiểm soát tài khoản và nhắn tin mượn tiền bạn bè trong danh bạ.',
    educationalTip:
      'Chỉ kết nối Wi-Fi qua phần Cài đặt mạng trên điện thoại và kiểm tra tên mạng chính thức hiển thị trên bảng thông tin điện tử của sân bay.',
  },
  {
    id: 'quish-evn-electric-bill',
    title: 'Mã QR Giả Mạo "Thông Báo Cắt Điện & Nộp Tiền Điện EVN Khẩn Cấp"',
    category: 'Utilities',
    physicalContext: 'Một tờ thông báo in giấy bóng giả mạo Tập đoàn Điện lực EVN kẹp ở khe cửa nhà dân ghi: "Hạn cuối nộp tiền điện trước 12h trưa nay, quét QR để thanh toán tránh cắt điện".',
    simulatedQrDestination: 'https://cskh-evn.dienluc-thanhtoan.site/ma-kh/PB0192819',
    visibleUrl: 'https://cskh-evn.dienluc-thanhtoan.site/ma-kh/PB0192819',
    actualRegistrableDomain: 'dienluc-thanhtoan.site',
    isScam: true,
    difficulty: 'Intermediate',
    redFlags: [
      'Tờ rơi kẹp cửa không có mộc đỏ hoặc dấu hiệu xác nhận từ nhân viên điện lực địa bàn',
      'Tên miền thuộc đuôi lạ ".site", không thuộc cổng thông tin điện lực chính thức của EVN (cskh.evn.com.vn)',
      'Dồn ép đếm ngược thời gian cắt điện trong vài giờ để người dân không kịp kiểm chứng',
      'Giao diện thanh toán giả mạo yêu cầu nhập thông tin thẻ ngân hàng và OTP'
    ],
    urlDissection: {
      protocol: 'https://',
      subdomain: 'cskh-evn.',
      registeredDomain: 'dienluc-thanhtoan.site',
      path: '/ma-kh/PB0192819',
      deceptiveElement: 'Sử dụng tiền tố "cskh-evn" để đánh lừa thị giác người dùng lướt nhanh.',
    },
    explanation:
      'Kẻ gian lợi dụng tâm lý sợ bị cắt điện sinh hoạt để phát tán thông báo giả kèm mã QR. Khi quét, nạn nhân bị dẫn tới cổng giả mạo giao diện EVN nhằm đánh cắp tiền trong tài khoản.',
    educationalTip:
      'Luôn tra cứu và thanh toán tiền điện qua ứng dụng CSKH EVN chính thức hoặc trực tiếp trong app ngân hàng / ví điện tử bằng Mã khách hàng in trên hợp đồng.',
  },
  {
    id: 'quish-cinema-ticket-cgv',
    title: 'Vé Xem Phim Điện Tử In Mã QR Tại Quầy Kiosk Rạp Chiếu Phim',
    category: 'E-commerce',
    physicalContext: 'Cuống vé xem phim bằng giấy nhiệt được in trực tiếp từ máy in tự động (kiosk) bên trong sảnh rạp chiếu phim CGV / Lotte Cinema.',
    simulatedQrDestination: 'https://ticket.cgv.vn/checkin/booking/99210-CGV-HN',
    visibleUrl: 'https://ticket.cgv.vn/checkin/booking/99210-CGV-HN',
    actualRegistrableDomain: 'cgv.vn',
    isScam: false,
    difficulty: 'Beginner',
    redFlags: [],
    urlDissection: {
      protocol: 'https://',
      subdomain: 'ticket.',
      registeredDomain: 'cgv.vn',
      path: '/checkin/booking/99210-CGV-HN',
      deceptiveElement: 'Không có. Tên miền chuẩn xác cgv.vn của cụm rạp chiếu phim chính hãng.',
    },
    explanation:
      'Mã QR hợp lệ được hệ thống rạp phim phát hành dùng để soát vé vào phòng chiếu hoặc tích điểm thành viên.',
    educationalTip:
      'Mã QR trên vé in từ máy kiosk nội bộ của rạp là an toàn để soát vé.',
  },
  {
    id: 'quish-petrol-station-overlay',
    title: 'Mã QR Dán Đè Tại Cây Bơm Xăng / Quầy Thu Ngân Xăng Dầu',
    category: 'Utilities',
    physicalContext: 'Tại cột bơm xăng, một miếng nhãn dán mã QR có màu sắc tương tự bảng VietQR ngân hàng nhưng dán lệch đè lên tấm bảng mica gốc của cây xăng.',
    simulatedQrDestination: 'https://vietqr-thanhtoan-xangdau.me/bill/xang-ron95-100k',
    visibleUrl: 'https://vietqr-thanhtoan-xangdau.me/bill/xang-ron95-100k',
    actualRegistrableDomain: 'vietqr-thanhtoan-xangdau.me',
    isScam: true,
    difficulty: 'Advanced',
    redFlags: [
      'Miếng dán mã QR bị dán chồng méo mó lên bảng kim loại cố định của cửa hàng xăng dầu',
      'Đường link dẫn tới tên miền đuôi ".me" thay vì hiển thị trực tiếp thông tin tài khoản thụ hưởng trong app ngân hàng',
      'Khi quét bằng camera điện thoại, hệ thống mở một trang web yêu cầu đăng nhập ngân hàng thay vì mở app VietQR chuẩn'
    ],
    urlDissection: {
      protocol: 'https://',
      subdomain: 'vietqr-thanhtoan-xangdau.',
      registeredDomain: 'vietqr-thanhtoan-xangdau.me',
      path: '/bill/xang-ron95-100k',
      deceptiveElement: 'Trang web mạo danh cổng thanh toán VietQR để đánh cắp mật khẩu Internet Banking.',
    },
    explanation:
      'Kẻ gian lợi dụng lúc vắng người dán đè mã QR lừa đảo lên cây xăng. Nạn nhân quét mã thay vì thanh toán cho cây xăng thì lại bị chuyển hướng vào trang web độc hại.',
    educationalTip:
      'Chỉ thanh toán bằng cách quét mã QR trên màn hình POS của nhân viên hoặc kiểm tra tên đơn vị thụ hưởng trên app ngân hàng trước khi bấm Chuyển tiền.',
  },
  {
    id: 'quish-coffee-loyalty-discount',
    title: 'Mã QR "Tặng Voucher 100K Cà Phê Highland / Phúc Long Miễn Phí"',
    category: 'Restaurant',
    physicalContext: 'Một poster in màu bắt mắt dán trên cột điện trước cổng trường học/văn phòng: "Quét mã nhận ngay ly nước miễn phí 100% nhân dịp sinh nhật thương hiệu".',
    simulatedQrDestination: 'https://highland-khuyenmai-tangvoucher.vip/nhanqua',
    visibleUrl: 'https://highland-khuyenmai-tangvoucher.vip/nhanqua',
    actualRegistrableDomain: 'highland-khuyenmai-tangvoucher.vip',
    isScam: true,
    difficulty: 'Intermediate',
    redFlags: [
      'Poster dán trôi nổi ngoài đường phố, không có tại fanpage hay website chính thức của thương hiệu',
      'Tên miền sử dụng đuôi lạ ".vip"',
      'Trang web yêu cầu chia sẻ mã OTP gửi về Zalo hoặc đăng nhập tài khoản mạng xã hội để "nhận mã quà tặng"'
    ],
    urlDissection: {
      protocol: 'https://',
      subdomain: 'highland-khuyenmai-tangvoucher.',
      registeredDomain: 'highland-khuyenmai-tangvoucher.vip',
      path: '/nhanqua',
      deceptiveElement: 'Tên miền thương hiệu giả mạo đuôi .vip dụ người dùng chia sẻ quyền truy cập Zalo.',
    },
    explanation:
      'Bẫy khuyến mãi trà sữa/cà phê miễn phí nhắm vào học sinh, sinh viên. Khi nạn nhân quét mã và cấp quyền ứng dụng, kẻ gian chiếm đoạt tài khoản Zalo để đi vay tiền bạn bè.',
    educationalTip:
      'Không quét mã QR khuyến mãi dán ở nơi công cộng không rõ nguồn gốc. Tra cứu ưu đãi trực tiếp trong app thành viên chính thức của nhãn hàng.',
  },
  {
    id: 'quish-hospital-medical-portal',
    title: 'Mã QR Tra Cứu Kết Quả Khám Bệnh Bệnh Viện Bạch Mai / Chợ Rẫy',
    category: 'Government',
    physicalContext: 'Mã QR được in trực tiếp ở góc trên cùng bên phải của Phiếu chỉ định xét nghiệm có đóng dấu tròn đỏ của Bệnh viện.',
    simulatedQrDestination: 'https://ketqua.bachmai.gov.vn/tracuu?id=BM-892189&token=a8f912c0',
    visibleUrl: 'https://ketqua.bachmai.gov.vn/tracuu?id=BM-892189',
    actualRegistrableDomain: 'bachmai.gov.vn',
    isScam: false,
    difficulty: 'Intermediate',
    redFlags: [],
    urlDissection: {
      protocol: 'https://',
      subdomain: 'ketqua.',
      registeredDomain: 'bachmai.gov.vn',
      path: '/tracuu?id=BM-892189',
      deceptiveElement: 'Không có. Tên miền sở hữu đuôi chính phủ ".gov.vn" được cấp phép độc quyền cho cơ quan y tế nhà nước.',
    },
    explanation:
      'Mã QR hợp lệ của bệnh viện công lập giúp bệnh nhân tra cứu kết quả xét nghiệm trực tuyến nhanh chóng và bảo mật.',
    educationalTip:
      'Tên miền có đuôi chuẩn ".gov.vn" trên phiếu khám có mộc đỏ của bệnh viện là an toàn để tra cứu.',
  },
  {
    id: 'quish-supermarket-receipt',
    title: 'Mã QR Tích Điểm & Xuất Hóa Đơn Điện Tử Siêu Thị Co.opmart',
    category: 'E-commerce',
    physicalContext: 'Chân hóa đơn thanh toán bằng giấy in nhiệt tại quầy thu ngân siêu thị Co.opmart có in mã QR tra cứu e-Invoice.',
    simulatedQrDestination: 'https://einvoice.co-opmart.com.vn/hoadon/view?sohd=HD99182',
    visibleUrl: 'https://einvoice.co-opmart.com.vn/hoadon/view?sohd=HD99182',
    actualRegistrableDomain: 'co-opmart.com.vn',
    isScam: false,
    difficulty: 'Beginner',
    redFlags: [],
    urlDissection: {
      protocol: 'https://',
      subdomain: 'einvoice.',
      registeredDomain: 'co-opmart.com.vn',
      path: '/hoadon/view?sohd=HD99182',
      deceptiveElement: 'Không có. Tên miền chính hãng co-opmart.com.vn.',
    },
    explanation:
      'Mã QR hóa đơn điện tử hợp lệ theo quy định của Tổng cục Thuế, giúp khách hàng lưu trữ hóa đơn VAT điện tử.',
    educationalTip:
      'Hóa đơn in trực tiếp từ máy POS siêu thị với tên miền chính hãng (.com.vn) là an toàn.',
  },
  {
    id: 'quish-telegram-login-sync',
    title: 'Mã QR "Quét Để Tham Gia Nhóm Telegram Kín / Nhận Quà Game"',
    category: 'E-commerce',
    physicalContext: 'Một tài khoản trên mạng xã hội gửi tin nhắn hình ảnh: "Quét mã QR bằng ứng dụng Telegram trên điện thoại để vào nhóm nhận code game độc quyền".',
    simulatedQrDestination: 'tg://login?token=AQAA_89217894a_fake_session_hijack',
    visibleUrl: 'tg://login?token=AQAA_89217894a_fake_session_hijack',
    actualRegistrableDomain: 'telegram.org (Giao thức nội bộ tg://)',
    isScam: true,
    difficulty: 'Expert',
    redFlags: [
      'Giao thức "tg://login" là tính năng đồng bộ đăng nhập phiên làm việc mới trên máy tính của kẻ tấn công',
      'Nếu bạn quét mã này trong Cài đặt > Thiết bị của Telegram, bạn đã cấp toàn bộ quyền truy cập tài khoản cho kẻ lừa đảo',
      'Kẻ gian sẽ đọc được toàn bộ tin nhắn riêng tư, nhóm chat và dùng tài khoản để nhắn tin lừa tiền mọi người trong danh bạ'
    ],
    urlDissection: {
      protocol: 'tg://',
      subdomain: '',
      registeredDomain: 'login (Telegram Device Link Protocol)',
      path: '?token=AQAA_89217894a_fake_session_hijack',
      deceptiveElement: 'Lợi dụng tính năng Quét mã đăng nhập thiết bị mới của Telegram để chiếm đoạt phiên đăng nhập (Session Hijacking).',
    },
    explanation:
      'Kỹ thuật chiếm quyền điều khiển tài khoản Telegram (Session Takeover). Kẻ xấu mở trang đăng nhập Web Telegram trên máy chúng, tạo mã QR và gửi cho bạn quét dưới vỏ bọc "vào nhóm kín/nhận quà".',
    educationalTip:
      'TUYỆT ĐỐI KHÔNG quét mã QR bằng tính năng "Quét mã QR / Link Desktop" trong phần Cài đặt Telegram theo yêu cầu của người lạ trên mạng.',
  },
];
