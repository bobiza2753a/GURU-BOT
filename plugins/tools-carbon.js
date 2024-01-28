import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, 'يرجى تقديم بعض النص لإنشاء صورة الرمز.', m)
  }

  let codeText = args.join(' ')

  try {
    let response = await fetch('https://carbonara.solopov.dev/api/cook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: codeText,
        backgroundColor: '#1F816D',
      }),
    });

    if (!response.ok) {
      throw new Error('فشل في إنشاء صورة الرمز.')
    }

    let imageBuffer = await response.buffer();
    conn.sendFile(m.chat, imageBuffer, 'code.png', 'وهذه هي صورة الكود:', m)
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, 'حدث خطأ أثناء إنشاء صورة الرمز.', m)
  }
}

handler.help = ['.carbon <code>']
handler.tags = ['tools']
handler.command = /^كاربون$/i;

export default handler
