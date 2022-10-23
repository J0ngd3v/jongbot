const exspress = require('express');

const scrt = exspress.Router();

scrt.get("/secretext", (req , res) =>{
    res.json({
        status: "Oke",
        author: "JongDev" 
    });
});

module.exports = scrt;