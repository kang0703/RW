import fs from 'fs';
import path from 'path';

// 사이트 설정
const SITE_URL = 'https://rw-7hc.pages.dev'; // 실제 도메인으로 변경하세요
const OUTPUT_PATH = './public/sitemap.xml';

// 페이지 정보
const pages = [
  {
    path: '/',
    priority: '1.0',
    changefreq: 'daily',
    description: '메인 페이지'
  },
  {
    path: '/seoul',
    priority: '0.9',
    changefreq: 'hourly',
    description: '서울 날씨 페이지'
  },
  {
    path: '/gyeonggi',
    priority: '0.9',
    changefreq: 'hourly',
    description: '경기도 날씨 페이지'
  },
  {
    path: '/gangwon',
    priority: '0.9',
    changefreq: 'hourly',
    description: '강원도 날씨 페이지'
  },
  {
    path: '/chungbuk',
    priority: '0.9',
    changefreq: 'hourly',
    description: '충청북도 날씨 페이지'
  },
  {
    path: '/chungnam',
    priority: '0.9',
    changefreq: 'hourly',
    description: '충청남도 날씨 페이지'
  },
  {
    path: '/jeonbuk',
    priority: '0.9',
    changefreq: 'hourly',
    description: '전라북도 날씨 페이지'
  },
  {
    path: '/jeonnam',
    priority: '0.9',
    changefreq: 'hourly',
    description: '전라남도 날씨 페이지'
  },
  {
    path: '/gyeongbuk',
    priority: '0.9',
    changefreq: 'hourly',
    description: '경상북도 날씨 페이지'
  },
  {
    path: '/gyeongnam',
    priority: '0.9',
    changefreq: 'hourly',
    description: '경상남도 날씨 페이지'
  },
  {
    path: '/jeju',
    priority: '0.9',
    changefreq: 'hourly',
    description: '제주도 날씨 페이지'
  }
];

// 현재 날짜를 ISO 형식으로 가져오기
const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

// sitemap XML 생성
const generateSitemap = () => {
  const currentDate = getCurrentDate();
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  pages.forEach(page => {
    sitemap += `
  <!-- ${page.description} -->
  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
};

// 파일 저장
const saveSitemap = (content) => {
  try {
    fs.writeFileSync(OUTPUT_PATH, content, 'utf8');
    console.log(`✅ Sitemap이 성공적으로 생성되었습니다: ${OUTPUT_PATH}`);
    console.log(`📅 생성 날짜: ${getCurrentDate()}`);
    console.log(`🔗 총 ${pages.length}개의 페이지가 포함되었습니다.`);
  } catch (error) {
    console.error('❌ Sitemap 생성 중 오류가 발생했습니다:', error);
  }
};

// 실행
console.log('🚀 Sitemap 생성을 시작합니다...');
const sitemapContent = generateSitemap();
saveSitemap(sitemapContent); 