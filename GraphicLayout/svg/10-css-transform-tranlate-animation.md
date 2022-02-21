## CSS Transform, Translate, Animation

### Transform

CSS Transform에 대해 좀 더 알아보자. CSS transform은 도형의 크기를 조절 혹은, 회전하거나 위치를 바꾸는 등의 변화를 담당한다. CSS3에서 추가된 기능으로 다양한 변형을 할 수 있다. transform의 기본값은 정중앙이고, 기준값을 자유자재로 변화를 줄 수 있기 때문에 사방으로 변화를 자유자재로 할 수 있는 것이다.

아래와 같은 마크업이 있다고 하자.

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        margin: 0;
      }
      .box-container {
        display: flex;
      }
      .box {
        width: 100px;
        height: 100px;
        background: rgba(255, 255, 0, 0.7);
        border: 2px solid black;
      }
    </style>
  </head>
  <body>
    <h1>CSS Transform</h1>
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minima illo hic quos qui voluptate suscipit quo
      perspiciatis neque officia cumque. Enim, eos debitis voluptatem ullam officia maiores vitae, ipsa tempore, facilis
      iure esse omnis perspiciatis reiciendis distinctio nobis vel perferendis! Necessitatibus molestiae a veniam aut
      pariatur maxime inventore deserunt. Odit consequuntur dolore ex magni atque sequi hic natus animi nemo officiis
      est laboriosam consequatur porro enim, vero quibusdam? Iure tenetur nihil sunt necessitatibus vitae numquam
      voluptatem deserunt recusandae pariatur voluptate quaerat, temporibus earum minima dolor suscipit obcaecati
      voluptatibus nobis iste voluptatum ipsum ratione? Minima quisquam eos provident fugiat blanditiis nulla?
    </p>
    <div class="box-container">
      <div class="box">A</div>
      <div class="box">B</div>
      <div class="box">C</div>
      <div class="box">D</div>
      <div class="box">E</div>
    </div>
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minima illo hic quos qui voluptate suscipit quo
      perspiciatis neque officia cumque. Enim, eos debitis voluptatem ullam officia maiores vitae, ipsa tempore, facilis
      iure esse omnis perspiciatis reiciendis distinctio nobis vel perferendis! Necessitatibus molestiae a veniam aut
      pariatur maxime inventore deserunt. Odit consequuntur dolore ex magni atque sequi hic natus animi nemo officiis
      est laboriosam consequatur porro enim, vero quibusdam? Iure tenetur nihil sunt necessitatibus vitae numquam
      voluptatem deserunt recusandae pariatur voluptate quaerat, temporibus earum minima dolor suscipit obcaecati
      voluptatibus nobis iste voluptatum ipsum ratione? Minima quisquam eos provident fugiat blanditiis nulla?
    </p>
  </body>
</html>
```

위 마크업은 아래의 결과를 보여준다.

![](../../img/220221-1.png)

여기에서 일반적으로 도형에 마우스 hover 시 A ~ E 도형에 사이즈 변형을 한다고 할 때 아래처럼 구현할 수 있다.

```css
.box:hover {
  width: 200px;
  height: 200px;
}
```

![](../../img/220221-2.png)

이처럼 기본적으로 width, height 값을 변경하면 나머지 도형이 좌우로 밀리는 현상이 나타난다.
이를 transform으로 효과를 바꾸면 아래와 같다.

```css
.box:hover {
  transform: scale(2);
}
```

![](../../img/220221-3.png)

transform은 변경 중심이 center이기 때문에 좌우 도형에 영향을 미치지않도록 되어있으므로 훨씬 더 간단하게 레이아웃에 변형을 줄 수 있다. 브라우저가 reflow할 때 연산의 값을 해당 마크업에만 적용하므로 훨씬 더 좋은 성능을 가진다.

또한, 여러개의 변형을 값으로 줄 수도 있다.

```css
.box:hover {
  transform: scale(2) rotate(15deg);
}
```

![](../../img/220221-4.png)

비틀기도 가능하다.

```css
.box:hover {
  transform: skew(30deg); /* X축 비틀기 */
}
```

![](../../img/220221-5.png)

```css
.box:hover {
  transform: skewY(30deg); /* Y축 비틀기, 음수로 값을 넣으면 방향이 반대로 설정된다. */
}
```

![](../../img/220221-6.png)

도형의 이동은 translate로 변형할 수 있다.

```css
.box:hover {
  transform: translate(30px, 10px);
}
```

![](../../img/220221-7.png)

```css
.box:hover {
  transform: translateX(-30px) translateY(-10px);
}
```

![](../../img/220221-8.png)

`scale` 값을 변형할 때 `transform-origin` 속성으로 기준점을 다양하게 설정할 수 있다.

```css
.box:hover {
  transform: scale(1.5);
  transform-origin: right top; /* 숫자로도 부여할 수 있음 */
  /* left top */
  /* transform-origin: 0% 0%; */
  /* right bottom */
  /* transform-origin: 100% 100%; */
  /* center center */
  /* transform-origin: 50% 50%; */
}
```

![](../../img/220221-9.png)

```css
.box:hover {
  transform-origin: 100% 100%;
  transform: rotate(15deg);
}
```

![](../../img/220221-10.png)

위와 같이 bottom right를 기준으로 15도 회전하는 효과를 도형에 부여하면 위와 같이 변경시킬수도 있다.
