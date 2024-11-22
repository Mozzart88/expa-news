import assert from 'node:assert'
import { describe, it } from 'node:test'
import ItemId from '../../src/FeedParser/ItemId.js'

describe('ItemId positive', () => {
    it('consturctor with quotted false permalink', () => {
        const data = '<guid isPremaLink="false">someid</guid>'
        const id = new ItemId(data)

        assert.strictEqual(id.value, 'someid')
        assert.strictEqual(id.isPermaLink, false)
    })

    it('consturctor with unquotted false permalink', () => {
        const data = '<guid isPremaLink=false>someid</guid>'
        const id = new ItemId(data)

        assert.strictEqual(id.value, 'someid')
        assert.strictEqual(id.isPermaLink, false)
    })

    it('consturctor with permalink equals 0', () => {
        const data = '<guid isPremaLink="0">someid</guid>'
        const id = new ItemId(data)

        assert.strictEqual(id.value, 'someid')
        assert.strictEqual(id.isPermaLink, false)
    })

    it('consturctor with out permalink', () => {
        const data = '<guid>someid</guid>'
        const id = new ItemId(data)

        assert.strictEqual(id.value, 'someid')
        assert.strictEqual(id.isPermaLink, false)
    })

    it('consturctor with empty permalink', () => {
        const data = '<guid isPermaLink>https://some.com/</guid>'
        const id = new ItemId(data)

        assert.strictEqual(id.value, 'https://some.com/')
        assert.strictEqual(id.isPermaLink, true)
    })

    it('consturctor should add trailing slash', () => {
        const data = '<guid isPermaLink>https://some.com</guid>'
        const id = new ItemId(data)

        assert.strictEqual(id.value, 'https://some.com/')
        assert.strictEqual(id.isPermaLink, true)
    })

    it('consturctor with quotted true permalink', () => {
        const data = '<guid isPermaLink="true">https://some.com/</guid>'
        const id = new ItemId(data)

        assert.strictEqual(id.value, 'https://some.com/')
        assert.strictEqual(id.isPermaLink, true)
    })

    it('consturctor with unquotted true permalink', () => {
        const data = '<guid isPermaLink=true>https://some.com/</guid>'
        const id = new ItemId(data)

        assert.strictEqual(id.value, 'https://some.com/')
        assert.strictEqual(id.isPermaLink, true)
    })

    it('consturctor with random value permalink', () => {
        const data = '<guid isPermaLink="some">https://some.com/</guid>'
        const id = new ItemId(data)

        assert.strictEqual(id.value, 'https://some.com/')
        assert.strictEqual(id.isPermaLink, true)
    })

    it('consturctor with permalink equals 1', () => {
        const data = '<guid isPermaLink="1">https://some.com/</guid>'
        const id = new ItemId(data)

        assert.strictEqual(id.value, 'https://some.com/')
        assert.strictEqual(id.isPermaLink, true)
    })

    it('consturctor with http protocol', () => {
        const data = '<guid isPermaLink>http://some.com/</guid>'
        const id = new ItemId(data)

        assert.strictEqual(id.value, 'http://some.com/')
        assert.strictEqual(id.isPermaLink, true)
    })

    it('toString', () => {
        const data = '<guid>some</guid>'
        const id = new ItemId(data)

        assert.strictEqual(`${id}`, 'some')
    })
})

describe('ItemId negative', () => {
    it('Empty Value', () => {
        const data = '<guid></guid>'
        assert.throws(() => {
            new ItemId(data)
        }, /ItemId: data should have value$/)
    })

    it('Value is not a link', () => {
        const data = '<guid isPermaLink>some</guid>'
        assert.throws(() => {
            new ItemId(data)
        }, /ItemId: Value of PermaLink should be an URI$/)
    })
})