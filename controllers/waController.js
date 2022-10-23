const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth(),
    headless: true,
    args: [ '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote', '--single-process' ]
});
 
client.on('qr', (qr) => {
    qrcode.generate(qr,{small:true});
    // console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Sudah Siap');
});

client.initialize();

const secret = async (req,res) => {
    let nohp = req.query.nohp;
    let pesan = req.query.pesan;
    const nama = req.query.nama;
    pesan = "✍ *Penulis* : " + "_"+nama+"_" + "\n" +"📨 *Pesan* :"+"\n"+"```"+pesan+"```"+ "\n\n\n" + "© JongScreet" ;
    try {
    if(nohp.startsWith('0')){
        nohp = "62" + nohp.slice(1) + "@c.us";
    }else if(nohp.startsWith('62')){
        nohp = nohp + "@c.us";
    }else{
        nohp = "62" + nohp +  "@c.us";
    }
    const user = await client.isRegisteredUser(nohp);
    if(user){
        client.sendMessage(nohp , pesan);
        res.json({
            status: "200 ok",
            message: "Sukses Mengirim Pesan"
        });
    }else{
        res.json({
            status: "404 bad",
            message: "Nomor tidak terdaftar"
        });
    }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "Gagal Mengirim"
        });
    }
    
    
}

module.exports = secret;