
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
  role: string;       // 역할 (촬영감독, 편집자 등)
  grade: string;      // 등급 (시니어, 주니어, 인턴 등)
  count: number;      // 인원수
  dailyRate: number;  // 일당
  days: number;       // 투입 일수
  totalCost: number;  // 총 인건비
}

interface EquipmentCost {
  name: string;       // 장비명
  type: string;       // 타입 (카메라, 조명, 소프트웨어 등)
  unit: string;       // 단위 (일, 월, 세트 등)
  quantity: number;   // 수량
  unitCost: number;   // 단가
  totalCost: number;  // 총 비용
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
    // 🚀 NEW: 상세 비용 분해
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

export default function Step5VideoElements({ data, onUpdate, onNext, onPrev }: Props) {
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
      
      let recommendedCombination: { [key: string]: any } = {};
      let reasoning = '';
      let benefits: string[] = [];
      let totalCost = 0;
      let confidence = 92;

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

  // 🎬 영상 제작 전용 옵션들 (상세 비용 분해 포함)
  const videoElements: Element[] = [
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
          note: '기본 컨셉, 러닝타임 2-3일',
          personnel: [
            { role: '영상 기획자', grade: '주니어', count: 1, dailyRate: 80000, days: 3, totalCost: 240000 }
          ],
          equipment: [
            { name: '기획 소프트웨어', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 20000, totalCost: 20000 }
          ],
          materials: []
        },
        { 
          label: '전문 기획', 
          value: 1, 
          desc: '상세 기획서 + 스토리보드', 
          price: 500000,
          negotiable: true,
          note: '전문 기획자 투입, 5-7일 소요',
          personnel: [
            { role: '시니어 기획자', grade: '시니어', count: 1, dailyRate: 150000, days: 5, totalCost: 750000 },
            { role: '스토리보드 작가', grade: '중급', count: 1, dailyRate: 100000, days: 3, totalCost: 300000 }
          ],
          equipment: [
            { name: 'Adobe Creative Suite', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 50000, totalCost: 50000 },
            { name: '스토리보드 도구', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 30000, totalCost: 30000 }
          ],
          materials: [
            { name: '기획서 제작비', cost: 100000 }
          ]
        },
        { 
          label: '프리미엄 기획', 
          value: 2, 
          desc: '완전 맞춤 기획 + 콘티', 
          price: 1200000,
          negotiable: true,
          note: '시니어 기획자 + 콘티 작가, 7-10일',
          volumeNote: '분량별 차등, 복잡도에 따라 협의',
          personnel: [
            { role: '크리에이티브 디렉터', grade: '전문가', count: 1, dailyRate: 300000, days: 7, totalCost: 2100000 },
            { role: '시나리오 작가', grade: '시니어', count: 1, dailyRate: 200000, days: 5, totalCost: 1000000 },
            { role: '콘티 전문가', grade: '중급', count: 1, dailyRate: 120000, days: 7, totalCost: 840000 }
          ],
          equipment: [
            { name: 'Adobe Creative Suite Pro', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 100000, totalCost: 100000 },
            { name: '프리비즈 소프트웨어', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 80000, totalCost: 80000 }
          ],
          materials: [
            { name: '프리미엄 기획서', cost: 300000 },
            { name: '프리비즈 제작', cost: 200000 }
          ]
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
          note: '출연진 없음',
          personnel: [],
          equipment: [],
          materials: []
        },
        { 
          label: '일반인', 
          value: 1, 
          desc: '직원 또는 일반인', 
          price: 200000,
          note: '일반인 출연비, 1일 기준',
          personnel: [
            { role: '일반 출연자', grade: '일반', count: 2, dailyRate: 100000, days: 1, totalCost: 200000 }
          ],
          equipment: [
            { name: '메이크업 용품', type: '기타', unit: '세트', quantity: 1, unitCost: 50000, totalCost: 50000 }
          ],
          materials: []
        },
        { 
          label: '전문 모델', 
          value: 2, 
          desc: '전문 모델 2-3명', 
          price: 800000,
          negotiable: true,
          note: '모델급 출연진, 1일 기준',
          personnel: [
            { role: '전문 모델', grade: '전문', count: 2, dailyRate: 500000, days: 1, totalCost: 1000000 },
            { role: '메이크업 아티스트', grade: '전문', count: 1, dailyRate: 200000, days: 1, totalCost: 200000 }
          ],
          equipment: [
            { name: '전문 메이크업 장비', type: '기타', unit: '세트', quantity: 1, unitCost: 100000, totalCost: 100000 }
          ],
          materials: [
            { name: '의상 대여비', cost: 300000 }
          ]
        },
        { 
          label: '유명인', 
          value: 3, 
          desc: '인플루언서/셀럽', 
          price: 3000000, 
          negotiable: true,
          note: '셀럽급, 별도 협의 필수',
          personnel: [
            { role: '셀럽/인플루언서', grade: '최고급', count: 1, dailyRate: 5000000, days: 1, totalCost: 5000000 },
            { role: '매니저', grade: '전문', count: 1, dailyRate: 300000, days: 1, totalCost: 300000 },
            { role: '전담 스타일리스트', grade: '전문', count: 1, dailyRate: 400000, days: 1, totalCost: 400000 }
          ],
          equipment: [
            { name: '럭셔리 메이크업 세트', type: '기타', unit: '세트', quantity: 1, unitCost: 500000, totalCost: 500000 }
          ],
          materials: [
            { name: '고급 의상 대여', cost: 1000000 },
            { name: '촬영 케이터링', cost: 200000 }
          ]
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
          note: '스튜디오 대여비, 1일 기준',
          personnel: [],
          equipment: [
            { name: '스튜디오 대여', type: '공간', unit: '일', quantity: 1, unitCost: 500000, totalCost: 500000 }
          ],
          materials: [
            { name: '스튜디오 부대비용', cost: 100000 }
          ]
        },
        { 
          label: '실내', 
          value: 1, 
          desc: '사무실/매장 (1일)', 
          price: 200000,
          note: '실내 촬영비, 1일 기준',
          personnel: [],
          equipment: [
            { name: '실내 촬영 세팅', type: '장비', unit: '일', quantity: 1, unitCost: 200000, totalCost: 200000 }
          ],
          materials: []
        },
        { 
          label: '야외', 
          value: 2, 
          desc: '야외 로케이션 (1일)', 
          price: 400000,
          negotiable: true,
          note: '로케이션 촬영비, 1일 기준',
          personnel: [
            { role: '로케이션 매니저', grade: '중급', count: 1, dailyRate: 150000, days: 1, totalCost: 150000 }
          ],
          equipment: [
            { name: '이동용 촬영장비', type: '장비', unit: '일', quantity: 1, unitCost: 250000, totalCost: 250000 }
          ],
          materials: [
            { name: '로케이션 허가비', cost: 100000 }
          ]
        },
        { 
          label: '특수 장소', 
          value: 3, 
          desc: '특별한 촬영지 (1일)', 
          price: 1200000,
          negotiable: true,
          note: '특수 로케이션, 허가비 포함',
          personnel: [
            { role: '특수 로케이션 매니저', grade: '전문', count: 1, dailyRate: 300000, days: 1, totalCost: 300000 }
          ],
          equipment: [
            { name: '특수 촬영장비', type: '장비', unit: '일', quantity: 1, unitCost: 500000, totalCost: 500000 }
          ],
          materials: [
            { name: '특수 허가/보험료', cost: 400000 }
          ]
        },
        { 
          label: '다중 장소', 
          value: 4, 
          desc: '여러 장소 촬영', 
          price: 800000,
          negotiable: true,
          note: '2-3곳 이상, 일정별 협의',
          personnel: [
            { role: '멀티 로케이션 매니저', grade: '중급', count: 1, dailyRate: 200000, days: 2, totalCost: 400000 }
          ],
          equipment: [
            { name: '이동 촬영 세트', type: '장비', unit: '일', quantity: 2, unitCost: 200000, totalCost: 400000 }
          ],
          materials: [
            { name: '다중 장소 교통비', cost: 200000 }
          ]
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
          note: '기본 촬영 장비 세트',
          personnel: [],
          equipment: [
            { name: 'DSLR 카메라', type: '카메라', unit: '일', quantity: 1, unitCost: 50000, totalCost: 50000 },
            { name: '기본 렌즈 세트', type: '렌즈', unit: '일', quantity: 1, unitCost: 30000, totalCost: 30000 },
            { name: '삼각대', type: '장비', unit: '일', quantity: 2, unitCost: 10000, totalCost: 20000 }
          ],
          materials: [
            { name: 'SD카드/배터리', cost: 50000 }
          ]
        },
        { 
          label: '전문 카메라', 
          value: 1, 
          desc: '시네마 카메라 + 다양한 렌즈', 
          price: 800000,
          negotiable: true,
          note: '전문 촬영 장비, RED/ARRI급',
          personnel: [],
          equipment: [
            { name: 'RED/ARRI 시네마 카메라', type: '카메라', unit: '일', quantity: 1, unitCost: 200000, totalCost: 200000 },
            { name: '시네마 렌즈 세트', type: '렌즈', unit: '일', quantity: 1, unitCost: 150000, totalCost: 150000 },
            { name: '프로 삼각대/지브', type: '장비', unit: '일', quantity: 1, unitCost: 80000, totalCost: 80000 }
          ],
          materials: [
            { name: '메모리카드/배터리팩', cost: 100000 }
          ]
        },
        { 
          label: '특수 장비', 
          value: 2, 
          desc: '드론, 짐벌, 특수 렌즈', 
          price: 1500000,
          negotiable: true,
          note: '드론, 크레인, 스테디캠 포함',
          personnel: [
            { role: '드론 조종사', grade: '전문', count: 1, dailyRate: 300000, days: 1, totalCost: 300000 }
          ],
          equipment: [
            { name: '드론 (DJI Inspire)', type: '드론', unit: '일', quantity: 1, unitCost: 300000, totalCost: 300000 },
            { name: '짐벌 스테디캠', type: '장비', unit: '일', quantity: 1, unitCost: 200000, totalCost: 200000 },
            { name: '크레인/지브', type: '장비', unit: '일', quantity: 1, unitCost: 400000, totalCost: 400000 }
          ],
          materials: [
            { name: '드론 보험료', cost: 100000 },
            { name: '특수장비 운송비', cost: 150000 }
          ]
        },
        { 
          label: '최고급 장비', 
          value: 3, 
          desc: '8K 시네마 + 모든 특수장비', 
          price: 3000000,
          negotiable: true,
          note: '최고급 장비 풀세트, 협의 필수',
          personnel: [
            { role: '장비 전문가', grade: '최고급', count: 2, dailyRate: 500000, days: 1, totalCost: 1000000 }
          ],
          equipment: [
            { name: '8K 시네마 카메라', type: '카메라', unit: '일', quantity: 1, unitCost: 800000, totalCost: 800000 },
            { name: '프리미엄 렌즈세트', type: '렌즈', unit: '일', quantity: 1, unitCost: 600000, totalCost: 600000 },
            { name: '최고급 특수장비', type: '장비', unit: '일', quantity: 1, unitCost: 600000, totalCost: 600000 }
          ],
          materials: [
            { name: '고급 저장장치', cost: 300000 },
            { name: '전문 케이스/운송', cost: 200000 }
          ]
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
          note: '1인 촬영 시스템, 1일',
          personnel: [
            { role: '촬영감독', grade: '중급', count: 1, dailyRate: 400000, days: 1, totalCost: 400000 }
          ],
          equipment: [
            { name: '기본 조명 세트', type: '조명', unit: '일', quantity: 1, unitCost: 100000, totalCost: 100000 }
          ],
          materials: []
        },
        { 
          label: '기본 팀', 
          value: 1, 
          desc: '촬영감독 + 조명감독 + 어시스턴트', 
          price: 1200000,
          negotiable: true,
          note: '3-4명 기본 크루, 1일',
          personnel: [
            { role: '촬영감독', grade: '시니어', count: 1, dailyRate: 500000, days: 1, totalCost: 500000 },
            { role: '조명감독', grade: '중급', count: 1, dailyRate: 350000, days: 1, totalCost: 350000 },
            { role: '촬영 어시스턴트', grade: '주니어', count: 2, dailyRate: 150000, days: 1, totalCost: 300000 }
          ],
          equipment: [
            { name: '전문 조명 세트', type: '조명', unit: '일', quantity: 1, unitCost: 300000, totalCost: 300000 }
          ],
          materials: [
            { name: '소모품/기타', cost: 100000 }
          ]
        },
        { 
          label: '전문 팀', 
          value: 2, 
          desc: '풀 크루 + 메이크업 + 스타일리스트', 
          price: 2500000,
          negotiable: true,
          note: '7-8명 전문 크루, 1일',
          personnel: [
            { role: '촬영감독', grade: '전문가', count: 1, dailyRate: 700000, days: 1, totalCost: 700000 },
            { role: '조명감독', grade: '전문가', count: 1, dailyRate: 500000, days: 1, totalCost: 500000 },
            { role: '메이크업 아티스트', grade: '전문', count: 1, dailyRate: 300000, days: 1, totalCost: 300000 },
            { role: '스타일리스트', grade: '전문', count: 1, dailyRate: 250000, days: 1, totalCost: 250000 },
            { role: '촬영 어시스턴트', grade: '중급', count: 3, dailyRate: 200000, days: 1, totalCost: 600000 }
          ],
          equipment: [
            { name: '프리미엄 조명 세트', type: '조명', unit: '일', quantity: 1, unitCost: 500000, totalCost: 500000 }
          ],
          materials: [
            { name: '메이크업/스타일링 용품', cost: 200000 }
          ]
        },
        { 
          label: '프리미엄 팀', 
          value: 3, 
          desc: '시니어 크루 + 전담 스태프', 
          price: 5000000,
          negotiable: true,
          note: '10명 이상 시니어 크루, 협의 필수',
          personnel: [
            { role: '시니어 촬영감독', grade: '최고급', count: 1, dailyRate: 1000000, days: 1, totalCost: 1000000 },
            { role: '시니어 조명감독', grade: '최고급', count: 1, dailyRate: 800000, days: 1, totalCost: 800000 },
            { role: '전담 메이크업팀', grade: '전문가', count: 2, dailyRate: 400000, days: 1, totalCost: 800000 },
            { role: '전담 스타일링팀', grade: '전문가', count: 2, dailyRate: 350000, days: 1, totalCost: 700000 },
            { role: '전문 크루', grade: '전문', count: 5, dailyRate: 300000, days: 1, totalCost: 1500000 }
          ],
          equipment: [
            { name: '최고급 조명 시스템', type: '조명', unit: '일', quantity: 1, unitCost: 1000000, totalCost: 1000000 }
          ],
          materials: [
            { name: '프리미엄 소모품', cost: 500000 }
          ]
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
          note: '기본 편집, 3-4일',
          personnel: [
            { role: '편집자', grade: '주니어', count: 1, dailyRate: 80000, days: 4, totalCost: 320000 }
          ],
          equipment: [
            { name: '기본 편집 SW', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 50000, totalCost: 50000 }
          ],
          materials: []
        },
        { 
          label: '일반 편집', 
          value: 1, 
          desc: '트랜지션 + 기본 효과', 
          price: 800000,
          negotiable: true,
          note: '중급 편집, 5-7일',
          personnel: [
            { role: '편집자', grade: '중급', count: 1, dailyRate: 150000, days: 6, totalCost: 900000 }
          ],
          equipment: [
            { name: 'Adobe Premiere Pro', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 80000, totalCost: 80000 }
          ],
          materials: []
        },
        { 
          label: '고급 편집', 
          value: 2, 
          desc: '모션그래픽 + VFX', 
          price: 2000000,
          negotiable: true,
          note: '고급 편집, 10-14일',
          personnel: [
            { role: '시니어 편집자', grade: '전문가', count: 1, dailyRate: 250000, days: 10, totalCost: 2500000 },
            { role: 'VFX 전문가', grade: '전문가', count: 1, dailyRate: 300000, days: 7, totalCost: 2100000 }
          ],
          equipment: [
            { name: 'Adobe Creative Suite', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 150000, totalCost: 150000 },
            { name: 'After Effects Pro', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 100000, totalCost: 100000 }
          ],
          materials: [
            { name: '고급 소스/폰트', cost: 200000 }
          ]
        },
        { 
          label: '마스터급', 
          value: 3, 
          desc: '최고 수준 편집 + 특수효과', 
          price: 5000000,
          negotiable: true,
          note: '마스터급 편집자, 협의 필수',
          personnel: [
            { role: '마스터 편집감독', grade: '최고급', count: 1, dailyRate: 500000, days: 14, totalCost: 7000000 },
            { role: 'VFX 디렉터', grade: '최고급', count: 1, dailyRate: 600000, days: 10, totalCost: 6000000 },
            { role: '특수효과 전문가', grade: '전문가', count: 2, dailyRate: 400000, days: 12, totalCost: 9600000 }
          ],
          equipment: [
            { name: '프로 편집 시스템', type: '하드웨어', unit: '월', quantity: 1, unitCost: 500000, totalCost: 500000 },
            { name: '최고급 편집 SW', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 300000, totalCost: 300000 }
          ],
          materials: [
            { name: '프리미엄 라이선스', cost: 1000000 }
          ]
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
          note: '기본 그래픽, 2-3일',
          personnel: [
            { role: '그래픽 디자이너', grade: '주니어', count: 1, dailyRate: 100000, days: 3, totalCost: 300000 }
          ],
          equipment: [
            { name: 'Adobe Illustrator', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 50000, totalCost: 50000 }
          ],
          materials: []
        },
        { 
          label: '모션 그래픽', 
          value: 1, 
          desc: '움직이는 그래픽 + 인포그래픽', 
          price: 800000,
          negotiable: true,
          note: '모션그래픽 디자이너, 5-7일',
          personnel: [
            { role: '모션그래픽 디자이너', grade: '중급', count: 1, dailyRate: 180000, days: 6, totalCost: 1080000 }
          ],
          equipment: [
            { name: 'After Effects', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 80000, totalCost: 80000 }
          ],
          materials: [
            { name: '모션 템플릿', cost: 150000 }
          ]
        },
        { 
          label: '3D 그래픽', 
          value: 2, 
          desc: '3D 모델링 + 애니메이션', 
          price: 2500000,
          negotiable: true,
          note: '3D 전문가, 10-14일',
          personnel: [
            { role: '3D 모션그래픽 전문가', grade: '전문가', count: 1, dailyRate: 300000, days: 12, totalCost: 3600000 }
          ],
          equipment: [
            { name: 'Cinema 4D', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 200000, totalCost: 200000 },
            { name: '3D 렌더링 시스템', type: '하드웨어', unit: '월', quantity: 1, unitCost: 300000, totalCost: 300000 }
          ],
          materials: [
            { name: '3D 모델/텍스처', cost: 400000 }
          ]
        },
        { 
          label: 'VFX', 
          value: 3, 
          desc: '특수효과 + 합성', 
          price: 5000000,
          negotiable: true,
          note: 'VFX 전문팀, 협의 필수',
          personnel: [
            { role: 'VFX 수퍼바이저', grade: '최고급', count: 1, dailyRate: 800000, days: 15, totalCost: 12000000 },
            { role: 'VFX 아티스트', grade: '전문가', count: 3, dailyRate: 400000, days: 12, totalCost: 14400000 }
          ],
          equipment: [
            { name: 'VFX 워크스테이션', type: '하드웨어', unit: '월', quantity: 1, unitCost: 800000, totalCost: 800000 },
            { name: 'Nuke/Houdini', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 500000, totalCost: 500000 }
          ],
          materials: [
            { name: 'VFX 라이브러리', cost: 2000000 }
          ]
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
          note: '라이선스 음원, 1-2일',
          personnel: [
            { role: '사운드 에디터', grade: '주니어', count: 1, dailyRate: 100000, days: 2, totalCost: 200000 }
          ],
          equipment: [
            { name: '기본 오디오 SW', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 30000, totalCost: 30000 }
          ],
          materials: [
            { name: '라이선스 음원', cost: 100000 }
          ]
        },
        { 
          label: '맞춤 음향', 
          value: 1, 
          desc: '브랜드 맞춤 선곡 + 효과음 편집', 
          price: 600000,
          negotiable: true,
          note: '사운드 디자이너, 3-4일',
          personnel: [
            { role: '사운드 디자이너', grade: '중급', count: 1, dailyRate: 200000, days: 4, totalCost: 800000 }
          ],
          equipment: [
            { name: 'Pro Tools', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 100000, totalCost: 100000 }
          ],
          materials: [
            { name: '프리미엄 음원 라이브러리', cost: 200000 }
          ]
        },
        { 
          label: '오리지널 작곡', 
          value: 2, 
          desc: '전용 음악 제작 + 완전 믹싱', 
          price: 2000000,
          negotiable: true,
          note: '작곡가 + 믹싱 엔지니어, 7-10일',
          personnel: [
            { role: '작곡가', grade: '전문가', count: 1, dailyRate: 400000, days: 7, totalCost: 2800000 },
            { role: '믹싱 엔지니어', grade: '전문가', count: 1, dailyRate: 300000, days: 3, totalCost: 900000 }
          ],
          equipment: [
            { name: '전문 스튜디오 대여', type: '공간', unit: '일', quantity: 3, unitCost: 200000, totalCost: 600000 },
            { name: '레코딩 장비', type: '장비', unit: '일', quantity: 7, unitCost: 100000, totalCost: 700000 }
          ],
          materials: [
            { name: '오리지널 작곡비', cost: 1000000 }
          ]
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
          note: '분량별 차등, 1분당 20만원',
          personnel: [
            { role: '일반 성우', grade: '일반', count: 1, dailyRate: 200000, days: 1, totalCost: 200000 }
          ],
          equipment: [
            { name: '기본 레코딩 장비', type: '장비', unit: '일', quantity: 1, unitCost: 50000, totalCost: 50000 }
          ],
          materials: []
        },
        { 
          label: '전문 성우', 
          value: 1, 
          desc: '경력 성우 (1분 기준)', 
          price: 400000,
          negotiable: true,
          note: '경력 10년 이상, 1분당 40만원',
          personnel: [
            { role: '전문 성우', grade: '전문', count: 1, dailyRate: 400000, days: 1, totalCost: 400000 }
          ],
          equipment: [
            { name: '전문 레코딩 스튜디오', type: '공간', unit: '일', quantity: 1, unitCost: 150000, totalCost: 150000 }
          ],
          materials: []
        },
        { 
          label: '유명 성우', 
          value: 2, 
          desc: '셀럽 성우 (1분 기준)', 
          price: 1500000, 
          negotiable: true,
          note: '유명 성우, 협의 필수',
          personnel: [
            { role: '유명 성우', grade: '최고급', count: 1, dailyRate: 1500000, days: 1, totalCost: 1500000 }
          ],
          equipment: [
            { name: '프리미엄 레코딩 스튜디오', type: '공간', unit: '일', quantity: 1, unitCost: 300000, totalCost: 300000 }
          ],
          materials: [
            { name: '셀럽 출연료', cost: 1000000 }
          ]
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
          note: '분량 무관 고정가',
          personnel: [
            { role: '자막 편집자', grade: '주니어', count: 1, dailyRate: 80000, days: 1, totalCost: 80000 }
          ],
          equipment: [],
          materials: []
        },
        { 
          label: '디자인 자막', 
          value: 1, 
          desc: '스타일링 적용 자막', 
          price: 300000,
          negotiable: true,
          note: '복잡도에 따라 협의',
          personnel: [
            { role: '자막 디자이너', grade: '중급', count: 1, dailyRate: 150000, days: 2, totalCost: 300000 }
          ],
          equipment: [
            { name: '자막 디자인 SW', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 50000, totalCost: 50000 }
          ],
          materials: []
        },
        { 
          label: '애니메이션 자막', 
          value: 2, 
          desc: '모션 효과 자막', 
          price: 600000,
          negotiable: true,
          note: '모션 복잡도에 따라 협의',
          personnel: [
            { role: '모션 자막 전문가', grade: '전문가', count: 1, dailyRate: 200000, days: 3, totalCost: 600000 }
          ],
          equipment: [
            { name: 'After Effects', type: '소프트웨어', unit: '월', quantity: 1, unitCost: 80000, totalCost: 80000 }
          ],
          materials: [
            { name: '모션 템플릿', cost: 100000 }
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
        const element = videoElements.find(e => e.name === name);
        if (element?.type === 'option' && element.options) {
          const selectedOption = element.options[config.selectedOption || 0];
          
          // 인력비 집계
          if (selectedOption.personnel) {
            allPersonnel.push(...selectedOption.personnel);
          }
          
          // 장비비 집계
          if (selectedOption.equipment) {
            allEquipment.push(...selectedOption.equipment);
          }
          
          // 재료/기타비 집계
          if (selectedOption.materials) {
            allMaterials.push(...selectedOption.materials);
          }
          
          subtotal += selectedOption.price;
        }
      }
    });

    // 부가세 계산 (10%)
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

  // 🚀 최종 견적서 생성 상태
  const [showFinalQuote, setShowFinalQuote] = useState(false);

  // 🚀 NEW: AI 종합평가 계산 함수
  const calculateAIOverallRating = () => {
    const purposes = data.purposes || [];
    const details = data.details || [];
    const scale = data.scale || {};
    
    let rating = 3.0; // 기본 별점
    let reasons = [];
    let recommendations = [];
    
    // 목적 대비 비용 분석
    const isExpensive = totalPriceImpact > 4000000;
    const isCheap = totalPriceImpact < 1500000;
    const isMarketingPurpose = purposes.includes('마케팅·홍보');
    const isEducationPurpose = purposes.includes('교육·안내');
    
    // 비용 적정성 평가
    if (isMarketingPurpose && totalPriceImpact >= 3000000) {
      rating += 0.8;
      reasons.push('마케팅 목적에 적합한 투자 수준');
    } else if (isMarketingPurpose && isCheap) {
      rating -= 0.5;
      reasons.push('마케팅 목적 대비 투자 부족');
      recommendations.push('브랜드 인지도 향상을 위해 예산 증액 고려');
    }
    
    if (isEducationPurpose && totalPriceImpact >= 2000000) {
      rating += 0.6;
      reasons.push('교육 콘텐츠 품질 확보');
    } else if (isEducationPurpose && isCheap) {
      rating -= 0.4;
      reasons.push('교육 효과를 위해 품질 향상 필요');
      recommendations.push('학습자 몰입도 향상을 위한 추가 투자 권장');
    }
    
    // 옵션 조합 분석
    const selectedOptionsCount = Object.keys(elements).filter(k => elements[k]?.enabled).length;
    const hasHighEndOptions = Object.entries(elements).some(([name, config]: [string, any]) => {
      if (!config.enabled) return false;
      const element = videoElements.find(e => e.name === name);
      return element?.options && config.selectedOption >= 2;
    });
    
    if (selectedOptionsCount >= 6 && hasHighEndOptions) {
      rating += 0.5;
      reasons.push('종합적이고 전문적인 제작 구성');
    } else if (selectedOptionsCount < 3) {
      rating -= 0.4;
      reasons.push('선택 옵션이 다소 제한적');
      recommendations.push('핵심 옵션 추가로 품질 향상 가능');
    }
    
    // 규모 대비 분석
    if (scale.type === '대기업·기관' && totalPriceImpact < 2500000) {
      rating -= 0.7;
      reasons.push('대기업 규모 대비 투자 부족');
      recommendations.push('기업 이미지에 맞는 품질 확보를 위해 예산 재검토');
    } else if (scale.type === '스타트업·개인' && totalPriceImpact > 3500000) {
      rating -= 0.3;
      reasons.push('스타트업 규모 대비 과도한 투자');
      recommendations.push('초기 단계에 맞는 효율적 예산 배분 고려');
    }
    
    // 시장 트렌드 반영도
    const hasTrendOptions = Object.keys(elements).some(k => 
      k.includes('모션그래픽') || k.includes('드론') || k.includes('특수')
    );
    if (hasTrendOptions) {
      rating += 0.3;
      reasons.push('최신 영상 트렌드 반영');
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
        isCheap: totalPriceImpact < 1500000
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
      realTimeDays: Math.max(totalTimeImpact, 3)
    };
    
    onUpdate(finalData);
    setShowFinalQuote(true);
  };

  // 🚀 NEW: 상세 견적서 이메일 발송 함수
  const handleEmailQuote = () => {
    const detailedBreakdown = calculateDetailedBreakdown();
    const estimatedDays = Math.max(totalTimeImpact, 3);
    
    // 상세 내역을 포함한 이메일 본문 생성
    let emailBody = `영상 제작 상세 견적서\\n\\n`;
    
    // 프로젝트 개요
    emailBody += `=== 프로젝트 개요 ===\\n`;
    emailBody += `서비스: 영상 제작\\n`;
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
    
    // 타겟 분석
    emailBody += `=== 타겟 분석 ===\\n`;
    if (data.targetData?.ageGroups && data.targetData.ageGroups.length > 0) {
      emailBody += `연령대: ${data.targetData.ageGroups.join(', ')}\\n`;
    }
    if (data.targetData?.interests && data.targetData.interests.length > 0) {
      emailBody += `관심사: ${data.targetData.interests.slice(0, 3).join(', ')}${data.targetData.interests.length > 3 ? ' 외' : ''}\\n`;
    }
    emailBody += `\\n`;
    
    // 선택된 옵션 상세
    emailBody += `=== 선택된 옵션 상세 ===\\n`;
    Object.entries(elements)
      .filter(([_, config]: [string, any]) => config.enabled)
      .forEach(([name, config]: [string, any]) => {
        const element = videoElements.find(e => e.name === name);
        if (element?.type === 'option' && element.options) {
          const selectedOption = element.options[config.selectedOption || 0];
          emailBody += `${name}: ${selectedOption.label} (${selectedOption.price.toLocaleString()}원)\\n`;
          if (selectedOption.note) {
            emailBody += `  ↳ ${selectedOption.note}\\n`;
          }
        }
      });
    emailBody += `\\n`;
    
    // 상세 비용 분해
    emailBody += `=== 상세 비용 분해 ===\\n`;
    
    // 인력비
    if (detailedBreakdown.personnel.length > 0) {
      emailBody += `[인력비]\\n`;
      detailedBreakdown.personnel.forEach(person => {
        emailBody += `- ${person.role} (${person.grade}): ${person.count}명 × ${person.days}일 × ${person.dailyRate.toLocaleString()}원 = ${person.totalCost.toLocaleString()}원\\n`;
      });
      emailBody += `\\n`;
    }
    
    // 장비비
    if (detailedBreakdown.equipment.length > 0) {
      emailBody += `[장비비]\\n`;
      detailedBreakdown.equipment.forEach(equipment => {
        emailBody += `- ${equipment.name} (${equipment.type}): ${equipment.quantity}${equipment.unit} × ${equipment.unitCost.toLocaleString()}원 = ${equipment.totalCost.toLocaleString()}원\\n`;
      });
      emailBody += `\\n`;
    }
    
    // 재료/기타비
    if (detailedBreakdown.materials.length > 0) {
      emailBody += `[재료/기타비]\\n`;
      detailedBreakdown.materials.forEach(material => {
        emailBody += `- ${material.name}: ${material.cost.toLocaleString()}원\\n`;
      });
      emailBody += `\\n`;
    }
    
    // 총계
    emailBody += `=== 견적 총계 ===\\n`;
    emailBody += `소계: ${detailedBreakdown.subtotal.toLocaleString()}원\\n`;
    emailBody += `부가세(10%): ${detailedBreakdown.vat.toLocaleString()}원\\n`;
    emailBody += `총 견적금액: ${detailedBreakdown.total.toLocaleString()}원\\n\\n`;
    
    emailBody += `예상 제작기간: ${estimatedDays}일\\n\\n`;
    emailBody += `※ 본 견적서는 선택하신 옵션을 기준으로 산출되었으며, 상세 논의를 통해 조정 가능합니다.\\n`;
    emailBody += `※ 협의 필요 항목의 경우 최종 금액은 상담 후 확정됩니다.`;
    
    const subject = encodeURIComponent('영상 제작 상세 견적서');
    const body = encodeURIComponent(emailBody);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  // 🚀 최종 견적서 JSX
  const renderFinalQuote = () => {
    const estimatedDays = Math.max(totalTimeImpact, 3);
    const detailedBreakdown = calculateDetailedBreakdown();
    const hasNegotiableItems = Object.entries(elements).some(([name, config]: [string, any]) => {
      if (!config.enabled) return false;
      const element = videoElements.find(e => e.name === name);
      if (element?.type === 'option' && element.options) {
        const selectedOption = element.options[config.selectedOption || 0];
        return selectedOption.negotiable;
      }
      return false;
    });

    // 🚀 NEW: AI 종합평가 계산
    const aiRating = calculateAIOverallRating();

    return (
      <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-300 rounded-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-2">📋 최종 견적서</h2>
          <p className="text-blue-600">영상 제작 프로젝트 상세 견적</p>
        </div>

        {/* 프로젝트 개요 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-3 flex items-center">
              <i className="ri-file-text-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              프로젝트 개요
            </h3>
            <div className="space-y-2 text-sm">
              <div><strong>서비스:</strong> 영상 제작</div>
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
              {data.step3Notes && (
                <div><strong>3단계 특이사항:</strong> {data.step3Notes}</div>
              )}
              {data.step4Notes && (
                <div><strong>4단계 특이사항:</strong> {data.step4Notes}</div>
              )}
            </div>
          </div>

          <div className="bg-white border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
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

        {/* 레퍼런스 정보 */}
        {data.references && data.references.length > 0 && (
          <div className="bg-white border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
              <i className="ri-image-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              레퍼런스 가이드
            </h3>
            <div className="space-y-2 text-sm">
              <div><strong>선택된 레퍼런스:</strong> {data.references.slice(0, 3).map((ref: any) => ref.title).join(', ')}{data.references.length > 3 ? ` 외 ${data.references.length - 3}개` : ''}</div>
              {data.toneKeywords && data.toneKeywords.length > 0 && (
                <div><strong>톤앤매너:</strong> {data.toneKeywords.join(', ')}</div>
              )}
              {data.step6Notes && (
                <div><strong>5단계 특이사항:</strong> {data.step6Notes}</div>
              )}
            </div>
          </div>
        )}

        {/* 🚀 NEW: 상세 비용 분해표 (세금계산서 수준) */}
        <div className="bg-white border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-4 flex items-center">
            <i className="ri-calculator-line mr-2 w-4 h-4 flex items-center justify-center"></i>
            상세 비용 분해표
          </h3>
          
          {/* 인력비 */}
          {detailedBreakdown.personnel.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-blue-700 mb-3 border-b border-blue-200 pb-2">👥 인력비</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="text-left p-2 border border-blue-200">역할</th>
                      <th className="text-left p-2 border border-blue-200">등급</th>
                      <th className="text-center p-2 border border-blue-200">인원</th>
                      <th className="text-center p-2 border border-blue-200">일수</th>
                      <th className="text-right p-2 border border-blue-200">일당</th>
                      <th className="text-right p-2 border border-blue-200">금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailedBreakdown.personnel.map((person, index) => (
                      <tr key={index} className="border-b border-blue-100">
                        <td className="p-2 border border-blue-200">
                          {person.role}
                          <div className="text-xs text-gray-500 mt-1">
                            {person.role.includes('기획') ? '영상 업계에서 기획자는 프로젝트 성공의 핵심입니다' :
                             person.role.includes('감독') ? '전문 촬영감독으로 퀄리티 보장이 필요합니다' :
                             person.role.includes('편집') ? '편집 품질이 최종 완성도를 결정합니다' :
                             person.role.includes('모델') ? '브랜드 이미지 구축을 위해 필수적입니다' :
                             '해당 분야 전문가 투입이 권장됩니다'}
                          </div>
                        </td>
                        <td className="p-2 border border-blue-200">{person.grade}</td>
                        <td className="text-center p-2 border border-blue-200">{person.count}명</td>
                        <td className="text-center p-2 border border-blue-200">{person.days}일</td>
                        <td className="text-right p-2 border border-blue-200">{person.dailyRate.toLocaleString()}원</td>
                        <td className="text-right p-2 border border-blue-200 font-medium">{person.totalCost.toLocaleString()}원</td>
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
              <h4 className="font-medium text-blue-700 mb-3 border-b border-blue-200 pb-2">🛠️ 장비비</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="text-left p-2 border border-blue-200">품목</th>
                      <th className="text-left p-2 border border-blue-200">타입</th>
                      <th className="text-center p-2 border border-blue-200">수량</th>
                      <th className="text-right p-2 border border-blue-200">단가</th>
                      <th className="text-right p-2 border border-blue-200">금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailedBreakdown.equipment.map((equipment, index) => (
                      <tr key={index} className="border-b border-blue-100">
                        <td className="p-2 border border-blue-200">
                          {equipment.name}
                          <div className="text-xs text-gray-500 mt-1">
                            {equipment.name.includes('카메라') ? '영상 품질의 기본이 되는 핵심 장비입니다' :
                             equipment.name.includes('드론') ? '드론 촬영은 차별화된 앵글 제공을 위해 필수입니다' :
                             equipment.name.includes('조명') ? '프로페셔널한 화질을 위해 조명 장비는 필수입니다' :
                             equipment.name.includes('소프트웨어') ? '전문 편집을 위한 라이선스 비용입니다' :
                             '품질 향상을 위해 필요한 장비입니다'}
                          </div>
                        </td>
                        <td className="p-2 border border-blue-200">{equipment.type}</td>
                        <td className="text-center p-2 border border-blue-200">{equipment.quantity}{equipment.unit}</td>
                        <td className="text-right p-2 border border-blue-200">{equipment.unitCost.toLocaleString()}원</td>
                        <td className="text-right p-2 border border-blue-200 font-medium">{equipment.totalCost.toLocaleString()}원</td>
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
              <h4 className="font-medium text-blue-700 mb-3 border-b border-blue-200 pb-2">📦 재료/기타비</h4>
              <div className="space-y-2">
                {detailedBreakdown.materials.map((material, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-blue-50 rounded border border-blue-200">
                    <div>
                      <span>{material.name}</span>
                      <div className="text-xs text-gray-500 mt-1">
                        {material.name.includes('의상') ? '전문적인 영상을 위해 의상은 중요한 요소입니다' :
                         material.name.includes('기획서') ? '체계적인 제작을 위해 기획서 작성이 필요합니다' :
                         material.name.includes('보험') ? '안전한 촬영을 위해 보험 가입은 필수입니다' :
                         material.name.includes('운송') ? '고가 장비 안전 운송을 위한 비용입니다' :
                         '프로젝트 완성도를 위해 필요한 비용입니다. 불필요시 협의 가능합니다'}
                      </div>
                    </div>
                    <span className="font-medium">{material.cost.toLocaleString()}원</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 총계 */}
          <div className="border-t-2 border-blue-300 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-lg">
                <span className="font-medium">소계</span>
                <span className="font-bold">{detailedBreakdown.subtotal.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center text-lg text-blue-700">
                <span className="font-medium">부가세 (10%)</span>
                <span className="font-bold">+{detailedBreakdown.vat.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center text-xl bg-blue-100 p-3 rounded-lg">
                <span className="font-bold text-blue-800">총 견적금액</span>
                <span className="font-bold text-blue-800">{detailedBreakdown.total.toLocaleString()}원</span>
              </div>
            </div>
          </div>
        </div>

        {/* 예상 제작기간 */}
        <div className="bg-white border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-4 flex items-center">
            <i className="ri-calendar-line mr-2 w-4 h-4 flex items-center justify-center"></i>
            예상 제작기간: {estimatedDays}일
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span className="text-blue-700">1단계: 기획 및 사전 작업</span>
              <span className="text-blue-800 font-medium">{Math.ceil(estimatedDays * 0.25)}일</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span className="text-blue-700">2단계: 촬영 진행</span>
              <span className="text-blue-800 font-medium">{Math.ceil(estimatedDays * 0.35)}일</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span className="text-blue-700">3단계: 편집 및 후작업</span>
              <span className="text-blue-800 font-medium">{Math.ceil(estimatedDays * 0.3)}일</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span className="text-blue-700">4단계: 최종 완성 및 납품</span>
              <span className="text-blue-800 font-medium">{Math.ceil(estimatedDays * 0.1)}일</span>
            </div>
          </div>
        </div>

        {/* 🚀 NEW: AI 종합평가 섹션 */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-300 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-purple-800 mb-4 flex items-center">
            <i className="ri-ai-generate mr-2 w-5 h-5 flex items-center justify-center"></i>
            🤖 AI 종합평가
          </h3>
          
          {/* 별점 표시 */}
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

          {/* 평가 근거 */}
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
                  <li className="text-sm text-purple-600">기본적인 영상 제작 구성입니다</li>
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

          {/* 업계별 비교 분석 */}
          <div className="bg-white border border-purple-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-purple-800 mb-2">🏭 업계 표준 비교</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="text-center p-3 bg-purple-50 rounded">
                <div className="font-medium text-purple-800">개인 프리랜서</div>
                <div className="text-purple-600">150-300만원</div>
                <div className="text-xs text-purple-500 mt-1">
                  {totalPriceImpact <= 3000000 ? '적정 범위' : '예산 초과'}
                </div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded">
                <div className="font-medium text-purple-800">중소제작사</div>
                <div className="text-purple-600">300-800만원</div>
                <div className="text-xs text-purple-500 mt-1">
                  {totalPriceImpact >= 3000000 && totalPriceImpact <= 8000000 ? '적정 범위' : 
                   totalPriceImpact < 3000000 ? '예산 부족' : '예산 초과'}
                </div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded">
                <div className="font-medium text-purple-800">대형에이전시</div>
                <div className="text-purple-600">800-2000만원</div>
                <div className="text-xs text-purple-500 mt-1">
                  {totalPriceImpact >= 8000000 ? '적정 범위' : '예산 부족'}
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-purple-600">
              💡 영상업계에서 현재 예산은 <strong>
              {totalPriceImpact <= 3000000 ? '개인 프리랜서' : 
               totalPriceImpact <= 8000000 ? '중소제작사' : '대형에이전시'}</strong> 수준입니다.
            </div>
          </div>

          {/* 예산 분석 */}
          <div className="bg-white border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-800 mb-2">💰 예산 적정성 분석</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700">경제적 예산 (기본 품질)</span>
                <span className="text-sm">{totalPriceImpact <= 2000000 ? '✅ 해당' : '❌'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700">표준적 예산 (일반 품질)</span>
                <span className="text-sm">{totalPriceImpact > 2000000 && totalPriceImpact <= 5000000 ? '✅ 해당' : '❌'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700">여유로운 예산 (프리미엄 품질)</span>
                <span className="text-sm">{totalPriceImpact > 5000000 ? '✅ 해당' : '❌'}</span>
              </div>
            </div>
            <div className="mt-3 p-2 bg-purple-50 rounded text-sm text-purple-700">
              <strong>추천 제작사:</strong> {
                totalPriceImpact <= 2000000 ? '경험있는 개인 프리랜서를 추천합니다' :
                totalPriceImpact <= 5000000 ? '중소규모 전문 제작사를 추천합니다' :
                '대형 에이전시급 제작사를 추천합니다'
              }
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
              일부 선택하신 옵션은 프로젝트 규모나 복잡도에 따라 비용이 조정될 수 있습니다:
            </p>
            <ul className="text-xs text-orange-600 space-y-1 ml-4">
              {Object.entries(elements)
                .filter(([name, config]: [string, any]) => {
                  if (!config.enabled) return false;
                  const element = videoElements.find(e => e.name === name);
                  if (element?.type === 'option' && element.options) {
                    const selectedOption = element.options[config.selectedOption || 0];
                    return selectedOption.negotiable;
                  }
                  return false;
                })
                .map(([name, config]: [string, any]) => {
                  const element = videoElements.find(e => e.name === name);
                  const selectedOption = element?.options?.[config.selectedOption || 0];
                  return (
                    <li key={name}>• {name} ({selectedOption?.label}): 세부 요구사항에 따라 조정</li>
                  );
                })}
            </ul>
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
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-printer-line mr-2"></i>
            견적서 인쇄/PDF
          </button>
          
          <button
            onClick={handleEmailQuote}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-mail-send-line mr-2"></i>
            상세견적 이메일발송
          </button>
          
          <button
            onClick={() => {
              const message = `영상 제작 견적 공유\\n\\n견적 금액: ${detailedBreakdown.total.toLocaleString()}원 (부가세 포함)\\n제작 기간: ${estimatedDays}일\\n\\n자세한 내용은 견적서를 확인해주세요.`;
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
            className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          >
            견적서 접기
          </button>
        </div>
      </div>
    );
  };

  // 기존 로직: UI/UX 제어 함수 및 상태 계산
  const disabledOptions = getDisabledOptions(5, data);

  const isElementDisabled = (elementName: string): boolean => {
    return disabledOptions.elements?.includes(elementName) || false;
  };

  const getDisabledReasonMessage = (elementName: string): string => {
    return getDisabledReason(5, 'elements', elementName, data);
  };

  const updateElement = (elementName: string, enabled: boolean, value?: number) => {
    if (isElementDisabled(elementName) && enabled) return;
    
    const element = videoElements.find(e => e.name === elementName);
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
        const element = videoElements.find(e => e.name === name);
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
      realTimeDays: Math.max(totalTimeImpact, 3)
    });
    onNext();
  };

  // 🚀 처음으로 돌아가기 함수
  const goToFirstStep = () => {
    // 현재 데이터 저장
    const finalData = {
      elements,
      step5Notes: specialNotes,
      calculatedTotalCost: totalPriceImpact,
      realTimePrice: totalPriceImpact,
      realTimeDays: Math.max(totalTimeImpact, 3)
    };
    
    onUpdate(finalData);
    
    // 처음으로 이동 (1단계로)
    window.location.reload(); // 또는 라우터를 통한 1단계 이동
  };

  const { totalPriceImpact, totalTimeImpact } = calculateImpact();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">🎬 영상 제작 세부 옵션</h2>
        <p className="text-gray-600 mb-6">기획부터 편집까지 각 단계별로 전문 옵션을 선택해주세요. 실시간으로 비용 변화를 확인할 수 있습니다.</p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-800 mb-2">
            선택된 서비스: 영상 제작
          </h3>
          <div className="space-y-1 text-sm">
            {data.purposes && data.purposes.length > 0 && (
              <p className="text-blue-700">
                <strong>목적:</strong> {data.purposes.join(', ')}
              </p>
            )}
            {data.details && data.details.length > 0 && (
              <p className="text-blue-700">
                <strong>세부용도:</strong> {data.details.join(', ')}
              </p>
            )}
            {data.productionType && (
              <p className="text-blue-700">
                <strong>제작방식:</strong> {data.productionType}
              </p>
            )}
          </div>
          
          <div className="mt-3 p-3 bg-blue-100 rounded-lg">
            <p className="text-xs text-blue-700 font-medium">
              💡 영상 제작은 기획→촬영→편집 각 단계별로 세분화된 옵션을 제공합니다
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
                      const element = videoElements.find(e => e.name === key);
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
          {videoElements.map((element) => {
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
                      ? 'border-blue-300 bg-blue-50' 
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
                            : 'bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600'
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
                              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors ${
                                elementConfig.selectedOption === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                              }`}
                            >
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  name={`${element.name}-option`}
                                  checked={elementConfig.selectedOption === index}
                                  onChange={() => updateElement(element.name, true, index)}
                                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <div>
                                  <div className="font-medium text-gray-900">{option.label}</div>
                                  <div className="text-sm text-gray-600">{option.desc}</div>
                                  {option.note && (
                                    <div className="text-xs text-blue-600 mt-1">💡 {option.note}</div>
                                  )}
                                  {option.volumeNote && (
                                    <div className="text-xs text-orange-600 mt-1">📏 {option.volumeNote}</div>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-blue-600">
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
        <div className="bg-blue-50 p-4 rounded-lg h-fit">
          <h3 className="font-semibold text-blue-800 mb-4">실시간 비용 계산</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-700 font-medium">추가 비용</span>
                <span className="text-blue-800 font-semibold text-lg">
                  +{totalPriceImpact.toLocaleString()}원
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((totalPriceImpact / 5000000) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-blue-600 mt-1">최대 500만원 기준</div>
            </div>

            {Object.entries(elements).filter(([_, config]: [string, any]) => config.enabled).length > 0 && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <h4 className="text-sm font-medium text-blue-800 mb-3">선택된 옵션</h4>
                <div className="space-y-2">
                  {Object.entries(elements)
                    .filter(([_, config]: [string, any]) => config.enabled)
                    .map(([name, config]: [string, any]) => {
                      const element = videoElements.find(e => e.name === name);
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
                        <div key={name} className="bg-white p-2 rounded border border-blue-100">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-sm font-medium text-blue-800">{name}</div>
                              <div className="text-xs text-blue-600">{optionText}</div>
                            </div>
                            <div className="text-sm font-bold text-blue-700">
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
                <i className="ri-information-line text-blue-400 text-2xl mb-2"></i>
                <p className="text-blue-600 text-sm">
                  필요한 옵션을 선택해주세요
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🚀 최종 견적서 생성 버튼 */}
      {!showFinalQuote && (
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-300 rounded-lg p-6 text-center">
          <h3 className="font-bold text-blue-800 mb-2">견적 확인 완료!</h3>
          <p className="text-blue-600 mb-4">모든 옵션 선택이 완료되었습니다. 최종 견적서를 생성해보세요.</p>
          <button
            onClick={generateFinalQuote}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors cursor-pointer text-lg whitespace-nowrap"
          >
            <i className="ri-file-text-line mr-2"></i>
            최종 견적서 생성
          </button>
        </div>
      )}

      {/* 🚀 최종 견적서 렌더링 */}
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
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium whitespace-nowrap cursor-pointer hover:bg-blue-700 transition-colors"
          >
            처음으로
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium whitespace-nowrap cursor-pointer hover:bg-blue-700 transition-colors"
          >
            다음으로
          </button>
        )}
      </div>
    </div>
  );
}
