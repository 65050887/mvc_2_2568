const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Rumour",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

      // Requirement: 8 digits, first digit not 0 (validate in controller too)
      rumour_code: {
        type: DataTypes.STRING(8),
        allowNull: false,
        unique: true,
      },

      title: { type: DataTypes.STRING(200), allowNull: false },
      source: { type: DataTypes.STRING(200), allowNull: false },

      credibility_score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0, max: 100 },
      },

      status: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "normal", // normal | panic
        validate: { isIn: [["normal", "panic"]] },
      },

      // For "verified then cannot report"
      verified_status: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "unknown", // unknown | true | false
        validate: { isIn: [["unknown", "true", "false"]] },
      },
      verified_at: { type: DataTypes.DATE, allowNull: true },
      verified_by: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      tableName: "rumours",
      timestamps: true,
      underscored: true,
    }
  );
};
