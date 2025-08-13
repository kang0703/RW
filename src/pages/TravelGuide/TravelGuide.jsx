import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TravelGuide.scss';

const TravelGuide = () => {
  const [selectedSeason, setSelectedSeason] = useState('봄');
  const [selectedRegion, setSelectedRegion] = useState('전국');

  const seasons = ['봄', '여름', '가을', '겨울'];
  const regions = ['전국', '서울', '부산', '제주', '강원', '경기', '충청', '전라', '경상'];

  // 계절별 추천 여행지
  const seasonalDestinations = {
    봄: [
      { name: '제주도', description: '벚꽃 축제와 봄꽃이 만발한 제주의 아름다운 풍경', image: '🌸', weather: '15-20°C, 맑음' },
      { name: '경주', description: '벚꽃과 함께하는 역사 문화 여행', image: '🏛️', weather: '12-18°C, 맑음' },
      { name: '여수', description: '따뜻한 봄바람과 함께하는 해안 도시 여행', image: '🌊', weather: '14-19°C, 맑음' }
    ],
    여름: [
      { name: '부산 해운대', description: '시원한 바다와 함께하는 여름 휴가', image: '🏖️', weather: '25-30°C, 맑음' },
      { name: '강원도 정선', description: '시원한 산속에서 즐기는 여름 피서', image: '🏔️', weather: '20-25°C, 맑음' },
      { name: '제주도', description: '여름 바다와 함께하는 제주 여행', image: '🌴', weather: '26-31°C, 맑음' }
    ],
    가을: [
      { name: '강원도 설악산', description: '단풍으로 물든 설악산의 가을 풍경', image: '🍁', weather: '10-15°C, 맑음' },
      { name: '경주', description: '가을 단풍과 함께하는 역사 문화 여행', image: '🏛️', weather: '8-13°C, 맑음' },
      { name: '전주 한옥마을', description: '가을의 정취가 묻어나는 전통 한옥마을', image: '🏮', weather: '9-14°C, 맑음' }
    ],
    겨울: [
      { name: '강원도 평창', description: '스키와 겨울 스포츠를 즐기는 겨울 여행', image: '⛷️', weather: '-5-5°C, 눈' },
      { name: '제주도', description: '따뜻한 겨울 날씨와 함께하는 제주 여행', image: '🌴', weather: '5-10°C, 맑음' },
      { name: '부산', description: '따뜻한 겨울 바다와 함께하는 도시 여행', image: '🌊', weather: '3-8°C, 맑음' }
    ]
  };

  // 지역별 관광지
  const regionalAttractions = {
    서울: [
      { name: '경복궁', category: '역사문화', description: '조선왕조의 정궁', bestTime: '봄, 가을', image: '🏛️' },
      { name: '남산타워', category: '전망대', description: '서울의 상징적인 전망대', bestTime: '저녁', image: '🗼' },
      { name: '홍대거리', category: '문화', description: '젊음의 문화가 살아있는 거리', bestTime: '저녁', image: '🎭' }
    ],
    부산: [
      { name: '해운대 해수욕장', category: '해변', description: '부산의 대표적인 해수욕장', bestTime: '여름', image: '🏖️' },
      { name: '감천문화마을', category: '문화', description: '부산의 산토리오', bestTime: '봄, 가을', image: '🏘️' },
      { name: '용두산공원', category: '공원', description: '부산 시내를 한눈에 볼 수 있는 공원', bestTime: '저녁', image: '🌃' }
    ],
    제주: [
      { name: '성산일출봉', category: '자연', description: '제주의 아름다운 일출 명소', bestTime: '새벽', image: '🌅' },
      { name: '만장굴', category: '자연', description: '세계자연유산으로 지정된 용암동굴', bestTime: '연중', image: '🕳️' },
      { name: '한라산', category: '자연', description: '제주의 상징적인 산', bestTime: '봄, 가을', image: '🏔️' }
    ]
  };

  // 날씨별 여행 팁
  const weatherTips = {
    맑음: [
      '자외선 차단제를 꼭 챙기세요',
      '햇빛이 강할 때는 모자나 선글라스를 착용하세요',
      '물을 충분히 마시고 수분을 보충하세요'
    ],
    흐림: [
      '가벼운 겉옷을 챙기세요',
      '사진 촬영을 위한 보조 조명을 준비하세요',
      '실내 관광지를 우선적으로 계획하세요'
    ],
    비: [
      '우산이나 우비를 꼭 챙기세요',
      '방수 가방을 사용하세요',
      '실내 관광지나 카페를 방문하는 것을 추천합니다'
    ],
    눈: [
      '방한복과 방한화를 착용하세요',
      '미끄러지지 않도록 주의하세요',
      '스키나 썰매 등 겨울 스포츠를 즐겨보세요'
    ]
  };

  return (
    <div className="travel-guide">
      <div className="travel-header">
        <h1>🗺️ 여행 가이드</h1>
        <p>날씨와 계절에 맞는 최고의 여행지를 추천해드립니다</p>
      </div>

      {/* 계절별 추천 여행지 */}
      <section className="seasonal-destinations">
        <h2>🌱 계절별 추천 여행지</h2>
        <div className="season-selector">
          {seasons.map(season => (
            <button
              key={season}
              className={`season-btn ${selectedSeason === season ? 'active' : ''}`}
              onClick={() => setSelectedSeason(season)}
            >
              {season}
            </button>
          ))}
        </div>
        
        <div className="destinations-grid">
          {seasonalDestinations[selectedSeason].map((destination, index) => (
            <div key={index} className="destination-card">
              <div className="destination-image">{destination.image}</div>
              <h3>{destination.name}</h3>
              <p className="description">{destination.description}</p>
              <p className="weather">🌤️ {destination.weather}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 지역별 관광지 */}
      <section className="regional-attractions">
        <h2>🏛️ 지역별 관광지</h2>
        <div className="region-selector">
          {regions.slice(1).map(region => (
            <button
              key={region}
              className={`region-btn ${selectedRegion === region ? 'active' : ''}`}
              onClick={() => setSelectedRegion(region)}
            >
              {region}
            </button>
          ))}
        </div>

        {selectedRegion !== '전국' && regionalAttractions[selectedRegion] && (
          <div className="attractions-grid">
            {regionalAttractions[selectedRegion].map((attraction, index) => (
              <div key={index} className="attraction-card">
                <div className="attraction-image">{attraction.image}</div>
                <div className="attraction-info">
                  <h3>{attraction.name}</h3>
                  <span className="category">{attraction.category}</span>
                  <p className="description">{attraction.description}</p>
                  <p className="best-time">⭐ 최적 방문 시기: {attraction.bestTime}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 날씨별 여행 팁 */}
      <section className="weather-tips">
        <h2>💡 날씨별 여행 팁</h2>
        <div className="tips-grid">
          {Object.entries(weatherTips).map(([weather, tips]) => (
            <div key={weather} className="tip-card">
              <h3>{weather === '맑음' ? '☀️ 맑음' : 
                   weather === '흐림' ? '☁️ 흐림' : 
                   weather === '비' ? '🌧️ 비' : '❄️ 눈'}</h3>
              <ul>
                {tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 여행 준비 체크리스트 */}
      <section className="travel-checklist">
        <h2>✅ 여행 준비 체크리스트</h2>
        <div className="checklist-grid">
          <div className="checklist-category">
            <h3>📱 필수 준비물</h3>
            <ul>
              <li>신분증 및 여권</li>
              <li>현금 및 카드</li>
              <li>휴대폰 충전기</li>
              <li>약품 (소화제, 진통제 등)</li>
            </ul>
          </div>
          
          <div className="checklist-category">
            <h3>👕 의류 준비</h3>
            <ul>
              <li>계절에 맞는 옷</li>
              <li>편안한 신발</li>
              <li>속옷 및 양말</li>
              <li>우산 또는 우비</li>
            </ul>
          </div>
          
          <div className="checklist-category">
            <h3>🎒 여행용품</h3>
            <ul>
              <li>여행 가방</li>
              <li>카메라</li>
              <li>지도 및 가이드북</li>
              <li>간단한 간식</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 관련 페이지 링크 */}
      <section className="related-links">
        <h2>🔗 관련 정보</h2>
        <div className="links-grid">
          <Link to="/" className="link-card">
            <h3>🏠 홈으로</h3>
            <p>메인 날씨 정보 확인하기</p>
          </Link>
          <Link to="/weather-guide" className="link-card">
            <h3>🌤️ 날씨 가이드</h3>
            <p>날씨별 대처방법 알아보기</p>
          </Link>
          <Link to="/about" className="link-card">
            <h3>ℹ️ 사이트 소개</h3>
            <p>갈래말래 날씨여행에 대해 알아보기</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default TravelGuide;
