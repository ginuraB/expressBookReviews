const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Configure express-session for customer routes
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Authentication middleware for "/customer/auth/*" routes
app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.session.accessToken;  // Retrieve the token from the session

    // Check if token exists
    if (!token) {
        return res.status(401).json({ message: "Unauthorized access. Please log in." });
    }

    // Verify the JWT token
    jwt.verify(token, "your_jwt_secret_key", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden. Invalid token." });
        }
        req.user = decoded;  // Attach decoded information to the request
        next();
    });
});

const PORT = 5000;

// Define routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running on port " + PORT));
