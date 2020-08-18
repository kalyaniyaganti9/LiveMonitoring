const DataStore = require('nedb');
let userDB = new DataStore({filename: __dirname + '/usersDB', autoload: true});
module.exports = userDB;