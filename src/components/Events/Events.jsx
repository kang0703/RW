import { useState, useEffect } from 'react';
import { checkApiKeys } from '../../config/api';
import './Events.scss';

const Events = ({ selectedCity }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 공공데이터 포털 API 키
  const PUBLIC_DATA_API_KEY = 'UxGu0qkZpzkbKj1TkyefegskQ9MNmCQf2gAnEc9yeHLuY6bpBT0CHXbEIu+YebmRqLeV4RoqzgpZbvuOYhnQuQ==';

  // 컴포넌트 마운트 시 API 키 상태 확인
  useEffect(() => {
    checkApiKeys();
  }, []);

  // 더미데이터 생성 함수
  const getFallbackEvents = (regionName) => {
    const fallbackEvents = {
      '서울특별시': [
        { id: 'seoul-1', title: '서울 봄꽃 축제', location: '서울특별시', date: '2024년 4월', description: '서울의 아름다운 봄꽃을 감상할 수 있는 축제입니다.', category: '축제', source: '더미데이터' },
        { id: 'seoul-2', title: '서울 한류 페스티벌', location: '서울특별시', date: '2024년 8월', description: '한류 문화를 체험할 수 있는 대형 페스티벌입니다.', category: '축제', source: '더미데이터' }
      ],
      '경기도': [
        { id: 'gyeonggi-1', title: '경기도 꽃 축제', location: '경기도', date: '2024년 5월', description: '경기도 전역에서 펼쳐지는 다양한 꽃 축제입니다.', category: '축제', source: '더미데이터' },
        { id: 'gyeonggi-2', title: '경기도 전통문화 축제', location: '경기도', date: '2024년 10월', description: '경기도의 전통문화를 체험할 수 있는 축제입니다.', category: '문화', source: '더미데이터' }
      ],
      '강원도': [
        { id: 'gangwon-1', title: '강원도 겨울 축제', location: '강원도', date: '2024년 12월', description: '강원도의 아름다운 겨울 풍경을 즐길 수 있는 축제입니다.', category: '축제', source: '더미데이터' },
        { id: 'gangwon-2', title: '강원도 여름 피서 축제', location: '강원도', date: '2024년 7월', description: '시원한 강원도에서 즐기는 여름 피서 축제입니다.', category: '레저', source: '더미데이터' }
      ],
      '부산광역시': [
        { id: 'busan-1', title: '부산 해변 축제', location: '부산광역시', date: '2024년 7월', description: '부산의 아름다운 해변에서 즐기는 여름 축제입니다.', category: '축제', source: '더미데이터' }
      ],
      '제주특별자치도': [
        { id: 'jeju-1', title: '제주 한라산 등반 축제', location: '제주특별자치도', date: '2024년 6월', description: '제주 한라산을 등반하며 즐기는 자연 축제입니다.', category: '레저', source: '더미데이터' }
      ]
    };
    
    return fallbackEvents[regionName] || [
      { id: 'default-1', title: '지역 행사 정보', location: regionName, date: '2024년', description: `${regionName} 지역의 다양한 축제와 행사 정보를 확인해보세요.`, category: '행사정보', source: '더미데이터' }
    ];
  };

  // 지역별 행사 필터링 함수
  const isInRegion = (address, regionName) => {
    if (!address || !regionName) return false;
    
    const addressStr = address.toString().toLowerCase();
    const regionStr = regionName.toLowerCase();
    
    // 주요 지역명 매칭
    const regionMatches = {
      '서울특별시': '서울', '부산광역시': '부산', '대구광역시': '대구', '인천광역시': '인천',
      '광주광역시': '광주', '대전광역시': '대전', '울산광역시': '울산', '세종특별자치시': '세종',
      '경기도': '경기', '강원도': '강원', '충청북도': '충북', '충청남도': '충남',
      '전라북도': '전북', '전라남도': '전남', '경상북도': '경북', '경상남도': '경남',
      '제주특별자치도': '제주'
    };
    
    for (const [region, match] of Object.entries(regionMatches)) {
      if (regionStr === region || regionStr === region.replace(/특별시|광역시|특별자치시|도/g, '')) {
        return addressStr.includes(match);
      }
    }
    
    return addressStr.includes(regionStr);
  };

  // 도시명을 지역명으로 변환하는 함수
  const getRegionFromCity = (cityName) => {
    const cityToRegion = {
      // 서울특별시
      '서울': '서울특별시', '강남구': '서울특별시', '서초구': '서울특별시', '마포구': '서울특별시',
      '용산구': '서울특별시', '종로구': '서울특별시', '중구': '서울특별시', '성북구': '서울특별시',
      '동대문구': '서울특별시', '광진구': '서울특별시', '성동구': '서울특별시', '강북구': '서울특별시',
      '도봉구': '서울특별시', '노원구': '서울특별시', '은평구': '서울특별시', '서대문구': '서울특별시',
      '강서구': '서울특별시', '양천구': '서울특별시', '구로구': '서울특별시', '금천구': '서울특별시',
      '영등포구': '서울특별시', '동작구': '서울특별시', '관악구': '서울특별시', '송파구': '서울특별시',
      '강동구': '서울특별시',
      
      // 광역시
      '부산': '부산광역시', '대구': '대구광역시', '인천': '인천광역시', '광주': '광주광역시',
      '대전': '대전광역시', '울산': '울산광역시', '세종': '세종특별자치시',
      
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
      '밀양': '경상남도', '양산': '경상남도', '의령': '경상남도', '함안': '경상남도', '창녕': '경상남도',
      '고성': '경상남도', '남해': '경상남도', '하동': '경상남도', '산청': '경상남도', '함양': '경상남도',
      '거창': '경상남도', '합천': '경상남도',
      
      // 제주특별자치도
      '제주': '제주특별자치도', '서귀포': '제주특별자치도'
    };
    
    return cityToRegion[cityName] || cityName;
  };

  // 공공데이터 포털 API 호출 함수
  const fetchEvents = async (regionName) => {
    try {
      setApiStatus('🔍 공공데이터에서 관광정보 검색 중...');
      setLoading(true);
      
      const currentYear = new Date().getFullYear();
              const startDate = `${currentYear}0101`;
        const endDate = `${currentYear}1231`;
        const baseUrl = 'https://apis.data.go.kr/B551011/KorService2';
      

      
      // API 엔드포인트 설정 - 한국관광공사 API의 다양한 서비스 활용
      const endpoints = [
        // 축제 정보
        { 
          url: `${baseUrl}/searchFestival2?serviceKey=${encodeURIComponent(PUBLIC_DATA_API_KEY)}&MobileOS=ETC&MobileApp=갈래말래날씨여행&_type=json&numOfRows=20&pageNo=1&eventStartDate=${startDate}&eventEndDate=${endDate}`, 
          type: '축제',
          category: '축제'
        },
        // 행사 정보
        { 
          url: `${baseUrl}/searchEvent2?serviceKey=${encodeURIComponent(PUBLIC_DATA_API_KEY)}&MobileOS=ETC&MobileApp=갈래말래날씨여행&_type=json&numOfRows=20&pageNo=1&eventStartDate=${startDate}&eventEndDate=${endDate}`, 
          type: '행사',
          category: '행사'
        },
        // 문화시설 정보
        { 
          url: `${baseUrl}/searchCultural2?serviceKey=${encodeURIComponent(PUBLIC_DATA_API_KEY)}&MobileOS=ETC&MobileApp=갈래말래날씨여행&_type=json&numOfRows=20&pageNo=1`, 
          type: '문화시설',
          category: '문화시설'
        }
      ];
      
      const allEvents = [];
      let successCount = 0;
      let errorCount = 0;
      
      // 각 API 엔드포인트 호출
      for (const endpoint of endpoints) {
        try {

          
          const response = await fetch(endpoint.url);

          
          if (!response.ok) {
            console.error(`❌ ${endpoint.type} API 오류:`, response.status, response.statusText);
            errorCount++;
            continue;
          }
          
                      const data = await response.json();
            console.log(` ${endpoint.type} 응답 데이터:`, data); // 디버깅용
            
            const items = data.response?.body?.items?.item;
          
          if (items) {
            const events = Array.isArray(items) ? items : [items];

            
            events.forEach(item => {
              if (item.addr1 && isInRegion(item.addr1, regionName)) {
                // 공통 정보 처리 - API 응답 구조에 맞게 수정
                const eventData = {
                  id: `${endpoint.type}_${item.contentid || item.contentId || Date.now()}`,
                  title: item.title || '제목 없음',
                  description: item.overview || item.description || `${endpoint.type} 정보입니다.`,
                  location: item.addr1 || '위치 정보 없음',
                  date: item.eventstartdate && item.eventenddate 
                    ? `${item.eventstartdate} ~ ${item.eventenddate}` 
                    : '날짜 정보 없음',
                  startDate: item.eventstartdate,
                  endDate: item.eventenddate,
                  imageUrl: item.firstimage || item.firstimage2,
                  type: endpoint.type,
                  category: endpoint.category,
                  source: '공공데이터 포털',
                  contentId: item.contentid || item.contentId,
                  areaCode: item.areacode || item.areaCode,
                  tel: item.tel,
                  homepage: item.homepage
                };

                // 카테고리별 추가 정보 처리
                switch (endpoint.type) {
                  case '축제':
                    eventData.category = '축제';
                    eventData.highlight = item.eventstartdate && item.eventenddate ? '진행중' : '준비중';
                    break;
                  case '행사':
                    eventData.category = '행사';
                    eventData.highlight = item.eventstartdate && item.eventenddate ? '진행중' : '준비중';
                    break;
                  case '문화시설':
                    eventData.category = '문화시설';
                    eventData.highlight = '상시 운영';
                    break;
                }

                allEvents.push(eventData);
                console.log('✅ 이벤트 데이터 추가:', eventData.title); // 디버깅용
              }
            });
            successCount++;
          } else {
            console.warn(`⚠️ ${endpoint.type} 데이터 없음`);
            errorCount++;
          }
        } catch (error) {
          console.error(`❌ ${endpoint.type} API 호출 실패:`, error);
          console.error(`❌ ${endpoint.type} API URL:`, endpoint.url);
          console.error(`❌ ${endpoint.type} 에러 상세:`, {
            name: error.name,
            message: error.message,
            stack: error.stack
          });
          errorCount++;
        }
      }
      

      
      if (allEvents.length > 0) {
        setApiStatus('success');
        setLoading(false);
        return allEvents;
      } else {

        setApiStatus('error');
        setLoading(false);
        setError('공공데이터 API에서 데이터를 가져올 수 없습니다.');
        return null;
      }
      
    } catch (error) {

      setApiStatus('error');
      setLoading(false);
      setError(error.message);
      return null;
    }
  };

  // 유틸리티 함수들
  const getCategoryIcon = (category) => {
    const icons = { 
      '축제': '🎉', '행사': '🎭', '문화시설': '🏛️', '관광지': '🗺️', '음식점': '🍽️', '숙박': '🛏️',
      '전시': '🎨', '공연': '🎪', '체험': '🎯', '교육': '📚', '관광': '🗺️', '레저': '🏄', 
      '스포츠': '⚽', '쇼핑': '🛍️', '교통': '🚗', '의료': '🏥', '기타': '🎪' 
    };
    return icons[category] || '🎪';
  };

  const getCategoryName = (category) => {
    const names = { 
      'festival': '축제', 'event': '행사', 'cultural': '문화시설', 'tourist': '관광지', 
      'restaurant': '음식점', 'accommodation': '숙박', 'exhibition': '전시', 
      'performance': '공연', 'experience': '체험', 'education': '교육', 'tourism': '관광', 
      'leisure': '레저', 'sports': '스포츠', 'food': '음식', 'shopping': '쇼핑', 
      'transportation': '교통', 'medical': '의료', 'etc': '기타' 
    };
    return names[category] || category || '관광정보';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '날짜 정보 없음';
    
    try {
      if (dateString.length === 8 && /^\d{8}$/.test(dateString)) {
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        return `${year}년 ${month}월 ${day}일`;
      }
      return dateString.includes('년') || dateString.includes('월') ? dateString : dateString;
    } catch (error) {
      return dateString || '날짜 정보 없음';
    }
  };

  const formatLocation = (addr1, addr2, areaName) => {
    if (addr1 && addr2) return `${addr1} ${addr2}`;
    if (addr1) return addr1;
    if (addr2) return addr2;
    if (areaName) return areaName;
    return '위치 정보 없음';
  };

  // 카테고리별 필터링
  const filteredEvents = selectedCategory === 'all' ? events : events.filter(event => event.category === selectedCategory);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    if (selectedCity) {
      const regionName = getRegionFromCity(selectedCity);

      
              if (PUBLIC_DATA_API_KEY) {
          const loadEvents = async () => {
            const result = await fetchEvents(regionName);
            
            if (result && result.length > 0) {
              setEvents(result);
              setApiStatus('success');
            } else {
              setEvents(getFallbackEvents(regionName));
              setApiStatus('fallback');
            }
          };
          loadEvents();
        } else {
          setEvents(getFallbackEvents(regionName));
          setApiStatus('fallback');
        }
    }
  }, [selectedCity]);

  if (!selectedCity) {
    return (
      <div className="events">
        <div className="events-header">
          <h3>🗺️ 관광정보</h3>
          <p>위치를 선택하면 해당 지역의 관광정보를 확인할 수 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="events">
      <div className="events-header">
        <h3>🗺️ 공공데이터 관광정보</h3>
        <div className="location-info">
          <span className="selected-city">📍 {selectedCity}</span>
          <span className="search-region">🔍 전국 관광정보</span>
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
          {import.meta.env.DEV && !PUBLIC_DATA_API_KEY && (
            <span className="status-indicator dev-note">
              💡 .env 파일에 VITE_PUBLIC_DATA_API_KEY를 설정하면 실데이터를 확인할 수 있습니다
            </span>
          )}
        </div>
        
        {/* 카테고리 필터 */}
        <div className="category-filter">
          {['all', '축제', '행사', '문화시설'].map(category => (
            <button 
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? '전체' : `${getCategoryIcon(category)} ${category}`}
            </button>
          ))}
        </div>
        
        <button 
          className="refresh-btn"
          onClick={async () => {
            if (selectedCity) {
              const regionName = getRegionFromCity(selectedCity);
              const result = await fetchEvents(regionName);
              if (result) {
                setEvents(result);
                setApiStatus('success');
              } else {
                setEvents(getFallbackEvents(regionName));
                setApiStatus('fallback');
              }
            }
          }}
          disabled={loading}
        >
          {loading ? '🔄' : '🔄'} 새로고침
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="loading-spinner">🔄</div>
          <p>공공데이터 포털에서 관광정보를 가져오는 중...</p>
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
                if (selectedCity) {
                  const regionName = getRegionFromCity(selectedCity);
                  fetchEvents(regionName);
                }
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

      {/* 관광정보 목록 */}
      {!loading && filteredEvents.length > 0 && (
        <div className="events-list">
          {filteredEvents.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <span className="event-category">
                  {getCategoryIcon(event.category)} {getCategoryName(event.category)}
                </span>
                <h4 className="event-title">{event.title}</h4>
                {event.highlight && (
                  <span className="event-highlight">
                    ✨ {event.highlight}
                  </span>
                )}
                {event.source && (
                  <span className={`event-source ${event.source === '더미데이터' ? 'dummy-data' : 'api-data'}`}>
                    📡 {event.source}
                  </span>
                )}
              </div>
              
              <div className="event-details">
                <p className="event-location">📍 {formatLocation(event.location)}</p>
                <p className="event-date">📅 {formatDate(event.date)}</p>
                {event.description && (
                  <p className="event-description">{event.description}</p>
                )}
                
                {/* 추가 정보 표시 */}
                <div className="event-additional-info">
                  {event.contentId && <span className="event-id">🆔 ID: {event.contentId}</span>}
                  {event.areaCode && <span className="event-area-code">🏷️ 지역코드: {event.areaCode}</span>}
                  {event.tel && <span className="event-tel">📞 {event.tel}</span>}
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

      {/* 데이터가 없을 때 */}
      {!loading && filteredEvents.length === 0 && events.length > 0 && (
        <div className="no-events">
          <p>선택한 카테고리에 해당하는 관광정보가 없습니다.</p>
          <button 
            className="show-all-btn"
            onClick={() => setSelectedCategory('all')}
          >
            전체 보기
          </button>
        </div>
      )}

      {/* 전혀 데이터가 없을 때 */}
      {!loading && events.length === 0 && !error && (
        <div className="no-events">
          <p>해당 지역의 관광정보를 찾을 수 없습니다.</p>
          <p>다른 지역을 선택하거나 나중에 다시 시도해주세요.</p>
        </div>
      )}
    </div>
  );
};

export default Events;
