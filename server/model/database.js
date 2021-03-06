const { Sequelize } = require("sequelize");
let sequelize;

if ((process.env.NODE_ENV === "test")) { // if testing use dev.sqlite
  console.log("Running the db on memory!");
  sequelize = new Sequelize({
    dialect: "sqlite",
    host: "./test/dev.sqlite",
  });
} else {
  console.log("we are on deployment");
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./model/database.sqlite",
    // storage: "./model/dev.sqlite",
  });
}

module.exports = sequelize;
