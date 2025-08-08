import { useEffect, useState } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import EventInfo from "../components/EventInfo";
import weatherService from "../services/weatherService";
import "../styles/main.scss";

const cities = ["Daejeon","Cheonan","Asan","Seosan","Gongju","Boryeong","Nonsan","Gyeryong","Hongseong","Yesan"];

function ChungnamWeather() {
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const weatherArray = await weatherService.getWeatherForMultipleCities(cities);
        const weatherMap = {};
        
        weatherArray.forEach((weather, index) => {
          if (weather) {
            weatherMap[cities[index]] = weather;
          }
        });

        setWeatherData(weatherMap);
        setLoading(false);
      } catch (error) {
        console.error("날씨 데이터를 가져오는 중 오류 발생:", error);
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="region-page region-page--chungnam">
      <Helmet>
        <title>충청남도 날씨 - 실시간 기온 및 날씨 정보</title>
        <meta name="description" content="충청남도 주요 도시들의 실시간 날씨 정보를 확인하세요. Daejeon, Cheonan, Asan, Seosan, Gongju, Boryeong, Nonsan, Gyeryong, Hongseong, Yesan 등 10개 도시의 날씨를 제공합니다." />
        <meta name="keywords" content="충청남도날씨, 충청남도기온, 충청남도기상, Daejeon날씨, Cheonan날씨, Asan날씨, Seosan날씨, Gongju날씨, Boryeong날씨, Nonsan날씨, Gyeryong날씨, Hongseong날씨, Yesan날씨" />
        <meta property="og:title" content="충청남도 날씨 - 실시간 기온 및 날씨 정보" />
        <meta property="og:description" content="충청남도 주요 도시들의 실시간 날씨 정보를 확인하세요." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="region-page__container">
        <h1 className="region-page__title">🌊 충청남도 날씨</h1>

        {loading ? (
          <div className="loading">
            <div className="loading__spinner"></div>
            <p className="loading__text">날씨 정보를 불러오는 중...</p>
          </div>
        ) : (
          <div className="city-cards">
            {cities.map(city => {
              const weather = weatherData[city];
              if (!weather) return null;
              
              return (
                <div key={city} className="city-card">
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
              );
            })}
          </div>
        )}

        {/* 행사정보 컴포넌트 추가 */}
        <EventInfo regionName="충청남도" cityName="Chungnam" />
      </div>
    </div>
  );
}

export default ChungnamWeather;
