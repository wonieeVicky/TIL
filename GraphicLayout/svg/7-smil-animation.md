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
