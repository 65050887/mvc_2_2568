const path = require("path");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../../database.sqlite"),
  logging: false,
});

const User = require("./user")(sequelize);
const Rumour = require("./rumour")(sequelize);
const Report = require("./report")(sequelize);

// Relations
User.hasMany(Report, { foreignKey: "user_id" });
Report.belongsTo(User, { foreignKey: "user_id" });

Rumour.hasMany(Report, { foreignKey: "rumour_id" });
Report.belongsTo(Rumour, { foreignKey: "rumour_id" });

module.exports = { sequelize, User, Rumour, Report };
