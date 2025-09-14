
'use client';

import { useState, useEffect, useCallback } from 'react';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step7Estimate({ data, onUpdate, onNext, onPrev }: Props) {
  const [estimateData, setEstimateData] = useState(data.estimate || {});
  const [timelineData, setTimelineData] = useState(data.timeline || {});
  const [additionalNotes, setAdditionalNotes] = useState(data.step7Notes || '');
  const [activeTab, setActiveTab] = useState<'estimate' | 'timeline' | 'analysis'>('estimate');

  const serviceType = data.serviceType || 'video';

  // 🚀 실제 5단계 데이터를 기반으로 한 동적 견적 계산
  const calculateDetailedEstimate = useCallback(() => {
    // 🚀 FIXED: 5단계에서 전달된 실제 계산값 우선 사용
    const step5RealPrice = data.realTimePrice || data.calculatedTotalCost || data.calculatedImpact || 0;
    const step5RealDays = data.realTimeDays || data.calculatedTimeAdd || 3;
    
    console.log('🚀 7단계 견적 계산 - 5단계 데이터:', {
      realTimePrice: data.realTimePrice,
      calculatedTotalCost: data.calculatedTotalCost,
      calculatedImpact: data.calculatedImpact,
      step5Elements: Object.keys(data.elements || {}).filter(k => data.elements?.[k]?.enabled).length,
      finalPrice: step5RealPrice,
      finalDays: step5RealDays
    });

    let low, mid, high;
    let totalDays;
    
    if (step5RealPrice > 0) {
      // 🚀 5단계에서 실제 선택된 옵션 가격을 기준으로 견적 산출
      low = Math.floor(step5RealPrice * 0.85);  // 15% 할인
      mid = step5RealPrice;  // 실제 선택 가격
      high = Math.floor(step5RealPrice * 1.25); // 25% 추가
      totalDays = Math.max(step5RealDays, 3);
      
      console.log('✅ 5단계 실제 데이터 기반 견적 적용:', { low, mid, high, totalDays });
    } else {
      // 기본 서비스별 최소 견적 (5단계 선택이 없을 경우에만)
      const defaultEstimates = {
        video: { low: 1000000, mid: 1800000, high: 3000000, days: 7 },
        design: { low: 800000, mid: 1500000, high: 2500000, days: 10 },
        marketing: { low: 1500000, mid: 3000000, high: 5000000, days: 14 }
      };
      
      const defaultEst = defaultEstimates[serviceType] || defaultEstimates.video;
      low = defaultEst.low;
      mid = defaultEst.mid;
      high = defaultEst.high;
      totalDays = defaultEst.days;
      
      console.log('⚠️ 기본 견적 적용 (5단계 데이터 없음):', { low, mid, high, totalDays });
    }

    // 🚀 서비스별 견적 세부 항목
    const getBreakdownByService = () => {
      switch (serviceType) {
        case 'video':
          return [
            { name: '기획 및 시나리오', impact: Math.floor(mid * 0.15) },
            { name: '촬영 및 현장 작업', impact: Math.floor(mid * 0.35) },
            { name: '편집 및 후작업', impact: Math.floor(mid * 0.25) },
            { name: '음향 및 음악', impact: Math.floor(mid * 0.10) },
            { name: '그래픽 및 특수효과', impact: Math.floor(mid * 0.10) },
            { name: '최종 마스터링', impact: Math.floor(mid * 0.05) }
          ];
        case 'design':
          return [
            { name: '컨셉 기획 및 리서치', impact: Math.floor(mid * 0.20) },
            { name: '디자인 시안 작업', impact: Math.floor(mid * 0.40) },
            { name: '피드백 반영 및 수정', impact: Math.floor(mid * 0.20) },
            { name: '최종 파일 제작', impact: Math.floor(mid * 0.15) },
            { name: '가이드라인 작성', impact: Math.floor(mid * 0.05) }
          ];
        case 'marketing':
          return [
            { name: '시장 분석 및 전략 수립', impact: Math.floor(mid * 0.25) },
            { name: '캠페인 기획 및 설계', impact: Math.floor(mid * 0.20) },
            { name: '콘텐츠 제작 및 관리', impact: Math.floor(mid * 0.30) },
            { name: '광고 운영 및 최적화', impact: Math.floor(mid * 0.15) },
            { name: '성과 분석 및 리포팅', impact: Math.floor(mid * 0.10) }
          ];
        default:
          return [{ name: '기본 제작비', impact: mid }];
      }
    };

    // 🚀 서비스별 일정 단계
    const getPhasesByService = () => {
      switch (serviceType) {
        case 'video':
          return [
            { name: '기획 및 사전 제작', days: Math.ceil(totalDays * 0.25) },
            { name: '촬영 및 현장 작업', days: Math.ceil(totalDays * 0.35) },
            { name: '편집 및 후작업', days: Math.ceil(totalDays * 0.30) },
            { name: '최종 검토 및 수정', days: Math.ceil(totalDays * 0.10) }
          ];
        case 'design':
          return [
            { name: '리서치 및 컨셉 기획', days: Math.ceil(totalDays * 0.20) },
            { name: '초안 디자인 작업', days: Math.ceil(totalDays * 0.40) },
            { name: '피드백 및 수정 작업', days: Math.ceil(totalDays * 0.30) },
            { name: '최종 완성 및 전달', days: Math.ceil(totalDays * 0.10) }
          ];
        case 'marketing':
          return [
            { name: '전략 수립 및 기획', days: Math.ceil(totalDays * 0.25) },
            { name: '콘텐츠 제작 및 준비', days: Math.ceil(totalDays * 0.35) },
            { name: '캠페인 실행 및 운영', days: Math.ceil(totalDays * 0.30) },
            { name: '성과 분석 및 최적화', days: Math.ceil(totalDays * 0.10) }
          ];
        default:
          return [{ name: '제작 작업', days: totalDays }];
      }
    };

    const estimate = {
      low,
      mid,
      high,
      breakdown: getBreakdownByService()
    };

    const timeline = {
      total: totalDays,
      phases: getPhasesByService()
    };

    setEstimateData(estimate);
    setTimelineData(timeline);

    onUpdate({
      estimate,
      timeline,
      step7Notes: additionalNotes
    });
  }, [data, serviceType, additionalNotes, onUpdate]);

  // 🚀 서비스별 맞춤 AI 분석
  const getIndustryAnalysis = () => {
    switch (serviceType) {
      case 'video':
        return {
          marketTrends: [
            '숏폼 콘텐츠 수요 급증 (73% 증가)',
            '모바일 최적화 영상 필수',
            '인터랙티브 영상 콘텐츠 트렌드',
            '라이브 스트리밍 통합 서비스'
          ],
          budgetGuidelines: [
            '기본 프로모션 영상: 100-300만원',
            '기업 홍보 영상: 300-800만원',
            '전문 다큐멘터리: 800-2000만원',
            '대규모 캠페인 영상: 2000만원+'
          ],
          recommendations: [
            '타겟 연령대에 맞는 영상 길이 최적화',
            '멀티플랫폼 활용을 위한 다양한 포맷 제작',
            'A/B 테스트를 통한 콘텐츠 최적화',
            '브랜드 일관성을 위한 톤앤매너 통일'
          ]
        };
      case 'design':
        return {
          marketTrends: [
            '미니멀리즘과 기능성 중심 디자인',
            '접근성과 포용성을 고려한 디자인',
            '브랜드 아이덴티티 일관성 강화',
            '지속가능성을 반영한 디자인'
          ],
          budgetGuidelines: [
            '로고 디자인: 50-200만원',
            '브랜드 패키지: 200-500만원',
            '웹사이트 디자인: 300-1000만원',
            '종합 브랜딩: 1000만원+'
          ],
          recommendations: [
            '타겟 고객의 문화적 배경 고려',
            '다양한 매체에서의 확장성 검토',
            '경쟁사 대비 차별화 포인트 강화',
            '트렌드와 브랜드 고유성의 균형'
          ]
        };
      case 'marketing':
        return {
          marketTrends: [
            '개인화된 마케팅 메시지 중요성 증가',
            '옴니채널 마케팅 전략 필수',
            '데이터 기반 의사결정 확산',
            '인플루언서와의 협업 확대'
          ],
          budgetGuidelines: [
            '소규모 디지털 캠페인: 월 100-300만원',
            '종합 마케팅 패키지: 월 300-800만원',
            '대규모 브랜드 캠페인: 월 800만원+',
            '연간 마케팅 전략: 5000만원+'
          ],
          recommendations: [
            '명확한 KPI 설정과 지속적 모니터링',
            '플랫폼별 콘텐츠 최적화',
            '고객 여정에 따른 맞춤 메시지',
            '브랜드 스토리와 가치 일관성 유지'
          ]
        };
      default:
        return {
          marketTrends: ['시장 분석 정보 없음'],
          budgetGuidelines: ['예산 가이드라인 없음'],
          recommendations: ['추천사항 없음']
        };
    }
  };

  const industryAnalysis = getIndustryAnalysis();

  // 🚀 처음으로 가기 함수
  const handleGoToFirst = () => {
    if (window.confirm('처음부터 다시 시작하시겠습니까? 입력하신 모든 데이터가 초기화됩니다.')) {
      window.location.reload();
    }
  };

  // 🚀 완전한 견적서 인쇄 함수
  const handlePrintSummary = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>제작 의뢰 견적서</title>
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
            <h1>제작 의뢰 견적서</h1>
            <p>발행일: ${new Date().toLocaleDateString('ko-KR')}</p>
          </div>
          
          <div class="section">
            <h2>📋 프로젝트 개요</h2>
            <div class="info-grid">
              <div class="info-box">
                <h3>서비스 분야</h3>
                <p>${data.serviceType === 'video' ? '영상 제작' : data.serviceType === 'design' ? '디자인 제작' : '마케팅 서비스'}</p>
              </div>
              <div class="info-box">
                <h3>선택된 목적</h3>
                <p>${(data.purposes || []).join(', ')}</p>
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
              ${Object.keys(data.elements || {}).filter(key => data.elements[key]?.enabled).map(key => {
                const element = data.elements[key];
                return `<div class="breakdown-item">
                  <span>${key.replace('.', ' > ')}</span>
                  <span>옵션 ${element.selectedOption + 1}번</span>
                </div>`;
              }).join('') || '<p>선택된 옵션 없음</p>'}
            </div>
          </div>

          <div class="section">
            <h2>🖼️ 레퍼런스</h2>
            <div class="info-box">
              <p>선택된 레퍼런스: ${(data.references || []).length}개</p>
              <p>톤앤매너 키워드: ${(data.toneKeywords || []).join(', ') || '미지정'}</p>
            </div>
          </div>

          <div class="section">
            <h2>💰 상세 견적</h2>
            <div class="price-highlight">
              예상 제작비용: ${estimateData.mid?.toLocaleString() || '0'}원
            </div>
            <div class="info-box">
              <h3>견적 범위</h3>
              <div class="breakdown-item">
                <span>최소 견적</span>
                <span>${estimateData.low?.toLocaleString() || '0'}원</span>
              </div>
              <div class="breakdown-item">
                <span>표준 견적</span>
                <span>${estimateData.mid?.toLocaleString() || '0'}원</span>
              </div>
              <div class="breakdown-item">
                <span>최대 견적</span>
                <span>${estimateData.high?.toLocaleString() || '0'}원</span>
              </div>
            </div>
            <div class="info-box">
              <h3>비용 세부 내역</h3>
              ${(estimateData.breakdown || []).map(item => 
                `<div class="breakdown-item">
                  <span>${item.name}</span>
                  <span>${item.impact?.toLocaleString() || '0'}원</span>
                </div>`
              ).join('')}
            </div>
          </div>

          <div class="section">
            <h2>📅 예상 일정</h2>
            <div class="info-box">
              <div class="price-highlight">
                총 제작 기간: ${timelineData.total || 0}일
              </div>
              <h3>단계별 일정</h3>
              ${(timelineData.phases || []).map(phase => 
                `<div class="timeline-item">
                  <span>${phase.name}</span>
                  <span>${phase.days}일</span>
                </div>`
              ).join('')}
            </div>
          </div>

          <div class="section">
            <h2>📌 특이사항 및 추가 요청</h2>
            <div class="info-box">
              <p><strong>1단계 특이사항:</strong> ${data.step1Notes || '없음'}</p>
              <p><strong>2단계 특이사항:</strong> ${data.step2Notes || '없음'}</p>
              <p><strong>3단계 특이사항:</strong> ${data.step3Notes || '없음'}</p>
              <p><strong>4단계 특이사항:</strong> ${data.step4Notes || '없음'}</p>
              <p><strong>5단계 특이사항:</strong> ${data.step5Notes || '없음'}</p>
              <p><strong>6단계 특이사항:</strong> ${data.step6Notes || '없음'}</p>
              <p><strong>7단계 특이사항:</strong> ${additionalNotes || '없음'}</p>
            </div>
          </div>

          <div class="section">
            <h2>📊 시장 분석 및 추천사항</h2>
            <div class="info-grid">
              <div class="info-box">
                <h3>시장 트렌드</h3>
                <ul>
                  ${industryAnalysis.marketTrends.map(trend => `<li>${trend}</li>`).join('')}
                </ul>
              </div>
              <div class="info-box">
                <h3>예산 가이드라인</h3>
                <ul>
                  ${industryAnalysis.budgetGuidelines.map(budget => `<li>${budget}</li>`).join('')}
                </ul>
              </div>
            </div>
            <div class="info-box">
              <h3>전문가 추천사항</h3>
              <ul>
                ${industryAnalysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="section">
            <p style="text-align: center; color: #666; font-size: 12px; margin-top: 40px;">
              본 견적서는 제작 의뢰 견적 시스템을 통해 자동 생성되었습니다.<br>
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

  useEffect(() => {
    calculateDetailedEstimate();
  }, [calculateDetailedEstimate]);

  const getServiceInfo = () => {
    switch (serviceType) {
      case 'video':
        return {
          title: '영상 제작 최종 견적',
          description: '선택하신 옵션을 바탕으로 산출된 영상 제작 견적입니다.',
          color: 'blue'
        };
      case 'design':
        return {
          title: '디자인 제작 최종 견적',
          description: '선택하신 옵션을 바탕으로 산출된 디자인 제작 견적입니다.',
          color: 'green'
        };
      case 'marketing':
        return {
          title: '마케팅 서비스 최종 견적',
          description: '선택하신 옵션을 바탕으로 산출된 마케팅 서비스 견적입니다.',
          color: 'purple'
        };
      default:
        return {
          title: '최종 견적',
          description: '선택하신 옵션을 바탕으로 산출된 견적입니다.',
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
      </div>

      {/* 탭 메뉴 */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'estimate', name: '💰 견적', icon: 'ri-money-dollar-circle-line' },
          { id: 'timeline', name: '📅 일정', icon: 'ri-calendar-line' },
          { id: 'analysis', name: '📊 분석', icon: 'ri-bar-chart-line' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? `bg-${serviceInfo.color}-600 text-white`
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <i className={`${tab.icon} mr-2 w-4 h-4 flex items-center justify-center`}></i>
            {tab.name}
          </button>
        ))}
      </div>

      {/* 견적 탭 */}
      {activeTab === 'estimate' && (
        <div className="space-y-6">
          {/* 메인 견적 */}
          <div className={`bg-gradient-to-r from-${serviceInfo.color}-50 to-indigo-50 border-2 border-${serviceInfo.color}-200 rounded-lg p-6`}>
            <h3 className={`font-semibold text-${serviceInfo.color}-800 mb-4 text-center`}>
              🎯 최종 견적 결과
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className={`text-lg font-bold text-${serviceInfo.color}-600`}>
                  {estimateData.low?.toLocaleString() || '0'}원
                </div>
                <div className={`text-sm text-${serviceInfo.color}-500`}>최소 견적</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold text-${serviceInfo.color}-600`}>
                  {estimateData.mid?.toLocaleString() || '0'}원
                </div>
                <div className={`text-sm text-${serviceInfo.color}-500`}>표준 견적 (권장)</div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold text-${serviceInfo.color}-600`}>
                  {estimateData.high?.toLocaleString() || '0'}원
                </div>
                <div className={`text-sm text-${serviceInfo.color}-500`}>최대 견적</div>
              </div>
            </div>
            <p className={`text-center text-sm text-${serviceInfo.color}-600`}>
              * 선택하신 세부 옵션을 모두 반영한 견적입니다
            </p>
          </div>

          {/* 견적 세부 내역 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4">💰 비용 세부 내역</h3>
            <div className="space-y-3">
              {(estimateData.breakdown || []).map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">{item.name}</span>
                  <span className={`font-medium text-${serviceInfo.color}-600`}>
                    {item.impact?.toLocaleString() || '0'}원
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 일정 탭 */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className={`bg-gradient-to-r from-${serviceInfo.color}-50 to-indigo-50 border-2 border-${serviceInfo.color}-200 rounded-lg p-6`}>
            <h3 className={`font-semibold text-${serviceInfo.color}-800 mb-4 text-center`}>
              📅 예상 제작 일정
            </h3>
            <div className="text-center mb-4">
              <div className={`text-3xl font-bold text-${serviceInfo.color}-600`}>
                {timelineData.total || 0}일
              </div>
              <div className={`text-sm text-${serviceInfo.color}-500`}>총 제작 기간</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4">📋 단계별 일정</h3>
            <div className="space-y-3">
              {(timelineData.phases || []).map((phase, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 bg-${serviceInfo.color}-100 text-${serviceInfo.color}-600 rounded-full flex items-center justify-center text-sm font-bold mr-3`}>
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{phase.name}</span>
                  </div>
                  <span className={`font-medium text-${serviceInfo.color}-600`}>
                    {phase.days}일
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI 분석 탭 */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          <div className={`bg-gradient-to-r from-${serviceInfo.color}-50 to-indigo-50 border-2 border-${serviceInfo.color}-200 rounded-lg p-6`}>
            <h3 className={`font-semibold text-${serviceInfo.color}-800 mb-4 flex items-center`}>
              <i className="ri-ai-generate mr-2 w-5 h-5 flex items-center justify-center"></i>
              🤖 AI 견적 분석 및 제작사 선택 가이드
            </h3>
            <p className={`text-${serviceInfo.color}-700 text-sm`}>
              {serviceType === 'video' ? '영상 제작' : serviceType === 'design' ? '디자인 제작' : '마케팅 서비스'} 업계 트렌드와 시장 분석을 바탕으로 한 전문가 조언입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-3">📈 시장 트렌드</h4>
              <ul className="space-y-2">
                {industryAnalysis.marketTrends.map((trend, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-700">
                    <span className={`text-${serviceInfo.color}-500 mr-2`}>•</span>
                    {trend}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-3">💡 예산 가이드라인</h4>
              <ul className="space-y-2">
                {industryAnalysis.budgetGuidelines.map((budget, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-700">
                    <span className={`text-${serviceInfo.color}-500 mr-2`}>•</span>
                    {budget}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-3">🎯 전문가 추천사항</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {industryAnalysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start text-sm text-gray-700">
                  <span className={`text-${serviceInfo.color}-500 mr-2`}>✓</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 추가 특이사항 */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-medium text-orange-800 mb-3">
          <i className="ri-edit-line mr-2 w-4 h-4 flex items-center justify-center"></i>
          최종 특이사항 및 요청사항
        </h3>
        <textarea
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          placeholder="예: 예산 조정 필요성, 일정 단축/연장 요청, 추가 서비스 필요, 계약 조건 등"
          className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-white"
          rows={4}
        />
      </div>

      {/* 액션 버튼들 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">📋 다음 단계</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={handlePrintSummary}
            className={`px-6 py-3 bg-${serviceInfo.color}-600 text-white rounded-lg font-medium hover:bg-${serviceInfo.color}-700 transition-colors whitespace-nowrap cursor-pointer`}
          >
            <i className="ri-printer-line mr-2"></i>
            견적서 인쇄하기
          </button>
          <button
            onClick={() => {
              const subject = encodeURIComponent(`${serviceType === 'video' ? '영상 제작' : serviceType === 'design' ? '디자인 제작' : '마케팅 서비스'} 견적 문의`);
              const body = encodeURIComponent(`견적 금액: ${estimateData.mid?.toLocaleString() || '0'}원\n제작 기간: ${timelineData.total || 0}일\n\n자세한 상담을 원합니다.`);
              window.open(`mailto:?subject=${subject}&body=${body}`);
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-mail-line mr-2"></i>
            이메일 상담하기
          </button>
          <button
            onClick={onPrev}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            이전으로 가기
          </button>
          <button
            onClick={handleGoToFirst}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-refresh-line mr-2"></i>
            처음으로 가기
          </button>
        </div>
      </div>
    </div>
  );
}
