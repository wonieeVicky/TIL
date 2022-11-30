import React, { Component } from "react";
import Lotto from "./src/lotto/Lotto";
import RSP from "./src/rock-paper-scissors/RSP";
import NumberBaseball from "./src/number-baseball/NumberBaseball";
import NewHooks from "./src/new-hooks/Hooks";
import { useLocation, useNavigate, Routes, Route } from "react-router";

const GameMatcher = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let urlSearchParams = new URLSearchParams(location.search.slice(1));
  console.log(urlSearchParams.get("hello"));
  console.log(urlSearchParams.get("page"));
  return (
    <Routes>
      <Route path="number-baseball" element={<NumberBaseball />} />
      <Route path="rock-scissors-paper" element={<RSP />} />
      <Route path="lotto-generator" element={<Lotto />} />
      <Route path="new-hooks" element={<NewHooks />} />
      <Route path="*" element={<div>일치하는 게임이 없습니다.</div>} />
    </Routes>
  );
};

export default GameMatcher;
