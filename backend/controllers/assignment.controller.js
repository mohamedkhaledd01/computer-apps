const createCrudController = require("./crudController");

module.exports = createCrudController(
  "assignment",
  ["course_id", "title", "description"],
  `SELECT assignment.*, course.title AS course_title
   FROM assignment
   LEFT JOIN course ON course.id = assignment.course_id
   ORDER BY assignment.id DESC`
);
