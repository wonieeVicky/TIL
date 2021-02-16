# 이미지 Carousel 구현하기(react-slick)

이미지 Carousel은 react-slick을 사용하여 구현한다.

```bash
$ npm i react-slick
```

그리고 해당 이미지 구현 컴포넌트는 Components 폴더 하위에 ImagesZoom폴더를 생성하여 하위 index.js에서 작업하는 구조로 가져간다. 곧 이유를 알게 된다!

```jsx
import PropTypes from "prop-types";
import { useState } from "react";
import Slick from "react-slick";
import styled from "styled-components";

// 1. styled-components
// 2. func``
const Overlay = styled.div``;
const Header = styled.header``;
const SlickWrapper = styled.div``;
const ImgWrapper = styled.div``;
const Indicator = styled.div``;

const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  return (
    <Overlay>
      <Header>
        <h1>상세 이미지</h1>
        <button onClick={onClose}>X</button>
      </Header>
      <SlickWrapper>
        <div>
          <Slick
            initialSlide={0}
            afterChange={(slide) => setCurrentSlide(slide)}
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

1. 슬라이더를 사용할 경우 해당 컴포넌트에 스타일이 복잡하게 포함되므로 이런 경우는 inline방식이 아닌 별도의 styled-components를 활용하는 것이 좋다. (스타일코드는 모두 git에 올리므로 따로 적지 않음!)
2. 보통 함수를 func(); 이런 방식으로 호출하는데, 사실 ` func``; ` 이렇게 해도 함수 호출이 가능하다. 실제 ` styled.div``; ` 구조로 되어있는 것도 사실 styled-components안에 `styled.div`라는 함수가 존재하는 것으로 함수 실행을 하는 것과 같다.
