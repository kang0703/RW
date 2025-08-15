import { useState, useEffect } from 'react';
import { getCurrentWeather, getWeatherByCity } from '../services/weatherService';
import { getCurrentLocation, getDefaultLocation } from '../services/locationService';

const WeatherTest = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cityInput, setCityInput] = useState('');

  // 현재 위치 날씨 테스트
  const testCurrentLocationWeather = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const location = await getCurrentLocation();
      const weather = await getCurrentWeather(location.latitude, location.longitude);
      setWeatherData(weather);
      console.log('✅ Current location weather test successful:', weather);
    } catch (err) {
      setError(err.message);
      console.error('❌ Current location weather test failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // 기본 위치(서울) 날씨 테스트
  const testDefaultLocationWeather = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const defaultLoc = getDefaultLocation();
      const weather = await getCurrentWeather(defaultLoc.latitude, defaultLoc.longitude);
      setWeatherData(weather);
      console.log('✅ Default location weather test successful:', weather);
    } catch (err) {
      setError(err.message);
      console.error('❌ Default location weather test failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // 도시명으로 날씨 테스트
  const testCityWeather = async () => {
    if (!cityInput.trim()) {
      setError('도시명을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const weather = await getWeatherByCity(cityInput);
      setWeatherData(weather);
      console.log('✅ City weather test successful:', weather);
    } catch (err) {
      setError(err.message);
      console.error('❌ City weather test failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🌤️ 갈래말래 날씨여행 - API 테스트</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>API 테스트</h3>
        <button 
          onClick={testCurrentLocationWeather}
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          📍 현재 위치 날씨 테스트
        </button>
        
        <button 
          onClick={testDefaultLocationWeather}
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          🏙️ 서울 날씨 테스트
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>도시별 날씨 테스트</h3>
        <input
          type="text"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          placeholder="도시명 입력 (예: Busan, Jeju)"
          style={{ padding: '8px', marginRight: '10px', width: '200px' }}
        />
        <button 
          onClick={testCityWeather}
          disabled={loading}
          style={{ padding: '8px 20px' }}
        >
          🔍 검색
        </button>
      </div>

      {loading && <div>🔄 API 호출 중...</div>}
      
      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          ❌ 오류: {error}
        </div>
      )}

      {weatherData && (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h3>✅ API 응답 결과</h3>
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify(weatherData, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <p>💡 개발자 도구의 콘솔에서도 API 응답을 확인할 수 있습니다.</p>
        <p>📍 현재 위치 테스트는 브라우저에서 위치 권한을 허용해야 합니다.</p>
      </div>
    </div>
  );
};

export default WeatherTest;
