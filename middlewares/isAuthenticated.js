const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(401).json(err);
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ err: "No token provided" });
    }
}