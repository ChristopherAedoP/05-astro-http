/** @format */

import type { APIRoute } from 'astro';
import { Clients, db, eq } from 'astro:db';

export const prerender = false; // Disable prerendering for this route

export const GET: APIRoute = async ({ params, request }) => {
	const clientId = params.clientId ?? '';

	const Client = await db
		.select()
		.from(Clients)
		.where(eq(Clients.id, +clientId));

	if (Client.length === 0) {
		return new Response(
			JSON.stringify({ msg: `client with id ${clientId} not found` }),
			{
				status: 404,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}
	return new Response(JSON.stringify(Client.at(0)), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};

export const PATCH: APIRoute = async ({ params, request }) => {
	const clientId = params.clientId ?? '';
	console.log(clientId);
	try {
		const { ...body } = await request.json();

		const results = await db
			.update(Clients)
			.set(body)
			.where(eq(Clients.id, +clientId));
		console.log(results);

		const UpdatedClient = await db
			.select()
			.from(Clients)
			.where(eq(Clients.id, +clientId));
		console.log(UpdatedClient);

		return new Response(JSON.stringify(UpdatedClient), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		return new Response(JSON.stringify(error), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
};

export const DELETE: APIRoute = async ({ params, request }) => {
	const clientId = (params.clientId = '');

	const { rowsAffected } = await db
		.delete(Clients)
		.where(eq(Clients.id, +clientId));

	if (rowsAffected > 0) {
		return new Response(
			JSON.stringify({
				msg: `Delete`,
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}

	return new Response(
		JSON.stringify({
			msg: `Client with id ${clientId} not found.`,
		}),
		{
			status: 404,
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);
};
