const { Model, DataTypes } = require("sequelize");
const sequelize = require("./database");
const subcomment = require("./Subcomment");
class Comment extends Model {}

Comment.init({
    body: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modalName: 'comment'
});

Comment.hasMany(subcomment, {
    foreignKey: "comment_id",
    onDelete: "CASCADE", 
    onUpdate: "CASCADE"
});


module.exports = Comment;