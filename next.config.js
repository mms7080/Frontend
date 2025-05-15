export default {
  reactStrictMode:true,    // 오류를 감지하기위해서 강제로 2번씩 렌더링하는 옵션
  compress: true,          // 코드를 압축할지 여부
  basePath: '',            // 웹페이지의 기본 경로
  output:'standalone',     // 필요한 파일만 추출할지 여부
  trailingSlash:true,      // 접미사 슬래시 여부
}