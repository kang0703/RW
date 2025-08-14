import { useState, useEffect } from 'react';
import { API_KEYS, API_ENDPOINTS, API_SETTINGS, checkApiKeys } from '../../config/api';
import './Weather.scss';

const Weather = ({ city, coordinates, isLocationSelected }) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('idle');
  const [cityName, setCityName] = useState(city || '서울특별시'); // 지역명 상태 추가
  const [lastUpdated, setLastUpdated] = useState(null); // 마지막 업데이트 시간

    useEffect(() => {
    if (coordinates && coordinates.lat && coordinates.lon) {
      console.log('🌤️ Weather: useEffect 실행됨', { coordinates, city });
      fetchWeatherData();
    }
  }, [coordinates?.lat, coordinates?.lon]); // 좌표만 변경될 때만 실행

  const fetchWeatherData = async () => {
    try {
      console.log('🌤️ Weather: 날씨 데이터 요청 시작', { coordinates, city });
      setLoading(true);
      setError(null);
      
      // API 키 상태 확인
      const apiStatus = checkApiKeys();
      console.log('🔑 Weather: API 키 상태:', apiStatus);
      
      // API 사용 설정 확인
      if (!API_SETTINGS.USE_OPENWEATHER_API) {
        const errorMsg = 'OpenWeather API 키가 설정되지 않아 날씨 정보를 가져올 수 없습니다.';
        console.error('❌ Weather:', errorMsg);
        setError(errorMsg);
        setApiStatus('disabled');
        setLoading(false);
        return;
      }

      // 현재 날씨 데이터 가져오기
      const currentUrl = `${API_ENDPOINTS.OPENWEATHER_BASE}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEYS.OPENWEATHER}&units=metric&lang=kr`;
      console.log('🌐 Weather: 현재 날씨 API 요청 URL:', currentUrl);
      
      const currentResponse = await fetch(currentUrl);
      console.log('📡 Weather: 현재 날씨 API 응답 상태:', currentResponse.status);
      
      if (!currentResponse.ok) {
        const errorText = await currentResponse.text();
        console.error('❌ Weather: 현재 날씨 API 오류 응답:', errorText);
        throw new Error(`날씨 데이터를 가져올 수 없습니다. (${currentResponse.status})`);
      }
      
      const currentData = await currentResponse.json();
      console.log('✅ Weather: 현재 날씨 데이터 수신:', currentData);
      
      // OpenWeatherMap API 응답에서 지역명 추출
      const extractedCityName = currentData.name || city || '알 수 없는 위치';
      console.log('🏙️ Weather: 추출된 도시명:', extractedCityName);
      
      // 영문 도시명을 한국어로 변환
      const koreanCityName = getKoreanCityName(extractedCityName);
      console.log('🇰🇷 Weather: 한국어 도시명:', koreanCityName);
      setCityName(koreanCityName);
      setCurrentWeather(currentData);

      // 5일 예보 데이터 가져오기
      const forecastUrl = `${API_ENDPOINTS.OPENWEATHER_BASE}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEYS.OPENWEATHER}&units=metric&lang=kr`;
      console.log('🌐 Weather: 5일 예보 API 요청 URL:', forecastUrl);
      
      const forecastResponse = await fetch(forecastUrl);
      console.log('📡 Weather: 5일 예보 API 응답 상태:', forecastResponse.status);
      
      if (!forecastResponse.ok) {
        const errorText = await forecastResponse.text();
        console.error('❌ Weather: 5일 예보 API 오류 응답:', errorText);
        throw new Error(`예보 데이터를 가져올 수 없습니다. (${forecastResponse.status})`);
      }
      
      const forecastData = await forecastResponse.json();
      console.log('✅ Weather: 5일 예보 데이터 수신:', forecastData);
      setForecast(forecastData);
      
      // 마지막 업데이트 시간 설정
      setLastUpdated(new Date());
      
      setApiStatus('success');
      console.log('🎉 Weather: 모든 날씨 데이터 로드 완료!');
      
    } catch (err) {
      console.error('❌ Weather: 날씨 데이터 가져오기 오류:', err);
      setError(err.message);
      setApiStatus('error');
      // 에러 시 상태 초기화
      setCurrentWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (weatherCode) => {
    // OpenWeatherMap 날씨 코드별 아이콘 매핑
    const icons = {
      // 맑음 (Clear)
      800: '☀️',
      
      // 구름 (Clouds)
      801: '🌤️', // 구름 조금
      802: '⛅', // 구름 많음
      803: '☁️', // 흐림
      804: '☁️', // 매우 흐림
      
      // 비 (Rain)
      200: '⛈️', // 천둥번개 + 가벼운 비
      201: '⛈️', // 천둥번개 + 비
      202: '⛈️', // 천둥번개 + 강한 비
      210: '⛈️', // 가벼운 천둥번개
      211: '⛈️', // 천둥번개
      212: '⛈️', // 강한 천둥번개
      221: '⛈️', // 매우 강한 천둥번개
      230: '⛈️', // 천둥번개 + 가벼운 소나기
      231: '⛈️', // 천둥번개 + 소나기
      232: '⛈️', // 천둥번개 + 강한 소나기
      
      // 소나기 (Drizzle)
      300: '🌦️', // 가벼운 소나기
      301: '🌦️', // 소나기
      302: '🌦️', // 강한 소나기
      310: '🌦️', // 가벼운 소나기 + 비
      311: '🌦️', // 소나기 + 비
      312: '🌦️', // 강한 소나기 + 비
      313: '🌦️', // 소나기 + 강한 비
      314: '🌦️', // 강한 소나기 + 강한 비
      321: '🌦️', // 소나기
      
      // 비 (Rain)
      500: '🌧️', // 가벼운 비
      501: '🌧️', // 적당한 비
      502: '🌧️', // 강한 비
      503: '🌧️', // 매우 강한 비
      504: '🌧️', // 극도로 강한 비
      511: '🌧️', // 차가운 비
      520: '🌧️', // 가벼운 소나기
      521: '🌧️', // 소나기
      522: '🌧️', // 강한 소나기
      531: '🌧️', // 매우 강한 소나기
      
      // 눈 (Snow)
      600: '❄️', // 가벼운 눈
      601: '❄️', // 눈
      602: '❄️', // 강한 눈
      611: '❄️', // 진눈깨비
      612: '❄️', // 가벼운 진눈깨비
      613: '❄️', // 진눈깨비
      615: '❄️', // 가벼운 비 + 눈
      616: '❄️', // 비 + 눈
      620: '❄️', // 가벼운 소나기 + 눈
      621: '❄️', // 소나기 + 눈
      622: '❄️', // 강한 소나기 + 눈
      
      // 대기 (Atmosphere)
      701: '🌫️', // 안개
      711: '🌫️', // 연기
      721: '🌫️', // 연무
      731: '🌫️', // 모래/먼지 소용돌이
      741: '🌫️', // 안개
      751: '🌫️', // 모래
      761: '🌫️', // 먼지
      762: '🌫️', // 화산재
      771: '🌫️', // 돌풍
      781: '🌫️', // 토네이도
      
      // 극한 (Extreme)
      900: '🌪️', // 토네이도
      901: '🌪️', // 열대성 폭풍
      902: '🌪️', // 허리케인
      903: '❄️', // 추위
      904: '🔥', // 더위
      905: '💨', // 바람
      906: '🧊', // 우박
      
      // 추가 (Additional)
      951: '💨', // 바람 없음
      952: '💨', // 가벼운 바람
      953: '💨', // 부드러운 바람
      954: '💨', // 적당한 바람
      955: '💨', // 신선한 바람
      956: '💨', // 강한 바람
      957: '💨', // 매우 강한 바람
      958: '💨', // 폭풍
      959: '💨', // 매우 강한 폭풍
      960: '🌪️', // 폭풍
      961: '🌪️', // 매우 강한 폭풍
      962: '🌪️', // 허리케인
    };
    
    return icons[weatherCode] || '🌤️';
  };

  const getWeatherAdvice = (weatherCode, temp) => {
    // OpenWeatherMap 날씨 코드별 조언
    if (weatherCode >= 200 && weatherCode < 300) {
      return '⛈️ 뇌우가 예상됩니다. 실외 활동을 자제하고 안전한 곳에 머무르세요.';
    } else if (weatherCode >= 300 && weatherCode < 400) {
      return '🌦️ 소나기가 예상됩니다. 우산을 챙기시고 젖은 길을 조심하세요.';
    } else if (weatherCode >= 500 && weatherCode < 600) {
      return '🌧️ 비가 예상됩니다. 우산을 챙기시고 젖은 길을 조심하세요.';
    } else if (weatherCode >= 600 && weatherCode < 700) {
      return '❄️ 눈이 예상됩니다. 눈길 운전에 주의하고 미끄러운 길을 피하세요.';
    } else if (weatherCode >= 700 && weatherCode < 800) {
      return '🌫️ 안개가 예상됩니다. 시야가 좋지 않으니 운전과 보행에 주의하세요.';
    } else if (weatherCode === 800) {
      if (temp > 25) {
        return '☀️ 맑고 더운 날씨입니다. 자외선 차단제와 충분한 수분 섭취를 하세요.';
      } else if (temp < 0) {
        return '☀️ 맑지만 추운 날씨입니다. 따뜻하게 입고 외출하세요.';
      } else {
        return '☀️ 맑고 좋은 날씨입니다. 즐거운 하루 되세요!';
      }
    } else if (weatherCode >= 801 && weatherCode <= 804) {
      if (temp > 30) {
        return '☁️ 흐린 날씨이지만 더울 수 있습니다. 충분한 수분 섭취를 하세요.';
      } else if (temp < 0) {
        return '☁️ 흐린 날씨이지만 추울 수 있습니다. 따뜻하게 입고 외출하세요.';
      } else {
        return '☁️ 흐린 날씨입니다. 적절한 옷차림으로 외출하세요.';
      }
    } else if (weatherCode >= 900 && weatherCode <= 906) {
      return '⚠️ 극한 날씨가 예상됩니다. 외출을 자제하고 안전에 주의하세요.';
    } else if (weatherCode >= 951 && weatherCode <= 962) {
      if (weatherCode >= 960) {
        return '🌪️ 강한 바람이 예상됩니다. 외출을 자제하고 안전에 주의하세요.';
      } else {
        return '💨 바람이 예상됩니다. 모자나 스카프를 챙기세요.';
      }
    }
    
    // 기본 조언
    if (temp > 30) {
      return '🔥 더운 날씨입니다. 충분한 수분 섭취와 휴식을 취하세요.';
    } else if (temp < 0) {
      return '❄️ 추운 날씨입니다. 따뜻하게 입고 외출하세요.';
    } else {
      return '🌤️ 좋은 날씨입니다. 즐거운 하루 되세요!';
    }
  };

  // 영문 도시명을 한국어로 변환하는 함수 (개선된 버전)
  const getKoreanCityName = (englishName) => {
    
    // "현재 위치" 텍스트인 경우 처리
    if (englishName === '현재 위치') {
      return '현재 위치';
    }
    
    const cityNameMap = {
      // 주요 도시
      'Seoul': '서울',
      'Busan': '부산',
      'Daegu': '대구',
      'Incheon': '인천',
      'Gwangju': '광주',
      'Daejeon': '대전',
      'Ulsan': '울산',
      'Sejong': '세종',
      'Jeju': '제주',
      
      // 서울특별시 구별
      'Gangnam-gu': '강남구',
      'Seocho-gu': '서초구',
      'Mapo-gu': '마포구',
      'Yongsan-gu': '용산구',
      'Jongno-gu': '종로구',
      'Jung-gu': '중구',
      'Seongbuk-gu': '성북구',
      'Dongdaemun-gu': '동대문구',
      'Gwangjin-gu': '광진구',
      'Seongdong-gu': '성동구',
      'Gangbuk-gu': '강북구',
      'Dobong-gu': '도봉구',
      'Nowon-gu': '노원구',
      'Eunpyeong-gu': '은평구',
      'Seodaemun-gu': '서대문구',
      'Gangseo-gu': '강서구',
      'Yangcheon-gu': '양천구',
      'Guro-gu': '구로구',
      'Geumcheon-gu': '금천구',
      'Yeongdeungpo-gu': '영등포구',
      'Dongjak-gu': '동작구',
      'Gwanak-gu': '관악구',
      'Songpa-gu': '송파구',
      'Gangdong-gu': '강동구',
      
      // 서울특별시 동별 (구 단위로 변환)
      "Sup'yŏng-dong": '서대문구',
      "Sŏngbuk-dong": '성북구',
      "Myŏngnyun-dong": '종로구',
      "Ch'ŏngun-dong": '종로구',
      "Sajik-dong": '종로구',
      "Hyoja-dong": '종로구',
      "Ch'ŏngun-dong": '종로구',
      "Sŏngbuk-dong": '성북구',
      "Anam-dong": '성북구',
      "Tongin-dong": '종로구',
      "Ch'ŏngun-dong": '종로구',
      "Sajik-dong": '종로구',
      "Hyoja-dong": '종로구',
      "Ch'ŏngun-dong": '종로구',
      "Sŏngbuk-dong": '성북구',
      "Anam-dong": '성북구',
      "Tongin-dong": '종로구',
      
      // 경기도 주요 도시
      'Suwon': '수원',
      'Goyang': '고양',
      'Yongin': '용인',
      'Seongnam': '성남',
      'Bucheon': '부천',
      'Ansan': '안산',
      'Namyangju': '남양주',
      'Hwaseong': '화성',
      'Pyeongtaek': '평택',
      'Uijeongbu': '의정부',
      'Paju': '파주',
      'Gwangmyeong': '광명',
      'Icheon': '이천',
      'Gimpo': '김포',
      'Gunpo': '군포',
      'Hanam': '하남',
      'Osan': '오산',
      'Anyang': '안양',
      'Gwacheon': '과천',
      'Uiwang': '의왕',
      'Guri': '구리',
      'Dongducheon': '동두천',
      'Yangju': '양주',
      'Pocheon': '포천',
      'Yeoju': '여주',
      'Yeoncheon': '연천',
      'Gapyeong': '가평',
      'Yangpyeong': '양평',
      
      // 강원도
      'Chuncheon': '춘천',
      'Wonju': '원주',
      'Gangneung': '강릉',
      'Donghae': '동해',
      'Taebaek': '태백',
      'Sokcho': '속초',
      'Samcheok': '삼척',
      'Hongcheon': '홍천',
      'Hoengseong': '횡성',
      'Yeongwol': '영월',
      'Pyeongchang': '평창',
      'Jeongseon': '정선',
      'Cheorwon': '철원',
      'Hwacheon': '화천',
      'Yanggu': '양구',
      'Inje': '인제',
      'Goseong': '고성',
      'Yangyang': '양양',
      
      // 충청북도
      'Cheongju': '청주',
      'Chungju': '충주',
      'Jecheon': '제천',
      'Eumseong': '음성',
      'Jincheon': '진천',
      'Goesan': '괴산',
      'Jeungpyeong': '증평',
      'Danyang': '단양',
      'Boeun': '보은',
      'Okcheon': '옥천',
      'Yeongdong': '영동',
      'Geumsan': '금산',
      
      // 충청남도
      'Cheonan': '천안',
      'Gongju': '공주',
      'Boryeong': '보령',
      'Asan': '아산',
      'Seosan': '서산',
      'Nonsan': '논산',
      'Gyeryong': '계룡',
      'Buyeo': '부여',
      'Seocheon': '서천',
      'Cheongyang': '청양',
      'Hongseong': '홍성',
      'Yesan': '예산',
      'Taean': '태안',
      'Dangjin': '당진',
      
      // 전라북도
      'Jeonju': '전주',
      'Gunsan': '군산',
      'Iksan': '익산',
      'Jeongeup': '정읍',
      'Namwon': '남원',
      'Gimje': '김제',
      'Wanju': '완주',
      'Jinan': '진안',
      'Muju': '무주',
      'Jangsu': '장수',
      'Imsil': '임실',
      'Sunchang': '순창',
      'Gochang': '고창',
      'Buan': '부안',
      
      // 전라남도
      'Mokpo': '목포',
      'Yeosu': '여수',
      'Suncheon': '순천',
      'Naju': '나주',
      'Gwangyang': '광양',
      'Damyang': '담양',
      'Gokseong': '곡성',
      'Gurye': '구례',
      'Goheung': '고흥',
      'Boseong': '보성',
      'Hwasun': '화순',
      'Jangheung': '장흥',
      'Gangjin': '강진',
      'Haenam': '해남',
      'Yeongam': '영암',
      'Muan': '무안',
      'Hampyeong': '함평',
      'Yeonggwang': '영광',
      'Jangseong': '장성',
      'Wando': '완도',
      'Jindo': '진도',
      'Sinan': '신안',
      
      // 경상북도
      'Pohang': '포항',
      'Gyeongju': '경주',
      'Gimcheon': '김천',
      'Andong': '안동',
      'Gumi': '구미',
      'Yeongju': '영주',
      'Yeongcheon': '영천',
      'Sangju': '상주',
      'Mungyeong': '문경',
      'Gyeongsan': '경산',
      'Uiseong': '의성',
      'Cheongsong': '청송',
      'Yeongyang': '영양',
      'Yeongdeok': '영덕',
      'Cheongdo': '청도',
      'Goryeong': '고령',
      'Seongju': '성주',
      'Chilgok': '칠곡',
      'Yecheon': '예천',
      'Bonghwa': '봉화',
      'Uljin': '울진',
      'Ulleung': '울릉',
      
      // 경상남도
      'Changwon': '창원',
      'Jinju': '진주',
      'Tongyeong': '통영',
      'Sacheon': '사천',
      'Gimhae': '김해',
      'Miryang': '밀양',
      'Geoje': '거제',
      'Yangsan': '양산',
      'Uiryeong': '의령',
      'Haman': '함안',
      'Changnyeong': '창녕',
      'Goseong': '고성',
      'Namhae': '남해',
      'Hadong': '하동',
      'Sancheong': '산청',
      'Hamyang': '함양',
      'Geochang': '거창',
      'Hapcheon': '합천',
      
      // 제주특별자치도
      'Jeju City': '제주시',
      'Seogwipo': '서귀포시'
    };
    
    // 매핑된 한국어 도시명이 있으면 반환, 없으면 원본 반환
    const result = cityNameMap[englishName] || englishName;
    
    // 디버깅을 위한 로그
    if (result === englishName) {
      console.log('⚠️ 도시명 변환 실패:', englishName);
    } else {
      console.log('✅ 도시명 변환 성공:', englishName, '→', result);
    }
    
    return result;
  };

  // 5일 예보 데이터를 하루별로 그룹화하는 함수
  const getDailyForecast = (list) => {
    const dailyForecast = {};
    
    // 한국 시간대 기준으로 날짜 계산
    list.forEach(item => {
      // UTC 시간을 한국 시간으로 변환 (UTC+9)
      const koreanTime = new Date(item.dt * 1000 + 9 * 60 * 60 * 1000);
      const dateKey = koreanTime.toISOString().slice(0, 10); // YYYY-MM-DD
      
      if (!dailyForecast[dateKey]) {
        dailyForecast[dateKey] = {
          date: dateKey,
          weatherId: item.weather[0].id,
          maxTemp: item.main.temp,
          minTemp: item.main.temp,
          weatherDescription: item.weather[0].description,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
          pop: item.pop, // 강수 확률
        };
      } else {
        // 같은 날짜의 데이터 중 최고/최저 온도 업데이트
        dailyForecast[dateKey].maxTemp = Math.max(dailyForecast[dateKey].maxTemp, item.main.temp);
        dailyForecast[dateKey].minTemp = Math.min(dailyForecast[dateKey].minTemp, item.main.temp);
        
        // 가장 자주 나타나는 날씨 상태를 대표로 사용
        if (item.pop > dailyForecast[dateKey].pop) {
          dailyForecast[dateKey].weatherId = item.weather[0].id;
          dailyForecast[dateKey].weatherDescription = item.weather[0].description;
          dailyForecast[dateKey].pop = item.pop;
        }
      }
    });
    
    // 날짜순으로 정렬하고 최대 5일까지만 반환
    const sortedForecast = Object.values(dailyForecast)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
    
    console.log('📅 5일 예보 데이터 처리 완료:', sortedForecast);
    return sortedForecast;
  };

  // 날짜 형식을 원하는 형태로 변환하는 함수
  const formatForecastDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // 오늘인지 내일인지 확인
    if (date.toDateString() === today.toDateString()) {
      return '오늘';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return '내일';
    } else {
      // 요일과 날짜 표시
      return date.toLocaleDateString('ko-KR', { 
        month: 'short', 
        day: 'numeric',
        weekday: 'short'
      });
    }
  };

  if (loading) {
    return (
      <div className="weather weather--loading">
        <div className="loading-spinner">🌤️</div>
        <p>날씨 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !currentWeather) {
    return (
      <div className="weather weather--error">
        <p>❌ {error || '날씨 정보를 가져올 수 없습니다.'}</p>
        <button onClick={fetchWeatherData} className="retry-btn">
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="weather">
      <div className="weather-header">
        <div className="weather-location">
          {!isLocationSelected && (
            <span className="current-location-text">📍 현재 위치</span>
          )}
          <h2 className="city-name">
            <span className="selected-city">📍 {cityName}</span>
          </h2>
        </div>
        
        {/* 마지막 업데이트 시간 및 새로고침 버튼 */}
        <div className="weather-controls">
          {lastUpdated && (
            <div className="last-updated">
              마지막 업데이트: {lastUpdated.toLocaleTimeString('ko-KR')}
            </div>
          )}
          <button 
            className="refresh-btn"
            onClick={fetchWeatherData}
            disabled={loading}
          >
            {loading ? '🔄 새로고침 중...' : '🔄 새로고침'}
          </button>
        </div>
      </div>
      
      <div className="weather-current">
        <div className="weather-main">
          <div className="weather-icon">
            {getWeatherIcon(currentWeather.weather[0].id)}
          </div>
          <div className="weather-info">
            <div className="temperature">
              {Math.round(currentWeather.main.temp)}°C
            </div>
            <div className="description">
              {currentWeather.weather[0].description}
            </div>
          </div>
        </div>
        
        <div className="weather-details">
          <div className="detail-item">
            <span className="label">습도</span>
            <span className="value">{currentWeather.main.humidity}%</span>
          </div>
          <div className="detail-item">
            <span className="label">풍속</span>
            <span className="value">{currentWeather.wind.speed}m/s</span>
          </div>
          <div className="detail-item">
            <span className="label">체감온도</span>
            <span className="value">{Math.round(currentWeather.main.feels_like)}°C</span>
          </div>
        </div>

        <div className="weather-advice">
          <h4>🌡️ 날씨별 대처방법</h4>
          <p>{getWeatherAdvice(currentWeather.weather[0].id, currentWeather.main.temp)}</p>
        </div>
      </div>

      {forecast && (
        <div className="weather-forecast">
          <h3>📅 5일 날씨 예보</h3>
          <div className="forecast-list">
            {getDailyForecast(forecast.list).map((dayForecast, index) => (
              <div key={index} className="forecast-item">
                <div className="forecast-date">
                  {formatForecastDate(dayForecast.date)}
                </div>
                <div className="forecast-icon">
                  {getWeatherIcon(dayForecast.weatherId)}
                </div>
                <div className="forecast-temp">
                  {Math.round(dayForecast.maxTemp)}°C
                </div>
                <div className="forecast-min-temp">
                  {Math.round(dayForecast.minTemp)}°C
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
