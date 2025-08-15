import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function copyDir(src, dest) {
  // 목적지 디렉토리 생성
  mkdirSync(dest, { recursive: true });
  
  // 소스 디렉토리의 모든 파일/폴더 읽기
  const items = readdirSync(src);
  
  for (const item of items) {
    const srcPath = join(src, item);
    const destPath = join(dest, item);
    
    const stat = statSync(srcPath);
    
    if (stat.isDirectory()) {
      // 디렉토리인 경우 재귀적으로 복사
      copyDir(srcPath, destPath);
    } else {
      // 파일인 경우 복사
      copyFileSync(srcPath, destPath);
      console.log(`복사됨: ${srcPath} → ${destPath}`);
    }
  }
}

try {
  console.log('Functions 폴더를 dist로 복사 중...');
  copyDir('functions', 'dist/functions');
  console.log('✅ Functions 복사 완료!');
} catch (error) {
  console.error('❌ Functions 복사 실패:', error.message);
  process.exit(1);
}
