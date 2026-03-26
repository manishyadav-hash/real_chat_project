"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FcmDeviceModel = void 0;
const sequelize_1 = require("sequelize");
const sequelize_config_1 = require("../config/sequelize.config");

class FcmDeviceModel extends sequelize_1.Model {}
exports.FcmDeviceModel = FcmDeviceModel;

FcmDeviceModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    mobileNumber: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    fcmToken: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    applicationName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    language: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: sequelize_config_1.sequelize,
    tableName: "fcm_devices",
    indexes: [
        {
            fields: ['language'],
        }
    ]
});

exports.default = FcmDeviceModel;
