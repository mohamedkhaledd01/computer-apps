const createCrudRoutes = require("./createCrudRoutes");
const gradeController = require("../controllers/grade.controller");

module.exports = createCrudRoutes(gradeController);
