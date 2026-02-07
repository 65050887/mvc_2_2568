const { Rumour, Report, User, sequelize } = require("../models");
const { Op } = require("sequelize");

const PANIC_THRESHOLD = 3; // ปรับได้ตามใจ/ตามข้อสอบ

function isValidRumourCode(code) {
  return /^[1-9]\d{7}$/.test(code); // 8 digits, first not 0
}

exports.index = async (req, res) => {
  const q = (req.query.q || "").trim();

  const rumours = await Rumour.findAll({
    where: q
      ? {
          [Op.or]: [
            { rumour_code: { [Op.like]: `%${q}%` } },
            { title: { [Op.like]: `%${q}%` } },
            { source: { [Op.like]: `%${q}%` } },
          ],
        }
      : undefined,
    order: [["created_at", "DESC"]],
    raw: true,
  });

  // add report counts
  const counts = await Report.findAll({
    attributes: ["rumour_id", [sequelize.fn("COUNT", sequelize.col("id")), "cnt"]],
    group: ["rumour_id"],
    raw: true,
  });

  const map = new Map(counts.map((r) => [r.rumour_id, Number(r.cnt)]));
  const rows = rumours
    .map((r) => ({ ...r, report_count: map.get(r.id) || 0 }))
    .sort((a, b) => b.report_count - a.report_count);

  res.render("rumours/index", { rumours: rows, q });
};

exports.show = async (req, res) => {
  const id = Number(req.params.id);

  const rumour = await Rumour.findByPk(id, { raw: true });
  if (!rumour) return res.status(404).send("Rumour not found");

  const reportCount = await Report.count({ where: { rumour_id: id } });

  const users = await User.findAll({ order: [["name", "ASC"]], raw: true });

  const message = req.query.msg || "";
  const error = req.query.err || "";

  res.render("rumours/show", {
    rumour,
    reportCount,
    users,
    panicThreshold: PANIC_THRESHOLD,
    message,
    error,
  });
};

exports.createForm = async (req, res) => {
  res.render("rumours/create", { error: "" });
};

exports.create = async (req, res) => {
  const { rumour_code, title, source, credibility_score } = req.body;

  if (!isValidRumourCode(String(rumour_code || ""))) {
    return res.status(400).render("rumours/create", {
      error: "Rumour Code ต้องเป็นตัวเลข 8 หลัก และห้ามขึ้นต้นด้วย 0",
    });
  }

  try {
    await Rumour.create({
      rumour_code: String(rumour_code),
      title: String(title || "").trim(),
      source: String(source || "").trim(),
      credibility_score: Number(credibility_score),
      status: "normal",
      verified_status: "unknown",
    });

    return res.redirect("/rumours?created=1");
  } catch (e) {
    return res.status(400).render("rumours/create", {
      error: "สร้างข่าวลือไม่สำเร็จ (อาจซ้ำกับรหัสเดิม หรือข้อมูลไม่ครบ)",
    });
  }
};
