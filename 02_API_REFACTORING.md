# API 리팩토링 완료

## 개요
날씨 API와 여행/행사 API 호출을 중앙에서 관리할 수 있도록 리팩토링을 완료했습니다.

## 변경 사항

### 1. 서비스 레이어 분리

#### 날씨 API 서비스 (`src/services/weatherService.js`)
- OpenWeatherMap API 호출을 중앙에서 관리
- 도시명, 좌표, 현재 위치 기반 날씨 정보 조회
- 여러 도시의 날씨 정보를 한 번에 조회하는 기능
- 에러 처리 및 로깅 통합

#### 여행/행사 API 서비스 (`src/services/eventService.js`)
- 공공데이터포털 문화행사정보 API 호출을 중앙에서 관리
- 지역별 행사 정보 필터링
- API 실패 시 더미 데이터 제공
- 지역별 키워드 매칭 로직

### 2. 유틸리티 함수 분리 (`src/utils/weatherUtils.js`)
- 날씨 아이콘 생성 함수
- 도시명 한글 변환 함수
- 날씨 상태 한글 변환 함수
- 지역명 추출 함수
- 거리 계산 함수

### 3. 설정 파일 중앙화 (`src/config/apiConfig.js`)
- API 키와 엔드포인트를 중앙에서 관리
- 환경별 설정 지원 (개발/프로덕션)
- 환경변수 사용 가능

## 사용 방법

### 날씨 정보 조회
```javascript
import weatherService from './services/weatherService';

// 도시명으로 날씨 조회
const weather = await weatherService.getWeatherByCity('Seoul');

// 좌표로 날씨 조회
const weather = await weatherService.getWeatherByCoords(37.5665, 126.9780);

// 현재 위치 날씨 조회
const weather = await weatherService.getCurrentLocationWeather();

// 여러 도시 날씨 조회
const weathers = await weatherService.getWeatherForMultipleCities(['Seoul', 'Busan']);
```

### 행사 정보 조회
```javascript
import eventService from './services/eventService';

// 지역별 행사 정보 조회
const events = await eventService.getEventsByRegion('서울');
```

### 유틸리티 함수 사용
```javascript
import { 
  getWeatherIcon, 
  getKoreanCityName, 
  getKoreanWeatherDescription,
  getRegionFromCity 
} from './utils/weatherUtils';

// 날씨 아이콘 생성
const icon = getWeatherIcon('Clear', 'clear sky');

// 도시명 한글 변환
const koreanName = getKoreanCityName('Seoul'); // '서울'

// 날씨 상태 한글 변환
const description = getKoreanWeatherDescription('Clear', 'clear sky'); // '맑음'

// 지역명 추출
const region = getRegionFromCity('Seoul'); // '서울'
```

## 장점

1. **코드 중복 제거**: API 호출 로직이 중앙화되어 중복 코드가 제거됨
2. **유지보수성 향상**: API 변경 시 한 곳에서만 수정하면 됨
3. **에러 처리 통합**: 모든 API 호출에 일관된 에러 처리 적용
4. **설정 관리**: API 키와 엔드포인트를 중앙에서 관리
5. **재사용성**: 다른 컴포넌트에서도 쉽게 API 서비스 사용 가능
6. **테스트 용이성**: 서비스 레이어를 독립적으로 테스트 가능

## 파일 구조

```
src/
├── services/
│   ├── weatherService.js      # 날씨 API 서비스
│   └── eventService.js        # 행사 API 서비스
├── utils/
│   └── weatherUtils.js        # 날씨 관련 유틸리티 함수
├── config/
│   └── apiConfig.js           # API 설정
└── components/
    └── EventInfo.jsx          # 리팩토링된 컴포넌트
```

## 환경변수 설정 (선택사항)

프로덕션 환경에서는 환경변수를 사용하는 것을 권장합니다:

```bash
# .env 파일
REACT_APP_WEATHER_API_KEY=your_weather_api_key
REACT_APP_PUBLIC_DATA_API_KEY=your_public_data_api_key
```

## 마이그레이션 완료된 컴포넌트

- ✅ `App.jsx`
- ✅ `EventInfo.jsx`
- ✅ `SeoulWeather.jsx`
- ✅ `GyeonggiWeather.jsx`
- ✅ `GangwonWeather.jsx`
- ✅ `ChungbukWeather.jsx`
- ✅ `ChungnamWeather.jsx`
- ✅ `JeonbukWeather.jsx`
- ✅ `JeonnamWeather.jsx`
- ✅ `GyeongbukWeather.jsx`
- ✅ `GyeongnamWeather.jsx`
- ✅ `JejuWeather.jsx`

모든 컴포넌트가 새로운 서비스 레이어를 사용하도록 리팩토링이 완료되었습니다.
