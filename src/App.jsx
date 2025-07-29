// src/App.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_KEY = "3a821b91dd99ce14a86001543d3bfe42";

function App() {
	const [weather, setWeather] = useState(null);
	const [city, setCity] = useState("Seoul");

	const navigate = useNavigate();

	useEffect(() => {
		axios
		.get(
			`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
		)
		.then((res) => {
			setWeather(res.data);
		})
		.catch((err) => console.error(err));
	}, [city]);

	return (
		<div style={{ padding: "2rem" }}>
			<h1>🌤️ 날씨 웹앱</h1>
			<input
				value={city}
				onChange={(e) => setCity(e.target.value)}
				placeholder="도시 입력"
			/>
			{weather && (
				<div>
				<h2>{weather.name}</h2>
				<p>온도: {weather.main.temp}°C</p>
				<p>날씨: {weather.weather[0].description}</p>
				</div>
			)}

			<div style={{ marginTop: "2rem" }}>
				<button 
					onClick={() => navigate("/seoul")}
					style={{
						marginRight: "1rem",
						padding: "10px 20px",
						fontSize: "16px",
						backgroundColor: "#28a745",
						color: "white",
						border: "none",
						borderRadius: "5px",
						cursor: "pointer"
					}}
				>
					서울 날씨
				</button>
				<button 
					onClick={() => navigate("/gyeonggi")}
					style={{
						marginRight: "1rem",
						padding: "10px 20px",
						fontSize: "16px",
						backgroundColor: "#17a2b8",
						color: "white",
						border: "none",
						borderRadius: "5px",
						cursor: "pointer"
					}}
				>
					경기도
				</button>
				<button 
					onClick={() => navigate("/gangwon")}
					style={{
						marginRight: "1rem",
						padding: "10px 20px",
						fontSize: "16px",
						backgroundColor: "#ffc107",
						color: "white",
						border: "none",
						borderRadius: "5px",
						cursor: "pointer"
					}}
				>
					강원도
				</button>
				<button 
					onClick={() => navigate("/chungbuk")}
					style={{
						marginRight: "1rem",
						padding: "10px 20px",
						fontSize: "16px",
						backgroundColor: "#dc3545",
						color: "white",
						border: "none",
						borderRadius: "5px",
						cursor: "pointer"
					}}
				>
					충청북도
				</button>
				<button 
					onClick={() => navigate("/chungnam")}
					style={{
						marginRight: "1rem",
						padding: "10px 20px",
						fontSize: "16px",
						backgroundColor: "#6f42c1",
						color: "white",
						border: "none",
						borderRadius: "5px",
						cursor: "pointer"
					}}
				>
					충청남도
				</button>
				<button 
					onClick={() => navigate("/jeonbuk")}
					style={{
						marginRight: "1rem",
						padding: "10px 20px",
						fontSize: "16px",
						backgroundColor: "#fd7e14",
						color: "white",
						border: "none",
						borderRadius: "5px",
						cursor: "pointer"
					}}
				>
					전라북도
				</button>
				<button 
					onClick={() => navigate("/jeonnam")}
					style={{
						marginRight: "1rem",
						padding: "10px 20px",
						fontSize: "16px",
						backgroundColor: "#20c997",
						color: "white",
						border: "none",
						borderRadius: "5px",
						cursor: "pointer"
					}}
				>
					전라남도
				</button>
				<button 
					onClick={() => navigate("/gyeongbuk")}
					style={{
						marginRight: "1rem",
						padding: "10px 20px",
						fontSize: "16px",
						backgroundColor: "#e83e8c",
						color: "white",
						border: "none",
						borderRadius: "5px",
						cursor: "pointer"
					}}
				>
					경상북도
				</button>
				<button 
					onClick={() => navigate("/gyeongnam")}
					style={{
						marginRight: "1rem",
						padding: "10px 20px",
						fontSize: "16px",
						backgroundColor: "#6c757d",
						color: "white",
						border: "none",
						borderRadius: "5px",
						cursor: "pointer"
					}}
				>
					경상남도
				</button>
				<button 
					onClick={() => navigate("/jeju")}
					style={{
						padding: "10px 20px",
						fontSize: "16px",
						backgroundColor: "#28a745",
						color: "white",
						border: "none",
						borderRadius: "5px",
						cursor: "pointer"
					}}
				>
					제주도
				</button>
			</div>
		</div>
	);
}

export default App;
