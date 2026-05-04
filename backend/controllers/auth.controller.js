const db = require("../config/db");

const sanitizeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Name, email, password, and role are required" });
  }

  if (!["student", "instructor"].includes(role)) {
    return res.status(400).json({ message: "Role must be student or instructor" });
  }

  try {
    const [existing] = await db.query("SELECT id FROM `user` WHERE email = ?", [email]);
    if (existing.length) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const [result] = await db.query(
      "INSERT INTO `user` (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, password, role]
    );
    const [rows] = await db.query("SELECT * FROM `user` WHERE id = ?", [result.insertId]);
    res.status(201).json({ user: sanitizeUser(rows[0]) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM `user` WHERE email = ? AND password = ?", [email, password]);
    if (!rows.length) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ user: sanitizeUser(rows[0]) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
