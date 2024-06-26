// built-in
import path from "path";
// @rollup: 비교적 최신에 만들어진 모듈임(@)
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import alias from "@rollup/plugin-alias";
import strip from "@rollup/plugin-strip";
// rollup: 비교적 구버전인 모듈
import svelte from "rollup-plugin-svelte";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import replace from "rollup-plugin-replace";
import globals from "rollup-plugin-node-globals";
import builtins from "rollup-plugin-node-builtins";
// external
import sveltePreprocess from "svelte-preprocess";

// Rollup Watch 기능(-w)이 동작하는 경우만 '개발 모드'라고 판단
const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    // 서버 있으면 바로 종료.
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      // 서버가 있으면 실행하지 않음.
      if (server) return;

      // 서버 생성.
      server = require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
        stdio: ["ignore", "inherit", "inherit"],
        shell: true,
      });

      // 프로세스 종료 이벤트(SIGTERM, exit)에 서버 종료하도록 핸들링.
      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

// Rollup의 기본 옵션
export default {
  // 진입점 : 여기서부터 분석을 시작한다.
  input: "src/main.js",
  // 번들 출력 : 결과를 아래와 같이 도출한다.
  output: {
    // 번들의 소스맵 파일을 생성. 소스맵은 난독화 파일을 해석해서 성능 향상에 도움을 준다. (브라우저가 소스맵과 난독화 파일을 비교해서 파악한다.)
    sourcemap: true,
    // 번들의 포멧을 지정. `iife`는 HTML SCRIPT 태그에서 사용하기에 적합한 번들을 생성한다.
    format: "iife",
    // 번들의 전역 변수 이름. `iife` 포멧을 사용하는 경우에 필요하다.
    name: "app",
    // 번들이 생성되는 경로
    file: "public/build/bundle.js",
  },
  plugins: [
    svelte({
      // 개발 모드에서 런타임 검사를 활성화
      dev: !production,
      // Svelte 컴포넌트의 CSS를 별도 번들로 생성
      css: (css) => {
        css.write("bundle.css");
      },
      // 전처리 옵션을 지정합니다.
      preprocess: sveltePreprocess({
        scss: {
          // 전역에서 사용할 SCSS 파일을 지정
          // 단, style 태그에 lang="scss"가 지정되어 있어야 적용된다.
          // SCSS에서는 url()을 사용하면 표준 CSS 문법으로 해석하고, url()을 사용하지 않으면 SCSS 문법으로 해석한다.
          // 즉, url() 유무에 따라 해석 방법이 달라진다는 의미이다.
          prependData: '@import "./src/scss/main.scss";',
        },
        // PostCSS는 Autoprefixer를 설치하면 같이 설치됨.(9버전), CSS 후처리를 담당한다.
        // 10버전 이상은 postcss를 별도 설치해야 함.(npm i -D postcss)
        // Autoprefixer는 CSS에 자동으로 공급 업체 접두사(Vendor prefix)를 적용한다. (-ms-, -webkit-를 알아서 붙여주는 옵션)
        postcss: {
          plugins: [require("autoprefixer")()],
        },
      }),
    }),

    // replace ~ builtins 까지는 아래와 같은 순서대로 작성해야 정상적으로 동작함(주의!)
    // 대부분의 플러그인은 Rollup 측에서 제공하는 것이 아니기 때문에,
    // 플러그인의 동작 순서를 파악하는 것은 사용자(개발자)의 몫이라고 설명하고 있음

    // Crypto-random-string에서 내부적으로 randomBytes가 사용됨
    // Node Globals와 Builtins가 내부적으로 제공하지 않기 때문에,
    // 다음과 같이 지정(대체)해야 정상적으로 동작한다.
    // https://github.com/sindresorhus/crypto-random-string/blob/master/index.js
    replace({
      values: {
        "crypto.randomBytes": 'require("randombytes")',
      },
    }),
    // NPM으로 설치하는 외부 모듈을 번들에 포함한다.
    resolve({
      // 브라우저 환경을 위한 번들로 포함하도록 지시(최적화)
      browser: true,
      // 중복 번들을 방지하기 위한 외부 모듈 이름을 지정: 외부 모듈에 svelte를 쓸 경우 중복 번들되지 않도록 체크함
      dedupe: ["svelte"],
    }),
    // 외부 모듈을 ES6 번들로 변환: require('') 방식으로 호출하는 모듈을 번들링함
    commonjs(),
    // 일부 Node 모듈이 필요로 하는 전역 API를 사용할 수 있음
    globals(),
    // Node 내장 API를 사용할 수 있음
    builtins(),

    // 경로 별칭 지정
    // 상대 경로에 대한 별칭이 없으면, 프로젝트를 리팩토링할 때 문제가 생길 확률이 매우 높아진다.
    alias({
      entries: [{ find: "~", replacement: path.resolve(__dirname, "src/") }],
    }),

    // For Development mode!
    // 개발 모드에서는 번들이 생성되면 `npm run start`를 호출한다.
    !production && serve(),
    // 개발 모드에서는 'public' 디렉토리에서 변경사항이 확인되면 브라우저를 새로고침한다.
    !production && livereload("public"),

    // For Production mode!
    // 제품 모드에서는 'console.log' 같은 Console 명령을 제거한다.
    production &&
      strip({
        include: "**/*.(svelte|js)",
      }),
    // 제품 모드에서는 번들을 최소화(최적화, minify)
    production && terser(),
  ],
  watch: {
    // 다시 빌드할 때, 터미널 화면을 초기화하지 않는다. 기본값은 `true`
    clearScreen: false,
  },
};
