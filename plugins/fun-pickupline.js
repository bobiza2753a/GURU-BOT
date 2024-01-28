import fetch from 'node-fetch'
import { translate } from '@vitalets/google-translate-api';
let handler  = async (m, { conn }) => {
  let res = await fetch(`https://api.popcat.xyz/pickuplines`)
  if (!res.ok) throw await res.text()
	    let json = await res.json()

  let translatedText = await translate(json.pickupline, { to: 'ar' });

  conn.sendMessage(m.chat, { text: translatedText.text, mentions: [m.sender] }, { quoted: m });
};
handler.help = ['pickupline']
handler.tags = ['pickupline']
handler.command = /^(هبد)$/i

export default handler


function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}
