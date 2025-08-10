// src/App.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import EventInfo from "./components/EventInfo";
import Forecast from "./components/Forecast";
import weatherService from "./services/weatherService";
import { 
	getWeatherIcon, 
	getKoreanCityName, 
	getKoreanWeatherDescription, 
	getRegionFromCity 
} from "./utils/weatherUtils.jsx";
import "./styles/main.scss";

function App() {
	const [weather, setWeather] = useState(null);
	const [forecast, setForecast] = useState(null);
	const [currentCity, setCurrentCity] = useState("서울");
	const [loading, setLoading] = useState(true);
	const [locationError, setLocationError] = useState(false);

	const navigate = useNavigate();

	// 현재 위치 가져오기
	const getCurrentLocation = async () => {
		try {
			const weatherData = await weatherService.getCurrentLocationWeather();
			setWeather(weatherData);
			setCurrentCity(weatherData.name);
			
			// 5일 예보도 함께 가져오기
			const forecastData = await weatherService.getForecastByCity(weatherData.name);
			setForecast(forecastData);
			
			setLoading(false);
		} catch (error) {
			console.error("위치 정보를 가져올 수 없습니다:", error);
			setLocationError(true);
			// 기본값으로 서울 날씨 가져오기
			getWeatherByCity("Seoul");
		}
	};

	// 도시명으로 날씨 가져오기
	const getWeatherByCity = async (cityName) => {
		try {
			const weatherData = await weatherService.getWeatherByCity(cityName);
			setWeather(weatherData);
			setCurrentCity(weatherData.name);
			
			// 5일 예보도 함께 가져오기
			const forecastData = await weatherService.getForecastByCity(cityName);
			setForecast(forecastData);
			
			setLoading(false);
		} catch (error) {
			console.error("날씨 정보를 가져올 수 없습니다:", error);
			setLoading(false);
		}
	};


	useEffect(() => {
		// 404.html에서 리다이렉트된 URL 처리
		const redirectPath = sessionStorage.getItem('redirect');
		if (redirectPath) {
			sessionStorage.removeItem('redirect');
			navigate(redirectPath);
			return;
		}

		// 현재 위치 기반으로 날씨 가져오기
		getCurrentLocation();
	}, [navigate]);

	if (loading) {
		return (
			<div className="loading">
				<div className="loading__spinner"></div>
				<p>현재 위치의 날씨 정보를 가져오는 중...</p>
			</div>
		);
	}

	return (
		<>
			<Helmet>
				<title>🌤️ 갈래말래 날씨여행 - 전국 날씨 정보</title>
				<meta name="description" content="전국 주요 도시의 실시간 날씨 정보를 확인하세요. 서울, 경기도, 강원도 등 10개 지역의 날씨를 제공합니다." />
				<meta name="keywords" content="날씨, 기상, 온도, 날씨앱, 한국날씨" />
				<meta property="og:title" content="🌤️ 날씨 웹앱 - 전국 날씨 정보" />
				<meta property="og:description" content="전국 주요 도시의 실시간 날씨 정보를 확인하세요." />
				<meta property="og:type" content="website" />
			</Helmet>
			
			{/* 현재 위치 안내 */}
			{locationError && (
				<div className="location-notice">
					<p>📍 위치 정보를 가져올 수 없어 서울의 날씨를 표시합니다.</p>
				</div>
			)}

			{/* 날씨 정보 섹션 */}
			{weather && (
				<div className="weather-section">
					{/* 메인 날씨 정보 */}
					<div className="weather-main">
						<div className="weather-main__info">
							<h2 className="weather-main__city">
								{getKoreanCityName(weather.name)} {weather.name}
							</h2>
							<div className="weather-main__temperature">
								{Math.round(weather.main.temp)}°C
							</div>
							<p className="weather-main__description">
								{getKoreanWeatherDescription(weather.weather[0].main, weather.weather[0].description)}
							</p>
						</div>
						<div className="weather-main__icon">
							{getWeatherIcon(weather.weather[0].main, weather.weather[0].description)}
						</div>
					</div>

					{/* 날씨 세부 정보 */}
					<div className="weather-details">
						<div className="weather-details__item">
							<h3>온도</h3>
							<p>{Math.round(weather.main.temp)}°C</p>
						</div>
						<div className="weather-details__item">
							<h3>습도</h3>
							<p>{weather.main.humidity}%</p>
						</div>
						<div className="weather-details__item">
							<h3>기압</h3>
							<p>{weather.main.pressure} hPa</p>
						</div>
						<div className="weather-details__item">
							<h3>풍속</h3>
							<p>{weather.wind?.speed || 0} km/h</p>
						</div>
					</div>

					{/* 5일 예보 */}
					{forecast && (
						<Forecast forecastData={forecast} />
					)}
				</div>
			)}

			{/* 행사 정보 */}
			{weather && (
				<div className="events-section">
					<h2 className="events-section__title">행사</h2>
					<EventInfo 
						regionName={getRegionFromCity(currentCity)}
						cityName={getKoreanCityName(currentCity)}
					/>
				</div>
			)}
		</>
	);
}

export default App;
