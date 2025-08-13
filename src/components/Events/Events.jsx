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
          category: '문화관광'
        },
        {
          id: 'seoul-2',
          title: '서울 한류 페스티벌',
          location: '서울특별시',
          date: '2024년 8월',
          description: '한류 문화를 체험할 수 있는 대형 페스티벌입니다.',
          category: '문화관광'
        }
      ],
      '경기도': [
        {
          id: 'gyeonggi-1',
          title: '경기도 꽃 축제',
          location: '경기도',
          date: '2024년 5월',
          description: '경기도 전역에서 펼쳐지는 다양한 꽃 축제입니다.',
          category: '문화관광'
        },
        {
          id: 'gyeonggi-2',
          title: '경기도 전통문화 축제',
          location: '경기도',
          date: '2024년 10월',
          description: '경기도의 전통문화를 체험할 수 있는 축제입니다.',
          category: '문화관광'
        }
      ],
      '강원도': [
        {
          id: 'gangwon-1',
          title: '강원도 겨울 축제',
          location: '강원도',
          date: '2024년 12월',
          description: '강원도의 아름다운 겨울 풍경을 즐길 수 있는 축제입니다.',
          category: '레저/스포츠'
        },
        {
          id: 'gangwon-2',
          title: '강원도 여름 피서 축제',
          location: '강원도',
          date: '2024년 7월',
          description: '시원한 강원도에서 즐기는 여름 피서 축제입니다.',
          category: '레저/스포츠'
        }
      ],
      '부산광역시': [
        {
          id: 'busan-1',
          title: '부산 해변 축제',
          location: '부산광역시',
          date: '2024년 7월',
          description: '부산의 아름다운 해변에서 즐기는 여름 축제입니다.',
          category: '레저/스포츠'
        }
      ],
      '제주특별자치도': [
        {
          id: 'jeju-1',
          title: '제주 한라산 등반 축제',
          location: '제주특별자치도',
          date: '2024년 6월',
          description: '제주 한라산을 등반하며 즐기는 자연 축제입니다.',
          category: '레저/스포츠'
        }
      ]
    };
    
    // 지역별 더미데이터가 있으면 반환, 없으면 기본 데이터 반환
    return fallbackEvents[regionName] || [
      {
        id: 'default-1',
        title: '지역 축제 정보',
        location: regionName,
        date: '2024년',
        description: `${regionName} 지역의 다양한 축제와 행사 정보를 확인해보세요.`,
        category: '문화관광'
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
      '창녕': '경상남도', '고성': '경상남도', '남해': '경상남도', '하동': '경상남도', '산청': '경상남도',
      '함양': '경상남도', '거창': '경상남도', '합천': '경상남도',
      
      // 제주특별자치도
      '제주': '제주특별자치도', '서귀포': '제주특별자치도'
    };
    
    return cityToRegion[cityName] || cityName;
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
      console.log('API 키:', API_KEYS.KAKAO_MAP);
      console.log('현재 도메인:', window.location.origin);
      
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${API_KEYS.KAKAO_MAP}&libraries=services&autoload=false`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('🎉 카카오맵 API 스크립트 로드 완료!');
        
        // 카카오맵 초기화
        if (window.kakao) {
          window.kakao.maps.load(() => {
            console.log('✅ 카카오맵 객체 초기화 성공');
          });
        } else {
          console.error('❌ 카카오맵 객체 초기화 실패');
        }
      };
      
      script.onerror = (error) => {
        console.error('❌ 카카오맵 API 스크립트 로드 실패:', error);
        console.error('API 키 확인 필요:', API_KEYS.KAKAO_MAP);
        console.error('도메인 확인 필요:', window.location.origin);
        console.error('HTTPS 환경 확인 필요:', window.location.protocol);
        
        // 대체 방법 시도
        tryAlternativeKakaoMapLoad();
      };
      
      // 스크립트를 head에 추가
      document.head.appendChild(script);
      
      // 타임아웃 설정 (10초 후 실패 처리)
      setTimeout(() => {
        if (!window.kakao || !window.kakao.maps) {
          console.error('⏰ 카카오맵 API 로드 타임아웃');
          console.error('네트워크 연결과 API 키를 확인해주세요.');
          
          // 대체 방법 시도
          tryAlternativeKakaoMapLoad();
        }
      }, 10000);
    };

    // 대체 방법: 다른 방식으로 카카오맵 로드 시도
    const tryAlternativeKakaoMapLoad = () => {
      console.log('🔄 대체 방법으로 카카오맵 로드 시도...');
      
      // 방법 1: autoload=true로 시도
      const script2 = document.createElement('script');
      script2.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${API_KEYS.KAKAO_MAP}&libraries=services&autoload=true`;
      script2.async = true;
      
      script2.onload = () => {
        console.log('🎉 대체 방법으로 카카오맵 API 로드 성공!');
      };
      
      script2.onerror = (error) => {
        console.error('❌ 대체 방법도 실패:', error);
        console.error('카카오맵 API 사용이 불가능합니다.');
      };
      
      document.head.appendChild(script2);
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

      console.log('공공데이터포털 API 호출 시작 - 전체 데이터 수집');

      // 공공데이터포털 실제로 작동하는 API 엔드포인트들 (더 많은 API 추가)
      const apiEndpoints = [
        // 한국관광공사 축제정보 검색 API
        'https://apis.data.go.kr/B551011/KorService2/searchFestival',
        // 한국관광공사 지역정보 검색 API
        'https://apis.data.go.kr/B551011/KorService2/areaCode',
        // 한국관광공사 관광지 검색 API
        'https://apis.data.go.kr/B551011/KorService2/searchStay',
        // 한국관광공사 숙박정보 검색 API
        'https://apis.data.go.kr/B551011/KorService2/searchStay',
        // 한국관광공사 음식점 검색 API
        'https://apis.data.go.kr/B551011/KorService2/searchRestaurant',
        // 한국관광공사 쇼핑 검색 API
        'https://apis.data.go.kr/B551011/KorService2/searchShopping',
        // 한국관광공사 문화시설 검색 API
        'https://apis.data.go.kr/B551011/KorService2/searchCultural',
        // 한국관광공사 레포츠 검색 API
        'https://apis.data.go.kr/B551011/KorService2/searchLeports',
        // 한국관광공사 행사정보 검색 API
        'https://apis.data.go.kr/B551011/KorService2/searchEvent',
        // 한국관광공사 여행코스 검색 API
        'https://apis.data.go.kr/B551011/KorService2/searchCourse'
      ];
      
      let allEvents = [];
      let workingEndpoints = [];

      // 각 API 엔드포인트를 순차적으로 시도하여 모든 데이터 수집
      for (const endpoint of apiEndpoints) {
        try {
          // 한국관광공사 API 파라미터 설정 (전체 데이터 수집)
          const params = new URLSearchParams({
            serviceKey: PUBLIC_DATA_API_KEY,
            numOfRows: '100', // 더 많은 데이터 수집
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
            console.log('전체 API 응답 데이터:', data);
            
            // 한국관광공사 API 응답 구조 분석 및 데이터 추출 (더 포괄적으로)
            let records = [];
            
            // 다양한 응답 구조 처리
            if (data && data.response && data.response.body) {
              const body = data.response.body;
              
              // items가 있는 경우
              if (body.items) {
                records = body.items.item || body.items;
                console.log('response.body.items에서 데이터 발견:', records.length);
              }
              // areaCode가 있는 경우
              else if (body.areaCode) {
                records = body.areaCode.item || body.areaCode;
                console.log('지역코드 데이터 발견:', records.length);
              }
              // searchStay가 있는 경우
              else if (body.searchStay) {
                records = body.searchStay.item || body.searchStay;
                console.log('관광지 데이터 발견:', records.length);
              }
              // searchFestival이 있는 경우
              else if (body.searchFestival) {
                records = body.searchFestival.item || body.searchFestival;
                console.log('축제 데이터 발견:', records.length);
              }
              // searchRestaurant가 있는 경우
              else if (body.searchRestaurant) {
                records = body.searchRestaurant.item || body.searchRestaurant;
                console.log('음식점 데이터 발견:', records.length);
              }
              // searchShopping이 있는 경우
              else if (body.searchShopping) {
                records = body.searchShopping.item || body.searchShopping;
                console.log('쇼핑 데이터 발견:', records.length);
              }
              // searchCultural이 있는 경우
              else if (body.searchCultural) {
                records = body.searchCultural.item || body.searchCultural;
                console.log('문화시설 데이터 발견:', records.length);
              }
              // searchLeports가 있는 경우
              else if (body.searchLeports) {
                records = body.searchLeports.item || body.searchLeports;
                console.log('레포츠 데이터 발견:', records.length);
              }
              // searchEvent가 있는 경우
              else if (body.searchEvent) {
                records = body.searchEvent.item || body.searchEvent;
                console.log('행사 데이터 발견:', records.length);
              }
              // searchCourse가 있는 경우
              else if (body.searchCourse) {
                records = body.searchCourse.item || body.searchCourse;
                console.log('여행코스 데이터 발견:', records.length);
              }
              // 기타 알 수 없는 구조인 경우
              else {
                console.log('API 응답 구조:', Object.keys(body));
                // body의 모든 키에 대해 데이터 확인
                Object.keys(body).forEach(key => {
                  const value = body[key];
                  if (value && typeof value === 'object') {
                    if (value.item) {
                      records = [...records, ...(Array.isArray(value.item) ? value.item : [value.item])];
                      console.log(`${key}.item에서 데이터 발견:`, value.item.length || 1);
                    } else if (Array.isArray(value)) {
                      records = [...records, ...value];
                      console.log(`${key}에서 배열 데이터 발견:`, value.length);
                    }
                  }
                });
              }
              
              if (records.length > 0) {
                console.log('첫 번째 레코드 샘플:', records[0]);
                console.log('레코드 구조 분석:', Object.keys(records[0] || {}));
              }
            }
            
            if (records && records.length > 0) {
              // 모든 데이터를 수집 (지역 구분 없이)
              const processedEvents = records
                .map(event => {
                  // API별로 다른 필드명 처리
                  const processedEvent = {
                    // 기본 식별자
                    contentId: event.contentId || event.contentid || event.id || event.content_id,
                    title: event.title || event.eventstartdate || event.eventenddate || event.name || event.facltNm || '제목 없음',
                    
                    // 주소 정보
                    addr1: event.addr1 || event.address || event.addr,
                    addr2: event.addr2 || event.addrDetail || event.addr_detail,
                    areaName: event.areaName || event.area || event.areaNm || event.area_name,
                    areaCode: event.areaCode || event.areaCd || event.area_code,
                    
                    // 날짜 정보
                    date: event.eventstartdate || event.eventenddate || event.eventStartDate || event.eventEndDate || 
                          event.startDate || event.endDate || event.date || '날짜 정보 없음',
                    
                    // 설명 정보
                    description: event.overview || event.description || event.content || event.detail || 
                               event.intro || event.summary || event.detailInfo || '상세 정보 없음',
                    
                    // 카테고리 정보
                    category: event.cat1 || event.cat2 || event.cat3 || event.category || event.cat || '관광정보',
                    
                    // 추가 정보들
                    tel: event.tel || event.phone || event.telephone || '',
                    homepage: event.homepage || event.url || event.website || '',
                    imageUrl: event.imageUrl || event.image || event.img || event.firstimage || event.firstImage || '',
                    
                    // API 출처
                    source: endpoint.split('/').pop(),
                    
                    // 기존 호환성을 위한 필드들
                    id: event.contentId || event.contentid || event.id || Math.random().toString(),
                    location: event.addr1 || event.addr2 || event.areaName || '위치 정보 없음'
                  };
                  
                  return processedEvent;
                });
              
              allEvents = [...allEvents, ...processedEvents];
              workingEndpoints.push(endpoint);
              console.log(`${endpoint}에서 ${processedEvents.length}개 데이터 발견`);
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
        .slice(0, 50); // 최대 50개 표시

      console.log('총 수집된 데이터 수:', allEvents.length);
      console.log('중복 제거 후 데이터 수:', uniqueEvents.length);
      console.log('작동한 API 엔드포인트들:', workingEndpoints);
      
      if (uniqueEvents.length > 0) {
        setEvents(uniqueEvents);
        setError(null);
        console.log('🎉 공공데이터포털 API에서 모든 데이터를 성공적으로 가져왔습니다!');
        console.log('작동한 엔드포인트 수:', workingEndpoints.length);
      } else {
        console.log('API에서 데이터를 찾을 수 없음');
        setEvents([]); // 빈 배열로 설정하여 "데이터가 없습니다" 메시지 표시
      }
    } catch (err) {
      console.error('데이터 가져오기 오류:', err);
      setError(`데이터를 가져올 수 없습니다: ${err.message}`);
      setEvents([]); // 에러 발생 시에도 빈 배열로 설정
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
        <h3>🎉 공공데이터포털 정보</h3>
        <div className="location-info">
          <span className="selected-city">📍 {selectedCity}</span>
          <span className="search-region">🔍 전국 관광/행사 정보</span>
        </div>
        <div className="api-status">
          <span className={`status-indicator ${API_SETTINGS.USE_PUBLIC_DATA_API ? 'active' : 'inactive'}`}>
            {API_SETTINGS.USE_PUBLIC_DATA_API ? '🟢 공공데이터 API 활성화' : '🔴 공공데이터 API 비활성화'}
          </span>
          <span className={`status-indicator ${(window.kakao && window.kakao.maps) ? 'active' : 'inactive'}`}>
            {(window.kakao && window.kakao.maps) ? '🟢 카카오맵 API 활성화' : '🔴 카카오맵 API 비활성화'}
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
          <p className="error-note">공공데이터포털 API 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.</p>
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
                  {getCategoryIcon(event.category)} {getCategoryName(event.category)}
                </span>
                <h4 className="event-title">{event.title}</h4>
                {event.source && (
                  <span className="event-source">
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

              {/* 지도보기 버튼 추가 */}
              <div className="event-actions">
                <button 
                  className="map-btn"
                  onClick={() => openMapPopup(formatLocation(event.addr1, event.addr2, event.areaName))}
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
