import React, { useCallback, useState, useEffect, useDeferredValue, useMemo } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const deferredName = useDeferredValue(name);
  const result = useMemo(() => deferredName + "의 결과", [deferredName]);

  const onChange = useCallback((e) => {
    setName(e.target.value);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, []);

  console.log("render", deferredName);

  return (
    <div className="App">
      <div>{count}</div>
      <input value={name} onChange={onChange} />

      {deferredName
        ? Array(1000)
            .fill()
            .map((v, i) => <div key={i}>{result}</div>)
        : null}
    </div>
  );
}
