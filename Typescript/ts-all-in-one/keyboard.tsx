import React, { FC, ReactNode } from "react";
import { Keyboard, StyleSheetProperties, TouchableWithoutFeedback } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const DismissKeyboardView: FC<{ children: ReactNode; style: StyleSheetProperties }> = ({ children, ...props }) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAwareScrollView {...props} style={props.style} vicky={true}>
      {children}
    </KeyboardAwareScrollView>
  </TouchableWithoutFeedback>
);

export default DismissKeyboardView;
