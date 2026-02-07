const express = require("express");
const rumourController = require("../controllers/rumour");
const reportController = require("../controllers/report");
const verifyController = require("../controllers/verify");

const router = express.Router();

router.get("/", rumourController.index);
router.get("/create", rumourController.createForm);
router.post("/create", rumourController.create);

router.get("/:id", rumourController.show);
router.post("/:id/reports", reportController.store);
router.post("/:id/verify", verifyController.verify);

module.exports = router;
