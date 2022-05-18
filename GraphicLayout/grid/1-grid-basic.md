## Grid 기본요소

Grid는 CSS 레이아웃의 끝판왕이라고 할 수 있다.
flex와 grid는 둘 다 레이아웃 배치에 사용되는데, 이 둘의 큰 차이점은 Flex는 한 방향 레이아웃 시스템(1차원)인 반면, grid는 두 방향(가로-세로) 레이아웃 시스템(2차원)이라는 점이다.

![](../../img/220517-1.png)

위와 같이 flex는 한 덩어리 안에서 가로, 세로 방향 중 한 방식을 결정하여 레이아웃을 짜는 반면 그리드는 한 덩어리 안에서 가로, 세로 방향을 모두 적용할 수 있어 활용할 수 있는 범위가 더 넓다.

그럼 grid가 flex를 대신할 수 있을까? 완전히 그렇진 않다. Flex 가 편한 방법이 있고, grid가 편한 방법이 있음. 따라서 둘 다 잘 알아야 한다! 보통 큰 골격 레이아웃은 grid로 세부 레이아웃은 Flex로 구현한다.

<aside>
✅ Grid는 IE에서 지원하지 않으므로 한국에서는 그림의 떡이다?
NoNo! IE 10, 11에서도 구버전 스펙(새 창)을 지원하기 때문에 귀찮지만 방법이 없는 것은 아님.
한계는 있지만 뭐가 다른지를 알아두고 대응하면 충분히 사용할 수 있다.

</aside>

그리드는 파이어폭스 개발자 도구에서 레이아웃을 명확하게 보여주는 기능을 가지므로, 해당 실습은 파이어폭스에서 진행한다.
![](../../img/220517-2.png)

### 용어 정리

Grid 레이아웃을 만들기 위한 기본적인 HTML 구조는 Flex와 마찬가지로 컨테이너와 아이템만 있으면 된다.

```html
<div class="container">
  <div class="item">A</div>
  <div class="item">B</div>
  <div class="item">C</div>
  <div class="item">D</div>
  <div class="item">E</div>
</div>
```

```css
.container {
  display: grid;
}
```

![](../../img/220518-1.png)

- 그리드 컨테이너(Grid Container)
  - 부모 요소인 div.container를 grid container(그리드 컨테이너)라고 부름
  - display: grid를 적용하는 grid의 전체 영역. grid 컨테이너 안의 요소들이 grid 규칙의 영향을 받아 정렬
- 그리드 아이템(Grid Item)
  - 자식 요소인 div.item들을 grid item(그리드 아이템)이라고 부름
  - grid 규칙에 의해 배치되는 요소
- 그리드 트랙(Grid Track)
  - grid의 행(Row) 또는 열(Column)
- 그리드 셀(Grid Cell)
  - grid의 한 칸을 가리킴 div 같은 실제 html 요소는 그리드 아이템, 이런 grid 아이템 하나가 들어가는 가상의 칸이라고 생각한다.
  - 위 그림에서 그리드 셀은 9개를 의미함
- 그리드 라인(Grid Line)
  - Grid 셀을 구분하는 선
- 그리드 번호(Grid Number)
  - Grid 라인의 각 번호
- 그리드 갭(Grid Gap)
  - Grid 셀 사이의 간격
- 그리드 영역(Grid Area)
  - Grid 라인으로 둘러싸인 사각형 영역으로 그리드 셀의

### 그리드 기본 형태

Grid도 Flex와 마찬가지로 Grid 컨테이너에 적용하는 속성과 Grid 아이템에 적용하는 속성으로 나뉜다.
Grid 레이아웃을 실습하기에 앞서 `default.css`가 기본 고정 스타일로 추가되는데, 여기에 아래 스타일이 Flex 대신에 추가된다고 보면 된다.

```css
.grid-container {
  padding: 10px;
  background: lightgray;
}
.grid-item {
  padding: 10px;
  border: 3px solid rgb(50, 50, 40);
  color: white;
  background: #ff6937;
}
```

- 그리드 형태 정의 : `grid-template-rows`, `grid-template-columns`

  - 컨테이너에 grid 트랙의 크리들을 지정해주는 속성, 여러단위를 사용할 수 있고 섞어 사용 가능함
  - `grid-template-columns`

    ```css
    .grid-container {
      display: grid;
      grid-template-columns: 100px 300px 200px;
    }
    ```

    위와 같은 스타일은 아래와 같은 결과를 도출한다.

    ![1열 100px, 2열 300px, 3열 200px로 배치된다.](../../img/220519-1.png)

    ```css
    .grid-container {
      display: grid;
      grid-template-columns: 1fr 1fr; /* fr: fraction, 비, 비율, 분수, 부분 */
    }
    ```

    위 스타일은 아래와 같은 결과를 도출한다.

    ![1:1 비율을 가진 컬럼 형성](../../img/220519-2.png)

    ```css
    .grid-container {
      display: grid;
      grid-template-columns: 1fr 500px 1fr;
    }
    ```

    위 스타일은 아래와 같은 결과를 도출한다.

    ```css
    .grid-container {
      display: grid;
      /* grid-template-columns: 1fr 1fr 1fr 1fr 1fr; */
      grid-template-columns: repeat(5, 1fr); /* 1fr을 5번 반복하겠다. */
    }
    ```

    같은 속성값이 여러번 반복되면 repeat 을 써서 단축하여 작성할 수 있다.

    ![1:1 비율을 가진 컬럼 형성](../../img/220519-3.png)

    ```css
    .grid-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr 2fr 1fr);
    }
    ```

    repeat에 복수개의 속성을 부여할 수 있다.

    ![1:2:1, 1:2:1, 1:2:1이 세 번 반복되어 노출](../../img/220519-4.png)

  - `grid-template-rows`
    - grid-template-columns에서 부여한 속성 모두 똑같이 사용 가능
    ```css
    .grid-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: 200px 200px 200px; /* rows 간 속성 */
    }
    ```
    위 속성은 아래와 같은 결과를 도출한다.
    ![200px씩 부여](../../img/220519-5.png)
    ```css
    .grid-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: 200px 200px; /* 200px 200px auto;와 같음*/
    }
    ```
    row가 3개일 때 2개에 대한 속성만 부여할 경우 나머지는 기본 간격(auto)만 가져간다.
    ![](../../img/220519-6.png)
    ```css
    .grid-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
    }
    ```
    위와 같이 설정하면 아래와 같은 결과를 도출, 왜일까?
    display: block;은 높이값을 따로 가지지않기 때문에 늘어나지 않음
    ![](../../img/220519-7.png)
    만약 꽉 채우고 싶다면 어떻게 해야할까?
    별도의 height 값을 부여하면 됨. 이때 별도로 `grid-template-rows`를 부여하지 않아도 `height`값만 부여되면 해당 row 간격은 자동으로 늘어남. 참고!
    ```css
    .grid-container {
      display: grid;
      heigh: 50vh; /* grid-template-rows 별도 부여없어도 알아서 늘어난다. */
    }
    ```
    ![](../../img/220519-8.png)
