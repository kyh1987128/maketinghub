
'use client';

import { useState, useEffect } from 'react';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface ScaleData {
  firstChoice?: {
    type: string;
    value: string;
  };
  secondChoice?: {
    type: string;
    value: string;
  };
  custom?: string;
}

interface AIGuide {
  status: 'good' | 'warning' | 'error';
  message: string;
  suggestions: string[];
  platformTips: string[];
}

export default function Step4Scale({ data, onUpdate, onNext, onPrev }: Props) {
  const [scale, setScale] = useState<ScaleData>(data.scale || {});
  const [specialNotes, setSpecialNotes] = useState(data.step4Notes || '');
  const [aiGuide, setAiGuide] = useState<AIGuide | null>(null);

  // 🚀 완전히 새로운 4단계 옵션 체계
  const getScaleOptionsByService = () => {
    const serviceType = data.serviceType || 'video';
    
    switch (serviceType) {
      case 'video':
        return {
          firstOptions: [
            { 
              value: '15초', 
              description: '임팩트 메시지, 티저', 
              icon: 'ri-timer-line', 
              platforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts'], 
              cost: 'low',
              useCases: ['SNS 광고', '브랜드 티저', '제품 하이라이트']
            },
            { 
              value: '30초', 
              description: '광고, 소개, 요약', 
              icon: 'ri-timer-line', 
              platforms: ['TV광고', 'YouTube 광고', 'Facebook'], 
              cost: 'low',
              useCases: ['제품 광고', '서비스 소개', '브랜드 메시지']
            },
            { 
              value: '1분', 
              description: '설명, 홍보, 소개', 
              icon: 'ri-time-line', 
              platforms: ['Instagram', 'LinkedIn', 'Twitter'], 
              cost: 'medium',
              useCases: ['기업 소개', '제품 데모', '서비스 가이드']
            },
            { 
              value: '3분', 
              description: '교육, 설명, 스토리', 
              icon: 'ri-time-line', 
              platforms: ['YouTube', '회사 홈페이지', '교육 플랫폼'], 
              cost: 'medium',
              useCases: ['사용법 가이드', '교육 콘텐츠', '브랜드 스토리']
            },
            { 
              value: '5분', 
              description: '상세 설명, 케이스 스터디', 
              icon: 'ri-hourglass-line', 
              platforms: ['YouTube', 'Vimeo', '내부 교육'], 
              cost: 'high',
              useCases: ['직원 교육', '제품 분석', '프로젝트 소개']
            },
            { 
              value: '10분+', 
              description: '장편, 다큐, 심화 콘텐츠', 
              icon: 'ri-hourglass-fill', 
              platforms: ['YouTube', 'TV', '스트리밍'], 
              cost: 'very-high',
              useCases: ['다큐멘터리', '장편 교육', '이벤트 기록']
            }
          ],
          secondOptions: [
            {
              value: '초간단',
              description: '핵심 메시지 1-2개만',
              icon: 'ri-file-text-line',
              density: 'very-low',
              cost: 'low'
            },
            {
              value: '간단',
              description: '기본 정보 + 핵심 포인트',
              icon: 'ri-file-list-line',
              density: 'low',
              cost: 'low'
            },
            {
              value: '보통',
              description: '체계적 구성 + 상세 설명',
              icon: 'ri-file-list-2-line',
              density: 'medium',
              cost: 'medium'
            },
            {
              value: '상세',
              description: '종합적 정보 + 사례 포함',
              icon: 'ri-file-list-3-line',
              density: 'high',
              cost: 'medium'
            },
            {
              value: '매우상세',
              description: '전문적 분석 + 다양한 관점',
              icon: 'ri-file-paper-line',
              density: 'very-high',
              cost: 'high'
            },
            {
              value: '꽉찬',
              description: '모든 정보 + 심화 내용',
              icon: 'ri-file-paper-2-line',
              density: 'maximum',
              cost: 'very-high'
            }
          ]
        };
        
      case 'design':
        return {
          firstOptions: [
            {
              value: '브랜드 아이덴티티',
              description: '로고 + CI 시스템',
              icon: 'ri-palette-line',
              platforms: ['로고', '명함', '레터헤드'],
              cost: 'medium',
              useCases: ['스타트업 브랜딩', '리브랜딩', '브랜드 정립']
            },
            {
              value: '웹/모바일 디자인',
              description: '디지털 인터페이스',
              icon: 'ri-computer-line',
              platforms: ['웹사이트', '모바일 앱', '대시보드'],
              cost: 'high',
              useCases: ['홈페이지', '앱 UI/UX', '관리자 시스템']
            },
            {
              value: '인쇄물 디자인',
              description: '오프라인 마케팅 자료',
              icon: 'ri-printer-line',
              platforms: ['브로슈어', '포스터', '카탈로그'],
              cost: 'low',
              useCases: ['마케팅 자료', '행사 홍보', '제품 소개']
            },
            {
              value: '패키징 디자인',
              description: '제품 포장 및 라벨',
              icon: 'ri-box-line',
              platforms: ['제품 박스', '라벨', '쇼핑백'],
              cost: 'medium',
              useCases: ['제품 출시', '브랜딩 강화', '매장 진열']
            },
            {
              value: '사인/간판 디자인',
              description: '매장 및 공간 사인',
              icon: 'ri-road-map-line',
              platforms: ['매장 간판', '실내 사인', '안내판'],
              cost: 'medium',
              useCases: ['매장 오픈', '리뉴얼', '브랜드 통일']
            },
            {
              value: '종합 브랜딩',
              description: '통합 브랜드 솔루션',
              icon: 'ri-stack-line',
              platforms: ['모든 매체', '360도 브랜딩'],
              cost: 'very-high',
              useCases: ['전사적 브랜딩', '기업 통합', '글로벌 진출']
            }
          ],
          secondOptions: [
            {
              value: '기본형',
              description: '1-3개 핵심 항목',
              icon: 'ri-list-check',
              density: 'low',
              cost: 'low'
            },
            {
              value: '표준형',
              description: '4-7개 주요 항목',
              icon: 'ri-list-check-2',
              density: 'medium',
              cost: 'medium'
            },
            {
              value: '확장형',
              description: '8-15개 다양한 항목',
              icon: 'ri-list-check-3',
              density: 'high',
              cost: 'high'
            },
            {
              value: '프리미엄',
              description: '15개+ 전문 항목',
              icon: 'ri-trophy-line',
              density: 'very-high',
              cost: 'very-high'
            }
          ]
        };
        
      case 'marketing':
        return {
          firstOptions: [
            {
              value: 'SNS 집중',
              description: '인스타그램 + 페이스북 중심',
              icon: 'ri-instagram-line',
              platforms: ['Instagram', 'Facebook', 'Stories'],
              cost: 'low',
              useCases: ['브랜드 인지도', '젊은층 타겟', '비주얼 마케팅']
            },
            {
              value: '검색 마케팅',
              description: '구글 + 네이버 광고',
              icon: 'ri-search-line',
              platforms: ['Google Ads', '네이버 광고', 'SEO'],
              cost: 'medium',
              useCases: ['리드 확보', '즉시 성과', '키워드 마케팅']
            },
            {
              value: '유튜브 마케팅',
              description: '영상 콘텐츠 중심',
              icon: 'ri-youtube-line',
              platforms: ['YouTube', 'YouTube Shorts'],
              cost: 'high',
              useCases: ['브랜드 스토리', '제품 데모', '신뢰도 구축']
            },
            {
              value: '통합 디지털',
              description: 'SNS + 검색 + 유튜브',
              icon: 'ri-global-line',
              platforms: ['모든 디지털 채널'],
              cost: 'high',
              useCases: ['종합 마케팅', '시장 점유율', '브랜드 파워']
            },
            {
              value: '오프라인 연계',
              description: '디지털 + 오프라인 통합',
              icon: 'ri-store-line',
              platforms: ['매장', '이벤트', '옥외광고'],
              cost: 'very-high',
              useCases: ['로컬 마케팅', '체험 마케팅', '통합 캠페인']
            },
            {
              value: '풀채널 마케팅',
              description: '모든 마케팅 채널 동원',
              icon: 'ri-rocket-line',
              platforms: ['전 채널', '글로벌'],
              cost: 'very-high',
              useCases: ['시장 지배', '경쟁 우위', '브랜드 리더십']
            }
          ],
          secondOptions: [
            {
              value: '단기 집중',
              description: '1개월, 300만원~',
              icon: 'ri-flashlight-line',
              density: 'high',
              cost: 'low'
            },
            {
              value: '중기 운영',
              description: '3개월, 800만원~',
              icon: 'ri-time-line',
              density: 'medium',
              cost: 'medium'
            },
            {
              value: '장기 전략',
              description: '6개월, 1500만원~',
              icon: 'ri-calendar-line',
              density: 'high',
              cost: 'high'
            },
            {
              value: '연간 계약',
              description: '12개월, 3000만원~',
              icon: 'ri-calendar-2-line',
              density: 'very-high',
              cost: 'very-high'
            }
          ]
        };
        
      default:
        return {
          firstOptions: [
            {
              value: '기본',
              description: '기본 수준',
              icon: 'ri-time-line',
              platforms: ['일반'],
              cost: 'low',
              useCases: ['기본 서비스']
            }
          ],
          secondOptions: [
            {
              value: '표준',
              description: '표준 수준',
              icon: 'ri-file-line',
              density: 'medium',
              cost: 'medium'
            }
          ]
        };
    }
  };

  // 🚀 서비스별 AI 가이드 생성 로직
  const generateAIGuide = () => {
    const timeScale = scale.timeScale;
    const contentScale = scale.contentScale;
    
    if (!timeScale || !contentScale) {
      setAiGuide(null);
      return;
    }

    const timeValue = timeScale.value;
    const contentValue = contentScale.value;
    const purposes = data.purposes || [];
    const serviceType = data.serviceType || 'video';

    let guide: AIGuide = {
      status: 'good',
      message: '',
      suggestions: [],
      platformTips: []
    };

    // 🚀 서비스별 맞춤 AI 가이드
    if (serviceType === 'video') {
      // 영상 제작 가이드 (기존 로직 유지)
      if ((timeValue === '15초' || timeValue === '30초') && (contentValue === '상세' || contentValue === '매우상세' || contentValue === '꽉찬')) {
        guide.status = 'error';
        guide.message = '⚠️ 짧은 시간에 너무 많은 내용을 담으려고 합니다. 시청자가 정보를 제대로 소화하기 어려울 수 있습니다.';
        guide.suggestions = [
          '15-30초 영상은 "초간단" 또는 "간단" 분량을 권장합니다',
          '핵심 메시지 1-2개만 선택하여 임팩트 있게 전달하세요',
          '상세한 내용은 별도 영상으로 제작하거나 시간을 늘리세요'
        ];
      } else if ((timeValue === '10분+') && (contentValue === '초간단' || contentValue === '간단')) {
        guide.status = 'warning';
        guide.message = '🤔 긴 시간에 비해 내용이 부족할 수 있습니다. 시청자가 지루해할 가능성이 있습니다.';
        guide.suggestions = [
          '10분 이상 영상은 "보통" 이상의 분량을 권장합니다',
          '챕터를 나누어 구성하거나 여러 주제를 다뤄보세요',
          '인터뷰, 사례 연구 등으로 내용을 풍성하게 만드세요'
        ];
      } else {
        guide.status = 'good';
        guide.message = '✅ 적절한 조합입니다. 영상 목적과 용도에 맞게 내용을 구성하세요.';
        guide.suggestions = [
          '선택하신 조합에 맞는 스토리보드를 계획하세요',
          '타겟 시청자의 특성을 고려한 구성이 중요합니다'
        ];
      }
    } else if (serviceType === 'design') {
      // 디자인 제작 가이드
      if ((timeValue === '미니멀' || timeValue === '기본') && (contentValue === '프리미엄' || contentValue === '럭셔리')) {
        guide.status = 'error';
        guide.message = '⚠️ 기본적인 브랜딩 범위에 고급 디자인 복잡도를 적용하면 비용 대비 효과가 떨어집니다.';
        guide.suggestions = [
          '미니멀/기본 브랜딩은 "심플" 또는 "일반" 복잡도를 권장합니다',
          '고급 디자인이 필요하면 브랜딩 범위를 "표준" 이상으로 확장하세요',
          '단계적으로 진행하여 필요에 따라 업그레이드하세요'
        ];
      } else if ((timeValue === '전체' || timeValue === '마스터') && (contentValue === '심플' || contentValue === '일반')) {
        guide.status = 'warning';
        guide.message = '🤔 광범위한 브랜딩 범위에 비해 디자인 복잡도가 단순할 수 있습니다.';
        guide.suggestions = [
          '풀 브랜딩은 "정교" 이상의 복잡도를 권장합니다',
          '다양한 매체에 적용할 풍성한 디자인 요소가 필요합니다',
          '브랜드 일관성을 위해 체계적인 디자인 시스템을 구축하세요'
        ];
      } else {
        guide.status = 'good';
        guide.message = '✅ 균형잡힌 브랜딩 계획입니다. 브랜드 가치를 효과적으로 전달할 수 있습니다.';
        guide.suggestions = [
          '브랜드 아이덴티티가 모든 매체에서 일관되게 적용되도록 계획하세요',
          '타겟 고객의 취향과 업계 트렌드를 반영하세요',
          '장기적인 브랜드 확장을 고려한 확장성 있는 디자인을 계획하세요'
        ];
      }
      
      guide.platformTips = [
        '디자인용: 다양한 해상도와 포맷에 대응 가능한 벡터 기반 디자인 권장',
        '인쇄물: CMYK 컬러 모드와 고해상도 설정 필수',
        '디지털: RGB 컬러와 반응형 디자인 고려 필요'
      ];
    } else if (serviceType === 'marketing') {
      // 마케팅 서비스 가이드
      if ((timeValue === '테스트' || timeValue === '기본') && (contentValue === '인텐시브' || contentValue === '도미네이트')) {
        guide.status = 'error';
        guide.message = '⚠️ 제한적인 마케팅 규모에 과도한 강도를 적용하면 예산 낭비가 발생할 수 있습니다.';
        guide.suggestions = [
          '테스트/기본 캠페인은 "소프트" 또는 "일반" 강도를 권장합니다',
          '데이터를 수집하고 검증한 후 점진적으로 강도를 높이세요',
          'ROI를 확인한 후 캠페인 규모를 확장하는 것이 안전합니다'
        ];
      } else if ((timeValue === '전략' || timeValue === '마스터') && (contentValue === '소프트' || contentValue === '일반')) {
        guide.status = 'warning';
        guide.message = '🤔 대규모 마케팅 전략에 비해 실행 강도가 부족할 수 있습니다.';
        guide.suggestions = [
          '전략적 마케팅은 "액티브" 이상의 강도를 권장합니다',
          '투자한 전략이 충분한 성과를 내기 위해 적극적 실행이 필요합니다',
          '경쟁사 대비 충분한 마케팅 파워를 확보하세요'
        ];
      } else {
        guide.status = 'good';
        guide.message = '✅ 효과적인 마케팅 전략입니다. 목표 달성을 위한 적절한 조합입니다.';
        guide.suggestions = [
          '타겟 고객의 여정을 고려한 단계별 마케팅을 계획하세요',
          '채널별 특성을 활용한 맞춤형 콘텐츠를 준비하세요',
          '성과 측정 지표를 사전에 설정하고 지속적으로 최적화하세요'
        ];
      }
      
      guide.platformTips = [
        '마케팅용: 각 플랫폼별 최적 콘텐츠 형식과 타이밍 고려',
        'ROI 측정: 추적 가능한 링크와 UTM 파라미터 설정 필수',
        '데이터 분석: 실시간 성과 모니터링과 빠른 최적화 체계 구축'
      ];
    }

    // 목적별 추가 가이드
    if (purposes.includes('마케팅·홍보')) {
      if (serviceType === 'video') {
        guide.platformTips.push('마케팅용: ROI 측정을 위한 추적 코드 삽입 권장');
      } else if (serviceType === 'design') {
        guide.platformTips.push('마케팅용: 브랜드 인지도 향상을 위한 강력한 비주얼 아이덴티티 구축');
      }
    }

    if (purposes.includes('교육·정보전달')) {
      if (serviceType === 'video') {
        guide.platformTips.push('교육용: 학습 효과 측정을 위한 퀴즈나 과제 연계 고려');
      } else if (serviceType === 'design') {
        guide.platformTips.push('교육용: 정보 전달 효율성을 위한 명확한 정보 구조와 가독성 중시');
      }
    }

    setAiGuide(guide);
  };

  // 스케일 변경 핸들러들
  const handleTimeScaleChange = (type: string, value: string) => {
    const newScale = { ...scale, timeScale: { type, value } };
    setScale(newScale);
    onUpdate({
      scale: newScale,
      step4Notes: specialNotes
    });
  };

  const handleContentScaleChange = (type: string, value: string) => {
    const newScale = { ...scale, contentScale: { type, value } };
    setScale(newScale);
    onUpdate({
      scale: newScale,
      step4Notes: specialNotes
    });
  };

  const handleNotesChange = (notes: string) => {
    setSpecialNotes(notes);
    onUpdate({
      scale: scale,
      step4Notes: notes
    });
  };

  // AI 가이드 업데이트
  useEffect(() => {
    generateAIGuide();
  }, [scale.timeScale, scale.contentScale, data.purposes, data.serviceType]);

  const getCostIndicator = (cost: string) => {
    const indicators = {
      low: { color: 'text-green-600', label: '💰', desc: '경제적' },
      medium: { color: 'text-yellow-600', label: '💰💰', desc: '보통' },
      high: { color: 'text-red-600', label: '💰💰💰', desc: '고비용' },
      'very-high': { color: 'text-purple-600', label: '💰💰💰💰', desc: '최고급' }
    };
    return indicators[cost] || indicators.medium;
  };

  const handleNext = () => {
    onNext();
  };

  const canProceed = scale.timeScale && scale.contentScale;

  // 🚀 서비스별 제목과 설명 가져오기
  const getServiceInfo = () => {
    const serviceType = data.serviceType || 'video';
    
    switch (serviceType) {
      case 'video':
        return {
          title: '영상 분량을 선택해주세요',
          description: '시간 기준과 내용 분량을 각각 선택해주세요. AI가 조합을 분석하여 최적의 가이드를 제공합니다.',
          firstTitle: '1️⃣ 시간 기준 선택 (필수)',
          secondTitle: '2️⃣ 내용 분량 선택 (필수)',
          color: 'blue'
        };
      case 'design':
        return {
          title: '디자인 분야를 선택해주세요',
          description: '디자인 분야와 제작 수량을 각각 선택해주세요. 실무에 바로 적용 가능한 구체적인 견적을 제공합니다.',
          firstTitle: '1️⃣ 디자인 분야 선택 (필수)',
          secondTitle: '2️⃣ 제작 수량 & 복잡도 (필수)',
          color: 'green'
        };
      case 'marketing':
        return {
          title: '마케팅 채널을 선택해주세요',
          description: '마케팅 채널과 캠페인 기간을 각각 선택해주세요. 실무 경험을 바탕으로 한 구체적인 전략을 제공합니다.',
          firstTitle: '1️⃣ 마케팅 채널 선택 (필수)',
          secondTitle: '2️⃣ 캠페인 기간 & 예산 규모 (필수)',
          color: 'purple'
        };
      default:
        return {
          title: '서비스 규모를 선택해주세요',
          description: '서비스 규모를 선택해주세요.',
          firstTitle: '1️⃣ 규모 선택 (필수)',
          secondTitle: '2️⃣ 상세 수준 선택 (필수)',
          color: 'blue'
        };
    }
  };

  const serviceInfo = getServiceInfo();
  const { firstOptions, secondOptions } = getScaleOptionsByService();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">{serviceInfo.title}</h2>
        <p className="text-gray-600 mb-6">{serviceInfo.description}</p>
        
        {/* 서비스 타입 표시 */}
        <div className={`bg-${serviceInfo.color}-50 border border-${serviceInfo.color}-200 rounded-lg p-4 mb-4`}>
          <div className="flex items-center">
            <i className={`ri-${serviceInfo.color === 'blue' ? 'video' : serviceInfo.color === 'green' ? 'palette' : 'advertisement'}-line text-${serviceInfo.color}-600 mr-2 w-4 h-4 flex items-center justify-center`}></i>
            <div>
              <span className={`font-medium text-${serviceInfo.color}-800`}>선택된 서비스: </span>
              <span className={`text-${serviceInfo.color}-700`}>
                {data.serviceType === 'video' ? '영상 제작' : 
                 data.serviceType === 'design' ? '디자인 제작' : 
                 data.serviceType === 'marketing' ? '마케팅 서비스' : '기타'}
              </span>
            </div>
          </div>
        </div>

        {/* 이전 단계 정보 표시 */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <i className="ri-target-line text-gray-600 mr-2"></i>
              <span className="font-medium text-gray-800">선택된 목적: </span>
              <span className="text-gray-700">{data?.purposes?.join(', ') || '없음'}</span>
            </div>
            <div className="flex items-center">
              <i className="ri-list-check text-gray-600 mr-2"></i>
              <span className="font-medium text-gray-800">세부 용도: </span>
              <span className="text-gray-700">
                {data?.details?.slice(0, 3).join(', ') || '없음'}
                {data?.details?.length > 3 && ` 외 ${data.details.length - 3}개`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 첫 번째 선택 (시간/범위/규모) */}
      <div className={`bg-${serviceInfo.color}-50 rounded-lg p-4`}>
        <h3 className={`font-medium text-${serviceInfo.color}-800 mb-4 flex items-center`}>
          <i className={`ri-${serviceInfo.color === 'blue' ? 'time' : serviceInfo.color === 'green' ? 'artboard' : 'megaphone'}-line text-${serviceInfo.color}-600 mr-2 w-5 h-5 flex items-center justify-center`}></i>
          {serviceInfo.firstTitle}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {firstOptions.map((option) => {
            const isSelected = scale.timeScale?.value === option.value;
            const costInfo = getCostIndicator(option.cost);
            
            return (
              <div key={option.value} className="relative group">
                <label
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                    ? `border-${serviceInfo.color}-500 bg-${serviceInfo.color}-100 hover:bg-${serviceInfo.color}-200`
                    : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="timeScale"
                    checked={isSelected}
                    onChange={() => handleTimeScaleChange(data.serviceType === 'video' ? '시간' : data.serviceType === 'design' ? '범위' : '규모', option.value)}
                    className="sr-only"
                  />
                  
                  <div className={`${
                    isSelected 
                    ? `text-${serviceInfo.color}-700` 
                    : 'text-gray-700'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <i className={`${option.icon} text-xl mr-2 w-6 h-6 flex items-center justify-center`}></i>
                        <span className="font-semibold">{option.value}</span>
                      </div>
                      <span className={`text-xs ${costInfo.color}`} title={`${costInfo.desc} 비용`}>
                        {costInfo.label}
                      </span>
                    </div>
                    
                    <div className="text-sm mb-2">{option.description}</div>
                    
                    <div className="text-xs text-gray-500">
                      <div className="font-medium mb-1">
                        {data.serviceType === 'video' ? '주요 플랫폼:' : 
                         data.serviceType === 'design' ? '적용 분야:' : 
                         data.serviceType === 'marketing' ? '활용 채널:' : '활용 범위:'}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {option.platforms.map((platform, idx) => (
                          <span key={idx} className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🚀 두 번째 선택 (내용/복잡도/강도) */}
      <div className={`bg-${serviceInfo.color === 'blue' ? 'green' : serviceInfo.color === 'green' ? 'blue' : 'orange'}-50 rounded-lg p-4`}>
        <h3 className={`font-medium text-${serviceInfo.color === 'blue' ? 'green' : serviceInfo.color === 'green' ? 'blue' : 'orange'}-800 mb-4 flex items-center`}>
          <i className={`ri-${serviceInfo.color === 'blue' ? 'file-list-3' : serviceInfo.color === 'green' ? 'brush' : 'flashlight'}-line text-${serviceInfo.color === 'blue' ? 'green' : serviceInfo.color === 'green' ? 'blue' : 'orange'}-600 mr-2 w-5 h-5 flex items-center justify-center`}></i>
          {serviceInfo.secondTitle}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {secondOptions.map((option) => {
            const isSelected = scale.contentScale?.value === option.value;
            const costInfo = getCostIndicator(option.cost);
            const colorClass = serviceInfo.color === 'blue' ? 'green' : serviceInfo.color === 'green' ? 'blue' : 'orange';
            
            return (
              <div key={option.value} className="relative group">
                <label
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                    ? `border-${colorClass}-500 bg-${colorClass}-100 hover:bg-${colorClass}-200`
                    : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="contentScale"
                    checked={isSelected}
                    onChange={() => handleContentScaleChange(data.serviceType === 'video' ? '분량' : data.serviceType === 'design' ? '복잡도' : '강도', option.value)}
                    className="sr-only"
                  />
                  
                  <div className={`${
                    isSelected 
                    ? `text-${colorClass}-700` 
                    : 'text-gray-700'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <i className={`${option.icon} text-xl mr-2 w-6 h-6 flex items-center justify-center`}></i>
                        <span className="font-semibold">{option.value}</span>
                      </div>
                      <span className={`text-xs ${costInfo.color}`} title={`${costInfo.desc} 비용`}>
                        {costInfo.label}
                      </span>
                    </div>
                    
                    <div className="text-sm mb-2">{option.description}</div>
                    
                    <div className="text-xs">
                      <span className="font-medium">
                        {data.serviceType === 'video' ? '정보 밀도: ' : 
                         data.serviceType === 'design' ? '디자인 밀도: ' : 
                         data.serviceType === 'marketing' ? '마케팅 강도: ' : '작업 강도: '}
                      </span>
                      <span className={`
                        ${option.density === 'very-low' ? 'text-green-600' :
                          option.density === 'low' ? 'text-green-600' :
                          option.density === 'medium' ? 'text-yellow-600' :
                          option.density === 'high' ? 'text-orange-600' :
                          option.density === 'very-high' ? 'text-red-600' :
                          'text-purple-600'
                        }
                      `}>
                        {option.density === 'very-low' ? '매우 낮음' :
                         option.density === 'low' ? '낮음' :
                         option.density === 'medium' ? '보통' :
                         option.density === 'high' ? '높음' :
                         option.density === 'very-high' ? '매우 높음' :
                         '초고강도'
                        }
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🚀 AI 스마트 가이드 */}
      {aiGuide && (
        <div className={`border-2 rounded-lg p-6 ${
          aiGuide.status === 'good' ? `bg-${serviceInfo.color}-50 border-${serviceInfo.color}-300` :
          aiGuide.status === 'warning' ? 'bg-yellow-50 border-yellow-300' :
          'bg-red-50 border-red-300'
        }`}>
          <div className="flex items-start mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
              aiGuide.status === 'good' ? `bg-${serviceInfo.color}-100 text-${serviceInfo.color}-600` :
              aiGuide.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
              'bg-red-100 text-red-600'
            }`}>
              <i className={`${
                aiGuide.status === 'good' ? 'ri-ai-generate' :
                aiGuide.status === 'warning' ? 'ri-error-warning-line' :
                'ri-error-warning-fill'
              } w-5 h-5 flex items-center justify-center`}></i>
            </div>
            <div className="flex-1">
              <h4 className={`font-semibold mb-2 ${
                aiGuide.status === 'good' ? `text-${serviceInfo.color}-800` :
                aiGuide.status === 'warning' ? 'text-yellow-800' :
                'text-red-800'
              }`}>
                🤖 AI 분석 결과 ({data.serviceType === 'video' ? '영상' : data.serviceType === 'design' ? '디자인' : '마케팅'} 전문)
              </h4>
              <p className={`text-sm mb-3 ${
                aiGuide.status === 'good' ? `text-${serviceInfo.color}-700` :
                aiGuide.status === 'warning' ? 'text-yellow-700' :
                'text-red-700'
              }`}>
                {aiGuide.message}
              </p>
            </div>
          </div>

          {aiGuide.suggestions.length > 0 && (
            <div className="mb-4">
              <h5 className={`font-medium mb-2 ${
                aiGuide.status === 'good' ? `text-${serviceInfo.color}-800` :
                aiGuide.status === 'warning' ? 'text-yellow-800' :
                'text-red-800'
              }`}>
                💡 AI 추천사항
              </h5>
              <ul className={`text-sm space-y-1 ${
                aiGuide.status === 'good' ? `text-${serviceInfo.color}-700` :
                aiGuide.status === 'warning' ? 'text-yellow-700' :
                'text-red-700'
              }`}>
                {aiGuide.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {aiGuide.platformTips.length > 0 && (
            <div className={`p-3 rounded-lg ${
              aiGuide.status === 'good' ? `bg-${serviceInfo.color}-100` :
              aiGuide.status === 'warning' ? 'bg-yellow-100' :
              'bg-red-100'
            }`}>
              <h5 className={`font-medium mb-2 ${
                aiGuide.status === 'good' ? `text-${serviceInfo.color}-800` :
                aiGuide.status === 'warning' ? 'text-yellow-800' :
                'text-red-800'
              }`}>
                {data.serviceType === 'video' ? '📱 플랫폼별 팁' : 
                 data.serviceType === 'design' ? '🎨 디자인 팁' : 
                 '📈 마케팅 팁'}
              </h5>
              <ul className={`text-xs space-y-1 ${
                aiGuide.status === 'good' ? `text-${serviceInfo.color}-600` :
                aiGuide.status === 'warning' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {aiGuide.platformTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 선택 결과 미리보기 */}
      {canProceed && (
        <div className={`bg-gradient-to-r from-green-50 to-${serviceInfo.color}-50 border border-green-200 rounded-lg p-4`}>
          <h3 className="font-semibold text-green-800 mb-3">✅ {data.serviceType === 'video' ? '분량' : data.serviceType === 'design' ? '규모' : '캠페인'} 설정 완료</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div className={`bg-white p-3 rounded border border-${serviceInfo.color}-200`}>
              <div className={`text-sm font-medium text-${serviceInfo.color}-700 mb-1`}>
                {data.serviceType === 'video' ? '⏱️ 시간 기준' : 
                 data.serviceType === 'design' ? '📐 작업 범위' : 
                 '📊 캠페인 규모'}
              </div>
              <div className={`text-${serviceInfo.color}-600 font-medium`}>{scale.timeScale?.value}</div>
            </div>
            
            <div className={`bg-white p-3 rounded border border-${serviceInfo.color === 'blue' ? 'green' : serviceInfo.color === 'green' ? 'blue' : 'orange'}-200`}>
              <div className={`text-sm font-medium text-${serviceInfo.color === 'blue' ? 'green' : serviceInfo.color === 'green' ? 'blue' : 'orange'}-700 mb-1`}>
                {data.serviceType === 'video' ? '📝 내용 분량' : 
                 data.serviceType === 'design' ? '🎨 디자인 복잡도' : 
                 '🔥 마케팅 강도'}
              </div>
              <div className={`text-${serviceInfo.color === 'blue' ? 'green' : serviceInfo.color === 'green' ? 'blue' : 'orange'}-600 font-medium`}>{scale.contentScale?.value}</div>
            </div>
          </div>

          <div className="mt-3 p-3 bg-blue-100 rounded-lg">
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">🎯 설정 효과</p>
              <p>• {data.serviceType === 'video' ? '시간과 분량' : data.serviceType === 'design' ? '범위와 복잡도' : '규모와 강도'} 조합으로 정확한 제작 계획 수립</p>
              <p>• {data.serviceType === 'video' ? '플랫폼별 최적화된 콘텐츠' : data.serviceType === 'design' ? '브랜드 목표에 맞는 디자인' : '목표 달성을 위한 최적 마케팅'} 제작 가능</p>
              <p>• AI 가이드로 효과적인 {data.serviceType === 'video' ? '영상' : data.serviceType === 'design' ? '디자인' : '마케팅'} 구성 보장</p>
            </div>
          </div>
        </div>
      )}

      {/* 기타 추가 입력사항 */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-medium text-orange-800 mb-3">
          <i className="ri-sticky-note-line mr-2"></i>
          기타 추가 입력사항
        </h3>
        <textarea
          value={specialNotes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder={`예: 특별한 ${data.serviceType === 'video' ? '분량' : data.serviceType === 'design' ? '디자인' : '마케팅'} 요구사항 / ${data.serviceType === 'video' ? '플랫폼별 버전 제작 희망' : data.serviceType === 'design' ? '특정 스타일이나 컨셉 요청' : '특정 채널 집중 요청'} / ${data.serviceType === 'video' ? '시간이나 내용' : data.serviceType === 'design' ? '범위나 복잡도' : '규모나 강도'} 조정이 필요한 상황 / AI 가이드와 다른 방향이 필요한 이유 등`}
          className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-white"
          rows={4}
        />
        <p className="text-xs text-orange-700 mt-2">
          💡 AI 가이드와 다른 방향을 원하시거나 특별한 요구사항이 있으시면 자세히 설명해주세요!
        </p>
      </div>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onPrev}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium whitespace-nowrap cursor-pointer hover:bg-gray-200 transition-colors"
        >
          이전으로
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
            canProceed
              ? `bg-${serviceInfo.color}-600 text-white hover:bg-${serviceInfo.color}-700`
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          다음으로
        </button>
      </div>
    </div>
  );
}
