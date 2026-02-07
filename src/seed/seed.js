const { sequelize, User, Rumour, Report } = require("../models");

const PANIC_THRESHOLD = 3;

async function main() {
  await sequelize.sync({ force: true });

  // Users >= 10
  const users = await User.bulkCreate([
    { name: "User01", role: "general" },
    { name: "User02", role: "general" },
    { name: "User03", role: "general" },
    { name: "User04", role: "general" },
    { name: "User05", role: "general" },
    { name: "User06", role: "general" },
    { name: "User07", role: "general" },
    { name: "User08", role: "general" },
    { name: "Verifier01", role: "verifier" },
    { name: "Verifier02", role: "verifier" },
  ]);

  // Rumours >= 8 (codes not start with 0)
  const rumours = await Rumour.bulkCreate([
    { rumour_code: "12345678", title: "ข่าวลือ 1", source: "Facebook", credibility_score: 40 },
    { rumour_code: "23456789", title: "ข่าวลือ 2", source: "X", credibility_score: 55 },
    { rumour_code: "34567890", title: "ข่าวลือ 3", source: "LINE", credibility_score: 20 },
    { rumour_code: "45678901", title: "ข่าวลือ 4", source: "TikTok", credibility_score: 30 },
    { rumour_code: "56789012", title: "ข่าวลือ 5", source: "YouTube", credibility_score: 60 },
    { rumour_code: "67890123", title: "ข่าวลือ 6", source: "News", credibility_score: 70 },
    { rumour_code: "78901234", title: "ข่าวลือ 7", source: "Blog", credibility_score: 45 },
    { rumour_code: "89012345", title: "ข่าวลือ 8", source: "Friend", credibility_score: 10 },
  ]);

  // Make 2 rumours panic: count > threshold
  const generalUsers = users.filter((u) => u.role === "general");

  // rumour 1: 4 reports (threshold 3 => panic)
  for (let i = 0; i < PANIC_THRESHOLD + 1; i++) {
    await Report.create({
      user_id: generalUsers[i].id,
      rumour_id: rumours[0].id,
      report_type: ["distorted", "incite", "fake"][i % 3],
      reported_at: new Date(),
    });
  }
  rumours[0].status = "panic";
  await rumours[0].save();

  // rumour 2: 5 reports => panic
  for (let i = 0; i < PANIC_THRESHOLD + 2; i++) {
    await Report.create({
      user_id: generalUsers[i].id,
      rumour_id: rumours[1].id,
      report_type: ["distorted", "incite", "fake"][i % 3],
      reported_at: new Date(),
    });
  }
  rumours[1].status = "panic";
  await rumours[1].save();

  // Make verified true/false
  rumours[2].verified_status = "true";
  rumours[2].verified_at = new Date();
  rumours[2].verified_by = users.find((u) => u.role === "verifier").id;
  await rumours[2].save();

  rumours[3].verified_status = "false";
  rumours[3].verified_at = new Date();
  rumours[3].verified_by = users.find((u) => u.role === "verifier").id;
  await rumours[3].save();

  console.log("Seed completed.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
