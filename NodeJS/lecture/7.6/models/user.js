const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    // super.init(모델에 대한 정의, 모델에 대한 설정)
    return super.init(
      {
        // id는 알아서 넣어주므로 넣지 않아도 된다.
        name: {
          type: Sequelize.STRING(20),
          allowNull: false, // Not null
          unique: true, // 고유하게
        },
        age: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        married: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        comment: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        // 직접 구현해보았으나 timestamps 설정으로 자동 주입 가능
        created_at: {
          type: Sequelize.DATE, // DATETIME, MYSQL DATE -> Sequelize DateOnly
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        timestamps: false, // default true -> createdAt, updatedAt 자동 들어간다.
        underscored: false, // 자동으로 만들어주는 키들의 underscored 설정 - snake_case 사용 여부
        modelName: "User", // 모델 이름, 자바스크립트에서 사용한다.
        tableName: "users", // 테이블 이름 (모델이름이 Bird면 테이블 이름은 자동으로 birds로 저장된다.)
        paranoid: false, // soft delete 사용 설정: deletedAt 자동 포함 여부
        charset: "utf8",
        collate: "utf8_general_ci", // utf8mb4_general_ci 이모티콘 쓸 수 있음
      }
    );
  }

  static associate(db) {
    // User가 여러 개의 Comment를 가지며, User의 id를 Comment 테이블의 commenter 컬럼이 참조하고 있다.
    db.User.hasMany(db.Comment, { foreignKey: "commenter", sourceKey: "id" });
  }
};
