const createCrudRoutes = require("./createCrudRoutes");
const enrollmentController = require("../controllers/enrollment.controller");

module.exports = createCrudRoutes(enrollmentController);
