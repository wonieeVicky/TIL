import React, { memo, useLayoutEffect, useState } from "react";

const Hooks = memo(({ number }) => {
  const [name, setName] = useState("");

  useLayoutEffect(() => {
    setName("vicky");
  }, []);

  return (
    <div>
      <div>안녕하세요. {name} 입니다.</div>
      <div>안녕하세요. {name} 입니다.</div>
      <div>안녕하세요. {name} 입니다.</div>
      <div>안녕하세요. {name} 입니다.</div>
      <div>안녕하세요. {name} 입니다.</div>
      <div>안녕하세요. {name} 입니다.</div>
      <div>안녕하세요. {name} 입니다.</div>
    </div>
  );
});

export default Hooks;
