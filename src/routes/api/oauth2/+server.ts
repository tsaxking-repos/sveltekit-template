export const GET = async (event) => {
  const { error } =
    await event.locals.supabase.auth.exchangeCodeForSession(event.url.href);

  if (error) throw error;

  return new Response(null, {
    status: 302,
    headers: { Location: '/' }
  });
};