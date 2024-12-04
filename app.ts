import Feed, { type FeedOptions } from './src/FeedParser/Feed.js'
import FeedItem, { type JSONSchema as FeedItemJson } from './src/FeedParser/FeedItem.js'
import GPTAssistatn, { type TranslateResponse } from './src/gpt/GPTAssistant.js'
import { env } from 'node:process'
import TGBot from './src/tg/TGBot.js'
import Persistence from './src/persistence/Persistence.js'
import { UUID } from 'node:crypto'


const apiKeys = {
    openAI: env.OPENAI_KEY,
    tg: env.TG_BOT_KEY
}

if (Object.keys(apiKeys).some(key => apiKeys[key] === undefined)) {
    const undefinededKeys = Object.keys(apiKeys).map((key) => {
        if (apiKeys[key] === undefined)
            return key
    }).join(', ')
    throw new Error(`Some of API KEYS is undefined: ${undefinededKeys}`)
}

function log(msg: string) {
    console.log(`${new Date().toUTCString()}: ${msg}`)
}

function mkMsg(translate: TranslateResponse, note: FeedItemJson): string {
    const categories = translate.categories.map((cat) => cat.replace(' ', '-'))
    return `*${translate.title}*
    
${translate.content}

[Ссылка на публикацию](${note.link})

${ categories.length > 0 ? `#${categories.join(' #')}` : ''}
    `
}

async function translateAndSend(feed: Feed, note: FeedItem) {
    const jsont = note.toJSON()
    if (!jsont.title || (!jsont.content && !jsont.description)) {
        console.error(jsont)
        throw new Error(`Empty requeired content in note: ${jsont}`)
    }
    const translate = await gpt.translate(feed.thread, JSON.stringify(jsont))
    const msg = mkMsg(translate, jsont)
    for(const channel of  feed.channels) {
        tgBot.sendMessage(channel, msg)
    }
    const users = data.admins.concat(data.editors).toSorted().filter((val, index, arr) => {
        return !(arr.indexOf(val) > index)
    })
    for(const user of  users) {
        tgBot.sendMessage(user, msg)
    }
}

async function handler(feed: Feed) {
    data.feeds[feed.id] = feed.toJSON()
    Persistence.instance.save(data)
    log(`New notes on ${feed.publisher}: ${feed.length}`)
    for(const note of feed) {
        try {
            await translateAndSend(feed, note)
        } catch (err) {
            console.error(err)
        }
    }
}

type DataType = {
    admins: Array<string | number>,
    editors: Array<string | number>
    feeds: {[key: UUID]: FeedOptions}
}

Persistence.path = 'data/data.json'
const data = await Persistence.instance.get<DataType>()
const gpt = new GPTAssistatn(
    apiKeys.openAI!
)

const tgBot = new TGBot(apiKeys.tg!)



for(const id in data.feeds) {
    const feedConfig: FeedOptions = data.feeds[id]
    const feed = new Feed(feedConfig)
    log(`${feed.publisher} Publisher started`)
    feed.autoUpdate(handler)
}
