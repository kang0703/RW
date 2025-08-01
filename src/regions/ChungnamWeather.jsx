import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import "../styles/main.scss";

const API_KEY = "3a821b91dd99ce14a86001543d3bfe42";

const cities = ["Daejeon", "Cheonan", "Asan", "Seosan", "Dangjin", "Nonsan", "Gongju", "Boryeong", "Buyeo", "Seocheon"];

function ChungnamWeather() {
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const weatherMap = {};
        
        for (const city of cities) {
          try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},KR&appid=${API_KEY}&units=metric`);
            weatherMap[city] = response.data;
          } catch (error) {
            console.error(`${city} 도시의 날씨 데이터를 가져오는 중 오류 발생:`, error);
            // 실패한 도시는 건너뛰고 계속 진행
          }
        }
        
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
        <meta name="description" content="충청남도 주요 도시들의 실시간 날씨 정보를 확인하세요. 대전, 천안, 아산, 서산, 당진, 논산, 공주, 보령, 부여, 서천 등 10개 도시의 날씨를 제공합니다." />
        <meta name="keywords" content="충청남도날씨, 충청남도기온, 충청남도기상, 대전날씨, 천안날씨, 아산날씨, 서산날씨, 당진날씨, 논산날씨, 공주날씨, 보령날씨, 부여날씨, 서천날씨" />
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

export default ChungnamWeather; 