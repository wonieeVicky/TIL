const Sequelize = require("sequelize");

module.exports = class Domain extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        host: {
          type: Sequelize.STRING(80),
          allowNull: false
        },
        type: {
          type: Sequelize.ENUM("free", "premium"), // free, premium 둘 중 하나만 쓸 수 있다.
          allowNull: false
        },
        clientSecret: {
          type: Sequelize.UUID, // Sequelize.STRING(36) 대신 UUID 포맷인지 확인하는 메서드를 사용
          allowNull: false
        }
      },
      {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: "Domain",
        tableName: "domains"
      }
    );
  }
  static associate(db) {
    db.Domain.belongsTo(db.User);
  }
};
