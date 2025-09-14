
'use client';

import { useState, useEffect, useCallback } from 'react';
import { purposeCategories } from '../../lib/validationRules';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

export default function Step1Purpose({ data = {}, onUpdate, onNext }: Props) {
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>(data.purposes || []);
  const [userInput, setUserInput] = useState(data.userInput || '');
  const [specialNotes, setSpecialNotes] = useState(data.step1Notes || '');
  
  // 🚀 FIX: 초기값을 undefined로 설정 - 서비스 선택 전까지는 목적 박스 안보이게
  const [selectedServiceType, setSelectedServiceType] = useState<'video' | 'design' | 'marketing' | undefined>(data?.serviceType || undefined);

  // 🚀 서비스 옵션들
  const serviceOptions = [
    {
      id: 'video',
      name: '영상 제작',
      category: '영상',
      description: '기획부터 편집까지 완전한 영상 제작',
      icon: 'ri-video-line',
      color: 'blue'
    },
    {
      id: 'design',
      name: '디자인 제작',
      category: '디자인',
      description: '브랜딩부터 인쇄물까지 전문 디자인',
      icon: 'ri-palette-line',
      color: 'green'
    },
    {
      id: 'marketing',
      name: '마케팅 서비스',
      category: '마케팅',
      description: 'SNS부터 광고까지 통합 마케팅',
      icon: 'ri-advertisement-line',
      color: 'purple'
    }
  ];

  // 🚀 서비스 타입별 목적 카테고리 가져오기
  const getCurrentPurposeCategories = () => {
    return purposeCategories[selectedServiceType] || purposeCategories.video;
  };

  // 🚀 FIX: 서비스 타입 변경 시 - 목적 초기화하고 렌더링 오류 방지
  const handleServiceTypeChange = (serviceId: 'video' | 'design' | 'marketing') => {
    // 🚀 서비스 타입 바뀔 때 목적도 초기화해서 오류 방지
    setSelectedServiceType(serviceId);
    setSelectedPurposes([]); // 목적 초기화로 렌더링 오류 방지
  };

  // 🚀 완전 자유 목적 선택 시스템 - 모든 제약 제거
  const handlePurposeToggle = (purpose: string) => {
    const isCurrentlySelected = selectedPurposes.includes(purpose);
    
    if (isCurrentlySelected) {
      // 선택 해제는 항상 허용
      const updated = selectedPurposes.filter(p => p !== purpose);
      setSelectedPurposes(updated);
    } else {
      // 선택 추가도 항상 허용 - 모든 제약 제거
      const updated = [...selectedPurposes, purpose];
      setSelectedPurposes(updated);
    }
  };

  // 🔧 FIX: 데이터 업데이트 - serviceType 포함해서 전달
  const updateFormDataCallback = useCallback(() => {
    if (typeof onUpdate === 'function') {
      const selectedService = serviceOptions.find(s => s.id === selectedServiceType);
      const updateData = {
        purposes: selectedPurposes,
        userInput: userInput,
        serviceType: selectedServiceType, // 🚀 FIX: selectedServiceType이 undefined일 때도 전달
        category: selectedService?.category || '',
        step1Notes: specialNotes
      };
      console.log('🚀 Step1Purpose 업데이트 데이터:', updateData);
      onUpdate(updateData);
    }
  }, [selectedPurposes, userInput, selectedServiceType, specialNotes, onUpdate, serviceOptions]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateFormDataCallback();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [updateFormDataCallback]);

  const handleNext = () => {
    try {
      if (typeof onNext === 'function') {
        onNext();
      }
    } catch (err) {
      console.error('Error while proceeding to the next step:', err);
    }
  };

  // 🚀 진행 조건 - serviceType만 필수로 변경
  const canProceed = selectedServiceType !== undefined;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">필요한 서비스를 선택해주세요</h2>
        <p className="text-gray-600 mb-6">
          제작하려는 서비스 분야를 선택하고 구체적인 목적을 알려주세요.
        </p>
      </div>

      {/* 🚀 서비스 선택 */}
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-4">서비스 분야 선택 <span className="text-red-500">*</span></h3>
          <p className="text-gray-600 text-sm mb-4">
            각 분야별로 전문적인 견적과 옵션을 제공합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {serviceOptions.map((option) => {
            const isSelected = selectedServiceType === option.id;
            
            return (
              <label
                key={option.id}
                className={`p-6 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  isSelected
                    ? `border-${option.color}-600 bg-${option.color}-50`
                    : 'border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="serviceType"
                  checked={isSelected}
                  onChange={() => handleServiceTypeChange(option.id)}
                  className="sr-only"
                />
                <div className={`${
                  isSelected
                    ? `text-${option.color}-600` : 'text-gray-700'
                }`}>
                  <div className="flex items-center justify-center mb-4">
                    <i className={`${option.icon} text-4xl w-12 h-12 flex items-center justify-center`}></i>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg mb-2">{option.name}</div>
                    <div className="text-sm">{option.description}</div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 🚀 단순화된 추가 설명 입력창 - AI 추천 완전 제거 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            추가 설명
          </label>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={`예: ${selectedServiceType === 'video' ? '20대 직장인 대상 5분 정도의 산업현장 안전교육을 재미있게 하기 위한 영상 제작을 원합니다' : selectedServiceType === 'design' ? '스타트업 브랜드 아이덴티티와 로고 디자인이 필요해서 문의드립니다' : selectedServiceType === 'marketing' ? 'Instagram과 Facebook을 통한 20-30대 타겟 마케팅 캠페인을 기획하고 있습니다' : '서비스를 먼저 선택해주세요'}`}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={4}
          />
          <p className="text-xs text-gray-600 mt-2">
            구체적인 요구사항이나 상황을 설명해주시면 더 정확한 견적을 제공할 수 있습니다.
          </p>
        </div>
      </div>

      {/* 🚀 완전 자유 선택 안내 */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-medium text-green-800 mb-2">
          <i className="ri-check-line mr-2 w-4 h-4 flex items-center justify-center"></i>
          자유 선택 시스템
        </h3>
        <div className="text-sm text-green-700 space-y-1">
          <p>• 모든 카테고리의 목적을 자유롭게 혼합 선택할 수 있습니다</p>
          <p>• 여러 분야가 결합된 복합적인 프로젝트도 가능합니다</p>
          <p>• 선택하신 조합에 맞는 맞춤 견적을 제공합니다</p>
        </div>
      </div>

      {/* 🚀 FIX: 목적 선택 - 서비스 타입이 선택되었을 때만 표시 */}
      {selectedServiceType && (
        <div>
          <h3 className="font-medium mb-4">
            목적 선택 <span className="text-red-500">*</span>
            <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              자유 혼합 선택 가능
            </span>
          </h3>
          
          <div className="space-y-6">
            {getCurrentPurposeCategories().map((category) => {
              return (
                <div key={category.title} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {category.title}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {category.purposes.map((purpose) => {
                      const isSelected = selectedPurposes.includes(purpose);
                      
                      return (
                        <div key={purpose} className="relative group">
                          <label
                            className={`flex items-center p-3 border rounded-lg transition-colors cursor-pointer ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50 hover:bg-blue-100'
                                : 'border-gray-200 hover:bg-white bg-white'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handlePurposeToggle(purpose)}
                              className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className={`flex-1 text-sm ${
                              isSelected 
                                ? 'text-blue-700 font-medium' 
                                : 'text-gray-700'
                            }`}>
                              {purpose}
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
      )}

      {/* 선택 결과 미리보기 */}
      {selectedPurposes.length > 0 && selectedServiceType && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 border rounded-lg p-4">
          <h3 className="font-semibold mb-3 text-green-800">
            ✅ 선택 결과
          </h3>
          
          <div className="mb-3">
            <div className="text-sm font-medium mb-1 text-green-700">
              선택된 서비스:
            </div>
            <div className="text-sm text-green-600">
              {serviceOptions.find(s => s.id === selectedServiceType)?.name}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2 text-green-700">
              목적 ({selectedPurposes.length}개):
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedPurposes.map((purpose) => (
                <div key={purpose} className="flex items-center rounded-full bg-green-100 text-green-700">
                  <span className="px-3 py-1 text-sm font-medium">
                    {purpose}
                  </span>
                  <button
                    onClick={() => handlePurposeToggle(purpose)}
                    className="ml-1 mr-2 text-green-600 hover:text-green-800 transition-colors"
                    title="선택 해제"
                  >
                    <i className="ri-close-line text-sm"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 특이사항 입력란 */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-medium text-orange-800 mb-3">
          <i className="ri-sticky-note-line mr-2"></i>
          특이사항 및 추가 요청사항
        </h3>
        <textarea
          value={specialNotes}
          onChange={(e) => setSpecialNotes(e.target.value)}
          placeholder="예: 복합적인 서비스가 필요한 상황 / 특정 스타일이나 톤 요청 / 특별한 상황 설명 등"
          className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-white"
          rows={4}
        />
        <p className="text-xs text-orange-700 mt-2">
          💡 추가적인 요구사항이나 특별한 상황이 있으시면 자세히 설명해주세요!
        </p>
      </div>

      <div className="flex justify-end pt-6">
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
            canProceed
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          다음으로
        </button>
      </div>
    </div>
  );
}
