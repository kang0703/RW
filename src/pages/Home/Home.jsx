import { useState } from 'react';
import Weather from '../../components/Weather/Weather';
import Location from '../../components/Location/Location';
import Events from '../../components/Events/Events';
import './Home.scss';

const Home = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');

  const handleLocationSelect = (coordinates, city) => {
    setSelectedLocation(coordinates);
    setSelectedCity(city);
  };

  return (
    <div className="home">
      <div className="home-container">
        <div className="home-header">
          <h1>🌤️ 갈래말래 날씨여행</h1>
          <p>정확한 날씨 정보로 더 나은 여행을 계획하세요</p>
        </div>

        <div className="home-content">
          <div className="location-section">
            <Location onLocationSelect={handleLocationSelect} />
          </div>

          <div className="weather-section">
            <Weather 
              city={selectedCity} 
              coordinates={selectedLocation} 
            />
          </div>
        </div>

        <div className="events-section">
          <Events selectedCity={selectedCity} />
        </div>

        <div className="home-features">
          <div className="feature-card">
            <div className="feature-icon">🌡️</div>
            <h3>실시간 날씨</h3>
            <p>OpenWeatherMap API를 통한 정확한 실시간 날씨 정보</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>위치 기반</h3>
            <p>현재 위치 또는 원하는 도시의 날씨 정보 제공</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>5일 예보</h3>
            <p>앞으로 5일간의 상세한 날씨 예보 정보</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>날씨 가이드</h3>
            <p>날씨별 맞춤 대처방법과 여행 팁 제공</p>
          </div>
        </div>

        <div className="home-cta">
          <h2>지금 바로 시작하세요!</h2>
          <p>위치를 선택하고 정확한 날씨 정보를 확인해보세요.</p>
          <div className="cta-buttons">
            <button 
              className="cta-primary"
              onClick={() => document.querySelector('.search-input')?.focus()}
            >
              🚀 시작하기
            </button>
            <button className="cta-secondary">
              📚 날씨 가이드 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
