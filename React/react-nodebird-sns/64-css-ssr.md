# CSS 서버사이드렌더링

간헐적으로 페이지에 기존에 넣어두었던 스타일이 적용되지 않는 경우가 발생하고 있다.  
이는 CSS가 서버사이드렌더링이 되지 않는 이슈로 해당 문제를 개선해보자. 먼저 Next도 내부적으로 웹팩과 바벨이 돌아간다.  
그 중 바벨 설정을 임의로 바꿀 수 있으므로 해당 설정을 커스텀해본다.

`.babelrc`

```
{
  "presets": ["next/babel"],
  "plugins": [
    [
      "babel-plugin-styled-components",
      { "ssr": true, "fileName": true, "displayName": true, "pure": true }
    ]
  ]
}
```

그리고 스타일 시트를 HTML 자체에 적용해주기 위해서는 \_app.js의 상위 파일인 \_document.js를 생성한 후 커스텀해줘야 한다. 보통 \_document.js는 클래스형 컴포넌트로 되어 있으며 가장 최상위에 존재하여 HTML과 Head, Body를 모두 수정해줄 수 있다. \_document.js가 \_app.js를 감싸는 형식이다.

`/pages/_document.js`

```jsx
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
  // 1. getInitialProps 적용
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderpage;

    try {
      ctx.renderpage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        });
      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } catch (err) {
      console.error(err);
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          {/* IE 동작을 위해 폴리필 파일 추가 */}
          <script src="https://polyfill.io/v3/polyfill.min.js?features=default%2Ces2015%2Ces2016%2Ces2017%2Ces2018%2Ces2019" />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```

1. `getInitialProps`는 \_document.js나 \_app.js에서만 쓰는 제한적인 메서드라고 생각하자 (이후에 없어질지도 모름)
2. IE에서 동작하도록 필요한 최신 문법 폴리필 파일을 넣어준다. 보통 바벨로더를 패키지에 설치하여 IE 지원을 대응하는데, 해당 라이브러리는 너무 무겁기 때문에 요즘은 내가 필요한 문법만 선택하여 폴리필 파일을 호출해주는 방식을 이용한다.
   - [https://polyfill.io/v3/url-builder/](https://polyfill.io/v3/url-builder/) 여기에서 필요한 파일만 선택하여 적용한다!!
