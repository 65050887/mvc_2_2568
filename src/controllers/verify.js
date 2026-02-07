const { Rumour, User } = require("../models");

exports.verify = async (req, res) => {
  const rumourId = Number(req.params.id);
  const { verified_status, verifier_user_id } = req.body;

  const rumour = await Rumour.findByPk(rumourId);
  if (!rumour) return res.status(404).send("Rumour not found");

  // (1) ถ้าถูก verify แล้ว ห้าม verify ซ้ำ (กันแก้ผลทีหลัง)
  if (rumour.verified_status !== "unknown") {
    return res.redirect(
      `/rumours/${rumourId}?err=${encodeURIComponent("ข่าวลือนี้ถูกตรวจสอบแล้ว ไม่สามารถยืนยันซ้ำได้")}`
    );
  }

  // validate verified_status
  const vs = String(verified_status);
  if (!["true", "false"].includes(String(verified_status))) {
    return res.redirect(`/rumours/${rumourId}?err=${encodeURIComponent("ค่า verified_status ไม่ถูกต้อง")}`);
  }

  // (2) ตรวจว่า verifier_user_id เป็นผู้ตรวจสอบจริง
  const verifierId = Number(verifier_user_id);
  const verifier = await User.findByPk(verifierId);
  if (!verifier || verifier.role !== "verifier") {
    return res.redirect(
      `/rumours/${rumourId}?err=${encodeURIComponent("ผู้ตรวจสอบไม่ถูกต้อง (ต้องเป็น role verifier)")}`
    );
  }

  rumour.verified_status = String(verified_status);
  rumour.verified_at = new Date();
  rumour.verified_by = Number(verifier_user_id) || null;

  await rumour.save();

  return res.redirect(`/rumours/${rumourId}?msg=${encodeURIComponent("ยืนยันข่าวลือเรียบร้อย (ล็อกไม่ให้รายงานเพิ่มแล้ว)")}`);
};
