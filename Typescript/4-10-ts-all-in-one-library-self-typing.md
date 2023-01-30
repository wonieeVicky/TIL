## 라이브러리 직접 타이핑하기

### react-native-keyboard-aware-scrollview 직접 타이핑하기

install package

```bash
> npm i react-native react-native-keyboard-aware-scrollview
```

아래와 같은 react-native 코드가 있다고 하자

```tsx
import React, { FC, ReactNode } from "react";
import { Keyboard, StyleSheetProperties, TouchableWithoutFeedback } from "react-native";
// Error! @types/react-native-keyboard-aware-scroll-view 미존재
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const DismissKeyboardView: FC<{ children: ReactNode; style: StyleSheetProperties }> = ({ children, ...props }) => (
	{/* type Error */}
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <keyboardAwareScrollView {...props} style={props.style}>
      {children}
    </keyboardAwareScrollView>
  </TouchableWithoutFeedback>
);

export default DismissKeyboardView;
```

react-native-keyboard-aware-scroll-view 라이브러리의 경우 @types 파일이 존재하지 않으므로 해당 라이브러리에 대한 타이핑을 직접 해본다. 우선 해당 타입은 types 라는 경로 하위에 배치하도록 한다.

`types/react-native-keyboard-aware-scroll-view.d.ts`

```tsx
declare module "react-native-keyboard-aware-scroll-view" {
  import { Component } from "react";

  declare const KeyboardAwareScrollView: Component; // JSX 요소 형식 'KeyboardAwareScrollView'에 구문 또는 호출 시그니처가 없습니다.
  export { KeyboardAwareScrollView };
}
```

위와 같이 간단 작성 후 타입 에러를 살펴보면 JSX 타이핑이 잘못되었다는 에러가 발생한다.
올바른 타이핑을 위해 잘된 코드를 따오면 좋은데 상위 TouchableWithoutFeedback에서 그대로 가져와서 필요한 부분만 바꿔줌

`types/react-native-keyboard-aware-scroll-view.d.ts`

```tsx
declare module "react-native-keyboard-aware-scroll-view" {
  import { Component } from "react";

  class KeyboardAwareScrollViewComponent extends Component<ViewProps & { vicky: string }> {}
  class keyboardAwareScrollView extends KeyboardAwareScrollViewComponent {}

  export { KeyboardAwareScrollView };
}
```

아래와 같이 처리했더니 위 타입에러가 발생하지 않음. 그 하위로 사용하는 메서드들에 대한 타이핑을 진행해가면 된다.
