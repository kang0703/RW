import { useState, useEffect } from 'react';
import { API_KEYS, API_ENDPOINTS, PUBLIC_DATA_API_KEY, PUBLIC_DATA_ENDPOINTS, API_SETTINGS } from '../../config/api';
import './Events.scss';

const Events = ({ selectedCity }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapPopup, setMapPopup] = useState({ isOpen: false, location: '', coordinates: null });

  // 카카오맵 팝업 열기
  const openMapPopup = (location) => {
    console.log('🗺️ 지도 팝업 열기 시도:', location);
    
    // 카카오맵 API가 로드되었는지 확인
    if (!window.kakao) {
      console.error('❌ 카카오맵 API가 로드되지 않았습니다.');
      alert('지도 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    
    if (!window.kakao.maps) {
      console.error('❌ 카카오맵 객체가 초기화되지 않았습니다.');
      alert('지도 서비스 초기화에 실패했습니다. 페이지를 새로고침해주세요.');
      return;
    }

    try {
      // 주소를 좌표로 변환
      const geocoder = new window.kakao.maps.services.Geocoder();
      console.log('🔍 주소 검색 시작:', location);
      
      geocoder.addressSearch(location, (result, status) => {
        console.log('🔍 주소 검색 결과:', status, result);
        
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          console.log('✅ 좌표 변환 성공:', coords);
          
          setMapPopup({
            isOpen: true,
            location: location,
            coordinates: coords
          });
        } else {
          console.warn('⚠️ 좌표 변환 실패, 기본 좌표 사용:', status);
          
          // 기본 좌표 사용 (서울 시청 기준)
          const defaultCoords = new window.kakao.maps.LatLng(37.5665, 126.9780);
          setMapPopup({
            isOpen: true,
            location: location,
            coordinates: defaultCoords
          });
        }
      });
    } catch (error) {
      console.error('❌ 지도 팝업 열기 오류:', error);
      alert('지도를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  // 카카오맵 팝업 닫기
  const closeMapPopup = () => {
    setMapPopup({ isOpen: false, location: '', coordinates: null });
  };

  // 카카오맵 API 로드
  useEffect(() => {
    const loadKakaoMap = () => {
      // 이미 로드되었는지 확인
      if (window.kakao && window.kakao.maps) {
        console.log('🎉 카카오맵 API가 이미 로드되어 있습니다.');
        return;
      }

      // 기존 스크립트가 있는지 확인
      const existingScript = document.querySelector('script[src*="kakao"]');
      if (existingScript) {
        console.log('카카오맵 스크립트가 이미 로드 중입니다.');
        return;
      }

      console.log('🗺️ 카카오맵 API 로드 시작...');
      
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${API_KEYS.KAKAO_MAP}&libraries=services`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('🎉 카카오맵 API 스크립트 로드 완료!');
        
        // 카카오맵 초기화 대기
        setTimeout(() => {
          if (window.kakao && window.kakao.maps) {
            console.log('✅ 카카오맵 객체 초기화 성공');
          } else {
            console.error('❌ 카카오맵 객체 초기화 실패');
          }
        }, 100);
      };
      
      script.onerror = (error) => {
        console.error('❌ 카카오맵 API 스크립트 로드 실패:', error);
        console.error('API 키 확인 필요:', API_KEYS.KAKAO_MAP);
      };
      
      // 스크립트를 head에 추가
      document.head.appendChild(script);
      
      // 타임아웃 설정 (15초 후 실패 처리)
      setTimeout(() => {
        if (!window.kakao || !window.kakao.maps) {
          console.error('⏰ 카카오맵 API 로드 타임아웃');
          console.error('네트워크 연결과 API 키를 확인해주세요.');
        }
      }, 15000);
    };

    // API 설정 확인 후 로드
    if (API_SETTINGS.USE_KAKAO_MAP_API && API_KEYS.KAKAO_MAP) {
      console.log('🗺️ 카카오맵 API 설정 확인됨, 로드 시작...');
      loadKakaoMap();
    } else {
      console.warn('⚠️ 카카오맵 API가 비활성화되어 있거나 API 키가 없습니다.');
      console.warn('API_SETTINGS.USE_KAKAO_MAP_API:', API_SETTINGS.USE_KAKAO_MAP_API);
      console.warn('API_KEYS.KAKAO_MAP:', API_KEYS.KAKAO_MAP ? '설정됨' : '설정되지 않음');
    }
  }, []);

  // 공공데이터포털에서 지역별 행사 정보 가져오기
  const fetchEvents = async (cityName) => {
    if (!cityName) return;

    try {
      setLoading(true);
      setError(null);

      // API 사용 설정 확인
      if (!API_SETTINGS.USE_PUBLIC_DATA_API) {
        console.log('API 사용 비활성화됨 - 더미데이터 사용');
        setEvents(getFallbackEvents(cityName));
        setLoading(false);
        return;
      }

      console.log('공공데이터포털 API 호출 시작:', cityName);

      // 공공데이터포털 실제로 작동하는 API 엔드포인트들
      const apiEndpoints = [
        // 한국관광공사 축제정보 검색 API (실제로 작동하는 API)
        'https://apis.data.go.kr/B551011/KorService2/searchFestival',
        // 한국관광공사 지역정보 검색 API
        'https://apis.data.go.kr/B551011/KorService2/areaCode',
        // 한국관광공사 관광지 검색 API
        'https://apis.data.go.kr/B551011/KorService2/searchStay'
      ];
      
      let allEvents = [];
      let workingEndpoint = null;

      // 각 API 엔드포인트를 순차적으로 시도하여 행사 정보 수집
      for (const endpoint of apiEndpoints) {
        try {
          // 한국관광공사 API 파라미터 설정 (실제 API 스펙에 맞춤)
          const params = new URLSearchParams({
            serviceKey: PUBLIC_DATA_API_KEY,
            numOfRows: '20',
            pageNo: '1',
            MobileOS: 'ETC',
            MobileApp: '갈래말래날씨여행',
            _type: 'json'
          });
          
          const fullApiUrl = `${endpoint}?${params.toString()}`;
          console.log('API 엔드포인트 시도:', endpoint);
          
          // REST API 호출
          const response = await fetch(fullApiUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          
          console.log(`API 응답 상태: ${endpoint} - ${response.status} ${response.statusText}`);
          
          if (response.ok) {
            const data = await response.json();
            console.log('API 응답 성공:', endpoint);
            
            // 한국관광공사 API 응답 구조 분석 및 데이터 추출
            let records = [];
            if (data && data.response && data.response.body && data.response.body.items) {
              records = data.response.body.items.item || data.response.body.items;
              console.log('response.body.items에서 데이터 발견:', records.length);
            } else if (data && data.response && data.response.body && data.response.body.areaCode) {
              records = data.response.body.areaCode.item || data.response.body.areaCode;
              console.log('지역코드 데이터 발견:', records.length);
            } else if (data && data.response && data.response.body && data.response.body.searchStay) {
              records = data.response.body.searchStay.item || data.response.body.searchStay;
              console.log('관광지 데이터 발견:', records.length);
            } else {
              console.log('API 응답 구조:', Object.keys(data || {}));
              if (data && data.response) {
                console.log('response 구조:', Object.keys(data.response));
                if (data.response.body) {
                  console.log('body 구조:', Object.keys(data.response.body));
                }
              }
              continue; // 데이터가 없으면 다음 API 시도
            }
            
            if (records && records.length > 0) {
              // 선택된 도시와 관련된 행사만 필터링
              const cityEvents = records
                .filter(event => {
                  // 한국관광공사 API 필드명 사용
                  const eventRegion = event.addr1 || event.addr2 || event.areaName || event.areaCode || '';
                  if (!eventRegion) return false;
                  
                  const cityNameLower = cityName.toLowerCase();
                  const eventRegionLower = eventRegion.toString().toLowerCase();
                  
                  return eventRegionLower.includes(cityNameLower) || 
                         cityNameLower.includes(eventRegionLower.split(' ')[0]) ||
                         eventRegionLower.includes(cityNameLower.split(' ')[0]);
                })
                .map(event => ({
                  id: event.contentId || event.contentid || event.id || Math.random().toString(),
                  title: event.title || event.eventstartdate || event.eventenddate || '제목 없음',
                  location: event.addr1 || event.addr2 || event.areaName || '위치 정보 없음',
                  date: event.eventstartdate || event.eventenddate || event.eventstartdate + ' ~ ' + event.eventenddate || '날짜 정보 없음',
                  description: event.overview || event.description || event.content || '상세 정보 없음',
                  category: event.cat1 || event.cat2 || event.cat3 || '관광정보',
                  source: endpoint.split('/').pop() // API 출처 표시
                }));
              
              if (cityEvents.length > 0) {
                allEvents = [...allEvents, ...cityEvents];
                workingEndpoint = endpoint;
                console.log(`${endpoint}에서 ${cityEvents.length}개 행사 발견`);
              }
            }
          } else {
            console.log(`API 엔드포인트 실패: ${endpoint} - ${response.status} ${response.statusText}`);
            // 응답 내용 확인
            try {
              const errorData = await response.text();
              console.log('에러 응답 내용:', errorData);
            } catch (e) {
              console.log('에러 응답 내용을 읽을 수 없음');
            }
          }
        } catch (endpointError) {
          console.log(`API 엔드포인트 오류: ${endpoint} - ${endpointError.message}`);
          continue;
        }
      }

      // 중복 제거 및 정렬
      const uniqueEvents = allEvents
        .filter((event, index, self) => 
          index === self.findIndex(e => e.id === event.id)
        )
        .slice(0, 15); // 최대 15개 표시

      console.log('총 수집된 행사 수:', allEvents.length);
      console.log('중복 제거 후 행사 수:', uniqueEvents.length);
      
      if (uniqueEvents.length > 0) {
        setEvents(uniqueEvents);
        setError(null);
        console.log('🎉 공공데이터포털 API에서 행사 정보를 성공적으로 가져왔습니다!');
        console.log('사용된 엔드포인트:', workingEndpoint);
      } else {
        console.log('해당 지역의 행사 데이터를 찾을 수 없음, 대체 데이터 표시');
        setEvents(getFallbackEvents(cityName));
      }
    } catch (err) {
      console.error('행사 정보 가져오기 오류:', err);
      setError(`행사 정보를 가져올 수 없습니다: ${err.message}`);
      // 에러 발생 시에도 대체 데이터 제공
      setEvents(getFallbackEvents(cityName));
    } finally {
      setLoading(false);
    }
  };

  // API 실패 시 대체 데이터 제공 (더미데이터)
  const getFallbackEvents = (cityName) => {
    const fallbackEvents = {
      '서울': [
        { id: '1', title: '서울 등불축제', location: '서울특별시', date: '2024년 연중', description: '서울의 아름다운 등불을 감상할 수 있는 축제', category: '축제' },
        { id: '2', title: '서울 국제영화제', location: '서울특별시', date: '2024년 10월', description: '아시아 최대 규모의 영화제', category: '축제' },
        { id: '3', title: '서울 봄꽃축제', location: '서울특별시', date: '2024년 3-4월', description: '여의도와 남산의 아름다운 봄꽃을 감상하는 축제', category: '축제' },
        { id: '4', title: '서울 한류문화축제', location: '서울특별시', date: '2024년 8월', description: 'K-POP과 한류 문화를 체험하는 축제', category: '문화' },
        { id: '5', title: '서울 디자인페어', location: '서울특별시', date: '2024년 11월', description: '국제 디자인 전시회', category: '전시' }
      ],
      '부산': [
        { id: '6', title: '부산국제영화제', location: '부산광역시', date: '2024년 10월', description: '아시아 최고의 영화제', category: '축제' },
        { id: '7', title: '부산 해운대 모래축제', location: '부산광역시', date: '2024년 7월', description: '해운대 해변에서 즐기는 모래 예술 축제', category: '축제' },
        { id: '8', title: '부산 불꽃축제', location: '부산광역시', date: '2024년 10월', description: '부산항에서 펼쳐지는 화려한 불꽃쇼', category: '축제' },
        { id: '9', title: '부산 국제공연예술제', location: '부산광역시', date: '2024년 9월', description: '세계적인 공연예술 축제', category: '공연' },
        { id: '10', title: '부산 해양문화축제', location: '부산광역시', date: '2024년 6월', description: '부산의 해양문화를 체험하는 축제', category: '문화' }
      ],
      '제주': [
        { id: '11', title: '제주 한라문화제', location: '제주특별자치도', date: '2024년 9월', description: '제주의 전통문화를 체험할 수 있는 축제', category: '문화' },
        { id: '12', title: '제주 벚꽃축제', location: '제주특별자치도', date: '2024년 3-4월', description: '제주의 아름다운 벚꽃을 감상하는 축제', category: '축제' },
        { id: '13', title: '제주 오렌지축제', location: '제주특별자치도', date: '2024년 11-12월', description: '제주 특산품 오렌지를 체험하는 축제', category: '축제' },
        { id: '14', title: '제주 해녀문화축제', location: '제주특별자치도', date: '2024년 7월', description: '제주 해녀의 전통문화를 체험하는 축제', category: '문화' },
        { id: '15', title: '제주 국제트레킹대회', location: '제주특별자치도', date: '2024년 5월', description: '제주 올레길을 걸으며 즐기는 트레킹 대회', category: '체험' }
      ],
      '경주': [
        { id: '16', title: '경주 세계문화엑스포', location: '경상북도 경주시', date: '2024년 연중', description: '경주의 역사와 문화를 체험할 수 있는 엑스포', category: '문화' },
        { id: '17', title: '경주 벚꽃축제', location: '경상북도 경주시', date: '2024년 3-4월', description: '경주 불국사와 첨성대의 아름다운 벚꽃', category: '축제' },
        { id: '18', title: '경주 신라문화제', location: '경상북도 경주시', date: '2024년 10월', description: '신라의 전통문화를 재현하는 축제', category: '문화' },
        { id: '19', title: '경주 국제마라톤대회', location: '경상북도 경주시', date: '2024년 4월', description: '경주의 아름다운 풍경을 보며 즐기는 마라톤', category: '체험' }
      ],
      '광주': [
        { id: '20', title: '광주 비엔날레', location: '광주광역시', date: '2024년 9-11월', description: '국제 현대미술의 거대한 축제', category: '전시' },
        { id: '21', title: '광주 김치축제', location: '광주광역시', date: '2024년 10월', description: '한국의 전통 김치 문화를 체험하는 축제', category: '문화' },
        { id: '22', title: '광주 국제영화제', location: '광주광역시', date: '2024년 7월', description: '독립영화와 예술영화를 선보이는 영화제', category: '축제' },
        { id: '23', title: '광주 전통공예축제', location: '광주광역시', date: '2024년 5월', description: '전통공예의 아름다움을 체험하는 축제', category: '문화' }
      ],
      '대구': [
        { id: '24', title: '대구 치맥페스티벌', location: '대구광역시', date: '2024년 7월', description: '치킨과 맥주를 즐기는 대구의 대표 축제', category: '축제' },
        { id: '25', title: '대구 국제뮤지컬페스티벌', location: '대구광역시', date: '2024년 8월', description: '세계적인 뮤지컬 공연을 감상하는 축제', category: '공연' },
        { id: '26', title: '대구 국제가요제', location: '대구광역시', date: '2024년 9월', description: '한국 가요의 발전을 위한 국제 가요제', category: '공연' },
        { id: '27', title: '대구 약령시 한방문화축제', location: '대구광역시', date: '2024년 6월', description: '전통 한방문화를 체험하는 축제', category: '문화' }
      ],
      '인천': [
        { id: '28', title: '인천 펜타포트 락 페스티벌', location: '인천광역시', date: '2024년 8월', description: '아시아 최대 규모의 락 페스티벌', category: '축제' },
        { id: '29', title: '인천 국제해양축제', location: '인천광역시', date: '2024년 7월', description: '인천의 해양문화를 체험하는 축제', category: '문화' },
        { id: '30', title: '인천 아시아영화제', location: '인천광역시', date: '2024년 10월', description: '아시아 영화의 다양성을 보여주는 영화제', category: '축제' }
      ],
      '울산': [
        { id: '31', title: '울산 태화강 대공원 벚꽃축제', location: '울산광역시', date: '2024년 3-4월', description: '울산 태화강의 아름다운 벚꽃을 감상하는 축제', category: '축제' },
        { id: '32', title: '울산 국제공예비엔날레', location: '울산광역시', date: '2024년 9-11월', description: '국제 현대공예의 거대한 축제', category: '전시' }
      ]
    };

    // 기본 대체 데이터
    const defaultEvents = [
      { id: 'default1', title: `${cityName} 지역 축제`, location: cityName, date: '2024년 연중', description: `${cityName} 지역의 다양한 축제와 행사를 확인해보세요`, category: '축제' },
      { id: 'default2', title: `${cityName} 문화행사`, location: cityName, date: '2024년 연중', description: `${cityName}에서 진행되는 문화행사와 전시회를 찾아보세요`, category: '문화' }
    ];

    return fallbackEvents[cityName] || defaultEvents;
  };

  useEffect(() => {
    if (selectedCity) {
      fetchEvents(selectedCity);
    }
  }, [selectedCity]);

  // 행사 카테고리별 아이콘
  const getCategoryIcon = (category) => {
    const categoryMap = {
      '축제': '🎉',
      '전시': '🎨',
      '공연': '🎭',
      '체험': '🎯',
      '교육': '📚',
      '문화': '🏛️',
      '기타': '🎪'
    };
    return categoryMap[category] || '🎪';
  };

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
        <h3>🎪 {selectedCity} 행사 정보</h3>
        <div className="api-status">
          <span className={`status-indicator ${API_SETTINGS.USE_PUBLIC_DATA_API ? 'active' : 'inactive'}`}>
            {API_SETTINGS.USE_PUBLIC_DATA_API ? '🟢 API 활성화' : '🔴 API 비활성화'}
          </span>
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
          <p>행사 정보를 가져오는 중...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <div className="error-header">
            <span className="error-icon">🚨</span>
            <h4>공공데이터 API 연결 오류</h4>
          </div>
          <p className="error-details">{error}</p>
          <p className="error-note">공공데이터포털 API 연결에 문제가 있어 미리 준비된 행사 정보를 표시하고 있습니다.</p>
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
              className="use-fallback-btn"
              onClick={() => {
                setError(null);
                setEvents(getFallbackEvents(selectedCity));
              }}
            >
              📋 기본 정보 사용
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

      {/* API 에러가 없고 데이터가 없을 때 - 실제로 행사가 없는 경우 */}
      {!loading && !error && events.length === 0 && (
        <div className="no-events">
          <div className="no-events-header">
            <span className="no-events-icon">🔍</span>
            <h4>행사 정보를 찾을 수 없습니다</h4>
          </div>
          <p className="no-events-message">😔 해당 지역의 행사 정보가 없습니다.</p>
          <p className="no-events-note">다른 지역을 선택하거나 나중에 다시 시도해보세요.</p>
          <div className="no-events-actions">
            <button 
              className="retry-api-btn"
              onClick={() => fetchEvents(selectedCity)}
            >
              🔄 API 재시도
            </button>
          </div>
        </div>
      )}

      {/* API 에러가 없고 데이터가 있을 때 - 정상적으로 행사 정보 표시 */}
      {!loading && !error && events.length > 0 && (
        <div className="events-list">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <span className="event-category">
                  {getCategoryIcon(event.category)} {event.category}
                </span>
                <h4 className="event-title">{event.title}</h4>
                {event.source && (
                  <span className="event-source">
                    📡 {event.source}
                  </span>
                )}
              </div>
              
              <div className="event-details">
                <p className="event-location">📍 {event.location}</p>
                <p className="event-date">📅 {event.date}</p>
                {event.description && (
                  <p className="event-description">{event.description}</p>
                )}
              </div>

              {/* 지도보기 버튼 추가 */}
              <div className="event-actions">
                <button 
                  className="map-btn"
                  onClick={() => openMapPopup(event.location)}
                  disabled={!API_SETTINGS.USE_KAKAO_MAP_API || !window.kakao || !window.kakao.maps}
                  title={!API_SETTINGS.USE_KAKAO_MAP_API ? '카카오맵 API가 비활성화되어 있습니다' : 
                         (!window.kakao || !window.kakao.maps) ? '지도 로딩 중입니다. 잠시 후 시도해주세요' : 
                         '지도에서 위치 확인하기'}
                >
                  🗺️ 지도보기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* API 에러가 있고 데이터가 없을 때 - API 실패로 인한 대체 데이터 표시 */}
      {!loading && error && events.length === 0 && (
        <div className="fallback-data">
          <div className="fallback-header">
            <span className="fallback-icon">📋</span>
            <h4>기본 행사 정보</h4>
          </div>
          <p className="fallback-message">공공데이터 API 연결에 문제가 있어 미리 준비된 기본 행사 정보를 표시합니다.</p>
          <div className="fallback-actions">
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
              ✕ 에러 메시지 닫기
            </button>
          </div>
        </div>
      )}

      {/* 카카오맵 팝업 */}
      {mapPopup.isOpen && (
        <div className="map-popup-overlay" onClick={closeMapPopup}>
          <div className="map-popup" onClick={(e) => e.stopPropagation()}>
            <div className="map-popup-header">
              <h4>🗺️ {mapPopup.location} 지도</h4>
              <button className="map-popup-close" onClick={closeMapPopup}>
                ✕
              </button>
            </div>
            <div className="map-popup-content">
              {mapPopup.coordinates ? (
                <div 
                  id="kakao-map" 
                  className="kakao-map-container"
                  style={{ width: '100%', height: '400px' }}
                >
                  {/* 카카오맵이 여기에 렌더링됩니다 */}
                </div>
              ) : (
                <div className="map-loading">
                  <div className="loading-spinner">🗺️</div>
                  <p>지도를 불러오는 중...</p>
                  <p className="map-loading-note">카카오맵 API 로드에 시간이 걸릴 수 있습니다.</p>
                </div>
              )}
              
              {/* 카카오맵 API 상태 표시 */}
              {!window.kakao || !window.kakao.maps ? (
                <div className="map-api-status">
                  <p className="status-warning">⚠️ 카카오맵 API가 로드되지 않았습니다.</p>
                  <p className="status-note">지도 기능을 사용하려면 페이지를 새로고침해주세요.</p>
                  <button 
                    className="retry-btn"
                    onClick={() => window.location.reload()}
                  >
                    🔄 페이지 새로고침
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* 카카오맵 렌더링을 위한 useEffect */}
      {mapPopup.isOpen && mapPopup.coordinates && window.kakao && window.kakao.maps && (
        <KakaoMapRenderer 
          coordinates={mapPopup.coordinates}
          location={mapPopup.location}
        />
      )}
    </div>
  );
};

// 카카오맵 렌더링 컴포넌트
const KakaoMapRenderer = ({ coordinates, location }) => {
  useEffect(() => {
    console.log('🗺️ 카카오맵 렌더링 시작:', coordinates, location);
    
    // 카카오맵 API 상태 재확인
    if (!window.kakao || !window.kakao.maps) {
      console.error('❌ 카카오맵 API가 로드되지 않았습니다.');
      return;
    }
    
    if (!coordinates) {
      console.error('❌ 좌표 정보가 없습니다.');
      return;
    }

    // 지도 컨테이너가 준비될 때까지 대기
    const waitForContainer = () => {
      const container = document.getElementById('kakao-map');
      if (!container) {
        console.log('⏳ 지도 컨테이너 대기 중...');
        setTimeout(waitForContainer, 100);
        return;
      }

      try {
        console.log('✅ 지도 컨테이너 발견, 지도 생성 시작...');
        
        const options = {
          center: coordinates,
          level: 3
        };

        const map = new window.kakao.maps.Map(container, options);
        console.log('✅ 카카오맵 생성 완료');

        // 마커 추가
        const marker = new window.kakao.maps.Marker({
          position: coordinates
        });

        marker.setMap(map);
        console.log('✅ 마커 추가 완료');

        // 인포윈도우 추가
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;font-size:12px;text-align:center;"><strong>${location}</strong></div>`
        });

        infowindow.open(map, marker);
        console.log('✅ 인포윈도우 추가 완료');
        
      } catch (error) {
        console.error('❌ 카카오맵 렌더링 오류:', error);
      }
    };

    // 컨테이너 준비 확인 시작
    waitForContainer();
    
  }, [coordinates, location]);

  return null;
};

export default Events;
