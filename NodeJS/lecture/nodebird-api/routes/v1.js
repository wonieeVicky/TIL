﻿const express = require("express");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("./middlewares");
const { Domain, User } = require("../models");

const router = express.Router();

// 토큰 발급
router.post("/token", async (req, res) => {
  const { clientSecret } = req.body;
  try {
    const domain = await Domain.findOne({
      where: { clientSecret },
      include: {
        model: User,
        attribute: ["nick", "id"]
      }
    });
    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: "등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요"
      });
    }
    const token = jwt.sign(
      {
        id: domain.User.id,
        nick: domain.User.nick
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1m", // 토큰 유효기간 설정: 1분
        issuer: "nodebird" // 발급 주체 도장
      }
    );
    return res.json({
      code: 200,
      message: "토큰이 발급되었습니다.",
      token
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      code: 500,
      message: "서버 에러"
    });
  }
});

// 토큰 발급 테스트
router.get("/test", verifyToken, (req, res) => {
  res.json(req.decoded);
});

module.exports = router;
