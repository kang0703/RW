import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-sections">
          <div className="footer-section">
            <h3>🌤️ 갈래말래 날씨여행</h3>
            <p>날씨와 함께하는 특별한 여행 경험을 제공합니다. 실시간 날씨 정보와 주변 행사를 확인하고, 최적의 여행 계획을 세워보세요.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <span>📘</span>
              </a>
              <a href="#" aria-label="Instagram">
                <span>📷</span>
              </a>
              <a href="#" aria-label="Twitter">
                <span>🐦</span>
              </a>
              <a href="#" aria-label="YouTube">
                <span>📺</span>
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>🔗 빠른 링크</h4>
            <ul>
              <li><a href="#home">홈</a></li>
              <li><a href="#weather">날씨 정보</a></li>
              <li><a href="#events">행사 정보</a></li>
              <li><a href="#favorites">즐겨찾기</a></li>
              <li><a href="#settings">설정</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>📞 비즈니스 문의</h4>
            <ul>
              <li><a href="mailto:business@weather-travel.com">📧 business@weather-travel.com</a></li>
              <li><a href="tel:+82-2-1234-5678">📞 02-1234-5678</a></li>
              <li><a href="#partnership">🤝 파트너십</a></li>
              <li><a href="#advertising">📢 광고 문의</a></li>
              <li><a href="#api">🔌 API 연동</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>ℹ️ 고객 지원</h4>
            <ul>
              <li><a href="#help">❓ 도움말</a></li>
              <li><a href="#faq">❔ 자주 묻는 질문</a></li>
              <li><a href="#contact">📞 문의하기</a></li>
              <li><a href="#feedback">💬 피드백</a></li>
              <li><a href="#bug-report">🐛 버그 신고</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-info">
            <p>&copy; 2024 갈래말래 날씨여행. All rights reserved.</p>
            <div className="footer-links">
              <a href="#privacy">개인정보처리방침</a>
              <span className="separator">|</span>
              <a href="#terms">이용약관</a>
              <span className="separator">|</span>
              <a href="#cookies">쿠키 정책</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
