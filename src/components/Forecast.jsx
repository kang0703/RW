import React from 'react';
import { getWeatherIcon, getKoreanWeatherDescription } from '../utils/weatherUtils.jsx';

const Forecast = ({ forecastData }) => {
	if (!forecastData || !forecastData.list) {
		return null;
	}

	// 5일 예보 데이터를 일별로 그룹화 (하루에 하나씩만 표시)
	const dailyForecasts = forecastData.list.filter((item, index) => index % 8 === 0).slice(0, 5);

	// 날짜 포맷팅 함수
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);
		
		if (date.toDateString() === today.toDateString()) {
			return '오늘';
		} else if (date.toDateString() === tomorrow.toDateString()) {
			return '내일';
		} else {
			const days = ['일', '월', '화', '수', '목', '금', '토'];
			return days[date.getDay()];
		}
	};

	return (
		<div className="forecast-section">
			<h2 className="forecast-section__title">5일 예보</h2>
			<div className="forecast">
				<div className="forecast__list">
					{dailyForecasts.map((forecast, index) => (
						<div key={index} className="forecast__item">
							<div className="forecast__date">
								{formatDate(forecast.dt_txt)}
							</div>
							<div className="forecast__icon">
								{getWeatherIcon(forecast.weather[0].main, forecast.weather[0].description)}
							</div>
							<div className="forecast__temp">
								<span className="forecast__temp-max">{Math.round(forecast.main.temp_max)}°</span>
								<span className="forecast__temp-min">{Math.round(forecast.main.temp_min)}°</span>
							</div>
							<div className="forecast__description">
								{getKoreanWeatherDescription(forecast.weather[0].main, forecast.weather[0].description)}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Forecast;
