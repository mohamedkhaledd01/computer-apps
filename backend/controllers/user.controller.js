const createCrudController = require("./crudController");

module.exports = createCrudController("user", ["name", "email", "password", "role"]);
