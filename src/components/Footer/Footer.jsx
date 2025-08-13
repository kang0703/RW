import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>갈래말래 날씨여행</h3>
            <p>
              정확한 날씨 정보와 함께하는 즐거운 여행 계획을 도와드립니다.
              실시간 날씨 데이터와 지역별 맞춤 정보로 더 나은 여행 경험을 제공합니다.
            </p>
          </div>
          
          <div className="footer-section">
            <h4>빠른 링크</h4>
            <ul>
              <li><Link to="/">홈</Link></li>
              <li><Link to="/weather-guide">날씨 가이드</Link></li>
              <li><Link to="/about">소개</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>비즈니스 문의</h4>
            <ul>
              <li><a href="mailto:contact@weather-travel.com">이메일 문의</a></li>
              <li><a href="/privacy">개인정보처리방침</a></li>
              <li><a href="/terms">이용약관</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>연결하기</h4>
            <div className="social-links">
              <a href="#" aria-label="페이스북">📘</a>
              <a href="#" aria-label="트위터">🐦</a>
              <a href="#" aria-label="인스타그램">📷</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 갈래말래 날씨여행. 모든 권리 보유.</p>
          <p>정확한 날씨 정보로 더 나은 여행을 경험하세요.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
