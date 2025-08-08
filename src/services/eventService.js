import axios from "axios";
import apiConfig from "../config/apiConfig";

// API 설정 가져오기
const { API_KEY: PUBLIC_DATA_API_KEY, BASE_URL: PUBLIC_DATA_BASE_URL, FESTIVAL_ENDPOINT } = apiConfig.PUBLIC_DATA;

// 더미 데이터 사용 여부 (true: 더미 데이터 사용, false: 실제 API 사용)
const USE_DUMMY_DATA = false; // 배포 시 false로 변경하세요!

class EventService {
	/**
	 * 더미 행사 데이터를 반환하는 함수
	 * @param {string} regionName - 지역명
	 * @param {number} page - 페이지 번호
	 * @param {number} perPage - 페이지당 항목 수
	 * @returns {Promise<Array>} 더미 행사 데이터 배열
	 */
	async getDummyEventData(regionName, page = 1, perPage = 20) {
		// 약간의 지연을 추가하여 실제 API 호출처럼 보이게 함
		await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
		
		const dummyEvents = [
			{
				id: `${regionName}-festival-1`,
				title: `${regionName} 문화축제`,
				date: new Date().toLocaleDateString('ko-KR'),
				description: `${regionName}에서 개최되는 지역 문화축제입니다. 다양한 전통 공연과 체험 프로그램이 준비되어 있습니다.`,
				location: `${regionName} 문화회관`,
				address: this.getRegionAddress(regionName, '문화회관'),
				region: regionName,
				image: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=문화축제',
				category: '문화행사'
			},
			{
				id: `${regionName}-festival-2`,
				title: `${regionName} 전통시장 축제`,
				date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
				description: `${regionName} 전통시장에서 열리는 특별한 축제입니다. 지역 특산품과 전통 음식을 만나보세요.`,
				location: `${regionName} 전통시장`,
				address: this.getRegionAddress(regionName, '전통시장'),
				region: regionName,
				image: 'https://via.placeholder.com/300x200/50C878/FFFFFF?text=전통시장',
				category: '전통행사'
			},
			{
				id: `${regionName}-festival-3`,
				title: `${regionName} 봄꽃 축제`,
				date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
				description: `${regionName}의 아름다운 봄꽃을 감상할 수 있는 축제입니다. 벚꽃, 개나리, 진달래 등 다양한 꽃들이 만발합니다.`,
				location: `${regionName} 공원`,
				address: this.getRegionAddress(regionName, '공원'),
				region: regionName,
				image: 'https://via.placeholder.com/300x200/FF69B4/FFFFFF?text=봄꽃축제',
				category: '자연행사'
			},
			{
				id: `${regionName}-festival-4`,
				title: `${regionName} 음식 축제`,
				date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
				description: `${regionName}의 대표 음식들을 맛볼 수 있는 축제입니다. 지역 특산품과 전통 음식이 준비되어 있습니다.`,
				location: `${regionName} 음식거리`,
				address: this.getRegionAddress(regionName, '음식거리'),
				region: regionName,
				image: 'https://via.placeholder.com/300x200/FF6B35/FFFFFF?text=음식축제',
				category: '음식행사'
			},
			{
				id: `${regionName}-festival-5`,
				title: `${regionName} 예술 축제`,
				date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
				description: `${regionName}의 예술가들이 참여하는 문화 예술 축제입니다. 다양한 공연과 전시회가 열립니다.`,
				location: `${regionName} 예술회관`,
				address: this.getRegionAddress(regionName, '예술회관'),
				region: regionName,
				image: 'https://via.placeholder.com/300x200/9B59B6/FFFFFF?text=예술축제',
				category: '예술행사'
			}
		];

		// 페이지네이션 처리
		const startIndex = (page - 1) * perPage;
		const endIndex = startIndex + perPage;
		return dummyEvents.slice(startIndex, endIndex);
	}

	/**
	 * 지역별 문화행사 정보를 가져옵니다.
	 * @param {string} regionName - 지역명 (예: "서울", "경기도")
	 * @param {number} page - 페이지 번호 (기본값: 1)
	 * @param {number} perPage - 페이지당 항목 수 (기본값: 20)
	 * @returns {Promise<Array>} 행사 데이터 배열
	 */
	async getEventsByRegion(regionName, page = 1, perPage = 20) {
		// 더미 데이터 사용 설정이 활성화되어 있으면 더미 데이터 반환
		if (USE_DUMMY_DATA) {
			console.log(`[더미 데이터] ${regionName} 지역 행사 정보 요청`);
			return await this.getDummyEventData(regionName, page, perPage);
		}

		try {
			// 공공데이터포털 문화행사정보 API 호출
			const response = await axios.get(
				`${PUBLIC_DATA_BASE_URL}${FESTIVAL_ENDPOINT}?serviceKey=${PUBLIC_DATA_API_KEY}&page=${page}&perPage=${perPage}&returnType=JSON`
			);

			if (response.data && response.data.data && response.data.data.length > 0) {
				// 실제 API 데이터 처리 및 정규화
				const processedEvents = response.data.data.map((event, index) => ({
					...event,
					id: event.id || `api-event-${index}`,
					// 위치 정보 정규화
					address: event.address || event.addr1 || event.addr2 || event.place || event.location || event.venue,
					location: event.location || event.place || event.venue || event.address,
					region: event.region || this.extractRegionFromAddress(event.address || event.addr1 || event.addr2)
				}));

				// 지역 필터링
				const filteredEvents = this.filterEventsByRegion(processedEvents, regionName);
				return filteredEvents;
			} else {
				// API에서 데이터가 없는 경우 더미 데이터 반환
				return this.getDummyEvents(regionName);
			}
		} catch (error) {
			console.error("공공데이터포털 API 호출 실패:", error);
			// API 호출 실패 시 더미 데이터 반환
			return this.getDummyEvents(regionName);
		}
	}

	/**
	 * 지역별로 행사를 필터링합니다.
	 * @param {Array} events - 행사 데이터 배열
	 * @param {string} regionName - 지역명
	 * @returns {Array} 필터링된 행사 배열
	 */
	filterEventsByRegion(events, regionName) {
		return events.filter(event => {
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
				   this.matchRegionKeywords(eventTitle, eventLocation, eventAddress, regionName);
		});
	}

	/**
	 * 지역별 키워드를 매칭합니다.
	 * @param {string} title - 제목
	 * @param {string} location - 위치
	 * @param {string} address - 주소
	 * @param {string} regionName - 지역명
	 * @returns {boolean} 매칭 여부
	 */
	matchRegionKeywords(title, location, address, regionName) {
		const regionKeywords = {
			'서울': ['서울'],
			'경기도': ['경기', '수원', '성남', '부천', '안양', '고양', '용인', '평택', '의정부', '안산', '남양주'],
			'강원도': ['강원', '춘천', '강릉', '원주', '동해', '태백', '속초', '삼척', '홍천', '철원', '화천'],
			'충청북도': ['충북', '청주', '충주', '제천', '보은', '옥천', '영동', '진천', '괴산', '음성', '증평'],
			'충청남도': ['충남', '천안', '아산', '서산', '공주', '보령', '논산', '계룡', '홍성', '예산'],
			'전라북도': ['전북', '전주', '익산', '군산', '정읍', '김제', '남원', '순창', '장수', '진안', '무주'],
			'전라남도': ['전남', '광주', '여수', '순천', '목포', '나주', '담양', '곡성', '구례', '고흥', '완도'],
			'경상북도': ['경북', '대구', '포항', '구미', '경산', '경주', '상주', '문경', '영주', '영천', '김천'],
			'경상남도': ['경남', '부산', '울산', '진주', '통영', '사천', '김해', '양산', '거제', '밀양'],
			'제주도': ['제주', '서귀포']
		};

		const keywords = regionKeywords[regionName] || [];
		const searchText = `${title} ${location} ${address}`.toLowerCase();

		return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
	}

	/**
	 * 주소에서 지역을 추출합니다.
	 * @param {string} address - 주소
	 * @returns {string} 지역명
	 */
	extractRegionFromAddress(address) {
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
	}

	/**
	 * 더미 행사 데이터를 생성합니다.
	 * @param {string} regionName - 지역명
	 * @returns {Array} 더미 행사 데이터 배열
	 */
	getDummyEvents(regionName) {
		return [
			{
				id: `${regionName}-festival-1`,
				title: `${regionName} 문화축제`,
				date: new Date().toLocaleDateString('ko-KR'),
				description: `${regionName}에서 개최되는 지역 문화축제입니다.`,
				location: `${regionName} 문화회관`,
				address: this.getRegionAddress(regionName, '문화회관'),
				region: regionName
			},
			{
				id: `${regionName}-festival-2`,
				title: `${regionName} 전통시장 축제`,
				date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
				description: `${regionName} 전통시장에서 열리는 특별한 축제입니다.`,
				location: `${regionName} 전통시장`,
				address: this.getRegionAddress(regionName, '전통시장'),
				region: regionName
			}
		];
	}

	/**
	 * 지역별 주소를 생성합니다.
	 * @param {string} region - 지역명
	 * @param {string} place - 장소명
	 * @returns {string} 주소
	 */
	getRegionAddress(region, place) {
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
	}

	/**
	 * 지역명을 공공데이터포털 API에 맞는 형식으로 변환합니다.
	 * @param {string} region - 지역명
	 * @returns {string} 지역 코드
	 */
	getRegionCode(region) {
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
	}
}

// 싱글톤 인스턴스 생성
const eventService = new EventService();

export default eventService;
