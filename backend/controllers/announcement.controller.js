const createCrudController = require("./crudController");

module.exports = createCrudController(
  "announcement",
  ["course_id", "message"],
  `SELECT announcement.*, course.title AS course_title
   FROM announcement
   LEFT JOIN course ON course.id = announcement.course_id
   ORDER BY announcement.id DESC`
);
