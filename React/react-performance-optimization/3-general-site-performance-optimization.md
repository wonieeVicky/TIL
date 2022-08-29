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
