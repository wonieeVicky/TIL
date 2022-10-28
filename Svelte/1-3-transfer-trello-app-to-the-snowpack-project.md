## Trello 앱을 Snowpack 프로젝트로 이관하기

### Snowpack이란?

Snowpack은 스벨트를 제작한 Rick Harris가 만든 것으로 프론트엔드 빌드 도구이다. 점점 고도화되고 있다. 기존의 webpack, rollup, parcel같은 무겁고 복잡한 번들러의 번들 소요 시간을 획기적으로 절약해준다.

Snowpack는 번들러가 아니며, 웹 빌드 시스템에 대한 새로운 접근 방식을 제공한다. JavaScript의 ESM(브라우저에도 import, export 가 동작하므로 해당 방법을 사용함)을 활용하여 동일 파일을 다시 빌드하지 않는 최초의 빌드 시스템을 생성해서 변경사항을 브라우저에 즉시 적용할 수 있다.

```jsx
// CommonJS
const xxx = require("svelte")
module.exports = xxx

// ESM
import xxx from "svelte"
export let xxx
export default xxx
```

관련 문서는 해당 [링크](https://heropy.blog/2020/10/31/snowpack/)에서 자세히 확인해볼 수 있다.

위와 같은 ‘번들 없는 개발’ 방식은 기존 방식에 비해 몇 가지 장점이 있다.

- 빠르다.
- 예측한 대로 동작한다.
- 디버깅이 더 쉽다.
- 개별 파일 캐시가 더 좋다.
- 프로젝트 크기가 개발 속도에 영향을 주지 않는다.

모든 파일은 개별적으로 빌드되고, 지속해서 캐시되므로 파일에 변경사항이 없으면 파일을 다시 빌드하지 않고 브라우저에서 다시 다운로드 하지 않는다. 이것이 번들없는 개발의 핵심이다.

또, Snowpack은 즉시(50ms 미만) 시작하여 속도 저하 없이 무한히 큰 프로젝트로 확장할 수 있다.
반대로 기존 번들러로 대규모 앱을 빌드할 때는 개발 시작 시간이 30초 이상 걸리는 것이 일반적이다.
