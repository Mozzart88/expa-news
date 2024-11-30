import assert from 'node:assert'
import { after, describe, it } from 'node:test'
import FileStorage from '../../src/persistence/FileStorage.js'
import { unlink } from 'node:fs/promises'

describe('FileStorage positive', async () => {
    const path = './tests/provision/data.json'
    const tmpPath = './tests/provision/tmp.json'
    it('constructor', () => {
        new FileStorage(path)
    })

    it('FileStorage.get', async () => {
        const storage = new FileStorage(path)
        const data = await storage.get()
        assert.deepStrictEqual(data, '{"some":"string"}')
    })

    it('FileStorage.save', async () => {
        const storage = new FileStorage(tmpPath)
        await storage.save('some string')
        const data = await storage.get()
        assert.deepStrictEqual(data, 'some string')
    })

    after(async () => {
        await unlink(tmpPath)
    })
})

describe('FileStorage negative', async () => {
    it('FileStorage.get no such file', async () => {
        const storage = new FileStorage('noexists.txt')
        assert.rejects(async () => {
                await storage.get()
        }, /ENOENT/)
    })
})
