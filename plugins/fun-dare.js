import fetch from 'node-fetch';
import translate from '@vitalets/google-translate-api';

let sharHandler = async (m, { conn, text }) => {
  try {
    let res = await fetch(`https://shizoapi.onrender.com/api/texts/dare?apikey=shizo`);

    if (!res.ok) {
      throw new Error(`فشل طلب API مع الحالة ${res.status}`);
    }

    let json = await res.json();

    console.log('JSON response:', json);

    let zoro = `${json.result}`;
    
    let translation = await translate(zoro, { to: 'ar' });

    let translatedshar = translation.text;

    m.reply(translatedshar);
  } catch (error) {
    console.error(error);
  }
};

handler.help = ['تجرؤ'];
handler.tags = ['fun'];
handler.command = /^(تجرؤ)$/i;

export default handler


function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}
