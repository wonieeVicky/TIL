## SMIL 애니메이션

### SMIL 애니메이션의 기본적인 사용법

SMIL(Synchronized Multimedia Integration Language)는 SVG에서 애니메이션을 만들 때 사용하는 언어이다. 초기에 `deprecated`되었다가 취소되었음. IE 외에는 정상 지원되므로 없어질 가능성이 있음에도 알아두자. css 애니메이션이 처리하지 못하는 것을 SMIL로 만들 수 있다.

SMIL 애니메이션은 svg 태그 내 적용할 도형 내부에 `animate` 태그로 작업해준다.

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        margin: 0;
      }
    </style>
  </head>
  <body>
    <svg class="svg" viewBox="0 0 1000 1000">
      <rect x="10" y="10" width="20%" height="20%">
        <animate attributeName="x" dur="1s" to="700" repeatCount="1" fill="freeze"></animate>
      </rect>
    </svg>
  </body>
</html>
```

SMIL 속성

- attributeName: 바꿀 속성 이름
- dur: 얼마나 걸릴 건지
- to: 어디로 갈건지(목적지)
- repeatCount: 반복횟수(`indefinite` 무한반복을 의미)
- fill: freeze(애니메이션 끝난 상태로 멈춤)

![](../../img/220208-1.gif)

### SMIL 애니메이션 조작하기

SMIL 애니메이션도 조작할 수 있다. 사각형을 클릭했을 때 애니메이션이 일어나도록 클릭이벤트를 만들어보자

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        margin: 0;
      }
    </style>
  </head>
  <body>
    <svg class="svg" viewBox="0 0 1000 1000">
      <defs>
        <script>
          // 스크립트가 태그보다 앞서 있으므로 DOMContentLoaded로 처리해준다. window.addEventListener("DOMContentLoaded", () => { const
          rectElem = document.querySelector(".rect"); const aniElem = document.querySelector(".ani"); rectElem.addEventListener("click", ()
          => { aniElem.beginElement(); // 애니메이션 시작 }); });
        </script>
      </defs>

      <rect class="rect" x="10" y="10" width="20%" height="20%">
        <!-- begin: 언제 시작할지(indefinite 시작 X으로 설정) -->
        <animate class="ani" attributeName="x" dur="1s" to="700" repeatCount="1" fill="freeze" begin="indefinite"></animate>
      </rect>
    </svg>
  </body>
</html>
```

위와 같이하면 실제 사각형을 클릭했을 때 x축으로 700만큼 이동하는 애니메이션이 실행된다.
