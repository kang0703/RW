const fs = require('fs');
const path = require('path');

const regionsDir = path.join(__dirname, 'src', 'regions');
const remainingFiles = [
  'ChungnamWeather.jsx',
  'JeonbukWeather.jsx',
  'JeonnamWeather.jsx',
  'GyeongbukWeather.jsx',
  'JejuWeather.jsx'
];

const cityMappings = {
  'ChungnamWeather.jsx': {
    cities: ['천안', '공주', '보령', '아산', '서산', '논산', '계룡', '당진', '금산', '부여'],
    region: '충남'
  },
  'JeonbukWeather.jsx': {
    cities: ['전주', '군산', '익산', '정읍', '남원', '김제', '완주', '진안', '무주', '장수'],
    region: '전북'
  },
  'JeonnamWeather.jsx': {
    cities: ['목포', '여수', '순천', '나주', '광양', '담양', '곡성', '구례', '고흥', '보성'],
    region: '전남'
  },
  'GyeongbukWeather.jsx': {
    cities: ['포항', '경주', '김천', '안동', '구미', '영주', '영천', '상주', '문경', '경산'],
    region: '경북'
  },
  'JejuWeather.jsx': {
    cities: ['제주시', '서귀포시'],
    region: '제주'
  }
};

remainingFiles.forEach(filename => {
  const filePath = path.join(regionsDir, filename);
  const mapping = cityMappings[filename];
  
  if (!mapping) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Import 문 수정
  content = content.replace(
    /import { useEffect, useState } from "react";\nimport axios from "axios";\nimport { Helmet } from "@dr\.pogodin\/react-helmet";\nimport "\.\.\/styles\/main\.scss";\n\nconst API_KEY = "3a821b91dd99ce14a86001543d3bfe42";\n\nconst cities = \[.*?\];/s,
    `import { useEffect, useState } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import { getMultipleWeatherData } from "../services/weatherService";
import { getEventData } from "../services/eventService";
import EventList from "../components/EventList";
import "../styles/main.scss";

const cities = ${JSON.stringify(mapping.cities)};`
  );
  
  // 함수 내부 수정
  content = content.replace(
    /function \w+Weather\(\) \{\s+const \[weatherData, setWeatherData\] = useState\(\{\}\);\s+const \[loading, setLoading\] = useState\(true\);\s+\s+useEffect\(\(\) => \{\s+const fetchWeather = async \(\) => \{\s+try \{\s+const weatherMap = \{\};\s+\s+for \(const city of cities\) \{\s+try \{\s+const response = await axios\.get\(`https:\/\/api\.openweathermap\.org\/data\/2\.5\/weather\?q=\$\{city\},KR&appid=\$\{API_KEY\}&units=metric`\);\s+weatherMap\[city\] = response\.data;\s+\} catch \(error\) \{\s+console\.error\(`\$\{city\} 도시의 날씨 데이터를 가져오는 중 오류 발생:`, error\);\s+\/\/ 실패한 도시는 건너뛰고 계속 진행\s+\}\s+\}\s+\s+setWeatherData\(weatherMap\);\s+setLoading\(false\);\s+\} catch \(error\) \{\s+console\.error\("날씨 데이터를 가져오는 중 오류 발생:", error\);\s+setLoading\(false\);\s+\}\s+\};\s+\s+fetchWeather\(\);\s+\}, \[\]\);/s,
    `function ${filename.replace('Weather.jsx', '')}Weather() {
  const [weatherData, setWeatherData] = useState({});
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventLoading, setEventLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 날씨 데이터 가져오기
        const weatherMap = await getMultipleWeatherData(cities);
        setWeatherData(weatherMap);
        setLoading(false);

        // 행사 데이터 가져오기
        const events = await getEventData("${mapping.region}");
        setEventData(events);
        setEventLoading(false);
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
        setLoading(false);
        setEventLoading(false);
      }
    };

    fetchData();
  }, []);`
  );
  
  // 날씨 카드 렌더링 부분 수정
  content = content.replace(
    /<h3 className="city-card__title">\{weather\.name\}<\/h3>\s+<p className="city-card__info city-card__info--temperature">\s+🌡️ 온도: \{weather\.main\.temp\}°C\s+<\/p>\s+<p className="city-card__info">\s+☁️ 날씨: \{weather\.weather\[0\]\.description\}\s+<\/p>\s+<p className="city-card__info">\s+💧 습도: \{weather\.main\.humidity\}%\s+<\/p>\s+<p className="city-card__info city-card__info--wind">\s+💨 풍속: \{weather\.wind\.speed\} m\/s\s+<\/p>/g,
    `<h3 className="city-card__title">{city}</h3>
                  <p className="city-card__info city-card__info--temperature">
                    🌡️ 온도: {weather.temperature}°C
                  </p>
                  <p className="city-card__info">
                    ☁️ 날씨: {weather.weatherDescription}
                  </p>
                  <p className="city-card__info">
                    💧 습도: {weather.humidity}%
                  </p>
                  <p className="city-card__info city-card__info--wind">
                    💨 풍속: {weather.windSpeed} m/s
                  </p>`
  );
  
  // 행사 정보 섹션 추가
  content = content.replace(
    /(\s+<\/div>\s+\)\s+\}\s+\)\s+<\/div>\s+<\/div>\s+\);\s+\}\s+\s+export default)/,
    `        )}

        {/* 행사 정보 섹션 */}
        <EventList events={eventData} loading={eventLoading} />
      </div>
    </div>
  );
}

export default`
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filename}`);
});

console.log('All remaining region files updated successfully!'); 