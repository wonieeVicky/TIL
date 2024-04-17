import { useMemo } from "react";
import { SigninModal } from "./SigninModal";
import { SignupModal } from "./SignupModal";
import { signMachineContext } from "../machines/signMachineContext";

const SignPage = (props) => {
  return (
    <signMachineContext.Provider>
      <SigninModal />
      <SignupModal />
    </signMachineContext.Provider>
  );
};

export default SignPage;
