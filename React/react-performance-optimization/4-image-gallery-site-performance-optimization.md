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

### Layout Shift 피하기

Layout Shift는 어떤 것일까? 이미지 갤러리 서비스에서 데이터 로드 속도가 느릴 때, 갤러리 이미지 로드 시 순서대로 이미지가 노출되지 않고 작은 용량부터 로드되면서 Layout이 뒤로 밀리는 현상을 의미한다. 이는 크롬 개발자도구의 Performance 탭에서도 확인할 수 있다.

![](../../img/220919-1.png)

이런 Layout Shift는 성능에 영향을 준다. 화면에서 해당 이미지에 대한 렌더링을 위해 계산을 다시 해야한다는 점과 원하는 이미지 클릭을 하지 못할 경우에 대한 사용성 정하가 바로 그 예이다.

LightHouse로 사이트를 검사해보았을 때에도 Cumulative layout Shift라는 메시지가 대략 0.309 로 나오는 것을 확인할 수 있다. (0~1 값, 가장 빠른 네트워크에서 검사한 것이므로 현저한 성능 저하 이슈라고 볼 수 있다) 또한 진단내역에 이와 관련된 메시지가 나오는 것도 확인할 수 있다. (이미지 요소에 width 및 height가 명시되어 있지 않습니다.)

![](../../img/220919-2.png)

![](../../img/220919-3.png)

Layout Shift의 원인은 아래와 같다.

- 사이즈가 정해져 있지 않은 이미지
- 사이즈가 정해져 있지 않은 광고
- 동적으로 삽입된 콘텐츠(api fetching)
- web font (FOIT, FOUT)

그렇다면 이러한 Layout Shift는 어떻게 개선할 수 있을까?
발생할 수 있는 레이아웃에 대한 위치나 사이즈를 지정하여 레이아웃 배치에 소요되는 비용을 줄여줄 수 있다.

현재 갤러리의 경우 이미지가 16:9 비율로 노출되므로 해당 비율을 그대로 코드에 적용해주면 된다.

`./src/components/PhotoItem.js`

```jsx
function PhotoItem({ photo: { urls, alt } }) {
  //...
  return (
    <ImageWrap>
      <Image src={urls.small + "&t=" + new Date().getTime()} alt={alt} onClick={openModal} />
    </ImageWrap>
  )
}

const ImageWrap = styled.div`
  width: 100%;
  padding-bottom: 56.25%;
  position: relative;
`

const Image = styled.img`
  cursor: pointer;
  width: 100%;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`
```

위처럼 ImageWrap에 padding 속성을 활용해 각 위치에 이미지가 들어가도록 처리해준다.

![](../../img/220919-1.gif)

레이아웃이 밀리지 않고 제자리에 데이터가 들어가는 것을 확인할 수 있다. 위처럼 하면 기존 Performance 탭에서 발생하던 Layout Shift 메시지도 발생하지 않는 것을 확인할 수 있다.

### 이미지 지연(lazy) 로딩(react-lazyload)

이번에는 이미지 지연 로딩에 대해 구현해본다. 이전 시간에도 이미지 지연로드를 구현해보았는데, 그때는 intersectionObserver를 활용해서 스크롤에 따른 이미지 로드가 처리되도록 작업했다.

이번에는 비슷한 로직이지만 react-lazyload라는 라이브러리를 활용해서 구현해보도록 한다.

```bash
> npm i --save react-lazyload
```

`./src/components/PhotoItem.js`

```jsx
// ..
import LazyLoad from "react-lazyload"

export default PhotoItem({ photo: { urls, alt } }) {
	// ..
  return (
    <ImageWrap>
      <LazyLoad>
        <Image src={urls.small + "&t=" + new Date().getTime()} alt={alt} onClick={openModal} />
      </LazyLoad>
    </ImageWrap>
  )
}
```

위처럼 react-lazyload의 LazyLoad를 이미지영역에 감싸주면 스크롤에 따라 이미지가 순차적으로 로드되는 것을 확인할 수 있다.

![](../../img/220920-1.gif)

스크롤 속도에 따라 fetch 되는 과정이 자주 보인다면 이미지 로드 시점을 조금 앞당기면 된다.

```jsx
// ..
import LazyLoad from "react-lazyload"

export default PhotoItem({ photo: { urls, alt } }) {
	// ..
  return (
    <ImageWrap>
      <LazyLoad offset={500}>
        <Image src={urls.small + "&t=" + new Date().getTime()} alt={alt} onClick={openModal} />
      </LazyLoad>
    </ImageWrap>
  )
}
```

하위로 500px 에 대한 이미지를 사전에 로드해오는 설정임.
