const createCrudRoutes = require("./createCrudRoutes");
const courseController = require("../controllers/course.controller");

module.exports = createCrudRoutes(courseController);
