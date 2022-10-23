const express = require('express')
const app = express();
const PORT = process.env.PORT || '8080'
const scrt = require("./routes/wa");
const secret = require("./controllers/waController");

//  Setting Path gaes
app.set('views', __dirname + '/view');
app.engine('html', require('ejs').renderFile);

// Ini untuk send Text
app.use('/secretext',secret);
// halaman utama
app.get('/', function (req, res)
{
    res.render('index.html');
});

app.set("port", PORT);