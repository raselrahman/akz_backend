import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // ✅ your MySQL username
  password: "",       // ✅ your MySQL password (set it if you have one)
  database: "test"    // ✅ the database you just created
});


// ✅ API route
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

  db.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Server error" });
      if (results.length > 0) {
        res.json({ success: true, message: "Login successful" });
      } else {
        res.json({ success: false, message: "Invalid credentials" });
      }
    }
  );
});



// -------------------------------
// CRUD API for Students
// -------------------------------

// Get all students
app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) return res.status(500).json({ error: "Server error" });
    res.json(results);
  });
});

// Add a new student
app.post("/students", (req, res) => {
  const { name, year, level, address, contact } = req.body;
  db.query(
    "INSERT INTO students (name, year, level, address, contact) VALUES (?, ?, ?, ?, ?)",
    [name, year, level, address, contact],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Server error" });
      res.json({ id: result.insertId, name, year, level, address, contact });
    }
  );
});

// Update a student
app.put("/students/:id", (req, res) => {
  const { id } = req.params;
  const { name, year, level, address, contact } = req.body;
  db.query(
    "UPDATE students SET name=?, year=?, level=?, address=?, contact=? WHERE id=?",
    [name, year, level, address, contact, id],
    (err) => {
      if (err) return res.status(500).json({ error: "Server error" });
      res.json({ success: true });
    }
  );
});

// Delete a student
app.delete("/students/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM students WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Server error" });
    res.json({ success: true });
  });
});

// Optional: Search students by name or ID
app.get("/students/search", (req, res) => {
  const { query } = req.query;
  db.query(
    "SELECT * FROM students WHERE name LIKE ? OR id LIKE ?",
    [`%${query}%`, `%${query}%`],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Server error" });
      res.json(results);
    }
  );
});


// ✅ start server
app.listen(5000, () => console.log("Backend running at http://localhost:5000"));
