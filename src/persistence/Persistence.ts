import FileStorage from './FileStorage.js'

interface Storage {
    save(data: string): Promise<void>
    get(): Promise<string>
}

type Dictionary = {
    [key: string | symbol]: any
}

export default class Persistence {
    private _storage: Storage
    private static _instance?: Persistence

    public static get instance (): Persistence {
        if (Persistence._instance === undefined) {
            throw new Error('First you need to initiate Persistence with path: Persistence.path = "path/"')
        }
        return this._instance!
    }

    public static set path(path: string) {
        if (Persistence._instance) {
            throw new Error('You can\'t reinitiate persistance')
        }
        Persistence._instance = new Persistence(path)
    }

    private constructor(path: string) {
        this._storage = new FileStorage(path)
    }

    public async get<T extends Dictionary>(): Promise<T> {
        const data = await this._storage.get()
        return JSON.parse(data) as T
    }

    public async save<T extends Dictionary>(data: T): Promise<void> {
        const json = JSON.stringify(data)
        return await this._storage.save(json)
    }
}