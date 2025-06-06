/** @format */

import type { APIRoute } from 'astro';
import { getCollection, getEntry } from 'astro:content';

export const prerender = false; // Disable prerendering for this route

export const GET: APIRoute = async ({ request }) => {
	const posts = await getCollection('blog');

	const url = new URL(request.url);
	const slug = url.searchParams.get('slug');

	if (slug) {
		//const post = posts.find((post) => post.id === slug);
		const post = await getEntry('blog', slug);
		if (post) {
			return new Response(JSON.stringify(post), {
				status: 200,
				headers: {
					'Content-Type': 'application/json',
				},
			});
		}

		return new Response(JSON.stringify({ msg: `Post ${slug} not found` }), {
			status: 404,
		});
	}

	return new Response(JSON.stringify(posts), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};
