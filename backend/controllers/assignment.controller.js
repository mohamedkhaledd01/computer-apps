const createCrudController = require("./crudController");

module.exports = createCrudController("assignment", ["course_id", "title", "description"]);
