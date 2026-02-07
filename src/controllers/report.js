const { Rumour, Report } = require("../models");
const { Sequelize } = require("sequelize");

const PANIC_THRESHOLD = 3;

exports.store = async (req, res) => {
  const rumourId = Number(req.params.id);
  const { user_id, report_type } = req.body;

  const rumour = await Rumour.findByPk(rumourId);
  if (!rumour) return res.status(404).send("Rumour not found");

  // Rule: verified then cannot report more
  if (rumour.verified_status !== "unknown") {
    return res.redirect(`/rumours/${rumourId}?err=${encodeURIComponent("ข่าวลือนี้ถูกตรวจสอบแล้ว ไม่สามารถรายงานเพิ่มได้")}`);
  }

  try {
    await Report.create({
      user_id: Number(user_id),
      rumour_id: rumourId,
      report_type: String(report_type),
      reported_at: new Date(),
    });
  } catch (e) {
    // unique constraint hit => user already reported this rumour
    return res.redirect(`/rumours/${rumourId}?err=${encodeURIComponent("ผู้ใช้คนนี้รายงานข่าวลือนี้ไปแล้ว (รายงานซ้ำไม่ได้)")}`);
  }

  // update panic status if count > threshold
  const count = await Report.count({ where: { rumour_id: rumourId } });
  if (count > PANIC_THRESHOLD && rumour.status !== "panic") {
    rumour.status = "panic";
    await rumour.save();
  }

  return res.redirect(`/rumours/${rumourId}?msg=${encodeURIComponent("บันทึกรายงานสำเร็จ")}`);
};
