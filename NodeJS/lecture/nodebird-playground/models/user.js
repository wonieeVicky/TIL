const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: Sequelize.STRING(40),
          allowNull: true, // null이 두 개여도 각자의 고유한 값으로 본다.
          unique: true,
        },
        nick: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100), // 비밀번호 hash화 되므로 100자로 둔다.
          allowNull: true, // 비밀번호 Null? - SNS 로그인 시
        },
        provider: {
          type: Sequelize.STRING(10),
          allowNull: false,
          defaultValue: "local",
        },
        snsId: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true, // createdAt, updatedAt 기록된다.
        underscored: false,
        modelName: "User",
        tableName: "users",
        paranoid: true, // deletedAt 사용
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.belongsToMany(db.User, { foreignKey: "followingId", as: "Followers" });
  }
};
