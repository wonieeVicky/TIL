import { Text, TextInput, Button, Modal } from "@jdesignlab/react";
import { useForm } from "react-hook-form";
import { useActor } from "@xstate/react";
import { Flex } from "../styles/Profile";
import { useAccountEmailWithPassword } from "../hooks/useAccountEmailWithPassword";
import { useCreateUserMutation } from "../hooks/useCreateUserMutation";

export const EmailPasswordForm = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signMachine, signup } = props;
  const [, refSend] = useActor(signMachine);
  const { mutate: createUser } = useCreateUserMutation();
  const { mutate: registry, isLoading } = useAccountEmailWithPassword(
    signup,
    refSend,
    (uid, email) => {
      createUser({ uid, email });
    }
  );

  return (
    <form
      onSubmit={handleSubmit((userInfo) => {
        registry(userInfo);
      })}
    >
      <TextInput
        {...register("email", {
          required: "이메일을 입력해주세요.",
          pattern: {
            value: /[a-z0-9]+@[a-z]+.[a-z]{2,3}/,
            message: "이메일 형식에 맞지 않습니다.",
          },
        })}
        size="md"
        clearable
      >
        <TextInput.Label>Email</TextInput.Label>
      </TextInput>
      {errors.email && <Text color="red-base">{errors.email.message}</Text>}
      <TextInput
        {...register("password", {
          required: "비밀번호를 입력해주세요.",
          minLength: {
            message: "비밀번호는 최소 8자 이상으로 입력해주세요.",
            value: 8,
          },
        })}
        size="md"
        type="password"
        clearable
      >
        <TextInput.Label>Password</TextInput.Label>
      </TextInput>
      {errors.password && (
        <Text color="red-base">{errors.password.message}</Text>
      )}
      <Modal.Footer>
        <Flex>
          {!signup && (
            <Button
              variant="outline"
              color="red-lighten2"
              onClick={() => {
                refSend({ type: "CLEAR" });
              }}
            >
              뒤로가기
            </Button>
          )}
          <Button
            type="submit"
            variant="outline"
            color="primary-500"
            disabled={isLoading}
          >
            {signup ? "회원가입" : "로그인"}
          </Button>
        </Flex>
      </Modal.Footer>
    </form>
  );
};
