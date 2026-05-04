const createCrudRoutes = require("./createCrudRoutes");
const assignmentController = require("../controllers/assignment.controller");

module.exports = createCrudRoutes(assignmentController);
