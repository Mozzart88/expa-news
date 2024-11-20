import assert from 'node:assert'
import { describe, it } from 'node:test'
import ItemEnclosure from '../../src/FeedParser/ItemEnclosure.js'

describe('ItemEnclosure positive', () => {
    it('constructor with out length', () => {
        const data = '<enclosure url="https://some.com/" type="text/plain"/>'
        const enclosure = new ItemEnclosure(data)

        assert.deepStrictEqual(enclosure.url, new URL('https://some.com/'))
        assert.strictEqual(enclosure.type, 'text/plain')
        assert.strictEqual(enclosure.length, 0)
    })

    it('constructor with length', () => {
        const data = '<enclosure url="https://some.com/" type="text/plain" length="10"/>'
        const enclosure = new ItemEnclosure(data)

        assert.deepStrictEqual(enclosure.url, new URL('https://some.com/'))
        assert.strictEqual(enclosure.type, 'text/plain')
        assert.strictEqual(enclosure.length, 10)
    })
})

describe('ItmeEnclosure negative', () => {
    it('Undefined url', () => {
        const data = '<enclosure type="text/plain"/>'
        assert.throws(() => {
            new ItemEnclosure(data)
        }, new Error('Enclosure: URL attribute is mandatory'))
    })

    it('Not an URL', () => {
        const data = '<enclosure url="some" type="text/plain"/>'
        assert.throws(() => {
            new ItemEnclosure(data)
        }, 'Enclosure: URL attribute should contains url')
    })

    it('Undefined type', () => {
        const data = '<enclosure url="http://some.com"/>'
        assert.throws(() => {
            new ItemEnclosure(data)
        }, new Error('Enclosure: Type attribute is mandatory'))
    })
})