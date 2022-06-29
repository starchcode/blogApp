const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './model/database.sqlite'
});

module.exports = sequelize;