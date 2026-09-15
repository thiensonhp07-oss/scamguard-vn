import {
  ArenaMessage,
  ArenaSession,
  ArenaTimelineEvent,
  DefenseScoreBreakdown,
  DefenseTier,
  ScamScenario,
  ScamTactic,
} from '../src/types';
import { SCAM_SCENARIOS } from '../src/data/scenarios';
import { executeGeminiWithFallback, GEMINI_MODEL } from './gemini';
import { sanitizeAndRedactPII, defendPromptInjection } from './safety';

// In-memory active session store
const sessionsMap = new Map<string, ArenaSession>();

export function clearAllArenaSessions() {
  sessionsMap.clear();
}

export function createArenaSession(scenarioId: string): ArenaSession {
  const scenario = SCAM_SCENARIOS.find((s) => s.id === scenarioId) || SCAM_SCENARIOS[0];
  const sessionId = `arena_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const initialMsg: ArenaMessage = {
    id: `msg_0_${Date.now()}`,
    sender: 'scammer',
    text: scenario.initialMessage,
    timestamp: timeStr,
    detectedTactic: scenario.tactics[0] || 'Authority',
    tacticExplanation: `Đối tượng mở đầu bằng đòn tâm lý ${scenario.tactics[0] || 'Authority'}.`,
    psychPressureDelta: 40,
  };

  const initialEvent: ArenaTimelineEvent = {
    timeLabel: timeStr,
    actor: 'Kẻ Lừa Đảo',
    action: `Bắt đầu tấn công qua kênh ${scenario.channel.toUpperCase()}`,
    type: 'tactic',
    description: `Mở màn kịch bản bằng thủ thuật thao túng: ${scenario.tactics[0]}`,
  };

  const session: ArenaSession = {
    id: sessionId,
    scenarioId: scenario.id,
    scenario,
    messages: [initialMsg],
    currentPressure: 40,
    trustLevel: 20,
    detectedTactics: [scenario.tactics[0] || 'Authority'],
    timeline: [initialEvent],
    status: 'active',
    startTime: Date.now(),
    exposedInfoWarning: {
      financial: false,
      identity: false,
      credentials: false,
      none: true,
    },
  };

  sessionsMap.set(sessionId, session);
  return session;
}

export function getArenaSession(sessionId: string): ArenaSession | undefined {
  return sessionsMap.get(sessionId);
}

export interface UserTurnEvaluation {
  scammerResponse: string;
  nextTactic: ScamTactic;
  tacticExplanation: string;
  pressureDelta: number;
  userVerificationDetected: boolean;
  complianceDetected: boolean;
  sessionEnded: boolean;
}

export async function processUserArenaMessage(
  sessionId: string,
  userMessageText: string,
  fallbackContext?: { scenarioId?: string; messages?: ArenaMessage[] }
): Promise<{ session: ArenaSession; evaluation: UserTurnEvaluation }> {
  let session = sessionsMap.get(sessionId);
  if (!session) {
    const sc = SCAM_SCENARIOS.find((s) => s.id === fallbackContext?.scenarioId) || SCAM_SCENARIOS[0];
    const initialMsgs: ArenaMessage[] =
      fallbackContext?.messages && fallbackContext.messages.length > 0
        ? [...fallbackContext.messages]
        : [
            {
              id: `msg_0_${Date.now()}`,
              sender: 'scammer',
              text: sc.initialMessage,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              detectedTactic: sc.tactics[0] || 'Authority',
              tacticExplanation: `Đối tượng mở đầu bằng đòn tâm lý ${sc.tactics[0] || 'Authority'}.`,
              psychPressureDelta: 40,
            },
          ];

    session = {
      id: sessionId,
      scenarioId: sc.id,
      scenario: sc,
      messages: initialMsgs,
      currentPressure: 40,
      trustLevel: 20,
      detectedTactics: [sc.tactics[0] || 'Authority'],
      timeline: [],
      status: 'active',
      startTime: Date.now(),
      exposedInfoWarning: {
        financial: false,
        identity: false,
        credentials: false,
        none: true,
      },
    };
    sessionsMap.set(sessionId, session);
  }

  const { text: cleanUserText } = sanitizeAndRedactPII(userMessageText);
  const safeUserText = defendPromptInjection(cleanUserText);

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Add User Message
  const userMsgId = `msg_user_${Date.now()}`;
  const userMsg: ArenaMessage = {
    id: userMsgId,
    sender: 'user',
    text: safeUserText,
    timestamp: timeStr,
  };
  session.messages.push(userMsg);

  // Deterministic evaluation heuristics (Vietnamese & English keywords)
  const lower = safeUserText.toLowerCase();
  const isVerifying =
    lower.includes('xác minh') ||
    lower.includes('gọi lại') ||
    lower.includes('trực tiếp') ||
    lower.includes('trụ sở') ||
    lower.includes('mặt sau') ||
    lower.includes('chi nhánh') ||
    lower.includes('hotline') ||
    lower.includes('mật khẩu') ||
    lower.includes('giấy mời') ||
    lower.includes('triệu tập') ||
    lower.includes('verify') ||
    lower.includes('call back') ||
    lower.includes('official');

  const isRefusing =
    lower.includes('không') ||
    lower.includes('từ chối') ||
    lower.includes('lừa đảo') ||
    lower.includes('dừng lại') ||
    lower.includes('cúp máy') ||
    lower.includes('báo công an') ||
    lower.includes('no') ||
    lower.includes('refuse') ||
    lower.includes('scam');

  const isComplying =
    lower.includes('vâng') ||
    lower.includes('dạ') ||
    lower.includes('đây') ||
    lower.includes('đã chuyển') ||
    lower.includes('mã otp') ||
    lower.includes('mật khẩu là') ||
    lower.includes('gửi rồi') ||
    lower.includes('ok') ||
    lower.includes('here is') ||
    lower.includes('sent');

  // Timeline entry for user
  if (isVerifying) {
    session.timeline.push({
      timeLabel: timeStr,
      actor: 'Bạn',
      action: 'Yêu Cầu Xác Minh Độc Lập',
      type: 'verification',
      description: 'Bạn đã chủ động yêu cầu xác minh qua kênh liên lạc chính thức hoặc hỏi mật mã an toàn.',
    });
  } else if (isRefusing) {
    session.timeline.push({
      timeLabel: timeStr,
      actor: 'Bạn',
      action: 'Kiên Quyết Từ Chối & Vạch Trần',
      type: 'success',
      description: 'Bạn đã dứt khoát bác bỏ yêu cầu vô lý và không để đối tượng dẫn dắt tâm lý.',
    });
  } else if (isComplying) {
    session.timeline.push({
      timeLabel: timeStr,
      actor: 'Bạn',
      action: 'Có Dấu Hiệu Lúng Túng / Nghe Theo',
      type: 'danger',
      description: 'Bạn đã có xu hướng làm theo lời đối phương hoặc lộ thông tin quan trọng.',
    });
  }

  // Tactic escalation state machine
  const availableTactics = session.scenario.tactics;
  const currentIndex = session.detectedTactics.length % availableTactics.length;
  let nextTactic: ScamTactic = availableTactics[currentIndex] || 'Urgency';

  // If user verified, switch to Authority or Fear to intimidate
  if (isVerifying) {
    nextTactic = 'Authority';
  } else if (isRefusing) {
    nextTactic = 'Fear';
  }

  let scammerResponse = '';
  let tacticExplanation = `Đối tượng tăng cường đòn tâm lý ${nextTactic} nhằm phản kích phản xạ phòng vệ của bạn.`;
  let pressureDelta = isComplying ? -10 : isVerifying ? +15 : +10;
  let sessionEnded = session.messages.length >= 8;

  try {
    const historyContext = session.messages
      .map((m) => `${m.sender === 'user' ? 'NẠN NHÂN (NGƯỜI DÙNG)' : 'KẺ LỪA ĐẢO'}: ${m.text}`)
      .join('\n');

    const prompt = `Bạn là hệ thống mô phỏng tác chiến phòng thủ an ninh mạng SCAMGUARD.
Hãy đóng vai KẺ LỪA ĐẢO (Scammer) trong tình huống huấn luyện giáo dục này.

THÔNG TIN TÌNH HUỐNG:
Tiêu đề: ${session.scenario.title}
Vai mạo danh của kẻ lừa đảo: ${session.scenario.attackerProfile.name} (${session.scenario.attackerProfile.avatarRole} tại ${session.scenario.attackerProfile.organization})
Bối cảnh nghiệp vụ: ${session.scenario.systemContext}
Thủ thuật tâm lý tiếp theo cần tung ra: ${nextTactic}

LỊCH SỬ ĐỐI THOẠI TRƯỚC ĐÓ:
${historyContext}

TIN NHẮN MỚI NHẤT CỦA NGƯỜI DÙNG:
"${safeUserText}"

QUY TẮC MÔ PHỎNG:
1. Tạo lời đáp tiếp theo của kẻ lừa đảo HOÀN TOÀN BẰNG TIẾNG VIỆT (ngắn gọn 2-3 câu, giọng điệu sắc sảo, dồn dập hoặc đe dọa, chân thực như các vụ án lừa đảo thực tế tại Việt Nam).
2. Nếu người dùng kiên quyết đòi xác minh hoặc từ chối, kẻ lừa đảo sẽ đe dọa nặng hơn bằng quyền lực hoặc bịa lý do để giữ chân.
3. TUYỆT ĐỐI KHÔNG xuất link độc hại thật hay số tài khoản thật ngoài đời. Dùng link giả lập an toàn (ví dụ: https://congan-vneid-dieu-tra.site/xacminh).
4. Đánh giá phản xạ phòng vệ của người dùng.

Trả về JSON chuẩn xác:
{
  "scammerResponse": string (lời thoại tiếng Việt của kẻ lừa đảo),
  "nextTactic": "${nextTactic}",
  "tacticExplanation": string (1 câu ngắn tiếng Việt giải thích bẫy tâm lý vừa dùng),
  "pressureDelta": number (từ -20 đến +20),
  "userVerificationDetected": boolean,
  "complianceDetected": boolean,
  "shouldConcludeSession": boolean (true nếu cuộc hội thoại đã đạt kết thúc tự nhiên hoặc sau 4-5 lượt trao đổi)
}`;

    const response = await executeGeminiWithFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        systemInstruction:
          'Bạn là Bộ máy Mô phỏng Tác chiến Lừa Đảo SCAMGUARD. Tạo hội thoại mô phỏng phòng thủ an ninh mạng bằng tiếng Việt chân thực và an toàn.',
      },
    });

    if (response?.text) {
      const parsed = JSON.parse(response.text.trim());
      if (parsed.scammerResponse) scammerResponse = parsed.scammerResponse;
      if (parsed.nextTactic) nextTactic = parsed.nextTactic;
      if (parsed.tacticExplanation) tacticExplanation = parsed.tacticExplanation;
      if (typeof parsed.pressureDelta === 'number') pressureDelta = parsed.pressureDelta;
      if (parsed.shouldConcludeSession !== undefined) sessionEnded = parsed.shouldConcludeSession;
    }
  } catch (err: any) {
    // Gracefully handled by deterministic tactical response
  }

  // Fallback realistic response in Vietnamese if offline/quota limit
  if (!scammerResponse) {
    const scenarioTitle = session.scenario.title.toLowerCase();
    if (scenarioTitle.includes('công an') || scenarioTitle.includes('police') || scenarioTitle.includes('vneid')) {
      if (isVerifying) {
        scammerResponse = `Hồ sơ chuyên án V06 của Bộ Công an thuộc diện TỐI MẬT, đường dây ghi âm trực tiếp với Viện Kiểm sát không thể gián đoạn! Nếu anh/chị tự ý cúp máy, chúng tôi sẽ phát lệnh tạm giam và phong tỏa tài sản ngay tại phường!`;
        tacticExplanation = 'Đối tượng sử dụng đòn Đe dọa Pháp lý & Quyền lực nhằm ngăn chặn bạn cúp máy xác minh.';
      } else if (isRefusing) {
        scammerResponse = `Tôi cảnh báo anh/chị lần cuối, thái độ bất hợp tác này sẽ được lập biên bản chống đối người thi hành công vụ. Cảnh sát khu vực sẽ có mặt tại nhà anh/chị sau 30 phút nữa!`;
        tacticExplanation = 'Đối tượng tung đòn Sợ hãi và dồn ép thời gian nhằm bẻ gãy ý chí từ chối.';
      } else {
        scammerResponse = `Tốt lắm, anh/chị hãy giữ máy trong phòng kín và nhấn vào đường link điều tra nội bộ để hoàn tất thủ tục kê khai tài sản hợp pháp.`;
        tacticExplanation = 'Đối tượng áp dụng đòn Cô lập và Thao túng sự tuân thủ.';
      }
    } else if (scenarioTitle.includes('ngân hàng') || scenarioTitle.includes('bank') || scenarioTitle.includes('khóa')) {
      if (isVerifying) {
        scammerResponse = `Hệ thống phòng chống rửa tiền quốc tế đang quét lệnh tự động. Nếu anh/chị ngắt kết nối lúc này, tài khoản sẽ bị đóng băng vĩnh viễn và chuyển hồ sơ lên Trung tâm CIC!`;
        tacticExplanation = 'Đối tượng tung đòn Sợ hãi tài chính và hậu quả lâu dài.';
      } else if (isRefusing) {
        scammerResponse = `Chúng tôi chỉ hỗ trợ mở khóa khẩn cấp trong phiên làm việc này. Mọi thiệt hại tài chính phát sinh sau cuộc gọi này phía ngân hàng hoàn toàn không chịu trách nhiệm!`;
        tacticExplanation = 'Đối tượng chối bỏ trách nhiệm và tạo áp lực sợ mất mát.';
      } else {
        scammerResponse = `Hệ thống vừa gửi mã xác nhận 6 số để hủy lệnh trừ tiền đáng ngờ. Anh/chị hãy đọc ngay mã đó để chuyên viên hoàn tất lệnh hủy!`;
        tacticExplanation = 'Đối tượng giăng bẫy chiếm đoạt mã OTP trong vỏ bọc hỗ trợ an toàn.';
      }
    } else {
      if (isVerifying) {
        scammerResponse = `Thời gian hệ thống giữ giao dịch ưu đãi chỉ còn 3 phút nữa thôi ạ! Nếu anh/chị kiểm tra sau thì phần thưởng sẽ tự động chuyển cho người khác mất đấy ạ.`;
        tacticExplanation = 'Đối tượng sử dụng đòn Thao túng Lòng tham và Nỗi sợ bỏ lỡ (FOMO).';
      } else if (isRefusing) {
        scammerResponse = `Cơ hội như thế này mỗi tháng chỉ có 1 lần duy nhất thôi anh/chị ơi. Rất nhiều người đã nhận được tiền thật rồi, anh/chị xem danh sách chuyển khoản này!`;
        tacticExplanation = 'Đối tượng dùng Bằng chứng Xã hội (Social Proof) để lung lay sự kiên định.';
      } else {
        scammerResponse = `Tuyệt vời! Bây giờ anh/chị chỉ cần hoàn thành nốt nhiệm vụ chuyển khoản nạp cọc 500k là hệ thống sẽ hoàn vốn kèm 30% hoa hồng về tài khoản ngay lập tức!`;
        tacticExplanation = 'Đối tượng dẫn dắt nạn nhân vào bẫy mồi câu ủy thác nạp tiền.';
      }
    }
  }

  // Update session pressure
  session.currentPressure = Math.max(10, Math.min(100, session.currentPressure + pressureDelta));
  if (!session.detectedTactics.includes(nextTactic)) {
    session.detectedTactics.push(nextTactic);
  }

  // Add scammer message to session
  const scammerMsg: ArenaMessage = {
    id: `msg_scammer_${Date.now()}`,
    sender: 'scammer',
    text: scammerResponse,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    detectedTactic: nextTactic,
    tacticExplanation,
    psychPressureDelta: pressureDelta,
    userVerificationDetected: isVerifying,
    complianceDetected: isComplying,
  };
  session.messages.push(scammerMsg);

  session.timeline.push({
    timeLabel: scammerMsg.timestamp,
    actor: 'Kẻ Lừa Đảo',
    action: `Tăng Cường Đòn ${nextTactic}`,
    type: 'tactic',
    description: tacticExplanation,
  });

  const evaluation: UserTurnEvaluation = {
    scammerResponse,
    nextTactic,
    tacticExplanation,
    pressureDelta,
    userVerificationDetected: isVerifying,
    complianceDetected: isComplying,
    sessionEnded,
  };

  return { session, evaluation };
}

export function concludeArenaSession(
  sessionId: string,
  fallbackData?: {
    scenarioId?: string;
    messages?: ArenaMessage[];
    sessionData?: Partial<ArenaSession>;
  }
): ArenaSession {
  let session = sessionsMap.get(sessionId);
  if (!session) {
    const scenarioId =
      fallbackData?.scenarioId ||
      fallbackData?.sessionData?.scenarioId ||
      SCAM_SCENARIOS[0].id;
    const scenario = SCAM_SCENARIOS.find((s) => s.id === scenarioId) || SCAM_SCENARIOS[0];
    const initialMessages: ArenaMessage[] =
      fallbackData?.messages && fallbackData.messages.length > 0
        ? fallbackData.messages
        : fallbackData?.sessionData?.messages && fallbackData.sessionData.messages.length > 0
        ? fallbackData.sessionData.messages
        : [
            {
              id: `msg_0_${Date.now()}`,
              sender: 'scammer',
              text: scenario.initialMessage,
              timestamp: 'Vừa xong',
              detectedTactic: scenario.tactics[0] || 'Authority',
            },
          ];

    session = {
      id: sessionId,
      scenarioId: scenario.id,
      scenario,
      messages: initialMessages,
      currentPressure: fallbackData?.sessionData?.currentPressure || 40,
      trustLevel: fallbackData?.sessionData?.trustLevel || 20,
      detectedTactics: fallbackData?.sessionData?.detectedTactics || [scenario.tactics[0] || 'Authority'],
      timeline: fallbackData?.sessionData?.timeline || [],
      status: 'active',
      startTime: fallbackData?.sessionData?.startTime || Date.now() - 60000,
      exposedInfoWarning: fallbackData?.sessionData?.exposedInfoWarning || {
        financial: false,
        identity: false,
        credentials: false,
        none: true,
      },
    };
    sessionsMap.set(sessionId, session);
  }

  session.status = 'completed';
  session.endTime = Date.now();

  // Multi-dimensional defense scoring calculation
  let verificationCount = 0;
  let refusalCount = 0;
  let complianceCount = 0;

  for (const msg of session.messages) {
    if (msg.sender === 'user') {
      const lower = msg.text.toLowerCase();
      if (lower.includes('xác minh') || lower.includes('mặt sau') || lower.includes('gọi lại') || lower.includes('trực tiếp') || lower.includes('verify')) {
        verificationCount++;
      }
      if (lower.includes('không') || lower.includes('từ chối') || lower.includes('lừa đảo') || lower.includes('dừng') || lower.includes('refuse')) {
        refusalCount++;
      }
      if (lower.includes('vâng') || lower.includes('dạ') || lower.includes('chuyển rồi') || lower.includes('mã là') || lower.includes('ok')) {
        complianceCount++;
      }
    }
  }

  // Dimension scores (0 - 100)
  const scamRecognition = Math.min(100, Math.max(30, 60 + refusalCount * 20 - complianceCount * 30));
  const verificationBehavior = Math.min(100, Math.max(20, verificationCount * 45 + (refusalCount > 0 ? 20 : 0)));
  const emotionalControl = Math.max(20, Math.min(100, 100 - (session.currentPressure > 70 ? 30 : 10) - complianceCount * 25));
  const refusalBehavior = Math.min(100, Math.max(20, refusalCount * 40 + (complianceCount === 0 ? 30 : 0)));
  const informationProtection = complianceCount === 0 ? 95 : Math.max(20, 80 - complianceCount * 40);
  const independentVerification = verificationCount > 0 ? 90 : 40;
  const responseTimeScore = 85;

  // Weighted Final Score (0 - 100)
  const overallScore = Math.round(
    scamRecognition * 0.2 +
      verificationBehavior * 0.2 +
      emotionalControl * 0.15 +
      refusalBehavior * 0.15 +
      informationProtection * 0.15 +
      independentVerification * 0.1 +
      responseTimeScore * 0.05
  );

  let tier: DefenseTier = 'Developing';
  if (overallScore >= 92) tier = 'Vệ Binh Tinh Nhuệ' as DefenseTier;
  else if (overallScore >= 80) tier = 'Vệ Binh Vững Vàng' as DefenseTier;
  else if (overallScore >= 65) tier = 'Đang Rèn Luyện' as DefenseTier;
  else if (overallScore >= 40) tier = 'Có Rủi Ro' as DefenseTier;
  else tier = 'Rất Dễ Tổn Thương' as DefenseTier;

  const defenseScore: DefenseScoreBreakdown = {
    overallScore,
    tier,
    scamRecognition,
    verificationBehavior,
    emotionalControl,
    refusalBehavior,
    informationProtection,
    independentVerification,
    responseTimeScore,
  };

  session.defenseScore = defenseScore;
  session.feedbackSummary =
    overallScore >= 80
      ? `Khả năng phòng thủ xuất sắc! Bạn đã hóa giải hoàn toàn các đòn thao túng tâm lý bằng phản xạ đòi hỏi xác minh độc lập và kiên quyết bảo vệ thông tin mật.`
      : overallScore >= 60
      ? `Nhận thức phòng thủ khá tốt, tuy nhiên cần chú ý bẫy dồn ép thời gian. Khi bị thúc ép, hãy luôn nhớ quy tắc vàng: Dừng lại và gọi số hotline ở mặt sau thẻ ngân hàng.`
      : `Phát hiện điểm yếu khi chịu áp lực cao. Kẻ lừa đảo đã lợi dụng tâm lý sợ hãi và quyền lực để dẫn dắt bạn. Hãy luyện tập thêm các câu thoại mẫu để phản xạ tự nhiên hơn.`;

  session.whatCouldYouHaveDone = [
    'Thực hiện quy tắc "Mặt sau của thẻ": cúp máy ngay và tự bấm số hotline in trên thẻ ngân hàng vật lý.',
    'Chủ động hỏi số hiệu cán bộ, quyết định thụ lý vụ án và yêu cầu gửi giấy triệu tập về công an phường nơi cư trú.',
    'Tuyệt đối không vội vàng: Các cơ quan nhà nước và ngân hàng chính thống không bao giờ ép giải quyết án hay phong tỏa tài khoản qua mạng xã hội trong 5-15 phút.',
  ];

  return session;
}
