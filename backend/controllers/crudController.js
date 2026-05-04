const db = require("../config/db");

const tableName = (name) => `\`${name}\``;
const columnName = (name) => `\`${name}\``;

const schemas = {
  user: {
    id: "user_id",
    select: "user_id AS id, name, email, password, 'student' AS role",
    fields: {
      name: "name",
      email: "email",
      password: "password"
    }
  },
  course: {
    id: "course_id",
    select: "course_id AS id, name AS title, description, instructor",
    fields: {
      title: "name",
      description: "description",
      instructor: { column: "instructor", defaultValue: "" }
    }
  },
  enrollment: {
    id: "enrollment_id",
    select: "enrollment_id AS id, student AS user_id, course AS course_id, student AS student_name, course AS course_title, date",
    fields: {
      user_id: { column: "student", reference: { table: "user", idColumn: "user_id", valueColumn: "name" } },
      course_id: { column: "course", reference: { table: "course", idColumn: "course_id", valueColumn: "name" } },
      date: { column: "date", defaultValue: () => new Date().toISOString().slice(0, 10) }
    }
  },
  assignment: {
    id: "assignment_id",
    select: "assignment_id AS id, course_name AS course_id, course_name AS course_title, title, due_date AS description, due_date",
    fields: {
      course_id: { column: "course_name", reference: { table: "course", idColumn: "course_id", valueColumn: "name" } },
      title: "title",
      description: "due_date"
    }
  },
  submission: {
    id: "submission_id",
    select: "submission_id AS id, assignment_title AS assignment_id, assignment_title, student_name AS user_id, student_name, submission_date AS content, submission_date",
    fields: {
      user_id: { column: "student_name", reference: { table: "user", idColumn: "user_id", valueColumn: "name" } },
      assignment_id: { column: "assignment_title", reference: { table: "assignment", idColumn: "assignment_id", valueColumn: "title" } },
      content: "submission_date"
    }
  },
  quiz: {
    id: "quiz_id",
    select: "quiz_id AS id, course_name AS course_id, course_name AS course_title, title, grade",
    fields: {
      course_id: { column: "course_name", reference: { table: "course", idColumn: "course_id", valueColumn: "name" } },
      title: "title",
      grade: { column: "grade", defaultValue: "" }
    }
  },
  grade: {
    id: "grade_id",
    select: "grade_id AS id, student_name AS user_id, student_name, course_name AS course_id, course_name AS course_title, grade_value AS grade",
    fields: {
      user_id: { column: "student_name", reference: { table: "user", idColumn: "user_id", valueColumn: "name" } },
      course_id: { column: "course_name", reference: { table: "course", idColumn: "course_id", valueColumn: "name" } },
      grade: "grade_value"
    }
  },
  announcement: {
    id: "announcement_id",
    select: "announcement_id AS id, course_name AS course_id, course_name AS course_title, title AS message, date_posted",
    fields: {
      course_id: { column: "course_name", reference: { table: "course", idColumn: "course_id", valueColumn: "name" } },
      message: "title",
      date_posted: { column: "date_posted", defaultValue: () => new Date().toISOString().slice(0, 10) }
    }
  }
};

const getSchema = (table, allowedFields) => {
  if (schemas[table]) {
    return schemas[table];
  }

  return {
    id: "id",
    select: "*",
    fields: allowedFields.reduce((acc, field) => ({ ...acc, [field]: field }), {})
  };
};

const resolveField = (fieldConfig) => {
  if (typeof fieldConfig === "string") {
    return { column: fieldConfig };
  }
  return fieldConfig;
};

const looksLikeId = (value) => String(value).trim() !== "" && /^\d+$/.test(String(value));

const resolveReferenceValue = async (value, reference) => {
  if (!reference || !looksLikeId(value)) {
    return value;
  }

  const [rows] = await db.query(
    `SELECT ${columnName(reference.valueColumn)} AS value FROM ${tableName(reference.table)} WHERE ${columnName(reference.idColumn)} = ?`,
    [value]
  );

  return rows[0]?.value || value;
};

const buildValues = async (body, fieldsConfig, includeDefaults = false) => {
  const columns = [];
  const values = [];

  for (const [apiField, rawConfig] of Object.entries(fieldsConfig)) {
    const config = resolveField(rawConfig);
    const hasBodyValue = body[apiField] !== undefined && body[apiField] !== "";

    if (hasBodyValue) {
      columns.push(config.column);
      values.push(await resolveReferenceValue(body[apiField], config.reference));
      continue;
    }

    if (includeDefaults && config.defaultValue !== undefined) {
      columns.push(config.column);
      values.push(typeof config.defaultValue === "function" ? config.defaultValue(body) : config.defaultValue);
    }
  }

  return { columns, values };
};

const selectById = async (table, schema, id) => {
  const [rows] = await db.query(
    `SELECT ${schema.select} FROM ${tableName(table)} WHERE ${columnName(schema.id)} = ?`,
    [id]
  );
  return rows;
};

const createCrudController = (table, allowedFields = [], listQuery) => ({
  async getAll(req, res) {
    const schema = getSchema(table, allowedFields);

    try {
      const [rows] = await db.query(
        listQuery || `SELECT ${schema.select} FROM ${tableName(table)} ORDER BY ${columnName(schema.id)} DESC`
      );
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getById(req, res) {
    const schema = getSchema(table, allowedFields);

    try {
      const rows = await selectById(table, schema, req.params.id);
      if (!rows.length) {
        return res.status(404).json({ message: `${table} not found` });
      }
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async create(req, res) {
    const schema = getSchema(table, allowedFields);

    try {
      const { columns, values } = await buildValues(req.body, schema.fields, true);
      if (!columns.length) {
        return res.status(400).json({ message: "No valid fields provided" });
      }

      const placeholders = columns.map(() => "?").join(", ");
      const dbColumns = columns.map(columnName).join(", ");
      const [result] = await db.query(
        `INSERT INTO ${tableName(table)} (${dbColumns}) VALUES (${placeholders})`,
        values
      );
      const rows = await selectById(table, schema, result.insertId);
      res.status(201).json(rows[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async update(req, res) {
    const schema = getSchema(table, allowedFields);

    try {
      const { columns, values } = await buildValues(req.body, schema.fields);
      if (!columns.length) {
        return res.status(400).json({ message: "No valid fields provided" });
      }

      const clause = columns.map((column) => `${columnName(column)} = ?`).join(", ");
      const [result] = await db.query(
        `UPDATE ${tableName(table)} SET ${clause} WHERE ${columnName(schema.id)} = ?`,
        [...values, req.params.id]
      );
      if (!result.affectedRows) {
        return res.status(404).json({ message: `${table} not found` });
      }

      const rows = await selectById(table, schema, req.params.id);
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async remove(req, res) {
    const schema = getSchema(table, allowedFields);

    try {
      const [result] = await db.query(
        `DELETE FROM ${tableName(table)} WHERE ${columnName(schema.id)} = ?`,
        [req.params.id]
      );
      if (!result.affectedRows) {
        return res.status(404).json({ message: `${table} not found` });
      }
      res.json({ message: `${table} deleted successfully` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
});

module.exports = createCrudController;
