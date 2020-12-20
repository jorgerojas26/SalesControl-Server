const User = require('../models').User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  index: function (req, res, next) {
    if (req.user.permissions == process.env.MASTER_PERMISSION) {
      next();
    } else {
      res.status(401).json({ err: 'Insuficcient permissions' });
    }
  },
  create: function (req, res) {
    if (req.user.permissions == process.env.MASTER_PERMISSION) {
      if (req.body.email && req.body.password && req.body.permissions) {
        bcrypt.hash(req.body.password, 10, async function (err, hashedPassword) {
          if (err) return res.send(err);
          try {
            const user = await User.create({
              email: req.body.email,
              password: hashedPassword,
              permissions: req.body.permissions,
            });
            res.status(200).json(user);
          } catch (err) {
            res.status(409).json(err);
          }
        });
      }
    } else {
      res.status(401).json({ err: 'Insuficcient permissions' });
    }
  },
  show: function (req, res) {},
};

