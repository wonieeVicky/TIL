declare module "react-native-keyboard-aware-scroll-view" {
  import { Component } from "react";

  class KeyboardAwareScrollViewComponent extends Component<ViewProps & { vicky: string }> {}
  class keyboardAwareScrollView extends KeyboardAwareScrollViewComponent {}

  export { KeyboardAwareScrollView };
}
