const db = require("../config/db");

const tableName = (name) => `\`${name}\``;

const buildSetClause = (body, allowedFields) => {
  const fields = allowedFields.filter((field) => body[field] !== undefined);
  return {
    fields,
    clause: fields.map((field) => `\`${field}\` = ?`).join(", "),
    values: fields.map((field) => body[field])
  };
};

const createCrudController = (table, allowedFields, listQuery) => ({
  async getAll(req, res) {
    try {
      const [rows] = await db.query(listQuery || `SELECT * FROM ${tableName(table)} ORDER BY id DESC`);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const [rows] = await db.query(`SELECT * FROM ${tableName(table)} WHERE id = ?`, [req.params.id]);
      if (!rows.length) {
        return res.status(404).json({ message: `${table} not found` });
      }
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async create(req, res) {
    try {
      const { fields, values } = buildSetClause(req.body, allowedFields);
      if (!fields.length) {
        return res.status(400).json({ message: "No valid fields provided" });
      }

      const placeholders = fields.map(() => "?").join(", ");
      const columns = fields.map((field) => `\`${field}\``).join(", ");
      const [result] = await db.query(
        `INSERT INTO ${tableName(table)} (${columns}) VALUES (${placeholders})`,
        values
      );
      const [rows] = await db.query(`SELECT * FROM ${tableName(table)} WHERE id = ?`, [result.insertId]);
      res.status(201).json(rows[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const { fields, clause, values } = buildSetClause(req.body, allowedFields);
      if (!fields.length) {
        return res.status(400).json({ message: "No valid fields provided" });
      }

      const [result] = await db.query(
        `UPDATE ${tableName(table)} SET ${clause} WHERE id = ?`,
        [...values, req.params.id]
      );
      if (!result.affectedRows) {
        return res.status(404).json({ message: `${table} not found` });
      }

      const [rows] = await db.query(`SELECT * FROM ${tableName(table)} WHERE id = ?`, [req.params.id]);
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async remove(req, res) {
    try {
      const [result] = await db.query(`DELETE FROM ${tableName(table)} WHERE id = ?`, [req.params.id]);
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
