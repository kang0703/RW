import { useState, useEffect } from 'react';
import { API_KEYS, API_ENDPOINTS, PUBLIC_DATA_API_KEY, PUBLIC_DATA_ENDPOINTS, PUBLIC_DATA_PARAMS, API_SETTINGS, checkApiKeys } from '../../config/api';
import './Events.scss';

const Events = ({ selectedCity }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('idle'); // idle, loading, success, error, fallback

  // 컴포넌트 마운트 시 API 키 상태 확인
  useEffect(() => {
    checkApiKeys();
  }, []);

  // 더미데이터 함수 (API 비활성화 시 사용)
  const getFallbackEvents = (cityName) => {
    // 도시명을 지역명으로 변환
    const regionName = getRegionFromCity(cityName);
    
    const fallbackEvents = {
      '서울특별시': [
        {
          id: 'seoul-1',
          title: '서울 봄꽃 축제',
          location: '서울특별시',
          date: '2024년 4월',
          description: '서울의 아름다운 봄꽃을 감상할 수 있는 축제입니다.',
          category: '축제',
          source: '더미데이터'
        },
        {
          id: 'seoul-2',
          title: '서울 한류 페스티벌',
          location: '서울특별시',
          date: '2024년 8월',
          description: '한류 문화를 체험할 수 있는 대형 페스티벌입니다.',
          category: '축제',
          source: '더미데이터'
        }
      ],
      '경기도': [
        {
          id: 'gyeonggi-1',
          title: '경기도 꽃 축제',
          location: '경기도',
          date: '2024년 5월',
          description: '경기도 전역에서 펼쳐지는 다양한 꽃 축제입니다.',
          category: '축제',
          source: '더미데이터'
        },
        {
          id: 'gyeonggi-2',
          title: '경기도 전통문화 축제',
          location: '경기도',
          date: '2024년 10월',
          description: '경기도의 전통문화를 체험할 수 있는 축제입니다.',
          category: '문화',
          source: '더미데이터'
        }
      ],
      '강원도': [
        {
          id: 'gangwon-1',
          title: '강원도 겨울 축제',
          location: '강원도',
          date: '2024년 12월',
          description: '강원도의 아름다운 겨울 풍경을 즐길 수 있는 축제입니다.',
          category: '축제',
          source: '더미데이터'
        },
        {
          id: 'gangwon-2',
          title: '강원도 여름 피서 축제',
          location: '강원도',
          date: '2024년 7월',
          description: '시원한 강원도에서 즐기는 여름 피서 축제입니다.',
          category: '레저',
          source: '더미데이터'
        }
      ],
      '부산광역시': [
        {
          id: 'busan-1',
          title: '부산 해변 축제',
          location: '부산광역시',
          date: '2024년 7월',
          description: '부산의 아름다운 해변에서 즐기는 여름 축제입니다.',
          category: '축제',
          source: '더미데이터'
        }
      ],
      '제주특별자치도': [
        {
          id: 'jeju-1',
          title: '제주 한라산 등반 축제',
          location: '제주특별자치도',
          date: '2024년 6월',
          description: '제주 한라산을 등반하며 즐기는 자연 축제입니다.',
          category: '레저',
          source: '더미데이터'
        }
      ]
    };
    
    // 지역별 더미데이터가 있으면 반환, 없으면 기본 데이터 반환
    return fallbackEvents[regionName] || [
      {
        id: 'default-1',
        title: '지역 행사 정보',
        location: regionName,
        date: '2024년',
        description: `${regionName} 지역의 다양한 축제와 행사 정보를 확인해보세요.`,
        category: '행사정보',
        source: '더미데이터'
      }
    ];
  };

  // 도시명을 지역명으로 변환하는 함수
  const getRegionFromCity = (cityName) => {
    const cityToRegion = {
      // 서울특별시
      '서울': '서울특별시',
      
      // 부산광역시
      '부산': '부산광역시',
      
      // 대구광역시
      '대구': '대구광역시',
      
      // 인천광역시
      '인천': '인천광역시',
      
      // 광주광역시
      '광주': '광주광역시',
      
      // 대전광역시
      '대전': '대전광역시',
      
      // 울산광역시
      '울산': '울산광역시',
      
      // 세종특별자치시
      '세종': '세종특별자치시',
      
      // 경기도
      '수원': '경기도', '고양': '경기도', '용인': '경기도', '성남': '경기도', '부천': '경기도',
      '안산': '경기도', '남양주': '경기도', '화성': '경기도', '평택': '경기도', '의정부': '경기도',
      '파주': '경기도', '광명': '경기도', '이천': '경기도', '김포': '경기도', '군포': '경기도',
      '하남': '경기도', '오산': '경기도', '안양': '경기도', '과천': '경기도', '의왕': '경기도',
      '구리': '경기도', '동두천': '경기도', '양주': '경기도', '포천': '경기도', '여주': '경기도',
      '연천': '경기도', '가평': '경기도', '양평': '경기도',
      
      // 강원도
      '춘천': '강원도', '원주': '강원도', '강릉': '강원도', '동해': '강원도', '태백': '강원도',
      '속초': '강원도', '삼척': '강원도', '홍천': '강원도', '횡성': '강원도', '영월': '강원도',
      '평창': '강원도', '정선': '강원도', '철원': '강원도', '화천': '강원도', '양구': '강원도',
      '인제': '강원도', '고성': '강원도', '양양': '강원도',
      
      // 충청북도
      '청주': '충청북도', '충주': '충청북도', '제천': '충청북도', '음성': '충청북도', '진천': '충청북도',
      '괴산': '충청북도', '증평': '충청북도', '단양': '충청북도', '보은': '충청북도', '옥천': '충청북도',
      '영동': '충청북도', '금산': '충청북도',
      
      // 충청남도
      '천안': '충청남도', '공주': '충청남도', '보령': '충청남도', '아산': '충청남도', '서산': '충청남도',
      '논산': '충청남도', '계룡': '충청남도', '부여': '충청남도', '서천': '충청남도', '청양': '충청남도',
      '홍성': '충청남도', '예산': '충청남도', '태안': '충청남도', '당진': '충청남도',
      
      // 전라북도
      '전주': '전라북도', '군산': '전라북도', '익산': '전라북도', '정읍': '전라북도', '남원': '전라북도',
      '김제': '전라북도', '완주': '전라북도', '진안': '전라북도', '무주': '전라북도', '장수': '전라북도',
      '임실': '전라북도', '순창': '전라북도', '고창': '전라북도', '부안': '전라북도',
      
      // 전라남도
      '목포': '전라남도', '여수': '전라남도', '순천': '전라남도', '나주': '전라남도', '광양': '전라남도',
      '담양': '전라남도', '곡성': '전라남도', '구례': '전라남도', '고흥': '전라남도', '보성': '전라남도',
      '화순': '전라남도', '장흥': '전라남도', '강진': '전라남도', '해남': '전라남도', '영암': '전라남도',
      '무안': '전라남도', '함평': '전라남도', '영광': '전라남도', '장성': '전라남도', '완도': '전라남도',
      '진도': '전라남도', '신안': '전라남도',
      
      // 경상북도
      '포항': '경상북도', '경주': '경상북도', '김천': '경상북도', '안동': '경상북도', '구미': '경상북도',
      '영주': '경상북도', '영천': '경상북도', '상주': '경상북도', '문경': '경상북도', '경산': '경상북도',
      '의성': '경상북도', '청송': '경상북도', '영양': '경상북도', '영덕': '경상북도', '청도': '경상북도',
      '고령': '경상북도', '성주': '경상북도', '칠곡': '경상북도', '예천': '경상북도', '봉화': '경상북도',
      '울진': '경상북도', '울릉': '경상북도',
      
      // 경상남도
      '창원': '경상남도', '진주': '경상남도', '통영': '경상남도', '사천': '경상남도', '김해': '경상남도',
      '밀양': '경상남도', '거제': '경상남도', '양산': '경상남도', '의령': '경상남도', '함안': '경상남도',
      '창녕': '경상남도', '고성': '경상북도', '남해': '경상남도', '하동': '경상남도', '산청': '경상남도',
      '함양': '경상남도', '거창': '경상남도', '합천': '경상남도',
      
      // 제주특별자치도
      '제주': '제주특별자치도', '서귀포': '제주특별자치도'
    };
    
    return cityToRegion[cityName] || cityName;
  };

  // 공공데이터포털에서 지역별 행사 정보 가져오기 (공식 문서 기준)
  const fetchEvents = async (cityName) => {
    if (!cityName) return;

    try {
      setLoading(true);
      setError(null);
      setApiStatus('loading');

      // API 사용 설정 확인
      if (!API_SETTINGS.USE_PUBLIC_DATA_API) {
        console.log('⚠️ API 사용 비활성화됨 - 더미데이터 사용');
        setEvents(getFallbackEvents(cityName));
        setApiStatus('fallback');
        setLoading(false);
        return;
      }

      // API 키 확인
      if (!PUBLIC_DATA_API_KEY) {
        console.log('❌ API 키가 없음 - 더미데이터 사용');
        setEvents(getFallbackEvents(cityName));
        setApiStatus('fallback');
        setError('API 키가 설정되지 않아 더미데이터를 표시합니다.');
        setLoading(false);
        return;
      }

      console.log('🎯 공공데이터포털 행사정보 API 호출 시작');
      console.log('📍 선택된 도시:', cityName);
      console.log('🔑 API 키 상태:', checkApiKeys());
      console.log('🌍 현재 환경:', import.meta.env.DEV ? '개발' : '프로덕션');

      // 여러 행사정보 API를 순차적으로 시도하여 최대한 많은 데이터 수집
      const apiEndpoints = [
        {
          name: '축제정보',
          url: PUBLIC_DATA_ENDPOINTS.FESTIVAL_SEARCH,
          params: { 
            serviceKey: PUBLIC_DATA_API_KEY,
            MobileOS: 'ETC',
            MobileApp: '갈래말래날씨여행',
            _type: 'json',
            numOfRows: '20',
            pageNo: '1',
            eventStartDate: '20250101',
            eventEndDate: '20251231'
          }
        },
        {
          name: '행사정보',
          url: PUBLIC_DATA_ENDPOINTS.EVENT_SEARCH,
          params: { 
            serviceKey: PUBLIC_DATA_API_KEY,
            MobileOS: 'ETC',
            MobileApp: '갈래말래날씨여행',
            _type: 'json',
            numOfRows: '20',
            pageNo: '1',
            eventStartDate: '20250101',
            eventEndDate: '20251231'
          }
        },
        {
          name: '문화시설',
          url: PUBLIC_DATA_ENDPOINTS.CULTURAL_SEARCH,
          params: { 
            serviceKey: PUBLIC_DATA_API_KEY,
            MobileOS: 'ETC',
            MobileApp: '갈래말래날씨여행',
            _type: 'json',
            numOfRows: '20',
            pageNo: '1',
            cat1: 'A02'
          }
        }
      ];
      
      let allEvents = [];
      let workingEndpoints = [];

      // 각 API 엔드포인트를 순차적으로 시도
      for (const endpoint of apiEndpoints) {
        try {
          console.log(`🌐 ${endpoint.name} API 시도 중...`);
          
          const params = new URLSearchParams(endpoint.params);
          const fullApiUrl = `${endpoint.url}?${params.toString()}`;
          
          console.log(`📡 ${endpoint.name} API URL:`, fullApiUrl);
          
          const response = await fetch(fullApiUrl);
          console.log(`📊 ${endpoint.name} API 응답 상태:`, response.status, response.statusText);
          
          if (response.ok) {
            const data = await response.json();
            console.log(`✅ ${endpoint.name} API 응답 성공:`, data);
            
            // 응답 구조 분석 및 데이터 추출
            let records = [];
            
            if (data && data.response && data.response.body) {
              const body = data.response.body;
              console.log(`📋 ${endpoint.name} 응답 body 구조:`, Object.keys(body));
              
              if (body.items) {
                if (Array.isArray(body.items.item)) {
                  records = body.items.item;
                } else if (body.items.item) {
                  records = [body.items.item];
                } else if (Array.isArray(body.items)) {
                  records = body.items;
                }
              }
              
              console.log(`📊 ${endpoint.name}에서 ${records.length}개 데이터 발견`);
              
              if (records.length > 0) {
                console.log(`🔍 ${endpoint.name} 첫 번째 레코드:`, records[0]);
                
                // 데이터 처리 및 변환
                const processedEvents = records.map(event => ({
                  id: event.contentId || event.contentid || event.id || Math.random().toString(),
                  title: event.title || event.eventstartdate || event.eventenddate || event.name || event.facltNm || '제목 없음',
                  addr1: event.addr1 || event.address || event.addr,
                  addr2: event.addr2 || event.addrDetail || event.addr_detail,
                  areaName: event.areaName || event.area || event.areaNm || event.area_name,
                  areaCode: event.areaCode || event.areaCd || event.area_code,
                  date: event.eventstartdate || event.eventenddate || event.eventStartDate || event.eventEndDate || 
                        event.startDate || event.endDate || event.date || '날짜 정보 없음',
                  description: event.overview || event.description || event.content || event.detail || 
                             event.intro || event.summary || event.detailInfo || '상세 정보 없음',
                  category: event.cat1 || event.cat2 || event.cat3 || event.category || event.cat || '행사정보',
                  tel: event.tel || event.phone || event.telephone || '',
                  homepage: event.homepage || event.url || event.website || '',
                  imageUrl: event.imageUrl || event.image || event.img || event.firstimage || event.firstImage || '',
                  source: `${endpoint.name} API`,
                  location: event.addr1 || event.addr2 || event.areaName || '위치 정보 없음'
                }));
                
                allEvents = [...allEvents, ...processedEvents];
                workingEndpoints.push(endpoint.name);
                console.log(`✅ ${endpoint.name}에서 ${processedEvents.length}개 데이터 처리 완료`);
              }
            }
          } else {
            console.log(`❌ ${endpoint.name} API 호출 실패:`, response.status, response.statusText);
            
            // 에러 응답 내용 확인
            try {
              const errorData = await response.text();
              console.log(`🚨 ${endpoint.name} 에러 응답 내용:`, errorData);
            } catch (e) {
              console.log(`🚨 ${endpoint.name} 에러 응답 내용을 읽을 수 없음`);
            }
          }
        } catch (endpointError) {
          console.error(`❌ ${endpoint.name} API 호출 중 오류:`, endpointError);
          continue;
        }
      }

      // 중복 제거 및 정렬
      const uniqueEvents = allEvents
        .filter((event, index, self) => 
          index === self.findIndex(e => e.id === event.id)
        )
        .slice(0, 50); // 최대 50개 표시

      console.log('📊 총 수집된 데이터 수:', allEvents.length);
      console.log('🔄 중복 제거 후 데이터 수:', uniqueEvents.length);
      console.log('✅ 작동한 API 엔드포인트들:', workingEndpoints);
      
      if (uniqueEvents.length > 0) {
        setEvents(uniqueEvents);
        setError(null);
        setApiStatus('success');
        console.log('🎉 공공데이터 API에서 행사정보를 성공적으로 가져왔습니다!');
        console.log('📊 최종 표시할 행사 수:', uniqueEvents.length);
      } else {
        console.log('⚠️ API에서 행사정보를 찾을 수 없음 - 더미데이터 사용');
        setEvents(getFallbackEvents(cityName));
        setApiStatus('fallback');
        setError('공공데이터 API에서 행사정보를 가져올 수 없어 더미데이터를 표시합니다.');
      }
      
    } catch (err) {
      console.error('❌ 전체 함수 오류:', err);
      setError(`행사정보를 가져올 수 없습니다: ${err.message}`);
      setEvents(getFallbackEvents(cityName));
      setApiStatus('fallback');
    } finally {
      setLoading(false);
    }
  };

  // 행사 카테고리별 아이콘
  const getCategoryIcon = (category) => {
    const categoryMap = {
      // 한국관광공사 API 카테고리별 아이콘
      'A01': '🏛️', // 문화관광
      'A02': '🎭', // 레저/스포츠
      'A03': '🍽️', // 음식
      'A04': '🛏️', // 숙박
      'A05': '🛍️', // 쇼핑
      'A06': '🚗', // 교통
      'A07': '🏥', // 의료
      'A08': '🏢', // 기타
      
      // 축제/행사 관련
      '축제': '🎉', 'festival': '🎉',
      '문화': '🏛️', 'culture': '🏛️',
      '전시': '🎨', 'exhibition': '🎨',
      '공연': '🎭', 'performance': '🎭',
      '체험': '🎯', 'experience': '🎯',
      '교육': '📚', 'education': '📚',
      '관광': '🗺️', 'tourism': '🗺️',
      '레저': '🏄', 'leisure': '🏄',
      '스포츠': '⚽', 'sports': '⚽',
      '음식': '🍽️', 'food': '🍽️',
      '쇼핑': '🛍️', 'shopping': '🛍️',
      '숙박': '🛏️', 'accommodation': '🛏️',
      '교통': '🚗', 'transportation': '🚗',
      '의료': '🏥', 'medical': '🏥',
      '기타': '🎪', 'etc': '🎪'
    };
    
    // 카테고리 코드가 있으면 해당 아이콘, 없으면 텍스트 기반 아이콘
    return categoryMap[category] || categoryMap[category?.substring(0, 3)] || '🎪';
  };

  // 카테고리명을 사용자 친화적으로 변환
  const getCategoryName = (category) => {
    const categoryNames = {
      'A01': '문화관광',
      'A02': '레저/스포츠',
      'A03': '음식',
      'A04': '숙박',
      'A05': '쇼핑',
      'A06': '교통',
      'A07': '의료',
      'A08': '기타',
      'festival': '축제',
      'culture': '문화',
      'exhibition': '전시',
      'performance': '공연',
      'experience': '체험',
      'education': '교육',
      'tourism': '관광',
      'leisure': '레저',
      'sports': '스포츠',
      'food': '음식',
      'shopping': '쇼핑',
      'accommodation': '숙박',
      'transportation': '교통',
      'medical': '의료',
      'etc': '기타'
    };
    
    return categoryNames[category] || category || '관광정보';
  };

  // 날짜 정보를 사용자 친화적으로 변환
  const formatDate = (dateString) => {
    if (!dateString) return '날짜 정보 없음';
    
    try {
      // YYYYMMDD 형식인 경우
      if (dateString.length === 8 && /^\d{8}$/.test(dateString)) {
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        return `${year}년 ${month}월 ${day}일`;
      }
      
      // 이미 포맷된 문자열인 경우
      if (dateString.includes('년') || dateString.includes('월')) {
        return dateString;
      }
      
      // 기타 형식
      return dateString;
    } catch (error) {
      return dateString || '날짜 정보 없음';
    }
  };

  // 위치 정보를 정리
  const formatLocation = (addr1, addr2, areaName) => {
    if (addr1 && addr2) {
      return `${addr1} ${addr2}`;
    } else if (addr1) {
      return addr1;
    } else if (addr2) {
      return addr2;
    } else if (areaName) {
      return areaName;
    }
    return '위치 정보 없음';
  };

  // 컴포넌트 마운트 시 더미데이터 표시
  useEffect(() => {
    if (selectedCity) {
      // 먼저 더미데이터를 보여주고, 그 다음 API 시도
      setEvents(getFallbackEvents(selectedCity));
      setApiStatus('fallback');
      
      // 잠시 후 API 시도
      setTimeout(() => {
        fetchEvents(selectedCity);
      }, 1000);
    }
  }, [selectedCity]);

  if (!selectedCity) {
    return (
      <div className="events">
        <div className="events-header">
          <h3>🎪 행사 정보</h3>
          <p>위치를 선택하면 해당 지역의 행사 정보를 확인할 수 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="events">
      <div className="events-header">
        <h3>🎉 행사정보 서비스</h3>
        <div className="location-info">
          <span className="selected-city">📍 {selectedCity}</span>
          <span className="search-region">🔍 전국 행사 정보</span>
        </div>
        <div className="api-status">
          <span className={`status-indicator ${apiStatus === 'success' ? 'active' : apiStatus === 'fallback' ? 'warning' : 'inactive'}`}>
            {apiStatus === 'success' ? '🟢 공공데이터 API 성공' : 
             apiStatus === 'fallback' ? '🟡 더미데이터 사용' : 
             apiStatus === 'loading' ? '🔄 API 호출 중' : '🔴 API 비활성화'}
          </span>
          <span className={`status-indicator environment ${import.meta.env.DEV ? 'dev' : 'prod'}`}>
            🌍 {import.meta.env.DEV ? '개발환경' : '프로덕션'}
          </span>
          {import.meta.env.DEV && !API_SETTINGS.USE_PUBLIC_DATA_API && (
            <span className="status-indicator dev-note">
              💡 .env 파일에 API 키를 설정하면 실데이터를 확인할 수 있습니다
            </span>
          )}
          {import.meta.env.DEV && API_SETTINGS.USE_PUBLIC_DATA_API && (
            <span className="status-indicator dev-success">
              ✅ 로컬에서 실데이터 API 사용 중
            </span>
          )}
        </div>
        <button 
          className="refresh-btn"
          onClick={() => fetchEvents(selectedCity)}
          disabled={loading}
        >
          {loading ? '🔄' : '🔄'} 새로고침
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="loading-spinner">🔄</div>
          <p>공공데이터 API에서 행사정보를 가져오는 중...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <div className="error-header">
            <span className="error-icon">🚨</span>
            <h4>API 연결 상태</h4>
          </div>
          <p className="error-details">{error}</p>
          <p className="error-note">
            {apiStatus === 'fallback' 
              ? '더미데이터를 표시하고 있습니다. 공공데이터 API 연결을 시도해보세요.' 
              : '공공데이터포털 API 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.'}
          </p>
          <div className="error-actions">
            <button 
              className="retry-api-btn"
              onClick={() => {
                setError(null);
                fetchEvents(selectedCity);
              }}
            >
              🔄 API 재시도
            </button>
            <button 
              className="error-close-btn"
              onClick={() => setError(null)}
            >
              ✕ 닫기
            </button>
          </div>
        </div>
      )}

      {/* 데이터가 있을 때 - 정상적으로 행사 정보 표시 */}
      {!loading && events.length > 0 && (
        <div className="events-list">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <span className="event-category">
                  {getCategoryIcon(event.category)} {getCategoryName(event.category)}
                </span>
                <h4 className="event-title">{event.title}</h4>
                {event.source && (
                  <span className={`event-source ${event.source === '더미데이터' ? 'dummy-data' : 'api-data'}`}>
                    📡 {event.source}
                  </span>
                )}
              </div>
              
              <div className="event-details">
                <p className="event-location">📍 {formatLocation(event.addr1, event.addr2, event.areaName)}</p>
                <p className="event-date">📅 {formatDate(event.date)}</p>
                {event.description && (
                  <p className="event-description">{event.description}</p>
                )}
                
                {/* 추가 정보 표시 */}
                <div className="event-additional-info">
                  {event.contentId && (
                    <span className="event-id">🆔 ID: {event.contentId}</span>
                  )}
                  {event.areaCode && (
                    <span className="event-area-code">🏷️ 지역코드: {event.areaCode}</span>
                  )}
                  {event.tel && (
                    <span className="event-tel">📞 {event.tel}</span>
                  )}
                  {event.homepage && (
                    <span className="event-homepage">
                      🌐 <a href={event.homepage} target="_blank" rel="noopener noreferrer">홈페이지</a>
                    </span>
                  )}
                </div>
                
                {/* 이미지가 있는 경우 표시 */}
                {event.imageUrl && (
                  <div className="event-image">
                    <img src={event.imageUrl} alt={event.title} onError={(e) => {
                      e.target.style.display = 'none';
                    }} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
