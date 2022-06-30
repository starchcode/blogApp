const { Model, DataTypes } = require("sequelize");
const sequelize = require("./database");
const post = require("./Post");
const comment = require("./Comment");

class User extends Model {}

User.init({
    username: {
        type: DataTypes.STRING
    },
}, {
    sequelize,
    modalName: 'user'
});

User.hasMany(post, {
    foreignKey: "user_id",
    onDelete: "CASCADE", 
    onUpdate: "CASCADE"
})
User.hasMany(comment, {
    foreignKey: "user_id",
    onDelete: "CASCADE", 
    onUpdate: "CASCADE"
})

module.exports = User;