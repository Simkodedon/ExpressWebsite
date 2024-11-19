const express = require('express');
const app = express();
const port = 3500;
const routes = require('./routes');
const bodyParser = require('body-parser');
const fs = require('fs');

// Detta är våran server.js fil som har till uppgift att tillhandla
// det logiska datat till presentations lagret.
// Det är också här vi skapar upp den lokala servern med hjälp av app.listen.(app refererar till Express( motsvarande http))

app.use(bodyParser.urlencoded({ extended : true }));
const static = express.static('public');
//app.use(express.static('./Laborationer'));
app.use(express.json());
app.use(express.static('./upload'));
app.use(static);
app.use(routes);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(port, () => {
    console.log(`Servern körs nu på : http://127.0.0.1:${port}/`);
});