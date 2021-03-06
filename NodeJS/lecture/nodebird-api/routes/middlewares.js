﻿const jwt = require("jsonwebtoken");
const slowDown = require("express-slow-down");

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent("로그인한 상태입니다.");
    res.redirect(`/?error=${message}`);
  }
};

exports.verifyToken = (req, res, next) => {
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      // 유효기간 초과
      return res.status(419).json({
        code: 419,
        message: "토큰이 만료되었습니다"
      });
    }
    return res.status(401).json({
      code: 401,
      message: "유효하지 않은 토큰입니다."
    });
  }
};

exports.apiLimiter = slowDown({
  windowMs: 60 * 1000, // 1분 간
  delayAfter: 10, // 10번만 요청 가능
  delayMs: 1000, // 요청 간 1초의 간격이 있다.
  onLimitReached(req, res, options) {
    res.status(429).json({
      code: 429,
      message: "1분에 10번만 요청할 수 있습니다."
    });
  }
});

exports.deprecated = (req, res) => {
  res.status(410).json({
    code: 410,
    message: "새로운 버전이 나왔으니 버전 업그레이드를 해주세요!"
  });
};
