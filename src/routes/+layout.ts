/**
 * @fileoverview Root layout module setup for all routes.
 */
import '$lib/imports';
import { isBrowser, createServerClient, createBrowserClient } from '@supabase/ssr';

export const load = async (event) => {
	event.depends('supabase:auth');
	const supabase = isBrowser()
		? createBrowserClient(__APP_ENV__.supabase.url, __APP_ENV__.supabase.public_key, {
				global: {
					fetch: event.fetch
				},
				auth: {
					flowType: 'pkce',
				},
				cookies: {
					getAll: () => {
						const cookies = document.cookie.split('; ').map(cookieStr => {
							const [name, ...rest] = cookieStr.split('=');
							return { name, value: rest.join('=') };
						});
						return cookies;
					},
					setAll: (cookies) => {
						for (const cookie of cookies) {
							document.cookie = `${cookie.name}=${cookie.value}; path=/;`;
							// terminal.debug(`Set cookie: ${cookie.name}=${cookie.value}`);
						}
					}
				}
			})
		: createServerClient(__APP_ENV__.supabase.url, __APP_ENV__.supabase.public_key, {
				global: {
					fetch: event.fetch
				},
				cookies: {
					getAll: () => event.data.cookies,
				},
				auth: {
					flowType: 'pkce',
				}
			});

	const {
		data: { session },
		error
	} = await supabase.auth.getSession();
	if (error) {
		console.error('Error fetching session:', error);
	}
	return {
		supabase,
		session
	};
};
