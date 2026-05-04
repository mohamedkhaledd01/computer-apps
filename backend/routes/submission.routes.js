const createCrudRoutes = require("./createCrudRoutes");
const submissionController = require("../controllers/submission.controller");

module.exports = createCrudRoutes(submissionController);
