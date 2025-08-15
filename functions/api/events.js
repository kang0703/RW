export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // CORS preflight 요청 처리
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    });
  }
  
  try {
    // 한국관광공사 API 호출
    const apiUrl = `https://apis.data.go.kr/B551011/KorService2/searchFestival2${url.search}`;
    
    console.log('API 호출 URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'WeatherApp/1.0'
      }
    });
    
    if (!response.ok) {
      console.error(`API 호출 실패: ${response.status} ${response.statusText}`);
      // 500 에러 대신 200으로 응답하고 에러 정보 포함
      return new Response(JSON.stringify({ 
        error: 'API 호출 실패', 
        status: response.status,
        message: response.statusText,
        timestamp: new Date().toISOString()
      }), {
        status: 200, // 500 대신 200
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
    
  } catch (error) {
    console.error('API 프록시 에러:', error);
    
    // 500 에러 대신 200으로 응답
    return new Response(JSON.stringify({ 
      error: 'API 호출 실패', 
      message: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 200, // 500 대신 200
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }
}
