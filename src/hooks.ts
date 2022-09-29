import type {GetSession, Handle} from '@sveltejs/kit';
import {initDB} from "$lib/db";
import { parse } from 'querystring';

export const setup = initDB().catch((err) => {
	console.error(err)
	// Exit the app if setup has failed
	process.exit(-1)
})

export const handle: Handle = async ({request, resolve}) => {
	const db = await setup
	request.locals.db = db
	const cookies = request.headers.cookie
		?.split(';')
		.map(v => parse(v.trim()))
		.reduceRight((a, c) => {
			return Object.assign(a, c)
		})
	if (cookies?.token && typeof cookies.token === 'string') {
		const existingToken = db.tokens.get(cookies.token)
		if (existingToken) request.locals.user = db.users.get(existingToken.email)
	}
	return await resolve(request);
}

export const getSession: GetSession = (request) => {
	return request.locals.user ? {
		user: {email: request.locals.user.email}
	} : {}
}