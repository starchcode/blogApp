const { Model, DataTypes } = require("sequelize");
const sequelize = require('./database');
const comment = require("./Comment");

class Post extends Model {}

Post.init({
    title: {
        type: DataTypes.STRING
    },
    body: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modalName: 'post'
});

Post.hasMany(comment, {
    foreignKey: "post_id",
    onDelete: "CASCADE", 
    onUpdate: "CASCADE"
});

module.exports = Post;