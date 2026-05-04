const createCrudController = require("./crudController");

module.exports = createCrudController("submission", ["assignment_id", "user_id", "content"]);
