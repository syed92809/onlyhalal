const express = require("express");
const cors = require("cors");
const pool = require("./database");
const bcrypt = require("bcrypt");
const saltRounds = 10; 

const app = express();
app.use(express.json());
app.use(cors());

// Function to validate email format
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

//signup route
app.post("/signup", async (req, res) => {
    const username = req.body["username"];
    const email = req.body["email"];
    const password = req.body["password"];

    // Check if the email is in the correct format
    if (!validateEmail(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    try {
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Use parameterized query to prevent SQL injection
        const signup_query = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)";
        const response = await pool.query(signup_query, [username, email, hashedPassword]);

        console.log(response);
        res.status(200).json({ success: true, message: 'User signed up successfully' });
    } catch (error) {
        console.error(error);
        // Check for unique constraint violation (email already exists)
        if (error.constraint === "users_email_key") {
            res.status(409).json({ success: false, message: 'Email already exists, please try a different one.' });
        } else {
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
});
//login route
app.post("/login", async (req, res) => {
    const email = req.body["email"];
    const password = req.body["password"];

    // Check if the email is in the correct format
    if (!validateEmail(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        res.status(200).json({ success: true, message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});





app.listen(4000, () => console.log("Listening on port 4000"));
