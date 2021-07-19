/*
vue-cli 3.x 버전 부터 웹팩 설정은 webpack.config.js가 아닌 vue.config.js에 작성합니다.
루트 디렉토리(package.json)옆에 적으면 vue-cli가 자동으로 로드합니다.
*/
// const path = require('path')

module.exports = {
  publicPath: './',
  assetsDir: './',
  productionSourceMap: false,
  outputDir: './dist/',
  lintOnSave: 'default',
  filenameHashing: false,
  css: {
    loaderOptions: {
      // 글로벌 변수 SCSS 사용
      sass: {
        additionalData: `
        @import "@/assets/css/mixin.scss";
        `
      }
    }
  }
  // configureWebpack: {
  //   // 웹팩 설정
  //   resolve: {
  //     // resolve.alias는 현재 경로를 변수에 담고 사용 가능하게 만들어줌
  //     alias: {
  //       "@": path.join(__dirname, "./assets")
  //     }
  //   }
  // }
}
/*
publicPath : 값을 빈 문자열 ( '') 또는 상대 경로 ( ./)로 설정하여 모든 자산이 상대 경로를 사용하여 연결되도록 할 수도 있습니다 .
outputDir : 프로덕션 빌드 파일이 생성 될 디렉토리이며 빌드하기 전에 대상 디렉토리가 제거됩니다
assetsDir: outputDir생성 된 정적 자 (js, css, img, fonts)의 상대 경로(?)
indexPath: 생성 된 index.html 의 상대적 outputDir 의 경로
*/
