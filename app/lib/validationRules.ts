
// 🚀 완전히 단순화된 검증 시스템 - Simplified Validation Engine
export interface ValidationResult {
  isValid: boolean;
  level: 'error' | 'warning' | 'info';
  field: string;
  message: string;
  suggestions: string[];
  autoFix?: {
    action: string;
    value: any;
  };
}

export interface ValidationContext {
  step: number;
  formData: any;
  previousSteps: any[];
}

// 🎯 서비스 타입별 세분화된 목적 카테고리 정의
export const purposeCategories = {
  video: [
    {
      id: 'marketing-promotion',
      title: '홍보·마케팅',
      purposes: ['브랜드 스토리 영상', '제품 소개 영상', '서비스 홍보 영상', '고객 후기 영상', 'SNS 마케팅 영상', '광고 캠페인 영상', '바이럴 마케팅 영상', '런칭 이벤트 영상'],
      keywords: ['홍보', '마케팅', '브랜드', '제품', '서비스', '판매', '고객']
    },
    {
      id: 'education-guidance', 
      title: '교육·안내',
      purposes: ['직원 교육 영상', '고객 교육 영상', '제품 사용법 영상', '안전 교육 영상', '온보딩 영상', '매뉴얼 영상', '프로세스 안내 영상', '튜토리얼 영상'],
      keywords: ['교육', '훈련', '안전', '가이드', '매뉴얼', '설명', '안내']
    },
    {
      id: 'event-recording',
      title: '행사·이벤트', 
      purposes: ['세미나 기록 영상', '컨퍼런스 영상', '제품 런칭 영상', '시상식 영상', '페스티벌 영상', '전시회 영상', '워크숍 영상', '기념행사 영상'],
      keywords: ['행사', '이벤트', '축하', '시상', '페스티벌', '전시']
    },
    {
      id: 'corporate-business',
      title: '기업·조직',
      purposes: ['채용 홍보 영상', '기업 소개 영상', 'IR 발표 영상', '내부 소통 영상', '기업문화 영상', '협력사 소개 영상', 'CEO 메시지 영상', '성과 발표 영상'],
      keywords: ['기업', '채용', '투자', 'IR', '소통', '문화', '협력']
    },
    {
      id: 'creative-personal',
      title: '창작·개인',
      purposes: ['다큐멘터리 영상', '예술 창작 영상', '개인 포트폴리오 영상', '웨딩 영상', '가족 기념 영상', '여행 영상', '라이프스타일 영상', '개인 브랜딩 영상'],
      keywords: ['기록', '다큐', '예술', '창작', '개인', '웨딩', '가족']
    }
  ],
  design: [
    {
      id: 'brand-identity',
      title: '브랜드 아이덴티티',
      purposes: ['로고 디자인', '브랜드 가이드라인', 'CI/BI 디자인', '브랜드 리뉴얼', '네이밍 디자인', '브랜드 스토리텔링', '브랜드 일관성 관리', '브랜드 포지셔닝'],
      keywords: ['브랜드', '로고', 'CI', 'BI', '가이드라인']
    },
    {
      id: 'print-design',
      title: '인쇄물 디자인',
      purposes: ['카드뉴스 디자인', '리플렛 디자인', '브로슈어 디자인', '포스터 디자인', '명함 디자인', '카탈로그 디자인', '전단지 디자인', '배너 디자인', '스티커 디자인', '패키지 디자인'],
      keywords: ['카드뉴스', '리플렛', '브로슈어', '포스터', '인쇄물']
    },
    {
      id: 'digital-design',
      title: '디지털 디자인',
      purposes: ['웹사이트 디자인', '모바일 앱 UI/UX', '웹 배너 디자인', 'SNS 콘텐츠 디자인', '이메일 템플릿', '온라인 광고 소재', '디지털 카탈로그', '인터랙티브 미디어'],
      keywords: ['웹', '앱', 'UI', 'UX', '디지털', 'SNS']
    },
    {
      id: 'marketing-design',
      title: '마케팅 디자인',
      purposes: ['광고 크리에이티브', '캠페인 비주얼', '프로모션 디자인', '이벤트 디자인', '전시 부스 디자인', '매장 VMD', '옥외광고 디자인', 'POP 디자인'],
      keywords: ['광고', '캠페인', '프로모션', '이벤트', '매장']
    },
    {
      id: 'editorial-design',
      title: '편집 디자인',
      purposes: ['잡지 디자인', '책 편집 디자인', '연차보고서', '제안서 디자인', '프레젠테이션 템플릿', '뉴스레터 디자인', '백서 디자인', '사업계획서 디자인'],
      keywords: ['편집', '잡지', '책', '보고서', '제안서']
    }
  ],
  marketing: [
    {
      id: 'digital-marketing',
      title: '디지털 마케팅',
      purposes: ['검색엔진 마케팅(SEM)', '검색엔진 최적화(SEO)', '구글 애즈 광고', '네이버 광고', '디스플레이 광고', '리타겟팅 광고', '어피니티 마케팅', '퍼포먼스 마케팅'],
      keywords: ['디지털', 'SEM', 'SEO', '구글', '네이버', '광고']
    },
    {
      id: 'social-media',
      title: 'SNS 마케팅',
      purposes: ['인스타그램 관리', '페이스북 마케팅', '유튜브 채널 관리', '틱톡 마케팅', '네이버 블로그 관리', '카카오톡 채널', '링크드인 마케팅', '트위터 마케팅', '인플루언서 마케팅'],
      keywords: ['SNS', '인스타그램', '페이스북', '유튜브', '블로그']
    },
    {
      id: 'content-marketing',
      title: '콘텐츠 마케팅',
      purposes: ['블로그 콘텐츠 제작', '웹진 콘텐츠', '뉴스레터 발행', '팟캐스트 기획', '웨비나 기획', '온라인 이벤트', '바이럴 콘텐츠', '스토리텔링 마케팅'],
      keywords: ['콘텐츠', '블로그', '웹진', '뉴스레터', '웨비나']
    },
    {
      id: 'strategy-planning',
      title: '마케팅 전략',
      purposes: ['마케팅 전략 수립', '시장 조사 및 분석', '경쟁사 분석', '타겟 고객 분석', '브랜드 포지셔닝', 'SWOT 분석', '마케팅 믹스 전략', '론칭 전략'],
      keywords: ['전략', '기획', '분석', '시장조사', '브랜딩']
    },
    {
      id: 'data-analytics',
      title: '데이터 분석',
      purposes: ['웹 분석 및 리포팅', 'GA4 분석', '소셜미디어 분석', '광고 성과 분석', '고객 데이터 분석', 'A/B 테스트', 'ROI 측정', '마케팅 대시보드'],
      keywords: ['데이터', '분석', '리포팅', 'GA4', 'ROI']
    },
    {
      id: 'offline-marketing',
      title: '오프라인 마케팅',
      purposes: ['이벤트 마케팅', '전시회 마케팅', '매장 마케팅', 'PR 및 홍보', '미디어 바이잉', '옥외광고', '인쇄광고', '라디오/TV 광고'],
      keywords: ['오프라인', '이벤트', '전시회', 'PR', '매체']
    }
  ]
};

// 🚀 단순화된 AI 추천 시스템
export const getAIRecommendations = (inputText: string): {
  recommendations: Array<{
    purpose: string;
    confidence: number;
    reason: string;
  }>;
  analysisResult: {
    detectedCategories: string[];
    primaryContext: string;
    suggestedApproach: string;
  };
} => {
  if (!inputText.trim()) {
    return {
      recommendations: [],
      analysisResult: {
        detectedCategories: [],
        primaryContext: '',
        suggestedApproach: ''
      }
    };
  }

  const lowerInput = inputText.toLowerCase();
  const recommendations = [];

  // 단순한 키워드 매칭
  if (lowerInput.includes('안전') || lowerInput.includes('교육') || lowerInput.includes('훈련')) {
    recommendations.push({
      purpose: '안전 교육 영상',
      confidence: 0.9,
      reason: '안전 및 교육 키워드 감지'
    });
    recommendations.push({
      purpose: '직원 교육 영상',
      confidence: 0.8,
      reason: '교육 관련 키워드 감지'
    });
  }
  
  if (lowerInput.includes('홍보') || lowerInput.includes('마케팅') || lowerInput.includes('브랜드')) {
    recommendations.push({
      purpose: '브랜드 스토리 영상',
      confidence: 0.8,
      reason: '마케팅 키워드 감지'
    });
  }

  if (lowerInput.includes('행사') || lowerInput.includes('이벤트')) {
    recommendations.push({
      purpose: '세미나 기록 영상',
      confidence: 0.7,
      reason: '이벤트 키워드 감지'
    });
  }

  return {
    recommendations: recommendations.slice(0, 3),
    analysisResult: {
      detectedCategories: [],
      primaryContext: '',
      suggestedApproach: ''
    }
  };
};

// 🚀 완전히 단순화된 검증 시스템 - 경고만 표시, 진행은 허용
export const getSemanticConflicts = (inputText: string, selectedPurposes: string[]): {
  conflicts: Array<{
    purpose: string;
    reason: string;
    severity: 'high' | 'medium' | 'low';
    suggestion?: string;
  }>;
  blockedPurposes: string[];
} => {
  // 모든 목적 허용, 경고만 표시
  return { conflicts: [], blockedPurposes: [] };
};

// 🚀 단순화된 차단 옵션 검사 - 아무것도 차단하지 않음
export const getDisabledOptions = (step: number, data: any): { [key: string]: string[] } => {
  return {}; // 아무것도 차단하지 않음
};

// 🚀 단순화된 차단 사유 - 빈 문자열 반환
export const getDisabledReason = (step: number, category: string, value: string, data: any): string => {
  return ''; // 아무것도 차단하지 않으므로 사유 없음
};

// 🚀 단순화된 검증 함수들
export const validateFormat = (data: any, step: number): ValidationResult[] => {
  const results: ValidationResult[] = [];
  
  if (step === 1) {
    // 최소한의 필수 검증만
    if (!data.purposes || data.purposes.length === 0) {
      results.push({
        isValid: false,
        level: 'warning', // error → warning으로 변경
        field: 'purposes',
        message: '제작 목적을 선택하시면 더 정확한 견적을 제공할 수 있습니다.',
        suggestions: ['목적을 선택해주세요']
      });
    }
    
    if (!data.serviceType) {
      results.push({
        isValid: false,
        level: 'warning', // error → warning으로 변경
        field: 'serviceType',
        message: '서비스 타입을 선택해주세요.',
        suggestions: ['필요한 서비스를 선택하세요']
      });
    }
  }
  
  return results;
};

export const validateLogic = (data: any, step: number): ValidationResult[] => {
  // 논리 검증 완전 제거 - 경고만 표시
  return [];
};

export const validateConsistency = (data: any, step: number): ValidationResult[] => {
  // 일관성 검증 완전 제거
  return [];
};

export const validateBusiness = (data: any, step: number): ValidationResult[] => {
  // 비즈니스 검증 완전 제거
  return [];
};

export const validateStep = (step: number, data: any, context?: ValidationContext): ValidationResult[] => {
  const allResults: ValidationResult[] = [];
  
  // 최소한의 포맷 검증만 실행
  allResults.push(...validateFormat(data, step));
  
  return allResults;
};

export const applyAutoFix = (data: any, validationResult: ValidationResult): any => {
  return data;
};

export const getValidationMessage = (result: ValidationResult): string => {
  const levelEmojis = { error: '❌', warning: '⚠️', info: 'ℹ️' };
  return `${levelEmojis[result.level]} ${result.message}`;
};

export const summarizeValidation = (results: ValidationResult[]): {
  isValid: boolean;
  canProceed: boolean;
  errorCount: number;
  warningCount: number;
  infoCount: number;
} => {
  const errorCount = results.filter(r => r.level === 'error').length;
  const warningCount = results.filter(r => r.level === 'warning').length;
  const infoCount = results.filter(r => r.level === 'info').length;
  
  return {
    isValid: true, // 항상 true
    canProceed: true, // 항상 진행 허용
    errorCount,
    warningCount,
    infoCount
  };
};

// 🚀 완전히 제거된 복잡한 함수들 - 빈 함수로 대체
export const parseUserInputComprehensive = (inputText: string) => ({
  detectedCategories: [],
  primaryContext: '',
  extractedInfo: {},
  confidence: 0
});

export const validateCrossStepConsistency = (currentStep: number, formData: any) => [];

export const getFilteredPurposesByContext = (inputText: string, allowAllCategories: boolean = true) => ({
  availableCategories: purposeCategories.video.map(cat => cat.id),
  blockedCategories: [],
  availablePurposes: purposeCategories.video.flatMap(cat => cat.purposes),
  blockedPurposes: [],
  filterReason: ''
});

export const getSemanticValidationForAllSteps = (step: number, data: any) => ({
  conflicts: [],
  blockedOptions: {}
});
