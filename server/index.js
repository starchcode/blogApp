const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

//SETUP:
app = express();
const PORT = process.env.PORT || 4000;

app.use(morgan('dev'));
app.use(cors());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    return res.json("welcome to the blogApp by starchCode.com")
});


app.listen(PORT, () => {
});

module.exports = app;
