const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const ObjectId = require("mongodb").ObjectId;

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// Create the register endpoint
// @route POST api/user/register
// @desc Register user
// @access public
router.post("/register", (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    // Check if the user already exists
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                return res.status(400).json({ email: "Email already exists" });
            }
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            // Hash password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        });
});

// Create the login endpoint
// @route POST api/user/login
// @desc Log in user
// @access public

router.post("/login", (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // see if the user exists
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }
        // check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (!isMatch) {
                return res.status(404).json({ passwordincorrect: "Password incorrect" });
            }
            // create jwt payload
            const payload = {
                id: user.id,
                name: user.name
            };
            // sign token
            jwt.sign(
                payload, 
                keys.secretOrKey, 
                { expiresIn: 604800 },
                (err, token) => {
                    res.json({
                        success: true,
                        token: "Bearer " + token
                    });
                }
            );
        });
    });
});

router.post("/profile", (req, res) => {
    const id = new ObjectId(req.body.id);
    User.findById(id)
    .then(user => {
        res.json({ user });
    })
    .catch(err => {
        res.status(404).json(err);
    });
});

module.exports = router;