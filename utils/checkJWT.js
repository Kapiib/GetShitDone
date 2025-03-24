const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/jwtUtils.js");

const checkJWT = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        const decodedToken = verifyToken(token);

        if (decodedToken) {
            req.user = decodedToken; 
            res.locals.user = decodedToken;
        } else {
            req.user = null;
            res.locals.user = null;
        }
    } else {
        req.user = null;
        res.locals.user = null;
    }
    next();
};

module.exports = checkJWT;
