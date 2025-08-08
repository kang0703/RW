import { Helmet } from "@dr.pogodin/react-helmet";

function About() {
  return (
    <>
      <Helmet>
        <title>소개 - 🌤️ 갈래말래 날씨여행</title>
        <meta name="description" content="갈래말래 날씨여행에 대한 소개입니다. 전국 날씨 정보와 지역별 행사 정보를 제공합니다." />
      </Helmet>
      
      <div className="page-container">
        <div className="page-content">
          <h1 className="page-title">🌤️ 갈래말래 날씨여행 소개</h1>
          
          <section className="about-section">
            <h2>서비스 개요</h2>
            <p>
              갈래말래 날씨여행은 전국 주요 도시의 실시간 날씨 정보와 지역별 행사 정보를 
              한눈에 확인할 수 있는 웹 서비스입니다. 사용자들이 여행 계획을 세우거나 
              일상생활에서 날씨 정보를 쉽게 확인할 수 있도록 도와드립니다.
            </p>
          </section>

          <section className="about-section">
            <h2>주요 기능</h2>
            <ul className="feature-list">
              <li>
                <strong>실시간 날씨 정보</strong>
                <p>전국 10개 주요 지역의 현재 온도, 습도, 기압, 풍속 등 상세한 날씨 정보 제공</p>
              </li>
              <li>
                <strong>지역별 행사 정보</strong>
                <p>각 지역에서 진행되는 다양한 행사와 이벤트 정보 제공</p>
              </li>
              <li>
                <strong>직관적인 UI/UX</strong>
                <p>사용자 친화적인 인터페이스로 쉽고 빠른 정보 확인 가능</p>
              </li>
              <li>
                <strong>반응형 디자인</strong>
                <p>모바일, 태블릿, 데스크톱 등 모든 기기에서 최적화된 경험 제공</p>
              </li>
            </ul>
          </section>

          <section className="about-section">
            <h2>지원 지역</h2>
            <div className="region-grid">
              <div className="region-item">서울</div>
              <div className="region-item">경기도</div>
              <div className="region-item">강원도</div>
              <div className="region-item">충청북도</div>
              <div className="region-item">충청남도</div>
              <div className="region-item">전라북도</div>
              <div className="region-item">전라남도</div>
              <div className="region-item">경상북도</div>
              <div className="region-item">경상남도</div>
              <div className="region-item">제주도</div>
            </div>
          </section>

          <section className="about-section">
            <h2>기술 스택</h2>
            <p>
              본 서비스는 React, Vite, SCSS 등 최신 웹 기술을 활용하여 개발되었으며, 
              OpenWeatherMap API를 통해 정확한 날씨 정보를 제공합니다.
            </p>
          </section>

          <section className="about-section">
            <h2>미래 계획</h2>
            <p>
              지속적인 서비스 개선을 통해 더 많은 지역의 날씨 정보와 
              다양한 기능을 추가할 예정입니다. 사용자들의 소중한 피드백을 
              바탕으로 더 나은 서비스를 제공하겠습니다.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}

export default About;
