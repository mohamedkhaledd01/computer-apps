const createCrudController = require("./crudController");

module.exports = createCrudController("grade", ["user_id", "course_id", "grade"]);
