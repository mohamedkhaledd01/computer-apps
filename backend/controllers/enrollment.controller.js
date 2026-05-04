const createCrudController = require("./crudController");

module.exports = createCrudController("enrollment", ["user_id", "course_id"]);
