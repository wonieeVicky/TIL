## SVG 효과

### 그라디언트

계속해서 `svg`에서 그라디언트를 쓰는 방법에 대해 알아보자.
이번에는 object 태그를 이용해 `svg` 파일을 불러와서 적용해본다.

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .svg-obj {
        /* 가운데 정렬 */
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 200px;
        margin: auto;
      }
    </style>
  </head>
  <body>
    <object class="svg-obj" data="images/face_hair.svg" type="image/svg+xml"></object>
  </body>
</html>
```

위 `face_hair.svg` 파일에 스타일을 부여하기 위해 직접 해당 svg 파일을 수정해보도록 한다.

`images/face_hair.svg`

![](../../img/220118-1.png)

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 571 625.5">
  <circle
    cx="286.5"
    cy="354.5"
    r="251"
    stroke-width="40"
    fill="none"
    stroke="#000"
    stroke-miterlimit="10"
  />
  <circle cx="175" cy="380.5" r="42.5" />
  <circle cx="397" cy="380.5" r="42.5" />
  <path
    d="M422 476.16a181.3 181.3 0 0 1-135.48 60.59H286a181.3 181.3 0 0 1-135.48-60.59"
    stroke-width="30"
    fill="none"
    stroke="#000"
    stroke-miterlimit="10"
  />
  <path
    d="M428.5 75a164.06 164.06 0 0 0-35.68 3.9C376.86 33.64 317 0 245.5 0 162.57 0 95.22 45.3 94 101.49c-55.71 19.82-94 61.19-94 109C0 277.6 75.44 332 168.5 332c62 0 116.14-24.14 145.41-60.09C339.87 302.3 381.53 322 428.5 322c78.7 0 142.5-55.29 142.5-123.5S507.2 75 428.5 75z"
  />
</svg>
```

위 svg 파일에서 머리 부분에 그라디언트 효과를 주고싶다면
머리 부분 태그인 가장 마지막 `path` 태그에 .hair 클래스를 붙여 작업하도록 해볼 수 있다.

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 571 625.5">
  <defs>
    <!-- 참조할 요소를 defs에 담는다 -->
    <!-- linearGradient: 직선, radialGradient: 원형 -->
    <linearGradient id="hair-color">
      <!-- offset: 위치(그라디언트 위치) -->
      <stop offset="0%" stop-color="yellow" />
      <stop offset="50%" stop-color="hotpink" />
      <stop offset="100%" stop-color="deepskyblue" />
    </linearGradient>
    <style>
      <![CDATA[
      .hair {
        fill: url('#hair-color'); /* fill의 url 내부로 연결해준다. */
      }
      ]]>
    </style>
  </defs>
  <circle
    cx="286.5"
    cy="354.5"
    r="251"
    stroke-width="40"
    fill="none"
    stroke="#000"
    stroke-miterlimit="10"
  />
  <circle cx="175" cy="380.5" r="42.5" />
  <circle cx="397" cy="380.5" r="42.5" />
  <path
    d="M422 476.16a181.3 181.3 0 0 1-135.48 60.59H286a181.3 181.3 0 0 1-135.48-60.59"
    stroke-width="30"
    fill="none"
    stroke="#000"
    stroke-miterlimit="10"
  />
  <path
    class="hair"
    d="M428.5 75a164.06 164.06 0 0 0-35.68 3.9C376.86 33.64 317 0 245.5 0 162.57 0 95.22 45.3 94 101.49c-55.71 19.82-94 61.19-94 109C0 277.6 75.44 332 168.5 332c62 0 116.14-24.14 145.41-60.09C339.87 302.3 381.53 322 428.5 322c78.7 0 142.5-55.29 142.5-123.5S507.2 75 428.5 75z"
  />
</svg>
```

먼저 그라디언트에 대한 설정은 `defs` 태그 안에 설정한다.
구현하고자 하는 그라디언트 스타일(옵션)에 해당하는 태그(`linearGradient`(직선), 이 밖에도 `radialGradient`(원형)이 있음)로 감싼 뒤 변경 지점을 `stop` 태그로 분리하여 `offset`과 `stop-color` 속성으로 그라디언트 색을 지정해준다. 이렇게 만들어진 `#hair-color`그라데이션 스타일을 `.hair` path 태그에 연결해주면 되는데, 이 스타일 속성 또한 `defs` 태그 내 style 태그로 넣어주며, `fill` 속성에 `url` 값으로 `linearGradient`의 `id`값을 연결해주면 잘 적용된다.

![](../../img/220118-2.png)
