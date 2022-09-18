## 이미지 갤러리 서비스 최적화

### 실습 내용

- 로딩 성능 최적화
  - 이미지 지연(lazy) 로딩
- 렌더링 성능 최적화
  - Layout Shift 피하기
  - useSelector 렌더링 문제 해결
    - redux hooks 인 useSelector 이슈 개선
  - Redux Reselect를 통한 렌더링 최적화
  - 병목 함수에 memoization 적용
  - 병목 함수 로직 개선하기

### 분석 툴

- 크롬 Network 탭
- 크롬 Performance 탭
- Lighthouse
- React Developer Tools(Profiler)
- Redux DevTools

### 서비스 탐색 및 코드 분석

이번 프로젝트는 여러 사진을 갤러리형식으로 열어볼 수 있는 페이지이다. Random, Animals 등 여러 테마로 사진을 필터하여 확인할 수도 있다. 소스 구성을 먼저 확인해보자.

`./src/App.js`

```html
<AppWrap>
  <GlobalStyle />
  <header />
  <PhotoListContainer />
  <ImageModalContainer />
</AppWrap>
```

위와 같은 구조로 홈페이지가 구성되어 있다.
기본적인 카테고리 구조를 보여주는 Header 컴포넌트와 사진을 보여주는 PhotoListContainer, 그리고 상세 이미지를 보여주는 ImageModalContainer 컴포넌트로 구성되어 있다.

![](../../img/220918-1.png)

리덕스에서 동작하는 구조를 보면 가장 먼저 이미지를 가져오고, 이를 모달로 활성화 시킨 뒤 사진에 따른 배경 색을 조정하는 코드가 동작한다는 것을 확인할 수 있다.

SET_BG_COLOR의 경우 이미지 전체 색을 체크하여 그 중 평균 색감을 가져오므로 사진 크기가 클수록 더욱 비용이 올라가는 코드가 될 수 있다는 것을 참고 하자.
