function handler(m, conn) {
  // التحقق مما إذا كانت الرسالة تحتوي على مرفقات
  if (m.message.attachments && m.message.attachments.length > 0 && m.message.attachments[0].data) {
    // الحصول على بريد إلكتروني وموقع الويب من البطاقة
    let email = m.message.attachments[0].data.email
    let website = m.message.attachments[0].data.website

    // التحقق من وجود البريد الإلكتروني والموقع الإلكتروني قبل إرسالهما
    if (email && website) {
      // إرسال البريد الإلكتروني وموقع الويب في البطاقة إلى جهة الاتصال المحددة
      conn.sendMessage(m.chat, `البريد الإلكتروني: ${email}\nالموقع الإلكتروني: ${website}`, m)
    } else {
      // في حالة عدم وجود بريد إلكتروني أو موقع إلكتروني في البطاقة
      conn.sendMessage(m.chat, "لم يتم العثور على بريد إلكتروني أو موقع إلكتروني في البطاقة.", m)
    }
  } else {
    // في حالة عدم وجود مرفقات، دمج بيانات المالك في رد واحد
    let data = global.owner.filter(([id, isCreator]) => id && isCreator)
    
    // التأكد من وجود بيانات المالك
    if (data.length > 0) {
      // دمج بيانات المالك في رد واحد
      let contactInfo = data.map(([id, name]) => `${name}: ${id}`).join('\n')
      conn.sendMessage(m.chat, `بيانات المالك:\n${contactInfo}`, m)
    } else {
      // في حالة عدم وجود بيانات للمالك
      conn.sendMessage(m.chat, "لا يوجد بيانات للمالك.", m)
    }
  }
}

handler.alias = ['owner']
handler.command = /^(المطور|المالك|مطور)$/i
handler.help = ['owner']
handler.tags = ['main']

export default handler
