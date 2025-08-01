import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import "../styles/main.scss";

const API_KEY = "3a821b91dd99ce14a86001543d3bfe42";

function SeoulWeather() {
	const [weather, setWeather] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		axios
			.get(
				`https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=${API_KEY}&units=metric`
			)
			.then((res) => {
				setWeather(res.data);
				setLoading(false);
			})
			.catch((err) => {
				console.error(err);
				setLoading(false);
			});
	}, []);

	return (
		<div className="region-page region-page--seoul">
			<Helmet>
				<title>서울 날씨 - 실시간 기온 및 날씨 정보</title>
				<meta
					name="description"
					content={`서울의 현재 날씨: ${
						weather
							? `${weather.main.temp}°C, ${weather.weather[0].description}`
							: "로딩 중"
					}`}
				/>
				<meta
					name="keywords"
					content="서울날씨, 서울기온, 서울기상, 서울날씨정보"
				/>
				<meta
					property="og:title"
					content="서울 날씨 - 실시간 기온 및 날씨 정보"
				/>
				<meta
					property="og:description"
					content={`서울의 현재 날씨: ${
						weather
							? `${weather.main.temp}°C, ${weather.weather[0].description}`
							: "로딩 중"
					}`}
				/>
				<meta property="og:type" content="website" />
			</Helmet>

			<div className="region-page__container">
				<h1 className="region-page__title">🌤️ 서울 날씨</h1>

				{loading ? (
					<div className="loading">
						<div className="loading__spinner"></div>
						<p className="loading__text">날씨 정보를 불러오는 중...</p>
					</div>
				) : weather ? (
					<div className="city-cards">
						<div className="city-card">
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
					</div>
				) : (
					<div className="loading">
						<p className="loading__text">날씨 정보를 불러올 수 없습니다.</p>
					</div>
				)}

				<button
					className="region-page__back-button"
					onClick={() => navigate("/")}
				>
					&#8592;
				</button>
			</div>
		</div>
	);
}

export default SeoulWeather;