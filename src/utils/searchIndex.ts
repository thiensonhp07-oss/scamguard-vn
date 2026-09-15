import { SCAM_SCENARIOS } from '../data/scenarios';
import { QUISHING_CASES } from '../data/quishingData';
import { DEEPFAKE_CASES } from '../data/deepfakeData';
import { SCAM_TACTIC_TAXONOMY } from '../data/taxonomy';
import { ScamTactic } from '../types';

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  type: 'scenario' | 'quishing' | 'deepfake' | 'tool' | 'blacklist' | 'taxonomy';
  tab: string;
  subView?: string;
  badge: string;
  iconType: string;
  keywords: string[];
}

export function removeVietnameseAccents(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

// Global Search Registry
export const GLOBAL_SEARCH_REGISTRY: SearchResultItem[] = [
  // 1. SCAM ARENA SCENARIOS
  ...SCAM_SCENARIOS.map((sc) => ({
    id: `arena-${sc.id}`,
    title: sc.title,
    subtitle: sc.subtitle,
    category: `Tác Chiến: ${sc.category}`,
    type: 'scenario' as const,
    tab: 'train',
    subView: 'arena',
    badge: sc.difficulty,
    iconType: 'swords',
    keywords: [
      sc.title,
      sc.subtitle,
      sc.category,
      sc.attackerProfile.name,
      sc.attackerProfile.organization,
      sc.targetPersona,
      ...sc.tactics,
    ],
  })),

  // 2. QUISHING CASES
  ...QUISHING_CASES.map((q) => ({
    id: `quish-${q.id}`,
    title: q.title,
    subtitle: `${q.actualRegistrableDomain} • ${q.physicalContext.slice(0, 75)}...`,
    category: `Pháp Y QR: ${q.category}`,
    type: 'quishing' as const,
    tab: 'train',
    subView: 'quishing',
    badge: q.isScam ? 'Mã Độc' : 'An Toàn',
    iconType: 'qr',
    keywords: [
      q.title,
      q.category,
      q.actualRegistrableDomain,
      q.visibleUrl,
      q.explanation,
      'quishing',
      'qr code',
      'ma qr',
    ],
  })),

  // 3. DEEPFAKE LAB CASES
  ...DEEPFAKE_CASES.map((df) => ({
    id: `df-${df.id}`,
    title: df.title,
    subtitle: `${df.callerInfo} • ${df.mediaType === 'voice' ? 'Âm thanh AI Voice' : 'Video Call Deepfake'}`,
    category: `Deepfake: ${df.category}`,
    type: 'deepfake' as const,
    tab: 'train',
    subView: 'deepfake',
    badge: df.mediaType === 'voice' ? 'AI Voice' : 'Video Call',
    iconType: 'sparkles',
    keywords: [
      df.title,
      df.category,
      df.callerInfo,
      df.scenarioText,
      'deepfake',
      'giong noi ai',
      'video call',
      'gia giong',
    ],
  })),

  // 4. 11 PSYCHOLOGICAL TACTICS (KNOWLEDGE TAXONOMY)
  ...(Object.entries(SCAM_TACTIC_TAXONOMY) as [ScamTactic, typeof SCAM_TACTIC_TAXONOMY[ScamTactic]][]).map(([tacticKey, def]) => ({
    id: `tactic-${tacticKey.toLowerCase()}`,
    title: `Bẫy Tâm Lý: ${def.nameVi} (${def.nameEn})`,
    subtitle: def.shortDescription,
    category: '11 Bẫy Tâm Lý Tác Chiến',
    type: 'taxonomy' as const,
    tab: 'learn',
    subView: tacticKey,
    badge: 'Học Thuyết',
    iconType: 'book',
    keywords: [
      def.nameVi,
      def.nameEn,
      tacticKey,
      def.shortDescription,
      def.psychologicalTrigger,
      ...def.examplePhrases,
      'tam ly lua dao',
      'bay tam ly',
    ],
  })),

  // 5. SECURITY UTILITIES & MODULES
  {
    id: 'tool-osint-domain',
    title: 'Tra Cứu Tên Miền & OSINT Giám Định Website',
    subtitle: 'Kiểm tra tuổi đời WHOIS, chứng chỉ SSL, DNS & danh tiếng máy chủ tên miền',
    category: 'Công Cụ Giám Định',
    type: 'tool',
    tab: 'check',
    subView: 'threat_intel',
    badge: 'OSINT',
    iconType: 'search',
    keywords: ['tra cuu ten mien', 'whois', 'domain', 'kiem tra website', 'ssl', 'osint', 'dns'],
  },
  {
    id: 'tool-blacklist-registry',
    title: 'Tra Cứu Danh Sách Đen (Blacklist Scam Database)',
    subtitle: 'Cơ sở dữ liệu số điện thoại lừa đảo, số tài khoản ngân hàng rác và link độc hại',
    category: 'Cơ Sở Dữ Liệu',
    type: 'blacklist',
    tab: 'check',
    subView: 'blacklist',
    badge: 'Danh Sách Đen',
    iconType: 'shield-alert',
    keywords: ['blacklist', 'danh sach den', 'tra so tai khoan', 'so dien thoai lua dao', 'bao cao scam', 'stk'],
  },
  {
    id: 'tool-check-scam-ai',
    title: 'Giám Định Bằng Chứng & Phân Tích Tin Nhắn Lừa Đảo',
    subtitle: 'Nhập nội dung tin nhắn, số điện thoại hoặc đường link để AI phân tích 11 bẫy tâm lý',
    category: 'Giám Định AI',
    type: 'tool',
    tab: 'check',
    subView: 'smart_link',
    badge: 'AI Shield',
    iconType: 'activity',
    keywords: ['giam dinh', 'kiem tra tin nhan', 'check scam', 'phan tich link', 'lua dao qua mang'],
  },
  {
    id: 'tool-fake-bill-ocr',
    title: 'Giám Định Ảnh Chụp Hóa Đơn & Biên Lai Giả Mạo (Fake Bill OCR)',
    subtitle: 'Quét phông chữ, con dấu số và đối chiếu mã giao dịch ngân hàng giả mạo',
    category: 'Giám Định AI',
    type: 'tool',
    tab: 'check',
    subView: 'fake_bill',
    badge: 'Fake Bill',
    iconType: 'activity',
    keywords: ['fake bill', 'bien lai gia', 'hoa don fake', 'chuyen khoan gia', 'photoshop'],
  },
  {
    id: 'tool-scam-radar',
    title: 'Radar Cảnh Báo Lừa Đảo Trực Tiếp (Live Threat Radar)',
    subtitle: 'Bản đồ và luồng cảnh báo các chiến dịch lừa đảo đang bùng phát theo thời gian thực tại VN',
    category: 'Radar Cảnh Báo',
    type: 'tool',
    tab: 'home',
    subView: 'radar',
    badge: 'Real-time',
    iconType: 'radio',
    keywords: ['radar', 'canh bao som', 'ban do lua dao', 'ha noi', 'ho chi minh', 'tin nong'],
  },
  {
    id: 'tool-wifi-nfc-shield',
    title: 'Khiên Bảo Vệ Wi-Fi Công Cộng & Thẻ NFC Không Tiếp Xúc',
    subtitle: 'Kiểm tra độ an toàn mạng Wi-Fi mở quán cà phê, phát hiện tấn công Evil Twin & chặn quét trộm NFC',
    category: 'Phòng Vệ Thiết Bị',
    type: 'tool',
    tab: 'home',
    subView: 'wifi-shield',
    badge: 'Wi-Fi & NFC',
    iconType: 'wifi',
    keywords: ['wifi cong cong', 'nfc', 'evil twin', 'bao ve the atm', 'quet trom the', 'bao mat'],
  },
  {
    id: 'tool-pii-redactor',
    title: 'Lọc Bỏ Thông Tin Cá Nhân Nhạy Cảm (PII Redaction Engine)',
    subtitle: 'Tự động che mờ số CCCD, thẻ ngân hàng, số điện thoại, OTP trước khi chia sẻ ảnh bằng chứng',
    category: 'Bảo Vệ Quyền Riêng Tư',
    type: 'tool',
    tab: 'check',
    subView: 'pii_redact',
    badge: 'Quyền Riêng Tư',
    iconType: 'lock',
    keywords: ['che cccd', 'pii', 'an danh', 'che so dien thoai', 'mat khau', 'bao mat du lieu'],
  },
  {
    id: 'tool-scam-dna-skilltree',
    title: 'Bản Đồ Kỹ Năng & Cây Gen Phòng Thủ Scam DNA',
    subtitle: 'Đồ thị phân tích 11 loại gen lừa đảo, phát hiện lỗ hổng tâm lý và lộ trình đào tạo thích ứng',
    category: 'Khung Khoa Học ViSEF',
    type: 'tool',
    tab: 'scamdna',
    badge: 'Scam DNA',
    iconType: 'dna',
    keywords: ['scam dna', 'cay ky nang', 'gen lua dao', 'tam ly hoc', 'sdi', 'lo hong tam ly'],
  },
  {
    id: 'tool-executive-dashboard',
    title: 'Bảng Điều Khiển Nghiên Cứu Khoa Học Kỹ Thuật ViSEF 2026',
    subtitle: 'Tổng hợp chỉ số SDI, thống kê khảo nghiệm thực nghiệm thời gian thực, biểu đồ spline và báo cáo hiệu quả',
    category: 'Nghiên Cứu ViSEF',
    type: 'tool',
    tab: 'home',
    subView: 'dashboard',
    badge: 'ViSEF 2026',
    iconType: 'dashboard',
    keywords: ['dashboard', 'visef 2026', 'khoa hoc ky thuat', 'mau khao sat', 'sdi', 'thang 5 2026', 'bao cao'],
  },
  {
    id: 'tool-duolingo-learn',
    title: 'Thao Trường Huấn Luyện Vệ Binh Theo Chủ Đề (Lộ Trình Duolingo)',
    subtitle: 'Chinh phục từng cấp độ từ Nhập Môn đến Bậc Thầy Vệ Binh An Ninh Mạng',
    category: 'Lộ Trình Học Tập',
    type: 'tool',
    tab: 'learn',
    badge: 'Khóa Học',
    iconType: 'book',
    keywords: ['hoc tap', 'duolingo', 'bai hoc', 've binh', 'nang cap kien thuc', 'chuyen de'],
  },
  {
    id: 'tool-call-simulator',
    title: 'Mô Phỏng Cuộc Gọi Lừa Đảo Trực Tiếp (Voice AI Call Sim)',
    subtitle: 'Tập phản xạ nhận diện cuộc gọi mạo danh công an, tòa án và giao thông viên',
    category: 'Mô Phỏng Thực Tế',
    type: 'tool',
    tab: 'home',
    subView: 'call-sim',
    badge: 'Voice Call',
    iconType: 'sparkles',
    keywords: ['cuoc goi', 'gia giong cong an', 'call sim', 'dien thoai lua dao'],
  },

  // 6. SAMPLE KNOWN BLACKLIST DOMAINS & TELECOM TARGETS
  {
    id: 'bl-vneid-subdomain',
    title: 'Miền Giả Mạo: vneid-dvc.site (Mạo danh Cổng VNeID)',
    subtitle: 'Tên miền phishing lừa cài ứng dụng độc hại mạo danh Bộ Công An cập nhật định danh',
    category: 'Danh Sách Đen Tên Miền',
    type: 'blacklist',
    tab: 'check',
    subView: 'blacklist',
    badge: 'Phishing',
    iconType: 'alert-triangle',
    keywords: ['vneid-dvc.site', 'vneid', 'bo cong an', 'dvc', 'dinh danh'],
  },
  {
    id: 'bl-evn-cutoff',
    title: 'Miền Giả Mạo: cskh-evnspc-vn.cc (Giả danh Điện lực EVN)',
    subtitle: 'Trang web mạo danh EVN gửi đường dẫn tải tệp mã độc evn.apk chiếm quyền Accessibility',
    category: 'Danh Sách Đen Tên Miền',
    type: 'blacklist',
    tab: 'check',
    subView: 'blacklist',
    badge: 'Malware APK',
    iconType: 'alert-triangle',
    keywords: ['cskh-evnspc-vn.cc', 'evn.apk', 'dien luc', 'tien dien', 'cat dien'],
  },
  {
    id: 'bl-etax-fake',
    title: 'Miền Giả Mạo: gdt-gov-vn-dvc.site (Giả danh Tổng Cục Thuế)',
    subtitle: 'Kịch bản lừa hoàn thuế TNCN yêu cầu cài đặt phần mềm eTax giả mạo để rút sạch tiền',
    category: 'Danh Sách Đen Tên Miền',
    type: 'blacklist',
    tab: 'check',
    subView: 'blacklist',
    badge: 'Phishing Thuế',
    iconType: 'alert-triangle',
    keywords: ['gdt-gov-vn-dvc.site', 'etax.apk', 'tong cuc thue', 'hoan thue', 'quyet toan thue'],
  },
];

/**
 * Perform intelligent fuzzy / normalized search across the global registry.
 */
export function searchGlobalRegistry(query: string, limit = 12): SearchResultItem[] {
  if (!query || query.trim() === '') return [];

  const rawQuery = query.trim().toLowerCase();
  const normalizedQuery = removeVietnameseAccents(query);
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

  const scoredResults: { item: SearchResultItem; score: number }[] = [];

  for (const item of GLOBAL_SEARCH_REGISTRY) {
    const normTitle = removeVietnameseAccents(item.title);
    const normSubtitle = removeVietnameseAccents(item.subtitle);
    const normCategory = removeVietnameseAccents(item.category);
    const normKeywords = item.keywords.map((k) => removeVietnameseAccents(k));

    let score = 0;

    // 1. Exact or prefix match on title
    if (normTitle === normalizedQuery || item.title.toLowerCase() === rawQuery) {
      score += 120;
    } else if (normTitle.startsWith(normalizedQuery)) {
      score += 80;
    } else if (normTitle.includes(normalizedQuery)) {
      score += 55;
    }

    // 2. Match in subtitle / category / badge
    if (normSubtitle.includes(normalizedQuery)) {
      score += 35;
    }
    if (normCategory.includes(normalizedQuery)) {
      score += 30;
    }
    if (removeVietnameseAccents(item.badge).includes(normalizedQuery)) {
      score += 25;
    }

    // 3. Match in keywords list
    for (const kw of normKeywords) {
      if (kw === normalizedQuery) {
        score += 50;
      } else if (kw.includes(normalizedQuery)) {
        score += 30;
      }
    }

    // 4. Token-level matching (every token found adds score)
    let tokenMatches = 0;
    for (const token of queryTokens) {
      if (
        normTitle.includes(token) ||
        normSubtitle.includes(token) ||
        normCategory.includes(token) ||
        normKeywords.some((k) => k.includes(token))
      ) {
        tokenMatches++;
        score += 20;
      }
    }

    if (tokenMatches === queryTokens.length && queryTokens.length > 1) {
      score += 40; // All tokens matched
    }

    // 5. Single or double character fuzzy search for responsiveness
    if (normalizedQuery.length <= 2) {
      if (normTitle.includes(normalizedQuery)) score += 20;
    }

    if (score > 0) {
      scoredResults.push({ item, score });
    }
  }

  // Sort by highest score first
  scoredResults.sort((a, b) => b.score - a.score);

  return scoredResults.slice(0, limit).map((r) => r.item);
}
