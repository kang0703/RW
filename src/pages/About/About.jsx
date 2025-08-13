import './About.scss';

const About = () => {
  const features = [
    {
      icon: '🌤️',
      title: '실시간 날씨 정보',
      description: 'OpenWeatherMap API를 통한 정확하고 신뢰할 수 있는 실시간 날씨 데이터'
    },
    {
      icon: '📍',
      title: '위치 기반 서비스',
      description: '현재 위치 또는 원하는 도시의 맞춤형 날씨 정보 제공'
    },
    {
      icon: '📅',
      title: '5일 날씨 예보',
      description: '앞으로 5일간의 상세한 날씨 예보로 여행 계획 수립 지원'
    },
    {
      icon: '💡',
      title: '날씨별 가이드',
      description: '다양한 날씨 상황에 맞는 대처방법과 여행 팁 제공'
    },
    {
      icon: '📱',
      title: '반응형 디자인',
      description: '모든 디바이스에서 최적화된 사용자 경험 제공'
    },
    {
      icon: '🚀',
      title: '빠른 로딩',
      description: '최적화된 코드로 빠른 페이지 로딩 속도 보장'
    }
  ];

  const teamInfo = [
    {
      role: '개발자',
      name: '갈래말래 팀',
      description: 'React와 최신 웹 기술을 활용한 사용자 친화적인 날씨 앱 개발'
    },
    {
      role: '디자이너',
      name: 'UX/UI 전문가',
      description: '직관적이고 아름다운 사용자 인터페이스 설계'
    },
    {
      role: '콘텐츠',
      name: '날씨 전문가',
      description: '정확하고 유용한 날씨 정보와 여행 가이드 제공'
    }
  ];

  const contactInfo = {
    email: 'contact@weather-travel.com',
    business: '비즈니스 문의 및 파트너십',
    support: '기술 지원 및 문의사항',
    feedback: '사용자 피드백 및 제안사항'
  };

  return (
    <div className="about">
      <div className="about-container">
        <div className="about-header">
          <h1>🌤️ 갈래말래 날씨여행 소개</h1>
          <p>정확한 날씨 정보로 더 나은 여행을 계획하는 당신의 든든한 동반자</p>
        </div>

        <div className="about-mission">
          <h2>🎯 우리의 미션</h2>
          <p>
            갈래말래 날씨여행은 정확하고 신뢰할 수 있는 날씨 정보를 제공하여 
            사용자들이 더 안전하고 즐거운 여행을 계획할 수 있도록 돕는 것을 목표로 합니다. 
            최신 기술과 사용자 중심의 디자인을 통해 언제 어디서나 쉽게 접근할 수 있는 
            날씨 정보 플랫폼을 구축하고 있습니다.
          </p>
        </div>

        <div className="about-features">
          <h2>✨ 주요 기능</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="about-team">
          <h2>👥 팀 소개</h2>
          <div className="team-grid">
            {teamInfo.map((member, index) => (
              <div key={index} className="team-member">
                <h3>{member.role}</h3>
                <h4>{member.name}</h4>
                <p>{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="about-technology">
          <h2>🛠️ 기술 스택</h2>
          <div className="tech-stack">
            <div className="tech-category">
              <h3>프론트엔드</h3>
              <div className="tech-tags">
                <span className="tech-tag">React 18</span>
                <span className="tech-tag">Vite</span>
                <span className="tech-tag">SCSS</span>
                <span className="tech-tag">Responsive Design</span>
              </div>
            </div>
            <div className="tech-category">
              <h3>API & 서비스</h3>
              <div className="tech-tags">
                <span className="tech-tag">OpenWeatherMap API</span>
                <span className="tech-tag">Kakao Map API</span>
                <span className="tech-tag">Public Data Portal</span>
              </div>
            </div>
            <div className="tech-category">
              <h3>품질 & 성능</h3>
              <div className="tech-tags">
                <span className="tech-tag">SEO 최적화</span>
                <span className="tech-tag">Core Web Vitals</span>
                <span className="tech-tag">접근성 준수</span>
                <span className="tech-tag">모바일 최적화</span>
              </div>
            </div>
          </div>
        </div>

        <div className="about-contact">
          <h2>📞 문의하기</h2>
          <div className="contact-grid">
            <div className="contact-item">
              <h3>📧 이메일</h3>
              <p>{contactInfo.email}</p>
            </div>
            <div className="contact-item">
              <h3>💼 비즈니스</h3>
              <p>{contactInfo.business}</p>
            </div>
            <div className="contact-item">
              <h3>🔧 기술 지원</h3>
              <p>{contactInfo.support}</p>
            </div>
            <div className="contact-item">
              <h3>💬 피드백</h3>
              <p>{contactInfo.feedback}</p>
            </div>
          </div>
        </div>

        <div className="about-adsense">
          <h2>💰 애드센스 준비</h2>
          <div className="adsense-info">
            <p>
              갈래말래 날씨여행은 Google AdSense 승인을 위해 다음과 같은 요소들을 준비하고 있습니다:
            </p>
            <ul>
              <li>✅ 고품질 원본 콘텐츠 제공</li>
              <li>✅ 반응형 웹 디자인</li>
              <li>✅ 빠른 로딩 속도 (Core Web Vitals 준수)</li>
              <li>✅ SEO 최적화</li>
              <li>✅ 접근성 준수</li>
              <li>✅ 정기적인 콘텐츠 업데이트</li>
              <li>✅ 사용자 경험 최적화</li>
            </ul>
            <p className="adsense-note">
              <strong>참고:</strong> AdSense 승인은 Google의 검토 과정을 거치며, 
              승인 여부와 소요 기간은 Google의 정책에 따라 결정됩니다.
            </p>
          </div>
        </div>

        <div className="about-footer">
          <div className="legal-links">
            <a href="/privacy">개인정보처리방침</a>
            <a href="/terms">이용약관</a>
            <a href="/sitemap">사이트맵</a>
          </div>
          <p className="copyright">
            &copy; 2024 갈래말래 날씨여행. 모든 권리 보유.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
