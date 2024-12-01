import { access, readFile, writeFile } from "fs/promises"

export default class FileStorage {
    private _path: string

    constructor(path: string) {
        this._path = path
    }

    public async get(): Promise<string> {
        try {
            return await readFile(this._path, {

                encoding: 'utf-8',
                flag: 'r+'
            })
        } catch (err) {
            throw err
        }
    }

    public async save(data: string): Promise<void> {
        return await writeFile(this._path, data, {
                    flag: 'w'
                })
    }

}