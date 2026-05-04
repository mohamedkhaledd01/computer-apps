const createCrudController = require("./crudController");

module.exports = createCrudController(
  "enrollment",
  ["user_id", "course_id"],
  `SELECT enrollment.*, user.name AS student_name, course.title AS course_title
   FROM enrollment
   LEFT JOIN user ON user.id = enrollment.user_id
   LEFT JOIN course ON course.id = enrollment.course_id
   ORDER BY enrollment.id DESC`
);
