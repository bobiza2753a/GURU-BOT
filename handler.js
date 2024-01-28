import {
    smsg
} from "./lib/simple.js"
import {
    format
} from "util"
import {
    fileURLToPath
} from "url"
import path, {
    join
} from "path"
import {
    unwatchFile,
    watchFile,
    readFileSync
} from "fs"
import chalk from "chalk"
import fetch from "node-fetch"

import {
    WelcomeLeave
} from "./lib/welcome.js"
/**
 * @type {import("@whiskeysockets/baileys")}
 */
const isNumber = x => typeof x === "number" && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function() {
    clearTimeout(this)
    resolve()
}, ms))

/**
 * Handle messages upsert
 * @param {import("@whiskeysockets/baileys").BaileysEventMap<unknown>["messages.upsert"]} groupsUpdate 
 */
const {
    getAggregateVotesInPollMessage,
    makeInMemoryStore
} = await (await import('@whiskeysockets/baileys')).default;
import Pino from "pino"
const store = makeInMemoryStore({
    logger: Pino().child({
        level: 'fatal',
        stream: 'store'
    })
})
export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    if (!chatUpdate)
        return
    this.pushMessage(chatUpdate.messages).catch(console.error)
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m)
        return
    if (global.db.data == null)
        await global.loadDatabase()
    try {
        m = smsg(this, m) || m
        if (!m)
            return
            m.exp = 0
            m.credit = false
            m.bank = false
            m.chicken = false
        try {
            // TODO: use loop to insert data instead of this
            let user = global.db.data.users[m.sender]
            if (typeof user !== "object")
                global.db.data.users[m.sender] = {}
            if (user) {
                if (!isNumber(user.exp))
                    user.exp = 0
                if (!isNumber(user.credit))
                    user.credit = 10
                if (!isNumber(user.bank))
                    user.bank = 0
                if (!isNumber(user.chicken))
                    user.chicken = 0  
                if (!isNumber(user.lastclaim))
                    user.lastclaim = 0
                if (!('registered' in user))
                    user.registered = false
                    //-- user registered 
                if (!user.registered) {
                    if (!('name' in user))
                        user.name = m.name
                    if (!isNumber(user.age))
                        user.age = -1
                    if (!isNumber(user.regTime))
                        user.regTime = -1
                }
                //--user number
                if (!isNumber(user.afk))
                    user.afk = -1
                if (!('afkReason' in user))
                    user.afkReason = ''
                if (!('banned' in user))
                    user.banned = false
                if (!isNumber(user.warn))
                    user.warn = 0
                if (!isNumber(user.level))
                    user.level = 0
                if (!('role' in user))
                    user.role = 'Tadpole'
                if (!('autolevelup' in user))
                    user.autolevelup = false
            } else {
                global.db.data.users[m.sender] = {
                    exp: 0,
                    credit: 0,
                    bank: 0,
                    chicken: 0,
                    lastclaim: 0,
                    registered: false,
                    name: m.name,
                    age: -1,
                    regTime: -1,
                    afk: -1,
                    afkReason: '',
                    banned: false,
                    warn: 0,
                    level: 0,
                    role: 'Tadpole',
                    autolevelup: false,
                    
                }
                }
            let chat = global.db.data.chats[m.chat]
            if (typeof chat !== "object")
                global.db.data.chats[m.chat] = {}
            if (chat) {
                if (!("antiDelete" in chat)) chat.antiDelete = true
                if (!("antiLink" in chat)) chat.antiLink = false
                if (!("antiSticker" in chat)) chat.antiSticker = false
                if (!("antiToxic" in chat)) chat.antiToxic = false
                if (!("detect" in chat)) chat.detect = false
                if (!("getmsg" in chat)) chat.getmsg = true
                if (!("isBanned" in chat)) chat.isBanned = false
                if (!("nsfw" in chat)) chat.nsfw = false
                if (!("sBye" in chat)) chat.sBye = ""
                if (!("sDemote" in chat)) chat.sDemote = ""
                if (!("simi" in chat)) chat.simi = false
                if (!("sPromote" in chat)) chat.sPromote = ""
                if (!("sWelcome" in chat)) chat.sWelcome = ""
                if (!("useDocument" in chat)) chat.useDocument = false
                if (!("viewOnce" in chat)) chat.viewOnce = false
                if (!("viewStory" in chat)) chat.viewStory = false
                if (!("welcome" in chat)) chat.welcome = false
                if (!("chatbot" in chat)) chat.chatbot = false
                if (!isNumber(chat.expired)) chat.expired = 0
            } else
                global.db.data.chats[m.chat] = {
                    antiDelete: true,
                    antiLink: false,
                    antiSticker: false,
                    antiToxic: false,
                    detect: false,
                    expired: 0,
                    getmsg: true,
                    isBanned: false,
                    nsfw: false, 
                    sBye: "",
                    sDemote: "",
                    simi: false,
                    sPromote: "",
                    sticker: false,
                    sWelcome: "",
                    useDocument: false,
                    viewOnce: false,
                    viewStory: false,
                    welcome: false,
                    chatbot: false
                }
          
                
            let settings = global.db.data.settings[this.user.jid]
            if (typeof settings !== "object") global.db.data.settings[this.user.jid] = {}
            if (settings) {
                if (!("self" in settings)) settings.self = false
                if (!("autoread" in settings)) settings.autoread = false
                if (!("restrict" in settings)) settings.restrict = false
                if (!("restartDB" in settings)) settings.restartDB = 0
                if (!("status" in settings)) settings.status = 0

            } else global.db.data.settings[this.user.jid] = {
                self: false,
                autoread: false,
                restrict: false,
                restartDB: 0,
                status: 0
            }
        } catch (e) {
            console.error(e)
        }
        if (opts["nyimak"])
            return
        if (opts["pconly"] && m.chat.endsWith("g.us"))
            return
        if (opts["gconly"] && !m.chat.endsWith("g.us"))
            return
        if (opts["swonly"] && m.chat !== "status@broadcast")
            return
        if (typeof m.text !== "string")
            m.text = ""

        const isROwner = [conn.decodeJid(global.conn.user.id), ...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender)
        const isOwner = isROwner || m.fromMe
        const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender)
        const isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender)

        if (opts["queque"] && m.text && !(isMods || isPrems)) {
            let queque = this.msgqueque,
                time = 1000 * 5
            const previousID = queque[queque.length - 1]
            queque.push(m.id || m.key.id)
            setInterval(async function() {
                if (queque.indexOf(previousID) === -1) clearInterval(this)
                await delay(time)
            }, time)
        }
         if (process.env.MODE && process.env.MODE.toLowerCase() === 'private' && !(isROwner || isOwner))
          return;

        
        if (m.isBaileys)
            return
        m.exp += Math.ceil(Math.random() * 10)

        let usedPrefix
        let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

        const groupMetadata = (m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}) || {}
        const participants = (m.isGroup ? groupMetadata.participants : []) || []
        const user = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) === m.sender) : {}) || {} // User Data
        const bot = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) == conn.user.jid) : {}) || {} // Your Data
        const isRAdmin = user?.admin == "superadmin" || false
        const isAdmin = isRAdmin || user?.admin == "admin" || false // Is User Admin?
        const isBotAdmin = bot?.admin || false // Are you Admin?

        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), "./plugins")
        for (let name in global.plugins) {
            let plugin = global.plugins[name]
            if (!plugin)
                continue
            if (plugin.disabled)
                continue
            const __filename = join(___dirname, name)
            if (typeof plugin.all === "function") {
                try {
                    await plugin.all.call(this, m, {
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    })
                } catch (e) {
                    // if (typeof e === "string") continue
                    console.error(e)
                    for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
                        let data = (await conn.onWhatsApp(jid))[0] || {}
                        if (data.exists)
                            m.reply(`*🗂️ Plugin:* ${name}\n*👤 مرسل:* ${m.sender}\n*💬 محادثة:* ${m.chat}\n*💻 الامر:* ${m.text}\n\n\${format(e)}`.trim(), data.jid)
                    }
                }
            }
            if (!opts["restrict"])
                if (plugin.tags && plugin.tags.includes("admin")) {
                    // global.dfail("restrict", m, this)
                    continue
                }
            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&")
            let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
            let match = (_prefix instanceof RegExp ? // RegExp Mode?
                [
                    [_prefix.exec(m.text), _prefix]
                ] :
                Array.isArray(_prefix) ? // Array?
                _prefix.map(p => {
                    let re = p instanceof RegExp ? // RegExp in Array?
                        p :
                        new RegExp(str2Regex(p))
                    return [re.exec(m.text), re]
                }) :
                typeof _prefix === "string" ? // String?
                [
                    [new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]
                ] : [
                    [
                        [], new RegExp
                    ]
                ]
            ).find(p => p[1])
            if (typeof plugin.before === "function") {
                if (await plugin.before.call(this, m, {
                        match,
                        conn: this,
                        participants,
                        groupMetadata,
                        user,
                        bot,
                        isROwner,
                        isOwner,
                        isRAdmin,
                        isAdmin,
                        isBotAdmin,
                        isPrems,
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    }))
                    continue
            }
            if (typeof plugin !== "function")
                continue
            if ((usedPrefix = (match[0] || "")[0])) {
                let noPrefix = m.text.replace(usedPrefix, "")
                let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
                args = args || []
                let _args = noPrefix.trim().split` `.slice(1)
                let text = _args.join` `
                command = (command || "").toLowerCase()
                let fail = plugin.fail || global.dfail // When failed
                let isAccept = plugin.command instanceof RegExp ? // RegExp Mode?
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ? // Array?
                    plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
                        cmd.test(command) :
                        cmd === command
                    ) :
                    typeof plugin.command === "string" ? // String?
                    plugin.command === command :
                    false

                if (!isAccept)
                    continue
                m.plugin = name
                if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
                    let chat = global.db.data.chats[m.chat]
                    let user = global.db.data.users[m.sender]
                    if (name != "owner-unbanchat.js" && chat?.isBanned)
                        return // Except this
                    if (name != "owner-unbanuser.js" && user?.banned)
                        return
                }
                if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { // Both Owner
                    fail("owner", m, this)
                    continue
                }
                if (plugin.rowner && !isROwner) { // Real Owner
                    fail("rowner", m, this)
                    continue
                }
                if (plugin.owner && !isOwner) { // Number Owner
                    fail("owner", m, this)
                    continue
                }
                if (plugin.mods && !isMods) { // Moderator
                    fail("mods", m, this)
                    continue
                }
                if (plugin.premium && !isPrems) { // Premium
                    fail("premium", m, this)
                    continue
                }
                if (plugin.group && !m.isGroup) { // Group Only
                    fail("group", m, this)
                    continue
                } else if (plugin.botAdmin && !isBotAdmin) { // You Admin
                    fail("botAdmin", m, this)
                    continue
                } else if (plugin.admin && !isAdmin) { // User Admin
                    fail("admin", m, this)
                    continue
                }
                if (plugin.private && m.isGroup) { // Private Chat Only
                    fail("private", m, this)
                    continue
                }
                if (plugin.register == true && _user.registered == false) { // Butuh daftar?
                    fail("unreg", m, this)
                    continue
                }
                m.isCommand = true
               let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17 // XP Earning per command
                if (xp > 200)
                    m.reply('cheater')
                else
                    m.exp += xp
                    if (!isPrems && plugin.credit && global.db.data.users[m.sender].credit < plugin.credit * 1) {
                        this.reply(m.chat, `*🟥 ليس لديك ما يكفي من الذهب*`, m)
                        continue // Gold finished
                    }
                    if (plugin.level > _user.level) {
                        this.reply(m.chat, `*🟥 المستوى المطلوب ${plugin.level} لاستخدام هذا الأمر.*\n*مستواك ${_user.level}*`, m)
                        continue // If the level has not been reached
                    }
                let extra = {
                    match,
                    usedPrefix,
                    noPrefix,
                    _args,
                    args,
                    command,
                    text,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }
                try {
                    await plugin.call(this, m, extra)
                    if (!isPrems)
                        m.credit = m.credit || plugin.credit || false
                } catch (e) {
                    // Error occured
                    m.error = e
                    console.error(e)
                    if (e) {
                        let text = format(e)
                        for (let key of Object.values(global.APIKeys))
                            text = text.replace(new RegExp(key, "g"), "#HIDDEN#")
                        if (e.name)
                            for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
                                let data = (await this.onWhatsApp(jid))[0] || {}
                                if (data.exists)
                                    return m.reply(`*🗂️ Plugin:* ${m.plugin}\n*👤 مرسل:* ${m.sender}\n*💬 المحادثه:* ${m.chat}\n*💻 الامر:* ${usedPrefix}${command} ${args.join(" ")}\n📄 *سجلات الأخطاء:*\n\n${text}`.trim(), data.jid)
                            }
                        m.reply(text)
                    }
                } finally {
                    // m.reply(util.format(_user))
                    if (typeof plugin.after === "function") {
                        try {
                            await plugin.after.call(this, m, extra)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                    if (m.credit)
                    m.reply(`لقد استخدمت *${+m.credit}*`) 
                }
                break
            }
        }
    } catch (e) {
        console.error(e)
    } finally {
        if (opts["queque"] && m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
            if (quequeIndex !== -1)
                this.msgqueque.splice(quequeIndex, 1)
        }
        //console.log(global.db.data.users[m.sender])
        let user, stats = global.db.data.stats
        if (m) {
            if (m.sender && (user = global.db.data.users[m.sender])) {
                user.exp += m.exp
                user.credit -= m.credit * 1
                user.bank -= m.bank
                user.chicken -= m.chicken
            }

            let stat
            if (m.plugin) {
                let now = +new Date
                if (m.plugin in stats) {
                    stat = stats[m.plugin]
                    if (!isNumber(stat.total))
                        stat.total = 1
                    if (!isNumber(stat.success))
                        stat.success = m.error != null ? 0 : 1
                    if (!isNumber(stat.last))
                        stat.last = now
                    if (!isNumber(stat.lastSuccess))
                        stat.lastSuccess = m.error != null ? 0 : now
                } else
                    stat = stats[m.plugin] = {
                        total: 1,
                        success: m.error != null ? 0 : 1,
                        last: now,
                        lastSuccess: m.error != null ? 0 : now
                    }
                stat.total += 1
                stat.last = now
                if (m.error == null) {
                    stat.success += 1
                    stat.lastSuccess = now
                }
            }
        }

        try {
            if (!opts["noprint"]) await (await import("./lib/print.js")).default(m, this)
        } catch (e) {
            console.log(m, m.quoted, e)
        }
        if (process.env.autoRead)
            await conn.readMessages([m.key])
        if (process.env.statusview && m.key.remoteJid === 'status@broadcast') 
            await conn.readMessages([m.key])
    }
}

/**
 * Handle groups participants update
 * @param {import("@whiskeysockets/baileys").BaileysEventMap<unknown>["group-participants.update"]} groupsUpdate 
 */
export async function participantsUpdate({
    id,
    participants,
    action
}) {
    if (opts["self"] || this.isInit) return;
    if (global.db.data == null) await loadDatabase();
    const chat = global.db.data.chats[id] || {};
    const emoji = {
        promote: '👤👑',
        demote: '👤🙅‍♂️',
        welcome: '👋',
        bye: '👋',
        bug: '🐛',
        mail: '📮',
        owner: '👑'
    };

    

    switch (action) {
        case 'add':
            if (chat.welcome) {
              let groupMetadata = await this.groupMetadata(id) || (conn.chats[id] || {}).metadata;
              for (let user of participants) {
                let pp, ppgp;
                try {
                  pp = await this.profilePictureUrl(user, 'image');
                  ppgp = await this.profilePictureUrl(id, 'image');
                } catch (error) {
                  console.error(`حدث خطأ أثناء استرداد الصورة الشخصية: ${error}`);
                  pp = 'https://telegra.ph/file/d37b343ee8f981be6ffba.jpg'; // Assign default image URL
                  ppgp = 'https://telegra.ph/file/d37b343ee8f981be6ffba.jpg'; // Assign default image URL
                } finally {
                  let text = (chat.sWelcome || this.welcome || conn.welcome || 'Welcome, @user')
                    .replace('@group', await this.getName(id))
                    .replace('@desc', groupMetadata.desc?.toString() || 'لايوجد وصف')
                    .replace('@user', '@' + user.split('@')[0]);
          
                  let nthMember = groupMetadata.participants.length;
                  let secondText = `اهلا ياحب, ${await this.getName(user)}, رقم ${nthMember}العضو`;
          
                  let welcomeApiUrl = `https://api.popcat.xyz/welcomecard?background=${encodeURIComponent(
                    'https://telegra.ph/file/919c9aa59b8dc5cae41a8.png'
                  )}&text1=${encodeURIComponent(
                    await this.getName(user)
                  )}&text2=نورت+الجروب+يحب&text3=عدد+الاعضاء:${encodeURIComponent(
                    nthMember.toString()
                  )}&avatar=${encodeURIComponent(pp)}`;
          
                  try {
                    let welcomeResponse = await fetch(welcomeApiUrl);
                    let welcomeBuffer = await welcomeResponse.buffer();
          
                    this.sendFile(id, welcomeBuffer, 'welcome.png', text, null, false, { mentions: [user] });
                  } catch (error) {
                    console.error(`حدث خطأ أثناء إنشاء صورة الترحيب: ${error}`);
                  }
                }
              }
            }
            break;
          
          case 'remove':
            if (chat.welcome) {
              let groupMetadata = await this.groupMetadata(id) || (conn.chats[id] || {}).metadata;
              for (let user of participants) {
                let pp, ppgp;
                try {
                  pp = await this.profilePictureUrl(user, 'image');
                  ppgp = await this.profilePictureUrl(id, 'image');
                } catch (error) {
                  console.error(`حدث خطأ أثناء استرداد الصورة الشخصية: ${error}`);
                  pp = 'https://telegra.ph/file/d37b343ee8f981be6ffba.jpg'; // Assign default image URL
                  ppgp = 'https://telegra.ph/file/d37b343ee8f981be6ffba.jpg'; // Assign default image URL
                } finally {
                  let text = (chat.sBye || this.bye || conn.bye || 'اهلا, @user')
                    .replace('@user', '@' + user.split('@')[0]);
          
                  let nthMember = groupMetadata.participants.length;
                  let secondText = `وداعا, رقم ${nthMember}عضونا`;
          
                  let leaveApiUrl = `https://api.popcat.xyz/welcomecard?background=${encodeURIComponent(
                    'https://telegra.ph/file/919c9aa59b8dc5cae41a8.png'
                  )}&text1=${encodeURIComponent(
                    await this.getName(user)
                  )}&text2=الي+القاء&text3=عدد+الاعضاء:${encodeURIComponent(
                    nthMember.toString()
                  )}&avatar=${encodeURIComponent(pp)}`;
          
                  try {
                    let leaveResponse = await fetch(leaveApiUrl);
                    let leaveBuffer = await leaveResponse.buffer();
          
                    this.sendFile(id, leaveBuffer, 'leave.png', text, null, false, { mentions: [user] });
                  } catch (error) {
                    console.error(`حدث خطأ أثناء إنشاء صورة الإجازة: ${error}`);
                  }
                }
              }
            }
            break;
            case "promote":
                const promoteText = (chat.sPromote || this.spromote || conn.spromote || `${emoji.promote} @user *هو الآن المشرف*`).replace("@user", "@" + participants[0].split("@")[0]);
                
                if (chat.detect) {
                    this.sendMessage(id, {
                        text: promoteText.trim(),
                        mentions: [participants[0]]
                    });
                }
                break;
            case "demote":
                const demoteText = (chat.sDemote || this.sdemote || conn.sdemote || `${emoji.demote} @user *تم تخفيض رتبته من المشرف*`).replace("@user", "@" + participants[0].split("@")[0]);
                
                if (chat.detect) {
                    this.sendMessage(id, {
                        text: demoteText.trim(),
                        mentions: [participants[0]]
                    });
                }
                break;
    }
}


/**
 * Handle groups update
 * @param {import("@whiskeysockets/baileys").BaileysEventMap<unknown>["groups.update"]} groupsUpdate 
 */
export async function groupsUpdate(groupsUpdate) {
    if (opts["self"]) return
    for (const groupUpdate of groupsUpdate) {
        const id = groupUpdate.id
        if (!id) continue
        let chats = global.db.data.chats[id] || {}
        const emoji = {
            desc: '📝',
            subject: '📌',
            icon: '🖼️',
            revoke: '🔗',
            announceOn: '🔒',
            announceOff: '🔓',
            restrictOn: '🚫',
            restrictOff: '✅',
        }

        let text = ""
        if (!chats.detect) continue

        if (groupUpdate.desc) {
            text = (chats.sDesc || this.sDesc || conn.sDesc || `*${emoji.desc} تم تغيير الوصف إلى*\n@desc`)
                .replace("@desc", groupUpdate.desc)
        } else if (groupUpdate.subject) {
            text = (chats.sSubject || this.sSubject || conn.sSubject || `*${emoji.subject} تم تغيير الموضوع إلى*\n@subject`)
                .replace("@subject", groupUpdate.subject)
        } else if (groupUpdate.icon) {
            text = (chats.sIcon || this.sIcon || conn.sIcon || `*${emoji.icon} تم تغيير الصوره*`)
                .replace("@icon", groupUpdate.icon)
        } else if (groupUpdate.revoke) {
            text = (chats.sRevoke || this.sRevoke || conn.sRevoke || `*${emoji.revoke} تم تغيير رابط المجموعة إلى*\n@revoke`)
                .replace("@revoke", groupUpdate.revoke)
        } else if (groupUpdate.announce === true) {
            text = (chats.sAnnounceOn || this.sAnnounceOn || conn.sAnnounceOn || `*${emoji.announceOn} المجموعة مغلقة الآن!*`)
        } else if (groupUpdate.announce === false) {
            text = (chats.sAnnounceOff || this.sAnnounceOff || conn.sAnnounceOff || `*${emoji.announceOff} المجموعة مفتوحة الآن!*`)
        } else if (groupUpdate.restrict === true) {
            text = (chats.sRestrictOn || this.sRestrictOn || conn.sRestrictOn || `*${emoji.restrictOn} تقتصر المجموعة الآن على المشاركين فقط!*`)
        } else if (groupUpdate.restrict === false) {
            text = (chats.sRestrictOff || this.sRestrictOff || conn.sRestrictOff || `*${emoji.restrictOff} تقتصر المجموعة الآن على المسؤولين فقط!*`)
        }
        

        if (!text) continue
        await this.sendMessage(id, { text, mentions: this.parseMention(text) })
    }
}

/**
Delete Chat
 */
export async function deleteUpdate(message) {
    try {
        
       
      if (typeof process.env.antidelete === 'undefined' || process.env.antidelete.toLowerCase() === 'false') return;


        const {
            fromMe,
            id,
            participant
        } = message
        if (fromMe)
            return
        let msg = this.serializeM(this.loadMessage(id))
        if (!msg)
            return
        let chat = global.db.data.chats[msg.chat] || {}
       
            await this.reply(conn.user.id, `
            ≡ حذفت رسالة 
            ┌─⊷  𝘼𝙉𝙏𝙄 𝘿𝙀𝙇𝙀𝙏𝙀 
            ▢ *رقم :* @${participant.split`@`[0]} 
            └─────────────
            `.trim(), msg, {
                        mentions: [participant]
                    })
        this.copyNForward(conn.user.id, msg, false).catch(e => console.log(e, msg))
    } catch (e) {
        console.error(e)
    }
}

/*
 Polling Update 
*/
export async function pollUpdate(message) {
  for (const { key, update } of message) {
            if (message.pollUpdates) {
                const pollCreation = await this.serializeM(this.loadMessage(key.id))
                if (pollCreation) {
                    const pollMessage = await getAggregateVotesInPollMessage({
                        message: pollCreation.message,
                        pollUpdates: pollCreation.pollUpdates,
                    })
                    message.pollUpdates[0].vote = pollMessage
                    
                    await console.log(pollMessage)
                    this.appenTextMessage(message, message.pollUpdates[0].vote || pollMessage.filter((v) => v.voters.length !== 0)[0]?.name, message.message);
                }
            }
        }
}

/*
Update presence
*/
export async function presenceUpdate(presenceUpdate) {
    const id = presenceUpdate.id;
    const nouser = Object.keys(presenceUpdate.presences);
    const status = presenceUpdate.presences[nouser]?.lastKnownPresence;
    const user = global.db.data.users[nouser[0]];

    if (user?.afk && status === "composing" && user.afk > -1) {
        if (user.banned) {
            user.afk = -1;
            user.afkReason = "تم حظر المستخدم AFC";
            return;
        }

        await console.log("AFK");
        const username = nouser[0].split("@")[0];
        const timeAfk = new Date() - user.afk;
        const caption = `\n@${username} توقف عن وضع AFK وهو يقوم بالكتابة حاليًا.\n\nالسبب: ${
            user.afkReason ? user.afkReason : "بدون سبب"
          }\nللماضي ${timeAfk.toTimeString()}.\n`;
          

        this.reply(id, caption, null, {
            mentions: this.parseMention(caption)
        });
        user.afk = -1;
        user.afkReason = "";
    }
}


/**
dfail
 */
global.dfail = (type, m, conn) => {
    const userTag = `*@${m.sender.split("@")[0]}*, `
    const emoji = {
        general: '⚙️',
        owner: '🐉',
        moderator: '🛡️',
        premium: '💎',
        group: '👥',
        private: '📱',
        admin: '👤',
        botAdmin: '🤖',
        unreg: '🔒',
        nsfw: '🔞',
        rpg: '🎮',
        restrict: '⛔',
    }

    const msg = {
        owner: `*★『${emoji.owner} امـر خـاص بـمطور الـبوت فقـط يـ${userTag}』*\n*لـ دخـول جـروب دعـم الـبوت ➱『 https://chat.whatsapp.com/EiUizazsr6kLCwgfKJ7F5q 』*`,
        moderator: `*★『${emoji.moderator} هـاد الامـر لـ الـمـوديـتـر فـقـط يـ ${userTag}』*\n*لـ دخـول جـروب دعـم الـبوت ➱『 https://chat.whatsapp.com/EiUizazsr6kLCwgfKJ7F5q 』*`,
        premium: `*★『${emoji.premium} هـاد الامـر للبـريـميـوم فقـط يـ ${userTag}』*\n*لـ دخـول جـروب دعـم الـبوت ➱『 https://chat.whatsapp.com/EiUizazsr6kLCwgfKJ7F5q 』*`,
        group: `*★『${emoji.group} هـاد الامـر يـعمل فقـط فـي المـجموعـات يـ${userTag}』*\n*لـ دخـول جـروب دعـم الـبوت ➱『 https://chat.whatsapp.com/EiUizazsr6kLCwgfKJ7F5q 』*`,
        private: `*★『${emoji.private} هـاد الامـر خـاص بـ البوت فقـط يـ ${userTag}』*\n*لـ دخـول جـروب دعـم الـبوت ➱『 https://chat.whatsapp.com/EiUizazsr6kLCwgfKJ7F5q 』*`,
        admin: `*★『${emoji.admin} هـاد الامـر خـاص بـ ادمـن المـجمـوعه فقـط يـ ${userTag}』*\n*لـ دخـول جـروب دعـم الـبوت ➱『 https://chat.whatsapp.com/EiUizazsr6kLCwgfKJ7F5q 』*`,
        botAdmin: `*★『${emoji.botAdmin} هـاد الامـر يجـب ان يـكون الـبوت مشـرف فـي المجمـوعه يـ ${userTag}』*\n*لـ دخـول جـروب دعـم الـبوت ➱『 https://chat.whatsapp.com/EiUizazsr6kLCwgfKJ7F5q 』*`,
        unreg: `*★『${emoji.unreg} يـجـب ان تـكـون مـسـجـل لـي اسـتـعـمـال الامـر لـلـتـسـجـيـل اكـتـب .تسجيل ${userTag}』*\n*لـ دخـول جـروب دعـم الـبوت ➱『 https://chat.whatsapp.com/EiUizazsr6kLCwgfKJ7F5q 』*`,
        nsfw: `*★『${emoji.nsfw} يـمنع استعـمال الامـر يـ』*\n*لـ دخـول جـروب دعـم الـبوت➱『 https://chat.whatsapp.com/EiUizazsr6kLCwgfKJ7F5q 』*`,
        restrict: `*★『${emoji.restrict} تـم تـعـطـيـل الامـر مـن الـمـالـك يـ ${userTag}』*\n*لـ دخـول جـروب دعـم الـبوت ➱『 https://chat.whatsapp.com/EiUizazsr6kLCwgfKJ7F5q 』*`,
    };

    const errorMessage = msg[type];
    if (errorMessage) {
        conn.sendMessage(m.chat, {
            video: { url: 'https://telegra.ph/file/04db12158ebe99b2828a1.mp4' },
            caption: errorMessage,
            gifPlayback: true,
            gifAttribution: 0,
        }, { quoted: m });
    }
};

let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update handler.js"))
    if (global.reloadHandler) console.log(await global.reloadHandler())
})
