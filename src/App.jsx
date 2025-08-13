import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import LocationWeather from './pages/LocationWeather/LocationWeather';
import WeatherGuide from './pages/WeatherGuide/WeatherGuide';
import TravelGuide from './pages/TravelGuide/TravelGuide';
import About from './pages/About/About';
import './App.scss';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/location/:city" element={<LocationWeather />} />
            <Route path="/weather-guide" element={<WeatherGuide />} />
            <Route path="/travel-guide" element={<TravelGuide />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
