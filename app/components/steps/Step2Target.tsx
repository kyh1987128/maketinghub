
'use client';

import { useState, useEffect, useCallback } from 'react';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface TargetData {
  ageGroups: string[];
  gender: string[];
  regions: string[];
  interests: string[];
  occupations: string[];
  nationality: string[];
  customTarget?: string;
}

interface AIRecommendation {
  target: TargetData;
  reasoning: string;
  confidence: number;
  tips: string[];
  internationalConsiderations?: {
    languageRequirements: string[];
    culturalAdaptations: string[];
    marketingChannels: string[];
    legalCompliance: string[];
  };
}

export default function Step2Target({ data, onUpdate, onNext, onPrev }: Props) {
  const [targetData, setTargetData] = useState<TargetData>({
    ageGroups: data.targetData?.ageGroups || [],
    gender: data.targetData?.gender || [],
    regions: data.targetData?.regions || [],
    interests: data.targetData?.interests || [],
    occupations: data.targetData?.occupations || [],
    nationality: data.targetData?.nationality || [],
    customTarget: data.targetData?.customTarget || ''
  });

  const [additionalNotes, setAdditionalNotes] = useState(data.step2Notes || '');
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  // 🚀 서비스별 타겟 옵션 (관심사 축소)
  const getTargetOptionsByService = () => {
    const serviceType = data.serviceType || 'video';
    
    switch (serviceType) {
      case 'video':
        return {
          ageOptions: [
            '10대 (13-19세)',
            '20대 초반 (20-24세)', 
            '20대 후반 (25-29세)',
            '30대 초반 (30-34세)',
            '30대 후반 (35-39세)',
            '40대 (40-49세)',
            '50대 (50-59세)', 
            '60대 이상 (60세+)'
          ],
          interestOptions: [
            '제조업/공장', '건설업/토목', '의료업계/병원', '금융업계/은행',
            '교육업계/학원', 'IT업계/테크', '서비스업/리테일', '법무/회계',
            '부동산업계', '물류/유통', '미디어/광고', '컨설팅업계',
            '브이로그/일상', '튜토리얼/가이드', '제품 리뷰', '인터뷰/대담',
            '다큐멘터리', '홍보/광고', '이벤트 기록', '교육/강의'
          ]
        };
        
      case 'design':
        return {
          ageOptions: [
            '20대 초반 (20-24세)',
            '20대 후반 (25-29세)', 
            '30대 초반 (30-34세)',
            '30대 후반 (35-39세)',
            '40대 (40-49세)',
            '50대 (50-59세)'
          ],
          interestOptions: [
            '카페/레스토랑', '의료/병원', 'IT/테크 기업', '패션/뷰티',
            '교육/학원', '부동산/건설', '법무/회계', '금융/보험',
            '제조업/공장', '서비스업', '스포츠/피트니스', '문화/예술',
            '미니멀/심플', '빈티지/레트로', '모던/컨템포러리', '클래식/전통'
          ]
        };
        
      case 'marketing':
        return {
          ageOptions: [
            '18-24세 (Gen Z)',
            '25-34세 (밀레니얼)',
            '35-44세 (Gen X)',
            '45-54세 (베이비부머)',
            '55세 이상'
          ],
          interestOptions: [
            '디지털 마케팅', '브랜드 인지도', '매출 증대', '고객 유지',
            '인스타그램 마케팅', '페이스북 마케팅', '유튜브 마케팅', '네이버 마케팅',
            'B2B 마케팅', 'B2C 마케팅', '이커머스/쇼핑몰', '스타트업 마케팅'
          ]
        };
        
      default:
        return {
          ageOptions: ['20대 초반 (20-24세)', '20대 후반 (25-29세)', '30대 초반 (30-34세)', '30대 후반 (35-39세)', '40대 (40-49세)', '50대 (50-59세)'],
          interestOptions: ['비즈니스/경영', '기술/IT', '마케팅']
        };
    }
  };

  // 🚀 NEW: AI 추천 생성 함수 - 조건 완화
  const generateAIRecommendation = useCallback(async () => {
    const purposes = data.purposes || [];
    const serviceType = data.serviceType || 'video';
    
    setIsGeneratingAI(true);
    console.log('AI 추천 생성 시작:', { purposes, serviceType });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let recommendedTarget: TargetData;
      let reasoning = '';
      let tips: string[] = [];
      let confidence = 90;

      // 🚀 목적이 있을 때의 서비스별 정확한 추천 로직
      if (purposes.length > 0) {
        if (serviceType === 'video') {
          if (purposes.some(p => p.includes('교육') || p.includes('안전') || p.includes('훈련') || p.includes('매뉴얼'))) {
            recommendedTarget = {
              ageGroups: ['30대 초반 (30-34세)', '30대 후반 (35-39세)', '40대 (40-49세)'],
              gender: ['성별 무관'],
              regions: ['전국'],
              interests: ['교육업계/학원', '교육/강의', '튜토리얼/가이드'],
              occupations: [],
              nationality: []
            };
            reasoning = '교육·훈련 목적의 영상은 실무진과 관리자층이 주요 시청 대상이며, 전국 단위 배포가 일반적입니다.';
            tips = [
              '30-40대는 업무 교육에 가장 적극적인 연령대입니다',
              '안전 교육은 시각적 효과를 활용한 명확한 전달이 중요합니다',
              '반복 학습을 고려한 구조로 제작하는 것이 효과적입니다'
            ];
          } else if (purposes.some(p => p.includes('마케팅') || p.includes('홍보') || p.includes('브랜드') || p.includes('매출'))) {
            recommendedTarget = {
              ageGroups: ['20대 후반 (25-29세)', '30대 초반 (30-34세)', '30대 후반 (35-39세)'],
              gender: ['성별 무관'],
              regions: ['전국'],
              interests: ['홍보/광고', '제품 리뷰', '미디어/광고'],
              occupations: [],
              nationality: []
            };
            reasoning = '마케팅·홍보 영상은 구매력이 있고 디지털 미디어에 익숙한 연령층을 주요 타겟으로 합니다.';
            tips = [
              '20-30대는 온라인 영상 소비가 가장 활발한 연령대입니다',
              'SNS 플랫폼별 최적화된 포맷을 고려하세요',
              '브랜드 스토리텔링을 통한 감정적 연결이 중요합니다'
            ];
          } else if (purposes.some(p => p.includes('기업') || p.includes('채용') || p.includes('조직') || p.includes('문화'))) {
            recommendedTarget = {
              ageGroups: ['20대 후반 (25-29세)', '30대 초반 (30-34세)', '30대 후반 (35-39세)'],
              gender: ['성별 무관'],
              regions: ['전국'],
              interests: ['IT업계/테크', '서비스업/리테일', '컨설팅업계'],
              occupations: [],
              nationality: []
            };
            reasoning = '기업 영상은 잠재 직원과 이해관계자들에게 조직의 가치와 문화를 전달하는 것이 목적입니다.';
            tips = [
              '채용 대상 연령층에 맞는 톤앤매너를 사용하세요',
              '실제 직원들의 생생한 이야기를 포함하는 것이 효과적입니다',
              '회사의 성장 비전을 명확히 제시하세요'
            ];
          } else {
            // 기본 추천
            recommendedTarget = {
              ageGroups: ['30대 초반 (30-34세)', '30대 후반 (35-39세)'],
              gender: ['성별 무관'],
              regions: ['전국'],
              interests: ['홍보/광고', '교육/강의'],
              occupations: [],
              nationality: []
            };
            reasoning = '영상 제작의 일반적인 목적을 고려하여 가장 광범위한 타겟층을 추천합니다.';
            confidence = 75;
          }
        } else if (serviceType === 'design') {
          if (purposes.some(p => p.includes('브랜드') || p.includes('로고') || p.includes('아이덴티티'))) {
            recommendedTarget = {
              ageGroups: ['20대 후반 (25-29세)', '30대 초반 (30-34세)', '30대 후반 (35-39세)'],
              gender: ['성별 무관'],
              regions: ['전국'],
              interests: ['미니멀/심플', 'IT/테크 기업'],
              occupations: [],
              nationality: []
            };
            reasoning = '브랜드 디자인은 트렌드에 민감하고 디자인 품질을 중시하는 연령대를 주요 타겟으로 합니다.';
          } else if (purposes.some(p => p.includes('웹') || p.includes('앱') || p.includes('디지털'))) {
            recommendedTarget = {
              ageGroups: ['20대 초반 (20-24세)', '20대 후반 (25-29세)', '30대 초반 (30-34세)'],
              gender: ['성별 무관'],
              regions: ['전국'],
              interests: ['IT/테크 기업', '미니멀/심플', '모던/컨템포러리'],
              occupations: [],
              nationality: []
            };
            reasoning = '디지털 디자인은 IT 트렌드를 이해하고 사용자 경험을 중시하는 연령층이 주요 타겟입니다.';
          } else {
            recommendedTarget = {
              ageGroups: ['20대 후반 (25-29세)', '30대 초반 (30-34세)'],
              gender: ['성별 무관'],
              regions: ['전국'],
              interests: ['미니멀/심플', '모던/컨템포러리'],
              occupations: [],
              nationality: []
            };
            reasoning = '디자인 서비스의 일반적인 타겟을 고려한 추천입니다.';
            confidence = 75;
          }
        } else if (serviceType === 'marketing') {
          if (purposes.some(p => p.includes('SNS') || p.includes('소셜미디어') || p.includes('디지털'))) {
            recommendedTarget = {
              ageGroups: ['18-24세 (Gen Z)', '25-34세 (밀레니얼)'],
              gender: ['성별 무관'],
              regions: ['전국'],
              interests: ['인스타그램 마케팅', '페이스북 마케팅', '유튜브 마케팅'],
              occupations: [],
              nationality: []
            };
            reasoning = 'SNS 마케팅은 디지털 네이티브 세대를 주요 타겟으로 하는 것이 효과적입니다.';
          } else {
            recommendedTarget = {
              ageGroups: ['25-34세 (밀레니얼)', '35-44세 (Gen X)'],
              gender: ['성별 무관'],
              regions: ['전국'],
              interests: ['디지털 마케팅', '브랜드 인지도', '매출 증대'],
              occupations: [],
              nationality: []
            };
            reasoning = '마케팅 서비스는 구매 결정권이 있는 주요 연령층을 타겟으로 합니다.';
          }
        }
      } else {
        // 🚀 목적이 없을 때도 서비스별 기본 추천 제공
        if (serviceType === 'video') {
          recommendedTarget = {
            ageGroups: ['20대 후반 (25-29세)', '30대 초반 (30-34세)', '30대 후반 (35-39세)'],
            gender: ['성별 무관'],
            regions: ['전국'],
            interests: ['홍보/광고', '교육/강의', '제품 리뷰'],
            occupations: [],
            nationality: []
          };
          reasoning = '영상 제작 서비스의 일반적인 타겟층입니다. 구체적인 제작 목적을 선택하시면 더 정확한 추천을 받을 수 있습니다.';
          tips = [
            '영상의 구체적인 목적을 1단계에서 선택하면 더 정확한 타겟 추천을 받을 수 있습니다',
            '20-30대는 영상 콘텐츠 소비가 가장 활발한 연령대입니다',
            '다양한 플랫폼 활용을 고려한 제작이 효과적입니다'
          ];
          confidence = 60;
        } else if (serviceType === 'design') {
          recommendedTarget = {
            ageGroups: ['20대 후반 (25-29세)', '30대 초반 (30-34세)'],
            gender: ['성별 무관'],
            regions: ['전국'],
            interests: ['미니멀/심플', '모던/컨템포러리'],
            occupations: [],
            nationality: []
          };
          reasoning = '디자인 서비스의 일반적인 타겟층입니다. 구체적인 제작 목적을 선택하시면 더 정확한 추천을 받을 수 있습니다.';
          tips = [
            '디자인의 구체적인 목적을 1단계에서 선택하면 더 정확한 타겟 추천을 받을 수 있습니다',
            '현대적이고 깔끔한 디자인을 선호하는 연령층입니다'
          ];
          confidence = 60;
        } else if (serviceType === 'marketing') {
          recommendedTarget = {
            ageGroups: ['25-34세 (밀레니얼)', '35-44세 (Gen X)'],
            gender: ['성별 무관'],
            regions: ['전국'],
            interests: ['디지털 마케팅', '브랜드 인지도'],
            occupations: [],
            nationality: []
          };
          reasoning = '마케팅 서비스의 일반적인 타겟층입니다. 구체적인 제작 목적을 선택하시면 더 정확한 추천을 받을 수 있습니다.';
          tips = [
            '마케팅의 구체적인 목적을 1단계에서 선택하면 더 정확한 타겟 추천을 받을 수 있습니다',
            '구매 결정권이 있는 연령대를 우선 타겟으로 합니다'
          ];
          confidence = 60;
        }
      }

      console.log('AI 추천 생성 완료:', { recommendedTarget, reasoning, confidence });
      
      setAiRecommendation({
        target: recommendedTarget,
        reasoning,
        confidence,
        tips
      });
      
    } catch (error) {
      console.error('AI 추천 생성 오류:', error);
    } finally {
      setIsGeneratingAI(false);
    }
  }, [data.purposes, data.serviceType]);

  // 🚀 완전 수정된 AI 추천 적용 함수
  const applyAIRecommendation = () => {
    if (!aiRecommendation) return;
    
    // 🚀 직업/국적 필드 제거하고 관심사만 정확히 적용
    const completeRecommendation: TargetData = {
      ageGroups: [...aiRecommendation.target.ageGroups],
      gender: [...aiRecommendation.target.gender],
      regions: [...aiRecommendation.target.regions],
      interests: [...aiRecommendation.target.interests],
      occupations: [], // 🚀 직업 필드 제거
      nationality: []  // 🚀 국적 필드 제거
    };
    
    // 🚀 상태 즉시 업데이트
    setTargetData(completeRecommendation);
    setShowAIPanel(false);
    
    // 🚀 렌더링 후에 상위 컴포넌트에 전달 - setTimeout으로 렌더링 중 업데이트 방지
    setTimeout(() => {
      onUpdate({ 
        targetData: completeRecommendation,
        step2Notes: additionalNotes,
        appliedAIRecommendation: true
      });
    }, 0);
  };

  // 🚀 컴포넌트 마운트 시 AI 추천 자동 생성 - 조건 완전 완화
  useEffect(() => {
    console.log('useEffect 실행:', { 
      serviceType: data.serviceType,
      aiRecommendation: !!aiRecommendation 
    });
    
    // 서비스 타입이 있고 AI 추천이 아직 없으면 항상 생성
    if (data.serviceType && !aiRecommendation) {
      console.log('AI 추천 생성 조건 만족, 추천 생성 시작 (목적 불필요)');
      generateAIRecommendation();
      setShowAIPanel(true);
    }
  }, [data.serviceType, generateAIRecommendation, aiRecommendation]);

  const { ageOptions, interestOptions } = getTargetOptionsByService();

  const genderOptions = ['남성', '여성', '성별 무관'];
  const regionOptions = ['서울', '경기/인천', '부산/경남', '대구/경북', '광주/전라', '대전/충청', '강원', '제주', '전국', '해외 🌍'];

  const handleLogicalConstraints = useCallback((category: keyof TargetData, value: string, currentSelection: string[]) => {
    let updatedSelection = [...currentSelection];

    if (category === 'regions') {
      if (value === '전국') {
        if (currentSelection.includes('전국')) {
          updatedSelection = currentSelection.filter(item => item !== '전국');
        } else {
          const overseas = currentSelection.includes('해외 🌍') ? ['해외 🌍'] : [];
          updatedSelection = ['전국', ...overseas];
        }
      } else if (value === '해외 🌍') {
        if (currentSelection.includes(value)) {
          updatedSelection = currentSelection.filter(item => item !== value);
        } else {
          updatedSelection = [...currentSelection, value];
        }
      } else {
        if (currentSelection.includes('전국')) {
          updatedSelection = currentSelection.filter(item => item !== '전국');
          if (!updatedSelection.includes(value)) {
            updatedSelection.push(value);
          }
        } else {
          if (currentSelection.includes(value)) {
            updatedSelection = currentSelection.filter(item => item !== value);
          } else {
            updatedSelection = [...currentSelection, value];
          }
        }
      }
    }
    else if (category === 'gender') {
      if (value === '성별 무관') {
        if (currentSelection.includes('성별 무관')) {
          updatedSelection = [];
        } else {
          updatedSelection = ['성별 무관'];
        }
      } else {
        if (currentSelection.includes('성별 무관')) {
          updatedSelection = [value];
        } else {
          updatedSelection = [value];
        }
      }
    }
    else {
      if (currentSelection.includes(value)) {
        updatedSelection = currentSelection.filter(item => item !== value);
      } else {
        updatedSelection = [...currentSelection, value];
      }
    }

    return updatedSelection;
  }, []);

  const handleAdditionalNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setAdditionalNotes(newValue);
    
    // 🚀 렌더링 후에 업데이트 - setTimeout으로 렌더링 중 업데이트 방지
    setTimeout(() => {
      onUpdate({ 
        targetData,
        step2Notes: newValue 
      });
    }, 0);
  };

  const handleMultiSelect = useCallback((category: keyof TargetData, value: string) => {
    if (category === 'gender' || category === 'customTarget') return;
    
    setTargetData(prev => {
      const currentArray = prev[category] as string[];
      const updated = handleLogicalConstraints(category, value, currentArray);
      
      const newTargetData = {
        ...prev,
        [category]: updated
      };
      
      // 🚀 렌더링 후에 업데이트 - setTimeout으로 렌더링 중 업데이트 방지
      setTimeout(() => {
        onUpdate({ 
          targetData: newTargetData,
          step2Notes: additionalNotes 
        });
      }, 0);
      
      return newTargetData;
    });
  }, [handleLogicalConstraints, additionalNotes, onUpdate]);

  const handleSingleSelect = useCallback((category: keyof TargetData, value: string) => {
    if (category !== 'gender') return;
    
    setTargetData(prev => {
      const currentArray = prev[category] as string[];
      const updated = handleLogicalConstraints(category, value, currentArray);
      
      const newTargetData = {
        ...prev,
        [category]: updated
      };
      
      // 🚀 렌더링 후에 업데이트 - setTimeout으로 렌더링 중 업데이트 방지
      setTimeout(() => {
        onUpdate({ 
          targetData: newTargetData,
          step2Notes: additionalNotes 
        });
      }, 0);
      
      return newTargetData;
    });
  }, [handleLogicalConstraints, additionalNotes, onUpdate]);

  const getSelectedCount = useCallback(() => {
    return targetData.ageGroups.length + 
           targetData.gender.length + 
           targetData.regions.length + 
           targetData.interests.length;
  }, [targetData]);

  const getTargetSummary = useCallback(() => {
    const parts = [];
    
    if (targetData.gender.length > 0) {
      parts.push(`${targetData.gender.join(', ')}`);
    }
    
    if (targetData.ageGroups.length > 0) {
      const ageDisplay = targetData.ageGroups.length > 2 
        ? `${targetData.ageGroups.slice(0, 2).join(', ')} 외 ${targetData.ageGroups.length - 2}개` 
        : targetData.ageGroups.join(', ');
      parts.push(ageDisplay);
    }
    
    if (targetData.regions.length > 0) {
      const regionDisplay = targetData.regions.length > 2 
        ? `${targetData.regions.slice(0, 2).join(', ')} 외 ${targetData.regions.length - 2}개 지역` 
        : `${targetData.regions.join(', ')} 지역`;
      parts.push(regionDisplay);
    }

    return parts.join(' • ');
  }, [targetData]);

  const handleNext = useCallback(() => {
    const hasBasicSelection = getSelectedCount() > 0;
    const hasAdditionalNotes = additionalNotes && additionalNotes.trim().length > 0;
    
    if (hasBasicSelection || hasAdditionalNotes) {
      onUpdate({ 
        targetData,
        step2Notes: additionalNotes 
      });
      onNext();
    }
  }, [getSelectedCount, additionalNotes, targetData, onUpdate, onNext]);

  // 🚀 useEffect로 디바운스된 업데이트 - 렌더링 중 업데이트 방지
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate({ 
        targetData,
        step2Notes: additionalNotes 
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [targetData, additionalNotes, onUpdate]);

  const canProceed = getSelectedCount() > 0 || (additionalNotes && additionalNotes.trim().length > 0);

  const getServiceInfo = () => {
    const serviceType = data.serviceType || 'video';
    
    switch (serviceType) {
      case 'video':
        return {
          title: '영상 제작 타겟 대상',
          description: '영상이 전달될 주요 시청자를 선택해주세요. 타겟에 맞는 톤앤매너와 콘텐츠 방향을 제안해드립니다.',
          color: 'blue'
        };
      case 'design':
        return {
          title: '디자인 제작 타겟 대상',
          description: '디자인이 어필할 주요 대상을 선택해주세요. 타겟에 맞는 디자인 방향성과 스타일을 제안해드립니다.',
          color: 'green'
        };
      case 'marketing':
        return {
          title: '마케팅 서비스 타겟 대상',
          description: '마케팅 캠페인의 주요 타겟을 선택해주세요. 타겟에 맞는 마케팅 전략과 채널을 제안해드립니다.',
          color: 'purple'
        };
      default:
        return {
          title: '타겟 대상 선택',
          description: '서비스가 전달될 주요 대상을 선택해주세요.',
          color: 'blue'
        };
    }
  };

  const serviceInfo = getServiceInfo();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">{serviceInfo.title}</h2>
        <p className="text-gray-600 mb-6">{serviceInfo.description}</p>
        
        {/* 선택된 서비스 표시 */}
        {data?.serviceType && (
          <div className={`bg-${serviceInfo.color}-50 border border-${serviceInfo.color}-200 rounded-lg p-4 mb-4`}>
            <div className="flex items-center">
              <i className={`ri-user-line text-${serviceInfo.color}-600 mr-2 w-4 h-4 flex items-center justify-center`}></i>
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
        )}

        {/* 이전 단계 선택사항 표시 */}
        {data?.purposes && data.purposes.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <i className="ri-target-line text-gray-600 mr-2 mt-1 w-4 h-4 flex items-center justify-center"></i>
              <div>
                <span className="font-medium text-gray-800">선택된 목적: </span>
                <span className="text-gray-700">{data.purposes.join(', ')}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI 타겟 추천 패널 */}
      {(showAIPanel || aiRecommendation) && (
        <div className={`bg-gradient-to-r from-${serviceInfo.color}-50 to-indigo-50 border-2 border-${serviceInfo.color}-200 rounded-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold text-${serviceInfo.color}-800 flex items-center`}>
              <i className="ri-ai-generate mr-2 w-5 h-5 flex items-center justify-center"></i>
              🎯 AI 맞춤 타겟 추천
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setAiRecommendation(null);
                  generateAIRecommendation();
                }}
                disabled={isGeneratingAI}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isGeneratingAI
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : `bg-${serviceInfo.color}-100 text-${serviceInfo.color}-700 hover:bg-${serviceInfo.color}-200`
                }`}
              >
                <i className="ri-refresh-line mr-1 w-3 h-3 flex items-center justify-center"></i>
                다시 추천받기
              </button>
              <button
                onClick={() => setShowAIPanel(false)}
                className={`text-${serviceInfo.color}-600 hover:text-${serviceInfo.color}-800 transition-colors cursor-pointer`}
              >
                <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
              </button>
            </div>
          </div>

          {isGeneratingAI ? (
            <div className="text-center py-8">
              <div className={`inline-block animate-spin w-8 h-8 border-4 border-${serviceInfo.color}-600 border-t-transparent rounded-full mb-4`}></div>
              <p className={`text-${serviceInfo.color}-700 font-medium`}>목적과 서비스를 분석하여 최적 타겟을 추천하고 있습니다...</p>
            </div>
          ) : aiRecommendation ? (
            <div className="space-y-4">
              <div className={`bg-white border border-${serviceInfo.color}-200 rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 bg-${serviceInfo.color}-100 text-${serviceInfo.color}-600 rounded-full flex items-center justify-center text-sm font-bold mr-3`}>
                      AI
                    </div>
                    <div>
                      <div className={`font-medium text-${serviceInfo.color}-800`}>추천 신뢰도</div>
                      <div className={`text-sm text-${serviceInfo.color}-600`}>{aiRecommendation.confidence}% 매칭</div>
                    </div>
                  </div>
                  <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                    <i className="ri-thumb-up-line text-green-600 mr-1 w-4 h-4 flex items-center justify-center"></i>
                    <span className="text-green-700 text-sm font-medium">최적 조합</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className={`font-medium text-${serviceInfo.color}-800 mb-2`}>📊 추천 근거</h4>
                  <p className={`text-${serviceInfo.color}-700 text-sm leading-relaxed`}>{aiRecommendation.reasoning}</p>
                </div>

                <div className="mb-4">
                  <h4 className={`font-medium text-${serviceInfo.color}-800 mb-2`}>🎯 추천 타겟 조합</h4>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-3 text-sm">
                    <div className={`bg-${serviceInfo.color}-50 p-2 rounded`}>
                      <div className={`font-medium text-${serviceInfo.color}-800`}>연령대</div>
                      <div className={`text-${serviceInfo.color}-600`}>{aiRecommendation.target.ageGroups.join(', ')}</div>
                    </div>
                    <div className={`bg-${serviceInfo.color}-50 p-2 rounded`}>
                      <div className={`font-medium text-${serviceInfo.color}-800`}>성별</div>
                      <div className={`text-${serviceInfo.color}-600`}>{aiRecommendation.target.gender.join(', ')}</div>
                    </div>
                    <div className={`bg-${serviceInfo.color}-50 p-2 rounded`}>
                      <div className={`font-medium text-${serviceInfo.color}-800`}>지역</div>
                      <div className={`text-${serviceInfo.color}-600`}>{aiRecommendation.target.regions.join(', ')}</div>
                    </div>
                    <div className={`bg-${serviceInfo.color}-50 p-2 rounded`}>
                      <div className={`font-medium text-${serviceInfo.color}-800`}>관심사</div>
                      <div className={`text-${serviceInfo.color}-600`}>{aiRecommendation.target.interests.join(', ')}</div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className={`font-medium text-${serviceInfo.color}-800 mb-2`}>💡 AI 추천 팁</h4>
                  <ul className={`text-sm text-${serviceInfo.color}-700 space-y-1`}>
                    {aiRecommendation.tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className={`text-${serviceInfo.color}-500 mr-1`}>•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={applyAIRecommendation}
                    className={`flex-1 px-4 py-3 bg-${serviceInfo.color}-600 text-white rounded-lg font-medium hover:bg-${serviceInfo.color}-700 transition-colors cursor-pointer whitespace-nowrap`}
                  >
                    <i className="ri-magic-line mr-2"></i>
                    AI 추천대로 적용하기
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* 논리적 제약 안내 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-medium text-yellow-800 mb-2">
          <i className="ri-lightbulb-line mr-2 w-4 h-4 flex items-center justify-center"></i>
          스마트 선택 제약 안내
        </h3>
        <div className="text-sm text-yellow-700 space-y-1">
          <p>• <strong>"전국"</strong> 선택 시 → 다른 특정 지역들이 자동 해제됩니다 (해외 제외, 해제도 자유롭게 가능)</p>
          <p>• <strong>"성별 무관"</strong> 선택 시 → 남성/여성 옵션이 자동 해제됩니다 (해제도 자유롭게 가능)</p>
          <p>• <strong>해외 타겟 포함 시</strong> → 국제화 고려사항이 자동으로 분석됩니다</p>
        </div>
      </div>

      {/* 구체적 선택 옵션들 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 나이대 선택 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium mb-3 flex items-center">
            <i className={`ri-calendar-line text-${serviceInfo.color}-600 mr-2 w-4 h-4 flex items-center justify-center`}></i>
            나이대 (중복 선택 가능)
            <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {data.serviceType === 'video' ? '시청 패턴 기준' : 
               data.serviceType === 'design' ? '디자인 민감도 기준' : 
               data.serviceType === 'marketing' ? '디지털 활용도 기준' : '일반'}
            </span>
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {ageOptions.map((age) => (
              <div key={age} className="relative group">
                <label
                  className={`flex items-center p-2 border rounded-lg transition-colors ${
                    targetData.ageGroups.includes(age)
                      ? `border-${serviceInfo.color}-500 bg-${serviceInfo.color}-50 cursor-pointer hover:bg-${serviceInfo.color}-100`
                      : 'border-gray-200 bg-white cursor-pointer hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={targetData.ageGroups.includes(age)}
                    onChange={() => handleMultiSelect('ageGroups', age)}
                    className={`mr-3 h-4 w-4 text-${serviceInfo.color}-600 focus:ring-${serviceInfo.color}-500 border-gray-300 rounded`}
                  />
                  <span className={`text-sm ${
                    targetData.ageGroups.includes(age)
                      ? `text-${serviceInfo.color}-700 font-medium`
                      : 'text-gray-700'
                  }`}>
                    {age}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* 성별 선택 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium mb-3 flex items-center">
            <i className={`ri-user-3-line text-${serviceInfo.color}-600 mr-2 w-4 h-4 flex items-center justify-center`}></i>
            성별 (단일 선택)
            {targetData.gender.includes('성별 무관') && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full font-medium">
                무관 선택됨
              </span>
            )}
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {genderOptions.map((gender) => (
              <div key={gender} className="relative group">
                <label
                  className={`flex items-center p-2 border rounded-lg transition-colors cursor-pointer ${
                    targetData.gender.includes(gender)
                      ? `border-${serviceInfo.color}-500 bg-${serviceInfo.color}-50 hover:bg-${serviceInfo.color}-100`
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    checked={targetData.gender.includes(gender)}
                    onChange={() => handleSingleSelect('gender', gender)}
                    className={`mr-3 h-4 w-4 text-${serviceInfo.color}-600 focus:ring-${serviceInfo.color}-500 border-gray-300`}
                  />
                  <span className={`text-sm ${
                    targetData.gender.includes(gender)
                      ? `text-${serviceInfo.color}-700 font-medium`
                      : 'text-gray-700'
                  }`}>
                    {gender}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* 지역 선택 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium mb-3 flex items-center">
            <i className={`ri-map-pin-line text-${serviceInfo.color}-600 mr-2 w-4 h-4 flex items-center justify-center`}></i>
            지역 (중복 선택 가능)
            {targetData.regions.includes('전국') && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full font-medium">
                전국 선택됨
              </span>
            )}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {regionOptions.map((region) => (
              <div key={region} className="relative group">
                <label
                  className={`flex items-center p-2 border rounded-lg transition-colors cursor-pointer ${
                    targetData.regions.includes(region)
                      ? `border-${serviceInfo.color}-500 bg-${serviceInfo.color}-50 hover:bg-${serviceInfo.color}-100`
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={targetData.regions.includes(region)}
                    onChange={() => handleMultiSelect('regions', region)}
                    className={`mr-3 h-4 w-4 rounded text-${serviceInfo.color}-600 focus:ring-${serviceInfo.color}-500 border-gray-300`}
                  />
                  <span className={`text-sm ${
                    targetData.regions.includes(region)
                      ? `text-${serviceInfo.color}-700 font-medium`
                      : 'text-gray-700'
                  }`}>
                    {region}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* 관심사/취향 선택 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium mb-3 flex items-center">
            <i className={`ri-heart-line text-${serviceInfo.color}-600 mr-2 w-4 h-4 flex items-center justify-center`}></i>
            관심사/취향 (중복 선택 가능)
            <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {data.serviceType} 특화
            </span>
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {interestOptions.map((interest) => (
              <div key={interest} className="relative group">
                <label
                  className={`flex items-center p-2 border rounded-lg transition-colors cursor-pointer ${
                    targetData.interests.includes(interest)
                      ? `border-${serviceInfo.color}-500 bg-${serviceInfo.color}-50 hover:bg-${serviceInfo.color}-100`
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={targetData.interests.includes(interest)}
                    onChange={() => handleMultiSelect('interests', interest)}
                    className={`mr-3 h-4 w-4 rounded text-${serviceInfo.color}-600 focus:ring-${serviceInfo.color}-500 border-gray-300`}
                  />
                  <span className={`text-sm ${
                    targetData.interests.includes(interest)
                      ? `text-${serviceInfo.color}-700 font-medium`
                      : 'text-gray-700'
                  }`}>
                    {interest}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 선택 결과 미리보기 */}
      {(getSelectedCount() > 0 || additionalNotes) && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 border rounded-lg p-4">
          <h3 className="font-semibold mb-3 text-green-800">
            ✅ 타겟 대상 설정 완료
          </h3>
          
          {getSelectedCount() > 0 && (
            <div>
              <div className="text-sm font-medium mb-2 text-green-700">
                선택된 세부 타겟 ({getSelectedCount()}개):
              </div>
              <div className="text-sm p-3 rounded border text-green-600 bg-white border-green-200">
                {getTargetSummary()}
              </div>
            </div>
          )}

          {(targetData.regions.includes('전국') || 
            targetData.gender.includes('성별 무관')) && (
            <div className="mt-3 p-3 bg-blue-100 rounded-lg">
              <div className="text-xs text-blue-700">
                <p className="font-medium mb-1">🎯 스마트 제약 적용됨:</p>
                {targetData.regions.includes('전국') && (
                  <p>• 전국으로 설정되어 지역 제한이 없습니다</p>
                )}
                {targetData.gender.includes('성별 무관') && (
                  <p>• 성별 무관으로 설정되어 모든 성별 대상으로 확장됩니다</p>
                )}
              </div>
            </div>
          )}

          <div className="mt-3 p-3 bg-blue-100 rounded-lg">
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">💡 타겟 설정 효과</p>
              <p>• 선택하신 타겟에 맞는 톤앤매너 제안</p>
              <p>• 적합한 {data.serviceType === 'video' ? '영상 스타일과 연출 방향' : 
                           data.serviceType === 'design' ? '디자인 방향성과 스타일' : 
                           data.serviceType === 'marketing' ? '마케팅 전략과 채널' : '서비스 방향'} 추천</p>
              <p>• 타겟-용도 매칭 검증으로 효과 극대화</p>
            </div>
          </div>
        </div>
      )}

      {/* 기타 추가 입력사항 */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-medium text-orange-800 mb-3">
          <i className="ri-edit-line mr-2 w-4 h-4 flex items-center justify-center"></i>
          기타 추가 입력사항
        </h3>
        <textarea
          value={additionalNotes}
          onChange={handleAdditionalNotesChange}
          placeholder="예: 입력한 내용과 다른 타겟을 선택한 이유 / 특별히 고려해야 할 타겟 특성 / 선택 옵션에 없는 특수한 타겟 그룹 / 복합적인 타겟 상황에 대한 설명 / 해외 진출 계획이나 국제화 요구사항 등"
          className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-white"
          rows={4}
        />
        <p className="text-xs text-orange-700 mt-2">
          💡 1단계에서 입력하신 내용과 다른 선택을 하신 경우나 특별한 상황이 있으시면 자세히 설명해주세요!
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
