/** @format */

import { z } from 'astro/zod';
import { actions, defineAction } from 'astro:actions';
import { db, Posts, eq } from 'astro:db';

export const updatePostLikes = defineAction({
	input: z.object({
		postId: z.string(),
		increment: z.number().default(0),
	}),
	handler: async ({ postId, increment }) => {
		try {
			// const { data, error } = await actions.getPostLikes(postId);

			// if (error) {
			// 	console.log(error);
			// 	throw new Error('Algo salio mal');
			// }

			// console.log('data', data);
			// const { exists, likes } = data;

			// if (!exists) {
			// 	const newPost = {
			// 		id: postId,
			// 		title: 'Post not found',
			// 		likes: 0,
			// 	};

			// 	await db.insert(Posts).values(newPost);
			// }

			// await db
			// 	.update(Posts)
			// 	.set({ likes: likes + increment })
			// 	.where(eq(Posts.id, postId));

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
			post.likes = post?.likes + increment;

			const results = await db
				.update(Posts)
				.set(post)
				.where(eq(Posts.id, postId));

			console.log('results:', results);				

		} catch (error) {
			console.log('error:', error);
		}
		return true;
	},
});
