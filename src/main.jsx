import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "@dr.pogodin/react-helmet";

import App from './App.jsx';
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


// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

ReactDOM.createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
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
      </Routes>
    </BrowserRouter>
  </HelmetProvider>
);