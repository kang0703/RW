# 🚀 정적 사이트 배포 가이드

## 📋 현재 SEO 설정 상태

### ✅ 완료된 설정
- **React Helmet (@dr.pogodin/react-helmet)**: 각 페이지별 동적 메타 태그 (React 19+ 지원)
- **robots.txt**: 검색 엔진 크롤러 규칙
- **sitemap.xml**: 사이트 구조 정보
- **SPA 라우팅 처리**: 404.html을 통한 리다이렉트

### 🔧 추가 설정
- **Vite 빌드 최적화**: 청크 분할 및 성능 최적화
- **정적 호스팅 준비**: Cloudflare Pages 배포 준비

## 🛠️ 배포 전 체크리스트

### 1. 빌드 테스트
```bash
npm run build
```

### 2. 로컬 빌드 테스트
```bash
npm run preview
```

### 3. SEO 파일 확인
- [x] `public/robots.txt` - 도메인 확인
- [x] `public/sitemap.xml` - 모든 URL 확인
- [x] `public/404.html` - SPA 라우팅 처리
- [x] `index.html` - 메타 태그 확인

## 🌐 Cloudflare Pages 배포

### 1. 빌드 설정 (Build system version 3)
- **Framework preset**: Vite
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (기본값)
- **Node.js version**: 18+ (자동 감지)
- **npm version**: 9+ (자동 감지)

### 2. 빌드 환경 설정
- ✅ `.npmrc` 파일이 프로젝트 루트에 포함되어 있는지 확인
- ✅ `package.json`의 engines 필드로 Node.js/npm 버전 명시
- ✅ `package.json`의 build 스크립트가 최적화되어 있는지 확인

### 3. 환경 변수 (필요시)
```
VITE_API_KEY=your_openweather_api_key
```

### 4. 배포 후 확인사항
- [ ] 메인 페이지 접근 가능
- [ ] 각 지역별 페이지 접근 가능
- [ ] 직접 URL 접근 시 정상 작동
- [ ] 브라우저 탭 제목 변경 확인
- [ ] 소셜 미디어 공유 테스트

## 🔍 SEO 검증

### 1. Google Search Console
1. 사이트 등록: `https://rw-7hc.pages.dev`
2. Sitemap 제출: `https://rw-7hc.pages.dev/sitemap.xml`
3. URL 검사 도구로 각 페이지 테스트

### 2. 메타 태그 검증
```bash
# 각 페이지별 메타 태그 확인
curl -I https://rw-7hc.pages.dev/
curl -I https://rw-7hc.pages.dev/seoul
curl -I https://rw-7hc.pages.dev/gyeonggi
# ... 기타 페이지들
```

### 3. 소셜 미디어 테스트
- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **LinkedIn**: https://www.linkedin.com/post-inspector/

## 📊 성능 최적화

### 1. 빌드 최적화
- ✅ 청크 분할 (vendor, router, weather)
- ✅ 자산 압축
- ✅ Tree shaking

### 2. 추가 최적화 가능사항
- [ ] 이미지 최적화 (WebP, lazy loading)
- [ ] Service Worker 추가 (PWA)
- [ ] 캐싱 전략 설정
- [ ] CDN 설정

## 🐛 문제 해결

### 1. 빌드 오류 (npm ERESOLVE)
**문제**: `react-helmet-async`와 React 19 간의 의존성 충돌
**해결책**:
- ✅ `@dr.pogodin/react-helmet`으로 교체 (React 19+ 지원)
- ✅ `.npmrc` 파일에 `legacy-peer-deps=true` 설정 추가
- ✅ `package.json`의 engines 필드로 Node.js/npm 버전 명시
- ✅ Cloudflare Pages Build system version 3에서 자동으로 의존성 해결
- ✅ 빌드 명령어: `npm run build`

### 2. 404 에러
- `public/404.html` 파일이 제대로 배포되었는지 확인
- Cloudflare Pages에서 404 페이지 설정 확인

### 3. 메타 태그가 변경되지 않는 경우
- 브라우저 캐시 삭제
- 개발자 도구에서 네트워크 탭 확인
- React Helmet이 제대로 작동하는지 확인

### 4. Sitemap 접근 불가
- `public/sitemap.xml` 파일이 빌드에 포함되었는지 확인
- Cloudflare Pages에서 정적 파일 서빙 설정 확인

## 📈 모니터링

### 1. Google Analytics 설정
```html
<!-- index.html에 추가 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Core Web Vitals 모니터링
- Google PageSpeed Insights
- Google Search Console
- Chrome DevTools Lighthouse

---

**배포 완료 후**: 모든 페이지가 정상적으로 작동하고 SEO가 최적화되어 검색 엔진에서 잘 노출될 것입니다! 🎯 