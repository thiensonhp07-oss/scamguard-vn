import { EXTRA_LESSONS } from './extraLessons';

export interface LessonTheory {
  title: string;
  summary: string;
  keyPoints: string[];
  visualMockup?: {
    type: 'chat' | 'sms' | 'email' | 'warning' | 'call' | 'browser';
    sender: string;
    avatarText?: string;
    content: string;
    highlightedRedFlags?: string[];
    note?: string;
  };
  goldenRule: string;
}

export interface RedFlagSpot {
  id: string;
  labelText: string;
  isRedFlag: boolean;
  explanation: string;
}

export interface DragDropItem {
  id: string;
  text: string;
  sender: string;
  correctCategory: 'safe' | 'suspicious' | 'scam';
  explanation: string;
}

export interface SequenceStepItem {
  id: string;
  stepText: string;
  correctOrder: number;
  explanation: string;
}

export interface ChatDecisionStep {
  id: string;
  scammerText: string;
  senderName: string;
  choices: { id: string; text: string; isSafe: boolean; feedback: string }[];
}

export interface UrlDissectionData {
  protocol: string;
  subdomain: string;
  registrableDomain: string;
  tld: string;
  path: string;
  deceptivePart: 'subdomain' | 'registrableDomain' | 'tld' | 'path';
  explanation: string;
}

export interface PracticeQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'matching' | 'spot_red_flags' | 'drag_drop_zone' | 'order_sequence' | 'chat_decision' | 'url_dissection';
  prompt: string;
  options?: { id: string; text: string; isCorrect: boolean; explanation: string }[];
  trueFalseAnswer?: { isTrue: boolean; explanation: string };
  matchingPairs?: {
    left: { id: string; text: string };
    right: { id: string; text: string; matchesLeftId: string };
  }[];
  spotData?: {
    channel: 'sms' | 'email' | 'invoice' | 'web';
    header: string;
    sender: string;
    bodyText: string;
    spots: RedFlagSpot[];
  };
  dragDropItems?: DragDropItem[];
  sequenceItems?: SequenceStepItem[];
  chatData?: ChatDecisionStep;
  urlData?: UrlDissectionData;
}

export interface StoryMessage {
  sender: 'scammer' | 'user' | 'assistant';
  senderName: string;
  text: string;
  actionRequired?: boolean;
  choices?: {
    id: string;
    text: string;
    isSafe: boolean;
    feedback: string;
    consequence: string;
  }[];
}

export interface DuolingoLesson {
  id: string;
  unitId: string;
  number: number;
  title: string;
  shortDesc: string;
  targetGoal: string;
  xpReward: number;
  shieldBadgeName: string;
  shieldBadgeIcon: string;
  theory: LessonTheory;
  practice: PracticeQuestion[];
  story: {
    title: string;
    scenarioContext: string;
    dialogue: StoryMessage[];
  };
}

export interface DuolingoUnit {
  id: string;
  unitNumber: number;
  title: string;
  objective: string;
  themeColor: {
    bg: string;
    border: string;
    glow: string;
    text: string;
    gradient: string;
    button: string;
  };
  lessons: DuolingoLesson[];
}

export const DUOLINGO_UNITS: DuolingoUnit[] = [
  {
    "id": "unit-1",
    "unitNumber": 1,
    "title": "Khởi đầu - Cảnh giác cơ bản",
    "objective": "Trang bị tư duy phòng thủ cơ bản & phản xạ dừng lại kiểm tra",
    "themeColor": {
      "bg": "bg-emerald-950/70",
      "border": "border-emerald-500/50",
      "glow": "shadow-emerald-500/20",
      "text": "text-emerald-400",
      "gradient": "from-emerald-600 to-teal-700",
      "button": "bg-emerald-500 hover:bg-emerald-400 border-b-4 border-emerald-700 text-slate-950"
    },
    "lessons": [
      {
        "id": "lesson-1",
        "unitId": "unit-1",
        "number": 1,
        "title": "Hiểu về lừa đảo trực tuyến là gì?",
        "shortDesc": "Bản chất, nguyên nhân & tại sao mọi người đều có thể là mục tiêu.",
        "targetGoal": "Nắm vững định nghĩa tội phạm mạng, hiểu rõ tâm lý học khiến nạn nhân sập bẫy.",
        "xpReward": 50,
        "shieldBadgeName": "Khiên Khởi Nguyên Cảnh Giác",
        "shieldBadgeIcon": "🛡️",
        "theory": {
          "title": "Giải Mã Tội Phạm Mạng 4.0",
          "summary": "Lừa đảo trực tuyến (Cyber Scam) là hành vi sử dụng công nghệ số, mạng xã hội, viễn thông và đòn bẩy tâm lý để thao túng nạn nhân tự nguyện giao nộp tiền, mật khẩu hoặc quyền kiểm soát tài khoản.",
          "keyPoints": [
            "🎯 Bất kỳ ai cũng có thể là nạn nhân: Từ sinh viên, nhân viên văn phòng đến chuyên gia hay người cao tuổi. Kẻ gian tấn công vào cảm xúc chứ không phải trí thông minh.",
            "🧠 Khai thác 4 điểm mù tâm lý: Nỗi sợ hãi (bị phạt/bắt giữ), Lòng tham (tiền thưởng/lãi suất khủng), Sự cả tin (người quen nhờ vả), và Sự khẩn cấp giả tạo (hối thúc trong 5-10 phút).",
            "🌐 Kỹ thuật mạo danh tinh vi: Kẻ lừa đảo không cần trực tiếp cướp giật mà tạo dựng kịch bản giả tưởng hoàn hảo khiến bạn tự tay chuyển tiền."
          ],
          "visualMockup": {
            "type": "warning",
            "sender": "Hệ Thống Phân Tích Tâm Lý",
            "content": "⚠️ Kẻ lừa đảo thường dành 80% thời gian nghiên cứu thông tin công khai của bạn trên Facebook/TikTok để xây dựng \"mồi câu\" chính xác từng chi tiết!",
            "highlightedRedFlags": [
              "Khai thác thông tin công khai",
              "Đánh trúng tâm lý"
            ],
            "note": "Không có ai miễn nhiễm nếu không rèn luyện phản xạ phòng thủ."
          },
          "goldenRule": "Kẻ lừa đảo không thông minh hơn bạn, chúng chỉ lợi dụng lúc bạn mất bình tĩnh nhất!"
        },
        "practice": [
          {
            "id": "l1-p1",
            "type": "multiple_choice",
            "prompt": "Theo bạn, ai là đối tượng dễ bị kẻ lừa đảo trực tuyến nhắm tới nhất?",
            "options": [
              {
                "id": "a",
                "text": "Chỉ những người không hiểu biết về công nghệ.",
                "isCorrect": false,
                "explanation": "Sai! Ngay cả kỹ sư IT hay giám đốc ngân hàng vẫn có thể sập bẫy khi bị tấn công cảm xúc bất ngờ."
              },
              {
                "id": "b",
                "text": "Bất kỳ ai sử dụng Internet, nếu mất cảnh giác hoặc bị đánh trúng điểm yếu tâm lý.",
                "isCorrect": true,
                "explanation": "Chính xác! Tội phạm mạng phân chia kịch bản riêng cho từng độ tuổi và tầng lớp xã hội."
              },
              {
                "id": "c",
                "text": "Chỉ người già và trẻ em ở vùng nông thôn.",
                "isCorrect": false,
                "explanation": "Sai! Giới trẻ thành thị là đối tượng bị lừa việc làm online và đầu tư ảo nhiều nhất hiện nay."
              }
            ]
          },
          {
            "id": "l1-p2",
            "type": "true_false",
            "prompt": "Người có trình độ học vấn cao và nhiều tiền thì không bao giờ bị lừa qua mạng.",
            "trueFalseAnswer": {
              "isTrue": false,
              "explanation": "Sai hoàn toàn! Tội phạm công nghệ cao sử dụng dữ liệu lớn (Big Data) và kịch bản thao túng tâm lý chuyên sâu để hạ gục cả những người có học vị cao."
            }
          },
          {
            "id": "l1-p3",
            "type": "matching",
            "prompt": "Hãy ghép đúng đòn tâm lý của kẻ lừa đảo với hành vi tương ứng:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Nỗi sợ hãi"
                },
                "right": {
                  "id": "r1",
                  "text": "Dọa khóa tài khoản ngân hàng hoặc dính án rửa tiền",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Lòng tham"
                },
                "right": {
                  "id": "r2",
                  "text": "Hứa hẹn làm nhiệm vụ nhận hoa hồng 30-50%/ngày",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Sự khẩn cấp"
                },
                "right": {
                  "id": "r3",
                  "text": "Ép phải chuyển tiền ngay trong 10 phút kẻo mất cơ hội",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "l1-p4",
            "type": "multiple_choice",
            "prompt": "Đặc điểm chung nổi bật nhất của hầu hết các kịch bản lừa đảo trực tuyến là gì?",
            "options": [
              {
                "id": "a",
                "text": "Yêu cầu gặp mặt trực tiếp tại trụ sở cơ quan nhà nước.",
                "isCorrect": false,
                "explanation": "Sai! Tội phạm mạng luôn tìm cách né tránh gặp mặt trực tiếp."
              },
              {
                "id": "b",
                "text": "Tạo áp lực thời gian gấp gáp và yêu cầu cung cấp thông tin cá nhân hoặc chuyển tiền qua mạng.",
                "isCorrect": true,
                "explanation": "Chính xác! Chúng luôn tạo sự hoảng loạn và vội vã để nạn nhân không kịp suy nghĩ."
              },
              {
                "id": "c",
                "text": "Cung cấp hóa đơn đỏ và hợp đồng ký kết đầy đủ chữ ký.",
                "isCorrect": false,
                "explanation": "Sai! Giấy tờ và hóa đơn chúng đưa ra đều là giả mạo."
              }
            ]
          },
          {
            "id": "l1-p5",
            "type": "true_false",
            "prompt": "Kẻ lừa đảo thường nghiên cứu kỹ trang cá nhân Facebook, Zalo của bạn trước khi giăng bẫy.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Đúng! Chúng thu thập thông tin công khai về gia đình, công việc, sở thích của bạn để giả mạo người thân hoặc tạo kịch bản cá nhân hóa rất tinh vi."
            }
          },
          {
            "id": "l1-p6",
            "type": "multiple_choice",
            "prompt": "Khi nhận được tin nhắn từ người thân yêu cầu chuyển tiền gấp qua mạng xã hội, việc đầu tiên bạn nên làm là gì?",
            "options": [
              {
                "id": "a",
                "text": "Chuyển tiền ngay để không làm lỡ việc gấp của người thân.",
                "isCorrect": false,
                "explanation": "Sai! Tài khoản của người thân có thể đã bị chiếm quyền (hack)."
              },
              {
                "id": "b",
                "text": "Gọi điện thoại trực tiếp (video call hoặc thoại thông thường) bằng số điện thoại quen thuộc để xác thực.",
                "isCorrect": true,
                "explanation": "Chính xác! Luôn xác thực giọng nói trực tiếp trước khi giao dịch tài chính."
              },
              {
                "id": "c",
                "text": "Hỏi thêm vài câu hỏi bí mật qua tin nhắn chữ.",
                "isCorrect": false,
                "explanation": "Chưa đủ an toàn vì kẻ gian có thể đã nắm được thói quen nhắn tin của nạn nhân hoặc dùng deepfake."
              }
            ]
          },
          {
            "id": "l1-p7",
            "type": "multiple_choice",
            "prompt": "Hành vi nào sau đây là dấu hiệu rõ ràng của một cuộc gọi lừa đảo giả mạo cơ quan công an?",
            "options": [
              {
                "id": "a",
                "text": "Mời bạn lên trực tiếp trụ sở công an phường theo giấy triệu tập gửi qua đường bưu điện.",
                "isCorrect": false,
                "explanation": "Cơ quan công an làm việc hành chính qua giấy mời/triệu tập chính thức tại trụ sở, không làm việc qua điện thoại."
              },
              {
                "id": "b",
                "text": "Yêu cầu gọi Zalo video call bật màn hình hoặc đe dọa lệnh bắt tạm giam qua điện thoại rồi ép chuyển tiền bảo lãnh.",
                "isCorrect": true,
                "explanation": "Chính xác! Cơ quan công an tuyệt đối không bao giờ yêu cầu chuyển tiền qua điện thoại."
              },
              {
                "id": "c",
                "text": "Hỏi thăm thông tin căn cước công dân khi làm thủ tục hành chính định kỳ tại bộ phận một cửa.",
                "isCorrect": false,
                "explanation": "Đây là quy trình hành chính hợp pháp."
              }
            ]
          },
          {
            "id": "l1-p8",
            "type": "true_false",
            "prompt": "Việc chia sẻ quá nhiều hình ảnh check-in chuyến đi du lịch dài ngày lên mạng xã hội có thể tạo cơ hội cho kẻ gian đột nhập nhà riêng hoặc giả mạo người thân gọi điện lừa đảo.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Đúng! Lộ lọt thông tin cá nhân trên mạng xã hội là nguồn dữ liệu quý giá để tội phạm mạng nhắm vào bạn và gia đình."
            }
          },
          {
            "id": "l1-p9",
            "type": "multiple_choice",
            "prompt": "Đâu KHÔNG phải là một kênh liên lạc chính thống mà các cơ quan nhà nước hay ngân hàng sử dụng?",
            "options": [
              {
                "id": "a",
                "text": "Website có đuôi tên miền .gov.vn hoặc .com.vn",
                "isCorrect": false,
                "explanation": "Đây là các tên miền chính thống được quản lý chặt chẽ."
              },
              {
                "id": "b",
                "text": "Tài khoản Zalo cá nhân nhắn tin đòi chuyển khoản tiền phạt nguội hoặc đóng phí.",
                "isCorrect": true,
                "explanation": "Chính xác! Cơ quan nhà nước không bao giờ dùng tài khoản Zalo cá nhân để xử lý vi phạm hay thu tiền."
              },
              {
                "id": "c",
                "text": "Ứng dụng di động chính thức tải từ App Store hoặc Google Play.",
                "isCorrect": false,
                "explanation": "Đây là kênh chính thống."
              }
            ]
          },
          {
            "id": "l1-p10",
            "type": "multiple_choice",
            "prompt": "Khi phát hiện bản thân hoặc người thân vừa bị lừa chuyển tiền cho kẻ gian, phản ứng đúng đắn nhất trong \"giờ vàng\" là gì?",
            "options": [
              {
                "id": "a",
                "text": "Ngồi khóc và chờ đợi công an tìm giúp.",
                "isCorrect": false,
                "explanation": "Sai! Thời gian đầu là cốt lõi để phong tỏa tài khoản."
              },
              {
                "id": "b",
                "text": "Lập tức gọi tổng đài ngân hàng để khóa thẻ/tài khoản và báo ngay công an địa phương.",
                "isCorrect": true,
                "explanation": "Chính xác! Ngăn chặn dòng tiền tẩu tán trong những phút đầu tiên là cơ hội cao nhất để thu hồi tài sản."
              },
              {
                "id": "c",
                "text": "Nhắn tin mắng chửi kẻ lừa đảo qua số Zalo của họ.",
                "isCorrect": false,
                "explanation": "Không có tác dụng thu hồi tiền và có thể tiếp tục bị thao túng."
              }
            ]
          }
        ],
        "story": {
          "title": "Cuộc Gọi Bất Ngờ Lúc Nửa Đêm",
          "scenarioContext": "Bạn đang làm việc khuya thì nhận được cuộc gọi tự xưng từ Tổng đài dịch vụ thông báo thuê bao sắp bị khóa vĩnh viễn.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Tổng Đài Viên Ảo",
              "text": "Xin chào quý khách, số điện thoại của bạn đang bị khiếu nại phát tán mã độc. Trong 15 phút nữa nếu không xác thực qua phím 1, toàn bộ dịch vụ sẽ bị cắt!"
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Dừng lại! Kẻ gian đang kích hoạt đòn đánh \"Sự khẩn cấp\" và \"Nỗi sợ hãi\". Bạn sẽ chọn phản ứng nào?",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Bấm phím 1 ngay lập tức để gặp nhân viên giải trình thông tin.",
                  "isSafe": false,
                  "feedback": "Bị dẫn dụ vào bẫy gặp kẻ mạo danh tiếp theo yêu cầu nộp phạt!",
                  "consequence": "Bạn đã rơi vào ma trận thao túng tâm lý."
                },
                {
                  "id": "c2",
                  "text": "Cúp máy ngay. Mở ứng dụng chính thức của nhà mạng hoặc gọi hotline 1800xxx để kiểm tra.",
                  "isSafe": true,
                  "feedback": "Rất xuất sắc! Cơ quan uy tín không bao giờ dùng tổng đài tự động đe dọa cắt số sau 15 phút.",
                  "consequence": "Bảo vệ thành công thông tin và thoát bẫy an toàn."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-2",
        "unitId": "unit-1",
        "number": 2,
        "title": "Dấu hiệu nhận biết chung (\"Cảm giác nguy hiểm\")",
        "shortDesc": "Cảnh báo đỏ: Quá hời, quá gấp gáp, link lạ. Quy tắc vàng 3 giây.",
        "targetGoal": "Kích hoạt giác quan thứ sáu phát hiện bẫy lừa và hình thành thói quen \"Dừng lại, Hít thở và Kiểm tra\".",
        "xpReward": 50,
        "shieldBadgeName": "Khiên Giác Quan Thứ Sáu",
        "shieldBadgeIcon": "⚡",
        "theory": {
          "title": "3 Dấu Hiệu Cảnh Báo Đỏ (Red Flags)",
          "summary": "Bất cứ khi nào bạn nhận thấy một yêu cầu mang 3 yếu tố sau, 99.9% đó là bẫy lừa đảo trực tuyến.",
          "keyPoints": [
            "🚩 1. Quá hấp dẫn để là sự thật (Too Good to be True): Quà tặng vô cớ hàng chục triệu, trúng thưởng xe máy SH khi không mua vé, việc nhẹ lương 2 triệu/ngày.",
            "🚩 2. Áp lực thời gian nghẹt thở: \"Chỉ còn 3 phút để xác nhận\", \"Nếu chậm trễ sẽ bị công an khởi tố ngay trong ngày\". Kẻ lừa đảo không cho não bộ bạn có thời gian suy nghĩ logic.",
            "🚩 3. Đường dẫn URL dị dạng & yêu cầu OTP: Tên miền chứa ký tự lạ (nhu vietcombannk-vip.com), yêu cầu nhập mã OTP hoặc tải file đuôi .apk."
          ],
          "visualMockup": {
            "type": "sms",
            "sender": "Bank-Alert-Vn",
            "content": "TK cua ban bi dang nhap o thiet bi la. Vui long truy cap http://vietcombank-xac-thuc.top/otp de bao ve tien truoc 23:59!",
            "highlightedRedFlags": [
              "vietcombank-xac-thuc.top",
              "Khẩn cấp trước 23:59",
              "Yêu cầu nhập OTP"
            ],
            "note": "Tên miền thật luôn là .com.vn hoặc .vn chính thức, không bao giờ là .top hay .xyz!"
          },
          "goldenRule": "Công thức 3 bước: DỪNG LẠI 5 GIÂY → HÍT THỞ THẬT SÂU → KIỂM TRA ĐỘC LẬP."
        },
        "practice": [
          {
            "id": "l2-p1",
            "type": "spot_red_flags",
            "prompt": "🔍 SOI BẤY NGUY HIỂM: Hãy bấm chọn trực tiếp vào 2 yếu tố ĐÁNG NGHI VẤN NHẤT trong tin nhắn SMS ngân hàng dưới đây!",
            "spotData": {
              "channel": "sms",
              "header": "TIN NHẮN SMS - VIETCOMBANK",
              "sender": "VIETCOMBANK (Luồng chính thức)",
              "bodyText": "TK 10123xxx bi dang nhap o thiet bi la (iPhone 15, Cali, USA). Vui long truy cap https://vcb-digibank-ebank.cc de huy giao dich 50.000.000d trong 5 phut!",
              "spots": [
                {
                  "id": "spot-1",
                  "labelText": "https://vcb-digibank-ebank.cc",
                  "isRedFlag": true,
                  "explanation": "Đúng! Ngân hàng Vietcombank CHỈ dùng tên miền chính thức vietcombank.com.vn. Tên miền đuôi .cc là trang web mạo danh cài cấy mã độc!"
                },
                {
                  "id": "spot-2",
                  "labelText": "trong 5 phut!",
                  "isRedFlag": true,
                  "explanation": "Đúng! Đây là đòn đe dọa khẩn cấp (Urgency Tactic) nhằm khiến bạn hoảng sợ nhập mã OTP không kịp suy nghĩ!"
                },
                {
                  "id": "spot-3",
                  "labelText": "TK 10123xxx",
                  "isRedFlag": false,
                  "explanation": "Đây chỉ là định dạng che bớt số tài khoản thông thường, không phải dấu hiệu lừa đảo."
                }
              ]
            }
          },
          {
            "id": "l2-p2",
            "type": "drag_drop_zone",
            "prompt": "📦 PHÂN LOẠI AN TOÀN: Phân loại 3 thông báo dưới đây vào đúng nhóm mức độ rủi ro!",
            "dragDropItems": [
              {
                "id": "item-1",
                "sender": "VIETTEL-ANTOAN",
                "text": "Mã OTP xac thuc dang nhap cua ban la 882910. Tuyet doi KHONG chia se ma nay voi bat ky ai, ke ca nhan vien viettel.",
                "correctCategory": "safe",
                "explanation": "An toàn! Cảnh báo chuẩn từ nhà mạng khuyên bảo vệ mã OTP."
              },
              {
                "id": "item-2",
                "sender": "CSKH-SHOPEE-Vip",
                "text": "Don hang cua ban duoc tang qua 0d. Vui long cap nhat CCCD va chuyen 200k phi bao hiem bưu dien tai http://shopee-nhanqua.top",
                "correctCategory": "scam",
                "explanation": "Lừa đảo! Bẫy nhận quà đóng phí bưu điện qua đường link đuôi .top lạ."
              },
              {
                "id": "item-3",
                "sender": "So la +84912883xx",
                "text": "A oi, em gui nham 5 trieu vao tai khoan a, a cho em xin lai link https://hoantien-chuyennham.xyz/nhap-otp",
                "correctCategory": "suspicious",
                "explanation": "Nghi vấn lừa đảo! Bẫy chuyển nhầm tiền kéo vào link câu OTP."
              }
            ]
          },
          {
            "id": "l2-p3",
            "type": "order_sequence",
            "prompt": "⚙️ SẮP XẾP QUY TRÌNH: Sắp xếp 4 bước phản ứng khẩn cấp đúng thứ tự khi nghi ngờ tài khoản bị lộ!",
            "sequenceItems": [
              {
                "id": "step-a",
                "stepText": "1. Dừng ngay giao dịch & Khóa khẩn cấp thẻ/Internet Banking trên app chính thức hoặc gọi Hotline",
                "correctOrder": 1,
                "explanation": "Bước 1 quan trọng nhất: Chặn đứng dòng tiền tẩu tán tức thì!"
              },
              {
                "id": "step-b",
                "stepText": "2. Gọi phản ánh ngay lên Tổng đài Cục An toàn thông tin 156",
                "correctOrder": 2,
                "explanation": "Bước 2: Cảnh báo đầu số viễn thông bị kẻ gian chiếm quyền."
              },
              {
                "id": "step-c",
                "stepText": "3. Đổi mật khẩu tài khoản email & ngân hàng trên thiết bị an toàn khác",
                "correctOrder": 3,
                "explanation": "Bước 3: Gia cố lại hạ tầng mật khẩu cá nhân."
              },
              {
                "id": "step-d",
                "stepText": "4. Chụp màn hình bằng chứng & trình báo Công An phường gần nhất",
                "correctOrder": 4,
                "explanation": "Bước 4: Cung cấp hồ sơ pháp lý điều tra tội phạm mạng."
              }
            ]
          },
          {
            "id": "l2-p4",
            "type": "url_dissection",
            "prompt": "🔬 PHẪU THUẬT TÊN MIỀN: Xác định thành phần LỪA ĐẢO NGUY HIỂM NHẤT trong đường link dưới đây!",
            "urlData": {
              "protocol": "https://",
              "subdomain": "vcb-digibank",
              "registrableDomain": "ebank-xacthuc",
              "tld": ".xyz",
              "path": "/login-otp",
              "deceptivePart": "registrableDomain",
              "explanation": "Chính xác! Kẻ xấu cố tình đặt subdomain \"vcb-digibank\" để đánh lừa mắt bạn, nhưng tên miền đăng ký thật đằng sau là \"ebank-xacthuc.xyz\"!"
            }
          },
          {
            "id": "l2-p5",
            "type": "multiple_choice",
            "prompt": "Khi nhận được một đường link lạ từ người quen trên mạng xã hội hỏi \"Có phải mày xuất hiện trong video này không?\", bạn nên làm gì?",
            "options": [
              {
                "id": "a",
                "text": "Bấm vào xem ngay để tò mò xem video gì.",
                "isCorrect": false,
                "explanation": "Sai! Đây là mã độc chiếm quyền tài khoản Facebook qua file độc hại."
              },
              {
                "id": "b",
                "text": "Tuyệt đối không bấm link, nhắn tin hỏi lại bằng câu hỏi khác để kiểm tra xem có phải đúng bạn mình nhắn không.",
                "isCorrect": true,
                "explanation": "Chính xác! Tài khoản của bạn bè có thể đã bị hacker chiếm quyền để phát tán link mã độc."
              },
              {
                "id": "c",
                "text": "Đăng nhập tài khoản Facebook của mình vào trang web đó để xem.",
                "isCorrect": false,
                "explanation": "Sai! Bạn sẽ bị đánh cắp mật khẩu Facebook ngay lập tức."
              }
            ]
          },
          {
            "id": "l2-p6",
            "type": "true_false",
            "prompt": "Các ngân hàng tại Việt Nam thường xuyên gửi tin nhắn SMS chứa đường dẫn (link) yêu cầu khách hàng đăng nhập web để mở khóa tài khoản.",
            "trueFalseAnswer": {
              "isTrue": false,
              "explanation": "Sai hoàn toàn! Ngân hàng Nhà nước và các ngân hàng thương mại KHÔNG BAO GIỜ gửi tin nhắn SMS chứa đường link đăng nhập yêu cầu nhập mật khẩu hay OTP."
            }
          },
          {
            "id": "l2-p7",
            "type": "multiple_choice",
            "prompt": "Đầu số 156 hoặc 5656 tại Việt Nam dùng để làm gì trong công tác phòng chống lừa đảo?",
            "options": [
              {
                "id": "a",
                "text": "Đầu số tổng đài đặt mua vé máy bay giá rẻ.",
                "isCorrect": false,
                "explanation": "Sai."
              },
              {
                "id": "b",
                "text": "Đầu số tiếp nhận phản ánh cuộc gọi rác, cuộc gọi lừa đảo và tin nhắn lừa đảo do Bộ Thông tin và Truyền thông quản lý.",
                "isCorrect": true,
                "explanation": "Chính xác! Bạn có thể nhắn tin hoặc gọi tới 156 để báo cáo các số điện thoại lừa đảo."
              },
              {
                "id": "c",
                "text": "Đầu số đăng ký dịch vụ nhạc chờ viễn thông.",
                "isCorrect": false,
                "explanation": "Sai."
              }
            ]
          },
          {
            "id": "l2-p8",
            "type": "true_false",
            "prompt": "Biểu tượng ổ khóa màu xanh trên thanh địa chỉ trình duyệt chứng tỏ trang web đó tuyệt đối an toàn và không phải lừa đảo.",
            "trueFalseAnswer": {
              "isTrue": false,
              "explanation": "Sai! Ô khóa xanh chỉ báo hiệu kết nối được mã hóa SSL, hơn 80% trang web lừa đảo hiện nay cũng có ổ khóa xanh do đăng ký chứng chỉ miễn phí."
            }
          },
          {
            "id": "l2-p9",
            "type": "multiple_choice",
            "prompt": "Khi nghe điện thoại từ người lạ tự xưng là shipper yêu cầu chuyển khoản tiền cọc trước để nhận bưu phẩm trị giá lớn, bạn nên:",
            "options": [
              {
                "id": "a",
                "text": "Chuyển khoản tiền cọc ngay để shipper giao hàng đến nhà.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy shipper COD khống chiếm đoạt tiền."
              },
              {
                "id": "b",
                "text": "Từ chối nhận hàng hoặc yêu cầu kiểm tra hàng thực tế qua app giao hàng chính thức trước khi thanh toán.",
                "isCorrect": true,
                "explanation": "Chính xác! Không bao giờ chuyển tiền trước khi nhận và kiểm tra bưu phẩm."
              },
              {
                "id": "c",
                "text": "Cho shipper số tài khoản ngân hàng của mình.",
                "isCorrect": false,
                "explanation": "Sai."
              }
            ]
          },
          {
            "id": "l2-p10",
            "type": "multiple_choice",
            "prompt": "Đâu là biểu hiện của một lời mời việc làm \"việc nhẹ lương cao\" lừa đảo trên mạng?",
            "options": [
              {
                "id": "a",
                "text": "Yêu cầu làm việc 8 tiếng tại văn phòng có hợp đồng lao động và đóng bảo hiểm xã hội đầy đủ.",
                "isCorrect": false,
                "explanation": "Đây là quy trình tuyển dụng chuẩn."
              },
              {
                "id": "b",
                "text": "Chỉ cần ngồi nhà bấm like TikTok, thả tim sản phẩm hoặc nạp tiền làm nhiệm vụ nhận hoa hồng 30%/ngày.",
                "isCorrect": true,
                "explanation": "Chính xác! Không có việc gì ngồi nhà bấm điện thoại mà thu nhập hàng chục triệu đồng mỗi ngày. Đây là bẫy \"lừa đảo nhiệm vụ\" điển hình."
              },
              {
                "id": "c",
                "text": "Phỏng vấn trực tiếp qua 3 vòng chuyên môn.",
                "isCorrect": false,
                "explanation": "Quy trình tuyển dụng thông thường."
              }
            ]
          }
        ],
        "story": {
          "title": "Thông Báo Trúng Thưởng Triệu Đô",
          "scenarioContext": "Bạn nhận được thông báo qua Zalo từ \"Trưởng ban tổ chức sự kiện\": Bạn đã may mắn trúng giải Đặc Biệt 100.000.000 VNĐ!",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Trưởng Ban Tổ Chức",
              "text": "Chúc mừng bạn! Bạn là khách hàng may mắn nhất năm. Để nhận 100 triệu, vui lòng đóng 2 triệu tiền phí xuất hóa đơn đỏ vào số tài khoản cá nhân này trong 10 phút."
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Cảnh báo đỏ kích hoạt: \"Quá hời\" + \"Ép thời gian 10 phút\" + \"Đóng tiền trước\". Bạn sẽ làm gì?",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Chuyển 2 triệu ngay vì tiếc khoản tiền thưởng 100 triệu lớn.",
                  "isSafe": false,
                  "feedback": "Mất 2 triệu! Sau đó kẻ gian sẽ tiếp tục đòi thêm phí bảo hiểm 5 triệu, 10 triệu nữa.",
                  "consequence": "Kẻ lừa đảo biến mất ngay sau khi nhận tiền."
                },
                {
                  "id": "c2",
                  "text": "Nhớ quy tắc \"Không có bữa trưa miễn phí\" và bấm Chặn + Báo cáo lừa đảo ngay.",
                  "isSafe": true,
                  "feedback": "Rất thông thái! Không bao giờ có chuyện trúng thưởng mà phải nộp tiền cọc cho tài khoản cá nhân.",
                  "consequence": "Tiết kiệm được 2 triệu và giữ an toàn tuyệt đối."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-15",
        "unitId": "unit-1",
        "number": 15,
        "title": "Nghệ thuật soi Link & Tên miền Phishing",
        "shortDesc": "Vạch trần tên miền giả mạo Homograph, subdomain lừa đảo & đuôi web ma.",
        "targetGoal": "Phân biệt tên miền gốc chính chủ (.vn, .com.vn) và các tên miền dị dạng lừa đảo (.top, .xyz, .cc).",
        "xpReward": 65,
        "shieldBadgeName": "Kính Viễn Vọng Soi Domain",
        "shieldBadgeIcon": "🔍",
        "theory": {
          "title": "Kỹ Thuật Phân Tích Cấu Trúc URL Chuẩn",
          "summary": "Kẻ gian thường tạo các đường link trông rất giống ngân hàng hoặc cổng dịch vụ công nhưng thực chất là trang web lừa đảo đặt máy chủ ở nước ngoài.",
          "keyPoints": [
            "🌐 Đọc tên miền từ PHẢI sang TRÁI trước dấu gạch chéo đầu tiên: Ví dụ \"vietcombank.com.vn-xacthuc.top/login\" thì tên miền thực sự là \"vn-xacthuc.top\", KHÔNG PHẢI Vietcombank!",
            "🔤 Kỹ thuật ký tự đồng dạng (Homoglyph Attack): Thay chữ \"o\" bằng số \"0\" (như vcb0nline.com), thay chữ \"l\" bằng số \"1\" hoặc chữ \"i\" hoa.",
            "🔒 Biểu tượng Ổ Khóa (HTTPS) KHÔNG đồng nghĩa với An Toàn: Ổ khóa chỉ chứng minh đường truyền được mã hóa, trang web lừa đảo hoàn toàn có thể đăng ký chứng chỉ SSL miễn phí."
          ],
          "visualMockup": {
            "type": "browser",
            "sender": "Thanh Địa Chỉ Trình Duyệt",
            "content": "https://dichvucong.gov.vn.ho-so-quoc-gia.xyz/xac-thuc-cccd",
            "highlightedRedFlags": [
              ".xyz (Đuôi miền lừa đảo)",
              "dichvucong.gov.vn chỉ là tiền tố giả (Subdomain)"
            ],
            "note": "Tên miền thật của cơ quan nhà nước bắt buộc kết thúc bằng đuôi \".gov.vn\"!"
          },
          "goldenRule": "Luôn nhìn vào từ ngay TRƯỚC dấu gạch chéo \"/\" đầu tiên để biết chủ nhân thực sự của website!"
        },
        "practice": [
          {
            "id": "l15-p1",
            "type": "multiple_choice",
            "prompt": "Trong các đường dẫn sau, đâu là đường dẫn CHÍNH THỨC và AN TOÀN của Ngân hàng Quân Đội (MB Bank)?",
            "options": [
              {
                "id": "a",
                "text": "https://mbbank.com.vn/portal",
                "isCorrect": true,
                "explanation": "Chính xác! Tên miền gốc kết thúc đúng bằng mbbank.com.vn."
              },
              {
                "id": "b",
                "text": "http://mbbank-online-smart-otp.top/login",
                "isCorrect": false,
                "explanation": "Sai! Tên miền đuôi .top là trang web giả mạo câu trộm OTP."
              },
              {
                "id": "c",
                "text": "https://mbbank.com.vn-xac-thuc-sinh-trac-hoc.cc",
                "isCorrect": false,
                "explanation": "Sai! Tên miền thực tế là xac-thuc-sinh-trac-hoc.cc."
              }
            ]
          },
          {
            "id": "l15-p2",
            "type": "true_false",
            "prompt": "Nếu trang web có biểu tượng Ổ Khóa Xanh (HTTPS) thì chắc chắn 100% đó là website an toàn của ngân hàng.",
            "trueFalseAnswer": {
              "isTrue": false,
              "explanation": "Sai! Hiện nay hơn 80% trang web lừa đảo đều có ổ khóa HTTPS vì chứng chỉ SSL được cấp miễn phí."
            }
          },
          {
            "id": "l15-p3",
            "type": "matching",
            "prompt": "Ghép tên miền với loại tổ chức chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Tên miền đuôi .gov.vn"
                },
                "right": {
                  "id": "r1",
                  "text": "Cơ quan Nhà nước và Chính phủ Việt Nam",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Tên miền đuôi .edu.vn"
                },
                "right": {
                  "id": "r2",
                  "text": "Tổ chức giáo dục, trường đại học tại VN",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Tên miền đuôi .top, .xyz, .cc"
                },
                "right": {
                  "id": "r3",
                  "text": "Tên miền giá rẻ thường bị tội phạm mạng lợi dụng",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-15-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Nghệ thuật soi Link & Tên miền Phishing\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-15-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-15-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-15-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Nghệ thuật soi Link & Tên miền Phishing\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-15-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-15-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-15-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Nghệ thuật soi Link & Tên miền Phishing\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Bẫy Cập Nhật Sinh Trắc Học",
          "scenarioContext": "Bạn nhận được email thông báo tài khoản ngân hàng sẽ bị khóa nếu không cập nhật khuôn mặt qua link liên kết.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Hỗ Trợ Sinh Trắc Học",
              "text": "Quý khách vui lòng bấm vào https://vietinbank.com.vn-cap-nhat.xyz để quét khuôn mặt và CCCD ngay trong 30 phút!"
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Chú ý thanh địa chỉ! Đuôi web là \".xyz\" chứ không phải \".vn\". Bạn sẽ hành động thế nào?",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Bấm vào link quét khuôn mặt ngay để tránh bị khóa tài khoản.",
                  "isSafe": false,
                  "feedback": "Kẻ gian sẽ thu thập dữ liệu khuôn mặt và mã OTP của bạn!",
                  "consequence": "Mất quyền kiểm soát tài khoản."
                },
                {
                  "id": "c2",
                  "text": "Mở ứng dụng VietinBank iPay chính thức trên điện thoại để cập nhật trực tiếp hoặc ra quầy giao dịch.",
                  "isSafe": true,
                  "feedback": "Tuyệt vời! Bạn đã tránh được bẫy lừa đảo sinh trắc học tinh vi.",
                  "consequence": "Bảo vệ thành công tài khoản an toàn 100%."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-16",
        "unitId": "unit-1",
        "number": 16,
        "title": "Pháo đài mật khẩu & Bảo mật 2 lớp 2FA / Passkey",
        "shortDesc": "Xây dựng lá chắn chống dò mật khẩu, quản lý mật khẩu an toàn.",
        "targetGoal": "Thiết lập mật khẩu mạnh dài >12 ký tự và kích hoạt xác thực 2 yếu tố trên mọi tài khoản.",
        "xpReward": 65,
        "shieldBadgeName": "Pháo Đài 2FA Kiên Cố",
        "shieldBadgeIcon": "🔐",
        "theory": {
          "title": "Nguyên Tắc Thiết Lập Mật Khẩu Chuẩn Quân Sự",
          "summary": "Hơn 80% vụ mất tài khoản bắt nguồn từ việc đặt mật khẩu đơn giản (ngày sinh, số điện thoại) hoặc dùng chung 1 mật khẩu cho tất cả ứng dụng.",
          "keyPoints": [
            "🔑 Đặt mật khẩu dạng Cụm từ (Passphrase): Thay vì \"Matkhau123@\", hãy dùng \"ToiYeuAnToanMang@2026!\" - dài trên 14 ký tự và cực khó bị máy tính bẻ khóa.",
            "🛡️ Luôn bật 2FA bằng Ứng dụng Xác thực (Google Authenticator / Microsoft Authenticator): An toàn hơn SMS OTP vì không bị hacker cướp SIM.",
            "🚫 Không dùng chung mật khẩu: Nếu một diễn đàn nhỏ bị lộ dữ liệu, kẻ gian sẽ dùng mật khẩu đó để thử đăng nhập Facebook, Gmail và Ngân hàng của bạn (Credential Stuffing)."
          ],
          "visualMockup": {
            "type": "warning",
            "sender": "Cảnh Báo Bảo Mật Mật Khẩu",
            "content": "Mật khẩu \"123456\" hoặc \"password\" có thể bị bẻ khóa trong 0.001 giây! Mật khẩu dài 14 ký tự cần hơn 200 năm để giải mã.",
            "highlightedRedFlags": [
              "Mật khẩu quá ngắn",
              "Dùng chung mật khẩu"
            ],
            "note": "Nên dùng trình quản lý mật khẩu như Bitwarden hoặc Google Password Manager."
          },
          "goldenRule": "Mật khẩu giống như bàn chải đánh răng: Đừng cho ai mượn và nên thay đổi định kỳ!"
        },
        "practice": [
          {
            "id": "l16-p1",
            "type": "multiple_choice",
            "prompt": "Đâu là phương thức xác thực 2 bước (2FA) có độ an toàn cao nhất chống lại bẫy cướp SIM?",
            "options": [
              {
                "id": "a",
                "text": "Ứng dụng tạo mã biến đổi (Google Authenticator / Khóa bảo mật FIDO/Passkey).",
                "isCorrect": true,
                "explanation": "Chính xác! Mã tạo offline trên thiết bị không thể bị can thiệp qua sóng viễn thông."
              },
              {
                "id": "b",
                "text": "Gửi tin nhắn mã OTP qua SMS về số điện thoại.",
                "isCorrect": false,
                "explanation": "SMS OTP có thể bị hacker đánh cắp qua trạm BTS giả hoặc cướp SIM."
              },
              {
                "id": "c",
                "text": "Đặt câu hỏi bí mật \"Tên con vật cưng của bạn\".",
                "isCorrect": false,
                "explanation": "Câu hỏi bí mật rất dễ bị kẻ gian đoán ra qua bài đăng Facebook."
              }
            ]
          },
          {
            "id": "l16-p2",
            "type": "true_false",
            "prompt": "Dùng một mật khẩu siêu mạnh cho tất cả tài khoản Facebook, Gmail, Ngân hàng là hoàn toàn an toàn.",
            "trueFalseAnswer": {
              "isTrue": false,
              "explanation": "Sai! Nếu một dịch vụ bất kỳ bị rò rỉ cơ sở dữ liệu, toàn bộ tài khoản còn lại của bạn sẽ bị sụp đổ theo dây chuyền."
            }
          },
          {
            "id": "lesson-16-p3",
            "type": "true_false",
            "prompt": "[Thực chiến #3] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-16-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Pháo đài mật khẩu & Bảo mật 2 lớp 2FA / Passkey\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-16-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-16-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-16-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Pháo đài mật khẩu & Bảo mật 2 lớp 2FA / Passkey\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-16-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-16-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-16-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Pháo đài mật khẩu & Bảo mật 2 lớp 2FA / Passkey\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Đêm Giông Bão Dò Mật Khẩu",
          "scenarioContext": "Bạn nhận được 5 thông báo liên tiếp: \"Mã xác thực đăng nhập Google từ IP lạ tại Nga\".",
          "dialogue": [
            {
              "sender": "assistant",
              "senderName": "Hệ Thống Phòng Thủ Google",
              "text": "Có người đang cố gắng đăng nhập vào tài khoản của bạn bằng mật khẩu cũ bị lộ trên mạng!"
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Nhờ đã bật 2FA, kẻ gian chưa thể vào được tài khoản. Bạn cần làm gì ngay bây giờ?",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Kệ nó, vì chưa vào được nên không cần làm gì.",
                  "isSafe": false,
                  "feedback": "Kẻ gian có thể tiếp tục thử các phương thức tấn công khác!",
                  "consequence": "Nguy cơ tiềm ẩn."
                },
                {
                  "id": "c2",
                  "text": "Đổi ngay mật khẩu mới bằng cụm từ dài, đồng thời đăng xuất tất cả các thiết bị lạ trong mục Quản lý tài khoản.",
                  "isSafe": true,
                  "feedback": "Phản xạ chuẩn mực của một Chuyên gia An ninh mạng!",
                  "consequence": "Vô hiệu hóa hoàn toàn cuộc tấn công."
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "unit-2",
    "unitNumber": 2,
    "title": "Lừa đảo qua cuộc gọi và tin nhắn",
    "objective": "Xử lý các cuộc gọi giả danh Công an, SMS ngân hàng giả mạo (Smishing) và bẫy trúng thưởng",
    "themeColor": {
      "bg": "bg-cyan-950/70",
      "border": "border-cyan-500/50",
      "glow": "shadow-cyan-500/20",
      "text": "text-cyan-400",
      "gradient": "from-cyan-600 to-blue-700",
      "button": "bg-cyan-500 hover:bg-cyan-400 border-b-4 border-cyan-700 text-slate-950"
    },
    "lessons": [
      {
        "id": "lesson-3",
        "unitId": "unit-2",
        "number": 3,
        "title": "Lừa đảo giả danh cơ quan chức năng",
        "shortDesc": "Giả danh Công an, Tòa án, VKS dọa án phạt & ép cài app độc hại.",
        "targetGoal": "Nhận diện quy trình làm việc chuẩn của cơ quan hành chính và cách từ chối tuyệt đối qua điện thoại.",
        "xpReward": 60,
        "shieldBadgeName": "Khiên Phản Kháng Quyền Lực",
        "shieldBadgeIcon": "👮",
        "theory": {
          "title": "Giải Phẫu Chiêu Trò Giả Danh Công An",
          "summary": "Tội phạm tự xưng là cán bộ Công an điều tra án ma túy/rửa tiền hoặc yêu cầu \"đồng bộ dữ liệu VNeID mức 2\" nhằm chiếm đoạt quyền điều khiển điện thoại.",
          "keyPoints": [
            "🏛️ Quy định Pháp luật Việt Nam: Cơ quan Công an, Viện kiểm sát, Tòa án TUYỆT ĐỐI KHÔNG làm việc, điều tra án, hoặc yêu cầu chuyển tiền qua điện thoại hay Zalo.",
            "📄 Làm việc qua Giấy Mời / Giấy Triệu Tập: Khi cần làm việc, cơ quan chức năng sẽ gửi văn bản chính thức đến tận địa chỉ cư trú hoặc thông qua Công an khu vực.",
            "⛔ Cấm tải file APK / cài app ngoài: Không bao giờ bấm vào link lạ để tải các ứng dụng như \"Dịch vụ công giả mạo\", \"Bộ Công An giả mạo\". Ứng dụng này sẽ đọc lén mã OTP ngân hàng!"
          ],
          "visualMockup": {
            "type": "call",
            "sender": "Đại Úy Nguyễn Văn H. (Công An TP)",
            "content": "Số CCCD của anh đang liên quan đường dây rửa tiền xuyên quốc gia 50 tỷ. Yêu cầu tải app dichvucong-gov.apk để cán bộ kiểm tra tài sản trong sạch ngay!",
            "highlightedRedFlags": [
              "Làm việc qua điện thoại",
              "Dọa dính án ma túy",
              "Ép tải file .apk"
            ],
            "note": "Không có bất kỳ cơ quan nhà nước nào yêu cầu công dân cài file .apk lạ!"
          },
          "goldenRule": "\"Công an thật mời lên trụ sở - Kẻ xưng Công an qua điện thoại đòi tiền chắc chắn là lừa đảo!\""
        },
        "practice": [
          {
            "id": "l3-p1",
            "type": "multiple_choice",
            "prompt": "Nếu một người gọi điện tự xưng là Công an điều tra yêu cầu bạn chuyển tiền vào tài khoản tạm giữ để chứng minh trong sạch, bạn xử lý thế nào?",
            "options": [
              {
                "id": "a",
                "text": "Chuyển tiền ngay để chứng minh mình vô tội.",
                "isCorrect": false,
                "explanation": "Sai! Đây là kịch bản lừa đảo chiếm đoạt tài sản kinh điển nhất."
              },
              {
                "id": "b",
                "text": "Cúp máy, tuyệt đối không chuyển tiền và nếu cần hãy ra thẳng trụ sở Công an phường gần nhất để xác minh.",
                "isCorrect": true,
                "explanation": "Chính xác! Công an không có tài khoản tạm giữ cá nhân qua điện thoại."
              },
              {
                "id": "c",
                "text": "Xin số tài khoản rồi chuyển 50% trước để xem xét.",
                "isCorrect": false,
                "explanation": "Sai! Kẻ gian sẽ chiếm đoạt ngay số tiền đó."
              }
            ]
          },
          {
            "id": "l3-p2",
            "type": "true_false",
            "prompt": "Công an phường có thể gọi điện yêu cầu bạn đọc mã OTP gửi về máy để hỗ trợ kích hoạt VNeID từ xa.",
            "trueFalseAnswer": {
              "isTrue": false,
              "explanation": "Sai! Kích hoạt VNeID mức 2 phải đến trực tiếp Công an xã/phường có máy lăn tay, chụp ảnh diện mạo. Không có cán bộ nào gọi điện xin mã OTP!"
            }
          },
          {
            "id": "l3-p3",
            "type": "matching",
            "prompt": "Ghép hình thức giả mạo với bản chất thực sự:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Gửi Lệnh bắt giữ qua Zalo"
                },
                "right": {
                  "id": "r1",
                  "text": "Tài liệu photoshop giả mạo 100% để uy hiếp tinh thần",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Link tải App Cổng Dịch Vụ Công"
                },
                "right": {
                  "id": "r2",
                  "text": "Mã độc gián điệp đánh cắp mã OTP và tài khoản ngân hàng",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Yêu cầu giữ bí mật tuyệt đối"
                },
                "right": {
                  "id": "r3",
                  "text": "Cô lập nạn nhân để người thân không kịp cảnh báo",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "l3-p4",
            "type": "multiple_choice",
            "prompt": "Khi nhận được cuộc gọi thông báo bạn có phạt nguội giao thông và yêu cầu chuyển khoản ngay vào tài khoản cá nhân của \"đội CSGT\", bạn nên làm gì?",
            "options": [
              {
                "id": "a",
                "text": "Chuyển khoản ngay để tránh bị tăng nặng mức phạt.",
                "isCorrect": false,
                "explanation": "Sai! Tiền phạt nhà nước chỉ nộp qua cổng dịch vụ công quốc gia hoặc trực tiếp tại kho bạc."
              },
              {
                "id": "b",
                "text": "Từ chối chuyển khoản, tra cứu biển số xe trên trang web chính thức của Cục CSGT (csgt.vn).",
                "isCorrect": true,
                "explanation": "Chính xác! Luôn tra cứu nguồn gốc phạt nguội trên cổng thông tin chính thống."
              },
              {
                "id": "c",
                "text": "Xin số tài khoản để thương lượng giảm giá.",
                "isCorrect": false,
                "explanation": "Sai! Đây là tài khoản của kẻ lừa đảo."
              }
            ]
          },
          {
            "id": "l3-p5",
            "type": "true_false",
            "prompt": "Cơ quan Công an có thẩm quyền ban hành Lệnh bắt tạm giam gửi qua tin nhắn Zalo cho công dân.",
            "trueFalseAnswer": {
              "isTrue": false,
              "explanation": "Sai hoàn toàn! Các lệnh tố tụng hình sự bắt buộc tống đạt trực tiếp bằng văn bản có dấu đỏ theo đúng thủ tục tố tụng."
            }
          },
          {
            "id": "l3-p6",
            "type": "multiple_choice",
            "prompt": "Tại sao kẻ lừa đảo giả danh công an lại luôn bắt nạn nhân phải tìm một nơi vắng vẻ, không được cho người khác biết?",
            "options": [
              {
                "id": "a",
                "text": "Để đảm bảo tính bảo mật điều tra.",
                "isCorrect": false,
                "explanation": "Sai!"
              },
              {
                "id": "b",
                "text": "Nhằm cô lập nạn nhân, khiến họ không thể hỏi ý kiến người thân để phát hiện ra sơ hở.",
                "isCorrect": true,
                "explanation": "Chính xác! Khi có người bên cạnh nhắc nhở, nạn nhân sẽ tỉnh táo lại ngay."
              },
              {
                "id": "c",
                "text": "Để đường truyền video call không giật lag.",
                "isCorrect": false,
                "explanation": "Sai!"
              }
            ]
          },
          {
            "id": "l3-p7",
            "type": "true_false",
            "prompt": "Việc cài đặt các ứng dụng dịch vụ công từ file cài đặt .apk bên ngoài Google Play Store hoặc App Store là hoàn toàn an toàn.",
            "trueFalseAnswer": {
              "isTrue": false,
              "explanation": "Sai nguy hiểm! File .apk ngoài kho ứng dụng chính thức chính là mã độc chiếm quyền điều khiển điện thoại và đọc trộm mã OTP."
            }
          },
          {
            "id": "l3-p8",
            "type": "multiple_choice",
            "prompt": "Khi có người gọi điện xưng là cơ quan công an / viện kiểm sát, phản ứng nào giúp bạn an toàn nhất?",
            "options": [
              {
                "id": "a",
                "text": "Hợp tác làm theo mọi yêu cầu qua điện thoại.",
                "isCorrect": false,
                "explanation": "Sai! Bạn sẽ sập bẫy thao túng."
              },
              {
                "id": "b",
                "text": "Yêu cầu họ gửi giấy mời làm việc chính thức về địa chỉ nhà, sau đó cúp máy.",
                "isCorrect": true,
                "explanation": "Chính xác! Cơ quan chức năng làm việc theo đúng quy trình hành chính bằng văn bản."
              },
              {
                "id": "c",
                "text": "Cãi nhau và thách thức họ.",
                "isCorrect": false,
                "explanation": "Không cần thiết."
              }
            ]
          },
          {
            "id": "l3-p9",
            "type": "true_false",
            "prompt": "Số điện thoại hiển thị trên màn hình gọi đến (Caller ID) có thể bị kẻ lừa đảo dùng công nghệ giả mạo (VoIP spoofing).",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Đúng! Kẻ lừa đảo sử dụng công nghệ VoIP để giả mạo bất kỳ số điện thoại nào (kể cả số hotline 113) hiển thị trên màn hình của bạn."
            }
          },
          {
            "id": "l3-p10",
            "type": "multiple_choice",
            "prompt": "Sau khi nhận cuộc gọi đe dọa từ kẻ giả danh công an, bạn nên làm gì tiếp theo?",
            "options": [
              {
                "id": "a",
                "text": "Im lặng ôm nỗi sợ một mình.",
                "isCorrect": false,
                "explanation": "Sai! Sẽ khiến bạn tiếp tục bị thao túng tâm lý."
              },
              {
                "id": "b",
                "text": "Kể ngay cho người thân trong gia đình nghe và gọi phản ánh tới tổng đài 156.",
                "isCorrect": true,
                "explanation": "Chính xác! Chia sẻ với người thân là chiếc khiên vững chắc nhất."
              },
              {
                "id": "c",
                "text": "Gọi lại số đó để hỏi cho rõ.",
                "isCorrect": false,
                "explanation": "Sai! Số đó là số ảo hoặc số quốc tế."
              }
            ]
          }
        ],
        "story": {
          "title": "Lệnh Bắt Giữ Qua Màn Hình Video Call",
          "scenarioContext": "Một người mặc sắc phục công an gọi video cho bạn trong căn phòng có cờ đỏ, bảng hiệu cơ quan điều tra.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Thiếu Tá Tự Xưng",
              "text": "Tôi là cán bộ điều tra C02. Tài khoản của bạn liên quan đến vụ án ma túy lớn. Hãy mở điện thoại, cấp quyền trợ năng Accessibility cho ứng dụng này để chúng tôi thanh tra."
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Kẻ gian dùng video deepfake + phòng dựng cảnh giả mạo. Mục đích là đòi quyền trợ năng để điều khiển điện thoại từ xa.",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Sợ hãi làm theo hướng dẫn cấp quyền điều khiển máy.",
                  "isSafe": false,
                  "feedback": "Toàn bộ tiền trong tài khoản ngân hàng của bạn bị rút sạch trong 3 phút!",
                  "consequence": "Mất quyền kiểm soát điện thoại."
                },
                {
                  "id": "c2",
                  "text": "Nói: \"Tôi sẽ trực tiếp lên trụ sở Công an làm việc\", sau đó tắt máy và chặn số.",
                  "isSafe": true,
                  "feedback": "Tuyệt đỉnh! Kẻ lừa đảo lập tức cúp máy vì biết bạn nắm rõ luật.",
                  "consequence": "Bảo vệ an toàn 100% tài sản."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-4",
        "unitId": "unit-2",
        "number": 4,
        "title": "Lừa đảo qua tin nhắn SMS giả mạo (Smishing)",
        "shortDesc": "SMS mạo danh Brandname ngân hàng, bưu điện giao hàng với link độc hại.",
        "targetGoal": "Hiểu nguyên lý giả mạo SMS Brandname bằng trạm BTS giả và cách phòng tránh dính bẫy mã độc.",
        "xpReward": 60,
        "shieldBadgeName": "Khiên Miễn Nhiễm Smishing",
        "shieldBadgeIcon": "💬",
        "theory": {
          "title": "Bẫy Tin Nhắn SMS Giả Brandname",
          "summary": "Kẻ lừa đảo dùng trạm phát sóng BTS di động giả để chèn tin nhắn SMS mạo danh trực tiếp vào cùng luồng tin nhắn thật của Ngân hàng hoặc Bưu điện.",
          "keyPoints": [
            "📱 Nằm chung luồng tin nhắn thật: Đừng tin tưởng chỉ vì tin nhắn hiển thị tên \"VIETCOMBANK\" hay \"VNPOST\". Kỹ thuật Spoofing cho phép kẻ gian giả mạo tên thương hiệu.",
            "🔗 Đường dẫn giả tinh xảo: Link thường có thêm từ phụ như vcb-smart-otp.top, vnpost-tracking.online, techcom-security.cc...",
            "🛑 Nguyên tắc bất di bất dịch: KHÔNG BAO GIỜ nhập mật khẩu đăng nhập, mã Smart OTP / SMS OTP vào bất kỳ trang web nào được gửi qua tin nhắn."
          ],
          "visualMockup": {
            "type": "sms",
            "sender": "MBBANK",
            "content": "MBBank tran trong thong bao: Tai khoan cua quy khach bi khoa do nghi van giao dich bat thuong. Truy cap https://mbbank-online-secure.xyz de mo khoa.",
            "highlightedRedFlags": [
              "mbbank-online-secure.xyz (đuôi .xyz)",
              "Dọa khóa tài khoản",
              "Chèn link trong SMS"
            ],
            "note": "Hiện nay các ngân hàng lớn tại VN đã ngưng gửi link đăng nhập trong SMS!"
          },
          "goldenRule": "Mọi tin nhắn SMS có đính kèm đường link URL đều phải coi là NGUY HIỂM!"
        },
        "practice": [
          {
            "id": "l4-p1",
            "type": "multiple_choice",
            "prompt": "Tại sao tin nhắn lừa đảo lại có thể nằm chung một luồng với các tin nhắn OTP thật trước đây của Ngân hàng?",
            "options": [
              {
                "id": "a",
                "text": "Do hệ thống ngân hàng bị hacker chiếm quyền hoàn toàn.",
                "isCorrect": false,
                "explanation": "Sai! Ngân hàng không bị hack, đây là kỹ thuật giả mạo sóng viễn thông."
              },
              {
                "id": "b",
                "text": "Kẻ lừa đảo sử dụng thiết bị trạm phát sóng BTS giả mạo để phát tán SMS có cùng tên Brandname.",
                "isCorrect": true,
                "explanation": "Chính xác! Trạm BTS giả mạo gửi sóng radio trực tiếp đến điện thoại ở cự ly gần."
              },
              {
                "id": "c",
                "text": "Do điện thoại của bạn bị hỏng phần mềm.",
                "isCorrect": false,
                "explanation": "Sai! Điện thoại bình thường vẫn nhận sóng giả mạo nếu ở gần trạm phát."
              }
            ]
          },
          {
            "id": "l4-p2",
            "type": "true_false",
            "prompt": "Nếu bưu tá nhắn tin bưu kiện giao không thành công kèm đường link, bạn nên bấm vào link để đổi lại địa chỉ.",
            "trueFalseAnswer": {
              "isTrue": false,
              "explanation": "Sai! Bấm vào link giả mạo sẽ bị trừ tiền thẻ hoặc cài app gián điệp. Luôn tra mã vận đơn trực tiếp trên website/ứng dụng chính thức của hãng bưu chính."
            }
          },
          {
            "id": "l4-p3",
            "type": "matching",
            "prompt": "Ghép đường link với độ an toàn:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "https://vietcombank.com.vn"
                },
                "right": {
                  "id": "r1",
                  "text": "Website chính thống của Ngân hàng Ngoại Thương VN",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "http://vietcombank-xacthuc.cc"
                },
                "right": {
                  "id": "r2",
                  "text": "Trang web lừa đảo đánh cắp tài khoản ngân hàng",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "https://vnpost.vn"
                },
                "right": {
                  "id": "r3",
                  "text": "Cổng thông tin bưu điện quốc gia an toàn",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-4-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Lừa đảo qua tin nhắn SMS giả mạo (Smishing)\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-4-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-4-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-4-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Lừa đảo qua tin nhắn SMS giả mạo (Smishing)\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-4-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-4-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-4-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Lừa đảo qua tin nhắn SMS giả mạo (Smishing)\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Gói Hàng Bị Mắc Kẹt Tại Bưu Cục",
          "scenarioContext": "Bạn nhận được tin nhắn từ \"VNPOST\" thông báo kiện hàng số 839218 không thể giao do thiếu số nhà.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "VNPOST SMS",
              "text": "Bưu phẩm #839218 giao thất bại. Vui lòng truy cập vnpost-capnhat-diachi.cc và thanh toán 10.000đ phí lưu kho trong hôm nay để bưu tá giao lại."
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Khoan đã! Phí 10.000đ chỉ là \"mồi nhử\" để bạn nhập thông tin thẻ Visa/Mastercard hoặc tài khoản ngân hàng.",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Vào link thanh toán 10.000đ cho xong việc vì số tiền rất nhỏ.",
                  "isSafe": false,
                  "feedback": "Bị trừ ngay hạn mức thẻ tín dụng hàng chục triệu đồng ở nước ngoài!",
                  "consequence": "Lộ toàn bộ số thẻ, ngày hết hạn và mã CVV bí mật."
                },
                {
                  "id": "c2",
                  "text": "Không bấm link. Mở ứng dụng VNPost chính chủ hoặc gọi người bán hàng để kiểm tra mã vận đơn.",
                  "isSafe": true,
                  "feedback": "Tuyệt vời! Bạn đã tránh được bẫy lừa cước phí chuyển phát phổ biến.",
                  "consequence": "Giữ kín tuyệt đối thông tin thẻ ngân hàng."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-5",
        "unitId": "unit-2",
        "number": 5,
        "title": "Lừa đảo thông báo trúng thưởng",
        "shortDesc": "Trúng thưởng xe sang, vàng ròng & bẫy đóng thuế nhận giải.",
        "targetGoal": "Khắc cốt ghi tâm nguyên tắc \"Không có bữa trưa miễn phí\" và từ chối mọi yêu cầu chuyển tiền cọc.",
        "xpReward": 60,
        "shieldBadgeName": "Khiên Tỉnh Táo Trước Mồi Nhử",
        "shieldBadgeIcon": "🎁",
        "theory": {
          "title": "Ma Trận Quà Tặng Ảo & Phí Nhận Thưởng",
          "summary": "Kịch bản thông báo bạn là người được chọn trúng xe SH, sổ tiết kiệm 200 triệu hoặc combo quà tặng miễn phí từ sàn Shopee/Lazada, nhưng ép bạn nộp \"phí hải quan\", \"thuế trước bạ\".",
          "keyPoints": [
            "🎁 Nguyên tắc trúng thưởng hợp pháp: Doanh nghiệp chân chính luôn trừ thuế thu nhập cá nhân TRỰC TIẾP từ giá trị giải thưởng trao cho bạn, KHÔNG BAO GIỜ bắt bạn chuyển tiền cọc trước.",
            "🔄 Bẫy leo thang số tiền: Ban đầu yêu cầu 300.000đ tiền ship, sau đó bảo \"lỗi cú pháp\" bắt đóng thêm 3 triệu, 10 triệu để hoàn tất thủ tục.",
            "⚖️ Không tham gia thì không trúng: Nếu bạn chưa từng mua vé dự thưởng hay tham gia chương trình bốc thăm thì 100% thông báo trúng thưởng là giả mạo."
          ],
          "visualMockup": {
            "type": "sms",
            "sender": "TRI-AN-KHACH-HANG",
            "content": "Chúc mừng SĐT 0912xxx đã trúng Giải Nhất: 01 Xe máy Honda SH150i trị giá 110 triệu VNĐ. Soạn tin hoặc liên hệ Zalo 0899xxx để đóng 3 triệu phí bảo hành nhận xe!",
            "highlightedRedFlags": [
              "Trúng xe không rõ nguồn gốc",
              "Yêu cầu đóng 3 triệu phí",
              "Liên hệ qua Zalo cá nhân"
            ],
            "note": "Không có cơ quan hay doanh nghiệp nào trao thưởng qua số điện thoại Zalo cá nhân!"
          },
          "goldenRule": "\"Bất cứ ai hứa cho bạn tiền miễn phí nhưng đòi bạn chuyển tiền trước đều là kẻ cắp!\""
        },
        "practice": [
          {
            "id": "l5-p1",
            "type": "multiple_choice",
            "prompt": "Quy trình nhận giải thưởng hợp pháp theo pháp luật Việt Nam diễn ra như thế nào?",
            "options": [
              {
                "id": "a",
                "text": "Người trúng thưởng phải chuyển trước 10% tiền thuế vào số tài khoản cá nhân của nhân viên.",
                "isCorrect": false,
                "explanation": "Sai! Không bao giờ chuyển vào tài khoản cá nhân nhân viên."
              },
              {
                "id": "b",
                "text": "Thuế thu nhập cá nhân được khấu trừ trực tiếp tại nguồn hoặc nộp tại cơ quan thuế khi ký nhận thưởng trực tiếp.",
                "isCorrect": true,
                "explanation": "Chính xác! Doanh nghiệp trao giải có trách nhiệm khấu trừ thuế hoặc có biên lai thu thuế có dấu đỏ."
              },
              {
                "id": "c",
                "text": "Chuyển tiền cọc qua ví điện tử rồi mới được xem hình ảnh giải thưởng.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy lừa đảo."
              }
            ]
          },
          {
            "id": "l5-p2",
            "type": "true_false",
            "prompt": "Nếu một công ty nổi tiếng nhắn tin tặng quà tri ân miễn phí 0 đồng nhưng yêu cầu bạn trả 150k tiền cước ship hàng giá rẻ, đây có thể là chiêu trò lừa đảo \"bán hàng kém chất lượng thu tiền ship cao\".",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Đúng! Rất nhiều kẻ gian gửi gói hàng đồ chơi hoặc đồ vô giá trị rồi thu tiền COD 150k - 200k, thu lợi hàng trăm triệu mỗi ngày."
            }
          },
          {
            "id": "l5-p3",
            "type": "matching",
            "prompt": "Ghép tình huống với cách xử lý đúng:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Nhận cuộc gọi trúng xe máy SH"
                },
                "right": {
                  "id": "r1",
                  "text": "Tắt máy, từ chối cung cấp địa chỉ và thông tin CCCD",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Giao hàng lạ yêu cầu trả tiền COD"
                },
                "right": {
                  "id": "r2",
                  "text": "Kiểm tra với người thân trong nhà, không nhận nếu không đặt",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Tin nhắn mời vào nhóm nhận lì xì 500k"
                },
                "right": {
                  "id": "r3",
                  "text": "Rời nhóm và chặn ngay kẻo bị dụ làm nhiệm vụ lừa đảo",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-5-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Lừa đảo thông báo trúng thưởng\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-5-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-5-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-5-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Lừa đảo thông báo trúng thưởng\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-5-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-5-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-5-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Lừa đảo thông báo trúng thưởng\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Chiếc Vé Trúng Thưởng 50 Triệu",
          "scenarioContext": "Bạn nhận được cuộc gọi từ \"Phòng Chăm Sóc Khách Hàng Siêu Thị Điện Máy X\", thông báo bạn có phiếu mua hàng trúng 50 triệu đồng.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Nhân Viên CSKH Ảo",
              "text": "Em chào anh! Hôm nay em chuyển khoản trao thưởng 50 triệu cho anh qua thẻ ATM. Anh chỉ cần mua giúp em 2 thẻ cào điện thoại 500k để làm phí kích hoạt hồ sơ thôi ạ."
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Mánh khóe đòi mã thẻ cào điện thoại! Khi bạn gửi mã thẻ, chúng nạp vào ví ảo rồi chặn số ngay lập tức.",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Chạy đi mua thẻ cào 500k gửi mã cho nhân viên để nhanh nhận 50 triệu.",
                  "isSafe": false,
                  "feedback": "Mất trắng tiền mua thẻ cào và không có bất kỳ giải thưởng nào!",
                  "consequence": "Bị kẻ lừa đảo lừa nạp tiền."
                },
                {
                  "id": "c2",
                  "text": "Trả lời: \"Hãy trừ 1 triệu tiền phí vào thẳng 50 triệu tiền thưởng rồi chuyển phần còn lại cho tôi\".",
                  "isSafe": true,
                  "feedback": "Câu trả lời cực kỳ thông minh! Kẻ lừa đảo lập tức bối rối và cúp máy.",
                  "consequence": "Vạch trần trò bịp bợm xuất sắc."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-17",
        "unitId": "unit-2",
        "number": 17,
        "title": "Bẫy cướp SIM 4G, eSIM & Đánh cắp mã OTP từ xa",
        "shortDesc": "Chiêu bài lừa nâng cấp SIM 4G/5G miễn phí để chiếm đoạt số điện thoại.",
        "targetGoal": "Nhận diện thủ đoạn gửi tin nhắn dụ đổi SIM và các dấu hiệu SIM điện thoại bị vô hiệu hóa bất thường.",
        "xpReward": 70,
        "shieldBadgeName": "Khiên Bảo Vệ SIM Số",
        "shieldBadgeIcon": "📡",
        "theory": {
          "title": "Thủ Đoạn SIM Swapping & Cướp eSIM Nguy Hiểm",
          "summary": "Kẻ gian mạo danh nhân viên nhà mạng Viettel/Vinaphone/MobiFone gọi điện hỗ trợ \"nâng cấp SIM 4G/5G miễn phí\", hướng dẫn soạn tin nhắn chuyển đổi cú pháp để cướp quyền kiểm soát số điện thoại của bạn.",
          "keyPoints": [
            "📱 Hậu quả của SIM Swapping: Khi SIM rơi vào tay kẻ gian, SIM trên điện thoại bạn sẽ bị MẤT SÓNG hoàn toàn. Kẻ gian lập tức yêu cầu quên mật khẩu ngân hàng và nhận mã OTP chuyển sạch tiền.",
            "⚠️ Dấu hiệu cảnh báo: Nhân viên tự xưng nhà mạng yêu cầu bạn đọc mã OTP gửi về máy hoặc soạn tin nhắn có cú pháp như \"DS gửi 901\" hay quét mã QR kích hoạt eSIM lạ.",
            "🛑 Biện pháp xử lý: Nếu điện thoại đột ngột mất sóng không rõ nguyên nhân, phải lấy máy khác gọi ngay tổng đài nhà mạng yêu cầu KHÓA SIM KHẨN CẤP."
          ],
          "visualMockup": {
            "type": "call",
            "sender": "CSKH-VIETNAM-TEL",
            "content": "Chào anh, số thuê bao của anh đủ điều kiện nâng cấp SIM 5G miễn phí và tặng 500k cước. Vui lòng soạn cú pháp YEUCAU 5G gửi 901 để kích hoạt!",
            "highlightedRedFlags": [
              "Dụ soạn tin nhắn chuyển đổi SIM",
              "Tặng tiền cước vô lý"
            ],
            "note": "Nhà mạng nâng cấp SIM chỉ thực hiện trực tiếp tại cửa hàng giao dịch chính thức!"
          },
          "goldenRule": "Không bao giờ soạn tin nhắn đổi SIM theo hướng dẫn của người lạ qua điện thoại!"
        },
        "practice": [
          {
            "id": "l17-p1",
            "type": "multiple_choice",
            "prompt": "Nếu điện thoại của bạn đang dùng bình thường bỗng nhiên bị MẤT SÓNG hoàn toàn (hiện No Service) giữa ban ngày, bạn nên làm gì?",
            "options": [
              {
                "id": "a",
                "text": "Nghĩ do mạng lag nên đi ngủ hoặc để kệ vài tiếng sau kiểm tra lại.",
                "isCorrect": false,
                "explanation": "Cực kỳ nguy hiểm! Kẻ gian có thể đang cướp SIM và rút tiền trong tài khoản của bạn."
              },
              {
                "id": "b",
                "text": "Dùng điện thoại người thân gọi ngay Hotline nhà mạng kiểm tra tình trạng SIM và yêu cầu khóa khẩn cấp nếu có dấu hiệu cấp lại SIM trái phép.",
                "isCorrect": true,
                "explanation": "Chính xác! Phản xạ cứu nguy kịp thời trong 15 phút vàng."
              },
              {
                "id": "c",
                "text": "Tắt nguồn máy đi rồi bật lại 10 lần.",
                "isCorrect": false,
                "explanation": "Lãng phí thời gian ứng phó khẩn cấp."
              }
            ]
          },
          {
            "id": "lesson-17-p2",
            "type": "matching",
            "prompt": "[Thực chiến #2] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-17-p3",
            "type": "true_false",
            "prompt": "[Thực chiến #3] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-17-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Bẫy cướp SIM 4G, eSIM & Đánh cắp mã OTP từ xa\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-17-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-17-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-17-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Bẫy cướp SIM 4G, eSIM & Đánh cắp mã OTP từ xa\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-17-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-17-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-17-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Bẫy cướp SIM 4G, eSIM & Đánh cắp mã OTP từ xa\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Cuộc Gọi Hỗ Trợ 5G Đêm Muộn",
          "scenarioContext": "Một người tự xưng nhân viên Viettel gọi bảo số SIM của bạn sắp bị khóa chiều gọi nếu không nâng cấp lên 5G.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Nhân Viên Viettel Giả",
              "text": "Anh chỉ cần đọc cho em mã số 6 số vừa gửi về máy để em kích hoạt giữ số cho anh trên hệ thống!"
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Mã 6 số đó chính là mã xác thực đổi SIM/eSIM! Bạn sẽ trả lời thế nào?",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Đọc mã cho nhân viên để được nâng cấp 5G miễn phí.",
                  "isSafe": false,
                  "feedback": "SIM bạn lập tức mất sóng, kẻ gian chiếm quyền đăng nhập ví điện tử MoMo và Ngân hàng!",
                  "consequence": "Bị cướp quyền SIM số."
                },
                {
                  "id": "c2",
                  "text": "Nói: \"Tôi sẽ trực tiếp ra cửa hàng Viettel để làm thủ tục\", cúp máy và không chia sẻ mã.",
                  "isSafe": true,
                  "feedback": "Chặn đứng âm mưu cướp SIM tinh vi trong tích tắc!",
                  "consequence": "Số điện thoại và tài khoản ngân hàng an toàn."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-18",
        "unitId": "unit-2",
        "number": 18,
        "title": "Bẫy Cán bộ Thuế / Điện lực dọa phạt & ép cài file APK",
        "shortDesc": "Giả danh cơ quan Thuế hỗ trợ hoàn thuế thu nhập và bẫy chiếm quyền Accessibility Android.",
        "targetGoal": "Nhận diện bẫy ép cài app Dịch vụ công / Tổng cục Thuế giả mạo và hiểu rõ cơ chế cấp quyền Trợ năng độc hại.",
        "xpReward": 75,
        "shieldBadgeName": "Huy Hiệu Kháng Mã Độc APK",
        "shieldBadgeIcon": "🛡️",
        "theory": {
          "title": "Mã Độc Android Accessibility Chiếm Đoạt Điện Thoại",
          "summary": "Kẻ gian giả danh Cán bộ Thuế hướng dẫn cài đặt app \"Tổng Cục Thuế\" hoặc \"Dịch vụ công\" đuôi .apk. Sau khi cài, ứng dụng yêu cầu cấp quyền \"Trợ năng\" (Accessibility Service) để tự động đọc mã OTP và điều khiển màn hình từ xa.",
          "keyPoints": [
            "📱 Quyền Trợ năng (Accessibility) cực kỳ nguy hiểm: Cho phép kẻ lừa đảo nhìn thấy mọi thao tác gõ phím, tự động mở app ngân hàng và chuyển tiền mà bạn không hề hay biết.",
            "🏛️ Tổng cục Thuế KHÔNG BAO GIỜ gửi link cài app qua Zalo hay tin nhắn: Mọi ứng dụng chính thức đều có mặt trên Google Play Store và Apple App Store.",
            "🛑 Cách xử lý nếu lỡ cài app lạ: BẬT NGAY CHẾ ĐỘ MÁY BAY (Airplane Mode) để ngắt mạng, sau đó khôi phục cài đặt gốc của điện thoại."
          ],
          "visualMockup": {
            "type": "chat",
            "sender": "Cán Bộ Thuế Q.1 (Zalo)",
            "content": "Anh tải ứng dụng ThueDienTu-ChinhPhu.apk tại link: http://gdt-gov-vn.cc/app để nhận lại 5.200.000đ tiền hoàn thuế năm nay nhé!",
            "highlightedRedFlags": [
              "Gửi link tải qua Zalo",
              "Đuôi file .apk",
              "Mồi nhử tiền hoàn thuế"
            ],
            "note": "Cơ quan thuế hướng dẫn hoàn thuế trực tiếp trên website canhan.gdt.gov.vn chính thống."
          },
          "goldenRule": "Tuyệt đối KHÔNG BAO GIỜ bật quyền Trợ năng (Accessibility) cho ứng dụng không rõ nguồn gốc!"
        },
        "practice": [
          {
            "id": "l18-p1",
            "type": "multiple_choice",
            "prompt": "Nếu một ứng dụng bạn vừa tải yêu cầu cấp quyền \"Dịch vụ Trợ năng\" (Accessibility Service) và \"Hiển thị trên ứng dụng khác\", bạn nên làm gì?",
            "options": [
              {
                "id": "a",
                "text": "Từ chối cấp quyền, lập tức gỡ bỏ ứng dụng và ngắt kết nối mạng.",
                "isCorrect": true,
                "explanation": "Chính xác! Đây là dấu hiệu của mã độc điều khiển từ xa chiếm quyền ngân hàng."
              },
              {
                "id": "b",
                "text": "Cứ bấm Đồng ý cho ứng dụng chạy bình thường.",
                "isCorrect": false,
                "explanation": "Sai! Cấp quyền này kẻ gian sẽ thấy toàn bộ mật khẩu và tự động chuyển tiền."
              }
            ]
          },
          {
            "id": "lesson-18-p2",
            "type": "matching",
            "prompt": "[Thực chiến #2] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-18-p3",
            "type": "true_false",
            "prompt": "[Thực chiến #3] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-18-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Bẫy Cán bộ Thuế / Điện lực dọa phạt & ép cài file APK\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-18-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-18-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-18-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Bẫy Cán bộ Thuế / Điện lực dọa phạt & ép cài file APK\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-18-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-18-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-18-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Bẫy Cán bộ Thuế / Điện lực dọa phạt & ép cài file APK\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Cạm Bẫy Hoàn Thuế 8 Triệu Đồng",
          "scenarioContext": "Zalo có người tự xưng Cán bộ Chi cục thuế nhắn thông báo bạn được hoàn 8 triệu tiền thuế.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Cán Bộ Thuế Online",
              "text": "Anh cài app này vào máy Android rồi đăng nhập để hệ thống đối soát tài khoản hoàn tiền nhé!"
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "File gửi qua có đuôi \".apk\". Đây là mã độc đánh cắp tiền tài khoản!",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Tải và bấm cho phép cài đặt từ nguồn không xác định.",
                  "isSafe": false,
                  "feedback": "Điện thoại bị kẻ gian chiếm quyền điều khiển trong đêm!",
                  "consequence": "Mất trắng tiền tiết kiệm."
                },
                {
                  "id": "c2",
                  "text": "Từ chối tải, chặn tài khoản Zalo và đến thẳng Chi cục Thuế địa phương để hỏi thông tin.",
                  "isSafe": true,
                  "feedback": "Xử lý chuẩn xác! Bạn đã bảo vệ an toàn chiếc điện thoại của mình.",
                  "consequence": "Thoát hiểm thành công."
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "unit-3",
    "unitNumber": 3,
    "title": "Bẫy trên không gian mạng",
    "objective": "An toàn khi sử dụng email, mạng xã hội, phòng chống lừa tình (Romance Scam) & mượn tiền",
    "themeColor": {
      "bg": "bg-purple-950/70",
      "border": "border-purple-500/50",
      "glow": "shadow-purple-500/20",
      "text": "text-purple-400",
      "gradient": "from-purple-600 to-indigo-700",
      "button": "bg-purple-500 hover:bg-purple-400 border-b-4 border-purple-700 text-slate-950"
    },
    "lessons": [
      {
        "id": "lesson-6",
        "unitId": "unit-3",
        "number": 6,
        "title": "Lừa đảo qua email (Phishing)",
        "shortDesc": "Email giả mạo Google, Microsoft, Ngân hàng đòi xác minh tài khoản.",
        "targetGoal": "Soi domain người gửi, phát hiện file đính kèm độc hại và ngăn ngừa lộ mật khẩu qua form giả.",
        "xpReward": 70,
        "shieldBadgeName": "Khiên Phòng Vệ Phishing",
        "shieldBadgeIcon": "📧",
        "theory": {
          "title": "Giải Phẫu Email Lừa Đảo Chuyên Nghiệp",
          "summary": "Phishing Email là thủ thuật gửi thư điện tử giả dạng từ các tổ chức lớn (Google, Apple, Microsoft, Thuế, HR Công ty) thông báo \"Mật khẩu hết hạn\" hoặc \"Hóa đơn thanh toán bất thường\" để dụ click link.",
          "keyPoints": [
            "🔍 Soi kỹ địa chỉ email (Sender Domain): Tên hiển thị có thể là \"Google Support\", nhưng địa chỉ thật đằng sau lại là \"support@security-googIe-check.xyz\" (chữ I viết hoa thay cho chữ l).",
            "📎 Cảnh giác file đính kèm: Không mở các file có đuôi lạ như .exe, .scr, .iso, .xlsm, .vbs hoặc file zip có mật khẩu từ người lạ.",
            "🔒 Đăng nhập trực tiếp trên trình duyệt: Không bao giờ đăng nhập tài khoản bằng cách click link trong email. Hãy mở tab mới và gõ trực tiếp địa chỉ chính thức."
          ],
          "visualMockup": {
            "type": "email",
            "sender": "Google Security Team <no-reply@goog1e-account-verify.com>",
            "content": "Cảnh báo bảo mật nghiêm trọng! Tài khoản Gmail của bạn sẽ bị xóa sau 24 giờ do không cập nhật chính sách. Nhấp vào đây để đăng nhập và xác thực.",
            "highlightedRedFlags": [
              "goog1e-account-verify.com (số 1 thay cho chữ l)",
              "Dọa xóa tài khoản sau 24h",
              "Link đăng nhập trong mail"
            ],
            "note": "Google thật không bao giờ gửi mail từ các tên miền lạ có số 1!"
          },
          "goldenRule": "\"Muốn đăng nhập, hãy tự mở tab mới - Không bao giờ click link đăng nhập từ email!\""
        },
        "practice": [
          {
            "id": "l6-p1",
            "type": "multiple_choice",
            "prompt": "Địa chỉ email người gửi nào dưới đây là email CHÍNH THỐNG đáng tin cậy từ Google?",
            "options": [
              {
                "id": "a",
                "text": "security-team@google-support.service.net",
                "isCorrect": false,
                "explanation": "Sai! Tên miền đuôi .net và google-support là giả mạo."
              },
              {
                "id": "b",
                "text": "no-reply@accounts.google.com",
                "isCorrect": true,
                "explanation": "Chính xác! Tên miền kết thúc chuẩn xác bằng .google.com."
              },
              {
                "id": "c",
                "text": "google.security.alert@gmail.com",
                "isCorrect": false,
                "explanation": "Sai! Đội ngũ chính thức của Google không dùng địa chỉ email cá nhân đuôi @gmail.com."
              }
            ]
          },
          {
            "id": "l6-p2",
            "type": "true_false",
            "prompt": "Khi nhận email từ phòng Nhân sự công ty thông báo nhận tiền thưởng Tết kèm file Excel nén \"BangLuongTet.zip\", bạn nên giải nén và mở file ngay lập tức.",
            "trueFalseAnswer": {
              "isTrue": false,
              "explanation": "Sai! Đây là hình thức tấn công nội bộ (Spear Phishing). Cần xác nhận trực tiếp với phòng HR hoặc quản trị IT công ty trước khi mở file zip nén."
            }
          },
          {
            "id": "l6-p3",
            "type": "matching",
            "prompt": "Ghép đuôi file đính kèm với mức độ rủi ro:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "File .exe / .bat / .scr"
                },
                "right": {
                  "id": "r1",
                  "text": "Cực kỳ nguy hiểm - Là chương trình tự chạy cài mã độc",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "File .pdf chính thức"
                },
                "right": {
                  "id": "r2",
                  "text": "Tương đối an toàn nếu mở bằng trình duyệt xem trước",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "File .xlsm có Macro"
                },
                "right": {
                  "id": "r3",
                  "text": "Nguy cơ chứa script độc hại tự động tải virus",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-6-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Lừa đảo qua email (Phishing)\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-6-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-6-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-6-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Lừa đảo qua email (Phishing)\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-6-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-6-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-6-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Lừa đảo qua email (Phishing)\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Email Cập Nhật Dung Lượng Hòm Thư",
          "scenarioContext": "Bạn nhận được email thông báo dung lượng hòm thư Outlook của công ty đã đầy 99%, sắp không thể nhận email mới.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "IT Helpdesk System",
              "text": "Dung lượng hòm thư của bạn đã vượt quá giới hạn 15GB. Nhấn vào nút [Nâng Cấp Ngay] và nhập mật khẩu email công ty để không bị chặn thư."
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Soi kỹ người gửi: \"it-support@outlook-system-cloud.org\". Link trỏ tới một trang web giao diện y hệt Microsoft nhưng URL lạ.",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Bấm link và nhập tài khoản + mật khẩu công ty vì sợ mất email công việc.",
                  "isSafe": false,
                  "feedback": "Hacker chiếm đoạt tài khoản công ty, gửi email lừa đảo mượn tiền toàn bộ đồng nghiệp!",
                  "consequence": "Lộ thông tin bí mật kinh doanh và mật khẩu."
                },
                {
                  "id": "c2",
                  "text": "Đánh dấu thư là Phishing/Spam, chuyển tiếp cho bộ phận IT công ty xử lý.",
                  "isSafe": true,
                  "feedback": "Chuẩn xác tác phong bảo mật chuyên nghiệp! Bạn vừa cứu công ty khỏi một vụ tấn công mạng.",
                  "consequence": "Ngăn chặn toàn bộ mã độc xâm nhập."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-7",
        "unitId": "unit-3",
        "number": 7,
        "title": "Lừa đảo lừa tình và kết bạn trên mạng xã hội",
        "shortDesc": "Bẫy tình cảm (Romance Scam), làm quen tặng quà ngoại quốc đòi thuế.",
        "targetGoal": "Nhận diện các mối quan hệ tình cảm ảo nhằm chiếm đoạt tài sản và bẻ gãy bẫy quà tặng hải quan.",
        "xpReward": 70,
        "shieldBadgeName": "Khiên Miễn Dịch Lừa Tình",
        "shieldBadgeIcon": "💔",
        "theory": {
          "title": "Chiêu Trò Bẫy Tình Cảm (Romance Scam / Pig Butchering)",
          "summary": "Kẻ gian tạo profile giả mạo hoàn hảo (bác sĩ quân y, phi công, doanh nhân thành đạt ở nước ngoài), nhắn tin tâm sự yêu đương trong nhiều tháng, sau đó gửi \"thùng quà triệu đô\" rồi nhờ bạn nộp phí thông quan.",
          "keyPoints": [
            "💘 Xây dựng lòng tin dài hạn: Kẻ lừa đảo kiên trì nhắn tin chia sẻ, quan tâm mỗi ngày, tạo cảm giác như tri kỷ thực sự.",
            "🎁 Bẫy gửi quà và tiền mặt qua bưu kiện: Chúng nói gửi thùng quà có chứa 500.000 USD hoặc kim cương, trang sức để sau này sang Việt Nam cưới bạn.",
            "✈️ Nhân viên hải quan / sân bay giả: Một đồng bọn gọi điện xưng là hải quan sân bay Tân Sơn Nhất/Nội Bài, đe dọa kiện tội buôn lậu nếu không nộp 30-50 triệu phí phạt."
          ],
          "visualMockup": {
            "type": "chat",
            "sender": "Captain David (Bác sĩ Liên Hợp Quốc)",
            "content": "Em yêu, anh vừa gửi về cho em 1 vali chứa 200.000 USD tiết kiệm của anh. Ngày mai sẽ có hải quan gọi báo em đóng 15 triệu tiền phí bảo lãnh nhé!",
            "highlightedRedFlags": [
              "Gửi tiền mặt qua bưu kiện (phạm pháp)",
              "Yêu cầu đóng phí bảo lãnh",
              "Chưa từng gặp mặt trực tiếp"
            ],
            "note": "Pháp luật quốc tế và Việt Nam nghiêm cấm gửi tiền mặt số lượng lớn trong bưu phẩm thông thường!"
          },
          "goldenRule": "\"Chưa từng gặp mặt ngoài đời mà đòi gửi tiền, gửi quà rồi bảo đóng phí = 100% LỪA ĐẢO!\""
        },
        "practice": [
          {
            "id": "l7-p1",
            "type": "multiple_choice",
            "prompt": "Người lạ trên Facebook/Tinder tự xưng là kỹ sư dầu khí nước ngoài muốn gửi món quà giá trị lớn về Việt Nam cho bạn. Bạn nên làm gì?",
            "options": [
              {
                "id": "a",
                "text": "Vui vẻ cung cấp địa chỉ nhà riêng và số điện thoại để nhận quà.",
                "isCorrect": false,
                "explanation": "Sai! Bạn sẽ bị đồng bọn giả danh hải quan gọi điện tống tiền liên tục."
              },
              {
                "id": "b",
                "text": "Từ chối, nhận thức đây là kịch bản lừa tình kinh điển và chặn tài khoản đó ngay lập tức.",
                "isCorrect": true,
                "explanation": "Chính xác! Đây là kịch bản lừa đảo tình cảm qua mạng đã khiến hàng ngàn nạn nhân mất tiền tỷ."
              },
              {
                "id": "c",
                "text": "Hỏi xem phí ship bao nhiêu rồi đồng ý trả nếu dưới 5 triệu.",
                "isCorrect": false,
                "explanation": "Sai! Khi bạn trả 5 triệu, chúng sẽ đòi tiếp 20 triệu, 50 triệu nữa."
              }
            ]
          },
          {
            "id": "l7-p2",
            "type": "true_false",
            "prompt": "Quy định hải quan sân bay cho phép gửi bưu kiện chứa hàng trăm ngàn USD tiền mặt qua đường bưu điện chỉ cần đóng phí bảo lãnh qua tài khoản cá nhân.",
            "trueFalseAnswer": {
              "isTrue": false,
              "explanation": "Sai hoàn toàn! Vận chuyển ngoại tệ trái phép qua bưu kiện là hành vi vi phạm pháp luật. Không có cơ quan hải quan nào thu phí qua tài khoản ngân hàng cá nhân."
            }
          },
          {
            "id": "l7-p3",
            "type": "matching",
            "prompt": "Ghép dấu hiệu nhận diện với bản chất thật:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Ảnh đại diện siêu đẹp nhưng không chịu gọi video"
                },
                "right": {
                  "id": "r1",
                  "text": "Dùng ảnh đánh cắp của người mẫu hoặc người nổi tiếng",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Tỏ tình nồng nhiệt chỉ sau vài ngày nhắn tin"
                },
                "right": {
                  "id": "r2",
                  "text": "Thao túng tâm lý (Love Bombing) để tạo niềm tin mù quáng",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Rủ rê đầu tư vào sàn tiền ảo bí mật"
                },
                "right": {
                  "id": "r3",
                  "text": "Chiêu trò \"Mổ heo\" (Pig Butchering) bòn rút hết tiền tiết kiệm",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-7-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Lừa đảo lừa tình và kết bạn trên mạng xã hội\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-7-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-7-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-7-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Lừa đảo lừa tình và kết bạn trên mạng xã hội\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-7-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-7-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-7-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Lừa đảo lừa tình và kết bạn trên mạng xã hội\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Món Quà Từ London",
          "scenarioContext": "Một tài khoản tên \"Thomas Miller\" trò chuyện thân thiết với bạn suốt 2 tháng qua, hôm nay bất ngờ gửi ảnh phiếu gửi hàng chuyển phát nhanh.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Thomas Miller",
              "text": "Honey, anh vừa gửi tặng em đồng hồ Rolex và túi Chanel để chuẩn bị tháng sau anh bay về VN thăm em. Em hãy nhận bưu kiện giúp anh nhé!"
            },
            {
              "sender": "scammer",
              "senderName": "Hải Quan Sân Bay (Đồng bọn)",
              "text": "Alo chị, bưu phẩm từ London về có chứa hàng xa xỉ và phong bì tiền USD. Chị phải chuyển 25 triệu phí thông quan vào STK cá nhân này trước 17h."
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Bẫy phối hợp 2 người! Bạn sẽ hành động thế nào để tự bảo vệ?",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Đi vay mượn tiền để chuyển gấp 25 triệu cho bưu cục.",
                  "isSafe": false,
                  "feedback": "Mất trắng 25 triệu! Chúng sẽ tiếp tục dọa \"báo công an vì tội nhận tiền lậu\" để đòi thêm tiền.",
                  "consequence": "Rơi vào vòng xoáy tống tiền liên tục."
                },
                {
                  "id": "c2",
                  "text": "Trả lời: \"Tôi không nhận bưu kiện này, yêu cầu hoàn trả người gửi\", sau đó chặn toàn bộ số liên lạc.",
                  "isSafe": true,
                  "feedback": "Quyết định dứt khoát và cực kỳ sáng suốt! Kẻ lừa đảo không thể làm gì bạn.",
                  "consequence": "Bảo vệ thành công tài chính và bình yên cho bản thân."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-8",
        "unitId": "unit-3",
        "number": 8,
        "title": "Hack Facebook, Zalo... nhắn tin mượn tiền",
        "shortDesc": "Chiếm quyền tài khoản người thân, dùng AI Deepfake giọng nói mượn tiền gấp.",
        "targetGoal": "Thiết lập phản xạ xác thực chéo bằng cách gọi điện thoại truyền thống hoặc dùng từ khóa an toàn gia đình.",
        "xpReward": 70,
        "shieldBadgeName": "Khiên Xác Thực Chéo",
        "shieldBadgeIcon": "👥",
        "theory": {
          "title": "Kịch Bản Hack Tài Khoản Mượn Tiền",
          "summary": "Kẻ gian đánh cắp tài khoản Facebook, Zalo, Telegram của bạn bè hoặc người thân của bạn qua link bình chọn thi ảnh / mã QR, sau đó đọc lịch sử tin nhắn rồi nhắn tin mượn tiền hàng loạt.",
          "keyPoints": [
            "🗣️ Đọc văn phong và bắt chước y hệt: Kẻ lừa đảo đọc tin nhắn cũ để xưng hô đúng biệt danh (\"mày - tao\", \"anh - em\", \"cháu - cô chú\").",
            "⚡ Lý do gấp gáp và tài khoản ngân hàng lạ: Luôn viện cớ \"tài khoản đang bị lỗi\" hoặc \"nhờ chuyển giùm cho đối tác\" để gửi số tài khoản đứng tên người khác.",
            "📞 Nguyên tắc vàng Xác thực chéo (Cross-Verification): Luôn gọi điện thoại trực tiếp bằng SIM thường (số di động thông thường) để nghe giọng nói thực tế."
          ],
          "visualMockup": {
            "type": "chat",
            "sender": "Bạn Thân (Tài khoản bị hack)",
            "content": "Mày ơi, app ngân hàng tao đang bảo trì mà cần chuyển gấp 5 triệu thanh toán tiền thuốc cho mẹ. Mày bắn vào STK: 1903xxx (NGUYEN VAN B) giúp tao 1 tiếng nữa tao trả liền!",
            "highlightedRedFlags": [
              "Tên người nhận không trùng tên bạn thân",
              "Mượn tiền gấp",
              "Lý do app ngân hàng bảo trì"
            ],
            "note": "Không bao giờ chuyển tiền nếu tên chủ tài khoản không phải là người bạn đang nói chuyện!"
          },
          "goldenRule": "\"Ai nhắn tin mượn tiền = Dừng lại, nhấc máy gọi điện thoại trực tiếp xác nhận!\""
        },
        "practice": [
          {
            "id": "l8-p1",
            "type": "multiple_choice",
            "prompt": "Khi nhận được tin nhắn Facebook từ anh ruột nhờ chuyển gấp 10 triệu đồng vào tài khoản của người lạ, hành động ĐẦU TIÊN của bạn là gì?",
            "options": [
              {
                "id": "a",
                "text": "Chuyển ngay vì sợ anh mình đang gặp nguy hiểm tính mạng.",
                "isCorrect": false,
                "explanation": "Sai! Rất có thể Facebook của anh bạn vừa bị hacker chiếm quyền."
              },
              {
                "id": "b",
                "text": "Bấm số điện thoại di động thông thường (SIM viễn thông) gọi trực tiếp cho anh ruột để xác minh.",
                "isCorrect": true,
                "explanation": "Chính xác! Gọi điện thoại trực tiếp sẽ làm rõ ngay Facebook có bị hack hay không."
              },
              {
                "id": "c",
                "text": "Nhắn tin qua Facebook hỏi \"Anh cần gấp lắm không?\".",
                "isCorrect": false,
                "explanation": "Sai! Hacker đang cầm tài khoản Facebook sẽ lập tức trả lời \"Rất gấp em ơi\"."
              }
            ]
          },
          {
            "id": "l8-p2",
            "type": "true_false",
            "prompt": "Nếu người đó gọi video call trên Messenger nhưng hình ảnh chỉ chớp nhoáng 2-3 giây rồi tắt với lý do \"mạng yếu\", bạn có thể hoàn toàn tin tưởng đó là người thật.",
            "trueFalseAnswer": {
              "isTrue": false,
              "explanation": "Sai! Hacker thường dùng video quay sẵn hoặc Deepfake phát lại vài giây để lấy lòng tin rồi cúp máy đổ lỗi do mạng yếu."
            }
          },
          {
            "id": "l8-p3",
            "type": "matching",
            "prompt": "Ghép tình huống với giải pháp an toàn:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Nhận link nhờ \"Bình chọn cuộc thi ảnh nhí\""
                },
                "right": {
                  "id": "r1",
                  "text": "Tuyệt đối không đăng nhập Facebook/Zalo vào link lạ",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Người thân mượn tiền"
                },
                "right": {
                  "id": "r2",
                  "text": "Hỏi Mật khẩu an toàn gia đình (Safe Word) hoặc gọi điện trực tiếp",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Tài khoản của chính bạn bị hack"
                },
                "right": {
                  "id": "r3",
                  "text": "Đăng thông báo lên các kênh khác để bạn bè không bị lừa",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-8-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Hack Facebook, Zalo... nhắn tin mượn tiền\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-8-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-8-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-8-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Hack Facebook, Zalo... nhắn tin mượn tiền\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-8-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-8-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-8-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Hack Facebook, Zalo... nhắn tin mượn tiền\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Cuộc Gọi Video 3 Giây Bí Ẩn",
          "scenarioContext": "Facebook của đứa cháu đang du học ở Nhật nhắn tin xin bạn chuyển 20 triệu đóng học phí kỳ mới.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Cháu Ruột (Tài khoản bị hack)",
              "text": "Cô ơi, bên Nhật đang gấp quá, cô chuyển vào STK người ủy nhiệm này giúp cháu 20 triệu nha cô!"
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Nghi vấn tài khoản bị hack! Kẻ gian vừa phát một đoạn video ngắn cắt ghép khuôn mặt của người cháu rồi tắt phụt.",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Thấy mặt cháu trong video rồi nên chuyển tiền ngay.",
                  "isSafe": false,
                  "feedback": "Bị lừa 20 triệu! Video đó là đoạn video cũ trên TikTok được hacker phát lại.",
                  "consequence": "Mất tiền cho kẻ trộm tài khoản."
                },
                {
                  "id": "c2",
                  "text": "Hỏi câu hỏi riêng tư: \"Tên chú cún cưng ở nhà nuôi tên là gì?\" hoặc gọi điện thoại cho bố mẹ của cháu để kiểm tra.",
                  "isSafe": true,
                  "feedback": "Cực kỳ tinh quái! Hacker không biết câu trả lời riêng tư và lập tức biến mất.",
                  "consequence": "Bảo vệ toàn vẹn tài sản gia đình."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-19",
        "unitId": "unit-3",
        "number": 19,
        "title": "Bẫy bình chọn ảnh / Casting mẫu nhí chiếm tài khoản",
        "shortDesc": "Vạch trần link bình chọn thi đua, thi hoa khôi, casting người mẫu nhằm chiếm đoạt tài khoản MXH.",
        "targetGoal": "Hiểu cơ chế trang đăng nhập Facebook giả mạo ẩn sau các cuộc thi bình chọn trực tuyến.",
        "xpReward": 75,
        "shieldBadgeName": "Khiên Giải Mã Bẫy Bình Chọn",
        "shieldBadgeIcon": "📸",
        "theory": {
          "title": "Mánh Khóe \"Bình Chọn Cho Cháu Em\"",
          "summary": "Kẻ gian chiếm nick của bạn bè bạn, sau đó gửi tin nhắn nhờ bình chọn ảnh thi bé khỏe bé ngoan, cuộc thi vẽ tranh thiếu nhi. Link dẫn tới một trang web bắt bạn \"Đăng nhập Facebook/Zalo để tính 1 lượt bình chọn\".",
          "keyPoints": [
            "🎭 Khung đăng nhập giả mạo: Giao diện giống hệt trang đăng nhập Facebook, nhưng khi bạn điền SĐT và Mật khẩu, thông tin lập tức gửi thẳng về máy chủ của hacker.",
            "⚡ Chiếm quyền và đổi mật khẩu trong 10 giây: Kẻ gian chiếm nick của bạn và tiếp tục nhắn tin mượn tiền tất cả người thân trong danh bạ.",
            "🛑 Không bao giờ đăng nhập tài khoản MXH trên các trang web bình chọn lạ."
          ],
          "visualMockup": {
            "type": "chat",
            "sender": "Bạn Thân Đại Học (Đã bị hack)",
            "content": "Cháu mình đang thi Giọng Hát Việt Nhí, bạn vào link binhchon-gionghatnhi2026.online đăng nhập FB vote giúp cháu 1 phiếu nhé, cảm ơn bạn!",
            "highlightedRedFlags": [
              "binhchon-gionghatnhi2026.online",
              "Bắt đăng nhập FB để vote"
            ],
            "note": "Các cuộc thi uy tín không bắt đăng nhập tài khoản cá nhân trên web lạ."
          },
          "goldenRule": "Không nhập mật khẩu Facebook/Zalo vào bất kỳ trang web bình chọn nào!"
        },
        "practice": [
          {
            "id": "l19-p1",
            "type": "multiple_choice",
            "prompt": "Nếu một người bạn thân lâu ngày không gặp nhắn tin nhờ bạn bấm vào link bình chọn cuộc thi ảnh, bạn nên làm gì?",
            "options": [
              {
                "id": "a",
                "text": "Gọi điện thoại trực tiếp cho người bạn đó để hỏi xem có đúng họ gửi tin nhắn không.",
                "isCorrect": true,
                "explanation": "Chính xác! Bước xác thực truyền thống giúp phát hiện nick bị hack ngay lập tức."
              },
              {
                "id": "b",
                "text": "Bấm vào link và nhập tài khoản mật khẩu Facebook để giúp bạn.",
                "isCorrect": false,
                "explanation": "Sai! Bạn sẽ bị mất nick ngay lập tức."
              }
            ]
          },
          {
            "id": "lesson-19-p2",
            "type": "matching",
            "prompt": "[Thực chiến #2] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-19-p3",
            "type": "true_false",
            "prompt": "[Thực chiến #3] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-19-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Bẫy bình chọn ảnh / Casting mẫu nhí chiếm tài khoản\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-19-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-19-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-19-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Bẫy bình chọn ảnh / Casting mẫu nhí chiếm tài khoản\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-19-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-19-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-19-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Bẫy bình chọn ảnh / Casting mẫu nhí chiếm tài khoản\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Cuộc Thi Siêu Mẫu Nhí",
          "scenarioContext": "Chị họ gửi link nhờ bạn bình chọn cho con gái thi tài năng nhí toàn quốc.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Chị Họ (Tài khoản bị hack)",
              "text": "Em ơi bình chọn cho cháu nhanh với, chỉ còn 10 phút nữa là hết hạn cuộc thi rồi!"
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Trang web yêu cầu nhập mật khẩu Facebook. Bạn phản ứng thế nào?",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Nhập thông tin đăng nhập để bình chọn cho cháu.",
                  "isSafe": false,
                  "feedback": "Tài khoản Facebook của bạn bị đổi mật khẩu và bật xác thực 2 lớp của hacker!",
                  "consequence": "Mất nick vĩnh viễn."
                },
                {
                  "id": "c2",
                  "text": "Gọi điện cho chị họ. Chị thông báo nick vừa bị hack mất cách đây 1 tiếng!",
                  "isSafe": true,
                  "feedback": "Phản xạ vàng! Bạn đã cứu chính mình khỏi cạm bẫy chiếm tài khoản.",
                  "consequence": "Bảo vệ an toàn tài khoản mạng xã hội."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-20",
        "unitId": "unit-3",
        "number": 20,
        "title": "Mật mã an toàn gia đình (Safe Word) chống kẻ giả danh",
        "shortDesc": "Xây dựng quy tắc xác thực nội bộ gia đình để vô hiệu hóa kẻ mạo danh và Deepfake.",
        "targetGoal": "Thiết lập từ khóa bí mật (Family Safe Word) giữa các thành viên để nhận diện người thật.",
        "xpReward": 80,
        "shieldBadgeName": "Huy Hiệu Safe Word Gia Đình",
        "shieldBadgeIcon": "🗝️",
        "theory": {
          "title": "Vũ Khí Tối Thượng: Family Safe Word",
          "summary": "Trong kỷ nguyên AI Deepfake có thể nhái giọng nói và video khuôn mặt của bất kỳ ai, \"Mật mã an toàn gia đình\" (Safe Word) là chốt chặn bảo mật sinh tử duy nhất không thể bị bẻ khóa.",
          "keyPoints": [
            "🗝️ Safe Word là gì? Là một từ hoặc cụm từ bí mật chỉ riêng các thành viên trong gia đình bạn biết (ví dụ: tên chú cún đầu tiên, món ăn mẹ nấu dở nhất...).",
            "🛡️ Khi nào sử dụng? Bất cứ khi nào có cuộc gọi/tin nhắn yêu cầu chuyển tiền khẩn cấp vì tai nạn, cấp cứu, mua hàng... người gọi phải đọc đúng Safe Word.",
            "🛑 AI và hacker không thể đoán được ký ức nội bộ gia đình dù chúng có công nghệ tối tân đến đâu."
          ],
          "visualMockup": {
            "type": "warning",
            "sender": "Quy Chuẩn An Ninh Gia Đình ScamGuard",
            "content": "Hãy dành 5 phút tối nay để thống nhất 1 Safe Word với Bố Mẹ và Con Cái của bạn!",
            "highlightedRedFlags": [
              "Không công khai Safe Word trên mạng xã hội"
            ],
            "note": "Thay đổi Safe Word sau mỗi 6 tháng."
          },
          "goldenRule": "Không có Safe Word đúng = Tuyệt đối KHÔNG chuyển một đồng nào!"
        },
        "practice": [
          {
            "id": "l20-p1",
            "type": "true_false",
            "prompt": "Kẻ lừa đảo sử dụng AI Deepfake có thể dễ dàng đoán ra Mật mã gia đình (Safe Word) nếu từ khóa đó chưa từng được đăng lên mạng.",
            "trueFalseAnswer": {
              "isTrue": false,
              "explanation": "Đúng vậy! AI chỉ bắt chước được hình ảnh và giọng nói, không thể đọc được suy nghĩ hay ký ức riêng tư của gia đình bạn."
            }
          },
          {
            "id": "lesson-20-p2",
            "type": "matching",
            "prompt": "[Thực chiến #2] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-20-p3",
            "type": "true_false",
            "prompt": "[Thực chiến #3] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-20-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Mật mã an toàn gia đình (Safe Word) chống kẻ giả danh\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-20-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-20-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-20-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Mật mã an toàn gia đình (Safe Word) chống kẻ giả danh\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-20-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-20-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-20-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Mật mã an toàn gia đình (Safe Word) chống kẻ giả danh\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Cuộc Gọi Cấp Cứu Giữa Đêm",
          "scenarioContext": "Một cuộc gọi bằng giọng nói giống hệt con bạn báo đang bị giữ xe ở đồn công an cần 20 triệu chuộc.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Giọng Con Trai (Deepfake AI)",
              "text": "Mẹ ơi cứu con, con lỡ đâm vào xe người ta, công an bắt nộp tiền phạt ngay không là bị giam xe!"
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Hãy kích hoạt chốt chặn Safe Word ngay lập tức!",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Hỏi ngay: \"Mật mã an toàn gia đình mình là gì con?\", kẻ gọi ấp úng rồi tắt máy.",
                  "isSafe": true,
                  "feedback": "Chiến thắng ngoạn mục trước công nghệ Deepfake tân tiến nhất!",
                  "consequence": "Kẻ gian lộ diện và bỏ chạy."
                },
                {
                  "id": "c2",
                  "text": "Hoảng sợ chuyển 20 triệu ngay vào số tài khoản kẻ lạ vừa đọc.",
                  "isSafe": false,
                  "feedback": "Bạn đã bị mất tiền vào tay kẻ giả mạo giọng nói!",
                  "consequence": "Mắc bẫy lừa đảo."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-27",
        "unitId": "unit-3",
        "number": 27,
        "title": "Bẫy Shipper Giao Đơn Ảo COD & Bưu Phẩm Trúng Thưởng",
        "shortDesc": "Vạch trần thủ đoạn bưu tá dỏm giao đơn hàng 0đ đòi tiền cọc và link xác nhận hàng.",
        "targetGoal": "Kiểm tra mã vận đơn trên ứng dụng sàn TMĐT trước khi nhận hàng và kiên quyết không nhận đơn chưa đặt.",
        "xpReward": 80,
        "shieldBadgeName": "Khiên Thẩm Định Đơn Hàng TMĐT",
        "shieldBadgeIcon": "📦",
        "theory": {
          "title": "Chiêu Trò Bưu Tá Giao Đơn Ảo Thu Tiền COD",
          "summary": "Kẻ gian thu thập họ tên, địa chỉ và số điện thoại của bạn từ các gói rác mua sắm online, sau đó đóng gói hộp carton rỗng gửi tới nhà bạn vào lúc bạn vắng nhà và bắt người nhà thanh toán tiền thu hộ COD 100k - 500k.",
          "keyPoints": [
            "📦 Nguyên tắc 1: Luôn đối chiếu Mã Vận Đơn (Tracking ID) trên app Shopee/Lazada/TikTok Shop xem đơn đó có đang ở trạng thái \"Đang giao\" hay không.",
            "📱 Nguyên tắc 2: Dặn người nhà KHÔNG nhận hoặc thanh toán hộ bất kỳ kiện hàng nào nếu chưa gọi điện xác nhận trực tiếp với bạn.",
            "🛑 Tuyệt đối KHÔNG bấm vào đường link \"Xác nhận nhận bưu phẩm\" mà shipper lạ gửi qua tin nhắn SMS."
          ],
          "visualMockup": {
            "type": "sms",
            "sender": "SHIPPER-EXPRESS",
            "content": "Don hang SPX-99812 cua ban tri gia 350.000d da den. Ban vang nha hay chuyen khoan vao STK 0981xxx va bam link http://giao-hang-nhanh.cc/nhan-hang de xac nhan!",
            "highlightedRedFlags": [
              "Gửi link lạ xác nhận",
              "Ép chuyển khoản khi chưa xem hàng"
            ],
            "note": "Các đơn vị vận chuyển chính thống không gửi link đuôi .cc bắt xác nhận!"
          },
          "goldenRule": "Không đặt = Không nhận! Không thanh toán bất kỳ đơn hàng nào chưa đối chiếu mã vận đơn trên app!"
        },
        "practice": [
          {
            "id": "l27-p1",
            "type": "multiple_choice",
            "prompt": "Khi shipper gọi điện báo có bưu phẩm COD 250.000đ nhưng bạn nhớ rõ mình không hề đặt món đồ nào trong tuần qua, bạn nên làm gì?",
            "options": [
              {
                "id": "a",
                "text": "Từ chối nhận hàng dứt khoát và yêu cầu shipper hoàn trả kiện hàng về cho người gửi.",
                "isCorrect": true,
                "explanation": "Chính xác! Đây là biện pháp duy nhất triệt tiêu bẫy giao hàng rác COD."
              },
              {
                "id": "b",
                "text": "Cứ trả tiền nhận hàng mở ra xem thử bên trong có gì.",
                "isCorrect": false,
                "explanation": "Mất tiền oan! Bên trong thường chỉ là mảnh xốp, giấy vụn hoặc cục gạch vụn."
              }
            ]
          },
          {
            "id": "lesson-27-p2",
            "type": "matching",
            "prompt": "[Thực chiến #2] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-27-p3",
            "type": "true_false",
            "prompt": "[Thực chiến #3] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-27-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Bẫy Shipper Giao Đơn Ảo COD & Bưu Phẩm Trúng Thưởng\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-27-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-27-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-27-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Bẫy Shipper Giao Đơn Ảo COD & Bưu Phẩm Trúng Thưởng\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-27-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-27-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-27-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Bẫy Shipper Giao Đơn Ảo COD & Bưu Phẩm Trúng Thưởng\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Gói Hàng Của Bố",
          "scenarioContext": "Mẹ bạn ở nhà nhận được gói hàng đề tên bạn với tiền thu hộ 450.000đ.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Shipper Tự Xưng",
              "text": "Bác ơi con của bác nhờ nhận hộ gói quà tri ân này, đưa cháu 450 ngàn tiền cước hải quan nhé!"
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Mẹ gọi điện hỏi bạn xem có đặt hàng không. Bạn trả lời thế nào?",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Bảo Mẹ: \"Con không đặt gì cả, Mẹ trả lại shipper và không đưa bất kỳ đồng nào nhé!\".",
                  "isSafe": true,
                  "feedback": "Tuyệt vời! Bạn đã bảo vệ an toàn túi tiền của gia đình.",
                  "consequence": "Thoát bẫy giao hàng lừa đảo."
                },
                {
                  "id": "c2",
                  "text": "Bảo Mẹ cứ ứng tiền trả hộ con.",
                  "isSafe": false,
                  "feedback": "Mở gói hàng ra chỉ có túi muối vô giá trị, mất toi 450 ngàn!",
                  "consequence": "Mắc bẫy lừa đảo."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-31",
        "unitId": "unit-3",
        "number": 31,
        "title": "Bẫy Lừa Đảo Việc Làm Online & Task TikTok/Telegram",
        "shortDesc": "Vạch trần chiêu bài thả mồi thưởng 30k rồi dụ nạp quỹ điểm nâng thẻ VIP.",
        "targetGoal": "Nhận diện nguyên tắc không nạp tiền để làm việc online và phòng tránh mất tiền tỷ.",
        "xpReward": 90,
        "shieldBadgeName": "Huy Hiệu Cảnh Giác Việc Làm",
        "shieldBadgeIcon": "💼",
        "theory": {
          "title": "Vạch Trần Bẫy Lừa Đảo Nhiệm Vụ Nạp Tiền Chiết Khấu",
          "summary": "Kẻ gian lợi dụng nhu cầu làm việc tại nhà để tuyển \"Cộng tác viên thả tim TikTok, Shopee, Đánh giá khách sạn\". Thủ đoạn là cho bạn ăn tiền nhỏ vài chục nghìn ban đầu, sau đó dụ nạp tiền vào quỹ lớn hơn để bị chiếm đoạt.",
          "keyPoints": [
            "💸 Việc thật KHÔNG BAO GIỜ yêu cầu người lao động phải nạp tiền trước để làm việc.",
            "🎯 Chiêu bài \"Thả mồi nhử\": Nhiệm vụ 1-3 trả thưởng ngay 30k-90k để tạo niềm tin tuyệt đối.",
            "🔒 Lấy lý do \"Thao tác sai cú pháp\", \"Lỗi tài khoản VIP\" để ép bạn tiếp tục nạp số tiền gấp đôi, gấp ba."
          ],
          "visualMockup": {
            "type": "chat",
            "sender": "Trưởng Nhóm Tuyển Dụng Telegram",
            "content": "Chị chuyển nạp 5.000.000đ vào Quỹ Điểm VIP3 để được rút tổng 8.500.000đ gốc lẫn hoa hồng nhé!",
            "highlightedRedFlags": [
              "Yêu cầu nạp tiền cá nhân để rút hoa hồng"
            ],
            "note": "Tất cả các mô hình yêu cầu nạp tiền nộp quỹ làm nhiệm vụ đều là LỪA ĐẢO 100%!"
          },
          "goldenRule": "Không có công việc nhẹ lương cao nạp tiền làm nhiệm vụ nào là thật!"
        },
        "practice": [
          {
            "id": "l31-p1",
            "type": "multiple_choice",
            "prompt": "Nếu một tài khoản nhắn tin tuyển bạn làm CTV xem video TikTok nhận 50k/video, nhưng yêu cầu chuyển 200k tiền giữ chân, bạn xử lý thế nào?",
            "options": [
              {
                "id": "a",
                "text": "Chặn tin nhắn ngay lập tức vì công việc chân chính không bao giờ thu tiền ứng viên.",
                "isCorrect": true,
                "explanation": "Chính xác! Bất kỳ công việc nào đòi nạp tiền trước đều là lừa đảo."
              },
              {
                "id": "b",
                "text": "Chuyển thử 200k vì số tiền nhỏ.",
                "isCorrect": false,
                "explanation": "Sau khi chuyển 200k, kẻ gian sẽ dụ bạn chuyển tiếp 2 triệu, 10 triệu!"
              }
            ]
          },
          {
            "id": "lesson-31-p2",
            "type": "matching",
            "prompt": "[Thực chiến #2] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-31-p3",
            "type": "true_false",
            "prompt": "[Thực chiến #3] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-31-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Bẫy Lừa Đảo Việc Làm Online & Task TikTok/Telegram\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-31-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-31-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-31-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Bẫy Lừa Đảo Việc Làm Online & Task TikTok/Telegram\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-31-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-31-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-31-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Bẫy Lừa Đảo Việc Làm Online & Task TikTok/Telegram\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Bẫy Rút Tiền Hoa Hồng VIP",
          "scenarioContext": "Bạn đã hoàn thành 3 nhiệm vụ thả tim TikTok và nhận được 90.000đ vào tài khoản.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Trưởng Phòng Nhân Sự Media",
              "text": "Chúc mừng bạn! Bây giờ nạp 2 triệu để kích hoạt gói VIP nhận hoa hồng 50% nhé!"
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Đây là thời điểm kẻ lừa đảo bắt đầu cất lưới! Bạn chọn dừng lại hay nạp tiếp?",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Dừng lại, rút 90k và chặn toàn bộ tài khoản Telegram này.",
                  "isSafe": true,
                  "feedback": "Xử lý tuyệt vời! Bạn đã tỉnh táo và không rơi vào bẫy mất tiền tỷ.",
                  "consequence": "Thoát hiểm thành công."
                },
                {
                  "id": "c2",
                  "text": "Nạp 2 triệu vì tin tưởng công ty uy tín.",
                  "isSafe": false,
                  "feedback": "Bạn đã mất 2 triệu và bị thúc ép nạp tiếp 10 triệu!",
                  "consequence": "Mất toàn bộ tiền tích lũy."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-32",
        "unitId": "unit-3",
        "number": 32,
        "title": "An Toàn Mạng Gia Đình: Bảo Vệ Người Cao Tuổi & Trẻ Em",
        "shortDesc": "Thiết lập lá chắn gia đình phòng thủ cuộc gọi đe dọa bắt giam và mã độc.",
        "targetGoal": "Nắm vững quy tắc mật khẩu gia đình và cách bảo vệ ông bà, cha mẹ khỏi kẻ gian.",
        "xpReward": 95,
        "shieldBadgeName": "Huy Hiệu Vệ Binh Gia Đình",
        "shieldBadgeIcon": "🏡",
        "theory": {
          "title": "Bảo Vệ Người Thân Trước Cuộc Gọi Đe Dọa",
          "summary": "Người cao tuổi và học sinh là hai nhóm đối tượng dễ bị tội phạm mạng tấn công nhất do tâm lý hoảng sợ trước các cuộc gọi mạo danh công an, cơ quan thuế, nhà trường.",
          "keyPoints": [
            "🔑 Quy tắc Mật Khẩu Gia Đình: Đặt 1 cụm từ bí mật mà chỉ các thành viên trong nhà biết để xác minh khi nhận cuộc gọi báo tin tai nạn/cấp cứu.",
            "📱 Cài đặt chế độ Chặn Cuộc Gọi Lạ trên điện thoại của ông bà, cha mẹ.",
            "🤝 Luôn dặn dò người thân: \"Có bất kỳ chuyện gì liên quan đến tiền bạc, hãy gọi cho con/cháu trước khi chuyển!\""
          ],
          "visualMockup": {
            "type": "sms",
            "sender": "Cảnh Báo Từ CyberGuard Guardian",
            "content": "Thiết lập thành công Mật khẩu Bí mật Gia đình. Mọi yêu cầu chuyển tiền gấp bắt buộc phải đọc đúng mật khẩu!",
            "highlightedRedFlags": [
              "Mật khẩu bí mật riêng của gia đình"
            ],
            "note": "Tạo lập thói quen chia sẻ thông tin giữa các thế hệ trong gia đình!"
          },
          "goldenRule": "Mật khẩu gia đình là chìa khóa hóa giải mọi cuộc gọi giả mạo người thân!"
        },
        "practice": [
          {
            "id": "l32-p1",
            "type": "multiple_choice",
            "prompt": "Để bảo vệ bố mẹ đã nghỉ hưu khỏi các cuộc gọi lừa đảo mạo danh Cảnh sát giao thông phạt nguội, biện pháp hiệu quả nhất là gì?",
            "options": [
              {
                "id": "a",
                "text": "Hướng dẫn bố mẹ quy tắc: Công an không đòi tiền qua điện thoại và đặt Mật khẩu Gia đình để xác minh.",
                "isCorrect": true,
                "explanation": "Chính xác! Giúp bố mẹ có điểm tựa tâm lý vững vàng."
              },
              {
                "id": "b",
                "text": "Tắt điện thoại của bố mẹ.",
                "isCorrect": false,
                "explanation": "Gây bất tiện cho liên lạc hằng ngày."
              }
            ]
          },
          {
            "id": "lesson-32-p2",
            "type": "matching",
            "prompt": "[Thực chiến #2] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-32-p3",
            "type": "true_false",
            "prompt": "[Thực chiến #3] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-32-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"An Toàn Mạng Gia Đình: Bảo Vệ Người Cao Tuổi & Trẻ Em\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-32-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-32-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-32-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"An Toàn Mạng Gia Đình: Bảo Vệ Người Cao Tuổi & Trẻ Em\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-32-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-32-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-32-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"An Toàn Mạng Gia Đình: Bảo Vệ Người Cao Tuổi & Trẻ Em\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Xác Minh Mật Khẩu Gia Đình",
          "scenarioContext": "Mẹ bạn nhận được cuộc gọi tự xưng là Bác sĩ Bệnh viện cấp cứu con trai.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Kẻ Giả Mạo Bác Sĩ",
              "text": "Con bà bị ngã gãy chân, chuyển gấp 20 triệu vào số tài khoản này ngay!"
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Mẹ bạn nhớ lời dặn và hỏi Mật khẩu Bí mật Gia đình. Tên lừa đảo tịt ngòi!",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Yêu cầu đọc Mật khẩu Gia đình, kẻ gian cúp máy ngay lập tức.",
                  "isSafe": true,
                  "feedback": "Mật khẩu gia đình phát huy tác dụng tuyệt đối!",
                  "consequence": "Bảo vệ gia đình an toàn."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-33",
        "unitId": "unit-3",
        "number": 33,
        "title": "Bẫy Lừa Đảo Việc Nhẹ Lương Cao Campuchia & Tam Giác Vàng",
        "shortDesc": "Vạch trần chiêu bài tuyển dụng sang Campuchia/Bavet gõ máy tính 30-50 triệu/tháng.",
        "targetGoal": "Cảnh giác tuyệt đối trước các lời mời xuất khẩu lao động chui và bẫy cưỡng bức lừa đảo.",
        "xpReward": 100,
        "shieldBadgeName": "Huy Hiệu Giải Mã Hang Ổ Biên Giới",
        "shieldBadgeIcon": "🏰",
        "theory": {
          "title": "Hiểm Họa Cưỡng Bức Lừa Đảo Xuyên Biên Giới",
          "summary": "Tội phạm tổ chức tuyển dụng \"Việc nhẹ lương cao\" qua Facebook/TikTok: Nhập liệu máy tính, hỗ trợ khách hàng tại Campuchia, Myanmar, Lao. Khi sang tới nơi, nạn nhân bị thu hộ chiếu, nhốt trong các khu sòng bạc khép kín và ép buộc gọi điện lừa đảo đồng bào.",
          "keyPoints": [
            "🚨 \"Việc nhẹ lương cao 40 triệu không cần bằng cấp\" là bẫy buôn người 100%.",
            "🛂 Kẻ gian bao xe sang biên giới chui (mộc bài / vượt sông), thu hết giấy tờ tùy thân.",
            "⛓️ Muốn về nước, gia đình nạn nhân phải nộp tiền chuộc từ 100 triệu đến hàng trăm triệu đồng!"
          ],
          "visualMockup": {
            "type": "chat",
            "sender": "Môi Giới Tuyển Dụng Biên Giới (Zalo)",
            "content": "Em sang Bavet làm trực chat CSKH cho casino, lương cứng 1.500 USD/tháng + hoa hồng. Bên anh lo hết vé xe và ăn ở!",
            "highlightedRedFlags": [
              "Lương 1.500 USD không bằng cấp",
              "Bao đi chui qua biên giới"
            ],
            "note": "Tuyệt đối không bao giờ tin lời dụ dỗ sang biên giới làm việc chui!"
          },
          "goldenRule": "Không có việc nhẹ lương cao vượt biên nào mà không phải trả giá bằng mạng sống!"
        },
        "practice": [
          {
            "id": "l33-p1",
            "type": "multiple_choice",
            "prompt": "Thấy quảng cáo tuyển dụng làm nhân viên văn phòng tại Bavet - Campuchia lương 35 triệu/tháng, bao chi phí đi lại, bạn phản ứng thế nào?",
            "options": [
              {
                "id": "a",
                "text": "Từ chối ngay và báo cáo bài viết. Công ty hợp pháp phải có giấy phép xuất khẩu lao động của Bộ LĐTB&XH.",
                "isCorrect": true,
                "explanation": "Chính xác! Chỉ xuất khẩu lao động qua các doanh nghiệp có cấp phép chính thức."
              },
              {
                "id": "b",
                "text": "Đăng ký đi thử vì không mất tiền phí ban đầu.",
                "isCorrect": false,
                "explanation": "Khi đã qua biên giới, bạn sẽ bị tước tự do và ép buộc lừa đảo!"
              }
            ]
          },
          {
            "id": "lesson-33-p2",
            "type": "matching",
            "prompt": "[Thực chiến #2] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-33-p3",
            "type": "true_false",
            "prompt": "[Thực chiến #3] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-33-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Bẫy Lừa Đảo Việc Nhẹ Lương Cao Campuchia & Tam Giác Vàng\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-33-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-33-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-33-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Bẫy Lừa Đảo Việc Nhẹ Lương Cao Campuchia & Tam Giác Vàng\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-33-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-33-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-33-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Bẫy Lừa Đảo Việc Nhẹ Lương Cao Campuchia & Tam Giác Vàng\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Bẫy Việc Nhẹ Lương Cao Bavet",
          "scenarioContext": "Một tài khoản Zalo xưng là người quen giới thiệu bạn công việc nhập liệu máy tính tại Campuchia.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Cò Lao Động Biên Giới",
              "text": "Chiều nay có xe đón em ở Tây Ninh sang casino gõ máy tính, tháng đầu cầm chắc 30 triệu!"
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Cảnh báo! Đây là cạm bẫy buôn người khét tiếng! Bạn chọn dừng lại hay leo lên xe?",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Kiên quyết từ chối, chặn liên lạc và cảnh báo bạn bè.",
                  "isSafe": true,
                  "feedback": "Xử lý chuẩn xác! Bạn đã cứu chính mình khỏi bi kịch buôn người.",
                  "consequence": "Thoát khỏi cạm bẫy nguy hiểm."
                },
                {
                  "id": "c2",
                  "text": "Lên xe đi Tây Ninh để thử vận may.",
                  "isSafe": false,
                  "feedback": "Bạn đã bị thu điện thoại và đưa vào khu tự quản khép kín!",
                  "consequence": "Rơi vào hang ổ cưỡng bức lừa đảo."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-34",
        "unitId": "unit-3",
        "number": 34,
        "title": "Phòng Thủ Tài Khoản Ngân Hàng Rác & Mua Bán STK (Mule Accounts)",
        "shortDesc": "Cảnh báo nguy cơ đồng phạm hình sự khi cho thuê, cho mượn hoặc bán tài khoản ngân hàng.",
        "targetGoal": "Hiểu rõ trách nhiệm pháp lý cá nhân và từ chối mọi lời mời chào mua bán tài khoản.",
        "xpReward": 100,
        "shieldBadgeName": "Huy Hiệu Tài Khoản Sạch",
        "shieldBadgeIcon": "💳",
        "theory": {
          "title": "Tránh Xa Bẫy Cho Thuê Tài Khoản Ngân Hàng Rác",
          "summary": "Kẻ lừa đảo đăng tin mua/thành lập tài khoản ngân hàng với giá 500k - 2 triệu/tài khoản. Các tài khoản này (Mule Accounts) được chúng sử dụng để nhận tiền lừa đảo, rửa tiền bẩn. Người đứng tên mở tài khoản sẽ bị truy cứu trách nhiệm hình sự với vai trò đồng phạm!",
          "keyPoints": [
            "⚖️ Bán/cho mượn tài khoản ngân hàng là VI PHẠM PHÁP LUẬT nghiêm trọng.",
            "⛓️ Khi tiền lừa đảo chảy qua tài khoản của bạn, bạn sẽ bị cơ quan công an phong tỏa và triệu tập điều tra.",
            "🚫 Tuyệt đối KHÔNG đăng ký mở tài khoản ngân hàng giùm người lạ dưới bất kỳ hình thức nào."
          ],
          "visualMockup": {
            "type": "chat",
            "sender": "Hội Mua Bán Tài Khoản Bank (Telegram)",
            "content": "Cần thuê 10 STK ngân hàng MB/Vietinbank chính chủ giá 1.5tr/tháng. Chỉ dùng nhận tiền doanh nghiệp không làm gì bẩn!",
            "highlightedRedFlags": [
              "Thuê STK chính chủ giá cao",
              "Lấy lý do nhận tiền doanh nghiệp"
            ],
            "note": "Tất cả các hành vi mua bán/cho thuê tài khoản ngân hàng đều để phục vụ rửa tiền lừa đảo!"
          },
          "goldenRule": "Tài khoản ngân hàng là định danh cá nhân - Cho mượn là tiếp tay cho tội phạm!"
        },
        "practice": [
          {
            "id": "l34-p1",
            "type": "multiple_choice",
            "prompt": "Một người bạn trên mạng đề nghị trả 1 triệu đồng để bạn mở 2 tài khoản ngân hàng rồi đưa mã PIN và ứng dụng cho họ dùng, bạn làm gì?",
            "options": [
              {
                "id": "a",
                "text": "Từ chối ngay lập tức vì đây là hành vi tiếp tay cho rửa tiền và vi phạm pháp luật.",
                "isCorrect": true,
                "explanation": "Chính xác! Mọi dòng tiền lừa đảo chuyển qua sẽ đổ trách nhiệm lên đầu bạn."
              },
              {
                "id": "b",
                "text": "Mở giùm để kiếm 1 triệu tiêu vặt vì nghĩ mình không trực tiếp đi lừa ai.",
                "isCorrect": false,
                "explanation": "Bạn sẽ bị truy cứu trách nhiệm hình sự tội đồng phạm giúp sức lừa đảo!"
              }
            ]
          },
          {
            "id": "lesson-34-p2",
            "type": "matching",
            "prompt": "[Thực chiến #2] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-34-p3",
            "type": "true_false",
            "prompt": "[Thực chiến #3] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-34-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Phòng Thủ Tài Khoản Ngân Hàng Rác & Mua Bán STK (Mule Accounts)\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-34-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-34-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-34-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Phòng Thủ Tài Khoản Ngân Hàng Rác & Mua Bán STK (Mule Accounts)\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-34-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-34-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-34-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Phòng Thủ Tài Khoản Ngân Hàng Rác & Mua Bán STK (Mule Accounts)\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Bẫy Mua Bán STK Ngân Hàng",
          "scenarioContext": "Bạn thấy bài đăng tuyển người mở thẻ ngân hàng nhận 800.000đ/thẻ.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Môi Giới Gom Tài Khoản",
              "text": "Em chỉ cần ra ngân hàng đăng ký thẻ, giao SIM và app cho anh. Tháng nào cũng có 2 triệu thụ động!"
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Cảnh báo! Tài khoản này sẽ bị biến thành \"Tài khoản rác\" luân chuyển tiền lừa đảo! Bạn quyết định ra sao?",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Báo cáo tài khoản môi giới và kiên quyết không bán tài khoản.",
                  "isSafe": true,
                  "feedback": "Rất bản lĩnh! Bạn đã giữ cho hồ sơ lý lịch của mình luôn trong sạch.",
                  "consequence": "Tránh nguy cơ bị xử lý hình sự."
                },
                {
                  "id": "c2",
                  "text": "Bán 2 tài khoản để lấy 1.6 triệu.",
                  "isSafe": false,
                  "feedback": "3 tháng sau công an phong tỏa toàn bộ tài khoản và gửi giấy triệu tập!",
                  "consequence": "Gánh hậu quả pháp lý nghiêm trọng."
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "unit-4",
    "unitNumber": 4,
    "title": "Lừa đảo tài chính và đầu tư",
    "objective": "Bảo vệ tiền bạc khi mua sắm trực tuyến & cảnh giác bẫy đầu tư tài chính ảo lãi suất khủng",
    "themeColor": {
      "bg": "bg-amber-950/70",
      "border": "border-amber-500/50",
      "glow": "shadow-amber-500/20",
      "text": "text-amber-400",
      "gradient": "from-amber-600 to-orange-700",
      "button": "bg-amber-500 hover:bg-amber-400 border-b-4 border-amber-700 text-slate-950"
    },
    "lessons": [
      {
        "id": "lesson-9",
        "unitId": "unit-4",
        "number": 9,
        "title": "Lừa đảo khi mua hàng online",
        "shortDesc": "Chiêu trò giá rẻ bất thường trên mạng xã hội, lừa cọc tiền rồi chặn.",
        "targetGoal": "Luôn giao dịch qua sàn TMĐT có bảo vệ người mua, kiểm tra uy tín shop và không chuyển khoản ngoài.",
        "xpReward": 80,
        "shieldBadgeName": "Khiên Mua Sắm Thông Thái",
        "shieldBadgeIcon": "🛒",
        "theory": {
          "title": "Cạm Bẫy Mua Hàng Giá Rẻ Trên Mạng",
          "summary": "Kẻ gian tạo các fanpage bán hàng thời trang, điện thoại iPhone, xe máy thanh lý với giá chỉ bằng 30-50% thị trường, yêu cầu chuyển cọc trước rồi chặn số.",
          "keyPoints": [
            "🏷️ Bẫy giá rẻ bất thường: iPhone 15 Pro Max giá 5 triệu đồng, xe máy SH giá 10 triệu \"hàng trốn thuế hải quan\".",
            "⛔ Dụ dỗ giao dịch ngoài sàn: Yêu cầu kết bạn Zalo để \"bớt phí sàn\", \"giảm thêm 10%\", thực chất là để bạn không được sàn thương mại điện tử bảo vệ.",
            "🛡️ Chỉ mua qua sàn có chính sách Đồng kiểm & Trả hàng/Hoàn tiền: Không chuyển tiền cọc cho các shop không có địa chỉ thực tế và đánh giá minh bạch."
          ],
          "visualMockup": {
            "type": "browser",
            "sender": "Tổng Kho Hàng Hiệu Giá Sốc (Fanpage)",
            "content": "Xả kho duy nhất hôm nay: Giày Nike chính hãng 199k (Giá gốc 3tr5). Khách chuyển khoản trước 100k tiền cọc giữ hàng. Số lượng có hạn!",
            "highlightedRedFlags": [
              "Giá rẻ vô lý 199k",
              "Ép cọc trước qua STK cá nhân",
              "Trang fanpage mới tạo vài ngày"
            ],
            "note": "Không có thương hiệu chính hãng nào xả hàng giảm giá 95% vô lý như vậy!"
          },
          "goldenRule": "\"Giá rẻ bất thường + Đòi cọc trước = 100% lừa đảo nhận cọc xong chặn!\""
        },
        "practice": [
          {
            "id": "l9-p1",
            "type": "multiple_choice",
            "prompt": "Khi mua hàng online trên mạng xã hội, cách thanh toán nào AN TOÀN NHẤT cho bạn?",
            "options": [
              {
                "id": "a",
                "text": "Chuyển khoản 100% trước để được shop tặng thêm quà.",
                "isCorrect": false,
                "explanation": "Sai! Nguy cơ rất cao shop sẽ biến mất sau khi nhận tiền."
              },
              {
                "id": "b",
                "text": "Đặt hàng qua sàn thương mại điện tử uy tín, thanh toán khi nhận hàng (COD) và được đồng kiểm tra hàng trước khi trả tiền.",
                "isCorrect": true,
                "explanation": "Chính xác! Sàn TMĐT sẽ giữ tiền của người bán cho đến khi bạn xác nhận nhận đúng hàng."
              },
              {
                "id": "c",
                "text": "Chuyển cọc 50% rồi gửi ảnh biên lai qua Zalo cá nhân của chủ shop.",
                "isCorrect": false,
                "explanation": "Sai! Bạn vẫn có thể mất khoản cọc 50% đó."
              }
            ]
          },
          {
            "id": "l9-p2",
            "type": "true_false",
            "prompt": "Người bán hàng trên Shopee nhắn tin bảo bạn hủy đơn trên app rồi chuyển khoản trực tiếp qua ngân hàng để họ gửi hàng nhanh hơn, bạn nên đồng ý ngay.",
            "trueFalseAnswer": {
              "isTrue": false,
              "explanation": "Sai! Khi hủy đơn trên sàn, bạn mất hoàn toàn quyền khiếu nại và bảo hiểm hoàn tiền nếu nhận phải gạch đá hoặc hàng giả."
            }
          },
          {
            "id": "l9-p3",
            "type": "matching",
            "prompt": "Ghép dấu hiệu shop uy tín và shop lừa đảo:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Shop Mall chính hãng trên sàn"
                },
                "right": {
                  "id": "r1",
                  "text": "Có tích xanh xác thực doanh nghiệp, cho phép đổi trả 15 ngày",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Fanpage mới lập, ẩn bình luận"
                },
                "right": {
                  "id": "r2",
                  "text": "Dấu hiệu lừa đảo để người khác không vào bóc phốt",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Bắt chuyển khoản qua tài khoản cá nhân"
                },
                "right": {
                  "id": "r3",
                  "text": "Rủi ro cao mất cọc không thể truy vết",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-9-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Lừa đảo khi mua hàng online\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-9-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-9-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-9-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Lừa đảo khi mua hàng online\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-9-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-9-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-9-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Lừa đảo khi mua hàng online\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Chiếc Máy Ảnh Giá Sốc 2 Triệu",
          "scenarioContext": "Bạn thấy bài đăng thanh lý máy ảnh Sony A7 giá 2 triệu (thị trường 25 triệu) vì chủ shop \"đi định cư gấp\".",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Chủ Shop Thanh Lý Gấp",
              "text": "Máy ảnh còn nguyên tem hộp. Đang có 5 người hỏi mua, bạn chuyển cọc 500k giữ máy thì mình ship grab qua tận nhà cho xem nhé."
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Bẫy giá rẻ đánh vào tâm lý sợ bỏ lỡ món hời (FOMO)! Sau khi bạn chuyển 500k, nick Facebook đó sẽ bị xóa ngay.",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Chuyển cọc 500k ngay kẻo người khác mua mất món hời.",
                  "isSafe": false,
                  "feedback": "Vừa chuyển tiền xong, bạn bị chặn tin nhắn ngay lập tức!",
                  "consequence": "Mất 500k tiền cọc."
                },
                {
                  "id": "c2",
                  "text": "Yêu cầu: \"Giao hàng qua bưu điện cho phép kiểm tra mở máy lên nguồn rồi tôi thanh toán toàn bộ\", không cọc.",
                  "isSafe": true,
                  "feedback": "Xuất sắc! Kẻ lừa đảo từ chối ngay vì chúng không hề có máy ảnh thật.",
                  "consequence": "Bảo toàn số tiền nguyên vẹn."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-10",
        "unitId": "unit-4",
        "number": 10,
        "title": "Lừa đảo đầu tư tài chính ảo",
        "shortDesc": "Sàn Forex/Crypto ảo, nhóm \"Chuyên gia đọc lệnh\", cam kết lãi 30%/tháng.",
        "targetGoal": "Vạch trần mô hình Ponzi tài chính, sàn cá cược thao túng biểu đồ nến và bẫy \"nạp dễ rút khó\".",
        "xpReward": 80,
        "shieldBadgeName": "Khiên Phòng Thủ Ponzi",
        "shieldBadgeIcon": "📈",
        "theory": {
          "title": "Bóc Trần Sàn Giao Dịch Ảo & Chuyên Gia Đọc Lệnh",
          "summary": "Kẻ gian mời bạn vào các nhóm Telegram/Zalo \"Kéo vốn về bờ\", cam kết lợi nhuận 1-3%/ngày (30-90%/tháng), cho rút tiền lãi nhỏ ban đầu để tạo lòng tin, khi nạp số tiền lớn sẽ khóa tài khoản đòi nộp thêm \"thuế rút tiền\".",
          "keyPoints": [
            "📉 Biểu đồ nến do admin tự vẽ: Các sàn giao dịch không có giấy phép tại VN hoàn toàn do admin đứng sau chỉnh thắng/thua theo ý muốn.",
            "🎭 Đội ngũ chim mồi (Seeding): Trong nhóm 100 người thì 99 người là tài khoản ảo của kẻ lừa đảo tung hô \"Cảm ơn thầy, vừa rút được 200 triệu lãi\".",
            "🔒 Bẫy nạp dễ - rút không được: Khi bạn muốn rút 100 triệu, sàn sẽ viện cớ \"Lỗi lệnh\", \"Rửa tiền\", bắt nạp thêm 30% để xác minh rồi khóa tài khoản."
          ],
          "visualMockup": {
            "type": "chat",
            "sender": "Nhóm: VỀ BỜ CÙNG CHUYÊN GIA (Telegram)",
            "content": "🔥 Lệnh VIP hôm nay: Lãi +150% sau 30 phút. Vốn 10 triệu thu về 25 triệu cam kết bảo hiểm vốn 100%. Anh em nhắn riêng cho Thầy để vào gói!",
            "highlightedRedFlags": [
              "Lãi 150% sau 30 phút",
              "Bảo hiểm vốn 100%",
              "Nhóm kéo trên Telegram"
            ],
            "note": "Không có kênh đầu tư hợp pháp nào trên thế giới cam kết lãi suất 150% bảo hiểm vốn!"
          },
          "goldenRule": "\"Cam kết lãi suất khủng + Bảo hiểm vốn 100% = 100% SÀN LỪA ĐẢO PONZI!\""
        },
        "practice": [
          {
            "id": "l10-p1",
            "type": "multiple_choice",
            "prompt": "Tại sao trong các nhóm đầu tư lừa đảo, ban đầu người tham gia nạp 1-2 triệu đồng đều rút được tiền lãi rất nhanh?",
            "options": [
              {
                "id": "a",
                "text": "Vì sàn giao dịch đó thực sự uy tín và có chuyên gia giỏi.",
                "isCorrect": false,
                "explanation": "Sai! Đây là mồi nhử tinh vi."
              },
              {
                "id": "b",
                "text": "Đó là \"thả con săn sắt bắt con cá rô\" - Trả tiền lãi nhỏ để kích thích lòng tham khiến nạn nhân dốc hết tiền tiết kiệm nạp hàng trăm triệu.",
                "isCorrect": true,
                "explanation": "Chính xác! Khi nạn nhân nạp số tiền lớn, sàn sẽ lập tức đóng băng rút tiền."
              },
              {
                "id": "c",
                "text": "Do hệ thống máy tính tự động xử lý.",
                "isCorrect": false,
                "explanation": "Sai!"
              }
            ]
          },
          {
            "id": "l10-p2",
            "type": "true_false",
            "prompt": "Tại Việt Nam, các sàn giao dịch ngoại hối (Forex) và tiền mã hóa cá nhân chưa được Ngân hàng Nhà nước cấp phép hoạt động, người tham gia hoàn toàn không được pháp luật bảo vệ khi bị lừa đảo.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Đúng! Pháp luật VN chưa cấp phép cho bất kỳ sàn Forex hay sàn tiền số nào hoạt động môi giới đầu tư cho cá nhân trong nước."
            }
          },
          {
            "id": "l10-p3",
            "type": "matching",
            "prompt": "Ghép lời hứa của kẻ lừa đảo với thực tế:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "\"Cam kết lợi nhuận 30%/tháng không rủi ro\""
                },
                "right": {
                  "id": "r1",
                  "text": "Bẫy lừa đảo Ponzi lấy tiền người sau trả người trước",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "\"Đóng thêm 20% phí để mở khóa tài khoản rút tiền\""
                },
                "right": {
                  "id": "r2",
                  "text": "Chiêu vắt kiệt tiền lần cuối trước khi sập web",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "\"Hội nhóm Telegram khoe ảnh siêu xe, tiền mặt\""
                },
                "right": {
                  "id": "r3",
                  "text": "Hình ảnh sống ảo thuê mướn để tạo vỏ bọc chuyên gia",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-10-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Lừa đảo đầu tư tài chính ảo\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-10-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-10-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-10-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Lừa đảo đầu tư tài chính ảo\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-10-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-10-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-10-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Lừa đảo đầu tư tài chính ảo\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Gói Đầu Tư Lợi Nhuận Khủng 50 Triệu",
          "scenarioContext": "Bạn được một \"chuyên gia tài chính\" mời vào gói ủy thác đầu tư AI với cam kết 1 tuần nhân đôi tài khoản.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Chuyên Gia Eric Nguyen",
              "text": "Chúc mừng anh! Tài khoản 20 triệu của anh trên sàn đã tăng lên 120 triệu rồi. Anh chỉ cần nộp 24 triệu tiền phí thuế VAT 20% là hệ thống mở cổng rút ngay."
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Bẫy điển hình: Con số 120 triệu chỉ là số ảo hiển thị trên màn hình. Nếu nộp thêm 24 triệu, bạn sẽ mất luôn 24 triệu đó!",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Đi vay mượn thêm 24 triệu để nộp phí mở khóa rút 120 triệu về.",
                  "isSafe": false,
                  "feedback": "Mất thêm 24 triệu! Sàn sẽ tiếp tục viện cớ lỗi hệ thống đòi nộp thêm.",
                  "consequence": "Gia tăng số tiền thiệt hại nặng nề."
                },
                {
                  "id": "c2",
                  "text": "Dừng lại ngay lập tức, không nạp thêm bất kỳ đồng nào và lưu lại bằng chứng để tố giác cơ quan chức năng.",
                  "isSafe": true,
                  "feedback": "Quyết định đúng đắn! Cắt lỗ kịp thời là nguyên tắc sống còn khi gặp sàn lừa đảo.",
                  "consequence": "Không bị bòn rút thêm tài sản."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-21",
        "unitId": "unit-4",
        "number": 21,
        "title": "Bẫy App Vay Tiền Online Tín Dụng Đen Lãi Cắt Cổ",
        "shortDesc": "Vạch trần app vay tiền nhanh không thế chấp và thủ đoạn truy cập danh bạ tống tiền.",
        "targetGoal": "Hiểu rõ cạm bẫy lãi suất 1000%/năm và cách các app vay lừa đảo cướp dữ liệu hình ảnh, danh bạ người thân.",
        "xpReward": 80,
        "shieldBadgeName": "Khiên Trừ Tà Tín Dụng Đen",
        "shieldBadgeIcon": "💸",
        "theory": {
          "title": "Ma Trận App Vay Tiền \"Giải Ngân 5 Phút\"",
          "summary": "Quảng cáo vay tiền nhanh thủ tục đơn giản chỉ cần CMND/CCCD. Khi cài app, chúng bắt cấp quyền truy cập Danh bạ, Hình ảnh và Vị trí, sau đó chỉ giải ngân 50% số tiền nhưng bắt trả gấp 3 lần sau 7 ngày.",
          "keyPoints": [
            "📱 Chiếm đoạt danh bạ & Tống tiền khủng bố: Kẻ đòi nợ sẽ gọi điện khủng bố, ghép ảnh đồi trụy gửi cho sếp, đồng nghiệp và toàn bộ bạn bè trong danh bạ của bạn.",
            "📈 Lãi suất cắt cổ và phí phạt ma: Vay 5 triệu chỉ nhận được 2.5 triệu (trừ phí dịch vụ), sau 1 tuần tiền phạt lên đến 15 triệu đồng.",
            "🛑 Vay vốn an toàn: Chỉ vay tại các Ngân hàng hoặc Công ty Tài chính được Ngân hàng Nhà nước cấp phép hoạt động."
          ],
          "visualMockup": {
            "type": "warning",
            "sender": "Cảnh Báo Tín Dụng Đen PA02",
            "content": "Cài app vay đen đồng nghĩa với việc giao nộp toàn bộ ảnh riêng tư và số điện thoại người thân cho xã hội đen mạng!",
            "highlightedRedFlags": [
              "Vay không cần chứng minh thu nhập",
              "Bắt cấp quyền danh bạ"
            ],
            "note": "Ngân hàng chính thống không bao giờ đòi quyền đọc toàn bộ danh bạ cá nhân."
          },
          "goldenRule": "Không bao giờ cài các app vay tiền trôi nổi trên Facebook / TikTok!"
        },
        "practice": [
          {
            "id": "l21-p1",
            "type": "multiple_choice",
            "prompt": "Dấu hiệu rõ nhất của một ứng dụng vay tiền tín dụng đen lừa đảo là gì?",
            "options": [
              {
                "id": "a",
                "text": "Bắt buộc cấp quyền truy cập toàn bộ Danh bạ điện thoại và Thư viện ảnh để xét duyệt hồ sơ.",
                "isCorrect": true,
                "explanation": "Chính xác! Chúng lấy danh bạ để phục vụ mục đích gọi điện khủng bố đòi nợ sau này."
              },
              {
                "id": "b",
                "text": "Yêu cầu có hợp đồng lao động và sao kê bảng lương 3 tháng gần nhất.",
                "isCorrect": false,
                "explanation": "Đây là quy trình thẩm định tín dụng hợp pháp của các ngân hàng chính thống."
              }
            ]
          },
          {
            "id": "lesson-21-p2",
            "type": "matching",
            "prompt": "[Thực chiến #2] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-21-p3",
            "type": "true_false",
            "prompt": "[Thực chiến #3] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-21-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Bẫy App Vay Tiền Online Tín Dụng Đen Lãi Cắt Cổ\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-21-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-21-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-21-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Bẫy App Vay Tiền Online Tín Dụng Đen Lãi Cắt Cổ\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-21-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-21-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-21-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Bẫy App Vay Tiền Online Tín Dụng Đen Lãi Cắt Cổ\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Khoản Vay 10 Triệu \"Miễn Lãi\"",
          "scenarioContext": "Bạn thấy quảng cáo app \"Vay Cấp Tốc 247\" cam kết miễn lãi suất tháng đầu.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "App Vay Cấp Tốc",
              "text": "Vui lòng nhấn Cho phép ứng dụng truy cập Danh bạ và Album ảnh để hệ thống giải ngân 10 triệu trong 2 phút!"
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Cảnh báo đỏ! Đây là chiêu trò đánh cắp dữ liệu riêng tư của tín dụng đen!",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Từ chối cấp quyền và gỡ bỏ ứng dụng ngay lập tức.",
                  "isSafe": true,
                  "feedback": "Cực kỳ sáng suốt! Bạn đã tránh được cơn ác mộng bị khủng bố danh bạ.",
                  "consequence": "Bảo vệ an toàn danh dự và gia đình."
                },
                {
                  "id": "c2",
                  "text": "Cho phép cấp quyền để lấy tiền tiêu tạm.",
                  "isSafe": false,
                  "feedback": "Chỉ 5 ngày sau, toàn bộ bạn bè người thân của bạn bị gọi điện đe dọa!",
                  "consequence": "Rơi vào vòng xoáy nợ nần không lối thoát."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-22",
        "unitId": "unit-4",
        "number": 22,
        "title": "Đa cấp tiền số & Nhóm Telegram \"Thầy Đọc Lệnh\"",
        "shortDesc": "Bóc trần chiêu bài khoe xe sang, nhà đẹp và nhóm VIP cam kết lãi 50%/tháng.",
        "targetGoal": "Hiểu rõ mô hình Ponzi lấy tiền người sau trả cho người trước và chiêu trò can thiệp nến giá của sàn giao dịch ma.",
        "xpReward": 85,
        "shieldBadgeName": "Gương Thần Soi Đa Cấp Ảo",
        "shieldBadgeIcon": "📉",
        "theory": {
          "title": "Kịch Bản \"Chuyên Gia Tài Chính 4.0\"",
          "summary": "Các đối tượng xây dựng hình ảnh đại gia thành đạt trên Facebook, khoe xe Mercedes thuê, chụp ảnh cọc tiền và mời vào nhóm VIP Telegram để \"đánh lệnh theo chuyên gia, cam kết bao lỗ 100%\".",
          "keyPoints": [
            "📊 Sàn giao dịch ma tự lập trình: Biểu đồ nến giá xanh đỏ hoàn toàn do admin điều khiển. Khi bạn nạp ít thì cho thắng, khi nạp tiền lớn hàng trăm triệu thì đánh sập sàn hoặc báo \"lệnh bị đóng băng\".",
            "🔒 Bẫy nộp thêm tiền để rút: Muốn rút tiền gốc, chúng bắt đóng 20% phí xác minh rửa tiền, 15% phí hải quan... cho đến khi bạn kiệt quệ tài chính.",
            "🛑 Luật kinh tế: Lợi nhuận cao luôn đi kèm rủi ro cao. Bất kỳ ai cam kết \"lãi khủng không rủi ro\" 100% là kẻ lừa đảo!"
          ],
          "visualMockup": {
            "type": "chat",
            "sender": "Chuyên Gia Đầu Tư Hoàng Gia (Telegram)",
            "content": "Anh em hôm nay theo lệnh Thầy lại húp trọn 200 triệu! Còn 3 suất cuối vào nhóm VIP cam kết hoàn vốn 100% nếu thua lỗ!",
            "highlightedRedFlags": [
              "Cam kết bao lỗ 100%",
              "Khoe tiền lợi nhuận bất thường",
              "Mời gọi vào nhóm kín"
            ],
            "note": "Tại Việt Nam, các sàn giao dịch quyền chọn nhị phân (BO) và tiền số không được pháp luật công nhận."
          },
          "goldenRule": "Không có chuyên gia nào giàu có mà lại đi nài nỉ người lạ nạp tiền đầu tư!"
        },
        "practice": [
          {
            "id": "l22-p1",
            "type": "true_false",
            "prompt": "Nếu một sàn đầu tư cam kết chắc chắn sinh lời 30%/tháng và bảo hiểm vốn 100%, đây là cơ hội làm giàu an toàn.",
            "trueFalseAnswer": {
              "isTrue": false,
              "explanation": "Sai 100%! Lãi suất ngân hàng chỉ khoảng 5-7%/năm. Mức lãi 30%/tháng chắc chắn là mô hình lừa đảo đa cấp Ponzi."
            }
          },
          {
            "id": "lesson-22-p2",
            "type": "matching",
            "prompt": "[Thực chiến #2] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-22-p3",
            "type": "true_false",
            "prompt": "[Thực chiến #3] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-22-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Đa cấp tiền số & Nhóm Telegram \"Thầy Đọc Lệnh\"\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-22-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-22-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-22-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Đa cấp tiền số & Nhóm Telegram \"Thầy Đọc Lệnh\"\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-22-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-22-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-22-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Đa cấp tiền số & Nhóm Telegram \"Thầy Đọc Lệnh\"\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Bẫy Rút Tiền Trên Sàn Ma",
          "scenarioContext": "Bạn thấy tài khoản trên sàn ảo tăng lên 500 triệu nhưng khi bấm rút thì hệ thống báo lỗi.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Hỗ Trợ Kỹ Thuật Sàn",
              "text": "Tài khoản của bạn bị nghi ngờ gian lận. Bạn cần nạp thêm 100 triệu tiền ký quỹ trong 24h để giải phóng 500 triệu!"
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Đây là cái bẫy \"Nạp tiền cứu tiền\"! Nếu bạn nạp thêm 100 triệu, bạn sẽ mất luôn cả 100 triệu đó.",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Dừng lại ngay lập tức, không nạp thêm bất kỳ đồng nào và lưu lại bằng chứng để tố giác công an.",
                  "isSafe": true,
                  "feedback": "Hành động dũng cảm! Bạn đã cắt lỗ kịp thời và không bị lừa thêm.",
                  "consequence": "Bảo toàn số tiền còn lại."
                },
                {
                  "id": "c2",
                  "text": "Đi vay mượn người thân 100 triệu để nạp vào mong rút được 500 triệu.",
                  "isSafe": false,
                  "feedback": "Sau khi nạp 100 triệu, sàn lập tức xóa tài khoản và khóa nhóm Telegram!",
                  "consequence": "Gánh thêm khoản nợ khổng lồ."
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "unit-5",
    "unitNumber": 5,
    "title": "Nâng cao - Các chiêu trò tinh vi",
    "objective": "Xử lý hỗ trợ kỹ thuật giả mạo (Tech Support Scam) và giả danh nhân viên điện lực, viễn thông",
    "themeColor": {
      "bg": "bg-rose-950/70",
      "border": "border-rose-500/50",
      "glow": "shadow-rose-500/20",
      "text": "text-rose-400",
      "gradient": "from-rose-600 to-red-700",
      "button": "bg-rose-500 hover:bg-rose-400 border-b-4 border-rose-700 text-slate-950"
    },
    "lessons": [
      {
        "id": "lesson-11",
        "unitId": "unit-5",
        "number": 11,
        "title": "Giả mạo và lừa đảo hỗ trợ kỹ thuật (Tech Support Scams)",
        "shortDesc": "Cảnh báo virus pop-up toàn màn hình, yêu cầu gọi hotline Microsoft giả.",
        "targetGoal": "Tự tin xử lý cửa sổ pop-up trình duyệt bị treo mà không cần gọi đến các số hotline ma lừa đảo.",
        "xpReward": 90,
        "shieldBadgeName": "Khiên Miễn Nhiễm Cảnh Báo Ảo",
        "shieldBadgeIcon": "💻",
        "theory": {
          "title": "Giải Mã Chiêu Trò Cảnh Báo Virus Giả",
          "summary": "Khi lướt web xem phim hoặc tải tài liệu, màn hình bất ngờ bị khóa toàn màn hình với tiếng còi hú inh ỏi: \"Máy tính bạn đã nhiễm 5 con virus nguy hiểm! Gọi ngay hotline Microsoft: 1800-xxxx để được cứu dữ liệu\".",
          "keyPoints": [
            "📢 Tiếng còi hú và khóa màn hình chỉ là mã Javascript đơn giản: Kẻ gian dùng lệnh phóng to Fullscreen và lặp âm thanh để dọa bạn sợ hãi.",
            "⛔ Không gọi số điện thoại trên pop-up: Kẻ nghe máy sẽ dụ bạn cài phần mềm điều khiển máy tính UltraViewer/AnyDesk rồi âm thầm đánh cắp tài khoản.",
            "⌨️ Cách thoát hiểm đơn giản: Nhấn phím `Esc` để thoát toàn màn hình, hoặc tổ hợp phím `Ctrl + W` (đóng tab) hoặc `Alt + F4` (đóng trình duyệt)."
          ],
          "visualMockup": {
            "type": "browser",
            "sender": "CẢNH BÁO BẢO MẬT WINDOWS DEFENDER",
            "content": "⚠️ VIRUS TROJAN ĐANG XÂM NHẬP MÁY BẠN! Dữ liệu ngân hàng sắp bị xóa. Gọi ngay Hotline Kỹ Thuật Viên: 0988.xxx.xxx để quét virus khẩn cấp!",
            "highlightedRedFlags": [
              "Khóa màn hình",
              "Số điện thoại di động cá nhân",
              "Yêu cầu gọi hỗ trợ gấp"
            ],
            "note": "Microsoft và Apple không bao giờ để số điện thoại cá nhân trên màn hình bắt người dùng gọi tới!"
          },
          "goldenRule": "\"Cảnh báo virus hú còi trên trình duyệt = Bấm Alt + F4 đóng trang, TUYỆT ĐỐI KHÔNG GỌI SỐ HOTLINE TRÊN ĐÓ!\""
        },
        "practice": [
          {
            "id": "l11-p1",
            "type": "multiple_choice",
            "prompt": "Khi đang lướt web mà màn hình hiện cảnh báo đỏ lòm dọa máy bị nhiễm virus và yêu cầu gọi số điện thoại hỗ trợ, bạn làm gì?",
            "options": [
              {
                "id": "a",
                "text": "Gọi ngay số điện thoại trên màn hình để kỹ thuật viên sửa máy.",
                "isCorrect": false,
                "explanation": "Sai! Bạn sẽ gặp kẻ lừa đảo đòi tiền sửa máy hoặc cài mã độc."
              },
              {
                "id": "b",
                "text": "Nhấn phím Esc hoặc Alt+F4 để tắt trình duyệt, không gọi bất kỳ số điện thoại nào trên trang đó.",
                "isCorrect": true,
                "explanation": "Chính xác! Đây chỉ là trang web lừa đảo hù dọa bằng giao diện HTML thông thường."
              },
              {
                "id": "c",
                "text": "Tải phần mềm họ đề xuất để tự quét virus.",
                "isCorrect": false,
                "explanation": "Sai! Phần mềm đó chính là virus thực sự."
              }
            ]
          },
          {
            "id": "l11-p2",
            "type": "true_false",
            "prompt": "Microsoft và Apple có tổng đài viên tự động quét máy tính của bạn qua mạng rồi gọi điện thông báo máy bạn bị hỏng phần mềm.",
            "trueFalseAnswer": {
              "isTrue": false,
              "explanation": "Sai! Không có công ty công nghệ lớn nào tự động gọi điện cho người dùng cá nhân để báo máy tính bị virus."
            }
          },
          {
            "id": "l11-p3",
            "type": "matching",
            "prompt": "Ghép thao tác máy tính với công dụng xử lý khẩn cấp:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Nhấn giữ phím Esc"
                },
                "right": {
                  "id": "r1",
                  "text": "Thoát chế độ toàn màn hình bị web lừa đảo chiếm dụng",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Tổ hợp phím Alt + F4 / Ctrl + W"
                },
                "right": {
                  "id": "r2",
                  "text": "Đóng ngay lập tức tab hoặc trình duyệt độc hại",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mở Task Manager (Ctrl+Shift+Esc)"
                },
                "right": {
                  "id": "r3",
                  "text": "Ép tắt chương trình duyệt web đang bị đơ",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-11-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Giả mạo và lừa đảo hỗ trợ kỹ thuật (Tech Support Scams)\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-11-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-11-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-11-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Giả mạo và lừa đảo hỗ trợ kỹ thuật (Tech Support Scams)\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-11-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-11-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-11-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Giả mạo và lừa đảo hỗ trợ kỹ thuật (Tech Support Scams)\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Cửa Sổ Hú Còi Báo Động Đỏ",
          "scenarioContext": "Màn hình máy tính của bạn bỗng nhấp nháy đỏ liên tục kèm giọng nói robot đe dọa ổ cứng sắp bị xóa.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Cảnh Báo Virus Màn Hình",
              "text": "MÁY TÍNH BỊ KHÓA! Hãy gọi cho Chuyên Viên Microsoft Việt Nam theo số 0977.xxx để nhận mã mở khóa trong 5 phút."
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Đừng hoảng sợ! Đây chỉ là trang web hù dọa lừa cài UltraViewer. Bạn sẽ làm gì?",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Bốc máy gọi ngay hotline trên màn hình để nhờ người ta cứu dữ liệu.",
                  "isSafe": false,
                  "feedback": "Bị kẻ gian chiếm quyền điều khiển máy tính, mở app ngân hàng rút hết tiền!",
                  "consequence": "Lộ toàn bộ dữ liệu cá nhân trong máy."
                },
                {
                  "id": "c2",
                  "text": "Bình tĩnh nhấn tổ hợp phím Ctrl + W hoặc tắt trình duyệt, sau đó khởi động lại máy.",
                  "isSafe": true,
                  "feedback": "Rất dũng cảm và chính xác! Trình duyệt tắt đi là mọi còi hú biến mất hoàn toàn.",
                  "consequence": "Máy tính an toàn tuyệt đối không hề có virus."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-12",
        "unitId": "unit-5",
        "number": 12,
        "title": "Lừa đảo giả mạo nhân viên dịch vụ (Điện, nước, internet)",
        "shortDesc": "Thông báo nợ tiền điện dọa cắt điện sau 2 giờ, bắt cài app thanh toán.",
        "targetGoal": "Thanh toán các dịch vụ công đúng cổng chính thức và từ chối các đường link nộp phạt online giả.",
        "xpReward": 90,
        "shieldBadgeName": "Khiên Dịch Vụ Công Chuẩn Mực",
        "shieldBadgeIcon": "⚡",
        "theory": {
          "title": "Chiêu Trò Cắt Điện Nước Khẩn Cấp",
          "summary": "Kẻ lừa đảo gọi điện tự xưng là Nhân viên Điện lực EVN hoặc Công ty Cấp nước thông báo bạn còn nợ hóa đơn chưa đóng và sẽ \"cắt điện trong vòng 2 tiếng\" nếu không chuyển khoản ngay.",
          "keyPoints": [
            "⚡ Quy trình của Điện Lực EVN: EVN luôn gửi thông báo giấy trước nhiều ngày và nhắn tin qua Zalo OA chính thức có dấu tích vàng xác thực, KHÔNG BAO GIỜ dọa cắt điện tức thì qua cuộc gọi cá nhân.",
            "💳 Chỉ thanh toán qua App Ngân hàng / Cổng Dịch vụ công: Chọn mục \"Thanh toán hóa đơn tiền điện\" trên app ngân hàng của bạn, gõ mã khách hàng để kiểm tra dư nợ.",
            "⛔ Tuyệt đối không chuyển khoản vào tài khoản cá nhân của \"nhân viên thu tiền điện qua mạng\"."
          ],
          "visualMockup": {
            "type": "sms",
            "sender": "DIEN-LUC-VN",
            "content": "Dien luc thong bao: Khach hang con no 1.250.000d cuoc dien thang nay. Neu khong thanh toan qua link evn-bill-pay.com truoc 16h se bi cat dien toan bo!",
            "highlightedRedFlags": [
              "evn-bill-pay.com (domain giả)",
              "Dọa cắt điện sau vài giờ",
              "Yêu cầu vào link lạ"
            ],
            "note": "Trang web chính thức của EVN là evn.com.vn hoặc cskh.evn.com.vn!"
          },
          "goldenRule": "\"Muốn đóng tiền điện/nước = Mở app ngân hàng của chính mình tra mã khách hàng, KHÔNG bấm link lạ!\""
        },
        "practice": [
          {
            "id": "l12-p1",
            "type": "multiple_choice",
            "prompt": "Nếu nhận được cuộc gọi dọa cắt điện gia đình sau 2 tiếng vì nợ cước, cách xác minh chuẩn nhất là gì?",
            "options": [
              {
                "id": "a",
                "text": "Chuyển tiền ngay cho người gọi để nhà không bị mất điện.",
                "isCorrect": false,
                "explanation": "Sai! Bạn đang chuyển tiền cho kẻ lừa đảo."
              },
              {
                "id": "b",
                "text": "Mở ứng dụng ngân hàng của bạn, vào mục \"Hóa đơn tiền điện\" gõ mã Khách hàng (bắt đầu bằng chữ PB/PA...) để xem có nợ cước thật không, hoặc gọi tổng đài EVN 19006769.",
                "isCorrect": true,
                "explanation": "Chính xác! App ngân hàng kết nối dữ liệu thực với Điện lực nên thông tin luôn chuẩn xác 100%."
              },
              {
                "id": "c",
                "text": "Vào đường link người đó gửi qua tin nhắn để tra cứu.",
                "isCorrect": false,
                "explanation": "Sai! Link đó là trang web câu trộm tài khoản."
              }
            ]
          },
          {
            "id": "l12-p2",
            "type": "true_false",
            "prompt": "Nhân viên công ty viễn thông có quyền yêu cầu bạn chuyển khoản tiền cước điện thoại vào số tài khoản ngân hàng cá nhân của họ.",
            "trueFalseAnswer": {
              "isTrue": false,
              "explanation": "Sai! Tất cả các nhà mạng Viettel, Vinaphone, Mobifone đều có cổng thanh toán doanh nghiệp hoặc nạp trực tiếp qua app chính hãng."
            }
          },
          {
            "id": "l12-p3",
            "type": "matching",
            "prompt": "Ghép cơ quan dịch vụ với kênh kiểm tra chính thống:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Hóa đơn Điện lực"
                },
                "right": {
                  "id": "r1",
                  "text": "App CSKH EVN hoặc Tổng đài Chăm sóc khách hàng Điện lực",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hóa đơn Nước sinh hoạt"
                },
                "right": {
                  "id": "r2",
                  "text": "Cổng thanh toán hóa đơn trên App Ngân hàng đang dùng",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Phạt nguội giao thông"
                },
                "right": {
                  "id": "r3",
                  "text": "Tra cứu trên Cổng thông tin Cục Cảnh sát Giao thông csgt.vn",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-12-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Lừa đảo giả mạo nhân viên dịch vụ (Điện, nước, internet)\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-12-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-12-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-12-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Lừa đảo giả mạo nhân viên dịch vụ (Điện, nước, internet)\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-12-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-12-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-12-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Lừa đảo giả mạo nhân viên dịch vụ (Điện, nước, internet)\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Cuộc Gọi Dọa Cắt Điện Lúc Giữa Trưa",
          "scenarioContext": "Nhà bạn đang bật điều hòa mát mẻ thì nhận cuộc gọi từ người tự xưng là Tổ trưởng Điện Lực Quận.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Tổ Trưởng Thu Cước Ảo",
              "text": "Gia đình anh chị còn nợ tiền điện 850k. Nhân viên đang đi cắt cáp ngoài cột điện rồi. Chị vào link evn-thu-cuoc-khan-cap.top nộp ngay thì tôi bảo thợ dừng tay."
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Đòn đánh hoảng loạn! Họ dọa cắt điện giữa trưa nóng bức để bạn vội vã bấm link thanh toán.",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Vào link thanh toán gấp 850k để thợ không cắt điện nhà mình.",
                  "isSafe": false,
                  "feedback": "Bị chiếm quyền tài khoản và mất toàn bộ số dư ngân hàng!",
                  "consequence": "Trúng bẫy website giả mạo."
                },
                {
                  "id": "c2",
                  "text": "Bình tĩnh trả lời: \"Tôi sẽ tự thanh toán qua App Ngân hàng\", sau đó mở app ngân hàng check mã hóa đơn.",
                  "isSafe": true,
                  "feedback": "Quá thông minh! Kiểm tra trên app ngân hàng thấy tiền điện tháng này đã thanh toán xong từ tuần trước.",
                  "consequence": "Lật tẩy trò bịp và giữ vững an toàn."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-23",
        "unitId": "unit-5",
        "number": 23,
        "title": "Bẫy mã QR độc hại (Quishing) & Tráo mã tại quán ăn",
        "shortDesc": "Nhận diện mã QR dán đè tại cây xăng, quán cà phê và mã QR gửi qua email/tin nhắn.",
        "targetGoal": "Hình thành phản xạ kiểm tra tên tài khoản người nhận trước khi chuyển tiền và quét link QR an toàn.",
        "xpReward": 85,
        "shieldBadgeName": "Lăng Kính Giải Mã Quishing",
        "shieldBadgeIcon": "🔳",
        "theory": {
          "title": "Hiểm Họa Quét Mã QR Độc Hại (Quishing)",
          "summary": "Kẻ gian in mã QR của chúng rồi dán đè lên mã QR thanh toán tại quầy thu ngân quán ăn, cây xăng hoặc gửi mã QR qua email bắt quét để \"nhận quà tri ân\", thực chất dẫn tới trang web cài mã độc.",
          "keyPoints": [
            "🔳 Bản chất của mã QR: Mã QR chỉ là một dạng thể hiện hình ảnh của đường link URL hoặc số tài khoản. Bạn không thể nhìn bằng mắt thường để biết mã đó an toàn hay không.",
            "💳 Kiểm tra Tên Chủ Tài Khoản: Khi quét mã thanh toán, LUÔN nhìn vào tên người nhận trên app ngân hàng xem có đúng tên cửa hàng/chủ quán không trước khi bấm chuyển.",
            "🛑 Không quét mã QR lạ dán ở nơi công cộng (cột điện, bến xe, tờ rơi nhận thưởng miễn phí)."
          ],
          "visualMockup": {
            "type": "warning",
            "sender": "Cảnh Báo Thanh Toán Không Tiền Mặt",
            "content": "Mã QR thanh toán tại quầy có thể đã bị kẻ gian dán đè một lớp decal mã lạ lên trên!",
            "highlightedRedFlags": [
              "Mã QR bị dán đè gồ ghề",
              "Tên người nhận không khớp tên quán"
            ],
            "note": "Hãy nhìn kỹ bề mặt mã QR xem có vết bóc dán chắp vá không."
          },
          "goldenRule": "Quét QR thanh toán: Luôn hỏi lại thu ngân \"Tên tài khoản có phải là [Tên trên app] không?\""
        },
        "practice": [
          {
            "id": "l23-p1",
            "type": "multiple_choice",
            "prompt": "Khi quét mã QR thanh toán tiền ăn tại quán phở, bạn thấy tên người nhận hiện trên app ngân hàng là \"NGUYEN VAN X\" thay vì tên quán \"PHO GIA TRUYEN\", bạn nên làm gì?",
            "options": [
              {
                "id": "a",
                "text": "Dừng lại hỏi trực tiếp chủ quán xem đây có đúng là tài khoản của quán không.",
                "isCorrect": true,
                "explanation": "Chính xác! Rất có thể mã QR của quán đã bị kẻ xấu dán đè lén lút."
              },
              {
                "id": "b",
                "text": "Cứ bấm chuyển tiền luôn vì mã QR do quán để ở bàn.",
                "isCorrect": false,
                "explanation": "Sai! Tiền sẽ chạy thẳng vào túi của kẻ lừa đảo."
              }
            ]
          },
          {
            "id": "lesson-23-p2",
            "type": "matching",
            "prompt": "[Thực chiến #2] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-23-p3",
            "type": "true_false",
            "prompt": "[Thực chiến #3] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-23-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Bẫy mã QR độc hại (Quishing) & Tráo mã tại quán ăn\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-23-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-23-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-23-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Bẫy mã QR độc hại (Quishing) & Tráo mã tại quán ăn\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-23-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-23-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-23-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Bẫy mã QR độc hại (Quishing) & Tráo mã tại quán ăn\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Mã QR Nhận Voucher 500k",
          "scenarioContext": "Một tờ rơi kẹp trên xe máy bảo quét mã QR để nhận phiếu mua hàng Co.opmart 500k.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Tờ Rơi Quà Tặng",
              "text": "Quét mã QR để mở lì xì 500.000đ dành riêng cho khách hàng may mắn!"
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Quét thử bằng camera hiện link: \"http://qua-coopmart.cc/nhan-thuong.apk\". Đây là mã độc!",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Vứt ngay tờ rơi vào thùng rác và cảnh báo cho mọi người xung quanh.",
                  "isSafe": true,
                  "feedback": "Xử lý chuẩn xác! Bạn đã tiêu diệt một mầm mống mã độc nơi công cộng.",
                  "consequence": "An toàn tuyệt đối."
                },
                {
                  "id": "c2",
                  "text": "Bấm tải file về để xem voucher có dùng được không.",
                  "isSafe": false,
                  "feedback": "Mã độc lập tức cài cắm vào điện thoại và theo dõi giao dịch ngân hàng!",
                  "consequence": "Nhiễm phần mềm gián điệp."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-24",
        "unitId": "unit-5",
        "number": 24,
        "title": "File đính kèm độc hại .exe, .scr, .apk ngụy trang hợp đồng",
        "shortDesc": "Bóc trần kỹ thuật mở rộng đuôi kép file (.pdf.exe) trong email xin việc và hợp đồng kinh tế.",
        "targetGoal": "Nhận diện các loại tệp thực thi nguy hiểm và cách thiết lập hiện đuôi file đầy đủ trên máy tính.",
        "xpReward": 90,
        "shieldBadgeName": "Huy Hiệu Tường Lửa Tệp Tin",
        "shieldBadgeIcon": "📁",
        "theory": {
          "title": "Mánh Khóe \"Đuôi File Kép\" Của Hacker",
          "summary": "Hacker gửi email đính kèm tệp có tên \"Hop_dong_kinh_doanh.pdf.exe\" hoặc \"CV_Ung_tuyen.docx.scr\". Máy tính mặc định ẩn đuôi mở rộng nên bạn chỉ thấy icon PDF và bấm đúp vào mở, kích hoạt virus trojan xâm nhập.",
          "keyPoints": [
            "📁 Nhận biết tệp thực thi nguy hiểm: Tuyệt đối không mở các file có đuôi .exe, .scr, .bat, .vbs, .iso gửi từ email lạ.",
            "⚙️ Bật chế độ \"File name extensions\" trong Windows: Giúp bạn nhìn thấy đuôi thật sự của mọi file trên máy tính.",
            "🛑 Không bấm nút \"Enable Macro\" (Bật nội dung) khi mở các file Excel / Word lạ từ Internet gửi tới."
          ],
          "visualMockup": {
            "type": "email",
            "sender": "ketoan-doitac@gmail.com",
            "content": "Gửi anh bảng đối soát công nợ tháng này: Bang_doi_soat_cong_no.xlsx.exe (Dung lượng 2.4 MB). Anh mở file xem giúp em nhé!",
            "highlightedRedFlags": [
              ".xlsx.exe (Đuôi kép nguy hiểm)",
              "Email gửi từ gmail miễn phí"
            ],
            "note": "File Excel thật sự không bao giờ có đuôi kết thúc bằng chữ .exe!"
          },
          "goldenRule": "Không bao giờ nhấp đúp vào tệp tin lạ có đuôi .exe hoặc yêu cầu bật Macro!"
        },
        "practice": [
          {
            "id": "l24-p1",
            "type": "multiple_choice",
            "prompt": "Tệp tin nào sau đây tiềm ẩn nguy cơ chứa mã độc cao nhất khi nhận được qua email?",
            "options": [
              {
                "id": "a",
                "text": "Hoa_don_tien_dien_thang_8.pdf.exe",
                "isCorrect": true,
                "explanation": "Chính xác! Đuôi thực sự là .exe (chương trình chạy mã độc ngụy trang icon PDF)."
              },
              {
                "id": "b",
                "text": "Bao_cao_tai_chinh_2026.pdf",
                "isCorrect": false,
                "explanation": "Đây là tệp tài liệu PDF tiêu chuẩn."
              }
            ]
          },
          {
            "id": "lesson-24-p2",
            "type": "matching",
            "prompt": "[Thực chiến #2] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-24-p3",
            "type": "true_false",
            "prompt": "[Thực chiến #3] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-24-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"File đính kèm độc hại .exe, .scr, .apk ngụy trang hợp đồng\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-24-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-24-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-24-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"File đính kèm độc hại .exe, .scr, .apk ngụy trang hợp đồng\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-24-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-24-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-24-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"File đính kèm độc hại .exe, .scr, .apk ngụy trang hợp đồng\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Hồ Sơ Ứng Viên Giám Đốc",
          "scenarioContext": "Bộ phận nhân sự nhận được email nộp CV ứng tuyển vị trí lương cao kèm file zip nén.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Ứng Viên Nặc Danh",
              "text": "Kính gửi công ty, em gửi CV và các chứng chỉ quốc tế trong tệp Ho_so_CV.zip, pass giải nén là 123456."
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Giải nén ra thấy file Ho_so_CV.scr. Hacker dùng mật khẩu zip để vượt qua tường lửa quét virus!",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Xóa vĩnh viễn tệp tin và báo cáo email rác cho bộ phận IT công ty.",
                  "isSafe": true,
                  "feedback": "Cứu cả hệ thống mạng công ty khỏi thảm họa mã độc mã hóa tống tiền (Ransomware)!",
                  "consequence": "Bảo vệ toàn diện hệ thống."
                },
                {
                  "id": "c2",
                  "text": "Bấm đúp mở file xem ứng viên có chứng chỉ gì.",
                  "isSafe": false,
                  "feedback": "Toàn bộ máy chủ công ty bị khóa mã hóa đòi tiền chuộc 1 Bitcoin!",
                  "consequence": "Thiệt hại hàng trăm triệu đồng."
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "unit-6",
    "unitNumber": 6,
    "title": "Hành động và Ứng phó",
    "objective": "Biết chính xác các bước xử lý khẩn cấp khi nghi ngờ bị lừa đảo & luyện tập kịch bản tổng hợp",
    "themeColor": {
      "bg": "bg-blue-950/70",
      "border": "border-blue-500/50",
      "glow": "shadow-blue-500/20",
      "text": "text-blue-400",
      "gradient": "from-blue-600 to-cyan-700",
      "button": "bg-blue-500 hover:bg-blue-400 border-b-4 border-blue-700 text-slate-950"
    },
    "lessons": [
      {
        "id": "lesson-13",
        "unitId": "unit-6",
        "number": 13,
        "title": "Các bước xử lý khi nghi ngờ bị lừa đảo",
        "shortDesc": "Khóa tài khoản khẩn cấp, ngắt mạng thiết bị & trình báo cơ quan Công an.",
        "targetGoal": "Nắm vững quy trình sơ cứu tài chính 3 bước trong \"Giờ Vàng\" (Golden Hour) để giảm thiểu thiệt hại.",
        "xpReward": 100,
        "shieldBadgeName": "Khiên Sơ Cứu Khẩn Cấp",
        "shieldBadgeIcon": "🚨",
        "theory": {
          "title": "Quy Trình 4 Bước \"Sơ Cứu Khẩn Cấp\" Khi Sập Bẫy",
          "summary": "Nếu lỡ tay bấm vào link độc hại, nhập mã OTP hoặc lỡ chuyển tiền cho kẻ gian, hãy thực hiện NGAY LẬP TỨC các bước sau trong 15 phút đầu tiên.",
          "keyPoints": [
            "🛑 Bước 1 - Ngắt kết nối mạng ngay lập tức: Bật Chế độ máy bay (Airplane Mode) hoặc tắt Wifi/4G và tắt nguồn máy nếu nghi bị cài app điều khiển từ xa.",
            "🔒 Bước 2 - Khóa tài khoản ngân hàng & đổi mật khẩu: Dùng điện thoại của người thân gọi Hotline khẩn cấp của Ngân hàng yêu cầu KHÓA TỨC THÌ toàn bộ thẻ và dịch vụ Internet Banking.",
            "📸 Bước 3 - Thu thập và bảo quản bằng chứng: Chụp màn hình tin nhắn, số tài khoản nhận tiền, tên người nhận, sao kê ngân hàng và link website lừa đảo.",
            "🏛️ Bước 4 - Tố giác cơ quan Công an: Đến trực tiếp Công an xã/phường hoặc Phòng Cảnh sát Hình sự / An ninh mạng (PA05) nơi cư trú để nộp đơn trình báo."
          ],
          "visualMockup": {
            "type": "warning",
            "sender": "Quy Trình Sơ Cứu Giờ Vàng (Scam Emergency)",
            "content": "🚨 1. Bật Chế độ máy bay → 2. Gọi Hotline Ngân hàng khóa thẻ/app → 3. Chụp bằng chứng giao dịch → 4. Báo Công an phường!",
            "highlightedRedFlags": [
              "Giờ vàng 15 phút",
              "Khóa khẩn cấp ngân hàng"
            ],
            "note": "Hành động càng nhanh, khả năng phong tỏa dòng tiền của kẻ lừa đảo càng cao!"
          },
          "goldenRule": "\"Lỡ bấm link lạ: Bật chế độ máy bay ngay → Gọi ngân hàng khóa app trong 15 phút đầu!\""
        },
        "practice": [
          {
            "id": "l13-p1",
            "type": "multiple_choice",
            "prompt": "Nếu phát hiện mình lỡ cài một ứng dụng lạ đuôi .apk và thấy màn hình tự động nhảy chuột chuyển tiền, bạn phải làm gì ĐẦU TIÊN?",
            "options": [
              {
                "id": "a",
                "text": "Ngồi xem app chạy xem nó chuyển tiền đi đâu.",
                "isCorrect": false,
                "explanation": "Sai! Tiền của bạn sẽ bay sạch trong chớp mắt."
              },
              {
                "id": "b",
                "text": "Tắt nguồn điện thoại ngay lập tức hoặc bật Chế độ máy bay để cắt đứt lệnh điều khiển từ xa của hacker.",
                "isCorrect": true,
                "explanation": "Chính xác! Cắt kết nối mạng là cách duy nhất chặn hacker điều khiển máy từ xa ngay tại thời điểm đó."
              },
              {
                "id": "c",
                "text": "Nhắn tin cho kẻ lừa đảo xin tha.",
                "isCorrect": false,
                "explanation": "Sai! Kẻ lừa đảo không bao giờ trả lại tiền."
              }
            ]
          },
          {
            "id": "l13-p2",
            "type": "true_false",
            "prompt": "Sau khi bị lừa mất tiền, bạn thấy trên Facebook có dịch vụ \"Luật sư / Hacker hỗ trợ lấy lại tiền bị lừa đảo thu phí sau\", bạn nên thuê họ giúp đỡ.",
            "trueFalseAnswer": {
              "isTrue": false,
              "explanation": "Sai! Đây là bẫy lừa đảo thứ cấp (Secondary Scam). Những kẻ mạo danh hacker lấy lại tiền sẽ tiếp tục lừa bạn đóng phí lần thứ 2!"
            }
          },
          {
            "id": "l13-p3",
            "type": "matching",
            "prompt": "Ghép bước xử lý với mục đích bảo vệ:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Gọi hotline ngân hàng khóa thẻ"
                },
                "right": {
                  "id": "r1",
                  "text": "Chặn đứng dòng tiền không cho kẻ gian rút thêm",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Chụp lại lịch sử chat & mã giao dịch"
                },
                "right": {
                  "id": "r2",
                  "text": "Làm bằng chứng pháp lý nộp cho cơ quan điều tra Công an",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Đổi mật khẩu email & mạng xã hội trên thiết bị sạch"
                },
                "right": {
                  "id": "r3",
                  "text": "Ngăn chặn hacker chiếm quyền tài khoản phụ khác",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-13-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Các bước xử lý khi nghi ngờ bị lừa đảo\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-13-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-13-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-13-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Các bước xử lý khi nghi ngờ bị lừa đảo\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-13-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-13-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-13-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Các bước xử lý khi nghi ngờ bị lừa đảo\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "15 Phút Cứu Nguy Cho Tài Khoản",
          "scenarioContext": "Bạn vừa vô tình nhập mã OTP ngân hàng vào một trang web bán vé máy bay giả mạo.",
          "dialogue": [
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Cảnh báo khẩn! Bạn vừa để lộ mã OTP. Kẻ lừa đảo đang chuẩn bị gửi lệnh chuyển tiền số dư của bạn. Hãy hành động ngay!"
            },
            {
              "sender": "user",
              "senderName": "Bạn (Người học)",
              "text": "Tôi đang rất hoảng sợ, tôi nên làm bước nào đầu tiên bây giờ?!",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Đợi xem có tin nhắn trừ tiền không rồi mới tính tiếp.",
                  "isSafe": false,
                  "feedback": "Quá muộn! Toàn bộ số tiền tiết kiệm đã bị chuyển sang tài khoản ma.",
                  "consequence": "Bỏ lỡ giờ vàng ứng phó."
                },
                {
                  "id": "c2",
                  "text": "Lấy ngay điện thoại bên cạnh gọi thẳng Hotline Ngân hàng báo: \"Tôi bị lộ OTP, xin hãy khóa toàn bộ tài khoản ngay bây giờ!\".",
                  "isSafe": true,
                  "feedback": "Xuất sắc! Nhân viên ngân hàng đã kịp thời đóng băng tài khoản trước khi lệnh chuyển tiền của hacker hoàn tất.",
                  "consequence": "Cứu được 100% số tiền trong tài khoản."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-14",
        "unitId": "unit-6",
        "number": 14,
        "title": "Luyện tập tổng hợp",
        "shortDesc": "Bài thi tốt nghiệp Vệ Binh ScamGuard - Thử thách đa kịch bản.",
        "targetGoal": "Vượt qua bài sát hạch toàn diện để đạt Danh hiệu Vệ Binh Bất Khả Xâm Phạm.",
        "xpReward": 100,
        "shieldBadgeName": "Đại Khiên Vệ Binh Tối Thượng",
        "shieldBadgeIcon": "👑",
        "theory": {
          "title": "Thử Thách Tốt Nghiệp Vệ Binh Không Gian Mạng",
          "summary": "Chúc mừng bạn đã đi đến chặng cuối cùng của lộ trình! Bài học này sẽ kiểm tra toàn bộ 5 quy tắc phòng thủ: Chậm lại, Soi xét kỹ, Xác thực chéo, Bảo mật OTP và Sơ cứu kịp thời.",
          "keyPoints": [
            "🛡️ 5 Quy Tắc Vàng đã học: 1. Không click link lạ; 2. Không nghe dọa nạt qua điện thoại; 3. Không tin quà tặng miễn phí; 4. Không gửi OTP/mật khẩu; 5. Gọi điện thoại xác thực chéo.",
            "💡 Tâm thế Vệ Binh: Luôn giữ một cái đầu lạnh, hoài nghi lành mạnh và bảo vệ những người xung quanh (gia đình, bạn bè).",
            "🏆 Phần thưởng tối thượng: Mở khóa danh hiệu Vệ Binh ScamGuard Tinh Nhuệ và Khiên Vệ Binh Huyền Thoại."
          ],
          "visualMockup": {
            "type": "warning",
            "sender": "Hội Đồng Vệ Binh ScamGuard",
            "content": "🏆 Bạn đã sẵn sàng tham gia thử thách tổng hợp 3 câu hỏi tình huống thực tế để nhận Huy Hiệu Đại Vệ Binh Tối Thượng?",
            "highlightedRedFlags": [
              "Thử thách tổng hợp"
            ],
            "note": "Hãy vận dụng tất cả kỹ năng đã tích lũy từ Bài 1 đến Bài 13!"
          },
          "goldenRule": "\"Một người cẩn trọng có thể bảo vệ cả gia đình và cộng đồng an toàn trên mạng!\""
        },
        "practice": [
          {
            "id": "l14-p1",
            "type": "multiple_choice",
            "prompt": "Tình huống tổng hợp: Nhận được tin nhắn SMS từ \"CONG-AN-GIAO-THONG\" thông báo phạt nguội 5 triệu kèm link tải app csgt-phatnguoi.apk. Bạn làm gì?",
            "options": [
              {
                "id": "a",
                "text": "Tải app nộp phạt để không bị tăng tiền.",
                "isCorrect": false,
                "explanation": "Sai! Đây là ứng dụng gián điệp giả mạo."
              },
              {
                "id": "b",
                "text": "Không bấm link, vào trang web chính thức csgt.vn trên máy tính để tự tra cứu biển số xe của mình.",
                "isCorrect": true,
                "explanation": "Chính xác! Cục CSGT chỉ thông báo vi phạm qua văn bản giấy và tra cứu trên csgt.vn."
              },
              {
                "id": "c",
                "text": "Gọi số điện thoại trong tin nhắn để xin giảm mức phạt.",
                "isCorrect": false,
                "explanation": "Sai! Số điện thoại đó là của kẻ lừa đảo."
              }
            ]
          },
          {
            "id": "l14-p2",
            "type": "true_false",
            "prompt": "Mã số OTP (One-Time Password) và mã Smart OTP là chìa khóa két sắt cá nhân, không một nhân viên ngân hàng hay cán bộ công an nào được phép yêu cầu bạn cung cấp.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Đúng 100%! Bất kỳ ai đòi mã OTP của bạn thì chắc chắn 100% là kẻ lừa đảo chiếm đoạt tài sản."
            }
          },
          {
            "id": "l14-p3",
            "type": "matching",
            "prompt": "Ghép tình huống với nguyên tắc xử lý tương ứng:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Kẻ lạ hứa tặng quà / trúng thưởng lớn"
                },
                "right": {
                  "id": "r1",
                  "text": "Không có bữa trưa miễn phí - Không nộp tiền cọc",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Tự xưng Công an / Viện kiểm sát qua điện thoại"
                },
                "right": {
                  "id": "r2",
                  "text": "Yêu cầu làm việc trực tiếp tại trụ sở hành chính",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Bạn bè nhắn tin mượn tiền qua mạng"
                },
                "right": {
                  "id": "r3",
                  "text": "Gọi điện thoại truyền thống xác nhận giọng nói người thật",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-14-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Luyện tập tổng hợp\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-14-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-14-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-14-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Luyện tập tổng hợp\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-14-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-14-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-14-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Luyện tập tổng hợp\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Đấu Trường Trí Tuệ Vệ Binh",
          "scenarioContext": "Bạn nhận được cuộc gọi từ kẻ lừa đảo tổng hợp kết hợp: Vừa xưng là công an dọa án phạt, vừa dụ dỗ nộp tiền giảm án.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Trùm Lừa Đảo Công Nghệ Cao",
              "text": "Tôi biết mọi thông tin của bạn. Nếu không chuyển 30 triệu vào tài khoản này trong 10 phút, bạn sẽ bị khởi tố và mất hết danh dự!"
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Bạn đã hoàn thành 14 bài học. Giờ là lúc bạn tung đòn quyết định để chiến thắng kẻ lừa đảo!",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Hoảng sợ xin xỏ kẻ lừa đảo bớt tiền.",
                  "isSafe": false,
                  "feedback": "Kẻ gian sẽ tiếp tục ép bạn tới cùng!",
                  "consequence": "Thất bại trước đòn tâm lý."
                },
                {
                  "id": "c2",
                  "text": "Cười tự tin và nói: \"Tôi là Vệ Binh ScamGuard. Tôi đã ghi âm cuộc gọi và gửi dữ liệu cho Cục An ninh mạng PA05. Mời các vị ra đầu thú!\", sau đó cúp máy.",
                  "isSafe": true,
                  "feedback": "Tuyệt tác! Kẻ lừa đảo cúp máy ngay trong cơn hoảng loạn!",
                  "consequence": "Bạn đã chính thức trở thành Đại Vệ Binh Tối Thượng!"
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-25",
        "unitId": "unit-6",
        "number": 25,
        "title": "Thẩm định Tin Tức Giả (Fake News) & Website Giả Mạo",
        "shortDesc": "Phương pháp 4 bước bóc trần tin đồn thất thiệt, văn bản đóng dấu đỏ giả mạo cơ quan nhà nước.",
        "targetGoal": "Trang bị tư duy hoài nghi lành mạnh và kỹ năng kiểm chứng chéo trên Cổng thông tin Chính phủ.",
        "xpReward": 95,
        "shieldBadgeName": "Huy Hiệu Giám Định Tin Thật",
        "shieldBadgeIcon": "📰",
        "theory": {
          "title": "Quy Trình 4 Bước Thẩm Định Tin Tức (S.I.F.T)",
          "summary": "Kẻ xấu thường tạo tin giả giật gân (như \"Ngân hàng X sắp phá sản\", \"Đổi luật phạt giao thông mới\") kèm con dấu đỏ giả mạo để gây hoang mang dư luận rồi dẫn dụ nạn nhân vào bẫy rút tiền hoặc mua dịch vụ.",
          "keyPoints": [
            "🛑 S - Stop (Dừng lại): Đừng vội chia sẻ hay hoảng loạn chuyển tiền khi đọc một thông tin gây sốc.",
            "🔍 I - Investigate the source (Soi nguồn): Tin tức phát ra từ trang báo chính thống (VTV, Tuổi Trẻ, Báo Nhân Dân, TTXVN) hay từ một trang Facebook cá nhân không rõ lai lịch?",
            "🔎 F - Find trusted coverage (Tìm xác nhận từ cơ quan chức năng): Vào thẳng Cổng thông tin điện tử Chính phủ (chinhphu.vn) hoặc Bộ Công An (bocongan.gov.vn) để đọc thông cáo báo chí chính thức.",
            "🧭 T - Trace context (Lần theo ngữ cảnh): Hình ảnh và văn bản có bị photoshop tẩy xóa ngày tháng hay không?"
          ],
          "visualMockup": {
            "type": "warning",
            "sender": "Cổng Thông Tin Bộ TT&TT",
            "content": "Văn bản giả mạo thường mắc lỗi chính tả cơ bản, sai quy cách thể thức văn bản hành chính nhà nước và dùng con dấu photoshop lệch tâm!",
            "highlightedRedFlags": [
              "Sai thể thức văn bản",
              "Lỗi chính tả sơ đẳng"
            ],
            "note": "Kiểm chứng mọi tin đồn tại trang web Chongluadao.vn và Cục ATTT."
          },
          "goldenRule": "Không tin, không vội chia sẻ thông tin chưa được cơ quan chức năng kiểm chứng!"
        },
        "practice": [
          {
            "id": "l25-p1",
            "type": "multiple_choice",
            "prompt": "Khi thấy trên mạng xã hội lan truyền ảnh chụp \"Văn bản quyết định thanh tra tài sản cá nhân\" có dấu đỏ của Viện Kiểm Sát Tối Cao, bạn nên kiểm tra ở đâu?",
            "options": [
              {
                "id": "a",
                "text": "Tra cứu trực tiếp trên Cổng thông tin điện tử của Viện Kiểm Sát Nhân Dân Tối Cao (vksndtc.gov.vn) hoặc liên hệ cơ quan công an gần nhất.",
                "isCorrect": true,
                "explanation": "Chính xác! Cơ quan nhà nước luôn công khai các biểu mẫu và quy trình làm việc chuẩn."
              },
              {
                "id": "b",
                "text": "Tin tưởng ngay vì có con dấu đỏ và chữ ký scan.",
                "isCorrect": false,
                "explanation": "Sai! Dấu đỏ và chữ ký có thể được cắt ghép chỉnh sửa bằng Photoshop trong 2 phút."
              }
            ]
          },
          {
            "id": "lesson-25-p2",
            "type": "matching",
            "prompt": "[Thực chiến #2] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-25-p3",
            "type": "true_false",
            "prompt": "[Thực chiến #3] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-25-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Thẩm định Tin Tức Giả (Fake News) & Website Giả Mạo\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-25-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-25-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-25-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Thẩm định Tin Tức Giả (Fake News) & Website Giả Mạo\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-25-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-25-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-25-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Thẩm định Tin Tức Giả (Fake News) & Website Giả Mạo\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Tin Đồn Đổi Tiền Lúc Nửa Đêm",
          "scenarioContext": "Một bài viết Facebook có 10.000 lượt chia sẻ tuyên bố ngân hàng nhà nước sắp đổi tiền.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Trang Tin Tức Giật Gân",
              "text": "Khẩn cấp: Rút hết tiền gửi ngân hàng mua vàng ngay kẻo mất giá 50% trong tuần tới!"
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Đây là tin giả nhằm kích động đám đông và thao túng giá vàng lừa đảo. Bạn phản ứng thế nào?",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Bình tĩnh kiểm tra VTV1 và Báo Chính Phủ. Bản tin xác nhận đây là tin đồn thất thiệt đã bị xử phạt.",
                  "isSafe": true,
                  "feedback": "Bản lĩnh của một công dân số thông thái!",
                  "consequence": "Giữ vững tài chính gia đình."
                },
                {
                  "id": "c2",
                  "text": "Chia sẻ bài viết lên trang cá nhân và hối hả đi rút tiền.",
                  "isSafe": false,
                  "feedback": "Vừa mất lãi suất tiền gửi vừa vi phạm luật an ninh mạng vì phát tán tin giả!",
                  "consequence": "Thiệt hại kinh tế và bị phạt vi phạm hành chính."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-26",
        "unitId": "unit-6",
        "number": 26,
        "title": "Bài Thi Tốt Nghiệp Vệ Binh Cấp Tối Cao (Master Exam)",
        "shortDesc": "Đại thử thách 5 tình huống thực chiến tổng hợp bảo vệ toàn bộ không gian số.",
        "targetGoal": "Đạt danh hiệu Đại Vệ Binh Không Gian Mạng Tối Cao và mở khóa Huân Chương ScamGuard Huyền Thoại.",
        "xpReward": 120,
        "shieldBadgeName": "Vương Miện Vệ Binh Bất Khả Xâm Phạm",
        "shieldBadgeIcon": "👑",
        "theory": {
          "title": "Lễ Trưởng Thành Của Vệ Binh ScamGuard",
          "summary": "Bạn đã trải qua toàn bộ 26 bài học thực chiến, giải mã hơn 50 cạm bẫy từ viễn thông, mạng xã hội, tài chính đến Deepfake AI. Bài thi này là cánh cổng cuối cùng khẳng định bản lĩnh Vệ Binh Cấp Tối Cao.",
          "keyPoints": [
            "🛡️ Trụ Cột 1: Bình tĩnh, chậm lại 5 giây trước mọi thông báo gấp gáp.",
            "🔍 Trụ Cột 2: Soi kỹ URL, người gửi, số tài khoản và quyền hạn ứng dụng.",
            "🗝️ Trụ Cột 3: Bảo mật tuyệt đối OTP, Mật khẩu và dùng Safe Word trong gia đình."
          ],
          "visualMockup": {
            "type": "warning",
            "sender": "Bộ Tư Lệnh Vệ Binh ScamGuard",
            "content": "Chào mừng bạn đến với thử thách kiểm tra phản xạ tối thượng. Hãy bảo vệ bạn bè và người thân an toàn!",
            "highlightedRedFlags": [
              "Đại thử thách Vệ Binh"
            ],
            "note": "Hoàn thành để nhận Huân Chương Danh Dự Huyền Thoại."
          },
          "goldenRule": "Vệ Binh không chỉ bảo vệ bản thân, mà còn là ngọn hải đăng soi sáng cho gia đình và cộng đồng!"
        },
        "practice": [
          {
            "id": "l26-p1",
            "type": "multiple_choice",
            "prompt": "Nếu một kẻ lừa đảo kết hợp: Gọi điện Deepfake khuôn mặt người thân + nhắn tin gửi link xác nhận OTP + dọa bắt giam trong 15 phút, bạn sẽ làm gì?",
            "options": [
              {
                "id": "a",
                "text": "Cúp máy ngay, hỏi Safe Word gia đình qua số SIM truyền thống, tuyệt đối KHÔNG bấm link và KHÔNG đọc OTP.",
                "isCorrect": true,
                "explanation": "XUẤT SẮC! Đòn phòng thủ hoàn hảo phá tan toàn bộ ma trận tấn công phức tạp nhất."
              },
              {
                "id": "b",
                "text": "Thực hiện từng yêu cầu của kẻ gọi.",
                "isCorrect": false,
                "explanation": "Sai! Bạn sẽ bị mất toàn bộ tài sản."
              }
            ]
          },
          {
            "id": "lesson-26-p2",
            "type": "matching",
            "prompt": "[Thực chiến #2] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-26-p3",
            "type": "true_false",
            "prompt": "[Thực chiến #3] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-26-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Bài Thi Tốt Nghiệp Vệ Binh Cấp Tối Cao (Master Exam)\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-26-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-26-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-26-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Bài Thi Tốt Nghiệp Vệ Binh Cấp Tối Cao (Master Exam)\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-26-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-26-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-26-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Bài Thi Tốt Nghiệp Vệ Binh Cấp Tối Cao (Master Exam)\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Đại Chiến Định Đoạt Tương Lai Số",
          "scenarioContext": "Kẻ chủ mưu đường dây lừa đảo công nghệ cao tung đòn tấn công tổng lực cuối cùng.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Siêu Trùm Tội Phạm Mạng",
              "text": "Ngươi không thể thoát khỏi ma trận của ta. Tiền tài, danh dự của ngươi sẽ tan biến nếu không đầu hàng!"
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Vệ Binh, hãy tung đòn kết liễu với toàn bộ tri thức và bản lĩnh bạn đã rèn luyện!",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Dõng dạc tuyên bố: \"Mọi đòn tâm lý, link độc và mã giả của ngươi đều vô hiệu trước Vệ Binh ScamGuard!\", sau đó chặn số và gửi báo cáo cho Cục An ninh mạng.",
                  "isSafe": true,
                  "feedback": "ĐÒN ĐOẠT MỆNH! Tên trùm lừa đảo hoàn toàn sụp đổ và bị lực lượng chức năng bắt giữ!",
                  "consequence": "Bạn chính thức trở thành Đại Vệ Binh Không Gian Mạng Tối Cao!"
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-28",
        "unitId": "unit-6",
        "number": 28,
        "title": "Lừa Đảo Combo Du Lịch Giá Siêu Rẻ & Vé Máy Bay Tết",
        "shortDesc": "Bóc mẽ fanpage du lịch giả mạo tích xanh, phòng khách sạn ma và vé máy bay code ảo.",
        "targetGoal": "Kiểm tra mã đặt chỗ PNR trực tiếp trên trang chủ hãng hàng không và xác thực tư cách pháp nhân công ty du lịch.",
        "xpReward": 85,
        "shieldBadgeName": "Huy Hiệu Du Lịch Thông Thái",
        "shieldBadgeIcon": "✈️",
        "theory": {
          "title": "Ma Trận \"Combo Phú Quốc 3N2Đ Giá 999k\"",
          "summary": "Kẻ gian mua fanpage Facebook có sẵn tích xanh rồi đổi tên thành các công ty lữ hành lớn (Saigontourist, Vietravel, Vinpearl), chạy quảng cáo combo nghỉ dưỡng 5 sao giá rẻ giật mình nhằm chiếm đoạt tiền đặt cọc của du khách.",
          "keyPoints": [
            "✈️ Chiêu bài vé máy bay Code giữ chỗ: Kẻ lừa đảo tạo code giữ chỗ tạm thời (chưa thanh toán vé thật) gửi cho bạn để lấy lòng tin, sau khi bạn chuyển tiền thì code đó tự động hủy sau 24h.",
            "🏢 Kiểm tra giấy phép lữ hành quốc tế: Tra cứu trên website Cục Du Lịch Quốc Gia (vietnamtourism.gov.vn) để xác minh công ty có thật hay không.",
            "🛑 Không chuyển tiền cọc vào tài khoản cá nhân của nhân viên tư vấn online chưa rõ danh tính."
          ],
          "visualMockup": {
            "type": "chat",
            "sender": "Vinpearl Luxury Deals (Fanpage Giả)",
            "content": "Tri ân khách hàng: Voucher Villa 3 phòng ngủ Vinpearl Phú Quốc giảm 70% chỉ còn 2.500.000đ/đêm. Chuyển cọc 50% vào STK cá nhân: 8829103 Vietcombank - PHAM VAN NAM để giữ phòng!",
            "highlightedRedFlags": [
              "Giảm giá 70% vô lý",
              "Chuyển cọc vào STK cá nhân"
            ],
            "note": "Tập đoàn du lịch lớn luôn nhận thanh toán qua cổng thanh toán chính thức hoặc STK doanh nghiệp!"
          },
          "goldenRule": "Mua vé máy bay/tour: Luôn gọi thẳng hotline hãng và check mã code PNR trên hệ thống trước khi trả tiền!"
        },
        "practice": [
          {
            "id": "l28-p1",
            "type": "multiple_choice",
            "prompt": "Khi mua vé máy bay Tết từ một đại lý online trên mạng xã hội, làm sao để chắc chắn 100% vé đã được xuất thật?",
            "options": [
              {
                "id": "a",
                "text": "Lấy mã đặt chỗ (Code vé 6 ký tự) vào thẳng website chính thức của Vietnam Airlines/Vietjet/Bamboo bấm \"Quản lý đặt chỗ\" kiểm tra tình trạng \"ĐÃ THANH TOÁN (ISSUED)\".",
                "isCorrect": true,
                "explanation": "Chính xác! Chỉ khi vé có trạng thái Issued thì bạn mới chắc chắn có chỗ trên chuyến bay."
              },
              {
                "id": "b",
                "text": "Nhìn vào ảnh chụp màn hình vé máy bay có tên của mình do đại lý gửi qua Zalo.",
                "isCorrect": false,
                "explanation": "Ảnh chụp màn hình có thể chỉ là code giữ chỗ tạm thời chưa thanh toán."
              }
            ]
          },
          {
            "id": "lesson-28-p2",
            "type": "matching",
            "prompt": "[Thực chiến #2] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-28-p3",
            "type": "true_false",
            "prompt": "[Thực chiến #3] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-28-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Lừa Đảo Combo Du Lịch Giá Siêu Rẻ & Vé Máy Bay Tết\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-28-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-28-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-28-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Lừa Đảo Combo Du Lịch Giá Siêu Rẻ & Vé Máy Bay Tết\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-28-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-28-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-28-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Lừa Đảo Combo Du Lịch Giá Siêu Rẻ & Vé Máy Bay Tết\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Kỳ Nghỉ Lễ Trong Mơ",
          "scenarioContext": "Bạn tìm mua combo Đà Lạt 4 người giá chỉ 1.8 triệu trên một fanpage có 50.000 lượt like.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Tư Vấn Tour Đà Lạt",
              "text": "Chỉ còn 1 phòng duy nhất view đồi thông, chị chuyển cọc 100% 1.8 triệu trong 10 phút để em xuất mã voucher nhé!"
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Yêu cầu chuyển cọc gấp 100% vào tài khoản cá nhân. Bạn xử lý thế nào?",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Gọi trực tiếp cho khách sạn ở Đà Lạt hỏi xem có liên kết chương trình khuyến mãi này không.",
                  "isSafe": true,
                  "feedback": "Khách sạn báo không hề có chương trình này! Bạn đã giữ trọn tiền đi du lịch.",
                  "consequence": "Thoát bẫy lừa cọc khách sạn ảo."
                },
                {
                  "id": "c2",
                  "text": "Chuyển cọc 1.8 triệu ngay vì sợ mất phòng đẹp.",
                  "isSafe": false,
                  "feedback": "Chuyển xong fanpage lập tức chặn tin nhắn của bạn!",
                  "consequence": "Mất trắng tiền cọc."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-29",
        "unitId": "unit-6",
        "number": 29,
        "title": "Bẫy Việc Làm Remote & Xuất Khẩu Lao Động Ảo",
        "shortDesc": "Lật tẩy chiêu trò tuyển dụng việc nhẹ lương cao Campuchia/Dubai và thu phí hồ sơ visa.",
        "targetGoal": "Nhận diện bẫy tuyển dụng không yêu cầu kinh nghiệm nhưng lương 40 triệu/tháng và các đường dây buôn người xuyên biên giới.",
        "xpReward": 90,
        "shieldBadgeName": "Huy Hiệu Phòng Tuyến Lao Động",
        "shieldBadgeIcon": "💼",
        "theory": {
          "title": "Mặt Tối Của \"Việc Nhẹ Lương Cao Tại Nước Ngoài\"",
          "summary": "Các đối tượng đăng tin tuyển dụng \"Nhân viên chăm sóc khách hàng, gõ máy tính tại casino/văn phòng nước ngoài\" lương 30 - 50 triệu/tháng, bao ăn ở và vé máy bay. Khi sang đến nơi, nạn nhân bị tịch thu hộ chiếu, ép tham gia đường dây lừa đảo trực tuyến và bị đánh đập nếu không đạt chỉ tiêu.",
          "keyPoints": [
            "💼 Cờ đỏ tuyển dụng: Không yêu cầu bằng cấp, không cần kinh nghiệm, bao trọn gói chi phí xuất cảnh nhưng mức lương cao bất thường.",
            "🛂 Thủ tục xuất khẩu lao động hợp pháp: Bắt buộc phải thông qua các doanh nghiệp được Bộ LĐ-TB&XH cấp giấy phép hoạt động dịch vụ đưa người lao động đi nước ngoài.",
            "🛑 Không bao giờ đi xuất cảnh bằng đường mòn, lối mở hoặc visa du lịch để đi làm việc bất hợp pháp."
          ],
          "visualMockup": {
            "type": "chat",
            "sender": "HR Tuyển Dụng Quốc Tế (Telegram)",
            "content": "Tuyển 10 bạn trực chat Casino Campuchia lương 35tr/tháng + thưởng nóng. Không cần tiếng Anh, chỉ cần biết gõ phím. Công ty bao xe đón tận biên giới Tây Ninh!",
            "highlightedRedFlags": [
              "Lương cao vô lý không cần bằng cấp",
              "Đưa đón vượt biên giới"
            ],
            "note": "Đây là cạm bẫy buôn người và cưỡng bức lao động lừa đảo mạng cực kỳ nguy hiểm!"
          },
          "goldenRule": "Không có việc nào vừa nhẹ nhàng, không cần học vấn mà lại có thu nhập nghìn đô la!"
        },
        "practice": [
          {
            "id": "l29-p1",
            "type": "multiple_choice",
            "prompt": "Một công ty môi giới việc làm yêu cầu bạn đóng 5 triệu tiền \"Phí giữ chỗ phỏng vấn\" hoặc \"Tiền cọc đồng phục\" trước khi làm việc, bạn nên làm gì?",
            "options": [
              {
                "id": "a",
                "text": "Từ chối ngay lập tức vì các nhà tuyển dụng chân chính không bao giờ thu tiền phí phỏng vấn hay bắt đóng cọc của ứng viên.",
                "isCorrect": true,
                "explanation": "Chính xác! Quy định pháp luật nghiêm cấm người sử dụng lao động thu tiền của người tìm việc."
              },
              {
                "id": "b",
                "text": "Đóng tiền cọc để sớm được nhận vào làm việc.",
                "isCorrect": false,
                "explanation": "Bị lừa! Đóng tiền xong họ sẽ viện cớ bạn không đạt yêu cầu và chiếm đoạt tiền cọc."
              }
            ]
          },
          {
            "id": "lesson-29-p2",
            "type": "matching",
            "prompt": "[Thực chiến #2] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-29-p3",
            "type": "true_false",
            "prompt": "[Thực chiến #3] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-29-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Bẫy Việc Làm Remote & Xuất Khẩu Lao Động Ảo\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-29-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-29-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-29-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Bẫy Việc Làm Remote & Xuất Khẩu Lao Động Ảo\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-29-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-29-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-29-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Bẫy Việc Làm Remote & Xuất Khẩu Lao Động Ảo\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Lời Mời Đi Dubai Đổi Đời",
          "scenarioContext": "Một người quen trên mạng giới thiệu công việc trực fanpage tại Dubai với lương 2.000 USD/tháng.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Môi Giới Dubai",
              "text": "Bạn chỉ cần mang hộ chiếu đi sang theo diện du lịch, qua đó công ty sẽ chuyển đổi visa lao động sau!"
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Đi lao động bằng visa du lịch là hành vi bất hợp pháp và bạn sẽ bị tước đoạt quyền lợi khi sang xứ người!",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Dứt khoát từ chối và cảnh báo người thân về đường dây tuyển dụng bất hợp pháp này.",
                  "isSafe": true,
                  "feedback": "Quyết định cứu rỗi cả cuộc đời bạn khỏi cạm bẫy lao động cưỡng bức!",
                  "consequence": "Bảo đảm an toàn tính mạng và tự do."
                },
                {
                  "id": "c2",
                  "text": "Vay mượn tiền làm hộ chiếu đi ngay.",
                  "isSafe": false,
                  "feedback": "Sang đến nơi bị giam lỏng tại khu phức hợp và bắt làm việc 16 tiếng/ngày!",
                  "consequence": "Rơi vào thảm kịch buôn người."
                }
              ]
            }
          ]
        }
      },
      {
        "id": "lesson-30",
        "unitId": "unit-6",
        "number": 30,
        "title": "Pháo Đài Sinh Trắc Học Khuôn Mặt & Thẻ Ngân Hàng",
        "shortDesc": "Bảo vệ dữ liệu NFC trên CCCD gắn chip và nguyên tắc bảo mật giao dịch trên 10 triệu đồng.",
        "targetGoal": "Nắm vững quy định sinh trắc học bắt buộc của Ngân hàng Nhà nước và cách bảo vệ chip NFC trên CCCD.",
        "xpReward": 95,
        "shieldBadgeName": "Huy Hiệu Sinh Trắc Học Tối Tân",
        "shieldBadgeIcon": "🛡️",
        "theory": {
          "title": "Bảo Vệ Dữ Liệu Sinh Trắc Học & Chip CCCD",
          "summary": "Từ ngày 01/07/2024, mọi giao dịch ngân hàng chuyển tiền trên 10 triệu đồng hoặc tổng giao dịch trên 20 triệu/ngày đều bắt buộc phải quét khuôn mặt sinh trắc học khớp với dữ liệu trong chip CCCD. Đây là lá chắn thép bảo vệ tiền của bạn ngay cả khi bị mất điện thoại.",
          "keyPoints": [
            "💳 Không bao giờ chụp ảnh 2 mặt CCCD gửi lên mạng xã hội hoặc các hội nhóm vay tiền.",
            "📱 Chỉ quét chip NFC và quét khuôn mặt trực tiếp TRONG ỨNG DỤNG NGÂN HÀNG CHÍNH THỨC, tuyệt đối không quét qua bất kỳ link web nào.",
            "🛑 Nếu phát hiện mất CCCD: Lập tức đến cơ quan công an trình báo để cấp lại và cập nhật với ngân hàng."
          ],
          "visualMockup": {
            "type": "browser",
            "sender": "Hệ Thống Xác Thực Sinh Trắc Học",
            "content": "Ứng dụng ngân hàng chính thức yêu cầu bạn áp sát mặt sau CCCD vào cụm camera/NFC của điện thoại và xoay mặt nhẹ theo hướng dẫn.",
            "highlightedRedFlags": [
              "Chỉ thực hiện trong App ngân hàng chính thức"
            ],
            "note": "Ngân hàng không bao giờ gọi điện hướng dẫn quét sinh trắc học qua Zalo!"
          },
          "goldenRule": "Dữ liệu khuôn mặt và vân tay là tài sản vô giá: Chỉ quét trong App ngân hàng chính chủ!"
        },
        "practice": [
          {
            "id": "l30-p1",
            "type": "multiple_choice",
            "prompt": "Nếu có cuộc gọi tự xưng là nhân viên ngân hàng hỗ trợ cài đặt sinh trắc học qua ứng dụng điều khiển màn hình (AnyDesk/UltraViewer/TeamViewer), bạn nên phản ứng ra sao?",
            "options": [
              {
                "id": "a",
                "text": "Cúp máy ngay lập tức và đến trực tiếp chi nhánh ngân hàng gần nhất để được nhân viên hỗ trợ.",
                "isCorrect": true,
                "explanation": "Chính xác! Ngân hàng nghiêm cấm nhân viên hỗ trợ sinh trắc học qua phần mềm điều khiển từ xa."
              },
              {
                "id": "b",
                "text": "Cài đặt UltraViewer để nhân viên làm giúp cho nhanh.",
                "isCorrect": false,
                "explanation": "Kẻ gian sẽ nhìn thấy toàn bộ mã OTP và chiếm quyền điều khiển điện thoại rút sạch tiền."
              }
            ]
          },
          {
            "id": "lesson-30-p2",
            "type": "matching",
            "prompt": "[Thực chiến #2] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-30-p3",
            "type": "true_false",
            "prompt": "[Thực chiến #3] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-30-p4",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #4] Trong nội dung bài học \"Pháo Đài Sinh Trắc Học Khuôn Mặt & Thẻ Ngân Hàng\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-30-p5",
            "type": "matching",
            "prompt": "[Thực chiến #5] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-30-p6",
            "type": "true_false",
            "prompt": "[Thực chiến #6] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-30-p7",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #7] Trong nội dung bài học \"Pháo Đài Sinh Trắc Học Khuôn Mặt & Thẻ Ngân Hàng\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          },
          {
            "id": "lesson-30-p8",
            "type": "matching",
            "prompt": "[Thực chiến #8] Ghép nối nhận diện rủi ro an ninh mạng chuẩn xác:",
            "matchingPairs": [
              {
                "left": {
                  "id": "m1",
                  "text": "Yêu cầu gấp gáp & Đe dọa"
                },
                "right": {
                  "id": "r1",
                  "text": "Dấu hiệu thao túng tâm lý (Scam Red Flags)",
                  "matchesLeftId": "m1"
                }
              },
              {
                "left": {
                  "id": "m2",
                  "text": "Hotline chính thống / App gốc"
                },
                "right": {
                  "id": "r2",
                  "text": "Kênh liên lạc an toàn 100%",
                  "matchesLeftId": "m2"
                }
              },
              {
                "left": {
                  "id": "m3",
                  "text": "Mật khẩu dài & 2FA App"
                },
                "right": {
                  "id": "r3",
                  "text": "Lá chắn bảo vệ tài khoản kiên cố",
                  "matchesLeftId": "m3"
                }
              }
            ]
          },
          {
            "id": "lesson-30-p9",
            "type": "true_false",
            "prompt": "[Thực chiến #9] Khi đối mặt với các tình huống trực tuyến đáng ngờ đe dọa khóa tài khoản hoặc hứa hẹn thưởng lớn, việc giữ bình tĩnh và xác thực qua kênh chính thống là lá chắn bảo vệ an toàn nhất.",
            "trueFalseAnswer": {
              "isTrue": true,
              "explanation": "Chính xác! Giữ bình tĩnh và không làm theo cảm xúc tức thời là nguyên tắc vàng phòng chống lừa đảo."
            }
          },
          {
            "id": "lesson-30-p10",
            "type": "multiple_choice",
            "prompt": "[Thực chiến #10] Trong nội dung bài học \"Pháo Đài Sinh Trắc Học Khuôn Mặt & Thẻ Ngân Hàng\", phản ứng nào là chuẩn mực nhất khi nhận được yêu cầu cung cấp mã OTP hoặc bấm vào link lạ?",
            "options": [
              {
                "id": "a",
                "text": "Nhập thông tin ngay để tránh bị gián đoạn dịch vụ.",
                "isCorrect": false,
                "explanation": "Sai! Đây là bẫy đánh cắp thông tin cá nhân."
              },
              {
                "id": "b",
                "text": "Dừng lại, tuyệt đối không bấm link, không cung cấp OTP và báo cáo lừa đảo.",
                "isCorrect": true,
                "explanation": "Chính xác! Dừng lại kiểm tra độc lập là kỹ năng cốt lõi."
              },
              {
                "id": "c",
                "text": "Chụp màn hình gửi lên mạng xã hội hỏi ý kiến.",
                "isCorrect": false,
                "explanation": "Không an toàn vì có thể lộ thông tin nhạy cảm."
              }
            ]
          }
        ],
        "story": {
          "title": "Cuộc Gọi Hỗ Trợ Sinh Trắc Học",
          "scenarioContext": "Một người tự xưng là nhân viên Vietcombank gọi thông báo tài khoản chưa cài sinh trắc học sẽ bị khóa chuyển tiền sau 12h.",
          "dialogue": [
            {
              "sender": "scammer",
              "senderName": "Nhân Viên Hỗ Trợ Ngân Hàng",
              "text": "Chị kết bạn Zalo với em, bật chia sẻ màn hình để em hướng dẫn quét chip CCCD vào máy nhé!"
            },
            {
              "sender": "assistant",
              "senderName": "Cú Vệ Binh CyberGuard",
              "text": "Chia sẻ màn hình sẽ làm lộ thông tin nhạy cảm và mã xác thực! Bạn sẽ hành động thế nào?",
              "actionRequired": true,
              "choices": [
                {
                  "id": "c1",
                  "text": "Nói: \"Tôi sẽ tự ra quầy giao dịch Vietcombank\", cúp máy và chặn số.",
                  "isSafe": true,
                  "feedback": "Phòng thủ xuất sắc! Bạn đã bảo vệ dữ liệu khuôn mặt và tài sản an toàn tuyệt đối.",
                  "consequence": "Ngăn chặn hoàn toàn cuộc tấn công."
                },
                {
                  "id": "c2",
                  "text": "Bật chia sẻ màn hình Zalo và làm theo hướng dẫn.",
                  "isSafe": false,
                  "feedback": "Kẻ gian chụp lại toàn bộ thông tin CCCD và khuôn mặt của bạn!",
                  "consequence": "Bị đánh cắp danh tính số."
                }
              ]
            }
          ]
        }
      }
    ]
  }
];
