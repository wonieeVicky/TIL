## 일반 홈페이지 최적화

### 이번 시간에는 이런 것을 배운다.

- 로딩 성능 최적화
  - 이미지 레이지(Lazy) 로딩
  - 이미지 사이즈 최적화
  - 동영상 최적화
  - 폰트 최적화
  - 캐시 최적화
  - 불필요한 CSS 제거
- 분석 툴
  - 크롬 Network,Performance, Lighthouse, Coverage 탭

### 코드 분석에 앞서

프로젝트 [링크](https://github.com/performance-lecture/lecture-3)에서 소스를 다운받은 뒤 `npm i`으로 프로젝트를 로컬에 클론해준다.

`package.json`

```json
"scripts": {
  "start": "npm run build:style && react-scripts start",
  "build": "npm run build:style && react-scripts build",
  "build:style": "postcss src/tailwind.css -o src/styles.css",
  "serve": "node ./server/server.js",
  "server": "node ./node_modules/json-server/lib/cli/bin.js --watch ./server/database.json -c ./server/config.json"
},
```

serve, server는 서버 관련한 실행을 의미. build:style은 스타일을 빌드하는 명령어임

```bash
> npm run build
> npm run serve
> npm run server
```

위 명령어들로 홈페이지를 로컬에서 실행시켜 화면을 확인해준다.

### 이미지 지연(lazy)로딩(intersection observer)

이번 시간에는 이미지 동적 로딩에 대해 배워본다. 이미지 동적 로딩을 하기 전에 현재 페이지에 뭐가 문제가 있는지 부터 분석해야 한다. 뭐가 문제인지 알아야 고치기 때문! 방법은 한 가지로 정해져있지 않고, 다양하게 확인할 수 있는데 보통 performance나 network 탭 등으로 현황을 파악할 수 있다.

이번에는 network 탭으로 현황을 파악해본다.
우선 현황 파악을 위해 네트워크 속도에 대한 사용제한을 추가하는데 아래와 같이 커스텀 프로필을 추가한 뒤 6,000으로 테스트를 해보자

![](../../img/220828-1.png)

![](../../img/220828-2.png)

위와 같이 캐시 미사용까지 선택 후 페이지를 리로드하면 페이지 로드하는 과정을 network탭에서 확인할 수 있다.

![](../../img/220828-3.png)

우리가 유심히 확인해야할 영역은 홈페이지의 가장 첫 장면에 위치한 `.mp4` 비디오 파일이다. 해당 파일은 네트워크 속도가 느리게 들어오면서 초기에는 Pending으로 처리되다가 다른 이미지 리소스가 모두 다운받아지고 나서 다운로드를 받기 시작한다.

가장 먼저 사용자에게 눈에 띄는 화면인데 나중에 로드가 되면 이는 UX에 좋지 않을 것이다. 그럼 이는 어떻게 해결할 수 있을까? 해결 방법으로는 크게 두가지를 생각할 수 있는데, 첫쨰, 앞서 로드하는 이미지를 빠르게 다운로드 받거나 둘째, 당장 사용하지 않는 이미지는 나중에 다운로드 받도록 처리하는 방법이 있다.

첫 번째 방법은 궁극적인 해결방법이라고 볼 수는 없으므로 두 번째 방법으로 개선을 해보도록 한다.

이미지 lazy loading은 필요하지 않은 이미지를 나중에 로드한다는 것을 의미한다. 즉, 홈페이지 상 필요하지 않는 이미지는 스크롤을 내렸을 때, 다시 말해 노출되어야 하는 시점에 로드되도록 하는 것이다. (이미지가 보여지는 곳까지 스크롤이 되었는지를 파악 후 맞는 시점에 노출) 하지만 스크롤을 할 때마다 이를 체크하도록 하는 함수가 실행되면 이는 되려 브라우저의 성능에 안좋을 수 있다.

이때 사용하는 것이 Intersection Observer API이다. Intersection Observer는 특정 엘리먼트를 Observer할 수 있고, 특정 엘리먼트가 스크롤을 하여 노출되는 시점을 따로 잡아낼 수 있다.

```jsx
function createObserver() {
  let observer

  let options = {
    root: null,
    rootMargin: '0px',
    threshold: buildThresholdList(),
  }

  observer = new IntersectionObserver(handleIntersect, options)
  observer.observe(boxElement) // boxElement에 관찰자를 적용시킨다.
}
```

위와 같이 boxElement를 Observe해주면 해당 구독이 시작되었을 때(initialize) 한 번, 해당 엘리먼트가 화면에 노출되었을 때 한 번, 사라졌을 때 한 번 호출이 된다. 이를 활용해서 lazy loading을 구현할 수 있는 것이다

`./src/components/Card.js`

```jsx
import React, { useEffect, useRef } from 'react'

function Card(props) {
  const imgRef = useRef(null)

  useEffect(() => {
    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        // Each entry describes an intersection change for one observed
        // target element:
        // entry.isIntersecting - 화면 안에 요소가 들어와있는지 알려주는 요소
        if (entry.isIntersecting) {
          console.log('is intersecting')
        }
      })

      console.log('callback')
    }
    const options = {}
    const observer = new IntersectionObserver(callback, options)
    observer.observe(imgRef.current)
  }, [])
  return (
    <div className="Card text-center">
      <img ref={imgRef} src={props.image} />
      <div className="p-5 font-semibold text-gray-700 text-xl md:text-lg lg:text-xl keep-all">{props.children}</div>
    </div>
  )
}

export default Card
```

위와 같이 이미지에 `useRef`로 참조를 걸고, `observer`를 적용해주면 아래와 같이 해당 이미지 엘리먼트가 `isIntersecting` 하는 시점에 `console.log` 코드가 실행되는 것을 확인할 수 있다.

![](../../img/220828-1.gif)

위 `isIntersecting`은 이미지가 노출되는 시점에만 코드가 실행되는 조건임을 참고하자.
이를 활용하여 이미지 로드를 실행하도록 아래와 같이 코드를 개선할 수 있다.

`./src/components/Card.js`

```jsx
//..
function Card(props) {
  const imgRef = useRef(null)

  useEffect(() => {
    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log('is intersecting', entry.target.dataset.src)
          // data-set에 넣어둔 src를 실제 src에 주입 - 이미지 로드
          entry.target.src = entry.target.dataset.src
          // 이미지를 로드한 후 unobserve 처리
          observer.unobserve(imgRef.current)
        }
      })
    }
    // ..
  }, [])
  return (
    <div className="Card text-center">
      <img ref={imgRef} data-src={props.image} />
      <div className="p-5 font-semibold text-gray-700 text-xl md:text-lg lg:text-xl keep-all">{props.children}</div>
    </div>
  )
}
```

위와 같이 intersecting 시 data-set 속성에 임시로 넣어둔 이미지 주소를 src에 대입해준 다음 1회만 로드되면 되므로 바로 unobserve를 실행시켜주면 원하는 이미지 노출 시점에 이미지를 1회 호출하도록 할 수 있다.

![이미지 호출 시점에 맞춰 로드되는 것을 확인할 수 있음](../../img/220828-4.png)

이 밖에 메인 페이지에 존재하는 모든 이미지에 대한 lazy loading을 아래와 같이 구현한다.

`./src/pages/MainPage.js`

```jsx
//..
function MainPage(props) {
  const imgRef_first = useRef(null)
  const imgRef_second = useRef(null)
  const imgRef_third = useRef(null)

  useEffect(() => {
    const options = {}
    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log('is intersecting', entry.target.dataset.src)
          // data-set에 넣어둔 src를 실제 src에 주입 - 이미지 로드
          entry.target.src = entry.target.dataset.src
          // 이미지를 로드한 후 unobserve 처리
          observer.unobserve(entry.target)
        }
      })
    }
    const observer = new IntersectionObserver(callback, options)
    observer.observe(imgRef_first.current)
    observer.observe(imgRef_second.current)
    observer.observe(imgRef_third.current)
  }, [])

  return (
    <div className="MainPage -mt-16">
      <BannerVideo />
      <div className="mx-auto">
				{/* ... */}
        <TwoColumns
          bgColor={'#f4f4f4'}
          columns={[
            <img ref={imgRef_first} data-src={main_items} />,
            // ..
          ]}
        />
        <TwoColumns
          bgColor={'#fafafa'}
          columns={[
            // ..
            <img ref={imgRef_second} data-src={main_parts} />,
          ]}
          mobileReverse={true}
        />
        <TwoColumns
          bgColor={'#f4f4f4'}
          columns={[
            <img ref={imgRef_third} data-src={main_styles} />,
            // ..
            />,
          ]}
        />
      </div>
    </div>
  )
}

export default MainPage
```

![](../../img/220829-1.gif)

### 이미지 사이즈 최적화

앞서 스크롤에 따라 이미지가 나타나야 할 시점에 이미지를 로드하는 image lazy loading을 구현해보았다. 하지만, 이미지 크기 자체가 커서 스크롤 시 해당 리소스를 다운로드 받는 시간이 오래걸려 UX에 좋지 않아보인다. 이는 이미지 사이즈를 최적화하는 것으로 개선할 수 있다.

이미지 사이즈 최적화는 이미지 크기를 줄이고 이미지 용량을 줄여 효율적인 리소스 로딩을 하는 것을 의미한다.
현재 3946*3946 사이즈가 그대로 들어오고 있는데, 이를 300*300 사이즈로 줄이고 추가적인 이미지 압축을 통해 최대한 효율적인 리소스 다운로드를 구현할 수 있다.

이미지 사이즈 최적화를 위해서는 이미지 포맷의 특징에 대해 알아야 한다.

- PNG: 용량이 큼
- JPG: PNG보다 용량이 작음. 화질이 떨어짐
- WEBP: 구글에서 나온 차세대 이미지 포맷, JPG보다 더 좋은 이미지 포맷으로 소개됨

위와 같은 특징에 따라 이번 프로젝트에는 이미지를 WEBP로 사용해보려고 한다. 이미지 컨버터는 [squoosh.app](http://squoosh.app) 를 사용하여 이미지 사이즈를 최적화한다.

![](../../img/220829-1.png)

위처럼 상세한 이미지 변화를 살핀 후 가장 적절한 포맷과 Quality로 이미지사이즈를 줄인 뒤 다운로드받는다.
위와 같이 압축 후 이미지를 비교해보면 아래와 같이 큰 용량차이를 가지는 것을 확인할 수 있다.

![](../../img/220829-2.png)

위 이미지를 `.jpg` 파일 대신 적용하여 스크롤 이벤트에 적용해주면 이미지가 빠르게 호출되어 렌더링이 완료되는 것을 확인할 수 있다

![](../../img/220829-2.gif)

하지만 문제는 있다. .webp가 렌더링이 되지 않는 브라우저가 있는 것임.
따라서 현재 브라우저가 webp 이미지를 지원하는지 파악한 후 지원되지 않을 경우 기존의 이미지를 렌더링하도록 구현할 수 있다. 이러한 체크는 picture 태그를 통해 빠르게 확인할 수 있다.

```html
<picture>
  <source srcset="photo.avif" type="image/avif" />
  <source srcset="photo.webp" type="image/webp" />
  <img src="photo.jpg" alt="photo" />
</picture>
```

위와 같이 source 속성에 각종 조건을 달면 그에 맞는 이미지가 렌더링되도록 설정할 수 있다. 확장자에 대한 분기는 type attribute를 이용해서 조건을 나눌 수 있다. image/avif → image/webp → image.jpg 로 처리할 수 있다.

![](../../img/220829-3.png)

최후의 경우에 사용할 jpg 이미지도 함께 압축한 뒤 위 picure 태그를 사용하여 조건부 렌더링을 구현해보자

`./src/pages/MainPage.js`

```jsx
// ..
function MainPage(props) {
  // ...

  return (
    <div className="MainPage -mt-16">
      <BannerVideo />
      <div className="mx-auto">
        <ThreeColumns
          columns={[
            <Card webp={main1_webp} image={main1}>
              롱보드는 아주 재밌습니다.
            </Card>,
            <Card webp={main2_webp} image={main2}>
              롱보드를 타면 아주 신납니다.
            </Card>,
            <Card webp={main3_webp} image={main3}>
              롱보드는 굉장히 재밌습니다.
            </Card>,
          ]}
        />
        {/* ... */}
      </div>
    </div>
  )
}
```

위와 같이 Card 컴포넌트의 webp Props로 .webp 이미지 파일을 내려준 뒤 아래와 같이 수정한다.

`./src/components/Card.js`

```jsx
function Card(props) {
  const imgRef = useRef(null)

  useEffect(() => {
    const options = {}
    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target
          target.src = target.dataset.src

          // srcset에 대한 조건 추가
          const previousSibling = target.previousSibling
          previousSibling.srcset = previousSibling.dataset.srcset

          // 이미지를 로드한 후 unobserve 처리
          observer.unobserve(target)
        }
      })
    }
    const observer = new IntersectionObserver(callback, options)
    observer.observe(imgRef.current)
  }, [])

  return (
    <div className="Card text-center">
      <picture>
        <source data-srcset={props.webp} type="image/webp" />
        <img ref={imgRef} data-src={props.image} />
      </picture>
      {/* ... */}
    </div>
  )
}
```

위와 같이 처리해주면 .webp 파일이 다운로드되고, 만약 .webp 파일이 지원되지 않는 브라우저에서는 정상적으로 .jpg 파일이 다운로드되는 것을 확인할 수 있다!

![](../../img/220829-3.gif)

### 동영상 사이즈 최적화

이번에는 동영상 최적화에 대해 구현해보자.
사진 사이즈를 최적화한 것처럼 동영상 크기를 줄이는 방법이다.

동영상을 압축하는 작업은 동영상의 화질을 저하시키므로, 메인 콘텐츠라면 고화질로 사용하고, 동영상이 메인 콘텐츠가 아닌 경우에만 최적화하는 것이 좋다. 해당 최적화 사이트는 [media.io](https://www.media.io/ko/video-compressor.html)에서 압축한다.

위에서 이미지를 .webp파일로 저장했는데, 비디오는 .webm 파일로 저장하면 웹 브라우저에 최적화 된 동영상으로 만들 수 있다.

![](../../img/220830-1.png)

위처럼 수정하면 약 절반정도의 용량이 줄어든 것을 확인할 수 있다.

![](../../img/220830-2.png)

이를 `BannerVideo` 컴포넌트에 적용하면 되는데 .webm 파일 또한 미지원되는 브라우저가 있으므로 경우에 따라 .mp4파일을 재생하도록 설정해주어야 한다. 이는 `video` 태그를 사용하면 된다! (mp4도 동영상 압축 진행)

`./src/components/BannerVideo.js`

```jsx
import React from 'react'
import video_webm from '../assets/banner-video.webm'
import video_mp4 from '../assets/banner-video.mp4'

function BannerVideo() {
  return (
    <div className="BannerVideo w-full h-screen overflow-hidden relative bg-texture">
      <div className="absolute h-screen w-full left-1/2">
        <video
          className="absolute translateX--1/2 h-screen max-w-none min-w-screen -z-1 bg-black min-w-full min-h-screen"
          autoPlay
          loop
          muted
        >
          <source src={video_webm} type="video/webm" />
          <source src={video_mp4} type="video/mp4" />
        </video>
      </div>
      {/* ... */}
    </div>
  )
}
```

위와 같이 처리하면 webm 유형이 지원되는 브라우저에서는 webm 파일이, 그렇지 않은 경우에는 mp4 파일이 실행된다. 만약 메인 콘텐츠 비디오에 렌더링을 해야할 경우 이미지 용량이 크다면 어떻게 하면 좋을까?

파일을 여러개의 조각으로 나눠서 실행하는 방법이나 화질을 줄인 비디오 상단에 그라데이션이나 불투명도 스타일을 부여(filter: blur나 작은 dot를 균일한 간격으로 채우는 등의 ui 가림처리 등을 활용)해서 화질 저하에 대한 리스크를 줄여보면 좋다.
