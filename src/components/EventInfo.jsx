import { useEffect, useState } from "react";
import axios from "axios";
import EventMap from "./EventMap.jsx";

// 공공데이터포털 API 키
const PUBLIC_DATA_API_KEY = "UxGu0qkZpzkbKj1TkyefegskQ9MNmCQf2gAnEc9yeHLuY6bpBT0CHXbEIu%2BYebmRqLeV4RoqzgpZbvuOYhnQuQ%3D%3D";

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

	// 지역명을 공공데이터포털 API에 맞는 형식으로 변환
	const getRegionCode = (region) => {
		const regionMap = {
			'서울': '11',
			'경기도': '41',
			'강원도': '42',
			'충청북도': '43',
			'충청남도': '44',
			'전라북도': '45',
			'전라남도': '46',
			'경상북도': '47',
			'경상남도': '48',
			'제주도': '50'
		};
		return regionMap[region] || '11';
	};

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				setLoading(true);
				setError(null);

				// 공공데이터포털 문화행사정보 API 호출
				try {
					// 문화행사정보 API 엔드포인트
					const response = await axios.get(
						`https://api.odcloud.kr/api/15000500/v1/uddi:festival?serviceKey=${PUBLIC_DATA_API_KEY}&page=1&perPage=20&returnType=JSON`
					);

					if (response.data && response.data.data && response.data.data.length > 0) {
						// 실제 API 데이터 처리 및 정규화
						const processedEvents = response.data.data.map((event, index) => ({
							...event,
							id: event.id || `api-event-${index}`,
							// 위치 정보 정규화
							address: event.address || event.addr1 || event.addr2 || event.place || event.location || event.venue,
							location: event.location || event.place || event.venue || event.address,
							region: event.region || extractRegionFromAddress(event.address || event.addr1 || event.addr2)
						}));

						// 지역 필터링 (지역명이 포함된 행사만 필터링)
						const filteredEvents = processedEvents.filter(event => {
							const eventTitle = event.title || '';
							const eventLocation = event.location || '';
							const eventRegion = event.region || '';
							const eventAddress = event.address || '';
							
							// 지역명이 제목, 위치, 지역, 주소에 포함되어 있는지 확인
							return eventTitle.includes(regionName) || 
								   eventLocation.includes(regionName) || 
								   eventRegion.includes(regionName) ||
								   eventAddress.includes(regionName) ||
								   // 지역별 키워드 매칭
								   (regionName === '서울' && (eventTitle.includes('서울') || eventLocation.includes('서울') || eventAddress.includes('서울'))) ||
								   (regionName === '경기도' && (eventTitle.includes('경기') || eventLocation.includes('경기') || eventTitle.includes('수원') || eventTitle.includes('성남'))) ||
								   (regionName === '강원도' && (eventTitle.includes('강원') || eventLocation.includes('강원') || eventTitle.includes('춘천') || eventTitle.includes('강릉'))) ||
								   (regionName === '충청북도' && (eventTitle.includes('충북') || eventLocation.includes('충북') || eventTitle.includes('청주'))) ||
								   (regionName === '충청남도' && (eventTitle.includes('충남') || eventLocation.includes('충남') || eventTitle.includes('천안') || eventTitle.includes('아산'))) ||
								   (regionName === '전라북도' && (eventTitle.includes('전북') || eventLocation.includes('전북') || eventTitle.includes('전주'))) ||
								   (regionName === '전라남도' && (eventTitle.includes('전남') || eventLocation.includes('전남') || eventTitle.includes('광주') || eventTitle.includes('여수'))) ||
								   (regionName === '경상북도' && (eventTitle.includes('경북') || eventLocation.includes('경북') || eventTitle.includes('대구') || eventTitle.includes('포항'))) ||
								   (regionName === '경상남도' && (eventTitle.includes('경남') || eventLocation.includes('경남') || eventTitle.includes('부산') || eventTitle.includes('울산'))) ||
								   (regionName === '제주도' && (eventTitle.includes('제주') || eventLocation.includes('제주')));
						});

						console.log(`${regionName} 지역 필터링된 행사:`, filteredEvents);

						// 최대 5개까지만 표시
						setEvents(filteredEvents.slice(0, 5));
					} else {
						// API에서 데이터가 없거나 다른 형식인 경우 더미 데이터 사용
						const dummyEvents = [
							{
								id: `${regionName}-festival-1`,
								title: `${regionName} 문화축제`,
								date: new Date().toLocaleDateString('ko-KR'),
								description: `${regionName}에서 개최되는 지역 문화축제입니다.`,
								location: `${regionName} 문화회관`,
								address: getRegionAddress(regionName, '문화회관'),
								region: regionName
							},
							{
								id: `${regionName}-festival-2`,
								title: `${regionName} 전통시장 축제`,
								date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
								description: `${regionName} 전통시장에서 열리는 특별한 축제입니다.`,
								location: `${regionName} 전통시장`,
								address: getRegionAddress(regionName, '전통시장'),
								region: regionName
							}
						];
						setEvents(dummyEvents);
					}
				} catch (error) {
					console.error("공공데이터포털 API 호출 실패:", error);
					// API 호출 실패 시 더미 데이터 사용
					const dummyEvents = [
						{
							id: `${regionName}-festival-1`,
							title: `${regionName} 문화축제`,
							date: new Date().toLocaleDateString('ko-KR'),
							description: `${regionName}에서 개최되는 지역 문화축제입니다.`,
							location: `${regionName} 문화회관`,
							address: getRegionAddress(regionName, '문화회관'),
							region: regionName
						},
						{
							id: `${regionName}-festival-2`,
							title: `${regionName} 전통시장 축제`,
							date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
							description: `${regionName} 전통시장에서 열리는 특별한 축제입니다.`,
							location: `${regionName} 전통시장`,
							address: getRegionAddress(regionName, '전통시장'),
							region: regionName
						}
					];
					setEvents(dummyEvents);
				}
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