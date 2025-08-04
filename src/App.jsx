// src/App.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import "./styles/main.scss";

const API_KEY = "3a821b91dd99ce14a86001543d3bfe42";

// 날씨에 따른 SVG 아이콘을 반환하는 함수
const getWeatherIcon = (weatherMain, weatherDescription) => {
	const description = weatherDescription.toLowerCase();
	
	// 맑음
	if (weatherMain === "Clear") {
		return (
			<svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<circle cx="12" cy="12" r="5" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
				<path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#FFD700" strokeWidth="1" strokeLinecap="round"/>
			</svg>
		);
	}
	
	// 흐림
	if (weatherMain === "Clouds") {
		return (
			<svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M18 10a6 6 0 0 0-12 0c0 1.5.5 2.9 1.3 4H6a4 4 0 0 0 0 8h12a4 4 0 0 0 0-8h-1.3c.8-1.1 1.3-2.5 1.3-4z" fill="#B0C4DE" stroke="#87CEEB" strokeWidth="1"/>
			</svg>
		);
	}
	
	// 비
	if (weatherMain === "Rain" || description.includes("rain")) {
		return (
			<svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M18 10a6 6 0 0 0-12 0c0 1.5.5 2.9 1.3 4H6a4 4 0 0 0 0 8h12a4 4 0 0 0 0-8h-1.3c.8-1.1 1.3-2.5 1.3-4z" fill="#B0C4DE" stroke="#87CEEB" strokeWidth="1"/>
				<path d="M8 18l2 4M12 18l2 4M16 18l2 4" stroke="#4682B4" strokeWidth="2" strokeLinecap="round"/>
			</svg>
		);
	}
	
	// 눈
	if (weatherMain === "Snow" || description.includes("snow")) {
		return (
			<svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M18 10a6 6 0 0 0-12 0c0 1.5.5 2.9 1.3 4H6a4 4 0 0 0 0 8h12a4 4 0 0 0 0-8h-1.3c.8-1.1 1.3-2.5 1.3-4z" fill="#F0F8FF" stroke="#E6E6FA" strokeWidth="1"/>
				<circle cx="8" cy="18" r="1" fill="white"/>
				<circle cx="12" cy="20" r="1" fill="white"/>
				<circle cx="16" cy="18" r="1" fill="white"/>
			</svg>
		);
	}
	
	// 천둥번개
	if (weatherMain === "Thunderstorm" || description.includes("thunder")) {
		return (
			<svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M18 10a6 6 0 0 0-12 0c0 1.5.5 2.9 1.3 4H6a4 4 0 0 0 0 8h12a4 4 0 0 0 0-8h-1.3c.8-1.1 1.3-2.5 1.3-4z" fill="#2F4F4F" stroke="#696969" strokeWidth="1"/>
				<path d="M13 10l-2 4h3l-2 4" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
			</svg>
		);
	}
	
	// 안개/연무
	if (weatherMain === "Mist" || weatherMain === "Fog" || weatherMain === "Haze" || description.includes("mist") || description.includes("fog") || description.includes("haze")) {
		return (
			<svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M18 10a6 6 0 0 0-12 0c0 1.5.5 2.9 1.3 4H6a4 4 0 0 0 0 8h12a4 4 0 0 0 0-8h-1.3c.8-1.1 1.3-2.5 1.3-4z" fill="#D3D3D3" stroke="#C0C0C0" strokeWidth="1"/>
				<path d="M6 16h12M8 18h8" stroke="#A9A9A9" strokeWidth="1" strokeLinecap="round"/>
			</svg>
		);
	}
	
	// 기본 아이콘 (알 수 없는 날씨)
	return (
		<svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="12" cy="12" r="10" fill="#E6E6FA" stroke="#DDA0DD" strokeWidth="1"/>
			<text x="12" y="16" textAnchor="middle" fontSize="8" fill="#9370DB">?</text>
		</svg>
	);
};

function App() {
	const [weather, setWeather] = useState(null);
	const [city, setCity] = useState("Seoul");

	const navigate = useNavigate();

	useEffect(() => {
		// 404.html에서 리다이렉트된 URL 처리
		const redirectPath = sessionStorage.getItem('redirect');
		if (redirectPath) {
			sessionStorage.removeItem('redirect');
			navigate(redirectPath);
			return;
		}

		axios
		.get(
			`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
		)
		.then((res) => {
			setWeather(res.data);
		})
		.catch((err) => console.error(err));
	}, [city, navigate]);

	return (
		<div className="weather-app">
			<Helmet>
				<title>🌤️ 날씨 웹앱 - 전국 날씨 정보</title>
				<meta name="description" content="전국 주요 도시의 실시간 날씨 정보를 확인하세요. 서울, 경기도, 강원도 등 10개 지역의 날씨를 제공합니다." />
				<meta name="keywords" content="날씨, 기상, 온도, 날씨앱, 한국날씨" />
				<meta property="og:title" content="🌤️ 날씨 웹앱 - 전국 날씨 정보" />
				<meta property="og:description" content="전국 주요 도시의 실시간 날씨 정보를 확인하세요." />
				<meta property="og:type" content="website" />
			</Helmet>
			
			<div className="weather-app__container">

				{/* 서울 날씨 메인 카드 */}
				{weather && (
					<div className="weather-card">
						<div className="weather-card__content">
							<div className="weather-card__icon-section">
								{getWeatherIcon(weather.weather[0].main, weather.weather[0].description)}
								<h2 className="weather-card__city-name">
									{weather.name}
								</h2>
								<p className="weather-card__description">
									{weather.weather[0].description}
								</p>
							</div>
							<div className="weather-card__info-section">
								<div className="weather-card__info-grid">
									<div className="weather-card__info-item">
										<h3>온도</h3>
										<p style={{ color: "#d63384" }}>
											{weather.main.temp}°C
										</p>
									</div>
									<div className="weather-card__info-item weather-card__info-item--humidity">
										<h3>습도</h3>
										<p style={{ color: "#0d6efd" }}>
											{weather.main.humidity}%
										</p>
									</div>
									<div className="weather-card__info-item weather-card__info-item--pressure">
										<h3>기압</h3>
										<p style={{ color: "#fd7e14" }}>
											{weather.main.pressure} hPa
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

			</div>
		</div>
	);
}

export default App;
