const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

// Secret key for signing JWT tokens (should be stored securely)
const secretKey = 'test';

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Mock user data (replace with your database logic)
const users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' }
];

// Login route to generate token
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) return res.status(401).send('Invalid username or password');

    const accessToken = jwt.sign({ username: user.username }, secretKey);
    res.json({ accessToken: accessToken });
});

// Protected route
app.get('/profile', authenticateToken, (req, res) => {
    res.json(req.user);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
