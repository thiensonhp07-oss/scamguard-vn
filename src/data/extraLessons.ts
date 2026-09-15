import { DuolingoLesson } from './duolingoLessons';

export const EXTRA_LESSONS: DuolingoLesson[] = [
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
];
