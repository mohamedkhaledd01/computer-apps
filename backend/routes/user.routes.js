const createCrudRoutes = require("./createCrudRoutes");
const userController = require("../controllers/user.controller");

module.exports = createCrudRoutes(userController);
