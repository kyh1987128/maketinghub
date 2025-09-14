
'use client';

import { useState, useEffect } from 'react';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface Reference {
  id: string;
  title: string;
  thumbnail: string;
  tags: string[];
  url?: string;
  type: 'custom' | 'ai';
  analysis?: any;
}

export default function Step6Reference({ data, onUpdate, onNext, onPrev }: Props) {
  const [selectedReferences, setSelectedReferences] = useState<string[]>(data.selectedReferences || []);
  const [customReferences, setCustomReferences] = useState<Reference[]>(data.customReferences || []);
  const [aiReferences, setAiReferences] = useState<Reference[]>(data.aiReferences || []);
  const [toneKeywords, setToneKeywords] = useState<string[]>(data.toneKeywords || []);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [specialNotes, setSpecialNotes] = useState(data.step6Notes || '');
  const [showFinalQuote, setShowFinalQuote] = useState(false);

  // 서비스 타입 확인
  const serviceType = data.serviceType || 'design';

  // 🚀 서비스별 톤앤매너 키워드
  const getToneOptionsByService = (): string[] => {
    switch (serviceType) {
      case 'video':
        return [
          '신뢰할 수 있는', '전문적인', '친근한', '혁신적인', '안정적인',
          '역동적인', '따뜻한', '세련된', '실용적인', '창의적인',
          '진실한', '열정적인', '차분한', '현대적인', '품격있는'
        ];
      case 'design':
        return [
          '미니멀한', '럭셔리한', '모던한', '클래식한', '플레이풀한',
          '엘레간트한', '볼드한', '소프트한', '테크니컬한', '아티스틱한',
          '내추럴한', '인더스트리얼한', '빈티지한', '컨템포러리한', '프리미엄한'
        ];
      case 'marketing':
        return [
          '어그레시브한', '소프트셀링', '스토리텔링', '데이터드리븐', '이모셔널한',
          '유머러스한', '프로페셔널한', '컨버세이셔널한', '어썸네스', '챌린징한',
          '솔루션지향적', '커뮤니티기반', '트렌디한', '어센틱한', '임팩트풀한'
        ];
      default:
        return [
          '미니멀한', '럭셔리한', '모던한', '클래식한', '플레이풀한',
          '엘레간트한', '볼드한', '소프트한', '테크니컬한', '아티스틱한'
        ];
    }
  };

  const toneOptions = getToneOptionsByService();

  // 🚀 서비스별 레퍼런스 소스 정보
  const getReferenceSourcesByService = () => {
    switch (serviceType) {
      case 'video':
        return {
          title: '영상 레퍼런스',
          placeholder: 'YouTube, Vimeo 등 영상 URL을 입력하세요',
          sources: ['YouTube', 'Vimeo', '브이라이브', '네이버TV'],
          description: '원하시는 영상 스타일과 톤앤매너를 참고 자료를 통해 구체적으로 알려주세요.'
        };
      case 'design':
        return {
          title: '디자인 레퍼런스',
          placeholder: 'Behance, Dribbble, Pinterest 등 디자인 URL을 입력하세요',
          sources: ['Behance', 'Dribbble', 'Pinterest', 'Red Dot Design', 'IF Design'],
          description: '원하시는 디자인 스타일과 브랜드 이미지를 참고 자료를 통해 구체적으로 알려주세요.'
        };
      case 'marketing':
        return {
          title: '마케팅 레퍼런스',
          placeholder: 'Facebook 광고 라이브러리, 브랜드 캠페인 URL을 입력하세요',
          sources: ['Facebook 광고 라이브러리', '브랜드 캠페인 사이트', 'LinkedIn', '마케팅 케이스 스터디'],
          description: '원하시는 마케팅 스타일과 캠페인 방향을 참고 자료를 통해 구체적으로 알려주세요.'
        };
      default:
        return {
          title: '디자인 레퍼런스',
          placeholder: 'Behance, Dribbble, Pinterest 등 디자인 URL을 입력하세요',
          sources: ['Behance', 'Dribbble', 'Pinterest', 'Red Dot Design', 'IF Design'],
          description: '원하시는 디자인 스타일과 브랜드 이미지를 참고 자료를 통해 구체적으로 알려주세요.'
        };
    }
  };

  const referenceInfo = getReferenceSourcesByService();

  // AI 레퍼런스 생성
  const generateAIReferences = async () => {
    setIsLoadingAI(true);
    try {
      // 시뮬레이션 딜레이
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 선택된 용도와 타겟에 맞는 레퍼런스 생성 (서비스별)
      const purposes = data.purposes || [];
      const targetData = data.targetData || {};
      
      let mockReferences: Reference[] = [];
      
      if (serviceType === 'video') {
        mockReferences = [
          {
            id: 'ai-video-1',
            title: `${purposes[0] || '영상'} 스타일 레퍼런스 #1`,
            thumbnail: `https://readdy.ai/api/search-image?query=professional%20video%20production%20reference%20modern%20corporate%20style%20clean%20aesthetic&width=400&height=225&seq=videoref1&orientation=landscape`,
            tags: ['전문적', '기업형', '클린'],
            url: 'https://youtube.com/example1',
            type: 'ai',
            analysis: {
              similarity: 95,
              reason: '선택하신 용도와 타겟에 가장 적합한 영상 스타일입니다.'
            }
          },
          {
            id: 'ai-video-2',
            title: '추천 영상 톤앤매너 레퍼런스 #2',
            thumbnail: `https://readdy.ai/api/search-image?query=modern%20video%20commercial%20style%20dynamic%20editing%20trendy%20design%20visual%20effects&width=400&height=225&seq=videoref2&orientation=landscape`,
            tags: ['다이나믹', '트렌디', '현대적'],
            url: 'https://vimeo.com/example2',
            type: 'ai',
            analysis: {
              similarity: 88,
              reason: '선택하신 타겟 연령대에 어필할 수 있는 영상 스타일입니다.'
            }
          },
          {
            id: 'ai-video-3',
            title: '업계 표준 영상 레퍼런스 #3',
            thumbnail: `https://readdy.ai/api/search-image?query=business%20video%20presentation%20style%20professional%20lighting%20quality%20cinematography%20standard&width=400&height=225&seq=videoref3&orientation=landscape`,
            tags: ['표준적', '안정적', '신뢰감'],
            url: 'https://youtube.com/example3',
            type: 'ai',
            analysis: {
              similarity: 82,
              reason: '해당 업계에서 일반적으로 사용되는 검증된 영상 스타일입니다.'
            }
          }
        ];
      } else if (serviceType === 'design') {
        mockReferences = [
          {
            id: 'ai-design-1',
            title: `${purposes[0] || '디자인'} 스타일 레퍼런스 #1`,
            thumbnail: `https://readdy.ai/api/search-image?query=modern%20brand%20design%20reference%20clean%20minimalist%20professional%20branding%20identity&width=400&height=225&seq=designref1&orientation=landscape`,
            tags: ['미니멀', '브랜딩', '현대적'],
            url: 'https://behance.net/example1',
            type: 'ai',
            analysis: {
              similarity: 93,
              reason: '선택하신 브랜딩 목적에 가장 적합한 디자인 스타일입니다.'
            }
          },
          {
            id: 'ai-design-2',
            title: '추천 디자인 컬러&타이포 레퍼런스 #2',
            thumbnail: `https://readdy.ai/api/search-image?query=elegant%20design%20portfolio%20colorful%20typography%20system%20brand%20guidelines%20visual%20identity&width=400&height=225&seq=designref2&orientation=landscape`,
            tags: ['엘레간트', '컬러풀', '타이포'],
            url: 'https://dribbble.com/example2',
            type: 'ai',
            analysis: {
              similarity: 89,
              reason: '선택하신 타겟에게 어필할 수 있는 시각적 스타일입니다.'
            }
          },
          {
            id: 'ai-design-3',
            title: '업계 트렌드 디자인 레퍼런스 #3',
            thumbnail: `https://readdy.ai/api/search-image?query=award%20winning%20design%20portfolio%20premium%20luxury%20branding%20creative%20visual%20system&width=400&height=225&seq=designref3&orientation=landscape`,
            tags: ['프리미엄', '수상작', '럭셔리'],
            url: 'https://pinterest.com/example3',
            type: 'ai',
            analysis: {
              similarity: 85,
              reason: '해당 업계에서 주목받고 있는 최신 디자인 트렌드입니다.'
            }
          }
        ];
      } else if (serviceType === 'marketing') {
        mockReferences = [
          {
            id: 'ai-marketing-1',
            title: `${purposes[0] || '마케팅'} 캠페인 레퍼런스 #1`,
            thumbnail: `https://readdy.ai/api/search-image?query=successful%20marketing%20campaign%20digital%20advertising%20social%20media%20strategy%20creative%20content&width=400&height=225&seq=marketref1&orientation=landscape`,
            tags: ['디지털', '소셜미디어', '창의적'],
            url: 'https://facebook.com/ads/library/example1',
            type: 'ai',
            analysis: {
              similarity: 91,
              reason: '선택하신 마케팅 목적에 가장 효과적인 캠페인 스타일입니다.'
            }
          },
          {
            id: 'ai-marketing-2',
            title: '추천 브랜드 마케팅 레퍼런스 #2',
            thumbnail: `https://readdy.ai/api/search-image?query=brand%20marketing%20case%20study%20successful%20campaign%20storytelling%20emotional%20connection%20customer%20engagement&width=400&height=225&seq=marketref2&orientation=landscape`,
            tags: ['스토리텔링', '감정적', '참여형'],
            url: 'https://linkedin.com/example2',
            type: 'ai',
            analysis: {
              similarity: 87,
              reason: '선택하신 타겟층에게 강한 임팩트를 줄 수 있는 마케팅 접근법입니다.'
            }
          },
          {
            id: 'ai-marketing-3',
            title: '업계 성공 마케팅 레퍼런스 #3',
            thumbnail: `https://readdy.ai/api/search-image?query=industry%20leading%20marketing%20strategy%20data%20driven%20performance%20marketing%20roi%20optimization&width=400&height=225&seq=marketref3&orientation=landscape`,
            tags: ['데이터드리븐', '성과중심', '최적화'],
            url: 'https://example-case-study.com/example3',
            type: 'ai',
            analysis: {
              similarity: 83,
              reason: '해당 업계에서 검증된 성과를 보인 마케팅 전략입니다.'
            }
          }
        ];
      }
      
      setAiReferences(mockReferences);
    } catch (error) {
      console.error('AI 레퍼런스 생성 오류:', error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  // 커스텀 레퍼런스 추가
  const addCustomReference = (url: string) => {
    if (!url.trim()) return;
    
    const newRef: Reference = {
      id: `custom-${Date.now()}`,
      title: url,
      thumbnail: `https://readdy.ai/api/search-image?query=$%7BserviceType%7D%20reference%20custom%20user%20provided%20content%20placeholder&width=400&height=225&seq=custom${Date.now()}&orientation=landscape`,
      tags: ['사용자 제공'],
      url: url,
      type: 'custom'
    };
    
    setCustomReferences(prev => [...prev, newRef]);
  };

  const handleToneKeywordToggle = (keyword: string) => {
    setToneKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const handleNext = () => {
    const updateData = {
      selectedReferences,
      references: [...customReferences, ...aiReferences],
      customReferences,
      aiReferences,
      toneKeywords,
      step6Notes: specialNotes
    };
    
    onUpdate(updateData);
    setShowFinalQuote(true);
    onNext();
  };

  const canProceed = selectedReferences.length > 0 || toneKeywords.length > 0;

  const getServiceInfo = () => {
    switch (serviceType) {
      case 'video':
        return { color: 'blue', icon: 'ri-play-circle-line' };
      case 'design':
        return { color: 'green', icon: 'ri-palette-line' };
      case 'marketing':
        return { color: 'purple', icon: 'ri-megaphone-line' };
      default:
        return { color: 'green', icon: 'ri-palette-line' };
    }
  };

  const serviceInfo = getServiceInfo();

  useEffect(() => {
    // 컴포넌트 마운트 시 AI 레퍼런스 자동 생성
    if (aiReferences.length === 0 && data.details && data.targetData) {
      generateAIReferences();
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">{referenceInfo.title}와 톤앤매너를 선택해주세요</h2>
        <p className="text-gray-600 mb-6">
          {referenceInfo.description}
        </p>
        
        {/* 이전 단계 요약 */}
        <div className={`bg-${serviceInfo.color}-50 border border-${serviceInfo.color}-200 rounded-lg p-4 mb-4`}>
          <div className="flex items-center">
            <i className={`${serviceInfo.icon} text-${serviceInfo.color}-600 mr-2 w-4 h-4 flex items-center justify-center`}></i>
            <div>
              <span className={`font-medium text-${serviceInfo.color}-800`}>선택된 서비스: </span>
              <span className={`text-${serviceInfo.color}-700`}>
                {serviceType === 'video' ? '영상 제작' : 
                 serviceType === 'design' ? '디자인 제작' : 
                 serviceType === 'marketing' ? '마케팅 서비스' : '기타'}
              </span>
            </div>
          </div>
        </div>

        {/* 레퍼런스 소스 안내 */}
        {referenceInfo.sources.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-gray-800 mb-2">추천 레퍼런스 소스:</h3>
            <div className="flex flex-wrap gap-2">
              {referenceInfo.sources.map(source => (
                <span key={source} className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700">
                  {source}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI 추천 레퍼런스 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">🤖 AI 추천 레퍼런스</h3>
          <button
            onClick={generateAIReferences}
            disabled={isLoadingAI}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              isLoadingAI
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : `bg-${serviceInfo.color}-600 text-white hover:bg-${serviceInfo.color}-700`
            }`}
          >
            {isLoadingAI ? (
              <>
                <div className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                생성 중...
              </>
            ) : (
              <>
                <i className="ri-refresh-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                새로 생성
              </>
            )}
          </button>
        </div>

        {isLoadingAI ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 rounded-lg h-32 mb-2"></div>
                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 h-3 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiReferences.map((ref) => {
              return (
                <div key={ref.id} className="relative group">
                  <label
                    className={`block border-2 rounded-lg overflow-hidden transition-colors cursor-pointer ${
                      selectedReferences.includes(ref.id)
                        ? `border-${serviceInfo.color}-500 bg-${serviceInfo.color}-50`
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedReferences.includes(ref.id)}
                      onChange={(e) => {
                        setSelectedReferences(prev =>
                          e.target.checked
                            ? [...prev, ref.id]
                            : prev.filter(id => id !== ref.id)
                        );
                      }}
                      className="sr-only"
                    />
                    <img
                      src={ref.thumbnail}
                      alt={ref.title}
                      className="w-full h-32 object-cover object-top"
                    />
                    <div className="p-3">
                      <h4 className="font-medium text-sm text-gray-900">
                        {ref.title}
                      </h4>
                      {/* 링크 주소 표시 */}
                      {ref.url && (
                        <div className={`mt-1 text-xs text-${serviceInfo.color}-600 truncate`}>
                          <i className="ri-link mr-1 w-3 h-3 flex items-center justify-center"></i>
                          {ref.url}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {ref.tags.map(tag => (
                          <span
                            key={tag}
                            className={`px-2 py-1 text-xs rounded-full bg-${serviceInfo.color}-100 text-${serviceInfo.color}-700`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {ref.analysis && (
                        <div className="mt-2 text-xs text-green-600">
                          <div className="flex items-center">
                            <i className="ri-thumb-up-line mr-1 w-3 h-3 flex items-center justify-center"></i>
                            매칭도 {ref.analysis.similarity}%
                          </div>
                          <p className="mt-1">{ref.analysis.reason}</p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 커스텀 레퍼런스 추가 */}
      <div>
        <h3 className="font-medium mb-3">직접 레퍼런스 추가</h3>
        <div className="flex gap-3">
          <input
            type="url"
            placeholder={referenceInfo.placeholder}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addCustomReference((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.querySelector('input[type="url"]') as HTMLInputElement;
              if (input?.value) {
                addCustomReference(input.value);
                input.value = '';
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-add-line mr-2 w-4 h-4 flex items-center justify-center"></i>
            추가
          </button>
        </div>

        {customReferences.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {customReferences.map((ref) => (
              <div
                key={ref.id}
                className={`border-2 rounded-lg overflow-hidden ${
                  selectedReferences.includes(ref.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <label className="block cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedReferences.includes(ref.id)}
                    onChange={(e) => {
                      setSelectedReferences(prev =>
                        e.target.checked
                          ? [...prev, ref.id]
                          : prev.filter(id => id !== ref.id)
                      );
                    }}
                    className="sr-only"
                  />
                  <img
                    src={ref.thumbnail}
                    alt={ref.title}
                    className="w-full h-32 object-cover object-top"
                  />
                  <div className="p-3">
                    <h4 className="font-medium text-sm text-gray-900 truncate">
                      {ref.title}
                    </h4>
                    {/* 링크 주소 표시 */}
                    {ref.url && (
                      <div className="mt-1 text-xs text-blue-600 truncate">
                        <i className="ri-link mr-1 w-3 h-3 flex items-center justify-center"></i>
                        {ref.url}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ref.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 톤앤매너 선택 */}
      <div>
        <h3 className="font-medium mb-3">원하는 톤앤매너 키워드</h3>
        <p className="text-gray-600 text-sm mb-4">
          {serviceType === 'video' ? '영상에서 표현하고 싶은 분위기나 느낌을 선택해주세요.' :
           serviceType === 'design' ? '디자인에서 표현하고 싶은 스타일이나 느낌을 선택해주세요.' :
           serviceType === 'marketing' ? '마케팅에서 추구하고 싶은 방향성이나 접근법을 선택해주세요.' :
           '표현하고 싶은 분위기나 느낌을 선택해주세요.'} (중복 선택 가능)
        </p>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {toneOptions.map((tone) => {
            return (
              <div key={tone} className="relative group">
                <label
                  className={`flex items-center justify-center p-3 border-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    toneKeywords.includes(tone)
                      ? `border-${serviceInfo.color}-500 bg-${serviceInfo.color}-50 text-${serviceInfo.color}-700`
                      : `border-gray-300 text-gray-700 hover:border-${serviceInfo.color}-300 hover:bg-${serviceInfo.color}-50`
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={toneKeywords.includes(tone)}
                    onChange={() => handleToneKeywordToggle(tone)}
                    className="sr-only"
                  />
                  {tone}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* 특이사항 입력란 */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-medium text-orange-800 mb-3">
          <i className="ri-sticky-note-line mr-2 w-4 h-4 flex items-center justify-center"></i>
          특이사항 및 추가 요청사항
        </h3>
        <textarea
          value={specialNotes}
          onChange={(e) => setSpecialNotes(e.target.value)}
          placeholder={`예: ${serviceType === 'video' ? '특별한 영상 스타일 요청 / 톤앤매너 조합 요청 / 레퍼런스 관련 세부 사항' :
                               serviceType === 'design' ? '특별한 디자인 스타일 요청 / 컬러 제한사항 / 브랜드 가이드라인 관련 요청' :
                               serviceType === 'marketing' ? '특별한 캠페인 방향 요청 / 타겟별 차별화 전략 / 채널별 톤앤매너 조합' :
                               '특별한 스타일 요청 / 톤앤매너 관련 세부 사항'} 등`}
          className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-white"
          rows={4}
        />
        <p className="text-xs text-orange-700 mt-2">
          💡 레퍼런스나 스타일과 관련된 특별한 요구사항이 있으시면 자유롭게 작성해주세요!
        </p>
      </div>

      {/* 선택 결과 미리보기 */}
      {(selectedReferences.length > 0 || toneKeywords.length > 0) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-3">✅ 스타일 가이드 완성</h3>
          
          {selectedReferences.length > 0 && (
            <div className="mb-3">
              <div className="text-sm font-medium text-green-700 mb-2">
                선택된 레퍼런스 ({selectedReferences.length}개):
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedReferences.map(refId => {
                  const ref = [...customReferences, ...aiReferences].find(r => r.id === refId);
                  return ref ? (
                    <span key={refId} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                      {ref.type === 'ai' ? '🤖 ' : '📎 '}{ref.title.length > 20 ? ref.title.substring(0, 20) + '...' : ref.title}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {toneKeywords.length > 0 && (
            <div>
              <div className="text-sm font-medium text-green-700 mb-2">
                선택된 톤앤매너 ({toneKeywords.length}개):
              </div>
              <div className="flex flex-wrap gap-2">
                {toneKeywords.map(keyword => (
                  <span key={keyword} className={`px-3 py-1 bg-${serviceInfo.color}-100 text-${serviceInfo.color}-700 text-sm rounded-full`}>
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 p-3 bg-blue-100 rounded-lg">
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">💡 스타일 가이드 효과</p>
              <p>• 선택하신 레퍼런스를 바탕으로 정확한 스타일 구현</p>
              <p>• 톤앤매너에 맞는 {serviceType === 'video' ? '편집 방향성' : serviceType === 'design' ? '디자인 방향성' : '캠페인 방향성'} 설정</p>
              <p>• 브랜드 일관성을 유지한 {serviceType === 'video' ? '영상' : serviceType === 'design' ? '디자인' : '마케팅'} 제작</p>
            </div>
          </div>
        </div>
      )}

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
          견적서 확인
        </button>
      </div>
    </div>
  );
}
