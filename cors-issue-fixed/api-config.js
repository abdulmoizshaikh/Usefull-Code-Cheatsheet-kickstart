var express = require("express");
let bodyParser = require("body-parser");
const morgan = require("morgan");
const allowCrossDomain = require("./middlewares/allowCrossDomain");

let app = express();

app.use(morgan("combined"));

/** parse application/x-www-form-urlencoded  */
app.use(bodyParser.urlencoded({ extended: false }));

/** parse application/json  */
app.use(bodyParser.json());

app.use(allowCrossDomain);

app.get("/", (req, res) => {
  res.send({ message: "Welcome to AON server" });
});

require("../app/routes")(app);

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = {
  app,
};
