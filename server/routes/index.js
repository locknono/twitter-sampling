var express = require("express");
var router = express.Router();
const fs = require("fs");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/test", function(req, res, next) {
  fs.readFile("../data/topicProbabilityDict.json", function(err, data) {
    if (err) console.error(err);
    res.send(data);
  });
});

module.exports = router;
