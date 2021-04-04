'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Client extends Model {
        static associate(models) {
            Client.hasMany(models.Sales, {
                as: 'sales',
                foreignKey: 'clientId',
                sourceKey: 'id',
            });
        }
    }
    Client.init(
        {
            name: DataTypes.TEXT,
            cedula: DataTypes.INTEGER,
            phoneNumber: DataTypes.TEXT,
            employee: {
                type: DataTypes.VIRTUAL,
                get: function () {
                    return process.env.EMPLOYEE_CED.includes(this.getDataValue("cedula"));
                }
            }
        },
        {
            sequelize,
            modelName: 'Client',
            tableName: 'clients',
        },
    );
    return Client;
};

