const express = require('express');
const app = express();
const router = express.Router();
const User = require('../schemas/UserSchema');
const smtpTransport = require('nodemailer-smtp-transport');
const nodemailer = require('nodemailer');

router.post("/", async (req, res, next) => {

    const { email } = req.body

    // Check we have an email
    if (!email) {
        return res.status(422).json({ msg: "Missing email" });
    }

    var user = await User.find({ email: { $eq: email } })
        .catch((error) => {
            console.log(error);
            res.sendStatus(400);
        });

    if (user == null) {
        res.status(401).json({ msg: "Email not registered!" });
    } else {
        var token = user[0].username;

        var mail = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            auth: {
                user: '', // Your email id
                pass: '' // Your password
            }
        }));
        
        var mailOptions = {
            from: 'prajwal.arora@oodles.io',
            to: email,
            subject: 'Reset Password Link',
            html: `'<p>You requested for reset password, kindly use this <a href="http://localhost:3000/reset-password?${token}">link</a> to reset your password</p>'`
        };
        
        mail.sendMail(mailOptions, function(error, info) {
            if (error) {
                res.status(401).json({ msg: "Something went wrong, Please try again!" });
            } else {
                res.status(200).json({ msg: "The reset password link has been sent to your email address" });
            }
        });
    }
})

module.exports = router;