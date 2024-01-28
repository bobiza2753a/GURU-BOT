function handler(m) {
  if (m.message.attachments && m.message.attachments.length > 0 && m.message.attachments[0].data) {
    // 1. الحصول على بريد إلكتروني وموقع الويب من البطاقة
    let email = m.message.attachments[0].data.email
    let website = m.message.attachments[0].data.website

    // 2. إرسال البريد الإلكتروني وموقع الويب في البطاقة إلى جهة الاتصال المحددة
    this.sendText(m.chat, `البريد الإلكتروني: ${email}`, m)
    this.sendText(m.chat, `الموقع الإلكتروني: ${website}`, m)
  } else {
    let data = global.owner.filter(([id, isCreator]) => id && isCreator)
    this.sendContact(m.chat, data.map(([id, name]) => [id, name]), m)
  }
}

handler.alias = ['owner']
handler.command = /^(المطور|المالك|مطور)$/i
handler.help = ['owner']
handler.tags = ['main']

export default handler
