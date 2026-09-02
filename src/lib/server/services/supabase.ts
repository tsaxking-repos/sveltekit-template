import { createClient } from '@supabase/supabase-js';
import { type Database } from '../../types/supabase';
import env from '../utils/env';

type ServerSupabaseClient = ReturnType<typeof createClient<Database>> & {
	serviceRole: true;
};

let cachedClient: ServerSupabaseClient | null = null;

const getClient = () => {
	if (cachedClient) return cachedClient;
	const skipValidation = process.env.SKIP_ENV_VALIDATION === '1';

	const projectUrl = (() => {
		if (!skipValidation) return env.SB_PROJECT_URL;
		try {
			new URL(env.SB_PROJECT_URL);
			return env.SB_PROJECT_URL;
		} catch {
			return 'http://localhost';
		}
	})();

	const secretKey = skipValidation && !env.SB_SECRET_KEY ? 'build' : env.SB_SECRET_KEY;

	cachedClient = Object.assign(createClient<Database>(projectUrl, secretKey, {}), {
		serviceRole: true as const
	});

	return cachedClient;
};

const supabase = new Proxy({} as ServerSupabaseClient, {
	get(_target, prop, receiver) {
		return Reflect.get(getClient(), prop, receiver);
	},
	set(_target, prop, value, receiver) {
		return Reflect.set(getClient(), prop, value, receiver);
	},
	has(_target, prop) {
		return Reflect.has(getClient(), prop);
	},
	ownKeys() {
		return Reflect.ownKeys(getClient());
	},
	getOwnPropertyDescriptor(_target, prop) {
		return Reflect.getOwnPropertyDescriptor(getClient(), prop);
	}
}) as ServerSupabaseClient;

export default supabase;
