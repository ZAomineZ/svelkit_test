import type {RequestHandler} from "@sveltejs/kit";
import {v4 as uuidv4} from 'uuid';
import type {DB} from "$lib/db";
import bcrypt from "bcrypt";

export const post: RequestHandler<{ db: DB }, Partial<{ email: string, password: string }>> = async (req) => {
    if (typeof req.body === 'string' || Array.isArray(req.body)) return {status: 400, body: {error: 'Incorrect input'}}

    // Handle FormData & JSON
    const input = {
        email: ('get' in req.body ? req.body.get('email') : req.body.email)?.toLowerCase().trim(),
        password: 'get' in req.body ? req.body.get('password') : req.body.password
    }

    const db = req.locals.db
    const user = db.users.get(input.email)
    if (!user) return {status: 400, body: {error: 'Incorrect email or password'}}

    const isPasswordValid = await bcrypt.compare(input.password, user.pwhash)
    if (!isPasswordValid) return {status: 400, body: {error: 'Incorrect email or password'}}

    const token = {id: uuidv4(), email: user.email}
    db.tokens.set(token.id, token)

    return {status: 200, body: {user}, headers: {'set-cookie': `token=${token.id}`}}
}