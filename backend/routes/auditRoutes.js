const express = require("express");
const audit = require("../models/Audit");

const router = express.Router();

router.get("/", (req, res) => {
    res.json(audit.logs);
});

module.exports = router;