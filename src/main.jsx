import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "@dr.pogodin/react-helmet";
import Layout from "./components/Layout.jsx";

import App from './App.jsx';
import AllEvents from "./components/AllEvents.jsx";
import SeoulWeather from "./regions/SeoulWeather.jsx";
import GyeonggiWeather from "./regions/GyeonggiWeather.jsx";
import GangwonWeather from "./regions/GangwonWeather.jsx";
import ChungbukWeather from "./regions/ChungbukWeather.jsx";
import ChungnamWeather from "./regions/ChungnamWeather.jsx";
import JeonbukWeather from "./regions/JeonbukWeather.jsx";
import JeonnamWeather from "./regions/JeonnamWeather.jsx";
import GyeongbukWeather from "./regions/GyeongbukWeather.jsx";
import GyeongnamWeather from "./regions/GyeongnamWeather.jsx";
import JejuWeather from "./regions/JejuWeather.jsx";

// 페이지 컴포넌트들
import About from "./pages/About.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";


// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

ReactDOM.createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/events" element={<AllEvents />} />
          <Route path="/seoul" element={<SeoulWeather />} />
          <Route path="/gyeonggi" element={<GyeonggiWeather />} />
          <Route path="/gangwon" element={<GangwonWeather />} />
          <Route path="/chungbuk" element={<ChungbukWeather />} />
          <Route path="/chungnam" element={<ChungnamWeather />} />
          <Route path="/jeonbuk" element={<JeonbukWeather />} />
          <Route path="/jeonnam" element={<JeonnamWeather />} />
          <Route path="/gyeongbuk" element={<GyeongbukWeather />} />
          <Route path="/gyeongnam" element={<GyeongnamWeather />} />
          <Route path="/jeju" element={<JejuWeather />} />
          
          {/* 페이지 라우트 */}
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </HelmetProvider>
);