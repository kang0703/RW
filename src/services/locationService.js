// 사용자 현재 위치 가져오기
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Current location:', { latitude, longitude });
        
        // 좌표를 기반으로 도시명 추정
        const city = estimateCityFromCoordinates(latitude, longitude);
        resolve({ latitude, longitude, city });
      },
      (error) => {
        console.error('Error getting location:', error);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5분
      }
    );
  });
};

// 좌표를 기반으로 도시명 추정
const estimateCityFromCoordinates = (lat, lng) => {
  // 한국 주요 도시들의 대략적인 좌표 범위
  const cities = [
    { name: 'Seoul', latRange: [37.4, 37.7], lngRange: [126.8, 127.2] },
    { name: 'Busan', latRange: [35.0, 35.3], lngRange: [129.0, 129.3] },
    { name: 'Daegu', latRange: [35.8, 36.0], lngRange: [128.5, 128.7] },
    { name: 'Incheon', latRange: [37.4, 37.6], lngRange: [126.5, 126.8] },
    { name: 'Gwangju', latRange: [35.1, 35.2], lngRange: [126.8, 126.9] },
    { name: 'Daejeon', latRange: [36.2, 36.4], lngRange: [127.3, 127.5] },
    { name: 'Ulsan', latRange: [35.5, 35.6], lngRange: [129.3, 129.4] },
    { name: 'Jeju', latRange: [33.2, 33.6], lngRange: [126.4, 126.8] }
  ];

  for (const city of cities) {
    if (lat >= city.latRange[0] && lat <= city.latRange[1] &&
        lng >= city.lngRange[0] && lng <= city.lngRange[1]) {
      return city.name;
    }
  }

  // 범위에 해당하지 않으면 가장 가까운 도시 반환
  let closestCity = 'Seoul';
  let minDistance = Infinity;

  for (const city of cities) {
    const cityLat = (city.latRange[0] + city.latRange[1]) / 2;
    const cityLng = (city.lngRange[0] + city.lngRange[1]) / 2;
    const distance = Math.sqrt((lat - cityLat) ** 2 + (lng - cityLng) ** 2);
    
    if (distance < minDistance) {
      minDistance = distance;
      closestCity = city.name;
    }
  }

  return closestCity;
};

// 기본 위치 (서울) 반환
export const getDefaultLocation = () => {
  return {
    latitude: 37.5665,
    longitude: 126.9780,
    city: 'Seoul'
  };
};
