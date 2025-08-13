import { useState, useEffect } from 'react';
import { API_KEYS, API_ENDPOINTS, API_SETTINGS } from '../../config/api';
import './Location.scss';

const Location = ({ onLocationSelect }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [error, setError] = useState(null);

  // 지역별 도시 그룹 구성
  const cityGroups = {
    '서울특별시': [
      { name: '서울', lat: 37.5665, lon: 126.9780, region: '서울특별시' }
    ],
    '부산광역시': [
      { name: '부산', lat: 35.1796, lon: 129.0756, region: '부산광역시' }
    ],
    '대구광역시': [
      { name: '대구', lat: 35.8714, lon: 128.6014, region: '대구광역시' }
    ],
    '인천광역시': [
      { name: '인천', lat: 37.4563, lon: 126.7052, region: '인천광역시' }
    ],
    '광주광역시': [
      { name: '광주', lat: 35.1595, lon: 126.8526, region: '광주광역시' }
    ],
    '대전광역시': [
      { name: '대전', lat: 36.3504, lon: 127.3845, region: '대전광역시' }
    ],
    '울산광역시': [
      { name: '울산', lat: 35.5384, lon: 129.3114, region: '울산광역시' }
    ],
    '세종특별자치시': [
      { name: '세종', lat: 36.4800, lon: 127.2890, region: '세종특별자치시' }
    ],
    '경기도': [
      { name: '수원', lat: 37.2636, lon: 127.0286, region: '경기도' },
      { name: '고양', lat: 37.6584, lon: 126.8320, region: '경기도' },
      { name: '용인', lat: 37.2411, lon: 127.1776, region: '경기도' },
      { name: '성남', lat: 37.4449, lon: 127.1389, region: '경기도' },
      { name: '부천', lat: 37.5035, lon: 126.7060, region: '경기도' },
      { name: '안산', lat: 37.3219, lon: 126.8309, region: '경기도' },
      { name: '남양주', lat: 37.6364, lon: 127.2160, region: '경기도' },
      { name: '화성', lat: 37.1996, lon: 126.8319, region: '경기도' },
      { name: '평택', lat: 36.9920, lon: 127.1128, region: '경기도' },
      { name: '의정부', lat: 37.7381, lon: 127.0338, region: '경기도' },
      { name: '파주', lat: 37.8154, lon: 126.7928, region: '경기도' },
      { name: '광명', lat: 37.4792, lon: 126.8649, region: '경기도' },
      { name: '이천', lat: 37.2720, lon: 127.4350, region: '경기도' },
      { name: '김포', lat: 37.6154, lon: 126.7156, region: '경기도' },
      { name: '군포', lat: 37.3616, lon: 126.9350, region: '경기도' },
      { name: '하남', lat: 37.5392, lon: 127.2149, region: '경기도' },
      { name: '오산', lat: 37.1498, lon: 127.0772, region: '경기도' },
      { name: '안양', lat: 37.4563, lon: 126.7052, region: '경기도' },
      { name: '과천', lat: 37.4291, lon: 126.9879, region: '경기도' },
      { name: '의왕', lat: 37.3446, lon: 126.9483, region: '경기도' },
      { name: '구리', lat: 37.5944, lon: 127.1296, region: '경기도' },
      { name: '동두천', lat: 37.9036, lon: 127.0606, region: '경기도' },
      { name: '양주', lat: 37.8324, lon: 127.0462, region: '경기도' },
      { name: '포천', lat: 37.8945, lon: 127.2002, region: '경기도' },
      { name: '여주', lat: 37.2984, lon: 127.6370, region: '경기도' },
      { name: '연천', lat: 38.0966, lon: 127.0747, region: '경기도' },
      { name: '가평', lat: 37.8315, lon: 127.5105, region: '경기도' },
      { name: '양평', lat: 37.4914, lon: 127.4874, region: '경기도' }
    ],
    '강원도': [
      { name: '춘천', lat: 37.8813, lon: 127.7300, region: '강원도' },
      { name: '원주', lat: 37.3422, lon: 127.9202, region: '강원도' },
      { name: '강릉', lat: 37.7519, lon: 128.8759, region: '강원도' },
      { name: '동해', lat: 37.5236, lon: 129.1144, region: '강원도' },
      { name: '태백', lat: 37.1641, lon: 128.9856, region: '강원도' },
      { name: '속초', lat: 38.1667, lon: 128.4667, region: '강원도' },
      { name: '삼척', lat: 37.4499, lon: 129.1650, region: '강원도' },
      { name: '홍천', lat: 37.6969, lon: 127.8857, region: '강원도' },
      { name: '횡성', lat: 37.4917, lon: 127.9850, region: '강원도' },
      { name: '영월', lat: 37.1836, lon: 128.4617, region: '강원도' },
      { name: '평창', lat: 37.3700, lon: 128.3900, region: '강원도' },
      { name: '정선', lat: 37.3807, lon: 128.6600, region: '강원도' },
      { name: '철원', lat: 38.1466, lon: 127.3130, region: '강원도' },
      { name: '화천', lat: 38.1064, lon: 127.7080, region: '강원도' },
      { name: '양구', lat: 38.1054, lon: 127.9890, region: '강원도' },
      { name: '인제', lat: 38.0694, lon: 128.1700, region: '강원도' },
      { name: '고성', lat: 38.3784, lon: 128.4670, region: '강원도' },
      { name: '양양', lat: 38.0754, lon: 128.6190, region: '강원도' }
    ],
    '충청북도': [
      { name: '청주', lat: 36.6424, lon: 127.4890, region: '충청북도' },
      { name: '충주', lat: 36.9910, lon: 127.9260, region: '충청북도' },
      { name: '제천', lat: 37.1326, lon: 128.1910, region: '충청북도' },
      { name: '음성', lat: 36.9324, lon: 127.6890, region: '충청북도' },
      { name: '진천', lat: 36.8554, lon: 127.4350, region: '충청북도' },
      { name: '괴산', lat: 36.8154, lon: 127.7860, region: '충청북도' },
      { name: '증평', lat: 36.7844, lon: 127.5810, region: '충청북도' },
      { name: '단양', lat: 36.9844, lon: 128.3650, region: '충청북도' },
      { name: '보은', lat: 36.4894, lon: 127.7290, region: '충청북도' },
      { name: '옥천', lat: 36.3064, lon: 127.5710, region: '충청북도' },
      { name: '영동', lat: 36.1754, lon: 127.7760, region: '충청북도' },
      { name: '금산', lat: 36.1084, lon: 127.4890, region: '충청북도' }
    ],
    '충청남도': [
      { name: '천안', lat: 36.8150, lon: 127.1139, region: '충청남도' },
      { name: '공주', lat: 36.4614, lon: 127.1190, region: '충청남도' },
      { name: '보령', lat: 36.3334, lon: 126.6120, region: '충청남도' },
      { name: '아산', lat: 36.7904, lon: 127.0030, region: '충청남도' },
      { name: '서산', lat: 36.7844, lon: 126.4500, region: '충청남도' },
      { name: '논산', lat: 36.1874, lon: 127.0990, region: '충청남도' },
      { name: '계룡', lat: 36.2744, lon: 127.2490, region: '충청남도' },
      { name: '금산', lat: 36.1084, lon: 127.4890, region: '충청남도' },
      { name: '부여', lat: 36.2754, lon: 126.9090, region: '충청남도' },
      { name: '서천', lat: 36.0784, lon: 126.6910, region: '충청남도' },
      { name: '청양', lat: 36.4504, lon: 126.8020, region: '충청남도' },
      { name: '홍성', lat: 36.6014, lon: 126.6610, region: '충청남도' },
      { name: '예산', lat: 36.6794, lon: 126.8450, region: '충청남도' },
      { name: '태안', lat: 36.7454, lon: 126.2990, region: '충청남도' },
      { name: '당진', lat: 36.8934, lon: 126.6280, region: '충청남도' }
    ],
    '전라북도': [
      { name: '전주', lat: 35.8242, lon: 127.1479, region: '전라북도' },
      { name: '군산', lat: 35.9674, lon: 126.7368, region: '전라북도' },
      { name: '익산', lat: 35.9483, lon: 126.9579, region: '전라북도' },
      { name: '정읍', lat: 35.5664, lon: 126.8560, region: '전라북도' },
      { name: '남원', lat: 35.4164, lon: 127.3900, region: '전라북도' },
      { name: '김제', lat: 35.8034, lon: 126.8810, region: '전라북도' },
      { name: '완주', lat: 35.9044, lon: 127.1620, region: '전라북도' },
      { name: '진안', lat: 35.7914, lon: 127.4250, region: '전라북도' },
      { name: '무주', lat: 36.0074, lon: 127.6600, region: '전라북도' },
      { name: '장수', lat: 35.6474, lon: 127.5180, region: '전라북도' },
      { name: '임실', lat: 35.6144, lon: 127.2790, region: '전라북도' },
      { name: '순창', lat: 35.3744, lon: 127.1370, region: '전라북도' },
      { name: '고창', lat: 35.4354, lon: 126.7020, region: '전라북도' },
      { name: '부안', lat: 35.7314, lon: 126.7320, region: '전라북도' }
    ],
    '전라남도': [
      { name: '목포', lat: 34.8161, lon: 126.4629, region: '전라남도' },
      { name: '여수', lat: 34.7604, lon: 127.6622, region: '전라남도' },
      { name: '순천', lat: 34.9506, lon: 127.4872, region: '전라남도' },
      { name: '나주', lat: 35.0164, lon: 126.7100, region: '전라남도' },
      { name: '광양', lat: 34.9404, lon: 127.6950, region: '전라남도' },
      { name: '담양', lat: 35.3214, lon: 127.0030, region: '전라남도' },
      { name: '곡성', lat: 35.2824, lon: 127.2950, region: '전라남도' },
      { name: '구례', lat: 35.2024, lon: 127.4620, region: '전라남도' },
      { name: '고흥', lat: 34.6114, lon: 127.2850, region: '전라남도' },
      { name: '보성', lat: 34.7714, lon: 127.0810, region: '전라남도' },
      { name: '화순', lat: 35.0644, lon: 127.0080, region: '전라남도' },
      { name: '장흥', lat: 34.6814, lon: 126.9060, region: '전라남도' },
      { name: '강진', lat: 34.6424, lon: 126.7660, region: '전라남도' },
      { name: '해남', lat: 34.5714, lon: 126.5980, region: '전라남도' },
      { name: '영암', lat: 34.8004, lon: 126.6980, region: '전라남도' },
      { name: '무안', lat: 34.9904, lon: 126.4810, region: '전라남도' },
      { name: '함평', lat: 35.0664, lon: 126.5200, region: '전라남도' },
      { name: '영광', lat: 35.2774, lon: 126.5120, region: '전라남도' },
      { name: '장성', lat: 35.3074, lon: 126.7850, region: '전라남도' },
      { name: '완도', lat: 34.3114, lon: 126.7470, region: '전라남도' },
      { name: '진도', lat: 34.4864, lon: 126.2640, region: '전라남도' },
      { name: '신안', lat: 34.7904, lon: 126.4500, region: '전라남도' }
    ],
    '경상북도': [
      { name: '포항', lat: 36.0320, lon: 129.3650, region: '경상북도' },
      { name: '경주', lat: 35.8562, lon: 129.2247, region: '경상북도' },
      { name: '김천', lat: 36.1394, lon: 128.1130, region: '경상북도' },
      { name: '안동', lat: 36.5684, lon: 128.7294, region: '경상북도' },
      { name: '구미', lat: 36.1195, lon: 128.3446, region: '경상북도' },
      { name: '영주', lat: 36.8054, lon: 128.6240, region: '경상북도' },
      { name: '영천', lat: 35.9734, lon: 128.9380, region: '경상북도' },
      { name: '상주', lat: 36.4114, lon: 128.1590, region: '경상북도' },
      { name: '문경', lat: 36.5944, lon: 128.1860, region: '경상북도' },
      { name: '경산', lat: 35.8254, lon: 128.7380, region: '경상북도' },
      { name: '의성', lat: 36.3524, lon: 128.6970, region: '경상북도' },
      { name: '청송', lat: 36.4354, lon: 129.0570, region: '경상북도' },
      { name: '영양', lat: 36.6664, lon: 129.1120, region: '경상북도' },
      { name: '영덕', lat: 36.4154, lon: 129.3650, region: '경상북도' },
      { name: '청도', lat: 35.6474, lon: 128.7340, region: '경상북도' },
      { name: '고령', lat: 35.7264, lon: 128.2620, region: '경상북도' },
      { name: '성주', lat: 35.9184, lon: 128.2880, region: '경상북도' },
      { name: '칠곡', lat: 35.9954, lon: 128.4010, region: '경상북도' },
      { name: '예천', lat: 36.6594, lon: 128.4560, region: '경상북도' },
      { name: '봉화', lat: 36.8934, lon: 128.7320, region: '경상북도' },
      { name: '울진', lat: 36.9934, lon: 129.4000, region: '경상북도' },
      { name: '울릉', lat: 37.4844, lon: 130.9020, region: '경상북도' }
    ],
    '경상남도': [
      { name: '창원', lat: 35.2278, lon: 128.6817, region: '경상남도' },
      { name: '진주', lat: 35.1796, lon: 128.1074, region: '경상남도' },
      { name: '통영', lat: 34.8542, lon: 128.4330, region: '경상남도' },
      { name: '사천', lat: 35.0034, lon: 128.0640, region: '경상남도' },
      { name: '김해', lat: 35.2284, lon: 128.8890, region: '경상남도' },
      { name: '밀양', lat: 35.5044, lon: 128.7480, region: '경상남도' },
      { name: '거제', lat: 34.8805, lon: 128.6211, region: '경상남도' },
      { name: '양산', lat: 35.3384, lon: 129.0340, region: '경상남도' },
      { name: '의령', lat: 35.3214, lon: 128.2610, region: '경상남도' },
      { name: '함안', lat: 35.2724, lon: 128.4080, region: '경상남도' },
      { name: '창녕', lat: 35.5444, lon: 128.5000, region: '경상남도' },
      { name: '고성', lat: 34.9734, lon: 128.3220, region: '경상남도' },
      { name: '남해', lat: 34.8374, lon: 127.8920, region: '경상남도' },
      { name: '하동', lat: 35.0674, lon: 127.7510, region: '경상남도' },
      { name: '산청', lat: 35.4144, lon: 127.8730, region: '경상남도' },
      { name: '함양', lat: 35.5204, lon: 127.7250, region: '경상남도' },
      { name: '거창', lat: 35.6864, lon: 127.9020, region: '경상남도' },
      { name: '합천', lat: 35.5664, lon: 128.1650, region: '경상남도' }
    ],
    '제주특별자치도': [
      { name: '제주', lat: 33.4996, lon: 126.5312, region: '제주특별자치도' },
      { name: '서귀포', lat: 33.2546, lon: 126.5600, region: '제주특별자치도' }
    ]
  };

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

  // 지역 선택 핸들러
  const handleRegionSelect = (e) => {
    const regionName = e.target.value;
    setSelectedRegion(regionName);
    setSelectedCity(''); // 지역이 변경되면 도시 선택 초기화
    
    if (regionName) {
      // 지역에 속한 첫 번째 도시를 자동으로 선택
      const citiesInRegion = cityGroups[regionName];
      if (citiesInRegion && citiesInRegion.length > 0) {
        const firstCity = citiesInRegion[0];
        setSelectedCity(firstCity.name);
        onLocationSelect({ lat: firstCity.lat, lon: firstCity.lon }, firstCity.name);
      }
    }
  };

  // 도시 선택 핸들러
  const handleCitySelect = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    
    if (cityName && selectedRegion) {
      const citiesInRegion = cityGroups[selectedRegion];
      const city = citiesInRegion.find(city => city.name === cityName);
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

      {/* 지역 및 도시 선택 */}
      <div className="location-selector">
        {/* 지역 선택 */}
        <div className="region-selector">
          <label htmlFor="region-select">🗺️ 지역 선택</label>
          <select
            id="region-select"
            value={selectedRegion}
            onChange={handleRegionSelect}
            className="region-select"
          >
            <option value="">지역을 선택하세요</option>
            {Object.entries(cityGroups)
              .sort(([a], [b]) => a.localeCompare(b, 'ko'))
              .map(([regionName, cities]) => (
                <option key={regionName} value={regionName}>
                  {regionName} ({cities.length}개 도시)
                </option>
              ))}
          </select>
        </div>

        {/* 도시 선택 */}
        <div className="city-selector">
          <label htmlFor="city-select">🏙️ 도시 선택</label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={handleCitySelect}
            className="city-select"
            disabled={!selectedRegion}
          >
            <option value="">도시를 선택하세요</option>
            {selectedRegion && cityGroups[selectedRegion] ? (
              cityGroups[selectedRegion]
                .sort((a, b) => a.name.localeCompare(b.name, 'ko'))
                .map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name} ({city.region})
                  </option>
                ))
            ) : (
              <option value="">지역을 먼저 선택하세요</option>
            )}
          </select>
        </div>
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
