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
    // OpenWeatherMap 날씨 코드별 아이콘 매핑
    const icons = {
      // 맑음 (Clear)
      800: '☀️',
      
      // 구름 (Clouds)
      801: '🌤️', // 구름 조금
      802: '⛅', // 구름 많음
      803: '☁️', // 흐림
      804: '☁️', // 매우 흐림
      
      // 비 (Rain)
      200: '⛈️', // 천둥번개 + 가벼운 비
      201: '⛈️', // 천둥번개 + 비
      202: '⛈️', // 천둥번개 + 강한 비
      210: '⛈️', // 가벼운 천둥번개
      211: '⛈️', // 천둥번개
      212: '⛈️', // 강한 천둥번개
      221: '⛈️', // 매우 강한 천둥번개
      230: '⛈️', // 천둥번개 + 가벼운 소나기
      231: '⛈️', // 천둥번개 + 소나기
      232: '⛈️', // 천둥번개 + 강한 소나기
      
      // 소나기 (Drizzle)
      300: '🌦️', // 가벼운 소나기
      301: '🌦️', // 소나기
      302: '🌦️', // 강한 소나기
      310: '🌦️', // 가벼운 소나기 + 비
      311: '🌦️', // 소나기 + 비
      312: '🌦️', // 강한 소나기 + 비
      313: '🌦️', // 소나기 + 강한 비
      314: '🌦️', // 강한 소나기 + 강한 비
      321: '🌦️', // 소나기
      
      // 비 (Rain)
      500: '🌧️', // 가벼운 비
      501: '🌧️', // 적당한 비
      502: '🌧️', // 강한 비
      503: '🌧️', // 매우 강한 비
      504: '🌧️', // 극도로 강한 비
      511: '🌧️', // 차가운 비
      520: '🌧️', // 가벼운 소나기
      521: '🌧️', // 소나기
      522: '🌧️', // 강한 소나기
      531: '🌧️', // 매우 강한 소나기
      
      // 눈 (Snow)
      600: '❄️', // 가벼운 눈
      601: '❄️', // 눈
      602: '❄️', // 강한 눈
      611: '❄️', // 진눈깨비
      612: '❄️', // 가벼운 진눈깨비
      613: '❄️', // 진눈깨비
      615: '❄️', // 가벼운 비 + 눈
      616: '❄️', // 비 + 눈
      620: '❄️', // 가벼운 소나기 + 눈
      621: '❄️', // 소나기 + 눈
      622: '❄️', // 강한 소나기 + 눈
      
      // 대기 (Atmosphere)
      701: '🌫️', // 안개
      711: '🌫️', // 연기
      721: '🌫️', // 연무
      731: '🌫️', // 모래/먼지 소용돌이
      741: '🌫️', // 안개
      751: '🌫️', // 모래
      761: '🌫️', // 먼지
      762: '🌫️', // 화산재
      771: '🌫️', // 돌풍
      781: '🌫️', // 토네이도
      
      // 극한 (Extreme)
      900: '🌪️', // 토네이도
      901: '🌪️', // 열대성 폭풍
      902: '🌪️', // 허리케인
      903: '❄️', // 추위
      904: '🔥', // 더위
      905: '💨', // 바람
      906: '🧊', // 우박
      
      // 추가 (Additional)
      951: '🌤️', // 바람 없음
      952: '💨', // 가벼운 바람
      953: '💨', // 부드러운 바람
      954: '💨', // 적당한 바람
      955: '💨', // 신선한 바람
      956: '💨', // 강한 바람
      957: '💨', // 매우 강한 바람
      958: '💨', // 폭풍
      959: '💨', // 매우 강한 폭풍
      960: '🌪️', // 폭풍
      961: '🌪️', // 매우 강한 폭풍
      962: '🌪️', // 허리케인
    };
    
    return icons[weatherCode] || '🌤️';
  };

  const getWeatherAdvice = (weatherCode, temp) => {
    // OpenWeatherMap 날씨 코드별 조언
    if (weatherCode >= 200 && weatherCode < 300) {
      return '⛈️ 뇌우가 예상됩니다. 실외 활동을 자제하고 안전한 곳에 머무르세요.';
    } else if (weatherCode >= 300 && weatherCode < 400) {
      return '🌦️ 소나기가 예상됩니다. 우산을 챙기시고 젖은 길을 조심하세요.';
    } else if (weatherCode >= 500 && weatherCode < 600) {
      return '🌧️ 비가 예상됩니다. 우산을 챙기시고 젖은 길을 조심하세요.';
    } else if (weatherCode >= 600 && weatherCode < 700) {
      return '❄️ 눈이 예상됩니다. 눈길 운전에 주의하고 미끄러운 길을 피하세요.';
    } else if (weatherCode >= 700 && weatherCode < 800) {
      return '🌫️ 안개가 예상됩니다. 시야가 좋지 않으니 운전과 보행에 주의하세요.';
    } else if (weatherCode === 800) {
      if (temp > 25) {
        return '☀️ 맑고 더운 날씨입니다. 자외선 차단제와 충분한 수분 섭취를 하세요.';
      } else if (temp < 0) {
        return '☀️ 맑지만 추운 날씨입니다. 따뜻하게 입고 외출하세요.';
      } else {
        return '☀️ 맑고 좋은 날씨입니다. 즐거운 하루 되세요!';
      }
    } else if (weatherCode >= 801 && weatherCode <= 804) {
      if (temp > 30) {
        return '☁️ 흐린 날씨이지만 더울 수 있습니다. 충분한 수분 섭취를 하세요.';
      } else if (temp < 0) {
        return '☁️ 흐린 날씨이지만 추울 수 있습니다. 따뜻하게 입고 외출하세요.';
      } else {
        return '☁️ 흐린 날씨입니다. 적절한 옷차림으로 외출하세요.';
      }
    } else if (weatherCode >= 900 && weatherCode <= 906) {
      return '⚠️ 극한 날씨가 예상됩니다. 외출을 자제하고 안전에 주의하세요.';
    } else if (weatherCode >= 951 && weatherCode <= 962) {
      if (weatherCode >= 960) {
        return '🌪️ 강한 바람이 예상됩니다. 외출을 자제하고 안전에 주의하세요.';
      } else {
        return '💨 바람이 예상됩니다. 모자나 스카프를 챙기세요.';
      }
    }
    
    // 기본 조언
    if (temp > 30) {
      return '🔥 더운 날씨입니다. 충분한 수분 섭취와 휴식을 취하세요.';
    } else if (temp < 0) {
      return '❄️ 추운 날씨입니다. 따뜻하게 입고 외출하세요.';
    } else {
      return '🌤️ 좋은 날씨입니다. 즐거운 하루 되세요!';
    }
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
