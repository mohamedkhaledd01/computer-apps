const createCrudController = require("./crudController");

module.exports = createCrudController("course", ["title", "description"]);
