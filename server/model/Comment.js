const { Model, DataTypes } = require("sequelize");
const sequelize = require("./database");
class Comment extends Model {}

Comment.init({
    body: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modalName: 'comment'
});



module.exports = Comment;