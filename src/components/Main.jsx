import { useState, useEffect } from 'react';
import { getCurrentWeather, getWeatherForecast } from '../services/weatherService';
import { getCurrentLocation, getDefaultLocation } from '../services/locationService';
import WeatherSection from './WeatherSection';
import EventsSection from './EventsSection';
import './Main.scss';

const Main = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 컴포넌트 마운트 시 날씨 데이터 가져오기
  useEffect(() => {
    fetchWeatherData();
  }, []);

  // 날씨 데이터 가져오기
  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 현재 위치 가져오기 (실패 시 기본 위치 사용)
      let currentLocation;
      try {
        currentLocation = await getCurrentLocation();
      } catch (err) {
        console.log('위치 권한이 없어 기본 위치(서울)를 사용합니다.');
        currentLocation = getDefaultLocation();
      }

      setLocation(currentLocation);

      // 현재 날씨와 예보 데이터 가져오기
      const [currentWeather, forecast] = await Promise.all([
        getCurrentWeather(currentLocation.latitude, currentLocation.longitude),
        getWeatherForecast(currentLocation.latitude, currentLocation.longitude)
      ]);

      setWeatherData(currentWeather);
      setForecastData(forecast);
    } catch (err) {
      setError('날씨 정보를 가져오는데 실패했습니다.');
      console.error('날씨 데이터 가져오기 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="main">
        <div className="main-content">
          <div className="loading-container">
            <div className="loading-spinner">🌤️</div>
            <p>날씨 정보를 가져오는 중...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="main">
        <div className="main-content">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button onClick={fetchWeatherData} className="retry-button">
              다시 시도
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="main">
      <div className="main-content">
        {/* 날씨 정보 영역 */}
        <WeatherSection 
          weatherData={weatherData}
          forecastData={forecastData}
          location={location}
        />

        {/* 행사 정보 영역 */}
        <EventsSection userLocation={location} />
      </div>
    </main>
  );
};

export default Main;
