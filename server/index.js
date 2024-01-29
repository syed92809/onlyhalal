const express = require("express");
const cors = require("cors");
const pool = require("./database");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
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
        const user = await pool.query("SELECT user_id, username, email, password FROM users WHERE email = $1", [email]);

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
            email: user.rows[0].email,
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



//Add restraunt registration information route
app.post("/addRestaurantInformation", async (req, res) => {
    const { businessName, contactDetails, location, workingHours, branches } = req.body;

    try {
        const existingRestaurant = await pool.query(
            "SELECT * FROM restaurants WHERE restaurant_name = $1",
            [businessName]
        );

        if (existingRestaurant.rows.length > 0) {
            return res.status(409).json({ success: false, message: 'Restaurant Name already exists' });
        }

        const newRestaurant = await pool.query(
            "INSERT INTO restaurants (restaurant_name, contact_details, location, working_hours, branches) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [businessName, contactDetails, location, workingHours, branches]
        );

        res.status(201).json({ success: true, message: 'Restaurant added', restaurant: newRestaurant.rows[0] });
    } catch (error) {
        console.error(error);
        if (error.constraint === "restaurants_restaurant_name_key") {
            res.status(409).json({ success: false, message: 'Restaurant Name already exists, please try a different one.' });
        } else if (error.constraint === "restaurants_contact_details_key") {
            res.status(409).json({ success: false, message: 'Contact Number already exists, please try a different one.' });
        } else {
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
});


//Add restaurant menu route
app.post("/addMenuItem", async (req, res) => {
    const { foodName, description, price, category, image, restaurantId } = req.body;

    try {
        // Insert the new menu item into the database
        const newMenuItem = await pool.query(
            "INSERT INTO restaurant_menu (food_name, description, price, category, image, restaurant_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [foodName, description, price, category, image, restaurantId]
        );

        res.status(201).json({ success: true, message: 'Menu item added', menuItem: newMenuItem.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});


//Storing card details information route

const algorithm = 'aes-256-ctr';

// Function to generate a random 16-character string
const generateSecretKey = () => {
    return crypto.randomBytes(8).toString('hex'); // 8 bytes = 16 hex characters
};

// Encryption function
const encrypt = (text, secretKey) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return { iv: iv.toString('hex'), content: encrypted.toString('hex') };
};

// Decryption function
const decrypt = (hash, secretKey) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    return decrypted.toString();
};

app.post("/addCard", async (req, res) => {
    const { userId, cardType, cardNumber, expiryDate, cvv } = req.body;

    try {
        // Generate a new secret key for each encryption
        const secretKey = generateSecretKey();

        // Encrypt card details
        const encryptedCardNumber = encrypt(cardNumber, secretKey);
        const encryptedExpiryDate = encrypt(expiryDate, secretKey);
        const encryptedCvv = encrypt(cvv, secretKey);

        // Inserting encrypted card details into the database
        const newCard = await pool.query(
            "INSERT INTO user_cards (user_id, card_type, card_number, expiry_date, cvv, secret_key) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [userId, cardType, JSON.stringify(encryptedCardNumber), JSON.stringify(encryptedExpiryDate), JSON.stringify(encryptedCvv), secretKey]
        );

        res.status(201).json({ success: true, message: 'Card added successfully', card: newCard.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.listen(4000, () => console.log("Listening on port 4000"));
