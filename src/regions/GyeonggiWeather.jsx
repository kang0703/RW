import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";

const API_KEY = "3a821b91dd99ce14a86001543d3bfe42";

const cities = ["Suwon", "Seongnam", "Bucheon", "Anyang", "Goyang", "Yongin", "Pyeongtaek", "Uijeongbu", "Ansan", "Namyangju"];

function GyeonggiWeather() {
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
          <title>경기도 날씨 - 실시간 기온 및 날씨 정보</title>
          <meta name="description" content="경기도 주요 도시들의 실시간 날씨 정보를 확인하세요. 수원, 성남, 부천, 안양, 고양, 용인, 평택, 의정부, 안산, 남양주 등 10개 도시의 날씨를 제공합니다." />
          <meta name="keywords" content="경기도날씨, 경기도기온, 경기도기상, 수원날씨, 성남날씨, 부천날씨, 안양날씨, 고양날씨, 용인날씨, 평택날씨, 의정부날씨, 안산날씨, 남양주날씨" />
          <meta property="og:title" content="경기도 날씨 - 실시간 기온 및 날씨 정보" />
          <meta property="og:description" content="경기도 주요 도시들의 실시간 날씨 정보를 확인하세요." />
          <meta property="og:type" content="website" />
        </Helmet>
        <h1>경기도 날씨</h1>
        <p>날씨 정보를 불러오는 중...</p>
        <button onClick={() => navigate("/")}>뒤로가기</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <Helmet>
        <title>경기도 날씨 - 실시간 기온 및 날씨 정보</title>
        <meta name="description" content="경기도 주요 도시들의 실시간 날씨 정보를 확인하세요. 수원, 성남, 부천, 안양, 고양, 용인, 평택, 의정부, 안산, 남양주 등 10개 도시의 날씨를 제공합니다." />
        <meta name="keywords" content="경기도날씨, 경기도기온, 경기도기상, 수원날씨, 성남날씨, 부천날씨, 안양날씨, 고양날씨, 용인날씨, 평택날씨, 의정부날씨, 안산날씨, 남양주날씨" />
        <meta property="og:title" content="경기도 날씨 - 실시간 기온 및 날씨 정보" />
        <meta property="og:description" content="경기도 주요 도시들의 실시간 날씨 정보를 확인하세요." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <h1>🌍 경기도 날씨</h1>
      
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

export default GyeonggiWeather; 