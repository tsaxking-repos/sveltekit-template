import { error } from '@sveltejs/kit';

export const load = async (event) => {
    const parent = await event.parent();

    if (!parent.is_admin) {
        throw error(403, 'Forbidden');
    }
}