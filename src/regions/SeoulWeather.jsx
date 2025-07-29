import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
