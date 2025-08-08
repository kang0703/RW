import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import { useState } from "react";
import Footer from "./Footer.jsx";
import "../styles/main.scss";

function Layout({ children }) {
	const navigate = useNavigate();
	const location = useLocation();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// 메뉴 토글 함수
	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	// 메뉴 닫기 함수
	const closeMenu = () => {
		setIsMenuOpen(false);
	};

	return (
		<div className="layout">
			{/* 상단 고정 메뉴 */}
			<header className="layout__header">
				<div className="layout__header-container">
					{/* 로고 (왼쪽) */}
					<h1 className="layout__logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
						🌤️ 갈래말래 날씨여행
					</h1>
					
					{/* 오른쪽 버튼들 */}
					<div className="layout__header-right">
						<a href="/events" className="layout__events-btn">행사</a>
						<button className="layout__menu-btn" onClick={toggleMenu}>
							<span></span>
							<span></span>
							<span></span>
						</button>
					</div>
				</div>
			</header>

			{/* 햄버거 메뉴 */}
			{isMenuOpen && (
				<div className="layout__menu">
					<div className="layout__menu-overlay" onClick={closeMenu}></div>
					<div className="layout__menu-content">
						<div className="layout__menu-header">
							<h3>지역 선택</h3>
							<button className="layout__menu-close" onClick={closeMenu}>×</button>
						</div>
						<div className="layout__menu-items">
							<a href="/" onClick={closeMenu}>🏠 메인</a>
							<a href="/events" onClick={closeMenu}>🎉 행사</a>
							<a href="/seoul" onClick={closeMenu}>서울</a>
							<a href="/gyeonggi" onClick={closeMenu}>경기도</a>
							<a href="/gangwon" onClick={closeMenu}>강원도</a>
							<a href="/chungbuk" onClick={closeMenu}>충청북도</a>
							<a href="/chungnam" onClick={closeMenu}>충청남도</a>
							<a href="/jeonbuk" onClick={closeMenu}>전라북도</a>
							<a href="/jeonnam" onClick={closeMenu}>전라남도</a>
							<a href="/gyeongbuk" onClick={closeMenu}>경상북도</a>
							<a href="/gyeongnam" onClick={closeMenu}>경상남도</a>
							<a href="/jeju" onClick={closeMenu}>제주도</a>
						</div>
					</div>
				</div>
			)}

			{/* 메인 콘텐츠 영역 */}
			<main className="layout__main">
				{children}
			</main>

			{/* 푸터 */}
			<Footer />
		</div>
	);
}

export default Layout; 