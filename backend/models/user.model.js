const { DataTypes } = require("sequelize");


module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isAdmin: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    });

    return User;
};
