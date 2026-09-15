export type TranslationKey =
  // Navbar & Nav items
  | 'nav_home'
  | 'nav_train'
  | 'nav_check'
  | 'nav_progress'
  | 'nav_learn'
  | 'nav_emergency'
  | 'nav_safe_word'
  | 'nav_mode_adult'
  | 'nav_mode_senior'
  | 'nav_mode_teen'
  | 'nav_mode_kids'
  | 'nav_mode_family'
  | 'nav_mode_school'
  // Home View
  | 'home_badge_title'
  | 'home_hero_title'
  | 'home_hero_subtitle'
  | 'home_btn_check'
  | 'home_btn_train'
  | 'home_btn_emergency'
  | 'home_stat_score'
  | 'home_stat_streak'
  | 'home_stat_xp'
  | 'home_stat_tier'
  | 'home_section_quick_actions'
  | 'home_action_check_title'
  | 'home_action_check_desc'
  | 'home_action_arena_title'
  | 'home_action_arena_desc'
  | 'home_action_quishing_title'
  | 'home_action_quishing_desc'
  | 'home_action_deepfake_title'
  | 'home_action_deepfake_desc'
  | 'home_action_drill_title'
  | 'home_action_drill_desc'
  | 'home_action_emergency_title'
  | 'home_action_emergency_desc'
  | 'home_section_trending'
  | 'home_trending_title'
  | 'home_trending_badge'
  | 'home_trending_btn'
  | 'home_section_circles'
  | 'home_family_circle_title'
  | 'home_family_circle_desc'
  | 'home_school_circle_title'
  | 'home_school_circle_desc'
  | 'home_manage_circle'
  // Check Scam View
  | 'check_header_badge'
  | 'check_header_title'
  | 'check_header_subtitle'
  | 'check_tab_text'
  | 'check_tab_screenshot'
  | 'check_input_label_text'
  | 'check_input_placeholder_text'
  | 'check_input_label_url'
  | 'check_input_placeholder_url'
  | 'check_input_label_sender'
  | 'check_input_placeholder_sender'
  | 'check_input_label_channel'
  | 'check_btn_analyze'
  | 'check_btn_analyzing'
  | 'check_btn_load_sample'
  | 'check_dropzone_title'
  | 'check_dropzone_subtitle'
  | 'check_dropzone_browse'
  | 'check_dropzone_context_label'
  | 'check_dropzone_context_placeholder'
  | 'check_privacy_notice'
  | 'check_result_risk_level'
  | 'check_result_risk_score'
  | 'check_result_tactics_detected'
  | 'check_result_signals_detected'
  | 'check_result_ai_summary'
  | 'check_result_persona_selector'
  | 'check_result_red_flags'
  | 'check_result_recommended_steps'
  | 'check_result_exposed_warning'
  | 'check_result_btn_emergency'
  // Train Hub & Arena
  | 'train_header_badge'
  | 'train_header_title'
  | 'train_header_subtitle'
  | 'train_subnav_arena'
  | 'train_subnav_quishing'
  | 'train_subnav_deepfake'
  | 'train_subnav_drills'
  | 'arena_choose_scenario'
  | 'arena_estimated_time'
  | 'arena_difficulty'
  | 'arena_btn_start'
  | 'arena_pressure_gauge'
  | 'arena_tactics_in_play'
  | 'arena_input_placeholder'
  | 'arena_btn_send'
  | 'arena_btn_end'
  | 'arena_btn_counter_script'
  | 'arena_counter_script_tooltip'
  | 'arena_score_title'
  | 'arena_score_overall'
  | 'arena_score_btn_retry'
  | 'arena_score_btn_next'
  // Quishing Lab
  | 'quish_header_title'
  | 'quish_header_subtitle'
  | 'quish_btn_inspect'
  | 'quish_verdict_scam'
  | 'quish_verdict_legit'
  | 'quish_domain_breakdown'
  | 'quish_red_flags'
  | 'quish_explanation'
  | 'quish_defense_tip'
  // Deepfake Lab
  | 'df_header_title'
  | 'df_header_subtitle'
  | 'df_btn_scan'
  | 'df_artifacts_detected'
  | 'df_defense_tactics'
  | 'df_response_formula'
  // Quick Drills
  | 'drill_header_title'
  | 'drill_confidence_label'
  | 'drill_btn_submit'
  | 'drill_btn_next'
  | 'drill_lesson_title'
  // Progress & DNA
  | 'prog_header_badge'
  | 'prog_header_title'
  | 'prog_header_subtitle'
  | 'prog_coach_title'
  | 'prog_coach_btn_refresh'
  | 'prog_strong_title'
  | 'prog_weak_title'
  | 'prog_matrix_title'
  | 'prog_badges_title'
  // Learn & Playbook
  | 'learn_header_badge'
  | 'learn_header_title'
  | 'learn_header_subtitle'
  | 'learn_golden_rules_title'
  | 'learn_scripts_title'
  | 'learn_scripts_subtitle'
  | 'learn_tactics_title'
  | 'learn_btn_copy'
  | 'learn_btn_copied'
  // Emergency Modal
  | 'em_title'
  | 'em_subtitle'
  | 'em_step_1_title'
  | 'em_step_1_desc'
  | 'em_step_2_title'
  | 'em_step_2_desc'
  | 'em_step_3_title'
  | 'em_step_3_desc'
  | 'em_step_4_title'
  | 'em_step_4_desc'
  | 'em_step_5_title'
  | 'em_step_5_desc'
  | 'em_hotlines_title'
  | 'em_btn_close'
  // Trusted Contacts Modal
  | 'tc_title'
  | 'tc_subtitle'
  | 'tc_safeword_title'
  | 'tc_safeword_desc'
  | 'tc_safeword_btn_change'
  | 'tc_safeword_btn_save'
  | 'tc_list_title'
  | 'tc_empty'
  | 'tc_form_title'
  | 'tc_form_name'
  | 'tc_form_phone'
  | 'tc_btn_save';

export const TRANSLATIONS: Record<'vi' | 'en', Record<TranslationKey, string>> = {
  vi: {
    // Navbar
    nav_home: 'Tổng Quan',
    nav_train: 'Huấn Luyện',
    nav_check: 'Điều Tra Scam',
    nav_progress: 'Hồ Sơ DNA',
    nav_learn: 'Cẩm Nang',
    nav_emergency: 'Ứng Cứu Khẩn Cấp',
    nav_safe_word: 'Mật Khẩu Gia Đình',
    nav_mode_adult: 'Người Lớn',
    nav_mode_senior: 'Người Cao Tuổi',
    nav_mode_teen: 'Thanh Thiếu Niên',
    nav_mode_kids: 'Trẻ Em',
    nav_mode_family: 'Gia Đình',
    nav_mode_school: 'Trường Học',

    // Home
    home_badge_title: 'Hệ Thống Phòng Thủ Nhận Thức & Chống Lừa Đảo AI',
    home_hero_title: 'Lá Chắn Thông Minh Trước Mọi Thủ Đoạn Lừa Đảo',
    home_hero_subtitle: 'Rèn luyện phản xạ tâm lý thực chiến, mổ xẻ mã QR quishing, lật tẩy deepfake giọng nói AI và điều tra tin nhắn đáng ngờ trong vài giây.',
    home_btn_check: 'Kiểm Tra Tin Nhắn / QR Ngay',
    home_btn_train: 'Vào Đấu Trường Huấn Luyện',
    home_btn_emergency: 'Quy Trình Khẩn Cấp',
    home_stat_score: 'Điểm Phòng Thủ',
    home_stat_streak: 'Chuỗi Ngày Học',
    home_stat_xp: 'Điểm Kinh Nghiệm (XP)',
    home_stat_tier: 'Hạng Phòng Thủ',
    home_section_quick_actions: 'Các Phân Hệ Phòng Thủ Chính',
    home_action_check_title: 'Điều Tra Rủi Ro Tức Thì',
    home_action_check_desc: 'Quét và bóc tách dấu hiệu lừa đảo từ tin nhắn SMS, Zalo, link web hoặc ảnh chụp màn hình bằng AI.',
    home_action_arena_title: 'Đấu Trường Scam Arena',
    home_action_arena_desc: 'Đối thoại trực tiếp với AI đóng vai kẻ lừa đảo đa nhân cách để rèn luyện phản xạ không sập bẫy.',
    home_action_quishing_title: 'Phòng Lab Soi Mã QR (Quishing)',
    home_action_quishing_desc: 'Bóc tách cấu trúc URL, nhận diện tên miền giả mạo và các nhãn dán QR bị dán đè nơi công cộng.',
    home_action_deepfake_title: 'Phòng Lab Deepfake AI',
    home_action_deepfake_desc: 'Phát hiện giọng nói nhân tạo, video giả mạo người thân / cơ quan công quyền đòi chuyển tiền.',
    home_action_drill_title: 'Thử Thách Nhanh 60 Giây',
    home_action_drill_desc: 'Tình huống vi mô hàng ngày giúp củng cố bản lĩnh và nhận thêm 50 XP.',
    home_action_emergency_title: 'Cứu Hộ Khi Đã Bị Lừa',
    home_action_emergency_desc: 'Hướng dẫn 5 bước chặn dòng tiền khẩn cấp, khóa thẻ và danh bạ đường dây nóng ngân hàng, công an.',
    home_section_trending: 'Cảnh Báo Thủ Đoạn Nổi Cộm Tuần Này',
    home_trending_title: 'Chiêu trò giả mạo Công an gọi video, dọa lệnh bắt giam và yêu cầu cài ứng dụng VNeID giả mạo',
    home_trending_badge: 'Mức Độ Nguy Hiểm: RẤT CAO',
    home_trending_btn: 'Luyện Tập Tình Huống Này',
    home_section_circles: 'Mô Hình Nhóm Bảo Vệ',
    home_family_circle_title: 'Vòng Tròn Bảo Vệ Gia Đình',
    home_family_circle_desc: 'Thiết lập mật mã bí mật và chia sẻ trạng thái sẵn sàng chống lừa đảo cho ông bà, cha mẹ, con cái.',
    home_school_circle_title: 'Không Gian An Ninh Mạng Lớp Học',
    home_school_circle_desc: 'Giao bài tập phân tích link độc hại và theo dõi điểm rèn luyện an toàn số của học sinh.',
    home_manage_circle: 'Quản Lý Vòng Tròn',

    // Check Scam
    check_header_badge: 'Bộ Phân Tích & Điều Tra Pháp Y Lừa Đảo',
    check_header_title: 'Điều Tra Tin Nhắn, Link Hoặc Ảnh Chụp Đáng Ngờ',
    check_header_subtitle: 'Nhập nội dung bạn nhận được để AI bóc tách dấu hiệu thao túng tâm lý, phát hiện tên miền mạo danh và hướng dẫn cách xử lý.',
    check_tab_text: 'Văn Bản & Đường Dẫn',
    check_tab_screenshot: 'Ảnh Chụp Màn Hình',
    check_input_label_text: 'Nội Dung Tin Nhắn / Email / Cuộc Trò Chuyện',
    check_input_placeholder_text: 'Dán toàn bộ nội dung tin nhắn đáng ngờ (Ví dụ: "Tài khoản của bạn bị khóa, nhấp vào link trong 5 phút để xác minh...")',
    check_input_label_url: 'Đường Dẫn Web / Tên Miền (Nếu có)',
    check_input_placeholder_url: 'https://vneid-dvc-gov.online/capnhat hoặc tên miền lạ...',
    check_input_label_sender: 'Người Gửi / Số Điện Thoại / Nickname',
    check_input_placeholder_sender: '+84 912... hoặc CSKH-BANK hoặc @congan_dieutra',
    check_input_label_channel: 'Kênh Liên Lạc',
    check_btn_analyze: 'Phân Tích Mức Độ Nguy Hiểm',
    check_btn_analyzing: 'Đang Tiến Hành Giám Định Pháp Y...',
    check_btn_load_sample: 'Thử Mẫu Điển Hình',
    check_dropzone_title: 'Kéo thả hoặc tải lên ảnh chụp màn hình',
    check_dropzone_subtitle: 'Hỗ trợ định dạng PNG, JPG, WEBP (Tối đa 15MB). Mọi thông tin nhạy cảm (PII) sẽ được tự động che mờ trước khi xử lý.',
    check_dropzone_browse: 'Chọn Ảnh Từ Thiết Bị',
    check_dropzone_context_label: 'Ghi Chú Bổ Sung (Tùy chọn)',
    check_dropzone_context_placeholder: 'Ví dụ: Tin nhắn này gửi vào Messenger lúc nửa đêm yêu cầu bấm link bình chọn...',
    check_privacy_notice: '🔒 Quyền Riêng Tư: Số CCCD, số thẻ và mã OTP được hệ thống làm sạch và che mờ tự động.',
    check_result_risk_level: 'Mức Độ Nguy Hiểm',
    check_result_risk_score: 'Chỉ Số Rủi Ro Lừa Đảo',
    check_result_tactics_detected: 'Thủ Đoạn Tâm Lý Được Phát Hiện',
    check_result_signals_detected: 'Các Dấu Hiệu Vi Phạm An Toàn',
    check_result_ai_summary: 'Kết Luận Điều Tra AI',
    check_result_persona_selector: 'Xem Giải Thích Theo Đối Tượng:',
    check_result_red_flags: 'Dấu Hiệu Nhận Biết Bẫy Lừa Đảo',
    check_result_recommended_steps: 'Hành Động Khuyến Nghị Ngay Bây Giờ',
    check_result_exposed_warning: 'Dữ Liệu Có Nguy Cơ Bị Chiếm Đoạt',
    check_result_btn_emergency: 'Tôi Đã Lỡ Bấm / Chuyển Tiền - Mở Cứu Hộ Khẩn Cấp',

    // Train Hub & Arena
    train_header_badge: 'Trung Tâm Huấn Luyện & Mô Phỏng Tác Chiến',
    train_header_title: 'Đấu Trường Thực Chiến & Phòng Lab Chống Lừa Đảo',
    train_header_subtitle: 'Thực hành tương tác trực tiếp với AI để tạo phản xạ miễn nhiễm trước các đòn tâm lý hiểm hóc.',
    train_subnav_arena: 'Đấu Trường Scam Arena',
    train_subnav_quishing: 'Phòng Lab Mã QR (Quishing)',
    train_subnav_deepfake: 'Phòng Lab Deepfake AI',
    train_subnav_drills: 'Thử Thách Nhanh 60 Giây',
    arena_choose_scenario: 'Chọn Tình Huống Mô Phỏng Thực Tế',
    arena_estimated_time: 'Thời lượng ước tính:',
    arena_difficulty: 'Độ khó:',
    arena_btn_start: 'Bắt Đầu Đối Thoại Mô Phỏng',
    arena_pressure_gauge: 'Đồng Hồ Đo Áp Lực Tâm Lý',
    arena_tactics_in_play: 'Chiêu thức đối phương đang sử dụng:',
    arena_input_placeholder: 'Nhập câu trả lời phòng thủ của bạn...',
    arena_btn_send: 'Gửi Phản Hồi',
    arena_btn_end: 'Kết Thúc & Nhận Báo Cáo Đánh Giá',
    arena_btn_counter_script: 'Gợi Ý Mẫu Câu Phản Đòn An Toàn',
    arena_counter_script_tooltip: 'Dùng câu phản đòn chuẩn để bẻ gãy đòn ép tâm lý của kẻ lừa đảo',
    arena_score_title: 'Báo Cáo Đánh Giá Bản Lĩnh Phòng Thủ',
    arena_score_overall: 'Điểm Số Phòng Ngự Toàn Diện',
    arena_score_btn_retry: 'Luyện Lại Kịch Bản Này',
    arena_score_btn_next: 'Chọn Kịch Bản Khác',

    // Quishing Lab
    quish_header_title: 'Phòng Thí Nghiệm & Pháp Y Mã QR (Quishing)',
    quish_header_subtitle: 'Kính hiển vi mổ xẻ cấu trúc URL, vạch trần tên miền lừa đảo và nhãn dán QR bị dán đè nơi công cộng.',
    quish_btn_inspect: 'Kích Hoạt Kính Hiển Vi Bóc Tách URL',
    quish_verdict_scam: 'MÃ QR ĐỘC HẠI / LỪA ĐẢO',
    quish_verdict_legit: 'MÃ QR HỢP LỆ & AN TOÀN',
    quish_domain_breakdown: 'Mổ Xẻ Cấu Trúc Địa Chỉ Web',
    quish_red_flags: 'Dấu Hiệu Độc Hại Đã Phát Hiện',
    quish_explanation: 'Bản Chất Thủ Đoạn Tấn Công',
    quish_defense_tip: 'Bí Quyết Phòng Ngự Thực Tế',

    // Deepfake Lab
    df_header_title: 'Phòng Lab Phòng Thủ Deepfake & Giọng Nói AI',
    df_header_subtitle: 'Rèn luyện khả năng phát hiện âm thanh nhân tạo, cuộc gọi video giả danh công an / người thân gặp nạn.',
    df_btn_scan: 'Chạy Quét Lỗi Tạo Ảnh & Giọng Nói AI',
    df_artifacts_detected: 'Lỗi Nhân Tạo (Artifacts) Được Phát Hiện',
    df_defense_tactics: 'Cách Hóa Giải Cuộc Gọi Video Giả Mạo',
    df_response_formula: 'Mẫu Câu Đối Ứng Khuyên Dùng',

    // Quick Drills
    drill_header_title: 'Thử Thách Vi Mô 60 Giây',
    drill_confidence_label: 'Mức độ tự tin vào phán đoán của bạn:',
    drill_btn_submit: 'Khóa & Nộp Câu Trả Lời',
    drill_btn_next: 'Sang Thử Thách Kế Tiếp',
    drill_lesson_title: 'Bài Học Phòng Vệ Rút Ra',

    // Progress & DNA
    prog_header_badge: 'Hồ Sơ Bản Đồ Tâm Lý Scam DNA',
    prog_header_title: 'Chỉ Số Năng Lực Phòng Thủ & Scam DNA',
    prog_header_subtitle: 'Theo dõi sự trưởng thành phản xạ phòng vệ qua 12 chiều tâm lý và nhận tư vấn chiến thuật từ AI Coach.',
    prog_coach_title: 'Huấn Luyện Viên AI ScamGuard',
    prog_coach_btn_refresh: 'Làm Mới Nhận Xét',
    prog_strong_title: 'Điểm Mạnh Phòng Thủ Của Bạn',
    prog_weak_title: 'Điểm Nhược Cần Rèn Luyện Thêm',
    prog_matrix_title: 'Ma Trận 12 Chiều Thao Túng Tâm Lý Toàn Diện',
    prog_badges_title: 'Bộ Huy Hiệu & Cột Mốc Thành Tích',

    // Learn & Playbook
    learn_header_badge: 'Cẩm Nang Tác Chiến SCAMGUARD',
    learn_header_title: 'Dừng Lại. Kiểm Tra. Xác Minh.',
    learn_header_subtitle: 'Nắm vững khung phòng thủ nhận thức 5 bước và bỏ túi các mẫu câu phản đòn tức thì.',
    learn_golden_rules_title: '5 Quy Tắc Vàng Bất Di Bất Dịch',
    learn_scripts_title: 'Kho Mẫu Câu Phản Đòn Thực Chiến',
    learn_scripts_subtitle: 'Bấm sao chép để dùng ngay khi bị kẻ gian dồn ép qua điện thoại hoặc tin nhắn.',
    learn_tactics_title: 'Bách Khoa Toàn Thư 12 Đòn Đánh Tâm Lý',
    learn_btn_copy: 'Sao Chép',
    learn_btn_copied: 'Đã Sao Chép',

    // Emergency Modal
    em_title: 'Quy Trình Ứng Cứu Khẩn Cấp Khi Đã Bị Lừa',
    em_subtitle: 'Bình tĩnh thực hiện ngay 5 bước này để ngăn chặn thất thoát thêm và bảo toàn chứng cứ.',
    em_step_1_title: 'Bước 1: Ngắt Kết Nối & Khóa Tài Khoản Ngay Lập Tức',
    em_step_1_desc: 'Mở ứng dụng ngân hàng khóa ngay thẻ tín dụng/ghi nợ, hoặc gọi hotline ngân hàng yêu cầu khóa khẩn cấp tài khoản và tạm dừng mọi giao dịch trực tuyến.',
    em_step_2_title: 'Bước 2: Đổi Mật Khẩu & Đăng Xuất Mọi Thiết Bị',
    em_step_2_desc: 'Đổi mật khẩu tài khoản ngân hàng, email chính, Zalo, Facebook và kích hoạt xác thực 2 yếu tố (2FA) không qua SMS nếu có thể.',
    em_step_3_title: 'Bước 3: Chụp Ảnh & Lưu Trữ Bằng Chứng',
    em_step_3_desc: 'Chụp lại toàn bộ tin nhắn, số điện thoại, số tài khoản nhận tiền, mã giao dịch (mã tham chiếu) và đường dẫn link lừa đảo. Không xóa đoạn chat.',
    em_step_4_title: 'Bước 4: Báo Cho Người Thân & Vòng Tròn Tin Cậy',
    em_step_4_desc: 'Cảnh báo gia đình, bạn bè biết tài khoản bạn có thể bị kẻ gian lợi dụng mượn tiền tiếp, tuyệt đối không chuyển thêm bất kỳ khoản phí nào để "chuộc lại tiền".',
    em_step_5_title: 'Bước 5: Trình Báo Cơ Quan Công An & Cơ Quan Chức Năng',
    em_step_5_desc: 'Liên hệ Cơ quan Công an gần nhất hoặc gọi đến đường dây nóng phòng chống tội phạm công nghệ cao để được hỗ trợ lập hồ sơ điều tra.',
    em_hotlines_title: 'Danh Bạ Đường Dây Nóng Khẩn Cấp (Việt Nam)',
    em_btn_close: 'Đã Hiểu & Đóng Lại',

    // Trusted Contacts Modal
    tc_title: 'Danh Bạ Người Tin Cậy & Khiên Bảo Vệ Gia Đình',
    tc_subtitle: 'Khi gặp tình huống nghi ngờ hoặc hoang mang, hãy tham vấn người thân trước khi chuyển tiền.',
    tc_safeword_title: 'Mật Mã Bí Mật Của Gia Đình (Family Safe-Word)',
    tc_safeword_desc: 'Khi có người gọi tự xưng là con/cháu/người thân bị tai nạn đòi tiền viện phí khẩn, hãy yêu cầu đọc đúng mật mã này. AI Deepfake không thể biết mật mã nội bộ của gia đình bạn.',
    tc_safeword_btn_change: 'Đổi Mật Mã',
    tc_safeword_btn_save: 'Lưu Lại',
    tc_list_title: 'Danh Sách Người Thân Đáng Tin Cậy',
    tc_empty: 'Chưa có người liên hệ nào được lưu. Hãy thêm số điện thoại con cái, vợ/chồng hoặc chuyên viên ngân hàng ruột bên dưới.',
    tc_form_title: 'Thêm Người Liên Hệ Mới',
    tc_form_name: 'Họ Tên (Ví dụ: Con Gái Lan / Chú Nam Công An Xã)',
    tc_form_phone: 'Số Điện Thoại / Tài Khoản Liên Lạc',
    tc_btn_save: 'Lưu Vào Danh Bạ Tin Cậy',
  },
  en: {
    // Navbar
    nav_home: 'Overview',
    nav_train: 'Training Hub',
    nav_check: 'Scam Investigator',
    nav_progress: 'Scam DNA',
    nav_learn: 'Playbook',
    nav_emergency: 'Emergency Help',
    nav_safe_word: 'Family Safe-Word',
    nav_mode_adult: 'Adult',
    nav_mode_senior: 'Senior',
    nav_mode_teen: 'Teen',
    nav_mode_kids: 'Kids',
    nav_mode_family: 'Family',
    nav_mode_school: 'School',

    // Home
    home_badge_title: 'Universal Cognitive Scam Defense & Anti-Fraud Simulator',
    home_hero_title: 'Adaptive Defense Against Modern Scams',
    home_hero_subtitle: 'Build psychological resilience with live AI roleplay, QR code forensics, voice clone detection, and instant message risk analysis.',
    home_btn_check: 'Investigate Message / URL',
    home_btn_train: 'Enter Training Hub',
    home_btn_emergency: 'Emergency Guide',
    home_stat_score: 'Defense Score',
    home_stat_streak: 'Daily Streak',
    home_stat_xp: 'Experience (XP)',
    home_stat_tier: 'Defense Tier',
    home_section_quick_actions: 'Core Defense Modules',
    home_action_check_title: 'Instant Scam Investigator',
    home_action_check_desc: 'Analyze SMS, emails, suspicious links, and screenshots with explainable multi-persona reasoning.',
    home_action_arena_title: 'Scam Arena Simulator',
    home_action_arena_desc: 'Interactive roleplay with an adaptive scammer AI that escalates tactics in real time.',
    home_action_quishing_title: 'Quishing & URL Forensics',
    home_action_quishing_desc: 'Dissect QR codes and uncover typosquatted domains and deceptive subdomains.',
    home_action_deepfake_title: 'Deepfake & Voice Lab',
    home_action_deepfake_desc: 'Detect neural voice clones, fake authority video calls, and synthetic media artifacts.',
    home_action_drill_title: '60-Second Micro Drills',
    home_action_drill_desc: 'Quick daily challenges to test your instincts and earn XP.',
    home_action_emergency_title: 'Emergency Checklist',
    home_action_emergency_desc: '5-step immediate crisis guide with hotlines and bank protocols if compromised.',
    home_section_trending: 'Trending Attack Vector This Week',
    home_trending_title: 'High-pressure impersonator claiming unauthorized overseas transactions and urgent account lockout',
    home_trending_badge: 'Risk Level: CRITICAL',
    home_trending_btn: 'Practice This Scenario',
    home_section_circles: 'Defense Circles',
    home_family_circle_title: 'Family Defense Circle',
    home_family_circle_desc: 'Set secret safe-words and monitor your family members’ readiness against synthetic voice scams.',
    home_school_circle_title: 'Classroom Cybersecurity Hub',
    home_school_circle_desc: 'Assign phishing analysis drills and track collective student cyber safety literacy.',
    home_manage_circle: 'Manage Circle',

    // Check Scam
    check_header_badge: 'Forensic Scam Investigator',
    check_header_title: 'Analyze Suspicious Text, URLs, or Screenshots',
    check_header_subtitle: 'Paste any unexpected communication to uncover psychological manipulation vectors, domain spoofing, and step-by-step guidance.',
    check_tab_text: 'Text & URL Input',
    check_tab_screenshot: 'Screenshot Upload',
    check_input_label_text: 'Message / Email Content',
    check_input_placeholder_text: 'Paste the suspicious message (e.g. "Your account has been restricted. Click here to verify within 5 mins...")',
    check_input_label_url: 'Website Link / URL (Optional)',
    check_input_placeholder_url: 'https://secure-bank-auth-verify.top/login...',
    check_input_label_sender: 'Sender Handle / Phone / Email',
    check_input_placeholder_sender: '+1 (800) 555-0199 or support@bank-verify.net',
    check_input_label_channel: 'Communication Channel',
    check_btn_analyze: 'Investigate Scam Risk',
    check_btn_analyzing: 'Running Forensic AI Analysis...',
    check_btn_load_sample: 'Load Sample',
    check_dropzone_title: 'Drag and drop or upload a screenshot',
    check_dropzone_subtitle: 'PNG, JPG, or WEBP up to 15MB. All sensitive personal information (PII) is automatically redacted.',
    check_dropzone_browse: 'Browse File',
    check_dropzone_context_label: 'Additional Context (Optional)',
    check_dropzone_context_placeholder: 'e.g. Received via Messenger claiming I won a giveaway prize...',
    check_privacy_notice: '🔒 Privacy Shield: Phone numbers, SSNs, credit cards, and OTPs are redacted automatically.',
    check_result_risk_level: 'Risk Level',
    check_result_risk_score: 'Scam Risk Score',
    check_result_tactics_detected: 'Detected Psychological Tactics',
    check_result_signals_detected: 'Security Risk Signals Detected',
    check_result_ai_summary: 'Forensic AI Summary',
    check_result_persona_selector: 'Explain for Target Audience:',
    check_result_red_flags: 'Key Red Flags & Warning Indicators',
    check_result_recommended_steps: 'Immediate Recommended Action Steps',
    check_result_exposed_warning: 'Data That Was Almost Compromised',
    check_result_btn_emergency: 'I Already Clicked / Paid - Open Emergency Checklist',

    // Train Hub & Arena
    train_header_badge: 'Behavioral Defense Training Complex',
    train_header_title: 'Live Scam Arena & Forensic Defense Labs',
    train_header_subtitle: 'Step into controlled simulations and sharpen your defensive instincts across realistic cyber threat scenarios.',
    train_subnav_arena: 'Scam Arena Simulator',
    train_subnav_quishing: 'Quishing Lab (QR Codes)',
    train_subnav_deepfake: 'Deepfake & Voice Lab',
    train_subnav_drills: '60-Second Micro Drills',
    arena_choose_scenario: 'Select a Realistic Simulation Scenario',
    arena_estimated_time: 'Estimated time:',
    arena_difficulty: 'Difficulty:',
    arena_btn_start: 'Enter Simulation Arena',
    arena_pressure_gauge: 'Psychological Pressure Gauge',
    arena_tactics_in_play: 'Tactics actively employed by attacker:',
    arena_input_placeholder: 'Type your defensive response...',
    arena_btn_send: 'Send Reply',
    arena_btn_end: 'End & View Score Report',
    arena_btn_counter_script: 'Use Counter-Script Helper',
    arena_counter_script_tooltip: 'Apply proven verbal counter-scripts to shut down pressure tactics',
    arena_score_title: 'Behavioral Defense Performance Report',
    arena_score_overall: 'Overall Defense Score',
    arena_score_btn_retry: 'Replay Scenario',
    arena_score_btn_next: 'Choose Another Scenario',

    // Quishing Lab
    quish_header_title: 'Quishing & URL Forensics Laboratory',
    quish_header_subtitle: 'Inspect deceptive subdomains, homoglyph attacks, and physical QR sticker overlays.',
    quish_btn_inspect: 'Run Forensic Microscope Scan',
    quish_verdict_scam: 'MALICIOUS QUISHING SCAM',
    quish_verdict_legit: 'LEGITIMATE & SAFE QR',
    quish_domain_breakdown: 'URL Structural Dissection',
    quish_red_flags: 'Forensic Red Flags Detected',
    quish_explanation: 'Threat Anatomy',
    quish_defense_tip: 'Defensive Verification Rule',

    // Deepfake Lab
    df_header_title: 'Deepfake & Synthetic Media Defense Lab',
    df_header_subtitle: 'Train your forensic eye to detect AI voice clones, fake authority video calls, and neural artifacts.',
    df_btn_scan: 'Run Forensic Artifact Scan',
    df_artifacts_detected: 'Forensic Flaws Detected',
    df_defense_tactics: 'How to Defeat Real-Time Deepfakes',
    df_response_formula: 'Recommended Verbal Response Formula',

    // Quick Drills
    drill_header_title: '60-Second Micro Defense Drill',
    drill_confidence_label: 'How confident are you in your judgment?',
    drill_btn_submit: 'Confirm & Lock Answer',
    drill_btn_next: 'Next Drill',
    drill_lesson_title: 'Forensic Lesson',

    // Progress & DNA
    prog_header_badge: 'Behavioral Defense Profiler',
    prog_header_title: 'My Scam DNA & Defense Score',
    prog_header_subtitle: 'Track your cognitive resilience across 12 psychological attack vectors and review personalized AI coaching.',
    prog_coach_title: 'ScamGuard Personal Coach',
    prog_coach_btn_refresh: 'Refresh Analysis',
    prog_strong_title: 'Your Strongest Defenses',
    prog_weak_title: 'Areas Requiring Training',
    prog_matrix_title: 'Complete 12-Dimensional Psychological Vector Matrix',
    prog_badges_title: 'Achievement Badges & Mastery Milestones',

    // Learn & Playbook
    learn_header_badge: 'The SCAMGUARD Playbook',
    learn_header_title: 'Stop. Check. Verify.',
    learn_header_subtitle: 'Master the universal cognitive defense framework and keep ready-made verbal counter-scripts on hand.',
    learn_golden_rules_title: 'The 5 Universal Rules of Cognitive Defense',
    learn_scripts_title: 'Ready-Made Verbal Counter-Scripts',
    learn_scripts_subtitle: 'Exact words to say or text when pressured by a scammer. Click to copy.',
    learn_tactics_title: 'Psychological Attack Vectors Encyclopedia',
    learn_btn_copy: 'Copy',
    learn_btn_copied: 'Copied',

    // Emergency Modal
    em_title: 'Emergency Response Protocol',
    em_subtitle: 'If you have sent money, given OTPs, or downloaded remote software, follow these steps immediately.',
    em_step_1_title: 'Step 1: Sever Connection & Freeze Accounts',
    em_step_1_desc: 'Immediately call your bank’s 24/7 fraud department to freeze cards, cancel pending wires, and lock online banking access.',
    em_step_2_title: 'Step 2: Change Passwords & Terminate Sessions',
    em_step_2_desc: 'Change your primary email, bank, and social logins from a separate clean device. Log out of all active sessions.',
    em_step_3_title: 'Step 3: Document Everything & Preserve Evidence',
    em_step_3_desc: 'Take screenshots of chat logs, phone numbers, recipient bank accounts, transaction reference IDs, and URLs.',
    em_step_4_title: 'Step 4: Alert Family & Trusted Circle',
    em_step_4_desc: 'Warn family and colleagues in case the scammer tries to impersonate you next. Never pay "recovery fees".',
    em_step_5_title: 'Step 5: File Official Police & Cyber Reports',
    em_step_5_desc: 'File a report with your local police department and your national anti-fraud agency (IC3/FTC/National CERT).',
    em_hotlines_title: 'Emergency Hotlines & Contact Directory',
    em_btn_close: 'Understood & Close',

    // Trusted Contacts Modal
    tc_title: 'Trusted Contacts & Family Shield',
    tc_subtitle: 'When in doubt, ask someone you trust before sending money.',
    tc_safeword_title: 'Secret Family Safe-Word',
    tc_safeword_desc: 'If someone calls claiming to be a distressed relative, ask for this secret word. Deepfake AI cannot guess your private safe-word.',
    tc_safeword_btn_change: 'Change',
    tc_safeword_btn_save: 'Save',
    tc_list_title: 'Your Emergency Contacts',
    tc_empty: 'No trusted contacts saved yet. Add your daughter, son, or bank advisor below.',
    tc_form_title: 'Add New Contact',
    tc_form_name: 'Name (e.g. Daughter Sarah / Bank Official)',
    tc_form_phone: 'Phone Number / Handle',
    tc_btn_save: 'Save Trusted Contact',
  },
};
