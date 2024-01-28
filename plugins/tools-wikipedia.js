import axios from 'axios'
import cheerio from 'cheerio'


let handler = async (m, { text }) => {
	if (!text) throw `✳️ أدخل ما تريد البحث عنه في ويكيبيديا` 
	
    try {
	const link =  await axios.get(`https://es.wikipedia.org/wiki/${text}`)
	const $ = cheerio.load(link.data)
	let wik = $('#firstHeading').text().trim()
	let resulw = $('#mw-content-text > div.mw-parser-output').find('p').text().trim()
	m.reply(`▢ *Wikipedia*

‣ Buscado : ${wik}

${resulw}`)
} catch (e) {
  m.reply('⚠️ لم يتم العثور على نتائج')
}
}
handler.help = ['wikipedia']
handler.tags = ['tools']
handler.command = ['ويكي','ويكيبيديا'] 


export default handler
