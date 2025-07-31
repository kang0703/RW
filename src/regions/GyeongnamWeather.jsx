import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const API_KEY = "3a821b91dd99ce14a86001543d3bfe42";

const cities = ["Busan", "Ulsan", "Changwon", "Jinju", "Tongyeong", "Sacheon", "Gimhae", "Yangsan", "Geoje", "Miryang"];

function GyeongnamWeather() {
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

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <Helmet>
          <title>경상남도 날씨 - 실시간 기온 및 날씨 정보</title>
          <meta name="description" content="경상남도 주요 도시들의 실시간 날씨 정보를 확인하세요. 부산, 울산, 창원, 진주, 통영, 사천, 김해, 양산, 거제, 밀양 등 10개 도시의 날씨를 제공합니다." />
          <meta name="keywords" content="경상남도날씨, 경상남도기온, 경상남도기상, 부산날씨, 울산날씨, 창원날씨, 진주날씨, 통영날씨, 사천날씨, 김해날씨, 양산날씨, 거제날씨, 밀양날씨" />
          <meta property="og:title" content="경상남도 날씨 - 실시간 기온 및 날씨 정보" />
          <meta property="og:description" content="경상남도 주요 도시들의 실시간 날씨 정보를 확인하세요." />
          <meta property="og:type" content="website" />
        </Helmet>
        <h1>경상남도 날씨</h1>
        <p>날씨 정보를 불러오는 중...</p>
        <button onClick={() => navigate("/")}>뒤로가기</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <Helmet>
        <title>경상남도 날씨 - 실시간 기온 및 날씨 정보</title>
        <meta name="description" content="경상남도 주요 도시들의 실시간 날씨 정보를 확인하세요. 부산, 울산, 창원, 진주, 통영, 사천, 김해, 양산, 거제, 밀양 등 10개 도시의 날씨를 제공합니다." />
        <meta name="keywords" content="경상남도날씨, 경상남도기온, 경상남도기상, 부산날씨, 울산날씨, 창원날씨, 진주날씨, 통영날씨, 사천날씨, 김해날씨, 양산날씨, 거제날씨, 밀양날씨" />
        <meta property="og:title" content="경상남도 날씨 - 실시간 기온 및 날씨 정보" />
        <meta property="og:description" content="경상남도 주요 도시들의 실시간 날씨 정보를 확인하세요." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <h1>🌊 경상남도 날씨</h1>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: "1rem",
        marginBottom: "2rem"
      }}>
        {cities.map(city => {
          const weather = weatherData[city];
          if (!weather) return null;
          
          return (
            <div key={city} style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
              backgroundColor: "#ffffff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              color: "#333333"
            }}>
              <h3 style={{ color: "#333333", margin: "0 0 0.5rem 0" }}>{weather.name}</h3>
              <p style={{ color: "#333333", margin: "0.25rem 0" }}>🌡️ 온도: {weather.main.temp}°C</p>
              <p style={{ color: "#333333", margin: "0.25rem 0" }}>☁️ 날씨: {weather.weather[0].description}</p>
              <p style={{ color: "#333333", margin: "0.25rem 0" }}>💧 습도: {weather.main.humidity}%</p>
              <p style={{ color: "#333333", margin: "0.25rem 0" }}>💨 풍속: {weather.wind.speed} m/s</p>
            </div>
          );
        })}
      </div>
      
      <button 
        onClick={() => navigate("/")}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        뒤로가기
      </button>
    </div>
  );
}

export default GyeongnamWeather; 