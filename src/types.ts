export type ExperienceMode = 'adult' | 'senior' | 'teen' | 'kids' | 'family' | 'school';

export type Language = 'en' | 'vi' | 'es' | 'zh';

export type AppTheme = 'security_dark' | 'light_calm' | 'senior_high_contrast';

export type ReadingLevel = 'simple' | 'standard' | 'detailed' | 'expert';

export type CommunicationChannel =
  | 'sms'
  | 'email'
  | 'messenger'
  | 'phone'
  | 'marketplace'
  | 'deepfake_voice'
  | 'deepfake_video';

export type ScamTactic =
  | 'Authority'
  | 'Urgency'
  | 'Fear'
  | 'Greed'
  | 'Sympathy'
  | 'Social Proof'
  | 'Isolation'
  | 'Reciprocity'
  | 'Romance'
  | 'Confusion'
  | 'Synthetic Media'
  | 'Convenience Bias';

export type DefenseTier =
  | 'Elite Defender'
  | 'Strong Defender'
  | 'Developing'
  | 'At Risk'
  | 'Highly Vulnerable'
  | 'Vệ Binh Tinh Nhuệ'
  | 'Vệ Binh Vững Vàng'
  | 'Đang Rèn Luyện'
  | 'Có Rủi Ro'
  | 'Rất Dễ Tổn Thương';

export interface DefenseScoreBreakdown {
  overallScore: number; // 0 - 100
  tier: DefenseTier;
  scamRecognition: number; // 0 - 100 (20% weight)
  verificationBehavior: number; // 0 - 100 (20% weight)
  emotionalControl: number; // 0 - 100 (15% weight)
  refusalBehavior: number; // 0 - 100 (15% weight)
  informationProtection: number; // 0 - 100 (15% weight)
  independentVerification: number; // 0 - 100 (10% weight)
  responseTimeScore: number; // 0 - 100 (5% weight)
}

export interface BehavioralMetrics {
  verificationAttempts: number;
  impulsivity: number;
  emotionalResponse: 'calm' | 'anxious' | 'compliant' | 'skeptical';
  authorityCompliance: number;
  urgencyCompliance: number;
  moneyProtection: number;
  privacyProtection: number;
  refusalStrength: number;
  secrecyAcceptance: number;
}

export interface ScenarioHint {
  level: 1 | 2 | 3;
  text: string;
}

export interface CounterScript {
  situation: string;
  recommendedText: string;
  rationale: string;
}

export interface ScamScenario {
  id: string;
  title: string;
  subtitle: string;
  category: 'Banking' | 'Government' | 'Delivery' | 'Jobs' | 'Investment' | 'Romance' | 'Deepfake' | 'Marketplace' | 'Family Emergency';
  channel: CommunicationChannel;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  estimatedMinutes: number;
  ageGroup: 'All' | 'Kids' | 'Teens' | 'Adults' | 'Seniors';
  targetPersona: string;
  attackerProfile: {
    name: string;
    avatarRole: string;
    organization: string;
    contactHandle: string;
  };
  initialMessage: string;
  systemContext: string;
  tactics: ScamTactic[];
  hints: ScenarioHint[];
  counterScripts: CounterScript[];
  learningObjectives: string[];
}

export interface ArenaMessage {
  id: string;
  sender: 'scammer' | 'user' | 'system';
  text: string;
  timestamp: string;
  detectedTactic?: ScamTactic;
  tacticExplanation?: string;
  psychPressureDelta?: number;
  userVerificationDetected?: boolean;
  complianceDetected?: boolean;
}

export interface ArenaTimelineEvent {
  timeLabel: string;
  actor: 'Scammer' | 'You' | 'Kẻ Lừa Đảo' | 'Bạn' | string;
  action: string;
  type: 'tactic' | 'verification' | 'danger' | 'success';
  description: string;
}

export interface ArenaSession {
  id: string;
  scenarioId: string;
  scenario: ScamScenario;
  messages: ArenaMessage[];
  currentPressure: number; // 0 - 100
  trustLevel: number; // 0 - 100
  defenseScore?: DefenseScoreBreakdown;
  detectedTactics: ScamTactic[];
  timeline: ArenaTimelineEvent[];
  status: 'active' | 'completed' | 'abandoned';
  startTime: number;
  endTime?: number;
  feedbackSummary?: string;
  whatCouldYouHaveDone?: string[];
  exposedInfoWarning?: {
    financial: boolean;
    identity: boolean;
    credentials: boolean;
    none: boolean;
  };
}

export interface QuishingCase {
  id: string;
  title: string;
  category: 'Banking' | 'Delivery' | 'Parking & EV' | 'Restaurant' | 'Wi-Fi & Travel' | 'Government' | 'E-commerce' | 'Utilities' | 'Charity' | 'Crypto';
  physicalContext: string;
  simulatedQrDestination: string;
  visibleUrl: string;
  actualRegistrableDomain: string;
  isScam: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Nightmare';
  redFlags: string[];
  urlDissection: {
    protocol: string;
    subdomain: string;
    registeredDomain: string;
    path: string;
    deceptiveElement: string;
  };
  explanation: string;
  educationalTip: string;
}

export interface DeepfakeCase {
  id: string;
  title: string;
  category: 'Relative Voice' | 'Police Authority' | 'Bank Executive' | 'Celebrity Investment' | 'HR Video Call';
  mediaType: 'voice' | 'video';
  scenarioText: string;
  callerInfo: string;
  audioSampleDescription: string;
  isSynthetic: boolean;
  artifactsDetected: string[];
  tacticUsed: ScamTactic;
  detectionClues: string[];
  recommendedResponse: string;
}

export interface QuickDrillQuestion {
  id: string;
  title: string;
  channel: CommunicationChannel;
  sender: string;
  message: string;
  isScam: boolean;
  tacticsPresent: ScamTactic[];
  correctAction: string;
  alternativeOptions: {
    label: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  explanation: string;
}

export interface RiskSignal {
  name: string;
  scoreContribution: number;
  description: string;
  category: 'Urgency' | 'Financial' | 'Impersonation' | 'Domain' | 'Privacy' | 'Emotional Manipulation';
}

export interface AnalysisResult {
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';
  riskScore: number; // 0 - 100
  signals: RiskSignal[];
  summary: string;
  detectedTactics: ScamTactic[];
  explanationsByPersona: {
    child: string;
    teen: string;
    adult: string;
    senior: string;
    expert: string;
  };
  redFlags: string[];
  recommendedSteps: string[];
  whatWasAlmostExposed?: string[];
  piiRedacted: boolean;
  threatBreakdown?: {
    maliciousUrl: number;
    impersonation: number;
    urgency: number;
    credentialHarvesting: number;
    socialEngineering: number;
  };
  evidenceFound?: {
    severity: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    snippet?: string;
    description: string;
  }[];
  threatClassification?: {
    primaryThreat: string;
    attackVector: string;
    target: string;
    potentialImpact: string[];
    confidence: number;
  };
  attackChain?: string[];
  urlAnalysis?: {
    domain: string;
    anomalyDetected: boolean;
    httpsEnabled: boolean;
    domainAgeStatus: string;
    brandImpersonationRisk: 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';
    redirectDetected: boolean;
    urlRiskScore: number;
  };
  senderAnalysis?: {
    identity: string;
    reportedActivity?: string;
    pattern: string;
    associatedThreats: string[];
    senderRiskScore: number;
  };
  assessmentId?: string;
  isInvalidBankImage?: boolean;
  invalidImageReason?: string;
}

export type ScamDnaDimensionKey =
  | 'authority'
  | 'urgency'
  | 'fear'
  | 'greed'
  | 'privacy_credential'
  | 'isolation'
  | 'verification_reflex'
  | 'quishing_domain'
  | 'emotional_stability'
  | 'deepfake_ai';

export interface ScamDnaDimensionDetail {
  key: ScamDnaDimensionKey;
  label: string;
  vietnameseName: string;
  score: number; // 0 - 100
  communityAverage: number; // 0 - 100
  level: 'OPTIMAL' | 'MODERATE' | 'VULNERABLE' | 'CRITICAL';
  vulnerabilityRatio: number;
  psychologicalTrigger: string;
  behavioralSymptom: string;
  improvementMantra: string;
  recommendedAction: string;
  recommendedScenarioId: string;
  color: string;
}

export interface DefenseArchetype {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  primaryStrength: string;
  blindspotAlert: string;
  iconName: string;
  tagColor: string;
}

export interface CommunityScamDna {
  totalParticipants: number;
  lastUpdated: string;
  overallCommunityAverage: number;
  percentileRank: number; // e.g. 84th percentile
  dimensionAverages: Record<ScamDnaDimensionKey, number>;
  scamDnaVector?: { T: number; A: number; G: number; E: number; C: number; R: number };
  topVulnerabilitiesNational: {
    key: ScamDnaDimensionKey;
    label: string;
    vulnerabilityRate: number; // e.g. 68.4%
    description: string;
    trend: 'rising' | 'stable' | 'declining';
  }[];
  demographicBreakdown: {
    group: string;
    averageScore: number;
    sampleCount: number;
    criticalWeakness: string;
    color: string;
  }[];
  trendingThreatsMonth: {
    name: string;
    impactPercentage: number;
    description: string;
    dangerLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  }[];
}

export interface ScamDnaHistoryDataPoint {
  date: string; // e.g. "14/08"
  fullDate: string; // e.g. "14/08/2026"
  dayIndex: number; // 1 - 30
  overallScore: number; // SDI Defense Score 0 - 100
  riskScore: number; // Risk Index = 100 - overallScore (0 - 100)
  psychologyScore: number;
  technicalScore: number;
  financialScore: number;
  communityAverage: number;
  milestoneEvent?: {
    title: string;
    description: string;
    xpEarned?: number;
    badgeUnlocked?: string;
    category: 'drill' | 'arena' | 'quishing' | 'deepfake' | 'streak';
  };
}

export interface ScamDnaProfile {
  overallScore: number;
  tier: DefenseTier;
  archetype: DefenseArchetype;
  dimensions: ScamDnaDimensionDetail[];
  tacticRatings: Record<ScamTactic, number>; // 0 - 100
  strongestTactics: { tactic: ScamTactic; score: number; reason: string }[];
  weakestTactics: { tactic: ScamTactic; score: number; reason: string; recommendedScenarioId: string }[];
  historicalScores: { date: string; score: number; communityAverage: number }[];
  historicalTrend30Days?: ScamDnaHistoryDataPoint[];
  totalSessionsCompleted: number;
  quishingAccuracy: number;
  drillsCompleted: number;
  currentStreakDays: number;
  totalXp: number;
  criticalBlindspots: {
    dimension: string;
    score: number;
    gapWithCommunity: number;
    dangerSummary: string;
    scenarioId: string;
    scenarioTitle: string;
  }[];
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'beginner' | 'mastery' | 'streak' | 'forensics';
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
}

export type MilestoneTierId = 'novice' | 'adept' | 'expert' | 'guardian' | 'legend';

export interface SecurityMilestone {
  id: MilestoneTierId;
  name: string;
  vietnameseTitle: string;
  scoreThreshold: number; // e.g. 30, 60, 80, 92, 98
  badgeLabel: string;
  tagline: string;
  description: string;
  iconName: string;
  colorTheme: {
    primary: string;
    border: string;
    bgGlow: string;
    badgeBg: string;
    text: string;
    accent: string;
    ringColor: string;
  };
  perks: string[];
  xpReward: number;
  unlockedLore: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  phoneOrHandle: string;
  isFavorite: boolean;
}

export interface UserProfile {
  id?: string;
  name: string;
  mode: ExperienceMode;
  language?: Language;
  theme?: AppTheme;
  readingLevel?: ReadingLevel;
  overallScore?: number;
  streakDays?: number;
  completedScenarios?: string[];
  voiceNarrationEnabled?: boolean;
  highContrastEnabled?: boolean;
  largeTextEnabled?: boolean;
  trustedContacts?: TrustedContact[];
  xp?: number;
  level?: number;
  dailyChallengeCompleted?: boolean;
  lastDailyChallengeDate?: string;
  email?: string;
  username?: string;
  avatarUrl?: string;
  provider?: 'local' | 'google' | 'facebook' | 'github' | 'demo' | 'firebase';
  createdAt?: string;
}

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider: 'local' | 'google' | 'facebook' | 'github' | 'demo' | 'firebase';
  profile: UserProfile;
  token: string;
  createdAt: string;
}

export interface LoginPayload {
  usernameOrEmail: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  username: string;
  email?: string;
  password?: string;
  mode?: ExperienceMode;
}

export interface SocialAuthPayload {
  provider: 'google' | 'facebook' | 'github';
  name?: string;
  email?: string;
  avatarUrl?: string;
  mode?: ExperienceMode;
}

export interface AuthResponse {
  success: boolean;
  user?: UserAccount;
  error?: string;
  token?: string;
}

export interface FriendUser {
  id: string;
  friendCode: string;
  name: string;
  username: string;
  avatarUrl: string;
  overallScore: number;
  xp: number;
  level: number;
  streakDays: number;
  mode: ExperienceMode;
  isOnline: boolean;
  lastActive: string;
  giftReceivedToday?: boolean;
  giftSentToday?: boolean;
  isFavorite?: boolean;
  shieldsCount?: number;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
  socialImpactScore?: number;
}

export type ReactionType = 'like' | 'love' | 'shield' | 'warning' | 'haha';

export interface SocialComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likesCount: number;
  likedByMe?: boolean;
}

export interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userBadge?: string;
  userMode?: ExperienceMode;
  isVerified?: boolean;
  followersCount: number;
  isFollowing?: boolean;
  content: string;
  mediaUrl?: string;
  scamCategory?: string;
  timestamp: string;
  reactions: {
    like: number;
    love: number;
    shield: number;
    warning: number;
    haha: number;
  };
  myReaction?: ReactionType;
  sharesCount: number;
  commentsCount: number;
  comments: SocialComment[];
  isSosAlert?: boolean;
  dnaScore?: number;
}

export interface FriendGift {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  toUserId: string;
  type: 'shield' | 'xp' | 'energy';
  amount: number;
  message: string;
  timestamp: string;
  claimed: boolean;
}

export interface FriendDuelQuestion {
  id: string;
  title: string;
  scenario: string;
  sender: string;
  isScam: boolean;
  tactics: ScamTactic[];
  options: { label: string; isCorrect: boolean; points: number }[];
  explanation: string;
  redFlags: string[];
}

export interface FriendDuelChallenge {
  id: string;
  challengerId: string;
  challengerName: string;
  challengerAvatar: string;
  challengerScore: number;
  challengerTimeSeconds: number;
  targetUserId: string;
  targetUserName: string;
  targetAvatar?: string;
  targetScore?: number;
  targetTimeSeconds?: number;
  status: 'pending' | 'completed' | 'declined';
  winnerId?: string;
  questions: FriendDuelQuestion[];
  createdAt: string;
}

export interface FriendActivityEvent {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userMode: ExperienceMode;
  actionType: 'quishing_won' | 'boss_defeated' | 'streak_record' | 'deepfake_solved' | 'level_up' | 'sos_shared' | 'duel_won';
  title: string;
  description: string;
  timestamp: string;
  likesCount: number;
  likedByMe?: boolean;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  category: 'check' | 'arena' | 'quishing' | 'friends' | 'streak';
  icon: string;
  current: number;
  target: number;
  completed: boolean;
  claimed: boolean;
  xpReward: number;
}

export interface MysteryChestReward {
  id: string;
  type: 'xp' | 'shield' | 'lens' | 'badge';
  name: string;
  description: string;
  icon: string;
  amount: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'extralarge';
  highContrast: boolean;
  soundEnabled: boolean;
  voiceNarration: boolean;
}

export interface MonthlyAccuracyDataPoint {
  month: string;
  label: string;
  accuracy: number;
  scamsTested: number;
  scamsBlocked: number;
  avgResponseSeconds: number;
  highlightMilestone?: string;
}

export interface MonthlyCategoryProgress {
  category: string;
  icon: string;
  previousAccuracy: number;
  currentAccuracy: number;
  improvementDelta: number;
  threatsEncountered: number;
  status: 'mastered' | 'improving' | 'needs_practice';
  description: string;
}

export interface MonthlySecurityReport {
  id: string;
  reportMonth: string;
  monthCode: string; // '2026-09', '2026-08', '2026-07'
  generatedDate: string;
  overallAccuracy: number;
  previousMonthAccuracy: number;
  accuracyDelta: number;
  totalThreatsAnalyzed: number;
  correctDetections: number;
  falsePositivesOrNegatives: number;
  avgResponseTimeSec: number;
  responseTimeImprovementSec: number;
  defenseRating: string;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C';
  streakConsistency: number;
  historicalAccuracy: MonthlyAccuracyDataPoint[];
  categoryBreakdown: MonthlyCategoryProgress[];
  keyHighlights: string[];
  recommendedFocus: string[];
  aiAnalysisSummary: string;
}

// ==========================================
// SCIENTIFIC RESEARCH & VISEF / ISEF TYPES
// ==========================================

export type ScenarioSourceType = 'SYNTHETIC_GENERATED' | 'REAL_ANONYMIZED' | 'OFFICIAL_GOV_REPORT' | 'CONTROL_BENCHMARK';
export type ScenarioValidationStatus = 'EXPERT_VALIDATED' | 'PEER_REVIEWED' | 'PROVISIONAL';

export interface DatasetScenarioProvenance {
  origin: string;
  creationMethod: string;
  annotationProtocol: string;
  piiRedactionVerified: boolean;
  licenseTerms: string;
  syntheticLabel: 'Synthetic Training Scenario' | 'Real-world Anonymized Case';
}

export interface ResearchDatasetScenario {
  id: string;
  split: 'train' | 'pre_test' | 'post_test' | 'test_unseen' | 'delayed_retention';
  language: 'vi' | 'en';
  category: string;
  isScam: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Stress-Test';
  vulnerabilityTarget: string;
  urgencyLevel: number;
  authorityLevel: number;
  financialPressure: number;
  emotionalPressure: number;
  title: string;
  senderProfile: string;
  channel: 'SMS' | 'Email' | 'Messenger' | 'Phone' | 'Telegram' | 'Zalo' | 'QR' | 'Voice Call' | 'Video Call' | 'Web';
  sampleContent: string;
  requestedAction: string;
  sensitiveDataRequested: string[];
  psychologicalTactics: string[];
  riskIndicators: string[];
  hasMaliciousLink: boolean;
  hasQr: boolean;
  expectedSafeAction: string;
  counterTacticRationale: string;
  sourceType: ScenarioSourceType;
  validationStatus: ScenarioValidationStatus;
  provenance: DatasetScenarioProvenance;
}

export interface MachineLearningBenchmarkModel {
  id: string;
  name: string;
  type: 'Rule-Based Baseline' | 'Logistic Regression' | 'Random Forest' | 'Gradient Boosted Trees (GBDT)' | 'Distil-Text Classifier' | 'Hybrid LLM Reasoning Classifier';
  accuracy: number; // 0 - 100
  precision: number; // 0 - 100
  recall: number; // 0 - 100
  f1Score: number; // 0 - 100
  rocAuc: number; // 0.5 - 1.0
  brierScore: number; // Lower is better calibrated (0 - 1)
  latencyMs: number; // Inference latency
  resourceFootprint: 'Ultra-low (0.1MB)' | 'Low (1.5MB)' | 'Medium (12MB)' | 'Medium-High (45MB)' | 'High (Server API)';
  explainabilityRating: 'Rule Transparent' | 'Feature Weights' | 'Feature Importance (SHAP)' | 'Feature Importance (Gini)' | 'Attention / Tokens' | 'Full Chain-of-Thought';
  strengths: string[];
  tradeoffs: string[];
}

export interface ConfigurableRiskWeights {
  wTechnical: number; // 0 - 1
  wBehavioral: number; // 0 - 1
  wPsychological: number; // 0 - 1
  wIdentityAuthority: number; // 0 - 1
  wFinancial: number; // 0 - 1
}

export interface ErrorTaxonomyItem {
  id: string;
  rootCause: 'OVERTRUST_AUTHORITY' | 'IGNORED_DOMAIN_ANOMALY' | 'URGENCY_PANIC_OVERLOAD' | 'CREDENTIAL_OTP_SURRENDER' | 'SUPERFICIAL_VISUAL_BIAS' | 'FINANCIAL_GREED_BLINDNESS' | 'SYNTHETIC_MEDIA_UNAWARE';
  vietnameseTitle: string;
  description: string;
  frequencyPercentage: number;
  averageDecisionLatencySec: number;
  associatedDemographicRisk: string;
  recommendedPedagogicalMitigation: string;
}

export interface NonParametricTestResult {
  testName: string;
  testStatistic: number;
  pValue: number;
  significant: boolean;
  interpretation: string;
  assumptionsMet: boolean;
}

export interface CorrelationMatrixItem {
  dimensionKey: string;
  dimensionName: string;
  targetScamCategory: string;
  pearsonR: number;
  spearmanRho: number;
  pValue: number;
  interpretation: string;
}

export type SurveyDemographicGroup =
  | 'STUDENT'
  | 'OFFICE_WORKER'
  | 'ELDERLY'
  | 'BUSINESS_OWNER'
  | 'TEACHER_JUDGE';

export type GradeLevel = 'Khối 10' | 'Khối 11' | 'Khối 12' | 'Khác / Giáo viên';
export type GenderGroup = 'Nam' | 'Nữ' | 'Khác' | 'Không muốn trả lời';
export type SafetyTrainingStatus = 'Có' | 'Không';

export interface EightQuestionSurveyAnswers {
  q1: 'A' | 'B' | 'C' | 'D'; // 1. Từng gặp hình thức lừa đảo trực tuyến chưa
  q2: 'A' | 'B' | 'C' | 'D'; // 2. Từng bị lừa đảo ở mức độ nào
  q3: 'A' | 'B' | 'C' | 'D'; // 3. Thường gặp qua kênh nào nhất
  q4: 'A' | 'B' | 'C' | 'D'; // 4. Hình thức lừa đảo gặp nhiều nhất
  q5: 'A' | 'B' | 'C' | 'D'; // 5. Hành động đầu tiên khi nhận tin đáng ngờ
  q6: 'A' | 'B' | 'C' | 'D'; // 6. Tự đánh giá khả năng nhận biết
  q7: 'A' | 'B' | 'C' | 'D'; // 7. Phản ứng khi bị yêu cầu OTP / Mật khẩu
  q8: 'A' | 'B' | 'C' | 'D'; // 8. Nhu cầu luyện tập mô phỏng SCAMGUARD
}

export interface CommunitySurveySubmission {
  id: string;
  participantName: string;
  demographicGroup: SurveyDemographicGroup;
  location?: string;
  isAnonymous?: boolean;
  anonymousCode?: string;
  schoolName?: string;
  className?: string;
  consentAgreed?: boolean;
  // 3 School ViSEF Demographics
  gradeLevel?: GradeLevel;
  gender?: GenderGroup;
  safetyTraining?: SafetyTrainingStatus;
  // Standardized 8-question answers
  eightQuestionAnswers?: EightQuestionSurveyAnswers;
  surveyResponses: {
    everEncounteredScam: boolean;
    pastLossOrNearMiss: 'LOST_MONEY' | 'SHARED_OTP_PASSWORD' | 'CLICKED_SUSPICIOUS_LINK' | 'SPOTTED_IN_TIME' | 'NEVER';
    preConfidenceScore: number; // 1-100
    biggestFearTactic: 'AUTHORITY_POLICE' | 'URGENT_ACCIDENT' | 'FAKE_BILL_QR' | 'TELEGRAM_INCOME' | 'DEEPFAKE_CALL';
    verificationHabitPre: 'IMMEDIATE_ACTION' | 'ASK_FRIENDS' | 'DOUBLE_CHECK_OFFICIAL' | 'CONFUSED';
    timeToDecidePreSec: number;
  };
  testOutcome: {
    preScore: number;
    postScore: number;
    unseenScore: number;
    unsafeActionAvoided: boolean;
    timeToDecidePostSec: number;
    scamDnaShift: {
      before: Record<string, number>;
      after: Record<string, number>;
    };
  };
  feedbackNote?: string;
  createdAt: string;
}

export interface SurveyAnalyticsData {
  totalRespondents: number;
  demographicBreakdown: Array<{
    groupKey: SurveyDemographicGroup;
    label: string;
    count: number;
    percentage: number;
    meanPreScore: number;
    meanPostScore: number;
    meanGain: number;
    meanUnsafeRatePre: number;
    meanUnsafeRatePost: number;
  }>;
  // ViSEF School Survey Specialized Analytics
  schoolResearchFunnel?: {
    encounteredRatePct: number;
    nearMissOrVictimPct: number;
    topChannel: string;
    topChannelPct: number;
    topTactic: string;
    topTacticPct: number;
    selfConfidenceGoodPct: number;
    demandForPlatformPct: number;
    otpDefenseStrictPct: number;
  };
  schoolDemographicsBreakdown?: {
    grade10Count: number;
    grade11Count: number;
    grade12Count: number;
    teacherCount: number;
    maleCount: number;
    femaleCount: number;
    trainedCount: number;
    untrainedCount: number;
    trainedOtpStrictPct: number;
    untrainedOtpStrictPct: number;
    trainedEncounteredPct: number;
    untrainedEncounteredPct: number;
  };
  eightQuestionBreakdown?: {
    q1: Record<'A' | 'B' | 'C' | 'D', number>;
    q2: Record<'A' | 'B' | 'C' | 'D', number>;
    q3: Record<'A' | 'B' | 'C' | 'D', number>;
    q4: Record<'A' | 'B' | 'C' | 'D', number>;
    q5: Record<'A' | 'B' | 'C' | 'D', number>;
    q6: Record<'A' | 'B' | 'C' | 'D', number>;
    q7: Record<'A' | 'B' | 'C' | 'D', number>;
    q8: Record<'A' | 'B' | 'C' | 'D', number>;
  };
  preAppBaselineStats: {
    encounteredScamPct: number;
    clickedLinkOrCompromisedPct: number;
    sharedOtpOrMoneyLossPct: number;
    panickedByAuthorityOrUrgencyPct: number;
    avgInitialDefenseScore: number;
    avgInitialLatencySec: number;
  };
  postAppInterventionStats: {
    avgPostDefenseScore: number;
    avgScoreGainPct: number;
    safeActionSuccessPct: number;
    avgPostLatencySec: number;
    cognitiveFrictionMultiplier: number;
    unseenScenarioPassPct: number;
  };
  fearTacticsDistribution: Array<{
    tacticKey: string;
    tacticLabel: string;
    percentage: number;
    count: number;
  }>;
  verificationHabitsPre: Array<{
    habitKey: string;
    habitLabel: string;
    percentage: number;
    count: number;
  }>;
  scamDnaComparativeRadar: Array<{
    dimensionKey: string;
    dimensionName: string;
    preAppVulnerability: number; // 0 - 100
    postAppVulnerability: number; // 0 - 100
    reductionPct: number;
  }>;
  recentSurveys: CommunitySurveySubmission[];
}

export interface SampleSizeCalculatorParams {
  expectedEffectSize: number; // Cohen's d (e.g. 0.5, 0.8)
  alphaLevel: number; // e.g. 0.05
  statisticalPower: number; // 1 - beta (e.g. 0.80, 0.90)
  numGroups: number; // e.g. 3
  expectedDropoutRatePct: number; // e.g. 15%
}

export interface SampleSizeCalculatorResult {
  requiredNPerGroup: number;
  totalRequiredN: number;
  totalRecommendedWithDropoutN: number;
  criticalFValue: number;
  actualPower: number;
  explanation: string;
}

export interface ExclusionLogEntry {
  id: string;
  participantId: string;
  timestamp: string;
  reason: 'IMPOSSIBLE_RESPONSE_TIME' | 'STRAIGHT_LINING' | 'INCOMPLETE_ATTITUDE' | 'DUPLICATE_SUBMISSION' | 'PROTOCOL_EXCEPTION';
  details: string;
  flaggedBy: 'AUTOMATED_QUALITY_BOT' | 'RESEARCHER_AUDIT';
  actionTaken: 'EXCLUDED_FROM_ANALYSIS' | 'KEPT_WITH_FLAG' | 'PENDING_REVIEW';
}

export interface DataQualityMetrics {
  totalRecords: number;
  validRecords: number;
  excludedRecords: number;
  exclusionRatePct: number;
  duplicatesCount: number;
  speedersCount: number;
  straightLinersCount: number;
  incompleteCount: number;
  datasetVersion: string;
  lastAuditTimestamp: string;
}

export interface LiteratureCitation {
  id: string;
  authors: string;
  year: number;
  title: string;
  journalOrVenue: string;
  doi?: string;
  url?: string;
  claimSupported: string;
  evidenceCategory: 'ESTABLISHED_THEORY' | 'EMPIRICAL_BENCHMARK' | 'METHODOLOGICAL_STANDARD' | 'OUR_HYPOTHESIS';
}

export interface JudgeQuestionItem {
  id: string;
  category: 'NOVELTY' | 'SCAM_DNA' | 'EXPERIMENTAL_DESIGN' | 'STATISTICS' | 'GENERALIZABILITY' | 'LIMITATIONS' | 'AI_RELIABILITY';
  question: string;
  shortAnswerKey: string;
  detailedDefenseAnswer: string;
  supportingEvidenceLocation: string;
  confidenceRating: 'HIGH' | 'VERY_HIGH';
}

export interface MultipleComparisonCorrectionResult {
  testName: string;
  uncorrectedPValue: number;
  method: 'Bonferroni' | 'Holm-Bonferroni' | 'FDR (Benjamini-Hochberg)';
  adjustedPValue: number;
  significantAfterCorrection: boolean;
}

export interface StatisticalTestRecommendation {
  researchQuestion: string;
  dataType: 'CONTINUOUS_NORMAL' | 'CONTINUOUS_NON_NORMAL' | 'CATEGORICAL_COUNTS' | 'LONGITUDINAL_PAIRED';
  recommendedTest: string;
  rationale: string;
  alternativeNonParametric: string;
}

export interface CronbachAlphaReport {
  dimensionKey: string;
  dimensionName: string;
  numItems: number;
  sampleSize: number;
  cronbachAlpha: number | null; // null if N < 30
  mcdonaldOmega: number | null;
  status: 'VALIDATED_REAL_DATA' | 'INSUFFICIENT_REAL_DATA_REQUIRED';
  itemTotalCorrelations: Array<{ itemId: string; itemText: string; correlation: number }>;
}




