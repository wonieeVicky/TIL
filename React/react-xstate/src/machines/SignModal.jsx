import { useMachine } from "@xstate/react";
import { signMachine } from "./signMachine";

export const SignModal = () => {
  const [state, send, service] = useMachine(signMachine);
  const { value: signState, history } = state;
  const openState = signState !== "done" && !!history;
  const { isLoading: loadingGithub, mutate: signinGithub } =
    useSigninWithProvider("GITHUB", send);
  const { isLoading: loadingGoogle, mutate: signinGoogle } =
    useSigninWithProvider("GOOGLE", send);

  return (
    <Modal
      open={openState}
      hasCloseIcon
      onClose={() => {
        send("CLEAR");
      }}
    >
      <Modal.Trigger>
        <Button variant="outline" color="primary-500">
          로그인
        </Button>
      </Modal.Trigger>
      <Modal.Header>로그인</Modal.Header>
      <Modal.Body>
        {signState === "selection" && ( //selection 상태일 때에만 로그인 선택 UI 표현
          <Stack direction="vertical">
            <Button onClick={() => send("EMAIL")}>Email로 로그인</Button>
            <Button onClick={() => signinGithub()}>
              GitHub 계정으로 로그인
            </Button>
            <Button onClick={() => signinGoogle()}>
              Google 계정으로 로그인
            </Button>
          </Stack>
        )}
        {signState === "email" && (
          <EmailPasswordForm signMachine={service} signup={false} />
        )}
      </Modal.Body>
    </Modal>
  );
};
