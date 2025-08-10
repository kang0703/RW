import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_KEY = "3a821b91dd99ce14a86001543d3bfe42";

// 지역별 도시 데이터
const regionalCities = {
  "경기도": ["Suwon", "Seongnam", "Bucheon", "Anyang", "Goyang", "Yongin", "Pyeongtaek", "Uijeongbu", "Ansan", "Namyangju"],
  "강원도": ["Chuncheon", "Gangneung", "Wonju", "Donghae", "Taebaek", "Sokcho", "Samcheok", "Hongcheon", "Cheorwon", "Hwacheon"],
  "충청북도": ["Cheongju", "Chungju", "Jecheon", "Boeun", "Okcheon", "Yeongdong", "Jincheon", "Goesan", "Eumseong", "Cheongju"],
  "충청남도": ["Daejeon", "Cheonan", "Asan", "Seosan", "Nonsan", "Gongju", "Boryeong", "Taean", "Buyeo", "Seocheon"],
  "전라북도": ["Jeonju", "Iksan", "Gunsan", "Jeongeup", "Namwon", "Gimje", "Buan", "Jangsu", "Jinan", "Muju"],
  "전라남도": ["Gwangju", "Mokpo", "Yeosu", "Suncheon", "Naju", "Damyang", "Gokseong", "Gurye", "Goheung", "Wando"],
  "경상북도": ["Daegu", "Pohang", "Gumi", "Gyeongsan", "Gyeongju", "Sangju", "Mungyeong", "Andong", "Yeongju", "Bonghwa"],
  "경상남도": ["Busan", "Ulsan", "Changwon", "Jinju", "Yangsan", "Gimhae", "Miryang", "Tongyeong", "Sacheon", "Geoje"],
  "제주도": ["Jeju", "Seogwipo"]
};

function RegionalWeather() {
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { region } = useParams();

  useEffect(() => {
    const cities = regionalCities[region] || [];
    
    const fetchRegionalWeather = async () => {
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

    if (cities.length > 0) {
      fetchRegionalWeather();
    }
  }, [region]);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>{region} 날씨</h1>
        <p>날씨 정보를 불러오는 중...</p>
        <button onClick={() => navigate("/")}>뒤로가기</button>
      </div>
    );
  }

  const cities = regionalCities[region] || [];

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🌍 {region} 날씨</h1>
      
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
              backgroundColor: "#f9f9f9"
            }}>
              <h3>{weather.name}</h3>
              <p>🌡️ 온도: {weather.main.temp}°C</p>
              <p>☁️ 날씨: {weather.weather[0].description}</p>
              <p>💧 습도: {weather.main.humidity}%</p>
              <p>💨 풍속: {weather.wind.speed} m/s</p>
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

export default RegionalWeather; 