const jwt = require('jsonwebtoken');
const JWT_SECRET = "my_jwt_secret"

const fetchuser = (req, res, next) => {
    // get the user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "please authenticate with valid token" })
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
    } catch (error) {
        res.status(401).send({ error: "please authenticate with valid token" })
    }
    next()
}


module.exports = fetchuser;