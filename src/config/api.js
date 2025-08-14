// 환경 확인
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// API 키 모음 (환경변수에서만 가져오기)
export const API_KEYS = {
  // OpenWeatherMap API 키
  OPENWEATHER: import.meta.env.VITE_OPENWEATHER_API_KEY || '',
  
  // 공공데이터포털(한국관광공사) API 키
  PUBLIC_DATA: import.meta.env.VITE_PUBLIC_DATA_API_KEY || ''
};

// 공공데이터포털(한국관광공사) API 키 (별도 export)
export const PUBLIC_DATA_API_KEY = API_KEYS.PUBLIC_DATA;

// API 사용 여부 설정 (환경변수 설정 여부에 따라 자동 설정)
export const API_SETTINGS = {
  // 공공데이터포털 API 사용 (환경변수가 있으면 활성화, 없으면 비활성화)
  USE_PUBLIC_DATA_API: !!import.meta.env.VITE_PUBLIC_DATA_API_KEY,
  
  // OpenWeatherMap API 사용 (환경변수가 있으면 활성화, 없으면 비활성화)
  USE_OPENWEATHER_API: !!import.meta.env.VITE_OPENWEATHER_API_KEY
};

// API 키 상태 확인 함수 (디버깅 강화)
export const checkApiKeys = () => {
  const status = {
    openweather: {
      hasKey: !!API_KEYS.OPENWEATHER,
      keyLength: API_KEYS.OPENWEATHER?.length || 0,
      source: '환경변수',
      status: API_SETTINGS.USE_OPENWEATHER_API ? '활성화' : '비활성화',
      environment: isDevelopment ? '개발환경' : '프로덕션',
      note: API_SETTINGS.USE_OPENWEATHER_API ? 'API 사용 가능' : '환경변수 설정 필요'
    },
    publicData: {
      hasKey: !!API_KEYS.PUBLIC_DATA,
      keyLength: API_KEYS.PUBLIC_DATA?.length || 0,
      source: '환경변수',
      status: API_SETTINGS.USE_PUBLIC_DATA_API ? '활성화' : '비활성화',
      environment: isDevelopment ? '개발환경' : '프로덕션',
      note: API_SETTINGS.USE_PUBLIC_DATA_API ? 'API 사용 가능' : '환경변수 설정 필요'
    }
  };
  
  return status;
};

// 주요 API 엔드포인트
export const API_ENDPOINTS = {
  OPENWEATHER_BASE: 'https://api.openweathermap.org/data/2.5' // OpenWeatherMap
};

// 공공데이터포털 관광정보 서비스 엔드포인트 (프록시를 통해 호출)
export const PUBLIC_DATA_ENDPOINTS = {
  // 기본 서비스 루트 - 공공데이터포털 한국관광공사 API (프록시)
  KOREA_TOURISM: '/api/public-data/B551011/KorService2',
  
  // 지역코드 관련 API
  AREA_CODE: '/api/public-data/B551011/KorService2/areaCode',
  AREA_CODE_DETAIL: '/api/public-data/B551011/KorService2/areaCode1',
  
  // 축제/행사 관련 API (올바른 엔드포인트)
  FESTIVAL_SEARCH: '/api/public-data/B551011/KorService2/searchFestival2',
  EVENT_SEARCH: '/api/public-data/B551011/KorService2/searchEvent',
  
  // 관광지 관련 API
  TOURIST_SPOT: '/api/public-data/B551011/KorService2/searchStay',
  ATTRACTION_SEARCH: '/api/public-data/B551011/KorService2/searchStay',
  
  // 음식점 관련 API
  RESTAURANT_SEARCH: '/api/public-data/B551011/KorService2/searchRestaurant',
  
  // 쇼핑 관련 API
  SHOPPING_SEARCH: '/api/public-data/B551011/KorService2/searchShopping',
  
  // 문화시설 관련 API
  CULTURAL_SEARCH: '/api/public-data/B551011/KorService2/searchCultural',
  
  // 레포츠 관련 API
  LEISURE_SEARCH: '/api/public-data/B551011/KorService2/searchLeports',
  
  // 여행코스 관련 API
  COURSE_SEARCH: '/api/public-data/B551011/KorService2/searchCourse',
  
  // 숙박 관련 API
  ACCOMMODATION_SEARCH: '/api/public-data/B551011/KorService2/searchStay'
};

// 대안 API 엔드포인트들 (KorService1이 작동하지 않을 경우)
export const ALTERNATIVE_ENDPOINTS = {
  // 한국관광공사 대안 서비스
  KOREA_TOURISM_ALT: '/api/public-data/B551011/KorService2',
  FESTIVAL_SEARCH_ALT: '/api/public-data/B551011/KorService2/searchFestival',
  
  // 문화체육관광부 관광정보
  CULTURE_TOURISM: '/api/public-data/B551011/CultureService',
  
  // 지역정보개발원 관광정보
  LOCAL_TOURISM: '/api/public-data/B551011/LocalService'
};

// 한국관광공사 API 공통 파라미터
export const PUBLIC_DATA_PARAMS = {
  // 필수 파라미터
  serviceKey: PUBLIC_DATA_API_KEY,
  MobileOS: 'ETC',
  MobileApp: '갈래말래날씨여행',
  _type: 'json',
  
  // 선택 파라미터
  numOfRows: '20',    // 한 번에 가져올 데이터 수
  pageNo: '1',        // 페이지 번호
  listYN: 'Y',        // 목록 조회 여부
  arrange: 'C'        // 정렬 (A: 제목순, B: 조회순, C: 수정일순, D: 거리순)
};
