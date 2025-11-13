// Supabase Edge Function: send-webhook
// Forwards multipart/form-data payloads to N8N avoiding browser CORS issues
// It accepts JSON { url, data } and posts FormData to the given url

// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders: HeadersInit = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { url, data } = await req.json();

    if (!url || !data) {
      return new Response(JSON.stringify({ error: "Missing url or data" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Sending webhook to: ${url}`, data);

    const form = new FormData();
    Object.entries(data as Record<string, any>).forEach(([k, v]) => {
      form.append(k, String(v));
    });

    let res = await fetch(String(url), {
      method: "POST",
      body: form,
    });

    let bodyText = await res.text().catch(() => "");
    console.log(`Webhook response: ${res.status}`, bodyText);

    // Fallback automático para N8N quando o workflow de produção não está ativo
    // Tenta /webhook-test/ se /webhook/ responder 404 (não registrado)
    if (res.status === 404 && String(url).includes('/webhook/')) {
      const fallbackUrl = String(url).replace('/webhook/', '/webhook-test/');
      console.log(`Primary webhook returned 404, retrying with test URL: ${fallbackUrl}`);
      res = await fetch(fallbackUrl, { method: 'POST', body: form });
      bodyText = await res.text().catch(() => "");
      console.log(`Fallback webhook response: ${res.status}`, bodyText);
    }

    return new Response(
      JSON.stringify({ ok: res.ok, status: res.status, body: bodyText }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Error sending webhook:", e);
    return new Response(JSON.stringify({ ok: false, error: String(e?.message || e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
