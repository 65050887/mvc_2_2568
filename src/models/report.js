const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Report",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      rumour_id: { type: DataTypes.INTEGER, allowNull: false },
      report_type: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: { isIn: [["distorted", "incite", "fake"]] },
      },
      reported_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      tableName: "reports",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["user_id", "rumour_id"], // Requirement: cannot report same rumour twice by same user
        },
      ],
    }
  );
};
