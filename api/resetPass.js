const express = require('express');
const app = express();
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../schemas/UserSchema');

router.post("/", async (req, res, next) => {

    if (req.body.password && req.body.id) {

        const password = req.body.password;
        const id = req.body.id;

        let newPass = await bcrypt.hash(password, 10);

        User.updateOne({username: id }, { password: newPass })
        .then(() => {
            res.status(200).json({ msg: "Your password has been updated successfully" });
        })
        .catch((error) => {
            console.log(error);
            res.sendStatus(400);
        });

    } else {
        res.status(401).json({ msg: "Password & token missing!" });
    }
})

module.exports = router;