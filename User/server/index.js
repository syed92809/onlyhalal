const express = require("express");
const cors = require("cors");
const pool = require("./database");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const saltRounds = 10; 

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//*************************************************************************************************************
// Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads"); // Save uploaded files to the 'uploads' directory
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });
  
  const upload = multer({ storage: storage });
  
  // Middleware
  app.use("/uploads", express.static("uploads"));
  app.use(
    session({
      secret: "FACEBOOK_APP_SECRET", // Use a secret key for session encryption
      resave: true,
      saveUninitialized: true,
    })
  );
//*************************************************************************************************************


// Function to validate email format
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
//************************************************************************************************************* */


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
//************************************************************************************************************* */


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
            password: user.rows[0].password,
        });
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
//************************************************************************************************************* */


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
//************************************************************************************************************* */


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
//************************************************************************************************************* */


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
//************************************************************************************************************* */


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
//************************************************************************************************************* */



const algorithm = 'aes-256-ctr';

// Function to generate a random 16-character string
const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Encryption function
const encrypt = (text, secretKey) => {
    const keyBuffer = Buffer.from(secretKey, 'hex'); // Convert hex string back to buffer
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return { iv: iv.toString('hex'), content: encrypted.toString('hex') };
};

// Decryption function
const decrypt = (hash, secretKey) => {
    const keyBuffer = Buffer.from(secretKey, 'hex'); // Convert hex string back to buffer
    const decipher = crypto.createDecipheriv(algorithm, keyBuffer, Buffer.from(hash.iv, 'hex'));
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
//************************************************************************************************************* */


//Retrieve card information route
app.get("/getUserCards", async (req, res) => {
    const { userId } = req.query;

    try {
        // Retrieve encrypted card details from the database
        const result = await pool.query(
            "SELECT card_type, card_number, expiry_date, cvv, secret_key FROM user_cards WHERE user_id = $1",
            [userId]
        );
        
        const cards = result.rows.map((card) => {
            // Decrypt each piece of card information
            const decryptedCardNumber = decrypt(JSON.parse(card.card_number), card.secret_key);
            const decryptedExpiryDate = decrypt(JSON.parse(card.expiry_date), card.secret_key);
            const decryptedCvv = decrypt(JSON.parse(card.cvv), card.secret_key);

            return {
                cardType: card.card_type,
                cardNumber: decryptedCardNumber,
                expiryDate: decryptedExpiryDate,
                cvv: decryptedCvv
            };
        });

        res.status(200).json({ success: true, cards: cards });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});
//************************************************************************************************************* */


//Update user profile information route
app.post("/updateProfile", async (req, res) => {
    const { userId, username, password, email } = req.body;

    try {
        // Update user details in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            "UPDATE users SET username = $1, password = $2, email = $3 WHERE user_id = $4",
            [username, hashedPassword, email, userId]
        );

        res.status(200).json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
//************************************************************************************************************* */


//Verify password change route
app.post("/verifyPassword", async (req, res) => {
    const { userId, password } = req.body;

    try {
        const user = await pool.query("SELECT password FROM users WHERE user_id = $1", [userId]);
        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        res.status(200).json({ success: true, message: 'Password verified' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
//************************************************************************************************************* */


//Place Order route
app.post("/placeOrder", async (req, res) => {
    const {
        userId,
        address,
        deliveryTime,
        item_name,
        item_category,
        subtotal,
        delivery_fee,
        total_amount,
        voucher,
        note,
        payment_method
    } = req.body;

    try {
        const newOrder = await pool.query(
            `INSERT INTO orders (user_id, address, delivery_time, item_name, item_category, subtotal, delivery_fee, total_amount, voucher, note, payment_method) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [userId, address, deliveryTime, item_name, item_category, subtotal, delivery_fee, total_amount, voucher, note, payment_method]
        );

        res.status(201).json({ success: true, message: 'Order placed successfully', order: newOrder.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});
//************************************************************************************************************* */


// Function to generate a random 4-digit code
const generateVerificationCode = () => {
    return Math.floor(1000 + Math.random() * 9000); 
  };
  
// Create a transporter using your email service provider's SMTP settings
const transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
    user: 'syed92809@gmail.com',
    pass: 'bljz vyvp yvzl vazd',
},
tls: {
    rejectUnauthorized: false,
},
});

// Define an endpoint to handle email sending
app.post('/forgotpassword', async (req, res) => {
// Extract data from the request body
const { email } = req.body;

try {

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      // Email doesn't exist in the users table
      return res.status(404).json({ success: false, message: 'Email not found' });
    }

    else{


    // Generate a random 4-digit code
    const verificationCode = generateVerificationCode();

    // Mail options with the verification code
    const mailOptions = {
    from: ' "Verify Email" <syed92809@gmail.com> ',
    to: email,
    subject: 'Only halal - Verify your email',
    html: `<h4> Your Verification Code : ${verificationCode} </h4>`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
    } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({ success: true, message: 'Email sent', verificationCode });
    }
    });
}

} catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
}
});


//************************************************************************************************************* */

//Update user profile information route
app.post("/resetPassword", async (req, res) => {
    const { password, email } = req.body;

    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password in the database
        await pool.query(
            "UPDATE users SET password = $1 WHERE email = $2",
            [hashedPassword, email]
        );

        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

//************************************************************************************************************* */

//Save food item route
app.post('/saveItem', async (req, res) => {
  const { item_id, userId } = req.body;
  try {
    // Check if the item is already saved
    const checkResponse = await pool.query(
      "SELECT * FROM saved_items WHERE item_id = $1 AND user_id = $2",
      [item_id, userId]
    );

    if (checkResponse.rowCount > 0) {
      // Item is already saved, so remove it
      await pool.query(
        "DELETE FROM saved_items WHERE item_id = $1 AND user_id = $2",
        [item_id, userId]
      );
      res.status(200).json({ success: true, message: 'Removed from Favorites' });
    } else {
      // Item is not saved, so add it
      await pool.query(
        "INSERT INTO saved_items(item_id, user_id) VALUES ($1, $2) RETURNING *",
        [item_id, userId]
      );
      res.status(200).json({ success: true, message: 'Added to Favorites' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


//fetch favourite items route
app.get("/getFavourites", async (req, res) => {
  const { userId } = req.query;
  try {
    const response = await pool.query(`
      SELECT si.*, rm.*, r.restaurant_name AS name
      FROM saved_items si
      JOIN restaurant_menu rm ON si.item_id = rm.id
      JOIN restaurants r ON rm.restaurant_id = r.id
      WHERE si.user_id = $1
    `, [userId]);

    if (response.rows.length > 0) {
      res.status(200).json({
        success: true,
        items: response.rows,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No favorite items found.",
      });
    }
  } catch (error) {
    console.error("Database query error", error);
    res.status(500).json({
      success: false,
      message: `An error occurred while fetching favorite items: ${error.message}`,
    });
  }
});

//Delete favourite item route
app.delete('/deleteItem', async (req, res) => {
  const { item_id, userId } = req.body;
  try {
    const response = await pool.query(
      "DELETE FROM saved_items WHERE item_id = $1 AND user_id = $2 RETURNING *",
      [item_id, userId]
    );
    if (response.rowCount > 0) {
      res.status(200).json({ success: true, message: 'Item removed from Favorites' });
    } else {
      res.status(404).json({ success: false, message: 'Item not found in Favorites' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


//************************************************************************************************************* */

// Get Restaurants Route
app.get("/restaurants", async (req, res) => {
    const response = await pool.query("SELECT * FROM restaurants");
    if (!response) {
      return res.status(404).json({
        success: false,
        message: "No Restaurants are found!",
      });
    } else {
      return res.status(200).json(response.rows);
    }
  });
  
  //Add restaurant menu route
  app.post("/addMenuItem", upload.single("image"), async (req, res) => {
    const { foodName, description, price, category, restaurantId } = req.body;
    const image = req.file.filename;
  
    try {
      // Insert the new menu item into the database
      const newMenuItem = await pool.query(
        "INSERT INTO restaurant_menu (food_name, description, price, category, image, restaurant_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [foodName, description, price, category, image, restaurantId]
      );
  
      res.status(201).json({
        success: true,
        message: "Menu item added",
        menuItem: newMenuItem.rows[0],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  });
  
  // Get MenuItems Route
  app.get("/menuItems", async (req, res) => {
    const response = await pool.query("SELECT * FROM restaurant_menu");
    if (!response) {
      return res.status(404).json({
        success: false,
        message: "No Menu found!",
      });
    } else {
      return res.status(200).json(response.rows);
    }
  });

  // Get Total 5 MenuItems Route
  app.get("/hotsales", async (req, res) => {
    try {
      const query = `
      SELECT
      rm.*,
      r.restaurant_name,
      array_agg(DISTINCT item_sizes.size) AS sizes,
      array_agg(DISTINCT item_extras.option) AS options
    FROM
      restaurant_menu rm
    JOIN
      restaurants r ON rm.restaurant_id = r.id
    LEFT JOIN
      item_sizes ON rm.id = item_sizes.item_id
    LEFT JOIN
      item_extras ON rm.id = item_extras.item_id
    GROUP BY
      rm.id, r.restaurant_name;    
      `;
      const response = await pool.query(query);
      if (response.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No Menu found!",
        });
      } else {
        return res.status(200).json(response.rows);
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  });  


  // Get single Menu Item Route
  app.get("/getItem/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const query = "SELECT * FROM restaurant_menu WHERE id = $1";
      const response = await pool.query(query, [id]);
      if (response) {
        return res.status(200).json(response.rows[0]);
      } else {
        res.status(404).send("Item not found");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });


  // Get MenuItems based on category Route
  const getRestaurantMenuByCategory = async (category) => {
    const query = `
      SELECT rm.*, r.restaurant_name, r.location 
      FROM restaurant_menu rm
      INNER JOIN restaurants r ON rm.restaurant_id = r.id
      WHERE rm.category = $1 
    `;
    const values = [category];
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (err) {
      console.error('Error executing query', err.stack);
      throw err;
    }
  };
  
  
  app.get('/nearby_items', async (req, res) => {
    const { category } = req.query;
    try {
      const items = await getRestaurantMenuByCategory(category);
      res.json(items);
    } catch (err) {
      res.status(500).send('Server error');
    }
  });

//************************************************************************************************************* */

//Add to cart route
app.post("/addToCart", async (req, res) => {
  const { item_id, user_id, image, name, price, quantity, total, size, options } = req.body;

  try {
    // Insert the new cart item into the database
    const newCartItem = await pool.query(
      "INSERT INTO addtocart (item_id, user_id, image, name, price, quantity, total, size, options) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [item_id, user_id, image, name, price, quantity, total, size, JSON.stringify(options)] 
    );

    res.status(201).json({
      success: true,
      message: "Item added to cart",
      cartItem: newCartItem.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

//************************************************************************************************************* */

// Fetch addtocart details route
app.get("/getCartItems", async (req, res) => {
  const userId = req.query.userId; 

  try {
    const getCartItems = await pool.query(
      "SELECT a.id,a.item_id, a.user_id, a.image,a.name,a.price,a.quantity,a.total,a.size,a.options,r.restaurant_name FROM public.addtocart a JOIN public.restaurant_menu m ON a.item_id = m.id JOIN public.restaurants r ON m.restaurant_id = r.id WHERE a.user_id = $1;",
      [userId] 
    );

    if (getCartItems.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Items in Cart!",
      });
    } else {
      return res.status(200).json(getCartItems.rows); 
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch items",
      error: error.message
    });
  }
});

//************************************************************************************************************* */




app.listen(4000, () => console.log("Listening on port 4000"));
