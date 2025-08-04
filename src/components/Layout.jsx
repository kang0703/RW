import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import "../styles/main.scss";

function Layout({ children }) {
	const navigate = useNavigate();
	const location = useLocation();

	return (
		<div className="layout">
			{/* 상단 고정 메뉴 */}
			<header className="layout__header">
				<div className="layout__header-container">
					<h1 className="layout__title">
						🌤️ 날씨 웹앱
					</h1>
					
					<nav className="layout__nav">
						<button 
							className={`layout__nav-button ${location.pathname === "/" ? "layout__nav-button--active" : ""}`}
							onClick={() => navigate("/")}
						>
							🏠 메인
						</button>
						<button 
							className={`layout__nav-button ${location.pathname === "/events" ? "layout__nav-button--active" : ""}`}
							onClick={() => navigate("/events")}
						>
							🎉 행사
						</button>
						<button 
							className={`layout__nav-button ${location.pathname === "/seoul" ? "layout__nav-button--active" : ""}`}
							onClick={() => navigate("/seoul")}
						>
							서울
						</button>
						<button 
							className={`layout__nav-button ${location.pathname === "/gyeonggi" ? "layout__nav-button--active" : ""}`}
							onClick={() => navigate("/gyeonggi")}
						>
							경기도
						</button>
						<button 
							className={`layout__nav-button ${location.pathname === "/gangwon" ? "layout__nav-button--active" : ""}`}
							onClick={() => navigate("/gangwon")}
						>
							강원도
						</button>
						<button 
							className={`layout__nav-button ${location.pathname === "/chungbuk" ? "layout__nav-button--active" : ""}`}
							onClick={() => navigate("/chungbuk")}
						>
							충청북도
						</button>
						<button 
							className={`layout__nav-button ${location.pathname === "/chungnam" ? "layout__nav-button--active" : ""}`}
							onClick={() => navigate("/chungnam")}
						>
							충청남도
						</button>
						<button 
							className={`layout__nav-button ${location.pathname === "/jeonbuk" ? "layout__nav-button--active" : ""}`}
							onClick={() => navigate("/jeonbuk")}
						>
							전라북도
						</button>
						<button 
							className={`layout__nav-button ${location.pathname === "/jeonnam" ? "layout__nav-button--active" : ""}`}
							onClick={() => navigate("/jeonnam")}
						>
							전라남도
						</button>
						<button 
							className={`layout__nav-button ${location.pathname === "/gyeongbuk" ? "layout__nav-button--active" : ""}`}
							onClick={() => navigate("/gyeongbuk")}
						>
							경상북도
						</button>
						<button 
							className={`layout__nav-button ${location.pathname === "/gyeongnam" ? "layout__nav-button--active" : ""}`}
							onClick={() => navigate("/gyeongnam")}
						>
							경상남도
						</button>
						<button 
							className={`layout__nav-button ${location.pathname === "/jeju" ? "layout__nav-button--active" : ""}`}
							onClick={() => navigate("/jeju")}
						>
							제주도
						</button>
					</nav>
				</div>
			</header>

			{/* 메인 콘텐츠 영역 */}
			<main className="layout__main">
				{children}
			</main>
		</div>
	);
}

export default Layout; 