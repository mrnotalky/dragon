const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Temporary user store
const users = {};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'baddragonborn-secret',
  resave: false,
  saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  if (req.session.username) {
    res.redirect('/dashboard');
  } else {
    res.sendFile(path.join(__dirname, 'public/login.html'));
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    req.session.username = username;
    res.redirect('/dashboard');
  } else {
    res.send('Invalid login. <a href="/">Try again</a>');
  }
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!users[username]) {
    users[username] = password;
    res.redirect('/');
  } else {
    res.send('Username taken. <a href="/">Try again</a>');
  }
});

app.get('/dashboard', (req, res) => {
  if (req.session.username) {
    res.render('dashboard', { username: req.session.username });
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
  console.log(`Server running on port ${PORT}`);
});
