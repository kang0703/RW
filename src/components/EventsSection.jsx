import { useState, useEffect } from 'react';
import { getNearbyEvents, getEventsByLocation } from '../services/eventsService';
import './EventsSection.scss';

const EventsSection = ({ userLocation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // 행사 데이터 가져오기
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let eventsData;
      
      if (userLocation && userLocation.lat && userLocation.lon) {
        // 사용자 위치 기반으로 주변 행사 정보 가져오기
        eventsData = await getNearbyEvents(userLocation.lat, userLocation.lon);
      } else if (userLocation && userLocation.city) {
        // 도시명 기반으로 행사 정보 가져오기
        eventsData = await getEventsByLocation(userLocation.city);
      } else {
        // 기본 행사 정보 가져오기
        eventsData = await getNearbyEvents(37.5665, 126.9780); // 서울 기본 좌표
      }
      
      setEvents(eventsData.events || []);
      setLastUpdated(eventsData.lastUpdated);
    } catch (err) {
      console.error('행사 정보를 가져오는 중 오류 발생:', err);
      setError('행사 정보를 불러오는데 실패했습니다.');
      // 에러 발생시 기본 데이터 사용
      setEvents([
        {
          id: 1,
          title: '벚꽃 축제',
          date: '2024.04.01 - 04.15',
          location: '📍 여의도 한강공원',
          description: '봄의 시작을 알리는 아름다운 벚꽃 축제입니다.',
          weather: '맑음',
          weatherType: 'sunny',
          tempRange: '15° - 22°',
          icon: '🌸',
          category: '자연',
          price: '무료',
          organizer: '서울시'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트시와 사용자 위치 변경시 데이터 가져오기
  useEffect(() => {
    fetchEvents();
  }, [userLocation]);

  // 새로고침 버튼 클릭 핸들러
  const handleRefresh = () => {
    fetchEvents();
  };

  // 날씨 타입에 따른 CSS 클래스 반환
  const getWeatherClass = (weatherType) => {
    const weatherClasses = {
      sunny: 'sunny',
      cloudy: 'cloudy',
      rainy: 'rainy',
      snowy: 'snowy',
      clear: 'clear'
    };
    return weatherClasses[weatherType] || 'sunny';
  };

  if (loading) {
    return (
      <section id="events" className="events-section">
        <div className="section-header">
          <h2>🎉 주변 행사 정보</h2>
          <p>날씨와 함께 즐길 수 있는 다양한 행사를 찾아보세요</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>행사 정보를 불러오는 중...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="events-section">
      <div className="section-header">
        <h2>🎉 주변 행사 정보</h2>
        <p>날씨와 함께 즐길 수 있는 다양한 행사를 찾아보세요</p>
        <div className="header-actions">
          <button 
            className="refresh-btn" 
            onClick={handleRefresh}
            title="새로고침"
          >
            🔄
          </button>
          {lastUpdated && (
            <span className="last-updated">
              마지막 업데이트: {new Date(lastUpdated).toLocaleString('ko-KR')}
            </span>
          )}
        </div>
      </div>
      
      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
          <button onClick={handleRefresh}>다시 시도</button>
        </div>
      )}
      
      <div className="events-grid">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-image">
                {event.image ? (
                  <img src={event.image} alt={event.title} className="event-image-real" />
                ) : (
                  <div className="image-placeholder">{event.icon}</div>
                )}
                {event.category && (
                  <span className="category-badge">{event.category}</span>
                )}
              </div>
              <div className="event-content">
                <h3>{event.title}</h3>
                <p className="event-date">{event.date}</p>
                <p className="event-location">{event.location}</p>
                <p className="event-desc">{event.description}</p>
                <div className="event-details">
                  <div className="event-weather">
                    <span className={`weather-tag ${getWeatherClass(event.weatherType)}`}>
                      {event.weather}
                    </span>
                    <span className="temp-range">{event.tempRange}</span>
                  </div>
                  <div className="event-info">
                    {event.price && (
                      <span className="price-tag">
                        {event.price === '무료' ? '🆓 무료' : `💰 ${event.price}`}
                      </span>
                    )}
                    {event.organizer && (
                      <span className="organizer-tag">
                        📋 {event.organizer}
                      </span>
                    )}
                  </div>
                </div>
                {/* 추가 정보 표시 */}
                {(event.tel || event.homepage) && (
                  <div className="event-additional-info">
                    {event.tel && (
                      <a href={`tel:${event.tel}`} className="event-tel">
                        📞 {event.tel}
                      </a>
                    )}
                    {event.homepage && (
                      <a 
                        href={event.homepage} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="event-homepage"
                      >
                        🌐 홈페이지
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-events">
            <p>😔 현재 주변에 진행 중인 행사가 없습니다.</p>
            <p>잠시 후 다시 확인해보세요.</p>
          </div>
        )}
      </div>
      
      {events.length > 0 && (
        <div className="events-footer">
          <p>총 {events.length}개의 행사를 찾았습니다.</p>
          {lastUpdated && (
            <p className="data-source">
              데이터 출처: {events[0]?.source || '가상 데이터'}
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default EventsSection;
