import { useMachine } from "@xstate/react";
import { useEffect, useState } from "react";
import { fetchMachine } from "./machines/fetchMachine";

export default Join = () => {
  const [state, send] = useMachine(fetchMachine);
  // const [id, setId] = useState("");
  // const [password, setPassword] = useState("");
  const [invalidPassword, setInvalidPassword] = useState(false);
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

  const isDisabled = state.matches("loading") || invalidPassword;

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
      {state.matches("loading") && <p>Loading...</p>}
      {state.matches("resolved") && <p>회원가입에 성공했습니다.</p>}
      {state.matches("rejected") && <p>{error}</p>}
    </div>
  );
};
