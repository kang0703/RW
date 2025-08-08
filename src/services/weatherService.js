import axios from "axios";
import apiConfig from "../config/apiConfig";

// API 설정 가져오기
const { API_KEY: WEATHER_API_KEY, BASE_URL: WEATHER_BASE_URL } = apiConfig.WEATHER;

// 더미 데이터 사용 여부 (true: 더미 데이터 사용, false: 실제 API 사용)
const USE_DUMMY_DATA = false; // 배포 시 false로 변경하세요!

// 더미 날씨 데이터
const DUMMY_WEATHER_DATA = {
	"Seoul": {
		"coord": {"lon": 126.9778, "lat": 37.5683},
		"weather": [{"id": 800, "main": "Clear", "description": "clear sky", "icon": "01d"}],
		"base": "stations",
		"main": {"temp": 22, "feels_like": 21.5, "temp_min": 18, "temp_max": 26, "pressure": 1013, "humidity": 45},
		"visibility": 10000,
		"wind": {"speed": 3.5, "deg": 180},
		"clouds": {"all": 10},
		"dt": 1703123456,
		"sys": {"type": 2, "id": 2019346, "country": "KR", "sunrise": 1703123456, "sunset": 1703123456},
		"timezone": 32400,
		"id": 1835848,
		"name": "Seoul",
		"cod": 200
	},
	"Busan": {
		"coord": {"lon": 129.075, "lat": 35.1794},
		"weather": [{"id": 801, "main": "Clouds", "description": "few clouds", "icon": "02d"}],
		"base": "stations",
		"main": {"temp": 24, "feels_like": 23.8, "temp_min": 20, "temp_max": 28, "pressure": 1012, "humidity": 55},
		"visibility": 10000,
		"wind": {"speed": 4.2, "deg": 150},
		"clouds": {"all": 20},
		"dt": 1703123456,
		"sys": {"type": 2, "id": 2019346, "country": "KR", "sunrise": 1703123456, "sunset": 1703123456},
		"timezone": 32400,
		"id": 1838519,
		"name": "Busan",
		"cod": 200
	},
	"Daegu": {
		"coord": {"lon": 128.5911, "lat": 35.8703},
		"weather": [{"id": 802, "main": "Clouds", "description": "scattered clouds", "icon": "03d"}],
		"base": "stations",
		"main": {"temp": 25, "feels_like": 24.5, "temp_min": 21, "temp_max": 29, "pressure": 1011, "humidity": 50},
		"visibility": 10000,
		"wind": {"speed": 2.8, "deg": 120},
		"clouds": {"all": 40},
		"dt": 1703123456,
		"sys": {"type": 2, "id": 2019346, "country": "KR", "sunrise": 1703123456, "sunset": 1703123456},
		"timezone": 32400,
		"id": 1835329,
		"name": "Daegu",
		"cod": 200
	},
	"Incheon": {
		"coord": {"lon": 126.7052, "lat": 37.4563},
		"weather": [{"id": 803, "main": "Clouds", "description": "broken clouds", "icon": "04d"}],
		"base": "stations",
		"main": {"temp": 20, "feels_like": 19.2, "temp_min": 16, "temp_max": 24, "pressure": 1014, "humidity": 60},
		"visibility": 10000,
		"wind": {"speed": 5.1, "deg": 200},
		"clouds": {"all": 75},
		"dt": 1703123456,
		"sys": {"type": 2, "id": 2019346, "country": "KR", "sunrise": 1703123456, "sunset": 1703123456},
		"timezone": 32400,
		"id": 1843564,
		"name": "Incheon",
		"cod": 200
	},
	"Gwangju": {
		"coord": {"lon": 126.8526, "lat": 35.1595},
		"weather": [{"id": 200, "main": "Thunderstorm", "description": "thunderstorm with light rain", "icon": "11d"}],
		"base": "stations",
		"main": {"temp": 23, "feels_like": 22.8, "temp_min": 19, "temp_max": 27, "pressure": 1009, "humidity": 70},
		"visibility": 8000,
		"wind": {"speed": 6.5, "deg": 180},
		"clouds": {"all": 90},
		"dt": 1703123456,
		"sys": {"type": 2, "id": 2019346, "country": "KR", "sunrise": 1703123456, "sunset": 1703123456},
		"timezone": 32400,
		"id": 1841811,
		"name": "Gwangju",
		"cod": 200
	},
	"Daejeon": {
		"coord": {"lon": 127.3845, "lat": 36.3504},
		"weather": [{"id": 300, "main": "Drizzle", "description": "light intensity drizzle", "icon": "09d"}],
		"base": "stations",
		"main": {"temp": 21, "feels_like": 20.5, "temp_min": 17, "temp_max": 25, "pressure": 1010, "humidity": 65},
		"visibility": 9000,
		"wind": {"speed": 3.2, "deg": 160},
		"clouds": {"all": 85},
		"dt": 1703123456,
		"sys": {"type": 2, "id": 2019346, "country": "KR", "sunrise": 1703123456, "sunset": 1703123456},
		"timezone": 32400,
		"id": 1835224,
		"name": "Daejeon",
		"cod": 200
	},
	"Ulsan": {
		"coord": {"lon": 129.3114, "lat": 35.5384},
		"weather": [{"id": 500, "main": "Rain", "description": "light rain", "icon": "10d"}],
		"base": "stations",
		"main": {"temp": 22, "feels_like": 21.8, "temp_min": 18, "temp_max": 26, "pressure": 1008, "humidity": 75},
		"visibility": 7000,
		"wind": {"speed": 4.8, "deg": 140},
		"clouds": {"all": 95},
		"dt": 1703123456,
		"sys": {"type": 2, "id": 2019346, "country": "KR", "sunrise": 1703123456, "sunset": 1703123456},
		"timezone": 32400,
		"id": 1833747,
		"name": "Ulsan",
		"cod": 200
	},
	"Jeju": {
		"coord": {"lon": 126.5312, "lat": 33.5097},
		"weather": [{"id": 600, "main": "Snow", "description": "light snow", "icon": "13d"}],
		"base": "stations",
		"main": {"temp": 15, "feels_like": 14.2, "temp_min": 12, "temp_max": 18, "pressure": 1015, "humidity": 80},
		"visibility": 6000,
		"wind": {"speed": 7.2, "deg": 90},
		"clouds": {"all": 100},
		"dt": 1703123456,
		"sys": {"type": 2, "id": 2019346, "country": "KR", "sunrise": 1703123456, "sunset": 1703123456},
		"timezone": 32400,
		"id": 1846266,
		"name": "Jeju",
		"cod": 200
	}
};

class WeatherService {
	/**
	 * 더미 데이터를 반환하는 함수
	 * @param {string} cityName - 도시명
	 * @returns {Promise<Object>} 더미 날씨 데이터
	 */
	async getDummyWeatherData(cityName) {
		// 약간의 지연을 추가하여 실제 API 호출처럼 보이게 함
		await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
		
		// 도시명이 더미 데이터에 있으면 반환, 없으면 서울 데이터 반환
		return DUMMY_WEATHER_DATA[cityName] || DUMMY_WEATHER_DATA["Seoul"];
	}

	/**
	 * 도시명으로 날씨 정보를 가져옵니다.
	 * @param {string} cityName - 도시명 (예: "Seoul", "Busan")
	 * @returns {Promise<Object>} 날씨 데이터
	 */
	async getWeatherByCity(cityName) {
		// 더미 데이터 사용 설정이 활성화되어 있으면 더미 데이터 반환
		if (USE_DUMMY_DATA) {
			console.log(`[더미 데이터] ${cityName} 날씨 정보 요청`);
			return await this.getDummyWeatherData(cityName);
		}

		try {
			const response = await axios.get(
				`${WEATHER_BASE_URL}/weather?q=${cityName}&appid=${WEATHER_API_KEY}&units=${apiConfig.WEATHER.UNITS}`
			);
			return response.data;
		} catch (error) {
			console.error("도시명으로 날씨 정보를 가져오는 중 오류:", error);
			throw error;
		}
	}

	/**
	 * 좌표로 날씨 정보를 가져옵니다.
	 * @param {number} lat - 위도
	 * @param {number} lon - 경도
	 * @returns {Promise<Object>} 날씨 데이터
	 */
	async getWeatherByCoords(lat, lon) {
		// 더미 데이터 사용 설정이 활성화되어 있으면 더미 데이터 반환
		if (USE_DUMMY_DATA) {
			console.log(`[더미 데이터] 좌표 (${lat}, ${lon}) 날씨 정보 요청`);
			// 좌표에 가장 가까운 도시의 더미 데이터 반환 (간단히 서울로 처리)
			return await this.getDummyWeatherData("Seoul");
		}

		try {
			const response = await axios.get(
				`${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=${apiConfig.WEATHER.UNITS}`
			);
			return response.data;
		} catch (error) {
			console.error("좌표로 날씨 정보를 가져오는 중 오류:", error);
			throw error;
		}
	}

	/**
	 * 여러 도시의 날씨 정보를 한 번에 가져옵니다.
	 * @param {Array<string>} cityNames - 도시명 배열
	 * @returns {Promise<Array>} 날씨 데이터 배열
	 */
	async getWeatherForMultipleCities(cityNames) {
		// 더미 데이터 사용 설정이 활성화되어 있으면 더미 데이터 반환
		if (USE_DUMMY_DATA) {
			console.log(`[더미 데이터] 여러 도시 날씨 정보 요청: ${cityNames.join(', ')}`);
			const promises = cityNames.map(cityName => this.getDummyWeatherData(cityName));
			return await Promise.all(promises);
		}

		try {
			const promises = cityNames.map(cityName => this.getWeatherByCity(cityName));
			const results = await Promise.allSettled(promises);
			
			return results.map((result, index) => {
				if (result.status === 'fulfilled') {
					return result.value;
				} else {
					console.error(`${cityNames[index]} 날씨 정보 가져오기 실패:`, result.reason);
					return null;
				}
			}).filter(weather => weather !== null);
		} catch (error) {
			console.error("여러 도시 날씨 정보를 가져오는 중 오류:", error);
			throw error;
		}
	}

	/**
	 * 현재 위치를 가져와서 날씨 정보를 반환합니다.
	 * @returns {Promise<Object>} 날씨 데이터
	 */
	async getCurrentLocationWeather() {
		// 더미 데이터 사용 설정이 활성화되어 있으면 더미 데이터 반환
		if (USE_DUMMY_DATA) {
			console.log("[더미 데이터] 현재 위치 날씨 정보 요청");
			return await this.getDummyWeatherData("Seoul");
		}

		return new Promise((resolve, reject) => {
			if (!navigator.geolocation) {
				reject(new Error("이 브라우저는 위치 정보를 지원하지 않습니다."));
				return;
			}

			navigator.geolocation.getCurrentPosition(
				async (position) => {
					try {
						const { latitude, longitude } = position.coords;
						const weather = await this.getWeatherByCoords(latitude, longitude);
						resolve(weather);
					} catch (error) {
						reject(error);
					}
				},
				(error) => {
					console.error("위치 정보를 가져올 수 없습니다:", error);
					reject(error);
				}
			);
		});
	}
}

// 싱글톤 인스턴스 생성
const weatherService = new WeatherService();

export default weatherService;
