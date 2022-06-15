const express = require('express');
const app = express();
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');

router.post("/", async (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;

    if (username && password && email) {
        var user = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })
            .catch((error) => {
                console.log(error);
                res.status(200).send("Something went wrong!");
            });

        if (user == null) {

            var data = {
                username: username,
                password: password,
                email: email,
                played: 0,
                wins: 0,
                losses: 0
            }
            data.password = await bcrypt.hash(password, 10);

            User.create(data)
                .then((results) => res.status(201).send(results))
                .catch((error) => {
                    console.log(error);
                    res.sendStatus(400);
                });
        }
        else {
            // User found
            if (email == user.email) {
                return res.status(401).json({ msg: "Email already in use" });
            } else {
                return res.status(401).json({ msg: "Username already in use" });
            }
        }
    }
    else {
        res.status(401).json({ msg: "Make sure each field has a valid value!" });
    }
})

module.exports = router;
