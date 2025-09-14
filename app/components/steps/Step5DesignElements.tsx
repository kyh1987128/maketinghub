
'use client';

import { useState, useEffect } from 'react';
import { getDisabledOptions, getDisabledReason } from '../../lib/validationRules';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface PersonnelCost {
  role: string;       
  grade: string;      
  count: number;      
  dailyRate: number;  
  days: number;       
  totalCost: number;  
}

interface EquipmentCost {
  name: string;       
  type: string;       
  unit: string;       
  quantity: number;   
  unitCost: number;   
  totalCost: number;  
}

interface DetailedBreakdown {
  personnel: PersonnelCost[];
  equipment: EquipmentCost[];
  materials: { name: string; cost: number }[];
  overhead: number;
  subtotal: number;
  vat: number;
  total: number;
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
    personnel?: PersonnelCost[];
    equipment?: EquipmentCost[];
    materials?: { name: string; cost: number }[];
  }>;
}

interface AIRecommendation {
  combination: { [key: string]: any };
  reasoning: string;
  benefits: string[];
  totalCost: number;
  confidence: number;
}

export default function Step5DesignElements({ data, onUpdate, onNext, onPrev }: Props) {
  const [elements, setElements] = useState(data.elements || {});
  const [specialNotes, setSpecialNotes] = useState(data.step5Notes || '');
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showFinalQuote, setShowFinalQuote] = useState(false);

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
      let confidence = 90;

      if (purposes.includes('브랜드 스토리 영상') || purposes.some((p: string) => p.includes('브랜드'))) {
        recommendedCombination = {
          '브랜드 아이덴티티': { enabled: true, selectedOption: 1 },
          '인쇄물 디자인': { enabled: true, selectedOption: 1 },
          '디지털 디자인': { enabled: true, selectedOption: 1 },
          '마케팅 디자인': { enabled: true, selectedOption: 1 }
        };
        totalCost = 3200000;
        reasoning = '브랜드 중심의 디자인 프로젝트로, 일관된 브랜드 경험 제공을 위해 통합적 접근이 필요합니다.';
        benefits = [
          '브랜드 일관성 확보',
          '통합적 디자인 경험',
          '장기적 브랜드 자산 구축'
        ];
      } else {
        recommendedCombination = {
          '브랜드 아이덴티티': { enabled: true, selectedOption: 0 },
          '인쇄물 디자인': { enabled: true, selectedOption: 1 },
          '디지털 디자인': { enabled: true, selectedOption: 0 }
        };
        totalCost = 1800000;
        reasoning = '기본적인 디자인 요구사항을 충족하는 균형잡힌 조합을 추천합니다.';
        benefits = [
          '효율적인 비용 배분',
          '핵심 요소 집중',
          '단계적 확장 가능'
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

  const applyAIRecommendation = () => {
    if (!aiRecommendation) return;
    
    setElements(aiRecommendation.combination);
    setShowAIPanel(false);
    
    onUpdate({
      elements: aiRecommendation.combination,
      step5Notes: specialNotes,
      appliedAIRecommendation: true
    });
  };

  useEffect(() => {
    if (data.purposes && data.purposes.length > 0 && !aiRecommendation) {
      generateAIRecommendation();
      setShowAIPanel(true);
    }
  }, [data.purposes, aiRecommendation]);

  // 🎨 디자인 제작 전용 옵션들
  const designElements: Element[] = [
    {
      name: '브랜드 아이덴티티',
      type: 'option',
      icon: 'ri-bookmark-line',
      priceImpact: 0,
      timeImpact: 3,
      description: '브랜드 로고, CI/BI, 가이드라인',
      options: [
        { 
          label: '기본 브랜딩', 
          value: 0, 
          desc: '로고 + 기본 가이드라인', 
          price: 800000,
          note: '기본 브랜드 패키지, 7-10일',
          personnel: [
            { role: '브랜드 디자이너', grade: '중급', count: 1, dailyRate: 150000, days: 7, totalCost: 1050000 }
          ],
          equipment: [
            { name: 'Adobe Creative Suite', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 80000, totalCost: 80000 }
          ],
          materials: [
            { name: '브랜드 리서치', cost: 200000 }
          ]
        },
        { 
          label: '전문 브랜딩', 
          value: 1, 
          desc: '종합 브랜드 패키지 + 어플리케이션', 
          price: 2000000,
          negotiable: true,
          note: '전문 브랜딩 패키지, 14-21일',
          personnel: [
            { role: '시니어 브랜드 디자이너', grade: '시니어', count: 1, dailyRate: 250000, days: 14, totalCost: 3500000 },
            { role: '브랜드 전략가', grade: '전문가', count: 1, dailyRate: 300000, days: 7, totalCost: 2100000 }
          ],
          equipment: [
            { name: 'Adobe Creative Suite Pro', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 150000, totalCost: 150000 }
          ],
          materials: [
            { name: '심화 브랜드 리서치', cost: 500000 },
            { name: '브랜드북 제작', cost: 300000 }
          ]
        },
        { 
          label: '프리미엄 브랜딩', 
          value: 2, 
          desc: '완전 맞춤 브랜드 시스템', 
          price: 5000000,
          negotiable: true,
          note: '최고급 브랜딩, 30일+',
          personnel: [
            { role: '브랜드 디렉터', grade: '최고급', count: 1, dailyRate: 500000, days: 21, totalCost: 10500000 },
            { role: '브랜드 전략 팀', grade: '전문가', count: 2, dailyRate: 350000, days: 14, totalCost: 9800000 }
          ],
          equipment: [
            { name: '전문 브랜딩 툴', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 300000, totalCost: 300000 }
          ],
          materials: [
            { name: '전략 컨설팅', cost: 2000000 },
            { name: '프리미엄 브랜드북', cost: 1000000 }
          ]
        }
      ]
    },
    {
      name: '인쇄물 디자인',
      type: 'option',
      icon: 'ri-printer-line',
      priceImpact: 0,
      timeImpact: 2,
      description: '카드뉴스, 브로슈어, 포스터, 명함',
      options: [
        { 
          label: '기본 인쇄물', 
          value: 0, 
          desc: '명함 + 간단한 브로슈어', 
          price: 500000,
          note: '기본 인쇄물 세트, 5-7일',
          personnel: [
            { role: '그래픽 디자이너', grade: '주니어', count: 1, dailyRate: 120000, days: 5, totalCost: 600000 }
          ],
          equipment: [
            { name: 'Adobe InDesign', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 50000, totalCost: 50000 }
          ],
          materials: [
            { name: '기본 스톡 이미지', cost: 100000 }
          ]
        },
        { 
          label: '전문 인쇄물', 
          value: 1, 
          desc: '종합 인쇄물 패키지', 
          price: 1200000,
          negotiable: true,
          note: '전문 편집 디자인, 10-14일',
          personnel: [
            { role: '편집 디자이너', grade: '중급', count: 1, dailyRate: 180000, days: 10, totalCost: 1800000 }
          ],
          equipment: [
            { name: 'Adobe Creative Suite', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 80000, totalCost: 80000 }
          ],
          materials: [
            { name: '프리미엄 스톡 이미지', cost: 200000 },
            { name: '전문 폰트 라이선스', cost: 150000 }
          ]
        },
        { 
          label: '프리미엄 인쇄물', 
          value: 2, 
          desc: '고급 편집 디자인 + 특수 인쇄', 
          price: 3000000,
          negotiable: true,
          note: '최고급 편집 디자인, 21일+',
          personnel: [
            { role: '시니어 편집 디자이너', grade: '전문가', count: 1, dailyRate: 300000, days: 14, totalCost: 4200000 }
          ],
          equipment: [
            { name: '전문 편집 SW', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 200000, totalCost: 200000 }
          ],
          materials: [
            { name: '커스텀 일러스트', cost: 800000 },
            { name: '특수 인쇄 기법', cost: 500000 }
          ]
        }
      ]
    },
    {
      name: '디지털 디자인',
      type: 'option',
      icon: 'ri-computer-line',
      priceImpact: 0,
      timeImpact: 3,
      description: '웹사이트, 앱 UI/UX, SNS 콘텐츠',
      options: [
        { 
          label: '기본 디지털', 
          value: 0, 
          desc: 'SNS 콘텐츠 + 기본 웹 배너', 
          price: 600000,
          note: '기본 디지털 콘텐츠, 5-7일',
          personnel: [
            { role: '디지털 디자이너', grade: '주니어', count: 1, dailyRate: 130000, days: 6, totalCost: 780000 }
          ],
          equipment: [
            { name: 'Adobe Photoshop', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 50000, totalCost: 50000 }
          ],
          materials: [
            { name: 'SNS 템플릿', cost: 100000 }
          ]
        },
        { 
          label: '전문 디지털', 
          value: 1, 
          desc: '웹사이트 디자인 + 종합 UI/UX', 
          price: 1800000,
          negotiable: true,
          note: '전문 UI/UX 디자인, 14-21일',
          personnel: [
            { role: 'UI/UX 디자이너', grade: '중급', count: 1, dailyRate: 200000, days: 14, totalCost: 2800000 }
          ],
          equipment: [
            { name: 'Figma Pro', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 100000, totalCost: 100000 },
            { name: 'Adobe XD', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 80000, totalCost: 80000 }
          ],
          materials: [
            { name: 'UI 컴포넌트 라이브러리', cost: 300000 }
          ]
        },
        { 
          label: '프리미엄 디지털', 
          value: 2, 
          desc: '완전 맞춤 디지털 경험', 
          price: 4000000,
          negotiable: true,
          note: '최고급 디지털 디자인, 30일+',
          personnel: [
            { role: '시니어 UX 디렉터', grade: '전문가', count: 1, dailyRate: 400000, days: 21, totalCost: 8400000 },
            { role: 'UI 전문가', grade: '전문가', count: 1, dailyRate: 300000, days: 21, totalCost: 6300000 }
          ],
          equipment: [
            { name: '전문 UX 툴셋', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 300000, totalCost: 300000 }
          ],
          materials: [
            { name: '사용자 리서치', cost: 1000000 },
            { name: '프로토타이핑', cost: 800000 }
          ]
        }
      ]
    },
    {
      name: '마케팅 디자인',
      type: 'option',
      icon: 'ri-megaphone-line',
      priceImpact: 0,
      timeImpact: 2,
      description: '광고 크리에이티브, 캠페인 비주얼',
      options: [
        { 
          label: '기본 광고물', 
          value: 0, 
          desc: '기본 광고 소재', 
          price: 400000,
          note: '기본 마케팅 소재, 3-5일',
          personnel: [
            { role: '마케팅 디자이너', grade: '주니어', count: 1, dailyRate: 110000, days: 4, totalCost: 440000 }
          ],
          equipment: [
            { name: 'Adobe Illustrator', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 50000, totalCost: 50000 }
          ],
          materials: [
            { name: '광고 템플릿', cost: 80000 }
          ]
        },
        { 
          label: '전문 캠페인', 
          value: 1, 
          desc: '통합 마케팅 캠페인 디자인', 
          price: 1500000,
          negotiable: true,
          note: '전문 캠페인 디자인, 10-14일',
          personnel: [
            { role: '캠페인 디자이너', grade: '중급', count: 1, dailyRate: 200000, days: 10, totalCost: 2000000 }
          ],
          equipment: [
            { name: 'Adobe Creative Suite', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 80000, totalCost: 80000 }
          ],
          materials: [
            { name: '캠페인 리서치', cost: 300000 },
            { name: '크리에이티브 소재', cost: 200000 }
          ]
        },
        { 
          label: '프리미엄 캠페인', 
          value: 2, 
          desc: '최고급 광고 캠페인', 
          price: 3500000,
          negotiable: true,
          note: '최고급 캠페인, 21일+',
          personnel: [
            { role: '크리에이티브 디렉터', grade: '전문가', count: 1, dailyRate: 500000, days: 14, totalCost: 7000000 }
          ],
          equipment: [
            { name: '전문 크리에이티브 툴', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 200000, totalCost: 200000 }
          ],
          materials: [
            { name: '전략 컨설팅', cost: 1000000 },
            { name: '프리미엄 크리에이티브', cost: 800000 }
          ]
        }
      ]
    },
    {
      name: '편집 디자인',
      type: 'option',
      icon: 'ri-book-open-line',
      priceImpact: 0,
      timeImpact: 2,
      description: '잡지, 책, 연차보고서, 제안서',
      options: [
        { 
          label: '기본 편집', 
          value: 0, 
          desc: '간단한 편집물', 
          price: 300000,
          note: '기본 편집 디자인, 3-5일',
          personnel: [
            { role: '편집 디자이너', grade: '주니어', count: 1, dailyRate: 100000, days: 4, totalCost: 400000 }
          ],
          equipment: [
            { name: 'Adobe InDesign', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 50000, totalCost: 50000 }
          ],
          materials: []
        },
        { 
          label: '전문 편집', 
          value: 1, 
          desc: '전문 편집물 + 레이아웃', 
          price: 1000000,
          negotiable: true,
          note: '전문 편집 디자인, 7-10일',
          personnel: [
            { role: '편집 디자이너', grade: '중급', count: 1, dailyRate: 170000, days: 8, totalCost: 1360000 }
          ],
          equipment: [
            { name: 'Adobe Creative Suite', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 80000, totalCost: 80000 }
          ],
          materials: [
            { name: '편집 소재', cost: 150000 }
          ]
        },
        { 
          label: '프리미엄 편집', 
          value: 2, 
          desc: '최고급 편집 디자인', 
          price: 2500000,
          negotiable: true,
          note: '최고급 편집, 14-21일',
          personnel: [
            { role: '시니어 편집 디자이너', grade: '전문가', count: 1, dailyRate: 300000, days: 14, totalCost: 4200000 }
          ],
          equipment: [
            { name: '전문 편집 SW', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 150000, totalCost: 150000 }
          ],
          materials: [
            { name: '프리미엄 편집 소재', cost: 500000 }
          ]
        }
      ]
    }
  ];

  // 🚀 NEW: 상세 비용 계산 함수
  const calculateDetailedBreakdown = (): DetailedBreakdown => {
    let allPersonnel: PersonnelCost[] = [];
    let allEquipment: EquipmentCost[] = [];
    let allMaterials: { name: string; cost: number }[] = [];
    let subtotal = 0;

    Object.entries(elements).forEach(([name, config]: [string, any]) => {
      if (config.enabled) {
        const element = designElements.find(e => e.name === name);
        if (element?.type === 'option' && element.options) {
          const selectedOption = element.options[config.selectedOption || 0];
          
          if (selectedOption.personnel) {
            allPersonnel.push(...selectedOption.personnel);
          }
          
          if (selectedOption.equipment) {
            allEquipment.push(...selectedOption.equipment);
          }
          
          if (selectedOption.materials) {
            allMaterials.push(...selectedOption.materials);
          }
          
          subtotal += selectedOption.price;
        }
      }
    });

    const vat = Math.round(subtotal * 0.1);
    const total = subtotal + vat;

    return {
      personnel: allPersonnel,
      equipment: allEquipment,
      materials: allMaterials,
      overhead: 0,
      subtotal,
      vat,
      total
    };
  };

  // 🚀 NEW: AI 종합평가 계산 함수
  const calculateAIOverallRating = () => {
    const purposes = data.purposes || [];
    const details = data.details || [];
    const scale = data.scale || {};
    
    let rating = 3.2;
    let reasons: string[] = [];
    let recommendations: string[] = [];
    
    const isBrandPurpose = purposes.some((p: string) => p.includes('브랜드'));
    const isMarketingPurpose = purposes.some((p: string) => p.includes('마케팅') || p.includes('홍보'));
    
    if (isBrandPurpose && totalPriceImpact >= 2000000) {
      rating += 0.7;
      reasons.push('브랜드 목적에 적합한 투자 수준');
    } else if (isBrandPurpose && totalPriceImpact < 1500000) {
      rating -= 0.4;
      reasons.push('브랜드 구축을 위해 추가 투자 권장');
      recommendations.push('브랜드 일관성 확보를 위한 예산 증액 고려');
    }
    
    if (isMarketingPurpose && totalPriceImpact >= 1500000) {
      rating += 0.5;
      reasons.push('마케팅 효과를 위한 적절한 투자');
    }
    
    const selectedOptionsCount = Object.keys(elements).filter(k => elements[k]?.enabled).length;
    if (selectedOptionsCount >= 3) {
      rating += 0.4;
      reasons.push('통합적인 디자인 접근');
    } else if (selectedOptionsCount < 2) {
      rating -= 0.3;
      reasons.push('디자인 요소 다양성 부족');
      recommendations.push('브랜드 일관성을 위한 추가 디자인 요소 고려');
    }
    
    rating = Math.max(1.0, Math.min(5.0, rating));
    
    return {
      rating: Math.round(rating * 10) / 10,
      reasons,
      recommendations,
      budgetAnalysis: {
        isOptimal: rating >= 3.5,
        isExpensive: totalPriceImpact > 3000000,
        isCheap: totalPriceImpact < 1000000
      }
    };
  };

  // 🚀 최종 견적서 생성 함수
  const generateFinalQuote = () => {
    const finalData = {
      elements,
      step5Notes: specialNotes,
      calculatedTotalCost: totalPriceImpact,
      realTimePrice: totalPriceImpact,
      realTimeDays: Math.max(totalTimeImpact, 5)
    };
    
    onUpdate(finalData);
    setShowFinalQuote(true);
  };

  // 🚀 처음으로 돌아가기 함수
  const goToFirstStep = () => {
    const finalData = {
      elements,
      step5Notes: specialNotes,
      calculatedTotalCost: totalPriceImpact,
      realTimePrice: totalPriceImpact,
      realTimeDays: Math.max(totalTimeImpact, 5)
    };
    
    onUpdate(finalData);
    window.location.reload();
  };

  // 상세 견적서 이메일 발송 함수
  const handleEmailQuote = () => {
    const detailedBreakdown = calculateDetailedBreakdown();
    const estimatedDays = Math.max(totalTimeImpact, 5);
    
    let emailBody = `디자인 제작 상세 견적서\\n\\n`;
    
    emailBody += `=== 프로젝트 개요 ===\\n`;
    emailBody += `서비스: 디자인 제작\\n`;
    if (data.purposes && data.purposes.length > 0) {
      emailBody += `목적: ${data.purposes.join(', ')}\\n`;
    }
    if (data.details && data.details.length > 0) {
      emailBody += `세부용도: ${data.details.join(', ')}\\n`;
    }
    if (data.scale?.type) {
      emailBody += `규모: ${data.scale.type} - ${data.scale.value || ''}\\n`;
    }
    emailBody += `\\n`;
    
    emailBody += `=== 타겟 분석 ===\\n`;
    if (data.targetData?.ageGroups && data.targetData.ageGroups.length > 0) {
      emailBody += `연령대: ${data.targetData.ageGroups.join(', ')}\\n`;
    }
    if (data.targetData?.interests && data.targetData.interests.length > 0) {
      emailBody += `관심사: ${data.targetData.interests.slice(0, 3).join(', ')}${data.targetData.interests.length > 3 ? ' 외' : ''}\\n`;
    }
    emailBody += `\\n`;
    
    emailBody += `=== 선택된 옵션 상세 ===\\n`;
    Object.entries(elements)
      .filter(([_, config]: [string, any]) => config.enabled)
      .forEach(([name, config]: [string, any]) => {
        const element = designElements.find(e => e.name === name);
        if (element?.type === 'option' && element.options) {
          const selectedOption = element.options[config.selectedOption || 0];
          emailBody += `${name}: ${selectedOption.label} (${selectedOption.price.toLocaleString()}원)\\n`;
          if (selectedOption.note) {
            emailBody += `  ↳ ${selectedOption.note}\\n`;
          }
        }
      });
    emailBody += `\\n`;
    
    emailBody += `=== 견적 총계 ===\\n`;
    emailBody += `소계: ${detailedBreakdown.subtotal.toLocaleString()}원\\n`;
    emailBody += `부가세(10%): ${detailedBreakdown.vat.toLocaleString()}원\\n`;
    emailBody += `총 견적금액: ${detailedBreakdown.total.toLocaleString()}원\\n\\n`;
    
    emailBody += `예상 제작기간: ${estimatedDays}일\\n\\n`;
    emailBody += `※ 본 견적서는 선택하신 옵션을 기준으로 산출되었으며, 상세 논의를 통해 조정 가능합니다.`;
    
    const subject = encodeURIComponent('디자인 제작 상세 견적서');
    const body = encodeURIComponent(emailBody);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  // 🚀 최종 견적서 JSX
  const renderFinalQuote = () => {
    const estimatedDays = Math.max(totalTimeImpact, 5);
    const detailedBreakdown = calculateDetailedBreakdown();
    const hasNegotiableItems = Object.entries(elements).some(([name, config]: [string, any]) => {
      if (!config.enabled) return false;
      const element = designElements.find(e => e.name === name);
      if (element?.type === 'option' && element.options) {
        const selectedOption = element.options[config.selectedOption || 0];
        return selectedOption.negotiable;
      }
      return false;
    });

    const aiRating = calculateAIOverallRating();

    return (
      <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-300 rounded-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-green-800 mb-2">🎨 최종 견적서</h2>
          <p className="text-green-600">디자인 제작 프로젝트 상세 견적</p>
        </div>

        {/* 프로젝트 개요 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center">
              <i className="ri-file-text-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              프로젝트 개요
            </h3>
            <div className="space-y-2 text-sm">
              <div><strong>서비스:</strong> 디자인 제작</div>
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
              {specialNotes && (
                <div><strong>특이사항:</strong> {specialNotes}</div>
              )}
            </div>
          </div>

          <div className="bg-white border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center">
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
            </div>
          </div>
        </div>

        {/* 레퍼런스 정보 */}
        {data.references && data.references.length > 0 && (
          <div className="bg-white border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center">
              <i className="ri-image-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              레퍼런스 가이드
            </h3>
            <div className="space-y-2 text-sm">
              <div><strong>선택된 레퍼런스:</strong> {data.references.slice(0, 3).map((ref: any) => ref.title).join(', ')}{data.references.length > 3 ? ` 외 ${data.references.length - 3}개` : ''}</div>
              {data.toneKeywords && data.toneKeywords.length > 0 && (
                <div><strong>톤앤매너:</strong> {data.toneKeywords.join(', ')}</div>
              )}
            </div>
          </div>
        )}

        {/* 상세 비용 분해표 */}
        <div className="bg-white border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-green-800 mb-4 flex items-center">
            <i className="ri-calculator-line mr-2 w-4 h-4 flex items-center justify-center"></i>
            상세 비용 분해표
          </h3>
          
          {/* 인력비 */}
          {detailedBreakdown.personnel.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-green-700 mb-3 border-b border-green-200 pb-2">👥 인력비</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-green-50">
                      <th className="text-left p-2 border border-green-200">역할</th>
                      <th className="text-left p-2 border border-green-200">등급</th>
                      <th className="text-center p-2 border border-green-200">인원</th>
                      <th className="text-center p-2 border border-green-200">일수</th>
                      <th className="text-right p-2 border border-green-200">일당</th>
                      <th className="text-right p-2 border border-green-200">금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailedBreakdown.personnel.map((person, index) => (
                      <tr key={index} className="border-b border-green-100">
                        <td className="p-2 border border-green-200">{person.role}</td>
                        <td className="p-2 border border-green-200">{person.grade}</td>
                        <td className="text-center p-2 border border-green-200">{person.count}명</td>
                        <td className="text-center p-2 border border-green-200">{person.days}일</td>
                        <td className="text-right p-2 border border-green-200">{person.dailyRate.toLocaleString()}원</td>
                        <td className="text-right p-2 border border-green-200 font-medium">{person.totalCost.toLocaleString()}원</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 장비비 */}
          {detailedBreakdown.equipment.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-green-700 mb-3 border-b border-green-200 pb-2">🛠️ 장비비</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-green-50">
                      <th className="text-left p-2 border border-green-200">품목</th>
                      <th className="text-left p-2 border border-green-200">타입</th>
                      <th className="text-center p-2 border border-green-200">수량</th>
                      <th className="text-right p-2 border border-green-200">단가</th>
                      <th className="text-right p-2 border border-green-200">금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailedBreakdown.equipment.map((equipment, index) => (
                      <tr key={index} className="border-b border-green-100">
                        <td className="p-2 border border-green-200">{equipment.name}</td>
                        <td className="p-2 border border-green-200">{equipment.type}</td>
                        <td className="text-center p-2 border border-green-200">{equipment.quantity}{equipment.unit}</td>
                        <td className="text-right p-2 border border-green-200">{equipment.unitCost.toLocaleString()}원</td>
                        <td className="text-right p-2 border border-green-200 font-medium">{equipment.totalCost.toLocaleString()}원</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 재료/기타비 */}
          {detailedBreakdown.materials.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-green-700 mb-3 border-b border-green-200 pb-2">📦 재료/기타비</h4>
              <div className="space-y-2">
                {detailedBreakdown.materials.map((material, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-200">
                    <span>{material.name}</span>
                    <span className="font-medium">{material.cost.toLocaleString()}원</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 총계 */}
          <div className="border-t-2 border-green-300 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-lg">
                <span className="font-medium">소계</span>
                <span className="font-bold">{detailedBreakdown.subtotal.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center text-lg text-green-700">
                <span className="font-medium">부가세 (10%)</span>
                <span className="font-bold">+{detailedBreakdown.vat.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center text-xl bg-green-100 p-3 rounded-lg">
                <span className="font-bold text-green-800">총 견적금액</span>
                <span className="font-bold text-green-800">{detailedBreakdown.total.toLocaleString()}원</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI 종합평가 섹션 */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-300 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-purple-800 mb-4 flex items-center">
            <i className="ri-ai-generate mr-2 w-5 h-5 flex items-center justify-center"></i>
            🤖 AI 종합평가
          </h3>
          
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`ri-star-${star <= Math.floor(aiRating.rating) ? 'fill' : star <= aiRating.rating ? 'half-fill' : 'line'} text-2xl ${
                    star <= aiRating.rating ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                ></i>
              ))}
              <span className="ml-3 text-xl font-bold text-purple-700">
                {aiRating.rating}/5.0
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-800 mb-2">✅ 평가 근거</h4>
              <ul className="space-y-1 text-sm text-purple-700">
                {aiRating.reasons.length > 0 ? aiRating.reasons.map((reason, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    {reason}
                  </li>
                )) : (
                  <li className="text-sm text-purple-600">기본적인 디자인 구성입니다</li>
                )}
              </ul>
            </div>

            <div className="bg-white border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-800 mb-2">💡 개선 제안</h4>
              {aiRating.recommendations.length > 0 ? (
                <ul className="space-y-1 text-sm text-purple-700">
                  {aiRating.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-purple-500 mr-2">→</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-purple-700">현재 구성이 목적에 적합합니다!</p>
              )}
            </div>
          </div>

          <div className="bg-white border border-purple-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-purple-800 mb-2">🏭 업계 표준 비교</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="text-center p-3 bg-purple-50 rounded">
                <div className="font-medium text-purple-800">개인 디자이너</div>
                <div className="text-purple-600">50-150만원</div>
                <div className="text-xs text-purple-500 mt-1">
                  {totalPriceImpact <= 1500000 ? '적정 범위' : '예산 초과'}
                </div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded">
                <div className="font-medium text-purple-800">디자인 스튜디오</div>
                <div className="text-purple-600">150-500만원</div>
                <div className="text-xs text-purple-500 mt-1">
                  {totalPriceImpact >= 1500000 && totalPriceImpact <= 5000000 ? '적정 범위' : 
                   totalPriceImpact < 1500000 ? '예산 부족' : '예산 초과'}
                </div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded">
                <div className="font-medium text-purple-800">대형 에이전시</div>
                <div className="text-purple-600">500-2000만원</div>
                <div className="text-xs text-purple-500 mt-1">
                  {totalPriceImpact >= 5000000 ? '적정 범위' : '예산 부족'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 예상 제작기간 */}
        <div className="bg-white border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-green-800 mb-4 flex items-center">
            <i className="ri-calendar-line mr-2 w-4 h-4 flex items-center justify-center"></i>
            예상 제작기간: {estimatedDays}일
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
              <span className="text-green-700">1단계: 기획 및 디자인 컨셉</span>
              <span className="text-green-800 font-medium">{Math.ceil(estimatedDays * 0.3)}일</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
              <span className="text-green-700">2단계: 디자인 제작</span>
              <span className="text-green-800 font-medium">{Math.ceil(estimatedDays * 0.5)}일</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
              <span className="text-green-700">3단계: 수정 및 완성</span>
              <span className="text-green-800 font-medium">{Math.ceil(estimatedDays * 0.2)}일</span>
            </div>
          </div>
        </div>

        {/* 협의 필요 항목 알림 */}
        {hasNegotiableItems && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-orange-800 mb-2 flex items-center">
              <i className="ri-alert-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              협의 필요 항목 안내
            </h3>
            <p className="text-sm text-orange-700 mb-2">
              일부 선택하신 옵션은 프로젝트 규모나 복잡도에 따라 비용이 조정될 수 있습니다.
            </p>
          </div>
        )}

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
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1">최대 500자까지 입력 가능합니다.</div>
          </div>
        </div>

        {/* 출력 및 공유 기능 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.print()}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-printer-line mr-2"></i>
            견적서 인쇄/PDF
          </button>
          
          <button
            onClick={handleEmailQuote}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-mail-send-line mr-2"></i>
            상세견적 이메일발송
          </button>
          
          <button
            onClick={() => {
              const message = `디자인 제작 견적 공유\\n\\n견적 금액: ${detailedBreakdown.total.toLocaleString()}원 (부가세 포함)\\n제작 기간: ${estimatedDays}일\\n\\n자세한 내용은 견적서를 확인해주세요.`;
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
            onClick={() => setShowFinalQuote(false)}
            className="px-4 py-2 text-green-600 hover:text-green-800 transition-colors cursor-pointer"
          >
            견적서 접기
          </button>
        </div>
      </div>
    );
  };

  // 🚀 기존 로직: UI/UX 제어 함수 및 상태 계산
  const disabledOptions = getDisabledOptions(5, data);
  const isElementDisabled = (elementName: string): boolean => {
    return disabledOptions.elements?.includes(elementName) || false;
  };
  const getDisabledReasonMessage = (elementName: string): string => {
    return getDisabledReason(5, 'elements', elementName, data);
  };

  const updateElement = (elementName: string, enabled: boolean, value?: number) => {
    if (isElementDisabled(elementName) && enabled) return;
    
    const element = designElements.find(e => e.name === elementName);
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
        const element = designElements.find(e => e.name === name);
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
      calculatedTotalCost: totalPriceImpact,
      realTimePrice: totalPriceImpact,
      realTimeDays: Math.max(totalTimeImpact, 5)
    });
    onNext();
  };

  const { totalPriceImpact, totalTimeImpact } = calculateImpact();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">🎨 디자인 제작 세부 옵션</h2>
        <p className="text-gray-600 mb-6">브랜딩부터 웹디자인까지 각 분야별 전문 옵션을 선택해주세요. 실시간으로 비용 변화를 확인할 수 있습니다.</p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-green-800 mb-2">
            선택된 서비스: 디자인 제작
          </h3>
          <div className="space-y-1 text-sm">
            {data.purposes && data.purposes.length > 0 && (
              <p className="text-green-700">
                <strong>목적:</strong> {data.purposes.join(', ')}
              </p>
            )}
            {data.details && data.details.length > 0 && (
              <p className="text-green-700">
                <strong>세부용도:</strong> {data.details.join(', ')}
              </p>
            )}
          </div>
          
          <div className="mt-3 p-3 bg-green-100 rounded-lg">
            <p className="text-xs text-green-700 font-medium">
              💡 디자인 서비스는 브랜딩, 웹디자인, 인쇄물 등 분야별 전문 옵션을 제공합니다
            </p>
          </div>
        </div>
      </div>

      {/* AI 추천 패널 */}
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
              <p className="text-green-600 text-sm mt-2">디자인 업계 경험과 비용 효율성을 반영중입니다</p>
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
          {designElements.map((element) => {
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
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
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
                            : 'bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600'
                        }`}></div>
                      </label>
                    </div>
                  </div>

                  {elementConfig.enabled && !disabled && (
                    <div className="p-4">
                      {element.type === 'option' && element.options ? (
                        <div className="space-y-3">
                          {element.options.map((option, index) => (
                            <label
                              key={index}
                              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-green-50 transition-colors ${
                                elementConfig.selectedOption === index ? 'border-green-500 bg-green-50' : 'border-gray-200'
                              }`}
                            >
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  name={`${element.name}-option`}
                                  checked={elementConfig.selectedOption === index}
                                  onChange={() => updateElement(element.name, true, index)}
                                  className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                                />
                                <div>
                                  <div className="font-medium text-gray-900">{option.label}</div>
                                  <div className="text-sm text-gray-600">{option.desc}</div>
                                  {option.note && (
                                    <div className="text-xs text-green-600 mt-1">💡 {option.note}</div>
                                  )}
                                  {option.volumeNote && (
                                    <div className="text-xs text-orange-600 mt-1">📏 {option.volumeNote}</div>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-green-600">
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
              </div>
            );
          })}
        </div>

        {/* 실시간 영향도 미리보기 */}
        <div className="bg-green-50 p-4 rounded-lg h-fit">
          <h3 className="font-semibold text-green-800 mb-4">실시간 비용 계산</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-700 font-medium">추가 비용</span>
                <span className="text-green-800 font-semibold text-lg">
                  +{totalPriceImpact.toLocaleString()}원
                </span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((totalPriceImpact / 5000000) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-green-600 mt-1">최대 500만원 기준</div>
            </div>

            {Object.entries(elements).filter(([_, config]: [string, any]) => config.enabled).length > 0 && (
              <div className="mt-4 pt-4 border-t border-green-200">
                <h4 className="text-sm font-medium text-green-800 mb-3">선택된 옵션</h4>
                <div className="space-y-2">
                  {Object.entries(elements)
                    .filter(([_, config]: [string, any]) => config.enabled)
                    .map(([name, config]: [string, any]) => {
                      const element = designElements.find(e => e.name === name);
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
                        <div key={name} className="bg-white p-2 rounded border border-green-100">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-sm font-medium text-green-800">{name}</div>
                              <div className="text-xs text-green-600">{optionText}</div>
                            </div>
                            <div className="text-sm font-bold text-green-700">
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
                <i className="ri-information-line text-green-400 text-2xl mb-2"></i>
                <p className="text-green-600 text-sm">
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
          placeholder="예: 특별한 디자인 스타일을 원해요 / 브랜드 가이드라인이 있어요 / 추가 디자인 요소가 필요해요 등"
          className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-white"
          rows={4}
        />
        <p className="text-xs text-orange-700 mt-2">
          💡 AI 추천과 다른 특별한 디자인 요구사항이 있으시면 자유롭게 작성해주세요!
        </p>
      </div>

      {/* 최종 견적서 생성 버튼 */}
      {!showFinalQuote && (
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-lg p-6 text-center">
          <h3 className="font-bold text-green-800 mb-2">견적 확인 완료!</h3>
          <p className="text-green-600 mb-4">모든 옵션 선택이 완료되었습니다. 최종 견적서를 생성해보세요.</p>
          <button
            onClick={generateFinalQuote}
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors cursor-pointer text-lg whitespace-nowrap"
          >
            <i className="ri-file-text-line mr-2"></i>
            최종 견적서 생성
          </button>
        </div>
      )}

      {/* 최종 견적서 렌더링 */}
      {showFinalQuote && renderFinalQuote()}

      <div className="flex justify-between pt-6">
        <button
          onClick={onPrev}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium whitespace-nowrap cursor-pointer hover:bg-gray-200 transition-colors"
        >
          이전으로
        </button>
        {showFinalQuote ? (
          <button
            onClick={goToFirstStep}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium whitespace-nowrap cursor-pointer hover:bg-green-700 transition-colors"
          >
            처음으로
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium whitespace-nowrap cursor-pointer hover:bg-green-700 transition-colors"
          >
            다음으로
          </button>
        )}
      </div>
    </div>
  );
}
