import { useState, useEffect } from 'react';
import { API_KEYS, API_ENDPOINTS, API_SETTINGS } from '../../config/api';
import './Weather.scss';

const Weather = ({ city, coordinates }) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (coordinates) {
      fetchWeatherData();
    }
  }, [coordinates]);

  // 더미 날씨 데이터 생성
  const getDummyWeatherData = () => {
    const dummyCurrent = {
      main: {
        temp: 22,
        humidity: 65,
        feels_like: 24
      },
      weather: [{ id: 800, description: '맑음' }],
      wind: { speed: 3.2 },
      name: city || '현재 위치'
    };

    const dummyForecast = {
      list: [
        { dt: Date.now() / 1000 + 86400, main: { temp: 23 }, weather: [{ id: 800, description: '맑음' }] },
        { dt: Date.now() / 1000 + 172800, main: { temp: 25 }, weather: [{ id: 802, description: '구름 조금' }] },
        { dt: Date.now() / 1000 + 259200, main: { temp: 20 }, weather: [{ id: 500, description: '비' }] },
        { dt: Date.now() / 1000 + 345600, main: { temp: 18 }, weather: [{ id: 500, description: '비' }] },
        { dt: Date.now() / 1000 + 432000, main: { temp: 22 }, weather: [{ id: 800, description: '맑음' }] }
      ]
    };

    return { current: dummyCurrent, forecast: dummyForecast };
  };

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      
      // API 사용 설정 확인
      if (!API_SETTINGS.USE_OPENWEATHER_API) {
        console.log('OpenWeather API 사용 비활성화됨 - 더미데이터 사용');
        const dummyData = getDummyWeatherData();
        setCurrentWeather(dummyData.current);
        setForecast(dummyData.forecast);
        setLoading(false);
        return;
      }
      
      // 현재 날씨 데이터 가져오기
      const currentResponse = await fetch(
        `${API_ENDPOINTS.OPENWEATHER_BASE}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEYS.OPENWEATHER}&units=metric&lang=kr`
      );
      
      if (!currentResponse.ok) {
        throw new Error('날씨 데이터를 가져올 수 없습니다.');
      }
      
      const currentData = await currentResponse.json();
      setCurrentWeather(currentData);

      // 5일 예보 데이터 가져오기
      const forecastResponse = await fetch(
        `${API_ENDPOINTS.OPENWEATHER_BASE}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEYS.OPENWEATHER}&units=metric&lang=kr`
      );
      
      if (!forecastResponse.ok) {
        throw new Error('예보 데이터를 가져올 수 없습니다.');
      }
      
      const forecastData = await forecastResponse.json();
      setForecast(forecastData);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (weatherCode) => {
    const icons = {
      '01': '☀️', // 맑음
      '02': '⛅', // 구름 조금
      '03': '☁️', // 구름 많음
      '04': '☁️', // 흐림
      '09': '🌧️', // 소나기
      '10': '🌦️', // 비
      '11': '⛈️', // 천둥번개
      '13': '❄️', // 눈
      '50': '🌫️', // 안개
    };
    
    const code = weatherCode.toString().substring(0, 2);
    return icons[code] || '🌤️';
  };

  const getWeatherAdvice = (weatherCode, temp) => {
    const code = weatherCode.toString().substring(0, 2);
    
    if (code === '01' && temp > 25) {
      return '자외선이 강합니다. 선글라스와 자외선 차단제를 사용하세요.';
    } else if (code === '09' || code === '10') {
      return '우산을 챙기시고, 젖은 길을 조심하세요.';
    } else if (code === '11') {
      return '번개가 치는 날씨입니다. 실외 활동을 자제하세요.';
    } else if (code === '13') {
      return '눈길 운전에 주의하세요. 미끄러운 길을 피하세요.';
    } else if (temp < 0) {
      return '추운 날씨입니다. 따뜻하게 입고 외출하세요.';
    } else if (temp > 30) {
      return '더운 날씨입니다. 충분한 수분 섭취를 하세요.';
    }
    
    return '좋은 날씨입니다. 즐거운 하루 되세요!';
  };

  if (loading) {
    return (
      <div className="weather weather--loading">
        <div className="loading-spinner">🌤️</div>
        <p>날씨 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather weather--error">
        <p>❌ {error}</p>
        <button onClick={fetchWeatherData} className="retry-btn">
          다시 시도
        </button>
      </div>
    );
  }

  if (!currentWeather) {
    return (
      <div className="weather">
        <p>위치를 선택해주세요.</p>
      </div>
    );
  }

  return (
    <div className="weather">
      <div className="weather-current">
        <h2>{city || '현재 위치'}</h2>
        <div className="weather-main">
          <div className="weather-icon">
            {getWeatherIcon(currentWeather.weather[0].id)}
          </div>
          <div className="weather-info">
            <div className="temperature">
              {Math.round(currentWeather.main.temp)}°C
            </div>
            <div className="description">
              {currentWeather.weather[0].description}
            </div>
          </div>
        </div>
        
        <div className="weather-details">
          <div className="detail-item">
            <span className="label">습도</span>
            <span className="value">{currentWeather.main.humidity}%</span>
          </div>
          <div className="detail-item">
            <span className="label">풍속</span>
            <span className="value">{currentWeather.wind.speed}m/s</span>
          </div>
          <div className="detail-item">
            <span className="label">체감온도</span>
            <span className="value">{Math.round(currentWeather.main.feels_like)}°C</span>
          </div>
        </div>

        <div className="weather-advice">
          <h4>🌡️ 날씨별 대처방법</h4>
          <p>{getWeatherAdvice(currentWeather.weather[0].id, currentWeather.main.temp)}</p>
        </div>
      </div>

      {forecast && (
        <div className="weather-forecast">
          <h3>📅 5일 날씨 예보</h3>
          <div className="forecast-list">
            {forecast.list
              .filter((item, index) => index % 8 === 0) // 하루에 한 번씩만 표시
              .slice(0, 5)
              .map((item, index) => (
                <div key={index} className="forecast-item">
                  <div className="forecast-date">
                    {new Date(item.dt * 1000).toLocaleDateString('ko-KR', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="forecast-icon">
                    {getWeatherIcon(item.weather[0].id)}
                  </div>
                  <div className="forecast-temp">
                    {Math.round(item.main.temp)}°C
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
