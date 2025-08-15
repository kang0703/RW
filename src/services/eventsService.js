import axios from 'axios';
import { API_KEYS, API_ENDPOINTS } from '../config/api.js';

// 클라우드플레어 Pages Functions API (CORS 해결)
const KOREA_TOURISM_API = '/api/events';
const KOREA_TOURISM_SEARCH_API = '/api/events';

// 주변 행사 정보 가져오기
export const getNearbyEvents = async (lat, lon, radius = 10) => {
  try {
    // 한국관광공사 API 호출 시도
    try {
      // 현재 날짜 기준으로 이번 달 행사 조회
      const currentDate = new Date();
      const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
      const currentYear = currentDate.getFullYear();
      const eventStartDate = `${currentYear}${currentMonth}01`;
      const eventEndDate = `${currentYear}${currentMonth}31`;
      
      console.log('=== 한국관광공사 API 호출 시작 ===');
      console.log('API 엔드포인트:', KOREA_TOURISM_API);
      console.log('API 호출 파라미터:', {
        serviceKey: API_KEYS.PUBLIC_DATA.substring(0, 20) + '...',
        pageNo: 1,
        numOfRows: 20,
        MobileOS: 'ETC',
        MobileApp: 'WeatherApp',
        _type: 'json',
        arrange: 'A',
        eventStartDate,
        eventEndDate
      });
      
      const response = await axios.get(KOREA_TOURISM_API, {
        params: {
          serviceKey: API_KEYS.PUBLIC_DATA,
          pageNo: 1,
          numOfRows: 20,
          MobileOS: 'ETC',
          MobileApp: 'WeatherApp',
          _type: 'json',
          arrange: 'A', // 제목순 정렬
          eventStartDate: eventStartDate, // 이번 달 1일부터
          eventEndDate: eventEndDate // 이번 달 마지막 날까지
        }
      });
      
      console.log('=== API 응답 성공 ===');
      console.log('응답 상태:', response.status);
      console.log('응답 헤더:', response.headers);
      console.log('응답 데이터 구조:', Object.keys(response.data || {}));
      
      if (response.data && response.data.response && response.data.response.body) {
        const items = response.data.response.body.items.item;
        console.log('응답 본문 구조:', Object.keys(response.data.response.body || {}));
        console.log('아이템 타입:', typeof items);
        console.log('아이템 길이:', Array.isArray(items) ? items.length : '배열 아님');
        
        if (items && items.length > 0) {
          console.log('=== 데이터 변환 시작 ===');
          console.log('변환 전 데이터 샘플:', items[0]);
          // API 응답을 우리 형식으로 변환
          const transformedEvents = transformKoreaTourismEvents(items, lat, lon);
          console.log('변환 후 데이터 샘플:', transformedEvents[0]);
          console.log('총 변환된 이벤트 수:', transformedEvents.length);
          
          return {
            events: transformedEvents,
            total: transformedEvents.length,
            location: { lat, lon },
            lastUpdated: new Date().toISOString(),
            source: '한국관광공사'
          };
        } else {
          console.log('⚠️ API 응답에 아이템이 없습니다.');
          console.log('전체 응답 데이터:', response.data);
        }
      } else {
        console.log('⚠️ API 응답 구조가 예상과 다릅니다.');
        console.log('전체 응답 데이터:', response.data);
      }
    } catch (apiError) {
      console.log('❌ 한국관광공사 API 호출 실패');
      console.log('에러 메시지:', apiError.message);
      console.log('에러 상태:', apiError.response?.status);
      console.log('에러 응답:', apiError.response?.data);
      console.log('에러 상세:', apiError);
    }
    
    console.log('🔄 가상 데이터 사용으로 전환');
    // API 실패시 가상 데이터 반환
    return await getMockEventsData(lat, lon);
  } catch (error) {
    console.error('❌ 전체 함수 에러:', error);
    return getDefaultEventsData();
  }
};

// 특정 지역의 행사 정보 가져오기
export const getEventsByLocation = async (location) => {
  try {
    // 한국관광공사 키워드 검색 API 호출 시도
    try {
      const response = await axios.get(KOREA_TOURISM_SEARCH_API, {
        params: {
          serviceKey: API_KEYS.PUBLIC_DATA,
          pageNo: 1,
          numOfRows: 20,
          MobileOS: 'ETC',
          MobileApp: 'WeatherApp',
          _type: 'json',
          listYN: 'Y',
          arrange: 'A',
          keyword: location,
          contentTypeId: '15' // 행사/축제 타입
        }
      });
      
      if (response.data && response.data.response && response.data.response.body) {
        const items = response.data.response.body.items.item;
        if (items && items.length > 0) {
          const transformedEvents = transformKoreaTourismEvents(items);
          return {
            events: transformedEvents,
            total: transformedEvents.length,
            location: location,
            lastUpdated: new Date().toISOString(),
            source: '한국관광공사'
          };
        }
      }
    } catch (apiError) {
      console.log('한국관광공사 API 호출 실패, 가상 데이터 사용:', apiError.message);
    }
    
    // API 실패시 가상 데이터 반환
    return await getMockEventsDataByLocation(location);
  } catch (error) {
    console.error('Error fetching events by location:', error);
    return getDefaultEventsData();
  }
};

// 한국관광공사 API 응답을 우리 형식으로 변환
const transformKoreaTourismEvents = (items, lat = null, lon = null) => {
  if (!Array.isArray(items)) {
    items = [items]; // 단일 아이템인 경우 배열로 변환
  }
  
  return items.map((item, index) => {
    // 날씨 타입 결정 (간단한 로직)
    const weatherType = getWeatherTypeFromEvent(item);
    
    return {
      id: item.contentid || index + 1,
      title: item.title || '제목 없음',
      date: formatKoreaTourismDate(item),
      location: `📍 ${item.addr1 || item.addr2 || '위치 정보 없음'}`,
      description: item.overview || '설명이 없습니다.',
      weather: getWeatherFromType(weatherType),
      weatherType: weatherType,
      tempRange: getTemperatureRange(weatherType),
      icon: getEventIcon(item),
      category: getEventCategory(item),
      price: '무료', // API에서 가격 정보는 제공하지 않음
      organizer: item.orgName || '주최자 정보 없음',
      source: '한국관광공사',
      image: item.firstimage || item.firstimage2 || null,
      tel: item.tel || null,
      homepage: null, // searchFestival2 API에서는 홈페이지 정보 제공하지 않음
      areaCode: item.areacode || null,
      sigunguCode: item.sigungucode || null,
      mapX: item.mapx || null,
      mapY: item.mapy || null
    };
  });
};

// 한국관광공사 API 날짜 포맷팅
const formatKoreaTourismDate = (event) => {
  if (event.eventstartdate && event.eventenddate) {
    const startDate = new Date(event.eventstartdate);
    const endDate = new Date(event.eventenddate);
    return `${startDate.getFullYear()}.${String(startDate.getMonth() + 1).padStart(2, '0')}.${String(startDate.getDate()).padStart(2, '0')} - ${endDate.getFullYear()}.${String(endDate.getMonth() + 1).padStart(2, '0')}.${String(endDate.getDate()).padStart(2, '0')}`;
  } else if (event.eventstartdate) {
    const startDate = new Date(event.eventstartdate);
    return `${startDate.getFullYear()}.${String(startDate.getMonth() + 1).padStart(2, '0')}.${String(startDate.getDate()).padStart(2, '0')}`;
  } else {
    return '날짜 정보 없음';
  }
};

// 이벤트에서 날씨 타입 추출
const getWeatherTypeFromEvent = (event) => {
  const title = (event.title || '').toLowerCase();
  const description = (event.description || '').toLowerCase();
  
  if (title.includes('벚꽃') || description.includes('벚꽃')) {
    return 'sunny';
  } else if (title.includes('음악') || description.includes('음악')) {
    return 'sunny';
  } else if (title.includes('불꽃') || description.includes('불꽃')) {
    return 'sunny';
  } else if (title.includes('단풍') || description.includes('단풍')) {
    return 'sunny';
  } else if (title.includes('문화') || description.includes('문화')) {
    return 'sunny';
  } else if (title.includes('스키') || description.includes('스키')) {
    return 'clear';
  } else if (title.includes('비') || description.includes('비')) {
    return 'rainy';
  } else if (title.includes('눈') || description.includes('눈')) {
    return 'snowy';
  } else if (title.includes('구름') || description.includes('흐림')) {
    return 'cloudy';
  }
  
  return 'sunny'; // 기본값
};

// 날씨 타입에 따른 날씨 텍스트
const getWeatherFromType = (weatherType) => {
  const weatherMap = {
    sunny: '맑음',
    cloudy: '흐림',
    rainy: '비',
    snowy: '눈',
    clear: '맑음'
  };
  return weatherMap[weatherType] || '맑음';
};

// 날씨 타입에 따른 온도 범위
const getTemperatureRange = (weatherType) => {
  const currentMonth = new Date().getMonth() + 1;
  
  if (currentMonth >= 3 && currentMonth <= 5) { // 봄
    return '15° - 22°';
  } else if (currentMonth >= 6 && currentMonth <= 8) { // 여름
    return '25° - 32°';
  } else if (currentMonth >= 9 && currentMonth <= 11) { // 가을
    return '18° - 25°';
  } else { // 겨울
    return '-5° - 5°';
  }
};

// 이벤트에 따른 아이콘 선택
const getEventIcon = (event) => {
  const title = (event.title || '').toLowerCase();
  const description = (event.description || '').toLowerCase();
  
  if (title.includes('벚꽃') || description.includes('벚꽃')) return '🌸';
  if (title.includes('음악') || description.includes('음악')) return '🎵';
  if (title.includes('불꽃') || description.includes('불꽃')) return '🎆';
  if (title.includes('단풍') || description.includes('단풍')) return '🍁';
  if (title.includes('문화') || description.includes('문화')) return '🏛️';
  if (title.includes('스키') || description.includes('스키')) return '⛷️';
  if (title.includes('마켓') || description.includes('마켓')) return '🛍️';
  if (title.includes('전시') || description.includes('전시')) return '🎨';
  if (title.includes('축제') || description.includes('축제')) return '🎉';
  
  return '🎪'; // 기본 아이콘
};

// 이벤트 카테고리 결정
const getEventCategory = (event) => {
  const title = (event.title || '').toLowerCase();
  const overview = (event.overview || '').toLowerCase();
  
  if (title.includes('축제') || overview.includes('축제')) return '축제';
  if (title.includes('음악') || overview.includes('음악')) return '음악';
  if (title.includes('문화') || overview.includes('문화')) return '문화';
  if (title.includes('전시') || overview.includes('전시')) return '전시';
  if (title.includes('스포츠') || overview.includes('스포츠')) return '스포츠';
  if (title.includes('마켓') || overview.includes('마켓')) return '마켓';
  if (title.includes('벚꽃') || overview.includes('벚꽃')) return '자연';
  if (title.includes('단풍') || overview.includes('단풍')) return '자연';
  
  return '축제'; // 기본값
};

// 가상의 행사 데이터 생성 (위치 기반)
const getMockEventsData = async (lat, lon) => {
  // 위치에 따른 계절별 행사 데이터
  const season = getSeasonByCoordinates(lat, lon);
  const currentMonth = new Date().getMonth() + 1;
  
  const events = [];
  
  // 봄 행사 (3-5월)
  if (currentMonth >= 3 && currentMonth <= 5) {
    events.push(
      {
        id: 1,
        title: '벚꽃 축제',
        date: `${new Date().getFullYear()}.04.01 - 04.15`,
        location: '📍 여의도 한강공원',
        description: '봄의 시작을 알리는 아름다운 벚꽃 축제입니다.',
        weather: '맑음',
        weatherType: 'sunny',
        tempRange: '15° - 22°',
        icon: '🌸',
        category: '자연',
        price: '무료',
        organizer: '서울시'
      },
      {
        id: 2,
        title: '봄꽃 전시회',
        date: `${new Date().getFullYear()}.03.20 - 04.10`,
        location: '📍 남산타워',
        description: '다양한 봄꽃들을 감상할 수 있는 전시회입니다.',
        weather: '맑음',
        weatherType: 'sunny',
        tempRange: '12° - 20°',
        icon: '🌺',
        category: '전시',
        price: '5,000원',
        organizer: '남산타워'
      }
    );
  }
  
  // 여름 행사 (6-8월)
  if (currentMonth >= 6 && currentMonth <= 8) {
    events.push(
      {
        id: 3,
        title: '한강 뮤직 페스티벌',
        date: `${new Date().getFullYear()}.07.20 - 07.22`,
        location: '📍 반포 한강공원',
        description: '한강을 배경으로 펼쳐지는 음악 축제입니다.',
        weather: '맑음',
        weatherType: 'sunny',
        tempRange: '25° - 32°',
        icon: '🎵',
        category: '음악',
        price: '30,000원',
        organizer: '문화체육관광부'
      },
      {
        id: 4,
        title: '여름 밤 불꽃 축제',
        date: `${new Date().getFullYear()}.08.15`,
        location: '📍 노량진 한강공원',
        description: '하늘을 수놓는 화려한 불꽃 쇼를 감상하세요.',
        weather: '맑음',
        weatherType: 'clear',
        tempRange: '28° - 35°',
        icon: '🎆',
        category: '축제',
        price: '무료',
        organizer: '서울시'
      }
    );
  }
  
  // 가을 행사 (9-11월)
  if (currentMonth >= 9 && currentMonth <= 11) {
    events.push(
      {
        id: 5,
        title: '단풍 축제',
        date: `${new Date().getFullYear()}.10.15 - 11.05`,
        location: '📍 북한산 국립공원',
        description: '아름다운 단풍을 감상할 수 있는 가을 축제입니다.',
        weather: '맑음',
        weatherType: 'sunny',
        tempRange: '15° - 22°',
        icon: '🍁',
        category: '자연',
        price: '무료',
        organizer: '국립공원공단'
      },
      {
        id: 6,
        title: '가을 문화제',
        date: `${new Date().getFullYear()}.09.25 - 10.05`,
        location: '📍 경복궁',
        description: '전통 문화를 체험할 수 있는 가을 문화제입니다.',
        weather: '맑음',
        weatherType: 'sunny',
        tempRange: '18° - 25°',
        icon: '🏛️',
        category: '문화',
        price: '3,000원',
        organizer: '문화재청'
      }
    );
  }
  
  // 겨울 행사 (12-2월)
  if (currentMonth >= 12 || currentMonth <= 2) {
    events.push(
      {
        id: 7,
        title: '겨울 빛 축제',
        date: `${new Date().getFullYear()}.12.20 - ${new Date().getFullYear() + 1}.02.28`,
        location: '📍 올림픽공원',
        description: '겨울 밤을 밝히는 아름다운 빛 축제입니다.',
        weather: '맑음',
        weatherType: 'clear',
        tempRange: '-5° - 5°',
        icon: '✨',
        category: '축제',
        price: '15,000원',
        organizer: '올림픽공원'
      },
      {
        id: 8,
        title: '겨울 스포츠 페스티벌',
        date: `${new Date().getFullYear()}.01.15 - 01.20`,
        location: '📍 태릉 스키장',
        description: '겨울 스포츠를 즐길 수 있는 페스티벌입니다.',
        weather: '맑음',
        weatherType: 'clear',
        tempRange: '-8° - 2°',
        icon: '⛷️',
        category: '스포츠',
        price: '25,000원',
        organizer: '태릉스키장'
      }
    );
  }
  
  // 항상 표시할 행사
  events.push(
    {
      id: 9,
      title: '주말 마켓',
      date: '매주 토,일',
      location: '📍 홍대입구',
      description: '다양한 핸드메이드 상품과 맛집을 만나보세요.',
      weather: '맑음',
      weatherType: 'sunny',
      tempRange: '현재 기온',
      icon: '🛍️',
      category: '마켓',
      price: '무료',
      organizer: '홍대 상권'
    }
  );
  
  return {
    events,
    total: events.length,
    location: { lat, lon },
    lastUpdated: new Date().toISOString()
  };
};

// 위치 기반 행사 데이터
const getMockEventsDataByLocation = async (location) => {
  const events = [
    {
      id: 1,
      title: `${location} 지역 축제`,
      date: `${new Date().getFullYear()}.${String(new Date().getMonth() + 1).padStart(2, '0')}.15`,
      location: `📍 ${location}`,
      description: `${location} 지역의 특색있는 축제입니다.`,
      weather: '맑음',
      weatherType: 'sunny',
      tempRange: '18° - 25°',
      icon: '🎉',
      category: '축제',
      price: '무료',
      organizer: `${location} 시청`
    }
  ];
  
  return {
    events,
    total: events.length,
    location: location,
    lastUpdated: new Date().toISOString()
  };
};

// 기본 행사 데이터
const getDefaultEventsData = () => {
  return {
    events: [
      {
        id: 1,
        title: '벚꽃 축제',
        date: '2024.04.01 - 04.15',
        location: '📍 여의도 한강공원',
        description: '봄의 시작을 알리는 아름다운 벚꽃 축제입니다.',
        weather: '맑음',
        weatherType: 'sunny',
        tempRange: '15° - 22°',
        icon: '🌸',
        category: '자연',
        price: '무료',
        organizer: '서울시'
      }
    ],
    total: 1,
    location: null,
    lastUpdated: new Date().toISOString()
  };
};

// 좌표 기반 계절 계산
const getSeasonByCoordinates = (lat, lon) => {
  const currentMonth = new Date().getMonth() + 1;
  
  if (currentMonth >= 3 && currentMonth <= 5) return 'spring';
  if (currentMonth >= 6 && currentMonth <= 8) return 'summer';
  if (currentMonth >= 9 && currentMonth <= 11) return 'autumn';
  return 'winter';
};
