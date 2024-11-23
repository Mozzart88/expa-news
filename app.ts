import Feed from './src/FeedParser/Feed.js'
import GPTAssistatn from './src/gpt/GPTAssistant.js'
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

function printFeed(feed: Feed) {
    for(const note of feed) {
        console.log(`${note}`)
   }
}

const gpt = new GPTAssistatn(
    apiKeys.openAI!,
    'thread_k3qRvKh9FresuK4YxTvU46IG'
)

const tgBot = new TGBot(apiKeys.tg!)

for(const url of urls) {
    const feed = await new Feed(url).update()
    const note = feed.latest.toJSON()
    const translate = await gpt.translate(JSON.stringify(note))
    console.log(translate)
    const msg = `*${translate.title}*
    
${translate.content}

[Ссылка на публикацию](${note.link})

${ translate.categories.length > 0 ? `#${translate.categories.join(' #')}` : ''}
    `
    await tgBot.sendMessage('@expat_news', msg)
    break
    // feed.autoUpdate((update) => {
    //     console.log('New updates')
    // })
}
