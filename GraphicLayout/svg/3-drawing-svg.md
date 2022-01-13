## SVG 그리기

### 기본도형 그리기

데이터를 시각화할 떄 기본 도형들을 사용하므로 svg로 기본 도형을 그리는 방법을 알아야 한다. 또한 export 된 svg 파일의 버그를 개선할 때에도 이러한 기본지식이 큰 도움이 된다.

먼저 사각형을 그려본다

![](../../img/220113-1.png)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>SVG</title>
    <style>
      .shapes {
        width: 600px;
        height: 400px;
        background: #ddd;
      }
      rect {
        fill: orange;
        stroke: dodgerblue;
        stroke-width: 10; /* px 안써도 자동으로 들어간다. */
      }
    </style>
  </head>
  <body>
    <svg class="shapes">
      <!-- <rect x="10" y="20" width="200" height="100"></rect> -->
      <rect x="10" y="20" width="200" height="100" />
      <!-- rx, ry: 모서리 둥근 정도 -->
      <rect x="50" y="170" rx="10" ry="10" width="100" height="100" />
    </svg>
  </body>
</html>
```

원과 타원은 각각 circle과 ellipse 태그로 구현할 수 있다.

![](../../img/220113-2.png)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>SVG</title>
    <style>
      .shapes {
        width: 600px;
        height: 400px;
        background: #ddd;
      }
      ellipse {
        fill: #fff000; /* tag 스타일의 green이 아닌 #ff0으로 적용. style css에 우선권이 있다. */
      }
    </style>
  </head>
  <body>
    <svg class="shapes">
      <!-- cx, cy: 원의 중앙 좌표, r: 반지름 -->
      <circle cx="350" cy="250" r="30" />
      <!-- 타원: ellipse, cx, cy 원의 중앙 좌표, rx: 가로방향 반지름, ry: 세로방향 반지름 -->
      <ellipse cx="200" cy="200" rx="100" ry="50" fill="red" stroke="green" stroke-width="20" />
    </svg>
  </body>
</html>
```

사진을 보면 `ellipse` 태그 즉, 타원형의 경우 배경이 `#fff000`이 적용되어있는 것을 볼 수 있다. 이는 tag 안의 `green` 값보다 css 값이 더 우선권을 가진다는 것을 의미한다.

### 직선 그리기

직선은 아래와 같이 그릴 수 있다.

![](../../img/220113-3.png)

```html
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <svg class="shapes">
      <!-- 직선: line, x1: 선이 시작하는 x 위치, x2: 선이 끝나는 x 위치, y1: 선이 시작하는 y 위치, y2: 선이 끝나는 y 위치, -->
      <line x1="10" x2="400" y1="30" y2="300" stroke="blue" stroke-width="20" />
    </svg>
  </body>
</html>
```

직선을 잇는 도형은 `polyline`과 `polygon`으로 그릴 수 있는데, 이 둘의 차이는 시작점과 끝점이 이어지는 지에 대한 여부이다.

![](../../img/220113-4.png)

```html
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <svg class="shapes">
      <!-- 잇는 직선: polyline, x 시작점, y 시작점, x 끝점, y 끝점 : 끝점이 시작점과 연결되지 않고 멈춰진다. -->
      <polyline points="10 10, 200 100, 150 300" stroke="red" stroke-width="10" />
      <!-- 다각형: polygon, x 시작점, y 시작점, x 끝점, y 끝점, : 끝점이 시작점과 연결된다.  -->
      <polygon points="200 300, 300 200, 400 300" stroke="red" stroke-width="10" />
    </svg>
  </body>
</html>
```

위 `polyline`은 끝점과 시작점이 연결되지 않고 끝나는 반면 `polygon`은 끝점과 시작점이 연결되어 3면이 균일한 stroke를 가지게 된다.
