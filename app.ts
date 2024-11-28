import Feed from './src/FeedParser/Feed.js'
import FeedItem, { type JSONSchema as FeedItemJson } from './src/FeedParser/FeedItem.js'
import GPTAssistatn, { type TranslateResponse } from './src/gpt/GPTAssistant.js'
import { env } from 'node:process'
import TGBot from './src/tg/TGBot.js'


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

const urls = [
    'https://www.lapoliticaonline.com/files/rss/ultimasnoticias.xml',
    'https://www.pagina12.com.ar/rss/portada'
]

function mkMsg(translate: TranslateResponse, note: FeedItemJson): string {
    const categories = translate.categories.map((cat) => cat.replace(' ', '-'))
    return `*${translate.title}*
    
${translate.content}

[Ссылка на публикацию](${note.link})

${ categories.length > 0 ? `#${categories.join(' #')}` : ''}
    `
}

async function translateAndSend(note: FeedItem) {
    const jsont = note.toJSON()
    const translate = await gpt.translate(JSON.stringify(jsont))
    const msg = mkMsg(translate, jsont)
    await tgBot.sendMessage('@expat_news', msg)
}

async function handler(feed: Feed) {
    for(const note of feed) {
        translateAndSend(note)
    }
}

const gpt = new GPTAssistatn(
    apiKeys.openAI!,
    'thread_k3qRvKh9FresuK4YxTvU46IG'
)

const tgBot = new TGBot(apiKeys.tg!)



for(const url of urls) {
    const feed = await new Feed(url).update()
    await translateAndSend(feed.latest)
    feed.autoUpdate(handler)
}
