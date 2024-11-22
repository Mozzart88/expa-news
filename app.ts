import Feed from './src/FeedParser/Feed.js'

const urls = [
    'https://www.lapoliticaonline.com/files/rss/ultimasnoticias.xml',
    'https://www.pagina12.com.ar/rss/portada'
]

function printFeed(feed: Feed) {
    for(const note of feed) {
        console.log(`${note}`)
   }
}

for(const url of urls) {
    const feed = await new Feed(url).update()
    console.log(feed.ttl, feed.length)
    feed.autoUpdate((update) => {
        console.log('New updates')
    })
}
