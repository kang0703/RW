import { useState, useEffect } from 'react';
import { API_KEYS, API_ENDPOINTS, API_SETTINGS } from '../../config/api';
import './Location.scss';

const Location = ({ onLocationSelect }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [error, setError] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // 지역별 도시 그룹 구성 (시 단위까지 세분화)
  const cityGroups = {
    '서울특별시': [
      { name: '강남구', lat: 37.5172, lon: 127.0473, region: '서울특별시' },
      { name: '강동구', lat: 37.5301, lon: 127.1238, region: '서울특별시' },
      { name: '강북구', lat: 37.5894, lon: 127.0167, region: '서울특별시' },
      { name: '강서구', lat: 37.5509, lon: 126.8495, region: '서울특별시' },
      { name: '관악구', lat: 37.4784, lon: 126.9516, region: '서울특별시' },
      { name: '광진구', lat: 37.5384, lon: 127.0822, region: '서울특별시' },
      { name: '구로구', lat: 37.4954, lon: 126.8874, region: '서울특별시' },
      { name: '금천구', lat: 37.4601, lon: 126.9009, region: '서울특별시' },
      { name: '노원구', lat: 37.6542, lon: 127.0568, region: '서울특별시' },
      { name: '도봉구', lat: 37.6688, lon: 127.0471, region: '서울특별시' },
      { name: '동대문구', lat: 37.5744, lon: 127.0395, region: '서울특별시' },
      { name: '동작구', lat: 37.5124, lon: 126.9393, region: '서울특별시' },
      { name: '마포구', lat: 37.5636, lon: 126.9084, region: '서울특별시' },
      { name: '서대문구', lat: 37.5791, lon: 126.9368, region: '서울특별시' },
      { name: '서초구', lat: 37.4837, lon: 127.0324, region: '서울특별시' },
      { name: '성동구', lat: 37.5506, lon: 127.0409, region: '서울특별시' },
      { name: '성북구', lat: 37.5894, lon: 127.0167, region: '서울특별시' },
      { name: '송파구', lat: 37.5145, lon: 127.1059, region: '서울특별시' },
      { name: '양천구', lat: 37.5270, lon: 126.8562, region: '서울특별시' },
      { name: '영등포구', lat: 37.5264, lon: 126.8890, region: '서울특별시' },
      { name: '용산구', lat: 37.5384, lon: 126.9654, region: '서울특별시' },
      { name: '은평구', lat: 37.6027, lon: 126.9291, region: '서울특별시' },
      { name: '종로구', lat: 37.5735, lon: 126.9789, region: '서울특별시' },
      { name: '중구', lat: 37.5640, lon: 126.9979, region: '서울특별시' },
      { name: '중랑구', lat: 37.6060, lon: 127.0926, region: '서울특별시' }
    ],
    '부산광역시': [
      { name: '강서구', lat: 35.2124, lon: 128.9800, region: '부산광역시' },
      { name: '금정구', lat: 35.2434, lon: 129.0920, region: '부산광역시' },
      { name: '남구', lat: 35.1366, lon: 129.0840, region: '부산광역시' },
      { name: '동구', lat: 35.1294, lon: 129.0450, region: '부산광역시' },
      { name: '동래구', lat: 35.2054, lon: 129.0780, region: '부산광역시' },
      { name: '부산진구', lat: 35.1796, lon: 129.0756, region: '부산광역시' },
      { name: '북구', lat: 35.1974, lon: 129.0150, region: '부산광역시' },
      { name: '사상구', lat: 35.1524, lon: 128.9910, region: '부산광역시' },
      { name: '사하구', lat: 35.1044, lon: 128.9740, region: '부산광역시' },
      { name: '서구', lat: 35.0974, lon: 129.0240, region: '부산광역시' },
      { name: '수영구', lat: 35.1454, lon: 129.1120, region: '부산광역시' },
      { name: '연제구', lat: 35.1764, lon: 129.1120, region: '부산광역시' },
      { name: '영도구', lat: 35.0914, lon: 129.0670, region: '부산광역시' },
      { name: '중구', lat: 35.1796, lon: 129.0756, region: '부산광역시' },
      { name: '해운대구', lat: 35.1634, lon: 129.1630, region: '부산광역시' },
      { name: '기장군', lat: 35.2444, lon: 129.2220, region: '부산광역시' }
    ],
    '대구광역시': [
      { name: '남구', lat: 35.8464, lon: 128.5970, region: '대구광역시' },
      { name: '달서구', lat: 35.8294, lon: 128.5280, region: '대구광역시' },
      { name: '달성군', lat: 35.7744, lon: 128.4310, region: '대구광역시' },
      { name: '동구', lat: 35.8864, lon: 128.6240, region: '대구광역시' },
      { name: '북구', lat: 35.8854, lon: 128.5820, region: '대구광역시' },
      { name: '서구', lat: 35.8714, lon: 128.6014, region: '대구광역시' },
      { name: '수성구', lat: 35.8584, lon: 128.6300, region: '대구광역시' },
      { name: '중구', lat: 35.8714, lon: 128.6014, region: '대구광역시' }
    ],
    '인천광역시': [
      { name: '계양구', lat: 37.5374, lon: 126.7370, region: '인천광역시' },
      { name: '남구', lat: 37.4634, lon: 126.6500, region: '인천광역시' },
      { name: '남동구', lat: 37.4474, lon: 126.7310, region: '인천광역시' },
      { name: '동구', lat: 37.4734, lon: 126.6320, region: '인천광역시' },
      { name: '부평구', lat: 37.5074, lon: 126.7210, region: '인천광역시' },
      { name: '서구', lat: 37.4563, lon: 126.7052, region: '인천광역시' },
      { name: '연수구', lat: 37.4104, lon: 126.6490, region: '인천광역시' },
      { name: '중구', lat: 37.4734, lon: 126.6320, region: '인천광역시' },
      { name: '강화군', lat: 37.7464, lon: 126.4860, region: '인천광역시' },
      { name: '옹진군', lat: 37.4464, lon: 126.4320, region: '인천광역시' }
    ],
    '광주광역시': [
      { name: '광산구', lat: 35.1394, lon: 126.7930, region: '광주광역시' },
      { name: '남구', lat: 35.1595, lon: 126.8526, region: '광주광역시' },
      { name: '동구', lat: 35.1544, lon: 126.9230, region: '광주광역시' },
      { name: '북구', lat: 35.1744, lon: 126.9120, region: '광주광역시' },
      { name: '서구', lat: 35.1595, lon: 126.8526, region: '광주광역시' }
    ],
    '대전광역시': [
      { name: '대덕구', lat: 36.3474, lon: 127.4330, region: '대전광역시' },
      { name: '동구', lat: 36.3504, lon: 127.3845, region: '대전광역시' },
      { name: '서구', lat: 36.3504, lon: 127.3845, region: '대전광역시' },
      { name: '유성구', lat: 36.3624, lon: 127.3560, region: '대전광역시' },
      { name: '중구', lat: 36.3504, lon: 127.3845, region: '대전광역시' }
    ],
    '울산광역시': [
      { name: '남구', lat: 35.5384, lon: 129.3114, region: '울산광역시' },
      { name: '동구', lat: 35.5044, lon: 129.4160, region: '울산광역시' },
      { name: '북구', lat: 35.5824, lon: 129.3610, region: '울산광역시' },
      { name: '울주군', lat: 35.5274, lon: 129.1210, region: '울산광역시' },
      { name: '중구', lat: 35.5384, lon: 129.3114, region: '울산광역시' }
    ],
    '세종특별자치시': [
      { name: '세종시', lat: 36.4800, lon: 127.2890, region: '세종특별자치시' }
    ],
    '경기도': [
      { name: '수원시', lat: 37.2636, lon: 127.0286, region: '경기도' },
      { name: '고양시', lat: 37.6584, lon: 126.8320, region: '경기도' },
      { name: '용인시', lat: 37.2411, lon: 127.1776, region: '경기도' },
      { name: '성남시', lat: 37.4449, lon: 127.1389, region: '경기도' },
      { name: '부천시', lat: 37.5035, lon: 126.7060, region: '경기도' },
      { name: '안산시', lat: 37.3219, lon: 126.8309, region: '경기도' },
      { name: '남양주시', lat: 37.6364, lon: 127.2160, region: '경기도' },
      { name: '화성시', lat: 37.1996, lon: 126.8319, region: '경기도' },
      { name: '평택시', lat: 36.9920, lon: 127.1128, region: '경기도' },
      { name: '의정부시', lat: 37.7381, lon: 127.0338, region: '경기도' },
      { name: '파주시', lat: 37.8154, lon: 126.7928, region: '경기도' },
      { name: '광명시', lat: 37.4792, lon: 126.8649, region: '경기도' },
      { name: '이천시', lat: 37.2720, lon: 127.4350, region: '경기도' },
      { name: '김포시', lat: 37.6154, lon: 126.7156, region: '경기도' },
      { name: '군포시', lat: 37.3616, lon: 126.9350, region: '경기도' },
      { name: '하남시', lat: 37.5392, lon: 127.2149, region: '경기도' },
      { name: '오산시', lat: 37.1498, lon: 127.0772, region: '경기도' },
      { name: '안양시', lat: 37.4563, lon: 126.7052, region: '경기도' },
      { name: '과천시', lat: 37.4291, lon: 126.9879, region: '경기도' },
      { name: '의왕시', lat: 37.3446, lon: 126.9483, region: '경기도' },
      { name: '구리시', lat: 37.5944, lon: 127.1296, region: '경기도' },
      { name: '동두천시', lat: 37.9036, lon: 127.0606, region: '경기도' },
      { name: '양주시', lat: 37.8324, lon: 127.0462, region: '경기도' },
      { name: '포천시', lat: 37.8945, lon: 127.2002, region: '경기도' },
      { name: '여주시', lat: 37.2984, lon: 127.6370, region: '경기도' },
      { name: '연천군', lat: 38.0966, lon: 127.0747, region: '경기도' },
      { name: '가평군', lat: 37.8315, lon: 127.5105, region: '경기도' },
      { name: '양평군', lat: 37.4914, lon: 127.4874, region: '경기도' }
    ],
    '강원도': [
      { name: '춘천시', lat: 37.8813, lon: 127.7300, region: '강원도' },
      { name: '원주시', lat: 37.3422, lon: 127.9202, region: '강원도' },
      { name: '강릉시', lat: 37.7519, lon: 128.8759, region: '강원도' },
      { name: '동해시', lat: 37.5236, lon: 129.1144, region: '강원도' },
      { name: '태백시', lat: 37.1641, lon: 128.9856, region: '강원도' },
      { name: '속초시', lat: 38.1667, lon: 128.4667, region: '강원도' },
      { name: '삼척시', lat: 37.4499, lon: 129.1650, region: '강원도' },
      { name: '홍천군', lat: 37.6969, lon: 127.8857, region: '강원도' },
      { name: '횡성군', lat: 37.4917, lon: 127.9850, region: '강원도' },
      { name: '영월군', lat: 37.1836, lon: 128.4617, region: '강원도' },
      { name: '평창군', lat: 37.3700, lon: 128.3900, region: '강원도' },
      { name: '정선군', lat: 37.3807, lon: 128.6600, region: '강원도' },
      { name: '철원군', lat: 38.1466, lon: 127.3130, region: '강원도' },
      { name: '화천군', lat: 38.1064, lon: 127.7080, region: '강원도' },
      { name: '양구군', lat: 38.1054, lon: 127.9890, region: '강원도' },
      { name: '인제군', lat: 38.0694, lon: 128.1700, region: '강원도' },
      { name: '고성군', lat: 38.3784, lon: 128.4670, region: '강원도' },
      { name: '양양군', lat: 38.0754, lon: 128.6190, region: '강원도' }
    ],
    '충청북도': [
      { name: '청주시', lat: 36.6424, lon: 127.4890, region: '충청북도' },
      { name: '충주시', lat: 36.9910, lon: 127.9260, region: '충청북도' },
      { name: '제천시', lat: 37.1326, lon: 128.1910, region: '충청북도' },
      { name: '음성군', lat: 36.9324, lon: 127.6890, region: '충청북도' },
      { name: '진천군', lat: 36.8554, lon: 127.4350, region: '충청북도' },
      { name: '괴산군', lat: 36.8154, lon: 127.7860, region: '충청북도' },
      { name: '증평군', lat: 36.7844, lon: 127.5810, region: '충청북도' },
      { name: '단양군', lat: 36.9844, lon: 128.3650, region: '충청북도' },
      { name: '보은군', lat: 36.4894, lon: 127.7290, region: '충청북도' },
      { name: '옥천군', lat: 36.3064, lon: 127.5710, region: '충청북도' },
      { name: '영동군', lat: 36.1754, lon: 127.7760, region: '충청북도' },
      { name: '금산군', lat: 36.1084, lon: 127.4890, region: '충청북도' }
    ],
    '충청남도': [
      { name: '천안시', lat: 36.8150, lon: 127.1139, region: '충청남도' },
      { name: '공주시', lat: 36.4614, lon: 127.1190, region: '충청남도' },
      { name: '보령시', lat: 36.3334, lon: 126.6120, region: '충청남도' },
      { name: '아산시', lat: 36.7904, lon: 127.0030, region: '충청남도' },
      { name: '서산시', lat: 36.7844, lon: 126.4500, region: '충청남도' },
      { name: '논산시', lat: 36.1874, lon: 127.0990, region: '충청남도' },
      { name: '계룡시', lat: 36.2744, lon: 127.2490, region: '충청남도' },
      { name: '금산군', lat: 36.1084, lon: 127.4890, region: '충청남도' },
      { name: '부여군', lat: 36.2754, lon: 126.9090, region: '충청남도' },
      { name: '서천군', lat: 36.0784, lon: 126.6910, region: '충청남도' },
      { name: '청양군', lat: 36.4504, lon: 126.8020, region: '충청남도' },
      { name: '홍성군', lat: 36.6014, lon: 126.6610, region: '충청남도' },
      { name: '예산군', lat: 36.6794, lon: 126.8450, region: '충청남도' },
      { name: '태안군', lat: 36.7454, lon: 126.2990, region: '충청남도' },
      { name: '당진시', lat: 36.8934, lon: 126.6280, region: '충청남도' }
    ],
    '전라북도': [
      { name: '전주시', lat: 35.8242, lon: 127.1479, region: '전라북도' },
      { name: '군산시', lat: 35.9674, lon: 126.7368, region: '전라북도' },
      { name: '익산시', lat: 35.9483, lon: 126.9579, region: '전라북도' },
      { name: '정읍시', lat: 35.5664, lon: 126.8560, region: '전라북도' },
      { name: '남원시', lat: 35.4164, lon: 127.3900, region: '전라북도' },
      { name: '김제시', lat: 35.8034, lon: 126.8810, region: '전라북도' },
      { name: '완주군', lat: 35.9044, lon: 127.1620, region: '전라북도' },
      { name: '진안군', lat: 35.7914, lon: 127.4250, region: '전라북도' },
      { name: '무주군', lat: 36.0074, lon: 127.6600, region: '전라북도' },
      { name: '장수군', lat: 35.6474, lon: 127.5180, region: '전라북도' },
      { name: '임실군', lat: 35.6144, lon: 127.2790, region: '전라북도' },
      { name: '순창군', lat: 35.3744, lon: 127.1370, region: '전라북도' },
      { name: '고창군', lat: 35.4354, lon: 126.7020, region: '전라북도' },
      { name: '부안군', lat: 35.7314, lon: 126.7320, region: '전라북도' }
    ],
    '전라남도': [
      { name: '목포시', lat: 34.8161, lon: 126.4629, region: '전라남도' },
      { name: '여수시', lat: 34.7604, lon: 127.6622, region: '전라남도' },
      { name: '순천시', lat: 34.9506, lon: 127.4872, region: '전라남도' },
      { name: '나주시', lat: 35.0164, lon: 126.7100, region: '전라남도' },
      { name: '광양시', lat: 34.9404, lon: 127.6950, region: '전라남도' },
      { name: '담양군', lat: 35.3214, lon: 127.0030, region: '전라남도' },
      { name: '곡성군', lat: 35.2824, lon: 127.2950, region: '전라남도' },
      { name: '구례군', lat: 35.2024, lon: 127.4620, region: '전라남도' },
      { name: '고흥군', lat: 34.6114, lon: 127.2850, region: '전라남도' },
      { name: '보성군', lat: 34.7714, lon: 127.0810, region: '전라남도' },
      { name: '화순군', lat: 35.0644, lon: 127.0080, region: '전라남도' },
      { name: '장흥군', lat: 34.6814, lon: 126.9060, region: '전라남도' },
      { name: '강진군', lat: 34.6424, lon: 126.7660, region: '전라남도' },
      { name: '해남군', lat: 34.5714, lon: 126.5980, region: '전라남도' },
      { name: '영암군', lat: 34.8004, lon: 126.6980, region: '전라남도' },
      { name: '무안군', lat: 34.9904, lon: 126.4810, region: '전라남도' },
      { name: '함평군', lat: 35.0664, lon: 126.5200, region: '전라남도' },
      { name: '영광군', lat: 35.2774, lon: 126.5120, region: '전라남도' },
      { name: '장성군', lat: 35.3074, lon: 126.7850, region: '전라남도' },
      { name: '완도군', lat: 34.3114, lon: 126.7470, region: '전라남도' },
      { name: '진도군', lat: 34.4864, lon: 126.2640, region: '전라남도' },
      { name: '신안군', lat: 34.7904, lon: 126.4500, region: '전라남도' }
    ],
    '경상북도': [
      { name: '포항시', lat: 36.0320, lon: 129.3650, region: '경상북도' },
      { name: '경주시', lat: 35.8562, lon: 129.2247, region: '경상북도' },
      { name: '김천시', lat: 36.1394, lon: 128.1130, region: '경상북도' },
      { name: '안동시', lat: 36.5684, lon: 128.7294, region: '경상북도' },
      { name: '구미시', lat: 36.1195, lon: 128.3446, region: '경상북도' },
      { name: '영주시', lat: 36.8054, lon: 128.6240, region: '경상북도' },
      { name: '영천시', lat: 35.9734, lon: 128.9380, region: '경상북도' },
      { name: '상주시', lat: 36.4114, lon: 128.1590, region: '경상북도' },
      { name: '문경시', lat: 36.5944, lon: 128.1860, region: '경상북도' },
      { name: '경산시', lat: 35.8254, lon: 128.7380, region: '경상북도' },
      { name: '의성군', lat: 36.3524, lon: 128.6970, region: '경상북도' },
      { name: '청송군', lat: 36.4354, lon: 129.0570, region: '경상북도' },
      { name: '영양군', lat: 36.6664, lon: 129.1120, region: '경상북도' },
      { name: '영덕군', lat: 36.4154, lon: 129.3650, region: '경상북도' },
      { name: '청도군', lat: 35.6474, lon: 128.7340, region: '경상북도' },
      { name: '고령군', lat: 35.7264, lon: 128.2620, region: '경상북도' },
      { name: '성주군', lat: 35.9184, lon: 128.2880, region: '경상북도' },
      { name: '칠곡군', lat: 35.9954, lon: 128.4010, region: '경상북도' },
      { name: '예천군', lat: 36.6594, lon: 128.4560, region: '경상북도' },
      { name: '봉화군', lat: 36.8934, lon: 128.7320, region: '경상북도' },
      { name: '울진군', lat: 36.9934, lon: 129.4000, region: '경상북도' },
      { name: '울릉군', lat: 37.4844, lon: 130.9020, region: '경상북도' }
    ],
    '경상남도': [
      { name: '창원시', lat: 35.2278, lon: 128.6817, region: '경상남도' },
      { name: '진주시', lat: 35.1796, lon: 128.1074, region: '경상남도' },
      { name: '통영시', lat: 34.8542, lon: 128.4330, region: '경상남도' },
      { name: '사천시', lat: 35.0034, lon: 128.0640, region: '경상남도' },
      { name: '김해시', lat: 35.2284, lon: 128.8890, region: '경상남도' },
      { name: '밀양시', lat: 35.5044, lon: 128.7480, region: '경상남도' },
      { name: '거제시', lat: 34.8805, lon: 128.6211, region: '경상남도' },
      { name: '양산시', lat: 35.3384, lon: 129.0340, region: '경상남도' },
      { name: '의령군', lat: 35.3214, lon: 128.2610, region: '경상남도' },
      { name: '함안군', lat: 35.2724, lon: 128.4080, region: '경상남도' },
      { name: '창녕군', lat: 35.5444, lon: 128.5000, region: '경상남도' },
      { name: '고성군', lat: 34.9734, lon: 128.3220, region: '경상남도' },
      { name: '남해군', lat: 34.8374, lon: 127.8920, region: '경상남도' },
      { name: '하동군', lat: 35.0674, lon: 127.7510, region: '경상남도' },
      { name: '산청군', lat: 35.4144, lon: 127.8730, region: '경상남도' },
      { name: '함양군', lat: 35.5204, lon: 127.7250, region: '경상남도' },
      { name: '거창군', lat: 35.6864, lon: 127.9020, region: '경상남도' },
      { name: '합천군', lat: 35.5664, lon: 128.1650, region: '경상남도' }
    ],
    '제주특별자치도': [
      { name: '제주시', lat: 33.4996, lon: 126.5312, region: '제주특별자치도' },
      { name: '서귀포시', lat: 33.2546, lon: 126.5600, region: '제주특별자치도' }
    ]
  };

  // 좌표로 도시명을 가져오는 함수 (GPS 좌표 기반으로 가장 가까운 시/구 찾기)
  const getCityNameFromCoordinates = async (lat, lon) => {
    try {
      // GPS 좌표로 가장 가까운 시/구 찾기
      let closestCity = null;
      let minDistance = Infinity;
      
      // 모든 지역의 도시들을 순회하면서 가장 가까운 곳 찾기
      Object.values(cityGroups).forEach(cities => {
        cities.forEach(city => {
          const distance = Math.sqrt(
            Math.pow(lat - city.lat, 2) + Math.pow(lon - city.lon, 2)
          );
          if (distance < minDistance) {
            minDistance = distance;
            closestCity = city;
          }
        });
      });
      
      if (closestCity) {
        // 거리 계산 개선: 더 넓은 범위에서 도시 찾기 (약 50km까지)
        // 0.1도 ≈ 11km, 0.5도 ≈ 55km
        if (minDistance > 0.5) {
          // OpenWeatherMap API로 도시명 가져오기 (백업)
          if (API_KEYS.OPENWEATHER) {
            try {
              const url = `${API_ENDPOINTS.OPENWEATHER_BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEYS.OPENWEATHER}&units=metric&lang=kr`;
              const response = await fetch(url);
              if (response.ok) {
                const data = await response.json();
                const englishCityName = data.name || '현재 위치';
                
                // 영문 도시명을 한국어로 변환
                const koreanCityName = getKoreanCityName(englishCityName);
                
                // 변환된 도시명이 우리 데이터베이스에 있는지 확인
                const foundInDatabase = findCityInDatabase(koreanCityName);
                if (foundInDatabase) {
                  return foundInDatabase.name;
                }
                
                return koreanCityName;
              }
            } catch (apiError) {
              // API 호출 실패 시 무시
            }
          }
          return '현재 위치';
        }
        
        // 가장 가까운 도시 반환 (시/구 단위)
        return closestCity.name;
      }
      
      // OpenWeatherMap API로 도시명 가져오기 (백업)
      if (API_KEYS.OPENWEATHER) {
        const url = `${API_ENDPOINTS.OPENWEATHER_BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEYS.OPENWEATHER}&units=metric&lang=kr`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          const englishCityName = data.name || '현재 위치';
          
          // 영문 도시명을 한국어로 변환
          const koreanCityName = getKoreanCityName(englishCityName);
          
          // 변환된 도시명이 우리 데이터베이스에 있는지 확인
          const foundInDatabase = findCityInDatabase(koreanCityName);
          if (foundInDatabase) {
            return foundInDatabase.name;
          }
          
          return koreanCityName;
        }
      }
    } catch (error) {
      // 에러 발생 시 무시
    }
    return '현재 위치';
  };

  // 도시명이 데이터베이스에 있는지 확인하는 함수
  const findCityInDatabase = (cityName) => {
    for (const cities of Object.values(cityGroups)) {
      const foundCity = cities.find(city => city.name === cityName);
      if (foundCity) {
        return foundCity;
      }
    }
    return null;
  };

  // 영문 도시명을 한국어로 변환하는 함수 (개선된 버전)
  const getKoreanCityName = (englishName) => {
    if (englishName === '현재 위치') {
      return '현재 위치';
    }
    
    // 동 단위를 구 단위로 변환하는 매핑 (Weather.jsx와 일치)
    const cityNameMap = {
      // 주요 도시
      'Seoul': '서울',
      'Busan': '부산',
      'Daegu': '대구',
      'Incheon': '인천',
      'Gwangju': '광주',
      'Daejeon': '대전',
      'Ulsan': '울산',
      'Sejong': '세종',
      'Jeju': '제주',
      
      // 서울특별시 구별 → 구 단위로 유지
      'Gangnam-gu': '강남구',
      'Seocho-gu': '서초구',
      'Mapo-gu': '마포구',
      'Yongsan-gu': '용산구',
      'Jongno-gu': '종로구',
      'Jung-gu': '중구',
      'Seongbuk-gu': '성북구',
      'Dongdaemun-gu': '동대문구',
      'Gwangjin-gu': '광진구',
      'Seongdong-gu': '성동구',
      'Gangbuk-gu': '강북구',
      'Dobong-gu': '도봉구',
      'Nowon-gu': '노원구',
      'Eunpyeong-gu': '은평구',
      'Seodaemun-gu': '서대문구',
      'Gangseo-gu': '강서구',
      'Yangcheon-gu': '양천구',
      'Guro-gu': '구로구',
      'Geumcheon-gu': '금천구',
      'Yeongdeungpo-gu': '영등포구',
      'Dongjak-gu': '동작구',
      'Gwanak-gu': '관악구',
      'Songpa-gu': '송파구',
      'Gangdong-gu': '강동구',
      
      // 서울특별시 동별 → 구 단위로 변환 (Weather.jsx와 일치)
      "Sup'yŏng-dong": '서대문구',
      "Sŏngbuk-dong": '성북구',
      "Myŏngnyun-dong": '종로구',
      "Ch'ŏngun-dong": '종로구',
      "Sajik-dong": '종로구',
      "Hyoja-dong": '종로구',
      
      // 경기도 주요 도시 → 시 단위로 유지
      'Suwon': '수원시',
      'Goyang': '고양시',
      'Yongin': '용인시',
      'Seongnam': '성남시',
      'Bucheon': '부천시',
      'Ansan': '안산시',
      'Namyangju': '남양주시',
      'Hwaseong': '화성시',
      'Pyeongtaek': '평택시',
      'Uijeongbu': '의정부시',
      'Paju': '파주시',
      'Gwangmyeong': '광명시',
      'Icheon': '이천시',
      'Gimpo': '김포시',
      'Gunpo': '군포시',
      'Hanam': '하남시',
      'Osan': '오산시',
      'Anyang': '안양시',
      'Gwacheon': '과천시',
      'Uiwang': '의왕시',
      'Guri': '구리시',
      'Dongducheon': '동두천시',
      'Yangju': '양주시',
      'Pocheon': '포천시',
      'Yeoju': '여주시',
      'Yeoncheon': '연천군',
      'Gapyeong': '가평군',
      'Yangpyeong': '양평군',
      
      // 강원도 → 시/군 단위로 유지
      'Chuncheon': '춘천시',
      'Wonju': '원주시',
      'Gangneung': '강릉시',
      'Donghae': '동해시',
      'Taebaek': '태백시',
      'Sokcho': '속초시',
      'Samcheok': '삼척시',
      'Hongcheon': '홍천군',
      'Hoengseong': '횡성군',
      'Yeongwol': '영월군',
      'Pyeongchang': '평창군',
      'Jeongseon': '정선군',
      'Cheorwon': '철원군',
      'Hwacheon': '화천군',
      'Yanggu': '양구군',
      'Inje': '인제군',
      'Goseong': '고성군',
      'Yangyang': '양양군',
      
      // 충청북도 → 시/군 단위로 유지
      'Cheongju': '청주시',
      'Chungju': '충주시',
      'Jecheon': '제천시',
      'Eumseong': '음성군',
      'Jincheon': '진천군',
      'Goesan': '괴산군',
      'Jeungpyeong': '증평군',
      'Danyang': '단양군',
      'Boeun': '보은군',
      'Okcheon': '옥천군',
      'Yeongdong': '영동군',
      'Geumsan': '금산군',
      
      // 충청남도 → 시/군 단위로 유지
      'Cheonan': '천안시',
      'Gongju': '공주시',
      'Boryeong': '보령시',
      'Asan': '아산시',
      'Seosan': '서산시',
      'Nonsan': '논산시',
      'Gyeryong': '계룡시',
      'Buyeo': '부여군',
      'Seocheon': '서천군',
      'Cheongyang': '청양군',
      'Hongseong': '홍성군',
      'Yesan': '예산군',
      'Taean': '태안군',
      'Dangjin': '당진시',
      
      // 전라북도 → 시/군 단위로 유지
      'Jeonju': '전주시',
      'Gunsan': '군산시',
      'Iksan': '익산시',
      'Jeongeup': '정읍시',
      'Namwon': '남원시',
      'Gimje': '김제시',
      'Wanju': '완주군',
      'Jinan': '진안군',
      'Muju': '무주군',
      'Jangsu': '장수군',
      'Imsil': '임실군',
      'Sunchang': '순창군',
      'Gochang': '고창군',
      'Buan': '부안군',
      
      // 전라남도 → 시/군 단위로 유지
      'Mokpo': '목포시',
      'Yeosu': '여수시',
      'Suncheon': '순천시',
      'Naju': '나주시',
      'Gwangyang': '광양시',
      'Damyang': '담양군',
      'Gokseong': '곡성군',
      'Gurye': '구례군',
      'Goheung': '고흥군',
      'Boseong': '보성군',
      'Hwasun': '화순군',
      'Jangheung': '장흥군',
      'Gangjin': '강진군',
      'Haenam': '해남군',
      'Yeongam': '영암군',
      'Muan': '무안군',
      'Hampyeong': '함평군',
      'Yeonggwang': '영광군',
      'Jangseong': '장성군',
      'Wando': '완도군',
      'Jindo': '진도군',
      'Sinan': '신안군',
      
      // 경상북도 → 시/군 단위로 유지
      'Pohang': '포항시',
      'Gyeongju': '경주시',
      'Gimcheon': '김천시',
      'Andong': '안동시',
      'Gumi': '구미시',
      'Yeongju': '영주시',
      'Yeongcheon': '영천시',
      'Sangju': '상주시',
      'Mungyeong': '문경시',
      'Gyeongsan': '경산시',
      'Uiseong': '의성군',
      'Cheongsong': '청송군',
      'Yeongyang': '영양군',
      'Yeongdeok': '영덕군',
      'Cheongdo': '청도군',
      'Goryeong': '고령군',
      'Seongju': '성주군',
      'Chilgok': '칠곡군',
      'Yecheon': '예천군',
      'Bonghwa': '봉화군',
      'Uljin': '울진군',
      'Ulleung': '울릉군',
      
      // 경상남도 → 시/군 단위로 유지
      'Changwon': '창원시',
      'Jinju': '진주시',
      'Tongyeong': '통영시',
      'Sacheon': '사천시',
      'Gimhae': '김해시',
      'Miryang': '밀양시',
      'Geoje': '거제시',
      'Yangsan': '양산시',
      'Uiryeong': '의령군',
      'Haman': '함안군',
      'Changnyeong': '창녕군',
      'Goseong': '고성군',
      'Namhae': '남해군',
      'Hadong': '하동군',
      'Sancheong': '산청군',
      'Hamyang': '함양군',
      'Geochang': '거창군',
      'Hapcheon': '합천군',
      
      // 제주특별자치도 → 시 단위로 유지
      'Jeju City': '제주시',
      'Seogwipo': '서귀포시'
    };
    
    // 정확한 매칭 시도
    if (cityNameMap[englishName]) {
      return cityNameMap[englishName];
    }
    
    // 부분 매칭 시도 (영문 도시명이 포함된 경우)
    for (const [english, korean] of Object.entries(cityNameMap)) {
      if (englishName.toLowerCase().includes(english.toLowerCase()) || 
          english.toLowerCase().includes(englishName.toLowerCase())) {
        return korean;
      }
    }
    
    // 매핑되지 않은 경우 원본 반환
    return englishName;
  };

  // 도시명으로 지역명을 찾는 함수
  const findRegionByCity = (cityName) => {
    for (const [regionName, cities] of Object.entries(cityGroups)) {
      const foundCity = cities.find(city => city.name === cityName);
      if (foundCity) {
        return regionName;
      }
    }
    return null;
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 자동으로 현재 위치 감지
    getCurrentLocation();
  }, []); // 빈 의존성 배열로 한 번만 실행

  // 현재 위치 가져오기 (개선된 버전)
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // GPS 정확도가 너무 낮으면 경고
            if (position.coords.accuracy > 1000) {
              setError('GPS 정확도가 낮습니다. 더 정확한 위치를 위해 실외에서 다시 시도해주세요.');
            }
            
            setIsLoadingLocation(true);
            const { latitude, longitude } = position.coords;
            
            // 현재 위치 상태 업데이트
            setCurrentLocation({ lat: latitude, lon: longitude });
            
            // 도시명 가져오기
            const cityName = await getCityNameFromCoordinates(latitude, longitude);
            
            // 지역명도 함께 찾기
            const regionName = findRegionByCity(cityName);
            if (regionName) {
              setSelectedRegion(regionName);
              setSelectedCity(cityName);
            }
            
            // 상위 컴포넌트로 위치 정보 전달
            onLocationSelect({ lat: latitude, lon: longitude }, cityName);
          } catch (error) {
            setError('현재 위치를 처리할 수 없습니다. 수동으로 지역을 선택해주세요.');
            // 에러 시 서울로 기본 설정하지 않음
          } finally {
            setIsLoadingLocation(false);
          }
        },
        (error) => {
          setIsLoadingLocation(false);
          
          // GPS 에러별 상세 메시지
          let errorMessage = '';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = '위치 정보를 사용할 수 없습니다. 수동으로 지역을 선택해주세요.';
              break;
            case error.TIMEOUT:
              errorMessage = '위치 정보 요청 시간이 초과되었습니다. 다시 시도해주세요.';
              break;
            default:
              errorMessage = '위치 정보를 가져올 수 없습니다. 수동으로 지역을 선택해주세요.';
          }
          
          setError(errorMessage);
          // 에러 시 서울로 기본 설정하지 않음
        },
        {
          enableHighAccuracy: true, // 고정밀 GPS 사용
          timeout: 15000, // 15초로 증가
          maximumAge: 30000 // 30초로 감소 (더 최신 위치 정보)
        }
      );
    } else {
      setIsLoadingLocation(false);
      setError('이 브라우저는 위치 서비스를 지원하지 않습니다. 수동으로 지역을 선택해주세요.');
      // 지원하지 않는 경우 서울로 기본 설정하지 않음
    }
  };

  // 지역 선택 핸들러
  const handleRegionSelect = (e) => {
    const regionName = e.target.value;
    setSelectedRegion(regionName);
    setSelectedCity(''); // 지역이 변경되면 도시 선택 초기화
    
    if (regionName) {
      // 지역에 속한 첫 번째 도시를 자동으로 선택
      const citiesInRegion = cityGroups[regionName];
      if (citiesInRegion && citiesInRegion.length > 0) {
        const firstCity = citiesInRegion[0];
        setSelectedCity(firstCity.name);
        // 도시명을 전달 (예: "강남구", "남양주시")
        onLocationSelect({ lat: firstCity.lat, lon: firstCity.lon }, firstCity.name);
      }
    }
  };

  // 도시 선택 핸들러
  const handleCitySelect = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    
    if (cityName && selectedRegion) {
      const citiesInRegion = cityGroups[selectedRegion];
      const city = citiesInRegion.find(city => city.name === cityName);
      if (city) {
        // 도시명을 전달 (예: "강남구", "남양주시")
        onLocationSelect({ lat: city.lat, lon: city.lon }, city.name);
      }
    }
  };

  const handleCurrentLocationClick = async () => {
    setSelectedCity('');
    setSelectedRegion('');
    await getCurrentLocation();
  };

  return (
    <div className="location">
      <div className="location-header">
        <h3>📍 위치 선택</h3>
        <button 
          className="current-location-btn"
          onClick={handleCurrentLocationClick}
          disabled={isLoadingLocation}
        >
          {isLoadingLocation ? '🔄 위치 확인 중...' : '📍 현재 위치'}
        </button>
      </div>

      {/* 지역 및 도시 선택 */}
      <div className="location-selector">
        {/* 지역 선택 */}
        <div className="region-selector">
          <label htmlFor="region-select">🗺️ 지역 선택</label>
          <select
            id="region-select"
            value={selectedRegion}
            onChange={handleRegionSelect}
            className="region-select"
          >
            <option value="">지역을 선택하세요</option>
            {Object.entries(cityGroups)
              .sort(([a], [b]) => a.localeCompare(b, 'ko'))
              .map(([regionName, cities]) => (
                <option key={regionName} value={regionName}>
                  {regionName} ({cities.length}개 도시)
                </option>
              ))}
          </select>
        </div>

        {/* 도시 선택 */}
        <div className="city-selector">
          <label htmlFor="city-select">🏙️ 도시 선택</label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={handleCitySelect}
            className="city-select"
            disabled={!selectedRegion}
          >
            <option value="">도시를 선택하세요</option>
            {selectedRegion && cityGroups[selectedRegion] ? (
              cityGroups[selectedRegion]
                .sort((a, b) => a.name.localeCompare(b.name, 'ko'))
                .map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))
            ) : (
              <option value="">지역을 먼저 선택하세요</option>
            )}
          </select>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
          <button 
            onClick={() => setError(null)}
            className="error-close-btn"
          >
            닫기
          </button>
        </div>
      )}

      {/* 현재 위치 정보 표시 */}
      {currentLocation && (
        <div className="current-location-info">
          <h4>📍 현재 선택된 위치</h4>
          <p>
            위도: {currentLocation.lat.toFixed(4)}, 
            경도: {currentLocation.lon.toFixed(4)}
          </p>
        </div>
      )}
    </div>
  );
};

export default Location;
