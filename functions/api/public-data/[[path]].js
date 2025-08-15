export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/public-data/', '');
  
  // 환경변수에서 API 키 가져오기
  const PUBLIC_DATA_API_KEY = env.PUBLIC_DATA_API_KEY;
  
  if (!PUBLIC_DATA_API_KEY) {
    return new Response('API key not configured', { status: 500 });
  }
  
  try {
    // 공공데이터 포털 API로 요청 전달
    const targetUrl = `https://apis.data.go.kr/B551011/KorService2/${path}${url.search}`;
    
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': '갈래말래날씨여행/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
