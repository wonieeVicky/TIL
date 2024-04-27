import { useMachine } from "@xstate/react";
import { useEffect, useState } from "react";
import { fetchMachine } from "./machines/fetchMachine";

export default Join = () => {
  const [state, send] = useMachine(fetchMachine);
  // const [id, setId] = useState("");
  // const [password, setPassword] = useState("");
  // const [invalidPassword, setInvalidPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    send("FETCHING");
  };

  useEffect(() => {
    if (state.matches("LOADING")) {
      const doFetch = async () => {
        if (error) {
          setError(null);
        }
        try {
          await signUp({ id, password });
          send("SUCCESS");
        } catch (e) {
          setError(e);
          send("FAILURE");
        }
      };
      doFetch();
    }
  }, [state]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   send("FETCHING");
  //   if (error) {
  //     setError(null);
  //   }
  //   try {
  //     await signUp({ id, password });
  //     send("SUCCESS");
  //   } catch (e) {
  //     setError(e);
  //     send("FAILURE");
  //   }
  // };

  const handleChangeId = (e) =>
    send("UPDATE_ID", { data: { id: e.target.value } });

  const handleChangePassword = (e) => {
    const password = e.target.value;
    setInvalidPassword(password.length > 8);
    send("UPDATE_ID", { data: { password } });
  };

  // const isDisabled = state.matches("loading") || invalidPassword;
  // disabled 조건 추가: machine이 다음 transition으로 변화했는지를 판단
  // const isDisabled = state.matches("loading") || fetchMachine.transition(state, "FETCHING").changed;
  // const isDisabled = [{ idle: "errors" }, "loading"].some(state.matches);
  // 에러에 대한 구분을 id.errors와 password.errors로 세분화
  const isDisabled = [
    { idle: "id.errors" },
    { idle: "password.errors" },
    "loading",
  ].some(state.matches);

  return (
    <div className="app">
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit}>
        <label>id</label>
        <input id="id" onChange={handleChangeId} />
        <label htmlFor={"password"}>password</label>
        <input id="password" type="password" onChange={handleChangePassword} />
        <button disabled={isDisabled} type="submit">
          OK
        </button>
      </form>
      {/* 에러는 아래와 같이 추가 */}
      {state.matches("idle.id.errors") && (
        <>
          {state.matches("idle.id.errors.empty") && (
            <div>아이디 값이 없습니다.</div>
          )}
        </>
      )}
      {state.matches("idle.password.errors") && (
        <>
          {state.matches("idle.password.errors.tooShort") && (
            <div>비밀번호는 8자 이상이어야 합니다.</div>
          )}
          {state.matches("idle.password.errors.empty") && (
            <div>비밀번호 값이 없습니다.</div>
          )}
        </>
      )}
    </div>
  );
};
