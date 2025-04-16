/** @format */

import type { APIRoute } from 'astro';
import { db, eq, Posts } from 'astro:db';

export const prerender = false; // Disable prerendering for this route

export const GET: APIRoute = async ({ params }) => {
	const postId = params.id ?? '';

	const post = await db.select().from(Posts).where(eq(Posts.id, postId));

	if (post.length === 0) {
		const post = {
			id: postId,
			title: 'Post not found',
			likes: 0,
		};
		return new Response(JSON.stringify(post), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	return new Response(JSON.stringify(post.at(0)), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};

export const PUT: APIRoute = async ({ params, request }) => {
	const postId = params.id ?? '';
	const { likes = 0 } = await request.json();

	const posts = await db.select().from(Posts).where(eq(Posts.id, postId));

	if (posts.length === 0) {
		const newPost = {
			id: postId,
			title: 'Post not found',
			likes: 0,
		};

		await db.insert(Posts).values(newPost);
		posts.push(newPost);
	}

	const post = posts.at(0)!;
	post.likes = post?.likes + likes;

	const results = await db.update(Posts).set(post).where(eq(Posts.id, postId));

	console.log('results', results);

	return new Response('OK', {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};
