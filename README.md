# 🌤️ 갈래말래 날씨여행

정확한 날씨 정보로 더 나은 여행을 계획하는 당신의 든든한 동반자

## 📋 프로젝트 개요

갈래말래 날씨여행은 React + Vite + SCSS를 기반으로 한 현대적인 날씨 앱입니다. OpenWeatherMap API를 통해 실시간 날씨 정보와 5일 예보를 제공하며, 사용자에게 날씨별 맞춤 대처방법과 여행 팁을 제공합니다.

## ✨ 주요 기능

- 🌡️ **실시간 날씨 정보**: OpenWeatherMap API 기반의 정확한 날씨 데이터
- 📍 **위치 기반 서비스**: 현재 위치 또는 원하는 도시의 맞춤형 날씨 정보
- 📅 **5일 날씨 예보**: 앞으로 5일간의 상세한 날씨 예보
- 💡 **날씨별 가이드**: 다양한 날씨 상황에 맞는 대처방법과 여행 팁
- 📱 **반응형 디자인**: 모든 디바이스에서 최적화된 사용자 경험
- 🚀 **빠른 로딩**: 최적화된 코드로 빠른 페이지 로딩 속도

## 🛠️ 기술 스택

- **프론트엔드**: React 18, Vite, SCSS
- **API**: OpenWeatherMap API, Kakao Map API, Public Data Portal
- **스타일링**: SCSS, 반응형 디자인
- **품질**: SEO 최적화, Core Web Vitals, 접근성 준수

## 🚀 시작하기

### 필수 요구사항

- Node.js 16.0.0 이상
- npm 7.0.0 이상

### 설치 및 실행

1. 저장소 클론
```bash
git clone https://github.com/your-username/weather-travel.git
cd weather-travel
```

2. 의존성 설치
```bash
npm install
```

3. 개발 서버 실행
```bash
npm run dev
```

4. 브라우저에서 `http://localhost:5173` 접속

### 빌드

```bash
npm run build
```

### 미리보기

```bash
npm run preview
```

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── Header/         # 헤더 컴포넌트
│   ├── Footer/         # 푸터 컴포넌트
│   ├── Weather/        # 날씨 정보 컴포넌트
│   └── Location/       # 위치 선택 컴포넌트
├── pages/              # 페이지 컴포넌트
│   ├── Home/           # 홈페이지
│   ├── LocationWeather/# 지역별 날씨 페이지
│   ├── WeatherGuide/   # 날씨 가이드 페이지
│   └── About/          # 소개 페이지
├── config/             # 설정 파일
│   └── api.js          # API 키 및 엔드포인트
└── styles/             # 전역 스타일
    └── App.scss        # 메인 스타일시트
```

## 🔑 API 설정

프로젝트를 실행하기 전에 다음 API 키들을 설정해야 합니다:

1. `src/config/api.js` 파일에서 API 키들을 확인
2. 필요한 경우 환경변수로 관리

### 필요한 API

- **OpenWeatherMap API**: 날씨 정보 제공
- **Kakao Map API**: 위치 검색 및 지도 서비스
- **Public Data Portal**: 공공데이터 서비스

## 📱 반응형 디자인

- 모바일 우선 접근법
- 모든 화면 크기에서 최적화된 사용자 경험
- 터치 친화적 인터페이스

## 🎯 애드센스 준비

이 프로젝트는 Google AdSense 승인을 위해 다음과 같은 요소들을 준비하고 있습니다:

- ✅ 고품질 원본 콘텐츠 제공
- ✅ 반응형 웹 디자인
- ✅ 빠른 로딩 속도 (Core Web Vitals 준수)
- ✅ SEO 최적화
- ✅ 접근성 준수
- ✅ 정기적인 콘텐츠 업데이트
- ✅ 사용자 경험 최적화

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의하기

- **이메일**: contact@weather-travel.com
- **프로젝트 링크**: https://github.com/your-username/weather-travel

## 🙏 감사의 말

- [OpenWeatherMap](https://openweathermap.org/) - 날씨 API 제공
- [Kakao Developers](https://developers.kakao.com/) - 지도 API 제공
- [React](https://reactjs.org/) - 프론트엔드 프레임워크
- [Vite](https://vitejs.dev/) - 빌드 도구

---

⭐ 이 프로젝트가 도움이 되었다면 별표를 눌러주세요!
