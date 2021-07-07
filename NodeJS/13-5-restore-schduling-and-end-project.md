# 스케줄링 복구 및 프로젝트 마무리

### 서버 시작 시 이전 경매 체크하기

- 서버가 시작될 떄 경매 후 24시간이 지났지만 낙찰자가 없는 경매를 찾아 낙찰자 지정

  - `checkAuction.js` 작성 후

    ```jsx
    const { Op } = require("Sequilize");
    const schedule = require("node-schedule");
    const { Good, Auction, User, sequelize } = require("./models");

    module.exports = async () => {
      console.log("checkAuction");
      try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); // 어제 시간
        // 어제보다 더 먼저 생성되었으나 낙찰되지 않은 상품(서버에러로 인한 미처리 낙찰상품 낙찰 처리 코드)
        const targets = await Good.findAll({
          where: {
            SoldId: null,
            createdAt: { [Op.lte]: yesterday },
          },
        });
        targets.forEach(async (target) => {
          const t = await sequelize.transaction();
          try {
            const success = await Auction.findOne({
              where: { GoodId: target.id },
              order: [["bid", "DESC"]],
              transaction: t,
            });
            await Good.update({ SoldId: success.UserId }, { where: { id: target.id }, transaction: t });
            await User.update(
              {
                money: sequelize.literal(`money - ${success.bid}`),
              },
              {
                where: { id: success.UserId },
                transaction: t,
              }
            );
            await t.commit();
          } catch (error) {
            await t.rollback();
          }
        });

        // 24시간이 지나지 않은 상품은 스케줄링 다시 시켜준다.
        const unsold = await Good.findAll({
          where: {
            SoldId: null,
            createdAt: { [Op.gt]: yesterday },
          },
        });
        unsold.forEach((target) => {
          const end = new Date(unsold.createdAt);
          end.setDate(end.getDate() + 1);
          schedule.scheduleJob(end, async () => {
            const t = await sequelize.transaction();
            try {
              const success = await Auction.findOne({
                where: { GoodId: target.id },
                order: [["bid", "DESC"]],
                transaction: t,
              });
              await Good.update({ SoldId: success.UserId }, { where: { id: target.id }, transaction: t });
              await User.update(
                {
                  money: sequelize.literal(`money - ${success.bid}`),
                },
                {
                  where: { id: success.UserId },
                  transaction: t,
                }
              );
              await t.commit();
            } catch (error) {
              await t.rollback();
            }
          });
        });
      } catch (error) {
        console.error(error);
      }
    };
    ```

  - `app.js`에 연결

    ```jsx
    // ..
    const checkAuction = require("./checkAuction");

    const app = express();
    passportConfig();
    checkAuction(); // 서버 시작 시 복구코드
    // ..
    ```

- 24시간을 기다리면 낙찰된다.
  - 서버가 계속 켜져 있어야 한다.
  - 빠른 테스트를 위해 시간을 단축해서 해본다.

### 낙찰 내역 보기 구현하기

- `GET /list` 라우터 작성 후

  ```jsx
  // ..
  router.get("/list", isLoggedIn, async (req, res, next) => {
    try {
      const goods = await Good.findAll({
        where: { SoldId: req.user.id },
        include: { model: Auction },
        order: [[{ model: Auction }, "bid", "DESC"]],
      });
      res.render("list", { title: "낙찰 목록 - NodeAuction", goods });
    } catch (error) {
      console.error(error);
      next(error);
    }
  });

  module.exports = router;
  ```

- `views/list.html` 작성 및 `views/layout.html` 수정

  ```jsx
  {% extends 'layout.html' %} {% block content %}
  <div class="timeline">
    <h2>경매 낙찰 목록</h2>
    <table id="good-list">
      <tr>
        <th>상품명</th>
        <th>사진</th>
        <th>낙찰가</th>
      </tr>
      {% for good in goods %}
      <tr>
        <td>{{good.name}}</td>
        <td>
          <img src="/img/{{good.img}}" />
        </td>
        <td>{{good.Auctions[0].bid}}</td>
      </tr>
      {% endfor %}
    </table>
  </div>
  {% endblock %}
  ```

### 낙찰 내역 보기

- 낙찰자의 계정으로 로그인 후 http://localhost:8010/list에서 낙찰 목록 확인 가능

  ![](../img/210706-1.png)

### 운영체제의 스케줄러

- node-schedule로 등록한 스케줄은 노드 서버가 종료될 때 같이 종료된다.
  - 운영체제의 스케줄러를 사용하는 것이 좋다.
    - 컴퓨터가 on/off 되기 전까지는 계속 돌아간다.
  - 윈도우에서는 `schtasks`, 맥과 리눅스에서는 `cron` 추천
  - 노드에서는 이 두 명령어를 `child_process`를 통해 호출할 수 있다.
