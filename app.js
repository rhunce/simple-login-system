const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const app = express();
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash');
const session = require('express-session');

// Mongoose
mongoose.connect('mongodb://localhost/simpleLoginSystemApp',{useNewUrlParser: true, useUnifiedTopology : true})
.then(() => console.log('Database Connected: simpleLoginSystemApp'))
.catch((err)=> console.log(err));

//EJS
app.set('view engine','ejs');
app.use(expressEjsLayout);

//BodyParser
app.use(express.urlencoded({extended : false}));

//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

app.listen(3000, () => {
  console.log(`Listening on port 3000...`);
});