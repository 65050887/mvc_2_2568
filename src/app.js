const express = require("express");
const path = require("path");

const { sequelize } = require("./models");

const rumourRoutes = require("./routes/rumour");
const summaryRoutes = require("./routes/summary");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => res.redirect("/rumours"));

app.use("/rumours", rumourRoutes);
app.use("/summary", summaryRoutes);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // สร้างตารางอัตโนมัติจาก Models
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("DB error:", err);
    process.exit(1);
  }
})();
