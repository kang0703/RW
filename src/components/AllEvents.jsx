import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "@dr.pogodin/react-helmet";
import EventMap from "./EventMap.jsx";

// 공공데이터포털 API 키
const PUBLIC_DATA_API_KEY = "UxGu0qkZpzkbKj1TkyefegskQ9MNmCQf2gAnEc9yeHLuY6bpBT0CHXbEIu%2BYebmRqLeV4RoqzgpZbvuOYhnQuQ%3D%3D";

function AllEvents() {
	const [allEvents, setAllEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedRegion, setSelectedRegion] = useState('전체');
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [isMapOpen, setIsMapOpen] = useState(false);
	
	// 새로운 상태들 추가
	const [searchTerm, setSearchTerm] = useState('');
	const [sortBy, setSortBy] = useState('date');
	const [favorites, setFavorites] = useState([]);
	const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

	// 즐겨찾기 토글 함수
	const toggleFavorite = (eventId) => {
		setFavorites(prev => {
			if (prev.includes(eventId)) {
				return prev.filter(id => id !== eventId);
			} else {
				return [...prev, eventId];
			}
		});
	};

	// 검색 및 필터링 함수
	const filterAndSearchEvents = (events, region, search, favoritesOnly, favorites) => {
		let filtered = events;

		// 지역별 필터링
		if (region !== '전체') {
			filtered = filtered.filter(event => {
				const eventTitle = event.title || '';
				const eventLocation = event.location || '';
				const eventRegion = event.region || '';
				
				switch (region) {
					case '서울':
						return eventTitle.includes('서울') || eventLocation.includes('서울');
					case '경기도':
						return eventTitle.includes('경기') || eventLocation.includes('경기') || 
							   eventTitle.includes('수원') || eventTitle.includes('성남');
					case '강원도':
						return eventTitle.includes('강원') || eventLocation.includes('강원') || 
							   eventTitle.includes('춘천') || eventTitle.includes('강릉');
					case '충청북도':
						return eventTitle.includes('충북') || eventLocation.includes('충북') || 
							   eventTitle.includes('청주');
					case '충청남도':
						return eventTitle.includes('충남') || eventLocation.includes('충남') || 
							   eventTitle.includes('천안') || eventTitle.includes('아산');
					case '전라북도':
						return eventTitle.includes('전북') || eventLocation.includes('전북') || 
							   eventTitle.includes('전주');
					case '전라남도':
						return eventTitle.includes('전남') || eventLocation.includes('전남') || 
							   eventTitle.includes('광주') || eventTitle.includes('여수');
					case '경상북도':
						return eventTitle.includes('경북') || eventLocation.includes('경북') || 
							   eventTitle.includes('대구') || eventTitle.includes('포항');
					case '경상남도':
						return eventTitle.includes('경남') || eventLocation.includes('경남') || 
							   eventTitle.includes('부산') || eventTitle.includes('울산');
					case '제주도':
						return eventTitle.includes('제주') || eventLocation.includes('제주');
					default:
						return true;
				}
			});
		}

		// 검색어 필터링
		if (search.trim()) {
			filtered = filtered.filter(event => {
				const title = (event.title || '').toLowerCase();
				const description = (event.description || '').toLowerCase();
				const location = (event.location || '').toLowerCase();
				const searchLower = search.toLowerCase();
				
				return title.includes(searchLower) || 
					   description.includes(searchLower) || 
					   location.includes(searchLower);
			});
		}

		// 즐겨찾기만 보기
		if (favoritesOnly) {
			filtered = filtered.filter(event => favorites.includes(event.id || event.title));
		}

		return filtered;
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

	// 정렬 함수
	const sortEvents = (events, sortBy) => {
		const sorted = [...events];
		
		switch (sortBy) {
			case 'date':
				return sorted.sort((a, b) => {
					const dateA = new Date(a.startDate || a.date || 0);
					const dateB = new Date(b.startDate || b.date || 0);
					return dateA - dateB;
				});
			case 'title':
				return sorted.sort((a, b) => {
					const titleA = (a.title || '').toLowerCase();
					const titleB = (b.title || '').toLowerCase();
					return titleA.localeCompare(titleB);
				});
			case 'region':
				return sorted.sort((a, b) => {
					const regionA = (a.region || '').toLowerCase();
					const regionB = (b.region || '').toLowerCase();
					return regionA.localeCompare(regionB);
				});
			default:
				return sorted;
		}
	};

	// 지역별 필터링 함수 (기존 함수는 제거)
	// const filterEventsByRegion = (events, region) => { ... } - 이 함수는 제거됨

	useEffect(() => {
		const fetchAllEvents = async () => {
			try {
				setLoading(true);
				setError(null);

				// 공공데이터포털 문화행사정보 API 호출
				try {
					const response = await axios.get(
						`https://api.odcloud.kr/api/15000500/v1/uddi:festival?serviceKey=${PUBLIC_DATA_API_KEY}&page=1&perPage=50&returnType=JSON`
					);

					if (response.data && response.data.data && response.data.data.length > 0) {
						// 실제 API 데이터에 고유 ID 추가
						const eventsWithIds = response.data.data.map((event, index) => ({
							...event,
							id: event.id || `api-event-${index}`,
							// 위치 정보 정규화
							address: event.address || event.addr1 || event.addr2 || event.place || event.location || event.venue,
							location: event.location || event.place || event.venue || event.address,
							region: event.region || extractRegionFromAddress(event.address || event.addr1 || event.addr2)
						}));
						
						console.log('공공데이터포털 API 데이터:', eventsWithIds);
						setAllEvents(eventsWithIds);
					} else {
						// API에서 데이터가 없거나 다른 형식인 경우 더미 데이터 사용
						const dummyEvents = [
							{
								id: 'seoul-festival',
								title: '서울 문화축제',
								date: new Date().toLocaleDateString('ko-KR'),
								description: '서울에서 개최되는 지역 문화축제입니다.',
								location: '서울 문화회관',
								address: '서울특별시 중구 세종대로 110 서울특별시청',
								region: '서울'
							},
							{
								id: 'gyeonggi-market',
								title: '경기도 전통시장 축제',
								date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
								description: '경기도 전통시장에서 열리는 특별한 축제입니다.',
								location: '수원 전통시장',
								address: '경기도 수원시 팔달구 정조로 800 경기도청',
								region: '경기도'
							},
							{
								id: 'gangwon-mountain',
								title: '강원도 산악축제',
								date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
								description: '강원도의 아름다운 산을 배경으로 하는 축제입니다.',
								location: '춘천 시민공원',
								address: '강원도 춘천시 중앙로 1 강원도청',
								region: '강원도'
							},
							{
								id: 'chungbuk-makgeolli',
								title: '충청북도 청주 막걸리 축제',
								date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
								description: '청주의 전통 막걸리를 체험할 수 있는 축제입니다.',
								location: '청주 문화의 거리',
								address: '충청북도 청주시 상당구 상당로 155 충청북도청',
								region: '충청북도'
							},
							{
								id: 'jeonbuk-hanok',
								title: '전라북도 전주 한옥마을 축제',
								date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
								description: '전주 한옥마을의 아름다운 전통문화를 체험하는 축제입니다.',
								location: '전주 한옥마을',
								address: '전라북도 전주시 완산구 기린대로 99 전라북도청',
								region: '전라북도'
							},
							{
								id: 'jeju-haenyeo',
								title: '제주도 해녀문화 축제',
								date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
								description: '제주도의 독특한 해녀문화를 체험할 수 있는 축제입니다.',
								location: '제주 해녀박물관',
								address: '제주특별자치도 제주시 연동 312-1 제주도청',
								region: '제주도'
							}
						];
						setAllEvents(dummyEvents);
					}
				} catch (error) {
					console.error("공공데이터포털 API 호출 실패:", error);
					// API 호출 실패 시 더미 데이터 사용
					const dummyEvents = [
						{
							id: 'seoul-festival',
							title: '서울 문화축제',
							date: new Date().toLocaleDateString('ko-KR'),
							description: '서울에서 개최되는 지역 문화축제입니다.',
							location: '서울 문화회관',
							address: '서울특별시 중구 세종대로 110 서울특별시청',
							region: '서울'
						},
						{
							id: 'gyeonggi-market',
							title: '경기도 전통시장 축제',
							date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
							description: '경기도 전통시장에서 열리는 특별한 축제입니다.',
							location: '수원 전통시장',
							address: '경기도 수원시 팔달구 정조로 800 경기도청',
							region: '경기도'
						},
						{
							id: 'gangwon-mountain',
							title: '강원도 산악축제',
							date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
							description: '강원도의 아름다운 산을 배경으로 하는 축제입니다.',
							location: '춘천 시민공원',
							address: '강원도 춘천시 중앙로 1 강원도청',
							region: '강원도'
						},
						{
							id: 'chungbuk-makgeolli',
							title: '충청북도 청주 막걸리 축제',
							date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
							description: '청주의 전통 막걸리를 체험할 수 있는 축제입니다.',
							location: '청주 문화의 거리',
							address: '충청북도 청주시 상당구 상당로 155 충청북도청',
							region: '충청북도'
						},
						{
							id: 'jeonbuk-hanok',
							title: '전라북도 전주 한옥마을 축제',
							date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
							description: '전주 한옥마을의 아름다운 전통문화를 체험하는 축제입니다.',
							location: '전주 한옥마을',
							address: '전라북도 전주시 완산구 기린대로 99 전라북도청',
							region: '전라북도'
						},
						{
							id: 'jeju-haenyeo',
							title: '제주도 해녀문화 축제',
							date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
							description: '제주도의 독특한 해녀문화를 체험할 수 있는 축제입니다.',
							location: '제주 해녀박물관',
							address: '제주특별자치도 제주시 연동 312-1 제주도청',
							region: '제주도'
						}
					];
					setAllEvents(dummyEvents);
				}
			} catch (error) {
				console.error("행사정보를 가져오는 중 오류 발생:", error);
				setError("행사정보를 불러올 수 없습니다.");
				setAllEvents([]);
			} finally {
				setLoading(false);
			}
		};

		fetchAllEvents();
	}, []);

	// 필터링 및 정렬된 이벤트 목록
	const filteredAndSortedEvents = sortEvents(
		filterAndSearchEvents(allEvents, selectedRegion, searchTerm, showFavoritesOnly, favorites),
		sortBy
	);

	const regions = [
		'전체', '서울', '경기도', '강원도', '충청북도', '충청남도', 
		'전라북도', '전라남도', '경상북도', '경상남도', '제주도'
	];

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

	if (loading) {
		return (
			<div className="all-events">
				<Helmet>
					<title>🎉 전국 행사정보 - 날씨 웹앱</title>
					<meta name="description" content="전국 각 지역의 문화행사와 축제 정보를 한눈에 확인하세요." />
				</Helmet>
				
				<div className="all-events__header">
					<h1 className="all-events__title">🎉 전국 행사정보</h1>
					<p className="all-events__subtitle">전국 각 지역의 문화행사와 축제를 한눈에 확인하세요</p>
				</div>
				
				<div className="all-events__loading">
					<div className="loading__spinner"></div>
					<p>행사정보를 불러오는 중...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="all-events">
				<Helmet>
					<title>🎉 전국 행사정보 - 날씨 웹앱</title>
					<meta name="description" content="전국 각 지역의 문화행사와 축제 정보를 한눈에 확인하세요." />
				</Helmet>
				
				<div className="all-events__header">
					<h1 className="all-events__title">🎉 전국 행사정보</h1>
					<p className="all-events__subtitle">전국 각 지역의 문화행사와 축제를 한눈에 확인하세요</p>
				</div>
				
				<div className="all-events__error">
					<p>{error}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="all-events">
			<Helmet>
				<title>🎉 전국 행사정보 - 날씨 웹앱</title>
				<meta name="description" content="전국 각 지역의 문화행사와 축제 정보를 한눈에 확인하세요." />
			</Helmet>
			
			<div className="all-events__header">
				<h1 className="all-events__title">🎉 전국 행사정보</h1>
				<p className="all-events__subtitle">전국 각 지역의 문화행사와 축제를 한눈에 확인하세요</p>
			</div>

			{/* 검색 및 필터 섹션 */}
			<div className="all-events__controls">
				<div className="search-section">
					<div className="search-box">
						<input
							type="text"
							placeholder="행사명, 설명, 장소로 검색..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="search-input"
						/>
						<button className="search-button">
							🔍
						</button>
					</div>
				</div>

				<div className="filter-section">
					<div className="filter-row">
						<div className="sort-controls">
							<label htmlFor="sort-select">정렬:</label>
							<select
								id="sort-select"
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="sort-select"
							>
								<option value="date">날짜순</option>
								<option value="title">제목순</option>
								<option value="region">지역순</option>
							</select>
						</div>

						<div className="favorite-toggle">
							<label className="favorite-checkbox">
								<input
									type="checkbox"
									checked={showFavoritesOnly}
									onChange={(e) => setShowFavoritesOnly(e.target.checked)}
								/>
								<span className="checkmark">⭐</span>
								즐겨찾기만 보기
							</label>
						</div>
					</div>
				</div>
			</div>

			{/* 지역 필터 */}
			<div className="all-events__filter">
				<div className="region-filter">
					{regions.map(region => (
						<button
							key={region}
							className={`region-filter__button ${selectedRegion === region ? 'region-filter__button--active' : ''}`}
							onClick={() => setSelectedRegion(region)}
						>
							{region}
						</button>
					))}
				</div>
			</div>

			{/* 결과 통계 */}
			<div className="all-events__stats">
				<p>
					총 <strong>{filteredAndSortedEvents.length}</strong>개의 행사가 있습니다.
					{searchTerm && ` ("${searchTerm}" 검색결과)`}
					{showFavoritesOnly && ' (즐겨찾기만)'}
				</p>
			</div>

			{/* 행사 목록 */}
			<div className="all-events__content">
				{filteredAndSortedEvents.length > 0 ? (
					<div className="all-events__list">
						{filteredAndSortedEvents.map((event, index) => (
							<div key={event.id || index} className="event-card event-card--large">
								<div className="event-card__header">
									<div className="event-card__title-section">
										<h4 className="event-card__title">
											{event.title || event.eventName || '제목 없음'}
										</h4>
										<button
											className={`favorite-button ${favorites.includes(event.id || event.title) ? 'favorite-button--active' : ''}`}
											onClick={(e) => {
												e.stopPropagation();
												toggleFavorite(event.id || event.title);
											}}
											title={favorites.includes(event.id || event.title) ? '즐겨찾기 해제' : '즐겨찾기 추가'}
										>
											{favorites.includes(event.id || event.title) ? '⭐' : '☆'}
										</button>
									</div>
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
									{event.region && (
										<p className="event-card__region">
											🏛️ {event.region}
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
					<div className="all-events__empty">
						<p>선택한 조건에 맞는 행사가 없습니다.</p>
						<p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.5rem' }}>
							검색어를 변경하거나 다른 지역을 선택해보세요.
						</p>
					</div>
				)}
			</div>
			
			{/* 지도 모달 */}
			<EventMap 
				event={selectedEvent} 
				isOpen={isMapOpen} 
				onClose={closeMap} 
			/>
		</div>
	);
}

export default AllEvents; 