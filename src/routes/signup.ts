import type {RequestHandler} from "@sveltejs/kit";
import {v4 as uuidv4} from 'uuid';
import bcrypt from 'bcrypt';
import type {DB} from "$lib/db";

export const post: RequestHandler<{ db: DB },
    Partial<{ email: string; password: string; ['repeat-password']: string }>> = async (req) => {
    if (typeof req.body === 'string' || Array.isArray(req.body)) return {status: 400, body: {error: 'Incorrect input'}}

    // Handle FormData & JSON
    const input = {
        email: ('get' in req.body ? req.body.get('email') : req.body.email)?.toLowerCase().trim(),
        password: 'get' in req.body ? req.body.get('password') : req.body.password,
        'repeat-password': 'get' in req.body ? req.body.get('repeat-password') : req.body['repeat-password']
    }
    if (input.password !== input['repeat-password']) return {status: 400, body: {error: 'Passwords do not match'}}

    const db = req.locals.db
    const user = {id: uuidv4(), email: input.email, pwhash: await bcrypt.hash(input.password, 10)}
    db.users.set(user.email, user)
    return {status: 201, body: {user}}
}