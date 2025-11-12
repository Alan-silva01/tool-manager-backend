// HMAC-SHA256 signature for webhook authentication
const WEBHOOK_SECRET = 'your-secure-webhook-secret-key-2024';

export async function signWebhookPayload(payload: any): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payload));
  
  const keyData = encoder.encode(WEBHOOK_SECRET);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, data);
  
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function getAuthHeaders(signature: string): Record<string, string> {
  return {
    'X-Webhook-Signature': signature,
    'Content-Type': 'application/json',
  };
}
