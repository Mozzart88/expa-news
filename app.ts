import Feed from './src/FeedParser/Feed.js'
import GPTAssistatn from './src/gpt/GPTAssistant.js'
import { env } from 'node:process'


const apiKeys = {
    openAI: env.OPENAI_KEY
}

if (Object.keys(apiKeys).some(key => apiKeys[key] === undefined)) {
    throw new Error('some of API KEYS is undefined')
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
    'thread_6uebdNd3qitQbMmxM4WcSOfP'
)

for(const url of urls) {
    const feed = await new Feed(url).update()
    const note = feed.latest.toJSON()
    const msg = await gpt.translate(JSON.stringify(note))
    
    break
    // feed.autoUpdate((update) => {
    //     console.log('New updates')
    // })
}
