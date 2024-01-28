import fetch from 'node-fetch'
import { translate } from '@vitalets/google-translate-api';
let handler  = async (m, { conn }) => {
    let shizokeys = 'shizo'	
  let res = await fetch(`https://shizoapi.onrender.com/api/texts/dare?apikey=${shizokeys}`)
  if (!res.ok) throw await res.text()
	    let json = await res.json()

  let translatedText = await translate(json.result, { to: 'ar' });

  conn.sendMessage(m.chat, { text: translatedText.text, mentions: [m.sender] }, { quoted: m });
};
handler.help = ['dare']
handler.tags = ['dare']
handler.command = /^(تجرؤ)$/i

export default handler


function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}
