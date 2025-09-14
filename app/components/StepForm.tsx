
'use client';

import { useState, useEffect } from 'react';
import Step1Purpose from './steps/Step1Purpose';
import Step2Target from './steps/Step2Target';
import Step3Details from './steps/Step3Details';
import Step4Scale from './steps/Step4Scale';
// 🚀 서비스별 분리된 컴포넌트들 import
import Step5VideoElements from './steps/Step5VideoElements';
import Step5DesignElements from './steps/Step5DesignElements';
import Step5MarketingElements from './steps/Step5MarketingElements';
import Step6Reference from './steps/Step6Reference';
import ValidationPanel from './ValidationPanel';
import { validateStep, summarizeValidation, ValidationResult } from '../lib/validationRules';

// 🚀 NEW: 브라우저 및 저장소 추적 시스템
const getBrowserInfo = () => {
  return {
    userAgent: navigator.userAgent,
    browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 
             navigator.userAgent.includes('Firefox') ? 'Firefox' :
             navigator.userAgent.includes('Safari') ? 'Safari' :
             navigator.userAgent.includes('Edge') ? 'Edge' : 'Unknown',
    platform: navigator.platform,
    language: navigator.language
  };
};

const logStepTransition = (phase: string, step: number, data: any, context: string = '') => {
  const browserInfo = getBrowserInfo();
  const timestamp = new Date().toISOString();
  
  console.group(`🔄 [STEP FORM] ${phase} - Step ${step} - ${timestamp}`);
  console.log(`🌐 브라우저: ${browserInfo.browser} (${browserInfo.platform})`);
  console.log(`🔗 UserAgent: ${browserInfo.userAgent}`);
  if (context) console.log(`📍 Context: ${context}`);
  
  // 로컬/세션 스토리지 확인
  try {
    const localData = localStorage.getItem('stepFormData');
    const sessionData = sessionStorage.getItem('stepFormData');
    console.log(`💾 LocalStorage: ${localData ? 'EXISTS' : 'EMPTY'}`);
    console.log(`🗂️ SessionStorage: ${sessionData ? 'EXISTS' : 'EMPTY'}`);
    
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        console.log(`📊 LocalStorage 데이터 크기:`, JSON.stringify(parsed).length, 'bytes');
      } catch (e) {
        console.error(`❌ LocalStorage 파싱 오류:`, e);
      }
    }
  } catch (e) {
    console.warn(`⚠️ Storage 접근 오류:`, e);
  }
  
  // 핵심 데이터 추적
  console.log(`📋 현재 단계 데이터:`, data);
  console.log(`🎯 핵심 진행 상황:`, {
    currentStep: step,
    serviceType: data?.serviceType,
    purposes: data?.purposes?.length || 0,
    targetData: Object.keys(data?.targetData || {}).length,
    details: data?.details?.length || 0,
    scale: data?.scale?.type || 'none',
    elements: Object.keys(data?.elements || {}).filter(k => data?.elements?.[k]?.enabled).length,
    references: data?.references?.length || 0,
    estimateExists: !!data?.estimate?.mid,
    timelineExists: !!data?.timeline?.total,
    // 🚀 NEW: 실시간 계산값 추적
    calculatedTotalCost: data?.calculatedTotalCost || 0,
    realTimePrice: data?.realTimePrice || 0,
    realTimeDays: data?.realTimeDays || 0
  });
  
  console.groupEnd();
};

const saveStepData = (step: number, data: any, phase: string) => {
  const browserInfo = getBrowserInfo();
  const key = `stepFormData_step${step}`;
  
  console.log(`💾 [${browserInfo.browser}] ${phase} - Step ${step} 저장 시도`);
  
  try {
    const dataToSave = {
      step,
      timestamp: new Date().toISOString(),
      browser: browserInfo.browser,
      data: data
    };
    
    localStorage.setItem(key, JSON.stringify(dataToSave));
    sessionStorage.setItem(key, JSON.stringify(dataToSave));
    localStorage.setItem('stepFormData', JSON.stringify(dataToSave));
    sessionStorage.setItem('stepFormData', JSON.stringify(dataToSave));
    
    // 저장 확인
    const localRead = localStorage.getItem(key);
    const sessionRead = sessionStorage.getItem(key);
    
    console.log(`✅ Step ${step} LocalStorage: ${localRead ? 'SUCCESS' : 'FAILED'}`);
    console.log(`✅ Step ${step} SessionStorage: ${sessionRead ? 'SUCCESS' : 'FAILED'}`);
    
    return true;
  } catch (e) {
    console.error(`❌ [${browserInfo.browser}] Step ${step} 저장 실패:`, e);
    return false;
  }
};

interface FormData {
  // 🚀 1단계 데이터
  purposes: string[];
  userInput?: string;
  serviceType?: 'video' | 'design' | 'marketing';
  category?: string;
  step1Notes?: string;
  
  // 🚀 2단계 데이터 
  targetData?: {
    ageGroups: string[];
    gender: string[];
    regions: string[];
    occupations: string[];
    interests: string[];
    nationality: string[];
    customTarget?: string;
  };
  step2Notes?: string;
  
  // 🚀 3단계 데이터
  details: string[];
  step3Notes?: string;
  
  // 🚀 4단계 데이터
  scale: {
    type: string;
    value: string;
    custom?: string;
  };
  step4Notes?: string;
  
  // 🚀 5단계 데이터 + 실시간 계산값
  elements: {
    [key: string]: {
      enabled: boolean;
      level?: number;
      quantity?: number;
      selectedOption?: number;
      option?: string;
    };
  };
  step5Notes?: string;
  calculatedImpact?: number;
  calculatedTimeAdd?: number;
  // 🚀 NEW: 5단계에서 계산된 실제 비용값
  calculatedTotalCost?: number;
  realTimePrice?: number;
  realTimeDays?: number;
  
  // 🚀 6단계 데이터
  selectedReferences?: string[];
  references: Array<{
    id: string;
    title: string;
    thumbnail: string;
    tags: string[];
    url?: string;
    type: 'custom' | 'ai';
    analysis?: any;
  }>;
  customReferences?: Array<any>;
  aiReferences?: Array<any>;
  toneKeywords: string[];
  step6Notes?: string;
  
  // 🚀 7단계 데이터
  estimate: {
    low: number;
    mid: number;
    high: number;
    breakdown: Array<{ name: string; impact: number }>;
  };
  timeline: {
    total: number;
    phases: Array<{ name: string; days: number }>;
  };
  step7Notes?: string;
  
  // 기타 호환성 필드
  aiConfidence: number;
  categories?: string[];
  primaryCategory?: string;
  subTasks: Array<{ category: string; detail: string }>;
  productionType?: string;
}

export default function StepForm() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isClient, setIsClient] = useState(false);
  
  // 🚀 완전한 데이터 누적 시스템 - serviceType 보존 강화
  const [formData, setFormData] = useState<FormData>({
    // 1단계 초기값
    purposes: [],
    userInput: '',
    serviceType: undefined,  // 🚀 FIX: 기본값 제거로 덮어쓰기 방지
    category: '',
    step1Notes: '',
    
    // 2단계 초기값
    targetData: {
      ageGroups: [],
      gender: [],
      regions: [],
      occupations: [],
      interests: [],
      nationality: [],
      customTarget: ''
    },
    step2Notes: '',
    
    // 3단계 초기값
    details: [],
    step3Notes: '',
    
    // 4단계 초기값
    scale: { type: '', value: '' },
    step4Notes: '',
    
    // 5단계 초기값 + 실시간 계산값
    elements: {},
    step5Notes: '',
    calculatedImpact: 0,
    calculatedTimeAdd: 0,
    calculatedTotalCost: 0,  // 🚀 NEW
    realTimePrice: 0,        // 🚀 NEW
    realTimeDays: 0,         // 🚀 NEW
    
    // 6단계 초기값
    selectedReferences: [],
    references: [],
    customReferences: [],
    aiReferences: [],
    toneKeywords: [],
    step6Notes: '',
    
    // 7단계 초기값
    estimate: {
      low: 0,
      mid: 0,
      high: 0,
      breakdown: [],
    },
    timeline: {
      total: 0,
      phases: [],
    },
    step7Notes: '',
    
    // 기타 호환성 필드
    aiConfidence: 0,
    categories: [],
    primaryCategory: '',
    subTasks: [],
    productionType: ''
  });
  
  // 스마트 검증 시스템 상태
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  // 클라이언트 마운트 확인
  useEffect(() => {
    setIsClient(true);
    logStepTransition('FORM_MOUNT', 1, formData, 'StepForm 컴포넌트 마운트');
    
    // 초기 데이터 저장 시도
    saveStepData(1, formData, 'INITIAL_MOUNT');
  }, []);

  // 🚀 FormData 변경 추적
  useEffect(() => {
    if (isClient) {
      logStepTransition('DATA_UPDATE', currentStep, formData, 'FormData 상태 변경');
      saveStepData(currentStep, formData, 'DATA_CHANGE');
    }
  }, [formData, currentStep, isClient]);

  // 🚀 단계 변경 추적
  useEffect(() => {
    if (isClient) {
      logStepTransition('STEP_CHANGE', currentStep, formData, `단계 ${currentStep}로 이동`);
      saveStepData(currentStep, formData, 'STEP_TRANSITION');
    }
  }, [currentStep]);

  // 🔧 MAJOR FIX: serviceType 차단 로직 완전히 제거 - 모든 데이터 자유롭게 업데이트
  const updateFormData = (stepData: Partial<FormData>) => {
    logStepTransition('UPDATE_START', currentStep, { current: formData, incoming: stepData }, '데이터 업데이트 시작');
    
    const updatedData = {
      ...formData,
      ...stepData  // 🚀 FIX: serviceType 포함 모든 데이터 자유롭게 업데이트
    };
    
    setFormData(updatedData);
    
    logStepTransition('UPDATE_END', currentStep, updatedData, '데이터 업데이트 완료');
    saveStepData(currentStep, updatedData, 'UPDATE_COMPLETE');
  };

  const nextStep = () => {
    logStepTransition('NEXT_STEP_START', currentStep, formData, '다음 단계로 이동 시작');
    
    // 진행 전 최종 검증
    const results = validateStep(currentStep, formData);
    const summary = summarizeValidation(results);
    
    setValidationResults(results);
    
    if (summary.canProceed) {
      const newStep = Math.min(currentStep + 1, 6); // 🚀 최대 6단계로 제한
      setCurrentStep(newStep);
      setShowValidation(false);
      
      logStepTransition('NEXT_STEP_SUCCESS', newStep, formData, `단계 ${currentStep}에서 ${newStep}로 이동 성공`);
      saveStepData(newStep, formData, 'STEP_FORWARD');
    } else {
      setShowValidation(true);
      logStepTransition('NEXT_STEP_BLOCKED', currentStep, formData, '검증 실패로 단계 이동 차단');
    }
  };

  const prevStep = () => {
    logStepTransition('PREV_STEP_START', currentStep, formData, '이전 단계로 이동 시작');
    
    const newStep = Math.max(currentStep - 1, 1);
    setCurrentStep(newStep);
    setShowValidation(false);
    
    logStepTransition('PREV_STEP_SUCCESS', newStep, formData, `단계 ${currentStep}에서 ${newStep}로 이동 성공`);
    saveStepData(newStep, formData, 'STEP_BACKWARD');
  };

  // 처음으로 돌아가기 함수 추가
  const goToFirstStep = () => {
    logStepTransition('RESET_START', currentStep, formData, '처음으로 돌아가기 시작');
    
    setCurrentStep(1);
    setShowValidation(false);
    
    logStepTransition('RESET_SUCCESS', 1, formData, '1단계로 초기화 완료');
    saveStepData(1, formData, 'RESET_TO_FIRST');
  };

  // 자동 수정 핸들러
  const handleAutoFix = (fixedData: any, result: ValidationResult) => {
    logStepTransition('AUTO_FIX_START', currentStep, { original: formData, fixed: fixedData }, '자동 수정 시작');
    
    setFormData(fixedData);
    
    // 수정 후 재검증
    const newResults = validateStep(currentStep, fixedData);
    setValidationResults(newResults);
    
    logStepTransition('AUTO_FIX_END', currentStep, fixedData, '자동 수정 완료');
    saveStepData(currentStep, fixedData, 'AUTO_FIX_COMPLETE');
  };

  const renderStep = () => {
    // 🚀 모든 단계에 완전한 누적 데이터 전달
    const stepProps = {
      data: formData,  // 전체 누적 데이터 전달
      onUpdate: updateFormData,
      onNext: nextStep,
      onPrev: prevStep,
    };

    switch (currentStep) {
      case 1:
        logStepTransition('RENDER_STEP1', 1, formData, 'Step1Purpose 렌더링');
        return (
          <Step1Purpose
            data={formData}
            onUpdate={updateFormData}
            onNext={nextStep}
          />
        );
      case 2:
        logStepTransition('RENDER_STEP2', 2, formData, 'Step2Target 렌더링');
        return <Step2Target {...stepProps} />;
      case 3:
        logStepTransition('RENDER_STEP3', 3, formData, 'Step3Details 렌더링');
        return <Step3Details {...stepProps} />;
      case 4:
        logStepTransition('RENDER_STEP4', 4, formData, 'Step4Scale 렌더링');
        return <Step4Scale {...stepProps} />;
      case 5:
        // 🚀 단계 순서 변경: 기존 6단계(레퍼런스)를 5단계로 이동
        logStepTransition('RENDER_STEP5', 5, formData, 'Step6Reference 렌더링 (5단계로 이동)');
        return <Step6Reference {...stepProps} />;
      case 6:
        // 🚀 단계 순서 변경: 기존 5단계(옵션 선택)를 6단계로 이동하여 최종 견적서 포함
        const serviceType = formData.serviceType;
        logStepTransition('RENDER_STEP6', 6, formData, `Step5 Elements 렌더링 (6단계로 이동) + 최종 견적서 - ServiceType: ${serviceType}`);
        
        if (serviceType === 'video') {
          return <Step5VideoElements {...stepProps} />;
        } else if (serviceType === 'design') {
          return <Step5DesignElements {...stepProps} />;
        } else if (serviceType === 'marketing') {
          return <Step5MarketingElements {...stepProps} />;
        } else {
          // 🚀 FIX: 리다이렉트 대신 기본 컴포넌트 로드
          console.warn('ServiceType이 설정되지 않았습니다. 기본 영상 컴포넌트를 로드합니다.');
          return <Step5VideoElements {...stepProps} />;
        }
      default:
        return null;
    }
  };

  const totalSteps = 6; // 🚀 총 단계를 6단계로 변경
  
  // 🚀 FIX: 하이드레이션 오류 방지 - 클라이언트에서만 동적 값 계산
  const progressWidth = isClient ? Math.min(Math.max((currentStep / totalSteps) * 100, 0), 100) : 0;
  const validationSummary = summarizeValidation(validationResults);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            제작 의뢰 견적 시스템
          </h1>
          <div className="flex items-center space-x-4">
            {/* 검증 상태 표시 */}
            {validationResults.length > 0 && (
              <button
                onClick={() => setShowValidation(!showValidation)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  validationSummary.errorCount > 0
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : validationSummary.warningCount > 0
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                <i className="ri-shield-check-line mr-1 w-4 h-4 flex items-center justify-center"></i>
                검증 {validationResults.length}
              </button>
            )}
            
            <span className="text-lg font-semibold text-blue-600">
              Step {isClient ? currentStep : 1}/{totalSteps}
            </span>
          </div>
        </div>
        
        {/* 프로그레스 바 */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressWidth}%` }}
          />
        </div>
        
        {/* 진행 불가 경고 */}
        {!validationSummary.canProceed && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-800">
              <i className="ri-error-warning-line mr-2 w-5 h-5 flex items-center justify-center"></i>
              <span className="font-medium">
                {validationSummary.errorCount}개의 오류를 해결해야 다음 단계로 진행할 수 있습니다.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 검증 패널 */}
      {showValidation && validationResults.length > 0 && (
        <div className="mb-6">
          <ValidationPanel
            validationResults={validationResults}
            onAutoFix={handleAutoFix}
            currentData={formData}
          />
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        {renderStep()}
      </div>
      
      {/* 🚀 데이터 누적 현황 표시 (개발 모드) - 하이드레이션 안전 처리 */}
      {process.env.NODE_ENV === 'development' && isClient && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
          <details>
            <summary className="cursor-pointer font-medium mb-2">🚀 데이터 누적 현황 & 디버깅 정보 + 브라우저 추적 (6단계 시스템)</summary>
            <div className="space-y-2">
              <div><strong>🌐 브라우저:</strong> {getBrowserInfo().browser} ({getBrowserInfo().platform})</div>
              <div><strong>🔗 UserAgent:</strong> {getBrowserInfo().userAgent}</div>
              <div><strong>현재 단계:</strong> {currentStep}/{totalSteps} (6단계 시스템)</div>
              <div><strong>검증 결과:</strong> {validationResults.length}개</div>
              <div><strong>진행 가능:</strong> {validationSummary.canProceed ? '예' : '아니오'}</div>
              
              <div className="border-t pt-2 mt-2">
                <div><strong>🚨 ServiceType:</strong> <span className="font-bold text-red-600">{formData.serviceType || 'undefined'}</span></div>
                <div><strong>1단계 데이터:</strong> 목적({formData.purposes?.length || 0}개), 서비스({formData.serviceType})</div>
                <div><strong>2단계 데이터:</strong> 타겟({(formData.targetData?.ageGroups?.length || 0) + (formData.targetData?.interests?.length || 0)}개 선택)</div>
                <div><strong>3단계 데이터:</strong> 세부용도({formData.details?.length || 0}개)</div>
                <div><strong>4단계 데이터:</strong> 규모({formData.scale?.type})</div>
                <div><strong>5단계 데이터:</strong> 레퍼런스({formData.references?.length || 0}개)</div>
                <div><strong>6단계 데이터:</strong> 옵션({Object.keys(formData.elements || {}).filter(k => formData.elements?.[k]?.enabled).length}개) + 최종견적서</div>
                <div><strong>🚀 6단계 실시간 계산:</strong> {formData.calculatedTotalCost?.toLocaleString() || 0}원, {formData.realTimeDays || 0}일</div>
                <div><strong>✅ 시스템 변경:</strong> 7단계 제거, 6단계에서 최종 완결</div>
              </div>
              
              <div className="border-t pt-2 mt-2">
                <div><strong>💾 Storage 상태:</strong></div>
                <div className="ml-2">
                  <div>- LocalStorage: {(() => {
                    try {
                      return localStorage.getItem('stepFormData') ? 'EXISTS' : 'EMPTY';
                    } catch {
                      return 'ERROR';
                    }
                  })()}</div>
                  <div>- SessionStorage: {(() => {
                    try {
                      return sessionStorage.getItem('stepFormData') ? 'EXISTS' : 'EMPTY';
                    } catch {
                      return 'ERROR';
                    }
                  })()}</div>
                </div>
              </div>
              
              <div className="border-t pt-2 mt-2">
                <div><strong>클라이언트 준비:</strong> {isClient ? '완료' : '준비중'}</div>
                <div><strong>전체 데이터 크기:</strong> {JSON.stringify(formData).length} bytes</div>
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
