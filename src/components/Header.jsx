import { useState } from 'react';
import './Header.scss';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>🌤️ 갈래말래 날씨여행</h1>
        </div>
        
        <div className="menu-container">
          <button 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="메뉴 열기"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <ul className="nav-list">
              <li><a href="#home" onClick={closeMenu}>🏠 홈</a></li>
              <li><a href="#weather" onClick={closeMenu}>🌦️ 날씨 정보</a></li>
              <li><a href="#events" onClick={closeMenu}>🎉 행사 정보</a></li>
              <li><a href="#favorites" onClick={closeMenu}>❤️ 즐겨찾기</a></li>
              <li><a href="#settings" onClick={closeMenu}>⚙️ 설정</a></li>
              <li><a href="#help" onClick={closeMenu}>❓ 도움말</a></li>
            </ul>
          </nav>
        </div>
      </div>
      
      {/* 오버레이 - 메뉴 열렸을 때 배경 클릭 시 닫기 */}
      <div 
        className={`menu-overlay ${isMenuOpen ? 'active' : ''}`} 
        onClick={closeMenu}
      ></div>
    </header>
  );
};

export default Header;
