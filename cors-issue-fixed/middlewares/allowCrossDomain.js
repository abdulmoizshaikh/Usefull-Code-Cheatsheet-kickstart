/**
 * We have face cors issue when connecting node server with React Native App
 * and server deployed on https heroku and mobile app on http localhost
 * this is the solution of fixing cors issue
 */

/**
 * Two things are important here which are given below
 * 1-res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081");
 * 2-res.header("Access-Control-Allow-Credentials", true);
 */

var allowCrossDomain = function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );

  // intercept OPTIONS method
  if ("OPTIONS" == req.method) {
    res.send(200);
  } else {
    next();
  }
};

module.exports = allowCrossDomain;

/**
 * No matter you can put this middleware  before body parse middleware or after body parse middleware call it works on both cases
 */
