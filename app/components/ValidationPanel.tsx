'use client';

import { useState } from 'react';
import { ValidationResult, getValidationMessage, applyAutoFix } from '../lib/validationRules';

interface Props {
  validationResults: ValidationResult[];
  onAutoFix?: (fixedData: any, result: ValidationResult) => void;
  currentData?: any;
}

export default function ValidationPanel({ validationResults, onAutoFix, currentData }: Props) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [appliedFixes, setAppliedFixes] = useState<Set<string>>(new Set());

  if (validationResults.length === 0) {
    return null;
  }

  const toggleExpand = (field: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(field)) {
      newExpanded.delete(field);
    } else {
      newExpanded.add(field);
    }
    setExpandedItems(newExpanded);
  };

  const handleAutoFix = (result: ValidationResult) => {
    if (!result.autoFix || !onAutoFix || !currentData) return;
    
    const fixedData = applyAutoFix(currentData, result);
    onAutoFix(fixedData, result);
    
    setAppliedFixes(prev => new Set([...prev, result.field]));
  };

  const getResultIcon = (level: ValidationResult['level']) => {
    switch (level) {
      case 'error': return 'ri-error-warning-line';
      case 'warning': return 'ri-alert-line';
      case 'info': return 'ri-information-line';
      default: return 'ri-information-line';
    }
  };

  const getResultColors = (level: ValidationResult['level']) => {
    switch (level) {
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: 'text-red-600',
          button: 'bg-red-100 text-red-700 hover:bg-red-200'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-600',
          button: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-600',
          button: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: 'text-gray-600',
          button: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        };
    }
  };

  const errorCount = validationResults.filter(r => r.level === 'error').length;
  const warningCount = validationResults.filter(r => r.level === 'warning').length;
  const infoCount = validationResults.filter(r => r.level === 'info').length;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-800 flex items-center">
            <i className="ri-shield-check-line mr-2 text-lg w-5 h-5 flex items-center justify-center"></i>
            스마트 검증 결과
          </h3>
          <div className="flex items-center space-x-3 text-sm">
            {errorCount > 0 && (
              <span className="flex items-center text-red-600">
                <i className="ri-error-warning-line mr-1 w-4 h-4 flex items-center justify-center"></i>
                오류 {errorCount}
              </span>
            )}
            {warningCount > 0 && (
              <span className="flex items-center text-yellow-600">
                <i className="ri-alert-line mr-1 w-4 h-4 flex items-center justify-center"></i>
                경고 {warningCount}
              </span>
            )}
            {infoCount > 0 && (
              <span className="flex items-center text-blue-600">
                <i className="ri-information-line mr-1 w-4 h-4 flex items-center justify-center"></i>
                정보 {infoCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 검증 결과 목록 */}
      <div className="divide-y divide-gray-200">
        {validationResults.map((result, index) => {
          const colors = getResultColors(result.level);
          const isExpanded = expandedItems.has(result.field);
          const isFixed = appliedFixes.has(result.field);
          
          return (
            <div
              key={`${result.field}-${index}`}
              className={`p-4 ${colors.bg} ${colors.border} ${isFixed ? 'opacity-60' : ''}`}
            >
              {/* 기본 정보 */}
              <div className="flex items-start justify-between">
                <div className="flex items-start flex-1">
                  <i className={`${getResultIcon(result.level)} ${colors.icon} mr-3 mt-1 w-5 h-5 flex items-center justify-center flex-shrink-0`}></i>
                  <div className="flex-1">
                    <div className={`font-medium ${colors.text} mb-1`}>
                      {getValidationMessage(result)}
                      {isFixed && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          수정됨
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      필드: {result.field}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                  {/* 자동 수정 버튼 */}
                  {result.autoFix && !isFixed && onAutoFix && (
                    <button
                      onClick={() => handleAutoFix(result)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${colors.button}`}
                      title="자동 수정 적용"
                    >
                      <i className="ri-tools-line mr-1 w-3 h-3 flex items-center justify-center"></i>
                      자동수정
                    </button>
                  )}
                  
                  {/* 펼치기/접기 버튼 */}
                  {result.suggestions.length > 0 && (
                    <button
                      onClick={() => toggleExpand(result.field)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${colors.button}`}
                    >
                      {isExpanded ? (
                        <>
                          <i className="ri-arrow-up-line mr-1 w-3 h-3 flex items-center justify-center"></i>
                          접기
                        </>
                      ) : (
                        <>
                          <i className="ri-arrow-down-line mr-1 w-3 h-3 flex items-center justify-center"></i>
                          해결방법
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* 상세 제안사항 */}
              {isExpanded && result.suggestions.length > 0 && (
                <div className="mt-4 pl-8">
                  <h4 className={`font-medium ${colors.text} mb-2 text-sm`}>
                    💡 해결 방법 및 제안:
                  </h4>
                  <ul className="space-y-2">
                    {result.suggestions.map((suggestion, idx) => (
                      <li
                        key={idx}
                        className={`text-sm ${colors.text} flex items-start`}
                      >
                        <span className="mr-2 text-xs">•</span>
                        <span className="flex-1">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* 자동 수정 상세 정보 */}
                  {result.autoFix && (
                    <div className="mt-3 p-3 bg-white bg-opacity-70 rounded border border-gray-200">
                      <div className="text-xs text-gray-600 mb-1">
                        <strong>자동 수정 가능:</strong>
                      </div>
                      <div className="text-xs text-gray-700">
                        {result.autoFix.action === 'suggest_alternative' && '대안 제안 및 자동 적용'}
                        {result.autoFix.action === 'remove_conflicting_elements' && '충돌하는 요소 자동 제거'}
                        {result.autoFix.action === 'fix_category_count' && '카테고리 개수 자동 조정'}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 하단 요약 */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            총 {validationResults.length}개의 검증 항목이 발견되었습니다.
          </div>
          <div className="flex items-center space-x-4">
            {errorCount > 0 && (
              <span className="text-red-600 font-medium">
                {errorCount}개 오류 (해결 필요)
              </span>
            )}
            {warningCount > 0 && (
              <span className="text-yellow-600">
                {warningCount}개 경고 (권장 사항)
              </span>
            )}
            {infoCount > 0 && (
              <span className="text-blue-600">
                {infoCount}개 정보 (참고 사항)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}