import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'


global.owner = [
  ['201144984146', '𝑍𝑂𝑅𝑂⚡3𝑀𝐾', true],
  ['201032389641', '𝑍𝑂𝑅𝑂⚡3𝑀𝐾', true], 
  [''] 
] //Number of owners

//global.pairingNumber = "" //put your bot number here

global.mods = ['201032389641','201032389641'] 
global.prems = ['201032389641', '201032389641', '201032389641']
global.allowed = ['201032389641', '201032389641', '201032389641']
global.keysZens = ['c2459db922', '37CC845916', '6fb0eff124']
global.keysxxx = keysZens[Math.floor(keysZens.length * Math.random())]
global.keysxteammm = ['29d4b59a4aa687ca', '5LTV57azwaid7dXfz5fzJu', 'cb15ed422c71a2fb', '5bd33b276d41d6b4', 'HIRO', 'kurrxd09', 'ebb6251cc00f9c63']
global.keysxteam = keysxteammm[Math.floor(keysxteammm.length * Math.random())]
global.keysneoxrrr = ['5VC9rvNx', 'cfALv5']
global.keysneoxr = keysneoxrrr[Math.floor(keysneoxrrr.length * Math.random())]
global.lolkeysapi = ['GataDios']

global.APIs = { // API Prefix
  // name: 'https://website'
  xteam: 'https://api.xteam.xyz', 
  dzx: 'https://api.dhamzxploit.my.id',
  lol: 'https://api.lolhuman.xyz',
  violetics: 'https://violetics.pw',
  neoxr: 'https://api.neoxr.my.id',
  zenzapis: 'https://zenzapis.xyz',
  akuari: 'https://api.akuari.my.id',
  akuari2: 'https://apimu.my.id',
  nrtm: 'https://fg-nrtm.ddns.net',
  bg: 'http://bochil.ddns.net',
  fgmods: 'https://api-fgmods.ddns.net'
}
global.APIKeys = { // APIKey Here
  // 'https://website': 'apikey'
  'https://api.xteam.xyz': 'd90a9e986e18778b',
  'https://api.lolhuman.xyz': '85faf717d0545d14074659ad',
  'https://api.neoxr.my.id': `${keysneoxr}`,	
  'https://violetics.pw': 'beta',
  'https://zenzapis.xyz': `${keysxxx}`, 
  'https://api-fgmods.ddns.net': 'fg-dylux'
}

// Sticker WM
global.botname = '𝒁𝑶𝑹𝑶'
global.premium = 'true'
global.packname = '𝐵𝑌:𝑍𝑂𝑅𝑂⚡𝐵𝑂𝑇' 
global.author = '𝑌𝛩𝑺𝐸𝐹⚡3𝑀𝐾' 
global.menuvid = 'https://i.imgur.com/uiwALih.mp4'
global.igfg = 'https://solo.to/yosef.zoro' 
global.dygp = 'https://solo.to/yosef.zoro'
global.fgsc = 'https://solo.to/yosef.zoro' 
global.fgyt = 'https://youtube.com/@The-ZoroBot-MD?si=DncZQM6sKC0F6MhG'
global.fgpyp = 'https://youtube.com/@The-ZoroBot-MD?si=DncZQM6sKC0F6MhG'
global.fglog = 'https://solo.to/yosef.zoro' 
global.thumb = fs.readFileSync('./Menu2.jpg')

global.wait = '*⌛ _انتظر..._*\n*▰▰▰▱▱▱▱▱*'
global.rwait = '⌛'
global.dmoji = '⚡'
global.done = '✅'
global.error = '❌' 
global.xmoji = '🔥'

global.multiplier = 69 
global.maxwarn = '3' 

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
