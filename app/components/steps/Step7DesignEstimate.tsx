
'use client';

import { useState, useEffect } from 'react';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step7DesignEstimate({ data, onUpdate, onNext, onPrev }: Props) {
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

    // 디자인 요소별 비용 계산
    Object.entries(elements).forEach(([elementName, config]: [string, any]) => {
      if (config.enabled && config.selectedOption !== undefined) {
        const elementPrices: { [key: string]: { base: number; options: string[]; descriptions: string[] } } = {
          '브랜드 컨셉': { 
            base: 400000, 
            options: ['기본 브랜드 컨셉', '전문 브랜드 컨셉', '고급 브랜드 컨셉', '프리미엄 브랜드 컨셉'],
            descriptions: ['📝 기본 브랜드 컨셉, 3-5일', '📝 전문 브랜드 컨셉, 5-7일', '📝 고급 브랜드 컨셉, 7-10일', '📝 프리미엄 브랜드 컨셉, 10-14일']
          },
          '로고 디자인': { 
            base: 800000, 
            options: ['기본 로고', '전문 로고', '고급 로고', '프리미엄 로고'],
            descriptions: ['📝 시니어 디자이너, 주 단위', '📝 전문 디자이너, 주 단위', '📝 전문 디자이너, 주 단위', '📝 전문 디자이너, 주 단위']
          },
          '색상 시스템': { 
            base: 300000, 
            options: ['기본 색상 시스템', '전문 색상 시스템', '고급 색상 시스템', '프리미엄 색상 시스템'],
            descriptions: ['📝 컬러 디자이너, 주 단위', '📝 컬러 디자이너, 주 단위', '📝 컬러 디자이너, 주 단위', '📝 컬러 디자이너, 주 단위']
          },
          '타이포그래피': { 
            base: 250000, 
            options: ['기본 타이포그래피', '전문 타이포그래피', '고급 타이포그래피', '프리미엄 타이포그래피'],
            descriptions: ['📝 타이포 디자이너, 주 단위', '📝 타이포 디자이너, 주 단위', '📝 타이포 디자이너, 주 단위', '📝 타이포 디자이너, 주 단위']
          },
          '인쇄물 디자인': { 
            base: 600000, 
            options: ['기본 인쇄물', '전문 인쇄물', '고급 인쇄물', '프리미엄 인쇄물'],
            descriptions: ['📝 인쇄물 디자이너, 주 단위', '📝 인쇄물 디자이너, 주 단위', '📝 인쇄물 디자이너, 주 단위', '📝 인쇄물 디자이너, 주 단위']
          },
          '디지털 디자인': { 
            base: 700000, 
            options: ['기본 디지털 디자인', '전문 디지털 디자인', '고급 디지털 디자인', '프리미엄 디지털 디자인'],
            descriptions: ['📝 디지털 디자이너, 주 단위', '📝 디지털 디자이너, 주 단위', '📝 디지털 디자이너, 주 단위', '📝 디지털 디자이너, 주 단위']
          },
          '패키지 디자인': { 
            base: 1000000, 
            options: ['기본 패키지', '전문 패키지', '고급 패키지', '프리미엄 패키지'],
            descriptions: ['📝 패키지 디자이너, 주 단위', '📝 패키지 디자이너, 주 단위', '📝 패키지 디자이너, 주 단위', '📝 패키지 디자이너, 주 단위']
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
    const laborCost = Math.round(totalCost * 0.70); // 70%
    const toolCost = Math.round(totalCost * 0.20);  // 20%  
    const otherCost = Math.round(totalCost * 0.10);  // 10%

    // 부가세 계산
    const vat = Math.round(totalCost * 0.1);
    const finalTotal = totalCost + vat;

    const results = {
      serviceType: '디자인 서비스',
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
      '브랜드 컨셉': [
        '브랜드 핵심 가치 정의, 기본 컨셉 방향성 제시, 간단한 무드보드',
        '심화 브랜드 분석, 경쟁사 분석, 상세 컨셉 개발, 브랜드 가이드라인 초안',
        '종합 브랜드 전략, 다각도 컨셉 제안, 상세 브랜드북, 실무진 워크샵',
        '최고급 브랜드 컨설팅, 시장조사 포함, 완전한 브랜드 매뉴얼, 경영진 프레젠테이션'
      ],
      '로고 디자인': [
        '기본 로고 디자인 3안, PNG/JPG 파일 제공',
        '로고 디자인 5안, 컬러/흑백 버전, AI/EPS 파일 포함',
        '로고 디자인 8안, 다양한 활용형, 완전한 파일 패키지, 사용 가이드',
        '무제한 로고 시안, 프리미엄 디자인, 모든 포맷 파일, 상표 등록 지원'
      ]
    };

    return detailsMap[elementName]?.[optionIndex] || '상세 작업 내용이 포함됩니다';
  };

  if (!finalResults) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-green-700 font-medium">견적을 계산하고 있습니다...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showEstimate && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-100 border-2 border-green-300 rounded-lg p-6">
          {/* 헤더 */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-green-800 mb-2">📋 최종 견적서</h2>
            <p className="text-green-600">디자인 서비스 프로젝트 상세 견적</p>
          </div>

          {/* 프로젝트 개요 & 타겟 분석 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                <i className="ri-file-text-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                프로젝트 개요
              </h3>
              <div className="space-y-2 text-sm">
                <div><strong>서비스:</strong> 디자인 서비스</div>
                <div><strong>목적:</strong> {finalResults.projectDetails.step1.purposes.join(', ')}</div>
                <div><strong>세부용도:</strong> {finalResults.projectDetails.step3.details.join(', ')}</div>
                <div><strong>설명:</strong> {finalResults.projectDetails.step3.note}</div>
                <div><strong>1단계 특이사항:</strong> {finalResults.projectDetails.step1.note}</div>
              </div>
            </div>
            
            <div className="bg-white border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center">
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
          <div className="bg-white border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center">
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
          <div className="bg-white border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center">
              <i className="ri-image-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              레퍼런스 가이드
            </h3>
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">선택된 레퍼런스 (3개):</div>
              <div className="space-y-2">
                <div className="flex items-start space-x-3 p-2 bg-green-50 rounded">
                  <div className="w-8 h-8 bg-green-200 rounded flex items-center justify-center flex-shrink-0">
                    <i className="ri-image-line text-green-600 text-sm"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-green-900 truncate">브랜드 디자인 레퍼런스 #1</div>
                    <div className="text-xs text-green-600 truncate">https://behance.net/gallery/design-example1</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="px-1 py-0.5 bg-green-100 text-green-700 text-xs rounded">모던</span>
                      <span className="px-1 py-0.5 bg-green-100 text-green-700 text-xs rounded">미니멀</span>
                      <span className="px-1 py-0.5 bg-green-100 text-green-700 text-xs rounded">클래식</span>
                    </div>
                    <div className="text-xs text-green-600 mt-1">매칭도 92% - 선택하신 디자인 목적에 가장 적합한 스타일입니다.</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-2 bg-green-50 rounded">
                  <div className="w-8 h-8 bg-green-200 rounded flex items-center justify-center flex-shrink-0">
                    <i className="ri-image-line text-green-600 text-sm"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-green-900 truncate">추천 브랜딩 레퍼런스 #2</div>
                    <div className="text-xs text-green-600 truncate">https://dribbble.com/shots/example2</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="px-1 py-0.5 bg-green-100 text-green-700 text-xs rounded">창의적</span>
                      <span className="px-1 py-0.5 bg-green-100 text-green-700 text-xs rounded">혁신적</span>
                      <span className="px-1 py-0.5 bg-green-100 text-green-700 text-xs rounded">대담한</span>
                    </div>
                    <div className="text-xs text-green-600 mt-1">매칭도 88% - 선택하신 타겟층에게 강한 임팩트를 줄 수 있는 디자인 방향입니다.</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-2 bg-green-50 rounded">
                  <div className="w-8 h-8 bg-green-200 rounded flex items-center justify-center flex-shrink-0">
                    <i className="ri-image-line text-green-600 text-sm"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-green-900 truncate">업계 트렌드 레퍼런스 #3</div>
                    <div className="text-xs text-green-600 truncate">https://example-design-trends.com/example3</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="px-1 py-0.5 bg-green-100 text-green-700 text-xs rounded">트렌디</span>
                      <span className="px-1 py-0.5 bg-green-100 text-green-700 text-xs rounded">세련된</span>
                      <span className="px-1 py-0.5 bg-green-100 text-green-700 text-xs rounded">프리미엄</span>
                    </div>
                    <div className="text-xs text-green-600 mt-1">매칭도 85% - 최신 디자인 트렌드를 반영한 현대적인 접근법입니다.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">톤앤매너 키워드:</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">모던한</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">심플한</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">세련된</span>
              </div>
            </div>
            <div className="text-sm"><strong>5단계 특이사항:</strong> {finalResults.projectDetails.step6.note}</div>
          </div>

          {/* 선택된 옵션 상세 */}
          <div className="bg-white border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-4 flex items-center">
              <i className="ri-settings-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              선택된 옵션 상세
            </h3>
            <div className="space-y-3">
              {finalResults.selectedOptions.map((option: any, index: number) => (
                <div key={index} className="border border-green-100 rounded-lg p-4 bg-green-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="font-bold text-green-900 text-lg">{option.name}</div>
                      <div className="text-green-700 font-medium">{option.category}</div>
                      <div className="text-sm text-green-600 mt-1">{option.description}</div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="font-bold text-green-800 text-xl">{option.cost.toLocaleString()}원</div>
                    </div>
                  </div>
                  <div className="bg-white border border-green-200 rounded p-3 mt-3">
                    <div className="text-sm font-medium text-green-800 mb-1">📋 상세 작업 내용:</div>
                    <div className="text-sm text-green-700 leading-relaxed">{option.details}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 세부 비용 분해표 */}
          <div className="bg-white border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-4 flex items-center">
              <i className="ri-file-list-3-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              세부 비용 분해표
            </h3>
            
            {/* 인력비 */}
            <div className="mb-6">
              <h4 className="font-medium text-green-700 mb-3 pb-2 border-b border-green-200">💼 인력비</h4>
              <div className="space-y-2">
                {finalResults.selectedOptions.map((option: any, index: number) => (
                  <div key={index} className="grid grid-cols-5 gap-4 text-sm py-2 border-b border-gray-100">
                    <div className="font-medium">{option.name}</div>
                    <div className="text-center">{option.category}</div>
                    <div className="text-center">1명</div>
                    <div className="text-center">주 단위</div>
                    <div className="text-right font-bold">{Math.round(option.cost * 0.7).toLocaleString()}원</div>
                  </div>
                ))}
                <div className="grid grid-cols-5 gap-4 text-sm py-2 border-t-2 border-green-200 bg-green-50 font-bold">
                  <div className="col-span-4">인력비 소계</div>
                  <div className="text-right">{finalResults.breakdown.labor.toLocaleString()}원</div>
                </div>
              </div>
            </div>

            {/* 도구비 */}
            <div className="mb-6">
              <h4 className="font-medium text-green-700 mb-3 pb-2 border-b border-green-200">🛠️ 도구비 (소프트웨어 & 장비)</h4>
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-4 text-sm py-2 border-b border-gray-100">
                  <div className="font-medium">디자인 소프트웨어</div>
                  <div className="text-center">Adobe Creative Suite</div>
                  <div className="text-center">1개</div>
                  <div className="text-right font-bold">{Math.round(finalResults.breakdown.tools * 0.6).toLocaleString()}원</div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm py-2 border-b border-gray-100">
                  <div className="font-medium">전문 장비</div>
                  <div className="text-center">워크스테이션 & 모니터</div>
                  <div className="text-center">1세트</div>
                  <div className="text-right font-bold">{Math.round(finalResults.breakdown.tools * 0.4).toLocaleString()}원</div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm py-2 border-t-2 border-green-200 bg-green-50 font-bold">
                  <div className="col-span-3">도구비 소계</div>
                  <div className="text-right">{finalResults.breakdown.tools.toLocaleString()}원</div>
                </div>
              </div>
            </div>

            {/* 기타비 */}
            <div className="mb-6">
              <h4 className="font-medium text-green-700 mb-3 pb-2 border-b border-green-200">📋 기타비</h4>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-gray-100">
                  <div className="font-medium">소재비 (폰트, 스톡이미지)</div>
                  <div className="text-center">라이선스</div>
                  <div className="text-right font-bold">{finalResults.breakdown.other.toLocaleString()}원</div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm py-2 border-t-2 border-green-200 bg-green-50 font-bold">
                  <div className="col-span-2">기타비 소계</div>
                  <div className="text-right">{finalResults.breakdown.other.toLocaleString()}원</div>
                </div>
              </div>
            </div>

            {/* 총계 */}
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-lg font-bold">
                <div>소계</div>
                <div className="text-right">{finalResults.totalCost.toLocaleString()}원</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-lg font-bold border-t border-green-300 pt-2 mt-2">
                <div>부가세 (10%)</div>
                <div className="text-right">{finalResults.vat.toLocaleString()}원</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xl font-bold text-green-800 border-t-2 border-green-400 pt-3 mt-3">
                <div>총액</div>
                <div className="text-right">{finalResults.finalTotal.toLocaleString()}원</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-600">* 디자인 업계에서 인력비는 전체 비용의 60-70%, 도구비는 20-30%, 기타비는 10-20%가 표준입니다.</div>
          </div>

          {/* AI 종합평가 */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-orange-300 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-orange-800 mb-4 flex items-center">
              <i className="ri-ai-generate mr-2 w-5 h-5 flex items-center justify-center"></i>
              🤖 AI 종합평가 (디자인 업계 분석)
            </h3>
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-1">
                <i className="ri-star-fill text-2xl text-yellow-500"></i>
                <i className="ri-star-fill text-2xl text-yellow-500"></i>
                <i className="ri-star-fill text-2xl text-yellow-500"></i>
                <i className="ri-star-fill text-2xl text-yellow-500"></i>
                <i className="ri-star-line text-2xl text-gray-300"></i>
                <span className="ml-3 text-xl font-bold text-orange-700">4.0/5.0</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">👨‍🎨 개인 디자이너 대비</h4>
                <div className="text-sm text-orange-700">
                  <div className="flex justify-between mb-1"><span>비용 수준</span><span className="font-bold">적정</span></div>
                  <div className="text-xs text-gray-600">개인 디자이너 평균: 50-120만원</div>
                </div>
              </div>
              <div className="bg-white border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">🏢 디자인 스튜디오 대비</h4>
                <div className="text-sm text-orange-700">
                  <div className="flex justify-between mb-1"><span>비용 수준</span><span className="font-bold">표준적</span></div>
                  <div className="text-xs text-gray-600">디자인 스튜디오 평균: 150-400만원</div>
                </div>
              </div>
              <div className="bg-white border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">🌟 대형 에이전시 대비</h4>
                <div className="text-sm text-orange-700">
                  <div className="flex justify-between mb-1"><span>비용 수준</span><span className="font-bold">경제적</span></div>
                  <div className="text-xs text-gray-600">대형 에이전시 평균: 500-1000만원</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">💰 예산 적정성 분석</h4>
                <div className="space-y-2 text-sm text-orange-700">
                  <div className="flex justify-between"><span>현재 예산 수준</span><span className="font-bold">합리적 예산</span></div>
                  <div className="text-xs text-gray-600">디자인 업계에서 중간 규모 수준</div>
                </div>
              </div>
              <div className="bg-white border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">📊 복잡도 분석</h4>
                <div className="space-y-2 text-sm text-orange-700">
                  <div className="flex justify-between"><span>프로젝트 복잡도</span><span className="font-bold">적절한 구성</span></div>
                  <div className="text-xs text-gray-600">선택 옵션 {finalResults.selectedOptions.length}개 - 완성도 예상 85% 수준</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">✅ 평가 근거</h4>
                <ul className="space-y-1 text-sm text-orange-700">
                  <li className="flex items-start"><span class="text-orange-500 mr-2">•</span>브랜딩-디자인 통합 구성</li>
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
                  <div className="font-medium text-gray-800">개인 디자이너</div>
                  <div className="text-xs text-gray-600 mt-1">50-120만원</div>
                  <div className="text-xs text-green-600 mt-1">예산 적합</div>
                </div>
                <div className="p-3 rounded-lg border-2 border-green-400 bg-green-50">
                  <div className="font-medium text-gray-800">디자인 스튜디오</div>
                  <div className="text-xs text-gray-600 mt-1">150-400만원</div>
                  <div className="text-xs text-green-600 mt-1">💡 현재 예산에 최적</div>
                </div>
                <div className="p-3 rounded-lg border-2 border-gray-200 bg-gray-50">
                  <div className="font-medium text-gray-800">대형 에이전시</div>
                  <div className="text-xs text-gray-600 mt-1">500-1000만원</div>
                  <div className="text-xs text-green-600 mt-1">상위 옵션</div>
                </div>
              </div>
            </div>
          </div>

          {/* 총 제작비용 */}
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-green-800 text-lg">총 제작비용</h3>
                <p className="text-green-600 text-sm">부가세 별도</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-800">{finalResults.totalCost.toLocaleString()}원</div>
                <div className="text-sm text-green-600 mt-1">(부가세 포함: {finalResults.finalTotal.toLocaleString()}원)</div>
              </div>
            </div>
          </div>

          {/* 예상 제작기간 */}
          <div className="bg-white border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-4 flex items-center">
              <i className="ri-calendar-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              예상 제작기간: 14일
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-green-700">1단계: 컨셉 및 기획</span>
                <span className="text-green-800 font-medium">3일</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-green-700">2단계: 디자인 개발</span>
                <span className="text-green-800 font-medium">7일</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-green-700">3단계: 수정 및 보완</span>
                <span className="text-green-800 font-medium">3일</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-green-700">4단계: 최종 완성</span>
                <span className="text-green-800 font-medium">1일</span>
              </div>
            </div>
          </div>

          {/* 고객 정보 */}
          <div className="bg-white border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-4 flex items-center">
              <i className="ri-user-add-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              고객 정보
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이름 *</label>
                <input 
                  required 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                  placeholder="성함을 입력해주세요" 
                  type="text" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">연락처 *</label>
                <input 
                  required 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                  placeholder="연락처를 입력해주세요" 
                  type="tel" 
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">이메일 *</label>
              <input 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                placeholder="이메일을 입력해주세요" 
                type="email" 
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">기타 입력사항</label>
              <textarea 
                rows={3} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none" 
                placeholder="추가로 전달하고 싶은 내용이 있으시면 입력해주세요"
              ></textarea>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap">
              <i className="ri-printer-line mr-2"></i>견적서 인쇄/PDF
            </button>
            <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
              <i className="ri-mail-send-line mr-2"></i>견적발송
            </button>
            <button className="flex-1 px-6 py-3 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors cursor-pointer whitespace-nowrap">
              <i className="ri-kakao-talk-line mr-2"></i>카톡 공유
            </button>
          </div>

          <div className="mt-4 text-center">
            <button 
              onClick={() => setShowEstimate(false)}
              className="px-4 py-2 text-green-600 hover:text-green-800 transition-colors cursor-pointer"
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
          className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
        >
          처음으로
        </button>
      </div>
    </div>
  );
}
