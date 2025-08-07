// src/App.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import EventInfo from "./components/EventInfo";
import "./styles/main.scss";

const API_KEY = "3a821b91dd99ce14a86001543d3bfe42";

// 날씨에 따른 SVG 아이콘을 반환하는 함수
const getWeatherIcon = (weatherMain, weatherDescription) => {
	const description = weatherDescription.toLowerCase();
	
	// 맑음 - 태양 빛나는 애니메이션
	if (weatherMain === "Clear") {
		return (
			<svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="weather-icon clear">
				<circle cx="12" cy="12" r="5" fill="#FFD700" stroke="#FFA500" strokeWidth="1" className="sun-core"/>
				<path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#FFD700" strokeWidth="1" strokeLinecap="round" className="sun-rays"/>
			</svg>
		);
	}
	
	// 흐림 - 구름이 천천히 움직이는 애니메이션
	if (weatherMain === "Clouds") {
		return (
			<svg width="200" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="weather-icon cloudy">
				<path d="M18 10a6 6 0 0 0-12 0c0 1.5.5 2.9 1.3 4H6a4 4 0 0 0 0 8h12a4 4 0 0 0 0-8h-1.3c.8-1.1 1.3-2.5 1.3-4z" fill="#B0C4DE" stroke="#87CEEB" strokeWidth="1" className="cloud"/>
				<path d="M20 8a4 4 0 0 0-8 0c0 1.2.4 2.3 1 3H8a3 3 0 0 0 0 6h12a3 3 0 0 0 0-6h-1c.6-.8 1-1.8 1-3z" fill="#C8D4E6" stroke="#A8C4E8" strokeWidth="0.5" className="cloud-small"/>
			</svg>
		);
	}
	
	// 비 - 빗방울이 떨어지는 애니메이션
	if (weatherMain === "Rain" || description.includes("rain")) {
		return (
			<svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="weather-icon rain">
				<path d="M18 10a6 6 0 0 0-12 0c0 1.5.5 2.9 1.3 4H6a4 4 0 0 0 0 8h12a4 4 0 0 0 0-8h-1.3c.8-1.1 1.3-2.5 1.3-4z" fill="#B0C4DE" stroke="#87CEEB" strokeWidth="1" className="cloud"/>
				<path d="M20 8a4 4 0 0 0-8 0c0 1.2.4 2.3 1 3H8a3 3 0 0 0 0 6h12a3 3 0 0 0 0-6h-1c.6-.8 1-1.8 1-3z" fill="#C8D4E6" stroke="#A8C4E8" strokeWidth="0.5" className="cloud-small"/>
				<path d="M8 18l2 4" stroke="#4682B4" strokeWidth="2" strokeLinecap="round" className="raindrop raindrop-1"/>
				<path d="M12 18l2 4" stroke="#4682B4" strokeWidth="2" strokeLinecap="round" className="raindrop raindrop-2"/>
				<path d="M16 18l2 4" stroke="#4682B4" strokeWidth="2" strokeLinecap="round" className="raindrop raindrop-3"/>
				<path d="M10 18l1.5 3" stroke="#4682B4" strokeWidth="1.5" strokeLinecap="round" className="raindrop raindrop-4"/>
				<path d="M14 18l1.5 3" stroke="#4682B4" strokeWidth="1.5" strokeLinecap="round" className="raindrop raindrop-5"/>
			</svg>
		);
	}
	
	// 눈 - 눈송이가 떨어지는 애니메이션
	if (weatherMain === "Snow" || description.includes("snow")) {
		return (
			<svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="weather-icon snow">
				<path d="M18 10a6 6 0 0 0-12 0c0 1.5.5 2.9 1.3 4H6a4 4 0 0 0 0 8h12a4 4 0 0 0 0-8h-1.3c.8-1.1 1.3-2.5 1.3-4z" fill="#F0F8FF" stroke="#E6E6FA" strokeWidth="1" className="cloud"/>
				<path d="M20 8a4 4 0 0 0-8 0c0 1.2.4 2.3 1 3H8a3 3 0 0 0 0 6h12a3 3 0 0 0 0-6h-1c.6-.8 1-1.8 1-3z" fill="#E8F4F8" stroke="#D4E8F0" strokeWidth="0.5" className="cloud-small"/>
				<circle cx="8" cy="18" r="1" fill="white" className="snowflake snowflake-1"/>
				<circle cx="12" cy="20" r="1" fill="white" className="snowflake snowflake-2"/>
				<circle cx="16" cy="18" r="1" fill="white" className="snowflake snowflake-3"/>
				<circle cx="10" cy="22" r="0.8" fill="white" className="snowflake snowflake-4"/>
				<circle cx="14" cy="21" r="0.8" fill="white" className="snowflake snowflake-5"/>
			</svg>
		);
	}
	
	// 천둥번개 - 번개가 깜빡이는 애니메이션
	if (weatherMain === "Thunderstorm" || description.includes("thunder")) {
		return (
			<svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="weather-icon thunderstorm">
				<path d="M18 10a6 6 0 0 0-12 0c0 1.5.5 2.9 1.3 4H6a4 4 0 0 0 0 8h12a4 4 0 0 0 0-8h-1.3c.8-1.1 1.3-2.5 1.3-4z" fill="#2F4F4F" stroke="#696969" strokeWidth="1" className="cloud"/>
				<path d="M20 8a4 4 0 0 0-8 0c0 1.2.4 2.3 1 3H8a3 3 0 0 0 0 6h12a3 3 0 0 0 0-6h-1c.6-.8 1-1.8 1-3z" fill="#1A2A2A" stroke="#404040" strokeWidth="0.5" className="cloud-small"/>
				<path d="M13 10l-2 4h3l-2 4" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" className="lightning"/>
			</svg>
		);
	}
	
	// 안개/연무 - 안개가 흔들리는 애니메이션
	if (weatherMain === "Mist" || weatherMain === "Fog" || weatherMain === "Haze" || description.includes("mist") || description.includes("fog") || description.includes("haze")) {
		return (
			<svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="weather-icon fog">
				<path d="M18 10a6 6 0 0 0-12 0c0 1.5.5 2.9 1.3 4H6a4 4 0 0 0 0 8h12a4 4 0 0 0 0-8h-1.3c.8-1.1 1.3-2.5 1.3-4z" fill="#D3D3D3" stroke="#C0C0C0" strokeWidth="1" className="cloud"/>
				<path d="M6 16h12" stroke="#A9A9A9" strokeWidth="1" strokeLinecap="round" className="fog-line fog-line-1"/>
				<path d="M8 18h8" stroke="#A9A9A9" strokeWidth="1" strokeLinecap="round" className="fog-line fog-line-2"/>
			</svg>
		);
	}
	
	// 기본 아이콘 (알 수 없는 날씨) - 회전 애니메이션
	return (
		<svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="weather-icon unknown">
			<circle cx="12" cy="12" r="10" fill="#E6E6FA" stroke="#DDA0DD" strokeWidth="1" className="unknown-circle"/>
			<text x="12" y="16" textAnchor="middle" fontSize="8" fill="#9370DB" className="unknown-text">?</text>
		</svg>
	);
};

// 지역명을 한글로 변환하는 함수
const getKoreanCityName = (englishName) => {
	// 기본 도시 매핑 (더 정확한 지역명 포함)
	const cityMap = {
		// 서울 지역
		'Seoul': '서울',
		'Gangnam': '강남',
		'Gangbuk': '강북',
		'Gangdong': '강동',
		'Gangseo': '강서',
		'Gwanak': '관악',
		'Gwangjin': '광진',
		'Guro': '구로',
		'Geumcheon': '금천',
		'Nowon': '노원',
		'Dobong': '도봉',
		'Dongdaemun': '동대문',
		'Dongjak': '동작',
		'Mapo': '마포',
		'Seodaemun': '서대문',
		'Seocho': '서초',
		'Seongbuk': '성북',
		'Songpa': '송파',
		'Yangcheon': '양천',
		'Yeongdeungpo': '영등포',
		'Yongsan': '용산',
		'Eunpyeong': '은평',
		'Jongno': '종로',
		'Jung': '중구',
		'Jungnang': '중랑',
		
		// 경기도 지역
		'Suwon': '수원',
		'Seongnam': '성남',
		'Bucheon': '부천',
		'Anyang': '안양',
		'Goyang': '고양',
		'Yongin': '용인',
		'Pyeongtaek': '평택',
		'Uijeongbu': '의정부',
		'Ansan': '안산',
		'Namyangju': '남양주',
		'Bundang': '분당',
		'Pangyo': '판교',
		
		// 인천
		'Incheon': '인천',
		
		// 강원도
		'Chuncheon': '춘천',
		'Wonju': '원주',
		'Gangneung': '강릉',
		'Donghae': '동해',
		'Taebaek': '태백',
		'Sokcho': '속초',
		'Samcheok': '삼척',
		'Hongcheon': '홍천',
		'Cheorwon': '철원',
		'Hwacheon': '화천',
		
		// 충청북도
		'Cheongju': '청주',
		'Chungju': '충주',
		'Jecheon': '제천',
		'Boeun': '보은',
		'Okcheon': '옥천',
		'Yeongdong': '영동',
		'Jincheon': '진천',
		'Goesan': '괴산',
		'Eumseong': '음성',
		'Jeungpyeong': '증평',
		
		// 충청남도
		'Cheonan': '천안',
		'Asan': '아산',
		'Seosan': '서산',
		'Gongju': '공주',
		'Boryeong': '보령',
		'Nonsan': '논산',
		'Gyeryong': '계룡',
		'Hongseong': '홍성',
		'Yesan': '예산',
		
		// 전라북도
		'Jeonju': '전주',
		'Iksan': '익산',
		'Gunsan': '군산',
		'Jeongeup': '정읍',
		'Gimje': '김제',
		'Namwon': '남원',
		'Sunchang': '순창',
		'Jangsu': '장수',
		'Jinan': '진안',
		'Muju': '무주',
		
		// 전라남도
		'Gwangju': '광주',
		'Yeosu': '여수',
		'Suncheon': '순천',
		'Mokpo': '목포',
		'Naju': '나주',
		'Damyang': '담양',
		'Gokseong': '곡성',
		'Gurye': '구례',
		'Goheung': '고흥',
		'Wando': '완도',
		
		// 경상북도
		'Daegu': '대구',
		'Pohang': '포항',
		'Gumi': '구미',
		'Gyeongsan': '경산',
		'Gyeongju': '경주',
		'Sangju': '상주',
		'Mungyeong': '문경',
		'Yeongju': '영주',
		'Yeongcheon': '영천',
		'Gimcheon': '김천',
		
		// 경상남도
		'Busan': '부산',
		'Ulsan': '울산',
		'Jinju': '진주',
		'Tongyeong': '통영',
		'Sacheon': '사천',
		'Gimhae': '김해',
		'Yangsan': '양산',
		'Geoje': '거제',
		'Miryang': '밀양',
		
		// 대전
		'Daejeon': '대전',
		
		// 제주도
		'Seogwipo': '서귀포',
		
		// 북한 지역 (기존 유지)
		'Sup\'yŏng-dong': '수평동',
		'Sup\'yŏngdong': '수평동',
		'Supyŏng-dong': '수평동',
		'Supyŏngdong': '수평동',
		'P\'yŏngyang': '평양',
		'Ch\'ŏngjin': '청진',
		'P\'yŏngch\'ŏn': '평천',
		'P\'yŏngsŏng': '평성',
		'P\'yŏnggang': '평강',
		'P\'yŏngsan': '평산',
		'P\'yŏngwŏn': '평원',
		'P\'yŏngyang-si': '평양시',
		'P\'yŏngch\'ŏn-guyŏk': '평천구역',
		'P\'yŏngsŏng-si': '평성시',
		'P\'yŏnggang-gun': '평강군',
		'P\'yŏngsan-gun': '평산군',
		'P\'yŏngwŏn-gun': '평원군'
	};
	
	// 정확한 매칭 먼저 시도
	if (cityMap[englishName]) {
		return cityMap[englishName];
	}
	
	// 특수 패턴 처리 (Sup'yŏng-dong 같은 경우)
	let normalizedName = englishName;
	
	// Sup'yŏng-dong 패턴 처리
	if (normalizedName.includes('Sup') && normalizedName.includes('yŏng') && normalizedName.includes('dong')) {
		normalizedName = '수평동';
	}
	// P'yŏng 패턴 처리
	else if (normalizedName.includes('P\'yŏng')) {
		normalizedName = normalizedName
			.replace(/P\'yŏng/, '평')
			.replace(/yang/, '양')
			.replace(/ch\'ŏn/, '천')
			.replace(/sŏng/, '성')
			.replace(/gang/, '강')
			.replace(/san/, '산')
			.replace(/wŏn/, '원');
	}
	// Ch'ŏng 패턴 처리
	else if (normalizedName.includes('Ch\'ŏng')) {
		normalizedName = normalizedName
			.replace(/Ch\'ŏng/, '청')
			.replace(/jin/, '진');
	}
	
	// 일반적인 접미사 처리
	normalizedName = normalizedName
		.replace(/-si$/, '시')
		.replace(/-gun$/, '군')
		.replace(/-guyŏk$/, '구역')
		.replace(/-dong$/, '동')
		.replace(/-gu$/, '구')
		.replace(/-eup$/, '읍')
		.replace(/-myeon$/, '면')
		.replace(/-ri$/, '리');
	
	// 변환된 결과가 원본과 다르면 반환
	if (normalizedName !== englishName) {
		return normalizedName;
	}
	
	// 일반적인 영어 도시명 변환
	const commonTranslations = {
		'North': '북',
		'South': '남',
		'East': '동',
		'West': '서',
		'Central': '중앙',
		'New': '신',
		'Old': '구',
		'Big': '대',
		'Small': '소',
		'Upper': '상',
		'Lower': '하',
		'Middle': '중',
		'Street': '거리',
		'Road': '로',
		'Avenue': '대로',
		'District': '구',
		'Area': '지역',
		'Zone': '지구',
		'Village': '마을',
		'Town': '읍',
		'City': '시',
		'County': '군',
		'Province': '도',
		'Region': '지역'
	};
	
	// 일반적인 영어 단어 변환 시도
	let translatedName = englishName;
	for (const [english, korean] of Object.entries(commonTranslations)) {
		translatedName = translatedName.replace(new RegExp(english, 'gi'), korean);
	}
	
	// 변환된 결과가 원본과 다르면 반환
	if (translatedName !== englishName) {
		return translatedName;
	}
	
	// 변환할 수 없는 경우 원본 반환
	return englishName;
};

// 날씨 상태를 한글로 변환하는 함수
const getKoreanWeatherDescription = (weatherMain, weatherDescription) => {
	const weatherMap = {
		'Clear': '맑음',
		'Clouds': '흐림',
		'Rain': '비',
		'Snow': '눈',
		'Thunderstorm': '천둥번개',
		'Mist': '안개',
		'Fog': '안개',
		'Haze': '연무',
		'Drizzle': '이슬비',
		'Shower rain': '소나기'
	};
	
	return weatherMap[weatherMain] || weatherDescription;
};

// 도시명으로 지역명을 추출하는 함수
const getRegionFromCity = (cityName) => {
	const koreanCityName = getKoreanCityName(cityName);
	
	// 도시별 지역 매핑
	const cityRegionMap = {
		'서울': '서울',
		'부산': '경상남도',
		'대구': '경상북도',
		'인천': '경기도',
		'광주': '전라남도',
		'대전': '충청남도',
		'울산': '경상남도',
		'세종': '세종',
		'수원': '경기도',
		'성남': '경기도',
		'부천': '경기도',
		'안양': '경기도',
		'고양': '경기도',
		'용인': '경기도',
		'평택': '경기도',
		'의정부': '경기도',
		'안산': '경기도',
		'남양주': '경기도',
		'춘천': '강원도',
		'원주': '강원도',
		'강릉': '강원도',
		'동해': '강원도',
		'태백': '강원도',
		'속초': '강원도',
		'삼척': '강원도',
		'홍천': '강원도',
		'철원': '강원도',
		'화천': '강원도',
		'청주': '충청북도',
		'충주': '충청북도',
		'제천': '충청북도',
		'보은': '충청북도',
		'옥천': '충청북도',
		'영동': '충청북도',
		'진천': '충청북도',
		'괴산': '충청북도',
		'음성': '충청북도',
		'증평': '충청북도',
		'천안': '충청남도',
		'아산': '충청남도',
		'서산': '충청남도',
		'공주': '충청남도',
		'보령': '충청남도',
		'논산': '충청남도',
		'계룡': '충청남도',
		'홍성': '충청남도',
		'예산': '충청남도',
		'전주': '전라북도',
		'익산': '전라북도',
		'군산': '전라북도',
		'정읍': '전라북도',
		'김제': '전라북도',
		'남원': '전라북도',
		'순창': '전라북도',
		'장수': '전라북도',
		'진안': '전라북도',
		'무주': '전라북도',
		'여수': '전라남도',
		'순천': '전라남도',
		'목포': '전라남도',
		'나주': '전라남도',
		'담양': '전라남도',
		'곡성': '전라남도',
		'구례': '전라남도',
		'고흥': '전라남도',
		'완도': '전라남도',
		'포항': '경상북도',
		'구미': '경상북도',
		'경산': '경상북도',
		'경주': '경상북도',
		'상주': '경상북도',
		'문경': '경상북도',
		'영주': '경상북도',
		'영천': '경상북도',
		'안동': '경상북도',
		'김천': '경상북도',
		'창원': '경상남도',
		'진주': '경상남도',
		'통영': '경상남도',
		'사천': '경상남도',
		'김해': '경상남도',
		'양산': '경상남도',
		'거제': '경상남도',
		'밀양': '경상남도',
		'제주': '제주도',
		'서귀포': '제주도'
	};
	
	return cityRegionMap[koreanCityName] || '서울';
};

function App() {
	const [weather, setWeather] = useState(null);
	const [currentCity, setCurrentCity] = useState("서울");
	const [loading, setLoading] = useState(true);
	const [locationError, setLocationError] = useState(false);

	const navigate = useNavigate();

	// 현재 위치 가져오기
	const getCurrentLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					getWeatherByCoords(latitude, longitude);
				},
				(error) => {
					console.error("위치 정보를 가져올 수 없습니다:", error);
					setLocationError(true);
					// 기본값으로 서울 날씨 가져오기
					getWeatherByCity("Seoul");
				}
			);
		} else {
			console.error("이 브라우저는 위치 정보를 지원하지 않습니다.");
			setLocationError(true);
			getWeatherByCity("Seoul");
		}
	};

	// 좌표로 날씨 가져오기
	const getWeatherByCoords = async (lat, lon) => {
		try {
			const response = await axios.get(
				`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
			);
			
			// 도시명을 우선적으로 사용
			let cityName = response.data.name;
			
			// 더 정확한 지역명으로 변환
			const improvedCityName = getImprovedCityName(cityName, lat, lon);
			
			setWeather(response.data);
			setCurrentCity(improvedCityName);
			setLoading(false);
		} catch (error) {
			console.error("날씨 정보를 가져올 수 없습니다:", error);
			getWeatherByCity("Seoul");
		}
	};

	// 더 정확한 지역명으로 변환하는 함수
	const getImprovedCityName = (originalName, lat, lon) => {
		// 동 단위나 너무 세부적인 지역명인 경우에만 대체
		const shouldReplace = 
			originalName.includes('-dong') || 
			originalName.includes('dong') ||
			originalName.includes('Sup') ||
			originalName.includes('yŏng') ||
			originalName.includes('P\'yŏng') ||
			originalName.includes('Ch\'ŏng') ||
			originalName.includes('gu') ||
			originalName.includes('district') ||
			originalName.length > 20; // 너무 긴 지역명
		
		if (shouldReplace) {
			// 좌표 기반으로 근처 주요 도시 찾기
			const nearbyCity = getNearbyCity(lat, lon);
			return nearbyCity || originalName;
		}
		
		// 지역명 매핑 (더 정확한 지역명으로 변환)
		const cityMapping = {
			'Gangnam-gu': 'Gangnam',
			'Gangdong-gu': 'Gangdong',
			'Gangbuk-gu': 'Gangbuk',
			'Gangseo-gu': 'Gangseo',
			'Gwanak-gu': 'Gwanak',
			'Gwangjin-gu': 'Gwangjin',
			'Guro-gu': 'Guro',
			'Geumcheon-gu': 'Geumcheon',
			'Nowon-gu': 'Nowon',
			'Dobong-gu': 'Dobong',
			'Dongdaemun-gu': 'Dongdaemun',
			'Dongjak-gu': 'Dongjak',
			'Mapo-gu': 'Mapo',
			'Seodaemun-gu': 'Seodaemun',
			'Seocho-gu': 'Seocho',
			'Seongbuk-gu': 'Seongbuk',
			'Songpa-gu': 'Songpa',
			'Yangcheon-gu': 'Yangcheon',
			'Yeongdeungpo-gu': 'Yeongdeungpo',
			'Yongsan-gu': 'Yongsan',
			'Eunpyeong-gu': 'Eunpyeong',
			'Jongno-gu': 'Jongno',
			'Jung-gu': 'Jung',
			'Jungnang-gu': 'Jungnang',
			'Bundang-gu': 'Bundang',
			'Pangyo': 'Seongnam',
			'Yatap': 'Seongnam',
			'Jamsil': 'Songpa',
			'Gangnam': 'Gangnam',
			'Myeongdong': 'Jung',
			'Hongdae': 'Mapo',
			'Itaewon': 'Yongsan',
			'Dongdaemun': 'Dongdaemun',
			'Namdaemun': 'Jung',
			'Yeouido': 'Yeongdeungpo',
			'Magok': 'Gangseo',
			'Digital Media City': 'Mapo',
			'Lotte World': 'Songpa',
			'COEX': 'Gangnam',
			'Seoul Station': 'Yongsan',
			'Gimpo Airport': 'Gangseo',
			'Incheon Airport': 'Incheon'
		};
		
		// 매핑된 지역명이 있으면 사용
		if (cityMapping[originalName]) {
			return cityMapping[originalName];
		}
		
		// 매핑이 없으면 원본 이름 사용
		return originalName;
	};

	// 좌표 기반으로 근처 주요 도시 찾기
	const getNearbyCity = (lat, lon) => {
		// 한국의 주요 도시들과의 거리 계산 (더 정확한 지역명 포함)
		const majorCities = [
			// 서울 지역
			{ name: 'Seoul', lat: 37.5665, lon: 126.9780 },
			{ name: 'Gangnam', lat: 37.5172, lon: 127.0473 },
			{ name: 'Gangbuk', lat: 37.6396, lon: 127.0257 },
			{ name: 'Gangdong', lat: 37.5301, lon: 127.1238 },
			{ name: 'Gangseo', lat: 37.5510, lon: 126.8495 },
			{ name: 'Gwanak', lat: 37.4784, lon: 126.9516 },
			{ name: 'Gwangjin', lat: 37.5384, lon: 127.0822 },
			{ name: 'Guro', lat: 37.4954, lon: 126.8874 },
			{ name: 'Geumcheon', lat: 37.4519, lon: 126.9020 },
			{ name: 'Nowon', lat: 37.6542, lon: 127.0568 },
			{ name: 'Dobong', lat: 37.6688, lon: 127.0471 },
			{ name: 'Dongdaemun', lat: 37.5744, lon: 127.0395 },
			{ name: 'Dongjak', lat: 37.5124, lon: 126.9393 },
			{ name: 'Mapo', lat: 37.5637, lon: 126.9085 },
			{ name: 'Seodaemun', lat: 37.5791, lon: 126.9368 },
			{ name: 'Seocho', lat: 37.4837, lon: 127.0324 },
			{ name: 'Seongbuk', lat: 37.5894, lon: 127.0167 },
			{ name: 'Songpa', lat: 37.5145, lon: 127.1059 },
			{ name: 'Yangcheon', lat: 37.5270, lon: 126.8565 },
			{ name: 'Yeongdeungpo', lat: 37.5264, lon: 126.8962 },
			{ name: 'Yongsan', lat: 37.5320, lon: 126.9904 },
			{ name: 'Eunpyeong', lat: 37.6185, lon: 126.9278 },
			{ name: 'Jongno', lat: 37.5735, lon: 126.9788 },
			{ name: 'Jung', lat: 37.5641, lon: 126.9979 },
			{ name: 'Jungnang', lat: 37.6064, lon: 127.0926 },
			
			// 경기도 지역
			{ name: 'Suwon', lat: 37.2636, lon: 127.0286 },
			{ name: 'Seongnam', lat: 37.4449, lon: 127.1389 },
			{ name: 'Bucheon', lat: 37.5035, lon: 126.7660 },
			{ name: 'Anyang', lat: 37.3922, lon: 126.9269 },
			{ name: 'Goyang', lat: 37.6584, lon: 126.8320 },
			{ name: 'Yongin', lat: 37.2411, lon: 127.1776 },
			{ name: 'Pyeongtaek', lat: 36.9920, lon: 127.1128 },
			{ name: 'Uijeongbu', lat: 37.7486, lon: 127.0389 },
			{ name: 'Ansan', lat: 37.3219, lon: 126.8309 },
			{ name: 'Namyangju', lat: 37.6366, lon: 127.2167 },
			{ name: 'Bundang', lat: 37.3500, lon: 127.1167 },
			{ name: 'Pangyo', lat: 37.4017, lon: 127.1089 },
			
			// 인천
			{ name: 'Incheon', lat: 37.4563, lon: 126.7052 },
			
			// 강원도
			{ name: 'Chuncheon', lat: 37.8813, lon: 127.7300 },
			{ name: 'Wonju', lat: 37.3519, lon: 127.9451 },
			{ name: 'Gangneung', lat: 37.7519, lon: 128.8761 },
			{ name: 'Donghae', lat: 37.5236, lon: 129.1144 },
			{ name: 'Taebaek', lat: 37.1741, lon: 128.9855 },
			{ name: 'Sokcho', lat: 38.2070, lon: 128.5918 },
			{ name: 'Samcheok', lat: 37.4495, lon: 129.1652 },
			{ name: 'Hongcheon', lat: 37.6917, lon: 127.8857 },
			{ name: 'Cheorwon', lat: 38.1466, lon: 127.2989 },
			{ name: 'Hwacheon', lat: 38.1065, lon: 127.7082 },
			
			// 충청북도
			{ name: 'Cheongju', lat: 36.6424, lon: 127.4890 },
			{ name: 'Chungju', lat: 36.9706, lon: 127.9322 },
			{ name: 'Jecheon', lat: 37.1321, lon: 128.2119 },
			{ name: 'Boeun', lat: 36.4897, lon: 127.7292 },
			{ name: 'Okcheon', lat: 36.3061, lon: 127.5714 },
			{ name: 'Yeongdong', lat: 36.1750, lon: 127.7764 },
			{ name: 'Jincheon', lat: 36.8567, lon: 127.4433 },
			{ name: 'Goesan', lat: 36.6007, lon: 127.2919 },
			{ name: 'Eumseong', lat: 36.9333, lon: 127.6833 },
			{ name: 'Jeungpyeong', lat: 36.7833, lon: 127.6000 },
			
			// 충청남도
			{ name: 'Cheonan', lat: 36.8065, lon: 127.1522 },
			{ name: 'Asan', lat: 36.7836, lon: 127.0045 },
			{ name: 'Seosan', lat: 36.7817, lon: 126.4522 },
			{ name: 'Gongju', lat: 36.4464, lon: 127.1190 },
			{ name: 'Boryeong', lat: 36.3333, lon: 126.6167 },
			{ name: 'Nonsan', lat: 36.2039, lon: 127.0847 },
			{ name: 'Gyeryong', lat: 36.2950, lon: 127.2489 },
			{ name: 'Hongseong', lat: 36.6009, lon: 126.6650 },
			{ name: 'Yesan', lat: 36.6784, lon: 126.8431 },
			
			// 전라북도
			{ name: 'Jeonju', lat: 35.8242, lon: 127.1480 },
			{ name: 'Iksan', lat: 35.9483, lon: 126.9579 },
			{ name: 'Gunsan', lat: 35.9678, lon: 126.7369 },
			{ name: 'Jeongeup', lat: 35.6000, lon: 126.9167 },
			{ name: 'Gimje', lat: 35.8000, lon: 126.9000 },
			{ name: 'Namwon', lat: 35.4167, lon: 127.3333 },
			{ name: 'Sunchang', lat: 35.3667, lon: 127.1333 },
			{ name: 'Jangsu', lat: 35.6500, lon: 127.5167 },
			{ name: 'Jinan', lat: 35.7833, lon: 127.4333 },
			{ name: 'Muju', lat: 35.8500, lon: 127.6667 },
			
			// 전라남도
			{ name: 'Gwangju', lat: 35.1595, lon: 126.8526 },
			{ name: 'Yeosu', lat: 34.7604, lon: 127.6622 },
			{ name: 'Suncheon', lat: 34.9506, lon: 127.4878 },
			{ name: 'Mokpo', lat: 34.7936, lon: 126.3886 },
			{ name: 'Naju', lat: 35.0167, lon: 126.7167 },
			{ name: 'Damyang', lat: 35.3167, lon: 126.9833 },
			{ name: 'Gokseong', lat: 35.2833, lon: 127.2833 },
			{ name: 'Gurye', lat: 35.2000, lon: 127.4667 },
			{ name: 'Goheung', lat: 34.6167, lon: 127.2833 },
			{ name: 'Wando', lat: 34.3167, lon: 126.7500 },
			
			// 경상북도
			{ name: 'Daegu', lat: 35.8714, lon: 128.6014 },
			{ name: 'Pohang', lat: 36.0320, lon: 129.3650 },
			{ name: 'Gumi', lat: 36.1136, lon: 128.3360 },
			{ name: 'Gyeongsan', lat: 35.8233, lon: 128.7378 },
			{ name: 'Gyeongju', lat: 35.8562, lon: 129.2248 },
			{ name: 'Sangju', lat: 36.4153, lon: 128.1606 },
			{ name: 'Mungyeong', lat: 36.5946, lon: 128.1995 },
			{ name: 'Yeongju', lat: 36.8747, lon: 128.5863 },
			{ name: 'Yeongcheon', lat: 35.9733, lon: 128.9289 },
			{ name: 'Gimcheon', lat: 36.1218, lon: 128.1198 },
			
			// 경상남도
			{ name: 'Busan', lat: 35.1796, lon: 129.0756 },
			{ name: 'Ulsan', lat: 35.5384, lon: 129.3114 },
			{ name: 'Jinju', lat: 35.1927, lon: 128.0847 },
			{ name: 'Tongyeong', lat: 34.8454, lon: 128.4334 },
			{ name: 'Sacheon', lat: 35.0039, lon: 128.0719 },
			{ name: 'Gimhae', lat: 35.2342, lon: 128.8811 },
			{ name: 'Yangsan', lat: 35.3386, lon: 129.0386 },
			{ name: 'Geoje', lat: 34.8833, lon: 128.6167 },
			{ name: 'Miryang', lat: 35.4933, lon: 128.7489 },
			
			// 대전
			{ name: 'Daejeon', lat: 36.3504, lon: 127.3845 },
			
			// 제주도
			{ name: 'Seogwipo', lat: 33.2541, lon: 126.5600 }
		];

		// 가장 가까운 도시 찾기
		let closestCity = 'Seoul';
		let minDistance = Infinity;

		for (const city of majorCities) {
			const distance = calculateDistance(lat, lon, city.lat, city.lon);
			if (distance < minDistance) {
				minDistance = distance;
				closestCity = city.name;
			}
		}

		return closestCity;
	};

	// 두 지점 간의 거리 계산 (Haversine formula)
	const calculateDistance = (lat1, lon1, lat2, lon2) => {
		const R = 6371; // 지구의 반지름 (km)
		const dLat = (lat2 - lat1) * Math.PI / 180;
		const dLon = (lon2 - lon1) * Math.PI / 180;
		const a = 
			Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
			Math.sin(dLon/2) * Math.sin(dLon/2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		return R * c;
	};

	// 도시명으로 날씨 가져오기
	const getWeatherByCity = async (cityName) => {
		try {
			const response = await axios.get(
				`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
			);
			setWeather(response.data);
			setCurrentCity(response.data.name);
			setLoading(false);
		} catch (error) {
			console.error("날씨 정보를 가져올 수 없습니다:", error);
			setLoading(false);
		}
	};



	useEffect(() => {
		// 404.html에서 리다이렉트된 URL 처리
		const redirectPath = sessionStorage.getItem('redirect');
		if (redirectPath) {
			sessionStorage.removeItem('redirect');
			navigate(redirectPath);
			return;
		}

		// 현재 위치 기반으로 날씨 가져오기
		getCurrentLocation();
	}, [navigate]);

	if (loading) {
		return (
			<div className="loading">
				<div className="loading__spinner"></div>
				<p>현재 위치의 날씨 정보를 가져오는 중...</p>
			</div>
		);
	}

	return (
		<>
			<Helmet>
				<title>🌤️ 갈래말래 날씨여행 - 전국 날씨 정보</title>
				<meta name="description" content="전국 주요 도시의 실시간 날씨 정보를 확인하세요. 서울, 경기도, 강원도 등 10개 지역의 날씨를 제공합니다." />
				<meta name="keywords" content="날씨, 기상, 온도, 날씨앱, 한국날씨" />
				<meta property="og:title" content="🌤️ 날씨 웹앱 - 전국 날씨 정보" />
				<meta property="og:description" content="전국 주요 도시의 실시간 날씨 정보를 확인하세요." />
				<meta property="og:type" content="website" />
			</Helmet>
			
			{/* 현재 위치 안내 */}
			{locationError && (
				<div className="location-notice">
					<p>📍 위치 정보를 가져올 수 없어 서울의 날씨를 표시합니다.</p>
				</div>
			)}

			{/* 날씨 정보 섹션 */}
			{weather && (
				<div className="weather-section">
					{/* 메인 날씨 정보 */}
					<div className="weather-main">
						<div className="weather-main__info">
							<h2 className="weather-main__city">
								{getKoreanCityName(weather.name)} {weather.name}
							</h2>
							<div className="weather-main__temperature">
								{Math.round(weather.main.temp)}°C
							</div>
							<p className="weather-main__description">
								{getKoreanWeatherDescription(weather.weather[0].main, weather.weather[0].description)}
							</p>
						</div>
						<div className="weather-main__icon">
							{getWeatherIcon(weather.weather[0].main, weather.weather[0].description)}
						</div>
					</div>

					{/* 날씨 세부 정보 */}
					<div className="weather-details">
						<div className="weather-details__item">
							<h3>온도</h3>
							<p>{Math.round(weather.main.temp)}°C</p>
						</div>
						<div className="weather-details__item">
							<h3>습도</h3>
							<p>{weather.main.humidity}%</p>
						</div>
						<div className="weather-details__item">
							<h3>기압</h3>
							<p>{weather.main.pressure} hPa</p>
						</div>
						<div className="weather-details__item">
							<h3>풍속</h3>
							<p>{weather.wind?.speed || 0} km/h</p>
						</div>
					</div>
				</div>
			)}

			{/* 행사 정보 */}
			{weather && (
				<div className="events-section">
					<h2 className="events-section__title">행사</h2>
					<EventInfo 
						regionName={getRegionFromCity(currentCity)}
						cityName={getKoreanCityName(currentCity)}
					/>
				</div>
			)}
		</>
	);
}

export default App;
