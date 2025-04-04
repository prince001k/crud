import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import nodemailer from 'nodemailer';
import multer from 'multer';
import path from 'path';
import dotenv from "dotenv";
dotenv.config();





const app = express();
app.use(cors()); 
app.use(express.json()); 

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '',
  database: 'crud'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected');
});

app.post('/users/login', (req, res) => {
    const { username, password } = req.body;
    db.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                res.json({ message: 'Login successful' });
            } else {
                res.status(401).json({ message: 'Invalid username or password' });
            }
        }
    );
});

app.get('/users', (req, res) => {

  db.query('SELECT * FROM users', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/users', (req, res) => {
  const { username, email, password } = req.body;
  db.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, password],
    (err, result) => {
      if (err) throw err;
      res.json({ id: result.insertId, ...req.body });
    }
  );
});

app.put('/users/:id', (req, res) => {
  const { username, email, password } = req.body;
  db.query(
    'UPDATE users SET username=?, email=?, password=? WHERE id=?',
    [username, email, password, req.params.id],
    (err) => {
      if (err) throw err;
      res.json({ id: req.params.id, ...req.body });
    }
  );
});

app.delete('/users/:id', (req, res) => {
  db.query(
    'DELETE FROM users WHERE id=?',
    [req.params.id],
    (err) => {
      if (err) throw err;
      res.json({ message: 'User deleted' });
    }
  );
});




const upload = multer({ dest: "uploads/" });

app.post("/send-email", upload.single("file"), async (req, res) => {
  const { to, subject, message } = req.body;
  const file = req.file;

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
      attachments: file
        ? [
            {
              filename: file.originalname,
              path: file.path,
            },
          ]
        : [],
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});



const PORT = 8084;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
