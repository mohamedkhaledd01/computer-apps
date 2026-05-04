const createCrudController = require("./crudController");

module.exports = createCrudController("announcement", ["course_id", "message"]);
