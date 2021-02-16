# 글로벌 스타일과 컴포넌트 폴더 구조

ImageZoom 컴포넌트를 마무리해보자.

한 컴포넌트에 스타일의 양이 많아지면 스타일(연결되는 곁다리성 코드들)과 주요 컴포넌트를 분리해야 한다.
이럴 때 가장 좋은 방법은 하나의 컴포넌트 파일로 만들지 않고 `ImagesZoom`을 디렉토리로 구성하여 중요한 코드는 Index.js에, 스타일 컴포넌트는 styles.js에 분리하여 넣으면 훨씬 코드를 깔끔하게 유지할 수 있다.

이렇게 하면 같은 스타일도 여러 컴포넌트에서 재사용이 가능하며 훨씬 효율적이다.

`/components/ImagesZoom/styles.js`

```jsx
import styled, { createGlobalStyle } from "styled-components";
import { CloseOutlined } from "@ant-design/icons";

export const Overlay = styled.div`
  position: fixed;
  z-index: 5000;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
`;

export const Header = styled.header`
  height: 44px;
  background: white;
  position: relative;
  padding: 0;
  text-align: center;
  & h1 {
    margin: 0;
    font-size: 17px;
    color: #777;
    line-height: 44px;
  }
`;

export const ClosdBtn = styled(CloseOutlined)`
  position: absolute;
  right: 0;
  top: 0;
  padding: 15px;
  line-height: 14px;
  cursor: pointer;
`;

export const SlickWrapper = styled.div`
  height: calc(100% - 44px);
  background: #090909;
`;

export const ImgWrapper = styled.div`
  padding: 32px;
  text-align: center;
  & img {
    margin: 0 auto;
    max-height: 750px;
  }
`;

export const Indicator = styled.div`
  text-align: center;
  & > div {
    width: 75px;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    background: #313131;
    display: inline-block;
    text-align: center;
    color: white;
    font-size: 15px;
  }
`;

export const Global = createGlobalStyle`
  .slick-slide {
    display: inline-block;
  }
`;
```

앞서 작업했던 styled.div는 지역스코프를 가진다. 이런 스타일은 모두 styled-components에서 겹치지않도록 번들링되어 렌더링된다. 그런데 기존 정적 class를 가진 태그들을 수정해야 할 때는 어떻게 해야할까?

현재 슬라이드를 동작시켜보면 스타일에 오류가 생긴다. 바로 slick-slide라는 이미 만들어진 태그에 스타일이 이미 포함되어 있기 때문이다. 이럴 때 `createGlobalStyle`이라는 글로벌 스타일을 사용한다. `createGlobalStyle`는 전역스코프를 가지며 기존 스타일을 오버라이드 한다. 따라서 필요에 따라 styled메서드와 createGlobalStyle를 섞어서 사용해야 한다.

이제 export 한 스타일 조각들을 ImagesZoom에 import한다.

`/components/ImagesZoom/index.js`

```jsx
import PropTypes from "prop-types";
import { useState } from "react";
import Slick from "react-slick";
import { Overlay, Header, ClosdBtn, SlickWrapper, ImgWrapper, Indicator, Global } from "./styles";

const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  return (
    <Overlay>
      <Global />
      <Header>
        <h1>상세 이미지</h1>
        <ClosdBtn onClick={onClose}>X</ClosdBtn>
      </Header>
      <SlickWrapper>
        <div>
          <Slick
            initialSlide={0}
            beforeChange={(slide) => setCurrentSlide(slide)}
            infinite
            arrows={false}
            slidesToShow={1}
            slidesToScroll={1}
          >
            {images.map((v) => (
              <ImgWrapper key={v.src}>
                <img src={v.src} alt={v.src} />
              </ImgWrapper>
            ))}
          </Slick>
          <Indicator>
            <div>
              {currentSlide + 1}
              {""}/{images.length}
            </div>
          </Indicator>
        </div>
      </SlickWrapper>
    </Overlay>
  );
};

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
```

훨씬 깔끔하게 만들어졌다.
