import './WeatherSection.scss';

const WeatherSection = ({ weatherData, forecastData, location }) => {
  // 날씨 아이콘 선택
  const getWeatherIcon = (weatherId) => {
    if (weatherId >= 200 && weatherId < 300) return '⛈️'; // 번개
    if (weatherId >= 300 && weatherId < 400) return '🌧️'; // 가벼운 비
    if (weatherId >= 500 && weatherId < 600) return '🌧️'; // 비
    if (weatherId >= 600 && weatherId < 700) return '❄️'; // 눈
    if (weatherId >= 700 && weatherId < 800) return '🌫️'; // 안개
    if (weatherId === 800) return '☀️'; // 맑음
    if (weatherId >= 801 && weatherId < 900) return '⛅'; // 흐림
    return '🌤️'; // 기본
  };

  // 시간 포맷팅
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  // 도시명 한글화
  const getKoreanCityName = (cityName) => {
    const cityMap = {
      'Seoul': '서울특별시',
      'Busan': '부산광역시',
      'Daegu': '대구광역시',
      'Incheon': '인천광역시',
      'Gwangju': '광주광역시',
      'Daejeon': '대전광역시',
      'Ulsan': '울산광역시',
      'Jeju': '제주특별자치도'
    };
    return cityMap[cityName] || cityName;
  };

  return (
    <section id="weather" className="weather-section">
      <div className="section-header">
        <h2>🌦️ 실시간 날씨 정보</h2>
        <p>현재 위치의 상세한 날씨 정보를 확인하세요</p>
      </div>
      
      <div className="weather-grid">
        <div className="weather-card current-weather">
          <div className="card-header">
            <h3>📍 현재 위치</h3>
            <span className="location">
              {location ? getKoreanCityName(location.city) : '위치 확인 중...'}
            </span>
          </div>
          <div className="weather-info">
            {weatherData && (
              <>
                <div className="weather-icon">
                  {getWeatherIcon(weatherData.weather[0].id)}
                </div>
                <div className="temperature">
                  <span className="temp-value">
                    {Math.round(weatherData.main.temp)}°
                  </span>
                  <span className="temp-unit">C</span>
                </div>
                <div className="weather-desc">
                  {weatherData.weather[0].description}
                </div>
                <div className="weather-details">
                  <div className="detail-item">
                    <span className="label">습도</span>
                    <span className="value">{weatherData.main.humidity}%</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">풍속</span>
                    <span className="value">{weatherData.wind.speed} m/s</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">기압</span>
                    <span className="value">{weatherData.main.pressure} hPa</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="weather-card forecast">
          <div className="card-header">
            <h3>📅 오늘의 예보</h3>
          </div>
          <div className="forecast-items">
            {forecastData && forecastData.list.slice(0, 4).map((item, index) => (
              <div key={index} className="forecast-item">
                <span className="time">{formatTime(item.dt_txt)}</span>
                <span className="temp">
                  {Math.round(item.main.temp)}°
                </span>
                <span className="icon">
                  {getWeatherIcon(item.weather[0].id)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeatherSection;
