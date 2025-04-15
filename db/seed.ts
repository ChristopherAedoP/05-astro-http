/** @format */

import { getCollection } from 'astro:content';
import { Clients, Posts, db } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
	await db.insert(Clients).values([
		{ id: 1, name: 'Chris', age: 40, isActive: true },
		{ id: 2, name: 'Khalid', age: 35, isActive: true },
		{ id: 3, name: 'Ali', age: 30, isActive: true },
		{ id: 4, name: 'Ahmed', age: 25, isActive: false },
	]);

	const posts = await getCollection('blog');

	await db.insert(Posts).values(
		posts.map((p) => ({
			id: p.id,
			title: p.data.title,
			likes: Math.round(Math.random() * 100),
		}))
	);

	console.log('seed build');
}
