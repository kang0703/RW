import { Link } from "react-router-dom";
import "../styles/components/_footer.scss";

function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="footer">
			<div className="footer__container">
				{/* 링크 섹션 */}
				<div className="footer__links-section">
					<div className="footer__links">
						<Link to="/about" className="footer__link">소개</Link>
						<a 
							href="mailto:kcmschool@naver.com" 
							className="footer__link"
							target="_blank"
							rel="noopener noreferrer"
						>
							비즈니스 문의
						</a>
					</div>
				</div>

				{/* 구분선 */}
				<div className="footer__divider"></div>

				{/* 카피라이트 섹션 */}
				<div className="footer__copyright-section">
					<div className="footer__copyright">
						<p>&copy; {currentYear} Weather App. All rights reserved.</p>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
