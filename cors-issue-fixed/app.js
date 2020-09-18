const apis = require("./api-config");
const config = require("/config");
require("./config/database");

apis.app.listen(config.PORT, () => {
  console.log("Server is listening on port " + config.PORT);
});
