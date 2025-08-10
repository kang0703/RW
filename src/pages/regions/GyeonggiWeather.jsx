import { useEffect, useState } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import EventInfo from "../../components/EventInfo";
import Forecast from "../../components/Forecast";
import weatherService from "../../services/weatherService";
import "../../styles/main.scss";

function GyeonggiWeather() {
	const [weather, setWeather] = useState(null);
	const [forecast, setForecast] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchWeatherData = async () => {
			try {
				const [weatherData, forecastData] = await Promise.all([
					weatherService.getWeatherByCity("Incheon"),
					weatherService.getForecastByCity("Incheon")
				]);
				setWeather(weatherData);
				setForecast(forecastData);
				setLoading(false);
			} catch (error) {
				console.error("날씨 데이터를 가져오는 중 오류 발생:", error);
				setLoading(false);
			}
		};

		fetchWeatherData();
	}, []);

	return (
		<div className="region-page region-page--gyeonggi">
			<Helmet>
				<title>경기도 날씨 - 실시간 기온 및 날씨 정보</title>
				<meta name="description" content="경기도 주요 도시들의 실시간 날씨 정보를 확인하세요. Suwon, Seongnam, Bucheon, Anyang, Goyang, Yongin, Pyeongtaek, Uijeongbu, Ansan, Namyangju 등 10개 도시의 날씨를 제공합니다." />
				<meta name="keywords" content="경기도날씨, 경기도기온, 경기도기상, Suwon날씨, Seongnam날씨, Bucheon날씨, Anyang날씨, Goyang날씨, Yongin날씨, Pyeongtaek날씨, Uijeongbu날씨, Ansan날씨, Namyangju날씨" />
				<meta property="og:title" content="경기도 날씨 - 실시간 기온 및 날씨 정보" />
				<meta property="og:description" content="경기도 주요 도시들의 실시간 날씨 정보를 확인하세요." />
				<meta property="og:type" content="website" />
			</Helmet>

			<div className="region-page__container">
				<h1 className="region-page__title">🌍 경기도 날씨</h1>

				{loading ? (
					<div className="loading">
						<div className="loading__spinner"></div>
						<p className="loading__text">날씨 정보를 불러오는 중...</p>
					</div>
				) : (
					<div className="city-cards">
						{weather && (
							<div key="Incheon" className="city-card">
								<h3 className="city-card__title">{weather.name}</h3>
								<p className="city-card__info city-card__info--temperature">
									🌡️ 온도: {weather.main.temp}°C
								</p>
								<p className="city-card__info">
									☁️ 날씨: {weather.weather[0].description}
								</p>
								<p className="city-card__info">
									💧 습도: {weather.main.humidity}%
								</p>
								<p className="city-card__info city-card__info--wind">
									💨 풍속: {weather.wind.speed} m/s
								</p>
							</div>
						)}
					</div>
				)}

				{/* 5일 예보 컴포넌트 추가 */}
				{forecast && <Forecast forecastData={forecast} />}

				{/* 행사정보 컴포넌트 추가 */}
				<EventInfo regionName="경기" cityName="Incheon" />
			</div>
		</div>
	);
}

export default GyeonggiWeather;
