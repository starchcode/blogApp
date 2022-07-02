const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const sequelize = require("./model/database");

//SETUP:
sequelize.sync() //database

app = express(); 
const PORT = process.env.PORT || 4000;

app.use(morgan('dev'));
app.use(cors());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const apiRouter = require('./api/api');
app.use('/', apiRouter);


// Error handler route:
app.use((err, req, res, next) => {
    const status = err.status || 500;
    err.statusText = err.statusText + ' ' + err.message
    res.status(status).json({error: err.message});
  });

app.listen(PORT);

module.exports = app;
