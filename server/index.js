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
        const user = await pool.query("SELECT user_id, username, password FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        // Send the user ID and Username in the response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            userId: user.rows[0].user_id,
            username: user.rows[0].username,
        });
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


//Add new address route
app.post("/addNewAddress", async (req, res) => {
    const address = req.body["address"];
    const user_id = req.body["userId"];

    try {
        // Check if the address already exists for the given user
        const existingAddress = await pool.query(
            "SELECT * FROM addresses WHERE address = $1 AND user_id = $2",
            [address, user_id]
        );

        if (existingAddress.rows.length > 0) {
            // Address already exists, send a message to the user
            res.status(400).json({ success: false, message: 'Address already exists for this user' });
            return;
        }

        // If the address doesn't exist, insert it into the database
        const insertedAddress = await pool.query(
            "INSERT INTO addresses (address, user_id) VALUES ($1, $2) RETURNING *",
            [address, user_id]
        );

        const newAddress = insertedAddress.rows[0];
        res.status(200).json({ success: true, message: 'Address added', address: newAddress });
    } catch (error) {
        console.error(error);
        if (error.constraint === "addresses_address_key") {
            res.status(409).json({ success: false, message: 'Address already exists, please try a different one.' });
        } else {
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
});


//Retrieving data from addreesses table
app.get("/getUserAddresses", async (req, res) => {
    const userId = req.query.userId;

    try {
        const userAddresses = await pool.query(
            "SELECT * FROM addresses WHERE user_id = $1",
            [userId]
        );

        res.status(200).json({ success: true, addresses: userAddresses.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


app.listen(4000, () => console.log("Listening on port 4000"));
