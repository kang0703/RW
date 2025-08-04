import { useEffect, useState, useRef } from "react";
import { Map, MapMarker, MapTypeControl, ZoomControl } from "react-kakao-maps-sdk";

function EventMap({ event, isOpen, onClose }) {
	const [mapKey, setMapKey] = useState(0);
	const [coordinates, setCoordinates] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [mapInstance, setMapInstance] = useState(null);
	const [kakaoLoaded, setKakaoLoaded] = useState(false);

	// 주소를 좌표로 변환하는 함수 (카카오 지오코딩 API 사용)
	const geocodeAddress = async (address) => {
		if (!address || address.trim() === '') {
			return null;
		}

		try {
			setLoading(true);
			setError(null);

			console.log('카카오 지오코딩 시도:', address);

			// 환경변수에서 API 키 가져오기 (없으면 기본값 사용)
			const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY || 'a4953cf58dc5cdca2dcdbb190de607e1';
			
			// 카카오 지오코딩 API 호출 (무료)
			const response = await fetch(
				`https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
				{
					headers: {
						'Authorization': `KakaoAK ${apiKey}`
					}
				}
			);

			if (!response.ok) {
				throw new Error('지오코딩 API 호출 실패');
			}

			const data = await response.json();

			if (data.documents && data.documents.length > 0) {
				const result = data.documents[0];
				const coords = {
					lat: parseFloat(result.y),
					lng: parseFloat(result.x),
					display_name: result.address_name
				};
				console.log('카카오 지오코딩 성공:', coords);
				return coords;
			}

			console.log('카카오 지오코딩 실패: 결과 없음');
			return null;
		} catch (error) {
			console.error('카카오 지오코딩 오류:', error);
			setError('주소를 좌표로 변환할 수 없습니다. API 키를 확인해주세요.');
			return null;
		} finally {
			setLoading(false);
		}
	};

	// 공공데이터포털 API에서 받은 위치 정보를 우선순위에 따라 처리
	const getLocationFromEvent = (event) => {
		// 공공데이터포털 API의 다양한 위치 필드들 확인
		const locationFields = [
			'address',           // 상세주소
			'place',             // 장소명
			'location',          // 위치
			'venue',             // 행사장소
			'site',              // 사이트
			'address1',          // 주소1
			'address2',          // 주소2
			'locationName',      // 위치명
			'addr1',             // 주소1 (다른 형식)
			'addr2',             // 주소2 (다른 형식)
			'placeName',         // 장소명 (다른 형식)
			'eventPlace',        // 행사장소 (다른 형식)
			'eventLocation',     // 행사위치 (다른 형식)
			'region'             // 지역 (마지막 우선순위)
		];

		// 우선순위에 따라 위치 정보 찾기
		for (const field of locationFields) {
			if (event[field] && event[field].trim()) {
				const location = event[field].trim();
				console.log(`위치 정보 발견 (${field}):`, location);
				return location;
			}
		}
		
		console.log('위치 정보를 찾을 수 없음:', event);
		return null;
	};

	// 카카오 지도 API 로드 확인
	useEffect(() => {
		const checkKakaoMap = () => {
			if (window.kakao && window.kakao.maps) {
				setKakaoLoaded(true);
				console.log('카카오 지도 API 로드 완료');
			} else {
				setKakaoLoaded(false);
				console.log('카카오 지도 API 로드 실패');
			}
		};

		// 초기 확인
		checkKakaoMap();

		// 주기적으로 확인 (최대 10초)
		let attempts = 0;
		const interval = setInterval(() => {
			attempts++;
			checkKakaoMap();
			
			if (kakaoLoaded || attempts >= 20) {
				clearInterval(interval);
			}
		}, 500);

		return () => clearInterval(interval);
	}, [kakaoLoaded]);

	// 모달이 열릴 때마다 좌표 정보 업데이트
	useEffect(() => {
		if (isOpen && event) {
			setMapKey(prev => prev + 1);
			setError(null);
			
			const location = getLocationFromEvent(event);
			
			if (location) {
				geocodeAddress(location).then(coords => {
					if (coords) {
						setCoordinates(coords);
					} else {
						// 주소 변환 실패 시 기본 지역 좌표 사용
						const fallbackCoords = getFallbackCoordinates(event);
						setCoordinates(fallbackCoords);
					}
				});
			} else {
				// 위치 정보가 없을 때 기본 지역 좌표 사용
				const fallbackCoords = getFallbackCoordinates(event);
				setCoordinates(fallbackCoords);
			}
		}
	}, [isOpen, event]);

	// 기본 지역 좌표 (주소 변환 실패 시 사용)
	const getFallbackCoordinates = (event) => {
		const fallbackCoords = {
			'서울': { lat: 37.5665, lng: 126.9780 }, // 서울시청
			'경기도': { lat: 37.2636, lng: 127.0286 }, // 수원시청
			'수원': { lat: 37.2636, lng: 127.0286 },
			'성남': { lat: 37.4449, lng: 127.1389 },
			'강원도': { lat: 37.8813, lng: 127.7300 }, // 춘천시청
			'춘천': { lat: 37.8813, lng: 127.7300 },
			'강릉': { lat: 37.7519, lng: 128.8761 },
			'충청북도': { lat: 36.6424, lng: 127.4890 }, // 청주시청
			'청주': { lat: 36.6424, lng: 127.4890 },
			'충청남도': { lat: 36.6000, lng: 126.6500 }, // 홍성군청
			'천안': { lat: 36.8151, lng: 127.1139 },
			'아산': { lat: 36.7897, lng: 127.0017 },
			'전라북도': { lat: 35.8242, lng: 127.1480 }, // 전주시청
			'전주': { lat: 35.8242, lng: 127.1480 },
			'전라남도': { lat: 34.9900, lng: 126.4800 }, // 무안군청
			'광주': { lat: 35.1595, lng: 126.8526 },
			'여수': { lat: 34.7604, lng: 127.6622 },
			'경상북도': { lat: 36.5680, lng: 128.7290 }, // 안동시청
			'대구': { lat: 35.8714, lng: 128.6014 },
			'포항': { lat: 36.0320, lng: 129.3650 },
			'경상남도': { lat: 35.2278, lng: 128.6817 }, // 창원시청
			'부산': { lat: 35.1796, lng: 129.0756 },
			'울산': { lat: 35.5384, lng: 129.3114 },
			'제주도': { lat: 33.4996, lng: 126.5312 }, // 제주시청
			'제주': { lat: 33.4996, lng: 126.5312 }
		};

		// 이벤트 정보에서 지역 찾기
		const eventText = JSON.stringify(event).toLowerCase();
		for (const [region, coords] of Object.entries(fallbackCoords)) {
			if (eventText.includes(region.toLowerCase())) {
				return coords;
			}
		}
		
		// 기본 좌표 (서울 시청)
		return { lat: 37.5665, lng: 126.9780 };
	};

	if (!isOpen || !event) return null;

	const location = getLocationFromEvent(event);

	return (
		<div className="event-map-overlay" onClick={onClose}>
			<div className="event-map-modal" onClick={(e) => e.stopPropagation()}>
				<div className="event-map-header">
					<h3>🗺️ {event.title || '행사 위치'}</h3>
					<button className="event-map-close" onClick={onClose}>
						✕
					</button>
				</div>
				<div className="event-map-content">
					<div className="event-map-container">
						{loading ? (
							<div className="map-loading">
								<div className="loading-spinner"></div>
								<p>📍 위치 정보를 불러오는 중...</p>
								<p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.5rem' }}>
									카카오 지도 API를 통해 정확한 위치를 찾고 있습니다
								</p>
							</div>
						) : coordinates && kakaoLoaded ? (
							<Map
								key={mapKey}
								center={{ lat: coordinates.lat, lng: coordinates.lng }}
								style={{ width: "100%", height: "500px" }}
								level={3}
								onLoad={(map) => {
									setMapInstance(map);
									console.log('카카오 지도 로드 완료');
								}}
								onError={(error) => {
									console.error('카카오 지도 로드 오류:', error);
									setError('지도를 불러오는 중 오류가 발생했습니다.');
								}}
								className="kakao-map"
							>
								<MapMarker
									position={{ lat: coordinates.lat, lng: coordinates.lng }}
									onClick={() => {
										// 마커 클릭 시 팝업 표시
										if (mapInstance && window.kakao && window.kakao.maps) {
											try {
												const infowindow = new window.kakao.maps.InfoWindow({
													content: `
														<div style="padding: 15px; text-align: center; min-width: 200px;">
															<h4 style="margin: 0 0 8px 0; color: #2c3e50; font-size: 16px; font-weight: 600;">
																${event.title || '행사'}
															</h4>
															<p style="margin: 0 0 5px 0; font-size: 14px; color: #667eea;">
																📍 ${location || '위치 정보 없음'}
															</p>
															${event.description ? `<p style="margin: 0; font-size: 12px; color: #666; line-height: 1.4;">${event.description}</p>` : ''}
															${event.startDate || event.date ? `<p style="margin: 5px 0 0 0; font-size: 12px; color: #28a745; font-weight: 500;">📅 ${event.startDate || event.date}</p>` : ''}
														</div>
													`
												});
												infowindow.open(mapInstance, new window.kakao.maps.LatLng(coordinates.lat, coordinates.lng));
											} catch (error) {
												console.error('인포윈도우 생성 오류:', error);
											}
										}
									}}
								/>
								<MapTypeControl position={window.kakao.maps.ControlPosition.TOPRIGHT} />
								<ZoomControl position={window.kakao.maps.ControlPosition.RIGHT} />
							</Map>
														) : !kakaoLoaded ? (
							<div className="map-error">
								<p>🔄 카카오 지도 API를 불러오는 중...</p>
								<p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
									잠시만 기다려주세요.
								</p>
								<div style={{ marginTop: '1rem', padding: '0.5rem', background: '#fffbf0', borderRadius: '4px', border: '1px solid #f6ad55' }}>
									<p style={{ margin: 0, fontSize: '0.8rem', color: '#c05621' }}>
										💡 <strong>팁:</strong> 인터넷 연결을 확인하고 페이지를 새로고침해보세요.
									</p>
								</div>
							</div>
						) : (
							<div className="map-error">
								<p>❌ 지도를 불러올 수 없습니다.</p>
								<p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
									위치 정보를 확인해주세요.
								</p>
								{error && (
									<div style={{ marginTop: '1rem', padding: '0.5rem', background: '#fff5f5', borderRadius: '4px', border: '1px solid #fed7d7' }}>
										<p style={{ margin: 0, fontSize: '0.8rem', color: '#c53030' }}>
											<strong>오류 상세:</strong> {error}
										</p>
									</div>
								)}
								<div style={{ marginTop: '1rem', padding: '0.5rem', background: '#f0fff4', borderRadius: '4px', border: '1px solid #9ae6b4' }}>
									<p style={{ margin: 0, fontSize: '0.8rem', color: '#22543d' }}>
										💡 <strong>해결 방법:</strong> KAKAO_MAP_SETUP.md 파일을 참고하여 카카오 지도 API 키를 설정해주세요.
									</p>
								</div>
							</div>
						)}
					</div>
					<div className="event-map-info">
						<div className="event-map-info-item">
							<strong>📍 위치:</strong> {location || '위치 정보 없음'}
						</div>
						<div className="event-map-info-item">
							<strong>🏛️ 지역:</strong> {event.region || '지역 정보 없음'}
						</div>
						<div className="event-map-info-item">
							<strong>📅 날짜:</strong> {event.startDate || event.date || '날짜 정보 없음'}
						</div>
						{event.description && (
							<div className="event-map-info-item">
								<strong>📝 설명:</strong> {event.description}
							</div>
						)}
						{coordinates && (
							<div className="event-map-info-item">
								<strong>🌍 좌표:</strong> {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
							</div>
						)}
						<div className="event-map-info-item">
							<strong>🗺️ 지도 상태:</strong> {kakaoLoaded ? '✅ 로드됨' : '⏳ 로딩 중'}
						</div>
						{error && (
							<div className="event-map-info-item event-map-error">
								<strong>⚠️ 오류:</strong> {error}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default EventMap; 