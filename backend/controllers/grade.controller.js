const createCrudController = require("./crudController");

module.exports = createCrudController(
  "grade",
  ["user_id", "course_id", "grade"],
  `SELECT grade.*, user.name AS student_name, course.title AS course_title
   FROM grade
   LEFT JOIN user ON user.id = grade.user_id
   LEFT JOIN course ON course.id = grade.course_id
   ORDER BY grade.id DESC`
);
