// backend/index.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json()); // Allow backend to understand JSON data

// --- CONFIGURATION ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'root', // <--- REPLACE THIS WITH YOUR PASSWORD
    database: 'student_board'
});

// --- ROUTES (CRUD) ---

// 1. GET (Read all assignments)
app.get('/tasks', (req, res) => {
    const sql = "SELECT * FROM assignments";
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    });
});

// 2. POST (Create a new assignment)
app.post('/tasks', (req, res) => {
    const sql = "INSERT INTO assignments (`subject`, `topic`, `deadline`) VALUES (?)";
    const values = [
        req.body.subject,
        req.body.topic,
        req.body.deadline
    ];
    db.query(sql, [values], (err, data) => {
        if(err) return res.json(err);
        return res.json("Assignment added successfully");
    });
});

// 3. PUT (Update status to Completed)
app.put('/tasks/:id', (req, res) => {
    const sql = "UPDATE assignments SET completed = ? WHERE id = ?";
    // We toggle the status (if sent as true/false from frontend)
    db.query(sql, [req.body.completed, req.params.id], (err, data) => {
        if(err) return res.json(err);
        return res.json("Status updated");
    });
});

// 4. DELETE (Remove assignment)
app.delete('/tasks/:id', (req, res) => {
    const sql = "DELETE FROM assignments WHERE id = ?";
    db.query(sql, [req.params.id], (err, data) => {
        if(err) return res.json(err);
        return res.json("Assignment deleted");
    });
});

// Start Server
app.listen(8800, () => {
    console.log("Backend server is running on port 8800!");
});