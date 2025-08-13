import { useState } from 'react';
import { Link } from 'react-router-dom';
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
      <div className="header-container">
        <div className="logo">
          <Link to="/" onClick={closeMenu}>
            <h1>갈래말래 날씨여행</h1>
          </Link>
        </div>
        
        <nav className={`nav ${isMenuOpen ? 'nav--open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/about" onClick={closeMenu}>소개</Link>
            </li>
            <li className="nav-item">
              <Link to="/weather-guide" onClick={closeMenu}>날씨 가이드</Link>
            </li>
            <li className="nav-item">
              <Link to="/travel-guide" onClick={closeMenu}>여행 가이드</Link>
            </li>
          </ul>
        </nav>

        <button 
          className={`hamburger ${isMenuOpen ? 'hamburger--open' : ''}`}
          onClick={toggleMenu}
          aria-label="메뉴 열기/닫기"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
