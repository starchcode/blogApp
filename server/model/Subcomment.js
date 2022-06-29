const { Model, DataTypes } = require("sequelize");
const sequelize = require('./database');

class SubComment extends Model {}

SubComment.init({
    body: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modalName: 'subcomment'
});


module.exports = SubComment;