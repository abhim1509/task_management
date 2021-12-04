const connectivity = require("./connectivity");
const database_connect = require("./database_wrapper");

module.exports.connection = connectivity;
module.exports.db_apis = database_connect;
