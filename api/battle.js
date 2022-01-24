const express = require("express");
const router = express.Router();
const app = express();
const bodyParser = require("body-parser");
const Battle = require("../schemas/BattleSchema");

app.use(bodyParser.urlencoded({ extended: false }));

router.post("/:uid", async (req, res, next) => {

    var uidCheck = await Battle.findOne({ uid: { $eq: req.params.uid } })
    .catch((error) => {
      console.log(error);
      res.sendStatus(400);
    });

    if (uidCheck == null) {
        var data = {
            uid: req.params.uid
        };

        Battle.create(data)
        .then((results) => res.status(201).send(results))
        .catch((error) => {
            console.log(error);
            res.sendStatus(400);
        });
    } else {
        res.status(200).send("UID already exists!");
    }
});

router.get("/:uid", async (req, res, next) => {
    Battle.find({ uid: { $eq: req.params.uid } })
    .then((results) => res.status(200).send(results))
    .catch((error) => {
        console.log(error);
        res.sendStatus(400);
    });
});


module.exports = router;