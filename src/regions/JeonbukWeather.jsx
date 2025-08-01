import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import "../styles/main.scss";

const API_KEY = "3a821b91dd99ce14a86001543d3bfe42";

const cities = ["Jeonju", "Jeongeup", "Gunsan", "Iksan", "Namwon", "Gimje", "Wanju", "Jinan", "Muju", "Sunchang"];

function JeonbukWeather() {
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
    <div className="region-page region-page--jeonbuk">
      <Helmet>
        <title>전라북도 날씨 - 실시간 기온 및 날씨 정보</title>
        <meta name="description" content="전라북도 주요 도시들의 실시간 날씨 정보를 확인하세요. 전주, 정읍, 군산, 익산, 남원, 김제, 완주, 진안, 무주, 순창 등 10개 도시의 날씨를 제공합니다." />
        <meta name="keywords" content="전라북도날씨, 전라북도기온, 전라북도기상, 전주날씨, 정읍날씨, 군산날씨, 익산날씨, 남원날씨, 김제날씨, 완주날씨, 진안날씨, 무주날씨, 순창날씨" />
        <meta property="og:title" content="전라북도 날씨 - 실시간 기온 및 날씨 정보" />
        <meta property="og:description" content="전라북도 주요 도시들의 실시간 날씨 정보를 확인하세요." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="region-page__container">
        <h1 className="region-page__title">🍚 전라북도 날씨</h1>

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

export default JeonbukWeather; 