// API 설정 파일
const apiConfig = {
	// OpenWeatherMap API 설정
	WEATHER: {
		API_KEY: "3a821b91dd99ce14a86001543d3bfe42",
		BASE_URL: "https://api.openweathermap.org/data/2.5",
		UNITS: "metric"
	},
	
	// 공공데이터포털 API 설정
	PUBLIC_DATA: {
		API_KEY: "UxGu0qkZpzkbKj1TkyefegskQ9MNmCQf2gAnEc9yeHLuY6bpBT0CHXbEIu%2BYebmRqLeV4RoqzgpZbvuOYhnQuQ%3D%3D",
		BASE_URL: "https://api.odcloud.kr/api",
		FESTIVAL_ENDPOINT: "/15000500/v1/uddi:festival"
	}
};

export default apiConfig;
