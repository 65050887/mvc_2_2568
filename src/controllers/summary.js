const { Rumour } = require("../models");

exports.index = async (req, res) => {
  const panic = await Rumour.findAll({ where: { status: "panic" }, order: [["created_at", "DESC"]], raw: true });
  const verifiedTrue = await Rumour.findAll({ where: { verified_status: "true" }, order: [["verified_at", "DESC"]], raw: true });
  const verifiedFalse = await Rumour.findAll({ where: { verified_status: "false" }, order: [["verified_at", "DESC"]], raw: true });

  res.render("summary/index", { panic, verifiedTrue, verifiedFalse });
};
