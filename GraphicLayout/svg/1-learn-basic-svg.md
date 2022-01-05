## SVG 개념과 기본적인 사용법

---

### SVG란

확장 가능한 벡터 그래픽(Scalable Vector Graphics) - 점과 점 사이의 계산을 이용한다.
XML 기반의 2차원 그래픽
아이콘, 이미지, 그래프, 사용자 인터페이스(UI) 등에 널리 사용됨
DOM의 일부로 각 개체별로 HTML 엘리먼트가 추가됨
벡터이기 때문에 이미지 크기에 상관없이 선명하게 유지되며, 모양이 많이 복잡하지 않으면 파일 사이즈도 작다.
CSS와 자바스크립트를 이용해 조작이 가능
크기(width, height)가 큰 이미지 표현에 유리
모양이 복잡하고 개체수가 많을 수록 성능이 떨어진다. (웹에서 아이콘 등에 많이 사용)

### 캔버스(Canvas)란

비트맵 기반 그래픽 - 픽셀 기반
이미지나 비디오의 픽셀 조작, 게임, 퍼포먼스가 중요한 이미지 조작 등에 쓰임
단일 태그 `<canvas>`로 표현
자바스크립트를 이용해 조작은 가능하나 CSS는 불가
픽셀 단위의 조작이 가능하여 일반 HTML 엘리먼트로는 불가능한 다양한 표현이 가능
조수준(low-level) API로 코딩량이 많고 까다로움
크기가 커질수록 성능이 떨어짐

### HTML 문서에 SVG를 넣는 여러가지 방법들

- `<img>` 태그
  ```html
  <html>
    <head></head>
    <body>
      <img src="images/studiomeal.svg" alt="" />
    </body>
  </html>
  ```
- CSS Background
  ```html
  <html>
    <head>
      <style>
        .svg {
        	width: 300px;
        	height: 300p[x;
        	background: url('images/studiomeal.svg') no-repeat 0 0;
        }
      </style>
    </head>
    <body>
      <div class="svg"></div>
    </body>
  </html>
  ```
- SVG 요소들을 직접 inline으로 삽입
  ```html
  <html>
    <head> </head>
    <body>
      <?xml version="1.0" encoding="utf-8"?>
      <!-- Generator: Adobe Illustrator 25.4.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 30 30"
        style="enable-background:new 0 0 30 30;"
        xml:space="preserve"
      >
        <style type="text/css">
          .st0 {
            fill: #1312c1;
          }
          .st1 {
            fill: #0154fa;
          }
          .st2 {
            fill: #14bff3;
          }
          .st3 {
            fill-rule: evenodd;
            clip-rule: evenodd;
            fill: #ffffff;
          }
          .st4 {
            clip-path: url(#SVGID_00000073711108235787354850000012741412802206222211_);
          }
          .st5 {
            clip-path: url(#SVGID_00000129897060068873308140000009211469482576468654_);
            fill: #131336;
          }
          .st6 {
            clip-path: url(#SVGID_00000132060944647183492700000011612699060816431803_);
          }
          .st7 {
            clip-path: url(#SVGID_00000134231838495488880700000010313422575546805939_);
            fill: #131336;
          }
          .st8 {
            clip-path: url(#SVGID_00000144315411763205316030000006486093183677511340_);
          }
          .st9 {
            clip-path: url(#SVGID_00000011726791836818404150000016593319191945246869_);
            fill: #131336;
          }
          .st10 {
            clip-path: url(#SVGID_00000046318173597030001130000000177777597488076203_);
          }
          .st11 {
            clip-path: url(#SVGID_00000164481267360167934340000004307499473432645550_);
            fill: #131336;
          }
          .st12 {
            clip-path: url(#SVGID_00000065076619794031716180000016289340212593702810_);
          }
          .st13 {
            clip-path: url(#SVGID_00000152945629593378166880000006717472535433071234_);
            fill: #131336;
          }
          .st14 {
            clip-path: url(#SVGID_00000022546094002964378640000002001954288482484919_);
          }
          .st15 {
            clip-path: url(#SVGID_00000110459214410274047190000016122648009429263757_);
            fill: #131336;
          }
        </style>
        <g>
          <path class="st0" d="M15,0C6.7,0,0,6.7,0,15c0,2.1,0.4,4.1,1.2,5.9L28,7.5C25.4,3,20.6,0,15,0z" />
          <path class="st1" d="M30,15c0-2.7-0.7-5.3-2-7.5L13.1,15L28,22.5C29.3,20.3,30,17.7,30,15z" />
          <path class="st2" d="M28,22.5L13.1,15L1.2,20.9C3.5,26.3,8.8,30,15,30C20.6,30,25.4,27,28,22.5z" />
        </g>
        <g id="page">
          <g id="detail-activation-button" transform="translate(-1627.000000, -299.000000)">
            <g id="상단" transform="translate(250.000000, 0.000000)">
              <g id="Default-button" transform="translate(1306.000000, 282.000000)">
                <path
                  id="Fill-1"
                  class="st3"
                  d="M92.8,30.5c1.1,0.6,1.1,2.3,0,2.9L88,36.2L83.2,39c-1.1,0.6-2.5-0.2-2.5-1.5V32v-5.6
  								c0-1.3,1.4-2.1,2.5-1.5l4.8,2.8L92.8,30.5z"
                />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </body>
  </html>
  ```
- `<object>` 태그
  ```html
  <html>
    <head></head>
    <body>
      <object data="images/face.svg" type="image/svg+xml"></object>
    </body>
  </html>
  ```
  이미지로 넣었을 때와 달리 실제 돔 생성 시 해당 `svg` 요소들이 `html`에 그대로 삽입된다.
