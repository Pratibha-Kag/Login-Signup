const ensureAuthenticated = require("../Middlewares/Auth");

const router = require("express").Router();

router.get("/", ensureAuthenticated, (req, res) => {
  console.log("---- logged in user detail ---", req.user);
  res.status(200).json([
    {
      name: "mobile",
      price: 10000,
      range: "gih",
    },
    {
      name: "tv",
      price: 20000,
      range: "low",
    },
  ]);
});

module.exports = router;
