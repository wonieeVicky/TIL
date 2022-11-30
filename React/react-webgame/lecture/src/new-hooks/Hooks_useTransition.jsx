import React, { useCallback, useState, useEffect, useTransition } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const [result, setResult] = useState("");
  const [loading, startTransition] = useTransition();

  const onChange = useCallback((e) => {
    setName(e.target.value);
    startTransition(() => {
      setResult(e.target.value + "의 결과");
    });
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, []);

  console.log("loading", loading);

  return (
    <div className="App">
      <div>{count}</div>
      {loading ? <div>로딩중....</div> : null}
      <input value={name} onChange={onChange} />

      {name
        ? Array(1000)
            .fill()
            .map((v, i) => <div key={i}>{result}</div>)
        : null}
    </div>
  );
}
