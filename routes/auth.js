const express = require('express');
const router_my = express.Router();
const User_my = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetch_user = require('../middleware/fetchuser')

const JWT_SECRET = "my_jwt_secret"

// ROUTE-1 create a user using POST "/api/auth/createuser"
router_my.post(
    '/createuser',
    // middleware checking fields
    [
        body('name', "Name tw sahi dal").isLength({ min: 3 }),
        body('email', "Email ghalat he").isEmail(),
        body('password', "Password sahi dal").isLength({ min: 6, max: 12 })
    ],
    async (req, res) => {

        // check for error and send bad request for errors
        const errors_my = validationResult(req);

        if (!errors_my.isEmpty()) {
            return res.status(400).json({ errors: errors_my.array() })
        }

        try {
            // check whether the email exits already
            let user = await User_my.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ error: "user exits already" })
            }

            // create secret password use bcrypt and salt
            const salt = await bcrypt.genSalt(10);
            const secret_password = await bcrypt.hash(req.body.password, salt);

            // create new user
            user = await User_my.create(
                {
                    name: req.body.name,
                    email: req.body.email,
                    password: secret_password,
                }
            )

            // use web token to verify
            const data = {
                user: {
                    id: user.id
                }
            }
            const jwtData = jwt.sign(data, JWT_SECRET);

            // send response success and send token
            res.status(200).json({ jwtData });

        } catch (error) {
            console.error(error.message);
            res.status(500).send("create a user ke try me kuch bhand he")
        }
    })

// ROUTE-2 login authenticate a user using POST "/api/auth/login"
router_my.post(
    '/login',
    [
        body('email', 'email sahi nh he').isEmail(),
        body('password', 'password dal be').exists()
    ],
    async (req, res) => {

        // check for error and send bad request for errors
        const errors_my = validationResult(req);

        if (!errors_my.isEmpty()) {
            return res.status(400).json({ errors: errors_my.array() })
        }

        const { email, password } = req.body;

        try {
            // check whether the email exits already
            let user = await User_my.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: "user ni he" })
            }
            const passwordCampare = await bcrypt.compare(password, user.password);
            if (!passwordCampare) {
                return res.status(400).json({ error: "password ghalat he" })
            }
            // use web token to verify
            const data = {
                user: {
                    id: user.id
                }
            }
            const jwtData = jwt.sign(data, JWT_SECRET);

            // send response success and send token
            res.status(200).json({ jwtData });
            // res.status(200).json(user.id);

        } catch (error) {
            console.error(error.message);
            res.status(500).send("authenticate a user ke try me kuch bhand he")
        }
    })
    
// ROUTE-3 get loged in user details /api/auth/getuser (login required)
router_my.post('/getuser', fetch_user, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User_my.findById(userId).select("-password");
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("get logged in user ke try me kuch bhand he")
    }
}
)

module.exports = router_my;