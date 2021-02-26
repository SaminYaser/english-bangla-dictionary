const express = require('express');
const router = express.Router();
const controller = require("./controller")

router.get("/dictionary", controller.wordQuery)

module.exports = router;