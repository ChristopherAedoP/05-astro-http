/** @format */

import { z } from 'astro/zod';
import {  defineAction } from 'astro:actions';

export const getGreeting = defineAction({
	input: z.object({
		name: z.string(),
		age: z.number(),
		isActive: z.boolean(),
	}),
	handler: async ({ name, age, isActive }) => {
		console.log(name, age, isActive);
		return `Hello, ${name}!`;
	},
});

