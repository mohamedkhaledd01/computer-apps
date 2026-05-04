const createCrudController = require("./crudController");

module.exports = createCrudController("quiz", ["course_id", "title"]);
