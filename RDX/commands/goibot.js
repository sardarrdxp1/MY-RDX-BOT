const fs = global.nodemodule["fs-extra"];
module.exports.config = {
  name: "goibot",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
  description: "goibot",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 5,
};
module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  var { threadID, messageID, reason } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Kolkata").format("HH:MM:ss L");
  var idgr = `${event.threadID}`;
  var id = event.senderID;
  var name = await Users.getNameUser(event.senderID);

  var tl = ["Haye Main Sadke jawa Teri Masoom Shakal pe baby 💋 " , "Bot Nah Bol Oye Janu bol Mujhe " , "Bar Bar Disturb Na KRr JaNu Ke SaTh Busy Hun 🤭🐒" , "Main gariboo se baat nahi karta 😉😝😋🤪" , "Itna Na Pass aa Pyar ho Jayga" , "Bolo Baby Tum Mujhse Pyar Karte Ho Na 🙈💋💋 " , "Are jaan Majaak ke mood me nhi hu main jo kaam hai bol do sharmao nahi" , "Bar Bar Bolke Dimag Kharab Kiya toh. Teri ...... Mummy Se Complaint Karunga" , "Tu Bandh nhi Karega kya?" , "Gali Sunna H kya?😜" , "Teri Maa Ki Bindiya🤭" , "Aree Bandh kar Bandh Kar" , "M hath jod ke Modi Ji Se Gujarish Karta hu" , "Tujhe Kya koi aur Kam nhi ha? Puradin Khata hai Aur Messenger pe Bot Bot Karta h" , " Priyansh Ko Bol Dunga Me Mujhe Paresan Kiya To" , "Tum Na Single Hi Maroge" , "Tujhe Apna Bejjati Karne Ka Saukh hai?" , "Abhi Bola Toh Bola Dubara Mat Bolna" , "Teri To Ruk Tu Bhagna Mat" , "Bol De koi nahi dakh rha 🙄" , "Haaye Main Mar Jawa Babu Ek Chuma To Do Kafi Din Se Chumi Nahi Di 😝" , "Dur Hat Be  Mujhe Aur Koi Kam Nahi Kya Har Waqat Mujhy Tang Kerte Rhte ho 😂" , "Are Bolo Meri Jaan Kya Hall Hai😚 " , "Ib Aja Yahan Nhi Bol Sakta 🙈😋" , "Mujhe Mat BuLao Naw Main buSy Hu Naa" , "Bot Bolke Bejjti Kar Rahe Ho yall...Main To Tumhare Dil Ki Dhadkan Hu Na Baby...💔🥺" , "Are Tum Wahi ho nah Jisko Main Nahi Janta 🤪" , "Kal Haveli Pe Mil Jara Tu 😈" , "Aagye Salle Kabab Me Haddi 😏" , "Bs Kar U ko Pyar Ho Na Ho Mujhe Ho Jayga Na" , "FarMao 😒" , "BulaTi Hai MaGar Jaane Ka Nhi 😜" , "Main To Andha Hun 😎" , "Phle NaHa kar Aa 😂" , "Aaaa Thooo 😂😂😂" , "Main yahin hoon kya hua sweetheart ," , "chomu Tujhe Aur Koi Kaam Nhi H? Har Waqt Bot Bot Karta H" , "Chup Reh, Nhi Toh Bahar Ake tera Dath Tor Dunga" , "WaYa KaRana Mere NaL 🙊" , "MaiNy Uh Sy Bt Nhi kRrni" , "MeKo Kxh DiKhai Nhi Dy Rha 🌚" , "Bot Na BoL 😢 JaNu B0ol 😘 " , "Bar Bar Disturb Na KRr JaNu Ke SaTh Busy Hun  😋" , "Main Gareebon Sy Bt Nhi kRta 😉😝😋🤪" , "Itna Na Pass aa Pyar h0o JayGa" , "MeKo Tang Na kRo Main Kiss 💋 KRr DunGa 😘 " , "Ary yrr MaJak Ke M0oD Me Nhi Hun 😒" , "HaYe JaNu Aow Idher 1 PaPpi Idher d0o 1 PaPpi Idher 😘" , "Dur HaT Terek0o 0or K0oi Kam Nhi Jb DeKho Bot Bot ShaDi KerLe Mujhsy 😉😋🤣" , "TeRi K0oi Ghr Me Nhi SunTa T0o Main Q SuNo 🤔😂 " , "IB Aja Yahan Nhi B0ol Salta 🙈😋" , "Mujhe Mat BuLao Naw Main buSy h0o Naw" , "Kyun JaNu MaNu Another Hai 🤣" , "Are TuMari T0o Sb he baZzati kRrty Me Be kRrDun 🤏😜" , "KaL HaVeLi Prr Aa ZaRa T0o 😈" , "Aagye SaJJy KhaBBy Sy 😏" , "Bx KRr Uh k0o Pyar H0o Na H0o Mujhe H0o JayGa" , "FarMao 😒" , "BulaTi Hai MaGar JaNy Ka Nhi 😜" , "Main T0o AnDha Hun 😎" , "Phle NaHa kRr Aa 😂" , "Papi ChuLo 🌚" , "TeRek0o DiKh Nhi Rha Main buSy Hun 😒" , "TeRa T0o GaMe BaJana PreGa" , "Ta Huwa 🥺"  , "TuM Phr AaGye 🙄 Kisi 0or Ny Muu Nhi LaGaYa Kya🤣🤣🤣" , "MeKo JaNu Chai Hai Tum Single H0o?" , "Aaaa Thooo 😂😂😂" , "Main S0o Rha Hun " , "Ase He HansTy Rha kRo 😍" , "•••••••••••••••••••••••••••••🦢𒀱卄ɅƔƏ MɅ🅘ɳ ʍɅᏒ••••🌿💞 JɅωɅ ┼ƏᏒ🅘 ʍɅ🅢𝖚ʍ 🅢ɅҠɅɭ 𝐩Ə ɮɅɮƔ 💋 " , "Bot Na Bol Oye Janu bol Mujhe " , "Bar Bar Disturb Na Karen Rahul JaNu Ke SaTh Busy Hun 🤭🐒" , "Main flirty logo Sy Bt Nhi karti 😉😝😋🤪" , "Itna Pass mat aa Pyaar h0 JayGa" , "Bolo Babu Tum Mojy Pyar Karte Ho Na 🙈💋💋 " , "Are jaan Majaak ke mood me nahi hun main jo kaam hai bol do sharmao nahi" , "han ji bolo kya seva karne aapki 😶🤍" , "Tu Bandh nhi Karega kya?" , "kya Sunna Hai apko mere se flirty kahike🤐🤣 " , "Haa ji boliye kya kam he hamse 🙈" , "Aree band kar band Kar" , "Mein hath jod ke Modi Ji Se Gujarish Karta hu mojy na bolaye" , "Tujhe Kya koi aur Kam nhi ha? Puradin sota he Aur Messenger pe Bot Bot Karta h" , " mera owner Ake tera bf/gf Ko Chura le Jayega" , "Bot bot hi karta rahna tu bas" , "Tujhe Apna Bejjati Karne Ka Saukh hai?🥹" , "Abhi Bola Toh Bola Dubara Mat Bolna🙄" , "Teri to Watt lagani padegi " , "Bol De koi nahi dakh rha 🙄" , "Haaye Main Mar Jawa Babu Ek Chuma To Do Kafi Din Se Chumi Nahi Di 😝" , "Dur Hat Be  Mujhe Aur Koi Kam Nahi Kya Har Waqat Mujhy Tang Kerte Rhte ho 😂" , "Are Bolo Meri Jaan Kya Hall Hai😚 " , "IB Aja Yahan Nhi B0ol Sakti 🙈😋" , "Mujhe Mat BuLao Na Main buSy h0 Now" , "Bot Bolke Bejjti Kar Rahe ho yall...Main To Tumhare Dil Ki Dhadkan Hu Baby...💔🥺" , "Are Tum Wahi ho nah Jisko Main Nahi Janti 🤪" , "Kal Haveli Pe Mil Jra Tu 😈" , "Aagye SaJJy KhaBBy Sy 😏" , "Bx KRr Uh k0o Pyar H0o Na H0o Mujhe H0o JayGa" , "bolo 😒" , "BulaTi Hai MaGar JaNy Ka Nhi 😜" , "Main T0o AnDha Hun 😎kya likha tumne mene nahi dikha🤣" ,  "Pahale NaHa kar Aa 😂" , "Aaaa Thooo 😂😂😂" , "Main yahi hoon kya hua sweetheart🥂🙈💞 ," , "AA Dk Tujhe Aur Koi Kaam Nhi Hai? Har Waqt Bot Bot Karta H" , "Chup Reh, Nahi Toh Bahar Ake tera Dath Tor Dunga🤣✊" , "yes my love 💘" , "kya hua baby ko 😘😘" , "mujhe sharam ati hai aise aap bolte hai tho 🤭😝" , "aree aap wahi ho na jo mujhe line marte the.......🤣 ya bali line" , "jii kahiye jii 🙄 kya chahiye" , "hayee main mar jye teri masoom shaqal py 😂 tuzy Chapple se kutne ka mn ho raha hai🤣👠" , "Bot nah bol oye 😭 Janu bol mjhy aur janu sy piyar sy bat kerty hai😑" , "ruk tu chappal kaha he mari🩴" , "shakal Sy masoom lgty ho 😂 but bohot flirty ho" , "kash tum single hote to maza hi koch aur tha pagal insaan 😂" , "Ha ha ab meri yaad ab ai nah phly to babu shona kerna gy thy 😾 ab ham ap sy naraz hai jao ap bye ☹️" , "haiy babu ne boldiya hai shaid purpose kerna hai mujhe bolo bolo babu 😘" , "Aree pagal roti banana ke le aty main Pani ko istamal kerte ho 😂" , "Ary joke nah mar jo bhi kam hai bol do sharma nahi , bol de koi nahi dakh rha 😂" , "Hayee Mar Jawa Babu Ak Chuma To Doo Kafi Din Sy Chumi Nahi Mili Kahan Thy Babu inbox Ah Jao 😚🙈♥️" , "Dur Dur karib na a  tujhe Aur Koi Kam Nahi Kiya Har Waqat Mjhy Tang Karte Rahte Ho 😂" , "ary ary bolo meri jaan kia haal hai ;) ;* " , "Tum aunty ho yehh uncle 🤔 I think tum Jin ho yehh Chudail🤣✅" , "ary tum ider 🤔 khair hai ider kia ker rhy ho 😂" , "ary babu babu kal hawali py kon bola rha tha 😂" , "Me Aap ki mummy ji ko btaou ga Aap Facebook use karty ho 😂" , "ary tum Wohi ho nah jis ko ma nahi janta 🤣✅" , "haveli per  kal mil  Zara bataunga 🌚😂Ha but उल्टी-सीधी harkat karne ke liye nahi" , "itne pyar se Na bulao pyar Ho jaega 😶💗 wtf Maine apni sacchai Bata Di yah Maine kyon Kiya 😭🔪....Fuuu..🚬" , "aap aise mat bulo hame sharam aati hai 🙈♥️" , "kyun Bulaya hamen..😾🔪 " , "kyun Bulaya hamen..😾🔪 "];
  var rand = tl[Math.floor(Math.random() * tl.length)]

    if ((event.body.toLowerCase() == "chutiya bot") || (event.body.toLowerCase() == "chutiye bot") || (event.body.toLowerCase() == "chumtiya bot") || (event.body.toLowerCase() == "chumtiye bot")) {
     return api.sendMessage("Hmm... Tu Chutiya PhLe Ungli Kyun Ki Chomu 😾", threadID);
   };

   if ((event.body.toLowerCase() == "🤮") || (event.body.toLowerCase() == "🤮")) {
     return api.sendMessage("Konsa mahina chal raha hai 😝", threadID);
   };

    if ((event.body.toLowerCase() == "🤗") || (event.body.toLowerCase() == "🤗")) {
     return api.sendMessage("Hug me baby ☺️", threadID);
   };

     if ((event.body.toLowerCase() == "sim") || (event.body.toLowerCase() == "simsimi")) {
     return api.sendMessage("Prefix Kon Lagayega? Pehle Prefix Lagao Fir Likho Sim", threadID);
   };
  
   if ((event.body.toLowerCase() == "hi") || (event.body.toLowerCase() == "hello") ||(event.body.toLowerCase() == "hlw") || (event.body.toLowerCase() == "helo")) {
     return api.sendMessage("Hello, Hi, Bye bye. Ye sab ke alawa kuch bolna nhi ata Kya tujhe", threadID);
   };

   if ((event.body.toLowerCase() == "bc") || (event.body.toLowerCase() == "bc")) {
     return api.sendMessage("Ye Bc Kya HoTa Hai 🤔 ", threadID);
   };

if ([
    "assalamualaikum", 
    "assalam alaikum", 
    "aoa", 
    "a.o.a", 
    "asalam o alaikum", 
    "asalamualaikum", 
    "asalam alikum", 
    "assalamu alaikum", 
    "assalamu-alaikum", 
    "asalam wa alaikum", 
    "asslamualaikum", 
    "asslam o alaikum", 
    "aslam alaikum", 
    "asalamo alaikum", 
    "assalam o alaikum", 
    "assalamo alaikum", 
    "slm", 
    "slam", 
    "slamo alikum", 
    "salaam alaikum", 
    "asslam.o.alaikum", 
    "a.s.s.a.l.a.m", 
    "aslaam o alikum", 
    "aslam.o.alaikum", 
    "assalamwalykum", 
    "asslam.walikum", 
    "assalam alaykum", 
    "assalam.walaikum", 
    "a-s-s-a-l-a-m", 
    "slms"
].includes(event.body.toLowerCase())) {
    return api.sendMessage("وَعَلَيْكُمُ ٱلسَّلَامُ وَرَحْمَةُ ٱللَّهِ وَبَرَكاتُهُ", threadID);
}  
   if ((event.body.toLowerCase() == "lol") || (event.body.toLowerCase() == "lol bot")) {
     return api.sendMessage("Khud ko Kya LeGend Samjhte Ho 😂", threadID);
   };
if ([
    "good evening", 
    "evening", 
    "gd evening", 
    "gud evening", 
    "ge", 
    "g.e", 
    "evenin"
].includes(event.body.toLowerCase())) {
    return api.sendMessage("Good Evening! I hope you’re having a wonderful time.", threadID);
}
  if ([
    "i love you bot", 
    "bot i love you", 
    "i love you"
].includes(event.body.toLowerCase())) {
    return api.sendMessage("Yaar, Mujhe aisi baatein nahi pasand. Main buhat shreef hoon. Haan, mera owner single hai, bolo to number tak de sakta hoon. 😁", threadID);
  }
 if ([
    "bot i miss you", 
    "i miss you bot", 
    "miss you"
].includes(event.body.toLowerCase())) {
    return api.sendMessage("Hyeee, I miss you too! SuChi kia karun, ID issue aa jata hai is liye mujhe new ID banne ka wait karna padta hai. Jab new ID banti hai, to owner mujhe add kar deta hai. 😅", threadID);
}
 if ([
    "bot kis na add kiya", 
    "bot kisne add kiya", 
    "bot kis ne add kiya", 
    "bot ko kisne add kiya",
    "bot ko kis ne add kiya", 
    "bot add kisne kiya", 
    "kisne bot ko add kiya", 
    "kis na bot ko add kiya", 
    "bot ko kisne add kiya", 
    "bot kis ne add kiya?"
].some(phrase => event.body.toLowerCase().includes(phrase))) {
    return api.sendMessage("Kio kia howa, add ho gaya so ho gaya. Ma ap ko kia taqleef hy jnab 👻. Waisay ap bhi khelo na, bot bot! 😄 Mera owner single hai, bolo to number tak de sakta hoon! 😁", threadID);
 }
  
  if ([
    "how are you", 
    "how r u", 
    "how are u", 
    "how's it going", 
    "kese ho", 
    "kese hain", 
    "kese ho ap", 
    "ap kese ho", 
    "ap kaise ho", 
    "kaise hain aap", 
    "kaise ho", 
    "how do you do", 
    "what's up", 
    "sup", 
    "kya haal hain", 
    "kya hal hain", 
    "hal chal", 
    "hal kya hai", 
    "kya chal raha hai", 
    "kya scene hai", 
    "what's going on", 
    "kya ho raha hai", 
    "kaise ho tum", 
    "tum kaise ho", 
    "kya haal he"
].includes(event.body.toLowerCase())) {
    return api.sendMessage("Main theek hoon, aap kaise hain? Umeed karta hoon ke aap ka din acha guzray ga.", threadID);
  }
  if ((event.body.toLowerCase() == "morning") || (event.body.toLowerCase() == "good morning")) {
    return api.sendMessage("Good Morning! 🌞 بہت خوش آمدید! 🙌 امید کرتا ہوں کہ آپ کا دن خوشگوار گزرے، اللہ پاک آپ کو ہر برائی سے بچائے، آپ کو اپنی حفظ و امان میں رکھے، اور کبھی کسی کا محتاج نہ کرے! آمین! 🤲💫💕💪🌻☕✨", threadID);
}
   if ((event.body.toLowerCase() == "morning") || (event.body.toLowerCase() == "good morning")) {
     return api.sendMessage("Ꮆɵɵɗ Ɱ❍ɽƞɪɪƞɠ Ɛⱱɛɽɣ❍ƞɛ🌅, Ƭɽɣ ꌗɵɱɛ Cɵffɛɛ ❍ɽ Ƭɛɑ Ƭ❍ Ꮗɑҡɛ Uƥ☕✨💫", threadID);
   };

   if ((event.body.toLowerCase() == "anyone") || (event.body.toLowerCase() == "any")) {
     return api.sendMessage("Main Hun Naw Jaaneman ❤️", threadID);
   };

   if ((event.body.toLowerCase() == "Kashif") || (event.body.toLowerCase() == "Raza") || (event.body.toLowerCase() == "raza") || (event.body.toLowerCase() == "Janu")) {
     return api.sendMessage( "Busy HoGa Work Me Main t0o Hun Naw 😘",threadID);

       
   };

   if ((event.body.toLowerCase() == "jajsiiakwkwk") || (event.body.toLowerCase() == "jejsksksk")) {
     return api.sendMessage("💝🥀𝐎𝐖𝐍𝐄𝐑:- ☞꧁𝐙𝐚𝐢𝐧𝐢-𝐉𝐮𝐭𝐭꧂☜ 💫\n🖤𝚈𝚘𝚞 𝙲𝚊𝚗 𝙲𝚊𝚕𝚕 𝙷𝚒𝚖 ℤ𝔸𝕀ℕ ℙℝ𝕀ℕℂ𝔼🖤\n😳𝐇𝐢𝐬 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐢𝐝🤓:- ☞https://www.facebook.com/profile.php?id=100086033644262&mibextid=ZbWKwL \n👋For Any Kind Of Help Contact On Telegram  Username 👉 @zainijutt7😇", threadID);
   };

   if ((event.body.toLowerCase() == "tumhe banwwawya kon hai") || (event.body.toLowerCase() == "ww bawnaya kisne")) {
     return api.sendMessage("Zaini jutt  ❤️ My Creator. He loves me & Edit Me Daily. Ye Bot Sirf Owner k Liye h. Mujhe Aap logo ko Hasane k liye banya gya h Toh Muh Ladkaye Mat Rakkha Karo. Har Waqt Haste Raho.", threadID);
   };

  if ((event.body.toLowerCase() == "bot admwin") || (event.body.toLowerCase() == "bot ka wwadmin kon ha")) {
     return api.sendMessage("He is zain. He Gives his name zain everywhare", threadID);
   };

   if ((event.body.toLowerCase() == "shadi karge") || (event.body.toLowerCase() == "mujhse shadi karoge?")) {
     return api.sendMessage("hanji, karunga lekin baccha. apke pet m hoga. manjur h?", threadID);
   };

   if ((event.body.toLowerCase() == "chup") || (event.body.toLowerCase() == "stop") || (event.body.toLowerCase() == "chup ho ja") || (event.body.toLowerCase() == "chup kar")) {
     return api.sendMessage("Nhi rahunga. 😼 Mujhe Bolna H. Tumhe Koi Haq nhi Mujhe Chup Karane ka. Mera Zuban. M Bolunga", threadID);
   };

   if ((event.body.toLowerCase() == "bts") || (event.body.toLowerCase() == "btc")) {
     return api.sendMessage("Tu H Btc. Bhos DK", threadID);
   };

   if ((event.body.toLowerCase() == "malik se bakchodi") || (event.body.toLowerCase() == "malik se backchodi") || (event.body.toLowerCase() == "malkin se bakchodi") || (event.body.toLowerCase() == "malkin se backchodi")) {
     return api.sendMessage("srry malik maaf kr do ab nhi kruga 🥺🙏", threadID);
   };

   if ((event.body.toLowerCase() == "gand") || (event.body.toLowerCase() == "gandu") || (event.body.toLowerCase() == "lund") || (event.body.toLowerCase() == "land")) {
     return api.sendMessage("Gand m jyada khujli h toh banana 🍌 under le le. :))))", threadID);
   };

   if ((event.body.toLowerCase() == "chumma de") || (event.body.toLowerCase() == "kiss me")) {
     return api.sendMessage("️Kis khushi me, Me sirf Apni gf ko kiss karta hu", threadID);
   };

   if ((event.body.toLowerCase() == "nice") || (event.body.toLowerCase() == "thank you") || (event.body.toLowerCase() == "thank you bot") || (event.body.toLowerCase() == "thank you maliha")) {
     return api.sendMessage("️M hu hi itni Accha. sab log Tarref karte hai meri.", threadID);
   };

   if ((event.body.toLowerCase() == "😡") || (event.body.toLowerCase() == "😤") || (event.body.toLowerCase() == "😠") || (event.body.toLowerCase() == "🤬") || (event.body.toLowerCase() == "😾")) {
     return api.sendMessage("️🥺 M toh Sirf Mazak Kr Rha Tha🥺. Gussa Mat Karo. Ek Chummi Lo aur Shant Raho 😘", threadID);
   };

   if ((event.body.toLowerCase() == "😞") || (event.body.toLowerCase() == "😔") || (event.body.toLowerCase() == "😣") || (event.body.toLowerCase() == "☹️") || (event.body.toLowerCase() == "😟") || (event.body.toLowerCase() == "😩") || (event.body.toLowerCase() == "😖") || (event.body.toLowerCase() == "😫") || (event.body.toLowerCase() == "😦") || (event.body.toLowerCase() == "😧") || (event.body.toLowerCase() == "😥") || (event.body.toLowerCase() == "😓") || (event.body.toLowerCase() == "😰")) {
     return api.sendMessage("️Kya huva, Sad kyu ho, Mujhe batao", threadID);
   };


   if ((event.body.toLowerCase() == "hm") || (event.body.toLowerCase() == "hmm")) {
     return api.sendMessage("️Hmm Hmm Na Karke Sidha Sidha bolo. Hey Marry Me🙈", threadID);
   };

   if ((event.body.toLowerCase() == "😢") || (event.body.toLowerCase() == "😭") || (event.body.toLowerCase() == "🥺") || (event.body.toLowerCase() == "🥹")) {
     return api.sendMessage("️Kya huva, Ro kyu rahe ho, Me huna to phir kyu rona. Ruko me abhi chocolate 🍫 deta hu likho ☞Chocolate☜", threadID);
   };

   if ((event.body.toLowerCase() == "😷") || (event.body.toLowerCase() == "🤕") || (event.body.toLowerCase() == "🤧") || (event.body.toLowerCase() == "🤒")) {
     return api.sendMessage("️Kya huva, Tabiyat kharab hai kya, Mujhe batao me abhi medicine 💊💉 le aata hu😇", threadID);
   };

   if ((event.body.toLowerCase() == "name") || (event.body.toLowerCase() == "naam") || (event.body.toLowerCase() == "nam")) {
     return api.sendMessage("️Name m kya rakkha h. tum kam pe dhyan do.", threadID);
   };

   if ((event.body.toLowerCase() == "bot k bacche") || (event.body.toLowerCase() == "bot ke bacche")) {
     return api.sendMessage("️meri baccha toh Tumhare Pet Me Hai.", threadID);
   };

   if ((event.body.toLowerCase() == "pic do") || (event.body.toLowerCase() == "photo do")) {
     return api.sendMessage("️Me toh Andha Hu Dekh nhi sakta", threadID);
   };

   if ((event.body.toLowerCase() == "jai shree awwwram") || (event.body.toLowerCase() == "ramwqw") || (event.body.toLowerCase() == "rawm rawwm")) {
    return api.sendMessage("️𝗝𝗮𝗶 𝗦𝗵𝗿𝗲𝗲 𝗥a𝗮𝗺 😇", threadID);
   };

   if ((event.body.toLowerCase() == "bot banake do") || (event.body.toLowerCase() == "mujhe bhi chaiye")) {
     return api.sendMessage("️Khud hi karlona. tumhe kya kuch nhi ata h?", threadID);
   };

   if ((event.body.toLowerCase() == "🙂") || (event.body.toLowerCase() == "🙃")) {
     return api.sendMessage("️Man Toh Accha H Nhi. Kam  Se Kam Shakal Toh Accha Karlo Meri Jaan", threadID);
   };

  if ((event.body.toLowerCase() == "🤥") || (event.body.toLowerCase() == "🤥")) {
     return api.sendMessage("️Bhai teri to naak hi etni lambi hai uski jarurat hi nahi padti hogi tujhe to🤭🤭🤭🤭", threadID);
   };

  if ((event.body.toLowerCase() == "🤔") || (event.body.toLowerCase() == "🤨")) {
     return api.sendMessage("️Kya soch rahe ho etna 🤨", threadID);
   };

   if ((event.body.toLowerCase() == "🥴") || (event.body.toLowerCase() == "🥴")) {
     return api.sendMessage("️Oye nashedi 😂😂😂", threadID);
   };

  if ((event.body.toLowerCase() == "😶") || (event.body.toLowerCase() == "😶")) {
     return api.sendMessage("️Are are lips kaha gaye gf/bf ke sath kiss karte time usi ne to nahi kha liye 😜😜", threadID);
   };

  if ((event.body.toLowerCase() == "😉") || (event.body.toLowerCase() == "😉")) {
     return api.sendMessage("️Aankh kyu maar rahe ho, Me bahut shareef hu🥺", threadID);
   };

   if ((event.body.toLowerCase() == "😱") || (event.body.toLowerCase() == "😨")) {
     return api.sendMessage("️Kya huva bhoot dekh liya kya 👻👻", threadID);
   };
  
  if ((event.body.toLowerCase() == "😒") || (event.body.toLowerCase() == "🙄")) {
     return api.sendMessage("️️𝐓𝐢𝐫𝐜𝐡𝐢 𝐧𝐚𝐳𝐚𝐫𝐢𝐲𝐚 𝐦𝐨𝐫𝐢 𝐡𝐚𝐚𝐲𝐞 𝐡𝐚𝐚𝐲𝐞 𝐡𝐚𝐚𝐲𝐞 🙈", threadID);
   };

   if ((event.body.toLowerCase() == "nobody loves me") || (event.body.toLowerCase() == "nobody love me") || (event.body.toLowerCase() == "koi pyar nhi karta")) {
     return api.sendMessage("️Me huna baby mere pass aao 🥰🤗. Me karunga na aapko payar 🙈 (londo tum dur hi rahna saalo 😑)", threadID);
   };

   if ((event.body.toLowerCase() == "🤦🏻‍♂") || (event.body.toLowerCase() == "🤦🏻‍♀")) {
     return api.sendMessage("Are apne muh pe kyu maar rahe ho, Mujhe batao kya huva?😬", threadID);
   };
   
   if ((event.body.toLowerCase() == "😂") || (event.body.toLowerCase() == "😁") || (event.body.toLowerCase() == "😆") || (event.body.toLowerCase() == "🤣") || (event.body.toLowerCase() == "😸") || (event.body.toLowerCase() == "😹")) {
                                                                                                                                                               return api.sendMessage("Enni hasi kyu aa rahi hai🤣, Es hasi ke piche ka raaz kya hai batao", threadID);
                                                                                                                                                             };

                                                                                                                                                             if ((event.body.toLowerCase() == "🥰") || (event.body.toLowerCase() == "😍") || (event.body.toLowerCase() == "😻") || (event.body.toLowerCase() == "❤️")) {
                                                                                                                                                               return api.sendMessage("🦋🌿Aƞƙɧ❍ Ɱɛ Ƥɣɑɽ͢  Ɗɪɭɱɛ Ƙɧuɱɑɽ🌬️🌍 ••Ƥɣɑɽ Ƭ❍ɧ Ƞɧɪ Ƙɒɽ ɭɪɣɑ Ɱuȷɧʂɛ>³••🕊️🍎😍", threadID);
                                                                                                                                                             };

                                                                                                                                                             if ((event.body.toLowerCase() == "kese ho") || (event.body.toLowerCase() == "kaise ho") || (event.body.toLowerCase() == "kese ho ji") || (event.body.toLowerCase() == "how are you") || (event.body.toLowerCase() == "how are you?")) {
                                                                                                                                                               return api.sendMessage("M Tabhi Accha hota hu, Jab Apko Hasta Huye Dekhta hu☺️", threadID);
                                                                                                                                                             };

                                                                                                                                                             if ((event.body.toLowerCase() == "is the bot sad") || (event.body.toLowerCase() == "is the bot sad")) {
                                                                                                                                                               return api.sendMessage("Why can't I be sad because of everyone <3 love you <3", threadID);
                                                                                                                                                             };

                                                                                                                                                             if ((event.body.toLowerCase() == "does the bot love you") || (event.body.toLowerCase() == "does the bot love you")) {
                                                                                                                                                               return api.sendMessage("Yes I love you and everyone so much", threadID);
                                                                                                                                                             };

                                                                                                                                                             if ((event.body.toLowerCase() == "bot goes to sleep") || (event.body.toLowerCase() == "bot goes to sleep")) {
                                                                                                                                                               return api.sendMessage("I'm a bot, you're the one who should go to sleep <3", threadID);
                                                                                                                                                             };

                                                                                                                                                            if ((event.body.toLowerCase() == "🤖") || (event.body.toLowerCase() == "🤖")) {
                                                                                                                                                               return api.sendMessage("Saalo chidda rahe ho mujhe", threadID);
                                                                                                                                                             };

                                                                                                                                                             if ((event.body.toLowerCase() == "has the bot eaten yet") || (event.body.toLowerCase() == "bot an comrade")) {
                                                                                                                                                               return api.sendMessage("I'm full when I see you eat <3", threadID);
                                                                                                                                                             };

                                                                                                                                                            if ((event.body.toLowerCase() == "lob you") || (event.body.toLowerCase() == "i lob you")) {
                                                                                                                                                               return api.sendMessage("Lob You too", threadID);
                                                                                                                                                             };

                                                                                                                                                             if ((event.body.toLowerCase() == "does the bot love me") || (event.body.toLowerCase() == "does the bot love me")) {
                                                                                                                                                               return api.sendMessage("Yes <3", threadID);
                                                                                                                                                             };

                                                                                                                                                             if ((event.body.toLowerCase() == "&fuck") || (event.body.toLowerCase() == "&Fuck")) {
                                                                                                                                                               return api.sendMessage("🏔️🏝️Priyansh Ƞɛ ꌗƥɛçɪɑɭɭɣ Ƭuɱ 🌊🪺Jɑɪʂɛ Ƭɧɑɽƙɪɣɵ Ƙɛ Ɬɪɣɛ•• 🏞️🌬️Ɣɑɧ çɵɱɱɑƞɗ Ɦɑʈɑ Ɗɪɣɑ Ɦɑɪ↗↘ Sɵɽɽɣ Ɠɣuʂ••😹🫶", threadID);
                                                                                                                                                             };

                                                                                                                                                            if ((event.body.toLowerCase() == "😵‍💫")) {
                                                                                                                                                              return api.sendMessage("Lagta hai chakkar aa gaye 😵‍💫", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🤤")) {
                                                                                                                                                              return api.sendMessage("Kya dekh ke muh se paani aa gaya? 🤤", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "😚")) {
                                                                                                                                                              return api.sendMessage("Awww! Flying kiss de diya 😚", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🤩")) {
                                                                                                                                                              return api.sendMessage("Wow! Kisi cheez ka shock laga kya? 🤩", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "😜")) {
                                                                                                                                                              return api.sendMessage("Bade masti ke mood mein ho lagta hai! 😜", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🫣")) {
                                                                                                                                                              return api.sendMessage("Kahi chhup ke dekh rhe ho kya? 🫣", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "😮‍💨")) {
                                                                                                                                                              return api.sendMessage("Thak gaye ho? Relax kar lo 😮‍💨", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🤓")) {
                                                                                                                                                              return api.sendMessage("Scholar lag rahe ho 🤓", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🥶")) {
                                                                                                                                                              return api.sendMessage("Bahut thand lag rahi hai kya? 🥶", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🥵")) {
                                                                                                                                                              return api.sendMessage("Garmi ke maare pareshan lag rahe ho 🥵", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🫡")) {
                                                                                                                                                              return api.sendMessage("Salute kar rahe ho kya? 🫡", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🫶")) {
                                                                                                                                                              return api.sendMessage("Itna pyaar de rahe ho? 🫶", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "👩‍💻") || (event.body.toLowerCase() == "👨‍💻")) {
                                                                                                                                                              return api.sendMessage("Lagta hai coding ho rahi hai 👨‍💻", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🕺") || (event.body.toLowerCase() == "💃")) {
                                                                                                                                                              return api.sendMessage("Dance kar rahe ho? Mazze le rahe ho! 🕺💃", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🎤")) {
                                                                                                                                                              return api.sendMessage("Gaana suna rahe ho? 🎤", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "📖")) {
                                                                                                                                                              return api.sendMessage("Kya padhai kar rahe ho? 📖", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🛌")) {
                                                                                                                                                              return api.sendMessage("Sone ka time ho gaya? 🛌", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "👑")) {
                                                                                                                                                              return api.sendMessage("Aap toh King/Queen lag rahe ho! 👑", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "😎")) {
                                                                                                                                                              return api.sendMessage("Aap toh bilkul cool lag rahe ho 😎", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🤩")) {
                                                                                                                                                              return api.sendMessage("Kuch acha dekh liya kya? 🤩", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "👀")) {
                                                                                                                                                              return api.sendMessage("Kya dekh rahe ho? 👀", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "💀")) {
                                                                                                                                                              return api.sendMessage("Lagta hai kuch funny dekh liya! 💀", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🥳")) {
                                                                                                                                                              return api.sendMessage("Party ka mood lag raha hai! 🥳", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🧐")) {
                                                                                                                                                              return api.sendMessage("Lagta hai koi mushkil sawaal puch rahe ho 🧐", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "💡")) {
                                                                                                                                                              return api.sendMessage("Aapke paas koi nayi idea hai? 💡", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🚶‍♂️") || (event.body.toLowerCase() == "🚶‍♀️")) {
                                                                                                                                                              return api.sendMessage("Kahaan ja rahe ho? 🚶‍♂️", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🔮")) {
                                                                                                                                                              return api.sendMessage("Kya future dekh rahe ho? 🔮", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🔥")) {
                                                                                                                                                              return api.sendMessage("Lagta hai sab kuch garam hai! 🔥", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🎉")) {
                                                                                                                                                              return api.sendMessage("Celebration ka mood lag raha hai! 🎉", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "💪")) {
                                                                                                                                                              return api.sendMessage("Shakti dikhane ka time hai! 💪", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🤯")) {
                                                                                                                                                              return api.sendMessage("Dimag ka dahi ho gaya? 🤯", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🍕")) {
                                                                                                                                                              return api.sendMessage("Kya pizza khane ka man hai? 🍕", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🏆")) {
                                                                                                                                                              return api.sendMessage("Aap toh champion lag rahe ho! 🏆", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🍀")) {
                                                                                                                                                              return api.sendMessage("Lagta hai apne paas kuch lucky charm hai! 🍀", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🎧")) {
                                                                                                                                                              return api.sendMessage("Koi music sun rahe ho? 🎧", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🧠")) {
                                                                                                                                                              return api.sendMessage("Aapka dimag bohot tez lag raha hai 🧠", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "💫")) {
                                                                                                                                                              return api.sendMessage("Aapke aas paas kuch magic lag raha hai 💫", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🦸‍♂️") || (event.body.toLowerCase() == "🦸‍♀️")) {
                                                                                                                                                              return api.sendMessage("Superhero lag rahe ho! 🦸‍♂️", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🤡")) {
                                                                                                                                                              return api.sendMessage("Lagta hai aap clown ban gaye ho 🤡", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🦄")) {
                                                                                                                                                              return api.sendMessage("Aap toh unicorn lag rahe ho! 🦄", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🎮")) {
                                                                                                                                                              return api.sendMessage("Kya game khel rahe ho? 🎮", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "👻")) {
                                                                                                                                                              return api.sendMessage("Bhoot lag rahe ho kya? 👻", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🦋")) {
                                                                                                                                                              return api.sendMessage("Aap toh butterfly jaise khubsurat ho! 🦋", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🍉")) {
                                                                                                                                                              return api.sendMessage("Lagta hai aapko fruits ka shauq hai! 🍉", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🛸")) {
                                                                                                                                                              return api.sendMessage("Aap spaceship par hai? 🛸", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🍄")) {
                                                                                                                                                              return api.sendMessage("Lagta hai aapke paas magical powers hain 🍄", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🚀")) {
                                                                                                                                                              return api.sendMessage("Aap toh space mein ja rahe ho! 🚀", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🍩")) {
                                                                                                                                                              return api.sendMessage("Kya donuts ka shauq hai? 🍩", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🛹")) {
                                                                                                                                                              return api.sendMessage("Aap skateboard par hai! 🛹", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🌮")) {
                                                                                                                                                              return api.sendMessage("Tacos ka man ho raha hai! 🌮", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🧊")) {
                                                                                                                                                              return api.sendMessage("Aap thode thanda lag rahe ho 🧊", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "⚡")) {
                                                                                                                                                              return api.sendMessage("Aap electric hai! ⚡", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "👽")) {
                                                                                                                                                              return api.sendMessage("Kya aap alien ho? 👽", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🦧")) {
                                                                                                                                                              return api.sendMessage("Kya aapki dosti har kisam ke animals ke saath hai? 🦧", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "💎")) {
                                                                                                                                                              return api.sendMessage("Aap toh diamond ki tarah chamak rahe ho! 💎", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🧘‍♂️") || (event.body.toLowerCase() == "🧘‍♀️")) {
                                                                                                                                                              return api.sendMessage("Yoga ka time hai! 🧘‍♀️", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🍀")) {
                                                                                                                                                              return api.sendMessage("Aapke paas lucky charm hai! 🍀", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🍫")) {
                                                                                                                                                              return api.sendMessage("Chocolate khane ka man hai 🍫", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🎻")) {
                                                                                                                                                              return api.sendMessage("Aap violin bajane ka mood mein ho! 🎻", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🎺")) {
                                                                                                                                                              return api.sendMessage("Aap trumpet bajane ka mood mein ho! 🎺", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🎻")) {
                                                                                                                                                              return api.sendMessage("Music mein doob gaye ho! 🎻", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🚴‍♂️") || (event.body.toLowerCase() == "🚴‍♀️")) {
                                                                                                                                                              return api.sendMessage("Cycle par jaana hai kya? 🚴‍♀️", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🧑‍🎤")) {
                                                                                                                                                              return api.sendMessage("Singer ban gaye ho kya? 🧑‍🎤", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🎧")) {
                                                                                                                                                              return api.sendMessage("Music ka shauq hai 🎧", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "💬")) {
                                                                                                                                                              return api.sendMessage("Aap baat kar rahe ho? 💬", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🖋️")) {
                                                                                                                                                              return api.sendMessage("Kya likh rahe ho? 🖋️", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🧩")) {
                                                                                                                                                              return api.sendMessage("Puzzle solve kar rahe ho? 🧩", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🧃")) {
                                                                                                                                                              return api.sendMessage("Juice ka man ho raha hai! 🧃", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🎬")) {
                                                                                                                                                              return api.sendMessage("Koi movie dekh rahe ho? 🎬", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🦄")) {
                                                                                                                                                              return api.sendMessage("Aap unicorn ki tarah magical ho! 🦄", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🍒")) {
                                                                                                                                                              return api.sendMessage("Kya cherry ka shauq hai? 🍒", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🧠")) {
                                                                                                                                                              return api.sendMessage("Aapka dimag kitna tez hai! 🧠", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🥚")) {
                                                                                                                                                              return api.sendMessage("Egg khane ka man hai? 🥚", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "⚽")) {
                                                                                                                                                              return api.sendMessage("Football ka shauq hai? ⚽", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🌙")) {
                                                                                                                                                              return api.sendMessage("Chand ki roshni mein kho gaye ho? 🌙", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🕹️")) {
                                                                                                                                                              return api.sendMessage("Video games mein busy ho? 🕹️", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🦉")) {
                                                                                                                                                              return api.sendMessage("Aap owl ki tarah sharp ho! 🦉", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🌻")) {
                                                                                                                                                              return api.sendMessage("Aap sunflower ki tarah bright ho! 🌻", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🧊")) {
                                                                                                                                                              return api.sendMessage("Kuch thanda chaiye? 🧊", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "💀")) {
                                                                                                                                                              return api.sendMessage("Aap bilkul spooky lag rahe ho! 💀", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🏀")) {
                                                                                                                                                              return api.sendMessage("Basketball ka shauq hai? 🏀", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🎸")) {
                                                                                                                                                              return api.sendMessage("Guitar bajane ka man hai? 🎸", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🌍")) {
                                                                                                                                                              return api.sendMessage("Aap duniya ke safar par ho! 🌍", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🍕")) {
                                                                                                                                                              return api.sendMessage("Pehli baat, pizza ka mood hai? 🍕", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🎮")) {
                                                                                                                                                              return api.sendMessage("Game khel rahe ho? 🎮", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🎨")) {
                                                                                                                                                              return api.sendMessage("Aap artist ban gaye ho? 🎨", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🌵")) {
                                                                                                                                                              return api.sendMessage("Kya desert mein ho? 🌵", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🍉")) {
                                                                                                                                                              return api.sendMessage("Fruits ka shauq hai 🍉", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🎻")) {
                                                                                                                                                              return api.sendMessage("Violin bajane ka mann hai 🎻", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🦄")) {
                                                                                                                                                              return api.sendMessage("Aap toh unicorn ho! 🦄", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🎷")) {
                                                                                                                                                              return api.sendMessage("Saxophone ka time hai! 🎷", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🍉")) {
                                                                                                                                                              return api.sendMessage("Aapko watermelon pasand hai? 🍉", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🎡")) {
                                                                                                                                                              return api.sendMessage("Ferris wheel par ho kya? 🎡", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🍀")) {
                                                                                                                                                              return api.sendMessage("Aapko good luck chahiye? 🍀", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🎂")) {
                                                                                                                                                              return api.sendMessage("Cake ka time hai! 🎂", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🛵")) {
                                                                                                                                                              return api.sendMessage("Scooter pe ja rahe ho? 🛵", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🍪")) {
                                                                                                                                                              return api.sendMessage("Cookies ka time hai! 🍪", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🦓")) {
                                                                                                                                                              return api.sendMessage("Zebra ki tarah unique ho aap! 🦓", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🎃")) {
                                                                                                                                                              return api.sendMessage("Aap Halloween mode mein lag rahe ho! 🎃", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🐉")) {
                                                                                                                                                              return api.sendMessage("Aap dragon ban gaye ho! 🐉", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🦩")) {
                                                                                                                                                              return api.sendMessage("Flamingo ban gaya hai koi! 🦩", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "💌")) {
                                                                                                                                                              return api.sendMessage("Dil se kuch bhejna hai? 💌", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🥳")) {
                                                                                                                                                              return api.sendMessage("Celebration ka time hai! 🥳", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🎮")) {
                                                                                                                                                              return api.sendMessage("Game khel rahe ho? 🎮", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🍍")) {
                                                                                                                                                              return api.sendMessage("Pineapple ka shauq hai? 🍍", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🦋")) {
                                                                                                                                                              return api.sendMessage("Aap butterfly ki tarah khubsurat ho! 🦋", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🎺")) {
                                                                                                                                                              return api.sendMessage("Trumpet bajana hai! 🎺", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🍓")) {
                                                                                                                                                              return api.sendMessage("Strawberry ka time hai! 🍓", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "💎")) {
                                                                                                                                                              return api.sendMessage("Aap diamond ki tarah chamak rahe ho! 💎", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🥥")) {
                                                                                                                                                              return api.sendMessage("Coconut ka shauq hai? 🥥", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🦒")) {
                                                                                                                                                              return api.sendMessage("Giraffe ban gaya koi! 🦒", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🍒")) {
                                                                                                                                                              return api.sendMessage("Cherry khane ka mann hai? 🍒", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🦓")) {
                                                                                                                                                              return api.sendMessage("Zebra ki tarah unique lag rahe ho! 🦓", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🐢")) {
                                                                                                                                                              return api.sendMessage("Aap turtle ki tarah slow aur steady ho! 🐢", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🧸")) {
                                                                                                                                                              return api.sendMessage("Aap teddy bear ki tarah pyare ho! 🧸", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🍓")) {
                                                                                                                                                              return api.sendMessage("Aapko strawberries pasand hai? 🍓", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🎸")) {
                                                                                                                                                              return api.sendMessage("Guitar bajana hai kya? 🎸", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🦅")) {
                                                                                                                                                              return api.sendMessage("Eagle ki tarah upar ud rahe ho! 🦅", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "💥")) {
                                                                                                                                                              return api.sendMessage("Explosion hone wala hai! 💥", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🐘")) {
                                                                                                                                                              return api.sendMessage("Aap elephant ki tarah strong ho! 🐘", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🍟")) {
                                                                                                                                                              return api.sendMessage("Fries ka mood hai? 🍟", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🧊")) {
                                                                                                                                                              return api.sendMessage("Thanda kuch chahiye? 🧊", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🎬")) {
                                                                                                                                                              return api.sendMessage("Film dekh rahe ho? 🎬", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🍾")) {
                                                                                                                                                              return api.sendMessage("Celebration ka time hai! 🍾", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🎤")) {
                                                                                                                                                              return api.sendMessage("Aap singer ban gaye ho! 🎤", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🦸‍♂️") || (event.body.toLowerCase() == "🦸‍♀️")) {
                                                                                                                                                              return api.sendMessage("Superhero lag rahe ho! 🦸‍♂️", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🍔")) {
                                                                                                                                                              return api.sendMessage("Burger khane ka mood hai? 🍔", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🦶")) {
                                                                                                                                                              return api.sendMessage("Aapko chalna ka shauq hai? 🦶", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🍿")) {
                                                                                                                                                              return api.sendMessage("Movie time! Popcorn le lo 🍿", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🦗")) {
                                                                                                                                                              return api.sendMessage("Grasshopper ki tarah jump kar rahe ho! 🦗", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🧃")) {
                                                                                                                                                              return api.sendMessage("Juice ka time hai! 🧃", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🎪")) {
                                                                                                                                                              return api.sendMessage("Circus ka maza le rahe ho? 🎪", threadID);
                                                                                                                                                            };

                                                                                                                                                            if ((event.body.toLowerCase() == "🥑")) {
                                                                                                                                                              return api.sendMessage("Avocado ka shauq hai? 🥑", threadID);
                                                                                                                                                            };

                                                                                                                                                             mess = "{name}"

                                                                                                                                                            if (event.body.indexOf("Bot") == 0 || (event.body.indexOf("bot") == 0)) {
                                                                                                                                                              var msg = { 
                                                                                                                                                                body: `${name} ${rand}`
                                                                                                                                                              }

                                                                                                                                                              return api.sendMessage(msg, threadID, messageID);
                                                                                                                                                            };

                                                                                                                                                            }

                                                                                                                                                            
module.exports.run = function({ api, event, client, __GLOBAL }) { }