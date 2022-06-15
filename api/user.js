const express = require("express");
const router = express.Router();
const app = express();
const User = require("../schemas/UserSchema");

router.get("/:userAddress", async (req, res, next) => {

  var userAddress = req.params.userAddress;

  User.find({ username: { $eq: userAddress } })
    .then((results) => res.status(200).send(results))
    .catch((error) => {
      console.log(error);
      res.sendStatus(400);
    });
});

router.put("/:userAddress/winner", async (req, res, next) => {

  var userAddress = req.params.userAddress;

  User.updateOne(
    { username: userAddress },
    { $inc: { played: 1, wins: 1 } }
  )
    .then(() => res.sendStatus(204))
    .catch((error) => {
      console.log(error);
      res.sendStatus(400);
    });
});

router.put("/:userAddress/loser", async (req, res, next) => {
  
  var userAddress = req.params.userAddress;

  User.updateOne(
    { username: userAddress },
    { $inc: { played: 1, losses: 1 } }
  )
    .then(() => res.sendStatus(204))
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