const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
    }
  };
  User.init({
    email: DataTypes.TEXT,
    password: DataTypes.TEXT,
    permissions: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
    tableName: "users"
  });

  User.login = function (email, password) {
    return new Promise((resolve, reject) => {
      User.findOne({
        where: {
          email
        }
      }).then(user => {
        if (!user) reject("User doesn't exist");
        if (user.permissions < process.env.EMPLOYEE_PERMISSION) reject("Insuficcient permissions");
        var token = jwt.sign({ userId: user.id, permissions: user.permissions }, process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24
        });
        user.authenticatePassword(password).then(valid => {
          valid ? resolve({ user, token }) : reject("Email or password incorrect");
        });
      })
    })


  }

  User.prototype.authenticatePassword = function (password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, this.password, function (err, valid) {
        if (err) return reject(err);
        resolve(valid);
      })
    });

  }
  return User;
};