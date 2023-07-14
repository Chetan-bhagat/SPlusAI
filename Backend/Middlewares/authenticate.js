const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = async (req, res, next) => {
    const token = req.headers.token;
    if (token==null || !token) {
        res.send({ "error": "Login Again" })
    }else{
        try {
            var decoded = jwt.verify(token, process.env.key);
            if (decoded) {
                next()
            } else {
                res.send({ "error": "Login Again" })
            }
        } catch (err) {
            res.send({ "error": err })
        }
    }
    

}

module.exports = { auth };