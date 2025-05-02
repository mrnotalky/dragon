const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// In-memory user store
const users = {};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'dragonborn-secret',
  resave: false,
  saveUninitialized: true
}));
app.use(express.static('public'));

app.get('/', (req, res) => {
  if (req.session.username) {
    res.redirect('/dashboard');
  } else {
    res.sendFile(path.join(__dirname, '/public/login.html'));
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    req.session.username = username;
    res.redirect('/dashboard');
  } else {
    res.send('Invalid credentials. <a href="/">Try again</a>');
  }
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!users[username]) {
    users[username] = password;
    res.redirect('/');
  } else {
    res.send('Username already taken. <a href="/">Try again</a>');
  }
});

app.get('/dashboard', (req, res) => {
  if (req.session.username) {
    res.send(`<h1>Welcome, ${req.session.username}!</h1><a href="/logout">Logout</a>`);
  } else {
    res.redirect('/');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
