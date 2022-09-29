import fs from 'fs'

export type User = {
    id: string
    email: string
    pwhash: string
}

export type UserToken = {
    id: string
    email: string
}

export interface DB {
    users: Map<string, User>
    tokens: Map<string, UserToken>
    __stop: () => void
}

const DB_FILE = 'db.json'

export const initDB = async () => {
    let data: Record<string, Array<[string, any]>> = {}
    try {
        const str = fs.readFileSync(DB_FILE)
        data = JSON.parse(str.toString())
    } catch (err) {
        console.error(`Failed to read ${DB_FILE}`, err)
    }
    const db: DB = {
        users: new Map<string, User>(data.users),
        tokens: new Map<string, UserToken>(data.tokens),
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        __stop: () => {}
    }

    const interval = setInterval(() => {
        try {
            fs.writeFileSync(DB_FILE, JSON.stringify({users: [...db.users.entries()], tokens: [...db.tokens.entries()]}))
        } catch (err) {
            console.error(`Failed to write ${DB_FILE}`, err)
        }
    }, 1_000)

    db.__stop = () => {
        clearInterval(interval)
    }

    return db
}