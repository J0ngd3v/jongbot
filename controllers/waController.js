const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const Parser = require("rss-parser");
const axios = require("axios");
const cheerio = require("cheerio");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox"],
  },
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  // console.log('QR RECEIVED', qr);
});

client.on("ready", () => {
  console.log("Sudah Siap");
});

client.on("message_create", async (message) => {
  if (message.body.startsWith(".artikel")) {
    try {
      const query = message.body.substring(8).trim(); // Mengambil query pencarian
      const articles = await scrapeRss();
      let response = "🔍Hasil Pencarian Artikel:\n\n";
      const matchedArticles = articles.filter((article) =>
        article.title.toLowerCase().includes(query.toLowerCase())
      );
      if (matchedArticles.length === 0) {
        response += "Belum ada artikel itu , mau ikut Kontribusi?";
      } else {
        matchedArticles.slice(0, 5).forEach((article) => {
          response += `${article.title}\n${article.link}\n\n`;
        });
      }
      message.reply(response);
    } catch (error) {
      console.error("Gagal melakukan scraping RSS:", error);
      message.reply("Terjadi kesalahan saat mengambil artikel.");
    }
  } else if (message.body === ".rules") {
    const rules =
      "Ini adalah rules grup:\n\n" +
      "1. jangan membuly (atmin nub) \n" +
      "2. Share link wajib yang bermanfaat \n" +
      "3. War jam 8 malam (wajib setiap malming) / setiap hari \n"+
      "4. webiste atmin : www.jongnesia.com"; 
    message.reply(rules);
  } else if (message.body === ".menu") {
    const menu =
      "Haii_< , Mau cari apa nih?\n\n" +
      "1. .artikel \n" +
      "2. .artikel {query} \n" +
      "3. .baca {url Artikel jongnesia.com} \n" +
      "4. .rules \n";
    message.reply(menu);
  }
});

client.on("message", async (message) => {
  if (message.body.startsWith(".baca ")) {
    const url = message.body.slice(6); // Mengambil URL setelah ".baca "

    try {
      const response = await axios.get(url);
      const { data } = response;

      const $ = cheerio.load(data);

      // Misalkan artikel berada dalam elemen dengan class "entry-content" atau "post-content"
      const articleContent = $(".scrap-artikel, .post-content");
      const content = articleContent.text();

      if (content) {
        // Kirim konten artikel sebagai balasan pesan
        await message.reply(content);
      } else {
        // Kirim pesan bahwa artikel tidak ditemukan
        await message.reply("Artikel tidak ditemukan.");
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error.message);
      // Kirim pesan kesalahan sebagai balasan pesan
      await message.reply("Terjadi kesalahan saat membaca artikel.");
    }
  }
});


const secret = async (req, res) => {
  let nohp = req.query.nohp;
  let pesan = req.query.pesan;
  const nama = req.query.nama;
  pesan =
    "✍ *Penulis* : " +
    "_" +
    nama +
    "_" +
    "\n" +
    "📨 *Pesan* :" +
    "\n" +
    "```" +
    pesan +
    "```" +
    "\n\n\n" +
    "© JongScreet";
  try {
    if (nohp.startsWith("0")) {
      nohp = "62" + nohp.slice(1) + "@c.us";
    } else if (nohp.startsWith("62")) {
      nohp = nohp + "@c.us";
    } else {
      nohp = "62" + nohp + "@c.us";
    }
    const user = await client.isRegisteredUser(nohp);
    if (user) {
      client.sendMessage(nohp, pesan);
      res.json({
        status: "200 ok",
        message: "Sukses Mengirim Pesan",
      });
    } else {
      res.json({
        status: "404 bad",
        message: "Nomor tidak terdaftar",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Gagal Mengirim",
    });
  }
};

async function scrapeRss() {
  const parser = new Parser();
  const feed = await parser.parseURL("https://jongnesia.com/post/index.xml");

  const articles = feed.items.map((item) => {
    return {
      title: item.title,
      link: item.link,
    };
  });

  return articles;
}

client.on('group_join', async (notification) => {
  const chat = await notification.getChat();

  const groupName = await chat.name;


  const welcomeMessage = `Selamat datang di grup ${groupName}, Member Baru! Kenalin admin ganteng @Risnanto (6282136600468) 🎉`;

  chat.sendMessage(welcomeMessage);
  const rules =
    "Ini adalah rules grup:\n\n" +
    "1. jangan membuly (atmin) \n" +
    "2. Ketemu nick (Pemula , Blast_ID) lock aja"+
    "3. Share link wajib yang bermanfaat \n" +
    "4. War jam 8 malam (wajib setiap malming) / setiap hari \n"+
    "5. webiste atmin : www.jongnesia.com"; 

  await chat.sendMessage(rules);

  const intro =
  "Yuk intro biar saling kenal \n\n"+
  "Nama : \n\n"+
  "Umur : \n\n"+
  "Asal : \n\n"+
  "Nick Game : \n\n"+
  "Main berapa jari: \n\n";
  await chat.sendMessage(intro);
});






client.initialize();

module.exports = secret;
