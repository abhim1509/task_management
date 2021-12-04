const dev =  require("./config.dev.json");
const path = require('path');
dotenv_path = path.resolve(__dirname, "/.env")
require('dotenv').config({path: dotenv_path});
console.log(dotenv_path)

//const path = require('path')
//require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

//const environment = env ? process.env.environment : dev.environment;
//console.log(environment);
//console.log(env);
console.log(process.env.environment);
console.log(dev.environment);
function getEnvironmentDetails(environment){
    switch(JSON.stringify(environment)){
        case env : return {url: process.env.url, document: process.env.document};
        case dev : return {url: environment.url, document: environment.document};
    }
}

module.exports.getDatabaseConfig = function getDatabaseConfig(){
    return getEnvironmentDetails(environment);
};
