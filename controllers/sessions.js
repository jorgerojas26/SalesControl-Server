const User = require("../models").User;
const jwt = require("jsonwebtoken");

module.exports = {
    create: function (req, res) {
        if (req.body.email && req.body.password) {
            User.login(req.body.email, req.body.password).then(user => {
                res.status(200).json({ message: "Auth success", token: user.token })
            }).catch(err => {
                res.status(401).json({ err })
            })
        }
        else {
            res.json({ error: "Empty parameters" })
        }
    },
    checkUserAuth: function (req, res) {
        let { token } = req.query;

        jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) return res.status(403).json({ err, auth: false });
            res.json({ auth: true })
        })

    }
}