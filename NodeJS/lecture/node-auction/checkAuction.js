const { Op } = require("Sequelize");
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
