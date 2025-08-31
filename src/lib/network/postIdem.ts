// Idempotent POST helper for preventing duplicate requests
export const postIdem = async (
  path: string,
  body: Record<string, any>,
  resourceKey: string
): Promise<Response> => {
  const fullPath = path.startsWith('/api') ? path : `/api${path}`;
  
  return fetch(fullPath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': resourceKey,
    },
    body: JSON.stringify(body),
  });
};