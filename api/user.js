const express = require("express");
const router = express.Router();
const app = express();
const bodyParser = require("body-parser");
const User = require("../schemas/UserSchema");

app.use(bodyParser.urlencoded({ extended: false }));

router.post("/:userAddress", async (req, res, next) => {

  var userAddress = req.params.userAddress.toLowerCase();

  var userCheck = await User.findOne({
    user: { $eq: userAddress },
  }).catch((error) => {
    console.log(error);
    res.sendStatus(400);
  });

  if (userCheck == null) {
    var data = {
      user: userAddress,
      played: 0,
      wins: 0,
      losses: 0,
    };
    User.create(data)
      .then((results) => res.status(201).send(results))
      .catch((error) => {
        console.log(error);
        res.sendStatus(400);
      });
  } else {
    res.status(200).send("User already exists!");
  }
});

router.get("/:userAddress", async (req, res, next) => {

  var userAddress = req.params.userAddress.toLowerCase();

  User.find({ user: { $eq: userAddress } })
    .then((results) => res.status(200).send(results))
    .catch((error) => {
      console.log(error);
      res.sendStatus(400);
    });
});

router.put("/:userAddress/winner", async (req, res, next) => {

  var userAddress = req.params.userAddress.toLowerCase();

  User.updateOne(
    { user: userAddress },
    { $inc: { played: 1, wins: 1 } }
  )
    .then((results) => res.sendStatus(204))
    .catch((error) => {
      console.log(error);
      res.sendStatus(400);
    });
});

router.put("/:userAddress/loser", async (req, res, next) => {
  
  var userAddress = req.params.userAddress.toLowerCase();

  User.updateOne(
    { user: userAddress },
    { $inc: { played: 1, losses: 1 } }
  )
    .then((results) => res.sendStatus(204))
    .catch((error) => {
      console.log(error);
      res.sendStatus(400);
    });
});

router.get("/leaderboard/top20", async (req, res, next) => {
  User.find({ wins: { $gt: 0 } })
    .sort({ wins: -1 })
    .limit(20)
    .then((results) => res.status(200).send(results))
    .catch((error) => {
      console.log(error);
      res.sendStatus(400);
    });
});

module.exports = router;