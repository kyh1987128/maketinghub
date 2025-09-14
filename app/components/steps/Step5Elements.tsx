
'use client';

import { useState, useEffect } from 'react';
import { getDisabledOptions, getDisabledReason } from '../../lib/validationRules';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface Element {
  name: string;
  type: 'toggle' | 'slider' | 'quantity' | 'option';
  icon: string;
  maxValue?: number;
  unit?: string;
  priceImpact: number;
  timeImpact: number;
  description: string;
  options?: Array<{ 
    label: string; 
    value: number; 
    desc: string; 
    price: number; 
    negotiable?: boolean;
    note?: string;
    volumeNote?: string;
  }>;
}

interface AIRecommendation {
  combination: { [key: string]: any };
  reasoning: string;
  benefits: string[];
  totalCost: number;
  confidence: number;
}

export default function Step5Elements({ data, onUpdate, onNext, onPrev }: Props) {
  const [elements, setElements] = useState(data.elements || {});
  const [specialNotes, setSpecialNotes] = useState(data.step5Notes || '');
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  // 🚀 AI 최적 조합 추천 생성 로직
  const generateAIRecommendation = async () => {
    setIsGeneratingAI(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const purposes = data.purposes || [];
      const details = data.details || [];
      const scale = data.scale || {};
      const budget = data.targetBudget || 'medium';
      
      let recommendedCombination: { [key: string]: any } = {};
      let reasoning = '';
      let benefits: string[] = [];
      let totalCost = 0;
      let confidence = 90;

      // 목적별 최적 조합 로직
      if (purposes.includes('마케팅·홍보')) {
        if (details.includes('제품·서비스 소개')) {
          recommendedCombination = {
            '기획·컨셉': { enabled: true, selectedOption: 1 }, // 전문 기획
            '출연진': { enabled: true, selectedOption: 2 }, // 전문 모델
            '촬영 장소': { enabled: true, selectedOption: 0 }, // 스튜디오
            '촬영 장비': { enabled: true, selectedOption: 1 }, // 전문 카메라
            '조명·스태프': { enabled: true, selectedOption: 1 }, // 기본 팀
            '편집 복잡도': { enabled: true, selectedOption: 1 }, // 일반 편집
            '모션그래픽': { enabled: true, selectedOption: 1 }, // 모션 그래픽
            '사운드 디자인': { enabled: true, selectedOption: 1 }, // 맞춤 음향
            '성우·더빙': { enabled: true, selectedOption: 1 }, // 전문 성우
            '자막·텍스트': { enabled: true, selectedOption: 1 } // 디자인 자막
          };
          totalCost = 4200000;
          reasoning = '제품·서비스 소개 영상은 브랜드 신뢰도와 직결되므로 전문성과 비용 효율의 균형을 맞춘 조합을 추천합니다. 전문 모델과 스튜디오 촬영으로 깔끔한 이미지를 구축하되, 과도한 비용은 피했습니다.';
          benefits = [
            '전문적인 브랜드 이미지 구축',
            '마케팅 ROI 최적화',
            '다양한 플랫폼 활용 가능',
            '추후 시리즈 제작 시 일관성 유지'
          ];
        } else {
          // 일반적인 마케팅·홍보
          recommendedCombination = {
            '기획·컨셉': { enabled: true, selectedOption: 1 }, // 전문 기획
            '출연진': { enabled: true, selectedOption: 1 }, // 일반인
            '촬영 장소': { enabled: true, selectedOption: 0 }, // 스튜디오
            '촬영 장비': { enabled: true, selectedOption: 1 }, // 전문 카메라
            '조명·스태프': { enabled: true, selectedOption: 1 }, // 기본 팀
            '편집 복잡도': { enabled: true, selectedOption: 1 }, // 일반 편집
            '모션그래픽': { enabled: true, selectedOption: 1 }, // 모션 그래픽
            '사운드 디자인': { enabled: true, selectedOption: 1 } // 맞춤 음향
          };
          totalCost = 3800000;
          reasoning = '마케팅 홍보 영상은 브랜드 메시지 전달력이 핵심입니다. 전문적인 품질을 유지하면서도 합리적인 비용으로 효과적인 마케팅 도구를 제작할 수 있습니다.';
          benefits = [
            '효과적인 브랜드 메시지 전달',
            '마케팅 ROI 최적화',
            'SNS 및 다양한 채널 활용',
            '타겟 대상 맞춤 커뮤니케이션'
          ];
        }
      } else {
        // 기본 추천 조합
        recommendedCombination = {
          '기획·컨셉': { enabled: true, selectedOption: 1 },
          '촬영 장소': { enabled: true, selectedOption: 0 },
          '촬영 장비': { enabled: true, selectedOption: 1 },
          '편집 복잡도': { enabled: true, selectedOption: 1 },
          '사운드 디자인': { enabled: true, selectedOption: 0 }
        };
        totalCost = 2500000;
        reasoning = '선택하신 목적을 기반으로 가장 균형 잡힌 조합을 추천합니다. 품질과 비용의 최적 균형점을 찾았습니다.';
        benefits = [
          '안정적인 품질 보장',
          '합리적인 비용',
          '범용적 활용 가능'
        ];
        confidence = 80;
      }

      setAiRecommendation({
        combination: recommendedCombination,
        reasoning,
        benefits,
        totalCost,
        confidence
      });

    } catch (error) {
      console.error('AI 추천 생성 오류:', error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // AI 추천 적용하기
  const applyAIRecommendation = () => {
    if (!aiRecommendation) return;
    
    setElements(aiRecommendation.combination);
    setShowAIPanel(false);
    
    // 즉시 업데이트
    onUpdate({
      elements: aiRecommendation.combination,
      step5Notes: specialNotes,
      appliedAIRecommendation: true
    });
  };

  // 컴포넌트 마운트 시 AI 추천 생성
  useEffect(() => {
    if (data.purposes && data.purposes.length > 0 && !aiRecommendation) {
      generateAIRecommendation();
      setShowAIPanel(true);
    }
  }, [data.purposes, aiRecommendation]);

  // 🚀 FIXED: 서비스 타입 인식 개선 - 모든 경우에 영상 제작 옵션 반환
  const getElementsByServiceType = (): Element[] => {
    // 모든 서비스 타입에 대해 영상 제작 옵션 반환
    return [
      {
        name: '기획·컨셉',
        type: 'option',
        icon: 'ri-lightbulb-line',
        priceImpact: 0,
        timeImpact: 2,
        description: '영상 기획 및 컨셉 개발',
        options: [
          { 
            label: '기본 기획', 
            value: 0, 
            desc: '간단한 기획안 작성', 
            price: 200000,
            note: '기본 컨셉, 러닝타임 2-3일'
          },
          { 
            label: '전문 기획', 
            value: 1, 
            desc: '상세 기획서 + 스토리보드', 
            price: 500000,
            negotiable: true,
            note: '전문 기획자 투입, 5-7일 소요'
          },
          { 
            label: '프리미엄 기획', 
            value: 2, 
            desc: '완전 맞춤 기획 + 콘티', 
            price: 1200000,
            negotiable: true,
            note: '시니어 기획자 + 콘티 작가, 7-10일',
            volumeNote: '분량별 차등, 복잡도에 따라 협의'
          }
        ]
      },
      {
        name: '스토리보드·콘티',
        type: 'option',
        icon: 'ri-image-2-line',
        priceImpact: 0,
        timeImpact: 1,
        description: '영상 구성 및 콘티 제작',
        options: [
          { 
            label: '기본 콘티', 
            value: 0, 
            desc: '간단한 장면 구성', 
            price: 100000,
            note: '기본 장면 분할, 2일'
          },
          { 
            label: '상세 스토리보드', 
            value: 1, 
            desc: '세밀한 장면별 구성', 
            price: 400000,
            negotiable: true,
            note: '전문 스토리보드 작가, 3-4일'
          },
          { 
            label: '애니매틱', 
            value: 2, 
            desc: '움직이는 콘티 제작', 
            price: 800000,
            negotiable: true,
            note: '프리비즈 수준, 5-6일 소요'
          }
        ]
      },
      {
        name: '출연진',
        type: 'option',
        icon: 'ri-user-line',
        priceImpact: 0,
        timeImpact: 2,
        description: '영상 출연진',
        options: [
          { 
            label: '없음', 
            value: 0, 
            desc: '내레이션만', 
            price: 0,
            note: '출연진 없음'
          },
          { 
            label: '일반인', 
            value: 1, 
            desc: '직원 또는 일반인', 
            price: 200000,
            note: '일반인 출연비, 1일 기준'
          },
          { 
            label: '전문 모델', 
            value: 2, 
            desc: '전문 모델 2-3명', 
            price: 800000,
            negotiable: true,
            note: '모델급 출연진, 1일 기준'
          },
          { 
            label: '유명인', 
            value: 3, 
            desc: '인플루언서/셀럽', 
            price: 3000000, 
            negotiable: true,
            note: '셀럽급, 별도 협의 필수'
          }
        ]
      },
      {
        name: '촬영 장소',
        type: 'option',
        icon: 'ri-map-pin-line',
        priceImpact: 0,
        timeImpact: 1,
        description: '촬영 위치',
        options: [
          { 
            label: '스튜디오', 
            value: 0, 
            desc: '실내 스튜디오 (1일)', 
            price: 500000,
            negotiable: true,
            note: '스튜디오 대여비, 1일 기준'
          },
          { 
            label: '실내', 
            value: 1, 
            desc: '사무실/매장 (1일)', 
            price: 200000,
            note: '실내 촬영비, 1일 기준'
          },
          { 
            label: '야외', 
            value: 2, 
            desc: '야외 로케이션 (1일)', 
            price: 400000,
            negotiable: true,
            note: '로케이션 촬영비, 1일 기준'
          },
          { 
            label: '특수 장소', 
            value: 3, 
            desc: '특별한 촬영지 (1일)', 
            price: 1200000,
            negotiable: true,
            note: '특수 로케이션, 허가비 포함'
          },
          { 
            label: '다중 장소', 
            value: 4, 
            desc: '여러 장소 촬영', 
            price: 800000,
            negotiable: true,
            note: '2-3곳 이상, 일정별 협의'
          }
        ]
      },
      {
        name: '촬영 장비',
        type: 'option',
        icon: 'ri-camera-line',
        priceImpact: 0,
        timeImpact: 1,
        description: '촬영에 사용할 장비',
        options: [
          { 
            label: '기본 장비', 
            value: 0, 
            desc: 'DSLR + 기본 렌즈', 
            price: 300000,
            note: '기본 촬영 장비 세트'
          },
          { 
            label: '전문 카메라', 
            value: 1, 
            desc: '시네마 카메라 + 다양한 렌즈', 
            price: 800000,
            negotiable: true,
            note: '전문 촬영 장비, RED/ARRI급'
          },
          { 
            label: '특수 장비', 
            value: 2, 
            desc: '드론, 짐벌, 특수 렌즈', 
            price: 1500000,
            negotiable: true,
            note: '드론, 크레인, 스테디캠 포함'
          },
          { 
            label: '최고급 장비', 
            value: 3, 
            desc: '8K 시네마 + 모든 특수장비', 
            price: 3000000,
            negotiable: true,
            note: '최고급 장비 풀세트, 협의 필수'
          }
        ]
      },
      {
        name: '조명·스태프',
        type: 'option',
        icon: 'ri-lightbulb-line',
        priceImpact: 0,
        timeImpact: 1,
        description: '조명 및 촬영 스태프',
        options: [
          { 
            label: '최소 인원', 
            value: 0, 
            desc: '촬영감독 1명', 
            price: 400000,
            note: '1인 촬영 시스템, 1일'
          },
          { 
            label: '기본 팀', 
            value: 1, 
            desc: '촬영감독 + 조명감독 + 어시스턴트', 
            price: 1200000,
            negotiable: true,
            note: '3-4명 기본 크루, 1일'
          },
          { 
            label: '전문 팀', 
            value: 2, 
            desc: '풀 크루 + 메이크업 + 스타일리스트', 
            price: 2500000,
            negotiable: true,
            note: '7-8명 전문 크루, 1일'
          },
          { 
            label: '프리미엄 팀', 
            value: 3, 
            desc: '시니어 크루 + 전담 스태프', 
            price: 5000000,
            negotiable: true,
            note: '10명 이상 시니어 크루, 협의 필수'
          }
        ]
      },
      {
        name: '촬영 일정',
        type: 'option',
        icon: 'ri-calendar-line',
        priceImpact: 0,
        timeImpact: 3,
        description: '촬영 소요 일정',
        options: [
          { 
            label: '반나절', 
            value: 0, 
            desc: '4시간 이내', 
            price: 0,
            note: '기본 비용에 포함'
          },
          { 
            label: '1일', 
            value: 1, 
            desc: '8시간 촬영', 
            price: 500000,
            note: '1일 연장 비용'
          },
          { 
            label: '2일', 
            value: 2, 
            desc: '2일간 촬영', 
            price: 1200000,
            negotiable: true,
            note: '2일 촬영, 숙박비 별도'
          },
          { 
            label: '3일 이상', 
            value: 3, 
            desc: '장기간 촬영', 
            price: 2500000,
            negotiable: true,
            note: '3일 이상, 일정별 협의'
          }
        ]
      },
      {
        name: '편집 복잡도',
        type: 'option',
        icon: 'ri-scissors-line',
        priceImpact: 0,
        timeImpact: 2,
        description: '편집 작업의 복잡도',
        options: [
          { 
            label: '단순 편집', 
            value: 0, 
            desc: '컷편집 + 기본 트랜지션', 
            price: 300000,
            note: '기본 편집, 3-4일'
          },
          { 
            label: '일반 편집', 
            value: 1, 
            desc: '트랜지션 + 기본 효과', 
            price: 800000,
            negotiable: true,
            note: '중급 편집, 5-7일'
          },
          { 
            label: '고급 편집', 
            value: 2, 
            desc: '모션그래픽 + VFX', 
            price: 2000000,
            negotiable: true,
            note: '고급 편집, 10-14일'
          },
          { 
            label: '마스터급', 
            value: 3, 
            desc: '최고 수준 편집 + 특수효과', 
            price: 5000000,
            negotiable: true,
            note: '마스터급 편집자, 협의 필수'
          }
        ]
      },
      {
        name: '컬러 그레이딩',
        type: 'option',
        icon: 'ri-palette-line',
        priceImpact: 0,
        timeImpact: 1,
        description: '영상 색감 보정',
        options: [
          { 
            label: '기본 보정', 
            value: 0, 
            desc: '자동 컬러 보정', 
            price: 200000,
            note: '기본 컬러 그레이딩, 2일'
          },
          { 
            label: '전문 보정', 
            value: 1, 
            desc: '수동 색보정 + 룩 개발', 
            price: 600000,
            negotiable: true,
            note: '전문 컬러리스트, 3-4일'
          },
          { 
            label: '시네마틱', 
            value: 2, 
            desc: '영화급 그레이딩', 
            price: 1500000,
            negotiable: true,
            note: '시네마 그레이딩, 5-7일'
          }
        ]
      },
      {
        name: '모션그래픽',
        type: 'option',
        icon: 'ri-magic-line',
        priceImpact: 0,
        timeImpact: 2,
        description: '그래픽 효과 및 애니메이션',
        options: [
          { 
            label: '기본 그래픽', 
            value: 0, 
            desc: '단순 텍스트 + 로고', 
            price: 300000,
            note: '기본 그래픽, 2-3일'
          },
          { 
            label: '모션 그래픽', 
            value: 1, 
            desc: '움직이는 그래픽 + 인포그래픽', 
            price: 800000,
            negotiable: true,
            note: '모션그래픽 디자이너, 5-7일'
          },
          { 
            label: '3D 그래픽', 
            value: 2, 
            desc: '3D 모델링 + 애니메이션', 
            price: 2500000,
            negotiable: true,
            note: '3D 전문가, 10-14일'
          },
          { 
            label: 'VFX', 
            value: 3, 
            desc: '특수효과 + 합성', 
            price: 5000000,
            negotiable: true,
            note: 'VFX 전문팀, 협의 필수'
          }
        ]
      },
      {
        name: '사운드 디자인',
        type: 'option',
        icon: 'ri-music-line',
        priceImpact: 0,
        timeImpact: 1,
        description: '음향 및 음악 작업',
        options: [
          { 
            label: '기본 음향', 
            value: 0, 
            desc: '저작권 프리 음악 + 기본 효과음', 
            price: 200000,
            note: '라이선스 음원, 1-2일'
          },
          { 
            label: '맞춤 음향', 
            value: 1, 
            desc: '브랜드 맞춤 선곡 + 효과음 편집', 
            price: 600000,
            negotiable: true,
            note: '사운드 디자이너, 3-4일'
          },
          { 
            label: '오리지널 작곡', 
            value: 2, 
            desc: '전용 음악 제작 + 완전 믹싱', 
            price: 2000000,
            negotiable: true,
            note: '작곡가 + 믹싱 엔지니어, 7-10일'
          }
        ]
      },
      {
        name: '성우·더빙',
        type: 'option',
        icon: 'ri-mic-line',
        priceImpact: 0,
        timeImpact: 1,
        description: '음성 해설 및 더빙',
        options: [
          { 
            label: '기본 성우', 
            value: 0, 
            desc: '일반 성우 (1분 기준)', 
            price: 200000,
            note: '분량별 차등, 1분당 20만원'
          },
          { 
            label: '전문 성우', 
            value: 1, 
            desc: '경력 성우 (1분 기준)', 
            price: 400000,
            negotiable: true,
            note: '경력 10년 이상, 1분당 40만원'
          },
          { 
            label: '유명 성우', 
            value: 2, 
            desc: '셀럽 성우 (1분 기준)', 
            price: 1500000, 
            negotiable: true,
            note: '유명 성우, 협의 필수'
          }
        ]
      },
      {
        name: '자막·텍스트',
        type: 'option',
        icon: 'ri-text',
        priceImpact: 0,
        timeImpact: 0.5,
        description: '텍스트 및 자막 삽입',
        options: [
          { 
            label: '기본 자막', 
            value: 0, 
            desc: '단순 텍스트 자막', 
            price: 100000,
            note: '분량 무관 고정가'
          },
          { 
            label: '디자인 자막', 
            value: 1, 
            desc: '스타일링 적용 자막', 
            price: 300000,
            negotiable: true,
            note: '복잡도에 따라 협의'
          },
          { 
            label: '애니메이션 자막', 
            value: 2, 
            desc: '모션 효과 자막', 
            price: 600000,
            negotiable: true,
            note: '모션 복잡도에 따라 협의'
          }
        ]
      }
    ];
  };

  const availableElements = getElementsByServiceType();
  const disabledOptions = getDisabledOptions(5, data);

  const isElementDisabled = (elementName: string): boolean => {
    return disabledOptions.elements?.includes(elementName) || false;
  };

  const getDisabledReasonMessage = (elementName: string): string => {
    return getDisabledReason(5, 'elements', elementName, data);
  };

  const updateElement = (elementName: string, enabled: boolean, value?: number) => {
    if (isElementDisabled(elementName) && enabled) return;
    
    const element = availableElements.find(e => e.name === elementName);
    if (!element) return;

    setElements((prev: any) => {
      if (!enabled) {
        const { [elementName]: removed, ...rest } = prev;
        return rest;
      }

      let config: any = { enabled: true };
      
      if (element.type === 'quantity') {
        config.quantity = value || 1;
      } else if (element.type === 'slider') {
        config.level = value || 1;
      } else if (element.type === 'option') {
        config.selectedOption = value || 0;
      }

      return {
        ...prev,
        [elementName]: config
      };
    });
  };

  const calculateImpact = () => {
    let totalPriceImpact = 0;
    let totalTimeImpact = 0;

    Object.entries(elements).forEach(([name, config]: [string, any]) => {
      if (config.enabled) {
        const element = availableElements.find(e => e.name === name);
        if (element) {
          if (element.type === 'option' && element.options) {
            const selectedOption = element.options[config.selectedOption || 0];
            totalPriceImpact += selectedOption.price;
            totalTimeImpact += element.timeImpact;
          } else {
            const multiplier = config.level || config.quantity || 1;
            totalPriceImpact += element.priceImpact * multiplier;
            totalTimeImpact += element.timeImpact * multiplier;
          }
        }
      }
    });

    return { totalPriceImpact, totalTimeImpact };
  };

  const handleNext = () => {
    const { totalPriceImpact, totalTimeImpact } = calculateImpact();
    
    onUpdate({ 
      elements,
      step5Notes: specialNotes,
      // 🚀 FIXED: 5단계 실제 계산값을 7단계로 전달
      calculatedTotalCost: totalPriceImpact,
      calculatedTimeAdd: totalTimeImpact,
      realTimePrice: totalPriceImpact,  // 실시간 가격
      realTimeDays: Math.max(totalTimeImpact, 3)  // 최소 3일 보장
    });
    onNext();
  };

  const { totalPriceImpact, totalTimeImpact } = calculateImpact();

  const getServiceInfo = () => {
    const serviceType = data.serviceType || data.category || 'video';
    
    switch (serviceType) {
      case 'video':
        return {
          title: '영상 제작 세부 옵션',
          description: '기획부터 편집까지 각 단계별 전문 옵션을 선택해주세요.',
          color: 'blue'
        };
      case 'design':
        return {
          title: '디자인 제작 세부 옵션',
          description: '브랜딩부터 웹디자인까지 각 분야별 전문 옵션을 선택해주세요.',
          color: 'green'
        };
      case 'marketing':
        return {
          title: '마케팅 서비스 세부 옵션',
          description: '전략 수립부터 광고 집행까지 각 영역별 전문 옵션을 선택해주세요.',
          color: 'purple'
        };
      default:
        return {
          title: '세부 옵션 선택',
          description: '각 요소별로 구체적인 옵션을 선택해주세요.',
          color: 'blue'
        };
    }
  };

  const serviceInfo = getServiceInfo();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">{serviceInfo.title}</h2>
        <p className="text-gray-600 mb-6">{serviceInfo.description} 실시간으로 비용 변화를 확인할 수 있습니다.</p>
        
        <div className={`bg-${serviceInfo.color}-50 border border-${serviceInfo.color}-200 rounded-lg p-4 mb-6`}>
          <h3 className={`font-medium text-${serviceInfo.color}-800 mb-2`}>
            선택된 서비스: {data.serviceType ? 
              (data.serviceType === 'video' ? '영상 제작' : 
               data.serviceType === 'design' ? '디자인 제작' : '마케팅 서비스') : 
              '영상 제작'}
          </h3>
          <div className="space-y-1 text-sm">
            {data.purposes && data.purposes.length > 0 && (
              <p className={`text-${serviceInfo.color}-700`}>
                <strong>목적:</strong> {data.purposes.join(', ')}
              </p>
            )}
            {data.details && data.details.length > 0 && (
              <p className={`text-${serviceInfo.color}-700`}>
                <strong>세부용도:</strong> {data.details.join(', ')}
              </p>
            )}
            {data.productionType && (
              <p className={`text-${serviceInfo.color}-700`}>
                <strong>제작방식:</strong> {data.productionType}
              </p>
            )}
          </div>
          
          <div className={`mt-3 p-3 bg-${serviceInfo.color}-100 rounded-lg`}>
            <p className={`text-xs text-${serviceInfo.color}-700 font-medium`}>
              💡 {data.serviceType === 'video' ? '영상 제작은 기획→촬영→편집 각 단계별로 세분화된 옵션을 제공합니다' : 
                   data.serviceType === 'design' ? '디자인 서비스는 브랜딩, 웹디자인, 인쇄물 등 분야별 전문 옵션을 제공합니다' : 
                   data.serviceType === 'marketing' ? '마케팅 서비스는 전략, SNS, 광고, 분석 등 영역별 체계적 옵션을 제공합니다' :
                   '각 분야별 전문적이고 세분화된 옵션들을 확인하실 수 있습니다'}
            </p>
          </div>
        </div>

        {/* 논리적 제약 안내 */}
        {(disabledOptions.elements?.length > 0) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-yellow-800 mb-2">
              <i className="ri-information-line mr-2"></i>
              선택 제한 안내
            </h3>
            <p className="text-sm text-yellow-700 mb-2">
              이전 단계에서 선택하신 제작 방식에 따라 일부 요소가 제한됩니다:
            </p>
            <ul className="text-xs text-yellow-600 space-y-1 ml-4">
              {disabledOptions.elements?.map(element => (
                <li key={element}>• {element}: {getDisabledReasonMessage(element)}</li>
              ))}
            </ul>
            <p className="text-xs text-yellow-600 mt-2">
              💡 제한된 요소가 꼭 필요하시다면 아래 '특이사항' 란에 남겨주세요!
            </p>
          </div>
        )}
      </div>

      {/* 🚀 AI 추천 적용 패널 */}
      {showAIPanel && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-green-800 flex items-center">
              <i className="ri-ai-generate mr-2 w-5 h-5 flex items-center justify-center"></i>
              🎯 AI 최적 조합 추천
            </h3>
            <button
              onClick={() => setShowAIPanel(false)}
              className="text-green-600 hover:text-green-800 transition-colors"
            >
              <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
            </button>
          </div>

          {isGeneratingAI ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mb-4"></div>
              <p className="text-green-700 font-medium">목적, 예산, 품질을 종합 분석하여 최적 조합을 찾고 있습니다...</p>
              <p className="text-green-600 text-sm mt-2">업계 경험과 비용 효율성을 반영중입니다</p>
            </div>
          ) : aiRecommendation ? (
            <div className="space-y-4">
              <div className="bg-white border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      AI
                    </div>
                    <div>
                      <div className="font-medium text-green-800">추천 신뢰도</div>
                      <div className="text-sm text-green-600">{aiRecommendation.confidence}% 최적화</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-700 font-bold text-lg">
                      {aiRecommendation.totalCost.toLocaleString()}원
                    </div>
                    <div className="text-green-600 text-sm">예상 총비용</div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-green-800 mb-2">🧠 AI 추천 근거</h4>
                  <p className="text-green-700 text-sm leading-relaxed">{aiRecommendation.reasoning}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-green-800 mb-2">🎯 추천 조합 구성</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {Object.entries(aiRecommendation.combination).map(([key, config]: [string, any]) => {
                      const element = availableElements.find(e => e.name === key);
                      const option = element?.options?.[config.selectedOption];
                      
                      return (
                        <div key={key} className="bg-green-50 p-2 rounded border border-green-200">
                          <div className="font-medium text-green-800">{key}</div>
                          <div className="text-green-600">
                            {option?.label} ({option?.price.toLocaleString()}원)
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-green-800 mb-2">✨ 기대 효과</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    {aiRecommendation.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-1">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={applyAIRecommendation}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <i className="ri-magic-line mr-2"></i>
                    AI 추천대로 적용하기
                  </button>
                  <button
                    onClick={() => generateAIRecommendation()}
                    className="px-4 py-3 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors"
                  >
                    <i className="ri-refresh-line mr-2"></i>
                    다시 추천받기
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <button
                onClick={generateAIRecommendation}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                <i className="ri-ai-generate mr-2"></i>
                AI 최적 조합 추천받기
              </button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 요소 선택 영역 */}
        <div className="lg:col-span-2 space-y-6">
          {availableElements.map((element) => {
            const elementConfig = elements[element.name] || { enabled: false };
            const disabled = isElementDisabled(element.name);
            const reason = disabled ? getDisabledReasonMessage(element.name) : '';
            
            return (
              <div key={element.name} className="relative group">
                <div
                  className={`border rounded-lg transition-all ${
                    disabled
                      ? 'border-gray-200 bg-gray-100 opacity-60'
                      : elementConfig.enabled 
                      ? `border-${serviceInfo.color}-300 bg-${serviceInfo.color}-50` 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {/* 요소 헤더 */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <i className={`${element.icon} w-5 h-5 flex items-center justify-center mr-3 ${disabled ? 'text-gray-400' : 'text-gray-600'}`}></i>
                        <div>
                          <span className={`font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
                            {element.name}
                          </span>
                          {disabled && (
                            <i className="ri-lock-line ml-2 text-gray-400 w-4 h-4 flex items-center justify-center"></i>
                          )}
                          <p className={`text-sm mt-1 ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
                            {element.description}
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={elementConfig.enabled}
                          onChange={(e) => updateElement(element.name, e.target.checked, 0)}
                          disabled={disabled}
                          className={`sr-only peer ${disabled ? 'cursor-not-allowed' : ''}`}
                        />
                        <div className={`w-11 h-6 rounded-full peer transition-colors ${
                          disabled 
                            ? 'bg-gray-200 cursor-not-allowed'
                            : `bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-${serviceInfo.color}-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-${serviceInfo.color}-600`
                        }`}></div>
                      </label>
                    </div>
                  </div>

                  {/* 요소 옵션 */}
                  {elementConfig.enabled && !disabled && (
                    <div className="p-4">
                      {element.type === 'option' && element.options ? (
                        <div className="space-y-3">
                          {element.options.map((option, index) => (
                            <label
                              key={index}
                              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-${serviceInfo.color}-50 transition-colors ${
                                elementConfig.selectedOption === index ? `border-${serviceInfo.color}-500 bg-${serviceInfo.color}-50` : 'border-gray-200'
                              }`}
                            >
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  name={`${element.name}-option`}
                                  checked={elementConfig.selectedOption === index}
                                  onChange={() => updateElement(element.name, true, index)}
                                  className={`mr-3 h-4 w-4 text-${serviceInfo.color}-600 focus:ring-${serviceInfo.color}-500 border-gray-300`}
                                />
                                <div>
                                  <div className="font-medium text-gray-900">{option.label}</div>
                                  <div className="text-sm text-gray-600">{option.desc}</div>
                                  {option.note && (
                                    <div className={`text-xs text-${serviceInfo.color}-600 mt-1`}>💡 {option.note}</div>
                                  )}
                                  {option.volumeNote && (
                                    <div className="text-xs text-orange-600 mt-1">📏 {option.volumeNote}</div>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`font-bold text-${serviceInfo.color}-600`}>
                                  {option.price === 0 ? '무료' : `${option.price.toLocaleString()}원`}
                                  {option.negotiable && ' ~'}
                                </div>
                                {option.negotiable && (
                                  <div className="text-xs text-orange-600 mt-1">
                                    협의 필요
                                  </div>
                                )}
                              </div>
                            </label>
                          ))}
                        </div>
                      ) : element.type === 'quantity' ? (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-600">수량</span>
                            <span className="text-sm font-medium">
                              {elementConfig.quantity || 1}{element.unit}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max={element.maxValue || 10}
                            value={elementConfig.quantity || 1}
                            onChange={(e) => updateElement(element.name, true, parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>1{element.unit}</span>
                            <span>{element.maxValue}{element.unit}</span>
                          </div>
                        </div>
                      ) : element.type === 'slider' ? (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-600">강도</span>
                            <span className="text-sm font-medium">
                              레벨 {elementConfig.level || 1}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max={element.maxValue || 5}
                            value={elementConfig.level || 1}
                            onChange={(e) => updateElement(element.name, true, parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>기본</span>
                            <span>최고</span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
                
                {/* 비활성화 사유 툴팁 */}
                {disabled && reason && (
                  <div className="absolute left-0 top-full mt-1 z-10 hidden group-hover:block">
                    <div className="bg-red-100 border border-red-200 rounded-lg p-2 text-xs text-red-700 whitespace-nowrap shadow-lg">
                      <i className="ri-information-line mr-1 w-3 h-3 flex items-center justify-center"></i>
                      {reason}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 실시간 영향도 미리보기 */}
        <div className={`bg-${serviceInfo.color}-50 p-4 rounded-lg h-fit`}>
          <h3 className={`font-semibold text-${serviceInfo.color}-800 mb-4`}>실시간 비용 계산</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className={`text-${serviceInfo.color}-700 font-medium`}>추가 비용</span>
                <span className={`text-${serviceInfo.color}-800 font-semibold text-lg`}>
                  +{totalPriceImpact.toLocaleString()}원
                </span>
              </div>
              <div className={`w-full bg-${serviceInfo.color}-200 rounded-full h-3`}>
                <div 
                  className={`bg-${serviceInfo.color}-600 h-3 rounded-full transition-all duration-300`}
                  style={{ width: `${Math.min((totalPriceImpact / 5000000) * 100, 100)}%` }}
                ></div>
              </div>
              <div className={`text-xs text-${serviceInfo.color}-600 mt-1`}>최대 500만원 기준</div>
            </div>

            {Object.entries(elements).filter(([_, config]: [string, any]) => config.enabled).length > 0 && (
              <div className={`mt-4 pt-4 border-t border-${serviceInfo.color}-200`}>
                <h4 className={`text-sm font-medium text-${serviceInfo.color}-800 mb-3`}>선택된 옵션</h4>
                <div className="space-y-2">
                  {Object.entries(elements)
                    .filter(([_, config]: [string, any]) => config.enabled)
                    .map(([name, config]: [string, any]) => {
                      const element = availableElements.find(e => e.name === name);
                      let optionText = '';
                      let optionPrice = 0;
                      let isNegotiable = false;

                      if (element?.type === 'option' && element.options) {
                        const selectedOption = element.options[config.selectedOption || 0];
                        optionText = selectedOption.label;
                        optionPrice = selectedOption.price;
                        isNegotiable = selectedOption.negotiable || false;
                      } else if (element?.type === 'quantity') {
                        optionText = `${config.quantity}${element.unit}`;
                        optionPrice = element.priceImpact * config.quantity;
                      } else if (element?.type === 'slider') {
                        optionText = `레벨 ${config.level}`;
                        optionPrice = element.priceImpact * config.level;
                      }

                      return (
                        <div key={name} className={`bg-white p-2 rounded border border-${serviceInfo.color}-100`}>
                          <div className="flex justify-between items-center">
                            <div>
                              <div className={`text-sm font-medium text-${serviceInfo.color}-800`}>{name}</div>
                              <div className={`text-xs text-${serviceInfo.color}-600`}>{optionText}</div>
                            </div>
                            <div className={`text-sm font-bold text-${serviceInfo.color}-700`}>
                              {optionPrice === 0 ? '무료' : `${optionPrice.toLocaleString()}원`}
                              {isNegotiable && ' ~'}
                            </div>
                          </div>
                          {isNegotiable && (
                            <div className="text-xs text-orange-600 mt-1">
                              💡 실제 비용은 협의 후 확정
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {Object.keys(elements).length === 0 && (
              <div className="text-center py-8">
                <i className={`ri-information-line text-${serviceInfo.color}-400 text-2xl mb-2`}></i>
                <p className={`text-${serviceInfo.color}-600 text-sm`}>
                  필요한 옵션을 선택해주세요
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 특이사항 입력란 */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-medium text-orange-800 mb-3">
          <i className="ri-sticky-note-line mr-2"></i>
          특이사항 및 추가 요청사항
        </h3>
        <textarea
          value={specialNotes}
          onChange={(e) => setSpecialNotes(e.target.value)}
          placeholder="예: 제한된 요소이지만 꼭 필요해요 / 특별한 옵션 조합이 필요해요 / 추가 요소가 필요해요 / AI 추천과 다른 방향을 원해요 등"
          className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-white"
          rows={4}
        />
        <p className="text-xs text-orange-700 mt-2">
          💡 선택할 수 없는 요소나 AI 추천과 다른 특별한 제작 요구사항이 있으시면 자유롭게 작성해주세요!
        </p>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onPrev}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium whitespace-nowrap cursor-pointer hover:bg-gray-200 transition-colors"
        >
          이전으로
        </button>
        <button
          onClick={handleNext}
          className={`px-6 py-2 bg-${serviceInfo.color}-600 text-white rounded-lg font-medium whitespace-nowrap cursor-pointer hover:bg-${serviceInfo.color}-700 transition-colors`}
        >
          다음으로
        </button>
      </div>
    </div>
  );
}
