// API 키 모음
export const API_KEYS = {
  OPENWEATHER: '3a821b91dd99ce14a86001543d3bfe42', // OpenWeatherMap API 키
  KAKAO_MAP: 'a4953cf58dc5cdca2dcdbb190de607e1',    // 카카오맵 API 키
  PUBLIC_DATA: 'UxGu0qkZpzkbKj1TkyefegskQ9MNmCQf2gAnEc9yeHLuY6bpBT0CHXbEIu+YebmRqLeV4RoqzgpZbvuOYhnQuQ==' // 공공데이터포털(한국관광공사) API 키
};

// 공공데이터포털(한국관광공사) API 키 (별도 export)
export const PUBLIC_DATA_API_KEY = API_KEYS.PUBLIC_DATA;

// API 사용 여부 설정 (true: 실제 API 사용, false: 더미데이터 사용)
export const API_SETTINGS = {
  USE_PUBLIC_DATA_API: true,   // 공공데이터포털 API 사용
  USE_OPENWEATHER_API: true,   // OpenWeatherMap API 사용
  USE_KAKAO_MAP_API: true      // 카카오맵 API 사용
};

// 주요 API 엔드포인트
export const API_ENDPOINTS = {
  OPENWEATHER_BASE: 'https://api.openweathermap.org/data/2.5', // OpenWeatherMap
  KAKAO_MAP_BASE: 'https://dapi.kakao.com/v2/local',           // 카카오맵
  PUBLIC_DATA_BASE: 'https://api.odcloud.kr/api'               // 공공데이터포털(기타)
};

// 한국관광공사 관광정보 서비스 엔드포인트
export const PUBLIC_DATA_ENDPOINTS = {
  KOREA_TOURISM: 'https://apis.data.go.kr/B551011/KorService2',              // 관광정보 서비스 루트
  FESTIVAL_SEARCH: 'https://apis.data.go.kr/B551011/KorService2/searchFestival', // 축제정보 검색
  AREA_SEARCH: 'https://apis.data.go.kr/B551011/KorService2/areaCode',           // 지역코드 검색
  TOURIST_SPOT: 'https://apis.data.go.kr/B551011/KorService2/searchStay'         // 숙박/관광지 검색
};
