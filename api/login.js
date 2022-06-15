const express = require('express');
const app = express();
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../schemas/UserSchema');

router.post("/", async (req, res, next) => {
    if (req.body.logUsername && req.body.logPassword) {

        const username = req.body.logUsername;

        var user = await User.findOne({ username: { $eq: username } })
            .catch((error) => {
                console.log(error);
                res.sendStatus(400);
            });

        if (user != null) {
            bcrypt.compare(req.body.logPassword, user.password, (err, data) => {
                if (err) throw err

                if (data) {
                    return res.status(200).json({ msg: "Login successful" });
                } else {
                    return res.status(401).json({ msg: "Invalid password!" });
                }

            })
        } else {
            return res.status(401).json({ msg: "User not found!" });
        }
    }
    else {
        res.status(401).json({ msg: "Make sure each field has a valid value!" });
    }
})

module.exports = router;