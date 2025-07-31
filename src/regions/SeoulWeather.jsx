import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const API_KEY = "3a821b91dd99ce14a86001543d3bfe42";

function SeoulWeather() {
  const [weather, setWeather] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=${API_KEY}&units=metric`)
      .then((res) => setWeather(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <Helmet>
        <title>서울 날씨 - 실시간 기온 및 날씨 정보</title>
        <meta name="description" content={`서울의 현재 날씨: ${weather ? `${weather.main.temp}°C, ${weather.weather[0].description}` : '로딩 중'}`} />
        <meta name="keywords" content="서울날씨, 서울기온, 서울기상, 서울날씨정보" />
        <meta property="og:title" content="서울 날씨 - 실시간 기온 및 날씨 정보" />
        <meta property="og:description" content={`서울의 현재 날씨: ${weather ? `${weather.main.temp}°C, ${weather.weather[0].description}` : '로딩 중'}`} />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <h1>서울 날씨</h1>
      {weather ? (
        <div>
          <h2>{weather.name}</h2>
          <p>온도: {weather.main.temp}°C</p>
          <p>날씨: {weather.weather[0].description}</p>
        </div>
      ) : (
        <p>로딩 중...</p>
      )}
      <button onClick={() => navigate("/")}>뒤로가기</button>
    </div>
  );
}

export default SeoulWeather;
