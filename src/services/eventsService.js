// Cloudflare Pages Functions를 호출하는 행사 정보 서비스
const CLOUDFLARE_FUNCTIONS_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:8788/api';

// 주변 행사 정보 가져오기 (위도/경도 기반)
export const getNearbyEvents = async (lat, lon) => {
  try {
    const response = await fetch(`${CLOUDFLARE_FUNCTIONS_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lat,
        lon,
        radius: 10, // 10km 반경
        limit: 20
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('주변 행사 정보 가져오기 실패:', error);
    throw error;
  }
};

// 도시명 기반 행사 정보 가져오기
export const getEventsByLocation = async (city) => {
  try {
    const response = await fetch(`${CLOUDFLARE_FUNCTIONS_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        city,
        limit: 20
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('도시별 행사 정보 가져오기 실패:', error);
    throw error;
  }
};

// 행사 상세 정보 가져오기
export const getEventDetails = async (eventId) => {
  try {
    const response = await fetch(`${CLOUDFLARE_FUNCTIONS_URL}/events/${eventId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('행사 상세 정보 가져오기 실패:', error);
    throw error;
  }
};
