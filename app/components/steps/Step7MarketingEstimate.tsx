'use client';

import { useState, useEffect } from 'react';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step7MarketingEstimate({ data, onUpdate, onNext, onPrev }: Props) {
  const [finalResults, setFinalResults] = useState<any>(null);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [userContact, setUserContact] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    calculateFinalEstimate();
  }, [data]);

  const calculateFinalEstimate = () => {
    const purposes = data.purposes || [];
    const details = data.details || [];
    const scale = data.scale || {};
    const elements = data.elements || {};
    const targetData = data.targetData || {};

    // 마케팅 기본 비용
    let baseCost = 2500000; // 기본 250만원
    let totalCost = baseCost;
    let timelineTotal = 30; // 기본 30일

    // 규모별 승수
    const scaleMultipliers: { [key: string]: number } = {
      '소규모': 0.6,
      '중규모': 1.0,
      '대규모': 2.0,
      '특대규모': 3.0
    };

    const scaleMultiplier = scaleMultipliers[scale.type] || 1.0;
    totalCost *= scaleMultiplier;

    // 마케팅 요소별 비용
    let elementsTotal = 0;
    const breakdown: Array<{ name: string; price: number; negotiable?: boolean }> = [
      { name: '기본 마케팅 전략', price: baseCost * scaleMultiplier }
    ];

    Object.entries(elements).forEach(([elementName, config]: [string, any]) => {
      if (config.enabled) {
        let elementCost = 0;
        
        const elementPrices: { [key: string]: number } = {
          '전략 기획': 800000,
          'SNS 마케팅': 1200000,
          '콘텐츠 제작': 1500000,
          '광고 운영': 2000000,
          '데이터 분석': 600000,
          'SEO 최적화': 800000,
          '인플루언서 협업': 1500000,
          '이벤트 기획': 1000000,
          '브랜딩 전략': 1200000,
          '퍼포먼스 마케팅': 1800000
        };

        if (config.selectedOption !== undefined) {
          const basePrice = elementPrices[elementName] || 500000;
          const optionMultipliers = [1.0, 1.5, 2.5, 4.0];
          elementCost = basePrice * (optionMultipliers[config.selectedOption] || 1.0);
          
          breakdown.push({
            name: elementName,
            price: elementCost,
            negotiable: config.selectedOption >= 2
          });
        }

        elementsTotal += elementCost;
      }
    });

    totalCost += elementsTotal;

    // 디지털 마케팅 복잡도 추가
    if (purposes.includes('디지털 마케팅')) {
      totalCost *= 1.15;
      timelineTotal *= 1.2;
    }

    const results = {
      estimate: {
        low: Math.round(totalCost * 0.75),
        mid: Math.round(totalCost),
        high: Math.round(totalCost * 1.5),
        breakdown: breakdown
      },
      timeline: {
        total: Math.round(timelineTotal),
        phases: [
          { name: '전략 수립', days: Math.round(timelineTotal * 0.2) },
          { name: '캠페인 준비', days: Math.round(timelineTotal * 0.15) },
          { name: '실행 및 운영', days: Math.round(timelineTotal * 0.5) },
          { name: '분석 및 최적화', days: Math.round(timelineTotal * 0.15) }
        ]
      },
      summary: {
        serviceType: '마케팅 서비스',
        purposes: purposes,
        targetAudience: getTargetSummary(targetData),
        scale: scale.type || '중규모',
        selectedOptions: Object.keys(elements).filter(key => elements[key]?.enabled).length,
        estimatedDelivery: `${Math.round(timelineTotal)}일 후`,
        paymentTerms: '선금 30% / 월별 정산 70%'
      }
    };

    setFinalResults(results);
    onUpdate({
      estimate: results.estimate,
      timeline: results.timeline,
      finalResults: results
    });
  };

  const getTargetSummary = (targetData: any) => {
    const parts = [];
    if (targetData.gender?.length > 0) parts.push(targetData.gender.join(', '));
    if (targetData.ageGroups?.length > 0) {
      const ageDisplay = targetData.ageGroups.length > 2 
        ? `${targetData.ageGroups.slice(0, 2).join(', ')} 외 ${targetData.ageGroups.length - 2}개` 
        : targetData.ageGroups.join(', ');
      parts.push(ageDisplay);
    }
    if (targetData.regions?.length > 0) {
      parts.push(`${targetData.regions.join(', ')} 지역`);
    }
    return parts.join(' • ') || '전체 대상';
  };

  const downloadPDF = async () => {
    alert('PDF 다운로드 기능이 준비중입니다. 현재는 화면을 캡처하여 저장하세요.');
  };

  const sendEmailEstimate = () => {
    if (!userContact.email) {
      alert('이메일 주소를 입력해주세요.');
      return;
    }
    alert(`${userContact.email}로 견적서가 전송되었습니다. (시뮬레이션)`);
  };

  const generateShareLink = () => {
    const shareData = {
      service: '마케팅 서비스',
      estimate: finalResults?.estimate?.mid || 0,
      timeline: finalResults?.timeline?.total || 0
    };
    
    const shareUrl = `${window.location.origin}?shared=${btoa(JSON.stringify(shareData))}`;
    navigator.clipboard.writeText(shareUrl);
    alert('공유 링크가 클립보드에 복사되었습니다!');
  };

  if (!finalResults) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-purple-700 font-medium">견적을 계산하고 있습니다...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-center">📊 마케팅 서비스 견적서</h2>
        <p className="text-gray-600 text-center mb-8">
          선택하신 옵션을 바탕으로 산출된 맞춤 견적입니다
        </p>
      </div>

      <div id="estimate-result" className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg">
        {/* 견적 요약 */}
        <div className="text-center mb-8 p-6 bg-purple-50 rounded-lg">
          <div className="text-4xl font-bold text-purple-600 mb-2">
            {finalResults.estimate.mid.toLocaleString()}원
          </div>
          <div className="text-gray-600 mb-4">예상 서비스 비용 (평균)</div>
          <div className="flex justify-center space-x-8 text-sm">
            <div>
              <div className="font-medium text-gray-700">최저가</div>
              <div className="text-purple-500">{finalResults.estimate.low.toLocaleString()}원</div>
            </div>
            <div>
              <div className="font-medium text-gray-700">최고가</div>
              <div className="text-purple-500">{finalResults.estimate.high.toLocaleString()}원</div>
            </div>
          </div>
        </div>

        {/* 프로젝트 요약 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">📋 프로젝트 요약</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-700 mb-2">마케팅 목적</div>
              <div className="text-gray-600">{finalResults.summary.purposes.join(', ')}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-700 mb-2">타겟 대상</div>
              <div className="text-gray-600">{finalResults.summary.targetAudience}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-700 mb-2">서비스 규모</div>
              <div className="text-gray-600">{finalResults.summary.scale}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-700 mb-2">예상 기간</div>
              <div className="text-gray-600">{finalResults.summary.estimatedDelivery}</div>
            </div>
          </div>
        </div>

        {/* 비용 세부내역 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">💰 비용 세부내역</h3>
          <div className="space-y-3">
            {finalResults.estimate.breakdown.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">{item.name}</div>
                  {item.negotiable && (
                    <div className="text-xs text-orange-600 mt-1">💡 협의 가능</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">
                    {item.price.toLocaleString()}원
                    {item.negotiable && ' ~'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 서비스 일정 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">📅 서비스 일정</h3>
          <div className="space-y-3">
            {finalResults.timeline.phases.map((phase: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <div className="font-medium text-purple-800">{phase.name}</div>
                <div className="font-bold text-purple-600">{phase.days}일</div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-purple-50 rounded-lg text-center">
            <div className="font-bold text-purple-800">
              총 서비스 기간: {finalResults.timeline.total}일
            </div>
          </div>
        </div>

        {/* 결제 조건 */}
        <div className="mb-8 p-4 bg-orange-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-orange-800">💳 결제 조건</h3>
          <p className="text-orange-700">{finalResults.summary.paymentTerms}</p>
          <p className="text-sm text-orange-600 mt-2">
            * 마케팅 성과에 따른 성과급 협의 가능합니다
          </p>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={downloadPDF}
          className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          <i className="ri-download-line mr-2"></i>
          PDF 다운로드
        </button>
        
        <button
          onClick={generateShareLink}
          className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <i className="ri-share-line mr-2"></i>
          링크 공유
        </button>
        
        <button
          onClick={() => setShowDownloadOptions(!showDownloadOptions)}
          className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          <i className="ri-mail-line mr-2"></i>
          이메일 전송
        </button>
      </div>

      {/* 이메일 전송 폼 */}
      {showDownloadOptions && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">📧 견적서 이메일 전송</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="담당자명"
              value={userContact.name}
              onChange={(e) => setUserContact({...userContact, name: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <input
              type="text"
              placeholder="회사명"
              value={userContact.company}
              onChange={(e) => setUserContact({...userContact, company: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <input
              type="email"
              placeholder="이메일 주소 *"
              value={userContact.email}
              onChange={(e) => setUserContact({...userContact, email: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            />
            <input
              type="tel"
              placeholder="연락처"
              value={userContact.phone}
              onChange={(e) => setUserContact({...userContact, phone: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <textarea
            placeholder="추가 메시지 (선택사항)"
            value={userContact.message}
            onChange={(e) => setUserContact({...userContact, message: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
            rows={3}
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={sendEmailEstimate}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              견적서 전송
            </button>
          </div>
        </div>
      )}

      {/* 추가 안내사항 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-semibold text-yellow-800 mb-3">
          <i className="ri-information-line mr-2"></i>
          견적서 안내사항
        </h3>
        <ul className="text-sm text-yellow-700 space-y-2">
          <li>• 본 견적은 선택사항을 바탕으로 한 예상 금액이며, 실제 비용은 상담 후 확정됩니다</li>
          <li>• 마케팅 성과와 광고비 규모에 따라 비용이 조정될 수 있습니다</li>
          <li>• 견적서는 발행일로부터 30일간 유효합니다</li>
          <li>• 성과 보장 및 추가 서비스 문의는 담당자에게 연락 바랍니다</li>
        </ul>
      </div>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onPrev}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          이전으로
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          새로운 견적 받기
        </button>
      </div>
    </div>
  );
}