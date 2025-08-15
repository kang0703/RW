// Cloudflare Pages Functions - 행사 정보 API
export async function onRequest(context) {
  // CORS 헤더 설정
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // OPTIONS 요청 처리 (CORS preflight)
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // POST 요청만 처리
    if (context.request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: corsHeaders,
        }
      );
    }

    const body = await context.request.json();
    const { lat, lon, city, radius = 10, limit = 20 } = body;

    // 환경변수에서 API 키 가져오기 (Cloudflare Pages 방식)
    const OPENWEATHER_API_KEY = context.env.OPENWEATHER_API_KEY;
    const PUBLIC_DATA_API_KEY = context.env.PUBLIC_DATA_API_KEY;

    // API 키 검증 (디버깅용)
    console.log('환경변수 확인:', {
      hasOpenWeatherKey: !!OPENWEATHER_API_KEY,
      hasPublicDataKey: !!PUBLIC_DATA_API_KEY,
      openWeatherKeyLength: OPENWEATHER_API_KEY?.length || 0,
      publicDataKeyLength: PUBLIC_DATA_API_KEY?.length || 0
    });

    if (!OPENWEATHER_API_KEY || !PUBLIC_DATA_API_KEY) {
      console.error('API 키가 설정되지 않았습니다.');
      console.error('OPENWEATHER_API_KEY:', !!OPENWEATHER_API_KEY);
      console.error('PUBLIC_DATA_API_KEY:', !!PUBLIC_DATA_API_KEY);
      
      return new Response(
        JSON.stringify({ 
          error: 'API keys not configured',
          message: '환경변수가 설정되지 않았습니다. Cloudflare Pages 관리자에서 환경변수를 설정해주세요.',
          details: {
            hasOpenWeatherKey: !!OPENWEATHER_API_KEY,
            hasPublicDataKey: !!PUBLIC_DATA_API_KEY
          }
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    let events = [];

    // 위치 기반 행사 정보 생성 (실제 API 연동 전까지 가상 데이터)
    if (lat && lon) {
      events = generateMockEventsByLocation(lat, lon, radius);
    } else if (city) {
      events = generateMockEventsByCity(city);
    } else {
      events = generateDefaultEvents();
    }

    // 응답 데이터 구성
    const responseData = {
      events: events.slice(0, limit),
      total: events.length,
      location: lat && lon ? { lat, lon } : city,
      lastUpdated: new Date().toISOString(),
      source: 'Cloudflare Pages Functions',
      apiKeysConfigured: true,
      environment: 'production'
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('API 에러:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// 가상 행사 데이터 생성 함수들
function generateMockEventsByLocation(lat, lon, radius) {
  const currentMonth = new Date().getMonth() + 1;
  const events = [];

  // 계절별 행사 데이터
  if (currentMonth >= 3 && currentMonth <= 5) { // 봄
    events.push(
      {
        id: 1,
        title: '벚꽃 축제',
        date: `${new Date().getFullYear()}.04.01 - 04.15`,
        location: '📍 여의도 한강공원',
        description: '봄의 시작을 알리는 아름다운 벚꽃 축제입니다.',
        weather: '맑음',
        weatherType: 'sunny',
        tempRange: '15° - 22°',
        icon: '🌸',
        category: '자연',
        price: '무료',
        organizer: '서울시',
        lat: 37.5297,
        lon: 126.9344
      },
      {
        id: 2,
        title: '봄꽃 전시회',
        date: `${new Date().getFullYear()}.03.20 - 04.10`,
        location: '📍 남산타워',
        description: '다양한 봄꽃들을 감상할 수 있는 전시회입니다.',
        weather: '맑음',
        weatherType: 'sunny',
        tempRange: '12° - 20°',
        icon: '🌺',
        category: '전시',
        price: '5,000원',
        organizer: '남산타워',
        lat: 37.5512,
        lon: 126.9882
      }
    );
  }

  if (currentMonth >= 6 && currentMonth <= 8) { // 여름
    events.push(
      {
        id: 3,
        title: '한강 뮤직 페스티벌',
        date: `${new Date().getFullYear()}.07.20 - 07.22`,
        location: '📍 반포 한강공원',
        description: '한강을 배경으로 펼쳐지는 음악 축제입니다.',
        weather: '맑음',
        weatherType: 'sunny',
        tempRange: '25° - 32°',
        icon: '🎵',
        category: '음악',
        price: '30,000원',
        organizer: '문화체육관광부',
        lat: 37.5085,
        lon: 127.0118
      }
    );
  }

  if (currentMonth >= 9 && currentMonth <= 11) { // 가을
    events.push(
      {
        id: 4,
        title: '단풍 축제',
        date: `${new Date().getFullYear()}.10.15 - 11.05`,
        location: '📍 북한산 국립공원',
        description: '아름다운 단풍을 감상할 수 있는 가을 축제입니다.',
        weather: '맑음',
        weatherType: 'sunny',
        tempRange: '15° - 22°',
        icon: '🍁',
        category: '자연',
        price: '무료',
        organizer: '국립공원공단',
        lat: 37.6584,
        lon: 126.9789
      }
    );
  }

  if (currentMonth >= 12 || currentMonth <= 2) { // 겨울
    events.push(
      {
        id: 5,
        title: '겨울 빛 축제',
        date: `${new Date().getFullYear()}.12.20 - ${new Date().getFullYear() + 1}.02.28`,
        location: '📍 올림픽공원',
        description: '겨울 밤을 밝히는 아름다운 빛 축제입니다.',
        weather: '맑음',
        weatherType: 'clear',
        tempRange: '-5° - 5°',
        icon: '✨',
        category: '축제',
        price: '15,000원',
        organizer: '올림픽공원',
        lat: 37.5216,
        lon: 127.1214
      }
    );
  }

  // 거리 기반 필터링 (간단한 구현)
  return events.filter(event => {
    if (event.lat && event.lon) {
      const distance = calculateDistance(lat, lon, event.lat, event.lon);
      return distance <= radius;
    }
    return true;
  });
}

function generateMockEventsByCity(city) {
  return [
    {
      id: 1,
      title: `${city} 지역 축제`,
      date: `${new Date().getFullYear()}.${String(new Date().getMonth() + 1).padStart(2, '0')}.15`,
      location: `📍 ${city}`,
      description: `${city} 지역의 특색있는 축제입니다.`,
      weather: '맑음',
      weatherType: 'sunny',
      tempRange: '18° - 25°',
      icon: '🎉',
      category: '축제',
      price: '무료',
      organizer: `${city} 시청`
    }
  ];
}

function generateDefaultEvents() {
  return [
    {
      id: 1,
      title: '벚꽃 축제',
      date: '2024.04.01 - 04.15',
      location: '📍 여의도 한강공원',
      description: '봄의 시작을 알리는 아름다운 벚꽃 축제입니다.',
      weather: '맑음',
      weatherType: 'sunny',
      tempRange: '15° - 22°',
      icon: '🌸',
      category: '자연',
      price: '무료',
      organizer: '서울시'
    }
  ];
}

// 두 지점 간 거리 계산 (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // 지구 반지름 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
