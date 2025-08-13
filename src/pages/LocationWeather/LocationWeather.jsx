import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Weather from '../../components/Weather/Weather';
import './LocationWeather.scss';

const LocationWeather = () => {
  const { city } = useParams();
  const [cityInfo, setCityInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (city) {
      // URL 파라미터에서 도시명을 디코딩
      const decodedCity = decodeURIComponent(city);
      setCityInfo({
        name: decodedCity,
        coordinates: null
      });
      setLoading(false);
    }
  }, [city]);

  const handleLocationSelect = (coordinates, cityName) => {
    setCityInfo({
      name: cityName,
      coordinates: coordinates
    });
  };

  if (loading) {
    return (
      <div className="location-weather">
        <div className="loading-container">
          <div className="loading-spinner">🌤️</div>
          <p>도시 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="location-weather">
      <div className="location-weather-container">
        <div className="location-header">
          <h1>📍 {cityInfo?.name} 날씨 정보</h1>
          <p>선택하신 지역의 상세한 날씨 정보를 확인하세요</p>
        </div>

        <div className="weather-content">
          <Weather 
            city={cityInfo?.name} 
            coordinates={cityInfo?.coordinates} 
          />
        </div>

        <div className="location-info">
          <h2>🌍 지역 정보</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>📍 위치</h3>
              <p>{cityInfo?.name}</p>
            </div>
            <div className="info-card">
              <h3>🌡️ 현재 날씨</h3>
              <p>실시간 날씨 정보를 확인하세요</p>
            </div>
            <div className="info-card">
              <h3>📅 5일 예보</h3>
              <p>앞으로 5일간의 날씨 예보</p>
            </div>
            <div className="info-card">
              <h3>💡 여행 팁</h3>
              <p>날씨에 맞는 여행 계획 수립</p>
            </div>
          </div>
        </div>

        <div className="location-cta">
          <h2>다른 지역도 확인해보세요</h2>
          <p>홈으로 돌아가서 다른 도시의 날씨를 확인하거나, 날씨 가이드를 참고하세요.</p>
          <div className="cta-buttons">
            <a href="/" className="cta-btn primary">
              🏠 홈으로 돌아가기
            </a>
            <a href="/weather-guide" className="cta-btn secondary">
              📚 날씨 가이드 보기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationWeather;
