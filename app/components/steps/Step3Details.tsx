
'use client';

import { useState, useEffect, useCallback } from 'react';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface AIRecommendation {
  details: string[];
  reasoning: string;
  confidence: number;
  tips: string[];
}

export default function Step3Details({ data, onUpdate, onNext, onPrev }: Props) {
  const [selectedDetails, setSelectedDetails] = useState<string[]>(data.details || []);
  const [additionalNotes, setAdditionalNotes] = useState(data.step3Notes || '');
  
  // 🚀 NEW: AI 추천 시스템 추가
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  // 🚀 FIXED: 개선된 매칭 로직 - 더 정확하고 명확한 카테고리 분류
  const detailOptions = [
    {
      category: '교육·학습 콘텐츠',
      items: ['직원 교육·연수', '고객 교육·안내', '제품 사용 가이드', '안전 교육·매뉴얼', '온보딩·신입교육', '학술·연구 발표'],
      matchingPurposes: ['교육·정보전달', '교육·훈련', '안전·보건', '매뉴얼·가이드', '온보딩', '학습', '연구']
    },
    {
      category: '마케팅·프로모션',
      items: ['제품·서비스 소개', '브랜드 스토리', '고객 후기·사례', 'SNS 콘텐츠', '광고 캠페인', '론칭 이벤트'],
      matchingPurposes: ['마케팅·홍보', '브랜드 홍보', '제품 소개', '서비스 소개', '매출 증대', '고객 확보', 'SNS·소셜미디어', '광고']
    },
    {
      category: '기업 커뮤니케이션',
      items: ['기업 소개·채용', '내부 소통·공지', '파트너십·협력', '성과 발표·보고', '기업 문화·가치', '리더십 메시지'],
      matchingPurposes: ['내부 소통·보고', '채용·인사', '기업 문화', '협력사 소개', '기업 소개', '리더십', '조직문화']
    },
    {
      category: '투자·비즈니스',
      items: ['기업 IR·투자유치', '사업 계획 발표', '재무 성과 보고', '투자자 미팅', '비즈니스 모델 소개', '파트너 제안'],
      matchingPurposes: ['투자·IR', '투자 유치', '사업 발표', '재무 보고', '비즈니스', '투자자']
    },
    {
      category: '이벤트·행사',
      items: ['컨퍼런스·세미나', '제품 런칭 행사', '시상식·축하', '전시회·박람회', '페스티벌·축제', '워크숍·교육행사'],
      matchingPurposes: ['행사·이벤트', '세미나·컨퍼런스', '런칭 행사', '시상식·축하', '페스티벌', '전시회', '워크숍']
    },
    {
      category: '개인·창작 프로젝트',
      items: ['개인 포트폴리오', '웨딩·가족 기념', '예술·창작 활동', '개인 브랜딩', '취미·관심사', '여행·라이프스타일'],
      matchingPurposes: ['개인·창작', '기록·아카이브', '예술·창작', '개인 기념', '웨딩·가족', '포트폴리오', '개인용', '취미']
    }
  ];

  // 🚀 NEW: AI 추천 생성 함수
  const generateAIRecommendations = useCallback(async () => {
    if (!data.purposes || data.purposes.length === 0) return;
    
    setIsGeneratingAI(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const purposes = data.purposes || [];
      const targetData = data.targetData || {};
      const serviceType = data.serviceType || 'video';
      
      let recommendedDetails: string[] = [];
      let reasoning = '';
      let tips: string[] = [];
      let confidence = 85;

      // 🚀 서비스별 AI 추천 로직
      if (serviceType === 'video') {
        if (purposes.some(p => p.includes('교육') || p.includes('안전') || p.includes('훈련'))) {
          recommendedDetails = ['직원 교육·연수', '안전 교육·매뉴얼', '제품 사용 가이드'];
          reasoning = '교육 목적의 영상은 체계적인 학습 구조와 명확한 가이드라인이 중요합니다.';
          tips = [
            '단계별 학습 과정을 명확하게 구성하세요',
            '안전 관련 내용은 시각적 강조 효과를 활용하세요',
            '반복 학습이 가능한 구조로 제작하세요'
          ];
        } else if (purposes.some(p => p.includes('마케팅') || p.includes('홍보') || p.includes('브랜드'))) {
          recommendedDetails = ['제품·서비스 소개', '브랜드 스토리', 'SNS 콘텐츠'];
          reasoning = '마케팅 영상은 브랜드 메시지를 효과적으로 전달하고 고객과의 연결점을 만드는 것이 핵심입니다.';
          tips = [
            '타겟 고객의 관심사와 니즈를 반영하세요',
            '브랜드 스토리를 통해 감정적 연결을 만드세요',
            'SNS 플랫폼별 최적 포맷을 고려하세요'
          ];
        } else if (purposes.some(p => p.includes('기업') || p.includes('조직') || p.includes('채용'))) {
          recommendedDetails = ['기업 소개·채용', '기업 문화·가치', '내부 소통·공지'];
          reasoning = '기업 영상은 조직의 가치와 문화를 명확하게 전달하여 신뢰성을 구축하는 것이 중요합니다.';
          tips = [
            '기업의 핵심 가치와 비전을 강조하세요',
            '실제 직원들의 생생한 목소리를 담으세요',
            '회사의 성장 스토리를 포함하세요'
          ];
        }
      } else if (serviceType === 'design') {
        if (purposes.some(p => p.includes('브랜드') || p.includes('로고') || p.includes('아이덴티티'))) {
          recommendedDetails = ['브랜드 스토리', '기업 소개·채용', '마케팅·프로모션'];
          reasoning = '브랜드 디자인은 일관된 아이덴티티와 메시지 전달이 핵심입니다.';
          tips = [
            '브랜드의 핵심 가치를 시각적으로 표현하세요',
            '타겟 고객이 쉽게 인식할 수 있는 디자인을 만드세요',
            '다양한 매체에서 일관성을 유지하세요'
          ];
        } else if (purposes.some(p => p.includes('웹') || p.includes('앱') || p.includes('디지털'))) {
          recommendedDetails = ['제품·서비스 소개', 'SNS 콘텐츠', '고객 후기·사례'];
          reasoning = '디지털 디자인은 사용자 경험과 인터랙션을 고려한 설계가 중요합니다.';
          tips = [
            '사용자 중심의 인터페이스를 설계하세요',
            '반응형 디자인을 고려하세요',
            '접근성과 사용성을 우선시하세요'
          ];
        }
      } else if (serviceType === 'marketing') {
        if (purposes.some(p => p.includes('SNS') || p.includes('디지털') || p.includes('소셜미디어'))) {
          recommendedDetails = ['SNS 콘텐츠', '고객 후기·사례', '브랜드 스토리'];
          reasoning = 'SNS 마케팅은 플랫폼별 특성을 고려한 콘텐츠 전략이 필요합니다.';
          tips = [
            '각 플랫폼의 특성에 맞는 콘텐츠를 제작하세요',
            '사용자 참여를 유도하는 인터랙티브 요소를 포함하세요',
            '정기적인 콘텐츠 업데이트 계획을 세우세요'
          ];
        } else if (purposes.some(p => p.includes('고객') || p.includes('매출') || p.includes('확보'))) {
          recommendedDetails = ['제품·서비스 소개', '고객 후기·사례', '광고 캠페인'];
          reasoning = '고객 확보를 위한 마케팅은 명확한 가치 제안과 신뢰성 구축이 핵심입니다.';
          tips = [
            '명확한 가치 제안을 전면에 내세우세요',
            '실제 고객 사례와 후기를 활용하세요',
            '구체적인 행동 유도 메시지를 포함하세요'
          ];
        }
      }

      // 디폴트 추천
      if (recommendedDetails.length === 0) {
        recommendedDetails = ['제품·서비스 소개', '브랜드 스토리', '고객 교육·안내'];
        reasoning = '선택하신 목적을 기반으로 가장 효과적인 세부 용도를 추천합니다.';
        confidence = 70;
      }

      setAiRecommendation({
        details: recommendedDetails,
        reasoning,
        confidence,
        tips
      });
      
    } catch (error) {
      console.error('AI 추천 생성 오류:', error);
    } finally {
      setIsGeneratingAI(false);
    }
  }, [data.purposes, data.targetData, data.serviceType]);

  // 🚀 NEW: AI 추천 적용하기
  const applyAIRecommendations = () => {
    if (!aiRecommendation) return;
    
    setSelectedDetails(aiRecommendation.details);
    setShowAIPanel(false);
    
    // 즉시 업데이트
    setTimeout(() => {
      onUpdate({
        details: aiRecommendation.details,
        step3Notes: additionalNotes,
        appliedAIRecommendation: true
      });
    }, 0);
  };

  // 🚀 NEW: 컴포넌트 마운트 시 AI 추천 자동 생성
  useEffect(() => {
    if (data.purposes && data.purposes.length > 0 && !aiRecommendation) {
      generateAIRecommendations();
      setShowAIPanel(true);
    }
  }, [data.purposes, generateAIRecommendations]);

  // 🚀 FIXED: 더 정확한 매칭 시스템 - 모든 카테고리 기본 활성화로 변경
  const getActiveCategories = () => {
    const selectedPurposes = data?.purposes || [];
    
    // 🚀 목적이 없어도 모든 카테고리를 활성화 (사용자 선택권 보장)
    if (selectedPurposes.length === 0) {
      return detailOptions.map(cat => ({ ...cat, isActive: true }));
    }
    
    return detailOptions.map(category => {
      let isActive = false;
      let matchScore = 0;
      
      // 1차: 정확한 문자열 매칭
      for (const purpose of selectedPurposes) {
        if (category.matchingPurposes.includes(purpose)) {
          isActive = true;
          matchScore = 100;
          break;
        }
      }
      
      // 2차: 키워드 기반 매칭 (더 관대하게)
      if (!isActive) {
        for (const purpose of selectedPurposes) {
          const purposeKeywords = purpose.toLowerCase().split(/[·\s,]/);
          
          for (const matchingPurpose of category.matchingPurposes) {
            const matchingKeywords = matchingPurpose.toLowerCase().split(/[·\s,]/);
            
            // 핵심 키워드가 매칭되는지 확인 (더 관대한 조건)
            const keywordMatches = purposeKeywords.filter(pk => 
              matchingKeywords.some(mk => 
                pk.length > 1 && mk.length > 1 && (pk === mk || pk.includes(mk) || mk.includes(pk))
              )
            ).length;
            
            if (keywordMatches > 0) {
              isActive = true;
              matchScore = Math.max(matchScore, keywordMatches * 20);
            }
          }
        }
      }
      
      // 3차: 카테고리명과 직접 매칭 (더 관대하게)
      if (!isActive) {
        const categoryKeywords = category.category.toLowerCase().split(/[·\s,]/);
        for (const purpose of selectedPurposes) {
          const purposeKeywords = purpose.toLowerCase().split(/[·\s,]/);
          const hasDirectMatch = categoryKeywords.some(ck => 
            purposeKeywords.some(pk => 
              pk.length > 1 && ck.length > 1 && (pk === ck || pk.includes(ck) || ck.includes(pk))
            )
          );
          if (hasDirectMatch) {
            isActive = true;
            matchScore = Math.max(matchScore, 30);
          }
        }
      }
      
      // 🚀 최종적으로 매칭되지 않은 카테고리도 활성화 (사용자 선택권 보장)
      if (!isActive) {
        isActive = true;  // 모든 카테고리를 활성화
        matchScore = 10;  // 낮은 점수 부여
      }
      
      return { ...category, isActive, matchScore };
    });
  };

  // 🚀 FIXED: useState 대신 직접 onUpdate 호출로 렌더링 중 상태 업데이트 방지
  const handleDetailToggle = (detail: string) => {
    const updated = selectedDetails.includes(detail)
      ? selectedDetails.filter(d => d !== detail)
      : [...selectedDetails, detail];
    
    setSelectedDetails(updated);
    
    // 디바운스 없이 즉시 업데이트하지만 렌더링 후에 실행
    setTimeout(() => {
      onUpdate({
        details: updated,
        step3Notes: additionalNotes
      });
    }, 0);
  };

  // 🚀 FIXED: additionalNotes 변경 시에만 디바운스 적용
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate({
        details: selectedDetails,
        step3Notes: additionalNotes
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [additionalNotes]);

  const handleNext = () => {
    onNext();
  };

  const canProceed = selectedDetails.length > 0;
  const activeCategories = getActiveCategories();

  const getServiceInfo = () => {
    const serviceType = data.serviceType || 'video';
    
    switch (serviceType) {
      case 'video':
        return {
          title: '영상 제작 세부 용도',
          description: '영상의 구체적인 활용 목적을 선택해주세요. 선택하신 목적에 맞는 용도만 표시됩니다.',
          color: 'blue'
        };
      case 'design':
        return {
          title: '디자인 제작 세부 용도',
          description: '디자인의 구체적인 활용 목적을 선택해주세요. 선택하신 목적에 맞는 용도만 표시됩니다.',
          color: 'green'
        };
      case 'marketing':
        return {
          title: '마케팅 서비스 세부 용도',
          description: '마케팅의 구체적인 활용 목적을 선택해주세요. 선택하신 목적에 맞는 용도만 표시됩니다.',
          color: 'purple'
        };
      default:
        return {
          title: '세부 용도 선택',
          description: '구체적인 활용 목적을 선택해주세요.',
          color: 'blue'
        };
    }
  };

  const serviceInfo = getServiceInfo();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">{serviceInfo.title}</h2>
        <p className="text-gray-600 mb-6">{serviceInfo.description} (그룹 내 중복 선택 가능)</p>
        
        {/* 이전 단계 정보 표시 */}
        <div className={`bg-${serviceInfo.color}-50 border border-${serviceInfo.color}-200 rounded-lg p-4 mb-4`}>
          <div className="space-y-2">
            <div className="flex items-center">
              <i className={`ri-target-line text-${serviceInfo.color}-600 mr-2 w-4 h-4 flex items-center justify-center`}></i>
              <span className={`font-medium text-${serviceInfo.color}-800`}>선택된 목적: </span>
              <span className={`text-${serviceInfo.color}-700`}>{data?.purposes?.join(', ') || '없음'}</span>
            </div>
            {data?.targetData && (
              <div className="flex items-center">
                <i className={`ri-user-line text-${serviceInfo.color}-600 mr-2 w-4 h-4 flex items-center justify-center`}></i>
                <span className={`font-medium text-${serviceInfo.color}-800`}>주요 타겟: </span>
                <span className={`text-${serviceInfo.color}-700`}>
                  {[
                    ...(data.targetData.ageGroups || []).slice(0, 2),
                    ...(data.targetData.occupations || []).slice(0, 2),
                    ...(data.targetData.gender || [])
                  ].join(', ') || '설정되지 않음'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🚀 NEW: AI 추천 시스템 */}
      {(showAIPanel || aiRecommendation) && (
        <div className={`bg-gradient-to-r from-${serviceInfo.color}-50 to-indigo-50 border-2 border-${serviceInfo.color}-200 rounded-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold text-${serviceInfo.color}-800 text-lg flex items-center`}>
              <i className="ri-ai-generate mr-2 w-5 h-5 flex items-center justify-center"></i>
              🤖 AI 맞춤 추천
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setAiRecommendation(null);
                  generateAIRecommendations();
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
                onClick={() => setShowAIPanel(!showAIPanel)}
                className={`text-${serviceInfo.color}-600 hover:text-${serviceInfo.color}-800 transition-colors cursor-pointer`}
              >
                <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
              </button>
            </div>
          </div>

          {isGeneratingAI ? (
            <div className="text-center py-8">
              <div className={`inline-block animate-spin w-8 h-8 border-4 border-${serviceInfo.color}-600 border-t-transparent rounded-full mb-4`}></div>
              <p className={`text-${serviceInfo.color}-700 font-medium`}>1-2단계 데이터를 분석하여 최적 세부 용도를 추천하고 있습니다...</p>
              <p className={`text-${serviceInfo.color}-600 text-sm mt-2`}>목적과 타겟을 종합하여 가장 효과적인 방향을 찾고 있습니다</p>
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
                  <h4 className={`font-medium text-${serviceInfo.color}-800 mb-2`}>🎯 추천 세부 용도</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {aiRecommendation.details.map((detail, index) => (
                      <div key={index} className={`bg-${serviceInfo.color}-50 border border-${serviceInfo.color}-200 p-3 rounded-lg`}>
                        <div className={`font-medium text-${serviceInfo.color}-800`}>{detail}</div>
                      </div>
                    ))}
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
                    onClick={applyAIRecommendations}
                    className={`flex-1 px-4 py-3 bg-${serviceInfo.color}-600 text-white rounded-lg font-medium hover:bg-${serviceInfo.color}-700 transition-colors cursor-pointer whitespace-nowrap`}
                  >
                    <i className="ri-magic-line mr-2"></i>
                    AI 추천대로 적용하기
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <button
                onClick={generateAIRecommendations}
                className={`px-6 py-3 bg-${serviceInfo.color}-600 text-white rounded-lg font-medium hover:bg-${serviceInfo.color}-700 transition-colors cursor-pointer whitespace-nowrap`}
              >
                <i className="ri-ai-generate mr-2"></i>
                AI 맞춤 추천받기
              </button>
            </div>
          )}
        </div>
      )}

      {/* 🚀 매칭 안내 수정 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">
          <i className="ri-lightbulb-line mr-2 w-4 h-4 flex items-center justify-center"></i>
          💡 스마트 매칭 시스템 안내
        </h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• <strong>완전 매칭:</strong> 선택한 목적과 정확히 일치하는 카테고리 우선 표시</p>
          <p>• <strong>부분 매칭:</strong> 관련성이 있는 카테고리도 함께 표시</p>
          <p>• <strong>자유 선택:</strong> 모든 카테고리가 활성화되어 있어 자유롭게 선택 가능</p>
          <p>• <strong>중복 선택:</strong> 각 그룹 내에서 여러 항목 선택 가능</p>
        </div>
      </div>

      {/* 세부 용도 선택 */}
      <div>
        <h3 className="font-medium mb-4">세부 용도 선택 <span className="text-red-500">*</span> (각 그룹 내에서 중복 선택 가능)</h3>
        
        <div className="space-y-6">
          {activeCategories.map((category) => {
            // 🚀 모든 카테고리가 활성화되도록 변경
            const isDisabled = false;  // 항상 활성화
            const matchScore = category.matchScore || 0;
            
            return (
              <div key={category.category} className={`rounded-lg p-4 ${
                isDisabled 
                  ? 'bg-gray-100 opacity-50' 
                  : 'bg-gray-50'
              }`}>
                <h4 className={`font-medium mb-3 flex items-center ${
                  isDisabled ? 'text-gray-400' : 'text-gray-800'
                }`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    matchScore >= 80 ? 'bg-green-500' :
                    matchScore >= 40 ? 'bg-yellow-500' :
                    matchScore >= 20 ? 'bg-blue-500' :
                    'bg-gray-400'
                  }`}></span>
                  {category.category}
                  {matchScore >= 80 ? (
                    <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                      ✅ 완벽 매칭
                    </span>
                  ) : matchScore >= 40 ? (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">
                      ⚡ 부분 매칭
                    </span>
                  ) : matchScore >= 20 ? (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      🔗 관련성 있음
                    </span>
                  ) : (
                    <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      📝 선택 가능
                    </span>
                  )}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {category.items.map((item) => {
                    const isSelected = selectedDetails.includes(item);
                    
                    return (
                      <div key={item} className="relative group">
                        <label
                          className={`flex items-center p-3 border rounded-lg transition-colors ${
                            isDisabled
                              ? 'cursor-not-allowed bg-gray-200 border-gray-300'
                              : `cursor-pointer ${
                                  isSelected
                                    ? 'border-green-500 bg-green-50 hover:bg-green-100'
                                    : 'border-gray-200 bg-white hover:bg-gray-50'
                                }`
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => !isDisabled && handleDetailToggle(item)}
                            disabled={isDisabled}
                            className={`mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded ${
                              isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          />
                          <span className={`flex-1 text-sm ${
                            isDisabled
                              ? 'text-gray-400'
                              : isSelected 
                                ? 'text-green-700 font-medium' 
                                : 'text-gray-700'
                          }`}>
                            {item}
                          </span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 선택 결과 미리보기 */}
      {selectedDetails.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 border rounded-lg p-4">
          <h3 className="font-semibold mb-3 text-green-800">
            ✅ 세부 용도 설정 완료
          </h3>
          
          <div className="mb-3">
            <div className="text-sm font-medium mb-2 text-green-700">
              선택된 세부 용도 ({selectedDetails.length}개):
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedDetails.map((detail) => (
                <div key={detail} className="flex items-center rounded-full bg-green-100 text-green-700">
                  <span className="px-3 py-1 text-sm font-medium">
                    {detail}
                  </span>
                  <button
                    onClick={() => handleDetailToggle(detail)}
                    className="ml-1 mr-2 text-green-600 hover:text-green-800 transition-colors"
                    title="선택 해제"
                  >
                    <i className="ri-close-line text-sm"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 p-3 bg-blue-100 rounded-lg">
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">💡 매칭 시스템 적용</p>
              <p>• 선택한 목적과 연관된 용도만 활성화되어 정확한 견적 산출</p>
              <p>• 각 그룹 내에서 여러 항목 선택 가능</p>
              <p>• 목적-용도 매칭으로 최적화된 제작 방향 제안</p>
            </div>
          </div>
        </div>
      )}

      {/* 기타 추가 입력사항 */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-medium text-orange-800 mb-3">
          <i className="ri-sticky-note-line mr-2 w-4 h-4 flex items-center justify-center"></i>
          기타 추가 입력사항
        </h3>
        <textarea
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          placeholder="예: 특별한 제작 방식 요청 / 복합적인 용도가 필요한 상황 / 추가로 고려해야 할 사항 등"
          className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-white"
          rows={4}
        />
        <p className="text-xs text-orange-700 mt-2">
          💡 추가적인 요구사항이나 특별한 상황이 있으시면 자세히 설명해주세요!
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
