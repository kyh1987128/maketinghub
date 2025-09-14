
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
    detailNote?: string; // 🚀 NEW: 상세 설명
  }>;
}

interface AIRecommendation {
  combination: { [key: string]: any };
  reasoning: string;
  benefits: string[];
  totalCost: number;
  confidence: number;
}

export default function Step5MarketingElements({ data, onUpdate, onNext, onPrev }: Props) {
  const [elements, setElements] = useState(data.elements || {});
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  // 🚀 NEW: 최종 견적서 상태
  const [showFinalEstimate, setShowFinalEstimate] = useState(false);

  // 🚀 AI 최적 조합 추천 생성 로직
  const generateAIRecommendation = async () => {
    setIsGeneratingAI(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const purposes = data.purposes || [];
      const details = data.details || [];
      const scale = data.scale || {};
      
      let recommendedCombination: { [key: string]: any } = {};
      let reasoning = '';
      let benefits: string[] = [];
      let totalCost = 0;
      let confidence = 92;

      // 목적별 최적 조합 로직
      if (purposes.includes('틱톡 마케팅')) {
        if (details.includes('제품·서비스 소개')) {
          recommendedCombination = {
            '마케팅 전략': { enabled: true, selectedOption: 1 }, // 전문 마케팅 전략
            'SNS 관리': { enabled: true, selectedOption: 1 }, // 전문 SNS 관리
            '콘텐츠 제작': { enabled: true, selectedOption: 1 }, // 전문 콘텐츠
            '광고 운영': { enabled: true, selectedOption: 1 }, // 전문 광고 운영
            '인플루언서': { enabled: true, selectedOption: 1 }, // 마이크로 인플루언서
            '성과 리포트': { enabled: true, selectedOption: 1 } // 전문 리포트
          };
          totalCost = 4200000;
          reasoning = '틱톡 마케팅은 짧은 형태의 콘텐츠와 트렌드 반응이 핵심입니다. 전문적인 콘텐츠 제작과 인플루언서 활용을 통해 Z세대 타겟에게 효과적으로 도달할 수 있는 조합을 추천합니다.';
          benefits = [
            '틱톡 알고리즘 최적화된 콘텐츠 제작',
            'Z세대 타겟 맞춤 마케팅 전략',
            '바이럴 가능성이 높은 콘텐츠 구성',
            '실시간 트렌드 반영 및 대응'
          ];
        } else {
          // 일반적인 틱톡 마케팅
          recommendedCombination = {
            '마케팅 전략': { enabled: true, selectedOption: 0 },
            'SNS 관리': { enabled: true, selectedOption: 1 },
            '콘텐츠 제작': { enabled: true, selectedOption: 1 },
            '광고 운영': { enabled: true, selectedOption: 0 }
          };
          totalCost = 3200000;
          reasoning = '틱톡 플랫폼의 특성을 살린 효율적인 마케팅 조합입니다. 콘텐츠 품질과 비용 효율성의 균형을 맞췄습니다.';
          benefits = [
            '효과적인 틱톡 마케팅 실행',
            '합리적인 비용 구조',
            '트렌드 기반 콘텐츠 제작'
          ];
        }
      } else {
        // 기본 추천 조합
        recommendedCombination = {
          '마케팅 전략': { enabled: true, selectedOption: 0 },
          'SNS 관리': { enabled: true, selectedOption: 0 },
          '콘텐츠 제작': { enabled: true, selectedOption: 0 },
          '광고 운영': { enabled: true, selectedOption: 0 }
        };
        totalCost = 2700000;
        reasoning = '선택하신 목적을 기반으로 가장 균형 잡힌 마케팅 조합을 추천합니다. 품질과 비용의 최적 균형점을 찾았습니다.';
        benefits = [
          '안정적인 마케팅 품질',
          '합리적인 비용',
          '범용적 활용 가능'
        ];
        confidence = 85;
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
    
    onUpdate({
      elements: aiRecommendation.combination,
      appliedAIRecommendation: true
    });
  };

  useEffect(() => {
    if (data.purposes && data.purposes.length > 0 && !aiRecommendation) {
      generateAIRecommendation();
      setShowAIPanel(true);
    }
  }, [data.purposes, aiRecommendation]);

  // 📢 마케팅 서비스 전용 옵션들
  const marketingElements: Element[] = [
    {
      name: '마케팅 전략',
      type: 'option',
      icon: 'ri-rocket-line',
      priceImpact: 0,
      timeImpact: 3,
      description: '종합 마케팅 전략 수립',
      options: [
        { 
          label: '기본 전략', 
          value: 0, 
          desc: '간단한 마케팅 플랜 + 타겟 분석', 
          price: 500000,
          note: '기본 마케팅 전략, 5-7일',
          detailNote: '시장 분석, 경쟁사 분석, 기본 타겟 설정, 마케팅 목표 수립, 예산 배분 계획'
        },
        { 
          label: '전문 마케팅 전략', 
          value: 1, 
          desc: '심화 시장분석 + 전략 수립', 
          price: 1200000,
          negotiable: true,
          note: '마케팅 전략가 투입, 10-14일',
          detailNote: '심화 시장조사, 페르소나 개발, SWOT 분석, 마케팅 믹스 전략, 세부 실행 계획, 성과 지표 설정'
        },
        { 
          label: '종합 마케팅 컨설팅', 
          value: 2, 
          desc: '완전 맞춤 전략 + 실행 로드맵', 
          price: 3000000,
          negotiable: true,
          note: '시니어 마케팅 컨설턴트, 21일',
          volumeNote: '기업 규모별 차등, 복잡도에 따라 협의',
          detailNote: '전략 컨설팅, 브랜드 포지셔닝, 통합 마케팅 전략, 장기 로드맵, 조직 구성 제안, 시스템 구축 가이드'
        }
      ]
    },
    {
      name: 'SNS 관리',
      type: 'option',
      icon: 'ri-share-line',
      priceImpact: 0,
      timeImpact: 1,
      description: '소셜미디어 계정 운영 관리',
      options: [
        { 
          label: '기본 SNS 관리', 
          value: 0, 
          desc: '1개 채널 + 주 3회 포스팅', 
          price: 800000,
          note: 'SNS 관리자, 월 단위',
          detailNote: '플랫폼 1개 관리, 주 3회 포스팅, 기본 디자인, 댓글 관리, 월간 리포트'
        },
        { 
          label: '전문 SNS 관리', 
          value: 1, 
          desc: '2-3개 채널 + 일일 포스팅', 
          price: 1800000,
          negotiable: true,
          note: 'SNS 전문가, 월 단위',
          detailNote: '플랫폼 2-3개 관리, 일일 포스팅, 전문 디자인, 실시간 소통, 해시태그 최적화, 주간 분석 리포트'
        },
        { 
          label: '프리미엄 SNS', 
          value: 2, 
          desc: '다채널 + 실시간 대응', 
          price: 3500000,
          negotiable: true,
          note: 'SNS 전담팀, 월 단위',
          detailNote: '전채널 관리, 실시간 포스팅, 라이브 방송 기획, 이벤트 운영, 인플루언서 협업, 일일 분석 리포트'
        },
        { 
          label: '종합 소셜미디어', 
          value: 3, 
          desc: '전 채널 + 커뮤니티 관리', 
          price: 6000000,
          negotiable: true,
          note: '소셜미디어 전문팀, 협의 필수',
          detailNote: '전플랫폼 통합 관리, 커뮤니티 운영, 24시간 모니터링, 위기관리, 바이럴 마케팅, 실시간 대시보드'
        }
      ]
    },
    {
      name: '콘텐츠 제작',
      type: 'option',
      icon: 'ri-file-text-line',
      priceImpact: 0,
      timeImpact: 2,
      description: '마케팅 콘텐츠 기획 및 제작',
      options: [
        { 
          label: '기본 콘텐츠', 
          value: 0, 
          desc: '월 10개 포스팅 콘텐츠', 
          price: 600000,
          note: '콘텐츠 작가, 월 단위',
          detailNote: '월 10개 포스트, 기본 텍스트 콘텐츠, 무료 이미지 활용, 간단한 그래픽 편집'
        },
        { 
          label: '전문 콘텐츠', 
          value: 1, 
          desc: '월 20개 + 이미지/영상', 
          price: 1500000,
          negotiable: true,
          note: '콘텐츠 전문팀, 월 단위',
          detailNote: '월 20개 포스트, 전문 카피라이팅, 맞춤 그래픽 디자인, 기본 영상 편집, 인포그래픽 제작'
        },
        { 
          label: '프리미엄 콘텐츠', 
          value: 2, 
          desc: '무제한 + 전문 크리에이티브', 
          price: 3000000,
          negotiable: true,
          note: '크리에이티브 디렉터, 월 단위',
          detailNote: '무제한 콘텐츠, 크리에이티브 기획, 전문 영상 제작, 3D 그래픽, 인터랙티브 콘텐츠, 바이럴 콘텐츠 기획'
        }
      ]
    },
    {
      name: '광고 운영',
      type: 'option',
      icon: 'ri-advertisement-line',
      priceImpact: 0,
      timeImpact: 2,
      description: '온라인 광고 캠페인 운영',
      options: [
        { 
          label: '기본 광고 운영', 
          value: 0, 
          desc: '구글/페이스북 기본 광고', 
          price: 800000,
          note: '광고 운영자, 월 단위 (광고비 별도)',
          detailNote: '구글 광고, 페이스북 광고 운영, 기본 타겟팅, 주간 최적화, 월간 성과 리포트 (광고비 월 100만원 이상 권장)'
        },
        { 
          label: '전문 광고 운영', 
          value: 1, 
          desc: '다채널 + 최적화', 
          price: 1800000,
          negotiable: true,
          note: '광고 전문가, 월 단위 (광고비 별도)',
          detailNote: '구글, 페이스북, 인스타그램, 네이버 광고 통합 운영, 정밀 타겟팅, 일일 최적화, A/B 테스트, 주간 분석 리포트'
        },
        { 
          label: '고급 광고 운영', 
          value: 2, 
          desc: '전채널 + AI 최적화', 
          price: 3500000,
          negotiable: true,
          note: '광고 전문팀, 월 단위 (광고비 별도)',
          detailNote: '전플랫폼 통합 광고 운영, AI 기반 자동 최적화, 실시간 입찰 관리, 동적 광고 생성, 고급 분석 및 예측 모델'
        }
      ]
    },
    {
      name: '퍼포먼스 마케팅',
      type: 'option',
      icon: 'ri-line-chart-line',
      priceImpact: 0,
      timeImpact: 2,
      description: '성과 중심 마케팅 운영',
      options: [
        { 
          label: '기본 퍼포먼스', 
          value: 0, 
          desc: 'CPA/ROAS 기반 운영', 
          price: 1200000,
          note: '퍼포먼스 마케터, 월 단위',
          detailNote: 'CPA, ROAS 목표 설정, 기본 추적 설정, 전환 최적화, 주간 성과 분석'
        },
        { 
          label: '고급 퍼포먼스', 
          value: 1, 
          desc: '데이터 기반 최적화', 
          price: 2500000,
          negotiable: true,
          note: '데이터 분석가 + 마케터, 월 단위',
          detailNote: '고급 추적 설정, 멀티터치 어트리뷰션, 코호트 분석, 예측 모델링, 자동화 시스템 구축'
        }
      ]
    },
    {
      name: '인플루언서',
      type: 'option',
      icon: 'ri-user-star-line',
      priceImpact: 0,
      timeImpact: 2,
      description: '인플루언서 마케팅',
      options: [
        { 
          label: '마이크로 인플루언서', 
          value: 0, 
          desc: '팔로워 1-10만 인플루언서 5명', 
          price: 1500000,
          note: '인플루언서 매칭 + 관리, 월 단위',
          detailNote: '마이크로 인플루언서 5명 섭외, 콘텐츠 기획, 협업 관리, 성과 트래킹 (인플루언서 비용 별도)'
        },
        { 
          label: '매크로 인플루언서', 
          value: 1, 
          desc: '팔로워 10-100만 인플루언서 2-3명', 
          price: 3000000,
          negotiable: true,
          note: '인플루언서 전문 에이전시, 월 단위',
          detailNote: '매크로 인플루언서 2-3명 섭외, 전략적 콘텐츠 기획, 브랜드 협업 관리, ROI 분석 (인플루언서 비용 별도)'
        },
        { 
          label: '셀럽 인플루언서', 
          value: 2, 
          desc: '유명인/셀럽 인플루언서', 
          price: 8000000,
          negotiable: true,
          note: '셀럽 매니지먼트, 협의 필수',
          detailNote: '셀럽 인플루언서 섭외, 브랜드 앰버서더 계약, 통합 캠페인 기획, 미디어 노출 관리 (출연료 별도 협의)'
        }
      ]
    },
    {
      name: '브랜드 콘텐츠',
      type: 'option',
      icon: 'ri-heart-line',
      priceImpact: 0,
      timeImpact: 3,
      description: '브랜드 스토리텔링 콘텐츠',
      options: [
        { 
          label: '기본 브랜드 콘텐츠', 
          value: 0, 
          desc: '월 5개 브랜드 스토리', 
          price: 800000,
          note: '브랜드 콘텐츠 작가, 월 단위',
          detailNote: '월 5개 브랜드 스토리 콘텐츠, 기업 소개, 제품 스토리, 고객 후기 콘텐츠'
        },
        { 
          label: '전문 브랜드 콘텐츠', 
          value: 1, 
          desc: '월 10개 + 영상 스토리', 
          price: 2000000,
          negotiable: true,
          note: '브랜드 스토리텔러, 월 단위',
          detailNote: '월 10개 브랜드 콘텐츠, 영상 스토리텔링, 브랜드 다큐멘터리, 임직원 인터뷰, 비하인드 스토리'
        }
      ]
    },
    {
      name: '이메일 마케팅',
      type: 'option',
      icon: 'ri-mail-line',
      priceImpact: 0,
      timeImpact: 1,
      description: '이메일 뉴스레터 및 마케팅',
      options: [
        { 
          label: '기본 이메일 마케팅', 
          value: 0, 
          desc: '주간 뉴스레터 + 이벤트 메일', 
          price: 400000,
          note: '이메일 마케터, 월 단위',
          detailNote: '주간 뉴스레터 4회, 프로모션 이메일, 기본 템플릿 디자인, 기본 세그먼트 관리'
        },
        { 
          label: '전문 이메일 마케팅', 
          value: 1, 
          desc: '자동화 + 개인화', 
          price: 1000000,
          negotiable: true,
          note: '이메일 자동화 전문가, 월 단위',
          detailNote: '마케팅 자동화 설정, 개인화 이메일, 드립 캠페인, 고급 세그멘테이션, A/B 테스트, 상세 분석 리포트'
        }
      ]
    },
    {
      name: '전환 최적화',
      type: 'option',
      icon: 'ri-target-line',
      priceImpact: 0,
      timeImpact: 2,
      description: '웹사이트 전환율 최적화',
      options: [
        { 
          label: '기본 CRO', 
          value: 0, 
          desc: '랜딩페이지 최적화', 
          price: 800000,
          note: 'CRO 전문가, 월 단위',
          detailNote: '랜딩페이지 분석, 기본 A/B 테스트, 전환 퍼널 최적화, 월간 개선 리포트'
        },
        { 
          label: '고급 CRO', 
          value: 1, 
          desc: '전체 사이트 최적화', 
          price: 1800000,
          negotiable: true,
          note: 'CRO 전문팀, 월 단위',
          detailNote: '전체 웹사이트 분석, 멀티베리어트 테스트, 사용자 행동 분석, 히트맵 분석, 개인화 구현'
        }
      ]
    },
    {
      name: '데이터 분석',
      type: 'option',
      icon: 'ri-bar-chart-box-line',
      priceImpact: 0,
      timeImpact: 1,
      description: '마케팅 성과 데이터 분석',
      options: [
        { 
          label: '기본 데이터 분석', 
          value: 0, 
          desc: '월간 성과 분석 리포트', 
          price: 600000,
          note: '데이터 분석가, 월 단위',
          detailNote: '기본 KPI 추적, GA4 분석, 월간 대시보드, 성과 요약 리포트'
        },
        { 
          label: '고급 데이터 분석', 
          value: 1, 
          desc: '실시간 대시보드 + 예측 분석', 
          price: 1500000,
          negotiable: true,
          note: '시니어 데이터 분석가, 월 단위',
          detailNote: '실시간 대시보드 구축, 예측 모델링, 코호트 분석, 어트리뷰션 분석, 비즈니스 인사이트 제공'
        }
      ]
    },
    {
      name: '마케팅 자동화',
      type: 'option',
      icon: 'ri-robot-line',
      priceImpact: 0,
      timeImpact: 3,
      description: '마케팅 프로세스 자동화',
      options: [
        { 
          label: '기본 자동화', 
          value: 0, 
          desc: '이메일 자동화 + 리드 관리', 
          price: 1000000,
          note: '마케팅 자동화 전문가, 월 단위',
          detailNote: '이메일 마케팅 자동화, 리드 스코어링, 기본 워크플로우 설정, CRM 연동'
        },
        { 
          label: '고급 자동화', 
          value: 1, 
          desc: '통합 마케팅 자동화', 
          price: 2500000,
          negotiable: true,
          note: '마케팅 자동화 아키텍트, 월 단위',
          detailNote: '옴니채널 자동화, 고급 세그멘테이션, 개인화 컨텐츠, 예측 분석 기반 자동화, API 통합'
        }
      ]
    },
    {
      name: '성과 리포트',
      type: 'option',
      icon: 'ri-file-chart-line',
      priceImpact: 0,
      timeImpact: 1,
      description: '마케팅 성과 리포팅',
      options: [
        { 
          label: '기본 리포트', 
          value: 0, 
          desc: '월간 성과 요약 리포트', 
          price: 300000,
          note: '리포트 작성자, 월 단위',
          detailNote: '월간 KPI 요약, 기본 차트, 간단한 인사이트, PPT 형태 리포트'
        },
        { 
          label: '전문 리포트', 
          value: 1, 
          desc: '상세 분석 + 개선 제안', 
          price: 800000,
          negotiable: true,
          note: '마케팅 애널리스트, 월 단위',
          detailNote: '상세 성과 분석, 경쟁사 벤치마킹, 개선 제안, 예측 분석, 인터랙티브 대시보드'
        },
        { 
          label: '경영진 리포트', 
          value: 2, 
          desc: '경영진 대상 전략 리포트', 
          price: 1500000,
          negotiable: true,
          note: '시니어 컨설턴트, 월 단위',
          detailNote: '경영진 맞춤 전략 리포트, ROI 분석, 시장 기회 분석, 예산 최적화 제안, 분기별 전략 수정안'
        }
      ]
    }
  ];

  const disabledOptions = getDisabledOptions(5, data);

  const isElementDisabled = (elementName: string): boolean => {
    return disabledOptions.elements?.includes(elementName) || false;
  };

  const getDisabledReasonMessage = (elementName: string): string => {
    return getDisabledReason(5, 'elements', elementName, data);
  };

  const updateElement = (elementName: string, enabled: boolean, value?: number) => {
    if (isElementDisabled(elementName) && enabled) return;
    
    const element = marketingElements.find(e => e.name === elementName);
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
        const element = marketingElements.find(e => e.name === name);
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

  // 🚀 NEW: AI 종합평가 계산 함수
  const calculateAIOverallRating = () => {
    const purposes = data.purposes || [];
    const details = data.details || [];
    const scale = data.scale || {};
    const { totalPriceImpact } = calculateImpact();
    
    let rating = 3.0; // 기본 별점
    let reasons = [];
    let recommendations = [];
    
    // 목적 대비 비용 분석
    const isExpensive = totalPriceImpact > 4000000;
    const isCheap = totalPriceImpact < 2000000;
    const isTikTokMarketing = purposes.includes('틱톡 마케팅');
    const isSNSMarketing = purposes.includes('SNS 마케팅');
    
    // 비용 적정성 평가
    if (isTikTokMarketing && totalPriceImpact >= 3000000) {
      rating += 0.8;
      reasons.push('틱톡 마케팅은 짧은 형태의 콘텐츠와 트렌드 반응이 핵심입니다. 전문적인 콘텐츠 제작과 인플루언서 활용을 통해 Z세대 타겟에게 효과적으로 도달할 수 있는 조합을 추천합니다.');
    } else if (isTikTokMarketing && isCheap) {
      rating -= 0.6;
      reasons.push('틱톡 마케팅 목적 대비 투자 부족');
      recommendations.push('Z세대 타겟을 위한 콘텐츠 제작 예산 증액 고려');
    }
    
    if (isSNSMarketing && totalPriceImpact >= 2500000) {
      rating += 0.6;
      reasons.push('SNS 마케팅에 충분한 예산 배정');
    } else if (isSNSMarketing && isCheap) {
      rating -= 0.5;
      reasons.push('SNS 마케팅 효과를 위한 예산 부족');
      recommendations.push('콘텐츠 품질과 운영 빈도 향상을 위한 투자 필요');
    }
    
    // 옵션 조합 분석
    const selectedOptionsCount = Object.keys(elements).filter(k => elements[k]?.enabled).length;
    const hasHighEndOptions = Object.entries(elements).some(([name, config]: [string, any]) => {
      if (!config.enabled) return false;
      const element = marketingElements.find(e => e.name === name);
      return element?.options && config.selectedOption >= 2;
    });
    
    if (selectedOptionsCount >= 5 && hasHighEndOptions) {
      rating += 0.6;
      reasons.push('통합적이고 전문적인 마케팅 조합');
    } else if (selectedOptionsCount < 3) {
      rating -= 0.4;
      reasons.push('선택 옵션이 다소 제한적');
      recommendations.push('마케팅 효과 극대화를 위한 추가 옵션 고려');
    }
    
    // 마케팅 서비스 특성 분석
    const hasContentCreation = Object.keys(elements).some(k => k.includes('콘텐츠') && elements[k]?.enabled);
    const hasSNSManagement = Object.keys(elements).some(k => k.includes('SNS') && elements[k]?.enabled);
    const hasAdvertising = Object.keys(elements).some(k => k.includes('광고') && elements[k]?.enabled);
    
    if (hasContentCreation && hasSNSManagement && hasAdvertising) {
      rating += 0.5;
      reasons.push('콘텐츠-운영-광고 통합 마케팅 구성');
    } else if (!hasContentCreation && hasSNSManagement) {
      rating -= 0.3;
      reasons.push('SNS 운영 대비 콘텐츠 제작 부족');
      recommendations.push('양질의 콘텐츠 제작으로 SNS 효과 극대화');
    }
    
    // 규모 대비 분석
    if (scale.type === '대기업·기관' && totalPriceImpact < 3000000) {
      rating -= 0.8;
      reasons.push('대기업 규모 대비 마케팅 투자 부족');
      recommendations.push('브랜드 위상에 맞는 마케팅 투자 확대 필요');
    } else if (scale.type === '스타트업·개인' && totalPriceImpact > 4000000) {
      rating -= 0.4;
      reasons.push('스타트업 규모 대비 과도한 마케팅 투자');
      recommendations.push('단계적 마케팅 확장 전략 고려');
    }
    
    // 최신 트렌드 반영도
    const hasTrendOptions = Object.keys(elements).some(k => 
      k.includes('인플루언서') || k.includes('자동화') || k.includes('데이터 분석')
    );
    if (hasTrendOptions) {
      rating += 0.4;
      reasons.push('최신 마케팅 트렌드 반영');
    }
    
    // 최종 별점 보정 (1.0 ~ 5.0)
    rating = Math.max(1.0, Math.min(5.0, rating));
    
    return {
      rating: Math.round(rating * 10) / 10,
      reasons,
      recommendations,
      budgetAnalysis: {
        isOptimal: rating >= 3.5,
        isExpensive: totalPriceImpact > 4000000,
        isCheap: totalPriceImpact < 2000000
      }
    };
  };

  // 🚀 NEW: 최종 견적서 생성 함수
  const generateFinalEstimate = () => {
    const { totalPriceImpact, totalTimeImpact } = calculateImpact();
    
    onUpdate({
      elements,
      calculatedTotalCost: totalPriceImpact,
      realTimePrice: totalPriceImpact,
      realTimeDays: Math.max(totalTimeImpact, 3),
      finalEstimateGenerated: true
    });
    
    setShowFinalEstimate(true);
  };

  // 🚀 NEW: 견적서 인쇄 함수
  const handlePrintEstimate = () => {
    const { totalPriceImpact, totalTimeImpact } = calculateImpact();
    const finalDays = Math.max(totalTimeImpact, 3);
    
    // 서비스별 단계 분배
    const getPhases = () => [
      { name: '마케팅 전략 수립', days: Math.ceil(finalDays * 0.3) },
      { name: '캠페인 기획 및 준비', days: Math.ceil(finalDays * 0.3) },
      { name: '시스템 구축 및 셋업', days: Math.ceil(finalDays * 0.3) },
      { name: '마케팅 실행 시작', days: Math.ceil(finalDays * 0.1) }
    ];

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>마케팅 서비스 최종 견적서</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .section { margin-bottom: 30px; page-break-inside: avoid; }
            .section h2 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
            .info-box { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
            .price-highlight { font-size: 24px; font-weight: bold; color: #2563eb; text-align: center; padding: 20px; background: #f0f9ff; border-radius: 10px; }
            .timeline-item { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee; }
            .breakdown-item { display: flex; justify-content: space-between; padding: 8px 0; }
            ul { padding-left: 20px; }
            li { margin-bottom: 5px; }
            @media print { body { margin: 0; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📢 마케팅 서비스 최종 견적서</h1>
            <p>발행일: ${new Date().toLocaleDateString('ko-KR')}</p>
          </div>
          
          <div class="section">
            <h2>📋 프로젝트 개요</h2>
            <div class="info-grid">
              <div class="info-box">
                <h3>서비스 분야</h3>
                <p>마케팅 서비스</p>
              </div>
              <div class="info-box">
                <h3>선택된 목적</h3>
                <p>${(data.purposes || []).join(', ') || '미지정'}</p>
              </div>
            </div>
            <div class="info-box">
              <h3>프로젝트 설명</h3>
              <p>${data.userInput || '추가 설명 없음'}</p>
            </div>
          </div>

          <div class="section">
            <h2>🎯 타겟 대상</h2>
            <div class="info-grid">
              <div class="info-box">
                <h3>연령대</h3>
                <p>${(data.targetData?.ageGroups || []).join(', ') || '미지정'}</p>
              </div>
              <div class="info-box">
                <h3>성별</h3>
                <p>${(data.targetData?.gender || []).join(', ') || '미지정'}</p>
              </div>
              <div class="info-box">
                <h3>지역</h3>
                <p>${(data.targetData?.regions || []).join(', ') || '미지정'}</p>
              </div>
              <div class="info-box">
                <h3>관심사</h3>
                <p>${(data.targetData?.interests || []).join(', ') || '미지정'}</p>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>📝 세부 용도 및 규모</h2>
            <div class="info-grid">
              <div class="info-box">
                <h3>세부 용도</h3>
                <p>${(data.details || []).join(', ') || '미지정'}</p>
              </div>
              <div class="info-box">
                <h3>프로젝트 규모</h3>
                <p>${data.scale?.type || '미지정'}: ${data.scale?.value || ''}</p>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>⚙️ 선택된 세부 옵션</h2>
            <div class="info-box">
              ${Object.keys(elements).filter(key => elements[key]?.enabled).map(key => {
                const element = marketingElements.find(e => e.name === key);
                const config = elements[key];
                const option = element?.options?.[config.selectedOption || 0];
                return `<div class="breakdown-item">
                  <span>${key}</span>
                  <span>${option?.label || '기본'} (${option?.price?.toLocaleString() || 0}원)</span>
                </div>`;
              }).join('') || '<p>선택된 옵션 없음</p>'}
            </div>
          </div>

          <div class="section">
            <h2>💰 최종 견적</h2>
            <div class="price-highlight">
              총 제작비용: ${totalPriceImpact.toLocaleString()}원
              <br><small>부가세 별도 (월 단위 서비스 포함)</small>
            </div>
          </div>

          <div class="section">
            <h2>📅 예상 일정</h2>
            <div class="info-box">
              <div class="price-highlight">
                총 셋업 기간: ${finalDays}일
              </div>
              <h3>단계별 일정</h3>
              ${getPhases().map(phase => 
                `<div class="timeline-item">
                  <span>${phase.name}</span>
                  <span>${phase.days}일</span>
                </div>`
              ).join('')}
              <p style="margin-top: 15px; font-style: italic; color: #666;">
                * 마케팅 서비스는 지속적인 월 단위 서비스입니다.
              </p>
            </div>
          </div>

          <div class="section">
            <p style="text-align: center; color: #666; font-size: 12px; margin-top: 40px;">
              본 견적서는 마케팅 서비스 견적 시스템을 통해 생성되었습니다.<br>
              정확한 견적은 상담을 통해 확정됩니다.
            </p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const { totalPriceImpact, totalTimeImpact } = calculateImpact();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">📢 마케팅 서비스 세부 옵션</h2>
        <p className="text-gray-600 mb-6">전략 수립부터 광고 집행까지 각 영역별 전문 옵션을 선택해주세요. 실시간으로 비용 변화를 확인할 수 있습니다.</p>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-purple-800 mb-2">
            선택된 서비스: 마케팅 서비스
          </h3>
          <div className="space-y-1 text-sm">
            {data.purposes && data.purposes.length > 0 && (
              <p className="text-purple-700">
                <strong>목적:</strong> {data.purposes.join(', ')}
              </p>
            )}
            {data.details && data.details.length > 0 && (
              <p className="text-purple-700">
                <strong>세부용도:</strong> {data.details.join(', ')}
              </p>
            )}
          </div>
          
          <div className="mt-3 p-3 bg-purple-100 rounded-lg">
            <p className="text-xs text-purple-700 font-medium">
              💡 마케팅 서비스는 전략, SNS, 광고, 분석 등 영역별 체계적 옵션을 제공합니다
            </p>
          </div>
        </div>

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
                      const element = marketingElements.find(e => e.name === key);
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
          {marketingElements.map((element) => {
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
                      ? 'border-purple-300 bg-purple-50' 
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
                            : 'bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600'
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
                              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-purple-50 transition-colors ${
                                elementConfig.selectedOption === index ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                              }`}
                            >
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  name={`${element.name}-option`}
                                  checked={elementConfig.selectedOption === index}
                                  onChange={() => updateElement(element.name, true, index)}
                                  className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                                />
                                <div>
                                  <div className="font-medium text-gray-900">{option.label}</div>
                                  <div className="text-sm text-gray-600">{option.desc}</div>
                                  {option.note && (
                                    <div className="text-xs text-purple-600 mt-1">💡 {option.note}</div>
                                  )}
                                  {option.volumeNote && (
                                    <div className="text-xs text-orange-600 mt-1">📏 {option.volumeNote}</div>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-purple-600">
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
        <div className="bg-purple-50 p-4 rounded-lg h-fit">
          <h3 className="font-semibold text-purple-800 mb-4">실시간 비용 계산</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-purple-700 font-medium">추가 비용</span>
                <span className="text-purple-800 font-semibold text-lg">
                  +{totalPriceImpact.toLocaleString()}원
                </span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-3">
                <div 
                  className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((totalPriceImpact / 8000000) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-purple-600 mt-1">최대 800만원 기준</div>
            </div>

            {Object.entries(elements).filter(([_, config]: [string, any]) => config.enabled).length > 0 && (
              <div className="mt-4 pt-4 border-t border-purple-200">
                <h4 className="text-sm font-medium text-purple-800 mb-3">선택된 옵션</h4>
                <div className="space-y-2">
                  {Object.entries(elements)
                    .filter(([_, config]: [string, any]) => config.enabled)
                    .map(([name, config]: [string, any]) => {
                      const element = marketingElements.find(e => e.name === name);
                      let optionText = '';
                      let optionPrice = 0;
                      let isNegotiable = false;

                      if (element?.type === 'option' && element.options) {
                        const selectedOption = element.options[config.selectedOption || 0];
                        optionText = selectedOption.label;
                        optionPrice = selectedOption.price;
                        isNegotiable = selectedOption.negotiable || false;
                      }

                      return (
                        <div key={name} className="bg-white p-2 rounded border border-purple-100">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-sm font-medium text-purple-800">{name}</div>
                              <div className="text-xs text-purple-600">{optionText}</div>
                            </div>
                            <div className="text-sm font-bold text-purple-700">
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
                <i className="ri-information-line text-purple-400 text-2xl mb-2"></i>
                <p className="text-purple-600 text-sm">
                  필요한 옵션을 선택해주세요
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🚀 NEW: 최종 견적서 섹션 */}
      {showFinalEstimate && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-100 border-2 border-purple-300 rounded-lg p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-purple-800 mb-2">📋 최종 견적서</h2>
            <p className="text-purple-600">마케팅 서비스 프로젝트 상세 견적</p>
          </div>

          {/* 프로젝트 개요 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
                <i className="ri-file-text-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                프로젝트 개요
              </h3>
              <div className="space-y-2 text-sm">
                <div><strong>서비스:</strong> 마케팅 서비스</div>
                {data.purposes && data.purposes.length > 0 && (
                  <div><strong>목적:</strong> {data.purposes.join(', ')}</div>
                )}
                {data.details && data.details.length > 0 && (
                  <div><strong>세부용도:</strong> {data.details.join(', ')}</div>
                )}
                {data.scale?.type && (
                  <div><strong>규모:</strong> {data.scale.type} - {data.scale.value || ''}</div>
                )}
                {data.userInput && (
                  <div><strong>설명:</strong> {data.userInput}</div>
                )}
                {data.step1Notes && (
                  <div><strong>1단계 특이사항:</strong> {data.step1Notes}</div>
                )}
              </div>
            </div>

            <div className="bg-white border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
                <i className="ri-user-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                타겟 분석
              </h3>
              <div className="space-y-2 text-sm">
                {data.targetData?.ageGroups && data.targetData.ageGroups.length > 0 && (
                  <div><strong>연령대:</strong> {data.targetData.ageGroups.join(', ')}</div>
                )}
                {data.targetData?.gender && data.targetData.gender.length > 0 && (
                  <div><strong>성별:</strong> {data.targetData.gender.join(', ')}</div>
                )}
                {data.targetData?.regions && data.targetData.regions.length > 0 && (
                  <div><strong>지역:</strong> {data.targetData.regions.join(', ')}</div>
                )}
                {data.targetData?.interests && data.targetData.interests.length > 0 && (
                  <div><strong>관심사:</strong> {data.targetData.interests.slice(0, 3).join(', ')}{data.targetData.interests.length > 3 ? ' 외' : ''}</div>
                )}
                {data.targetData?.occupations && data.targetData.occupations.length > 0 && (
                  <div><strong>직업:</strong> {data.targetData.occupations.join(', ')}</div>
                )}
                {data.targetData?.customTarget && (
                  <div><strong>맞춤 타겟:</strong> {data.targetData.customTarget}</div>
                )}
                {data.step2Notes && (
                  <div><strong>2단계 특이사항:</strong> {data.step2Notes}</div>
                )}
              </div>
            </div>
          </div>

          {/* 세부 용도 및 규모 */}
          <div className="bg-white border border-purple-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
              <i className="ri-list-check mr-2 w-4 h-4 flex items-center justify-center"></i>
              세부 용도 및 규모
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>세부 용도:</strong>
                <div className="mt-1">
                  {data.details && data.details.length > 0 ? data.details.join(', ') : '미지정'}
                </div>
                {data.step3Notes && (
                  <div className="mt-2"><strong>3단계 특이사항:</strong> {data.step3Notes}</div>
                )}
              </div>
              <div>
                <strong>프로젝트 규모:</strong>
                <div className="mt-1">
                  {data.scale?.type && data.scale?.value ? `${data.scale.type}: ${data.scale.value}` : '미지정'}
                </div>
                {data.scale?.custom && (
                  <div className="mt-1"><strong>맞춤 규모:</strong> {data.scale.custom}</div>
                )}
                {data.step4Notes && (
                  <div className="mt-2"><strong>4단계 특이사항:</strong> {data.step4Notes}</div>
                )}
              </div>
            </div>
          </div>

          {/* 레퍼런스 가이드 */}
          {((data.references && data.references.length > 0) || (data.toneKeywords && data.toneKeywords.length > 0) || data.step6Notes) && (
            <div className="bg-white border border-purple-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
                <i className="ri-image-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                레퍼런스 가이드
              </h3>
              
              {data.references && data.references.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-medium mb-2">선택된 레퍼런스 ({data.references.length}개):</div>
                  <div className="space-y-2">
                    {data.references.map((ref: any, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-2 bg-purple-50 rounded">
                        <div className="w-8 h-8 bg-purple-200 rounded flex items-center justify-center flex-shrink-0">
                          <i className="ri-image-line text-purple-600 text-sm"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-purple-900 truncate">{ref.title}</div>
                          {ref.url && (
                            <div className="text-xs text-purple-600 truncate">{ref.url}</div>
                          )}
                          {ref.tags && ref.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {ref.tags.map((tag: string) => (
                                <span key={tag} className="px-1 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          {ref.analysis && (
                            <div className="text-xs text-green-600 mt-1">
                              매칭도 {ref.analysis.similarity}% - {ref.analysis.reason}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.toneKeywords && data.toneKeywords.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-medium mb-2">톤앤매너 키워드:</div>
                  <div className="flex flex-wrap gap-2">
                    {data.toneKeywords.map((keyword: string) => (
                      <span key={keyword} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {data.step6Notes && (
                <div className="text-sm">
                  <strong>5단계 특이사항:</strong> {data.step6Notes}
                </div>
              )}
            </div>
          )}

          {/* 🚀 NEW: 선택된 옵션 상세 - 세금계산서 수준 */}
          <div className="bg-white border border-purple-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-purple-800 mb-4 flex items-center">
              <i className="ri-settings-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              선택된 옵션 상세
            </h3>
            
            {Object.entries(elements).filter(([_, config]: [string, any]) => config.enabled).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(elements)
                  .filter(([_, config]: [string, any]) => config.enabled)
                  .map(([name, config]: [string, any]) => {
                    const element = marketingElements.find(e => e.name === name);
                    let optionText = '';
                    let optionPrice = 0;
                    let isNegotiable = false;
                    let optionNote = '';
                    let detailNote = '';

                    if (element?.type === 'option' && element.options) {
                      const selectedOption = element.options[config.selectedOption || 0];
                      optionText = selectedOption.label;
                      optionPrice = selectedOption.price;
                      isNegotiable = selectedOption.negotiable || false;
                      optionNote = selectedOption.note || '';
                      detailNote = selectedOption.detailNote || '';
                    }

                    return (
                      <div key={name} className="border border-purple-100 rounded-lg p-4 bg-purple-50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="font-bold text-purple-900 text-lg">{name}</div>
                            <div className="text-purple-700 font-medium">{optionText}</div>
                            {optionNote && (
                              <div className="text-sm text-purple-600 mt-1">📝 {optionNote}</div>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <div className="font-bold text-purple-800 text-xl">
                              {optionPrice.toLocaleString()}원{isNegotiable && ' ~'}
                            </div>
                            {isNegotiable && (
                              <div className="text-sm text-orange-600">협의 필요</div>
                            )}
                          </div>
                        </div>
                        
                        {detailNote && (
                          <div className="bg-white border border-purple-200 rounded p-3 mt-3">
                            <div className="text-sm font-medium text-purple-800 mb-1">📋 상세 작업 내용:</div>
                            <div className="text-sm text-purple-700 leading-relaxed">{detailNote}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-4 text-purple-600">
                선택된 옵션이 없습니다
              </div>
            )}
          </div>

          {/* 🚀 NEW: 세부 비용 분해표 - 세금계산서 수준 */}
          <div className="bg-white border border-purple-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-purple-800 mb-4 flex items-center">
              <i className="ri-file-list-3-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              세부 비용 분해표
            </h3>
            
            {/* 인력비 */}
            <div className="mb-6">
              <h4 className="font-medium text-purple-700 mb-3 pb-2 border-b border-purple-200">💼 인력비</h4>
              <div className="space-y-2">
                {Object.entries(elements)
                  .filter(([_, config]: [string, any]) => config.enabled)
                  .map(([name, config]: [string, any]) => {
                    const element = marketingElements.find(e => e.name === name);
                    if (!element?.options) return null;
                    
                    const selectedOption = element.options[config.selectedOption || 0];
                    const isPersonnelCost = ['마케팅 전략', 'SNS 관리', '콘텐츠 제작', '성과 리포트'].includes(name);
                    
                    if (!isPersonnelCost) return null;
                    
                    return (
                      <div key={name} className="grid grid-cols-5 gap-4 text-sm py-2 border-b border-gray-100">
                        <div className="font-medium">{name}</div>
                        <div className="text-center">{selectedOption.label}</div>
                        <div className="text-center">1명</div>
                        <div className="text-center">월 단위</div>
                        <div className="text-right font-bold">{selectedOption.price.toLocaleString()}원</div>
                      </div>
                    );
                  })}
                <div className="grid grid-cols-5 gap-4 text-sm py-2 border-t-2 border-purple-200 bg-purple-50 font-bold">
                  <div className="col-span-4">인력비 소계</div>
                  <div className="text-right">
                    {Object.entries(elements)
                      .filter(([name, config]: [string, any]) => {
                        if (!config.enabled) return false;
                        return ['마케팅 전략', 'SNS 관리', '콘텐츠 제작', '성과 리포트'].includes(name);
                      })
                      .reduce((sum, [name, config]: [string, any]) => {
                        const element = marketingElements.find(e => e.name === name);
                        const selectedOption = element?.options?.[config.selectedOption || 0];
                        return sum + (selectedOption?.price || 0);
                      }, 0)
                      .toLocaleString()}원
                  </div>
                </div>
              </div>
            </div>

            {/* 도구비 */}
            <div className="mb-6">
              <h4 className="font-medium text-purple-700 mb-3 pb-2 border-b border-purple-200">🛠️ 도구비 (월 구독료)</h4>
              <div className="space-y-2">
                {Object.entries(elements)
                  .filter(([_, config]: [string, any]) => config.enabled)
                  .map(([name, config]: [string, any]) => {
                    const element = marketingElements.find(e => e.name === name);
                    if (!element?.options) return null;
                    
                    const selectedOption = element.options[config.selectedOption || 0];
                    const isToolCost = ['광고 운영', '마케팅 자동화', '데이터 분석'].includes(name);
                    
                    if (!isToolCost) return null;
                    
                    const toolCost = Math.round(selectedOption.price * 0.3);
                    
                    return (
                      <div key={name} className="grid grid-cols-4 gap-4 text-sm py-2 border-b border-gray-100">
                        <div className="font-medium">{name} 도구</div>
                        <div className="text-center">{selectedOption.label}</div>
                        <div className="text-center">1개</div>
                        <div className="text-right font-bold">{toolCost.toLocaleString()}원</div>
                      </div>
                    );
                  })}
                <div className="grid grid-cols-4 gap-4 text-sm py-2 border-t-2 border-purple-200 bg-purple-50 font-bold">
                  <div className="col-span-3">도구비 소계</div>
                  <div className="text-right">
                    {Object.entries(elements)
                      .filter(([name, config]: [string, any]) => {
                        if (!config.enabled) return false;
                        return ['광고 운영', '마케팅 자동화', '데이터 분석'].includes(name);
                      })
                      .reduce((sum, [name, config]: [string, any]) => {
                        const element = marketingElements.find(e => e.name === name);
                        const selectedOption = element?.options?.[config.selectedOption || 0];
                        return sum + Math.round((selectedOption?.price || 0) * 0.3);
                      }, 0)
                      .toLocaleString()}원
                  </div>
                </div>
              </div>
            </div>

            {/* 기타비 */}
            <div className="mb-6">
              <h4 className="font-medium text-purple-700 mb-3 pb-2 border-b border-purple-200">📋 기타비</h4>
              <div className="space-y-2">
                {Object.entries(elements)
                  .filter(([_, config]: [string, any]) => config.enabled)
                  .map(([name, config]: [string, any]) => {
                    const element = marketingElements.find(e => e.name === name);
                    if (!element?.options) return null;
                    
                    const selectedOption = element.options[config.selectedOption || 0];
                    const isOtherCost = !['마케팅 전략', 'SNS 관리', '콘텐츠 제작', '성과 리포트', '광고 운영', '마케팅 자동화', '데이터 분석'].includes(name);
                    
                    if (!isOtherCost) return null;
                    
                    return (
                      <div key={name} className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-gray-100">
                        <div className="font-medium">{name}</div>
                        <div className="text-center">{selectedOption.label}</div>
                        <div className="text-right font-bold">{selectedOption.price.toLocaleString()}원</div>
                      </div>
                    );
                  })}
                <div className="grid grid-cols-3 gap-4 text-sm py-2 border-t-2 border-purple-200 bg-purple-50 font-bold">
                  <div className="col-span-2">기타비 소계</div>
                  <div className="text-right">
                    {Object.entries(elements)
                      .filter(([name, config]: [string, any]) => {
                        if (!config.enabled) return false;
                        return !['마케팅 전략', 'SNS 관리', '콘텐츠 제작', '성과 리포트', '광고 운영', '마케팅 자동화', '데이터 분석'].includes(name);
                      })
                      .reduce((sum, [name, config]: [string, any]) => {
                        const element = marketingElements.find(e => e.name === name);
                        const selectedOption = element?.options?.[config.selectedOption || 0];
                        return sum + (selectedOption?.price || 0);
                      }, 0)
                      .toLocaleString()}원
                  </div>
                </div>
              </div>
            </div>

            {/* 최종 합계 - 정확한 계산 */}
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-lg font-bold">
                <div>소계</div>
                <div className="text-right">{totalPriceImpact.toLocaleString()}원</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-lg font-bold border-t border-purple-300 pt-2 mt-2">
                <div>부가세 (10%)</div>
                <div className="text-right">{Math.round(totalPriceImpact * 0.1).toLocaleString()}원</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xl font-bold text-purple-800 border-t-2 border-purple-400 pt-3 mt-3">
                <div>총액</div>
                <div className="text-right">{Math.round(totalPriceImpact * 1.1).toLocaleString()}원</div>
              </div>
            </div>
            
            <div className="mt-3 text-xs text-gray-600">
              * 마케팅 업계에서 인력비는 전체 비용의 60-70%, 도구비는 20-30%, 기타비는 10-20%가 표준입니다.
            </div>
          </div>

          {/* 🚀 NEW: AI 종합평가 섹션 - 업계별 상세 분석 */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-orange-300 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-orange-800 mb-4 flex items-center">
              <i className="ri-ai-generate mr-2 w-5 h-5 flex items-center justify-center"></i>
              🤖 AI 종합평가 (마케팅 업계 분석)
            </h3>
            
            {/* 별점 표시 */}
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-1">
                {(() => {
                  const aiRating = calculateAIOverallRating();
                  return [1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`ri-star-${star <= Math.floor(aiRating.rating) ? 'fill' : star <= aiRating.rating ? 'half-fill' : 'line'} text-2xl ${
                        star <= aiRating.rating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    ></i>
                  ));
                })()}
                <span className="ml-3 text-xl font-bold text-orange-700">
                  {calculateAIOverallRating().rating}/5.0
                </span>
              </div>
            </div>

            {/* 업계별 세분화 평가 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">👨‍💼 개인 프리랜서 대비</h4>
                <div className="text-sm text-orange-700">
                  <div className="flex justify-between mb-1">
                    <span>비용 수준</span>
                    <span className="font-bold">
                      {totalPriceImpact < 1500000 ? '경제적' : totalPriceImpact < 3000000 ? '적정' : '프리미엄'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    개인 프리랜서 평균: 80-150만원/월
                  </div>
                </div>
              </div>

              <div className="bg-white border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">🏢 중소 제작사 대비</h4>
                <div className="text-sm text-orange-700">
                  <div className="flex justify-between mb-1">
                    <span>비용 수준</span>
                    <span className="font-bold">
                      {totalPriceImpact < 2500000 ? '경제적' : totalPriceImpact < 4500000 ? '표준적' : '고급'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    중소 제작사 평균: 200-450만원/월
                  </div>
                </div>
              </div>

              <div className="bg-white border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">🌟 대형 에이전시 대비</h4>
                <div className="text-sm text-orange-700">
                  <div className="flex justify-between mb-1">
                    <span>비용 수준</span>
                    <span className="font-bold">
                      {totalPriceImpact < 4000000 ? '경제적' : totalPriceImpact < 8000000 ? '적정' : '프리미엄'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    대형 에이전시 평균: 500-1000만원/월
                  </div>
                </div>
              </div>
            </div>

            {/* 예산 적정성 분석 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">💰 예산 적정성 분석</h4>
                <div className="space-y-2 text-sm text-orange-700">
                  <div className="flex justify-between">
                    <span>현재 예산 수준</span>
                    <span className="font-bold">
                      {calculateAIOverallRating().budgetAnalysis.isCheap ? '경제적 예산' :
                       calculateAIOverallRating().budgetAnalysis.isOptimal ? '적정 예산' : '여유로운 예산'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    마케팅 업계에서 월 {totalPriceImpact < 2000000 ? '소규모는 30% 할인' : 
                                           totalPriceImpact > 5000000 ? '대규모는 80% 추가비용' : '표준 규모'} 수준
                  </div>
                </div>
              </div>

              <div className="bg-white border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">📊 복잡도 분석</h4>
                <div className="space-y-2 text-sm text-orange-700">
                  <div className="flex justify-between">
                    <span>프로젝트 복잡도</span>
                    <span className="font-bold">
                      {Object.keys(elements).filter(k => elements[k]?.enabled).length < 3 ? '단순한 구성' :
                       Object.keys(elements).filter(k => elements[k]?.enabled).length < 6 ? '적절한 구성' : '복합적 구성'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    선택 옵션 {Object.keys(elements).filter(k => elements[k]?.enabled).length}개 - 
                    완성도 예상 {Object.keys(elements).filter(k => elements[k]?.enabled).length < 4 ? '75%' : '90%'} 수준
                  </div>
                </div>
              </div>
            </div>

            {/* 평가 근거 및 개선 제안 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">✅ 평가 근거</h4>
                <ul className="space-y-1 text-sm text-orange-700">
                  {calculateAIOverallRating().reasons.map((reason, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">💡 개선 제안</h4>
                {calculateAIOverallRating().recommendations.length > 0 ? (
                  <ul className="space-y-1 text-sm text-orange-700">
                    {calculateAIOverallRating().recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-orange-500 mr-2">→</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-orange-700">현재 구성이 목적에 적합합니다!</p>
                )}
              </div>
            </div>

            {/* 추천 제작사 */}
            <div className="bg-white border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-800 mb-2">🏢 예산별 추천 제작사</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className={`p-3 rounded-lg border-2 ${totalPriceImpact < 2000000 ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="font-medium text-gray-800">개인 프리랜서</div>
                  <div className="text-xs text-gray-600 mt-1">80-150만원/월</div>
                  <div className="text-xs text-green-600 mt-1">
                    {totalPriceImpact < 2000000 ? '💡 현재 예산에 최적' : '예산 초과'}
                  </div>
                </div>
                <div className={`p-3 rounded-lg border-2 ${totalPriceImpact >= 2000000 && totalPriceImpact < 4500000 ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="font-medium text-gray-800">중소 제작사</div>
                  <div className="text-xs text-gray-600 mt-1">200-450만원/월</div>
                  <div className="text-xs text-green-600 mt-1">
                    {totalPriceImpact >= 2000000 && totalPriceImpact < 4500000 ? '💡 현재 예산에 최적' : totalPriceImpact < 2000000 ? '상위 옵션' : '예산 초과'}
                  </div>
                </div>
                <div className={`p-3 rounded-lg border-2 ${totalPriceImpact >= 4500000 ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="font-medium text-gray-800">대형 에이전시</div>
                  <div className="text-xs text-gray-600 mt-1">500-1000만원/월</div>
                  <div className="text-xs text-green-600 mt-1">
                    {totalPriceImpact >= 4500000 ? '💡 현재 예산에 최적' : '상위 옵션'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 총 제작비용 - 정확한 계산 */}
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-green-800 text-lg">총 제작비용</h3>
                <p className="text-green-600 text-sm">부가세 별도 (월 단위 서비스 포함)</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-800">
                  {totalPriceImpact.toLocaleString()}원
                  {Object.entries(elements).some(([name, config]: [string, any]) => {
                    if (!config.enabled) return false;
                    const element = marketingElements.find(e => e.name === name);
                    if (element?.type === 'option' && element.options) {
                      const selectedOption = element.options[config.selectedOption || 0];
                      return selectedOption.negotiable;
                    }
                    return false;
                  }) && ' ~'}
                </div>
                <div className="text-sm text-green-600 mt-1">
                  (부가세 포함: {Math.round(totalPriceImpact * 1.1).toLocaleString()}원)
                </div>
                {Object.entries(elements).some(([name, config]: [string, any]) => {
                  if (!config.enabled) return false;
                  const element = marketingElements.find(e => e.name === name);
                  if (element?.type === 'option' && element.options) {
                    const selectedOption = element.options[config.selectedOption || 0];
                    return selectedOption.negotiable;
                  }
                  return false;
                }) && (
                  <div className="text-sm text-orange-600 mt-1">
                    협의 옵션 포함 - 최종 금액은 상담 후 확정
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 예상 제작기간 */}
          <div className="bg-white border border-purple-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-purple-800 mb-4 flex items-center">
              <i className="ri-calendar-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              예상 제작기간: {Math.max(totalTimeImpact, 3)}일 (초기 셋업)
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                <span className="text-purple-700">1단계: 마케팅 전략 수립</span>
                <span className="text-purple-800 font-medium">{Math.ceil(Math.max(totalTimeImpact, 3) * 0.3)}일</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                <span className="text-purple-700">2단계: 캠페인 기획 및 준비</span>
                <span className="text-purple-800 font-medium">{Math.ceil(Math.max(totalTimeImpact, 3) * 0.3)}일</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                <span className="text-purple-700">3단계: 시스템 구축 및 셋업</span>
                <span className="text-purple-800 font-medium">{Math.ceil(Math.max(totalTimeImpact, 3) * 0.3)}일</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                <span className="text-purple-700">4단계: 마케팅 실행 시작</span>
                <span className="text-purple-800 font-medium">{Math.ceil(Math.max(totalTimeImpact, 3) * 0.1)}일</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                <strong>참고:</strong> 마케팅 서비스는 월 단위 지속 서비스입니다. 위 기간은 초기 셋업 기간이며, 실제 마케팅 활동은 지속적으로 진행됩니다.
              </p>
            </div>
          </div>

          {/* 고객정보 입력 섹션 */}
          <div className="bg-white border border-purple-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-purple-800 mb-4 flex items-center">
              <i className="ri-user-add-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              고객 정보
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이름 *</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="성함을 입력해주세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">연락처 *</label>
                <input
                  type="tel"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="연락처를 입력해주세요"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">이메일 *</label>
              <input
                type="email"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="이메일을 입력해주세요"
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">기타 입력사항</label>
              <textarea
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                placeholder="추가로 전달하고 싶은 내용이 있으시면 입력해주세요"
              />
            </div>
          </div>

          {/* 출력 및 공유 기능 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handlePrintEstimate}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-printer-line mr-2"></i>
              견적서 인쇄/PDF
            </button>
            
            <button
              onClick={() => {
                const subject = encodeURIComponent('마케팅 서비스 견적 발송');
                const body = encodeURIComponent(`견적 금액: ${totalPriceImpact.toLocaleString()}원\n제작 기간: ${Math.max(totalTimeImpact, 3)}일\n\n견적서를 발송해드립니다.`);
                window.open(`mailto:?subject=${subject}&body=${body}`);
              }}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-mail-send-line mr-2"></i>
              견적발송
            </button>
            
            <button
              onClick={() => {
                const message = `마케팅 서비스 견적 공유\n\n견적 금액: ${totalPriceImpact.toLocaleString()}원\n제작 기간: ${Math.max(totalTimeImpact, 3)}일\n\n자세한 내용은 견적서를 확인해주세요.`;
                const encoded = encodeURIComponent(message);
                window.open(`https://open.kakao.com/o/share?text=${encoded}`);
              }}
              className="flex-1 px-6 py-3 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-kakao-talk-line mr-2"></i>
              카톡 공유
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => setShowFinalEstimate(false)}
              className="px-4 py-2 text-purple-600 hover:text-purple-800 transition-colors cursor-pointer"
            >
              견적서 접기
            </button>
          </div>
        </div>
      )}

      {/* 🚀 NEW: 최종 견적서 생성 버튼 */}
      {!showFinalEstimate && (
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-300 rounded-lg p-6 text-center">
          <h3 className="font-bold text-blue-800 mb-2">견적 확인 완료!</h3>
          <p className="text-blue-600 mb-4">모든 옵션 선택이 완료되었습니다. 최종 견적서를 생성해보세요.</p>
          <button
            onClick={generateFinalEstimate}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors cursor-pointer text-lg whitespace-nowrap"
          >
            <i className="ri-file-text-line mr-2"></i>
            최종 견적서 생성
          </button>
        </div>
      )}

      {/* 🚀 처음으로 돌아가기 버튼 추가 */}
      {showFinalEstimate && (
        <div className="flex justify-between pt-6">
          <button
            onClick={onPrev}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium whitespace-nowrap cursor-pointer hover:bg-gray-200 transition-colors"
          >
            이전으로
          </button>
          <button
            onClick={() => {
              const finalData = {
                elements,
                step5Notes: specialNotes,
                calculatedTotalCost: totalPriceImpact,
                realTimePrice: totalPriceImpact,
                realTimeDays: Math.max(totalTimeImpact, 7)
              };
              
              onUpdate(finalData);
              window.location.reload();
            }}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium whitespace-nowrap cursor-pointer hover:bg-purple-700 transition-colors"
          >
            처음으로
          </button>
        </div>
      )}
    </div>
  );
}
