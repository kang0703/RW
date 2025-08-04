# 🌤️ 한국 날씨 웹앱

전국 10개 지역의 실시간 날씨 정보와 지역 행사정보를 제공하는 React 웹 애플리케이션입니다.

## 🚀 주요 기능

- **실시간 날씨 정보**: OpenWeatherMap API를 사용한 정확한 날씨 데이터
- **지역별 행사정보**: 공공데이터포털 API를 활용한 지역 문화행사 정보
- **반응형 디자인**: 모바일과 데스크톱에서 최적화된 사용자 경험
- **SEO 최적화**: 메타 태그와 구조화된 데이터로 검색 엔진 최적화

## 📍 지원 지역

- 서울
- 경기도 (수원, 성남, 부천, 안양, 고양, 용인, 평택, 의정부, 안산, 남양주)
- 강원도
- 충청북도
- 충청남도
- 전라북도
- 전라남도
- 경상북도
- 경상남도
- 제주도

## 🛠️ 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# OpenWeatherMap API 키 (필수)
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here

# 공공데이터포털 API 키 (선택 - 행사정보 기능용)
VITE_PUBLIC_DATA_API_KEY=your_public_data_api_key_here
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 빌드
```bash
npm run build
```

## 🔑 API 키 발급 방법

### OpenWeatherMap API
1. [OpenWeatherMap](https://openweathermap.org/) 회원가입
2. API Keys 섹션에서 무료 API 키 발급
3. `.env` 파일에 `VITE_OPENWEATHER_API_KEY`로 설정

### 공공데이터포털 API
1. [공공데이터포털](https://www.data.go.kr/) 회원가입
2. 문화행사정보 API 신청 및 승인
3. 발급받은 서비스 키를 `.env` 파일에 `VITE_PUBLIC_DATA_API_KEY`로 설정

## 🎨 기술 스택

- **Frontend**: React 18, Vite
- **Styling**: SCSS, CSS Modules
- **API**: OpenWeatherMap API, 공공데이터포털 API
- **SEO**: React Helmet
- **Routing**: React Router

## 📱 반응형 디자인

- 모바일 우선 설계
- 태블릿 및 데스크톱 최적화
- 터치 친화적 인터페이스

## 🔧 커스터마이징

### 지역별 색상 테마 수정
`src/styles/_variables.scss` 파일에서 지역별 그라데이션 색상을 수정할 수 있습니다.

### 새로운 지역 추가
1. `src/regions/` 폴더에 새로운 지역 컴포넌트 생성
2. 라우팅 설정 추가
3. 지역별 색상 테마 추가

## 📄 라이선스

MIT License
