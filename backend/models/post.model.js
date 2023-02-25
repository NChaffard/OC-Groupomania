const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("post", {
        text: {
            type: DataTypes.TEXT
        },
        imageUrl: {
            type: DataTypes.STRING,

        }
    });
    return Post;
};
