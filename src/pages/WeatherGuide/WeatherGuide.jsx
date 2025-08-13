import './WeatherGuide.scss';

const WeatherGuide = () => {
  const weatherGuides = [
    {
      type: '맑음',
      icon: '☀️',
      description: '맑고 화창한 날씨',
      tips: [
        '자외선 차단제를 발라주세요 (SPF 30 이상)',
        '선글라스를 착용하여 눈을 보호하세요',
        '모자를 써서 직사광선을 차단하세요',
        '충분한 수분을 섭취하세요',
        '가벼운 옷차림으로 외출하세요'
      ],
      activities: ['등산', '피크닉', '자전거 타기', '공원 산책', '야외 스포츠']
    },
    {
      type: '구름',
      icon: '☁️',
      description: '구름이 많은 날씨',
      tips: [
        '자외선은 여전히 강할 수 있으니 차단제를 사용하세요',
        '기온 변화에 대비한 겉옷을 준비하세요',
        '습도가 높을 수 있으니 통기성 좋은 옷을 입으세요',
        '우산을 챙기면 좋습니다 (갑작스러운 비에 대비)'
      ],
      activities: ['도시 관광', '박물관 방문', '카페 투어', '실내 쇼핑', '영화 감상']
    },
    {
      type: '비',
      icon: '🌧️',
      description: '비가 오는 날씨',
      tips: [
        '우산이나 우비를 반드시 챙기세요',
        '미끄러운 길을 조심하세요',
        '방수 기능이 있는 신발을 신으세요',
        '가벼운 겉옷을 준비하세요',
        '빗물에 젖은 전자기기를 보호하세요'
      ],
      activities: ['실내 카페', '도서관', '실내 수영장', '게임센터', '요리 클래스']
    },
    {
      type: '눈',
      icon: '❄️',
      description: '눈이 오는 날씨',
      tips: [
        '따뜻한 겉옷과 장갑을 착용하세요',
        '미끄러운 길을 조심하세요',
        '방한용 신발을 신으세요',
        '보온이 잘 되는 옷을 입으세요',
        '눈사태 위험이 있는 지역은 피하세요'
      ],
      activities: ['스키', '스노보드', '눈썰매', '온천', '실내 활동']
    },
    {
      type: '안개',
      icon: '🌫️',
      description: '안개가 낀 날씨',
      tips: [
        '시야가 제한적이니 운전에 주의하세요',
        '밝은 색의 옷을 입어 가시성을 높이세요',
        '안개 속에서는 천천히 이동하세요',
        'GPS나 지도를 활용하여 길을 찾으세요',
        '안개가 걷힐 때까지 기다리는 것도 좋습니다'
      ],
      activities: ['사진 촬영', '명상', '실내 활동', '안개가 걷힌 후 외출']
    },
    {
      type: '바람',
      icon: '💨',
      description: '바람이 강한 날씨',
      tips: [
        '가벼운 물건이 날아가지 않도록 주의하세요',
        '모자나 스카프가 날아가지 않도록 고정하세요',
        '큰 나무나 건물 근처는 피하세요',
        '안전한 실내 활동을 권장합니다',
        '바람에 날리는 먼지나 꽃가루에 주의하세요'
      ],
      activities: ['실내 활동', '도서관', '카페', '실내 쇼핑', '영화 감상']
    }
  ];

  const travelTips = [
    {
      title: '여행 전 체크리스트',
      items: [
        '현지 날씨 예보 확인',
        '적절한 옷차림 준비',
        '우산이나 방한용품 준비',
        '응급처치용품 준비',
        '보험 가입 여부 확인'
      ]
    },
    {
      title: '계절별 여행 팁',
      items: [
        '봄: 꽃가루 알레르기 주의, 겉옷 준비',
        '여름: 자외선 차단, 수분 섭취, 시원한 옷',
        '가을: 일교차 대비, 단풍 구경 준비',
        '겨울: 보온, 미끄러운 길 주의, 온천 여행'
      ]
    },
    {
      title: '긴급 상황 대처',
      items: [
        '갑작스러운 날씨 변화 시 안전한 곳으로 대피',
        '폭우나 폭설 시 실내 활동 권장',
        '강풍 시 외출 자제',
        '낙뢰 시 실외 활동 금지',
        '응급상황 시 119 또는 현지 긴급연락처'
      ]
    }
  ];

  return (
    <div className="weather-guide">
      <div className="guide-container">
        <div className="guide-header">
          <h1>🌤️ 날씨별 대처방법 & 여행 가이드</h1>
          <p>다양한 날씨 상황에 맞는 대처방법과 여행 팁을 확인하세요</p>
        </div>

        <div className="weather-types">
          {weatherGuides.map((guide, index) => (
            <div key={index} className="weather-type-card">
              <div className="weather-type-header">
                <div className="weather-icon">{guide.icon}</div>
                <div className="weather-info">
                  <h3>{guide.type}</h3>
                  <p>{guide.description}</p>
                </div>
              </div>
              
              <div className="weather-tips">
                <h4>💡 대처방법</h4>
                <ul>
                  {guide.tips.map((tip, tipIndex) => (
                    <li key={tipIndex}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div className="weather-activities">
                <h4>🎯 추천 활동</h4>
                <div className="activity-tags">
                  {guide.activities.map((activity, activityIndex) => (
                    <span key={activityIndex} className="activity-tag">
                      {activity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="travel-tips-section">
          <h2>🧳 여행 준비 가이드</h2>
          <div className="travel-tips-grid">
            {travelTips.map((tip, index) => (
              <div key={index} className="travel-tip-card">
                <h3>{tip.title}</h3>
                <ul>
                  {tip.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="guide-footer">
          <div className="disclaimer">
            <h3>⚠️ 주의사항</h3>
            <p>
              이 가이드는 일반적인 날씨 상황에 대한 참고 자료입니다. 
              실제 여행 시에는 현지 기상청의 최신 정보를 확인하고, 
              안전을 최우선으로 여행 계획을 세우시기 바랍니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherGuide;
