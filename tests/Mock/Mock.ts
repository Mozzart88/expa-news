import assert from 'node:assert'
import { describe, it } from 'node:test'

export default class Mock {
    private readonly obj: any
    private static mockedMethods: { [key: string | symbol]: PropertyDescriptor} = {}

    constructor(o: any) {
        this.obj = o
    }

    public method(name: string, fn: Function) {
        const proto = this.obj.constructor.name
        const method = `${proto}::${name}`
        if (Mock.mockedMethods[method] === undefined) {
            const descriptor = Object.getOwnPropertyDescriptor(this.obj, name)
            if (descriptor === undefined) throw new Error(`Method with name ${name} does not exists on mocked object`)
            Mock.mockedMethods[method] = descriptor
        }
        Object.defineProperty(
            this.obj,
            name,
            { 'value': fn }
        ) 
    }

    public reset(name: string) {
        const proto = this.obj.constructor.name
        const method = `${proto}::${name}`
        if (Mock.mockedMethods[method] === undefined)
            return
        Object.defineProperty(this.obj, name, Mock.mockedMethods[method])
        delete Mock.mockedMethods[method]
}

    public resetAll() {
        for(const name of Object.getOwnPropertyNames(this.obj)) {
            this.reset(name)
        }
    }
    
}

class SomeTestableClass {
    public toString() {
        return 'SomeTestableClass::toString'
    }

    public hello() {
        return 'Hello'
    }
}

describe('Mock Class', () => {
    it('constructor', () => {
        new Mock(SomeTestableClass.prototype)
    })

    it('method', () => {
        const mock = new Mock(SomeTestableClass.prototype)
        mock.method('hello', () => {
            return 'Hello world'
        })
        const obj = new SomeTestableClass()

        assert.strictEqual(obj.hello(), 'Hello world')
    })

    it.skip('testableClass.hello should return "Hello"', () => {
        assert.strictEqual(new SomeTestableClass().hello(), 'Hello')
    })

    it('reset', () => {
        const mock = new Mock(SomeTestableClass.prototype)
        mock.method('hello', () => {
            return 'Hello world'
        })
        mock.reset('hello')
        
        const obj = new SomeTestableClass()
        assert.strictEqual(obj.hello(), 'Hello')
    })
    
    it('resetAll', () => {
        const mock = new Mock(SomeTestableClass.prototype)
        mock.method('hello', () => {
            return 'Hello world'
        })
        mock.method('toString', () => {
            return 'toString'
        })
        mock.resetAll()
        
        const obj = new SomeTestableClass()
        assert.strictEqual(obj.hello(), 'Hello')
        assert.strictEqual(obj.toString(), 'SomeTestableClass::toString')
    })
})