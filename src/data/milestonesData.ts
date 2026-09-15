import { SecurityMilestone } from '../types';

export const SECURITY_MILESTONES: SecurityMilestone[] = [
  {
    id: 'novice',
    name: 'Novice Defender',
    vietnameseTitle: 'Tân Binh An Ninh',
    scoreThreshold: 30,
    badgeLabel: 'Novice',
    tagline: 'Bước chân tiên phong vào thế giới phòng thủ số',
    description:
      'Đạt mức điểm an ninh từ 30 điểm trở lên. Nhận diện chuẩn xác các dấu hiệu lừa đảo cơ bản, đường dẫn URL giả mạo và các thông báo mạo danh phổ biến.',
    iconName: 'ShieldAlert',
    colorTheme: {
      primary: 'emerald',
      border: 'border-emerald-500/50',
      bgGlow: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
      text: 'text-emerald-400',
      accent: 'emerald-400',
      ringColor: '#10b981',
    },
    perks: [
      'Mở khóa Radar phát hiện đường link độc hại cơ bản',
      'Truy cập Phòng Huấn Luyện Cấp Độ 1 (Scam Arena)',
      'Kích hoạt huy hiệu hiển thị Tân Binh trên bảng tin',
    ],
    xpReward: 150,
    unlockedLore:
      'Bạn đã vượt qua bước bỡ ngỡ ban đầu, nắm vững kiến thức nền tảng để không bao giờ nhấp bừa vào các đường liên kết lạ.',
  },
  {
    id: 'adept',
    name: 'Adept Defender',
    vietnameseTitle: 'Vệ Binh Thành Thạo',
    scoreThreshold: 60,
    badgeLabel: 'Adept',
    tagline: 'Bản lĩnh vững vàng trước áp lực dồn ép thời gian',
    description:
      'Đạt mức điểm an ninh từ 60 điểm trở lên. Vạch trần các đòn dồn ép tâm lý khẩn cấp, tin nhắn SMS Brandname giả mạo và bẫy quà tặng trúng thưởng.',
    iconName: 'Zap',
    colorTheme: {
      primary: 'cyan',
      border: 'border-cyan-500/50',
      bgGlow: 'from-cyan-500/20 via-sky-500/10 to-transparent',
      badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
      text: 'text-cyan-400',
      accent: 'cyan-400',
      ringColor: '#06b6d4',
    },
    perks: [
      'Mở khóa Phân Tích Mã QR Độc Hại (Quishing Forensics Lab)',
      'Hệ thống phản xạ chống áp lực đếm ngược thời gian',
      'Thêm slot Danh Bạ Người Thân Đáng Tin Cậy',
    ],
    xpReward: 300,
    unlockedLore:
      'Tâm lý bạn không còn bị xao động bởi những chiếc đồng hồ đếm ngược hay những cuộc gọi hối thúc giả danh nhân viên giao hàng.',
  },
  {
    id: 'expert',
    name: 'Expert Sentinel',
    vietnameseTitle: 'Chuyên Gia Khắc Tinh',
    scoreThreshold: 80,
    badgeLabel: 'Expert',
    tagline: 'Nhãn quan sắc bén bóc trần mọi thao túng tâm lý',
    description:
      'Đạt mức điểm an ninh từ 80 điểm trở lên. Vô hiệu hóa thủ đoạn giả danh cơ quan công quyền, bẫy đầu tư hoa hồng khủng và các kịch bản cô lập nạn nhân.',
    iconName: 'Crosshair',
    colorTheme: {
      primary: 'purple',
      border: 'border-purple-500/50',
      bgGlow: 'from-purple-500/20 via-indigo-500/10 to-transparent',
      badgeBg: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
      text: 'text-purple-400',
      accent: 'purple-400',
      ringColor: '#a855f7',
    },
    perks: [
      'Mở khóa Giám Định Deepfake Video & Voice Clone AI đa tầng',
      'Quyền truy cập toàn bộ kịch bản Thách Đấu Nâng Cao',
      'Giảm 50% sát thương tâm lý khi đụng độ Scammer sừng sỏ',
    ],
    xpReward: 500,
    unlockedLore:
      'Bạn là tấm lá chắn kiên cố. Mọi chiêu trò hăm dọa pháp lý, lệnh bắt giả mạo hay bẫy lừa đa tầng đều bị bạn nhận diện ngay lập tức.',
  },
  {
    id: 'guardian',
    name: 'Guardian of Cyberspace',
    vietnameseTitle: 'Hộ Thần Không Gian Số',
    scoreThreshold: 90,
    badgeLabel: 'Guardian',
    tagline: 'Lá chắn hộ mệnh tối thượng bảo vệ cộng đồng',
    description:
      'Đạt mức điểm an ninh tối cao từ 90 điểm trở lên. Phản xạ phòng thủ đạt cấp độ bản năng tự nhiên trước mọi thủ thuật thao túng công nghệ cao.',
    iconName: 'Crown',
    colorTheme: {
      primary: 'amber',
      border: 'border-amber-500/60',
      bgGlow: 'from-amber-500/25 via-yellow-500/15 to-transparent',
      badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-500/50',
      text: 'text-amber-400',
      accent: 'amber-400',
      ringColor: '#f59e0b',
    },
    perks: [
      'Khung vinh danh Hộ Thần Tối Thượng ánh vàng chuyển động',
      'Mở quyền Hộ Vệ Gia Đình: Giám định & Cảnh báo tức thì cho người thân',
      'Chứng chỉ Chuyên Gia An Ninh Không Gian Số xuất sắc',
    ],
    xpReward: 1000,
    unlockedLore:
      'Khả năng phòng vệ của bạn đã trở thành một phần bản năng tự nhiên. Bạn không chỉ miễn nhiễm trước lừa đảo mà còn là ngọn hải đăng soi sáng bảo vệ những người xung quanh.',
  },
];

/**
 * Returns current milestone status given a score
 */
export function getMilestoneProgress(score: number) {
  const currentScore = Math.max(0, Math.min(100, score));
  const unlockedMilestones = SECURITY_MILESTONES.filter((m) => currentScore >= m.scoreThreshold);
  const nextMilestone = SECURITY_MILESTONES.find((m) => currentScore < m.scoreThreshold);
  const highestUnlocked = unlockedMilestones[unlockedMilestones.length - 1] || null;

  let progressToNext = 100;
  let pointsNeeded = 0;

  if (nextMilestone) {
    const prevThreshold = highestUnlocked ? highestUnlocked.scoreThreshold : 0;
    const range = nextMilestone.scoreThreshold - prevThreshold;
    const achieved = currentScore - prevThreshold;
    progressToNext = Math.min(100, Math.max(0, Math.round((achieved / range) * 100)));
    pointsNeeded = nextMilestone.scoreThreshold - currentScore;
  }

  return {
    currentScore,
    unlockedCount: unlockedMilestones.length,
    totalCount: SECURITY_MILESTONES.length,
    highestUnlocked,
    nextMilestone,
    progressToNext,
    pointsNeeded,
  };
}
