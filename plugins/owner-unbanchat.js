//import db from '../lib/database.js'

let handler = async (m, { conn, isOwner, isAdmin, isROwner} ) => {
    if (!(isAdmin || isOwner)) return dfail('admin', m, conn)
    global.db.data.chats[m.chat].isBanned = false
    m.reply('✅البوت نشط في هذه المجموعة')   
}
handler.help = ['unbanchat']
handler.tags = ['owner']
handler.command = ['رفع-الحظر', 'الغاء-الحظر'] 

export default handler
