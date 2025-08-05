const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
// ✅ Router imports (relative to server.js)
const usersRouter = require('./routes/users.js');
const postsRouter = require('./routes/posts.js');
const sessionoptions = {
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,};
// 🔐 Session setup
app.use(session(sessionoptions));
const flash = require('connect-flash');

app.set("view engine", "ejs");
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'utils')]);
app.use(flash());
// 📌 Use routers
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

app.use((req, res, next) => {
    res.locals.successmessages = req.flash('info');
    res.locals.errormessages = req.flash('error');
    next();
});

app.get("/register", (req, res) => {
    let {name="anonymous"}= req.query;
  req.session.name= name;
  req.flash('info', `user registered successfully!`);
  if(name === "anonymous") {
    req.flash("error", "Please provide a valid name.");}
    else {
    req.flash("info","user registered successfully!");
  }
    res.redirect('/hello');
});

// 🎉 Hello route
app.get("/hello", (req, res) => {
  res.render('page', { name: req.session.name  } );
});


// 🧪 Test route
// app.get('/test', (req, res) => {
//     res.send('Test route is working!');
// });

// app.get("/reqcount", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   res.send(`Request count: ${req.session.count}`);
// });

// 🚀 Start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});