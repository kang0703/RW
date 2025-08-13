import { useState, useEffect } from 'react';
import { API_KEYS, API_ENDPOINTS, API_SETTINGS } from '../../config/api';
import './Location.scss';

const Location = ({ onLocationSelect }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [error, setError] = useState(null);

  // 주요 도시 목록
  const majorCities = [
    { name: '서울', lat: 37.5665, lon: 126.9780, region: '서울특별시' },
    { name: '부산', lat: 35.1796, lon: 129.0756, region: '부산광역시' },
    { name: '대구', lat: 35.8714, lon: 128.6014, region: '대구광역시' },
    { name: '인천', lat: 37.4563, lon: 126.7052, region: '인천광역시' },
    { name: '광주', lat: 35.1595, lon: 126.8526, region: '광주광역시' },
    { name: '대전', lat: 36.3504, lon: 127.3845, region: '대전광역시' },
    { name: '울산', lat: 35.5384, lon: 129.3114, region: '울산광역시' },
    { name: '세종', lat: 36.4800, lon: 127.2890, region: '세종특별자치시' },
    { name: '제주', lat: 33.4996, lon: 126.5312, region: '제주특별자치도' },
    { name: '강릉', lat: 37.7519, lon: 128.8759, region: '강원도' },
    { name: '춘천', lat: 37.8813, lon: 127.7300, region: '강원도' },
    { name: '원주', lat: 37.3422, lon: 127.9202, region: '강원도' },
    { name: '속초', lat: 38.1667, lon: 128.4667, region: '강원도' },
    { name: '평창', lat: 37.3700, lon: 128.3900, region: '강원도' },
    { name: '수원', lat: 37.2636, lon: 127.0286, region: '경기도' },
    { name: '성남', lat: 37.4449, lon: 127.1389, region: '경기도' },
    { name: '의정부', lat: 37.7381, lon: 127.0338, region: '경기도' },
    { name: '안양', lat: 37.4563, lon: 126.7052, region: '경기도' },
    { name: '부천', lat: 37.5035, lon: 126.7060, region: '경기도' },
    { name: '광명', lat: 37.4792, lon: 126.8649, region: '경기도' },
    { name: '평택', lat: 36.9920, lon: 127.1128, region: '경기도' },
    { name: '동탄', lat: 37.1996, lon: 127.0724, region: '경기도' },
    { name: '천안', lat: 36.8150, lon: 127.1139, region: '충청남도' },
    { name: '청주', lat: 36.6424, lon: 127.4890, region: '충청북도' },
    { name: '충주', lat: 36.9910, lon: 127.9260, region: '충청북도' },
    { name: '전주', lat: 35.8242, lon: 127.1479, region: '전라북도' },
    { name: '익산', lat: 35.9483, lon: 126.9579, region: '전라북도' },
    { name: '군산', lat: 35.9674, lon: 126.7368, region: '전라북도' },
    { name: '여수', lat: 34.7604, lon: 127.6622, region: '전라남도' },
    { name: '순천', lat: 34.9506, lon: 127.4872, region: '전라남도' },
    { name: '목포', lat: 34.8161, lon: 126.4629, region: '전라남도' },
    { name: '포항', lat: 36.0320, lon: 129.3650, region: '경상북도' },
    { name: '경주', lat: 35.8562, lon: 129.2247, region: '경상북도' },
    { name: '구미', lat: 36.1195, lon: 128.3446, region: '경상북도' },
    { name: '안동', lat: 36.5684, lon: 128.7294, region: '경상북도' },
    { name: '창원', lat: 35.2278, lon: 128.6817, region: '경상남도' },
    { name: '진주', lat: 35.1796, lon: 128.1074, region: '경상남도' },
    { name: '통영', lat: 34.8542, lon: 128.4330, region: '경상남도' },
    { name: '거제', lat: 34.8805, lon: 128.6211, region: '경상남도' }
  ];

  useEffect(() => {
    getCurrentLocation();
  }, []);

  // 좌표를 도시명으로 변환하는 역지오코딩 함수
  const reverseGeocode = async (lat, lon) => {
    // API 사용 설정 확인
    if (!API_SETTINGS.USE_KAKAO_MAP_API) {
      console.log('카카오맵 API 사용 비활성화됨 - 더미데이터 사용');
      // 간단한 더미데이터 반환
      return '현재 위치 (더미데이터)';
    }

    try {
      const response = await fetch(
        `${API_ENDPOINTS.KAKAO_MAP_BASE}/geo/coord2address.json?x=${lon}&y=${lat}`,
        {
          headers: {
            'Authorization': `KakaoAK ${API_KEYS.KAKAO_MAP}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('역지오코딩에 실패했습니다.');
      }

      const data = await response.json();
      if (data.documents && data.documents.length > 0) {
        const address = data.documents[0].address;
        // 시/도와 구/군 정보를 조합하여 도시명 생성
        let cityName = '';
        if (address.region_1depth_name && address.region_2depth_name) {
          cityName = `${address.region_1depth_name} ${address.region_2depth_name}`;
        } else if (address.region_1depth_name) {
          cityName = address.region_1depth_name;
        } else if (address.region_2depth_name) {
          cityName = address.region_2depth_name;
        } else {
          cityName = '알 수 없는 위치';
        }
        return cityName;
      }
      return '알 수 없는 위치';
    } catch (err) {
      console.error('역지오코딩 오류:', err);
      return '알 수 없는 위치';
    }
  };

  const getCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lon: longitude });
          
          // 역지오코딩을 통해 실제 도시명 가져오기
          const cityName = await reverseGeocode(latitude, longitude);
          onLocationSelect({ lat: latitude, lon: longitude }, cityName);
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error);
          setError('위치 정보를 가져올 수 없습니다.');
        }
      );
    } else {
      setError('이 브라우저는 위치 정보를 지원하지 않습니다.');
    }
  };

  // 셀렉트 박스에서 도시 선택
  const handleCitySelect = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    
    if (cityName) {
      const city = majorCities.find(city => city.name === cityName);
      if (city) {
        onLocationSelect({ lat: city.lat, lon: city.lon }, city.name);
      }
    }
  };

  const handleCurrentLocationClick = async () => {
    setSelectedCity('');
    await getCurrentLocation();
  };

  return (
    <div className="location">
      <div className="location-header">
        <h3>📍 위치 선택</h3>
        <button 
          className="current-location-btn"
          onClick={handleCurrentLocationClick}
        >
          📍 현재 위치
        </button>
      </div>

      {/* 주요 도시 셀렉트 박스 */}
      <div className="city-selector">
        <label htmlFor="city-select">🏙️ 도시 선택</label>
        <select
          id="city-select"
          value={selectedCity}
          onChange={handleCitySelect}
          className="city-select"
        >
          <option value="">도시를 선택하세요</option>
          {majorCities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name} ({city.region})
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
          <button 
            onClick={() => setError(null)}
            className="error-close-btn"
          >
            닫기
          </button>
        </div>
      )}

      {currentLocation && (
        <div className="current-location-info">
          <h4>📍 현재 선택된 위치</h4>
          <p>
            위도: {currentLocation.lat.toFixed(4)}, 
            경도: {currentLocation.lon.toFixed(4)}
          </p>
        </div>
      )}
    </div>
  );
};

export default Location;
