import fetch from 'node-fetch'
import { translate } from '@vitalets/google-translate-api';
let handler  = async (m, { conn }) => {
    let shizokeys = 'shizo'	
  let res = await fetch(`https://shizoapi.onrender.com/api/texts/shayari?apikey=${shizokeys}`)
  if (!res.ok) throw await res.text()
	    let json = await res.json()

  let translatedText = await translate(json.result, { to: 'ar' });

  conn.sendMessage(m.chat, { text: translatedText.text, mentions: [m.sender] }, { quoted: m });
};
handler.help = ['shayeri']
handler.tags = ['shayeri']
handler.command = /^(شعر)$/i

export default handler
