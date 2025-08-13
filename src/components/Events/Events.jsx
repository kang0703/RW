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
    // 카카오맵 API가 로드되었는지 확인
    if (window.kakao && window.kakao.maps) {
      // 주소를 좌표로 변환
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(location, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          setMapPopup({
            isOpen: true,
            location: location,
            coordinates: coords
          });
        } else {
          // 좌표 변환 실패 시 기본 좌표 사용
          setMapPopup({
            isOpen: true,
            location: location,
            coordinates: null
          });
        }
      });
    } else {
      // 카카오맵 API가 로드되지 않은 경우
      alert('지도 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
    }
  };

  // 카카오맵 팝업 닫기
  const closeMapPopup = () => {
    setMapPopup({ isOpen: false, location: '', coordinates: null });
  };

  // 카카오맵 API 로드
  useEffect(() => {
    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        return; // 이미 로드됨
      }

      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${API_KEYS.KAKAO_MAP}&libraries=services`;
      script.async = true;
      script.onload = () => {
        console.log('카카오맵 API 로드 완료');
      };
      script.onerror = () => {
        console.error('카카오맵 API 로드 실패');
      };
      document.head.appendChild(script);
    };

    if (API_SETTINGS.USE_KAKAO_MAP_API) {
      loadKakaoMap();
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

      // 한국관광공사 API 엔드포인트들을 시도하여 API 연결
      const endpoints = [
        // 축제정보 검색 (주요 API)
        PUBLIC_DATA_ENDPOINTS.FESTIVAL_SEARCH,
        // 지역정보 검색
        PUBLIC_DATA_ENDPOINTS.AREA_SEARCH,
        // 관광지 검색
        PUBLIC_DATA_ENDPOINTS.TOURIST_SPOT
      ];

      let response = null;
      let workingEndpoint = null;

      // 각 엔드포인트를 순차적으로 시도
      for (const endpoint of endpoints) {
        try {
          // 한국관광공사 API 파라미터 설정
          const params = new URLSearchParams({
            serviceKey: PUBLIC_DATA_API_KEY,
            numOfRows: '20',
            pageNo: '1',
            MobileOS: 'ETC',
            MobileApp: '갈래말래날씨여행',
            _type: 'json'
          });
          
          const apiUrl = `${endpoint}?${params.toString()}`;
          console.log('한국관광공사 API 엔드포인트 시도:', apiUrl);
          
          // REST API 호출 시 적절한 헤더 설정
          response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'User-Agent': '갈래말래-날씨여행/1.0'
            }
          });
          
          console.log('REST API 응답 상태:', response.status, response.statusText);
          console.log('응답 헤더:', Object.fromEntries(response.headers.entries()));
          
          if (response.ok) {
            workingEndpoint = endpoint;
            console.log('작동하는 REST API 엔드포인트 발견:', endpoint);
            break;
          } else {
            console.log(`엔드포인트 ${endpoint} 응답 실패:`, response.status, response.statusText);
          }
        } catch (endpointError) {
          console.log('REST API 엔드포인트 시도 실패:', endpoint, endpointError.message);
          continue;
        }
      }

      if (!response || !response.ok) {
        console.error('모든 API 엔드포인트 시도 실패');
        throw new Error('공공데이터포털 API 연결에 실패했습니다. 대체 데이터를 표시합니다.');
      }

      const data = await response.json();
      console.log('REST API 응답 데이터:', data);
      
      // 한국관광공사 API 응답 구조 분석 및 데이터 추출
      let records = [];
      if (data && data.response && data.response.body && data.response.body.items) {
        records = data.response.body.items.item || data.response.body.items;
        console.log('한국관광공사 API response.body.items에서 데이터 발견:', records.length);
      } else if (data && data.response && data.response.body && data.response.body.areaCode) {
        records = data.response.body.areaCode.item || data.response.body.areaCode;
        console.log('한국관광공사 API 지역코드 데이터 발견:', records.length);
      } else if (data && data.response && data.response.body && data.response.body.searchStay) {
        records = data.response.body.searchStay.item || data.response.body.searchStay;
        console.log('한국관광공사 API 관광지 데이터 발견:', records.length);
      } else if (data && data.items) {
        records = data.items.item || data.items;
        console.log('items 필드에서 데이터 발견:', records.length);
      } else if (Array.isArray(data)) {
        records = data;
        console.log('직접 배열 형태의 데이터 발견:', records.length);
      } else {
        console.log('한국관광공사 API 응답 구조:', Object.keys(data || {}));
        if (data && data.response) {
          console.log('response 구조:', Object.keys(data.response));
          if (data.response.body) {
            console.log('body 구조:', Object.keys(data.response.body));
          }
        }
      }
      
      if (records && records.length > 0) {
        console.log('총 행사 수:', records.length);
        
        // 선택된 도시와 관련된 행사만 필터링
        const filteredEvents = records
          .filter(event => {
            // 한국관광공사 API 필드명 사용
            const eventRegion = event.addr1 || event.addr2 || event.areaName || event.areaCode || '';
            if (!eventRegion) return false;
            
            const cityNameLower = cityName.toLowerCase();
            const eventRegionLower = eventRegion.toString().toLowerCase();
            
            // 더 정확한 매칭 로직
            return eventRegionLower.includes(cityNameLower) || 
                   cityNameLower.includes(eventRegionLower.split(' ')[0]) ||
                   eventRegionLower.includes(cityNameLower.split(' ')[0]);
          })
          .slice(0, 10) // 최대 10개만 표시
          .map(event => ({
            id: event.contentId || event.contentid || event.id || Math.random().toString(),
            title: event.title || event.eventstartdate || event.eventenddate || '제목 없음',
            location: event.addr1 || event.addr2 || event.areaName || '위치 정보 없음',
            date: event.eventstartdate || event.eventenddate || event.eventstartdate + ' ~ ' + event.eventenddate || '날짜 정보 없음',
            description: event.overview || event.description || event.content || '상세 정보 없음',
            category: event.cat1 || event.cat2 || event.cat3 || '관광정보'
          }));

        console.log('필터링된 행사 수:', filteredEvents.length);
        
        if (filteredEvents.length > 0) {
          setEvents(filteredEvents);
          setError(null); // 성공 시 에러 초기화
          console.log('🎉 공공데이터포털 REST API에서 행사 정보를 성공적으로 가져왔습니다!');
          console.log('사용된 엔드포인트:', workingEndpoint);
          console.log('총 데이터 수:', records.length);
          console.log('필터링된 행사 수:', filteredEvents.length);
        } else {
          console.log('해당 지역의 행사 데이터를 찾을 수 없음, 대체 데이터 표시');
          setEvents(getFallbackEvents(cityName));
        }
      } else {
        console.log('API에서 행사 데이터를 찾을 수 없음, 대체 데이터 표시');
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
          <p>⚠️ {error}</p>
          <p className="error-note">공공데이터포털 API 연결에 문제가 있어 미리 준비된 행사 정보를 표시하고 있습니다.</p>
          <button 
            onClick={() => setError(null)}
            className="error-close-btn"
          >
            닫기
          </button>
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="no-events">
          <p>😔 해당 지역의 행사 정보가 없습니다.</p>
          <p>다른 지역을 선택하거나 나중에 다시 시도해보세요.</p>
        </div>
      )}

      {!loading && events.length > 0 && (
        <div className="events-list">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <span className="event-category">
                  {getCategoryIcon(event.category)} {event.category}
                </span>
                <h4 className="event-title">{event.title}</h4>
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
                  disabled={!API_SETTINGS.USE_KAKAO_MAP_API}
                >
                  🗺️ 지도보기
                </button>
              </div>
            </div>
          ))}
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
                  <p>지도를 불러오는 중...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 카카오맵 렌더링을 위한 useEffect */}
      {mapPopup.isOpen && mapPopup.coordinates && (
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
    if (window.kakao && window.kakao.maps && coordinates) {
      const container = document.getElementById('kakao-map');
      if (container) {
        const options = {
          center: coordinates,
          level: 3
        };

        const map = new window.kakao.maps.Map(container, options);

        // 마커 추가
        const marker = new window.kakao.maps.Marker({
          position: coordinates
        });

        marker.setMap(map);

        // 인포윈도우 추가
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;font-size:12px;">${location}</div>`
        });

        infowindow.open(map, marker);
      }
    }
  }, [coordinates, location]);

  return null;
};

export default Events;
