# 더미 데이터 설정 가이드

## 개요
API 호출이 많아서 배포 전 개발 과정에서 더미 데이터를 사용할 수 있도록 설정했습니다.

## 설정 방법

### 1. 더미 데이터 사용/해제
각 서비스 파일에서 `USE_DUMMY_DATA` 변수를 변경하세요:

#### 날씨 서비스 (`src/services/weatherService.js`)
```javascript
// 더미 데이터 사용 여부 (true: 더미 데이터 사용, false: 실제 API 사용)
const USE_DUMMY_DATA = true; // 배포 시 false로 변경하세요!
```

#### 이벤트 서비스 (`src/services/eventService.js`)
```javascript
// 더미 데이터 사용 여부 (true: 더미 데이터 사용, false: 실제 API 사용)
const USE_DUMMY_DATA = true; // 배포 시 false로 변경하세요!
```

### 2. 설정 변경
- **더미 데이터 사용**: `USE_DUMMY_DATA = true`
- **실제 API 사용**: `USE_DUMMY_DATA = false`

### 3. 개발 서버 재시작
변경 후에는 개발 서버를 재시작하세요:

```bash
npm run dev
```

## 더미 데이터 내용

### 날씨 데이터
다음 도시들의 더미 날씨 데이터가 포함되어 있습니다:
- 서울 (맑음)
- 부산 (구름 조금)
- 대구 (구름 많음)
- 인천 (구름 많음)
- 광주 (천둥번개)
- 대전 (이슬비)
- 울산 (비)
- 제주 (눈)

### 이벤트 데이터
각 지역별로 5개의 더미 행사 데이터가 생성됩니다:
- 문화축제
- 전통시장 축제
- 봄꽃 축제
- 음식 축제
- 예술 축제

## 특징

### 1. 실제 API와 동일한 구조
더미 데이터는 실제 OpenWeatherMap API와 공공데이터포털 API의 응답 구조와 동일하게 설계되었습니다.

### 2. 지연 시간 시뮬레이션
실제 API 호출처럼 보이도록 100-500ms의 랜덤 지연 시간이 추가됩니다.

### 3. 콘솔 로그
더미 데이터 사용 시 콘솔에 `[더미 데이터]` 태그와 함께 요청 정보가 출력됩니다.

## 사용 예시

### 더미 데이터 사용 중
```javascript
// 콘솔 출력 예시
[더미 데이터] Seoul 날씨 정보 요청
[더미 데이터] 서울 지역 행사 정보 요청
```

### 실제 API 사용 중
```javascript
// 실제 API 호출 (더미 데이터 비활성화 시)
// https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=...
```

## 배포 전 체크리스트

### 1. 더미 데이터 비활성화
배포 전에 다음 파일들의 `USE_DUMMY_DATA`를 `false`로 변경하세요:

- `src/services/weatherService.js` (라인 7)
- `src/services/eventService.js` (라인 7)

### 2. 변경 사항 확인
```javascript
// 변경 전 (개발용)
const USE_DUMMY_DATA = true; // 배포 시 false로 변경하세요!

// 변경 후 (배포용)
const USE_DUMMY_DATA = false; // 배포 시 false로 변경하세요!
```

### 3. 테스트
- 브라우저 콘솔에서 `[더미 데이터]` 로그가 사라지는지 확인
- 실제 API 호출이 정상적으로 작동하는지 확인

## 주의사항

1. **배포 전 확인**: 배포 전에는 반드시 `USE_DUMMY_DATA = false`로 설정하세요.
2. **API 키 보안**: 실제 API 키는 안전하게 관리하세요.
3. **데이터 정확성**: 더미 데이터는 개발 목적으로만 사용하고, 실제 서비스에서는 정확한 API 데이터를 사용하세요.

## 문제 해결

### 더미 데이터가 작동하지 않는 경우
1. `USE_DUMMY_DATA` 변수가 `true`로 설정되어 있는지 확인
2. 개발 서버를 재시작했는지 확인
3. 브라우저 콘솔에서 오류 메시지 확인

### 실제 API로 전환하는 방법
1. `USE_DUMMY_DATA`를 `false`로 변경
2. 개발 서버 재시작
3. 브라우저 콘솔에서 `[더미 데이터]` 로그가 사라지는지 확인

## 빠른 전환 팁

### 개발 모드로 전환
```bash
# weatherService.js와 eventService.js에서
const USE_DUMMY_DATA = true;
```

### 배포 모드로 전환
```bash
# weatherService.js와 eventService.js에서
const USE_DUMMY_DATA = false;
```
