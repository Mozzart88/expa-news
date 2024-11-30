import assert from 'node:assert'
import { after, describe, it } from 'node:test'
import Persistence from '../../src/persistence/Persistence.js'

describe('Persistence', async () => {
    it('Not initialized', () => {
        assert.throws(() => {
            Persistence.instance
        }, new Error('First you need to initiate Persistence with path: Persistence.path = "path/"'))
    })

    it('initializing', () => {
        Persistence.path = './tests/provision/data.json'
    })

    it('Reinitializing', () => {
        assert.throws(() => {
            Persistence.path = 'other/path'
        }, new Error('You can\'t reinitiate persistance'))
    })

    it('Persistence.instance', () => {
        Persistence.instance
    })

    it('Persistence.get', async () => {
        type dataType = {
            some: string
        }
        const expected: dataType = {
            some: 'string'
        }
        const data = await Persistence.instance.get<dataType>()
        assert.deepStrictEqual(data, expected)
    })

    it('Persistence.save', async () => {
        type dataType = {
            some: string
        }
        const data: dataType = {
            some: 'other'
        }
        Persistence.instance.save(data)
        const actual = await Persistence.instance.get<dataType>()
        assert.deepStrictEqual(actual, data)
    })

    after(() => {
        type dataType = {
            some: string
        }
        const data: dataType = {
            some: 'string'
        }
        Persistence.instance.save(data)
    })
})
