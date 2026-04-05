export const prerender = false;

export function GET({ url }: { url: URL }) {
  const shouldThrow = url.searchParams.get('throw') === '1';

  if (!shouldThrow) {
    return new Response('ok\n', {
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  throw new Error('Sentry test error from /api/sentry-test');
}
