
'use client';

import { useState, useEffect } from 'react';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step7VideoEstimate({ data, onUpdate, onNext, onPrev }: Props) {
  const [finalResults, setFinalResults] = useState<any>(null);
  const [showEstimate, setShowEstimate] = useState(true);

  useEffect(() => {
    calculateFinalEstimate();
  }, [data]);

  const calculateFinalEstimate = () => {
    const purposes = data.purposes || [];
    const details = data.details || [];
    const scale = data.scale || {};
    const elements = data.elements || {};
    const targetData = data.targetData || {};
    const selectedReferences = data.selectedReferences || [];
    const toneKeywords = data.toneKeywords || [];

    // 기본 비용 계산
    let totalCost = 0;
    const selectedOptions: Array<{
      name: string;
      category: string;
      description: string;
      cost: number;
      details: string;
    }> = [];

    // 영상 요소별 비용 계산
    Object.entries(elements).forEach(([elementName, config]: [string, any]) => {
      if (config.enabled && config.selectedOption !== undefined) {
        const elementPrices: { [key: string]: { base: number; options: string[]; descriptions: string[] } } = {
          '기획·컨셉': { 
            base: 500000, 
            options: ['기본 기획', '전문 기획', '고급 기획', '프리미엄 기획'],
            descriptions: ['📝 기본 기획서, 3-5일', '📝 전문 기획서, 5-7일', '📝 고급 기획서, 7-10일', '📝 프리미엄 기획서, 10-14일']
          },
          '스토리보드·콘티': { 
            base: 300000, 
            options: ['기본 콘티', '전문 콘티', '고급 콘티', '프리미엄 콘티'],
            descriptions: ['📝 영상 기획자, 주 단위', '📝 영상 기획자, 주 단위', '📝 영상 기획자, 주 단위', '📝 영상 기획자, 주 단위']
          },
          '출연진': { 
            base: 800000, 
            options: ['기본 출연진', '전문 출연진', '고급 출연진', '프리미엄 출연진'],
            descriptions: ['📝 일반 출연진, 일 단위', '📝 전문 출연진, 일 단위', '📝 고급 출연진, 일 단위', '📝 프리미엄 출연진, 일 단위']
          },
          '촬영 장소': { 
            base: 500000, 
            options: ['기본 장소', '전문 장소', '고급 장소', '프리미엄 장소'],
            descriptions: ['📝 기본 스튜디오, 일 단위', '📝 전문 스튜디오, 일 단위', '📝 고급 스튜디오, 일 단위', '📝 프리미엄 스튜디오, 일 단위']
          },
          '촬영 장비': { 
            base: 800000, 
            options: ['기본 장비', '전문 장비', '고급 장비', '프리미엄 장비'],
            descriptions: ['📝 기본 카메라, 일 단위', '📝 전문 카메라, 일 단위', '📝 고급 카메라, 일 단위', '📝 프리미엄 카메라, 일 단위']
          },
          '편집 복잡도': { 
            base: 800000, 
            options: ['기본 편집', '전문 편집', '고급 편집', '프리미엄 편집'],
            descriptions: ['📝 영상 편집자, 주 단위', '📝 영상 편집자, 주 단위', '📝 영상 편집자, 주 단위', '📝 영상 편집자, 주 단위']
          }
        };

        if (elementPrices[elementName]) {
          const elementInfo = elementPrices[elementName];
          const optionMultipliers = [1.0, 1.5, 2.5, 4.0];
          const cost = elementInfo.base * (optionMultipliers[config.selectedOption] || 1.0);
          
          selectedOptions.push({
            name: elementName,
            category: elementInfo.options[config.selectedOption] || '기본형',
            description: elementInfo.descriptions[config.selectedOption] || '기본 서비스',
            cost: cost,
            details: getElementDetails(elementName, config.selectedOption)
          });
          
          totalCost += cost;
        }
      }
    });

    // 인력비, 도구비, 기타비 분해
    const laborCost = Math.round(totalCost * 0.65); // 65%
    const toolCost = Math.round(totalCost * 0.25);  // 25%  
    const otherCost = Math.round(totalCost * 0.10);  // 10%

    // 부가세 계산
    const vat = Math.round(totalCost * 0.1);
    const finalTotal = totalCost + vat;

    const results = {
      serviceType: '영상 서비스',
      totalCost: totalCost,
      vat: vat,
      finalTotal: finalTotal,
      selectedOptions: selectedOptions,
      breakdown: {
        labor: laborCost,
        tools: toolCost,
        other: otherCost
      },
      projectDetails: {
        step1: { purposes, note: data.step1Notes || '' },
        step2: { targetData, note: data.step2Notes || '' },
        step3: { details, note: data.step3Notes || '' },
        step4: { scale, note: data.step4Notes || '' },
        step5: { elements, note: data.step5Notes || '' },
        step6: { selectedReferences, toneKeywords, note: data.step6Notes || '' }
      }
    };

    setFinalResults(results);
    onUpdate({ finalResults: results });
  };

  const getElementDetails = (elementName: string, optionIndex: number) => {
    const detailsMap: { [key: string]: string[] } = {
      '기획·컨셉': [
        '기본 영상 기획안, 간단한 컨셉 정리, 촬영 개요',
        '전문 기획서, 상세 컨셉 개발, 타겟 분석, 스케줄링',
        '고급 기획서, 다각도 컨셉 제안, 시장 분석, 세부 스케줄',
        '최고급 기획 컨설팅, 경쟁 분석 포함, 완전한 제작 매뉴얼'
      ],
      '스토리보드·콘티': [
        '기본 스토리보드 10컷, 간단한 연출 노트',
        '상세 스토리보드 20컷, 카메라 앵글 표시, 상세 연출 계획',
        '고급 스토리보드 30컷, 완전한 연출 계획, 편집 가이드',
        '프리미엄 프리비즈, 3D 스토리보드, 완벽한 제작 가이드'
      ]
    };

    return detailsMap[elementName]?.[optionIndex] || '상세 작업 내용이 포함됩니다';
  };

  if (!finalResults) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-blue-700 font-medium">견적을 계산하고 있습니다...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showEstimate && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 border-2 border-blue-300 rounded-lg p-6">
          {/* 헤더 */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">📋 최종 견적서</h2>
            <p className="text-blue-600">영상 서비스 프로젝트 상세 견적</p>
          </div>

          {/* 프로젝트 개요 & 타겟 분석 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                <i className="ri-file-text-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                프로젝트 개요
              </h3>
              <div className="space-y-2 text-sm">
                <div><strong>서비스:</strong> 영상 서비스</div>
                <div><strong>목적:</strong> {finalResults.projectDetails.step1.purposes.join(', ')}</div>
                <div><strong>세부용도:</strong> {finalResults.projectDetails.step3.details.join(', ')}</div>
                <div><strong>설명:</strong> {finalResults.projectDetails.step3.note}</div>
                <div><strong>1단계 특이사항:</strong> {finalResults.projectDetails.step1.note}</div>
              </div>
            </div>
            
            <div className="bg-white border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                <i className="ri-user-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                타겟 분석
              </h3>
              <div className="space-y-2 text-sm">
                <div><strong>성별:</strong> {finalResults.projectDetails.step2.targetData.gender?.join(', ') || '전체'}</div>
                <div><strong>2단계 특이사항:</strong> {finalResults.projectDetails.step2.note}</div>
              </div>
            </div>
          </div>

          {/* 세부 용도 및 규모 */}
          <div className="bg-white border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
              <i className="ri-list-check mr-2 w-4 h-4 flex items-center justify-center"></i>
              세부 용도 및 규모
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>세부 용도:</strong>
                <div className="mt-1">{finalResults.projectDetails.step3.details.join(', ')}</div>
                <div className="mt-2"><strong>3단계 특이사항:</strong> {finalResults.projectDetails.step3.note}</div>
              </div>
              <div>
                <strong>프로젝트 규모:</strong>
                <div className="mt-1">{finalResults.projectDetails.step4.scale.type || '미지정'}</div>
                <div className="mt-2"><strong>4단계 특이사항:</strong> {finalResults.projectDetails.step4.note}</div>
              </div>
            </div>
          </div>

          {/* 레퍼런스 가이드 */}
          <div className="bg-white border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
              <i className="ri-image-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              레퍼런스 가이드
            </h3>
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">선택된 레퍼런스 (3개):</div>
              <div className="space-y-2">
                <div className="flex items-start space-x-3 p-2 bg-blue-50 rounded">
                  <div className="w-8 h-8 bg-blue-200 rounded flex items-center justify-center flex-shrink-0">
                    <i className="ri-image-line text-blue-600 text-sm"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-blue-900 truncate">브랜드 영상 레퍼런스 #1</div>
                    <div className="text-xs text-blue-600 truncate">https://vimeo.com/showcase/brand-video-1</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="px-1 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">영화같은</span>
                      <span className="px-1 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">프리미엄</span>
                      <span className="px-1 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">감성적</span>
                    </div>
                    <div className="text-xs text-blue-600 mt-1">매칭도 94% - 선택하신 영상 목적에 가장 효과적인 스타일입니다.</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-2 bg-blue-50 rounded">
                  <div className="w-8 h-8 bg-blue-200 rounded flex items-center justify-center flex-shrink-0">
                    <i className="ri-image-line text-blue-600 text-sm"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-blue-900 truncate">추천 제품 영상 레퍼런스 #2</div>
                    <div className="text-xs text-blue-600 truncate">https://youtube.com/watch?v=example2</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="px-1 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">다이나믹</span>
                      <span className="px-1 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">현대적</span>
                      <span className="px-1 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">임팩트</span>
                    </div>
                    <div className="text-xs text-blue-600 mt-1">매칭도 89% - 선택하신 타겟층에게 강한 임팩트를 줄 수 있는 영상 스타일입니다.</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-2 bg-blue-50 rounded">
                  <div className="w-8 h-8 bg-blue-200 rounded flex items-center justify-center flex-shrink-0">
                    <i className="ri-image-line text-blue-600 text-sm"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-blue-900 truncate">업계 트렌드 영상 레퍼런스 #3</div>
                    <div className="text-xs text-blue-600 truncate">https://example-video-trends.com/example3</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="px-1 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">트렌디</span>
                      <span className="px-1 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">스타일리시</span>
                      <span className="px-1 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">혁신적</span>
                    </div>
                    <div className="text-xs text-blue-600 mt-1">매칭도 86% - 최신 영상 트렌드를 반영한 혁신적인 접근법입니다.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">톤앤매너 키워드:</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">영화같은</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">다이나믹한</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">감성적인</span>
              </div>
            </div>
            <div className="text-sm"><strong>5단계 특이사항:</strong> {finalResults.projectDetails.step6.note}</div>
          </div>

          {/* 선택된 옵션 상세 */}
          <div className="bg-white border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-4 flex items-center">
              <i className="ri-settings-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              선택된 옵션 상세
            </h3>
            <div className="space-y-3">
              {finalResults.selectedOptions.map((option: any, index: number) => (
                <div key={index} className="border border-blue-100 rounded-lg p-4 bg-blue-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="font-bold text-blue-900 text-lg">{option.name}</div>
                      <div className="text-blue-700 font-medium">{option.category}</div>
                      <div className="text-sm text-blue-600 mt-1">{option.description}</div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="font-bold text-blue-800 text-xl">{option.cost.toLocaleString()}원</div>
                    </div>
                  </div>
                  <div className="bg-white border border-blue-200 rounded p-3 mt-3">
                    <div className="text-sm font-medium text-blue-800 mb-1">📋 상세 작업 내용:</div>
                    <div className="text-sm text-blue-700 leading-relaxed">{option.details}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 세부 비용 분해표 */}
          <div className="bg-white border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-4 flex items-center">
              <i className="ri-file-list-3-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              세부 비용 분해표
            </h3>
            
            {/* 인력비 */}
            <div className="mb-6">
              <h4 className="font-medium text-blue-700 mb-3 pb-2 border-b border-blue-200">💼 인력비</h4>
              <div className="space-y-2">
                {finalResults.selectedOptions.map((option: any, index: number) => (
                  <div key={index} className="grid grid-cols-5 gap-4 text-sm py-2 border-b border-gray-100">
                    <div className="font-medium">{option.name}</div>
                    <div className="text-center">{option.category}</div>
                    <div className="text-center">1명</div>
                    <div className="text-center">일/주 단위</div>
                    <div className="text-right font-bold">{Math.round(option.cost * 0.65).toLocaleString()}원</div>
                  </div>
                ))}
                <div className="grid grid-cols-5 gap-4 text-sm py-2 border-t-2 border-blue-200 bg-blue-50 font-bold">
                  <div className="col-span-4">인력비 소계</div>
                  <div className="text-right">{finalResults.breakdown.labor.toLocaleString()}원</div>
                </div>
              </div>
            </div>

            {/* 도구비 */}
            <div className="mb-6">
              <h4 className="font-medium text-blue-700 mb-3 pb-2 border-b border-blue-200">🛠️ 도구비 (장비 & 소프트웨어)</h4>
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-4 text-sm py-2 border-b border-gray-100">
                  <div className="font-medium">촬영 장비</div>
                  <div className="text-center">카메라, 조명, 음향</div>
                  <div className="text-center">1세트</div>
                  <div className="text-right font-bold">{Math.round(finalResults.breakdown.tools * 0.7).toLocaleString()}원</div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm py-2 border-b border-gray-100">
                  <div className="font-medium">편집 소프트웨어</div>
                  <div className="text-center">전문 편집 툴</div>
                  <div className="text-center">1개</div>
                  <div className="text-right font-bold">{Math.round(finalResults.breakdown.tools * 0.3).toLocaleString()}원</div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm py-2 border-t-2 border-blue-200 bg-blue-50 font-bold">
                  <div className="col-span-3">도구비 소계</div>
                  <div className="text-right">{finalResults.breakdown.tools.toLocaleString()}원</div>
                </div>
              </div>
            </div>

            {/* 기타비 */}
            <div className="mb-6">
              <h4 className="font-medium text-blue-700 mb-3 pb-2 border-b border-blue-200">📋 기타비</h4>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-gray-100">
                  <div className="font-medium">음악, 효과음 라이선스</div>
                  <div className="text-center">저작권료</div>
                  <div className="text-right font-bold">{finalResults.breakdown.other.toLocaleString()}원</div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm py-2 border-t-2 border-blue-200 bg-blue-50 font-bold">
                  <div className="col-span-2">기타비 소계</div>
                  <div className="text-right">{finalResults.breakdown.other.toLocaleString()}원</div>
                </div>
              </div>
            </div>

            {/* 총계 */}
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-lg font-bold">
                <div>소계</div>
                <div className="text-right">{finalResults.totalCost.toLocaleString()}원</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-lg font-bold border-t border-blue-300 pt-2 mt-2">
                <div>부가세 (10%)</div>
                <div className="text-right">{finalResults.vat.toLocaleString()}원</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xl font-bold text-blue-800 border-t-2 border-blue-400 pt-3 mt-3">
                <div>총액</div>
                <div className="text-right">{finalResults.finalTotal.toLocaleString()}원</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-600">* 영상 업계에서 인력비는 전체 비용의 60-70%, 장비비는 20-30%, 기타비는 10-20%가 표준입니다.</div>
          </div>

          {/* AI 종합평가 */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-orange-300 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-orange-800 mb-4 flex items-center">
              <i className="ri-ai-generate mr-2 w-5 h-5 flex items-center justify-center"></i>
              🤖 AI 종합평가 (영상 업계 분석)
            </h3>
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-1">
                <i className="ri-star-fill text-2xl text-yellow-500"></i>
                <i className="ri-star-fill text-2xl text-yellow-500"></i>
                <i className="ri-star-fill text-2xl text-yellow-500"></i>
                <i className="ri-star-fill text-2xl text-yellow-500"></i>
                <i className="ri-star-line text-2xl text-gray-300"></i>
                <span className="ml-3 text-xl font-bold text-orange-700">4.2/5.0</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">👨‍🎬 개인 영상 제작자 대비</h4>
                <div className="text-sm text-orange-700">
                  <div className="flex justify-between mb-1"><span>비용 수준</span><span className="font-bold">적정</span></div>
                  <div className="text-xs text-gray-600">개인 제작자 평균: 100-250만원</div>
                </div>
              </div>
              <div className="bg-white border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">🏢 영상 제작사 대비</h4>
                <div className="text-sm text-orange-700">
                  <div className="flex justify-between mb-1"><span>비용 수준</span><span className="font-bold">표준적</span></div>
                  <div className="text-xs text-gray-600">중소 제작사 평균: 300-800만원</div>
                </div>
              </div>
              <div className="bg-white border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">🌟 대형 프로덕션 대비</h4>
                <div className="text-sm text-orange-700">
                  <div className="flex justify-between mb-1"><span>비용 수준</span><span className="font-bold">경제적</span></div>
                  <div className="text-xs text-gray-600">대형 프로덕션 평균: 1000-3000만원</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">💰 예산 적정성 분석</h4>
                <div className="space-y-2 text-sm text-orange-700">
                  <div className="flex justify-between"><span>현재 예산 수준</span><span className="font-bold">합리적 예산</span></div>
                  <div className="text-xs text-gray-600">영상 업계에서 중간 규모 수준</div>
                </div>
              </div>
              <div className="bg-white border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">📊 복잡도 분석</h4>
                <div className="space-y-2 text-sm text-orange-700">
                  <div className="flex justify-between"><span>프로젝트 복잡도</span><span className="font-bold">적절한 구성</span></div>
                  <div className="text-xs text-gray-600">선택 옵션 {finalResults.selectedOptions.length}개 - 완성도 예상 88% 수준</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">✅ 평가 근거</h4>
                <ul className="space-y-1 text-sm text-orange-700">
                  <li className="flex items-start"><span class="text-orange-500 mr-2">•</span>기획-촬영-편집 통합 구성</li>
                </ul>
              </div>
              <div className="bg-white border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">💡 개선 제안</h4>
                <p className="text-sm text-orange-700">현재 구성이 목적에 적합합니다!</p>
              </div>
            </div>

            <div className="bg-white border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-800 mb-2">🏢 예산별 추천 제작사</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="p-3 rounded-lg border-2 border-gray-200 bg-gray-50">
                  <div className="font-medium text-gray-800">개인 영상 제작자</div>
                  <div className="text-xs text-gray-600 mt-1">100-250만원</div>
                  <div className="text-xs text-green-600 mt-1">예산 적합</div>
                </div>
                <div className="p-3 rounded-lg border-2 border-green-400 bg-green-50">
                  <div className="font-medium text-gray-800">영상 제작사</div>
                  <div className="text-xs text-gray-600 mt-1">300-800만원</div>
                  <div className="text-xs text-green-600 mt-1">💡 현재 예산에 최적</div>
                </div>
                <div className="p-3 rounded-lg border-2 border-gray-200 bg-gray-50">
                  <div className="font-medium text-gray-800">대형 프로덕션</div>
                  <div className="text-xs text-gray-600 mt-1">1000-3000만원</div>
                  <div className="text-xs text-green-600 mt-1">상위 옵션</div>
                </div>
              </div>
            </div>
          </div>

          {/* 총 제작비용 */}
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-300 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-blue-800 text-lg">총 제작비용</h3>
                <p className="text-blue-600 text-sm">부가세 별도</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-800">{finalResults.totalCost.toLocaleString()}원</div>
                <div className="text-sm text-blue-600 mt-1">(부가세 포함: {finalResults.finalTotal.toLocaleString()}원)</div>
              </div>
            </div>
          </div>

          {/* 예상 제작기간 */}
          <div className="bg-white border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-4 flex items-center">
              <i className="ri-calendar-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              예상 제작기간: 20일
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="text-blue-700">1단계: 기획 및 준비</span>
                <span className="text-blue-800 font-medium">5일</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="text-blue-700">2단계: 촬영 진행</span>
                <span className="text-blue-800 font-medium">7일</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="text-blue-700">3단계: 편집 및 후반작업</span>
                <span className="text-blue-800 font-medium">6일</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="text-blue-700">4단계: 최종 검토 및 수정</span>
                <span className="text-blue-800 font-medium">2일</span>
              </div>
            </div>
          </div>

          {/* 고객 정보 */}
          <div className="bg-white border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-4 flex items-center">
              <i className="ri-user-add-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              고객 정보
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이름 *</label>
                <input 
                  required 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="성함을 입력해주세요" 
                  type="text" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">연락처 *</label>
                <input 
                  required 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="연락처를 입력해주세요" 
                  type="tel" 
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">이메일 *</label>
              <input 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="이메일을 입력해주세요" 
                type="email" 
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">기타 입력사항</label>
              <textarea 
                rows={3} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" 
                placeholder="추가로 전달하고 싶은 내용이 있으시면 입력해주세요"
              ></textarea>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
              <i className="ri-printer-line mr-2"></i>견적서 인쇄/PDF
            </button>
            <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap">
              <i className="ri-mail-send-line mr-2"></i>견적발송
            </button>
            <button className="flex-1 px-6 py-3 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors cursor-pointer whitespace-nowrap">
              <i className="ri-kakao-talk-line mr-2"></i>카톡 공유
            </button>
          </div>

          <div className="mt-4 text-center">
            <button 
              onClick={() => setShowEstimate(false)}
              className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            >
              견적서 접기
            </button>
          </div>
        </div>
      )}

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onPrev}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer"
        >
          이전으로
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
        >
          처음으로
        </button>
      </div>
    </div>
  );
}
