export function isDirectNotFoundPath(pathname: string): boolean {
  return pathname === '/404' || pathname === '/404/';
}

export function withNotFoundStatus(response: Response): Response {
  if (response.status === 404) {
    return response;
  }
  return new Response(response.body, {
    status: 404,
    statusText: 'Not Found',
    headers: response.headers,
  });
}

export async function fetchDirectNotFound(
  request: Request,
  assets: { fetch: (input: Request | URL | string) => Promise<Response> }
): Promise<Response> {
  const asset = await assets.fetch(new URL('/404', request.url));
  return withNotFoundStatus(asset);
}
