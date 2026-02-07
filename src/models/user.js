const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      role: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "general", // general | verifier
        validate: { isIn: [["general", "verifier"]] },
      },
    },
    {
      tableName: "users",
      timestamps: true,
      underscored: true,
    }
  );
};
