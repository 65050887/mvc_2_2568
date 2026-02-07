const express = require("express");
const summaryController = require("../controllers/summary");

const router = express.Router();
router.get("/", summaryController.index);

module.exports = router;
