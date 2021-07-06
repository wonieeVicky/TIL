# 스케줄링하기

### 스케줄러 설치하기

- 경매가 생성된 지 24시간 후에 낙찰자를 정한다.

  - 24시간 후에 낙찰자를 정하는 시스템을 구현해야 한다.
  - node-schedule 모듈 사용

    ```bash
    $ npm i node-schedule
    ```

### 스케줄링용 라우터 추가하기

- `routes/index.js`에 추가

  - schedule 모듈을 불러옴
  - scheduleJob 메서드로 일정 예약
  - 첫 번째 인수로 실행될 시각을 넣고, 두 번째 인수로 콜백 함수를 넣는다.
  - 가장 높은 입찰을 한 사람을 찾아 상품 모델의 낙찰자 아이디에 넣어준다.
  - 동시에, 낙찰자의 보유 자산을 낙찰 금액만큼 제외(sequelize.literal(컬럼-숫자)로 숫자 줄임)
  - 단점: 노드 기반으로 스케줄링 되므로, 노드가 종료되면 스케줄 예약도 같이 종료된다.
  - 서버가 어떤 에러로 종료될 지 예측하기 어려우므로 보완하기 위한 방법이 필요하다.

    ```jsx
    const express = require("express");
    const multer = require("multer");
    const path = require("path");
    const fs = require("fs");
    const schedule = require("node-schedule");

    const { Good, Auction, User, sequelize } = require("../models");
    const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
    const router = express.Router();

    // ...

    router.post("/good", isLoggedIn, upload.single("img"), async (req, res, next) => {
      try {
        const { name, price } = req.body;
        await Good.create({
          OwnerId: req.user.id,
          name,
          img: req.file.filename,
          price,
        });
        const end = new DATE();
        end.setDate(end.getDate() + 1); // 1. 종료일 지정
        // 2. 스케줄러 생성 - 끝날 때 어떻게 할지를 정한다.
        schedule.scheduleJob(end, async () => {
          // sequelize transaction으로 묶어준다.
          const t = await sequelize.transaction();
          try {
            const success = await Auction.findOne({
              where: { GoodId: good.id },
              order: [["bid", "DESC"]],
              transaction: t,
            });
            await Good.update(
              { SoldId: success.UserId },
              {
                where: { id: good.id },
                transaction: t,
              }
            );
            await User.update(
              {
                money: sequelize.literal(`money-${success.bid}`), // sequelize 문법으로 넣어준다.
              },
              { where: { id: success.UserId }, transaction: t }
            );
            await t.commit(); // 3가지 액션 모두 성공하면 전체 성공
          } catch (error) {
            await t.rollback(); // 3가지 액션 중 하나라도 실패하면 전체 롤백
          }
        });
        res.redirect("/");
      } catch (error) {
        console.error(error);
        next(error);
      }
    });

    // ...

    module.exports = router;
    ```
