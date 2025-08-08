import { Helmet } from "@dr.pogodin/react-helmet";

function Privacy() {
  return (
    <>
      <Helmet>
        <title>개인정보처리방침 - 🌤️ 갈래말래 날씨여행</title>
        <meta name="description" content="갈래말래 날씨여행의 개인정보처리방침입니다." />
      </Helmet>
      
      <div className="page-container">
        <div className="page-content">
          <h1 className="page-title">개인정보처리방침</h1>
          <p className="page-date">시행일: 2025년 8월 8일</p>
          
          <section className="privacy-section">
            <h2>1. 개인정보의 처리 목적</h2>
            <p>
              갈래말래 날씨여행은 다음의 목적을 위하여 개인정보를 처리하고 있으며, 
              다음의 목적 이외의 용도로는 이용하지 않습니다.
            </p>
            <ul>
              <li>날씨 정보 서비스 제공</li>
              <li>지역별 행사 정보 제공</li>
              <li>서비스 이용 통계 및 분석</li>
              <li>서비스 개선 및 신규 서비스 개발</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>2. 개인정보의 처리 및 보유기간</h2>
            <p>
              갈래말래 날씨여행은 법령에 따른 개인정보 보유·이용기간 또는 
              정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 
              개인정보를 처리·보유합니다.
            </p>
            <p>
              현재 본 서비스는 사용자의 개인정보를 수집하지 않으며, 
              위치 기반 날씨 정보 제공을 위해 브라우저의 위치 정보만 임시로 사용합니다.
            </p>
          </section>

          <section className="privacy-section">
            <h2>3. 개인정보의 제3자 제공</h2>
            <p>
              갈래말래 날씨여행은 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 
              명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 
              개인정보보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
            </p>
          </section>

          <section className="privacy-section">
            <h2>4. 개인정보처리의 위탁</h2>
            <p>
              갈래말래 날씨여행은 원활한 개인정보 업무처리를 위하여 다음과 같이 
              개인정보 처리업무를 위탁하고 있습니다.
            </p>
            <ul>
              <li>
                <strong>OpenWeatherMap API</strong>
                <p>날씨 정보 제공 서비스</p>
              </li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>5. 정보주체의 권리·의무 및 그 행사방법</h2>
            <p>이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.</p>
            <ul>
              <li>개인정보 열람요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제요구</li>
              <li>처리정지 요구</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>6. 처리하는 개인정보의 항목</h2>
            <p>
              갈래말래 날씨여행은 서비스 제공을 위해 다음과 같은 정보를 처리합니다.
            </p>
            <ul>
              <li>위치 정보 (브라우저 위치 권한을 통한 임시 사용)</li>
              <li>서비스 이용 로그 (익명화된 통계 목적)</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>7. 개인정보의 파기</h2>
            <p>
              갈래말래 날씨여행은 개인정보 보유기간의 경과, 처리목적 달성 등 
              개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
            </p>
          </section>

          <section className="privacy-section">
            <h2>8. 개인정보의 안전성 확보 조치</h2>
            <p>
              갈래말래 날씨여행은 개인정보보호법 제29조에 따라 다음과 같은 
              안전성 확보 조치를 취하고 있습니다.
            </p>
            <ul>
              <li>개인정보의 암호화</li>
              <li>해킹 등에 대비한 기술적 대책</li>
              <li>개인정보에 대한 접근 제한</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>9. 개인정보 보호책임자</h2>
            <p>
              갈래말래 날씨여행은 개인정보 처리에 관한 업무를 총괄해서 책임지고, 
              개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 
              아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="contact-info">
              <p><strong>개인정보 보호책임자</strong></p>
              <p>연락처: kcmschool@naver.com</p>
            </div>
          </section>

          <section className="privacy-section">
            <h2>10. 개인정보처리방침의 변경</h2>
            <p>
              이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 
              변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 
              공지사항을 통하여 고지할 것입니다.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}

export default Privacy;
