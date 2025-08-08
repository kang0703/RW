import { useEffect, useState } from "react";
import EventMap from "./EventMap.jsx";
import eventService from "../services/eventService";

function EventInfo({ regionName, cityName }) {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [isMapOpen, setIsMapOpen] = useState(false);

	// 지도 열기 함수
	const openMap = (event) => {
		setSelectedEvent(event);
		setIsMapOpen(true);
	};

	// 지도 닫기 함수
	const closeMap = () => {
		setIsMapOpen(false);
		setSelectedEvent(null);
	};



	useEffect(() => {
		const fetchEvents = async () => {
			try {
				setLoading(true);
				setError(null);

				// 이벤트 서비스를 사용하여 행사 정보 가져오기
				const eventsData = await eventService.getEventsByRegion(regionName);
				
				// 최대 5개까지만 표시
				setEvents(eventsData.slice(0, 5));
			} catch (error) {
				console.error("행사정보를 가져오는 중 오류 발생:", error);
				setError("행사정보를 불러올 수 없습니다.");
				setEvents([]);
			} finally {
				setLoading(false);
			}
		};

		fetchEvents();
	}, [regionName, cityName]);

	// 지역별 주소 생성 함수
	const getRegionAddress = (region, place) => {
		const addresses = {
			'서울': '서울특별시 중구 세종대로 110 서울특별시청',
			'경기도': '경기도 수원시 팔달구 정조로 800 경기도청',
			'강원도': '강원도 춘천시 중앙로 1 강원도청',
			'충청북도': '충청북도 청주시 상당구 상당로 155 충청북도청',
			'충청남도': '충청남도 홍성군 홍북읍 충남대로 21 충청남도청',
			'전라북도': '전라북도 전주시 완산구 기린대로 99 전라북도청',
			'전라남도': '전라남도 무안군 삼향읍 오룡로 166 전라남도청',
			'경상북도': '경상북도 안동시 풍천면 도청대로 455 경상북도청',
			'경상남도': '경상남도 창원시 의창구 중앙대로 300 경상남도청',
			'제주도': '제주특별자치도 제주시 연동 312-1 제주도청'
		};
		return addresses[region] || `${region} ${place}`;
	};

	// 주소에서 지역 추출 함수
	const extractRegionFromAddress = (address) => {
		if (!address) return '';
		
		const addressStr = address.toString().toLowerCase();
		
		if (addressStr.includes('서울')) return '서울';
		if (addressStr.includes('경기')) return '경기도';
		if (addressStr.includes('강원')) return '강원도';
		if (addressStr.includes('충북')) return '충청북도';
		if (addressStr.includes('충남')) return '충청남도';
		if (addressStr.includes('전북')) return '전라북도';
		if (addressStr.includes('전남')) return '전라남도';
		if (addressStr.includes('경북')) return '경상북도';
		if (addressStr.includes('경남')) return '경상남도';
		if (addressStr.includes('제주')) return '제주도';
		
		return '';
	};

	if (loading) {
		return (
			<div className="event-info">
				<h3 className="event-info__title">🎉 지역 행사정보</h3>
				<div className="event-info__loading">
					<div className="loading__spinner"></div>
					<p>행사정보를 불러오는 중...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="event-info">
				<h3 className="event-info__title">🎉 지역 행사정보</h3>
				<div className="event-info__error">
					<p>{error}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="event-info">
			<h3 className="event-info__title">🎉 지역 행사정보</h3>
			
			{events.length > 0 ? (
				<div className="event-info__list">
					{events.slice(0, 5).map((event, index) => (
						<div key={event.id || index} className="event-card">
							<div className="event-card__header">
								<h4 className="event-card__title">
									{event.title || event.eventName || '제목 없음'}
								</h4>
								<span className="event-card__date">
									{event.startDate || event.date || '날짜 정보 없음'}
								</span>
							</div>
							<div className="event-card__content">
								<p className="event-card__description">
									{event.description || event.content || '상세 정보가 없습니다.'}
								</p>
								{event.location && (
									<p className="event-card__location">
										📍 {event.location}
									</p>
								)}
								<div className="event-card__actions">
									<button 
										className="event-card__map-button"
										onClick={() => openMap(event)}
									>
										🗺️ 지도 보기
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="event-info__empty">
					<p>현재 진행 중인 행사가 없습니다.</p>
					<p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>
						해당 지역의 문화행사정보를 찾을 수 없습니다.
					</p>
				</div>
			)}

			{/* 지도 모달 */}
			<EventMap 
				event={selectedEvent} 
				isOpen={isMapOpen} 
				onClose={closeMap} 
			/>
		</div>
	);
}

export default EventInfo; 