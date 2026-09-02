// See https://svelte.dev/docs/kit/types#app.d.ts

import type { createServerClient } from '@supabase/ssr';
import type { DB } from '$lib/types/supabase';
import type { SupaStructData } from '$lib/services/supabase/supastruct.svelte';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			start: number;
			supabase: ReturnType<typeof createServerClient<DB>> & { serviceRole: boolean };
			session: SupaStructData<'core', 'session'> | null;
		}
	}
}

export {};
