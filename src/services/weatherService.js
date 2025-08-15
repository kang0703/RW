import axios from 'axios';
import { API_KEYS, API_ENDPOINTS } from '../config/api.js';

// 현재 날씨 정보 가져오기
export const getCurrentWeather = async (lat, lon) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.OPENWEATHER_BASE}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEYS.OPENWEATHER,
        units: 'metric', // 섭씨 온도
        lang: 'kr' // 한국어
      }
    });
    
    console.log('Current Weather API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

// 5일 날씨 예보 가져오기
export const getWeatherForecast = async (lat, lon) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.OPENWEATHER_BASE}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEYS.OPENWEATHER,
        units: 'metric',
        lang: 'kr'
      }
    });
    
    console.log('Weather Forecast API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
};

// 도시명으로 날씨 검색
export const getWeatherByCity = async (cityName) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.OPENWEATHER_BASE}/weather`, {
      params: {
        q: cityName,
        appid: API_KEYS.OPENWEATHER,
        units: 'metric',
        lang: 'kr'
      }
    });
    
    console.log('City Weather API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching city weather:', error);
    throw error;
  }
};
