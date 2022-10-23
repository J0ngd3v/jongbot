const express = require('express')
const app = express()
const port = 3000
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
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 